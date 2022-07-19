const path = require('path');

const accounting = require('accounting');
const capitalize = require('lodash/capitalize');
const cryptoRandomString = require('crypto-random-string');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const pify = require('pify');
const pug = require('pug');
const titleize = require('titleize');
const webResourceInliner = require('web-resource-inliner');
const wkhtmltopdf = require('wkhtmltopdf');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const config = require('#config');
const i18n = require('#helpers/i18n');

const inline = pify(webResourceInliner.html);

const Payment = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  reference: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
    index: true
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
  invoice_at: {
    type: Date,
    required: true,
    index: true
  },
  receipt_sent_at: Date,
  amount_formatted: {
    type: String,
    required: true,
    default: 0
  },
  is_apple_pay: { type: Boolean, default: false },
  is_google_pay: { type: Boolean, default: false },
  method: {
    default: 'unknown',
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    index: true,
    enum: [
      // defaults to unknown if any errors occur
      // (this is also a type from Stripe payment_method.card.brand)
      // (and we have a job that detects unknown methods to notify us)
      'unknown',
      // paypal
      'paypal',
      // if we give free credit to users
      'free_beta_program',
      // when stripe's payment.type === 'card'
      'amex',
      'diners',
      'discover',
      'jcb',
      'mastercard',
      'unionpay',
      'visa',
      // <https://stripe.com/docs/api/payment_methods/object?lang=node>
      // otherwise when it's !== 'card' we use payment.type as value
      'acss_debit',
      'affirm',
      'afterpay_clearpay',
      'alipay',
      'au_becs_debit',
      'bacs_debit',
      'bancontact',
      'blik',
      'boleto',
      // unsupported
      // 'card',
      // 'card_present',
      // 'customer_balance',
      'eps',
      'fpx',
      'giropay',
      'grabpay',
      'ideal',
      'interac_present',
      'klarna',
      'konbini',
      'link',
      'oxxo',
      'p24',
      'paynow',
      'promptpay',
      'sepa_debit',
      'sofort',
      'us_bank_account',
      'wechat_pay'
    ]
  },
  // this is the duration of time added
  // (e.g. to set or add to plan_expires_at)
  duration: {
    type: Number, // milliseconds
    required: true,
    enum: config.validDurations
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
    enum: ['enhanced_protection', 'team'],
    index: true
  },
  // note that we use "kind" here instead of "type"
  // since it is a reserved word in Schema definitions
  kind: {
    type: String,
    required: true,
    enum: ['one-time', 'subscription'],
    index: true
  },
  exp_month: Number,
  exp_year: Number,
  last4: String,
  stripe_session_id: { type: String, index: true },
  stripe_invoice_id: { type: String, index: true },
  stripe_payment_intent_id: { type: String, index: true },
  [config.userFields.stripeSubscriptionID]: { type: String, index: true },
  paypal_order_id: { type: String, index: true },
  [config.userFields.paypalSubscriptionID]: { type: String, index: true },
  paypal_transaction_id: { type: String, index: true }
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
    this.amount_formatted = accounting.formatMoney(
      Number.isFinite(this.amount_refunded) &&
        this.amount_refunded > 0 &&
        this.amount_refunded <= this.amount
        ? (this.amount - this.amount_refunded) / 100
        : this.amount / 100
    );

    if (!isSANB(this.reference))
      this.reference = await cryptoRandomString.async(config.referenceOptions);

    // get unique reference recursively
    this.reference = await getUniqueReference(this);

    next();
  } catch (err) {
    next(err);
  }
});

Payment.plugin(mongooseCommonPlugin, {
  object: 'payment',
  defaultLocale: i18n.getLocale()
});

async function getPDFReceipt(
  payment,
  user,
  locale = i18n.getLocale(),
  returnHTML = false
) {
  const t = (phrase, ...args) => {
    return i18n.api.t(
      {
        phrase,
        locale
      },
      ...args
    );
  };

  const locals = {
    ...config.views.locals,
    locale,
    payment,
    user,
    isPDF: true,
    returnHTML,
    t
  };

  const html = pug.renderFile(
    path.join(
      config.views.root,
      'my-account',
      'billing',
      returnHTML ? '_receipt.pug' : 'pdf.pug'
    ),
    locals
  );

  if (returnHTML) return html;

  //
  // workaround because of these bugs with wkhtmltopdf and HTTPS
  //
  // <https://github.com/wkhtmltopdf/wkhtmltopdf/issues/4935>
  // <https://github.com/wkhtmltopdf/wkhtmltopdf/issues/4897>
  // <https://github.com/wkhtmltopdf/wkhtmltopdf/issues/4462>
  const inlinedHTML = await inline({
    fileContent: html,
    images: true,
    svgs: true,
    scripts: false,
    links: true,
    relativeTo: config.buildDir
  });

  const options = {
    debug: config.env !== 'production',
    pageSize: 'letter',
    background: true,
    imageDpi: 600,
    // NOTE: there is a bug with min-width and max-width
    // <https://github.com/wkhtmltopdf/wkhtmltopdf/issues/4375>
    // (so we set this to true so that we can leverage `d-print-x` classes
    printMediaType: true,
    enableJavaScript: false,
    disableJavascript: true,
    enableInternalLinks: false,
    disableInternalLinks: true
  };

  // returns a stream
  return wkhtmltopdf(inlinedHTML, options);
}

Payment.statics.getPDFReceipt = getPDFReceipt;

module.exports = mongoose.model('Payment', Payment);
