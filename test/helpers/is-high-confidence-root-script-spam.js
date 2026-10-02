/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const test = require('ava');
const { Headers } = require('mailsplit');

const isHighConfidenceRootScriptSpam = require('#helpers/is-high-confidence-root-script-spam');

const { getRootSubmissionHost } = isHighConfidenceRootScriptSpam;

function parse(lines) {
  return new Headers(Buffer.from(lines.join('\r\n') + '\r\n\r\n'));
}

// a message root submitted on vm1.example.net, sent as an unrelated domain
const HEADERS = [
  'Received: by vm1.example.net (Postfix, from userid 0)',
  '\tid 4B1C2D3E4F; Thu,  1 Oct 2026 12:00:00 +0000 (UTC)',
  'To: user@example.com',
  'Subject: Account notice',
  'From: Billing <billing@vm-7c41.example.org>',
  'MIME-Version: 1.0',
  'Message-Id: <20261001120000.4B1C2D3E4F@vm1.example.net>'
];

const unauthenticated = (domain) => ({
  domain,
  status: { result: 'none' }
});

//
// An IPv6 server with no reverse DNS that greets as itself, sends as root@
// itself, with no SPF record for either domain, no DKIM signature, DMARC
// p=none for the From domain, and the From domain on the From allowlist.
//
function createSession(overrides = {}) {
  return {
    remoteAddress: '2001:db8:1c00:2::25',
    hostNameAppearsAs: 'vm1.example.net',
    openingCommand: 'EHLO',
    isAllowlisted: false,
    isOriginalFromAddressAllowlisted:
      'root domain (example.org) → config.allowlist (example.org)',
    envelope: {
      mailFrom: { address: 'root@vm1.example.net' },
      rcptTo: [{ address: 'user@example.com' }]
    },
    originalFromAddress: 'billing@vm-7c41.example.org',
    originalFromAddressDomain: 'vm-7c41.example.org',
    originalFromAddressRootDomain: 'example.org',
    hasSameHostnameAsFrom: false,
    dkim: { results: [{ status: { result: 'none' } }] },
    spf: unauthenticated('vm1.example.net'),
    spfFromHeader: unauthenticated('vm-7c41.example.org'),
    dmarc: { status: { result: 'fail' }, policy: 'none' },
    hadAlignedAndPassingDKIM: false,
    isTrustedArc: false,
    ...overrides
  };
}

const matches = (overrides, lines = HEADERS) =>
  isHighConfidenceRootScriptSpam(parse(lines), createSession(overrides));

test('matches root mail from a server without its own reverse hostname', (t) => {
  // IPv6, no reverse DNS
  t.true(matches());

  // IPv4 with the provider's generic reverse hostname (forward-confirmed)
  t.true(
    matches({
      remoteAddress: '203.0.113.153',
      resolvedClientHostname: '203-0-113-153.static.cloud.example.com',
      resolvedRootClientHostname: 'example.com',
      unconfirmedClientHostname: '203-0-113-153.static.cloud.example.com',
      unconfirmedRootClientHostname: 'example.com'
    })
  );

  // a hostname that glues the first octet to a prefix is deliberately not
  // treated as generic by is-generic-reverse-hostname (some real mail
  // providers name their servers that way), so it counts as the server's own
  t.false(
    matches({
      remoteAddress: '203.0.113.153',
      resolvedClientHostname: 'v203-0-113-153.static.cloud.example.com',
      resolvedRootClientHostname: 'example.com'
    })
  );
});

test('reads the root submission written by Postfix, Exim and Sendmail', (t) => {
  for (const [received, host] of [
    [
      'Received: by vm1.example.net (Postfix, from userid 0)\r\n\tid 4B1C2D3E4F',
      'vm1.example.net'
    ],
    [
      'Received: from root by mail.host.test with local (Exim 4.96)\r\n\t(envelope-from <root@mail.host.test>)',
      'mail.host.test'
    ],
    [
      'Received: from root by mail.host.test with local-esmtp (Exim 4.96)',
      'mail.host.test'
    ],
    [
      'Received: (from root@localhost)\r\n\tby box.host.test (8.15.2/8.15.2/Submit) id 1A2B3C',
      'box.host.test'
    ]
  ]) {
    t.is(getRootSubmissionHost(parse([received, 'To: a@b.test'])), host);
  }

  // another user, or an SMTP hop
  for (const received of [
    'Received: by vm1.example.net (Postfix, from userid 33)',
    'Received: by vm1.example.net (Postfix, from userid 1000)',
    'Received: from www-data by mail.host.test with local (Exim 4.96)',
    'Received: from client.test (client.test [192.0.2.1]) by mx.host.test (Postfix) with ESMTPS id 1'
  ]) {
    t.is(getRootSubmissionHost(parse([received, 'To: a@b.test'])), null);
  }
});

test('does not match mail the server sends as itself', (t) => {
  // cron mail: From root@ the server
  t.false(
    matches({
      originalFromAddress: 'root@vm1.example.net',
      originalFromAddressDomain: 'vm1.example.net',
      originalFromAddressRootDomain: 'example.net'
    })
  );

  // an envelope sender other than root@ the server (set with sendmail -f)
  for (const address of [
    'alerts@vm1.example.net',
    'root@other-host.test',
    'bounce@vm-7c41.example.org'
  ]) {
    t.false(
      matches({
        envelope: {
          mailFrom: { address },
          rcptTo: [{ address: 'user@example.com' }]
        }
      }),
      `MAIL FROM ${address}`
    );
  }

  // From the domain of the server's reverse hostname
  t.false(
    matches({
      unconfirmedClientHostname: 'mail.example.org',
      unconfirmedRootClientHostname: 'example.org'
    })
  );
});

test('does not match mail from another user, or that passed through a relay', (t) => {
  const rest = HEADERS.slice(2);

  // a web application (www-data) putting a visitor's address in From
  t.false(
    matches({}, [
      'Received: by vm1.example.net (Postfix, from userid 33)',
      '\tid 4B1C2D3E4F',
      ...rest
    ])
  );

  // relayed through another server after the root submission
  t.false(
    matches({}, [
      'Received: from vm1.example.net (vm1.example.net [192.0.2.7]) by smtp.relay.test (Postfix) with ESMTPS id 1',
      ...HEADERS
    ])
  );

  // the root submission happened on a machine other than the one that greeted
  t.false(matches({ hostNameAppearsAs: 'mail.other-host.test' }));
});

test('does not match a server with its own reverse hostname', (t) => {
  t.false(
    matches({
      remoteAddress: '203.0.113.153',
      resolvedClientHostname: 'mail.example.net',
      resolvedRootClientHostname: 'example.net'
    })
  );
});

test('does not match mail with any SPF or DKIM pass', (t) => {
  t.false(
    matches({
      spf: {
        domain: 'vm1.example.net',
        status: { result: 'pass' },
        rr: 'v=spf1 a -all'
      }
    })
  );
  t.false(
    matches({
      spfFromHeader: {
        domain: 'vm-7c41.example.org',
        status: { result: 'pass' },
        rr: 'v=spf1 ip6:2001:db8:1c00:2::/64 -all'
      }
    })
  );
  // a DKIM signature by any domain, aligned or not
  t.false(
    matches({
      dkim: {
        results: [{ signingDomain: 'example.net', status: { result: 'pass' } }]
      }
    })
  );
  t.false(matches({ hadAlignedAndPassingDKIM: true }));
  t.false(matches({ dmarc: { status: { result: 'pass' } } }));
  t.false(matches({ isTrustedArc: true }));
});

test('does not judge bounces, allowlisted connections or DNS errors', (t) => {
  t.false(
    matches({
      envelope: {
        mailFrom: { address: '' },
        rcptTo: [{ address: 'user@example.com' }]
      }
    })
  );
  t.false(matches({ isAllowlisted: true }));
  t.false(matches({ dmarc: { status: { result: 'temperror' } } }));
  t.false(
    matches({
      spf: {
        domain: 'vm1.example.net',
        status: { result: 'temperror' }
      }
    })
  );
});

test('does not match a From domain that publishes SPF', (t) => {
  // an application running as root in a container putting a contact form
  // visitor's address in From, sent without -f (envelope root@ the server)
  t.false(
    matches({
      originalFromAddress: 'visitor@mailbox.example.com',
      originalFromAddressDomain: 'mailbox.example.com',
      originalFromAddressRootDomain: 'example.com',
      spfFromHeader: {
        domain: 'mailbox.example.com',
        status: { result: 'softfail' },
        rr: 'v=spf1 include:_spf.example.com ~all'
      }
    })
  );

  // a root script sending as a company domain whose SPF does not list it
  for (const result of ['fail', 'softfail', 'neutral', 'permerror']) {
    t.false(
      matches({
        originalFromAddress: 'noreply@company.example.com',
        originalFromAddressDomain: 'company.example.com',
        originalFromAddressRootDomain: 'example.com',
        spfFromHeader: {
          domain: 'company.example.com',
          status: { result }
        }
      }),
      `From domain SPF ${result}`
    );
  }
});
