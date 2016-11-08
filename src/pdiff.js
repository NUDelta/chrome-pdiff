import fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import co from 'co';

/**
 * Writes a screenshot in either base64 string or PNG form to disk.
 * @param  {string} screenshotDir        output directory for screenshot
 * @param  {string} fileName             filename for screenshot
 * @param  {string | PNG} data           image data in PNG or b64 string form
 * @return {void}
 */
export function writeScreenshot (screenshotDir: string, fileName: string, data: string | PNG): void {
  const screenshotPath = path.resolve(__dirname, '../', screenshotDir, fileName);
  if (typeof data === 'string') {
    fs.writeFile(screenshotPath, data, { encoding: 'base64' });
  } else {
    // Data is a PNG
    data.pack().pipe(fs.createWriteStream(screenshotPath));
  }
}

/**
 * Reads a file at the specified path, and converts it into a PNG object.
 * @param  {string} filePath        path to the PNG file on disk
 * @return {Promise<PNG>}           parsed PNG object
 */
export function fileToPNG (filePath: string): Promise<PNG> {
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
export function stringToPNG (data: string): Promise<PNG> {
  return new Promise((resolve, reject) => {
    // Initiate the source
    const bufferStream = new PassThrough();
    bufferStream.end(new Buffer(data, 'base64'));

    const png = bufferStream.pipe(new PNG());
    png.on('error', (err) => { return reject(err) });
    png.on('parsed', () => { resolve(png) });
  });
}

export function createDiffer (baseImageString) {
  return co(function* () {
    const basePNG = yield stringToPNG(baseImageString);

    const { width, height } = basePNG;

    const differ = (comparisonImageData, writeDiffFile = false, diffFilePath) => {
      const diffPNG = writeDiffFile ? new PNG({ width, height }) : null;
      const comparisonImageBuffer = new Buffer(comparisonImageData, 'base64');
      const diffSize = pixelmatch(basePNG.data, comparisonImageBuffer, diffPNG && diffPNG.data, width, height, { threshold: 0.2 });

      if (writeDiffFile) {
        diffPNG.pack().pipe(fs.createWriteStream(diffFilePath));
      }

      return diffSize;
    };

    return differ;
  });
}
