/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Domains = require('#models/domains');
const SMTPError = require('#helpers/smtp-error');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const isValidPassword = require('#helpers/is-valid-password');
const logger = require('#helpers/logger');

//
// Find the user a domain-wide catch-all password sends as.
//
// That is the admin who generated the password. If they are banned, are no
// longer an admin of the domain, or are a system admin on a customer domain,
// the password is re-assigned to another admin (and the admins are emailed),
// or removed when there is none.
//
// Used by outbound SMTP and by `POST /v1/emails`, the only two places a
// catch-all password is accepted. `domain` must be a document with `tokens`
// selected and `members.user` populated, and `password` is the plain text
// password the client sent. `tokenId` is the catch-all password that login
// matched, if known: only that one is checked again, instead of each one
// (an argon2 verification apiece) until one matches.
//
async function getCatchallTokenUser(
  domain,
  password,
  { session, resolver, tokenId } = {}
) {
  let user;
  //
  // NOTE: if no alias was found then we can assume it's a domain catch-all password
  //       so we will assign the user to be either the user that generated the token
  //       or if that user no longer an admin of the domain then we'll email admins
  //       (and leave it up to them if they want to purge it, but at least we will re-assign)
  //
  //       this also yields us the opportunity to validate that the in-memory password is still valid
  //
  let isValid = false;
  let tokenUsed;
  if (tokenId && Array.isArray(domain.tokens)) {
    // (it must still exist, and still be this password)
    const token = domain.tokens.id(tokenId);
    if (token) {
      isValid = await isValidPassword([token], password, domain);
      if (isValid) tokenUsed = token;
    }
  } else if (Array.isArray(domain.tokens) && domain.tokens.length > 0) {
    for (const token of domain.tokens) {
      isValid = await isValidPassword([token], password, domain);
      if (isValid) {
        tokenUsed = token;
        break; // break out early if we found one that is valid
      }
    }
  }

  if (!isValid)
    throw new SMTPError(
      `Invalid password, please try again or go to ${
        config.urls.web
      }/my-account/domains/${punycode.toASCII(
        domain.name
      )}/aliases and click "Generate Password"`,
      {
        responseCode: 535
        // ignoreHook: true
      }
    );

  // now that we have `tokenUsed` we can perform a lookup on `tokenUsed.user`
  user = await Users.findById(tokenUsed.user)
    .select(
      `id email plan group ${config.userFields.isBanned} ${config.userFields.smtpLimit} ${config.userFields.smtpReputationTier} ${config.userFields.smtpBaselineDaily} ${config.userFields.smtpBaselineAt} ${config.userFields.smtpBaselineHourly} ${config.userFields.smtpReputationHoldUntil} ${config.userFields.smtpReputationHoldReason} ${config.userFields.smtpReputationLendHoldUntil} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID} smtp_rate_limit_sent_at ${config.userFields.fullEmail} ${config.lastLocaleField}`
    )
    .lean()
    .exec();

  let reassign = false; // should we re-assign token and alert admins (?)

  // if user exists then ensure they are not banned and still an admin of domain
  if (user) {
    // user must not be banned
    if (user[config.userFields.isBanned]) reassign = true;
    // alias must still be an admin
    else if (
      !domain.members.some(
        (m) => m.user && m.user.id === user.id && m.group === 'admin'
      )
    )
      reassign = true;
    // system admins cannot send from customer domains (e.g. a password a
    // system admin generated while helping a customer)
    else if (
      user.group === 'admin' &&
      domain.members.some(
        (m) =>
          m.group === 'admin' &&
          m.user &&
          !m.user[config.userFields.isBanned] &&
          m.user.group !== 'admin'
      )
    )
      reassign = true;
  } else {
    reassign = true;
  }

  //
  // if we need to reassign then find first admin that is not banned
  // reassign the token to the first admin found
  // alert admins of the token reassignment (if user then share email otherwise don't)
  //
  if (reassign) {
    // (the customer rather than a system admin, if the domain has one)
    const admins = domain.members.filter(
      (m) =>
        m.group === 'admin' && m.user && !m.user[config.userFields.isBanned]
    );
    const admin = admins.find((m) => m.user.group !== 'admin') || admins[0];
    // if no admin exists then purge token as a safeguard and alert system admins
    if (admin) {
      const token = domain.tokens.id(tokenUsed._id);
      token.user = admin.user._id;
      domain.skip_verification = true;
      domain.skip_payment_check = true;
      // Set audit metadata for system-initiated token reassignment
      domain.__audit_metadata = {
        isSystem: true
      };
      await domain.save();
      const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
        domain
      );
      // email the admins of the domain
      emailHelper({
        template: 'alert',
        message: {
          to,
          locale,
          subject: 'Domain catch-all generated password re-assigned'
        },
        locals: {
          locale,
          message: `Domain catch-all generated password has been re-assigned from ${
            user ? user.email : '<unknown user>'
          } to ${
            admin.user.email
          } since the user no longer existed, is no longer an admin of the domain, or is a system administrator.`
        }
      })
        .then()
        .catch((err) => logger.fatal(err, { session, resolver }));

      //
      // reassign user to the admin
      // (after we send email to keep preservation of variables for message/subject)
      // (`admin` is the domain member, `admin.user` is the populated user)
      //
      user = admin.user;
    } else {
      domain.tokens.id(tokenUsed._id).remove();
      domain.skip_verification = true;
      domain.skip_payment_check = true;
      // Set audit metadata for system-initiated token removal
      domain.__audit_metadata = {
        isSystem: true
      };
      await domain.save();
      // alert admins of the edge case
      const err = new TypeError(
        `Domain name ${domain.name} (ID ${domain.id}) was using a catch-all alias that no longer has a valid admin/user assigned and SMTP onData attempted`
      );
      logger.error(err, { session, resolver });
      // throw an error that password is not valid
      throw new SMTPError('Catch-all password no longer exists', {
        responseCode: 535
      });
    }
  }

  return user;
}

module.exports = getCatchallTokenUser;
