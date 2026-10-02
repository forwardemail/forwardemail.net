/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const util = require('node:util');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('@forwardemail/mx-connect');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const mongoose = require('mongoose');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');
const SMTP = require('../../smtp-server');

const config = require('#config');
const createPassword = require('#helpers/create-password');
const env = require('#config/env');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const recordSmtpReputationReport = require('#helpers/record-smtp-reputation-report');
const reserveAutoReply = require('#helpers/reserve-auto-reply');
const checkSmtpVelocity = require('#helpers/check-smtp-velocity');
const { getSmtpDayKey } = require('#helpers/get-smtp-day');
const {
  normalizeRecipient,
  normalizeRecipientExpression
} = require('#helpers/smtp-reputation-recipients');
const getUserSmtpLimit = require('#helpers/get-user-smtp-limit');
const updateSmtpReputation = require('#helpers/update-smtp-reputation');
const { Aliases, Domains, Emails, Payments, Users } = require('#models');

const { evaluateUser } = updateSmtpReputation;
const { countExternalRecipients, getRecipientsHourKey } = checkSmtpVelocity;
const {
  canSendBounceTo,
  getBounceNotificationLimit,
  isAddressedTo,
  isAddressedToDomain,
  isAuthenticatedSender,
  reserveAutoReplyFor
} = reserveAutoReply;

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();

const TIERS = config.smtpReputationTiers;
const BASE = TIERS[0].limit;

// NOTE: tests are serial since the reputation job evaluates every sender
test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});

test.beforeEach(utils.setupFactories);

//
// only the unusual-pattern checks under test apply (see `useConfig`)
//
const VELOCITY_DEFAULTS = {
  smtpVelocityHourlyShare: config.smtpVelocityHourlyShare,
  smtpVelocityBacklogShare: config.smtpVelocityBacklogShare
};
test.beforeEach(() => {
  config.smtpVelocityHourlyShare = 1;
  config.smtpVelocityBacklogShare = 1;
});
test.beforeEach(utils.setupApiServer);
test.afterEach.always(() => {
  Object.assign(config, VELOCITY_DEFAULTS);
});
test.afterEach.always(utils.teardownApiServer);

//
// yesterday in UTC, as the reputation job evaluates days (well inside the day
// to avoid boundaries, whatever the local time zone)
//
function yesterday() {
  return dayjs.utc().subtract(1, 'day').startOf('day').add(12, 'hour').toDate();
}

//
// create a paid sender with an alias that can authenticate over SMTP
//
//
// (by default the domain has an established sending history, so the domain
// ramp-up does not apply; pass `{ ramp: true }` for a new domain)
//
async function createSender(t, state = {}, domainState = {}, options = {}) {
  const smtp = new SMTP({ client: t.context.client }, false);
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);
  t.teardown(() => smtp.close());

  const user = await t.context.userFactory
    .withState({
      plan: domainState.plan || 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
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

  await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true,
      ...domainState
    })
    .create();

  if (!options.ramp) await setDomainHistory(domain, 1_000_000);

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const pass = await alias.createToken();
  await alias.save();

  // spoof dns records
  const map = new Map();
  const expires = dayjs().add(1, 'day').toDate();
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      expires
    )
  );
  map.set(
    `txt:${domain.dkim_key_selector}._domainkey.${domain.name}`,
    resolver.spoofPacket(
      `${domain.dkim_key_selector}._domainkey.${domain.name}`,
      'TXT',
      [`v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`],
      true,
      expires
    )
  );
  map.set(
    `txt:${env.WEB_HOST}`,
    resolver.spoofPacket(
      env.WEB_HOST,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      expires
    )
  );
  map.set(
    `cname:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'CNAME',
      [env.WEB_HOST],
      true,
      expires
    )
  );
  map.set(
    `txt:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      expires
    )
  );
  map.set(
    `txt:_dmarc.${domain.name}`,
    resolver.spoofPacket(
      `_dmarc.${domain.name}`,
      'TXT',
      [
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ],
      true,
      expires
    )
  );
  await resolver.options.cache.mset(map);

  return { smtp, resolver, user, domain, alias, pass };
}

//
// give a domain a busiest day of `count` delivered messages a few days ago (as the
// reputation job records it)
//
async function setDomainHistory(domain, count) {
  await Domains.collection.updateOne(
    { _id: domain._id },
    {
      $set: {
        smtp_daily_counts: [
          {
            day: dayjs.utc().subtract(3, 'day').startOf('day').toDate(),
            count
          }
        ],
        smtp_daily_counts_at: new Date()
      }
    }
  );
}

//
// temporarily use different reputation tiers for a test
//
function useTiers(t, tiers) {
  const original = config.smtpReputationTiers;
  config.smtpReputationTiers = tiers;
  t.teardown(() => {
    config.smtpReputationTiers = original;
  });
}

//
// temporarily change a config value for a test
//
function useConfig(t, key, value) {
  const original = config[key];
  config[key] = value;
  t.teardown(() => {
    config[key] = original;
  });
}

//
// record a real payment for a user
//
async function recordPayment(
  user,
  { daysAgo, days, refunded = false, plan = 'enhanced_protection' }
) {
  const _id = new mongoose.Types.ObjectId();
  const invoiceAt = dayjs().subtract(daysAgo, 'day').toDate();
  await Payments.collection.insertOne({
    _id,
    id: _id.toString(),
    user: user._id,
    reference: _id.toString(),
    amount: 300,
    amount_refunded: refunded ? 300 : 0,
    currency: 'usd',
    method: 'visa',
    kind: 'subscription',
    plan,
    duration: days * 24 * 60 * 60 * 1000,
    invoice_at: invoiceAt,
    created_at: invoiceAt,
    updated_at: invoiceAt
  });
}

//
// set when a user's plan expires (the site's source of truth for paying)
//
async function setPlanExpiresAt(user, date) {
  await Users.collection.updateOne(
    { _id: user._id },
    { $set: { [config.userFields.planExpiresAt]: date } }
  );
}

//
// make a user a continuously paying customer for `days` days
//
async function setPaidTenure(user, days) {
  await recordPayment(user, { daysAgo: days, days: days + 30 });
}

//
// set a user's recent normal volume (busiest day in the baseline window)
//
async function setBaseline(user, daily, daysAgo = 1) {
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        [config.userFields.smtpBaselineDaily]: daily,
        [config.userFields.smtpBaselineAt]: dayjs()
          .subtract(daysAgo, 'day')
          .startOf('day')
          .toDate()
      }
    }
  );
}

async function setReputation(user, tier, cleanDays = 0) {
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        [config.userFields.smtpReputationTier]: tier,
        [config.userFields.smtpReputationCleanDays]: cleanDays
      }
    }
  );
}

//
// assert a user was reset to the first tier and moving up is paused
//
function assertReset(t, user) {
  t.is(user[config.userFields.smtpReputationTier], 0);
  t.is(user[config.userFields.smtpReputationCleanDays], 0);
  const holdUntil = user[config.userFields.smtpReputationHoldUntil];
  t.true(holdUntil instanceof Date);
  t.true(
    holdUntil.getTime() >
      Date.now() + (config.smtpReputationHoldDays - 3) * 24 * 60 * 60 * 1000
  );
}

async function getUser(user) {
  return Users.findById(user._id).lean().exec();
}

//
// record prior sending history for a sender
//
// By default each message goes to a different recipient at a different
// domain outside the sender's own domains (so every delivered message is a
// qualifying recipient, delivered to a truth source mail server);
// `options` is the status, or `{ status, to, truthSource, isBounce, error, date }`
// where `to` picks the recipient of message `i` instead (and `truthSource`
// is `'false'` for delivery to other mail servers, the way it is stored).
// Bounced and rejected messages are rejected with `error` (by default the
// recipient does not exist), and `date` is when the message was scheduled.
//
let recipientSequence = 0;
async function recordSent(sender, count, createdAt, options = 'sent') {
  const {
    status = 'sent',
    to,
    truthSource = 'truthsource.com',
    isBounce = false,
    error = {
      responseCode: 550,
      response: '550 5.1.1 User unknown',
      bounceInfo: { category: 'recipient', action: 'reject' }
    },
    date = createdAt
  } = typeof options === 'string' ? { status: options } : options;
  if (count === 0) return;
  const docs = [];
  for (let i = 0; i < count; i++) {
    const _id = new mongoose.Types.ObjectId();
    const recipient = to
      ? to(i)
      : `user${++recipientSequence}@recipient${recipientSequence}.example`;
    docs.push({
      _id,
      id: _id.toString(),
      user: sender.user._id,
      domain: sender.domain._id,
      alias: sender.alias._id,
      status,
      is_bounce: isBounce,
      is_locked: false,
      envelope: {
        from: `${sender.alias.name}@${sender.domain.name}`,
        to: [recipient]
      },
      accepted: ['sent', 'partially_sent'].includes(status) ? [recipient] : [],
      deliveries: ['sent', 'partially_sent'].includes(status)
        ? [{ recipient, date: createdAt, responseCode: 250, truthSource }]
        : [],
      rejectedErrors: ['bounced', 'rejected'].includes(status)
        ? [{ ...error, recipient, date: createdAt }]
        : [],
      date,
      created_at: createdAt,
      updated_at: createdAt
    });
  }

  // insert in batches to keep memory reasonable
  for (let i = 0; i < docs.length; i += 5000) {
    await Emails.collection.insertMany(docs.slice(i, i + 5000), {
      ordered: false
    });
  }
}

//
// send a real message over SMTP as the sender's alias
//
async function send(sender, to = ['test@foo.com']) {
  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: sender.smtp.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(sender.resolver.resolve.bind(sender.resolver))
    }
  });

  const transporter = nodemailer.createTransport({
    logger,
    host: mx.host,
    port: mx.port,
    connection: mx.socket,
    secure: false,
    tls: { rejectUnauthorized: false },
    auth: {
      user: `${sender.alias.name}@${sender.domain.name}`,
      pass: sender.pass
    }
  });

  return transporter.sendMail({
    envelope: {
      from: `${sender.alias.name}@${sender.domain.name}`,
      to
    },
    raw: `
To: test@foo.com
From: Test <${sender.alias.name}@${sender.domain.name}>
Subject: testing reputation
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
  });
}

async function assertDeferred(t, sender) {
  const err = await t.throwsAsync(send(sender));
  t.is(err.responseCode, 421);
  t.is(err.response, '421 4.4.2 Rate limit exceeded');
}

async function assertSlowedDown(t, sender) {
  const err = await t.throwsAsync(send(sender));
  t.is(err.responseCode, 421);
  t.regex(err.response, /Unusual sending activity/);
  const user = await Users.findById(sender.user._id).lean().exec();
  t.true(user[config.userFields.smtpThrottledAt] instanceof Date);
}

async function assertAccepted(t, sender) {
  const info = await send(sender);
  t.is(info.accepted.length, 1);
}

test.serial('new senders start on the first reputation tier', async (t) => {
  const sender = await createSender(t);
  const user = await getUser(sender.user);
  t.is(user[config.userFields.smtpReputationTier] ?? 0, 0);
  t.is(user[config.userFields.smtpReputationCleanDays] ?? 0, 0);

  await recordSent(sender, BASE - 1, new Date());
  await assertAccepted(t, sender);
  await assertDeferred(t, sender);
});

test.serial('clean sending history grows the daily threshold', async (t) => {
  const sender = await createSender(t);
  await setPaidTenure(sender.user, TIERS[1].minPaidDays + 1);
  await setReputation(sender.user, 0, TIERS[1].minCleanDays - 1);

  // yesterday used more than half of the threshold with no bounces
  await recordSent(sender, BASE, yesterday());

  // today the sender is at their threshold
  await recordSent(sender, BASE, new Date());
  await assertDeferred(t, sender);

  await updateSmtpReputation(yesterday());

  const user = await getUser(sender.user);
  t.is(user[config.userFields.smtpReputationTier], 1);
  t.is(user[config.userFields.smtpReputationCleanDays], 0);

  // the higher threshold now applies to SMTP
  await assertAccepted(t, sender);

  // and is reported by the API
  const res = await t.context.api
    .get('/v1/emails/limit')
    .auth(sender.user[config.userFields.apiToken]);
  t.is(res.status, 200);
  t.is(res.body.limit, TIERS[1].limit);
  t.is(res.body.count, BASE + 1);

  // the same day is never evaluated twice
  await updateSmtpReputation(yesterday());
  const after = await getUser(sender.user);
  t.is(after[config.userFields.smtpReputationTier], 1);
  t.is(after[config.userFields.smtpReputationCleanDays], 0);
});

test.serial(
  'new customers do not grow until they have paid long enough',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 0, TIERS[1].minCleanDays + 5);
    await recordSent(sender, BASE, yesterday());

    await updateSmtpReputation(yesterday());

    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 0);
    // clean day still counts toward the streak
    t.is(
      user[config.userFields.smtpReputationCleanDays],
      TIERS[1].minCleanDays + 6
    );
  }
);

test.serial('senders who do not use their threshold do not grow', async (t) => {
  const sender = await createSender(t);
  await setPaidTenure(sender.user, 365);
  await setReputation(sender.user, 0, TIERS[1].minCleanDays);
  await recordSent(sender, 5, yesterday());

  await updateSmtpReputation(yesterday());
  const user = await getUser(sender.user);
  t.is(user[config.userFields.smtpReputationTier], 0);
  t.is(
    user[config.userFields.smtpReputationCleanDays],
    TIERS[1].minCleanDays + 1
  );
});

test.serial('high bounce rate steps the threshold down one tier', async (t) => {
  const sender = await createSender(t);
  await setPaidTenure(sender.user, 365);
  await setReputation(sender.user, 2, 2);

  // 10% of yesterday's messages bounced
  await recordSent(sender, 36, yesterday());
  await recordSent(sender, 4, yesterday(), 'bounced');

  // today the sender is at the next lower tier's threshold
  await setBaseline(sender.user, TIERS[1].limit);
  await recordSent(sender, TIERS[1].limit, new Date());
  await assertAccepted(t, sender);

  await updateSmtpReputation(yesterday());

  const user = await getUser(sender.user);
  t.is(user[config.userFields.smtpReputationTier], 1);
  t.is(user[config.userFields.smtpReputationCleanDays], 0);

  await assertDeferred(t, sender);
});

test.serial('small samples do not count against reputation', async (t) => {
  const sender = await createSender(t);
  await setReputation(sender.user, 1, 1);
  await recordSent(
    sender,
    config.smtpReputationMinSample - 5,
    yesterday(),
    'rejected'
  );

  await updateSmtpReputation(yesterday());
  const user = await getUser(sender.user);
  t.is(user[config.userFields.smtpReputationTier], 1);
  // but it is not a clean day either
  t.is(user[config.userFields.smtpReputationCleanDays], 1);
});

test.serial('first tier is the lowest a sender can drop to', async (t) => {
  const sender = await createSender(t);
  await recordSent(sender, 20, yesterday());
  await recordSent(sender, 20, yesterday(), 'bounced');

  await updateSmtpReputation(yesterday());
  const after = await getUser(sender.user);
  t.is(after[config.userFields.smtpReputationTier], 0);
  t.is(after[config.userFields.smtpReputationCleanDays], 0);
});

test.serial('manual limit acts as a floor above the first tier', async (t) => {
  const sender = await createSender(t, {
    [config.userFields.smtpLimit]: BASE * 3
  });

  await recordSent(sender, BASE * 2, new Date());
  await assertAccepted(t, sender);

  // reputation above the manual floor wins
  await setReputation(sender.user, 2);
  await setBaseline(sender.user, BASE * 3);
  await recordSent(sender, BASE * 2, new Date());
  await assertAccepted(t, sender);
});

test.serial(
  'manual limit below the first tier restricts the sender',
  async (t) => {
    const sender = await createSender(t, {
      [config.userFields.smtpLimit]: 10
    });
    await setReputation(sender.user, 3);

    await recordSent(sender, 10, new Date());
    await assertDeferred(t, sender);
  }
);

test.serial('team domains use the highest admin threshold', async (t) => {
  const sender = await createSender(t, {}, { plan: 'team' });

  const admin = await t.context.userFactory
    .withState({ plan: 'team' })
    .create();
  await setReputation(admin, 2);
  await Domains.collection.updateOne(
    { _id: sender.domain._id },
    { $push: { members: { user: admin._id, group: 'admin' } } }
  );

  await setBaseline(sender.user, BASE);
  await recordSent(sender, BASE, new Date());
  await assertAccepted(t, sender);
});

test.serial(
  'soft ceiling alerts admins instead of growing further',
  async (t) => {
    // small tiers so the ceiling can be reached quickly
    useTiers(t, [
      { limit: BASE, minPaidDays: 0, minCleanDays: 0 },
      { limit: BASE * 2, minPaidDays: 1, minCleanDays: 1 },
      { limit: BASE * 3, minPaidDays: 2, minCleanDays: 1 }
    ]);
    const top = 2;

    const sender = await createSender(t);
    await setPaidTenure(sender.user, 30);
    await setReputation(sender.user, top, 0);
    await recordSent(sender, BASE * 2, yesterday());

    await updateSmtpReputation(yesterday());

    let user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], top);
    t.is(user[config.userFields.smtpReputationCleanDays], 1);
    const alertedAt = user[config.userFields.smtpReputationCeilingAlertedAt];
    t.true(alertedAt instanceof Date);

    // admins are not alerted again within the alert interval
    await Users.collection.updateOne(
      { _id: sender.user._id },
      { $unset: { [config.userFields.smtpReputationEvaluatedAt]: 1 } }
    );
    await updateSmtpReputation(yesterday());
    user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], top);
    t.is(
      user[config.userFields.smtpReputationCeilingAlertedAt].getTime(),
      alertedAt.getTime()
    );

    // an admin raising the manual limit lifts the ceiling
    await recordSent(sender, BASE * 3, new Date());
    await assertDeferred(t, sender);
    await Users.collection.updateOne(
      { _id: sender.user._id },
      { $set: { [config.userFields.smtpLimit]: BASE * 10 } }
    );
    await assertAccepted(t, sender);
  }
);

test.serial(
  'suspensions an admin sets by hand do not count against reputation',
  async (t) => {
    const sender = await createSender(t);
    await setPaidTenure(sender.user, 365);
    await setReputation(sender.user, 2, 3);
    await recordSent(sender, 50, yesterday());
    await Aliases.collection.updateOne(
      { _id: sender.alias._id },
      { $set: { smtp_suspended_sent_at: yesterday() } }
    );
    await Domains.collection.updateOne(
      { _id: sender.domain._id },
      { $set: { smtp_suspended_sent_at: yesterday() } }
    );

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 2);
    t.falsy(user[config.userFields.smtpReputationHoldUntil]);
  }
);

test.serial('bounce rate at exactly the threshold is a bad day', async (t) => {
  const sender = await createSender(t);
  await setReputation(sender.user, 1, 1);
  const total = 100;
  const bounced = Math.round(total * config.smtpReputationMaxBadRate);
  await recordSent(sender, total - bounced, yesterday());
  await recordSent(sender, bounced, yesterday(), 'bounced');

  await updateSmtpReputation(yesterday());
  const after = await getUser(sender.user);
  t.is(after[config.userFields.smtpReputationTier], 0);
});

test.serial(
  'messages without a delivery outcome are not counted',
  async (t) => {
    const sender = await createSender(t);
    await setPaidTenure(sender.user, 365);
    await setReputation(sender.user, 0, TIERS[1].minCleanDays - 1);
    await recordSent(sender, BASE, yesterday(), 'queued');
    await recordSent(sender, BASE, yesterday(), 'deferred');

    await updateSmtpReputation(yesterday());
    const after = await getUser(sender.user);
    // not a clean day (and so no promotion) until outcomes are known
    t.is(after[config.userFields.smtpReputationTier], 0);
    t.is(
      after[config.userFields.smtpReputationCleanDays],
      TIERS[1].minCleanDays - 1
    );
  }
);

test.serial('restricted senders do not grow', async (t) => {
  const sender = await createSender(t, {
    [config.userFields.smtpLimit]: 10
  });
  await setPaidTenure(sender.user, 365);
  await setReputation(sender.user, 0, TIERS[1].minCleanDays);
  await recordSent(sender, 10, yesterday());

  await updateSmtpReputation(yesterday());
  const after = await getUser(sender.user);
  t.is(after[config.userFields.smtpReputationTier], 0);
});

test.serial('restricted senders stay restricted on team domains', async (t) => {
  const sender = await createSender(
    t,
    { [config.userFields.smtpLimit]: 10 },
    { plan: 'team' }
  );

  const admin = await t.context.userFactory
    .withState({ plan: 'team' })
    .create();
  await setReputation(admin, 2);
  await Domains.collection.updateOne(
    { _id: sender.domain._id },
    { $push: { members: { user: admin._id, group: 'admin' } } }
  );

  await recordSent(sender, 10, new Date());
  await assertDeferred(t, sender);
});

test.serial(
  'a day is applied once even if evaluated concurrently',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 2, 0);
    await recordSent(sender, 30, yesterday());

    // two evaluations from the same snapshot (e.g. overlapping job runs)
    const snapshot = await getUser(sender.user);
    const [a, b] = await Promise.all([
      evaluateUser(snapshot, yesterday()),
      evaluateUser(snapshot, yesterday())
    ]);
    t.is([a, b].filter((r) => r.skipped).length, 1);

    const after = await getUser(sender.user);
    t.is(after[config.userFields.smtpReputationCleanDays], 1);
  }
);

test.serial('admin tier changes are not overwritten by the job', async (t) => {
  const sender = await createSender(t);
  await setReputation(sender.user, 3, 4);
  await recordSent(sender, 20, yesterday());
  await recordSent(sender, 20, yesterday(), 'bounced');

  // job reads the user, then an admin moves them before the job writes
  const snapshot = await getUser(sender.user);
  await setReputation(sender.user, 5, 0);
  const result = await evaluateUser(snapshot, yesterday());
  t.true(result.skipped);

  const after = await getUser(sender.user);
  t.is(after[config.userFields.smtpReputationTier], 5);
});

test.serial(
  'long-standing accounts that are not paying do not grow',
  async (t) => {
    const sender = await createSender(t);
    // account created years ago, but only free or refunded payments
    await Users.collection.updateOne(
      { _id: sender.user._id },
      { $set: { created_at: dayjs().subtract(5, 'year').toDate() } }
    );
    await recordPayment(sender.user, {
      daysAgo: 60,
      days: 365,
      refunded: true
    });
    await setReputation(sender.user, 0, TIERS[1].minCleanDays);
    await recordSent(sender, BASE, yesterday());

    await updateSmtpReputation(yesterday());
    const after = await getUser(sender.user);
    t.is(after[config.userFields.smtpReputationTier], 0);
    t.is(after[config.userFields.smtpReputationPaidSince], null);
  }
);

test.serial('a gap in payments restarts paid tenure', async (t) => {
  const tier = 3;
  const needed = Math.ceil(
    TIERS[tier].limit * config.smtpReputationMinUtilization
  );

  // paid long ago, lapsed, then started paying again recently
  const lapsed = await createSender(t);
  await recordPayment(lapsed.user, { daysAgo: 400, days: 180 });
  await recordPayment(lapsed.user, { daysAgo: 20, days: 30 });
  await setReputation(lapsed.user, tier, TIERS[tier + 1].minCleanDays);
  await recordSent(lapsed, needed, yesterday());

  // continuously paying the whole time (renewal stacked on the prior year)
  const loyal = await createSender(t);
  await recordPayment(loyal.user, { daysAgo: 400, days: 365 });
  await recordPayment(loyal.user, { daysAgo: 40, days: 365 });
  await setReputation(loyal.user, tier, TIERS[tier + 1].minCleanDays);
  await recordSent(loyal, needed, yesterday());

  await updateSmtpReputation(yesterday());

  const lapsedUser = await getUser(lapsed.user);
  t.is(lapsedUser[config.userFields.smtpReputationTier], tier);
  t.is(
    dayjs().diff(lapsedUser[config.userFields.smtpReputationPaidSince], 'day'),
    20
  );

  const loyalUser = await getUser(loyal.user);
  t.is(loyalUser[config.userFields.smtpReputationTier], tier + 1);
  t.is(
    dayjs().diff(loyalUser[config.userFields.smtpReputationPaidSince], 'day'),
    400
  );
});

test.serial("the job records each sender's recent normal volume", async (t) => {
  const sender = await createSender(t);
  await recordSent(sender, 40, dayjs().subtract(10, 'day').toDate());
  await recordSent(sender, 20, yesterday());

  await updateSmtpReputation(yesterday());
  const after = await getUser(sender.user);
  t.is(after[config.userFields.smtpBaselineDaily], 40);
  // the day of the busiest day, so it stops counting once it is too old
  t.is(
    after[config.userFields.smtpBaselineAt].getTime(),
    dayjs.utc().subtract(10, 'day').startOf('day').toDate().getTime()
  );
  // all of that day's messages were sent within the same hour
  t.is(after[config.userFields.smtpBaselineHourly], 40);
});

test.serial(
  'sudden spikes are slowed down regardless of threshold',
  async (t) => {
    // high threshold, but only a little recent sending
    const sender = await createSender(t);
    await setReputation(sender.user, 5);
    await setBaseline(sender.user, 20);

    const cap = Math.max(BASE, 20 * config.smtpVelocitySpikeMultiplier);
    await recordSent(sender, cap - 1, new Date());
    await assertAccepted(t, sender);
    await assertSlowedDown(t, sender);
  }
);

test.serial('dormant senders are slowed down when they return', async (t) => {
  // sent a lot, but not in the baseline window
  const dormant = await createSender(t);
  await setReputation(dormant.user, 5);
  await setBaseline(dormant.user, 20_000, config.smtpVelocityBaselineDays + 30);
  await recordSent(dormant, BASE, new Date());
  await assertSlowedDown(t, dormant);

  // the same history within the window is normal
  const active = await createSender(t);
  await setReputation(active.user, 5);
  await setBaseline(active.user, 20_000);
  await recordSent(active, BASE, new Date());
  await assertAccepted(t, active);
});

test.serial('bursts within an hour are slowed down', async (t) => {
  useConfig(
    t,
    'smtpVelocityHourlyShare',
    VELOCITY_DEFAULTS.smtpVelocityHourlyShare
  );
  const sender = await createSender(t);
  await setReputation(sender.user, 2);
  await setBaseline(sender.user, TIERS[2].limit);

  const hourly = Math.max(
    BASE,
    Math.ceil(TIERS[2].limit * config.smtpVelocityHourlyShare)
  );
  await recordSent(sender, hourly - 1, new Date());
  await assertAccepted(t, sender);
  await assertSlowedDown(t, sender);
});

test.serial('a large queue backlog is slowed down', async (t) => {
  useConfig(
    t,
    'smtpVelocityBacklogShare',
    VELOCITY_DEFAULTS.smtpVelocityBacklogShare
  );
  const sender = await createSender(t);
  await setReputation(sender.user, 2);
  await setBaseline(sender.user, TIERS[2].limit);

  const backlog = Math.max(
    BASE,
    Math.ceil(TIERS[2].limit * config.smtpVelocityBacklogShare)
  );
  // messages still queued for delivery
  await recordSent(sender, backlog, new Date(), 'queued');
  const err = await t.throwsAsync(send(sender));
  t.is(err.responseCode, 421);
  t.regex(err.response, /Unusual sending activity/);

  // (a backlog can be our queue's doing, so it does not count against them)
  const user = await getUser(sender.user);
  t.falsy(user[config.userFields.smtpThrottledAt]);
});

test.serial('a slowed-down day is not a clean day', async (t) => {
  const sender = await createSender(t);
  await setPaidTenure(sender.user, 365);
  await setReputation(sender.user, 0, TIERS[1].minCleanDays - 1);
  await Users.collection.updateOne(
    { _id: sender.user._id },
    { $set: { [config.userFields.smtpThrottledAt]: yesterday() } }
  );
  await recordSent(sender, BASE, yesterday());

  await updateSmtpReputation(yesterday());
  const after = await getUser(sender.user);
  t.is(after[config.userFields.smtpReputationTier], 0);
  t.is(
    after[config.userFields.smtpReputationCleanDays],
    TIERS[1].minCleanDays - 1
  );
});

test.serial(
  "team admins do not borrow the paying admin's tenure",
  async (t) => {
    const tier = 3;
    const needed = Math.ceil(
      TIERS[tier].limit * config.smtpReputationMinUtilization
    );

    // the sending admin has never paid, the other admin has for 400 days
    const sender = await createSender(t, {}, { plan: 'team' });
    const payer = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    await recordPayment(payer, { daysAgo: 400, days: 365, plan: 'team' });
    await recordPayment(payer, { daysAgo: 40, days: 365, plan: 'team' });
    await setPlanExpiresAt(payer, dayjs().add(325, 'day').toDate());
    await Domains.collection.updateOne(
      { _id: sender.domain._id },
      { $push: { members: { user: payer._id, group: 'admin' } } }
    );

    await setReputation(sender.user, tier, TIERS[tier + 1].minCleanDays);
    await recordSent(sender, needed, yesterday());

    // (the paying admin sends the same)
    await setReputation(payer, tier, TIERS[tier + 1].minCleanDays);
    await recordSent({ ...sender, user: payer }, needed, yesterday());

    await updateSmtpReputation(yesterday());
    const after = await getUser(sender.user);
    // (their own reputation only grows with their own payments)
    t.is(after[config.userFields.smtpReputationTier], tier);

    // the paying admin grows with theirs
    const grown = await getUser(payer);
    t.is(grown[config.userFields.smtpReputationTier], tier + 1);
  }
);

test.serial('refunded payments do not count as paid time', async (t) => {
  const sender = await createSender(t);
  // partially refunded, not a courtesy credit
  await Payments.collection.insertOne({
    _id: new mongoose.Types.ObjectId(),
    user: sender.user._id,
    amount: 300,
    amount_refunded: 100,
    method: 'visa',
    kind: 'subscription',
    plan: 'enhanced_protection',
    duration: 365 * 24 * 60 * 60 * 1000,
    invoice_at: dayjs().subtract(100, 'day').toDate()
  });
  await setReputation(sender.user, 0, TIERS[1].minCleanDays);
  await recordSent(sender, BASE, yesterday());

  await updateSmtpReputation(yesterday());
  const after = await getUser(sender.user);
  t.is(after[config.userFields.smtpReputationTier], 0);
  t.is(after[config.userFields.smtpReputationPaidSince], null);
});

test.serial('regular hourly blasts are not slowed down', async (t) => {
  useConfig(
    t,
    'smtpVelocityHourlyShare',
    VELOCITY_DEFAULTS.smtpVelocityHourlyShare
  );
  const sender = await createSender(t);
  await setReputation(sender.user, 2);
  await setBaseline(sender.user, TIERS[2].limit);
  // usually sends most of its daily volume within one hour
  await Users.collection.updateOne(
    { _id: sender.user._id },
    { $set: { [config.userFields.smtpBaselineHourly]: TIERS[2].limit } }
  );

  // (up to half of the day's allowance in an hour)
  await recordSent(
    sender,
    Math.ceil(TIERS[2].limit * config.smtpVelocityMaxHourlyShare) - 1,
    new Date()
  );
  await assertAccepted(t, sender);
});

test.serial(
  'scheduled, old and bounce messages are not a backlog',
  async (t) => {
    useConfig(
      t,
      'smtpVelocityBacklogShare',
      VELOCITY_DEFAULTS.smtpVelocityBacklogShare
    );
    const sender = await createSender(t);
    await setReputation(sender.user, 2);
    await setBaseline(sender.user, TIERS[2].limit);
    const backlog = Math.max(
      BASE,
      Math.ceil(TIERS[2].limit * config.smtpVelocityBacklogShare)
    );

    // older than a day, scheduled for later, and bounce notifications
    await recordSent(
      sender,
      backlog,
      dayjs().subtract(2, 'day').toDate(),
      'deferred'
    );
    await recordSent(sender, backlog, new Date(), 'queued');
    await Emails.collection.updateMany(
      { user: sender.user._id, status: 'queued' },
      { $set: { date: dayjs().add(1, 'day').toDate() } }
    );
    await recordSent(sender, backlog, new Date(), 'deferred');
    await Emails.collection.updateMany(
      {
        user: sender.user._id,
        status: 'deferred',
        created_at: { $gte: dayjs().startOf('day').toDate() }
      },
      { $set: { is_bounce: true } }
    );
    await setBaseline(sender.user, TIERS[2].limit);

    await assertAccepted(t, sender);
  }
);

test.serial('API sending is slowed down too', async (t) => {
  const sender = await createSender(t);
  await setReputation(sender.user, 5);
  await setBaseline(sender.user, 20);
  const cap = Math.max(BASE, 20 * config.smtpVelocitySpikeMultiplier);

  const post = () =>
    t.context.api
      .post('/v1/emails')
      .auth(sender.user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send({
        raw: `
To: test@foo.com
From: Test <${sender.alias.name}@${sender.domain.name}>
Subject: testing reputation
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
      });

  await recordSent(sender, cap - 1, new Date());
  const ok = await post();
  t.is(ok.status, 200);

  const res = await post();
  t.is(res.status, 429);
  t.regex(res.body.message, /Unusual sending activity/);
});

test.serial(
  'an admin-approved minimum places the sender on its tier',
  async (t) => {
    // approved for the second tier's volume, never promoted
    const sender = await createSender(t, {
      [config.userFields.smtpLimit]: TIERS[1].limit
    });
    await setPaidTenure(sender.user, 365);
    await setReputation(sender.user, 0, TIERS[2].minCleanDays - 1);
    await recordSent(
      sender,
      Math.ceil(TIERS[1].limit * config.smtpReputationMinUtilization),
      yesterday()
    );

    await updateSmtpReputation(yesterday());
    const after = await getUser(sender.user);
    // moved past the approved tier, to the one above it
    t.is(after[config.userFields.smtpReputationTier], 2);

    // a bad day does not take the sender below the approved minimum
    await setReputation(sender.user, 0, 0);
    await setBaseline(sender.user, TIERS[1].limit);
    await recordSent(sender, TIERS[1].limit - 1, new Date());
    await assertAccepted(t, sender);
    await assertDeferred(t, sender);
  }
);

test.serial('existing sending history is backfilled', async (t) => {
  useTiers(t, [
    { limit: BASE, minPaidDays: 0, minCleanDays: 0, minRecipientDomains: 0 },
    { limit: 500, minPaidDays: 3, minCleanDays: 2, minRecipientDomains: 10 },
    { limit: 1000, minPaidDays: 7, minCleanDays: 3, minRecipientDomains: 20 },
    { limit: 2000, minPaidDays: 14, minCleanDays: 5, minRecipientDomains: 40 }
  ]);
  const sender = await createSender(t);
  await setPaidTenure(sender.user, 365);

  // six clean days of sending before the job ever ran
  for (let daysAgo = 6; daysAgo >= 1; daysAgo--) {
    await recordSent(
      sender,
      Math.ceil(TIERS[1].limit * config.smtpReputationMinUtilization) + 10,
      dayjs().subtract(daysAgo, 'day').startOf('day').add(12, 'hour').toDate()
    );
  }

  await updateSmtpReputation(yesterday());
  const after = await getUser(sender.user);
  // 2 clean days to reach the second tier, then 3 more to reach the third
  t.is(after[config.userFields.smtpReputationTier], 2);
  t.is(after[config.userFields.smtpReputationCleanDays], 1);
  t.is(
    after[config.userFields.smtpReputationEvaluatedAt].getTime(),
    dayjs.utc(yesterday()).startOf('day').toDate().getTime()
  );
});

test.serial('missed days are caught up', async (t) => {
  useTiers(t, [
    { limit: BASE, minPaidDays: 0, minCleanDays: 0, minRecipientDomains: 0 },
    { limit: 500, minPaidDays: 3, minCleanDays: 2, minRecipientDomains: 10 }
  ]);
  const sender = await createSender(t);
  await setPaidTenure(sender.user, 365);
  // last evaluated four days ago (e.g. the job did not run since)
  await Users.collection.updateOne(
    { _id: sender.user._id },
    {
      $set: {
        [config.userFields.smtpReputationEvaluatedAt]: dayjs()
          .subtract(4, 'day')
          .startOf('day')
          .toDate()
      }
    }
  );
  for (let daysAgo = 3; daysAgo >= 1; daysAgo--) {
    await recordSent(
      sender,
      BASE,
      dayjs().subtract(daysAgo, 'day').startOf('day').add(12, 'hour').toDate()
    );
  }

  await updateSmtpReputation(yesterday());
  const after = await getUser(sender.user);
  t.is(after[config.userFields.smtpReputationTier], 1);
  t.is(after[config.userFields.smtpReputationCleanDays], 1);
});

test.serial(
  'paying users who do not send get their paid time updated',
  async (t) => {
    const user = await t.context.userFactory
      .withState({ plan: 'enhanced_protection' })
      .create();
    await recordPayment(user, { daysAgo: 100, days: 365 });
    await setPlanExpiresAt(user, dayjs().add(265, 'day').toDate());

    await updateSmtpReputation(yesterday());
    const after = await getUser(user);
    t.is(
      dayjs().diff(after[config.userFields.smtpReputationPaidSince], 'day'),
      100
    );
    t.is(
      after[config.userFields.smtpReputationEvaluatedAt].getTime(),
      dayjs.utc(yesterday()).startOf('day').toDate().getTime()
    );
    t.is(after[config.userFields.smtpReputationTier], 0);
  }
);

test.serial('expired plans do not count as paying', async (t) => {
  const user = await t.context.userFactory
    .withState({ plan: 'enhanced_protection' })
    .create();
  await recordPayment(user, { daysAgo: 100, days: 365 });
  // the plan itself expired (e.g. the payment was charged back elsewhere)
  await setPlanExpiresAt(user, dayjs().subtract(60, 'day').toDate());

  await updateSmtpReputation(yesterday());
  const after = await getUser(user);
  t.is(after[config.userFields.smtpReputationPaidSince], null);
});

test.serial('changing plans does not restart paid time', async (t) => {
  const user = await t.context.userFactory.withState({ plan: 'team' }).create();
  await recordPayment(user, { daysAgo: 200, days: 180 });
  await recordPayment(user, { daysAgo: 25, days: 365, plan: 'team' });
  await setPlanExpiresAt(user, dayjs().add(340, 'day').toDate());

  await updateSmtpReputation(yesterday());
  const after = await getUser(user);
  t.is(
    dayjs().diff(after[config.userFields.smtpReputationPaidSince], 'day'),
    200
  );
});

test.serial(
  'removing an approved minimum returns the sender to their earned tier',
  async (t) => {
    const sender = await createSender(t, {
      [config.userFields.smtpLimit]: TIERS[4].limit
    });
    await setPaidTenure(sender.user, 365);
    await setReputation(sender.user, 1, 0);
    await recordSent(sender, 50, yesterday());

    await updateSmtpReputation(yesterday());
    let after = await getUser(sender.user);
    // only the earned tier is stored
    t.is(after[config.userFields.smtpReputationTier], 1);

    // the approved minimum is removed
    await Users.collection.updateOne(
      { _id: sender.user._id },
      { $set: { [config.userFields.smtpLimit]: BASE } }
    );
    after = await getUser(sender.user);
    await setBaseline(sender.user, TIERS[1].limit);
    await recordSent(sender, TIERS[1].limit - 1, new Date());
    await assertAccepted(t, sender);
    await assertDeferred(t, sender);
  }
);

test.serial(
  "team members share an admin's approved minimum for slowdowns",
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const admin = await t.context.userFactory
      .withState({
        plan: 'team',
        [config.userFields.smtpLimit]: TIERS[2].limit
      })
      .create();
    await Domains.collection.updateOne(
      { _id: sender.domain._id },
      { $push: { members: { user: admin._id, group: 'admin' } } }
    );
    // measured, but has not sent much before
    await setBaseline(sender.user, 10);

    await recordSent(sender, BASE * 2, new Date());
    await assertAccepted(t, sender);
  }
);

test.serial(
  'senders not measured yet are held to the first tier for spikes',
  async (t) => {
    // (e.g. a new member of a Team plan domain with a high admin threshold)
    const sender = await createSender(t);
    await setReputation(sender.user, 3);
    await recordSent(sender, BASE - 1, new Date());
    await assertAccepted(t, sender);
    await assertSlowedDown(t, sender);
  }
);

test.serial(
  'recipient deferrals and pending approval are not a backlog',
  async (t) => {
    useConfig(
      t,
      'smtpVelocityBacklogShare',
      VELOCITY_DEFAULTS.smtpVelocityBacklogShare
    );
    const sender = await createSender(t);
    await setReputation(sender.user, 2);
    await setBaseline(sender.user, TIERS[2].limit);
    const backlog = Math.max(
      BASE,
      Math.ceil(TIERS[2].limit * config.smtpVelocityBacklogShare)
    );
    await recordSent(sender, backlog, new Date(), 'deferred');
    await recordSent(sender, backlog, new Date(), 'pending');
    await assertAccepted(t, sender);
  }
);

test.serial(
  'baselines outlive the messages they were measured from',
  async (t) => {
    const sender = await createSender(t);
    // measured 35 days ago (older messages are no longer kept)
    await Users.collection.updateOne(
      { _id: sender.user._id },
      {
        $set: {
          [config.userFields.smtpBaselineDaily]: 5000,
          [config.userFields.smtpBaselineHourly]: 5000,
          [config.userFields.smtpBaselineAt]: dayjs
            .utc()
            .subtract(35, 'day')
            .startOf('day')
            .toDate(),
          [config.userFields.smtpReputationEvaluatedAt]: dayjs
            .utc()
            .subtract(3, 'day')
            .startOf('day')
            .toDate()
        }
      }
    );
    await recordSent(
      sender,
      10,
      dayjs(yesterday()).subtract(1, 'day').toDate()
    );

    await updateSmtpReputation(yesterday());
    const after = await getUser(sender.user);
    t.is(after[config.userFields.smtpBaselineDaily], 5000);
    t.is(after[config.userFields.smtpBaselineHourly], 5000);
    t.is(
      after[config.userFields.smtpBaselineAt].getTime(),
      dayjs.utc().subtract(35, 'day').startOf('day').toDate().getTime()
    );
  }
);

test.serial('the job waits for delivery outcomes by default', async (t) => {
  const sender = await createSender(t);
  await recordSent(sender, 10, yesterday());

  await updateSmtpReputation();
  const after = await getUser(sender.user);
  t.is(
    after[config.userFields.smtpReputationEvaluatedAt].getTime(),
    dayjs
      .utc()
      .subtract(config.smtpReputationEvaluationDelayDays, 'day')
      .startOf('day')
      .toDate()
      .getTime()
  );
});

test.serial('days with a slowdown are remembered', async (t) => {
  const sender = await createSender(t);
  await setReputation(sender.user, 5);
  await setBaseline(sender.user, 20);
  const cap = Math.max(BASE, 20 * config.smtpVelocitySpikeMultiplier);
  await recordSent(sender, cap, new Date());
  await assertSlowedDown(t, sender);

  const after = await getUser(sender.user);
  t.is(after[config.userFields.smtpThrottledDays].length, 1);
  t.is(
    after[config.userFields.smtpThrottledDays][0].getTime(),
    dayjs.utc().startOf('day').toDate().getTime()
  );
});

test.serial(
  'editing an alias keeps a limit set before the domain threshold dropped',
  async (t) => {
    const sender = await createSender(t);
    await Aliases.collection.updateOne(
      { _id: sender.alias._id },
      { $set: { smtp_limit: TIERS[1].limit } }
    );

    const res = await t.context.api
      .put(`/v1/domains/${sender.domain.name}/aliases/${sender.alias.id}`)
      .auth(sender.user[config.userFields.apiToken])
      .send({ smtp_limit: TIERS[1].limit, description: 'updated' });
    t.is(res.status, 200);

    // raising it above the current threshold is still rejected
    const res2 = await t.context.api
      .put(`/v1/domains/${sender.domain.name}/aliases/${sender.alias.id}`)
      .auth(sender.user[config.userFields.apiToken])
      .send({ smtp_limit: TIERS[1].limit + 1 });
    t.is(res2.status, 400);
  }
);

//
// record a spam or virus verdict from a truth source against a sender
//
async function recordReport(user, recipient, date) {
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $push: {
        [config.userFields.smtpReputationReports]: {
          date,
          email: new mongoose.Types.ObjectId(),
          recipient,
          truth_source: 'google.com',
          category: 'spam'
        }
      }
    }
  );
}

//
// a sender that meets every requirement to move up from the first tier
// except the sending itself
//
async function createGrowingSender(t) {
  const sender = await createSender(t);
  await setPaidTenure(sender.user, TIERS[1].minPaidDays + 1);
  await setReputation(sender.user, 0, TIERS[1].minCleanDays - 1);
  return sender;
}

test.serial('mail to your own domains does not build reputation', async (t) => {
  const sender = await createGrowingSender(t);

  // plenty of mail yesterday, but only to the sender's own domain and address
  await recordSent(sender, BASE, yesterday(), {
    to: (i) => `test${i}@${sender.domain.name}`
  });
  await recordSent(sender, BASE, yesterday(), {
    to: () => sender.user.email
  });

  await updateSmtpReputation(yesterday());
  const user = await getUser(sender.user);
  t.is(user[config.userFields.smtpReputationTier], 0);
  // not a clean day either (no real recipients)
  t.is(
    user[config.userFields.smtpReputationCleanDays],
    TIERS[1].minCleanDays - 1
  );
  t.is(user[config.userFields.smtpReputationPeak], 0);

  // the same volume to real recipients moves the sender up
  const other = await createGrowingSender(t);
  await recordSent(other, BASE, yesterday());
  await updateSmtpReputation(yesterday());
  const grown = await getUser(other.user);
  t.is(grown[config.userFields.smtpReputationTier], 1);
  t.is(grown[config.userFields.smtpReputationPeak], BASE);
  t.is(grown[config.userFields.smtpReputationPeakDomains], BASE);
});

test.serial(
  'a catch-all on one domain does not build reputation',
  async (t) => {
    // unique recipients, but all at a single domain
    const sender = await createGrowingSender(t);
    await recordSent(sender, BASE * 2, yesterday(), {
      to: (i) => `user${i}@catch-all.example`
    });
    await updateSmtpReputation(yesterday());
    let user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 0);
    t.is(user[config.userFields.smtpReputationPeakDomains], 1);

    // each recipient domain only counts up to a cap per day
    // (even without a minimum number of recipient domains)
    useTiers(
      t,
      TIERS.map((tier) => ({ ...tier, minRecipientDomains: 0 }))
    );
    useConfig(t, 'smtpReputationMaxRecipientsPerDomain', 10);
    const capped = await createGrowingSender(t);
    await recordSent(capped, BASE * 2, yesterday(), {
      to: (i) => `user${i}@catch-all.example`
    });
    await updateSmtpReputation(yesterday());
    user = await getUser(capped.user);
    t.is(user[config.userFields.smtpReputationTier], 0);
    t.is(user[config.userFields.smtpReputationPeak], 10);

    // the same volume across enough recipient domains moves the sender up
    const spread = await createGrowingSender(t);
    await recordSent(spread, BASE, yesterday(), {
      to: (i) => `user${i}@domain${i % TIERS[1].minRecipientDomains}.example`
    });
    await updateSmtpReputation(yesterday());
    user = await getUser(spread.user);
    t.is(user[config.userFields.smtpReputationTier], 1);
  }
);

test.serial(
  'mail to your own domains does not dilute a bounce rate',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 2, 2);

    // 10% of external messages bounced, hidden among mail to yourself
    await recordSent(sender, config.smtpReputationMinSample - 2, yesterday());
    await recordSent(sender, 2, yesterday(), 'bounced');
    await recordSent(sender, config.smtpReputationMinSample * 20, yesterday(), {
      to: (i) => `test${i}@${sender.domain.name}`
    });

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 1);
    t.is(user[config.userFields.smtpReputationCleanDays], 0);
  }
);

test.serial(
  'spam or virus reports from a truth source make a bad day, not just one',
  async (t) => {
    // (a single report is not)
    const one = await createSender(t);
    await setPaidTenure(one.user, 365);
    await setReputation(one.user, 2, 2);
    await recordSent(one, 50, yesterday());
    await recordReport(one.user, 'someone@gmail.com', yesterday());
    await updateSmtpReputation(yesterday());
    const unchanged = await getUser(one.user);
    t.is(unchanged[config.userFields.smtpReputationTier], 2);
    t.is(unchanged[config.userFields.smtpReputationCleanDays], 3);

    const sender = await createSender(t);
    await setPaidTenure(sender.user, 365);
    await setReputation(sender.user, 2, 2);
    await recordSent(sender, 50, yesterday());
    for (let i = 0; i < config.smtpReputationBadDayReports; i++)
      await recordReport(sender.user, `someone${i}@gmail.com`, yesterday());

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 1);
    t.is(user[config.userFields.smtpReputationCleanDays], 0);
    t.falsy(user[config.userFields.smtpReputationHoldUntil]);
  }
);

test.serial(
  'repeated spam or virus reports reset the threshold and pause moving up',
  async (t) => {
    const sender = await createSender(t);
    await setPaidTenure(sender.user, 365);
    await setReputation(sender.user, 3, 2);
    await recordSent(sender, 50, yesterday());
    for (let i = 0; i < config.smtpReputationTruthSourceStrikes; i++) {
      await recordReport(sender.user, `someone${i}@gmail.com`, yesterday());
    }

    await updateSmtpReputation(yesterday());
    assertReset(t, await getUser(sender.user));

    // while paused, a sender who meets every requirement does not move up
    const held = await createGrowingSender(t);
    await Users.collection.updateOne(
      { _id: held.user._id },
      {
        $set: {
          [config.userFields.smtpReputationHoldUntil]: dayjs()
            .add(1, 'day')
            .toDate()
        }
      }
    );
    await recordSent(held, BASE, yesterday());
    await updateSmtpReputation(yesterday());
    let user = await getUser(held.user);
    t.is(user[config.userFields.smtpReputationTier], 0);
    t.is(
      user[config.userFields.smtpReputationCleanDays],
      TIERS[1].minCleanDays
    );

    // once the pause is over it moves up again
    await Users.collection.updateOne(
      { _id: held.user._id },
      {
        $set: {
          [config.userFields.smtpReputationHoldUntil]: dayjs()
            .subtract(3, 'day')
            .toDate()
        },
        $unset: { [config.userFields.smtpReputationEvaluatedAt]: 1 }
      }
    );
    await updateSmtpReputation(yesterday());
    user = await getUser(held.user);
    t.is(user[config.userFields.smtpReputationTier], 1);
  }
);

test.serial(
  'spam or virus reports while sending reset the sender right away',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 3);
    await setBaseline(sender.user, TIERS[3].limit);
    await recordSent(sender, BASE + 10, new Date());
    await assertAccepted(t, sender);

    const email = { _id: new mongoose.Types.ObjectId() };
    const report = (recipient, reported = email) =>
      recordSmtpReputationReport({
        Users,
        user: sender.user,
        email: reported,
        recipient,
        truthSource: 'google.com',
        category: 'spam'
      });

    // one report does not reset the sender, nor does the same one again, nor
    // a second one (the minimum is a few, for a small sender)
    t.false(await report('first@gmail.com'));
    t.false(await report('first@gmail.com'));
    t.false(
      await report('second@gmail.com', { _id: new mongoose.Types.ObjectId() })
    );
    let user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 3);
    t.is(user[config.userFields.smtpReputationReports].length, 2);

    // enough reports for other recipients do
    t.true(
      await report('third@gmail.com', { _id: new mongoose.Types.ObjectId() })
    );
    user = await getUser(sender.user);
    assertReset(t, user);
    t.true(user[config.userFields.smtpThrottledAt] instanceof Date);
    t.is(user[config.userFields.smtpThrottledDays].length, 1);

    // the sender is immediately back on the first tier's threshold
    await assertDeferred(t, sender);
  }
);

test.serial(
  'a sender on hold is held to their own threshold on team domains',
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const admin = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    await setReputation(admin, 2);
    await Domains.collection.updateOne(
      { _id: sender.domain._id },
      { $push: { members: { user: admin._id, group: 'admin' } } }
    );
    // (their own threshold is the team plan's starting threshold)
    await setBaseline(sender.user, config.smtpTeamLimitMessages);
    await recordSent(sender, config.smtpTeamLimitMessages, new Date());
    await Users.collection.updateOne(
      { _id: sender.user._id },
      {
        $set: {
          [config.userFields.smtpReputationHoldUntil]: dayjs()
            .add(10, 'day')
            .toDate()
        }
      }
    );

    await assertDeferred(t, sender);
  }
);

test.serial(
  'messages with many recipients count toward a recipients limit',
  async (t) => {
    const sender = await createSender(t);
    const perMessage = 40;
    const limit = Math.ceil(BASE * config.smtpVelocityRecipientsMultiplier);
    const to = Array.from({ length: perMessage }, (_, i) => `r${i}@foo.com`);

    for (let sent = perMessage; sent <= limit; sent += perMessage) {
      const info = await send(sender, to);
      t.is(info.accepted.length, perMessage);
    }

    const err = await t.throwsAsync(send(sender, to));
    t.is(err.responseCode, 421);
    t.regex(err.response, /Unusual sending activity/);

    // a message that was not sent does not count
    const count = await t.context.client.get(
      `${config.smtpLimitNamespace}:velocity_rcpt:${
        sender.user._id
      }:${getSmtpDayKey()}`
    );
    t.is(Number(count), limit);
  }
);

test.serial('a high recent bounce rate slows sending down', async (t) => {
  const recent = dayjs().subtract(30, 'minute').toDate();

  // few bounces are fine
  const sender = await createSender(t);
  await recordSent(sender, config.smtpVelocityBounceMinSample, recent);
  await recordSent(sender, 2, recent, 'bounced');
  await assertAccepted(t, sender);

  const bouncing = await createSender(t);
  const total = config.smtpVelocityBounceMinSample;
  const bad = Math.ceil(total * config.smtpVelocityMaxBounceRate);
  await recordSent(bouncing, total - bad, recent);
  await recordSent(bouncing, bad, recent, 'bounced');
  await assertSlowedDown(t, bouncing);
});

test.serial(
  'subdomains of one domain count as one recipient domain',
  async (t) => {
    // (e.g. a wildcard catch-all on every subdomain of a throwaway domain)
    const sender = await createGrowingSender(t);
    await recordSent(sender, BASE, yesterday(), {
      to: (i) => `user${i}@sub${i}.throwaway-domain.com`
    });
    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 0);
    t.is(user[config.userFields.smtpReputationPeakDomains], 1);
  }
);

test.serial(
  'mail to your own subdomains or a domain you sent from does not count',
  async (t) => {
    const sender = await createGrowingSender(t);
    const [, ...rest] = sender.domain.name.split('.');
    const root = rest.join('.');
    t.truthy(root);

    // subdomains of the sender's own domain
    await recordSent(sender, BASE, yesterday(), {
      to: (i) => `user${i}@sub${i}.${sender.domain.name}`
    });

    // the sending domain, even once it is no longer on the account
    const other = await createGrowingSender(t);
    await recordSent(other, BASE, yesterday(), {
      to: (i) => `user${i}@${other.domain.name}`
    });
    await Domains.collection.updateOne(
      { _id: other.domain._id },
      { $set: { members: [] } }
    );

    await updateSmtpReputation(yesterday());
    for (const s of [sender, other]) {
      const user = await getUser(s.user);
      t.is(user[config.userFields.smtpReputationTier], 0);
      t.is(user[config.userFields.smtpReputationPeak], 0);
    }
  }
);

test.serial(
  'mail only delivered to other mail servers does not build reputation',
  async (t) => {
    // (e.g. recipients on the attacker's own mail servers)
    const sender = await createGrowingSender(t);
    await recordSent(sender, BASE, yesterday(), { truthSource: 'false' });
    await updateSmtpReputation(yesterday());
    let user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 0);
    t.is(user[config.userFields.smtpReputationPeak], 0);

    // enough of them delivered to truth sources is fine
    const mixed = await createGrowingSender(t);
    const trusted = Math.ceil(
      BASE *
        config.smtpReputationMinUtilization *
        config.smtpReputationMinTruthSourceShare
    );
    await recordSent(mixed, trusted, yesterday());
    await recordSent(mixed, BASE - trusted, yesterday(), {
      truthSource: false
    });
    await updateSmtpReputation(yesterday());
    user = await getUser(mixed.user);
    t.is(user[config.userFields.smtpReputationTier], 1);
  }
);

test.serial('bounce rates count recipients, not messages', async (t) => {
  const sender = await createSender(t);
  await setReputation(sender.user, 2, 2);

  // every message also went to one delivered recipient, but most of each
  // message's recipients were rejected
  const docs = [];
  for (let i = 0; i < config.smtpReputationMinSample; i++) {
    const _id = new mongoose.Types.ObjectId();
    const delivered = [1, 2, 3, 4, 5, 6, 7, 8].map(
      (n) => `ok${i}-${n}@delivered-domain.com`
    );
    const rejected = [`bad${i}@rejected-domain.com`];
    docs.push({
      _id,
      id: _id.toString(),
      user: sender.user._id,
      domain: sender.domain._id,
      alias: sender.alias._id,
      status: 'partially_sent',
      is_bounce: false,
      is_locked: false,
      envelope: {
        from: `${sender.alias.name}@${sender.domain.name}`,
        to: [...delivered, ...rejected]
      },
      accepted: delivered,
      rejectedErrors: rejected.map((recipient) => ({
        recipient,
        responseCode: 550,
        message: '550 5.1.1 User unknown'
      })),
      date: yesterday(),
      created_at: yesterday(),
      updated_at: yesterday()
    });
  }

  await Emails.collection.insertMany(docs);

  await updateSmtpReputation(yesterday());
  const user = await getUser(sender.user);
  t.is(user[config.userFields.smtpReputationTier], 1);
  t.is(user[config.userFields.smtpReputationCleanDays], 0);
});

test.serial(
  'report thresholds are a rate of the recipients sent to',
  async (t) => {
    const { getReportThresholds } = recordSmtpReputationReport;
    // (a minimum count for small senders, so one report is never enough)
    t.deepEqual(getReportThresholds(0), {
      badDay: config.smtpReputationBadDayReports,
      reset: config.smtpReputationTruthSourceStrikes
    });
    t.deepEqual(getReportThresholds(10_000), {
      badDay: Math.ceil(10_000 * config.smtpReputationBadDayReportRate),
      reset: Math.ceil(10_000 * config.smtpReputationTruthSourceStrikeRate)
    });

    // a few reports for a sender who sent to many recipients are neither a
    // reset nor a bad day
    const { badDay, reset } = getReportThresholds(5000);
    const sender = await createSender(t);
    await setPaidTenure(sender.user, 365);
    await setReputation(sender.user, 4, 2);
    await recordSent(sender, 5000, yesterday());
    for (let i = 0; i < Math.min(badDay, reset) - 1; i++) {
      await recordReport(sender.user, `someone${i}@gmail.com`, yesterday());
    }

    await updateSmtpReputation(yesterday());
    let user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 4);
    t.is(user[config.userFields.smtpReputationCleanDays], 3);

    // nor while sending (as a rate of the recipients sent to recently)
    const live = await createSender(t);
    await setReputation(live.user, 4);
    // (recipients outside the domain in the last 24 hours)
    await t.context.client.set(
      getRecipientsHourKey(live.user._id, new Date()),
      '10000',
      'PX',
      60_000
    );
    const liveReset = getReportThresholds(10_000).reset;
    const report = (i) =>
      recordSmtpReputationReport({
        Users,
        client: t.context.client,
        user: live.user,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient: `someone${i}@gmail.com`,
        truthSource: 'google.com',
        category: 'spam'
      });
    for (let i = 0; i < liveReset - 1; i++) t.false(await report(i));
    user = await getUser(live.user);
    t.is(user[config.userFields.smtpReputationTier], 4);
    t.true(await report(liveReset));
  }
);

test.serial('an approved minimum does not apply while on hold', async (t) => {
  const sender = await createSender(t, {
    [config.userFields.smtpLimit]: BASE * 3
  });
  await setBaseline(sender.user, BASE * 3);
  await recordSent(sender, BASE, new Date());
  await assertAccepted(t, sender);

  await Users.collection.updateOne(
    { _id: sender.user._id },
    {
      $set: {
        [config.userFields.smtpReputationHoldUntil]: dayjs()
          .add(10, 'day')
          .toDate()
      }
    }
  );
  await assertDeferred(t, sender);
});

test.serial(
  'reports on a team domain count toward a bad day for its admins',
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const admin = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    await setReputation(admin, 3);
    await Domains.collection.updateOne(
      { _id: sender.domain._id },
      { $push: { members: { user: admin._id, group: 'admin' } } }
    );
    const domain = await Domains.findById(sender.domain._id).lean().exec();

    for (let i = 0; i < config.smtpReputationTruthSourceStrikes; i++) {
      await recordSmtpReputationReport({
        Users,
        user: sender.user,
        domain,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient: `someone${i}@gmail.com`,
        truthSource: 'google.com',
        category: 'spam'
      });
    }

    assertReset(t, await getUser(sender.user));

    // the admin whose threshold the member borrowed is not reset (the member
    // is, and is then held to their own threshold)
    let admined = await getUser(admin);
    t.is(admined[config.userFields.smtpReputationTier], 3);
    t.falsy(admined[config.userFields.smtpReputationHoldUntil]);
    const borrowed = admined[config.userFields.smtpReputationReports];
    t.is(borrowed.length, config.smtpReputationTruthSourceStrikes);
    t.true(borrowed.every((report) => report.borrowed === true));

    // but the reports make a bad day for them
    await Users.collection.updateOne(
      { _id: admin._id },
      {
        $set: {
          [`${config.userFields.smtpReputationReports}.$[].date`]: yesterday()
        }
      }
    );
    await updateSmtpReputation(yesterday());
    admined = await getUser(admin);
    t.is(admined[config.userFields.smtpReputationTier], 2);
    t.falsy(admined[config.userFields.smtpReputationHoldUntil]);

    // (not on other plans, where the domain uses the sender's own threshold)
    const other = await createSender(t);
    const coAdmin = await t.context.userFactory
      .withState({ plan: 'enhanced_protection' })
      .create();
    await setReputation(coAdmin, 3);
    await Domains.collection.updateOne(
      { _id: other.domain._id },
      { $push: { members: { user: coAdmin._id, group: 'admin' } } }
    );
    const otherDomain = await Domains.findById(other.domain._id).lean().exec();
    for (let i = 0; i < config.smtpReputationTruthSourceStrikes; i++) {
      await recordSmtpReputationReport({
        Users,
        user: other.user,
        domain: otherDomain,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient: `someone${i}@gmail.com`,
        truthSource: 'google.com',
        category: 'spam'
      });
    }

    const after = await getUser(coAdmin);
    t.is(after[config.userFields.smtpReputationTier], 3);
  }
);

test.serial('an hour never allows more than a share of the day', async (t) => {
  useConfig(
    t,
    'smtpVelocityHourlyShare',
    VELOCITY_DEFAULTS.smtpVelocityHourlyShare
  );
  const sender = await createSender(t);
  await setReputation(sender.user, 2);
  await setBaseline(sender.user, TIERS[2].limit);
  // a huge busiest hour (e.g. built up with mail to yourself)
  await Users.collection.updateOne(
    { _id: sender.user._id },
    { $set: { [config.userFields.smtpBaselineHourly]: TIERS[2].limit * 10 } }
  );

  const hourly = Math.ceil(TIERS[2].limit * config.smtpVelocityMaxHourlyShare);
  await recordSent(sender, hourly - 1, dayjs().subtract(10, 'minute').toDate());
  await assertAccepted(t, sender);
  await assertSlowedDown(t, sender);
});

test.serial(
  'a message with more recipients than a day allows is refused',
  async (t) => {
    useConfig(t, 'smtpVelocityRecipientsMultiplier', 0.2);
    const sender = await createSender(t);
    const limit = Math.ceil(BASE * config.smtpVelocityRecipientsMultiplier);
    const to = Array.from({ length: limit + 1 }, (_, i) => `r${i}@foo.com`);
    const err = await t.throwsAsync(send(sender, to));
    t.is(err.responseCode, 550);
    t.regex(err.response, /Too many recipients/);
  }
);

test.serial(
  'recipients of messages refused by the domain limit do not count',
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const member = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    // the domain is at its daily threshold from another member's mail
    await recordSent(
      { ...sender, user: member },
      config.smtpTeamLimitMessages,
      new Date()
    );

    await assertDeferred(t, sender);

    const count = await t.context.client.get(
      `${config.smtpLimitNamespace}:velocity_rcpt:${
        sender.user._id
      }:${getSmtpDayKey()}`
    );
    t.is(Number(count || 0), 0);
  }
);

test.serial('only permanent verdicts about the message count', (t) => {
  const { isSenderVerdict } = recordSmtpReputationReport;
  const verdict = (response, bounceInfo) =>
    isSenderVerdict({
      response,
      bounceInfo: {
        action: 'reject',
        category: 'spam',
        message: 'Spam',
        ...bounceInfo
      }
    });

  t.true(verdict('550 5.7.1 Message rejected as spam'));
  t.true(verdict('554 5.7.1 Virus found', { category: 'virus' }));
  // deferrals
  t.false(verdict('421 4.7.0 Try again later, suspicious content'));
  t.false(verdict('550 5.7.1 Deferred', { action: 'defer' }));
  // verdicts about our shared IP addresses
  t.false(
    verdict('550 5.7.1 blocked', { message: 'Sender IP blocked for Spam' })
  );
  // other categories
  t.false(verdict('550 5.1.1 User unknown', { category: 'recipient' }));
  t.false(isSenderVerdict({ response: '550 spam' }));
});

test.serial(
  'reports from before an admin review no longer count',
  async (t) => {
    const sender = await createSender(t);
    await setPaidTenure(sender.user, 365);
    await setReputation(sender.user, 2, 2);
    await recordSent(sender, 50, yesterday());
    for (let i = 0; i < config.smtpReputationTruthSourceStrikes; i++) {
      await recordReport(sender.user, `someone${i}@gmail.com`, yesterday());
    }

    // an admin reviewed the sender afterwards
    await Users.collection.updateOne(
      { _id: sender.user._id },
      {
        $set: {
          [config.userFields.smtpReputationReviewedAt]: dayjs(yesterday())
            .add(1, 'hour')
            .toDate()
        }
      }
    );

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 2);
    t.is(user[config.userFields.smtpReputationCleanDays], 3);
    t.falsy(user[config.userFields.smtpReputationHoldUntil]);

    // nor while sending
    const live = await createSender(t);
    await setReputation(live.user, 2);
    await recordReport(live.user, 'first@gmail.com', new Date());
    await Users.collection.updateOne(
      { _id: live.user._id },
      { $set: { [config.userFields.smtpReputationReviewedAt]: new Date() } }
    );
    t.false(
      await recordSmtpReputationReport({
        Users,
        user: live.user,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient: 'second@gmail.com',
        truthSource: 'google.com',
        category: 'spam'
      })
    );
  }
);

test.serial('the busiest day counts from the whole lookback', async (t) => {
  const sender = await createGrowingSender(t);
  // days up to three days ago were already evaluated
  await Users.collection.updateOne(
    { _id: sender.user._id },
    {
      $set: {
        [config.userFields.smtpReputationEvaluatedAt]: dayjs()
          .subtract(2, 'day')
          .startOf('day')
          .toDate()
      }
    }
  );

  // a busy day three days ago, and a small clean day yesterday
  await recordSent(
    sender,
    BASE,
    dayjs(yesterday()).subtract(2, 'day').toDate()
  );
  await recordSent(
    sender,
    config.smtpReputationMinCleanDayRecipients,
    yesterday()
  );

  await updateSmtpReputation(yesterday());
  const user = await getUser(sender.user);
  t.is(user[config.userFields.smtpReputationTier], 1);
});

test.serial('team plan senders start at the team threshold', async (t) => {
  const TEAM = config.smtpTeamLimitMessages;
  t.true(TEAM > BASE);

  const sender = await createSender(t, {}, { plan: 'team' });
  t.is(sender.user.plan, 'team');

  // the domain uses the sender's team threshold, and so do slowdowns
  await recordSent(sender, TEAM - 1, new Date());
  await assertAccepted(t, sender);
  await assertDeferred(t, sender);

  const res = await t.context.api
    .get('/v1/emails/limit')
    .auth(sender.user[config.userFields.apiToken]);
  t.is(res.status, 200);
  t.is(res.body.limit, TEAM);

  // (other plans start at the first tier)
  const other = await createSender(t);
  await recordSent(other, BASE, new Date());
  await assertDeferred(t, other);
});

test.serial(
  'team plan senders move up from the first tier above their start',
  async (t) => {
    // (the production team threshold, above the second tier)
    useConfig(t, 'smtpTeamLimitMessages', 900);
    const covered = TIERS.findLastIndex((tier) => tier.limit <= 900);
    const next = TIERS[covered + 1];
    t.truthy(next);

    const sender = await createSender(t, {}, { plan: 'team' });
    await setPaidTenure(sender.user, next.minPaidDays + 1);
    await setReputation(sender.user, 0, next.minCleanDays - 1);
    await recordSent(
      sender,
      Math.ceil(900 * config.smtpReputationMinUtilization),
      yesterday()
    );

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], covered + 1);
    t.is(getUserSmtpLimit(user), next.limit);

    // not enough sending keeps them at the team threshold
    const quiet = await createSender(t, {}, { plan: 'team' });
    await setPaidTenure(quiet.user, next.minPaidDays + 1);
    await setReputation(quiet.user, 0, next.minCleanDays - 1);
    await recordSent(quiet, 10, yesterday());
    await updateSmtpReputation(yesterday());
    const after = await getUser(quiet.user);
    t.is(after[config.userFields.smtpReputationTier], 0);
    t.is(getUserSmtpLimit(after), 900);
  }
);

test.serial('team plan senders are reset to the team threshold', async (t) => {
  const sender = await createSender(t, {}, { plan: 'team' });
  await setReputation(sender.user, 3);
  for (let i = 0; i < config.smtpReputationTruthSourceStrikes; i++) {
    await recordSmtpReputationReport({
      Users,
      user: sender.user,
      email: { _id: new mongoose.Types.ObjectId() },
      recipient: `someone${i}@gmail.com`,
      truthSource: 'google.com',
      category: 'spam'
    });
  }

  const user = await getUser(sender.user);
  assertReset(t, user);
  t.is(getUserSmtpLimit(user), config.smtpTeamLimitMessages);
});

test.serial(
  'members of team plan domains start at the team threshold for slowdowns',
  async (t) => {
    const TEAM = config.smtpTeamLimitMessages;
    // a member who is not on the Team plan themselves
    const sender = await createSender(t, {}, { plan: 'team' });
    await Users.collection.updateOne(
      { _id: sender.user._id },
      { $set: { plan: 'enhanced_protection' } }
    );
    const admin = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    await Domains.collection.updateOne(
      { _id: sender.domain._id },
      {
        $set: {
          members: [
            { user: sender.user._id, group: 'user' },
            { user: admin._id, group: 'admin' }
          ]
        }
      }
    );

    await recordSent(sender, TEAM - 1, new Date());
    await assertAccepted(t, sender);
    await assertDeferred(t, sender);

    // (not while the member is on hold after spam or virus reports)
    const { getSmtpVelocityBase } = require('#helpers/check-smtp-velocity');
    const domain = { plan: 'team' };
    t.is(getSmtpVelocityBase({ plan: 'enhanced_protection' }, domain), TEAM);
    t.is(
      getSmtpVelocityBase(
        {
          plan: 'enhanced_protection',
          [config.userFields.smtpReputationHoldUntil]: dayjs()
            .add(1, 'day')
            .toDate()
        },
        domain
      ),
      BASE
    );
  }
);

test.serial(
  'only domains owned by system admins are exempt from rate limits',
  async (t) => {
    // a domain owned by a system admin is never rate limited
    const own = await createSender(t);
    await Users.collection.updateOne(
      { _id: own.user._id },
      { $set: { group: 'admin' } }
    );
    await recordSent(own, BASE * 5, new Date());
    await assertAccepted(t, own);
    const to = Array.from({ length: 40 }, (_, i) => `r${i}@foo.com`);
    const info = await send(own, to);
    t.is(info.accepted.length, to.length);

    // (nor over the API)
    const res = await t.context.api
      .post('/v1/emails')
      .auth(own.user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send({
        raw: `
To: test@foo.com
From: Test <${own.alias.name}@${own.domain.name}>
Subject: testing reputation
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
      });
    t.is(res.status, 200);

    // a system admin cannot send from a customer's domain at all
    const sender = await createSender(t);
    const owner = await t.context.userFactory
      .withState({ plan: 'enhanced_protection' })
      .create();
    await Domains.collection.updateOne(
      { _id: sender.domain._id },
      {
        $set: {
          members: [
            { user: sender.user._id, group: 'user' },
            { user: owner._id, group: 'admin' }
          ]
        }
      }
    );
    await Users.collection.updateOne(
      { _id: sender.user._id },
      { $set: { group: 'admin' } }
    );
    await assertSystemAdminBlocked(t, sender);
  }
);

test.serial(
  "reports from one company's tenant count once, a provider's own domains count per recipient",
  async (t) => {
    const report = (user, recipient) =>
      recordSmtpReputationReport({
        Users,
        user,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient,
        truthSource: 'google.com',
        category: 'spam'
      });

    // (e.g. a tenant whose admin rejects mail as spam to frame a sender)
    const tenant = await createSender(t);
    await setReputation(tenant.user, 3);
    for (let i = 0; i < 10; i++) {
      t.false(await report(tenant.user, `user${i}@victim-tenant.com`));
    }

    let user = await getUser(tenant.user);
    t.is(user[config.userFields.smtpReputationTier], 3);

    // another company's tenant counts separately (but tenants make up at most
    // half of the reports needed, see below)
    t.false(await report(tenant.user, 'someone@other-tenant.com'));
    t.false(await report(tenant.user, 'someone@gmail.com'));
    t.true(await report(tenant.user, 'another@gmail.com'));
    assertReset(t, await getUser(tenant.user));

    // each recipient on a provider's own domains counts
    const consumer = await createSender(t);
    await setReputation(consumer.user, 3);
    t.false(await report(consumer.user, 'first@gmail.com'));
    // (variants of one mailbox count once)
    t.false(await report(consumer.user, 'f.i.r.s.t+x@googlemail.com'));
    user = await getUser(consumer.user);
    t.is(user[config.userFields.smtpReputationTier], 3);
    t.false(await report(consumer.user, 'second@gmail.com'));
    t.true(await report(consumer.user, 'third@gmail.com'));
    assertReset(t, await getUser(consumer.user));
  }
);

test.serial('report thresholds are capped', (t) => {
  const { getReportThresholds } = recordSmtpReputationReport;
  const { badDay, reset } = getReportThresholds(10_000_000);
  t.is(badDay, config.smtpReputationBadDayReportsMax);
  t.is(reset, config.smtpReputationTruthSourceStrikesMax);
});

test.serial('old reports are not kept', async (t) => {
  const sender = await createSender(t);
  await recordReport(
    sender.user,
    'old@gmail.com',
    dayjs().subtract(90, 'day').toDate()
  );
  await recordSmtpReputationReport({
    Users,
    user: sender.user,
    email: { _id: new mongoose.Types.ObjectId() },
    recipient: 'new@gmail.com',
    truthSource: 'google.com',
    category: 'spam'
  });
  await pWaitFor(
    async () => {
      const user = await getUser(sender.user);
      return user[config.userFields.smtpReputationReports].length === 1;
    },
    { timeout: ms('5s') }
  );
  const user = await getUser(sender.user);
  t.is(
    user[config.userFields.smtpReputationReports][0].recipient,
    'new@gmail.com'
  );
});

test.serial(
  'variants of one mailbox count once toward reputation',
  async (t) => {
    const sender = await createGrowingSender(t);
    // plus-address and dot variants of a single Gmail account
    await recordSent(sender, BASE, yesterday(), {
      to: (i) =>
        i % 2
          ? `me+${i}@gmail.com`
          : `${[...'me'].join('.'.repeat(i % 3))}+v${i}@googlemail.com`
    });
    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 0);
    t.is(user[config.userFields.smtpReputationPeak], 1);
  }
);

test.serial("a provider's own domains are not capped per domain", async (t) => {
  useConfig(t, 'smtpReputationMaxRecipientsPerDomain', 10);
  const sender = await createGrowingSender(t);
  await recordSent(sender, BASE, yesterday(), {
    to: (i) => `person${i}@gmail.com`
  });
  await updateSmtpReputation(yesterday());
  const user = await getUser(sender.user);
  t.is(user[config.userFields.smtpReputationPeak], BASE);
});

test.serial(
  'an address that looks like a variable does not break evaluation',
  async (t) => {
    const sender = await createSender(t);
    await Users.collection.updateOne(
      { _id: sender.user._id },
      { $set: { email: `$$${sender.user.email}` } }
    );
    await recordSent(sender, 10, yesterday());
    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.true(user[config.userFields.smtpReputationEvaluatedAt] instanceof Date);
  }
);

test.serial(
  'a day where far more than the bad rate bounced resets the sender',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 3, 2);
    const total = config.smtpReputationMinSample * 2;
    const bad = Math.ceil(
      total *
        config.smtpReputationMaxBadRate *
        config.smtpReputationSevereBadRateMultiplier
    );
    await recordSent(sender, total - bad, yesterday());
    await recordSent(sender, bad, yesterday(), 'bounced');

    await updateSmtpReputation(yesterday());
    assertReset(t, await getUser(sender.user));
  }
);

test.serial(
  'only the admin whose threshold a team domain borrows answers for it',
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const high = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    const low = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    await setReputation(high, 3);
    await Domains.collection.updateOne(
      { _id: sender.domain._id },
      {
        $push: {
          members: {
            $each: [
              { user: high._id, group: 'admin' },
              { user: low._id, group: 'admin' }
            ]
          }
        }
      }
    );
    const domain = await Domains.findById(sender.domain._id).lean().exec();
    for (let i = 0; i < config.smtpReputationTruthSourceStrikes; i++) {
      await recordSmtpReputationReport({
        Users,
        user: sender.user,
        domain,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient: `someone${i}@gmail.com`,
        truthSource: 'google.com',
        category: 'spam'
      });
    }

    // (recorded toward a bad day for them, see above)
    const borrowed = await getUser(high);
    t.is(
      borrowed[config.userFields.smtpReputationReports].length,
      config.smtpReputationTruthSourceStrikes
    );
    t.true(
      borrowed[config.userFields.smtpReputationReports].every(
        (report) => report.borrowed === true
      )
    );
    const other = await getUser(low);
    t.falsy(other[config.userFields.smtpReputationReports]);
    t.falsy(other[config.userFields.smtpReputationHoldUntil]);
  }
);

test.serial(
  'messages submitted at once cannot pass the daily threshold',
  async (t) => {
    const sender = await createSender(t);
    await setBaseline(sender.user, BASE);
    const left = 2;
    await recordSent(sender, BASE - left, new Date());

    const post = () =>
      t.context.api
        .post('/v1/emails')
        .auth(sender.user[config.userFields.apiToken])
        .set('Accept', 'application/json')
        .send({
          raw: `
To: test@foo.com
From: Test <${sender.alias.name}@${sender.domain.name}>
Subject: testing reputation
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
        });

    const results = await Promise.all(Array.from({ length: 6 }, () => post()));
    t.is(results.filter((res) => res.status === 200).length, left);
    t.is(results.filter((res) => res.status === 429).length, 6 - left);
    t.is(
      await Emails.countDocuments({
        user: sender.user._id,
        created_at: { $gte: dayjs().startOf('day').toDate() }
      }),
      BASE
    );
  }
);

test.serial('a day of scheduled messages cannot be stockpiled', async (t) => {
  const sender = await createSender(t);
  const later = dayjs().add(3, 'day').toDate();
  // (a day's allowance already scheduled, from earlier days)
  await recordSent(sender, BASE, dayjs().subtract(1, 'day').toDate(), 'queued');
  await Emails.collection.updateMany(
    { user: sender.user._id, status: 'queued' },
    { $set: { date: later } }
  );

  const post = (date) =>
    t.context.api
      .post('/v1/emails')
      .auth(sender.user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send({
        from: `${sender.alias.name}@${sender.domain.name}`,
        to: 'test@foo.com',
        subject: 'testing reputation',
        text: 'Test',
        ...(date ? { date: date.toISOString() } : {})
      });

  const scheduled = await post(later);
  t.is(scheduled.status, 429);
  t.regex(scheduled.body.message, /Unusual sending activity/);

  // messages sent now are fine
  const now = await post();
  t.is(now.status, 200);
});

test.serial('an approved minimum can be sent within an hour', async (t) => {
  useConfig(
    t,
    'smtpVelocityHourlyShare',
    VELOCITY_DEFAULTS.smtpVelocityHourlyShare
  );
  const sender = await createSender(t, {
    [config.userFields.smtpLimit]: BASE * 4
  });
  await setBaseline(sender.user, BASE * 4);
  await recordSent(sender, BASE * 3, dayjs().subtract(10, 'minute').toDate());
  await assertAccepted(t, sender);
});

test.serial('alias limits apply to API sending too', async (t) => {
  const sender = await createSender(t);
  const post = () =>
    t.context.api
      .post('/v1/emails')
      .auth(sender.user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send({
        from: `${sender.alias.name}@${sender.domain.name}`,
        to: 'test@foo.com',
        subject: 'testing reputation',
        text: 'Test'
      });

  // without an alias limit this sends
  const ok = await post();
  t.is(ok.status, 200);

  await Aliases.collection.updateOne(
    { _id: sender.alias._id },
    { $set: { smtp_limit: 5 } }
  );
  await recordSent(sender, 4, new Date());
  const res = await post();
  t.is(res.status, 429);
});

test.serial(
  'members of team domains see the domain threshold in the API',
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const admin = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    await setReputation(admin, 3);
    await Domains.collection.updateOne(
      { _id: sender.domain._id },
      {
        $set: {
          members: [
            { user: sender.user._id, group: 'user' },
            { user: admin._id, group: 'admin' }
          ]
        }
      }
    );
    const res = await t.context.api
      .get('/v1/emails/limit')
      .auth(sender.user[config.userFields.apiToken]);
    t.is(res.status, 200);
    t.is(res.body.limit, TIERS[3].limit);
  }
);

test.serial(
  'a sender on hold does not charge the admin of a team domain',
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const admin = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    await setReputation(admin, 3);
    await Domains.collection.updateOne(
      { _id: sender.domain._id },
      { $push: { members: { user: admin._id, group: 'admin' } } }
    );
    await Users.collection.updateOne(
      { _id: sender.user._id },
      {
        $set: {
          [config.userFields.smtpReputationHoldUntil]: dayjs()
            .add(10, 'day')
            .toDate()
        }
      }
    );
    const domain = await Domains.findById(sender.domain._id).lean().exec();
    for (let i = 0; i < config.smtpReputationTruthSourceStrikes; i++) {
      await recordSmtpReputationReport({
        Users,
        user: sender.user,
        domain,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient: `someone${i}@gmail.com`,
        truthSource: 'google.com',
        category: 'spam'
      });
    }

    const after = await getUser(admin);
    t.is(after[config.userFields.smtpReputationTier], 3);
    t.falsy(after[config.userFields.smtpReputationReports]);
  }
);

test.serial(
  'a severe bounce day an admin reviewed afterwards does not reset',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 3, 2);
    const total = config.smtpReputationMinSample * 2;
    await recordSent(sender, total / 2, yesterday());
    await recordSent(sender, total / 2, yesterday(), 'bounced');
    await Users.collection.updateOne(
      { _id: sender.user._id },
      {
        $set: {
          [config.userFields.smtpReputationReviewedAt]: dayjs(yesterday())
            .endOf('day')
            .add(1, 'hour')
            .toDate()
        }
      }
    );

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    // (neither a reset nor a bad day, since the day started before the
    // review, e.g. it was not evaluated yet when an admin set the tier)
    t.is(user[config.userFields.smtpReputationTier], 3);
    t.falsy(user[config.userFields.smtpReputationHoldUntil]);
  }
);

//
// add `user` as a member of `domain` (an admin by default)
//
async function addMember(domain, user, group = 'admin') {
  await Domains.collection.updateOne(
    { _id: domain._id },
    {
      $push: {
        members: { _id: new mongoose.Types.ObjectId(), user: user._id, group }
      }
    }
  );
}

async function assertSystemAdminBlocked(t, sender) {
  const err = await t.throwsAsync(send(sender));
  t.is(err.responseCode, 550);
  t.regex(
    err.response,
    /System administrators cannot send from customer domains/
  );
}

test.serial(
  "the threshold is account-wide across the account's domains",
  async (t) => {
    // the account's own domain, where it used up its threshold today
    const owner = await createSender(t, {}, { plan: 'team' });
    await setReputation(owner.user, 1);
    await setBaseline(owner.user, TIERS[1].limit);
    await recordSent(owner, TIERS[1].limit, new Date());

    // another domain of the account, where a second user (with a threshold of
    // their own) sends
    const member = await createSender(t, {}, { plan: 'team' });
    await addMember(member.domain, owner.user);

    await assertDeferred(t, member);
  }
);

test.serial(
  'team plan members on another domain share the admin threshold',
  async (t) => {
    const owner = await createSender(t, {}, { plan: 'team' });
    await recordSent(owner, config.smtpTeamLimitMessages, new Date());

    // a member (not an admin) of the account's second Team plan domain
    const member = await createSender(t, {}, { plan: 'team' });
    await Domains.collection.updateOne(
      { _id: member.domain._id },
      {
        $set: {
          members: [
            {
              _id: new mongoose.Types.ObjectId(),
              user: owner.user._id,
              group: 'admin'
            },
            {
              _id: new mongoose.Types.ObjectId(),
              user: member.user._id,
              group: 'user'
            }
          ]
        }
      }
    );

    await assertDeferred(t, member);
  }
);

test.serial(
  "new domains start at their starting threshold, whatever the account's",
  async (t) => {
    const sender = await createSender(t, {}, {}, { ramp: true });
    await setReputation(sender.user, 2);
    await setBaseline(sender.user, TIERS[2].limit);

    await recordSent(sender, BASE - 1, new Date());
    await assertAccepted(t, sender);
    await assertDeferred(t, sender);
  }
);

test.serial('a domain ramps up with its delivered mail', async (t) => {
  const sender = await createSender(t, {}, {}, { ramp: true });
  await setReputation(sender.user, 2);
  await setBaseline(sender.user, TIERS[2].limit);

  // delivered yesterday (and bounced mail does not count)
  await recordSent(sender, BASE, yesterday());
  await recordSent(sender, BASE, yesterday(), 'bounced');

  const ramp = BASE * config.smtpDomainRampMultiplier;
  t.true(ramp < TIERS[2].limit);
  await recordSent(sender, ramp - 1, new Date());
  await assertAccepted(t, sender);
  await assertDeferred(t, sender);
});

test.serial(
  "the reputation job adds each day to a domain's history",
  async (t) => {
    const sender = await createSender(t, {}, {}, { ramp: true });

    // (the domain's history starts when it first sends)
    await assertAccepted(t, sender);
    let domain = await Domains.findById(sender.domain._id).lean().exec();
    t.true(domain.smtp_daily_counts_at instanceof Date);
    t.deepEqual(domain.smtp_daily_counts, []);

    await recordSent(sender, 70, yesterday());
    await recordSent(sender, 5, yesterday(), 'bounced');
    await updateSmtpReputation(yesterday());

    domain = await Domains.findById(sender.domain._id).lean().exec();
    t.deepEqual(domain.smtp_daily_counts, [
      {
        day: dayjs.utc(yesterday()).startOf('day').toDate(),
        count: 70
      }
    ]);
  }
);

test.serial(
  'bounces and auto-replies do not count toward the threshold',
  async (t) => {
    const sender = await createSender(t);
    await recordSent(sender, BASE - 1, new Date());
    await recordSent(sender, BASE, new Date(), { isBounce: true });
    await assertAccepted(t, sender);
    await assertDeferred(t, sender);
  }
);

test.serial('system admins cannot send from customer domains', async (t) => {
  const sender = await createSender(t, {}, { plan: 'team' });
  const customer = await t.context.userFactory.create();
  await addMember(sender.domain, customer);
  await Users.collection.updateOne(
    { _id: sender.user._id },
    { $set: { group: 'admin' } }
  );

  await assertSystemAdminBlocked(t, sender);
});

test.serial(
  'a system admin added to a customer domain does not exempt it',
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const admin = await t.context.userFactory
      .withState({ group: 'admin' })
      .create();
    await addMember(sender.domain, admin);

    await recordSent(sender, config.smtpTeamLimitMessages, new Date());
    await assertDeferred(t, sender);
  }
);

test.serial(
  'domains whose admins are all system admins are exempt',
  async (t) => {
    const sender = await createSender(t);
    await Users.collection.updateOne(
      { _id: sender.user._id },
      { $set: { group: 'admin' } }
    );

    await recordSent(sender, BASE, new Date());
    await assertAccepted(t, sender);
  }
);

test.serial(
  'system admins cannot send from customer domains over the API',
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const customer = await t.context.userFactory.create();
    await addMember(sender.domain, customer);
    await Users.collection.updateOne(
      { _id: sender.user._id },
      { $set: { group: 'admin' } }
    );

    const res = await t.context.api
      .post('/v1/emails')
      .auth(sender.user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send({
        raw: `
To: test@foo.com
From: Test <${sender.alias.name}@${sender.domain.name}>
Subject: testing reputation
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
      });
    t.is(res.status >= 400 && res.status < 500, true);
    t.regex(res.body.message, /System administrators cannot send/);
    t.is(await Emails.countDocuments({ user: sender.user._id }), 0);
  }
);

test.serial(
  "the account threshold applies to API sending on the account's domains",
  async (t) => {
    const owner = await createSender(t, {}, { plan: 'team' });
    await setReputation(owner.user, 1);
    await setBaseline(owner.user, TIERS[1].limit);
    await recordSent(owner, TIERS[1].limit, new Date());

    const member = await createSender(t, {}, { plan: 'team' });
    await addMember(member.domain, owner.user);

    const res = await t.context.api
      .post('/v1/emails')
      .auth(member.user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send({
        raw: `
To: test@foo.com
From: Test <${member.alias.name}@${member.domain.name}>
Subject: testing reputation
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
      });
    t.is(res.status, 429);
  }
);

test.serial('thresholds reset at midnight UTC', async (t) => {
  const midnight = dayjs.utc().startOf('day').toDate();

  // (only the daily threshold is under test: in the first hour of a UTC day
  // the messages sent just before midnight are also in the last hour, and
  // the hourly burst limit would defer the sender)
  config.smtpVelocityHourlyShare = 2;

  // sent just before midnight UTC (yesterday)
  const before = await createSender(t);
  await recordSent(before, BASE, new Date(midnight.getTime() - 1));
  await assertAccepted(t, before);

  // sent at midnight UTC (today, whatever the local timezone)
  const after = await createSender(t);
  await recordSent(after, BASE, midnight);
  await assertDeferred(t, after);
});

test.serial(
  "a co-admin's own domain does not count the domains of a higher account",
  async (t) => {
    // a busy account
    const busy = await createSender(t, {}, { plan: 'team' });
    await setReputation(busy.user, 1);
    await setBaseline(busy.user, TIERS[1].limit);
    await recordSent(busy, TIERS[1].limit - 1, new Date());

    // who made someone with their own (lower) threshold a co-admin
    const coAdmin = await createSender(t, {}, { plan: 'team' });
    await addMember(busy.domain, coAdmin.user);

    // (the co-admin's own domain is their own account)
    await assertAccepted(t, coAdmin);
  }
);

test.serial(
  'catch-all passwords of system admins on customer domains send as the customer',
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const staff = await t.context.userFactory
      .withState({ group: 'admin' })
      .create();
    await addMember(sender.domain, staff);

    // a catch-all password a system admin generated for the customer
    const { password, salt, hash } = await createPassword();
    await Domains.collection.updateOne(
      { _id: sender.domain._id },
      {
        $push: {
          tokens: {
            _id: new mongoose.Types.ObjectId(),
            description: 'test',
            salt,
            hash,
            user: staff._id,
            created_at: new Date()
          }
        }
      }
    );

    const mx = await asyncMxConnect({
      target: IP_ADDRESS,
      port: sender.smtp.server.address().port,
      dnsOptions: {
        resolve: util.callbackify(sender.resolver.resolve.bind(sender.resolver))
      }
    });
    const transporter = nodemailer.createTransport({
      logger,
      host: mx.host,
      port: mx.port,
      connection: mx.socket,
      secure: false,
      tls: { rejectUnauthorized: false },
      auth: { user: `catchall@${sender.domain.name}`, pass: password }
    });
    const info = await transporter.sendMail({
      envelope: {
        from: `catchall@${sender.domain.name}`,
        to: ['test@foo.com']
      },
      raw: `
To: test@foo.com
From: Test <catchall@${sender.domain.name}>
Subject: testing reputation
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
    });
    t.is(info.accepted.length, 1);

    // sent as (and the password now belongs to) the customer
    t.is(await Emails.countDocuments({ user: staff._id }), 0);
    t.is(await Emails.countDocuments({ user: sender.user._id }), 1);
    const updated = await Domains.findById(sender.domain._id)
      .select('+tokens')
      .lean()
      .exec();
    t.is(updated.tokens[0].user.toString(), sender.user._id.toString());
  }
);

test.serial(
  'the reputation job computes the history of domains that sent',
  async (t) => {
    const sender = await createSender(t, {}, {}, { ramp: true });
    await recordSent(sender, 40, yesterday());
    await recordSent(
      sender,
      30,
      dayjs(yesterday()).subtract(3, 'day').toDate()
    );

    await updateSmtpReputation(yesterday());

    const domain = await Domains.findById(sender.domain._id).lean().exec();
    t.true(domain.smtp_daily_counts_at instanceof Date);
    t.deepEqual(
      domain.smtp_daily_counts.map(({ day, count }) => [day.getTime(), count]),
      [
        [
          dayjs.utc(yesterday()).subtract(3, 'day').startOf('day').valueOf(),
          30
        ],
        [dayjs.utc(yesterday()).startOf('day').valueOf(), 40]
      ]
    );
  }
);

//
// a mail server at a truth source (MX `mx.truthsource.com`) for `gmail.com`
// that rejects every recipient as spam
//
async function useSpamRejectingTruthSource(t, resolver) {
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    secure: false,
    logger: false,
    onRcptTo(address, session, fn) {
      const err = new Error('5.7.1 Message rejected as spam');
      err.responseCode = 550;
      fn(err);
    }
  });
  await pify(server.listen.bind(server))(port);
  t.teardown(() => server.close());

  await resolver.options.cache.mset(
    new Map([
      [
        'mx:gmail.com',
        resolver.spoofPacket(
          'gmail.com',
          'MX',
          [{ exchange: 'mx.truthsource.com', priority: 0 }],
          true,
          ms('5m')
        )
      ],
      [
        'a:mx.truthsource.com',
        resolver.spoofPacket(
          'mx.truthsource.com',
          'A',
          [IP_ADDRESS],
          true,
          ms('5m')
        )
      ]
    ])
  );

  return port;
}

//
// queue a message from the sender to `to` and deliver it
//
// eslint-disable-next-line max-params
async function queueAndProcess(t, sender, port, to, options = {}) {
  const email = await Emails.queue({
    message: {
      envelope: {
        from: `${sender.alias.name}@${sender.domain.name}`,
        to: [to]
      },
      raw: `
To: ${to}
From: Test <${sender.alias.name}@${sender.domain.name}>
Subject: testing reputation
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
    },
    alias: options.catchall ? undefined : sender.alias,
    domain: sender.domain,
    user: sender.user,
    ...options
  });
  await processEmail({
    email: await Emails.findById(email._id).lean().exec(),
    port,
    resolver: sender.resolver,
    client: t.context.client
  });
}

test.serial(
  'verdicts about bounces and auto-replies we send do not count',
  async (t) => {
    // a bounce notification or an auto-reply
    {
      const sender = await createSender(t);
      const port = await useSpamRejectingTruthSource(t, sender.resolver);
      await queueAndProcess(t, sender, port, 'victim@gmail.com', {
        is_bounce: true
      });
      const user = await getUser(sender.user);
      t.deepEqual(user[config.userFields.smtpReputationReports] || [], []);
    }

    // (while delivery status notifications for mail the sender submitted,
    // to a return address the sender chose, do)
    {
      const sender = await createSender(t);
      const port = await useSpamRejectingTruthSource(t, sender.resolver);
      await queueAndProcess(t, sender, port, 'victim@gmail.com', {
        is_bounce: true,
        is_dsn: true
      });
      const user = await getUser(sender.user);
      t.is(user[config.userFields.smtpReputationReports].length, 1);
    }

    // (as does mail the sender sent)
    const sender = await createSender(t);
    const port = await useSpamRejectingTruthSource(t, sender.resolver);
    await queueAndProcess(t, sender, port, 'someone@gmail.com');
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationReports].length, 1);
    t.is(
      user[config.userFields.smtpReputationReports][0].recipient,
      'someone@gmail.com'
    );
  }
);

test.serial(
  'automatic suspensions do not count against reputation on their own',
  async (t) => {
    // (an alias is suspended after the first verdict here)
    useConfig(t, 'smtpSpamSuspensionSpamThreshold', 1);
    useConfig(t, 'smtpSpamSuspensionMinUniqueRecipients', 1);
    const sender = await createSender(t);
    await setReputation(sender.user, 3, 2);
    const port = await useSpamRejectingTruthSource(t, sender.resolver);
    await queueAndProcess(t, sender, port, 'someone@gmail.com');

    const alias = await Aliases.findById(sender.alias._id).lean().exec();
    t.true(alias.is_smtp_suspended);

    // (only the verdict itself is recorded, and one is not a bad day)
    let user = await getUser(sender.user);
    t.deepEqual(
      user[config.userFields.smtpReputationReports].map((r) => r.category),
      ['spam']
    );
    await Users.collection.updateOne(
      { _id: sender.user._id },
      {
        $set: {
          [`${config.userFields.smtpReputationReports}.$[].date`]: yesterday()
        }
      }
    );
    await recordSent(sender, 50, yesterday());
    await updateSmtpReputation(yesterday());
    user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 3);
  }
);

test.serial(
  'reports from company tenants alone do not reset a sender',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 3);
    const report = (recipient) =>
      recordSmtpReputationReport({
        Users,
        user: sender.user,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient,
        truthSource: 'google.com',
        category: 'spam'
      });

    // (e.g. tenants whose admins reject every reply to them as spam)
    t.false(await report('someone@tenant-one.example'));
    t.false(await report('someone@tenant-two.example'));
    t.false(await report('someone@tenant-three.example'));
    const before = await getUser(sender.user);
    t.is(before[config.userFields.smtpReputationTier], 3);

    // (they make up at most half of the reports needed, so with one report
    // from a consumer domain they still do not)
    t.false(await report('someone@gmail.com'));
    const after = await getUser(sender.user);
    t.is(after[config.userFields.smtpReputationTier], 3);
    // with enough reports from consumer domains they do
    t.true(await report('another@gmail.com'));
    assertReset(t, await getUser(sender.user));

    // the job treats them the same way: tenants alone are not a bad day
    // (e.g. a company that subscribed two of its domains to a newsletter to
    // demote its sender every day)
    const tenants = [
      'a@tenant-one.example',
      'b@tenant-two.example',
      'c@tenant-three.example'
    ];
    const other = await createSender(t);
    await setReputation(other.user, 3);
    await recordSent(other, 50, yesterday());
    for (const recipient of tenants)
      await recordReport(other.user, recipient, yesterday());
    await updateSmtpReputation(yesterday());
    let user = await getUser(other.user);
    t.is(user[config.userFields.smtpReputationTier], 3);

    // (and with a report from a consumer domain they are a bad day, not a
    // reset)
    const third = await createSender(t);
    await setReputation(third.user, 3);
    await recordSent(third, 50, yesterday());
    for (const recipient of [...tenants, 'd@gmail.com'])
      await recordReport(third.user, recipient, yesterday());
    await updateSmtpReputation(yesterday());
    user = await getUser(third.user);
    t.is(user[config.userFields.smtpReputationTier], 2);
    t.falsy(user[config.userFields.smtpReputationHoldUntil]);
  }
);

test.serial(
  "reports about members count as a rate of the members' sending for the admin",
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const admin = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    await setReputation(admin, 3, 2);
    await addMember(sender.domain, admin);
    const domain = await Domains.findById(sender.domain._id).lean().exec();

    // the member sent to many recipients recently
    await t.context.client.set(
      getRecipientsHourKey(sender.user._id, new Date()),
      '10000',
      'PX',
      60_000
    );
    const { badDay } = recordSmtpReputationReport.getReportThresholds(10_000);
    for (let i = 0; i < badDay - 1; i++)
      await recordSmtpReputationReport({
        Users,
        client: t.context.client,
        user: sender.user,
        domain,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient: `someone${i}@gmail.com`,
        truthSource: 'google.com',
        category: 'spam'
      });

    let after = await getUser(admin);
    const reports = after[config.userFields.smtpReputationReports];
    t.is(reports.length, badDay - 1);
    t.true(reports.every((report) => report.sender_recipients === 10_000));

    // (fewer than the bad day rate of the member's sending is not a bad day
    // for the admin, whatever the admin sent themselves)
    await Users.collection.updateOne(
      { _id: admin._id },
      {
        $set: {
          [`${config.userFields.smtpReputationReports}.$[].date`]: yesterday()
        }
      }
    );
    await updateSmtpReputation(yesterday());
    after = await getUser(admin);
    t.is(after[config.userFields.smtpReputationTier], 3);
  }
);

//
// evaluate only yesterday next time the job runs for a user
//
async function evaluatedUntilTheDayBefore(user) {
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        [config.userFields.smtpReputationEvaluatedAt]: dayjs
          .utc(yesterday())
          .subtract(1, 'day')
          .startOf('day')
          .toDate()
      }
    }
  );
}

test.serial(
  'bounces of scheduled messages count on the day they were due',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 2, 2);
    await evaluatedUntilTheDayBefore(sender.user);

    // submitted days earlier, scheduled for yesterday, and bounced
    const bad = Math.ceil(
      config.smtpReputationMinSample * config.smtpReputationMaxBadRate
    );
    await recordSent(sender, config.smtpReputationMinSample - bad, yesterday());
    await recordSent(
      sender,
      bad,
      dayjs(yesterday()).subtract(4, 'day').toDate(),
      {
        status: 'bounced',
        date: yesterday()
      }
    );

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 1);
    t.is(user[config.userFields.smtpReputationCleanDays], 0);
  }
);

test.serial(
  'recipients already rejected on messages still being retried count',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 2, 2);
    const bad = Math.ceil(
      config.smtpReputationMinSample * config.smtpReputationMaxBadRate
    );
    await recordSent(sender, config.smtpReputationMinSample - bad, yesterday());
    // (one recipient was rejected, another is still being retried)
    const docs = [];
    for (let i = 0; i < bad; i++) {
      const _id = new mongoose.Types.ObjectId();
      docs.push({
        _id,
        id: _id.toString(),
        user: sender.user._id,
        domain: sender.domain._id,
        alias: sender.alias._id,
        status: 'deferred',
        is_bounce: false,
        is_locked: false,
        envelope: {
          from: `${sender.alias.name}@${sender.domain.name}`,
          to: [`gone${i}@retried.example`, `later${i}@retried.example`]
        },
        accepted: [],
        rejectedErrors: [
          {
            recipient: `gone${i}@retried.example`,
            responseCode: 550,
            response: '550 5.1.1 User unknown',
            bounceInfo: { category: 'recipient', action: 'reject' }
          },
          {
            recipient: `later${i}@retried.example`,
            responseCode: 421,
            response: '421 Try again later',
            bounceInfo: { category: 'network', action: 'defer' }
          }
        ],
        date: yesterday(),
        created_at: yesterday(),
        updated_at: yesterday()
      });
    }

    await Emails.collection.insertMany(docs);

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 1);
  }
);

test.serial(
  'repeating mail to one address does not dilute a bounce rate',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 2, 2);
    const bad = Math.ceil(
      config.smtpReputationMinSample * config.smtpReputationMaxBadRate
    );
    await recordSent(
      sender,
      config.smtpReputationMinSample - bad - 1,
      yesterday()
    );
    await recordSent(sender, bad, yesterday(), 'bounced');
    // (many messages to one mailbox, in its variants)
    await recordSent(sender, 500, yesterday(), {
      to: (i) => `sink+${i}@gmail.com`
    });

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 1);
  }
);

test.serial(
  'rejections for our shared IP addresses do not count against a sender',
  async (t) => {
    const errors = [
      {
        responseCode: 550,
        response: '550 5.7.1 Service unavailable, Client host blocked',
        bounceInfo: { category: 'blocklist', action: 'reject' }
      },
      {
        responseCode: 550,
        response: '550 5.7.1 Mail from IP address rejected as spam',
        bounceInfo: {
          category: 'spam',
          action: 'reject',
          message: 'Sending IP is listed'
        }
      },
      {
        // (the recipient's server kept deferring until we gave up)
        responseCode: 550,
        maxRetryDuration: true,
        bounceInfo: { category: 'other', action: 'reject' }
      }
    ];
    for (const error of errors) {
      const sender = await createSender(t);
      await setReputation(sender.user, 2, 2);
      await recordSent(sender, config.smtpReputationMinSample, yesterday(), {
        status: 'bounced',
        error
      });
      await updateSmtpReputation(yesterday());
      const user = await getUser(sender.user);
      t.is(user[config.userFields.smtpReputationTier], 2);
    }

    // (nor do they slow sending down)
    const recent = dayjs().subtract(30, 'minute').toDate();
    const sender = await createSender(t);
    await recordSent(sender, config.smtpVelocityBounceMinSample, recent, {
      status: 'bounced',
      error: errors[0]
    });
    await assertAccepted(t, sender);
  }
);

test.serial(
  'a return address on another domain does not hide bounces',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 2, 2);
    const bad = Math.ceil(
      config.smtpReputationMinSample * config.smtpReputationMaxBadRate
    );
    await recordSent(
      sender,
      config.smtpReputationMinSample - bad,
      yesterday(),
      {
        to: (i) => `person${i}@gmail.com`
      }
    );
    await recordSent(sender, bad, yesterday(), {
      status: 'bounced',
      to: (i) => `gone${i}@gmail.com`
    });
    // (a message submitted with a return address on gmail.com)
    await Emails.collection.updateOne(
      { user: sender.user._id },
      { $set: { 'envelope.from': 'anyone@gmail.com' } }
    );

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 1);
  }
);

test.serial(
  "a provider's other domains for one mailbox count once",
  async (t) => {
    const same = [
      ['john.smith+a@googlemail.com', 'johnsmith@gmail.com'],
      ['jane@me.com', 'jane@icloud.com'],
      ['jane@mac.com', 'jane@icloud.com'],
      ['bob@pm.me', 'bob@proton.me'],
      ['bob@protonmail.com', 'bob@proton.me'],
      ['ivan@ya.ru', 'ivan@yandex.ru'],
      ['ivan@yandex.com', 'ivan@yandex.ru'],
      ['base-shopping@yahoo.com', 'base@yahoo.com'],
      ['other-name@example.com', 'other-name@example.com']
    ];
    for (const [address, expected] of same)
      t.is(normalizeRecipient(address), expected);

    // (and the job normalizes them the same way)
    const results = await mongoose.connection.db
      .aggregate([
        { $documents: same.map(([address]) => ({ address })) },
        {
          $project: {
            normalized: normalizeRecipientExpression('$address')
          }
        }
      ])
      .toArray();
    t.deepEqual(
      results.map((r) => r.normalized),
      same.map(([, expected]) => expected)
    );
  }
);

test.serial(
  'free co-admins cannot split an account into one threshold per domain',
  async (t) => {
    // (created first, so it has the lower id)
    const free = await createSender(t);
    const owner = await createSender(t);
    await Users.collection.updateOne(
      { _id: free.user._id },
      { $set: { plan: 'free' } }
    );
    await addMember(free.domain, owner.user);

    // the account used up its threshold on its own domain
    await recordSent(owner, BASE, new Date());

    await assertDeferred(t, free);
  }
);

test.serial(
  "system admins and banned users do not raise a team domain's threshold",
  async (t) => {
    for (const state of [
      { group: 'admin' },
      { [config.userFields.isBanned]: true }
    ]) {
      const sender = await createSender(t, {}, { plan: 'team' });
      await setBaseline(sender.user, TIERS[4].limit);
      const other = await t.context.userFactory
        .withState({
          plan: 'team',
          [config.userFields.smtpLimit]: TIERS[4].limit
        })
        .create();
      await Users.collection.updateOne({ _id: other._id }, { $set: state });
      await addMember(sender.domain, other);

      await recordSent(sender, config.smtpTeamLimitMessages, new Date());
      await assertDeferred(t, sender);
    }
  }
);

test.serial(
  'a new domain keeps its starting threshold while its history is computed',
  async (t) => {
    const sender = await createSender(t, {}, {}, { ramp: true });
    await setReputation(sender.user, 2);
    await setBaseline(sender.user, TIERS[2].limit);

    // (another message is computing the domain's history)
    await t.context.client.set(
      `${config.smtpLimitNamespace}:daily_counts_lock:${sender.domain._id}`,
      '1',
      'PX',
      60_000
    );
    await recordSent(sender, BASE, new Date());
    await assertDeferred(t, sender);
  }
);

test.serial(
  'messages submitted at once cannot pass the unusual volume limit',
  async (t) => {
    // (a threshold well above the volume a sender not measured yet can send)
    const sender = await createSender(t);
    await setReputation(sender.user, 3);
    const left = 2;
    await recordSent(sender, BASE - left, new Date());

    const post = () =>
      t.context.api
        .post('/v1/emails')
        .auth(sender.user[config.userFields.apiToken])
        .set('Accept', 'application/json')
        .send({
          raw: `
To: test@foo.com
From: Test <${sender.alias.name}@${sender.domain.name}>
Subject: testing reputation
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
        });

    const results = await Promise.all(Array.from({ length: 6 }, () => post()));
    t.is(results.filter((res) => res.status === 200).length, left);
    t.is(results.filter((res) => res.status === 429).length, 6 - left);
  }
);

test.serial(
  'a recent passing check does not skip the hourly limit',
  async (t) => {
    useConfig(
      t,
      'smtpVelocityHourlyShare',
      VELOCITY_DEFAULTS.smtpVelocityHourlyShare
    );
    const sender = await createSender(t);
    await setReputation(sender.user, 2);
    await setBaseline(sender.user, TIERS[2].limit);
    await assertAccepted(t, sender);

    // (the rest of this hour's allowance was sent since the check passed)
    const now = new Date();
    await t.context.client.set(
      `${config.smtpLimitNamespace}:reserved:hour:${sender.user._id}:${now
        .toISOString()
        .slice(0, 13)}`,
      String(TIERS[2].limit),
      'PX',
      60_000
    );
    await assertSlowedDown(t, sender);
  }
);

test.serial(
  'restricted senders are held to the recipients limit',
  async (t) => {
    const sender = await createSender(t, {
      [config.userFields.smtpLimit]: 10
    });
    const recipientsLimit = 10 * config.smtpVelocityRecipientsMultiplier;
    const err = await t.throwsAsync(
      send(
        sender,
        Array.from(
          { length: recipientsLimit + 1 },
          (_, i) => `test${i}@foo.com`
        )
      )
    );
    t.is(err.responseCode, 550);
    t.regex(err.response, /Too many recipients/);
  }
);

test.serial(
  'auto-replies and bounces to other domains are capped per sender',
  async (t) => {
    const { client } = t.context;

    // (an admin restricted this sender below the cap)
    const restricted = await createSender(t, {
      [config.userFields.smtpLimit]: 10
    });
    const results = [];
    for (let i = 0; i < 12; i++)
      results.push(await reserveAutoReply(client, restricted.user._id));
    t.is(results.filter(Boolean).length, 10);

    // (without Redis none are sent)
    const sender = await createSender(t);
    t.false(await reserveAutoReply(null, sender.user._id));

    // bounce notifications to domains the sender is a member of are not
    // capped, and to any other return address they are (at least the
    // auto-reply limit, here the restriction)
    const other = await t.context.domainFactory
      .withState({
        members: [{ user: restricted.user._id, group: 'admin' }],
        plan: 'enhanced_protection',
        has_smtp: true
      })
      .create();
    const bounce = (from) =>
      canSendBounceTo({
        client,
        domain: restricted.domain,
        email: { user: restricted.user._id, envelope: { from } }
      });
    for (let i = 0; i < 12; i++) {
      t.is(await bounce(`me@${restricted.domain.name}`), 'own');
      t.is(await bounce(`bounces@sub.${other.name}`), 'own');
    }

    const external = [];
    for (let i = 0; i < 12; i++)
      external.push(await bounce('victim@gmail.com'));
    t.is(external.filter(Boolean).length, 10);

    // (a large sender gets a share of their threshold)
    t.is(
      getBounceNotificationLimit({
        plan: 'enhanced_protection',
        [config.userFields.smtpReputationTier]: TIERS.length - 1
      }),
      Math.ceil(
        TIERS.at(-1).limit *
          config.smtpReputationMaxBadRate *
          config.smtpReputationSevereBadRateMultiplier
      )
    );
  }
);

test.serial(
  'the most recipient domains shown are from any recent day',
  async (t) => {
    const sender = await createSender(t);
    // a big day to few domains, and a smaller one to more domains
    await recordSent(sender, 60, yesterday(), {
      to: (i) => `user${i}@${i % 2 ? 'one' : 'two'}.example`
    });
    await recordSent(sender, 8, dayjs(yesterday()).subtract(1, 'day').toDate());

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationPeak], 60);
    t.is(user[config.userFields.smtpReputationPeakDomains], 8);
  }
);

test.serial(
  'reports are kept once per recipient a day, so they cannot be flushed',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 3);
    const report = (recipient) =>
      recordSmtpReputationReport({
        Users,
        user: sender.user,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient,
        truthSource: 'google.com',
        category: 'spam'
      });

    await report('someone@gmail.com');
    // (many variants of addresses at one company tenant)
    for (let i = 0; i < 250; i++) await report(`trap+${i}@tenant.example`);

    const user = await getUser(sender.user);
    t.deepEqual(
      user[config.userFields.smtpReputationReports].map((r) => r.recipient),
      ['someone@gmail.com', 'trap+0@tenant.example']
    );
  }
);

test.serial(
  'recipients outside the domain are counted per hour for report rates',
  async (t) => {
    const sender = await createSender(t);
    await send(sender, [
      'someone@foo.com',
      'other@bar.com',
      `me@${sender.domain.name}`
    ]);
    t.is(
      Number(
        await t.context.client.get(
          getRecipientsHourKey(sender.user._id, new Date())
        )
      ),
      2
    );
  }
);

test.serial(
  "an account's senders together are held to its recipients limit",
  async (t) => {
    const sender = await createSender(t);
    // (the account's other senders reached the account's recipients today)
    await t.context.client.set(
      `${config.smtpLimitNamespace}:velocity_rcpt:account:${
        sender.user._id
      }:${getSmtpDayKey()}`,
      String(BASE * config.smtpVelocityRecipientsMultiplier),
      'PX',
      60_000
    );
    await assertSlowedDown(t, sender);
  }
);

test.serial('auto-replies are capped per recipient and per user', async (t) => {
  const { client } = t.context;
  useConfig(t, 'smtpAutoReplyDailyLimitPerRecipient', 2);
  const sender = await createSender(t, { [config.userFields.smtpLimit]: 10 });
  const other = await createSender(t);

  // (variants of one mailbox share its cap)
  t.true(
    await reserveAutoReplyFor({
      client,
      userId: sender.user._id,
      to: 'Victim@Gmail.com'
    })
  );
  t.true(
    await reserveAutoReplyFor({
      client,
      userId: other.user._id,
      to: 'v.i.c.t.i.m+x@gmail.com'
    })
  );
  t.false(
    await reserveAutoReplyFor({
      client,
      userId: other.user._id,
      to: 'victim@googlemail.com'
    })
  );

  // a user at their own cap does not use up a recipient's
  const results = [];
  for (let i = 0; i < 10; i++)
    results.push(
      await reserveAutoReplyFor({
        client,
        userId: sender.user._id,
        to: `person${i}@example.org`
      })
    );
  t.is(results.filter(Boolean).length, 9);
  t.false(
    await reserveAutoReplyFor({
      client,
      userId: sender.user._id,
      to: 'fresh@example.org'
    })
  );
  t.true(
    await reserveAutoReplyFor({
      client,
      userId: other.user._id,
      to: 'fresh@example.org'
    })
  );
});

test.serial(
  'auto-replies only go to the authenticated address that was addressed',
  (t) => {
    const headers = (lines) => ({
      get: (key) =>
        lines.filter((line) =>
          line.toLowerCase().startsWith(`${key.toLowerCase()}:`)
        )
    });

    // (IDN domains, case and tags do not matter)
    t.true(
      isAddressedTo(headers(['To: Bob+x@xn--mnchen-3ya.de']), 'bob@münchen.de')
    );
    t.false(isAddressedTo(headers(['To: other@münchen.de']), 'bob@münchen.de'));
    // (a huge header is only read up to a limit)
    t.false(
      isAddressedTo(
        headers([`To: ${'x@y.com, '.repeat(20_000)}bob@münchen.de`]),
        'bob@münchen.de'
      )
    );

    // (addresses in a group, and raw UTF-8 headers)
    t.true(
      isAddressedTo(
        headers(['To: undisclosed: a@b.com, bob@example.com;']),
        'bob@example.com'
      )
    );
    t.true(
      isAddressedTo(
        headers([
          `To: ${Buffer.from('bob@münchen.de', 'utf8').toString('binary')}`
        ]),
        'bob@münchen.de'
      )
    );
    // (a catch-all is never addressed explicitly)
    t.false(isAddressedTo(headers(['To: bob@example.com']), '*@example.com'));

    const session = {
      originalFromAddress: 'bob@sender.net',
      dmarc: { status: { result: 'pass', header: { from: 'sender.net' } } },
      spfFromHeader: { status: { result: 'none' } }
    };
    t.true(isAuthenticatedSender(session));
    // (SPF alone is not enough, since shared mail servers pass it for anyone)
    t.false(
      isAuthenticatedSender({
        originalFromAddress: 'bob@sender.net',
        spfFromHeader: { status: { result: 'pass' } }
      })
    );
    // (an address unwrapped from SRS in the From header on another domain)
    t.false(
      isAuthenticatedSender({
        ...session,
        originalFromAddress: 'victim@elsewhere.net'
      })
    );
    t.false(
      isAuthenticatedSender({
        ...session,
        dmarc: { status: { result: 'fail', header: { from: 'sender.net' } } }
      })
    );
  }
);

test.serial(
  'bounce notifications are only exempt for domains the sender is an admin of',
  async (t) => {
    const { client } = t.context;
    useConfig(t, 'smtpAutoReplyDailyLimit', 1);
    const sender = await createSender(t, { [config.userFields.smtpLimit]: 10 });
    // (a shared domain where the sender is only a member)
    const owner = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    const shared = await t.context.domainFactory
      .withState({
        members: [
          { user: owner._id, group: 'admin' },
          { user: sender.user._id, group: 'user' }
        ],
        plan: 'team',
        has_smtp: true
      })
      .create();
    const bounce = () =>
      canSendBounceTo({
        client,
        domain: sender.domain,
        email: {
          user: sender.user._id,
          envelope: { from: `someone@${shared.name}` }
        }
      });
    const limit = getBounceNotificationLimit(await getUser(sender.user));
    // (and only include the original message's headers)
    for (let i = 0; i < limit; i++) t.is(await bounce(), 'external');
    t.false(await bounce());
  }
);

test.serial(
  "reports about many members at the reset rate pause the admin's lending",
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    await setBaseline(sender.user, TIERS[4].limit);
    const admin = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    await setReputation(admin, 4);
    await addMember(sender.domain, admin);
    // (another member, e.g. added to spend the admin's threshold too)
    const other = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    await addMember(sender.domain, other, 'user');
    const domain = await Domains.findById(sender.domain._id).lean().exec();

    // (the member sends on the admin's threshold)
    await recordSent(sender, config.smtpTeamLimitMessages, new Date());
    await assertAccepted(t, sender);

    // fewer reports about each member than resets them, but enough together
    const { reset } = recordSmtpReputationReport.getReportThresholds(0);
    for (let i = 0; i < reset; i++)
      await recordSmtpReputationReport({
        Users,
        client: t.context.client,
        user: i === 0 ? other : sender.user,
        domain,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient: `someone${i}@gmail.com`,
        truthSource: 'google.com',
        category: 'spam'
      });

    const member = await getUser(sender.user);
    t.falsy(member[config.userFields.smtpReputationHoldUntil]);
    const after = await getUser(admin);
    t.is(after[config.userFields.smtpReputationTier], 4);
    t.true(
      after[config.userFields.smtpReputationLendHoldUntil] > new Date(),
      'the admin no longer lends their threshold'
    );
    t.false(getUserSmtpLimit.canLendSmtpLimit(after));
    await assertDeferred(t, sender);
  }
);

test.serial(
  "reports about members cannot push out an admin's own reports",
  async (t) => {
    const sender = await createSender(t, {}, { plan: 'team' });
    const admin = await t.context.userFactory
      .withState({ plan: 'team' })
      .create();
    // (whose threshold the member borrows)
    await setReputation(admin, 4);
    await addMember(sender.domain, admin);
    const domain = await Domains.findById(sender.domain._id).lean().exec();
    await recordReport(admin, 'own@gmail.com', new Date());

    for (let i = 0; i < 250; i++)
      await recordSmtpReputationReport({
        Users,
        user: sender.user,
        domain,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient: `someone${i}@tenant${i}.example`,
        truthSource: 'google.com',
        category: 'spam'
      });

    const after = await getUser(admin);
    const reports = after[config.userFields.smtpReputationReports];
    t.true(reports.some((report) => report.recipient === 'own@gmail.com'));
    const borrowed = reports.filter((report) => report.borrowed).length;
    t.true(borrowed > 0 && borrowed < 200);
  }
);

test.serial(
  'an approved minimum still applies on hold after a severe bounce rate',
  async (t) => {
    const sender = await createSender(t, {
      [config.userFields.smtpLimit]: BASE * 3
    });
    await setReputation(sender.user, 3, 2);
    const total = config.smtpReputationMinSample * 2;
    const bad = Math.ceil(
      total *
        config.smtpReputationMaxBadRate *
        config.smtpReputationSevereBadRateMultiplier
    );
    await recordSent(sender, total - bad, yesterday());
    await recordSent(sender, bad, yesterday(), 'bounced');
    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    assertReset(t, user);
    t.is(user[config.userFields.smtpReputationHoldReason], 'bounces');

    // (without the recent bounces, which slow sending down on their own)
    await Emails.deleteMany({ user: sender.user._id });
    await setBaseline(sender.user, BASE * 3);
    await recordSent(sender, BASE, new Date());
    await assertAccepted(t, sender);
  }
);

test.serial(
  'a message checked just before midnight counts toward that day',
  async (t) => {
    const sender = await createSender(t);
    await setBaseline(sender.user, BASE);
    const user = await Users.findById(sender.user._id).lean().exec();
    // (the counts were read on the last millisecond of yesterday)
    const now = dayjs.utc().startOf('day').subtract(1, 'ms').toDate();
    await checkSmtpVelocity({
      user,
      domain: sender.domain,
      dailyLimit: BASE,
      todayCount: BASE - 1,
      Emails,
      Users,
      client: t.context.client,
      now
    });
    const reserved = await t.context.client.get(
      `${config.smtpLimitNamespace}:reserved:user:${
        sender.user._id
      }:${getSmtpDayKey(now)}`
    );
    t.is(Number(reserved), BASE);

    // (so it does not use up today's threshold)
    await assertAccepted(t, sender);
  }
);

test.serial(
  'recipients on an internationalized sending domain are not external',
  (t) => {
    t.is(
      countExternalRecipients(
        ['a@xn--mnchen-3ya.de', 'b@sub.xn--mnchen-3ya.de', 'c@gmail.com'],
        { name: 'münchen.de' }
      ),
      1
    );
  }
);

test.serial(
  'an admin whose lending is paused still holds their domains to their threshold',
  async (t) => {
    const lendHold = {
      [config.userFields.smtpReputationLendHoldUntil]: dayjs()
        .add(10, 'day')
        .toDate()
    };

    // the account used up its threshold on its own domain today
    const owner = await createSender(t, {}, { plan: 'team' });
    await setReputation(owner.user, 1);
    await setBaseline(owner.user, TIERS[1].limit);
    await recordSent(owner, TIERS[1].limit, new Date());
    await Users.collection.updateOne(
      { _id: owner.user._id },
      { $set: lendHold }
    );

    // a member of the account's other Team plan domain cannot send on a
    // threshold of their own
    const member = await createSender(t, {}, { plan: 'team' });
    await Domains.collection.updateOne(
      { _id: member.domain._id },
      {
        $set: {
          members: [
            {
              _id: new mongoose.Types.ObjectId(),
              user: owner.user._id,
              group: 'admin'
            },
            {
              _id: new mongoose.Types.ObjectId(),
              user: member.user._id,
              group: 'user'
            }
          ]
        }
      }
    );
    await assertDeferred(t, member);

    // while the admin's own sending keeps their threshold
    const admin = await createSender(t, {}, { plan: 'team' });
    await setReputation(admin.user, 4);
    await setBaseline(admin.user, TIERS[4].limit);
    await recordSent(admin, config.smtpTeamLimitMessages, new Date());
    await Users.collection.updateOne(
      { _id: admin.user._id },
      { $set: lendHold }
    );
    await assertAccepted(t, admin);
  }
);

test.serial(
  'members can only send as their own aliases over the API',
  async (t) => {
    const owner = await createSender(t, {}, { plan: 'team' });
    const member = await t.context.userFactory
      .withState({
        plan: 'team',
        [config.userFields.hasVerifiedEmail]: true
      })
      .create();
    await addMember(owner.domain, member, 'user');
    const alias = await t.context.aliasFactory
      .withState({
        user: member._id,
        domain: owner.domain._id,
        recipients: [member.email]
      })
      .create();
    const post = (from) =>
      t.context.api
        .post('/v1/emails')
        .auth(member[config.userFields.apiToken])
        .set('Accept', 'application/json')
        .send({
          from,
          to: 'test@foo.com',
          subject: 'testing reputation',
          text: 'Test'
        });

    // (another member's address, or one that is not an alias, so its limit
    // cannot be sidestepped)
    for (const name of [owner.alias.name, 'not-an-alias']) {
      const res = await post(`${name}@${owner.domain.name}`);
      t.is(res.status, 403);
    }

    // (their own alias, also with a "+" tag)
    for (const from of [
      `${alias.name}@${owner.domain.name}`,
      `${alias.name}+news@${owner.domain.name}`
    ]) {
      const res = await post(from);
      t.is(res.status, 200);
    }
  }
);

test.serial(
  'messages cannot be scheduled past when their outcomes are evaluated',
  async (t) => {
    const sender = await createSender(t);
    const post = (days) =>
      t.context.api
        .post('/v1/emails')
        .auth(sender.user[config.userFields.apiToken])
        .set('Accept', 'application/json')
        .send({
          from: `${sender.alias.name}@${sender.domain.name}`,
          to: 'test@foo.com',
          subject: 'testing reputation',
          text: 'Test',
          date: dayjs().add(days, 'day').toDate().toUTCString()
        });

    // (messages are kept 30 days, and a day's outcomes are evaluated two
    // days later)
    const late = await post(28);
    t.is(late.status, 400);
    const ok = await post(26);
    t.is(ok.status, 200);
  }
);

test.serial(
  'recipients already delivered on messages still being retried count',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 2, 2);
    // (each message was delivered to most recipients, rejected by one and is
    // still being retried for another)
    const docs = [];
    for (let i = 0; i < config.smtpReputationMinSample; i++) {
      const _id = new mongoose.Types.ObjectId();
      const accepted = Array.from(
        { length: 20 },
        (_, j) => `person${i}-${j}@delivered.example`
      );
      docs.push({
        _id,
        id: _id.toString(),
        user: sender.user._id,
        domain: sender.domain._id,
        alias: sender.alias._id,
        status: 'deferred',
        is_bounce: false,
        is_locked: false,
        envelope: {
          from: `${sender.alias.name}@${sender.domain.name}`,
          to: [
            ...accepted,
            `gone${i}@retried.example`,
            `later${i}@down.example`
          ]
        },
        accepted,
        rejectedErrors: [
          {
            recipient: `gone${i}@retried.example`,
            responseCode: 550,
            response: '550 5.1.1 User unknown',
            bounceInfo: { category: 'recipient', action: 'reject' }
          },
          {
            recipient: `later${i}@down.example`,
            responseCode: 421,
            response: '421 Try again later',
            bounceInfo: { category: 'network', action: 'defer' }
          }
        ],
        date: yesterday(),
        created_at: yesterday(),
        updated_at: yesterday()
      });
    }

    await Emails.collection.insertMany(docs);

    // (under 5% were rejected)
    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 2);
    t.falsy(user[config.userFields.smtpReputationHoldUntil]);
  }
);

test.serial(
  'a bounce to an SRS return address counts where it is delivered',
  async (t) => {
    const { SRS } = require('sender-rewriting-scheme');
    useConfig(t, 'smtpAutoReplyDailyLimit', 1);
    const sender = await createSender(t, { [config.userFields.smtpLimit]: 10 });
    // (a return address on the sender's domain that unwraps to a victim)
    const from = new SRS(config.srs).forward(
      'victim@example.org',
      sender.domain.name
    );
    const bounce = () =>
      canSendBounceTo({
        client: t.context.client,
        domain: sender.domain,
        email: { user: sender.user._id, envelope: { from } }
      });
    const limit = getBounceNotificationLimit(await getUser(sender.user));
    for (let i = 0; i < limit; i++) t.is(await bounce(), 'external');
    t.false(await bounce());
  }
);

test.serial('a huge recipient header is read quickly', (t) => {
  const headers = (lines) => ({
    get: (key) =>
      lines.filter((line) =>
        line.toLowerCase().startsWith(`${key.toLowerCase()}:`)
      )
  });
  for (const filler of [' ', ' \r\n ']) {
    const started = Date.now();
    t.false(
      isAddressedTo(
        headers([`To: ${filler.repeat(Math.ceil(65_536 / filler.length))}`]),
        'bob@example.com'
      )
    );
    t.true(Date.now() - started < 1000);
  }
});

test.serial(
  'vacation responses are for mail to an address on the domain',
  (t) => {
    const headers = (lines) => ({
      get: (key) =>
        lines.filter((line) =>
          line.toLowerCase().startsWith(`${key.toLowerCase()}:`)
        )
    });
    // (e.g. another alias on the domain that forwards to the alias)
    t.true(
      isAddressedToDomain(
        headers(['To: Info <info@xn--mnchen-3ya.de>']),
        'münchen.de'
      )
    );
    t.false(
      isAddressedToDomain(headers(['To: info@sub.example.com']), 'example.com')
    );
    t.false(
      isAddressedToDomain(headers(['To: list@other.example']), 'example.com')
    );
  }
);

test.serial(
  'a domain with an admin that no longer exists is not a system domain',
  async (t) => {
    const getSmtpSendingLimits = require('#helpers/get-smtp-sending-limits');
    const system = await t.context.userFactory
      .withState({ plan: 'team', group: 'admin' })
      .create();
    const domain = {
      _id: new mongoose.Types.ObjectId(),
      name: 'example.com',
      plan: 'team',
      // (as populated, with a deleted admin left empty)
      members: [
        { user: { _id: system._id, group: 'admin' }, group: 'admin' },
        { user: null, group: 'admin' }
      ]
    };
    const limits = await getSmtpSendingLimits({
      user: await getUser(system),
      domain,
      Users,
      Domains,
      Emails
    });
    t.falsy(limits.isExempt);
  }
);

test.serial('concurrent messages cannot pass an alias limit', async (t) => {
  const sender = await createSender(t);
  await setReputation(sender.user, 2);
  await setBaseline(sender.user, TIERS[2].limit);
  await Aliases.collection.updateOne(
    { _id: sender.alias._id },
    { $set: { smtp_limit: 3 } }
  );
  const post = () =>
    t.context.api
      .post('/v1/emails')
      .auth(sender.user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send({
        from: `${sender.alias.name}@${sender.domain.name}`,
        to: 'test@foo.com',
        subject: 'testing reputation',
        text: 'Test'
      });

  const results = await Promise.all(Array.from({ length: 8 }, () => post()));
  t.is(results.filter((res) => res.status === 200).length, 3);

  // (and over SMTP, for a message refused by another limit, the alias's
  // reservation is released)
  const other = await createSender(t);
  await Aliases.collection.updateOne(
    { _id: other.alias._id },
    { $set: { smtp_limit: 3 } }
  );
  await recordSent(other, BASE, new Date());
  await assertDeferred(t, other);
  const reserved = await t.context.client.get(
    `${config.smtpLimitNamespace}:reserved:alias:${
      other.alias._id
    }:${getSmtpDayKey()}`
  );
  t.is(Number(reserved || 0), 0);
});

test.serial(
  'bounces to other domains only include identifying headers',
  async (t) => {
    const getStream = require('get-stream');
    const createBounce = require('#helpers/create-bounce');
    const createDSNSuccess = require('#helpers/create-dsn-success');
    const raw = [
      'From: me@example.com',
      'To: gone@example.org',
      'Subject: héllo',
      'X-Pitch: buy now at https://spam.example',
      'Message-ID: <abc@example.com>',
      '',
      'Buy now at https://spam.example'
    ].join('\r\n');
    const email = {
      id: 'abc',
      messageId: 'abc@example.com',
      envelope: { from: 'victim@example.net', to: ['gone@example.org'] },
      date: new Date(),
      raw,
      dsn: { return: 'full', minimal: true }
    };
    const response = `550 5.1.1 ${'visit https://spam.example '.repeat(40)}`;
    const bounce = String(
      await getStream.buffer(
        await createBounce(
          email,
          {
            recipient: 'gone@example.org',
            responseCode: 550,
            response,
            date: new Date()
          },
          raw
        )
      )
    );
    const success = String(
      await getStream.buffer(
        await createDSNSuccess(email, 'gone@example.org', new Date(), {
          info: { response: response.replace('550 5.1.1', '250 2.0.0') }
        })
      )
    );
    for (const message of [bounce, success]) {
      // (raw UTF-8 headers are kept as they were, not encoded twice)
      t.regex(message, /Subject: h(é|=C3=A9)llo/);
      t.notRegex(message, /=C3=83/);
      t.notRegex(message, /X-Pitch/);
      t.notRegex(message, /Buy now at/);
      t.true(message.split('spam.example').length - 1 < 20);
    }
  }
);

test.serial(
  'the next tier needs its recipients and recipient domains on one day',
  async (t) => {
    const getSmtpReputationSummary = require('#helpers/get-smtp-reputation-summary');
    const sender = await createSender(t);
    // a busy day to few domains, and a smaller one to more domains
    await recordSent(sender, 60, yesterday(), {
      to: (i) => `user${i}@${i % 2 ? 'one' : 'two'}.example`
    });
    await recordSent(
      sender,
      TIERS[1].minRecipientDomains + 2,
      dayjs(yesterday()).subtract(1, 'day').toDate()
    );

    await updateSmtpReputation(yesterday());
    const user = await Users.findById(sender.user._id);
    const { next } = await getSmtpReputationSummary(user);
    t.true(next.hasRecipientDomains);
    t.false(next.hasPeak);
  }
);

test.serial('SRS return addresses expire', (t) => {
  const { SRS } = require('sender-rewriting-scheme');
  const checkSRS = require('#helpers/check-srs');
  const srs = new SRS(config.srs);
  const forward = (daysAgo) => {
    const { now } = Date;
    Date.now = () => now() - daysAgo * 24 * 60 * 60 * 1000;
    try {
      return srs.forward('victim@example.org', 'example.com');
    } finally {
      Date.now = now;
    }
  };

  t.is(checkSRS(forward(1)), 'victim@example.org');
  // (an old one, e.g. from mail forwarded long ago, is not unwrapped)
  const old = forward(30);
  t.is(checkSRS(old), old);
});

test.serial(
  'messages scheduled under a longer horizon can still be updated',
  async (t) => {
    const sender = await createSender(t);
    const _id = new mongoose.Types.ObjectId();
    const createdAt = new Date();
    // (scheduled 29 days ahead before the horizon was shortened)
    await Emails.collection.insertOne({
      _id,
      id: _id.toString(),
      user: sender.user._id,
      domain: sender.domain._id,
      alias: sender.alias._id,
      status: 'queued',
      is_bounce: false,
      is_locked: false,
      envelope: {
        from: `${sender.alias.name}@${sender.domain.name}`,
        to: ['test@foo.com']
      },
      message: Buffer.from('Subject: test\r\n\r\ntest'),
      headers: {},
      accepted: [],
      rejectedErrors: [],
      date: dayjs(createdAt).add(29, 'day').toDate(),
      created_at: createdAt,
      updated_at: createdAt
    });

    const email = await Emails.findById(_id);
    email.status = 'sent';
    email.accepted = ['test@foo.com'];
    await t.notThrowsAsync(email.save());

    // (while a new date that far ahead is still refused)
    email.date = dayjs(createdAt).add(29, 'day').add(1, 'hour').toDate();
    await t.throwsAsync(email.save(), { message: /must not be more than/ });
  }
);

test.serial(
  'reports about scheduled mail count against the recipients it was due to',
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 4);
    // (submitted days ago, due within the last 24 hours)
    await recordSent(sender, 2000, dayjs().subtract(3, 'day').toDate(), {
      date: dayjs().subtract(1, 'hour').toDate()
    });
    const report = (i) =>
      recordSmtpReputationReport({
        Users,
        client: t.context.client,
        user: sender.user,
        email: { _id: new mongoose.Types.ObjectId() },
        recipient: `someone${i}@gmail.com`,
        truthSource: 'google.com',
        category: 'spam'
      });
    for (let i = 0; i < config.smtpReputationTruthSourceStrikes; i++)
      t.false(await report(i));
    const user = await getUser(sender.user);
    t.is(user[config.userFields.smtpReputationTier], 4);
  }
);

test.serial(
  "reports a day after the mail count against that day's recipients too",
  async (t) => {
    const sender = await createSender(t);
    await setReputation(sender.user, 3, 2);
    await evaluatedUntilTheDayBefore(sender.user);
    // (a big send the day before, and reports about it the next day)
    await recordSent(
      sender,
      2000,
      dayjs(yesterday()).subtract(1, 'day').toDate()
    );
    await recordSent(sender, 50, yesterday());
    for (let i = 0; i < config.smtpReputationTruthSourceStrikes; i++)
      await recordReport(sender.user, `someone${i}@gmail.com`, yesterday());

    await updateSmtpReputation(yesterday());
    const user = await getUser(sender.user);
    // (a bad day, not a reset)
    t.is(user[config.userFields.smtpReputationTier], 2);
    t.falsy(user[config.userFields.smtpReputationHoldUntil]);
  }
);

test.serial(
  'a threshold earned while paying does not apply after the plan expired',
  async (t) => {
    const getSmtpSendingLimits = require('#helpers/get-smtp-sending-limits');
    const owner = await createSender(t);
    const lapsed = await t.context.userFactory
      .withState({ plan: 'enhanced_protection' })
      .create();
    await setReputation(lapsed, 4);
    await setPlanExpiresAt(lapsed, dayjs().subtract(60, 'day').toDate());
    await addMember(owner.domain, lapsed);
    const domain = await Domains.findById(owner.domain._id).lean().exec();
    const limits = await getSmtpSendingLimits({
      user: await getUser(lapsed),
      domain,
      Users,
      Domains,
      Emails,
      client: t.context.client
    });
    t.is(limits.userLimit, BASE);
  }
);

test.serial(
  "domains' daily counts are caught up after the job missed days",
  async (t) => {
    const sender = await createSender(t);
    const missed = dayjs.utc().subtract(5, 'day').startOf('day');
    await recordSent(sender, 40, missed.add(12, 'hour').toDate());

    await updateSmtpReputation(undefined, { client: t.context.client });
    const domain = await Domains.findById(sender.domain._id).lean().exec();
    const day = domain.smtp_daily_counts.find(
      (d) => d.day.getTime() === missed.valueOf()
    );
    t.truthy(day);
    t.is(day.count, 40);
  }
);
