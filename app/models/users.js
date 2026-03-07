/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

const Boom = require('@hapi/boom');
const Redis = require('@ladjs/redis');
const bytes = require('@forwardemail/bytes');
const countryList = require('country-list');
const cryptoRandomString = require('crypto-random-string');
const dayjs = require('dayjs-with-plugins');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const mongooseOmitCommonFields = require('mongoose-omit-common-fields');
const ms = require('ms');
const passportLocalMongoose = require('passport-local-mongoose');
const safeStringify = require('fast-safe-stringify');
const sanitizeHtml = require('sanitize-html');
const sharedConfig = require('@ladjs/shared-config');
const striptags = require('striptags');
const validator = require('@forwardemail/validator');
const { authenticator } = require('otplib');
const { boolean } = require('boolean');
const { isURL } = require('@forwardemail/validator');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const Payments = require('./payments');

const TimezoneHandler = require('#helpers/timezone-handler');
const _ = require('#helpers/lodash');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const email = require('#helpers/email');
const getUbuntuMembersMap = require('#helpers/get-ubuntu-members-map');
const i18n = require('#helpers/i18n');
const isDenylisted = require('#helpers/is-denylisted');
const isEmail = require('#helpers/is-email');
const logger = require('#helpers/logger');
const syncUbuntuUser = require('#helpers/sync-ubuntu-user');

// TODO: use a global redis/resolver approach like global mongoose
const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client, logger);

const timezoneHandler = new TimezoneHandler();

if (config.passportLocalMongoose.usernameField !== 'email') {
  throw new Error(
    'User model and @ladjs/passport requires that the usernameField is email.'
  );
}

const countries = countryList.getNames().sort();
const options = { length: 10, type: 'numeric' };
const { fields } = config.passport;
const omitExtraFields = [
  ..._.without(mongooseOmitCommonFields.underscored.keys, 'email'),
  'has_passed_kyc',
  'passkeys',
  config.userFields.domainCount,
  config.userFields.aliasCount,
  // TODO: change to allowlist
  config.userFields.isRateLimitWhitelisted,
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
  config.userFields.featureReminderSentAt,
  config.userFields.pastDueReliefSentAt,
  config.userFields.dailyLogAlertSentAt,
  config.userFields.planSetAt,
  config.userFields.planExpiresAt,
  // fields.otpEnabled,
  fields.otpToken,
  config.userFields.launchEmailSentAt,
  config.userFields.stripeCustomerID,
  config.userFields.stripeSubscriptionID,
  config.userFields.paypalPayerID,
  config.userFields.paypalSubscriptionID,
  config.userFields.addressHTML,
  config.userFields.hasDenylistRequests,
  config.userFields.approvedDomains,
  config.userFields.isRemoved,
  config.userFields.smtpLimit,

  config.userFields.apiPastDueSentAt,
  config.userFields.apiRestrictedSentAt,

  // Signup attribution fields (analytics)
  'signup_referrer',
  'signup_referrer_source',
  'signup_landing_page',
  'signup_utm_source',
  'signup_utm_medium',
  'signup_utm_campaign',
  'signup_utm_content',
  'signup_utm_term'
];

function isNameValue(value) {
  // allow null values and empty strings
  if (!value || (typeof value === 'string' && !isSANB(value))) return true;
  // it should not be an email, url, fqdn, or IP
  if (isFQDN(value) || isIP(value) || isURL(value) || isEmail(value))
    return false;
  return true;
}

const Passkey = new mongoose.Schema({
  nickname: {
    type: String,
    maxlength: 150,
    trim: true
  },
  credentialId: {
    type: String,
    trim: true
  },
  publicKey: {
    type: String,
    trim: true
  },
  // sha256 is publicKey converted to base64 and then sha256 hashed
  sha256: String
});

Passkey.plugin(mongooseCommonPlugin, {
  object: 'passkey',
  omitCommonFields: false,
  omitExtraFields: ['_id', '__v'],
  uniqueId: false,
  locale: false
});

let map;

if (config.env === 'production') {
  // cache the ubuntu members map immediately
  (async () => {
    try {
      map = await getUbuntuMembersMap(resolver);
    } catch (err) {
      logger.fatal(err);
    }
  })();

  // every 5 minutes update the ubuntu members map
  setInterval(async () => {
    try {
      map = await getUbuntuMembersMap(resolver);
    } catch (err) {
      logger.fatal(err);
    }
  }, ms('5m'));
}

const Users = new mongoose.Schema({
  //
  // has passed kyc (know your customer)
  // (set to true by default)
  //
  // TODO: if user has >= 5 domains already approved then auto-approves
  // TODO: automatically set `has_passed_kyc` to `true` for all existing with `has_smtp` and >= 5 domains
  //
  has_passed_kyc: {
    type: Boolean,
    default: false,
    index: true
  },

  // Session Management (rudimentary)
  sessions: [String], // simple Array of session ID's currently signed in

  // Newsletter opt-in
  has_newsletter: {
    type: Boolean,
    default: true,
    index: true
  },

  //
  // users have complained that they want opted out of certain emails
  // like the marketing and two-factor auth reminder emails
  //
  // - feature-reminder
  // - two-factor-reminder
  // - welcome
  //
  // NOTE: daily-log-alert and weekly-dmarc-report are opted out by default
  //       to reduce email noise for new users
  //
  opt_out_templates: {
    type: [
      {
        type: String,
        lowercase: true,
        trim: true,
        enum: config.optOutTemplates
      }
    ],
    index: true,
    default: ['daily-log-alert', 'weekly-dmarc-report']
  },

  // Timezone
  // (automatically updated client-side via POST /my-account/timezone)
  timezone: {
    type: String,
    default: 'UTC'
  },

  // Signup attribution (where the user originally came from)
  // These fields are set once at signup and never modified
  signup_referrer: {
    type: String,
    maxlength: 255 // Domain only, not full URL for privacy
  },
  signup_referrer_source: {
    type: String,
    maxlength: 50, // Categorized: 'search', 'social', 'direct', etc.
    index: true
  },
  signup_landing_page: {
    type: String,
    maxlength: 500 // The first page the user landed on
  },
  signup_utm_source: {
    type: String,
    maxlength: 100,
    index: true
  },
  signup_utm_medium: {
    type: String,
    maxlength: 100
  },
  signup_utm_campaign: {
    type: String,
    maxlength: 100,
    index: true
  },
  signup_utm_content: {
    type: String,
    maxlength: 100
  },
  signup_utm_term: {
    type: String,
    maxlength: 100
  },

  // Passkeys
  passkeys: [Passkey],
  // Plan
  plan: {
    type: String,
    enum: ['free', 'enhanced_protection', 'team'],
    default: 'free',
    index: true
  },
  // Group permissions
  group: {
    type: String,
    default: 'user',
    enum: ['admin', 'user'],
    lowercase: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: (value) => validator.isEmail(value)
  },
  scheduled_send_sent_at: Date,
  smtp_rate_limit_sent_at: Date,
  holiday_2025_email_sent_at: Date
});

// Additional variable based properties to add to the schema
const object = {};

object[config.userFields.maxQuotaPerAlias] = {
  type: Number,
  default: config.maxQuotaPerAlias,
  min: 0,
  //
  // NOTE: hard-coded max of 100 GB (safeguard)
  //
  max: bytes('100GB')
};

object[config.userFields.smtpLimit] = {
  type: Number,
  default: config.smtpLimitMessages,
  min: 10,
  max: 100000
};

// SMTP count tracking for admin dashboard
object.smtp_emails_sent_1h = {
  type: Number,
  default: 0,
  min: 0,
  index: true
};

object.smtp_emails_sent_24h = {
  type: Number,
  default: 0,
  min: 0,
  index: true
};

object.smtp_emails_sent_72h = {
  type: Number,
  default: 0,
  min: 0,
  index: true
};

object.smtp_emails_sent_total = {
  type: Number,
  default: 0,
  min: 0,
  index: true
};

object.smtp_last_email_sent_at = {
  type: Date,
  index: true
};

// Custom receipt email
object[config.userFields.receiptEmail] = {
  type: String,
  trim: true,
  lowercase: true,
  validate: (value) => !value || validator.isEmail(value)
};

// Stripe
object[config.userFields.stripeCustomerID] = {
  type: String,
  index: true
};
object[config.userFields.stripeSubscriptionID] = {
  type: String,
  index: true
};

// Paypal
object[config.userFields.paypalPayerID] = {
  type: String,
  index: true
};
object[config.userFields.paypalSubscriptionID] = {
  type: String,
  index: true
};

// Two factor auth reminders
object[config.userFields.twoFactorReminderSentAt] = {
  type: Date,
  index: true
};

// Feature reminder (e.g. SMTP/IMAP not being used)
object[config.userFields.featureReminderSentAt] = {
  type: Date,
  index: true
};

// Past due relief (users get 1 yr free after 6 months past due)
object[config.userFields.pastDueReliefSentAt] = {
  type: Date,
  index: true
};

// Daily log alert email sent timestamp
object[config.userFields.dailyLogAlertSentAt] = {
  type: Date,
  index: true
};

// Api past due reminders
object[config.userFields.apiPastDueSentAt] = Date;
object[config.userFields.apiRestrictedSentAt] = Date;

// Payment reminders
object[config.userFields.paymentReminderInitialSentAt] = Date;
object[config.userFields.paymentReminderFollowUpSentAt] = Date;
object[config.userFields.paymentReminderFinalNoticeSentAt] = Date;
object[config.userFields.paymentReminderTerminationNoticeSentAt] = Date;

// VISA trial subscription requirement notifications
object[config.userFields.stripeTrialSentAt] = {
  type: Date,
  index: true
};
object[config.userFields.paypalTrialSentAt] = {
  type: Date,
  index: true
};

// When the user upgraded to a paid plan
object[config.userFields.planSetAt] = {
  type: Date,
  required: true,
  default() {
    return new Date(this._id.getTimestamp() || Date.now());
  }
};

// When the user's plan expires
object[config.userFields.planExpiresAt] = {
  type: Date,
  index: true
};

// User fields
object[config.userFields.isRemoved] = {
  type: Boolean,
  default: false
};

object[config.userFields.isBanned] = {
  type: Boolean,
  default: false,
  index: true
};

object[config.userFields.fullEmail] = {
  type: String,
  required: true,
  trim: true
};

object[config.userFields.defaultDomain] = {
  type: mongoose.Schema.ObjectId,
  ref: 'Domains'
};

object[config.userFields.domainCount] = {
  type: Number,
  min: 0,
  index: true
};

object[config.userFields.aliasCount] = {
  type: Number,
  min: 0,
  index: true
};

// Rate limit whitelisting
// TODO: change to allowlist
object[config.userFields.isRateLimitWhitelisted] = {
  type: Boolean,
  default: false
};

object[config.userFields.hasDenylistRequests] = {
  type: Boolean,
  default: false
};

object[config.userFields.approvedDomains] = [
  {
    type: String,
    trim: true,
    lowercase: true,
    validate: (value) => isFQDN(value)
  }
];

// Api token for basic auth
object[config.userFields.apiToken] = {
  type: String,
  required: true,
  lowercase: true,
  trim: true,
  unique: true,
  index: true
};

object[config.userFields.otpRecoveryKeys] = Array;

// Password reset
object[config.userFields.resetTokenExpiresAt] = Date;
object[config.userFields.resetToken] = {
  type: String,
  index: true
};

// Email change
object[config.userFields.changeEmailTokenExpiresAt] = {
  type: Date,
  index: true
};
object[config.userFields.changeEmailToken] = {
  type: String,
  index: true
};
object[config.userFields.changeEmailNewAddress] = {
  type: String,
  trim: true,
  lowercase: true,
  validate: (value) => !value || validator.isEmail(value)
};

// Welcome email
object[config.userFields.welcomeEmailSentAt] = {
  type: Date,
  index: true
};

// Launch email (before 11/23/2020 10:00 AM)
object[config.userFields.launchEmailSentAt] = Date;

// Account verification
object[config.userFields.hasSetPassword] = {
  type: Boolean,
  default: false // Manually set to true during web/API signup
};
object[config.userFields.hasVerifiedEmail] = {
  type: Boolean,
  default: true, // Manually set to false during web/API signup
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

// List of account updates that are batched every 1 min.
object[config.userFields.accountUpdates] = {
  type: Array,
  index: true
};

// Shared field names with @ladjs/passport for consistency
object[fields.displayName] = {
  type: String,
  required: true,
  trim: true,
  maxlength: 70,
  validate(value) {
    return isNameValue(value) || isEmail(value);
  }
};
object[fields.givenName] = {
  type: String,
  trim: true,
  maxlength: 35,
  validate: isNameValue
};
object[fields.familyName] = {
  type: String,
  trim: true,
  maxlength: 35,
  validate: isNameValue
};
object[fields.avatarURL] = {
  type: String,
  trim: true,
  validate: (value) => validator.isURL(value)
};
// Apple
object[fields.appleProfileID] = {
  type: String,
  index: true
};
object[fields.appleAccessToken] = String;
object[fields.appleRefreshToken] = String;
// Google
object[fields.googleProfileID] = {
  type: String,
  index: true
};
object[fields.googleAccessToken] = String;
object[fields.googleRefreshToken] = String;
// Github
object[fields.githubProfileID] = {
  type: String,
  index: true
};
object[fields.githubAccessToken] = String;
object[fields.githubRefreshToken] = String;
// ubuntu
object[fields.ubuntuProfileID] = {
  type: String,
  index: true
};
object[fields.ubuntuUsername] = {
  type: String,
  index: true
};
object.last_ubuntu_sync = Date;

object[fields.otpEnabled] = {
  type: Boolean,
  default: false
};
object[fields.otpToken] = String;

// Shared field names with @ladjs/i18n and email-templates
object[config.lastLocaleField] = {
  type: String,
  default: i18n.config.defaultLocale
};

//
// Preferred locale setting - allows users to explicitly set their language preference
// When set, this overrides automatic locale detection from browser headers
//
object.preferred_locale = {
  type: String,
  enum: ['', ...i18n.config.locales],
  default: ''
};

//
// company information
//
object[config.userFields.companyName] = {
  type: String,
  trim: true,
  maxlength: 255,
  validate(value) {
    // allow company names to be website dot com's
    return isNameValue(value) || isFQDN(value);
  }
};
for (const prop of [
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
    maxlength: 255,
    validate: isNameValue
  };
}

object[config.userFields.addressCountry] = {
  type: String,
  enum: ['None', ...countries],
  default: 'None'
};

// Finally add the fields
Users.add(object);

//
// If preferred_locale is set, override last_locale with it
// This ensures the user's explicit language preference is used for all
// locale-dependent operations including emails
//
Users.pre('validate', function (next) {
  if (isSANB(this.preferred_locale)) {
    this[config.lastLocaleField] = this.preferred_locale;
  }

  next();
});

// validate timezone
Users.pre('validate', function (next) {
  // if not set yet then default to UTC
  if (!isSANB(this.timezone)) {
    this.timezone = 'UTC';
    return next();
  }

  try {
    const normalized = timezoneHandler.normalizeTimezone(this.timezone);
    const works = timezoneHandler.testTimezone(normalized);
    this.timezone = works ? normalized : 'UTC';
  } catch (err) {
    logger.fatal(err);
    this.timezone = 'UTC';
  }

  next();
});

// Set plan at date to a default value
// of when user was created or >= their first payment
Users.pre('validate', async function (next) {
  // NOTE: this is a fallback in case our migration script hasn't run yet
  if (!_.isDate(this[config.userFields.planSetAt])) {
    const payment = await Payments.findOne(
      {
        user: this._id
      },
      null,
      { sort: { invoice_at: 1 } }
    );

    this[config.userFields.planSetAt] = payment
      ? new Date(payment.invoice_at)
      : new Date(this._id.getTimestamp() || Date.now());
  }

  next();
});

// Plan expires at should get updated everytime the user is saved
Users.pre('save', async function (next) {
  const user = this;

  // If self-hosted then always set to a date in the future
  if (config.isSelfHosted) {
    user[config.userFields.planExpiresAt] = dayjs().add(50, 'year').toDate();
    return next();
  }

  // If user has a paid plan then consider their email verified
  if (user.plan !== 'free') user[config.userFields.hasVerifiedEmail] = true;

  // If user is on the free plan then return early
  if (user.plan === 'free') {
    user[config.userFields.planExpiresAt] = new Date(
      user[config.userFields.planSetAt]
    );
    return next();
  }

  try {
    //
    // the way to calculate plan expiry is to
    // take the sum of all payment durations where the payment invoice
    // is >= the user's current plan set at date
    // and then add this sum to the user's plan set at
    //
    // NOTE: we don't care about the amount, e.g. we could have refunded
    //       a customer because we had an outage, but we don't want
    //       that to effect their plan's expiration since refunds are on us
    //
    // NOTE: if a user did get a refund from changing plans,
    //       then their plan set at will change, so that takes care of that
    //
    const payments = await Payments.find({
      user: user._id,
      invoice_at: {
        $gte: new Date(user[config.userFields.planSetAt])
      },
      // Payments must match the user's current plan
      plan: user.plan
    })
      .sort('invoice_at')
      .lean()
      .exec();

    //
    // set the new expiry
    //
    // NOTE: we can't do `_.sumBy` because people pay by the month, not by the # of days in a month (e.g. 30d)
    //
    user[config.userFields.planExpiresAt] = new Date(
      user[config.userFields.planSetAt]
    );
    for (const payment of payments) {
      //
      // payments cannot be counted for credit that were
      // disputed/refunded on stripe or paypal (excluding beta and plan conversions)
      // (except for ones which we've manually adjusted or grandfathered in)
      //
      if (
        !payment.is_refund_credit_allowed &&
        payment.amount_refunded > 0 &&
        !['free_beta_program', 'plan_conversion'].includes(payment.method)
      ) {
        continue;
      }

      user[config.userFields.planExpiresAt] = dayjs(
        user[config.userFields.planExpiresAt]
      )
        .add(...config.durationMapping[payment.duration.toString()])
        .toDate();
    }

    // If the new expiry is in the future then reset the API past due sent at reminder
    // and also reset all billing reminders that have been sent
    if (
      new Date(user[config.userFields.planExpiresAt]).getTime() >= Date.now()
    ) {
      user[config.userFields.apiPastDueSentAt] = undefined;
      user[config.userFields.apiRestrictedSentAt] = undefined;
      // Only reset the reminders if it is past the reminder period
      // NOTE: if you change this then also update `jobs/billing.js`
      if (
        new Date(user[config.userFields.planExpiresAt]).getTime() >=
        dayjs().add(1, 'month').toDate().getTime()
      ) {
        user[config.userFields.paymentReminderInitialSentAt] = undefined;
        user[config.userFields.paymentReminderFollowUpSentAt] = undefined;
        user[config.userFields.paymentReminderFinalNoticeSentAt] = undefined;
        user[config.userFields.paymentReminderTerminationNoticeSentAt] =
          undefined;
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Sanitize input (striptags)
Users.pre('validate', function (next) {
  for (const prop of [
    fields.givenName,
    fields.familyName,
    config.userFields.companyName,
    config.userFields.addressLine1,
    config.userFields.addressLine2,
    config.userFields.addressCity,
    config.userFields.addressState,
    config.userFields.addressZip,
    config.userFields.companyVAT
  ]) {
    if (isSANB(this[prop])) {
      this[prop] = striptags(this[prop]);
    }

    if (!isSANB(this[prop])) {
      this[prop] = undefined;
    }
  }

  next();
});

//
// if the user does not have a subscription then
// unset visa trial subscription requirement notifications
//
Users.pre('save', function (next) {
  if (!isSANB(this[config.userFields.stripeSubscriptionID])) {
    this[config.userFields.stripeTrialSentAt] = undefined;
  }

  if (!isSANB(this[config.userFields.paypalSubscriptionID])) {
    this[config.userFields.paypalTrialSentAt] = undefined;
  }

  next();
});

//
// allow user to have up to X passkeys at once
//
Users.pre('save', function (next) {
  if (
    Array.isArray(this.passkeys) &&
    this.passkeys.length > config.passkeyLimit
  ) {
    const error = Boom.badRequest(
      i18n.api.t(
        {
          phrase: config.i18n.phrases.PASSKEYS_MAX_LIMIT_EXCEEDED,
          locale: this[config.lastLocaleField]
        },
        config.passkeyLimit
      )
    );
    error.no_translate = true;
    return next(error);
  }

  next();
});

Users.virtual(config.userFields.addressHTML).get(function () {
  const companyName = this[config.userFields.companyName];
  const name = [
    this[config.passport.fields.givenName],
    this[config.passport.fields.familyName]
  ]
    .filter(Boolean)
    .join(' ');
  const array = [
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
  return sanitizeHtml(array.filter(Boolean).join('<br />'), {
    allowedTags: ['strong', 'br'],
    allowedAttributes: []
  });
});

Users.virtual(config.userFields.verificationPinHasExpired).get(function () {
  return boolean(
    !this[config.userFields.verificationPinExpiresAt] ||
      new Date(this[config.userFields.verificationPinExpiresAt]).getTime() <
        Date.now()
  );
});

//
// TODO: this should be moved to redis or its own package under forwardemail or @ladjs
//
// const disposableDomains = new Set();
// async function crawlDisposable() {
//   try {
//     const response = await retryRequest(
//       'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.json',
//       { resolver }
//     );
//
//     const json = await response.body.json();
//     if (!Array.isArray(json) || json.length === 0) {
//       throw new Error('Disposable did not crawl data.');
//     }
//
//     for (const d of json) {
//       disposableDomains.add(d);
//     }
//   } catch (err) {
//     logger.error(err);
//   }
// }

// setInterval(crawlDisposable, ms('1d'));
// crawlDisposable();

// This ensures that `email` was already validated, trimmed, lowercased
Users.pre('save', async function (next) {
  // Only do this for new users signing up
  // (we will most likely deprecate disposable; see jobs/check-disposable)
  if (!this.isNew) {
    return next();
  }

  /*
  const domain = this.email.split('@')[1];
  if (disposableDomains.size === 0) {
    await crawlDisposable();
  }

  if (disposableDomains.has(domain)) {
    const error = Boom.badRequest(
      i18n.api.t({
        phrase: config.i18n.phrases.DISPOSABLE_EMAIL_NOT_ALLOWED,
        locale: this[config.lastLocaleField]
      })
    );
    error.no_translate = true;
    return next(error);
  }
  */

  // Check if email is denylisted
  try {
    await isDenylisted(this.email, client, resolver);
  } catch (err) {
    // If isDenylisted throws an error, the email is denylisted
    if (err.name === 'DenylistError') {
      // Ban the user immediately
      this[config.userFields.isBanned] = true;

      // Send admin notification email about the banned user
      email({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `User Banned: Denylisted Email Detected - ${this.email}`
        },
        locals: {
          message: `
<h3>User Banned Due to Denylisted Email</h3>
<table border="1" cellpadding="5" cellspacing="0">
  <tr><th>Field</th><th>Value</th></tr>
  <tr><td>User Email</td><td>${this.email}</td></tr>
  <tr><td>User ID</td><td>${this._id || 'Not yet assigned'}</td></tr>
  <tr><td>Denylist Value</td><td>${
    err.message || 'Email address is denylisted'
  }</td></tr>
  <tr><td>Timestamp</td><td>${new Date().toISOString()}</td></tr>
  <tr><td>Action Taken</td><td>User banned immediately, signup prevented</td></tr>
</table>
<p><strong>Reason:</strong> The email address was found in the denylist during signup attempt.</p>
          `.trim()
        }
      })
        .then(() => {
          logger.info(`Admin notification sent for banned user: ${this.email}`);
        })
        .catch((emailErr) => {
          logger.error(
            'Error sending admin notification for banned user:',
            emailErr
          );
        });

      // Create a user-friendly error message
      const error = Boom.forbidden(
        i18n.api.t({
          phrase: config.i18n.phrases.ACCOUNT_BANNED,
          locale: this[config.lastLocaleField]
        })
      );
      error.no_translate = true;
      return next(error);
    }

    // If it's some other error, log it and continue
    logger.error('Error checking denylist for new user:', err);
  }

  // TODO: prevent user from signing up with one of our global vanity names
  next();
});

Users.pre('validate', async function (next) {
  try {
    // Create api token if doesn't exist
    if (!isSANB(this[config.userFields.apiToken])) {
      this[config.userFields.apiToken] = await cryptoRandomString.async({
        length: 24
      });
    }

    // Set the user's display name to their email address
    // but if they have a name or surname set then use that
    this[fields.displayName] = this.email;
    if (isSANB(this[fields.givenName]) || isSANB(this[fields.familyName])) {
      this[fields.displayName] = `${this[fields.givenName] || ''} ${
        this[fields.familyName] || ''
      }`;
    }

    // Set the user's full email address (incl display name)
    this[config.userFields.fullEmail] =
      this[fields.displayName] && this[fields.displayName] !== this.email
        ? `${this[fields.displayName]} <${this.email}>`
        : this.email;

    // If otp authentication values no longer valid
    // then disable it completely
    if (
      !Array.isArray(this[config.userFields.otpRecoveryKeys]) ||
      !this[config.userFields.otpRecoveryKeys] ||
      this[config.userFields.otpRecoveryKeys].length === 0 ||
      !this[config.passport.fields.otpToken]
    ) {
      this[fields.otpEnabled] = false;
    }

    if (
      !Array.isArray(this[config.userFields.otpRecoveryKeys]) ||
      this[config.userFields.otpRecoveryKeys].length === 0
    ) {
      this[config.userFields.otpRecoveryKeys] = await Promise.all(
        Array.from({ length: 10 })
          .fill()
          .map(() => cryptoRandomString.async(options))
      );
    }

    if (!this[config.passport.fields.otpToken]) {
      this[config.passport.fields.otpToken] = authenticator.generateSecret();
    }

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
Users.methods.updateVerificationPin = async function (ctx, revert = false) {
  if (revert) {
    this[config.userFields.verificationPinExpiresAt] =
      this[`__${config.userFields.verificationPinExpiresAt}`];
    this[config.userFields.verificationPin] =
      this[`__${config.userFields.verificationPin}`];
    await this.save();
    return this;
  }

  // Store old values in case we have to revert
  this[`__${config.userFields.verificationPinExpiresAt}`] =
    this[config.userFields.verificationPinExpiresAt];
  this[`__${config.userFields.verificationPin}`] =
    this[config.userFields.verificationPin];

  // Set new values if necessary
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

  // Ensure the user waited as long as necessary to send a new pin email
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
      const error = Boom.badRequest(message);
      error.no_translate = true;
      throw error;
    }

    const error = new Error(message);
    error.no_translate = true;
    throw error;
  }

  // Save the updated pin
  await this.save();

  return this;
};

//
// NOTE: this can come before passport-local-mongoose because
//       the username field of "email" is already marked as unique
//
Users.plugin(mongooseCommonPlugin, {
  object: 'user',
  omitCommonFields: false,
  omitExtraFields,
  defaultLocale: i18n.config.defaultLocale,
  mongooseHidden: {
    virtuals: {
      [config.userFields.verificationPinHasExpired]: 'hide'
    }
  }
});

Users.plugin(passportLocalMongoose, config.passportLocalMongoose);

Users.post('init', (doc) => {
  for (const field of config.accountUpdateFields) {
    const fieldName = _.get(config, field);
    doc[`__${fieldName}`] = doc[fieldName];
  }
});

Users.pre('save', function (next) {
  // Filter by allowed field updates (otp enabled, profile updates, etc)
  for (const field of config.accountUpdateFields) {
    const fieldName = _.get(config, field);
    if (this[`__${fieldName}`] && this[`__${fieldName}`] !== this[fieldName]) {
      this[config.userFields.accountUpdates].push({
        fieldName,
        current: this[fieldName],
        previous: this[`__${fieldName}`]
      });
      // Revert so we don't get into infinite loop
      this[`__${fieldName}`] = this[fieldName];
    }
  }

  next();
});

//
// when ubuntu users sign in we need to check their membership
// (and probably need some automated job that checks this for active memberships)
//

Users.pre('save', async function (next) {
  if (
    !isSANB(this[fields.ubuntuProfileID]) ||
    !isSANB(this[fields.ubuntuUsername])
  )
    return next();

  try {
    if (!(map instanceof Map)) map = await getUbuntuMembersMap(resolver);
    await syncUbuntuUser(this, map);
    this.last_ubuntu_sync = new Date();
  } catch (err) {
    this.last_ubuntu_sync = new Date();
    logger.fatal(err);
  }

  next();
});

Users.pre('save', function (next) {
  this._isNew = this.isNew;
  next();
});

Users.post('save', async (user, next) => {
  if (!user._isNew) return next();

  // logger.info('user created', {
  //   user: user.toObject()
  // });

  // return early if possible
  if (!user[fields.ubuntuUsername] || !user[fields.ubuntuProfileID])
    return next();

  try {
    // if user was ubuntu then notify admins of any ubuntu domain
    const domains = await conn.models.Domains.find({
      name: { $in: Object.keys(config.ubuntuTeamMapping) },
      plan: 'team',
      has_txt_record: true
    })
      .lean()
      .exec();

    // return early if possible
    if (domains.length === 0) return next();

    // check as long as user has at least one alias
    const count = await conn.models.Aliases.countDocuments({
      user: user._id,
      domain: { $in: domains.map((d) => d._id) }
    });

    // return early if possible
    if (count === 0) return next();

    const ids = [];
    for (const domain of domains) {
      for (const m of domain.members) {
        if (m.group === 'admin') ids.push(m.user.toString());
      }
    }

    // return early if possible
    if (ids.length === 0) return next();

    // get all the admin emails
    const to = await user.constructor.distinct('email', {
      id: {
        $in: ids
      },
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.isBanned]: false
    });

    if (to.length === 0) return next();

    await email({
      template: 'alert',
      message: {
        to,
        bcc: config.alertsEmail,
        subject: `🎉 ~${
          user[fields.ubuntuUsername]
        } signed into Forward Email with Launchpad!`
      },
      locals: {
        message: `~${user[fields.ubuntuUsername]} signed in with email ${
          user.email
        } and is a member of ${count} team${count.length === 1 ? '' : 's'}.`
      }
    });
  } catch (err) {
    logger.fatal(err);
  }

  next();
});

//
// since PayPal refuses to respond and help us block paypal cashapp email/phishing scammers
// and postmark refuses to do any sort of KYC process to prevent these spammers
//
Users.post('save', async (user, next) => {
  try {
    if (!isSANB(user[config.userFields.paypalPayerID])) return next();
    if (user[config.userFields.isBanned]) return next();
    if (
      !config.paypalPayerIdsBlocked.has(user[config.userFields.paypalPayerID])
    )
      return next();
    await user.constructor.findByIdAndUpdate(user._id, {
      $set: {
        [config.userFields.isBanned]: true
      }
    });
    const message = `${user.email} with PayPal Payer ID ${
      user[config.userFields.paypalPayerID]
    } banned`;
    await email({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: message
      },
      locals: { message }
    });
  } catch (err) {
    logger.fatal(err);
  }

  next();
});

Users.index(
  { [config.userFields.paymentReminderFollowUpSentAt]: 1 },
  {
    partialFilterExpression: {
      [config.userFields.paymentReminderFollowUpSentAt]: { $exists: true }
    }
  }
);

// Text search index for email field to enable efficient email searching
Users.index({ email: 'text' });

async function getBannedUserIdSet(client) {
  let bannedUserIds = [];
  bannedUserIds = await client.get('banned_user_ids');
  if (
    bannedUserIds &&
    typeof bannedUserIds === 'string' &&
    bannedUserIds.length > 0
  ) {
    bannedUserIds = new Set(JSON.parse(bannedUserIds));
  } else {
    bannedUserIds = await this.distinct('id', {
      [config.userFields.isBanned]: true
    });
    client
      .set('banned_user_ids', safeStringify(bannedUserIds), 'PX', ms('1h'))
      .then()
      .catch((err) => {
        logger.fatal(err);
      });
    bannedUserIds = new Set(bannedUserIds);
  }

  return bannedUserIds;
}

Users.statics.getBannedUserIdSet = getBannedUserIdSet;

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) {
  throw new Error('Mongoose connection does not exist');
}

module.exports = conn.model('Users', Users);
