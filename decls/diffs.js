// @flow

declare type TestSite = {
  title: string,
  type: 'TOY' | 'PROFESSIONAL' | 'URL',
  url: string,
  selector: string,
  pseudoElement?: string,
  pseudoStatesToForce?: [{
    selector: string,
    forcePseudoClasses: PseudoClass[],
  }],
  groundtruth?: string,
};

declare type CSSStyleDiff = { [prop: string]: number };

({
  left: 18476,
  width: 9238,
  height: 9238,
  transform: 9726,
}: CSSStyleDiff);

declare type Differ = (comparisonPNG: PNG, writeDiffFile: boolean, diffFilePath?: string) => number;

/**
 * A tuple containing a matched selector string and a diff results
 * object for the corresponding CSSStyle.
 * @type {Array}
 */
declare type RuleMatchDiff = [ string, CSSStyleDiff ];

([
  '.col-xs',
  {
    left: 18476,
    width: 9238,
    height: 9238,
    transform: 9726,
  },
]: RuleMatchDiff);

declare type Stats = {
  original: number,
  numFiltered: number,
  numPruned: number,
  prunedProps: string[],
  percentReductionFromOriginal: number,
  percentReductionFromFiltered: number,
};

