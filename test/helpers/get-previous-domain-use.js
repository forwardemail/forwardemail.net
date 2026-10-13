/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Whether a domain registered within the past 90 days was in use before,
// asked of a local stand-in for the web archive's capture index.
//

const http = require('node:http');
const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const test = require('ava');

const getPreviousDomainUse = require('#helpers/get-previous-domain-use');

const { isDropCatchRegistrar } = getPreviousDomainUse;

const CREATED = new Date('2026-09-15T10:20:30Z');

// (the capture index: domain → a capture's time, [] for none, or a status)
const answers = new Map();
const requests = [];
let server;

test.before(async () => {
  server = http.createServer((req, res) => {
    const { searchParams } = new URL(req.url, 'http://localhost');
    requests.push(Object.fromEntries(searchParams));
    const answer = answers.get(searchParams.get('url'));
    if (typeof answer === 'number') {
      res.writeHead(answer);
      res.end('error');
      return;
    }

    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(
      typeof answer === 'string' && !/^\d{14}$/.test(answer)
        ? answer
        : JSON.stringify(answer ? [['timestamp'], [answer]] : [])
    );
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  getPreviousDomainUse.CDX_URL = `http://127.0.0.1:${
    server.address().port
  }/cdx/search/cdx`;
});

test.after.always(() => {
  server.close();
});

function lookup(registrar = 'Example Registrar, Inc.') {
  return {
    found: true,
    registrar: { id: 1, name: registrar },
    ts: { created: CREATED }
  };
}

function newDomain() {
  return `d-${randomUUID().slice(0, 8)}.com`;
}

test('drop-catch companies are told from their parent registrars', (t) => {
  for (const name of [
    'DropCatch.com 768 LLC',
    'SNAPNAMES 89, LLC',
    'Gname 298 Inc',
    'NamePal.com #8028, LLC',
    'NamePal.com #8011',
    'Sav.com, LLC - 25',
    'Dynadot17 LLC',
    'UnstoppableUS2 LLC',
    '  dropcatch.com   1313 llc '
  ])
    t.true(isDropCatchRegistrar(name), `${name}`);

  for (const name of [
    'DropCatch.com LLC',
    'Gname.com Pte. Ltd.',
    'Dynadot Inc',
    'Sav.com, LLC',
    'NameCheap, Inc.',
    'GoDaddy.com, LLC',
    '123-Reg Limited',
    '',
    undefined
  ])
    t.false(isDropCatchRegistrar(name), `${name}`);
});

test.serial(
  'a name a drop-catch company holds was in use before, without asking the archive',
  async (t) => {
    const domain = newDomain();
    requests.length = 0;
    t.deepEqual(
      await getPreviousDomainUse(
        domain,
        lookup('DropCatch.com 1058 LLC'),
        new Redis()
      ),
      { reason: 'drop_catch_registrar', registrar: 'DropCatch.com 1058 LLC' }
    );
    t.is(requests.length, 0);
  }
);

test.serial(
  'a capture from before it was registered says it was in use',
  async (t) => {
    const domain = newDomain();
    answers.set(domain, '20210228152825');
    requests.length = 0;
    t.deepEqual(await getPreviousDomainUse(domain, lookup(), new Redis()), {
      reason: 'web_archive',
      capturedAt: '20210228152825'
    });

    // (its subdomains count, and only what was captured up to a second
    //  before it was registered)
    t.like(requests[0], {
      url: domain,
      matchType: 'domain',
      to: '20260915102029',
      limit: '1'
    });
  }
);

test.serial('a new name has no capture, and the answer is kept', async (t) => {
  const client = new Redis();
  const domain = newDomain();
  requests.length = 0;
  t.is(await getPreviousDomainUse(domain, lookup(), client), null);
  t.is(await getPreviousDomainUse(domain, lookup(), client), null);
  t.is(requests.length, 1);

  // (two lookups at once ask once)
  const other = newDomain();
  const results = await Promise.all([
    getPreviousDomainUse(other, lookup(), new Redis()),
    getPreviousDomainUse(other, lookup(), new Redis())
  ]);
  t.deepEqual(results, [null, null]);
  t.is(requests.length, 2);
});

test.serial(
  'an archive that cannot answer is not taken for "no capture"',
  async (t) => {
    const client = new Redis();
    for (const [answer, message] of [
      [503, /answered 503/],
      ['<html>Service Unavailable</html>', /JSON/],
      ['{"error":"busy"}', /not a list/],
      ['[["timestamp"]]', /no capture/]
    ]) {
      const domain = newDomain();
      answers.set(domain, answer);
      requests.length = 0;

      await t.throwsAsync(getPreviousDomainUse(domain, lookup(), client), {
        message
      });

      // (and it is not asked again for a few minutes)

      await t.throwsAsync(getPreviousDomainUse(domain, lookup(), client), {
        message
      });
      t.is(requests.length, 1);
    }
  }
);

test('a lookup without a registration date cannot be told', async (t) => {
  await t.throwsAsync(
    getPreviousDomainUse(
      newDomain(),
      { found: true, registrar: { name: 'Example' }, ts: {} },
      new Redis()
    ),
    { message: /No registration date/ }
  );
});

test.serial(
  'a slow archive is not waited for, and its answer is kept for next time',
  async (t) => {
    const client = new Redis();
    const domain = newDomain();
    // (the archive answers after half a second)
    let release;
    const slow = new Promise((resolve) => {
      release = resolve;
    });
    const { CDX_URL } = getPreviousDomainUse;
    const server = http.createServer(async (req, res) => {
      await slow;
      res.writeHead(200);
      res.end(JSON.stringify([['timestamp'], ['20200101000000']]));
    });
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    getPreviousDomainUse.CDX_URL = `http://127.0.0.1:${server.address().port}/`;
    try {
      const startedAt = Date.now();
      await t.throwsAsync(
        getPreviousDomainUse(domain, lookup(), client, { wait: 100 }),
        { code: 'ESTILLLOOKING' }
      );
      t.true(Date.now() - startedAt < 500);

      release();
      // (the lookup went on: once it is kept, it is the answer)
      let answer;
      for (let i = 0; i < 50 && !answer; i++) {
        await new Promise((resolve) => {
          setTimeout(resolve, 20);
        });
        try {
          answer = await getPreviousDomainUse(domain, lookup(), client, {
            wait: 200
          });
        } catch {}
      }

      t.deepEqual(answer, {
        reason: 'web_archive',
        capturedAt: '20200101000000'
      });
    } finally {
      getPreviousDomainUse.CDX_URL = CDX_URL;
      server.close();
    }
  }
);
