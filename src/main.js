// @flow
import path from 'path';
import co from 'co';
import { PNG } from 'pngjs';

import getElementStyles from './getElementStyles';
import disableProperty from './disableProperty';
import screenshotPage from './screenshot';
import createDiffer from './pdiff';

function diffRuleMatches (
  instance: Object,
  options: Object,
  ruleMatches: RuleMatch[]
): Promise<Object[]> {
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
    const diffScores = [];

    /**
     * Iterate over each RuleMatch and toggle its styles
     */
    for (const rm: RuleMatch of ruleMatches) {
      const rmRuleStyle: CSSStyle = rm.rule.style;
      const props: CSSProperty[] = rmRuleStyle.cssProperties;

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
          path.resolve(screenshotDirPath, `${prop.name}.png`)
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

        diffScores.push([prop.name, diff]);
      }
    }

    return diffScores;
  });
}


/**
 * Function to execute once the page loads in Canary.
 */
export default function main (instance, options) {
  return getElementStyles(instance, options)
    .then((rm) => diffRuleMatches(instance, options, rm))
    .then((res) => console.log(JSON.stringify(res, null, 0)))
    .then(() => instance.close())
    .catch((err) => console.error(err));
}
