/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const config = require('#config');
const { transferDomain } = require('#helpers/transfer-domain');

function query(result) {
  return {
    select() {
      return this;
    },
    lean() {
      return this;
    },
    async exec() {
      return result;
    }
  };
}

test('restores current ownership records when saving the transferred domain fails', async (t) => {
  const oldUser = { _id: 'old-user' };
  const newUser = {
    _id: 'new-user',
    [config.userFields.hasVerifiedEmail]: true,
    [config.userFields.isBanned]: false,
    plan: 'free'
  };
  const aliasOwners = [
    {
      _id: 'alias-id',
      user: oldUser._id,
      tokens: [{ description: 'old password', salt: 'salt', hash: 'hash' }],
      rekey_previous_tokens: [],
      is_rekey: false,
      aps: [{ device_token: 'old-device' }],
      has_pgp: true,
      public_key: 'old public key',
      has_smime: true,
      smime_certificate: 'old certificate'
    }
  ];
  const emailOwners = [{ _id: 'queued-email-id', user: oldUser._id }];
  const sieveOwners = [{ _id: 'sieve-id', user: oldUser._id }];
  const calls = {
    aliases: [],
    emails: [],
    sieveScripts: []
  };
  const aliases = {
    async exists() {
      return null;
    },
    find() {
      return query(aliasOwners);
    },
    async updateMany(filter, update) {
      calls.aliases.push({ type: 'updateMany', filter, update });
    },
    async bulkWrite(operations) {
      calls.aliases.push({ type: 'bulkWrite', operations });
    }
  };
  const emails = {
    find() {
      return query(emailOwners);
    },
    async updateMany(filter, update) {
      calls.emails.push({ type: 'updateMany', filter, update });
    },
    async bulkWrite(operations) {
      calls.emails.push({ type: 'bulkWrite', operations });
    }
  };
  const sieveScripts = {
    find() {
      return query(sieveOwners);
    },
    async updateMany(filter, update) {
      calls.sieveScripts.push({ type: 'updateMany', filter, update });
    },
    async bulkWrite(operations) {
      calls.sieveScripts.push({ type: 'bulkWrite', operations });
    }
  };
  const domain = {
    _id: 'domain-id',
    is_global: false,
    plan: 'free',
    name: 'example.com',
    members: [{ user: oldUser._id, group: 'admin' }],
    invites: [],
    tokens: [],
    async save() {
      throw new Error('simulated domain save failure');
    }
  };

  const error = await t.throwsAsync(
    transferDomain({
      domain,
      sourceUser: oldUser,
      user: newUser,
      admin: { _id: 'admin-id' },
      aliases,
      emails,
      sieveScripts
    })
  );

  t.is(error.message, 'simulated domain save failure');
  t.deepEqual(calls.aliases[0].update.$set, { user: newUser._id });
  t.false('tokens' in calls.aliases[0].update.$set);
  t.false('aps' in calls.aliases[0].update.$set);
  t.false('has_pgp' in calls.aliases[0].update.$set);
  t.false('has_smime' in calls.aliases[0].update.$set);
  t.deepEqual(calls.emails[0].update.$set.user, newUser._id);
  t.deepEqual(calls.sieveScripts[0].update.$set.user, newUser._id);
  t.deepEqual(
    calls.aliases[1].operations[0].updateOne.update.$set.user,
    oldUser._id
  );
  t.deepEqual(
    calls.emails[1].operations[0].updateOne.update.$set.user,
    oldUser._id
  );
  t.deepEqual(
    calls.sieveScripts[1].operations[0].updateOne.update.$set.user,
    oldUser._id
  );
});
