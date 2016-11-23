/**
 * Configuration for the Chrome Remote Viewer instance.
 */
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

/**
 * Configuration for the sites.
 */
export const sites: TestSite[] = [
  {
    title: 'SectionSeparators',
    type: 'TOY',
    url: './examples/toy/SectionSeparators/index.html',
    selector: 'body > div > section.col-2.ss-style-triangles',
    pseudoElement: 'before',
    groundtruth: require('./examples/toy/SectionSeparators/groundtruth'),
  }, {
    title: 'TooltipStylesInspiration',
    type: 'TOY',
    url: './examples/TooltipStylesInspiration/index.html',
    selector: 'body > div > div.content > div > p:nth-child(1) > span.tooltip.tooltip-effect-1 > span.tooltip-content.clearfix',
    pseudoStatesToForce: [{
      selector: 'body > div > div.content > div > p:nth-child(1) > span.tooltip.tooltip-effect-1',
      forcePseudoClasses: ['hover'],
    }],
  }, {
    title: 'JSBinTest',
    type: 'URL',
    url: 'http://jsbin.com/lutuqe',
    selector: '.test-element',
  }, {
    title: 'tumblr',
    type: 'PROFESSIONAL',
    url: 'http://tumblr.com',
    selector: '.login-section',
  },
];

// TODO: This is temporary
export const site: TestSite = sites[0];
