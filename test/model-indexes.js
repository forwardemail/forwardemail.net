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

const mongoose = require('mongoose');
const test = require('ava');

const utils = require('./utils');

const models = require('#models');

test.before(utils.setupMongoose);
// (indexes are built on an empty database, as they were for a new install;
// the app may already have written e.g. error logs while starting up)
test.before(async () => {
  for (const connection of mongoose.connections) {
    if (connection.readyState !== 1 || !connection.db) continue;

    await connection.db.dropDatabase();
  }
});
test.after.always(utils.teardownMongoose);

// (models stored in each alias's SQLite database have no MongoDB indexes)
const SQLITE_ONLY = /SQLite only/;

test('every model builds all of its indexes', async (t) => {
  const seen = new Set();
  for (const connection of mongoose.connections) {
    for (const model of Object.values(connection.models)) {
      if (seen.has(model)) continue;
      seen.add(model);
      try {
        await model.createIndexes();
      } catch (err) {
        if (!SQLITE_ONLY.test(err.message))
          t.fail(`${model.modelName}: ${err.message}`);
      }
    }
  }

  t.true(seen.size > 0);
});

test('the declared TTL, unique and partial indexes exist', async (t) => {
  const { Payments, PushTokens, Logs } = models;
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
