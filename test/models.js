/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const Redis = require('ioredis-mock');

const ms = require('ms');
const utils = require('./utils');

const Domains = require('#models/domains');
const createTangerine = require('#helpers/create-tangerine');

const client = new Redis();
client.setMaxListeners(0);
const resolver = createTangerine(client);

test.before(utils.setupMongoose);

// <https://github.com/forwardemail/forwardemail.net/issues/229>
test('correctly parses TXT records', async (t) => {
  // spoof dns records
  const map = new Map();

  map.set(
    `txt:test.com`,
    resolver.spoofPacket(
      'test.com',
      'TXT',
      [`forward-email=alias:https://requestbin.com/r/en8pfhdgcculn`],
      true,
      ms('5m')
    )
  );

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  {
    const records = await resolver.resolveTxt('test.com');
    t.deepEqual(records, [
      [`forward-email=alias:https://requestbin.com/r/en8pfhdgcculn`]
    ]);
  }

  {
    const records = await Domains.getTxtAddresses(
      'test.com',
      'en',
      false,
      resolver,
      false // purgeCache = false
    );
    t.is(records.hasRegex, false);
  }
});
