/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const config = require('#config');
const isHighConfidenceGenericRdnsSpam = require('#helpers/is-high-confidence-generic-rdns-spam');

const { isPermissiveSpfRecord } = isHighConfidenceGenericRdnsSpam;

//
// Mirrors the sessions observed in the campaign: a Google Cloud VM with its
// default reverse DNS, greeting with legacy HELO as the impersonated domain,
// no DKIM signature, SPF softfail/permerror, DMARC p=none (or no record), and
// `googleusercontent.com` on the popularity-based connection allowlist.
//
function createCampaignSession(overrides = {}) {
  return {
    remoteAddress: '35.196.140.60',
    resolvedClientHostname: '60.140.196.35.bc.googleusercontent.com',
    resolvedRootClientHostname: 'googleusercontent.com',
    hostNameAppearsAs: 'uploadboy.com',
    openingCommand: 'HELO',
    transmissionType: 'SMTP',
    isAllowlisted: true,
    allowlistValue: 'googleusercontent.com',
    isOriginalFromAddressAllowlisted: false,
    originalFromAddress: 'support@uploadboy.com',
    originalFromAddressDomain: 'uploadboy.com',
    originalFromAddressRootDomain: 'uploadboy.com',
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
    ...overrides
  };
}

test('matches unauthenticated legacy-HELO mail from a generic cloud reverse hostname', (t) => {
  t.true(isHighConfidenceGenericRdnsSpam(createCampaignSession()));

  // DMARC absent rather than p=none
  t.true(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ dmarc: { status: { result: 'none' } } })
    )
  );

  // SPF permerror (broken record on the impersonated domain)
  t.true(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        spf: { status: { result: 'permerror' } },
        spfFromHeader: { status: { result: 'permerror' } }
      })
    )
  );

  // SPF hard fail with DMARC p=none is not caught by the SPF policy check
  t.true(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        spf: { status: { result: 'fail' } },
        spfFromHeader: { status: { result: 'fail' } }
      })
    )
  );

  // AWS EC2 default reverse DNS
  t.true(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        remoteAddress: '3.15.22.8',
        resolvedClientHostname: 'ec2-3-15-22-8.us-east-2.compute.amazonaws.com',
        resolvedRootClientHostname: 'amazonaws.com',
        allowlistValue: 'amazonaws.com'
      })
    )
  );
});

test('the impersonated From domain being allowlisted is not an exemption', (t) => {
  t.true(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        isOriginalFromAddressAllowlisted: 'Redis allowlist:ubuntu.com',
        originalFromAddress: 'support@ubuntu.com',
        originalFromAddressDomain: 'ubuntu.com',
        originalFromAddressRootDomain: 'ubuntu.com',
        hostNameAppearsAs: 'ubuntu.com'
      })
    )
  );
});

test('an SPF pass obtained from a "+all" record is not authentication', (t) => {
  t.true(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        spf: { status: { result: 'pass' }, rr: 'v=spf1 +all' },
        spfFromHeader: { status: { result: 'pass' }, rr: 'v=spf1 +all' }
      })
    )
  );

  t.true(isPermissiveSpfRecord('v=spf1 +all'));
  t.true(isPermissiveSpfRecord('v=spf1 all'));
  t.true(
    isPermissiveSpfRecord('v=spf1 ip4:1.2.3.4 a mx include:x.example +all')
  );
  t.true(isPermissiveSpfRecord('v=spf1 +ALL'));
  t.false(isPermissiveSpfRecord('v=spf1 include:_spf.google.com ~all'));
  t.false(isPermissiveSpfRecord('v=spf1 ip4:1.2.3.4 -all'));
  t.false(isPermissiveSpfRecord('v=spf1 mx ?all'));
  t.false(isPermissiveSpfRecord('v=spf1 redirect=_spf.example.com'));
  t.false(isPermissiveSpfRecord(''));
  t.false(isPermissiveSpfRecord(undefined));
});

test('allows mail with From-aligned or envelope SPF pass', (t) => {
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        spfFromHeader: {
          status: { result: 'pass' },
          rr: 'v=spf1 ip4:35.196.140.60 -all'
        }
      })
    )
  );

  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        spf: { status: { result: 'pass' }, rr: 'v=spf1 ip4:35.196.140.60 ~all' }
      })
    )
  );

  // an SPF pass without a reported record is still a pass
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ spf: { status: { result: 'pass' } } })
    )
  );
});

test('does not judge mail whose SPF, DKIM, or DMARC evaluation hit a DNS error', (t) => {
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ spf: { status: { result: 'temperror' } } })
    )
  );
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        spfFromHeader: { status: { result: 'temperror' } }
      })
    )
  );
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ dmarc: { status: { result: 'temperror' } } })
    )
  );
  // a signed message whose DKIM key lookup failed is not "unsigned"
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        dkim: {
          results: [
            {
              signingDomain: 'uploadboy.com',
              status: { result: 'temperror', comment: 'DNS failure' }
            }
          ]
        }
      })
    )
  );
  // a failed or missing signature does not exempt
  t.true(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        dkim: {
          results: [
            { signingDomain: 'uploadboy.com', status: { result: 'fail' } }
          ]
        }
      })
    )
  );
  t.true(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ dkim: { results: [] } })
    )
  );
});

test('requires the HELO identity to assert the From domain', (t) => {
  // exact and relaxed (subdomain) alignment both count
  t.true(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ hostNameAppearsAs: 'UPLOADBOY.COM.' })
    )
  );
  t.true(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ hostNameAppearsAs: 'mail.uploadboy.com' })
    )
  );

  // a device or script greeting with its own identity is not judged
  for (const hostNameAppearsAs of [
    'npi3f2a1c.office.example',
    'scanner.example.com',
    '[35.196.140.60]',
    '35.196.140.60',
    'localhost',
    'localhost.localdomain',
    'vm-1.c.project.internal',
    '',
    undefined
  ]) {
    t.false(
      isHighConfidenceGenericRdnsSpam(
        createCampaignSession({ hostNameAppearsAs })
      ),
      `HELO ${JSON.stringify(hostNameAppearsAs)} should not be judged`
    );
  }
});

test('allows mail with aligned DKIM, DMARC pass, or a trusted ARC chain', (t) => {
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ hadAlignedAndPassingDKIM: true })
    )
  );
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ dmarc: { status: { result: 'pass' } } })
    )
  );
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ isTrustedArc: true })
    )
  );
});

test('allows mail greeted with EHLO', (t) => {
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        openingCommand: 'EHLO',
        transmissionType: 'ESMTP'
      })
    )
  );
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ openingCommand: false, transmissionType: 'SMTP' })
    )
  );
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ openingCommand: undefined })
    )
  );
});

test('allows mail from a host with a custom (non-generic) reverse hostname', (t) => {
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        resolvedClientHostname: 'mail.uploadboy.com',
        resolvedRootClientHostname: 'uploadboy.com',
        hasSameHostnameAsFrom: true
      })
    )
  );
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        resolvedClientHostname: 'mail.example.com',
        resolvedRootClientHostname: 'example.com',
        isAllowlisted: false,
        allowlistValue: undefined
      })
    )
  );
  // no reverse DNS at all is outside the scope of this rule
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        resolvedClientHostname: undefined,
        resolvedRootClientHostname: undefined,
        isAllowlisted: false,
        allowlistValue: undefined
      })
    )
  );
});

test('allows mail when the connecting host matches the From domain', (t) => {
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ hasSameHostnameAsFrom: true })
    )
  );
  // a session that never went through update-session is not judged
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ hasSameHostnameAsFrom: undefined })
    )
  );
});

test('honors explicit allowlist entries but not the provider root domain', (t) => {
  // the address itself is allowlisted
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ allowlistValue: '35.196.140.60' })
    )
  );
  // the exact reverse hostname is allowlisted
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({
        allowlistValue: '60.140.196.35.bc.googleusercontent.com'
      })
    )
  );
  // allowlisted without a recorded value is treated as explicit
  t.false(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ allowlistValue: undefined })
    )
  );
  // the root domain from the popularity list is not an exemption
  t.true(
    isHighConfidenceGenericRdnsSpam(
      createCampaignSession({ allowlistValue: 'googleusercontent.com' })
    )
  );
  // ...unless the root domain is hard-coded in the configuration allowlist
  config.allowlist.add('googleusercontent.com');
  try {
    t.false(
      isHighConfidenceGenericRdnsSpam(
        createCampaignSession({ allowlistValue: 'googleusercontent.com' })
      )
    );
  } finally {
    config.allowlist.delete('googleusercontent.com');
  }
});

test('ignores a missing session', (t) => {
  t.false(isHighConfidenceGenericRdnsSpam());
  t.false(isHighConfidenceGenericRdnsSpam(null));
});
