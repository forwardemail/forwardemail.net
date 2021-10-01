const isSANB = require('is-string-and-not-blank');
const Boom = require('@hapi/boom');
const Stripe = require('stripe');

const env = require('../../../../config/env');
const config = require('../../../../config');

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function redirectToPortal(ctx) {
  if (!isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]))
    throw Boom.badRequest(ctx.translateError('INVALID_SUBSCRIPTION'));

  const session = await stripe.billingPortal.sessions.create({
    customer: ctx.state.user[config.userFields.stripeCustomerID],
    return_url: `${config.urls.web}${ctx.state.l('/my-account/billing')}`,
    locale: ctx.locale
  });

  ctx.redirect(session.url);
}

module.exports = redirectToPortal;
