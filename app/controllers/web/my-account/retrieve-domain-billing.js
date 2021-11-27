const Boom = require('@hapi/boom');
const Stripe = require('stripe');
const _ = require('lodash');
const accounting = require('accounting');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const countryList = require('country-list');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const { Client, Env, Tokens } = require('bitpay-sdk');

const env = require('../../../../config/env');
const config = require('../../../../config');
const emailHelper = require('../../../../helpers/email');
const { paypalAgent } = require('../../../../helpers/paypal');
const logger = require('../../../../helpers/logger');
const { Domains, Payments } = require('../../../models');

const { paypalCheckoutSdkConfig, PAYPAL_PLAN_MAPPING } = config.payments;

const payPalClient = new checkoutNodeJssdk.core.PayPalHttpClient(
  paypalCheckoutSdkConfig
);

const bitpayTokens = Tokens;
bitpayTokens.merchant = env.BITPAY_MERCHANT_API_TOKEN;
const bitpayEnv = env.NODE_ENV === 'production' ? Env.Prod : Env.Test;
const bitpay = new Client(null, bitpayEnv, env.BITPAY_SECRET_KEY, bitpayTokens);

// country list with USA at the top
const USA = 'United States of America';
const countries = countryList.getNames().sort();
countries.splice(countries.indexOf(USA), 1);
countries.unshift(USA);

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// TODO: dis my shit too
// eslint-disable-next-line complexity
async function retrieveDomainBilling(ctx) {
  const isAccountUpgrade =
    ctx.pathWithoutLocale === '/my-account/billing/upgrade';
  const isMakePayment =
    ctx.pathWithoutLocale === '/my-account/billing/make-payment';
  const redirectTo = ctx.state.l(
    isAccountUpgrade || isMakePayment
      ? '/my-account/billing'
      : `/my-account/domains/${ctx.state.domain.name}`
  );
  const originalPlanExpiresAt = ctx.state.user[config.userFields.planExpiresAt];
  const originalPlan = ctx.state.user.plan;

  if (isMakePayment)
    if (ctx.state.user.plan === 'free')
      throw ctx.translateError('INVALID_PLAN');
    else ctx.query.plan = ctx.state.user.plan;

  try {
    if (
      !isSANB(ctx.query.plan) ||
      !['free', 'enhanced_protection', 'team'].includes(ctx.query.plan)
    )
      throw ctx.translateError('INVALID_PLAN');

    let domain;
    if (!isAccountUpgrade && !isMakePayment) {
      domain = await Domains.findById(ctx.state.domain._id);

      if (!domain) throw ctx.translateError('DOMAIN_DOES_NOT_EXIST');

      // set locale on domain for translation
      domain.locale = ctx.locale;

      // handle edge case if user had multiple tabs open and already upgraded
      if (ctx.query.plan === domain.plan)
        throw ctx.translateError('PLAN_ALREADY_ACTIVE');
    }

    //
    // validate that the user can actually downgrade to the desired plan
    //
    if (isAccountUpgrade) {
      const adminDomains = ctx.state.domains.filter((domain) =>
        domain.members.some(
          (member) =>
            member.user.id === ctx.state.user.id && member.group === 'admin'
        )
      );

      const errors = [];

      for (const domain of adminDomains) {
        if (domain.plan === 'free') continue;

        // determine what plans are required
        const validPlans =
          domain.plan === 'team' ? ['team'] : ['enhanced_protection', 'team'];
        let isValid = false;

        for (const member of domain.members) {
          // return early if the member is not an admin (irrelevant)
          if (member.group !== 'admin') continue;

          // if the user did not exist then return early
          if (!member.user || !member.user.id) {
            logger.fatal(
              new Error(`Member in ${domain.name} no longer exists`)
            );
            continue;
          }

          // use the new/latest plan passed in the `user` argument (as opposed to what exists)
          // (e.g. this method `ensureUserHasValidPlan` is called before saving a user's plan change)
          const memberPlan =
            member.user.id === ctx.state.user.id
              ? ctx.query.plan
              : member.user.plan;

          if (validPlans.includes(memberPlan)) {
            isValid = true;
            break;
          }
        }

        if (!isValid)
          errors.push(
            ctx.translateError(
              'DOMAIN_PLAN_UPGRADE_REQUIRED',
              domain.name,
              ctx.translate(domain.plan.toUpperCase()),
              ctx.state.l(
                `/my-account/domains/${domain.name}/billing?plan=${domain.plan}`
              )
            )
          );
      }

      if (errors.length > 0) {
        if (errors.length === 1) throw Boom.badRequest(errors[0].message);
        // TODO: translate stuff like this
        throw Boom.badRequest(`
          <p class="font-weight-bold text-danger">The following errors occurred:</p>
          <ul class="mb-0 text-left"><li>${errors
            .map((e) => e.message)
            .join('</li><li>')}</li><ul>
        `);
      }
    }

    // render a page where user can select from a dropdown how long they want to pay for
    if (
      // TODO: when user downgrades plans, e.g. to free or to e.p.
      //       then we need to cancel their existing subscription
      ctx.query.plan !== 'free' &&
      !isSANB(ctx.query.session_id) &&
      !isSANB(ctx.query.paypal_order_id) &&
      !isSANB(ctx.query.paypal_subscription_id) &&
      !isSANB(ctx.query.bitpay_invoice_id) &&
      (isAccountUpgrade ||
        isMakePayment ||
        (ctx.query.plan === 'team' && ctx.state.user.plan !== 'team') ||
        (ctx.query.plan === 'enhanced_protection' &&
          !['team', 'enhanced_protection'].includes(ctx.state.user.plan)))
    ) {
      ctx.state.breadcrumbHeaderCentered = true;
      if (isAccountUpgrade) {
        ctx.state.breadcrumbs.pop();
        ctx.state.breadcrumbs.push({
          name: ctx.translate('UPGRADE'),
          header: ctx.translate('BILLING')
        });
      }

      return ctx.render('my-account/domains/billing');
    }

    // set/upgrade the user or domain's plan
    if (isAccountUpgrade) {
      ctx.state.user.plan = ctx.query.plan;
      await Domains.ensureUserHasValidPlan(ctx.state.user, ctx.locale);
    } else if (!isMakePayment) {
      domain.plan = ctx.query.plan;
    }

    //
    // paypal (one-time payment)
    //
    if (isSANB(ctx.query.paypal_order_id)) {
      const order = await payPalClient.execute(
        new checkoutNodeJssdk.orders.OrdersGetRequest(ctx.query.paypal_order_id)
      );
      ctx.logger.info('OrdersGetRequest', { order });
      if (
        !_.isObject(order) ||
        !_.isObject(order.result) ||
        order.result.intent !== 'CAPTURE' ||
        order.result.status !== 'APPROVED' ||
        !_.isArray(order.result.purchase_units) ||
        _.isEmpty(order.result.purchase_units) ||
        !_.isObject(order.result.payer)
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      //
      // `order` object looks like this:
      //
      // console.log(JSON.stringify(order, null, 2));
      //
      /*
        {
          "statusCode": 200,
          "headers": {
            "cache-control": "max-age=0, no-cache, no-store, must-revalidate",
            "content-length": "1224",
            "content-type": "application/json",
            "date": "Mon, 16 Nov 2020 03:18:18 GMT",
            "paypal-debug-id": "c35e05401f88b",
            "connection": "close"
          },
          "result": {
            "id": "9YC624648R1052403",
            "intent": "CAPTURE",
            "status": "APPROVED",
            "purchase_units": [
              {
                "reference_id": "R58F7X",
                "amount": {
                  "currency_code": "USD",
                  "value": "108.00",
                  "breakdown": {
                    "item_total": {
                      "currency_code": "USD",
                      "value": "108.00"
                    }
                  }
                },
                "payee": {
                  "email_address": "niftylettuce-facilitator@gmail.com",
                  "merchant_id": "8CV4WN2C9QDA4",
                  "display_data": {
                    "brand_name": "Forward Email"
                  }
                },
                "description": "One-time payment for a year of the Team plan.",
                "custom_id": "TEAM",
                "soft_descriptor": "TEAM",
                "items": [
                  {
                    "name": "Team",
                    "unit_amount": {
                      "currency_code": "USD",
                      "value": "108.00"
                    },
                    "quantity": "1",
                    "description": "One-time payment for a year of the Team plan.",
                    "sku": "TEAM",
                    "category": "DIGITAL_GOODS"
                  }
                ]
              }
            ],
            "payer": {
              "name": {
                "given_name": "John",
                "surname": "Doe"
              },
              "email_address": "sb-ciwvw3496408@personal.example.com",
              "payer_id": "D9GQHN74A9CV8",
              "address": {
                "country_code": "US"
              }
            },
            "create_time": "2020-11-16T03:12:48Z",
            "links": [
              {
                "href": "https://api.sandbox.paypal.com/v2/checkout/orders/9YC624648R1052403",
                "rel": "self",
                "method": "GET"
              },
              {
                "href": "https://api.sandbox.paypal.com/v2/checkout/orders/9YC624648R1052403",
                "rel": "update",
                "method": "PATCH"
              },
              {
                "href": "https://api.sandbox.paypal.com/v2/checkout/orders/9YC624648R1052403/capture",
                "rel": "capture",
                "method": "POST"
              }
            ]
          }
        }
        */

      // store customer
      ctx.state.user[config.userFields.paypalPayerID] =
        order.result.payer.payer_id;

      // validate plans matched up
      if (
        !['team', 'enhanced_protection'].includes(
          order.result.purchase_units[0].custom_id.toLowerCase()
        ) ||
        order.result.purchase_units[0].custom_id.toLowerCase() !==
          ctx.query.plan
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      // if they upgraded their plan then store it on the user object
      if (!isMakePayment) ctx.state.user.plan = ctx.query.plan;

      // we will take the amount and divide it by the cost per the custom_id
      // in order to determine the duration the customer purchased/added
      const amount = Number(
        order.result.purchase_units[0].items[0].unit_amount.value
      );
      const months = Math.round(amount / (ctx.query.plan === 'team' ? 9 : 3));
      if (!_.isFinite(months) || months < 1)
        throw ctx.translateError('UNKNOWN_ERROR');

      let now = new Date(order.result.create_time);
      if (!_.isDate(now)) now = new Date();

      // if for whatever reason they never had a plan set at date then set one
      if (!_.isDate(ctx.state.user[config.userFields.planSetAt]))
        ctx.state.user[config.userFields.planSetAt] = now;

      // if they're just making a one time payment we want to simply add to their account
      if (isMakePayment) {
        // ensure there was an existing plan expiration, otherwise set one for safety
        if (!_.isDate(ctx.state.user[config.userFields.planExpiresAt]))
          ctx.state.user[config.userFields.planExpiresAt] = now;
        // now add to the plan expiration the length in time necessary
        ctx.state.user[config.userFields.planExpiresAt] = dayjs(
          ctx.state.user[config.userFields.planExpiresAt]
        )
          .add(months, 'month')
          .toDate();
      } else {
        // set planSetAt (since we're changing plans or making an upgrade/change to the plan)
        ctx.state.user[config.userFields.planSetAt] = now;
        ctx.state.user[config.userFields.planExpiresAt] = dayjs(
          ctx.state.user[config.userFields.planSetAt]
        )
          .add(months, 'month')
          .toDate();
      }

      // capture the user's payment (towards the end in case something else went wrong)
      const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(
        order.result.id
      );
      request.requestBody({}); // seems odd to have to do this
      const response = await payPalClient.execute(request);
      ctx.logger.info('OrdersCaptureRequest', {
        order,
        paypal_response: response
      });
      if (
        !_.isObject(response) ||
        !_.isObject(response.result) ||
        response.result.status !== 'COMPLETED'
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      // these all occur in parallel, but the only one we need to work is saving domain
      const [payment, user] = await Promise.all([
        Payments.create({
          user: ctx.state.user._id,
          reference: order.result.purchase_units[0].reference_id,
          amount: Number.parseInt(amount * 100, 10), // convert to cents for consistency with stripe
          method: 'paypal',
          duration: dayjs(now).add(months, 'month').diff(new Date()),
          plan: ctx.query.plan,
          kind: 'one-time',
          paypal_order_id: order.result.id
        }),
        // try to save the customer info to the account
        ctx.state.user.save()
      ]);

      // log the payment just for sanity
      ctx.logger.info('payment created', { payment });

      // re-assign if needed
      ctx.state.user = user;
    }

    // NOTE: handle lifetime payments for both stripe and paypal one-time payments

    //
    // paypal (subscription payment)
    //
    if (isSANB(ctx.query.paypal_subscription_id)) {
      // if user already has a subscription then switch them and cancel the old one
      if (isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])) {
        try {
          await paypalAgent.post(
            `/v1/billing/subscriptions/${
              ctx.state.user[config.userFields.paypalSubscriptionID]
            }/cancel`
          );
        } catch (err) {
          ctx.logger.fatal(err);
          // email admins here
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: config.email.message.from,
                subject: `Error deleting PayPal subscription ID ${
                  ctx.state.user[config.userFields.paypalSubscriptionID]
                } for ${ctx.state.user.email}`
              },
              locals: { message: err.message }
            });
          } catch (err) {
            ctx.logger.fatal(err);
          }
        }
      }

      const { body } = await paypalAgent.get(
        `/v1/billing/subscriptions/${ctx.query.paypal_subscription_id}`
      );

      // validate subscription is active
      if (
        !_.isObject(body) ||
        body.status !== 'ACTIVE' ||
        !isSANB(body.id) ||
        !isSANB(body.plan_id) ||
        !_.isObject(body.subscriber) ||
        !isSANB(body.subscriber.payer_id) ||
        !_.isObject(body.billing_info) ||
        !_.isObject(body.billing_info.last_payment) ||
        !_.isObject(body.billing_info.last_payment.amount) ||
        !isSANB(body.billing_info.last_payment.amount.value)
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      // store customer
      ctx.state.user[config.userFields.paypalPayerID] =
        body.subscriber.payer_id;

      // save the new subscription ID to their account
      ctx.state.user[config.userFields.paypalSubscriptionID] = body.id;

      // validate plans matched up
      const mapping = PAYPAL_PLAN_MAPPING[ctx.query.plan];
      if (!_.isObject(mapping)) throw ctx.translateError('UNKNOWN_ERROR');
      let duration;
      for (const key of Object.keys(mapping)) {
        if (mapping[key] === body.plan_id) {
          duration = key;
          break;
        }
      }

      if (!duration) throw ctx.translateError('UNKNOWN_ERROR');

      // if they upgraded their plan then store it on the user object
      if (!isMakePayment) ctx.state.user.plan = ctx.query.plan;

      // parse the amount for later
      const amount = Number(body.billing_info.last_payment.amount.value);
      if (!_.isFinite(amount) || amount <= 0)
        throw ctx.translateError('UNKNOWN_ERROR');

      // get the date
      let now = new Date(body.create_time);
      if (!_.isDate(now)) now = new Date();

      // set planSetAt (since we're changing plans or making an upgrade/change to the plan)
      ctx.state.user[config.userFields.planSetAt] = now;
      // so now `key` looks like `"1m"` which we can use with `ms` to add duration to the plan
      ctx.state.user[config.userFields.planExpiresAt] = dayjs(
        ctx.state.user[config.userFields.planSetAt]
      )
        .add(ms(duration), 'millisecond')
        .toDate();

      // these all occur in parallel, but the only one we need to work is saving domain
      let [payment, user] = await Promise.all([
        Payments.create({
          user: ctx.state.user._id,
          // NOTE: no `reference` (?)
          amount: Number.parseInt(amount * 100, 10), // convert to cents for consistency with stripe
          method: 'paypal',
          duration: dayjs(now)
            .add(ms(duration), 'millisecond')
            .diff(new Date()),
          plan: ctx.query.plan,
          kind: 'subscription',
          paypal_subscription_id: body.id
        }),
        // try to save the customer info to the account
        ctx.state.user.save()
      ]);

      // cancel the user's stripe subscription if they had one
      if (isSANB(ctx.state.user[config.userFields.stripeSubscriptionID])) {
        try {
          await stripe.subscriptions.del(
            ctx.state.user[config.userFields.stripeSubscriptionID]
          );
          ctx.state.user[config.userFields.stripeSubscriptionID] = null;
          user = await ctx.state.user.save();
        } catch (err) {
          ctx.logger.fatal(err);
          // email admins here
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: config.email.message.from,
                subject: `Error deleting Stripe subscription ID ${
                  ctx.state.user[config.userFields.stripeSubscriptionID]
                } for ${ctx.state.user.email}`
              },
              locals: { message: err.message }
            });
          } catch (err) {
            ctx.logger.fatal(err);
          }
        }
      }

      // log the payment just for sanity
      ctx.logger.info('payment created', { payment });

      // re-assign if needed
      ctx.state.user = user;
    }

    //
    // bitpay (one-time payment)
    //
    if (isSANB(ctx.query.bitpay_invoice_id)) {
      try {
        // eslint-disable-next-line new-cap
        const invoice = await bitpay.GetInvoice(ctx.query.bitpay_invoice_id);
        ctx.logger.info('bitpay.GetInvoice', { invoice });

        // validate plans matched up
        if (
          !_.isObject(invoice) ||
          !['team', 'enhanced_protection'].includes(invoice.itemDesc) ||
          invoice.itemDesc !== ctx.query.plan
        )
          throw ctx.translateError('UNKNOWN_ERROR');

        // we will take the amount and divide it by the cost per the custom_id
        // in order to determine the duration the customer purchased/added
        const amount = Number(invoice.price);
        const months = Math.round(amount / (ctx.query.plan === 'team' ? 9 : 3));
        if (!_.isFinite(months) || months < 1)
          throw ctx.translateError('UNKNOWN_ERROR');

        // if they upgraded their plan then store it on the user object
        if (!isMakePayment) ctx.state.user.plan = ctx.query.plan;

        let now = new Date(invoice.invoiceTime);
        if (!_.isDate(now)) now = new Date();

        // if for whatever reason they never had a plan set at date then set one
        if (!_.isDate(ctx.state.user[config.userFields.planSetAt]))
          ctx.state.user[config.userFields.planSetAt] = now;

        // if they're just making a one time payment we want to simply add to their account
        if (isMakePayment) {
          // ensure there was an existing plan expiration, otherwise set one for safety
          if (!_.isDate(ctx.state.user[config.userFields.planExpiresAt]))
            ctx.state.user[config.userFields.planExpiresAt] = now;
          // now add to the plan expiration the length in time necessary
          ctx.state.user[config.userFields.planExpiresAt] = dayjs(
            ctx.state.user[config.userFields.planExpiresAt]
          )
            .add(months, 'month')
            .toDate();
        } else {
          // set planSetAt (since we're changing plans or making an upgrade/change to the plan)
          ctx.state.user[config.userFields.planSetAt] = now;
          ctx.state.user[config.userFields.planExpiresAt] = dayjs(
            ctx.state.user[config.userFields.planSetAt]
          )
            .add(months, 'month')
            .toDate();
        }

        // create payment
        const [payment, user] = await Promise.all([
          Payments.create({
            user: ctx.state.user._id,
            reference: invoice.orderId,
            amount: Number.parseInt(amount * 100, 10), // convert to cents for consistency with stripe
            method: 'bitpay',
            duration: dayjs(now).add(months, 'month').diff(new Date()),
            plan: ctx.query.plan,
            kind: 'one-time',
            bitpay_invoice_id: invoice.id,
            bitpay_transaction_currency:
              invoice.buyerProvidedInfo.selectedTransactionCurrency,
            bitpay_display_amount_paid: invoice.displayAmountPaid
          }),
          ctx.state.user.save()
        ]);

        // log the payment just for sanity
        ctx.logger.info('payment created', { payment });

        // re-assign if needed
        ctx.state.user = user;
      } catch (err) {
        ctx.logger.fatal(err);
      }
    }

    // save the user or domain's new plan
    //
    // NOTE: we do a double save here on user object which we might not want
    //
    if (isAccountUpgrade || isMakePayment)
      ctx.state.user = await ctx.state.user.save();
    else {
      domain.locale = ctx.locale;
      domain.client = ctx.client;
      ctx.state.domain = await domain.save();
    }

    // if ctx.query.plan was free and it was an account billing change
    // then we know that we need to cancel any necessary subscriptions
    // BUT this must come after the user is saved (due to pre-validation hooks)
    // (we can optimize this later with a `validate()` method being invoked instead of `save()`)
    if (
      isAccountUpgrade &&
      ctx.query.plan === 'free' &&
      (isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) ||
        isSANB(ctx.state.user[config.userFields.paypalSubscriptionID]))
    ) {
      await Promise.all([
        // stripe
        isSANB(ctx.state.user[config.userFields.stripeSubscriptionID])
          ? (async () => {
              try {
                await stripe.subscriptions.del(
                  ctx.state.user[config.userFields.stripeSubscriptionID]
                );
                // set the current value to null
                ctx.state.user[config.userFields.stripeSubscriptionID] = null;
                // save the user again
                await ctx.state.user.save();
              } catch (err) {
                ctx.logger.fatal(err);
                // email admins here
                try {
                  await emailHelper({
                    template: 'alert',
                    message: {
                      to: config.email.message.from,
                      subject: `Error deleting Stripe subscription ID ${
                        ctx.state.user[config.userFields.stripeSubscriptionID]
                      } for ${ctx.state.user.email}`
                    },
                    locals: { message: err.message }
                  });
                } catch (err) {
                  ctx.logger.fatal(err);
                }
              }
            })()
          : Promise.resolve(),
        // paypal
        isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
          ? (async () => {
              try {
                await paypalAgent.post(
                  `/v1/billing/subscriptions/${
                    ctx.state.user[config.userFields.paypalSubscriptionID]
                  }/cancel`
                );
              } catch (err) {
                ctx.logger.fatal(err);
                // email admins here
                try {
                  await emailHelper({
                    template: 'alert',
                    message: {
                      to: config.email.message.from,
                      subject: `Error deleting PayPal subscription ID ${
                        ctx.state.user[config.userFields.paypalSubscriptionID]
                      } for ${ctx.state.user.email}`
                    },
                    locals: { message: err.message }
                  });
                } catch (err) {
                  ctx.logger.fatal(err);
                }
              }
            })()
          : Promise.resolve()
      ]);
    }

    // flash message and redirect
    if (!ctx.api)
      ctx.flash(
        'success',
        isMakePayment
          ? ctx.translate('ONE_TIME_PAYMENT_SUCCESSFUL')
          : ctx.translate(`${ctx.query.plan.toUpperCase()}_PLAN`)
      );

    // pro-rated refund manual email if necessary based off:
    // `originalPlanExpiresAt` (if it was a valid date)
    // `originalPlan` (if it swapped between team <-> enhanced_protection
    // (do things that don't scale)
    if (
      isAccountUpgrade &&
      !isMakePayment &&
      _.isDate(originalPlanExpiresAt) &&
      ctx.query.plan !== originalPlan &&
      originalPlan !== 'free'
    ) {
      // get the total number of days that need pro-rated (if negative then none)
      // (note that we add one day as a buffer to ensure they get a full refund)
      const diff = dayjs(originalPlanExpiresAt).diff(new Date(), 'days') + 1;
      if (diff > 0) {
        const cost = originalPlan === 'team' ? 9 : 3;
        const amount = Number(accounting.toFixed((cost / 30) * diff, 2));
        const message = ctx.translate(
          'REFUND_PROCESSING',
          accounting.formatMoney(amount)
        );
        ctx.logger.info('refund', { diff, cost, amount, message });
        if (ctx.accepts('html')) ctx.flash('info', message);
        // email admins here (in the background)
        emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: 'A Customer Needs Refunded!'
          },
          locals: {
            message: `<p><strong>${ctx.state.user.email}</strong> just checked out with the "${ctx.query.plan}" plan and was on the "${originalPlan}" plan: ${message}`
          }
        })
          // eslint-disable-next-line promise/prefer-await-to-then
          .then(() => {})
          // eslint-disable-next-line promise/prefer-await-to-then
          .catch((err) => {
            ctx.logger.fatal(err);
          });
      }
    }

    // email admins here (in the background)
    ctx.logger.info('checkout');
    emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'A Customer Just Checked Out!'
      },
      locals: {
        message: `<p><strong>${ctx.state.user.email}</strong> just checked out with the "${ctx.query.plan}" plan`
      }
    })
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(() => {})
      // eslint-disable-next-line promise/prefer-await-to-then
      .catch((err) => {
        ctx.logger.fatal(err);
      });

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.fatal(err);

    // email admins here (in the background)
    emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: `An error occurred for ${ctx.state.user.email} on billing`
      },
      locals: {
        message: `<p><strong>URL:</strong> ${ctx.url}</p><p><strong>Error Message:</strong> ${err.message}</p>`
      }
    })
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(() => {})
      // eslint-disable-next-line promise/prefer-await-to-then
      .catch((err) => {
        ctx.logger.fatal(err);
      });

    if (ctx.accepts('html')) {
      ctx.flash('error', err.message);
      return ctx.redirect(redirectTo);
    }

    ctx.throw(Boom.badRequest(err.message));
  }
}

module.exports = retrieveDomainBilling;
