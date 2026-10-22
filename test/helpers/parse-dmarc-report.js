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

test('does not read a ZIP whose entry names would take long to list', async (t) => {
  // (a deeply nested entry name, which adm-zip lists at a cost that grows
  //  with the square of its length)
  const content = zipOf(
    `${'d/'.repeat(16_000)}report.xml`,
    Buffer.from(report(1))
  );
  const started = Date.now();
  const parsed = await parseDmarcReport({
    content,
    contentType: 'application/zip',
    filename: 'report.zip'
  });
  const took = Date.now() - started;
  t.is(parsed, null);
  t.true(took < 500, `took ${took} ms`);
});

//
// adm-zip reads the end of central directory record it finds searching back
// from the end, but then reads an earlier one 20 bytes before it, or a ZIP64
// record, if there is one: the archives below show a short entry name in
// the record at the end, while adm-zip reads the long one.
//
function endOfCentralDirectory(buffer) {
  return buffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
}

function endRecord({ size, offset }) {
  const record = Buffer.alloc(22);
  record.writeUInt32LE(0x06_05_4b_50, 0);
  record.writeUInt16LE(1, 8);
  record.writeUInt16LE(1, 10);
  record.writeUInt32LE(size, 12);
  record.writeUInt32LE(offset, 16);
  return record;
}

function disguisedZips() {
  const long = zipOf(
    `${'d/'.repeat(16_000)}report.xml`,
    Buffer.from(report(1))
  );
  const short = zipOf('report.xml', Buffer.from(report(1)));
  const shortEnd = endOfCentralDirectory(short);
  const shortDirectory = short.subarray(
    short.readUInt32LE(shortEnd + 16),
    short.readUInt32LE(shortEnd + 16) + short.readUInt32LE(shortEnd + 12)
  );
  const longEnd = endOfCentralDirectory(long);
  const head = long.subarray(0, longEnd);

  // (the archive's own record 20 bytes before another one)
  const earlier = Buffer.concat([
    head,
    shortDirectory,
    long.subarray(longEnd, longEnd + 20),
    endRecord({ size: shortDirectory.length, offset: head.length })
  ]);

  // (a ZIP64 record, with its locator signature just before the end record)
  const zip64 = Buffer.alloc(56);
  zip64.writeUInt32LE(0x06_06_4b_50, 0);
  zip64.writeBigUInt64LE(44n, 4);
  zip64.writeUInt16LE(45, 12);
  zip64.writeUInt16LE(45, 14);
  zip64.writeBigUInt64LE(1n, 24);
  zip64.writeBigUInt64LE(1n, 32);
  zip64.writeBigUInt64LE(BigInt(long.readUInt32LE(longEnd + 12)), 40);
  zip64.writeBigUInt64LE(BigInt(long.readUInt32LE(longEnd + 16)), 48);
  const locator = Buffer.from([0x50, 0x4b, 0x06, 0x07]);
  const withZip64 = Buffer.concat([
    head,
    zip64,
    shortDirectory,
    locator,
    endRecord({
      size: shortDirectory.length + locator.length,
      offset: head.length + zip64.length
    })
  ]);

  return { earlier, withZip64 };
}

test('does not read a ZIP whose long entry names are behind another record', async (t) => {
  for (const [label, content] of Object.entries(disguisedZips())) {
    // (adm-zip itself would list the long name)
    t.true(
      new AdmZip(content)
        .getEntries()
        .some((entry) => entry.entryName.length > 255),
      `${label}`
    );
    const started = Date.now();

    const parsed = await parseDmarcReport({
      content,
      contentType: 'application/zip',
      filename: 'report.zip'
    });
    const took = Date.now() - started;
    t.is(parsed, null, `${label}`);
    t.true(took < 500, `${label} took ${took} ms`);
  }
});

test('does not read a ZIP with more entries than a DMARC report has', async (t) => {
  const zip = new AdmZip();
  for (let i = 0; i < 20; i++)
    zip.addFile(`report-${i}.xml`, Buffer.from(report(1)));
  const parsed = await parseDmarcReport({
    content: zip.toBuffer(),
    contentType: 'application/zip',
    filename: 'report.zip'
  });
  t.is(parsed, null);
});

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
