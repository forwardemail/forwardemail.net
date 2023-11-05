/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');
const { promisify } = require('node:util');

const Boom = require('@hapi/boom');
const RE2 = require('re2');
const _ = require('lodash');
const captainHook = require('captain-hook');
const cryptoRandomString = require('crypto-random-string');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const noReplyList = require('reserved-email-addresses-list/no-reply-list.json');
const reservedAdminList = require('reserved-email-addresses-list/admin-list.json');
const reservedEmailAddressesList = require('reserved-email-addresses-list');
const scmp = require('scmp');
const slug = require('speakingurl');
const striptags = require('striptags');
const { boolean } = require('boolean');
const { isIP, isEmail, isURL } = require('validator');
const { randomstring } = require('@sidoshi/random-string');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const Domains = require('./domains');
const Users = require('./users');

const config = require('#config');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');

const NO_REPLY_USERNAMES = new Set(noReplyList);

const randomBytes = promisify(crypto.randomBytes);

function pbkdf2(options) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      options.password,
      options.salt,
      options.iterations,
      options.keylen,
      options.digestAlgorithm,
      (err, buffer) => {
        if (err) return reject(err);
        resolve(buffer);
      }
    );
  });
}

// <https://1loc.dev/string/check-if-a-string-consists-of-a-repeated-character-sequence/>
const consistsRepeatedSubstring = (str) =>
  `${str}${str}`.indexOf(str, 1) !== str.length;

// <https://github.com/validatorjs/validator.js/blob/master/src/lib/isEmail.js>
const quotedEmailUserUtf8 = new RE2(
  // eslint-disable-next-line no-control-regex
  /^([\s\u0001-\u0008\u000E-\u001F!\u0023-\u005B\u005D-\u007F\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\u0001-\u0009\u000B-\u007F\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i
);

const Token = new mongoose.Schema({
  description: {
    type: String,
    select: false
  },
  salt: {
    type: String,
    select: false
  },
  hash: {
    type: String,
    select: false
  }
});

Token.plugin(mongooseCommonPlugin, {
  object: 'token',
  omitCommonFields: false,
  omitExtraFields: ['_id', '__v', 'description', 'salt', 'hash'],
  uniqueId: false,
  locale: false
});

const Aliases = new mongoose.Schema({
  storageUsed: {
    type: Number,
    default: 0
  },
  storageLocation: {
    type: String,
    default: 'storage_do_1',
    enum: ['storage_do_1'],
    trim: true,
    lowercase: true
  },
  retention: {
    type: Number,
    default: 0,
    min: 0
  },
  is_api: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: true,
    index: true
  },
  domain: {
    type: mongoose.Schema.ObjectId,
    ref: 'Domains',
    required: true,
    index: true
  },
  // asterisk "*" means wildcard
  // however note that "*" is a valid email character
  // but we have specific app logic that restricts this for us
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    maxlength: 150,
    trim: true
  },
  labels: [
    {
      type: String,
      trim: true,
      maxlength: 150
    }
  ],
  is_enabled: {
    type: Boolean,
    default: true
  },
  has_recipient_verification: {
    type: Boolean,
    default: false
  },
  // recipients that are verified (ones that have clicked email link)
  // the API endpoint for lookups uses this as well as the UI on FE front-end side
  verified_recipients: [
    {
      type: String,
      trim: true,
      lowercase: true,
      validate: (value) => isEmail(value)
    }
  ],
  // this is an array of emails that have been sent a verification email
  pending_recipients: [
    {
      type: String,
      trim: true,
      lowercase: true,
      validate: (value) => isEmail(value)
    }
  ],
  recipients: [
    {
      type: String,
      trim: true,
      // must be IP or FQDN or email
      validate: {
        validator: (value) =>
          isIP(value) ||
          isFQDN(value) ||
          isEmail(value) ||
          isURL(value, config.isURLOptions),
        message:
          'Recipient must be a valid email address, fully-qualified domain name ("FQDN"), IP address, or webhook URL'
      }
    }
  ],
  tokens: [Token]
});

Aliases.plugin(captainHook);

// eslint-disable-next-line complexity
Aliases.pre('validate', function (next) {
  // if storage used was below zero then set to zero
  if (this.storageUsed < 0) this.storageUsed = 0;

  // if name was not a string then generate a random one
  if (!isSANB(this.name)) {
    this.name = randomstring({
      characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
      length: 10
    });
  }

  // require alias name
  if (
    !quotedEmailUserUtf8.test(this.name.trim().toLowerCase()) ||
    (!this.name.trim().startsWith('/') && this.name.includes('+'))
  )
    return next(new Error('Alias name was invalid.'));

  // trim and convert to lowercase
  this.name = this.name.trim().toLowerCase();

  // if it consists of wildcards only then convert to wildcard "*" single asterisk
  if (
    !this.name.startsWith('/') &&
    this.name.includes('*') &&
    consistsRepeatedSubstring(this.name)
  )
    this.name = '*';

  // add wildcard as first label
  if (this.name === '*') this.labels.unshift('catch-all');
  this.labels = _.compact(
    _.uniq(this.labels.map((label) => slug(striptags(label))))
  );
  if (this.name !== '*') this.labels = _.without(this.labels, 'catch-all');

  // alias must not start with ! exclamation (since that denotes it is ignored)
  if (this.name.indexOf('!') === 0)
    return next(new Error('Alias must not start with an exclamation point.'));

  // make all recipients kinds unique by email address, FQDN, or IP
  for (const prop of [
    'recipients',
    'verified_recipients',
    'pending_recipients'
  ]) {
    if (!_.isArray(this[prop])) this[prop] = [];
    this[prop] = _.compact(
      _.uniq(
        this[prop].map((r) => {
          // some webhooks are case-sensitive
          if (isEmail(r)) return r.toLowerCase().trim();
          return r.trim();
        })
      )
    );
  }

  // all recipients must be emails if it requires verification
  if (
    this.has_recipient_verification &&
    this.recipients.some((r) => !isEmail(r))
  )
    return next(
      new Error(
        'Alias with recipient verification must have email-only recipients.'
      )
    );

  // labels must be slugified and unique
  if (!_.isArray(this.labels)) this.labels = [];
  // description must be plain text
  if (isSANB(this.description)) this.description = striptags(this.description);
  if (!isSANB(this.description)) this.description = undefined;

  // alias must have at least one recipient
  if (!_.isArray(this.recipients) || _.isEmpty(this.recipients))
    return next(new Error('Alias must have at least one recipient.'));

  next();
});

// prevent wildcards from being disabled
// (they either need deleted or enabled, too confusing otherwise)
Aliases.pre('validate', function (next) {
  if (this.name === '*' && !this.is_enabled)
    return next(
      new Error(
        'Alias that is a catch-all must be enabled or deleted entirely to be disabled.'
      )
    );
  next();
});

// this must be kept before other `pre('save')` hooks as
// it populates "id" String automatically for comparisons
Aliases.plugin(mongooseCommonPlugin, {
  object: 'alias',
  omitExtraFields: ['is_api', 'tokens'],
  defaultLocale: i18n.getLocale()
});

Aliases.virtual('is_update')
  .get(function () {
    return this.__is_update;
  })
  .set(function (isUpdate) {
    this.__is_update = boolean(isUpdate);
  });

// eslint-disable-next-line complexity
Aliases.pre('save', async function (next) {
  const alias = this;
  try {
    // domain and user must exist
    // user must be a member of the domain
    // name@domain.name must be unique for given domain
    const [domain, user] = await Promise.all([
      Domains.findOne({
        $or: [
          {
            _id: alias.domain,
            'members.user': alias.user
          },
          {
            _id: alias.domain,
            is_global: true
          }
        ]
      })
        .populate('members.user', `id ${config.userFields.isBanned}`)
        .lean()
        .exec(),
      Users.findOne({
        _id: alias.user,
        [config.userFields.isBanned]: false
      })
        .lean()
        .select('id plan group')
        .exec()
    ]);

    if (!domain)
      throw Boom.notFound(
        i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', alias.locale)
      );

    if (!user)
      throw Boom.notFound(i18n.translateError('INVALID_USER', alias.locale));

    // filter out a domain's members without actual users
    domain.members = domain.members.filter(
      (member) =>
        _.isObject(member.user) && !member.user[config.userFields.isBanned]
    );

    // find an existing alias match
    const match = await alias.constructor
      .findOne({
        _id: {
          $ne: alias._id
        },
        domain: domain._id,
        name: alias.name
      })
      .lean()
      .exec();

    if (match)
      throw Boom.badRequest(
        i18n.translateError('ALIAS_ALREADY_EXISTS', alias.locale)
      );

    //
    // if the domain is global or is too large then we prohibit regex and catchall
    //
    if (domain.is_global && alias.name === '*')
      throw Boom.badRequest(
        i18n.translateError('CANNOT_CREATE_CATCHALL_ON_GLOBAL', alias.locale)
      );

    if (domain.is_global && alias.name.startsWith('/'))
      throw Boom.badRequest(
        i18n.translateError('CANNOT_CREATE_REGEX_ON_GLOBAL', alias.locale)
      );

    if (domain.is_catchall_regex_disabled && alias.name === '*')
      throw Boom.badRequest(
        i18n.translateError('CANNOT_CREATE_CATCHALL_ON_DOMAIN', alias.locale)
      );

    if (domain.is_catchall_regex_disabled && alias.name.startsWith('/'))
      throw Boom.badRequest(
        i18n.translateError('CANNOT_CREATE_REGEX_ON_DOMAIN', alias.locale)
      );

    // if it starts with a forward slash then it must be a regex
    if (!alias.name.startsWith('/') && !isEmail(`${alias.name}@${domain.name}`))
      throw Boom.badRequest(i18n.translateError('INVALID_EMAIL', alias.locale));

    // determine the domain membership for the user
    let member = domain.members.find((member) => member.user.id === user.id);

    if (!member && domain.is_global)
      member = {
        user: {
          _id: user._id,
          id: user.id
        },
        group: 'user'
      };

    if (!member)
      throw Boom.notFound(i18n.translateError('INVALID_MEMBER', alias.locale));

    const string = alias.name.replace(/[^\da-z]/g, '');

    if (member.group === 'admin') {
      // always disable no-reply usernames
      if (NO_REPLY_USERNAMES.has(string)) alias.is_enabled = false;
    } else {
      // prevent users from registering no-reply usernames
      if (NO_REPLY_USERNAMES.has(string)) {
        const err = Boom.badRequest(
          i18n.translateError('NO_REPLY_USERNAME_DISALLOWED', alias.locale)
        );
        err.is_reserved_word = true;
        throw err;
      }

      // alias name cannot be a wildcard "*" if the user is not an admin
      if (alias.name === '*')
        throw Boom.badRequest(
          i18n.translateError('CATCHALL_ADMIN_REQUIRED', alias.locale)
        );

      // alias cannot be a regex if the user is not an admin
      if (alias.name.startsWith('/'))
        throw Boom.badRequest(
          i18n.translateError('CATCHALL_ADMIN_REQUIRED', alias.locale)
        );

      //
      // prevent regular users (non-admins) from registering reserved words
      // note that we don't take the approach here in the README I wrote
      // because we want to enforce more strict controls on people abusing this
      // (e.g. they could use `"admin@"@example.com` without the `.replace`)
      // <https://github.com/forwardemail/reserved-email-addresses-list>
      //

      let reservedMatch = reservedEmailAddressesList.find(
        (addr) => addr === string
      );

      if (!reservedMatch)
        reservedMatch = reservedAdminList.find(
          (addr) =>
            addr === string || string.startsWith(addr) || string.endsWith(addr)
        );

      if (reservedMatch) {
        const err = Boom.badRequest(
          i18n.translateError(
            'RESERVED_WORD_ADMIN_REQUIRED',
            alias.locale,
            config.urls.web
          )
        );
        err.is_reserved_word = true;
        throw err;
      }

      // if user is not admin of the domain and it is a global domain
      // then the user can only have up to 5 aliases at a time on the domain
      if (domain.is_global) {
        // user must be on a paid plan to use a global domain
        if (user.plan === 'free' && !alias.is_update) {
          const domainIds = await Domains.distinct('_id', {
            is_global: true
          });
          const aliasCount = await alias.constructor.countDocuments({
            user: user._id,
            domain: { $in: domainIds }
          });
          throw Boom.paymentRequired(
            i18n.translateError(
              aliasCount > 0
                ? 'PLAN_UPGRADE_REQUIRED_FOR_GLOBAL_DOMAINS_AND_DELETE_REQUIRED'
                : 'PLAN_UPGRADE_REQUIRED_FOR_GLOBAL_DOMAINS',
              alias.locale,
              `/${alias.locale}/my-account/billing/upgrade?plan=enhanced_protection`
            )
          );
        }

        if (user.group !== 'admin') {
          // user cannot exceed the max alias count on a global domain
          const aliasCount = await alias.constructor.countDocuments({
            user: user._id,
            domain: domain._id,
            name: {
              $ne: alias.name
            }
          });

          if (aliasCount > config.maxAliasPerGlobalDomain) {
            const err = Boom.badRequest(
              i18n.translateError(
                'REACHED_MAX_ALIAS_COUNT',
                alias.locale,
                config.maxAliasPerGlobalDomain
              )
            );
            err.is_max_alias_count = true;
            throw err;
          }
        }
      }
    }

    // if alias has more than X recipients allowed on the domain
    // if the value was unset or set to zero then use default
    // (this is a nice clean way to ensure 1:1 sync with `forward-email`
    const count =
      !domain.max_recipients_per_alias || domain.max_recipients_per_alias === 0
        ? config.maxForwardedAddresses
        : domain.max_recipients_per_alias;

    if (alias.recipients.length > count) {
      const err = Boom.badRequest(
        i18n.translateError('EXCEEDED_UNIQUE_COUNT', alias.locale, count)
      );
      err.exceeded_by_count = alias.recipients.length - count;
      err.has_exceeded_unique_count = true;
      throw err;
    }

    // domain must be on a paid plan in order to require verification
    if (domain.plan === 'free' && alias.has_recipient_verification)
      throw Boom.badRequest(
        i18n.translateError(
          'PAID_PLAN_REQUIRED_FOR_RECIPIENT_VERIFICATION',
          alias.locale
        )
      );

    // domain must not be a global plan in order to require verification
    if (domain.is_global && alias.has_recipient_verification)
      throw Boom.badRequest(
        i18n.translateError(
          'PAID_PLAN_REQUIRED_FOR_RECIPIENT_VERIFICATION',
          alias.locale
        )
      );

    next();
  } catch (err) {
    next(err);
  }
});

// async function getStorageUsed(alias) {
async function getStorageUsed(wsp, session) {
  //
  // calculate storage used across entire domain and its admin users domains
  // (this is rudimentary storage system and has edge cases)
  // (e.g. multi-accounts when users on team plan edge case)
  //
  const domain = await Domains.findOne({ id: session.user.domain_id })
    .populate('members.user', `id ${config.userFields.isBanned}`)
    .lean()
    .exec();
  if (!domain)
    throw Boom.notFound(
      i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', 'en')
    );

  // filter out a domain's members without actual users
  const adminMembers = domain.members.filter(
    (member) =>
      _.isObject(member.user) &&
      !member.user[config.userFields.isBanned] &&
      member.group === 'admin'
  );

  if (adminMembers.length === 0)
    throw Boom.notFound(
      i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', 'en')
    );

  const ids = domain.members.map((m) => m.user);

  // safeguard
  if (ids.length === 0)
    throw Boom.notFound(
      i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', 'en')
    );

  // now get all domains where $elemMatch is the user id and group is admin
  const domainIds = await Domains.distinct('_id', {
    members: {
      $elemMatch: {
        user: { $in: ids },
        group: 'admin'
      }
    }
  });

  // safeguard
  if (domainIds.length === 0)
    throw Boom.notFound(
      i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', 'en')
    );

  const aliases = await this.find({
    domain: { $in: domainIds }
  })
    .select({
      _id: -1,
      id: 1,
      storageLocation: 1
    })
    .lean()
    .exec();

  // now get all aliases that belong to any of these domains and sum the storageQuota
  const size = await wsp.request({
    action: 'size',
    session: { user: session.user },
    aliases
  });

  return size;
}

Aliases.statics.getStorageUsed = getStorageUsed;

// Aliases.statics.isOverQuota = async function (alias, size = 0) {
Aliases.statics.isOverQuota = async function (
  wsp,
  session,
  size = 0,
  returnStorageUsed = false
) {
  // const storageUsed = await getStorageUsed.call(this, alias);
  const storageUsed = await getStorageUsed.call(this, wsp, session);

  const isOverQuota = storageUsed + size > config.maxQuotaPerAlias;

  // log fatal error to admins (so they will get notified by email/text)
  if (isOverQuota) {
    const err = new Error(
      `Alias ${session.user.username} (ID ${
        session.user.alias_id
      }) is over quota (${storageUsed + size}/${config.maxQuotaPerAlias})`
    );
    err.isCodeBug = true; // causes admin alerts
    logger.fatal(err, { session });
  }

  if (returnStorageUsed) {
    return { storageUsed, isOverQuota };
  }

  return isOverQuota;
};

Aliases.statics.isValidPassword = async function (tokens = [], password) {
  if (
    typeof tokens !== 'object' ||
    !Array.isArray(tokens) ||
    tokens.length === 0 ||
    !password ||
    typeof password !== 'string'
  )
    return false;

  let match = false;
  for (const token of tokens) {
    if (
      typeof token !== 'object' ||
      !token.salt ||
      !token.hash ||
      typeof token.salt !== 'string' ||
      typeof token.hash !== 'string'
    )
      continue;

    // eslint-disable-next-line no-await-in-loop
    const rawHash = await pbkdf2({
      password,
      salt: token.salt,
      iterations: config.passportLocalMongoose.iterations,
      keylen: config.passportLocalMongoose.keylen,
      digestAlgorithm: config.passportLocalMongoose.digestAlgorithm
    });

    if (
      scmp(
        rawHash,
        Buffer.from(token.hash, config.passportLocalMongoose.encoding)
      )
    ) {
      match = true;
      break;
    }
  }

  return match;
};

Aliases.methods.createToken = async function (description = '') {
  if (this.name === '*')
    throw Boom.badRequest(
      i18n.translateError('CANNOT_CREATE_TOKEN_FOR_CATCHALL', this.locale)
    );
  if (this.name.startsWith('/'))
    throw Boom.badRequest(
      i18n.translateError('CANNOT_CREATE_TOKEN_FOR_REGEX', this.locale)
    );
  const password = await cryptoRandomString.async({
    length: 24
  });
  const buffer = await randomBytes(config.passportLocalMongoose.saltlen);
  const salt = buffer.toString(config.passportLocalMongoose.encoding);
  const rawHash = await pbkdf2({
    password,
    salt,
    iterations: config.passportLocalMongoose.iterations,
    keylen: config.passportLocalMongoose.keylen,
    digestAlgorithm: config.passportLocalMongoose.digestAlgorithm
  });
  const hash = Buffer.from(rawHash, 'binary').toString(
    config.passportLocalMongoose.encoding
  );
  this.tokens.push({
    description,
    salt,
    hash
  });
  return password;
};

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('Aliases', Aliases);
