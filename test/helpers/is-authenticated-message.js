/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { generateKeyPairSync } = require('node:crypto');

const test = require('ava');
const { Splitter } = require('mailsplit');
const { dkimSign } = require('mailauth/lib/dkim/sign');

const config = require('#config');
const isAuthenticatedMessage = require('#helpers/is-authenticated-message');

//
// A message from a domain with DMARC p=reject, sent through a provider like
// Amazon SES: SPF passes for the provider's own (unaligned) envelope domain,
// so only the DKIM signature for the From domain can pass DMARC.
//
const FROM_DOMAIN = 'sender.example.org';
const ENVELOPE_DOMAIN = 'ses.example.net';
const SELECTOR = 'sel';
const IP = '192.0.2.10';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'der' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

function dnsError(code) {
  const err = new Error(`DNS ${code}`);
  err.code = code;
  return err;
}

// the DNS answers, with the DKIM key lookup decided by each test
function createResolver(dkimKey) {
  const txt = {
    [`_dmarc.${FROM_DOMAIN}`]: 'v=DMARC1; p=reject',
    [FROM_DOMAIN]: 'v=spf1 -all',
    [ENVELOPE_DOMAIN]: `v=spf1 ip4:${IP} -all`
  };
  return {
    async resolve(name, type) {
      name = name.toLowerCase();
      if (type === 'TXT' && name === `${SELECTOR}._domainkey.${FROM_DOMAIN}`)
        return dkimKey();
      if (type === 'TXT' && txt[name]) return [[txt[name]]];
      throw dnsError('ENOTFOUND');
    }
  };
}

async function signedMessage() {
  const raw = Buffer.from(
    [
      `From: ors@${FROM_DOMAIN}`,
      'To: alice@example.com',
      'Subject: Hello',
      'Message-ID: <test@sender.example.org>',
      'Date: Mon, 19 Oct 2026 10:00:00 +0000',
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      '',
      'Hello world',
      ''
    ].join('\r\n')
  );
  const { signatures } = await dkimSign(raw, {
    canonicalization: 'relaxed/relaxed',
    signatureData: [
      { signingDomain: FROM_DOMAIN, selector: SELECTOR, privateKey }
    ]
  });
  return Buffer.concat([Buffer.from(signatures), raw]);
}

// split a raw message into the mailsplit headers and body that the MX uses
async function split(raw) {
  const splitter = new Splitter();
  let headers;
  const chunks = [];
  splitter.on('data', (data) => {
    if (data.type === 'node' && data.root) headers = data.headers;
    else if (data.type === 'data' || data.type === 'body')
      chunks.push(data.value);
  });
  await new Promise((resolve, reject) => {
    splitter.once('end', resolve);
    splitter.once('error', reject);
    splitter.end(raw);
  });
  return { headers, body: Buffer.concat(chunks) };
}

function newSession() {
  return {
    remoteAddress: IP,
    hostNameAppearsAs: `smtp.${ENVELOPE_DOMAIN}`,
    resolvedClientHostname: `smtp.${ENVELOPE_DOMAIN}`,
    resolvedRootClientHostname: ENVELOPE_DOMAIN,
    originalFromAddress: `ors@${FROM_DOMAIN}`,
    originalFromAddressDomain: FROM_DOMAIN,
    originalFromAddressRootDomain: 'example.org',
    envelope: {
      mailFrom: { address: `bounce@${ENVELOPE_DOMAIN}` },
      rcptTo: [{ address: 'alice@example.com' }]
    }
  };
}

async function check(dkimKey) {
  const { headers, body } = await split(await signedMessage());
  const session = newSession();
  try {
    await isAuthenticatedMessage(
      headers,
      body,
      session,
      createResolver(dkimKey)
    );
    return { session };
  } catch (err) {
    return { session, err };
  }
}

test('passes DMARC when the aligned DKIM key is found', async (t) => {
  const { session, err } = await check(async () => [
    [`v=DKIM1; k=rsa; p=${publicKey.toString('base64')}`]
  ]);
  t.is(err, undefined);
  t.true(session.hadAlignedAndPassingDKIM);
  t.is(session.dmarc.status.result, 'pass');
});

test('a DNS failure fetching the aligned DKIM key rejects temporarily', async (t) => {
  const { session, err } = await check(async () => {
    throw dnsError('ETIMEOUT');
  });
  t.is(session.dmarc.status.result, 'fail');
  t.true(session.hadAlignedTemporaryDKIMError);
  t.regex(err.message, /failed DMARC validation/);
  t.is(err.responseCode, 421);
});

test('a missing aligned DKIM key rejects permanently', async (t) => {
  const { session, err } = await check(async () => {
    throw dnsError('ENOTFOUND');
  });
  t.false(session.hadAlignedTemporaryDKIMError);
  t.regex(err.message, /failed DMARC validation/);
  t.is(err.responseCode, 550);
});

test('a DKIM key name the sender made invalid rejects permanently', async (t) => {
  // (e.g. a selector with a comma, which the resolver refuses with EBADNAME)
  const { session, err } = await check(async () => {
    throw dnsError('EBADNAME');
  });
  t.is(session.dkim.results[0].status.result, 'temperror');
  t.false(session.hadAlignedTemporaryDKIMError);
  t.regex(err.message, /failed DMARC validation/);
  t.is(err.responseCode, 550);
});

//
// The message is sealed once it is rewritten (see `sealMessage` in
// on-data-mx), with what its authentication found. A seal asked for while it
// was authenticated as well cost two RSA signatures a message, was not used,
// and wrote the body hash of each message to the options every seal shares.
//
test('authenticating a message does not seal it', async (t) => {
  const { session, err } = await check(async () => [
    [`v=DKIM1; k=rsa; p=${publicKey.toString('base64')}`]
  ]);
  t.is(err, undefined);
  t.false('bodyHash' in config.signatureData);
  // (what the seal is made with)
  t.is(session.arc.status.result, 'none');
  t.regex(session.arc.authResults, /dkim=pass/);
});

//
// Mail for a domain whose inbound mail a truth source relays with the
// original envelope sender (`INBOUND_RELAY_DOMAINS`, e.g. a Google Workspace
// routing rule): SPF checked against the relay fails for a sender with -all
// and no DMARC record, though the relay checked the sender itself.
//
test.serial(
  'mail a truth source relays for an inbound relay domain is not rejected for an SPF hard fail, nor scored for it',
  async (t) => {
    const { getAuthenticationResults } = require('#helpers/spam-scanner');
    const raw = Buffer.from(
      [
        'From: dev@lists.example.org',
        'To: shawn@relayed.example',
        'Subject: [PATCH] fix',
        'Message-ID: <relay@lists.example.org>',
        'Date: Mon, 19 Oct 2026 10:00:00 +0000',
        '',
        'A patch.',
        ''
      ].join('\r\n')
    );
    const resolver = {
      async resolve(name, type) {
        if (type === 'TXT' && name.toLowerCase() === 'lists.example.org')
          return [['v=spf1 ip4:198.51.100.1 -all']];
        throw dnsError('ENOTFOUND');
      }
    };
    const relayed = (rcptTo, root = 'relay.example') => ({
      remoteAddress: '192.0.2.20',
      hostNameAppearsAs: `mail.${root}`,
      resolvedClientHostname: `mail.${root}`,
      resolvedRootClientHostname: root,
      originalFromAddress: 'dev@lists.example.org',
      originalFromAddressDomain: 'lists.example.org',
      originalFromAddressRootDomain: 'example.org',
      envelope: {
        mailFrom: { address: 'dev-bounces@lists.example.org' },
        rcptTo: rcptTo.map((address) => ({ address }))
      }
    });
    const check = async (session) => {
      const { headers, body } = await split(raw);
      try {
        await isAuthenticatedMessage(headers, body, session, resolver);
      } catch (err) {
        return err;
      }
    };

    const hardFail = /failed SPF validation .* SPF hard fail policy/;
    // (rejected without the settings)
    const rejected = await check(relayed(['shawn@relayed.example']));
    t.regex(rejected.message, hardFail);

    config.truthSources.add('relay.example');
    config.inboundRelayDomains.add('relayed.example');
    try {
      for (const rcptTo of [
        ['shawn@relayed.example'],
        ['a@relayed.example', 'b@sub.relayed.example']
      ]) {
        const session = relayed(rcptTo);

        t.is(await check(session), undefined);
        t.true(session.isInboundRelay);
        t.is(session.spf.status.result, 'fail');
        // (Spam Scanner is not given the SPF result checked against the relay)
        t.is(getAuthenticationResults(session).spf.status.result, 'none');
      }

      // (still rejected from a server that is not a truth source, or with a
      //  recipient of another domain)
      for (const session of [
        relayed(['shawn@relayed.example'], 'other.example'),
        relayed(['shawn@relayed.example', 'bob@example.com'])
      ]) {
        const err = await check(session);
        t.regex(err.message, hardFail);
        t.false(session.isInboundRelay);
      }
    } finally {
      config.truthSources.delete('relay.example');
      config.inboundRelayDomains.delete('relayed.example');
    }
  }
);
