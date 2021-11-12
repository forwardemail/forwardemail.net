const RE2 = require('re2');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');

async function listBilling(ctx) {
  let { payments } = ctx.state;

  // make sure dates are good
  // and if not remove them from query
  if (ctx.query.startDate) {
    ctx.query.startDate = dayjs(ctx.query.startDate, 'YYYY-MM-DD');
    if (!ctx.query.startDate.isValid()) {
      ctx.query.startDate = undefined;
      delete ctx.query.startDate;
    }
  }

  if (ctx.query.endDate) {
    ctx.query.endDate = dayjs(ctx.query.endDate, 'YYYY-MM-DD');
    if (!ctx.query.endDate.isValid()) {
      ctx.query.endDate = undefined;
      delete ctx.query.endDate;
    }
  }

  // filter based on regex keyword and/or dates
  if (ctx.query.keyword || ctx.query.startDate || ctx.query.endDate) {
    payments = payments.filter((payment) =>
      Object.entries(payment).some((property) => {
        const key = property[0];
        const prop = property[1];

        let isKeyword = false;
        let isDate = false;

        // check keyword
        if (ctx.query.keyword) {
          isKeyword =
            typeof prop === 'string'
              ? new RE2(_.escapeRegExp(ctx.query.keyword)).test(prop)
              : false;
        }

        // check dates
        if (key === 'created_at') {
          if (ctx.query.startDate && ctx.query.endDate) {
            isDate = dayjs(prop).isBetween(
              ctx.query.startDate,
              ctx.query.endDate,
              'day'
            );
          } else if (ctx.query.startDate && !ctx.query.endDate) {
            isDate = dayjs(prop).isSameOrAfter(ctx.query.startDate, 'day');
          } else if (!ctx.query.startDate && ctx.query.endDate) {
            isDate = dayjs(prop).isSameOrBefore(ctx.query.endDate, 'day');
          }
        }

        if (isKeyword || isDate) return true;

        return false;
      })
    );
  }

  const itemCount = payments.length;

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // sort payments
  let sortFn;
  if (new RE2('amount_formatted').test(ctx.query.sort))
    sortFn = (p) => p.amount_formatted.replace(/[^\d.]/, '');
  else if (isSANB(ctx.query.sort))
    sortFn = (p) => p[ctx.query.sort.replace(/^-/, '')];

  payments = _.sortBy(payments, sortFn ? [sortFn] : ['created_at']);

  if (ctx.query.sort?.startsWith('-') || !sortFn)
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
      pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
    });

  // this will assign rendered html to ctx.body
  await ctx.render('my-account/billing/_table', {
    payments,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page)
  });

  const table =
    itemCount === 0
      ? `<div class="alert alert-info"> No payments exist for that keyword or timeframe. </div>`
      : ctx.body;

  ctx.body = { table };
}

module.exports = listBilling;
