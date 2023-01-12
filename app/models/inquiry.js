const mongoose = require('mongoose');
const _ = require('lodash');
const mongooseCommonPlugin = require('mongoose-common-plugin');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const config = require('#config');

const Inquiry = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
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

Inquiry.plugin(mongooseCommonPlugin, {
  object: 'inquiry',
  locale: false
});

module.exports = mongoose.model('Inquiry', Inquiry);
