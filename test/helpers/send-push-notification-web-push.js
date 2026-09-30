//
// Copyright (c) Forward Email LLC
// SPDX-License-Identifier: BUSL-1.1
//

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');

const test = require('ava');
const webPush = require('web-push');

const config = require('#config');
const { deliverWebPush, deliverToToken, fanOutToTokens, readResponseText } =
  require('#helpers/send-push-notification')._test;

// http_ece is the RFC 8188 implementation web-push encrypts with; the test
// uses it to decrypt as a browser would
const ece = createRequire(require.resolve('web-push'))('http_ece');

const ENDPOINT = 'https://fcm.googleapis.com/fcm/send/test-subscription';

// a browser-side subscription: P-256 key pair and 16-byte auth secret
function createBrowserSubscription() {
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.generateKeys();
  const auth = crypto.randomBytes(16);
  return {
    ecdh,
    auth,
    token: JSON.stringify({
      endpoint: ENDPOINT,
      keys: {
        p256dh: ecdh.getPublicKey().toString('base64url'),
        auth: auth.toString('base64url')
      }
    })
  };
}

function createPayload(silent = false) {
  return {
    title: 'Alice',
    body: 'Lunch?',
    event: 'newMessage',
    silent,
    data: {
      event: 'newMessage',
      alias_id: 'alias123',
      message_id: 'msg123',
      mailbox: 'INBOX'
    }
  };
}

function captureFetch(statusCode = 201, text = '') {
  const calls = [];
  const fetch = async (url, options) => {
    calls.push({ url, options });
    return { statusCode, body: { text: async () => text } };
  };

  return { calls, fetch };
}

test.beforeEach((t) => {
  t.context.config = { ...config.pushNotifications };
  const vapid = webPush.generateVAPIDKeys();
  config.pushNotifications.vapidSubject = 'mailto:push@example.com';
  config.pushNotifications.vapidPublicKey = vapid.publicKey;
  config.pushNotifications.vapidPrivateKey = vapid.privateKey;
});

test.afterEach.always((t) => {
  Object.assign(config.pushNotifications, t.context.config);
});

test('delivers an encrypted notification the browser can decrypt', async (t) => {
  const { ecdh, auth, token } = createBrowserSubscription();
  const { calls, fetch } = captureFetch();

  const result = await deliverWebPush(
    { _id: 'token1', platform: 'web-push', token },
    createPayload(),
    null,
    { fetch }
  );

  t.is(result.statusCode, 201);
  t.is(calls.length, 1);
  t.is(calls[0].url, ENDPOINT);
  const { headers, body } = calls[0].options;
  t.is(Number(headers.TTL), 3600);
  t.is(headers.Urgency, 'high');
  t.is(headers['Content-Encoding'], 'aes128gcm');
  t.regex(headers.Authorization, /^vapid t=(?:[\w-]+\.){2}[\w-]+, k=/);

  const plaintext = ece.decrypt(body, {
    version: 'aes128gcm',
    privateKey: ecdh,
    authSecret: auth.toString('base64url')
  });
  const message = JSON.parse(plaintext.toString());
  t.is(message.title, 'Alice');
  t.is(message.body, 'Lunch?');
  t.is(message.event, 'newMessage');
  t.is(message.message_id, 'msg123');
  t.is(message.mailbox, 'INBOX');
});

test('does not send silent events (browsers require a visible notification)', async (t) => {
  const { token } = createBrowserSubscription();
  const { calls, fetch } = captureFetch();

  const result = await deliverWebPush(
    { _id: 'token1', platform: 'web-push', token },
    createPayload(true),
    null,
    { fetch }
  );

  t.is(calls.length, 0);
  t.deepEqual(result, { skipped: true });
});

test('a skipped silent event is neither a success nor a failure for the token', async (t) => {
  const { token } = createBrowserSubscription();
  const recorded = [];
  await fanOutToTokens(
    [{ _id: 'token1', platform: 'web-push', token }],
    createPayload(true),
    null,
    {
      recordSuccess: async (id) => recorded.push(['success', id]),
      recordFailure: async (id) => recorded.push(['failure', id]),
      deleteToken: async (id) => recorded.push(['delete', id])
    }
  );
  t.deepEqual(recorded, []);
});

test('oversized text is shortened to fit the push service limit', async (t) => {
  const { ecdh, auth, token } = createBrowserSubscription();
  const { calls, fetch } = captureFetch();
  const payload = createPayload();
  // control characters are escaped to six bytes each in JSON
  payload.data.subject = '\u0001'.repeat(255);
  payload.data.sender = '\u0001'.repeat(255);
  payload.data.snippet = '\u00E9'.repeat(255);
  payload.title = '\u0001'.repeat(255);

  await deliverWebPush(
    { _id: 'token1', platform: 'web-push', token },
    payload,
    null,
    { fetch }
  );

  const plaintext = ece.decrypt(calls[0].options.body, {
    version: 'aes128gcm',
    privateKey: ecdh,
    authSecret: auth.toString('base64url')
  });
  t.true(plaintext.length <= 3000);
  const message = JSON.parse(plaintext.toString());
  t.is(message.message_id, 'msg123');
  t.is(message.event, 'newMessage');
});

test('an expired subscription is a permanent failure', async (t) => {
  const { token } = createBrowserSubscription();
  const { fetch } = captureFetch(410, 'gone');

  const err = await t.throwsAsync(
    deliverWebPush(
      { _id: 'token1', platform: 'web-push', token },
      createPayload(),
      null,
      { fetch }
    )
  );
  t.regex(err.message, /Web Push delivery failed \(410\)/);
  t.true(err.isPermanentPushFailure);
});

test('web-push tokens are dispatched to delivery instead of being dropped', async (t) => {
  // an unresolvable endpoint makes the real delivery attempt fail; the old
  // placeholder resolved without ever trying
  const { ecdh, auth } = createBrowserSubscription();
  const token = JSON.stringify({
    endpoint: 'https://push.invalid/subscription',
    keys: {
      p256dh: ecdh.getPublicKey().toString('base64url'),
      auth: auth.toString('base64url')
    }
  });

  await t.throwsAsync(
    deliverToToken(
      { _id: 'token1', platform: 'web-push', token },
      createPayload(),
      null
    )
  );
});

test('a stored subscription outside the browser push services is never contacted', async (t) => {
  const { calls, fetch } = captureFetch();
  const { ecdh, auth } = createBrowserSubscription();
  const token = JSON.stringify({
    endpoint: 'https://push.example.com/subscription',
    keys: {
      p256dh: ecdh.getPublicKey().toString('base64url'),
      auth: auth.toString('base64url')
    }
  });

  const err = await t.throwsAsync(
    deliverWebPush(
      { _id: 'token1', platform: 'web-push', token },
      createPayload(),
      null,
      { fetch }
    )
  );
  t.true(err.isPermanentPushFailure);
  t.is(calls.length, 0);
});

test('only the start of a push service response is read', async (t) => {
  let produced = 0;
  async function* endless() {
    for (;;) {
      produced++;
      yield Buffer.alloc(64 * 1024, 'a');
    }
  }

  const text = await readResponseText(endless());
  t.is(text.length, 4096);
  t.is(produced, 1);
});
