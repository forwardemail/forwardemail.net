/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const RE2 = require('re2');
const Boom = require('@hapi/boom');
const bytes = require('@forwardemail/bytes');
const isSANB = require('is-string-and-not-blank');
const { boolean } = require('boolean');
const { isPort } = require('@forwardemail/validator');
const _ = require('#helpers/lodash');

const { Domains } = require('#models');
const clearAliasQuotaCache = require('#helpers/clear-alias-quota-cache');

//
// NOTE: this regex is not safe according to `safe-regex2` so we use `re2` to wrap it
//       https://github.com/visionmedia/bytes.js/blob/9ddc13b6c66e0cb293616fba246e05db4b6cef4d/index.js#L37C5-L37C16
//
const REGEX_BYTES = new RE2(/^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i);

async function updateDomain(ctx, next) {
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  if (!ctx.state.domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  // Custom SMTP Port Forwarding
  if (isSANB(ctx.request.body.smtp_port)) {
    if (isPort(ctx.request.body.smtp_port))
      ctx.state.domain.smtp_port = ctx.request.body.smtp_port;
    else throw Boom.badRequest(ctx.translateError('INVALID_PORT'));
  }

  // Domain message retention period for outbound SMTP emails
  if (typeof ctx.request.body.retention_days === 'number') {
    ctx.state.domain.retention_days = Number.parseInt(
      ctx.request.body.retention_days,
      10
    );
  } else if (typeof ctx.request.body.retention_days === 'string') {
    ctx.state.domain.retention_days = Number.parseInt(
      ctx.request.body.retention_days,
      10
    );
  }

  // Boolean settings for bounce webhooks, spam, and requiring recipient verification
  if (ctx.api) {
    // bounce webhook
    if (typeof ctx.request.body.bounce_webhook === 'string') {
      ctx.state.domain.bounce_webhook =
        ctx.request.body.bounce_webhook === ''
          ? undefined
          : ctx.request.body.bounce_webhook;
    } else if (ctx.request.body.bounce_webhook === false) {
      ctx.state.domain.bounce_webhook = undefined;
    }

    //
    // max_quota_per_alias
    // (string -> bytes)
    // (number -> already bytes)
    //
    if (
      typeof ctx.request.body.max_quota_per_alias !== 'undefined' &&
      typeof ctx.request.body.max_quota_per_alias !== 'string'
    )
      throw Boom.badRequest(ctx.translateError('INVALID_BYTES'));
    else if (isSANB(ctx.request.body.max_quota_per_alias)) {
      // NOTE: this validation should be moved to `validate-domain.js`
      if (!REGEX_BYTES.test(ctx.request.body.max_quota_per_alias))
        throw Boom.badRequest(ctx.translateError('INVALID_BYTES'));
      ctx.state.domain.max_quota_per_alias = bytes(
        ctx.request.body.max_quota_per_alias
      );
    }

    // require paid plan (note that the API middleware already does this)
    for (const bool of [
      'has_adult_content_protection',
      'has_phishing_protection',
      'has_executable_protection',
      'has_virus_protection',
      'has_recipient_verification',
      'ignore_mx_check',
      'has_delivery_logs',
      'require_tls_inbound'
    ]) {
      if (_.isBoolean(ctx.request.body[bool]) || isSANB(ctx.request.body[bool]))
        ctx.state.domain[bool] = boolean(ctx.request.body[bool]);
    }
  } else
    switch (ctx.request.body._section) {
      case 'bounce_webhook': {
        ctx.state.domain.bounce_webhook =
          ctx.request.body.bounce_webhook === ''
            ? undefined
            : ctx.request.body.bounce_webhook;
        break;
      }

      case 'max_quota_per_alias': {
        // NOTE: this validation should be moved to `validate-domain.js`
        if (
          !isSANB(ctx.request.body.max_quota_per_alias) ||
          !REGEX_BYTES.test(ctx.request.body.max_quota_per_alias)
        )
          throw Boom.badRequest(ctx.translateError('INVALID_BYTES'));
        ctx.state.domain.max_quota_per_alias = bytes(
          ctx.request.body.max_quota_per_alias
        );
        break;
      }

      case 'spam_scanner_settings': {
        // require paid plan
        if (ctx.state.domain.plan === 'free')
          throw Boom.paymentRequired(
            ctx.translateError(
              'PLAN_UPGRADE_REQUIRED',
              ctx.state.l(
                `/my-account/domains/${punycode.toASCII(
                  ctx.state.domain.name
                )}/billing?plan=enhanced_protection`
              )
            )
          );
        for (const bool of [
          'has_adult_content_protection',
          'has_phishing_protection',
          'has_executable_protection',
          'has_virus_protection'
        ]) {
          ctx.state.domain[bool] = boolean(ctx.request.body[bool]);
        }

        break;
      }

      case 'recipient_verification': {
        // require paid plan
        if (ctx.state.domain.plan === 'free')
          throw Boom.paymentRequired(
            ctx.translateError(
              'PLAN_UPGRADE_REQUIRED',
              ctx.state.l(
                `/my-account/domains/${punycode.toASCII(
                  ctx.state.domain.name
                )}/billing?plan=enhanced_protection`
              )
            )
          );
        ctx.state.domain.has_recipient_verification = boolean(
          ctx.request.body.has_recipient_verification
        );

        break;
      }

      case 'ignore_mx_check': {
        // require paid plan
        if (ctx.state.domain.plan === 'free')
          throw Boom.paymentRequired(
            ctx.translateError(
              'PLAN_UPGRADE_REQUIRED',
              ctx.state.l(
                `/my-account/domains/${punycode.toASCII(
                  ctx.state.domain.name
                )}/billing?plan=enhanced_protection`
              )
            )
          );
        ctx.state.domain.ignore_mx_check = boolean(
          ctx.request.body.ignore_mx_check
        );

        break;
      }

      case 'has_delivery_logs': {
        // require paid plan
        if (ctx.state.domain.plan === 'free')
          throw Boom.paymentRequired(
            ctx.translateError(
              'PLAN_UPGRADE_REQUIRED',
              ctx.state.l(
                `/my-account/domains/${punycode.toASCII(
                  ctx.state.domain.name
                )}/billing?plan=enhanced_protection`
              )
            )
          );
        ctx.state.domain.has_delivery_logs = boolean(
          ctx.request.body.has_delivery_logs
        );

        break;
      }

      case 'require_tls_inbound': {
        // require paid plan
        if (ctx.state.domain.plan === 'free')
          throw Boom.paymentRequired(
            ctx.translateError(
              'PLAN_UPGRADE_REQUIRED',
              ctx.state.l(
                `/my-account/domains/${punycode.toASCII(
                  ctx.state.domain.name
                )}/billing?plan=enhanced_protection`
              )
            )
          );
        ctx.state.domain.require_tls_inbound = boolean(
          ctx.request.body.require_tls_inbound
        );

        break;
      }
      // No default
    }

  // custom verification IFF allowed
  if (
    !ctx.api &&
    ctx.request.body._section === 'custom_verification_template'
  ) {
    // require paid plan
    if (
      ctx.state.domain.plan === 'free' ||
      !ctx.state.domain.has_custom_verification
    )
      throw Boom.paymentRequired(
        ctx.translateError(
          'PLAN_UPGRADE_REQUIRED',
          ctx.state.l(
            `/my-account/domains/${punycode.toASCII(
              ctx.state.domain.name
            )}/billing?plan=enhanced_protection`
          )
        )
      );
    for (const prop of ['name', 'email', 'subject', 'redirect', 'html']) {
      if (_.isString(ctx.request.body[`custom_verification_${prop}`])) {
        ctx.state.domain.custom_verification[prop] = isSANB(
          ctx.request.body[`custom_verification_${prop}`]
        )
          ? ctx.request.body[`custom_verification_${prop}`]
          : '';
      }
    }
  }

  // TODO: eventually let users customize the text portion (for now we use html-to-text)

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.skip_verification = true;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.request.body.max_quota_per_alias)
    clearAliasQuotaCache(ctx.client, ctx.state.domain._id)
      .then()
      .catch((err) => ctx.logger.fatal(err));

  // clear cache for settings (used by SMTP)
  if (ctx.state.domain.plan !== 'free' && ctx.state.domain.has_txt_record)
    ctx.client
      .del(`v1_settings:${ctx.state.domain.name}`)
      .then()
      .catch((err) => ctx.logger.fatal(err));

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = updateDomain;
