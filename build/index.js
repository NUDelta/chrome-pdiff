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

function init(chrome, options) {
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
}

(0, _chromeRemoteInterface2.default)(_config.cdpConfig)
// .then(() => Chrome(cdpConfig))
.then(function (instance) {
  return init(instance, fullOptions);
}).catch(function () {
  // Try to open a new tab
  console.log('Opening new tab...');

  _chromeRemoteInterface2.default.New(_config.cdpConfig)
  // .then(() => Chrome(cdpConfig))
  .then(function (instance) {
    return init(instance, fullOptions);
  }).catch(function (err) {
    return console.error('Cannot connect to Chrome:', err);
  });

  // Close tabs if > 4 are open
  _chromeRemoteInterface2.default.List(_config.cdpConfig, function (err, tabs) {
    if (err) {
      console.error('Error fetching tabs:', err);
    }

    if (tabs.length > 4) {
      console.log('Closing tabs...');

      Promise.all(tabs.slice(1).map(function (tab) {
        var id = tab.id;

        return _chromeRemoteInterface2.default.Close(Object.assign({}, _config.cdpConfig, { id: id }));
      }));

      // console.log(JSON.stringify(tabs, null, 2));
    }
  });
});

//# sourceMappingURL=index.js.map