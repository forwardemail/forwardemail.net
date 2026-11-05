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
    const _ = require('#helpers/lodash');
    const config = require('#config');
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

    // (whether a domain is let through: `err` and `notice`)
    async function check(tld, options = {}) {
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
      //
      // (every reason links the FAQ section explaining it: as plain text for
      //  SMTP replies, logs and the API, and as links to click for a web
      //  page or an email)
      //
      for (const { message, html } of [result.err, result.notice].filter(
        Boolean
      )) {
        t.regex(message, / Learn why: https?:\/\/\S+\/faq#[\w-]+$/);
        t.notRegex(message, /[<>]|&\w+;/);
        const links = [
          ...html.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)
        ];
        t.true(links.length >= 2);
        for (const [, href, text] of links) {
          t.is(href, text);
          t.notRegex(href, /[.,]$/);
        }

        t.is(html.replace(/<a [^>]+>([^<]+)<\/a>/g, '$1'), _.escape(message));
      }

      return result;
    }

    // (the reason a domain is not let through, if any)
    async function errorOf(tld, options) {
      const { err } = await check(tld, options);
      return err;
    }

    //
    // (as on December 1, 2026: new domains on .id, .jp and .ws need a paid
    //  plan, see `config.newDomainNoticeEndsAt`)
    //
    const { newDomainNoticeEndsAt } = config;
    config.newDomainNoticeEndsAt = new Date(Date.now() - day);

    try {
      // (a new name, also one with no address yet)
      t.is(await errorOf('com'), undefined);
      t.is(await errorOf('co.uk'), undefined);
      t.is(await errorOf('com', { family: dnsError('ENOTFOUND') }), undefined);

      // (not on the paid plan's path, as before)
      let err = await errorOf('com', { allow: false });
      t.regex(err.message, /newly created or transferred/);

      // (not on an extension spam and phishing reports show the most abuse
      //  on, without asking: its message says why)
      asked.length = 0;
      for (const tld of ['cc', 'id', 'jp', 'online', 'ws', 'xyz']) {
        err = await errorOf(tld);
        t.true(err.message.includes(`new domains ending in .${tld} need`));
        t.true(
          err.message.includes(
            `spam and phishing reports show more abuse on .${tld} than on .com`
          )
        );
      }

      // (on those, a domain 90 days old or more can use the free plan)
      for (const tld of ['id', 'jp', 'online', 'ws']) {
        t.is(
          await errorOf(tld, {
            ts: {
              created: new Date(Date.now() - 400 * day),
              expires: new Date(Date.now() + 330 * day)
            }
          }),
          undefined
        );
      }

      // (nor on one no domain can use for free: its message says so, and
      //  links the list of free extensions)
      err = await errorOf('top');
      t.is(err.responseCode, 421);
      t.regex(err.message, /ends in \.top, .* however old it is/);
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

      //
      // (before then, a new domain on .id, .jp or .ws is let through on the
      //  rest of these rules, and `notice` says why it will not be)
      //
      config.newDomainNoticeEndsAt = new Date(Date.now() + 30 * day);
      for (const tld of ['id', 'jp', 'ws']) {
        const { err, notice } = await check(tld);
        t.is(err, undefined);
        t.true(notice.isNotice);
        t.regex(
          notice.message,
          new RegExp(
            `^Starting \\w+ \\d+, \\d{4} \\(UTC\\), mail to \\S+\\.${tld} will be refused until \\w+ \\d+, \\d{4}, when the domain is 90 days old`
          )
        );
        t.true(
          notice.message.includes(`new domains ending in .${tld} need a paid`)
        );
      }

      // (not one the rest of these rules do not let through, or on .xyz)
      err = await errorOf('id', { capture: '20190101000000' });
      t.regex(err.message, /it was in use before then/);
      err = await errorOf('jp', {
        ts: {
          created: new Date(Date.now() - 30 * day),
          expires: new Date(Date.now() + 335 * day),
          transferred: new Date(Date.now() - 5 * day)
        }
      });
      t.regex(err.message, /it was transferred from another registrar/);
      err = await errorOf('xyz');
      t.regex(err.message, /new domains ending in \.xyz need a paid plan/);

      // (nor told when it is 90 days old by then)
      const result = await check('ws', {
        ts: {
          created: new Date(Date.now() - 85 * day),
          expires: new Date(Date.now() + 280 * day)
        }
      });
      t.is(result.err, undefined);
      t.is(result.notice, undefined);
    } finally {
      config.newDomainNoticeEndsAt = newDomainNoticeEndsAt;
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
