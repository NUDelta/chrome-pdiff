/**
 * Compute statistics for results.
 */
export default function computeStatistics (
  totalPropsBeforeFiltering: number,
  totalPropsBeforePruning: number,
  prunedProps: string[],
): Stats {
  const numFiltered: number = totalPropsBeforeFiltering - totalPropsBeforePruning;
  const numPruned: number = prunedProps.length;

  const percentReductionFromOriginal: number = (numFiltered + numPruned) / totalPropsBeforeFiltering;
  const percentReductionFromFiltered: number = numPruned / totalPropsBeforePruning;

  return {
    original: totalPropsBeforeFiltering,
    numFiltered,
    numPruned,
    prunedProps,
    percentReductionFromOriginal,
    percentReductionFromFiltered,
  };
}
