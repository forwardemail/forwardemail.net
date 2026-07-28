//
// Copyright (c) Forward Email LLC
// SPDX-License-Identifier: BUSL-1.1
//

const test = require('ava');
const sinon = require('sinon');

const config = require('#config');
const { deliverFcm } = require('#helpers/send-push-notification')._test;

function createResponse(statusCode, text = '') {
  return {
    statusCode,
    body: { text: sinon.stub().resolves(text) }
  };
}

test.beforeEach((t) => {
  t.context.config = {
    projectId: config.pushNotifications.fcmProjectId,
    serviceAccountPath: config.pushNotifications.fcmServiceAccountPath
  };

  config.pushNotifications.fcmProjectId = 'push-test-123';
  config.pushNotifications.fcmServiceAccountPath =
    '/etc/forwardemail/firebase-service-account.json';
});

test.afterEach.always((t) => {
  config.pushNotifications.fcmProjectId = t.context.config.projectId;
  config.pushNotifications.fcmServiceAccountPath =
    t.context.config.serviceAccountPath;
});

test('deliverFcm > sends through DNS-pinned HTTP v1 fetch', async (t) => {
  let authOptions;
  class TestGoogleAuth {
    constructor(options) {
      authOptions = options;
    }

    async getAccessToken() {
      return 'test-access-token';
    }
  }

  const fetch = sinon.stub().resolves(createResponse(200));
  const resolver = { name: 'test Tangerine resolver' };

  await deliverFcm(
    { token: 'fcm-device-token' },
    {
      title: 'New Email',
      body: 'A message arrived',
      data: {
        alias_id: 'alias-1',
        event: 'newMessage',
        notificationId: '8e9da80e-5622-483f-bddf-d1e5e4a312d2'
      }
    },
    resolver,
    { fetch, GoogleAuthClass: TestGoogleAuth }
  );

  t.deepEqual(authOptions, {
    keyFile: '/etc/forwardemail/firebase-service-account.json',
    scopes: ['https://www.googleapis.com/auth/firebase.messaging']
  });
  t.true(
    fetch.calledOnceWithExactly(
      'https://fcm.googleapis.com/v1/projects/push-test-123/messages:send',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-access-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: {
            token: 'fcm-device-token',
            notification: {
              title: 'New Email',
              body: 'A message arrived'
            },
            data: {
              alias_id: 'alias-1',
              event: 'newMessage',
              notificationId: '8e9da80e-5622-483f-bddf-d1e5e4a312d2'
            },
            android: {
              priority: 'high',
              notification: { channel_id: 'new-mail', icon: 'ic_notification' }
            }
          }
        }),
        bodyTimeout: 10_000,
        headersTimeout: 10_000,
        resolver
      }
    )
  );
});

test('deliverFcm > reads undici error responses', async (t) => {
  class TestGoogleAuth {
    async getAccessToken() {
      return 'test-access-token';
    }
  }

  const error = await t.throwsAsync(
    deliverFcm(
      { token: 'fcm-device-token' },
      { title: 'New Email', body: 'A message arrived', data: {} },
      { name: 'test Tangerine resolver' },
      {
        fetch: sinon.stub().resolves(createResponse(503, 'temporarily down')),
        GoogleAuthClass: TestGoogleAuth
      }
    )
  );

  t.is(error.message, 'FCM delivery failed (503): temporarily down');
});
