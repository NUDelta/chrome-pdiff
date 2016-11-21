// @flow

type TestSite = {
  url: string,
  selector: string,
  pseudoStatesToForce?: [{
    selector: string,
    forcePseudoClasses: PseudoClass[],
  }],
};

type DiffResults = { [prop: string]: number };

type DiffPair = [ string, number ];
