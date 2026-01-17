/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');
const config = require('#config');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

// Helper function to create alias auth header
function createAliasAuth(aliasEmail, pass) {
  return `Basic ${Buffer.from(`${aliasEmail}:${pass}`).toString('base64')}`;
}

// Helper function to create test alias with paid plan and IMAP enabled
async function createTestAlias(t) {
  let user = await t.context.userFactory
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

  user = await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  await alias.save();

  // spoof dns records for paid domain verification
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    t.context.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await t.context.resolver.options.cache.mset(map);

  return { user, domain, alias, pass };
}

test('gets alias settings with defaults', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get('/v1/account')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  if (res.status !== 200)
    t.log('GET /v1/account response', {
      status: res.status,
      body: res.body
    });

  t.is(res.status, 200);
  t.is(res.body.settings.mail.archive_folder, null);
  t.is(res.body.settings.mail.sent_folder, null);
  t.is(res.body.settings.mail.drafts_folder, null);
  t.deepEqual(res.body.settings.label_settings, {});
  t.deepEqual(res.body.settings.aliases.defaults, {});
});

test('updates alias settings partially', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const payload = {
    settings: {
      mail: {
        archive_folder: 'Archive',
        sent_folder: 'Sent',
        drafts_folder: 'Drafts'
      },
      aliases: {
        defaults: { display_name: 'Me', signature: '-- Thanks' }
      }
    }
  };

  const res = await api
    .put('/v1/account')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(payload);

  if (res.status !== 200)
    t.log('PUT /v1/account response', {
      status: res.status,
      body: res.body
    });

  t.is(res.status, 200);
  t.is(res.body.settings.mail.archive_folder, 'Archive');
  t.is(res.body.settings.mail.sent_folder, 'Sent');
  t.is(res.body.settings.mail.drafts_folder, 'Drafts');
  t.is(res.body.settings.aliases.defaults.display_name, 'Me');
});

test('label CRUD', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const auth = createAliasAuth(`${alias.name}@${domain.name}`, pass);

  // initial labels list via account
  let res = await api.get('/v1/account').set('Authorization', auth);
  if (res.status !== 200)
    t.log('GET /v1/account response', {
      status: res.status,
      body: res.body
    });
  t.is(res.status, 200);
  t.deepEqual(res.body.settings.label_settings, {});

  // create label via account update
  res = await api
    .put('/v1/account')
    .set('Authorization', auth)
    .send({
      settings: {
        label_settings: {
          work: {
            name: 'Work',
            color: '#33AADD'
          }
        }
      }
    });
  if (res.status !== 200)
    t.log('PUT /v1/account (labels create) response', {
      status: res.status,
      body: res.body
    });
  t.is(res.status, 200);
  t.is(Object.keys(res.body.settings.label_settings).length, 1);
  t.is(res.body.settings.label_settings.work.name, 'Work');

  // update label (hide it)
  res = await api
    .put('/v1/account')
    .set('Authorization', auth)
    .send({
      settings: {
        label_settings: {
          work: {
            name: 'Work',
            color: '#112233',
            hidden: true
          }
        }
      }
    });
  if (res.status !== 200)
    t.log('PUT /v1/account (labels update) response', {
      status: res.status,
      body: res.body
    });
  t.is(res.status, 200);
  t.is(res.body.settings.label_settings.work.hidden, true);
  t.is(res.body.settings.label_settings.work.color, '#112233');

  // list returns label regardless of hidden
  res = await api.get('/v1/account').set('Authorization', auth);
  t.is(res.status, 200);
  t.is(Object.keys(res.body.settings.label_settings).length, 1);
  t.is(res.body.settings.label_settings.work.name, 'Work');

  // delete label
  res = await api
    .put('/v1/account')
    .set('Authorization', auth)
    .send({ settings: { label_settings: {} } });
  t.is(res.status, 200);

  res = await api.get('/v1/account').set('Authorization', auth);
  t.is(res.status, 200);
  t.deepEqual(res.body.settings.label_settings, {});
});

test('rejects invalid settings payloads', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const auth = createAliasAuth(`${alias.name}@${domain.name}`, pass);

  // invalid archive_folder type
  let res = await api
    .put('/v1/account')
    .set('Authorization', auth)
    .send({ settings: { mail: { archive_folder: 12345 } } });
  t.is(res.status, 400);

  // invalid sent_folder type
  res = await api
    .put('/v1/account')
    .set('Authorization', auth)
    .send({ settings: { mail: { sent_folder: 12345 } } });
  t.is(res.status, 400);

  // invalid drafts_folder type
  res = await api
    .put('/v1/account')
    .set('Authorization', auth)
    .send({ settings: { mail: { drafts_folder: 12345 } } });
  t.is(res.status, 400);

  // invalid aliases.defaults
  res = await api
    .put('/v1/account')
    .set('Authorization', auth)
    .send({ settings: { aliases: { defaults: ['not-an-object'] } } });
  t.is(res.status, 400);
});

test('rejects invalid label keyword and color', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const auth = createAliasAuth(`${alias.name}@${domain.name}`, pass);

  // invalid keyword (spaces)
  let res = await api
    .put('/v1/account')
    .set('Authorization', auth)
    .send({
      settings: {
        label_settings: {
          'bad keyword': {
            name: 'Bad',
            color: '#33AADD'
          }
        }
      }
    });
  t.is(res.status, 400);

  // invalid color
  res = await api
    .put('/v1/account')
    .set('Authorization', auth)
    .send({
      settings: {
        label_settings: {
          badcolor: {
            name: 'Bad Color',
            color: 'red'
          }
        }
      }
    });
  t.is(res.status, 400);

  // label_settings must contain object values
  res = await api
    .put('/v1/account')
    .set('Authorization', auth)
    .send({
      settings: {
        label_settings: {
          work: 'not-an-object'
        }
      }
    });
  t.is(res.status, 400);
});
