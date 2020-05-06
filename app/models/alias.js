const ForwardEmail = require('forward-email');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const reservedAdminList = require('reserved-email-addresses-list/admin-list.json');
const reservedEmailAddressesList = require('reserved-email-addresses-list');
const slug = require('speakingurl');
const striptags = require('striptags');
const { isIP, isFQDN, isEmail } = require('validator');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const logger = require('../../helpers/logger');
const config = require('../../config');
const Domains = require('./domain');
const Users = require('./user');

const app = new ForwardEmail({ logger, recordPrefix: config.recordPrefix });

// <https://github.com/validatorjs/validator.js/blob/master/src/lib/isEmail.js>
// eslint-disable-next-line no-control-regex
const quotedEmailUserUtf8 = /^([\s\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F!\u0023-\u005B\u005D-\u007E\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\u0001-\u0009\u000B\u000C\u000D-\u007F\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;

const Alias = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  domain: {
    type: mongoose.Schema.ObjectId,
    ref: 'Domain',
    required: true
  },
  // asterisk "*" means wildcard
  // however note that "*" is a valid email character
  // but we have specific app logic that restricts this for us
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: value =>
        isSANB(value) &&
        quotedEmailUserUtf8.test(value) &&
        value.indexOf('!') !== 0
    }
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 150,
    trim: true
  },
  labels: [
    {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 20
    }
  ],
  is_enabled: {
    type: Boolean,
    default: true
  },
  recipients: [
    {
      type: String,
      trim: true,
      lowercase: true,
      // must be IP or FQDN or email
      validate: {
        validator: value => isIP(value) || isFQDN(value) || isEmail(value),
        message:
          'Recipient must be a valid email address, fully-qualified domain name ("FQDN"), or IP address'
      }
    }
  ]
});

Alias.pre('validate', function(next) {
  // make recipients unique by email address, FQDN, or IP
  this.recipients = _.compact(
    _.uniq(this.recipients.map(r => r.toLowerCase().trim()))
  );
  // labels must be slugified and unique
  if (!_.isArray(this.labels)) this.labels = [];
  // description must be plain text
  if (isSANB(this.description)) this.description = striptags(this.description);
  if (!isSANB(this.description)) this.description = null;
  if (isSANB(this.name)) {
    // trim and convert to lowercase
    this.name = this.name.trim().toLowerCase();
    // if alias is wildcards only then convert to single asterisk
    if ([...new Set(this.name.replace(/[^*]/g, '').split(''))].join('') === '*')
      this.name = '*';
    // add wildcard as first label
    if (this.name === '*') this.labels.unshift('catch-all');
    this.labels = _.compact(_.uniq(this.labels.map(label => slug(label))));
    if (this.name !== '*') this.labels = _.without(this.labels, 'catch-all');
  }

  // alias must not start with ! exclamation (since that denotes it is ignored)
  if (this.name.indexOf('!') === 0)
    return next(new Error('Alias must not start with an exclamation point'));

  // alias must have at least one recipient
  if (!_.isArray(this.recipients) || _.isEmpty(this.recipients))
    return next(new Error('Alias must have at least one recipient.'));

  next();
});

// this must be kept before other `pre('save')` hooks as
// it populates "id" String automatically for comparisons
Alias.plugin(mongooseCommonPlugin, {
  object: 'alias',
  omitExtraFields: []
});

Alias.pre('save', async function(next) {
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
        .populate('members.user', 'id is_banned')
        .lean()
        .exec(),
      Users.findById(alias.user)
        .select('id')
        .lean()
        .exec(),
      alias.constructor
        .find({
          domain: alias.domain
        })
        .select('id user name recipients')
        .populate('user', 'id is_banned')
        .lean()
        .exec()
    ]);

    // filter out domains and aliases without users
    aliases = aliases.filter(
      alias => _.isObject(alias.user) && !alias.user.is_banned
    );
    domain.members = domain.members.filter(
      member => _.isObject(member.user) && !member.user.is_banned
    );

    if (!domain) throw new Error('Domain does not exist.');

    if (!user) throw new Error('User does not exist.');

    // find an existing alias match
    const match = aliases.find(
      _alias => _alias.id !== alias.id && _alias.name === alias.name
    );

    if (match) throw new Error('Alias already exists for this domain.');

    if (!isEmail(`${alias.name}@${domain.name}`))
      throw new Error('Email address was invalid.');

    // determine the domain membership for the user
    let member = domain.members.find(member => member.user.id === user.id);

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
        throw new Error(
          'User must be a domain admin to create a catch-all alias.'
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
        addr => addr === string
      );

      if (!reservedMatch)
        reservedMatch = reservedAdminList.find(
          addr =>
            addr === string || string.startsWith(addr) || string.endsWith(addr)
        );

      if (reservedMatch)
        throw new Error(
          `User must be a domain admin to create an alias with a reserved word (see the page on <a target="_blank" rel="noopener" href="${config.urls.web}/reserved-email-addresses">Reserved Email Addresses</a>).`
        );

      // if user is not admin of the domain and it is a global domain
      // then the user can only have up to 5 aliases at a time on the domain
      if (domain.is_global) {
        const aliasCount = aliases.filter(
          _alias => _alias.user.id === user.id && _alias.name !== alias.name
        ).length;
        if (aliasCount > 5)
          throw new Error(
            'User cannot have more than (5) aliases on global domains.'
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
      throw new Error(
        `You have exceeded the maximum count of (${count}) recipients per alias.  Please <a href="/help">contact us</a> if you wish to have this limit increased.  We review requests on a unique basis.  Please provide us with information about your forwarding purposes if possible.`
      );

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Alias', Alias);
