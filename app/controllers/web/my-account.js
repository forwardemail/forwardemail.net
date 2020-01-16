const Boom = require('@hapi/boom');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const { isFQDN, isIP } = require('validator');

const config = require('../../../config');
const { Users, Domains } = require('../../models');

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

  ctx.state.domains = await Domains.find({
    'members.user': ctx.state.user._id
  })
    .populate('members.user', `id email ${config.passport.fields.displayName}`)
    .sort('name') // A-Z domains
    .lean()
    .exec();

  // populate a `group` on the domain based off the user's association
  ctx.state.domains = ctx.state.domains.map(domain => ({
    group: domain.members.find(member => member.user.id === ctx.state.user.id)
      .group,
    ...domain
  }));

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
  ctx.state.domain = ctx.state.domains.find(
    domain => domain.id === ctx.params.id
  );
  if (!ctx.state.domain)
    return ctx.throw(Boom.badRequest(ctx.translate('DOMAIN_DOES_NOT_EXIST')));
  ctx.state.breadcrumbs = [
    'my-account',
    {
      name: ctx.state.t('Domains'),
      header: ctx.state.domain.name,
      href: ctx.state.l('/my-account/domains')
    },
    { name: ctx.state.domain.name }
  ];
  return next();
}

async function createDomain(ctx, next) {
  if (!['GET', 'POST'].includes(ctx.method)) return next();

  if (ctx.method === 'GET') {
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

  const domain = await Domains.create({
    members: [{ user: ctx.state.user._id, group: 'admin' }],
    name: ctx.request.body.domain
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

  const redirectTo = ctx.state.l(`/my-account/domains/${domain.id}`);

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
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
  // ensure user is admin
  if (ctx.state.domain.group !== 'admin')
    return ctx.throw(Boom.badRequest(ctx.translate('IS_NOT_ADMIN')));
  // remove domain
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
  // ensure user is admin
  if (ctx.state.domain.group !== 'admin')
    return ctx.throw(Boom.badRequest(ctx.translate('IS_NOT_ADMIN')));

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
    ctx.throw(Boom.badRequest(err));
  }
}

module.exports = {
  update,
  resetAPIToken,
  retrieveDomains,
  retrieveDomain,
  createDomain,
  remove,
  removeDomain,
  verifyRecords
};
