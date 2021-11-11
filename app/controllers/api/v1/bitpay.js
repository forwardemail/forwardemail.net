const Boom = require('@hapi/boom');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const { Client, Env, Tokens } = require('bitpay-sdk');

const env = require('../../../../config/env');

const bitpayTokens = Tokens;
bitpayTokens.merchant = env.BITPAY_MERCHANT_API_TOKEN;
const bitpayEnv = env.NODE_ENV === 'production' ? Env.Prod : Env.Test;
const bitpay = new Client(null, bitpayEnv, env.BITPAY_SECRET_KEY, bitpayTokens);

// <https://bitpay.com/api/#notifications-webhooks>
async function webhook(ctx) {
  try {
    const { body } = ctx.request;

    if (!isSANB(body.id))
      throw Boom.badRequest(ctx.translateError('INVALID_BITPAY_PAYMENT'));

    // eslint-disable-next-line new-cap
    const invoice = await bitpay.GetInvoice(body.id);

    if (!_.isObject(invoice) || invoice.exceptionStatus === 'paidPartial')
      throw Boom.badRequest(ctx.translateError('INVALID_BITPAY_PAYMENT'));

    // NOTE: for now we just manually email admins of every event
    //       (and manual edits can be made as needed)

    // return empty body
    ctx.body = {};

    ctx.logger.info('bitpay webhook', { invoice });

    // email admins here
    /*
    try {
      await email({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `BitPay Webhook: ${event.type}`
        },
        locals: {
          message: `<pre><code>${JSON.stringify(event, null, 2)}</code></pre>`
        }
      });
    } catch (err) {
      ctx.logger.fatal(err);
    }
    */
  } catch (err) {
    ctx.throw(err);
  }
}

module.exports = webhook;
