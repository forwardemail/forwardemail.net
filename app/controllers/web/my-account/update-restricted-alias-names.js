/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const splitLines = require('split-lines');
const isSANB = require('is-string-and-not-blank');
const _ = require('#helpers/lodash');
const splitByComma = require('#helpers/split-by-comma');

const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const { Aliases, Domains } = require('#models');

async function updateRestrictedAliasNames(ctx, next) {
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  if (!ctx.state.domain)
    throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  if (isSANB(ctx.request.body.restricted_alias_names)) {
    ctx.state.domain.restricted_alias_names = _.compact(
      _.uniq(
        _.map(
          splitByComma(
            splitLines(ctx.request.body.restricted_alias_names).join(' ')
          )
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

  // Set audit metadata for domain update tracking
  ctx.state.domain.__audit_metadata = {
    user: ctx.state.user,
    ip: ctx.ip,
    userAgent: ctx.get('User-Agent')
  };

  ctx.state.domain = await ctx.state.domain.save();

  // check if any aliases match one of the restricted alias names
  // and email the admins with the list of those that match
  if (ctx.state.domain.restricted_alias_names.length > 0)
    Aliases.distinct('name', {
      name: {
        $in: ctx.state.domain.restricted_alias_names
      },
      domain: ctx.state.domain._id
    })
      .then(async (names) => {
        if (names.length === 0) return;
        try {
          // get recipients and the majority favored locale
          const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
            ctx.state.domain
          );
          // notify all domain admins
          const subject = i18n.translate(
            'RESTRICTED_ALIAS_DETECTED_SUBJECT',
            locale,
            ctx.state.domain.name
          );
          const message = i18n.translate(
            'RESTRICTED_ALIAS_DETECTED_MESSAGE',
            locale,
            ctx.state.domain.name,
            names.join('</li><li>')
          );
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
          })
            .then()
            .catch((err) => ctx.logger.fatal(err));
        } catch (err) {
          ctx.logger.fatal(err);
        }
      })
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

module.exports = updateRestrictedAliasNames;
