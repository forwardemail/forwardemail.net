/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

const controller = fs.readFileSync(
  path.join(
    __dirname,
    '..',
    '..',
    'app',
    'controllers',
    'api',
    'v1',
    'paypal.js'
  ),
  'utf8'
);

test('reserves a verified PayPal webhook event before scheduling processing', (t) => {
  const signatureVerification = controller.lastIndexOf(
    "response.verification_status !== 'SUCCESS'"
  );
  const reservation = controller.indexOf(
    'await acquirePayPalWebhookEvent(ctx.client, ctx.request.body.id)'
  );
  const duplicateReturn = controller.indexOf(
    'ctx.body = { received: true };',
    reservation
  );
  const backgroundProcessing = controller.indexOf(
    'processEvent(ctx)',
    reservation
  );

  t.true(
    controller.includes("require('#helpers/acquire-paypal-webhook-event')")
  );
  t.true(signatureVerification >= 0);
  t.true(reservation > signatureVerification);
  t.true(duplicateReturn > reservation);
  t.true(backgroundProcessing > duplicateReturn);
});
