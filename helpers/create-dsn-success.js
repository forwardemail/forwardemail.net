/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const { isIP } = require('node:net');

const MimeNode = require('nodemailer/lib/mime-node');
const ip = require('ip');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const getRawHeaders = require('#helpers/get-raw-headers');
const parseEnhancedStatusCode = require('#helpers/parse-enhanced-status-code');

const HOSTNAME = os.hostname();
const IP_ADDRESS = ip.address();

/**
 * Create an RFC 3464-compliant Delivery Status Notification for successful delivery.
 *
 * The DSN is a multipart/report message with three MIME parts:
 *   1. text/plain — Human-readable notification with detailed delivery information
 *   2. message/delivery-status — Machine-readable per-message and per-recipient fields
 *   3. message/rfc822 or text/rfc822-headers — Original message or its headers
 *
 * References:
 *   - RFC 3464: An Extensible Message Format for Delivery Status Notifications
 *   - RFC 3463: Enhanced Mail System Status Codes
 *   - RFC 3461: SMTP Service Extension for Delivery Status Notifications
 *   - RFC 6522: The Multipart/Report Media Type for the Reporting of
 *               Mail System Administrative Messages
 *
 * @param {object} email       - The email object (with envelope, messageId, dsn, raw, date, id)
 * @param {string} recipient   - The recipient email address
 * @param {Date}   deliveryTime - The time of successful delivery
 * @param {object} [options]   - Optional additional data for richer DSN output
 * @param {object} [options.info]    - The nodemailer info object from sendMail()
 * @param {object} [options.session] - The session object containing mx info
 * @returns {Promise<ReadableStream>} A readable stream of the DSN message
 */

async function createDSNSuccess(email, recipient, deliveryTime, options = {}) {
  const { info, session } = options;

  const rootNode = new MimeNode(
    'multipart/report; report-type=delivery-status'
  );

  // Use DSN envelope ID if available (RFC 3461 ENVID parameter)
  let envelopeId;
  if (isSANB(email?.dsn?.id)) envelopeId = email.dsn.id;

  //
  // Extract delivery details from the nodemailer info object and session.
  // These parameters are optional — the function degrades gracefully when
  // they are not provided (backwards compatible with the old 3-arg signature).
  //

  // The SMTP response from the remote server (e.g. "250 2.0.0 Ok: queued as 12345")
  const smtpResponse = isSANB(info?.response) ? info.response : '';

  // The remote MX hostname (e.g. "mx.example.com")
  const remoteMtaHostname = resolveRemoteMta(session);

  // The remote MX IP address (e.g. "192.0.2.1")
  const remoteMtaIp = resolveRemoteMtaIp(session);

  // Parse the enhanced status code from the SMTP response (RFC 3463)
  const enhancedStatus = smtpResponse
    ? parseEnhancedStatusCode(smtpResponse, 250)
    : '2.0.0';

  // Parse the 3-digit SMTP response code
  const smtpCode = parseSmtpCode(smtpResponse, 250);

  // Format the SMTP response text (everything after the code and optional enhanced status)
  const smtpResponseText = parseSmtpResponseText(smtpResponse);

  //
  // Build formatted dates per RFC 2822 (required by RFC 3464)
  //
  const formattedDeliveryTime = deliveryTime
    .toUTCString()
    .replace(/GMT/, '+0000');
  const arrivalDate = email.date ? new Date(email.date) : deliveryTime;
  const formattedArrivalDate = arrivalDate
    .toUTCString()
    .replace(/GMT/, '+0000');

  //
  // === Message headers ===
  //

  rootNode.setHeader('From', email.envelope.from);
  rootNode.setHeader('To', email.envelope.to);
  rootNode.setHeader('Precedence', 'auto_reply');
  rootNode.setHeader('Auto-Submitted', 'auto-replied');
  rootNode.setHeader('X-Successful-Recipients', recipient);
  rootNode.setHeader('X-Auto-Response-Suppress', 'All');

  // Add DSN-specific headers
  if (envelopeId) rootNode.setHeader('X-DSN-Envelope-ID', envelopeId);

  rootNode.setHeader('Subject', 'Delivery Status Notification (Success)');

  if (email.messageId) {
    rootNode.setHeader('In-Reply-To', `<${email.messageId}>`);
    rootNode.setHeader('References', `<${email.messageId}>`);
    rootNode.setHeader('X-Original-Message-ID', `<${email.messageId}>`);
  }

  //
  // === Part 1: Human-readable notification (text/plain) ===
  //
  // Modeled after Postfix DSN style for maximum informativeness.
  // Includes: recipient, remote MTA, IP, SMTP code, enhanced status code, response text.
  //
  const humanLines = [
    'Your message has been successfully delivered to the following recipient:',
    ''
  ];

  // Build the detailed per-recipient line
  if (remoteMtaHostname && smtpResponse) {
    // Full detail: "<addr> (delivered to 'host' [IP] with code NNN (X.Y.Z) 'response text')"
    const ipPart = remoteMtaIp ? ` [${remoteMtaIp}]` : '';
    humanLines.push(
      `<${recipient}> (delivered to '${remoteMtaHostname}'${ipPart} with code ${smtpCode} (${enhancedStatus}) '${smtpResponseText}')`
    );
  } else if (smtpResponse) {
    // We have a response but no MX hostname
    humanLines.push(
      `<${recipient}> (delivered with code ${smtpCode} (${enhancedStatus}) '${smtpResponseText}')`
    );
  } else {
    // Minimal fallback (no info/session provided — backwards compatible)
    humanLines.push(`<${recipient}> (delivered successfully)`);
  }

  humanLines.push('', `Delivery completed at: ${formattedDeliveryTime}`);

  rootNode
    .createChild('text/plain; charset=utf-8')
    .setHeader('Content-Description', 'Notification')
    .setContent(humanLines.join('\n'));

  //
  // === Part 2: Machine-readable delivery-status (message/delivery-status) ===
  //
  // Per RFC 3464 Section 2:
  //   delivery-status-content = per-message-fields 1*( CRLF per-recipient-fields )
  //
  // Per-message fields MUST come first, followed by a blank line,
  // then per-recipient fields for each recipient.
  //

  // --- Per-message fields (RFC 3464 Section 2.2) ---
  const perMessageFields = [];

  // Original-Envelope-Id (RFC 3464 Section 2.2.1) — optional, before Reporting-MTA
  if (envelopeId) {
    perMessageFields.push(`Original-Envelope-Id: ${envelopeId}`);
  }

  // Reporting-MTA (RFC 3464 Section 2.2.2) — REQUIRED
  // Arrival-Date (RFC 3464 Section 2.2.5) — optional but recommended
  perMessageFields.push(
    `Reporting-MTA: dns; ${HOSTNAME}`,
    `Arrival-Date: ${formattedArrivalDate}`
  );

  // --- Per-recipient fields (RFC 3464 Section 2.3) ---
  const perRecipientFields = [];

  // Original-Recipient (RFC 3464 Section 2.3.1) — optional
  if (isSANB(email.dsn?.recipient)) {
    perRecipientFields.push(
      `Original-Recipient: rfc822;${email.dsn.recipient}`
    );
  } else if (email.envelope?.rcptTo) {
    const rcpt = email.envelope.rcptTo.find((r) => r.address === recipient);
    if (rcpt?.dsn?.orcpt) {
      perRecipientFields.push(`Original-Recipient: rfc822;${rcpt.dsn.orcpt}`);
    }
  }

  // Final-Recipient (RFC 3464 Section 2.3.2) — REQUIRED
  // Action (RFC 3464 Section 2.3.3) — REQUIRED
  // Status (RFC 3464 Section 2.3.4) — REQUIRED
  perRecipientFields.push(
    `Final-Recipient: rfc822;${recipient}`,
    'Action: delivered',
    `Status: ${enhancedStatus}`
  );

  // Remote-MTA (RFC 3464 Section 2.3.5) — optional
  // SHOULD be present when delivery was to a remote MTA
  if (remoteMtaHostname) {
    perRecipientFields.push(`Remote-MTA: dns; ${remoteMtaHostname}`);
  }

  // Diagnostic-Code (RFC 3464 Section 2.3.6) — optional but SHOULD be included
  // Include the full SMTP response from the remote server
  if (smtpResponse) {
    perRecipientFields.push(`Diagnostic-Code: smtp; ${smtpResponse}`);
  }

  // Last-Attempt-Date (RFC 3464 Section 2.3.7) — optional
  perRecipientFields.push(`Last-Attempt-Date: ${formattedDeliveryTime}`);

  // Final-Log-ID (RFC 3464 Section 2.3.8) — optional
  if (email.id) {
    perRecipientFields.push(`Final-Log-ID: ${email.id}`);
  }

  // --- Custom X-headers (Forward Email specific) ---
  perRecipientFields.push(
    `X-Report-Abuse-To: ${config.abuseEmail}`,
    `X-Report-Abuse: ${config.abuseEmail}`,
    `X-Complaints-To: ${config.abuseEmail}`,
    `X-Forward-Email-Website: ${config.urls.web}`,
    `X-Forward-Email-Version: ${config.pkg.version}`,
    `X-Forward-Email-Sender: rfc822; ${[
      email.envelope.from,
      HOSTNAME,
      IP_ADDRESS
    ].join(', ')}`
  );

  if (email.id) {
    perRecipientFields.push(`X-Forward-Email-ID: ${email.id}`);
  }

  // TODO: add X-Forward-Email-Session-ID here (?)

  //
  // Assemble the delivery-status body per RFC 3464:
  //   per-message-fields CRLF per-recipient-fields
  //
  const deliveryStatusBody =
    perMessageFields.join('\n') + '\n\n' + perRecipientFields.join('\n');

  rootNode
    .createChild('message/delivery-status')
    .setHeader('Content-Description', 'Delivery report')
    .setContent(deliveryStatusBody);

  // Part 3: Original message or headers (respects RET parameter from RFC 3461)
  if (typeof email.dsn === 'object' && email.dsn.return === 'full') {
    rootNode.createChild('message/rfc822').setContent(email.raw || '');
  } else {
    // Default to headers only when RET=HDRS or not specified
    const headers = await getRawHeaders(email.raw || '');
    rootNode.createChild('text/rfc822-headers').setContent(headers);
  }

  return rootNode.createReadStream();
}

/**
 * Resolve the remote MTA hostname from the session object.
 *
 * @param {object} [session] - The session object
 * @returns {string} The remote MTA hostname or empty string
 */
function resolveRemoteMta(session) {
  // Prefer the FQDN hostname from mx-connect
  if (session?.mx?.hostname && isFQDN(session.mx.hostname)) {
    return session.mx.hostname;
  }

  // Fall back to the host field if it's a FQDN (not an IP)
  if (session?.mx?.host && isFQDN(session.mx.host)) {
    return session.mx.host;
  }

  return '';
}

/**
 * Resolve the remote MTA IP address from the session object.
 *
 * @param {object} [session] - The session object
 * @returns {string} The remote MTA IP address or empty string
 */
function resolveRemoteMtaIp(session) {
  // If mx.host is an IP address (resolved by getTransporter)
  if (session?.mx?.host && isIP(session.mx.host)) {
    return session.mx.host;
  }

  return '';
}

/**
 * Parse the 3-digit SMTP response code from a response string.
 *
 * @param {string} response - The SMTP response string
 * @param {number} [fallback=250] - Fallback code
 * @returns {number} The SMTP response code
 */
function parseSmtpCode(response, fallback = 250) {
  if (typeof response === 'string' && response.length >= 3) {
    const code = Number.parseInt(response.slice(0, 3), 10);
    if (!Number.isNaN(code) && code >= 200 && code < 600) return code;
  }

  return fallback;
}

/**
 * Parse the human-readable response text from an SMTP response string.
 * Strips the leading SMTP code and optional enhanced status code.
 *
 * @param {string} response - The SMTP response string (e.g. "250 2.0.0 Ok: queued as 12345")
 * @returns {string} The response text (e.g. "Ok: queued as 12345")
 */
function parseSmtpResponseText(response) {
  if (typeof response !== 'string' || response.length === 0) return '';

  // Remove the 3-digit SMTP code and optional separator
  let text = response.replace(/^\d{3}[\s-]+/, '');

  // Remove the enhanced status code if present (e.g. "2.0.0 ")
  text = text.replace(/^[245](?:\.\d{1,3}){2}\s+/, '');

  return text.trim();
}

module.exports = createDSNSuccess;
