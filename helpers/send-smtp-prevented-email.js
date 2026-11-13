/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');

//
// Tell a domain's admins that an outbound message was prevented from
// delivery (Spam Scanner found a virus, a program attachment, a malware link,
// or spam), once a day at most for the domain; never throws
//
// - `Domains`: the model (passed in, as the Emails model uses this too)
// - `category`: "virus" or "spam"
// - `email`: { envelope, messageId, subject, date }
//
async function sendSmtpPreventedEmail({
  Domains,
  client,
  domain,
  category,
  responseCode = 554,
  response,
  email
}) {
  // (without a domain, or Redis to send it once a day at most, it is not
  //  sent)
  if (!domain?.id || typeof client?.set !== 'function') return;
  const key = `smtp_prevented:${domain.id}`;
  try {
    // (taken first, so messages prevented at once send one email)
    if ((await client.set(key, true, 'PX', ms('1d'), 'NX')) !== 'OK') return;
    const obj = await Domains.getToAndMajorityLocaleByDomain(domain);
    await emailHelper({
      template: 'smtp-prevented',
      message: { to: obj.to },
      locals: {
        domain:
          typeof domain.toObject === 'function' ? domain.toObject() : domain,
        locale: obj.locale,
        category,
        responseCode,
        response,
        truthSource: config.webHost,
        email
      }
    });
  } catch (err) {
    logger.fatal(err);
    // (not sent: may be sent for the next one)
    try {
      await client.del?.(key);
    } catch {}
  }
}

module.exports = sendSmtpPreventedEmail;
