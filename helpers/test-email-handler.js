/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { simpleParser } = require('mailparser');
const dns = require('node:dns').promises;
const logger = require('./logger');
const email = require('./email');
const config = require('#config');
const { TestEmailSessions } = require('#models');

// Basic DNS verification for email domains
async function verifyGeneralDNSRecords(domain, resolver = dns) {
  const results = {
    domain,
    has_spf_record: false,
    has_dkim_record: false,
    has_dmarc_record: false,
    has_mx_record: false,
    verification_details: {
      spf: null,
      dkim: null,
      dmarc: null,
      mx: null
    },
    errors: []
  };

  try {
    // Check MX records
    try {
      const mxRecords = await resolver.resolveMx(domain);
      if (mxRecords && mxRecords.length > 0) {
        results.has_mx_record = true;
        results.verification_details.mx = mxRecords;
      }
    } catch (err) {
      results.errors.push({
        type: 'MX',
        message: `MX lookup failed: ${err.message}`
      });
    }

    // Check SPF records
    try {
      const spfRecords = await resolver.resolveTxt(domain);
      const spfRecord = spfRecords.flat().find(record => 
        record.toLowerCase().includes('v=spf1')
      );
      if (spfRecord) {
        results.has_spf_record = true;
        results.verification_details.spf = { record: spfRecord };
      }
    } catch (err) {
      results.errors.push({
        type: 'SPF',
        message: `SPF lookup failed: ${err.message}`
      });
    }

    // Check DMARC records
    try {
      const dmarcRecords = await resolver.resolveTxt(`_dmarc.${domain}`);
      const dmarcRecord = dmarcRecords.flat().find(record => 
        record.toLowerCase().includes('v=dmarc1')
      );
      if (dmarcRecord) {
        results.has_dmarc_record = true;
        results.verification_details.dmarc = { record: dmarcRecord };
      }
    } catch (err) {
      results.errors.push({
        type: 'DMARC',
        message: `DMARC lookup failed: ${err.message}`
      });
    }

    // Check DKIM records (common selectors)
    const commonSelectors = ['default', 'selector1', 'selector2', 'dkim', 's1', 's2'];
    
    for (const selector of commonSelectors) {
      if (results.has_dkim_record) break;
      
      try {
        const dkimRecords = await resolver.resolveTxt(
          `${selector}._domainkey.${domain}`
        );
        if (dkimRecords && dkimRecords.length > 0) {
          const dkimRecord = dkimRecords.find((record) =>
            Array.isArray(record)
              ? record.join('').includes('v=DKIM1')
              : record.includes('v=DKIM1')
          );
          if (dkimRecord) {
            results.has_dkim_record = true;
            results.verification_details.dkim = {
              selector,
              record: dkimRecord
            };
            break;
          }
        }
      } catch (err) {
        // Expected for most selectors, don't log as error
      }
    }

  } catch (err) {
    logger.error('DNS verification error', { domain, error: err.message });
    results.errors.push({
      type: 'GENERAL',
      message: `DNS verification failed: ${err.message}`
    });
  }

  return results;
}

// Extract domain from email headers
function extractDomainFromEmail(parsed) {
  // Try to get domain from From header
  let domain = null;
  
  if (parsed.from && parsed.from.value && parsed.from.value.length > 0) {
    const fromAddress = parsed.from.value[0].address;
    if (fromAddress && fromAddress.includes('@')) {
      domain = fromAddress.split('@')[1];
    }
  } else if (parsed.from && parsed.from.text) {
    const emailMatch = parsed.from.text.match(/<([^>]+)>/) || 
                       parsed.from.text.match(/([^\s]+@[^\s]+)/);
    if (emailMatch && emailMatch[1] && emailMatch[1].includes('@')) {
      domain = emailMatch[1].split('@')[1];
    }
  }

  // Fallback to Return-Path header
  if (!domain && parsed.headers && parsed.headers['return-path']) {
    const returnPath = parsed.headers['return-path'];
    const emailMatch = returnPath.match(/<([^>]+)>/) || 
                       returnPath.match(/([^\s]+@[^\s]+)/);
    if (emailMatch && emailMatch[1] && emailMatch[1].includes('@')) {
      domain = emailMatch[1].split('@')[1];
    }
  }

  return domain;
}

// Analyze email authentication headers
async function analyzeEmailAuthentication(parsed) {
  const results = {
    spf: { status: 'none', details: 'No SPF verification performed' },
    dkim: { status: 'none', details: 'No DKIM verification performed' },
    dmarc: { status: 'none', details: 'No DMARC verification performed' },
    arc: { status: 'none', details: 'No ARC verification performed' }
  };

  try {
    // Parse Authentication-Results headers if present
    const authHeaders = [];
    if (parsed.headers && parsed.headers['authentication-results']) {
      const headers = Array.isArray(parsed.headers['authentication-results'])
        ? parsed.headers['authentication-results']
        : [parsed.headers['authentication-results']];
      authHeaders.push(...headers);
    } else if (parsed.headerLines) {
      parsed.headerLines
        .filter(line => line.key.toLowerCase() === 'authentication-results')
        .forEach(line => authHeaders.push(line.line));
    }

    // Simple parsing of auth results
    for (const header of authHeaders) {
      if (header.includes('spf=')) {
        const spfMatch = header.match(/spf=([^\s;]+)/);
        if (spfMatch) {
          results.spf.status = spfMatch[1];
          const reasonMatch = header.match(/spf=[^\s;]+\s+([^;]+)/);
          if (reasonMatch) {
            results.spf.details = reasonMatch[1].trim();
          }
        }
      }

      if (header.includes('dkim=')) {
        const dkimMatch = header.match(/dkim=([^\s;]+)/);
        if (dkimMatch) {
          results.dkim.status = dkimMatch[1];
          results.dkim.details = 'DKIM signature checked';
        }
      }

      if (header.includes('dmarc=')) {
        const dmarcMatch = header.match(/dmarc=([^\s;]+)/);
        if (dmarcMatch) {
          results.dmarc.status = dmarcMatch[1];
          results.dmarc.details = 'DMARC policy checked';
        }
      }

      if (header.includes('arc=')) {
        const arcMatch = header.match(/arc=([^\s;]+)/);
        if (arcMatch) {
          results.arc.status = arcMatch[1];
          results.arc.details = 'ARC chain checked';
        }
      }
    }

  } catch (err) {
    logger.error('Authentication analysis error', { error: err.message });
  }

  return results;
}

// Main handler for processing test emails
async function handleTestEmail(session, rawEmail) {
  try {
    logger.info('Processing test email', { 
      sessionId: session._id, 
      alias: session.alias 
    });

    // Parse the email
    const parsed = await simpleParser(rawEmail);
    
    // Extract domain from email
    const domain = extractDomainFromEmail(parsed);
    
    // Get sender email for results delivery
    const senderEmail = parsed.from?.value?.[0]?.address || 
                       parsed.from?.text?.match(/([^\s<>]+@[^\s<>]+)/)?.[1];

    if (!senderEmail) {
      logger.error('Could not extract sender email from test message', {
        sessionId: session._id,
        fromHeader: parsed.from
      });
      return;
    }

    // Perform DNS analysis if domain found
    let dnsResults = null;
    if (domain) {
      try {
        dnsResults = await verifyGeneralDNSRecords(domain);
        logger.debug('DNS verification results', { domain, results: dnsResults });
      } catch (err) {
        logger.error('DNS verification failed', { domain, error: err.message });
        dnsResults = {
          domain,
          has_spf_record: false,
          has_dkim_record: false,
          has_dmarc_record: false,
          has_mx_record: false,
          verification_details: {},
          errors: [{ message: `DNS verification failed: ${err.message}` }]
        };
      }
    }

    // Perform authentication analysis
    const authResults = await analyzeEmailAuthentication(parsed);

    // Create analysis results
    const results = {
      timestamp: new Date().toISOString(),
      domain,
      email_headers: {
        from: parsed.from?.text,
        to: parsed.to?.text,
        subject: parsed.subject,
        date: parsed.date,
        messageId: parsed.messageId
      },
      dns_verification: dnsResults,
      authentication: authResults,
      raw_analysis: {
        hasAttachments: parsed.attachments && parsed.attachments.length > 0,
        textSize: parsed.text ? parsed.text.length : 0,
        htmlSize: parsed.html ? parsed.html.length : 0
      }
    };

    // Send results via email
    await sendAnalysisEmail(senderEmail, results, domain);

    // Update session
    await TestEmailSessions.findByIdAndUpdate(session._id, {
      results_sent: true,
      sender_email: senderEmail
    });

    logger.info('Test email analysis completed', {
      sessionId: session._id,
      domain,
      senderEmail
    });

  } catch (err) {
    logger.error('Failed to process test email', {
      sessionId: session._id,
      error: err.message
    });
  }
}

// Send analysis results via email
async function sendAnalysisEmail(senderEmail, analysis, domain) {
  const domainText = domain ? ` for ${domain}` : '';
  
  // Create HTML email content
  const htmlContent = `
    <h2>Email Deliverability Analysis Results${domainText}</h2>
    <p>Analysis completed at: ${analysis.timestamp}</p>
    
    ${analysis.email_headers ? `
    <h3>Email Headers</h3>
    <ul>
      <li><strong>From:</strong> ${analysis.email_headers.from || 'N/A'}</li>
      <li><strong>Subject:</strong> ${analysis.email_headers.subject || 'N/A'}</li>
      <li><strong>Date:</strong> ${analysis.email_headers.date || 'N/A'}</li>
      <li><strong>Message-ID:</strong> ${analysis.email_headers.messageId || 'N/A'}</li>
    </ul>
    ` : ''}

    ${analysis.dns_verification ? `
    <h3>Email Authentication${domainText}</h3>
    <ul>
      <li><strong>SPF:</strong> <span style="color: ${analysis.dns_verification.has_spf_record ? 'green' : 'red'}">${analysis.dns_verification.has_spf_record ? '✓ Found' : '✗ Missing'}</span></li>
      <li><strong>DKIM:</strong> <span style="color: ${analysis.dns_verification.has_dkim_record ? 'green' : 'red'}">${analysis.dns_verification.has_dkim_record ? '✓ Found' : '✗ Missing'}</span></li>
      <li><strong>DMARC:</strong> <span style="color: ${analysis.dns_verification.has_dmarc_record ? 'green' : 'red'}">${analysis.dns_verification.has_dmarc_record ? '✓ Found' : '✗ Missing'}</span></li>
      <li><strong>MX:</strong> <span style="color: ${analysis.dns_verification.has_mx_record ? 'green' : 'red'}">${analysis.dns_verification.has_mx_record ? '✓ Found' : '✗ Missing'}</span></li>
    </ul>
    ` : ''}

    <h3>Email Content Analysis</h3>
    <ul>
      <li><strong>Has Attachments:</strong> ${analysis.raw_analysis.hasAttachments ? 'Yes' : 'No'}</li>
      <li><strong>Text Size:</strong> ${analysis.raw_analysis.textSize} bytes</li>
      <li><strong>HTML Size:</strong> ${analysis.raw_analysis.htmlSize} bytes</li>
    </ul>

    <hr>
    <p><small>This analysis was generated by <a href="${config.urls.web}/deliverability">Forward Email Deliverability Tool</a></small></p>
  `;

  await email({
    message: {
      to: senderEmail,
      subject: `Email Deliverability Analysis Results${domainText}`,
      html: htmlContent,
      from: `noreply@${config.webHost}`
    }
  });
}

// Rate limiting for test session creation
async function canCreateTestSession(clientIP) {
  try {
    // Check how many sessions this IP has created in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentSessions = await TestEmailSessions.countDocuments({
      client_ip: clientIP,
      created_at: { $gte: oneHourAgo }
    });

    // Allow up to 3 sessions per hour per IP
    return recentSessions < 3;
  } catch (err) {
    logger.error('Error checking test session rate limit', { 
      clientIP, 
      error: err.message 
    });
    return false;
  }
}

module.exports = {
  handleTestEmail,
  verifyGeneralDNSRecords,
  extractDomainFromEmail,
  analyzeEmailAuthentication,
  canCreateTestSession
};