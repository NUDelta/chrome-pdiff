export const cdpConfig = {
  // Chrome instance to attach to
  host: 'localhost',
  port: 9222,

  // How many CSS selectors to allow (used to filter out resets, etc.)
  maxRuleSelectors: 50,

  // Output and logging options
  verbose: false,
  screenshotDir: 'screenshots',
  writeScreenshots: false,
};

export const sites: TestSite[] = [
  {
    url: 'file:///Users/sarah/git/chrome-pdiff/examples/TooltipStylesInspiration/index.html',
    selector: 'body > div > div.content > div > p:nth-child(1) > span.tooltip.tooltip-effect-1 > span.tooltip-content.clearfix',
    pseudoStatesToForce: [{
      selector: 'body > div > div.content > div > p:nth-child(1) > span.tooltip.tooltip-effect-1',
      forcePseudoClasses: ['hover'],
    }],
  }, {
    url: 'http://jsbin.com/lutuqe',
    selector: '.test-element',
  }, {
    url: 'http://tumblr.com',
    selector: '.login-section',
  },
];
