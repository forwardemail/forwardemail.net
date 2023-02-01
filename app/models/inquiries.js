const mongoose = require('mongoose');
const _ = require('lodash');
const mongooseCommonPlugin = require('mongoose-common-plugin');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const env = require('#config/env');
const config = require('#config');

const Inquiries = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users'
  },
  message: {
    type: String,
    required: true,
    validate: (value) =>
      _.isString(value) && value.length <= config.supportRequestMaxLength
  },
  is_denylist: {
    type: Boolean,
    default: false
  }
});

Inquiries.plugin(mongooseCommonPlugin, {
  object: 'inquiry',
  locale: false
});

const conn = mongoose.connections.find(
  (conn) => conn._connectionString === env.MONGO_URI
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('Inquiries', Inquiries);
