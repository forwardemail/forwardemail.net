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

// const { Builder } = require('json-sql');

const Aliases = require('#models/aliases');
const Mailboxes = require('#models/mailboxes');
const IMAPError = require('#helpers/imap-error');
const i18n = require('#helpers/i18n');
const syncTemporaryMailbox = require('#helpers/sync-temporary-mailbox');
const refineAndLogError = require('#helpers/refine-and-log-error');

// const builder = new Builder();

//
// NOTE: if you rewrite this to use `if (this.wsp)` like others
//       then you also need to return the uidList and update session on IMAP side
//
async function onGetQuotaRoot(path, session, fn) {
  console.time(`getquotaroot ${session.id} ${path}`);
  this.logger.debug('GETQUOTAROOT', { path, session });

  try {
    await this.refreshSession(session, 'GETQUOTAROOT');

    //
    // sync with tmp db every time user attempts to fetch mail
    //
    // NOTE: this has caching mechanism to prevent more than 1 call every 10s
    //
    if (this.wsp) {
      this.wsp
        .request({
          action: 'sync',
          session: { user: session.user }
        })
        .then((deleted) => {
          this.logger.debug('synced messages', { deleted });
        })
        .catch((err) => this.logger.fatal(err, { session }));
    } else {
      syncTemporaryMailbox
        .call(this, session)
        .then((deleted) => {
          this.logger.debug('synced messages', { deleted });
        })
        .catch((err) => this.logger.fatal(err, { session }));
    }

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

    /*
    //
    // if the mailbox is currently selected then update the uidList
    // <https://github.com/nodemailer/wildduck/issues/708#issuecomment-2227090990>
    //
    if (
      session?.selected?.mailbox &&
      session.selected.mailbox.toString() === mailbox._id.toString()
    ) {
      // update modifyIndex
      session.selected.modifyIndex = mailbox.modifyIndex;

      // update uidList
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

      if (session.db.readonly) {
        session.selected.uidList = await this.wsp.request({
          action: 'stmt',
          session: { user: session.user },
          stmt: [
            ['prepare', sql.query],
            ['pluck', true],
            ['all', sql.values]
          ]
        });
      } else {
        session.selected.uidList = session.db
          .prepare(sql.query)
          .pluck()
          .all(sql.values);
      }
    }
    */

    const { storageUsed, maxQuotaPerAlias } = await Aliases.isOverQuota(
      {
        id: session.user.alias_id,
        domain: session.user.domain_id,
        locale: session.user.locale
      },
      0,
      this.client
    );

    fn(null, {
      root: '',
      quota: maxQuotaPerAlias,
      storageUsed
    });
  } catch (err) {
    const error = refineAndLogError(err, session, true, this);
    if (error.imapResponse) return fn(null, error.imapResponse);
    fn(error);
  }

  console.timeEnd(`getquotaroot ${session.id} ${path}`);
}

module.exports = onGetQuotaRoot;
