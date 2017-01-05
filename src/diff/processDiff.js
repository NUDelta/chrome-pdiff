// @flow
import path from 'path';
import disableProperty from '../chrome/disableProperty';
import screenshotPage from '../chrome/screenshot';

/**
 * Iterate over the diff results and return an ordering of normalized prop-diff pairs.
 */
export function normalizeScores (propDiffs: CSSStyleDiff): CSSStyleDiff {
  const props: string[] = Object.keys(propDiffs);

  // First compute the min and max positivepdiff value
  const positiveScores: number[] = props.map(k => propDiffs[k])
    .filter(s => s > 0);

  const maxScore: number = Math.max.apply(null, positiveScores);
  const minScore: number = Math.min.apply(null, positiveScores);
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
  instance: Object,
  options: Object,
  ruleMatches: RuleMatch[],
  screenshotDirPath: string,
  differ: Differ,
): Promise<{
  ruleMatchDiffs: RuleMatchDiff[],
  totalPropsBeforePruning: number,
  pruned: string[],
  totalDiffScore: number,
}> {
  // Collect diff scores
  const cssRules: RuleMatchDiff[] = [];
  let totalDiffScore: number = 0;
  let totalProps: number = 0;
  const removedProps: string[] = [];

  const { lowerBound } = options;

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
      totalProps += 1;

      const propName = prop.name;

      // Disable the property and save the reenabler function
      const reenabler: (() => Promise<CSSStyle>) | Error = await disableProperty(instance, rmRuleStyle, propName);

      if (reenabler instanceof Error) {
        // Don't want to log as error if it was missing a SourceRange
        if (reenabler.message.indexOf('missing cssText or SourceRange') === -1) {
          console.error('\t', reenabler);
        } else {
          console.log('\t', reenabler.message);
        }
        continue;  // eslint-disable-line no-continue
      }

      // This is moved down here so that we don't log the name of a property that we're skipping.
      console.log(propName);

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

      /**
       * If the diff value was zero pixels, don't include it in the rmDiff.
       * Otherwise, add the result for this prop to the rmDiff for this rule block.
       */
      if (diff > lowerBound) {
        rmDiff[propName] = diff;
        console.log('\t', diff);
      } else {
        rmDiff[propName] = -1;
        removedProps.push(propName);

        console.log(`\tProperty ${propName} returned a diff below the lower bound of ${lowerBound}`);
      }
    }

    // Add the diff results for this rule to the structure-preserving cssRules list.
    cssRules.push([ selectorString, rmDiff ]);
  }

  return {
    ruleMatchDiffs: cssRules,
    totalPropsBeforePruning: totalProps,
    totalDiffScore,
    pruned: removedProps,
  };
}
