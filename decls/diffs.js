// @flow

declare type TestSite = {
  title: string,
  url: string,
  selector: string,
  pseudoElement?: string,
  pseudoStatesToForce?: [{
    selector: string,
    forcePseudoClasses: PseudoClass[],
  }],
};

declare type DiffResults = { [prop: string]: number };

declare type DiffPair = [ string, number ];

declare type Differ = (comparisonPNG: PNG, writeDiffFile: boolean, diffFilePath?: string) => number;
