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
async function extractGzip(buffer) {
  return new Promise((resolve) => {
    zlib.gunzip(buffer, (err, result) => {
      if (err) {
        logger.debug('Failed to decompress gzip', { err });
        resolve(null);
      } else {
        resolve(result.toString('utf8'));
      }
    });
  });
}

/**
 * Extract XML content from a ZIP archive
 * @param {Buffer} buffer - ZIP archive buffer
 * @returns {string|null} XML content or null
 */
function extractZip(buffer) {
  try {
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    // Find the first XML file in the archive
    for (const entry of entries) {
      if (entry.entryName.toLowerCase().endsWith('.xml')) {
        return entry.getData().toString('utf8');
      }
    }

    // If no XML found, try the first entry
    if (entries.length > 0) {
      return entries[0].getData().toString('utf8');
    }

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
