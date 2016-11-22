'use strict';

require('babel-polyfill');

var _chromeRemoteInterface = require('chrome-remote-interface');

var _chromeRemoteInterface2 = _interopRequireDefault(_chromeRemoteInterface);

var _config = require('./config');

var _main = require('./src/main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: This is temporary
var site = _config.sites[0];
var fullOptions = Object.assign({}, _config.cdpConfig, site);

/**
 * Driver wrapper for Chrome Remote Debugging Protocol.
 * Expects an inspectable instance of Chrome running (use `npm run chrome`).
 */

function init(options, chrome) {
  var Page = chrome.Page,
      DOM = chrome.DOM,
      CSS = chrome.CSS;


  var mainFunction = _main2.default.bind(null, chrome, options);
  Page.loadEventFired(mainFunction);

  Page.enable();
  DOM.enable();
  CSS.enable();

  chrome.once('ready', function () {
    return Page.navigate({ url: options.url });
  });

  chrome.on('error', function (err) {
    console.error(err);
    chrome.close();
  });
}

function handleConnectionError(err) {
  /**
   * Most common connection failure is a leaking instance attached
   * to the current tab. We want to open a new tab if so, and
   * close the instance
   */
  if (err.message === 'Tab does not support inspection') {
    console.log('Opening new tab...');

    _chromeRemoteInterface2.default.New(_config.cdpConfig).then(function () {
      return (0, _chromeRemoteInterface2.default)(_config.cdpConfig);
    }).then(function (instance) {
      return init(fullOptions, instance);
    }).catch(function (err) {
      return console.error('Cannot connect to Chrome:', err);
    });

    // Close tabs if > 4 are open
    _chromeRemoteInterface2.default.List(_config.cdpConfig, function (listErr, tabs) {
      if (listErr) {
        console.error('Error fetching tabs:', listErr);
      }

      if (tabs.length > 4) {
        console.log('Closing tabs...');

        var allTabsButCurrent = tabs.slice(1);

        Promise.all(allTabsButCurrent.map(function (tab) {
          var id = tab.id;

          return _chromeRemoteInterface2.default.Close(Object.assign({}, _config.cdpConfig, { id: id }));
        }));

        // console.log(JSON.stringify(tabs, null, 2));
      }
    });
  } else {
    console.error('Cannot connect to Chrome:', err);
  }
}

(0, _chromeRemoteInterface2.default)(_config.cdpConfig, init.bind(null, fullOptions)).on('error', handleConnectionError);

//# sourceMappingURL=index.js.map