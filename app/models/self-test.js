const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const { isEmail } = require('validator');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const SelfTest = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    trim: true,
    lowercase: true,
    validate: (value) => isEmail(value)
  }
});

SelfTest.plugin(mongooseCommonPlugin, { object: 'self_test' });

module.exports = mongoose.model('SelfTest', SelfTest);
