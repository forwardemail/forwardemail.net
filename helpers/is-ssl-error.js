const { boolean } = require('boolean');
const RE2 = require('re2');

const REGEX_SSL_ERR = new RE2(
  /ssl routines|ssl23_get_server_hello|\/deps\/openssl|ssl3_check/im
);

function isSSLError(err) {
  return boolean(
    (typeof err.code === 'string' && err.code.startsWith('ERR_SSL_')) ||
      (typeof err.message === 'string' && REGEX_SSL_ERR.test(err.message)) ||
      (typeof err.library === 'string' && err.library === 'SSL routines')
  );
}

module.exports = isSSLError;
