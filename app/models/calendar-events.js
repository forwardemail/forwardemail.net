/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

const ICAL = require('ical.js');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const validationErrorTransform = require('mongoose-validation-error-transform');

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
    /*
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
    */

    // via `ctx.state.params.eventId` from `caldav-adapter`
    eventId: {
      type: String,
      required: true,
      index: true
    },

    // for sync-collection
    // TODO: delete after 30d if set
    deleted_at: {
      type: Date,
      index: true
    },

    /*
    // <https://github.com/jens-maus/node-ical/blob/228ee19ed8af5177ab5139c82c32a15d5179f228/node-ical.d.ts#L65-L94>
    dtstamp: Date,
    uid: {
      type: String,
      required: true
    },
    */
    calendar: {
      type: mongoose.Schema.ObjectId,
      ref: Calendars,
      required: true,
      index: true
    },

    // Component type to differentiate between events and tasks
    componentType: {
      type: String,
      // enum: ['VEVENT', 'VTODO'],
      default: 'VEVENT',
      index: true
    },
    /*
    sequence: String,
    transparency: {
      type: String,
      enum: [null, 'TRANSPARENT', 'OPAQUE']
    },
    class: {
      type: String,
      enum: [null, 'PUBLIC', 'PRIVATE', 'CONFIDENTIAL']
    },
    summary: mongoose.Schema.Types.Mixed,
    start: Date,
    datetype: {
      type: String,
      enum: [null, 'date-time', 'date']
    },
    end: Date,
    location: mongoose.Schema.Types.Mixed,
    description: mongoose.Schema.Types.Mixed,
    url: {
      type: String,
      validator: (v) =>
        v === null ||
        v === undefined ||
        isURL(v, { require_tld: false, require_valid_protocol: false })
    },

    // TODO: PERCENT-COMPLETE is Number between 0 and 100
    completion: mongoose.Schema.Types.Mixed,

    created: Date,
    lastmodified: Date,

    attendee: mongoose.Schema.Types.Mixed,
    recurrences: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      // VEVENT: TENTATIVE, CONFIRMED, CANCELLED
      // VTODO: NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED
      enum: [null, 'TENTATIVE', 'CONFIRMED', 'CANCELLED', 'NEEDS-ACTION', 'IN-PROCESS', 'COMPLETED']
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
    */

    ical: {
      type: String,
      async validate(ics) {
        // > ical.sync.parseICS('BEGIN:VCALENDAR\nBEGIN:VEVENT\nEND:VEVENT\nEND:VCALENDAR')
        // {
        //   '770bc7b3-d4ec-4306-bbb0-a773e8206487': { type: 'VEVENT', params: [], end: 2024-01-27T20:43:19.700Z },
        //   vcalendar: { type: 'VCALENDAR' }
        // }
        // Also supports VTODO components for task management
        if (!isSANB(ics)) return false;

        // safeguard in case library isn't working for some reason
        const parsed = ICAL.parse(ics);
        if (!parsed || parsed.length === 0) {
          const err = new TypeError('ICAL.parse was not successful');
          err.parsed = parsed;
          throw err;
        }

        const comp = new ICAL.Component(parsed);
        if (!comp) throw new TypeError('ICAL.Component was not successful');

        const vevent = comp.getFirstSubcomponent('vevent');
        const vtodo = comp.getFirstSubcomponent('vtodo');

        if (!vevent && !vtodo)
          throw new TypeError('No valid VEVENT or VTODO component found');

        // Auto-detect and set component type
        if (vevent && !vtodo) {
          this.componentType = 'VEVENT';
        } else if (vtodo && !vevent) {
          this.componentType = 'VTODO';
        } else if (vevent && vtodo) {
          // If both exist, prioritize VEVENT for backward compatibility
          this.componentType = 'VEVENT';
        } else {
          this.componentType = 'VEVENT';
        }

        return true;
      }
    }

    // TODO: output the data types below and enforce them stricter

    /*
    // COMPLETED
    completed: mongoose.Schema.Types.Mixed,

    freebusy: {
      type: String,
      enum: [null, 'FREE', 'TENTATIVE', 'BUSY', 'OOF']
    },

    categories: [String],

    // TODO: `alarms` is not yet implemented (?)
    // <https://github.com/jens-maus/node-ical/issues/298>

    // x = [
    //   { key: 'X-SOMETHING', value: 'SOMEVALUE' },
    //   ...
    // ]
    x: mongoose.Schema.Types.Mixed
    */
  },
  dummySchemaOptions
);

// TODO: test that timezone in VCALENDAR works properly

// Composite index for efficient querying of non-deleted events per calendar
CalendarEvents.index({ calendar: 1, deleted_at: 1 });

CalendarEvents.plugin(sqliteVirtualDB);
CalendarEvents.plugin(validationErrorTransform);

module.exports = dummyProofModel(
  mongoose.model('CalendarEvents', CalendarEvents)
);
