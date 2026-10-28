/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// SMTP approval requests: a domain whose DKIM, Return-Path and DMARC
// records verify, and that is not approved automatically, is sent to
// support@ for a manual review exactly once, whatever found it ready (the
// "Verify" button, an email sent over SMTP or the API, or the hourly SMTP
// check), with replies to the user. Automatic approvals go to alerts@.
//
// Runs against a real database; only the DNS lookups of `verifySMTP` are
// replaced (by records that verify) and every email is recorded instead
// of sent.
//

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

let failSupportEmails = false;
const sent = [];
const emailPath = require.resolve('#helpers/email');
require.cache[emailPath] = {
  id: emailPath,
  filename: emailPath,
  loaded: true,
  async exports(options) {
    if (failSupportEmails && options.message?.to === config.supportEmail)
      throw new Error('SMTP transport unavailable');
    sent.push(options);
  }
};

const utils = require('../utils');

const config = require('#config');
const checkAndAutoApproveSMTP = require('#helpers/check-and-auto-approve-smtp');
const checkSMTPDomain = require('#helpers/check-smtp-domain');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const verifySMTP = require('#controllers/web/my-account/verify-smtp');
const {
  setDomainCheckPending,
  setDomainCheckVerdict
} = require('#helpers/domain-check-verdict');
const { Domains, Users } = require('#models');

// (records that verify; `hasLegitimateHosting` decides auto-approval)
let hasLegitimateHosting = false;
Domains.verifySMTP = async () => ({
  ns: ['ns1.example.net', 'ns2.example.net'],
  dkim: true,
  returnPath: true,
  dmarc: true,
  strictDmarc: true,
  spf: true,
  autoconfig: false,
  autodiscover: false,
  hasLegitimateHosting,
  errors: []
});

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});

test.beforeEach(utils.setupFactories);
test.beforeEach(() => {
  sent.length = 0;
  hasLegitimateHosting = false;
  failSupportEmails = false;
});

async function createUser(t, state = {}) {
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.hasVerifiedEmail]: true,
      ...state
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
  return user;
}

async function createDomain(t, user) {
  const resolver = createTangerine(t.context.client, logger);
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver
    })
    .create();
  return { domain, resolver };
}

async function getField(id, field) {
  const domain = await Domains.findById(id).lean();
  return domain[field];
}

function supportEmails() {
  return sent.filter((options) => options.message.to === config.supportEmail);
}

function recipients(options) {
  return ['to', 'cc', 'bcc']
    .flatMap((key) => [options.message?.[key]].flat())
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());
}

test.serial(
  'an email sent over SMTP or the API asks support to approve the domain, once',
  async (t) => {
    const user = await createUser(t);
    const { domain, resolver } = await createDomain(t, user);

    // (as `helpers/on-data-smtp` and `Emails.queue` do, for each email sent)
    const send = async () =>
      checkAndAutoApproveSMTP({
        domain: await Domains.findById(domain._id),
        resolver,
        client: t.context.client,
        userId: user.id,
        requestApproval: true
      });

    const results = await Promise.all([send(), send(), send()]);
    t.is(results.filter((r) => r.isApprovalRequested).length, 1);
    t.true(results.every((r) => !r.isAutoApproved));

    // (support is asked once, with the link to review it and replies to the
    //  user, and nothing is Bcc'd or sent to alerts@)
    const [review] = supportEmails();
    t.is(supportEmails().length, 1);
    t.is(review.message.replyTo, user.email);
    t.true(
      review.locals.message.includes(
        `${config.urls.web}/admin/domains?name=${encodeURIComponent(
          domain.name
        )}`
      )
    );
    t.true(review.locals.message.includes('ns2.example.net'));
    t.false(sent.some((options) => options.message.bcc || options.message.cc));
    t.false(
      sent.some((options) =>
        recipients(options).includes(config.alertsEmail.toLowerCase())
      )
    );

    // (the user is told it is pending)
    t.true(
      sent.some((options) =>
        recipients(options).includes(user.email.toLowerCase())
      )
    );

    const saved = await Domains.findById(domain._id).lean();
    t.true(saved.smtp_verified_at instanceof Date);
    t.false(saved.has_smtp);

    // (and not again)
    sent.length = 0;
    await send();
    t.is(sent.length, 0);
  }
);

test.serial(
  'the hourly check asks support to approve a domain nobody verified',
  async (t) => {
    const user = await createUser(t);
    const { domain, resolver } = await createDomain(t, user);

    // (no outbound email, and "Verify" was never clicked)
    await checkSMTPDomain(domain._id, {
      resolver,
      client: t.context.client
    });

    t.is(supportEmails().length, 1);
    t.is(supportEmails()[0].message.replyTo, user.email);
    const saved = await Domains.findById(domain._id).lean();
    t.true(saved.smtp_verified_at instanceof Date);
    t.true(saved.has_dkim_record);

    // (and not again on the next run)
    sent.length = 0;
    await Domains.updateOne(
      { _id: domain._id },
      { $unset: { smtp_last_checked_at: 1 } }
    );
    await checkSMTPDomain(domain._id, {
      resolver,
      client: t.context.client
    });
    t.is(sent.length, 0);
  }
);

test.serial(
  'the "Verify" button asks support with replies to the user who clicked it',
  async (t) => {
    const user = await createUser(t);
    const { domain, resolver } = await createDomain(t, user);
    const flashes = [];
    const ctx = {
      api: false,
      state: {
        l: (path) => path,
        domain: { _id: domain._id, name: domain.name },
        user,
        domains: []
      },
      locale: 'en',
      resolver,
      client: t.context.client,
      ip: '192.0.2.1',
      get: () => '',
      translate: (key) => key,
      translateError: (key) => key,
      request: { t: (key) => key },
      flash: (type, message) => flashes.push({ type, message }),
      accepts: () => false,
      logger: { fatal() {}, error() {} }
    };

    await verifySMTP(ctx);
    t.is(supportEmails().length, 1);
    t.is(supportEmails()[0].message.replyTo, user.email);
    t.true(flashes.some((f) => String(f.message).includes(domain.name)));

    // (clicking again does not ask again)
    sent.length = 0;
    await verifySMTP(ctx);
    t.is(supportEmails().length, 0);
  }
);

test.serial(
  'support is asked once the domain check has a verdict',
  async (t) => {
    const user = await createUser(t);
    const { domain, resolver } = await createDomain(t, user);
    const check = async () =>
      checkAndAutoApproveSMTP({
        domain: await Domains.findById(domain._id),
        resolver,
        client: t.context.client,
        userId: user.id,
        requestApproval: true
      });

    // (no verdict yet: it may still be approved automatically)
    await setDomainCheckPending(t.context.client, domain._id);
    await check();
    t.is(sent.length, 0);
    t.is(await getField(domain._id, 'smtp_verified_at'), undefined);

    // (once it has one, support is told what it was flagged for)
    await setDomainCheckVerdict(t.context.client, domain._id, ['gambling']);
    await check();
    t.is(supportEmails().length, 1);
    t.true(
      supportEmails()[0].locals.message.includes(
        'Flagged by Domain Check</strong> gambling'
      )
    );
  }
);

test.serial(
  'an automatic approval goes to alerts@, not support@',
  async (t) => {
    const user = await createUser(t);
    const { domain, resolver } = await createDomain(t, user);
    hasLegitimateHosting = true;

    const result = await checkAndAutoApproveSMTP({
      domain: await Domains.findById(domain._id),
      resolver,
      client: t.context.client,
      userId: user.id,
      requestApproval: true
    });
    t.true(result.isAutoApproved);
    t.false(result.isApprovalRequested);

    // (its notices are sent without being awaited)
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    t.is(supportEmails().length, 0);
    t.true(sent.some((options) => options.message.to === config.alertsEmail));
    t.true(await getField(domain._id, 'has_smtp'));
  }
);

test.serial(
  'a request support could not be emailed is sent by the next check',
  async (t) => {
    const user = await createUser(t);
    const { domain, resolver } = await createDomain(t, user);
    const check = async () =>
      checkAndAutoApproveSMTP({
        domain: await Domains.findById(domain._id),
        resolver,
        client: t.context.client,
        userId: user.id,
        requestApproval: true
      });

    failSupportEmails = true;
    await t.throwsAsync(check(), { message: 'SMTP transport unavailable' });
    t.is(await getField(domain._id, 'smtp_verified_at'), undefined);

    failSupportEmails = false;
    const result = await check();
    t.true(result.isApprovalRequested);
    t.is(supportEmails().length, 1);
  }
);

test.serial(
  'support is asked even when the admins cannot be emailed',
  async (t) => {
    const user = await createUser(t);
    const { domain, resolver } = await createDomain(t, user);

    // (the admin has not verified their email address)
    await Users.updateOne(
      { _id: user._id },
      { $set: { [config.userFields.hasVerifiedEmail]: false } }
    );

    const result = await checkAndAutoApproveSMTP({
      domain: await Domains.findById(domain._id),
      resolver,
      client: t.context.client,
      userId: user.id,
      requestApproval: true
    });
    t.true(result.isApprovalRequested);
    t.is(supportEmails().length, 1);
    t.is(supportEmails()[0].message.replyTo, user.email);
    t.is(sent.length, 1);
  }
);

test.serial(
  'the hourly check does not approve or ask again for a reviewed domain',
  async (t) => {
    const user = await createUser(t);
    const { domain, resolver } = await createDomain(t, user);

    // (an admin turned its SMTP access off after it was approved)
    await Domains.updateOne(
      { _id: domain._id },
      { $set: { has_smtp: false, smtp_verified_at: new Date() } }
    );
    hasLegitimateHosting = true;

    await checkSMTPDomain(domain._id, {
      resolver,
      client: t.context.client
    });

    t.is(sent.length, 0);
    t.false(await getField(domain._id, 'has_smtp'));
  }
);

test.serial(
  'the hourly check approves a qualifying domain and tells alerts@, also for a user without a KYC field',
  async (t) => {
    const user = await createUser(t);
    const { domain, resolver } = await createDomain(t, user);

    // (an older account without the field)
    await Users.collection.updateOne(
      { _id: user._id },
      { $unset: { has_passed_kyc: 1 } }
    );
    hasLegitimateHosting = true;

    await checkSMTPDomain(domain._id, {
      resolver,
      client: t.context.client
    });

    // (its notices are sent without being awaited)
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    t.true(await getField(domain._id, 'has_smtp'));
    t.true(
      sent.some(
        (options) =>
          options.message.to === config.alertsEmail &&
          options.locals.message.includes('Has passed KYC:</strong> false')
      )
    );
    t.is(supportEmails().length, 0);
  }
);

test.serial(
  'the API "Verify" endpoint asks support with replies to its user',
  async (t) => {
    const user = await createUser(t);
    const { domain, resolver } = await createDomain(t, user);
    const ctx = {
      api: true,
      state: {
        l: (path) => path,
        domain: { _id: domain._id, name: domain.name },
        user,
        domains: []
      },
      locale: 'en',
      resolver,
      client: t.context.client,
      ip: '192.0.2.1',
      get: () => '',
      translate: (key) => key,
      translateError: (key) => key,
      flash() {},
      logger: { fatal() {}, error() {} }
    };

    await verifySMTP(ctx);
    t.is(supportEmails().length, 1);
    t.is(supportEmails()[0].message.replyTo, user.email);
    t.is(typeof ctx.body, 'string');
  }
);
