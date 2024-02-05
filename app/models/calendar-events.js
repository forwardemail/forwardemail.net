/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

const ical = require('node-ical');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const validationErrorTransform = require('mongoose-validation-error-transform');
const { isURL } = require('validator');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const Calendars = require('#models/calendars');
const {
  dummyProofModel,
  dummySchemaOptions,
  sqliteVirtualDB
} = require('#helpers/mongoose-to-sqlite');

// TODO: note that there is a bug with timezone for recurring events
// <https://github.com/jens-maus/node-ical/pull/231>
const CalendarEvents = new mongoose.Schema(
  {
    // <https://github.com/jens-maus/node-ical/blob/228ee19ed8af5177ab5139c82c32a15d5179f228/node-ical.d.ts#L153>
    method: {
      type: String,
      enum: [
        null,
        'PUBLISH',
        'REQUEST',
        'REPLY',
        'ADD',
        'CANCEL',
        'REFRESH',
        'COUNTER',
        'DECLINECOUNTER'
      ]
    },

    // via `ctx.state.params.eventId` from `caldav-adapter`
    eventId: {
      type: String,
      required: true,
      index: true
    },

    // <https://github.com/jens-maus/node-ical/blob/228ee19ed8af5177ab5139c82c32a15d5179f228/node-ical.d.ts#L65-L94>
    dtstamp: Date,
    uid: {
      type: String,
      required: true
    },
    calendar: {
      type: mongoose.Schema.ObjectId,
      ref: Calendars,
      required: true,
      index: true
    },
    sequence: String,
    transparency: {
      type: String,
      enum: [null, 'TRANSPARENT', 'OPAQUE']
    },
    class: {
      type: String,
      enum: [null, 'PUBLIC', 'PRIVATE', 'CONFIDENTIAL']
    },
    summary: String,
    start: Date,
    datetype: {
      type: String,
      enum: [null, 'date-time', 'date']
    },
    end: Date,
    location: String,
    description: String,
    url: {
      type: String,
      validator: (v) => isURL(v, { require_tld: false })
    },
    completion: String,
    created: Date,
    lastmodified: Date,

    attendee: mongoose.Schema.Types.Mixed,
    recurrences: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: [null, 'TENTATIVE', 'CONFIRMED', 'CANCELLED']
    },

    //
    // > "I am not entirely sure about these, leave them as any for now.."
    //
    // <https://github.com/jens-maus/node-ical/blob/228ee19ed8af5177ab5139c82c32a15d5179f228/node-ical.d.ts#L89>
    // <https://github.com/sebbo2002/ical-generator/blob/fd502c537bf1a1e2bb5ae3579815921715fac190/src/types.ts#L34-L39>
    //
    organizer: mongoose.Schema.Types.Mixed,
    geo: mongoose.Schema.Types.Mixed,
    recurrenceid: mongoose.Schema.Types.Mixed,

    ical: {
      type: String,
      async validate(ics) {
        // > ical.sync.parseICS('BEGIN:VCALENDAR\nBEGIN:VEVENT\nEND:VEVENT\nEND:VCALENDAR')
        // {
        //   '770bc7b3-d4ec-4306-bbb0-a773e8206487': { type: 'VEVENT', params: [], end: 2024-01-27T20:43:19.700Z },
        //   vcalendar: { type: 'VCALENDAR' }
        // }
        if (!isSANB(ics)) return false;
        const events = await ical.async.parseICS(ics);
        return Object.keys(events).some(
          (key) =>
            typeof events[key] === 'object' && events[key].type === 'VEVENT'
        );
      }
    },

    // TODO: output the data types below and enforce them stricter

    completed: mongoose.Schema.Types.Mixed,
    freebusy: mongoose.Schema.Types.Mixed,

    categories: [String]

    // TODO: `alarms` is not yet implemented (?)
    // <https://github.com/jens-maus/node-ical/issues/298>
  },
  dummySchemaOptions
);

// TODO: test that timezone in VCALENDAR works properly

CalendarEvents.plugin(sqliteVirtualDB);
CalendarEvents.plugin(validationErrorTransform);

module.exports = dummyProofModel(
  mongoose.model('CalendarEvents', CalendarEvents)
);
