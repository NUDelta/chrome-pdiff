# chrome-pdiff

Computes the visual importance of individual CSS properties, given a URL and a selector for an element on that page.

Instruments the [Chrome Debugging Protocol](https://developer.chrome.com/devtools/docs/debugger-protocol) through the [chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface), in order to:

1. Load the page
2. Capture a “before” screenshot
3. Iteratively disable, screenshot, and re-enable the matched styles for that element
4. Compute the pixel-by-pixel difference ("pdiff") between the "before" and "after" screenshots, to identify which properties contribute the most to the page’s visual appearance.

A small proof of concept as part of my research through the [Delta Lab](http://delta.northwestern.edu). [Why?](#motivation)

## Prerequisites

You must have [Chrome Canary](https://www.google.com/chrome/browser/canary.html) installed and accessible through `/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary`.

Edit `config.js` to specify the site to test. A test site configuration has the following type structure:

```js
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
```

## Running

```
# Fire up a Canary instance with remote debugging over port `9222`
npm run chrome

# Start instrumenting Canary according to `config.js`
npm run start
```

## Development

### Inspecting the Protocol

```
# Wrapper around chrome-remote-interface's REPL client
npm run inspect
```

### Linting and Typechecking

```
npm run lint
npm run flow
```

### Debugging

To continuously compile files with sourcemaps, use tmux or iTerm panes to run

```
npm run build:src
npm run build:index
npm run build:config
```

because I don't want to get an actual build tool.

From there, we can use [denode](https://github.com/steelbrain/denode) on the transpiled output:

```
npm run debug
```

<a name="motivation"></a>
## Motivation

The motivation for this particular approach came from watching novices use the DevTools to reverse-engineer CSS. Many toggled properties on and off to understand their effects; this project is a proof of concept to explore whether automating this process might aid learners.

Part of a larger research project to explore heuristics for helping learners "program slice" professional websites by determining which properties are relevant, and which they can ignore.

