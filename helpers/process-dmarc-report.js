/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const ms = require('ms');
const revHash = require('rev-hash');
const { simpleParser } = require('mailparser');

const Domains = require('#models/domains');
const Logs = require('#models/logs');
const config = require('#config');
const isDenylisted = require('#helpers/is-denylisted');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');
const {
  parseDmarcReport,
  isDmarcReportEmail
} = require('#helpers/parse-dmarc-report');

// Rate limits for DMARC reports
const DMARC_RATE_LIMIT_PER_DOMAIN_PER_DAY = 100; // Max 100 reports per domain per day
const DMARC_RATE_LIMIT_PER_SENDER_PER_HOUR = 50; // Max 50 reports per sender IP per hour
const DMARC_MAX_REPORT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB max report size
const DMARC_MAX_RECORDS_PER_REPORT = 10000; // Max records in a single report

/**
 * Check if sender is a truth source (trusted sender)
 * @param {string} fromDomain - The domain from the From header or envelope
 * @returns {boolean}
 */
function isTruthSource(fromDomain) {
  if (!fromDomain) return false;
  const domain = fromDomain.toLowerCase();
  const rootDomain = parseRootDomain(domain);

  // Check if domain or root domain is in truth sources
  return config.truthSources.has(domain) || config.truthSources.has(rootDomain);
}

/**
 * Generate a unique hash for a DMARC report to prevent duplicates
 * @param {Object} report - Parsed DMARC report
 * @param {string} domainId - Domain ID
 * @returns {string}
 */
function generateReportHash(report, domainId) {
  const hashData = [
    domainId,
    report.report_metadata?.org_name || '',
    report.report_metadata?.report_id || '',
    report.report_metadata?.date_range?.begin || '',
    report.report_metadata?.date_range?.end || ''
  ].join(':');
  return `dmarc:${revHash(hashData)}`;
}

/**
 * Check rate limits for DMARC reports using Redis
 * @param {Object} client - Redis client
 * @param {string} domainId - Domain ID
 * @param {string} senderIp - Sender IP address
 * @param {boolean} isTrustedSender - Whether sender is a truth source
 * @returns {Promise<{allowed: boolean, reason?: string}>}
 */
async function checkRateLimits(client, domainId, senderIp, isTrustedSender) {
  const now = new Date();
  const dateKey = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const hourKey = `${dateKey}:${now.getUTCHours()}`;

  // Check per-domain daily limit
  const domainKey = `dmarc_rate:domain:${domainId}:${dateKey}`;
  const domainCount = await client.incr(domainKey);
  if (domainCount === 1) {
    await client.pexpire(domainKey, ms('25h')); // Expire after 25 hours
  }

  // Truth sources get higher limits
  const domainLimit = isTrustedSender
    ? DMARC_RATE_LIMIT_PER_DOMAIN_PER_DAY * 2
    : DMARC_RATE_LIMIT_PER_DOMAIN_PER_DAY;

  if (domainCount > domainLimit) {
    // Decrement since we're rejecting
    await client.decr(domainKey);
    return {
      allowed: false,
      reason: `Rate limit exceeded: ${domainCount} reports for domain today (limit: ${domainLimit})`
    };
  }

  // Check per-sender hourly limit (skip for truth sources)
  if (!isTrustedSender && senderIp) {
    const senderKey = `dmarc_rate:sender:${senderIp}:${hourKey}`;
    const senderCount = await client.incr(senderKey);
    if (senderCount === 1) {
      await client.pexpire(senderKey, ms('2h')); // Expire after 2 hours
    }

    if (senderCount > DMARC_RATE_LIMIT_PER_SENDER_PER_HOUR) {
      // Decrement both counters since we're rejecting
      await client.decr(senderKey);
      await client.decr(domainKey);
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${senderCount} reports from sender this hour (limit: ${DMARC_RATE_LIMIT_PER_SENDER_PER_HOUR})`
      };
    }
  }

  return { allowed: true };
}

/**
 * Validate DMARC report content for suspicious patterns
 * @param {Object} report - Parsed DMARC report
 * @param {number} rawSize - Size of raw email in bytes
 * @returns {{valid: boolean, reason?: string}}
 */
function validateReportContent(report, rawSize) {
  // Check report size
  if (rawSize > DMARC_MAX_REPORT_SIZE_BYTES) {
    return {
      valid: false,
      reason: `Report too large: ${rawSize} bytes (max: ${DMARC_MAX_REPORT_SIZE_BYTES})`
    };
  }

  // Check number of records
  if (report.records && report.records.length > DMARC_MAX_RECORDS_PER_REPORT) {
    return {
      valid: false,
      reason: `Too many records: ${report.records.length} (max: ${DMARC_MAX_RECORDS_PER_REPORT})`
    };
  }

  // Validate report has required metadata
  if (!report.report_metadata) {
    return {
      valid: false,
      reason: 'Missing report metadata'
    };
  }

  // Validate date range is reasonable (not more than 30 days in the past or future)
  if (report.report_metadata.date_range) {
    const now = Date.now();
    const maxAge = ms('30d');
    const maxFuture = ms('1d');

    if (report.report_metadata.date_range.begin) {
      const beginTime = new Date(
        report.report_metadata.date_range.begin
      ).getTime();
      if (now - beginTime > maxAge) {
        return {
          valid: false,
          reason: 'Report date range too old (> 30 days)'
        };
      }

      if (beginTime - now > maxFuture) {
        return {
          valid: false,
          reason: 'Report date range in the future'
        };
      }
    }
  }

  // Validate summary totals are reasonable
  if (report.summary) {
    const { total_messages } = report.summary;
    // Suspicious if claiming millions of messages in a single report
    if (total_messages > 10_000_000) {
      return {
        valid: false,
        reason: `Suspicious message count: ${total_messages}`
      };
    }
  }

  return { valid: true };
}

/**
 * Process incoming email to check if it's a DMARC report and log it
 * @param {Object} session - SMTP session object
 * @param {Buffer} raw - Raw email content
 * @param {Object} resolver - DNS resolver
 * @param {Object} client - Redis client for rate limiting
 * @returns {Promise<Object|null>} Processed DMARC report data or null
 */
async function processDmarcReport(session, raw, resolver, client) {
  try {
    // Check if any recipient is a DMARC report address
    if (
      !session?.envelope?.rcptTo ||
      !Array.isArray(session.envelope.rcptTo) ||
      session.envelope.rcptTo.length === 0
    ) {
      return null;
    }

    let dmarcRecipient = null;
    let domainId = null;

    for (const rcpt of session.envelope.rcptTo) {
      if (!rcpt?.address) continue;

      const result = isDmarcReportEmail(rcpt.address, config.webHost);
      if (result) {
        dmarcRecipient = rcpt.address;
        domainId = result.domainId;
        break;
      }
    }

    if (!dmarcRecipient || !domainId) {
      return null;
    }

    // Validate the domain ID
    if (!mongoose.isValidObjectId(domainId)) {
      logger.debug('Invalid domain ID in DMARC report address', {
        dmarcRecipient,
        domainId
      });
      return null;
    }

    // Look up the domain
    const domain = await Domains.findById(domainId)
      .select('_id name plan members')
      .lean()
      .exec();

    if (!domain) {
      logger.debug('Domain not found for DMARC report', {
        dmarcRecipient,
        domainId
      });
      return null;
    }

    // Only process for paid plans
    if (domain.plan === 'free') {
      logger.debug('DMARC reports not available for free plan', {
        domainId,
        domainName: domain.name
      });
      return null;
    }

    // Get sender information for rate limiting and denylist checking
    const senderIp = session?.remoteAddress || session?.hostNameAppearsAs;
    const mailFrom = session?.envelope?.mailFrom?.address || '';
    const mailFromDomain = mailFrom.split('@')[1] || '';
    const isTrustedSender = isTruthSource(mailFromDomain);

    // Check if sender is denylisted (if Redis client is available)
    if (client && !isTrustedSender) {
      try {
        // Check sender IP, mail from address, and mail from domain against denylist
        const valuesToCheck = [senderIp, mailFrom, mailFromDomain].filter(
          Boolean
        );
        if (valuesToCheck.length > 0) {
          await isDenylisted(valuesToCheck, client, resolver);
        }
      } catch (err) {
        // If denylisted, reject the report
        if (err.name === 'DenylistError') {
          logger.warn('DMARC report sender is denylisted', {
            domainId,
            domainName: domain.name,
            senderIp,
            mailFrom,
            denylistValue: err.value
          });
          return null;
        }

        // Re-throw other errors
        throw err;
      }
    }

    // Check rate limits (if Redis client is available)
    if (client) {
      const rateCheck = await checkRateLimits(
        client,
        domainId,
        senderIp,
        isTrustedSender
      );
      if (!rateCheck.allowed) {
        logger.warn('DMARC report rate limited', {
          domainId,
          domainName: domain.name,
          senderIp,
          mailFrom,
          reason: rateCheck.reason
        });
        return null;
      }
    }

    // Parse the email to extract attachments
    const parsed = await simpleParser(raw, {
      skipHtmlToText: true,
      skipTextToHtml: true,
      skipImageLinks: true
    });

    if (!parsed.attachments || parsed.attachments.length === 0) {
      logger.debug('No attachments found in DMARC report email', {
        domainId,
        domainName: domain.name
      });
      return null;
    }

    // Try to parse DMARC report from attachments
    let dmarcReport = null;
    for (const attachment of parsed.attachments) {
      dmarcReport = await parseDmarcReport(attachment);
      if (dmarcReport) break;
    }

    if (!dmarcReport) {
      logger.debug('Failed to parse DMARC report from attachments', {
        domainId,
        domainName: domain.name,
        attachmentCount: parsed.attachments.length
      });
      return null;
    }

    // Validate report content
    const validation = validateReportContent(dmarcReport, raw.length);
    if (!validation.valid) {
      logger.warn('DMARC report validation failed', {
        domainId,
        domainName: domain.name,
        reason: validation.reason,
        senderIp,
        mailFrom
      });
      return null;
    }

    // Generate report hash to check for duplicates
    const reportHash = generateReportHash(dmarcReport, domainId);

    // Check if we've already processed this report
    const existingReport = await Logs.findOne({
      is_dmarc_report: true,
      hash: reportHash
    })
      .select('_id')
      .lean()
      .exec();

    if (existingReport) {
      logger.debug('Duplicate DMARC report detected', {
        domainId,
        domainName: domain.name,
        reportId: dmarcReport.report_metadata?.report_id,
        hash: reportHash
      });
      return null;
    }

    // Get domain owner for the log
    const domainOwner =
      domain.members?.find((m) => m.group === 'admin')?.user || null;

    // Build the log entry
    const logEntry = new Logs({
      hash: reportHash,
      user: domainOwner,
      domains: [domain._id],
      is_empty_domains: false,
      is_restricted: false,
      is_dmarc_report: true,
      message: 'dmarc_report',
      meta: {
        dmarc_report: {
          report_metadata: dmarcReport.report_metadata,
          policy_published: dmarcReport.policy_published,
          summary: dmarcReport.summary,
          // Limit stored records to prevent bloat
          records: dmarcReport.records?.slice(0, 1000) || [],
          sender_ip: senderIp,
          sender_domain: mailFromDomain,
          is_truth_source: isTrustedSender
        }
      }
    });

    // Set resolver for validation
    logEntry.resolver = resolver;
    logEntry.skip_duplicate_check = true;

    await logEntry.save();

    logger.info('DMARC report processed successfully', {
      domainId: domain._id,
      domainName: domain.name,
      reportId: dmarcReport.report_metadata?.report_id,
      orgName: dmarcReport.report_metadata?.org_name,
      totalMessages: dmarcReport.summary?.total_messages,
      senderIp,
      isTruthSource: isTrustedSender
    });

    return {
      domain_id: domain._id,
      domain_name: domain.name,
      report_metadata: dmarcReport.report_metadata,
      policy_published: dmarcReport.policy_published,
      summary: dmarcReport.summary
    };
  } catch (err) {
    logger.error('Error processing DMARC report', { err });
    return null;
  }
}

/**
 * Check if session contains a DMARC report recipient
 * @param {Object} session - SMTP session object
 * @returns {boolean} True if session has DMARC report recipient
 */
function hasDmarcReportRecipient(session) {
  if (
    !session?.envelope?.rcptTo ||
    !Array.isArray(session.envelope.rcptTo) ||
    session.envelope.rcptTo.length === 0
  ) {
    return false;
  }

  for (const rcpt of session.envelope.rcptTo) {
    if (!rcpt?.address) continue;

    const result = isDmarcReportEmail(rcpt.address, config.webHost);
    if (result) {
      return true;
    }
  }

  return false;
}

module.exports = {
  processDmarcReport,
  hasDmarcReportRecipient,
  // Export for testing
  isTruthSource,
  validateReportContent,
  DMARC_RATE_LIMIT_PER_DOMAIN_PER_DAY,
  DMARC_RATE_LIMIT_PER_SENDER_PER_HOUR,
  DMARC_MAX_REPORT_SIZE_BYTES,
  DMARC_MAX_RECORDS_PER_REPORT
};
