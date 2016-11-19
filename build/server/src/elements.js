'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDocumentRootId = getDocumentRootId;
exports.getNodeId = getNodeId;
exports.getElementStyles = getElementStyles;

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _preparePage = require('./preparePage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDocumentRootId(instance) {
  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
    var DOM, documentResponse, rootId;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            DOM = instance.DOM;

            // Get nodeId of document root

            _context.next = 3;
            return DOM.getDocument();

          case 3:
            documentResponse = _context.sent;
            rootId = documentResponse.root.nodeId;
            return _context.abrupt('return', rootId);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}

/**
 * Get the nodeId of the node matching the given selector.
 * @param  {ChromeRemoteInterface} instance
 * @param  {number}                rootId
 * @param  {string}                selector
 * @return {number}                nodeId
 */
function getNodeId(instance, rootId, selector) {
  return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
    var DOM, queryResponse, selectedNodeId;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            DOM = instance.DOM;

            // Get nodeId of selected element

            _context2.next = 3;
            return DOM.querySelector({
              nodeId: rootId,
              selector: selector
            });

          case 3:
            queryResponse = _context2.sent;
            selectedNodeId = queryResponse.nodeId;
            return _context2.abrupt('return', selectedNodeId);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
}

/**
 * Predicate to filter out RuleMatch objects.
 * @param  {Object} options  contains options for filtering
 * @param  {RuleMatch} rm    a RuleMatch object
 * @return {boolean}         whether to keep the RuleMatch
 */
function keepRuleMatch(options, rm) {
  var selectorList = rm.rule.selectorList;
  var origin = rm.rule.origin;
  var maxRuleSelectors = options.maxRuleSelectors;

  /**
   * Disregard rules if any of the following are true:
   * - origin is the user-agent
   * - global selector (*) is used
   * - exceeds the specified upper bound of selectors (probably a reset)
   */
  var exclude = origin === 'user-agent' || selectorList.selectors.length > maxRuleSelectors || selectorList.selectors.some(function (selector) {
    return selector.text === '*';
  });

  return !exclude;
}

/**
 * Get the matched styles for an element corresponding to a nodeId.
 * @param  {Object} instance chrome-remote-interface session
 * @param  {number} rootId   nodeId of root node
 * @param  {Object} options  options object
 * @return {RuleMatch}
 */
function getElementStyles(instance, rootId, options) {
  return (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
    var CSS, selector, nodeId, matchedStylesResponse, matchedCSSRules, filteredRuleMatches;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            CSS = instance.CSS;
            selector = options.selector;

            // Get the nodeId of the element matching the selector

            _context3.next = 4;
            return getNodeId(instance, rootId, selector);

          case 4:
            nodeId = _context3.sent;
            _context3.next = 7;
            return CSS.getMatchedStylesForNode({
              nodeId: nodeId,
              includeInherited: false
            });

          case 7:
            matchedStylesResponse = _context3.sent;


            // Extract only the parts we care about from the matched styles response
            matchedCSSRules = matchedStylesResponse.matchedCSSRules;

            /**
             * Disregard rules if any of the following are true:
             * - origin is the user-agent
             * - global selector (*) is used
             * - exceeds the specified upper bound of selectors (probably a reset)
             */

            filteredRuleMatches = matchedCSSRules.filter(keepRuleMatch.bind(null, options));
            return _context3.abrupt('return', filteredRuleMatches);

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
}
//# sourceMappingURL=elements.js.map