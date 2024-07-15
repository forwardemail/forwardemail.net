/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const { isEmail } = require('validator');

const SMTPError = require('#helpers/smtp-error');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const refineAndLogError = require('#helpers/refine-and-log-error');

function onMailFrom(address, session, fn) {
  this.logger.debug('MAIL FROM', { address, session });

  if (this.isClosing) return setImmediate(() => fn(new ServerShutdownError()));

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
      )
    );

  setImmediate(fn);
}

module.exports = onMailFrom;
