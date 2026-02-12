/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Process iMIP Messages Helper
 *
 * This helper processes incoming iMIP messages from external email systems
 * (O365, Gmail, Apple Mail, Thunderbird, etc.) and queues them for processing
 * during CalDAV sync.
 *
 * Supported iTIP methods (RFC 5546):
 * - REPLY: Attendee responds to organizer (ACCEPTED/DECLINED/TENTATIVE/DELEGATED)
 * - REQUEST: Organizer sends/updates event invitation to attendees
 * - CANCEL: Organizer cancels event or removes attendees
 * - ADD: Organizer adds recurrence instances
 * - REFRESH: Attendee requests organizer to re-send event
 * - COUNTER: Attendee proposes alternative time
 * - DECLINECOUNTER: Organizer declines counter-proposal
 * - PUBLISH: Event broadcast (no scheduling, informational only)
 *
 * SECURITY NOTES:
 * - DKIM/DMARC validation is already handled by the MX server (is-authenticated-message.js)
 * - Messages that fail DMARC with p=reject are rejected before reaching this code
 * - We still validate sender/attendee match for REPLY to prevent spoofing
 * - Rate limiting prevents abuse and replay attacks
 * - SEQUENCE validation prevents processing stale messages
 *
 * @see https://tools.ietf.org/html/rfc5546 - iTIP
 * @see https://tools.ietf.org/html/rfc6047 - iMIP
 * @see https://tools.ietf.org/html/rfc6638 - CalDAV Scheduling
 */

const ICAL = require('ical.js');

const CalendarInvites = require('#models/calendar-invites');
const logger = require('#helpers/logger');

/**
 * All supported iTIP methods
 */
const SUPPORTED_METHODS = new Set([
  'REPLY',
  'REQUEST',
  'CANCEL',
  'ADD',
  'REFRESH',
  'COUNTER',
  'DECLINECOUNTER',
  'PUBLISH'
]);

/**
 * Rate limit: max iMIP messages per sender per hour
 */
const RATE_LIMIT_MAX_PER_HOUR = 50;

/**
 * Rate limit: max iMIP messages per event/attendee per hour
 */
const RATE_LIMIT_MAX_PER_EVENT_ATTENDEE_PER_HOUR = 5;

/**
 * Maximum ICS data size (100KB) to prevent DoS
 */
const MAX_ICS_SIZE = 100_000;

/**
 * Security validation result codes
 */
const SECURITY_CODES = {
  VALID: 'valid',
  SENDER_MISMATCH: 'sender_attendee_mismatch',
  RATE_LIMITED: 'rate_limit_exceeded',
  INVALID_DATA: 'invalid_imip_data',
  STALE_SEQUENCE: 'stale_sequence'
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
 * Validate that the email sender matches the organizer (for REQUEST/CANCEL/ADD)
 *
 * @param {string} senderEmail - The email sender (From header)
 * @param {string} organizerEmail - The organizer email in the iTIP message
 * @returns {Object} Validation result { valid: boolean, code: string, reason: string }
 */
function validateSenderOrganizerMatch(senderEmail, organizerEmail) {
  const normalizedSender = normalizeEmail(senderEmail);
  const normalizedOrganizer = normalizeEmail(organizerEmail);

  if (!normalizedSender || !normalizedOrganizer) {
    return {
      valid: false,
      code: SECURITY_CODES.SENDER_MISMATCH,
      reason: 'Missing sender or organizer email'
    };
  }

  // Exact match
  if (normalizedSender === normalizedOrganizer) {
    return { valid: true, code: SECURITY_CODES.VALID, reason: 'Exact match' };
  }

  // Check SENT-BY: organizer may delegate sending to another address
  // Allow same-domain match for organizational delegation
  const senderDomain = extractDomain(normalizedSender);
  const organizerDomain = extractDomain(normalizedOrganizer);

  if (senderDomain && organizerDomain) {
    const senderParts = senderDomain.split('.');
    const organizerParts = organizerDomain.split('.');

    if (senderParts.length >= 2 && organizerParts.length >= 2) {
      const senderRoot = senderParts.slice(-2).join('.');
      const organizerRoot = organizerParts.slice(-2).join('.');

      if (senderRoot === organizerRoot) {
        return {
          valid: true,
          code: SECURITY_CODES.VALID,
          reason: 'Same organization domain'
        };
      }
    }
  }

  return {
    valid: false,
    code: SECURITY_CODES.SENDER_MISMATCH,
    reason: `Sender ${normalizedSender} does not match organizer ${normalizedOrganizer}`
  };
}

/**
 * Check rate limits for iMIP message processing
 *
 * @param {Object} client - Redis client
 * @param {string} senderEmail - Sender email
 * @param {string} eventUid - Event UID
 * @param {string} targetEmail - Target email (attendee for REPLY, organizer for REQUEST)
 * @returns {Promise<Object>} Rate limit result { allowed: boolean, code: string, reason: string }
 */
async function checkRateLimits(client, senderEmail, eventUid, targetEmail) {
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
  const hourAgo = now - 3_600_000;

  try {
    // Check per-sender rate limit
    const senderKey = `imip_rate:sender:${normalizeEmail(senderEmail)}`;
    const senderCount = await client.zcount(senderKey, hourAgo, now);

    if (senderCount >= RATE_LIMIT_MAX_PER_HOUR) {
      logger.warn('iMIP rate limit exceeded for sender', {
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

    // Check per-event/target rate limit (prevents replay attacks)
    const eventKey = `imip_rate:event:${eventUid}:${normalizeEmail(
      targetEmail
    )}`;
    const eventCount = await client.zcount(eventKey, hourAgo, now);

    if (eventCount >= RATE_LIMIT_MAX_PER_EVENT_ATTENDEE_PER_HOUR) {
      logger.warn('iMIP rate limit exceeded for event/target', {
        eventUid,
        targetEmail,
        count: eventCount,
        limit: RATE_LIMIT_MAX_PER_EVENT_ATTENDEE_PER_HOUR
      });
      return {
        allowed: false,
        code: SECURITY_CODES.RATE_LIMITED,
        reason: `Event/target rate limit exceeded (${eventCount}/${RATE_LIMIT_MAX_PER_EVENT_ATTENDEE_PER_HOUR} per hour)`
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
 * Extract iMIP data from a parsed email for any supported iTIP method
 *
 * @param {Object} parsedEmail - Parsed email from mailparser (simpleParser)
 * @returns {Object|null} Extracted iMIP data or null if not a valid iTIP message
 */
function extractImipMessage(parsedEmail) {
  if (!parsedEmail) return null;

  // Look for text/calendar content in the email
  let icalData = null;

  // Check attachments for ICS files (highest priority - most reliable)
  if (parsedEmail.attachments) {
    for (const attachment of parsedEmail.attachments) {
      if (
        (attachment.contentType &&
          (attachment.contentType.includes('text/calendar') ||
            attachment.contentType.includes('application/ics'))) ||
        (attachment.filename && attachment.filename.endsWith('.ics'))
      ) {
        const content = attachment.content.toString('utf8');
        if (content.includes('BEGIN:VCALENDAR')) {
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
        if (content.includes('BEGIN:VCALENDAR')) {
          icalData = content;
          break;
        }
      }
    }
  }

  // Check direct text content (some clients embed it directly)
  if (
    !icalData &&
    parsedEmail.text &&
    parsedEmail.text.includes('BEGIN:VCALENDAR')
  ) {
    icalData = parsedEmail.text;
  }

  // Check for calendar content in HTML alternatives (last resort)
  if (!icalData && parsedEmail.html) {
    const calMatch = parsedEmail.html.match(
      /BEGIN:VCALENDAR[\s\S]*?END:VCALENDAR/
    );
    if (calMatch) {
      icalData = calMatch[0];
    }
  }

  if (!icalData) return null;

  return parseImipMessage(icalData);
}

/**
 * Parse iMIP ICS data for any supported iTIP method
 *
 * @param {string} icalData - Raw ICS calendar data
 * @returns {Object|null} Parsed iMIP data or null if invalid
 */
function parseImipMessage(icalData) {
  if (!icalData || typeof icalData !== 'string') return null;

  try {
    // Input validation - limit size to prevent DoS
    if (icalData.length > MAX_ICS_SIZE) {
      logger.warn('iMIP message rejected - ICS data too large', {
        size: icalData.length
      });
      return null;
    }

    const jcalData = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcalData);

    // Extract METHOD
    const method = comp.getFirstPropertyValue('method');
    if (!method) {
      // No METHOD means this is not an iTIP message
      return null;
    }

    const normalizedMethod = method.toUpperCase();
    if (!SUPPORTED_METHODS.has(normalizedMethod)) {
      logger.warn('iMIP message with unsupported method', {
        method: normalizedMethod
      });
      return null;
    }

    // Get the VEVENT or VTODO component
    const vevent = comp.getFirstSubcomponent('vevent');
    const vtodo = comp.getFirstSubcomponent('vtodo');
    const component = vevent || vtodo;

    if (!component) {
      // VFREEBUSY is handled separately
      const vfreebusy = comp.getFirstSubcomponent('vfreebusy');
      if (vfreebusy) {
        return {
          method: normalizedMethod,
          componentType: 'VFREEBUSY',
          uid: vfreebusy.getFirstPropertyValue('uid'),
          raw: icalData
        };
      }

      logger.warn('iMIP message has no VEVENT, VTODO, or VFREEBUSY');
      return null;
    }

    const componentType = vevent ? 'VEVENT' : 'VTODO';

    // Extract UID with validation
    const uid = component.getFirstPropertyValue('uid');
    if (!uid || typeof uid !== 'string' || uid.length > 512) {
      logger.warn('iMIP message rejected - invalid UID', { uid });
      return null;
    }

    // Extract organizer email
    let organizerEmail = null;
    let organizerCn = null;
    let organizerSentBy = null;
    const organizer = component.getFirstProperty('organizer');
    if (organizer) {
      const organizerValue = organizer.getFirstValue();
      if (organizerValue) {
        organizerEmail = organizerValue.replace(/^mailto:/i, '').toLowerCase();
      }

      // Fallback to EMAIL parameter if value is not mailto:
      if (!organizerEmail || !organizerEmail.includes('@')) {
        const emailParam = organizer.getParameter('email');
        if (emailParam) {
          organizerEmail = emailParam.toLowerCase();
        }
      }

      organizerCn = organizer.getParameter('cn') || null;
      organizerSentBy = organizer.getParameter('sent-by') || null;
      if (organizerSentBy) {
        organizerSentBy = organizerSentBy
          .replace(/^["']?mailto:/i, '')
          .replace(/["']$/, '')
          .toLowerCase();
      }
    }

    // Extract attendees
    const attendeeProps = component.getAllProperties('attendee');
    const attendees = [];
    for (const prop of attendeeProps) {
      const value = prop.getFirstValue();
      let email = value ? value.replace(/^mailto:/i, '') : null;

      // Fallback to EMAIL parameter
      if ((!email || !email.includes('@')) && prop.getParameter('email')) {
        email = prop.getParameter('email');
      }

      if (!email) continue;

      attendees.push({
        email: email.toLowerCase(),
        cn: prop.getParameter('cn') || null,
        partstat: (
          prop.getParameter('partstat') || 'NEEDS-ACTION'
        ).toUpperCase(),
        role: prop.getParameter('role') || 'REQ-PARTICIPANT',
        rsvp: prop.getParameter('rsvp') === 'TRUE',
        cutype: prop.getParameter('cutype') || 'INDIVIDUAL',
        delegatedFrom: prop.getParameter('delegated-from')
          ? prop
              .getParameter('delegated-from')
              .replace(/^["']?mailto:/i, '')
              .replace(/["']$/, '')
              .toLowerCase()
          : null,
        delegatedTo: prop.getParameter('delegated-to')
          ? prop
              .getParameter('delegated-to')
              .replace(/^["']?mailto:/i, '')
              .replace(/["']$/, '')
              .toLowerCase()
          : null,
        scheduleAgent: prop.getParameter('schedule-agent') || null
      });
    }

    // Extract event properties
    const summary = component.getFirstPropertyValue('summary') || null;
    const sequence = component.getFirstPropertyValue('sequence') || 0;
    const dtstamp = component.getFirstPropertyValue('dtstamp');
    const dtstart = component.getFirstPropertyValue('dtstart');
    const dtend = component.getFirstPropertyValue('dtend');
    const recurrenceId = component.getFirstPropertyValue('recurrence-id');
    const status = component.getFirstPropertyValue('status') || null;

    // Build result based on method
    const result = {
      method: normalizedMethod,
      componentType,
      uid,
      organizerEmail,
      organizerCn,
      organizerSentBy,
      attendees,
      summary,
      sequence,
      dtstamp: dtstamp ? dtstamp.toString() : null,
      dtstart: dtstart ? dtstart.toString() : null,
      dtend: dtend ? dtend.toString() : null,
      recurrenceId: recurrenceId ? recurrenceId.toString() : null,
      status,
      raw: icalData
    };

    // For REPLY, extract the responding attendee specifically
    if (normalizedMethod === 'REPLY') {
      const respondingAttendee = attendees.find(
        (a) =>
          a.partstat &&
          ['ACCEPTED', 'DECLINED', 'TENTATIVE', 'DELEGATED'].includes(
            a.partstat
          )
      );
      if (respondingAttendee) {
        result.attendeeEmail = respondingAttendee.email;
        result.partstat = respondingAttendee.partstat;
      } else if (
        attendees.length === 1 &&
        attendees[0].partstat !== 'NEEDS-ACTION'
      ) {
        // RFC 5546: REPLY must have exactly one attendee with explicit PARTSTAT
        result.attendeeEmail = attendees[0].email;
        result.partstat = attendees[0].partstat;
      } else {
        logger.warn('iMIP REPLY has no valid responding attendee');
        return null;
      }
    }

    // For COUNTER, extract the counter-proposing attendee
    if (normalizedMethod === 'COUNTER' && attendees.length === 1) {
      result.attendeeEmail = attendees[0].email;
      result.partstat = attendees[0].partstat;
    }

    return result;
  } catch (err) {
    logger.error('Failed to parse iMIP message', { error: err.message });
    return null;
  }
}

/**
 * Process a validated iMIP message and create/update CalendarInvites record
 *
 * @param {Object} imipData - Parsed iMIP data from parseImipMessage()
 * @param {Object} options - Additional options
 * @param {string} [options.messageId] - Original email Message-ID for tracking
 * @param {string} [options.fromEmail] - Sender email address
 * @param {string} [options.toEmail] - Recipient email address
 * @param {string} [options.remoteAddress] - Sender IP address
 * @returns {Promise<Object>} Created CalendarInvites document
 */
async function processImipMessage(imipData, options = {}) {
  if (!imipData || !imipData.method) {
    throw new TypeError('Invalid iMIP data');
  }

  const { uid, method } = imipData;

  if (!uid) {
    throw new TypeError('Missing UID in iMIP data');
  }

  // Determine the target email (who should process this)
  // For REPLY: organizer processes it
  // For REQUEST/CANCEL/ADD: attendee (recipient) processes it
  // For REFRESH: organizer processes it
  // For COUNTER: organizer processes it
  // For DECLINECOUNTER: attendee processes it
  let targetEmail;
  let attendeeEmail;

  switch (method) {
    case 'REPLY':
    case 'REFRESH':
    case 'COUNTER': {
      // Organizer processes these
      targetEmail = imipData.organizerEmail || options.toEmail;
      attendeeEmail = imipData.attendeeEmail || imipData.attendees?.[0]?.email;
      break;
    }

    case 'REQUEST':
    case 'CANCEL':
    case 'ADD':
    case 'DECLINECOUNTER': {
      // Attendee (recipient) processes these
      targetEmail = options.toEmail;
      attendeeEmail = options.toEmail;
      break;
    }

    default: {
      // PUBLISH - informational only
      targetEmail = options.toEmail;
      attendeeEmail = options.toEmail;
      break;
    }
  }

  if (!targetEmail) {
    logger.warn('iMIP message missing target email', {
      uid,
      method,
      messageId: options.messageId
    });
  }

  // Determine the response/partstat for the CalendarInvites record
  let response;
  switch (method) {
    case 'REPLY': {
      response = imipData.partstat || 'NEEDS-ACTION';
      break;
    }

    case 'REQUEST': {
      response = 'NEEDS-ACTION';
      break;
    }

    case 'CANCEL': {
      response = 'CANCELLED';
      break;
    }

    default: {
      response = 'NEEDS-ACTION';
      break;
    }
  }

  // Check for existing unprocessed invite with same UID and method
  const query = {
    eventUid: uid,
    processed: false
  };

  if (method === 'REPLY') {
    // For REPLY, match on attendee email
    query.attendeeEmail = (attendeeEmail || '').toLowerCase();
    query.method = 'REPLY';
  } else {
    // For other methods, match on method and target
    query.method = method;
    if (targetEmail) {
      query.organizerEmail = targetEmail.toLowerCase();
    }
  }

  const existingInvite = await CalendarInvites.findOne(query);

  if (existingInvite) {
    // Update existing invite
    const updateFields = {
      source: 'imip',
      sourceMessageId: options.messageId,
      ip: options.remoteAddress,
      updated_at: new Date()
    };

    // For REPLY, update response if changed
    if (method === 'REPLY' && existingInvite.response !== response) {
      updateFields.response = response;
    }

    // For REQUEST/CANCEL/ADD, update rawIcs with latest
    if (['REQUEST', 'CANCEL', 'ADD', 'COUNTER'].includes(method)) {
      updateFields.rawIcs = imipData.raw;
    }

    // Update sequence if newer
    if (
      imipData.sequence !== undefined &&
      imipData.sequence > (existingInvite.sequence || 0)
    ) {
      updateFields.sequence = imipData.sequence;
      updateFields.rawIcs = imipData.raw;
    }

    const updatedInvite = await CalendarInvites.findOneAndUpdate(
      { _id: existingInvite._id },
      { $set: updateFields },
      { new: true }
    );

    logger.info('Updated existing iMIP invite', {
      inviteId: existingInvite._id,
      uid,
      method,
      response
    });

    return updatedInvite;
  }

  // Create new CalendarInvites record
  const inviteData = {
    eventUid: uid,
    organizerEmail:
      method === 'REPLY' || method === 'REFRESH' || method === 'COUNTER'
        ? (imipData.organizerEmail || targetEmail || '').toLowerCase()
        : (targetEmail || '').toLowerCase(),
    attendeeEmail: (attendeeEmail || '').toLowerCase(),
    response,
    method,
    source: 'imip',
    sourceMessageId: options.messageId,
    ip: options.remoteAddress,
    processed: false,
    processAttempts: 0
  };

  // Store raw ICS for methods that need the full data
  if (
    ['REQUEST', 'CANCEL', 'ADD', 'COUNTER', 'DECLINECOUNTER'].includes(method)
  ) {
    inviteData.rawIcs = imipData.raw;
  }

  // Store sequence for stale message detection
  if (imipData.sequence !== undefined) {
    inviteData.sequence = imipData.sequence;
  }

  const invite = await CalendarInvites.create(inviteData);

  logger.info('Created iMIP invite', {
    inviteId: invite._id,
    uid,
    method,
    organizerEmail: inviteData.organizerEmail,
    attendeeEmail: inviteData.attendeeEmail,
    response,
    messageId: options.messageId,
    remoteAddress: options.remoteAddress
  });

  return invite;
}

/**
 * Check if an email contains an iMIP message and process it with security validation
 *
 * This is the main entry point called from the email processing pipeline.
 *
 * SECURITY CHECKS PERFORMED:
 * 1. Sender/Attendee or Sender/Organizer match verification (prevents spoofing)
 * 2. Rate limiting (prevents abuse and replay attacks)
 *
 * NOTE: DKIM/DMARC validation is already handled by the MX server before
 * the message reaches this code.
 *
 * @param {Object} parsedEmail - Parsed email from mailparser
 * @param {Object} options - Additional options
 * @param {string} [options.messageId] - Email Message-ID
 * @param {string} [options.fromEmail] - Sender email (From header)
 * @param {string} [options.toEmail] - Recipient email
 * @param {Object} [options.client] - Redis client for rate limiting
 * @param {string} [options.remoteAddress] - Sender IP address
 * @returns {Promise<Object|null>} Processing result or null if not an iMIP message
 */
async function checkAndProcessImipMessage(parsedEmail, options = {}) {
  // Extract iMIP data for any method
  const imipData = extractImipMessage(parsedEmail);

  if (!imipData) {
    return null;
  }

  // PUBLISH is informational only - no processing needed
  if (imipData.method === 'PUBLISH') {
    logger.debug('iMIP PUBLISH message received - informational only', {
      uid: imipData.uid
    });
    return null;
  }

  // Check SCHEDULE-AGENT=CLIENT - if set, the client handles scheduling
  if (imipData.attendees) {
    const allClientScheduled = imipData.attendees.every(
      (a) => a.scheduleAgent && a.scheduleAgent.toUpperCase() === 'CLIENT'
    );
    if (allClientScheduled && imipData.attendees.length > 0) {
      logger.debug('iMIP message skipped - SCHEDULE-AGENT=CLIENT', {
        uid: imipData.uid,
        method: imipData.method
      });
      return null;
    }
  }

  // If organizer email not in the message, use the recipient email
  if (!imipData.organizerEmail && options.toEmail) {
    imipData.organizerEmail = options.toEmail.toLowerCase();
  }

  const securityContext = {
    uid: imipData.uid,
    method: imipData.method,
    senderEmail: options.fromEmail,
    messageId: options.messageId,
    remoteAddress: options.remoteAddress
  };

  //
  // SECURITY CHECK 1: Sender Match
  // For REPLY/REFRESH/COUNTER: sender must match the attendee
  // For REQUEST/CANCEL/ADD/DECLINECOUNTER: sender must match the organizer
  //
  if (options.fromEmail) {
    let senderValidation;

    if (['REPLY', 'REFRESH', 'COUNTER'].includes(imipData.method)) {
      // Sender should be the attendee
      const attendeeEmail =
        imipData.attendeeEmail || imipData.attendees?.[0]?.email;
      if (attendeeEmail) {
        senderValidation = validateSenderAttendeeMatch(
          options.fromEmail,
          attendeeEmail
        );
      }
    } else if (
      ['REQUEST', 'CANCEL', 'ADD', 'DECLINECOUNTER'].includes(
        imipData.method
      ) && // Sender should be the organizer
      imipData.organizerEmail
    ) {
      senderValidation = validateSenderOrganizerMatch(
        options.fromEmail,
        imipData.organizerEmail
      );
    }

    if (senderValidation && !senderValidation.valid) {
      logger.warn('iMIP message rejected - sender mismatch', {
        ...securityContext,
        code: senderValidation.code,
        reason: senderValidation.reason
      });

      return {
        processed: false,
        rejected: true,
        method: imipData.method,
        code: senderValidation.code,
        reason: senderValidation.reason,
        imipData
      };
    }
  }

  //
  // SECURITY CHECK 2: Rate Limiting
  //
  if (options.client) {
    const targetEmail =
      imipData.method === 'REPLY'
        ? imipData.attendeeEmail
        : options.toEmail || imipData.organizerEmail;

    const rateLimitResult = await checkRateLimits(
      options.client,
      options.fromEmail || imipData.organizerEmail || '',
      imipData.uid,
      targetEmail || ''
    );

    if (!rateLimitResult.allowed) {
      logger.warn('iMIP message rejected - rate limited', {
        ...securityContext,
        code: rateLimitResult.code,
        reason: rateLimitResult.reason
      });

      return {
        processed: false,
        rejected: true,
        method: imipData.method,
        code: rateLimitResult.code,
        reason: rateLimitResult.reason,
        imipData
      };
    }
  }

  //
  // All security checks passed - process the message
  //
  try {
    const invite = await processImipMessage(imipData, {
      messageId: options.messageId,
      fromEmail: options.fromEmail,
      toEmail: options.toEmail,
      remoteAddress: options.remoteAddress
    });

    logger.info('iMIP message processed successfully', {
      ...securityContext,
      inviteId: invite._id,
      method: imipData.method,
      partstat: imipData.partstat
    });

    return {
      processed: true,
      method: imipData.method,
      invite,
      imipData
    };
  } catch (err) {
    logger.error('Failed to process iMIP message', {
      ...securityContext,
      error: err.message
    });

    return {
      processed: false,
      method: imipData.method,
      error: err.message,
      imipData
    };
  }
}

module.exports = {
  checkAndProcessImipMessage
};
