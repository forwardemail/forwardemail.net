/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const ObjectID = require('bson-objectid');
const Redis = require('ioredis-mock');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const delay = require('delay');
const getPort = require('get-port');
const ip = require('ip');
const isBase64 = require('is-base64');
const ms = require('ms');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');

const config = require('#config');
const createSession = require('#helpers/create-session');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const logger = require('#helpers/logger');
const phrases = require('#config/phrases');
const processEmail = require('#helpers/process-email');
const { Logs, Domains, Emails } = require('#models');
const { decrypt } = require('#helpers/encrypt-decrypt');

const { emoji } = config.views.locals;

const IP_ADDRESS = ip.address();
const client = new Redis();
client.setMaxListeners(0);
const resolver = createTangerine(client);

test.before(utils.setupMongoose);
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
  t.true(match !== null);
});

test('creates domain', async (t) => {
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  await utils.paymentFactory
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
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  const domain = await utils.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();
  const res = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken])
    .send({
      name: 'test'
    });
  t.is(res.status, 200);
  t.is(res.body.name, 'test');

  t.deepEqual(
    _.sortBy(Object.keys(res.body)),
    _.sortBy([
      'created_at',
      'error_code_if_disabled',
      'has_imap',
      'has_pgp',
      'has_recipient_verification',
      'id',
      'is_enabled',
      'locale',
      'name',
      'object',
      'recipients',
      'retention',
      'storage_location',
      'storage_used',
      'updated_at',
      'labels',
      'pending_recipients',
      'verified_recipients',

      'user',
      'domain'
    ])
  );

  t.deepEqual(
    _.sortBy(Object.keys(res.body.user)),
    _.sortBy([
      'address_country',
      'address_html',
      'created_at',
      'display_name',
      'email',
      'full_email',
      'id',
      'last_locale',
      'locale',
      'max_quota_per_alias',
      'object',
      'otp_enabled',
      'plan',
      'updated_at'
    ])
  );

  t.deepEqual(
    _.sortBy(Object.keys(res.body.domain)),
    _.sortBy([
      'allowlist',
      'denylist',
      'invites',
      'restricted_alias_names',
      'created_at',
      'has_adult_content_protection',
      'has_catchall',
      'has_custom_verification',
      'has_executable_protection',
      'has_mx_record',
      'has_newsletter',
      'has_phishing_protection',
      'has_recipient_verification',
      'has_regex',
      'has_smtp',
      'has_txt_record',
      'has_virus_protection',
      'id',
      'ignore_mx_check',
      'is_catchall_regex_disabled',
      'locale',
      'max_recipients_per_alias',
      'members',
      'name',
      'object',
      'plan',
      'retention_days',
      'smtp_port',
      'updated_at',
      'verification_record'
    ])
  );

  t.is(res.body.domain.members.length, 1);

  t.deepEqual(
    _.sortBy(Object.keys(res.body.domain.members[0])),
    _.sortBy(['user', 'group'])
  );

  t.deepEqual(
    _.sortBy(Object.keys(res.body.domain.members[0].user)),
    _.sortBy(['plan', 'email', 'display_name', 'id'])
  );

  t.deepEqual(res.body.recipients, [user.email]);

  // ensures pagination working
  {
    const res = await t.context.api
      .get(`/v1/domains/${domain.name}/aliases`)
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    t.is(res.status, 200);

    t.is(res.body.length, 1);

    t.deepEqual(
      _.sortBy(Object.keys(res.body[0])),
      _.sortBy([
        'labels',
        'verified_recipients',
        'has_pgp',
        'has_imap',
        'storage_used',
        'storage_location',
        'retention',
        'name',
        'is_enabled',
        'error_code_if_disabled',
        'has_recipient_verification',
        'recipients',
        'pending_recipients',
        'id',
        'object',
        'created_at',
        'updated_at',

        'user',
        'domain'
      ])
    );

    t.deepEqual(
      _.sortBy(Object.keys(res.body[0].domain)),
      _.sortBy(['name', 'id'])
    );

    t.deepEqual(
      _.sortBy(Object.keys(res.body[0].user)),
      _.sortBy(['email', 'display_name', 'id'])
    );

    t.is(res.headers['x-page-count'], '1');
    t.is(res.headers['x-page-current'], '1');
    t.is(res.headers['x-page-size'], '1');
    t.is(res.headers['x-item-count'], '1');
    const url = `http://127.0.0.1:${t.context.apiAddress.port}`;
    t.is(
      res.headers.link,
      `<${url}/v1/domains/${domain.name}/aliases?page=1)>; rel="last", <${url}/v1/domains/${domain.name}/aliases?page=1)>; rel="first"`
    );
  }
});

test('creates alias and generates password', async (t) => {
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  const domain = await utils.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();

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
  t.is(res2.status, 500);

  // t.is(res2.status, 408);
  // t.is(res2.body.username, `test@${domain.name}`);
  // t.is(res2.body.password, 'Lb7nKMMttr6FMEuF7eU');
});

test('creates alias with multiple recipients', async (t) => {
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  const domain = await utils.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();
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
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  const domain = await utils.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();

  const alias = await utils.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

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
From: ${emoji('blush')} Test <${alias.name}@${domain.name}>
Subject: ${emoji('blush')} testing this
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
    });

  t.is(res.status, 200);

  // validate header From was converted properly
  t.true(
    res.body.message.includes(
      `From: =?UTF-8?Q?=F0=9F=98=8A?= Test <${alias.name}@${domain.name}>`
    )
  );
  t.is(
    res.body.headers.From,
    `${emoji('blush')} Test <${alias.name}@${domain.name}>`
  );

  t.is(res.body.headers.Subject, `${emoji('blush')} testing this`);

  // validate message body was converted as well
  const email = await Emails.findOne({ id: res.body.id });
  const message = await Emails.getMessage(email.message, true);
  t.true(
    message.includes(
      `From: =?UTF-8?Q?=F0=9F=98=8A?= Test <${alias.name}@${domain.name}>`
    )
  );

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

  //
  // validate message-id
  //
  // NOTE: we do not ensureMessageId format for the following headers
  //       - references
  //       - message-id
  //       - in-reply-to
  //
  //       <https://github.com/nodemailer/mailparser/blob/af0c1e6044643ee9c9590e3bac5ceaac2c5120a4/lib/mail-parser.js#L336-L352>
  //
  // t.is(res.body.messageId, '<beep-boop>');
  //
  t.is(res.body.messageId, 'beep-boop');

  // validate date
  t.is(new Date(res.body.date).getTime(), date.getTime());

  //
  // create an email using `from` and `subject` nodemailer options
  // to ensure subject emojis get encoded automatically for users
  //
  {
    const res = await t.context.api
      .post('/v1/emails')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        from: `${emoji('blush')} Test <${alias.name}@${domain.name}>`,
        to: 'test@foo.com',
        subject: `${emoji('blush')} testing this`,
        text: 'test'
      });

    t.is(res.status, 200);

    // validate header From was converted properly
    t.is(
      res.body.headers.From,
      `${emoji('blush')} Test <${alias.name}@${domain.name}>`
    );
    t.is(res.body.headers.Subject, `${emoji('blush')} testing this`);
    t.true(
      res.body.message.includes(
        `From: =?UTF-8?Q?=F0=9F=98=8A_Test?= <${alias.name}@${domain.name}>`
      )
    );
  }

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
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  const domain = await utils.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();

  const alias = await utils.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

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
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  const domain = await utils.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();

  const alias = await utils.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

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
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  // list aliases for the domain should paginate response
  {
    const res = await t.context.api
      .get(`/v1/domains/testdomain1.com/aliases`)
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    t.is(res.status, 200);
    t.deepEqual(res.body, []);
    t.is(res.headers['x-page-count'], '1');
    t.is(res.headers['x-page-current'], '1');
    t.is(res.headers['x-page-size'], '1');
    t.is(res.headers['x-item-count'], '0');
    const url = `http://127.0.0.1:${t.context.apiAddress.port}`;
    t.is(
      res.headers.link,
      `<${url}/v1/domains/testdomain1.com/aliases?page=1)>; rel="last", <${url}/v1/domains/testdomain1.com/aliases?page=1)>; rel="first"`
    );
  }

  // list domains should paginate response
  {
    const res = await t.context.api
      .get('/v1/domains')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    t.is(res.status, 200);
    t.is(res.body.length, 1);
    t.true(res.body[0].name === 'testdomain1.com');
    t.true(res.body[0].plan === 'enhanced_protection');
    // filter for properties for exposed values
    t.deepEqual(
      _.sortBy(Object.keys(res.body[0])),
      _.sortBy([
        'allowlist',
        'denylist',
        'created_at',
        'restricted_alias_names',
        'has_adult_content_protection',
        'has_catchall',
        'has_custom_verification',
        'has_executable_protection',
        'has_mx_record',
        'has_newsletter',
        'has_phishing_protection',
        'has_recipient_verification',
        'has_regex',
        'has_smtp',
        'has_txt_record',
        'has_virus_protection',
        'id',
        'ignore_mx_check',
        'is_catchall_regex_disabled',
        'max_recipients_per_alias',
        'name',
        'object',
        'plan',
        'retention_days',
        'smtp_port',
        'updated_at',
        'verification_record',
        //
        // NOTE: paid plans additionally expose these three properties:
        //       (see `app/controllers/web/my-account/list-domains.js`)
        //       - storage_used
        //       - storage_used_by_aliases
        //       - storage_quota
        //
        'storage_used',
        'storage_used_by_aliases',
        'storage_quota',
        // added by API v1 domains controller as a helper
        'link'
      ])
    );
    t.is(res.headers['x-page-count'], '1');
    t.is(res.headers['x-page-current'], '1');
    t.is(res.headers['x-page-size'], '1');
    t.is(res.headers['x-item-count'], '1');
    const url = `http://127.0.0.1:${t.context.apiAddress.port}`;
    t.is(
      res.headers.link,
      `<${url}/v1/domains?page=1)>; rel="last", <${url}/v1/domains?page=1)>; rel="first"`
    );
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
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  const domain = await utils.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();

  const alias = await utils.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

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
        subject: `${emoji('tada')} beep`,
        text: 'yo'
      });

    t.is(res.status, 200);
    t.true(typeof res.body.id === 'string');
    t.is(res.body.subject, `${emoji('tada')} beep`);
    t.is(res.body.headers.Subject, `${emoji('tada')} beep`);
    t.deepEqual(
      _.sortBy(Object.keys(res.body)),
      _.sortBy([
        'rejectedErrors',
        'accepted',
        'alias',
        'created_at',
        'date',
        'domain',
        'envelope',
        'hard_bounces',
        'headers',
        'id',
        'is_bounce',
        'is_locked',
        'is_redacted',
        'link',
        'message',
        'messageId',
        'object',
        'soft_bounces',
        'status',
        'subject',
        'updated_at',
        'user'
      ])
    );
    t.true(typeof res.body.message === 'string');
    id = res.body.id;
  }

  {
    const res = await t.context.api
      .get(`/v1/emails/${id}`)
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    t.is(res.status, 200);
    t.true(typeof res.body.id === 'string');
    t.is(res.body.subject, `${emoji('tada')} beep`);
    t.is(res.body.headers.Subject, `${emoji('tada')} beep`);
    t.deepEqual(
      _.sortBy(Object.keys(res.body)),
      _.sortBy([
        'rejectedErrors',
        'accepted',
        'alias',
        'created_at',
        'date',
        'domain',
        'envelope',
        'hard_bounces',
        'headers',
        'id',
        'is_bounce',
        'is_locked',
        'is_redacted',
        'link',
        'message',
        'messageId',
        'object',
        'soft_bounces',
        'status',
        'subject',
        'updated_at',
        'user'
      ])
    );
    t.true(typeof res.body.message === 'string');
  }

  {
    const res = await t.context.api
      .get('/v1/emails')
      .auth(user[config.userFields.apiToken])
      .set('Accept', 'application/json');

    t.is(res.status, 200);
    t.is(res.headers['x-page-count'], '1');
    t.is(res.headers['x-page-current'], '1');
    t.is(res.headers['x-page-size'], '1');
    t.is(res.headers['x-item-count'], '1');
    const url = `http://127.0.0.1:${t.context.apiAddress.port}`;
    t.is(
      res.headers.link,
      `<${url}/v1/emails?page=1)>; rel="last", <${url}/v1/emails?page=1)>; rel="first"`
    );

    t.is(res.body[0].id, id);
    t.is(res.body[0].subject, `${emoji('tada')} beep`);

    t.deepEqual(
      _.sortBy(Object.keys(res.body[0])),
      _.sortBy([
        'accepted',
        'alias',
        'created_at',
        'date',
        'domain',
        'envelope',
        'hard_bounces',
        'id',
        'is_bounce',
        'is_locked',
        'is_redacted',
        'link',
        'messageId',
        'object',
        'soft_bounces',
        'status',
        'subject',
        'updated_at',
        'user'
      ])
    );
  }
});

test('retrieves email', async (t) => {
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  const domain = await utils.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();

  const alias = await utils.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

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
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  const domain = await utils.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();

  const alias = await utils.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

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
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  const domain = await utils.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();

  domain.smtp_emails_blocked.push('foo@foo.com', 'beep@beep.com');
  await domain.save();

  const alias = await utils.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

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

test('error_code_if_disabled', async (t) => {
  const user = await utils.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await utils.paymentFactory
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

  let domain;
  {
    const res = await t.context.api
      .post('/v1/domains')
      .auth(user[config.userFields.apiToken])
      .send({
        domain: 'example.com'
      });
    t.is(res.status, 200);
    t.is(res.body.name, 'example.com');
    domain = res.body;
  }

  // create an alias with ! -> 250
  {
    const res = await t.context.api
      .post(`/v1/domains/${domain.name}/aliases`)
      .auth(user[config.userFields.apiToken])
      .send({
        name: 'foo',
        is_enabled: false,
        error_code_if_disabled: 250
      });
    t.is(res.status, 200);
    t.is(res.body.name, 'foo');
    t.is(res.body.is_enabled, false);
    t.is(res.body.error_code_if_disabled, 250);
  }

  // create an alias with !! -> 421
  {
    const res = await t.context.api
      .post(`/v1/domains/${domain.name}/aliases`)
      .auth(user[config.userFields.apiToken])
      .send({
        name: 'bar',
        is_enabled: false,
        error_code_if_disabled: 421
      });
    t.is(res.status, 200);
    t.is(res.body.name, 'bar');
    t.is(res.body.is_enabled, false);
    t.is(res.body.error_code_if_disabled, 421);
  }

  // create an alias with !!! -> 550
  {
    const res = await t.context.api
      .post(`/v1/domains/${domain.name}/aliases`)
      .auth(user[config.userFields.apiToken])
      .send({
        name: 'baz',
        is_enabled: false,
        error_code_if_disabled: 550
      });
    t.is(res.status, 200);
    t.is(res.body.name, 'baz');
    t.is(res.body.is_enabled, false);
    t.is(res.body.error_code_if_disabled, 550);
  }

  // errors when attempts to use invalid status code
  {
    const res = await t.context.api
      .post(`/v1/domains/${domain.name}/aliases`)
      .auth(user[config.userFields.apiToken])
      .send({
        name: 'beep',
        is_enabled: false,
        error_code_if_disabled: 123
      });
    t.is(res.status, 400);
    t.is(
      res.body.message,
      'Error code if disabled must be either 250, 421, or 550.'
    );
  }

  const res = await t.context.api
    .get('/v1/lookup')
    .auth(Array.isArray(env.API_SECRETS) ? env.API_SECRETS[0] : env.API_SECRETS)
    .query({
      verification_record: domain.verification_record
    });
  t.is(res.status, 200);
  t.deepEqual(res.body, {
    alias_ids: [],
    has_imap: false,
    mapping: [user.email, '!foo', '!!bar', '!!!baz']
  });
});

test('encrypts and decrypts TXT', async (t) => {
  const input = 'forward-email=foo@bar.com';
  const res = await t.context.api
    .post('/v1/encrypt')
    .auth(Array.isArray(env.API_SECRETS) ? env.API_SECRETS[0] : env.API_SECRETS)
    .send({
      input
    });
  t.is(res.status, 200);
  t.true(res.text.startsWith('forward-email='));
  t.true(isBase64(res.text.split('forward-email=')[1]));
  t.is(
    decrypt(
      Buffer.from(res.text.split('forward-email=')[1], 'base64').toString(
        'utf8'
      ),
      env.TXT_ENCRYPTION_KEY
    ),
    'foo@bar.com'
  );
});
