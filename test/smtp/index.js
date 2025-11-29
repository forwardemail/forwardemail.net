/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const util = require('node:util');
const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const Client = require('nodemailer/lib/smtp-connection');
const Redis = require('ioredis-mock');
const bytes = require('@forwardemail/bytes');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('mx-connect');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('@forwardemail/smtp-server');
const { randomstring } = require('@sidoshi/random-string');

const utils = require('../utils');
const API = require('../../api-server');
const SMTP = require('../../smtp-server');
const _ = require('#helpers/lodash');

const config = require('#config');
const createPassword = require('#helpers/create-password');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const isValidPassword = require('#helpers/is-valid-password');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const { Emails } = require('#models');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
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

test('starttls required for non-secure auth', async (t) => {
  const secure = false;
  const smtp = new SMTP({ client: t.context.client }, secure);
  const { resolver } = smtp;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

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
    ignoreTLS: true, // <--- this causes the test to error (which is what we want)
    // set `secure` to `true` for port 465 otherwise `false` for port 587, 2587, 25, and 2525
    secure,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: 'test@test.com',
      pass: Array.from({ length: 24 }).fill('0')
    }
  });

  const err = await t.throwsAsync(
    transporter.sendMail({
      envelope: {
        from: 'test@test.com',
        to: 'test@test.com'
      },
      raw: `
To: test@test.com
From: test@test.com
Subject: test
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
    })
  );

  t.is(err.responseCode, 538);
  t.is(err.response, '538 5.7.0 Error: Must issue a STARTTLS command first');

  await smtp.close();
});

test('starttls disabled for secure auth', async (t) => {
  const secure = true;
  const smtp = new SMTP({ client: t.context.client }, secure);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

  {
    const transporter = nodemailer.createTransport({
      logger,
      debug: true,
      host: IP_ADDRESS,
      port,
      ignoreTLS: true,
      // set `secure` to `true` for port 465 otherwise `false` for port 587, 2587, 25, and 2525
      secure,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: 'test@test.com',
        pass: Array.from({ length: 24 }).fill('0')
      }
    });

    const err = await t.throwsAsync(
      transporter.sendMail({
        envelope: {
          from: 'test@test.com',
          to: 'test@test.com'
        },
        raw: `
To: test@test.com
From: test@test.com
Subject: test
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
      })
    );

    t.is(err.responseCode, 535);
    t.is(
      err.response,
      '535 5.7.8 Domain is missing TXT verification record, go to http://example.com:3000/my-account/domains/test.com and click "Verify"'
    );
  }

  {
    const transporter = nodemailer.createTransport({
      logger,
      debug: true,
      host: IP_ADDRESS,
      port,
      requireTLS: true,
      secure,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: 'test@test.com',
        pass: Array.from({ length: 24 }).fill('0')
      }
    });

    const err = await t.throwsAsync(
      transporter.sendMail({
        envelope: {
          from: 'test@test.com',
          to: 'test@test.com'
        },
        raw: `
To: test@test.com
From: test@test.com
Subject: test
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
      })
    );

    t.is(err.responseCode, 535);
    t.is(
      err.response,
      '535 5.7.8 Domain is missing TXT verification record, go to http://example.com:3000/my-account/domains/test.com and click "Verify"'
    );
  }

  await smtp.close();
});

test('auth with catch-all pass', async (t) => {
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

  await alias.save();

  // generate password for domain
  const { password, salt, hash } = await createPassword();
  domain.tokens.push({
    description: 'test',
    salt,
    hash,
    user: user._id
  });
  domain.skip_verification = true;
  await domain.save();

  // spoof dns records
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

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  const transporter = nodemailer.createTransport({
    logger,
    debug: true,
    host: IP_ADDRESS,
    port,
    ignoreTLS: true,
    secure: true,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: `${Math.random()}@${domain.name}`,
      pass: password
    }
  });

  await t.notThrowsAsync(
    transporter.sendMail({
      envelope: {
        from: `${Math.random()}@${domain.name}`,
        to: 'test@test.com'
      },
      raw: `
To: test@test.com
From: ${Math.random()}@${domain.name}
Subject: test
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
    })
  );

  await smtp.close();
});

test('auth with pass as alias', async (t) => {
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

  await alias.createToken();
  await alias.save();

  // spoof dns records
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

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  {
    const transporter = nodemailer.createTransport({
      logger,
      debug: true,
      host: IP_ADDRESS,
      port,
      ignoreTLS: true,
      secure: true,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: `${alias.name}@${domain.name}`,
        pass: 'test'
      }
    });

    const err = await t.throwsAsync(
      transporter.sendMail({
        envelope: {
          from: `${alias.name}@${domain.name}`,
          to: 'test@test.com'
        },
        raw: `
To: test@test.com
From: test@test.com
Subject: test
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
      })
    );

    t.is(err.responseCode, 535);
    t.regex(err.message, /Invalid password/);
  }

  const noReplyAlias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      name: 'no-reply'
    })
    .create();
  const pass = await noReplyAlias.createToken();
  await noReplyAlias.save();

  {
    const transporter = nodemailer.createTransport({
      logger,
      debug: true,
      host: IP_ADDRESS,
      port,
      ignoreTLS: true,
      secure: true,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: `${noReplyAlias.name}@${domain.name}`,
        pass
      }
    });

    const err = await t.throwsAsync(
      transporter.sendMail({
        envelope: {
          from: `${noReplyAlias.name}@${domain.name}`,
          to: 'test@test.com'
        },
        raw: `
To: test@test.com
From: test@test.com
Subject: test
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
      })
    );
    t.is(err.responseCode, 550);
    t.regex(err.message, /From header must be equal to/);
  }

  await smtp.close();
});

test('auth with catch-all password when alias exists too', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, true);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const testPort = await getPort();
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
      recipients: [user.email],
      name: 'beep-baz-boop'
    })
    .create();

  await alias.createToken();
  await alias.save();

  // generate password for domain
  const { password, salt, hash } = await createPassword();
  domain.tokens.push({
    description: 'test',
    salt,
    hash,
    user: user._id
  });
  domain.skip_verification = true;
  await domain.save();

  // spoof dns records
  const map = new Map();

  // spoof test@test.com mx records
  map.set(
    'mx:test.com',
    resolver.spoofPacket(
      'test.com',
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
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ],
      true,
      ms('5m')
    )
  );

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  const transporter = nodemailer.createTransport({
    logger,
    debug: true,
    host: IP_ADDRESS,
    port,
    ignoreTLS: true,
    secure: true,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: `${Math.random()}@${domain.name}`,
      pass: password
    }
  });

  await t.notThrowsAsync(
    transporter.sendMail({
      envelope: {
        from: `${alias.name}@${domain.name}`,
        to: ['test@test.com', 'test-2@test.com']
      },
      raw: `
To: test@test.com, test-2@test.com
From: ${alias.name}@${domain.name}
Subject: test
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
    })
  );

  const email = await Emails.findOne({
    'envelope.from': `${alias.name}@${domain.name}`
  });

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
        fn();
      });
    },
    logger,
    secure: false
  });

  // start test smtp server
  await pify(server.listen.bind(server))(testPort);

  // process the email
  await t.notThrowsAsync(
    processEmail({
      email,
      port: testPort,
      resolver,
      client
    })
  );

  await smtp.close();
});

test('automatic openpgp support', async (t) => {
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
      has_smtp: true,
      resolver
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const map = new Map();

  // spoof forwardemail.net mx records
  map.set(
    'mx:forwardemail.net',
    resolver.spoofPacket(
      'forwardemail.net',
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

  await resolver.options.cache.mset(map);

  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to: 'support@forwardemail.net',
      subject: 'test',
      text: 'test'
    },
    user: user._id
  });

  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const testPort = await getPort();
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
        fn();
      });
    },
    logger,
    secure: false
  });

  // start test smtp server
  await pify(server.listen.bind(server))(testPort);

  //
  // process the email
  //
  const info = await processEmail({
    email,
    port: testPort,
    resolver,
    client
  });

  t.true(info[0].pgp);
});

test('smtp outbound auth', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
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
  t.true(typeof pass === 'string' && pass.length === 24);
  await alias.save();

  const isValid = await isValidPassword(alias.tokens, pass);

  t.true(isValid);

  const combos = [
    { user: 'a', pass: 'a' },
    { user: `beep@${domain.name}`, pass },
    { user: `${alias.name}@${domain.name.replace('.com', '')}`, pass },
    { user: alias.name, pass }
  ];

  // invalid combos
  await Promise.all(
    combos.map(async (combo) => {
      await new Promise((resolve) => {
        const connection = new Client({ port, tls });
        connection.connect(() => {
          connection.login(combo, (err) => {
            t.is(err.responseCode, 535);
            // TODO: test err.response
            connection.close();
          });
        });
        connection.once('end', () => resolve());
      });
    })
  );

  // spoof dns records
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

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  // success
  await new Promise((resolve) => {
    const connection = new Client({ port, tls });
    connection.connect(() => {
      connection.login(
        { user: `${alias.name}@${domain.name}`, pass },
        (err) => {
          t.is(err, null);
          connection.close();
        }
      );
    });
    connection.once('end', () => resolve());
  });

  await smtp.close();
});

test(`unicode domain`, async (t) => {
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

  const smtp = new SMTP({ client: t.context.client }, false);
  const { resolver } = smtp;

  const domain = await t.context.domainFactory
    .withState({
      name: '日本語.org',
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver
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

  await resolver.options.cache.mset(map);

  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to: 'test@test.com',
      subject: 'test',
      text: 'test'
    },
    user: user._id
  });

  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const testPort = await getPort();
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
        fn();
      });
    },
    logger,
    secure: false
  });

  // start test smtp server
  await pify(server.listen.bind(server))(testPort);

  //
  // process the email
  //
  await t.notThrowsAsync(
    processEmail({
      email,
      port: testPort,
      resolver,
      client
    })
  );

  // run do a similar test using SMTP connection
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);

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
    // ignoreTLS: true,
    // set `secure` to `true` for port 465 otherwise `false` for port 587, 2587, 25, and 2525
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass
    }
  });

  const messageId = `${randomstring({
    characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 10
  })}@${domain.name}`;

  await transporter.sendMail({
    envelope: {
      from: `${alias.name}@${domain.name}`,
      to: 'test@foo.com'
    },
    raw: `
Message-ID: <${messageId}>
To: test@test.com
List-Unsubscribe: foo@foo.com
From: Test <${alias.name}@${domain.name}>
Subject: testing this
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
  });

  {
    const email = await Emails.findOne({
      messageId
    })
      .lean()
      .exec();
    t.true(email !== null);

    const message = await Emails.getMessage(email.message, true);
    t.true(message.includes(`Message-ID: <${messageId}>`));
    t.true(message.includes(`From: Test <${alias.name}@${domain.name}>`));

    //
    // process the email
    //
    await t.notThrowsAsync(
      processEmail({
        email,
        port: testPort,
        resolver,
        client
      })
    );
  }
});

/*
test(`10MB message size`, async (t) => {
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
      has_smtp: true,
      resolver
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const map = new Map();

  // spoof test@test.com mx records
  map.set(
    'mx:test.com',
    resolver.spoofPacket(
      'test.com', 'MX', [{ exchange: IP_ADDRESS, priority: 0 }], true, ms('5m'))
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
      `${domain.dkim_key_selector}._domainkey.${domain.name}`, 'TXT', [`v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`], true, ms('5m'))
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
      `${domain.return_path}.${domain.name}`, 'CNAME', [env.WEB_HOST], true, ms('5m'))
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
      `_dmarc.${domain.name}`, 'TXT', [
        // TODO: consume dmarc reports and parse dmarc-$domain
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ], true, ms('5m'))
  );

  await resolver.options.cache.mset(map);

  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to: 'test@test.com',
      subject: 'test',
      text: 'test',
      attachments: [
        {
          filename: 'test.txt',
          content: Buffer.alloc(bytes('10MB'))
        }
      ]
    },
    user: user._id
  });

  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const testPort = await getPort();
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
        fn();
      });
    },
    logger,
    secure: false
  });

  // start test smtp server
  await pify(server.listen.bind(server))(testPort);

  //
  // process the email
  //
  await t.notThrowsAsync(
    processEmail({
      email,
      port: testPort,
      resolver,
      client
    })
  );
});

test(`16MB message size`, async (t) => {
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
      has_smtp: true,
      resolver
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

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
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name, 'TXT', [`${config.paidPrefix}${domain.verification_record}`], true, ms('5m'))
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
      `${env.WEB_HOST}`, 'TXT', [`v=spf1 ip4:${IP_ADDRESS} -all`], true, ms('5m'))
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
      `${domain.return_path}.${domain.name}`, 'TXT', [`v=spf1 ip4:${IP_ADDRESS} -all`], true, ms('5m'))
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

  await resolver.options.cache.mset(map);

  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to: 'test@test.com',
      subject: 'test',
      text: 'test',
      attachments: [
        {
          filename: 'test.txt',
          content: Buffer.alloc(bytes('16MB'))
        }
      ]
    },
    user: user._id
  });

  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const testPort = await getPort();
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
        fn();
      });
    },
    logger,
    secure: false
  });

  // start test smtp server
  await pify(server.listen.bind(server))(testPort);

  //
  // process the email
  //
  await t.notThrowsAsync(
    processEmail({
      email,
      port: testPort,
      resolver,
      client
    })
  );
});
*/

test(`${env.SMTP_MESSAGE_MAX_SIZE} message size`, async (t) => {
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
      has_smtp: true,
      resolver
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const err = await t.throwsAsync(
    Emails.queue({
      message: {
        from: `${alias.name}@${domain.name}`,
        to: 'test@test.com',
        subject: 'test',
        text: 'test',
        attachments: [
          {
            filename: 'test.txt',
            content: Buffer.alloc(bytes(env.SMTP_MESSAGE_MAX_SIZE))
          }
        ]
      },
      user: user._id
    })
  );
  t.is(
    err.message,
    `Email size of ${bytes(bytes(env.SMTP_MESSAGE_MAX_SIZE))} exceeded.`
  );
});

test('smtp outbound queue', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
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

  {
    // spoof dns records
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
          `v=DMARC1; p=reject; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
        ],
        true
      )
    );

    // store spoofed dns cache
    await resolver.options.cache.mset(map);
  }

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
    // ignoreTLS: true,
    // set `secure` to `true` for port 465 otherwise `false` for port 587, 2587, 25, and 2525
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass
    }
  });

  const messageId = `${randomstring({
    characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 10
  })}@${domain.name}`;

  const RCPT_TO = [
    'a@xyz.com',
    'b@xyz.com',
    'beep@boop.com',
    'foo@bar.com',
    'test@foo.com'
  ];

  const info = await transporter.sendMail({
    envelope: {
      from: `${alias.name}@${domain.name}`,
      to: RCPT_TO
    },
    raw: `
Sender: baz@beep.com
Cc: beep@boop.com,beep@boop.com
Bcc: foo@bar.com,a@xyz.com,b@xyz.com
Reply-To: Beep boop@beep.com
Message-ID: <${messageId}>
To: test@foo.com
From: Test <${alias.name}@${domain.name}>
Subject: testing this
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
  });

  // info.accepted
  // info.rejected
  // info.rejectedErrors
  t.deepEqual(
    info.accepted.sort(),
    [
      'test@foo.com',
      'beep@boop.com',
      'foo@bar.com',
      'a@xyz.com',
      'b@xyz.com'
    ].sort()
  );

  let email = await Emails.findOne({
    messageId
  })
    .lean()
    .exec();
  t.true(email !== null);
  t.is(email.headers.From, `Test <${alias.name}@${domain.name}>`);
  t.is(email.headers['Reply-To'], 'Beep boop@beep.com');
  t.is(email.status, 'queued');

  // validate envelope
  t.is(email.envelope.from, `${alias.name}@${domain.name}`);
  t.deepEqual(email.envelope.to, RCPT_TO);

  // validate message-id
  t.is(email.messageId, messageId);

  //
  // spoof envelope RCPT TO mx records
  //
  // - a@xyz.com
  // - b@xyz.com
  // - beep@boop.com
  // - foo@bar.com
  // - test@foo.com <-- last one gets rejected
  //
  {
    const map = new Map();
    for (const to of email.envelope.to) {
      const [, domain] = to.split('@');
      map.set(
        `mx:${domain}`,
        resolver.spoofPacket(
          domain,
          'MX',
          [{ exchange: IP_ADDRESS, priority: 0 }],
          true,
          ms('5m')
        )
      );
    }

    await resolver.options.cache.mset(map);
  }

  // spin up a test smtp server that simply responds with OK
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const testPort = await getPort();
  let attempted = false;
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onRcptTo(address, session, fn) {
      if (!attempted && address?.address === email.envelope.to.slice(-1)[0]) {
        attempted = true;
        const err = new Error('Rejected!');
        // NOTE: smtp-server will close connection early if it's 421
        err.responseCode = 450;
        err.response = '450 4.2.1 Rejected!';
        return fn(err);
      }

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
        fn();
      });
    },
    logger,
    secure: false
  });

  // start test smtp server
  await pify(server.listen.bind(server))(testPort);

  //
  // process the email
  //
  await processEmail({
    email,
    port: testPort,
    resolver,
    client
  });

  //
  // ensure email delivered except 1 address which will be retried next send
  //
  email = await Emails.findById(email._id).lean().exec();
  delete email.message;
  t.is(email.status, 'deferred');
  t.deepEqual(email.accepted.sort(), email.envelope.to.slice(0, -1).sort());
  t.true(email.rejectedErrors.length === 1);
  t.is(email.rejectedErrors[0].code, 'EENVELOPE');
  t.is(email.rejectedErrors[0].response, '450 Rejected!');
  t.is(email.rejectedErrors[0].responseCode, 450);
  t.is(email.rejectedErrors[0].command, 'RCPT TO');
  t.is(email.rejectedErrors[0].recipient, email.envelope.to.slice(-1)[0]);

  // process the email again and let the deferred go through this time
  email = await Emails.findById(email._id).lean().exec();
  t.is(email.status, 'deferred');
  email.status = 'queued';
  await Emails.findByIdAndUpdate(email._id, {
    $set: { is_locked: false, status: 'queued' },
    $unset: { locked_at: 1, locked_by: 1 }
  });
  email = await Emails.findById(email._id).lean().exec();
  t.is(email.status, 'queued');
  t.is(email.is_locked, false);
  t.is(email.locked_at, undefined);
  t.is(email.locked_by, undefined);

  await processEmail({
    email,
    port: testPort,
    resolver,
    client
  });

  // ensure sent
  email = await Emails.findById(email._id).lean().exec();
  delete email.message;
  t.is(email.status, 'sent');
  t.deepEqual(email.accepted.sort(), email.envelope.to);
  t.deepEqual(email.rejectedErrors, []);

  await smtp.close();
});

test('smtp rate limiting', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
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

  {
    // spoof dns records
    const map = new Map();

    // custom expiry since this test takes longer
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
        true,
        expires
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
        true,
        expires
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
        true,
        ms('5m')
      )
    );

    // store spoofed dns cache
    await resolver.options.cache.mset(map);
  }

  // from n to limit, it should not error
  for (let i = 1; i <= config.smtpLimitMessages + 10; i++) {
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
      // ignoreTLS: true,
      // set `secure` to `true` for port 465 otherwise `false` for port 587, 2587, 25, and 2525
      secure: false,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: `${alias.name}@${domain.name}`,
        pass
      }
    });

    if (i > config.smtpLimitMessages) {
      const err = await t.throwsAsync(
        transporter.sendMail({
          envelope: {
            from: `${alias.name}@${domain.name}`,
            to: ['test@foo.com']
          },
          raw: `
To: test@foo.com
From: Test <${alias.name}@${domain.name}>
Subject: testing this
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
        })
      );

      t.is(err.responseCode, 550);
      t.is(err.response, '550 5.1.1 Rate limit exceeded');
    } else {
      const info = await transporter.sendMail({
        envelope: {
          from: `${alias.name}@${domain.name}`,
          to: ['test@foo.com']
        },
        raw: `
To: test@foo.com
From: Test <${alias.name}@${domain.name}>
Subject: testing this
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
      });

      t.deepEqual(info.accepted, ['test@foo.com']);
    }
  }

  await smtp.close();
});

// does not allow domain-wide catch-all to send with a different domain in From header nor MAIL FROM
test('does not allow differing domain with domain-wide catch-all', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
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
      resolver,
      has_smtp: true
    })
    .create();

  const { password, salt, hash } = await createPassword();
  domain.tokens.push({
    description: 'test',
    salt,
    hash,
    user: user._id
  });
  domain.skip_verification = true;
  await domain.save();

  const alias = await t.context.aliasFactory
    .withState({
      name: '*',
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  await alias.save();

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
    // ignoreTLS: true,
    // set `secure` to `true` for port 465 otherwise `false` for port 587, 2587, 25, and 2525
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass: password
    }
  });

  const messageId = `${randomstring({
    characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 10
  })}@${domain.name}`;

  const err = await t.throwsAsync(
    transporter.sendMail({
      envelope: {
        from: `${alias.name}@someotherdomain.com`,
        to: 'test@foo.com'
      },
      raw: `
Message-ID: <${messageId}>
To: test@foo.com
From: Test <${alias.name}@someotherdomain.com>
Subject: testing this
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
    })
  );

  t.is(
    err.message,
    `Message failed: 550 5.1.1 From header must end with @${domain.name}`
  );
});

test('requires newsletter approval', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
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
    // ignoreTLS: true,
    // set `secure` to `true` for port 465 otherwise `false` for port 587, 2587, 25, and 2525
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass
    }
  });

  const messageId = `${randomstring({
    characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 10
  })}@${domain.name}`;

  await transporter.sendMail({
    envelope: {
      from: `${alias.name}@${domain.name}`,
      to: 'test@foo.com'
    },
    raw: `
Message-ID: <${messageId}>
To: test@foo.com
List-Unsubscribe: foo@foo.com
From: Test <${alias.name}@${domain.name}>
Subject: testing this
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
  });

  let email = await Emails.findOne({
    messageId
  })
    .lean()
    .exec();
  t.true(email !== null);

  //
  // process the email
  //
  await processEmail({
    email,
    resolver,
    client
  });

  email = await Emails.findOne({
    messageId
  })
    .lean()
    .exec();

  t.is(
    email.rejectedErrors[0].message,
    'Newsletter usage is not yet approved for your account, please wait for approval or contact us for support.'
  );
});

test('bounce webhook', async (t) => {
  const resolver = createTangerine(t.context.client, logger);

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

  const message = {
    from: `${alias.name}@${domain.name}`,
    to: ['test@foo.com', 'beep@foo.com', 'baz@foo.com'],
    subject: 'test',
    text: 'test'
  };

  // TODO: email helper should use this
  const email = await Emails.queue({ message, user });

  t.is(email.status, 'queued');

  // spoof dns records
  const map = new Map();

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

  // spoof envelope RCPT TO mx records
  for (const to of message.to) {
    const [, domain] = to.split('@');
    map.set(
      `mx:${domain}`,
      resolver.spoofPacket(
        `mx:${domain}`,
        'MX',
        [{ exchange: IP_ADDRESS, priority: 0 }],
        true,
        ms('5m')
      )
    );
  }

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  // spin up a test smtp server that simply responds with OK
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onRcptTo(address, session, fn) {
      // 250 for 0th key
      if (address?.address === message.to[0]) return fn();
      // 421 for 1st key
      if (address?.address === message.to[1]) {
        const err = new Error('Soft rejection');
        err.responseCode = 421;
        err.response = '421 4.4.2 Soft';
        return fn(err);
      }

      // 550 for 2nd key
      if (address?.address === message.to[2]) {
        const err = new Error('Hard rejection');
        err.responseCode = 550;
        err.response = '550 5.1.1 Hard';
        return fn(err);
      }

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
        fn();
      });
    },
    logger,
    secure: false
  });

  // start test smtp server
  await pify(server.listen.bind(server))(port);

  // configure bounce webhook
  const api = new API({ logger });
  const results = {};
  let signatures = 0;
  api.app.use(async (ctx) => {
    if (ctx.headers['x-webhook-signature']) signatures++;
    results[ctx.request.body.recipient] = ctx.request.body;
    ctx.status = 200;
  });
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const apiPort = await getPort();
  await api.listen(apiPort);

  // update the domain to use this webhook
  domain.bounce_webhook = `http://${IP_ADDRESS}:${apiPort}/bounce?test=true`;
  await domain.save();

  await processEmail({
    email,
    port,
    resolver,
    client
  });

  await pWaitFor(() => Object.keys(results).length === message.to.length - 1);

  t.is(Object.keys(results).length, 2);
  t.is(signatures, 2);

  t.is(results[message.to[1]].response_code, 421);
  t.is(results[message.to[2]].response_code, 550);

  // ensure bounce webhook has all properties we document in our FAQ
  for (const key of Object.keys(results)) {
    t.deepEqual(
      _.sortBy(Object.keys(results[key])),
      _.sortBy([
        'email_id',
        'recipient',
        'message',
        'response',
        'response_code',
        'truth_source',
        'bounce',
        'headers',
        'bounced_at'
      ])
    );
  }
});

test('DSN failure bounce notifications with NOTIFY parameters', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const smtpPort = await getPort();
  await smtp.listen(smtpPort);

  const port = await getPort();
  const { resolver } = smtp;

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

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const pass = await alias.createToken();
  t.true(typeof pass === 'string' && pass.length === 24);
  await alias.save();

  const isValid = await isValidPassword(alias.tokens, pass);

  t.true(isValid);

  const map = new Map();

  // spoof foo.com mx records
  map.set(
    'mx:foo.com',
    resolver.spoofPacket(
      'foo.com',
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );

  // spoof domain TXT record for verification
  map.set(
    'txt:foo.com',
    resolver.spoofPacket(
      'foo.com',
      'TXT',
      [
        // Set custom port
        `forward-email-port=${port.toString()}`,
        // Create catch-all alias (active)
        `forward-email=test@${IP_ADDRESS}`
      ],
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
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ],
      true,
      ms('5m')
    )
  );

  await resolver.options.cache.mset(map);

  // Mock SMTP server that rejects messages
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onRcptTo(address, session, fn) {
      fn();
    },
    onMailFrom(address, session, fn) {
      fn();
    },
    onData(stream, session, fn) {
      const writer = new Writable({
        write(chunk, encoding, fn) {
          fn();
        }
      });
      stream.pipe(writer);
      stream.on('end', () => {
        const err = new Error('Error');
        err.responseCode = 550; // trigger permanent failure
        fn(err);
      });
    },
    logger,
    secure: false
  });

  server.listen(port);

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
    // ignoreTLS: true,
    // set `secure` to `true` for port 465 otherwise `false` for port 587, 2587, 25, and 2525
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass
    }
  });

  // Create test message with DSN parameters
  const messageId = `${randomstring({
    characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 10
  })}@${domain.name}`;
  await transporter.sendMail({
    envelope: {
      from: `${alias.name}@${domain.name}`,
      to: 'foo@foo.com',
      dsn: {
        id: 'TEST-ENVELOPE-IDENTIFIER',
        return: 'full',
        notify: ['success', 'failure', 'delay'],
        recipient: 'foo@foo.com'
      }
    },
    raw: `
Message-ID: <${messageId}>
To: foo@foo.com
From: ${alias.name}@${domain.name}
Subject: Test DSN Message
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
  });

  {
    const email = await Emails.findOne({
      messageId
    })
      .lean()
      .exec();
    t.true(email !== null);

    const message = await Emails.getMessage(email.message, true);
    t.true(message.includes(`Message-ID: <${messageId}>`));
    t.true(message.includes(`From: ${alias.name}@${domain.name}`));

    //
    // process the email
    //
    const results = await processEmail({
      email,
      port,
      resolver,
      client
    });
    // results = [
    //   {
    //     accepted: [],
    //     rejected: 'foo@foo.com',
    //     rejectedErrors: [
    //       Object { … },
    //     ],
    //   },
    // ]
    t.true(results[0].accepted.length === 0);
    t.is(results[0].rejected, 'foo@foo.com');
    t.is(results[0].rejectedErrors[0].responseCode, 550);
  }

  // Wait to ensure bounce notification is queued
  await pWaitFor(
    async () => {
      const exists = await Emails.exists({
        subject: 'Delivery Status Notification (Failure)'
      });
      return Boolean(exists);
    },
    { timeout: ms('5s') }
  );

  await server.close();
  await smtp.close();
});

test('DSN delay bounce notifications with NOTIFY parameters', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const smtpPort = await getPort();
  await smtp.listen(smtpPort);

  const port = await getPort();
  const { resolver } = smtp;

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

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const pass = await alias.createToken();
  t.true(typeof pass === 'string' && pass.length === 24);
  await alias.save();

  const isValid = await isValidPassword(alias.tokens, pass);

  t.true(isValid);

  const map = new Map();

  // spoof foo.com mx records
  map.set(
    'mx:foo.com',
    resolver.spoofPacket(
      'foo.com',
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );

  // spoof domain TXT record for verification
  map.set(
    'txt:foo.com',
    resolver.spoofPacket(
      'foo.com',
      'TXT',
      [
        // Set custom port
        `forward-email-port=${port.toString()}`,
        // Create catch-all alias (active)
        `forward-email=test@${IP_ADDRESS}`
      ],
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
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ],
      true,
      ms('5m')
    )
  );

  await resolver.options.cache.mset(map);

  // Mock SMTP server that rejects messages
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onRcptTo(address, session, fn) {
      fn();
    },
    onMailFrom(address, session, fn) {
      fn();
    },
    onData(stream, session, fn) {
      const writer = new Writable({
        write(chunk, encoding, fn) {
          fn();
        }
      });
      stream.pipe(writer);
      stream.on('end', () => {
        const err = new Error('Error');
        err.responseCode = 421; // trigger temp failure
        fn(err);
      });
    },
    logger,
    secure: false
  });

  server.listen(port);

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
    // ignoreTLS: true,
    // set `secure` to `true` for port 465 otherwise `false` for port 587, 2587, 25, and 2525
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass
    }
  });

  // Create test message with DSN parameters
  const messageId = `${randomstring({
    characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 10
  })}@${domain.name}`;
  await transporter.sendMail({
    envelope: {
      from: `${alias.name}@${domain.name}`,
      to: 'foo@foo.com',
      dsn: {
        id: 'TEST-ENVELOPE-IDENTIFIER',
        return: 'full',
        notify: ['success', 'failure', 'delay'],
        recipient: 'foo@foo.com'
      }
    },
    raw: `
Message-ID: <${messageId}>
To: foo@foo.com
From: ${alias.name}@${domain.name}
Subject: Test DSN Message
Date: ${dayjs().subtract(1, 'hour').toDate().toISOString()}
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
  });

  {
    const email = await Emails.findOne({
      messageId
    })
      .lean()
      .exec();
    t.true(email !== null);

    const message = await Emails.getMessage(email.message, true);
    t.true(message.includes(`Message-ID: <${messageId}>`));
    t.true(message.includes(`From: ${alias.name}@${domain.name}`));

    //
    // process the email
    //
    const results = await processEmail({
      email,
      port,
      resolver,
      client
    });
    // results = [
    //   {
    //     accepted: [],
    //     rejected: 'foo@foo.com',
    //     rejectedErrors: [
    //       Object { … },
    //     ],
    //   },
    // ]
    t.true(results[0].accepted.length === 0);
    t.is(results[0].rejected, 'foo@foo.com');
    t.is(results[0].rejectedErrors[0].responseCode, 421);
  }

  // Wait to ensure bounce notification is queued
  await pWaitFor(
    async () => {
      const exists = await Emails.exists({
        subject: 'Delivery Status Notification (Delayed)'
      });
      return Boolean(exists);
    },
    { timeout: ms('5s') }
  );

  await server.close();
  await smtp.close();
});

test('DSN bounce notifications respect NOTIFY=NEVER', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const smtpPort = await getPort();
  await smtp.listen(smtpPort);

  const port = await getPort();
  const { resolver } = smtp;

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

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const pass = await alias.createToken();
  t.true(typeof pass === 'string' && pass.length === 24);
  await alias.save();

  const isValid = await isValidPassword(alias.tokens, pass);

  t.true(isValid);

  const map = new Map();

  // spoof foo.com mx records
  map.set(
    'mx:foo.com',
    resolver.spoofPacket(
      'foo.com',
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );

  // spoof domain TXT record for verification
  map.set(
    'txt:foo.com',
    resolver.spoofPacket(
      'foo.com',
      'TXT',
      [
        // Set custom port
        `forward-email-port=${port.toString()}`,
        // Create catch-all alias (active)
        `forward-email=test@${IP_ADDRESS}`
      ],
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
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ],
      true,
      ms('5m')
    )
  );

  await resolver.options.cache.mset(map);

  // Mock SMTP server that rejects messages
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onRcptTo(address, session, fn) {
      fn();
    },
    onMailFrom(address, session, fn) {
      fn();
    },
    onData(stream, session, fn) {
      const writer = new Writable({
        write(chunk, encoding, fn) {
          fn();
        }
      });
      stream.pipe(writer);
      stream.on('end', () => {
        const err = new Error('Error');
        err.responseCode = 550; // trigger permanent failure
        fn(err);
      });
    },
    logger,
    secure: false
  });

  server.listen(port);

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
    // ignoreTLS: true,
    // set `secure` to `true` for port 465 otherwise `false` for port 587, 2587, 25, and 2525
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass
    }
  });

  // Create test message with DSN parameters
  const messageId = `${randomstring({
    characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 10
  })}@${domain.name}`;
  await transporter.sendMail({
    envelope: {
      from: `${alias.name}@${domain.name}`,
      to: 'foo@foo.com',
      dsn: {
        id: 'TEST-ENVELOPE-IDENTIFIER',
        return: 'full',
        notify: ['never'],
        recipient: 'foo@foo.com'
      }
    },
    raw: `
Message-ID: <${messageId}>
To: foo@foo.com
From: ${alias.name}@${domain.name}
Subject: Test DSN Message
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
  });

  {
    const email = await Emails.findOne({
      messageId
    })
      .lean()
      .exec();
    t.true(email !== null);

    t.is(email.dsn.id, 'TEST-ENVELOPE-IDENTIFIER');
    t.is(email.dsn.return, 'full');
    t.is(email.rcptTo[0].address, 'foo@foo.com');
    t.deepEqual(email.rcptTo[0].dsn.notify, ['NEVER']);
    t.is(email.rcptTo[0].dsn.orcpt, 'rfc822;foo@foo.com');

    const message = await Emails.getMessage(email.message, true);
    t.true(message.includes(`Message-ID: <${messageId}>`));
    t.true(message.includes(`From: ${alias.name}@${domain.name}`));

    //
    // process the email
    //
    const results = await processEmail({
      email,
      port,
      resolver,
      client
    });
    // results = [
    //   {
    //     accepted: [],
    //     rejected: 'foo@foo.com',
    //     rejectedErrors: [
    //       Object { … },
    //     ],
    //   },
    // ]
    t.true(results[0].accepted.length === 0);
    t.is(results[0].rejected, 'foo@foo.com');
    t.is(results[0].rejectedErrors[0].responseCode, 550);
  }

  // Wait to ensure no bounce notification is queued
  const err = await t.throwsAsync(
    pWaitFor(
      async () => {
        const exists = await Emails.exists({
          subject: 'Delivery Status Notification (Failure)',
          'envelope.from': `mailer-daemon@${domain.name}`,
          'envelope.to': `${alias.name}@${domain.name}`
        });
        return Boolean(exists);
      },
      { timeout: ms('5s') }
    )
  );
  t.is(err.name, 'TimeoutError');

  await server.close();
  await smtp.close();
});

test('DSN success notifications with NOTIFY parameters', async (t) => {
  const smtp = new SMTP({ client: t.context.client }, false);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const smtpPort = await getPort();
  await smtp.listen(smtpPort);

  const port = await getPort();
  const { resolver } = smtp;

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

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const pass = await alias.createToken();
  t.true(typeof pass === 'string' && pass.length === 24);
  await alias.save();

  const isValid = await isValidPassword(alias.tokens, pass);

  t.true(isValid);

  const map = new Map();

  // spoof foo.com mx records
  map.set(
    'mx:foo.com',
    resolver.spoofPacket(
      'foo.com',
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );

  // spoof domain TXT record for verification
  map.set(
    'txt:foo.com',
    resolver.spoofPacket(
      'foo.com',
      'TXT',
      [
        // Set custom port
        `forward-email-port=${port.toString()}`,
        // Create catch-all alias (active)
        `forward-email=test@${IP_ADDRESS}`
      ],
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
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ],
      true,
      ms('5m')
    )
  );

  await resolver.options.cache.mset(map);

  // Mock SMTP server that rejects messages
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onRcptTo(address, session, fn) {
      fn();
    },
    onMailFrom(address, session, fn) {
      fn();
    },
    onData(stream, session, fn) {
      const writer = new Writable({
        write(chunk, encoding, fn) {
          fn();
        }
      });
      stream.pipe(writer);
      stream.on('end', () => {
        fn(); // 250 success
      });
    },
    logger,
    secure: false
  });

  server.listen(port);

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
    // ignoreTLS: true,
    // set `secure` to `true` for port 465 otherwise `false` for port 587, 2587, 25, and 2525
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: `${alias.name}@${domain.name}`,
      pass
    }
  });

  // Create test message with DSN parameters
  const messageId = `${randomstring({
    characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 10
  })}@${domain.name}`;
  await transporter.sendMail({
    envelope: {
      from: `${alias.name}@${domain.name}`,
      to: 'foo@foo.com',
      dsn: {
        id: 'TEST-ENVELOPE-IDENTIFIER',
        return: 'full',
        notify: ['success', 'failure', 'delay'],
        recipient: 'foo@foo.com'
      }
    },
    raw: `
Message-ID: <${messageId}>
To: foo@foo.com
From: ${alias.name}@${domain.name}
Subject: Test DSN Message
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
  });

  {
    const email = await Emails.findOne({
      messageId
    })
      .lean()
      .exec();
    t.true(email !== null);

    const message = await Emails.getMessage(email.message, true);
    t.true(message.includes(`Message-ID: <${messageId}>`));
    t.true(message.includes(`From: ${alias.name}@${domain.name}`));

    //
    // process the email
    //
    const results = await processEmail({
      email,
      port,
      resolver,
      client
    });
    // results = [
    //   {
    //     accepted: [],
    //     rejected: 'foo@foo.com',
    //     rejectedErrors: [
    //       Object { … },
    //     ],
    //   },
    // ]
    t.true(results[0].accepted.length === 1);
  }

  // Wait to ensure bounce notification is queued
  await pWaitFor(
    async () => {
      const exists = await Emails.exists({
        subject: 'Delivery Status Notification (Success)'
      });
      return Boolean(exists);
    },
    { timeout: ms('5s') }
  );

  await server.close();
  await smtp.close();
});
