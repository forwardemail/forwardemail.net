const path = require('path');
const { promisify } = require('util');

const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const Meta = require('koa-meta');
const RE2 = require('re2');
const Stripe = require('stripe');
const _ = require('lodash');
const accounting = require('accounting');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const cryptoRandomString = require('crypto-random-string');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const paypal = require('paypal-rest-sdk');
const pug = require('pug');
const slug = require('speakingurl');
const splitLines = require('split-lines');
const striptags = require('striptags');
const superagent = require('superagent');
const titleize = require('titleize');
const wkhtmltopdf = require('wkhtmltopdf');
const { boolean } = require('boolean');
const { isEmail, isIP, isPort } = require('validator');
const { parse } = require('node-html-parser');

const env = require('../../../config/env');
const config = require('../../../config');
const emailHelper = require('../../../helpers/email');
const logger = require('../../../helpers/logger');
const toObject = require('../../../helpers/to-object');
const { Users, Domains, Aliases, Payments } = require('../../models');

const PAYPAL_ENDPOINT =
  env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

const payPalClient = new checkoutNodeJssdk.core.PayPalHttpClient(
  new checkoutNodeJssdk.core[
    env.NODE_ENV === 'production' ? 'LiveEnvironment' : 'SandboxEnvironment'
  ](env.PAYPAL_CLIENT_ID, env.PAYPAL_SECRET)
);

paypal.configure({
  mode: env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  client_id: env.PAYPAL_CLIENT_ID,
  client_secret: env.PAYPAL_SECRET
});

const isTest =
  !env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY.startsWith('sk_test');

const meta = new Meta(config.meta, logger);

const PAYMENT_DURATIONS = new Set([
  '30d',
  '60d',
  '90d',
  '180d',
  '1y',
  '2y',
  '3y'
]);

const STRIPE_PRODUCTS = {
  // test
  prod_ICSwLEvQhmYDcy: 'team',
  prod_ICStJG6fjZhEjl: 'enhanced_protection',
  // live
  prod_ICRsgPRv2sVKlp: 'team',
  prod_IBizMRHKSjMQcl: 'enhanced_protection'
};

const STRIPE_MAPPING = {
  enhanced_protection: {
    'one-time': {
      '30d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXyLFuf8FuIPJrPzAy9y7',
      '60d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJOZ53q1Pa',
      '90d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJt1actni9',
      '180d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJakedaHaz',
      '1y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJ3X8FfkRn',
      '2y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLY0LFuf8FuIPJFKeUg5kf',
      '3y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLY0LFuf8FuIPJkavB2UyM'
      // lifetime: isTest
      //   ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
      //   : 'price_1HbLd4LFuf8FuIPJwB3WwfaE'
    },
    subscription: {
      '30d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLglLFuf8FuIPJDmpFggVW',
      '60d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLh0LFuf8FuIPJD4lYB3Jz',
      '90d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLhFLFuf8FuIPJBPD5hScR',
      '180d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLhaLFuf8FuIPJ2eUbPZfI',
      '1y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLi4LFuf8FuIPJTSsQAit3'
    }
  },
  team: {
    'one-time': {
      '30d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2ypLFuf8FuIPJFo5Q9L3E',
      '60d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2ypLFuf8FuIPJxLg7dYmV',
      '90d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJlvIwyhNT',
      '180d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJ00A3zNFB',
      '1y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJENDdnNWs',
      '2y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJ8LSXjG48',
      '3y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJSaHAcuOv'
      // lifetime: isTest
      //   ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
      //   : 'price_1Hc2yqLFuf8FuIPJteXh3Z2D'
    },
    subscription: {
      '30d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJa44UB4fa',
      '60d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yrLFuf8FuIPJ33ffzO71',
      '90d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJ3ev702mN',
      '180d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJvNJJswbG',
      '1y': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJYbtNstWT'
    }
  }
};

const PAYPAL_MAPPING = {
  enhanced_protection: {
    '30d': 3,
    '60d': 6,
    '90d': 9,
    '180d': 18,
    '1y': 36,
    '2y': 72,
    '3y': 108
    // lifetime: 144
  },
  team: {
    '30d': 9,
    '60d': 18,
    '90d': 27,
    '180d': 54,
    '1y': 108,
    '2y': 216,
    '3y': 324
    // lifetime: 432
  }
};

const PAYPAL_PLAN_MAPPING = {
  enhanced_protection: {
    '30d': process.env.PAYPAL_ENHANCED_PLAN_30D,
    '60d': process.env.PAYPAL_ENHANCED_PLAN_60D,
    '90d': process.env.PAYPAL_ENHANCED_PLAN_90D,
    '180d': process.env.PAYPAL_ENHANCED_PLAN_180D,
    '1y': process.env.PAYPAL_ENHANCED_PLAN_1Y
  },
  team: {
    '30d': process.env.PAYPAL_TEAM_PLAN_30D,
    '60d': process.env.PAYPAL_TEAM_PLAN_60D,
    '90d': process.env.PAYPAL_TEAM_PLAN_90D,
    '180d': process.env.PAYPAL_TEAM_PLAN_180D,
    '1y': process.env.PAYPAL_TEAM_PLAN_1Y
  }
};

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function update(ctx) {
  const { body } = ctx.request;
  const hasSetPassword = ctx.state.user[config.userFields.hasSetPassword];

  const requiredFields = ['password', 'confirm_password'];

  if (hasSetPassword) requiredFields.push('old_password');

  if (body.change_password === 'true') {
    requiredFields.forEach((prop) => {
      if (!isSANB(body[prop]))
        throw Boom.badRequest(
          ctx.translateError('INVALID_STRING', ctx.request.t(humanize(prop)))
        );
    });

    if (body.password !== body.confirm_password)
      throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD_CONFIRM'));

    if (hasSetPassword)
      await ctx.state.user.changePassword(body.old_password, body.password);
    else {
      await ctx.state.user.setPassword(body.password);
      ctx.state.user[config.userFields.hasSetPassword] = true;
    }

    ctx.state.user[config.userFields.resetToken] = null;
    ctx.state.user[config.userFields.resetTokenExpiresAt] = null;
  } else {
    ctx.state.user[config.passport.fields.givenName] =
      body[config.passport.fields.givenName];
    ctx.state.user[config.passport.fields.familyName] =
      body[config.passport.fields.familyName];
  }

  // check if we need to update the email and send an email confirmation
  const hasNewEmail =
    isSANB(body.email) &&
    ctx.state.user[config.passportLocalMongoose.usernameField] !== body.email;

  // confirm user supplied email is different than current email
  if (hasNewEmail) {
    // validate it (so it doesn't have to use mongoose for this)
    if (!isEmail(body.email))
      return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_EMAIL')));

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
          dayjs(
            ctx.state.user[config.userFields.changeEmailTokenExpiresAt]
          ).fromNow()
        )
      );

    // short-circuit if email already exists
    const query = { email: body.email };
    const user = await Users.findOne(query);
    if (user)
      throw Boom.badRequest(
        ctx.translateError('EMAIL_CHANGE_ALREADY_EXISTS', body.email)
      );

    // set the reset token and expiry
    ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = dayjs()
      .add(config.changeEmailTokenTimeoutMs, 'milliseconds')
      .toDate();
    ctx.state.user[
      config.userFields.changeEmailToken
    ] = await cryptoRandomString.async({
      length: 32
    });
    ctx.state.user[config.userFields.changeEmailNewAddress] = body.email;
  }

  // save the user
  ctx.state.user = await ctx.state.user.save();

  // send the email
  if (hasNewEmail) {
    try {
      await emailHelper({
        template: 'change-email',
        message: {
          to: body.email
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
      ctx.logger.error(err);
      // reset if there was an error
      try {
        ctx.state.user[config.userFields.changeEmailToken] = null;
        ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = null;
        ctx.state.user[config.userFields.changeEmailNewAddress] = null;
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

async function resetAPIToken(ctx) {
  ctx.state.user[config.userFields.apiToken] = null;
  ctx.state.user = await ctx.state.user.save();

  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function retrieveDomains(ctx, next) {
  ctx.state.domains = [];

  if (!ctx.isAuthenticated()) return next();

  const query = {
    $or: [{ 'members.user': ctx.state.user._id }]
  };
  if (ctx.state.user.group === 'admin') query.$or.push({ is_global: true });
  else
    query.$or.push({
      is_global: true
      // NOTE: if we uncomment this then DNS changes could impact global vanity domains
      // has_mx_record: true,
      // has_txt_record: true
    });

  // eslint-disable-next-line unicorn/no-array-callback-reference
  ctx.state.domains = await Domains.find(query)
    .populate(
      'members.user',
      `id email ${config.passport.fields.displayName} ${config.userFields.isBanned}`
    )
    .sort('is_global name') // A-Z domains
    .lean()
    .exec();

  ctx.state.domains = ctx.state.domains.map((domain) => {
    domain.members = domain.members.filter(
      (member) =>
        _.isObject(member.user) && !member.user[config.userFields.isBanned]
    );
    return domain;
  });

  let domainAliases = await Aliases.find({
    domain: { $in: _.map(ctx.state.domains, '_id') }
  })
    .populate('domain', 'name')
    .populate(
      'user',
      `id email ${config.passport.fields.displayName} ${config.userFields.isBanned}`
    )
    .sort('name')
    .lean()
    .exec();

  domainAliases = domainAliases.filter(
    (alias) => _.isObject(alias.user) && !alias.user[config.userFields.isBanned]
  );

  const aliasesByDomain = _.groupBy(
    domainAliases,
    (alias) => alias.domain.name
  );

  ctx.state.domains = ctx.state.domains.map((domain) => {
    // populate a `group` on the domain based off the user's association
    let member = domain.members.find(
      (member) => member.user.id === ctx.state.user.id
    );

    // for all global domains, if the user is not a member
    // then add them as a member to the domain
    if (!member && domain.is_global) {
      member = {
        user: {
          _id: ctx.state.user._id,
          id: ctx.state.user.id,
          email: ctx.state.user.email
        },
        group: 'user'
      };
      domain.members.push(member);
    }

    const { group } = member;

    // populate an `aliases` Array on the domain based off user's aliases
    const aliases = [];

    if (aliasesByDomain[domain.name])
      for (const alias of aliasesByDomain[domain.name]) {
        if (group === 'admin' || alias.user.id === ctx.state.user.id)
          aliases.push({
            ...alias,
            // for each alias set a virtual group helper
            // (if the user is an admin OR if the user is the owner of the alias)
            group:
              group === 'admin' || alias.user.id === ctx.state.user.id
                ? 'admin'
                : 'user'
          });
      }

    // iterate over domain.members and add `alias_count` virtual property
    // which counts across the aliases for the given member's user id
    domain.members = domain.members.map((member) => ({
      ...member,
      alias_count: aliasesByDomain[domain.name]
        ? aliasesByDomain[domain.name].filter(
            (alias) => alias.user.id === member.user.id
          ).length
        : 0
    }));

    return {
      ...domain,
      group,
      aliases
    };
  });

  //
  // search functionality (with RegExp support)
  //
  if (!ctx.pathWithoutLocale.endsWith('/aliases')) {
    if (isSANB(ctx.query.name))
      ctx.state.domains = ctx.state.domains.filter((domain) =>
        new RE2(_.escapeRegExp(ctx.query.name)).test(domain.name)
      );

    if (isSANB(ctx.query.alias)) {
      const aliasRegex = new RE2(_.escapeRegExp(ctx.query.alias));
      ctx.state.domains = ctx.state.domains.filter((domain) =>
        domain.aliases.some((alias) => aliasRegex.test(alias.name))
      );
    }

    if (isSANB(ctx.query.recipient)) {
      const recipientRegex = new RE2(_.escapeRegExp(ctx.query.recipient));
      ctx.state.domains = ctx.state.domains.filter((domain) =>
        domain.aliases.some((alias) =>
          alias.recipients.some((recipient) => recipientRegex.test(recipient))
        )
      );
    }
  }

  if (ctx.api) return next();

  if (
    ctx.state.domains.length === 0 &&
    ctx.method === 'GET' &&
    ['/my-account', '/my-account/domains'].includes(ctx.pathWithoutLocale)
  ) {
    if (!ctx.api)
      ctx.flash('custom', {
        title: ctx.request.t(`${ctx.state.emoji('wave')} Welcome!`),
        text: ctx.translate('NO_DOMAINS_EXIST'),
        type: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 5000,
        position: 'top'
      });
    return ctx.redirect('/my-account/domains/new');
  }

  return next();
}

async function retrieveDomain(ctx, next) {
  if (!isSANB(ctx.params.domain_id) && !isSANB(ctx.request.body.domain))
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  const id = isSANB(ctx.params.domain_id)
    ? ctx.params.domain_id
    : ctx.request.body.domain;

  ctx.state.domain = ctx.state.domains.find((domain) =>
    [domain.id, domain.name].includes(id)
  );

  // check if domain exists, and f it doesn't then check
  // if we have a pending invite
  if (!ctx.state.domain)
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  // if it's an API request then return early
  if (ctx.api) return next();

  //
  // set breadcrumbs
  //
  ctx.state.breadcrumbs = [
    'my-account',
    {
      name: ctx.state.t('Domains'),
      header: ctx.state.domain.name,
      href: ctx.state.l('/my-account/domains')
    },
    {
      name: ctx.state.domain.name,
      href:
        ctx.state.domain.group === 'admin'
          ? ctx.state.l(`/my-account/domains/${ctx.state.domain.name}`)
          : null
    }
  ];

  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  )
    ctx.state.breadcrumbs.push('aliases');
  else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/advanced-settings`
  )
    ctx.state.breadcrumbs.push('advanced-settings');
  else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases/new`
  ) {
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs.push({
      name: ctx.state.t('Aliases'),
      href: ctx.state.l(`/my-account/domains/${ctx.state.domain.name}/aliases`)
    });
    ctx.state.breadcrumbs.push({
      name: ctx.state.t('Add Alias')
    });
  } else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/billing`
  )
    ctx.state.breadcrumbs.push('billing');

  // load seo metadata
  let data = {};
  try {
    data = meta.getByPath(ctx.pathWithoutLocale || ctx.path, ctx.request.t);
  } catch (err) {
    logger.error(err);
    data = meta.getByPath('/', ctx.request.t);
  }

  Object.assign(ctx.state.meta, data);

  // dynamically load the DNS Managment by Registrar table from FAQ
  try {
    const html = pug.renderFile(
      path.join(config.views.root, 'faq', 'index.pug'),
      // make flash a noop so we don't interfere with messages/session
      {
        ...ctx.state,
        flash() {
          return {};
        }
      }
    );

    // expose it to the view
    const root = parse(html);
    ctx.state.modalFAQTable = root.querySelector(
      '#table-dns-management-by-registrar'
    ).outerHTML;
  } catch (err) {
    ctx.logger.error(err);
  }

  return next();
}

// eslint-disable-next-line complexity
async function createDomain(ctx, next) {
  if (!['GET', 'POST'].includes(ctx.method)) return next();

  if (ctx.method === 'GET') {
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs = [
      'my-account',
      {
        name: ctx.state.t('Domains'),
        header: ctx.state.t('Add Domain'),
        href: ctx.state.l('/my-account/domains')
      },
      {
        name: ctx.state.t('Add Domain')
      }
    ];
    if (ctx.api) return next();
    return ctx.render('my-account/domains/new');
  }

  if (
    !isSANB(ctx.request.body.domain) ||
    (!isFQDN(ctx.request.body.domain) && !isIP(ctx.request.body.domain))
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_DOMAIN')));

  const match = ctx.state.domains.find(
    (domain) => domain.name === ctx.request.body.domain
  );

  if (match)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('DOMAIN_ALREADY_EXISTS'))
    );

  if (
    isSANB(ctx.request.body.plan) &&
    !['free', 'enhanced_protection', 'team'].includes(ctx.request.body.plan)
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PLAN')));

  // check if we're creating a default catchall
  const recipients = [ctx.state.user.email];

  if (_.isBoolean(ctx.request.body.catchall) && !ctx.request.body.catchall)
    recipients.pop();
  else if (isSANB(ctx.request.body.catchall)) {
    const rcpts = _.compact(
      _.uniq(
        _.map(
          splitLines(ctx.request.body.catchall)
            .join(' ')
            .split(',')
            .join(' ')
            .split(' '),
          (recipient) => recipient.trim()
        )
      )
    );
    for (const rcpt of rcpts) {
      recipients.push(rcpt);
    }
  }

  const name = ctx.request.body.domain.trim().toLowerCase();

  let plan = ctx.state.user.plan || 'free';
  let redirectTo = ctx.state.l(`/my-account/domains/${name}`);

  // if the user was not on a valid plan then redirect them to billing post creation
  if (isSANB(ctx.request.body.plan)) {
    if (ctx.request.body.plan === 'enhanced_protection') {
      if (['enhanced_protection', 'team'].includes(ctx.state.user.plan))
        plan = 'enhanced_protection';
      else
        redirectTo = ctx.state.l(
          `/my-account/domains/${name}/billing?plan=enhanced_protection`
        );
    } else if (ctx.request.body.plan === 'team') {
      if (ctx.state.user.plan === 'team') {
        plan = 'team';
      } else {
        if (ctx.state.user.plan === 'enhanced_protection')
          plan = 'enhanced_protection';
        redirectTo = ctx.state.l(
          `/my-account/domains/${name}/billing?plan=team`
        );
      }
    }
  }

  try {
    ctx.state.domain = await Domains.create({
      is_api: boolean(ctx.api),
      members: [{ user: ctx.state.user._id, group: 'admin' }],
      name,
      is_global:
        ctx.state.user.group === 'admin' && boolean(ctx.request.body.is_global),
      locale: ctx.locale,
      plan
    });

    // create a default alias for the user pointing to the admin
    if (recipients.length > 0)
      await Aliases.create({
        is_api: boolean(ctx.api),
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: '*',
        recipients,
        locale: ctx.locale
      });

    if (ctx.api) {
      ctx.state.domain = toObject(Domains, ctx.state.domain);
      ctx.state.domain.members[0].user = toObject(Users, ctx.state.user);
      return next();
    }

    // TODO: flash messages logic in @ladjs/assets doesn't support both
    // custom and regular flash message yet
    if (ctx.state.domain.name.startsWith('www.') && !ctx.api) {
      ctx.flash(
        'error',
        ctx
          .translate('WWW_WARNING')
          .replace(/example.com/g, ctx.state.domain.name)
      );
    } else if (!ctx.api) {
      ctx.flash('custom', {
        title: ctx.request.t('Success'),
        text: ctx.translate('REQUEST_OK'),
        type: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        position: 'top'
      });
    }

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.throw(Boom.badRequest(err));
  }
}

async function remove(ctx) {
  const adminDomains = ctx.state.domains.filter(
    (domain) => domain.group === 'admin'
  );
  if (adminDomains.length > 0)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('ACCOUNT_DELETE_HAS_DOMAINS'))
    );
  await Users.findByIdAndRemove(ctx.state.user._id);
  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('ACCOUNT_DELETE_SUCCESSFUL'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
  const redirectTo = ctx.state.l();
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

async function removeDomain(ctx, next) {
  await Domains.findByIdAndRemove(ctx.state.domain._id);
  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
  if (ctx.api) return next();
  const redirectTo = ctx.state.l('/my-account/domains');
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

async function verifyRecords(ctx) {
  try {
    await Promise.all([
      // reset redis cache for smtp servers
      ctx.client
        ? ['a', 'mx', 'txt'].map(async (type) => {
            try {
              await app.dnsQuery(type, ctx.state.domain.name, true, ctx.client);
            } catch (err) {
              ctx.logger.warn(err);
            }
          })
        : Promise.resolve(),

      // check mx and txt
      Domains.verifyRecords(ctx.state.domain._id, ctx.locale)
    ]);

    const text = ctx.translate('DOMAIN_IS_VERIFIED');

    if (ctx.api) {
      ctx.body = text;
      return;
    }

    // if everything OK then success
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text,
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.warn(err);

    if (Array.isArray(err.errors)) {
      if (ctx.api) {
        err.message = err.errors.map((e) => e.message);
      } else {
        err.message = `<ul class="text-left mb-0">${err.errors
          .map((e) => `<li class="mb-3">${e && e.message ? e.message : e}</li>`)
          .join('')}</ul>`;
      }
    }

    ctx.throw(Boom.badRequest(err.message));
  }
}

function ensureDomainAdmin(ctx, next) {
  if (ctx.state.domain.group === 'admin') return next();
  ctx.throw(Boom.badRequest(ctx.translateError('IS_NOT_ADMIN')));
}

function ensureAliasAdmin(ctx, next) {
  if (ctx.state.alias.group === 'admin') return next();
  ctx.throw(Boom.badRequest(ctx.translateError('IS_NOT_ADMIN')));
}

function validateAlias(ctx, next) {
  const body = _.pick(ctx.request.body, [
    'name',
    'description',
    'labels',
    'is_enabled',
    'recipients'
  ]);

  if (!isSANB(body.name)) delete body.name;

  if (isSANB(body.description)) body.description = striptags(body.description);
  else delete body.description;

  if (isSANB(body.labels))
    body.labels = _.compact(
      _.uniq(
        _.map(
          splitLines(body.labels).join(' ').split(',').join(' ').split(' '),
          (label) => slug(label)
        )
      )
    );
  else delete body.labels;

  body.is_enabled = boolean(body.is_enabled);

  if (isSANB(body.recipients))
    body.recipients = _.compact(
      _.uniq(
        _.map(
          splitLines(body.recipients).join(' ').split(',').join(' ').split(' '),
          (recipient) => recipient.trim()
        )
      )
    );
  else delete body.recipients;

  ctx.state.body = body;

  return next();
}

async function createAlias(ctx, next) {
  try {
    if (ctx.state.body.name.includes('+'))
      return ctx.throw(
        Boom.badRequest(ctx.translateError('ALIAS_WITH_PLUS_UNSUPPORTED'))
      );

    ctx.state.alias = await Aliases.create({
      ...ctx.state.body,
      is_api: boolean(ctx.api),
      user: ctx.state.user._id,
      domain: ctx.state.domain._id,
      locale: ctx.locale
    });

    if (ctx.api) {
      ctx.state.alias = toObject(Aliases, ctx.state.alias);
      ctx.state.alias.user = toObject(Users, ctx.state.user);
      ctx.state.alias.domain = toObject(Domains, ctx.state.domain);
      ctx.state.alias.domain.members = ctx.state.domain.members;
      ctx.state.alias.domain.invites = ctx.state.domain.invites;
      return next();
    }

    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
}

function retrieveAlias(ctx, next) {
  if (!isSANB(ctx.params.alias_id))
    return ctx.throw(Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST')));
  ctx.state.alias = ctx.state.domain.aliases.find(
    (alias) => alias.id === ctx.params.alias_id
  );
  if (!ctx.state.alias)
    return ctx.throw(Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST')));

  if (ctx.api) return next();
  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases/${ctx.state.alias.id}`
  ) {
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs.push({
      name: ctx.state.t('Aliases'),
      href: ctx.state.l(`/my-account/domains/${ctx.state.domain.name}/aliases`)
    });
    ctx.state.breadcrumbs.push({
      header: ctx.state.t('Edit Alias'),
      name: `${ctx.state.alias.name}@${ctx.state.domain.name}`
    });
  }

  return next();
}

async function updateAlias(ctx, next) {
  ctx.state.alias = await Aliases.findById(ctx.state.alias._id);
  ctx.state.alias = _.extend(ctx.state.alias, ctx.state.body);
  try {
    ctx.state.alias.locale = ctx.locale;
    ctx.state.alias = await ctx.state.alias.save();
    if (ctx.api) {
      ctx.state.alias = toObject(Aliases, ctx.state.alias);
      ctx.state.alias.user = toObject(Users, ctx.state.user);
      ctx.state.alias.domain = toObject(Domains, ctx.state.domain);
      ctx.state.alias.domain.members = ctx.state.domain.members;
      ctx.state.alias.domain.invites = ctx.state.domain.invites;
      return next();
    }

    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
}

async function removeAlias(ctx, next) {
  await Aliases.findByIdAndRemove(ctx.state.alias._id);
  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
  if (ctx.api) return next();
  const redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  );
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

function sortedDomains(ctx, next) {
  ctx.state.sortedDomains = _.clone(ctx.state.domains);
  ctx.state.sortedDomains = ctx.state.sortedDomains.filter(
    (domain) => !domain.is_global
  );
  if (
    isSANB(ctx.query.domain) &&
    (isFQDN(ctx.query.domain) || isIP(ctx.query.domain)) &&
    ctx.state.sortedDomains.some((domain) => domain.name === ctx.query.domain)
  )
    ctx.state.sortedDomains = _.sortBy(
      ctx.state.sortedDomains.map((domain, i) => ({
        ...domain,
        _key: domain.name === ctx.query.domain ? 0 : i + 1
      })),
      '_key'
    );

  return next();
}

function ensureTeamPlan(ctx, next) {
  ctx.state.isTeamPlanRequired = ctx.state.domain.plan !== 'team';
  return next();
}

function ensureUpgradedPlan(ctx, next) {
  if (ctx.state.domain.plan !== 'free' && !ctx.state.isTeamPlanRequired)
    return next();

  const swal = {
    title: ctx.translate('UPGRADE_PLAN'),
    html: ctx.translate('PLAN_UPGRADE_REQUIRED'),
    type: 'warning'
  };

  if (ctx.api)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('PLAN_UPGRADE_REQUIRED'))
    );

  if (ctx.method === 'GET' || ctx.accepts('html')) {
    if (!ctx.api) ctx.flash('custom', swal);
    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/billing?plan=enhanced_protection`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  ctx.body = { swal };
}

// eslint-disable-next-line complexity
async function retrieveDomainBilling(ctx) {
  const isAccountUpgrade =
    ctx.pathWithoutLocale === '/my-account/billing/upgrade';
  const isMakePayment =
    ctx.pathWithoutLocale === '/my-account/billing/make-payment';
  const redirectTo = ctx.state.l(
    isAccountUpgrade || isMakePayment
      ? '/my-account/billing'
      : `/my-account/domains/${ctx.state.domain.name}`
  );
  const originalPlanExpiresAt = ctx.state.user[config.userFields.planExpiresAt];
  const originalPlan = ctx.state.user.plan;

  if (isMakePayment)
    if (ctx.state.user.plan === 'free')
      throw ctx.translateError('INVALID_PLAN');
    else ctx.query.plan = ctx.state.user.plan;

  try {
    if (
      !isSANB(ctx.query.plan) ||
      !['free', 'enhanced_protection', 'team'].includes(ctx.query.plan)
    )
      throw ctx.translateError('INVALID_PLAN');

    let domain;
    if (!isAccountUpgrade && !isMakePayment) {
      domain = await Domains.findById(ctx.state.domain._id);

      if (!domain) throw ctx.translateError('DOMAIN_DOES_NOT_EXIST');

      // set locale on domain for translation
      domain.locale = ctx.locale;

      // handle edge case if user had multiple tabs open and already upgraded
      if (ctx.query.plan === domain.plan)
        throw ctx.translateError('PLAN_ALREADY_ACTIVE');
    }

    //
    // validate that the user can actually downgrade to the desired plan
    //
    if (isAccountUpgrade) {
      const adminDomains = ctx.state.domains.filter((domain) =>
        domain.members.some(
          (member) =>
            member.user.id === ctx.state.user.id && member.group === 'admin'
        )
      );

      const errors = [];

      for (const domain of adminDomains) {
        if (domain.plan === 'free') continue;

        // determine what plans are required
        const validPlans =
          domain.plan === 'team' ? ['team'] : ['enhanced_protection', 'team'];
        let isValid = false;

        for (const member of domain.members) {
          // return early if the member is not an admin (irrelevant)
          if (member.group !== 'admin') continue;

          // if the user did not exist then return early
          if (!member.user || !member.user.id) {
            logger.fatal(
              new Error(`Member in ${domain.name} no longer exists`)
            );
            continue;
          }

          // use the new/latest plan passed in the `user` argument (as opposed to what exists)
          // (e.g. this method `ensureUserHasValidPlan` is called before saving a user's plan change)
          const memberPlan =
            member.user.id === ctx.state.user.id
              ? ctx.query.plan
              : member.user.plan;

          if (validPlans.includes(memberPlan)) {
            isValid = true;
            break;
          }
        }

        if (!isValid)
          errors.push(
            ctx.translateError(
              'DOMAIN_PLAN_UPGRADE_REQUIRED',
              domain.name,
              ctx.translate(domain.plan.toUpperCase())
            )
          );
      }

      if (errors.length > 0) {
        if (errors.length === 1) throw Boom.badRequest(errors[0].message);
        // TODO: translate stuff like this
        throw Boom.badRequest(`
          <p class="font-weight-bold text-danger">The following errors occurred:</p>
          <ul class="mb-0 text-left"><li>${errors
            .map((e) => e.message)
            .join('</li><li>')}</li><ul>
        `);
      }
    }

    // render a page where user can select from a dropdown how long they want to pay for
    if (
      // TODO: when user downgrades plans, e.g. to free or to e.p.
      //       then we need to cancel their existing subscription
      ctx.query.plan !== 'free' &&
      !isSANB(ctx.query.session_id) &&
      !isSANB(ctx.query.paypal_order_id) &&
      !isSANB(ctx.query.paypal_subscription_id) &&
      (isAccountUpgrade ||
        isMakePayment ||
        (ctx.query.plan === 'team' && ctx.state.user.plan !== 'team') ||
        (ctx.query.plan === 'enhanced_protection' &&
          !['team', 'enhanced_protection'].includes(ctx.state.user.plan)))
    ) {
      ctx.state.breadcrumbHeaderCentered = true;
      if (isAccountUpgrade) {
        ctx.state.breadcrumbs.pop();
        ctx.state.breadcrumbs.push({
          name: ctx.translate('UPGRADE'),
          header: ctx.translate('BILLING')
        });
      }

      return ctx.render('my-account/domains/billing');
    }

    // set/upgrade the user or domain's plan
    if (isAccountUpgrade) {
      ctx.state.user.plan = ctx.query.plan;
      await Domains.ensureUserHasValidPlan(ctx.state.user, ctx.locale);
    } else if (!isMakePayment) {
      domain.plan = ctx.query.plan;
    }

    //
    // stripe
    //
    // NOTE: we don't refund the user since we can catch errors as they happen
    //       and stripe doesn't refund transaction fees, so it's better to
    //       handle this manually since it's such a rare edge case rather than
    //       have an automated refund here if some error were to occur
    //
    if (isSANB(ctx.query.session_id)) {
      // if the querystring contained a Stripe checkout session ID then verify it and upgrade user
      const session = await stripe.checkout.sessions.retrieve(
        ctx.query.session_id
      );

      // validate session exists
      if (!session) throw ctx.translateError('UNKNOWN_ERROR');

      ctx.logger.info('stripe.checkout.sessions.retrieve', { session });

      // if payment status was not paid then throw an error
      if (session.payment_status !== 'paid')
        throw ctx.translateError('UNKNOWN_ERROR');

      // store customer
      ctx.state.user[config.userFields.stripeCustomerID] = session.customer;

      // if they upgraded their plan then store it on the user object
      if (!isMakePayment) ctx.state.user.plan = ctx.query.plan;

      // look at the line items
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      if (!Array.isArray(lineItems.data) || lineItems.data.length !== 1)
        throw ctx.translateError('UNKNOWN_ERROR');

      // look up the product associated with the line item
      // (it should match ctx.query.plan but this is a safeguard)
      const productToPlan = STRIPE_PRODUCTS[lineItems.data[0].price.product];

      if (
        !isSANB(productToPlan) ||
        !['team', 'enhanced_protection'].includes(productToPlan)
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      // if the plan doesn't match the querystring throw an error (safeguard)
      if (productToPlan !== ctx.query.plan)
        throw ctx.translateError('UNKNOWN_ERROR');

      // set planExpiresAt based off lineItems.data[0].price.id conversion to time
      const type =
        session.mode === 'subscription' ? 'subscription' : 'one-time';
      const mapping = STRIPE_MAPPING[ctx.query.plan][type];
      const key = _.keys(mapping).find(
        (key) =>
          STRIPE_MAPPING[ctx.query.plan][type][key] ===
          lineItems.data[0].price.id
      );
      if (!isSANB(key)) throw ctx.translateError('UNKNOWN_ERROR');

      const now = new Date();
      // if for whatever reason they never had a plan set at date then set one

      if (!_.isDate(ctx.state.user[config.userFields.planSetAt]))
        ctx.state.user[config.userFields.planSetAt] = now;

      // if they're just making a one time payment we want to simply add to their account
      if (isMakePayment) {
        // ensure there was an existing plan expiration, otherwise set one for safety
        if (!_.isDate(ctx.state.user[config.userFields.planExpiresAt]))
          ctx.state.user[config.userFields.planExpiresAt] = now;
        // now add to the plan expiration the length in time necessary
        ctx.state.user[config.userFields.planExpiresAt] = dayjs(
          ctx.state.user[config.userFields.planExpiresAt]
        )
          .add(ms(key), 'millisecond')
          .toDate();
      } else {
        // set planSetAt (since we're changing plans or making an upgrade/change to the plan)
        ctx.state.user[config.userFields.planSetAt] = now;
        // so now `key` looks like `"1m"` which we can use with `ms` to add duration to the plan
        ctx.state.user[config.userFields.planExpiresAt] = dayjs(
          ctx.state.user[config.userFields.planSetAt]
        )
          .add(ms(key), 'millisecond')
          .toDate();
      }

      let method = 'unknown';
      let expMonth;
      let expYear;
      let last4;

      if (session.mode === 'subscription') {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );
        if (!subscription) throw ctx.translateError('UNKNOWN_ERROR');
        // if user already has a subscription then switch them and cancel the old one
        if (isSANB(ctx.state.user[config.userFields.stripeSubscriptionID])) {
          try {
            await stripe.subscriptions.del(
              ctx.state.user[config.userFields.stripeSubscriptionID]
            );
          } catch (err) {
            ctx.logger.fatal(err);
            // email admins here
            try {
              await emailHelper({
                template: 'alert',
                message: {
                  to: config.email.message.from,
                  subject: `Error deleting Stripe subscription ID ${
                    ctx.state.user[config.userFields.stripeSubscriptionID]
                  } for ${ctx.state.user.email}`
                },
                locals: { message: err.message }
              });
            } catch (err) {
              ctx.logger.fatal(err);
            }
          }
        }

        // figure out what payment method they used and store it in the payment history
        // (so they can tell which card they used just from a simple glance at billing history)
        try {
          // note that we can use `subscription.default_payment_method` as the source for
          // the payment used on the subscription because this is a snapshot the moment it was created
          const paymentMethod = await stripe.paymentMethods.retrieve(
            subscription.default_payment_method
          );

          if (!paymentMethod) throw ctx.translateError('UNKNOWN_ERROR');

          ({
            brand: method,
            exp_month: expMonth,
            exp_year: expYear,
            last4
          } = paymentMethod.card);
        } catch (err) {
          ctx.logger.fatal(err);
          // email admins here
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: config.email.message.from,
                subject: `Error retrieving Stripe Payment Method ID ${subscription.default_payment_method} for ${ctx.state.user.email}`
              },
              locals: { message: err.message }
            });
          } catch (err) {
            ctx.logger.fatal(err);
          }
          //
          // NOTE: there is an automated job "check-unknown-payment-methods"
          //       which alerts us automatically about "unknown" methods
          //
        }

        // save the new subscription ID to their account (so they can 1-click cancel subscriptions)
        ctx.state.user[config.userFields.stripeSubscriptionID] =
          subscription.id;
      } else {
        let paymentIntent;
        try {
          paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent
          );
          if (!paymentIntent) throw ctx.translateError('UNKNOWN_ERROR');

          const paymentMethod = await stripe.paymentMethods.retrieve(
            paymentIntent.payment_method
          );
          if (!paymentMethod) throw ctx.translateError('UNKNOWN_ERROR');

          ({
            brand: method,
            exp_month: expMonth,
            exp_year: expYear,
            last4
          } = paymentMethod.card);
        } catch (err) {
          ctx.logger.fatal(err);
          // email admins here
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: config.email.message.from,
                subject: paymentIntent
                  ? `Error retrieving Stripe Payment Method ID ${paymentIntent.payment_method} for ${ctx.state.user.email}`
                  : `Stripe Payment Intent/Method Error for ${ctx.state.user.email}`
              },
              locals: { message: err.message }
            });
          } catch (err) {
            ctx.logger.fatal(err);
          }
          //
          // NOTE: there is an automated job "check-unknown-payment-methods"
          //       which alerts us automatically about "unknown" methods
          //
        }
      }

      // these all occur in parallel, but the only one we need to work is saving domain
      let [payment, user] = await Promise.all([
        Payments.create({
          user: ctx.state.user._id,
          reference: session.client_reference_id,
          amount: session.amount_total,
          method,
          exp_month: expMonth,
          exp_year: expYear,
          last4,
          stripe_session_id: session.id,
          duration: ms(key),
          plan: ctx.query.plan,
          kind: session.mode === 'subscription' ? 'subscription' : 'one-time'
        }),
        // try to save the customer info to the account
        ctx.state.user.save()
      ]);

      // log the payment just for sanity
      ctx.logger.info('payment created', { payment });

      // cancel the user's paypal subscription if they had one
      // and if the session.mode was equal to subscription
      if (
        session.mode === 'subscription' &&
        isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
      ) {
        try {
          const token = await promisify(paypal.generateToken)();
          await superagent
            .post(
              `${PAYPAL_ENDPOINT}/v1/billing/subscriptions/${
                ctx.state.user[config.userFields.paypalSubscriptionID]
              }/cancel`
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .timeout(ms('5s'));
          ctx.state.user[config.userFields.paypalSubscriptionID] = null;
          user = await ctx.state.user.save();
        } catch (err) {
          ctx.logger.fatal(err);
          // email admins here
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: config.email.message.from,
                subject: `Error deleting PayPal subscription ID ${
                  ctx.state.user[config.userFields.paypalSubscriptionID]
                } for ${ctx.state.user.email}`
              },
              locals: { message: err.message }
            });
          } catch (err) {
            ctx.logger.fatal(err);
          }
        }
      }

      // re-assign if needed
      ctx.state.user = user;
    }

    //
    // paypal (one-time payment)
    //
    if (isSANB(ctx.query.paypal_order_id)) {
      const order = await payPalClient.execute(
        new checkoutNodeJssdk.orders.OrdersGetRequest(ctx.query.paypal_order_id)
      );
      ctx.logger.info('OrdersGetRequest', { order });
      if (
        !_.isObject(order) ||
        !_.isObject(order.result) ||
        order.result.intent !== 'CAPTURE' ||
        order.result.status !== 'APPROVED' ||
        !_.isArray(order.result.purchase_units) ||
        _.isEmpty(order.result.purchase_units) ||
        !_.isObject(order.result.payer)
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      //
      // `order` object looks like this:
      //
      // console.log(JSON.stringify(order, null, 2));
      //
      /*
        {
          "statusCode": 200,
          "headers": {
            "cache-control": "max-age=0, no-cache, no-store, must-revalidate",
            "content-length": "1224",
            "content-type": "application/json",
            "date": "Mon, 16 Nov 2020 03:18:18 GMT",
            "paypal-debug-id": "c35e05401f88b",
            "connection": "close"
          },
          "result": {
            "id": "9YC624648R1052403",
            "intent": "CAPTURE",
            "status": "APPROVED",
            "purchase_units": [
              {
                "reference_id": "R58F7X",
                "amount": {
                  "currency_code": "USD",
                  "value": "108.00",
                  "breakdown": {
                    "item_total": {
                      "currency_code": "USD",
                      "value": "108.00"
                    }
                  }
                },
                "payee": {
                  "email_address": "niftylettuce-facilitator@gmail.com",
                  "merchant_id": "8CV4WN2C9QDA4",
                  "display_data": {
                    "brand_name": "Forward Email"
                  }
                },
                "description": "One-time payment for a year of the Team plan.",
                "custom_id": "TEAM",
                "soft_descriptor": "TEAM",
                "items": [
                  {
                    "name": "Team",
                    "unit_amount": {
                      "currency_code": "USD",
                      "value": "108.00"
                    },
                    "quantity": "1",
                    "description": "One-time payment for a year of the Team plan.",
                    "sku": "TEAM",
                    "category": "DIGITAL_GOODS"
                  }
                ]
              }
            ],
            "payer": {
              "name": {
                "given_name": "John",
                "surname": "Doe"
              },
              "email_address": "sb-ciwvw3496408@personal.example.com",
              "payer_id": "D9GQHN74A9CV8",
              "address": {
                "country_code": "US"
              }
            },
            "create_time": "2020-11-16T03:12:48Z",
            "links": [
              {
                "href": "https://api.sandbox.paypal.com/v2/checkout/orders/9YC624648R1052403",
                "rel": "self",
                "method": "GET"
              },
              {
                "href": "https://api.sandbox.paypal.com/v2/checkout/orders/9YC624648R1052403",
                "rel": "update",
                "method": "PATCH"
              },
              {
                "href": "https://api.sandbox.paypal.com/v2/checkout/orders/9YC624648R1052403/capture",
                "rel": "capture",
                "method": "POST"
              }
            ]
          }
        }
        */

      // store customer
      ctx.state.user[config.userFields.paypalPayerID] =
        order.result.payer.payer_id;

      // validate plans matched up
      if (
        !['team', 'enhanced_protection'].includes(
          order.result.purchase_units[0].custom_id.toLowerCase()
        ) ||
        order.result.purchase_units[0].custom_id.toLowerCase() !==
          ctx.query.plan
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      // if they upgraded their plan then store it on the user object
      if (!isMakePayment) ctx.state.user.plan = ctx.query.plan;

      // we will take the amount and divide it by the cost per the custom_id
      // in order to determine the duration the customer purchased/added
      const amount = Number(
        order.result.purchase_units[0].items[0].unit_amount.value
      );
      const months = Math.round(amount / (ctx.query.plan === 'team' ? 9 : 3));
      if (!_.isFinite(months) || months < 1)
        throw ctx.translateError('UNKNOWN_ERROR');

      let now = new Date(order.result.create_time);
      if (!_.isDate(now)) now = new Date();

      // if for whatever reason they never had a plan set at date then set one
      if (!_.isDate(ctx.state.user[config.userFields.planSetAt]))
        ctx.state.user[config.userFields.planSetAt] = now;

      // if they're just making a one time payment we want to simply add to their account
      if (isMakePayment) {
        // ensure there was an existing plan expiration, otherwise set one for safety
        if (!_.isDate(ctx.state.user[config.userFields.planExpiresAt]))
          ctx.state.user[config.userFields.planExpiresAt] = now;
        // now add to the plan expiration the length in time necessary
        ctx.state.user[config.userFields.planExpiresAt] = dayjs(
          ctx.state.user[config.userFields.planExpiresAt]
        )
          .add(months, 'month')
          .toDate();
      } else {
        // set planSetAt (since we're changing plans or making an upgrade/change to the plan)
        ctx.state.user[config.userFields.planSetAt] = now;
        ctx.state.user[config.userFields.planExpiresAt] = dayjs(
          ctx.state.user[config.userFields.planSetAt]
        )
          .add(months, 'month')
          .toDate();
      }

      // capture the user's payment (towards the end in case something else went wrong)
      const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(
        order.result.id
      );
      request.requestBody({}); // seems odd to have to do this
      const response = await payPalClient.execute(request);
      ctx.logger.info('OrdersCaptureRequest', {
        order,
        paypal_response: response
      });
      if (
        !_.isObject(response) ||
        !_.isObject(response.result) ||
        response.result.status !== 'COMPLETED'
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      // these all occur in parallel, but the only one we need to work is saving domain
      const [payment, user] = await Promise.all([
        Payments.create({
          user: ctx.state.user._id,
          reference: order.result.purchase_units[0].reference_id,
          amount: Number.parseInt(amount * 100, 10), // convert to cents for consistency with stripe
          method: 'paypal',
          duration: dayjs(now).add(months, 'month').diff(new Date()),
          plan: ctx.query.plan,
          kind: 'one-time',
          paypal_order_id: order.result.id
        }),
        // try to save the customer info to the account
        ctx.state.user.save()
      ]);

      // log the payment just for sanity
      ctx.logger.info('payment created', { payment });

      // re-assign if needed
      ctx.state.user = user;
    }

    // NOTE: handle lifetime payments for both stripe and paypal one-time payments

    //
    // paypal (subscription payment)
    //
    if (isSANB(ctx.query.paypal_subscription_id)) {
      // if user already has a subscription then switch them and cancel the old one
      if (isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])) {
        try {
          const token = await promisify(paypal.generateToken)();
          await superagent
            .post(
              `${PAYPAL_ENDPOINT}/v1/billing/subscriptions/${
                ctx.state.user[config.userFields.paypalSubscriptionID]
              }/cancel`
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .timeout(ms('5s'));
        } catch (err) {
          ctx.logger.fatal(err);
          // email admins here
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: config.email.message.from,
                subject: `Error deleting PayPal subscription ID ${
                  ctx.state.user[config.userFields.paypalSubscriptionID]
                } for ${ctx.state.user.email}`
              },
              locals: { message: err.message }
            });
          } catch (err) {
            ctx.logger.fatal(err);
          }
        }
      }

      const token = await promisify(paypal.generateToken)();
      const { body } = await superagent
        .get(
          `${PAYPAL_ENDPOINT}/v1/billing/subscriptions/${ctx.query.paypal_subscription_id}`
        )
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .timeout(ms('5s'));

      // validate subscription is active
      if (
        !_.isObject(body) ||
        body.status !== 'ACTIVE' ||
        !isSANB(body.id) ||
        !isSANB(body.plan_id) ||
        !_.isObject(body.subscriber) ||
        !isSANB(body.subscriber.payer_id) ||
        !_.isObject(body.billing_info) ||
        !_.isObject(body.billing_info.last_payment) ||
        !_.isObject(body.billing_info.last_payment.amount) ||
        !isSANB(body.billing_info.last_payment.amount.value)
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      // store customer
      ctx.state.user[config.userFields.paypalPayerID] =
        body.subscriber.payer_id;

      // save the new subscription ID to their account
      ctx.state.user[config.userFields.paypalSubscriptionID] = body.id;

      // validate plans matched up
      const mapping = PAYPAL_PLAN_MAPPING[ctx.query.plan];
      if (!_.isObject(mapping)) throw ctx.translateError('UNKNOWN_ERROR');
      let duration;
      for (const key of Object.keys(mapping)) {
        if (mapping[key] === body.plan_id) {
          duration = key;
          break;
        }
      }

      if (!duration) throw ctx.translateError('UNKNOWN_ERROR');

      // if they upgraded their plan then store it on the user object
      if (!isMakePayment) ctx.state.user.plan = ctx.query.plan;

      // parse the amount for later
      const amount = Number(body.billing_info.last_payment.amount.value);
      if (!_.isFinite(amount) || amount <= 0)
        throw ctx.translateError('UNKNOWN_ERROR');

      // get the date
      let now = new Date(body.create_time);
      if (!_.isDate(now)) now = new Date();

      // set planSetAt (since we're changing plans or making an upgrade/change to the plan)
      ctx.state.user[config.userFields.planSetAt] = now;
      // so now `key` looks like `"1m"` which we can use with `ms` to add duration to the plan
      ctx.state.user[config.userFields.planExpiresAt] = dayjs(
        ctx.state.user[config.userFields.planSetAt]
      )
        .add(ms(duration), 'millisecond')
        .toDate();

      // these all occur in parallel, but the only one we need to work is saving domain
      let [payment, user] = await Promise.all([
        Payments.create({
          user: ctx.state.user._id,
          // NOTE: no `reference` (?)
          amount: Number.parseInt(amount * 100, 10), // convert to cents for consistency with stripe
          method: 'paypal',
          duration: dayjs(now)
            .add(ms(duration), 'millisecond')
            .diff(new Date()),
          plan: ctx.query.plan,
          kind: 'subscription',
          paypal_subscription_id: body.id
        }),
        // try to save the customer info to the account
        ctx.state.user.save()
      ]);

      // cancel the user's stripe subscription if they had one
      if (isSANB(ctx.state.user[config.userFields.stripeSubscriptionID])) {
        try {
          await stripe.subscriptions.del(
            ctx.state.user[config.userFields.stripeSubscriptionID]
          );
          ctx.state.user[config.userFields.stripeSubscriptionID] = null;
          user = await ctx.state.user.save();
        } catch (err) {
          ctx.logger.fatal(err);
          // email admins here
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: config.email.message.from,
                subject: `Error deleting Stripe subscription ID ${
                  ctx.state.user[config.userFields.stripeSubscriptionID]
                } for ${ctx.state.user.email}`
              },
              locals: { message: err.message }
            });
          } catch (err) {
            ctx.logger.fatal(err);
          }
        }
      }

      // log the payment just for sanity
      ctx.logger.info('payment created', { payment });

      // re-assign if needed
      ctx.state.user = user;
    }

    // save the user or domain's new plan
    //
    // NOTE: we do a double save here on user object which we might not want
    //
    if (isAccountUpgrade || isMakePayment)
      ctx.state.user = await ctx.state.user.save();
    else ctx.state.domain = await domain.save();

    // if ctx.query.plan was free and it was an account billing change
    // then we know that we need to cancel any necessary subscriptions
    // BUT this must come after the user is saved (due to pre-validation hooks)
    // (we can optimize this later with a `validate()` method being invoked instead of `save()`)
    if (
      isAccountUpgrade &&
      ctx.query.plan === 'free' &&
      (isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) ||
        isSANB(ctx.state.user[config.userFields.paypalSubscriptionID]))
    ) {
      await Promise.all([
        // stripe
        isSANB(ctx.state.user[config.userFields.stripeSubscriptionID])
          ? (async () => {
              try {
                await stripe.subscriptions.del(
                  ctx.state.user[config.userFields.stripeSubscriptionID]
                );
                // set the current value to null
                ctx.state.user[config.userFields.stripeSubscriptionID] = null;
                // save the user again
                await ctx.state.user.save();
              } catch (err) {
                ctx.logger.fatal(err);
                // email admins here
                try {
                  await emailHelper({
                    template: 'alert',
                    message: {
                      to: config.email.message.from,
                      subject: `Error deleting Stripe subscription ID ${
                        ctx.state.user[config.userFields.stripeSubscriptionID]
                      } for ${ctx.state.user.email}`
                    },
                    locals: { message: err.message }
                  });
                } catch (err) {
                  ctx.logger.fatal(err);
                }
              }
            })()
          : Promise.resolve(),
        // paypal
        isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
          ? (async () => {
              try {
                const token = await promisify(paypal.generateToken)();
                await superagent
                  .post(
                    `${PAYPAL_ENDPOINT}/v1/billing/subscriptions/${
                      ctx.state.user[config.userFields.paypalSubscriptionID]
                    }/cancel`
                  )
                  .set('Content-Type', 'application/json')
                  .set('Authorization', token)
                  .timeout(ms('5s'));
              } catch (err) {
                ctx.logger.fatal(err);
                // email admins here
                try {
                  await emailHelper({
                    template: 'alert',
                    message: {
                      to: config.email.message.from,
                      subject: `Error deleting PayPal subscription ID ${
                        ctx.state.user[config.userFields.paypalSubscriptionID]
                      } for ${ctx.state.user.email}`
                    },
                    locals: { message: err.message }
                  });
                } catch (err) {
                  ctx.logger.fatal(err);
                }
              }
            })()
          : Promise.resolve()
      ]);
    }

    // flash message and redirect
    if (!ctx.api)
      ctx.flash(
        'success',
        isMakePayment
          ? ctx.translate('ONE_TIME_PAYMENT_SUCCESSFUL')
          : ctx.translate(`${ctx.query.plan.toUpperCase()}_PLAN`)
      );

    // pro-rated refund manual email if necessary based off:
    // `originalPlanExpiresAt` (if it was a valid date)
    // `originalPlan` (if it swapped between team <-> enhanced_protection
    // (do things that don't scale)
    if (
      isAccountUpgrade &&
      !isMakePayment &&
      _.isDate(originalPlanExpiresAt) &&
      ctx.query.plan !== originalPlan &&
      originalPlan !== 'free'
    ) {
      // get the total number of days that need pro-rated (if negative then none)
      // (note that we add one day as a buffer to ensure they get a full refund)
      const diff = dayjs(originalPlanExpiresAt).diff(new Date(), 'days') + 1;
      if (diff > 0) {
        const cost = originalPlan === 'team' ? 9 : 3;
        const amount = Number(accounting.toFixed((cost / 30) * diff, 2));
        const message = ctx.translate(
          'REFUND_PROCESSING',
          accounting.formatMoney(amount)
        );
        ctx.logger.info('refund', { diff, cost, amount, message });
        if (ctx.accepts('html')) ctx.flash('info', message);
        // email admins here (in the background)
        emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: 'A Customer Needs Refunded!'
          },
          locals: {
            message: `<p><strong>${ctx.state.user.email}</strong> just checked out with the "${ctx.query.plan}" plan and was on the "${originalPlan}" plan: ${message}`
          }
        })
          // eslint-disable-next-line promise/prefer-await-to-then
          .then(() => {})
          .catch((err) => {
            ctx.logger.fatal(err);
          });
      }
    }

    // email admins here (in the background)
    ctx.logger.info('checkout');
    emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'A Customer Just Checked Out!'
      },
      locals: {
        message: `<p><strong>${ctx.state.user.email}</strong> just checked out with the "${ctx.query.plan}" plan`
      }
    })
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(() => {})
      .catch((err) => {
        ctx.logger.fatal(err);
      });

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.fatal(err);

    // email admins here (in the background)
    emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: `An error occurred for ${ctx.state.user.email} on billing`
      },
      locals: {
        message: `<p><strong>URL:</strong> ${ctx.url}</p><p><strong>Error Message:</strong> ${err.message}</p>`
      }
    })
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(() => {})
      .catch((err) => {
        ctx.logger.fatal(err);
      });

    if (ctx.accepts('html')) {
      ctx.flash('error', err.message);
      return ctx.redirect(redirectTo);
    }

    ctx.throw(Boom.badRequest(err.message));
  }
}

// eslint-disable-next-line complexity
async function createDomainBilling(ctx) {
  try {
    //
    // validate form body
    //
    let {
      plan,
      payment_method: paymentMethod,
      payment_type: paymentType,
      payment_duration: paymentDuration
    } = ctx.request.body;

    const isMakePayment =
      ctx.pathWithoutLocale === '/my-account/billing/make-payment';

    if (isMakePayment && ctx.state.user.plan === 'free')
      throw ctx.translateError('INVALID_PLAN');

    if (isMakePayment) {
      paymentType = 'one-time';
      plan = ctx.state.user.plan;
    }

    // plan
    if (
      !isSANB(plan) ||
      !['free', 'enhanced_protection', 'team'].includes(plan)
    )
      throw ctx.translateError('INVALID_PLAN');

    // payment_method
    if (
      !isSANB(paymentMethod) ||
      !['credit_card', 'paypal'].includes(paymentMethod)
    )
      throw ctx.translateError('INVALID_PAYMENT_METHOD');

    // payment_type
    if (
      !isSANB(paymentType) ||
      !['one-time', 'subscription'].includes(paymentType)
    )
      throw ctx.translateError('INVALID_PAYMENT_TYPE');

    // payment_duration
    if (!isSANB(paymentDuration) || !PAYMENT_DURATIONS.has(paymentDuration))
      throw ctx.translateError('INVALID_PAYMENT_DURATION');

    // don't allow a user to have a subscription paymentType selected
    // with 2y, 3y, 4y, 5y, or lifetime selected (in other words if the mapping doesn't exist)
    let price;
    if (paymentMethod === 'credit_card')
      price = STRIPE_MAPPING[plan][paymentType][paymentDuration];
    else if (paymentMethod === 'paypal')
      price = PAYPAL_MAPPING[plan][paymentDuration];

    if (!isSANB(price) && !_.isFinite(price))
      throw ctx.translateError('INVALID_PAYMENT_DURATION');

    // One-time payment for 3 months of Team plan
    // Subscription payment for 1 year of Enhanced Protection plan
    const duration = dayjs()
      .add(ms(paymentDuration), 'millisecond')
      .fromNow(true);
    const description = striptags(
      ctx.translate(
        'PAYMENT_DESCRIPTION',
        _.capitalize(paymentType),
        duration,
        titleize(humanize(plan))
      )
    );

    let reference = await cryptoRandomString.async(config.referenceOptions);
    reference = reference.toUpperCase();

    //
    // stripe
    //
    if (paymentMethod === 'credit_card') {
      // if the user didn't have JavaScript enabled, then redirect them to Stripe page
      if (ctx.accepts('html')) throw ctx.translateError('JAVASCRIPT_REQUIRED');

      const options = {
        // TODO: add alipay and others
        payment_method_types: ['card'],
        mode: paymentType === 'one-time' ? 'payment' : 'subscription',
        ...(isSANB(ctx.state.user[config.userFields.stripeCustomerID])
          ? { customer: ctx.state.user[config.userFields.stripeCustomerID] }
          : { customer_email: ctx.state.user.email }),
        client_reference_id: reference,
        line_items: [
          {
            price,
            quantity: 1,
            description
          }
        ],
        cancel_url: `${config.urls.web}${ctx.path}${
          isMakePayment ? '' : `/?plan=${plan}`
        }`,
        success_url: `${config.urls.web}${ctx.path}/?${
          isMakePayment ? '' : `plan=${plan}&`
        }session_id={CHECKOUT_SESSION_ID}`
      };

      ctx.logger.info('stripe.checkout.sessions.create', { options });

      const session = await stripe.checkout.sessions.create(options);

      ctx.logger.info('stripe.checkout.sessions.create', { session });
      ctx.body = { sessionId: session.id };
      return;
    }

    if (paymentMethod === 'paypal') {
      // paypal
      const name = ctx.translate(plan.toUpperCase());

      // one-time
      // <https://developer.paypal.com/docs/checkout/reference/server-integration/capture-transaction/#on-the-server>
      if (paymentType === 'one-time') {
        // <https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction-authorize/#on-the-server>
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        // the SKU should look like a product SKU
        // (e.g. "ENHANCED-PROTECTION" vs. "ENHANCED_PROTECTION")
        const sku = slug(plan).toUpperCase();
        // prepare the request body
        const requestBody = {
          intent: 'CAPTURE',
          application_context: {
            cancel_url: `${config.urls.web}${ctx.path}${
              isMakePayment ? '' : `/?plan=${plan}`
            }`,
            return_url: `${config.urls.web}${ctx.path}/?plan=${plan}`,
            brand_name: 'Forward Email',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW'
          },
          payer: {
            email_address: ctx.state.user.email
          },
          purchase_units: [
            {
              reference_id: reference,
              description,
              custom_id: sku,
              soft_descriptor: sku,
              amount: {
                currency_code: 'USD',
                value: price,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: price
                  }
                }
              },
              items: [
                {
                  name,
                  description,
                  sku,
                  unit_amount: {
                    currency_code: 'USD',
                    value: price
                  },
                  quantity: 1,
                  category: 'DIGITAL_GOODS' // NOTE: missing "SERVICE" here
                }
              ]
            }
          ]
        };

        // NOTE: what is this nonsense
        request.prefer('return=representation');

        // NOTE: this API is so odd
        request.requestBody(requestBody);

        ctx.logger.info(
          'request.requestBody',
          JSON.stringify(requestBody, null, 2)
        );

        try {
          const order = await payPalClient.execute(request);
          ctx.logger.info('payPalClient.execute', { order });
          ctx.body = { orderID: order.result.id };
        } catch (err) {
          ctx.logger.error(err);
          try {
            // PayPal returns a stringifed JavaScript object in the response body
            // (so we should try to parse it using JSON.parse and then pull out the `message` property)
            // err.message = {"name":"INVALID_REQUEST","message":"Request is not well-formed, syntactically incorrect, or violates schema.","debug_id":"1d5686dcdfa41","details":[{"field":"/purchase_units/@reference_id=='WyA2Pn'/amount/value","value":"","location":"body","issue":"MISSING_REQUIRED_PARAMETER","description":"A required field / parameter is missing."},{"field":"/purchase_units/@reference_id=='WyA2Pn'/items/0/unit_amount/value","value":"","location":"body","issue":"MISSING_REQUIRED_PARAMETER","description":"A required field / parameter is missing."}],"links":[{"href":"https://developer.paypal.com/docs/api/orders/v2/#error-MISSING_REQUIRED_PARAMETER","rel":"information_link","encType":"application/json"}]}
            err.original_message = err.message;
            err.message = JSON.parse(err.message).message;
          } catch (err) {
            // if it wasn't a PayPal error
            ctx.logger.debug(err);
          }

          throw err;
        }

        return;
      }

      //
      // subscriptions (handled strictly on the client-side)
      //
      if (paymentType === 'subscription') {
        throw ctx.translateError('UNKNOWN_ERROR');
        /*
        // <https://github.com/paypal/PayPal-node-SDK/blob/621d8b448cf4c6ae375e8276b06d76be32191725/samples/subscription/billing_agreements/create.js#L138>
        const billingAgreement = await new Promise((resolve, reject) => {
          paypal.billingAgreement.create(
            {
              name,
              description,
              intent: 'SUBSCRIPTION',
              plan_id: 'P-94C73110FP343152JL6S4QHQ',
              // start time is current time + 1 minute
              start_time: new Date(Date.now() + 1000 * 60).toISOString(),
              subscriber: {
                name: {
                  given_name: 'Foo',
                  surname: 'Bar'
                },
                email_address: 'foo@example.com'
              },
              payer: {
                email_address: ctx.state.user.email
              },
              application_context: {
                brand_name: 'Forward Email',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'SUBSCRIBE_NOW',
                payment_method: {
                  payer_selected: 'PAYPAL',
                  payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
                },
                cancel_url: 'https://forwardemail.net/cancel',
                return_url: 'https://forwardemail.net/return'
              }
            },
            // {},
            (err, data) => {
              console.log(
                JSON.stringify(
                  {
                    err,
                    data
                  },
                  null,
                  2
                )
              );
              if (err) return reject(err);
              resolve(data);
            }
          );
        });
        console.log('billingAgreement', billingAgreement);
        for (const link of billingAgreement.links) {
          if (link.rel === 'approval_url') {
            console.log('link', link);
          }
        }

        throw new Error('test');
        */
      }

      return;
    }

    throw ctx.translateError('UNKNOWN_ERROR');
  } catch (err) {
    ctx.logger.error(err);

    if (ctx.accepts('html')) {
      ctx.flash('error', err.message);
      return ctx.redirect(
        ctx.state.domain
          ? ctx.state.l(`/my-account/domains/${ctx.state.domain.name}`)
          : ctx.state.l('/my-account/billing')
      );
    }

    ctx.throw(Boom.badRequest(err.message));
  }
}

async function retrieveReceipt(ctx) {
  try {
    if (!isSANB(ctx.params.reference))
      throw ctx.throw(
        Boom.badRequest(ctx.translateError('PAYMENT_REFERENCE_INVALID'))
      );

    const isPDF = ctx.params.reference.endsWith('.pdf');
    const isHTML = ctx.params.reference.endsWith('.html');
    const reference = ctx.params.reference
      .replace('.pdf', '')
      .replace('.html', '');

    ctx.state.payment = await Payments.findOne({
      reference: reference.toUpperCase(), // normalize
      user: ctx.state.user._id
    });

    if (!ctx.state.payment)
      throw ctx.throw(
        Boom.badRequest(ctx.translateError('PAYMENT_REFERENCE_INVALID'))
      );

    if (isPDF) {
      const html = pug.renderFile(
        path.join(config.views.root, 'my-account', 'billing', 'pdf.pug'),
        // make flash a noop so we don't interfere with messages/session
        { ...ctx.state, flash: () => {} }
      );
      ctx.body = wkhtmltopdf(html, {
        debug: config.env !== 'production',
        pageSize: 'letter',
        background: true,
        'image-dpi': 300,
        'print-media-type': false,
        'enable-javascript': true,
        'enable-internal-links': true
      });
      return;
    }

    if (isHTML) return ctx.render('my-account/billing/pdf');

    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs.pop();
    ctx.state.breadcrumbs.push({
      name: ctx.state.payment.reference,
      header: ctx.translate('RECEIPT')
    });

    return ctx.render('my-account/billing/receipt');
  } catch (err) {
    ctx.throw(err);
  }
}

async function retrieveBilling(ctx) {
  // check ctx.query.plan and prompt users to enter payment (before upgrading)
  // if user lands on page and they don't have payment entered and upgraded plan then prompt them and alert
  // render a billing history
  // prompt users for credit card
  ctx.state.payments = await Payments.find({ user: ctx.state.user._id })
    .sort('-created_at')
    .exec();
  // localize the descriptions
  ctx.state.payments = ctx.state.payments.map((payment) => {
    payment.locale = ctx.locale;
    return payment;
  });
  ctx.state.breadcrumbHeaderCentered = true;
  return ctx.render('my-account/billing');
}

async function cancelSubscription(ctx, next) {
  if (
    !isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) &&
    !isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
  )
    throw Boom.badRequest(ctx.translateError('SUBSCRIPTION_ALREADY_CANCELLED'));

  await Promise.all([
    isSANB(ctx.state.user[config.userFields.stripeSubscriptionID])
      ? stripe.subscriptions.del(
          ctx.state.user[config.userFields.stripeSubscriptionID]
        )
      : Promise.resolve(),
    isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
      ? (async () => {
          const token = await promisify(paypal.generateToken)();
          await superagent
            .post(
              `${PAYPAL_ENDPOINT}/v1/billing/subscriptions/${
                ctx.state.user[config.userFields.paypalSubscriptionID]
              }/cancel`
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .timeout(ms('5s'));
        })()
      : Promise.resolve()
  ]);

  ctx.state.user[config.userFields.stripeSubscriptionID] = null;
  ctx.state.user[config.userFields.paypalSubscriptionID] = null;

  await ctx.state.user.save();

  ctx.flash('success', ctx.translate('SUBSCRIPTION_CANCELLED'));

  return next();
}

function createAliasForm(ctx, next) {
  ctx.state.breadcrumbHeaderCentered = true;
  ctx.state.breadcrumbs = [
    'my-account',
    'domains',
    {
      name: ctx.state.t('Add Alias')
    }
  ];
  return next();
}

// eslint-disable-next-line complexity
async function importAliases(ctx) {
  if (ctx.state.domain.is_global)
    return ctx.throw(Boom.badRequest(ctx.translateError('IS_NOT_ADMIN')));

  let forwardingAddresses;
  let globalForwardingAddresses;
  let ignoredAddresses;
  let errors;
  try {
    ({
      forwardingAddresses,
      globalForwardingAddresses,
      ignoredAddresses,
      errors
    } = await Domains.getTxtAddresses(ctx.state.domain.name));
  } catch (err) {
    ctx.logger.error(err);
    if (err.code === 'ENOTFOUND')
      throw Boom.badRequest(ctx.translateError('ENOTFOUND'));
    if (err.code === 'ENODATA')
      throw Boom.badRequest(ctx.translateError('MISSING_DNS_TXT'));
    throw err;
  }

  //
  // NOTE: eventually rewrite this, it was a quick hack
  //
  const aliases = [];
  const catchAll = [];

  for (const element of ignoredAddresses) {
    const match = aliases.find((alias) => alias.name === element.name);
    const existing = ctx.state.domain.aliases.find(
      (alias) => alias.name === element.name
    );
    if (existing)
      errors.push(
        ctx.translate(
          'IMPORT_ALIAS_ALREADY_EXISTS',
          element.name,
          element.recipient
        )
      );
    else if (match) {
      if (element.recipient) match.recipients.push(element.recipient);
      else
        errors.push(
          ctx.translate('IMPORT_ALIAS_DISABLED_NOBODY', element.name)
        );
    } else {
      aliases.push({
        is_enabled: false,
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: element.name,
        recipients: [element.recipient]
      });
    }
  }

  for (const element of forwardingAddresses) {
    const match = aliases.find((alias) => alias.name === element.name);
    const existing = ctx.state.domain.aliases.find(
      (alias) => alias.name === element.name
    );
    if (existing)
      errors.push(
        ctx.translate(
          'IMPORT_ALIAS_ALREADY_EXISTS',
          element.name,
          element.recipient
        )
      );
    else if (match) match.recipients.push(element.recipient);
    else
      aliases.push({
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: element.name,
        recipients: [element.recipient]
      });
  }

  for (const element of globalForwardingAddresses) {
    // if it was a fqdn, ip, or email address then add global alias
    // otherwise throw an error that it was an invalid global
    if (isFQDN(element) || isIP(element) || isEmail(element)) {
      const match = aliases.find((alias) => alias.name === '*');
      const existing = ctx.state.domain.aliases.find(
        (alias) => alias.name === '*'
      );
      // try to add to existing catch-all record if it wasn't already there
      if (existing) {
        if (existing.recipients.includes(element))
          errors.push(
            ctx.translate('IMPORT_CATCHALL_ALREADY_INCLUDES', element)
          );
        else catchAll.push(element);
      } else if (match) match.recipients.push(element);
      else
        aliases.push({
          user: ctx.state.user._id,
          domain: ctx.state.domain._id,
          name: '*',
          recipients: [element]
        });
    } else {
      ctx.logger.error(
        new Error(`Invalid global forwarding address of ${element}`),
        { domain: ctx.state.domain }
      );
    }
  }

  const messages = [];

  if (aliases.length > 0)
    try {
      const array = await Aliases.create(
        aliases.map((alias) => ({
          ...alias,
          is_api: boolean(ctx.api),
          locale: ctx.locale
        }))
      );
      messages.push(ctx.translate('IMPORT_SUCCESSFUL', array.length));
    } catch (err) {
      messages.push(ctx.translate('IMPORT_ERROR'));
      ctx.logger.error(err);
      errors.push(err);
    }
  else messages.push(ctx.translate('IMPORT_NO_ALIASES_AVAILABLE'));

  if (catchAll.length > 0)
    try {
      const alias = await Aliases.findOne({
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: '*'
      });
      for (const recipient of catchAll) {
        alias.recipients.push(recipient);
      }

      alias.locale = ctx.locale;
      await alias.save();
      messages.push(
        ctx.translate('IMPORT_CATCHALL_SUCCESSFUL', catchAll.length)
      );
    } catch (err) {
      messages.push(ctx.translate('IMPORT_CATCHALL_ERROR'));
      ctx.logger.error(err);
      errors.push(err);
    }
  else messages.push(ctx.translate('IMPORT_CATCHALL_NONE'));

  errors = _.uniqBy(errors, 'message');

  const message =
    errors.length > 0
      ? `<p>${messages.join(
          ' '
        )}</p><p class="font-weight-bold text-danger">The following errors occurred:</p><ul class="mb-0 text-left"><li>${errors
          .map((err) => err.message)
          .join('</li><li>')}</li></ul>`
      : messages.join(' ');

  const redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  );

  if (ctx.accepts('html')) {
    if (!ctx.api) ctx.flash('info', message);
    ctx.redirect(redirectTo);
  } else {
    ctx.body = {
      message,
      redirectTo
    };
  }
}

function retrieveAliases(ctx, next) {
  // if there aren't any aliases yet
  // then prompt the user to create one and flash a message
  // otherwise take them to the next middleware
  if (ctx.api || ctx.state.domain.aliases.length > 0) {
    //
    // search functionality (with RegExp support)
    //
    if (isSANB(ctx.query.name))
      ctx.state.domain.aliases = ctx.state.domain.aliases.filter((alias) =>
        new RE2(_.escapeRegExp(ctx.query.name)).test(alias.name)
      );

    if (isSANB(ctx.query.recipient)) {
      const recipientRegex = new RE2(_.escapeRegExp(ctx.query.recipient));
      ctx.state.domain.aliases = ctx.state.domain.aliases.filter((alias) =>
        alias.recipients.some((recipient) => recipientRegex.test(recipient))
      );
    }

    return next();
  }

  ctx.flash('custom', {
    title: ctx.translate('ADD_ALIAS'),
    text: ctx.translate('NO_ALIASES_EXIST'),
    type: 'info',
    toast: true,
    showConfirmButton: false,
    timer: 5000,
    position: 'top'
  });
  ctx.redirect(`/my-account/domains/${ctx.state.domain.name}/aliases/new`);
}

async function retrieveInvite(ctx) {
  if (!isSANB(ctx.params.domain_id))
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  const domain = await Domains.findOne({
    id: ctx.params.domain_id,
    'invites.email': ctx.state.user.email
  });

  if (!domain)
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  // convert invitee to a member with the same group as invite had
  const invite = domain.invites.find(
    (invite) => invite.email === ctx.state.user.email
  );

  if (!invite)
    return ctx.throw(
      Boom.notFound(ctx.translateError('INVITE_DOES_NOT_EXIST'))
    );

  const { group } = invite;
  domain.members.push({
    user: ctx.state.user._id,
    group
  });

  // remove invitee from invites list
  domain.invites = domain.invites.filter(
    (invite) => invite.email !== ctx.state.user.email
  );

  // save domain
  domain.locale = ctx.locale;
  ctx.state.domain = await domain.save();

  // flash a message to the user telling them they've successfully accepted
  const message =
    group === 'admin'
      ? ctx.translate('INVITE_ACCEPTED_ADMIN')
      : ctx.translate('INVITE_ACCEPTED_USER');

  // edge case if it was an API request to simply send a string in the body
  if (ctx.api) {
    ctx.body = message;
    return;
  }

  ctx.flash('success', message);

  // redirect user to either alias page (if user) or admin page (if admin)
  const redirectTo =
    group === 'admin'
      ? ctx.state.l(`/my-account/domains/${ctx.state.domain.name}`)
      : ctx.state.l(`/my-account/domains/${ctx.state.domain.name}/aliases`);

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

async function createInvite(ctx, next) {
  // ctx.request.body.email
  // ctx.query.email
  const email = ctx.request.body.email || ctx.query.email;
  if (!isSANB(email) || !isEmail(email))
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_EMAIL')));

  // ctx.request.body.group
  if (
    !isSANB(ctx.request.body.group) ||
    !['admin', 'user'].includes(ctx.request.body.group)
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_GROUP')));

  // ensure invite does not already exist
  const invite = ctx.state.domain.invites.find(
    (invite) => invite.email.toLowerCase() === email.toLowerCase()
  );

  if (invite)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVITE_ALREADY_SENT'))
    );

  // ensure user is not already a member
  const user = await Users.findOne({ email }).lean().exec();
  if (user) {
    const member = ctx.state.domain.members.find(
      (member) => member.user.id === user.id
    );
    if (member)
      return ctx.throw(
        Boom.badRequest(ctx.translateError('USER_ALREADY_MEMBER'))
      );
  }

  // create the invite
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  ctx.state.domain.invites.push({
    email: email.toLowerCase(),
    group: ctx.request.body.group
  });
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain = await ctx.state.domain.save();

  // send an email
  try {
    await emailHelper({
      template: 'invite',
      message: {
        to: email.toLowerCase()
      },
      locals: {
        domain: { id: ctx.state.domain.id, name: ctx.state.domain.name }
      }
    });
  } catch (err) {
    if (!ctx.api) ctx.flash('error', ctx.translate('INVITE_EMAIL_ERROR'));
    ctx.logger.error(err);
  }

  if (ctx.api) return next();

  // send response
  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function removeInvite(ctx, next) {
  // ctx.request.body.email
  // ctx.query.email
  const email = ctx.request.body.email || ctx.query.email;
  if (!isSANB(email) || !isEmail(email))
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_EMAIL')));
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  // remove invite
  ctx.state.domain.invites = ctx.state.domain.invites.filter(
    (invite) => invite.email.toLowerCase() !== email.toLowerCase()
  );
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function updateMember(ctx, next) {
  // ctx.params.member_id
  if (!isSANB(ctx.params.member_id))
    return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

  // ctx.request.body.group
  if (
    !isSANB(ctx.request.body.group) ||
    !['admin', 'user'].includes(ctx.request.body.group)
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_GROUP')));

  const member = ctx.state.domain.members.find(
    (member) => member.user.id === ctx.params.member_id
  );

  if (!member)
    return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  // swap the user group based off ctx.request.body.group
  ctx.state.domain.members = ctx.state.domain.members.map((member) => ({
    ...member,
    group:
      member.user.toString() === ctx.params.member_id
        ? ctx.request.body.group
        : member.group
  }));

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function removeMember(ctx, next) {
  // ctx.params.member_id
  if (!isSANB(ctx.params.member_id))
    return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

  const member = ctx.state.domain.members.find(
    (member) => member.user && member.user.id === ctx.params.member_id
  );

  if (!member || !member.user)
    return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

  // ensure that no aliases created with this user being removed
  // (they need re-assigned first before the user can be removed)
  const memberAliases = ctx.state.domain.aliases.filter(
    (alias) => alias.user && alias.user.id === member.user.id
  );

  if (memberAliases.length > 0)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('ALIASES_NEED_REASSIGNED'))
    );

  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  ctx.state.domain.members = ctx.state.domain.members.filter(
    (member) => member.user.toString() !== ctx.params.member_id
  );
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

function ensureNotBanned(ctx, next) {
  if (ctx.state.user[config.userFields.isBanned])
    return ctx.throw(Boom.forbidden(ctx.translateError('ACCOUNT_BANNED')));
  return next();
}

async function recoveryKeys(ctx) {
  const otpRecoveryKeys = ctx.state.user[config.userFields.otpRecoveryKeys];

  ctx.attachment('recovery-keys.txt');
  ctx.body = otpRecoveryKeys.toString().replace(/,/g, '\n').replace(/"/g, '');
}

async function updateDomain(ctx, next) {
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);

  // Custom SMTP Port Forwarding
  if (isSANB(ctx.request.body.smtp_port)) {
    if (isPort(ctx.request.body.smtp_port))
      ctx.state.domain.smtp_port = ctx.request.body.smtp_port;
    else return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PORT')));
  } else {
    // Spam Scanner Settings
    ctx.state.domain.has_adult_content_protection = boolean(
      ctx.request.body.has_adult_content_protection
    );
    ctx.state.domain.has_phishing_protection = boolean(
      ctx.request.body.has_phishing_protection
    );
    ctx.state.domain.has_executable_protection = boolean(
      ctx.request.body.has_executable_protection
    );
    ctx.state.domain.has_virus_protection = boolean(
      ctx.request.body.has_virus_protection
    );
  }

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = {
  update,
  resetAPIToken,
  retrieveDomains,
  retrieveDomain,
  createDomain,
  remove,
  removeDomain,
  verifyRecords,
  ensureDomainAdmin,
  ensureAliasAdmin,
  validateAlias,
  createAlias,
  retrieveAlias,
  updateAlias,
  removeAlias,
  sortedDomains,
  ensureTeamPlan,
  ensureUpgradedPlan,
  retrieveBilling,
  createAliasForm,
  importAliases,
  retrieveAliases,
  retrieveInvite,
  createInvite,
  removeInvite,
  updateMember,
  removeMember,
  ensureNotBanned,
  recoveryKeys,
  updateDomain,
  retrieveDomainBilling,
  createDomainBilling,
  retrieveReceipt,
  cancelSubscription
};
