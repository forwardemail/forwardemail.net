/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

//
// The addresses that were sent the one-time email for free plan domains
// without an account (see jobs/free-plan-intro.js), so none is sent it
// twice. A SHA-256 hash of the address is kept instead of the address, so
// that this collection is not a list of people who have no account.
//
const FreePlanIntros = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => /^[\da-f]{64}$/.test(value)
  }
});

FreePlanIntros.plugin(mongooseCommonPlugin, {
  object: 'free_plan_intro',
  locale: false
});

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('FreePlanIntros', FreePlanIntros);
