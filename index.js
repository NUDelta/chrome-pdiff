// @flow
import 'babel-polyfill';
import Chrome from 'chrome-remote-interface';
import { CDP_CONFIG, TOY_EXAMPLES, PROFESSIONAL_EXAMPLES, SITE } from './config';
import main from './src/main';

/**
 * Driver wrapper for Chrome Remote Debugging Protocol.
 * Expects an inspectable instance of Chrome running (use `npm run chrome`).
 */

const TEST_ALL = false;

const sites: TestSite[] = TOY_EXAMPLES;

function init (options, chrome) {
  return new Promise((resolve, reject) => {
    const { Page, DOM, CSS } = chrome;

    const mainFunction = main.bind(null, chrome, options);
    Page.loadEventFired(() => {
      mainFunction()
        .then(resolve)
        .catch(reject);
    });

    Page.enable();
    DOM.enable();
    CSS.enable();

    chrome.once('ready', () => Page.navigate({ url: options.url }));

    chrome.on('error', (err) => {
      console.error(err);
      chrome.close();
      reject();
    });
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
    const fullOptions: Object = Object.assign({}, CDP_CONFIG, SITE);

    Chrome.New(CDP_CONFIG)
      .then((tab) => {
        const optionsWithTab = Object.assign({}, CDP_CONFIG, { chooseTab: tab });
        return Chrome(optionsWithTab);
      })
      .then(instance => init(fullOptions, instance))
      .catch(connectionError => console.error('Cannot connect to Chrome:', connectionError));

    // Close tabs if > 4 are open
    Chrome.List(CDP_CONFIG, (listErr, tabs) => {
      if (listErr) {
        console.error('Error fetching tabs:', listErr);
      }

      const maxOpenTabs: number = 4;

      if (tabs.length > maxOpenTabs) {
        console.log('Closing tabs...');

        const allTabsButCurrent = tabs.slice(1);

        Promise.all(allTabsButCurrent.map((tab) => {
          const { id } = tab;
          return Chrome.Close(Object.assign({}, CDP_CONFIG, { id }));
        }));

        // console.log(JSON.stringify(tabs, null, 2));
      }
    });
  } else {
    console.error('Cannot connect to Chrome:', err);
  }
}

function closeAllTabs () {
  Chrome.List(CDP_CONFIG)
    .then(tabs => Promise.all(tabs.map((tab) => {
      const { id } = tab;
      return Chrome.Close(Object.assign({}, CDP_CONFIG, { id }));
    })))
    .catch(err => console.error('Error listing tabs:', err));
}

if (TEST_ALL) {
  /**
   * Launch multiple browser tabs concurrently.
   */
  closeAllTabs();

  // Map a full options object for each site.
  const siteOptions: Object[] = sites.map(s => Object.assign({}, CDP_CONFIG, s));

  const sitePromises = siteOptions.map(so => new Promise((resolve, reject) => {
    Chrome.New(CDP_CONFIG)
      .then((tab) => {
        const optionsWithTab = Object.assign({}, CDP_CONFIG, { chooseTab: tab });
        return Chrome(optionsWithTab);
      })
      .then(instance => init(so, instance))
      .then(resolve)
      .catch(err => reject(err));
  }));

  Promise.all(sitePromises)
    .then(() => console.log('Done!'))
    .catch(err => console.error('Error in a tab:', err));
} else {
  /**
   * Launch just one tab.
   */

  const fullOptions: Object = Object.assign({}, CDP_CONFIG, SITE);

  Chrome(CDP_CONFIG, init.bind(null, fullOptions))
    .on('error', handleConnectionError);
}
