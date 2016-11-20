// @flow
import path from 'path';
import { PNG } from 'pngjs';
import { applyPseudoStates } from './preparePage';
import { getElementStyles, getDocumentRootId } from './elements';
import disableProperty from './disableProperty';
import screenshotPage from './screenshot';
import createDiffer from './pdiff';

async function diffRuleMatches (instance: Object, options: Object, ruleMatches: RuleMatch[]): Promise<DiffResults> {
  // Base path for all screenshots
  const screenshotDirPath: string = path.resolve(__dirname, '../', options.screenshotDir);

  /**
   * Capture and write the base screenshot for comparison.
   */
  const basePNG: PNG = await screenshotPage(instance, options.writeScreenshots, path.resolve(screenshotDirPath, 'base.png'));

  const differ = await createDiffer(basePNG);

  // Collect diff scores
  // TODO: replace with a heap (or some other way to keep track of the sorting)
  const diffScores: DiffResults = {};

  // Also collect the rule structure
  const cssRules = {};

  /**
   * Iterate over each RuleMatch and toggle its styles
   */
  for (const rm: RuleMatch of ruleMatches) {
    const rmRuleStyle: CSSStyle = rm.rule.style;
    const selectorString: string = rm.rule.selectorList.text;

    console.log(JSON.stringify(selectorString, null, 4));

    // Collect the diff for this rule
    const rmDiff: DiffResults = {};

    /**
     * Iterate over props and toggle/screenshot each.
     */
    const props: CSSProperty[] = rmRuleStyle.cssProperties;

    for (let prop of props) {
      const propName = prop.name;

      // Disable the property and save the reenabler function
      const reenabler: () => Promise<CSSStyle> = await disableProperty(instance, rmRuleStyle, propName);

      // Screenshot page
      const comparisonPNG: PNG = await screenshotPage(
        instance,
        options.writeScreenshots,
        path.resolve(screenshotDirPath, `${prop.name}.png`),
      );

      // Re-enable and compute diff simultaneously
      const [ diff ] = await Promise.all([
        differ(
          comparisonPNG,
          options.writeScreenshots || prop.name === 'background-repeat-x' || prop.name === 'transition-duration',
          path.resolve(screenshotDirPath, `${prop.name}-diff.png`)
        ),
        reenabler(),
      ]);

      console.log(prop.name, diff);

      // Add the result for this prop to the rmDiff object for this rule block
      rmDiff[prop.name] = diff;
    }

    // Add the diff results for this rule to the structure-preserving cssRules object.
    cssRules[selectorString] = rmDiff;
  }

  return cssRules;
}

/**
 * Iterate over the diff results and return an ordering of normalized prop-diff pairs.
 * @param  {DiffResults} propDiffs   map from properties to pdiff scores
 * @return {DiffPair[]}              pairs ordered from largest to smallest score
 */
function normalizeScores (propDiffs: DiffResults): DiffResults {
  const props: string[] = Object.keys(propDiffs);

  // First compute the max pdiff value
  const allScores: number[] = props.map(k => propDiffs[k]);
  const maxScore: number = Math.max.apply(null, allScores);
  const minScore: number = Math.min.apply(null, allScores);
  const range: number = maxScore - minScore;

  // console.log(Object.entries(propDiffs).find(pair => pair[1] === maxScore));
  // console.log(Object.entries(propDiffs).find(pair => pair[1] === minScore));

  // Normalize everything
  const normalized: DiffResults = {};

  for (const [ prop: string, score: number ] of Object.entries(propDiffs)) {
    const normalizedScore: number = range > 0
      ? (score - minScore) / range
      : 0;

    normalized[prop] = normalizedScore;
  }

  return normalized;
}

/**
 * Function to execute once the page loads in Canary.
 */
export default async function main (instance, options) {
  debugger;

  // Get root node
  const rootId: number = await getDocumentRootId(instance);

  // Apply pseudo-states
  const pseudoStates = await applyPseudoStates(instance, rootId, options);

  // Get element styles
  const ruleMatches: RuleMatch[] = await getElementStyles(instance, rootId, options);

  // Diff everything
  const cssRules: DiffResults = await diffRuleMatches(instance, options, ruleMatches);
  console.log(JSON.stringify(cssRules, null, 2));

  const normalized: DiffResults = {};

  for (const [ selector, dr ] of Object.entries(cssRules)) {
    normalized[selector] = normalizeScores(dr);
  }

  console.log(JSON.stringify(normalized, null, 2));

  instance.close();
}
