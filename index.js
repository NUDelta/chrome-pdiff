import 'babel-polyfill';
import Chrome from 'chrome-remote-interface';
import main from './src/main';

/**
 * Driver wrapper for Chrome Remote Debugging Protocol.
 * Expects an inspectable instance of Chrome running (use `npm run chrome`).
 */

const OPTIONS = {
  // Chrome instance to attach to
  host: 'localhost',
  port: 9222,

  // chooseTab: determines which tab this client should attach to. The behavior changes according to the type:

  // a function that takes the array returned by the List method and returns the numeric index of a tab;
  // a tab object like those returned by the New and List methods;
  // a string representing the raw WebSocket URL, in this case host and port are not used to fetch the tab list.
  // Defaults to a function which returns the currently active tab (function (tabs) { return 0; });

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
    forcePseudoClasses: ['hover'],
  }],
};

function init (chrome) {
  const { Network, Page, DOM, CSS } = chrome;

  /**
   * Call main function on page load. Syntax is short for:
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

  chrome.once('ready', () => {
    const { url } = OPTIONS;

    Page.navigate({ url });
  });
}

Chrome(OPTIONS)
  // After defining a new tab, need to initialize a connection
  // .then((chrome) => Chrome(OPTIONS))
  .then(init)
  .catch((err) => {
    console.error('Cannot connect to Chrome:', err);
    this.close();  // TODO: No idea if this works.
  });
