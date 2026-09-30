/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// An Ubuntu team domain whose DNS answer intermittently lacks its site
// verification TXT record or MX. Runs the real lookup (DNS answers stubbed,
// domain, user and alias in a real database): an incomplete answer is looked
// up again without our DNS cache, and when it is still incomplete the sender
// gets a temporary 421 instead of a permanent 550 "does not exist".
//

const test = require('ava');
const Redis = require('ioredis-mock');
const mongoose = require('mongoose');

const utils = require('../utils');
const config = require('#config');
const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const getForwardingAddresses = require('#helpers/get-forwarding-addresses');

// every Ubuntu team domain we serve, and one that is not
const UBUNTU_DOMAINS = Object.keys(config.ubuntuTeamMapping);
const OTHER_DOMAIN = 'notubuntu.example';

const verificationFor = (host) => `test${host.replace(/\W/g, '')}`;

// TXT answers by kind: 'full' (as published), 'noverify' (missing the site
// verification record) or 'empty'
function txtFor(host, kind) {
  const spf = ['v=spf1 include:spf.forwardemail.net ~all'];
  if (kind === 'empty') return [];
  if (kind === 'noverify') return [spf];
  return [[`forward-email-site-verification=${verificationFor(host)}`], spf];
}

const MX = [{ exchange: 'mx.example.net', priority: 10 }];
const FULL = { txt: 'full', mx: MX };

test.before(utils.setupMongoose);

test.before(async () => {
  const now = new Date();
  const admin = new mongoose.Types.ObjectId();
  const member = new mongoose.Types.ObjectId();
  await Users.collection.insertMany([
    {
      _id: admin,
      id: admin.toString(),
      email: 'admin@example.com',
      group: 'user',
      plan: 'team',
      is_banned: false,
      plan_set_at: new Date('2024-01-01'),
      plan_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      created_at: now,
      updated_at: now
    },
    {
      _id: member,
      id: member.toString(),
      email: 'member@example.org',
      group: 'user',
      plan: 'free',
      is_banned: false,
      created_at: now,
      updated_at: now
    }
  ]);
  for (const name of [...UBUNTU_DOMAINS, OTHER_DOMAIN]) {
    const _id = new mongoose.Types.ObjectId();
    await Domains.collection.insertOne({
      _id,
      id: _id.toString(),
      name,
      plan: 'team',
      has_txt_record: true,
      has_mx_record: true,
      is_global: false,
      has_catchall: false,
      has_regex: false,
      verification_record: verificationFor(name),
      members: [
        { user: admin, group: 'admin' },
        { user: member, group: 'user' }
      ],
      created_at: now,
      updated_at: now
    });
    await Aliases.collection.insertOne({
      _id: new mongoose.Types.ObjectId(),
      id: new mongoose.Types.ObjectId().toString(),
      name: 'jose',
      user: member,
      domain: _id,
      is_enabled: true,
      recipients: ['member@example.org'],
      has_recipient_verification: false,
      verified_recipients: [],
      created_at: now,
      updated_at: now
    });
  }
});

test.after.always(utils.teardownMongoose);

//
// `answers` is a list of { txt, mx } (or an Error to throw) given in turn to
// each lookup; the last one repeats. Records whether the cache was bypassed.
//
function context(answers) {
  const calls = { txt: [], mx: [] };
  const next = (kind) => {
    const index = Math.min(calls[kind].length, answers.length - 1);
    return answers[index];
  };

  const answer = (kind, host, options) => {
    const value = next(kind);
    calls[kind].push({ host, purgeCache: Boolean(options?.purgeCache) });
    if (value instanceof Error) throw value;
    if (!UBUNTU_DOMAINS.includes(host) && host !== OTHER_DOMAIN) {
      const err = new Error(`ENODATA ${host}`);
      err.code = 'ENODATA';
      throw err;
    }

    // (built fresh each time: the lookup rewrites the records in place)
    if (kind === 'txt') return txtFor(host, value.txt);
    return structuredClone(value.mx);
  };

  return {
    calls,
    client: new Redis(),
    resolver: {
      async resolveTxt(host, options) {
        return answer('txt', host, options);
      },
      async resolveMx(host, options) {
        return answer('mx', host, options);
      }
    }
  };
}

function enodata() {
  const err = new Error('queryTxt ENODATA ubuntu.com');
  err.code = 'ENODATA';
  return err;
}

async function lookup(ctx, address = 'jose@ubuntu.com') {
  try {
    const result = await getForwardingAddresses.call(ctx, address, []);
    return { addresses: result.addresses };
  } catch (err) {
    return { responseCode: err.responseCode, message: err.message };
  }
}

test.serial('a complete answer forwards without a second lookup', async (t) => {
  const ctx = context([FULL]);
  t.deepEqual(await lookup(ctx), { addresses: ['member@example.org'] });
  t.false(ctx.calls.txt.some((c) => c.purgeCache));
});

for (const [name, first] of [
  ['TXT without the verification record', { txt: 'noverify', mx: MX }],
  ['no TXT records', { txt: 'empty', mx: MX }],
  ['an empty MX answer', { txt: 'full', mx: [] }],
  ['a TXT lookup with no data', enodata()]
]) {
  test.serial(
    `${name}: forwards when a fresh lookup has the records`,
    async (t) => {
      const ctx = context([first, FULL]);
      t.deepEqual(await lookup(ctx), { addresses: ['member@example.org'] });
      t.true(ctx.calls.txt.some((c) => c.purgeCache));
    }
  );

  test.serial(
    `${name}: 421 when a fresh lookup is still missing them`,
    async (t) => {
      const ctx = context([first]);
      const result = await lookup(ctx);
      t.is(result.responseCode, 421);
      t.regex(result.message, /try again later/);
    }
  );
}

test.serial(
  'an alias that does not exist is still refused with 550',
  async (t) => {
    const ctx = context([FULL]);
    const result = await lookup(ctx, 'nobody@ubuntu.com');
    t.is(result.responseCode, 550);
    t.is(result.message, 'nobody@ubuntu.com does not exist');
  }
);

test.serial(
  'other domains are unchanged: an incomplete answer is 550',
  async (t) => {
    const ctx = context([{ txt: 'noverify', mx: MX }]);
    const result = await lookup(ctx, `jose@${OTHER_DOMAIN}`);
    t.is(result.responseCode, 550);
    t.false(ctx.calls.txt.some((c) => c.purgeCache));
  }
);

for (const host of UBUNTU_DOMAINS) {
  test.serial(`${host}: an incomplete answer is looked up again`, async (t) => {
    const ctx = context([{ txt: 'noverify', mx: MX }, FULL]);
    t.deepEqual(await lookup(ctx, `jose@${host}`), {
      addresses: ['member@example.org']
    });
    t.true(ctx.calls.txt.some((c) => c.host === host && c.purgeCache));
  });

  test.serial(`${host}: still incomplete is a 421`, async (t) => {
    const ctx = context([{ txt: 'full', mx: [] }]);
    const result = await lookup(ctx, `jose@${host}`);
    t.is(result.responseCode, 421);
  });
}
