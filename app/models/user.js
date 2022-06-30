const Boom = require('@hapi/boom');
const _ = require('lodash');
const captainHook = require('captain-hook');
const countryList = require('country-list');
const cryptoRandomString = require('crypto-random-string');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const mongooseOmitCommonFields = require('mongoose-omit-common-fields');
const ms = require('ms');
const passportLocalMongoose = require('passport-local-mongoose');
const superagent = require('superagent');
const validator = require('validator');
const { authenticator } = require('otplib');
const { boolean } = require('boolean');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const logger = require('#helpers/logger');
const config = require('#config');
const i18n = require('#helpers/i18n');

if (config.passportLocalMongoose.usernameField !== 'email')
  throw new Error(
    'User model and @ladjs/passport requires that the usernameField is email'
  );

const countries = countryList.getNames().sort();
const options = { length: 10, type: 'numeric' };
const { fields } = config.passport;
const omitExtraFields = [
  ..._.without(mongooseOmitCommonFields.underscored.keys, 'email'),
  config.userFields.apiToken,
  config.userFields.resetTokenExpiresAt,
  config.userFields.resetToken,
  config.userFields.changeEmailTokenExpiresAt,
  config.userFields.changeEmailToken,
  config.userFields.changeEmailNewAddress,
  config.userFields.hasSetPassword,
  config.userFields.hasVerifiedEmail,
  config.userFields.verificationPinExpiresAt,
  config.userFields.verificationPin,
  config.userFields.verificationPinSentAt,
  config.userFields.welcomeEmailSentAt,
  config.userFields.otpRecoveryKeys,
  config.userFields.pendingRecovery,
  config.userFields.isBanned,
  config.userFields.accountUpdates,
  config.userFields.twoFactorReminderSentAt,
  config.userFields.planSetAt,
  config.userFields.planExpiresAt,
  fields.otpEnabled,
  fields.otpToken,
  config.userFields.launchEmailSentAt,
  config.userFields.stripeCustomerID,
  config.userFields.stripeSubscriptionID,
  config.userFields.paypalPayerID,
  config.userFields.paypalSubscriptionID,
  config.userFields.addressHTML
];

const User = new mongoose.Schema({
  // plan
  plan: {
    type: String,
    enum: ['free', 'enhanced_protection', 'team'],
    default: 'free'
  },
  // group permissions
  group: {
    type: String,
    default: 'user',
    enum: ['admin', 'user'],
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    index: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: (value) => validator.isEmail(value)
  }
});

// additional variable based properties to add to the schema
const object = {};

// stripe
object[config.userFields.stripeCustomerID] = String;
object[config.userFields.stripeSubscriptionID] = String;

// paypal
object[config.userFields.paypalPayerID] = String;
object[config.userFields.paypalSubscriptionID] = String;

// two factor auth reminders
object[config.userFields.twoFactorReminderSentAt] = Date;

// when the user upgraded to a paid plan
object[config.userFields.planSetAt] = Date;

// when the user's plan expires
object[config.userFields.planExpiresAt] = Date;

// user fields
object[config.userFields.isBanned] = {
  type: Boolean,
  default: false
};

object[config.userFields.fullEmail] = {
  type: String,
  required: true,
  trim: true
};

object[config.userFields.defaultDomain] = {
  type: mongoose.Schema.ObjectId,
  ref: 'Domain'
};

// api token for basic auth
object[config.userFields.apiToken] = {
  type: String,
  required: true,
  lowercase: true,
  trim: true,
  unique: true,
  index: true
};

object[config.userFields.otpRecoveryKeys] = Array;

// password reset
object[config.userFields.resetTokenExpiresAt] = Date;
object[config.userFields.resetToken] = String;

// email change
object[config.userFields.changeEmailTokenExpiresAt] = Date;
object[config.userFields.changeEmailToken] = String;
object[config.userFields.changeEmailNewAddress] = String;

// welcome email
object[config.userFields.welcomeEmailSentAt] = Date;

// launch email (before 11/23/2020 10:00 AM)
object[config.userFields.launchEmailSentAt] = Date;

// account verification
object[config.userFields.hasSetPassword] = {
  type: Boolean,
  default: false // manually set to true during web/API signup
};
object[config.userFields.hasVerifiedEmail] = {
  type: Boolean,
  default: true, // manually set to false during web/API signup
  index: true
};
object[config.userFields.verificationPinExpiresAt] = Date;
object[config.userFields.verificationPinSentAt] = Date;
object[config.userFields.verificationPin] = {
  type: String,
  trim: true,
  validate: (value) => isSANB(value) && value.replace(/\D/g, '').length === 6
};

object[config.userFields.pendingRecovery] = {
  type: Boolean,
  default: false
};

// list of account updates that are batched every 1 min.
object[config.userFields.accountUpdates] = Array;

// shared field names with @ladjs/passport for consistency
object[fields.displayName] = {
  type: String,
  required: true,
  trim: true,
  maxlength: 70
};
object[fields.givenName] = {
  type: String,
  trim: true,
  maxlength: 35
};
object[fields.familyName] = {
  type: String,
  trim: true,
  maxlength: 35
};
object[fields.avatarURL] = {
  type: String,
  trim: true,
  validate: (value) => validator.isURL(value)
};
// apple
object[fields.appleProfileID] = {
  type: String,
  index: true
};
object[fields.appleAccessToken] = String;
object[fields.appleRefreshToken] = String;
// google
object[fields.googleProfileID] = {
  type: String,
  index: true
};
object[fields.googleAccessToken] = String;
object[fields.googleRefreshToken] = String;
// github
object[fields.githubProfileID] = {
  type: String,
  index: true
};
object[fields.githubAccessToken] = String;
object[fields.githubRefreshToken] = String;

object[fields.otpEnabled] = {
  type: Boolean,
  default: false
};
object[fields.otpToken] = String;

// shared field names with @ladjs/i18n and email-templates
object[config.lastLocaleField] = {
  type: String,
  default: i18n.getLocale()
};

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
  config.userFields.companyVAT
]) {
  object[prop] = {
    type: String,
    trim: true,
    maxlength: 255
  };
}

object[config.userFields.addressCountry] = {
  type: String,
  enum: ['None', ...countries],
  default: 'None'
};

// finally add the fields
User.add(object);

User.plugin(captainHook);

User.virtual(config.userFields.addressHTML).get(function () {
  const companyName = this[config.userFields.companyName];
  const name = [
    this[config.passport.fields.givenName],
    this[config.passport.fields.familyName]
  ]
    .filter(Boolean)
    .join(' ');
  const arr = [
    companyName || name ? `<strong>${companyName || name}</strong>` : null,
    this[config.userFields.addressLine1],
    this[config.userFields.addressLine2],
    [
      this[config.userFields.addressCity],
      this[config.userFields.addressState],
      this[config.userFields.addressZip]
    ]
      .filter(Boolean)
      .join(', '),
    this[config.userFields.addressCountry] &&
    this[config.userFields.addressCountry] !== 'None'
      ? this[config.userFields.addressCountry]
      : null
  ];
  return arr.filter(Boolean).join('<br />');
});

User.virtual(config.userFields.verificationPinHasExpired).get(function () {
  return boolean(
    !this[config.userFields.verificationPinExpiresAt] ||
      new Date(this[config.userFields.verificationPinExpiresAt]).getTime() <
        Date.now()
  );
});

//
// TODO: this should be moved to redis or its own package under forwardemail or @ladjs
//
let disposableDomains = [];
async function crawlDisposable() {
  try {
    const { text } = await superagent
      .get(
        'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.json'
      )
      .timeout(ms('5s'));
    const json = JSON.parse(text);
    if (!Array.isArray(json) || json.length === 0)
      throw new Error('Disposable did not crawl data');
    disposableDomains = json;
  } catch (err) {
    logger.fatal(err);
  }
}

setInterval(crawlDisposable, ms('1d'));

crawlDisposable();

// this ensures that `email` was already validated, trimmed, lowercased
User.pre('save', async function (next) {
  // only do this for new users signing up
  // (we will most likely deprecate disposable; see jobs/check-disposable)
  if (!this.isNew) return next();

  const domain = this.email.split('@')[1];
  if (disposableDomains.length === 0) await crawlDisposable();
  // TODO: convert to Set with set.has(x) lookup vs arr.indexOf(x) !== -1
  // eslint-disable-next-line unicorn/prefer-includes
  if (disposableDomains.indexOf(domain) !== -1) {
    const err = Boom.badRequest(
      i18n.api.t({
        phrase: config.i18n.phrases.DISPOSABLE_EMAIL_NOT_ALLOWED,
        locale: this[config.lastLocaleField]
      })
    );
    err.no_translate = true;
    return next(err);
  }

  next();
});

User.pre('validate', async function (next) {
  try {
    // create api token if doesn't exist
    if (!isSANB(this[config.userFields.apiToken]))
      this[config.userFields.apiToken] = await cryptoRandomString.async({
        length: 24
      });

    // set the user's display name to their email address
    // but if they have a name or surname set then use that
    this[fields.displayName] = this.email;
    if (isSANB(this[fields.givenName]) || isSANB(this[fields.familyName])) {
      this[fields.displayName] = `${this[fields.givenName] || ''} ${
        this[fields.familyName] || ''
      }`;
    }

    // set the user's full email address (incl display name)
    this[config.userFields.fullEmail] =
      this[fields.displayName] && this[fields.displayName] !== this.email
        ? `${this[fields.displayName]} <${this.email}>`
        : this.email;

    // if otp authentication values no longer valid
    // then disable it completely
    if (
      !Array.isArray(this[config.userFields.otpRecoveryKeys]) ||
      !this[config.userFields.otpRecoveryKeys] ||
      this[config.userFields.otpRecoveryKeys].length === 0 ||
      !this[config.passport.fields.otpToken]
    )
      this[fields.otpEnabled] = false;

    if (
      !Array.isArray(this[config.userFields.otpRecoveryKeys]) ||
      this[config.userFields.otpRecoveryKeys].length === 0
    )
      this[config.userFields.otpRecoveryKeys] = await Promise.all(
        Array.from({ length: 10 })
          .fill()
          .map(() => cryptoRandomString.async(options))
      );

    if (!this[config.passport.fields.otpToken])
      this[config.passport.fields.otpToken] = authenticator.generateSecret();

    next();
  } catch (err) {
    next(err);
  }
});

//
// NOTE: you should not call this method directly
// instead you should use the helper located at
// `../helpers/send-verification-email.js`
//
User.methods.updateVerificationPin = async function (ctx, revert = false) {
  if (revert) {
    this[config.userFields.verificationPinExpiresAt] =
      this[`__${config.userFields.verificationPinExpiresAt}`];
    this[config.userFields.verificationPin] =
      this[`__${config.userFields.verificationPin}`];
    await this.save();
    return this;
  }

  // store old values in case we have to revert
  this[`__${config.userFields.verificationPinExpiresAt}`] =
    this[config.userFields.verificationPinExpiresAt];
  this[`__${config.userFields.verificationPin}`] =
    this[config.userFields.verificationPin];

  // set new values if necessary
  if (
    !this[config.userFields.verificationPinExpiresAt] ||
    this[config.userFields.verificationPinHasExpired] ||
    !isSANB(this[config.userFields.verificationPin])
  ) {
    this[config.userFields.verificationPinExpiresAt] = new Date(
      Date.now() + config.verificationPinTimeoutMs
    );
    this[config.userFields.verificationPin] = await cryptoRandomString.async(
      config.verificationPin
    );
  }

  const diff = this[config.userFields.verificationPinSentAt]
    ? Date.now() -
      new Date(this[config.userFields.verificationPinSentAt]).getTime()
    : false;

  const sendNewEmail =
    this[config.userFields.verificationPinHasExpired] ||
    !this[config.userFields.verificationPinSentAt] ||
    (diff && diff >= config.verificationPinEmailIntervalMs);

  // ensure the user waited as long as necessary to send a new pin email
  if (!sendNewEmail) {
    const message = i18n.api.t(
      {
        phrase: config.i18n.phrases.EMAIL_VERIFICATION_INTERVAL,
        locale: this[config.lastLocaleField]
      },
      dayjs
        .duration(config.verificationPinEmailIntervalMs - diff, 'milliseconds')
        .locale(this[config.lastLocaleField])
        .humanize()
    );
    if (ctx) {
      const err = Boom.badRequest(message);
      err.no_translate = true;
      throw err;
    }

    const err = new Error(message);
    err.no_translate = true;
    throw err;
  }

  // save the updated pin
  await this.save();

  return this;
};

User.plugin(mongooseCommonPlugin, {
  object: 'user',
  omitCommonFields: false,
  omitExtraFields,
  mongooseHidden: {
    virtuals: {
      [config.userFields.verificationPinHasExpired]: 'hide'
    }
  }
});

User.plugin(passportLocalMongoose, config.passportLocalMongoose);

User.post('init', (doc) => {
  for (const field of config.accountUpdateFields) {
    const fieldName = _.get(config, field);
    doc[`__${fieldName}`] = doc[fieldName];
  }
});

User.pre('save', function (next) {
  // filter by allowed field updates (otp enabled, profile updates, etc)
  for (const field of config.accountUpdateFields) {
    const fieldName = _.get(config, field);
    if (this[`__${fieldName}`] && this[`__${fieldName}`] !== this[fieldName]) {
      this[config.userFields.accountUpdates].push({
        fieldName,
        current: this[fieldName],
        previous: this[`__${fieldName}`]
      });
      // revert so we don't get into infinite loop
      this[`__${fieldName}`] = this[fieldName];
    }
  }

  next();
});

User.postCreate((user, next) => {
  logger.info('user created', {
    user: user.toObject()
  });
  next();
});

module.exports = mongoose.model('User', User);
