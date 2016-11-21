// @flow
import { getNodeId } from './elements';

/**
 * Force a pseudo state on a particular element.
 * @param {Object} instance    a Chrome Remote Viewer instance
 * @param {number} rootId      nodeId of document root node
 * @param {String} selector    selector for the element to force
 * @param {PseudoClass[]} forcePseudoStates   array of pseudoclasses to force
 * @return {Promise<void>}
 */
async function forcePseudoState (instance: Object, rootId: number, selector: string, pseudoStatesToForce: PseudoClass[]): Promise<> {
  const { CSS } = instance;

  const nodeId: number = await getNodeId(instance, rootId, selector);

  return CSS.forcePseudoState({
    nodeId,
    forcedPseudoClasses: pseudoStatesToForce,
  });
}

/**
 * Add pseudoclasses to elements on the page before screenshotting.
 */
export async function applyPseudoStates (instance: Object, rootId: number, options: Object): Promise<Object> {
  const { CSS } = instance;
  const { pseudoStatesToForce } = options;

  // If `options.pseudoStatesToForce` was undefined or an empty array, ignore
  if (!pseudoStatesToForce || !pseudoStatesToForce.length) {
    return;
  }

  /**
   * pseudoStates: [{
   *   selector: 'body > div > div.content > div > p:nth-child(1) > span.tooltip.tooltip-effect-1',
   *   forcePseudoClasses: ['hover'],
   * }],
   */

  // Bind the helper promisifier to the current instance.
  const promisify = forcePseudoState.bind(null, instance, rootId);
  const promises = await Promise.all(pseudoStatesToForce.map(ps => promisify(ps.selector, ps.forcePseudoClasses)));

  return instance;
}
