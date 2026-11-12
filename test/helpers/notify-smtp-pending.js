/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A domain whose SMTP records verify but that is not approved automatically
// waits for a manual review: support is told (again after 5 days, so a
// domain nobody reviewed is not forgotten) and the domain's admins once,
// whether the "Verify" button, a message sent over SMTP or the API, or the
// hourly SMTP check got there first. Against MongoDB, with the mailer
// stubbed to record what is sent.
//

const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const sent = [];
let failures = 0;
const emailFilename = require.resolve('#helpers/email');
require.cache[emailFilename] = {
  id: emailFilename,
  filename: emailFilename,
  loaded: true,
  async exports(options) {
    if (failures > 0) {
      failures--;
      throw new Error('mail transport failed');
    }

    sent.push(options);
  }
};

const utils = require('../utils');

const Domains = require('#models/domains');
const config = require('#config');
const {
  getSMTPAccessError,
  notifySMTPPending
} = require('#helpers/check-and-auto-approve-smtp');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

async function notifiedAt(domain) {
  const { smtp_verified_at: date } = await Domains.findById(domain._id)
    .select('smtp_verified_at')
    .lean();
  return date;
}

async function createDomain(t, state = {}) {
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
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: false,
      ignore_mx_check: true,
      ...state
    })
    .create();
  return { user, domain: await Domains.findById(domain._id) };
}

function notify(domain, flaggedCategories, client, remind) {
  return notifySMTPPending({
    domain,
    remind,
    client: client || new Redis({ keyPrefix: `${randomUUID()}:` }),
    ns: ['ns1.example.net'],
    hasLegitimateHosting: true,
    flaggedCategories,
    hasExistingApprovedDomains: false,
    hasSomeSuspendedDomains: false
  });
}

const toSupport = (options) => options.message.to === config.supportEmail;

test.serial(
  'support is told a domain waits for approval, its admins once, and support again after 5 days',
  async (t) => {
    const { user, domain } = await createDomain(t);

    sent.length = 0;
    t.true(await notify(domain, ['gambling']));
    t.is(sent.length, 2);
    const admins = sent.find((options) => !toSupport(options));
    t.true(admins.message.to.includes(user.email));
    const support = sent.find((options) => toSupport(options));
    t.true(
      support.locals.message.includes(
        'Flagged by Domain Check</strong> gambling'
      )
    );
    t.true(support.locals.message.includes('First Request</strong> true'));
    t.true(
      support.locals.message.includes(
        `/admin/domains?name=${encodeURIComponent(domain.name)}`
      )
    );
    t.true((await notifiedAt(domain)) instanceof Date);
    t.true(domain.smtp_verified_at instanceof Date);

    // (sends at once, or within 5 days, tell no one again)
    sent.length = 0;
    const again = await Promise.all(
      Array.from({ length: 3 }, async () =>
        notify(await Domains.findById(domain._id), ['gambling'])
      )
    );
    t.deepEqual(again, [false, false, false]);
    await Domains.updateOne(
      { _id: domain._id },
      { $set: { smtp_verified_at: dayjs().subtract(4, 'day').toDate() } }
    );
    t.false(await notify(await Domains.findById(domain._id), ['gambling']));
    t.is(sent.length, 0);

    // (after 5 days support is reminded, and the admins are not told again;
    //  the hourly SMTP check only tells once)
    await Domains.updateOne(
      { _id: domain._id },
      { $set: { smtp_verified_at: dayjs().subtract(5, 'day').toDate() } }
    );
    t.false(
      await notify(await Domains.findById(domain._id), [], undefined, false)
    );
    t.is(sent.length, 0);
    t.false(await notify(await Domains.findById(domain._id), []));
    t.is(sent.length, 1);
    t.true(toSupport(sent[0]));
    t.true(sent[0].locals.message.includes('First Request</strong> false'));
    t.true(
      dayjs(await notifiedAt(domain)).isAfter(dayjs().subtract(1, 'minute'))
    );
  }
);

test.serial('a notice that cannot be sent is not taken as told', async (t) => {
  const { domain } = await createDomain(t);

  sent.length = 0;
  failures = 1;
  await t.throwsAsync(notify(domain, []), { message: 'mail transport failed' });
  t.is(await notifiedAt(domain), undefined);
  t.is(domain.smtp_verified_at, undefined);

  // (the next send tells support and the admins)
  sent.length = 0;
  t.true(await notify(await Domains.findById(domain._id), []));
  t.is(sent.length, 2);
});

test.serial(
  'while the domain check has no verdict yet only support is told, once in 10 minutes',
  async (t) => {
    const { domain } = await createDomain(t);
    const client = new Redis({ keyPrefix: `${randomUUID()}:` });

    sent.length = 0;
    t.false(await notify(domain, ['domain_check_pending'], client));
    for (let i = 0; i < 3; i++) {
      t.false(await notify(domain, ['domain_check_pending'], client));
    }

    t.is(sent.length, 1);
    t.true(toSupport(sent[0]));
    t.true(sent[0].locals.message.includes('domain_check_pending'));
    t.true(sent[0].locals.message.includes('First Request</strong> true'));
    t.is(await notifiedAt(domain), undefined);

    // (once it has one, support and the admins are told)
    sent.length = 0;
    t.true(await notify(domain, [], client));
    t.is(sent.length, 2);
  }
);

test.serial('an approved domain is not reported', async (t) => {
  const { domain } = await createDomain(t, { has_smtp: true });
  sent.length = 0;
  t.false(await notify(domain, []));
  t.is(sent.length, 0);
  t.is(await notifiedAt(domain), undefined);
});

test('the error links to the setup until the records verify, then says it waits for approval', (t) => {
  const domain = { name: 'example.com' };
  const setup = getSMTPAccessError(domain, 'en').message;
  t.true(
    setup.includes(
      `${config.urls.web}/en/my-account/domains/example.com/verify-smtp`
    )
  );
  t.true(
    setup.includes('Outbound SMTP configuration has not yet been completed')
  );
  t.is(getSMTPAccessError(domain, 'en', false).message, setup);

  const pending = 'is now pending admin approval';
  t.true(getSMTPAccessError(domain, 'en', true).message.includes(pending));
  // (without a check just run, the records' last result decides)
  const verified = {
    ...domain,
    has_dkim_record: true,
    has_return_path_record: true,
    has_dmarc_record: true
  };
  t.true(getSMTPAccessError(verified, 'en').message.includes(pending));
  t.is(
    getSMTPAccessError({ ...verified, has_dmarc_record: false }, 'en').message,
    setup
  );
  // (a check that just ran outranks them: the records broke since)
  t.is(getSMTPAccessError(verified, 'en', false).message, setup);
});
