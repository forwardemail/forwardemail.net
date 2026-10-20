/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { generateKeyPairSync } = require('node:crypto');

const test = require('ava');
const { Splitter } = require('mailsplit');
const { dkimSign } = require('mailauth/lib/dkim/sign');

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
