/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const test = require('ava');
const falso = require('@ngneat/falso');
const request = require('supertest');

const utils = require('../utils');
const config = require('#config');
const {
  AddressBooks,
  Aliases,
  CalendarEvents,
  Calendars,
  Contacts,
  Domains,
  Emails,
  Logs,
  SieveScripts,
  Users
} = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const password = falso.randPassword();
  let admin = await t.context.userFactory.make();
  admin = await Users.register(admin, password);
  admin.group = 'admin';
  admin[config.userFields.hasVerifiedEmail] = true;
  admin = await admin.save();

  const targetPassword = falso.randPassword();
  let target = await t.context.userFactory.make();
  target = await Users.register(target, targetPassword);
  target[config.userFields.hasVerifiedEmail] = true;
  target = await target.save();

  const domain = await t.context.domainFactory
    .withState({
      name: `transfer-${crypto
        .randomUUID()
        .replaceAll('-', '')
        .slice(0, 12)}.com`,
      plan: 'free',
      members: [{ user: admin._id, group: 'admin' }],
      tokens: [
        {
          user: admin._id,
          description: 'old catch-all password',
          salt: 'salt',
          hash: 'hash'
        }
      ]
    })
    .create();

  await Domains.collection.updateOne(
    { _id: domain._id },
    {
      $set: {
        invites: [{ email: 'pending-member@example.com', group: 'admin' }]
      }
    }
  );

  const alias = await t.context.aliasFactory
    .withState({
      name: 'inbox',
      domain: domain._id,
      user: admin._id,
      has_pgp: true,
      has_smime: true,
      tokens: [
        {
          user: admin._id,
          description: 'old alias password',
          salt: 'salt',
          hash: 'hash'
        }
      ]
    })
    .create();

  await Aliases.collection.updateOne(
    { _id: alias._id },
    {
      $set: {
        public_key: 'old public key',
        smime_certificate: 'old certificate',
        aps: [{ device_token: 'old-device' }]
      }
    }
  );

  await SieveScripts.create({
    alias: alias._id,
    user: admin._id,
    domain: domain._id,
    name: 'retain-filter',
    content: 'require ["fileinto"];\r\nfileinto "Archive";\r\n'
  });

  // Historical delivered messages and logs are domain-linked audit records.
  // They must stay associated with their original actor while the new domain
  // admin retains access through the stable domain ID.
  await Emails.collection.insertMany([
    {
      _id: crypto.randomUUID(),
      id: crypto.randomUUID(),
      domain: domain._id,
      user: admin._id,
      status: 'sent',
      created_at: new Date()
    },
    {
      _id: crypto.randomUUID(),
      id: crypto.randomUUID(),
      domain: domain._id,
      user: admin._id,
      status: 'queued',
      created_at: new Date()
    }
  ]);
  await Logs.collection.insertOne({
    id: crypto.randomUUID(),
    hash: crypto.randomUUID(),
    user: admin._id,
    domains: [domain._id],
    is_empty_domains: false,
    date: new Date()
  });

  await AddressBooks.collection.insertOne({
    address_book_id: crypto.randomUUID(),
    alias: alias._id,
    name: 'Contacts',
    synctoken: crypto.randomUUID(),
    url: '/carddav/contacts'
  });
  await Contacts.collection.insertOne({
    contact_id: crypto.randomUUID(),
    alias: alias._id,
    address_book: 'Contacts',
    vcard: 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Retained Contact\r\nEND:VCARD\r\n'
  });
  await Calendars.collection.insertOne({
    calendar_id: crypto.randomUUID(),
    alias: alias._id,
    name: 'Calendar',
    synctoken: crypto.randomUUID(),
    url: '/caldav/calendar'
  });
  await CalendarEvents.collection.insertOne({
    event_id: crypto.randomUUID(),
    calendar: 'Calendar',
    alias: alias._id,
    ical: 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR\r\n'
  });

  t.context.admin = admin;
  t.context.user = admin;
  t.context.alias = alias;
  t.context.domain = domain;
  t.context.password = password;
  t.context.target = target;
  t.context.targetPassword = targetPassword;
  t.context.webConfig = { turnstileEnabled: false };
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

test.serial(
  'admin domain transfer reassigns current ownership and retains domain data and credentials',
  async (t) => {
    const { admin, alias, domain, target, web } = t.context;

    const page = await web.get('/en/admin/domains').set('Accept', 'text/html');
    t.is(page.status, 200);
    t.true(page.text.includes('modal-transfer-domain'));
    t.true(page.text.includes('input-transfer-original-owner-email'));
    t.true(page.text.includes('input-transfer-confirmation'));

    const rejected = await web
      .post('/en/admin/domains/transfer')
      .set('Accept', 'application/json')
      .send({
        domain: domain.name,
        original_owner_email: admin.email,
        email: target.email,
        confirmation: 'different.example.com'
      });
    t.is(rejected.status, 400);

    const response = await web
      .post('/en/admin/domains/transfer')
      .set('Accept', 'application/json')
      .send({
        domain: domain.name,
        original_owner_email: admin.email,
        email: target.email,
        confirmation: domain.name
      });
    t.is(response.status, 200);
    t.deepEqual(response.body, { reloadPage: true });

    const transferredDomain = await Domains.findById(domain._id)
      .select('+tokens.salt +tokens.hash')
      .lean()
      .exec();
    t.deepEqual(
      transferredDomain.members.map((member) => ({
        user: member.user.toString(),
        group: member.group
      })),
      [{ user: target._id.toString(), group: 'admin' }]
    );
    t.is(transferredDomain.invites.length, 1);
    t.is(transferredDomain.invites[0].email, 'pending-member@example.com');
    t.is(transferredDomain.tokens.length, 1);
    t.is(transferredDomain.tokens[0].description, 'old catch-all password');

    const transferredAlias = await Aliases.findById(alias._id)
      .select(
        '+tokens.salt +tokens.hash +rekey_previous_tokens +rekey_id +rekey_processing'
      )
      .lean()
      .exec();
    t.is(transferredAlias.user.toString(), target._id.toString());
    t.is(transferredAlias.tokens.length, 1);
    t.is(transferredAlias.tokens[0].salt, 'salt');
    t.is(transferredAlias.tokens[0].hash, 'hash');
    t.deepEqual(transferredAlias.rekey_previous_tokens, []);
    t.false(transferredAlias.is_rekey);
    t.false(transferredAlias.rekey_processing);
    t.is(transferredAlias.aps.length, 1);
    t.is(transferredAlias.aps[0].device_token, 'old-device');
    t.true(transferredAlias.has_pgp);
    t.true(transferredAlias.has_smime);
    t.is(transferredAlias.public_key, 'old public key');
    t.is(transferredAlias.smime_certificate, 'old certificate');

    const sieve = await SieveScripts.findOne({ domain: domain._id })
      .lean()
      .exec();
    t.is(sieve.user.toString(), target._id.toString());

    const [sentEmail, queuedEmail, log, addressBook, contact, calendar, event] =
      await Promise.all([
        Emails.collection.findOne({ domain: domain._id, status: 'sent' }),
        Emails.collection.findOne({ domain: domain._id, status: 'queued' }),

        Logs.collection.findOne({ domains: domain._id }),
        AddressBooks.collection.findOne({ alias: alias._id }),
        Contacts.collection.findOne({ alias: alias._id }),
        Calendars.collection.findOne({ alias: alias._id }),
        CalendarEvents.collection.findOne({ alias: alias._id })
      ]);
    t.is(sentEmail.user.toString(), admin._id.toString());
    t.is(queuedEmail.user.toString(), target._id.toString());
    t.is(log.user.toString(), admin._id.toString());

    t.truthy(addressBook);
    t.truthy(contact);
    t.truthy(calendar);
    t.truthy(event);

    const targetWeb = request.agent(t.context._web.server);
    const login = await targetWeb.post('/en/login').send({
      email: target.email,
      password: t.context.targetPassword
    });
    t.is(login.status, 302);
    const targetPage = await targetWeb
      .get(`/en/my-account/domains/${domain.name}`)
      .set('Accept', 'text/html');
    t.is(targetPage.status, 200);

    const oldOwnerPage = await web
      .get(`/en/my-account/domains/${domain.name}`)
      .set('Accept', 'text/html');
    t.is(oldOwnerPage.status, 404);
  }
);

test.serial(
  'admin domain transfer rejects a target without a verified email address',
  async (t) => {
    const { admin, domain, web } = t.context;
    const unverified = await t.context.userFactory.create();
    await Users.collection.updateOne(
      { _id: unverified._id },
      { $set: { [config.userFields.hasVerifiedEmail]: false } }
    );

    const response = await web

      .post('/en/admin/domains/transfer')
      .set('Accept', 'application/json')
      .send({
        domain: domain.name,
        original_owner_email: admin.email,
        email: unverified.email,
        confirmation: domain.name
      });

    t.is(response.status, 400);
    const unchanged = await Domains.findById(domain._id).lean().exec();
    t.is(unchanged.members[0].user.toString(), t.context.admin._id.toString());
  }
);

test.serial(
  'admin domain transfer blocks active alias password rekeying',
  async (t) => {
    const { admin, alias, domain, target, web } = t.context;
    await Aliases.collection.updateOne(
      { _id: alias._id },
      { $set: { is_rekey: true, rekey_processing: true } }
    );

    const response = await web
      .post('/en/admin/domains/transfer')
      .set('Accept', 'application/json')
      .send({
        domain: domain.name,
        original_owner_email: admin.email,
        email: target.email,
        confirmation: domain.name
      });

    t.is(response.status, 409);
    const unchanged = await Domains.findById(domain._id).lean().exec();
    t.is(unchanged.members[0].user.toString(), t.context.admin._id.toString());
  }
);

test.serial(
  'admin domain transfer requires a target plan compatible with a team domain',
  async (t) => {
    const { admin, domain, target, web } = t.context;
    await Domains.collection.updateOne(
      { _id: domain._id },
      { $set: { plan: 'team' } }
    );

    const response = await web
      .post('/en/admin/domains/transfer')
      .set('Accept', 'application/json')
      .send({
        domain: domain.name,
        original_owner_email: admin.email,
        email: target.email,
        confirmation: domain.name
      });

    t.is(response.status, 400);
    const unchanged = await Domains.findById(domain._id).lean().exec();
    t.is(unchanged.members[0].user.toString(), t.context.admin._id.toString());
  }
);

test.serial(
  'admin domain transfer rejects a current owner email that does not own the named domain',
  async (t) => {
    const { domain, target, web } = t.context;
    const stranger = await t.context.userFactory.create();

    const response = await web
      .post('/en/admin/domains/transfer')
      .set('Accept', 'application/json')
      .send({
        domain: domain.name,
        original_owner_email: stranger.email,
        email: target.email,
        confirmation: domain.name
      });

    t.is(response.status, 404);
    const unchanged = await Domains.findById(domain._id).lean().exec();
    t.is(unchanged.members[0].user.toString(), t.context.admin._id.toString());
  }
);

test.serial(
  'admin domain transfer rejects duplicate records for the same current owner',
  async (t) => {
    const { admin, domain, target, web } = t.context;
    const duplicate = await Domains.collection.findOne({ _id: domain._id });
    duplicate._id = crypto.randomUUID();
    duplicate.id = crypto.randomUUID();
    duplicate.verification_record = crypto.randomUUID();
    duplicate.created_at = new Date();
    duplicate.updated_at = new Date();
    await Domains.collection.insertOne(duplicate);

    const response = await web
      .post('/en/admin/domains/transfer')
      .set('Accept', 'application/json')
      .send({
        domain: domain.name,
        original_owner_email: admin.email,
        email: target.email,
        confirmation: domain.name
      });

    t.is(response.status, 409);
    const [original, copied] = await Promise.all([
      Domains.collection.findOne({ _id: domain._id }),
      Domains.collection.findOne({ _id: duplicate._id })
    ]);
    t.is(original.members[0].user.toString(), admin._id.toString());
    t.is(copied.members[0].user.toString(), admin._id.toString());
  }
);

test.serial(
  'admin domain transfer rejects a concurrent transfer lock for the exact record',
  async (t) => {
    const { admin, domain, target, web } = t.context;
    const client = t.context._web.config.redis;
    const lockKey = `domain_transfer:${domain._id}`;
    await client.set(lockKey, 'another-transfer', 'PX', 600_000, 'NX');

    const response = await web
      .post('/en/admin/domains/transfer')
      .set('Accept', 'application/json')
      .send({
        domain: domain.name,
        original_owner_email: admin.email,
        email: target.email,
        confirmation: domain.name
      });

    t.is(response.status, 409);
    const unchanged = await Domains.findById(domain._id).lean().exec();
    t.is(unchanged.members[0].user.toString(), admin._id.toString());
  }
);

test.serial(
  'admin domain transfer requires the target plan to exactly match the domain plan',
  async (t) => {
    const { admin, domain, target, web } = t.context;
    target.plan = 'team';
    target[config.userFields.planExpiresAt] = new Date(Date.now() + 86_400_000);
    await target.save();
    await Domains.collection.updateOne(
      { _id: domain._id },
      { $set: { plan: 'enhanced_protection' } }
    );

    const response = await web
      .post('/en/admin/domains/transfer')
      .set('Accept', 'application/json')
      .send({
        domain: domain.name,
        original_owner_email: admin.email,
        email: target.email,
        confirmation: domain.name
      });

    t.is(response.status, 400);
    const unchanged = await Domains.findById(domain._id).lean().exec();
    t.is(unchanged.members[0].user.toString(), admin._id.toString());
  }
);
