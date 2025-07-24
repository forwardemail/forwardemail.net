/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const { isIP } = require('node:net');

const MimeNode = require('nodemailer/lib/mime-node');
const ip = require('ip');
const isFQDN = require('is-fqdn');
const { convert } = require('html-to-text');

const getErrorCode = require('./get-error-code');
const getDiagnosticCode = require('./get-diagnostic-code');
const _ = require('#helpers/lodash');
const config = require('#config');

const HOSTNAME = os.hostname();
const IP_ADDRESS = ip.address();

function createBounce(email, error, message) {
  const code = getErrorCode(error);
  const isDelayed = code < 500;

  const rootNode = new MimeNode(
    'multipart/report; report-type=delivery-status'
  );

  rootNode.setHeader('From', email.envelope.from);
  rootNode.setHeader('To', email.envelope.to);
  rootNode.setHeader('Precedence', 'auto_reply');
  rootNode.setHeader('Auto-Submitted', 'auto-replied');
  rootNode.setHeader('X-Failed-Recipients', error.recipient);
  rootNode.setHeader('X-Auto-Response-Suppress', 'All');
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

  const response = convert(error.response || error.message, {
    wordwrap: false,
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'ul', options: { itemPrefix: ' ' } },
      {
        selector: 'a',
        options: { baseUrl: config.urls.web, linkBrackets: false }
      }
    ]
  });

  rootNode
    .createChild('text/plain; charset=utf-8')
    .setHeader('Content-Description', 'Notification')
    .setContent(
      [
        `Your message ${
          isDelayed
            ? 'is delayed and will be retried later'
            : "wasn't delivered"
        } to ${error.recipient} due to an error.`,
        '',
        'The response was:',
        '',
        response
      ].join('\n')
    );

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

  const arr = [
    `Arrival-Date: ${new Date(email.date)
      .toUTCString()
      .replace(/GMT/, '+0000')}`,
    `Final-Recipient: rfc822; ${error.recipient}`,
    `Action: ${isDelayed ? 'delayed' : 'failed'}`,
    `Status: ${isDelayed ? '4.0.0' : '5.0.0'}`,
    `Diagnostic-Code: smtp; ${getDiagnosticCode(error)}`
  ];

  if (isFQDN(error.target) || isIP(error.target))
    arr.push(`Remote-MTA: dns; ${error.target}`);

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

  rootNode.createChild('message/rfc822').setContent(message);

  return rootNode.createReadStream();
}

module.exports = createBounce;
