const $ = require('jquery');
const Swal = require('sweetalert2');
const URLParse = require('url-parse');
const qs = require('qs');
const superagent = require('superagent');
const { spinner: Spinner } = require('@ladjs/assets');

const $formBilling = $('#form-billing');
const $stripeButtonContainer = $('#stripe-button-container');
const $paypalButtonContainer = $('#paypal-button-container');
const $paymentType = $('input[name="payment_type"][type="radio"]');
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

async function sendRequest(body) {
  const response = await superagent
    .post(window.location.pathname)
    .set({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    })
    .ok(() => true) // override so we can parse it ourselves
    .send(body);

  if (!response.ok) {
    response.err = new Error(
      response.statusText || response.text || 'Unsuccessful HTTP response'
    );
    if (
      typeof response.body === 'object' &&
      response.body !== null &&
      typeof response.body.message === 'string'
    ) {
      response.err = new Error(response.body.message);
    } else if (
      !Array.isArray(response.body) &&
      typeof response.body === 'object' &&
      response.body !== null &&
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

  return response;
}

function createPayPalSubscription(data, actions) {
  const duration = $paymentDuration.find('option:checked').val();
  if (typeof window.USER_PLAN !== 'string')
    throw new Error('"plan" key missing from parsed querystring');
  if (!PAYPAL_MAPPING[window.USER_PLAN])
    throw new Error(`The plan "${window.USER_PLAN}" does not exist`);
  if (!PAYPAL_MAPPING[window.USER_PLAN][duration])
    throw new Error(
      `The plan "${window.USER_PLAN}" does not have a duration for "${duration}"`
    );
  const options = {
    intent: 'subscription',
    plan_id: PAYPAL_MAPPING[window.USER_PLAN][duration],
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
  };
  // TODO: we need to validate the subscription start_time on the server-side
  // start time is current time + 1 minute
  if (window.PLAN_EXPIRES_AT) options.start_time = window.PLAN_EXPIRES_AT; // new Date(Date.now() + 1000 * 60).toISOString()
  return actions.subscription.create(options);
}

async function createPayPalOrder() {
  const body = qs.parse($formBilling.serialize());
  const response = await sendRequest(body);

  // Check if any errors occurred
  if (response.err) {
    // render an alert
    Swal.fire(window._types.error, response.err.message, 'error');

    // reject the promise
    throw response.err;
  }

  //
  // Either display a success message, redirect user, or reload page
  //
  // Use the same key name for order ID on the client and server
  if (
    typeof response.body === 'object' &&
    response.body !== null &&
    typeof response.body.orderID === 'string'
  )
    return response.body.orderID;

  // Prepare a message
  const message =
    response.statusText ||
    response.text ||
    'Invalid response, please try again';
  // Hide the spinner
  spinner.hide();
  // Show message
  Swal.fire(window._types.error, message, 'error');
  throw new Error(message);
}

// TODO: ajaxForm from @ladjs/assets should accept a callback function
// which gets passed as the success callback to optionally do something custom
$formBilling.on('submit', async function (ev) {
  try {
    ev.preventDefault();
    spinner.show();
    const body = qs.parse($(this).serialize());
    const response = await sendRequest(body);

    // Check if any errors occurred
    if (response.err) throw response.err;

    // If there is a redirection in the body then
    // we can assume there was an error and redirect the user
    if (
      typeof response.body === 'object' &&
      typeof response.body.redirectTo === 'string'
    ) {
      window.location = response.body.redirectTo;
      return;
    }

    // Prepare a message if the body is not accurate
    if (
      typeof response.body !== 'object' ||
      response.body === null ||
      !(
        typeof response.body.sessionId === 'string' ||
        typeof response.body.invoiceId === 'string'
      )
    )
      throw new Error(
        response.statusText ||
          response.text ||
          'Invalid response, please try again'
      );

    const { sessionId } = response.body;
    if (sessionId) {
      const result = await stripe.redirectToCheckout({ sessionId });
      spinner.hide();
      Swal.fire(window._types.error, result.error.message, 'error');
    }
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
    ['2y', '3y'].includes($paymentDuration.find('option:checked').val())
  )
    $paymentDuration.val('1y');

  // conditionally update buttons
  updatePayButtons();
});

// when the user changes payment method to PayPal
// we need to hide the "Continue" button and render
// that PayPal button instead using their SDK
// (and subsequently on toggle state switch it back)
$paymentMethod.on('change', updatePayButtons);

function updatePayButtons() {
  const paymentMethod = $('input[name="payment_method"]:checked').val();
  const paymentType =
    $('input[name="payment_type"][type="radio"]').length > 0
      ? $('input[name="payment_type"][type="radio"]:checked').val()
      : $('input[name="payment_type"][type="hidden"]').val();
  const $subscriptionInput = $('input#input-payment-type-subscription');

  if (paymentMethod === 'credit_card') {
    // destroy the button if we need to
    // (if button was set this indicates paypal is active)
    if (button) button.close();

    // enable subscription input
    $subscriptionInput.prop('disabled', false);

    // hide the other pay containers
    $paypalButtonContainer.addClass('d-none');

    // show the stripe container
    $stripeButtonContainer.removeClass('d-none');
    return;
  }

  if (paymentMethod === 'paypal') {
    // enable subscription input
    $subscriptionInput.prop('disabled', false);

    // hide the other pay containers
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
    // props.onApprove = function (data, actions) {
    props.onApprove = function (data) {
      spinner.show();
      if (data.subscriptionID)
        url.query.paypal_subscription_id = data.subscriptionID;
      else if (data.orderID) url.query.paypal_order_id = data.orderID;
      window.location = url.toString((query) =>
        qs.stringify(query, { addQueryPrefix: true, format: 'RFC1738' })
      );
    };

    if (paymentType === 'subscription')
      props.createSubscription = createPayPalSubscription;
    else props.createOrder = createPayPalOrder;

    // attach it to the container and render it
    // eslint-disable-next-line new-cap
    button = window.paypal.Buttons(props);
    button.render('#paypal-button-container');
  }
}
