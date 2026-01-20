/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const isEmail = require('#helpers/is-email');

const emailHelper = require('#helpers/email');
const { encrypt } = require('#helpers/encrypt-decrypt');
const { Users, Domains } = require('#models');

async function createInvite(ctx, next) {
  // ctx.request.body.email
  // ctx.query.email
  let email = ctx.request.body.email || ctx.query.email;
  if (!isSANB(email) || !isEmail(email))
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

  // convert to lowercase (since we do a lookup on user model)
  email = email.toLowerCase();

  // ctx.request.body.group
  if (
    !isSANB(ctx.request.body.group) ||
    !['admin', 'user'].includes(ctx.request.body.group)
  )
    throw Boom.badRequest(ctx.translateError('INVALID_GROUP'));

  // ensure invite does not already exist
  const invite = ctx.state.domain.invites.find(
    (invite) => invite.email.toLowerCase() === email.toLowerCase()
  );

  if (invite) throw Boom.badRequest(ctx.translateError('INVITE_ALREADY_SENT'));

  // ensure user is not already a member
  const user = await Users.findOne({ email }).lean().exec();
  if (user) {
    const member = ctx.state.domain.members.find(
      (member) => member.user && member.user.id === user.id
    );
    if (member)
      throw Boom.badRequest(ctx.translateError('USER_ALREADY_MEMBER'));
  }

  // create the invite
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  if (!ctx.state.domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  //
  // NOTE check if the user was already an accepted invitee
  //      from any of this user's domains, and if so then auto-accept
  //      (and notify the user without making them have to click)
  //      (this feature was requested by the Linux Foundation)
  //
  if (user) {
    const match = ctx.state.domains.find((d) => {
      if (d.plan !== 'team') return false; // return if not team plan
      if (d.group !== 'admin') return false; // if user logged in is not an admin ignore
      if (d.id === ctx.state.domain.id) return false; // ignore current domain
      const member = d.members.find((m) => {
        return m.user.id === user.id;
      });
      // if there was a match on another domain where the invitee was already accepted
      // then we should automatically and instantly auto-accept the invite
      if (member) return true;
      return false;
    });
    if (match) {
      ctx.state.domain.members.push({
        user: user._id,
        group: ctx.request.body.group
      });
      ctx.state.domain.locale = ctx.locale;
      ctx.state.domain.skip_verification = true;
      ctx.state.domain = await ctx.state.domain.save();

      if (ctx.api) return next();

      // send response
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

      return;
    }
  }

  ctx.state.domain.invites.push({
    email: email.toLowerCase(),
    group: ctx.request.body.group
  });
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.skip_verification = true;
  ctx.state.domain = await ctx.state.domain.save();

  // generate encrypted invite token containing domain_id and email
  const inviteToken = encrypt(
    JSON.stringify({
      d: ctx.state.domain.id,
      e: email.toLowerCase()
    })
  );

  // send an email
  try {
    await emailHelper({
      template: 'invite',
      message: {
        to: email.toLowerCase()
      },
      locals: {
        domain: { name: ctx.state.domain.name },
        inviteToken
      }
    });
  } catch (err) {
    if (!ctx.api) ctx.flash('error', ctx.translate('INVITE_EMAIL_ERROR'));
    ctx.logger.error(err);
  }

  if (ctx.api) return next();

  // send response
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

module.exports = createInvite;
