/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const util = require('node:util');
// const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const API = require('@ladjs/api');
const Koa = require('koa');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('mx-connect');
const nodemailer = require('nodemailer');
const openpgp = require('openpgp/dist/node/openpgp.js');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');
const { listen } = require('async-listen');

const utils = require('../utils');

const MX = require('../../mx-server');
const SQLite = require('../../sqlite-server');

const Users = require('#models/users');
const apiConfig = require('#config/api');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const logger = require('#helpers/logger');

// dynamically import @ava/get-port
let getPort;
import('@ava/get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
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
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('15s') });
  const port = await getPort();
  // remove trailing slash from API URL
  t.context.apiURL = await listen(api.server, { host: '127.0.0.1', port });
  t.context.apiURL = t.context.apiURL.toString().slice(0, -1);

  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({
    port: sqlitePort
  });
  await wsp.open();
  t.context.wsp = wsp;
});

test('imap/forward/webhook', async (t) => {
  const smtp = new MX({
    client: t.context.client,
    apiEndpoint: t.context.apiURL,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('15s') });
  const port = await getPort();
  await smtp.listen(port);

  const serverPort = await getPort();
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onRcptTo(address, session, fn) {
      fn();
    },
    onConnect(session, fn) {
      fn();
    },
    onData(stream, session, fn) {
      const chunks = [];
      const writer = new Writable({
        write(chunk, encoding, fn) {
          chunks.push(chunk);
          fn();
        }
      });
      stream.pipe(writer);
      stream.on('end', () => {
        // const buffer = Buffer.concat(chunks);
        // console.log(buffer.toString());
        fn();
      });
    },
    logger: false,
    secure: false
  });
  // start test smtp server
  await pify(server.listen.bind(server))(serverPort);

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
      resolver,
      smtp_port: serverPort.toString()
    })
    .create();

  // spoof webhook server
  const webhookPort = await getPort();
  const app = new Koa();
  app.use((ctx) => {
    ctx.body = 'OK';
  });
  app.listen(webhookPort);

  const { publicKey } = await openpgp.generateKey({
    type: 'ecc', // Type of the key, defaults to ECC
    curve: 'curve25519', // ECC curve name, defaults to curve25519
    userIDs: [{ name: '', email: `test@${domain.name}` }], // you can pass multiple user IDs
    passphrase: 'super long and hard to guess secret', // protects the private key
    format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  });

  await t.context.aliasFactory
    .withState({
      name: 'test',
      has_imap: true,
      has_pgp: true,
      public_key: publicKey,
      user: user._id,
      domain: domain._id,
      recipients: [IP_ADDRESS, `http://${domain.name}:${webhookPort}`]
    })
    .create();

  await t.context.aliasFactory
    .withState({
      name: 'foo',
      user: user._id,
      domain: domain._id,
      recipients: ['foo@beep.com'] // we spoof this MX server
    })
    .create();

  // spoof dns records
  const map = new Map();

  // spoof domain name for webhook
  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true)
  );

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
    'mx:beep.com',
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: '', priority: 0 }],
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

  // spoof the user's email MX records since we set up a catch-all to them
  map.set(
    `mx:${user.email.split('@')[1]}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  // set our local IP to allowlist so message does not get greylisted
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  {
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
      ignoreTLS: true,
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
  }

  {
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
      ignoreTLS: true,
      secure: false,
      tls
    });
    const err = await t.throwsAsync(
      transporter.sendMail({
        envelope: {
          from: 'test@test.com',
          to: `foo@${domain.name}`
        },
        raw: `
To: foo@${domain.name}
From: test@test.com
Subject: test
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
      })
    );

    t.regex(err.message, /Failed to resolve any IP addresses/);
    t.is(err.responseCode, 421);
  }

  await smtp.close();
});

// TODO: checkBounceForSpam logic

//
// backscatter
// - empty MAIL FROM and not backscatter works
// - empty MAIL FROM and on backscatter does not work (`backscatter:$val` key in redis)
//

//
// denylisted
// - value not on denylist works
// - value that is denylisted does not work (`denylist:$val` key in redis)
// - it should error /The $str $val is denylisted by/
//

//
// fingerprint expired
// - get the message fingerprint (same value used for `session.fingerprint`)
// - set the time to 5 days ago
// - it should error /This message has been retried/
//

//
// greylisted
// - can be greylisted by message fingerprint
// - can be greylisted by non-allowlisted domain
// - allowlisted domains are not greylisted
// - it should error /Message was greylisted/
//

//
// is authenticated message
// - spf failure but dkim passing -> OK
// - spf passing but dkim failure -> OK
// - spf hardfail dkim none -> error /has failed SPF validation/
// - dmarc failure -> error /has failed DMARC validation/
//

//
// is arbitrary
// - subject contains "recorded you" /Blocked phrase/
// - paypal scam subject contains "reminder" and From contains "paypal" /ongoing PayPal invoice spam/
// - body contains "bitcoin" and "hacked" /Blocked crypto scam/
// - From is postmaster@outlook.com and subject starts with "Undeliverable: " /onmicrosoft/
// ... and several more (see `#helpers/is-arbitrary` codebase)
//

// silent ban

// spam scanner EICAR test

// adds the following headers
// - X-Report-Abuse-To
// - X-Report-Abuse
// - X-Complaints-To
// - X-ForwardEmail-Version
// - X-ForwardEmail-Sender

// friendly-from rewrite if necessary
