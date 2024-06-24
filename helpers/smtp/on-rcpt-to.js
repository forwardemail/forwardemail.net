/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const { isEmail } = require('validator');

const SMTPError = require('#helpers/smtp-error');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const config = require('#config');
const refineAndLogError = require('#helpers/refine-and-log-error');

function onRcptTo(address, session, fn) {
  this.logger.debug('RCPT TO', { address, session });

  if (this.server._closeTimeout)
    return setImmediate(() => fn(new ServerShutdownError()));

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
        // session
      )
    );

  // validate email address
  if (
    typeof address === 'object' &&
    isSANB(address.address) &&
    !isEmail(address.address, { ignore_max_length: true })
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
        // session
      )
    );

  setImmediate(fn);
}

module.exports = onRcptTo;
