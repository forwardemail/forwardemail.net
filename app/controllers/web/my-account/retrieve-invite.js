/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const { encode } = require('html-entities');

const config = require('#config');
const normalizeInviteEmail = require('#helpers/normalize-invite-email');
const { Domains } = require('#models');

// where a member lands: the domain for an admin, its aliases for a user
function memberPath(ctx, domain, group) {
  const name = punycode.toASCII(domain.name);
  return ctx.state.l(
    group === 'admin'
      ? `/my-account/domains/${name}`
      : `/my-account/domains/${name}/aliases`
  );
}

function redirectMember(ctx, domain, group, message) {
  if (ctx.api) {
    ctx.body = message;
    return;
  }

  ctx.flash('success', message);
  const redirectTo = memberPath(ctx, domain, group);
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

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

  // (an id that is not an ObjectId would make the query below throw)
  if (!mongoose.isValidObjectId(domainId))
    throw Boom.notFound(ctx.translateError('INVITE_DOES_NOT_EXIST'));

  // Find the domain by ID AND verify it contains the invite token
  const domain = await Domains.findOne({
    _id: domainId,
    'invites.token': inviteToken
  });

  if (!domain) {
    // the invite is removed once accepted, so opening the link again (or
    // accepting it twice) lands here; a member goes on to the domain
    // (only if the route loaded the user's domains)
    const membership = Array.isArray(ctx.state.domains)
      ? ctx.state.domains.find((d) => d.id === domainId)
      : undefined;
    if (membership)
      return redirectMember(
        ctx,
        membership,
        membership.group,
        ctx.translate('INVITE_ALREADY_ACCEPTED')
      );

    throw Boom.notFound(ctx.translateError('INVITE_DOES_NOT_EXIST'));
  }

  // Find the specific invite by token
  const invite = domain.invites.find((inv) => inv.token === inviteToken);
  if (!invite) throw Boom.notFound(ctx.translateError('INVITE_DOES_NOT_EXIST'));

  // Reject expired invites (default TTL: 7 days from creation)
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    // Remove the expired invite from the array
    domain.invites = domain.invites.filter((inv) => inv.token !== inviteToken);
    domain.skip_verification = true;
    await domain.save();
    // (the same page a signed-out visitor gets; a thrown error renders the
    // generic error page, whose "Try again" would then find nothing)
    if (!ctx.api && ctx.method === 'GET') {
      ctx.status = 410;
      ctx.state.invite = { state: 'expired', domainName: domain.name };
      return ctx.render('invite');
    }

    throw Boom.resourceGone(ctx.translateError('INVITE_EXPIRED'));
  }

  //
  // Hard requirement: the authenticated user's email MUST match the invite email.
  // This prevents any user from accepting an invite meant for someone else.
  //
  if (
    normalizeInviteEmail(invite.email) !==
    normalizeInviteEmail(ctx.state.user.email)
  ) {
    // Often the admin opening the link to test it, or a person signed in
    // with another account. The page says which address the invite is for
    // and offers to sign out and continue; the link holder already has the
    // address (the link was emailed to it).
    //
    // (a 200: the redirect-loop guard treats a redirect back to the URL of
    // a page that was not a 200 as a loop, which would send "Sign out and
    // continue" to the page before this one instead of back to the invite)
    //
    if (!ctx.api && ctx.method === 'GET') {
      ctx.state.invite = {
        state: 'wrong-account',
        domainName: domain.name,
        email: invite.email,
        signedInAs: ctx.state.user.email
      };
      return ctx.render('invite');
    }

    throw Boom.forbidden(
      ctx.translateError(
        'INVITE_WRONG_ACCOUNT',
        encode(invite.email),
        encode(ctx.state.user.email)
      )
    );
  }

  //
  // Accepting takes a verified address. The invite link can travel outside
  // email (an admin can copy it), and the invite pages show the invited
  // address, so whoever holds the link could otherwise sign up with that
  // address and accept. Verifying sends a code to the invited inbox, and the
  // verify page comes back here.
  //
  if (!ctx.state.user[config.userFields.hasVerifiedEmail]) {
    if (ctx.api)
      throw Boom.forbidden(ctx.translateError('EMAIL_VERIFICATION_REQUIRED'));
    const redirectTo = ctx.state.l(
      `${config.verifyRoute}?redirect_to=${encodeURIComponent(ctx.path)}`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  // if the user already has a domain with the same name
  // inform them to delete it first before accepting the invite
  // (not the domain itself, which a member already has)
  const match = ctx.state.domains.find(
    (d) =>
      d.id !== domain.id &&
      (d.name === domain.name ||
        punycode.toASCII(d.name) === punycode.toASCII(domain.name))
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
    // an admin invite for a member (see `update-member.js`) makes them an
    // admin once they accept it
    if (invite.group === 'admin' && existingMember.group !== 'admin') {
      // (on the website only from the confirmation page, see below)
      if (!ctx.api && ctx.method === 'GET') {
        ctx.state.inviteDomainName = domain.name;
        return ctx.render('my-account/accept-invite');
      }

      existingMember.group = 'admin';
      domain.invites = domain.invites.filter(
        (inv) => inv.token !== inviteToken
      );
      domain.locale = ctx.locale;
      domain.skip_verification = true;
      domain.__audit_metadata = {
        user: ctx.state.user,
        ip: ctx.ip,
        userAgent: ctx.get('User-Agent')
      };
      await domain.save();
    }

    // user is already a member, just redirect them
    const { group } = existingMember;
    return redirectMember(
      ctx,
      domain,
      group,
      group === 'admin'
        ? ctx.translate('INVITE_ACCEPTED_ADMIN')
        : ctx.translate('INVITE_ACCEPTED_USER')
    );
  }

  //
  // On the website the invite link only shows what is being accepted, and
  // the invite is accepted with a POST from that page.  Session cookies are
  // sent with a GET from another site (SameSite=Lax), so a link or redirect
  // elsewhere could otherwise add the user to a domain without them knowing.
  //
  if (!ctx.api && ctx.method === 'GET') {
    ctx.state.inviteDomainName = domain.name;
    return ctx.render('my-account/accept-invite');
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

  // tell them they joined, and take them to the domain (admin) or to its
  // aliases (user); an API request gets the message as the body
  return redirectMember(
    ctx,
    domain,
    group,
    group === 'admin'
      ? ctx.translate('INVITE_ACCEPTED_ADMIN')
      : ctx.translate('INVITE_ACCEPTED_USER')
  );
}

module.exports = retrieveInvite;
