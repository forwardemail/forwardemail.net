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

const mongoose = require('mongoose');
const pify = require('pify');

const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const onMove = require('#helpers/imap/on-move');

const onMovePromise = pify(onMove, { multiArgs: true });

async function onUpdate(update, session, fn) {
  this.logger.debug('onUpdate', { update, session });

  try {
    //
    // TODO: wsp.request concept similar to IMAP commands
    //

    await this.refreshSession(session, 'POP3');

    // NOTE: WildDuck returns callback immediately without waiting for update result
    fn();
  } catch (err) {
    fn(refineAndLogError(err, session, true, this));
  }

  try {
    // handle seen
    if (update.seen && update.seen.length > 0) {
      const updatedMailbox = await Mailboxes.findOneAndUpdate(
        this,
        session,
        {
          _id: session.user.mailbox
        },
        {
          $inc: {
            modifyIndex: 1
          }
        },
        {
          returnDocument: 'after'
        }
      );

      if (!updatedMailbox)
        throw new Error(
          i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale)
        );

      const _ids = update.seen
        .filter((m) => mongoose.isObjectIdOrHexString(m.id))
        .map((m) => new mongoose.Types.ObjectId(m.id));
      //
      // NOTE: since $addToSet isn't supported in our mongoose sqlite helper yet
      //       we use a simple loop to update messages that match the query filter
      //
      // await Messages.updateMany(
      //   this,
      //   session,
      //   {
      //     _id: {
      //       $in: _ids
      //     },
      //     mailbox: updatedMailbox._id,
      //     modseq: {
      //       $lt: updatedMailbox.modifyIndex
      //     }
      //   },
      //   {
      //     $set: {
      //       modseq: updatedMailbox.modifyIndex,
      //       unseen: false
      //     },
      //     $addToSet: {
      //       flags: '\\Seen'
      //     }
      //   }
      // );

      // TODO: rewrite this
      for (const _id of _ids) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await Messages.findOneAndUpdate(
            this,
            session,
            {
              _id,
              mailbox: updatedMailbox._id,
              modseq: {
                $lt: updatedMailbox.modifyIndex
              }
            },
            {
              $set: {
                modseq: updatedMailbox.modifyIndex,
                unseen: false
              },
              $addToSet: {
                flags: '\\Seen'
              }
            }
          );
        } catch (err) {
          this.logger.fatal(err, { update, session });
        }
      }

      await this.server.notifier.addEntries(
        this,
        session,
        updatedMailbox,
        update.seen
          .filter((message) => mongoose.isObjectIdOrHexString(message.id))
          .map((message) => ({
            command: 'FETCH',
            uid: message.uid,
            flags: [...message.flags, '\\Seen'],
            message: new mongoose.Types.ObjectId(message.id),
            modseq: updatedMailbox.modifyIndex
          }))
      );
      this.server.notifier.fire(session.user.alias_id);
    }

    // handle deleted
    if (update.deleted && update.deleted.length > 0) {
      const trashMailbox = await Mailboxes.findOne(this, session, {
        specialUse: '\\Trash'
      });

      if (!trashMailbox)
        throw new Error(
          i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale)
        );

      await onMovePromise.call(
        this,
        session.user.mailbox,
        {
          //
          // TODO: currently performs double lookup
          //       (we should add ability to pass `destination` as an object in future)
          //
          destination: trashMailbox.path,
          // uids to move
          messages: update.deleted.map((message) => message.uid),
          // add \Seen flag to deleted messages
          markAsSeen: true,

          // do not broadcast messages
          silent: true
        },
        session
      );
    }
  } catch (_err) {
    // since we use multiArgs from pify
    // if a promise that was wrapped with multiArgs: true
    // throws, then the error will be an array so we need to get first key
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    refineAndLogError(err, session, false, this);
  }
}

module.exports = onUpdate;
