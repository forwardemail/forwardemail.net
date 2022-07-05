const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const RE2 = require('re2');

async function listAliases(ctx) {
  const { domain } = ctx.state;

  // filter based on regex keyword
  if (ctx.query.q) {
    const qRegex = new RE2(
      _.escapeRegExp(ctx.query.q) + '|' + ctx.query.q,
      'gi'
    );
    domain.aliases = domain.aliases.filter(
      (alias) =>
        qRegex.test(alias.name) ||
        qRegex.test(domain.name) ||
        qRegex.test(`${alias.name}@${domain.name}`) ||
        qRegex.test(alias.description) ||
        alias.labels.some((label) => qRegex.test(label)) ||
        alias.recipients.some((recipient) => qRegex.test(recipient))
    );
  }

  const itemCount = domain.aliases.length;

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  let sortFn;
  if (isSANB(ctx.query.sort))
    sortFn = (a) => a[ctx.query.sort.replace(/^-/, '')];

  domain.aliases = _.sortBy(domain.aliases, sortFn ? [sortFn] : ['name']);

  if (!sortFn || (isSANB(ctx.query.sort) && ctx.query.sort.startsWith('-')))
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
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('my-account/domains/aliases/_table', {
    domain,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

module.exports = listAliases;
