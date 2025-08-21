/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');
const { setTimeout } = require('node:timers/promises');

const ObjectID = require('bson-objectid');
const Redis = require('ioredis-mock');
const dashify = require('dashify');
const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const intoStream = require('into-stream');
const ip = require('ip');
const isBase64 = require('is-base64');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('@forwardemail/smtp-server');

// const _ = require('lodash');
const utils = require('../utils');

/*
function findKeyDifferences(object1, object2) {
  const keys1 = _.keys(object1);
  const keys2 = object2;

  const addedKeys = _.difference(keys2, keys1);
  const removedKeys = _.difference(keys1, keys2);
  const commonKeys = _.intersection(keys1, keys2);

  return {
    added: addedKeys,
    removed: removedKeys,
    common: commonKeys
  };
}
*/

const _ = require('#helpers/lodash');
const config = require('#config');
const createSession = require('#helpers/create-session');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const logger = require('#helpers/logger');
const phrases = require('#config/phrases');
const processEmail = require('#helpers/process-email');
const { Logs, Domains, Emails } = require('#models');
const { decrypt } = require('#helpers/encrypt-decrypt');

// dynamically import @ava/get-port
let getPort;
import('@ava/get-port').then((obj) => {
  getPort = obj.default;
});

const { emoji } = config.views.locals;

// domain keys from API responses
const keys = _.sortBy([
  'has_newsletter',
  'ignore_mx_check',
  'has_delivery_logs',
  'retention_days',
  'has_regex',
  'has_catchall',
  'allowlist',
  'denylist',
  'restricted_alias_names',
  'has_adult_content_protection',
  'has_phishing_protection',
  'has_executable_protection',
  'has_virus_protection',
  'is_catchall_regex_disabled',
  'has_smtp',
  'is_smtp_suspended',
  'plan',
  'max_recipients_per_alias',
  'smtp_port',
  'members',
  'invites',
  'name',
  'has_mx_record',
  'has_txt_record',
  'verification_record',
  'has_dkim_record',
  'has_return_path_record',
  'has_dmarc_record',
  'has_recipient_verification',
  'has_custom_verification',
  'id',
  'object',
  'created_at',
  'updated_at',
  'storage_used',
  'storage_used_by_aliases',
  'storage_quota',
  'smtp_dns_records',
  'link'
]);

const IP_ADDRESS = ip.address();
const client = new Redis();
client.setMaxListeners(0);
const resolver = createTangerine(client);

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);

test('fails when no creds are presented', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/account');
  t.is(res.status, 401);
});

test("returns current user's account", async (t) => {
  const { api } = t.context;
  const body = {
    email: falso.randEmail(),
    password: falso.randPassword()
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
  await setTimeout(100);

  const match = await Logs.findOne({ message: log.message });
  t.true(match !== null);
});

test('creates domain', async (t) => {
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
      'vacation_responder',

      'user',
      'domain'
    ])
  );

  t.deepEqual(
    _.sortBy(Object.keys(res.body.user)),
    _.sortBy([
      'has_newsletter',
      'max_quota_per_alias',
      'address_country',
      'address_html',
      'created_at',
      'display_name',
      'email',
      'full_email',
      'id',
      'last_locale',
      'locale',
      'object',
      'otp_enabled',
      'opt_out_templates',
      'timezone',
      'plan',
      'sessions',
      'updated_at'
    ])
  );

  t.deepEqual(
    _.sortBy(Object.keys(res.body.domain)),
    _.sortBy(
      _.without(
        keys,
        'link',
        'smtp_dns_records',
        'storage_quota',
        'storage_used',
        'storage_used_by_aliases'
      )
    )
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
        'vacation_responder',

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
    t.is(
      res.headers.link,
      `<${t.context.apiURL}/v1/domains/${domain.name}/aliases?page=1)>; rel="last", <${t.context.apiURL}/v1/domains/${domain.name}/aliases?page=1)>; rel="first"`
    );
  }
});

test('domain-wide catch-all passwords', async (t) => {
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

  {
    const res = await t.context.api
      .post(`/v1/domains/${domain.name}/catch-all-passwords`)
      .auth(user[config.userFields.apiToken])
      .send();
    t.is(res.status, 200);
    t.true(typeof res.body.id === 'string');
    t.true(res.body.id.length > 0);
    t.is(res.body.username, `*@${domain.name}`);
    t.true(typeof res.body.password === 'string');
    t.true(res.body.password.length > 0);
    t.is(res.body.description, '');
  }

  {
    const newPassword = falso.randPassword();
    const res = await t.context.api
      .post(`/v1/domains/${domain.name}/catch-all-passwords`)
      .auth(user[config.userFields.apiToken])
      .send({
        new_password: newPassword,
        description: 'foo bar'
      });
    t.is(res.status, 200);
    t.is(res.body.username, `*@${domain.name}`);
    t.is(res.body.password, newPassword);
    t.is(res.body.description, 'foo bar');
  }

  {
    const res = await t.context.api
      .get(`/v1/domains/${domain.name}/catch-all-passwords`)
      .auth(user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send();
    t.is(res.body.length, 2);
    t.is(res.status, 200);
    // delete one
    const deleteRes = await t.context.api
      .del(`/v1/domains/${domain.name}/catch-all-passwords/${res.body[0].id}`)
      .auth(user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send();
    t.is(deleteRes.status, 200);
    const res2 = await t.context.api
      .get(`/v1/domains/${domain.name}/catch-all-passwords`)
      .auth(user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send();
    t.is(res2.body.length, 1);
    t.is(res2.status, 200);
  }
});

test('creates alias and generates password', async (t) => {
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
      new_password: falso.randPassword()
    });
  t.is(res2.status, 500);

  // t.is(res2.status, 408);
  // t.is(res2.body.username, `test@${domain.name}`);
  // t.is(res2.body.password, '...');
});

test('creates alias with multiple recipients', async (t) => {
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
    const base64Gif = 'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='; // 1x1 transparent gif
    const res = await t.context.api
      .post('/v1/emails')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        from: `${emoji('blush')} Test <${alias.name}@${domain.name}>`,
        to: 'test@foo.com',
        subject: `${emoji('blush')} testing this`,
        text: 'test',
        attachments: [
          {
            filename: 'image.gif',
            content: base64Gif,
            encoding: 'base64',
            contentType: 'image/gif'
          }
        ]
      });

    t.true(res.body.message.includes(base64Gif));
    t.true(
      res.body.message.includes('Content-Type: image/gif; name=image.gif')
    );
    t.is(res.status, 200);

    // validate header From was converted properly
    t.is(
      res.body.headers.From,
      `"${emoji('blush')} Test" <${alias.name}@${domain.name}>`
    );
    t.is(res.body.headers.Subject, `${emoji('blush')} testing this`);
    t.true(
      res.body.message.includes(
        `From: "=?UTF-8?Q?=F0=9F=98=8A?= Test" <${alias.name}@${domain.name}>`
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
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
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
    logger: false,
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
    delete email.message;
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
    delete email.message;
    t.is(email.id, res.body.id);
    t.is(email.status, 'sent');
    t.deepEqual(email.accepted.sort(), res.body.envelope.to.sort());
    t.deepEqual(email.rejectedErrors, []);
  }
});

// multipart/form-data
test('creates email with binary attachment', async (t) => {
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

  //
  // create email
  // (with large payload to ensure body-parser working properly past default limit)
  //
  const base64Gif = 'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='; // 1x1 transparent gif
  const gifBuffer = Buffer.from(base64Gif, 'base64');
  const res = await t.context.api
    .post('/v1/emails')
    .auth(user[config.userFields.apiToken])
    .attach('attachment', gifBuffer, 'image.gif') // Attach the file as a buffer (single file)
    .attach('attachments', intoStream(gifBuffer), 'image0.gif') // Attach the file as a stream
    .attach('attachments', gifBuffer, 'image1.gif') // Attach the file as a buffer
    .field('from', `${alias.name}@${domain.name}`)
    .field('to', 'test@foo.com')
    .field('subject', 'test')
    .field('text', 'test message');

  t.true(res.body.message.includes(base64Gif));
  t.true(res.body.message.includes('Content-Type: image/gif; name=image.gif'));
  t.true(res.body.message.includes('Content-Type: image/gif; name=image0.gif'));
  t.true(res.body.message.includes('Content-Type: image/gif; name=image1.gif'));
  t.is(res.status, 200);
});

test('5+ day email bounce', async (t) => {
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
  await setTimeout(1000);
});

test('smtp outbound spam block detection', async (t) => {
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
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
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
    logger: false,
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
    delete email.message; // suppress buffer output from console log
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
    delete email.message;
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
    delete email.message;
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
  await setTimeout(1000);
});

test('creates, retrieves, and lists domains', async (t) => {
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

  // create domain
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
    t.deepEqual(_.sortBy(Object.keys(res.body)), keys);
  }

  // list domains
  // (excludes "invites", "locale", and "members")
  {
    const res = await t.context.api
      .get('/v1/domains')
      .auth(user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send();

    t.is(res.status, 200);
    t.is(res.body.length, 1);
    t.deepEqual(
      _.sortBy(Object.keys(res.body[0])),
      _.sortBy(_.without(keys, 'invites', 'members'))
    );
  }

  // retrieve domain
  // (excludes "locale")
  {
    const res = await t.context.api
      .get('/v1/domains/testdomain1.com')
      .auth(user[config.userFields.apiToken])
      .set('Accept', 'application/json')
      .send();

    t.is(res.status, 200);
    t.deepEqual(_.sortBy(Object.keys(res.body)), keys);
  }

  // update domain
  {
    const res = await t.context.api
      .put('/v1/domains/testdomain1.com')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        ignore_mx_check: true
      });

    t.is(res.status, 200);
    t.deepEqual(_.sortBy(Object.keys(res.body)), keys);
  }
});

test('create domain without catchall', async (t) => {
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
    t.is(
      res.headers.link,
      `<${t.context.apiURL}/v1/domains/testdomain1.com/aliases?page=1)>; rel="last", <${t.context.apiURL}/v1/domains/testdomain1.com/aliases?page=1)>; rel="first"`
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
      _.sortBy(_.without(keys, 'invites', 'members'))
    );
    t.is(res.headers['x-page-count'], '1');
    t.is(res.headers['x-page-current'], '1');
    t.is(res.headers['x-page-size'], '1');
    t.is(res.headers['x-item-count'], '1');
    t.is(
      res.headers.link,
      `<${t.context.apiURL}/v1/domains?page=1)>; rel="last", <${t.context.apiURL}/v1/domains?page=1)>; rel="first"`
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
    t.is(
      res.headers.link,
      `<${t.context.apiURL}/v1/emails?page=1)>; rel="last", <${t.context.apiURL}/v1/emails?page=1)>; rel="first"`
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

test('404 instead of 500', async (t) => {
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
  const res = await t.context.api
    .get(`/v1/emails/512312312`)
    .auth(user[config.userFields.apiToken])
    .set('Accept', 'application/json');
  t.is(res.status, 404);
});

test('removes email', async (t) => {
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

  t.true(domain !== null);

  domain.smtp_emails_blocked.push('foo@foo.com', 'beep@beep.com');
  await domain.save();

  const alias = await t.context.aliasFactory
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
    delete email.message; // suppress buffer output from console log
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
    alias_public_key: false,
    has_imap: false,
    mapping: [user.email, '!foo', '!!bar', '!!!baz'],
    vacation_responder: false
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

// TODO: this same test is on SMTP side too for consistency
test('parses UTF-8 encoded headers', async (t) => {
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

  const raw = `From: Test <${alias.name}@${domain.name}>
To: Forward Email <support@forwardemail.net>
Subject: =?UTF-8?Q?Forward_Email_=E2=80=93_Code_Bug=3A_Erro?=
 =?UTF-8?Q?r_-_Mail_command_failed=3A_550_5=2E7=2E1?=
 =?UTF-8?Q?_Unfortunately=2C_messages_from_=5B164?=
 =?UTF-8?Q?=2E92=2E70=2E200=5D_weren=27t_sent=2E_Pl?=
 =?UTF-8?Q?ease_contact_your_Internet_service_provi?=
 =?UTF-8?Q?der_since_part_of_their_network_is_on_ou?=
 =?UTF-8?Q?r_block_list_=28S3150=29=2E_You_can_also?=
 =?UTF-8?Q?_refer_your_provider_to_http=3A//mail=2E?=
 =?UTF-8?Q?live=2Ecom/mail/troubleshooting=2Easpx?=
 =?UTF-8?Q?=23errors=2E_=5BName=3DProtocol_Filter_A?=
 =?UTF-8?Q?gent=5D=5BAGT=3DPFA=5D=5BMxId=3D11B98999?=
 =?UTF-8?Q?1C72A5F2=5D_=5BBL6PEPF00022571=2Enamprd0?=
 =?UTF-8?Q?2=2Eprod=2Eoutlook=2Ecom_2024-08-25T23?=
 =?UTF-8?Q?=3A54=3A32=2E568Z_08DCC4CC8ECEBA56=5D_?=
 =?UTF-8?Q?=2866cbc438d0090cee7c346279=29?=
Message-ID: <2774d75d-b6a2-7146-7eca-6b226d0ce5fc@forwardemail.net>
Date: Sun, 25 Aug 2024 23:54:33 +0000
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: quoted-printable

SYSTEM ALERT
`.trim();

  const res = await t.context.api
    .post('/v1/emails')
    .auth(user[config.userFields.apiToken])
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      raw
    });

  t.is(res.status, 200);

  t.is(
    res.body.headers.Subject,
    "Forward Email – Code Bug: Error - Mail command failed: 550 5.7.1 Unfortunately, messages from [164.92.70.200] weren't sent. Please contact your Internet service provider since part of their network is on our block list (S3150). You can also refer your provider to http://mail.live.com/mail/troubleshooting.aspx#errors. [Name=Protocol Filter Agent][AGT=PFA][MxId=11B989991C72A5F2] [BL6PEPF00022571.namprd02.prod.outlook.com 2024-08-25T23:54:32.568Z 08DCC4CC8ECEBA56] (66cbc438d0090cee7c346279)"
  );
});

// <https://github.com/forwardemail/forwardemail.net/issues/285>
test('alias pagination', async (t) => {
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

  for (let i = 0; i < 15; i++) {
    await t.context.aliasFactory
      .withState({
        name: dashify(falso.randFirstName().toLowerCase() + i.toString()),
        user: user._id,
        domain: domain._id,
        recipients: [falso.randEmail()]
      })
      .create();
  }

  {
    const res = await t.context.api
      .get(`/v1/domains/${domain.name}/aliases?page=1&limit=10`)
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    t.is(res.status, 200);
    t.is(res.body.length, 10);
    t.is(res.headers['x-page-count'], '2');
    t.is(res.headers['x-page-current'], '1');
    t.is(res.headers['x-page-size'], '10');
    t.is(res.headers['x-item-count'], '15');
  }

  {
    const res = await t.context.api
      .get(`/v1/domains/${domain.name}/aliases?page=2&limit=10`)
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    t.is(res.status, 200);
    t.is(res.body.length, 5);
    t.is(res.headers['x-page-count'], '2');
    t.is(res.headers['x-page-current'], '2');
    t.is(res.headers['x-page-size'], '5');
    t.is(res.headers['x-item-count'], '15');
  }
});
