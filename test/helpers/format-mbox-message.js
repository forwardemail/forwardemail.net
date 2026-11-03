/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A line in the body of a received email that starts with "From " used to
// start a message of its own in an MBOX backup, with headers the sender
// wrote, once the backup was imported into a mail program.
//

const test = require('ava');

const formatMboxMessage = require('#helpers/format-mbox-message');

// how mail programs read mbox: a message starts at each "From " line, and
// one ">" is taken off quoted "From " lines (mboxrd)
function readMbox(mbox) {
  return mbox
    .split(/^(?=From )/m)
    .filter(Boolean)
    .map((message) =>
      message
        .split('\n')
        .slice(1)
        .map((line) => line.replace(/^>(>*From )/, '$1'))
        .join('\n')
        .replace(/\n+$/, '')
    );
}

const forged = [
  'From: friend@example.com',
  'Subject: hello',
  '',
  'Text first.',
  'From attacker@example.net Mon Jan  1 00:00:00 2024',
  'From: security@bank.example',
  'Subject: Verify your account',
  '',
  'A message nobody sent.',
  '>From already quoted'
].join('\n');

test('a "From " line inside a message stays inside it', (t) => {
  const date = new Date('2024-01-02T03:04:05Z');
  const mbox =
    formatMboxMessage('friend@example.com', date, forged) +
    formatMboxMessage('other@example.com', date, 'Subject: next\n\nnext');

  const messages = readMbox(mbox);
  t.is(messages.length, 2);
  t.is(messages[0], forged);
  t.is(messages[1], 'Subject: next\n\nnext');
});

test('the From: header is left as it is', (t) => {
  const mbox = formatMboxMessage(
    'friend@example.com',
    new Date(),
    'From: friend@example.com\nSubject: hi\n\nhi'
  );
  t.true(mbox.includes('\nFrom: friend@example.com\n'));
  t.false(mbox.includes('>From:'));
});
