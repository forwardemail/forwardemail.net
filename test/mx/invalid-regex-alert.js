/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The alert about an invalid regular expression alias quotes the alias and
// its pattern from the domain's DNS records, so they are escaped: the
// records' owner must not be able to put markup in an email sent from us
// (to the domain's admins, with a copy to our alerts address).
//

const emailPath = require.resolve('#helpers/email');
require(emailPath);
const sent = [];
require.cache[emailPath].exports = async (data) => {
  sent.push(data);
};

const mongoose = require('mongoose');
const pWaitFor = require('p-wait-for');
const Redis = require('ioredis-mock');
const test = require('ava');

const utils = require('../utils');

const Domains = require('#models/domains');
const Users = require('#models/users');
const getForwardingAddresses = require('#helpers/get-forwarding-addresses');

const DOMAIN = 'invalid-regex.example';
const PATTERN = '/<a href=https://phish.example>reset(/';

test.before(utils.setupMongoose);
test.before(async () => {
  const now = new Date();
  const admin = new mongoose.Types.ObjectId();
  await Users.collection.insertOne({
    _id: admin,
    id: admin.toString(),
    email: 'admin@example.com',
    group: 'user',
    plan: 'free',
    is_banned: false,
    has_verified_email: true,
    created_at: now,
    updated_at: now
  });
  const _id = new mongoose.Types.ObjectId();
  await Domains.collection.insertOne({
    _id,
    id: _id.toString(),
    name: DOMAIN,
    plan: 'free',
    has_txt_record: true,
    has_mx_record: true,
    is_global: false,
    members: [{ user: admin, group: 'admin' }],
    created_at: now,
    updated_at: now
  });
});
test.after.always(utils.teardownMongoose);

test.after.always(() => {
  delete require.cache[emailPath];
});

test('the alias and its pattern are escaped', async (t) => {
  const ctx = {
    client: new Redis(),
    resolver: {
      async resolveTxt(host) {
        if (host !== DOMAIN) {
          const err = new Error(`ENODATA ${host}`);
          err.code = 'ENODATA';
          throw err;
        }

        return [[`forward-email=${PATTERN}:someone@example.org`]];
      },
      async resolveMx() {
        return [{ exchange: 'mx1.forwardemail.net', priority: 10 }];
      }
    }
  };

  try {
    await getForwardingAddresses.call(ctx, `user@${DOMAIN}`, []);
  } catch {}

  await pWaitFor(() => sent.length > 0, { timeout: 10_000 });
  const { message } = sent[0].locals;
  t.true(message.includes('&lt;a href=https://phish.example&gt;'));
  t.false(message.includes('<a href'));
});
