/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Outbound SMTP and the domain's adult-related content protection: a link
// that Cloudflare's Family DNS blocks only for adult-related content is sent
// when the domain turned the protection off, and phishing and malware links
// are always blocked (see #586).  Links are looked up by Spam Scanner with
// Cloudflare's resolvers (see `helpers/spam-scanner.js`), here fakes of them.
//

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const spamScanner = require('#helpers/spam-scanner');
const { Emails } = require('#models');

// (a host Cloudflare's family resolver blocks for adult content alone, and
//  one its malware resolver blocks, which the family resolver blocks too)
const ADULT = 'adult.example.net';
const MALWARE = 'malware.example.net';
const blocks = (blocked) => ({
  async resolve4(name) {
    return blocked.includes(name) ? ['0.0.0.0'] : ['192.0.2.1'];
  }
});

test.before(async () => {
  config.spamScanner.cloudflare = true;
  // (time for a worker's first scan, which loads the classifier)
  config.spamScanner.outboundTimeout = ms('20s');
  await spamScanner.reset();
  const resolvers = spamScanner.getResolvers({}, blocks([MALWARE]));
  resolvers.malware = blocks([MALWARE]);
  resolvers.family = blocks([MALWARE, ADULT]);
});

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});
test.beforeEach(utils.setupFactories);

async function setup(t, hasAdultContentProtection) {
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
      has_smtp: true,
      has_adult_content_protection: hasAdultContentProtection
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  return { user, domain, alias };
}

function queue({ user, domain, alias }, hosts) {
  return Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to: 'test@example.net',
      subject: 'test',
      text: hosts.map((host) => `https://${host}/x`).join(' ')
    },
    user: user._id
  });
}

test.serial(
  'a link blocked only as adult-related content is sent when the protection is off',
  async (t) => {
    const email = await queue(await setup(t, false), [ADULT]);
    t.is(email.status, 'queued');
  }
);

test.serial(
  'a link blocked as adult-related content is not sent when the protection is on',
  async (t) => {
    const err = await t.throwsAsync(queue(await setup(t, true), [ADULT]));
    t.is(err.output.statusCode, 403);
    t.true(err.message.includes(ADULT));
  }
);

test.serial(
  'a phishing or malware link is not sent when the protection is off',
  async (t) => {
    const err = await t.throwsAsync(
      queue(await setup(t, false), [ADULT, MALWARE])
    );
    t.is(err.output.statusCode, 403);
    t.true(err.message.includes(MALWARE));
    t.false(err.message.includes(ADULT));
  }
);
