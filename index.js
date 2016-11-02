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
};

Chrome.New(OPTIONS)
  .then(() => Chrome(OPTIONS))
  .then((chrome) => {
    const { Network, Page, DOM, CSS } = chrome;

    /**
     * Log all network requests, when the Network
     * domain is enabled.
     */
    Network.requestWillBeSent((params) => {
      console.log(params.request.url);
    });

    /**
     * Call own function on page load. Syntax is short for:
     *
     * chrome.on('Page.loadEventFired', (params) => {
     *   main(chrome, OPTIONS);
     * });
     */
    Page.loadEventFired(main.bind(null, chrome, OPTIONS));

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
