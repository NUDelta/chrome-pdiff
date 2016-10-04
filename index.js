import Chrome from 'chrome-remote-interface';
import getOwnStyles from './src/getOwnStyles';

const OPTIONS = {
  host: 'localhost',
  port: 9222,
  url: 'https://tumblr.com',
  selector: '.blogs-section',
  maxRuleSelectors: 50,
  verbose: false,
};

Chrome(OPTIONS)
  .then((chrome) => {
    const { Network, Page, DOM, CSS } = chrome;

    /**
     * Log all network requests, when the Network
     * domain is enabled.
     */
    Network.requestWillBeSent((params) => {
      console.log(params.request.url);
    });

    Page.loadEventFired(getOwnStyles.bind(null, chrome, OPTIONS));

    /**
     * Enable domain agents for the protocol instance
     */
    Page.enable();
    DOM.enable();
    CSS.enable();

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

