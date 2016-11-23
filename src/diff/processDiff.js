import path from 'path';
import disableProperty from '../chrome/disableProperty';
import screenshotPage from '../chrome/screenshot';
import createDiffer from './pdiff';

/**
 * Iterate over the diff results and return an ordering of normalized prop-diff pairs.
 */
export function normalizeScores (propDiffs: DiffResults): DiffResults {
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
 * Main function to iterate over all the RuleMatches for a particular node,
 * screenshotting each change and computing the diff.
 */
export async function diffRuleMatches (
  instance: Object, options: Object, ruleMatches: RuleMatch[]
): Promise<[ string, DiffResults ][]> {
  // Base path for all screenshots
  const screenshotDirPath: string = path.resolve(__dirname, '../../', options.screenshotDir);

  /**
   * Capture and write the base screenshot for comparison.
   */
  const basePNG: PNG = await screenshotPage(instance, options.writeScreenshots, path.resolve(screenshotDirPath, 'base.png'));

  const differ = await createDiffer(basePNG);

  // Collect diff scores
  const cssRules: [ string, DiffResults ][] = [];

  /**
   * Iterate over each RuleMatch and toggle its styles
   */
  for (const rm: RuleMatch of ruleMatches) {
    const rmRuleStyle: CSSStyle = rm.rule.style;

    // Collect the diff for this rule
    const rmDiff: DiffResults = {};

    /**
     * Want to extract just the matched selector from the RuleMatch
     * selector string.
     */
    const matchingSelectorIndices: number = rm.matchingSelectors;
    const selectors: Value[] = rm.rule.selectorList.selectors;
    const selectorString: string = matchingSelectorIndices.map(i => selectors[i].text)
      .join(', ');

    /**
     * Iterate over props and toggle/screenshot each.
     */
    const props: CSSProperty[] = rmRuleStyle.cssProperties;

    for (const prop of props) {
      const propName = prop.name;

      // Disable the property and save the reenabler function
      const reenabler: () => Promise<CSSStyle> = await disableProperty(instance, rmRuleStyle, propName);

      // Only continue if prop isn't browser-prefixed. If so, keep disabled and continue loop
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
            options.writeScreenshots,
            path.resolve(screenshotDirPath, `${prop.name}-diff.png`)
          ),
          reenabler(),
        ]);

        // console.log(prop.name, diff);

        // Add the result for this prop to the rmDiff for this rule block
        rmDiff[prop.name] = diff;
      } else {
        // If it's a browser-prefixed property, keep disabled and continue loop
        console.log(`Disabled browser-prefixed property ${propName}`);
      }
    }

    // Add the diff results for this rule to the structure-preserving cssRules list.
    cssRules.push([ selectorString, rmDiff ]);
  }

  console.log(JSON.stringify(cssRules, null, 2));

  return cssRules;
}
