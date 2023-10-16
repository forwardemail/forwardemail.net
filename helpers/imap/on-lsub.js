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

const ms = require('ms');

const Mailboxes = require('#models/mailboxes');
const refineAndLogError = require('#helpers/refine-and-log-error');

async function onLsub(query, session, fn) {
  this.logger.debug('LSUB', { query, session });

  try {
    const { alias } = await this.refreshSession(session, 'LSUB');

    const mailboxes = await Mailboxes.find({
      alias: alias._id,
      subscribed: true
    })
      .maxTimeMS(ms('3s'))
      .lean()
      .exec();

    fn(null, mailboxes);
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { query, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onLsub;
