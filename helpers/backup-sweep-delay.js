/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const BACKUP_SWEEP_INTERVAL = ms('1d');
const BACKUP_SWEEP_JITTER = ms('1h');

function getBackupSweepDelay() {
  return (
    BACKUP_SWEEP_INTERVAL + Math.floor(Math.random() * BACKUP_SWEEP_JITTER)
  );
}

module.exports = getBackupSweepDelay;
module.exports.BACKUP_SWEEP_INTERVAL = BACKUP_SWEEP_INTERVAL;
module.exports.BACKUP_SWEEP_JITTER = BACKUP_SWEEP_JITTER;
