/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const util = require('node:util');
const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('mx-connect');
const nodemailer = require('nodemailer');
const openpgp = require('openpgp');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const safeStringify = require('fast-safe-stringify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');
const { SRS } = require('sender-rewriting-scheme');

const utils = require('../utils');

const MX = require('../../mx-server');
const SQLite = require('../../sqlite-server');

const Emails = require('#models/emails');
const config = require('#config');
const _ = require('#helpers/lodash');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const isExpiredOrNewlyCreated = require('#helpers/is-expired-or-newly-created');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
const tls = { rejectUnauthorized: false };
const srs = new SRS(config.srs);

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
// setup API server so we can configure MX with it
// (similar to `utils.setupApiServer`)
test.beforeEach(async (t) => {
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
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

test.afterEach.always(async (t) => {
  // close websocket connection
  if (t.context.wsp) {
    try {
      await t.context.wsp.close();
    } catch {
      // ignore
    }
  }

  // close sqlite server
  if (t.context.sqlite) {
    try {
      await t.context.sqlite.close();
    } catch {
      // ignore
    }
  }
});

test('imap/forward/webhook', async (t) => {
  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
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
        // TODO: assertions
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
  app.use(bodyParser());
  app.use((ctx) => {
    ctx.body = 'OK';
    // TODO: assertions
    // console.log('ctx.request.body');
    // console.log('ctx.request.body.raw');
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
      recipients: [IP_ADDRESS, `http://${domain.name}:${webhookPort}`],
      vacation_responder: {
        is_enabled: true,
        start_date: new Date(),
        subject: 'Vacation Responder Test Subject #1',
        message: 'Vacation Responder Test Message #1'
      }
    })
    .create();

  await t.context.aliasFactory
    .withState({
      name: 'foobar',
      has_imap: true,
      user: user._id,
      domain: domain._id
    })
    .create();

  await t.context.aliasFactory
    .withState({
      name: 'foobarforward',
      user: user._id,
      domain: domain._id,
      recipients: [`foobar@${domain.name}`]
    })
    .create();

  await t.context.aliasFactory
    .withState({
      name: 'foo',
      user: user._id,
      domain: domain._id,
      recipients: ['foo@beep.com'], // we spoof this MX server
      vacation_responder: {
        is_enabled: true,
        start_date: new Date(),
        subject: 'Vacation Responder Test Subject #2',
        message: 'Vacation Responder Test Message #2'
      }
    })
    .create();

  // spoof dns records
  const map = new Map();

  // spoof domain name for webhook
  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true, ms('5m'))
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
      true,
      ms('5m')
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
      true,
      ms('5m')
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
      true,
      ms('5m')
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
      true,
      ms('5m')
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
      true,
      ms('5m')
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
          to: [
            `test@${domain.name}`,
            `foobarforward@${domain.name}`,
            //
            // NOTE: this is purposely formatted incorrectly
            //       to test when mail servers send to lowercase version of MAIL FROM
            //       (we have logic that accounts for this, see `#helpers/check-srs`)
            srs.forward(`test@${domain.name}`, env.WEB_HOST).toLowerCase()
          ]
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
    t.is(
      err.message,
      `Message failed: 421 4.4.2 Failed to resolve any IP addresses for the Mail Exchange (MX) server associated with "beep.com"`
    );
    t.is(err.responseCode, 421);
  }

  await smtp.close();

  await pWaitFor(async () => {
    const exists = await Emails.exists({
      user: user._id,
      is_bounce: true
    });
    return Boolean(exists?._id);
  });

  let email = await Emails.findOne({
    user: user._id,
    is_bounce: true
  });

  const dummyPort = await getPort();
  const dummyServer = new SMTPServer({
    disabledCommands: ['AUTH'],
    onMailFrom(address, session, fn) {
      // this should be MAIL FROM <> (blank/empty)
      t.is(address.address, '');
      if (address.address !== '')
        return fn(new Error('MAIL FROM must be blank'));
      fn();
    },
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
        // TODO: assertions
        // const buffer = Buffer.concat(chunks);
        // console.log(buffer.toString());
        fn();
      });
    },
    logger: false,
    secure: false
  });

  // start test smtp server
  await pify(dummyServer.listen.bind(dummyServer))(dummyPort);

  await processEmail({
    email,
    port: dummyPort,
    resolver,
    client: t.context.client
  });

  email = await Emails.findById(email._id);

  t.is(email.status, 'sent');
  t.deepEqual(email.accepted, ['test@test.com']);
});

//
// TODO: this needs tested against MX integration
//
test('isExpiredOrNewlyCreated', async (t) => {
  const rootDomain = falso.randDomainName();

  //
  // NOTE: we basically test by spoofing the DNS whois cache
  //

  //
  // 1) if response.found = false then no errors (may be WHOIS block on our server)
  //
  await t.context.client.set(
    `whois:${rootDomain}`,
    safeStringify({
      found: false,
      ts: {
        expires: new Date(),
        created: new Date()
      }
    }),
    'PX',
    ms('1d')
  );

  {
    const obj = await isExpiredOrNewlyCreated(rootDomain, t.context.client);
    t.is(obj.err, undefined);
    t.is(obj.response.found, false);
  }

  //
  // 2) if response.status of "pending delete" then assume expired
  //
  await t.context.client.set(
    `whois:${rootDomain}`,
    safeStringify({
      found: true,
      status: ['pending delete'],
      ts: {
        expires: new Date(),
        created: new Date()
      }
    }),
    'PX',
    ms('1d')
  );

  {
    const obj = await isExpiredOrNewlyCreated(rootDomain, t.context.client);
    t.is(
      obj.err.message,
      `The domain ${rootDomain} was detected as a pending state domain via WHOIS/RDAP lookup. Due to major registrars such as GoDaddy, Namecheap, and Hostgator previously blocking us due to abuse &mdash; we unfortunately have to enforce strict abuse prevention controls to block suspicious activity. Without this abuse prevention, our service would be blocked entirely from these registrars. We require that you please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`
    );
    t.is(obj.err.responseCode, 550);
    t.is(obj.response.found, true);
    t.deepEqual(obj.response.status, ['pending delete']);
  }

  //
  // 3) if response.ts.expired within now to 90d ago then assume expired
  //
  {
    const expires = dayjs().subtract(30, 'day').toDate();
    await t.context.client.set(
      `whois:${rootDomain}`,
      safeStringify({
        found: true,
        ts: {
          expires,
          created: new Date()
        }
      }),
      'PX',
      ms('1d')
    );
    const obj = await isExpiredOrNewlyCreated(rootDomain, t.context.client);
    t.is(
      obj.err.message,
      `The domain ${rootDomain} was detected as a recently expired domain via WHOIS/RDAP lookup. Due to major registrars such as GoDaddy, Namecheap, and Hostgator previously blocking us due to abuse &mdash; we unfortunately have to enforce strict abuse prevention controls to block suspicious activity. Without this abuse prevention, our service would be blocked entirely from these registrars. We require that you please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`
    );
    t.is(obj.err.responseCode, 550);
    t.is(obj.response.found, true);
    t.deepEqual(obj.response.ts.expires, expires);
  }

  //
  // 4) if response.ts.created within now to 90d ago then assume expired
  //
  {
    const expires = dayjs().add(1, 'year').toDate();
    const created = dayjs().subtract(30, 'day').toDate();
    await t.context.client.set(
      `whois:${rootDomain}`,
      safeStringify({
        found: true,
        ts: {
          expires,
          created
        }
      }),
      'PX',
      ms('1d')
    );
    const obj = await isExpiredOrNewlyCreated(rootDomain, t.context.client);
    t.is(
      obj.err.message,
      `The domain ${rootDomain} was detected as a newly created or transferred domain via WHOIS/RDAP lookup. Due to major registrars such as GoDaddy, Namecheap, and Hostgator previously blocking us due to abuse &mdash; we unfortunately have to enforce strict abuse prevention controls to block suspicious activity. Without this abuse prevention, our service would be blocked entirely from these registrars. We require that you please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`
    );
    t.is(obj.err.responseCode, 550);
    t.is(obj.response.found, true);
    t.deepEqual(obj.response.ts.expires, expires);
    t.deepEqual(obj.response.ts.created, created);
  }
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
// - X-Forward-Email-Version
// - X-Forward-Email-Sender

// friendly-from rewrite if necessary

test('catch-all should not receive emails to inactive normal alias with 550 error', async (t) => {
  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const receivedEmails = [];
  let smtpError = null;

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
        const buffer = Buffer.concat(chunks);
        receivedEmails.push({
          to: session.envelope.rcptTo,
          from: session.envelope.mailFrom,
          data: buffer.toString()
        });
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

  // Create catch-all alias (active)
  await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      name: '*',
      recipients: [`test@${IP_ADDRESS}`],
      is_enabled: true
    })
    .create();

  // Create inactive normal alias with 550 error code
  await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      name: 'inactive',
      recipients: [`inactive@${IP_ADDRESS}`],
      is_enabled: false,
      error_code_if_disabled: 550
    })
    .create();

  // spoof dns records
  const map = new Map();

  // spoof domain A record
  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true)
  );

  // spoof domain MX record
  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  // spoof domain TXT record for verification
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true
    )
  );

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  // set our local IP to allowlist so message does not get greylisted
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Create MX connection and transporter
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

  // Try to send email to inactive@domain.name
  try {
    await transporter.sendMail({
      envelope: {
        from: 'test@test.com',
        to: `inactive@${domain.name}`
      },
      raw: `
To: inactive@${domain.name}
From: test@test.com
Subject: test inactive alias
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

This should get 550 error, not be caught by catch-all
`
    });
    t.fail('Should have thrown 550 error');
  } catch (err) {
    smtpError = err;
  }

  // Should get 550 error and no emails should be received by catch-all
  t.truthy(smtpError);
  t.is(smtpError.responseCode, 550);
  t.is(
    receivedEmails.length,
    0,
    'Catch-all should not receive emails for inactive aliases with 550 error'
  );

  await server.close();
  await smtp.close();
});

test('free plan catch-all should not receive emails to inactive regex alias with 250 error', async (t) => {
  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const receivedEmails = [];
  let smtpError = null;

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
        const buffer = Buffer.concat(chunks);
        receivedEmails.push({
          to: session.envelope.rcptTo,
          from: session.envelope.mailFrom,
          data: buffer.toString()
        });
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
      plan: 'free'
    })
    .create();

  const domain = await t.context.domainFactory
    .withState({
      // NOTE: free plan must be of a specific list of goodDomains
      // <https://github.com/ngneat/falso/blob/96a9c101ffbcc150e698a3f56e8cc18f734020b5/packages/falso/src/lib/domain-name.ts#L22>
      name: `${falso.randWord()}.${_.sample(config.goodDomains)}`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver
    })
    .create();

  // spoof dns records
  const map = new Map();

  // spoof domain A record
  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true, ms('5m'))
  );

  // spoof domain MX record
  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );

  // spoof domain TXT record for verification
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [
        // Set custom port
        `forward-email-port=${serverPort.toString()}`,
        // Create catch-all alias (active)
        `forward-email=test@${IP_ADDRESS}`,
        // Create inactive regex alias with 250 error code (quiet reject)
        `forward-email=!/^(spam|bogus)$/:spam@${IP_ADDRESS}`
      ],
      true,
      ms('5m')
    )
  );

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  // set our local IP to allowlist so message does not get greylisted
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Create MX connection and transporter
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

  // Try to send email to spam@domain.name (matches regex but alias is inactive)
  try {
    await transporter.sendMail({
      envelope: {
        from: 'test@test.com',
        to: `spam@${domain.name}`
      },
      raw: `
To: spam@${domain.name}
From: test@test.com
Subject: test inactive regex alias
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

This should get 250 quiet reject, not be caught by catch-all
`
    });
    // 250 is a success code, so this should not throw
  } catch (err) {
    smtpError = err;
  }

  // Should get 250 (quiet reject) and no emails should be received by catch-all
  t.falsy(smtpError, 'Should not throw error for 250 quiet reject');
  t.is(
    receivedEmails.length,
    0,
    'Catch-all should not receive emails for inactive regex aliases with 250 error'
  );

  await server.close();
  await smtp.close();
});

test('paid plan catch-all should not receive emails to inactive regex alias with 250 error', async (t) => {
  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const receivedEmails = [];
  let smtpError = null;

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
        const buffer = Buffer.concat(chunks);
        receivedEmails.push({
          to: session.envelope.rcptTo,
          from: session.envelope.mailFrom,
          data: buffer.toString()
        });
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

  // Create catch-all alias (active)
  await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      name: '*',
      recipients: [`test@${IP_ADDRESS}`],
      is_enabled: true
    })
    .create();

  // Create inactive regex alias with 250 error code (quiet reject)
  await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      name: '/^(spam|bogus)$/',
      recipients: [`spam@${IP_ADDRESS}`],
      is_enabled: false,
      error_code_if_disabled: 250
    })
    .create();

  // spoof dns records
  const map = new Map();

  // spoof domain A record
  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true)
  );

  // spoof domain MX record
  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  // spoof domain TXT record for verification
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true
    )
  );

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  // set our local IP to allowlist so message does not get greylisted
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Create MX connection and transporter
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

  // Try to send email to spam@domain.name (matches regex but alias is inactive)
  try {
    await transporter.sendMail({
      envelope: {
        from: 'test@test.com',
        to: `spam@${domain.name}`
      },
      raw: `
To: spam@${domain.name}
From: test@test.com
Subject: test inactive regex alias
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

This should get 250 quiet reject, not be caught by catch-all
`
    });
    // 250 is a success code, so this should not throw
  } catch (err) {
    smtpError = err;
  }

  // Should get 250 (quiet reject) and no emails should be received by catch-all
  t.falsy(smtpError, 'Should not throw error for 250 quiet reject');
  t.is(
    receivedEmails.length,
    0,
    'Catch-all should not receive emails for inactive regex aliases with 250 error'
  );

  await server.close();
  await smtp.close();
});

test('domain denylist should block email address even when hostname is not denylisted', async (t) => {
  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const receivedEmails = [];
  let smtpError = null;

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
        const buffer = Buffer.concat(chunks);
        receivedEmails.push({
          to: session.envelope.rcptTo,
          from: session.envelope.mailFrom,
          data: buffer.toString()
        });
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
      smtp_port: serverPort.toString(),
      // Add specific email to denylist
      denylist: ['spammer@gmail.com']
    })
    .create();

  // Create alias to receive emails
  await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      name: 'test',
      recipients: [`test@${IP_ADDRESS}`],
      is_enabled: true
    })
    .create();

  // spoof dns records
  const map = new Map();

  // spoof domain A record
  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true)
  );

  // spoof domain MX record
  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  // spoof domain TXT record for verification
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true
    )
  );

  // Spoof gmail.com hostname resolution
  const fakeGmailHostname = 'mail-io1-xd48.google.com';
  map.set(
    `ptr:${IP_ADDRESS}`,
    resolver.spoofPacket(IP_ADDRESS, 'PTR', [fakeGmailHostname], true)
  );

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  // set our local IP to allowlist so message does not get greylisted
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Create MX connection and transporter
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

  // Try to send email from denylisted email address
  try {
    await transporter.sendMail({
      envelope: {
        from: 'spammer@gmail.com',
        to: `test@${domain.name}`
      },
      raw: `
To: test@${domain.name}
From: spammer@gmail.com
Subject: test denylist
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

This should be blocked by denylist
`
    });
    t.fail('Should have thrown denylist error');
  } catch (err) {
    smtpError = err;
  }

  // Should get denylist error
  t.truthy(smtpError);
  t.regex(smtpError.message, /denylisted/i);
  t.is(
    receivedEmails.length,
    0,
    'Email from denylisted address should not be received'
  );

  await server.close();
  await smtp.close();
});

test('domain denylist should block domain even when hostname is not denylisted', async (t) => {
  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const receivedEmails = [];
  let smtpError = null;

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
        const buffer = Buffer.concat(chunks);
        receivedEmails.push({
          to: session.envelope.rcptTo,
          from: session.envelope.mailFrom,
          data: buffer.toString()
        });
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
      smtp_port: serverPort.toString(),
      // Add domain to denylist
      denylist: ['spam-domain.com']
    })
    .create();

  // Create alias to receive emails
  await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      name: 'test',
      recipients: [`test@${IP_ADDRESS}`],
      is_enabled: true
    })
    .create();

  // spoof dns records
  const map = new Map();

  // spoof domain A record
  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true)
  );

  // spoof domain MX record
  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  // spoof domain TXT record for verification
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true
    )
  );

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  // set our local IP to allowlist so message does not get greylisted
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Create MX connection and transporter
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

  // Try to send email from denylisted domain
  try {
    await transporter.sendMail({
      envelope: {
        from: 'anyone@spam-domain.com',
        to: `test@${domain.name}`
      },
      raw: `
To: test@${domain.name}
From: anyone@spam-domain.com
Subject: test denylist domain
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

This should be blocked by denylist
`
    });
    t.fail('Should have thrown denylist error');
  } catch (err) {
    smtpError = err;
  }

  // Should get denylist error
  t.truthy(smtpError);
  t.regex(smtpError.message, /denylisted/i);
  t.is(
    receivedEmails.length,
    0,
    'Email from denylisted domain should not be received'
  );

  await server.close();
  await smtp.close();
});

test('domain denylist should allow email when not in denylist', async (t) => {
  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const receivedEmails = [];

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
        const buffer = Buffer.concat(chunks);
        receivedEmails.push({
          to: session.envelope.rcptTo,
          from: session.envelope.mailFrom,
          data: buffer.toString()
        });
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
      smtp_port: serverPort.toString(),
      // Add different email to denylist
      denylist: ['spammer@gmail.com']
    })
    .create();

  // Create alias to receive emails
  await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      name: 'test',
      recipients: [`test@${IP_ADDRESS}`],
      is_enabled: true
    })
    .create();

  // spoof dns records
  const map = new Map();

  // spoof domain A record
  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true)
  );

  // spoof domain MX record
  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  // spoof domain TXT record for verification
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true
    )
  );

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  // set our local IP to allowlist so message does not get greylisted
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Create MX connection and transporter
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

  // Send email from non-denylisted email address
  await transporter.sendMail({
    envelope: {
      from: 'legitimate@gmail.com',
      to: `test@${domain.name}`
    },
    raw: `
To: test@${domain.name}
From: legitimate@gmail.com
Subject: test allowed email
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

This should be allowed through
`
  });

  // Wait a bit for email to be processed
  await pWaitFor(() => receivedEmails.length > 0, { timeout: ms('10s') });

  // Should receive the email
  t.is(
    receivedEmails.length,
    1,
    'Email from non-denylisted address should be received'
  );

  await server.close();
  await smtp.close();
});

test('requiretls propagation', async (t) => {
  // Generate self-signed cert in-memory
  const { key, cert } = await utils.generateSmtpKeys();

  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp,
    secure: true,
    key,
    cert
  });

  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const downstreamPort = await getPort();
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
      resolver,
      smtp_port: downstreamPort.toString()
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [IP_ADDRESS],
      is_enabled: true
    })
    .create();

  // Create downstream SMTP server to receive forwarded email
  const receivedEmails = [];
  const server = new SMTPServer({
    authOptional: true,
    secure: false,
    onData(stream, session, callback) {
      const chunks = [];
      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      stream.on('end', () => {
        receivedEmails.push({
          session,
          raw: Buffer.concat(chunks).toString()
        });
        callback();
      });
    },
    logger
  });

  await util.promisify(server.listen).bind(server)(downstreamPort);

  // Spoof DNS records
  const map = new Map();

  // spf
  map.set(
    `txt:${env.WEB_HOST}`,
    resolver.spoofPacket(
      `${env.WEB_HOST}`,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
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
  map.set(
    `_dmarc.${domain.name}`,
    resolver.spoofPacket(
      `_dmarc.${domain.name}`,
      'TXT',
      [`v=DMARC1; p=reject; rua=mailto:dmarc@${domain.name};`],
      true
    )
  );
  map.set(
    'a:test.com',
    resolver.spoofPacket('test.com', 'A', [IP_ADDRESS], true, ms('5m'))
  );
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
      true,
      ms('5m')
    )
  );

  // Store spoofed DNS cache
  await resolver.options.cache.mset(map);

  // Set our local IP to allowlist so message does not get greylisted
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Create MX connection and transporter
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
    secure: true,
    tls,
    requireTLS: true
  });

  // Send email with REQUIRETLS to MX server
  const err = await t.throwsAsync(
    transporter.sendMail({
      envelope: {
        from: 'test@test.com',
        to: `${alias.name}@${domain.name}`,
        // <https://github.com/nodemailer/nodemailer/pull/1793
        requireTLSExtensionEnabled: true
      },
      raw: `
To: ${alias.name}@${domain.name}
From: test@test.com
Subject: test requiretls propagation
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test REQUIRETLS propagation through MX
`.trim()
    })
  );

  t.regex(err.message, /Server does not support REQUIRETLS extension/);
  t.is(err.responseCode, 421);

  await server.close();
  await smtp.close();
});

//
// Tests for recursive forwarding to domains with TXT records but different MX
//
// These tests verify the fix for the bug where forwarding to a domain that has
// Forward Email TXT records but uses a different MX provider would result in
// "Invalid recipients" error instead of delivering to that domain's MX.
//

test('recursive forward: self-referential catch-all should deliver to target MX', async (t) => {
  // Scenario: source.com forwards to user@target.com
  // target.com has TXT: forward-email=user@target.com (catch-all self-referential)
  // target.com MX points to different server (not Forward Email)
  // Expected: email should be delivered to target.com's MX

  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const receivedEmails = [];

  // This server simulates the target domain's MX (different provider like Fastmail)
  const targetMxPort = await getPort();
  const targetMxServer = new SMTPServer({
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
        const buffer = Buffer.concat(chunks);
        receivedEmails.push({
          to: session.envelope.rcptTo,
          from: session.envelope.mailFrom,
          data: buffer.toString()
        });
        fn();
      });
    },
    logger: false,
    secure: false
  });
  await pify(targetMxServer.listen.bind(targetMxServer))(targetMxPort);

  // Create user
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

  // Source domain (configured with Forward Email MX)
  const sourceDomain = await t.context.domainFactory
    .withState({
      name: `source-self-${Date.now()}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver,
      smtp_port: targetMxPort.toString()
    })
    .create();

  // Target domain - exists in DB with smtp_port set to our test server
  const targetDomain = await t.context.domainFactory
    .withState({
      name: `target-self-${Date.now()}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver,
      smtp_port: targetMxPort.toString()
    })
    .create();

  // Create alias on source domain that forwards to target domain
  await t.context.aliasFactory
    .withState({
      name: 'sender',
      user: user._id,
      domain: sourceDomain._id,
      recipients: [`user@${targetDomain.name}`]
    })
    .create();

  // Spoof DNS records
  const map = new Map();

  // Source domain MX points to Forward Email (our test server)
  map.set(
    `mx:${sourceDomain.name}`,
    resolver.spoofPacket(
      sourceDomain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  // Source domain TXT for verification
  map.set(
    `txt:${sourceDomain.name}`,
    resolver.spoofPacket(
      sourceDomain.name,
      'TXT',
      [`${config.paidPrefix}${sourceDomain.verification_record}`],
      true,
      ms('5m')
    )
  );

  // Target domain MX points to our test server (simulating different provider)
  map.set(
    `mx:${targetDomain.name}`,
    resolver.spoofPacket(
      targetDomain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  // Target domain A record for delivery
  map.set(
    `a:${targetDomain.name}`,
    resolver.spoofPacket(targetDomain.name, 'A', [IP_ADDRESS], true, ms('5m'))
  );

  // Target domain has Forward Email TXT records (self-referential catch-all)
  // The site-verification links to the domain in DB which has smtp_port set
  map.set(
    `txt:${targetDomain.name}`,
    resolver.spoofPacket(
      targetDomain.name,
      'TXT',
      [
        `${config.paidPrefix}${targetDomain.verification_record}`,
        `forward-email=user@${targetDomain.name}` // catch-all points to same domain
      ],
      true,
      ms('5m')
    )
  );

  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Send email
  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
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

  // This should NOT throw "Invalid recipients" error
  await t.notThrowsAsync(
    transporter.sendMail({
      envelope: {
        from: 'external@test.com',
        to: `sender@${sourceDomain.name}`
      },
      raw: `
To: sender@${sourceDomain.name}
From: external@test.com
Subject: test self-referential forward
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test self-referential forwarding to domain with different MX
`.trim()
    })
  );

  // Wait for email to be delivered
  await pWaitFor(() => receivedEmails.length > 0, { timeout: ms('15s') });

  t.is(receivedEmails.length, 1, 'Email should be delivered to target MX');
  t.true(
    receivedEmails[0].to.some((r) => r.address === `user@${targetDomain.name}`),
    `Email should be addressed to user@${targetDomain.name}`
  );

  await targetMxServer.close();
  await smtp.close();
});

test('recursive forward: different address same domain should deliver to target MX', async (t) => {
  // Scenario: source.com forwards to user@target.com
  // target.com has TXT: forward-email=user:other@target.com (different address, same domain)
  // target.com MX points to different server
  // Expected: email should be delivered to target.com's MX (not follow the chain)

  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const receivedEmails = [];

  const targetMxPort = await getPort();
  const targetMxServer = new SMTPServer({
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
        const buffer = Buffer.concat(chunks);
        receivedEmails.push({
          to: session.envelope.rcptTo,
          from: session.envelope.mailFrom,
          data: buffer.toString()
        });
        fn();
      });
    },
    logger: false,
    secure: false
  });
  await pify(targetMxServer.listen.bind(targetMxServer))(targetMxPort);

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

  const sourceDomain = await t.context.domainFactory
    .withState({
      name: `source-diff-${Date.now()}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver,
      smtp_port: targetMxPort.toString()
    })
    .create();

  const targetDomain = await t.context.domainFactory
    .withState({
      name: `target-diff-${Date.now()}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver,
      smtp_port: targetMxPort.toString()
    })
    .create();

  await t.context.aliasFactory
    .withState({
      name: 'sender',
      user: user._id,
      domain: sourceDomain._id,
      recipients: [`user@${targetDomain.name}`]
    })
    .create();

  const map = new Map();

  map.set(
    `mx:${sourceDomain.name}`,
    resolver.spoofPacket(
      sourceDomain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  map.set(
    `txt:${sourceDomain.name}`,
    resolver.spoofPacket(
      sourceDomain.name,
      'TXT',
      [`${config.paidPrefix}${sourceDomain.verification_record}`],
      true,
      ms('5m')
    )
  );

  map.set(
    `mx:${targetDomain.name}`,
    resolver.spoofPacket(
      targetDomain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  map.set(
    `a:${targetDomain.name}`,
    resolver.spoofPacket(targetDomain.name, 'A', [IP_ADDRESS], true, ms('5m'))
  );

  // Target domain TXT: user forwards to other@target (different address, same domain)
  map.set(
    `txt:${targetDomain.name}`,
    resolver.spoofPacket(
      targetDomain.name,
      'TXT',
      [
        `${config.paidPrefix}${targetDomain.verification_record}`,
        `forward-email=user:other@${targetDomain.name}`
      ],
      true,
      ms('5m')
    )
  );

  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
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
        from: 'external@test.com',
        to: `sender@${sourceDomain.name}`
      },
      raw: `
To: sender@${sourceDomain.name}
From: external@test.com
Subject: test different address same domain forward
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test forwarding to different address on same domain with different MX
`.trim()
    })
  );

  await pWaitFor(() => receivedEmails.length > 0, { timeout: ms('15s') });

  t.is(receivedEmails.length, 1, 'Email should be delivered to target MX');
  t.true(
    receivedEmails[0].to.some((r) => r.address === `user@${targetDomain.name}`),
    `Email should be addressed to original user@${targetDomain.name}`
  );

  await targetMxServer.close();
  await smtp.close();
});

test('recursive forward: external domain should still forward normally', async (t) => {
  // Scenario: source.com forwards to user@target.com
  // target.com has TXT: forward-email=user:external@gmail.com (forwards to external domain)
  // target.com MX points to different server
  // Expected: email should be forwarded to gmail.com (legitimate external forward)

  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const receivedEmails = [];

  // This server simulates gmail.com's MX
  const externalMxPort = await getPort();
  const externalMxServer = new SMTPServer({
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
        const buffer = Buffer.concat(chunks);
        receivedEmails.push({
          to: session.envelope.rcptTo,
          from: session.envelope.mailFrom,
          data: buffer.toString()
        });
        fn();
      });
    },
    logger: false,
    secure: false
  });
  await pify(externalMxServer.listen.bind(externalMxServer))(externalMxPort);

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

  const sourceDomain = await t.context.domainFactory
    .withState({
      name: `source-ext-${Date.now()}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver,
      smtp_port: externalMxPort.toString()
    })
    .create();

  const targetDomain = await t.context.domainFactory
    .withState({
      name: `target-ext-${Date.now()}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver,
      smtp_port: externalMxPort.toString()
    })
    .create();

  const externalDomain = `external-${Date.now()}.com`;

  await t.context.aliasFactory
    .withState({
      name: 'sender',
      user: user._id,
      domain: sourceDomain._id,
      recipients: [`user@${targetDomain.name}`]
    })
    .create();

  const map = new Map();

  map.set(
    `mx:${sourceDomain.name}`,
    resolver.spoofPacket(
      sourceDomain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  map.set(
    `txt:${sourceDomain.name}`,
    resolver.spoofPacket(
      sourceDomain.name,
      'TXT',
      [`${config.paidPrefix}${sourceDomain.verification_record}`],
      true,
      ms('5m')
    )
  );

  map.set(
    `mx:${targetDomain.name}`,
    resolver.spoofPacket(
      targetDomain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  // Target domain TXT: forwards to external domain
  map.set(
    `txt:${targetDomain.name}`,
    resolver.spoofPacket(
      targetDomain.name,
      'TXT',
      [
        `${config.paidPrefix}${targetDomain.verification_record}`,
        `forward-email=user:external@${externalDomain}`
      ],
      true,
      ms('5m')
    )
  );

  // External domain MX
  map.set(
    `mx:${externalDomain}`,
    resolver.spoofPacket(
      externalDomain,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  map.set(
    `a:${externalDomain}`,
    resolver.spoofPacket(externalDomain, 'A', [IP_ADDRESS], true, ms('5m'))
  );

  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
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
        from: 'external@test.com',
        to: `sender@${sourceDomain.name}`
      },
      raw: `
To: sender@${sourceDomain.name}
From: external@test.com
Subject: test external domain forward
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test forwarding to external domain should work normally
`.trim()
    })
  );

  await pWaitFor(() => receivedEmails.length > 0, { timeout: ms('15s') });

  t.is(
    receivedEmails.length,
    1,
    'Email should be forwarded to external domain'
  );
  t.true(
    receivedEmails[0].to.some(
      (r) => r.address === `external@${externalDomain}`
    ),
    `Email should be addressed to external@${externalDomain}`
  );

  await externalMxServer.close();
  await smtp.close();
});

test('recursive forward: mixed same-domain and external should forward to external only', async (t) => {
  // Scenario: source.com forwards to user@target.com
  // target.com has TXT: forward-email=user:user@target.com,backup@external.com
  // target.com MX points to different server
  // Expected: email should be forwarded to external.com only
  // (same-domain address is dropped because there's an external destination)

  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const receivedEmails = [];

  const externalMxPort = await getPort();
  const externalMxServer = new SMTPServer({
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
        const buffer = Buffer.concat(chunks);
        receivedEmails.push({
          to: session.envelope.rcptTo,
          from: session.envelope.mailFrom,
          data: buffer.toString()
        });
        fn();
      });
    },
    logger: false,
    secure: false
  });
  await pify(externalMxServer.listen.bind(externalMxServer))(externalMxPort);

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

  const sourceDomain = await t.context.domainFactory
    .withState({
      name: `source-mixed-${Date.now()}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver,
      smtp_port: externalMxPort.toString()
    })
    .create();

  const targetDomain = await t.context.domainFactory
    .withState({
      name: `target-mixed-${Date.now()}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver,
      smtp_port: externalMxPort.toString()
    })
    .create();

  const externalDomain = `backup-${Date.now()}.com`;

  await t.context.aliasFactory
    .withState({
      name: 'sender',
      user: user._id,
      domain: sourceDomain._id,
      recipients: [`user@${targetDomain.name}`]
    })
    .create();

  const map = new Map();

  map.set(
    `mx:${sourceDomain.name}`,
    resolver.spoofPacket(
      sourceDomain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  map.set(
    `txt:${sourceDomain.name}`,
    resolver.spoofPacket(
      sourceDomain.name,
      'TXT',
      [`${config.paidPrefix}${sourceDomain.verification_record}`],
      true,
      ms('5m')
    )
  );

  map.set(
    `mx:${targetDomain.name}`,
    resolver.spoofPacket(
      targetDomain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  // Target domain TXT: forwards to both same-domain AND external
  // Using two separate forward-email records for the same alias
  map.set(
    `txt:${targetDomain.name}`,
    resolver.spoofPacket(
      targetDomain.name,
      'TXT',
      [
        `${config.paidPrefix}${targetDomain.verification_record}`,
        `forward-email=user:user@${targetDomain.name}`,
        `forward-email=user:backup@${externalDomain}`
      ],
      true,
      ms('5m')
    )
  );

  map.set(
    `mx:${externalDomain}`,
    resolver.spoofPacket(
      externalDomain,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  map.set(
    `a:${externalDomain}`,
    resolver.spoofPacket(externalDomain, 'A', [IP_ADDRESS], true, ms('5m'))
  );

  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
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
        from: 'external@test.com',
        to: `sender@${sourceDomain.name}`
      },
      raw: `
To: sender@${sourceDomain.name}
From: external@test.com
Subject: test mixed forward
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test mixed forwarding (same-domain + external)
`.trim()
    })
  );

  await pWaitFor(() => receivedEmails.length > 0, { timeout: ms('15s') });

  t.is(receivedEmails.length, 1, 'Email should be forwarded');
  t.true(
    receivedEmails[0].to.some((r) => r.address === `backup@${externalDomain}`),
    `Email should be addressed to backup@${externalDomain}`
  );
  // Same-domain address should NOT be in the recipients (it's dropped when there's an external)
  t.false(
    receivedEmails[0].to.some((r) => r.address === `user@${targetDomain.name}`),
    'Same-domain address should not be in recipients when external exists'
  );

  await externalMxServer.close();
  await smtp.close();
});

test('recursive forward: chain on same domain should deliver to target MX', async (t) => {
  // Scenario: source.com forwards to user@target.com
  // target.com has TXT:
  //   forward-email=user:other@target.com
  //   forward-email=other:another@target.com
  // target.com MX points to different server
  // Expected: email should be delivered to target.com's MX (chain is broken)

  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  const receivedEmails = [];

  const targetMxPort = await getPort();
  const targetMxServer = new SMTPServer({
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
        const buffer = Buffer.concat(chunks);
        receivedEmails.push({
          to: session.envelope.rcptTo,
          from: session.envelope.mailFrom,
          data: buffer.toString()
        });
        fn();
      });
    },
    logger: false,
    secure: false
  });
  await pify(targetMxServer.listen.bind(targetMxServer))(targetMxPort);

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

  const sourceDomain = await t.context.domainFactory
    .withState({
      name: `source-chain-${Date.now()}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver,
      smtp_port: targetMxPort.toString()
    })
    .create();

  const targetDomain = await t.context.domainFactory
    .withState({
      name: `target-chain-${Date.now()}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver,
      smtp_port: targetMxPort.toString()
    })
    .create();

  await t.context.aliasFactory
    .withState({
      name: 'sender',
      user: user._id,
      domain: sourceDomain._id,
      recipients: [`user@${targetDomain.name}`]
    })
    .create();

  const map = new Map();

  map.set(
    `mx:${sourceDomain.name}`,
    resolver.spoofPacket(
      sourceDomain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  map.set(
    `txt:${sourceDomain.name}`,
    resolver.spoofPacket(
      sourceDomain.name,
      'TXT',
      [`${config.paidPrefix}${sourceDomain.verification_record}`],
      true,
      ms('5m')
    )
  );

  map.set(
    `mx:${targetDomain.name}`,
    resolver.spoofPacket(
      targetDomain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  map.set(
    `a:${targetDomain.name}`,
    resolver.spoofPacket(targetDomain.name, 'A', [IP_ADDRESS], true, ms('5m'))
  );

  // Target domain TXT: chain of forwards all on same domain
  map.set(
    `txt:${targetDomain.name}`,
    resolver.spoofPacket(
      targetDomain.name,
      'TXT',
      [
        `${config.paidPrefix}${targetDomain.verification_record}`,
        `forward-email=user:other@${targetDomain.name}`,
        `forward-email=other:another@${targetDomain.name}`
      ],
      true,
      ms('5m')
    )
  );

  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  const mx = await asyncMxConnect({
    target: IP_ADDRESS,
    port: smtp.server.address().port,
    dnsOptions: {
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
        from: 'external@test.com',
        to: `sender@${sourceDomain.name}`
      },
      raw: `
To: sender@${sourceDomain.name}
From: external@test.com
Subject: test chain forward
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test chain forwarding on same domain should deliver to MX
`.trim()
    })
  );

  await pWaitFor(() => receivedEmails.length > 0, { timeout: ms('15s') });

  t.is(receivedEmails.length, 1, 'Email should be delivered to target MX');
  // The original address should be preserved (chain is broken at first same-domain hop)
  t.true(
    receivedEmails[0].to.some((r) => r.address === `user@${targetDomain.name}`),
    `Email should be addressed to original user@${targetDomain.name}`
  );

  await targetMxServer.close();
  await smtp.close();
});
