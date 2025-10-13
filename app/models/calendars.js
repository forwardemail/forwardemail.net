/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const mongoose = require('mongoose');
// TODO: note there is no validation right now for timezones
//       (nor is there validation in user model for `user.timezone`)
//       however in the future we could use this library:
//       <https://github.com/vvo/tzdb>
//       and map the lookup alias from groups, e.g. Asia/Calcutta
//
const validationErrorTransform = require('mongoose-validation-error-transform');
const { isURL } = require('@forwardemail/validator');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const {
  dummyProofModel,
  dummySchemaOptions,
  sqliteVirtualDB
} = require('#helpers/mongoose-to-sqlite');

// <https://github.com/sebbo2002/ical-generator/blob/fd502c537bf1a1e2bb5ae3579815921715fac190/src/calendar.ts#L15-L27>
const Calendars = new mongoose.Schema(
  {
    // via `ctx.state.params.calendarId` from `caldav-adapter`
    calendarId: {
      type: String,
      required: true,
      index: true,
      unique: true
    },

    prodId: {
      type: String,
      default: '//forwardemail.net//caldav//EN'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    timezone: {
      type: String,
      required: true
    },
    source: String,
    url: {
      type: String,
      validator: (v) => isURL(v, { require_tld: false })
    },
    // (e.g. Gregorian)
    scale: {
      type: String,
      default: 'Gregorian'
    },
    // refresh-interval
    ttl: Number,

    //
    // NOTE: `events` are stored individually in `CalendarEvents`
    //       model with a foreign key reference to this `Calendar`
    //
    // events: mongoose.Schema.Types.Mixed,
    //

    // x = [
    //   { key: 'X-SOMETHING', value: 'SOMEVALUE' },
    //   ...
    // ]
    x: mongoose.Schema.Types.Mixed,

    //
    // <https://github.com/sebbo2002/ical-generator/issues/516>
    // <https://github.com/sebbo2002/ical-generator/issues/153>
    //
    // const validateColor = require('validate-color');
    //
    color: {
      type: String,
      required: true,
      trim: true,
      default: '#0066ff'
      // validate: (color) =>
      //   typeof color === 'string' && validateColor.default(color)
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },

    //
    // NOTE: `readonly` and `synctoken` are arbitary non-VCALENDAR props for our implementation
    //
    readonly: {
      type: Boolean,
      required: true,
      default: false
    },
    synctoken: {
      type: String,
      required: true,
      lowercase: true,
      validate: (v) => isURL(v, { require_tld: false }) // require_tld: config.env === 'production'
    },

    // Supported calendar component types (RFC 5545)
    has_vevent: {
      type: Boolean,
      required: true,
      default: true,
      index: true
    },
    has_vtodo: {
      type: Boolean,
      required: true,
      default: true,
      index: true
    }
  },
  dummySchemaOptions
);

Calendars.plugin(sqliteVirtualDB);
Calendars.plugin(validationErrorTransform);

module.exports = dummyProofModel(mongoose.model('Calendars', Calendars));
