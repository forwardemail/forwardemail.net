const Boom = require('@hapi/boom');
const paginate = require('koa-ctx-paginate');
const { boolean } = require('boolean');

const { Users } = require('../../../models');
const config = require('../../../../config');

const USER_SEARCH_PATHS = [
  'email',
  config.passport.fields.givenName,
  config.passport.fields.familyName
];

async function list(ctx) {
  let query = {};

  if (ctx.query.keyword) {
    query = { $or: [] };

    for (const field of USER_SEARCH_PATHS) {
      // only search fields that are strings
      if (Users.schema.paths[field].instance === 'String') {
        query.$or.push({ [field]: { $regex: ctx.query.keyword } });
      }
    }
  }

  const [users, itemCount] = await Promise.all([
    Users.find(query)
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .lean()
      .sort(ctx.query.sort || '-created_at')
      .exec(),
    Users.countDocuments(query)
  ]);

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  if (ctx.accepts('html'))
    return ctx.render('admin/users', {
      users,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
    });

  // this will assign rendered html to ctx.body
  await ctx.render('admin/users/_table', {
    users,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
  });

  const table =
    itemCount === 0
      ? `<div class="alert alert-info"> No users exist for that keyword. </div>`
      : ctx.body;

  ctx.body = { table };
}

async function retrieve(ctx) {
  ctx.state.result = await Users.findById(ctx.params.id);
  if (!ctx.state.result)
    throw Boom.notFound(ctx.translateError('INVALID_USER'));
  return ctx.render('admin/users/retrieve');
}

async function update(ctx) {
  const user = await Users.findById(ctx.params.id);
  if (!user) throw Boom.notFound(ctx.translateError('INVALID_USER'));
  const { body } = ctx.request;

  user[config.passport.fields.givenName] =
    body[config.passport.fields.givenName];
  user[config.passport.fields.familyName] =
    body[config.passport.fields.familyName];
  user[config.passport.fields.otpEnabled] =
    body[config.passport.fields.otpEnabled];
  user.email = body.email;
  user.group = body.group;

  if (boolean(!body[config.passport.fields.otpEnabled]))
    user[config.userFields.pendingRecovery] = false;

  await user.save();

  if (user.id === ctx.state.user.id) await ctx.login(user);

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

async function remove(ctx) {
  const user = await Users.findById(ctx.params.id);
  if (!user) throw Boom.notFound(ctx.translateError('INVALID_USER'));
  await user.remove();
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

async function login(ctx) {
  const user = await Users.findById(ctx.params.id);
  if (!user) throw Boom.notFound(ctx.translateError('INVALID_USER'));

  ctx.logout();

  await ctx.login(user);

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('/');
  else ctx.body = { redirectTo: '/' };
}

module.exports = { list, retrieve, update, remove, login };
