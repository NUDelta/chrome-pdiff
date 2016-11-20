'use strict';

require('babel-polyfill');

var _chromeRemoteInterface = require('chrome-remote-interface');

var _chromeRemoteInterface2 = _interopRequireDefault(_chromeRemoteInterface);

var _main = require('./src/main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Driver wrapper for Chrome Remote Debugging Protocol.
 * Expects an inspectable instance of Chrome running (use `npm run chrome`).
 */

var OPTIONS = {
  // Chrome instance to attach to
  host: 'localhost',
  port: 9222,

  // How many CSS selectors to allow (used to filter out resets, etc.)
  maxRuleSelectors: 50,

  // Output and logging options
  verbose: false,
  screenshotDir: 'screenshots',
  writeScreenshots: false,

  // url: 'http://jsbin.com/lutuqe',
  // selector: '.test-element',

  // url: 'http://tumblr.com',
  // selector: '.login-section',

  url: 'file:///Users/sarah/git/chrome-pdiff/examples/TooltipStylesInspiration/index.html',
  selector: 'body > div > div.content > div > p:nth-child(1) > span.tooltip.tooltip-effect-1 > span.tooltip-content.clearfix',
  pseudoStatesToForce: [{
    selector: 'body > div > div.content > div > p:nth-child(1) > span.tooltip.tooltip-effect-1',
    forcePseudoClasses: ['hover']
  }]
};

function init(chrome) {
  var Page = chrome.Page,
      DOM = chrome.DOM,
      CSS = chrome.CSS;

  /**
   * Call main function on page load. Syntax is short for:
   * chrome.on('Page.loadEventFired', (params) => {
   *   main(chrome, OPTIONS);
   * });
   */

  var mainFunction = _main2.default.bind(null, chrome, OPTIONS);
  Page.loadEventFired(mainFunction);

  /**
   * Enable domain agents for the protocol instance
   */
  Page.enable();
  DOM.enable();
  CSS.enable();

  chrome.once('ready', function () {
    var url = OPTIONS.url;


    Page.navigate({ url: url });
  });
}

// eslint-disable-next-line new-cap
(0, _chromeRemoteInterface2.default)(OPTIONS, init).on('error', function (err) {
  console.error('Cannot connect to Chrome:', err);
  this.close();
});

//# sourceMappingURL=index.js.map