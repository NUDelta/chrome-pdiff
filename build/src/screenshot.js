'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = screenshotPage;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _stream = require('stream');

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _pngjs = require('pngjs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Reads a file at the specified path, and converts it into a PNG object.
 * @param  {string} filePath        path to the PNG file on disk
 * @return {Promise<PNG>}           parsed PNG object
 */
function fileToPNG(filePath) {
  return new Promise(function (resolve, reject) {
    var png = _fs2.default.createReadStream(filePath).pipe(new _pngjs.PNG());

    png.on('error', function (err) {
      return reject(err);
    });
    png.on('parsed', function () {
      resolve(png);
    });
  });
}

/**
 * Converts PNG image data in b64 format into a PNG object.
 * @param  {string} data            b64 PNG image data
 * @return {Promise<PNG>}           parsed PNG object
 */

function stringToPNG(data) {
  return new Promise(function (resolve, reject) {
    // Initiate the source
    var bufferStream = new _stream.PassThrough();
    bufferStream.end(new Buffer(data, 'base64'));

    var png = bufferStream.pipe(new _pngjs.PNG());
    png.on('error', function (err) {
      return reject(err);
    });
    png.on('parsed', function () {
      resolve(png);
    });
  });
}

/**
 * Writes a screenshot in PNG form to disk.
 * @param  {string} screenshotFilePath   output path for screenshot
 * @param  {string} data                 image data in PNG form
 * @return {void}
 */
function writeScreenshot(screenshotFilePath, data) {
  var outputPath = _path2.default.resolve(__dirname, '../', screenshotFilePath);

  data.pack().pipe(_fs2.default.createWriteStream(outputPath));
}

/**
 * Utility function to capture the screenshot of the current page state.
 */
function captureScreenshot(instance) {
  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
    var Page, response, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            Page = instance.Page;
            _context.next = 3;
            return Page.captureScreenshot();

          case 3:
            response = _context.sent;
            data = response.data;
            return _context.abrupt('return', data);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}

/**
 * Captures a screenshot of the current page state, optionally delaying
 * by a specified number of milliseconds.
 *
 * Returns a Promise which resolves to a string of the data.
 * TODO: Streamify this.
 */
function screenshotPage(instance) {
  var writeToDisk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var screenshotFilePath = arguments[2];
  var delay = arguments[3];

  return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
    var shotString, shotPNG;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!delay) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt('return', new Promise(function (resolve, reject) {
              setTimeout(function () {
                captureScreenshot(instance).then(stringToPNG).then(function (png) {
                  if (writeToDisk) {
                    writeScreenshot(screenshotFilePath, png);
                  }

                  resolve(png);
                }).catch(function (err) {
                  return reject(err);
                });
              }, delay);
            }));

          case 2:
            _context2.next = 4;
            return captureScreenshot(instance);

          case 4:
            shotString = _context2.sent;
            _context2.next = 7;
            return stringToPNG(shotString);

          case 7:
            shotPNG = _context2.sent;


            if (writeToDisk) {
              writeScreenshot(screenshotFilePath, shotPNG);
            }

            return _context2.abrupt('return', shotPNG);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
}
//# sourceMappingURL=screenshot.js.map