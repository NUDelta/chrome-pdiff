'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _disableProperty = require('../chrome/disableProperty');

var _disableProperty2 = _interopRequireDefault(_disableProperty);

var _screenshot = require('../chrome/screenshot');

var _screenshot2 = _interopRequireDefault(_screenshot);

var _pdiff = require('./pdiff');

var _pdiff2 = _interopRequireDefault(_pdiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Iterate over the diff results and return an ordering of normalized prop-diff pairs.
 * @param  {DiffResults} propDiffs   map from properties to pdiff scores
 * @return {DiffPair[]}              pairs ordered from largest to smallest score
 */
function normalizeScores(propDiffs) {
  var props = Object.keys(propDiffs);

  // First compute the max pdiff value
  var allScores = props.map(function (k) {
    return propDiffs[k];
  });
  var maxScore = Math.max.apply(null, allScores);
  var minScore = Math.min.apply(null, allScores);
  var range = maxScore - minScore;

  // console.log(Object.entries(propDiffs).find(pair => pair[1] === maxScore));
  // console.log(Object.entries(propDiffs).find(pair => pair[1] === minScore));

  // Normalize everything
  var normalized = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.entries(propDiffs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          prop = _step$value[0],
          score = _step$value[1];

      var normalizedScore = range > 0 ? (score - minScore) / range : 0;

      normalized[prop] = normalizedScore;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return normalized;
}

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(instance, options, ruleMatches) {
    var screenshotDirPath, basePNG, differ, cssRules, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, rm, rmRuleStyle, selectorString, rmDiff, props, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, prop, propName, reenabler, prefix, comparisonPNG, _ref2, _ref3, diff, normalized, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _step3$value, selector, dr;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Base path for all screenshots
            screenshotDirPath = _path2.default.resolve(__dirname, '../../', options.screenshotDir);

            /**
             * Capture and write the base screenshot for comparison.
             */

            _context.next = 3;
            return (0, _screenshot2.default)(instance, options.writeScreenshots, _path2.default.resolve(screenshotDirPath, 'base.png'));

          case 3:
            basePNG = _context.sent;
            _context.next = 6;
            return (0, _pdiff2.default)(basePNG);

          case 6:
            differ = _context.sent;


            // Collect diff scores
            cssRules = {};

            /**
             * Iterate over each RuleMatch and toggle its styles
             */

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 11;
            _iterator2 = ruleMatches[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 67;
              break;
            }

            rm = _step2.value;
            rmRuleStyle = rm.rule.style;
            selectorString = rm.rule.selectorList.text;


            console.log(JSON.stringify(selectorString, null, 2));

            // Collect the diff for this rule
            rmDiff = {};

            /**
             * Iterate over props and toggle/screenshot each.
             */

            props = rmRuleStyle.cssProperties;
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context.prev = 23;
            _iterator4 = props[Symbol.iterator]();

          case 25:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context.next = 49;
              break;
            }

            prop = _step4.value;
            propName = prop.name;

            // Disable the property and save the reenabler function

            _context.next = 30;
            return (0, _disableProperty2.default)(instance, rmRuleStyle, propName);

          case 30:
            reenabler = _context.sent;


            // Only continue of the property is not browser-prefixed
            prefix = /^-webkit-/;

            if (prefix.test(propName)) {
              _context.next = 45;
              break;
            }

            _context.next = 35;
            return (0, _screenshot2.default)(instance, options.writeScreenshots, _path2.default.resolve(screenshotDirPath, prop.name + '.png'));

          case 35:
            comparisonPNG = _context.sent;
            _context.next = 38;
            return Promise.all([differ(comparisonPNG, options.writeScreenshots || prop.name === 'background-repeat-x' || prop.name === 'transition-duration', _path2.default.resolve(screenshotDirPath, prop.name + '-diff.png')), reenabler()]);

          case 38:
            _ref2 = _context.sent;
            _ref3 = _slicedToArray(_ref2, 1);
            diff = _ref3[0];


            console.log(prop.name, diff);

            // Add the result for this prop to the rmDiff object for this rule block
            rmDiff[prop.name] = diff;
            _context.next = 46;
            break;

          case 45:
            // If it's a browser-prefixed property, keep disabled and continue loop
            console.log('Disabled browser-prefixed property ' + propName);

          case 46:
            _iteratorNormalCompletion4 = true;
            _context.next = 25;
            break;

          case 49:
            _context.next = 55;
            break;

          case 51:
            _context.prev = 51;
            _context.t0 = _context['catch'](23);
            _didIteratorError4 = true;
            _iteratorError4 = _context.t0;

          case 55:
            _context.prev = 55;
            _context.prev = 56;

            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }

          case 58:
            _context.prev = 58;

            if (!_didIteratorError4) {
              _context.next = 61;
              break;
            }

            throw _iteratorError4;

          case 61:
            return _context.finish(58);

          case 62:
            return _context.finish(55);

          case 63:

            // Add the diff results for this rule to the structure-preserving cssRules object.
            cssRules[selectorString] = rmDiff;

          case 64:
            _iteratorNormalCompletion2 = true;
            _context.next = 13;
            break;

          case 67:
            _context.next = 73;
            break;

          case 69:
            _context.prev = 69;
            _context.t1 = _context['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t1;

          case 73:
            _context.prev = 73;
            _context.prev = 74;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 76:
            _context.prev = 76;

            if (!_didIteratorError2) {
              _context.next = 79;
              break;
            }

            throw _iteratorError2;

          case 79:
            return _context.finish(76);

          case 80:
            return _context.finish(73);

          case 81:

            console.log(JSON.stringify(cssRules, null, 2));

            normalized = {};
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context.prev = 86;


            for (_iterator3 = Object.entries(cssRules)[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              _step3$value = _slicedToArray(_step3.value, 2), selector = _step3$value[0], dr = _step3$value[1];

              normalized[selector] = normalizeScores(dr);
            }

            _context.next = 94;
            break;

          case 90:
            _context.prev = 90;
            _context.t2 = _context['catch'](86);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t2;

          case 94:
            _context.prev = 94;
            _context.prev = 95;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 97:
            _context.prev = 97;

            if (!_didIteratorError3) {
              _context.next = 100;
              break;
            }

            throw _iteratorError3;

          case 100:
            return _context.finish(97);

          case 101:
            return _context.finish(94);

          case 102:
            return _context.abrupt('return', normalized);

          case 103:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[11, 69, 73, 81], [23, 51, 55, 63], [56,, 58, 62], [74,, 76, 80], [86, 90, 94, 102], [95,, 97, 101]]);
  }));

  function diffRuleMatches(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  }

  return diffRuleMatches;
}();
//# sourceMappingURL=processDiff.js.map