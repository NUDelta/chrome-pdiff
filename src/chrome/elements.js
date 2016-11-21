// @flow

export async function getDocumentRootId (instance: Object): Promise<number> {
  const { DOM } = instance;

  // Get nodeId of document root
  const documentResponse: Object = await DOM.getDocument();
  const rootId: number = documentResponse.root.nodeId;

  return rootId;
}

/**
 * Get the nodeId of the node matching the given selector.
 * @param  {ChromeRemoteInterface} instance
 * @param  {number}                rootId
 * @param  {string}                selector
 * @return {number}                nodeId
 */
export async function getNodeId (instance: Object, rootId: number, selector: string): Promise<number> {
  const { DOM } = instance;

  // Get nodeId of selected element
  const queryResponse: Object = await DOM.querySelector({
    nodeId: rootId,
    selector,
  });
  const selectedNodeId: number = queryResponse.nodeId;

  return selectedNodeId;
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
 * @param  {number} rootId   nodeId of root node
 * @param  {Object} options  options object
 * @return {RuleMatch}
 */
export async function getElementStyles (instance: Object, rootId: number, options: Object): Promise<RuleMatch[]> {
  const { CSS } = instance;


  const { selector } = options;

  // Get the nodeId of the element matching the selector
  const nodeId: number = await getNodeId(instance, rootId, selector);

  // Handle the case where the element is not returned
  if (nodeId === 0) {
    instance.close();
    throw new Error('Selected element not found');
  }

  // Get all matched styles for node
  const matchedStylesResponse: Object = await CSS.getMatchedStylesForNode({
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
}
