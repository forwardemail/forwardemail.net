const accounting = require('accounting');
const capitalize = require('lodash/capitalize');
const cryptoRandomString = require('crypto-random-string');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const titleize = require('titleize');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const config = require('#config');
const i18n = require('#helpers/i18n');

const Payment = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  reference: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    unique: true
  },
  amount: {
    type: Number,
    min: 0, // cents (not dollars)
    required: true
  },
  amount_refunded: {
    type: Number,
    min: 0 // cents (not dollars)
  },
  // when the payment was created by the payment provider(paypal/stripe)
  // which can vary significantly from the payment.created_at date
  // for automatic subscription payments
  invoice_at: Date,
  amount_formatted: {
    type: String,
    required: true
  },
  method: {
    default: 'unknown',
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    enum: [
      'amex',
      'diners',
      'discover',
      'jcb',
      'mastercard',
      'unionpay',
      'visa',
      'unknown',
      'paypal'
    ]
  },
  // this is the duration of time added
  // (e.g. to set or add to plan_expires_at)
  duration: {
    type: Number, // milliseconds
    required: true
  },
  // `description` is a virtual populated from
  // note that we don't store "description" because
  // it'd take up extra database storage over time
  // and we can easily virtually populate this
  // `duration` + `plan` + `kind`
  // (e.g. "1 year of Team Plan (subscription || one-time payment)")
  plan: {
    type: String,
    required: true,
    enum: ['enhanced_protection', 'team']
  },
  // note that we use "kind" here instead of "type"
  // since it is a reserved word in Schema definitions
  kind: {
    type: String,
    required: true,
    enum: ['one-time', 'subscription']
  },
  exp_month: Number,
  exp_year: Number,
  last4: String,
  stripe_session_id: String,
  stripe_invoice_id: String,
  stripe_subscription_id: String,
  stripe_payment_intent_id: String,
  paypal_order_id: String,
  [config.userFields.paypalSubscriptionID]: String,
  paypal_transaction_id: String
});

Payment.virtual('description').get(function () {
  const duration = dayjs()
    .add(this.duration, 'millisecond')
    .locale(this.locale)
    .fromNow(true);
  return i18n.translate(
    'PAYMENT_DESCRIPTION',
    this.locale,
    capitalize(this.kind),
    duration,
    titleize(humanize(this.plan))
  );
});

async function getUniqueReference(payment) {
  const count = await payment.constructor.countDocuments({
    _id: { $ne: payment._id },
    reference: payment.reference
  });
  // "upgrade" is a reserved word and we want to prevent a route param conflict
  if (count > 0 || payment.reference.toLowerCase() === 'upgrade') {
    payment.reference = await cryptoRandomString.async(config.referenceOptions);
    return getUniqueReference(payment);
  }

  return payment.reference;
}

Payment.pre('validate', async function (next) {
  try {
    this.amount_formatted = accounting.formatMoney(this.amount / 100);

    if (!isSANB(this.reference))
      this.reference = await cryptoRandomString.async(config.referenceOptions);

    // get unique reference recursively
    this.reference = await getUniqueReference(this);

    next();
  } catch (err) {
    next(err);
  }
});

Payment.plugin(mongooseCommonPlugin, { object: 'payment' });

module.exports = mongoose.model('Payment', Payment);
