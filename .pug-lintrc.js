/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

module.exports = {
  extends: '@ladjs/pug-lint-config-lad',

  // <https://github.com/pugjs/pug-lint/blob/master/docs/rules.md>
  disallowAttributeConcatentation: true,
  disallowAttributeInterpolation: true,
  disallowClassAttributeWithStaticValue: true,
  disallowDuplicateAttributes: true,
  disallowHtmlText: true,
  disallowIdAttributeWithStaticValue: true,
  disallowLegacyMixinCall: true,
  disallowMultipleLineBreaks: true,
  disallowStringConcatenation: 'aggressive',
  disallowTrailingSpaces: true,
  requireLineFeedAtFileEnd: true,
  requireLowerCaseTags: true,
  requireSpaceAfterCodeOperator: true,
  requireStrictEqualityOperators: true,
  validateIndentation: 2,
  validateLineBreaks: 'LF',
  validateSelfClosingTags: true,
  validateTemplateString: true
};
