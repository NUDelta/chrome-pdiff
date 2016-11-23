// @flow
import { PNG } from 'pngjs';
import { stringToPNG, writeScreenshot } from '../fileUtils';

/**
 * Utility function to capture the screenshot of the current page state.
 */
async function captureScreenshot (instance: Object): Promise<string> {
  const { Page } = instance;

  const response: any = await Page.captureScreenshot();
  const data: string = response.data;

  return data;
}

/**
 * Captures a screenshot of the current page state, optionally delaying
 * by a specified number of milliseconds.
 *
 * Returns a Promise which resolves to a string of the data.
 * TODO: Streamify this.
 */
export default async function screenshotPage (instance: Object, writeToDisk: boolean = false, screenshotFilePath?: string, delay?: number): Promise<PNG> {
  if (delay) {
    const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
    await timeout(delay);
  }

  const shotString: string = await captureScreenshot(instance);
  const shotPNG: PNG = await stringToPNG(shotString);

  if (writeToDisk) {
    writeScreenshot(screenshotFilePath, shotPNG);
  }

  return shotPNG;
}
