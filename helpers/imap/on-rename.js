/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 *   WildDuck Mail Agent is licensed under the European Union Public License 1.2 or later.
 *   https://github.com/nodemailer/wildduck
 */

const IMAPError = require('#helpers/imap-error');
const ensureDefaultMailboxes = require('#helpers/ensure-default-mailboxes');
const Mailboxes = require('#models/mailboxes');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
// const updateStorageUsed = require('#helpers/update-storage-used');

async function onRename(path, newPath, session, fn) {
  this.logger.debug('RENAME', { path, newPath, session });

  if (this.wsp) {
    try {
      const [bool, mailboxId] = await this.wsp.request({
        action: 'rename',
        session: {
          id: session.id,
          user: session.user,
          remoteAddress: session.remoteAddress
        },
        path,
        newPath
      });

      fn(null, bool, mailboxId);
    } catch (err) {
      if (err.imapResponse) return fn(null, err.imapResponse);
      fn(err);
    }

    return;
  }

  try {
    await this.refreshSession(session, 'RENAME');

    const mailbox = await Mailboxes.findOne(this, session, {
      path
    });

    if (!mailbox)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale),
        {
          imapResponse: 'NONEXISTENT'
        }
      );

    //
    // RFC 6154 Compliance: Allow renaming of all mailboxes including special-use ones
    // Special-use mailboxes will be auto-recreated if they are in REQUIRED_PATHS
    // This matches behavior of Dovecot and Stalwart IMAP servers
    //
    // Previous code prevented renaming of REQUIRED_PATHS mailboxes:
    // if (ensureDefaultMailboxes.REQUIRED_PATHS.includes(mailbox.path))
    //   throw new IMAPError(...)
    //

    // Prevent renaming to the same path (no-op)
    if (mailbox.path === newPath)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_ALREADY_EXISTS', session.user.locale),
        {
          imapResponse: 'ALREADYEXISTS'
        }
      );

    const targetMailbox = await Mailboxes.findOne(this, session, {
      path: newPath
    });

    if (targetMailbox)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_ALREADY_EXISTS', session.user.locale),
        {
          imapResponse: 'ALREADYEXISTS'
        }
      );

    //
    // call save() to ensure that pre-validate hooks get run
    // (which update specialUse flags on the mailboxes)
    //
    mailbox.path = newPath;

    // Set db virtual helpers
    mailbox.instance = this;
    mailbox.session = session;
    mailbox.isNew = false;

    await mailbox.save();

    // send response
    fn(null, true, mailbox._id);

    // Ensure default mailboxes exist after rename
    ensureDefaultMailboxes(this, session, true) // 3rd arg is to purge cache
      .then()
      .catch((err) =>
        this.logger.fatal(err, { session, resolver: this.resolver })
      );

    this.server.notifier
      .addEntries(this, session, mailbox, {
        command: 'RENAME',
        mailbox: mailbox._id,
        path: mailbox.path
      })
      .then(() => this.server.notifier.fire(session.user.alias_id))
      .catch((err) =>
        this.logger.fatal(err, { path, session, resolver: this.resolver })
      );

    // update storage in background
    // NOTE: this won't work since IMAP usage occurs here without FS access to SQLite server
    // updateStorageUsed(session.user.alias_id, this.client)
    //   .then()
    //   .catch((err) => this.logger.fatal(err, { path, session, resolver: this.resolver }));
  } catch (err) {
    const error = refineAndLogError(err, session, true, this);
    if (error.imapResponse) return fn(null, error.imapResponse);
    fn(error);
  }
}

module.exports = onRename;
