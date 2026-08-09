//
// Copyright (c) Forward Email LLC
// SPDX-License-Identifier: BUSL-1.1
//

const { Buffer } = require('node:buffer');
const process = require('node:process');

const test = require('ava');
const sinon = require('sinon');

const config = require('#config');
const { deliverUnifiedPush, parseUnifiedPushSubscription } =
  require('#helpers/send-push-notification')._test;

const ENDPOINT = 'https://ntfy.example.com/up-test-endpoint';
const P256DH = `B${'A'.repeat(86)}`;
const AUTH = 'A'.repeat(22);

function createSubscription() {
  return {
    endpoint: ENDPOINT,
    keys: { p256dh: P256DH, auth: AUTH }
  };
}

function serializeSubscription() {
  return JSON.stringify(createSubscription());
}

function createRequest() {
  return {
    endpoint: ENDPOINT,
    method: 'POST',
    headers: {
      TTL: 60,
      'Content-Encoding': 'aes128gcm'
    },
    body: Buffer.from('encrypted-payload')
  };
}

function createResponse(statusCode, text = '') {
  return {
    statusCode,
    body: { text: sinon.stub().resolves(text) }
  };
}

function restoreEnvironment(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

test.beforeEach((t) => {
  t.context.environment = {
    subject: process.env.VAPID_SUBJECT,
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
  };
  t.context.config = {
    subject: config.pushNotifications.vapidSubject,
    publicKey: config.pushNotifications.vapidPublicKey,
    privateKey: config.pushNotifications.vapidPrivateKey
  };

  config.pushNotifications.vapidSubject = 'mailto:push@example.com';
  config.pushNotifications.vapidPublicKey = P256DH;
  config.pushNotifications.vapidPrivateKey = 'private-test-key';
});

test.afterEach.always((t) => {
  config.pushNotifications.vapidSubject = t.context.config.subject;
  config.pushNotifications.vapidPublicKey = t.context.config.publicKey;
  config.pushNotifications.vapidPrivateKey = t.context.config.privateKey;
  restoreEnvironment('VAPID_SUBJECT', t.context.environment.subject);
  restoreEnvironment('VAPID_PUBLIC_KEY', t.context.environment.publicKey);
  restoreEnvironment('VAPID_PRIVATE_KEY', t.context.environment.privateKey);
});

test('parseUnifiedPushSubscription > accepts complete subscription', (t) => {
  t.deepEqual(
    parseUnifiedPushSubscription(serializeSubscription()),
    createSubscription()
  );
});

test('parseUnifiedPushSubscription > rejects legacy endpoint-only token permanently', (t) => {
  const error = t.throws(() => parseUnifiedPushSubscription(ENDPOINT));
  t.true(error.isPermanentPushFailure);
});

test('deliverUnifiedPush > encrypts and uses DNS-pinned fetch', async (t) => {
  const request = createRequest();
  const generateRequestDetails = sinon.stub().returns(request);
  const fetch = sinon.stub().resolves(createResponse(201));
  const resolver = { name: 'test resolver' };
  const payload = {
    event: 'new-message',
    title: 'New email',
    body: 'A message arrived',
    data: { alias_id: 'alias-1' }
  };

  const result = await deliverUnifiedPush(
    { token: serializeSubscription() },
    payload,
    resolver,
    { generateRequestDetails, fetch }
  );

  t.deepEqual(result, { statusCode: 201 });
  t.true(generateRequestDetails.calledOnce);
  t.true(
    fetch.calledOnceWithExactly(ENDPOINT, {
      method: 'POST',
      headers: request.headers,
      body: request.body,
      bodyTimeout: 10_000,
      headersTimeout: 10_000,
      resolver
    })
  );

  const [subscription, body, options] = generateRequestDetails.firstCall.args;
  t.deepEqual(subscription, createSubscription());
  t.deepEqual(JSON.parse(body), {
    event: 'new-message',
    title: 'New email',
    body: 'A message arrived',
    alias_id: 'alias-1'
  });
  t.deepEqual(options, {
    TTL: 60,
    urgency: 'high',
    contentEncoding: 'aes128gcm',
    vapidDetails: {
      subject: 'mailto:push@example.com',
      publicKey: P256DH,
      privateKey: 'private-test-key'
    }
  });
});

test('deliverUnifiedPush > skips when VAPID is not configured', async (t) => {
  config.pushNotifications.vapidSubject = '';
  config.pushNotifications.vapidPublicKey = '';
  config.pushNotifications.vapidPrivateKey = '';
  delete process.env.VAPID_SUBJECT;
  delete process.env.VAPID_PUBLIC_KEY;
  delete process.env.VAPID_PRIVATE_KEY;
  const generateRequestDetails = sinon.stub();
  const fetch = sinon.stub();

  await deliverUnifiedPush(
    { token: serializeSubscription() },
    { event: 'new-message' },
    undefined,
    { generateRequestDetails, fetch }
  );

  t.false(generateRequestDetails.called);
  t.false(fetch.called);
});

test('deliverUnifiedPush > marks 410 endpoint response as permanent', async (t) => {
  const error = await t.throwsAsync(
    deliverUnifiedPush(
      { token: serializeSubscription() },
      { event: 'new-message' },
      undefined,
      {
        generateRequestDetails: sinon.stub().returns(createRequest()),
        fetch: sinon
          .stub()
          .resolves(createResponse(410, 'subscription expired'))
      }
    )
  );

  t.true(error.isPermanentPushFailure);
  t.regex(error.message, /410/);
});

test('deliverUnifiedPush > leaves temporary endpoint failure retryable', async (t) => {
  const error = await t.throwsAsync(
    deliverUnifiedPush(
      { token: serializeSubscription() },
      { event: 'new-message' },
      undefined,
      {
        generateRequestDetails: sinon.stub().returns(createRequest()),
        fetch: sinon.stub().resolves(createResponse(503))
      }
    )
  );

  t.falsy(error.isPermanentPushFailure);
  t.regex(error.message, /503/);
});

test('deliverUnifiedPush > omits title and body for a silent event', async (t) => {
  // The Android client displays whatever title/body it is handed when the app
  // is backgrounded, so a silent event must not carry them at all. `silent` is
  // sent explicitly so the client can tell a deliberately silent event apart
  // from an older server that simply omitted the strings.
  const generateRequestDetails = sinon.stub().returns(createRequest());
  const fetch = sinon.stub().resolves(createResponse(201));

  await deliverUnifiedPush(
    { token: serializeSubscription() },
    {
      event: 'flagsUpdated',
      silent: true,
      title: undefined,
      body: undefined,
      data: { alias_id: 'alias-1', event: 'flagsUpdated' }
    },
    undefined,
    { generateRequestDetails, fetch }
  );

  const [, body] = generateRequestDetails.firstCall.args;
  t.deepEqual(JSON.parse(body), {
    event: 'flagsUpdated',
    silent: true,
    alias_id: 'alias-1'
  });
});

test('deliverUnifiedPush > still sends title and body for new mail', async (t) => {
  const generateRequestDetails = sinon.stub().returns(createRequest());
  const fetch = sinon.stub().resolves(createResponse(201));

  await deliverUnifiedPush(
    { token: serializeSubscription() },
    {
      event: 'newMessage',
      silent: false,
      title: 'John Smith',
      body: 'Hello',
      data: { alias_id: 'alias-1', event: 'newMessage' }
    },
    undefined,
    { generateRequestDetails, fetch }
  );

  const [, body] = generateRequestDetails.firstCall.args;
  t.deepEqual(JSON.parse(body), {
    event: 'newMessage',
    title: 'John Smith',
    body: 'Hello',
    alias_id: 'alias-1'
  });
  t.is(JSON.parse(body).silent, undefined);
});
