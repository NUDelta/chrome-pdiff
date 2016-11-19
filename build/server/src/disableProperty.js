'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = disableProperty;

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Disables the given property within a CSSStyle object.
 *
 * Returns a Promise which resolves to a "re-enabler" function. When invoked, this
 * function re-enables the original property, returning a Promise that resolves to
 * the restored CSSStyle object.
 */
function disableProperty(instance, cssStyle, propName) {
  return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
    var CSS, styleSheetId, styleText, styleRange, styleProperties, prop, propText, styleTextDisabled, response, modifiedStyles, _modifiedStyles, modifiedStyle, modifiedStyleRange, reenabler;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            CSS = instance.CSS;

            // Get styleSheetId, cssText and style range

            styleSheetId = cssStyle.styleSheetId, styleText = cssStyle.cssText, styleRange = cssStyle.range;

            // Get the range and text of the property to be disabled

            styleProperties = cssStyle.cssProperties;
            prop = styleProperties.find(function (p) {
              return p.name === propName;
            });
            propText = prop.text;

            // Construct the replacement text

            styleTextDisabled = styleText.replace(propText, '/* ' + propText + ' */');

            // Disable the style, await the response

            _context.next = 8;
            return CSS.setStyleTexts({
              edits: [{
                styleSheetId: styleSheetId,
                range: styleRange,
                text: styleTextDisabled
              }]
            });

          case 8:
            response = _context.sent;


            // Since the protocol returns a response object, need to destructure
            modifiedStyles = response.styles;
            _modifiedStyles = _slicedToArray(modifiedStyles, 1), modifiedStyle = _modifiedStyles[0];

            // Get the modified range from the modified CSSStyle object

            modifiedStyleRange = modifiedStyle.range;

            // Construct a re-enabler function, restoring the original styleText

            reenabler = function reenabler() {
              return CSS.setStyleTexts({
                edits: [{
                  styleSheetId: styleSheetId,
                  range: modifiedStyleRange,
                  text: styleText
                }]
              });
            };

            return _context.abrupt('return', reenabler);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}
//# sourceMappingURL=disableProperty.js.map