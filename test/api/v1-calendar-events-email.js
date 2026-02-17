/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
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

// Helper function to create alias auth header
function createAliasAuth(aliasEmail, pass) {
  return `Basic ${Buffer.from(`${aliasEmail}:${pass}`).toString('base64')}`;
}

// Helper function to create test alias with SMTP enabled
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
  // spoof dns records
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
  // store spoofed dns cache
  await t.context.resolver.options.cache.mset(map);
  const username = `${alias.name}@${domain.name}`;
  return { user, domain, alias, pass, username };
}

// ═══════════════════════════════════════════════════════════════════════════════
// REST API: POST /v1/calendar-events — Invite Email on Create
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'POST /v1/calendar-events with attendee queues REQUEST invite email',
  async (t) => {
    const { api } = t.context;
    const { alias, pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const attendeeEmail = 'attendee-api-create@example.com';
    const summary = 'API Create Invite Test';
    const uid = `api-create-email-${Date.now()}@example.com`;

    // First create a calendar
    const calendarRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Test Calendar', description: 'A test calendar' });
    t.is(calendarRes.status, 200);
    const calendarId = calendarRes.body.id;

    // Create event with attendee
    const ical = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//Test//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260501T100000Z',
      'DTEND:20260501T110000Z',
      `SUMMARY:${summary}`,
      'SEQUENCE:0',
      `ORGANIZER:mailto:${username}`,
      `ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({ calendar_id: calendarId, ical });
    t.is(createRes.status, 200);
    t.is(createRes.body.object, 'calendar_event');

    // Wait for the invite email to be queued
    let email;
    await pWaitFor(
      async () => {
        email = await Emails.findOne({
          alias: alias._id,
          status: 'queued',
          subject: { $regex: summary }
        })
          .lean()
          .exec();
        return email !== null;
      },
      { timeout: ms('30s') }
    );

    t.truthy(email, 'Invite email should be queued');
    t.true(
      email.subject.includes(summary),
      'Email subject should contain event summary'
    );
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// REST API: PUT /v1/calendar-events/:id — Update Email on Update
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'PUT /v1/calendar-events/:id with attendee queues REQUEST update email',
  async (t) => {
    const { api } = t.context;
    const { alias, pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const attendeeEmail = 'attendee-api-update@example.com';
    const originalSummary = 'API Original Meeting';
    const updatedSummary = 'API Updated Meeting';
    const uid = `api-update-email-${Date.now()}@example.com`;

    // Create a calendar
    const calendarRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Test Calendar' });
    t.is(calendarRes.status, 200);
    const calendarId = calendarRes.body.id;

    // Create the original event with attendee
    const originalIcal = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//Test//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260501T100000Z',
      'DTEND:20260501T110000Z',
      `SUMMARY:${originalSummary}`,
      'SEQUENCE:0',
      `ORGANIZER:mailto:${username}`,
      `ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({ calendar_id: calendarId, event_id: uid, ical: originalIcal });
    t.is(createRes.status, 200);

    // Wait for the initial invite email
    await pWaitFor(
      async () => {
        const e = await Emails.findOne({
          alias: alias._id,
          status: 'queued',
          subject: { $regex: originalSummary }
        })
          .lean()
          .exec();
        return e !== null;
      },
      { timeout: ms('30s') }
    );

    // Clear queued emails before update
    await Emails.deleteMany({});

    // Update the event with new summary and bumped SEQUENCE
    const updatedIcal = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//Test//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T120000Z',
      'DTSTART:20260501T140000Z',
      'DTEND:20260501T150000Z',
      `SUMMARY:${updatedSummary}`,
      'SEQUENCE:1',
      `ORGANIZER:mailto:${username}`,
      `ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const updateRes = await api
      .put(`/v1/calendar-events/${uid}`)
      .set('Authorization', auth)
      .send({ ical: updatedIcal });
    t.is(updateRes.status, 200);
    t.is(updateRes.body.summary, updatedSummary);

    // Wait for the update email to be queued
    let email;
    await pWaitFor(
      async () => {
        email = await Emails.findOne({
          alias: alias._id,
          status: 'queued',
          subject: { $regex: updatedSummary }
        })
          .lean()
          .exec();
        return email !== null;
      },
      { timeout: ms('30s') }
    );

    t.truthy(email, 'Update email should be queued');
    t.true(
      email.subject.includes(updatedSummary),
      'Email subject should contain updated summary'
    );
  }
);

test.serial(
  'PUT /v1/calendar-events/:id removing attendee queues CANCEL email',
  async (t) => {
    const { api } = t.context;
    const { alias, pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const attendeeEmail = 'attendee-api-removed@example.com';
    const summary = 'API Meeting Remove Attendee';
    const uid = `api-remove-attendee-${Date.now()}@example.com`;

    // Create a calendar
    const calendarRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Test Calendar' });
    t.is(calendarRes.status, 200);
    const calendarId = calendarRes.body.id;

    // Create event with attendee
    const originalIcal = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//Test//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260501T100000Z',
      'DTEND:20260501T110000Z',
      `SUMMARY:${summary}`,
      'SEQUENCE:0',
      `ORGANIZER:mailto:${username}`,
      `ATTENDEE;PARTSTAT=ACCEPTED;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({ calendar_id: calendarId, event_id: uid, ical: originalIcal });
    t.is(createRes.status, 200);

    // Wait for the initial invite email
    await pWaitFor(
      async () => {
        const e = await Emails.findOne({
          alias: alias._id,
          status: 'queued'
        })
          .lean()
          .exec();
        return e !== null;
      },
      { timeout: ms('30s') }
    );

    // Clear queued emails before update
    await Emails.deleteMany({});

    // Update event removing the attendee
    const updatedIcal = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//Test//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T120000Z',
      'DTSTART:20260501T100000Z',
      'DTEND:20260501T110000Z',
      `SUMMARY:${summary}`,
      'SEQUENCE:1',
      `ORGANIZER:mailto:${username}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const updateRes = await api
      .put(`/v1/calendar-events/${uid}`)
      .set('Authorization', auth)
      .send({ ical: updatedIcal });
    t.is(updateRes.status, 200);

    // Wait for the cancellation email to the removed attendee
    let email;
    await pWaitFor(
      async () => {
        email = await Emails.findOne({
          alias: alias._id,
          status: 'queued'
        })
          .lean()
          .exec();
        return email !== null;
      },
      { timeout: ms('30s') }
    );

    t.truthy(email, 'Cancel email should be queued for removed attendee');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// REST API: DELETE /v1/calendar-events/:id — Cancel Email on Delete
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'DELETE /v1/calendar-events/:id with attendee queues CANCEL email',
  async (t) => {
    const { api } = t.context;
    const { alias, pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const attendeeEmail = 'attendee-api-delete@example.com';
    const summary = 'API Meeting To Cancel';
    const uid = `api-delete-email-${Date.now()}@example.com`;

    // Create a calendar
    const calendarRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Test Calendar' });
    t.is(calendarRes.status, 200);
    const calendarId = calendarRes.body.id;

    // Create event with attendee
    const ical = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//Test//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260501T100000Z',
      'DTEND:20260501T110000Z',
      `SUMMARY:${summary}`,
      'SEQUENCE:0',
      `ORGANIZER:mailto:${username}`,
      `ATTENDEE;PARTSTAT=ACCEPTED;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({ calendar_id: calendarId, event_id: uid, ical });
    t.is(createRes.status, 200);

    // Wait for the initial invite email
    await pWaitFor(
      async () => {
        const e = await Emails.findOne({
          alias: alias._id,
          status: 'queued'
        })
          .lean()
          .exec();
        return e !== null;
      },
      { timeout: ms('30s') }
    );

    // Clear queued emails before delete
    await Emails.deleteMany({});

    // Delete the event
    const deleteRes = await api
      .delete(`/v1/calendar-events/${uid}`)
      .set('Authorization', auth);
    t.is(deleteRes.status, 200);
    t.truthy(deleteRes.body.deleted_at);

    // Wait for the cancellation email to be queued
    let email;
    await pWaitFor(
      async () => {
        email = await Emails.findOne({
          alias: alias._id,
          status: 'queued'
        })
          .lean()
          .exec();
        return email !== null;
      },
      { timeout: ms('30s') }
    );

    t.truthy(email, 'Cancel email should be queued');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// REST API: Recurring Event with Override — Invite Email
// ═══════════════════════════════════════════════════════════════════════════════

test.serial(
  'POST /v1/calendar-events recurring event with override queues invite email',
  async (t) => {
    const { api } = t.context;
    const { alias, pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const attendeeEmail = 'attendee-api-recur@example.com';
    const summary = 'API Weekly Standup';
    const overrideSummary = 'API Special Standup';
    const uid = `api-recur-email-${Date.now()}@example.com`;

    // Create a calendar
    const calendarRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Test Calendar' });
    t.is(calendarRes.status, 200);
    const calendarId = calendarRes.body.id;

    // Create recurring event with override
    const ical = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Forward Email//Test//EN',
      // Master event
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260501T100000Z',
      'DTEND:20260501T110000Z',
      'RRULE:FREQ=WEEKLY;COUNT=4',
      `SUMMARY:${summary}`,
      'SEQUENCE:0',
      `ORGANIZER:mailto:${username}`,
      `ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      // Override for 2nd occurrence
      'BEGIN:VEVENT',
      `UID:${uid}`,
      'RECURRENCE-ID:20260508T100000Z',
      'DTSTAMP:20260214T100000Z',
      'DTSTART:20260508T140000Z',
      'DTEND:20260508T150000Z',
      `SUMMARY:${overrideSummary}`,
      'SEQUENCE:0',
      `ORGANIZER:mailto:${username}`,
      `ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const createRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({ calendar_id: calendarId, event_id: uid, ical });
    t.is(createRes.status, 200);

    // Wait for at least one invite email to be queued
    await pWaitFor(
      async () => {
        const count = await Emails.countDocuments({
          alias: alias._id,
          status: 'queued'
        });
        return count >= 1;
      },
      { timeout: ms('30s') }
    );

    const emails = await Emails.find({
      alias: alias._id,
      status: 'queued'
    })
      .lean()
      .exec();

    t.true(emails.length > 0, 'At least one invite email should be queued');
  }
);
