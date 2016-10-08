function disableStyle (instance, styleSheetId, ruleRange, ruleText) {
  const { CSS } = instance;

  const edits = [{
    styleSheetId,
    range,
    text,
  }];

  return CSS.setStyleTexts({ edits });
}

export default function toggleElementStyles (instance, options, rules) {
  const { CSS } = instance;

  // First just try disabling one rule
  const rule = rules[0];

  const { styleSheetId, styles } = rule;
  const style = styles[0];
  const styleText = style.text;
  const { ruleText } = rule;
  const range = rule.ruleRange;

  // for each rule:
  //   // rule is an object, with fields
  //   // styleSheetId, [styles], text, ruleRange
  //   { styleSheetId, styles, ruleText, ruleRange } = rule
  //
  //   for each style:
  //      toggle it off
  //      screenshot and cache buffer
  //      toggle it on
  //      return Promise
  //   return array of screenshot promises for all styles in rule
  //
  // flatten arrays of promises for all rules
  // return array of screenshot promises for all styles in all rules

  const newText = ruleText.replace(styleText, `/* ${styleText} */`);

  const edits = [{
    styleSheetId,
    range,
    text: newText,
  }];

  return CSS.setStyleTexts({ edits })
    .then((res) => {
      const { styles } = res;
      const rule = styles[0];

      console.log('HELLO');
      console.log(styles);

      const { styleSheetId, cssText, range } = rule;

      const newEdit = {
        styleSheetId,
        range,
        text: cssText.replace(/(\/\* | \*\/)/g, ''),
      };

      return CSS.setStyleTexts({ edits: [ newEdit ] });
      // console.log(edits);
    })
    .then((res) => {
      return res;
    })
    // .then((res) => console.log(JSON.stringify(res, null, 4)))
    .catch((err) => console.error(err));
}
