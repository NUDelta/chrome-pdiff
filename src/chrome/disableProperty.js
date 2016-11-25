// @flow

/**
 * Disables the given property within a CSSStyle object.
 *
 * Returns a Promise which resolves to a "re-enabler" function. When invoked, this
 * function re-enables the original property, returning a Promise that resolves to
 * the restored CSSStyle object.
 */
export default async function disableProperty (
  instance: Object, cssStyle: CSSStyle, propName: string
): Promise<() => Promise<CSSStyle>> | Promise<Error> {
  const { CSS }: { CSS: Object } = instance;

  // Get styleSheetId, cssText and style range
  const {
    styleSheetId,
    cssText: styleText,
    range: styleRange,
  } = cssStyle;

  if (!styleText || !styleRange) {
    return new Error('CSSStyle missing property cssText or range');
  }

  // Get the range and text of the property to be disabled
  const styleProperties: CSSProperty[] = cssStyle.cssProperties;
  const prop: CSSProperty = styleProperties.find((p: CSSProperty) => p.name === propName);

  /**
   * Properties that are expansions of shorthand properties (e.g. `transition-duration`) will
   * not have their own SourceRange or even text.
   * Can't disable these independently, so throw an error,
   * which will be handled in the upper scope.
   */
  if (!prop.text || !prop.range) {
    return new Error(`Property ${prop.name} has no SourceRange`);
  }

  // Construct the replacement text
  const styleTextDisabled: string = styleText.replace(prop.text, `/* ${prop.text} */`);

  let response: ?Object;
  try {
    response = await CSS.setStyleTexts({
      edits: [{
        styleSheetId,
        range: styleRange,
        text: styleTextDisabled,
      }],
    });
  } catch (err) {
    console.error(`Couldn't disable property ${propName}`, err);
  }

  // Since the protocol returns a response object, need to destructure
  // twice to get the modified CSSStyle object
  const modifiedStyles: CSSStyle[] = response.styles;
  const modifiedStyle: CSSStyle = modifiedStyles[0];

  if (!modifiedStyle.range) {
    return new Error(`No SourceRange for CSSStyle returned after disabling property ${prop.name}`);
  }

  // Get the modified range from the modified CSSStyle object
  const modifiedStyleRange: SourceRange = modifiedStyle.range;

  // Construct a re-enabler function, restoring the original styleText
  const reenabler: () => Promise<CSSStyle> = () => CSS.setStyleTexts({
    edits: [{
      styleSheetId,
      range: modifiedStyleRange,
      text: styleText,
    }],
  }).catch(err => console.error(err));

  return reenabler;
}
