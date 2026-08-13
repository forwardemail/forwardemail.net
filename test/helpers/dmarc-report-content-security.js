/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const {
  findUnsafeDmarcContent,
  findUnsafeDmarcXmlContent,
  validateReportContent
} = require('#helpers/validate-dmarc-report');

function createDmarcReport({
  orgName = 'Example Mail Provider',
  extraContactInfo = ''
} = {}) {
  const now = new Date();
  return {
    report_metadata: {
      org_name: orgName,
      email: 'dmarc@example.test',
      extra_contact_info: extraContactInfo,
      report_id: 'security-test-report',
      date_range: {
        begin: new Date(now.getTime() - 60 * 60 * 1000),
        end: now
      }
    },
    policy_published: {
      domain: 'example.test',
      adkim: 'r',
      aspf: 'r',
      p: 'reject',
      sp: 'reject',
      pct: 100,
      fo: '0'
    },
    records: [],
    summary: {
      total_messages: 1
    }
  };
}

test('DMARC raw XML scanner permits ordinary aggregate-report elements', (t) => {
  const xml =
    '<feedback><report_metadata><org_name>Example</org_name></report_metadata><record /></feedback>';

  t.is(findUnsafeDmarcXmlContent(xml), null);
});

test('DMARC raw XML scanner rejects active markup in an ignored XML node', (t) => {
  const xml =
    '<feedback><extension>&lt;script&gt;window.__xss_poc=1&lt;/script&gt;</extension></feedback>';

  t.is(
    findUnsafeDmarcXmlContent(xml),
    'Unsafe active markup or executable URI in DMARC XML'
  );
});

test('DMARC content validation accepts ordinary aggregate report values', (t) => {
  const report = createDmarcReport();

  t.is(findUnsafeDmarcContent(report), null);
  t.deepEqual(validateReportContent(report, 1024), { valid: true });
});

test('DMARC content validation rejects entity-decoded script markup before persistence', (t) => {
  // This is the decoded value produced from XML text such as
  // `reports.example&lt;script&gt;window.__xss_poc=1&lt;/script&gt;`.
  const report = createDmarcReport({
    orgName: 'reports.example<script>window.__xss_poc=1</script>'
  });

  t.is(findUnsafeDmarcContent(report), 'report.report_metadata.org_name');
  t.deepEqual(validateReportContent(report, 1024), {
    valid: false,
    reason: 'Unsafe markup or executable URI in report.report_metadata.org_name'
  });
});

test('DMARC content validation rejects executable URI schemes in report fields', (t) => {
  const report = createDmarcReport({
    extraContactInfo: `java${'script'}:window.__xss_poc=1`
  });

  t.is(
    findUnsafeDmarcContent(report),
    'report.report_metadata.extra_contact_info'
  );
  t.deepEqual(validateReportContent(report, 1024), {
    valid: false,
    reason:
      'Unsafe markup or executable URI in report.report_metadata.extra_contact_info'
  });
});
