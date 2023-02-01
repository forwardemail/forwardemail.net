const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const { isEmail } = require('validator');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const env = require('#config/env');

const SelfTests = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    trim: true,
    lowercase: true,
    validate: (value) => isEmail(value)
  }
});

SelfTests.plugin(mongooseCommonPlugin, {
  object: 'self_test',
  locale: false
});

const conn = mongoose.connections.find(
  (conn) => conn._connectionString === env.MONGO_URI
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('SelfTests', SelfTests);
