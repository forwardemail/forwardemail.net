/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The payment alerts (copied to staff) wrote the user's name and address,
// "Name <address>", into their HTML as it was: the address read as a tag,
// and disappeared from the email.
//

const test = require('ava');

// (the emails are recorded instead of sent; first, so that every module
// loaded below gets this one)
const sent = [];
const emailPath = require.resolve('#helpers/email');
require.cache[emailPath] = {
  id: emailPath,
  filename: emailPath,
  loaded: true,
  async exports(options) {
    sent.push(options);
  }
};

const utils = require('../utils');

const config = require('#config');
const { processEvent } = require('#controllers/api/v1/paypal');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

test('the name and address are escaped in the payment alert', async (t) => {
  const user = await t.context.userFactory
    .withState({
      [config.passport.fields.givenName]: 'Tom & Jerry',
      [config.passport.fields.familyName]: 'Smith'
    })
    .create();

  const logger = { error() {}, warn() {}, info() {}, debug() {}, fatal() {} };
  await processEvent({
    logger,
    request: {
      body: {
        id: 'WH-test',
        event_type: 'CHECKOUT.PAYMENT-APPROVAL.REVERSED',
        resource: {
          id: 'ORDER-test',
          purchase_units: [{ reference_id: user.id }]
        }
      }
    }
  });

  const alert = sent.find((options) => options.message?.to === user.email);
  t.truthy(alert);
  t.true(
    alert.locals.message.includes(
      `Hello Tom &amp; Jerry Smith &lt;${user.email}&gt;,`
    )
  );
});
