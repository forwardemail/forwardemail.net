/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const _ = require('#helpers/lodash');

const Domains = require('#models/domains');
const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');

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

// eslint-disable-next-line complexity
async function verifySMTP(ctx) {
  try {
    const redirectTo = ctx.state.l(
      `/my-account/domains/${punycode.toASCII(
        ctx.state.domain.name
      )}/verify-smtp`
    );
    const domain = await Domains.findById(ctx.state.domain._id);
    if (!domain)
      throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

    // get recipients and the majority favored locale
    const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(domain);

    // set locale of domain
    domain.locale = ctx.locale;
    domain.resolver = ctx.resolver;

    const { ns, dkim, returnPath, dmarc, errors } = await Domains.verifySMTP(
      domain,
      ctx.resolver
    );

    // skip verification since this is separate from domain forwarding setup
    domain.skip_verification = true;

    // store when we last checked smtp
    domain.smtp_last_checked_at = new Date();

    //
    // run a save on the domain name
    // (as long as `errors` does not have a temporary DNS error)
    //
    const hasDNSError =
      Array.isArray(errors) &&
      errors.some((err) => err.code && DNS_RETRY_CODES.has(err.code));

    // return early if DNS error occurred
    if (hasDNSError) {
      // save the domain
      await domain.save();

      const err = new Error(
        errors.length === 1
          ? errors[0]
          : ctx.translate('MULTIPLE_VERIFICATION_ERRORS')
      );
      err.no_translate = true;
      if (errors.length > 1) err.errors = errors;
      throw err;
    }

    const isVerified = dkim && returnPath && dmarc;

    if (domain.has_smtp && !isVerified) {
      domain.smtp_verified_at = undefined;
      if (!_.isDate(domain.missing_smtp_sent_at)) {
        // if the domain has_smtp and it is not verified
        // and it hasn't been sent error notification
        // then send the notification and mark it as being sent
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
      // TODO: if user already had a domain approved
      // TODO: if A record and good domain then auto approve and email admins and users
      if (!_.isDate(domain.smtp_verified_at)) {
        // otherwise if the domain was newly verified
        // and doesn't have smtp yet then email admins
        const subject = i18n.translate(
          'SMTP_ACCESS_SUBJECT',
          locale,
          domain.name
        );
        const message = i18n.translate(
          'SMTP_ACCESS_PENDING',
          locale,
          domain.name
        );
        await Promise.all([
          emailHelper({
            template: 'alert',
            message: {
              to,
              subject
            },
            locals: {
              message,
              locale
            }
          }),
          emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              replyTo: to,
              subject
            },
            locals: {
              message: `<a href="${config.urls.web}/admin/domains?name=${domain.name}" class="btn btn-dark btn-md">Review Domain</a>`,
              locale
            }
          })
        ]);
        domain.smtp_verified_at = new Date();
        if (!ctx.api) ctx.flash('success', message);
      }
    }

    // set the values (since we are skipping some verification)
    domain.has_dkim_record = dkim;
    domain.has_return_path_record = returnPath;
    domain.has_dmarc_record = dmarc;
    if (ns) domain.ns = ns;

    // save the domain
    await domain.save();

    if (!isVerified) {
      if (errors.length > 0) {
        const err = new Error(
          errors.length === 1
            ? errors[0]
            : ctx.translate('MULTIPLE_VERIFICATION_ERRORS')
        );
        err.no_translate = true;
        if (errors.length > 1) err.errors = errors;
        throw err;
      }

      // safeguard
      ctx.logger.fatal(
        new TypeError('Edge case occurred with SMTP verification'),
        { domain, ns, dkim, returnPath, dmarc, errors }
      );
      throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));
    }

    let extra;
    if (errors.length > 0) {
      extra =
        errors.length === 1
          ? errors[0].message
          : `<ul class="text-left mb-0">${errors
              .map(
                (e) => `<li class="mb-3">${e && e.message ? e.message : e}</li>`
              )
              .join('')}</ul>`;
      if (!ctx.api) ctx.flash('warning', extra);
    }

    const text = ctx.translate('EMAIL_SMTP_IS_VERIFIED');

    if (ctx.api) {
      const response = [text];
      if (extra) response.push(extra);
      ctx.body = response.join(' ');
      return;
    }

    // if everything OK then success
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text,
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (_err) {
    ctx.logger.error(_err);

    let err = _err;
    if (Array.isArray(err.errors)) {
      let message;
      if (ctx.api) {
        message = err.errors.map((e) => e.message);
      } else {
        message = `<ul class="text-left mb-0">${err.errors
          .map((e) => `<li class="mb-3">${e && e.message ? e.message : e}</li>`)
          .join('')}</ul>`;
      }

      err = Boom.badRequest(message);
    }

    throw err;
  }
}

module.exports = verifySMTP;
