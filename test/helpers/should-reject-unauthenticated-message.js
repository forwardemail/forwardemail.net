/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const { Buffer } = require('node:buffer');
const { generateKeyPairSync } = require('node:crypto');

// every authenticated message is ARC sealed, which needs a signing key
// (CI has one in its secrets; any key does for what is checked here)
if (!process.env.DKIM_PRIVATE_KEY_VALUE && !process.env.DKIM_PRIVATE_KEY_PATH)
  process.env.DKIM_PRIVATE_KEY_VALUE = generateKeyPairSync('rsa', {
    modulusLength: 2048
  }).privateKey.export({ type: 'pkcs1', format: 'pem' });

const test = require('ava');
const { Headers } = require('mailsplit');

const isAuthenticatedMessage = require('#helpers/is-authenticated-message');
const {
  shouldRejectDmarcReject,
  shouldRejectDmarcQuarantine,
  shouldRejectUnauthenticatedGmail
} = require('#helpers/should-reject-unauthenticated-message');

function createSession(overrides = {}) {
  return {
    isAllowlisted: true,
    originalFromAddressDomain: 'example.com',
    hadAlignedAndPassingDKIM: false,
    spf: { status: { result: 'fail' } },
    spfFromHeader: { status: { result: 'fail' } },
    dmarc: { status: { result: 'fail' }, policy: 'none' },
    ...overrides
  };
}

test('preserves DMARC reject enforcement regardless of connection allowlisting', (t) => {
  const session = createSession({
    dmarc: { status: { result: 'fail' }, policy: 'reject' }
  });

  t.true(session.isAllowlisted);
  t.true(shouldRejectDmarcReject(session, false, false));
});

test('preserves DMARC quarantine enforcement for Googlemail and other enforcing domains', (t) => {
  const session = createSession({
    originalFromAddressDomain: 'googlemail.com',
    dmarc: { status: { result: 'fail' }, policy: 'quarantine' }
  });
  const alignedSpfSession = createSession({
    dmarc: { status: { result: 'fail' }, policy: 'quarantine' },
    spfFromHeader: { status: { result: 'pass' } }
  });

  t.true(shouldRejectDmarcQuarantine(session, false, false));
  t.false(shouldRejectDmarcQuarantine(alignedSpfSession, false, false));
});

test('rejects an unauthenticated Gmail impersonation despite connection allowlisting', (t) => {
  const session = createSession({
    originalFromAddressDomain: 'gmail.com',
    dmarc: { status: { result: 'fail' }, policy: 'none' },
    spf: { status: { result: 'softfail' } },
    spfFromHeader: { status: { result: 'softfail' } }
  });

  t.true(session.isAllowlisted);
  t.true(shouldRejectUnauthenticatedGmail(session, false, false));
});

test('does not restore blanket rejection for generic p=none domains', (t) => {
  const session = createSession({
    originalFromAddressDomain: 'sender-without-dkim.example',
    dmarc: { status: { result: 'fail' }, policy: 'none' },
    spf: { status: { result: 'softfail' } },
    spfFromHeader: { status: { result: 'softfail' } }
  });

  t.false(shouldRejectUnauthenticatedGmail(session, false, false));
});

test('requires an exact Gmail domain match and allows aligned Gmail mail', (t) => {
  const suffixSession = createSession({
    originalFromAddressDomain: 'notgmail.com'
  });
  const authenticatedSession = createSession({
    originalFromAddressDomain: 'gmail.com',
    hadAlignedAndPassingDKIM: true
  });

  t.false(shouldRejectUnauthenticatedGmail(suffixSession, false, false));
  t.false(shouldRejectUnauthenticatedGmail(authenticatedSession, false, false));
});

test('retains validated truth-source ARC and legitimate DSN exceptions', (t) => {
  const quarantineSession = createSession({
    dmarc: { status: { result: 'fail' }, policy: 'quarantine' }
  });
  const rejectSession = createSession({
    dmarc: { status: { result: 'fail' }, policy: 'reject' }
  });

  t.false(shouldRejectDmarcQuarantine(quarantineSession, true, false));
  t.false(shouldRejectDmarcQuarantine(quarantineSession, false, true));
  t.false(shouldRejectDmarcReject(rejectSession, true, false));
  t.false(shouldRejectDmarcReject(rejectSession, false, true));
  t.false(
    shouldRejectUnauthenticatedGmail(
      createSession({ originalFromAddressDomain: 'gmail.com' }),
      true,
      false
    )
  );
  t.false(
    shouldRejectUnauthenticatedGmail(
      createSession({ originalFromAddressDomain: 'gmail.com' }),
      false,
      true
    )
  );
});

//
// The policy applied to a real message: authentication is evaluated
// against the sender's published records (answered locally here), an
// enforcing DMARC policy rejects, and mail that merely lacks passing
// authentication under p=none is passed on to the normal filtering path
// (with the Gmail-only decision left to the caller).
//

const SENDER_IP = '203.0.113.7';

// the DNS a message's authentication consults, per record
function createResolver(records) {
  return {
    async resolve(name, rrtype = 'A') {
      const key = `${rrtype.toUpperCase()} ${name
        .toLowerCase()
        .replace(/\.$/, '')}`;
      if (records[key]) return records[key];
      const err = new Error(`query${rrtype} ENOTFOUND ${name}`);
      err.code = 'ENOTFOUND';
      throw err;
    }
  };
}

function createMessage(
  from,
  { rcpt = 'someone@example.net', extraHeaders = [] } = {}
) {
  const domain = from.split('@')[1];
  const raw = Buffer.from(
    [
      `From: ${from}`,
      ...extraHeaders,
      `To: ${rcpt}`,
      'Subject: hello',
      `Message-ID: <${Date.now()}@${domain}>`,
      `Date: ${new Date().toUTCString()}`,
      'Content-Type: text/plain; charset=us-ascii',
      '',
      'hello'
    ].join('\r\n')
  );
  const index = raw.indexOf('\r\n\r\n');
  const headers = new Headers(raw.subarray(0, index + 4));
  const body = raw.subarray(index + 4);
  const session = {
    remoteAddress: SENDER_IP,
    hostNameAppearsAs: `mail.${domain}`,
    resolvedClientHostname: `mail.${domain}`,
    resolvedRootClientHostname: domain,
    isAllowlisted: false,
    envelope: { mailFrom: { address: from }, rcptTo: [{ address: rcpt }] },
    originalFromAddress: from,
    originalFromAddressDomain: domain
  };
  return { headers, body, session };
}

test('a p=none sender without passing authentication is passed on to the normal filtering', async (t) => {
  // SPF does not cover the connecting IP, there is no DKIM signature and
  // the domain only asks to be told (p=none)
  const resolver = createResolver({
    'TXT sender.example': [['v=spf1 ip4:198.51.100.0/24 ~all']],
    'TXT _dmarc.sender.example': [['v=DMARC1; p=none']]
  });
  const { headers, body, session } = createMessage('news@sender.example');

  const rejectGmail = await isAuthenticatedMessage(
    headers,
    body,
    session,
    resolver
  );
  t.false(rejectGmail);
  t.is(session.spf.status.result, 'softfail');
  t.is(session.dmarc.policy, 'none');
  t.is(session.dmarc.status.result, 'fail');
  t.false(session.hadAlignedAndPassingDKIM);
});

test('the same message from Gmail is left to be rejected once the denylists have run', async (t) => {
  const resolver = createResolver({
    'TXT gmail.com': [['v=spf1 ip4:198.51.100.0/24 ~all']],
    'TXT _dmarc.gmail.com': [['v=DMARC1; p=none']]
  });
  const { headers, body, session } = createMessage('someone@gmail.com');
  t.true(await isAuthenticatedMessage(headers, body, session, resolver));
});

test('an enforcing DMARC policy rejects the message outright', async (t) => {
  for (const policy of ['quarantine', 'reject']) {
    const resolver = createResolver({
      'TXT sender.example': [['v=spf1 ip4:198.51.100.0/24 -all']],
      'TXT _dmarc.sender.example': [[`v=DMARC1; p=${policy}`]]
    });
    const { headers, body, session } = createMessage('news@sender.example');
    const err = await t.throwsAsync(
      isAuthenticatedMessage(headers, body, session, resolver)
    );
    t.is(err.responseCode, 550);
    t.regex(err.message, /DMARC policy/);
  }
});

test('an SPF hard fail without DMARC or aligned DKIM rejects the message', async (t) => {
  const resolver = createResolver({
    'TXT sender.example': [['v=spf1 ip4:198.51.100.0/24 -all']]
  });
  const { headers, body, session } = createMessage('news@sender.example');
  const err = await t.throwsAsync(
    isAuthenticatedMessage(headers, body, session, resolver)
  );
  t.is(session.spf.status.result, 'fail');
  t.regex(err.message, /SPF hard fail policy/);
});

test('a message with more than one From header is rejected before anything is looked up', async (t) => {
  const resolver = createResolver({});
  const { headers, body, session } = createMessage('news@sender.example', {
    extraHeaders: ['From: other@sender.example']
  });
  const err = await t.throwsAsync(
    isAuthenticatedMessage(headers, body, session, resolver)
  );
  t.is(err.responseCode, 550);
  t.regex(err.message, /multiple From headers/);
});
