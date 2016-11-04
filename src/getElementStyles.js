// @flow
import co from 'co';

/**
 * Get the nodeId of the node matching the given selector.
 * @param  {ChromeRemoteInterface} instance
 * @param  {string}                selector
 * @return {number}                nodeId
 */
export function getNodeId (instance: Object, selector: string): Promise<number> {
  return co(function* () {
    const { DOM } = instance;

    // Get nodeId of document root
    const documentResponse: Object = yield DOM.getDocument();
    const rootId: number = documentResponse.root.nodeId;

    // Get nodeId of selected element
    const queryResponse: Object = yield DOM.querySelector({
      nodeId: rootId,
      selector,
    });
    const selectedNodeId: number = queryResponse.nodeId;

    return selectedNodeId;
  });
}

/**
 * Predicate to filter out RuleMatch objects.
 * @param  {Object} options  contains options for filtering
 * @param  {RuleMatch} rm    a RuleMatch object
 * @return {boolean}         whether to keep the RuleMatch
 */
function keepRuleMatch (options: Object, rm: RuleMatch): boolean {
  const selectorList: SelectorList = rm.rule.selectorList;
  const origin: StyleSheetOrigin = rm.rule.origin;
  const maxRuleSelectors: number = options.maxRuleSelectors;

  /**
   * Disregard rules if any of the following are true:
   * - origin is the user-agent
   * - global selector (*) is used
   * - exceeds the specified upper bound of selectors (probably a reset)
   */
  const exclude = origin === 'user-agent'
    || selectorList.selectors.length > maxRuleSelectors
    || selectorList.selectors.some((selector) => selector.text === '*');

  return !exclude;
}

/**
 * Get the matched styles for an element corresponding to a nodeId.
 * @param  {Object} instance chrome-remote-interface session
 * @param  {Object} options  options object
 * @return {RuleMatch}
 */
export default function getElementStyles (instance: Object, options: Object): Promise<RuleMatch[]> {
  return co(function* () {
    const { CSS } = instance;

    const { selector } = options;

    // Get the nodeId of the element matching the selector
    const nodeId: number = yield getNodeId(instance, selector);

    // Get all matched styles for node
    const matchedStylesResponse: Object = yield CSS.getMatchedStylesForNode({
      nodeId,
      includeInherited: false,
    });

    // Extract only the parts we care about from the matched styles response
    const {
      matchedCSSRules,
      // pseudoElements,
      // cssKeyframesRules,
    }: {
      matchedCSSRules: RuleMatch[],
    } = matchedStylesResponse;

    /**
     * Disregard rules if any of the following are true:
     * - origin is the user-agent
     * - global selector (*) is used
     * - exceeds the specified upper bound of selectors (probably a reset)
     */
    const filteredRuleMatches: RuleMatch[] = matchedCSSRules.filter(keepRuleMatch.bind(null, options));

    return filteredRuleMatches;
  });
}
