import path from 'path';
import disableProperty from '../chrome/disableProperty';
import screenshotPage from '../chrome/screenshot';
import createDiffer from './pdiff';

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

export default async function diffRuleMatches (instance: Object, options: Object, ruleMatches: RuleMatch[]): Promise<DiffResults> {
  // Base path for all screenshots
  const screenshotDirPath: string = path.resolve(__dirname, '../../', options.screenshotDir);

  /**
   * Capture and write the base screenshot for comparison.
   */
  const basePNG: PNG = await screenshotPage(instance, options.writeScreenshots, path.resolve(screenshotDirPath, 'base.png'));

  const differ = await createDiffer(basePNG);

  // Collect diff scores
  const cssRules = {};

  /**
   * Iterate over each RuleMatch and toggle its styles
   */
  for (const rm: RuleMatch of ruleMatches) {
    const rmRuleStyle: CSSStyle = rm.rule.style;
    const selectorString: string = rm.rule.selectorList.text;

    console.log(JSON.stringify(selectorString, null, 2));

    // Collect the diff for this rule
    const rmDiff: DiffResults = {};

    /**
     * Iterate over props and toggle/screenshot each.
     */
    const props: CSSProperty[] = rmRuleStyle.cssProperties;

    for (const prop of props) {
      const propName = prop.name;

      // Disable the property and save the reenabler function
      const reenabler: () => Promise<CSSStyle> = await disableProperty(instance, rmRuleStyle, propName);

      // Only continue of the property is not browser-prefixed
      const prefix: RegExp = /^-webkit-/;

      if (!prefix.test(propName)) {
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
      } else {
        // If it's a browser-prefixed property, keep disabled and continue loop
        console.log(`Disabled browser-prefixed property ${propName}`);
      }
    }

    // Add the diff results for this rule to the structure-preserving cssRules object.
    cssRules[selectorString] = rmDiff;
  }

  console.log(JSON.stringify(cssRules, null, 2));

  const normalized: DiffResults = {};

  for (const [ selector, dr ] of Object.entries(cssRules)) {
    normalized[selector] = normalizeScores(dr);
  }

  return normalized;
}
