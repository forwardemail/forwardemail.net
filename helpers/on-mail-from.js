/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const isEmail = require('#helpers/is-email');

const SMTPError = require('#helpers/smtp-error');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const checkSRS = require('#helpers/check-srs');
const env = require('#config/env');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const refineAndLogError = require('#helpers/refine-and-log-error');

function onMailFrom(address, session, fn) {
  this.logger.debug('MAIL FROM', { address, session });

  if (this.isClosing) return setImmediate(() => fn(new ServerShutdownError()));

  // validate email address
  if (typeof address === 'object' && isSANB(address.address)) {
    if (!isEmail(address.address))
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

    //
    // check if it was invalid SRS (pass `shouldThrow` as `true`)
    // (we need to support blank MAIL FROM, e.g. "MAIL FROM: <>")
    //
    try {
      if (parseHostFromDomainOrAddress(address.address) === env.WEB_HOST)
        checkSRS(address.address, true, true);
    } catch (err) {
      return setImmediate(() =>
        fn(refineAndLogError(err, session, false, this))
      );
    }
  }

  setImmediate(fn);
}

module.exports = onMailFrom;
