/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const splitLines = require('split-lines');
const striptags = require('striptags');
// const { convert } = require('html-to-text');

const getErrorCode = require('./get-error-code');
const isRetryableError = require('./is-retryable-error');
const isTimeoutError = require('./is-timeout-error');
const isLockingError = require('./is-locking-error');
const isCodeBug = require('./is-code-bug');
const logger = require('./logger');
const _ = require('#helpers/lodash');

//
// Patterns that indicate internal infrastructure details which must never
// be exposed to end users in SMTP responses or bounce notifications.
//
const INTERNAL_MESSAGE_PATTERNS = [
  'WebSocket request was rejected by timeout',
  'WebSocket closed with reason',
  'wsp.open() timed out',
  'wsp.open() failed',
  'RequestId:',
  'sqlite-client',
  'SQLITE_PORT',
  'worker affinity fallback'
];

const env = require('#config/env');

// an email address in angle brackets, e.g. <user@example.com>
// (no whitespace, quotes or slashes, and a hostname after the "@", so what is
// kept can never be parsed as an HTML tag with attributes, such as
// <svg/onload=...@x>)
const REGEX_BRACKETED_ADDRESS = /<([^<>\s"'/\\]+@[a-z\d.-]+)>/gi;

function keepBracketedAddresses(message, fn) {
  if (typeof message !== 'string') return fn(message);
  const addresses = [];
  const escaped = message.replace(REGEX_BRACKETED_ADDRESS, (match) => {
    addresses.push(match);
    return `\uE000${addresses.length - 1}\uE001`;
  });
  return fn(escaped).replace(
    /\uE000(\d+)\uE001/g,
    (match, index) => addresses[Number(index)] ?? match
  );
}

// this is sourced from FE original codebase
function refineAndLogError(err, session, isIMAP = false, instance) {
  // handle programmer mistakes
  // (don't re-check if we already checked)
  if (typeof err.isCodeBug !== 'boolean') {
    err.isCodeBug = isCodeBug(err);
    if (err.isCodeBug) {
      console.error(
        '[ERROR:refineAndLogError] code bug detected',
        JSON.stringify({
          errName: err?.name,
          errMessage: (err?._message || err?.message || '')?.slice(0, 500),
          errCode: err?.code,
          errStack: err?.stack?.slice(0, 300),
          aliasId: session?.user?.alias_id,
          aliasName: session?.user?.alias_name,
          domainName: session?.user?.domain_name,
          storageLocation: session?.user?.storage_location
        })
      );
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

  //
  // FTS5 auto-repair: immediately fix corrupt FTS5 index on the next
  // IMAP operation that hits it (don't wait for deferred maintenance)
  //
  if (
    session?.db?.open &&
    !session.db.inTransaction &&
    (err.code === 'SQLITE_CORRUPT_VTAB' ||
      (err.message &&
        (err.message.includes('database disk image is malformed') ||
          err.message.includes('no such table: Messages_fts'))))
  ) {
    try {
      const hasFts = session.db.pragma('table_list(Messages_fts)').length > 0;
      if (hasFts && env.SQLITE_FTS5_ENABLED) {
        // FTS5 is enabled — attempt rebuild
        try {
          session.db.exec(
            `INSERT INTO Messages_fts(Messages_fts) VALUES('rebuild')`
          );
        } catch {
          // Rebuild failed — drop as last resort
          session.db.exec('DROP TRIGGER IF EXISTS Messages_ai');
          session.db.exec('DROP TRIGGER IF EXISTS Messages_ad');
          session.db.exec('DROP TRIGGER IF EXISTS Messages_au');
          session.db.exec('DROP TABLE IF EXISTS Messages_fts');
        }
      } else {
        // FTS5 is disabled or table is missing — drop orphaned triggers
        // (handles the "no such table: Messages_fts" case where triggers
        // reference a table that no longer exists)
        session.db.exec('DROP TRIGGER IF EXISTS Messages_ai');
        session.db.exec('DROP TRIGGER IF EXISTS Messages_ad');
        session.db.exec('DROP TRIGGER IF EXISTS Messages_au');
        session.db.exec('DROP TABLE IF EXISTS Messages_fts');
      }
    } catch (ftsRepairErr) {
      logger.debug(ftsRepairErr);
    }
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
  } else if (
    !err._message &&
    isTimeoutError(err) &&
    typeof err.message === 'string' &&
    INTERNAL_MESSAGE_PATTERNS.some((p) => err.message.includes(p))
  ) {
    //
    // Sanitize internal infrastructure timeout/transient errors.
    // These are NOT code bugs (isCodeBug=false) but their raw messages
    // expose internal details (WebSocket ports, RequestIds, worker routing)
    // that should never reach end users in SMTP responses or bounce emails.
    //
    err._message = err.message;
    err.message =
      'Message delivery was temporarily interrupted, please try again later.';
    err.responseMessage = err.message;
    logger.error(err, { session, resolver: instance?.resolver });
  } else if (
    isIMAP &&
    typeof err.imapResponse === 'string' &&
    ['TRYCREATE', 'ALREADYEXISTS', 'CANNOT'].includes(err.imapResponse)
  ) {
    // IMAP client-side errors are not code bugs (e.g. mailbox does not exist, already exists, same source/target)
    logger.debug(err, { session, resolver: instance?.resolver });
  } else if (
    typeof err.message === 'string' &&
    (err.message === 'read ETIMEDOUT' ||
      err.message === 'write ETIMEDOUT' ||
      err.message === 'Premature close')
  ) {
    // Transient network errors — downgrade to debug to reduce log noise
    logger.debug(err, { session, resolver: instance?.resolver });
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
  //
  // SMTP responses put addresses in angle brackets
  // (e.g. "550 5.1.1 <user@example.com>: Recipient address rejected")
  // and striptags would remove them as if they were HTML tags
  //
  err.message = keepBracketedAddresses(err.message, striptags);
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
