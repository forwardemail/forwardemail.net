const Boom = require('@hapi/boom');
const Stripe = require('stripe');
const _ = require('lodash');
const accounting = require('accounting');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

const env = require('#config/env');
const config = require('#config');
const emailHelper = require('#helpers/email');
const { paypalAgent } = require('#helpers/paypal');
const logger = require('#helpers/logger');
const { Domains, Payments } = require('#models');

const { STRIPE_MAPPING, STRIPE_PRODUCTS, PAYPAL_PLAN_MAPPING } =
  config.payments;

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// eslint-disable-next-line complexity
async function retrieveDomainBilling(ctx) {
  const isAccountUpgrade =
    ctx.pathWithoutLocale === '/my-account/billing/upgrade';
  const isMakePayment =
    ctx.pathWithoutLocale === '/my-account/billing/make-payment';
  const isEnableAutoRenew =
    ctx.pathWithoutLocale === '/my-account/billing/enable-auto-renew';
  const redirectTo = ctx.state.l(
    isAccountUpgrade || isMakePayment || isEnableAutoRenew
      ? '/my-account/billing'
      : `/my-account/domains/${ctx.state.domain.name}`
  );
  const originalPlanExpiresAt = ctx.state.user[config.userFields.planExpiresAt];
  const originalPlan = ctx.state.user.plan;

  if (isMakePayment)
    if (ctx.state.user.plan === 'free')
      throw Boom.badRequest(ctx.translateError('INVALID_PLAN'));
    else ctx.query.plan = ctx.state.user.plan;
  else if (isAccountUpgrade && ctx.query.plan === ctx.state.user.plan)
    throw Boom.badRequest(ctx.translateError('PLAN_ALREADY_ACTIVE'));
  else if (isEnableAutoRenew) {
    if (ctx.state.user.plan === 'free') {
      throw Boom.badRequest(ctx.translateError('INVALID_PLAN'));
    } else if (
      isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) ||
      isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
    ) {
      throw Boom.badRequest(ctx.translateError('SUBSCRIPTION_ALREADY_ACTIVE'));
    } else if (
      _.isDate(ctx.state.user[config.userFields.planExpiresAt]) &&
      new Date(ctx.state.user[config.userFields.planExpiresAt]).getTime() <
        Date.now() &&
      // and the user must have at least one domain still on a paid plan
      ctx.state.domains.some(
        (domain) =>
          domain.plan !== 'free' &&
          domain.members.some(
            (member) =>
              member.user.id === ctx.state.user.id && member.group === 'admin'
          )
      )
    ) {
      //
      // NOTE: if it is over a year then we need to specify the # of months
      //       and we could use thresholds from dayjs but this is simpler
      //       <https://day.js.org/docs/en/customization/relative-time>
      //       (but note we don't want to specify # months if not a complete month)
      //
      let str = dayjs(ctx.state.user[config.userFields.planExpiresAt])
        .locale(ctx.locale)
        .fromNow(true);
      // subtract years difference and if there are > 0 months then add affix
      const years = dayjs().diff(
        ctx.state.user[config.userFields.planExpiresAt],
        'years'
      );
      if (years > 0) {
        const months = dayjs().diff(
          dayjs(ctx.state.user[config.userFields.planExpiresAt]).add(
            years,
            'years'
          ),
          'months'
        );
        if (months > 0)
          str += ` ${ctx.translate('AND')} ${dayjs()
            .add(months, 'months')
            .locale(ctx.locale)
            .fromNow(true)}`;
      }

      ctx.flash('warning', ctx.translate('PAST_DUE_REQUIRED_ONE_TIME', str));
      const redirectTo = ctx.state.l('/my-account/billing/make-payment');
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
      return;
    } else {
      ctx.query.plan = ctx.state.user.plan;
    }
  }

  try {
    if (
      !isSANB(ctx.query.plan) ||
      !['free', 'enhanced_protection', 'team'].includes(ctx.query.plan)
    )
      throw Boom.badRequest(ctx.translateError('INVALID_PLAN'));

    let domain;
    if (!isAccountUpgrade && !isMakePayment && !isEnableAutoRenew) {
      domain = await Domains.findById(ctx.state.domain._id);

      if (!domain)
        throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

      // set locale on domain for translation
      domain.locale = ctx.locale;

      // handle edge case if user had multiple tabs open and already upgraded
      if (ctx.query.plan === domain.plan)
        throw Boom.badRequest(ctx.translateError('PLAN_ALREADY_ACTIVE'));
    }

    //
    // validate that the user can actually downgrade to the desired plan
    //
    if (isAccountUpgrade) {
      // do not allow users to switch plans if they are behind on payments
      if (
        ctx.state.user.plan !== ctx.query.plan &&
        ctx.state.user.plan !== 'free' &&
        new Date(ctx.state.user[config.userFields.planExpiresAt]).getTime() <
          Date.now()
      ) {
        ctx.flash(
          'warning',
          ctx.translate(
            'PAST_DUE_CANNOT_SWITCH',
            dayjs().diff(
              new Date(ctx.state.user[config.userFields.planExpiresAt]),
              'months'
            )
          )
        );
        const redirectTo = ctx.state.l('/my-account/billing/make-payment');
        if (ctx.accepts('html')) ctx.redirect(redirectTo);
        else ctx.body = { redirectTo };
        return;
      }

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
        throw Boom.badRequest(`
          <p class="font-weight-bold text-danger">${ctx.translate(
            'ERRORS_OCCURRED'
          )}</p>
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
      (isEnableAutoRenew ||
        isAccountUpgrade ||
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
      } else if (isMakePayment) {
        ctx.state.breadcrumbs.pop();
        ctx.state.breadcrumbs.push({
          name: ctx.translate('MAKE_PAYMENT'),
          header: ctx.translate('BILLING')
        });
      } else if (isEnableAutoRenew) {
        ctx.state.breadcrumbs.pop();
        ctx.state.breadcrumbs.push({
          name: ctx.translate('ENABLE_AUTO_RENEW'),
          header: ctx.translate('BILLING')
        });
      }

      return ctx.render('my-account/domains/billing');
    }

    // set/upgrade the user or domain's plan
    if (isAccountUpgrade) {
      ctx.state.user.plan = ctx.query.plan;
      await Domains.ensureUserHasValidPlan(ctx.state.user, ctx.locale);
    } else if (!isMakePayment && !isEnableAutoRenew) {
      domain.plan = ctx.query.plan;
    }

    //
    // stripe
    //
    // NOTE: we don't refund the user since we can catch errors as they happen
    //       and stripe doesn't refund transaction fees, so it's better to
    //       handle this manually since it's such a rare edge case rather than
    //       have an automated refund here if some error were to occur
    //
    if (isSANB(ctx.query.session_id)) {
      // if the querystring contained a Stripe checkout session ID then verify it and upgrade user
      const session = await stripe.checkout.sessions.retrieve(
        ctx.query.session_id
      );

      // validate session exists
      if (!session) throw ctx.translateError('UNKNOWN_ERROR');

      ctx.logger.info('stripe.checkout.sessions.retrieve', { session });

      // if payment status was not paid then throw an error
      if (session.payment_status !== 'paid')
        throw ctx.translateError('UNKNOWN_ERROR');

      // store customer
      ctx.state.user[config.userFields.stripeCustomerID] = session.customer;

      // if they upgraded their plan then store it on the user object
      if (!isMakePayment && !isEnableAutoRenew)
        ctx.state.user.plan = ctx.query.plan;

      // look at the line items
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      if (!Array.isArray(lineItems.data) || lineItems.data.length !== 1)
        throw ctx.translateError('UNKNOWN_ERROR');

      // look up the product associated with the line item
      // (it should match ctx.query.plan but this is a safeguard)
      const productToPlan = STRIPE_PRODUCTS[lineItems.data[0].price.product];

      if (
        !isSANB(productToPlan) ||
        !['team', 'enhanced_protection'].includes(productToPlan)
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      // if the plan doesn't match the querystring throw an error (safeguard)
      if (productToPlan !== ctx.query.plan)
        throw ctx.translateError('UNKNOWN_ERROR');

      const type =
        session.mode === 'subscription' ? 'subscription' : 'one-time';
      const mapping = STRIPE_MAPPING[ctx.query.plan][type];
      const key = _.keys(mapping).find(
        (key) =>
          STRIPE_MAPPING[ctx.query.plan][type][key] ===
          lineItems.data[0].price.id
      );
      if (!isSANB(key)) throw ctx.translateError('UNKNOWN_ERROR');

      const now = new Date();

      let paymentIntent;
      let method = 'unknown';
      let expMonth;
      let expYear;
      let last4;
      let paymentIntentId;
      let invoiceId;

      try {
        if (session.payment_intent) {
          paymentIntentId = session.payment_intent;
          paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent
          );

          if (!paymentIntent) throw ctx.translateError('UNKNOWN_ERROR');

          if (paymentIntent.invoice) invoiceId = paymentIntent.invoice;

          const paymentMethod = await stripe.paymentMethods.retrieve(
            paymentIntent.payment_method
          );

          if (!paymentMethod) throw ctx.translateError('UNKNOWN_ERROR');

          ({
            brand: method,
            exp_month: expMonth,
            exp_year: expYear,
            last4
          } = paymentMethod.card);
        } else if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription
          );

          if (!subscription) throw ctx.translateError('UNKNOWN_ERROR');

          //
          // NOTE: subscription has a `latest_invoice` property we could also use
          //       (but this is most likely the most accurate way to do this)
          //

          const invoices = await stripe.invoices.list({
            limit: 100, // it'd be impossible for a customer to hit this (at least right now)
            customer: session.customer,
            subscription: session.subscription
          });

          // never would happen but just having it here
          if (invoices.has_more) {
            ctx.logger.fatal(new Error('Invoices had more', { session }));
          } else {
            invoices.data = _.sortBy(invoices.data, 'created');

            if (
              !invoices ||
              !invoices.data ||
              !invoices.data[0] ||
              !invoices.data[0].id ||
              !invoices.data[0].payment_intent
            )
              throw ctx.translateError('UNKNOWN_ERROR');

            invoiceId = invoices.data[0].id;
            paymentIntentId = invoices.data[0].payment_intent;

            paymentIntent = await stripe.paymentIntents.retrieve(
              invoices.data[0].payment_intent
            );

            if (!paymentIntent) throw ctx.translateError('UNKNOWN_ERROR');

            const paymentMethod = await stripe.paymentMethods.retrieve(
              paymentIntent.payment_method
            );

            if (!paymentMethod) throw ctx.translateError('UNKNOWN_ERROR');

            ({
              brand: method,
              exp_month: expMonth,
              exp_year: expYear,
              last4
            } = paymentMethod.card);
          }
        }
      } catch (err) {
        ctx.logger.fatal(err);
        // email admins here
        emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: paymentIntent
              ? `Error retrieving Stripe Payment Method ID ${paymentIntent.payment_method} for ${ctx.state.user.email}`
              : `Stripe Payment Intent/Method Error for ${ctx.state.user.email}`
          },
          locals: { message: err.message }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      // if for whatever reason they never had a plan set at date then set one
      if (!_.isDate(ctx.state.user[config.userFields.planSetAt]))
        ctx.state.user[config.userFields.planSetAt] = paymentIntent
          ? dayjs.unix(paymentIntent.created).toDate()
          : now;

      // if they're just making a one time payment we want to simply add to their account
      if (!isMakePayment && !isEnableAutoRenew) {
        // set planSetAt (since we're changing plans or making an upgrade/change to the plan)
        ctx.state.user[config.userFields.planSetAt] = paymentIntent
          ? dayjs.unix(paymentIntent.created).toDate()
          : now;
      }

      if (session.mode === 'subscription' && session.subscription) {
        // if user already has a subscription then switch them and cancel the old one
        // (in case webhook ran faster than redirect)
        if (
          isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) &&
          ctx.state.user[config.userFields.stripeSubscriptionID] !==
            session.subscription
        ) {
          try {
            await stripe.subscriptions.del(
              ctx.state.user[config.userFields.stripeSubscriptionID]
            );
          } catch (err) {
            ctx.logger.fatal(err);
            // email admins here
            emailHelper({
              template: 'alert',
              message: {
                to: config.email.message.from,
                subject: `Error deleting Stripe subscription ID ${
                  ctx.state.user[config.userFields.stripeSubscriptionID]
                } for ${ctx.state.user.email}`
              },
              locals: { message: err.message }
            })
              .then()
              .catch((err) => ctx.logger.fatal(err));
          }
        }

        // save the new subscription ID to their account (so they can 1-click cancel subscriptions)
        ctx.state.user[config.userFields.stripeSubscriptionID] =
          session.subscription;
      }

      try {
        //
        // NOTE: we don't want to re-create the payment if the stripe webhook already did
        //
        const $or = [
          {
            user: ctx.state.user._id,
            stripe_session_id: session.id
          }
        ];
        if (invoiceId)
          $or.push({
            user: ctx.state.user._id,
            stripe_invoice_id: invoiceId
          });
        if (paymentIntentId)
          $or.push({
            user: ctx.state.user._id,
            stripe_payment_intent_id: paymentIntentId
          });
        if (session.client_reference_id)
          $or.push({
            user: ctx.state.user._id,
            reference: session.client_reference_id
          });
        let payment = await Payments.findOne({ $or });
        if (payment) {
          ctx.logger.info('stripe payment existed', { payment });
        } else {
          payment = await Payments.create({
            user: ctx.state.user._id,
            reference: session.client_reference_id,
            amount: session.amount_total,
            method,
            exp_month: expMonth,
            exp_year: expYear,
            last4,
            stripe_session_id: session.id,
            stripe_payment_intent_id: paymentIntentId,
            duration: ms(key),
            plan: ctx.query.plan,
            kind: session.mode === 'subscription' ? 'subscription' : 'one-time',
            invoice_at: paymentIntent
              ? dayjs.unix(paymentIntent.created).toDate()
              : now,
            stripe_invoice_id: invoiceId,
            stripe_subscription_id: session.subscription
          });
          // log the payment just for sanity
          ctx.logger.info('stripe payment created', { payment });
        }
      } catch (err) {
        ctx.logger.fatal(err);
        // email admins here
        emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Error retrieving/creating stripe payment for ${ctx.state.user.email}`
          },
          locals: { message: err.message }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      // save the user
      try {
        await ctx.state.user.save();
      } catch (err) {
        ctx.logger.fatal(err);
        // email admins here
        emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Error saving user for ${ctx.state.user.email}`
          },
          locals: { message: err.message }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      // cancel the user's paypal subscription if they had one
      // and if the session.mode was equal to subscription
      if (
        session.mode === 'subscription' &&
        isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
      ) {
        try {
          const agent = await paypalAgent();
          await agent.post(
            `/v1/billing/subscriptions/${
              ctx.state.user[config.userFields.paypalSubscriptionID]
            }/cancel`
          );
          ctx.state.user[config.userFields.paypalSubscriptionID] = undefined;
          await ctx.state.user.save();
        } catch (err) {
          ctx.logger.fatal(err);
          // email admins here
          emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `Error deleting PayPal subscription ID ${
                ctx.state.user[config.userFields.paypalSubscriptionID]
              } for ${ctx.state.user.email}`
            },
            locals: { message: err.message }
          })
            .then()
            .catch((err) => ctx.logger.fatal(err));
        }
      }
    }

    //
    // paypal (one-time payment)
    //
    if (isSANB(ctx.query.paypal_order_id)) {
      const agent = await paypalAgent();
      const { body } = await agent.get(
        `/v2/checkout/orders/${ctx.query.paypal_order_id}`
      );
      if (
        !_.isObject(body) ||
        body.intent !== 'CAPTURE' ||
        !['APPROVED', 'COMPLETED'].includes(body.status) ||
        !_.isArray(body.purchase_units) ||
        _.isEmpty(body.purchase_units) ||
        !_.isObject(body.payer) ||
        !isSANB(body.payer.payer_id)
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      // store customer
      ctx.state.user[config.userFields.paypalPayerID] = body.payer.payer_id;

      // validate plans matched up
      if (
        !['team', 'enhanced_protection'].includes(
          body.purchase_units[0].custom_id.toLowerCase()
        ) ||
        body.purchase_units[0].custom_id.toLowerCase() !== ctx.query.plan
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      // if they upgraded their plan then store it on the user object
      if (!isMakePayment && !isEnableAutoRenew)
        ctx.state.user.plan = ctx.query.plan;

      // we will take the amount and divide it by the cost per the custom_id
      // in order to determine the duration the customer purchased/added
      const amount = Number(body.purchase_units[0].items[0].unit_amount.value);
      const months = Math.round(amount / (ctx.query.plan === 'team' ? 9 : 3));
      if (!_.isFinite(months) || months < 1)
        throw ctx.translateError('UNKNOWN_ERROR');

      let now = new Date();
      if (body.create_time) {
        now = new Date(body.create_time);
      } else if (
        body?.purchase_units?.[0]?.payments?.captures?.[0]?.create_time
      ) {
        now = new Date(body.purchase_units[0].payments.captures[0].create_time);
      }

      if (!_.isDate(now)) now = new Date();

      // if for whatever reason they never had a plan set at date then set one
      if (!_.isDate(ctx.state.user[config.userFields.planSetAt]))
        ctx.state.user[config.userFields.planSetAt] = now;

      // if they're just making a one time payment we want to simply add to their account
      if (!isMakePayment && !isEnableAutoRenew) {
        // set planSetAt (since we're changing plans or making an upgrade/change to the plan)
        ctx.state.user[config.userFields.planSetAt] = now;
      }

      let transactionId;

      // parse the transaction id
      if (body?.purchase_units?.[0]?.payments?.captures?.[0]?.id)
        transactionId = body.purchase_units[0].payments.captures[0].id;

      // capture the user's payment (towards the end in case something else went wrong)
      try {
        const agent1 = await paypalAgent();
        const response = await agent1.post(
          `/v2/checkout/orders/${body.id}/capture`
        );
        // parse the transaction id
        if (response.body?.purchase_units?.[0]?.payments?.captures?.[0]?.id)
          transactionId =
            response.body.purchase_units[0].payments.captures[0].id;
      } catch (err) {
        ctx.logger.warn(err);
        if (!err.status || err.status !== 422) {
          // email admins here
          emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `Error while capturing PayPal order payment for ${ctx.state.user.email}`
            },
            locals: {
              message: `<pre><code>${JSON.stringify(err, null, 2)}</code></pre>`
            }
          })
            .then()
            .catch((err) => ctx.logger.fatal(err));
        }
      }

      try {
        //
        // NOTE: we don't want to re-create the payment if the paypal webhook already did
        //
        const $or = [
          {
            user: ctx.state.user._id,
            paypal_order_id: body.id
          },
          {
            user: ctx.state.user._id,
            reference: body.purchase_units[0].reference_id
          }
        ];
        if (transactionId)
          $or.push({
            user: ctx.state.user._id,
            paypal_transaction_id: transactionId
          });
        let payment = await Payments.findOne({ $or });
        if (payment) {
          ctx.logger.info('paypal payment existed', { payment });
        } else {
          payment = await Payments.create({
            user: ctx.state.user._id,
            reference: body.purchase_units[0].reference_id,
            amount: Number.parseInt(amount * 100, 10), // convert to cents for consistency with stripe
            method: 'paypal',
            duration:
              months >= 12
                ? ms(`${Math.round(months / 12)}y`)
                : ms(`${Math.round(months * 30)}d`),
            plan: ctx.query.plan,
            kind: 'one-time',
            paypal_order_id: body.id,
            paypal_transaction_id: transactionId,
            invoice_at: now
          });
          // log the payment just for sanity
          ctx.logger.info('paypal payment created', { payment });
        }
      } catch (err) {
        ctx.logger.fatal(err);
        // email admins here
        emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Error retrieving/creating paypal payment for ${ctx.state.user.email}`
          },
          locals: { message: err.message }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      // save the user
      try {
        await ctx.state.user.save();
      } catch (err) {
        ctx.logger.fatal(err);
        // email admins here
        emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Error saving user for ${ctx.state.user.email}`
          },
          locals: { message: err.message }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }
    }

    //
    // paypal (subscription payment)
    //
    if (isSANB(ctx.query.paypal_subscription_id)) {
      const agent2 = await paypalAgent();
      const { body } = await agent2.get(
        `/v1/billing/subscriptions/${ctx.query.paypal_subscription_id}`
      );

      // validate subscription is active
      if (
        !_.isObject(body) ||
        ['SUSPENDED', 'CANCELLED', 'EXPIRED'].includes(body.status) ||
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

      // if user already has a subscription then switch them and cancel the old one
      // (but don't in case the webhook ran faster than the redirect)
      if (
        isSANB(ctx.state.user[config.userFields.paypalSubscriptionID]) &&
        ctx.state.user[config.userFields.paypalSubscriptionID] !== body.id
      ) {
        try {
          const agent = await paypalAgent();
          await agent.post(
            `/v1/billing/subscriptions/${
              ctx.state.user[config.userFields.paypalSubscriptionID]
            }/cancel`
          );
        } catch (err) {
          ctx.logger.fatal(err);
          // email admins here
          emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `Error deleting PayPal subscription ID ${
                ctx.state.user[config.userFields.paypalSubscriptionID]
              } for ${ctx.state.user.email}`
            },
            locals: { message: err.message }
          })
            .then()
            .catch((err) => ctx.logger.fatal(err));
        }
      }

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
      if (!isMakePayment && !isEnableAutoRenew)
        ctx.state.user.plan = ctx.query.plan;

      // parse the amount for later
      const amount = Number(body.billing_info.last_payment.amount.value);
      if (!_.isFinite(amount) || amount <= 0)
        throw ctx.translateError('UNKNOWN_ERROR');

      // get the date
      let now = new Date();
      if (body.create_time) {
        now = new Date(body.create_time);
      } else if (
        body?.purchase_units?.[0]?.payments?.captures?.[0]?.create_time
      ) {
        now = new Date(body.purchase_units[0].payments.captures[0].create_time);
      }

      if (!_.isDate(now)) now = new Date();

      // set planSetAt (since we're changing plans or making an upgrade/change to the plan)
      if (!isMakePayment && !isEnableAutoRenew) {
        ctx.state.user[config.userFields.planSetAt] = now;
      }

      // these all occur in parallel, but the only one we need to work is saving domain
      try {
        //
        // NOTE: we don't want to re-create the payment if the paypal webhook already did
        //
        let payment = await Payments.findOne({
          user: ctx.state.user._id,
          paypal_subscription_id: body.id,
          invoice_at: now
        });
        if (payment) {
          ctx.logger.info('paypal payment existed', { payment });
        } else {
          payment = await Payments.create({
            user: ctx.state.user._id,
            // NOTE: paypal subscriptions don't allow you to pass a reference
            amount: Number.parseInt(amount * 100, 10), // convert to cents for consistency with stripe
            method: 'paypal',
            duration: ms(duration),
            plan: ctx.query.plan,
            kind: 'subscription',
            paypal_subscription_id: body.id,
            //
            // NOTE: there is no way to get the `paypal_transaction_id`
            //       because the PayPal API response does not include it
            //       and when you search for transactions from a subscription
            //       (even if you include start_time in the query in the past)
            //       it will not return any results, and transactions will be empty
            //       (and we don't want to do an artificial delay here just to populate date)
            //
            invoice_at: now
          });
          // log the payment just for sanity
          ctx.logger.info('paypal payment created', { payment });
        }
      } catch (err) {
        ctx.logger.fatal(err);
        // email admins here
        emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Error retrieving/creating paypal payment for ${ctx.state.user.email}`
          },
          locals: { message: err.message }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      // save the user
      try {
        await ctx.state.user.save();
      } catch (err) {
        ctx.logger.fatal(err);
        // email admins here
        emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Error saving user for ${ctx.state.user.email}`
          },
          locals: { message: err.message }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      // cancel the user's stripe subscription if they had one
      if (isSANB(ctx.state.user[config.userFields.stripeSubscriptionID])) {
        try {
          await stripe.subscriptions.del(
            ctx.state.user[config.userFields.stripeSubscriptionID]
          );
          ctx.state.user[config.userFields.stripeSubscriptionID] = undefined;
          await ctx.state.user.save();
        } catch (err) {
          ctx.logger.fatal(err);
          // email admins here
          emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `Error deleting Stripe subscription ID ${
                ctx.state.user[config.userFields.stripeSubscriptionID]
              } for ${ctx.state.user.email}`
            },
            locals: { message: err.message }
          })
            .then()
            .catch((err) => ctx.logger.fatal(err));
        }
      }
    }

    // save the user or domain's new plan
    //
    // NOTE: we do a double save here on user object which we might not want
    //
    if (isAccountUpgrade || isMakePayment || isEnableAutoRenew)
      await ctx.state.user.save();
    else {
      domain.locale = ctx.locale;
      domain.client = ctx.client;
      ctx.state.domain = await domain.save();
      //
      // NOTE: this logic is the same as `jobs/fix-non-free-users`
      //       (which runs every minute as plans expire, but this is to ensure its real-time)
      //
      // downgrade the user if past due,
      // not on free plan, zero domains on paid plans,
      // and no subscription
      if (
        ctx.state.user.plan !== 'free' &&
        new Date(ctx.state.user[config.userFields.planExpiresAt]).getTime() <
          Date.now() &&
        !isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) &&
        !isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
      ) {
        const count = await Domains.countDocuments({
          members: {
            $elemMatch: {
              user: ctx.state.user._id,
              group: 'admin'
            }
          },
          plan: { $ne: 'free' }
        });
        if (count === 0) {
          ctx.logger.info(`updating to free plan`);
          ctx.state.user.plan = 'free';
          ctx.state.user[config.userFields.planSetAt] = new Date();
          ctx.flash('success', ctx.translate('FREE_PLAN'));
          await ctx.state.user.save();
        }
      }
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
                ctx.state.user[config.userFields.stripeSubscriptionID] =
                  undefined;
                // save the user again
                await ctx.state.user.save();
              } catch (err) {
                ctx.logger.fatal(err);
                // email admins here
                emailHelper({
                  template: 'alert',
                  message: {
                    to: config.email.message.from,
                    subject: `Error deleting Stripe subscription ID ${
                      ctx.state.user[config.userFields.stripeSubscriptionID]
                    } for ${ctx.state.user.email}`
                  },
                  locals: { message: err.message }
                })
                  .then()
                  .catch((err) => ctx.logger.fatal(err));
              }
            })()
          : Promise.resolve(),
        // paypal
        isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
          ? (async () => {
              try {
                const agent = await paypalAgent();
                await agent.post(
                  `/v1/billing/subscriptions/${
                    ctx.state.user[config.userFields.paypalSubscriptionID]
                  }/cancel`
                );
              } catch (err) {
                ctx.logger.fatal(err);
                // email admins here
                emailHelper({
                  template: 'alert',
                  message: {
                    to: config.email.message.from,
                    subject: `Error deleting PayPal subscription ID ${
                      ctx.state.user[config.userFields.paypalSubscriptionID]
                    } for ${ctx.state.user.email}`
                  },
                  locals: { message: err.message }
                })
                  .then()
                  .catch((err) => ctx.logger.fatal(err));
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
          : isEnableAutoRenew
          ? ctx.translate('AUTO_RENEW_ENABLED')
          : ctx.translate(`${ctx.query.plan.toUpperCase()}_PLAN`)
      );

    // pro-rated refund manual email if necessary based off:
    // `originalPlanExpiresAt` (if it was a valid date)
    // `originalPlan` (if it swapped between team <-> enhanced_protection
    // (do things that don't scale)
    if (
      isAccountUpgrade &&
      !isEnableAutoRenew &&
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
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }
    }

    // if the user is upgrading plans and has domains not
    // on the same plan they're upgrading to, then alert them
    // and also send them an email in the background too
    if (isAccountUpgrade) {
      const domains = ctx.state.domains.filter((domain) => {
        return (
          !domain.is_global &&
          domain.plan !== ctx.state.user.plan &&
          domain.members.some(
            (member) =>
              member.user.id === ctx.state.user.id && member.group === 'admin'
          )
        );
      });
      if (domains.length > 0) {
        const message = ctx.translate('USER_UPGRADED_ACCOUNT_NOT_DOMAINS');
        if (ctx.accepts('html')) ctx.flash('warning', message);
        emailHelper({
          template: 'alert',
          message: {
            to: ctx.state.user[config.userFields.fullEmail]
          },
          locals: { user: ctx.state.user.toObject(), message }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
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
      .then()
      .catch((err) => ctx.logger.fatal(err));

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
      .then()
      .catch((err) => ctx.logger.fatal(err));

    if (ctx.accepts('html')) {
      ctx.flash('error', err.message);
      return ctx.redirect(redirectTo);
    }

    ctx.throw(Boom.badRequest(err.message));
  }
}

module.exports = retrieveDomainBilling;
