/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Outbound SMTP: an envelope MAIL FROM on our own domain (e.g. support@,
// which skips the outbound phishing/virus scan, and is never SRS-rewritten)
// is only accepted from our own domain, not from a customer's domain.
//
// (this changes `config.webHost` and `config.supportEmail`, so it is kept in
// its own file; the defaults in tests are "localhost" addresses, which are
// not valid sender addresses)
//

const ip = require('ip');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');
const SMTP = require('../../smtp-server');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const logger = require('#helpers/logger');
const { Emails } = require('#models');

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();
const WEB_HOST = 'webhost.example.com';
const { webHost, supportEmail } = config;

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.before(() => {
  config.webHost = WEB_HOST;
  config.supportEmail = `support@${WEB_HOST}`;
});
test.after.always(() => {
  config.webHost = webHost;
  config.supportEmail = supportEmail;
});
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});
test.beforeEach(utils.setupFactories);

async function setup(t) {
  const smtp = new SMTP({ client: t.context.client }, true);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

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

  const resolver = createTangerine(t.context.client, logger);
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
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
  const pass = await alias.createToken();
  await alias.save();

  // spoof the domain's DNS records
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
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
  map.set(
    `txt:${env.WEB_HOST}`,
    resolver.spoofPacket(
      env.WEB_HOST,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
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
  map.set(
    `txt:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:_dmarc.${domain.name}`,
    resolver.spoofPacket(
      `_dmarc.${domain.name}`,
      'TXT',
      [
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@${WEB_HOST};`
      ],
      true,
      ms('5m')
    )
  );
  await resolver.options.cache.mset(map);

  const transporter = nodemailer.createTransport({
    logger,
    debug: true,
    host: IP_ADDRESS,
    port,
    secure: true,
    tls: { rejectUnauthorized: false },
    auth: { user: `${alias.name}@${domain.name}`, pass }
  });

  return { smtp, domain, alias, transporter };
}

function send(transporter, from, alias, domain) {
  return transporter.sendMail({
    envelope: { from, to: 'test@foo.com' },
    raw: `
To: test@foo.com
From: Test <${alias.name}@${domain.name}>
Subject: testing this
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
  });
}

test('rejects an envelope MAIL FROM on our own domain from a customer domain', async (t) => {
  const { smtp, domain, alias, transporter } = await setup(t);

  for (const from of [`support@${WEB_HOST}`, `bounces@${WEB_HOST}`]) {
    const err = await t.throwsAsync(send(transporter, from, alias, domain));
    t.is(err.responseCode, 550);
    t.regex(err.message, /Envelope MAIL FROM .* is not allowed/);
  }

  t.is(await Emails.countDocuments({ domain: domain._id }), 0);

  // the customer's own address is still accepted
  const info = await send(
    transporter,
    `${alias.name}@${domain.name}`,
    alias,
    domain
  );
  t.deepEqual(info.accepted, ['test@foo.com']);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);

  await smtp.close();
});
