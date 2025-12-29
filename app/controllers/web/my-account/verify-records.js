/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const _ = require('#helpers/lodash');

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

async function verifyRecords(ctx) {
  try {
    const domain = await Domains.findById(ctx.state.domain._id);
    if (!domain)
      throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

    //
    // attempt to validate the domain
    // (this will bubble up any payment 402 errors)
    //
    try {
      domain.skip_payment_check = true;
      domain.locale = ctx.locale;
      domain.resolver = ctx.resolver;
      await domain.validate();
    } catch (err) {
      if (err && err.isBoom && err.output && err.output.statusCode === 402) {
        const redirectTo = ctx.state.l(
          domain.plan === 'free'
            ? `/my-account/domains/${punycode.toASCII(
                domain.name
              )}/billing?plan=enhanced_protection`
            : `/my-account/billing/upgrade?plan=${domain.plan}`
        );

        // all messages are already translated based off domain locale
        ctx.flash('warning', err.message);
        if (ctx.accepts('html')) ctx.redirect(redirectTo);
        else ctx.body = { redirectTo };
      }

      if (err.isBoom) throw err;
      throw Boom.badRequest(err);
    }

    // reset redis cache for web and smtp
    if (ctx.client)
      await Promise.all(
        ['NS', 'MX', 'TXT'].map(async (type) => {
          try {
            await ctx.resolver.resolve(domain.name, type, { purgeCache: true });
          } catch (err) {
            ctx.logger.warn(err);
          }
        })
      );

    // set locale of domain
    domain.locale = ctx.locale;

    const { ns, txt, mx, errors } = await Domains.getVerificationResults(
      domain,
      ctx.resolver,
      true
    );

    //
    // run a save on the domain name
    // (as long as `errors` does not have a temporary DNS error)
    //
    const hasDNSError =
      Array.isArray(errors) &&
      errors.some((err) => err.code && DNS_RETRY_CODES.has(err.code));

    if (!hasDNSError) {
      // reset missing txt so we alert users if they are missing a TXT in future again
      if (!domain.has_txt_record && txt && _.isDate(domain.missing_txt_sent_at))
        domain.missing_txt_sent_at = undefined;

      // set the values (since we are skipping some verification)
      domain.has_txt_record = txt;
      domain.has_mx_record = mx;
      if (ns) domain.ns = ns;
    }

    // skip verification since we just verified it
    domain.skip_verification = true;

    // store when we last checked it
    domain.last_checked_at = new Date();

    // save the domain
    domain.locale = ctx.locale;
    domain.resolver = ctx.resolver;
    await domain.save();

    let extra;

    if (txt && mx && errors.length > 0) {
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
      const err = Boom.badRequest(
        errors.length === 1
          ? errors[0]
          : ctx.translate('MULTIPLE_VERIFICATION_ERRORS')
      );
      err.no_translate = true;
      if (errors.length > 1) err.errors = errors;
      throw err;
    }

    const text = ctx.translate('DOMAIN_IS_VERIFIED');

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
      `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}`
    );
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

module.exports = verifyRecords;
