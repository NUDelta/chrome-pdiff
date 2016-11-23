// @flow
import fs from 'fs-extra';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export default function createDiffer (basePNG: PNG):
  Promise<Differ> {
    // Get the width and height for the base PNG dimensions.
  const { width, height } = basePNG;

  /**
   * Differ function. Basically a partial application of the Pixelmatch
   * diff algorithm, with a closure around the base image.
   */
  const differ = (comparisonPNG: PNG, writeDiffFile = false, diffFilePath: string): number => {
    const diffPNG = writeDiffFile ? new PNG({ width, height }) : null;

    const diffArgs = [
      basePNG.data,
      comparisonPNG.data,
      diffPNG && diffPNG.data,
      width,
      height,
      { threshold: 0.01 },
    ];

    const diffSize: number = pixelmatch(...diffArgs);

    // Optionally write the diff image to disk, if diff is nonzero.
    if (writeDiffFile && diffSize > 0) {
      diffPNG.pack().pipe(fs.createWriteStream(diffFilePath));
    }

    return diffSize;
  };

  return Promise.resolve(differ);
}
