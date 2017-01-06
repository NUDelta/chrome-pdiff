// import fs from 'fs-extra';
// import groundtruth from '../results/groundtruth';

// type Results =
//   & { total: number }
//   & { normalized: RuleMatchDiff[] }
//   & { unnormalized: RuleMatchDiff[] };

// /**
//  * Filter out nonzero properties.
//  */
// function nonZeroProps (normalized) {
//   const result = [];

//   for (const rm of normalized) {
//     const positiveDiffs = {};

//     for (const [ prop, diff ] of Object.entries(rm[1])) {
//       if (diff > 0) {
//         positiveDiffs[prop] = diff;
//       }
//     }

//     if (Object.keys(positiveDiffs).length > 0) {
//       result.push([ rm[0], positiveDiffs ]);
//     }
//   }

//   return result;
// }

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

/**
 * Takes a single site and outputs the accuracy.
 */
// export function analyzeResults (title: string, results: JSON) {
//   const hasProp = Object.prototype.hasOwnProperty;

//   if (!hasProp.call(groundtruth, title)) {
//     throw new Error(`No groundtruth saved for property ${title}`);
//   }

//   const gt: RuleMatchDiff[] = groundtruth[title];

//   // Look at unnormalized, but could be anything
//   const rmDiffs: RuleMatchDiff[] = results.unnormalized;

//   /**
//    * There should be the same number of RuleMatchDiffs in the groundtruth and the test results. If not, throw an error.
//    */
//   if (gt.length !== rmDiffs.length) {
//     throw new Error('Groundtruth and actual results differ in number of CSSRules');
//   }

//   /**
//    * False positive properties:
//    * - TRUE SCORE: 0 or -1
//    * - TEST SCORE: > threshold
//    */
//   let falsePositives: number = 0;

//   /**
//    * False negative properties:
//    * - TRUE SCORE: 1
//    * - TEST SCORE: < threshold (-1 or not included)
//    */
//   let falseNegatives: number = 0;

//   /**
//    * Number of properties below-threshold.
//    */
//   let numPropsRemoved: number = 0;
//   let totalProps: number = 0;

//   /**
//    * Iterate over each RuleMatchDiff
//    */
//   for (const rm: RuleMatchDiff of rmDiffs) {
//     // rm is a pair [ selector, CSSStyle ]
//     // const [ , styles ]: CSSStyle = rm;

//     // const
//   }
// }
