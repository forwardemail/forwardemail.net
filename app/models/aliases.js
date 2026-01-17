/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const RE2 = require('re2');
const bytes = require('@forwardemail/bytes');
const regexParser = require('regex-parser');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const ms = require('ms');
const reservedAdminList = require('reserved-email-addresses-list/admin-list.json');
const reservedEmailAddressesList = require('reserved-email-addresses-list');
const slug = require('speakingurl');
const striptags = require('striptags');
const { boolean } = require('boolean');
const { generateSlug } = require('random-word-slugs');
const { isIP, isURL } = require('@forwardemail/validator');
const _ = require('#helpers/lodash');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const isEmail = require('#helpers/is-email');
const config = require('#config');
const createPassword = require('#helpers/create-password');
const getKeyInfo = require('#helpers/get-key-info');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const { detectInvisibleUnicode } = require('#helpers/detect-invisible-unicode');

const REGEX_FLAG_ENDINGS = ['/gi', '/ig', '/g', '/i', '/'];

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
    select: false,
    maxlength: 150,
    trim: true
  },
  salt: {
    type: String,
    select: false,
    required: true
  },
  hash: {
    type: String,
    select: false,
    required: true
  },
  has_pbkdf2_migration: {
    type: Boolean,
    default: false,
    select: false
  }
});

Token.plugin(mongooseCommonPlugin, {
  object: 'token',
  omitCommonFields: false,
  omitExtraFields: [
    '_id',
    '__v',
    'description',
    'salt',
    'hash',
    'has_pbkdf2_migration'
  ],
  uniqueId: false,
  locale: false
});

const APS = new mongoose.Schema({
  account_id: {
    type: String,
    index: true
  },
  device_token: {
    type: String,
    index: true
  },
  subtopic: {
    type: String,
    enum: ['com.apple.mobilemail']
  },
  mailboxes: [String]
});

APS.plugin(mongooseCommonPlugin, {
  object: 'aps',
  omitCommonFields: false,
  omitExtraFields: ['_id', '__v'],
  uniqueId: false,
  locale: false
});

const Aliases = new mongoose.Schema({
  // if a rekey operation is being performed then don't allow auth or read/write
  is_rekey: {
    type: Boolean,
    default: false
  },

  // alias specific max quota (set by admins only)
  max_quota: {
    type: Number,
    min: 0,
    //
    // NOTE: hard-coded max of 100 GB (safeguard)
    //
    max: bytes('100GB')
  },

  //
  // vacation responder support
  // (uses SMTP credits and requires SMTP to be setup/approved)
  //
  vacation_responder: {
    is_enabled: {
      type: Boolean,
      default: false
    },
    start_date: Date,
    end_date: Date,
    subject: {
      type: String,
      trim: true,
      maxlength: 100
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000
    }
    // TODO: for CardDAV in future (but would require some plaintext non-encrypted access or hash approach)
    // respond_to_contacts_only: true | false
  },

  // apple push notification support
  // <https://github.com/nodemailer/wildduck/issues/711>
  aps: [APS],

  // pgp encryption support
  has_pgp: {
    type: Boolean,
    default: false
  },
  public_key: {
    type: String,
    trim: true
  },
  pgp_error_sent_at: {
    type: Date,
    index: true
  },

  has_imap: {
    type: Boolean,
    default: false,
    index: true
  },
  emailed_instructions: {
    type: String,
    trim: true,
    lowercase: true,
    validate: (value) => (typeof value === 'string' ? isEmail(value) : true)
  },
  imap_not_enabled_sent_at: Date,
  imap_backup_at: Date,
  last_vacuum_at: Date,
  //
  // TODO: job under sqlite-bree that checks and updates storage
  //       and alerts admins if the size difference is larger than 1 GB
  //
  // TODO: on copy and on move need in-memory storage checks
  //
  // NOTE: this storage is updated in real-time after writes are performed
  //       and it contains the sum of fs.stat -> stat.size for each of the following:
  //
  //       - $id.sqlite (actual encrypted database for alias)
  //       - $id-wal.sqlite (WAL)
  //       - $id-shm.sqlite (SHM)
  //
  //       - $id-tmp.sqlite (temporary encrypted database for alias)
  //       - $id-tmp-wal.sqlite (WAL)
  //       - $id-tmp-shm.sqlite (SHM)
  //
  //       - $id.sqlite (R2 backup) <--- excluded for now
  //
  storage_used: {
    type: Number,
    default: 0,
    index: true
  },
  // tracks whether the alias has been migrated to base64 attachment storage
  // (one-time migration from hex encoding to base64 for 33% storage savings)
  has_storage_format_migration: {
    type: Boolean,
    default: false
  },
  // this is an object that looks like:
  // {
  //   '50': new Date(),
  //   '60': new Date()
  // }
  // and it is when the threshold email for that percentage was sent
  // (e.g. 50% of storage used, please upgrade your storage now)
  storage_thresholds_sent_at: mongoose.Schema.Types.Mixed,
  storage_location: {
    type: String,
    default: config.defaultStoragePath,
    enum: [config.defaultStoragePath],
    trim: true,
    lowercase: true,
    index: true
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
    index: true,
    validate: {
      validator(value) {
        if (detectInvisibleUnicode(value)) {
          throw Boom.badRequest(
            i18n.translateError('ALIAS_NAME_INVISIBLE_UNICODE', this.locale)
          );
        }

        return true;
      }
    }
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
  error_code_if_disabled: {
    type: Number,
    default: 250,
    enum: [250, 421, 550]
  },
  has_recipient_verification: {
    type: Boolean,
    default: false,
    index: true
  },
  // recipients that are verified (ones that have clicked email link)
  // the API endpoint for lookups uses this as well as the UI on FE front-end side
  verified_recipients: [
    {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator(value) {
          if (detectInvisibleUnicode(value)) {
            throw Boom.badRequest(
              i18n.translateError(
                'VERIFIED_RECIPIENT_INVISIBLE_UNICODE',
                this.locale
              )
            );
          }

          return isEmail(value);
        }
      }
    }
  ],
  // this is an array of emails that have been sent a verification email
  pending_recipients: [
    {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator(value) {
          if (detectInvisibleUnicode(value)) {
            throw Boom.badRequest(
              i18n.translateError(
                'PENDING_RECIPIENT_INVISIBLE_UNICODE',
                this.locale
              )
            );
          }

          return isEmail(value);
        }
      }
    }
  ],
  recipients: [
    {
      index: true,
      type: String,
      trim: true,
      // must be IP or FQDN or email
      validate: {
        validator(value) {
          if (detectInvisibleUnicode(value)) {
            throw Boom.badRequest(
              i18n.translateError('RECIPIENT_INVISIBLE_UNICODE', this.locale)
            );
          }

          return (
            isIP(value) ||
            isFQDN(value) ||
            isEmail(value) ||
            isURL(value, config.isURLOptions)
          );
        },
        message:
          'Recipient must be a valid email address, fully-qualified domain name ("FQDN"), IP address, or webhook URL'
      }
    }
  ],
  tokens: [Token]
});

// compound index
Aliases.index({ domain: 1, is_enabled: 1, user: 1, _id: 1 });
Aliases.index({ user: 1, domain: 1 });
Aliases.index({ _id: 1, domain: 1 });
Aliases.index({ name: 1, domain: 1 });

// validate PGP key if any
Aliases.pre('save', async function (next) {
  if (!this.public_key) return next();

  try {
    await getKeyInfo(this.public_key, this.locale);
    next();
  } catch (err) {
    next(err);
  }
});

Aliases.pre('validate', function (next) {
  // if storage used was below zero then set to zero
  if (this.storage_used < 0) this.storage_used = 0;

  // if alias doesn't have IMAP, storage_used should be 0
  // (non-IMAP aliases only forward emails and have no database)
  if (!this.has_imap) this.storage_used = 0;

  // if name was not a string then generate a random one
  if (!isSANB(this.name)) {
    //
    // NOTE: previously we generated a random string
    //       however these strings were not memorable
    //
    // this.name = randomstring({
    //   characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
    //   length: 10
    // });
    //
    this.name = generateSlug(2, {
      format: 'kebab',
      categories: {
        noun: [
          'animals',
          'business',
          'education',
          'food',
          'health',
          'media',
          'place',
          'profession',
          'science',
          'sports',
          'technology',
          'thing',
          'time',
          'transportation'
        ]
      }
    });
  }

  // trim and convert to lowercase
  this.name = this.name.trim().toLowerCase();

  // require alias name
  if (
    !quotedEmailUserUtf8.test(this.name) ||
    (!this.name.startsWith('/') && this.name.includes('+'))
  )
    return next(Boom.badRequest('Alias name was invalid.'));

  //
  // TODO: allow + symbol if the domain is not global
  //       and if the owner of the alias also owns the non + version or if the non + version does not exist yet
  //

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
    return next(
      Boom.badRequest('Alias must not start with an exclamation point.')
    );

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
      Boom.badRequest(
        'Alias with recipient verification must have email-only recipients.'
      )
    );

  // labels must be slugified and unique
  if (!_.isArray(this.labels)) this.labels = [];
  // description must be plain text
  if (isSANB(this.description)) this.description = striptags(this.description);
  if (!isSANB(this.description)) this.description = undefined;

  next();
});

// vacation responder support
Aliases.pre('validate', function (next) {
  //
  // vacation responder cannot be enabled
  // on regular expressions nor wildcard matches
  //
  if (
    this?.vacation_responder?.is_enabled &&
    (this.name === '*' || (isSANB(this.name) && this.name.startsWith('/')))
  )
    return next(
      Boom.badRequest(i18n.translateError('VACATION_RESPONDER_NAME_SPECIFIC'))
    );

  // strip tags/html from subject
  if (isSANB(this?.vacation_responder?.subject))
    this.vacation_responder.subject = striptags(
      this.vacation_responder.subject
    );
  // strip tags/html from message
  if (isSANB(this?.vacation_responder?.message))
    this.vacation_responder.message = striptags(
      this.vacation_responder.message
    );
  // if start_date AND end_date both set, ensure start_date is before
  if (
    _.isDate(this?.vacation_responder?.start_date) &&
    _.isDate(this?.vacation_responder?.end_date) &&
    new Date(this.vacation_responder.start_date).getTime() >=
      new Date(this.vacation_responder.end_date)
  )
    return next(
      Boom.badRequest(
        i18n.translateError('VACATION_RESPONDER_DATE_ISSUE', this.locale)
      )
    );
  next();
});

// prevent wildcards from being disabled
// (they either need deleted or enabled, too confusing otherwise)
Aliases.pre('validate', function (next) {
  if (this.name === '*' && !this.is_enabled)
    return next(
      Boom.badRequest(
        'Alias that is a catch-all must be enabled or deleted entirely to be disabled.'
      )
    );
  next();
});

// user cannot have imap enabled on a catchall nor regex
Aliases.pre('validate', function (next) {
  if (this.has_imap && (this.name === '*' || this.name.startsWith('/')))
    return next(
      Boom.badRequest(
        'You cannot enable IMAP for catch-all/regular expression alias names.  Please go back and create a unique/individual alias (e.g. "you@yourdomain.com") and try again.'
      )
    );
  next();
});

// validate regex aliases to prevent invalid patterns (e.g. perl operators like negative lookahead)
Aliases.pre('validate', function (next) {
  // only validate regex aliases
  if (!isSANB(this.name) || !this.name.startsWith('/')) return next();

  const hasTwoSlashes = this.name.lastIndexOf('/') !== this.name.indexOf('/');
  if (!hasTwoSlashes) return next();

  // find the regex flag ending
  let lastIndex;
  for (const ending of REGEX_FLAG_ENDINGS) {
    if (
      this.name.lastIndexOf(ending) !== -1 &&
      this.name.lastIndexOf(ending) !== 0
    ) {
      lastIndex = ending;
      break;
    }
  }

  if (!lastIndex) return next();

  let parsedRegex = this.name.slice(
    0,
    Math.max(0, this.name.lastIndexOf(lastIndex) + 1)
  );

  // add case insensitive flag since email addresses are case insensitive
  if (lastIndex === '/g' || lastIndex === '/') parsedRegex += 'i';

  // attempt to parse the regex with RE2 to validate it
  try {
    // eslint-disable-next-line no-new
    new RE2(regexParser(parsedRegex));
  } catch (err) {
    logger.debug(err, { parsedRegex, aliasName: this.name });
    return next(
      Boom.badRequest(
        i18n.translateError(
          'INVALID_REGEX_PATTERN',
          this.locale,
          this.name,
          err.message
        )
      )
    );
  }

  next();
});

// this must be kept before other `pre('save')` hooks as
// it populates "id" String automatically for comparisons
Aliases.plugin(mongooseCommonPlugin, {
  object: 'alias',
  omitExtraFields: ['is_rekey', 'is_api', 'tokens', 'pgp_error_sent_at', 'aps'],
  defaultLocale: i18n.config.defaultLocale
});

Aliases.virtual('virtual_member')
  .get(function () {
    return this.__virtual_member;
  })
  .set(function (virtualMember) {
    this.__virtual_member = virtualMember;
  });

Aliases.virtual('is_new_user')
  .get(function () {
    return this.__is_new_user;
  })
  .set(function (isNewUser) {
    this.__is_new_user = boolean(isNewUser);
  });

Aliases.virtual('is_update')
  .get(function () {
    return this.__is_update;
  })
  .set(function (isUpdate) {
    this.__is_update = boolean(isUpdate);
  });

Aliases.pre('save', async function (next) {
  const alias = this;
  try {
    // domain and user must exist
    // user must be a member of the domain
    // name@domain.name must be unique for given domain
    const [domain, user] = await Promise.all([
      conn.models.Domains.findOne({
        $or: [
          {
            _id: alias.domain,
            // virtual helper from `jobs/ubuntu-sync-memberships.js`
            ...(alias.virtual_member ? {} : { 'members.user': alias.user })
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
      conn.models.Users.findOne({
        _id: alias.user,
        [config.userFields.isBanned]: false
      })
        .lean()
        .select('id plan group')
        .exec()
    ]);

    if (!domain)
      throw Boom.badRequest(
        i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', alias.locale)
      );

    if (!user && !alias.is_new_user)
      throw Boom.badRequest(i18n.translateError('INVALID_USER', alias.locale));

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

    if (domain.is_global && alias.has_imap)
      throw Boom.badRequest(
        i18n.translateError('CANNOT_USE_IMAP_ON_GLOBAL', alias.locale)
      );

    if (domain.is_catchall_regex_disabled && alias.name === '*')
      throw Boom.badRequest(
        i18n.translateError('CANNOT_CREATE_CATCHALL_ON_DOMAIN', alias.locale)
      );

    if (domain.is_catchall_regex_disabled && alias.name.startsWith('/'))
      throw Boom.badRequest(
        i18n.translateError('CANNOT_CREATE_REGEX_ON_DOMAIN', alias.locale)
      );

    // if domain is global we prevent vacation responder
    if (domain.is_global) alias.vacation_responder = {};

    // if it starts with a forward slash then it must be a regex
    if (!alias.name.startsWith('/') && !isEmail(`${alias.name}@${domain.name}`))
      throw Boom.badRequest(i18n.translateError('INVALID_EMAIL', alias.locale));

    //
    // NOTE: we ensure that `alias.max_quota` cannot exceed `domain.max_quota_per_alias`
    //
    if (
      Number.isFinite(domain.max_quota_per_alias) &&
      Number.isFinite(alias.max_quota) &&
      alias.max_quota > domain.max_quota_per_alias
    )
      throw Boom.badRequest(
        i18n.translateError(
          'ALIAS_QUOTA_EXCEEDS_DOMAIN',
          alias.locale,
          `${alias.name}@${domain.name}`,
          bytes(alias.max_quota),
          bytes(domain.max_quota_per_alias)
        )
      );

    // determine the domain membership for the user
    let member = domain.members.find((member) =>
      user
        ? member.user && member.user.id === user.id
        : member.user && member.user.id === alias.user.toString()
    );

    if (!member && (alias.is_new_user || domain.is_global))
      member = {
        user: {
          _id: user ? user._id : alias.user,
          id: user ? user.id : alias.user.toString()
        },
        group: 'user'
      };

    // virtual helper from `jobs/ubuntu-sync-memberships.js`
    if (!member && alias.virtual_member) member = alias.virtual_member;

    //
    // NOTE: because the user model has a pre save hook that adds a domain member
    //       but populate above is trying to populate it, we can assume it's new
    //
    if (!member)
      throw Boom.badRequest(
        i18n.translateError('INVALID_MEMBER', alias.locale)
      );

    const string = alias.name.replace(/[^\da-z]/g, '');

    if (member.group !== 'admin') {
      // ubuntu-related aliases for non-admins cannot edit their username
      if (
        !alias.isNew &&
        domain.plan === 'team' &&
        domain.has_txt_record &&
        Object.keys(config.ubuntuTeamMapping).includes(domain.name)
      ) {
        const existingAlias = await alias.constructor.findById(alias._id);
        if (!existingAlias)
          throw Boom.badRequest(
            i18n.translateError('ALIAS_DOES_NOT_EXIST', alias.locale)
          );
        if (existingAlias.name !== alias.name)
          throw Boom.badRequest(
            i18n.translateError('UBUNTU_PERMISSIONS', alias.locale)
          );
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

      if (!reservedMatch) {
        if (
          domain.plan === 'team' &&
          domain.has_txt_record &&
          Object.keys(config.ubuntuTeamMapping).includes(domain.name)
        ) {
          reservedMatch = reservedAdminList.find((addr) => addr === string);
        } else {
          reservedMatch = reservedAdminList.find(
            (addr) =>
              addr === string ||
              string.startsWith(addr) ||
              string.endsWith(addr)
          );
        }
      }

      if (
        !reservedMatch &&
        domain.plan === 'team' &&
        Array.isArray(domain.restricted_alias_names) &&
        domain.restricted_alias_names.length > 0
      )
        reservedMatch = domain.restricted_alias_names.find(
          (name) => name === string
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
      if (domain.is_global && !alias.is_new_user && user) {
        // user must be on a paid plan to use a global domain
        if (user.plan === 'free' && !alias.is_update) {
          const arr = await conn.models.Domains.aggregate([
            {
              $match: {
                is_global: true
              }
            },
            {
              $group: {
                _id: '$_id'
              }
            }
          ])
            .allowDiskUse(true)
            .exec();

          const aliasCount = await alias.constructor.countDocuments({
            user: user._id,
            domain: { $in: arr.map((v) => v._id) }
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

    //
    // prevent forwarding recipients that are recursive
    // if and only if the alias is enabled
    // (otherwise user's would just be recursively forwarding)
    //
    if (
      alias.is_enabled &&
      alias.name !== '*' &&
      !alias.name.startsWith('/') &&
      Array.isArray(alias.recipients) &&
      alias.recipients.length >= 0 &&
      alias.recipients.some(
        (r) => r.toLowerCase().trim() === `${alias.name}@${domain.name}`
      )
    )
      throw Boom.badRequest(
        i18n.translateError(
          'ALIAS_MUST_NOT_MATCH_RECIPIENT',
          alias.locale,
          `${alias.name}@${domain.name}`,
          `${alias.name}@${domain.name}`
        )
      );

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

async function updateDomainCatchallRegexBooleans(alias) {
  try {
    const domain = await conn.models.Domains.findById(alias.domain)
      .select('is_catchall_regex_disabled')
      .lean()
      .exec();
    if (!domain) throw new Error('Domain does not exist');
    if (domain.is_catchall_regex_disabled) return;

    const arr = await alias.constructor
      .aggregate([
        {
          $match: {
            domain: alias.domain
          }
        },
        {
          $group: {
            _id: '$name'
          }
        }
      ])
      .allowDiskUse(true)
      .exec();

    let hasCatchall = false;
    let hasRegex = false;

    for (const v of arr) {
      if (hasCatchall && hasRegex) break;
      if (v._id === '*') hasCatchall = true;
      else if (v._id.startsWith('/')) hasRegex = true;
    }

    await conn.models.Domains.findByIdAndUpdate(alias.domain, {
      $set: {
        has_catchall: hasCatchall,
        has_regex: hasRegex
      }
    });
  } catch (err) {
    logger.fatal(err);
  }
}

Aliases.post('deleteOne', updateDomainCatchallRegexBooleans);
Aliases.post('save', updateDomainCatchallRegexBooleans);

//
// TODO: storage quota for any given alias is the sum
//       of all admins for the domain (if not a paid plan domain then error)
//       (we sum the `user.storage_quota` or fallback to the default `config.maxQuotaPerAlias`)
//       (we only sum the storage quota if the alias' domain is on a team plan)
//

//
// NOTE: storage used calculation for any given alias is
//       the sum of all aliases across all domains from admins on the same domain
//       (e.g. user A is admin of 10 domains and user B is admin of 10 domains)
//       (even though 5 of them may not overlap, the sum of all 20 domains is combined)
//       (this isn't best case scenario right now, and instead we should allow users to allocate restrictions)
//       (note that we filter it for admins that are on matching paid plans only as well)
//       (so this edge case would really only apply to users that on team plans with multiple admins that have signed up for the team plan)
//       (but even then that's such a small edge case, but we still at least pool together the 10 GB each that both get)
//
//       shared storage pooling would only apply for domains that are on the team plan
//       if the domain has two admins that are both on paid plans then the max quota should be maxQuota * 2 (or sum of `user.storage_quota`)
//
//       basically if a member of a domain is a user and not an admin, then this means the domain is on the team plan
//       and if the user has other aliases on other domains of their own on their own enhanced protection plan
//       then the storage quota for the aliases on the domain that the user belongs to under the team plan
//       won't affect their storage quota for their own domains on their own enhanced plan
//
async function getStorageUsed(alias, locale = i18n.config.defaultLocale) {
  return conn.models.Domains.getStorageUsed(
    alias.domain,
    alias.locale || locale
  );
}

Aliases.statics.getStorageUsed = getStorageUsed;

Aliases.statics.isOverQuota = async function (
  alias,
  size = 0,
  client,
  reset = false
) {
  let storageUsed;
  let maxQuotaPerAlias;

  // check cache
  if (client && !reset) {
    try {
      const cache = await client.get(`alias_quota:${alias.id}`);
      if (cache) {
        const json = JSON.parse(cache);
        if (json.storageUsed && json.maxQuotaPerAlias) {
          storageUsed = json.storageUsed;
          maxQuotaPerAlias = json.maxQuotaPerAlias;
        }
      }
    } catch (err) {
      logger.fatal(err);
    }
  }

  [storageUsed, maxQuotaPerAlias] = await Promise.all([
    //
    // TODO: this gets the storage used across the entire domain
    // so we need to check this + `size` against either
    // the larger value of either user.storage_quota
    // or the sum of all admins's storage quota on team plan if domain is on team plan
    //
    storageUsed || getStorageUsed.call(this, alias),
    // TODO: allow users to purchase more storage (tied to their user.storage_quota)
    //       but this is only relative here if the user is an admin of their aliases domain
    maxQuotaPerAlias ||
      conn.models.Domains.getMaxQuota(alias?.domain?._id || alias.domain)
  ]);

  // TODO: if user is on team plan then check if any other user is on team plan
  //       and multiply that user count by the max quota (pooling concept for teams)
  const isOverQuota = storageUsed + size > maxQuotaPerAlias;

  // log fatal error to admins (so they will get notified by email/text)
  if (isOverQuota)
    logger.fatal(
      new Error(
        `Alias ${alias.id} is over quota (${bytes(storageUsed + size)}/${bytes(
          maxQuotaPerAlias
        )})`
      )
    );

  // cache the values of storageUsed and isOverQuota for 1d
  if (size === 0)
    client
      .set(
        `alias_quota:${alias.id}`,
        JSON.stringify({
          storageUsed,
          maxQuotaPerAlias
        }),
        'PX',
        ms('1d')
      )
      .then()
      .catch((err) => logger.fatal(err));

  return { storageUsed, isOverQuota, maxQuotaPerAlias };
};

Aliases.methods.createToken = async function (
  description = '',
  existingPassword,
  userInputs = []
) {
  if (this.name === '*')
    throw Boom.badRequest(
      i18n.translateError('CANNOT_CREATE_TOKEN_FOR_CATCHALL', this.locale)
    );
  if (this.name.startsWith('/'))
    throw Boom.badRequest(
      i18n.translateError('CANNOT_CREATE_TOKEN_FOR_REGEX', this.locale)
    );
  const { password, salt, hash, has_pbkdf2_migration } = await createPassword(
    existingPassword,
    userInputs
  );
  this.tokens.push({
    description,
    salt,
    hash,
    has_pbkdf2_migration
  });
  return password;
};

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('Aliases', Aliases);
