/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('lodash');
const splitLines = require('split-lines');
const { convert } = require('html-to-text');

const getErrorCode = require('./get-error-code');
const isCodeBug = require('./is-code-bug');
const logger = require('./logger');

const env = require('#config/env');

// this is sourced from FE original codebase
function refineAndLogError(err, session, isIMAP = false, instance) {
  // handle programmer mistakes
  // (don't re-check if we already checked)
  if (typeof err.isCodeBug !== 'boolean') {
    err.isCodeBug = isCodeBug(err);
    if (err.isCodeBug) {
      logger.fatal(err, { session });
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
      .catch((err) => logger.fatal(err, { session }));
  }

  // if it was HTTP error and no `responseCode` set then try to parse it
  // into a SMTP-friendly format for error handling
  err.responseCode = getErrorCode(err);

  // rewrite message to keep the underlying code issue private to end users
  // (this also prevents double logger invocation for code bugs)
  if (err.isCodeBug && !err._message) {
    // store original message (for debugging by team)
    err._message = err.message;
    // set new message for rendering to users
    err.message =
      'An internal server error has occurred, please try again later.';
    // wildduck uses `responseMessage` in some instances
    err.responseMessage = err.message;
  } else {
    logger.error(err, { session });
  }

  //
  // TODO: we should also mirror this to FE MX source
  //
  // NOTE: this was inspired from `koa-better-error-handler` response for API endpoints
  // (and it is used because some errors are translated with HTML tags, e.g. notranslate)
  //
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
  // NOTE: IMAP expects "response" of "NO" for permanent errors
  // (otherwise it's a "TEMPFAIL")
  //
  // <https://github.com/nodemailer/wildduck/issues/511>
  //
  if (isIMAP) {
    // wildduck uses `responseMessage` in some instances
    err.responseMessage = err.message;
    if (err.isCodeBug) err.response = 'TEMPFAIL';
    else if (err.responseCode >= 500) err.response = 'NO';
  }

  return err;
}

module.exports = refineAndLogError;
