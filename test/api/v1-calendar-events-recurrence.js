/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A stored recurrence that would take hours to expand (FREQ=SECONDLY since
// 1970), or one whose BY* parts never match (rrule then walks to the year
// 9999), must not block the process on a time-range query, and must not be
// hidden either: it is returned as matching.  Ordinary recurrences are still
// expanded and filtered exactly.
//

const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { createRecurrenceBudget } = require('#helpers/recurrence-budget');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

async function createAlias(t) {
  const user = await t.context.userFactory
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
  await user.save();
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
  return `Basic ${Buffer.from(`${alias.name}@${domain.name}:${pass}`).toString(
    'base64'
  )}`;
}

function component(type, uid, lines) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Recurrence//EN',
    `BEGIN:${type}`,
    `UID:${uid}@example.com`,
    `SUMMARY:${uid}`,
    ...lines,
    `END:${type}`,
    'END:VCALENDAR'
  ].join('\r\n');
}

function vevent(uid, lines) {
  return component('VEVENT', uid, lines);
}

function vtodo(uid, lines) {
  return component('VTODO', uid, lines);
}

test('a time-range query does not stall on an absurd recurrence', async (t) => {
  const { api } = t.context;
  const auth = await createAlias(t);

  let res = await api
    .post('/v1/calendars')
    .set('Authorization', auth)
    .send({ name: 'Recurrence' });
  t.is(res.status, 200);
  const calendarId = res.body.id;

  const events = {
    // expands to billions of occurrences before 2026
    secondly: vevent('secondly', [
      'DTSTART:19700101T000000Z',
      'DTEND:19700101T000001Z',
      'RRULE:FREQ=SECONDLY'
    ]),
    // an ordinary weekly event that does occur in the window
    weekly: vevent('weekly', [
      'DTSTART:20250106T090000Z',
      'DTEND:20250106T100000Z',
      'RRULE:FREQ=WEEKLY;BYDAY=MO'
    ]),
    // never occurs: February 30th (rrule walks every day up to 9999)
    never: vevent('never', [
      'DTSTART:19700101T000000Z',
      'DTEND:19700101T000001Z',
      'RRULE:FREQ=DAILY;BYMONTH=2;BYMONTHDAY=30'
    ]),
    // the same, as a task
    'never-task': vtodo('never-task', [
      'DTSTART:19700101T000000Z',
      'DUE:19700101T000001Z',
      'RRULE:FREQ=SECONDLY;BYMONTH=2;BYMONTHDAY=30'
    ]),
    // an ordinary daily event that ended before the window
    ended: vevent('ended', [
      'DTSTART:20200101T090000Z',
      'DTEND:20200101T100000Z',
      'RRULE:FREQ=DAILY;UNTIL=20200201T000000Z'
    ])
  };

  for (const ical of Object.values(events)) {
    res = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({ calendar_id: calendarId, ical });
    t.is(res.status, 200);
  }

  const started = Date.now();
  res = await api
    .get('/v1/calendar-events')
    .query({
      calendar_id: calendarId,
      start_date: '2026-03-01T00:00:00Z',
      end_date: '2026-03-08T00:00:00Z'
    })
    .set('Authorization', auth);
  const elapsed = Date.now() - started;

  t.is(res.status, 200);
  t.true(elapsed < ms('10s'), `took ${elapsed}ms`);
  const summaries = res.body.map((event) => event.summary).sort();
  t.deepEqual(summaries, ['never', 'never-task', 'secondly', 'weekly']);

  // a query with only a start (rrule's after())
  const startedAfter = Date.now();
  res = await api
    .get('/v1/calendar-events')
    .query({ calendar_id: calendarId, start_date: '2026-03-01T00:00:00Z' })
    .set('Authorization', auth);
  const elapsedAfter = Date.now() - startedAfter;
  t.is(res.status, 200);
  t.true(elapsedAfter < ms('10s'), `took ${elapsedAfter}ms`);
  t.deepEqual(res.body.map((event) => event.summary).sort(), [
    'never',
    'never-task',
    'secondly',
    'weekly'
  ]);
});

test('recurrences are matched exactly, within a time budget', (t) => {
  const range = {
    start: new Date('2026-03-01T00:00:00Z'),
    end: new Date('2026-03-08T00:00:00Z')
  };
  const budget = createRecurrenceBudget();

  // exact answers for ordinary rules
  t.true(
    budget.matches(
      'DTSTART:20250106T090000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO',
      range
    )
  );
  t.false(
    budget.matches(
      'DTSTART:20200101T090000Z\nRRULE:FREQ=DAILY;UNTIL=20200201T000000Z',
      range
    )
  );
  t.true(
    budget.matches(
      'DTSTART;TZID=America/New_York:20200101T100000\nRRULE:FREQ=MONTHLY;BYDAY=1TU',
      range
    )
  );
  t.true(
    budget.matches('DTSTART:20200101T090000Z\nRRULE:FREQ=DAILY;COUNT=3', {
      end: range.end
    })
  );
  t.false(
    budget.matches('DTSTART:20200101T090000Z\nRRULE:FREQ=DAILY;COUNT=3', {
      start: range.start
    })
  );

  // a rule that cannot be answered in time is reported as such, quickly
  const started = Date.now();
  t.is(
    budget.matches(
      'DTSTART:19700101T000000Z\nRRULE:FREQ=DAILY;BYMONTH=2;BYMONTHDAY=30',
      range
    ),
    null
  );
  t.true(Date.now() - started < 1000);

  // once the request's time is spent, nothing more is expanded
  const small = createRecurrenceBudget({ maxEventMs: 50, maxRequestMs: 120 });
  const never =
    'DTSTART:19700101T000000Z\nRRULE:FREQ=DAILY;BYMONTH=2;BYMONTHDAY=30';
  t.is(small.matches(never, range), null);
  t.is(small.matches(never, range), null);
  t.is(small.matches(never, range), null);
  t.true(small.spent < 200, `${small.spent}`);
  t.is(
    small.matches(
      'DTSTART:20250106T090000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO',
      range
    ),
    null
  );
});
