/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

//
// Replace the network-bound categorisation and the mailer with stubs so the
// real helper runs end to end and we can inspect the alert it builds.
//
let categorization;
const sent = [];

function stubModule(id, exports) {
  const filename = require.resolve(id);
  require.cache[filename] = {
    id: filename,
    filename,
    loaded: true,
    exports
  };
}

stubModule('#helpers/get-domain-categorization', async () => categorization);
stubModule('#helpers/email', async (options) => {
  sent.push(options);
});

const checkDomainAndAct = require('#helpers/check-domain-and-act');

test('the review alert escapes the attacker-controlled page title and user data', async (t) => {
  categorization = {
    categories: ['phishing'],
    title: '<a href="https://attacker.example/login">Click to review</a>',
    statusCode: 200,
    contentLength: 123,
    isParked: false,
    hasLegitimateHosting: false
  };

  const user = {
    _id: '0123456789abcdef01234567',
    email: '"<img src=x>"@example.com',
    group: 'user',
    has_passed_kyc: false,
    created_at: new Date()
  };

  const Users = {
    find: () => ({
      select: () => ({ lean: () => ({ exec: async () => [user] }) })
    })
  };
  const Aliases = { countDocuments: async () => 1 };
  const ctx = {
    bannedResults: [],
    reviewResults: [],
    skippedResults: [],
    dryRun: false
  };

  await checkDomainAndAct(
    {
      _id: 'domain-id',
      name: 'attacker.example',
      members: [{ user: user._id }]
    },
    ctx,
    { Users, Aliases, logger: { info() {}, fatal() {}, warn() {}, debug() {} } }
  );

  t.is(sent.length, 1);
  const { message } = sent[0].locals;
  t.false(message.includes('<a href="https://attacker.example/login">'));
  t.true(
    message.includes(
      '&lt;a href=&quot;https://attacker.example/login&quot;&gt;Click to review&lt;/a&gt;'
    )
  );
  t.false(message.includes('<img src=x>'));
  t.true(message.includes('&quot;&lt;img src=x&gt;&quot;@example.com'));
  // the result recorded for the digest keeps the raw values
  t.is(ctx.bannedResults[0].title, categorization.title);
});
