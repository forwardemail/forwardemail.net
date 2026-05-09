/**
 * Tests for RFC 6638 Local CalDAV Scheduling
 *
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

'use strict';

const test = require('ava');
const sinon = require('sinon');
const ICAL = require('ical.js');
const mongoose = require('mongoose');
const utils = require('../utils');

const Aliases = require('#models/aliases');
const CalendarInvites = require('#models/calendar-invites');
const Domains = require('#models/domains');
const Emails = require('#models/emails');
const { sendCalendarEmail } = require('#helpers/send-calendar-email');
const calendarResponse = require('#helpers/calendar-response');

// ─── Test lifecycle ───────────────────────────────────────────────────────────

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeVcalendar({
  uid = 'event_123',
  organizer = 'organizer@example.com',
  attendees = []
} = {}) {
  const vcalendar = new ICAL.Component(['vcalendar', [], []]);
  const vevent = new ICAL.Component(['vevent', [], []]);
  vevent.addPropertyWithValue('uid', uid);
  vevent.addPropertyWithValue('summary', 'Test Event');
  vevent.addPropertyWithValue('dtstart', ICAL.Time.now());
  vevent.addPropertyWithValue('organizer', `mailto:${organizer}`);
  vevent.addPropertyWithValue('sequence', 0);
  for (const { email, partstat = 'NEEDS-ACTION' } of attendees) {
    const prop = new ICAL.Property('attendee');
    prop.setParameter('partstat', partstat);
    prop.setValue(`mailto:${email}`);
    vevent.addProperty(prop);
  }

  vcalendar.addSubcomponent(vevent);
  return vcalendar.toString();
}

function makeCtx({ username = 'organizer@example.com' } = {}) {
  return {
    state: {
      user: {
        alias_id: 'alias_org_id',
        domain_id: 'domain_org_id',
        username
      },
      session: {}
    },
    logger: {
      debug: sinon.stub(),
      error: sinon.stub(),
      fatal: sinon.stub(),
      info: sinon.stub(),
      warn: sinon.stub()
    },
    locale: 'en',
    client: null // ctx.client=null prevents APN push in tests
  };
}

// Organizer alias returned for the initial ctx.state.user.alias_id lookup
const ORGANIZER_ALIAS = {
  _id: new mongoose.Types.ObjectId(),
  id: 'alias_org_id',
  name: 'organizer',
  user: { _id: new mongoose.Types.ObjectId(), email: 'organizer@example.com' }
};

// Organizer domain returned for the initial ctx.state.user.domain_id lookup
const ORGANIZER_DOMAIN = {
  _id: new mongoose.Types.ObjectId(),
  id: 'domain_org_id',
  name: 'example.com',
  members: []
};

// Local attendee domain (for local delivery check — only example.com is local)
const LOCAL_DOMAIN = {
  _id: new mongoose.Types.ObjectId(),
  name: 'example.com',
  plan: 'enhanced_protection',
  has_smtp: true,
  has_txt_record: true,
  is_global: false,
  smtp_suspended_sent_at: null
};

// Local attendee alias (for local delivery check)
const LOCAL_ALIAS = {
  _id: new mongoose.Types.ObjectId(),
  id: 'alias_local_id',
  name: 'localuser',
  domain: LOCAL_DOMAIN._id,
  is_enabled: true,
  has_imap: true,
  is_banned: false
};

/**
 * Build a stub for Aliases.findOne that:
 *   - Returns ORGANIZER_ALIAS when queried by { id: ... } (organizer lookup)
 *   - Returns localAliasDoc when queried by { name: 'localuser', ... } (local delivery)
 *   - Returns null for any other alias name (e.g. 'remoteuser')
 */
function stubAliasesFindOne(sandbox, localAliasDoc = LOCAL_ALIAS) {
  return sandbox.stub(Aliases, 'findOne').callsFake((query) => {
    const isOrganizerLookup = Object.prototype.hasOwnProperty.call(query, 'id');
    let result;
    if (isOrganizerLookup) {
      result = ORGANIZER_ALIAS;
    } else if (query.name === 'localuser') {
      result = localAliasDoc;
    } else {
      result = null;
    }

    return {
      populate: sinon.stub().returnsThis(),
      lean: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves(result)
    };
  });
}

/**
 * Build a stub for Domains.findOne that:
 *   - Returns ORGANIZER_DOMAIN when queried by { id: ... } (organizer lookup)
 *   - Returns localDomainDoc when queried by { name: 'example.com', ... } (local delivery)
 *   - Returns null for any other domain name (e.g. 'other.com')
 */
function stubDomainsFindOne(sandbox, localDomainDoc = LOCAL_DOMAIN) {
  return sandbox.stub(Domains, 'findOne').callsFake((query) => {
    const isOrganizerLookup = Object.prototype.hasOwnProperty.call(query, 'id');
    let result;
    if (isOrganizerLookup) {
      result = ORGANIZER_DOMAIN;
    } else if (query.name === 'example.com') {
      result = localDomainDoc;
    } else {
      result = null;
    }

    return {
      populate: sinon.stub().returnsThis(),
      lean: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves(result)
    };
  });
}

// ─── Setup / teardown ─────────────────────────────────────────────────────────

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();
  t.context.calendarInvitesCreate = t.context.sandbox
    .stub(CalendarInvites, 'create')
    .resolves({ _id: new mongoose.Types.ObjectId() });
  t.context.emailsQueue = t.context.sandbox
    .stub(Emails, 'queue')
    .resolves({ _id: new mongoose.Types.ObjectId() });
  stubAliasesFindOne(t.context.sandbox);
  stubDomainsFindOne(t.context.sandbox);
  // Stub generateResponseLinks to avoid encryption key requirement in tests
  t.context.sandbox.stub(calendarResponse, 'generateResponseLinks').returns({
    accept: 'https://example.com/calendar/respond/accept/test-token',
    decline: 'https://example.com/calendar/respond/decline/test-token',
    tentative: 'https://example.com/calendar/respond/tentative/test-token'
  });
  t.context.ctx = makeCtx();
  t.context.calendar = { _id: new mongoose.Types.ObjectId() };
  t.context.calendarEvent = {
    eventId: 'event_123',
    ical: makeVcalendar({
      attendees: [
        { email: 'localuser@example.com' },
        { email: 'remoteuser@other.com' }
      ]
    })
  };
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

test('creates a CalendarInvites record for a local attendee', async (t) => {
  const { ctx, calendar, calendarEvent, calendarInvitesCreate } = t.context;
  await sendCalendarEmail(ctx, calendar, calendarEvent, 'REQUEST');
  t.true(
    calendarInvitesCreate.calledOnce,
    'CalendarInvites.create must be called once for the local attendee'
  );
  const doc = calendarInvitesCreate.firstCall.args[0];
  t.is(
    doc.organizerEmail,
    'localuser@example.com',
    'organizerEmail must be the attendee email (processCalendarInvites query convention)'
  );
  t.is(doc.attendeeEmail, 'localuser@example.com');
  t.is(doc.source, 'caldav-local');
  t.is(doc.method, 'REQUEST');
  t.is(doc.processed, false);
});

test('sets SCHEDULE-STATUS=1.2 on the local attendee property', async (t) => {
  const { ctx, calendar, calendarEvent } = t.context;
  await sendCalendarEmail(ctx, calendar, calendarEvent, 'REQUEST');
  const comp = new ICAL.Component(ICAL.parse(calendarEvent.ical));
  const vevent = comp.getFirstSubcomponent('vevent');
  for (const att of vevent.getAllProperties('attendee')) {
    const email = att.getFirstValue().replace('mailto:', '');
    if (email === 'localuser@example.com') {
      t.is(
        att.getParameter('schedule-status'),
        '1.2',
        'Local attendee must have SCHEDULE-STATUS=1.2'
      );
    }
  }
});

test('does not email the local attendee', async (t) => {
  const { ctx, calendar, calendarEvent, emailsQueue } = t.context;
  await sendCalendarEmail(ctx, calendar, calendarEvent, 'REQUEST');
  const queueCalls = emailsQueue.args.map((a) => a[0]);
  for (const call of queueCalls) {
    const { to } = call.message;
    t.false(
      String(to).includes('localuser@example.com'),
      'Local attendee must not appear in Emails.queue to field'
    );
  }
});

test('still emails remote attendees', async (t) => {
  const { ctx, calendar, calendarEvent, emailsQueue } = t.context;
  await sendCalendarEmail(ctx, calendar, calendarEvent, 'REQUEST');
  const allTo = emailsQueue.args.flatMap((a) => [a[0].message.to].flat());
  t.true(
    allTo.some((to) => String(to).includes('remoteuser@other.com')),
    'Remote attendee must still receive an email'
  );
});

test('falls back to email delivery when Domains.findOne returns null for attendee domain', async (t) => {
  const { sandbox, ctx, calendar } = t.context;
  // Restore the default stub and replace Domains.findOne to return null for local delivery
  sandbox.restore();
  t.context.calendarInvitesCreate = sandbox
    .stub(CalendarInvites, 'create')
    .resolves({});
  t.context.emailsQueue = sandbox
    .stub(Emails, 'queue')
    .resolves({ _id: new mongoose.Types.ObjectId() });
  stubAliasesFindOne(sandbox);
  sandbox.stub(Domains, 'findOne').callsFake((query) => {
    const isOrganizerLookup = Object.prototype.hasOwnProperty.call(query, 'id');
    return {
      populate: sinon.stub().returnsThis(),
      lean: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves(isOrganizerLookup ? ORGANIZER_DOMAIN : null)
    };
  });
  // Re-stub generateResponseLinks since sandbox.restore() removed it
  sandbox.stub(calendarResponse, 'generateResponseLinks').returns({
    accept: 'https://example.com/calendar/respond/accept/test-token',
    decline: 'https://example.com/calendar/respond/decline/test-token',
    tentative: 'https://example.com/calendar/respond/tentative/test-token'
  });
  const calendarEvent = {
    eventId: 'event_123',
    ical: makeVcalendar({
      attendees: [{ email: 'localuser@example.com' }]
    })
  };
  await sendCalendarEmail(ctx, calendar, calendarEvent, 'REQUEST');
  t.true(
    t.context.calendarInvitesCreate.notCalled,
    'CalendarInvites.create must not be called for unknown domain'
  );
  const allTo = t.context.emailsQueue.args.flatMap((a) =>
    [a[0].message.to].flat()
  );
  t.true(
    allTo.some((to) => String(to).includes('localuser@example.com')),
    'Unknown-domain attendee must fall back to email delivery'
  );
});

test('falls back to email delivery when Aliases.findOne returns null for attendee', async (t) => {
  const { sandbox, ctx, calendar } = t.context;
  sandbox.restore();
  t.context.calendarInvitesCreate = sandbox
    .stub(CalendarInvites, 'create')
    .resolves({});
  t.context.emailsQueue = sandbox
    .stub(Emails, 'queue')
    .resolves({ _id: new mongoose.Types.ObjectId() });
  stubDomainsFindOne(sandbox);
  sandbox.stub(Aliases, 'findOne').callsFake((query) => {
    const isOrganizerLookup = Object.prototype.hasOwnProperty.call(query, 'id');
    return {
      populate: sinon.stub().returnsThis(),
      lean: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves(isOrganizerLookup ? ORGANIZER_ALIAS : null)
    };
  });
  // Re-stub generateResponseLinks since sandbox.restore() removed it
  sandbox.stub(calendarResponse, 'generateResponseLinks').returns({
    accept: 'https://example.com/calendar/respond/accept/test-token',
    decline: 'https://example.com/calendar/respond/decline/test-token',
    tentative: 'https://example.com/calendar/respond/tentative/test-token'
  });
  const calendarEvent = {
    eventId: 'event_123',
    ical: makeVcalendar({
      attendees: [{ email: 'localuser@example.com' }]
    })
  };
  await sendCalendarEmail(ctx, calendar, calendarEvent, 'REQUEST');
  t.true(
    t.context.calendarInvitesCreate.notCalled,
    'CalendarInvites.create must not be called for unknown alias'
  );
});

test('does not overwrite SCHEDULE-STATUS=1.2 with 1.1 during write-back', async (t) => {
  const { ctx, calendar, calendarInvitesCreate } = t.context;
  const ical = makeVcalendar({
    attendees: [{ email: 'localuser@example.com' }]
  });
  const comp = new ICAL.Component(ICAL.parse(ical));
  const vevent = comp.getFirstSubcomponent('vevent');
  for (const att of vevent.getAllProperties('attendee')) {
    if (
      att.getFirstValue().replace('mailto:', '') === 'localuser@example.com'
    ) {
      att.setParameter('schedule-status', '1.2');
    }
  }

  const calendarEvent = { eventId: 'event_123', ical: comp.toString() };
  await sendCalendarEmail(ctx, calendar, calendarEvent, 'REQUEST');
  t.true(calendarInvitesCreate.calledOnce);
  const updatedComp = new ICAL.Component(ICAL.parse(calendarEvent.ical));
  const updatedVevent = updatedComp.getFirstSubcomponent('vevent');
  for (const att of updatedVevent.getAllProperties('attendee')) {
    if (
      att.getFirstValue().replace('mailto:', '') === 'localuser@example.com'
    ) {
      t.is(
        att.getParameter('schedule-status'),
        '1.2',
        'SCHEDULE-STATUS=1.2 must not be overwritten with 1.1'
      );
    }
  }
});

test('skips local delivery for wildcard alias (name=*)', async (t) => {
  const { sandbox, ctx, calendar } = t.context;
  sandbox.restore();
  t.context.calendarInvitesCreate = sandbox
    .stub(CalendarInvites, 'create')
    .resolves({});
  t.context.emailsQueue = sandbox
    .stub(Emails, 'queue')
    .resolves({ _id: new mongoose.Types.ObjectId() });
  stubDomainsFindOne(sandbox);
  const wildcardAlias = { ...LOCAL_ALIAS, name: '*' };
  sandbox.stub(Aliases, 'findOne').callsFake((query) => {
    const isOrganizerLookup = Object.prototype.hasOwnProperty.call(query, 'id');
    return {
      populate: sinon.stub().returnsThis(),
      lean: sinon.stub().returnsThis(),
      exec: sinon
        .stub()
        .resolves(isOrganizerLookup ? ORGANIZER_ALIAS : wildcardAlias)
    };
  });
  const calendarEvent = {
    eventId: 'event_123',
    ical: makeVcalendar({
      attendees: [{ email: 'localuser@example.com' }]
    })
  };
  await sendCalendarEmail(ctx, calendar, calendarEvent, 'REQUEST');
  t.true(
    t.context.calendarInvitesCreate.notCalled,
    'Wildcard alias must not receive local delivery'
  );
});

test('skips local delivery for disabled alias', async (t) => {
  const { sandbox, ctx, calendar } = t.context;
  sandbox.restore();
  t.context.calendarInvitesCreate = sandbox
    .stub(CalendarInvites, 'create')
    .resolves({});
  t.context.emailsQueue = sandbox
    .stub(Emails, 'queue')
    .resolves({ _id: new mongoose.Types.ObjectId() });
  stubDomainsFindOne(sandbox);
  // The real DB query uses { is_enabled: true }, so a disabled alias would
  // return null from MongoDB. Simulate that here.
  sandbox.stub(Aliases, 'findOne').callsFake((query) => {
    const isOrganizerLookup = Object.prototype.hasOwnProperty.call(query, 'id');
    return {
      populate: sinon.stub().returnsThis(),
      lean: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves(isOrganizerLookup ? ORGANIZER_ALIAS : null)
    };
  });
  const calendarEvent = {
    eventId: 'event_123',
    ical: makeVcalendar({
      attendees: [{ email: 'localuser@example.com' }]
    })
  };
  await sendCalendarEmail(ctx, calendar, calendarEvent, 'REQUEST');
  t.true(
    t.context.calendarInvitesCreate.notCalled,
    'Disabled alias must not receive local delivery'
  );
});
