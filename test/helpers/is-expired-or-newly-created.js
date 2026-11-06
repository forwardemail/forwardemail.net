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

    // (the capture index: a capture's time, "error", "late:" and a capture's
    //  time given after 2 seconds, or none)
    const answers = new Map();
    const asked = [];
    const server = http.createServer((req, res) => {
      const domain = new URL(req.url, 'http://localhost').searchParams.get(
        'url'
      );
      asked.push(domain);
      const answer = answers.get(domain);
      if (answer === 'error') {
        res.writeHead(503);
        res.end();
        return;
      }

      setTimeout(
        () => {
          res.writeHead(200);
          res.end(
            JSON.stringify(
              answer ? [['timestamp'], [answer.replace(/^late:/, '')]] : []
            )
          );
        },
        answer?.startsWith('late:') ? 2000 : 0
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
      const domain = options.domain || `${randomUUID().slice(0, 8)}.${tld}`;
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
      // (every reason links the FAQ section explaining it)
      if (result.err)
        t.regex(result.err.message, / Learn why: https?:\/\/\S+\/faq#[\w-]+$/);
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

      // (not on an extension spam domains use most, without asking: its
      //  message says why)
      asked.length = 0;
      for (const tld of ['xyz', 'cc']) {
        err = await errorOf(tld);
        t.true(err.message.includes(`new domains ending in .${tld} need`));
        t.regex(err.message, /spam operations register new domains on/);
      }

      // (nor on one no domain can use for free: its message says so, and
      //  links the list of free extensions)
      err = await errorOf('online');
      t.is(err.responseCode, 421);
      t.regex(err.message, /ends in \.online, .* however old it is/);
      t.notRegex(err.message, /newly created/);
      t.regex(
        err.message,
        /#what-domain-name-extensions-can-be-used-for-free$/
      );
      // (an internationalized one is named as it is written)
      err = await errorOf('xn--80asehdb');
      t.regex(err.message, /ends in \.онлайн, /);
      // (a new .gov or .edu domain needs a paid plan, as before)
      err = await errorOf('gov');
      t.regex(err.message, /newly created or transferred/);

      // (nor one its RDAP record shows someone had before, without asking)
      err = await errorOf('com', {
        ts: {
          created: new Date(Date.now() - 30 * day),
          transferred: new Date(Date.now() - 5 * day)
        }
      });
      t.is(err.responseCode, 421);
      t.regex(err.message, /it was transferred from another registrar/);
      err = await errorOf('com', {
        ts: {
          created: new Date(Date.now() - 30 * day),
          reregistered: new Date(Date.now() - 30 * day)
        }
      });
      t.regex(err.message, /shows it was registered before then/);

      t.is(asked.length, 0);

      // (a name in use before)
      err = await errorOf('com', { capture: '20190101000000' });
      t.is(err.responseCode, 421);
      t.regex(err.message, /it was in use before then/);
      // (and why that matters)
      t.regex(err.message, /receives the mail sent to its earlier owner's/);
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

      // (when the archive cannot answer: let through, not refused for as long
      //  as it is down)
      t.is(await errorOf('com', { capture: 'error' }), undefined);

      // (an archive answering later than mail waits: let through, and the
      //  lookup goes on, so a name in use before is refused from then on)
      {
        const late = {
          domain: `${randomUUID().slice(0, 8)}.com`,
          capture: 'late:20190101000000',
          ts: {
            created: new Date(Date.now() - 30 * day),
            expires: new Date(Date.now() + 335 * day)
          }
        };
        t.is(await errorOf('com', late), undefined);
        err = await errorOf('com', late);
        t.regex(err.message, /it was in use before then/);
      }

      // (when Cloudflare cannot answer: not let through, and asked again later)
      err = await errorOf('com', { family: dnsError('ESERVFAIL') });
      t.true(err.isCheckUnavailable);
      t.is(err.responseCode, 421);

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

//
// `@forwardemail/whois-rdap` keeps no RDAP events but a domain's
// registration, update and expiry, so the ones showing someone had it before
// (a transfer, or a registration again) are read from the answers as the
// lookup fetches them, and kept with the rest of its WHOIS/RDAP answer. The
// RDAP servers are a local stand-in, as is the lookup (tests have no network).
//
test.serial('an RDAP transfer or registration again is kept', async (t) => {
  const http = require('node:http');
  const { randomUUID } = require('node:crypto');
  const Redis = require('ioredis-mock');
  const ms = require('ms');
  const sinon = require('sinon');
  const rdapFetch = require('#helpers/rdap-fetch');
  const isExpiredOrNewlyCreated = require('#helpers/is-expired-or-newly-created');

  // (to the second, as RDAP dates are)
  const created = new Date(Math.floor((Date.now() - ms('30d')) / 1000) * 1000);
  const later = (days) => new Date(created.getTime() + ms(`${days}d`));
  // (as some registries write dates)
  const event = (eventAction, date) => ({
    eventAction,
    eventDate: date.toISOString().replace(/\.\d+Z$/, '+0000Z')
  });

  // (the registry's and the registrar's answers, by path)
  const answers = new Map();
  const server = http.createServer((req, res) => {
    const { type, body } = answers.get(req.url) || {};
    res.writeHead(200, { 'content-type': type || 'application/rdap+json' });
    res.end(typeof body === 'string' ? body : JSON.stringify(body || {}));
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  sinon.stub(rdapFetch, 'isPrivateTarget').resolves(false);
  sinon.stub(rdapFetch, 'dispatcher').value(undefined);

  // (fetches both answers and reads them whole, as the package does)
  const { whois } = isExpiredOrNewlyCreated;
  async function lookUp(domain, options) {
    for (const path of [`/registry/${domain}`, `/registrar/${domain}`]) {
      const res = await options.fetch(`${base}${path}`);
      await res.text();
    }

    return {
      found: true,
      status: [],
      registrar: { id: 1, name: 'Example Registrar, Inc.' },
      ts: { created, updated: null, expires: later(365) }
    };
  }

  isExpiredOrNewlyCreated.whois = lookUp;

  const client = new Redis();
  async function check(domain, allowNewDomain = true) {
    const { err } = await isExpiredOrNewlyCreated(domain, client, {
      allowNewDomain
    });
    const { ts } = JSON.parse(await client.get(`whois:${domain}`));
    return { err, ts };
  }

  const name = () => `${randomUUID().slice(0, 8)}.com`;

  try {
    // (a transfer, also in events kept as an object: the latest is kept)
    const moved = name();
    answers.set(`/registry/${moved}`, {
      body: {
        events: [event('registration', created), event('Transfer', later(5))]
      }
    });
    answers.set(`/registrar/${moved}`, {
      body: {
        events: {
          0: event('transfer', later(20)),
          1: { eventAction: 'transfer', eventDate: 'not a date' }
        }
      }
    });
    let { err, ts } = await check(moved);
    t.regex(err.message, /it was transferred from another registrar/);
    t.is(ts.transferred, later(20).toISOString());
    t.is(ts.reregistered, undefined);

    // (and from what was kept, without looking it up again)
    isExpiredOrNewlyCreated.whois = () => {
      throw new Error('looked up again');
    };

    ({ err } = await check(moved));
    t.regex(err.message, /it was transferred from another registrar/);
    isExpiredOrNewlyCreated.whois = lookUp;

    // (a registration again)
    const again = name();
    answers.set(`/registry/${again}`, {
      body: { events: [event('reregistration', created)] }
    });
    ({ err, ts } = await check(again));
    t.regex(err.message, /shows it was registered before then/);
    t.is(ts.reregistered, created.toISOString());

    // (not a new name's events, a web page, or an answer that is not JSON;
    //  on the paid plan's path, so nothing else is asked)
    const fresh = name();
    answers.set(`/registry/${fresh}`, {
      body: { events: [event('registration', created)] }
    });
    answers.set(`/registrar/${fresh}`, {
      type: 'text/html',
      body: JSON.stringify({ events: [event('transfer', later(1))] })
    });
    ({ ts } = await check(fresh, false));
    t.is(ts.transferred, undefined);
    const odd = name();
    answers.set(`/registry/${odd}`, { body: 'not json' });
    ({ ts } = await check(odd, false));
    t.is(ts.transferred, undefined);
  } finally {
    isExpiredOrNewlyCreated.whois = whois;
    sinon.restore();
    server.closeAllConnections();
    server.close();
  }
});
