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

const { Builder } = require('json-sql');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');

const builder = new Builder();

async function onOpen(path, session, fn) {
  this.logger.debug('OPEN', { path, session });

  if (this.wsp) {
    try {
      const response = await this.wsp.request({
        action: 'open',
        session: {
          id: session.id,
          user: session.user,
          remoteAddress: session.remoteAddress
        },
        path
      });

      fn(null, response);
    } catch (err) {
      fn(err);
    }

    return;
  }

  try {
    await this.refreshSession(session, 'OPEN');

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
    // NOTE: the below comment doesn't apply anymore
    //       since we're actually using sqlite behind the scenes!
    //
    // distinct has a limited response size of 16 MB
    // <https://www.mongodb.com/docs/manual/reference/method/db.collection.distinct/>
    // > 'The maximum BSON document size is 16 megabytes'
    // <https://github.com/nodemailer/wildduck/issues/530>
    //
    /*
    const uidList = await Messages.distinct(this, session, 'uid', {
      mailbox: mailbox._id
    });

    mailbox.uidList = uidList.sort();
    */

    const sql = builder.build({
      type: 'select',
      table: 'Messages',
      condition: {
        mailbox: mailbox._id.toString()
      },
      group: 'uid',
      fields: ['uid'],
      sort: 'uid'
    });

    // send response
    const response = mailbox.toObject();
    response.uidList = session.db.prepare(sql.query).pluck().all(sql.values);
    fn(null, response);
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { path, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onOpen;
