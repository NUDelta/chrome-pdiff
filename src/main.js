// @flow
import path from 'path';
import co from 'co';
import { PNG } from 'pngjs';

import getElementStyles from './getElementStyles';
import disableProperty from './disableProperty';
import screenshotPage from './screenshot';
import createDiffer from './pdiff';

type DiffResults = { [prop: string]: number };
type DiffPair = [ string, number ];

function diffRuleMatches (
  instance: Object,
  options: Object,
  ruleMatches: RuleMatch[]
): Promise<DiffResults> {
  return co(function* () {

    // Base path for all screenshots
    const screenshotDirPath: string = path.resolve(__dirname, '../', options.screenshotDir);

    /**
     * Capture and write the base screenshot for comparison.
     */
    const basePNG: PNG = yield screenshotPage(instance, true, path.resolve(screenshotDirPath, 'base.png'));

    const differ = yield createDiffer(basePNG);

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
      const props: CSSProperty[] = rmRuleStyle.cssProperties;

      console.log(JSON.stringify(rm.rule.selectorList.text, null, 4));

      const currentRm = {

      };

      /**
       * Iterate over props and toggle/screenshot each.
       */
      for (let prop of props) {
        const propName = prop.name;

        // Disable the property and save the reenabler function
        const reenabler: () => Promise<CSSStyle> = yield disableProperty(instance, rmRuleStyle, propName);

        // Screenshot page
        const comparisonPNG: PNG = yield screenshotPage(
          instance,
          options.writeScreenshots,
          path.resolve(screenshotDirPath, `${prop.name}.png`),
        );

        // Re-enable and compute diff simultaneously
        const [ diff ] = yield Promise.all([
          differ(
            comparisonPNG,
            options.writeScreenshots,
            path.resolve(screenshotDirPath, `${prop.name}-diff.png`)
          ),
          reenabler(),
        ]);

        console.log(prop.name, diff);

        diffScores[prop.name] = diff;
      }
    }

    return diffScores;
  });
}

/**
 * Iterate over the diff results and return an ordering of normalized prop-diff pairs.
 * @param  {DiffResults} propDiffs   map from properties to pdiff scores
 * @return {DiffPair[]}              pairs ordered from largest to smallest score
 */
function normalizeScores (propDiffs: DiffResults): DiffPair[] {
  // First compute the max pdiff value
  let maxScore: number = 0;

  const props: string[] = Object.keys(propDiffs);

  for (const prop of props) {
    if (propDiffs[prop] > maxScore) {
      maxScore = propDiffs[prop];
    }
  }

  /**
   * Given the max value, normalize the rest of the data
   */
  const normalized: DiffPair[] = [];

  for (const prop of props) {
    // If maxScore is still 0, just return the sorted list.
    if (maxScore > 0) {

    }

  }
}

// color                         127999
// height                       1262598
// left                           81288
// overflow                      137474
// position                      124006
// top                           130289
// text-align                    127999
// width                        1200443
// -webkit-transform             137537
// transform                     141342
// transition                    119614
// transition                    140787
// overflow-x                    113539
// overflow-y                    109058
// transition-duration           133669
// transition-timing-function    139477
// transition-delay               81288
// transition-property           128418
// color                         133420
// padding-top                   133897
// z-index                       139879


/**
 * Function to execute once the page loads in Canary.
 */
export default function main (instance, options) {
  return getElementStyles(instance, options)
    .then((rm) => diffRuleMatches(instance, options, rm))
    // .then(normalizeScores)
    .then((res) => console.log(JSON.stringify(res, null, 0)))
    .then(() => instance.close())
    .catch((err) => console.error(err));
}
