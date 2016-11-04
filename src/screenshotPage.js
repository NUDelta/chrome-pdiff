// @flow
import co from 'co';

/**
 * Utility function to capture the screenshot of the current page state.
 */
function captureScreenshot (instance: Object): Promise<string> {
  return co(function* () {
    const { Page } = instance;

    const response: any = yield Page.captureScreenshot();
    const data: string = response.data;

    return data;
  });
}

/**
 * Captures a screenshot of the current page state, optionally delaying
 * by a specified number of milliseconds.
 *
 * Returns a Promise which resolves to a string of the data.
 * TODO: Streamify this.
 */
export default function screenshotPage (instance: Object, delay?: number): Promise<string> {
  if (delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        captureScreenshot(instance)
          .then((b64) => resolve(b64))
          .catch((err) => reject(err));
      }, delay);
    });
  }

  return captureScreenshot(instance);
}
