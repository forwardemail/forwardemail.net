/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

const AdmZip = require('adm-zip');
const test = require('ava');

const {
  parseDmarcReport,
  parseXmlReport
} = require('#helpers/parse-dmarc-report');
const { assertSafeXml, isSafeXml } = require('#helpers/assert-safe-xml');
const {
  DMARC_MAX_REPORT_SIZE_BYTES,
  DMARC_MAX_RECORDS_PER_REPORT
} = require('#helpers/validate-dmarc-report');

function record(i) {
  return `
  <record>
    <row>
      <source_ip>203.0.113.${i % 250}</source_ip>
      <count>${(i % 7) + 1}</count>
      <policy_evaluated>
        <disposition>none</disposition>
        <dkim>pass</dkim>
        <spf>pass</spf>
      </policy_evaluated>
    </row>
    <identifiers>
      <header_from>example.com</header_from>
      <envelope_from>example.com</envelope_from>
    </identifiers>
    <auth_results>
      <dkim>
        <domain>example.com</domain>
        <selector>fe-${i}</selector>
        <result>pass</result>
      </dkim>
      <spf>
        <domain>example.com</domain>
        <scope>mfrom</scope>
        <result>pass</result>
      </spf>
    </auth_results>
  </record>`;
}

function report(recordCount, extra = '') {
  let records = '';
  for (let i = 0; i < recordCount; i++) records += record(i);
  return `<?xml version="1.0" encoding="UTF-8"?>
<feedback>
  <report_metadata>
    <org_name>Example Reporter</org_name>
    <email>noreply-dmarc@reporter.example.com</email>
    <extra_contact_info>https://reporter.example.com/dmarc?ref="abc"</extra_contact_info>
    <report_id>${Date.now()}</report_id>
    <date_range>
      <begin>1700000000</begin>
      <end>1700086400</end>
    </date_range>
  </report_metadata>
  <policy_published>
    <domain>example.com</domain>
    <adkim>r</adkim>
    <aspf>r</aspf>
    <p>reject</p>
    <sp>reject</sp>
    <pct>100</pct>
    <fo>0</fo>
  </policy_published>${records}${extra}
</feedback>`;
}

test('parses an ordinary aggregate report', (t) => {
  const parsed = parseXmlReport(report(3));
  t.truthy(parsed);
  t.is(parsed.report_metadata.org_name, 'Example Reporter');
  t.is(parsed.policy_published.p, 'reject');
  t.is(parsed.records.length, 3);
  t.is(parsed.records[0].source_ip, '203.0.113.0');
  t.is(parsed.summary.total_messages, 1 + 2 + 3);
  t.is(parsed.summary.pass_rate, 100);
});

test('parses a report at the maximum record count (no false positive from the structural scan)', (t) => {
  const xml = report(DMARC_MAX_RECORDS_PER_REPORT);
  t.true(Buffer.byteLength(xml, 'utf8') < DMARC_MAX_REPORT_SIZE_BYTES);
  const parsed = parseXmlReport(xml);
  t.truthy(parsed);
  t.is(parsed.records.length, DMARC_MAX_RECORDS_PER_REPORT);
});

test('rejects an attribute flood before it reaches the XML parser', (t) => {
  // one element carrying tens of thousands of attributes: cheap to send,
  // expensive for the parser (per-attribute allocation) -- and not DMARC
  let attributes = '';
  for (let i = 0; i < 50000; i++) attributes += ` a${i}="${i}"`;
  const xml = report(1, `<flood${attributes}/>`);
  t.is(parseXmlReport(xml), null);
});

test('rejects a tag flood before it reaches the XML parser', (t) => {
  let tags = '';
  for (let i = 0; i < 700000; i++) tags += '<x/>';
  const xml = report(1, tags);
  t.is(parseXmlReport(xml), null);
});

test('rejects decompressed XML larger than the report size cap', (t) => {
  // more than DMARC_MAX_REPORT_SIZE_BYTES of harmless text inside one element
  const filler = 'A'.repeat(DMARC_MAX_REPORT_SIZE_BYTES + 1024);
  const xml = report(1, `<extra>${filler}</extra>`);
  t.true(Buffer.byteLength(xml, 'utf8') > DMARC_MAX_REPORT_SIZE_BYTES);
  t.is(parseXmlReport(xml), null);
});

test('still rejects DOCTYPE/ENTITY declarations', (t) => {
  const xml = `<?xml version="1.0"?><!DOCTYPE feedback [<!ENTITY x "y">]>${report(
    1
  ).replace('<?xml version="1.0" encoding="UTF-8"?>', '')}`;
  t.is(parseXmlReport(xml), null);
});

test('rejects a DOCTYPE hidden between overlapping comment and CDATA markers', (t) => {
  const body = report(1).replace('<?xml version="1.0" encoding="UTF-8"?>', '');
  const payload = `<?xml version="1.0"?><!-- <![CDATA[ --><!DOCTYPE feedback [<!ENTITY a "AAAA">]><!-- ]]> -->${body.replace(
    '<org_name>Example Reporter</org_name>',
    '<org_name>&a;</org_name>'
  )}`;
  t.false(isSafeXml(payload));
  t.throws(() => assertSafeXml(payload), { message: /not allowed/ });
  t.is(parseXmlReport(payload), null);

  // same trick with a lowercase keyword and the markers the other way round
  t.false(
    isSafeXml(
      `<a><![CDATA[ <!-- ]]><!doctype a [<!entity b "c">]><![CDATA[ --> ]]></a>`
    )
  );
});

test('still accepts ordinary comments and CDATA sections', (t) => {
  const xml = report(1).replace(
    '<org_name>Example Reporter</org_name>',
    '<!-- reporter <!-- name --><org_name><![CDATA[Example <b>Reporter</b> <!--x-->]]></org_name>'
  );
  t.true(isSafeXml(xml));
  const parsed = parseXmlReport(xml);
  t.truthy(parsed);
});

test('applies the size cap to the decompressed content of a gzip attachment', async (t) => {
  // a small gzip attachment that inflates past the report size cap
  const filler = 'A'.repeat(DMARC_MAX_REPORT_SIZE_BYTES + 1024);
  const xml = report(1, `<extra>${filler}</extra>`);
  const content = zlib.gzipSync(Buffer.from(xml));
  t.true(content.length < 64 * 1024);
  t.is(
    await parseDmarcReport({
      content,
      contentType: 'application/gzip',
      filename: 'report.xml.gz'
    }),
    null
  );

  // and a small gzip attachment with an ordinary report still parses
  const ok = zlib.gzipSync(Buffer.from(report(2)));
  const parsed = await parseDmarcReport({
    content: ok,
    contentType: 'application/gzip',
    filename: 'report.xml.gz'
  });
  t.truthy(parsed);
  t.is(parsed.records.length, 2);
});

// build a ZIP archive with a single entry, optionally rewriting the declared
// uncompressed size in both the local and central directory headers
function zipOf(name, data, { declaredSize, stored = false } = {}) {
  const zip = new AdmZip();
  zip.addFile(name, data);
  if (stored) zip.getEntries()[0].header.method = 0;
  const buf = zip.toBuffer();
  if (typeof declaredSize === 'number') {
    const local = buf.indexOf(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
    buf.writeUInt32LE(declaredSize, local + 22);
    const central = buf.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]));
    buf.writeUInt32LE(declaredSize, central + 24);
  }

  return buf;
}

test.serial(
  'bounds inflation of a ZIP entry that declares an uncompressed size of 0',
  async (t) => {
    // ~40 MB of filler that compresses to a few dozen KB
    const bomb = Buffer.alloc(40 * 1024 * 1024, 0x41);
    const content = zipOf('report.xml', bomb, { declaredSize: 0 });
    t.true(content.length < 256 * 1024);

    // observe every raw inflate so we can tell how much was decompressed
    const { inflateRawSync } = zlib;
    let largest = 0;
    zlib.inflateRawSync = function (...args) {
      const out = Reflect.apply(inflateRawSync, this, args);
      largest = Math.max(largest, out.length);
      return out;
    };

    let parsed;
    try {
      parsed = await parseDmarcReport({
        content,
        contentType: 'application/zip',
        filename: 'report.zip'
      });
    } finally {
      zlib.inflateRawSync = inflateRawSync;
    }

    t.is(parsed, null);
    // the 25 MB cap must stop inflation well before the full 40 MB
    t.true(largest < bomb.length, `inflated ${largest} bytes`);
  }
);

test('parses an ordinary DMARC report inside a ZIP attachment', async (t) => {
  for (const stored of [false, true]) {
    const content = zipOf('report.xml', Buffer.from(report(2)), { stored });
    const parsed = await parseDmarcReport({
      content,
      contentType: 'application/zip',
      filename: 'report.zip'
    });
    t.truthy(parsed, `${stored ? 'stored' : 'deflated'}`);
    t.is(parsed.records.length, 2);
  }
});
