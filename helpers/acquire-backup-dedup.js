/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const config = require('#config');

async function acquireBackupDedup(client, aliasId) {
  const backupKey = `backup_dedup:${aliasId}`;

  const locked = await client.set(backupKey, '1', 'PX', ms('1d'), 'NX');
  if (!locked) return false;

  const count = await client.get(`sqlite_worker_busy:${config.env}`);
  if (count && Number(count) > 0) {
    await client.del(backupKey);
    return false;
  }

  return true;
}

module.exports = acquireBackupDedup;
