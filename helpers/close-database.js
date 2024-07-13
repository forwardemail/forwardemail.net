/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');
const pWaitFor = require('p-wait-for');

const logger = require('#helpers/logger');

async function closeDatabase(db) {
  if (!db.open) return;
  if (db.inTransaction) {
    try {
      await pWaitFor(() => !db.inTransaction, {
        timeout: ms('30s')
      });
    } catch (err) {
      err.message = `Shutdown could not cancel transaction: ${err.message}`;
      err.isCodeBug = true;
      logger.error(err, { db });
    }
  }

  try {
    db.pragma('analysis_limit=400');
    db.pragma('optimize');
    db.close();
  } catch (err) {
    logger.error(err, { db });
  }
}

module.exports = closeDatabase;
