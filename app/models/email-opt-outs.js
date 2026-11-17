/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

//
// Addresses without an account that unsubscribed from our emails (an
// account keeps its own choices, see `opt_out_templates` on a user). Such an
// address gets mail through a free plan domain's DNS records and is sent the
// occasional notice about it, so its unsubscribe link has to hold without an
// account to hold it. A SHA-256 hash of the address is kept instead of the
// address (see `hashEmail` in helpers/unsubscribe.js).
//
const EmailOptOuts = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => /^[\da-f]{64}$/.test(value)
  },
  // from every email it can be unsubscribed from
  all: {
    type: Boolean,
    default: false
  },
  // or from these templates only
  templates: [String]
});

EmailOptOuts.plugin(mongooseCommonPlugin, {
  object: 'email_opt_out',
  locale: false
});

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('EmailOptOuts', EmailOptOuts);
