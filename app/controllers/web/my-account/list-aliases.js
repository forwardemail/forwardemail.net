const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const RE2 = require('re2');

async function listAliases(ctx) {
  const { domain } = ctx.state;

  // filter based on regex keyword
  if (ctx.query.keyword) {
    domain.aliases = domain.aliases.filter((alias) =>
      Object.values(alias).some((prop) =>
        typeof prop === 'string'
          ? new RE2(_.escapeRegExp(ctx.query.keyword), 'gi').test(prop)
          : false
      )
    );
  }

  const itemCount = domain.aliases.length;

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  let sortFn;
  if (isSANB(ctx.query.sort))
    sortFn = (a) => a[ctx.query.sort.replace(/^-/, '')];

  domain.aliases = _.sortBy(domain.aliases, sortFn ? [sortFn] : ['name']);

  if (ctx.query.sort?.startsWith('-') || !sortFn)
    domain.aliases = _.reverse(domain.aliases);

  // slice for page
  domain.aliases = domain.aliases.slice(
    ctx.paginate.skip,
    ctx.query.limit + ctx.paginate.skip
  );

  if (ctx.accepts('html'))
    return ctx.render('my-account/domains/aliases', {
      domain,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
    });

  // this will assign rendered html to ctx.body
  await ctx.render('my-account/domains/aliases/_table', {
    domain,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
  });

  const table =
    itemCount === 0
      ? `<div class="alert alert-info"> No aliases exist for that keyword. </div>`
      : ctx.body;

  ctx.body = { table };
}

module.exports = listAliases;
