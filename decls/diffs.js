// @flow

type TestSite = {
  title: string,
  url: string,
  selector: string,
  pseudoElement?: string,
  pseudoStatesToForce?: [{
    selector: string,
    forcePseudoClasses: PseudoClass[],
  }],
};

type DiffResults = { [prop: string]: number };

type DiffPair = [ string, number ];

type Differ = (comparisonPNG: PNG, writeDiffFile: boolean, diffFilePath?: string) => number;
