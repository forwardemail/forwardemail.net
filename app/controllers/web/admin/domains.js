const paginate = require('koa-ctx-paginate');

const { Domains } = require('../../../models');

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
      pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
    });

  // this will assign rendered html to ctx.body
  await ctx.render('admin/domains/_table', {
    domains,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
  });

  const table =
    itemCount === 0
      ? `<div class="alert alert-info">No domains exist for that keyword.</div>`
      : ctx.body;

  ctx.body = { table };
}

module.exports = {
  list
};
