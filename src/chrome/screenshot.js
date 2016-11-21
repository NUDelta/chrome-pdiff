// @flow
import fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';
import { PNG } from 'pngjs';

/**
 * Reads a file at the specified path, and converts it into a PNG object.
 * @param  {string} filePath        path to the PNG file on disk
 * @return {Promise<PNG>}           parsed PNG object
 */
function fileToPNG (filePath: string): Promise<PNG> {
  return new Promise((resolve, reject) => {
    const png = fs.createReadStream(filePath).pipe(new PNG());

    png.on('error', (err) => { return reject(err) });
    png.on('parsed', () => { resolve(png) });
  });
}

/**
 * Converts PNG image data in b64 format into a PNG object.
 * @param  {string} data            b64 PNG image data
 * @return {Promise<PNG>}           parsed PNG object
 */
function stringToPNG (data: string): Promise<PNG> {
  return new Promise((resolve, reject) => {
    // Initiate the source
    const bufferStream = new PassThrough();
    bufferStream.end(new Buffer(data, 'base64'));

    const png = bufferStream.pipe(new PNG());
    png.on('error', (err) => { return reject(err) });
    png.on('parsed', () => { resolve(png) });
  });
}

/**
 * Writes a screenshot in PNG form to disk.
 * @param  {string} screenshotFilePath   output path for screenshot
 * @param  {string} data                 image data in PNG form
 * @return {void}
 */
function writeScreenshot (screenshotFilePath: string, data: PNG): void {
  const outputPath = path.resolve(__dirname, '../../', screenshotFilePath);

  data.pack().pipe(fs.createWriteStream(outputPath));
}

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
    const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await timeout(delay);
  }

  const shotString: string = await captureScreenshot(instance);
  const shotPNG: PNG = await stringToPNG(shotString);

  if (writeToDisk) {
    writeScreenshot(screenshotFilePath, shotPNG);
  }

  return shotPNG;
}
