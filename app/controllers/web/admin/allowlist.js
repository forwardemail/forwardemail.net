/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const RE2 = require('re2');
const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const { isIP } = require('@forwardemail/validator');

const isEmail = require('#helpers/is-email');

async function list(ctx) {
  let results = await ctx.client.keys('allowlist:*');

  if (isSANB(ctx.query.key)) {
    const regex = new RE2(_.escapeRegExp(ctx.query.key), 'i');

    // go in reverse so we can mutate the array
    let i = results.length;
    while (i--) {
      if (!regex.test(results[i].replace('allowlist:', '')))
        results.splice(i, 1);
    }
  }

  if (isSANB(ctx.query.sort)) {
    if (ctx.query.sort === 'key' || ctx.query.sort === '-key')
      results = results.sort();
    if (ctx.query.sort === '-key') results = results.reverse();
  }

  const itemCount = results.length;
  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // slice for page
  results = results.slice(
    ctx.paginate.skip,
    ctx.query.limit + ctx.paginate.skip
  );

  if (ctx.accepts('html'))
    return ctx.render('admin/allowlist', {
      results,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('admin/allowlist/_table', {
    results,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function validate(ctx, next) {
  //
  // NOTE: values can be:
  //
  // "fqdn"
  // "email"
  // "ip"
  // "fqdn:email"
  // "ip:email"
  //
  if (!isSANB(ctx.request.body.value))
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_KEY_VALUE')));

  if (
    ctx.request.body.value
      .split(':')
      .some((val) => !isFQDN(val) && !isEmail(val) && !isIP(val))
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_KEY_VALUE')));

  return next();
}

async function create(ctx) {
  // store in the allowlist
  await ctx.client.set(
    `allowlist:${ctx.request.body.value.toLowerCase()}`,
    'true'
  );

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
  // remove it from the allowlist
  await ctx.client.del(`allowlist:${ctx.request.body.value.toLowerCase()}`);

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
  validate,
  create,
  remove
};
