/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const test = require('ava');

const getUnsafeAddressHeader = require('#helpers/get-unsafe-address-header');

const { MAX_SEPARATORS } = getUnsafeAddressHeader;

function raw(...headers) {
  return Buffer.from(
    [...headers, 'Subject: test', '', 'hello', ''].join('\r\n')
  );
}

// a header folded at whitespace, with lines well under 998 characters
function fold(name, items) {
  const lines = [];
  let line = `${name}: ${items[0]}`;
  for (const item of items.slice(1)) {
    if (line.length > 900) {
      lines.push(line + ',');
      line = ` ${item}`;
    } else {
      line += `,${item}`;
    }
  }

  lines.push(line);
  return lines.join('\r\n');
}

test('ordinary address headers pass', async (t) => {
  const recipients = Array.from(
    { length: 1000 },
    (_, i) => ` "Last, First ${i}" <user-${i}@example.com>`
  );
  t.is(
    await getUnsafeAddressHeader(
      raw(
        'From: "Sender" <sender@example.com>',
        fold('To', recipients),
        'Cc: =?UTF-8?B?w6l0w6k=?= <ete@example.net>',
        'Subject: a subject with, many; separators'.repeat(10)
      )
    ),
    undefined
  );
});

test('a list with more separators than any real one is refused', async (t) => {
  const items = [
    'a@example.com',
    ...Array.from({ length: MAX_SEPARATORS + 1 }, () => 'x')
  ];
  t.deepEqual(await getUnsafeAddressHeader(raw(fold('Reply-To', items))), {
    key: 'Reply-To',
    reason: 'has too many addresses'
  });
});

test('a word longer than a line is refused, also once decoded', async (t) => {
  const result = await getUnsafeAddressHeader(
    raw(`To: a@example.com ${'a.'.repeat(500)}`)
  );
  t.is(result?.reason, 'has a word that is too long');

  // (adjacent encoded-words decode to one word)
  const words = Array.from(
    { length: 40 },
    () => `=?UTF-8?Q?${'a.'.repeat(15)}?=`
  ).join(' ');
  t.deepEqual(
    await getUnsafeAddressHeader(raw(`From: ${words} <a@example.com>`)),
    {
      key: 'From',
      reason: 'has a word that is too long'
    }
  );
});

test('repeated address headers count together', async (t) => {
  const header = `Cc: ${Array.from(
    { length: 1000 },
    (_, i) => `u${i}@example.com`
  ).join(', ')}`;
  t.is(await getUnsafeAddressHeader(raw(header)), undefined);
  t.deepEqual(
    await getUnsafeAddressHeader(
      raw(...Array.from({ length: 10 }, () => header))
    ),
    {
      key: 'Cc',
      reason: 'makes the address headers too long'
    }
  );
});

test('the headers of every part of a message count', async (t) => {
  const items = [
    'a@example.com',
    ...Array.from({ length: MAX_SEPARATORS + 1 }, () => 'x')
  ];
  const message = Buffer.from(
    [
      'From: a@example.com',
      'Content-Type: multipart/mixed; boundary=part',
      '',
      '--part',
      'Content-Type: text/plain',
      fold('To', items),
      '',
      'hello',
      '--part--',
      ''
    ].join('\r\n')
  );
  t.deepEqual(await getUnsafeAddressHeader(message), {
    key: 'To',
    reason: 'has too many addresses'
  });

  // (and the parts of an ordinary message pass)
  t.is(
    await getUnsafeAddressHeader(
      Buffer.from(
        [
          'From: a@example.com',
          'Content-Type: multipart/mixed; boundary=part',
          '',
          '--part',
          'Content-Type: text/plain',
          '',
          'hello',
          '--part--',
          ''
        ].join('\r\n')
      )
    ),
    undefined
  );
});

// a message embedded as message/rfc822 (the IMAP indexer reads its headers
// whatever its disposition, so they are checked), and nesting is bounded
function embed(inner, disposition) {
  return [
    'Content-Type: multipart/mixed; boundary=p',
    '',
    '--p',
    `Content-Type: message/rfc822${
      disposition ? `\r\nContent-Disposition: ${disposition}` : ''
    }`,
    '',
    inner,
    '',
    '--p--',
    ''
  ].join('\r\n');
}

test('an oversized header inside an embedded message is refused', async (t) => {
  const items = [
    'a@example.com',
    ...Array.from({ length: MAX_SEPARATORS + 1 }, () => 'x')
  ];
  const inner = [fold('To', items), 'Subject: inner', '', 'hello'].join('\r\n');
  for (const disposition of [undefined, 'inline', 'attachment']) {
    const message = Buffer.from(
      `From: a@example.com\r\n${embed(inner, disposition)}`
    );

    t.deepEqual(await getUnsafeAddressHeader(message), {
      key: 'To',
      reason: 'has too many addresses'
    });
  }

  // (an ordinary embedded message passes)
  const ok = [
    'To: someone@example.com',
    'Subject: forwarded',
    '',
    'the body'
  ].join('\r\n');
  t.is(
    await getUnsafeAddressHeader(
      Buffer.from(`From: a@example.com\r\n${embed(ok)}`)
    ),
    undefined
  );
});

test('a message that nests too many embedded messages is refused', async (t) => {
  const { MAX_EMBEDDED_DEPTH } = getUnsafeAddressHeader;
  let inner = 'Subject: core\r\nTo: real@example.com\r\n\r\nhi';
  for (let i = 0; i <= MAX_EMBEDDED_DEPTH + 2; i++) {
    const boundary = `b${i}`;
    inner = [
      `Content-Type: multipart/mixed; boundary=${boundary}`,
      '',
      `--${boundary}`,
      'Content-Type: message/rfc822',
      '',
      inner,
      '',
      `--${boundary}--`,
      ''
    ].join('\r\n');
  }

  const refused = await getUnsafeAddressHeader(
    Buffer.from(`From: a@example.com\r\n${inner}`)
  );
  t.is(refused?.reason, 'nests too many messages');

  // (a modestly forwarded chain still passes)
  let ok = 'Subject: core\r\nTo: real@example.com\r\n\r\nhi';
  for (let i = 0; i < MAX_EMBEDDED_DEPTH - 2; i++) {
    const boundary = `c${i}`;
    ok = [
      `Content-Type: multipart/mixed; boundary=${boundary}`,
      '',
      `--${boundary}`,
      'Content-Type: message/rfc822',
      '',
      ok,
      '',
      `--${boundary}--`,
      ''
    ].join('\r\n');
  }

  t.is(
    await getUnsafeAddressHeader(Buffer.from(`From: a@example.com\r\n${ok}`)),
    undefined
  );
});
