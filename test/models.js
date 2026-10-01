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

test('escapes TXT record values in error messages shown as HTML', async (t) => {
  const map = new Map();
  map.set(
    'txt:html-in-txt.com',
    resolver.spoofPacket(
      'html-in-txt.com',
      'TXT',
      [
        'forward-email=x:<meta http-equiv=refresh content=0;url=https://evil.example>'
      ],
      true,
      ms('5m')
    )
  );
  await resolver.options.cache.mset(map);

  const { errors } = await Domains.getTxtAddresses(
    'html-in-txt.com',
    'en',
    false,
    resolver,
    false
  );
  t.is(errors.length, 1);
  t.false(errors[0].message.includes('<meta'));
  t.true(
    errors[0].message.includes(
      '&lt;meta http-equiv=refresh content=0;url=https://evil.example&gt;'
    )
  );
});
