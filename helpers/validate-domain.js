/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('lodash');
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
  // NOTE: if the domain is suspended then the state is "pending" not queued
  //
  // if (_.isDate(domain.smtp_suspended_sent_at))
  //   throw new SMTPError('Domain is suspended from outbound SMTP access');

  if (!domain.has_smtp) {
    if (!_.isDate(domain.smtp_verified_at))
      throw new SMTPError(
        `Domain is not configured for outbound SMTP, go to ${config.urls.web}/my-account/domains/${domain.name}/verify-smtp and click "Verify"`,
        {
          responseCode: 535,
          ignoreHook: true
        }
      );

    throw new SMTPError(
      `Domain is pending admin approval for outbound SMTP access, please check your inbox and provide us with requested information or contact us at ${config.supportEmail}`,
      {
        responseCode: 535,
        ignoreHook: true
      }
    );
  }

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
