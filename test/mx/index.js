/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const util = require('node:util');

const API = require('@ladjs/api');
const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('mx-connect');
const nodemailer = require('nodemailer');
const pify = require('pify');
const test = require('ava');

const utils = require('../utils');
const MX = require('../../mx-server');

const { Users } = require('#models');
const apiConfig = require('#config/api');
const env = require('#config/env');
const config = require('#config');
const logger = require('#helpers/logger');

// dynamically import @ava/get-port
let getPort;
import('@ava/get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
const client = new Redis();
client.setMaxListeners(0);
const tls = { rejectUnauthorized: false };

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

// setup API server so we can configure MX with it
// (similar to `utils.setupApiServer`)
test.beforeEach(async (t) => {
  const api = new API(
    {
      ...apiConfig,
      redis: t.context.client
    },
    Users
  );
  const port = await getPort();
  t.context.apiPort = port;
  await api.listen(port);
});

test('connects', async (t) => {
  const smtp = new MX({
    client: t.context.client,
    apiEndpoint: `http://localhost:${t.context.apiPort}`
  });
  const { resolver } = smtp;
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

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver
    })
    .create();

  await t.context.aliasFactory
    .withState({
      name: '*', // catch-all
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  // spoof dns records
  const map = new Map();

  // spoof test@test.com mx records
  map.set(
    'mx:test.com',
    resolver.spoofPacket(
      'test.com',
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );

  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );

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
      true
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
      true
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
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ],
      true
    )
  );

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
      // <https://github.com/zone-eu/mx-connect/pull/4>
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    }
  });

  const transporter = nodemailer.createTransport({
    logger,
    debug: true,
    host: mx.host,
    port: mx.port,
    connection: mx.socket,
    // TODO: ignoreTLS: true,
    secure: false,
    tls
  });

  await t.notThrowsAsync(
    transporter.sendMail({
      envelope: {
        from: 'test@test.com',
        to: `test@${domain.name}`
      },
      raw: `
To: test@${domain.name}
From: test@test.com
Subject: test
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
    })
  );

  await smtp.close();
});

// TODO: test forwarding
// TODO: test IMAP
// TODO: test EICAR
// TODO: other tests to copy over (e.g. webhooks)
