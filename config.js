import path from 'path';

/**
 * Configuration for the Chrome Remote Viewer instance.
 */
export const CDP_CONFIG = {
  // Chrome instance to attach to
  host: 'localhost',
  port: 9222,

  // How many CSS selectors to allow (used to filter out resets, etc.)
  maxRuleSelectors: 50,

  // Settings for pixelmatch
  diffThreshold: 0.01,
  delay: 0,

  // Output and logging options
  verbose: false,
  screenshotDir: 'screenshots',
  writeScreenshots: true,
};

const url = (type, title) => `file://${path.resolve(__dirname, `./examples/${type}/${title}/index.html`)}`;

/**
 * Configuration for the sites.
 */
export const SITES: TestSite[] = [
  {
    title: 'SectionSeparators',
    type: 'TOY',
    url: url('toy', 'SectionSeparators'),
    selector: 'body > div > section.col-2.ss-style-triangles',
    pseudoElement: 'before',
    diffThreshold: 0.01,
    // groundtruth: require('./examples/toy/SectionSeparators/groundtruth'),
  }, {
    title: 'TooltipStylesInspiration',
    type: 'TOY',
    url: url('toy', 'TooltipStylesInspiration'),
    selector: 'body > div > div.content > div > p:nth-child(1) > span.tooltip.tooltip-effect-1 > span.tooltip-content.clearfix',
    pseudoStatesToForce: [{
      selector: 'body > div > div.content > div > p:nth-child(1) > span.tooltip.tooltip-effect-1',
      forcePseudoClasses: ['hover'],
    }],
    diffThreshold: 0.01,
  }, {
    title: 'JSBinTest',
    type: 'URL',
    url: 'http://jsbin.com/lutuqe',
    selector: '.test-element',
    diffThreshold: 0.01,
  }, {
    title: 'tumblr',
    type: 'PROFESSIONAL',
    url: url('professional', 'tumblr'),
    selector: '.login-section',
    diffThreshold: 0.5,
    delay: 2000,
  },
];

// TODO: This is temporary
export const SITE: TestSite = SITES[3];
