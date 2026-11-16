/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const getStream = require('get-stream');
const isSANB = require('is-string-and-not-blank');

const { Payments } = require('#models');

async function retrieveReceipt(ctx) {
  if (!isSANB(ctx.params.reference))
    throw Boom.badRequest(ctx.translateError('PAYMENT_REFERENCE_INVALID'));

  const isPDF = ctx.params.reference.endsWith('.pdf');
  const isHTML = ctx.params.reference.endsWith('.html');
  const cleanReference = ctx.params.reference
    .replace('.pdf', '')
    .replace('.html', '');

  const index = cleanReference.lastIndexOf('-');
  const reference = (
    index === -1 ? cleanReference : cleanReference.slice(index + 1)
  ).toUpperCase();

  //
  // a reference an admin entered for an enterprise payment can have dashes
  // of its own (e.g. an invoice number, or one that starts with a date), so
  // the whole of it is looked up first, then without the date a PDF or HTML
  // receipt starts with, then as before (what follows the last dash)
  //
  for (const candidate of new Set([
    cleanReference.toUpperCase(),
    cleanReference.replace(/^\d{4}-\d{2}-\d{2}-/, '').toUpperCase(),
    reference
  ])) {
    ctx.state.payment = await Payments.findOne({
      reference: candidate,
      user: ctx.state.user._id
    });
    if (ctx.state.payment) break;
  }

  if (!ctx.state.payment)
    throw Boom.badRequest(ctx.translateError('PAYMENT_REFERENCE_INVALID'));

  const prefix = dayjs().format('YYYY-MM-DD');
  let actualReference = ctx.state.payment.reference;
  if (isPDF) actualReference = `${prefix}-${actualReference}.pdf`;
  else if (isHTML) actualReference = `${prefix}-${actualReference}.html`;

  if (ctx.params.reference !== actualReference) {
    ctx.status = 301;
    ctx.redirect(ctx.state.l(`/my-account/billing/${actualReference}`));
    return;
  }

  // localize the payment
  ctx.state.payment.locale = ctx.locale;

  if (isPDF || isHTML) {
    ctx.state.meta = {
      title: `${prefix}-${ctx.state.payment.reference}`,
      description: ctx.translate('RECEIPT')
    };
  }

  if (isPDF) {
    const stream = await Payments.getPDFReceipt(
      ctx.state.payment,
      ctx.state.user,
      ctx.locale
    );
    ctx.body = await getStream.buffer(stream);
    return;
  }

  if (isHTML) return ctx.render('my-account/billing/pdf');

  ctx.state.breadcrumbHeaderCentered = true;
  ctx.state.breadcrumbs.pop();
  ctx.state.breadcrumbs.push({
    name: ctx.state.payment.reference,
    header: ctx.translate('RECEIPT')
  });

  return ctx.render('my-account/billing/receipt');
}

module.exports = retrieveReceipt;
