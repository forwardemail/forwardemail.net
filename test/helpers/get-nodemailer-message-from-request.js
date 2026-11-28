/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const MailComposer = require('nodemailer/lib/mail-composer');
const test = require('ava');
const { Libmime } = require('libmime');

const getNodemailerMessageFromRequest = require('#helpers/get-nodemailer-message-from-request');

const libmime = new Libmime();

// The headers of the message Nodemailer builds from an API request body,
// unfolded, as a recipient's mail client receives them.
async function builtHeaders(body) {
  const message = getNodemailerMessageFromRequest({
    request: { body },
    pathWithoutLocale: '/v1/emails'
  });
  const raw = await new Promise((resolve, reject) => {
    new MailComposer(message).compile().build((err, buffer) => {
      if (err) reject(err);
      else resolve(buffer.toString());
    });
  });
  const headers = {};
  for (const line of raw.split('\r\n\r\n')[0].split(/\r\n(?=\S)/)) {
    const index = line.indexOf(':');
    headers[line.slice(0, index).toLowerCase()] = line
      .slice(index + 1)
      .replace(/\r\n\s+/g, ' ')
      .trim();
  }

  return headers;
}

// A mail client decodes the encoded-words of a header once.
const SUBJECTS = [
  // kanji with katakana (mail.forwardemail.net issue #130)
  '送信テスト',
  // accents with a dash and curly quotes
  'Über uns — “Angebot” für Sie',
  // Cyrillic with a dash
  'Привет — мир',
  'テスト',
  'Hello 👋 world',
  '© 2026 Example ® notice',
  'Plain ASCII subject'
];

for (const subject of SUBJECTS) {
  test(`a recipient reads the subject ${JSON.stringify(
    subject
  )} after one decode`, async (t) => {
    const headers = await builtHeaders({
      from: 'a@example.com',
      to: 'b@example.com',
      subject,
      text: 'test'
    });
    // nothing but ASCII goes out in the header
    t.regex(headers.subject, /^[ -~]*$/);
    t.is(libmime.decodeWords(headers.subject), subject);
  });
}

test('a sender name that mixes kana, kanji and emoji is encoded once', async (t) => {
  const headers = await builtHeaders({
    from: 'テスト 太郎 😀 <a@example.com>',
    to: 'Zoë — Büro <b@example.com>',
    subject: 'test',
    text: 'test'
  });
  t.regex(headers.from, /^[ -~]*$/);
  t.is(libmime.decodeWords(headers.from), 'テスト 太郎 😀 <a@example.com>');
  t.is(libmime.decodeWords(headers.to), 'Zoë — Büro <b@example.com>');
});

function encodedRaw(raw) {
  return getNodemailerMessageFromRequest({
    request: { body: { raw } },
    pathWithoutLocale: '/v1/emails'
  }).raw;
}

// The unfolded header fields of a raw message.
function rawHeaders(raw) {
  const headers = {};
  for (const line of raw.split(/\r?\n\r?\n/)[0].split(/\r?\n(?=\S)/)) {
    const index = line.indexOf(':');
    headers[line.slice(0, index).toLowerCase()] = line
      .slice(index + 1)
      .replace(/\r?\n\s/g, '')
      .trim();
  }

  return headers;
}

test('a raw message with a single emoji in its subject is encoded', (t) => {
  const raw = encodedRaw(
    'From: a@example.com\nSubject: 😊 testing this\n\nBody'
  );
  t.is(
    raw,
    'From: a@example.com\nSubject: =?UTF-8?Q?=F0=9F=98=8A_testing_this?=\n\nBody'
  );
});

test('the non-ASCII header fields of a raw message are each encoded once', (t) => {
  const raw = encodedRaw(
    [
      'From: テスト 太郎 😀 <a@example.com>',
      'To: "Zoë — Büro" <b@example.com>, c@example.com',
      'Subject: 送信テスト Über uns — “Angebot” für Sie',
      'X-Custom: =?UTF-8?Q?caf=C3=A9?= and crème',
      'Message-ID: <id@example.com>',
      '',
      'Body with 😊 送信テスト'
    ].join('\r\n')
  );
  const [head, body] = raw.split('\r\n\r\n');
  // nothing but ASCII goes out in the header, and the body is left as it was
  t.regex(head, /^[ -~\t\r\n]*$/);
  t.notRegex(head, /(?<!\r)\n/);
  t.is(body, 'Body with 😊 送信テスト');
  const headers = rawHeaders(raw);
  t.is(libmime.decodeWords(headers.from), 'テスト 太郎 😀 <a@example.com>');
  t.is(
    libmime.decodeWords(headers.to),
    'Zoë — Büro <b@example.com>, c@example.com'
  );
  t.is(
    libmime.decodeWords(headers.subject),
    '送信テスト Über uns — “Angebot” für Sie'
  );
  t.is(libmime.decodeWords(headers['x-custom']), 'café and crème');
  t.is(headers['message-id'], '<id@example.com>');
  // a display name is an encoded-word on its own, never inside quotes
  t.false(headers.from.includes('"'));
  t.false(headers.to.includes('"'));
});

test('a raw message with an ASCII header is left as it is', (t) => {
  const raw = 'From: a@example.com\r\nSubject: Hi\r\n\r\nBody with 😊';
  t.is(encodedRaw(raw), raw);
});

test('only the display names of other address fields are encoded, and structured fields are left as they are', (t) => {
  const raw = encodedRaw(
    [
      'Subject: test',
      'Disposition-Notification-To: 😊 Test <a@example.com>',
      'Resent-From: Zoë <b@example.com>',
      'List-Unsubscribe: <https://example.com/ü>',
      '',
      'Body'
    ].join('\n')
  );
  const headers = rawHeaders(raw);
  t.is(
    headers['disposition-notification-to'],
    '=?UTF-8?Q?=F0=9F=98=8A_Test?= <a@example.com>'
  );
  t.is(headers['resent-from'], '=?UTF-8?Q?Zo=C3=AB?= <b@example.com>');
  t.is(headers['list-unsubscribe'], '<https://example.com/ü>');
});

// Text that is already encoded, in whole or in part, is encoded once.
const ENCODED_SUBJECTS = [
  ['=?UTF-8?Q?=F0=9F=A4=93_Hello?=', '🤓 Hello'],
  ['=?UTF-8?Q?Hi?= 😊 送信テスト', 'Hi 😊 送信テスト'],
  ['=?ISO-8859-1?Q?caf=E9?= =?Shift_JIS?B?g2WDWINn?=', 'caféテスト'],
  ['Price =? 5 =?foo?=', 'Price =? 5 =?foo?=']
];

for (const [subject, expected] of ENCODED_SUBJECTS) {
  test(`an encoded subject ${JSON.stringify(
    subject
  )} is encoded once`, async (t) => {
    const headers = await builtHeaders({
      from: 'a@example.com',
      to: 'b@example.com',
      subject,
      text: 'test'
    });
    t.regex(headers.subject, /^[ -~]*$/);
    t.is(libmime.decodeWords(headers.subject), expected);
  });
}

test('encoded display names are encoded once and never inside quotes', async (t) => {
  const headers = await builtHeaders({
    from: '=?UTF-8?Q?Doe=2C_J=C3=B6hn?= <a@example.com>',
    sender: {
      name: '=?UTF-8?Q?Zo=C3=AB_=F0=9F=98=8A?=',
      address: 's@example.com'
    },
    to: [
      '=?UTF-8?Q?Zo=C3=AB?= <b@example.com>',
      { name: 'Jürgen', address: 'c@example.com' },
      'd@example.com'
    ],
    cc: '=?UTF-8?Q?Gr=C3=BCppe?=: =?UTF-8?Q?A?= <e@example.com>, f@example.com;',
    replyTo: '=?UTF-8?Q?Zo=C3=AB?= <r@example.com>',
    subject: 'test',
    text: 'test'
  });
  for (const key of ['from', 'sender', 'to', 'cc', 'reply-to']) {
    t.regex(headers[key], /^[ -~]*$/);
    t.notRegex(headers[key], /"=\?/);
  }

  t.is(libmime.decodeWords(headers.from), 'Doe, Jöhn <a@example.com>');
  t.is(libmime.decodeWords(headers.sender), 'Zoë 😊 <s@example.com>');
  t.is(
    libmime.decodeWords(headers.to),
    'Zoë <b@example.com>, Jürgen <c@example.com>, d@example.com'
  );
  t.is(
    libmime.decodeWords(headers.cc),
    'Grüppe:A <e@example.com>, f@example.com;'
  );
  t.is(libmime.decodeWords(headers['reply-to']), 'Zoë <r@example.com>');
});

test('a decoded name can not add a recipient or a header', async (t) => {
  const message = getNodemailerMessageFromRequest({
    request: {
      body: {
        from: '=?UTF-8?Q?x=22_=3Cevil=40x.co=3E=2C_=0D=0ABcc=3A_y=40z.co?= <a@example.com>',
        to: 'b@example.com',
        subject: 'test',
        text: 'test'
      }
    },
    pathWithoutLocale: '/v1/emails'
  });
  const mail = new MailComposer(message).compile();
  t.deepEqual(mail.getEnvelope(), {
    from: 'a@example.com',
    to: ['b@example.com']
  });
  const raw = await new Promise((resolve, reject) => {
    mail.build((err, buffer) => {
      if (err) reject(err);
      else resolve(buffer.toString());
    });
  });
  t.notRegex(raw.split('\r\n\r\n')[0], /^bcc:/im);
});

test('encoded custom headers are encoded once and prepared ones are left as they are', async (t) => {
  const headers = await builtHeaders({
    from: 'a@example.com',
    to: 'b@example.com',
    subject: 'test',
    text: 'test',
    headers: {
      'X-Tag': '=?UTF-8?Q?Hi?= 😊',
      'X-Prepared': { prepared: true, value: '=?UTF-8?Q?keep?=' }
    }
  });
  t.is(libmime.decodeWords(headers['x-tag']), 'Hi 😊');
  t.is(headers['x-prepared'], '=?UTF-8?Q?keep?=');
});

test('other address headers keep their address and only the name is encoded', async (t) => {
  const headers = await builtHeaders({
    from: 'a@example.com',
    to: 'b@example.com',
    subject: 'test',
    text: 'test',
    headers: {
      'Disposition-Notification-To': '=?UTF-8?Q?N=C3=A4?= <n@example.com>',
      'Return-Receipt-To': 'Zoë <z@example.com>',
      'Errors-To': 'e@example.com'
    }
  });
  t.is(
    libmime.decodeWords(headers['disposition-notification-to']),
    'Nä <n@example.com>'
  );
  t.regex(headers['disposition-notification-to'], /^[ -~]*<n@example\.com>$/);
  t.regex(headers['return-receipt-to'], /^[ -~]*<z@example\.com>$/);
  t.is(
    libmime.decodeWords(headers['return-receipt-to']),
    'Zoë <z@example.com>'
  );
  t.is(headers['errors-to'], 'e@example.com');
});

test('text that decodes to nothing is kept as it was', async (t) => {
  const headers = await builtHeaders({
    from: 'a@example.com',
    to: 'b@example.com',
    subject: '=?UTF-8?B?!!!?=',
    text: 'test'
  });
  t.is(headers.subject, '=?UTF-8?B?!!!?=');
});
