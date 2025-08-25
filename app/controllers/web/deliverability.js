/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const koaMulter = require('@koa/multer');
const { simpleParser } = require('mailparser');
const { authenticate } = require('mailauth');

const logger = require('#helpers/logger');
const TestEmailSessions = require('#models/test-email-sessions');
const { canCreateTestSession } = require('#helpers/test-email-handler');

// Multer setup for email file uploads
const upload = koaMulter({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === 'message/rfc822' ||
      file.originalname.endsWith('.eml')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .eml files are allowed'));
    }
  }
});

// Main dashboard render function
async function renderDashboard(ctx) {
  // Set page metadata
  ctx.state.breadcrumbs = [
    { name: 'Home', header: true, href: ctx.state.l() },
    { name: 'Email Analysis Tool' }
  ];

  ctx.state.meta = {
    title: 'Email Analysis Tool - Raw Email Debugging'
  };

  return ctx.render('deliverability/dashboard');
}

// Email analysis function with multer wrapper
async function analyzeEmailWithUpload(ctx, next) {
  // Apply multer middleware first
  await upload.single('emlFile')(ctx, next);
  // Then call the main function
  return analyzeEmail(ctx);
}

// Email analysis function (simplified)
async function analyzeEmail(ctx) {
  try {
    const { email } = ctx.request.body;
    let parsed = null;

    // Set breadcrumbs first
    ctx.state.breadcrumbs = [
      { name: 'Home', header: true, href: ctx.state.l() },
      { name: 'DNS Configuration Check', href: ctx.state.l('/deliverability') },
      { name: 'Email Analysis Results' }
    ];

    // Parse email from file upload or text input
    if (ctx.request.file) {
      parsed = await simpleParser(ctx.request.file.buffer);
    } else if (email) {
      parsed = await simpleParser(email);
    } else {
      throw Boom.badRequest('No email provided');
    }

    // Extract domain from email headers
    const domain = extractDomainFromEmail(parsed);

    let dnsResults = null;
    if (domain) {
      // Verify DNS records for the extracted domain using general DNS lookup
      try {
        dnsResults = await verifyGeneralDNSRecords(domain, ctx.resolver);

        // Log for debugging DNS verification issues
        logger.debug('DNS verification results for domain', {
          domain,
          results: dnsResults
        });
      } catch (err) {
        logger.error('DNS verification failed for extracted domain', {
          domain,
          error: err.message
        });

        dnsResults = {
          domain,
          has_dkim_record: false,
          has_return_path_record: false,
          has_dmarc_record: false,
          has_spf_record: false,
          has_mx_record: false,
          has_txt_record: false,
          verification_details: {},
          errors: [{ message: `DNS verification failed: ${err.message}` }]
        };
      }
    }

    // Perform email authentication analysis
    const authResults = await analyzeEmailAuthentication(parsed);

    // Debug the parsed email structure first
    logger.debug('Parsed email structure', {
      headers: Object.keys(parsed.headers || {}),
      headerLines: parsed.headerLines ? parsed.headerLines.length : 'undefined'
    });

    // Perform routing and timing analysis
    const routingAnalysis = analyzeEmailRouting(parsed);
    const authenticationDetails = parseAuthenticationResults(parsed);
    
    // Debug logging
    logger.debug('Routing analysis results', { routingAnalysis });
    logger.debug('Authentication details results', { authenticationDetails });

    // Prepare results
    const results = {
      timestamp: new Date().toISOString(),
      domain,
      routing_analysis: routingAnalysis,
      authentication_details: authenticationDetails,
      email_headers: {
        from: parsed.from?.text,
        to: parsed.to?.text,
        subject: parsed.subject,
        date: parsed.date,
        messageId: parsed.messageId
      },
      authentication: authResults,
      dns_verification: dnsResults,
      raw_analysis: {
        hasAttachments: parsed.attachments?.length > 0,
        textSize: parsed.text?.length || 0,
        htmlSize: parsed.html?.length || 0
      }
    };

    // Set results and render
    ctx.state.emailResults = results;
    ctx.state.showEmailResults = true;

    ctx.state.messages = {
      success: [
        `Email analyzed successfully${domain ? ` for domain ${domain}` : ''}`
      ]
    };

    ctx.state.meta = {
      title: `Email Analysis Results${domain ? ` - ${domain}` : ''}`
    };

    return ctx.render('deliverability/dashboard');
  } catch (err) {
    logger.error('Email analysis failed', {
      error: err.message,
      stack: err.stack
    });

    // Set breadcrumbs for error case
    ctx.state.breadcrumbs = [
      { name: 'Home', header: true, href: ctx.state.l() },
      { name: 'DNS Configuration Check', href: ctx.state.l('/deliverability') },
      { name: 'Email Analysis Error' }
    ];

    ctx.state.messages = {
      error: [err.message || 'Email analysis failed']
    };

    ctx.state.meta = {
      title: 'Email Analysis - Error'
    };

    return ctx.render('deliverability/dashboard');
  }
}

// Helper function to verify general DNS records (not Forward Email specific)
async function verifyGeneralDNSRecords(domain, resolver) {
  const results = {
    domain,
    has_mx_record: false,
    has_spf_record: false,
    has_dkim_record: false, // We'll check common selectors
    has_return_path_record: false, // Not applicable for general domains
    has_dmarc_record: false,
    has_txt_record: false,
    verification_details: {},
    errors: []
  };

  try {
    // Check MX records
    try {
      const mxRecords = await resolver.resolve(domain, 'MX');
      if (mxRecords && mxRecords.length > 0) {
        results.has_mx_record = true;
        results.verification_details.mx = mxRecords;
      }
    } catch (err) {
      logger.debug('MX lookup failed', { domain, error: err.message });
      results.errors.push({ type: 'MX', message: err.message });
    }

    // Check SPF records (TXT records starting with v=spf1)
    try {
      logger.debug('Looking up TXT records for SPF', { domain });
      const txtRecords = await resolver.resolve(domain, 'TXT');
      logger.debug('TXT lookup result', { domain, txtRecords });

      if (txtRecords && txtRecords.length > 0) {
        results.has_txt_record = true;
        results.verification_details.txt = txtRecords;

        // Look for SPF record
        const spfRecord = txtRecords.find((record) => {
          const recordText = Array.isArray(record) ? record.join('') : record;
          return recordText.startsWith('v=spf1');
        });

        if (spfRecord) {
          results.has_spf_record = true;
          results.verification_details.spf = Array.isArray(spfRecord)
            ? spfRecord.join('')
            : spfRecord;
          logger.debug('Found SPF record', { spfRecord });
        } else {
          logger.debug('No SPF record found in TXT records', { txtRecords });
        }
      }
    } catch (err) {
      logger.debug('TXT lookup failed', { domain, error: err.message });
      results.errors.push({ type: 'TXT', message: err.message });
    }

    // Check DMARC record
    try {
      const dmarcDomain = `_dmarc.${domain}`;
      logger.debug('Looking up DMARC record', { dmarcDomain });
      const dmarcRecords = await resolver.resolve(dmarcDomain, 'TXT');
      logger.debug('DMARC lookup result', { dmarcDomain, dmarcRecords });

      if (dmarcRecords && dmarcRecords.length > 0) {
        const dmarcRecord = dmarcRecords.find((record) => {
          const recordText = Array.isArray(record) ? record.join('') : record;
          return recordText.startsWith('v=DMARC1');
        });

        if (dmarcRecord) {
          results.has_dmarc_record = true;
          results.verification_details.dmarc = Array.isArray(dmarcRecord)
            ? dmarcRecord.join('')
            : dmarcRecord;
          logger.debug('Found DMARC record', { dmarcRecord });
        } else {
          logger.debug('No valid DMARC record found in TXT records', {
            dmarcRecords
          });
        }
      } else {
        logger.debug('No DMARC TXT records found', { dmarcDomain });
      }
    } catch (err) {
      logger.debug('DMARC lookup failed', { domain, error: err.message });
      results.errors.push({ type: 'DMARC', message: err.message });
    }

    // Check common DKIM selectors
    const commonSelectors = [
      'default',
      'selector1',
      'selector2',
      'google',
      'k1',
      's1',
      's2'
    ];
    for (const selector of commonSelectors) {
      try {
        const dkimRecords = await resolver.resolve(
          `${selector}._domainkey.${domain}`,
          'TXT'
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
            break; // Found one, that's enough
          }
        }
      } catch (err) {
        // Expected for most selectors, don't log as error
        logger.debug(`DKIM selector ${selector} lookup failed`, {
          domain,
          error: err.message
        });
      }
    }
  } catch (err) {
    logger.error('General DNS verification failed', {
      domain,
      error: err.message
    });
    results.errors.push({ type: 'GENERAL', message: err.message });
  }

  return results;
}

// Helper function to extract domain from email
function extractDomainFromEmail(parsed) {
  logger.debug('Extracting domain from email', {
    from: parsed.from,
    returnPath: parsed.headers.get('return-path'),
    messageId: parsed.messageId
  });

  // Try From header first
  if (parsed.from?.value && parsed.from.value[0]?.address) {
    const email = parsed.from.value[0].address;
    const domain = email.split('@')[1];
    if (domain) {
      logger.debug('Extracted domain from From header', { email, domain });
      return domain.toLowerCase();
    }
  }

  // Try From header text format
  if (parsed.from?.text) {
    const emailMatch = parsed.from.text.match(
      /([\w.%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,})/
    );
    if (emailMatch) {
      const domain = emailMatch[1].split('@')[1];
      if (domain) {
        logger.debug('Extracted domain from From text', {
          fromText: parsed.from.text,
          domain
        });
        return domain.toLowerCase();
      }
    }
  }

  // Try Return-Path header
  const returnPath = parsed.headers.get('return-path');
  if (returnPath) {
    const match = returnPath.match(/@([^>]+)>/);
    if (match) {
      logger.debug('Extracted domain from Return-Path', {
        returnPath,
        domain: match[1]
      });
      return match[1].toLowerCase();
    }
  }

  // Try Message-ID header
  if (parsed.messageId) {
    const match = parsed.messageId.match(/@([^>]+)>/);
    if (match) {
      logger.debug('Extracted domain from Message-ID', {
        messageId: parsed.messageId,
        domain: match[1]
      });
      return match[1].toLowerCase();
    }
  }

  logger.debug('Could not extract domain from email');
  return null;
}

// Helper function to analyze email authentication
async function analyzeEmailAuthentication(parsed) {
  try {
    // Use mailauth to check authentication
    const authResults = await authenticate(parsed.headers.toString());

    // Log the actual structure to debug
    logger.debug('mailauth results', { authResults });

    // Parse SPF results
    let spf = { status: 'none', details: 'No SPF verification performed' };
    if (authResults.spf) {
      if (typeof authResults.spf === 'object') {
        // SPF status is nested in status object
        let status = 'none';
        if (
          authResults.spf.status &&
          typeof authResults.spf.status === 'object'
        ) {
          // Extract the actual status from the nested object
          status =
            authResults.spf.status.result ||
            authResults.spf.status.status ||
            'none';
        } else if (authResults.spf.status) {
          status = authResults.spf.status;
        }

        spf = {
          status: typeof status === 'string' ? status : String(status),
          details:
            authResults.spf.info || authResults.spf.comment || 'SPF checked'
        };
      } else {
        spf = { status: String(authResults.spf), details: 'SPF checked' };
      }
    }

    // Parse DKIM results
    let dkim = { status: 'none', details: 'No DKIM signature found' };
    if (authResults.dkim && typeof authResults.dkim === 'object') {
      // DKIM has results array and other properties
      if (
        authResults.dkim.results &&
        Array.isArray(authResults.dkim.results) &&
        authResults.dkim.results.length > 0
      ) {
        const firstResult = authResults.dkim.results[0];
        // Handle nested status objects
        let status = 'none';
        if (firstResult.status && typeof firstResult.status === 'object') {
          status =
            firstResult.status.result || firstResult.status.status || 'none';
        } else if (firstResult.status) {
          status = firstResult.status;
        } else if (firstResult.result) {
          status = firstResult.result;
        }

        dkim = {
          status: typeof status === 'string' ? status : String(status),
          details:
            firstResult.comment ||
            firstResult.reason ||
            'DKIM signature checked'
        };
      } else {
        // No DKIM signatures found
        dkim = {
          status: 'none',
          details: 'No DKIM signatures found'
        };
      }
    } else if (authResults.dkim) {
      dkim = { status: String(authResults.dkim), details: 'DKIM checked' };
    }

    // Parse DMARC results
    let dmarc = { status: 'none', details: 'No DMARC policy found' };
    if (authResults.dmarc) {
      if (typeof authResults.dmarc === 'object') {
        dmarc = {
          status:
            authResults.dmarc.status || authResults.dmarc.result || 'unknown',
          details:
            authResults.dmarc.comment ||
            authResults.dmarc.reason ||
            'DMARC checked'
        };
      } else {
        dmarc = { status: authResults.dmarc, details: 'DMARC checked' };
      }
    }

    // Parse ARC results
    let arc = { status: 'none', details: 'No ARC chain found' };
    if (authResults.arc && typeof authResults.arc === 'object') {
      // ARC status is nested in status object
      let status = 'none';
      if (
        authResults.arc.status &&
        typeof authResults.arc.status === 'object'
      ) {
        // Extract the actual status from the nested object
        status =
          authResults.arc.status.result ||
          authResults.arc.status.status ||
          'none';
      } else if (authResults.arc.status) {
        status = authResults.arc.status;
      }

      arc = {
        status: typeof status === 'string' ? status : String(status),
        details: authResults.arc.authResults || 'ARC chain checked'
      };
    } else if (authResults.arc) {
      arc = { status: String(authResults.arc), details: 'ARC checked' };
    }

    return { spf, dkim, dmarc, arc };
  } catch (err) {
    logger.error('Authentication analysis failed', { error: err.message });
    return {
      spf: { status: 'error', details: 'Failed to analyze SPF' },
      dkim: { status: 'error', details: 'Failed to analyze DKIM' },
      dmarc: { status: 'error', details: 'Failed to analyze DMARC' },
      arc: { status: 'error', details: 'Failed to analyze ARC' }
    };
  }
}

// Analyze email routing through mail servers
function analyzeEmailRouting(parsed) {
  const routing = {
    hops: [],
    total_hops: 0,
    total_delay_ms: 0,
    suspicious_patterns: [],
    routing_summary: []
  };

  try {
    // Get all Received headers (they're in reverse chronological order)
    const receivedHeaders = [];
    
    // Check different ways the headers might be structured
    if (parsed.headers && parsed.headers.received) {
      const headers = Array.isArray(parsed.headers.received) 
        ? parsed.headers.received 
        : [parsed.headers.received];
      receivedHeaders.push(...headers);
    } else if (parsed.headerLines) {
      // Alternative: look in headerLines for Received headers
      parsed.headerLines
        .filter(line => line.key.toLowerCase() === 'received')
        .forEach(line => receivedHeaders.push(line.line));
    }
    
    // Debug what we found
    logger.debug('Found received headers', { count: receivedHeaders.length, headers: receivedHeaders });

    // Reverse to get chronological order (first hop first)
    receivedHeaders.reverse();

    // Parse each Received header
    for (let i = 0; i < receivedHeaders.length; i++) {
      const header = receivedHeaders[i];
      const hop = parseReceivedHeader(header, i + 1);
      routing.hops.push(hop);
    }

    routing.total_hops = routing.hops.length;

    // Calculate delays between hops
    for (let i = 1; i < routing.hops.length; i++) {
      const prevHop = routing.hops[i - 1];
      const currentHop = routing.hops[i];
      
      if (prevHop.timestamp && currentHop.timestamp) {
        const delay = currentHop.timestamp - prevHop.timestamp;
        routing.hops[i].delay_ms = delay;
        routing.total_delay_ms += delay;

        // Flag unusual delays
        if (delay > 60000) { // > 1 minute
          routing.suspicious_patterns.push(`Long delay (${(delay/1000).toFixed(1)}s) between hops ${i} and ${i + 1}`);
        }
        if (delay < 0) { // Negative delay (time inconsistency)
          routing.suspicious_patterns.push(`Negative time delay between hops ${i} and ${i + 1}`);
        }
      }
    }

    // Generate routing summary
    routing.routing_summary = routing.hops.map(hop => ({
      server: hop.server || 'Unknown',
      timestamp: hop.timestamp_str || 'Unknown',
      delay: hop.delay_ms ? `${(hop.delay_ms/1000).toFixed(1)}s` : '-'
    }));

    // Check for suspicious patterns
    if (routing.total_hops > 10) {
      routing.suspicious_patterns.push('Unusually high number of mail hops');
    }

  } catch (err) {
    routing.error = `Failed to analyze routing: ${err.message}`;
  }

  return routing;
}

// Parse Authentication-Results headers for detailed failure analysis
function parseAuthenticationResults(parsed) {
  const authDetails = {
    servers_checked: [],
    detailed_results: [],
    failure_reasons: []
  };

  try {
    // Look for Authentication-Results headers
    const authHeaders = [];
    if (parsed.headers && parsed.headers['authentication-results']) {
      const headers = Array.isArray(parsed.headers['authentication-results'])
        ? parsed.headers['authentication-results']
        : [parsed.headers['authentication-results']];
      authHeaders.push(...headers);
    } else if (parsed.headerLines) {
      // Alternative: look in headerLines for Authentication-Results headers
      parsed.headerLines
        .filter(line => line.key.toLowerCase() === 'authentication-results')
        .forEach(line => authHeaders.push(line.line));
    }
    
    // Debug what we found
    logger.debug('Found auth headers', { count: authHeaders.length, headers: authHeaders });

    // Parse each Authentication-Results header
    authHeaders.forEach((header, index) => {
      const result = parseAuthenticationResultsHeader(header, index + 1);
      authDetails.servers_checked.push(result.server);
      authDetails.detailed_results.push(result);
      
      // Collect failure reasons
      if (result.spf && result.spf.result === 'fail') {
        authDetails.failure_reasons.push(`SPF failed: ${result.spf.reason || 'Unknown reason'}`);
      }
      if (result.dkim && result.dkim.result === 'fail') {
        authDetails.failure_reasons.push(`DKIM failed: ${result.dkim.reason || 'Unknown reason'}`);
      }
      if (result.dmarc && result.dmarc.result === 'fail') {
        authDetails.failure_reasons.push(`DMARC failed: ${result.dmarc.reason || 'Unknown reason'}`);
      }
    });

  } catch (err) {
    authDetails.error = `Failed to parse authentication details: ${err.message}`;
  }

  return authDetails;
}

// Helper function to parse individual Received header
function parseReceivedHeader(header, hopNumber) {
  const hop = {
    hop_number: hopNumber,
    raw_header: header,
    server: null,
    from_server: null,
    timestamp: null,
    timestamp_str: null,
    delay_ms: null
  };

  try {
    // Extract server information
    const fromMatch = header.match(/from\s+([^\s]+)/i);
    if (fromMatch) {
      hop.from_server = fromMatch[1];
    }

    const byMatch = header.match(/by\s+([^\s]+)/i);
    if (byMatch) {
      hop.server = byMatch[1];
    }

    // Extract timestamp
    const timeMatch = header.match(/;\s*(.+)$/);
    if (timeMatch) {
      const timeStr = timeMatch[1].trim();
      hop.timestamp_str = timeStr;
      try {
        hop.timestamp = new Date(timeStr).getTime();
      } catch {
        // Invalid timestamp
      }
    }

  } catch (err) {
    hop.parse_error = err.message;
  }

  return hop;
}

// Helper function to parse Authentication-Results header
function parseAuthenticationResultsHeader(header, headerNumber) {
  const result = {
    header_number: headerNumber,
    server: null,
    spf: null,
    dkim: null,
    dmarc: null,
    arc: null
  };

  try {
    // Extract the authenticating server (first part before semicolon)
    const serverMatch = header.match(/^([^;]+)/);
    if (serverMatch) {
      result.server = serverMatch[1].trim();
    }

    // Parse SPF results
    const spfMatch = header.match(/spf=([^;\s]+)(?:\s+([^;]+))?/i);
    if (spfMatch) {
      result.spf = {
        result: spfMatch[1],
        reason: spfMatch[2] || null
      };
    }

    // Parse DKIM results
    const dkimMatch = header.match(/dkim=([^;\s]+)(?:\s+([^;]+))?/i);
    if (dkimMatch) {
      result.dkim = {
        result: dkimMatch[1],
        reason: dkimMatch[2] || null
      };
    }

    // Parse DMARC results
    const dmarcMatch = header.match(/dmarc=([^;\s]+)(?:\s+([^;]+))?/i);
    if (dmarcMatch) {
      result.dmarc = {
        result: dmarcMatch[1],
        reason: dmarcMatch[2] || null
      };
    }

    // Parse ARC results
    const arcMatch = header.match(/arc=([^;\s]+)(?:\s+([^;]+))?/i);
    if (arcMatch) {
      result.arc = {
        result: arcMatch[1],
        reason: arcMatch[2] || null
      };
    }

  } catch (err) {
    result.parse_error = err.message;
  }

  return result;
}

// Create new test email session
async function createTestSession(ctx) {
  try {
    const clientIP = ctx.request.ip || ctx.ip;

    // Check rate limiting
    const canCreate = await canCreateTestSession(clientIP);
    if (!canCreate) {
      throw Boom.tooManyRequests(
        'Too many test sessions created. Please wait before creating a new one.'
      );
    }

    // Create new test session
    const session = await TestEmailSessions.createTestSession(clientIP);

    logger.info('Test email session created', {
      sessionId: session._id,
      alias: session.alias,
      clientIP
    });

    // Redirect to the test instructions page
    ctx.redirect(`/deliverability/test/${session._id}`);
  } catch (err) {
    logger.error('Failed to create test session', {
      error: err.message,
      stack: err.stack
    });
    throw Boom.badRequest(err.message || 'Failed to create test session');
  }
}

// Get test session status and results
async function getTestSessionStatus(ctx) {
  try {
    const { sessionId } = ctx.params;

    if (!sessionId) {
      throw Boom.badRequest('Session ID is required');
    }

    const session = await TestEmailSessions.findById(sessionId);
    if (!session) {
      throw Boom.notFound('Test session not found');
    }

    // Check if session has expired
    if (session.expires_at < new Date()) {
      session.status = 'expired';
      await session.save();
    }

    const response = {
      sessionId: session._id,
      alias: session.alias,
      status: session.status,
      createdAt: session.created_at,
      expiresAt: session.expires_at,
      emailCount: session.emails.length
    };

    // Include analysis results if available
    if (session.emails.length > 0 && session.status === 'analyzed') {
      const latestEmail = session.emails[session.emails.length - 1];
      response.analysis = latestEmail.analysis;
      response.receivedAt = latestEmail.received_at;
    }

    ctx.body = response;
  } catch (err) {
    if (err.isBoom) throw err;
    logger.error('Failed to get test session status', {
      error: err.message,
      stack: err.stack
    });
    throw Boom.badRequest('Failed to get test session status');
  }
}

// Render test instructions page
async function renderTestInstructions(ctx) {
  try {
    const { sessionId } = ctx.params;

    if (!sessionId) {
      throw Boom.badRequest('Session ID is required');
    }

    const session = await TestEmailSessions.findById(sessionId);
    if (!session) {
      throw Boom.notFound('Test session not found or expired');
    }

    // Check if session has expired
    if (session.expires_at < new Date()) {
      throw Boom.gone('Test session has expired');
    }

    // Set page metadata
    ctx.state.breadcrumbs = [
      { name: 'Home', header: true, href: ctx.state.l() },
      {
        name: 'Email Deliverability Tool',
        href: ctx.state.l('/deliverability')
      },
      { name: 'Test Instructions' }
    ];

    ctx.state.meta = {
      title: 'Email Deliverability Test Instructions'
    };

    // Pass session data to template
    ctx.state.session = session;

    return ctx.render('deliverability/test-instructions');
  } catch (err) {
    logger.error('Failed to render test instructions', {
      sessionId: ctx.params.sessionId,
      error: err.message,
      stack: err.stack
    });
    throw err;
  }
}

module.exports = {
  renderDashboard,
  analyzeEmail,
  analyzeEmailWithUpload,
  createTestSession,
  getTestSessionStatus,
  renderTestInstructions
};
