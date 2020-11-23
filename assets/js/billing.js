const $ = require('jquery');
const Swal = require('sweetalert2');
const URLParse = require('url-parse');
const qs = require('qs');
const superagent = require('superagent');
const { spinner: Spinner } = require('@ladjs/assets');

const $formBilling = $('#form-billing');
const $stripeButtonContainer = $('#stripe-button-container');
const $paypalButtonContainer = $('#paypal-button-container');
const $paymentType = $('input[name="payment_type"]');
const $paymentMethod = $('input[name="payment_method"');
const $paymentDuration = $('select[name="payment_duration"]');
const $opts = $paymentDuration.find('option[data-no-subscription]');
const spinner = new Spinner($);
const stripe = new window.Stripe(process.env.STRIPE_PUBLISHABLE_KEY);

const url = new URLParse(window.location.href, (query) =>
  qs.parse(query, { ignoreQueryPrefix: true })
);

// clean up URL if needed
delete url.query.paypal_subscription_id;
delete url.query.paypal_order_id;
delete url.query.session_id;

let button;

const PAYPAL_MAPPING = {
  enhanced_protection: {
    '30d': process.env.PAYPAL_ENHANCED_PLAN_30D,
    '60d': process.env.PAYPAL_ENHANCED_PLAN_60D,
    '90d': process.env.PAYPAL_ENHANCED_PLAN_90D,
    '180d': process.env.PAYPAL_ENHANCED_PLAN_180D,
    '1y': process.env.PAYPAL_ENHANCED_PLAN_1Y
  },
  team: {
    '30d': process.env.PAYPAL_TEAM_PLAN_30D,
    '60d': process.env.PAYPAL_TEAM_PLAN_60D,
    '90d': process.env.PAYPAL_TEAM_PLAN_90D,
    '180d': process.env.PAYPAL_TEAM_PLAN_180D,
    '1y': process.env.PAYPAL_TEAM_PLAN_1Y
  }
};

function createSubscription(data, actions) {
  const duration = $paymentDuration.find('option:checked').val();
  if (typeof url.query.plan !== 'string')
    throw new Error('"plan" key missing from parsed querystring');
  if (!PAYPAL_MAPPING[url.query.plan])
    throw new Error(`The plan "${url.query.plan}" does not exist`);
  if (!PAYPAL_MAPPING[url.query.plan][duration])
    throw new Error(
      `The plan "${url.query.plan}" does not have a duration for "${duration}"`
    );
  return actions.subscription.create({
    intent: 'subscription',
    plan_id: PAYPAL_MAPPING[url.query.plan][duration],
    // start time is current time + 1 minute
    start_time: new Date(Date.now() + 1000 * 60).toISOString(),
    subscriber: {
      email_address: window.USER.email
    },
    application_context: {
      brand_name: 'Forward Email',
      shipping_preference: 'NO_SHIPPING',
      user_action: 'SUBSCRIBE_NOW',
      payment_method: {
        payer_selected: 'PAYPAL',
        payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
      },
      cancel_url: window.location.href
        .replace('localhost:3000', 'forwardemail.net')
        .replace('http://', 'https://')
    }
  });
}

function createOrder() {
  const body = qs.parse($formBilling.serialize());
  return (
    superagent
      .post(window.location.pathname)
      .set({
        'X-CSRF-Token': window._csrf,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
      .ok(() => true) // override so we can parse it ourselves
      .send(body)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then((response) => {
        if (!response.ok) {
          response.err = new Error(
            response.statusText || response.text || 'Unsuccessful HTTP response'
          );
          if (
            typeof response.body === 'object' &&
            typeof response.body.message === 'string'
          ) {
            response.err = new Error(response.body.message);
          } else if (
            !Array.isArray(response.body) &&
            // attempt to utilize Stripe-inspired error messages
            typeof response.body.error === 'object'
          ) {
            if (response.body.error.message)
              response.err = new Error(response.body.error.message);
            if (response.body.error.stack)
              response.err.stack = response.body.error.stack;
            if (response.body.error.code)
              response.err.code = response.body.error.code;
            if (response.body.error.param)
              response.err.param = response.body.error.param;
          }
        }

        // Check if any errors occurred
        if (response.err) {
          // render an alert
          Swal.fire(window._types.error, response.err.message, 'error');

          // reject the promise
          throw response.err;
        }

        // Use the same key name for order ID on the client and server
        return response.body.orderID;
      })
  );
}

// TODO: ajaxForm from @ladjs/assets should accept a callback function
// which gets passed as the success callback to optionally do something custom
$formBilling.on('submit', async function (ev) {
  try {
    ev.preventDefault();
    spinner.show();

    const body = qs.parse($(this).serialize());

    const response = await superagent
      .post(window.location.pathname)
      .set({
        'X-CSRF-Token': window._csrf,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
      .ok(() => true) // override so we can parse it ourselves
      .send(body);

    if (!response.ok) {
      response.err = new Error(
        response.statusText || response.text || 'Unsuccessful HTTP response'
      );
      if (
        typeof response.body === 'object' &&
        typeof response.body.message === 'string'
      ) {
        response.err = new Error(response.body.message);
      } else if (
        !Array.isArray(response.body) &&
        // attempt to utilize Stripe-inspired error messages
        typeof response.body.error === 'object'
      ) {
        if (response.body.error.message)
          response.err = new Error(response.body.error.message);
        if (response.body.error.stack)
          response.err.stack = response.body.error.stack;
        if (response.body.error.code)
          response.err.code = response.body.error.code;
        if (response.body.error.param)
          response.err.param = response.body.error.param;
      }
    }

    // Check if any errors occurred
    if (response.err) throw response.err;

    const { sessionId } = response.body;
    const result = await stripe.redirectToCheckout({ sessionId });
    spinner.hide();
    Swal.fire(window._types.error, result.error.message, 'error');
  } catch (err) {
    spinner.hide();
    Swal.fire(window._types.error, err.message, 'error');
  }
});

// prevent user from selecting 2+ years
// when subscription type is selected
$paymentType.on('change', function () {
  const isSubscription = $(this).val() === 'subscription';
  $opts.prop('disabled', isSubscription);

  // reset to 1y if 1y+
  if (
    isSubscription &&
    ['2y', '3y', 'lifetime'].includes(
      $paymentDuration.find('option:checked').val()
    )
  )
    $paymentDuration.val('1y');

  // conditionally update paypal button
  updatePayPalButton();
});

// when the user changes payment method to PayPal
// we need to hide the "Continue" button and render
// that PayPal button instead using their SDK
// (and subsequently on toggle state switch it back)
$paymentMethod.on('change', updatePayPalButton);

function updatePayPalButton() {
  const paymentMethod = $('input[name="payment_method"]:checked').val();
  const paymentType = $('input[name="payment_type"]:checked').val();

  if (paymentMethod === 'credit_card') {
    // destroy the button if we need to
    // (if button was set this indicates paypal is active)
    if (button) button.close();

    // hide the paypal container
    $paypalButtonContainer.addClass('d-none');

    // show the stripe container
    $stripeButtonContainer.removeClass('d-none');
    return;
  }

  if (paymentMethod === 'paypal') {
    // hide the stripe container
    $stripeButtonContainer.addClass('d-none');

    // show the paypal container
    $paypalButtonContainer.removeClass('d-none');

    // if the button already exists, then only change it if we need to
    if (button) {
      // delete the current button
      button.close();
      // set it to null
      button = null;
    }

    // render the (appropriate) Smart Payment Button
    // (we have to do this approach because there's no way to switch between one-time capture and subscription currently)
    // <https://github.com/paypal/paypal-checkout-components/issues/1176>
    // <https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/#on-the-server>
    const props = {
      // <https://developer.paypal.com/docs/checkout/integration-features/customize-button/#layout>
      style: {
        color: 'black'
      },
      onError(err) {
        Swal.fire(window._types.error, err.message, 'error');
        console.error(err);
      }
    };

    // <https://developer.paypal.com/docs/checkout/integrate/#5-capture-the-transaction>
    props.onApprove = function (data, actions) {
      console.log('onApprove', { data, actions });
      spinner.show();
      if (data.subscriptionID)
        url.query.paypal_subscription_id = data.subscriptionID;
      else if (data.orderID) url.query.paypal_order_id = data.orderID;
      window.location = url.toString((query) =>
        qs.stringify(query, { addQueryPrefix: true, format: 'RFC1738' })
      );
    };

    if (paymentType === 'subscription')
      props.createSubscription = createSubscription;
    else props.createOrder = createOrder;

    // attach it to the container and render it
    // eslint-disable-next-line new-cap
    button = window.paypal.Buttons(props);
    button.render('#paypal-button-container');
  }
}
