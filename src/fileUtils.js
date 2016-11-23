import fs from 'fs-extra';
import path from 'path';
import { PNG } from 'pngjs';
import { PassThrough } from 'stream';

const PATH_TO_PROJECT_ROOT = path.resolve(__dirname, '../');
const PATH_TO_RESULTS_ROOT = path.resolve(PATH_TO_PROJECT_ROOT, 'results');

/**
 * Reads a file at the specified path, and converts it into a PNG object.
 * @param  {string} filePath        path to the PNG file on disk
 * @return {Promise<PNG>}           parsed PNG object
 */
export function fileToPNG (filePath: string): Promise<PNG> {
  return new Promise((resolve, reject) => {
    const png = fs.createReadStream(filePath).pipe(new PNG());

    png.on('error', err => reject(err));
    png.on('parsed', () => resolve(png));
  });
}

/**
 * Converts PNG image data in b64 format into a PNG object.
 * @param  {string} data            b64 PNG image data
 * @return {Promise<PNG>}           parsed PNG object
 */
export function stringToPNG (data: string): Promise<PNG> {
  return new Promise((resolve, reject) => {
    // Initiate the source
    const bufferStream = new PassThrough();
    bufferStream.end(new Buffer(data, 'base64'));

    const png = bufferStream.pipe(new PNG());
    png.on('error', err => reject(err));
    png.on('parsed', () => resolve(png));
  });
}

/**
 * Writes a screenshot in PNG form to disk.
 * @param  {string} screenshotFilePath   output path for screenshot
 * @param  {string} data                 image data in PNG form
 * @return {void}
 */
export function writeScreenshot (screenshotFilePath: string, data: PNG): void {
  // const outputPath = path.resolve(PATH_TO_PROJECT_ROOT, );
  data.pack().pipe(fs.createWriteStream(screenshotFilePath));
}

export async function makeSiteResultsDir (title: string, screenshotsDirPath?: string): Promise<string> {
  const siteResultsDir: string = path.resolve(PATH_TO_RESULTS_ROOT, title);

  /**
   * Ensures that a directory is empty.
   * Deletes directory contents if the directory is not empty.
   * If the directory does not exist, it is created.
   */
  await new Promise((resolve, reject) => {
    fs.emptyDir(siteResultsDir, (err) => {
      if (err) {
        console.error('Could not create results directory:', err);
        reject(err);
        return;
      }

      // Create the screenshots subdirectory if a path is given.
      if (screenshotsDirPath) {
        const subdir: string = path.resolve(siteResultsDir, screenshotsDirPath);

        fs.emptyDir(subdir, (screenshotDirError) => {
          if (screenshotDirError) {
            console.error('Could not create screenshot results subdirectory:', screenshotDirError);
            reject(screenshotDirError);
            return;
          }

          resolve();
        });
      } else {
        resolve();
      }
    });
  }).catch(err => console.error(err));

  return siteResultsDir;
}

export function writeResults (to: string, data: JSON): Promise<JSON> {
  return new Promise((resolve, reject) => {
    fs.writeJSON(to, data, (err) => {
      if (err) {
        console.error('Error writing JSON output:', err);
        reject(err);
        return;
      }

      resolve();
    });
  });
}
