const { boolean } = require('boolean');
const RE2 = require('re2');

const REGEX_TLS_ERR = new RE2(
  /disconnected\s+before\s+secure\s+tls\s+connection\s+was\s+established/im
);

function isTLSError(err) {
  return boolean(
    err.isTLSError === true ||
      (typeof err.code === 'string' && err.code === 'ETLS') ||
      (typeof err.message === 'string' && REGEX_TLS_ERR.test(err.message)) ||
      err.cert ||
      (typeof err.code === 'string' && err.code.startsWith('ERR_TLS_'))
  );
}

module.exports = isTLSError;
