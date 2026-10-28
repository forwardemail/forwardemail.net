/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Domains = require('#models/domains');
const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const _ = require('#helpers/lodash');

/**
 * Ask support to approve (or deny) outbound SMTP for a domain whose records
 * verify and that was not approved automatically, and tell its admins it is
 * pending.
 *
 * This is the only place an SMTP approval request is sent from, whatever
 * found the domain ready (the "Verify" button, an email sent over SMTP or
 * the API, or the hourly SMTP check), and it is sent once per domain: the
 * request is claimed by setting `smtp_verified_at` while it is unset, so
 * checks running at once do not each send it. When support cannot be
 * emailed, the claim is undone so the next check asks again.
 *
 * An approval request needs someone on the team to act, so it goes to
 * support@ (automatic approvals are sent to alerts@ instead).
 *
 * @param   {object}    options
 * @param   {object}    options.domain                       Mongoose Domain document
 * @param   {string}    [options.userEmail]                  The user who asked for it
 *                                                           (Reply-To; the domain's
 *                                                           admins when there is none)
 * @param   {Array}     [options.ns]                         Nameservers
 * @param   {boolean}   [options.hasLegitimateHosting]
 * @param   {string[]}  [options.flaggedCategories]          What the domain check
 *                                                           flagged it for
 * @param   {boolean}   [options.hasSomeSuspendedDomains]
 * @param   {boolean}   [options.hasExistingApprovedDomains]
 * @returns {Promise<boolean>}  Whether the request was sent (false when it
 *                              was already sent, or the domain was approved)
 */
async function requestSMTPApproval({
  domain,
  userEmail,
  ns,
  hasLegitimateHosting,
  flaggedCategories = [],
  hasSomeSuspendedDomains,
  hasExistingApprovedDomains
}) {
  const now = new Date();
  const { modifiedCount } = await Domains.updateOne(
    {
      _id: domain._id,
      has_smtp: { $ne: true },
      // (unset or null: not requested yet)
      smtp_verified_at: null
    },
    { $set: { smtp_verified_at: now } }
  );
  if (modifiedCount !== 1) return false;
  domain.smtp_verified_at = now;

  // (support is asked even when the admins cannot be emailed)
  let to;
  let locale = domain.locale || i18n.config.defaultLocale;
  try {
    ({ to, locale } = await Domains.getToAndMajorityLocaleByDomain(domain));
  } catch (err) {
    logger.warn(err, { domain: domain.name });
  }

  const subject = i18n.translate('SMTP_ACCESS_SUBJECT', locale, domain.name);

  try {
    await emailHelper({
      template: 'alert',
      message: {
        to: config.supportEmail,
        replyTo: userEmail || to,
        subject
      },
      locals: {
        message: `
          <ul>
            <li><strong>Legitimate Hosting</strong> ${String(
              Boolean(hasLegitimateHosting)
            )}</li>
            <li><strong>Flagged by Domain Check</strong> ${
              flaggedCategories.length > 0
                ? _.escape(flaggedCategories.join(', '))
                : 'No'
            }</li>
            <li><strong>Suspended Domains</strong> ${String(
              Boolean(hasSomeSuspendedDomains)
            )}</li>
            <li><strong>Approved Domains</strong> ${String(
              Boolean(hasExistingApprovedDomains)
            )}</li>
            <li>
              <strong>NS Provider(s):</strong>
              ${
                Array.isArray(ns) && ns.length > 0
                  ? `<ul><li>${ns
                      .map((n) => _.escape(String(n)))
                      .join('</li><li>')}</li></ul>`
                  : ''
              }
            </li>
          </ul>
          <a href="${config.urls.web}/admin/domains?name=${encodeURIComponent(
          domain.name
        )}" class="btn btn-dark btn-md">Review Domain</a>
        `.trim(),
        locale
      }
    });
  } catch (err) {
    // (not sent: the next check asks again)
    await Domains.updateOne(
      { _id: domain._id, smtp_verified_at: now },
      { $unset: { smtp_verified_at: 1 } }
    );
    domain.smtp_verified_at = undefined;
    throw err;
  }

  //
  // the domain's admins are told it is pending
  // (awaited: a job's worker is ended when the job is done; support has
  //  the request either way, so an error here is only logged)
  //
  if (to) {
    try {
      await emailHelper({
        template: 'alert',
        message: {
          to,
          subject
        },
        locals: {
          message: i18n.translate('SMTP_ACCESS_PENDING', locale, domain.name),
          locale
        }
      });
    } catch (err) {
      logger.fatal(err, { domain: domain.name });
    }
  }

  return true;
}

module.exports = requestSMTPApproval;
