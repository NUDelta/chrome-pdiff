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
  pseudoElement: false,
  pseudoStatesToForce: false,

  // Discard properties if their pdiff score is not strictly greater than this value
  lowerBound: 0,

  // Output and logging options
  verbose: false,
  screenshotDir: 'screenshots',
  writeScreenshots: false,
};

const url = (type, title) => `file://${path.resolve(__dirname, `./examples/${type}/${title}/index.html`)}`;

/**
 * Configuration for the sites.
 */
export const PROFESSIONAL_EXAMPLES: TestSite[] = [
  {
    title: 'tumblr',
    type: 'PROFESSIONAL',
    url: url('professional', 'tumblr'),
    selector: '.login-section',
    diffThreshold: 0.5,
    delay: 2000,
  }, {
    title: 'airbnb',
    type: 'PROFESSIONAL',
    url: 'http://airbnb.com',
    // selector: '#search-location',
    selector: '#site-content > div > div > div > div:nth-child(2) > div.row > div.col-sm-12.hide-sm > div > form > div > div > div.SearchForm__submit > button',
    diffThreshold: 0.01,
  },
];

export const TOY_EXAMPLES: TestSite[] = [
  {
    title: 'SectionSeparators',
    type: 'TOY',
    url: url('toy', 'SectionSeparators'),
    selector: 'body > div > section.col-2.ss-style-triangles',
    pseudoElement: 'before',
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
  }, {
    title: 'SegmentEffect',
    type: 'TOY',
    url: 'file:///Users/sarah/git/chrome-pdiff/examples/toy/SegmentEffect/index.html',
    selector: 'body > main > div.segmenter > div.segmenter__pieces > div:nth-child(4)',
  }, {
    title: 'ResponsiveFullWidthGrid',
    type: 'TOY',
    url: 'file:///Users/sarah/git/chrome-pdiff/examples/toy/ResponsiveFullWidthGrid/index.html',
    selector: 'body > div > ul > li:nth-child(2)',
  }, {
    title: 'VerticalTimeline',
    type: 'TOY',
    url: 'file:///Users/sarah/git/chrome-pdiff/examples/toy/VerticalTimeline/index.html',
    selector: 'body > div > div > ul > li:nth-child(1) > div.cbp_tmicon.cbp_tmicon-phone',
  }, {
    title: 'MinimalForm',
    type: 'TOY',
    url: 'file:///Users/sarah/git/chrome-pdiff/examples/toy/MinimalForm/index.html',
    selector: '#q1',
  }, {
    title: 'FullScreenOverlayStyles',
    type: 'TOY',
    url: 'file:///Users/sarah/git/chrome-pdiff/examples/toy/FullScreenOverlayStyles/index.html',
    selector: 'body > div.overlay.overlay-hugeinc.open',
  }, {
    title: 'PricingTablesInspiration',
    type: 'TOY',
    url: 'file:///Users/sarah/git/chrome-pdiff/examples/toy/PricingTablesInspiration/index.html',
    selector: 'body > div > section.pricing-section.bg-1 > div > div:nth-child(1)',
  }, {
    title: 'StickyFooter',
    type: 'TOY',
    url: 'file:///Users/sarah/git/chrome-pdiff/examples/toy/StickyFooter/index.html',
    selector: 'body > footer',
  }, {
    title: 'ProductTour',
    type: 'TOY',
    url: 'file:///Users/sarah/git/chrome-pdiff/examples/toy/ProductTour/index.html',
    selector: 'body > ul',
  },
];

// TODO: This is temporary
export const SITE: TestSite = TOY_EXAMPLES[9];
