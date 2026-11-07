/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Outbound SMTP and the domain's adult-related content protection: a link
// that Cloudflare's Family DNS blocks only for adult-related content is sent
// when the domain turned the protection off, and phishing and malware links
// are always blocked (see #586).
//

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const sinon = require('sinon');
const SpamScanner = require('spamscanner');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Emails } = require('#models');

const ADULT =
  "Link hostname of example.org was detected by Cloudflare's Family DNS to contain adult-related content, phishing, and/or malware.";
const MALWARE =
  "Link hostname of example.org was detected by Cloudflare's Security DNS to contain phishing and/or malware.";

//
// (the scanner binds `scan` to its instance when it is made, so it is stubbed
// once, before that, and each test sets what it finds)
//
let phishing = [];
test.before(() => {
  sinon.stub(SpamScanner.prototype, 'scan').callsFake(async () => ({
    results: { phishing, executables: [], arbitrary: [], viruses: [] },
    links: ['https://example.org']
  }));
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

function queue({ user, domain, alias }) {
  return Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to: 'test@example.net',
      subject: 'test',
      text: 'https://example.org'
    },
    user: user._id
  });
}

function setPhishingResults(messages) {
  phishing = messages;
}

test.serial(
  'a link blocked only as adult-related content is sent when the protection is off',
  async (t) => {
    setPhishingResults([ADULT]);
    const email = await queue(await setup(t, false));
    t.is(email.status, 'queued');
  }
);

test.serial(
  'a link blocked as adult-related content is not sent when the protection is on',
  async (t) => {
    setPhishingResults([ADULT]);
    const err = await t.throwsAsync(queue(await setup(t, true)));
    t.is(err.output.statusCode, 403);
    t.true(err.message.includes('adult-related content'));
  }
);

test.serial(
  'a phishing or malware link is not sent when the protection is off',
  async (t) => {
    setPhishingResults([ADULT, MALWARE]);
    const err = await t.throwsAsync(queue(await setup(t, false)));
    t.is(err.output.statusCode, 403);
    t.true(err.message.includes("Cloudflare's Security DNS"));
  }
);
