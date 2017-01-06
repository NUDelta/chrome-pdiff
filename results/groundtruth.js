/* eslint-disable */

export default {

  /**
   * Misses stateful styles, but gets everything else, including the unnecessary-ness of `left`
   *
   * TOTAL NON-PREFIXED: 10 (+ 10)
   * TOTAL RELEVANT: 9
   *
   * 41 is the baseline
   *
   * 1 false neg
   */
  FullScreenOverlayStyles: [
    [
      ".overlay",
      {
        "position": 1,
        "width": 1,
        "height": 1,
        "top": 1,
        "left": -1,  // 0 in normalized, > 0 in unnormalized
        "background": 1,
      }
    ],
    [
    /**
     * Missed all of these styles, due to state
     */
      ".overlay-hugeinc",
      {
        "opacity": 1,
        "visibility": 1,
        // "transition": 1,
      }
    ],
    [
      ".overlay-hugeinc.open",
      {
        "opacity": 1,
        "visibility": 1,
        // "transition": -1,
      }
    ],
  ],

  /**
   * Placeholder text needed in a form (fix).
   *
   * 2 false neg
   * 1 false pos
   */
  MinimalForm: [
    [
      "input",
      {
        "line-height": -1,
      }
    ],
    [
      ".questions input",
      {
        "display": -1,
        "margin": 0,  // false pos
        "padding": 1,
        "width": 1,  // false neg
        "border": 1,
        "background": 1,
        "color": 0,  // false neg
        "font-size": -1,
        "line-height": -1,
        "opacity": -1,
        "transition": 0,
      }
    ],
    [
      ".questions .current input",
      {
        "opacity": 1,
      }
    ]
  ],

  /**
   * Fails on flex properties.
   */
  PricingTablesInspiration: [
    [
      ".pricing__item",
      {
        "position": -1,
        "display": 0,  // flex is important for button width and later on
        "flex-direction": 1,  // very important if flex is enabled
        "align-items": -1,
        "text-align": 1,
        "flex": 0,  // affects spacing slightly
      }
    ],
    [
      ".pricing--sonam .pricing__item",
      {
        "margin": 1,
        "padding": 1,
        "cursor": -1,
        "border-radius": 1,
        "background": 1,
        "box-shadow": -1,
        "transition": 0,
      }
    ]
  ],

  /**
   * Fails on stateful/overridden properties.
   * Important to be at the same media-query breakpoint.
   */
  ProductTour: [
    [
      "ul",
      {
        "list-style": -1,
      }
    ],
    [
      ".cd-tour-wrapper",
      {
        "position": 1,
        "z-index": 1,
        "height": 1,
        "left": 1,
        "top": 1,
        "bottom": -1,
        "transform": 1,
        "visibility": 1,  // Overridden by active class
        "opacity": 1,  // Overridden by active class
      }

    ],
    [
      ".cd-tour-wrapper",
      {
        "max-width": 1,
        "max-height": 1,
      }
    ],
    [
      ".cd-tour-wrapper.active",
      {
        "visibility": 1,  // Check this
        "opacity": 1,
        "transition": 0,
      }
    ],
  ],

  /**
   * Media query breakpoint is important here too.
   */
  ResponsiveFullWidthGrid: [
    [
      ".cbp-rfgrid li",
      {
        "width": 1,
      }
    ],
    [
      ".cbp-rfgrid li",
      {
        "position": -1,  // Check this
        "float": 1,
        "overflow": 1,
        "width": -1,  // Overridden by MQ
      }
    ],
  ],

  /**
   * Almost all accurate, except for the pseudo-element `content` property (fix this).
   *
   * TOTAL NON-PREFIXED: 9 (+ 10)
   * TOTAL RELEVANT: 8
   */
  SectionSeparators: [
    [
      "section::before",
      {
        "position": 1,
        "content": 1,
        "pointer-events": -1,
      }
    ],
    [
      ".ss-style-triangles::before",
      {
        "left": 1,
        "width": 1,
        "height": 1,
        "transform": 1,
      }
    ],
    [
      ".ss-style-triangles::before",
      {
        "top": 1,
        "background": 1
      }
    ]
  ],

  /**
   * This one would need a further push to get the clip-path property on the child.
   */
  SegmentEffect: [
    [
      ".segmenter__piece-wrap",
      {
        "position": -1,
        "width": 1,
        "height": 1,
        "top": -1,
        "left": -1,
        "transform-style": -1,
      }
    ],
  ],

  /**
   * Tricky because it relies on another element on the page to use a negative margin.
   */
  "StickyFooter": [
    [      "footer",
      {
        "height": 1,
      }
    ]
  ],

  /**
   * Miscategorizes line height, cursor, pointer events
   */
  TooltipStylesInspiration: [
    [
      ".tooltip:hover .tooltip-content",
      {
        "pointer-events": -1,
        "opacity": 1,
        "transform": -1,
      }
    ],
    [
      ".tooltip-effect-1 .tooltip-content",
      {
        "transform": -1,  // disabled
        "transition": -1,
      }
    ],
    [
      ".tooltip-content",
      {
        "position": 1,
        "z-index": 1,
        "width": 1,
        "left": 1,  // Prevents overflow-x
        "margin": 1,
        "bottom": 1,
        "text-align": 0,
        "font-size": 0,
        "line-height": -1,
        "box-shadow": 0,
        "background": 1,  // Not 0 because having *some* background color is important
        "opacity": 1,  // Base tooltip style, so disabling this makes the others appear
        "cursor": -1,
        "pointer-events": -1, // Check
      }
    ]
  ],

  /**
   * 100%
   */
  VerticalTimeline: [
    [
      ".cbp-tmtimeline > li .cbp_tmicon",
      {
        "width": 1,
        "height": -1,
        "font-family": 1,
        "speak": 0,
        "font-style": -1,
        "font-weight": -1,
        "font-variant": -1,
        "text-transform": -1,
        "font-size": 1,
        "line-height": 1,
        "position": 1,
        "color": 1,
        "background": 1,
        "border-radius": 1,
        "box-shadow": 1,
        "text-align": 1,
        "left": 1,
        "top": 1,
        "margin": 1,
      }
    ]
  ]
};
