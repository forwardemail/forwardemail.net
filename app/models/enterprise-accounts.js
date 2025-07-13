/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const EnterpriseAccount = new mongoose.Schema({
  // Association with user account
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: true,
    index: true
  },

  // Company Information
  company_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  company_address: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Account Status
  is_active: {
    type: Boolean,
    default: true,
    index: true
  }
});

EnterpriseAccount.plugin(mongooseCommonPlugin, {
  object: 'enterprise_account',
  locale: false
});

// Indexes for performance
EnterpriseAccount.index({ user: 1 });
EnterpriseAccount.index({ company_name: 1 });

module.exports = mongoose.model('EnterpriseAccount', EnterpriseAccount);
