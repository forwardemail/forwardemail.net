const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');

const { Payments } = require('#models');

async function retrieveReceipt(ctx) {
  try {
    if (!isSANB(ctx.params.reference))
      throw ctx.throw(
        Boom.badRequest(ctx.translateError('PAYMENT_REFERENCE_INVALID'))
      );

    const isPDF = ctx.params.reference.endsWith('.pdf');
    const isHTML = ctx.params.reference.endsWith('.html');
    const cleanReference = ctx.params.reference
      .replace('.pdf', '')
      .replace('.html', '');

    const index = cleanReference.lastIndexOf('-');
    const reference = (
      index === -1 ? cleanReference : cleanReference.slice(index + 1)
    ).toUpperCase();

    ctx.state.payment = await Payments.findOne({
      reference,
      user: ctx.state.user._id
    });

    if (!ctx.state.payment)
      throw ctx.throw(
        Boom.badRequest(ctx.translateError('PAYMENT_REFERENCE_INVALID'))
      );

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
      ctx.body = await Payments.getPDFReceipt(
        ctx.state.payment,
        ctx.state.user,
        ctx.locale
      );
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
  } catch (err) {
    ctx.throw(err);
  }
}

module.exports = retrieveReceipt;
