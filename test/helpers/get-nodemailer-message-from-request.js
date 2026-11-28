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

test('emoji in the headers of a raw message are still encoded', (t) => {
  const message = getNodemailerMessageFromRequest({
    request: {
      body: {
        raw: 'From: 😊 Test <a@example.com>\nSubject: 😊 testing this\n\nBody with 😊'
      }
    },
    pathWithoutLocale: '/v1/emails'
  });
  t.is(
    message.raw,
    'From: =?UTF-8?Q?=F0=9F=98=8A?= Test <a@example.com>\nSubject: =?UTF-8?Q?=F0=9F=98=8A?= testing this\n\nBody with 😊'
  );
});
