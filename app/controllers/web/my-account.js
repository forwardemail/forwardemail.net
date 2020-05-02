const Boom = require('@hapi/boom');
const _ = require('lodash');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const slug = require('speakingurl');
const striptags = require('striptags');
const { boolean } = require('boolean');
const { isEmail, isFQDN, isIP } = require('validator');

const config = require('../../../config');
const { Users, Domains, Aliases } = require('../../models');
const bull = require('../../../bull');

async function update(ctx) {
  const { body } = ctx.request;
  const hasSetPassword = ctx.state.user[config.userFields.hasSetPassword];

  const requiredFields = ['password', 'confirm_password'];

  if (hasSetPassword) requiredFields.push('old_password');

  if (body.change_password === 'true') {
    requiredFields.forEach(prop => {
      if (!isSANB(body[prop]))
        throw Boom.badRequest(
          ctx.translate('INVALID_STRING', ctx.request.t(humanize(prop)))
        );
    });

    if (body.password !== body.confirm_password)
      throw Boom.badRequest(ctx.translate('INVALID_PASSWORD_CONFIRM'));

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
    ctx.state.user.email = body.email;
  }

  await ctx.state.user.save();

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

async function resetAPIToken(ctx) {
  ctx.state.user[config.userFields.apiToken] = null;
  await ctx.state.user.save();

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
      is_global: true,
      has_mx_record: true,
      has_txt_record: true
    });

  ctx.state.domains = await Domains.find(query)
    .populate(
      'members.user',
      `id email ${config.passport.fields.displayName} is_banned`
    )
    .sort('is_global name') // A-Z domains
    .lean()
    .exec();

  ctx.state.domains = ctx.state.domains.map(domain => {
    domain.members = domain.members.filter(
      member => _.isObject(member.user) && !member.user.is_banned
    );
    return domain;
  });

  let domainAliases = await Aliases.find({
    domain: { $in: _.map(ctx.state.domains, '_id') }
  })
    .populate('domain', 'name')
    .populate(
      'user',
      `id email ${config.passport.fields.displayName} is_banned`
    )
    .sort('name')
    .lean()
    .exec();

  // TODO: delete aliases for users when they delete their accounts
  domainAliases = domainAliases.filter(
    alias => _.isObject(alias.user) && !alias.user.is_banned
  );

  const aliasesByDomain = _.groupBy(domainAliases, alias => alias.domain.name);

  ctx.state.domains = ctx.state.domains.map(domain => {
    // populate a `group` on the domain based off the user's association
    let member = domain.members.find(
      member => member.user.id === ctx.state.user.id
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
    let aliases =
      group === 'admin'
        ? aliasesByDomain[domain.name]
          ? aliasesByDomain[domain.name]
          : []
        : aliasesByDomain[domain.name]
        ? aliasesByDomain[domain.name].filter(
            alias => alias.user.id === ctx.state.user.id
          )
        : [];

    // for each alias set a virtual group helper
    // (if the user is an admin OR if the user is the owner of the alias)
    aliases = aliases.map(alias => ({
      ...alias,
      group:
        group === 'admin'
          ? 'admin'
          : alias.user.id === ctx.state.user.id
          ? 'admin'
          : 'user'
    }));

    // iterate over domain.members and add `alias_count` virtual property
    // which counts across the aliases for the given member's user id
    domain.members = domain.members.map(member => ({
      ...member,
      alias_count: aliasesByDomain[domain.name]
        ? aliasesByDomain[domain.name].filter(
            alias => alias.user.id === member.user.id
          ).length
        : 0
    }));

    return {
      ...domain,
      group,
      aliases
    };
  });

  if (
    ctx.state.domains.length === 0 &&
    ctx.method === 'GET' &&
    ['/my-account', '/my-account/domains'].includes(ctx.pathWithoutLocale)
  ) {
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
    return ctx.throw(Boom.badRequest(ctx.translate('DOMAIN_DOES_NOT_EXIST')));

  const id = isSANB(ctx.params.domain_id)
    ? ctx.params.domain_id
    : ctx.request.body.domain;

  ctx.state.domain = ctx.state.domains.find(domain => domain.id === id);

  // check if domain exists, and f it doesn't then check
  // if we have a pending invite
  if (!ctx.state.domain)
    return ctx.throw(Boom.badRequest(ctx.translate('DOMAIN_DOES_NOT_EXIST')));

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
          ? ctx.state.l(`/my-account/domains/${ctx.state.domain.id}`)
          : null
    }
  ];

  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.id}/aliases`
  )
    ctx.state.breadcrumbs.push('aliases');

  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.id}/aliases/new`
  ) {
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs.push({
      name: ctx.state.t('Aliases'),
      href: ctx.state.l(`/my-account/domains/${ctx.state.domain.id}/aliases`)
    });
    ctx.state.breadcrumbs.push({
      name: ctx.state.t('Add Alias')
    });
  }

  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.id}/billing`
  )
    ctx.state.breadcrumbs.push('billing');
  return next();
}

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
    return ctx.render('my-account/domains/new');
  }

  if (
    !isSANB(ctx.request.body.domain) ||
    (!isFQDN(ctx.request.body.domain) && !isIP(ctx.request.body.domain))
  )
    return ctx.throw(Boom.badRequest(ctx.translate('INVALID_DOMAIN')));

  const match = ctx.state.domains.find(
    domain => domain.name === ctx.request.body.domain
  );

  if (match)
    return ctx.throw(Boom.badRequest(ctx.translate('DOMAIN_ALREADY_EXISTS')));

  try {
    const domain = await Domains.create({
      members: [{ user: ctx.state.user._id, group: 'admin' }],
      name: ctx.request.body.domain,
      is_global:
        ctx.state.user.group === 'admin' && boolean(ctx.request.body.is_global)
    });

    // create a default alias for the user pointing to the admin
    await Aliases.create({
      user: ctx.state.user._id,
      domain: domain._id,
      name: '*',
      recipients: [ctx.state.user.email]
    });

    // TODO: flash messages logic in @ladjs/assets doesn't support both
    // custom and regular flash message yet
    if (ctx.request.body.domain.startsWith('www.')) {
      ctx.flash(
        'error',
        ctx.translate('WWW_WARNING').replace(/example.com/g, domain.name)
      );
    } else {
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

    let redirectTo = ctx.state.l(`/my-account/domains/${domain.id}`);

    if (
      isSANB(ctx.request.body.plan) &&
      ['free', 'enhanced_protection', 'team'].includes(ctx.request.body.plan)
    )
      redirectTo = ctx.state.l(
        `/my-account/domains/${domain.id}/billing?plan=${ctx.request.body.plan}`
      );

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
}

async function remove(ctx) {
  const adminDomains = ctx.state.domains.filter(
    domain => domain.group === 'admin'
  );
  if (adminDomains.length > 0)
    return ctx.throw(
      Boom.badRequest(ctx.translate('ACCOUNT_DELETE_HAS_DOMAINS'))
    );
  await Users.findByIdAndRemove(ctx.state.user._id);
  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('ACCOUNT_DELETE_SUCCESSFUL'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });
  const redirectTo = `/${ctx.locale}`;
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

async function removeDomain(ctx) {
  await Domains.findByIdAndRemove(ctx.state.domain._id);
  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });
  const redirectTo = ctx.state.l('/my-account/domains');
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

async function verifyRecords(ctx) {
  // check mx and txt
  try {
    await Domains.verifyRecords(ctx.state.domain._id);
    // if everything OK then success
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('DOMAIN_IS_VERIFIED'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.id}`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
}

function ensureDomainAdmin(ctx, next) {
  if (ctx.state.domain.group === 'admin') return next();
  ctx.throw(Boom.badRequest(ctx.translate('IS_NOT_ADMIN')));
}

function ensureAliasAdmin(ctx, next) {
  if (ctx.state.alias.group === 'admin') return next();
  ctx.throw(Boom.badRequest(ctx.translate('IS_NOT_ADMIN')));
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
          body.labels
            .split('\n')
            .join(' ')
            .split(',')
            .join(' ')
            .split(' '),
          label => slug(label)
        )
      )
    );
  else delete body.labels;

  body.is_enabled = boolean(body.is_enabled);

  if (isSANB(body.recipients))
    body.recipients = _.compact(
      _.uniq(
        _.map(
          body.recipients
            .split('\n')
            .join(' ')
            .split(',')
            .join(' ')
            .split(' '),
          recipient => recipient.toLowerCase().trim()
        )
      )
    );
  else delete body.recipients;

  ctx.state.body = body;

  return next();
}

async function createAlias(ctx) {
  try {
    await Aliases.create({
      ...ctx.state.body,
      user: ctx.state.user._id,
      domain: ctx.state.domain._id
    });
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
      `/my-account/domains/${ctx.state.domain.id}/aliases`
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
    return ctx.throw(Boom.badRequest(ctx.translate('ALIAS_DOES_NOT_EXIST')));
  ctx.state.alias = ctx.state.domain.aliases.find(
    alias => alias.id === ctx.params.alias_id
  );
  if (!ctx.state.alias)
    return ctx.throw(Boom.badRequest(ctx.translate('ALIAS_DOES_NOT_EXIST')));
  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.id}/aliases/${ctx.state.alias.id}`
  ) {
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs.push({
      name: ctx.state.t('Aliases'),
      href: ctx.state.l(`/my-account/domains/${ctx.state.domain.id}/aliases`)
    });
    ctx.state.breadcrumbs.push({
      header: ctx.state.t('Edit Alias'),
      name: `${ctx.state.alias.name}@${ctx.state.domain.name}`
    });
  }

  return next();
}

async function updateAlias(ctx) {
  let alias = await Aliases.findById(ctx.state.alias._id);
  alias = _.extend(alias, ctx.state.body);
  try {
    await alias.save();
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
      `/my-account/domains/${ctx.state.domain.id}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
}

async function removeAlias(ctx) {
  await Aliases.findByIdAndRemove(ctx.state.alias._id);
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
    `/my-account/domains/${ctx.state.domain.id}/aliases`
  );
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

function sortedDomains(ctx, next) {
  ctx.state.sortedDomains = _.clone(ctx.state.domains);
  ctx.state.sortedDomains = ctx.state.sortedDomains.filter(
    domain => !domain.is_global
  );
  if (
    isSANB(ctx.query.domain) &&
    (isFQDN(ctx.query.domain) || isIP(ctx.query.domain)) &&
    ctx.state.sortedDomains.find(domain => domain.name === ctx.query.domain)
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

function ensureUpgradedPlan(ctx, next) {
  if (ctx.state.domain.plan !== 'free') return next();
  ctx.flash('custom', {
    title: ctx.translate('UPGRADE_PLAN'),
    text: ctx.translate('PLAN_UPGRADE_REQUIRED'),
    type: 'warning'
  });
  const redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.state.domain.id}/billing?plan=enhanced_protection`
  );
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

async function retrieveBilling(ctx) {
  if (
    !isSANB(ctx.query.plan) ||
    !['free', 'enhanced_protection', 'team'].includes(ctx.query.plan)
  )
    return ctx.throw(Boom.badRequest(ctx.translate('INVALID_PLAN')));
  const domain = await Domains.findById(ctx.state.domain._id);
  domain.plan = ctx.query.plan;
  try {
    await domain.save();
    ctx.flash('success', ctx.translate(`${domain.plan.toUpperCase()}_PLAN`));
    if (domain.plan !== 'free')
      ctx.flash('warning', ctx.translate('BETA_PROGRAM'));
    const redirectTo = ctx.state.l('/my-account/domains/');
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
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

async function importAliases(ctx) {
  if (ctx.state.domain.is_global)
    return ctx.throw(Boom.badRequest(ctx.translate('IS_NOT_ADMIN')));

  let {
    forwardingAddresses,
    globalForwardingAddresses,
    ignoredAddresses,
    errors
  } = await Domains.getTxtAddresses(ctx.state.domain.name);

  //
  // NOTE: eventually rewrite this, it was a quick hack
  //
  const aliases = [];

  for (const element of ignoredAddresses) {
    const match = aliases.find(alias => alias.name === element.name);
    const existing = ctx.state.domain.aliases.find(
      alias => alias.name === element.name
    );
    if (existing)
      errors.push(
        new Error(
          `Could not import "${element.name}" record's recipient of "${element.recipient}" since it already exists as an alias.  Note that you may want to disable it since the imported TXT was disabled already.`
        )
      );
    else if (match) match.recipients.push(element.recipient);
    else
      aliases.push({
        is_enabled: false,
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: element.name,
        recipients: [element.recipient]
      });
  }

  for (const element of forwardingAddresses) {
    const match = aliases.find(alias => alias.name === element.name);
    const existing = ctx.state.domain.aliases.find(
      alias => alias.name === element.name
    );
    if (existing)
      errors.push(
        new Error(
          `Could not import "${element.name}" record's recipient of "${element.recipient}" since it already exists as an alias.`
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

  for (const element of globalForwardingAddresses.entries()) {
    const match = aliases.find(alias => alias.name === '*');
    const existing = ctx.state.domain.aliases.find(alias => alias.name === '*');
    if (existing)
      errors.push(
        new Error(
          `Could not import catch-all record's recipient of "${element}" since the catch-all already exists as an alias.`
        )
      );
    else if (match) match.recipients.push(element);
    else
      aliases.push({
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: '*',
        recipients: [element]
      });
  }

  let newAliases = [];
  try {
    if (aliases.length > 0) newAliases = await Aliases.create(aliases);
  } catch (err) {
    ctx.logger.error(err);
    errors.push(err);
  }

  let message =
    newAliases.length > 0
      ? `A total of (${newAliases.length}) aliases were imported successfully.`
      : 'No aliases were available for import.';

  errors = _.uniqBy(errors, 'message');

  if (errors.length > 0)
    message = `<p>${message}</p><p class="font-weight-bold text-danger">The following errors occurred:</p><ul class="mb-0 text-left"><li>${_.uniq(
      errors.map(err => err.message)
    ).join('</li><li>')}</li></ul>`;

  const redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.state.domain.id}/aliases`
  );

  if (ctx.accepts('html')) {
    ctx.flash('info', message);
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
  if (ctx.state.domain.aliases.length > 0) return next();
  ctx.flash('custom', {
    title: ctx.translate('ADD_ALIAS'),
    text: ctx.translate('NO_ALIASES_EXIST'),
    type: 'info',
    toast: true,
    showConfirmButton: false,
    timer: 5000,
    position: 'top'
  });
  ctx.redirect(`/my-account/domains/${ctx.state.domain.id}/aliases/new`);
}

async function retrieveInvite(ctx) {
  if (!isSANB(ctx.params.domain_id))
    return ctx.throw(Boom.badRequest(ctx.translate('DOMAIN_DOES_NOT_EXIST')));

  const domain = await Domains.findOne({
    id: ctx.params.domain_id,
    'invites.email': ctx.state.user.email
  });

  if (!domain)
    return ctx.throw(Boom.badRequest(ctx.translate('DOMAIN_DOES_NOT_EXIST')));

  // convert invitee to a member with the same group as invite had
  const invite = domain.invites.find(
    invite => invite.email === ctx.state.user.email
  );

  if (!invite)
    return ctx.throw(Boom.badRequest(ctx.translate('INVITE_DOES_NOT_EXIST')));

  const { group } = invite;
  domain.members.push({
    user: ctx.state.user._id,
    group
  });
  // remove invitee from invites list
  domain.invites = domain.invites.filter(
    invite => invite.email !== ctx.state.user.email
  );
  // save domain
  await domain.save();
  // redirect user to either alias page (if user) or admin page (if admin)
  const redirectTo =
    group === 'admin'
      ? ctx.state.l(`/my-account/domains/${domain.id}`)
      : ctx.state.l(`/my-account/domains/${domain.id}/aliases`);
  // flash a message to the user telling them they've successfully accepted
  if (group === 'admin')
    ctx.flash('success', ctx.translate('INVITE_ACCEPTED_ADMIN'));
  else ctx.flash('success', ctx.translate('INVITE_ACCEPTED_USER'));

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

async function createInvite(ctx) {
  // ctx.request.body.email
  if (!isSANB(ctx.request.body.email) || !isEmail(ctx.request.body.email))
    return ctx.throw(Boom.badRequest(ctx.translate('INVALID_EMAIL')));

  // ctx.request.body.group
  if (
    !isSANB(ctx.request.body.group) ||
    !['admin', 'user'].includes(ctx.request.body.group)
  )
    return ctx.throw(Boom.badRequest(ctx.translate('INVALID_GROUP')));

  // ensure invite does not already exist
  const invite = ctx.state.domain.invites.find(
    invite =>
      invite.email.toLowerCase() === ctx.request.body.email.toLowerCase()
  );

  if (invite)
    return ctx.throw(Boom.badRequest(ctx.translate('INVITE_ALREADY_SENT')));

  // create the invite
  const domain = await Domains.findById(ctx.state.domain._id);
  domain.invites.push({
    email: ctx.request.body.email,
    group: ctx.request.body.group
  });
  await domain.save();

  // send an email
  try {
    const job = await bull.add('email', {
      template: 'invite',
      message: {
        to: ctx.request.body.email
      },
      locals: {
        domain: { id: domain.id, name: domain.name }
      }
    });
    ctx.logger.info('added job', bull.getMeta({ job }));
  } catch (err) {
    ctx.flash('error', ctx.translate('INVITE_EMAIL_ERROR'));
    ctx.logger.error(err);
  }

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

async function removeInvite(ctx) {
  // ctx.request.body.email
  if (!isSANB(ctx.request.body.email) || !isEmail(ctx.request.body.email))
    return ctx.throw(Boom.badRequest(ctx.translate('INVALID_EMAIL')));
  const domain = await Domains.findById(ctx.state.domain._id);
  // remove invite
  domain.invites = domain.invites.filter(
    invite =>
      invite.email.toLowerCase() !== ctx.request.body.email.toLowerCase()
  );
  await domain.save();
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

async function updateMember(ctx) {
  // ctx.params.user_id
  if (!isSANB(ctx.params.user_id))
    return ctx.throw(Boom.badRequest(ctx.translate('INVALID_USER')));

  // ctx.request.body.group
  if (
    !isSANB(ctx.request.body.group) ||
    !['admin', 'user'].includes(ctx.request.body.group)
  )
    return ctx.throw(Boom.badRequest(ctx.translate('INVALID_GROUP')));

  const member = ctx.state.domain.members.find(
    member => member.user.id === ctx.params.user_id
  );

  if (!member) return ctx.throw(Boom.badRequest(ctx.translate('INVALID_USER')));

  const domain = await Domains.findById(ctx.state.domain._id);
  // swap the user group based off ctx.request.body.group
  domain.members = domain.members.map(member => ({
    ...member,
    group:
      member.user.toString() === ctx.params.user_id
        ? ctx.request.body.group
        : member.group
  }));

  await domain.save();
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

async function removeMember(ctx) {
  // ctx.params.user_id
  if (!isSANB(ctx.params.user_id))
    return ctx.throw(Boom.badRequest(ctx.translate('INVALID_USER')));

  const member = ctx.state.domain.members.find(
    member => member.user.id === ctx.params.user_id
  );

  if (!member) return ctx.throw(Boom.badRequest(ctx.translate('INVALID_USER')));

  /*
  // cannot remove self
  if (member.user.id === ctx.state.user.id)
    return ctx.throw(Boom.badRequest(ctx.translate('INVALID_USER')));
  */

  const domain = await Domains.findById(ctx.state.domain._id);
  domain.members = domain.members.filter(
    member => member.user.toString() !== ctx.params.user_id
  );
  await domain.save();
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
  if (ctx.state.user.is_banned)
    return ctx.throw(Boom.forbidden(ctx.translate('ACCOUNT_BANNED')));
  return next();
}

async function recoveryKeys(ctx) {
  const otpRecoveryKeys = ctx.state.user[config.userFields.otpRecoveryKeys];

  ctx.attachment('recovery-keys.txt');
  ctx.body = otpRecoveryKeys
    .toString()
    .replace(/,/g, '\n')
    .replace(/"/g, '');
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
  recoveryKeys
};
