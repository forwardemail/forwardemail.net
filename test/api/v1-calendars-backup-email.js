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

test.serial(
  'DELETE /v1/calendars/:id queues a backup email with the calendar attachment',
  async (t) => {
    const { api } = t.context;
    const { alias, pass, username } = await createTestAlias(t);
    const auth = createAliasAuth(username, pass);
    const calendarName = 'Delete Backup Calendar';

    const calendarRes = await api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: calendarName, description: 'Calendar to delete' });

    t.is(calendarRes.status, 200);
    const calendarId = calendarRes.body.id;

    const uid = `calendar-delete-backup-${Date.now()}@example.com`;
    const createEventRes = await api
      .post('/v1/calendar-events')
      .set('Authorization', auth)
      .send({
        calendar_id: calendarId,
        ical: [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Forward Email//Delete Backup Test//EN',
          'BEGIN:VEVENT',
          `UID:${uid}`,
          'DTSTAMP:20260418T170000Z',
          'DTSTART:20260501T100000Z',
          'DTEND:20260501T110000Z',
          'SUMMARY:Delete backup test event',
          `ORGANIZER:mailto:${username}`,
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n')
      });

    t.is(createEventRes.status, 200);

    await Emails.deleteMany({ alias: alias._id });

    const deleteRes = await api
      .delete(`/v1/calendars/${calendarId}`)
      .set('Authorization', auth);

    t.is(deleteRes.status, 200);
    t.is(deleteRes.body.id, calendarId);

    let email;
    await pWaitFor(
      async () => {
        email = await Emails.findOne({
          alias: alias._id,
          status: 'queued',
          subject: { $regex: calendarName }
        })
          .lean()
          .exec();
        return email !== null;
      },
      { timeout: ms('30s') }
    );

    t.truthy(email, 'Calendar delete backup email should be queued');
    t.true(
      email.subject.includes(calendarName),
      'Backup email subject should contain the deleted calendar name'
    );
  }
);
