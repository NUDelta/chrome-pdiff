'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = main;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _pngjs = require('pngjs');

var _preparePage = require('./preparePage');

var _elements = require('./elements');

var _disableProperty = require('./disableProperty');

var _disableProperty2 = _interopRequireDefault(_disableProperty);

var _screenshot = require('./screenshot');

var _screenshot2 = _interopRequireDefault(_screenshot);

var _pdiff = require('./pdiff');

var _pdiff2 = _interopRequireDefault(_pdiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function diffRuleMatches(instance, options, ruleMatches) {
  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
    var screenshotDirPath, basePNG, differ, diffScores, cssRules, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, rm, rmRuleStyle, selectorString, rmDiff, props, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, prop, propName, reenabler, comparisonPNG, _ref, _ref2, diff;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            // Base path for all screenshots
            screenshotDirPath = _path2.default.resolve(__dirname, '../', options.screenshotDir);

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
            diffScores = {};

            // Also collect the rule structure

            cssRules = {};

            /**
             * Iterate over each RuleMatch and toggle its styles
             */

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 12;
            _iterator = ruleMatches[Symbol.iterator]();

          case 14:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 63;
              break;
            }

            rm = _step.value;
            rmRuleStyle = rm.rule.style;
            selectorString = rm.rule.selectorList.text;


            console.log(JSON.stringify(selectorString, null, 4));

            // Collect the diff for this rule
            rmDiff = {};

            /**
             * Iterate over props and toggle/screenshot each.
             */

            props = rmRuleStyle.cssProperties;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 24;
            _iterator2 = props[Symbol.iterator]();

          case 26:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 45;
              break;
            }

            prop = _step2.value;
            propName = prop.name;

            // Disable the property and save the reenabler function

            _context.next = 31;
            return (0, _disableProperty2.default)(instance, rmRuleStyle, propName);

          case 31:
            reenabler = _context.sent;
            _context.next = 34;
            return (0, _screenshot2.default)(instance, options.writeScreenshots, _path2.default.resolve(screenshotDirPath, prop.name + '.png'));

          case 34:
            comparisonPNG = _context.sent;
            _context.next = 37;
            return Promise.all([differ(comparisonPNG, options.writeScreenshots || prop.name === 'background-repeat-x' || prop.name === 'transition-duration', _path2.default.resolve(screenshotDirPath, prop.name + '-diff.png')), reenabler()]);

          case 37:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 1);
            diff = _ref2[0];


            console.log(prop.name, diff);

            // Add the result for this prop to the rmDiff object for this rule block
            rmDiff[prop.name] = diff;

          case 42:
            _iteratorNormalCompletion2 = true;
            _context.next = 26;
            break;

          case 45:
            _context.next = 51;
            break;

          case 47:
            _context.prev = 47;
            _context.t0 = _context['catch'](24);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 51:
            _context.prev = 51;
            _context.prev = 52;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 54:
            _context.prev = 54;

            if (!_didIteratorError2) {
              _context.next = 57;
              break;
            }

            throw _iteratorError2;

          case 57:
            return _context.finish(54);

          case 58:
            return _context.finish(51);

          case 59:

            // Add the diff results for this rule to the structure-preserving cssRules object.
            cssRules[selectorString] = rmDiff;

          case 60:
            _iteratorNormalCompletion = true;
            _context.next = 14;
            break;

          case 63:
            _context.next = 69;
            break;

          case 65:
            _context.prev = 65;
            _context.t1 = _context['catch'](12);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 69:
            _context.prev = 69;
            _context.prev = 70;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 72:
            _context.prev = 72;

            if (!_didIteratorError) {
              _context.next = 75;
              break;
            }

            throw _iteratorError;

          case 75:
            return _context.finish(72);

          case 76:
            return _context.finish(69);

          case 77:
            return _context.abrupt('return', cssRules);

          case 78:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[12, 65, 69, 77], [24, 47, 51, 59], [52,, 54, 58], [70,, 72, 76]]);
  }));
}

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

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = Object.entries(propDiffs)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _step3$value = _slicedToArray(_step3.value, 2),
          prop = _step3$value[0],
          score = _step3$value[1];

      var normalizedScore = range > 0 ? (score - minScore) / range : 0;

      normalized[prop] = normalizedScore;
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return normalized;
}

/**
 * Function to execute once the page loads in Canary.
 */
function main(instance, options) {
  return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
    var rootId, pseudoStates, ruleMatches, cssRules, normalized, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _step4$value, selector, dr;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            debugger;
            console.log(require.main.filename);
            console.log(module);
            console.log(process.cwd());

            // Get root node
            _context2.next = 6;
            return (0, _elements.getDocumentRootId)(instance);

          case 6:
            rootId = _context2.sent;
            _context2.next = 9;
            return (0, _preparePage.applyPseudoStates)(instance, rootId, options);

          case 9:
            pseudoStates = _context2.sent;
            _context2.next = 12;
            return (0, _elements.getElementStyles)(instance, rootId, options);

          case 12:
            ruleMatches = _context2.sent;
            _context2.next = 15;
            return diffRuleMatches(instance, options, ruleMatches);

          case 15:
            cssRules = _context2.sent;

            console.log(JSON.stringify(cssRules, null, 2));

            normalized = {};
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context2.prev = 21;


            for (_iterator4 = Object.entries(cssRules)[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              _step4$value = _slicedToArray(_step4.value, 2), selector = _step4$value[0], dr = _step4$value[1];

              normalized[selector] = normalizeScores(dr);
            }

            _context2.next = 29;
            break;

          case 25:
            _context2.prev = 25;
            _context2.t0 = _context2['catch'](21);
            _didIteratorError4 = true;
            _iteratorError4 = _context2.t0;

          case 29:
            _context2.prev = 29;
            _context2.prev = 30;

            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }

          case 32:
            _context2.prev = 32;

            if (!_didIteratorError4) {
              _context2.next = 35;
              break;
            }

            throw _iteratorError4;

          case 35:
            return _context2.finish(32);

          case 36:
            return _context2.finish(29);

          case 37:
            console.log(JSON.stringify(normalized, null, 2));

            instance.close();

          case 39:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[21, 25, 29, 37], [30,, 32, 36]]);
  }));
}
//# sourceMappingURL=main.js.map