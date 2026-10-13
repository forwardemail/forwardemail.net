/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const normalizeRdapUrl = require('#helpers/normalize-rdap-url');

test('normalizes a scheme-less registrar RDAP endpoint', (t) => {
  t.is(
    normalizeRdapUrl('rdap.dynadot.com/v1/').toString(),
    'https://rdap.dynadot.com/v1/'
  );
});

test('preserves HTTP(S) RDAP endpoint URLs', (t) => {
  t.is(
    normalizeRdapUrl('https://rdap.example.com/domain/example.com').toString(),
    'https://rdap.example.com/domain/example.com'
  );
});

test('rejects malformed and non-HTTP RDAP endpoint URLs', (t) => {
  t.throws(() => normalizeRdapUrl(''));
  t.throws(() => normalizeRdapUrl('file:///etc/passwd'));
});

//
// A free-plan domain registered within the past 90 days is let through when
// it is a new name (`allowNewDomain`). Its WHOIS/RDAP lookup is cached
// beforehand, the web archive is a local stand-in, and Cloudflare's
// resolvers are given.
//
test.serial(
  'a new name registered within 90 days is let through',
  async (t) => {
    const http = require('node:http');
    const { randomUUID } = require('node:crypto');
    const Redis = require('ioredis-mock');
    const ms = require('ms');
    const isExpiredOrNewlyCreated = require('#helpers/is-expired-or-newly-created');
    const getPreviousDomainUse = require('#helpers/get-previous-domain-use');

    // (the capture index: a capture's time, "error", or none)
    const answers = new Map();
    const asked = [];
    const server = http.createServer((req, res) => {
      const domain = new URL(req.url, 'http://localhost').searchParams.get(
        'url'
      );
      asked.push(domain);
      if (answers.get(domain) === 'error') {
        res.writeHead(503);
        res.end();
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          answers.has(domain) ? [['timestamp'], [answers.get(domain)]] : []
        )
      );
    });
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    const { CDX_URL } = getPreviousDomainUse;
    getPreviousDomainUse.CDX_URL = `http://127.0.0.1:${server.address().port}/`;

    const client = new Redis();
    const day = ms('1d');
    const answer = (value) => ({
      async resolve() {
        if (value instanceof Error) throw value;
        return value;
      }
    });
    const dnsError = (code) => Object.assign(new Error(code), { code });

    // (the reason a domain is not let through, if any)
    async function errorOf(tld, options = {}) {
      const domain = `${randomUUID().slice(0, 8)}.${tld}`;
      if (options.capture) answers.set(domain, options.capture);
      await client.set(
        `whois:${domain}`,
        JSON.stringify({
          found: true,
          status: options.status || [],
          registrar: {
            id: 1,
            name: options.registrar || 'Example Registrar, Inc.'
          },
          ts: options.ts || {
            created: new Date(Date.now() - 30 * day),
            expires: new Date(Date.now() + 335 * day)
          }
        })
      );
      // (Cloudflare: a family filter, its security filter, and no filter)
      const result = await isExpiredOrNewlyCreated(domain, client, {
        allowNewDomain: options.allow ?? true,
        resolvers: {
          familyResolver: options.slow
            ? { resolve: () => new Promise(() => {}) }
            : answer(options.family || ['192.0.2.1']),
          securityResolver: answer(options.security || ['192.0.2.1']),
          resolver: answer(options.own || ['192.0.2.1'])
        }
      });
      return result.err;
    }

    try {
      // (a new name, also one with no address yet)
      t.is(await errorOf('com'), undefined);
      t.is(await errorOf('co.uk'), undefined);
      t.is(await errorOf('com', { family: dnsError('ENOTFOUND') }), undefined);

      // (not on the paid plan's path, as before)
      let err = await errorOf('com', { allow: false });
      t.regex(err.message, /newly created or transferred/);

      // (not on an extension spam domains use most, without asking)
      asked.length = 0;
      for (const tld of ['xyz', 'cc']) {
        err = await errorOf(tld);
        t.true(err.message.includes(`new domains ending in .${tld} need`));
      }

      t.is(asked.length, 0);

      // (a name in use before)
      err = await errorOf('com', { capture: '20190101000000' });
      t.is(err.responseCode, 421);
      t.regex(err.message, /it was in use before then/);
      err = await errorOf('com', { registrar: 'Gname 471 Inc' });
      t.regex(err.message, /a drop-catch registrar .* holds it/);

      // (a subdomain of one in use before: its root domain's past counts)
      {
        const rootDomain = `${randomUUID().slice(0, 8)}.com`;
        answers.set(rootDomain, '20190101000000');
        await client.set(
          `whois:mail.${rootDomain}`,
          JSON.stringify({
            found: true,
            status: [],
            registrar: { id: 1, name: 'Example Registrar, Inc.' },
            ts: { created: new Date(Date.now() - 30 * day) }
          })
        );
        const result = await isExpiredOrNewlyCreated(
          `mail.${rootDomain}`,
          client,
          { allowNewDomain: true, resolvers: {} }
        );
        t.regex(result.err.message, /it was in use before then/);
      }

      // (one Cloudflare blocks, or one whose own 0.0.0.0 hides that)
      err = await errorOf('com', {
        family: ['0.0.0.0'],
        security: ['0.0.0.0']
      });
      t.regex(err.message, /Cloudflare's filter .* blocks it/);
      err = await errorOf('com', {
        family: ['0.0.0.0'],
        security: ['0.0.0.0'],
        own: ['0.0.0.0']
      });
      t.regex(err.message, /it points to 0\.0\.0\.0/);

      // (when it cannot be told: not let through, and asked again later)
      for (const options of [
        { capture: 'error' },
        { family: dnsError('ESERVFAIL') }
      ]) {
        err = await errorOf('com', options);
        t.true(err.isCheckUnavailable);
        t.is(err.responseCode, 421);
      }

      // (nor waited for longer than 1.5 seconds)
      const startedAt = Date.now();
      err = await errorOf('com', { slow: true });
      t.true(err.isCheckUnavailable);
      t.true(Date.now() - startedAt < 2500);

      // (an expired or a pending domain is not let through either)
      err = await errorOf('com', {
        ts: {
          created: new Date(Date.now() - 30 * day),
          expires: new Date(Date.now() - 10 * day)
        }
      });
      t.regex(err.message, /recently expired/);
      err = await errorOf('com', { status: ['pending delete'] });
      t.regex(err.message, /pending state/);
    } finally {
      getPreviousDomainUse.CDX_URL = CDX_URL;
      server.close();
    }
  }
);
