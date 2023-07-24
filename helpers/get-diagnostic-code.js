const RE2 = require('re2');
const isSANB = require('is-string-and-not-blank');

const getErrorCode = require('./get-error-code');

const REGEX_DIAGNOSTIC_CODE = new RE2(/^\d{3} /);

function getDiagnosticCode(err) {
  if (isSANB(err.response) && REGEX_DIAGNOSTIC_CODE.test(err.response))
    return err.response;
  return `${getErrorCode(err)} ${err.message}`;
}

module.exports = getDiagnosticCode;
