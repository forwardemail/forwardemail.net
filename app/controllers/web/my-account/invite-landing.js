/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');

const { Domains } = require('#models');

const INVITE_PATH = /^\/my-account\/domains\/([^/]+)\/invites\/([^/]+)\/?$/;

//
// A team invite link opened while signed out. Everything else under
// /my-account sends a signed-out visitor to the login page, but an invitee
// often has no website account yet, only a mailbox on the domain, and tried
// the mailbox password there. This page names the domain and the invited
// address, says that a website account (separate from any mailbox password)
// is needed, and links to sign up with the address filled in, or to sign
// in, both coming back to the invite.
//
// Nothing is changed here: an expired invite is left for the signed-in
// flow (retrieve-invite.js) or the admin to remove.
//
async function inviteLanding(ctx, next) {
  if (ctx.isAuthenticated() || ctx.method !== 'GET') return next();
  const match = INVITE_PATH.exec(ctx.pathWithoutLocale);
  if (!match) return next();

  const [, domainId, token] = match;
  let invite;
  let domain;
  if (mongoose.isValidObjectId(domainId) && isSANB(token)) {
    domain = await Domains.findOne({ _id: domainId, 'invites.token': token })
      .select('name invites')
      .lean()
      .exec();
    if (domain) invite = domain.invites.find((inv) => inv.token === token);
  }

  // An unknown token goes on to sign in like any other account page: a member
  // opening an invite they accepted is then taken to the domain, and anyone
  // else gets "not valid" (see retrieve-invite.js). Nothing here tells the
  // two apart.
  if (!invite) return next();

  const isExpired =
    invite.expires_at && new Date(invite.expires_at) < new Date();

  // signing in or up from anywhere on the site comes back to the invite
  if (!isExpired && ctx.session) ctx.session.returnTo = ctx.path;

  ctx.status = isExpired ? 410 : 200;
  ctx.state.invite = {
    state: isExpired ? 'expired' : 'signed-out',
    domainName: domain.name,
    email: isExpired ? undefined : invite.email
  };
  return ctx.render('invite');
}

module.exports = inviteLanding;
