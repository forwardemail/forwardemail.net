/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const test = require('ava');

const {
  storeDisposableDomains,
  getListedDisposableDomain
} = require('#helpers/disposable-domains');

test('a domain on the stored list is found, not one under it', async (t) => {
  const client = new Redis({ keyPrefix: `${randomUUID()}:` });
  await storeDisposableDomains(client, [
    'temp-inbox.example',
    'Throwaway-Inbox.example'
  ]);

  t.is(
    await getListedDisposableDomain(client, 'temp-inbox.example'),
    'temp-inbox.example'
  );
  t.is(
    await getListedDisposableDomain(client, 'throwaway-inbox.example'),
    'throwaway-inbox.example'
  );
  // (the list has shared dynamic DNS domains, whose other subdomains are
  //  not disposable email services)
  t.is(
    await getListedDisposableDomain(client, 'mx.throwaway-inbox.example'),
    null
  );
  t.is(await getListedDisposableDomain(client, 'example.com'), null);

  // a new list replaces the old one
  await storeDisposableDomains(client, ['other.example']);
  t.is(await getListedDisposableDomain(client, 'temp-inbox.example'), null);
  t.is(
    await getListedDisposableDomain(client, 'other.example'),
    'other.example'
  );

  // (an empty download keeps the list there is)
  await storeDisposableDomains(client, []);
  t.is(
    await getListedDisposableDomain(client, 'other.example'),
    'other.example'
  );
});

test('without a Redis client nothing is listed', async (t) => {
  t.is(await getListedDisposableDomain(null, 'temp-inbox.example'), null);
});

// (temporary keys left behind)
async function tmpKeys(client) {
  const keys = await client.keys('*');
  return keys.filter((key) => key.includes('tmp'));
}

test('a long list is stored whole, with nothing left behind', async (t) => {
  const client = new Redis({ keyPrefix: `${randomUUID()}:` });
  const domains = Array.from(
    { length: 2500 },
    (_, i) => `temp-inbox-${i}.example`
  );
  await storeDisposableDomains(client, domains);

  t.is(await client.scard('disposable_domains'), 2500);
  t.is(
    await getListedDisposableDomain(client, 'temp-inbox-2499.example'),
    'temp-inbox-2499.example'
  );
  // (the stored list does not expire, and no temporary key is left)
  t.is(await client.pttl('disposable_domains'), -1);
  t.deepEqual(await tmpKeys(client), []);
});

test('a run that fails keeps the stored list and removes its own', async (t) => {
  const client = new Redis({ keyPrefix: `${randomUUID()}:` });
  await storeDisposableDomains(client, ['other.example']);

  const sadd = client.sadd.bind(client);
  let calls = 0;
  client.sadd = async (...args) => {
    if (++calls === 2) throw new Error('connection lost');
    return sadd(...args);
  };

  await t.throwsAsync(
    storeDisposableDomains(
      client,
      Array.from({ length: 1500 }, (_, i) => `temp-inbox-${i}.example`)
    ),
    { message: 'connection lost' }
  );
  t.is(
    await getListedDisposableDomain(client, 'other.example'),
    'other.example'
  );
  t.is(await getListedDisposableDomain(client, 'temp-inbox-0.example'), null);
  t.deepEqual(await tmpKeys(client), []);
});

test('a name is looked up in lower case', async (t) => {
  const client = new Redis({ keyPrefix: `${randomUUID()}:` });
  await storeDisposableDomains(client, ['temp-inbox.example']);
  t.is(
    await getListedDisposableDomain(client, 'Temp-Inbox.Example'),
    'temp-inbox.example'
  );
});

test('a list Redis refuses to swap in is an error', async (t) => {
  const client = new Redis({ keyPrefix: `${randomUUID()}:` });
  client.multi = () => {
    const chain = {
      rename: () => chain,
      persist: () => chain,
      exec: async () => [[new Error('READONLY')], [null, 1]]
    };
    return chain;
  };

  await t.throwsAsync(storeDisposableDomains(client, ['temp-inbox.example']), {
    message: 'READONLY'
  });
});
