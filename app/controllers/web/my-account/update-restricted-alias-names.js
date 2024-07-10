/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const _ = require('lodash');
const splitLines = require('split-lines');
const isSANB = require('is-string-and-not-blank');

const { Domains } = require('#models');

async function updateRestrictedAliasNames(ctx, next) {
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  if (!ctx.state.domain)
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  if (isSANB(ctx.request.body.restricted_alias_names)) {
    ctx.state.domain.restricted_alias_names = _.compact(
      _.uniq(
        _.map(
          splitLines(ctx.request.body.restricted_alias_names)
            .join(' ')
            .split(',')
            .join(' ')
            .split(' '),
          (v) => v.toLowerCase()
        )
      )
    );
  } else {
    ctx.state.domain.restricted_alias_names = [];
  }

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.skip_verification = true;
  ctx.state.domain = await ctx.state.domain.save();

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

module.exports = updateRestrictedAliasNames;
