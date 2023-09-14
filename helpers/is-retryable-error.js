const isTimeoutError = require('./is-timeout-error');
const isSocketError = require('./is-socket-error');

const HTTP_RETRY_STATUS_CODES = new Set([408, 413, 429, 550]);

const HTTP_RETRY_ERROR_CODES = new Set([
  'ETIMEDOUT',
  //
  // NOTE: ECONNABORTED occurs when the request times out
  //       <https://github.com/visionmedia/superagent/blob/29fd1f917a6cc78c9a2a9984269c06f8b4e63dcb/src/request-base.js#L773>
  //       (and we should indicate SMTP response to retry later in case the webhook server resolves itself)
  //
  'ECONNABORTED',
  'ECONNRESET',
  'EADDRINUSE',
  'ECONNREFUSED',
  'EPIPE',
  'ENOTFOUND',
  'ENETUNREACH',
  'EAI_AGAIN',
  'EADDRNOTAVAIL',

  // undici related errors
  // <https://github.com/nodejs/undici/blob/main/docs/api/Errors.md>
  'UND_ERR',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_HEADERS_TIMEOUT',
  'UND_ERR_HEADERS_OVERFLOW',
  'UND_ERR_BODY_TIMEOUT',
  // NOTE: we do not want to include this: 'UND_ERR_RESPONSE_STATUS_CODE'
  'UND_ERR_INVALID_ARG',
  'UND_ERR_INVALID_RETURN_VALUE',
  'UND_ERR_ABORTED',
  'UND_ERR_DESTROYED',
  'UND_ERR_CLOSED',
  'UND_ERR_SOCKET',
  'UND_ERR_NOT_SUPPORTED',
  'UND_ERR_REQ_CONTENT_LENGTH_MISMATCH',
  'UND_ERR_RES_CONTENT_LENGTH_MISMATCH',
  'UND_ERR_INFO',
  'UND_ERR_RES_EXCEEDED_MAX_SIZE'
]);

// <https://github.com/nodejs/node/blob/08dd4b1723b20d56fbedf37d52e736fe09715f80/lib/dns.js#L296-L320>
// <https://docs.rs/c-ares/4.0.3/c_ares/enum.Error.html>
const DNS_RETRY_CODES = new Set([
  'EADDRGETNETWORKPARAMS',
  'EBADFAMILY',
  'EBADFLAGS',
  'EBADHINTS',
  'EBADNAME',
  'EBADQUERY',
  'EBADRESP',
  'EBADSTR',
  'ECANCELLED',
  'ECONNREFUSED',
  'EDESTRUCTION',
  'EFILE',
  'EFORMERR',
  'ELOADIPHLPAPI',
  'ENODATA',
  'ENOMEM',
  'ENONAME',
  'ENOTFOUND',
  'ENOTIMP',
  'ENOTINITIALIZED',
  'EOF',
  'EREFUSED',
  'ESERVFAIL',
  'ETIMEOUT'
]);

const MAIL_RETRY_ERROR_CODES = new Set([
  'ECONNRESET',
  'ESOCKET',
  'ECONNECTION',
  'ETIMEDOUT',
  'EDNS',
  'EPROTOCOL'
]);

function isRetryableError(err) {
  if (isTimeoutError(err)) return true;
  if (isSocketError(err)) return true;

  if (
    typeof err.code === 'string' &&
    (DNS_RETRY_CODES.has(err.code) ||
      HTTP_RETRY_ERROR_CODES.has(err.code) ||
      MAIL_RETRY_ERROR_CODES.has(err.code))
  )
    return true;

  if (typeof err.status === 'number' && HTTP_RETRY_STATUS_CODES.has(err.status))
    return true;

  return false;
}

module.exports = isRetryableError;
