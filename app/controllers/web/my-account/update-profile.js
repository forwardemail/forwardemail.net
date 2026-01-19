/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const cryptoRandomString = require('crypto-random-string');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const { boolean } = require('boolean');
const _ = require('#helpers/lodash');

const config = require('#config');
const emailHelper = require('#helpers/email');
const invalidateOtherSessions = require('#helpers/invalidate-other-sessions');
const isEmail = require('#helpers/is-email');
const { Users } = require('#models');

async function updateProfile(ctx) {
  const { body } = ctx.request;

  // communication preferences
  if (boolean(body.is_communication_preferences)) {
    const newsletterChanged =
      ctx.state.user.has_newsletter !== boolean(body.newsletter);

    // newsletter
    ctx.state.user.has_newsletter = boolean(body.newsletter);

    // opt_out_templates
    ctx.state.user.opt_out_templates = [];

    for (const optOutTemplate of config.optOutTemplates) {
      if (!boolean(body[optOutTemplate])) {
        ctx.state.user.opt_out_templates.push(optOutTemplate);
      }
    }

    ctx.state.user = await ctx.state.user.save();

    if (!ctx.api && newsletterChanged) {
      ctx.flash(
        'success',
        ctx.translate(
          boolean(body.newsletter)
            ? 'NEWSLETTER_SUBSCRIBED'
            : 'NEWSLETTER_UNSUBSCRIBED'
        )
      );
    }

    if (ctx.accepts('html')) ctx.redirect('back');
    else ctx.body = { reloadPage: true };
    return;
  }

  const hasSetPassword = ctx.state.user[config.userFields.hasSetPassword];
  const changePassword = body.change_password === 'true';

  const requiredFields = ['password', 'confirm_password'];

  if (hasSetPassword) requiredFields.push('old_password');

  if (changePassword) {
    for (const prop of requiredFields) {
      if (!isSANB(body[prop]))
        throw Boom.badRequest(
          ctx.translateError('INVALID_STRING', ctx.request.t(humanize(prop)))
        );
    }

    if (body.password !== body.confirm_password)
      throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD_CONFIRM'));

    if (hasSetPassword)
      await ctx.state.user.changePassword(body.old_password, body.password);
    else {
      await ctx.state.user.setPassword(body.password);
      ctx.state.user[config.userFields.hasSetPassword] = true;
    }

    ctx.state.user[config.userFields.resetToken] = undefined;
    ctx.state.user[config.userFields.resetTokenExpiresAt] = undefined;
  } else {
    //
    // personal information
    //
    if (_.isString(body[config.passport.fields.givenName]))
      ctx.state.user[config.passport.fields.givenName] =
        body[config.passport.fields.givenName];

    //
    // Language preference - allows users to set their preferred locale
    // When set, this overrides automatic locale detection
    //
    if (
      _.isString(body.preferred_locale) && // Allow empty string to reset to auto-detect, or valid locale
      (body.preferred_locale === '' ||
        config.i18n.locales.includes(body.preferred_locale))
    ) {
      ctx.state.user.preferred_locale = body.preferred_locale;
    }

    if (_.isString(body[config.passport.fields.familyName]))
      ctx.state.user[config.passport.fields.familyName] =
        body[config.passport.fields.familyName];
    if (
      _.isString(body[config.userFields.defaultDomain]) &&
      (body[config.userFields.defaultDomain] === 'None' ||
        ctx.state.domains.some(
          (d) => d.id === body[config.userFields.defaultDomain]
        ))
    )
      ctx.state.user[config.userFields.defaultDomain] =
        body[config.userFields.defaultDomain] === 'None'
          ? undefined
          : body[config.userFields.defaultDomain];

    // receipt email
    if (_.isString(body[config.userFields.receiptEmail])) {
      if (body[config.userFields.receiptEmail]) {
        if (!isEmail(body[config.userFields.receiptEmail]))
          throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));
        ctx.state.user[config.userFields.receiptEmail] =
          body[config.userFields.receiptEmail];
      } else ctx.state.user[config.userFields.receiptEmail] = undefined;
    }

    //
    // company information
    //
    for (const prop of [
      config.userFields.companyName,
      config.userFields.addressLine1,
      config.userFields.addressLine2,
      config.userFields.addressCity,
      config.userFields.addressState,
      config.userFields.addressZip,
      config.userFields.addressCountry,
      config.userFields.companyVAT
    ]) {
      if (_.isString(body[prop])) ctx.state.user[prop] = body[prop];
    }
  }

  // check if we need to update the email and send an email confirmation
  const hasNewEmail =
    isSANB(body.email) &&
    ctx.state.user[config.passportLocalMongoose.usernameField] !== body.email;

  // confirm user supplied email is different than current email
  if (hasNewEmail) {
    // ensure that a password has been set first
    // (this is a safety guard even though the email is read only if so)
    if (!ctx.state.user[config.userFields.hasSetPassword])
      throw Boom.badRequest(ctx.translateError('PASSWORD_REQUIRED'));

    // validate it (so it doesn't have to use mongoose for this)
    if (!isEmail(body.email))
      throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

    // if we've already sent a change email request in the past half hour
    if (
      ctx.state.user[config.userFields.changeEmailTokenExpiresAt] &&
      ctx.state.user[config.userFields.changeEmailToken] &&
      dayjs(
        ctx.state.user[config.userFields.changeEmailTokenExpiresAt]
      ).isAfter(
        dayjs().subtract(config.changeEmailTokenTimeoutMs, 'milliseconds')
      )
    )
      throw Boom.badRequest(
        ctx.translateError(
          'EMAIL_CHANGE_LIMIT',
          dayjs.duration(config.changeEmailLimitMs, 'milliseconds').minutes(),
          dayjs(ctx.state.user[config.userFields.changeEmailTokenExpiresAt])
            .locale(ctx.locale)
            .fromNow()
        )
      );

    // short-circuit if email already exists
    const query = { email: body.email.toLowerCase().trim() };
    const user = await Users.findOne(query);
    if (user)
      throw Boom.badRequest(
        ctx.translateError('EMAIL_CHANGE_ALREADY_EXISTS', query.email)
      );

    // set the reset token and expiry
    ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = dayjs()
      .add(config.changeEmailTokenTimeoutMs, 'milliseconds')
      .toDate();
    ctx.state.user[config.userFields.changeEmailToken] =
      await cryptoRandomString.async({
        length: 32
      });
    ctx.state.user[config.userFields.changeEmailNewAddress] = query.email;
  }

  // save the user
  ctx.state.user = await ctx.state.user.save();

  // if user changed password then invalidate all other sessions
  if (changePassword) {
    invalidateOtherSessions(ctx)
      .then()
      .catch((err) => ctx.logger.fatal(err));
  }

  // send the email
  if (hasNewEmail) {
    try {
      await emailHelper({
        template: 'change-email',
        message: {
          to: ctx.state.user[config.userFields.changeEmailNewAddress]
        },
        locals: {
          user: _.pick(ctx.state.user, [
            config.userFields.changeEmailTokenExpiresAt,
            config.userFields.changeEmailNewAddress,
            config.passportLocalMongoose.usernameField
          ]),
          link: `${config.urls.web}/my-account/change-email/${
            ctx.state.user[config.userFields.changeEmailToken]
          }`
        }
      });
    } catch (err) {
      ctx.logger.fatal(err);
      // reset if there was an error
      try {
        ctx.state.user[config.userFields.changeEmailToken] = undefined;
        ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = undefined;
        ctx.state.user[config.userFields.changeEmailNewAddress] = undefined;
        ctx.state.user = await ctx.state.user.save();
      } catch (err) {
        ctx.logger.error(err);
      }

      throw Boom.badRequest(ctx.translateError('EMAIL_FAILED_TO_SEND'));
    }
  }

  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate(hasNewEmail ? 'EMAIL_CHANGE_SENT' : 'REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = updateProfile;
