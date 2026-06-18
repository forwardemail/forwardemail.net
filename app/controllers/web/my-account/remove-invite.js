/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const isEmail = require('#helpers/is-email');

const { Domains } = require('#models');

async function removeInvite(ctx, next) {
  // ctx.request.body.email
  // ctx.query.email
  const email = ctx.request.body.email || ctx.query.email;
  if (!isSANB(email) || !isEmail(email))
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

  //
  // NOTE: we intentionally remove the invite with an atomic `$pull`
  //       update instead of mutating `ctx.state.domain.invites` and
  //       calling `domain.save()`.
  //
  //       Calling `.save()` re-validates the ENTIRE `invites` array,
  //       so a single legacy invite that predates the now-required
  //       `expires_at` field would throw "Expires at is required" and
  //       block the deletion (and the success path would never run).
  //       A targeted `$pull` removes the matching invite without
  //       triggering full-document subdocument validation.
  //
  const normalizedEmail = email.toLowerCase();

  const result = await Domains.updateOne(
    { _id: ctx.state.domain._id },
    {
      $pull: {
        invites: { email: normalizedEmail }
      }
    }
  );

  if (result.matchedCount === 0)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

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

module.exports = removeInvite;
