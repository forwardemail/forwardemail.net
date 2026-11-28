/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const splitLines = require('split-lines');
const isSANB = require('is-string-and-not-blank');
const _ = require('#helpers/lodash');
const splitByComma = require('#helpers/split-by-comma');

const { Domains } = require('#models');

async function updateAllowlistAndDenylist(ctx, next) {
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  if (!ctx.state.domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  const kind = (ctx.pathWithoutLocale || ctx.path).endsWith('/allowlist')
    ? 'allowlist'
    : 'denylist';

  // Support both string input (web textarea: comma/space/newline delimited)
  // and array input (API: JSON array of strings)
  let entries = [];
  if (Array.isArray(ctx.request.body[kind])) {
    entries = ctx.request.body[kind].filter(
      (v) => typeof v !== 'string' || isSANB(v)
    );
  } else if (isSANB(ctx.request.body[kind])) {
    entries = _.compact(
      splitByComma(splitLines(ctx.request.body[kind]).join(' '))
        .join(' ')
        .split(' ')
    );
  }

  // an entry that is not valid is refused, not left out without a word
  // (it was not saved, and did not show in the list once saved)
  const invalid = entries.filter((v) => !Domains.normalizeListEntry(v));
  if (invalid.length > 0)
    throw Boom.badRequest(
      ctx.translateError(
        'INVALID_ALLOWLIST_DENYLIST_ENTRIES',
        _.uniq(invalid.map((v) => _.escape(String(v)))).join(', ')
      )
    );

  ctx.state.domain[kind] = _.uniq(
    entries.map((v) => Domains.normalizeListEntry(v))
  );

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.skip_verification = true;

  // Set audit metadata for domain update tracking
  ctx.state.domain.__audit_metadata = {
    user: ctx.state.user,
    ip: ctx.ip,
    userAgent: ctx.get('User-Agent')
  };

  ctx.state.domain = await ctx.state.domain.save();

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

module.exports = updateAllowlistAndDenylist;
