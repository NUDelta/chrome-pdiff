'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _preparePage = require('./chrome/preparePage');

var _elements = require('./chrome/elements');

var _processDiff = require('./diff/processDiff');

var _processDiff2 = _interopRequireDefault(_processDiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Function to execute once the page loads in Canary.
 */
exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(instance, options) {
    var rootId, ruleMatches, normalizedResults;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            debugger;

            // Get root node
            _context.next = 3;
            return (0, _elements.getDocumentRootId)(instance);

          case 3:
            rootId = _context.sent;

            if (!options.pseudoStatesToForce.length) {
              _context.next = 7;
              break;
            }

            _context.next = 7;
            return (0, _preparePage.applyPseudoStates)(instance, rootId, options);

          case 7:
            _context.next = 9;
            return (0, _elements.getElementStyles)(instance, rootId, options);

          case 9:
            ruleMatches = _context.sent;
            _context.next = 12;
            return (0, _processDiff2.default)(instance, options, ruleMatches);

          case 12:
            normalizedResults = _context.sent;

            console.log(JSON.stringify(normalizedResults, null, 2));

            instance.close();

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function main(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return main;
}();
//# sourceMappingURL=main.js.map