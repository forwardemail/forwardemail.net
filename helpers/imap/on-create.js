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

const Aliases = require('#models/aliases');
const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const config = require('#config');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const sendApn = require('#helpers/send-apn');
const sendNotification = require('#helpers/send-notification');
const updateStorageUsed = require('#helpers/update-storage-used');

async function onCreate(path, session, fn) {
  this.logger.debug('CREATE', { path, session });

  if (this.wsp) {
    try {
      const [bool, mailboxId, entry] = await this.wsp.request({
        action: 'create',
        session: {
          id: session.id,
          user: session.user,
          remoteAddress: session.remoteAddress
        },
        path
      });

      fn(null, bool, mailboxId);

      // TypeError: Database is missing
      this.server.notifier
        .addEntries(this, session, mailboxId, entry)
        .then(() => this.server.notifier.fire(session.user.alias_id))
        .catch((err) =>
          this.logger.fatal(err, { path, session, resolver: this.resolver })
        );

      // the SQLite server sends the realtime notification (WebSocket and push)
    } catch (err) {
      if (err.imapResponse) return fn(null, err.imapResponse);
      fn(err);
    }

    return;
  }

  try {
    await this.refreshSession(session, 'CREATE');

    // check if over quota
    const { isOverQuota } = await Aliases.isOverQuota(
      {
        id: session.user.alias_id,
        domain: session.user.domain_id,
        locale: session.user.locale
      },
      0,
      this.client
    );
    if (isOverQuota)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_OVER_QUOTA', session.user.locale),
        {
          imapResponse: 'OVERQUOTA'
        }
      );

    //
    // RFC 3501: the folders above it are created when missing ("Projects"
    // for "Projects/2026"), so it is not left under a parent that does not
    // exist, which webmail and some clients do not show
    //
    const parents = [];
    const parts = path.split('/');
    for (let i = 1; i < parts.length; i++) {
      const parentPath = parts.slice(0, i).join('/');
      const parent = await Mailboxes.findOne(this, session, {
        path: parentPath
      });
      if (!parent) parents.push(parentPath);
    }

    //
    // limit the number of mailboxes a user can create
    // (Gmail defaults to 10,000 labels)
    // <https://github.com/nodemailer/wildduck/issues/512>
    //
    const count = await Mailboxes.countDocuments(this, session, {});

    if (count + parents.length > config.maxMailboxes)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_MAX_EXCEEDED', session.user.locale),
        {
          imapResponse: 'OVERQUOTA'
        }
      );

    let mailbox = await Mailboxes.findOne(this, session, {
      path
    });

    if (mailbox)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_ALREADY_EXISTS', session.user.locale),
        {
          imapResponse: 'ALREADYEXISTS'
        }
      );

    // Use alias retention from session for Trash/Junk mailboxes
    const aliasRetention = session.user.alias_retention || 0;
    const getRetention = (p) =>
      ['Trash', 'Junk', 'Spam'].includes(p) && aliasRetention > 0
        ? aliasRetention
        : 0;

    for (const parentPath of parents) {
      const parent = await Mailboxes.create({
        instance: this,
        session,
        path: parentPath,
        retention: getRetention(parentPath)
      });
      sendNotification(this.client, session.user.alias_id, 'mailboxCreated', {
        path: parentPath,
        mailbox: parent._id.toString()
      });
    }

    mailbox = await Mailboxes.create({
      instance: this,
      session,
      path,
      retention: getRetention(path)
    });

    const entry = {
      command: 'CREATE',
      mailbox: mailbox._id,
      path
    };

    fn(null, true, mailbox._id, entry);

    // send websocket push notification
    sendNotification(this.client, session.user.alias_id, 'mailboxCreated', {
      path,
      mailbox: mailbox._id.toString()
    });

    // send apple push notification (folder list changed)
    sendApn(this.client, session.user.alias_id, path)
      .then()
      .catch((err) =>
        this.logger.fatal(err, { session, resolver: this.resolver })
      );

    // update storage in background
    updateStorageUsed(session.user.alias_id, this.client)
      .then()
      .catch((err) =>
        this.logger.fatal(err, { path, session, resolver: this.resolver })
      );
  } catch (err) {
    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onCreate;
