/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Runs the VACUUM of helpers/compact-database.js, with the FTS rebuild and
// the quick_check that follow it, on its own connection in a worker thread,
// so that the sqlite-worker's event loop keeps running (its worker lease and
// the mailbox's vacuum lock are renewed meanwhile) however long a large
// mailbox takes.
//

const { parentPort, workerData } = require('node:worker_threads');

const openDatabaseHandle = require('#helpers/open-database-handle');

// the error fields the caller acts on
const ERROR_FIELDS = ['message', 'name', 'code', 'responseCode', 'isCodeBug'];

function rebuildFtsTables(db, tables) {
  if (tables.length === 0) return;
  db.exec('BEGIN IMMEDIATE');
  try {
    for (const table of tables) {
      const name = table.replace(/"/g, '""');
      db.exec(`INSERT INTO "${name}"("${name}") VALUES('rebuild')`);
    }

    db.exec('COMMIT');
  } catch (err) {
    try {
      db.exec('ROLLBACK');
    } catch {}

    throw err;
  }
}

(async () => {
  let db;
  try {
    const { dbFilePath, session, ftsTables = [] } = workerData;
    db = await openDatabaseHandle(dbFilePath, session);
    db.pragma('auto_vacuum=FULL');
    db.exec('VACUUM');
    parentPort.postMessage({ vacuumed: true });
    rebuildFtsTables(db, ftsTables);
    const quickCheck = db.pragma('quick_check', { simple: true });
    parentPort.postMessage({ ok: true, quickCheck });
  } catch (err) {
    const error = {};
    for (const field of ERROR_FIELDS)
      if (err[field] !== undefined) error[field] = err[field];
    parentPort.postMessage({ error });
  } finally {
    try {
      if (db && db.open) db.close();
    } catch {}
  }
})();
