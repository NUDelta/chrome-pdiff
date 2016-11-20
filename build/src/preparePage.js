'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyPseudoStates = applyPseudoStates;

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _elements = require('./elements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Force a pseudo state on a particular element.
 * @param {Object} instance    a Chrome Remote Viewer instance
 * @param {number} rootId      nodeId of document root node
 * @param {String} selector    selector for the element to force
 * @param {PseudoClass[]} forcePseudoStates   array of pseudoclasses to force
 * @return {Promise<void>}
 */
function forcePseudoState(instance, rootId, selector, pseudoStatesToForce) {
  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
    var CSS, nodeId;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            CSS = instance.CSS;
            _context.next = 3;
            return (0, _elements.getNodeId)(instance, rootId, selector);

          case 3:
            nodeId = _context.sent;
            return _context.abrupt('return', CSS.forcePseudoState({
              nodeId: nodeId,
              forcedPseudoClasses: pseudoStatesToForce
            }));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}

/**
 * Add pseudoclasses to elements on the page before screenshotting.
 */
function applyPseudoStates(instance, rootId, options) {
  return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
    var CSS, pseudoStatesToForce, promisify, promises;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            CSS = instance.CSS;
            pseudoStatesToForce = options.pseudoStatesToForce;

            // If `options.pseudoStatesToForce` was undefined or an empty array, ignore

            if (!(!pseudoStatesToForce || !pseudoStatesToForce.length)) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt('return');

          case 4:
            // pseudoStates: [{
            //   selector: 'body > div > div.content > div > p:nth-child(1) > span.tooltip.tooltip-effect-1',
            //   forcePseudoClasses: ['hover'],
            // }],

            // Bind the helper promisifier to the current instance.
            promisify = forcePseudoState.bind(null, instance, rootId);
            _context2.next = 7;
            return Promise.all(pseudoStatesToForce.map(function (ps) {
              return promisify(ps.selector, ps.forcePseudoClasses);
            }));

          case 7:
            promises = _context2.sent;
            return _context2.abrupt('return', instance);

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
}
//# sourceMappingURL=preparePage.js.map