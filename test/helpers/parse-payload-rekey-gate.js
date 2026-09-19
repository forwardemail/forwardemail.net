/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const mongoose = require('mongoose');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const parsePayload = require('#helpers/parse-payload');
const { acquireRekeyLock, getRekeyLockKey } = require('#helpers/rekey-lock');
const { encrypt } = require('#helpers/encrypt-decrypt');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

test.beforeEach((t) => {
  const client = new Redis({ keyPrefix: randomUUID() });
  // the minimal sqlite-server context `parsePayload` needs before dispatch
  t.context.client = client;
  t.context.server = { client, isClosing: false };
});

test.afterEach.always((t) => {
  t.context.client.disconnect();
});

async function insertAlias({ is_rekey }) {
  const _id = new mongoose.Types.ObjectId();
  await Aliases.collection.insertOne({
    _id,
    id: _id.toString(),
    domain: new mongoose.Types.ObjectId(),
    user: new mongoose.Types.ObjectId(),
    name: 'alias',
    storage_location: 'storage_do_1',
    is_rekey,
    tokens: []
  });
  return _id.toString();
}

function payloadFor(aliasId, action, extra = {}) {
  return {
    id: randomUUID(),
    action,
    session: {
      user: {
        id: aliasId,
        username: 'alias@example.com',
        alias_id: aliasId,
        alias_name: 'alias',
        domain_id: new mongoose.Types.ObjectId().toString(),
        domain_name: 'example.com',
        password: encrypt('password'),
        storage_location: 'storage_do_1'
      }
    },
    ...extra
  };
}

test.serial(
  'mailbox operations are refused while the alias is being rekeyed',
  async (t) => {
    const { client, server } = t.context;
    const aliasId = await insertAlias({ is_rekey: true });
    const rekeyId = randomUUID();
    await acquireRekeyLock(client, aliasId, rekeyId);

    for (const action of [
      'vacuum',
      'status',
      'append',
      'sync',
      'backup',
      'reset'
    ]) {
      const err = await t.throwsAsync(
        parsePayload.call(server, payloadFor(aliasId, action))
      );
      t.is(err.code, 'SQLITE_BUSY', `${action} is refused`);
      t.is(err.responseCode, 421, `${action} is a temporary failure`);
      t.true(err.isRekeying, `${action} is flagged as rekeying`);
      t.true(err.ignoreHook, `${action} is not logged as a failure`);
    }

    // the lock is untouched
    t.is(await client.get(getRekeyLockKey(aliasId)), rekeyId);
  }
);

test.serial(
  'the size action and the rekey request itself are still served',
  async (t) => {
    const { client, server } = t.context;
    const aliasId = await insertAlias({ is_rekey: true });
    await acquireRekeyLock(client, aliasId, randomUUID());

    // both pass the gate: whatever they fail on later in this bare context,
    // it is never the gate error
    for (const action of ['size', 'rekey']) {
      const err = await t.throwsAsync(
        parsePayload.call(server, payloadFor(aliasId, action))
      );
      t.falsy(err.isRekeying, `${action} passes the gate`);
      t.not(err.code, 'SQLITE_BUSY', `${action} passes the gate`);
    }
  }
);

test.serial(
  'a lock left behind by a finished rekey is released instead of blocking',
  async (t) => {
    const { client, server } = t.context;
    const aliasId = await insertAlias({ is_rekey: false });
    await acquireRekeyLock(client, aliasId, randomUUID());

    // `vacuum` is gated and, once past the gate, simply acknowledges
    t.true(await parsePayload.call(server, payloadFor(aliasId, 'vacuum')));
    t.is(await client.get(getRekeyLockKey(aliasId)), null);
  }
);

test.serial(
  'gated actions are served for aliases that are not rekeying',
  async (t) => {
    const { client, server } = t.context;
    const aliasId = await insertAlias({ is_rekey: false });

    t.true(await parsePayload.call(server, payloadFor(aliasId, 'vacuum')));
    t.is(await client.get(getRekeyLockKey(aliasId)), null);
  }
);

test.serial(
  'when the rekey state cannot be read the gate lets requests through and inbound mail is kept safe',
  async (t) => {
    const { client } = t.context;
    const aliasId = await insertAlias({ is_rekey: true });
    await acquireRekeyLock(client, aliasId, randomUUID());

    // Redis is unavailable
    const broken = {
      get() {
        return Promise.reject(new Error('Connection is closed.'));
      }
    };
    t.false(await parsePayload.isAliasRekeying(broken, aliasId));
    t.true(
      await parsePayload.isAliasRekeying(broken, aliasId, {
        assumeOnError: true
      })
    );
    // the gate assumes "not rekeying" so an outage does not refuse every
    // mailbox operation
    t.true(
      await parsePayload.call(
        { client: broken, isClosing: false },
        payloadFor(aliasId, 'vacuum')
      )
    );

    // Redis works but MongoDB is unavailable: a caller with a safe fallback
    // assumes "rekeying", and the gate refuses the request with the same
    // retryable error (the rotation may well be running)
    const { findById } = Aliases;
    Aliases.findById = () => {
      throw new Error('MongoDB is unavailable');
    };

    try {
      t.true(
        await parsePayload.isAliasRekeying(client, aliasId, {
          assumeOnError: true
        })
      );
      const err = await t.throwsAsync(
        parsePayload.isAliasRekeying(client, aliasId)
      );
      t.is(err.code, 'SQLITE_BUSY');
      t.is(err.responseCode, 421);
      t.true(err.isRekeying);
      t.true(err.ignoreHook);
      t.regex(err.message, /could not be verified/);
    } finally {
      Aliases.findById = findById;
    }

    // a working backend answers from the lock and the flag
    t.true(await parsePayload.isAliasRekeying(client, aliasId));
  }
);

test.serial(
  'a negative answer is cached briefly and forgotten when a rotation announces itself',
  async (t) => {
    const { client } = t.context;
    const aliasId = await insertAlias({ is_rekey: true });

    // count the Redis lookups the gate makes
    let lookups = 0;
    const counting = {
      get(...args) {
        lookups++;
        return client.get(...args);
      }
    };

    t.false(await parsePayload.isAliasRekeying(counting, aliasId));
    t.false(await parsePayload.isAliasRekeying(counting, aliasId));
    t.false(await parsePayload.isAliasRekeying(counting, aliasId));
    t.is(lookups, 1);

    // the rotation starts: the controller takes the lock and announces it
    await acquireRekeyLock(client, aliasId, randomUUID());
    // (still cached until the announcement arrives)
    t.false(await parsePayload.isAliasRekeying(counting, aliasId));
    t.is(lookups, 1);
    parsePayload.forgetRekeyState(aliasId);
    t.true(await parsePayload.isAliasRekeying(counting, aliasId));
    t.is(lookups, 2);
    // a positive answer is never cached
    t.true(await parsePayload.isAliasRekeying(counting, aliasId));
    t.is(lookups, 3);

    // the cache can be bypassed, and expires on its own
    parsePayload.forgetRekeyState(aliasId);
    await Aliases.updateOne({ _id: aliasId }, { $set: { is_rekey: false } });
    t.false(await parsePayload.isAliasRekeying(counting, aliasId));
    t.is(lookups, 4);
    t.false(
      await parsePayload.isAliasRekeying(counting, aliasId, { cache: false })
    );
    t.is(lookups, 5);
    await new Promise((resolve) => {
      setTimeout(resolve, 2100);
    });
    t.false(await parsePayload.isAliasRekeying(counting, aliasId));
    t.is(lookups, 6);
  }
);
