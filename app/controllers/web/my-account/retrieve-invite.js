/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');

const config = require('#config');
const { decrypt } = require('#helpers/encrypt-decrypt');
const { Domains, Users } = require('#models');

async function retrieveInvite(ctx) {
  if (!isSANB(ctx.params.domain_id))
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  // try to decrypt the invite token (new secure format)
  // if decryption fails, fall back to legacy behavior (plain domain_id)
  let domainId;
  let invitedEmail;

  try {
    const decrypted = JSON.parse(decrypt(ctx.params.domain_id));
    domainId = decrypted.d;
    invitedEmail = decrypted.e;
  } catch {
    // decryption failed - this is a legacy link with plain domain_id
    // validate it looks like a valid ObjectId
    if (mongoose.isValidObjectId(ctx.params.domain_id)) {
      domainId = ctx.params.domain_id;
      // for legacy links, we'll find any invite in the domain
      invitedEmail = null;
    } else {
      throw Boom.notFound(ctx.translateError('INVITE_DOES_NOT_EXIST'));
    }
  }

  if (!domainId)
    throw Boom.notFound(ctx.translateError('INVITE_DOES_NOT_EXIST'));

  // look up the domain by _id
  const domain = await Domains.findOne({
    _id: domainId
  });

  if (!domain) throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  // if the user already has a domain with the same name
  // inform them to delete it first before accepting the invite
  const match = ctx.state.domains.find(
    (d) =>
      d.name === domain.name ||
      punycode.toASCII(d.name) === punycode.toASCII(domain.name)
  );
  if (match)
    throw Boom.badRequest(
      ctx.translateError('DOMAIN_ALREADY_EXISTS_REMOVE_FIRST')
    );

  // check if user is already a member
  const existingMember = domain.members.find(
    (member) => member.user.toString() === ctx.state.user._id.toString()
  );

  if (existingMember) {
    // user is already a member, just redirect them
    const { group } = existingMember;
    const message =
      group === 'admin'
        ? ctx.translate('INVITE_ACCEPTED_ADMIN')
        : ctx.translate('INVITE_ACCEPTED_USER');

    if (ctx.api) {
      ctx.body = message;
      return;
    }

    ctx.flash('success', message);

    const redirectTo =
      group === 'admin'
        ? ctx.state.l(`/my-account/domains/${punycode.toASCII(domain.name)}`)
        : ctx.state.l(
            `/my-account/domains/${punycode.toASCII(domain.name)}/aliases`
          );

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  // find the invite - either by specific email (new format) or any invite (legacy)
  let invite;
  if (invitedEmail) {
    // new secure link - find invite matching the encrypted email
    invite = domain.invites.find((inv) => inv.email === invitedEmail);
  } else {
    // legacy link - first try to match user's email, otherwise take first invite
    invite = domain.invites.find((inv) => inv.email === ctx.state.user.email);
    if (!invite && domain.invites.length > 0) {
      invite = domain.invites[0];
    }
  }

  // if no invite exists, the link is invalid or already used
  if (!invite) throw Boom.notFound(ctx.translateError('INVITE_DOES_NOT_EXIST'));

  // check if the accepting user's email differs from the invited email
  const emailMismatch = invite.email !== ctx.state.user.email;

  // convert invitee to a member with the same group as invite had
  const { group } = invite;
  domain.members.push({
    user: ctx.state.user._id,
    group
  });

  // remove the invite from invites list
  domain.invites = domain.invites.filter((inv) => inv.email !== invite.email);

  // save domain
  domain.locale = ctx.locale;
  domain.skip_verification = true;

  // Set audit metadata for domain update tracking
  domain.__audit_metadata = {
    user: ctx.state.user,
    ip: ctx.ip,
    userAgent: ctx.get('User-Agent')
  };

  ctx.state.domain = await domain.save();

  // mark user's email as verified (accepting invite proves email access)
  if (!ctx.state.user[config.userFields.hasVerifiedEmail]) {
    await Users.findByIdAndUpdate(ctx.state.user._id, {
      $set: { [config.userFields.hasVerifiedEmail]: true }
    });
    ctx.state.user[config.userFields.hasVerifiedEmail] = true;
  }

  // flash a message to the user telling them they've successfully accepted
  const message =
    group === 'admin'
      ? ctx.translate('INVITE_ACCEPTED_ADMIN')
      : ctx.translate('INVITE_ACCEPTED_USER');

  // edge case if it was an API request to simply send a string in the body
  if (ctx.api) {
    ctx.body = message;
    return;
  }

  ctx.flash('success', message);

  // notify if the accepting user's email differs from the invited email
  if (emailMismatch) {
    ctx.flash('warning', ctx.translate('INVITE_EMAIL_MISMATCH', invite.email));
  }

  // redirect user to either alias page (if user) or admin page (if admin)
  const redirectTo =
    group === 'admin'
      ? ctx.state.l(`/my-account/domains/${punycode.toASCII(domain.name)}`)
      : ctx.state.l(
          `/my-account/domains/${punycode.toASCII(domain.name)}/aliases`
        );

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = retrieveInvite;
