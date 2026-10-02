/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const isHighConfidenceUnconfirmedRdnsSpam = require('#helpers/is-high-confidence-unconfirmed-rdns-spam');

const { hasUnverifiedHelo } = isHighConfidenceUnconfirmedRdnsSpam;

const ADDRESS = '192.0.2.25';

//
// Forward DNS for the hostnames used below. A name that is not listed does not
// exist (NXDOMAIN); "slow.example.net" times out.
//
const A_RECORDS = {
  'mail.example.com': [ADDRESS],
  'relay.isp.example.net': ['203.0.113.80']
};

function dnsError(code) {
  const err = new Error(`query ${code}`);
  err.code = code;
  return err;
}

// published SPF records of the sending domains used below
const TXT_RECORDS = {
  // the broken term (a missing space before "~all") is the last one
  'broken-last.example.com': [
    'site-verification=abc123',
    'v=spf1 ip4:192.0.2.150 include:_spf.example.com +a +mx +ip4:198.51.100.42 include:_spf.example.net~all'
  ],
  // a broken term before one that could list the address
  'broken-first.example.com': [
    'v=spf1 include:_spf.example.net~all ip4:198.51.100.82 -all'
  ],
  // the broken term, then an "all" that authorizes nobody
  'broken-then-all.example.com': [
    'v=spf1 mx include:_spf.example.net~all -all'
  ],
  // the broken term, then "+all" (authorizes everyone)
  'broken-then-pass.example.com': ['v=spf1 include:_spf.example.net~all +all'],
  // two SPF records, either of which might list the address
  'two-records.example.com': [
    'v=spf1 include:_spf.example.net~all',
    'v=spf1 ip4:198.51.100.82 -all'
  ],
  // the broken term is inside an included record, not this one
  'broken-include.example.com': ['v=spf1 include:_spf.vendor.example.net -all']
};

const resolver = {
  async resolve4(hostname) {
    if (hostname === 'slow.example.net') throw dnsError('ETIMEOUT');
    if (A_RECORDS[hostname]) return A_RECORDS[hostname];
    throw dnsError('ENOTFOUND');
  },
  async resolve6() {
    throw dnsError('ENODATA');
  },
  async resolveTxt(name) {
    if (name === 'slow-txt.example.com') throw dnsError('ETIMEOUT');
    if (TXT_RECORDS[name]) return TXT_RECORDS[name].map((record) => [record]);
    throw dnsError('ENOTFOUND');
  }
};

// an SPF permerror for "domain" as mailauth reports it
function permerror(domain, text = 'Invalid domain _spf.example.net~all') {
  return {
    domain,
    status: {
      result: 'permerror',
      comment: `mx1.example.com: permanent error in processing during lookup of noreply@${domain}: ${text}`
    }
  };
}

//
// An address whose PTR hostname does not resolve, that greets with a hostname
// that does not resolve either, no DKIM signature, SPF softfail for the
// envelope domain, and DMARC p=none.
//
function createSession(overrides = {}) {
  return {
    remoteAddress: ADDRESS,
    unconfirmedClientHostname: 'host25.example.net',
    hasNoConfirmedReverseHostname: true,
    hostNameAppearsAs: 'host25.example.net',
    isAllowlisted: false,
    isOriginalFromAddressAllowlisted: false,
    originalFromAddress: 'noreply@shop.example.org',
    originalFromAddressRootDomain: 'example.org',
    hasSameHostnameAsFrom: false,
    hadAlignedAndPassingDKIM: false,
    isTrustedArc: false,
    spf: {
      status: { result: 'softfail' },
      rr: 'v=spf1 include:_spf.example.com ~all'
    },
    spfFromHeader: {
      status: { result: 'softfail' },
      rr: 'v=spf1 include:_spf.example.com ~all'
    },
    dmarc: { status: { result: 'fail' }, policy: 'none' },
    dkim: { results: [{ status: { result: 'none' } }] },
    envelope: {
      mailFrom: { address: 'noreply@shop.example.org' },
      rcptTo: [{ address: 'user@example.com' }]
    },
    ...overrides
  };
}

const matches = (overrides) =>
  isHighConfidenceUnconfirmedRdnsSpam(createSession(overrides), resolver);

test('matches unauthenticated mail from an unconfirmed host that SPF disavows', async (t) => {
  t.true(await matches());

  // no PTR record at all, an address literal HELO, SPF hard fail, no DMARC
  t.true(
    await matches({
      unconfirmedClientHostname: undefined,
      hostNameAppearsAs: `[${ADDRESS}]`,
      spf: { status: { result: 'fail' } },
      spfFromHeader: { status: { result: 'fail' } },
      dmarc: { status: { result: 'none' } }
    })
  );

  // a HELO name that resolves to another address
  t.true(await matches({ hostNameAppearsAs: 'relay.isp.example.net' }));

  // an SPF permerror at the last term of the domain's record
  t.true(
    await matches({
      remoteAddress: '198.51.100.82',
      unconfirmedClientHostname: undefined,
      hostNameAppearsAs: '[198.51.100.82]',
      spf: permerror('broken-last.example.com'),
      spfFromHeader: permerror('broken-last.example.com')
    })
  );

  // an allowlisted From address is an impersonation target, not an exemption
  t.true(await matches({ isOriginalFromAddressAllowlisted: true }));
});

test('does not judge a host whose reverse DNS is confirmed or unknown', async (t) => {
  // forward-confirmed reverse DNS
  t.false(
    await matches({
      hasNoConfirmedReverseHostname: undefined,
      resolvedClientHostname: 'mail.shop.example.org'
    })
  );

  // the PTR or forward lookup timed out or failed: on-connect leaves it unset
  t.false(await matches({ hasNoConfirmedReverseHostname: undefined }));
  t.false(await isHighConfidenceUnconfirmedRdnsSpam(undefined, resolver));
});

test('does not judge a server that greets with a hostname that checks out', async (t) => {
  // a real server missing only its PTR record: its HELO name resolves to it
  t.false(await matches({ hostNameAppearsAs: 'mail.example.com' }));

  // a HELO name in the From domain, or in the envelope domain
  t.false(await matches({ hostNameAppearsAs: 'mx.example.org' }));
  t.false(
    await matches({
      hostNameAppearsAs: 'out.example.info',
      envelope: {
        mailFrom: { address: 'bounce@example.info' },
        rcptTo: [{ address: 'user@example.com' }]
      }
    })
  );

  // not a public hostname, so nothing to check
  for (const helo of ['localhost', 'WIN-5J2K8QK0D7A', 'server.local', '']) {
    t.false(await matches({ hostNameAppearsAs: helo }), `HELO ${helo}`);
  }

  // the HELO lookup timed out (fails open)
  t.false(await matches({ hostNameAppearsAs: 'slow.example.net' }));
});

test('does not match when the domain publishes no SPF assertion, or SPF passes', async (t) => {
  for (const result of ['pass', 'none', 'neutral']) {
    t.false(
      await matches({
        spf: { status: { result } },
        spfFromHeader: { status: { result } }
      }),
      `SPF ${result}`
    );
  }
});

test('does not match mail tied to its domain by DKIM, DMARC, SPF or ARC', async (t) => {
  t.false(await matches({ hadAlignedAndPassingDKIM: true }));
  t.false(await matches({ dmarc: { status: { result: 'pass' } } }));
  t.false(await matches({ isTrustedArc: true }));
  // the From domain authorizes the host even though the envelope domain
  // (e.g. a bounce domain) does not
  t.false(
    await matches({
      spfFromHeader: {
        status: { result: 'pass' },
        rr: `v=spf1 ip4:${ADDRESS} -all`
      }
    })
  );
});

test('does not match an allowlisted connection', async (t) => {
  t.false(await matches({ isAllowlisted: true, allowlistValue: ADDRESS }));
});

test('fails open on any DNS error during authentication', async (t) => {
  t.false(await matches({ dmarc: { status: { result: 'temperror' } } }));
  t.false(
    await matches({ dkim: { results: [{ status: { result: 'temperror' } }] } })
  );
});

test('does not judge IPv6 clients', async (t) => {
  // a dual-stack server sending over IPv6 with a PTR hostname that has only an
  // A record, and an SPF record that lists only its IPv4 address
  t.false(await matches({ remoteAddress: '2001:db8:1::25' }));
});

test('does not judge bounces', async (t) => {
  // with a null MAIL FROM the SPF result is for the HELO name
  for (const mailFrom of [{ address: '' }, false, undefined]) {
    t.false(
      await matches({
        envelope: { mailFrom, rcptTo: [{ address: 'user@example.com' }] }
      }),
      `MAIL FROM ${JSON.stringify(mailFrom)}`
    );
  }
});

test('does not look up the HELO name unless everything else matches', async (t) => {
  let lookups = 0;
  const counting = {
    async resolve4() {
      lookups++;
      throw dnsError('ENOTFOUND');
    },
    async resolve6() {
      lookups++;
      throw dnsError('ENODATA');
    }
  };
  t.false(
    await isHighConfidenceUnconfirmedRdnsSpam(
      createSession({ hadAlignedAndPassingDKIM: true }),
      counting
    )
  );
  t.is(lookups, 0);
});

test('hasUnverifiedHelo: address literals give no hostname', async (t) => {
  for (const helo of [`[${ADDRESS}]`, ADDRESS, '[IPv6:2001:db8::1]']) {
    t.true(
      await hasUnverifiedHelo(
        createSession({ hostNameAppearsAs: helo }),
        resolver
      ),
      `HELO ${helo}`
    );
  }
});

const permerrorSession = (domain, text) => ({
  remoteAddress: '198.51.100.82',
  unconfirmedClientHostname: undefined,
  hostNameAppearsAs: '[198.51.100.82]',
  spf: permerror(domain, text),
  spfFromHeader: permerror(domain, text)
});

test('judges an SPF permerror only when it provably hides no authorization', async (t) => {
  // the broken term is the last one but for an "all" that authorizes nobody
  t.true(await matches(permerrorSession('broken-then-all.example.com')));

  for (const [domain, why] of [
    ['broken-first.example.com', 'a term after the broken one may list it'],
    ['broken-then-pass.example.com', '"+all" after the broken term'],
    ['two-records.example.com', 'another SPF record may list it'],
    ['broken-include.example.com', 'the broken term is in an included record'],
    ['no-record.example.com', 'the TXT record could not be found'],
    ['slow-txt.example.com', 'the TXT lookup timed out']
  ]) {
    t.false(await matches(permerrorSession(domain)), `${why}`);
  }

  // other permerrors could be hiding a term that lists the address
  for (const text of [
    'Too many DNS requests',
    'Too many void DNS results',
    'multiple SPF records found for broken-last.example.com'
  ]) {
    t.false(
      await matches(permerrorSession('broken-last.example.com', text)),
      `${text}`
    );
  }
});

test('does not judge a HELO name that is not a public hostname', async (t) => {
  for (const helo of [
    'srv.corp',
    'host.lan',
    'x.home',
    'box.localdomain',
    'nas.home.arpa'
  ]) {
    t.false(await matches({ hostNameAppearsAs: helo }), `HELO ${helo}`);
  }
});
