/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');
const logger = require('#helpers/logger');

async function onClose(session) {
  // NOTE: do not change this prefix unless you also change it in `helpers/on-connect.js` and `helpers/on-auth.js`
  const prefix = `concurrent_${this.constructor.name.toLowerCase()}_${
    config.env
  }`;
  // TODO: not needed for `SMTP` server (only IMAP)
  await Promise.all([
    //
    // decrease # concurrent connections for remote address
    //
    (async () => {
      if (!session?.remoteAddress) return;
      try {
        const key = `${prefix}:${session.remoteAddress}`;
        const count = await this.client.incrby(key, 0);
        if (count > 0) await this.client.decr(key);
      } catch (err) {
        logger.fatal(err);
      }
    })(),
    //
    // decrease # concurrent connections for
    // the logged in alias or domain (if using catch-all password)
    //
    (async () => {
      // ignore unauthenticated sessions
      if (!session?.user?.alias_id && !session?.user?.domain_id) return;
      try {
        const key = `${prefix}:${
          session.user.alias_id || session.user.domain_id
        }`;
        const count = await this.client.incrby(key, 0);
        if (count > 0) await this.client.decr(key);
      } catch (err) {
        logger.fatal(err);
      }
    })()
  ]);
}

module.exports = onClose;
