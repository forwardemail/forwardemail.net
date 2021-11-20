const path = require('path');

const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const Meta = require('koa-meta');
const RE2 = require('re2');
const Stripe = require('stripe');
const _ = require('lodash');
const countryList = require('country-list');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const pify = require('pify');
const pug = require('pug');
const slug = require('speakingurl');
const splitLines = require('split-lines');
const striptags = require('striptags');
const webResourceInliner = require('web-resource-inliner');
const wkhtmltopdf = require('wkhtmltopdf');
const { boolean } = require('boolean');
const { isEmail, isIP, isPort } = require('validator');
const { parse } = require('node-html-parser');

const inline = pify(webResourceInliner.html);

const env = require('../../../config/env');
const config = require('../../../config');
const emailHelper = require('../../../helpers/email');
const { paypalAgent } = require('../../../helpers/paypal');
const logger = require('../../../helpers/logger');
const toObject = require('../../../helpers/to-object');
const { Users, Domains, Aliases, Payments } = require('../../models');

const {
  cancelEmailChange,
  createDomainBilling,
  listAliases,
  listBilling,
  verifyRecords,
  removeDomain,
  createDomain,
  remove,
  listDomains,
  manageBilling,
  retrieveDomain,
  resendEmailChange,
  retrieveDomains,
  resetAPIToken,
  retrieveBilling,
  retrieveDomainBilling,
  retrieveProfile,
  updateProfile
} = require('./my-account/index');

const meta = new Meta(config.meta, logger);

// country list with USA at the top
const USA = 'United States of America';
const countries = countryList.getNames().sort();
countries.splice(countries.indexOf(USA), 1);
countries.unshift(USA);

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

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
    if (isSANB(ctx.state.body.name) && ctx.state.body.name.includes('+'))
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
    (alias) =>
      alias.id === ctx.params.alias_id || alias.name === ctx.params.alias_id
  );
  if (!ctx.state.alias)
    return ctx.throw(Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST')));

  if (ctx.api) return next();
  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases/${ctx.state.alias.id}`
  ) {
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs.push(
      {
        name: ctx.state.t('Aliases'),
        href: ctx.state.l(
          `/my-account/domains/${ctx.state.domain.name}/aliases`
        )
      },
      {
        header: ctx.state.t('Edit Alias'),
        name: `${ctx.state.alias.name}@${ctx.state.domain.name}`
      }
    );
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

  const redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.state.domain.name}/billing?plan=enhanced_protection`
  );

  const swal = {
    title: ctx.translate('UPGRADE_PLAN'),
    html: ctx.translate('PLAN_UPGRADE_REQUIRED', redirectTo),
    type: 'warning'
  };

  if (ctx.api)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('PLAN_UPGRADE_REQUIRED', redirectTo))
    );

  if (ctx.method === 'GET' || ctx.accepts('html')) {
    if (!ctx.api) ctx.flash('custom', swal);
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  ctx.body = { swal };
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

      //
      // workaround because of these bugs with wkhtmltopdf and HTTPS
      //
      // <https://github.com/wkhtmltopdf/wkhtmltopdf/issues/4935>
      // <https://github.com/wkhtmltopdf/wkhtmltopdf/issues/4897>
      // <https://github.com/wkhtmltopdf/wkhtmltopdf/issues/4462>
      const inlinedHTML = await inline({
        fileContent: html,
        images: true,
        svgs: true,
        scripts: false,
        links: true,
        relativeTo: config.buildDir
      });
      ctx.body = wkhtmltopdf(inlinedHTML, {
        debug: config.env !== 'production',
        pageSize: 'letter',
        background: true,
        'image-dpi': 300,
        'print-media-type': false,
        'enable-javascript': false,
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
      ? paypalAgent.post(
          `/v1/billing/subscriptions/${
            ctx.state.user[config.userFields.paypalSubscriptionID]
          }/cancel`
        )
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
    } = await Domains.getTxtAddresses(
      ctx.state.domain.name,
      ctx.locale,
      false,
      ctx.client
    ));
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
        new RE2(_.escapeRegExp(ctx.query.name), 'gi').test(alias.name)
      );

    if (isSANB(ctx.query.recipient)) {
      const recipientRegex = new RE2(_.escapeRegExp(ctx.query.recipient, 'gi'));
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
  domain.skip_verification = true;
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
  ctx.state.domain.skip_verification = true;
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
  ctx.state.domain.skip_verification = true;
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
  ctx.state.domain.client = ctx.client;
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
  ctx.state.domain.client = ctx.client;
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
  ctx.state.domain.skip_verification = true;
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
  cancelEmailChange,
  cancelSubscription,
  createAlias,
  createAliasForm,
  createDomain,
  createDomainBilling,
  createInvite,
  ensureAliasAdmin,
  ensureDomainAdmin,
  ensureNotBanned,
  ensureTeamPlan,
  ensureUpgradedPlan,
  importAliases,
  listAliases,
  listBilling,
  listDomains,
  manageBilling,
  recoveryKeys,
  remove,
  removeAlias,
  removeDomain,
  removeInvite,
  removeMember,
  resendEmailChange,
  resetAPIToken,
  retrieveAlias,
  retrieveAliases,
  retrieveBilling,
  retrieveDomain,
  retrieveDomainBilling,
  retrieveDomains,
  retrieveInvite,
  retrieveProfile,
  retrieveReceipt,
  sortedDomains,
  updateAlias,
  updateDomain,
  updateMember,
  updateProfile,
  validateAlias,
  verifyRecords
};
