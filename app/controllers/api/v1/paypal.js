const { promisify } = require('util');

const Boom = require('@hapi/boom');
const _ = require('lodash');

const env = require('#config/env');
const { paypal } = require('#helpers/paypal');

// <https://developer.paypal.com/docs/api-basics/notifications/webhooks/>
async function webhook(ctx) {
  try {
    const response = await promisify(
      paypal.notification.webhookEvent.verify,
      paypal.notification.webhookEvent
    )(ctx.request.headers, ctx.request.body, env.PAYPAL_WEBHOOK_ID);

    // throw an error if something was wrong
    if (!_.isObject(response) || response.verification_status !== 'SUCCESS')
      throw Boom.badRequest(ctx.translateError('INVALID_PAYPAL_SIGNATURE'));

    // NOTE: for now we just manually email admins of every event
    //       (and manual edits can be made as needed)

    // return a response to acknowledge receipt of the event
    ctx.body = { received: true };

    ctx.logger.info('paypal webhook', { response });

    /*
    // email admins here
    try {
      await email({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `PayPal Webhook ${dayjs().format('M/D/YY h:mm A')}`
        },
        locals: {
          message: `<pre><code>${JSON.stringify(
            response,
            null,
            2
          )}</code></pre>`
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
