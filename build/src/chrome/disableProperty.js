"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Disables the given property within a CSSStyle object.
 *
 * Returns a Promise which resolves to a "re-enabler" function. When invoked, this
 * function re-enables the original property, returning a Promise that resolves to
 * the restored CSSStyle object.
 */
exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(instance, cssStyle, propName) {
    var CSS, styleSheetId, styleText, styleRange, styleProperties, prop, propText, styleTextDisabled, response, modifiedStyles, modifiedStyle, modifiedStyleRange, reenabler;
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

            styleTextDisabled = styleText.replace(propText, "/* " + propText + " */");

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
            modifiedStyle = modifiedStyles[0];

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

            return _context.abrupt("return", reenabler);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function disableProperty(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  }

  return disableProperty;
}();
//# sourceMappingURL=disableProperty.js.map