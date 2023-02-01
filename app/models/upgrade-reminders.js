const isFQDN = require('is-fqdn');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const { isEmail } = require('validator');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const UpgradeReminders = new mongoose.Schema({
  // this is the FQDN that the upgrade is regarding
  domain: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
    validate: (value) => isFQDN(value)
  },
  // this is an array of emails that have not yet been sent an email
  pending_recipients: [
    {
      type: String,
      trim: true,
      lowercase: true,
      validate: (value) => isEmail(value)
    }
  ],
  // this is an array of emails that have been sent an email
  sent_recipients: [
    {
      type: String,
      trim: true,
      lowercase: true,
      validate: (value) => isEmail(value)
    }
  ]
});

UpgradeReminders.plugin(mongooseCommonPlugin, {
  object: 'upgrade_reminder',
  locale: false
});

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('UpgradeReminders', UpgradeReminders);
