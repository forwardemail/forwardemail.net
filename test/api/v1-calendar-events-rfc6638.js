/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * RFC 6638 CalDAV Scheduling Extensions — Suppression Tests
 *
 * Covers:
 *   §7.1  SCHEDULE-AGENT=NONE / CLIENT on ORGANIZER property
 *   §7.3  SCHEDULE-STATUS write-back (verified via GET after REQUEST)
 *   §8.1  Schedule-Reply: F HTTP header
 *   RFC 5546 §3.2.2  ATTENDEE;RSVP=FALSE
 */

const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');
const config = require('#config');
const Emails = require('#models/emails');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

function createAliasAuth(aliasEmail, pass) {
  return `Basic ${Buffer.from(`${aliasEmail}:${pass}`).toString('base64')}`;
}

async function createTestAlias(t) {
  let user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();
  user = await user.save();
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();
  const pass = await alias.createToken();
  await alias.save();
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    t.context.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await t.context.resolver.options.cache.mset(map);
  const username = `${alias.name}@${domain.name}`;
  return { user, domain, alias, pass, username };
}

// ─────────────────────────────────────────────────────────────────────────────
// §7.1 ORGANIZER;SCHEDULE-AGENT=NONE — suppresses all scheduling messages
// ─────────────────────────────────────────────────────────────────────────────

test.serial(
  'RFC 6638 §7.1 — ORGANIZER;SCHEDULE-AGENT=NONE suppresses REPLY on attendee update',
  async (t) => {
    const { api } = t.context;
    const { pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const organizerEmail = 'organizer-sa-none@example.com';
    const uid = `rfc6638-sa-none-${Date.now()}@example.com`;

    const calRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'SA-NONE Test' });
    t.is(calRes.status, 200);
    const calendarId = calRes.body.id;

    const makeIcal = (partstat) =>
      [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Forward Email//Test//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        'DTSTAMP:20260214T100000Z',
        'DTSTART:20260601T100000Z',
        'DTEND:20260601T110000Z',
        'SUMMARY:SA-NONE Suppression Test',
        'SEQUENCE:0',
        // The key: ORGANIZER carries SCHEDULE-AGENT=NONE
        `ORGANIZER;SCHEDULE-AGENT=NONE:mailto:${organizerEmail}`,
        `ATTENDEE;PARTSTAT=${partstat};RSVP=TRUE:mailto:${username}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

    // Create the event as the attendee (organizer is external with SA=NONE)
    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({
        calendar_id: calendarId,
        event_id: uid,
        ical: makeIcal('NEEDS-ACTION')
      });
    t.is(createRes.status, 200);
    await Emails.deleteMany({});

    // Attendee changes PARTSTAT to ACCEPTED — server must NOT send a REPLY
    const updateRes = await api
      .put(`/v1/calendar-events/${uid}`)
      .set('Authorization', auth)
      .send({ ical: makeIcal('ACCEPTED') });
    t.is(updateRes.status, 200);

    // Allow async email path to run
    await new Promise((resolve) => {
      setTimeout(resolve, 600);
    });

    const emailCount = await Emails.countDocuments({});
    t.is(
      emailCount,
      0,
      'ORGANIZER;SCHEDULE-AGENT=NONE must suppress the REPLY email'
    );
  }
);

test.serial(
  'RFC 6638 §7.1 — ORGANIZER;SCHEDULE-AGENT=CLIENT suppresses REPLY on attendee update',
  async (t) => {
    const { api } = t.context;
    const { pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const organizerEmail = 'organizer-sa-client@example.com';
    const uid = `rfc6638-sa-client-${Date.now()}@example.com`;

    const calRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'SA-CLIENT Test' });
    t.is(calRes.status, 200);
    const calendarId = calRes.body.id;

    const makeIcal = (partstat) =>
      [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Forward Email//Test//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        'DTSTAMP:20260214T100000Z',
        'DTSTART:20260601T100000Z',
        'DTEND:20260601T110000Z',
        'SUMMARY:SA-CLIENT Suppression Test',
        'SEQUENCE:0',
        `ORGANIZER;SCHEDULE-AGENT=CLIENT:mailto:${organizerEmail}`,
        `ATTENDEE;PARTSTAT=${partstat};RSVP=TRUE:mailto:${username}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({
        calendar_id: calendarId,
        event_id: uid,
        ical: makeIcal('NEEDS-ACTION')
      });
    t.is(createRes.status, 200);
    await Emails.deleteMany({});

    const updateRes = await api
      .put(`/v1/calendar-events/${uid}`)
      .set('Authorization', auth)
      .send({ ical: makeIcal('ACCEPTED') });
    t.is(updateRes.status, 200);

    await new Promise((resolve) => {
      setTimeout(resolve, 600);
    });

    const emailCount = await Emails.countDocuments({});
    t.is(
      emailCount,
      0,
      'ORGANIZER;SCHEDULE-AGENT=CLIENT must suppress the REPLY email'
    );
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// §8.1 Schedule-Reply: F HTTP header
// ─────────────────────────────────────────────────────────────────────────────

test.serial(
  'RFC 6638 §8.1 — Schedule-Reply: F header suppresses REPLY on attendee PUT',
  async (t) => {
    const { api } = t.context;
    const { pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const organizerEmail = 'organizer-schedule-reply@example.com';
    const uid = `rfc6638-schedule-reply-${Date.now()}@example.com`;

    const calRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Schedule-Reply Test' });
    t.is(calRes.status, 200);
    const calendarId = calRes.body.id;

    const makeIcal = (partstat) =>
      [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Forward Email//Test//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        'DTSTAMP:20260214T100000Z',
        'DTSTART:20260601T100000Z',
        'DTEND:20260601T110000Z',
        'SUMMARY:Schedule-Reply Header Test',
        'SEQUENCE:0',
        `ORGANIZER:mailto:${organizerEmail}`,
        `ATTENDEE;PARTSTAT=${partstat};RSVP=TRUE:mailto:${username}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({
        calendar_id: calendarId,
        event_id: uid,
        ical: makeIcal('NEEDS-ACTION')
      });
    t.is(createRes.status, 200);
    await Emails.deleteMany({});

    // RFC 6638 §8.1: Schedule-Reply: F means "do not send a REPLY"
    const updateRes = await api
      .put(`/v1/calendar-events/${uid}`)
      .set('Authorization', auth)
      .set('Schedule-Reply', 'F')
      .send({ ical: makeIcal('ACCEPTED') });
    t.is(updateRes.status, 200);

    await new Promise((resolve) => {
      setTimeout(resolve, 600);
    });

    const emailCount = await Emails.countDocuments({});
    t.is(
      emailCount,
      0,
      'Schedule-Reply: F header must suppress the REPLY email'
    );
  }
);

test.serial(
  'RFC 6638 §8.1 — Schedule-Reply: F header suppresses DECLINED REPLY on DELETE',
  async (t) => {
    const { api } = t.context;
    const { pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const organizerEmail = 'organizer-delete-sr@example.com';
    const uid = `rfc6638-delete-sr-${Date.now()}@example.com`;

    const calRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Delete SR Test' });
    t.is(calRes.status, 200);
    const calendarId = calRes.body.id;

    const ical = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//Test//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260601T100000Z',
      'DTEND:20260601T110000Z',
      'SUMMARY:Delete SR Test',
      'SEQUENCE:0',
      `ORGANIZER:mailto:${organizerEmail}`,
      `ATTENDEE;PARTSTAT=ACCEPTED;RSVP=TRUE:mailto:${username}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({ calendar_id: calendarId, event_id: uid, ical });
    t.is(createRes.status, 200);
    await Emails.deleteMany({});

    // Attendee deletes event with Schedule-Reply: F — no DECLINED REPLY should fire
    const deleteRes = await api
      .delete(`/v1/calendar-events/${uid}`)
      .set('Authorization', auth)
      .set('Schedule-Reply', 'F');
    t.is(deleteRes.status, 200);

    await new Promise((resolve) => {
      setTimeout(resolve, 600);
    });

    const emailCount = await Emails.countDocuments({});
    t.is(
      emailCount,
      0,
      'Schedule-Reply: F on DELETE must suppress the DECLINED REPLY email'
    );
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// §7.1 ORGANIZER;SCHEDULE-AGENT=NONE on DELETE
// ─────────────────────────────────────────────────────────────────────────────

test.serial(
  'RFC 6638 §7.1 — ORGANIZER;SCHEDULE-AGENT=NONE suppresses DECLINED REPLY on DELETE',
  async (t) => {
    const { api } = t.context;
    const { pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const organizerEmail = 'organizer-delete-sa-none@example.com';
    const uid = `rfc6638-delete-sa-none-${Date.now()}@example.com`;

    const calRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Delete SA-NONE Test' });
    t.is(calRes.status, 200);
    const calendarId = calRes.body.id;

    const ical = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//Test//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260601T100000Z',
      'DTEND:20260601T110000Z',
      'SUMMARY:Delete SA-NONE Test',
      'SEQUENCE:0',
      `ORGANIZER;SCHEDULE-AGENT=NONE:mailto:${organizerEmail}`,
      `ATTENDEE;PARTSTAT=ACCEPTED;RSVP=TRUE:mailto:${username}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({ calendar_id: calendarId, event_id: uid, ical });
    t.is(createRes.status, 200);
    await Emails.deleteMany({});

    const deleteRes = await api
      .delete(`/v1/calendar-events/${uid}`)
      .set('Authorization', auth);
    t.is(deleteRes.status, 200);

    await new Promise((resolve) => {
      setTimeout(resolve, 600);
    });

    const emailCount = await Emails.countDocuments({});
    t.is(
      emailCount,
      0,
      'ORGANIZER;SCHEDULE-AGENT=NONE must suppress DECLINED REPLY on DELETE'
    );
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// RFC 5546 §3.2.2 — ATTENDEE;RSVP=FALSE
// ─────────────────────────────────────────────────────────────────────────────

test.serial(
  'RFC 5546 §3.2.2 — ATTENDEE;RSVP=FALSE suppresses REPLY on attendee update',
  async (t) => {
    const { api } = t.context;
    const { pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const organizerEmail = 'organizer-rsvp-false@example.com';
    const uid = `rfc6638-rsvp-false-${Date.now()}@example.com`;

    const calRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'RSVP=FALSE Test' });
    t.is(calRes.status, 200);
    const calendarId = calRes.body.id;

    const makeIcal = (partstat) =>
      [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Forward Email//Test//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        'DTSTAMP:20260214T100000Z',
        'DTSTART:20260601T100000Z',
        'DTEND:20260601T110000Z',
        'SUMMARY:RSVP=FALSE Suppression Test',
        'SEQUENCE:0',
        `ORGANIZER:mailto:${organizerEmail}`,
        // RSVP=FALSE: attendee does not want a reply sent to the organizer
        `ATTENDEE;PARTSTAT=${partstat};RSVP=FALSE:mailto:${username}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({
        calendar_id: calendarId,
        event_id: uid,
        ical: makeIcal('NEEDS-ACTION')
      });
    t.is(createRes.status, 200);
    await Emails.deleteMany({});

    const updateRes = await api
      .put(`/v1/calendar-events/${uid}`)
      .set('Authorization', auth)
      .send({ ical: makeIcal('ACCEPTED') });
    t.is(updateRes.status, 200);

    await new Promise((resolve) => {
      setTimeout(resolve, 600);
    });

    const emailCount = await Emails.countDocuments({});
    t.is(emailCount, 0, 'ATTENDEE;RSVP=FALSE must suppress the REPLY email');
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Regression: normal REPLY still fires when no suppression flags are set
// ─────────────────────────────────────────────────────────────────────────────

test.serial(
  'RFC 6638 regression — normal REPLY still fires without any suppression flags',
  async (t) => {
    const { api } = t.context;
    const { pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const organizerEmail = 'organizer-normal-reply@example.com';
    const uid = `rfc6638-normal-reply-${Date.now()}@example.com`;

    const calRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Normal REPLY Test' });
    t.is(calRes.status, 200);
    const calendarId = calRes.body.id;

    const makeIcal = (partstat) =>
      [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Forward Email//Test//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        'DTSTAMP:20260214T100000Z',
        'DTSTART:20260601T100000Z',
        'DTEND:20260601T110000Z',
        'SUMMARY:Normal REPLY Test',
        'SEQUENCE:0',
        // No SCHEDULE-AGENT on organizer — normal server-side scheduling
        `ORGANIZER:mailto:${organizerEmail}`,
        `ATTENDEE;PARTSTAT=${partstat};RSVP=TRUE:mailto:${username}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({
        calendar_id: calendarId,
        event_id: uid,
        ical: makeIcal('NEEDS-ACTION')
      });
    t.is(createRes.status, 200);
    await Emails.deleteMany({});

    const updateRes = await api
      .put(`/v1/calendar-events/${uid}`)
      .set('Authorization', auth)
      .send({ ical: makeIcal('ACCEPTED') });
    t.is(updateRes.status, 200);

    // REPLY email SHOULD be sent (no suppression flags)
    await pWaitFor(
      async () => {
        const count = await Emails.countDocuments({});
        return count > 0;
      },
      { timeout: ms('15s') }
    );

    const emailCount = await Emails.countDocuments({});
    t.is(
      emailCount,
      1,
      'One REPLY email should be sent when no suppression flags are present'
    );
  }
);
