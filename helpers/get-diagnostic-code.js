/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const RE2 = require('re2');
const isSANB = require('is-string-and-not-blank');
const { convert } = require('html-to-text');

const getErrorCode = require('./get-error-code');

const config = require('#config');

const REGEX_DIAGNOSTIC_CODE = new RE2(/^\d{3} /);

const options = {
  wordwrap: false,
  selectors: [
    { selector: 'img', format: 'skip' },
    { selector: 'ul', options: { itemPrefix: ' ' } },
    {
      selector: 'a',
      options: { baseUrl: config.urls.web, linkBrackets: false }
    }
  ]
};

function getDiagnosticCode(err) {
  if (isSANB(err.response) && REGEX_DIAGNOSTIC_CODE.test(err.response))
    return convert(err.response, options);
  return `${getErrorCode(err)} ${convert(err.message, options)}`;
}

module.exports = getDiagnosticCode;
