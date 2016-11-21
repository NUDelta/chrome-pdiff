// @flow
import 'babel-polyfill';
import Chrome from 'chrome-remote-interface';
import { cdpConfig, sites } from './config';
import main from './src/main';

// TODO: This is temporary
const site: TestSite = sites[0];
const fullOptions: Object = Object.assign({}, cdpConfig, site);

/**
 * Driver wrapper for Chrome Remote Debugging Protocol.
 * Expects an inspectable instance of Chrome running (use `npm run chrome`).
 */

function init (chrome, options) {
  const { Page, DOM, CSS } = chrome;

  const mainFunction = main.bind(null, chrome, options);
  Page.loadEventFired(mainFunction);

  Page.enable();
  DOM.enable();
  CSS.enable();

  chrome.once('ready', () => Page.navigate({ url: options.url }));
}

Chrome(cdpConfig)
  // .then(() => Chrome(cdpConfig))
  .then(instance => init(instance, fullOptions))
  .catch(() => {
    // Try to open a new tab
    console.log('Opening new tab...');

    Chrome.New(cdpConfig)
      // .then(() => Chrome(cdpConfig))
      .then(instance => init(instance, fullOptions))
      .catch(err => console.error('Cannot connect to Chrome:', err));

    // Close tabs if > 4 are open
    Chrome.List(cdpConfig, (err, tabs) => {
      if (err) {
        console.error('Error fetching tabs:', err);
      }

      if (tabs.length > 4) {
        console.log('Closing tabs...');

        Promise.all(tabs.slice(1).map((tab) => {
          const { id } = tab;
          return Chrome.Close(Object.assign({}, cdpConfig, { id }));
        }));

        // console.log(JSON.stringify(tabs, null, 2));
      }
    })
  });
