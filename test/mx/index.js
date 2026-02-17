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

const { ImapFlow } = require('imapflow');
const utils = require('../utils');

const MX = require('../../mx-server');
const SQLite = require('../../sqlite-server');
const IMAP = require('../../imap-server');

const Emails = require('#models/emails');
const SieveScripts = require('#models/sieve-scripts');
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
// Sieve filtering e2e tests
// These tests verify that Sieve scripts work correctly with MX delivery and IMAP storage
//

test('sieve fileinto - customer script: address :domain from gmail.com', async (t) => {
  // Set up SQLite server
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();

  // Set up IMAP server
  const imapPort = await getPort();
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  await imap.listen(imapPort);

  // Set up MX server
  const mxPort = await getPort();
  const mx = new MX({ client: t.context.client, wsp });
  // Share databaseMap so MX can reuse IMAP database connections
  mx.databaseMap = sqlite.databaseMap;
  await mx.listen(mxPort);
  const { resolver } = mx;

  // Create user with enhanced_protection plan
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

  // Create domain
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_mx_record: true,
      has_txt_record: true
    })
    .create();

  // Create alias with IMAP enabled
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [],
      has_imap: true,
      imap_backup_at: null
    })
    .create();

  // Create password for IMAP access
  const password = await alias.createToken();
  await alias.save();

  // Create Sieve script - exact customer script
  await SieveScripts.create({
    user: user._id,
    domain: domain._id,
    alias: alias._id,
    name: 'Customer Script',
    content: `require ["fileinto", "mailbox"];

if address :domain "from" "gmail.com"
{
    fileinto :create "System";
    stop;
}`,
    is_active: true
  });

  // Spoof DNS records
  const map = new Map();

  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true, ms('5m'))
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

  await resolver.options.cache.mset(map);

  // Set allowlist for local IP
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Connect to IMAP first to initialize the database for the alias
  const initImapClient = new ImapFlow({
    host: IP_ADDRESS,
    port: imapPort,
    secure: false,
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass: password
    },
    tls: { rejectUnauthorized: false },
    logger: false
  });
  await initImapClient.connect();
  // Select INBOX to ensure database is initialized
  await initImapClient.getMailboxLock('INBOX');
  await initImapClient.logout();

  // Send email from gmail.com via MX
  const mxConnection = await asyncMxConnect({
    target: IP_ADDRESS,
    port: mx.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    }
  });

  const transporter = nodemailer.createTransport({
    logger,
    debug: true,
    host: mxConnection.host,
    port: mxConnection.port,
    connection: mxConnection.socket,
    ignoreTLS: true,
    secure: false,
    tls
  });

  const testSubject = `Sieve test ${Date.now()}`;

  await t.notThrowsAsync(
    transporter.sendMail({
      envelope: {
        from: 'sender@gmail.com',
        to: [`${alias.name}@${domain.name}`]
      },
      raw: `
To: ${alias.name}@${domain.name}
From: Test User <sender@gmail.com>
Subject: ${testSubject}
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

This is a test email from gmail.com to test Sieve filtering.
`.trim()
    })
  );

  // Wait for message processing - check both System and INBOX
  await pWaitFor(
    async () => {
      try {
        const imapClient = new ImapFlow({
          host: IP_ADDRESS,
          port: imapPort,
          secure: false,
          auth: {
            user: `${alias.name}@${domain.name}`,
            pass: password
          },
          tls: { rejectUnauthorized: false },
          logger: false
        });

        await imapClient.connect();

        // Check if System folder exists and has messages
        let foundInSystem = false;
        let foundInInbox = false;
        try {
          const lock = await imapClient.getMailboxLock('System');
          try {
            foundInSystem = imapClient.mailbox.exists > 0;
          } finally {
            lock.release();
          }
        } catch {
          // Folder doesn't exist yet
        }

        // Also check INBOX
        try {
          const lock = await imapClient.getMailboxLock('INBOX');
          try {
            foundInInbox = imapClient.mailbox.exists > 0;
          } finally {
            lock.release();
          }
        } catch {
          // INBOX error
        }

        await imapClient.logout();
        return foundInSystem || foundInInbox;
      } catch {
        return false;
      }
    },
    { timeout: ms('30s'), interval: ms('1s') }
  );

  // Final verification - connect to IMAP and check System folder
  const imapClient = new ImapFlow({
    host: IP_ADDRESS,
    port: imapPort,
    secure: false,
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass: password
    },
    tls: { rejectUnauthorized: false },
    logger: false
  });

  await imapClient.connect();

  // Verify message is in System folder
  const lock = await imapClient.getMailboxLock('System');
  try {
    t.true(imapClient.mailbox.exists > 0, 'System folder should have messages');

    // Fetch the message to verify it's the right one
    const message = await imapClient.fetchOne('*', { envelope: true });
    t.is(message.envelope.subject, testSubject, 'Message subject should match');
  } finally {
    lock.release();
  }

  // Verify INBOX is empty (message should NOT be in INBOX)
  const inboxLock = await imapClient.getMailboxLock('INBOX');
  try {
    t.is(imapClient.mailbox.exists, 0, 'INBOX should be empty');
  } finally {
    inboxLock.release();
  }

  await imapClient.logout();

  // Cleanup
  await wsp.close();
  await sqlite.close();
  await imap.close();
  await mx.close();
});

test('sieve fileinto - address :domain does NOT match non-gmail sender', async (t) => {
  // Set up SQLite server
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();

  // Set up IMAP server
  const imapPort = await getPort();
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  await imap.listen(imapPort);

  // Set up MX server
  const mxPort = await getPort();
  const mx = new MX({ client: t.context.client, wsp });
  mx.databaseMap = sqlite.databaseMap;
  await mx.listen(mxPort);
  const { resolver } = mx;

  // Create user with enhanced_protection plan
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

  // Create domain
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_mx_record: true,
      has_txt_record: true
    })
    .create();

  // Create alias with IMAP enabled
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [],
      has_imap: true,
      imap_backup_at: null
    })
    .create();

  // Create password for IMAP access
  const password = await alias.createToken();
  await alias.save();

  // Create Sieve script - same customer script
  await SieveScripts.create({
    user: user._id,
    domain: domain._id,
    alias: alias._id,
    name: 'Customer Script',
    content: `require ["fileinto", "mailbox"];

if address :domain "from" "gmail.com"
{
    fileinto :create "System";
    stop;
}`,
    is_active: true
  });

  // Spoof DNS records
  const map = new Map();

  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true, ms('5m'))
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
      true
    )
  );

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
    `txt:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );

  // Spoof yahoo.com DMARC to allow test emails
  map.set(
    `txt:_dmarc.yahoo.com`,
    resolver.spoofPacket(
      `_dmarc.yahoo.com`,
      'TXT',
      [`v=DMARC1; p=none;`],
      true,
      ms('5m')
    )
  );

  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Connect to IMAP first to initialize the database for the alias
  const initImapClient = new ImapFlow({
    host: IP_ADDRESS,
    port: imapPort,
    secure: false,
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass: password
    },
    tls: { rejectUnauthorized: false },
    logger: false
  });
  await initImapClient.connect();
  // Select INBOX to ensure database is initialized
  await initImapClient.getMailboxLock('INBOX');
  await initImapClient.logout();

  // Send email from yahoo.com (NOT gmail.com) via MX
  const mxConnection = await asyncMxConnect({
    target: IP_ADDRESS,
    port: mx.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    }
  });

  const transporter = nodemailer.createTransport({
    logger,
    debug: true,
    host: mxConnection.host,
    port: mxConnection.port,
    connection: mxConnection.socket,
    ignoreTLS: true,
    secure: false,
    tls
  });

  const testSubject = `Sieve non-match test ${Date.now()}`;

  await t.notThrowsAsync(
    transporter.sendMail({
      envelope: {
        from: 'sender@yahoo.com',
        to: [`${alias.name}@${domain.name}`]
      },
      raw: `
To: ${alias.name}@${domain.name}
From: Test User <sender@yahoo.com>
Subject: ${testSubject}
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

This is a test email from yahoo.com - should go to INBOX not System.
`.trim()
    })
  );

  // Wait for message processing
  await pWaitFor(
    async () => {
      try {
        const imapClient = new ImapFlow({
          host: IP_ADDRESS,
          port: imapPort,
          secure: false,
          auth: {
            user: `${alias.name}@${domain.name}`,
            pass: password
          },
          tls: { rejectUnauthorized: false },
          logger: false
        });

        await imapClient.connect();
        const lock = await imapClient.getMailboxLock('INBOX');
        let found = false;
        try {
          found = imapClient.mailbox.exists > 0;
        } finally {
          lock.release();
        }

        await imapClient.logout();
        return found;
      } catch {
        return false;
      }
    },
    { timeout: ms('30s'), interval: ms('1s') }
  );

  // Final verification
  const imapClient = new ImapFlow({
    host: IP_ADDRESS,
    port: imapPort,
    secure: false,
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass: password
    },
    tls: { rejectUnauthorized: false },
    logger: false
  });

  await imapClient.connect();

  // Verify message is in INBOX (not System)
  const inboxLock = await imapClient.getMailboxLock('INBOX');
  try {
    t.true(imapClient.mailbox.exists > 0, 'INBOX should have messages');
    const message = await imapClient.fetchOne('*', { envelope: true });
    t.is(message.envelope.subject, testSubject, 'Message subject should match');
  } finally {
    inboxLock.release();
  }

  // Verify System folder doesn't exist or is empty
  try {
    const systemLock = await imapClient.getMailboxLock('System');
    try {
      t.is(imapClient.mailbox.exists, 0, 'System folder should be empty');
    } finally {
      systemLock.release();
    }
  } catch {
    // System folder doesn't exist - that's fine
    t.pass('System folder does not exist (expected)');
  }

  await imapClient.logout();

  // Cleanup
  await wsp.close();
  await sqlite.close();
  await imap.close();
  await mx.close();
});

test('sieve fileinto - header :contains from @gmail.com alternative', async (t) => {
  // Set up SQLite server
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();

  // Set up IMAP server
  const imapPort = await getPort();
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  await imap.listen(imapPort);

  // Set up MX server
  const mxPort = await getPort();
  const mx = new MX({ client: t.context.client, wsp });
  mx.databaseMap = sqlite.databaseMap;
  await mx.listen(mxPort);
  const { resolver } = mx;

  // Create user with enhanced_protection plan
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

  // Create domain
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_mx_record: true,
      has_txt_record: true
    })
    .create();

  // Create alias with IMAP enabled
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [],
      has_imap: true,
      imap_backup_at: null
    })
    .create();

  // Create password for IMAP access
  const password = await alias.createToken();
  await alias.save();

  // Create Sieve script - alternative using header :contains
  await SieveScripts.create({
    user: user._id,
    domain: domain._id,
    alias: alias._id,
    name: 'Header Contains Script',
    content: `require ["fileinto", "mailbox"];

if header :contains "from" "@gmail.com"
{
    fileinto :create "Gmail";
    stop;
}`,
    is_active: true
  });

  // Spoof DNS records
  const map = new Map();

  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true, ms('5m'))
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
      true
    )
  );

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
    `txt:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );

  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Connect to IMAP first to initialize the database for the alias
  const initImapClient = new ImapFlow({
    host: IP_ADDRESS,
    port: imapPort,
    secure: false,
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass: password
    },
    tls: { rejectUnauthorized: false },
    logger: false
  });
  await initImapClient.connect();
  // Select INBOX to ensure database is initialized
  await initImapClient.getMailboxLock('INBOX');
  await initImapClient.logout();

  // Send email from gmail.com via MX
  const mxConnection = await asyncMxConnect({
    target: IP_ADDRESS,
    port: mx.server.address().port,
    dnsOptions: {
      resolve: util.callbackify(resolver.resolve.bind(resolver))
    }
  });

  const transporter = nodemailer.createTransport({
    logger,
    debug: true,
    host: mxConnection.host,
    port: mxConnection.port,
    connection: mxConnection.socket,
    ignoreTLS: true,
    secure: false,
    tls
  });

  const testSubject = `Header contains test ${Date.now()}`;

  await t.notThrowsAsync(
    transporter.sendMail({
      envelope: {
        from: 'sender@gmail.com',
        to: [`${alias.name}@${domain.name}`]
      },
      raw: `
To: ${alias.name}@${domain.name}
From: Test User <sender@gmail.com>
Subject: ${testSubject}
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

This is a test email using header :contains matching.
`.trim()
    })
  );

  // Wait for message processing
  await pWaitFor(
    async () => {
      try {
        const imapClient = new ImapFlow({
          host: IP_ADDRESS,
          port: imapPort,
          secure: false,
          auth: {
            user: `${alias.name}@${domain.name}`,
            pass: password
          },
          tls: { rejectUnauthorized: false },
          logger: false
        });

        await imapClient.connect();

        let found = false;
        try {
          const lock = await imapClient.getMailboxLock('Gmail');
          try {
            found = imapClient.mailbox.exists > 0;
          } finally {
            lock.release();
          }
        } catch {
          // Folder doesn't exist yet
        }

        await imapClient.logout();
        return found;
      } catch {
        return false;
      }
    },
    { timeout: ms('30s'), interval: ms('1s') }
  );

  // Final verification
  const imapClient = new ImapFlow({
    host: IP_ADDRESS,
    port: imapPort,
    secure: false,
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass: password
    },
    tls: { rejectUnauthorized: false },
    logger: false
  });

  await imapClient.connect();

  // Verify message is in Gmail folder
  const lock = await imapClient.getMailboxLock('Gmail');
  try {
    t.true(imapClient.mailbox.exists > 0, 'Gmail folder should have messages');
    const message = await imapClient.fetchOne('*', { envelope: true });
    t.is(message.envelope.subject, testSubject, 'Message subject should match');
  } finally {
    lock.release();
  }

  await imapClient.logout();

  // Cleanup
  await wsp.close();
  await sqlite.close();
  await imap.close();
  await mx.close();
});

//
// =============================================================================
// RFC 3464 DSN Compliance Tests
// =============================================================================
//
// These tests verify that all DSN-related emails (vacation responders, bounce
// notifications, etc.) comply with RFC 3464 Section 2.2:
//
//   "The DSN MUST be addressed (in both the message header and the transport
//    envelope) to the return address from the transport envelope which
//    accompanied the original message for which the DSN was generated."
//
// Specifically, they assert:
//   1. MAIL FROM is <> (empty/null sender) for all DSN messages
//   2. RCPT TO (transport envelope) matches the original MAIL FROM address
//   3. The To: header in the DSN message matches the original MAIL FROM address
//   4. The message contains proper DSN headers (Auto-Submitted, Precedence)
//
// Reference: https://tools.ietf.org/html/rfc3464
// =============================================================================
//

test('RFC 3464 compliance - vacation responder DSN addresses To header and envelope to original MAIL FROM', async (t) => {
  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
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
      name: 'vactest',
      has_imap: true,
      user: user._id,
      domain: domain._id,
      recipients: [],
      vacation_responder: {
        is_enabled: true,
        start_date: new Date(),
        subject: 'Out of Office',
        message: 'I am currently out of the office.'
      }
    })
    .create();

  // spoof dns records
  const map = new Map();

  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true, ms('5m'))
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

  // spoof sender MX records
  map.set(
    'mx:sender.example.com',
    resolver.spoofPacket(
      'sender.example.com',
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );

  // spoof sender SPF so the message passes SPF check
  map.set(
    'txt:sender.example.com',
    resolver.spoofPacket(
      'sender.example.com',
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true
    )
  );

  // spoof sender DMARC with p=none so the message is not rejected
  map.set(
    'txt:_dmarc.sender.example.com',
    resolver.spoofPacket(
      '_dmarc.sender.example.com',
      'TXT',
      ['v=DMARC1; p=none;'],
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
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ],
      true
    )
  );

  await resolver.options.cache.mset(map);

  // set our local IP to allowlist so message does not get greylisted
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Send a message to the alias with vacation responder enabled
  // The envelope MAIL FROM is 'sender@sender.example.com' — this is the address
  // that the vacation responder DSN must be addressed to per RFC 3464
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
        // This is the envelope MAIL FROM — the return address that the DSN
        // must be addressed to per RFC 3464
        from: 'sender@sender.example.com',
        to: [`vactest@${domain.name}`]
      },
      raw: `
To: vactest@${domain.name}
From: Sender User <sender@sender.example.com>
Subject: Hello from sender
Message-ID: <rfc3464-vacation-test@sender.example.com>
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Hello, this is a test message.`.trim()
    })
  );

  // Wait for the vacation responder bounce email to be queued
  await pWaitFor(
    async () => {
      const exists = await Emails.exists({
        user: user._id,
        is_bounce: true
      });
      return Boolean(exists?._id);
    },
    { timeout: ms('15s') }
  );

  // Retrieve the vacation responder email
  const vacationEmail = await Emails.findOne({
    user: user._id,
    is_bounce: true
  });

  t.truthy(vacationEmail, 'Vacation responder email should be created');
  t.true(
    vacationEmail.is_bounce,
    'Vacation responder should be marked as bounce'
  );

  //
  // RFC 3464 compliance assertion #1:
  // The transport envelope 'to' must be the original MAIL FROM address
  //
  const envelopeTo = Array.isArray(vacationEmail.envelope.to)
    ? vacationEmail.envelope.to
    : [vacationEmail.envelope.to];
  t.true(
    envelopeTo.includes('sender@sender.example.com'),
    `Envelope 'to' must be the original MAIL FROM address (sender@sender.example.com), got: ${JSON.stringify(
      envelopeTo
    )}`
  );

  //
  // RFC 3464 compliance assertion #2:
  // The To: header in the DSN message must match the original MAIL FROM address
  //
  const rawMessage = await Emails.getMessage(vacationEmail.message, true);
  t.true(
    typeof rawMessage === 'string' && rawMessage.length > 0,
    'Vacation responder message should have content'
  );

  // Extract the To: header from the raw message
  const toHeaderMatch = rawMessage.match(/^to:\s*(.+)$/im);
  t.truthy(toHeaderMatch, 'Vacation responder message must have a To: header');
  t.true(
    toHeaderMatch[1].includes('sender@sender.example.com'),
    `To: header must contain the original MAIL FROM address (sender@sender.example.com), got: ${toHeaderMatch[1]}`
  );

  //
  // RFC 3464 compliance assertion #3:
  // Verify DSN-specific headers are present
  //
  t.true(
    rawMessage.includes('Auto-Submitted: auto-replied'),
    'Vacation responder must have Auto-Submitted: auto-replied header'
  );
  t.true(
    rawMessage.includes('Precedence: bulk'),
    'Vacation responder must have Precedence: bulk header'
  );
  t.true(
    rawMessage.includes('X-Autoreply: yes'),
    'Vacation responder must have X-Autoreply: yes header'
  );

  //
  // RFC 3464 compliance assertion #4:
  // Process the email through a dummy SMTP server and verify MAIL FROM is <>
  // and RCPT TO is the original sender
  //
  const dummyPort = await getPort();
  const capturedSessions = [];
  const capturedMessages = [];
  const dummyServer = new SMTPServer({
    disabledCommands: ['AUTH'],
    onMailFrom(address, session, fn) {
      // RFC 3464: DSN must be sent with MAIL FROM:<> (null sender)
      t.is(
        address.address,
        '',
        'MAIL FROM must be empty (<>) for DSN messages per RFC 3464'
      );
      fn();
    },
    onRcptTo(address, session, fn) {
      // RFC 3464: RCPT TO must be the original MAIL FROM address
      t.is(
        address.address,
        'sender@sender.example.com',
        'RCPT TO must be the original MAIL FROM address per RFC 3464'
      );
      capturedSessions.push({
        mailFrom: session.envelope.mailFrom,
        rcptTo: address
      });
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
        capturedMessages.push(buffer.toString());
        fn();
      });
    },
    logger: false,
    secure: false
  });

  await pify(dummyServer.listen.bind(dummyServer))(dummyPort);

  // Process the vacation responder email through the dummy SMTP server
  await processEmail({
    email: vacationEmail,
    port: dummyPort,
    resolver,
    client: t.context.client
  });

  // Verify the email was sent successfully
  const updatedEmail = await Emails.findById(vacationEmail._id);
  t.is(updatedEmail.status, 'sent', 'Vacation responder email should be sent');
  t.deepEqual(
    updatedEmail.accepted,
    ['sender@sender.example.com'],
    'Accepted recipient must be the original MAIL FROM address'
  );

  // Verify the captured message has correct To: header
  t.is(capturedMessages.length, 1, 'Exactly one message should be captured');
  const sentMessage = capturedMessages[0];
  const sentToMatch = sentMessage.match(/^to:\s*(.+)$/im);
  t.truthy(sentToMatch, 'Sent message must have a To: header');
  t.true(
    sentToMatch[1].includes('sender@sender.example.com'),
    `Sent message To: header must be the original MAIL FROM address, got: ${sentToMatch[1]}`
  );

  // Verify the In-Reply-To header references the original message
  t.true(
    sentMessage.includes(
      'In-Reply-To: <rfc3464-vacation-test@sender.example.com>'
    ),
    'Vacation responder must have In-Reply-To referencing the original message'
  );

  await dummyServer.close();
  await smtp.close();
});

test('RFC 3464 compliance - vacation responder with SRS-rewritten MAIL FROM addresses To header to unwrapped address', async (t) => {
  const smtp = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  const { resolver } = smtp;
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
      name: 'srstest',
      has_imap: true,
      user: user._id,
      domain: domain._id,
      recipients: [],
      vacation_responder: {
        is_enabled: true,
        start_date: new Date(),
        subject: 'Out of Office (SRS)',
        message: 'I am currently out of the office (SRS test).'
      }
    })
    .create();

  // The original sender address before SRS rewriting
  const originalSender = 'original@sender.example.com';

  // Create an SRS-rewritten version of the sender address
  // (this simulates what happens when a message is forwarded through an SRS-aware server)
  const srsAddress = srs.forward(originalSender, env.WEB_HOST);

  // spoof dns records
  const map = new Map();

  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true, ms('5m'))
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

  // spoof sender MX records (for the original sender domain)
  map.set(
    'mx:sender.example.com',
    resolver.spoofPacket(
      'sender.example.com',
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );

  // spoof sender SPF so the message passes SPF check
  map.set(
    'txt:sender.example.com',
    resolver.spoofPacket(
      'sender.example.com',
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true
    )
  );

  // spoof sender DMARC with p=none so the message is not rejected
  map.set(
    'txt:_dmarc.sender.example.com',
    resolver.spoofPacket(
      '_dmarc.sender.example.com',
      'TXT',
      ['v=DMARC1; p=none;'],
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
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ],
      true
    )
  );

  await resolver.options.cache.mset(map);

  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  // Send a message with an SRS-rewritten envelope MAIL FROM
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
        // SRS-rewritten envelope MAIL FROM
        // checkSRS should unwrap this to 'original@sender.example.com'
        from: srsAddress,
        to: [`srstest@${domain.name}`]
      },
      raw: `
To: srstest@${domain.name}
From: Original Sender <original@sender.example.com>
Subject: Hello from SRS sender
Message-ID: <rfc3464-srs-vacation-test@sender.example.com>
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Hello, this is a test message with SRS-rewritten MAIL FROM.`.trim()
    })
  );

  // Wait for the vacation responder bounce email to be queued
  await pWaitFor(
    async () => {
      const exists = await Emails.exists({
        user: user._id,
        is_bounce: true
      });
      return Boolean(exists?._id);
    },
    { timeout: ms('15s') }
  );

  const vacationEmail = await Emails.findOne({
    user: user._id,
    is_bounce: true
  });

  t.truthy(vacationEmail, 'Vacation responder email should be created');

  //
  // RFC 3464 compliance: When MAIL FROM is SRS-rewritten, the DSN must be
  // addressed to the unwrapped original address (not the SRS address).
  // Both the To: header and envelope 'to' must match.
  //
  const envelopeTo = Array.isArray(vacationEmail.envelope.to)
    ? vacationEmail.envelope.to
    : [vacationEmail.envelope.to];
  t.true(
    envelopeTo.includes(originalSender),
    `Envelope 'to' must be the SRS-unwrapped original address (${originalSender}), got: ${JSON.stringify(
      envelopeTo
    )}`
  );

  const rawMessage = await Emails.getMessage(vacationEmail.message, true);
  const toHeaderMatch = rawMessage.match(/^to:\s*(.+)$/im);
  t.truthy(toHeaderMatch, 'Vacation responder message must have a To: header');
  t.true(
    toHeaderMatch[1].includes(originalSender),
    `To: header must contain the SRS-unwrapped original address (${originalSender}), got: ${toHeaderMatch[1]}`
  );

  //
  // Verify consistency: To: header and envelope 'to' must match
  //
  t.true(
    toHeaderMatch[1].includes(envelopeTo[0]),
    'To: header and envelope to must be consistent (both the same address)'
  );

  await smtp.close();
});
