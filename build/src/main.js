'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _preparePage = require('./chrome/preparePage');

var _elements = require('./chrome/elements');

var _processDiff = require('./diff/processDiff');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Function to execute once the page loads in Canary.
 */
exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(instance, options) {
    var rootId, ruleMatches, cssRules, normalized, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, selector, dr;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _elements.getDocumentRootId)(instance);

          case 2:
            rootId = _context.sent;

            if (!(options.pseudoStatesToForce && options.pseudoStatesToForce.length)) {
              _context.next = 6;
              break;
            }

            _context.next = 6;
            return (0, _preparePage.applyPseudoStates)(instance, rootId, options);

          case 6:
            _context.next = 8;
            return (0, _elements.getElementStyles)(instance, rootId, options);

          case 8:
            ruleMatches = _context.sent;
            _context.next = 11;
            return (0, _processDiff.diffRuleMatches)(instance, options, ruleMatches);

          case 11:
            cssRules = _context.sent;


            /**
             * Normalize the output for each pair.
             */
            normalized = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 16;


            for (_iterator = cssRules[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              _step$value = _slicedToArray(_step.value, 2), selector = _step$value[0], dr = _step$value[1];

              normalized.push([selector, (0, _processDiff.normalizeScores)(dr)]);
            }

            _context.next = 24;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context['catch'](16);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 24:
            _context.prev = 24;
            _context.prev = 25;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 27:
            _context.prev = 27;

            if (!_didIteratorError) {
              _context.next = 30;
              break;
            }

            throw _iteratorError;

          case 30:
            return _context.finish(27);

          case 31:
            return _context.finish(24);

          case 32:
            console.log(JSON.stringify(normalized, null, 2));

            instance.close();

          case 34:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[16, 20, 24, 32], [25,, 27, 31]]);
  }));

  function main(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return main;
}();
//# sourceMappingURL=main.js.map