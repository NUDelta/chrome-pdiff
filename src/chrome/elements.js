// @flow

/**
 * Get the document root nodeId,
 */
export async function getDocumentRootId (instance: Object): Promise<number> {
  const { DOM } = instance;

  // Get nodeId of document root
  const documentResponse: Object = await DOM.getDocument();
  const rootId: number = documentResponse.root.nodeId;

  return rootId;
}

/**
 * Get the nodeId of the node matching the given selector.
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
 */
function keepRuleMatch (options: Object, rm: RuleMatch): boolean {
  const selectorList: SelectorList = rm.rule.selectorList;
  const selectors: Value[] = selectorList.selectors;

  const origin: StyleSheetOrigin = rm.rule.origin;
  const startsWithLetter: RegExp = /^[a-z]/;

  const maxRuleSelectors: number = options.maxRuleSelectors;
  const maxRuleSelectorsForReset: number = 3;

  /**
   * Disregard rules if any of the following are true:
   * - origin is the user-agent
   * - exceeds the specified upper bound of selectors (probably a reset)
   * - global selector (*) is used
   * - > 3 selectors, all beginning with a letter (probably a reset)
   */
  const exclude = origin === 'user-agent'
    || selectors.length > maxRuleSelectors
    || selectors.some(s => s.text === '*');
    // || (selectors.length > maxRuleSelectorsForReset
    //     && selectors.every(s => startsWithLetter.test(s.text)));

  return !exclude;
}

/**
 * Get the children of a given nodeId.
 */
function getChildren (instance: Object, nodeId: number): Promise<Node[]> {
  return new Promise((resolve, reject) => {
    instance.once('DOM.setChildNodes', (params) => {
      clearTimeout();
      const { nodes } = params;
      resolve(nodes);
    });

    instance.DOM.requestChildNodes({
      nodeId,
      depth: -1,
    });

    const waitUntil = 3000;

    setTimeout(reject, waitUntil);
  });
}

/**
 * Get the matched styles for an element corresponding to a nodeId.
 */
export async function getElementStyles (instance: Object, rootId: number, options: Object): Promise<[RuleMatch[], number]> {
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

  // Provisionally set ruleMatches to the matches for the main DOM element.
  let ruleMatches: RuleMatch[] = matchedStylesResponse.matchedCSSRules;

  // Now, check if we're looking for a pseudo element, and grab those styles if so.
  const targetPseudoType: ?PseudoType = options.pseudoElement;

  if (targetPseudoType) {
    const pseudoMatches: PseudoElementMatches[] = matchedStylesResponse.pseudoElements;
    const targetPseudoMatch: ?PseudoElementMatches = pseudoMatches.find(p => p.pseudoType === targetPseudoType);

    if (targetPseudoMatch) {
      // Replace the cached ruleMatches with those of the pseudo element.
      ruleMatches = targetPseudoMatch.matches;
    } else {
      console.error(`Unable to find a pseudo-element :${targetPseudoType} under the specified node. Falling back to the main node...`);
    }
  }

  // Filter out all the relevant RuleMatches (see `keepRuleMatch` predicate definition).
  const filteredRuleMatches: RuleMatch[] = ruleMatches.filter(keepRuleMatch.bind(null, options));

  // Count total number of matched rules so we can quantify heuristic reduction.
  const numPropsBeforeFiltering: number = ruleMatches
    .map(rm => rm.rule.style.cssProperties.length)
    .reduce((prev, next) => prev + next, 0);

  return [
    filteredRuleMatches,
    numPropsBeforeFiltering,
  ];
}
