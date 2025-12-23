/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const RE2 = require('re2');

const getBounceInfo = require('./get-bounce-info');
const isCodeBug = require('./is-code-bug');
const isRetryableError = require('./is-retryable-error');
const logger = require('./logger');

const REGEX_DIAGNOSTIC_CODE = new RE2(/^\d{3} /);

function getErrorCode(err) {
  if (typeof err !== 'object') {
    const err = new Error('Error passed was not an Object');
    err.isCodeBug = true;
    logger.fatal(err);
    return 550;
  }

  //
  // TODO: we should probably not do this property assignment here
  //       and instead manually do it elsewhere and simply just
  //       have `const bounceInfo = getBounceInfo(err)` below
  //
  // get bounce info
  err.bounceInfo = getBounceInfo(err);

  // if it was a code bug
  if (isCodeBug(err)) return 421;

  if (err.bounceInfo.category === 'virus') return 554;
  if (err.bounceInfo.category === 'spam') return 550;
  // hard-coded denylist errors have 550 while others have 421
  if (err.name === 'DenylistError') return err.responseCode;
  if (
    err.bounceInfo.category === 'block' &&
    err.responseCode >= 500 &&
    err.bounceInfo.action === 'reject' &&
    [
      'Using dynamic IP range',
      'Sender is open relay',
      'Sender IP blocked'
    ].includes(err.bounceInfo.message)
  ) {
    return 421;
  }

  if (
    (typeof err.responseCode !== 'number' || err.responseCode >= 500) &&
    err.bounceInfo.action !== 'reject' &&
    err.bounceInfo.category !== 'protocol' &&
    (['defer', 'slowdown'].includes(err.bounceInfo.action) ||
      ['blocklist', 'network', 'protocol', 'policy'].includes(
        err.bounceInfo.category
      ))
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

  if (isRetryableError(err)) return 421;

  // parse diagnostic code if `err.response` was specified
  // (must be between 4xx and 5xx in order to be an error)
  if (
    typeof err.response === 'string' &&
    REGEX_DIAGNOSTIC_CODE.test(err.response)
  ) {
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

  //
  // undici v7 uses statusCode instead of status for ResponseError
  // (must be between 4xx and 5xx in order to be an error)
  //
  if (
    typeof err.statusCode === 'number' &&
    err.statusCode >= 400 &&
    err.statusCode < 600
  ) {
    if ([403, 404].includes(err.statusCode)) return 550;
    if (err.statusCode >= 400 && err.statusCode < 500) return 421;
    return err.statusCode;
  }

  return 550;
}

module.exports = getErrorCode;
