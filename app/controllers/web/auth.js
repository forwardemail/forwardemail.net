/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const cryptoRandomString = require('crypto-random-string');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const qrcode = require('qrcode');
const titleize = require('titleize');
const validator = require('@forwardemail/validator');
const { authenticator } = require('otplib');
const { boolean } = require('boolean');
const { errors } = require('passport-local-mongoose');
const {
  SessionChallengeStore
} = require('@forwardemail/passport-fido2-webauthn');
const _ = require('#helpers/lodash');

const config = require('#config');
const email = require('#helpers/email');
const invalidateOtherSessions = require('#helpers/invalidate-other-sessions');
const parseLoginSuccessRedirect = require('#helpers/parse-login-success-redirect');
const sendVerificationEmail = require('#helpers/send-verification-email');
const stripe = require('#helpers/stripe');
const { Users } = require('#models');

const options = { length: 10, type: 'numeric' };
const store = new SessionChallengeStore();

async function logout(ctx) {
  if (!ctx.isAuthenticated()) return ctx.redirect(ctx.state.l());

  // store a reference to the session ID so we can clean it up on user model
  const { sessionId } = ctx;
  const userId = ctx.state.user._id;

  if (ctx.session) {
    delete ctx.session.otp;
    delete ctx.session.otp_remember_me;
    delete ctx.session.returnTo;
    delete ctx.session[store._key];
    delete ctx.session._gh_issue;
  }

  try {
    await ctx.saveSession();
  } catch (err) {
    ctx.logger.fatal(err);
  }

  ctx.logout();
  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });
  ctx.redirect(ctx.state.l());

  // remove from the user session array the matching value
  Users.findByIdAndUpdate(userId, {
    $pullAll: {
      sessions: [sessionId]
    }
  })
    .then()
    .catch((err) => ctx.logger.fatal(err));
}

function parseReturnOrRedirectTo(ctx, next) {
  // if the user passed `?return_to` and it is not blank
  // then set it as the returnTo value for when we log in
  if (isSANB(ctx.query.return_to) && ctx.session) {
    ctx.session.returnTo = ctx.query.return_to;
  } else if (isSANB(ctx.query.redirect_to) && ctx.session) {
    // in case people had a typo, we should support redirect_to as well
    ctx.session.returnTo = ctx.query.redirect_to;
  }

  // prevents lad being used as a open redirect
  if (
    ctx.session &&
    ctx.session.returnTo &&
    ctx.session.returnTo.includes('://') &&
    ctx.session.returnTo.indexOf(config.urls.web) !== 0
  ) {
    ctx.logger.warn(
      `Prevented abuse with returnTo hijacking to ${ctx.session.returnTo}`
    );
    ctx.session.returnTo = null;
  }

  return next();
}

async function registerOrLogin(ctx) {
  if (ctx.isAuthenticated()) {
    let redirectTo = ctx.state.l(
      config.passportCallbackOptions.successReturnToOrRedirect
    );

    if (ctx.session && ctx.session.returnTo) {
      redirectTo = ctx.session.returnTo;
      delete ctx.session.returnTo;
    }

    ctx.flash('success', ctx.translate('ALREADY_SIGNED_IN'));

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  ctx.state.verb = ctx.pathWithoutLocale === '/register' ? 'sign up' : 'log in';

  return ctx.render('register-or-login');
}

async function homeOrDomains(ctx, next) {
  if (ctx.pathWithoutLocale !== '/') return next();

  // If the user is logged in then take them to their account
  if (ctx.isAuthenticated())
    return ctx.redirect(
      ctx.state.l(config.passportCallbackOptions.successReturnToOrRedirect)
    );

  return ctx.render('home');
}

async function login(ctx, next) {
  if (ctx.isAuthenticated()) {
    let redirectTo = ctx.state.l(
      config.passportCallbackOptions.successReturnToOrRedirect
    );

    if (ctx.session && ctx.session.returnTo) {
      redirectTo = ctx.session.returnTo;
      delete ctx.session.returnTo;
    }

    ctx.flash('success', ctx.translate('ALREADY_SIGNED_IN'));

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  return ctx.passport &&
    ctx.passport.authenticate &&
    ctx.passport.config &&
    ctx.passport.config.providers &&
    ctx.passport.config.providers.local
    ? ctx.passport.authenticate('local', async (err, user, info) => {
        if (err) throw err;

        if (!user) {
          if (info) throw info;
          throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));
        }

        // redirect user to their last locale they were using
        if (
          user &&
          isSANB(user[config.lastLocaleField]) &&
          user[config.lastLocaleField] !== ctx.locale
        ) {
          ctx.state.locale = user[config.lastLocaleField];
          ctx.request.locale = ctx.state.locale;
          ctx.locale = ctx.request.locale;
        }

        const greeting = 'Welcome back';

        if (user) {
          await ctx.login(user);

          ctx.flash('custom', {
            title: `${ctx.request.t('Hello')} ${ctx.state.emoji('wave')}`,
            text: user[config.userFields.givenName]
              ? `${greeting} ${user[config.userFields.givenName]}`
              : greeting,
            type: 'success',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            position: 'top'
          });

          const uri = authenticator.keyuri(
            user.email,
            'forwardemail',
            user[config.passport.fields.otpToken]
          );

          ctx.state.user.qrcode = await qrcode.toDataURL(uri);
          ctx.state.user = await ctx.state.user.save();

          //
          // NOTE: if OTP is required, redirect to OTP page without calling
          // parseLoginSuccessRedirect() to preserve ctx.session.returnTo
          // for after OTP verification completes
          //
          if (
            user[config.passport.fields.otpEnabled] &&
            ctx.session &&
            !ctx.session.otp
          ) {
            const redirectTo = ctx.state.l(config.loginOtpRoute);
            if (ctx.accepts('html')) {
              ctx.redirect(redirectTo);
            } else {
              ctx.body = { redirectTo };
            }

            return;
          }

          // only call parseLoginSuccessRedirect when authentication is complete
          // (this consumes and deletes ctx.session.returnTo)
          const redirectTo = await parseLoginSuccessRedirect(ctx);

          if (ctx.accepts('html')) {
            ctx.redirect(redirectTo);
          } else {
            ctx.body = { redirectTo };
          }

          return;
        }

        // NOTE: this code path is unreachable since we check !user above
        // and return early, but keeping for safety
        const redirectTo = await parseLoginSuccessRedirect(ctx);

        ctx.flash('custom', {
          title: `${ctx.translate('HELLO')} ${ctx.state.emoji('wave')}`,
          text: ctx.translate('SIGNED_IN'),
          type: 'success',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          position: 'top'
        });

        if (ctx.accepts('html')) ctx.redirect(redirectTo);
        else ctx.body = { redirectTo };
      })(ctx, next)
    : next();
}

function loginOtp(ctx, next) {
  return ctx.passport &&
    ctx.passport.authenticate &&
    ctx.passport.config &&
    ctx.passport.config.providers &&
    ctx.passport.config.providers.otp
    ? ctx.passport.authenticate('otp', async (err, user) => {
        if (err) throw err;
        if (!user)
          throw Boom.unauthorized(ctx.translateError('INVALID_OTP_PASSCODE'));

        if (ctx.session) {
          ctx.session.otp_remember_me = boolean(
            ctx.request.body.otp_remember_me
          );

          ctx.session.otp = 'totp';

          try {
            await ctx.saveSession();
          } catch (err) {
            ctx.logger.fatal(err);
          }
        }

        const redirectTo = await parseLoginSuccessRedirect(ctx);

        if (ctx.accepts('json')) {
          ctx.body = { redirectTo };
        } else {
          ctx.redirect(redirectTo);
        }
      })(ctx, next)
    : next();
}

async function recoveryKey(ctx) {
  let redirectTo = ctx.state.l(
    config.passportCallbackOptions.successReturnToOrRedirect
  );

  if (ctx.session && ctx.session.returnTo) {
    redirectTo = ctx.session.returnTo;
    delete ctx.session.returnTo;
  }

  ctx.state.redirectTo = redirectTo;

  let recoveryKeys = ctx.state.user[config.userFields.otpRecoveryKeys];

  // ensure recovery matches user list of keys
  if (
    !isSANB(ctx.request.body.recovery_key) ||
    !Array.isArray(recoveryKeys) ||
    recoveryKeys.length === 0 ||
    !recoveryKeys.includes(ctx.request.body.recovery_key)
  )
    throw Boom.badRequest(ctx.translateError('INVALID_RECOVERY_KEY'));

  // remove used key from recovery key list
  recoveryKeys = recoveryKeys.filter(
    (key) => key !== ctx.request.body.recovery_key
  );

  const emptyRecoveryKeys = recoveryKeys.length === 0;
  const type = emptyRecoveryKeys ? 'warning' : 'success';
  redirectTo = emptyRecoveryKeys
    ? ctx.state.l('/my-account/security')
    : redirectTo;

  // handle case if the user runs out of keys
  if (emptyRecoveryKeys) {
    recoveryKeys = await Promise.all(
      Array.from({ length: 10 })
        .fill()
        .map(() => cryptoRandomString.async(options))
    );
  }

  ctx.state.user[config.userFields.otpRecoveryKeys] = recoveryKeys;
  ctx.state.user = await ctx.state.user.save();

  if (ctx.session) ctx.session.otp = 'totp-recovery';

  const message = ctx.translate(
    type === 'warning' ? 'OTP_RECOVERY_RESET' : 'OTP_RECOVERY_SUCCESS'
  );
  if (ctx.accepts('html')) {
    ctx.flash('custom', {
      title: ctx.request.t(titleize(type)),
      text: message,
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

    ctx.redirect(redirectTo);
  } else {
    ctx.body = {
      ...(emptyRecoveryKeys
        ? {
            swal: {
              title: ctx.translate('EMPTY_RECOVERY_KEYS'),
              type,
              text: message
            }
          }
        : { message }),
      redirectTo
    };
  }
}

async function register(ctx, next) {
  const { body } = ctx.request;

  if (!_.isString(body.email) || !validator.isEmail(body.email))
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

  if (!isSANB(body.password))
    throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));

  // register the user
  const query = {
    email: body.email,
    group: 'user',
    locale: ctx.locale
  };

  // Capture signup attribution from session or request
  // These are set by the analytics middleware when user first visits
  if (ctx.session) {
    if (ctx.session.signup_referrer) {
      query.signup_referrer = ctx.session.signup_referrer;
    }

    if (ctx.session.signup_referrer_source) {
      query.signup_referrer_source = ctx.session.signup_referrer_source;
    }

    if (ctx.session.signup_landing_page) {
      query.signup_landing_page = ctx.session.signup_landing_page;
    }

    // Capture UTM parameters
    if (ctx.session.signup_utm_source) {
      query.signup_utm_source = ctx.session.signup_utm_source;
    }

    if (ctx.session.signup_utm_medium) {
      query.signup_utm_medium = ctx.session.signup_utm_medium;
    }

    if (ctx.session.signup_utm_campaign) {
      query.signup_utm_campaign = ctx.session.signup_utm_campaign;
    }

    if (ctx.session.signup_utm_content) {
      query.signup_utm_content = ctx.session.signup_utm_content;
    }

    if (ctx.session.signup_utm_term) {
      query.signup_utm_term = ctx.session.signup_utm_term;
    }
  }

  if (config.env === 'development' || config.isSelfHosted) {
    const count = await Users.countDocuments({ group: 'admin' });
    if (count === 0) {
      query.group = 'admin';
      query.plan = 'team';
    }
  }

  query[config.userFields.hasVerifiedEmail] = false;
  query[config.userFields.hasSetPassword] = true;
  query[config.lastLocaleField] = ctx.locale;
  let user;
  try {
    user = await Users.register(query, body.password);
  } catch (err) {
    if (err instanceof errors.UserExistsError) {
      ctx.logger.warn(err);

      // Attempt to log the existing user in (e.g. they tried to log in from the signup page)
      return login(ctx, next);
    }

    throw err;
  }

  await ctx.login(user);

  let redirectTo = ctx.state.l(
    config.passportCallbackOptions.successReturnToOrRedirect
  );

  if (ctx.session && ctx.session.returnTo) {
    redirectTo = ctx.session.returnTo;
    delete ctx.session.returnTo;
  }

  ctx.flash('custom', {
    title: `${ctx.request.t('Thank you')} ${ctx.state.emoji('pray')}`,
    text: ctx.translate('REGISTERED'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

async function forgotPassword(ctx) {
  const { body } = ctx.request;

  if (!_.isString(body.email) || !validator.isEmail(body.email))
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

  // lookup the user
  let user = await Users.findOne({
    email: body.email,
    [config.userFields.isBanned]: false
  });

  // to prevent people from being able to find out valid email accounts
  // we always say "a password reset request has been sent to your email"
  // and if the email didn't exist in our system then we simply don't send it
  if (!user) {
    if (ctx.accepts('html')) {
      ctx.flash('success', ctx.translate('PASSWORD_RESET_SENT'));
      ctx.redirect('back');
    } else {
      ctx.body = {
        message: ctx.translate('PASSWORD_RESET_SENT')
      };
    }

    return;
  }

  // if we've already sent a reset password request in the past half hour
  if (
    user[config.userFields.resetTokenExpiresAt] &&
    user[config.userFields.resetToken] &&
    dayjs(user[config.userFields.resetTokenExpiresAt]).isAfter(
      dayjs().subtract(config.resetTokenTimeoutMs, 'milliseconds')
    )
  )
    throw Boom.badRequest(
      ctx.translateError(
        'PASSWORD_RESET_LIMIT',
        dayjs(user[config.userFields.resetTokenExpiresAt])
          .locale(ctx.locale)
          .fromNow()
      )
    );

  // set the reset token and expiry
  user[config.userFields.resetTokenExpiresAt] = new Date(
    Date.now() + config.resetTokenTimeoutMs
  );
  user[config.userFields.resetToken] = await cryptoRandomString.async({
    length: 32
  });

  user = await user.save();

  // queue password reset email
  try {
    await email({
      template: 'reset-password',
      message: {
        to: user.email
      },
      locals: {
        user: user.toObject(),
        link: `${config.urls.web}/reset-password/${
          user[config.userFields.resetToken]
        }`
      }
    });

    if (ctx.accepts('html')) {
      ctx.flash('success', ctx.translate('PASSWORD_RESET_SENT'));
      ctx.redirect('back');
    } else {
      ctx.body = {
        message: ctx.translate('PASSWORD_RESET_SENT')
      };
    }
  } catch (err) {
    ctx.logger.fatal(err);
    // reset if there was an error
    try {
      user[config.userFields.resetToken] = undefined;
      user[config.userFields.resetTokenExpiresAt] = undefined;
      user = await user.save();
    } catch (err) {
      ctx.logger.error(err);
    }

    throw Boom.badRequest(ctx.translateError('EMAIL_FAILED_TO_SEND'));
  }
}

async function resetPassword(ctx) {
  const { body } = ctx.request;

  if (!_.isString(body.email) || !validator.isEmail(body.email))
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

  if (!isSANB(body.password))
    throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));

  if (!isSANB(ctx.params.token))
    throw Boom.badRequest(ctx.translateError('INVALID_RESET_TOKEN'));

  // lookup the user that has this token and if it matches the email passed
  let user = await Users.findOne({
    email: body.email.trim().toLowerCase(),
    [config.userFields.resetToken]: ctx.params.token,
    [config.userFields.isBanned]: false
  });

  if (!user)
    throw Boom.badRequest(ctx.translateError('INVALID_RESET_PASSWORD'));

  // ensure that the reset token expires at value is in the future (hasn't expired)
  if (
    !_.isDate(user[config.userFields.resetTokenExpiresAt]) ||
    new Date(user[config.userFields.resetTokenExpiresAt]).getTime() < Date.now()
  )
    throw Boom.badRequest(ctx.translateError('RESET_TOKEN_EXPIRED'));

  user[config.userFields.resetToken] = undefined;
  user[config.userFields.resetTokenExpiresAt] = undefined;

  await user.setPassword(body.password);
  user = await user.save();
  await ctx.login(user);
  // if user changed password then invalidate all other sessions
  invalidateOtherSessions(ctx)
    .then()
    .catch((err) => ctx.logger.fatal(err));
  const message = ctx.translate('RESET_PASSWORD');
  const redirectTo = ctx.state.l();
  if (ctx.accepts('html')) {
    ctx.flash('success', message);
    ctx.redirect(redirectTo);
  } else {
    ctx.body = {
      message,
      redirectTo
    };
  }
}

async function changeEmail(ctx) {
  const { body } = ctx.request;

  if (!isSANB(body.password))
    throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));

  if (!isSANB(ctx.params.token))
    throw Boom.badRequest(ctx.translateError('INVALID_RESET_TOKEN'));

  // lookup the user that has this token and if it matches the email passed
  const query = { email: body.email };
  query[config.userFields.changeEmailToken] = ctx.params.token;
  // ensure that the reset token expires at value is in the future (hasn't expired)
  query[config.userFields.changeEmailTokenExpiresAt] = { $gte: new Date() };
  query[config.userFields.isBanned] = false;
  const user = await Users.findOne(query);

  if (!user) throw Boom.badRequest(ctx.translateError('INVALID_SET_EMAIL'));

  const auth = await user.authenticate(body.password);
  if (!auth.user) throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));

  const newEmail = user[config.userFields.changeEmailNewAddress];
  user[config.passportLocalMongoose.usernameField] = newEmail;
  await user.save();

  if (isSANB(user[config.userFields.stripeCustomerID])) {
    try {
      await stripe.customers.update(user[config.userFields.stripeCustomerID], {
        email: user.email
      });
    } catch (err) {
      ctx.logger.fatal(err);
    }
  }

  // reset change email info
  user[config.userFields.changeEmailToken] = undefined;
  user[config.userFields.changeEmailTokenExpiresAt] = undefined;
  user[config.userFields.changeEmailNewAddress] = undefined;
  await user.save();

  const message = ctx.translate('CHANGE_EMAIL');
  const redirectTo = ctx.state.l();
  if (ctx.accepts('html')) {
    ctx.flash('success', message);
    ctx.redirect(redirectTo);
  } else {
    ctx.body = {
      message,
      redirectTo
    };
  }
}

async function catchError(ctx, next) {
  try {
    await next();
  } catch (err) {
    // <https://blog.timekit.io/google-oauth-invalid-grant-nightmare-and-how-to-fix-it-9f4efaf1da35>
    // <https://blog.zakwest.co.uk/how-to-use-time-cloudflare-com-on-linux/>
    if (
      ctx.params.provider === 'google' &&
      (err.consent_required || err.code === 'invalid_grant')
    ) {
      ctx.logger.warn(err);
      return ctx.redirect('/auth/google/consent');
    }

    ctx.logger.error(err);
    ctx.flash('error', err.message);
    const redirectTo = ctx.state.l('/login');
    if (ctx.accepts('html')) {
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { redirectTo };
    }
  }
}

async function verify(ctx) {
  let redirectTo = ctx.state.l(
    config.passportCallbackOptions.successReturnToOrRedirect
  );

  if (ctx.session && ctx.session.returnTo) {
    redirectTo = ctx.session.returnTo;
    delete ctx.session.returnTo;
  }

  ctx.state.redirectTo = redirectTo;

  if (
    ctx.state.user[config.userFields.hasVerifiedEmail] &&
    !ctx.state.user[config.userFields.pendingRecovery]
  ) {
    const message = ctx.translate('EMAIL_ALREADY_VERIFIED');
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: message,
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 10000,
      position: 'top'
    });
    if (ctx.accepts('html')) {
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { redirectTo };
    }

    return;
  }

  // allow user to click a button to request a new email after 60 seconds
  // after their last attempt to get a verification email
  const resend = ctx.method === 'GET' && boolean(ctx.query.resend);

  if (
    !ctx.state.user[config.userFields.verificationPin] ||
    !ctx.state.user[config.userFields.verificationPinExpiresAt] ||
    ctx.state.user[config.userFields.verificationPinHasExpired] ||
    resend
  ) {
    try {
      ctx.state.user = await sendVerificationEmail(ctx);
    } catch (err) {
      // if email failed to send then verify the user automatically
      // but if and only if the user was not pending recovery
      if (
        err.has_email_failed &&
        !ctx.state.user[config.userFields.pendingRecovery]
      ) {
        ctx.logger.fatal(err);
        ctx.state.user[config.userFields.hasVerifiedEmail] = true;
        try {
          ctx.state.user = await ctx.state.user.save();
        } catch (err) {
          ctx.logger.fatal(err);
          ctx.flash('error', ctx.translate('UNKNOWN_ERROR'));
        }

        if (ctx.accepts('html')) {
          ctx.redirect(redirectTo);
        } else {
          ctx.body = { redirectTo };
        }

        return;
      }

      // wrap with try/catch to prevent redirect looping
      // (even though the koa redirect loop package will help here)
      if (!err.isBoom) throw err;
      ctx.logger.error(err);
      if (ctx.accepts('html')) {
        ctx.flash('warning', err.message);
        ctx.redirect(redirectTo);
      } else {
        ctx.body = { message: err.message };
      }

      return;
    }

    const message = ctx.translate(
      ctx.state.user[config.userFields.verificationPinHasExpired]
        ? 'EMAIL_VERIFICATION_EXPIRED'
        : 'EMAIL_VERIFICATION_SENT'
    );

    if (!ctx.accepts('html')) {
      ctx.body = { message };
      return;
    }

    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: message,
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 10000,
      position: 'top'
    });
  }

  // if it's a GET request then render the page
  if (ctx.method === 'GET' && !isSANB(ctx.query.pin))
    return ctx.render('verify');

  // if it's a POST request then ensure the user entered the 6 digit pin
  // otherwise if it's a GET request then use the ctx.query.pin
  let pin = '';
  if (ctx.method === 'GET' && isSANB(ctx.query.pin)) pin = ctx.query.pin;
  else pin = isSANB(ctx.request.body.pin) ? ctx.request.body.pin : '';

  // convert to digits only
  pin = pin.replace(/\D/g, '');

  // ensure pin matches up
  if (
    !ctx.state.user[config.userFields.verificationPin] ||
    pin !== ctx.state.user[config.userFields.verificationPin]
  )
    throw Boom.badRequest(ctx.translateError('INVALID_VERIFICATION_PIN'));

  // set has verified to true
  ctx.state.user[config.userFields.hasVerifiedEmail] = true;
  ctx.state.user = await ctx.state.user.save();

  const pendingRecovery = ctx.state.user[config.userFields.pendingRecovery];
  if (pendingRecovery) {
    try {
      await email({
        template: 'recovery',
        message: {
          to: ctx.state.user.email,
          cc: config.email.message.from
        },
        locals: {
          user: ctx.state.user.toObject()
        }
      });
    } catch (err) {
      ctx.logger.fatal(err);
      throw Boom.badRequest(ctx.translateError('EMAIL_FAILED_TO_SEND'));
    }
  }

  const message = pendingRecovery
    ? ctx.translate('PENDING_RECOVERY_VERIFICATION_SUCCESS')
    : ctx.translate('EMAIL_VERIFICATION_SUCCESS');

  redirectTo = pendingRecovery ? '/logout' : redirectTo;

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: message,
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) {
    ctx.redirect(redirectTo);
  } else {
    ctx.body = { redirectTo };
  }
}

module.exports = {
  logout,
  registerOrLogin,
  homeOrDomains,
  login,
  loginOtp,
  register,
  forgotPassword,
  recoveryKey,
  resetPassword,
  changeEmail,
  catchError,
  verify,
  parseReturnOrRedirectTo
};
