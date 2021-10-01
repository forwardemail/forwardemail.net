const Boom = require('@hapi/boom');
const _ = require('lodash');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const cryptoRandomString = require('crypto-random-string');
const humanize = require('humanize-string');
const titleize = require('titleize');
const Stripe = require('stripe');
const slug = require('speakingurl');
const striptags = require('striptags');

const env = require('../../../../config/env');
const config = require('../../../../config');

const payPalClient = new checkoutNodeJssdk.core.PayPalHttpClient(
  new checkoutNodeJssdk.core[
    env.NODE_ENV === 'production' ? 'LiveEnvironment' : 'SandboxEnvironment'
  ](env.PAYPAL_CLIENT_ID, env.PAYPAL_SECRET)
);

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const isTest =
  !env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY.startsWith('sk_test');

const PAYMENT_DURATIONS = new Set([
  '30d',
  '60d',
  '90d',
  '180d',
  '1y',
  '2y',
  '3y'
]);

const STRIPE_MAPPING = {
  enhanced_protection: {
    'one-time': {
      '30d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXyLFuf8FuIPJrPzAy9y7',
      '60d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJOZ53q1Pa',
      '90d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJt1actni9',
      '180d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJakedaHaz',
      '1y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJ3X8FfkRn',
      '2y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLY0LFuf8FuIPJFKeUg5kf',
      '3y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLY0LFuf8FuIPJkavB2UyM'
      // lifetime: isTest
      //   ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
      //   : 'price_1HbLd4LFuf8FuIPJwB3WwfaE'
    },
    subscription: {
      '30d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLglLFuf8FuIPJDmpFggVW',
      '60d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLh0LFuf8FuIPJD4lYB3Jz',
      '90d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLhFLFuf8FuIPJBPD5hScR',
      '180d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLhaLFuf8FuIPJ2eUbPZfI',
      '1y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLi4LFuf8FuIPJTSsQAit3'
    }
  },
  team: {
    'one-time': {
      '30d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2ypLFuf8FuIPJFo5Q9L3E',
      '60d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2ypLFuf8FuIPJxLg7dYmV',
      '90d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJlvIwyhNT',
      '180d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJ00A3zNFB',
      '1y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJENDdnNWs',
      '2y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJ8LSXjG48',
      '3y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJSaHAcuOv'
      // lifetime: isTest
      //   ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
      //   : 'price_1Hc2yqLFuf8FuIPJteXh3Z2D'
    },
    subscription: {
      '30d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJa44UB4fa',
      '60d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yrLFuf8FuIPJ33ffzO71',
      '90d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJ3ev702mN',
      '180d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJvNJJswbG',
      '1y': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJYbtNstWT'
    }
  }
};

const PAYPAL_MAPPING = {
  enhanced_protection: {
    '30d': 3,
    '60d': 6,
    '90d': 9,
    '180d': 18,
    '1y': 36,
    '2y': 72,
    '3y': 108
    // lifetime: 144
  },
  team: {
    '30d': 9,
    '60d': 18,
    '90d': 27,
    '180d': 54,
    '1y': 108,
    '2y': 216,
    '3y': 324
    // lifetime: 432
  }
};

// eslint-disable-next-line complexity
async function createDomainBilling(ctx) {
  try {
    //
    // validate form body
    //
    let {
      plan,
      payment_method: paymentMethod,
      payment_type: paymentType,
      payment_duration: paymentDuration
    } = ctx.request.body;

    const isMakePayment =
      ctx.pathWithoutLocale === '/my-account/billing/make-payment';

    if (isMakePayment && ctx.state.user.plan === 'free')
      throw ctx.translateError('INVALID_PLAN');

    if (isMakePayment) {
      paymentType = 'one-time';
      plan = ctx.state.user.plan;
    }

    // plan
    if (
      !isSANB(plan) ||
      !['free', 'enhanced_protection', 'team'].includes(plan)
    )
      throw ctx.translateError('INVALID_PLAN');

    // payment_method
    if (
      !isSANB(paymentMethod) ||
      !['credit_card', 'paypal'].includes(paymentMethod)
    )
      throw ctx.translateError('INVALID_PAYMENT_METHOD');

    // payment_type
    if (
      !isSANB(paymentType) ||
      !['one-time', 'subscription'].includes(paymentType)
    )
      throw ctx.translateError('INVALID_PAYMENT_TYPE');

    // payment_duration
    if (!isSANB(paymentDuration) || !PAYMENT_DURATIONS.has(paymentDuration))
      throw ctx.translateError('INVALID_PAYMENT_DURATION');

    // don't allow a user to have a subscription paymentType selected
    // with 2y, 3y, 4y, 5y, or lifetime selected (in other words if the mapping doesn't exist)
    let price;
    if (paymentMethod === 'credit_card')
      price = STRIPE_MAPPING[plan][paymentType][paymentDuration];
    else if (paymentMethod === 'paypal')
      price = PAYPAL_MAPPING[plan][paymentDuration];

    if (!isSANB(price) && !_.isFinite(price))
      throw ctx.translateError('INVALID_PAYMENT_DURATION');

    // One-time payment for 3 months of Team plan
    // Subscription payment for 1 year of Enhanced Protection plan
    const duration = dayjs()
      .add(ms(paymentDuration), 'millisecond')
      .fromNow(true);
    const description = striptags(
      ctx.translate(
        'PAYMENT_DESCRIPTION',
        _.capitalize(paymentType),
        duration,
        titleize(humanize(plan))
      )
    );

    let reference = await cryptoRandomString.async(config.referenceOptions);
    reference = reference.toUpperCase();

    //
    // stripe
    //
    if (paymentMethod === 'credit_card') {
      // if the user didn't have JavaScript enabled, then redirect them to Stripe page
      if (ctx.accepts('html')) throw ctx.translateError('JAVASCRIPT_REQUIRED');

      const options = {
        // TODO: add alipay and others
        payment_method_types: ['card'],
        mode: paymentType === 'one-time' ? 'payment' : 'subscription',
        ...(isSANB(ctx.state.user[config.userFields.stripeCustomerID])
          ? { customer: ctx.state.user[config.userFields.stripeCustomerID] }
          : { customer_email: ctx.state.user.email }),
        client_reference_id: reference,
        line_items: [
          {
            price,
            quantity: 1,
            description
          }
        ],
        cancel_url: `${config.urls.web}${ctx.path}${
          isMakePayment ? '' : `/?plan=${plan}`
        }`,
        success_url: `${config.urls.web}${ctx.path}/?${
          isMakePayment ? '' : `plan=${plan}&`
        }session_id={CHECKOUT_SESSION_ID}`
      };

      ctx.logger.info('stripe.checkout.sessions.create', { options });

      const session = await stripe.checkout.sessions.create(options);

      ctx.logger.info('stripe.checkout.sessions.create', { session });
      ctx.body = { sessionId: session.id };
      return;
    }

    if (paymentMethod === 'paypal') {
      // paypal
      const name = ctx.translate(plan.toUpperCase());

      // one-time
      // <https://developer.paypal.com/docs/checkout/reference/server-integration/capture-transaction/#on-the-server>
      if (paymentType === 'one-time') {
        // <https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction-authorize/#on-the-server>
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        // the SKU should look like a product SKU
        // (e.g. "ENHANCED-PROTECTION" vs. "ENHANCED_PROTECTION")
        const sku = slug(plan).toUpperCase();
        // prepare the request body
        const requestBody = {
          intent: 'CAPTURE',
          application_context: {
            cancel_url: `${config.urls.web}${ctx.path}${
              isMakePayment ? '' : `/?plan=${plan}`
            }`,
            return_url: `${config.urls.web}${ctx.path}/?plan=${plan}`,
            brand_name: 'Forward Email',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW'
          },
          payer: {
            email_address: ctx.state.user.email
          },
          purchase_units: [
            {
              reference_id: reference,
              description,
              custom_id: sku,
              soft_descriptor: sku,
              amount: {
                currency_code: 'USD',
                value: price,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: price
                  }
                }
              },
              items: [
                {
                  name,
                  description,
                  sku,
                  unit_amount: {
                    currency_code: 'USD',
                    value: price
                  },
                  quantity: 1,
                  category: 'DIGITAL_GOODS' // NOTE: missing "SERVICE" here
                }
              ]
            }
          ]
        };

        // NOTE: what is this nonsense
        request.prefer('return=representation');

        // NOTE: this API is so odd
        request.requestBody(requestBody);

        ctx.logger.info(
          'request.requestBody',
          JSON.stringify(requestBody, null, 2)
        );

        try {
          const order = await payPalClient.execute(request);
          ctx.logger.info('payPalClient.execute', { order });
          ctx.body = { orderID: order.result.id };
        } catch (err) {
          ctx.logger.error(err);
          try {
            // PayPal returns a stringifed JavaScript object in the response body
            // (so we should try to parse it using JSON.parse and then pull out the `message` property)
            // err.message = {"name":"INVALID_REQUEST","message":"Request is not well-formed, syntactically incorrect, or violates schema.","debug_id":"1d5686dcdfa41","details":[{"field":"/purchase_units/@reference_id=='WyA2Pn'/amount/value","value":"","location":"body","issue":"MISSING_REQUIRED_PARAMETER","description":"A required field / parameter is missing."},{"field":"/purchase_units/@reference_id=='WyA2Pn'/items/0/unit_amount/value","value":"","location":"body","issue":"MISSING_REQUIRED_PARAMETER","description":"A required field / parameter is missing."}],"links":[{"href":"https://developer.paypal.com/docs/api/orders/v2/#error-MISSING_REQUIRED_PARAMETER","rel":"information_link","encType":"application/json"}]}
            err.original_message = err.message;
            err.message = JSON.parse(err.message).message;
          } catch (err) {
            // if it wasn't a PayPal error
            ctx.logger.debug(err);
          }

          throw err;
        }

        return;
      }

      //
      // subscriptions (handled strictly on the client-side)
      //
      if (paymentType === 'subscription') {
        throw ctx.translateError('UNKNOWN_ERROR');
        /*
        // <https://github.com/paypal/PayPal-node-SDK/blob/621d8b448cf4c6ae375e8276b06d76be32191725/samples/subscription/billing_agreements/create.js#L138>
        const billingAgreement = await new Promise((resolve, reject) => {
          paypal.billingAgreement.create(
            {
              name,
              description,
              intent: 'SUBSCRIPTION',
              plan_id: 'P-94C73110FP343152JL6S4QHQ',
              // start time is current time + 1 minute
              start_time: new Date(Date.now() + 1000 * 60).toISOString(),
              subscriber: {
                name: {
                  given_name: 'Foo',
                  surname: 'Bar'
                },
                email_address: 'foo@example.com'
              },
              payer: {
                email_address: ctx.state.user.email
              },
              application_context: {
                brand_name: 'Forward Email',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'SUBSCRIBE_NOW',
                payment_method: {
                  payer_selected: 'PAYPAL',
                  payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
                },
                cancel_url: 'https://forwardemail.net/cancel',
                return_url: 'https://forwardemail.net/return'
              }
            },
            // {},
            (err, data) => {
              console.log(
                JSON.stringify(
                  {
                    err,
                    data
                  },
                  null,
                  2
                )
              );
              if (err) return reject(err);
              resolve(data);
            }
          );
        });
        console.log('billingAgreement', billingAgreement);
        for (const link of billingAgreement.links) {
          if (link.rel === 'approval_url') {
            console.log('link', link);
          }
        }

        throw new Error('test');
        */
      }

      return;
    }

    throw ctx.translateError('UNKNOWN_ERROR');
  } catch (err) {
    ctx.logger.error(err);

    if (ctx.accepts('html')) {
      ctx.flash('error', err.message);
      return ctx.redirect(
        ctx.state.domain
          ? ctx.state.l(`/my-account/domains/${ctx.state.domain.name}`)
          : ctx.state.l('/my-account/billing')
      );
    }

    ctx.throw(Boom.badRequest(err.message));
  }
}

module.exports = createDomainBilling;
