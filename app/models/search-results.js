/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const validator = require('@forwardemail/validator');

const locales = require('#config/locales');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const SearchResults = new mongoose.Schema(
  {
    href: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: validator.isURL,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      validator: isSANB,
      index: true
    },
    header: {
      type: String,
      trim: true,
      index: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      validator: isSANB
    },
    locale: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: locales
    }
  },
  {
    versionKey: false
  }
);

SearchResults.index(
  {
    title: 'text',
    header: 'text',
    content: 'text'
  },
  {
    weights: {
      title: 10,
      header: 5,
      content: 1
    }
  }
);

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'LOGS_URI'
);
module.exports = conn.model('SearchResults', SearchResults);
