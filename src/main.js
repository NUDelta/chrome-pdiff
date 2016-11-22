// @flow
import { applyPseudoStates } from './chrome/preparePage';
import { getElementStyles, getDocumentRootId } from './chrome/elements';
import { diffRuleMatches, normalizeScores } from './diff/processDiff';

/**
 * Function to execute once the page loads in Canary.
 */
export default async function main (instance: Object, options: Object) {
  // Get root node
  const rootId: number = await getDocumentRootId(instance);

  // Apply pseudo-states
  if (options.pseudoStatesToForce && options.pseudoStatesToForce.length) {
    await applyPseudoStates(instance, rootId, options);
  }

  // Get element styles
  const ruleMatches: RuleMatch[] = await getElementStyles(instance, rootId, options);

  // Diff everything
  const cssRules: [ string, DiffResults ][] = await diffRuleMatches(instance, options, ruleMatches);

  /**
   * Normalize the output for each pair.
   */
  const normalized: [ string, DiffResults ][] = [];

  for (const [ selector, dr ] of cssRules) {
    normalized.push([ selector, normalizeScores(dr) ]);
  }

  console.log(JSON.stringify(normalized, null, 2));

  instance.close();
}
