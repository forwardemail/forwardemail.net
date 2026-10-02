/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const IMAPError = require('#helpers/imap-error');
const i18n = require('#helpers/i18n');

//
// A mailbox path is bounded before anything is done with it: creating
// "a/a/a/..." looks up (and creates) every parent folder, so a path of
// hundreds of thousands of levels (which fits in one command line) kept the
// shared SQLite worker busy for seconds or ran it out of memory.
//
const MAX_MAILBOX_PATH_LENGTH = 1024;
const MAX_MAILBOX_PATH_DEPTH = 64;

function validateMailboxPath(path, locale) {
  if (
    typeof path !== 'string' ||
    path.length > MAX_MAILBOX_PATH_LENGTH ||
    path.split('/').length > MAX_MAILBOX_PATH_DEPTH
  )
    throw new IMAPError(i18n.translate('IMAP_MAILBOX_PATH_TOO_LONG', locale), {
      imapResponse: 'CANNOT'
    });
}

module.exports = validateMailboxPath;
module.exports.MAX_MAILBOX_PATH_LENGTH = MAX_MAILBOX_PATH_LENGTH;
module.exports.MAX_MAILBOX_PATH_DEPTH = MAX_MAILBOX_PATH_DEPTH;
