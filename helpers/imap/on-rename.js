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
const sendApn = require('#helpers/send-apn');
const sendNotification = require('#helpers/send-notification');
const validateMailboxPath = require('#helpers/imap/validate-mailbox-path');
// const updateStorageUsed = require('#helpers/update-storage-used');

async function onRename(path, newPath, session, fn) {
  this.logger.debug('RENAME', { path, newPath, session });

  try {
    validateMailboxPath(newPath, session?.user?.locale);
  } catch (err) {
    return fn(null, err.imapResponse);
  }

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

      // the SQLite server sends the realtime notification
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
    // This matches behavior of Dovecot and other IMAP servers
    //
    // Previous code prevented renaming of REQUIRED_PATHS mailboxes:
    // if (ensureDefaultMailboxes.REQUIRED_PATHS.includes(mailbox.path))
    //   throw new IMAPError(...)
    //

    // INBOX cannot be renamed, as IMAP RENAME already refuses
    if (mailbox.path === 'INBOX')
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_RENAME_INBOX', session.user.locale),
        {
          imapResponse: 'CANNOT'
        }
      );

    // Prevent renaming to the same path (no-op)
    if (mailbox.path === newPath)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_ALREADY_EXISTS', session.user.locale),
        {
          imapResponse: 'ALREADYEXISTS'
        }
      );

    // a folder cannot go inside itself ("Work" to "Work/Old")
    const oldPath = mailbox.path;
    const prefix = `${oldPath}/`;
    if (newPath.startsWith(prefix))
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_RENAME_INTO_ITSELF', session.user.locale),
        {
          imapResponse: 'CANNOT'
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
    // RFC 3501: the folders below are renamed with it ("Work/Clients" to
    // "Jobs/Clients" when "Work" becomes "Jobs"). They were left behind,
    // under a parent that no longer existed.
    //
    const mailboxes = await Mailboxes.find(this, session, {});
    const paths = new Set(mailboxes.map((m) => m.path));
    const children = mailboxes.filter((m) => m.path.startsWith(prefix));
    for (const child of children) {
      if (paths.has(newPath + child.path.slice(oldPath.length)))
        throw new IMAPError(
          i18n.translate('IMAP_MAILBOX_ALREADY_EXISTS', session.user.locale),
          {
            imapResponse: 'ALREADYEXISTS'
          }
        );
    }

    //
    // call save() to ensure that pre-validate hooks get run
    // (which update specialUse flags on the mailboxes)
    //
    const renamed = [];
    const move = async (m, to) => {
      m.path = to;

      // Set db virtual helpers
      m.instance = this;
      m.session = session;
      m.isNew = false;

      await m.save();
    };

    try {
      for (const m of [mailbox, ...children]) {
        const from = m.path;
        await move(m, newPath + from.slice(oldPath.length));
        renamed.push({ mailbox: m, from });
      }
    } catch (err) {
      // put back what was renamed, so the folders are not left split
      // between the old path and the new one
      for (const { mailbox: m, from } of [...renamed].reverse()) {
        try {
          await move(m, from);
        } catch (err_) {
          this.logger.fatal(err_, { path, session, resolver: this.resolver });
        }
      }

      throw err;
    }

    // send response
    fn(null, true, mailbox._id);

    // send websocket push notification
    for (const { mailbox: m, from } of renamed) {
      sendNotification(this.client, session.user.alias_id, 'mailboxRenamed', {
        oldPath: from,
        newPath: m.path,
        mailbox: m._id.toString()
      });
    }

    // send apple push notification (folder list changed; signal both old + new path)
    sendApn(this.client, session.user.alias_id, path)
      .then()
      .catch((err) =>
        this.logger.fatal(err, { session, resolver: this.resolver })
      );
    sendApn(this.client, session.user.alias_id, newPath)
      .then()
      .catch((err) =>
        this.logger.fatal(err, { session, resolver: this.resolver })
      );

    // Ensure default mailboxes exist after rename
    ensureDefaultMailboxes(this, session, true) // 3rd arg is to purge cache
      .then()
      .catch((err) =>
        this.logger.fatal(err, { session, resolver: this.resolver })
      );

    Promise.all(
      renamed.map(({ mailbox: m }) =>
        this.server.notifier.addEntries(this, session, m, {
          command: 'RENAME',
          mailbox: m._id,
          path: m.path
        })
      )
    )
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
