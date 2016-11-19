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
    var screenshotDirPath, basePNG, differ, diffScores, cssRules, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, rm, rmRuleStyle, selectorString, props, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, prop, propName, reenabler, comparisonPNG, _ref, _ref2, diff;

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
            return (0, _screenshot2.default)(instance, true, _path2.default.resolve(screenshotDirPath, 'base.png'));

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
              _context.next = 61;
              break;
            }

            rm = _step.value;
            rmRuleStyle = rm.rule.style;
            selectorString = rm.rule.selectorList.text;


            console.log(JSON.stringify(selectorString, null, 4));

            /**
             * Iterate over props and toggle/screenshot each.
             */
            props = rmRuleStyle.cssProperties;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 23;
            _iterator2 = props[Symbol.iterator]();

          case 25:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 44;
              break;
            }

            prop = _step2.value;
            propName = prop.name;

            // Disable the property and save the reenabler function

            _context.next = 30;
            return (0, _disableProperty2.default)(instance, rmRuleStyle, propName);

          case 30:
            reenabler = _context.sent;
            _context.next = 33;
            return (0, _screenshot2.default)(instance, options.writeScreenshots, _path2.default.resolve(screenshotDirPath, prop.name + '.png'));

          case 33:
            comparisonPNG = _context.sent;
            _context.next = 36;
            return Promise.all([differ(comparisonPNG, options.writeScreenshots, _path2.default.resolve(screenshotDirPath, prop.name + '-diff.png')), reenabler()]);

          case 36:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 1);
            diff = _ref2[0];


            console.log(prop.name, diff);

            diffScores[prop.name] = diff;

          case 41:
            _iteratorNormalCompletion2 = true;
            _context.next = 25;
            break;

          case 44:
            _context.next = 50;
            break;

          case 46:
            _context.prev = 46;
            _context.t0 = _context['catch'](23);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 50:
            _context.prev = 50;
            _context.prev = 51;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 53:
            _context.prev = 53;

            if (!_didIteratorError2) {
              _context.next = 56;
              break;
            }

            throw _iteratorError2;

          case 56:
            return _context.finish(53);

          case 57:
            return _context.finish(50);

          case 58:
            _iteratorNormalCompletion = true;
            _context.next = 14;
            break;

          case 61:
            _context.next = 67;
            break;

          case 63:
            _context.prev = 63;
            _context.t1 = _context['catch'](12);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 67:
            _context.prev = 67;
            _context.prev = 68;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 70:
            _context.prev = 70;

            if (!_didIteratorError) {
              _context.next = 73;
              break;
            }

            throw _iteratorError;

          case 73:
            return _context.finish(70);

          case 74:
            return _context.finish(67);

          case 75:
            return _context.abrupt('return', diffScores);

          case 76:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[12, 63, 67, 75], [23, 46, 50, 58], [51,, 53, 57], [68,, 70, 74]]);
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
  var maxScore = Math.max.apply(allScores);

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

      var normalizedScore = score / maxScore;
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
function main(instance, options) {
  return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
    var rootId, pseudoStates, ruleMatches, diffResults;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            debugger;
            // Get root node
            _context2.next = 3;
            return (0, _elements.getDocumentRootId)(instance);

          case 3:
            rootId = _context2.sent;
            _context2.next = 6;
            return (0, _preparePage.applyPseudoStates)(instance, rootId, options);

          case 6:
            pseudoStates = _context2.sent;
            _context2.next = 9;
            return (0, _elements.getElementStyles)(instance, rootId, options);

          case 9:
            ruleMatches = _context2.sent;
            _context2.next = 12;
            return diffRuleMatches(instance, options, ruleMatches);

          case 12:
            diffResults = _context2.sent;


            console.log(JSON.stringify(diffResults, null, 2));
            instance.close();

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
}
//# sourceMappingURL=main.js.map