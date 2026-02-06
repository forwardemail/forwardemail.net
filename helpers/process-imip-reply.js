/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Process iMIP REPLY Helper
 *
 * This helper processes incoming iMIP REPLY messages from external email systems
 * (O365, Gmail, etc.) to update the attendee's PARTSTAT in the organizer's
 * calendar event.
 *
 * SECURITY NOTES:
 * - DKIM/DMARC validation is already handled by the MX server (is-authenticated-message.js)
 * - Messages that fail DMARC with p=reject are rejected before reaching this code
 * - We still validate sender/attendee match to prevent spoofing within delivered mail
 * - Rate limiting prevents abuse and replay attacks
 *
 * @see https://tools.ietf.org/html/rfc6047 - iCalendar Message-Based Interoperability Protocol (iMIP)
 */

const ICAL = require('ical.js');

const CalendarInvites = require('#models/calendar-invites');
const logger = require('#helpers/logger');

/**
 * Valid PARTSTAT values that indicate a response
 */
const RESPONSE_PARTSTAT = ['ACCEPTED', 'DECLINED', 'TENTATIVE'];

/**
 * Rate limit: max iMIP replies per sender per hour
 */
const RATE_LIMIT_MAX_PER_HOUR = 50;

/**
 * Rate limit: max iMIP replies per event/attendee per hour
 */
const RATE_LIMIT_MAX_PER_EVENT_ATTENDEE_PER_HOUR = 5;

/**
 * Security validation result codes
 */
const SECURITY_CODES = {
  VALID: 'valid',
  SENDER_MISMATCH: 'sender_attendee_mismatch',
  RATE_LIMITED: 'rate_limit_exceeded',
  INVALID_DATA: 'invalid_imip_data'
};

/**
 * Extract the domain from an email address
 * @param {string} email - Email address
 * @returns {string|null} Domain or null
 */
function extractDomain(email) {
  if (!email || typeof email !== 'string') return null;
  const parts = email.toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : null;
}

/**
 * Normalize email address for comparison
 * @param {string} email - Email address
 * @returns {string} Normalized lowercase email
 */
function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.toLowerCase().trim();
}

/**
 * Validate that the email sender matches the attendee in the REPLY
 *
 * This prevents spoofing where someone sends a REPLY claiming to be another attendee.
 *
 * @param {string} senderEmail - The email sender (From header)
 * @param {string} attendeeEmail - The attendee email in the iMIP REPLY
 * @returns {Object} Validation result { valid: boolean, code: string, reason: string }
 */
function validateSenderAttendeeMatch(senderEmail, attendeeEmail) {
  const normalizedSender = normalizeEmail(senderEmail);
  const normalizedAttendee = normalizeEmail(attendeeEmail);

  if (!normalizedSender || !normalizedAttendee) {
    return {
      valid: false,
      code: SECURITY_CODES.SENDER_MISMATCH,
      reason: 'Missing sender or attendee email'
    };
  }

  // Exact match
  if (normalizedSender === normalizedAttendee) {
    return { valid: true, code: SECURITY_CODES.VALID, reason: 'Exact match' };
  }

  // Allow subdomain match (e.g., user@mail.company.com sending for user@company.com)
  // This handles cases where mail systems use different subdomains
  const senderDomain = extractDomain(normalizedSender);
  const attendeeDomain = extractDomain(normalizedAttendee);

  if (senderDomain && attendeeDomain) {
    // Check if same root domain (simplified check)
    const senderParts = senderDomain.split('.');
    const attendeeParts = attendeeDomain.split('.');

    if (senderParts.length >= 2 && attendeeParts.length >= 2) {
      const senderRoot = senderParts.slice(-2).join('.');
      const attendeeRoot = attendeeParts.slice(-2).join('.');

      if (senderRoot === attendeeRoot) {
        // Same organization, check username
        const senderUser = normalizedSender.split('@')[0];
        const attendeeUser = normalizedAttendee.split('@')[0];

        if (senderUser === attendeeUser) {
          return {
            valid: true,
            code: SECURITY_CODES.VALID,
            reason: 'Same user, related domain'
          };
        }
      }
    }
  }

  return {
    valid: false,
    code: SECURITY_CODES.SENDER_MISMATCH,
    reason: `Sender ${normalizedSender} does not match attendee ${normalizedAttendee}`
  };
}

/**
 * Check rate limits for iMIP REPLY processing
 *
 * @param {Object} client - Redis client
 * @param {string} senderEmail - Sender email
 * @param {string} eventUid - Event UID
 * @param {string} attendeeEmail - Attendee email
 * @returns {Promise<Object>} Rate limit result { allowed: boolean, code: string, reason: string }
 */
async function checkRateLimits(client, senderEmail, eventUid, attendeeEmail) {
  if (!client) {
    // If no Redis client, allow but log warning
    logger.warn('iMIP rate limiting skipped - no Redis client');
    return {
      allowed: true,
      code: SECURITY_CODES.VALID,
      reason: 'Rate limiting unavailable'
    };
  }

  const now = Date.now();
  const hourAgo = now - 3600000;

  try {
    // Check per-sender rate limit
    const senderKey = `imip_rate:sender:${normalizeEmail(senderEmail)}`;
    const senderCount = await client.zcount(senderKey, hourAgo, now);

    if (senderCount >= RATE_LIMIT_MAX_PER_HOUR) {
      logger.warn('iMIP REPLY rate limit exceeded for sender', {
        senderEmail,
        count: senderCount,
        limit: RATE_LIMIT_MAX_PER_HOUR
      });
      return {
        allowed: false,
        code: SECURITY_CODES.RATE_LIMITED,
        reason: `Sender rate limit exceeded (${senderCount}/${RATE_LIMIT_MAX_PER_HOUR} per hour)`
      };
    }

    // Check per-event/attendee rate limit (prevents replay attacks)
    const eventKey = `imip_rate:event:${eventUid}:${normalizeEmail(
      attendeeEmail
    )}`;
    const eventCount = await client.zcount(eventKey, hourAgo, now);

    if (eventCount >= RATE_LIMIT_MAX_PER_EVENT_ATTENDEE_PER_HOUR) {
      logger.warn('iMIP REPLY rate limit exceeded for event/attendee', {
        eventUid,
        attendeeEmail,
        count: eventCount,
        limit: RATE_LIMIT_MAX_PER_EVENT_ATTENDEE_PER_HOUR
      });
      return {
        allowed: false,
        code: SECURITY_CODES.RATE_LIMITED,
        reason: `Event/attendee rate limit exceeded (${eventCount}/${RATE_LIMIT_MAX_PER_EVENT_ATTENDEE_PER_HOUR} per hour)`
      };
    }

    // Record this request
    await client.zadd(senderKey, now, `${now}`);
    await client.zadd(eventKey, now, `${now}`);

    // Set expiry on rate limit keys (2 hours)
    await client.expire(senderKey, 7200);
    await client.expire(eventKey, 7200);

    // Clean up old entries
    await client.zremrangebyscore(senderKey, 0, hourAgo);
    await client.zremrangebyscore(eventKey, 0, hourAgo);

    return {
      allowed: true,
      code: SECURITY_CODES.VALID,
      reason: 'Within rate limits'
    };
  } catch (err) {
    logger.error('Rate limit check failed', { error: err.message });
    // Allow on error but log
    return {
      allowed: true,
      code: SECURITY_CODES.VALID,
      reason: 'Rate limit check error'
    };
  }
}

/**
 * Extract iMIP REPLY data from a parsed email
 *
 * @param {Object} parsedEmail - Parsed email from mailparser (simpleParser)
 * @returns {Object|null} Extracted iMIP data or null if not a valid REPLY
 */
function extractImipReply(parsedEmail) {
  if (!parsedEmail) return null;

  // Look for text/calendar content in the email
  let icalData = null;

  // Check direct calendar content (some clients embed it directly)
  if (
    parsedEmail.text &&
    parsedEmail.text.includes('BEGIN:VCALENDAR') &&
    parsedEmail.text.includes('METHOD:REPLY')
  ) {
    icalData = parsedEmail.text;
  }

  // Check attachments for ICS files
  if (!icalData && parsedEmail.attachments) {
    for (const attachment of parsedEmail.attachments) {
      // Check content type
      if (
        (attachment.contentType &&
          (attachment.contentType.includes('text/calendar') ||
            attachment.contentType.includes('application/ics'))) ||
        (attachment.filename && attachment.filename.endsWith('.ics'))
      ) {
        const content = attachment.content.toString('utf8');
        if (content.includes('METHOD:REPLY')) {
          icalData = content;
          break;
        }
      }
    }
  }

  // Check alternatives array (Gmail and some clients use this)
  if (!icalData && parsedEmail.alternatives) {
    for (const alt of parsedEmail.alternatives) {
      if (alt.contentType && alt.contentType.includes('text/calendar')) {
        const content = alt.content.toString('utf8');
        if (content.includes('METHOD:REPLY')) {
          icalData = content;
          break;
        }
      }
    }
  }

  // Check for calendar content in HTML alternatives (some clients embed it)
  if (!icalData && parsedEmail.html) {
    // Look for embedded calendar data in HTML
    const calMatch = parsedEmail.html.match(
      /BEGIN:VCALENDAR[\s\S]*?METHOD:REPLY[\s\S]*?END:VCALENDAR/
    );
    if (calMatch) {
      icalData = calMatch[0];
    }
  }

  if (!icalData) return null;

  return parseImipReply(icalData);
}

/**
 * Parse iMIP REPLY ICS data
 *
 * @param {string} icalData - Raw ICS calendar data
 * @returns {Object|null} Parsed iMIP data or null if invalid
 */
function parseImipReply(icalData) {
  if (!icalData || typeof icalData !== 'string') return null;

  try {
    // Input validation - limit size to prevent DoS
    if (icalData.length > 100000) {
      logger.warn('iMIP REPLY rejected - ICS data too large', {
        size: icalData.length
      });
      return null;
    }

    const jcalData = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcalData);

    // Verify this is a REPLY method
    const method = comp.getFirstPropertyValue('method');
    if (!method || method.toUpperCase() !== 'REPLY') {
      return null;
    }

    // Get the VEVENT component
    const vevent = comp.getFirstSubcomponent('vevent');
    if (!vevent) return null;

    const event = new ICAL.Event(vevent);

    // Extract UID with validation
    const { uid } = event;
    if (!uid || typeof uid !== 'string' || uid.length > 512) {
      logger.warn('iMIP REPLY rejected - invalid UID', { uid });
      return null;
    }

    // Extract organizer email
    let organizerEmail = null;
    const organizer = vevent.getFirstProperty('organizer');
    if (organizer) {
      const organizerValue = organizer.getFirstValue();
      if (organizerValue) {
        // Handle mailto: prefix
        organizerEmail = organizerValue.replace(/^mailto:/i, '').toLowerCase();
      }

      // Fallback to EMAIL parameter if value is not mailto:
      if (!organizerEmail || !organizerEmail.includes('@')) {
        const emailParam = organizer.getParameter('email');
        if (emailParam) {
          organizerEmail = emailParam.toLowerCase();
        }
      }
    }

    // Extract attendee and their PARTSTAT
    // In a REPLY, there should be exactly one attendee (the responder)
    const attendees = vevent.getAllProperties('attendee');
    if (!attendees || attendees.length === 0) {
      logger.warn('iMIP REPLY rejected - no attendee found');
      return null;
    }

    // Find the attendee with a PARTSTAT (the one responding)
    let attendeeEmail = null;
    let partstat = null;

    for (const attendee of attendees) {
      const attendeeValue = attendee.getFirstValue();
      const attendeePartstat = attendee.getParameter('partstat');

      if (attendeeValue && attendeePartstat) {
        // Extract email from attendee value
        let email = attendeeValue.replace(/^mailto:/i, '');

        // Fallback to EMAIL parameter
        if (!email.includes('@')) {
          const emailParam = attendee.getParameter('email');
          if (emailParam) {
            email = emailParam;
          }
        }

        // Validate PARTSTAT
        const normalizedPartstat = attendeePartstat.toUpperCase();
        if (RESPONSE_PARTSTAT.includes(normalizedPartstat)) {
          attendeeEmail = email.toLowerCase();
          partstat = normalizedPartstat;
          break;
        }
      }
    }

    if (!attendeeEmail || !partstat) {
      logger.warn('iMIP REPLY rejected - no valid attendee/partstat found');
      return null;
    }

    // Validate email format (basic check)
    if (!attendeeEmail.includes('@') || attendeeEmail.length > 254) {
      logger.warn('iMIP REPLY rejected - invalid attendee email', {
        attendeeEmail
      });
      return null;
    }

    return {
      method: 'REPLY',
      uid,
      organizerEmail,
      attendeeEmail,
      partstat,
      summary: event.summary || null,
      dtstart: event.startDate ? event.startDate.toString() : null,
      sequence: vevent.getFirstPropertyValue('sequence') || 0
    };
  } catch (err) {
    logger.error('Failed to parse iMIP REPLY', { error: err.message });
    return null;
  }
}

/**
 * Process a validated iMIP REPLY and create/update CalendarInvites record
 *
 * @param {Object} imipData - Parsed iMIP REPLY data from parseImipReply()
 * @param {Object} options - Additional options
 * @param {string} [options.messageId] - Original email Message-ID for tracking
 * @param {string} [options.fromEmail] - Sender email address
 * @param {string} [options.remoteAddress] - Sender IP address
 * @returns {Promise<Object>} Created CalendarInvites document
 */
async function processImipReply(imipData, options = {}) {
  if (!imipData || imipData.method !== 'REPLY') {
    throw new TypeError('Invalid iMIP REPLY data');
  }

  const { uid, organizerEmail, attendeeEmail, partstat } = imipData;

  if (!uid || !attendeeEmail || !partstat) {
    throw new TypeError('Missing required fields in iMIP REPLY');
  }

  // Determine the organizer email
  if (!organizerEmail) {
    logger.warn('iMIP REPLY missing organizer email', {
      uid,
      attendeeEmail,
      messageId: options.messageId
    });
  }

  // Check for existing unprocessed invite with same UID and attendee
  const existingInvite = await CalendarInvites.findOne({
    eventUid: uid,
    attendeeEmail: attendeeEmail.toLowerCase(),
    processed: false
  });

  if (existingInvite) {
    // Update existing invite if response changed
    if (existingInvite.response !== partstat) {
      existingInvite.response = partstat;
      existingInvite.source = 'imip';
      existingInvite.sourceMessageId = options.messageId;
      existingInvite.ip = options.remoteAddress;
      existingInvite.updated_at = new Date();
      await existingInvite.save();

      logger.info('Updated existing iMIP REPLY invite', {
        inviteId: existingInvite._id,
        uid,
        attendeeEmail,
        oldResponse: existingInvite.response,
        newResponse: partstat
      });

      return existingInvite;
    }

    // Same response, no update needed
    logger.debug('Duplicate iMIP REPLY ignored', {
      uid,
      attendeeEmail,
      partstat
    });
    return existingInvite;
  }

  // Create new CalendarInvites record
  const invite = await CalendarInvites.create({
    eventUid: uid,
    organizerEmail: organizerEmail ? organizerEmail.toLowerCase() : null,
    attendeeEmail: attendeeEmail.toLowerCase(),
    response: partstat,
    source: 'imip',
    sourceMessageId: options.messageId,
    ip: options.remoteAddress,
    processed: false,
    processAttempts: 0
  });

  logger.info('Created iMIP REPLY invite', {
    inviteId: invite._id,
    uid,
    organizerEmail,
    attendeeEmail,
    partstat,
    messageId: options.messageId,
    remoteAddress: options.remoteAddress
  });

  return invite;
}

/**
 * Check if an email contains an iMIP REPLY and process it with security validation
 *
 * This is the main entry point called from the email processing pipeline.
 *
 * SECURITY CHECKS PERFORMED:
 * 1. Sender/Attendee email match verification (prevents spoofing)
 * 2. Rate limiting (prevents abuse and replay attacks)
 *
 * NOTE: DKIM/DMARC validation is already handled by the MX server before
 * the message reaches this code. Messages that fail DMARC with p=reject
 * are rejected at the SMTP level (see is-authenticated-message.js).
 *
 * @param {Object} parsedEmail - Parsed email from mailparser
 * @param {Object} options - Additional options
 * @param {string} [options.messageId] - Email Message-ID
 * @param {string} [options.fromEmail] - Sender email (From header)
 * @param {string} [options.toEmail] - Recipient email (organizer)
 * @param {Object} [options.client] - Redis client for rate limiting
 * @param {string} [options.remoteAddress] - Sender IP address
 * @returns {Promise<Object|null>} Processing result or null if not an iMIP REPLY
 */
async function checkAndProcessImipReply(parsedEmail, options = {}) {
  // Extract iMIP REPLY data
  const imipData = extractImipReply(parsedEmail);

  if (!imipData) {
    return null;
  }

  // If organizer email not in the REPLY, use the recipient email
  if (!imipData.organizerEmail && options.toEmail) {
    imipData.organizerEmail = options.toEmail.toLowerCase();
  }

  const securityContext = {
    uid: imipData.uid,
    attendeeEmail: imipData.attendeeEmail,
    senderEmail: options.fromEmail,
    messageId: options.messageId,
    remoteAddress: options.remoteAddress
  };

  //
  // SECURITY CHECK 1: Sender/Attendee Match
  // Prevents spoofing where someone sends a REPLY claiming to be another attendee
  //
  if (options.fromEmail) {
    const senderValidation = validateSenderAttendeeMatch(
      options.fromEmail,
      imipData.attendeeEmail
    );

    if (!senderValidation.valid) {
      logger.warn('iMIP REPLY rejected - sender mismatch', {
        ...securityContext,
        code: senderValidation.code,
        reason: senderValidation.reason
      });

      return {
        processed: false,
        rejected: true,
        code: senderValidation.code,
        reason: senderValidation.reason,
        imipData
      };
    }
  }

  //
  // SECURITY CHECK 2: Rate Limiting
  // Prevents abuse and replay attacks
  //
  if (options.client) {
    const rateLimitResult = await checkRateLimits(
      options.client,
      options.fromEmail || imipData.attendeeEmail,
      imipData.uid,
      imipData.attendeeEmail
    );

    if (!rateLimitResult.allowed) {
      logger.warn('iMIP REPLY rejected - rate limited', {
        ...securityContext,
        code: rateLimitResult.code,
        reason: rateLimitResult.reason
      });

      return {
        processed: false,
        rejected: true,
        code: rateLimitResult.code,
        reason: rateLimitResult.reason,
        imipData
      };
    }
  }

  //
  // All security checks passed - process the REPLY
  //
  try {
    const invite = await processImipReply(imipData, {
      messageId: options.messageId,
      fromEmail: options.fromEmail,
      remoteAddress: options.remoteAddress
    });

    logger.info('iMIP REPLY processed successfully', {
      ...securityContext,
      inviteId: invite._id,
      partstat: imipData.partstat
    });

    return {
      processed: true,
      invite,
      imipData
    };
  } catch (err) {
    logger.error('Failed to process iMIP REPLY', {
      ...securityContext,
      error: err.message
    });

    return {
      processed: false,
      error: err.message,
      imipData
    };
  }
}

module.exports = {
  extractImipReply,
  parseImipReply,
  processImipReply,
  checkAndProcessImipReply,
  validateSenderAttendeeMatch,
  checkRateLimits,
  RESPONSE_PARTSTAT,
  SECURITY_CODES,
  RATE_LIMIT_MAX_PER_HOUR,
  RATE_LIMIT_MAX_PER_EVENT_ATTENDEE_PER_HOUR
};
