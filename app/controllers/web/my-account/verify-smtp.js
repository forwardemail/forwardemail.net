const Boom = require('@hapi/boom');
const _ = require('lodash');

const config = require('#config');
const env = require('#config/env');
const emailHelper = require('#helpers/email');
const { Domains } = require('#models');

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

// TODO: automated job for has_dkim_record, has_return_path_record, and has_dmarc_record + email alerts
// TODO: make this into an API endpoint and make the domain return DKIM/DMARC/Return-Path values required

// eslint-disable-next-line complexity
async function verifySMTP(ctx) {
  try {
    let domain = await Domains.findById(ctx.state.domain._id);
    if (!domain)
      return ctx.throw(
        Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
      );

    // reset redis cache for web and smtp
    if (ctx.client)
      await Promise.all(
        ['NS', 'TXT', 'CNAME'].map(async (type) => {
          try {
            if (type === 'TXT') {
              await Promise.all([
                // DKIM
                ctx.resolver.resolve(
                  `${domain.dkim_key_selector}._domainkey.${domain.name}`,
                  type,
                  { purgeCache: true }
                ),
                // DMARC
                ctx.resolver.resolve(`_dmarc.${domain.name}`, type, {
                  purgeCache: true
                })
              ]);
            } else if (type === 'CNAME') {
              // Return-Path
              await ctx.resolver.resolve(
                `${domain.return_path}.${domain.name}`,
                type,
                { purgeCache: true }
              );
            } else {
              // Nameservers
              await ctx.resolver.resolve(domain.name, type, {
                purgeCache: true
              });
            }
          } catch (err) {
            ctx.logger.warn(err);
          }
        })
      );

    // set locale of domain
    domain.locale = ctx.locale;

    const { ns, dkim, returnPath, dmarc, errors } = await Domains.verifySMTP(
      domain,
      ctx.resolver
    );

    //
    // run a save on the domain name
    // (as long as `errors` does not have a temporary DNS error)
    //
    const hasDNSError =
      Array.isArray(errors) &&
      errors.some((err) => err.code && DNS_RETRY_CODES.has(err.code));

    if (!hasDNSError) {
      // reset missing dkim so we alert users if they are missing it in future again
      if (
        !domain.has_dkim_record &&
        dkim &&
        _.isDate(domain.missing_dkim_sent_at)
      )
        domain.missing_dkim_sent_at = undefined;

      // reset missing return-path so we alert users if they are missing it in future again
      if (
        !domain.has_return_path_record &&
        returnPath &&
        _.isDate(domain.missing_return_path_sent_at)
      )
        domain.missing_return_path_sent_at = undefined;

      // reset missing dmarc so we alert users if they are missing it in future again
      if (
        !domain.has_dmarc_record &&
        dmarc &&
        _.isDate(domain.missing_dmarc_sent_at)
      )
        domain.missing_dmarc_sent_at = undefined;

      // set the values (since we are skipping some verification)
      domain.has_dkim_record = dkim;
      domain.has_return_path_record = returnPath;
      domain.has_dmarc_record = dmarc;
      if (ns) domain.ns = ns;

      // skip verification since this is separate from domain forwarding setup
      domain.skip_verification = true;
    }

    // store when we last checked smtp
    domain.smtp_checked_at = new Date();

    // save the domain
    domain.locale = ctx.locale;
    domain.resolver = ctx.resolver;
    domain = await domain.save();

    // if we haven't yet sent an email to admins then send it now
    if (!domain.has_smtp && !_.isDate(domain.smtp_verified_at)) {
      try {
        // send an email to all admins of the domain
        const obj = await Domains.getToAndMajorityLocaleByDomain(domain);
        const subject = ctx.translate('SMTP_ACCESS_SUBJECT', domain.name);
        const message = ctx.translate('SMTP_ACCESS_PENDING', domain.name);
        await emailHelper({
          template: 'alert',
          message: {
            to: obj.to,
            bcc: config.email.message.from,
            subject
          },
          locals: {
            message,
            locale: obj.locale
          }
        });
        // save the date
        Domains.findByIdAndUpdate(domain._id, {
          $set: {
            smtp_verified_at: new Date()
          }
        })
          .then()
          .catch((err) => ctx.logger.error(err));
        // flash success message
        if (!ctx.api) ctx.flash('success', message);
      } catch (err) {
        ctx.logger.fatal(err);
        if (!ctx.api)
          ctx.flash(
            'error',
            ctx.translate(
              'ERROR_OCCURRED_PLEASE_CONTACT_US',
              env.EMAIL_DEFAULT_FROM_EMAIL,
              env.EMAIL_DEFAULT_FROM_EMAIL
            )
          );
      }
    }

    let extra;

    if (dkim && returnPath && dmarc && errors.length > 0) {
      extra =
        errors.length === 1
          ? errors[0].message
          : `<ul class="text-left mb-0">${errors
              .map(
                (e) => `<li class="mb-3">${e && e.message ? e.message : e}</li>`
              )
              .join('')}</ul>`;
      if (!ctx.api) ctx.flash('warning', extra);
    } else if (errors.length > 0) {
      const err = new Error(
        errors.length === 1
          ? errors[0]
          : ctx.translate('MULTIPLE_VERIFICATION_ERRORS')
      );
      err.no_translate = true;
      if (errors.length > 1) err.errors = errors;
      throw err;
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

    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/verify-smtp`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.warn(err);

    if (Array.isArray(err.errors)) {
      if (ctx.api) {
        err.message = err.errors.map((e) => e.message);
      } else {
        err.message = `<ul class="text-left mb-0">${err.errors
          .map((e) => `<li class="mb-3">${e && e.message ? e.message : e}</li>`)
          .join('')}</ul>`;
      }
    }

    ctx.throw(Boom.badRequest(err.message));
  }
}

module.exports = verifySMTP;
