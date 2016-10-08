import getElementStyles from './getElementStyles';
import toggleElementStyles from './toggleElementStyles';

export default function main (instance, options) {
  return getElementStyles(instance, options)
    .then((rules) => toggleElementStyles(instance, options, rules))
    .then((res) => console.log(JSON.stringify(res, null, 4)))
    .then(() => instance.close())
    .catch((err) => console.error(err));
}
