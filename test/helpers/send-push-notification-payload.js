//
// Copyright (c) Forward Email LLC
// SPDX-License-Identifier: BUSL-1.1
//

const test = require('ava');

const { buildPayload, formatSenderString } =
  require('#helpers/send-push-notification')._test;

test('formatSenderString > passes through raw header strings', (t) => {
  t.is(
    formatSenderString('John Smith <john@example.com>'),
    'John Smith <john@example.com>'
  );
  t.is(formatSenderString('john@example.com'), 'john@example.com');
});

test('formatSenderString > handles WildDuck parsedHeader address arrays', (t) => {
  t.is(
    formatSenderString([{ name: 'John Smith', address: 'john@example.com' }]),
    'John Smith <john@example.com>'
  );
  t.is(
    formatSenderString([{ name: '', address: 'john@example.com' }]),
    'john@example.com'
  );
  // First usable entry wins
  t.is(
    formatSenderString([
      { name: '', address: '' },
      { name: 'Jane', address: 'jane@example.com' }
    ]),
    'Jane <jane@example.com>'
  );
});

test('formatSenderString > returns empty string for unusable input', (t) => {
  t.is(formatSenderString(undefined), '');
  t.is(formatSenderString(null), '');
  t.is(formatSenderString(42), '');
  t.is(formatSenderString(''), '');
  t.is(formatSenderString([]), '');
  t.is(formatSenderString({}), '');
  t.is(formatSenderString([{ name: '', address: '' }]), '');
});

test('buildPayload > newMessage with string from uses sender name title', (t) => {
  const payload = buildPayload('newMessage', {
    aliasId: 'alias-1',
    message: {
      from: 'John Smith <john@example.com>',
      subject: 'Meeting tomorrow',
      snippet: 'Hey, just wanted to confirm our meeting'
    }
  });

  t.is(payload.title, 'John Smith');
  t.is(
    payload.body,
    'Meeting tomorrow\nHey, just wanted to confirm our meeting'
  );
  t.is(payload.data.sender, 'John Smith <john@example.com>');
  t.is(payload.data.subject, 'Meeting tomorrow');
  t.is(payload.data.snippet, 'Hey, just wanted to confirm our meeting');
});

test('buildPayload > newMessage with parsedHeader array from uses sender name title', (t) => {
  // Shape sent by the IMAP onAppend path (WildDuck mimeTree parsedHeader.from)
  const payload = buildPayload('newMessage', {
    aliasId: 'alias-1',
    message: {
      from: [{ name: 'John Smith', address: 'john@example.com' }],
      subject: 'Meeting tomorrow',
      snippet: 'Hey, just wanted to confirm our meeting'
    }
  });

  t.is(payload.title, 'John Smith');
  t.is(
    payload.body,
    'Meeting tomorrow\nHey, just wanted to confirm our meeting'
  );
  t.is(payload.data.sender, 'John Smith <john@example.com>');
});

test('buildPayload > newMessage without usable sender falls back to New Email', (t) => {
  const payload = buildPayload('newMessage', {
    aliasId: 'alias-1',
    message: {
      subject: 'Meeting tomorrow',
      snippet: 'Hey, just wanted to confirm our meeting'
    }
  });

  t.is(payload.title, 'New Email');
  t.is(
    payload.body,
    'Meeting tomorrow\nHey, just wanted to confirm our meeting'
  );
  t.is(payload.data.sender, '');
});

test('buildPayload > newMessage without snippet uses subject-only body', (t) => {
  const payload = buildPayload('newMessage', {
    aliasId: 'alias-1',
    message: {
      from: 'John Smith <john@example.com>',
      subject: 'Meeting tomorrow'
    }
  });

  t.is(payload.title, 'John Smith');
  t.is(payload.body, 'Meeting tomorrow');
});

test('buildPayload > suppressAlert forces an otherwise alert-worthy newMessage silent', (t) => {
  // Shape sent by onAppend when sync-temporary-mailbox drains tmp storage:
  // the tmp delivery already alerted the user, so this event must carry data
  // for cache sync but never draw a second notification.
  const payload = buildPayload('newMessage', {
    aliasId: 'alias-1',
    suppressAlert: true,
    message: {
      from: 'John Smith <john@example.com>',
      subject: 'Meeting tomorrow',
      snippet: 'Hey, just wanted to confirm our meeting',
      flags: [],
      is_unread: true
    }
  });

  t.true(payload.silent);
  t.is(payload.title, undefined);
  t.is(payload.body, undefined);
  // Data still flows for cache sync, and the flag is forwarded so clients
  // that draw from data also skip alerting.
  t.is(payload.data.subject, 'Meeting tomorrow');
  t.is(payload.data.suppressAlert, 'true');
});

test('buildPayload > absent suppressAlert keeps newMessage alert-worthy', (t) => {
  const payload = buildPayload('newMessage', {
    aliasId: 'alias-1',
    message: {
      from: 'John Smith <john@example.com>',
      subject: 'Meeting tomorrow',
      snippet: 'Hey, just wanted to confirm our meeting',
      flags: [],
      is_unread: true
    }
  });

  t.false(payload.silent);
  t.is(payload.title, 'John Smith');
  t.is(payload.data.suppressAlert, undefined);
});
