// @flow
import { applyPseudoStates } from './chrome/preparePage';
import { getElementStyles, getDocumentRootId } from './chrome/elements';
import { diffRuleMatches, normalizeScores } from './diff/processDiff';

/**
 * Function to execute once the page loads in Canary.
 */
export default async function main (instance: Object, options: Object): void {
  // Get root node
  const rootId: number = await getDocumentRootId(instance);

  // Apply pseudo-states
  if (options.pseudoStatesToForce && options.pseudoStatesToForce.length) {
    await applyPseudoStates(instance, rootId, options);
  }

  // Get element styles
  const ruleMatches: RuleMatch[] = await getElementStyles(instance, rootId, options);

  // Diff everything
  const unnormalized: [ string, DiffResults ][] = await diffRuleMatches(instance, options, ruleMatches);

  /**
   * Get the normalized output for each pair.
   */
  const normalized: [ string, DiffResults ][] = [];

  for (const [ selector, dr ] of unnormalized) {
    normalized.push([ selector, normalizeScores(dr) ]);
  }

  const results = {
    normalized,
    unnormalized,
  };

  console.log(JSON.stringify(results, null, 2));

  instance.close();
}
