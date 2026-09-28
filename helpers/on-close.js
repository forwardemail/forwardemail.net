/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');
const logger = require('#helpers/logger');

// Atomic decrement-floor-at-zero: avoids TOCTOU race between read and decrement
const ATOMIC_DECR_FLOOR_SCRIPT = `
local v = redis.call("get", KEYS[1])
if v and tonumber(v) > 0 then
  return redis.call("decr", KEYS[1])
end
return 0
`;

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
        // the key on-connect.js counted this connection under
        const key =
          typeof session.concurrencyKey === 'string' &&
          session.concurrencyKey.startsWith(`${prefix}:`)
            ? session.concurrencyKey
            : `${prefix}:${session.remoteAddress}`;
        await this.client.eval(ATOMIC_DECR_FLOOR_SCRIPT, 1, key);
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
        await this.client.eval(ATOMIC_DECR_FLOOR_SCRIPT, 1, key);
      } catch (err) {
        logger.fatal(err);
      }
    })()
  ]);
}

module.exports = onClose;
