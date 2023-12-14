const superagent = require('superagent');

async function sendRequest(body = {}, url = window.location.pathname) {
  const response = await superagent
    .post(url)
    .set({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    })
    .ok(() => true) // override so we can parse it ourselves
    .send(typeof body === 'string' ? body : JSON.stringify(body));

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

module.exports = sendRequest;
