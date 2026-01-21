/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const reservedAdminList = require('reserved-email-addresses-list/admin-list.json');
const reservedEmailAddressesList = require('reserved-email-addresses-list');

const emailHelper = require('#helpers/email');
const { Aliases, Domains } = require('#models');

async function updateMember(ctx, next) {
  // ctx.params.member_id
  if (!isSANB(ctx.params.member_id))
    throw Boom.notFound(ctx.translateError('INVALID_USER'));

  // ctx.request.body.group
  if (
    !isSANB(ctx.request.body.group) ||
    !['admin', 'user'].includes(ctx.request.body.group)
  )
    throw Boom.badRequest(ctx.translateError('INVALID_GROUP'));

  const member = ctx.state.domain.members.find(
    (member) => member.user && member.user.id === ctx.params.member_id
  );

  if (!member || !member.user)
    throw Boom.notFound(ctx.translateError('INVALID_USER'));

  // don't update if the domain only has one member
  if (ctx.state.domain.members.length === 1)
    throw Boom.notFound(ctx.translateError('UNKNOWN_ERROR'));

  const isCurrentUserBeingUpdated = member.user.id === ctx.state.user.id;

  //
  // NOTE: this list is already filtered for the given user
  //       (but we kept this here as a safeguard)
  //
  const aliases = ctx.state.domain.aliases.filter(
    (alias) => alias.user && alias.user.id === member.user.id
  );

  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  if (!ctx.state.domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  // swap the user group based off ctx.request.body.group
  // <https://github.com/Automattic/mongoose/issues/11522>
  ctx.state.domain.members = ctx.state.domain.members.map((member) => ({
    user: member.user,
    group:
      member.user.toString() === ctx.params.member_id
        ? ctx.request.body.group
        : member.group
  }));

  // if the user being swapped is being downgraded to user
  // and the user has aliases that are either "*" or reserved
  // then we need to re-assign them to the currently logged in user
  if (ctx.request.body.group === 'user') {
    const updatedAliases = aliases.filter((alias) => {
      // + "*"
      // + reserved email addresses list
      // + reserved admin list
      if (alias.name === '*') return true;

      const string = alias.name.replace(/[^\da-z]/g, '');
      let reservedMatch = reservedEmailAddressesList.find(
        (addr) => addr === string
      );
      if (!reservedMatch)
        reservedMatch = reservedAdminList.find(
          (addr) =>
            addr === string || string.startsWith(addr) || string.endsWith(addr)
        );
      if (reservedMatch) return true;
      return false;
    });

    if (updatedAliases.length > 0) {
      if (isCurrentUserBeingUpdated) {
        const otherAdminMember = ctx.state.domain.members.find(
          (member) =>
            member.group === 'admin' &&
            member.user.toString() !== ctx.state.user.id
        );
        if (!otherAdminMember)
          throw Boom.notFound(ctx.translateError('UNKNOWN_ERROR'));
        await Aliases.updateMany(
          {
            id: {
              $in: updatedAliases.map((alias) => alias.id)
            }
          },
          {
            user: otherAdminMember.user
          }
        );
      } else {
        await Aliases.updateMany(
          {
            id: {
              $in: updatedAliases.map((alias) => alias.id)
            }
          },
          {
            user: ctx.state.user._id
          }
        );
      }

      const message = `<p class="font-weight-bold">${ctx.translate(
        isCurrentUserBeingUpdated
          ? 'REASSIGNED_ALIASES_FROM_OWNER'
          : 'REASSIGNED_ALIAS_OWNERSHIP'
      )}</p><ul class="mb-0 text-left"><li>${updatedAliases
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

module.exports = updateMember;
