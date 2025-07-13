/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const isSANB = require('is-string-and-not-blank');

const SMTPError = require('#helpers/smtp-error');
const i18n = require('#helpers/i18n');

const config = require('#config');

function validateDomain(domain, domainName) {
  if (!domain)
    throw new SMTPError(
      `Domain does not exist with current TXT verification record, go to ${
        config.urls.web
      }/my-account/domains/${punycode.toASCII(domainName)} and click "Verify"`,
      { responseCode: 535, ignoreHook: true }
    );

  if (domain.is_global)
    throw new SMTPError(
      i18n.translate(
        'EMAIL_SMTP_GLOBAL_NOT_PERMITTED',
        i18n.config.defaultLocale
      ),
      { responseCode: 535, ignoreHook: true }
    );

  //
  // validate that at least one paying, non-banned admin on >= same plan without expiration
  //
  const validPlans =
    domain.plan === 'team' || domain.plan === 'enterprise'
      ? ['team', 'enterprise']
      : ['team', 'enterprise', 'enhanced_protection'];

  if (
    !domain.members.some(
      (m) =>
        m.user &&
        !m.user[config.userFields.isBanned] &&
        m.user[config.userFields.hasVerifiedEmail] &&
        validPlans.includes(m.user.plan) &&
        (new Date(m.user[config.userFields.planExpiresAt]).getTime() >=
          Date.now() ||
          isSANB(m.user[config.userFields.stripeSubscriptionID]) ||
          isSANB(m.user[config.userFields.paypalSubscriptionID])) &&
        m.group === 'admin'
    )
  )
    throw new SMTPError(
      i18n.translate('PAST_DUE_OR_INVALID_ADMIN', i18n.config.defaultLocale),
      { responseCode: 535, ignoreHook: true }
    );
}

module.exports = validateDomain;
