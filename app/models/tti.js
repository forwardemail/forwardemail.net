/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const TTI = new mongoose.Schema({
  //
  // NOTE: `mongoose-common-plugin` will automatically set `timestamps` for us
  // <https://github.com/Automattic/mongoose/blob/b2af0fe4a74aa39eaf3088447b4bb8feeab49342/test/timestamps.test.js#L123-L137>
  //
  created_at: {
    type: Date,
    expires: '30d',
    index: true
  },
  providers: [
    {
      name: {
        type: String,
        required: true,
        trim: true
      },
      directMs: {
        type: Number,
        required: true,
        default: 0
      },
      forwardingMs: {
        type: Number,
        required: true,
        default: 0
      }
    }
  ]
});

TTI.plugin(mongooseCommonPlugin, {
  object: 'tti',
  locale: false
});

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'LOGS_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('TTI', TTI);
