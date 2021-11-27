const Boom = require('@hapi/boom');
const Stripe = require('stripe');
const isSANB = require('is-string-and-not-blank');
const _ = require('lodash');
const ms = require('ms');
const dayjs = require('dayjs-with-plugins');

const env = require('../../../../config/env');
const config = require('../../../../config');
const logger = require('../../../../helpers/logger');
const Users = require('../../../models/user');
const Payments = require('../../../models/payment');

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const { STRIPE_MAPPING, STRIPE_PRODUCTS } = config.payments;

// <https://stripe.com/docs/webhooks/signatures>
async function webhook(ctx) {
  try {
    const sig = ctx.request.get('stripe-signature');

    // throw an error if something was wrong
    if (!isSANB(sig))
      throw Boom.badRequest(ctx.translateError('INVALID_STRIPE_SIGNATURE'));

    const event = stripe.webhooks.constructEvent(
      ctx.request.rawBody,
      sig,
      env.STRIPE_ENDPOINT_SECRET
    );

    // throw an error if something was wrong
    if (!event)
      throw Boom.badRequest(ctx.translateError('INVALID_STRIPE_SIGNATURE'));

    // handle the event
    if (event.type === 'payment_intent.succeeded') {
      try {
        const paymentIntent = event.data.object;

        const customer = await Users.findOne({
          [config.userFields.stripeCustomerId]: paymentIntent.customer
        });

        // charges will usually just be an array of the successful charge,
        // but I think it may be possible a failed charge could be there as well
        // so we need to find the successful one for any payment details
        const stripeCharge = paymentIntent.charges.data.find(
          (charge) => charge.paid && charge.status === 'succeeded'
        );

        logger.info('charge:', stripeCharge?.id);

        let amount_refunded;
        if (stripeCharge.refunded) ({ amount_refunded } = stripeCharge);

        const hasInvoice = isSANB(paymentIntent.invoice);

        // one time payments have no invoice nor subscription
        const isOneTime = !hasInvoice;

        if (!stripeCharge)
          throw new Error('No successful stripe charge on payment intent.');

        // there should only ever be 1 checkout
        // session per successful payment intent
        const { data: checkoutSessions } = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id
        });

        if (checkoutSessions.length > 1)
          throw new Error('Found an unexpected # of checkout sessions');

        const [checkoutSession] = checkoutSessions;

        logger.info('checkoutSession', checkoutSession?.id);

        // invoices only on subscription payments
        let invoice;
        if (hasInvoice)
          invoice = await stripe.invoices.retrieve(paymentIntent.invoice);

        let productId;
        let priceId;
        if (_.isObject(invoice)) {
          logger.info('invoice', invoice.id);
          productId = invoice.lines.data[0].price.product;
          priceId = invoice.lines.data[0].price.id;
        } else {
          // for one-time payments we must retrieve the lines from the checkout session
          const lines = await stripe.checkout.sessions.listLineItems(
            checkoutSession?.id
          );
          productId = lines.data[0].price.product;
          priceId = lines.data[0].price.id;
        }

        logger.info('product', productId);
        logger.info('price', priceId);

        // this logic is the same in rerieve-domain-billing
        const plan = STRIPE_PRODUCTS[productId];
        const kind = isOneTime ? 'one-time' : 'subscription';
        const duration = ms(
          _.keys(STRIPE_MAPPING[plan][kind]).find(
            (key) => STRIPE_MAPPING[plan][kind][key] === priceId
          )
        );

        const now = dayjs.unix(paymentIntent.created).toDate();

        // is new plan
        let isNewPlan = false;
        if (customer[config.userFields.plan] !== plan) {
          customer[config.userFields.plan] = plan;
          isNewPlan = true;
        }

        // set planSetAt
        if (isNewPlan || !_.isDate(customer[config.userFields.planSetAt]))
          customer[config.userFields.planSetAt] = now;

        // ensure there was an existing plan expiration, otherwise set one for safety
        // now add to the plan expiration the length in time necessary
        customer[config.userFields.planExpiresAt] = dayjs(
          _.isDate(customer[config.userFields.planExpiresAt]) && !isNewPlan
            ? customer[config.userFields.planExpiresAt]
            : now
        )
          .add(duration, 'millisecond')
          .toDate();

        await customer.save();

        logger.info('creating new payment');

        await Payments.create({
          user: customer._id,
          plan,
          kind,
          duration,
          amount_refunded,
          amount: paymentIntent.amount,
          method: stripeCharge.payment_method_details.card.brand,
          exp_month: stripeCharge.payment_method_details.card.exp_month,
          exp_year: stripeCharge.payment_method_details.card.exp_year,
          last4: stripeCharge.payment_method_details.card.last4,
          stripe_sessions_id: checkoutSession?.id,
          stripe_payment_intent_id: paymentIntent.id,
          stripe_invoice_id: invoice?.id,
          stripe_subscription_id: invoice?.subscription
        });

        logger.info(
          `Successfully created new payment for stripe payment_intent ${paymentIntent.id}`
        );
      } catch {}
    }

    // NOTE: for now we just manually email admins of every event
    //       (and manual edits can be made as needed)

    // return a response to acknowledge receipt of the event
    ctx.body = { received: true };

    ctx.logger.info('stripe webhook', { event });

    // email admins here
    /*
    try {
      await email({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `Stripe Webhook: ${event.type}`
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
