/* istanbul ignore file */

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
const config = require('#config');
const refineAndLogError = require('#helpers/refine-and-log-error');

async function onGetQuota(path, session, fn) {
  this.logger.debug('GETQUOTA', { path, session });

  //
  // NOTE: we don't use a single db connection here to get quota
  //       because an aliases mailbox could live across multiple servers
  //       and not all of them may be mounted to the current server (?)
  //
  //       if we mount everything to the current server then this is possible
  //       and we would need to rewrite the logic below and elsewhere that
  //       `getStorageUsed` is invoked in order to iterate over all
  //       (perhaps in this case we then error and use wsp as fallback if
  //       one of the mailboxes for an alias did not exist?)
  //
  try {
    // TODO: we may want to disable this (assuming getStorageUsed does not use session.db)
    await this.refreshSession(session, 'GETQUOTA');

    if (path !== '') return fn(null, 'NONEXISTENT');

    const storageUsed = await Aliases.getStorageUsed(this, session);

    fn(null, {
      root: '',
      quota: config.maxQuotaPerAlias,
      storageUsed
    });
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { path, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onGetQuota;
