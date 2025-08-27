/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const Stripe = require('stripe');
const numeral = require('numeral');
const dayjs = require('dayjs-with-plugins');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pMapSeries = require('p-map-series');
const pWaitFor = require('p-wait-for');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const striptags = require('striptags');
const _ = require('#helpers/lodash');

const config = require('#config');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
const logger = require('#helpers/logger');
const refundHelper = require('#helpers/refund');
const { Aliases, Domains, Payments } = require('#models');
const { paypalAgent } = require('#helpers/paypal');
const retryPayPalRequest = require('#helpers/retry-paypal-request');

const { STRIPE_MAPPING, STRIPE_PRODUCTS, PAYPAL_PLAN_MAPPING } =
  config.payments;

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function retrieveDomainBilling(ctx) {
  const isAccountUpgrade =
    ctx.pathWithoutLocale === '/my-account/billing/upgrade';
  const isMakePayment =
    ctx.pathWithoutLocale === '/my-account/billing/make-payment';
  const isEnableAutoRenew =
    ctx.pathWithoutLocale === '/my-account/billing/enable-auto-renew';
  let redirectTo = ctx.state.l(
    isAccountUpgrade || isMakePayment || isEnableAutoRenew
      ? '/my-account/billing'
      : `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}`
  );
  const originalPlanSetAt = new Date(
    ctx.state.user[config.userFields.planSetAt]
  );
  const originalPlan = `${ctx.state.user.plan}`;

  //
  // if `domain` querystring was provided this was mainly because
  // certain tlds require the user to be on a paid plan to create them
  // (so we validate that this is the case and then render hidden input and alert)
  //
  if (ctx.state.domain && ctx.state.domain.name) {
    const { isGood, isDisposable, isRestricted } = Domains.getNameRestrictions(
      ctx.state.domain.name
    );
    ctx.state.isGood = isGood;
    ctx.state.isDisposable = isDisposable;
    ctx.state.isRestricted = isRestricted;
  }

  if (
    isAccountUpgrade &&
    ctx.accepts('html') &&
    ctx.state.user.plan === 'free' &&
    isSANB(ctx.query.domain) &&
    isFQDN(ctx.query.domain)
  )
    ctx.state.bad_domain = ctx.query.domain.toLowerCase();

  //
  // denylist support (redirects user after upgrade)
  //
  if (isSANB(ctx.query.denylist))
    ctx.state.denylist = ctx.query.denylist.toLowerCase().trim();

  if (isMakePayment) {
    if (ctx.state.user.plan === 'free')
      throw Boom.badRequest(ctx.translateError('INVALID_PLAN'));
    else ctx.query.plan = ctx.state.user.plan;
  } else if (isAccountUpgrade && ctx.query.plan === ctx.state.user.plan) {
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  } else if (isEnableAutoRenew) {
    if (ctx.state.user.plan === 'free') {
      throw Boom.badRequest(ctx.translateError('INVALID_PLAN'));
    } else if (
      isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) ||
      isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
    ) {
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
      return;
    } else if (_.isDate(ctx.state.user[config.userFields.planExpiresAt])) {
      if (
        dayjs(ctx.state.user[config.userFields.planExpiresAt]).isAfter(dayjs())
      ) {
        //
        // NOTE: this same logic is in create-domain-billing
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
      } else if (
        new Date(ctx.state.user[config.userFields.planExpiresAt]).getTime() <
          Date.now() &&
        // and the user must have at least one domain still on a paid plan
        ctx.state.domains.some(
          (domain) =>
            domain.plan !== 'free' &&
            domain.members.some(
              (member) =>
                member.user &&
                member.user.id === ctx.state.user.id &&
                member.group === 'admin'
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
      }

      ctx.query.plan = ctx.state.user.plan;
    } else {
      ctx.query.plan = ctx.state.user.plan;
    }
  }

  try {
    if (
      !isSANB(ctx.query.plan) ||
      !['free', 'enhanced_protection', 'team', 'enterprise'].includes(
        ctx.query.plan
      )
    )
      throw Boom.badRequest(ctx.translateError('INVALID_PLAN'));

    let domain;
    if (!isAccountUpgrade && !isMakePayment && !isEnableAutoRenew) {
      if (!ctx.state.domain)
        throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

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
            member.user &&
            member.user.id === ctx.state.user.id &&
            member.group === 'admin'
        )
      );

      const errors = [];

      for (const domain of adminDomains) {
        if (domain.plan === 'free') continue;

        // determine what plans are required
        const validPlans =
          domain.plan === 'team'
            ? ['team']
            : domain.plan === 'enterprise'
            ? ['enterprise']
            : ['enhanced_protection', 'team', 'enterprise'];
        let isValid = false;

        for (const member of domain.members) {
          // return early if the member is not an admin (irrelevant)
          if (member.group !== 'admin') continue;

          // if the user did not exist then return early
          if (!member.user || !member.user.id) {
            logger.error(
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
              'DOMAIN_PLAN_DOWNGRADE_REQUIRED',
              domain.name,
              ctx.translate(domain.plan.toUpperCase()),
              ctx.query.plan === 'free'
                ? ctx.state.l(
                    `/my-account/domains/${punycode.toASCII(
                      domain.name
                    )}/billing?plan=free`
                  )
                : ctx.state.l(
                    `/my-account/domains/${punycode.toASCII(
                      domain.name
                    )}/billing`
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
          !['team', 'enhanced_protection', 'enterprise'].includes(
            ctx.state.user.plan
          )))
    ) {
      //
      // if the user is switching between plans and had conversion credit
      // then automatically convert the user and give them the free credit
      // (but not if we were going to give them a full refund)
      //
      if (
        isAccountUpgrade &&
        originalPlan !== ctx.query.plan &&
        ctx.state.conversion[ctx.query.plan].length > 0 &&
        (ctx.state.paymentCount !== 0 || ctx.state.paymentIds.length === 0)
      ) {
        const now = new Date();
        ctx.state.user.plan = ctx.query.plan;
        await Domains.ensureUserHasValidPlan(ctx.state.user, ctx.locale);
        ctx.state.user[config.userFields.planSetAt] = now;
        // initial save to lock user (prevent duplicate free credits)
        await ctx.state.user.save();
        await Payments.create(
          ctx.state.conversion[ctx.query.plan].map((payment) => ({
            ...payment,
            stack: new Error('stack').stack,
            invoice_at: now
          }))
        );
        ctx.flash(
          'success',
          ctx.translate(
            'CONVERSION_SUCCESS',
            dayjs()
              .add(
                _.sumBy(ctx.state.conversion[ctx.query.plan], 'duration'),
                'ms'
              )
              .locale(ctx.locale)
              .fromNow(true)
          )
        );
        // final save to update expiration date
        await ctx.state.user.save();
        if (ctx.accepts('html')) ctx.redirect(redirectTo);
        else ctx.body = { redirectTo };
        return;
      }

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
      try {
        await Domains.ensureUserHasValidPlan(ctx.state.user, ctx.locale);
      } catch (err) {
        // if it was a redirect from stripe or paypal
        // otherwise if it wasn't then flash and error
        if (
          isSANB(ctx.query.session_id) ||
          isSANB(ctx.query.paypal_order_id) ||
          isSANB(ctx.query.paypal_subscription_id)
        ) {
          ctx.logger.fatal(err);
          ctx.flash('error', err.message);
        } else {
          throw err;
        }
      }
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

      // <https://github.com/stripe/stripe-node/issues/1796>
      // ctx.logger.info('stripe.checkout.sessions.retrieve', { session });

      // if the session was still in setup mode then it's an obvious error
      if (
        !['paid', 'unpaid', 'no_payment_required'].includes(
          session.payment_status
        )
      )
        throw ctx.translateError('UNKNOWN_ERROR');

      if (session.payment_status === 'no_payment_required')
        throw ctx.translateError('UNKNOWN_ERROR');

      // if payment status was not paid then then it must be an async payment (e.g. bank debit)
      // and we will email them once the payment has been processed and their plan is upgraded
      if (session.payment_status === 'unpaid') {
        const err = ctx.translateError('ASYNC_PAYMENT');
        err.is_success = true;
        throw err;
      }

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
        !['team', 'enhanced_protection', 'enterprise'].includes(productToPlan)
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
      let isApplePay = false;
      let isGooglePay = false;
      let subscription;

      try {
        if (session.payment_intent) {
          paymentIntentId = session.payment_intent;
          paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent
          );

          if (!paymentIntent) throw ctx.translateError('UNKNOWN_ERROR');

          // check payment intent status (must be successful)
          if (paymentIntent.status !== 'succeeded') {
            // remove the Payment on our side if any that corresponds to this intent
            const payment = await Payments.findOne({
              user: ctx.state.user._id,
              stripe_payment_intent_id: paymentIntent.id
            });
            if (payment) {
              // remove the payment from our side
              await payment.remove();
              // find and save the associated user
              // so that their plan_expires_at gets updated
              await ctx.state.user.save();
            }

            throw ctx.translateError('INVALID_PAYMENT_INTENT');
          }

          if (paymentIntent.invoice) invoiceId = paymentIntent.invoice;

          const paymentMethod = await stripe.paymentMethods.retrieve(
            paymentIntent.payment_method
          );

          if (!paymentMethod) throw ctx.translateError('UNKNOWN_ERROR');

          if (paymentMethod.type === 'card') {
            ({
              brand: method,
              exp_month: expMonth,
              exp_year: expYear,
              last4
            } = paymentMethod.card);
            if (_.isObject(paymentMethod.card.wallet)) {
              if (paymentMethod.card.wallet.type === 'apple_pay')
                isApplePay = true;
              else if (paymentMethod.card.wallet.type === 'google_pay')
                isGooglePay = true;
            }
          } else {
            method = paymentMethod.type;
          }
        } else if (session.subscription) {
          subscription = await stripe.subscriptions.retrieve(
            session.subscription
          );

          if (!subscription) throw ctx.translateError('UNKNOWN_ERROR');

          // if there is no payment_intent then that must mean it
          // was a subscription that starts in the future and we
          // can also validate that this is the case by the status
          // `subscription.status` will be equal to "trialing"
          if (subscription.status !== 'trialing') {
            //
            // NOTE: subscription has a `latest_invoice` property we could also use
            //       (but this is most likely the most accurate way to do this)
            //

            const invoices = await stripe.invoices.list({
              limit: 100, // it'd be impossible for a customer to hit this (at least right now)
              customer: session.customer,
              subscription: subscription.id
            });

            // never would happen but just having it here
            if (invoices.has_more) {
              // <https://github.com/stripe/stripe-node/issues/1796>
              // ctx.logger.fatal(new Error('Invoices had more', { session }));
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

              // check payment intent status (must be successful)
              if (paymentIntent.status !== 'succeeded') {
                // remove the Payment on our side if any that corresponds to this intent
                const payment = await Payments.findOne({
                  user: ctx.state.user._id,
                  stripe_payment_intent_id: paymentIntent.id
                });
                if (payment) {
                  // remove the payment from our side
                  await payment.remove();
                  // find and save the associated user
                  // so that their plan_expires_at gets updated
                  await ctx.state.user.save();
                }

                throw ctx.translateError('INVALID_PAYMENT_INTENT');
              }

              const paymentMethod = await stripe.paymentMethods.retrieve(
                paymentIntent.payment_method
              );

              if (!paymentMethod) throw ctx.translateError('UNKNOWN_ERROR');

              if (paymentMethod.type === 'card') {
                ({
                  brand: method,
                  exp_month: expMonth,
                  exp_year: expYear,
                  last4
                } = paymentMethod.card);
                if (_.isObject(paymentMethod.card.wallet)) {
                  if (paymentMethod.card.wallet.type === 'apple_pay')
                    isApplePay = true;
                  else if (paymentMethod.card.wallet.type === 'google_pay')
                    isGooglePay = true;
                }
              } else {
                method = paymentMethod.type;
              }
            }
          }
        }
      } catch (err) {
        ctx.logger.fatal(err);
        // email admins here
        emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: paymentIntent
              ? `Error retrieving Stripe Payment Method ID ${paymentIntent.payment_method} for ${ctx.state.user.email}`
              : `Stripe Payment Intent/Method Error for ${ctx.state.user.email}`
          },
          locals: {
            message: `<pre><code>${safeStringify(
              parseErr(err),
              null,
              2
            )}</code></pre>`
          }
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

      if (subscription) {
        // if user already has a subscription then switch them and cancel the old one
        // (in case webhook ran faster than redirect)
        if (
          isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) &&
          ctx.state.user[config.userFields.stripeSubscriptionID] !==
            subscription.id
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
                to: config.alertsEmail,
                subject: `Error deleting Stripe subscription ID ${
                  ctx.state.user[config.userFields.stripeSubscriptionID]
                } for ${ctx.state.user.email}`
              },
              locals: {
                message: `<pre><code>${safeStringify(
                  parseErr(err),
                  null,
                  2
                )}</code></pre>`
              }
            })
              .then()
              .catch((err) => ctx.logger.fatal(err));
          }
        }

        // save the new subscription ID to their account (so they can 1-click cancel subscriptions)
        ctx.state.user[config.userFields.stripeSubscriptionID] =
          subscription.id;
      }

      //
      // we only want to create or find an existing payment
      // if it was not a subscription
      // OR not a subscription trial
      //
      if (!subscription || subscription.status !== 'trialing') {
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
              kind: subscription ? 'subscription' : 'one-time',
              invoice_at: paymentIntent
                ? dayjs.unix(paymentIntent.created).toDate()
                : now,
              stripe_invoice_id: invoiceId,
              stripe_subscription_id: subscription?.id,
              is_apple_pay: isApplePay,
              is_google_pay: isGooglePay,
              stack: new Error('stack').stack
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
              to: config.alertsEmail,
              subject: `Error retrieving/creating stripe payment for ${ctx.state.user.email}`
            },
            locals: {
              message: `<pre><code>${safeStringify(
                parseErr(err),
                null,
                2
              )}</code></pre>`
            }
          })
            .then()
            .catch((err) => ctx.logger.fatal(err));
        }
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
            to: config.alertsEmail,
            subject: `Error saving user for ${ctx.state.user.email}`
          },
          locals: {
            message: `<pre><code>${safeStringify(
              parseErr(err),
              null,
              2
            )}</code></pre>`
          }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      //
      // send the user an email that they successfully enabled auto-renew
      // and also inform them when they will be first billed
      // (by leveraging `subscription.billing_cycle_anchor` (unix timestamp))
      //
      if (subscription && subscription.status === 'trialing') {
        const subject = striptags(
          ctx.translate(
            'AUTO_RENEW_STARTS',
            dayjs.unix(subscription.billing_cycle_anchor).format('M/D/YY')
          )
        );
        const message = ctx.translate('AUTO_RENEW_ENABLED');
        emailHelper({
          template: 'alert',
          message: {
            to:
              ctx.state.user[config.userFields.receiptEmail] ||
              ctx.state.user.email,
            ...(ctx.state.user[config.userFields.receiptEmail]
              ? { cc: ctx.state.user.email }
              : {}),
            subject
          },
          locals: {
            user: ctx.state.user.toObject(),
            message
          }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      // cancel the user's paypal subscription if they had one
      // and if the session.mode was equal to subscription
      if (
        subscription &&
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
              to: config.alertsEmail,
              subject: `Error deleting PayPal subscription ID ${
                ctx.state.user[config.userFields.paypalSubscriptionID]
              } for ${ctx.state.user.email}`
            },
            locals: {
              message: `<pre><code>${safeStringify(
                parseErr(err),
                null,
                2
              )}</code></pre>`
            }
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
        !['team', 'enhanced_protection', 'enterprise'].includes(
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
      // Use retry logic for PayPal capture operations due to infrastructure delays
      try {
        await retryPayPalRequest(
          async () => {
            const agent1 = await paypalAgent();
            const response = await agent1.post(
              `/v2/checkout/orders/${body.id}/capture`
            );
            // parse the transaction id
            if (response.body?.purchase_units?.[0]?.payments?.captures?.[0]?.id)
              transactionId =
                response.body.purchase_units[0].payments.captures[0].id;
          },
          {
            retries: 3,
            additionalStatusCodes: [404], // PayPal infrastructure delays cause 404s
            calculateDelay: (count) => Math.round(1000 * 2 ** count) // 2s, 4s, 8s
          }
        );
      } catch (err) {
        ctx.logger.warn(err, {
          paypal_order_id: body.id,
          user_email: ctx.state.user.email,
          retry_count: err.retryCount || 0,
          max_retries: err.maxRetries || 0
        });

        // Only email admins for non-422 errors and include retry information
        if (!err.status || err.status !== 422) {
          const isRetryExhausted = err.retryCount >= (err.maxRetries || 0);
          emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `${
                isRetryExhausted ? 'CRITICAL: ' : ''
              }Error while capturing PayPal order payment for ${
                ctx.state.user.email
              }${isRetryExhausted ? ' (Retries Exhausted)' : ''}`
            },
            locals: {
              message: `<pre><code>PayPal Order ID: ${body.id}
User Email: ${ctx.state.user.email}
Retry Count: ${err.retryCount || 0}/${err.maxRetries || 0}
Error Status: ${err.status || err.statusCode || 'Unknown'}

${safeStringify(parseErr(err), null, 2)}</code></pre>`
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
            reference: body.purchase_units[0].invoice_id
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
            reference: body.purchase_units[0].invoice_id,
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
            invoice_at: now,
            stack: new Error('stack').stack
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
            to: config.alertsEmail,
            subject: `Error retrieving/creating paypal payment for ${ctx.state.user.email}`
          },
          locals: {
            message: `<pre><code>${safeStringify(
              parseErr(err),
              null,
              2
            )}</code></pre>`
          }
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
            to: config.alertsEmail,
            subject: `Error saving user for ${ctx.state.user.email}`
          },
          locals: {
            message: `<pre><code>${safeStringify(
              parseErr(err),
              null,
              2
            )}</code></pre>`
          }
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
        !isSANB(body.subscriber.payer_id)
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
              to: config.alertsEmail,
              subject: `Error deleting PayPal subscription ID ${
                ctx.state.user[config.userFields.paypalSubscriptionID]
              } for ${ctx.state.user.email}`
            },
            locals: {
              message: `<pre><code>${safeStringify(
                parseErr(err),
                null,
                2
              )}</code></pre>`
            }
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

      // get the date
      let now = new Date();
      if (body.start_time) {
        now = new Date(body.start_time);
      }

      if (!_.isDate(now)) now = new Date();

      // set planSetAt (since we're changing plans or making an upgrade/change to the plan)
      if (!isMakePayment && !isEnableAutoRenew) {
        ctx.state.user[config.userFields.planSetAt] = now;
      }

      // these all occur in parallel, but the only one we need to work is saving domain

      //
      // we only want to create or find an existing payment
      // if it was not a subscription trial
      //
      const hasPayment =
        _.isObject(body.billing_info) &&
        _.isObject(body.billing_info.last_payment) &&
        _.isObject(body.billing_info.last_payment.amount) &&
        body.billing_info.last_payment.amount.value;

      if (hasPayment) {
        try {
          // parse the amount for later
          const amount = Number(body.billing_info.last_payment.amount.value);
          if (!_.isFinite(amount) || amount <= 0)
            throw ctx.translateError('UNKNOWN_ERROR');

          //
          // NOTE: we NEED to wait for the transaction to appear because
          //       PayPal yet again has issues with their API...
          //
          // Wait until the transaction appears in PayPal's system
          // instead of using an artificial delay
          //
          let transactionId;
          await pWaitFor(
            async () => {
              const agent = await paypalAgent();
              const { body: { transactions } = {} } = await agent.get(
                `/v1/billing/subscriptions/${
                  body.id
                }/transactions?start_time=${dayjs()
                  .subtract(1, 'day')
                  .toDate()
                  .toISOString()}&end_time=${dayjs()
                  .add(1, 'day')
                  .toDate()
                  .toISOString()}`
              );

              if (Array.isArray(transactions) && transactions.length > 0) {
                transactionId = transactions[0].id;
                if (_.isDate(new Date(transactions[0].time)))
                  now = new Date(transactions[0].time);
                return true;
              }

              return false;
            },
            {
              interval: ms('2s'),
              timeout: ms('30s')
            }
          );

          //
          // NOTE: we don't want to re-create the payment if the paypal webhook already did
          //
          const $or = [
            {
              user: ctx.state.user._id,
              paypal_subscription_id: body.id,
              invoice_at: now
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
              // NOTE: paypal subscriptions don't allow you to pass a reference
              amount: Number.parseInt(amount * 100, 10), // convert to cents for consistency with stripe
              method: 'paypal',
              duration: ms(duration),
              plan: ctx.query.plan,
              kind: 'subscription',
              paypal_subscription_id: body.id,
              paypal_transaction_id: transactionId,
              invoice_at: now,
              stack: new Error('stack').stack
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
              to: config.alertsEmail,
              subject: `Error retrieving/creating paypal payment for ${ctx.state.user.email}`
            },
            locals: {
              message: `<pre><code>${safeStringify(
                parseErr(err),
                null,
                2
              )}</code></pre>`
            }
          })
            .then()
            .catch((err) => ctx.logger.fatal(err));
        }
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
            to: config.alertsEmail,
            subject: `Error saving user for ${ctx.state.user.email}`
          },
          locals: {
            message: `<pre><code>${safeStringify(
              parseErr(err),
              null,
              2
            )}</code></pre>`
          }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      //
      // send the user an email that they successfully enabled auto-renew
      // and also inform them when they will be first billed
      // (by leveraging `subscription.billing_cycle_anchor` (unix timestamp))
      //
      if (!hasPayment) {
        const subject = striptags(
          ctx.translate(
            'AUTO_RENEW_STARTS',
            dayjs(new Date(body.start_time)).format('M/D/YY')
          )
        );
        const message = ctx.translate('AUTO_RENEW_ENABLED');
        emailHelper({
          template: 'alert',
          message: {
            to:
              ctx.state.user[config.userFields.receiptEmail] ||
              ctx.state.user.email,
            ...(ctx.state.user[config.userFields.receiptEmail]
              ? { cc: ctx.state.user.email }
              : {}),
            subject
          },
          locals: {
            user: ctx.state.user.toObject(),
            message
          }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      // cancel the user's stripe subscription if they had one
      // (since a user shouldn't have both PayPal subscription and Stripe subscription)
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
              to: config.alertsEmail,
              subject: `Error deleting Stripe subscription ID when user set up PayPal${
                ctx.state.user[config.userFields.stripeSubscriptionID]
              } for ${ctx.state.user.email}`
            },
            locals: {
              message: `<pre><code>${safeStringify(
                parseErr(err),
                null,
                2
              )}</code></pre>`
            }
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
      domain.resolver = ctx.resolver;
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
          plan: { $in: ['enhanced_protection', 'team', 'enterprise'] }
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
                    to: config.alertsEmail,
                    subject: `Error deleting Stripe subscription ID ${
                      ctx.state.user[config.userFields.stripeSubscriptionID]
                    } for ${ctx.state.user.email}`
                  },
                  locals: {
                    message: `<pre><code>${safeStringify(
                      parseErr(err),
                      null,
                      2
                    )}</code></pre>`
                  }
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
                    to: config.alertsEmail,
                    subject: `Error deleting PayPal subscription ID ${
                      ctx.state.user[config.userFields.paypalSubscriptionID]
                    } for ${ctx.state.user.email}`
                  },
                  locals: {
                    message: `<pre><code>${safeStringify(
                      parseErr(err),
                      null,
                      2
                    )}</code></pre>`
                  }
                })
                  .then()
                  .catch((err) => ctx.logger.fatal(err));
              }
            })()
          : Promise.resolve()
      ]);
    }

    // flash message and redirect
    ctx.flash(
      'success',
      isMakePayment
        ? ctx.translate('ONE_TIME_PAYMENT_SUCCESSFUL')
        : isEnableAutoRenew
        ? ctx.translate('AUTO_RENEW_ENABLED')
        : ctx.translate(`${ctx.query.plan.toUpperCase()}_PLAN`)
    );

    //
    // if the user switched plans and were not originally on the free plan then
    // refund the user's last payment completely if it was within 30 days from their plan start date
    //
    if (
      isAccountUpgrade &&
      originalPlan !== 'free' &&
      ctx.query.plan !== originalPlan &&
      dayjs().isBefore(dayjs(originalPlanSetAt).add(30, 'days')) &&
      ctx.state.paymentCount === 0 &&
      ctx.state.paymentIds.length > 0
    ) {
      //
      // refund all payments that the user made
      // on both stripe and/or paypal
      // (find all payments that have invoice_at >= original_plan_set_at)
      // (and invoice_at <= original_plan_set_at + 30 days)
      // (and that were of the same original plan)
      //
      // if the user had any payments in the past before original_plan_set_at
      // then we can assume that they're not a first-time customer (and this does not apply)
      //
      try {
        //
        // this helper function will simply return early if the payment was already refunded
        // note that we iterate in series due to PayPal API rate limitations
        //
        const refundedPayments = await pMapSeries(
          ctx.state.paymentIds,
          refundHelper
        );

        // flash a message with a total of how much was refunded
        ctx.flash(
          'success',
          ctx.translate(
            'REFUND_SUCCESSFUL',
            numeral(
              Math.round(_.sumBy(refundedPayments, 'amount_refunded') / 100)
            ).format('$0,0,0.00')
          )
        );

        //
        // users will automatically get PDF receipts in the background
        // (thanks to the logic in `jobs/payment-email.js` to detect refunds)
        // (note that we BCC support@ inbox in order to monitor refund abusers)
        //
      } catch (err) {
        ctx.logger.fatal(err);
        // flash an error message to users that
        // an error occurred while refunding payments
        // and we will follow-up by email
        ctx.flash('error', ctx.translate('REFUND_ERROR_OCCURRED'));
        // email admins here (in the background)
        emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: `A refund error occurred for ${ctx.state.user.email}`
          },
          locals: {
            message: `<pre><code>${safeStringify(
              parseErr(err),
              null,
              2
            )}</code></pre>`
          }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }
    }
    //
    // NOTE: we render to users in advance the amount of credit users will get awarded
    //       when they switch between Enhanced Protection and Team plans
    //       (that way they don't think they need to pay for another 2 years for example)
    //
    // NOTE: issue new credit to the closest duration or zero
    //       based off the conversion between the paid plans amounts
    //       (we will already handle full refunds if in 30 days above)
    //
    // NOTE: we need this here in case when we deploy anyone was going through checkout
    //
    else if (
      isAccountUpgrade &&
      originalPlan !== 'free' &&
      ctx.query.plan !== 'free' &&
      originalPlan !== ctx.query.plan &&
      ctx.state.conversion[ctx.query.plan].length > 0
    ) {
      try {
        const now = new Date();
        await Payments.create(
          ctx.state.conversion[ctx.query.plan].map((payment) => ({
            ...payment,
            stack: new Error('stack').stack,
            invoice_at: now
          }))
        );
        ctx.flash(
          'success',
          ctx.translate(
            'CONVERSION_SUCCESS',
            dayjs()
              .add(
                _.sumBy(ctx.state.conversion[ctx.query.plan], 'duration'),
                'ms'
              )
              .locale(ctx.locale)
              .fromNow(true)
          )
        );
        await ctx.state.user.save();
      } catch (err) {
        ctx.logger.fatal(err);

        // flash an error message to users that
        // an error occurred while refunding payments
        // and we will follow-up by email
        ctx.flash('error', ctx.translate('CONVERSION_ERROR_OCCURRED'));
        // email admins here (in the background)
        emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: `A refund error occurred for ${ctx.state.user.email}`
          },
          locals: {
            message: `<pre><code>${safeStringify(
              parseErr(err),
              null,
              2
            )}</code></pre>`
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
        const message = ctx.translate(
          'USER_UPGRADED_ACCOUNT_NOT_DOMAINS_MESSAGE'
        );
        const subject = ctx.translate(
          'USER_UPGRADED_ACCOUNT_NOT_DOMAINS_SUBJECT'
        );
        if (ctx.accepts('html')) ctx.flash('warning', message);
        emailHelper({
          template: 'alert',
          message: {
            to: ctx.state.user.email,
            subject
          },
          locals: { user: ctx.state.user.toObject(), message }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }
    }

    //
    // if there was a bad domain in query from redirect
    // and it was account upgrade, then we should create the domain
    // and also create it with a default alias (and subsequently redirect the user)
    //
    if (isAccountUpgrade && ctx.state.bad_domain) {
      try {
        const domain = await Domains.create({
          members: [{ user: ctx.state.user._id, group: 'admin' }],
          name: ctx.state.bad_domain,
          locale: ctx.locale,
          plan: ctx.state.user.plan,
          resolver: ctx.resolver
        });
        await Aliases.create({
          user: ctx.state.user._id,
          domain: domain._id,
          name: '*',
          recipients: [ctx.state.user.email],
          locale: ctx.locale
        });
        if (domain.name.startsWith('www.'))
          ctx.flash(
            'error',
            ctx
              .translate('WWW_WARNING')
              .replace(/example.com/g, domain.name.replace('www.', ''))
          );
        // redirect user to the domain to setup forwarding
        redirectTo = ctx.state.l(
          `/my-account/domains/${punycode.toASCII(domain.name)}`
        );
      } catch (err) {
        ctx.logger.fatal(err);
        ctx.flash('error', err.message);
      }
    }

    //
    // if the user was submitting a denylist request
    // then we need to redirect them back to the same page
    //
    if (isAccountUpgrade && ctx.state.denylist) {
      ctx.flash('success', ctx.translate('INSTANT_DENYLIST_AVAILABLE'));
      redirectTo = ctx.state.l(`/denylist?q=${ctx.state.denylist}`);
    }

    // if the user doesn't have any domains yet then redirect them to create a new one
    try {
      const count = await Aliases.countDocuments({
        domain: { $in: ctx.state.domains.map((d) => d._id) },
        user: ctx.state.user._id
      });
      if (count === 0) redirectTo = ctx.state.l('/my-account/domains/new');
    } catch (err) {
      ctx.logger.fatal(err);
    }

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.fatal(err);

    // TODO: suppress bugs here (e.g. redis/mongo with gateway error)

    if (ctx.accepts('html')) {
      ctx.flash(err.is_success ? 'success' : 'error', err.message);
      return ctx.redirect(redirectTo);
    }

    throw err;
  }
}

module.exports = retrieveDomainBilling;
