const RE2 = require('re2');
const _ = require('lodash');
// const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');

const REGEX_AMOUNT_FORMATTED = new RE2('amount_formatted', 'i');

async function listBilling(ctx) {
  let { payments } = ctx.state;

  const itemCount = payments.length;
  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // sort payments
  let sortFn;
  if (REGEX_AMOUNT_FORMATTED.test(ctx.query.sort))
    sortFn = (p) => p.amount_formatted.replace(/[^\d.]/, '');
  else if (isSANB(ctx.query.sort))
    sortFn = (p) => p[ctx.query.sort.replace(/^-/, '')];

  payments = _.sortBy(payments, sortFn ? [sortFn] : ['invoice_at']);

  if (!sortFn || (isSANB(ctx.query.sort) && ctx.query.sort.startsWith('-')))
    payments = _.reverse(payments);

  // slice for page
  payments = payments.slice(
    ctx.paginate.skip,
    ctx.query.limit + ctx.paginate.skip
  );

  ctx.state.breadcrumbHeaderCentered = true;

  if (ctx.accepts('html'))
    return ctx.render('my-account/billing', {
      payments,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  // this will assign rendered html to ctx.body
  await ctx.render('my-account/billing/_table', {
    payments,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  const table =
    itemCount === 0
      ? '<div class="alert alert-info"> No payments exist for that keyword or timeframe. </div>'
      : ctx.body;

  ctx.body = { table };
}

module.exports = listBilling;
