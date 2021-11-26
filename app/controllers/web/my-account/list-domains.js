const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const RE2 = require('re2');

async function listDomains(ctx) {
  let { domains } = ctx.state;

  // filter based on regex keyword
  if (ctx.query.q) {
    const qRegex = new RE2(_.escapeRegExp(ctx.query.q), 'gi');
    domains = domains.filter(
      (domain) =>
        qRegex.test(domain.name) ||
        domain.aliases.some(
          (alias) =>
            qRegex.test(alias.name) ||
            alias.recipients.some((recipient) => qRegex.test(recipient))
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

  const table = await ctx.render('my-account/domains/_table', {
    domains,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

module.exports = listDomains;
