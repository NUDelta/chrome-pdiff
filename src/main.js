// @flow
import fs from 'fs';
import co from 'co';
import getElementStyles from './getElementStyles';
import disableProperty from './disableProperty';
import screenshotPage from './screenshotPage';
import { fileToPNG, stringToPNG, createDiffer } from './pdiff';

/**
 * Function to execute once the page loads in Canary.
 */
export default function main (instance, options) {
  return getElementStyles.call(null, instance, options)
    .then((rm) => {
      console.log('rm');
      console.log(rm);
      // console.log(rm.matchedCSSRules[1].rule.style);
      return rm.matchedCSSRules[1].rule.style;
    })
    .then((style) => {
      return co(function* () {

        // Capture and write the base screenshot for comparison.
        const baseShot = yield screenshotPage(instance);
        fs.writeFile('../screenshots/base.png', baseShot, { encoding: 'base64' });

        const differ = yield createDiffer(baseShot);

        const props = style.cssProperties;
        const diffScores = [];

        /**
         * Iterate over props and toggle/screenshot each.
         */
        for (let prop of props) {
          const propName = prop.name;

          if (!prop.text) {
            diffScores.push(null);
            break;
          }

          const reenabler = yield disableProperty(instance, style, propName);
          const shot = yield screenshotPage(instance);

          // Write the "before" screenshot to disk.
          fs.writeFile(`../screenshots/${prop.name}.png`, shot, { encoding: 'base64' });

          const [ diff ] = yield Promise.all([
            differ(shot, true, `../screenshots/${prop.name}-diff.png`),
            reenabler(),
          ]);

          diffScores.push([prop.name, diff]);
        }

        diffScores.push(['identity', differ(baseShot, true, '../screenshots/identity.png')]);

        return diffScores;
      });
    })
    .then((res) => console.log(JSON.stringify(res, null, 2)))
    .then(() => instance.close())
    // .then(captureScreenshot.bind(null, instance, 'after'))
    // .then(() => instance.close())
    .catch((err) => console.error(err));
}
