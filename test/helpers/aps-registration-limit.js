/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Push registrations made in a loop (IMAP XAPPLEPUSHSERVICE, DAV `/apns`)
// keep only the newest ones, so they can neither grow the alias document
// without limit nor fan every new message out to that many pushes.
//

const Axe = require('axe');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const davApnsSubscribe = require('#helpers/dav-apns-subscribe');
const onXAPPLEPUSHSERVICE = require('#helpers/imap/on-xapplepushservice');
const { MAX_APS_REGISTRATIONS } = require('#helpers/push-aps-registration');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const user = await t.context.userFactory.create();
  const domain = await t.context.domainFactory
    .withState({ members: [{ user: user._id, group: 'admin' }] })
    .create();
  t.context.alias = await t.context.aliasFactory
    .withState({ user: user._id, domain: domain._id, recipients: [user.email] })
    .create();
});

const token = (i) => i.toString(16).padStart(64, '0');
const accountId = (i) =>
  `00000000-0000-4000-8000-${i.toString(16).padStart(12, '0')}`;

async function registrations(alias) {
  const { aps } = await Aliases.findById(alias._id)
    .select('+aps')
    .lean()
    .exec();
  return aps;
}

test('DAV registrations keep only the newest', async (t) => {
  const { alias } = t.context;
  const total = MAX_APS_REGISTRATIONS + 50;
  for (let i = 0; i < total; i++) {
    const ctx = {
      request: { body: { token: token(i), key: `key-${i}` } },
      query: {},
      host: 'caldav.example.com',
      state: { session: { user: { alias_id: alias.id } } },
      set() {}
    };
    await davApnsSubscribe(ctx);
    t.is(ctx.status, 200);
  }

  const aps = await registrations(alias);
  t.is(aps.length, MAX_APS_REGISTRATIONS);
  t.is(aps.at(-1).key, `key-${total - 1}`);
  t.is(aps[0].key, `key-${total - MAX_APS_REGISTRATIONS}`);
});

test('IMAP registrations keep only the newest', async (t) => {
  const { alias } = t.context;
  const server = {
    logger: new Axe({ silent: true }),
    async refreshSession() {}
  };
  const session = { user: { alias_id: alias.id } };
  const total = MAX_APS_REGISTRATIONS + 50;
  for (let i = 0; i < total; i++) {
    // (the reply needs APNs certificates, which tests do not have)
    await new Promise((resolve) => {
      onXAPPLEPUSHSERVICE.call(
        server,
        accountId(i),
        token(i),
        'com.apple.mobilemail',
        ['INBOX'],
        session,
        resolve
      );
    });
  }

  const aps = await registrations(alias);
  t.is(aps.length, MAX_APS_REGISTRATIONS);
  t.is(aps.at(-1).device_token, token(total - 1));
});
