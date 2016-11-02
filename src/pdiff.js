import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import co from 'co';

function fileToPNG (path) {
  return new Promise((resolve, reject) => {
    const png = fs.createReadStream(path).pipe(new PNG());

    png.on('error', (err) => { return reject(err) });
    png.on('parsed', () => { resolve(png) });
  });
}

function stringToPNG (str) {
  return new Promise((resolve, reject) => {
    const png = new PNG().parse(new Buffer(str, 'base64'), (error, data) => {
      if (error) { reject(new Error(error)); return; }

      resolve(data);
    });
  });
}

export default function createDiffer (baseImageString) {
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
