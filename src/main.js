// @flow
import fs from 'fs';
import co from 'co';
import getElementStyles from './getElementStyles';
import disableProperty from './disableProperty';
import screenshotPage from './screenshotPage';
import { fileToPNG, stringToPNG, createDiffer, writeScreenshot } from './pdiff';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

function diffRuleMatches (
  instance: Object,
  options: Object,
  ruleMatches: RuleMatch[]
): Promise<Object[]> {
  return co(function* () {
    /**
     * Capture and write the base screenshot for comparison.
     */
    const baseShot: string = yield screenshotPage(instance);
    const basePNG: PNG = yield stringToPNG(baseShot);

    // Write base screenshot to disk if `options.writeScreenshots` is true
    if (options.writeScreenshots) {
      writeScreenshot(options.screenshotDir, 'base.png', baseShot);
    }

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

        // Screenshot the page, optionally writing to disk
        const shot: string = yield screenshotPage(instance);
        const comparisonPNG: PNG = yield stringToPNG(shot);

        if (options.writeScreenshots) {
          writeScreenshot(
            options.screenshotDir,
            `${prop.name}.png`,
            shot,
          );
        }

        // Write target for the pdiff image
        const diffPNG: PNG = new PNG({ width: basePNG.width, height: basePNG.height });

        const diffSize = pixelmatch(
          basePNG.data,
          comparisonPNG.data,
          diffPNG.data,
          basePNG.width,
          basePNG.height,
          { threshold: 0.2 }
        );

        if (options.writeScreenshots) {
          writeScreenshot(
            options.screenshotDir,
            `${propName}-diff.png`,
            diffPNG,
          );
        }

        console.log(prop.name, diffSize);

        // Re-enable everything
        const [ diff ] = yield Promise.all([
          diffSize,
          reenabler(),
        ]);

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
    // .then(captureScreenshot.bind(null, instance, 'after'))
    // .then(() => instance.close())
    .catch((err) => console.error(err));
}
