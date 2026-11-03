/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const config = require('#config');

//
// The daily backup a sign in starts runs once a day per alias. The claim for
// the day was taken before checking whether the SQLite worker was busy, so a
// sign in while it was busy started no backup and kept the claim: no other
// sign in that day started one (#611).
//
// Now a busy worker takes no claim, so a later sign in tries again.
//
const CLAIM_MS = ms('1d');

function getBackupDedupKey(aliasId) {
  return `backup_dedup:${aliasId}`;
}

async function acquireBackupDedup(client, aliasId) {
  // (one round trip when the alias was claimed today, as most sign ins are)
  const [count, claimed] = await client.mget(
    `sqlite_worker_busy:${config.env}`,
    getBackupDedupKey(aliasId)
  );
  if (claimed) return false;
  if (count && Number(count) > 0) return false;
  return Boolean(
    await client.set(getBackupDedupKey(aliasId), '1', 'PX', CLAIM_MS, 'NX')
  );
}

//
// Asks the SQLite server for the daily backup of the signed in alias, in the
// background (a failure is only logged).
//
function requestDailyBackup({ client, wsp, logger }, user, session) {
  acquireBackupDedup(client, user.alias_id)
    .then(async (claimed) => {
      if (!claimed) return;
      const backup = await wsp.request(
        {
          action: 'backup',
          backup_at: new Date().toISOString(),
          session: { user }
        },
        0
      );
      logger.debug('backup complete', { backup, session });
    })
    .catch((err) => logger.debug(err, { session }));
}

module.exports = acquireBackupDedup;
module.exports.CLAIM_MS = CLAIM_MS;
module.exports.getBackupDedupKey = getBackupDedupKey;
module.exports.requestDailyBackup = requestDailyBackup;
