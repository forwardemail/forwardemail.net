/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const ObjectID = require('bson-objectid');
const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');
const config = require('#config');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);

// Helper function to create alias auth header
function createAliasAuth(aliasEmail, pass) {
  return `Basic ${Buffer.from(`${aliasEmail}:${pass}`).toString('base64')}`;
}

// Helper function to create test alias
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

  return { user, domain, alias, pass };
}

//
// Contacts Tests
//

test('fails contacts list without auth', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/contacts');
  t.is(res.status, 401);
});

test('lists contacts with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get('/v1/contacts')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  // Should return 200 with empty array initially
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test('creates contact with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const contactData = {
    full_name: falso.randFullName(),
    emails: [{ value: falso.randEmail(), type: 'INTERNET' }],
    phone_numbers: [{ value: falso.randPhoneNumber(), type: 'CELL' }]
  };

  const res = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(contactData);

  // Should create contact successfully
  t.is(res.status, 200);
  t.is(res.body.object, 'contact');
  t.is(res.body.full_name, contactData.full_name);
});

test('retrieves contact with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // First create a contact
  const contactData = {
    full_name: falso.randFullName()
  };

  const createRes = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(contactData);

  t.is(createRes.status, 200);

  // Then retrieve it
  const res = await api
    .get(`/v1/contacts/${createRes.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.id, createRes.body.id);
});

test('updates contact with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // First create a contact
  const contactData = {
    full_name: falso.randFullName()
  };

  const createRes = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(contactData);

  t.is(createRes.status, 200);

  // Then update it
  const updateData = {
    full_name: falso.randFullName()
  };

  const res = await api
    .put(`/v1/contacts/${createRes.body.id}`)
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(updateData);

  t.is(res.status, 200);
  t.is(res.body.full_name, updateData.full_name);
});

test('deletes contact with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // First create a contact
  const contactData = {
    full_name: falso.randFullName()
  };

  const createRes = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(contactData);

  t.is(createRes.status, 200);

  // Then delete it
  const res = await api
    .delete(`/v1/contacts/${createRes.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.id, createRes.body.id);
});

//
// Calendars Tests
//

test('fails calendars list without auth', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/calendars');
  t.is(res.status, 401);
});

test('lists calendars with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get('/v1/calendars')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  // Should return 200 with empty array initially
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test('creates calendar with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const calendarData = {
    name: 'Test Calendar',
    description: 'A test calendar',
    color: '#ff0000',
    timezone: 'America/New_York'
  };

  const res = await api
    .post('/v1/calendars')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(calendarData);

  // Should create calendar successfully
  t.is(res.status, 200);
  t.is(res.body.object, 'calendar');
  t.is(res.body.name, calendarData.name);
});

//
// Calendar Events Tests
//

test('fails calendar events list without auth', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/calendar-events');
  t.is(res.status, 401);
});

test('lists calendar events with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get('/v1/calendar-events')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  // Should return 200 with empty array initially
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test('creates calendar event with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // First create a calendar
  const calendarRes = await api
    .post('/v1/calendars')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'Test Calendar',
      description: 'A test calendar'
    });

  t.is(calendarRes.status, 200);
  const calendarId = calendarRes.body.id;

  // Create calendar event with iCal data
  const eventData = {
    calendar_id: calendarId,
    ical: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test Corp//Test Calendar//EN
BEGIN:VEVENT
UID:test-event-${Date.now()}@example.com
DTSTART:20250101T120000Z
DTEND:20250101T130000Z
SUMMARY:Test Event
DESCRIPTION:This is a test event
LOCATION:Conference Room A
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`
  };

  const res = await api
    .post('/v1/calendar-events')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(eventData);

  // Should create calendar event successfully
  t.is(res.status, 200);
  t.is(res.body.object, 'calendar_event');
  t.is(res.body.calendar_id, calendarId);
  t.is(res.body.summary, 'Test Event');
  t.is(res.body.description, 'This is a test event');
  t.is(res.body.location, 'Conference Room A');
  t.truthy(res.body.ical);
});

test('retrieves calendar event with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // First create a calendar
  const calendarRes = await api
    .post('/v1/calendars')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'Test Calendar',
      description: 'A test calendar'
    });

  const calendarId = calendarRes.body.id;

  // Create calendar event
  const eventData = {
    calendar_id: calendarId,
    ical: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test Corp//Test Calendar//EN
BEGIN:VEVENT
UID:test-event-retrieve-${Date.now()}@example.com
DTSTART:20250101T140000Z
DTEND:20250101T150000Z
SUMMARY:Retrieve Test Event
DESCRIPTION:Event for retrieval testing
END:VEVENT
END:VCALENDAR`
  };

  const createRes = await api
    .post('/v1/calendar-events')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(eventData);

  t.is(createRes.status, 200);

  // Retrieve the calendar event
  const res = await api
    .get(`/v1/calendar-events/${createRes.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.id, createRes.body.id);
  t.is(res.body.summary, 'Retrieve Test Event');
});

test('updates calendar event with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // First create a calendar
  const calendarRes = await api
    .post('/v1/calendars')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'Test Calendar',
      description: 'A test calendar'
    });

  const calendarId = calendarRes.body.id;

  // Create calendar event
  const eventData = {
    calendar_id: calendarId,
    ical: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test Corp//Test Calendar//EN
BEGIN:VEVENT
UID:test-event-update-${Date.now()}@example.com
DTSTART:20250101T160000Z
DTEND:20250101T170000Z
SUMMARY:Update Test Event
DESCRIPTION:Event for update testing
END:VEVENT
END:VCALENDAR`
  };

  const createRes = await api
    .post('/v1/calendar-events')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(eventData);

  t.is(createRes.status, 200);

  // Update the calendar event
  const updateData = {
    ical: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test Corp//Test Calendar//EN
BEGIN:VEVENT
UID:test-event-update-${Date.now()}@example.com
DTSTART:20250101T160000Z
DTEND:20250101T170000Z
SUMMARY:Updated Test Event
DESCRIPTION:Updated event description
LOCATION:Updated Location
END:VEVENT
END:VCALENDAR`
  };

  const res = await api
    .put(`/v1/calendar-events/${createRes.body.id}`)
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(updateData);

  t.is(res.status, 200);
  t.is(res.body.id, createRes.body.id);
  t.is(res.body.summary, 'Updated Test Event');
  t.is(res.body.description, 'Updated event description');
  t.is(res.body.location, 'Updated Location');
});

test('deletes calendar event with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // First create a calendar
  const calendarRes = await api
    .post('/v1/calendars')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'Test Calendar',
      description: 'A test calendar'
    });

  const calendarId = calendarRes.body.id;

  // Create calendar event
  const eventData = {
    calendar_id: calendarId,
    ical: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test Corp//Test Calendar//EN
BEGIN:VEVENT
UID:test-event-delete-${Date.now()}@example.com
DTSTART:20250101T180000Z
DTEND:20250101T190000Z
SUMMARY:Delete Test Event
DESCRIPTION:Event for deletion testing
END:VEVENT
END:VCALENDAR`
  };

  const createRes = await api
    .post('/v1/calendar-events')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(eventData);

  t.is(createRes.status, 200);

  // Delete the calendar event
  const res = await api
    .delete(`/v1/calendar-events/${createRes.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.id, createRes.body.id);
  t.truthy(res.body.deleted_at); // Should have deletion timestamp
});

test('calendar events list supports filtering by calendar_id', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create two calendars
  const calendar1Res = await api
    .post('/v1/calendars')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'Calendar 1',
      description: 'First calendar'
    });

  const calendar2Res = await api
    .post('/v1/calendars')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'Calendar 2',
      description: 'Second calendar'
    });

  const calendar1Id = calendar1Res.body.id;
  const calendar2Id = calendar2Res.body.id;

  // Create events in both calendars
  await api
    .post('/v1/calendar-events')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      calendar_id: calendar1Id,
      ical: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test Corp//Test Calendar//EN
BEGIN:VEVENT
UID:event1-${Date.now()}@example.com
DTSTART:20250101T100000Z
DTEND:20250101T110000Z
SUMMARY:Event in Calendar 1
END:VEVENT
END:VCALENDAR`
    });

  await api
    .post('/v1/calendar-events')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      calendar_id: calendar2Id,
      ical: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test Corp//Test Calendar//EN
BEGIN:VEVENT
UID:event2-${Date.now()}@example.com
DTSTART:20250101T120000Z
DTEND:20250101T130000Z
SUMMARY:Event in Calendar 2
END:VEVENT
END:VCALENDAR`
    });

  // Filter events by calendar_id
  const res = await api
    .get(`/v1/calendar-events?calendar_id=${calendar1Id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.is(res.body.length, 1);
  t.is(res.body[0].calendar_id, calendar1Id);
  t.is(res.body[0].summary, 'Event in Calendar 1');
});

test('calendar events list supports pagination', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // First create a calendar
  const calendarRes = await api
    .post('/v1/calendars')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'Test Calendar',
      description: 'A test calendar'
    });

  const calendarId = calendarRes.body.id;

  // Create multiple calendar events for pagination testing
  for (let i = 0; i < 8; i++) {
    await api
      .post('/v1/calendar-events')
      .set(
        'Authorization',
        createAliasAuth(`${alias.name}@${domain.name}`, pass)
      )
      .send({
        calendar_id: calendarId,
        ical: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test Corp//Test Calendar//EN
BEGIN:VEVENT
UID:pagination-event-${i}-${Date.now()}@example.com
DTSTART:2025010${i + 1}T100000Z
DTEND:2025010${i + 1}T110000Z
SUMMARY:Pagination Test Event ${i}
DESCRIPTION:Event ${i} for pagination testing
END:VEVENT
END:VCALENDAR`
      });
  }

  // Test pagination
  const res = await api
    .get('/v1/calendar-events?page=1&limit=5')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.is(res.body.length, 5);
  t.truthy(res.headers['x-page-count']);
  t.truthy(res.headers['x-page-current']);
});

test('calendar events create validates required fields', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/calendar-events')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({}); // Empty body

  t.is(res.status, 400);
  t.truthy(res.body.message);
});

test('calendar events create validates iCal format', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // First create a calendar
  const calendarRes = await api
    .post('/v1/calendars')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'Test Calendar',
      description: 'A test calendar'
    });

  const calendarId = calendarRes.body.id;

  const res = await api
    .post('/v1/calendar-events')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      calendar_id: calendarId,
      ical: 'invalid ical data'
    });

  t.is(res.status, 400);
  t.truthy(res.body.message);
});

test('calendar events supports date range filtering', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // First create a calendar
  const calendarRes = await api
    .post('/v1/calendars')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'Test Calendar',
      description: 'A test calendar'
    });

  const calendarId = calendarRes.body.id;

  // Create events with different dates
  await api
    .post('/v1/calendar-events')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      calendar_id: calendarId,
      ical: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test Corp//Test Calendar//EN
BEGIN:VEVENT
UID:early-event-${Date.now()}@example.com
DTSTART:20241201T100000Z
DTEND:20241201T110000Z
SUMMARY:Early Event
END:VEVENT
END:VCALENDAR`
    });

  await api
    .post('/v1/calendar-events')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      calendar_id: calendarId,
      ical: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test Corp//Test Calendar//EN
BEGIN:VEVENT
UID:within-range-event-${Date.now()}@example.com
DTSTART:20250115T100000Z
DTEND:20250115T110000Z
SUMMARY:Within Range Event
END:VEVENT
END:VCALENDAR`
    });

  // Filter events by date range
  const res = await api
    .get(
      '/v1/calendar-events?start_date=2025-01-01T00:00:00Z&end_date=2025-01-31T23:59:59Z'
    )
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  // Should only return the event that falls within the date range
  const withinRangeEvent = res.body.find(
    (event) => event.summary === 'Within Range Event'
  );
  t.truthy(withinRangeEvent);
  const earlyEvent = res.body.find((event) => event.summary === 'Early Event');
  t.falsy(earlyEvent);
});

//
// Messages Tests
//

test('fails messages list without auth', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/messages');
  t.is(res.status, 401);
});

test('lists messages with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get('/v1/messages')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  // Should return 200 with empty array initially
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test('creates, retrieves, and deletes message with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const messageData = {
    to: [falso.randEmail()],
    subject: 'Test Message',
    text: 'This is a test message',
    folder: 'INBOX'
  };

  const res = await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(messageData);

  // Should create message successfully
  t.is(res.status, 200);
  t.is(res.body.object, 'message');
  t.is(res.body.subject, messageData.subject);

  const retrieveRes = await api
    .get(`/v1/messages/${res.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  // Should retrieve message
  t.is(retrieveRes.status, 200);
  t.is(retrieveRes.body.object, 'message');
  t.is(retrieveRes.body.subject, messageData.subject);

  // List message from folder
  const listRes = await api
    .get(`/v1/messages?folder=${messageData.folder}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  // Should list messages
  t.is(listRes.status, 200);
  t.is(listRes.body.length, 1);

  const deleteRes = await api
    .delete(`/v1/messages/${res.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(deleteRes.status, 200);
  t.is(deleteRes.body.id, res.body.id);

  const deletedConfirmationRes = await api
    .get(`/v1/messages/${res.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  // Should not return message
  t.is(deletedConfirmationRes.status, 404);
});

//
// Folders Tests
//

test('fails folders list without auth', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/folders');
  t.is(res.status, 401);
});

test('lists folders with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get('/v1/folders')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  // Should return 200 with array (may include default folders)
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test('creates and deletes folder with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const folderData = {
    // name: 'Test Folder',
    path: 'Test Folder'
    // subscribed: true
  };

  const res = await api
    .post('/v1/folders')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(folderData);

  // Should create folder successfully
  t.is(res.status, 200);
  t.is(res.body.object, 'folder');
  t.is(res.body.path, folderData.path);

  const deleteRes = await api
    .delete(`/v1/folders/${res.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(deleteRes.status, 200);
  t.is(deleteRes.body.id, res.body.id);
});

//
// Authentication Tests
//

test('rejects invalid alias credentials', async (t) => {
  const { api } = t.context;

  const res = await api
    .get('/v1/contacts')
    .set(
      'Authorization',
      createAliasAuth('invalid@example.com', 'wrong-password')
    );

  t.is(res.status, 401);
});

test('rejects malformed auth header', async (t) => {
  const { api } = t.context;

  const res = await api
    .get('/v1/contacts')
    .set('Authorization', 'Bearer invalid-token');

  t.is(res.status, 401);
});

test('rejects missing auth header', async (t) => {
  const { api } = t.context;

  const res = await api.get('/v1/contacts');

  t.is(res.status, 401);
});

//
// Pagination Tests
//

test('contacts list supports pagination', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create multiple contacts for pagination testing
  for (let i = 0; i < 15; i++) {
    await api
      .post('/v1/contacts')
      .set(
        'Authorization',
        createAliasAuth(`${alias.name}@${domain.name}`, pass)
      )
      .send({
        full_name: `Test Contact ${i}`,
        emails: [{ value: `test${i}@example.com`, type: 'INTERNET' }]
      });
  }

  // Test first page
  const res1 = await api
    .get('/v1/contacts?page=1&limit=10')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res1.status, 200);
  t.is(res1.body.length, 10);
  t.truthy(res1.headers['x-page-count']);
  t.truthy(res1.headers['x-page-current']);
  t.truthy(res1.headers['x-page-size']);
  t.truthy(res1.headers['x-item-count']);

  // Test second page
  const res2 = await api
    .get('/v1/contacts?page=2&limit=10')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res2.status, 200);
  t.is(res2.body.length, 5); // Remaining 5 contacts
});

test('messages list supports pagination and filtering', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create multiple messages for pagination testing
  for (let i = 0; i < 10; i++) {
    const res = await api
      .post('/v1/messages')
      .set(
        'Authorization',
        createAliasAuth(`${alias.name}@${domain.name}`, pass)
      )
      .send({
        to: [{ address: 'test@example.com' }],
        subject: `Test Message ${i}`,
        text: `This is test message ${i}`,
        flags: i % 2 === 0 ? ['\\Seen'] : []
      });
    t.is(res.status, 200);
    t.log(res.headers['x-response-time']);
  }

  // Fetch list x-response-time
  for (let i = 0; i < 5; i++) {
    const res = await api
      .get('/v1/messages')
      .set(
        'Authorization',
        createAliasAuth(`${alias.name}@${domain.name}`, pass)
      );
    t.is(res.status, 200);
    t.log(res.headers['x-response-time']);
  }

  // Test pagination
  const res1 = await api
    .get('/v1/messages?page=1&limit=5')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res1.status, 200);
  t.is(res1.body.length, 5);
  t.truthy(res1.headers['x-page-count']);

  // Test filtering unread messages
  const res2 = await api
    .get('/v1/messages?is_unread=true')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res2.status, 200);
  t.true(res2.body.every((msg) => msg.is_unread === true));
});

test('calendars list supports pagination', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create multiple calendars for pagination testing
  for (let i = 0; i < 8; i++) {
    await api
      .post('/v1/calendars')
      .set(
        'Authorization',
        createAliasAuth(`${alias.name}@${domain.name}`, pass)
      )
      .send({
        name: `Test Calendar ${i}`,
        description: `Description for calendar ${i}`,
        color: '#0066ff'
      });
  }

  // Test pagination
  const res = await api
    .get('/v1/calendars?page=1&limit=5')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 5);
  t.truthy(res.headers['x-page-count']);
  t.truthy(res.headers['x-item-count']);
});

test('folders list supports pagination and filtering', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create multiple folders for pagination testing
  for (let i = 0; i < 7; i++) {
    await api
      .post('/v1/folders')
      .set(
        'Authorization',
        createAliasAuth(`${alias.name}@${domain.name}`, pass)
      )
      .send({
        path: `TestFolder${i}`
        // subscribed: i % 2 === 0
      });
  }

  // Test pagination
  const res1 = await api
    .get('/v1/folders?page=1&limit=5')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res1.status, 200);
  t.is(res1.body.length, 5);
  t.truthy(res1.headers['x-page-count']);

  // Test filtering subscribed folders
  const res2 = await api
    .get('/v1/folders?subscribed=true')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res2.status, 200);
  t.true(res2.body.every((folder) => folder.subscribed === true));
});

//
// Error Handling Tests
//

test('contacts create validates required fields', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({}); // Empty body

  t.is(res.status, 400);
  t.truthy(res.body.message);
});

test('messages create validates fields', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({ attachments: true });

  t.is(res.status, 400);
  t.truthy(res.body.message);
});

test('calendars create validates required fields', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/calendars')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({}); // Empty body

  t.is(res.status, 400);
  t.truthy(res.body.message);
});

test('folders create validates required fields', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/folders')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({}); // Empty body

  t.is(res.status, 400);
  t.truthy(res.body.message);
});

//
// Update and Delete Tests
//

test('messages update with folder change', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create folder first
  const folderRes = await api
    .post('/v1/folders')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      path: 'TestFolder'
    });

  t.is(folderRes.status, 200);
  t.is(folderRes.body.path, 'TestFolder');

  // Update folder name
  const renameFolderRes = await api
    .put(`/v1/folders/${folderRes.body.id}`)
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      path: 'TestFolderRenamed'
    });

  t.is(renameFolderRes.status, 200);
  t.is(renameFolderRes.body.path, 'TestFolderRenamed');

  // Create message
  const createRes = await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'folder@example.com' }],
      subject: 'Folder Test Message',
      text: 'This message will be moved'
    });

  t.is(createRes.status, 200);
  t.is(createRes.body.folder_path, 'INBOX');

  // Move message to folder
  const updateRes = await api
    .put(`/v1/messages/${createRes.body.id}`)
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      folder: 'TestFolderRenamed'
    });

  t.is(updateRes.status, 200);
  t.is(updateRes.body.folder_path, 'TestFolderRenamed');
});

test('delete operations work correctly', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create and delete contact
  const contactRes = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      full_name: 'Delete Test Contact',
      emails: [{ value: 'delete@example.com', type: 'INTERNET' }]
    });

  t.is(contactRes.status, 200);

  const deleteRes = await api
    .delete(`/v1/contacts/${contactRes.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(deleteRes.status, 200);

  // Verify contact is deleted
  const retrieveRes = await api
    .get(`/v1/contacts/${contactRes.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(retrieveRes.status, 404);
});

//
// Invalid ID Tests
//

test('invalid contact ID returns 404', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get('/v1/contacts/invalid-id')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 404);
});

test('invalid message ID returns 400', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get('/v1/messages/invalid-id')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 400);
});

test('non-existent contact returns 404', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get(`/v1/contacts/${new ObjectID()}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 404);
});

//
// Pagination Edge Cases
//

test('pagination handles empty results', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get('/v1/contacts?page=1&limit=10')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 0);
  t.is(res.headers['x-page-count'], '1');
  t.is(res.headers['x-item-count'], '0');
});

test('pagination handles large page numbers', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create one contact
  await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      full_name: 'Single Contact',
      emails: [{ value: 'single@example.com', type: 'INTERNET' }]
    });

  // Request page 10 (beyond available data)
  const res = await api
    .get('/v1/contacts?page=10&limit=10')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 0);
  t.is(res.headers['x-page-count'], '1');
  t.is(res.headers['x-item-count'], '1');
});

//
// Advanced Search Tests
//

test('messages search by subject', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create messages with different subjects
  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'Important Meeting Tomorrow',
      text: 'Please attend the meeting'
    });

  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'Project Update',
      text: 'Status report attached'
    });

  // Search by subject
  const res = await api
    .get('/v1/messages?subject=meeting')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 1);
  t.true(res.body[0].subject.toLowerCase().includes('meeting'));
});

test('messages search by body content', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create messages with different body content
  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'Test Message 1',
      text: 'This message contains important information about the quarterly report'
    });

  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'Test Message 2',
      text: 'This is just a regular update message'
    });

  // Search by body content
  const res = await api
    .get('/v1/messages?body=quarterly')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 1);
  t.true(res.body[0].subject.includes('Test Message 1'));
});

test('messages search by sender', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create messages from different senders
  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      from: 'john.doe@company.com',
      subject: 'Message from John',
      text: 'Hello from John'
    });

  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      from: 'jane.smith@company.com',
      subject: 'Message from Jane',
      text: 'Hello from Jane'
    });

  // Search by sender
  const res = await api
    .get('/v1/messages?from=john.doe')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 1);
  t.true(res.body[0].subject.includes('John'));
});

test('messages search by recipient', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create messages to different recipients
  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'sales@company.com' }],
      subject: 'Sales Inquiry',
      text: 'Question about pricing'
    });

  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'support@company.com' }],
      subject: 'Support Request',
      text: 'Need help with setup'
    });

  // Search by recipient
  const res = await api
    .get('/v1/messages?to=sales')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 1);
  t.true(res.body[0].subject.includes('Sales'));
});

test('messages general search across multiple fields', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create messages with search term in different fields
  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'Project Alpha Update',
      text: 'Status report for the project'
    });

  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      from: 'alpha.team@company.com',
      subject: 'Weekly Report',
      text: "This week's progress"
    });

  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'Unrelated Message',
      text: 'Nothing to do with the search term'
    });

  // General search should find messages with "alpha" in subject or from field
  const res = await api
    .get('/v1/messages?search=alpha')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 2);
});

test('messages search with date range', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create a message
  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'Recent Message',
      text: 'This is a recent message'
    });

  // Search with date range (last 24 hours)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const res = await api
    .get(`/v1/messages?since=${yesterday}&before=${tomorrow}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.true(res.body.length > 0);
});

test('messages search by size range', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create messages of different sizes
  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'Short',
      text: 'Hi'
    });

  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'Long Message',
      text: 'This is a much longer message with lots of content that should make it larger than the minimum size filter we will apply in our test case.'
    });

  // Search by minimum size
  const res = await api
    .get('/v1/messages?min_size=100')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  // Should find the longer message
  t.true(res.body.some((msg) => msg.subject === 'Long Message'));
});

test('messages search with has_attachments filter', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create message without attachments
  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'No Attachments',
      text: 'Simple text message'
    });

  // Search for messages with attachments (should be empty)
  const res = await api
    .get('/v1/messages?has_attachments=true')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 0);

  // Search for messages without attachments
  const res2 = await api
    .get('/v1/messages?has_attachments=false')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res2.status, 200);
  t.true(res2.body.length > 0);
});

test('messages search with multiple filters combined', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create multiple messages
  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      from: 'important@company.com',
      subject: 'Important Project Update',
      text: 'This is an important update about the project status'
    });

  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      from: 'other@company.com',
      subject: 'Project Update',
      text: 'Regular update'
    });

  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      from: 'important@company.com',
      subject: 'Other Topic',
      text: 'Different subject matter'
    });

  // Search with multiple filters: from specific sender AND subject contains "project"
  const res = await api
    .get('/v1/messages?from=important&subject=project')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 1);
  t.true(res.body[0].subject.includes('Important Project Update'));
});

test('messages search with q parameter (alias for search)', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create a message
  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'Quarterly Report',
      text: 'Financial data for Q4'
    });

  // Search using 'q' parameter
  const res = await api
    .get('/v1/messages?q=quarterly')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 1);
  t.true(res.body[0].subject.includes('Quarterly'));
});

test('messages search case insensitive', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create a message with mixed case
  await api
    .post('/v1/messages')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      to: [{ address: 'test@example.com' }],
      subject: 'URGENT: Action Required',
      text: 'Please respond ASAP'
    });

  // Search with lowercase should still find the message
  const res = await api
    .get('/v1/messages?subject=urgent')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 1);
  t.true(res.body[0].subject.includes('URGENT'));
});

test('messages search with empty results', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Search for something that doesn't exist
  const res = await api
    .get('/v1/messages?subject=nonexistent')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 0);
  t.is(res.headers['x-item-count'], '0');
  t.is(res.headers['x-page-count'], '1');
});

test('messages search with pagination', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create multiple messages with same search term
  for (let i = 0; i < 15; i++) {
    await api
      .post('/v1/messages')
      .set(
        'Authorization',
        createAliasAuth(`${alias.name}@${domain.name}`, pass)
      )
      .send({
        to: [{ address: 'test@example.com' }],
        subject: `Test Message ${i}`,
        text: 'This message contains the word searchable'
      });
  }

  // Search with pagination
  const res = await api
    .get('/v1/messages?body=searchable&page=1&limit=10')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.length, 10);
  t.truthy(res.headers['x-page-count']);
  t.truthy(res.headers['x-item-count']);

  // Check second page
  const res2 = await api
    .get('/v1/messages?body=searchable&page=2&limit=10')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res2.status, 200);
  t.is(res2.body.length, 5); // Remaining 5 messages
});
