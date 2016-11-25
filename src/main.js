// @flow
import path from 'path';
import { writeResults, makeSiteResultsDir } from './fileUtils';
import { getElementStyles, getDocumentRootId } from './chrome/elements';
import { applyPseudoStates } from './chrome/preparePage';
import screenshotPage from './chrome/screenshot';
import createDiffer from './diff/pdiff';
import { diffRuleMatches, normalizeScores } from './diff/processDiff';

/**
 * Function to execute once the page loads in Canary.
 */
export default async function main (instance: Object, options: Object): Promise<> {
  /**
   * Process these simultaneously to avoid blocking.
   * - Get base path for all results and output.
   * - Get the root node.
   */
  const [ resultsDir, rootId ]: [ string, number ] = await Promise.all([
    makeSiteResultsDir(options.title, options.type, options.writeScreenshots && options.screenshotDir),
    getDocumentRootId(instance),
  ]);

  // Now build the screenshot subdirectory path from the results directory.
  const screenshotDirPath: string = path.resolve(resultsDir, options.screenshotDir);

  // Apply pseudo-states
  if (options.pseudoStatesToForce && options.pseudoStatesToForce.length) {
    await applyPseudoStates(instance, rootId, options);
  }

  /**
   * Process these simultaneously to avoid blocking:
   * - Take base screenshot.
   * - Get element styles.
   */
  const baseScreenshotPath: string = path.resolve(screenshotDirPath, 'base.png');
  const { delay } = options;

  const [ basePNG, ruleMatches ]: [ PNG, RuleMatch[] ] = await Promise.all([
    screenshotPage(instance, options.writeScreenshots, baseScreenshotPath, delay),
    getElementStyles(instance, rootId, options),
  ]);

  /**
   * Actually diff everything.
   */
  const { threshold } = options;
  const differ: Differ = await createDiffer(basePNG, threshold);
  const {
    ruleMatchDiffs: unnormalized,
    total,
  }: {
    ruleMatchDiffs: RuleMatchDiff[],
    total: number
  } = await diffRuleMatches(instance, options, ruleMatches, screenshotDirPath, differ);

  /**
   * Get the normalized output for each pair.
   */
  const normalized: RuleMatchDiff[] = [];

  for (const [ selector, dr ] of unnormalized) {
    normalized.push([ selector, normalizeScores(dr) ]);
  }

  const results = {
    total,
    normalized,
    unnormalized,
  };

  writeResults(path.resolve(resultsDir, 'results.json'), results)
    .then(() => console.log(`Results written to disk at ${resultsDir}`));

  instance.close();
}
