const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const RE2 = require('re2');

async function listDomains(ctx) {
  let { domains } = ctx.state;

  // filter based on regex keyword
  if (ctx.query.q) {
    domains = domains.filter((domain) =>
      Object.values(domain).some((prop) =>
        typeof prop === 'string'
          ? new RE2(_.escapeRegExp(ctx.query.keyword), 'gi').test(prop)
          : false
      )
    );
  }

  const itemCount = domains.length;

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // sort domains
  let sortFn;
  if (new RE2('aliases', 'gi').test(ctx.query.sort))
    sortFn = (d) => d.aliases.length;
  else if (isSANB(ctx.query.sort))
    sortFn = (d) => d[ctx.query.sort.replace(/^-/, '')];

  domains = _.sortBy(domains, sortFn ? [sortFn] : ['is_global', 'name']);

  if (ctx.query.sort?.startsWith('-') || !sortFn) domains = _.reverse(domains);

  // slice for page
  domains = domains.slice(
    ctx.paginate.skip,
    ctx.query.limit + ctx.paginate.skip
  );

  if (ctx.accepts('html'))
    return ctx.render('my-account/domains', {
      domains,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
    });

  // this will assign rendered html to ctx.body
  await ctx.render('my-account/domains/_table', {
    domains,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
  });

  ctx.body = { table: ctx.body };
}

module.exports = listDomains;
