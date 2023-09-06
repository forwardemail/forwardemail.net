const RE2 = require('re2');
const isSANB = require('is-string-and-not-blank');

const logger = require('./logger');
const isNodemailerError = require('./is-nodemailer-error');
const isCodeBug = require('./is-code-bug');

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
  // 'UND_ERR_RESPONSE_STATUS_CODE',
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

const REGEX_DIAGNOSTIC_CODE = new RE2(/^\d{3} /);

// eslint-disable-next-line complexity
function getErrorCode(err) {
  if (typeof err !== 'object') {
    logger.fatal(new Error('Error passed was not an Object'), {
      err
    });
    return 550;
  }

  // if it was a code bug
  if (
    err.isCodeBug === true ||
    (typeof err.isCodeBug !== 'boolean' && isCodeBug(err))
  )
    return 421;

  //
  // <https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes>
  // (must be between 4xx and 5xx in order to be an error)
  //
  if (
    typeof err.responseCode === 'number' &&
    err.responseCode >= 400 &&
    err.responseCode < 600
  )
    return err.responseCode;

  if (
    // p-timeout has err.name = "TimeoutError"
    err.name === 'TimeoutError' ||
    (isSANB(err.code) &&
      (DNS_RETRY_CODES.has(err.code) ||
        HTTP_RETRY_ERROR_CODES.has(err.code))) ||
    (typeof err.status === 'number' && HTTP_RETRY_STATUS_CODES.has(err.status))
  )
    return 421;

  if (isNodemailerError(err)) return 421;

  // parse diagnostic code if `err.response` was specified
  // (must be between 4xx and 5xx in order to be an error)
  if (isSANB(err.response) && REGEX_DIAGNOSTIC_CODE.test(err.response)) {
    const code = Number.parseInt(err.response.slice(0, 3), 10);
    if (typeof code === 'number' && code >= 400 && code < 600) return code;
  }

  //
  // if it was a boom error that was either forbidden (403) or notFound (404) then reject
  // otherwise if it was a 4xx error then set the status code to 421 (try again later / deferred)
  //
  if (err.isBoom === true && typeof err?.output?.statusCode === 'number') {
    if ([403, 404].includes(err.output.statusCode)) return 550;

    if (err.output.statusCode >= 400 && err.output.statusCode < 500) return 421;
  }

  return 550;
}

module.exports = getErrorCode;
