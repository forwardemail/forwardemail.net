/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// What authenticating a message (mailauth) may cost: the DKIM-Signature
// fields read, and the DNS queries made for one message
// (helpers/authentication-limits.js)
//

const process = require('node:process');
const { Buffer } = require('node:buffer');
const { createHash } = require('node:crypto');

const getStream = require('get-stream');
const test = require('ava');

const MessageSplitter = require('#helpers/message-splitter');
const isAuthenticatedMessage = require('#helpers/is-authenticated-message');
const {
  limits,
  authenticateSent,
  createBoundedResolver,
  keepDkimSignatures
} = require('#helpers/authentication-limits');
const {
  checkFromLimits,
  checkHeaderLimits,
  countFields
} = require('#helpers/header-limits');

const DEFAULTS = { ...limits };
test.afterEach.always(() => {
  Object.assign(limits, DEFAULTS);
});

// a resolver that never answers (a stuck authoritative server)
const hung = () => new Promise(() => {});

// a resolver that says each name does not exist, counting the queries
function counting() {
  const asked = [];
  return {
    asked,
    async resolve(name, type) {
      asked.push(`${type} ${name}`);
      const err = new Error('not found');
      err.code = 'ENOTFOUND';
      throw err;
    }
  };
}

test('only the first DKIM-Signature fields are kept, each with its folded lines, and the rest of the message as it is', (t) => {
  const signatures = Array.from(
    { length: 4 },
    (_, i) => `DKIM-Signature: v=1; d=d${i}.example;\r\n\tb=AAA${i}\r\n`
  ).join('');
  const raw = Buffer.from(
    `${signatures}From: alice@example.com\r\ndkim-signature : v=1; d=last.example\r\n  b=BBB\r\nSubject: hello\r\n\r\nbody\r\n\r\nDKIM-Signature: not a header\r\n`
  );
  t.is(
    keepDkimSignatures(raw, 2).toString(),
    'DKIM-Signature: v=1; d=d0.example;\r\n\tb=AAA0\r\nDKIM-Signature: v=1; d=d1.example;\r\n\tb=AAA1\r\nFrom: alice@example.com\r\nSubject: hello\r\n\r\nbody\r\n\r\nDKIM-Signature: not a header\r\n'
  );
  // (with bare line breaks too)
  const bare = Buffer.from(raw.toString().replaceAll('\r\n', '\n'));
  t.is(
    keepDkimSignatures(bare, 1).toString(),
    'DKIM-Signature: v=1; d=d0.example;\n\tb=AAA0\nFrom: alice@example.com\nSubject: hello\n\nbody\n\nDKIM-Signature: not a header\n'
  );
  // (and a header of bare line breaks ended by CR LF, as mailauth reads it:
  //  the body is kept whole)
  t.is(
    keepDkimSignatures(
      Buffer.from(
        'DKIM-Signature: a\nDKIM-Signature: b\nFrom: x@example.com\n\r\nDKIM-Signature: body line\r\n'
      ),
      1
    ).toString(),
    'DKIM-Signature: a\nFrom: x@example.com\n\r\nDKIM-Signature: body line\r\n'
  );
  // (a first line starting with white space is a field, as mailauth reads
  //  it, not a folded line)
  t.is(
    keepDkimSignatures(
      Buffer.from(
        '\tDKIM-Signature: a\r\nDKIM-Signature: b\r\nFrom: x@example.com\r\n\r\nbody\r\n'
      ),
      1
    ).toString(),
    '\tDKIM-Signature: a\r\nFrom: x@example.com\r\n\r\nbody\r\n'
  );
  // (a name with its ":" on a folded line, as mailauth reads it)
  t.is(
    keepDkimSignatures(
      Buffer.from(
        'DKIM-Signature\r\n : a\r\nDKIM-Signature\r\n : b\r\nFrom: x@example.com\r\n\r\nbody\r\n'
      ),
      1
    ).toString(),
    'DKIM-Signature\r\n : a\r\nFrom: x@example.com\r\n\r\nbody\r\n'
  );
  // (a field of more folded lines than a call takes)
  const folds = '\r\n x'.repeat(200_000);
  t.is(
    keepDkimSignatures(
      Buffer.from(
        `DKIM-Signature: a\r\nDKIM-Signature: b${folds}\r\nFrom: x@example.com\r\n\r\nbody\r\n`
      ),
      1
    ).toString(),
    'DKIM-Signature: a\r\nFrom: x@example.com\r\n\r\nbody\r\n'
  );
  t.is(
    keepDkimSignatures(
      Buffer.from(
        `DKIM-Signature: a${folds}\r\nFrom: x@example.com\r\n\r\nbody\r\n`
      ),
      1
    ).toString(),
    `DKIM-Signature: a${folds}\r\nFrom: x@example.com\r\n\r\nbody\r\n`
  );
  // (no more than that: the same message)
  t.is(keepDkimSignatures(raw, 5), raw);
  // (bytes of any kind are kept as they are)
  const binary = Buffer.concat([
    Buffer.from('DKIM-Signature: a\r\nDKIM-Signature: b\r\nSubject: '),
    Buffer.from([0xc3, 0xa9, 0xff]),
    Buffer.from('\r\n\r\n'),
    Buffer.from([0x00, 0xfe, 0x80])
  ]);
  t.deepEqual(
    keepDkimSignatures(binary, 1),
    Buffer.concat([
      Buffer.from('DKIM-Signature: a\r\nSubject: '),
      Buffer.from([0xc3, 0xa9, 0xff]),
      Buffer.from('\r\n\r\n'),
      Buffer.from([0x00, 0xfe, 0x80])
    ])
  );
});

test('a resolver for one message makes so many queries at most, and none past its time limit', async (t) => {
  const { asked, resolve } = counting();
  const bounded = createBoundedResolver(resolve, { queries: 3 });
  for (let i = 0; i < 5; i++)
    await t.throwsAsync(bounded(`name${i}.example`, 'TXT'), {
      code: i < 3 ? 'ENOTFOUND' : 'ETIMEOUT'
    });
  t.is(asked.length, 3);

  // a query still waiting at the time limit is answered ETIMEOUT, and no
  // more are made
  let made = 0;
  const slow = createBoundedResolver(
    () => {
      made++;
      return hung();
    },
    { timeout: 300 }
  );
  const started = Date.now();
  await t.throwsAsync(slow('stuck.example', 'TXT'), { code: 'ETIMEOUT' });
  t.true(Date.now() - started < 1000, `took ${Date.now() - started}ms`);
  await t.throwsAsync(slow('next.example', 'TXT'), { code: 'ETIMEOUT' });
  t.is(made, 1);
});

// the headers and body of a raw message, as the MX server has them
async function split(raw) {
  const splitter = new MessageSplitter({ maxBytes: Number.POSITIVE_INFINITY });
  splitter.end(raw);
  const body = await getStream.buffer(splitter);
  return { headers: splitter.headers, body };
}

function session() {
  return {
    remoteAddress: '192.0.2.10',
    hostNameAppearsAs: 'mx.sender.example',
    resolvedClientHostname: 'mx.sender.example',
    envelope: { mailFrom: { address: 'alice@sender.example' } },
    originalFromAddress: 'alice@sender.example',
    originalFromAddressDomain: 'sender.example',
    originalFromAddressRootDomain: 'sender.example'
  };
}

const MESSAGE = Buffer.from(
  [
    'DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=sender.example; s=s1; h=from; bh=AAAA; b=AAAA',
    'From: alice@sender.example',
    'To: bob@example.org',
    'Subject: hello',
    '',
    'hello'
  ].join('\r\n')
);

test('the MX server authenticates a message with at most so many DNS queries, for so long, however its servers answer', async (t) => {
  // (a resolver that never answers: authentication ends at the time limit,
  //  with temporary errors)
  limits.timeout = 500;
  const { headers, body } = await split(MESSAGE);
  const s = session();
  const started = Date.now();
  await Promise.race([
    isAuthenticatedMessage(headers, body, s, { resolve: hung }).catch(() => {}),
    new Promise((resolve) => {
      setTimeout(resolve, 10_000);
    })
  ]);
  const elapsed = Date.now() - started;
  t.true(elapsed < 3000, `took ${elapsed}ms`);
  t.is(s.spf?.status?.result, 'temperror');

  // (and no more queries than its budget)
  limits.timeout = DEFAULTS.timeout;
  limits.queries = 2;
  const { asked, resolve } = counting();
  const split2 = await split(MESSAGE);
  await isAuthenticatedMessage(split2.headers, split2.body, session(), {
    resolve
  }).catch(() => {});
  t.true(asked.length <= 2, `${asked.length} queries`);
});

test('a message we send with hundreds of DKIM-Signature fields on a large body is authenticated quickly, by our own signature first', async (t) => {
  // (ours, then 300 with distinct `l=` values on a 5 MB body: mailauth would
  //  hash the body for each)
  const body = `${'y'.repeat(998)}\r\n`.repeat(5000);
  const bh = createHash('sha256').update(body).digest('base64');
  const added = Array.from(
    { length: 300 },
    (_, i) =>
      `DKIM-Signature: v=1; a=rsa-sha256; c=simple/simple; d=d${i}.attacker.example; s=s${i}; h=from; l=${
        body.length - 1 - i
      }; bh=${bh}; b=AAAA\r\n`
  ).join('');
  const raw = Buffer.from(
    `DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=ours.example; s=s; h=from; bh=${bh}; b=AAAA\r\n${added}From: alice@ours.example\r\nTo: bob@example.org\r\nSubject: hello\r\n\r\n${body}`
  );
  const { asked, resolve } = counting();
  const cpu = process.cpuUsage();
  // (as helpers/process-email.js authenticates it)
  const { dkim } = await authenticateSent(raw, {
    sender: 'alice@ours.example',
    ip: '192.0.2.10',
    helo: 'mx.ours.example',
    mta: 'mx.ours.example',
    disableArc: true,
    disableBimi: true,
    resolver: resolve
  });
  const used = process.cpuUsage(cpu);
  const ms = (used.user + used.system) / 1000;
  t.true(ms < 2000, `${Math.round(ms)}ms of CPU`);
  t.is(dkim.results.length, limits.dkimSignatures);
  t.is(dkim.results[0].signingDomain, 'ours.example');
  t.true(asked.length <= limits.queries);
});

test('a message we send whose From field mailauth could not read in reasonable time is not authenticated, at once', async (t) => {
  // (queued before such a From was refused as it was submitted: one
  //  address, and 99 KB of empty groups)
  const groups = 'g:;'
    .repeat(33_000)
    .match(/.{1,998}/g)
    .join('\r\n ');
  const raw = Buffer.from(
    `DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=ours.example; s=s; h=from; bh=AAAA; b=AAAA\r\nFrom: alice@ours.example, ${groups}\r\nTo: bob@example.org\r\nSubject: hello\r\n\r\nhello\r\n`
  );
  const { asked, resolve } = counting();
  const cpu = process.cpuUsage();
  const { dkim } = await authenticateSent(raw, {
    sender: 'alice@ours.example',
    ip: '192.0.2.10',
    helo: 'mx.ours.example',
    mta: 'mx.ours.example',
    disableArc: true,
    disableBimi: true,
    resolver: resolve
  });
  const used = process.cpuUsage(cpu);
  const ms = (used.user + used.system) / 1000;
  t.true(ms < 1000, `${Math.round(ms)}ms of CPU`);
  // (no signature verified: it is not sent, see `helpers/process-email`)
  t.deepEqual(dkim.results, []);
  t.is(asked.length, 0);
});

test('a From field with a few groups as display names or address literals give is not refused, and a line of CRs alone in a header is', (t) => {
  for (const from of [
    'root@[IPv6:2001:db8:0:0:0:0:0:1] (host fe80:0:0:0:0:0:0:1 fe80:1:2:3:4:5:6:7)',
    `${'Re: Fwd: '.repeat(16)}<a@example.com>`
  ])
    t.is(
      checkFromLimits(Buffer.from(`From: ${from}\r\nSubject: hi\r\n`)),
      null,
      `${from}`
    );
  // (many more nest as deep as the parser could read them: refused)
  t.truthy(
    checkFromLimits(Buffer.from(`From: ${'x:'.repeat(100)}a@example.com\r\n`))
  );
  // (a line of CRs alone, which mailauth reads as part of the field before
  //  it and mailsplit as ending it: another From address to each)
  t.truthy(
    checkHeaderLimits(
      Buffer.from(
        'From: ceo@bank.example (\r\n\r\r\n ) <a@attacker.example>\r\nSubject: s\r\n\r\nbody'
      )
    )
  );
  t.truthy(checkHeaderLimits(Buffer.from('From: a@example.com\r\n\rX: y\r\n')));
});

test('a header is read as mailauth reads it: a line starting with any white space continues a field, and a name is read without white space around it', (t) => {
  // (a From field continued by lines starting with "\v" or "\f", which
  //  mailauth joins to it, and mailsplit does not)
  // (past the length of a field, 128 KB, too)
  const groups = Array.from({ length: 45 }, () => 'x:;'.repeat(1000));
  for (const space of ['\v', '\f', '\u00A0']) {
    const header = Buffer.from(
      `From: a@example.com\r\n${groups
        .map((line) => `${space}${line}`)
        .join('\r\n')}\r\nSubject: hi\r\n`,
      'latin1'
    );
    t.truthy(checkFromLimits(header), `${JSON.stringify(space)}`);
    // (and as one field, for its length)
    t.truthy(checkHeaderLimits(header), `${JSON.stringify(space)}`);
  }

  // (a second From field named with a no-break space before its colon)
  const named = Buffer.from(
    `From: a@example.com\r\nFrom\u00A0: ${'x:;'.repeat(3000)}\r\n`,
    'latin1'
  );
  t.is(countFields(named, 'from'), 2);
  t.truthy(checkFromLimits(named));
  // (what mailsplit and mailauth both read as one is still one)
  t.is(
    countFields(
      Buffer.from('From: "A, B" <a@example.com>\r\n\tcontinued\r\n'),
      'from'
    ),
    1
  );
  t.is(
    checkFromLimits(
      Buffer.from('From: "Alert: disk: full" <a@example.com>\r\n')
    ),
    null
  );
  // (and a field with its ":" on a folded line: its name and value as
  //  mailauth reads them, the value up to the limit)
  const folded = `From\r\n : ${'a'.repeat(4095)}\r\n`;
  t.is(countFields(Buffer.from(folded), 'from'), 1);
  t.is(checkFromLimits(Buffer.from(folded)), null);
  t.truthy(checkFromLimits(Buffer.from(`From\r\n :  ${'a'.repeat(4095)}\r\n`)));
  // (a value longer than the address DMARC passed for is checked against,
  //  which could name another address, e.g. one in a long display name)
  t.truthy(
    checkFromLimits(
      Buffer.from(
        `From: "${'A'.repeat(
          5000
        )}, victim@victim.example" <attacker@evil.example>\r\n`
      )
    )
  );
  t.is(
    checkFromLimits(
      Buffer.from(`From: "${'A'.repeat(4000)}" <a@example.com>\r\n`)
    ),
    null
  );
});

test('DKIM-Signature fields mailauth reads as such are counted and kept as it reads them, also named with white space around them', async (t) => {
  const body = `${'y'.repeat(998)}\r\n`.repeat(5000);
  const bh = createHash('sha256').update(body).digest('base64');
  const added = Array.from(
    { length: 300 },
    (_, i) =>
      `DKIM-Signature\u00A0: v=1; a=rsa-sha256; c=simple/simple; d=d${i}.attacker.example; s=s${i}; h=from; l=${
        body.length - 1 - i
      }; bh=${bh}; b=AAAA\r\n`
  ).join('');
  const raw = Buffer.from(
    `DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=ours.example; s=s; h=from; bh=${bh}; b=AAAA\r\n${added}From: alice@ours.example\r\nTo: bob@example.org\r\nSubject: hello\r\n\r\n${body}`,
    'latin1'
  );
  // (only so many kept as a message we send is authenticated)
  const kept = keepDkimSignatures(raw);
  t.true(kept.length < raw.length);
  const { asked, resolve } = counting();
  const cpu = process.cpuUsage();
  const { dkim } = await authenticateSent(raw, {
    sender: 'alice@ours.example',
    ip: '192.0.2.10',
    helo: 'mx.ours.example',
    mta: 'mx.ours.example',
    disableArc: true,
    disableBimi: true,
    resolver: resolve
  });
  const used = process.cpuUsage(cpu);
  const ms = (used.user + used.system) / 1000;
  t.true(ms < 2000, `${Math.round(ms)}ms of CPU`);
  t.is(dkim.results.length, limits.dkimSignatures);
  t.true(asked.length <= limits.queries);

  // (and the MX server answers a temporary error for more than it reads)
  const { headers, body: rest } = await split(raw);
  t.is(countFields(headers.headers, 'dkim-signature'), 301);
  const error = await t.throwsAsync(
    isAuthenticatedMessage(headers, rest, session(), { resolve })
  );
  t.is(error.responseCode, 421);
});

test('a header with a long run of CRs within a line is refused, in linear time, and one whose lines end with a few is not', (t) => {
  // (parsers remove a header's trailing line breaks with /[\r\n]+$/, in time
  //  in the square of every run of them within it)
  const started = Date.now();
  t.is(
    checkHeaderLimits(
      Buffer.from(`Subject: a${'\r'.repeat(500_000)}x\r\nTo: b@example.com\r\n`)
    ),
    'Message header has too many line breaks in a row'
  );
  t.true(Date.now() - started < 1000);
  t.is(
    checkHeaderLimits(
      Buffer.from('Subject: a\r\r\nTo: b@example.com\r\nX: a\rb\r\n')
    ),
    null
  );
  // (and the fields are read without them, in linear time)
  const fieldsStarted = Date.now();
  t.is(countFields(`Subject: a${'\r'.repeat(200_000)}\r\nX: y\r\n`, 'x'), 1);
  t.true(Date.now() - fieldsStarted < 1000);
});

test('a header with no CR is read for runs of them in linear time', (t) => {
  const line = `X-A: ${'a'.repeat(2000)}\n`;
  const header = Buffer.from(line.repeat(4990));
  const started = Date.now();
  t.is(checkHeaderLimits(header), null);
  t.true(Date.now() - started < 500, `took ${Date.now() - started}ms`);
});
