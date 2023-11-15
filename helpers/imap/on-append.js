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

const { Buffer } = require('node:buffer');

const bytes = require('bytes');
const ms = require('ms');
const splitLines = require('split-lines');
const { convert } = require('html-to-text');

const Aliases = require('#models/aliases');
const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const Threads = require('#models/threads');
const config = require('#config');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');

const SIXTY_FOUR_MB_IN_BYTES = bytes('64MB');

// eslint-disable-next-line max-params, complexity
async function onAppend(path, flags, date, raw, session, fn) {
  this.logger.debug('APPEND', { path, flags, date, session });

  let thread;
  let hasNodeBodies;
  let maildata;
  let mimeTreeData;

  try {
    // do not allow messages larger than 64 MB
    if (
      raw &&
      (Buffer.isBuffer(raw) ? Buffer.byteLength(raw) : raw.length) >
        SIXTY_FOUR_MB_IN_BYTES
    )
      throw new IMAPError(i18n.translate('IMAP_MESSAGE_SIZE_EXCEEDED', 'en'));

    const { alias } = await this.refreshSession(session, 'APPEND');

    // check if over quota
    const { storageUsed, isOverQuota } = await Aliases.isOverQuota(alias);
    if (isOverQuota)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_OVER_QUOTA', 'en'), {
        imapResponse: 'OVERQUOTA'
      });

    // <https://github.com/nodemailer/wildduck/blob/b9349f6e8315873668d605e6567ced2d7b1c0c80/lib/handlers/on-append.js#L65>
    let mailbox = await Mailboxes.findOne(this, session, {
      path
    });

    //
    // <https://www.rfc-editor.org/rfc/rfc3502.html#section-6.3.11>
    //
    // > If the destination mailbox does not exist, a server MUST return an
    //   error, and MUST NOT automatically create the mailbox.  Unless it
    //   is certain that the destination mailbox can not be created, the
    //   server MUST send the response code "[TRYCREATE]" as the prefix of
    //   the text of the tagged NO response.  This gives a hint to the
    //   client that it can attempt a CREATE command and retry the APPEND
    //   if the CREATE is successful.
    //
    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'TRYCREATE'
      });

    const {
      id,
      mimeTree,
      size,
      bodystructure,
      envelope,
      idate,
      hdate,
      msgid,
      subject,
      headers
    } = await this.prepareMessage({
      flags,
      date,
      raw
    });

    //
    // NOTE: this prevents storing duplicate messages
    //
    // Message-ID + PATH are used as determinent factors
    // `msg` and `path` (mailbox._id)
    // (e.g. in case MX server attempts multiple delivery attempts)
    // (and in this case we simply return the already existing message)
    // <https://github.com/nodemailer/wildduck/issues/555>
    //
    const existingMessage = await Messages.findOne(this, session, {
      mailbox: mailbox._id,
      msgid
    });

    if (existingMessage) {
      const response = {
        uidValidity: mailbox.uidValidity,
        uid: existingMessage.uid,
        id: existingMessage.id,
        mailbox: mailbox.id,
        mailboxPath: mailbox.path,
        size: existingMessage.size,
        status: 'new'
      };
      this.logger.debug('command response', { response });
      fn(null, true, response);
      return;
    }

    // store reference for cleanup
    mimeTreeData = mimeTree;

    const exceedsQuota = storageUsed + size > config.maxQuotaPerAlias;
    if (exceedsQuota)
      throw new IMAPError(
        i18n.translate(
          'IMAP_MAILBOX_MESSAGE_EXCEEDS_QUOTA',
          'en',
          session.user.username
        ),
        {
          imapResponse: 'OVERQUOTA'
        }
      );

    maildata = this.indexer.getMaildata(mimeTree);

    // store node bodies
    hasNodeBodies = await this.indexer.storeNodeBodies(
      this,
      session,
      maildata,
      mimeTree
    );

    // TODO: we should instead tokenize this with spamscanner
    // if (maildata.text) {
    //   data.text = splitLines(maildata.text).join('\n');
    //   // if text is longer than max permitted then trim it
    //   if (data.text.length > config.maxPlaintextIndexed)
    //     data.text = data.text.slice(0, Math.max(0, config.maxPlaintextIndexed));
    // }
    // prepare text for indexing
    let text = '';
    if (maildata.text) {
      // replace line breaks for consistency
      text = splitLines(maildata.text).join(' ').trim();
      // convert and remove unnecessary things
      text = convert(text, {
        wordwrap: false,
        selectors: [
          { selector: 'img', format: 'skip' },
          { selector: 'ul', options: { itemPrefix: ' ' } },
          {
            selector: 'a',
            options: { linkBrackets: false }
          }
        ]
      });
      // slice if it's too long
      if (text.length > 1024) text = text.slice(0, 1024);
      // trim it up
      text = text.trim();
    }

    //
    // prepare message for creation
    //
    const retention =
      typeof mailbox.retention === 'number' ? mailbox.retention : 0;
    const data = {
      mailbox: mailbox._id,
      _id: id,
      root: id,
      exp: retention !== 0,
      rdate: new Date(Date.now() + retention),
      idate,
      hdate,
      flags,
      size,
      headers,
      mimeTree,
      envelope,
      bodystructure,
      msgid,
      unseen: !flags.includes('\\Seen'),
      flagged: flags.includes('\\Flagged'),
      undeleted: !flags.includes('\\Deleted'),
      draft: flags.includes('\\Draft'),
      magic: maildata.magic,
      subject,
      copied: false,
      remoteAddress: session.remoteAddress,
      transaction: 'APPEND',
      // raw,
      text
    };

    if (maildata.attachments && maildata.attachments.length > 0)
      data.attachments = maildata.attachments;

    // TODO: encrypt message if it is not a Draft and user has a public key

    //
    // TODO: explore modseq usage (for journal sorting by modseq uids in ascending order)
    //

    // get new uid and modsec and return original values
    mailbox = await Mailboxes.findByIdAndUpdate(
      this,
      session,
      mailbox._id,
      {
        $inc: {
          uidNext: 1,
          modifyIndex: 1
        }
      },
      {
        returnDocument: 'before'
      }
    );

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'TRYCREATE'
      });

    // update message object with mailbox values
    data.uid = mailbox.uidNext;
    data.modseq = mailbox.modifyIndex + 1;

    // store whether searchable or not
    // <https://github.com/nodemailer/wildduck/issues/514>
    data.searchable = !flags.includes('\\Deleted');

    // TODO: notify wildduck about this in GH issues
    // if appending to draft then add draft flag
    if (mailbox.specialUse === '\\Drafts') data.flags.push('\\Draft');

    // store whether junk or not
    data.junk = mailbox.specialUse === '\\Junk';

    // get thread ID
    thread = await Threads.getThreadId(this, session, subject, mimeTree);

    data.thread = thread._id;

    // virtual helper for locking if we lock in advance
    // data.lock = lock;

    // db virtual helper
    data.instance = this;
    data.session = session;

    // store the message
    const message = await Messages.create(data);

    this.logger.debug('message created', {
      message,
      path,
      flags,
      date,
      session
    });

    // update storage
    try {
      await this.wsp.request({
        action: 'size',
        timeout: ms('5s'),
        alias_id: alias.id
      });
    } catch (err) {
      this.logger.fatal(err);
    }

    try {
      await this.server.notifier.addEntries(this, session, mailbox, {
        // TODO: the wildduck code has this which means messages don't show in Sent folder
        // <https://github.com/nodemailer/wildduck/issues/537>
        // ignore: session.id,
        command: 'EXISTS',
        uid: message.uid,
        mailbox: mailbox._id,
        message: message._id,
        thread: message.thread,
        modseq: message.modseq,
        unseen: message.unseen,
        idate: message.idate,
        junk: message.junk
      });
      this.server.notifier.fire(alias.id);
    } catch (err) {
      this.logger.fatal(err, { path, flags, date, session });
    }

    const response = {
      uidValidity: mailbox.uidValidity,
      uid: message.uid,
      id,
      mailbox: mailbox.id,
      mailboxPath: mailbox.path,
      size,
      status: 'new'
    };

    this.logger.debug('command response', { response });

    fn(null, true, response);
  } catch (err) {
    // delete attachments if we need to cleanup
    const attachmentIds =
      hasNodeBodies && mimeTreeData?.attachmentMap
        ? Object.keys(mimeTreeData.attachmentMap || {}).map(
            (key) => mimeTreeData.attachmentMap[key]
          )
        : [];

    if (attachmentIds.length > 0) {
      if (session.db) {
        try {
          await this.attachmentStorage.deleteMany(
            this,
            session,
            attachmentIds,
            maildata.magic
          );
        } catch (err) {
          this.logger.fatal(err, {
            attachmentIds,
            session
          });
        }
      } else {
        this.logger.fatal(
          new TypeError('Attachment storage needs to cleanup'),
          { attachmentIds, session }
        );
      }
    }

    // handle mongodb error
    if (err.code === 1100) err.imapResponse = 'ALREADYEXISTS';

    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { path, flags, date, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onAppend;
