'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementStyles = exports.getNodeId = exports.getDocumentRootId = undefined;

var getDocumentRootId = exports.getDocumentRootId = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(instance) {
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

  return function getDocumentRootId(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Get the nodeId of the node matching the given selector.
 * @param  {ChromeRemoteInterface} instance
 * @param  {number}                rootId
 * @param  {string}                selector
 * @return {number}                nodeId
 */


var getNodeId = exports.getNodeId = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(instance, rootId, selector) {
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

  return function getNodeId(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Predicate to filter out RuleMatch objects.
 * @param  {Object} options  contains options for filtering
 * @param  {RuleMatch} rm    a RuleMatch object
 * @return {boolean}         whether to keep the RuleMatch
 */


/**
 * Get the matched styles for an element corresponding to a nodeId.
 * @param  {Object} instance chrome-remote-interface session
 * @param  {number} rootId   nodeId of root node
 * @param  {Object} options  options object
 * @return {RuleMatch}
 */
var getElementStyles = exports.getElementStyles = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(instance, rootId, options) {
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

  return function getElementStyles(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

var _preparePage = require('./preparePage');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
//# sourceMappingURL=elements.js.map