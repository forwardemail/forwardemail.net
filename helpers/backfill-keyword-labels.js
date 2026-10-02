/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setImmediate: nextTick } = require('node:timers/promises');

const Messages = require('#models/messages');
const deriveLabelsFromFlags = require('#helpers/derive-labels-from-flags');
const recursivelyParse = require('#helpers/recursively-parse');
const { Builder } = require('#helpers/json-sql');
const { decodeMetadata } = require('#helpers/msgpack-helpers');
const { prepareQuery } = require('#helpers/mongoose-to-sqlite');

const builder = new Builder({ bufferAsNative: true });

// rows read and written per transaction, between which other work runs
const BATCH_SIZE = 200;

// as app/models/messages.js stores labels
const KEYWORD_REGEX = /^([A-Za-z\d]|[\\$])[\w.-]*$/;

//
// One batch, read and written in one transaction that takes the write lock
// first, so no other connection changes the messages in between.  Returns
// the rows it read.
//
function backfillBatch(db, after, stats) {
  const rows = db
    .prepare(
      'SELECT rowid, _id, mailbox, modseq, flags, labels FROM Messages WHERE rowid > ? ORDER BY rowid LIMIT ?'
    )
    .all(after, BATCH_SIZE);

  // mailbox id -> [{ _id, modseq, labels }]
  const changes = new Map();
  for (const row of rows) {
    stats.checked++;

    //
    // Messages with labels already had their keywords mirrored (or had
    // labels set on purpose).  A label removed through the API with a whole
    // list of labels leaves its keyword in the flags, and adding it back
    // here would undo that.
    //
    const decoded = row.labels
      ? decodeMetadata(row.labels, recursivelyParse)
      : [];
    if (Array.isArray(decoded) && decoded.length > 0) continue;

    const labels = deriveLabelsFromFlags(
      decodeMetadata(row.flags, recursivelyParse)
    ).filter((keyword) => KEYWORD_REGEX.test(keyword));
    if (labels.length === 0) continue;

    const list = changes.get(row.mailbox) || [];
    list.push({ _id: row._id, modseq: Number(row.modseq) || 0, labels });
    changes.set(row.mailbox, list);
  }

  // the same SQL for every message
  const statements = new Map();
  for (const [mailbox, list] of changes) {
    const current = db
      .prepare('SELECT modifyIndex FROM Mailboxes WHERE _id = ?')
      .get(mailbox);
    // (the mailbox of the messages is gone)
    if (typeof current?.modifyIndex !== 'number') continue;

    //
    // One change of the mailbox, as one STORE makes (see on-store.js),
    // above the modseq of every message it changes: a message can have a
    // modseq above its mailbox's modifyIndex (see on-move.js), and a lower
    // one would hide the change from clients that sync since a modseq.
    //
    const modseq =
      Math.max(current.modifyIndex, ...list.map((item) => item.modseq)) + 1;
    for (const { _id, labels } of list) {
      const sql = builder.build({
        type: 'update',
        table: 'Messages',
        condition: prepareQuery(Messages.mapping, { _id }),
        modifier: {
          $set: prepareQuery(Messages.mapping, { labels, modseq })
        }
      });
      if (!statements.has(sql.query))
        statements.set(sql.query, db.prepare(sql.query));
      statements.get(sql.query).run(sql.values);
    }

    db.prepare('UPDATE Mailboxes SET modifyIndex = ? WHERE _id = ?').run(
      modseq,
      mailbox
    );
    stats.updated += list.length;
  }

  return rows;
}

// the batches from the row after `after` on, while `isCurrent()` holds
async function backfillFrom(db, isCurrent, after, stats) {
  if (!db?.open || !isCurrent()) return;
  const rows = db.transaction(backfillBatch).immediate(db, after, stats);
  if (rows.length === 0) {
    stats.complete = true;
    return;
  }

  // (other requests run between two batches)
  await nextTick();
  await backfillFrom(db, isCurrent, rows.at(-1).rowid, stats);
}

//
// Labels for the keywords of messages stored before keywords became labels.
//
// IMAP clients see a message's flags and labels together as its keywords
// (helpers/get-imap-flags.js), and the REST API, webmail and the apps read
// the labels.  A keyword set with STORE has been a label as well for a
// while, but a message appended with keywords (an IMAP APPEND, or mail a
// Sieve script flagged with `addflag` or `fileinto :flags`) kept them in its
// flags only, so the API listed no labels for it.  on-append.js now gives
// those keywords as labels too, and this adds them to the messages stored
// before that have no labels, once per mailbox (getDatabase runs it in the
// background).
//
// IMAP clients see no change.  The messages it changes get a new modseq, so
// clients that sync changes since a modseq (webmail, the apps) pick up the
// labels.
//
// `isCurrent` says whether `db` is still the mailbox's handle; the backfill
// stops when it is not (the handle was evicted, say for a rekey that copies
// the file), and when the database closes.
//
// Returns { checked, updated, complete }, complete when it went through
// every message.
//
async function backfillKeywordLabels(db, isCurrent = () => true) {
  const stats = { checked: 0, updated: 0, complete: false };
  await backfillFrom(db, isCurrent, 0, stats);
  return stats;
}

module.exports = backfillKeywordLabels;
