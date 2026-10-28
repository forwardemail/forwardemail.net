/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A newsletter sent over SMTP before it is approved: support is asked to
// approve it, with replies going to the user who sent it. Every email the
// app sends is recorded instead of sent.
//

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const sent = [];
const emailPath = require.resolve('#helpers/email');
require.cache[emailPath] = {
  id: emailPath,
  filename: emailPath,
  loaded: true,
  async exports(options) {
    sent.push(options);
  }
};

const utils = require('../utils');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const { Emails } = require('#models');

const IP_ADDRESS = ip.address();

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});

test.beforeEach(utils.setupFactories);

test('support is asked to approve a newsletter, with replies to its sender', async (t) => {
  const resolver = createTangerine(t.context.client, logger);

  const user = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.hasVerifiedEmail]: true
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

  // (another admin of the domain, who did not send it)
  const otherAdmin = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();

  const domain = await t.context.domainFactory
    .withState({
      members: [
        { user: user._id, group: 'admin' },
        { user: otherAdmin._id, group: 'admin' }
      ],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  {
    // spoof dns records
    const map = new Map();

    map.set(
      `txt:${domain.name}`,
      resolver.spoofPacket(
        domain.name,
        'TXT',
        [`${config.paidPrefix}${domain.verification_record}`],
        true
      )
    );

    // dkim
    map.set(
      `txt:${domain.dkim_key_selector}._domainkey.${domain.name}`,
      resolver.spoofPacket(
        `${domain.dkim_key_selector}._domainkey.${domain.name}`,
        'TXT',
        [`v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`],
        true,
        ms('5m')
      )
    );

    // spf
    map.set(
      `txt:${env.WEB_HOST}`,
      resolver.spoofPacket(
        `${env.WEB_HOST}`,
        'TXT',
        [`v=spf1 ip4:${IP_ADDRESS} -all`],
        true
      )
    );

    // cname
    map.set(
      `cname:${domain.return_path}.${domain.name}`,
      resolver.spoofPacket(
        `${domain.return_path}.${domain.name}`,
        'CNAME',
        [env.WEB_HOST],
        true,
        ms('5m')
      )
    );

    // cname -> txt
    map.set(
      `txt:${domain.return_path}.${domain.name}`,
      resolver.spoofPacket(
        `${domain.return_path}.${domain.name}`,
        'TXT',
        [`v=spf1 ip4:${IP_ADDRESS} -all`],
        true
      )
    );

    // dmarc
    map.set(
      `txt:_dmarc.${domain.name}`,
      resolver.spoofPacket(
        `_dmarc.${domain.name}`,
        'TXT',
        [
          // TODO: consume dmarc reports and parse dmarc-$domain
          `v=DMARC1; p=reject; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
        ],
        true,
        ms('5m')
      )
    );

    // store spoofed dns cache
    await resolver.options.cache.mset(map);
  }

  // (a newsletter: it has a List-Unsubscribe header)
  const queued = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to: 'test@example.net',
      subject: 'testing this',
      text: 'Test',
      headers: { 'List-Unsubscribe': '<mailto:unsubscribe@example.net>' }
    },
    user: user._id
  });
  let email = await Emails.findById(queued._id).lean().exec();
  t.true(email !== null);

  //
  // process the email
  //
  await processEmail({
    email,
    resolver,
    client: t.context.client
  });

  email = await Emails.findById(queued._id).lean().exec();

  t.is(
    email.rejectedErrors[0].message,
    'Newsletter usage is not yet approved for your account, please wait for approval or contact us for support.'
  );

  //
  // support is asked to approve it, with replies going to the user who sent
  // it (not every admin of the domain), and nothing is Bcc'd
  //
  await pWaitFor(
    () => sent.some((options) => options.message.to === config.supportEmail),
    { timeout: ms('10s') }
  );
  const review = sent.find(
    (options) => options.message.to === config.supportEmail
  );
  t.is(review.message.replyTo, user.email);
  t.true(review.locals.message.includes('Review Domain'));
  t.false(sent.some((options) => options.message.bcc || options.message.cc));
});
