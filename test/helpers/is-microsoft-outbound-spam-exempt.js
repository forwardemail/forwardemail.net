/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const test = require('ava');
const { Headers } = require('mailsplit');

const isArbitrary = require('#helpers/is-arbitrary');
const {
  checkMicrosoftOutboundSpamExemptLimit,
  isMicrosoftOutboundSpamExempt,
  MICROSOFT_OUTBOUND_SPAM_EXEMPT_DOMAIN_RECIPIENT_LIMIT,
  MICROSOFT_OUTBOUND_SPAM_EXEMPT_RECIPIENT_LIMIT
} = require('#helpers/is-microsoft-outbound-spam-exempt');

const MICROSOFT_REJECTION = /Due to spam from onmicrosoft\.com/;

// Forefront report of a legitimate message from a signed-in mailbox that
// Microsoft's outbound filter scored as spam (`SCL:9;SFV:SPM;CAT:OSPM`)
const OUTBOUND_SPAM_REPORT =
  'CIP:255.255.255.255;CTRY:;LANG:es;SCL:9;SRV:;IPV:NLI;SFV:SPM;H:BN0PR07MB8815.namprd07.prod.outlook.com;PTR:;CAT:OSPM;SFS:(13230040)(376014)(1800799024)(6049299003)(366016)(23010399003)(10067099003)(56012099006)(8096899003)(18002099003)(4053099003)(38070700021);DIR:OUT;SFP:1501;';

//
// Headers of a message relayed by Microsoft 365 outbound infrastructure for a
// signed-in mailbox of a hosted tenant using its own custom domain, as
// received by our MX servers (with identifying details replaced)
//
// (`prepend` adds raw header lines above the rest, as a sender could)
function createHeaders(overrides = {}, prepend = []) {
  const values = {
    'ARC-Authentication-Results':
      'i=1; mx.microsoft.com 1; spf=pass smtp.mailfrom=example.com; dmarc=pass action=none header.from=example.com; dkim=pass header.d=example.com; arc=none',
    From: 'Sender <sender@example.com>',
    To: 'Recipient <recipient@example.net>',
    Subject: 'Estado de cuenta',
    Date: 'Mon, 28 Sep 2026 22:59:29 +0000',
    'Message-ID':
      '<BN0PR07MB881534C88F0F7266836FD753878D2@BN0PR07MB8815.namprd07.prod.outlook.com>',
    'Content-Language': 'es-ES',
    'X-MS-Has-Attach': 'yes',
    'X-Forefront-Antispam-Report': OUTBOUND_SPAM_REPORT,
    'Content-Type': 'multipart/mixed; boundary="_007_boundary_"',
    'MIME-Version': '1.0',
    'X-OriginatorOrg': 'example.com',
    'X-MS-Exchange-CrossTenant-AuthAs': 'Internal',
    'X-MS-Exchange-CrossTenant-AuthSource':
      'BN0PR07MB8815.namprd07.prod.outlook.com',
    'X-MS-Exchange-CrossTenant-fromentityheader': 'Hosted',
    'X-MS-Exchange-CrossTenant-mailboxtype': 'HOSTED',
    ...overrides
  };

  const lines = [...prepend];
  for (const [key, value] of Object.entries(values)) {
    if (value === null) continue;
    lines.push(`${key}: ${value}`);
  }

  return new Headers(Buffer.from(`${lines.join('\r\n')}\r\n\r\n`));
}

//
// Session populated by `helpers/on-data-mx.js` and `isAuthenticatedMessage`
// for the same message (SPF, aligned DKIM, DMARC, and ARC all pass)
//
function createSession(overrides = {}) {
  return {
    resolvedClientHostname:
      'mail-northcentralusazhn150130003.outbound.protection.outlook.com',
    resolvedRootClientHostname: 'outlook.com',
    hostNameAppearsAs: 'ch4pr04cu002.outbound.protection.outlook.com',
    isAllowlisted: false,
    isOriginalFromAddressAllowlisted: false,
    arrivalDateFormatted: '2026-09-28',
    originalFromAddress: 'sender@example.com',
    originalFromAddressDomain: 'example.com',
    originalFromAddressRootDomain: 'example.com',
    envelope: {
      mailFrom: { address: 'sender@example.com' },
      rcptTo: [{ address: 'recipient@example.net' }]
    },
    hadAlignedAndPassingDKIM: true,
    isTrustedArc: true,
    spf: {
      domain: 'example.com',
      rr: 'v=spf1 include:spf.protection.outlook.com -all',
      status: { result: 'pass' }
    },
    dmarc: {
      domain: 'example.com',
      policy: 'quarantine',
      p: 'quarantine',
      status: { result: 'pass' }
    },
    arc: { status: { result: 'pass' } },
    ...overrides
  };
}

test.beforeEach((t) => {
  t.context.client = new Redis({ keyPrefix: randomUUID() });
});

test.afterEach.always((t) => {
  t.context.client.disconnect();
});

function reportWith(fields) {
  let report = OUTBOUND_SPAM_REPORT;
  for (const [key, value] of Object.entries(fields)) {
    report = report.replace(new RegExp(`${key}:[^;]*;`), `${key}:${value};`);
  }

  return report;
}

//
// the reported false positive
//

test('delivers a fully authenticated custom domain message with a generic Microsoft outbound spam verdict', (t) => {
  const session = createSession();
  t.notThrows(() => isArbitrary(session, createHeaders()));
  t.true(session.isMicrosoftOutboundSpamExempt);
});

test('exempts SCL-only verdicts for a fully authenticated custom domain message', (t) => {
  const session = createSession();
  const headers = createHeaders({
    'X-Forefront-Antispam-Report': reportWith({ SFV: 'NSPM', CAT: 'NONE' })
  });
  t.notThrows(() => isArbitrary(session, headers));
  t.true(session.isMicrosoftOutboundSpamExempt);
});

test('does not flag messages without a spam verdict as exempt', (t) => {
  const session = createSession();
  const headers = createHeaders({
    'X-Forefront-Antispam-Report': reportWith({
      SCL: '1',
      SFV: 'NSPM',
      CAT: 'NONE'
    })
  });
  t.notThrows(() => isArbitrary(session, headers));
  t.is(session.isMicrosoftOutboundSpamExempt, undefined);
});

//
// specific Microsoft verdicts are always rejected
//

for (const cat of [
  'PHSH',
  'HPHSH',
  'HPHISH',
  'HSPM',
  'MALW',
  'SPOOF',
  'BIMP',
  'DIMP',
  'GIMP',
  'UIMP',
  'INTOS',
  'UNKNOWN'
]) {
  test(`rejects CAT:${cat} even when fully authenticated`, (t) => {
    const session = createSession();
    const headers = createHeaders({
      'X-Forefront-Antispam-Report': reportWith({ CAT: cat })
    });
    t.throws(() => isArbitrary(session, headers), {
      message: MICROSOFT_REJECTION
    });
    t.is(session.isMicrosoftOutboundSpamExempt, undefined);
  });
}

for (const sfv of ['SKB', 'SKS', 'BLK']) {
  test(`rejects SFV:${sfv} even when fully authenticated`, (t) => {
    const session = createSession();
    const headers = createHeaders({
      'X-Forefront-Antispam-Report': reportWith({ SFV: sfv })
    });
    t.throws(() => isArbitrary(session, headers), {
      message: MICROSOFT_REJECTION
    });
  });
}

test('rejects a duplicated SFV field that includes a blocked sender verdict', (t) => {
  const session = createSession();
  const headers = createHeaders({
    'X-Forefront-Antispam-Report': OUTBOUND_SPAM_REPORT.replace(
      'DIR:OUT;',
      'SFV:SKB;DIR:OUT;'
    )
  });
  t.false(isMicrosoftOutboundSpamExempt(session, headers));
  t.throws(() => isArbitrary(session, headers), {
    message: MICROSOFT_REJECTION
  });
});

test('rejects a duplicated CAT field that includes a specific category', (t) => {
  const session = createSession();
  const headers = createHeaders({
    'X-Forefront-Antispam-Report': reportWith({ CAT: 'NONE' }).replace(
      'DIR:OUT;',
      'CAT:INTOS;DIR:OUT;'
    )
  });
  t.false(isMicrosoftOutboundSpamExempt(session, headers));
  t.throws(() => isArbitrary(session, headers), {
    message: MICROSOFT_REJECTION
  });
});

test('rejects a verdict that is not for an outbound message', (t) => {
  const session = createSession();
  const headers = createHeaders({
    'X-Forefront-Antispam-Report': reportWith({ DIR: 'INB' })
  });
  t.false(isMicrosoftOutboundSpamExempt(session, headers));
  t.throws(() => isArbitrary(session, headers), {
    message: MICROSOFT_REJECTION
  });
});

for (const [name, line] of [
  [
    'X-MS-Exchange-CrossTenant-AuthAs',
    'X-MS-Exchange-CrossTenant-AuthAs: Internal'
  ],
  ['X-OriginatorOrg', 'X-OriginatorOrg: example.com'],
  [
    'X-Forefront-Antispam-Report',
    `X-Forefront-Antispam-Report: ${reportWith({ SFV: 'NSPM', CAT: 'NONE' })}`
  ]
]) {
  test(`rejects a sender-supplied ${name} header shadowing Microsoft's`, (t) => {
    const session = createSession();
    const headers = createHeaders(
      {
        'X-MS-Exchange-CrossTenant-AuthAs': 'Anonymous',
        'X-Forefront-Antispam-Report': reportWith({ CAT: 'PHSH' })
      },
      [line]
    );
    t.false(isMicrosoftOutboundSpamExempt(session, headers));
    t.throws(() => isArbitrary(session, headers), {
      message: MICROSOFT_REJECTION
    });
  });
}

test('rejects a duplicated tenant header even when both copies look valid', (t) => {
  const headers = createHeaders({}, [
    'X-MS-Exchange-CrossTenant-AuthAs: Internal'
  ]);
  t.false(isMicrosoftOutboundSpamExempt(createSession(), headers));
});

test('delivers a fully authenticated no-reply custom domain sender', (t) => {
  const session = createSession({
    originalFromAddress: 'no-reply@example.com',
    envelope: {
      mailFrom: { address: 'no-reply@example.com' },
      rcptTo: [{ address: 'recipient@example.net' }]
    }
  });
  const headers = createHeaders({ From: 'Statements <no-reply@example.com>' });
  t.notThrows(() => isArbitrary(session, headers));
  t.true(session.isMicrosoftOutboundSpamExempt);
});

//
// the sender profile must match exactly
//

const rejectedProfiles = {
  'an onmicrosoft.com sender': {
    session: {
      originalFromAddress: 'sender@contoso.onmicrosoft.com',
      originalFromAddressDomain: 'contoso.onmicrosoft.com',
      originalFromAddressRootDomain: 'onmicrosoft.com',
      spf: {
        domain: 'contoso.onmicrosoft.com',
        rr: 'v=spf1 include:spf.protection.outlook.com -all',
        status: { result: 'pass' }
      },
      dmarc: {
        domain: 'onmicrosoft.com',
        policy: 'reject',
        status: { result: 'pass' }
      }
    },
    headers: {
      From: 'Sender <sender@contoso.onmicrosoft.com>',
      'X-OriginatorOrg': 'contoso.onmicrosoft.com'
    }
  },
  'a Microsoft consumer domain sender': {
    session: {
      originalFromAddress: 'sender@outlook.com',
      originalFromAddressDomain: 'outlook.com',
      originalFromAddressRootDomain: 'outlook.com',
      spf: {
        domain: 'outlook.com',
        rr: 'v=spf1 include:spf2.outlook.com -all',
        status: { result: 'pass' }
      },
      dmarc: {
        domain: 'outlook.com',
        policy: 'reject',
        status: { result: 'pass' }
      }
    },
    headers: {
      From: 'Sender <sender@outlook.com>',
      'X-OriginatorOrg': 'outlook.com'
    }
  },
  'a tenant whose originating organization is another domain': {
    headers: { 'X-OriginatorOrg': 'contoso.onmicrosoft.com' }
  },
  'a missing originating organization': {
    headers: { 'X-OriginatorOrg': null }
  },
  'an anonymous cross-tenant submission': {
    headers: { 'X-MS-Exchange-CrossTenant-AuthAs': 'Anonymous' }
  },
  'a hybrid on-premises submission': {
    headers: { 'X-MS-Exchange-CrossTenant-fromentityheader': 'HybridOnPrem' }
  },
  'a non-hosted mailbox': {
    headers: { 'X-MS-Exchange-CrossTenant-mailboxtype': null }
  },
  'a DMARC policy of none': {
    session: {
      dmarc: {
        domain: 'example.com',
        policy: 'none',
        status: { result: 'pass' }
      }
    }
  },
  'a DMARC failure': {
    session: {
      dmarc: {
        domain: 'example.com',
        policy: 'quarantine',
        status: { result: 'fail' }
      }
    }
  },
  'a DMARC policy applied to only some messages': {
    session: {
      dmarc: {
        domain: 'example.com',
        policy: 'quarantine',
        pct: 50,
        status: { result: 'pass' }
      }
    }
  },
  'no aligned and passing DKIM': {
    session: { hadAlignedAndPassingDKIM: false }
  },
  'an SPF failure': {
    session: {
      spf: {
        domain: 'example.com',
        rr: 'v=spf1 include:spf.protection.outlook.com -all',
        status: { result: 'fail' }
      }
    }
  },
  'a permissive SPF record': {
    session: {
      spf: {
        domain: 'example.com',
        rr: 'v=spf1 +all',
        status: { result: 'pass' }
      }
    }
  },
  'an SPF domain unrelated to the From domain': {
    session: {
      spf: {
        domain: 'example.org',
        rr: 'v=spf1 include:spf.protection.outlook.com -all',
        status: { result: 'pass' }
      }
    }
  },
  'an untrusted ARC seal': {
    session: { isTrustedArc: false }
  },
  'a failing ARC seal': {
    session: { arc: { status: { result: 'fail' } } }
  },
  'a connection not from Microsoft outbound infrastructure': {
    session: {
      resolvedClientHostname: 'mail.example.org',
      resolvedRootClientHostname: 'example.org'
    }
  }
};

for (const [name, profile] of Object.entries(rejectedProfiles)) {
  test(`is not exempt for ${name}`, (t) => {
    const session = createSession(profile.session);
    const headers = createHeaders(profile.headers);
    t.false(isMicrosoftOutboundSpamExempt(session, headers));
  });
}

test('still rejects a generic verdict for an onmicrosoft.com sender', (t) => {
  const { session, headers } = rejectedProfiles['an onmicrosoft.com sender'];
  t.throws(() => isArbitrary(createSession(session), createHeaders(headers)), {
    message: MICROSOFT_REJECTION
  });
});

test('still rejects a generic verdict for an anonymous cross-tenant submission', (t) => {
  const { headers } = rejectedProfiles['an anonymous cross-tenant submission'];
  t.throws(() => isArbitrary(createSession(), createHeaders(headers)), {
    message: MICROSOFT_REJECTION
  });
});

test('still rejects a generic verdict with a DMARC policy of none', (t) => {
  const { session } = rejectedProfiles['a DMARC policy of none'];
  t.throws(() => isArbitrary(createSession(session), createHeaders()), {
    message: MICROSOFT_REJECTION
  });
});

//
// bounces relayed by Microsoft keep the bounce spam checks
//

test('rejects a Microsoft bounce with an empty MAIL FROM and a spam verdict', (t) => {
  const session = createSession({
    originalFromAddress: 'postmaster@example.com',
    envelope: {
      mailFrom: { address: '' },
      rcptTo: [{ address: 'recipient@example.net' }]
    }
  });
  const headers = createHeaders({
    From: 'Microsoft Outlook <postmaster@example.com>',
    Subject: 'Undeliverable: Estado de cuenta'
  });
  t.throws(() => isArbitrary(session, headers), {
    message: MICROSOFT_REJECTION
  });
  t.is(session.isMicrosoftOutboundSpamExempt, undefined);
});

test('rejects a Microsoft bounce from mailer-daemon with a spam verdict', (t) => {
  const session = createSession({
    originalFromAddress: 'mailer-daemon@example.com',
    envelope: {
      mailFrom: { address: 'mailer-daemon@example.com' },
      rcptTo: [{ address: 'recipient@example.net' }]
    }
  });
  const headers = createHeaders({
    From: 'Mail Delivery System <mailer-daemon@example.com>'
  });
  t.throws(() => isArbitrary(session, headers), {
    message: MICROSOFT_REJECTION
  });
});

test('allows a Microsoft bounce explicitly marked as not spam', (t) => {
  const session = createSession({
    originalFromAddress: 'postmaster@example.com',
    envelope: {
      mailFrom: { address: '' },
      rcptTo: [{ address: 'recipient@example.net' }]
    }
  });
  const headers = createHeaders({
    From: 'Microsoft Outlook <postmaster@example.com>',
    Subject: 'Undeliverable: Estado de cuenta',
    'X-Forefront-Antispam-Report': reportWith({
      SCL: '1',
      SFV: 'NSPM',
      CAT: 'NONE'
    })
  });
  t.notThrows(() => isArbitrary(session, headers));
});

//
// daily distinct recipient limit for exempt senders
//

function createExemptSession(recipients) {
  return createSession({
    envelope: {
      mailFrom: { address: 'sender@example.com' },
      rcptTo: recipients.map((address) => ({ address }))
    }
  });
}

test('allows exempt messages up to the daily distinct recipient limit', async (t) => {
  const { client } = t.context;
  for (let i = 1; i <= MICROSOFT_OUTBOUND_SPAM_EXEMPT_RECIPIENT_LIMIT; i++) {
    const { sender } = await checkMicrosoftOutboundSpamExemptLimit(
      createExemptSession([`recipient${i}@example.net`]),
      client
    );
    t.is(sender, i);
  }
});

test('does not count retries to the same recipient', async (t) => {
  const { client } = t.context;
  for (let i = 0; i < MICROSOFT_OUTBOUND_SPAM_EXEMPT_RECIPIENT_LIMIT * 3; i++) {
    const { sender, domain } = await checkMicrosoftOutboundSpamExemptLimit(
      createExemptSession(['Recipient@Example.net', 'recipient@example.net']),
      client
    );
    t.is(sender, 1);
    t.is(domain, 1);
  }
});

test('rejects with a temporary error once the daily distinct recipient limit is exceeded', async (t) => {
  const { client } = t.context;
  const recipients = [];
  for (let i = 1; i <= MICROSOFT_OUTBOUND_SPAM_EXEMPT_RECIPIENT_LIMIT; i++) {
    recipients.push(`recipient${i}@example.net`);
  }

  await checkMicrosoftOutboundSpamExemptLimit(
    createExemptSession(recipients),
    client
  );

  const err = await t.throwsAsync(
    checkMicrosoftOutboundSpamExemptLimit(
      createExemptSession(['one-too-many@example.net']),
      client
    ),
    { message: MICROSOFT_REJECTION }
  );
  t.is(err.responseCode, 421);

  // once exceeded, previously counted recipients are rejected too
  const retry = await t.throwsAsync(
    checkMicrosoftOutboundSpamExemptLimit(
      createExemptSession(['recipient1@example.net']),
      client
    ),
    { message: MICROSOFT_REJECTION }
  );
  t.is(retry.responseCode, 421);
});

test('rejects a single exempt message fanned out beyond the limit', async (t) => {
  const recipients = [];
  for (let i = 0; i <= MICROSOFT_OUTBOUND_SPAM_EXEMPT_RECIPIENT_LIMIT; i++) {
    recipients.push(`recipient${i}@example.net`);
  }

  const err = await t.throwsAsync(
    checkMicrosoftOutboundSpamExemptLimit(
      createExemptSession(recipients),
      t.context.client
    ),
    { message: MICROSOFT_REJECTION }
  );
  t.is(err.responseCode, 421);
});

test('tracks the limit per sender', async (t) => {
  const { client } = t.context;
  const recipients = [];
  for (let i = 1; i <= MICROSOFT_OUTBOUND_SPAM_EXEMPT_RECIPIENT_LIMIT; i++) {
    recipients.push(`recipient${i}@example.net`);
  }

  await checkMicrosoftOutboundSpamExemptLimit(
    createExemptSession(recipients),
    client
  );

  const other = createSession({
    originalFromAddress: 'other@example.com',
    envelope: {
      mailFrom: { address: 'other@example.com' },
      rcptTo: [{ address: 'recipient1@example.net' }]
    }
  });
  const { sender } = await checkMicrosoftOutboundSpamExemptLimit(other, client);
  t.is(sender, 1);
});

test('shares the limit across plus-addressed variants of a sender', async (t) => {
  const { client } = t.context;
  const first = createSession({
    originalFromAddress: 'sender+a@example.com',
    envelope: {
      mailFrom: { address: 'sender+a@example.com' },
      rcptTo: [{ address: 'recipient1@example.net' }]
    }
  });
  const second = createSession({
    originalFromAddress: 'Sender+b@example.com',
    envelope: {
      mailFrom: { address: 'sender+b@example.com' },
      rcptTo: [{ address: 'recipient2@example.net' }]
    }
  });
  await checkMicrosoftOutboundSpamExemptLimit(first, client);
  const { sender } = await checkMicrosoftOutboundSpamExemptLimit(
    second,
    client
  );
  t.is(sender, 2);
});

test('rejects once a sender domain exceeds its daily distinct recipient limit across mailboxes', async (t) => {
  const { client } = t.context;
  let i = 0;
  for (; i < MICROSOFT_OUTBOUND_SPAM_EXEMPT_DOMAIN_RECIPIENT_LIMIT; i++) {
    const session = createSession({
      originalFromAddress: `mailbox${i}@example.com`,
      envelope: {
        mailFrom: { address: `mailbox${i}@example.com` },
        rcptTo: [{ address: `recipient${i}@example.net` }]
      }
    });
    const { sender, domain } = await checkMicrosoftOutboundSpamExemptLimit(
      session,
      client
    );
    t.is(sender, 1);
    t.is(domain, i + 1);
  }

  const err = await t.throwsAsync(
    checkMicrosoftOutboundSpamExemptLimit(
      createSession({
        originalFromAddress: 'another-mailbox@example.com',
        envelope: {
          mailFrom: { address: 'another-mailbox@example.com' },
          rcptTo: [{ address: `recipient${i}@example.net` }]
        }
      }),
      client
    ),
    { message: MICROSOFT_REJECTION }
  );
  t.is(err.responseCode, 421);
});
