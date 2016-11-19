'use strict';

var _chromeRemoteInterface = require('chrome-remote-interface');

var _chromeRemoteInterface2 = _interopRequireDefault(_chromeRemoteInterface);

var _main = require('./src/main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register')({
  sourceMaps: true
});


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

(0, _chromeRemoteInterface2.default)(OPTIONS)
// After defining a new tab, need to initialize a connection
// .then((chrome) => Chrome(OPTIONS))
.then(function (chrome) {
  var Network = chrome.Network,
      Page = chrome.Page,
      DOM = chrome.DOM,
      CSS = chrome.CSS;

  /**
   * Call main function on page load. Syntax is short for:
   *
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

  /**
   * This will log every network request made, so we disable unless
   * verbose option is true.
   */
  if (OPTIONS.verbose) {
    Network.enable();

    chrome.on('event', function (message) {
      console.log(message.params);
    });
  }

  chrome.once('ready', function () {
    var url = OPTIONS.url;


    Page.navigate({ url: url });
  });
}).catch(function (err) {
  console.error('Cannot connect to Chrome:', err);
});
//# sourceMappingURL=index.js.map