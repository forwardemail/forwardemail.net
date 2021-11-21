const Boom = require('@hapi/boom');
const paginate = require('koa-ctx-paginate');

const { Domains } = require('../../../models');

const OPTIONS_MAX_RECIPIENTS = [
  0, 10, 20, 30, 40, 50, 100, 150, 200, 250, 500, 750, 1000
];

async function list(ctx) {
  const query = {};

  // filter based on regex name
  if (ctx.query.keyword) query.name = { $regex: ctx.query.keyword };

  const [domains, itemCount] = await Promise.all([
    Domains.find(query)
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .sort(ctx.query.sort || '-created_at')
      .lean()
      .exec(),
    Domains.countDocuments(query)
  ]);

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  if (ctx.accepts('html'))
    return ctx.render('admin/domains', {
      domains,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page),
      OPTIONS_MAX_RECIPIENTS
    });

  // this will assign rendered html to ctx.body
  await ctx.render('admin/domains/_table', {
    domains,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page),
    OPTIONS_MAX_RECIPIENTS
  });

  const table =
    itemCount === 0
      ? `<div class="alert alert-info">No domains exist for that keyword.</div>`
      : ctx.body;

  ctx.body = { table };
}

async function update(ctx) {
  const domain = await Domains.findById(ctx.params.id);

  if (!domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));

  const { body } = ctx.request;

  // save max recipients or if null keep the same
  domain.max_recipients_per_alias =
    body.max_recipients_per_alias || domain.max_recipients_per_alias;

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

async function remove(ctx) {
  const domain = await Domains.findById(ctx.params.id);

  if (!domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));

  await domain.remove();
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
  list,
  remove,
  update
};
