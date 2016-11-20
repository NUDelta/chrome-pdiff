'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Utility function to capture the screenshot of the current page state.
 */
var captureScreenshot = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(instance) {
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

  return function captureScreenshot(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Captures a screenshot of the current page state, optionally delaying
 * by a specified number of milliseconds.
 *
 * Returns a Promise which resolves to a string of the data.
 * TODO: Streamify this.
 */


var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _stream = require('stream');

var _pngjs = require('pngjs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
exports.default = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(instance) {
    var writeToDisk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var screenshotFilePath = arguments[2];
    var delay = arguments[3];
    var timeout, shotString, shotPNG;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!delay) {
              _context2.next = 4;
              break;
            }

            timeout = function timeout(ms) {
              return new Promise(function (resolve) {
                return setTimeout(resolve, ms);
              });
            };

            _context2.next = 4;
            return timeout(delay);

          case 4:
            _context2.next = 6;
            return captureScreenshot(instance);

          case 6:
            shotString = _context2.sent;
            _context2.next = 9;
            return stringToPNG(shotString);

          case 9:
            shotPNG = _context2.sent;


            if (writeToDisk) {
              writeScreenshot(screenshotFilePath, shotPNG);
            }

            return _context2.abrupt('return', shotPNG);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function screenshotPage(_x2, _x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  }

  return screenshotPage;
}();
//# sourceMappingURL=screenshot.js.map