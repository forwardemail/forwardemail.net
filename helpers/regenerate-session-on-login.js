/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('#helpers/lodash');

const kPatched = Symbol('regenerateSessionOnLogin');

//
// session fields that describe how (and as whom) the session authenticated;
// these must never carry over from a session that belonged to someone else
// (or to nobody), otherwise a planted session could pre-satisfy OTP
//
const AUTH_FIELDS = [
  'cookie',
  'passport',
  'otp',
  'otp_remember_me',
  'otp_remember_me_issued',
  '_admin_impersonation'
];

async function regenerateSession(ctx, user) {
  if (!ctx || typeof ctx.regenerateSession !== 'function' || !ctx.session)
    return;

  const previous = ctx.session;

  // re-authenticating the same user (e.g. to refresh the user object) keeps
  // the session, since it is already bound to that user
  if (
    previous.passport &&
    previous.passport.user &&
    user &&
    previous.passport.user === user.id
  )
    return;

  // keep unrelated state such as returnTo, flash messages, and attribution
  const preserved = _.omit(previous, AUTH_FIELDS);

  // new session id (the previous one is destroyed in the store) so that a
  // session id known before login (e.g. planted by an attacker) never
  // becomes an authenticated session
  await ctx.regenerateSession();

  if (ctx.session) Object.assign(ctx.session, preserved);
}

//
// every login goes through the passport session manager (ctx.login(), and
// passport.authenticate() for OAuth and other providers), so the session is
// regenerated there instead of in each login handler
//
function regenerateSessionOnLogin(passport) {
  const sm = passport && passport._sm;
  if (!sm || sm[kPatched]) return;

  const logIn = sm.logIn.bind(sm);
  sm.logIn = function (req, user, done) {
    regenerateSession(req && req.ctx, user).then(
      () => logIn(req, user, done),
      done
    );
  };

  sm[kPatched] = true;
}

module.exports = regenerateSessionOnLogin;
