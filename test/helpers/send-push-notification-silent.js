//
// Copyright (c) Forward Email LLC
// SPDX-License-Identifier: BUSL-1.1
//

//
// Only newMessage is delivered as a user-visible alert. Every other event is
// still delivered, but silently.
//
// This matters because a push carrying an FCM `notification` block or an APNs
// `alert` is drawn by the OS before the app is handed the payload, so a client
// cannot suppress one it did not want. Sending an alert for every event type
// meant one user action fanned out into a screenful of notifications: marking
// a thread read emits one flagsUpdated per message, and each arrived on the
// device as "Flags Updated / You have a new flagsUpdated event".
//

const test = require('ava');
const sinon = require('sinon');

const config = require('#config');
const { buildPayload, deliverApns, deliverFcm } =
  require('#helpers/send-push-notification')._test;

function createResponse(statusCode, text = '') {
  return {
    statusCode,
    body: { text: sinon.stub().resolves(text) }
  };
}

class TestGoogleAuth {
  async getAccessToken() {
    return 'test-access-token';
  }
}

/** Send through deliverFcm and hand back the message it would POST. */
async function captureFcmMessage(payload) {
  const fetch = sinon.stub().resolves(createResponse(200));
  await deliverFcm({ token: 'fcm-device-token' }, payload, undefined, {
    fetch,
    GoogleAuthClass: TestGoogleAuth
  });
  return JSON.parse(fetch.firstCall.args[1].body).message;
}

/** Send through deliverApns and hand back the apn.Notification it built. */
async function captureApnsNote(payload) {
  const send = sinon.stub().resolves({ failed: [] });
  await deliverApns({ token: 'apns-device-token' }, payload, {
    getProvider: () => ({ send })
  });
  return send.firstCall.args[0];
}

test.beforeEach((t) => {
  t.context.config = { ...config.pushNotifications };
  config.pushNotifications.fcmProjectId = 'push-test-123';
  config.pushNotifications.fcmServiceAccountPath =
    '/etc/forwardemail/firebase-service-account.json';
  config.pushNotifications.appleKeyPath = '/etc/forwardemail/apns.p8';
  config.pushNotifications.appleKeyId = 'APNSKEYID1';
  config.pushNotifications.appleTeamId = 'APNSTEAM01';
});

test.afterEach.always((t) => {
  Object.assign(config.pushNotifications, t.context.config);
});

// ── buildPayload ───────────────────────────────────────────────────────────

test('buildPayload > marks flagsUpdated silent and gives it no title or body', (t) => {
  const payload = buildPayload('flagsUpdated', { aliasId: 'alias-1' });

  t.true(payload.silent);
  t.is(payload.title, undefined);
  t.is(payload.body, undefined);
  // The data the client needs for badge counts still goes out.
  t.is(payload.data.event, 'flagsUpdated');
  t.is(payload.data.alias_id, 'alias-1');
});

test('buildPayload > keeps newMessage visible', (t) => {
  const payload = buildPayload('newMessage', {
    aliasId: 'alias-1',
    message: { from: 'John Smith <john@example.com>', subject: 'Hello' }
  });

  t.false(payload.silent);
  t.is(payload.title, 'John Smith');
  t.is(payload.body, 'Hello');
});

test('buildPayload > treats every non-mail event as silent', (t) => {
  const events = [
    'messagesMoved',
    'messagesCopied',
    'flagsUpdated',
    'messagesExpunged',
    'mailboxCreated',
    'mailboxDeleted',
    'mailboxRenamed',
    'calendarEventCreated',
    'contactCreated',
    'newRelease'
  ];

  for (const event of events) {
    const payload = buildPayload(event, { aliasId: 'alias-1' });
    t.true(payload.silent, `${event} should be silent`);
    t.is(payload.title, undefined, `${event} should carry no title`);
    t.is(payload.body, undefined, `${event} should carry no body`);
  }
});

test('buildPayload > never puts a raw event name in a body', (t) => {
  // A visible event with nothing to describe it used to render the internal
  // camelCase identifier on the lock screen.
  const payload = buildPayload('newMessage', { aliasId: 'alias-1' });

  t.false(payload.silent);
  t.is(payload.body, 'You have new mail');
  t.notRegex(payload.body, /newMessage/);
});

// ── FCM ────────────────────────────────────────────────────────────────────

test('deliverFcm > sends a data-only message for a silent event', async (t) => {
  const message = await captureFcmMessage(
    buildPayload('flagsUpdated', { aliasId: 'alias-1' })
  );

  // The notification block is what makes Android draw it without asking us.
  t.is(message.notification, undefined);
  t.is(message.android.notification, undefined);
  t.is(message.android.priority, 'normal');
  t.is(message.data.event, 'flagsUpdated');
});

test('deliverFcm > still sends an alert for new mail', async (t) => {
  const message = await captureFcmMessage(
    buildPayload('newMessage', {
      aliasId: 'alias-1',
      message: { from: 'John Smith <john@example.com>', subject: 'Hello' }
    })
  );

  t.deepEqual(message.notification, { title: 'John Smith', body: 'Hello' });
  t.is(message.android.priority, 'high');
  t.is(message.android.notification.channel_id, 'new-mail');
});

// ── APNs ───────────────────────────────────────────────────────────────────

test('deliverApns > sends a background push for a silent event', async (t) => {
  const note = await captureApnsNote(
    buildPayload('flagsUpdated', { aliasId: 'alias-1' })
  );

  t.is(note.pushType, 'background');
  // contentAvailable is a write-only setter on apn.Notification; aps is what
  // actually goes on the wire.
  t.is(note.aps['content-available'], 1);
  // APNs rejects a background push sent at priority 10.
  t.is(note.priority, 5);
  t.is(note.aps.alert, undefined);
  t.is(note.aps.sound, undefined);
});

test('deliverApns > still sends an alert for new mail', async (t) => {
  const note = await captureApnsNote(
    buildPayload('newMessage', {
      aliasId: 'alias-1',
      message: { from: 'John Smith <john@example.com>', subject: 'Hello' }
    })
  );

  t.is(note.pushType, 'alert');
  t.is(note.priority, 10);
  t.deepEqual(note.aps.alert, { title: 'John Smith', body: 'Hello' });
  t.is(note.aps.sound, 'default');
});
