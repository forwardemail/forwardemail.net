/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const splitLines = require('split-lines');
const striptags = require('striptags');
// const { convert } = require('html-to-text');

const getErrorCode = require('./get-error-code');
const isRetryableError = require('./is-retryable-error');
const isLockingError = require('./is-locking-error');
const isCodeBug = require('./is-code-bug');
const logger = require('./logger');
const _ = require('#helpers/lodash');

// const env = require('#config/env');

// this is sourced from FE original codebase
function refineAndLogError(err, session, isIMAP = false, instance) {
  // handle programmer mistakes
  // (don't re-check if we already checked)
  if (typeof err.isCodeBug !== 'boolean') {
    err.isCodeBug = isCodeBug(err);
    if (err.isCodeBug) {
      logger.fatal(err, { session, resolver: instance?.resolver });
      err.responseCode = 421;
    }
  }

  // clear caches for the given alias
  if (
    instance?.client &&
    err.code === 'SQLITE_ERROR' &&
    session?.user?.alias_id
  ) {
    Promise.all([
      instance.client.del(`refresh_check:${session.user.alias_id}`),
      instance.client.del(`migrate_check:${session.user.alias_id}`),
      instance.client.del(`folder_check:${session.user.alias_id}`),
      instance.client.del(`trash_check:${session.user.alias_id}`)
    ])
      .then()
      .catch((err) =>
        logger.fatal(err, { session, resolver: instance?.resolver })
      );
  }

  // if it was HTTP error and no `responseCode` set then try to parse it
  // into a SMTP-friendly format for error handling
  err.responseCode = getErrorCode(err);

  // rewrite message to keep the underlying code issue private to end users
  // (this also prevents double logger invocation for code bugs)
  if (err.isCodeBug && !err._message) {
    if (!err.isBoom) {
      // store original message (for debugging by team)
      err._message = err.message;
      // set new message for rendering to users
      err.message =
        'An internal server error has occurred, please try again later.';
    }

    // wildduck uses `responseMessage` in some instances
    err.responseMessage = err.message;
  } else {
    logger.error(err, { session, resolver: instance?.resolver });
  }

  //
  // TODO: this could possibly be replaced with striptags (?)
  //
  // TODO: we should also mirror this to FE MX source
  //
  // NOTE: this was inspired from `koa-better-error-handler` response for API endpoints
  // (and it is used because some errors are translated with HTML tags, e.g. notranslate)
  //
  err.message = striptags(err.message);
  /*
  err.message = convert(err.message, {
    wordwrap: false,
    selectors: [
      {
        selector: 'a',
        options: {
          hideLinkHrefIfSameAsText: true,
          baseUrl: env.ERROR_HANDLER_BASE_URL || ''
        }
      },
      { selector: 'img', format: 'skip' }
    ],
    linkBrackets: false
  });
  */

  //
  // replace linebreaks
  //
  // (otherwise you will get DATA command failed if this is RCPT TO command if you have multiple linebreaks)
  //
  const lines = splitLines(err.message);

  //
  // NOTE: we join lines together by ";", then split, then make unique, then join again
  //
  // set the new message
  err.message = _.uniq(lines.join('; ').split('; '))
    .join('; ')
    .split(';;')
    .join(';');

  //
  // IMAP Response Code
  // <https://datatracker.ietf.org/doc/html/rfc5530>
  // <https://github.com/nodemailer/wildduck/issues/511>
  // <https://github.com/nodemailer/wildduck/issues/707>
  // <https://www.iana.org/assignments/imap-response-codes/imap-response-codes.xhtml>
  //
  if (isIMAP) {
    // wildduck uses `responseMessage` in some instances
    err.responseMessage = err.message;
    if (!err.imapResponse) {
      if (isLockingError(err)) err.imapResponse = 'INUSE';
      else if (
        isRetryableError(err) ||
        err.isCodeBug ||
        err.responseCode >= 500
      )
        err.imapResponse = 'UNAVAILABLE';
    }

    //
    // NOTE: do not set `err.response` here since WildDuck uses it internally
    //       (e.g. NO or BAD must be value of err.response for commands like AUTHENTICATE PLAIN
    //       (otherwise the client will think that the authentication succeeded)
    //
  }

  return err;
}

module.exports = refineAndLogError;
