/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const Boom = require('@hapi/boom');
// const numeral = require('numeral');
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
const env = require('#config/env');
const i18n = require('#helpers/i18n');

const inline = pify(webResourceInliner.html);

const Payments = new mongoose.Schema({
  //
  // stack trace similar to `console.trace();`
  // generated via `new Error().stack` which is useful for determining culprit if duplicate payments occur
  // (or payments that were created that should not have been created)
  //
  stack: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
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
  currency: {
    type: String,
    default: 'usd',
    lowercase: true,
    trim: true,
    enum: [
      //
      // NOTE: Last updated: June 13, 2024
      // <https://docs.stripe.com/currencies#presentment-currencies>
      //
      'aed',
      'afn',
      'all',
      'amd',
      'ang',
      'aoa',
      'ars',
      'aud',
      'awg',
      'azn',
      'bam',
      'bbd',
      'bdt',
      'bgn',
      'bif',
      'bmd',
      'bnd',
      'bob',
      'brl',
      'bsd',
      'bwp',
      'byn',
      'bzd',
      'cad',
      'cdf',
      'chf',
      'clp',
      'cny',
      'cop',
      'crc',
      'cve',
      'czk',
      'djf',
      'dkk',
      'dop',
      'dzd',
      'egp',
      'etb',
      'eur',
      'fjd',
      'fkp',
      'gbp',
      'gel',
      'gip',
      'gmd',
      'gnf',
      'gtq',
      'gyd',
      'hkd',
      'hnl',
      'htg',
      'huf',
      'idr',
      'ils',
      'inr',
      'isk',
      'jmd',
      'jpy',
      'kes',
      'kgs',
      'khr',
      'kmf',
      'krw',
      'kyd',
      'kzt',
      'lak',
      'lbp',
      'lkr',
      'lrd',
      'lsl',
      'mad',
      'mdl',
      'mga',
      'mkd',
      'mmk',
      'mnt',
      'mop',
      'mur',
      'mvr',
      'mwk',
      'mxn',
      'myr',
      'mzn',
      'nad',
      'ngn',
      'nio',
      'nok',
      'npr',
      'nzd',
      'pab',
      'pen',
      'pgk',
      'php',
      'pkr',
      'pln',
      'pyg',
      'qar',
      'ron',
      'rsd',
      'rub',
      'rwf',
      'sar',
      'sbd',
      'scr',
      'sek',
      'sgd',
      'shp',
      'sle',
      'sos',
      'srd',
      'std',
      'szl',
      'thb',
      'tjs',
      'top',
      'try',
      'ttd',
      'twd',
      'tzs',
      'uah',
      'ugx',
      'usd',
      'uyu',
      'uzs',
      'vnd',
      'vuv',
      'wst',
      'xaf',
      'xcd',
      'xof',
      'xpf',
      'yer',
      'zar',
      'zmw'
    ]
  },
  exchange_rate: {
    type: Number,
    min: 0,
    default: 1
  },
  fee: {
    type: Number,
    min: 0, // cents (not dollars)
    default: 0
  },
  amount: {
    type: Number,
    min: 0, // cents (not dollars)
    required: true
  },
  amount_refunded: {
    type: Number,
    min: 0, // cents (not dollars)
    index: true
  },
  currency_amount: {
    type: Number,
    min: 0 // cents (not dollars)
  },
  currency_amount_refunded: {
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
  refund_receipt_sent_at: {
    type: Date,
    index: true
  },
  amount_formatted: {
    type: String,
    required: true,
    default: 0
  },
  is_apple_pay: { type: Boolean, default: false },
  is_google_pay: { type: Boolean, default: false },
  is_legacy_paypal: { type: Boolean, default: false, index: true },
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
      // Used for PayPal payments
      'paypal',
      // if we give free credit to users
      'free_beta_program',
      // if we convert between plans
      'plan_conversion',
      // Used to debit Canadian bank accounts through the Automated Clearing Settlement System (ACSS)
      'acss_debit',
      // A buy now, pay later payment method in the US
      'affirm',
      // A buy now, pay later payment method used in Australia, Canada, France, New Zealand, Spain, the UK, and the US
      'afterpay_clearpay',
      // A digital wallet payment method used in China
      'alipay',
      // A Buy Now, Pay Later payment method that lets customers pay in 2, 3, or 4 installments
      'alma',
      // A Wallet payment method that lets hundreds of millions of Amazon customers pay their way, every day
      'amazon_pay',
      // Used to debit Australian bank accounts through the Bulk Electronic Clearing System (BECS)
      'au_becs_debit',
      // Used for bank transfers in the UK
      'bacs_debit',
      // Used for bank transfers
      'bancontact',
      // Used for bank transfers in the EU
      'blik',
      // Used for bank transfers in Brazil
      'boleto',
      // Credit or debit card
      'card',
      // Used for card-based payments in the US
      'card_present',
      // Used for cash-based payments
      'cashapp',
      // Used for cryptocurrency payments (Note: This is for integration with crypto wallets, not direct crypto payments)
      'crypto',
      // Used for customer balance payments
      'customer_balance',
      // Used for bank transfers in the EU
      'eps',
      // Used for bank transfers in Malaysia
      'fpx',
      // Used for bank transfers in the EU
      'giropay',
      // Used for bank transfers in Southeast Asia
      'grabpay',
      // Used for bank transfers in the Netherlands
      'ideal',
      // Used for in-person payments in Canada
      'interac_present',
      // Used for buy now, pay later payments
      'klarna',
      // Used for convenience store payments in Japan
      'konbini',
      // Used for accelerated checkout with saved payment details
      'link',
      // Used for mobile payments in Nordic countries
      'mobilepay',
      // Used for bank transfers in Portugal
      'multibanco',
      // Used for cash voucher payments in Mexico
      'oxxo',
      // Used for bank transfers in Poland
      'p24',
      // Used for real-time payments in Singapore
      'paynow',
      // Used for prepaid card payments
      'paysafecard',
      // Used for QR code payments in Thailand
      'promptpay',
      // Used for Revolut payments
      'revolut_pay',
      // Used for bank transfers in the EU
      'sepa_debit',
      // Used for bank transfers in Germany, Austria, Belgium, Italy, Netherlands, and Spain
      'sofort',
      // Used for mobile payments in Sweden
      'swish',
      // Swiss mobile payment method
      'twint',
      // Used for bank transfers in the US
      'us_bank_account',
      // Used for digital wallet payments in China
      'wechat_pay',
      // Used for buy now, pay later payments
      'zip',
      // Card brand types from Stripe payment_method.card.brand
      'amex',
      'diners',
      'discover',
      'jcb',
      'mastercard',
      'unionpay',
      'visa'
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
  paypal_transaction_id: { type: String, index: true },
  is_refund_credit_allowed: {
    type: Boolean,
    default: false
  }
});

Payments.virtual('description').get(function () {
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
  // if the payment was not new then return early
  if (!payment.isNew) return payment.reference;

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

Payments.pre('validate', async function (next) {
  try {
    if (this.currency && this.currency !== 'usd') {
      const sum =
        Number.isFinite(this.currency_amount_refunded) &&
        this.currency_amount_refunded > 0 &&
        this.currency_amount_refunded <= this.currency_amount
          ? (this.currency_amount - this.currency_amount_refunded) / 100
          : this.currency_amount / 100;

      this.amount_formatted = new Intl.NumberFormat(this.locale || 'en-US', {
        style: 'currency',
        currency: this.currency.toUpperCase()
      }).format(sum);
    } else {
      const sum =
        Number.isFinite(this.amount_refunded) &&
        this.amount_refunded > 0 &&
        this.amount_refunded <= this.amount
          ? (this.amount - this.amount_refunded) / 100
          : this.amount / 100;

      // this.amount_formatted = numeral(sum).format('$0,0,0.00');
      this.amount_formatted = new Intl.NumberFormat(this.locale || 'en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(sum);
    }

    if (!isSANB(this.reference))
      this.reference = await cryptoRandomString.async(config.referenceOptions);

    // get unique reference recursively
    this.reference = await getUniqueReference(this);

    next();
  } catch (err) {
    next(err);
  }
});

//
// safeguard to attempt to prevent duplicates from stripe/paypal:
// - `stripe_payment_intent_id`
// - `paypal_transaction_id`
//
Payments.pre('save', async function (next) {
  // only check if this was a new document
  if (!this.isNew) return next();

  // don't check for unknown, free_beta_program, and plan_conversion methods
  if (['unknown', 'free_beta_program', 'plan_conversion'].includes(this.method))
    return next();

  // if it doesn't have either stripe payment intent or paypal tx id return early
  if (
    !isSANB(this.stripe_payment_intent_id) &&
    !isSANB(this.paypal_transaction_id)
  )
    return next();

  try {
    const query = {
      _id: {
        $ne: this._id
      }
    };
    if (isSANB(this.stripe_payment_intent_id)) {
      query.stripe_payment_intent_id = this.stripe_payment_intent_id;
    } else if (isSANB(this.paypal_transaction_id)) {
      query.paypal_transaction_id = this.paypal_transaction_id;
    } else {
      // safeguard
      throw new TypeError('Missing Stripe or PayPal transaction ID');
    }

    const exists = await this.constructor.exists(query);
    if (exists)
      throw Boom.badRequest(
        i18n.translateError('PAYMENT_ALREADY_EXISTS', this.locale)
      );
    next();
  } catch (err) {
    next(err);
  }
});

Payments.index({
  created_at: -1,
  method: 1,
  plan: 1
}); // Admin list with filters

Payments.index({
  method: 1,
  created_at: -1,
  amount: -1
}); // Payment method analysis

Payments.index({
  plan: 1,
  kind: 1,
  invoice_at: -1
}); // Plan analysis

Payments.index({
  amount_refunded: 1,
  created_at: -1
}); // Refund tracking

// Targeted indexes instead of broad text index
Payments.index({ reference: 1 }); // Exact reference lookup
Payments.index({ stripe_payment_intent_id: 1 }); // Stripe lookup
Payments.index({ paypal_transaction_id: 1 }); // PayPal lookup
Payments.index({ currency: 1 }); // Currency filtering
Payments.index({ method: 1 }); // Method filtering

// Compound index for user lookup with sorting (admin payments list optimization)
Payments.index({ user: 1, created_at: -1 }); // User payments with default sort

Payments.plugin(mongooseCommonPlugin, {
  object: 'payment',
  defaultLocale: i18n.config.defaultLocale
});

async function getPDFReceipt(
  payment,
  user,
  locale = i18n.config.defaultLocale,
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
    ctx: {
      path: '/',
      pathWithoutLocale: '/',
      get() {
        return '';
      }
    },
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
    debug: !env.AXE_SILENT,
    pageSize: 'letter',
    background: false,
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

Payments.statics.getPDFReceipt = getPDFReceipt;

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('Payments', Payments);
