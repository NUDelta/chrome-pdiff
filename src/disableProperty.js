// @flow
import co from 'co';

/**
 * Disables the given property within a CSSStyle object.
 *
 * Returns a Promise which resolves to a "re-enabler" function. When invoked, this
 * function re-enables the original property, returning a Promise that resolves to
 * the restored CSSStyle object.
 */
export default function disableProperty (
  instance: Object, cssStyle: CSSStyle, propName: string
): Promise<() => Promise<CSSStyle>> {
  return co(function* () {
    const { CSS }: { CSS: Object } = instance;

    // Get styleSheetId, cssText and style range
    const {
      styleSheetId,
      cssText: styleText,
      range: styleRange,
    } = cssStyle;

    // Get the range and text of the property to be disabled
    const styleProperties: CSSProperty[] = cssStyle.cssProperties;
    const prop: CSSProperty = styleProperties.find((p: CSSProperty) => p.name === propName);
    const propText: string = prop.text;

    // Construct the replacement text
    const styleTextDisabled: string = styleText.replace(propText, `/* ${propText} */`);

    // Disable the style, await the response
    const response: Object = yield CSS.setStyleTexts({
      edits: [{
        styleSheetId,
        range: styleRange,
        text: styleTextDisabled,
      }],
    });

    // Since the protocol returns a response object, need to destructure
    // twice to get the modified CSSStyle object
    const { styles: modifiedStyles }: { styles: CSSStyle[] } = response;
    const [ modifiedStyle ]: CSSStyle = modifiedStyles;

    // Get the modified range from the modified CSSStyle object
    const modifiedStyleRange: SourceRange = modifiedStyle.range;

    // Construct a re-enabler function, restoring the original styleText
    const reenabler: () => Promise<CSSStyle> = () => CSS.setStyleTexts({
      edits: [{
        styleSheetId,
        range: modifiedStyleRange,
        text: styleText,
      }],
    });

    return reenabler;
  });
}
