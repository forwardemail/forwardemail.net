/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');

const SMTPError = require('#helpers/smtp-error');
const i18n = require('#helpers/i18n');

const config = require('#config');

function validateDomain(domain, domainName) {
  if (!domain)
    throw new SMTPError(
      `Domain does not exist with current TXT verification record, go to ${config.urls.web}/my-account/domains/${domainName} and click "Verify"`,
      { responseCode: 535, ignoreHook: true }
    );

  if (domain.is_global)
    throw new SMTPError(
      i18n.translate('EMAIL_SMTP_GLOBAL_NOT_PERMITTED', 'en')
    );

  //
  // validate that at least one paying, non-banned admin on >= same plan without expiration
  //
  const validPlans =
    domain.plan === 'team' ? ['team'] : ['team', 'enhanced_protection'];

  if (
    !domain.members.some(
      (m) =>
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
    throw new SMTPError(i18n.translate('PAST_DUE_OR_INVALID_ADMIN', 'en'));
}

module.exports = validateDomain;
