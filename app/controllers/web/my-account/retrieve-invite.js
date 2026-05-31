/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const { Domains, Users } = require('#models');

async function retrieveInvite(ctx) {
  if (!isSANB(ctx.params.domain_id))
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  if (!isSANB(ctx.params.token))
    throw Boom.notFound(ctx.translateError('INVITE_DOES_NOT_EXIST'));

  //
  // FWD-01-001: Use opaque random token for invite lookup.
  // Both domain_id and token are required — this prevents token
  // enumeration across domains and adds defense-in-depth.
  //
  const { domain_id: domainId, token: inviteToken } = ctx.params;

  // Find the domain by ID AND verify it contains the invite token
  const domain = await Domains.findOne({
    _id: domainId,
    'invites.token': inviteToken
  });

  if (!domain) throw Boom.notFound(ctx.translateError('INVITE_DOES_NOT_EXIST'));

  // Find the specific invite by token
  const invite = domain.invites.find((inv) => inv.token === inviteToken);
  if (!invite) throw Boom.notFound(ctx.translateError('INVITE_DOES_NOT_EXIST'));

  // Reject expired invites (default TTL: 7 days from creation)
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    // Remove the expired invite from the array
    domain.invites = domain.invites.filter((inv) => inv.token !== inviteToken);
    domain.skip_verification = true;
    await domain.save();
    throw Boom.notFound(ctx.translateError('INVITE_DOES_NOT_EXIST'));
  }

  //
  // Hard requirement: the authenticated user's email MUST match the invite email.
  // This prevents any user from accepting an invite meant for someone else.
  //
  if (invite.email.toLowerCase() !== ctx.state.user.email.toLowerCase())
    throw Boom.forbidden(ctx.translateError('INVITE_DOES_NOT_EXIST'));

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

  // convert invitee to a member with the same group as invite had
  const { group } = invite;
  domain.members.push({
    user: ctx.state.user._id,
    group
  });

  // remove the invite from invites list
  domain.invites = domain.invites.filter((inv) => inv.token !== inviteToken);

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
