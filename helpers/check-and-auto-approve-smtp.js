/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');

// <https://github.com/nodejs/node/blob/08dd4b1723b20d56fbedf37d52e736fe09715f80/lib/dns.js#L296-L320>
// <https://docs.rs/c-ares/4.0.3/c_ares/enum.Error.html>
const DNS_RETRY_CODES = new Set([
  'EADDRGETNETWORKPARAMS',
  'EBADFAMILY',
  'EBADFLAGS',
  'EBADHINTS',
  'EBADNAME',
  'EBADQUERY',
  'EBADRESP',
  'EBADSTR',
  'ECANCELED',
  'ECANCELLED',
  'ECONNREFUSED',
  'EDESTRUCTION',
  'EFILE',
  'EFORMERR',
  'ELOADIPHLPAPI',
  // NOTE: ENODATA indicates there were no records set for MX or TXT
  // 'ENODATA',
  'ENOMEM',
  'ENONAME',
  // NOTE: ENOTFOUND indicates the domain doesn't exist
  // 'ENOTFOUND',
  'ENOTIMP',
  'ENOTINITIALIZED',
  'EOF',
  'EREFUSED',
  // NOTE: ESERVFAIL indicates the NS does not work
  'ESERVFAIL',
  'ETIMEOUT'
]);

/**
 * Attempt to auto-approve SMTP access for a domain.
 *
 * This mirrors the auto-approval logic from the "Verify SMTP" button flow
 * (`app/controllers/web/my-account/verify-smtp.js`).  It is intended to be
 * called from:
 *   - `app/controllers/web/my-account/verify-smtp.js` (web/API verify button)
 *   - `helpers/on-data-smtp.js` (SMTP DATA handler)
 *   - `app/models/emails.js` (API email queue method)
 *
 * when `domain.has_smtp` is not yet `true` and DNS records are verified.
 *
 * @param   {object}  options
 * @param   {object}  options.domain         Mongoose Domain document (must NOT be lean)
 * @param   {object}  options.resolver       Tangerine resolver instance
 * @param   {string}  [options.userId]       The ObjectId (as string) of the sending user
 *                                           (required if `user` is not provided)
 * @param   {object}  [options.user]         User object with at least `has_passed_kyc`
 *                                           (if not provided, will be looked up via `userId`)
 * @param   {Array}   [options.userDomains]  Pre-loaded array of user's admin domains
 *                                           (e.g. `ctx.state.domains`); if not provided,
 *                                           will be queried from the database
 * @returns {Promise<object>}  Result object with:
 *   - `isVerified` {boolean}  Whether DKIM, Return-Path, and DMARC all pass
 *   - `isAutoApproved` {boolean}  Whether the domain was auto-approved
 *   - `ns` {Array|false}  Nameservers from verifySMTP
 *   - `dkim` {boolean}
 *   - `returnPath` {boolean}
 *   - `dmarc` {boolean}
 *   - `strictDmarc` {boolean}
 *   - `spf` {boolean}
 *   - `autoconfig` {boolean}
 *   - `autodiscover` {boolean}
 *   - `hasLegitimateHosting` {boolean}
 *   - `errors` {Array}
 *   - `hasDNSError` {boolean}
 */
async function checkAndAutoApproveSMTP(options) {
  const { domain, resolver, userDomains } = options;
  let { user, userId } = options;

  //
  // 1. Run DNS verification (same as the verify-smtp button)
  //
  domain.locale = domain.locale || i18n.config.defaultLocale;
  domain.resolver = resolver;

  const verifyResult = await Domains.verifySMTP(domain, resolver);
  const {
    ns,
    dkim,
    returnPath,
    dmarc,
    strictDmarc,
    spf,
    autoconfig,
    autodiscover,
    hasLegitimateHosting,
    errors
  } = verifyResult;

  const isVerified = dkim && returnPath && dmarc;

  //
  // Check for temporary DNS errors – if any occurred the results
  // are unreliable so we should not auto-approve.
  //
  const hasDNSError =
    Array.isArray(errors) &&
    errors.some((err) => err.code && DNS_RETRY_CODES.has(err.code));

  const result = {
    isVerified,
    isAutoApproved: false,
    ns,
    dkim,
    returnPath,
    dmarc,
    strictDmarc,
    spf,
    autoconfig,
    autodiscover,
    hasLegitimateHosting,
    errors,
    hasDNSError
  };

  // If DNS records are not all verified or DNS errors occurred, we cannot auto-approve
  if (!isVerified || hasDNSError) return result;

  // Domain already has SMTP – nothing to auto-approve
  if (domain.has_smtp) return result;

  //
  // 2. Resolve the user's KYC status
  //
  if (!user && userId) {
    user = await Users.findById(userId)
      .select('id has_passed_kyc')
      .lean()
      .exec();
  }

  if (!user) return result;

  if (!userId) {
    userId = user.id || (user._id ? user._id.toString() : undefined);
  }

  //
  // 3. Determine existing approved domains and suspended domains
  //    Use pre-loaded `userDomains` if available (e.g. from `ctx.state.domains`),
  //    otherwise query the database.
  //
  let hasExistingApprovedDomains;
  let hasSomeSuspendedDomains;

  if (Array.isArray(userDomains)) {
    // ctx.state.domains has a `group` virtual set by retrieveDomains middleware
    hasExistingApprovedDomains = userDomains.some(
      (d) =>
        d.has_smtp &&
        !d.is_smtp_suspended &&
        d.group === 'admin' &&
        d._id.toString() !== domain._id.toString()
    );

    hasSomeSuspendedDomains = userDomains.some(
      (d) => d.is_smtp_suspended && d.group === 'admin'
    );
  } else {
    // Query the database for the user's admin domains
    const adminDomains = await Domains.find({
      members: {
        $elemMatch: {
          user: userId,
          group: 'admin'
        }
      }
    })
      .select('_id has_smtp is_smtp_suspended smtp_suspended_sent_at')
      .lean()
      .exec();

    hasExistingApprovedDomains = adminDomains.some(
      (d) =>
        d.has_smtp &&
        !d.is_smtp_suspended &&
        d._id.toString() !== domain._id.toString()
    );

    hasSomeSuspendedDomains = adminDomains.some((d) => d.is_smtp_suspended);
  }

  // Check if domain TLD is in config.goodDomains
  const domainTld = domain.name.split('.').pop().toLowerCase();
  const isGoodDomainTld = config.goodDomains.includes(domainTld);

  //
  // 4. Evaluate auto-approval criteria (same as verify-smtp.js)
  //
  // Auto-approve SMTP if:
  // 1. User has passed KYC (know your customer check), OR
  // 2. Domain has a good TLD AND legitimate hosting AND no suspended domains, OR
  // 3. Domain has a good TLD AND user has other approved domains AND no suspended domains
  //
  const shouldAutoApprove =
    user.has_passed_kyc ||
    (isGoodDomainTld &&
      ((hasLegitimateHosting && !hasSomeSuspendedDomains) ||
        (hasExistingApprovedDomains && !hasSomeSuspendedDomains)));

  if (!shouldAutoApprove) return result;

  //
  // 5. Auto-approve: set has_smtp and save
  //
  domain.has_smtp = true;
  domain.smtp_verified_at = new Date();
  domain.missing_smtp_sent_at = undefined;
  domain.skip_verification = true;

  // Set audit metadata for system-initiated auto-approval
  domain.__audit_metadata = {
    isSystem: true
  };

  await domain.save();

  result.isAutoApproved = true;

  //
  // 6. Send notification emails (non-blocking – fire and forget)
  //
  const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(domain);

  const autoApprovalSubject = i18n.translate(
    'SMTP_AUTO_APPROVAL_SUBJECT',
    locale,
    domain.name
  );

  // Notify alerts email about auto-approval with metadata
  emailHelper({
    template: 'alert',
    message: {
      to: config.alertsEmail,
      replyTo: to,
      subject: autoApprovalSubject
    },
    locals: {
      message: `
        <ul>
          <li><strong>Auto-approved:</strong> true</li>
          <li><strong>Has passed KYC:</strong> ${user.has_passed_kyc.toString()}</li>
          <li><strong>Legitimate Hosting:</strong> ${hasLegitimateHosting.toString()}</li>
          <li><strong>Suspended Domains:</strong> ${hasSomeSuspendedDomains.toString()}</li>
          <li><strong>Approved Domains:</strong> ${hasExistingApprovedDomains.toString()}</li>
          <li>
            <strong>NS Provider(s):</strong>
            ${
              ns && ns.length > 0
                ? `<ul><li>${ns.join('</li><li>')}</li></ul>`
                : ''
            }
          </li>
        </ul>
        <a href="${config.urls.web}/admin/domains?name=${
        domain.name
      }" class="btn btn-dark btn-md">Review Domain</a>
        `.trim(),
      locale
    }
  })
    .then()
    .catch((err) => logger.fatal(err));

  // Notify domain admins that SMTP access has been enabled
  emailHelper({
    template: 'alert',
    message: {
      to,
      subject: i18n.translate(
        'EMAIL_SMTP_ACCESS_ENABLED_SUBJECT',
        locale,
        domain.name
      )
    },
    locals: {
      message: i18n.translate(
        'EMAIL_SMTP_ACCESS_ENABLED_MESSAGE',
        locale,
        domain.name,
        `${config.urls.web}/${locale}/my-account/domains/${punycode.toASCII(
          domain.name
        )}/verify-smtp`
      ),
      locale
    }
  })
    .then()
    .catch((err) => logger.fatal(err));

  return result;
}

module.exports = checkAndAutoApproveSMTP;
