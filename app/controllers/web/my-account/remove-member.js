/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const emailHelper = require('#helpers/email');
const { Aliases, Domains } = require('#models');

async function removeMember(ctx, next) {
  // ctx.params.member_id
  if (!isSANB(ctx.params.member_id))
    throw Boom.notFound(ctx.translateError('INVALID_USER'));

  const member = ctx.state.domain.members.find(
    (member) => member.user && member.user.id === ctx.params.member_id
  );

  if (!member || !member.user)
    throw Boom.notFound(ctx.translateError('INVALID_USER'));

  // don't remove if the domain only has one member
  if (ctx.state.domain.members.length === 1)
    throw Boom.notFound(ctx.translateError('UNKNOWN_ERROR'));

  // re-assign aliases that belong to this user before removing them
  const aliases = ctx.state.domain.aliases.filter(
    (alias) => alias.user && alias.user.id === member.user.id
  );

  if (aliases.length > 0) {
    // if the user is removing themselves
    // then just remove the existing aliases of theirs
    if (member.user.id === ctx.state.user.id) {
      await Aliases.deleteMany({
        id: {
          $in: aliases.map((alias) => alias.id)
        }
      });
      const message = `<p class="font-weight-bold">${ctx.translate(
        'REMOVED_ALIASES_FROM_OWNER'
      )}</p><ul class="mb-0 text-left"><li>${aliases
        .map((alias) => alias.name)
        .join('</li><li>')}</li></ul>`;

      // flash a message if we're not on the API
      if (!ctx.api) ctx.flash('info', message);

      // send an email in the background
      emailHelper({
        template: 'alert',
        message: {
          to: ctx.state.user.email
        },
        locals: { user: ctx.state.user.toObject(), message }
      })
        .then()
        .catch((err) => ctx.logger.fatal(err));
    } else {
      await Aliases.updateMany(
        {
          id: {
            $in: aliases.map((alias) => alias.id)
          }
        },
        {
          user: ctx.state.user._id
        }
      );
      const message = `<p class="font-weight-bold">${ctx.translate(
        'REASSIGNED_ALIAS_OWNERSHIP'
      )}</p><ul class="mb-0 text-left"><li>${aliases
        .map((alias) => alias.name)
        .join('</li><li>')}</li></ul>`;

      // flash a message if we're not on the API
      if (!ctx.api) ctx.flash('info', message);

      // send an email in the background
      emailHelper({
        template: 'alert',
        message: {
          to: ctx.state.user.email
        },
        locals: { user: ctx.state.user.toObject(), message }
      })
        .then()
        .catch((err) => ctx.logger.fatal(err));
    }
  }

  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  if (!ctx.state.domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));
  ctx.state.domain.members = ctx.state.domain.members.filter(
    (member) => member.user.toString() !== ctx.params.member_id
  );
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.resolver = ctx.resolver;

  // Set audit metadata for domain update tracking
  ctx.state.domain.__audit_metadata = {
    user: ctx.state.user,
    ip: ctx.ip,
    userAgent: ctx.get('User-Agent')
  };

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

module.exports = removeMember;
