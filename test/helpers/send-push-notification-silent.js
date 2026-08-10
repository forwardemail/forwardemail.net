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

// ── newMessage folder / flag gating ────────────────────────────────────────
//
// newMessage fires for anything appended to any mailbox, so saving a draft or
// filing a Sent copy is indistinguishable from incoming mail at the event
// level. The OS draws the alert before the app sees the payload, so a push for
// a draft cannot be suppressed on-device — it has to be decided here.
//

test('buildPayload > silences a newMessage saved into Drafts', (t) => {
  const payload = buildPayload('newMessage', {
    aliasId: 'alias-1',
    mailbox: 'Drafts',
    message: { from: 'me@example.com', subject: 'Half-written' }
  });

  t.true(payload.silent);
  t.is(payload.title, undefined);
  t.is(payload.body, undefined);
  // Still delivered, so the client can refresh its Drafts view.
  t.is(payload.data.event, 'newMessage');
  t.is(payload.data.mailbox, 'Drafts');
});

test('buildPayload > silences a draft regardless of the folder it landed in', (t) => {
  const payload = buildPayload('newMessage', {
    aliasId: 'alias-1',
    mailbox: 'INBOX',
    message: { from: 'me@example.com', subject: 'Draft', flags: ['\\Draft'] }
  });

  t.true(payload.silent);
});

test('buildPayload > silences the other non-delivery folders', (t) => {
  for (const mailbox of [
    'Sent',
    'Sent Mail',
    'Archive',
    'All Mail',
    'Junk',
    'Spam',
    'Trash',
    'Deleted Items'
  ]) {
    const payload = buildPayload('newMessage', {
      aliasId: 'alias-1',
      mailbox,
      message: { from: 'me@example.com', subject: 'x' }
    });
    t.true(payload.silent, `${mailbox} should not raise an alert`);
  }
});

test('buildPayload > matches folder names case-insensitively', (t) => {
  t.true(
    buildPayload('newMessage', {
      aliasId: 'alias-1',
      mailbox: 'drafts',
      message: { subject: 'x' }
    }).silent
  );
});

// A real delivery is never already read, so a pre-\Seen arrival is another
// client copying or migrating existing mail.
test('buildPayload > silences mail that arrives already seen', (t) => {
  t.true(
    buildPayload('newMessage', {
      aliasId: 'alias-1',
      mailbox: 'INBOX',
      message: { subject: 'x', flags: ['\\Seen'] }
    }).silent
  );
  t.true(
    buildPayload('newMessage', {
      aliasId: 'alias-1',
      mailbox: 'INBOX',
      message: { subject: 'x', is_unread: false }
    }).silent
  );
});

test('buildPayload > still alerts for real inbox delivery', (t) => {
  const payload = buildPayload('newMessage', {
    aliasId: 'alias-1',
    mailbox: 'INBOX',
    message: {
      from: 'John Smith <john@example.com>',
      subject: 'Hello',
      flags: ['\\Recent'],
      is_unread: true
    }
  });

  t.false(payload.silent);
  t.is(payload.title, 'John Smith');
});

// Falling back to the folder on the message covers the parse-payload emitter,
// which sets folder_path alongside mailbox.
test('buildPayload > reads the folder from the message when mailbox is absent', (t) => {
  t.true(
    buildPayload('newMessage', {
      aliasId: 'alias-1',
      message: { subject: 'x', folder_path: 'Drafts' }
    }).silent
  );
});

// Better a stray alert than a swallowed delivery: with nothing to classify on,
// stay visible.
test('buildPayload > stays visible when the payload says nothing about the folder', (t) => {
  t.false(
    buildPayload('newMessage', {
      aliasId: 'alias-1',
      message: { from: 'a@b.com', subject: 'x' }
    }).silent
  );
});
