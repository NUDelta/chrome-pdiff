// @flow

/**
 * CSS style sheet identifier.
 * Absent for UA styles and user-specified stylesheet rules.
 * @type {String}
 */
declare type StyleSheetId = string;

('83510.1': StyleSheetId);

/**
 * Stylesheet type.
 * 'injected': for stylesheets injected via extension
 * 'user-agent': for user-agent stylesheets
 * 'inspector': for stylesheets created by the inspector
 * 'regular': for regular stylesheets
 * @type {String}
 */
declare type StyleSheetOrigin = 'injected' | 'user-agent' | 'inspector' | 'regular';

/**
 * Text range within a resource. Zero-indexed, [) range.
 * @type {Object}
 */
declare type SourceRange = {
  startLine: number,
  startColumn: number,
  endLine: number,
  endColumn: number,
};

({
  startLine: 5,
  startColumn: 0,
  endLine: 5,
  endColumn: 13,
}: SourceRange);

/**
 * Data for a simple selector (i.e. those delimited by commas in a selector list).
 *
 * .foo
 *
 * @type {Object}
 */
declare type Value = {
  text: string,
  range?: SourceRange,
};

({
  text: '.test-element',
  range: {
    startLine: 5,
    startColumn: 0,
    endLine: 5,
    endColumn: 13,
  },
}: Value);

/**
 * Selector list data.
 *
 * .foo, .bar
 *
 * @type {Object}
 */
declare type SelectorList = {
  selectors: Value[],
  text: string,
};

({
  selectors: [
    {
      text: '.test-element',
      range: {
        startLine: 5,
        startColumn: 0,
        endLine: 5,
        endColumn: 13,
      },
    }
  ],
  text: '.test-element',
}: SelectorList);

/**
 * CSS property declaration data.
 *
 * position: absolute !important;
 *
 * @type {Object}
 */
declare type CSSProperty = {
  name: string,
  value: string,
  important?: boolean,
  implicit?: boolean,
  text?: string,
  parsedOk?: boolean,
  disabled?: boolean,
  range?: SourceRange,
};

({
  name: 'position',
  value: 'absolute',
  implicit: false,
  text: 'position:absolute;',
  disabled: false,
  range: {
    startLine: 6,
    startColumn: 2,
    endLine: 6,
    endColumn: 21,
  },
}: CSSProperty);

/**
 * CSS style representation.
 *
 * {
 *   position: absolute;
 *   left: 50px;
 * }
 *
 * @type {Object}
 */
declare type CSSStyle = {
  styleSheetId?: StyleSheetId,
  cssProperties: CSSProperty[],
  shorthandEntries: ShorthandEntry[],
  cssText?: string,
  range?: SourceRange,
};

({
  styleSheetId: '83410.1',
  cssProperties: [{
    name: 'position',
    value: 'absolute',
    implicit: false,
    text: 'position:absolute;',
    disabled: false,
    range: {
      startLine: 6,
      startColumn: 2,
      endLine: 6,
      endColumn: 21,
    },
  }, {
    name: 'left',
    value: '50px',
    implicit: false,
    text: 'left:50px;',
    disabled: false,
    range: {
      startLine: 7,
      startColumn: 2,
      endLine: 7,
      endColumn: 13,
    },
  }],
  shorthandEntries: [],
  cssText: 'position: absolute; left: 50px;',
  range: {
    startLine: 5,
    startColumn: 15,
    endLine: 12,
    endColumn: 0,
  },
}: CSSStyle);

/**
 * CSS rule representation.
 *
 * .foo {
 *   position: absolute;
 *   left: 50px;
 * }
 *
 * @type {Object}
 */
declare type CSSRule = {
  styleSheetId: StyleSheetId,
  selectorList: SelectorList,
  origin: StyleSheetOrigin,
  style: CSSStyle,
  media?: CSSMedia[],
};

({
  styleSheetId: '83410.1',
  selectorList: {
    selectors: [
      {
        text: '.test-element',
        range: {
          startLine: 5,
          startColumn: 0,
          endLine: 5,
          endColumn: 13,
        },
      }
    ],
    text: '.test-element',
  },
  origin: 'regular',
  style: {
    styleSheetId: '83410.1',
    cssProperties: [{
      name: 'position',
      value: 'absolute',
      implicit: false,
      text: 'position:absolute;',
      disabled: false,
      range: {
        startLine: 6,
        startColumn: 2,
        endLine: 6,
        endColumn: 21,
      },
    }, {
      name: 'left',
      value: '50px',
      implicit: false,
      text: 'left:50px;',
      disabled: false,
      range: {
        startLine: 7,
        startColumn: 2,
        endLine: 7,
        endColumn: 13,
      },
    }],
    shorthandEntries: [],
    cssText: 'position: absolute; left: 50px;',
    range: {
      startLine: 5,
      startColumn: 15,
      endLine: 12,
      endColumn: 0,
    },
  },
  media: [],
}: CSSRule);

/**
 * Match data for a CSS rule.
 *
 * .foo, .bar {
 *   position: absolute;
 *   left: 50px;
 * }
 *
 * Differs from CSSRule in that it includes the selector
 * indices in the rule's selectorList.
 *
 * @type {Object}
 */
declare type RuleMatch = {
  rule: CSSRule,
  matchingSelectors: number[],
};

({
  rule: {
    styleSheetId: '83410.1',
    selectorList: {
      selectors: [
        {
          text: '.test-element',
          range: {
            startLine: 5,
            startColumn: 0,
            endLine: 5,
            endColumn: 13,
          },
        }
      ],
      text: '.test-element',
    },
    origin: 'regular',
    style: {
      styleSheetId: '83410.1',
      cssProperties: [{
        name: 'position',
        value: 'absolute',
        implicit: false,
        text: 'position:absolute;',
        disabled: false,
        range: {
          startLine: 6,
          startColumn: 2,
          endLine: 6,
          endColumn: 21,
        },
      }, {
        name: 'left',
        value: '50px',
        implicit: false,
        text: 'left:50px;',
        disabled: false,
        range: {
          startLine: 7,
          startColumn: 2,
          endLine: 7,
          endColumn: 13,
        },
      }],
      shorthandEntries: [],
      cssText: 'position: absolute; left: 50px;',
      range: {
        startLine: 5,
        startColumn: 15,
        endLine: 12,
        endColumn: 0,
      },
    },
    media: [],
  },
  matchingSelectors: [0],
}: RuleMatch);

/**
 * A descriptor of operation to mutate style declaration text.
 * @type {Object}
 */
declare type StyleDeclarationEdit = {
  styleSheetId: StyleSheetId,
  range: SourceRange,
  text: string,
};
