// @flow
import path from 'path';
import { writeResults, makeSiteResultsDir } from './fileUtils';
import { getElementStyles, getDocumentRootId } from './chrome/elements';
import { applyPseudoStates } from './chrome/preparePage';
import screenshotPage from './chrome/screenshot';
import createDiffer from './diff/pdiff';
import { diffRuleMatches, normalizeScores } from './diff/processDiff';
import computeStatistics from './analyzeResults';

/**
 * Function to execute once the page loads in Canary.
 */
export default async function main (instance: Object, options: Object): Promise<> {
  console.log('\nProcessing example', options.title);
  /**
   * Prepare filesystem.
   */

  const [ resultsDir, rootId ]: [ string, number ] = await Promise.all([
    // Get base path for all results and output.
    makeSiteResultsDir(options.title, options.type, options.writeScreenshots && options.screenshotDir),

    // Get the root node.
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

  /**
   * Start the actual processing.
   */

  const baseScreenshotPath: string = path.resolve(screenshotDirPath, 'base.png');
  const { delay } = options;

  const [
    basePNG,
    ruleMatchesAndTotalProps,
  ]: [
    PNG,
    [ RuleMatch[], number ]
  ] = await Promise.all([
    // Take base screenshot.
    screenshotPage(instance, options.writeScreenshots, baseScreenshotPath, delay),

    // Get element styles.
    getElementStyles(instance, rootId, options),
  ]);

  // Destructure the output from getElementStyles
  const [
    ruleMatches,
    totalPropsBeforeFiltering,
  ]: [ RuleMatch[], number ] = ruleMatchesAndTotalProps;

  /**
   * Actually diff everything.
   */
  const { threshold } = options;
  const differ: Differ = await createDiffer(basePNG, threshold);

  const {
    ruleMatchDiffs: unnormalized,
    totalDiffScore,
    totalPropsBeforePruning,
    pruned: prunedProps,
  }: {
    ruleMatchDiffs: RuleMatchDiff[],
    totalDiffScore: number,
    totalPropsBeforePruning: number,
    pruned: string[],
  } = await diffRuleMatches(instance, options, ruleMatches, screenshotDirPath, differ);

  // Reverse `unnormalized` for ease of interpreting results.
  unnormalized.reverse();

  /**
   * Compute statistics.
   */
  const stats: Stats = computeStatistics(totalPropsBeforeFiltering, totalPropsBeforePruning, prunedProps);

  /**
   * Get the normalized output for each pair.
   */
  const normalized: RuleMatchDiff[] = [];

  for (const [ selector, dr ] of unnormalized) {
    normalized.push([ selector, normalizeScores(dr) ]);
  }

  const results = {
    ...stats,
    totalDiffScore,
    normalized,
    unnormalized,
  };

  writeResults(path.resolve(resultsDir, 'results.json'), results)
    .then(() => console.log(`Results written to disk at ${resultsDir}`));

  return instance.close();
}
