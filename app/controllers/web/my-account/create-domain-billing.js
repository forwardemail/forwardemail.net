/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const cryptoRandomString = require('crypto-random-string');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const slug = require('speakingurl');
const striptags = require('striptags');
const titleize = require('titleize');
const _ = require('#helpers/lodash');

const config = require('#config');
const emailHelper = require('#helpers/email');
const { paypalAgent } = require('#helpers/paypal');
const stripe = require('#helpers/stripe');

const { STRIPE_MAPPING, PAYPAL_MAPPING, PAYMENT_DURATIONS } = config.payments;

async function createDomainBilling(ctx) {
  try {
    //
    // validate form body
    //
    let {
      plan,
      payment_method: paymentMethod,
      payment_type: paymentType,
      payment_duration: paymentDuration,
      domain,
      denylist
    } = ctx.request.body;

    const isMakePayment =
      ctx.pathWithoutLocale === '/my-account/billing/make-payment';

    const isEnableAutoRenew =
      ctx.pathWithoutLocale === '/my-account/billing/enable-auto-renew';

    if (isMakePayment && ctx.state.user.plan === 'free')
      throw Boom.badRequest(ctx.translateError('INVALID_PLAN'));

    if (isEnableAutoRenew)
      if (ctx.state.user.plan === 'free')
        throw Boom.badRequest(ctx.translateError('INVALID_PLAN'));
      else if (
        isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) ||
        isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
      )
        throw Boom.badRequest(
          ctx.translateError('SUBSCRIPTION_ALREADY_ACTIVE')
        );

    if (isMakePayment) {
      paymentType = 'one-time';
      plan = ctx.state.user.plan;
    } else if (isEnableAutoRenew) {
      paymentType = 'subscription';
      plan = ctx.state.user.plan;
    }

    // plan
    if (
      !isSANB(plan) ||
      !['free', 'enhanced_protection', 'team'].includes(plan)
    ) {
      throw Boom.badRequest(ctx.translateError('INVALID_PLAN'));
    }

    // payment_method
    if (
      !isSANB(paymentMethod) ||
      !['credit_card', 'paypal'].includes(paymentMethod)
    ) {
      throw Boom.badRequest(ctx.translateError('INVALID_PAYMENT_METHOD'));
    }

    // payment_type
    if (
      !isSANB(paymentType) ||
      !['one-time', 'subscription'].includes(paymentType)
    ) {
      throw Boom.badRequest(ctx.translateError('INVALID_PAYMENT_TYPE'));
    }

    // payment_duration
    if (!isSANB(paymentDuration) || !PAYMENT_DURATIONS.has(paymentDuration)) {
      throw Boom.badRequest(ctx.translateError('INVALID_PAYMENT_DURATION'));
    }

    // don't allow a user to have a subscription paymentType selected
    // with 2y or 3y selected (in other words if the mapping doesn't exist)
    let price;
    if (paymentMethod === 'credit_card') {
      price = STRIPE_MAPPING[plan][paymentType][paymentDuration];
    } else if (paymentMethod === 'paypal') {
      price = PAYPAL_MAPPING[plan][paymentDuration];
    }

    if (!isSANB(price) && !_.isFinite(price)) {
      throw Boom.badRequest(ctx.translateError('INVALID_PAYMENT_DURATION'));
    }

    // one-time payment for 3 months of Team plan
    // subscription payment for 1 year of Enhanced Protection plan
    const duration = dayjs()
      .add(ms(paymentDuration), 'millisecond')
      .locale(ctx.locale)
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
      //
      // create and validate stripe customer here
      // (ensure valid customer before webhooks hit)
      //
      try {
        let customer = isSANB(
          ctx.state.user[config.userFields.stripeCustomerID]
        )
          ? await stripe.customers.retrieve(
              ctx.state.user[config.userFields.stripeCustomerID]
            )
          : await stripe.customers.create({ email: ctx.state.user.email });

        if (customer.deleted) {
          ctx.logger.warn('Stripe customer previously deleted', { customer });
          customer = await stripe.customers.create({
            email: ctx.state.user.email
          });
        }

        if (
          ctx.state.user[config.userFields.stripeCustomerID] !== customer.id
        ) {
          ctx.state.user[config.userFields.stripeCustomerID] = customer.id;
          await ctx.state.user.save();
        }
      } catch (err) {
        ctx.logger.fatal(err);
        // email admins here
        try {
          await emailHelper({
            template: 'alert',
            message: {
              to: config.alertsEmail,
              subject: `Error creating Stripe customer for ${ctx.state.user.email}`
            },
            locals: { message: err.message }
          });
        } catch (err) {
          ctx.logger.fatal(err);
        }

        throw ctx.translateError('UNKNOWN_ERROR');
      }

      const options = {
        mode: paymentType === 'one-time' ? 'payment' : 'subscription',
        customer: ctx.state.user[config.userFields.stripeCustomerID],
        client_reference_id: reference,
        metadata: {
          plan
        },
        line_items: [
          {
            price,
            quantity: 1,
            description
          }
        ],
        locale: config.STRIPE_LOCALES.has(ctx.locale) ? ctx.locale : 'auto',
        cancel_url: `${config.urls.web}${ctx.path}${
          isMakePayment || isEnableAutoRenew ? '' : `/?plan=${plan}`
        }`,
        // NOTE: Stripe will automatically add `session_id={CHECKOUT_SESSION_ID} if it is missing
        //       (but we're adding it here just as a safeguard)
        success_url: `${config.urls.web}${ctx.path}/?${
          isMakePayment || isEnableAutoRenew ? '' : `plan=${plan}&`
        }session_id={CHECKOUT_SESSION_ID}`,
        allow_promotion_codes: true
      };

      //
      // for those with bad domains (the tld is often used for spam)
      // we need to append this to redirect querystring so that
      // the user doesn't have to attempt to create the domain again
      //
      if (isSANB(domain) && isFQDN(domain))
        options.success_url += `&domain=${domain}`;

      if (isSANB(denylist)) options.success_url += `&denylist=${denylist}`;

      if (paymentType !== 'one-time') {
        options.subscription_data = {
          description,
          metadata: {
            plan
          }
        };

        //
        // if the user's plan expires in the future
        // then we don't want to charge them right away
        // (we want to check them when their plan expires)
        //
        // (note that we could use `billing_cycle_anchor` if we had custom subscription creation)
        // (where we'd have to store stripe cards in advance for each user in order to setup subscriptions)
        // (the alternative is to either set `trial_ends` or `trial_period_days`)
        // <https://stackoverflow.com/a/63375898>
        //
        if (
          isEnableAutoRenew &&
          dayjs(ctx.state.user[config.userFields.planExpiresAt]).isAfter(
            dayjs()
          )
        ) {
          //
          // NOTE: this same logic is in retrieve-domain-billing
          //
          // if it's more than 48 hours out then we can use `trial_ends`
          // otherwise we need to use `trial_period_days` in order for accuracy
          const hours = dayjs(
            ctx.state.user[config.userFields.planExpiresAt]
          ).diff(dayjs(), 'hours');
          //
          // NOTE: maximum number of trial period days is 730 (2 years)
          //       so we have a safeguard here (since 730 * 24 = 17520 hours)
          //       (we also have this same safeguard on the route itself to load the form)
          //       (but this is in place in case the user has two tabs open)
          //
          if (hours >= 17520) {
            ctx.flash(
              'warning',
              ctx.translate(
                'PLAN_MORE_THAN_TWO_YEARS_FROM_EXPIRY',
                dayjs(ctx.state.user[config.userFields.planExpiresAt]).format(
                  'M/D/YY'
                ),
                dayjs(ctx.state.user[config.userFields.planExpiresAt])
                  .subtract(2, 'years')
                  .locale(ctx.locale)
                  .fromNow()
              )
            );
            const redirectTo = ctx.state.l('/my-account/billing');
            if (ctx.accepts('html')) ctx.redirect(redirectTo);
            else ctx.body = { redirectTo };
            return;
          }

          if (hours > 48) {
            options.subscription_data.trial_end = dayjs(
              ctx.state.user[config.userFields.planExpiresAt]
            ).unix();
          } else {
            options.subscription_data.trial_period_days = hours > 24 ? 2 : 1;
          }
        }
      }

      ctx.logger.info('stripe.checkout.sessions.create', { options });

      const session = await stripe.checkout.sessions.create(options);

      // <https://github.com/stripe/stripe-node/issues/1796>
      // ctx.logger.info('stripe.checkout.sessions.create', { session });

      const redirectTo = session.url;
      if (ctx.accepts('html')) {
        ctx.status = 303;
        ctx.redirect(redirectTo);
      } else {
        ctx.body = { redirectTo };
      }

      return;
    }

    if (paymentMethod === 'paypal') {
      // paypal
      const name = ctx.translate(plan.toUpperCase());

      // one-time
      if (paymentType === 'one-time') {
        // the SKU should look like a product SKU
        // (e.g. "ENHANCED-PROTECTION" vs. "ENHANCED_PROTECTION")
        const sku = slug(plan).toUpperCase();
        // prepare the request body
        const requestBody = {
          intent: 'CAPTURE',
          application_context: {
            cancel_url: `${config.urls.web}${ctx.path}${
              isMakePayment || isEnableAutoRenew ? '' : `/?plan=${plan}`
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
              reference_id: ctx.state.user.id,
              description,
              custom_id: sku,
              invoice_id: reference,
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

        //
        // for those with bad domains (the tld is often used for spam)
        // we need to append this to redirect querystring so that
        // the user doesn't have to attempt to create the domain again
        //
        if (isSANB(domain) && isFQDN(domain))
          requestBody.application_context.return_url += `&domain=${domain}`;

        if (isSANB(denylist))
          requestBody.application_context.return_url += `&denylist=${denylist}`;

        try {
          const agent = await paypalAgent();
          const { body } = await agent
            .post('/v2/checkout/orders')
            .send(requestBody);
          ctx.body = { orderID: body.id };
        } catch (err) {
          ctx.logger.error(err);
          try {
            // PayPal returns a stringifed JavaScript object in the response body
            // (so we should try to parse it using JSON.parse and then pull out the `message` property)
            // err.message = {"name":"INVALID_REQUEST","message":"Request is not well-formed, syntactically incorrect, or violates schema.","debug_id":"1d5686dcdfa41","details":[{"field":"/purchase_units/@reference_id=='WyA2Pn'/amount/value","value":"","location":"body","issue":"MISSING_REQUIRED_PARAMETER","description":"A required field / parameter is missing."},{"field":"/purchase_units/@reference_id=='WyA2Pn'/items/0/unit_amount/value","value":"","location":"body","issue":"MISSING_REQUIRED_PARAMETER","description":"A required field / parameter is missing."}],"links":[{"href":"https://developer.paypal.com/docs/api/orders/v2/#error-MISSING_REQUIRED_PARAMETER","rel":"information_link","encType":"application/json"}]}
            err.original_message = err.message;
            err.message = JSON.parse(err.message).message;
          } catch (err_) {
            // if it wasn't a PayPal error
            ctx.logger.debug(err_);
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
          ? ctx.state.l(
              `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}`
            )
          : ctx.state.l('/my-account/billing')
      );
    }

    throw err;
  }
}

module.exports = createDomainBilling;
