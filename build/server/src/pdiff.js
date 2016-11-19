'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDiffer;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _pngjs = require('pngjs');

var _pixelmatch = require('pixelmatch');

var _pixelmatch2 = _interopRequireDefault(_pixelmatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createDiffer(basePNG) {
  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
    var width, height, differ;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Get the width and height for the base PNG dimensions.
            width = basePNG.width, height = basePNG.height;

            /**
             * Differ function. Basically a partial application of the Pixelmatch
             * diff algorithm, with a closure around the base image.
             */

            differ = function differ(comparisonPNG) {
              var writeDiffFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
              var diffFilePath = arguments[2];

              var diffPNG = writeDiffFile ? new _pngjs.PNG({ width: width, height: height }) : null;

              var diffSize = (0, _pixelmatch2.default)(basePNG.data, comparisonPNG.data, diffPNG && diffPNG.data, width, height, { threshold: 0.2 });

              // Optionally write the diff image to disk.
              if (writeDiffFile) {
                diffPNG.pack().pipe(_fs2.default.createWriteStream(diffFilePath));
              }

              return diffSize;
            };

            return _context.abrupt('return', differ);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}
//# sourceMappingURL=pdiff.js.map