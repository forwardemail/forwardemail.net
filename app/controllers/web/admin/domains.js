const Boom = require('@hapi/boom');
const _ = require('lodash');
const paginate = require('koa-ctx-paginate');

const { Domains } = require('#models');

async function list(ctx) {
  const query = {};

  // filter based on regex name
  if (ctx.query.name) {
    query.$or = [
      {
        name: { $regex: ctx.query.name, $options: 'i' }
      },
      {
        name: { $regex: _.escapeRegExp(ctx.query.name), $options: 'i' }
      }
    ];
  }

  const [domains, itemCount] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
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
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('admin/domains/_table', {
    domains,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

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
