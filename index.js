import Chrome from 'chrome-remote-interface';
import main from './src/main';

/**
 * Driver wrapper for Chrome Remote Debugging Protocol.
 * Expects an inspectable instance of Chrome running (use `npm run chrome`).
 */

const OPTIONS = {
  host: 'localhost',
  port: 9222,
  url: 'http://jsbin.com/lutuqe',
  selector: '.test-element',
  maxRuleSelectors: 50,
  verbose: false,
  screenshotDir: 'screenshots',
  writeScreenshots: false,
};

Chrome.New(OPTIONS)
  // After defining a new tab, need to initialize a connection
  .then((chrome) => Chrome(OPTIONS))
  .then((chrome) => {
    const { Network, Page, DOM, CSS } = chrome;

    /**
     * Call own function on page load. Syntax is short for:
     *
     * chrome.on('Page.loadEventFired', (params) => {
     *   main(chrome, OPTIONS);
     * });
     */
    const mainFunction = main.bind(null, chrome, OPTIONS);
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

      chrome.on('event', (message) => {
        console.log(message.params);
      });
    }

    chrome.once('ready', () => {
      const { url } = OPTIONS;

      Page.navigate({ url });
    });
  })
  .catch((err) => {
    console.error('Cannot connect to Chrome:', err);
  });
