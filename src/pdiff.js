// @flow
import fs from 'fs';
import co from 'co';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export default function createDiffer (basePNG: PNG):
  Promise<(comparisonPNG: PNG, writeDiffFile: boolean, diffFilePath?: string) => number> {
  return co(function* () {
    // Get the width and height for the base PNG dimensions.
    const { width, height } = basePNG;

    /**
     * Differ function. Basically a partial application of the Pixelmatch
     * diff algorithm, with a closure around the base image.
     */
    const differ = (comparisonPNG: PNG, writeDiffFile = false, diffFilePath: string): number => {
      const diffPNG = writeDiffFile ? new PNG({ width, height }) : null;

      const diffSize: number = pixelmatch(basePNG.data, comparisonPNG.data, diffPNG && diffPNG.data, width, height, { threshold: 0.2 });

      // Optionally write the diff image to disk.
      if (writeDiffFile) {
        diffPNG.pack().pipe(fs.createWriteStream(diffFilePath));
      }

      return diffSize;
    };

    return differ;
  });
}
