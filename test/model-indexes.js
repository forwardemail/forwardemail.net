/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Every index a model declares is built. Two declarations of one key with
// different options share a name (e.g. `index: true` on the field and an
// explicit unique, partial or TTL index), so the second was never built: the
// PushTokens TTL never expired tokens, and Payments failed to build at all.
//

const { randomUUID } = require('node:crypto');

const mongoose = require('mongoose');
const test = require('ava');

const utils = require('./utils');

const models = require('#models');

//
// The indexes are built on an empty database of their own, as for a new
// install: the app keeps writing to its database in the background (e.g. two
// error logs with one hash, written before the unique `hash` index exists,
// would fail the build of that index).
//
const DB_NAME = `model-indexes-${randomUUID()}`;
const databases = new Set();

function getIsolatedModel(model) {
  const db = model.db.useDb(DB_NAME, { useCache: true });
  databases.add(db);
  return (
    db.models[model.modelName] ||
    db.model(model.modelName, model.schema, model.collection.collectionName)
  );
}

// (models stored in each alias's SQLite database have no MongoDB indexes:
// `helpers/mongoose-to-sqlite.js` replaces their Mongoose methods)
function isSqliteOnly(model) {
  return model.createIndexes !== mongoose.Model.createIndexes;
}

test.before(utils.setupMongoose);
test.after.always(async () => {
  for (const db of databases) {
    try {
      await db.dropDatabase();
    } catch {}
  }
});
test.after.always(utils.teardownMongoose);

test('every model builds all of its indexes', async (t) => {
  // (the app's own connections, not the ones made here)
  const connections = mongoose.connections.filter(
    (connection) => connection.name !== DB_NAME
  );
  const seen = new Set();
  for (const connection of connections) {
    for (const model of Object.values(connection.models)) {
      if (seen.has(model)) continue;
      seen.add(model);
      if (isSqliteOnly(model)) continue;
      try {
        await getIsolatedModel(model).createIndexes();
      } catch (err) {
        t.fail(`${model.modelName}: ${err.message}`);
      }
    }
  }

  t.true(seen.size > 0);
});

test('the declared TTL, unique and partial indexes exist', async (t) => {
  const Payments = getIsolatedModel(models.Payments);
  const PushTokens = getIsolatedModel(models.PushTokens);
  const Logs = getIsolatedModel(models.Logs);
  for (const model of [Payments, PushTokens, Logs]) {
    await model.createIndexes();
  }

  const find = async (model, name) => {
    const indexes = await model.collection.indexes();
    return indexes.find((index) => index.name === name) || {};
  };

  const ttl = await find(PushTokens, 'expires_at_1');
  t.is(ttl.expireAfterSeconds, 0);
  const reference = await find(Payments, 'reference_1');
  t.true(reference.unique);
  const paymentIntent = await find(Payments, 'stripe_payment_intent_id_1');
  t.true(paymentIntent.unique);
  const user = await find(Logs, 'user_1');
  t.truthy(user.partialFilterExpression);
});

//
// Every IMAP notification makes each session read the changes to its
// mailbox (`getUpdates` in helpers/imap-notifier.js); with only one-field
// indexes MongoDB walks every journal entry of the mailbox for it.
//
test('IMAP updates are read from the journal by mailbox and modseq', async (t) => {
  const Journals = getIsolatedModel(models.Journals);
  await Journals.createIndexes();

  const mailbox = new mongoose.Types.ObjectId();
  const docs = [];
  const entry = (mailbox, modseq) => {
    const _id = new mongoose.Types.ObjectId();
    return { _id, id: _id.toString(), mailbox, modseq, command: 'EXISTS' };
  };

  for (let modseq = 1; modseq <= 50; modseq++) {
    docs.push(
      entry(mailbox, modseq),
      entry(new mongoose.Types.ObjectId(), modseq)
    );
  }

  await Journals.insertMany(docs);

  const explain = await Journals.find({ mailbox, modseq: { $gt: 45 } })
    .lean()
    .explain('executionStats');
  t.is(explain.executionStats.nReturned, 5);
  // only the entries returned were examined
  t.is(explain.executionStats.totalKeysExamined, 5);
  t.is(explain.executionStats.totalDocsExamined, 5);
});
