import fs from 'fs';
import co from 'co';
import getElementStyles from './getElementStyles';
import disableProperty from './disableProperty';
import screenshotPage from './screenshotPage';
import createDiffer from './pdiff';

export default function main (instance, options) {
  return Promise.resolve(instance)
    .then(getElementStyles.bind(null, instance, options))
    .then((rm) => {
      // console.log(rm.matchedCSSRules[1].rule.style);
      return rm.matchedCSSRules[1].rule.style;
    })
    .then((style) => {
      return co(function* () {
        const baseShot = yield screenshotPage(instance);
        fs.writeFile(`../screenshots/base.png`, baseShot, { encoding: 'base64' });

        const differ = yield createDiffer(baseShot);

        const props = style.cssProperties;
        const diffScores = [];

        for (let prop of props) {
          const propName = prop.name;

          if (!prop.text) {
            diffScores.push(null);
            break;
          }

          const reenabler = yield disableProperty(instance, style, propName);
          const shot = yield screenshotPage(instance);

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
    .then((res) => console.log(JSON.stringify(res, null, 4)))
    .then(() => instance.close())
    // .then(captureScreenshot.bind(null, instance, 'after'))
    // .then(() => instance.close())
    .catch((err) => console.error(err));
}