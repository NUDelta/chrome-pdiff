'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffRuleMatches = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var diffRuleMatches = exports.diffRuleMatches = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(instance, options, ruleMatches) {
    var _this = this;

    var screenshotDirPath, basePNG, differ, cssRules, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2;

    return regeneratorRuntime.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Base path for all screenshots
            screenshotDirPath = _path2.default.resolve(__dirname, '../../', options.screenshotDir);

            /**
             * Capture and write the base screenshot for comparison.
             */

            _context2.next = 3;
            return (0, _screenshot2.default)(instance, options.writeScreenshots, _path2.default.resolve(screenshotDirPath, 'base.png'));

          case 3:
            basePNG = _context2.sent;
            _context2.next = 6;
            return (0, _pdiff2.default)(basePNG);

          case 6:
            differ = _context2.sent;


            // Collect diff scores
            cssRules = [];

            /**
             * Iterate over each RuleMatch and toggle its styles
             */

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context2.prev = 11;
            _loop = regeneratorRuntime.mark(function _loop() {
              var rm, rmRuleStyle, matchingSelectorIndices, selectors, selectorString, rmDiff, props, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, prop, propName, reenabler, prefix, comparisonPNG, _ref2, _ref3, diff;

              return regeneratorRuntime.wrap(function _loop$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      rm = _step2.value;
                      rmRuleStyle = rm.rule.style;

                      /**
                       * Want to extract just the matched selector from the RuleMatch
                       * selector string.
                       */

                      matchingSelectorIndices = rm.matchingSelectors;
                      selectors = rm.rule.selectorList.selectors;
                      selectorString = matchingSelectorIndices.map(function (i) {
                        return selectors[i].text;
                      }).join(', ');


                      console.log(JSON.stringify(selectorString, null, 2));

                      // Collect the diff for this rule
                      rmDiff = {};

                      /**
                       * Iterate over props and toggle/screenshot each.
                       */

                      props = rmRuleStyle.cssProperties;
                      _iteratorNormalCompletion3 = true;
                      _didIteratorError3 = false;
                      _iteratorError3 = undefined;
                      _context.prev = 11;
                      _iterator3 = props[Symbol.iterator]();

                    case 13:
                      if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                        _context.next = 37;
                        break;
                      }

                      prop = _step3.value;
                      propName = prop.name;

                      // Disable the property and save the reenabler function

                      _context.next = 18;
                      return (0, _disableProperty2.default)(instance, rmRuleStyle, propName);

                    case 18:
                      reenabler = _context.sent;


                      // Only continue if prop isn't browser-prefixed. If so, keep disabled and continue loop
                      prefix = /^-webkit-/;

                      if (prefix.test(propName)) {
                        _context.next = 33;
                        break;
                      }

                      _context.next = 23;
                      return (0, _screenshot2.default)(instance, options.writeScreenshots, _path2.default.resolve(screenshotDirPath, prop.name + '.png'));

                    case 23:
                      comparisonPNG = _context.sent;
                      _context.next = 26;
                      return Promise.all([differ(comparisonPNG, options.writeScreenshots, _path2.default.resolve(screenshotDirPath, prop.name + '-diff.png')), reenabler()]);

                    case 26:
                      _ref2 = _context.sent;
                      _ref3 = _slicedToArray(_ref2, 1);
                      diff = _ref3[0];


                      console.log(prop.name, diff);

                      // Add the result for this prop to the rmDiff for this rule block
                      rmDiff[prop.name] = diff;
                      _context.next = 34;
                      break;

                    case 33:
                      // If it's a browser-prefixed property, keep disabled and continue loop
                      console.log('Disabled browser-prefixed property ' + propName);

                    case 34:
                      _iteratorNormalCompletion3 = true;
                      _context.next = 13;
                      break;

                    case 37:
                      _context.next = 43;
                      break;

                    case 39:
                      _context.prev = 39;
                      _context.t0 = _context['catch'](11);
                      _didIteratorError3 = true;
                      _iteratorError3 = _context.t0;

                    case 43:
                      _context.prev = 43;
                      _context.prev = 44;

                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                      }

                    case 46:
                      _context.prev = 46;

                      if (!_didIteratorError3) {
                        _context.next = 49;
                        break;
                      }

                      throw _iteratorError3;

                    case 49:
                      return _context.finish(46);

                    case 50:
                      return _context.finish(43);

                    case 51:

                      // Add the diff results for this rule to the structure-preserving cssRules list.
                      cssRules.push([selectorString, rmDiff]);

                    case 52:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _loop, _this, [[11, 39, 43, 51], [44,, 46, 50]]);
            });
            _iterator2 = ruleMatches[Symbol.iterator]();

          case 14:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context2.next = 19;
              break;
            }

            return _context2.delegateYield(_loop(), 't0', 16);

          case 16:
            _iteratorNormalCompletion2 = true;
            _context2.next = 14;
            break;

          case 19:
            _context2.next = 25;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t1 = _context2['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t1;

          case 25:
            _context2.prev = 25;
            _context2.prev = 26;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 28:
            _context2.prev = 28;

            if (!_didIteratorError2) {
              _context2.next = 31;
              break;
            }

            throw _iteratorError2;

          case 31:
            return _context2.finish(28);

          case 32:
            return _context2.finish(25);

          case 33:

            console.log(JSON.stringify(cssRules, null, 2));

            return _context2.abrupt('return', cssRules);

          case 35:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee, this, [[11, 21, 25, 33], [26,, 28, 32]]);
  }));

  return function diffRuleMatches(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.normalizeScores = normalizeScores;

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
//# sourceMappingURL=processDiff.js.map