// @flow
import path from 'path';
import { writeResults, makeSiteResultsDir } from './fileUtils';
import { getElementStyles, getDocumentRootId, getChildren, getNodeId } from './chrome/elements';
import { applyPseudoStates } from './chrome/preparePage';
import screenshotPage from './chrome/screenshot';
import createDiffer from './diff/pdiff';
import { diffRuleMatches, normalizeScores } from './diff/processDiff';
import computeStatistics from './analyzeResults';

type NodeLike = { nodeId: number } & { children: Node[] };

async function depthFirstHelper (node: NodeLike, fn: Function): Promise<Object> {
  const result: Object = {};
  const hasClassName: boolean = Object.prototype.hasOwnProperty.call(node, 'attributes')
    && node.attributes.indexOf('class') !== -1;

  if (hasClassName) {
    const classNameIndex: number = node.attributes.indexOf('class');
    result.class = node.attributes[classNameIndex + 1];
    result.name = node.nodeName;
  }

  const currentResult: Object = await fn(node.nodeId);
  result.currentResult = currentResult;
  result.children = [];

  for (const child of node.children) {
    if (child.nodeName !== '#text') {
      const childResult: Object = await depthFirstHelper(child, fn);
      result.children.push(childResult);
    }
  }

  return result;
}

/**
 * Function to execute once the page loads in Canary.
 */
export default async function main (instance: Object, options: Object): Promise<> {
  /**
   * Prepare filesystem.
   */
  console.log('\nProcessing example', options.title);

  const [ resultsDir, rootId ]: [ string, number ] = await Promise.all([
    makeSiteResultsDir(options.title, options.type, options.writeScreenshots && options.screenshotDir),
    getDocumentRootId(instance),
  ]);

  // Now build the screenshot subdirectory path from the results directory.
  const screenshotDirPath: string = path.resolve(resultsDir, options.screenshotDir);

  /**
   * Prepare page for processing.
   */
  // Apply pseudo-states
  const shouldApplyPseudoStates: boolean = Object.prototype.hasOwnProperty.call(options, 'pseudoStatesToForce')
    && options.pseudoStatesToForce.length;

  if (shouldApplyPseudoStates) {
    await applyPseudoStates(instance, rootId, options);
  }

  const baseScreenshotPath: string = path.resolve(screenshotDirPath, 'base.png');
  const { delay } = options;
  const basePNG: PNG = await screenshotPage(instance, options.writeScreenshots, baseScreenshotPath, delay);

  /**
   * TODO: Refactor this to not be, like, a ginromous closure.
   */
  async function processNode (nodeId) {
    console.log(`NODE: ${nodeId}`);

    let ruleMatches: RuleMatch[];
    let totalPropsBeforeFiltering: number;

    try {
      [ ruleMatches, totalPropsBeforeFiltering ] = await getElementStyles(instance, rootId, nodeId, options);
    } catch (err) {
      debugger;
      console.error(err);
    }

    const { threshold } = options;
    const differ: Differ = await createDiffer(basePNG, threshold);

    const drmResult: Object = await diffRuleMatches(instance, options, ruleMatches, screenshotDirPath, differ);

    // This really should be destructured, but it's too verbose with Flow annotations
    const unnormalized: RuleMatchDiff[] = drmResult.ruleMatchDiffs;
    const totalDiffScore: number = drmResult.totalDiffScore;
    const totalPropsBeforePruning: number = drmResult.totalPropsBeforePruning;
    const prunedProps: string[] = drmResult.pruned;

    // Reverse `unnormalized` for ease of interpreting results.
    unnormalized.reverse();

    const stats: Stats = computeStatistics(totalPropsBeforeFiltering, totalPropsBeforePruning, prunedProps);

    const normalized: RuleMatchDiff[] = [];

    for (const [ selector, dr ] of unnormalized) {
      normalized.push([ selector, normalizeScores(dr) ]);
    }

    const results = {
      ...stats,
      totalDiffScore,
      unnormalized,
      normalized,
    };

    return results;
  }

  /**
   * Get starting node info.
   */
  const baseNodeId: number = await getNodeId(instance, rootId, options.selector);
  const baseNodeChildren: Node[] = await getChildren(instance, baseNodeId);
  const startingNodeLike: NodeLike = Object.assign({},
    { nodeId: baseNodeId },
    { children: baseNodeChildren }
  );

  const resultsTree: Object = await depthFirstHelper(startingNodeLike, processNode);

  // Add the base selector.
  resultsTree.selector = options.selector;

  writeResults(path.resolve(resultsDir, 'results.json'), resultsTree)
    .then(() => console.log(`Results written to disk at ${resultsDir}`));

  return instance.close();
}
