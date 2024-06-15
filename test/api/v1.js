/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const ObjectID = require('bson-objectid');
const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const delay = require('delay');
const getPort = require('get-port');
const ip = require('ip');
const ms = require('ms');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');
const { factory } = require('factory-girl');

const utils = require('../utils');

const config = require('#config');
const createSession = require('#helpers/create-session');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const logger = require('#helpers/logger');
const phrases = require('#config/phrases');
const processEmail = require('#helpers/process-email');
const { Logs, Domains, Emails } = require('#models');

const IP_ADDRESS = ip.address();
const client = new Redis();
const resolver = createTangerine(client);

test.before(utils.setupMongoose);
test.before(utils.defineUserFactory);
test.before(utils.defineDomainFactory);
test.before(utils.definePaymentFactory);
test.before(utils.defineAliasFactory);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);

test('fails when no creds are presented', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/account');
  t.is(res.status, 401);
});

test("returns current user's account", async (t) => {
  const { api } = t.context;
  const body = {
    email: 'testglobal@api.example.com',
    password: 'FKOZa3kP0TxSCA'
  };

  let res = await api.post('/v1/account').send(body);
  t.is(res.status, 200);

  res = await api.get('/v1/account').set({
    Authorization: `Basic ${Buffer.from(
      `${res.body[config.userFields.apiToken]}:`
    ).toString('base64')}`
  });
  t.is(res.body.message, phrases.EMAIL_VERIFICATION_REQUIRED);
  t.is(res.status, 401);
});

test('rate limits account signups', async (t) => {
  const { api } = t.context;
  let res = await api.post('/v1/account');
  t.is(res.status, 400);
  res = await api.post('/v1/account');
  t.is(res.status, 400);
  res = await api.post('/v1/account');
  t.is(res.status, 400);
  res = await api.post('/v1/account');
  t.is(res.status, 400);
  res = await api.post('/v1/account');
  t.is(res.status, 400);
  res = await api.post('/v1/account');
  t.is(res.status, 429);
});

test('creates log', async (t) => {
  const { api } = t.context;
  const log = {
    message: new ObjectID().toString(),
    meta: {
      level: 'info'
    }
  };
  const res = await api.post('/v1/log').send(log);
  t.is(res.status, 200);

  // since Logs.create in the API controller uses .then()
  await delay(100);

  const match = await Logs.findOne({ message: log.message });
  t.true(typeof match === 'object');
});

test('creates domain', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });
  const res = await t.context.api
    .post('/v1/domains')
    .auth(user[config.userFields.apiToken])
    .send({
      domain: 'example.com'
    });
  t.is(res.status, 200);
  t.is(res.body.name, 'example.com');
});

test('creates alias with global catch-all', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });
  const domain = await factory.create('domain', {
    members: [{ user: user._id, group: 'admin' }],
    plan: user.plan,
    resolver,
    has_smtp: true
  });
  const res = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken])
    .send({
      name: 'test'
    });
  t.is(res.status, 200);
  t.is(res.body.name, 'test');
  t.deepEqual(res.body.recipients, [user.email]);
});

test('creates alias and generates password', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });

  const domain = await factory.create('domain', {
    members: [{ user: user._id, group: 'admin' }],
    plan: user.plan,
    resolver,
    has_smtp: true
  });

  const res = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken])
    .send({
      name: 'test'
    });
  t.is(res.status, 200);
  t.is(res.body.name, 'test');
  t.deepEqual(res.body.recipients, [user.email]);

  const res2 = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases/${res.body.id}/generate-password`)
    .auth(user[config.userFields.apiToken])
    .send({
      new_password: 'Lb7nKMMttr6FMEuF7eU'
    });
  t.is(res2.status, 408);
  // t.is(res2.body.username, `test@${domain.name}`);
  // t.is(res2.body.password, 'Lb7nKMMttr6FMEuF7eU');
});

test('creates alias with multiple recipients', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });
  const domain = await factory.create('domain', {
    members: [{ user: user._id, group: 'admin' }],
    plan: user.plan,
    resolver,
    has_smtp: true
  });
  const recipients = ['foo@bar.com', 'beep@boop.com', 'baz@baz.com'];
  const res = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken])
    .send({
      name: 'test-multiple',
      recipients
    });
  t.is(res.status, 200);
  t.is(res.body.name, 'test-multiple');
  t.deepEqual(res.body.recipients, recipients);
});

test('creates email', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });

  await factory.create('payment', {
    user: user._id,
    amount: 300,
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: user.plan,
    kind: 'one-time'
  });

  await user.save();

  const domain = await factory.create('domain', {
    members: [{ user: user._id, group: 'admin' }],
    plan: user.plan,
    resolver,
    has_smtp: true
  });

  const alias = await factory.create('alias', {
    user: user._id,
    domain: domain._id,
    recipients: [user.email]
  });

  //
  // create email
  // (with large payload to ensure body-parser working properly past default limit)
  //
  const date = new Date();
  const res = await t.context.api
    .post('/v1/emails')
    .auth(user[config.userFields.apiToken])
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      raw: `
Sender: baz@beep.com
Cc: beep@boop.com,beep@boop.com
Bcc: foo@bar.com,a@xyz.com,b@xyz.com
Reply-To: boop@beep.com
Message-ID: beep-boop
Date: ${date.toISOString()}
To: test@foo.com
From: 😊 Test <${alias.name}@${domain.name}>
Subject: testing this
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
    });

  t.is(res.status, 200);

  const header = `=?UTF-8?Q?=C3=B0=C2=9F=C2=98=C2=8A_Test?= <${alias.name}@${domain.name}>`;

  // validate header From was converted properly
  t.is(res.body.headers.From, header);

  // validate message body was converted as well
  const email = await Emails.findOne({ id: res.body.id });
  const message = await Emails.getMessage(email.message);
  t.true(message.toString().includes('From: ' + header));

  // validate envelope
  t.is(res.body.envelope.from, `${alias.name}@${domain.name}`);
  t.deepEqual(
    res.body.envelope.to.sort(),
    [
      'test@foo.com',
      'beep@boop.com',
      'foo@bar.com',
      'a@xyz.com',
      'b@xyz.com'
    ].sort()
  );

  // validate message-id
  t.is(res.body.messageId, '<beep-boop>');

  // validate date
  t.is(new Date(res.body.date).getTime(), date.getTime());

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

  //
  // spoof envelope RCPT TO mx records
  //
  // - test@foo.com
  // - beep@boop.com
  // - foo@bar.com
  // - a@xyz.com <-- accepted
  // - b@xyz.com <-- rejected
  //
  for (const to of res.body.envelope.to) {
    const [, domain] = to.split('@');
    map.set(
      `mx:${domain}`,
      resolver.spoofPacket(
        `mx:${domain}`,
        'MX',
        [{ exchange: IP_ADDRESS, priority: 0 }],
        true
      )
    );
  }

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  // spin up a test smtp server that simply responds with OK
  const port = await getPort();
  let attempted = false;
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onRcptTo(address, session, fn) {
      if (
        !attempted &&
        address?.address === res.body.envelope.to.slice(-1)[0]
      ) {
        attempted = true;
        const err = new Error('Rejected!');
        // NOTE: smtp-server will close connection early if it's 421
        err.responseCode = 450;
        err.response = '450 Rejected!';
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
        // t.log(buffer.toString());
        fn();
      });
    },
    logger,
    secure: false
  });

  // start test smtp server
  await pify(server.listen.bind(server))(port);

  //
  // process the email
  //
  {
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    t.is(email.id, res.body.id);
    t.is(email.status, 'queued');

    await processEmail({
      email,
      port,
      resolver,
      client
    });
  }

  //
  // ensure email delivered except 1 address which will be retried next send
  //
  {
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    delete email.message; // suppress buffer output from console log
    t.is(email.id, res.body.id);
    t.log('email', email);
    t.is(email.status, 'deferred');
    t.deepEqual(
      email.accepted.sort(),
      res.body.envelope.to.slice(0, -1).sort()
    );
    t.true(email.rejectedErrors.length === 1);
    t.is(email.rejectedErrors[0].code, 'EENVELOPE');
    t.is(email.rejectedErrors[0].response, '450 Rejected!');
    t.is(email.rejectedErrors[0].responseCode, 450);
    t.is(email.rejectedErrors[0].command, 'RCPT TO');
    t.is(email.rejectedErrors[0].recipient, res.body.envelope.to.slice(-1)[0]);
  }

  // process the email again and let the deferred go through this time
  {
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    t.is(email.id, res.body.id);
    t.is(email.status, 'deferred');
    await Emails.findByIdAndUpdate(email._id, {
      $set: { is_locked: false, status: 'queued' },
      $unset: { locked_at: 1, locked_by: 1 }
    });

    await processEmail({
      email,
      port,
      resolver,
      client
    });
  }

  // ensure sent
  {
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    delete email.message; // suppress buffer output from console log
    t.is(email.id, res.body.id);
    t.is(email.status, 'sent');
    t.deepEqual(email.accepted.sort(), res.body.envelope.to.sort());
    t.deepEqual(email.rejectedErrors, []);
  }
});

test('5+ day email bounce', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });

  await factory.create('payment', {
    user: user._id,
    amount: 300,
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: user.plan,
    kind: 'one-time'
  });

  await user.save();

  const domain = await factory.create('domain', {
    members: [{ user: user._id, group: 'admin' }],
    plan: user.plan,
    resolver,
    has_smtp: true
  });

  const alias = await factory.create('alias', {
    user: user._id,
    domain: domain._id,
    recipients: [user.email]
  });

  // TODO: write another test that leverages date in future

  // send another test that triggers `shouldBounce` logic
  const res = await t.context.api
    .post('/v1/emails')
    .auth(user[config.userFields.apiToken])
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      from: `${alias.name}@${domain.name}`,
      to: 'foo@bar.com',
      subject: 'beep',
      text: 'yo'
    });

  t.is(res.status, 200);

  //
  // process the email
  //
  {
    let email = await Emails.findOne({ id: res.body.id }).lean().exec();
    t.is(email.id, res.body.id);
    t.is(email.status, 'queued');

    await logger.info('email queued', {
      session: createSession(email),
      user: email.user,
      email: email._id,
      domains: [email.domain],
      ignore_hook: false
    });

    /*
    //
    // since we can't modify `created_at` with Mongoose
    // (though `{ timestamps: { createdAt: false } }` may work?)
    //
    const result = await Logs.collection.updateOne(
      {
        message: 'email queued',
        user: email.user,
        email: email._id,
        domains: { $in: [email.domain] }
      },
      {
        $set: {
          created_at: new Date(Date.now() - config.maxRetryDuration)
        }
      }
    );
    t.is(result.modifiedCount, 1);
    */
    await Emails.findByIdAndUpdate(email._id, {
      $set: {
        date: new Date(email.date).getTime() - config.maxRetryDuration
      }
    });

    /*
    // ensure log exists
    const shouldBounce = await Logs.exists({
      created_at: {
        $lte: new Date(Date.now() - config.maxRetryDuration)
      },
      message: 'email queued',
      email: {
        $eq: email._id,
        $exists: true
      }
    });
    t.true(
      shouldBounce &&
        typeof shouldBounce === 'object' &&
        typeof shouldBounce._id === 'object'
    );
    */

    await Emails.findByIdAndUpdate(email._id, {
      $set: {
        is_locked: false,
        status: 'queued'
      },
      $unset: { locked_at: 1, locked_by: 1 }
    });

    email = await Emails.findById(email._id).lean().exec();
    t.is(email.status, 'queued');
    t.is(email.is_locked, false);
    t.is(email.locked_at, undefined);
    t.is(email.locked_by, undefined);

    await processEmail({
      email,
      resolver,
      client
    });
  }

  // ensure bounced
  {
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    delete email.message;
    t.is(email.id, res.body.id);
    t.is(email.status, 'bounced');
    t.true(email.rejectedErrors.length === 1);
    t.is(email.rejectedErrors[0].responseCode, 550);
    t.is(email.rejectedErrors[0].recipient, res.body.envelope.to[0]);
  }

  //
  // wait a second for redis connections to close (?)
  //
  // NOTE: we should fix this so we can remove this artificial delay
  //
  await delay(1000);
});

test('smtp outbound spam block detection', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });

  await factory.create('payment', {
    user: user._id,
    amount: 300,
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: user.plan,
    kind: 'one-time'
  });

  await user.save();

  const domain = await factory.create('domain', {
    members: [{ user: user._id, group: 'admin' }],
    plan: user.plan,
    resolver,
    has_smtp: true
  });

  const alias = await factory.create('alias', {
    user: user._id,
    domain: domain._id,
    recipients: [user.email]
  });

  //
  // create email
  //
  const res = await t.context.api
    .post('/v1/emails')
    .auth(user[config.userFields.apiToken])
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      from: `${alias.name}@${domain.name}`,
      to: `test@${[...config.truthSources][0]}`,
      subject: 'spam',
      text: 'yo'
    });

  t.is(res.status, 200);

  // validate envelope
  t.is(res.body.envelope.from, `${alias.name}@${domain.name}`);
  t.deepEqual(res.body.envelope.to, [`test@${[...config.truthSources][0]}`]);

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

  //
  // spoof envelope RCPT TO mx records
  //
  for (const to of res.body.envelope.to) {
    const [, domain] = to.split('@');
    // A
    map.set(
      `a:${domain}`,
      resolver.spoofPacket(domain, 'A', [IP_ADDRESS], true)
    );
    // MX
    map.set(
      `mx:${domain}`,
      resolver.spoofPacket(
        `mx:${domain}`,
        'MX',
        [{ exchange: domain, priority: 0 }],
        true
      )
    );
  }

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  // spin up a test smtp server that simply responds with OK
  const port = await getPort();
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onRcptTo(address, session, fn) {
      fn(new Error('Message detected as spam'));
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
        // t.log(buffer.toString());
        fn();
      });
    },
    logger,
    secure: false
  });

  // start test smtp server
  await pify(server.listen.bind(server))(port);

  //
  // process the email
  //
  {
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    t.is(email.id, res.body.id);
    t.is(email.status, 'queued');

    await processEmail({
      email,
      port,
      resolver,
      client
    });
  }

  //
  // ensure email rejected
  //
  {
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    delete email.message; // suppress buffer output from console loug
    t.is(email.id, res.body.id);
    t.is(email.status, 'rejected');
    t.deepEqual(email.accepted, []);
    t.true(email.rejectedErrors.length === 1);
    t.is(email.rejectedErrors[0].responseCode, 550);
    t.is(email.rejectedErrors[0].recipient, res.body.envelope.to[0]);

    // check original preserved error
    t.is(email.rejectedErrors[0].error.code, 'EENVELOPE');
    t.is(
      email.rejectedErrors[0].error.response,
      '550 Message detected as spam'
    );
    t.is(email.rejectedErrors[0].error.responseCode, 550);
    t.is(email.rejectedErrors[0].error.bounceInfo.category, 'spam');
    t.is(email.rejectedErrors[0].error.command, 'RCPT TO');
  }

  // ensure domain is suspended
  const isSuspended = await Domains.exists({
    _id: domain._id,
    is_smtp_suspended: true
  });
  t.true(
    isSuspended &&
      typeof isSuspended === 'object' &&
      typeof isSuspended._id === 'object'
  );

  // ensure future attempts to deliver emails throw suspension error
  {
    let email = await Emails.findOne({ id: res.body.id }).lean().exec();
    delete email.message; // suppress buffer output from console log
    t.is(email.id, res.body.id);
    t.is(email.status, 'rejected');
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
      port,
      resolver,
      client
    });
  }

  // latest error should not have been attempted (should have returned early)
  {
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    delete email.message; // suppress buffer output from console log
    t.is(email.id, res.body.id);
    t.is(email.status, 'rejected');
    t.deepEqual(email.accepted, []);
    t.true(email.rejectedErrors.length === 1);
    t.is(email.rejectedErrors[0].responseCode, 550);
    t.is(email.rejectedErrors[0].recipient, res.body.envelope.to[0]);
    t.true(email.rejectedErrors[0].error === undefined);
  }

  //
  // wait a second for redis connections to close (?)
  //
  // NOTE: we should fix this so we can remove this artificial delay
  //
  await delay(1000);
});

test('create domain without catchall', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });

  await factory.create('payment', {
    user: user._id,
    amount: 300,
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: user.plan,
    kind: 'one-time'
  });

  await user.save();

  {
    const res = await t.context.api
      .post('/v1/domains')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        domain: 'testdomain1.com',
        catchall: 'false'
      });

    t.is(res.status, 200);
  }

  {
    const res = await t.context.api
      .post('/v1/domains')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        domain: 'testdomain2.com',
        catchall: false
      });

    t.is(res.status, 200);
  }

  {
    const res = await t.context.api
      .post('/v1/domains')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        domain: 'testdomain3.com',
        catchall: '0'
      });

    t.is(res.status, 200);
  }

  const res = await t.context.api
    .post('/v1/domains')
    .auth(user[config.userFields.apiToken])
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      domain: 'testdomain4.com',
      catchall: 0
    });

  t.is(res.status, 200);
});

test('lists emails', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });

  await factory.create('payment', {
    user: user._id,
    amount: 300,
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: user.plan,
    kind: 'one-time'
  });

  await user.save();

  const domain = await factory.create('domain', {
    members: [{ user: user._id, group: 'admin' }],
    plan: user.plan,
    resolver,
    has_smtp: true
  });

  const alias = await factory.create('alias', {
    user: user._id,
    domain: domain._id,
    recipients: [user.email]
  });

  let id;
  {
    const res = await t.context.api
      .post('/v1/emails')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        from: `${alias.name}@${domain.name}`,
        to: 'foo@bar.com',
        subject: 'beep',
        text: 'yo'
      });

    t.is(res.status, 200);
    t.true(typeof res.body.id === 'string');
    t.is(res.body.subject, 'beep');
    id = res.body.id;
  }

  {
    const res = await t.context.api
      .get('/v1/emails')
      .auth(user[config.userFields.apiToken])
      .set('Accept', 'application/json');

    t.is(res.status, 200);
    t.is(res.body[0].id, id);
    t.is(res.body[0].subject, 'beep');
  }
});

test('retrieves email', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });

  await factory.create('payment', {
    user: user._id,
    amount: 300,
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: user.plan,
    kind: 'one-time'
  });

  await user.save();

  const domain = await factory.create('domain', {
    members: [{ user: user._id, group: 'admin' }],
    plan: user.plan,
    resolver,
    has_smtp: true
  });

  const alias = await factory.create('alias', {
    user: user._id,
    domain: domain._id,
    recipients: [user.email]
  });

  let id;
  {
    const res = await t.context.api
      .post('/v1/emails')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        from: `${alias.name}@${domain.name}`,
        to: 'foo@bar.com',
        subject: 'beep',
        text: 'yo'
      });

    t.is(res.status, 200);
    t.true(typeof res.body.id === 'string');
    t.is(res.body.subject, 'beep');
    id = res.body.id;
  }

  {
    const res = await t.context.api
      .get(`/v1/emails/${id}`)
      .auth(user[config.userFields.apiToken])
      .set('Accept', 'application/json');

    t.is(res.status, 200);
    t.is(res.body.id, id);
    t.is(res.body.subject, 'beep');
  }
});

test('removes email', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });

  await factory.create('payment', {
    user: user._id,
    amount: 300,
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: user.plan,
    kind: 'one-time'
  });

  await user.save();

  const domain = await factory.create('domain', {
    members: [{ user: user._id, group: 'admin' }],
    plan: user.plan,
    resolver,
    has_smtp: true
  });

  const alias = await factory.create('alias', {
    user: user._id,
    domain: domain._id,
    recipients: [user.email]
  });

  let id;
  {
    const res = await t.context.api
      .post('/v1/emails')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        from: `${alias.name}@${domain.name}`,
        to: 'foo@bar.com',
        subject: 'beep',
        text: 'yo'
      });

    t.is(res.status, 200);
    t.true(typeof res.body.id === 'string');
    t.is(res.body.subject, 'beep');
    id = res.body.id;
  }

  {
    const res = await t.context.api
      .delete(`/v1/emails/${id}`)
      .auth(user[config.userFields.apiToken])
      .set('Accept', 'application/json');

    t.is(res.status, 200);
    t.is(res.body.status, 'rejected');
  }
});

test('smtp email blocklist', async (t) => {
  const user = await factory.create('user', {
    plan: 'enhanced_protection',
    [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
  });

  await factory.create('payment', {
    user: user._id,
    amount: 300,
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    duration: ms('30d'),
    plan: user.plan,
    kind: 'one-time'
  });

  await user.save();

  const domain = await factory.create('domain', {
    members: [{ user: user._id, group: 'admin' }],
    plan: user.plan,
    resolver,
    has_smtp: true
  });

  domain.smtp_emails_blocked.push('foo@foo.com', 'beep@beep.com');
  await domain.save();

  const alias = await factory.create('alias', {
    user: user._id,
    domain: domain._id,
    recipients: [user.email]
  });

  //
  // create email
  //
  const res = await t.context.api
    .post('/v1/emails')
    .auth(user[config.userFields.apiToken])
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      from: `${alias.name}@${domain.name}`,
      to: 'foo@foo.com',
      subject: 'test',
      text: 'test'
    });

  t.is(res.status, 200);

  // validate envelope
  t.is(res.body.envelope.from, `${alias.name}@${domain.name}`);
  t.deepEqual(res.body.envelope.to, ['foo@foo.com']);

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

  //
  // spoof envelope RCPT TO mx records
  //
  for (const to of res.body.envelope.to) {
    const [, domain] = to.split('@');
    map.set(
      `mx:${domain}`,
      resolver.spoofPacket(
        `mx:${domain}`,
        'MX',
        [{ exchange: IP_ADDRESS, priority: 0 }],
        true
      )
    );
  }

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  //
  // process the email
  //
  {
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    t.is(email.id, res.body.id);
    t.is(email.status, 'queued');

    await processEmail({
      email,
      resolver,
      client
    });
  }

  //
  // ensure email rejected
  //
  {
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    delete email.message; // suppress buffer output from console loug
    t.is(email.id, res.body.id);
    t.is(email.status, 'rejected');
    t.deepEqual(email.accepted, []);
    t.true(email.rejectedErrors.length === 1);
    t.is(email.rejectedErrors[0].responseCode, 550);
    t.is(email.rejectedErrors[0].recipient, res.body.envelope.to[0]);
    t.is(
      email.rejectedErrors[0].message,
      'Recipient is blocked from sending mail to.'
    );
  }

  //
  // ensure email rejected
  //
  {
    // add another recipient so we test the plural version
    await Emails.findByIdAndUpdate(res.body.id, {
      $set: {
        is_locked: false,
        status: 'queued',
        'envelope.to': ['foo@foo.com', 'beep@beep.com']
      },
      $unset: { locked_at: 1, locked_by: 1 }
    });
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    t.is(email.id, res.body.id);
    t.is(email.status, 'queued');

    await processEmail({
      email,
      resolver,
      client
    });
  }

  {
    const email = await Emails.findOne({ id: res.body.id }).lean().exec();
    t.is(email.id, res.body.id);
    t.is(email.status, 'rejected');
    t.deepEqual(email.accepted, []);
    t.true(email.rejectedErrors.length === 2);
    t.is(email.rejectedErrors[0].responseCode, 550);
    t.is(email.rejectedErrors[1].responseCode, 550);
    t.is(
      email.rejectedErrors[0].message,
      'All recipients are blocked from sending mail to.'
    );
    t.is(
      email.rejectedErrors[1].message,
      'All recipients are blocked from sending mail to.'
    );
  }
});
