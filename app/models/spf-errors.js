const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const SPFError = new mongoose.Schema({
  org_domain: String,
  remote_address: String,
  from: String,
  client_hostname: String,
  result: String,
  explanation: String
});

SPFError.plugin(mongooseCommonPlugin, { object: 'spf_error' });

module.exports = mongoose.model('SPFError', SPFError);
