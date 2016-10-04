export default function getOwnStyles (instance, options) {
  const { Page, DOM, CSS } = instance;

  /**
   * Get the `nodeId` for the first match of `OPTIONS.selector`
   */
  DOM.getDocument()
    .then((res) => {
      const { nodeId } = res.root;
      const { selector } = options;

      return DOM.querySelector({
        nodeId,
        selector
      });
    })
    .then((res) => {
      /**
       * Match CSS styles without inheritance
       */
      const { nodeId } = res;

      return CSS.getMatchedStylesForNode({
        nodeId,
        includeInherited: false,
      });
    })
    .then((res) => {
      const ownStyles = res.matchedCSSRules
        /**
         * Disregard rules if any of the following are true:
         * - origin is the user-agent
         * - global selector (*) is used
         * - exceeds the specified upper bound of selectors (reset)
         */
        .filter((ruleMatch) => {
          const { selectorList, origin } = ruleMatch.rule;
          const { maxRuleSelectors } = options;

          const exclude = origin === 'user-agent'
            || selectorList.selectors.length > maxRuleSelectors
            || selectorList.selectors.some((selector) => selector.text === '*');

          return !exclude;
        })
        /**
         * Need to filter out implicit CSSProperties, which do not correspond
         * to any SourceRange. Since their objects will not have the `text`
         * field, we can filter on this basis.
         */
        .map((ruleMatch) => {
          const allProps = ruleMatch.rule.style.cssProperties;
          const filteredProps = allProps.filter((prop) => prop.hasOwnProperty('text'));
          const filteredRuleMatch = Object.assign({}, ruleMatch);

          // Set the new filteredProps array
          filteredRuleMatch.rule.style.cssProperties = filteredProps;

          return filteredRuleMatch;
        })
        /**
         * API returns stylesheets in reverse order of application.
         * Rules at the end have the highest precedence/specificity.
         */
        .reverse()
        .map((ruleMatch) => ruleMatch.rule);

      return ownStyles;
    })
    .then((res) => {
      /**
       * Response consists of an array of selectors, with each selector mapped
       * to an array of styles. We can normalize to get an array of styles of the form:
       *   {
       *     styleSheetId: string,
       *     selectors: [string],
       *     cssProperties: [{prop}]
       *   }
       */
      const normalizedRules = res.reduce((acc, rule) => {
        const normalized = Object.assign({}, {
          styleSheetId: rule.styleSheetId,
          selectors: rule.selectorList.selectors.map((selector) => selector.text),
          styles: rule.style.cssProperties,
        });

        return [...acc, normalized];
      }, []);

      return normalizedRules;
    })
    .then((res) => { console.log(JSON.stringify(res, null, 2)) })
    .catch((err) => { console.error(err) });
}
