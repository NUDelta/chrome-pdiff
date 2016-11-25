// @flow
import path from 'path';
import disableProperty from '../chrome/disableProperty';
import screenshotPage from '../chrome/screenshot';

/**
 * Iterate over the diff results and return an ordering of normalized prop-diff pairs.
 */
export function normalizeScores (propDiffs: CSSStyleDiff): CSSStyleDiff {
  const props: string[] = Object.keys(propDiffs);

  // First compute the max pdiff value
  const allScores: number[] = props.map(k => propDiffs[k]);
  const maxScore: number = Math.max.apply(null, allScores);
  const minScore: number = Math.min.apply(null, allScores);
  const range: number = maxScore - minScore;

  // console.log(Object.entries(propDiffs).find(pair => pair[1] === maxScore));
  // console.log(Object.entries(propDiffs).find(pair => pair[1] === minScore));

  // Normalize everything
  const normalized: CSSStyleDiff = {};

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
  instance: Object, options: Object, ruleMatches: RuleMatch[], screenshotDirPath: string, differ: Differ
): Promise<{ ruleMatchDiffs: RuleMatchDiff[], total: number }> {
  // Collect diff scores
  const cssRules: RuleMatchDiff[] = [];
  let totalDiffScore: number = 0;

  /**
   * Iterate over each RuleMatch and toggle its styles
   */
  for (const rm: RuleMatch of ruleMatches) {
    const rmRuleStyle: CSSStyle = rm.rule.style;

    // Collect the diff for this rule
    const rmDiff: CSSStyleDiff = {};

    /**
     * Want to extract just the matched selector from the RuleMatch
     * selector string.
     */
    const matchingSelectorIndices: number[] = rm.matchingSelectors;
    const selectors: Value[] = rm.rule.selectorList.selectors;
    const selectorString: string = matchingSelectorIndices.map(i => selectors[i].text)
      .join(', ');

    /**
     * Iterate over props and toggle/screenshot each.
     */
    const props: CSSProperty[] = rmRuleStyle.cssProperties;

    for (const prop of props) {
      const propName = prop.name;
      console.log(propName);

      // Disable the property and save the reenabler function
      const reenabler: (() => Promise<CSSStyle>) | Error = await disableProperty(instance, rmRuleStyle, propName);

      if (reenabler instanceof Error) {
        console.error('\t', reenabler);
        continue;  // eslint-disable-line no-continue
      }

      // TODO: Currently doesn't work with browser prefixed properties.

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
          path.resolve(screenshotDirPath, `${propName}-diff.png`)
        ),
        reenabler(),
      ]);

      // Add to the running count of diff size.
      totalDiffScore += diff;

      console.log('\t', diff);

      /**
       * If the diff value was zero pixels, don't include it in the rmDiff.
       * Otherwise, add the result for this prop to the rmDiff for this rule block.
       */
      if (diff !== 0) {
        rmDiff[propName] = diff;
      } else {
        console.log(`Property ${propName} returned a diff of 0 pixels`);
      }
    }

    // Add the diff results for this rule to the structure-preserving cssRules list.
    cssRules.push([ selectorString, rmDiff ]);
  }

  console.log('Total diff score:', totalDiffScore);

  return {
    ruleMatchDiffs: cssRules,
    total: totalDiffScore,
  };
}
