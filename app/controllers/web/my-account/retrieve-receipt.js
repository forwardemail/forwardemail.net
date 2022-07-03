const path = require('path');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const pify = require('pify');
const pug = require('pug');
const webResourceInliner = require('web-resource-inliner');
const wkhtmltopdf = require('wkhtmltopdf');

const inline = pify(webResourceInliner.html);

const config = require('#config');
const { Payments } = require('#models');

async function retrieveReceipt(ctx) {
  try {
    if (!isSANB(ctx.params.reference))
      throw ctx.throw(
        Boom.badRequest(ctx.translateError('PAYMENT_REFERENCE_INVALID'))
      );

    const isPDF = ctx.params.reference.endsWith('.pdf');
    const isHTML = ctx.params.reference.endsWith('.html');
    const reference = ctx.params.reference
      .replace('.pdf', '')
      .replace('.html', '');

    ctx.state.payment = await Payments.findOne({
      reference: reference.toUpperCase(), // normalize
      user: ctx.state.user._id
    });

    if (!ctx.state.payment)
      throw ctx.throw(
        Boom.badRequest(ctx.translateError('PAYMENT_REFERENCE_INVALID'))
      );

    // localize the payment
    ctx.state.payment.locale = ctx.locale;

    if (isPDF) {
      const html = pug.renderFile(
        path.join(config.views.root, 'my-account', 'billing', 'pdf.pug'),
        // make flash a noop so we don't interfere with messages/session
        { ...ctx.state, flash() {} }
      );

      //
      // workaround because of these bugs with wkhtmltopdf and HTTPS
      //
      // <https://github.com/wkhtmltopdf/wkhtmltopdf/issues/4935>
      // <https://github.com/wkhtmltopdf/wkhtmltopdf/issues/4897>
      // <https://github.com/wkhtmltopdf/wkhtmltopdf/issues/4462>
      const inlinedHTML = await inline({
        fileContent: html,
        images: true,
        svgs: true,
        scripts: false,
        links: true,
        relativeTo: config.buildDir
      });
      ctx.body = wkhtmltopdf(inlinedHTML, {
        debug: config.env !== 'production',
        pageSize: 'letter',
        background: true,
        imageDpi: 300,
        printMediaType: false,
        enableJavaScript: false,
        disableJavascript: true,
        enableInternalLinks: false,
        disableInternalLinks: true
      });
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
