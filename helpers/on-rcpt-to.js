/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const { isEmail } = require('validator');

const SMTPError = require('#helpers/smtp-error');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const checkSRS = require('#helpers/check-srs');
const config = require('#config');
const env = require('#config/env');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const refineAndLogError = require('#helpers/refine-and-log-error');

async function onRcptTo(address, session, fn) {
  this.logger.debug('RCPT TO', { address, session });

  if (this.isClosing) return setImmediate(() => fn(new ServerShutdownError()));

  // <https://github.com/nodemailer/smtp-server/issues/179>
  if (
    session.envelope.rcptTo &&
    session.envelope.rcptTo.length >= config.maxRecipients
  )
    return setImmediate(() =>
      fn(
        refineAndLogError(
          new SMTPError('Too many recipients', {
            responseCode: 452,
            ignoreHook: true
          }),
          session,
          false,
          this
        )
      )
    );

  // validate email address
  if (
    typeof address === 'object' &&
    isSANB(address.address) &&
    !isEmail(address.address, {
      allow_ip_domain: true,
      ignore_max_length: true
    })
  )
    return setImmediate(() =>
      fn(
        refineAndLogError(
          new SMTPError('Address is not a valid RFC 5321 email address', {
            responseCode: 553,
            ignoreHook: true
          }),
          session,
          false,
          this
        )
      )
    );

  try {
    //
    // check if attempted spoofed or invalid SRS (e.g. fake bounces)
    //
    if (
      parseRootDomain(parseHostFromDomainOrAddress(address.address)) ===
      env.WEB_HOST
    )
      checkSRS(address.address, true, true);

    //
    // if we're on the MX server then we perform a very rudimentary check
    // on the RCPT domain name to see that it actually is set up to receive mail
    // (they do not necessarily need to be ours, but this helps thwart spammers)
    //
    if (this?.constructor?.name === 'MX') {
      const domain = parseHostFromDomainOrAddress(checkSRS(address.address));
      // we don't want to perform a lookup if it's an IP address
      if (isFQDN(domain)) {
        const records = await this.resolver.resolveMx(domain);
        if (!records || records.length === 0)
          throw new SMTPError(
            `${checkSRS(
              address.address
            )} does not have any MX records configured on its domain ${domain}`,
            { ignoreHook: true }
          );
      }
    }
  } catch (err) {
    return setImmediate(() => fn(refineAndLogError(err, session, false, this)));
  }

  setImmediate(fn);
}

module.exports = onRcptTo;
