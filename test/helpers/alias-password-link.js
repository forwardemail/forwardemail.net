/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const mongoose = require('mongoose');
const test = require('ava');

const config = require('#config');
const {
  ALIAS_PASSWORD_LINK_TTL,
  claimAliasPasswordLink,
  createAliasPasswordLink,
  getAliasPasswordLinkKey,
  peekAliasPasswordLink
} = require('#helpers/alias-password-link');

test.beforeEach((t) => {
  t.context.client = new Redis({ keyPrefix: randomUUID() });
});

test.afterEach.always((t) => {
  t.context.client.disconnect();
});

function getToken(link) {
  const prefix = `${config.urls.web}/ap/`;
  if (!link.startsWith(prefix)) throw new Error('Unexpected link');
  return link.slice(prefix.length);
}

function options(extra = {}) {
  return {
    domainId: new mongoose.Types.ObjectId().toString(),
    aliasId: new mongoose.Types.ObjectId().toString(),
    password: 'correct horse battery staple',
    ...extra
  };
}

test('the link never carries the password, not even encrypted', async (t) => {
  const { client } = t.context;
  const opts = options({ userId: 'user' });
  const link = await createAliasPasswordLink(client, opts);
  const token = getToken(link);

  t.regex(token, /^[\da-f]{64}$/);
  t.false(link.includes(opts.aliasId));
  t.false(link.includes(opts.domainId));

  // the entry is not keyed by the token itself (only by its hash)
  const key = getAliasPasswordLinkKey(token);
  t.false(key.includes(token));
  t.is(await client.get(token), null);
  // and it only holds the encrypted password
  const value = await client.get(key);
  t.truthy(value);
  t.false(value.includes(opts.password));
});

test('a link expires', async (t) => {
  const { client } = t.context;
  const token = getToken(
    await createAliasPasswordLink(client, options({ userId: 'user' }))
  );
  const ttl = await client.pttl(getAliasPasswordLinkKey(token));
  t.true(ttl > 0 && ttl <= ALIAS_PASSWORD_LINK_TTL);
});

test('a link is bound to its user or to the emailed instructions', async (t) => {
  const { client } = t.context;
  await t.throwsAsync(createAliasPasswordLink(client, options()));

  const owner = await peekAliasPasswordLink(
    client,
    getToken(await createAliasPasswordLink(client, options({ userId: 'u' })))
  );
  t.is(owner.user_id, 'u');
  t.is(owner.emailed_instructions, undefined);

  const instructions = await peekAliasPasswordLink(
    client,
    getToken(
      await createAliasPasswordLink(
        client,
        options({ emailedInstructions: 'someone@example.com' })
      )
    )
  );
  t.is(instructions.user_id, undefined);
  t.is(instructions.emailed_instructions, 'someone@example.com');
});

test('peeking does not use a link up, claiming does (once)', async (t) => {
  const { client } = t.context;
  const opts = options({ userId: 'user' });
  const token = getToken(await createAliasPasswordLink(client, opts));

  t.truthy(await peekAliasPasswordLink(client, token));
  t.truthy(await peekAliasPasswordLink(client, token));

  t.is(await claimAliasPasswordLink(client, token), opts.password);
  t.is(await claimAliasPasswordLink(client, token), null);
  t.is(await peekAliasPasswordLink(client, token), null);
  t.is(await client.get(getAliasPasswordLinkKey(token)), null);
});

test('malformed tokens are rejected without a lookup', async (t) => {
  const { client } = t.context;
  for (const token of [undefined, '', 'abc', 'g'.repeat(64), '../x']) {
    t.is(await peekAliasPasswordLink(client, token), null);
    t.is(await claimAliasPasswordLink(client, token), null);
  }
});
