/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const dayjs = require('dayjs-with-plugins');

const Domains = require('#models/domains');
const Emails = require('#models/emails');
const checkAndAutoApproveSMTP = require('#helpers/check-and-auto-approve-smtp');
const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const isTimeoutError = require('#helpers/is-timeout-error');
const _ = require('#helpers/lodash');

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
  // NOTE: ENOTFOUND indicates the record doesn't exist
  'ENOTFOUND',
  'ENOTIMP',
  'ENOTINITIALIZED',
  'EOF',
  'EREFUSED',
  // NOTE: ESERVFAIL indicates the NS does not work
  'ESERVFAIL',
  'ETIMEOUT'
]);

//
// The user an approval of the domain is for: the one who sent its latest
// outbound email, or else its first admin (whose KYC counts towards an
// automatic approval, and who replies to support go to)
//
async function getUserId(domain) {
  const email = await Emails.findOne({ domain: domain._id })
    .sort({ created_at: -1 })
    .select('user')
    .lean()
    .exec();
  if (email?.user) return email.user.toString();
  const admin = (domain.members || []).find(
    (m) => m.group === 'admin' && m.user
  );
  if (admin) return (admin.user._id || admin.user).toString();
}

/**
 * Check a domain's outbound SMTP records (`jobs/check-smtp`) and save them.
 *
 * A domain that is not approved yet, was never sent to support, and whose
 * records verify is approved automatically when it qualifies, as with the
 * "Verify" button, or else support is asked to approve it (once, see
 * `request-smtp-approval`): its admins may never click "Verify" or send an
 * email. A domain whose records
 * stop verifying has its admins told (when it sent mail in the past month).
 *
 * @param   {*}       id                 Domain ID
 * @param   {object}  options
 * @param   {object}  options.resolver   Tangerine resolver instance
 * @param   {object}  [options.client]   Redis client (the domain check verdict)
 * @returns {Promise<void>}
 */
async function checkSMTPDomain(id, { resolver, client }) {
  const domain = await Domains.findById(id);

  // it could have been deleted by the user mid-process
  if (!domain) return;

  // if the domain was checked since this job started
  if (
    _.isDate(domain.smtp_last_checked_at) &&
    new Date(domain.smtp_last_checked_at).getTime() >=
      dayjs().subtract(2, 'hour').toDate().getTime()
  )
    return;

  const {
    ns,
    dkim,
    returnPath,
    dmarc,
    strictDmarc,
    spf,
    autoconfig,
    autodiscover,
    errors,
    isVerified
  } = await checkAndAutoApproveSMTP({
    domain,
    resolver,
    client,
    //
    // only a domain nobody asked to approve yet is approved automatically
    // or sent to support (one with `smtp_verified_at` was already sent, or
    // was reviewed, e.g. an admin turned its SMTP access off; without a
    // user the helper only verifies its records)
    //
    userId:
      domain.has_smtp || _.isDate(domain.smtp_verified_at)
        ? undefined
        : await getUserId(domain),
    requestApproval: true
  });

  // skip verification since this is separate from domain forwarding setup
  domain.skip_verification = true;

  // store when we last checked smtp
  domain.smtp_last_checked_at = new Date();

  // Set audit metadata for system-initiated background job
  domain.__audit_metadata = {
    isSystem: true
  };

  //
  // run a save on the domain name
  // (as long as `errors` does not have a temporary DNS error)
  //
  const hasDNSError =
    Array.isArray(errors) &&
    errors.some(
      (err) =>
        (err.code && DNS_RETRY_CODES.has(err.code)) || isTimeoutError(err)
    );

  // return early if DNS error occurred
  if (hasDNSError) {
    await domain.save();
    return;
  }

  if (domain.has_smtp && !isVerified) {
    domain.smtp_verified_at = undefined;

    // only email the user if there were emails in the past 30+ days
    // (otherwise we spam users that may no longer use outbound smtp)
    const count = _.isDate(domain.missing_smtp_sent_at)
      ? 0
      : await Emails.countDocuments({
          domain: domain._id,
          created_at: {
            $gte: dayjs().subtract(1, 'month').toDate()
          }
        });

    if (count > 0) {
      // if the domain has_smtp and it is not verified
      // and it hasn't been sent error notification
      // then send the notification and mark it as being sent
      const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
        domain
      );
      const subject =
        config.views.locals.emoji('warning') +
        ' ' +
        i18n.translate('SMTP_ERROR_SUBJECT', locale, domain.name);
      const message = i18n.translate(
        'SMTP_ERROR_MESSAGE',
        locale,
        domain.name,
        `${config.urls.web}/${locale}/my-account/domains/${punycode.toASCII(
          domain.name
        )}/verify-smtp`
      );
      await emailHelper({
        template: 'alert',
        message: {
          to,
          subject
        },
        locals: {
          message,
          locale
        }
      });
      domain.missing_smtp_sent_at = new Date();
    }
  } else if (!domain.has_smtp && isVerified) {
    domain.missing_smtp_sent_at = undefined;
  }

  // set the values (since we are skipping some verification)
  domain.has_dkim_record = dkim;
  domain.has_return_path_record = returnPath;
  domain.has_dmarc_record = dmarc;
  domain.has_strict_dmarc = strictDmarc;
  domain.has_spf_record = spf;
  domain.has_autoconfig_record = autoconfig;
  domain.has_autodiscover_record = autodiscover;
  if (ns) domain.ns = ns;

  // save the domain
  await domain.save();

  //
  // TODO: store historical checks (so we can evaluate Cloudflare accuracy)
  // TODO: if the last 3 historical checks failed in a
  //       row failed including this one then send an email alert
  //
}

module.exports = checkSMTPDomain;
