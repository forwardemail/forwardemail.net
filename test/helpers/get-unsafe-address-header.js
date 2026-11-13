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

test('a part whose header is folded over too many lines is refused at once, and a message with too many in all', async (t) => {
  const most = Math.floor(Math.sqrt(getUnsafeAddressHeader.MAX_PART_WORK)) - 10;
  const parts = (count, folded, plain = 0) =>
    Buffer.from(
      [
        'From: a@example.com',
        'Content-Type: multipart/mixed; boundary=b',
        '',
        ...Array.from({ length: count }, () => [
          '--b',
          `X-Folded: a${'\r\n b'.repeat(folded)}${'\r\nX-Plain: c'.repeat(
            plain
          )}`,
          '',
          'hello'
        ]).flat(),
        '--b--',
        ''
      ].join('\r\n')
    );

  // (as many as the message's own header may have is read)
  t.is(await getUnsafeAddressHeader(parts(1, most)), undefined);

  // (160,000 folded lines took mailsplit 24 seconds, 1000 among 248,000
  //  others 1.6 seconds)
  for (const [folded, plain] of [
    [160_000, 0],
    [1000, 248_000]
  ]) {
    const started = Date.now();
    const unsafe = await getUnsafeAddressHeader(parts(1, folded, plain));
    t.is(unsafe.reason, 'is folded or repeated over too many lines');
    t.true(Date.now() - started < 1000);
  }

  // (in all, across parts: twice as much as the message's own header may
  //  take)
  t.is(await getUnsafeAddressHeader(parts(6, most)), undefined);
  t.deepEqual(await getUnsafeAddressHeader(parts(7, most)), {
    key: 'X-Folded',
    reason:
      'makes the headers of the message folded or repeated over too many lines'
  });
});

test('a part read as all header, for want of the blank line ending it, is not refused for its lines', async (t) => {
  // (lines not folded cost mailsplit little)
  const body = Array.from({ length: 6000 }, () => 'QUJDREVGR0g=');
  const raw = Buffer.from(
    [
      'From: a@example.com',
      'Content-Type: multipart/mixed; boundary=b',
      '',
      '--b',
      'Content-Type: application/octet-stream',
      'Content-Transfer-Encoding: base64',
      ...body,
      '--b--',
      ''
    ].join('\r\n')
  );
  t.is(await getUnsafeAddressHeader(raw), undefined);
});

test('an embedded message’s header may be folded over as many lines as the message’s own, e.g. a long thread’s References field, and a message past mailsplit’s limits is refused, as its headers would not all be checked', async (t) => {
  const forwarded = (header) =>
    Buffer.from(
      [
        'From: a@example.com',
        'Content-Type: multipart/mixed; boundary=b',
        '',
        '--b',
        'Content-Type: message/rfc822',
        '',
        'From: b@example.com',
        header,
        '',
        'hi',
        '--b--',
        ''
      ].join('\r\n')
    );
  t.is(
    await getUnsafeAddressHeader(
      forwarded(
        `References: <a@example.com>${'\r\n <x@example.com>'.repeat(1500)}`
      )
    ),
    undefined
  );

  const unsafe = `Reply-To: ${'x,'.repeat(MAX_SEPARATORS + 1)}a@example.com`;
  const tooMany = Buffer.from(
    [
      'From: a@example.com',
      'Content-Type: multipart/mixed; boundary=b',
      '',
      ...Array.from({ length: 1001 }, () => ['--b', 'X: y', '', 'x']).flat(),
      '--b',
      unsafe,
      '',
      'x',
      '--b--',
      ''
    ].join('\r\n')
  );
  t.deepEqual(await getUnsafeAddressHeader(tooMany), {
    key: 'Content-Type',
    reason: 'has too many parts to read'
  });
});

test('a header is limited as the IMAP indexer reads it too: lines ending at a CR alone, folded by any white space, and a field repeated', async (t) => {
  const most = Math.floor(Math.sqrt(getUnsafeAddressHeader.MAX_PART_WORK)) - 10;
  const top = (header) =>
    Buffer.from(['From: a@example.com', header, '', 'hi', ''].join('\r\n'));
  // (as bytes, so a no-break space is one byte, as the indexer reads it)
  const part = (header) =>
    Buffer.from(
      [
        'From: a@example.com',
        'Content-Type: multipart/mixed; boundary=b',
        '',
        '--b',
        header,
        '',
        'hi',
        '--b--',
        ''
      ].join('\r\n'),
      'latin1'
    );
  const n = most * 3;
  // (60,000 folded lines ending at a CR alone took the indexer 46 seconds,
  //  in the message's own header, where mailsplit reads one line)
  for (const [name, raw] of [
    ['cr', top(`X-A: a${'\r b'.repeat(n)}`)],
    ['vt', part(`X-A: a${'\r\n\u000Bb'.repeat(n)}`)],
    ['nbsp', part(`X-A: a${'\r\n b'.repeat(n)}`)],
    ['repeated', part('X-A: b\r\n'.repeat(n).trimEnd())]
  ]) {
    const started = Date.now();
    const unsafe = await getUnsafeAddressHeader(raw);
    t.is(
      unsafe?.reason,
      'is folded or repeated over too many lines',
      `${name}: ${JSON.stringify(unsafe)}`
    );
    t.true(Date.now() - started < 1000, `${name} took too long`);
  }

  // (and as many as a header may have are read)
  t.is(
    await getUnsafeAddressHeader(part(`X-A: a${'\r\n\u000Bb'.repeat(most)}`)),
    undefined
  );
  t.is(
    await getUnsafeAddressHeader(
      part('Received: b\r\n'.repeat(most).trimEnd())
    ),
    undefined
  );
});

test('a message’s own header, or an embedded message’s, may be folded over as many lines as a References field Postfix leaves, but not hold very many lines', async (t) => {
  // (a References field Postfix cut at 100 KB: about 3000 lines)
  const ids = Array.from(
    { length: 2924 },
    (_, i) => ` <thread-${String(i).padStart(6, '0')}@lists.example.org>`
  );
  const references = `References:${ids.join('\r\n')}`;
  const forwarded = (header) =>
    Buffer.from(
      [
        'From: a@example.com',
        'Content-Type: multipart/mixed; boundary=b',
        '',
        '--b',
        'Content-Type: message/rfc822',
        '',
        'From: b@example.com',
        header,
        '',
        'hi',
        '--b--',
        ''
      ].join('\r\n')
    );
  t.is(
    await getUnsafeAddressHeader(
      Buffer.from(
        ['From: a@example.com', references, '', 'hi', ''].join('\r\n')
      )
    ),
    undefined
  );
  t.is(await getUnsafeAddressHeader(forwarded(references)), undefined);
  // (a few folded among very many others, which take longer)
  const plain = Array.from({ length: 30_000 }, (_, i) => `X-${i}: y`);
  t.deepEqual(
    await getUnsafeAddressHeader(
      forwarded(`X-F: a${'\r\n b'.repeat(50)}\r\n${plain.join('\r\n')}`)
    ),
    { key: 'X-9948', reason: 'is in a header of too many lines' }
  );
});

test('a part’s header with long runs of line breaks within it is refused before mailsplit parses it, and a part read as all header for want of its empty line, however large, is left to other checks', async (t) => {
  const part = (header) =>
    Buffer.from(
      [
        'From: a@example.com',
        'Content-Type: multipart/mixed; boundary=b',
        '',
        '--b',
        header,
        '',
        'hi',
        '--b--',
        ''
      ].join('\r\n')
    );
  // (mailsplit removes the line breaks ending a header with /[\r\n]+$/, in
  //  time in the square of every run of them within it: 20,000 lines of
  //  "\r\r\n" took 6 seconds)
  for (const header of [
    `X-A: a${'\r'.repeat(100_000)}x`,
    `X-A: a\r\n${'\r\r\n'.repeat(20_000)}X-B: c`
  ]) {
    const started = Date.now();
    const unsafe = await getUnsafeAddressHeader(part(header));
    t.is(unsafe?.reason, 'has too many line breaks in a row');
    t.true(Date.now() - started < 1000);
  }

  // (a body of 2 MB read as the part's header, past mailsplit's limit)
  const body = Array.from({ length: 160_000 }, () => 'QUJDREVGR0g=');
  t.is(
    await getUnsafeAddressHeader(
      Buffer.from(
        [
          'From: a@example.com',
          'Content-Type: multipart/mixed; boundary=b',
          '',
          '--b',
          'Content-Type: application/octet-stream',
          ...body,
          '--b--',
          ''
        ].join('\r\n')
      )
    ),
    undefined
  );
});

test('an attached message shown inline has the header limits of a message, and a message whose lines end with two CRs is read in linear time and not refused for its lines', async (t) => {
  const ids = Array.from(
    { length: 2950 },
    (_, i) => ` <thread-${String(i).padStart(6, '0')}@lists.example.org>`
  );
  t.is(
    await getUnsafeAddressHeader(
      Buffer.from(
        [
          'From: a@example.com',
          'Content-Type: multipart/mixed; boundary=b',
          '',
          '--b',
          'Content-Type: message/rfc822',
          'Content-Disposition: inline',
          '',
          'From: b@example.com',
          `References:${ids.join('\r\n')}`,
          '',
          'hi',
          '--b--',
          ''
        ].join('\r\n')
      )
    ),
    undefined
  );
  // (CR CR LF line endings, which mailsplit reads as no empty line: the body
  //  is read as the header, of lines neither folded nor repeated)
  const body = Array.from(
    { length: 12_000 },
    (_, i) => `line ${i} of the body`
  );
  t.is(
    await getUnsafeAddressHeader(
      Buffer.from(
        [
          'From: a@example.com',
          'To: b@example.org',
          'Subject: s',
          '',
          ...body,
          ''
        ]
          .join('\r\n')
          .replaceAll('\r\n', '\r\r\n')
      )
    ),
    undefined
  );
});
