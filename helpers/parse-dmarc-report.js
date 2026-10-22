/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

const AdmZip = require('adm-zip');
const isSANB = require('is-string-and-not-blank');
const { XMLParser } = require('fast-xml-parser');

const logger = require('#helpers/logger');
const { isSafeXml } = require('#helpers/assert-safe-xml');
const {
  DMARC_MAX_REPORT_SIZE_BYTES,
  DMARC_MAX_RECORDS_PER_REPORT
} = require('#helpers/validate-dmarc-report');

//
// Pre-parse structural bounds.
//
// `xmlParser.parse()` allocates per token, so its cost is linear in the number
// of tags and attributes -- measured at ~0.5 s CPU and ~70 MB per MB of input
// for an attribute flood on this version of fast-xml-parser. DMARC report
// addresses are published in DNS (rua=), so anyone can send a report, and the
// gzip/zip path admits up to MAX_DECOMPRESSED_SIZE (25 MB) of XML. Until now
// the 10 MB report cap was applied to the raw *email* size and only *after*
// parsing, so a ~250 KB gzip inflating to a 25 MB flood was parsed in full
// before any check ran.
//
// A real report at DMARC_MAX_RECORDS_PER_REPORT records has on the order of
// 30 opening tags per record and almost no attributes (the schema carries its
// data in elements). Both ceilings below leave several times that headroom
// and are checked by a single early-exiting scan before the parser is given
// the string.
//
const DMARC_MAX_XML_TAGS = DMARC_MAX_RECORDS_PER_REPORT * 60; // 600k
const DMARC_MAX_XML_ATTRIBUTES = 2000;
const XML_TOKEN_REGEX = /<[A-Za-z]|=\s*["']/g;

function exceedsStructuralLimits(xmlString) {
  let tags = 0;
  let attributes = 0;
  XML_TOKEN_REGEX.lastIndex = 0;
  let match;
  while ((match = XML_TOKEN_REGEX.exec(xmlString)) !== null) {
    if (match[0].codePointAt(0) === 60 /* < */) {
      if (++tags > DMARC_MAX_XML_TAGS) return 'tags';
    } else if (++attributes > DMARC_MAX_XML_ATTRIBUTES) return 'attributes';
  }

  return false;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  parseTagValue: true,
  trimValues: true
});

/**
 * Parse DMARC aggregate report from XML content
 * @param {string|Buffer} xmlContent - The XML content of the DMARC report
 * @returns {Object|null} Parsed DMARC report data or null if parsing fails
 */
function parseXmlReport(xmlContent) {
  try {
    const xmlString =
      typeof xmlContent === 'string' ? xmlContent : xmlContent.toString('utf8');

    // Defense-in-depth: reject XML with DOCTYPE or ENTITY declarations
    // to prevent potential XXE attacks from malicious DMARC reports.
    // Case-insensitive shared guard (a lowercase <!doctype bypassed the
    // previous substring check, which only matched uppercase).
    if (!isSafeXml(xmlString)) {
      logger.warn('DMARC report rejected: contains DOCTYPE or ENTITY');
      return null;
    }

    // Enforce the report size cap on the decompressed XML *before* parsing
    // (previously it was checked against the raw email size, after parsing).
    const xmlBytes = Buffer.byteLength(xmlString, 'utf8');
    if (xmlBytes > DMARC_MAX_REPORT_SIZE_BYTES) {
      logger.warn('DMARC report rejected: XML exceeds size cap', {
        xmlBytes,
        maxBytes: DMARC_MAX_REPORT_SIZE_BYTES
      });
      return null;
    }

    const exceeded = exceedsStructuralLimits(xmlString);
    if (exceeded) {
      logger.warn('DMARC report rejected: exceeds structural limits', {
        exceeded,
        xmlBytes
      });
      return null;
    }

    const parsed = xmlParser.parse(xmlString);

    // Handle both 'feedback' (standard) and root element variations
    const feedback = parsed.feedback || parsed;

    if (!feedback) {
      logger.debug('No feedback element found in DMARC report');
      return null;
    }

    // Extract report metadata
    const reportMetadata = feedback.report_metadata || {};
    const policyPublished = feedback.policy_published || {};

    // Normalize record to array
    let records = feedback.record || [];
    if (!Array.isArray(records)) {
      records = [records];
    }

    // Parse each record
    const parsedRecords = records
      .map((record) => {
        if (!record) return null;

        const row = record.row || {};
        const identifiers = record.identifiers || {};
        const authResults = record.auth_results || {};

        // Parse policy evaluated
        const policyEvaluated = row.policy_evaluated || {};

        // Parse SPF results (can be array or single object)
        let spfResults = authResults.spf || [];
        if (!Array.isArray(spfResults)) {
          spfResults = [spfResults];
        }

        // Parse DKIM results (can be array or single object)
        let dkimResults = authResults.dkim || [];
        if (!Array.isArray(dkimResults)) {
          dkimResults = [dkimResults];
        }

        return {
          source_ip: row.source_ip || '',
          count: Number.parseInt(row.count, 10) || 1,
          policy_evaluated: {
            disposition: policyEvaluated.disposition || 'none',
            dkim: policyEvaluated.dkim || 'fail',
            spf: policyEvaluated.spf || 'fail'
          },
          identifiers: {
            header_from: identifiers.header_from || '',
            envelope_from: identifiers.envelope_from || '',
            envelope_to: identifiers.envelope_to || ''
          },
          auth_results: {
            spf: spfResults.filter(Boolean).map((s) => ({
              domain: s.domain || '',
              scope: s.scope || 'mfrom',
              result: s.result || 'none'
            })),
            dkim: dkimResults.filter(Boolean).map((d) => ({
              domain: d.domain || '',
              selector: d.selector || '',
              result: d.result || 'none'
            }))
          }
        };
      })
      .filter(Boolean);

    // Calculate summary statistics
    let totalMessages = 0;
    let spfAligned = 0;
    let dkimAligned = 0;
    let accepted = 0;
    let quarantined = 0;
    let rejected = 0;

    for (const record of parsedRecords) {
      const { count } = record;
      totalMessages += count;

      if (record.policy_evaluated.spf === 'pass') {
        spfAligned += count;
      }

      if (record.policy_evaluated.dkim === 'pass') {
        dkimAligned += count;
      }

      switch (record.policy_evaluated.disposition) {
        case 'none': {
          accepted += count;
          break;
        }

        case 'quarantine': {
          quarantined += count;
          break;
        }

        case 'reject': {
          rejected += count;
          break;
        }

        default: {
          accepted += count;
        }
      }
    }

    return {
      report_metadata: {
        org_name: reportMetadata.org_name || '',
        email: reportMetadata.email || '',
        extra_contact_info: reportMetadata.extra_contact_info || '',
        report_id: reportMetadata.report_id || '',
        date_range: {
          begin: reportMetadata.date_range?.begin
            ? new Date(
                Number.parseInt(reportMetadata.date_range.begin, 10) * 1000
              )
            : null,
          end: reportMetadata.date_range?.end
            ? new Date(
                Number.parseInt(reportMetadata.date_range.end, 10) * 1000
              )
            : null
        }
      },
      policy_published: {
        domain: policyPublished.domain || '',
        adkim: policyPublished.adkim || 'r',
        aspf: policyPublished.aspf || 'r',
        p: policyPublished.p || 'none',
        sp: policyPublished.sp || policyPublished.p || 'none',
        pct: Number.parseInt(policyPublished.pct, 10) || 100,
        fo: policyPublished.fo || '0'
      },
      records: parsedRecords,
      summary: {
        total_messages: totalMessages,
        spf_aligned: spfAligned,
        dkim_aligned: dkimAligned,
        spf_aligned_pct:
          totalMessages > 0
            ? Math.round((spfAligned / totalMessages) * 1000) / 10
            : 0,
        dkim_aligned_pct:
          totalMessages > 0
            ? Math.round((dkimAligned / totalMessages) * 1000) / 10
            : 0,
        accepted,
        quarantined,
        rejected,
        pass_rate:
          totalMessages > 0
            ? Math.round((accepted / totalMessages) * 1000) / 10
            : 0
      }
    };
  } catch (err) {
    logger.debug('Failed to parse DMARC XML report', { err });
    return null;
  }
}

/**
 * Extract XML content from a gzip compressed buffer
 * @param {Buffer} buffer - Gzip compressed buffer
 * @returns {Promise<string|null>} Decompressed XML string or null
 */
// Maximum decompressed size for DMARC reports (25 MB)
// A legitimate DMARC aggregate report XML should never exceed this.
// This prevents decompression bombs (e.g. a small gzip that expands to GB).
const MAX_DECOMPRESSED_SIZE = 25 * 1024 * 1024;

async function extractGzip(buffer) {
  return new Promise((resolve) => {
    zlib.gunzip(
      buffer,
      { maxOutputLength: MAX_DECOMPRESSED_SIZE },
      (err, result) => {
        if (err) {
          logger.debug('Failed to decompress gzip', { err });
          resolve(null);
        } else {
          resolve(result.toString('utf8'));
        }
      }
    );
  });
}

// ZIP compression methods (APPNOTE 4.4.5)
const ZIP_METHOD_STORED = 0;
const ZIP_METHOD_DEFLATED = 8;

/**
 * Decompress a single ZIP entry with a hard output cap
 *
 * NOTE: the declared uncompressed size in the ZIP headers is attacker
 *       controlled; adm-zip only bounds inflation when that size is > 0,
 *       so an entry declaring 0 would inflate without limit (e.g. ~300 MB
 *       from a ~300 KB archive). We inflate the raw data ourselves and let
 *       zlib enforce the cap regardless of what the headers claim.
 *
 * @param {Object} entry - adm-zip entry
 * @returns {string|null} entry content or null if too large/unsupported
 */
function readZipEntry(entry) {
  const log = { entryName: entry.entryName, maxSize: MAX_DECOMPRESSED_SIZE };

  // cheap early rejection when the declared size is already too large
  if (entry.header.size > MAX_DECOMPRESSED_SIZE) {
    logger.debug('ZIP entry exceeds maximum decompressed size', {
      ...log,
      size: entry.header.size
    });
    return null;
  }

  if (entry.header.encrypted) {
    logger.debug('ZIP entry is encrypted', log);
    return null;
  }

  const compressed = entry.getCompressedData();

  if (entry.header.method === ZIP_METHOD_STORED) {
    if (compressed.length > MAX_DECOMPRESSED_SIZE) {
      logger.debug('ZIP entry exceeds maximum decompressed size', {
        ...log,
        size: compressed.length
      });
      return null;
    }

    return compressed.toString('utf8');
  }

  if (entry.header.method !== ZIP_METHOD_DEFLATED) {
    logger.debug('ZIP entry uses unsupported compression method', {
      ...log,
      method: entry.header.method
    });
    return null;
  }

  try {
    return zlib
      .inflateRawSync(compressed, { maxOutputLength: MAX_DECOMPRESSED_SIZE })
      .toString('utf8');
  } catch (err) {
    // ERR_BUFFER_TOO_LARGE when the cap is hit, or a zlib error
    logger.debug('Failed to decompress ZIP entry', { ...log, err });
    return null;
  }
}

// (a DMARC report ZIP holds one entry with a short flat name, e.g.
//  "example.com!example.org!1700000000!1700086400.xml")
const MAX_ZIP_ENTRIES = 16;
const MAX_ZIP_NAME_LENGTH = 255;
const MAX_ZIP_EXTRA_LENGTH = 1024;

// (end of central directory, central directory header, ZIP64 locator)
const ZIP_EOCD_SIGNATURE = 0x06_05_4b_50;
const ZIP_CENTRAL_SIGNATURE = 0x02_01_4b_50;
const ZIP64_LOCATOR_SIGNATURE = 0x07_06_4b_50;
const ZIP64_RECORD_SIGNATURE = 0x06_06_4b_50;

//
// The end of central directory record adm-zip 0.6.0 reads (`readMainHeader`
// in its zipFile.js), or -1 when it would read a ZIP64 record instead (or
// none): it searches back from the end of the archive, and after each end
// record it finds it searches 20 bytes further back, for an earlier end
// record (which it then reads) or a ZIP64 signature.
//
function findEndOfCentralDirectory(buffer) {
  if (buffer.length < 22) return -1;
  let i = buffer.length - 22;
  let last = Math.max(0, i - 0xff_ff);
  let eocd = -1;
  for (; i >= last && i >= 0; i--) {
    if (buffer[i] !== 0x50) continue;
    const signature = buffer.readUInt32LE(i);
    if (signature === ZIP_EOCD_SIGNATURE) {
      eocd = i;
      last = i - 20;
    } else if (
      signature === ZIP64_LOCATOR_SIGNATURE ||
      signature === ZIP64_RECORD_SIGNATURE
    ) {
      return -1;
    }
  }

  return eocd;
}

/**
 * Check a ZIP archive's central directory before adm-zip reads it
 *
 * NOTE: the archive comes from whoever sent the email, and adm-zip builds
 *       every parent path of every entry name when it lists the entries, at
 *       a cost in time and memory that grows with the square of the name's
 *       length (so one long name is enough to hold the process): only an
 *       archive with a few entries with short names, as DMARC reports have,
 *       is read.
 *
 * @param {Buffer} buffer - ZIP archive buffer
 * @returns {boolean} whether adm-zip may read it
 */
function isReadableZip(buffer) {
  // (the record adm-zip reads, and no ZIP64; the record and its comment end
  //  the archive, as they do in every archive a report generator makes)
  const eocd = findEndOfCentralDirectory(buffer);
  if (
    eocd === -1 ||
    eocd + 22 + buffer.readUInt16LE(eocd + 20) !== buffer.length
  )
    return false;

  const entries = buffer.readUInt16LE(eocd + 10);
  const size = buffer.readUInt32LE(eocd + 12);
  const offset = buffer.readUInt32LE(eocd + 16);
  if (
    entries === 0 ||
    entries > MAX_ZIP_ENTRIES ||
    offset + size > eocd ||
    buffer.readUInt16LE(eocd + 8) !== entries
  )
    return false;

  let position = offset;
  for (let i = 0; i < entries; i++) {
    if (
      position + 46 > offset + size ||
      buffer.readUInt32LE(position) !== ZIP_CENTRAL_SIGNATURE
    )
      return false;
    const nameLength = buffer.readUInt16LE(position + 28);
    const extraLength =
      buffer.readUInt16LE(position + 30) + buffer.readUInt16LE(position + 32);
    if (nameLength > MAX_ZIP_NAME_LENGTH || extraLength > MAX_ZIP_EXTRA_LENGTH)
      return false;
    position += 46 + nameLength + extraLength;
  }

  return position <= offset + size;
}

/**
 * Extract XML content from a ZIP archive
 * @param {Buffer} buffer - ZIP archive buffer
 * @returns {string|null} XML content or null
 */
function extractZip(buffer) {
  try {
    if (!isReadableZip(buffer)) {
      logger.debug('ZIP archive is not one a DMARC report would be');
      return null;
    }

    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    // Find the first XML file in the archive
    for (const entry of entries) {
      if (entry.entryName.toLowerCase().endsWith('.xml'))
        return readZipEntry(entry);
    }

    // If no XML found, try the first entry
    if (entries.length > 0) return readZipEntry(entries[0]);

    return null;
  } catch (err) {
    logger.debug('Failed to extract ZIP archive', { err });
    return null;
  }
}

/**
 * Parse DMARC report from email attachment
 * @param {Object} attachment - Email attachment object with content and contentType
 * @returns {Promise<Object|null>} Parsed DMARC report or null
 */
async function parseDmarcReport(attachment) {
  if (!attachment || !attachment.content) {
    return null;
  }

  const content = Buffer.isBuffer(attachment.content)
    ? attachment.content
    : Buffer.from(attachment.content, 'base64');

  const contentType = (attachment.contentType || '').toLowerCase();
  const filename = (attachment.filename || '').toLowerCase();

  let xmlContent = null;

  // Determine the type of attachment and extract XML
  if (
    contentType.includes('application/zip') ||
    contentType.includes('application/x-zip') ||
    filename.endsWith('.zip')
  ) {
    xmlContent = extractZip(content);
  } else if (
    contentType.includes('application/gzip') ||
    contentType.includes('application/x-gzip') ||
    filename.endsWith('.gz') ||
    filename.endsWith('.gzip')
  ) {
    xmlContent = await extractGzip(content);
  } else if (
    contentType.includes('text/xml') ||
    contentType.includes('application/xml') ||
    filename.endsWith('.xml')
  ) {
    xmlContent = content.toString('utf8');
    // Try to detect format by content
    // ZIP files start with PK (0x504B)
  } else if (content[0] === 0x50 && content[1] === 0x4b) {
    xmlContent = extractZip(content);
    // GZIP files start with 0x1F 0x8B
  } else if (content[0] === 0x1f && content[1] === 0x8b) {
    xmlContent = await extractGzip(content);
    // Try as plain XML
  } else if (content.toString('utf8', 0, 100).includes('<?xml')) {
    xmlContent = content.toString('utf8');
  }

  if (!isSANB(xmlContent)) {
    return null;
  }

  return parseXmlReport(xmlContent);
}

/**
 * Check if an email is a DMARC report based on recipient address
 * @param {string} address - Email recipient address
 * @param {string} webHost - The web host domain (e.g., forwardemail.net)
 * @returns {Object|null} Object with domainId if DMARC report, null otherwise
 */
function isDmarcReportEmail(address, webHost) {
  if (!isSANB(address) || !isSANB(webHost)) {
    return null;
  }

  const lowerAddress = address.toLowerCase();
  const lowerWebHost = webHost.toLowerCase();

  // Check if address matches dmarc-{domainId}@{webHost}
  const regex = new RegExp(
    `^dmarc-([a-f0-9]+)@${lowerWebHost.replace(/\./g, '\\.')}$`,
    'i'
  );
  const match = lowerAddress.match(regex);

  if (match && match[1]) {
    return { domainId: match[1] };
  }

  return null;
}

module.exports = {
  parseDmarcReport,
  parseXmlReport,
  isDmarcReportEmail
};
