/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const getStream = require('get-stream');

const createBounce = require('#helpers/create-bounce');
const createDSNSuccess = require('#helpers/create-dsn-success');

//
// Helper to build a minimal email object for testing
//
function makeEmail(overrides = {}) {
  return {
    envelope: {
      from: 'mailer-daemon@mx1.forwardemail.net',
      to: 'sender@example.com'
    },
    messageId: 'original-msg-id@example.com',
    date: new Date('2026-02-10T12:00:00Z'),
    id: 'log-id-abc123',
    raw: 'From: sender@example.com\r\nTo: user@example.com\r\nSubject: Test\r\n\r\nHello world',
    ...overrides
  };
}

// ============================================================
// createDSNSuccess tests
// ============================================================

test('createDSNSuccess returns a readable stream', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  t.truthy(stream);
  t.is(typeof stream.pipe, 'function');
});

test('createDSNSuccess produces valid multipart/report output', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('multipart/report'));
  t.true(output.includes('report-type=delivery-status'));
});

test('createDSNSuccess includes Reporting-MTA in delivery-status', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('Reporting-MTA: dns;'));
});

test('createDSNSuccess includes Final-Recipient', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('Final-Recipient: rfc822;user@example.com'));
});

test('createDSNSuccess includes Action: delivered', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('Action: delivered'));
});

test('createDSNSuccess defaults to Status: 2.0.0 without info', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('Status: 2.0.0'));
});

test('createDSNSuccess includes Remote-MTA when session has mx info', async (t) => {
  const session = {
    mx: { hostname: 'mx.example.com', host: '192.0.2.1', port: 25 }
  };
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date(),
    { session }
  );
  const output = await getStream(stream);
  t.true(output.includes('Remote-MTA: dns; mx.example.com'));
});

test('createDSNSuccess includes Diagnostic-Code when info has response', async (t) => {
  const info = { response: '250 2.0.0 Ok: queued as 4f58Js4ZWVzKs' };
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date(),
    { info }
  );
  const output = await getStream(stream);
  t.true(
    output.includes(
      'Diagnostic-Code: smtp; 250 2.0.0 Ok: queued as 4f58Js4ZWVzKs'
    )
  );
});

test('createDSNSuccess human-readable includes MX hostname and IP', async (t) => {
  const info = { response: '250 2.0.0 Ok: queued as 12345' };
  const session = {
    mx: { hostname: 'mx.example.com', host: '192.0.2.1', port: 25 }
  };
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date(),
    { info, session }
  );
  const output = await getStream(stream);
  t.true(output.includes('mx.example.com'));
  t.true(output.includes('192.0.2.1'));
});

test('createDSNSuccess includes Final-Log-ID when email has id', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail({ id: 'my-log-id-xyz' }),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('Final-Log-ID: my-log-id-xyz'));
});

test('createDSNSuccess includes Original-Envelope-Id when dsn.id is set', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail({ dsn: { id: 'envid-12345' } }),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('Original-Envelope-Id: envid-12345'));
});

test('createDSNSuccess includes original message headers as third MIME part', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('text/rfc822-headers'));
  t.true(output.includes('Subject: Test'));
});

test('createDSNSuccess includes full message when dsn.return is full', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail({ dsn: { return: 'full' } }),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('message/rfc822'));
  t.true(output.includes('Hello world'));
});

test('createDSNSuccess sets correct Subject header', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('Subject: Delivery Status Notification (Success)'));
});

test('createDSNSuccess sets In-Reply-To and References headers', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail({ messageId: 'orig-id@test.com' }),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('In-Reply-To: <orig-id@test.com>'));
  t.true(output.includes('References: <orig-id@test.com>'));
});

test('createDSNSuccess works with minimal arguments (backwards compatible)', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('delivered successfully'));
  t.true(output.includes('Status: 2.0.0'));
});

test('createDSNSuccess RFC 3464 field ordering: Reporting-MTA before Arrival-Date', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  const reportingIdx = output.indexOf('Reporting-MTA:');
  const arrivalIdx = output.indexOf('Arrival-Date:');
  t.true(reportingIdx > -1);
  t.true(arrivalIdx > -1);
  t.true(reportingIdx < arrivalIdx);
});

test('createDSNSuccess RFC 3464 field ordering: per-message fields before per-recipient fields', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  const reportingIdx = output.indexOf('Reporting-MTA:');
  const finalRecipientIdx = output.indexOf('Final-Recipient:');
  t.true(reportingIdx > -1);
  t.true(finalRecipientIdx > -1);
  t.true(reportingIdx < finalRecipientIdx);
});

// ============================================================
// createBounce tests — failure
// ============================================================

test('createBounce returns a readable stream', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  t.truthy(stream);
  t.is(typeof stream.pipe, 'function');
});

test('createBounce failure includes Action: failed', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('Action: failed'));
});

test('createBounce failure parses real enhanced status code from response', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 The email account does not exist',
    responseCode: 550,
    message: 'The email account does not exist',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('Status: 5.1.1'));
});

test('createBounce failure includes Remote-MTA from error.mx', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date(),
    mx: { hostname: 'mx.example.com', host: '192.0.2.1', port: 25 }
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('Remote-MTA: dns; mx.example.com'));
});

test('createBounce failure includes Diagnostic-Code', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('Diagnostic-Code: smtp; 550 5.1.1 User unknown'));
});

test('createBounce failure human-readable includes MX hostname and IP', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date(),
    port: 25,
    mx: { hostname: 'mx.example.com', host: '192.0.2.1', port: 25 }
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('mx.example.com'));
  t.true(output.includes('192.0.2.1'));
});

test('createBounce failure sets Subject to Failure', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('Subject: Delivery Status Notification (Failure)'));
});

// ============================================================
// createBounce tests — delayed (4xx)
// ============================================================

test('createBounce delayed includes Action: delayed', async (t) => {
  const error = {
    recipient: 'user@example.com',
    response: '421 4.7.0 Try again later',
    responseCode: 421,
    message: 'Try again later',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('Action: delayed'));
});

test('createBounce delayed parses enhanced status code from 4xx response', async (t) => {
  const error = {
    recipient: 'user@example.com',
    response: '421 4.7.0 Try again later',
    responseCode: 421,
    message: 'Try again later',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('Status: 4.7.0'));
});

test('createBounce delayed includes Will-Retry-Until', async (t) => {
  const error = {
    recipient: 'user@example.com',
    response: '421 4.7.0 Try again later',
    responseCode: 421,
    message: 'Try again later',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('Will-Retry-Until:'));
});

test('createBounce delayed sets Subject to Delayed', async (t) => {
  const error = {
    recipient: 'user@example.com',
    response: '421 4.7.0 Try again later',
    responseCode: 421,
    message: 'Try again later',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('Subject: Delivery Status Notification (Delayed)'));
});

test('createBounce delayed human-readable mentions retry', async (t) => {
  const error = {
    recipient: 'user@example.com',
    response: '421 4.7.0 Try again later',
    responseCode: 421,
    message: 'Try again later',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('retried'));
});

// ============================================================
// createBounce tests — RFC 3464 field ordering
// ============================================================

test('createBounce RFC 3464 field ordering: Reporting-MTA before Arrival-Date', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  const reportingIdx = output.indexOf('Reporting-MTA:');
  const arrivalIdx = output.indexOf('Arrival-Date:');
  t.true(reportingIdx > -1);
  t.true(arrivalIdx > -1);
  t.true(reportingIdx < arrivalIdx);
});

test('createBounce RFC 3464 field ordering: per-message fields before per-recipient fields', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  const reportingIdx = output.indexOf('Reporting-MTA:');
  const finalRecipientIdx = output.indexOf('Final-Recipient:');
  t.true(reportingIdx > -1);
  t.true(finalRecipientIdx > -1);
  t.true(reportingIdx < finalRecipientIdx);
});

test('createBounce failure does NOT include Will-Retry-Until', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  // Will-Retry-Until appears in headers for delayed, but in the delivery-status
  // body it should only appear for delayed DSNs
  const deliveryStatusMatch = output.match(
    /message\/delivery-status[\s\S]*?(?=----)/
  );
  if (deliveryStatusMatch) {
    t.false(deliveryStatusMatch[0].includes('Will-Retry-Until'));
  } else {
    t.pass();
  }
});

// ============================================================
// createBounce tests — edge cases
// ============================================================

test('createBounce handles error without mx object', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date(),
    target: 'example.com'
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('Remote-MTA: dns; example.com'));
});

test('createBounce handles connection error without SMTP response', async (t) => {
  const error = {
    recipient: 'user@example.com',
    message: 'connect ECONNREFUSED 192.0.2.1:25',
    date: new Date(),
    mx: { hostname: 'mx.example.com', host: '192.0.2.1', port: 25 }
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('connection to'));
  t.true(output.includes('mx.example.com'));
  t.true(output.includes('ECONNREFUSED'));
});

test('createBounce includes Original-Envelope-Id when dsn.id is set', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail({ dsn: { id: 'envid-99' } }),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('Original-Envelope-Id: envid-99'));
});

// ============================================================
// Custom X-header preservation tests
// ============================================================

test('createDSNSuccess includes X-Report-Abuse-To header', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('X-Report-Abuse-To:'));
});

test('createDSNSuccess includes X-Forward-Email-Website header', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('X-Forward-Email-Website:'));
});

test('createDSNSuccess includes X-Forward-Email-Version header', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('X-Forward-Email-Version:'));
});

test('createDSNSuccess includes X-Forward-Email-Sender header', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('X-Forward-Email-Sender: rfc822;'));
});

test('createDSNSuccess includes X-Forward-Email-ID when email has id', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail({ id: 'my-log-id' }),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('X-Forward-Email-ID: my-log-id'));
});

test('createDSNSuccess includes X-Complaints-To header', async (t) => {
  const stream = await createDSNSuccess(
    makeEmail(),
    'user@example.com',
    new Date()
  );
  const output = await getStream(stream);
  t.true(output.includes('X-Complaints-To:'));
});

test('createBounce includes X-Report-Abuse-To header', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('X-Report-Abuse-To:'));
});

test('createBounce includes X-Forward-Email-Website header', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('X-Forward-Email-Website:'));
});

test('createBounce includes X-Forward-Email-Version header', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('X-Forward-Email-Version:'));
});

test('createBounce includes X-Forward-Email-Sender header', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail(),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('X-Forward-Email-Sender: rfc822;'));
});

test('createBounce includes X-Forward-Email-ID when email has id', async (t) => {
  const error = {
    recipient: 'baduser@example.com',
    response: '550 5.1.1 User unknown',
    responseCode: 550,
    message: 'User unknown',
    date: new Date()
  };
  const stream = await createBounce(
    makeEmail({ id: 'my-log-id' }),
    error,
    'From: x@x.com\r\nSubject: Test\r\n\r\nBody'
  );
  const output = await getStream(stream);
  t.true(output.includes('X-Forward-Email-ID: my-log-id'));
});
