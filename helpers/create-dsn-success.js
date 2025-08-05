/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');

const MimeNode = require('nodemailer/lib/mime-node');
const ip = require('ip');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const getRawHeaders = require('#helpers/get-raw-headers');

const HOSTNAME = os.hostname();
const IP_ADDRESS = ip.address();

async function createDSNSuccess(email, recipient, deliveryTime) {
  const rootNode = new MimeNode(
    'multipart/report; report-type=delivery-status'
  );

  // Use DSN envelope ID if available
  let envelopeId;
  if (isSANB(email?.dsn?.id)) envelopeId = email.dsn.id;

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

  rootNode
    .createChild('text/plain; charset=utf-8')
    .setHeader('Content-Description', 'Notification')
    .setContent(
      [
        `Your message was successfully delivered to ${recipient}.`,
        '',
        `Delivery completed at: ${deliveryTime
          .toUTCString()
          .replace(/GMT/, '+0000')}`
      ].join('\n')
    );

  const arr = [
    `Arrival-Date: ${new Date(deliveryTime)
      .toUTCString()
      .replace(/GMT/, '+0000')}`,
    `Final-Recipient: rfc822; ${recipient}`,
    `Action: delivered`,
    `Status: 2.0.0`,
    `Last-Attempt-Date: ${deliveryTime.toUTCString().replace(/GMT/, '+0000')}`
  ];

  // Add DSN-specific fields if available
  if (envelopeId) arr.push(`Original-Envelope-Id: ${envelopeId}`);

  // Add Original-Recipient if available from DSN parameters
  if (isSANB(email.dsn?.recipient)) {
    arr.push(`Original-Recipient: ${email.dsn.recipient}`);
  } else if (email.envelope?.rcptTo) {
    const recipient = email.envelope.rcptTo.find(
      (rcpt) => rcpt.address === recipient
    );
    if (recipient?.dsn?.orcpt) {
      arr.push(`Original-Recipient: ${recipient.dsn.orcpt}`);
    }
  }

  arr.push(
    `Reporting-MTA: dns; ${HOSTNAME}`,
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

  if (email.id) arr.push(`X-Forward-Email-ID: ${email.id}`);

  // TODO: add X-Forward-Email-Session-ID here (?)

  rootNode
    .createChild('message/delivery-status')
    .setHeader('Content-Description', 'Delivery report')
    .setContent(arr.join('\n'));

  // Respect RET parameter
  if (typeof email.dsn === 'object' && email.dsn.return === 'full') {
    rootNode.createChild('message/rfc822').setContent(email.raw || '');
  } else {
    // Default to headers only when RET=HDRS or not specified
    const headers = await getRawHeaders(email.raw || '');
    rootNode.createChild('text/rfc822-headers').setContent(headers);
  }

  return rootNode.createReadStream();
}

module.exports = createDSNSuccess;
