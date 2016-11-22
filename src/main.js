// @flow
import { applyPseudoStates } from './chrome/preparePage';
import { getElementStyles, getDocumentRootId } from './chrome/elements';
import diffRuleMatches from './diff/processDiff';

/**
 * Function to execute once the page loads in Canary.
 */
export default async function main (instance, options) {
  debugger;

  // Get root node
  const rootId: number = await getDocumentRootId(instance);

  // Apply pseudo-states
  if (options.pseudoStatesToForce.length) {
    await applyPseudoStates(instance, rootId, options);
  }

  // Get element styles
  const ruleMatches: RuleMatch[] = await getElementStyles(instance, rootId, options);

  // Diff everything
  const normalizedResults: DiffResults = await diffRuleMatches(instance, options, ruleMatches);
  console.log(JSON.stringify(normalizedResults, null, 2));

  instance.close();
}
