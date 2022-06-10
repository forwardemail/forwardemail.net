const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const RE2 = require('re2');
const _ = require('lodash');
const captainHook = require('captain-hook');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const reservedAdminList = require('reserved-email-addresses-list/admin-list.json');
const reservedEmailAddressesList = require('reserved-email-addresses-list');
const slug = require('speakingurl');
const striptags = require('striptags');
const { isIP, isEmail, isURL } = require('validator');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const Domains = require('./domain');
const Users = require('./user');
const logger = require('#helpers/logger');
const config = require('#config');
const i18n = require('#helpers/i18n');

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

// <https://github.com/validatorjs/validator.js/blob/master/src/lib/isEmail.js>
const quotedEmailUserUtf8 = new RE2(
  // eslint-disable-next-line no-control-regex
  /^([\s\u0001-\u0008\u000E-\u001F!\u0023-\u005B\u005D-\u007F\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\u0001-\u0009\u000B-\u007F\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i
);

const Alias = new mongoose.Schema({
  is_api: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  domain: {
    type: mongoose.Schema.ObjectId,
    ref: 'Domain',
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
    trim: true
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
      maxlength: 20
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
          isURL(value, app.config.isURLOptions),
        message:
          'Recipient must be a valid email address, fully-qualified domain name ("FQDN"), IP address, or webhook URL'
      }
    }
  ]
});

Alias.plugin(captainHook);

Alias.pre('validate', function (next) {
  // require alias name
  if (
    !isSANB(this.name) ||
    !quotedEmailUserUtf8.test(this.name.trim().toLowerCase()) ||
    (!this.name.trim().startsWith('/') && this.name.includes('+'))
  )
    return next(new Error('Alias name was invalid'));

  // trim and convert to lowercase
  this.name = this.name.trim().toLowerCase();

  // add wildcard as first label
  if (this.name === '*') this.labels.unshift('catch-all');
  this.labels = _.compact(_.uniq(this.labels.map((label) => slug(label))));
  if (this.name !== '*') this.labels = _.without(this.labels, 'catch-all');

  // alias must not start with ! exclamation (since that denotes it is ignored)
  if (this.name.indexOf('!') === 0)
    return next(new Error('Alias must not start with an exclamation point'));

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
          if (isURL(r)) return r.trim();
          return r.toLowerCase().trim();
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
        'Alias with recipient verification must have email-only recipients'
      )
    );

  // labels must be slugified and unique
  if (!_.isArray(this.labels)) this.labels = [];
  // description must be plain text
  if (isSANB(this.description)) this.description = striptags(this.description);
  if (!isSANB(this.description)) this.description = null;

  // alias must have at least one recipient
  if (!_.isArray(this.recipients) || _.isEmpty(this.recipients))
    return next(new Error('Alias must have at least one recipient.'));

  next();
});

// prevent wildcards from being disabled
// (they either need deleted or enabled, too confusing otherwise)
Alias.pre('validate', function (next) {
  if (this.name === '*' && !this.is_enabled)
    return next(
      new Error(
        'Alias that is a catch-all must be enabled or deleted entirely to be disabled'
      )
    );
  next();
});

// this must be kept before other `pre('save')` hooks as
// it populates "id" String automatically for comparisons
Alias.plugin(mongooseCommonPlugin, {
  object: 'alias',
  omitExtraFields: ['is_api']
});

// eslint-disable-next-line complexity
Alias.pre('save', async function (next) {
  const alias = this;
  try {
    // domain and user must exist
    // user must be a member of the domain
    // name@domain.name must be unique for given domain
    let [domain, user, aliases] = await Promise.all([
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
      Users.findById(alias.user).select('id').lean().exec(),
      alias.constructor
        .find({
          domain: alias.domain
        })
        .select('id user name recipients')
        .populate('user', `id ${config.userFields.isBanned}`)
        .lean()
        .exec()
    ]);

    // filter out domains and aliases without users
    aliases = aliases.filter(
      (alias) =>
        _.isObject(alias.user) && !alias.user[config.userFields.isBanned]
    );
    domain.members = domain.members.filter(
      (member) =>
        _.isObject(member.user) && !member.user[config.userFields.isBanned]
    );

    if (!domain)
      throw Boom.notFound(
        i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', alias.locale)
      );

    if (!user)
      throw Boom.notFound(i18n.translateError('INVALID_USER', alias.locale));

    // find an existing alias match
    const match = aliases.find(
      (_alias) => _alias.id !== alias.id && _alias.name === alias.name
    );

    if (match)
      throw Boom.badRequest(
        i18n.translateError('ALIAS_ALREADY_EXISTS', alias.locale)
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

    if (member.group !== 'admin') {
      // alias name cannot be a wildcard "*" if the user is not an admin
      if (alias.name === '*')
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
      const string = alias.name.replace(/[^\da-z]/g, '');

      let reservedMatch = reservedEmailAddressesList.find(
        (addr) => addr === string
      );

      if (!reservedMatch)
        reservedMatch = reservedAdminList.find(
          (addr) =>
            addr === string || string.startsWith(addr) || string.endsWith(addr)
        );

      if (reservedMatch)
        throw Boom.badRequest(
          i18n.translateError(
            'RESERVED_WORD_ADMIN_REQUIRED',
            alias.locale,
            config.urls.web
          )
        );

      // if user is not admin of the domain and it is a global domain
      // then the user can only have up to 5 aliases at a time on the domain
      if (domain.is_global && !alias._wasNew) {
        const aliasCount = aliases.filter(
          (_alias) => _alias.user.id === user.id && _alias.name !== alias.name
        ).length;
        if (aliasCount > 5)
          throw Boom.badRequest(
            i18n.translateError('REACHED_MAX_ALIAS_COUNT', alias.locale)
          );
      }
    }

    // if alias has more than X recipients allowed on the domain
    // if the value was unset or set to zero then use default
    // (this is a nice clean way to ensure 1:1 sync with `forward-email`
    const count =
      !domain.max_recipients_per_alias || domain.max_recipients_per_alias === 0
        ? app.config.maxForwardedAddresses
        : domain.max_recipients_per_alias;

    if (alias.recipients.length > count)
      throw Boom.badRequest(
        i18n.translateError('EXCEEDED_UNIQUE_COUNT', alias.locale, count)
      );

    // domain must be on a paid plan in order to require verification
    if (domain.plan === 'free' && alias.has_recipient_verification)
      return next(
        Boom.badRequest(
          i18n.translateError(
            'PAID_PLAN_REQUIRED_FOR_RECIPIENT_VERIFICATION',
            alias.locale
          )
        )
      );

    // domain must not be a global plan in order to require verification
    if (domain.is_global && alias.has_recipient_verification)
      return next(
        Boom.badRequest(
          i18n.translateError(
            'PAID_PLAN_REQUIRED_FOR_RECIPIENT_VERIFICATION',
            alias.locale
          )
        )
      );

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Alias', Alias);
