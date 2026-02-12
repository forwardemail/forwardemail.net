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
const { convert } = require('html-to-text');

const _ = require('#helpers/lodash');
const config = require('#config');
const getDiagnosticCode = require('#helpers/get-diagnostic-code');
const getErrorCode = require('#helpers/get-error-code');
const getRawHeaders = require('#helpers/get-raw-headers');
const parseEnhancedStatusCode = require('#helpers/parse-enhanced-status-code');

const HOSTNAME = os.hostname();
const IP_ADDRESS = ip.address();

const HTML_TO_TEXT_OPTIONS = {
  wordwrap: false,
  selectors: [
    { selector: 'img', format: 'skip' },
    { selector: 'ul', options: { itemPrefix: ' ' } },
    {
      selector: 'a',
      options: { baseUrl: config.urls.web, linkBrackets: false }
    }
  ]
};

/**
 * Create an RFC 3464-compliant Delivery Status Notification for failed or delayed delivery.
 *
 * The DSN is a multipart/report message with three MIME parts:
 *   1. text/plain — Human-readable notification with detailed error information
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
 * @param {object}        email   - The email object (with envelope, messageId, dsn, date, id)
 * @param {object}        error   - The error object (with recipient, response, responseCode, target, mx, date, message)
 * @param {string|Buffer} message - The original message content
 * @returns {Promise<ReadableStream>} A readable stream of the DSN message
 */
async function createBounce(email, error, message) {
  const code = getErrorCode(error);
  const isDelayed = code < 500;

  const rootNode = new MimeNode(
    'multipart/report; report-type=delivery-status'
  );

  // Use DSN envelope ID if available (RFC 3461 ENVID parameter)
  let envelopeId;
  if (isSANB(email?.dsn?.id)) envelopeId = email.dsn.id;

  //
  // Extract delivery details from the error object.
  //
  // The error object is enriched in send-email.js catch blocks with:
  //   error.target       — the target domain (e.g. "example.com")
  //   error.port         — the port number
  //   error.mx           — session.mx object: { host, port, hostname, ... }
  //   error.response     — the SMTP response string
  //   error.responseCode — the SMTP response code number
  //   error.command      — the SMTP command that was rejected (sometimes)
  //

  // The remote MTA hostname (prefer mx.hostname from mx-connect, fall back to target)
  const remoteMtaHostname = resolveRemoteMta(error);

  // The remote MTA IP address
  const remoteMtaIp = resolveRemoteMtaIp(error);

  // Parse the enhanced status code from the SMTP response (RFC 3463)
  // This resolves the TODO: "rewrite this with Enhanced Status Codes"
  const enhancedStatus = parseEnhancedStatusCode(error, code);

  // The full SMTP diagnostic code (uses existing getDiagnosticCode helper)
  const diagnosticCode = getDiagnosticCode(error);

  // The response text for human-readable display (convert HTML to text)
  const responseText = convert(
    error.response || error.message,
    HTML_TO_TEXT_OPTIONS
  );

  //
  // Build formatted dates per RFC 2822 (required by RFC 3464)
  //
  const errorDate =
    _.isDate(error.date) || _.isDate(new Date(error.date))
      ? new Date(error.date)
      : new Date();
  const formattedLastAttemptDate = errorDate
    .toUTCString()
    .replace(/GMT/, '+0000');
  const formattedArrivalDate = new Date(email.date)
    .toUTCString()
    .replace(/GMT/, '+0000');

  //
  // === Message headers ===
  //

  rootNode.setHeader('From', email.envelope.from);
  rootNode.setHeader('To', email.envelope.to);
  rootNode.setHeader('Precedence', 'auto_reply');
  rootNode.setHeader('Auto-Submitted', 'auto-replied');
  rootNode.setHeader('X-Failed-Recipients', error.recipient);
  rootNode.setHeader('X-Auto-Response-Suppress', 'All');

  // Add DSN-specific headers
  if (envelopeId) rootNode.setHeader('X-DSN-Envelope-ID', envelopeId);

  if (isDelayed) {
    if (_.isDate(error.date) || _.isDate(new Date(error.date)))
      rootNode.setHeader(
        'Last-Attempt-Date',
        new Date(error.date).toUTCString().replace(/GMT/, '+0000')
      );
    rootNode.setHeader(
      'Will-Retry-Until',
      new Date(new Date(error.date).getTime() + config.maxRetryDuration)
        .toUTCString()
        .replace(/GMT/, '+0000')
    );
  }

  rootNode.setHeader(
    'Subject',
    `Delivery Status Notification (${isDelayed ? 'Delayed' : 'Failure'})`
  );

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
  const humanLines = [];

  if (isDelayed) {
    humanLines.push(
      'There was a temporary problem delivering your message to the following recipient:',
      ''
    );
  } else {
    humanLines.push(
      'Your message could not be delivered to the following recipient:',
      ''
    );
  }

  // Build the detailed per-recipient line
  if (remoteMtaHostname && isSANB(error.response)) {
    // Full detail with SMTP response
    const ipPart = remoteMtaIp ? ` [${remoteMtaIp}]` : '';
    const portPart = error.port ? `:${error.port}` : ':25';
    humanLines.push(
      `<${error.recipient}> (host '${remoteMtaHostname}'${ipPart}${portPart}: ${diagnosticCode})`
    );
  } else if (isSANB(error.response)) {
    // We have a response but no MX hostname
    humanLines.push(
      `<${error.recipient}> (remote server responded: ${diagnosticCode})`
    );
  } else if (remoteMtaHostname) {
    // We have a hostname but the error is not an SMTP response (e.g. connection error)
    const ipPart = remoteMtaIp ? ` [${remoteMtaIp}]` : '';
    humanLines.push(
      `<${error.recipient}> (connection to '${remoteMtaHostname}'${ipPart} failed: ${responseText})`
    );
  } else {
    // Minimal fallback
    humanLines.push(`<${error.recipient}> (${responseText})`);
  }

  // Add retry information for delayed messages
  if (isDelayed) {
    const willRetryUntil = new Date(
      errorDate.getTime() + config.maxRetryDuration
    );
    const formattedRetryUntil = willRetryUntil
      .toUTCString()
      .replace(/GMT/, '+0000');
    humanLines.push(
      '',
      `The message will continue to be retried until: ${formattedRetryUntil}`,
      'You will be notified if delivery fails permanently.'
    );
  }

  // TODO: support HTML down the road
  // if (options.template && options.template.html)
  //   rootNode
  //     .createChild('text/html; charset=utf-8')
  //     .setHeader('Content-Description', 'Notification')
  //     .setContent(
  //       options.template.html
  //         .replace(new RE2(/BOUNCE_ADDRESS/g), options.bounce.address)
  //         .replace(
  //           new RE2(/BOUNCE_ERROR_MESSAGE/g),
  //           options.bounce.err.message
  //           // options.bounce.err.response || options.bounce.err.message
  //         )
  //     );

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
    const rcpt = email.envelope.rcptTo.find(
      (r) => r.address === error.recipient
    );
    if (rcpt?.dsn?.orcpt) {
      perRecipientFields.push(`Original-Recipient: rfc822;${rcpt.dsn.orcpt}`);
    }
  }

  // Final-Recipient (RFC 3464 Section 2.3.2) — REQUIRED
  // Action (RFC 3464 Section 2.3.3) — REQUIRED
  // Status (RFC 3464 Section 2.3.4) — REQUIRED
  perRecipientFields.push(
    `Final-Recipient: rfc822;${error.recipient}`,
    `Action: ${isDelayed ? 'delayed' : 'failed'}`,
    `Status: ${enhancedStatus}`
  );

  // Remote-MTA (RFC 3464 Section 2.3.5) — optional
  // SHOULD be present when a remote MTA was involved
  if (remoteMtaHostname) {
    perRecipientFields.push(`Remote-MTA: dns; ${remoteMtaHostname}`);
  }

  // Diagnostic-Code (RFC 3464 Section 2.3.6) — optional but SHOULD be included
  // Last-Attempt-Date (RFC 3464 Section 2.3.7) — optional
  perRecipientFields.push(
    `Diagnostic-Code: smtp; ${diagnosticCode}`,
    `Last-Attempt-Date: ${formattedLastAttemptDate}`
  );

  // Final-Log-ID (RFC 3464 Section 2.3.8) — optional
  if (email.id) {
    perRecipientFields.push(`Final-Log-ID: ${email.id}`);
  }

  // Will-Retry-Until (RFC 3464 Section 2.3.9) — for delayed DSNs only
  // "MUST NOT appear in other DSNs"
  if (isDelayed) {
    const willRetryUntil = new Date(
      errorDate.getTime() + config.maxRetryDuration
    );
    const formattedRetryUntil = willRetryUntil
      .toUTCString()
      .replace(/GMT/, '+0000');
    perRecipientFields.push(`Will-Retry-Until: ${formattedRetryUntil}`);
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
    rootNode.createChild('message/rfc822').setContent(message);
  } else {
    // Default to headers only when RET=HDRS or not specified
    const headers = await getRawHeaders(message);
    rootNode.createChild('text/rfc822-headers').setContent(headers);
  }

  return rootNode.createReadStream();
}

/**
 * Resolve the remote MTA hostname from the error object.
 * Checks error.mx (session mx info) first, then falls back to error.target.
 *
 * @param {object} error - The error object
 * @returns {string} The remote MTA hostname or empty string
 */
function resolveRemoteMta(error) {
  // Prefer the FQDN hostname from mx-connect (most accurate)
  if (error?.mx?.hostname && isFQDN(error.mx.hostname)) {
    return error.mx.hostname;
  }

  // Fall back to mx.host if it's a FQDN
  if (error?.mx?.host && isFQDN(error.mx.host)) {
    return error.mx.host;
  }

  // Fall back to error.target if it's a FQDN or IP
  if (isSANB(error?.target) && (isFQDN(error.target) || isIP(error.target))) {
    return error.target;
  }

  return '';
}

/**
 * Resolve the remote MTA IP address from the error object.
 *
 * @param {object} error - The error object
 * @returns {string} The remote MTA IP address or empty string
 */
function resolveRemoteMtaIp(error) {
  // If mx.host is an IP address (resolved by getTransporter)
  if (error?.mx?.host && isIP(error.mx.host)) {
    return error.mx.host;
  }

  // If error.target is an IP
  if (isSANB(error?.target) && isIP(error.target)) {
    return error.target;
  }

  return '';
}

module.exports = createBounce;
