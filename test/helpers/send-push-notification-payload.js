//
// Copyright (c) Forward Email LLC
// SPDX-License-Identifier: BUSL-1.1
//

const { Buffer } = require('node:buffer');

const test = require('ava');

const { buildPayload, formatSenderString, extractSenderName } =
  require('#helpers/send-push-notification')._test;

test('extractSenderName > display names, quotes and bare addresses', (t) => {
  for (const [from, expected] of [
    ['John Smith <john@example.com>', 'John Smith'],
    ['"John Smith" <john@example.com>', 'John Smith'],
    ['  " John Smith "   <john@example.com>', 'John Smith'],
    ['John Smith<john@example.com>', 'John Smith'],
    ['<john@example.com>', 'john@example.com'],
    ['"" <john@example.com>', 'john@example.com'],
    ['"Jo"hn" <john@example.com>', 'john@example.com'],
    ['   <><x@example.com>', 'x@example.com'],
    ['john@example.com', 'john@example.com'],
    ['  John  ', 'John'],
    ['John <', 'John'],
    ['', '']
  ]) {
    t.is(extractSenderName(from), expected, `${from}`);
  }
});

test('buildPayload > a From header with a long whitespace run is handled in linear time', (t) => {
  for (const from of [
    'a' + ' '.repeat(100_000) + 'b',
    ' '.repeat(100_000) + '<',
    '<'.repeat(50_000)
  ]) {
    const start = Date.now();
    const payload = buildPayload('newMessage', {
      aliasId: 'alias-1',
      message: { from, subject: 'Hi' }
    });
    const elapsed = Date.now() - start;
    t.is(typeof payload.title, 'string');
    t.true(elapsed < 500, `took ${elapsed}ms`);
  }
});

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

test('buildPayload > decodes RFC 2047 sender and subject from an appended message', (t) => {
  // Parse a real message the way the IMAP append path does, so the payload
  // receives WildDuck's parsedHeader exactly as on-append.js forwards it.
  const Indexer = require('@zone-eu/wildduck/imap-core/lib/indexer/indexer');
  const { parsedHeader } = new Indexer().parseMimeTree(
    Buffer.from(
      [
        'From: "=?utf-8?Q?Mercury?=" <hello@mercury.com>',
        'To: user@example.com',
        'Subject: =?utf-8?Q?We_processed_your_IO_credit_payment?=',
        '',
        'Hello',
        ''
      ].join('\r\n')
    )
  );

  const payload = buildPayload('newMessage', {
    message: {
      from: parsedHeader.from,
      subject: parsedHeader.subject,
      snippet: 'Hello'
    }
  });

  t.is(payload.title, 'Mercury');
  t.is(payload.body, 'We processed your IO credit payment\nHello');
  t.is(payload.data.sender, 'Mercury <hello@mercury.com>');
  t.is(payload.data.subject, 'We processed your IO credit payment');
});

test('buildPayload > decodes an encoded sender from the MX header string', (t) => {
  const payload = buildPayload('newMessage', {
    message: {
      from: '=?UTF-8?B?8J+OiSBCZWVw?= <beep@example.com>',
      subject: 'Hi'
    }
  });
  t.is(payload.title, '🎉 Beep');
});

test('buildPayload > newMessage carries the message id a tap opens', (t) => {
  // The shape helpers/imap/on-append.js sends: the id is only on message.
  const payload = buildPayload('newMessage', {
    aliasId: 'alias-1',
    mailbox: 'Work/Projects',
    message: {
      id: '6650f0c2a1b2c3d4e5f60718',
      folder_path: 'Work/Projects',
      from: [{ name: 'Jane', address: 'jane@example.com' }],
      subject: 'Plan'
    }
  });
  t.is(payload.data.message_id, '6650f0c2a1b2c3d4e5f60718');
  t.is(payload.data.mailbox, 'Work/Projects');
  t.is(payload.data.alias_id, 'alias-1');
});

test('buildPayload > an explicit message_id still wins, and none is fine', (t) => {
  t.is(
    buildPayload('newMessage', {
      message_id: 'top-level',
      message: { id: 'nested', from: 'a@example.com', subject: 's' }
    }).data.message_id,
    'top-level'
  );
  // tmp storage deliveries (helpers/parse-payload.js) have no id yet
  t.is(
    buildPayload('newMessage', {
      mailbox: 'INBOX',
      message: { from: 'a@example.com', subject: 's' }
    }).data.message_id,
    ''
  );
});
