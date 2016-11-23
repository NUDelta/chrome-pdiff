// @flow
import 'babel-polyfill';
import Chrome from 'chrome-remote-interface';
import { cdpConfig, site } from './config';
import main from './src/main';

const fullOptions: Object = Object.assign({}, cdpConfig, site);

/**
 * Driver wrapper for Chrome Remote Debugging Protocol.
 * Expects an inspectable instance of Chrome running (use `npm run chrome`).
 */

function init (options, chrome) {
  const { Page, DOM, CSS } = chrome;

  const mainFunction = main.bind(null, chrome, options);
  Page.loadEventFired(mainFunction);

  Page.enable();
  DOM.enable();
  CSS.enable();

  chrome.once('ready', () => Page.navigate({ url: options.url }));

  chrome.on('error', (err) => {
    console.error(err);
    chrome.close();
  });
}

function handleConnectionError (err) {
  /**
   * Most common connection failure is a leaking instance attached
   * to the current tab. We want to open a new tab if so, and
   * close the instance
   */
  if (err.message === 'Tab does not support inspection') {
    console.log('Opening new tab...');

    Chrome.New(cdpConfig)
      .then(() => Chrome(cdpConfig))
      .then(instance => init(fullOptions, instance))
      .catch(connectionError => console.error('Cannot connect to Chrome:', connectionError));

    // Close tabs if > 4 are open
    Chrome.List(cdpConfig, (listErr, tabs) => {
      if (listErr) {
        console.error('Error fetching tabs:', listErr);
      }

      const maxOpenTabs: number = 4;

      if (tabs.length > maxOpenTabs) {
        console.log('Closing tabs...');

        const allTabsButCurrent = tabs.slice(1);

        Promise.all(allTabsButCurrent.map((tab) => {
          const { id } = tab;
          return Chrome.Close(Object.assign({}, cdpConfig, { id }));
        }));

        // console.log(JSON.stringify(tabs, null, 2));
      }
    });
  } else {
    console.error('Cannot connect to Chrome:', err);
  }
}

Chrome(cdpConfig, init.bind(null, fullOptions))
  .on('error', handleConnectionError);
