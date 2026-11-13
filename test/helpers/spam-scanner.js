/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Spam Scanner in monitor mode (helpers/spam-scanner.js): a scan never
// throws or holds up delivery, only logs what it would mark as spam, adds
// X-Spam-Scanner-* headers, and outbound blocks only viruses, the GTUBE
// test string and, by the domain's settings, programs and malware and adult
// links.
//

const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { execFileSync } = require('node:child_process');
const { Buffer } = require('node:buffer');
const { domainToASCII } = require('node:url');
const { once } = require('node:events');
const timers = require('node:timers');
const { setTimeout } = require('node:timers/promises');

const Redis = require('ioredis-mock');
const getStream = require('get-stream');
const test = require('ava');

const {
  captureSpamScannerLog,
  captureSpamScannerStats,
  captureSpamScannerWarnings
} = require('../utils');

const MessageSplitter = require('#helpers/message-splitter');
const config = require('#config');
const getBounceInfo = require('#helpers/get-bounce-info');
const getErrorCode = require('#helpers/get-error-code');
const logger = require('#helpers/logger');
const printable = require('#helpers/printable');
const spamScanner = require('#helpers/spam-scanner');
const createStats = require('#helpers/spam-scanner-stats');

const client = new Redis();
client.setMaxListeners(0);

const DEFAULTS = structuredClone(config.spamScanner);

// (a domain's Spam Scanner settings with link hosts looked up, see
//  `protectionOf`: by default they are not)
const LINKS = { adult: true, phishing: true, executable: true };

test.beforeEach(async () => {
  await spamScanner.reset();
  Object.assign(config.spamScanner, structuredClone(DEFAULTS));
});

test.afterEach.always(async () => {
  await spamScanner.reset();
  Object.assign(config.spamScanner, structuredClone(DEFAULTS));
});

function message(lines) {
  return Buffer.from(lines.join('\r\n'));
}

// a phishing message: a lookalike domain, a link showing another address,
// and a brand in the display name
const PHISHING = message([
  'From: "PayPal" <service@paypa1-secure.example>',
  'To: bob@example.org',
  'Subject: Your account is suspended',
  'Message-ID: <phishing@paypa1-secure.example>',
  'Date: Sun, 11 Oct 2026 10:00:00 +0000',
  'Content-Type: text/html; charset=utf-8',
  '',
  '<p>Dear customer, verify your account now: <a href="http://paypa1-secure.example/login">https://www.paypal.com/signin</a></p>'
]);

const HAM = message([
  'From: Alice <alice@example.com>',
  'To: bob@example.org',
  'Subject: Lunch tomorrow',
  'Message-ID: <lunch@example.com>',
  'Date: Sun, 11 Oct 2026 10:00:00 +0000',
  '',
  'Hey Bob, do you want to grab lunch tomorrow at noon?'
]);

// a ZIP archive of [name, content] entries (stored, no compression)
function zipOf(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const [name, content] of entries) {
    const nameBuffer = Buffer.from(name);
    const data = Buffer.from(content);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04_03_4b_50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuffer.length, 26);
    locals.push(local, nameBuffer, data);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02_01_4b_50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuffer.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuffer);
    offset += 30 + nameBuffer.length + data.length;
  }

  const directory = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06_05_4b_50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, directory, end]);
}

// the start of a Windows program: "MZ", and where its header says, "PE\0\0"
function windowsProgram() {
  const content = Buffer.alloc(0x48);
  content.write('MZ', 0, 'latin1');
  content.writeUInt32LE(0x40, 0x3c);
  content.write('PE\0\0', 0x40, 'latin1');
  return content;
}

function withAttachment(filename, content) {
  return withAttachments([[filename, content]]);
}

function withAttachments(files) {
  return message([
    'From: alice@example.com',
    'To: bob@example.org',
    'Subject: Files',
    'Message-ID: <files@example.com>',
    'Date: Sun, 11 Oct 2026 10:00:00 +0000',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="b"',
    '',
    '--b',
    'Content-Type: text/plain',
    '',
    'Here you go.',
    ...files.flatMap(([filename, content]) => [
      '--b',
      `Content-Type: application/octet-stream; name="${filename}"`,
      `Content-Disposition: attachment; filename="${filename}"`,
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(content).toString('base64')
    ]),
    '--b--',
    ''
  ]);
}

const session = {
  id: 'session-id',
  remoteAddress: '192.0.2.10',
  resolvedClientHostname: 'mx.example.net',
  hostNameAppearsAs: 'mx.example.net',
  envelope: {
    mailFrom: { address: 'service@paypa1-secure.example' },
    rcptTo: [{ address: 'bob@example.org' }]
  }
};

// the headers of a raw message
async function parseHeaders(raw) {
  const splitter = new MessageSplitter({ maxBytes: Number.POSITIVE_INFINITY });
  splitter.end(raw);
  await getStream.buffer(splitter);
  return splitter.headers;
}

test('a phishing message is logged and gets X-Spam-Scanner headers, and nothing else in monitor mode', async (t) => {
  const lines = captureSpamScannerLog(t);
  const scan = await spamScanner.scan(PHISHING, {
    session,
    direction: 'inbound',
    client
  });

  t.truthy(scan);
  t.true(scan.isSpam);
  t.is(scan.version, spamScanner.getVersion());
  t.regex(scan.version, /^7\.\d+\.\d+$/);
  t.true(scan.score >= scan.threshold);
  t.true(scan.tests.some((item) => item.name === 'PHISHING_LOOKALIKE_DOMAIN'));

  // logged once, with the verdict, the client, the sender and the subject,
  // and not the recipients' addresses or the body
  t.is(lines.length, 1);
  t.true(lines[0].includes('would mark as spam'));
  const logged = JSON.parse(lines[0].slice(lines[0].indexOf('{')));
  t.is(logged.direction, 'inbound');
  t.is(logged.score, scan.score);
  t.is(logged.session_id, 'session-id');
  t.is(logged.remote_address, '192.0.2.10');
  t.is(logged.mail_from, 'service@paypa1-secure.example');
  t.is(logged.from, 'service@paypa1-secure.example');
  t.is(logged.subject, 'Your account is suspended');
  t.deepEqual(logged.rcpt_to_domains, ['example.org']);
  t.false(lines[0].includes('bob@'));
  t.false(lines[0].includes('Dear customer'));

  const headers = Object.fromEntries(spamScanner.getHeaders(scan));
  t.is(headers['X-Spam-Scanner-Version'], spamScanner.getVersion());
  t.is(headers['X-Spam-Scanner-Flag'], 'YES');
  t.is(headers['X-Spam-Scanner-Score'], String(scan.score));
  t.is(headers['X-Spam-Scanner-Action'], scan.action);
  t.regex(
    headers['X-Spam-Scanner-Status'],
    /^Yes, score=[\d.]+ required=5\.0 tests=.*PHISHING_LOOKALIKE_DOMAIN.* version=7\.\d+\.\d+$/
  );
  // (the tests list can be folded: a space after each comma)
  t.notRegex(headers['X-Spam-Scanner-Status'], /,\S/);
  // (no header that a mail client or a filter acts on)
  t.is(headers['X-Spam-Flag'], undefined);
  t.is(headers['X-Spam-Status'], undefined);

  // and nothing that blocks it outbound (a lookalike link only counts toward
  // the score)
  t.deepEqual(spamScanner.getOutboundBlockingMessages(scan), []);
});

test('out of monitor mode the SpamAssassin headers are added too', async (t) => {
  config.spamScanner.monitorOnly = false;
  captureSpamScannerLog(t);
  const scan = await spamScanner.scan(PHISHING, { session, client });
  const headers = Object.fromEntries(spamScanner.getHeaders(scan));
  t.is(headers['X-Spam-Flag'], 'YES');
  t.is(headers['X-Spam-Score'], scan.score.toFixed(1));
  t.regex(headers['X-Spam-Status'], /^Yes, score=/);
  t.is(headers['X-Spam-Scanner-Flag'], 'YES');
});

test('out of monitor mode, a virus scan header a sender added is removed', async (t) => {
  config.spamScanner.monitorOnly = false;
  captureSpamScannerLog(t);
  const raw = Buffer.concat([Buffer.from('X-Spam-Virus-Scan: ok\r\n'), HAM]);
  const headers = await parseHeaders(raw);
  const scan = await spamScanner.scan(raw, { session, client });
  spamScanner.addHeaders(headers, scan);
  t.deepEqual(headers.get('x-spam-virus-scan'), []);
  // (and from the headers a webhook gets)
  const object = { 'X-Spam-Virus-Scan': 'ok', Subject: 'Lunch tomorrow' };
  spamScanner.updateHeaderObject(object, scan);
  t.false('X-Spam-Virus-Scan' in object);
  t.is(object.Subject, 'Lunch tomorrow');
});

test('out of monitor mode, the SpamAssassin headers others added are kept on a message that was not scanned, and forged X-Spam-Scanner ones removed also where repeated', async (t) => {
  config.spamScanner.monitorOnly = false;
  const raw = Buffer.concat([
    Buffer.from('X-Spam-Flag: NO\r\nX-Spam-Scanner-Flag: NO\r\n'),
    HAM
  ]);
  // (not scanned, e.g. not picked by SPAM_SCANNER_MX_PERCENT: nothing
  //  replaces another's verdict)
  const headers = await parseHeaders(raw);
  spamScanner.addHeaders(headers, null);
  t.is(headers.get('x-spam-flag').length, 1);
  t.deepEqual(headers.get('x-spam-scanner-flag'), []);
  const object = { 'X-Spam-Flag': 'NO', 'X-Spam-Scanner-Flag': 'NO' };
  const repeated = { 'X-Spam-Scanner-Flag': ['NO', 'NO'], Received: ['a'] };
  spamScanner.updateHeaderObject(object, null, repeated);
  t.is(object['X-Spam-Flag'], 'NO');
  t.false('X-Spam-Scanner-Flag' in object);
  t.false('X-Spam-Scanner-Flag' in repeated);
  t.deepEqual(repeated.Received, ['a']);
});

test('X-Spam-Scanner headers a sender made up by the thousand are removed in one pass, with the rest kept in order', async (t) => {
  const names = [];
  for (let i = 0; i < 4990; i++) names.push(`X-Spam-Scanner-${i}: x\r\n`);
  const raw = Buffer.concat([
    Buffer.from(`Received: a\r\n${names.join('')}Received: b\r\n`),
    HAM
  ]);
  const headers = await parseHeaders(raw);
  const started = process.hrtime.bigint();
  spamScanner.addHeaders(headers, null);
  const took = Number(process.hrtime.bigint() - started) / 1e6;
  t.deepEqual(
    headers
      .getList()
      .map((line) => line.key)
      .filter((key) => key.startsWith('x-spam-scanner')),
    []
  );
  t.deepEqual(headers.get('received').slice(0, 2), [
    'Received: a',
    'Received: b'
  ]);
  // (one pass over the lines takes a few ms; a pass for each name took 130)
  t.true(took < 40, `${took}ms`);
});

test('a wanted message is not logged', async (t) => {
  const lines = captureSpamScannerLog(t);
  const scan = await spamScanner.scan(HAM, {
    session: { ...session, envelope: { mailFrom: { address: '' } } },
    client
  });
  t.truthy(scan);
  t.false(scan.isSpam);
  t.is(lines.length, 0);
  const headers = Object.fromEntries(spamScanner.getHeaders(scan));
  t.is(headers['X-Spam-Scanner-Flag'], 'NO');
  t.regex(headers['X-Spam-Scanner-Status'], /^No, score=/);
});

test('headers a sender added are replaced, and the SpamAssassin ones kept in monitor mode', async (t) => {
  captureSpamScannerLog(t);
  const raw = Buffer.concat([
    Buffer.from(
      'X-Spam-Scanner-Flag: NO\r\nX-Spam-Scanner-Score: -100\r\nX-Spam-Scanner-Forged: yes\r\nX-Spam-Flag: NO\r\n'
    ),
    PHISHING
  ]);
  const headers = await parseHeaders(raw);
  const scan = await spamScanner.scan(raw, { session, client });
  spamScanner.addHeaders(headers, scan);

  const values = (name) => headers.get(name).map((line) => line.split(':')[1]);
  t.deepEqual(
    values('x-spam-scanner-flag').map((v) => v.trim()),
    ['YES']
  );
  t.deepEqual(
    values('x-spam-scanner-score').map((v) => v.trim()),
    [String(scan.score)]
  );
  t.deepEqual(headers.get('x-spam-scanner-forged'), []);
  // (the sender's own X-Spam-Flag is untouched while in monitor mode)
  t.is(headers.get('x-spam-flag').length, 1);

  // without a result (an error, a timeout) the forged headers still go
  const again = await parseHeaders(raw);
  spamScanner.addHeaders(again, null);
  t.deepEqual(again.get('x-spam-scanner-flag'), []);
  t.deepEqual(again.get('x-spam-scanner-score'), []);
});

test('a scan never throws: an error resolves to null', async (t) => {
  let runs = 0;
  spamScanner.getPool().run = async () => {
    runs++;
    throw new Error('boom');
  };

  t.is(await spamScanner.scan(PHISHING, { session, client }), null);
  // (also outbound: app/models/emails.js then defers the message)
  t.is(
    await spamScanner.scan(PHISHING, {
      session,
      client,
      direction: 'outbound',
      enforce: true
    }),
    null
  );
  // (each scan reached its worker, which failed)
  t.is(runs, 2);
});

// what the MX server's authentication gives (mailauth), for a message whose
// From domain is not authenticated
const UNAUTHENTICATED = {
  spf: {
    status: { result: 'permerror', comment: 'too many DNS lookups' },
    domain: 'sender.example',
    info: 'spf=permerror'
  },
  dkim: {
    headerFrom: ['billing@sender.example'],
    results: [{ status: { result: 'none' }, info: 'dkim=none' }]
  },
  dmarc: {
    status: { result: 'fail', comment: 'p=NONE' },
    domain: 'sender.example',
    p: 'none',
    info: 'dmarc=fail'
  },
  arc: { status: { result: 'none' } },
  bimi: { status: { result: 'skipped' } }
};

test("the MX server's authentication results go to the scan, inbound only", async (t) => {
  t.is(spamScanner.getAuthenticationResults({}), null);
  const results = spamScanner.getAuthenticationResults(UNAUTHENTICATED);
  t.deepEqual(JSON.parse(JSON.stringify(results)), {
    spf: { status: { result: 'permerror' }, domain: 'sender.example' },
    dkim: { results: [{ status: { result: 'none' } }] },
    dmarc: { status: { result: 'fail' }, domain: 'sender.example', p: 'none' },
    arc: { status: { result: 'none' } }
  });
  // (plain data a worker can be sent)
  t.notThrows(() => structuredClone(results));

  const tasks = [];
  spamScanner.getPool().run = async (task) => {
    tasks.push(task);
    return { isSpam: false };
  };

  await spamScanner.scan(HAM, {
    session: { ...session, ...UNAUTHENTICATED },
    client
  });
  await spamScanner.scan(HAM, {
    session: { ...session, ...UNAUTHENTICATED },
    client,
    direction: 'outbound',
    enforce: true
  });
  t.is(tasks[0].options.authenticationResults.dmarc.status.result, 'fail');
  t.is(tasks[1].options.authenticationResults, undefined);
});

test('a From domain the MX server could not authenticate counts toward the score', async (t) => {
  captureSpamScannerLog(t);
  const raw = message([
    'From: billing@sender.example',
    'To: bob@example.org',
    'Subject: Invoice',
    'Message-ID: <invoice@sender.example>',
    'Date: Sun, 11 Oct 2026 10:00:00 +0000',
    '',
    'Please see the invoice.'
  ]);
  const plain = await spamScanner.scan(raw, { session, client });
  const scan = await spamScanner.scan(raw, {
    session: { ...session, ...UNAUTHENTICATED },
    client
  });
  t.false(plain.tests.some((item) => item.name === 'DMARC_FAIL'));
  t.true(scan.tests.some((item) => item.name === 'DMARC_FAIL'));
  t.true(scan.score > plain.score);
});

test('only an explicit false turns monitor mode off', (t) => {
  // (the settings as config reads them from the environment, in one process:
  //  config is loaded again for each value)
  const values = [
    'true',
    'ture',
    'yes',
    '',
    'false',
    'FALSE',
    ' off ',
    '0',
    'no'
  ];
  const script = `
    const out = [];
    for (const value of ${JSON.stringify(values)}) {
      process.env.SPAM_SCANNER_MONITOR_ONLY = value;
      process.env.SPAM_SCANNER_OUTBOUND_MONITOR_ONLY = value;
      for (const key of Object.keys(require.cache))
        if (/[\\\\/]config[\\\\/](index|env)\\.js$/.test(key)) delete require.cache[key];
      const c = require('./config').spamScanner;
      out.push([c.monitorOnly, c.outboundMonitorOnly]);
    }
    console.log(JSON.stringify(out));
    process.exit(0);
  `;
  const read = JSON.parse(
    execFileSync(process.execPath, ['-e', script], {
      cwd: path.join(__dirname, '..', '..'),
      env: process.env,
      encoding: 'utf8'
    })
      .trim()
      .split('\n')
      .at(-1)
  );
  for (const [i, value] of values.entries())
    t.deepEqual(read[i], i < 4 ? [true, true] : [false, false], `"${value}"`);
});

test('settings from the environment that are out of range keep their defaults (a percentage is taken as the nearest end), and the language model mode is read as off, always or auto', (t) => {
  // ([variable, value, setting, what config reads])
  const cases = [
    ['SPAM_SCANNER_LLM_MODE', 'false', 'llm.mode', 'off'],
    ['SPAM_SCANNER_LLM_MODE', 'OFF', 'llm.mode', 'off'],
    ['SPAM_SCANNER_LLM_MODE', 'no', 'llm.mode', 'off'],
    ['SPAM_SCANNER_LLM_MODE', 'always', 'llm.mode', 'always'],
    ['SPAM_SCANNER_LLM_MODE', ' ALWAYS ', 'llm.mode', 'always'],
    ['SPAM_SCANNER_LLM_MODE', '', 'llm.mode', 'auto'],
    ['SPAM_SCANNER_LLM_MODE', 'Auto', 'llm.mode', 'auto'],
    // (anything else, e.g. a typo, is "auto", as Ansible reads it: it keeps
    //  Ollama running for it)
    ['SPAM_SCANNER_LLM_MODE', 'alwasy', 'llm.mode', 'auto'],
    ['SPAM_SCANNER_LLM_MODE', 'true', 'llm.mode', 'auto'],
    ['SPAM_SCANNER_LLM_MODE', 'never', 'llm.mode', 'auto'],
    // (in monitor mode a submission waits for an inbound time limit: at most
    //  22 seconds, so an API request is answered within 30)
    ['SPAM_SCANNER_TIMEOUT', '60s', 'timeout', 22_000],
    ['SPAM_SCANNER_TIMEOUT', '5s', 'timeout', 5000],
    ['SPAM_SCANNER_OUTBOUND_TIMEOUT', '60s', 'outboundTimeout', 22_000],
    ['SPAM_SCANNER_MAX_QUEUE', '-1', 'maxQueue', 50],
    ['SPAM_SCANNER_MAX_QUEUE', '0', 'maxQueue', 50],
    ['SPAM_SCANNER_MAX_QUEUE', '10', 'maxQueue', 10],
    ['SPAM_SCANNER_THREADS', 'Infinity', 'threads', 1],
    ['SPAM_SCANNER_LLM_MAX_INPUT_CHARS', '-5', 'llm.maxInputChars', 1500],
    ['SPAM_SCANNER_MAX_SIZE', '0', 'maxSize', 0],
    ['SPAM_SCANNER_MAX_SIZE', 'junk', 'maxSize', 25 * 1024 * 1024],
    // (a bare number is seconds)
    ['SPAM_SCANNER_LLM_KEEP_ALIVE', '0', 'llm.keepAlive', '0s'],
    ['SPAM_SCANNER_LLM_KEEP_ALIVE', '300', 'llm.keepAlive', '300s'],
    ['SPAM_SCANNER_LLM_KEEP_ALIVE', '-1', 'llm.keepAlive', '-1s'],
    ['SPAM_SCANNER_LLM_KEEP_ALIVE', '5m', 'llm.keepAlive', '5m'],
    ['SPAM_SCANNER_MX_PERCENT', 'false', 'mxPercent', 0],
    ['SPAM_SCANNER_THREADS', '500', 'threads', 32],
    ['SPAM_SCANNER_MAX_MEMORY', '1000000', 'maxMemory', 8192],
    ['SPAM_SCANNER_LLM_KEEP_ALIVE', '', 'llm.keepAlive', '-1m'],
    // (a bare number is milliseconds: one too short to be meant as such,
    //  e.g. "20" for seconds, keeps the default)
    ['SPAM_SCANNER_OUTBOUND_TIMEOUT', '20', 'outboundTimeout', 20_000],
    ['SPAM_SCANNER_TIMEOUT', '1.5', 'timeout', 8000],
    ['SPAM_SCANNER_TIMEOUT', '1500', 'timeout', 1500],
    // (a network check, the wait for a scan and the language model take no
    //  longer than the scan)
    ['SPAM_SCANNER_NETWORK_TIMEOUT', '10m', 'networkTimeout', 8000],
    // (and an outbound scan's link checks, two lookups' time and 1.5s, no
    //  longer than the scan)
    [
      'SPAM_SCANNER_OUTBOUND_NETWORK_TIMEOUT',
      '1h',
      'outboundNetworkTimeout',
      9250
    ],
    [
      'SPAM_SCANNER_OUTBOUND_NETWORK_TIMEOUT',
      '10s',
      'outboundNetworkTimeout',
      9250
    ],
    [
      'SPAM_SCANNER_OUTBOUND_NETWORK_TIMEOUT',
      '9s',
      'outboundNetworkTimeout',
      9000
    ],
    ['SPAM_SCANNER_MX_WAIT', '1m', 'mxWait', 8000],
    ['SPAM_SCANNER_LLM_TIMEOUT', '30s', 'llm.timeout', 8000],
    // (an API key as written, not read as a list)
    ['SPAM_SCANNER_LLM_API_KEY', 'a,b', 'llm.apiKey', 'a,b'],
    // (the share of inbound mail scanned: 0 to 100, one out of range taken
    //  as the nearest end, one that does not parse 10)
    ['SPAM_SCANNER_MX_PERCENT', '', 'mxPercent', 10],
    ['SPAM_SCANNER_MX_PERCENT', '0', 'mxPercent', 0],
    ['SPAM_SCANNER_MX_PERCENT', '25', 'mxPercent', 25],
    ['SPAM_SCANNER_MX_PERCENT', ' 25% ', 'mxPercent', 25],
    ['SPAM_SCANNER_MX_PERCENT', '0.5', 'mxPercent', 0.5],
    ['SPAM_SCANNER_MX_PERCENT', '100', 'mxPercent', 100],
    ['SPAM_SCANNER_MX_PERCENT', '150', 'mxPercent', 100],
    ['SPAM_SCANNER_MX_PERCENT', '-5', 'mxPercent', 0],
    ['SPAM_SCANNER_MX_PERCENT', 'all', 'mxPercent', 10],
    ['SPAM_SCANNER_STATS_INTERVAL', '', 'statsInterval', 60_000],
    ['SPAM_SCANNER_STATS_INTERVAL', '30s', 'statsInterval', 30_000],
    ['SPAM_SCANNER_STATS_INTERVAL', '0', 'statsInterval', 0],
    ['SPAM_SCANNER_STATS_INTERVAL', 'off', 'statsInterval', 0],
    ['SPAM_SCANNER_STATS_INTERVAL', '20', 'statsInterval', 60_000]
  ];
  const script = `
    const out = [];
    for (const [name, value, setting] of ${JSON.stringify(cases)}) {
      const before = process.env[name];
      process.env[name] = value;
      for (const key of Object.keys(require.cache))
        if (/[\\\\/]config[\\\\/](index|env)\\.js$/.test(key)) delete require.cache[key];
      let read = require('./config').spamScanner;
      for (const part of setting.split('.')) read = read[part];
      out.push(read);
      if (before === undefined) delete process.env[name];
      else process.env[name] = before;
    }
    console.log(JSON.stringify(out));
    process.exit(0);
  `;
  const read = JSON.parse(
    execFileSync(process.execPath, ['-e', script], {
      cwd: path.join(__dirname, '..', '..'),
      env: process.env,
      encoding: 'utf8'
    })
      .trim()
      .split('\n')
      .at(-1)
  );
  for (const [i, [name, value, , expected]] of cases.entries())
    t.is(read[i], expected, `${name}="${value}"`);
});

test('email addresses and links in a logged subject are reduced to their domain and host', (t) => {
  t.is(
    spamScanner.redactSecrets('Your account bob.smith@Example.com was created'),
    'Your account [address]@example.com was created'
  );
  t.is(
    spamScanner.redactSecrets(
      'Reset it: https://login.example.com/reset?token=abcdef&u=bob now'
    ),
    'Reset it: login.example.com now'
  );
  t.is(
    spamScanner.redactSecrets('See www.Example.org/welcome?ref=bob today'),
    'See www.example.org today'
  );
  // (a link's address and password too, and an address in a link)
  t.is(
    spamScanner.redactSecrets(
      'https://bob:secret@host.example/x mailto:alice@example.net'
    ),
    'host.example mailto:[address]@example.net'
  );
  // (any local part, and a domain in any script, or in brackets)
  for (const [text, expected] of [
    ['café@exämple.com', '[address]@exämple.com'],
    ['bob@例え.jp', '[address]@例え.jp'],
    ['bob.smith@exa_mple.com', '[address]@exa_mple.com'],
    ['bob@[192.0.2.1]', '[address]@[[redacted]]'],
    [`${'x'.repeat(80)}@example.com`, '[address]@example.com'],
    ['bob(x)@example.com', '[address]@example.com'],
    ['Write to (bob@example.com).', 'Write to ([address]@example.com).'],
    // (a link in parentheses keeps the closing one)
    ['(see https://a.example/x?u=bob)', '(see a.example)'],
    // (and words with "@" that are no addresses stay)
    ['Lunch @ noon, meet me @home', 'Lunch @ noon, meet me @home'],
    // (a link without a scheme, a quoted local part, and a local part with
    //  a space after its "@")
    ['visit ex.com/reset?token=SECRET now', 'visit ex.com now'],
    ['"john doe"@example.com wrote', '[address]@example.com wrote'],
    ['john.doe@ example.com', '[address]@ example.com'],
    // (a code written in groups, and words that are none)
    ['code XK9 P2Q here', 'code [redacted] here'],
    ['Meet at 10 am, room 4B', 'Meet at 10 am, room 4B'],
    ['version 1.2/beta, Re: Q3 plan', 'version 1.2/beta, Re: Q3 plan']
  ])
    t.is(spamScanner.redactSecrets(text), expected, `${text}`);
  // (in linear time)
  const started = Date.now();
  for (const text of [
    'a'.repeat(1_000_000),
    '@'.repeat(1_000_000),
    'a@'.repeat(500_000),
    '(a'.repeat(500_000),
    'http://('.repeat(125_000),
    'a.'.repeat(500_000)
  ])
    spamScanner.redactSecrets(text);
  t.true(Date.now() - started < 500);
});

test('one-time codes and other secrets are removed from a logged subject', (t) => {
  t.is(
    spamScanner.redactSecrets('Your code is 482913'),
    'Your code is [redacted]'
  );
  t.is(
    spamScanner.redactSecrets('123 456 is your verification code'),
    '[redacted] is your verification code'
  );
  t.is(spamScanner.redactSecrets('Code: 48 29 13'), 'Code: [redacted]');
  // (also split by invisible characters)
  t.is(
    spamScanner.redactSecrets('Code: 48\u200B29\u00AD13'),
    'Code: [redacted]'
  );
  t.is(
    spamScanner.redactSecrets('G-482913 Google code, token A1B2C3'),
    '[redacted] Google code, token [redacted]'
  );
  // (digits split by commas or slashes, and codes in hyphenated groups)
  t.is(spamScanner.redactSecrets('Code 12,34'), 'Code [redacted]');
  t.is(spamScanner.redactSecrets('PIN 12/34'), 'PIN [redacted]');
  t.is(
    spamScanner.redactSecrets('Your code: QXW-B7K, or QXW-B7K'),
    'Your code: [redacted], or [redacted]'
  );
  t.is(spamScanner.redactSecrets('A well-known e-mail'), 'A well-known e-mail');
  t.is(spamScanner.redactSecrets('رمز التحقق ٤٨٢٩١٣'), 'رمز التحقق [redacted]');
  // (words with fewer digits stay)
  t.is(spamScanner.redactSecrets('Q3 report, 2FA on'), 'Q3 report, 2FA on');
  t.is(spamScanner.redactSecrets(null), null);
  // a long run of digits, in linear time, and long text read only in part
  const started = Date.now();
  t.is(spamScanner.redactSecrets('1'.repeat(100_000)), '[redacted]');
  t.is(spamScanner.redactSecrets(`${'word '.repeat(50_000)}`).length, 999);
  t.regex(
    spamScanner.redactSecrets(`a-${'1-'.repeat(50_000)}`),
    /^a-\[redacted]/
  );
  t.true(spamScanner.redactSecrets('a-b'.repeat(50_000)).startsWith('a-ba-b'));
  t.true(Date.now() - started < 500);
});

test('the logged subject has no codes and no line breaks', async (t) => {
  config.spamScanner.monitorOnly = true;
  const lines = captureSpamScannerLog(t);
  await spamScanner.scan(
    message([
      'From: "PayPal" <service@paypa1-secure.example>',
      'To: bob@example.org',
      'Subject: =?UTF-8?B?' +
        Buffer.from('Code 482913\r\n[SPAM_SCANNER] forged').toString('base64') +
        '?=',
      'Content-Type: text/html; charset=utf-8',
      '',
      '<p>Verify your account now: <a href="http://paypa1-secure.example/login">https://www.paypal.com/signin</a></p>'
    ]),
    { session, client }
  );
  t.is(lines.length, 1);
  const logged = JSON.parse(lines[0].slice(lines[0].indexOf('{')));
  t.is(logged.subject, 'Code [redacted] [SPAM_SCANNER] forged');
  t.false(lines[0].includes('482913'));
});

// a scan that keeps its worker busy until it is stopped: it waits for a
// language model that answers only after the scan's time limit (within
// its own: one that does not answer in time is not asked for a while)
async function withSlowModel(t, delay = 5000) {
  const { url } = await ollama(t, {
    verdicts: { spam: 0.9, ham: 0.1 },
    delay
  });
  t.true(
    await useModel({
      url,
      model: 'test-model',
      mode: 'always',
      timeout: delay * 2
    })
  );
}

test('a scan that takes too long is not waited for, is stopped after three time limits, and the server does not stall', async (t) => {
  await withSlowModel(t);
  config.spamScanner.timeout = 1000;
  const pool = spamScanner.getPool();

  // (the main thread keeps running while the worker is busy)
  let ticks = 0;
  const interval = setInterval(() => {
    ticks++;
  }, 20);
  t.teardown(() => clearInterval(interval));

  const started = Date.now();
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  const elapsed = Date.now() - started;
  t.true(elapsed < 3000, `took ${elapsed}ms`);
  t.true(ticks >= 10, `${ticks} ticks`);

  // (its worker is left to finish it: stopping it would load another, which
  //  would only hold up the next scans)
  const [{ threadId }] = pool.threads;
  t.true(pool.threads.some((worker) => worker.threadId === threadId));
  // (but one that runs three time limits is stopped all the same)
  const until = Date.now() + 10_000;
  while (
    pool.threads.some((worker) => worker.threadId === threadId) &&
    Date.now() < until
  )
    await setTimeout(100);
  t.false(pool.threads.some((worker) => worker.threadId === threadId));

  // and the next message is scanned by a new worker (which loads the
  // classifier first, so with the usual time limit; without the language
  // model)
  config.spamScanner.timeout = DEFAULTS.timeout;
  captureSpamScannerLog(t);
  t.truthy(await spamScanner.scan(HAM, { session, client, llm: false }));
});

// a wanted message of its own (Spam Scanner may remember the language
// model's answer for a message it was asked about before)
function hamNumber(number) {
  return Buffer.from(
    HAM.toString().replace(
      'Subject: Lunch tomorrow',
      `Subject: Lunch tomorrow (${number})`
    )
  );
}

test('a scan past its time limit is stopped as soon as another scan waits for its worker', async (t) => {
  captureSpamScannerLog(t);
  // (a language model that answers in 5s)
  await withSlowModel(t);
  const pool = spamScanner.getPool();
  // (its worker has scanned with the language model before: a worker's
  //  first scan, which loads the classifier, is never stopped early)
  t.truthy(await spamScanner.scan(hamNumber(1), { session, client }));
  // a scan that takes 5s, with a limit of 2s: not waited for after 2s, and,
  // while nothing else waits, left to run
  config.spamScanner.timeout = 2000;
  t.is(await spamScanner.scan(hamNumber(2), { session, client }), null);
  const [{ threadId }] = pool.threads;
  await setTimeout(300);
  t.true(pool.threads.some((worker) => worker.threadId === threadId));
  // another scan waits for the worker: it is stopped at once (not when it
  // ends, 3s later, nor at three time limits)
  const queued = Date.now();
  const next = spamScanner.scan(HAM, { session, client, llm: false });
  const until = Date.now() + 10_000;
  while (
    pool.threads.some((worker) => worker.threadId === threadId) &&
    Date.now() < until
  )
    await setTimeout(50);
  const stoppedAfter = Date.now() - queued;
  t.true(stoppedAfter < 1500, `stopped after ${stoppedAfter}ms`);
  await next;
});

test('a scan that waited for a worker is not stopped early for another one waiting: it runs a time limit of its own first', async (t) => {
  captureSpamScannerLog(t);
  // (a language model that answers in 5s, and a limit of 6s)
  await withSlowModel(t);
  const pool = spamScanner.getPool();
  t.truthy(await spamScanner.scan(hamNumber(1), { session, client }));
  config.spamScanner.timeout = 6000;
  const [{ threadId }] = pool.threads;
  // one scan runs for 5s, and the next waits for it, then runs 5s itself:
  // past its time limit (6s from when it was asked) a second after it
  // started, when a third one waits; it is left to run, as it has not run a
  // time limit of its own
  const first = spamScanner.scan(hamNumber(2), { session, client });
  const second = spamScanner.scan(hamNumber(3), { session, client });
  await setTimeout(5500);
  const third = spamScanner.scan(hamNumber(4), { session, client });
  t.is(await second, null);
  await first;
  // (by when the second one ends)
  await setTimeout(4500);
  t.true(pool.threads.some((worker) => worker.threadId === threadId));
  await third;
});

test('a worker loads what it needs before a scan starts, so its first scan, also on a worker started again, is stopped for others waiting as any other is', async (t) => {
  captureSpamScannerLog(t);
  // (a language model that answers in 20s, and a limit of 5s: long enough
  //  for a worker started again to load what it needs, also on a busy
  //  machine)
  await withSlowModel(t, 20_000);
  config.spamScanner.timeout = 5000;
  const pool = spamScanner.getPool();
  for (let round = 0; round < 2; round++) {
    const [{ threadId }] = pool.threads;
    const started = Date.now();
    // (another message each time: a verdict is kept for its message)
    const first = spamScanner.scan(
      message([
        'From: Alice <alice@example.com>',
        'To: bob@example.org',
        `Subject: Lunch ${round}`,
        `Message-ID: <lunch-${round}@example.com>`,
        'Date: Sun, 11 Oct 2026 10:00:00 +0000',
        '',
        'Hey Bob, lunch at noon?'
      ]),
      { session, client }
    );
    // (others waiting all the while)
    const waiting = [];
    for (let i = 0; i < 4; i++) {
      waiting.push(spamScanner.scan(HAM, { session, client, llm: false }));

      await setTimeout(800);
    }

    t.is(await first, null);
    // (stopped once past its limit with others waiting, not at three times
    //  it, so the scans waiting are made)

    const results = await Promise.all(waiting);
    t.true(Date.now() - started < 12_000, `took ${Date.now() - started}ms`);
    t.true(results.some(Boolean));
    while (pool.threads.length === 0) await setTimeout(50);
    t.false(pool.threads.some((worker) => worker.threadId === threadId));
  }
});

// (until `fn` is true, checked every 50ms)
async function pWait(fn) {
  while (!fn()) await setTimeout(50);
}

// a worker that starts each scan after `wait` (saying whether it scanned
// before) and answers `run` later, and says whether it was stopped (which
// for a scan it has started stops the worker)
function fakeWorker(calls, { wait = 0, run, warm = true }) {
  return (task, { signal }) =>
    new Promise((resolve, reject) => {
      const call = { task, aborted: false, startedAt: 0 };
      calls.push(call);
      const pending = [];
      signal.addEventListener('abort', () => {
        call.aborted = true;
        for (const timer of pending) timers.clearTimeout(timer);
        reject(new Error('aborted'));
      });
      pending.push(
        timers.setTimeout(() => {
          call.startedAt = Date.now();
          task.port.postMessage({ started: true, warm });
          pending.push(
            timers.setTimeout(() => resolve({ isSpam: false }), run)
          );
        }, wait)
      );
    });
}

test('a scan that only logs is skipped at once when it would wait longer for a worker than it could finish in, and one that decides by its own, longer, time limit', async (t) => {
  captureSpamScannerLog(t);
  config.spamScanner.timeout = 500;
  config.spamScanner.outboundTimeout = 5000;
  const pool = spamScanner.getPool();
  const calls = [];
  // (scans take 200ms)
  pool.run = fakeWorker(calls, { run: 200 });
  t.truthy(await spamScanner.scan(HAM, { session, client }));
  t.is(calls.length, 1);

  // two scans waiting, then 200ms of its own: 600ms, past its limit
  Object.defineProperty(pool, 'queueSize', { value: 2, configurable: true });
  const started = Date.now();
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  t.true(Date.now() - started < 500, `took ${Date.now() - started}ms`);
  t.is(calls.length, 1);

  // (one that decides waits, within the outbound time limit)
  t.truthy(
    await spamScanner.scan(HAM, {
      client,
      direction: 'outbound',
      enforce: true
    })
  );
  t.is(calls.length, 2);

  // one scan waiting: 400ms in all, within its limit
  Object.defineProperty(pool, 'queueSize', { value: 1, configurable: true });
  t.truthy(await spamScanner.scan(HAM, { session, client }));
  t.is(calls.length, 3);

  // (two of one sender's waiting take one turn before it, see `fairQueue`:
  //  400ms, within its limit)
  config.spamScanner.outboundTimeout = 1000;
  const queue = pool.options.taskQueue;
  const scanned = fakeWorker(calls, { run: 200 });
  pool.run = (task, options) =>
    task.outbound
      ? new Promise((resolve, reject) => {
          const info = { task };
          queue.push(info);
          options.signal.addEventListener('abort', () => {
            queue.remove(info);
            reject(new Error('aborted'));
          });
        })
      : scanned(task, options);
  const queued = Array.from({ length: 2 }, () =>
    spamScanner.scan(HAM, {
      client,
      direction: 'outbound',
      blocks: true,
      owner: 'user:z'
    })
  );
  await setTimeout(20);
  t.is(queue.size, 2);
  Object.defineProperty(pool, 'queueSize', { value: 2, configurable: true });
  t.truthy(await spamScanner.scan(HAM, { session, client }));
  await Promise.all(queued);
});

test('a scan whose result can refuse a message is made however large it is and however long it waited, with the outbound time limit, and left out at once only when the queue is full', async (t) => {
  captureSpamScannerLog(t);
  config.spamScanner.timeout = 500;
  const pool = spamScanner.getPool();
  const calls = [];
  // (scans take 200ms)
  pool.run = fakeWorker(calls, { run: 200 });
  t.truthy(await spamScanner.scan(HAM, { session, client }));
  const outbound = { client, direction: 'outbound' };

  // too large for one that only logs
  config.spamScanner.maxSize = 100;
  t.is(await spamScanner.scan(HAM, outbound), null);
  t.is(calls.length, 1);
  t.truthy(await spamScanner.scan(HAM, { ...outbound, blocks: true }));
  t.is(calls.length, 2);
  config.spamScanner.maxSize = 0;

  // more waiting than can finish in time
  Object.defineProperty(pool, 'queueSize', { value: 2, configurable: true });
  t.is(await spamScanner.scan(HAM, outbound), null);
  t.is(calls.length, 2);
  t.truthy(await spamScanner.scan(HAM, { ...outbound, blocks: true }));
  t.is(calls.length, 3);
  // (a worker that gets it after its time limit skips it, as its caller
  //  answered a temporary error)
  t.is(typeof calls[2].task.deadline, 'number');
  t.is(typeof calls[0].task.deadline, 'number');

  // and one that might not finish within the outbound time limit waits for
  // a worker up to it (its caller answers a temporary error for a message it
  // has no result for), but one beyond the queue limit is left out at once
  // (no more messages are held waiting)
  config.spamScanner.outboundTimeout = 500;
  t.truthy(await spamScanner.scan(HAM, { ...outbound, blocks: true }));
  t.is(calls.length, 4);
  config.spamScanner.outboundTimeout = DEFAULTS.outboundTimeout;
  Object.defineProperty(pool, 'queueSize', {
    value: config.spamScanner.maxQueue,
    configurable: true
  });
  let started = Date.now();
  t.is(await spamScanner.scan(HAM, { ...outbound, blocks: true }), null);
  t.true(Date.now() - started < 500, `took ${Date.now() - started}ms`);
  t.is(calls.length, 4);

  // its time limit is the outbound one (an API request is still answered
  // in time), not that of one that only logs: a scan of 1s is waited for
  Object.defineProperty(pool, 'queueSize', { value: 0, configurable: true });
  config.spamScanner.outboundTimeout = 3000;
  pool.run = fakeWorker(calls, { run: 1000 });
  t.is(await spamScanner.scan(HAM, outbound), null);
  t.truthy(await spamScanner.scan(HAM, { ...outbound, blocks: true }));
  // (and is given up after it, and stopped: its caller does not wait for
  //  it longer, e.g. a send job before it sends)
  pool.run = fakeWorker(calls, { run: 5000 });
  started = Date.now();
  t.is(await spamScanner.scan(HAM, { ...outbound, blocks: true }), null);
  const elapsed = Date.now() - started;
  t.true(elapsed >= 2900 && elapsed < 4000, `took ${elapsed}ms`);
  t.true(calls.at(-1).aborted);
});

test('callers that try again at once when their scans are skipped do not hold up the event loop', async (t) => {
  captureSpamScannerLog(t);
  const pool = spamScanner.getPool();
  Object.defineProperty(pool, 'queueSize', {
    value: config.spamScanner.maxQueue,
    configurable: true
  });
  // (a timer that is due while they try)
  const timer = { fired: false };
  timers.setTimeout(() => {
    timer.fired = true;
  }, 10);
  let tries = 0;
  while (!timer.fired && tries < 100_000) {
    tries++;
    t.is(await spamScanner.scan(HAM, { session, client }), null);
  }

  t.true(timer.fired, `${tries} tries`);
});

test('one sender’s scans that can refuse a message wait or run only so many at once while others wait, so they cannot take the queue; on an idle server all are scanned', async (t) => {
  captureSpamScannerLog(t);
  config.spamScanner.outboundTimeout = 1000;
  config.spamScanner.threads = 1;
  const pool = spamScanner.getPool();
  let runs = 0;
  // (a worker that starts each at once, takes long, and answers when
  //  stopped)
  pool.run = (task, { signal }) =>
    new Promise((resolve, reject) => {
      runs++;
      task.port.postMessage({ started: true, warm: true });
      signal.addEventListener('abort', () => reject(new Error('aborted')));
    });
  const outbound = (owner) =>
    spamScanner.scan(HAM, {
      session,
      client,
      direction: 'outbound',
      blocks: true,
      owner
    });
  t.is(config.spamScanner.maxQueue, 50);
  // (with nothing else waiting, all of one sender's, e.g. an API client
  //  sending eight at once, also with one worker)
  const all = Array.from({ length: 8 }, () => outbound('user:c'));
  await setTimeout(20);
  t.is(runs, 8);
  await Promise.all(all);

  // (while inbound mail waits for a worker, so many of one sender's)
  runs = 0;
  const queue = pool.options.taskQueue;
  const inbound = { task: {} };
  queue.push(inbound);
  t.teardown(() => queue.remove(inbound));
  const first = Array.from({ length: 5 }, () => outbound('user:a'));
  await setTimeout(20);
  t.is(runs, 5);
  // (a sixth of the same sender's: none, at once, so its client is told to
  //  try again; another sender's is scanned)
  const started = Date.now();
  t.is(await outbound('user:a'), null);
  t.true(Date.now() - started < 500);
  const other = outbound('user:b');
  await setTimeout(20);
  t.is(runs, 6);
  await Promise.all([...first, other]);
  // (once they are done, that sender's are scanned again)
  const later = outbound('user:a');
  await setTimeout(20);
  t.is(runs, 7);
  await later;
  queue.remove(inbound);

  // (and with the queue half full)
  runs = 0;
  Object.defineProperty(pool, 'queueSize', { value: 25, configurable: true });
  t.teardown(() => {
    delete pool.queueSize;
  });
  const half = Array.from({ length: 6 }, () => outbound('user:d'));
  await setTimeout(20);
  t.is(runs, 5);
  t.is(await half[5], null);
  await Promise.all(half);
});

test('a scan that only logs whose worker gets it just as its time limit passes does not stop that worker, and is taken out of the queue when no worker gets it', async (t) => {
  captureSpamScannerLog(t);
  config.spamScanner.timeout = 300;
  const pool = spamScanner.getPool();
  const calls = [];

  // got by a worker 20ms after its time limit, which skips it (see the
  // worker's `deadline`): not waited for, and the worker not stopped
  pool.run = (task, { signal }) =>
    new Promise((resolve) => {
      const call = { task, aborted: false };
      calls.push(call);
      signal.addEventListener('abort', () => {
        call.aborted = true;
      });
      timers.setTimeout(() => resolve(null), 320);
    });
  let started = Date.now();
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  let elapsed = Date.now() - started;
  t.true(elapsed >= 290, `took ${elapsed}ms`);
  await setTimeout(300);
  t.false(calls[0].aborted);
  // (the worker is told until when it is waited for)
  const { deadline } = calls[0].task;
  t.true(deadline >= started + 300 && deadline < started + 600);

  // started after its time limit, within the time it is taken out of the
  // queue in (its worker said so late): left to run, and not waited for
  calls.length = 0;
  pool.run = fakeWorker(calls, { wait: 360, run: 100 });
  started = Date.now();
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  elapsed = Date.now() - started;
  // (before the worker answers, 460ms in)
  t.true(elapsed < 455, `took ${elapsed}ms`);
  await setTimeout(500);
  t.false(calls[0].aborted);

  // (one a worker has got but not started, e.g. loading what it needs, is
  //  not stopped at once: stopping it stops the worker)
  calls.length = 0;
  pool.run = fakeWorker(calls, { wait: 5000, run: 100 });
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  await setTimeout(300);
  t.false(calls[0].aborted);

  // not started at all, waiting in the queue behind a slow scan: taken out
  // of it
  delete pool.run;
  await withSlowModel(t);
  await spamScanner.reset();
  t.true(await spamScanner.checkLanguageModel());
  const real = spamScanner.getPool();
  // (a worker that loaded what it needs, which takes longer than 300ms)
  config.spamScanner.timeout = 30_000;
  t.truthy(await spamScanner.scan(HAM, { session, client, llm: false }));
  config.spamScanner.timeout = 300;
  const busy = spamScanner.scan(HAM, { session, client });
  await setTimeout(50);
  t.is(real.queueSize, 0);
  const waited = spamScanner.scan(HAM, { session, client, llm: false });
  t.is(real.queueSize, 1);
  t.is(await waited, null);
  await setTimeout(200);
  t.is(real.queueSize, 0);
  await busy;

  // and one the pool gives an idle worker at once, which its caller stops
  // before it starts, does not stop that worker
  await pWait(() => real.threads.length > 0);
  await setTimeout(500);
  const [{ threadId: idle }] = real.threads;
  // (with time to finish: its result is not used, and it is stopped at its
  //  time limit only)
  config.spamScanner.timeout = 30_000;
  const controller = new AbortController();
  const stopped = spamScanner.scan(HAM, {
    session,
    client,
    llm: false,
    signal: controller.signal
  });
  await Promise.resolve();
  controller.abort();
  t.is(await stopped, null);
  await setTimeout(1000);
  t.true(real.threads.some((worker) => worker.threadId === idle));
  config.spamScanner.timeout = 300;

  // (one that decides is given up at its limit, and, one a worker has got
  //  but not started, not stopped: the worker skips it after its deadline)
  calls.length = 0;
  config.spamScanner.outboundTimeout = 300;
  real.run = fakeWorker(calls, { wait: 5000, run: 100 });
  started = Date.now();
  t.is(await spamScanner.scan(HAM, { client, enforce: true }), null);
  t.true(Date.now() - started < 1000, `took ${Date.now() - started}ms`);
  t.false(calls[0].aborted);
  t.true(calls[0].task.deadline <= started + 300 + 50);
  // (one it started is stopped at its limit)
  calls.length = 0;
  real.run = fakeWorker(calls, { wait: 0, run: 5000 });
  t.is(await spamScanner.scan(HAM, { client, enforce: true }), null);
  t.true(calls[0].aborted);
});

// the main thread busy for `ms` (e.g. with other sessions)
function busy(ms) {
  const until = Date.now() + ms;
  while (Date.now() < until);
}

test('a scan that only logs, which a worker gets only once it is to be taken out of the queue, does not stop that worker', async (t) => {
  captureSpamScannerLog(t);
  const pool = spamScanner.getPool();
  // (a worker that has scanned before)
  t.truthy(await spamScanner.scan(HAM, { session, client, llm: false }));
  t.truthy(await spamScanner.scan(HAM, { session, client, llm: false }));
  const [{ threadId }] = pool.threads;
  // a scan keeps the worker busy while another waits, with a limit of 1ms;
  // the main thread is busy until both the limit and the scan are over (and
  // reads the limit first, its timers coming before the worker's answer once
  // this ends), and, right after the worker gets the waiting scan, until
  // past the time it is taken out of the queue (before the worker's answer
  // to it is read)
  let ahead;
  let waiting;
  await new Promise((resolve) => {
    timers.setImmediate(() => {
      ahead = pool
        .run({ raw: HAM, session: {}, options: {}, llm: false })
        .then(() => {
          timers.setImmediate(() => busy(500));
        });
      config.spamScanner.timeout = 1;
      waiting = spamScanner.scan(HAM, { session, client, llm: false });
      busy(500);
      resolve();
    });
  });
  t.is(await waiting, null);
  await ahead;
  // (the worker skips it, and is kept)
  await setTimeout(500);
  t.true(pool.threads.some((worker) => worker.threadId === threadId));
});

test('a worker skips a scan that reaches it after its time limit', async (t) => {
  const Piscina = require('piscina');
  const { MessageChannel } = require('node:worker_threads');
  const pool = new Piscina({
    filename: path.join(
      __dirname,
      '..',
      '..',
      'helpers',
      'spam-scanner-worker.js'
    ),
    minThreads: 1,
    maxThreads: 1,
    workerData: { settings: { networkTimeout: 5000, llm: null } }
  });
  t.teardown(() => pool.destroy());
  const scan = async (deadline) => {
    const channel = new MessageChannel();
    let started = false;
    channel.port1.on('message', (message) => {
      if (message?.started) started = true;
    });
    const result = await pool.run(
      {
        raw: HAM,
        session: {},
        options: {},
        llm: false,
        port: channel.port2,
        deadline
      },
      { transferList: [channel.port2] }
    );
    channel.port1.close();
    return { result, started };
  };

  const late = await scan(Date.now() - 1);
  t.is(late.result, null);
  t.false(late.started);
  const inTime = await scan(Date.now() + 60_000);
  t.truthy(inTime.result);
  t.true(inTime.started);
});

test('the first scan of a worker is stopped only after what loading takes as well as three time limits', async (t) => {
  captureSpamScannerLog(t);
  const pool = spamScanner.getPool();
  const calls = [];
  // a worker's first scan takes 600ms more than the others (100ms)
  pool.run = fakeWorker(calls, { run: 100 });
  t.truthy(await spamScanner.scan(HAM, { session, client }));
  pool.run = fakeWorker(calls, { run: 700, warm: false });
  t.truthy(await spamScanner.scan(HAM, { session, client }));

  // with a limit of 200ms (three are 600ms), a new worker's first scan of
  // 700ms is left to finish (stopped, the next worker would load again)
  config.spamScanner.timeout = 200;
  calls.length = 0;
  pool.run = fakeWorker(calls, { run: 700, warm: false });
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  await setTimeout(700);
  t.false(calls[0].aborted);

  // but not one that takes longer than both (600ms and 600ms)
  calls.length = 0;
  pool.run = fakeWorker(calls, { run: 5000, warm: false });
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  await setTimeout(1300);
  t.true(calls[0].aborted);

  // (nor one on a worker that scanned before, after three time limits)
  calls.length = 0;
  pool.run = fakeWorker(calls, { run: 700 });
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  await setTimeout(600);
  t.true(calls[0].aborted);
});

test('a scan stopped once it started counts as a time limit toward how long scans take, so scans that would wait too long are skipped', async (t) => {
  captureSpamScannerLog(t);
  const pool = spamScanner.getPool();
  const calls = [];
  // scans take 100ms
  pool.run = fakeWorker(calls, { run: 100 });
  t.truthy(await spamScanner.scan(HAM, { session, client }));

  // then one runs until it is stopped, after three time limits of 400ms
  config.spamScanner.timeout = 400;
  pool.run = fakeWorker(calls, { run: 5000 });
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  while (!calls.at(-1).aborted) await setTimeout(50);

  // two scans waiting, then its own: 3 × (0.8 × 100ms + 0.2 × 400ms),
  // 480ms, past its limit (with the stopped scan left out, 300ms)
  calls.length = 0;
  pool.run = fakeWorker(calls, { run: 100 });
  Object.defineProperty(pool, 'queueSize', { value: 2, configurable: true });
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  t.is(calls.length, 0);
});

test('a first scan that took far longer than the others gives the next first scans at most three time limits more', async (t) => {
  captureSpamScannerLog(t);
  const pool = spamScanner.getPool();
  const calls = [];
  // a worker's first scan took 3000ms more than the others (100ms)
  pool.run = fakeWorker(calls, { run: 100 });
  t.truthy(await spamScanner.scan(HAM, { session, client }));
  pool.run = fakeWorker(calls, { run: 3100, warm: false });
  t.truthy(await spamScanner.scan(HAM, { session, client }));

  // with a limit of 200ms, a new worker's first scan is stopped after
  // 1200ms (three time limits, and three more), not 3600ms
  config.spamScanner.timeout = 200;
  calls.length = 0;
  pool.run = fakeWorker(calls, { run: 5000, warm: false });
  const started = Date.now();
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  while (!calls[0].aborted && Date.now() - started < 5000) await setTimeout(50);
  const elapsed = Date.now() - started;
  t.true(elapsed >= 1100 && elapsed < 2000, `stopped after ${elapsed}ms`);
});

test('an outbound scan that takes too long resolves to null', async (t) => {
  await withSlowModel(t);
  config.spamScanner.outboundTimeout = 1000;
  const started = Date.now();
  t.is(
    await spamScanner.scan(HAM, {
      client,
      direction: 'outbound',
      enforce: true,
      llm: true
    }),
    null
  );
  const elapsed = Date.now() - started;
  t.true(elapsed < 3000, `took ${elapsed}ms`);
});

test('an outbound scan waits for a worker at most its time limit, then has the whole limit once it starts, but no more than a quarter more in all', async (t) => {
  // (a time limit of 8s: 10s in all; each case is a second or more from
  //  every limit)
  config.spamScanner.outboundTimeout = 8000;
  // a worker that starts the scan after `wait` and answers `run` later
  const fake =
    (wait, run) =>
    (task, { signal }) =>
      new Promise((resolve, reject) => {
        const pending = [];
        signal.addEventListener('abort', () => {
          for (const timer of pending) timers.clearTimeout(timer);
          reject(new Error('aborted'));
        });
        pending.push(
          timers.setTimeout(() => {
            task.port.postMessage({ started: true });
            pending.push(
              timers.setTimeout(() => resolve({ isSpam: false }), run)
            );
          }, wait)
        );
      });

  // waits 3s, then scans for 6s: 9s in all, past the time limit had it not
  // started again when the scan started, but 6s of its own
  spamScanner.getPool().run = fake(3000, 6000);
  const scan = await spamScanner.scan(HAM, { client, enforce: true });
  t.truthy(scan);
  t.false(scan.isSpam);

  // waits longer than the limit: given up
  spamScanner.getPool().run = fake(9000, 0);
  t.is(await spamScanner.scan(HAM, { client, enforce: true }), null);

  // runs longer than the limit once started: given up
  spamScanner.getPool().run = fake(0, 9000);
  t.is(await spamScanner.scan(HAM, { client, enforce: true }), null);

  // waits 4s, then scans for 7s: within its own limit, but past 10s in all
  // (an API client would be told it failed while it was still sent)
  spamScanner.getPool().run = fake(4000, 7000);
  t.is(await spamScanner.scan(HAM, { client, enforce: true }), null);
});

test('a scan whose worker never answers, even when stopped, resolves to null at its time limit', async (t) => {
  config.spamScanner.timeout = 500;
  config.spamScanner.outboundTimeout = 500;
  spamScanner.getPool().run = () => new Promise(() => {});
  for (const options of [{}, { direction: 'outbound', enforce: true }]) {
    const started = Date.now();
    t.is(await spamScanner.scan(HAM, { session, client, ...options }), null);
    t.true(Date.now() - started < 2000, `took ${Date.now() - started}ms`);
  }

  // (also once it started)
  spamScanner.getPool().run = (task) => {
    task.port.postMessage({ started: true });
    return new Promise(() => {});
  };

  const started = Date.now();
  t.is(
    await spamScanner.scan(HAM, {
      session,
      client,
      direction: 'outbound',
      enforce: true
    }),
    null
  );
  t.true(Date.now() - started < 2000, `took ${Date.now() - started}ms`);
});

test('a scan the caller stops resolves to null at once, and is not logged as timed out', async (t) => {
  const warnings = captureSpamScannerWarnings(t);
  spamScanner.getPool().run = (task, { signal }) =>
    new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('aborted')));
    });
  const controller = new AbortController();
  const started = Date.now();
  const pending = spamScanner.scan(HAM, {
    session,
    client,
    signal: controller.signal
  });
  controller.abort();
  t.is(await pending, null);
  t.true(Date.now() - started < 1000);
  t.false(warnings.some(([message]) => /timed out/.test(String(message))));
  // (already stopped: not started)
  t.is(
    await spamScanner.scan(HAM, { session, client, signal: controller.signal }),
    null
  );
});

test('a scan the caller stops once it is running is left to finish (its worker kept), and its result not used', async (t) => {
  let stopped = false;
  spamScanner.getPool().run = (task, { signal }) =>
    new Promise((resolve) => {
      signal.addEventListener('abort', () => {
        stopped = true;
      });
      task.port.postMessage({ started: true });
      timers.setTimeout(() => resolve({ isSpam: false }), 200);
    });
  const controller = new AbortController();
  const pending = spamScanner.scan(HAM, {
    session,
    client,
    signal: controller.signal
  });
  await setTimeout(50);
  controller.abort();
  t.is(await pending, null);
  t.false(stopped);
});

test('an outbound message that could not be checked is reported once an hour at most, across processes with Redis, and held back only out of monitor mode', async (t) => {
  const errors = [];
  const { error } = logger;
  logger.error = (...args) => errors.push(args);
  t.teardown(() => {
    logger.error = error;
  });
  const warnings = captureSpamScannerWarnings(t);
  await spamScanner.reportUnchecked(true, { domains: ['a'] });
  await spamScanner.reportUnchecked(true, { domains: ['a'] });
  await spamScanner.reportUnchecked(false, { domains: ['b'] });
  t.is(errors.length, 1);
  t.regex(errors[0][0].message, /deferred/);
  t.is(warnings.length, 2);
  t.regex(warnings[1][0], /without a spam scan/);
  // (and one scanned whose link hosts were not all looked up says so)
  await spamScanner.reportUnchecked(false, { links_incomplete: true });
  t.regex(warnings[2][0], /without every link host checked/);
  warnings.pop();

  // (with Redis, once an hour for every process: another process, which has
  //  not alerted yet, does not alert again)
  await client.del('spam_scanner_unchecked_alert');
  await spamScanner.reset();
  await spamScanner.reportUnchecked(true, {}, client);
  await spamScanner.reset();
  await spamScanner.reportUnchecked(true, {}, client);
  t.is(errors.length, 2);
  t.is(warnings.length, 3);

  // (held back only out of monitor mode, and then only what a client
  //  submitted or what is being sent, with SPAM_SCANNER_OUTBOUND_FAIL_CLOSED)
  errors.length = 0;
  warnings.length = 0;
  t.false(await spamScanner.holdUnchecked({ client }));
  await setTimeout(50);
  t.is(errors.length + warnings.length, 0);
  await client.del('spam_scanner_unchecked_alert');
  await spamScanner.reset();
  config.spamScanner.monitorOnly = false;
  t.true(await spamScanner.holdUnchecked({ client }));
  t.false(await spamScanner.holdUnchecked({ client, submitted: false }));
  config.spamScanner.outboundFailClosed = false;
  t.false(await spamScanner.holdUnchecked({ client }));
  // (reported without holding up the message; the same warning once a
  //  minute at most)
  await setTimeout(50);
  // (not counting errors logged by other parts of the app meanwhile)
  t.is(
    errors.filter(([err]) => /spam scan/i.test(String(err?.message ?? err)))
      .length + warnings.length,
    2
  );
});

test('in monitor mode mail queued unchecked is held back for an hour after it was first to be sent, then sent and reported', async (t) => {
  const warnings = captureSpamScannerWarnings(t);
  await client.del('spam_scanner_unchecked_alert');
  await spamScanner.reset();
  t.true(config.spamScanner.monitorOnly);
  const hold = (since) =>
    spamScanner.holdUnchecked({ client, failed: true, since });
  // (without a time it may go by, or within the hour: held back)
  for (const since of [undefined, null, 0, 'not a date', Date.now()])
    t.true(await hold(since), `${since}`);
  t.true(await hold(Date.now() - 59 * 60 * 1000));
  // (reported as deferred, once a minute at most)
  await setTimeout(50);
  t.is(warnings.length, 1);
  t.regex(warnings[0][0], /deferred/i);
  // (past it: sent, and reported as sent unchecked)
  t.false(await hold(Date.now() - 61 * 60 * 1000));
  await setTimeout(50);
  t.is(warnings.length, 2);
  t.regex(warnings[1][0], /sent without a spam scan/i);
});

test('large messages are skipped unless enforced, and messages beyond the queue limit always', async (t) => {
  captureSpamScannerLog(t);
  config.spamScanner.maxSize = 100;
  t.is(await spamScanner.scan(PHISHING, { session, client }), null);
  t.truthy(
    await spamScanner.scan(PHISHING, { session, client, enforce: true })
  );

  config.spamScanner.maxSize = 0;
  config.spamScanner.maxQueue = 1;
  const pool = spamScanner.getPool();
  Object.defineProperty(pool, 'queueSize', { value: 1, configurable: true });
  t.is(await spamScanner.scan(PHISHING, { session, client }), null);
  // (one that decides too: its caller answers a temporary error at once)
  t.is(
    await spamScanner.scan(PHISHING, { session, client, enforce: true }),
    null
  );
});

test('disabled, nothing is scanned but outbound mail for what blocks it, as origin always scanned it', async (t) => {
  config.spamScanner.enabled = false;
  captureSpamScannerLog(t);
  const program = withAttachment('report.exe', windowsProgram());
  t.is(await spamScanner.scan(PHISHING, { session, client }), null);
  // (outbound, only a scan for what blocks a message, in monitor mode too)
  t.is(
    await spamScanner.scan(program, { client, direction: 'outbound' }),
    null
  );
  const refusing = { client, direction: 'outbound', blocks: true };
  t.true(
    spamScanner.getOutboundBlockingMessages(
      await spamScanner.scan(program, refusing)
    ).length > 0
  );
  t.true(spamScanner.shouldScanOutbound(ENVELOPE, 'another.example'));

  // (and none with SPAM_SCANNER_OUTBOUND_BLOCK=false in monitor mode)
  config.spamScanner.outboundBlock = false;
  t.is(await spamScanner.scan(program, refusing), null);
  t.false(spamScanner.shouldScanOutbound(ENVELOPE, 'another.example'));

  // (out of monitor mode, always)
  config.spamScanner.monitorOnly = false;
  const scan = await spamScanner.scan(program, {
    client,
    direction: 'outbound',
    enforce: true
  });
  t.true(spamScanner.getOutboundBlockingMessages(scan).length > 0);
  t.true(spamScanner.shouldScanOutbound(ENVELOPE, 'another.example'));
});

test('outbound blocking: viruses, programs, malware and adult links, GTUBE', async (t) => {
  captureSpamScannerLog(t);
  const scanOf = (raw) =>
    spamScanner.scan(raw, { direction: 'outbound', client, enforce: true });
  const blocks = async (raw) =>
    spamScanner.getOutboundBlockingMessages(await scanOf(raw));
  const blocked = async (raw) => {
    const messages = await blocks(raw);
    return messages.length > 0;
  };

  const PROGRAM = windowsProgram();

  // Windows programs and scripts by name (the types Gmail blocks)

  for (const filename of [
    'report.exe',
    'setup.msi',
    'run.bat',
    'run.cmd',
    'page.js',
    'macro.vbs',
    'screen.scr',
    'link.lnk',
    'disk.iso',
    'tool.jar',
    'app.apk',
    'shell.ps1'
  ])
    t.true(await blocked(withAttachment(filename, 'content')), `${filename}`);

  // a program under another name, or without one
  for (const filename of ['invoice.pdf', 'notes.txt', 'report'])
    t.true(
      await blocked(withAttachment(filename, PROGRAM)),
      `a program named ${filename}`
    );

  // a document extension in front of a program's
  t.true(await blocked(withAttachment('invoice.pdf.exe', 'content')));

  // the other types Gmail blocks, by name (Spam Scanner does not count
  // these as programs)

  for (const filename of [
    'module.mjs',
    'driver.vxd',
    'code.lib',
    // (dots and spaces at the end, which Windows drops)
    'macro.vbs.',
    'page.js. '
  ])
    t.true(await blocked(withAttachment(filename, 'content')), `${filename}`);

  // an archive holding a blocked program among others
  const archive = (extensions) => ({
    findings: {
      viruses: [],
      phishing: [],
      arbitrary: [],
      executables: [
        {
          type: 'executable_in_archive',
          filename: 'files.zip',
          message: 'Archive "files.zip" contains programs',
          extension: extensions[0],
          extensions
        }
      ]
    },
    attachments: [{ filename: 'files.zip', extension: 'zip' }]
  });
  t.deepEqual(spamScanner.getOutboundBlockingMessages(archive(['sh', 'exe'])), [
    'Archive "files.zip" contains programs'
  ]);
  t.deepEqual(
    spamScanner.getOutboundBlockingMessages(archive(['sh', 'py'])),
    []
  );

  // a right-to-left override hiding the real extension
  t.true(
    await blocked(withAttachment('invoice\u202Efdp.exe', 'content')),
    'right-to-left override'
  );

  // scripts, certificates and other files people send each other are not
  // blocked (they count toward the score only)
  for (const filename of [
    'script.py',
    'deploy.sh',
    'tool.pl',
    'certificate.cer',
    'archive.pst',
    'notes.tmp',
    'shortcut.url'
  ]) {
    const scan = await scanOf(withAttachment(filename, 'plain text content'));
    t.deepEqual(
      spamScanner.getOutboundBlockingMessages(scan),
      [],
      `${filename} is not blocked`
    );
  }

  // nor is a script named as text
  t.deepEqual(
    await blocks(withAttachment('deploy.txt', '#!/bin/sh\necho hello\n')),
    []
  );

  // the GTUBE test string
  t.true(
    await blocked(
      message([
        'From: alice@example.com',
        'To: bob@example.org',
        'Subject: test',
        '',
        'XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X'
      ])
    )
  );

  // links to international domain names, lookalike domains and links showing
  // another address are not blocked (they count toward the score)
  t.deepEqual(
    await blocks(
      message([
        'From: alice@example.com',
        'To: bob@example.org',
        'Subject: shop',
        'Content-Type: text/html; charset=utf-8',
        '',
        '<a href="https://bücher.example/">books</a> https://пример.example/'
      ])
    ),
    []
  );
  const phishing = await scanOf(PHISHING);
  t.true(phishing.findings.phishing.length > 0);
  t.deepEqual(spamScanner.getOutboundBlockingMessages(phishing), []);

  // a harmless message is not
  t.deepEqual(await blocks(HAM), []);

  // and viruses are (when ClamAV is turned on)
  t.deepEqual(
    spamScanner.getOutboundBlockingMessages({
      findings: {
        viruses: [{ type: 'virus', message: 'infected' }],
        executables: [],
        phishing: [],
        arbitrary: []
      }
    }),
    ['infected']
  );
  t.deepEqual(spamScanner.getOutboundBlockingMessages(null), []);
});

test('a scan says whether every link host was looked up', async (t) => {
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  let failing = false;
  const fake = {
    async resolve4() {
      if (failing)
        throw Object.assign(new Error('timeout'), { code: 'ETIMEOUT' });
      return ['192.0.2.1'];
    }
  };
  const resolvers = spamScanner.getResolvers(client, fake);
  resolvers.malware = fake;
  resolvers.family = fake;
  const raw = message([
    'From: alice@example.com',
    'To: bob@example.org',
    'Subject: links',
    'Content-Type: text/html',
    '',
    '<a href="https://fine.example.org/">there</a>'
  ]);
  const other = Buffer.from(
    raw.toString().replace('fine.example.org', 'other.example.org')
  );
  const complete = await spamScanner.scan(raw, {
    client,
    direction: 'outbound',
    protection: LINKS
  });
  t.true(complete.linksComplete);
  t.true(spamScanner.toStored(complete).links_complete);
  // (a lookup that failed leaves its host unchecked)
  failing = true;
  // (another host: Spam Scanner remembers the answers it had)
  const incomplete = await spamScanner.scan(other, {
    client,
    direction: 'outbound',
    protection: LINKS
  });
  t.false(incomplete.linksComplete);
  t.false(spamScanner.toStored(incomplete).links_complete);
  // (made in monitor mode)
  t.false(spamScanner.toStored(incomplete).enforced);

  // (as is one answered later than Spam Scanner waits for it)
  failing = false;
  config.spamScanner.networkTimeout = 100;
  const { resolve4 } = fake;
  fake.resolve4 = async (...args) => {
    await setTimeout(400);
    return resolve4(...args);
  };

  const late = await spamScanner.scan(
    Buffer.from(raw.toString().replace('fine.example.org', 'late.example.org')),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.false(late.linksComplete);
});

test('a worker waits for each link lookup longer than the main thread does, so no answer it gave up on is counted as answered', async (t) => {
  // (a worker whose lookups the main thread answers at most 1000ms after it
  //  is asked; this one answers each in 1100ms, which the worker still waits
  //  for: by then the main thread has answered every lookup, a late one as
  //  failed)
  const Piscina = require('piscina');
  const { MessageChannel } = require('node:worker_threads');
  const { SECURITY_SERVERS } = require('#helpers/create-family-resolver');
  const pool = new Piscina({
    filename: path.join(
      __dirname,
      '..',
      '..',
      'helpers',
      'spam-scanner-worker.js'
    ),
    minThreads: 1,
    maxThreads: 1,
    workerData: {
      settings: {
        cloudflare: true,
        networkTimeout: 5000,
        lookupTimeout: 1000,
        llm: null
      }
    }
  });
  t.teardown(() => pool.destroy());
  const channel = new MessageChannel();
  channel.port1.on('message', (message) => {
    if (message?.started) return;
    timers.setTimeout(() => {
      try {
        channel.port1.postMessage({
          id: message.id,
          addresses:
            message.name === 'malware.example.net' &&
            SECURITY_SERVERS.includes(message.servers?.[0])
              ? ['0.0.0.0']
              : ['192.0.2.1']
        });
      } catch {}
    }, 1100);
  });
  t.teardown(() => channel.port1.close());
  const summary = await pool.run(
    {
      raw: message([
        'From: alice@example.com',
        'To: bob@example.org',
        'Subject: links',
        'Content-Type: text/html',
        '',
        '<a href="https://malware.example.net/x">here</a>'
      ]),
      session: {},
      options: {},
      outbound: false,
      llm: false,
      protection: LINKS,
      port: channel.port2
    },
    { transferList: [channel.port2] }
  );
  t.true(
    summary.findings.phishing.some(
      (item) =>
        item.type === 'malicious_domain' &&
        item.message.includes('malware.example.net')
    )
  );
});

test('a worker gives up on a link lookup itself before Spam Scanner does, and says its links were not all looked up, however late the main thread answers', async (t) => {
  // (a worker whose lookups may take 300ms: it waits 800ms for each, and
  //  Spam Scanner 1300ms; this main thread, as one whose event loop is held
  //  up, answers each in 1600ms, a block that would come too late)
  const Piscina = require('piscina');
  const { MessageChannel } = require('node:worker_threads');
  const { SECURITY_SERVERS } = require('#helpers/create-family-resolver');
  const pool = new Piscina({
    filename: path.join(
      __dirname,
      '..',
      '..',
      'helpers',
      'spam-scanner-worker.js'
    ),
    minThreads: 1,
    maxThreads: 1,
    workerData: {
      settings: {
        cloudflare: true,
        networkTimeout: 5000,
        lookupTimeout: 300,
        llm: null
      }
    }
  });
  t.teardown(() => pool.destroy());
  const channel = new MessageChannel();
  const asked = [];
  channel.port1.on('message', (message) => {
    if (message?.started) return;
    asked.push(message.name);
    timers.setTimeout(() => {
      try {
        channel.port1.postMessage({
          id: message.id,
          addresses:
            message.name === 'malware.example.net' &&
            SECURITY_SERVERS.includes(message.servers?.[0])
              ? ['0.0.0.0']
              : ['192.0.2.1']
        });
      } catch {}
    }, 1600);
  });
  t.teardown(() => channel.port1.close());
  const summary = await pool.run(
    {
      raw: message([
        'From: alice@example.com',
        'To: bob@example.org',
        'Subject: links',
        'Content-Type: text/html',
        '',
        '<a href="https://malware.example.net/x">here</a>'
      ]),
      session: {},
      options: {},
      outbound: false,
      llm: false,
      protection: LINKS,
      port: channel.port2
    },
    { transferList: [channel.port2] }
  );
  t.true(asked.includes('malware.example.net'));
  t.true(summary.linksTimedOut);
});

//
// A pool of workers whose Spam Scanner acts as versions of it that give
// ClamAV a time limit of its own (a minute unless given one: here a clamd
// that never answers, so an attachment it could not scan is listed in
// `virusScanErrors`), and that scan a message beyond the MIME parser's limits
// in part (`parseError`) rather than throwing
//
function patchedPool(t, settings) {
  const Piscina = require('piscina');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'spam-scanner-worker-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const helpers = path.join(__dirname, '..', '..', 'helpers');
  const filename = path.join(dir, 'worker.js');
  fs.writeFileSync(
    filename,
    `
const { setTimeout } = require('node:timers/promises');
const { workerData } = require('node:worker_threads');
const resolved = require.resolve('spamscanner', { paths: [${JSON.stringify(
      helpers
    )}] });
const mod = require(resolved);
const Real = mod.SpamScanner || mod.default || mod;
class SpamScanner extends Real {
  constructor(options) {
    super(options);
    this.clamavSettings = options.clamav;
  }

  async scan(source, options = {}) {
    const clamav =
      options.clamav === undefined ? this.clamavSettings : options.clamav;
    const result = await super.scan(source, { ...options, clamav: false });
    result.results ||= {};
    if (clamav) {
      await setTimeout(typeof clamav === 'object' && clamav.timeout ? clamav.timeout : 60_000);
      result.results.virusScanErrors = [
        { filename: 'a.pdf', error: 'clamd did not answer' }
      ];
    }

    if (workerData.fake?.parseError) {
      result.results.parseError = 'Message is too complex to parse';
      result.tests = [...(result.tests || []), { name: 'MIME_TOO_COMPLEX', score: 0 }];
    }

    return result;
  }
}

require.cache[resolved].exports = { ...mod, SpamScanner, default: SpamScanner };
module.exports = require(${JSON.stringify(
      path.join(helpers, 'spam-scanner-worker.js')
    )});
`
  );
  const pool = new Piscina({
    filename,
    minThreads: 1,
    maxThreads: 1,
    workerData: {
      settings: { cloudflare: false, llm: null, ...settings },
      fake: settings.fake
    }
  });
  t.teardown(() => pool.destroy());
  return pool;
}

test("ClamAV gets the time limit of a scan's network checks, also from a Spam Scanner that would give it a minute", async (t) => {
  const pool = patchedPool(t, {
    clamav: true,
    networkTimeout: 300,
    lookupTimeout: 300
  });
  const raw = withAttachment('a.pdf', '%PDF-1.4');
  for (const options of [{}, { timeout: 500 }]) {
    const started = Date.now();
    const summary = await Promise.race([
      pool.run({ raw, session: {}, options, outbound: false, llm: false }),
      setTimeout(10_000, null)
    ]);
    t.truthy(summary, `${JSON.stringify(options)}`);
    t.is(summary?.virusScanErrors, 1);
    t.true(Date.now() - started < 5000, `took ${Date.now() - started}ms`);
  }
});

test('a scan of a message in part, or with an attachment ClamAV could not scan, says so: one in part is blocked (it is never read in full), also in monitor mode; the other held back as unchecked out of it (it may be scanned when tried again)', async (t) => {
  // (the worker carries what Spam Scanner says)
  const pool = patchedPool(t, {
    clamav: false,
    networkTimeout: 300,
    lookupTimeout: 300,
    fake: { parseError: true }
  });
  const summary = await pool.run({
    raw: HAM,
    session: {},
    options: {},
    outbound: true,
    llm: false
  });
  t.is(summary.parseError, 'Message is too complex to parse');
  t.true(summary.tests.some((test) => test.name === 'MIME_TOO_COMPLEX'));
  t.is(summary.virusScanErrors, 0);

  // (and the main thread holds it back out of monitor mode only)
  captureSpamScannerLog(t);
  for (const fields of [
    { parseError: 'Message is too complex to parse' },
    { virusScanErrors: 2 }
  ]) {
    await spamScanner.reset();
    const workers = spamScanner.getPool();
    const run = workers.run.bind(workers);
    workers.run = async (...args) => ({ ...(await run(...args)), ...fields });
    const name = Object.keys(fields)[0];
    config.spamScanner.monitorOnly = false;
    const held = await spamScanner.checkOutbound({
      message: HAM,
      stored: null,
      envelope: ENVELOPE,
      client
    });
    if (name === 'parseError') {
      t.is(held.verdict, 'block');
      t.true(held.enforced);
      t.regex(held.response, /too complex to be checked in full/);
    } else {
      t.is(held.verdict, 'unchecked', `${name}`);
      t.false(held.stored.links_complete, `${name}`);
    }

    // (in monitor mode one with an attachment ClamAV could not scan is
    //  sent; one too complex to check in full is refused as it would have
    //  been as it was submitted, see `blocksOutbound`)
    config.spamScanner.monitorOnly = true;
    const sent = await spamScanner.checkOutbound({
      message: HAM,
      stored: null,
      envelope: ENVELOPE,
      client
    });
    if (name === 'parseError') {
      t.is(sent.verdict, 'block');
      t.regex(sent.response, /too complex to be checked in full/);
    } else t.is(sent.verdict, 'send', `${name}`);
  }
});

test('out of monitor mode, a message whose link hosts were not all looked up is held back, unless set to send it unchecked', async (t) => {
  config.spamScanner.monitorOnly = false;
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  const failing = {
    async resolve4() {
      throw Object.assign(new Error('timeout'), { code: 'ETIMEOUT' });
    }
  };
  const resolvers = spamScanner.getResolvers(client, failing);
  resolvers.malware = failing;
  resolvers.family = failing;
  const raw = message([
    'From: alice@example.com',
    'To: bob@example.org',
    'Subject: links',
    'Content-Type: text/html',
    '',
    '<a href="https://unchecked.example.org/">there</a>'
  ]);
  const check = await spamScanner.checkOutbound({
    message: raw,
    stored: null,
    envelope: ENVELOPE,
    client,
    protection: LINKS
  });
  t.is(check.verdict, 'unchecked');
  t.false(check.stored.links_complete);

  config.spamScanner.outboundFailClosed = false;
  const sent = await spamScanner.checkOutbound({
    message: raw,
    stored: null,
    envelope: ENVELOPE,
    client,
    protection: LINKS
  });
  t.is(sent.verdict, 'send');
});

test('every link host of an outbound message is looked up, and one linking to too many is blocked', async (t) => {
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  const asked = new Set();
  const fake = {
    async resolve4(name) {
      asked.add(name);
      return ['192.0.2.1'];
    }
  };
  const resolvers = spamScanner.getResolvers(client, fake);
  resolvers.malware = fake;
  resolvers.family = fake;
  const linking = (count) =>
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: links',
      'Content-Type: text/html',
      '',
      Array.from(
        { length: count },
        (_, i) => `<a href="https://h${i}.example.org/">${i}</a>`
      ).join(' ')
    ]);
  const many = await spamScanner.scan(linking(250), {
    client,
    direction: 'outbound',
    protection: LINKS
  });
  t.is(asked.size, 250);
  t.deepEqual(spamScanner.getOutboundBlockingMessages(many), []);
  const tooMany = await spamScanner.scan(linking(251), {
    client,
    direction: 'outbound',
    protection: LINKS
  });
  t.deepEqual(spamScanner.getOutboundBlockingMessages(tooMany), [
    'Message links to more than 250 different hosts, too many to check'
  ]);
  // (different hosts: many links to one host are fine)
  const oneHost = await spamScanner.scan(
    Buffer.from(
      linking(300)
        .toString()
        .replaceAll(/h\d+\.example/g, 'h.example')
    ),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.deepEqual(spamScanner.getOutboundBlockingMessages(oneHost), []);
  // (also past what Spam Scanner reads, a million characters, where the
  //  rest is not read once there are too many)
  const past = await spamScanner.scan(
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: links',
      '',
      'word '.repeat(210_000),
      Array.from({ length: 100_000 }, (_, i) => `p${i}.example.net/`).join(' ')
    ]),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.deepEqual(spamScanner.getOutboundBlockingMessages(past), [
    'Message links to more than 250 different hosts, too many to check'
  ]);
  t.false([...asked].some((name) => /^p(?:2[5-9]\d|\d{4,})\./.test(name)));
  // (inbound, only what counts toward the score)
  const inbound = await spamScanner.scan(linking(251), { client });
  t.deepEqual(spamScanner.getOutboundBlockingMessages(inbound), []);
});

test('out of monitor mode a kept scan decides only when it was made out of it, with every link host looked up, within 6 hours', async (t) => {
  const kept = stored();
  const monitored = stored({ enforced: false });
  // (in monitor mode, any kept scan)
  t.true(spamScanner.isCurrent(kept));
  t.true(spamScanner.isCurrent(monitored));
  config.spamScanner.monitorOnly = false;
  t.true(spamScanner.isCurrent(kept));
  t.false(spamScanner.isCurrent(monitored));
  t.false(spamScanner.isCurrent({ ...kept, enforced: undefined }));
  t.false(spamScanner.isCurrent({ ...kept, links_complete: false }));
  t.false(
    spamScanner.isCurrent({
      ...kept,
      scanned_at: new Date(Date.now() - 7 * 60 * 60 * 1000)
    })
  );

  // (one that is not is scanned again as it is sent, and still decides when
  //  that fails)
  let scans = 0;
  spamScanner.getPool().run = async () => {
    scans++;
    throw new Error('boom');
  };

  captureSpamScannerLog(t);
  const check = await spamScanner.checkOutbound({
    message: HAM,
    stored: stored({ enforced: false, blocking: ['GTUBE'] }),
    envelope: ENVELOPE,
    client
  });
  t.is(scans, 1);
  t.is(check.verdict, 'block');
  t.true(check.enforced);

  // (but not one without every link host looked up, when a message that
  //  cannot be checked is held back)
  const unchecked = await spamScanner.checkOutbound({
    message: HAM,
    stored: stored({ links_complete: false }),
    envelope: ENVELOPE,
    client
  });
  t.is(unchecked.verdict, 'unchecked');
  config.spamScanner.outboundFailClosed = false;
  const sent = await spamScanner.checkOutbound({
    message: HAM,
    stored: stored({ links_complete: false }),
    envelope: ENVELOPE,
    client
  });
  t.is(sent.verdict, 'send');
});

test('link hosts are asked of the Cloudflare malware and family resolvers, and a blocked one is found inbound and blocks outbound', async (t) => {
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  const lookups = [];
  const fake = (category) => ({
    async resolve4(name) {
      lookups.push([category, name]);
      if (category === 'malware' && name === 'malware.example.net')
        return ['0.0.0.0'];
      return ['192.0.2.1'];
    }
  });
  // (the Cloudflare resolvers are created from the Redis client; replace
  //  them with fakes that answer like Cloudflare)
  const resolvers = spamScanner.getResolvers(client, fake('default'));
  resolvers.malware = fake('malware');
  resolvers.family = fake('family');

  const raw = message([
    'From: alice@example.com',
    'To: bob@example.org',
    'Subject: links',
    'Content-Type: text/html',
    '',
    '<a href="https://malware.example.net/x">here</a> <a href="https://fine.example.org/">there</a>'
  ]);
  // inbound, the scan finds it
  const scan = await spamScanner.scan(raw, {
    session,
    client,
    protection: LINKS
  });
  t.true(
    lookups.some(
      ([category, name]) =>
        category === 'malware' && name === 'malware.example.net'
    )
  );
  t.true(
    scan.findings.phishing.some(
      (item) =>
        item.type === 'malicious_domain' &&
        item.message.includes('malware.example.net')
    )
  );
  // outbound, it blocks the message
  const outbound = await spamScanner.scan(raw, {
    client,
    direction: 'outbound',
    protection: LINKS,
    enforce: true
  });
  t.true(
    spamScanner
      .getOutboundBlockingMessages(outbound)
      .some((message) => message.includes('malware.example.net'))
  );
});

test("by a domain's Spam Scanner settings: by default a link host the malware resolvers block blocks, and a program attachment; adult content protection adds the family resolvers, executable protection can be turned off, phishing protection cannot", async (t) => {
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  let lookups = [];
  const fake = (category) => ({
    async resolve4(name) {
      lookups.push([category, name]);
      // (the family resolvers block malware too)
      if (name === 'malware.example.net') return ['0.0.0.0'];
      if (category === 'family' && name === 'adult.example.net')
        return ['0.0.0.0'];
      return ['192.0.2.1'];
    }
  });
  const resolvers = spamScanner.getResolvers(client, fake('default'));
  resolvers.malware = fake('malware');
  resolvers.family = fake('family');

  const raw = message([
    'From: alice@example.com',
    'To: bob@example.org',
    'Subject: links',
    'Content-Type: text/html',
    '',
    '<a href="https://malware.example.net/x">here</a> <a href="https://adult.example.net/">there</a>'
  ]);
  const scanBy = (domain, source = raw) =>
    spamScanner.scan(source, {
      client,
      direction: 'outbound',
      enforce: true,
      protection: spamScanner.protectionOf(domain)
    });
  const paid = (settings) => ({ plan: 'enhanced_protection', ...settings });
  const blocking = async (domain, source) => {
    lookups = [];
    const summary = await scanBy(domain, source);
    t.truthy(summary);
    t.deepEqual(
      spamScanner.toStored(summary).blocking,
      spamScanner.getOutboundBlockingMessages(summary)
    );
    return spamScanner.getOutboundBlockingMessages(summary);
  };

  const blocked = async (domain, source) => {
    const messages = await blocking(domain, source);
    return messages.length > 0;
  };

  // the defaults: a domain without settings (as one created now has), and
  // one on the free plan whatever it has
  for (const domain of [
    null,
    paid({}),
    {
      plan: 'free',
      has_adult_content_protection: true,
      has_phishing_protection: true,
      has_executable_protection: false
    }
  ]) {
    t.deepEqual(spamScanner.protectionOf(domain), {
      adult: false,
      phishing: true,
      executable: true
    });
    // (the malware resolvers only; lookups are shared once made, so only the
    //  first domain's are made here)
    const messages = await blocking(domain);
    t.true(messages.some((item) => item.includes('malware.example.net')));
    t.false(messages.some((item) => item.includes('adult.example.net')));
    t.true(lookups.every(([category]) => category === 'malware'));
  }

  // (as origin blocked such links for every domain: phishing protection is
  //  no longer a setting, and turning it off changes nothing)
  t.deepEqual(
    spamScanner.protectionOf(paid({ has_phishing_protection: false })),
    spamScanner.protectionOf(null)
  );
  const phishing = await blocking(paid({ has_phishing_protection: false }));
  t.true(phishing.some((item) => item.includes('malware.example.net')));

  // adult content protection: the family resolvers as well, which block
  // malware too
  const adult = await blocking(paid({ has_adult_content_protection: true }));
  t.true(adult.some((item) => item.includes('malware.example.net')));
  t.true(adult.some((item) => item.includes('adult.example.net')));

  // more link hosts than are looked up block it only when they are looked up
  const many = message([
    'From: alice@example.com',
    'To: bob@example.org',
    'Subject: links',
    '',
    Array.from({ length: 300 }, (_, i) => `https://h${i}.example.net/`).join(
      ' '
    )
  ]);
  t.deepEqual(await blocking(null, many), [
    'Message links to more than 250 different hosts, too many to check'
  ]);

  // a program attachment blocks unless executable protection is off
  const program = withAttachment('report.exe', 'content');
  t.true(await blocked(null, program));
  t.true(await blocked(paid({}), program));
  t.deepEqual(
    await blocking(paid({ has_executable_protection: false }), program),
    []
  );
  // (nor does it count toward the score then, so it is not spam for it)
  const programTests = async (domain) => {
    const summary = await scanBy(
      domain,
      withAttachment('invoice.pdf.exe', 'x')
    );
    return summary.tests
      .map((item) => item.name)
      .filter((name) => /EXECUTABLE|DOUBLE_EXTENSION/.test(name));
  };

  const counted = await programTests(null);
  t.true(counted.length > 0);
  t.deepEqual(
    await programTests(paid({ has_executable_protection: false })),
    []
  );
  // (by name and content type too)
  const named = withAttachment('module.mjs', 'content');
  t.true(await blocked(null, named));
  t.deepEqual(
    await blocking(paid({ has_executable_protection: false }), named),
    []
  );
  // (GTUBE still does)
  t.true(await blocked(paid({ has_executable_protection: false }), GTUBE));
});

// a scan kept with one domain's settings does not decide for others
test("a kept scan decides as mail is sent only with the domain's settings it was made with", async (t) => {
  const kept = { ...stored(), protection: spamScanner.protectionOf(null) };
  t.true(spamScanner.isCurrent(kept));
  t.true(spamScanner.isCurrent(kept, spamScanner.protectionOf(null)));
  t.false(
    spamScanner.isCurrent(kept, {
      adult: true,
      phishing: true,
      executable: true
    })
  );
  // (nor one kept before there were any)
  t.false(spamScanner.isCurrent(stored(), spamScanner.protectionOf(null)));

  let scans = 0;
  spamScanner.getPool().run = async () => {
    scans++;
    return null;
  };

  captureSpamScannerLog(t);
  const same = await spamScanner.checkOutbound({
    message: HAM,
    stored: kept,
    envelope: ENVELOPE,
    client,
    protection: spamScanner.protectionOf(null)
  });
  t.is(same.verdict, 'send');
  t.is(scans, 0);
  await spamScanner.checkOutbound({
    message: HAM,
    stored: kept,
    envelope: ENVELOPE,
    client,
    protection: { adult: true, phishing: false, executable: true }
  });
  t.is(scans, 1);

  // (and when it cannot be scanned again, it does not decide: it may block
  //  what is no longer blocked, or not have looked up links that now are)
  const blocked = await spamScanner.checkOutbound({
    message: HAM,
    stored: { ...kept, blocking: ['Link hostname adult.example.net'] },
    envelope: ENVELOPE,
    client,
    protection: { adult: false, phishing: false, executable: false }
  });
  t.is(blocked.verdict, 'unchecked');
});

// the clock `ms` ahead for what `fn` does (the main thread's: what is
// remembered for a while expires)
async function later(ms, fn) {
  const { now } = Date;
  Date.now = () => now() + ms;
  try {
    return await fn();
  } finally {
    Date.now = now;
  }
}

test('a failed link lookup is remembered for a minute only, in this process only (not in Redis), a missing name is an answer', async (t) => {
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  const lookups = {};
  let failing = true;
  const fake = (category) => ({
    async resolve4(name) {
      const key = `${category} ${name}`;
      lookups[key] = (lookups[key] || 0) + 1;
      if (name === 'missing.example.org') {
        const err = new Error('not found');
        err.code = 'ENOTFOUND';
        throw err;
      }

      if (category === 'malware' && name === 'outage.example.net') {
        if (failing) {
          const err = new Error('timeout');
          err.code = 'ETIMEOUT';
          throw err;
        }

        return ['0.0.0.0'];
      }

      return ['192.0.2.1'];
    }
  });
  const resolvers = spamScanner.getResolvers(client, fake('default'));
  resolvers.malware = fake('malware');
  resolvers.family = fake('family');

  const raw = message([
    'From: alice@example.com',
    'To: bob@example.org',
    'Subject: links',
    'Content-Type: text/html',
    '',
    '<a href="https://outage.example.net/x">here</a> <a href="https://missing.example.org/">there</a>'
  ]);

  // the resolver fails: nothing is found
  const found = (scan) =>
    scan.findings.phishing.some(
      (item) =>
        item.type === 'malicious_domain' &&
        item.message.includes('outage.example.net')
    );
  const first = await spamScanner.scan(raw, {
    session,
    client,
    protection: LINKS
  });
  t.false(found(first));

  // it answers again: within a minute it is not asked again (each message
  // would wait for it to time out)
  failing = false;
  const again = await spamScanner.scan(raw, {
    session,
    client,
    protection: LINKS
  });
  t.false(found(again));
  t.is(lookups['malware outage.example.net'], 1);
  // (nothing of it is in Redis)
  const keys = await client.keys('*');
  t.deepEqual(
    keys.filter((key) => key.includes('outage')),
    []
  );

  // a minute later it is asked again, and the link is found
  const second = await later(61_000, () =>
    spamScanner.scan(raw, { session, client, protection: LINKS })
  );
  t.true(found(second));
  t.is(lookups['malware outage.example.net'], 2);

  // a name that does not exist is an answer, and is not asked again
  t.is(lookups['malware missing.example.org'], 1);
});

test('lookups of one name at the same time are made once', async (t) => {
  let calls = 0;
  let answer;
  const resolvers = spamScanner.getResolvers(client, {});
  resolvers.malware = {
    resolve4() {
      calls++;
      return new Promise((resolve) => {
        answer = resolve;
      });
    }
  };
  const servers = ['1.1.1.2', '1.0.0.2'];
  const pending = [
    spamScanner.resolve4('shared.example.net', servers),
    spamScanner.resolve4('SHARED.example.net', servers)
  ];
  t.is(calls, 1);
  answer(['0.0.0.0']);
  t.deepEqual(await Promise.all(pending), [['0.0.0.0'], ['0.0.0.0']]);
  // (once answered, the next lookup is made again: the resolver, Tangerine
  //  with its Redis cache, remembers answers, not this)
  const next = spamScanner.resolve4('shared.example.net', servers);
  t.is(calls, 2);
  answer(['0.0.0.0']);
  t.deepEqual(await next, ['0.0.0.0']);
});

test('only so many lookups are made at once, each scan’s in turn with the others’, so one message linking to hundreds of names holds up no other scan, and one not made in time is not remembered as failed', async (t) => {
  config.spamScanner.networkTimeout = 300;
  config.spamScanner.outboundNetworkTimeout = 300;
  let running = 0;
  let most = 0;
  const asked = [];
  const answers = new Map();
  const resolvers = spamScanner.getResolvers(client, {});
  resolvers.malware = {
    resolve4(name) {
      asked.push(name);
      running++;
      most = Math.max(most, running);
      return new Promise((resolve) => {
        answers.set(name, () => {
          running--;
          resolve([]);
        });
      });
    }
  };
  const servers = ['1.1.1.2', '1.0.0.2'];
  const owners = Array.from({ length: 5 }, (_, i) => Symbol(`scan ${i}`));
  // (a flood from one scan, a name server that never answers)
  const flood = Array.from({ length: 100 }, (_, i) =>
    spamScanner.resolve4(`f${i}.flood.example.net`, servers, owners[0])
  );
  await setTimeout(10);
  t.is(running, 16);
  // (another scan's lookup is asked at once, also one the flood waits to
  //  make, which it makes in its own turn)
  const queued = spamScanner.resolve4(
    'popular.example.org',
    servers,
    owners[0]
  );
  const other = spamScanner.resolve4('victim.example.org', servers, owners[1]);
  const popular = spamScanner.resolve4(
    'popular.example.org',
    servers,
    owners[1]
  );
  await setTimeout(10);
  t.true(asked.includes('victim.example.org'));
  t.true(asked.includes('popular.example.org'));
  answers.get('victim.example.org')();
  answers.get('popular.example.org')();
  t.deepEqual(await other, []);
  t.deepEqual(await popular, []);
  // (at most so many in all)
  const more = owners
    .slice(1)
    .flatMap((owner, j) =>
      Array.from({ length: 20 }, (_, i) =>
        spamScanner.resolve4(`m${j}-${i}.example.org`, servers, owner)
      )
    );
  await setTimeout(10);
  t.is(running, 64);
  t.is(most, 64);
  // (those that waited past their time are not made, nor remembered as
  //  failed: asked again later, they are made)
  const results = await Promise.all(flood.slice(16));
  t.true(results.every((result) => result === null));
  for (const answer of answers.values()) answer();
  await Promise.all([...flood, ...more]);
  // (the flood's own lookup of the name another scan made since is not
  //  made again: it answers as that one did)
  t.deepEqual(await queued, []);
  t.is(asked.filter((name) => name === 'popular.example.org').length, 1);
  t.false(asked.includes('f99.flood.example.net'));
  const again = spamScanner.resolve4(
    'f99.flood.example.net',
    servers,
    owners[2]
  );
  await setTimeout(10);
  t.true(asked.includes('f99.flood.example.net'));
  answers.get('f99.flood.example.net')();
  t.deepEqual(await again, []);
});

test('a lookup the resolver answers with SERVFAIL is no block and no failed lookup, and is logged once an hour at most; REFUSED, FORMERR, a timeout or network error is a failed lookup', async (t) => {
  const warnings = captureSpamScannerWarnings(t);
  const failing = (code) => ({
    async resolve4() {
      throw Object.assign(new Error(code), { code });
    }
  });
  const servers = ['1.1.1.2', '1.0.0.2'];
  for (const [code, expected] of [
    ['ENOTFOUND', []],
    ['ENODATA', []],
    ['ESERVFAIL', []],
    ['EREFUSED', null],
    ['EFORMERR', null],
    ['EBADNAME', null],
    ['ETIMEOUT', null],
    ['ECONNREFUSED', null],
    ['ECANCELLED', null],
    ['ECONNRESET', null]
  ]) {
    const resolvers = spamScanner.getResolvers(client, {});
    resolvers.malware = failing(code);
    t.deepEqual(
      await spamScanner.resolve4(`${code.toLowerCase()}.example.net`, servers),
      expected,
      `${code}`
    );
    await spamScanner.reset();
  }

  // SERVFAIL answers are logged (not stored), once an hour at most, with how
  // many there were
  const servfails = () =>
    warnings.filter(([message]) => String(message).includes('SERVFAIL'));
  t.is(servfails().length, 1);
  t.is(servfails()[0][1].servfails, 1);
  // (after a reset, the next one is logged, and those after it in the hour
  //  are not)
  const resolvers = spamScanner.getResolvers(client, {});
  resolvers.malware = failing('ESERVFAIL');
  for (const name of ['a.example.net', 'b.example.net', 'c.example.net'])
    t.deepEqual(await spamScanner.resolve4(name, servers), []);
  t.is(servfails().length, 2);
});

test('a link host with a label no resolver could look up is looked up as the longest suffix of it that can be, which Cloudflare blocks it by', async (t) => {
  const asked = [];
  const resolvers = spamScanner.getResolvers(client, {});
  resolvers.malware = {
    async resolve4(name) {
      asked.push(name);
      return name === 'evil.example' ? ['0.0.0.0'] : ['192.0.2.1'];
    }
  };
  const servers = ['1.1.1.2', '1.0.0.2'];
  for (const name of [
    'x!y.evil.example',
    'x,y.evil.example',
    "x'y.evil.example",
    'a{b}.evil.example',
    'x$&*+;=~y.evil.example',
    'a..evil.example',
    `${'a'.repeat(64)}.evil.example`,
    'sub.x!y.evil.example',
    'X!Y.Evil.Example.'
  ])
    t.deepEqual(
      await spamScanner.resolve4(name, servers),
      ['0.0.0.0'],
      `${name}`
    );
  t.true(asked.every((name) => name === 'evil.example'));
  // (names with "_" and in any case are looked up as they are)
  asked.length = 0;
  t.deepEqual(await spamScanner.resolve4('_dmarc.Example.NET', servers), [
    '192.0.2.1'
  ]);
  t.deepEqual(asked, ['_dmarc.example.net']);
  // a name that leaves only a public suffix, or a single label, or nothing,
  // is not asked: no such name
  asked.length = 0;
  for (const name of ['foo.com,bar.com', 'x!y.co.uk', 'x!y.example', 'a!b'])
    t.deepEqual(await spamScanner.resolve4(name, servers), [], `${name}`);
  t.deepEqual(asked, []);
});

test('out of monitor mode, a link whose lookup fails the same way every time, or that is no name, does not hold the message back', async (t) => {
  config.spamScanner.monitorOnly = false;
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  const asked = [];
  const fake = {
    async resolve4(name) {
      asked.push(name);
      if (name === 'lame.example.net')
        throw Object.assign(new Error('server failure'), {
          code: 'ESERVFAIL'
        });
      return ['192.0.2.1'];
    }
  };
  const resolvers = spamScanner.getResolvers(client, fake);
  resolvers.malware = fake;
  resolvers.family = fake;
  const raw = message([
    'From: alice@example.com',
    'To: bob@example.org',
    'Subject: links',
    '',
    'Sites: https://foo.example.com,bar.example.com and https://lame.example.net/'
  ]);
  const check = await spamScanner.checkOutbound({
    message: raw,
    stored: null,
    envelope: ENVELOPE,
    client,
    protection: LINKS
  });
  t.true(check.stored.links_complete);
  t.is(check.verdict, 'send');
  t.true(asked.includes('lame.example.net'));
  // (and "foo.example.com,bar.example.com" is looked up as "example.com")
  t.true(asked.includes('example.com'));
  t.false(asked.some((name) => name.includes(',')));
});

test('a link host with a label no lookup could answer is checked, and counts toward the hosts looked up, as the name it is looked up as', async (t) => {
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  const asked = new Set();
  const fake = (category) => ({
    async resolve4(name) {
      asked.add(name);
      return category === 'malware' && name === 'evil.example'
        ? ['0.0.0.0']
        : ['192.0.2.1'];
    }
  });
  const resolvers = spamScanner.getResolvers(client, fake('default'));
  resolvers.malware = fake('malware');
  resolvers.family = fake('family');
  // hosts, and past what Spam Scanner reads (only this check reads the whole
  // message), links whose hosts `new URL()` keeps but no resolver could look
  // up as they are (no "/" after them, which would make a link of the name
  // before it, e.g. "bar.example.com/")
  const linking = (count, links) =>
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: links',
      'Content-Type: text/html',
      '',
      Array.from(
        { length: count },
        (_, i) => `<a href="https://h${i}.example.org/">${i}</a>`
      ).join(' '),
      `<p>${'word '.repeat(50_000)}</p>`,
      ...links.map((link) => `<a href="${link}">x</a>`)
    ]);
  // ("example.com", "evil.example", and none for "co.uk": 250 hosts)
  const scan = await spamScanner.scan(
    linking(248, [
      'https://foo.example.com,bar.example.com',
      'https://a!b.evil.example',
      'https://x%2Cy.evil.example',
      'https://x,y.co.uk'
    ]),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.true(asked.has('evil.example'));
  t.true(asked.has('example.com'));
  t.false([...asked].some((name) => /[^a-z\d._-]/.test(name)));
  t.false(asked.has('co.uk'));
  t.false(scan.tooManyLinkHosts);
  t.true(scan.linksComplete);
  const blocking = spamScanner.getOutboundBlockingMessages(scan);
  t.is(blocking.length, 1);
  t.true(blocking[0].includes('evil.example'));
  // (and such a link where Spam Scanner reads it too is reported once)
  const early = await spamScanner.scan(
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: links',
      'Content-Type: text/html',
      '',
      '<a href="https://a!b.evil.example">x</a>'
    ]),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.is(spamScanner.getOutboundBlockingMessages(early).length, 1);
  // (251 hosts)
  const tooMany = await spamScanner.scan(
    linking(249, ['https://a!b.other.example', 'https://c{d}.more.example']),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.deepEqual(spamScanner.getOutboundBlockingMessages(tooMany), [
    'Message links to more than 250 different hosts, too many to check'
  ]);
});

test('a link host ending in any number of dots is looked up without them', async (t) => {
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  const asked = [];
  const fake = (category) => ({
    async resolve4(name) {
      asked.push(name);
      return category === 'malware' && name === 'dots.example'
        ? ['0.0.0.0']
        : ['192.0.2.1'];
    }
  });
  const resolvers = spamScanner.getResolvers(client, fake('default'));
  resolvers.malware = fake('malware');
  resolvers.family = fake('family');
  const servers = ['1.1.1.2', '1.0.0.2'];
  for (const name of ['dots.example.', 'dots.example...', 'DOTS.example....'])
    t.deepEqual(
      await spamScanner.resolve4(name, servers),
      ['0.0.0.0'],
      `${name}`
    );
  t.deepEqual(await spamScanner.resolve4('...', servers), []);
  // (a link to one where only this check reads it, past what Spam Scanner
  //  reads, is blocked)
  const scan = await spamScanner.scan(
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: links',
      'Content-Type: text/html',
      '',
      `<p>${'word '.repeat(50_000)}</p>`,
      '<a href="http://dots.example.../x">x</a>'
    ]),
    { client, direction: 'outbound', protection: LINKS }
  );
  const blocking = spamScanner.getOutboundBlockingMessages(scan);
  t.is(blocking.length, 1);
  t.true(blocking[0].includes('dots.example'));
});

test('a name inside a link host with characters no name has is not read as a link of its own', async (t) => {
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  const asked = new Set();
  const fake = (category) => ({
    async resolve4(name) {
      asked.add(name);
      return category === 'malware' && name.endsWith('evil.example.com')
        ? ['0.0.0.0']
        : ['192.0.2.1'];
    }
  });
  const resolvers = spamScanner.getResolvers(client, fake('default'));
  resolvers.malware = fake('malware');
  resolvers.family = fake('family');
  // (where only this check reads it, past what Spam Scanner reads; and a
  //  name in parentheses still is a link)
  const scan = await spamScanner.scan(
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: links',
      '',
      `${'word '.repeat(50_000)}`,
      'Go to https://x!y.evil.example.com/login or (fine.example.org/page)'
    ]),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.false(asked.has('y.evil.example.com'));
  t.true(asked.has('evil.example.com'));
  t.true(asked.has('fine.example.org'));
  t.is(spamScanner.getOutboundBlockingMessages(scan).length, 1);
});

test('a bare link after punctuation is read, also where only this check reads it', async (t) => {
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  const asked = new Set();
  const fake = (category) => ({
    async resolve4(name) {
      asked.add(name);
      return category === 'malware' && /^evil\d\./.test(name)
        ? ['0.0.0.0']
        : ['192.0.2.1'];
    }
  });
  const resolvers = spamScanner.getResolvers(client, fake('default'));
  resolvers.malware = fake('malware');
  resolvers.family = fake('family');
  // (a name of its own for each: answers are remembered)
  for (const [host, text] of [
    ['evil1.example.com', 'Log in at *evil1.example.com/login* today'],
    ['evil2.example.com', 'Mirror: a.example.org/x,evil2.example.com/y'],
    ['evil3.example.com', 'url=evil3.example.com/login'],
    ['evil4.example.com', '~evil4.example.com/x~'],
    // (after a link a quote ends, not only a space)
    [
      'evil5.example.com',
      'https://t.example.org/x"a.example.org/x,evil5.example.com/y'
    ],
    // (with a port, or dots after it)
    ['evil6.example.com', 'Mirror: a.example.org/x,evil6.example.com:8080/y'],
    ['evil7.example.com', 'Mirror: a.example.org/x,evil7.example.com./y'],
    // (under a top-level domain in punycode, or one of files)
    ['evil8.xn--p1ai', 'Mirror: a.example.org/x,evil8.xn--p1ai/y'],
    ['evil9.zip', 'Mirror: a.example.org/x,evil9.zip/y']
  ]) {
    // (past what Spam Scanner reads, a million characters)
    const scan = await spamScanner.scan(
      message([
        'From: alice@example.com',
        'To: bob@example.org',
        'Subject: links',
        '',
        `${'word '.repeat(210_000)}`,
        text
      ]),
      { client, direction: 'outbound', protection: LINKS }
    );
    t.true(asked.has(host), `${text}`);
    t.is(spamScanner.getOutboundBlockingMessages(scan).length, 1, `${text}`);
  }
});

test('telling the admins of a prevented message never throws, also without Redis', async (t) => {
  const sendSmtpPreventedEmail = require('#helpers/send-smtp-prevented-email');
  const { fatal } = logger;
  const fatals = [];
  logger.fatal = (...args) => fatals.push(args);
  t.teardown(() => {
    logger.fatal = fatal;
  });
  let asked = 0;
  const options = {
    Domains: {
      async getToAndMajorityLocaleByDomain() {
        asked++;
        throw new Error('no admins');
      }
    },
    domain: { id: 'domain-id', name: 'example.com' },
    category: 'virus',
    response: 'Message blocked by Spam Scanner',
    email: { envelope: { from: 'alice@example.com', to: ['bob@example.org'] } }
  };
  // (no client, or no domain: nothing is sent, and no key is taken)
  await t.notThrowsAsync(sendSmtpPreventedEmail({ ...options }));
  const keys = [];
  for (const domain of [undefined, null, {}])
    await t.notThrowsAsync(
      sendSmtpPreventedEmail({
        ...options,
        domain,
        client: {
          async set(key) {
            keys.push(key);
            return 'OK';
          }
        }
      })
    );
  t.deepEqual(keys, []);
  t.is(asked, 0);
  t.is(fatals.length, 0);
  // (a client that fails without a way to remove its key)
  await t.notThrowsAsync(
    sendSmtpPreventedEmail({
      ...options,
      client: {
        async set() {
          throw new Error('down');
        }
      }
    })
  );
  // (and one whose key is removed when the email is not sent)
  const removed = [];
  await t.notThrowsAsync(
    sendSmtpPreventedEmail({
      ...options,
      client: {
        async set() {
          return 'OK';
        },
        async del(key) {
          removed.push(key);
          throw new Error('down');
        }
      }
    })
  );
  t.deepEqual(removed, ['smtp_prevented:domain-id']);
  t.is(fatals.length, 2);
});

test('outbound blocking keeps the types blocked before, and blocks by content type and programs by content too', async (t) => {
  captureSpamScannerLog(t);
  const outbound = async (raw) =>
    spamScanner.getOutboundBlockingMessages(
      await spamScanner.scan(raw, {
        direction: 'outbound',
        client,
        enforce: true
      })
    );
  // (as attachments: the types blocked before)
  for (const filename of [
    'settings.reg',
    'help.hlp',
    'shortcut.scf',
    'macro.vba'
  ]) {
    const messages = await outbound(withAttachment(filename, 'content'));
    t.true(messages.length > 0, `${filename}`);
  }

  // (not its certificates, databases and source files)
  for (const filename of [
    'server.crt',
    'data.mdb',
    'Main.class',
    'index.php'
  ]) {
    const messages = await outbound(withAttachment(filename, 'content'));
    t.deepEqual(messages, [], `${filename}`);
  }

  // (in an archive: only the types Gmail blocks there)
  t.deepEqual(
    await outbound(
      withAttachment(
        'site.zip',
        zipOf([
          ['index.php', 'x'],
          ['Main.class', 'y']
        ])
      )
    ),
    []
  );
  // (a program's content type, whatever its name)
  const typed = message([
    'From: alice@example.com',
    'To: bob@example.org',
    'Subject: Files',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="b"',
    '',
    '--b',
    'Content-Type: text/plain',
    '',
    'Here you go.',
    '--b',
    'Content-Type: application/x-msdownload; name="notes.txt"',
    'Content-Disposition: attachment; filename="notes.txt"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from('plain text').toString('base64'),
    '--b--',
    ''
  ]);
  t.deepEqual(await outbound(typed), [
    'Attachment "notes.txt" has a content type that is not allowed (application/x-msdownload)'
  ]);
  // (only programs' content types: not audio/adpcm, which mime-types maps to
  //  the .adp extension)
  t.deepEqual(
    await outbound(
      Buffer.from(
        typed
          .toString()
          .replace('application/x-msdownload', 'audio/adpcm')
          .replaceAll('notes.txt', 'sound.wav')
      )
    ),
    []
  );
  // (a program, whatever it is named: also as a script or a temporary file;
  //  a script itself is not blocked)
  const program = windowsProgram();
  for (const filename of ['run.py', 'notes.tmp', 'cert.cer']) {
    const messages = await outbound(withAttachment(filename, program));
    t.true(
      messages.some((message) =>
        message.startsWith(`Attachment "${filename}" contains a program (exe)`)
      ),
      `${filename}`
    );
  }

  t.deepEqual(await outbound(withAttachment('run.py', 'print(1)')), []);
  // (one message for a program named as one)
  const named = await outbound(withAttachment('setup.exe', program));
  t.is(named.length, 1);
  // (text that starts with "MZ" is not a program)
  for (const [filename, content] of [
    ['notes.txt', 'MZ Holdings invoice for October'],
    ['countries.csv', 'MZ,Mozambique\nNA,Namibia'],
    ['tiny.py', 'MZ'],
    ['report', 'MZ\0\0'.repeat(32)]
  ])
    t.deepEqual(
      await outbound(withAttachment(filename, content)),
      [],
      `${filename}`
    );

  // (no hidden characters in a message: a right-to-left override is removed)
  const [hidden] = await outbound(
    withAttachment('invoice\u202Efdp.exe', 'content')
  );
  t.notRegex(hidden, /\p{Cf}/u);
});

test('a file name with bidirectional controls is blocked only when they hide its extension', async (t) => {
  captureSpamScannerLog(t);
  const blocked = async (filename) => {
    const scan = await spamScanner.scan(withAttachment(filename, 'x'), {
      direction: 'outbound',
      client,
      enforce: true
    });
    t.truthy(scan);
    return spamScanner.getOutboundBlockingMessages(scan).length > 0;
  };

  // (an override reverses what follows it: "invoice", U+202E, "fdp.exe")
  t.true(await blocked('invoice\u202Efdp.exe'));
  t.true(await blocked('invoice\u202Dfdp.txt'));
  // (isolates and embeddings, which mail clients put around names in
  //  right-to-left scripts, hide nothing)
  t.false(await blocked('\u2068report\u2069.pdf'));
  t.false(await blocked('\u202B\u05D3\u05D5\u05D7\u202C.pdf'));
  // (unless the name is of a type that is not allowed anyway)
  t.true(await blocked('\u2068setup\u2069.exe'));
});

test('an attached message that would take long to read is read within limits, holding up no scan', async (t) => {
  captureSpamScannerLog(t);
  config.spamScanner.outboundTimeout = 20_000;
  // (attached messages of a thousand attachments, which mailparser alone
  //  never finishes reading, and of a header of 80,000 folded lines)
  const parts = [
    'From: carol@example.net',
    'To: alice@example.com',
    'Subject: parts',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="p"',
    '',
    ...Array.from({ length: 1000 }, (_, i) => [
      '--p',
      'Content-Type: application/octet-stream',
      `Content-Disposition: attachment; filename="part-${i}.txt"`,
      '',
      'x'
    ]).flat(),
    '--p--',
    ''
  ].join('\r\n');
  const folded = [
    'From: carol@example.net',
    `X-Long: ${Array.from({ length: 80_000 }, () => 'a').join('\r\n ')}`,
    'Subject: folded',
    '',
    'Hello',
    ''
  ].join('\r\n');
  for (const attached of [parts, folded]) {
    const raw = message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: forwarded',
      'MIME-Version: 1.0',
      'Content-Type: multipart/mixed; boundary="m"',
      '',
      '--m',
      'Content-Type: text/plain',
      '',
      'See attached.',
      '--m',
      'Content-Type: message/rfc822',
      'Content-Disposition: attachment; filename="fwd.eml"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(attached)
        .toString('base64')
        .replaceAll(/.{76}/g, (line) => `${line}\r\n`),
      '--m--',
      ''
    ]);
    const started = Date.now();
    const scan = await spamScanner.scan(raw, {
      client,
      direction: 'outbound',
      enforce: true
    });
    t.truthy(scan);
    t.true(Date.now() - started < 10_000, `took ${Date.now() - started}ms`);
  }
});

test('every link host of an outbound message is checked, also in what it carries', async (t) => {
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  const asked = new Set();
  // (hosts named "bad..." are blocked as malware)
  const fake = {
    async resolve4(name) {
      asked.add(name);
      return name.startsWith('bad') ? ['0.0.0.0'] : ['192.0.2.1'];
    }
  };
  const resolvers = spamScanner.getResolvers(client, fake);
  resolvers.malware = fake;
  resolvers.family = fake;
  const raw = (html, text = 'Hello.') =>
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: links',
      'MIME-Version: 1.0',
      'Content-Type: multipart/alternative; boundary="b"',
      '',
      '--b',
      'Content-Type: text/plain',
      '',
      text,
      '--b',
      'Content-Type: text/html',
      '',
      html,
      '--b--',
      ''
    ]);
  const blocking = async (raw) => {
    const scan = await spamScanner.scan(raw, {
      client,
      direction: 'outbound',
      protection: LINKS
    });
    t.truthy(scan);
    t.true(scan.linksComplete);
    return spamScanner.getOutboundBlockingMessages(scan);
  };

  const blocked = (host) => [
    `Link hostname ${host} is blocked by Cloudflare's malware filtering as phishing or malware`
  ];
  // (an anchor never closed, which a mail client shows as a link)
  t.deepEqual(
    await blocking(raw('<a href="https://bad1.example.org/x">open</p>')),
    blocked('bad1.example.org')
  );
  // (one around long markup)
  t.deepEqual(
    await blocking(
      raw(
        `<a href="https://bad2.example.org/x"><span>${'x'.repeat(
          3000
        )}</span></a>`
      )
    ),
    blocked('bad2.example.org')
  );
  // (written with character references, or without a scheme)
  t.deepEqual(
    await blocking(
      raw('<img src="https&#58;&#x2F;/bad3.example.org/i.png"><p>hi</p>')
    ),
    blocked('bad3.example.org')
  );
  t.deepEqual(
    await blocking(raw('<a href="//bad4.example.org/x">open</a>')),
    blocked('bad4.example.org')
  );
  // (past what Spam Scanner reads of the text)
  t.deepEqual(
    await blocking(
      raw('<p>hi</p>', `${'a '.repeat(300_000)}bad5.example.org/page`)
    ),
    blocked('bad5.example.org')
  );
  // (an attribute written inside the value of another)
  t.deepEqual(
    await blocking(
      raw(`<a title="x href='" href="//bad6.example.org/p">click</a> it's`)
    ),
    blocked('bad6.example.org')
  );
  // (a character reference for the "@" of an address before the host)
  t.deepEqual(
    await blocking(
      raw('<a href="https://fine.example.org&commat;bad7.example.org/">x</a>')
    ),
    blocked('bad7.example.org')
  );
  // (a link without a scheme after other text)
  t.deepEqual(
    await blocking(
      raw('<p>hi</p>', `${'a '.repeat(60_000)}Link:bad8.example.org/x`)
    ),
    blocked('bad8.example.org')
  );
  // (a quote opened in a comment, which a browser does not read as markup,
  //  past what Spam Scanner reads)
  t.deepEqual(
    await blocking(
      raw(
        `<!--<x y='-->${'<p>x</p>'.repeat(
          30_000
        )}<a href="https:bad9.example.org?login">Sign in</a>`
      )
    ),
    blocked('bad9.example.org')
  );
  // (a control character before it, or backslashes for "//")
  t.deepEqual(
    await blocking(raw('<a href="&#1;https:bad10.example.org">x</a>')),
    blocked('bad10.example.org')
  );
  t.deepEqual(
    await blocking(
      raw('<p>x</p>'.repeat(30_000) + '<a href="\\\\bad11.example.org">x</a>')
    ),
    blocked('bad11.example.org')
  );
  // (past what Spam Scanner reads of the HTML: a quote opened in a comment
  //  and "<" or ">" in a quoted address, which a browser reads whole and
  //  goes to the host after "@"; a link of an object, a refresh or a ping;
  //  and one without its scheme in the text)
  const padding = '<p>x</p>'.repeat(300_000);
  for (const [host, html] of [
    [
      'bad13.example.org',
      `<!-- <i title=" -->${padding}<a href="https://x<y>@bad13.example.org">click</a>`
    ],
    ['bad14.example.org', `${padding}<object data="//bad14.example.org/x">`],
    [
      'bad15.example.org',
      `${padding}<meta http-equiv="refresh" content="0;url=//bad15.example.org/">`
    ],
    [
      'bad16.example.org',
      `${padding}<a ping="https://bad16.example.org/p" href="/">x</a>`
    ],
    ['bad17.example.org', `${padding}<p>see //bad17.example.org/x</p>`]
  ])
    t.deepEqual(await blocking(raw(html)), blocked(host), `${host}`);

  // (in an attached message, and in an attached HTML file, which mail
  //  clients show; and a program in an attached message, by its name)
  const mixed = (...parts) =>
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: attached',
      'MIME-Version: 1.0',
      'Content-Type: multipart/mixed; boundary="m"',
      '',
      '--m',
      'Content-Type: text/plain',
      '',
      'See attached.',
      ...parts.flatMap((part) => ['--m', ...part]),
      '--m--',
      ''
    ]);
  t.deepEqual(
    await blocking(
      mixed([
        'Content-Type: message/rfc822',
        'Content-Disposition: attachment; filename="forwarded.eml"',
        '',
        'From: carol@example.net',
        'To: alice@example.com',
        'Subject: sign in',
        'Content-Type: text/html',
        '',
        '<a href="https://bad18.example.org/login">Sign in</a>'
      ])
    ),
    blocked('bad18.example.org')
  );
  t.deepEqual(
    await blocking(
      mixed([
        'Content-Type: text/html; name="page.html"',
        'Content-Disposition: attachment; filename="page.html"',
        '',
        '<a href="https://bad19.example.org/login">Sign in</a>'
      ])
    ),
    blocked('bad19.example.org')
  );
  t.deepEqual(
    await blocking(
      mixed([
        'Content-Type: message/rfc822',
        'Content-Disposition: attachment; filename="forwarded.eml"',
        '',
        'From: carol@example.net',
        'To: alice@example.com',
        'Subject: tool',
        'MIME-Version: 1.0',
        'Content-Type: multipart/mixed; boundary="n"',
        '',
        '--n',
        'Content-Type: text/plain',
        '',
        'Here.',
        '--n',
        'Content-Type: application/octet-stream',
        'Content-Disposition: attachment; filename=".ocx"',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from('not a real control').toString('base64'),
        '--n--'
      ])
    ),
    [
      'Attachment "forwarded.eml/.ocx" is a file type that is not allowed (.ocx)'
    ]
  );

  // (no host made of the end of a word in another script, or of a link's
  //  path; past what Spam Scanner reads)
  asked.clear();
  t.deepEqual(
    await blocking(
      raw(
        '<p>hi</p>',
        `${'a '.repeat(
          60_000
        )}straße.de/angebote https://fine.example.org/x/bad12.example.org/`
      )
    ),
    []
  );
  t.false(
    [...asked].some((name) => name === 'e.de' || name.startsWith('bad12'))
  );

  // (an address in a link is no lookup that fails, and leaves the links
  //  checked; nor is "file.js/" blocked, or the namespace of an image)
  asked.clear();
  t.deepEqual(
    await blocking(
      raw(
        '<svg xmlns="http://www.w3.org/2000/svg"></svg><a href="http://[2001:db8::1]/">x</a>',
        'see file.js/ for it'
      )
    ),
    []
  );
  t.false([...asked].some((name) => name.includes('2001')));
  // (more than 250 hosts in all, past what Spam Scanner reads)
  const many = Array.from(
    { length: 251 },
    (_, i) => `https://host${i}.example.org/`
  ).join(' ');
  t.deepEqual(
    await blocking(raw('<p>hi</p>', `${'a '.repeat(60_000)}${many}`)),
    ['Message links to more than 250 different hosts, too many to check']
  );
  // (and a message written to take the reading long is read in linear time)
  const started = Date.now();
  t.truthy(
    await spamScanner.scan(
      raw(
        `<a href="//a${'.'.repeat(500_000)}x">${'<a href="'.repeat(100_000)}`,
        `http://a${')'.repeat(500_000)}x`
      ),
      { client, direction: 'outbound', protection: LINKS }
    )
  );
  t.true(Date.now() - started < 5000, `took ${Date.now() - started}ms`);

  // (and an image written into a long message is no link: its link after
  //  it is checked, and not blocked)
  const image = Buffer.alloc(2_000_000, 7).toString('base64');
  t.deepEqual(
    await blocking(
      raw(
        `<p>Hi</p><img src="data:image/png;base64,${image}"><a href="https://image.example.org/">site</a>`
      )
    ),
    []
  );
  t.true(asked.has('image.example.org'));
});

test('a blocked attachment is found among many, and names and responses are bounded', async (t) => {
  captureSpamScannerLog(t);
  const long = `${'a'.repeat(400)}.mjs`;
  const scan = await spamScanner.scan(
    withAttachments([
      ...Array.from({ length: 150 }, (_, i) => [`notes-${i}.txt`, 'text']),
      [long, 'content'],
      ...Array.from({ length: 12 }, (_, i) => [`run-${i}.lib`, 'content'])
    ]),
    { direction: 'outbound', client, enforce: true }
  );
  // one entry for each extension, with its first file's name, at most 255
  // characters long
  t.deepEqual(
    scan.attachments.map((attachment) => attachment.extension),
    ['txt', 'mjs', 'lib']
  );
  t.is(scan.attachments[1].filename, long.slice(0, 255));
  const messages = spamScanner.getOutboundBlockingMessages(scan);
  t.is(messages.length, 2);
  t.true(messages[0].includes('.mjs'));
  t.true(messages[1].includes('run-0.lib'));
  // (at most ten messages, however many findings)
  t.is(
    spamScanner.getOutboundBlockingMessages({
      findings: {
        viruses: Array.from({ length: 30 }, (_, i) => ({
          message: `virus ${i}`
        }))
      }
    }).length,
    10
  );
  // (and the response fits in an SMTP reply line, 512 octets with its code)
  const response = spamScanner.getBlockedResponse(
    Array.from({ length: 10 }, () => 'x'.repeat(500))
  );
  t.true(response.length <= 400, `${response.length}`);
  t.true(response.startsWith('Message blocked by Spam Scanner as a virus'));
  // (in octets, cut by whole characters: names in other scripts, and
  //  characters of two UTF-16 units, at any offset)
  for (const name of ['報告書', '😀', 'a😀', 'é'])
    for (let pad = 0; pad < 4; pad++) {
      const cut = spamScanner.getBlockedResponse([
        `${'x'.repeat(pad)}${name.repeat(300)}`
      ]);
      t.true(Buffer.byteLength(cut) <= 400, `${name} ${pad}`);
      t.true(cut.endsWith('...'), `${name} ${pad}`);
      t.is(Buffer.from(cut).toString(), cut, `${name} ${pad}`);
      t.true(cut.startsWith('Message blocked by Spam Scanner as a virus'));
    }

  t.is(
    spamScanner.getBlockedResponse(['GTUBE']),
    'Message blocked by Spam Scanner as a virus, malware, phishing or a program attachment: GTUBE'
  );
});

const GTUBE = message([
  'From: alice@example.com',
  'To: bob@example.org',
  'Subject: test',
  '',
  'XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X'
]);

const ENVELOPE = { from: 'alice@example.com', to: ['bob@example.org'] };

// a kept scan of the running version of Spam Scanner
const stored = (fields = {}) => ({
  version: spamScanner.getVersion(),
  score: -1,
  threshold: 5,
  reject_threshold: 15,
  is_spam: false,
  action: 'accept',
  tests: [],
  classification: 'ham',
  llm: null,
  blocking: [],
  // (made out of monitor mode, with every link host looked up)
  enforced: true,
  links_complete: true,
  scanned_at: new Date(),
  ...fields
});

test('which outbound messages are scanned', (t) => {
  const ours = config.webHost;
  t.true(spamScanner.shouldScanOutbound(ENVELOPE, 'another.example'));
  // (not mail from our own domain, whoever on it sends it: our system mail
  //  and our admins' mail; also written in another case or with a dot)
  for (const domainName of [ours, ours.toUpperCase(), `${ours}.`])
    t.false(
      spamScanner.shouldScanOutbound(
        { from: `alerts@${ours}`, to: ['bob@example.org'] },
        domainName
      ),
      `${domainName}`
    );
  // (the envelope sender alone is set by the client: another domain sending
  //  as one of ours is scanned)
  t.true(
    spamScanner.shouldScanOutbound(
      { from: config.supportEmail, to: ['bob@example.org'] },
      'another.example'
    )
  );
  // (not mail only to our own addresses: support@, abuse@, any on our
  //  domain, in any case)
  for (const to of [
    [config.abuseEmail],
    [config.abuseEmail, config.supportEmail],
    [`anyone@${ours}`],
    [`Anyone@${ours.toUpperCase()}`, config.abuseEmail]
  ])
    t.false(
      spamScanner.shouldScanOutbound(
        { from: 'alice@example.com', to },
        'another.example'
      ),
      `${to.join(', ')}`
    );
  // (with any other recipient it is: one of ours cannot be added to get past
  //  it, nor an address it cannot read; nor is a subdomain of ours ours)
  for (const to of [
    [config.abuseEmail, 'bob@example.org'],
    [`anyone@${ours}`, 'not an address'],
    [`anyone@sub.${ours}`],
    [`anyone@${ours}.example`],
    [ours],
    // (an SRS address of ours relays to an outside sender)
    [`SRS0=HHH=TT=example.org=bob@${ours}`],
    [`srs1=xxx=example.net==HHH=TT=example.org=bob@${ours}`],
    // (routing reads the domain after the first "@")
    [`bob@example.org@${ours}`]
  ])
    t.true(
      spamScanner.shouldScanOutbound(
        { from: 'alice@example.com', to },
        'another.example'
      ),
      `${to.join(', ')}`
    );
  // (support@ and abuse@ only on our domain, whatever they are set to)
  const { abuseEmail, supportEmail } = config;
  config.abuseEmail = 'abuse@another.example';
  config.supportEmail = 'support@another.example';
  t.teardown(() => {
    config.abuseEmail = abuseEmail;
    config.supportEmail = supportEmail;
  });
  for (const address of ['abuse@another.example', 'support@another.example'])
    t.true(
      spamScanner.shouldScanOutbound(
        { from: 'alice@example.com', to: [address] },
        'another.example'
      ),
      `${address}`
    );
  t.false(
    spamScanner.shouldScanOutbound(
      { from: 'alice@example.com', to: [`abuse@${ours}`] },
      'another.example'
    )
  );
  // (nor does a missing or odd envelope sender skip it)
  t.true(
    spamScanner.shouldScanOutbound(
      { from: '', to: ['bob@example.org'] },
      'another.example'
    )
  );
  t.false(
    spamScanner.shouldScanOutbound({ from: 'alice@example.com', to: [] }, 'x')
  );
  t.false(spamScanner.shouldScanOutbound(null, 'x'));
});

test('which inbound messages are scanned', (t) => {
  const ours = config.webHost;
  const rcpt = (...addresses) => ({
    envelope: { rcptTo: addresses.map((address) => ({ address })) }
  });
  t.true(spamScanner.shouldScanInbound(rcpt('bob@example.org')));
  t.true(spamScanner.shouldScanInbound({}));
  // (not mail only to our own addresses)
  t.false(spamScanner.shouldScanInbound(rcpt(config.abuseEmail)));
  t.false(
    spamScanner.shouldScanInbound(
      rcpt(`anyone@${ours.toUpperCase()}`, config.supportEmail)
    )
  );
  t.true(
    spamScanner.shouldScanInbound(rcpt(config.abuseEmail, 'bob@example.org'))
  );

  // (nor mail from our own domain with its passing, aligned DKIM signature)
  const signed = (signingDomain, fromRoot = ours, result = 'pass') => ({
    ...rcpt('bob@example.org'),
    originalFromAddressRootDomain: fromRoot,
    alignedDKIMResults: [{ signingDomain, status: { result } }]
  });
  t.false(spamScanner.shouldScanInbound(signed(ours)));
  // (a subdomain signing, where WEB_HOST is a registrable domain)
  if (ours.includes('.'))
    t.false(spamScanner.shouldScanInbound(signed(`mail.${ours}`)));
  // (a From address of ours alone, or signed by another domain, or a failing
  //  signature, is scanned)
  t.true(
    spamScanner.shouldScanInbound({
      ...rcpt('bob@example.org'),
      originalFromAddressRootDomain: ours,
      alignedDKIMResults: []
    })
  );
  t.true(spamScanner.shouldScanInbound(signed('another.example')));
  t.true(spamScanner.shouldScanInbound(signed(ours, 'another.example')));
  t.true(spamScanner.shouldScanInbound(signed(ours, ours, 'fail')));
  // (nor mail we forwarded with its From rewritten to our no-reply address)
  t.true(
    spamScanner.shouldScanInbound({
      ...signed(ours),
      originalFromAddress: config.friendlyFromEmail.toUpperCase()
    })
  );
  // (an SRS address of ours as the only recipient is not ours)
  t.true(
    spamScanner.shouldScanInbound(rcpt(`SRS0=HHH=TT=example.org=bob@${ours}`))
  );
});

test('an outbound verdict is kept with the email, and a kept one is used as it is sent', async (t) => {
  captureSpamScannerLog(t);
  let scans = 0;
  const { run } = spamScanner.getPool();
  spamScanner.getPool().run = (...args) => {
    scans++;
    return run.apply(spamScanner.getPool(), args);
  };

  // (what is kept: no message content, at most 50 tests)
  const summary = await spamScanner.scan(GTUBE, {
    direction: 'outbound',
    client,
    enforce: true
  });
  const kept = spamScanner.toStored(summary);
  t.is(kept.version, spamScanner.getVersion());
  t.true(kept.blocking.length > 0);
  t.false(JSON.stringify(kept).includes('XJS*C4JDBQADN1'));
  t.is(spamScanner.toStored(null), null);
  t.true(spamScanner.isCurrent(kept));
  // (of any version: what blocks it was checked when it was submitted)
  t.true(spamScanner.isCurrent({ ...kept, version: '0.0.0' }));
  t.false(spamScanner.isCurrent({ ...kept, blocking: undefined }));
  t.false(spamScanner.isCurrent(null));
  scans = 0;

  // a kept verdict: not scanned again
  const send = await spamScanner.checkOutbound({
    message: GTUBE,
    stored: stored(),
    envelope: ENVELOPE,
    client
  });
  t.is(send.verdict, 'send');
  t.false(send.scanned);
  t.is(scans, 0);

  // none kept (e.g. mail this server made, not checked then): scanned now,
  // and blocked
  const block = await spamScanner.checkOutbound({
    message: GTUBE,
    stored: null,
    envelope: ENVELOPE,
    client
  });
  t.is(block.verdict, 'block');
  t.true(block.scanned);
  t.is(scans, 1);
  t.regex(block.response, /virus, malware/);
  t.true(block.stored.blocking.length > 0);

  // one of another version: used, not scanned again
  scans = 0;
  const older = await spamScanner.checkOutbound({
    message: GTUBE,
    stored: stored({ version: '0.0.1' }),
    envelope: ENVELOPE,
    client
  });
  t.is(older.verdict, 'send');
  t.is(scans, 0);
});

test('outbound spam is rejected as it is sent only outside both monitor modes, at the reject threshold, with an error bounces read as spam or a virus', async (t) => {
  const spam = stored({ score: 16, is_spam: true, action: 'reject' });
  // (in monitor mode nothing is acted on, even with outbound spam rejection
  //  turned on)
  config.spamScanner.outboundMonitorOnly = false;
  const monitored = await spamScanner.checkOutbound({
    message: HAM,
    stored: spam,
    envelope: ENVELOPE,
    client
  });
  t.is(monitored.verdict, 'spam');
  t.false(monitored.enforced);
  const block = await spamScanner.checkOutbound({
    message: HAM,
    stored: stored({ blocking: ['GTUBE'] }),
    envelope: ENVELOPE,
    client
  });
  t.is(block.verdict, 'block');
  t.false(block.enforced);

  // (out of monitor mode: blocked, but spam only out of outbound monitor
  //  mode too)
  config.spamScanner.monitorOnly = false;
  config.spamScanner.outboundMonitorOnly = true;
  const enforcedBlock = await spamScanner.checkOutbound({
    message: HAM,
    stored: stored({ blocking: ['GTUBE'] }),
    envelope: ENVELOPE,
    client
  });
  t.true(enforcedBlock.enforced);
  const inbound = await spamScanner.checkOutbound({
    message: HAM,
    stored: spam,
    envelope: ENVELOPE,
    client
  });
  t.is(inbound.verdict, 'spam');
  t.false(inbound.enforced);

  config.spamScanner.outboundMonitorOnly = false;
  // (below the reject threshold, where inbound spam is only filed as spam:
  //  sent)
  const tagged = await spamScanner.checkOutbound({
    message: HAM,
    stored: stored({ score: 9.5, is_spam: true, action: 'tag' }),
    envelope: ENVELOPE,
    client
  });
  t.is(tagged.verdict, 'send');

  const check = await spamScanner.checkOutbound({
    message: HAM,
    stored: spam,
    envelope: ENVELOPE,
    client
  });
  t.is(check.verdict, 'spam');
  t.true(check.enforced);
  t.false(check.scanned);
  const err = spamScanner.createRejection(check, 'bob@example.org');
  t.is(err.responseCode, 550);
  t.is(err.recipient, 'bob@example.org');
  t.true(err.is_spam_scanner);
  t.is(err.message, 'Message rejected as spam by Spam Scanner');
  t.is(err.response, undefined);
  t.is(getBounceInfo(err).category, 'spam');
  t.is(getErrorCode(err), 550);

  const blocked = spamScanner.createRejection(
    {
      verdict: 'block',
      response:
        'Message blocked by Spam Scanner as a virus, malware, phishing or a program attachment: Attachment "a.exe" is a file type that is not allowed (.exe)'
    },
    'bob@example.org'
  );
  t.is(getBounceInfo(blocked).category, 'virus');
  t.is(getErrorCode(blocked), 554);
});

test('a kept verdict on a close call is checked again with the language model as it is sent, once', async (t) => {
  captureSpamScannerLog(t);
  const { url, requests } = await ollama(t, {
    verdicts: { phishing: 0.95, ham: 0.05 }
  });
  await spamScanner.reset();
  t.true(await useModel({ url, model: 'test-model', timeout: 1000 }));

  // (only where its verdict could lift the score to the reject threshold,
  //  15: from 9; and not again once asked)
  t.false(spamScanner.needsLanguageModel(stored({ score: 3 })));
  t.false(spamScanner.needsLanguageModel(stored({ score: 8.9 })));
  t.true(spamScanner.needsLanguageModel(stored({ score: 9 })));
  t.true(spamScanner.needsLanguageModel(stored({ score: 14.9 })));
  t.false(spamScanner.needsLanguageModel(stored({ score: 15 })));
  t.false(
    spamScanner.needsLanguageModel(
      stored({ score: 12, llm: { verdict: null, error: true } })
    )
  );

  const check = await spamScanner.checkOutbound({
    message: PHISHING,
    stored: stored({ score: 12 }),
    envelope: ENVELOPE,
    client
  });
  t.true(check.scanned);
  t.is(requests.length, 1);
  t.is(check.stored.llm.verdict, 'phishing');
  t.false(spamScanner.needsLanguageModel(check.stored));

  // (outbound mail as it is submitted: without the language model)
  await spamScanner.scan(PHISHING, {
    direction: 'outbound',
    client,
    enforce: true
  });
  t.is(requests.length, 1);

  // (with Spam Scanner turned off, or without a language model: the kept
  //  verdict is used)
  config.spamScanner.enabled = false;
  t.false(spamScanner.needsLanguageModel(stored({ score: 12 })));
  config.spamScanner.enabled = true;
  config.spamScanner.llm.url = '';
  t.false(spamScanner.needsLanguageModel(stored({ score: 12 })));
});

test('an outbound message that cannot be scanned as it is sent keeps its kept verdict, or is unchecked', async (t) => {
  spamScanner.getPool().run = async () => {
    throw new Error('boom');
  };

  captureSpamScannerLog(t);
  const kept = stored({ score: 12 });
  // (a language model to ask, so it is scanned again, which fails)
  await readyModel(t);
  const check = await spamScanner.checkOutbound({
    message: HAM,
    stored: kept,
    envelope: ENVELOPE,
    client
  });
  t.is(check.verdict, 'send');
  t.false(check.scanned);
  t.is(check.stored, kept);
  const unchecked = await spamScanner.checkOutbound({
    message: HAM,
    stored: null,
    envelope: ENVELOPE,
    client
  });
  t.is(unchecked.verdict, 'unchecked');
});

test('scans as mail is sent wait for a worker before their time limit starts, out of monitor mode one time limit, in it an inbound one', async (t) => {
  config.spamScanner.monitorOnly = false;
  config.spamScanner.outboundTimeout = 2000;
  // (one worker: a scan starts once the one before it is done, and takes
  //  800ms; the second waits 800ms, then scans for 800ms, 1.6s in all)
  let busy = Promise.resolve();
  let duration = 800;
  spamScanner.getPool().run = (task, { signal }) => {
    const turn = busy.then(
      () =>
        new Promise((resolve, reject) => {
          signal.addEventListener('abort', () => reject(new Error('aborted')));
          task.port.postMessage({ started: true });
          timers.setTimeout(
            () => resolve({ isSpam: false, score: 0 }),
            duration
          );
        })
    );
    busy = turn.catch(() => {});
    return turn;
  };

  const checks = await Promise.all(
    [1, 2].map(() =>
      spamScanner.checkOutbound({
        message: HAM,
        stored: null,
        envelope: ENVELOPE,
        client
      })
    )
  );
  // (both scanned: neither waited out its time limit in the queue)
  t.deepEqual(
    checks.map((check) => check.verdict),
    ['send', 'send']
  );

  // (one that would wait longer than a scan's time limit gets none:
  //  unchecked; with scans of 1.5s, the third would wait 3s, past 2.4s)
  config.spamScanner.outboundTimeout = 2400;
  duration = 1500;
  const waited = await Promise.all(
    [1, 2, 3].map(() =>
      spamScanner.checkOutbound({
        message: HAM,
        stored: null,
        envelope: ENVELOPE,
        client
      })
    )
  );
  t.deepEqual(
    waited.map((check) => check.verdict),
    ['send', 'send', 'unchecked']
  );

  // (in monitor mode, where it is only logged: the inbound time limit, here
  //  1.5s, for waiting and for the scan)
  config.spamScanner.monitorOnly = true;
  config.spamScanner.timeout = 1500;
  duration = 600;
  const started = Date.now();
  const monitored = await Promise.all(
    [1, 2].map(() =>
      spamScanner.checkOutbound({
        message: HAM,
        stored: null,
        envelope: ENVELOPE,
        client
      })
    )
  );
  t.deepEqual(
    monitored.map((check) => check.verdict),
    ['send', 'send']
  );
  duration = 3000;
  const slow = await spamScanner.checkOutbound({
    message: HAM,
    stored: null,
    envelope: ENVELOPE,
    client
  });
  t.is(slow.verdict, 'unchecked');
  t.true(Date.now() - started < 8000);
});

test('a scan its caller stops is stopped at its time limit, and one no longer waited for keeps its send slot', async (t) => {
  captureSpamScannerLog(t);
  const warnings = captureSpamScannerWarnings(t);
  config.spamScanner.timeout = 600;
  config.spamScanner.threads = 1;
  let running = 0;
  let most = 0;
  const stopped = [];
  // a worker that starts at once and takes `duration`
  let duration = 5000;
  spamScanner.getPool().run = (task, { signal }) =>
    new Promise((resolve, reject) => {
      const started = Date.now();
      running++;
      most = Math.max(most, running);
      const timer = timers.setTimeout(() => {
        running--;
        resolve({ isSpam: false, score: 0 });
      }, duration);
      signal.addEventListener('abort', () => {
        timers.clearTimeout(timer);
        running--;
        stopped.push(Date.now() - started);
        // (a worker takes a moment to stop)
        timers.setTimeout(() => reject(new Error('aborted')), 300);
      });
      task.port.postMessage({ started: true });
    });

  // (stopped by its caller once it runs: not let run three time limits)
  const controller = new AbortController();
  const scanning = spamScanner.scan(HAM, { client, signal: controller.signal });
  await setTimeout(100);
  controller.abort();
  t.is(await scanning, null);
  const until = Date.now() + 3000;
  while (stopped.length === 0 && Date.now() < until) await setTimeout(50);
  t.is(stopped.length, 1);
  t.true(stopped[0] < 1200, `stopped after ${stopped[0]}ms`);
  // (and not reported as not finished in time: its caller stopped it)
  await setTimeout(200);
  t.false(warnings.some(([message]) => /did not finish/.test(String(message))));

  // (in monitor mode, a scan as mail is sent that is no longer waited for
  //  keeps its slot until it is done: the next waits, and gets none; one
  //  that only logs, not one that refuses mail queued unchecked for what
  //  blocks it, see `blocksAsSent`)
  config.spamScanner.outboundBlock = false;
  duration = 1500;
  const first = spamScanner.checkOutbound({
    message: HAM,
    stored: null,
    envelope: ENVELOPE,
    client
  });
  await setTimeout(100);
  const second = await spamScanner.checkOutbound({
    message: HAM,
    stored: null,
    envelope: ENVELOPE,
    client
  });
  t.is(second.verdict, 'unchecked');
  const firstCheck = await first;
  t.is(firstCheck.verdict, 'unchecked');
  t.is(most, 1);
});

test('in monitor mode, mail queued unchecked waits for a send slot as long as out of it, so a burst of it is sent, not deferred', async (t) => {
  captureSpamScannerLog(t);
  config.spamScanner.timeout = 800;
  config.spamScanner.outboundTimeout = 3000;
  config.spamScanner.threads = 1;
  // a worker that takes 600ms, within a scan's time limit
  spamScanner.getPool().run = (task) =>
    new Promise((resolve) => {
      task.port.postMessage({ started: true });
      timers.setTimeout(() => resolve({ isSpam: false, score: 0 }), 600);
    });
  // (the third waits for two scans, past SPAM_SCANNER_TIMEOUT)
  const checks = await Promise.all(
    [0, 1, 2].map(() =>
      spamScanner.checkOutbound({
        message: HAM,
        stored: { ...spamScanner.UNCHECKED },
        envelope: ENVELOPE,
        client
      })
    )
  );
  t.deepEqual(
    checks.map((check) => check.verdict === 'unchecked'),
    [false, false, false]
  );
});

test('no more scans wait to send than the queue holds, and the language model is not asked once a check took a time limit', async (t) => {
  captureSpamScannerLog(t);
  config.spamScanner.monitorOnly = false;
  config.spamScanner.threads = 1;
  config.spamScanner.outboundTimeout = 1500;
  await readyModel(t);
  // a worker that takes 900ms; a phishing message scores a close call
  const asked = [];
  spamScanner.getPool().run = (task, { signal }) =>
    new Promise((resolve, reject) => {
      if (task.llm) asked.push(task);
      const timer = timers.setTimeout(
        () =>
          resolve({
            version: spamScanner.getVersion(),
            isSpam: false,
            score: Buffer.from(task.raw).includes('paypa1') ? 12 : 0,
            threshold: 5,
            rejectThreshold: 15
          }),
        900
      );
      signal.addEventListener('abort', () => {
        timers.clearTimeout(timer);
        reject(new Error('aborted'));
      });
      task.port.postMessage({ started: true });
    });
  const check = (message) =>
    spamScanner.checkOutbound({
      message,
      stored: null,
      envelope: ENVELOPE,
      client
    });

  // (one scans, one waits, and a third, beyond the queue of one, gets none
  //  at once, though it could wait for its turn within its time limit)
  config.spamScanner.maxQueue = 1;
  config.spamScanner.outboundTimeout = 3000;
  const started = Date.now();
  const pair = Promise.all([check(HAM), check(HAM)]);
  const third = check(HAM).then((check) => [check, Date.now() - started]);
  const checks = await pair;
  t.deepEqual(
    checks.map((check) => check.verdict),
    ['send', 'send']
  );
  const [refused, waited] = await third;
  t.is(refused.verdict, 'unchecked');
  t.true(waited < 500, `waited ${waited}ms`);
  config.spamScanner.outboundTimeout = 1500;

  // (a close call that waited 900ms and took 900ms is not asked again)
  config.spamScanner.maxQueue = 50;
  const [, close] = await Promise.all([check(HAM), check(PHISHING)]);
  t.is(close.verdict, 'send');
  t.is(close.stored.score, 12);
  t.is(asked.length, 0);
});

test('warnings name the domains of the recipients, not their addresses', async (t) => {
  const warnings = captureSpamScannerWarnings(t);
  // (busy: every scan is skipped)
  config.spamScanner.maxQueue = 0;
  t.is(await spamScanner.scan(HAM, { session, client }), null);
  t.is(warnings.length, 1);
  const [message, meta] = warnings[0];
  t.regex(message, /busy/);
  t.deepEqual(meta.rcpt_to_domains, ['example.org']);
  t.is(meta.session, undefined);
  t.false(JSON.stringify(meta).includes('bob@example.org'));
  // (a value cut short leaves no half of a character, e.g. of an emoji)
  t.is(printable('ab\u{1F600}', 3), 'ab');
});

test('a scan again with the language model keeps the link checks of the scan before it', async (t) => {
  captureSpamScannerLog(t);
  config.spamScanner.monitorOnly = false;
  await readyModel(t);
  const failing = {
    async resolve4() {
      throw Object.assign(new Error('timeout'), { code: 'ETIMEOUT' });
    }
  };
  const resolvers = spamScanner.getResolvers(client, failing);
  resolvers.malware = failing;
  resolvers.family = failing;
  // (a worker whose scan asks about a link host, whose lookup fails)
  spamScanner.getPool().run = (task) =>
    new Promise((resolve) => {
      task.port.on('message', () => resolve({ isSpam: false, score: 12 }));
      task.port.postMessage({ started: true });
      task.port.postMessage({ id: 1, name: 'link.example.org' });
    });

  const kept = stored({ score: 12 });
  t.true(spamScanner.needsLanguageModel(kept));
  const check = await spamScanner.checkOutbound({
    message: HAM,
    stored: kept,
    envelope: ENVELOPE,
    client
  });
  t.true(check.scanned);
  t.is(check.verdict, 'send');
  t.true(check.stored.links_complete);

  // (without a scan before it that looked them all up, it is held back)
  const unchecked = await spamScanner.checkOutbound({
    message: HAM,
    stored: stored({ score: 12, links_complete: false }),
    envelope: ENVELOPE,
    client
  });
  t.is(unchecked.verdict, 'unchecked');
});

test('outbound results are logged with what would happen out of monitor mode, the sender, From and subject', async (t) => {
  const lines = captureSpamScannerLog(t);
  let score = 16;
  spamScanner.getPool().run = async () => ({
    isSpam: true,
    score,
    threshold: 5,
    rejectThreshold: 15,
    tests: [{ name: 'BAYES_99', score }],
    message: { from: 'alice@example.com', subject: 'Your code is 482913' },
    findings: {}
  });
  const outbound = {
    direction: 'outbound',
    client,
    session: { envelope: { mailFrom: { address: 'bounce@example.com' } } }
  };
  await spamScanner.scan(HAM, outbound);
  score = 8;
  await spamScanner.scan(HAM, outbound);
  t.is(lines.length, 2);
  t.true(lines[0].startsWith('[SPAM_SCANNER] would reject as spam {'));
  t.true(lines[1].startsWith('[SPAM_SCANNER] would mark as spam {'));
  const [rejected, marked] = lines.map((line) =>
    JSON.parse(line.slice(line.indexOf('{')))
  );
  t.true(rejected.would_reject);
  t.false(marked.would_reject);
  t.true(rejected.monitor_only);
  t.is(rejected.mail_from, 'bounce@example.com');
  t.is(rejected.from, 'alice@example.com');
  t.is(rejected.subject, 'Your code is [redacted]');
  t.deepEqual(rejected.tests, ['BAYES_99=16']);
  t.deepEqual(rejected.blocking, []);
  // (where it was scanned: by default its direction)
  t.is(rejected.stage, 'outbound');
});

test('mail without a kept verdict is scanned as it is sent without the language model, and again with it only on a close call', async (t) => {
  captureSpamScannerLog(t);
  await readyModel(t);
  const asked = [];
  let score = 3;
  let findings = {};
  spamScanner.getPool().run = async (task) => {
    asked.push(task.llm);
    return {
      isSpam: false,
      score: task.llm ? score + 6 : score,
      threshold: 5,
      rejectThreshold: 15,
      tests: [],
      findings,
      ...(task.llm ? { llm: { verdict: 'spam', confidence: 0.9 } } : {})
    };
  };

  const check = () =>
    spamScanner.checkOutbound({
      message: HAM,
      stored: null,
      envelope: ENVELOPE,
      client
    });

  // (far from the reject threshold: once, without it)
  const far = await check();
  t.is(far.verdict, 'send');
  t.true(far.scanned);
  t.is(far.stored.score, 3);
  t.deepEqual(asked, [false]);

  // (a close call: again with it)
  asked.length = 0;
  score = 10;
  const close = await check();
  t.deepEqual(asked, [false, true]);
  t.is(close.stored.score, 16);
  t.is(close.stored.llm.verdict, 'spam');
  t.true(close.scanned);

  // (a message to block: once, without it)
  asked.length = 0;
  findings = { arbitrary: [{ name: 'GTUBE', message: 'GTUBE' }] };
  const blocked = await check();
  t.is(blocked.verdict, 'block');
  t.deepEqual(asked, [false]);

  // (nor for a kept verdict that blocks it)
  asked.length = 0;
  const kept = await spamScanner.checkOutbound({
    message: HAM,
    stored: stored({ score: 10, blocking: ['GTUBE'] }),
    envelope: ENVELOPE,
    client
  });
  t.is(kept.verdict, 'block');
  t.false(kept.scanned);
  t.deepEqual(asked, []);
});

//
// A language model server that answers like Ollama with the probability of
// each verdict for the first token
//
async function ollama(t, { verdicts, delay = 0, port = 0, loaded = true }) {
  const requests = [];
  const checks = [];
  const server = http.createServer(async (req, res) => {
    // (whether it is ready, see `checkLanguageModel`: the models it has
    //  loaded)
    if (req.method === 'GET' && req.url === '/api/ps') {
      checks.push(Date.now());
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          models: loaded
            ? [{ name: 'test-model:latest', model: 'test-model:latest' }]
            : []
        })
      );
      return;
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    requests.push({
      url: req.url,
      authorization: req.headers.authorization,
      body: JSON.parse(Buffer.concat(chunks).toString())
    });
    if (delay) await setTimeout(delay);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        model: 'test-model',
        message: { role: 'assistant', content: Object.keys(verdicts)[0] },
        logprobs: [
          {
            token: Object.keys(verdicts)[0],
            logprob: Math.log(Object.values(verdicts)[0]),
            top_logprobs: Object.entries(verdicts).map(([token, p]) => ({
              token,
              logprob: Math.log(p)
            }))
          }
        ],
        done: true
      })
    );
  });
  server.listen(port, '127.0.0.1');
  await once(server, 'listening');
  t.teardown(() => server.close());
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    requests,
    checks,
    server
  };
}

// (the language model set, once Ollama says it is ready, see
//  `checkLanguageModel`)
async function useModel(settings) {
  Object.assign(config.spamScanner.llm, settings);
  return spamScanner.checkLanguageModel();
}

// (a language model that is ready, for scans that do not reach it)
async function readyModel(t) {
  const { url } = await ollama(t, { verdicts: { ham: 1 } });
  t.true(await useModel({ url, model: 'test-model' }));
}

test('the language model is asked about close calls and its verdict goes into a header', async (t) => {
  const { url, requests } = await ollama(t, {
    verdicts: { phishing: 0.95, ham: 0.05 }
  });
  t.true(
    await useModel({
      url,
      model: 'test-model',
      mode: 'always',
      timeout: 1000
    })
  );
  captureSpamScannerLog(t);

  const scan = await spamScanner.scan(HAM, { session, client });
  t.is(requests.length, 1);
  t.is(requests[0].url, '/api/chat');
  t.is(requests[0].body.model, 'test-model');
  t.is(requests[0].body.keep_alive, '-1m');
  // (Ollama on this server needs no API key)
  t.is(requests[0].authorization, undefined);
  t.is(scan.llm.verdict, 'phishing');
  t.is(scan.llm.model, 'test-model');
  t.true(scan.tests.some((item) => item.name.startsWith('LLM_')));

  const headers = Object.fromEntries(spamScanner.getHeaders(scan));
  t.regex(
    headers['X-Spam-Scanner-LLM'],
    /^verdict=phishing; confidence=0\.9\d; model=test-model; time=\d+ms$/
  );
});

test('a language model that is too slow is cut off and the scan goes on', async (t) => {
  const { url } = await ollama(t, {
    verdicts: { spam: 0.9, ham: 0.1 },
    delay: 3000
  });
  t.true(
    await useModel({
      url,
      model: 'test-model',
      mode: 'always',
      timeout: 300
    })
  );
  captureSpamScannerLog(t);

  const started = Date.now();
  const scan = await spamScanner.scan(HAM, { session, client });
  t.true(Date.now() - started < 2500);
  t.truthy(scan);
  t.false(scan.isSpam);
  t.truthy(scan.llm.error);
  t.regex(
    Object.fromEntries(spamScanner.getHeaders(scan))['X-Spam-Scanner-LLM'],
    /error=yes/
  );
});

test('the language model is Ollama on this server, unless turned off', (t) => {
  // (none in tests, unless set)
  t.is(config.spamScanner.llm.url, '');
  t.is(spamScanner.getLlmConfig(), null);
  config.spamScanner.llm.url = 'http://127.0.0.1:11436';
  const llm = spamScanner.getLlmConfig();
  t.is(llm.baseUrl, 'http://127.0.0.1:11436');
  t.false('apiKey' in llm);
  t.is(llm.model, 'spamscanner');
  t.is(llm.maxInputChars, 1500);
  t.is(llm.timeout, 3000);
  // (a message never leaves this server, so nothing is removed from it)
  t.false(llm.redact);
  // (off, in any case)
  config.spamScanner.llm.mode = 'OFF';
  t.is(spamScanner.getLlmConfig(), null);
  config.spamScanner.llm.mode = 'false';
  t.is(spamScanner.getLlmConfig(), null);
  // ("always" in any case, and anything else "auto")
  config.spamScanner.llm.mode = 'ALWAYS';
  t.is(spamScanner.getLlmConfig().mode, 'always');
  config.spamScanner.llm.mode = 'alwasy';
  t.is(spamScanner.getLlmConfig().mode, 'auto');
  // ("localhost" is 127.0.0.1, where Ollama listens, not ::1)
  config.spamScanner.llm.mode = 'auto';
  for (const [url, expected] of [
    ['http://localhost:11436', 'http://127.0.0.1:11436'],
    ['http://LocalHost:11436/', 'http://127.0.0.1:11436/'],
    ['http://localhost:11436/api', 'http://127.0.0.1:11436/api']
  ]) {
    config.spamScanner.llm.url = url;
    t.is(spamScanner.getLlmConfig().baseUrl, expected, `${url}`);
    t.false(spamScanner.getLlmConfig().redact, `${url}`);
  }

  // (another server, with an API key: personal data is removed)
  Object.assign(config.spamScanner.llm, {
    mode: 'auto',
    url: 'https://llm.example.com',
    apiKey: 'test-key'
  });
  const remote = spamScanner.getLlmConfig();
  t.is(remote.apiKey, 'test-key');
  t.true(remote.redact);
});

test('a misconfigured language model does not stop scanning', async (t) => {
  Object.assign(config.spamScanner.llm, {
    url: 'http://127.0.0.1:1',
    apiKey: 'test-key',
    provider: 'no-such-provider'
  });
  captureSpamScannerLog(t);
  const scan = await spamScanner.scan(PHISHING, { session, client });
  t.truthy(scan);
  t.true(scan.isSpam);
  t.regex(scan.llm.error, /provider/i);
});

test('personal data is removed before a message goes to a model on another machine', (t) => {
  Object.assign(config.spamScanner.llm, {
    url: 'http://192.0.2.5:11434',
    apiKey: 'test-key'
  });
  t.true(spamScanner.getLlmConfig().redact);
  Object.assign(config.spamScanner.llm, { url: 'http://127.0.0.1:11434' });
  t.false(spamScanner.getLlmConfig().redact);
  Object.assign(config.spamScanner.llm, { redact: true });
  t.true(spamScanner.getLlmConfig().redact);
});

test('messages in any language are scanned, and no language is penalized', async (t) => {
  captureSpamScannerLog(t);
  const texts = {
    ja: '明日の会議は午後三時に変更になりました。資料は共有フォルダに置いてあります。よろしくお願いします。',
    zh: '明天的会议改到下午三点。资料已经放在共享文件夹里了，请提前看一下。谢谢。',
    ar: 'تم تغيير موعد اجتماع الغد إلى الساعة الثالثة بعد الظهر. المستندات موجودة في المجلد المشترك.',
    ru: 'Завтрашняя встреча перенесена на три часа дня. Документы лежат в общей папке.',
    he: 'הפגישה של מחר נדחתה לשעה שלוש אחר הצהריים. המסמכים נמצאים בתיקייה המשותפת.',
    th: 'การประชุมพรุ่งนี้เลื่อนเป็นบ่ายสามโมง เอกสารอยู่ในโฟลเดอร์ที่แชร์ไว้แล้ว',
    de: 'Das Meeting morgen wurde auf 15 Uhr verschoben. Die Unterlagen liegen im gemeinsamen Ordner.'
  };
  for (const [code, text] of Object.entries(texts)) {
    const scan = await spamScanner.scan(
      Buffer.from(
        [
          'From: Alice <alice@example.com>',
          'To: bob@example.org',
          'Subject: =?UTF-8?B?' +
            Buffer.from(text.slice(0, 12)).toString('base64') +
            '?=',
          'Message-ID: <lang@example.com>',
          'Date: Sun, 11 Oct 2026 10:00:00 +0000',
          'MIME-Version: 1.0',
          'Content-Type: text/plain; charset=utf-8',
          'Content-Transfer-Encoding: base64',
          '',
          Buffer.from(text).toString('base64')
        ].join('\r\n')
      ),
      { client }
    );
    t.truthy(scan, `${code} scanned`);
    t.false(
      scan.tests.some((item) => item.name === 'LANGUAGE_NOT_ALLOWED'),
      `${code} allowed`
    );
    t.false(scan.isSpam, `${code}: ${JSON.stringify(scan.tests)}`);
  }
});

test('a language model that cannot be reached is not asked again for a while, nor as mail is sent, and said so once', async (t) => {
  captureSpamScannerLog(t);
  const warnings = captureSpamScannerWarnings(t);
  // (Ollama ready, but its model never answering in time)
  const { url, requests } = await ollama(t, {
    verdicts: { ham: 0.9, spam: 0.1 },
    delay: 20_000
  });
  t.true(
    await useModel({
      url,
      model: 'test-model',
      mode: 'always',
      timeout: 3000
    })
  );
  // (a worker that has scanned before)
  t.truthy(await spamScanner.scan(HAM, { session, client, llm: false }));

  // the first scan waits for it, its whole time limit
  let started = Date.now();
  const first = await spamScanner.scan(HAM, { session, client });
  t.true(Date.now() - started >= 2900, `took ${Date.now() - started}ms`);
  t.regex(first.llm.error, /timed out/);
  t.is(requests.length, 1);
  t.true(spamScanner.isLlmPaused());

  // the next ones do not (nor are they asked of it as mail is sent)
  started = Date.now();
  const next = await spamScanner.scan(HAM, { session, client });
  t.true(Date.now() - started < 1500, `took ${Date.now() - started}ms`);
  t.truthy(next);
  t.is(next.llm, null);
  t.is(requests.length, 1);
  t.false(spamScanner.needsLanguageModel(stored({ score: 12 })));

  // (said once, with how many times it failed)
  const said = warnings.filter(([message]) =>
    /could not reach the language model/.test(String(message))
  );
  t.is(said.length, 1);
  t.is(said[0][1].failures, 1);

  // 30s later it is asked again (once Ollama says it is ready again); still
  // not answering, not for 60s more
  t.true(await later(31_000, () => spamScanner.checkLanguageModel()));
  const again = await later(31_000, () =>
    spamScanner.scan(HAM, { session, client })
  );
  t.regex(again.llm.error, /timed out/);
  t.is(requests.length, 2);
  t.true(await later(31_000 + 59_000, () => spamScanner.isLlmPaused()));
  t.true(await later(31_000 + 61_000, () => spamScanner.checkLanguageModel()));
  t.false(await later(31_000 + 61_000, () => spamScanner.isLlmPaused()));
  // (and said no more often than every 10 minutes)
  t.is(
    warnings.filter(([message]) =>
      /could not reach the language model/.test(String(message))
    ).length,
    1
  );

  // one that answers ends the pause at once (and the next is 30s again)
  const { url: answering } = await ollama(t, {
    verdicts: { ham: 0.9, spam: 0.1 }
  });
  await spamScanner.reset();
  t.true(await useModel({ url: answering }));
  t.false(spamScanner.isLlmPaused());
  const answered = await spamScanner.scan(HAM, { session, client });
  t.is(answered.llm.verdict, 'ham');
});

test('a language model that answers with a server error, or is missing the model, is not asked again for a while; one that answers is', async (t) => {
  captureSpamScannerLog(t);
  let status = 404;
  let asked = 0;
  const server = http.createServer((req, res) => {
    // (Ollama ready, see `checkLanguageModel`, but its model failing)
    if (req.url === '/api/ps') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"models":[{"name":"test-model:latest"}]}');
      return;
    }

    asked++;
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end('{"error":"model \\"test-model\\" not found"}');
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.teardown(() => server.close());
  const settings = {
    url: `http://127.0.0.1:${server.address().port}`,
    model: 'test-model',
    mode: 'always',
    timeout: 1000
  };
  for (status of [404, 503]) {
    await spamScanner.reset();
    t.true(await useModel(settings));
    asked = 0;
    const first = await spamScanner.scan(HAM, { session, client });
    t.regex(first.llm.error, new RegExp(`HTTP ${status}`));
    await spamScanner.scan(HAM, { session, client });
    t.is(asked, 1, `${status}`);
  }

  // (an error that is no failure to reach it, e.g. an answer it could not
  //  read, does not pause it)
  status = 200;
  await spamScanner.reset();
  t.true(await useModel(settings));
  asked = 0;
  await spamScanner.scan(HAM, { session, client });
  const first = asked;
  t.true(first > 0);
  await spamScanner.scan(HAM, { session, client });
  t.true(asked > first);
  t.false(spamScanner.isLlmPaused());
});

test('a language model that is not running (nothing listening, e.g. before Ollama is installed) is never waited for, and said once until it is ready', async (t) => {
  captureSpamScannerLog(t);
  const warnings = captureSpamScannerWarnings(t);
  // (a port nothing listens on)
  const closed = net.createServer();
  closed.listen(0, '127.0.0.1');
  await once(closed, 'listening');
  const { port } = closed.address();
  await new Promise((resolve) => {
    closed.close(resolve);
  });
  t.false(
    await useModel({
      url: `http://127.0.0.1:${port}`,
      model: 'test-model',
      mode: 'always',
      timeout: 3000
    })
  );
  const said = () =>
    warnings.filter(([message]) =>
      /language model is not ready/.test(String(message))
    );
  t.true(spamScanner.isLlmPaused());
  t.is(said().length, 1);
  t.is(said()[0][1].reason, 'econnrefused');

  // scans go on without it, at once, nor is it asked as mail is sent
  let started = Date.now();
  const first = await spamScanner.scan(HAM, { session, client });
  t.true(Date.now() - started < 2500, `took ${Date.now() - started}ms`);
  t.is(first.llm, null);
  t.false(spamScanner.needsLanguageModel(stored({ score: 12 })));

  // (checked again a minute later, in the background, and not said again
  //  however long it is down)
  t.false(await later(61_000, () => spamScanner.checkLanguageModel()));
  started = Date.now();
  const again = await later(2 * 61_000, () =>
    spamScanner.scan(HAM, { session, client })
  );
  t.true(Date.now() - started < 2500, `took ${Date.now() - started}ms`);
  t.is(again.llm, null);
  t.is(said().length, 1);
  t.false(
    warnings.some(([message]) =>
      /could not reach the language model/.test(String(message))
    )
  );

  // once it is ready (started on that port), it is asked
  const { requests, server } = await ollama(t, {
    verdicts: { ham: 0.9, spam: 0.1 },
    port
  });
  t.true(await later(3 * 61_000, () => spamScanner.checkLanguageModel()));
  const answered = await spamScanner.scan(HAM, { session, client });
  t.is(answered.llm.verdict, 'ham');
  t.is(requests.length, 1);

  // and its going away again is said again
  server.closeAllConnections();
  await new Promise((resolve) => {
    server.close(resolve);
  });
  // (no more often than every 10 minutes)
  t.false(await later(4 * 61_000, () => spamScanner.checkLanguageModel()));
  t.is(said().length, 1);
  t.false(await later(11 * 60_000, () => spamScanner.checkLanguageModel()));
  t.is(said().length, 2);
});

test('a check that fails once Ollama was ready is made again in 15s, not a minute, and its going and coming back is said every 10 minutes at most', async (t) => {
  captureSpamScannerLog(t);
  const warnings = captureSpamScannerWarnings(t);
  let failing = false;
  let checks = 0;
  const server = http.createServer((req, res) => {
    checks++;
    res.writeHead(failing ? 503 : 200, { 'Content-Type': 'application/json' });
    res.end('{"models":[{"name":"test-model:latest"}]}');
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.teardown(() => server.close());
  t.true(
    await useModel({
      url: `http://127.0.0.1:${server.address().port}`,
      model: 'test-model'
    })
  );
  const said = () =>
    warnings.filter(([message]) =>
      /language model is not ready/.test(String(message))
    ).length;
  // (going, coming back and going again within 10 minutes: said once)
  for (const [ahead, ready] of [
    [16_000, false],
    [32_000, true],
    [48_000, false]
  ]) {
    failing = !ready;
    t.is(await later(ahead, () => spamScanner.checkLanguageModel()), ready);
  }

  t.is(said(), 1);
  // not ready, but ready before: checked again 15s later, not a minute
  failing = false;
  const made = checks;
  t.true(await later(48_000 + 14_000, () => spamScanner.isLlmPaused()));
  t.is(checks, made);
  t.true(await later(48_000 + 16_000, () => spamScanner.isLlmPaused()));
  await pWait(() => checks > made);
  await later(48_000 + 16_000, () => spamScanner.checkLanguageModel());
  t.false(await later(48_000 + 17_000, () => spamScanner.isLlmPaused()));
});

test('a language model on another machine is not checked, and asked as it answers', async (t) => {
  Object.assign(config.spamScanner.llm, {
    url: 'http://192.0.2.5:11434',
    model: 'test-model'
  });
  t.false(spamScanner.isLlmPaused());
  t.true(await spamScanner.checkLanguageModel());
});

test('a model Ollama has not loaded, or an Ollama that does not answer its check in time, is not asked', async (t) => {
  captureSpamScannerLog(t);
  const warnings = captureSpamScannerWarnings(t);
  const { url, requests } = await ollama(t, {
    verdicts: { ham: 0.9, spam: 0.1 },
    loaded: false
  });
  t.false(await useModel({ url, model: 'test-model', mode: 'always' }));
  const scan = await spamScanner.scan(HAM, { session, client });
  t.is(scan.llm, null);
  t.is(requests.length, 0);
  t.is(
    warnings.find(([message]) =>
      /language model is not ready/.test(String(message))
    )[1].reason,
    'model not loaded'
  );

  // (a model of another name loaded is not it; "name:latest" is "name")
  const other = await ollama(t, { verdicts: {} });
  t.true(await useModel({ url: other.url }));
  config.spamScanner.llm.model = 'other-model';
  t.false(await spamScanner.checkLanguageModel());

  // (one that takes connections and never answers: its check gives up
  //  within two seconds, and no scan waits for it)
  const hung = await hungModel(t);
  const started = Date.now();
  t.false(await useModel({ url: hung.url, model: 'test-model' }));
  t.true(Date.now() - started < 3000, `took ${Date.now() - started}ms`);
  t.true(spamScanner.isLlmPaused());
});

// a language model server that takes connections and never answers (e.g.
// Ollama installed but stuck)
async function hungModel(t) {
  const connections = [];
  const server = net.createServer((socket) => {
    connections.push(socket);
    socket.on('error', () => {});
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.teardown(() => {
    for (const socket of connections) socket.destroy();
    server.close();
  });
  return { url: `http://127.0.0.1:${server.address().port}`, connections };
}

test('starting the workers checks whether the language model is ready, and asks it nothing', async (t) => {
  captureSpamScannerLog(t);
  const { url, requests, checks } = await ollama(t, {
    verdicts: { ham: 0.9, spam: 0.1 }
  });
  Object.assign(config.spamScanner.llm, {
    url,
    model: 'test-model',
    mode: 'always',
    timeout: 3000
  });
  // (not checked yet: not said to be paused, e.g. in the stats)
  t.false(spamScanner.isLlmPaused({ check: false }));
  spamScanner.warm();
  // (after the warm-up scan, on the same worker)
  t.truthy(await spamScanner.scan(HAM, { session, client, llm: false }));
  t.is(requests.length, 0);
  await pWait(() => checks.length > 0);
  t.is(checks.length, 1);
  t.false(spamScanner.isLlmPaused({ check: false }));
});

test('a lookup that failed is not asked again for a minute, but lookups of other names failing never leave the links of other messages unchecked', async (t) => {
  config.spamScanner.cloudflare = true;
  captureSpamScannerLog(t);
  const asked = [];
  let code = 'ETIMEOUT';
  // (names of a sender's own, whose lookups it can make time out, and a
  //  malware host)
  const malware = {
    async resolve4(name) {
      asked.push(name);
      if (name.endsWith('slow.example'))
        throw Object.assign(new Error(code), { code });
      return name === 'evil.example' ? ['0.0.0.0'] : ['192.0.2.1'];
    }
  };
  const answering = {
    async resolve4() {
      return ['192.0.2.1'];
    }
  };
  const resolvers = spamScanner.getResolvers(client, answering);
  resolvers.malware = malware;
  resolvers.family = answering;
  const linking = (...hosts) =>
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: links',
      'Content-Type: text/html',
      '',
      hosts.map((host) => `<a href="https://${host}/">${host}</a>`).join(' ')
    ]);

  // three lookups that time out at once
  const first = await spamScanner.scan(
    linking('a.slow.example', 'b.slow.example', 'c.slow.example'),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.false(first.linksComplete);
  t.is(asked.length, 3);
  // another message is still checked in full, and its malware link found
  const other = await spamScanner.scan(
    linking('evil.example', 'fine.example.org'),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.true(other.linksComplete);
  t.true(asked.includes('evil.example'));
  t.true(asked.includes('fine.example.org'));
  t.is(spamScanner.getOutboundBlockingMessages(other).length, 1);
  // a name that failed is not asked again for a minute
  const count = asked.length;
  const again = await spamScanner.scan(linking('a.slow.example'), {
    client,
    direction: 'outbound',
    protection: LINKS
  });
  t.false(again.linksComplete);
  t.is(asked.length, count);

  // a minute later it is asked again
  await later(61_000, () =>
    spamScanner.scan(linking('a.slow.example'), {
      client,
      direction: 'outbound',
      protection: LINKS
    })
  );
  t.is(asked.length, count + 1);

  // names that do not exist are answers, and not remembered as failures
  await spamScanner.reset();
  spamScanner.getResolvers(client, answering).malware = malware;
  spamScanner.getResolvers(client, answering).family = answering;
  code = 'ENOTFOUND';
  asked.length = 0;
  const missing = await spamScanner.scan(linking('d.slow.example'), {
    client,
    direction: 'outbound',
    protection: LINKS
  });
  t.true(missing.linksComplete);
  const twice = await spamScanner.scan(linking('d.slow.example'), {
    client,
    direction: 'outbound',
    protection: LINKS
  });
  t.true(twice.linksComplete);
});

test('the warnings for messages not scanned are logged once a minute at most, with how many there were', async (t) => {
  captureSpamScannerLog(t);
  const warnings = captureSpamScannerWarnings(t);
  const pool = spamScanner.getPool();
  Object.defineProperty(pool, 'queueSize', {
    value: config.spamScanner.maxQueue,
    configurable: true
  });
  const busy = () =>
    warnings.filter(([message]) => /skipped a message \(busy\)/.test(message));
  for (let i = 0; i < 5; i++)
    t.is(await spamScanner.scan(HAM, { session, client }), null);
  t.is(busy().length, 1);
  t.is(busy()[0][1].count, 1);

  await later(61_000, () => spamScanner.scan(HAM, { session, client }));
  t.is(busy().length, 2);
  t.is(busy()[1][1].count, 5);
});

test('errors are written with console.error, with where they were thrown, once a minute for each error; warnings with console.warn', async (t) => {
  const warnings = captureSpamScannerWarnings(t);
  config.spamScanner.maxSize = 10;
  // (a message too large for a scan that only logs: a warning)
  t.is(
    await spamScanner.scan(message(['Subject: big', '', 'x'.repeat(100)]), {
      stage: 'received'
    }),
    null
  );
  config.spamScanner.maxSize = DEFAULTS.maxSize;

  let error = 'boom';
  spamScanner.getPool().run = async () => {
    throw new Error(error);
  };

  const small = message(['Subject: hi', '', 'hi']);
  t.is(await spamScanner.scan(small, { stage: 'received' }), null);
  // (the same error again within a minute: counted, not written)
  t.is(await spamScanner.scan(small, { stage: 'received' }), null);
  // (another error: written, so one error does not hide another)
  error = 'bang';
  t.is(await spamScanner.scan(small, { stage: 'received' }), null);

  t.deepEqual(
    warnings.map(([text, fields, level]) => [text, fields.error, level]),
    [
      ['spam scanner skipped a large message', undefined, 'warn'],
      ['spam scanner failed', 'boom', 'error'],
      ['spam scanner failed', 'bang', 'error']
    ]
  );
  const [, [, boom]] = warnings;
  t.true(Array.isArray(boom.error_stack) && boom.error_stack.length > 0);
  t.true(boom.error_stack.every((frame) => frame.startsWith('at ')));
  t.true(typeof boom.time === 'number' && boom.time >= 0);

  // (an error of more than one line: only its first line, without codes,
  //  addresses or links, and frames, not the lines after it)
  error =
    'bad header\nFrom: bob@example.com https://example.net/a?b=c\n  at notaframe';
  warnings.length = 0;
  t.is(await spamScanner.scan(small, { stage: 'received' }), null);
  t.is(warnings.length, 1);
  const [[, multi]] = warnings;
  t.false(JSON.stringify(multi).includes('bob@'));
  t.false(JSON.stringify(multi).includes('b=c'));
  t.true(multi.error_stack.length > 0);
  t.true(multi.error_stack.every((frame) => /^at \S/.test(frame)));
  t.false(multi.error_stack.includes('at notaframe'));

  // (all of them counted, also the one not written)
  const stats = captureSpamScannerStats(t);
  spamScanner.flushStats();
  t.is(stats.length, 1);
  t.like(stats[0], {
    errors: 4,
    warnings: 1,
    received: { failed: 4, skipped_size: 1 }
  });
  t.is(stats[0].received.scanned, undefined);
});

test('a stats line is written each SPAM_SCANNER_STATS_INTERVAL while there is anything to say, with each scan’s timings', async (t) => {
  const stats = captureSpamScannerStats(t);
  config.spamScanner.statsInterval = 300;
  config.spamScanner.timeout = 30_000;
  const scanned = await spamScanner.scan(
    message([
      'From: sender@example.com',
      'To: bob@example.net',
      'Subject: Lunch',
      '',
      'Lunch at noon?'
    ]),
    { stage: 'submitted', direction: 'outbound' }
  );
  t.truthy(scanned);
  t.true(scanned.time >= scanned.run && scanned.run > 0);
  t.true(scanned.wait >= 0);

  // (no line before the interval, then one on its own)
  t.is(stats.length, 0);
  await setTimeout(450);
  t.is(stats.length, 1);
  const [line] = stats;
  t.true(line.period_ms >= 250);
  t.like(line, {
    threads: 1,
    queue: 0,
    monitor_only: true,
    submitted: { scanned: 1 }
  });
  t.is(line.submitted.time_ms.count, 1);
  t.is(line.submitted.time_ms.max, scanned.time);
  t.is(line.submitted.run_ms.max, scanned.run);
  t.is(line.submitted.wait_ms.max, scanned.wait);

  // (nothing more counted: no line)
  await setTimeout(450);
  t.is(stats.length, 1);
});

test('a scan stopped by its caller, or that waited past its time limit, is counted as such', async (t) => {
  const stats = captureSpamScannerStats(t);
  const controller = new AbortController();
  controller.abort();
  t.is(
    await spamScanner.scan(message(['Subject: a', '', 'a']), {
      stage: 'received',
      signal: controller.signal
    }),
    null
  );
  // (a worker that got it past its time limit makes no scan)
  spamScanner.getPool().run = async () => null;
  t.is(
    await spamScanner.scan(message(['Subject: b', '', 'b']), {
      stage: 'received'
    }),
    null
  );
  // (one a worker never started by its time limit, and stopped later: counted
  //  as expired too, not as timed out)
  config.spamScanner.timeout = 200;
  spamScanner.getPool().run = (task, { signal }) =>
    new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('aborted')));
    });
  t.is(
    await spamScanner.scan(message(['Subject: c', '', 'c']), {
      stage: 'received'
    }),
    null
  );
  // (stopped after as long as a scan may run at most, see `HARD_LIMIT`)
  await setTimeout(1200);
  spamScanner.flushStats();
  t.like(stats[0], { received: { stopped: 1, expired: 2 } });
  t.is(stats[0].received.timed_out, undefined);
});

test('the stats keep at most so many timings, a sample of all of them, with the average and slowest of every one', (t) => {
  const stats = createStats();
  t.true(stats.isEmpty());
  // (an outcome it does not know is not counted)
  stats.record('received', 'eaten', { time: 5 });
  t.true(stats.isEmpty());

  const count = createStats.MAX_SAMPLES * 5;
  for (let i = 1; i <= count; i++)
    stats.record('received', 'scanned', { time: i, run: i, wait: 0 });
  // (any other stage as "other")
  stats.record('elsewhere', 'scanned', { time: 1, llm: 7 });
  stats.record('received', 'scanned', { time: -1, run: Number.NaN });

  const line = stats.take();
  t.is(line.received.scanned, count + 1);
  t.like(line.received.time_ms, {
    count,
    avg: Math.round((count + 1) / 2),
    max: count
  });
  // (the percentiles of a uniform sample: near those of them all)
  t.true(Math.abs(line.received.time_ms.p50 - count / 2) < count * 0.06);
  t.true(Math.abs(line.received.time_ms.p95 - count * 0.95) < count * 0.03);
  t.true(line.received.time_ms.p99 <= count);
  t.is(line.received.wait_ms.max, 0);
  t.is(line.received.llm_ms, undefined);
  t.like(line.other, { scanned: 1, llm_ms: { count: 1, p50: 7, max: 7 } });
  t.true(stats.isEmpty());
  t.deepEqual(Object.keys(stats.take()).sort(), [
    'errors',
    'period_ms',
    'warnings'
  ]);
});

test('the stats percentiles are the nearest rank', (t) => {
  const stats = createStats();
  for (let i = 1; i <= 100; i++)
    stats.record('sending', 'scanned', { time: i });
  t.like(stats.take().sending.time_ms, {
    count: 100,
    avg: 51,
    p50: 50,
    p95: 95,
    p99: 99,
    max: 100
  });
});

test('inbound mail is picked for a scan by SPAM_SCANNER_MX_PERCENT, and one left out is counted', (t) => {
  const stats = captureSpamScannerStats(t);
  const picks = (percent, value) => {
    config.spamScanner.mxPercent = percent;
    return spamScanner.isSampledInbound(() => value);
  };

  t.false(picks(0, 0));
  t.true(picks(100, 0.999_999));
  t.true(picks(10, 0.099));
  t.false(picks(10, 0.1));
  t.true(picks(0.5, 0.004));
  t.false(picks(0.5, 0.005));
  spamScanner.flushStats();
  t.is(stats[0].received.not_sampled, 3);

  // (with Spam Scanner off nothing is counted)
  config.spamScanner.enabled = false;
  t.false(picks(0, 0));
  spamScanner.flushStats();
  t.is(stats.length, 1);
});

test('names with no "/" after them, wrapped links, every name of an attachment and attached HTML of any encoding are checked outbound', async (t) => {
  config.spamScanner.cloudflare = true;
  config.spamScanner.outboundTimeout = 20_000;
  captureSpamScannerLog(t);
  const asked = new Set();
  const fake = {
    async resolve4(name) {
      asked.add(name);
      return name.startsWith('bad') ? ['0.0.0.0'] : ['192.0.2.1'];
    }
  };
  const resolvers = spamScanner.getResolvers(client, fake);
  resolvers.malware = fake;
  resolvers.family = fake;
  const scanText = (text) =>
    spamScanner.scan(
      message([
        'From: alice@example.com',
        'To: bob@example.org',
        'Subject: links',
        '',
        text
      ]),
      { client, direction: 'outbound', protection: LINKS }
    );
  for (const [host, text] of [
    ['bad10.example.com', 'Visit bad10.example.com today'],
    ['bad11.example.com', 'Go to bad11.example.com?ref=1 now'],
    ['bad12.example.com', 'See bad12.example.com#top'],
    ['bad13.example.com', 'Open bad13.example.com:8080 now'],
    ['bad14.example.com', 'Read it at bad14.example.com.'],
    // (the link a gateway wraps, as a mail client shows it)
    [
      'bad15.example.com',
      `https://nam01.safelinks.protection.outlook.com/?url=${encodeURIComponent(
        'https://bad15.example.com/x'
      )}&data=1`
    ],
    [
      'bad16.example.com',
      'https://urldefense.com/v3/__https://bad16.example.com/a__;!!x'
    ]
  ]) {
    const scan = await scanText(text);
    t.true(asked.has(host), `${text}`);
    t.is(spamScanner.getOutboundBlockingMessages(scan).length, 1, `${text}`);
  }

  // (not an address's domain, nor a file name)
  const addresses = await scanText(
    'Write to bob@bad17.example.com, see index.js and report.pdf'
  );
  t.false(asked.has('bad17.example.com'));
  t.deepEqual(spamScanner.getOutboundBlockingMessages(addresses), []);

  const multipart = (part) =>
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: attached',
      'MIME-Version: 1.0',
      'Content-Type: multipart/mixed; boundary="b"',
      '',
      '--b',
      'Content-Type: text/plain',
      '',
      'Hello.',
      '--b',
      ...part,
      '--b--',
      ''
    ]);
  // (a script named only by Content-Type, a mail client may show)
  const named = await spamScanner.scan(
    multipart([
      'Content-Type: text/plain; name="update.vbs"',
      'Content-Disposition: attachment; filename="notes.txt"',
      '',
      'MsgBox 1'
    ]),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.true(
    spamScanner
      .getOutboundBlockingMessages(named)
      .some((text) => text.includes('update.vbs'))
  );
  // (HTML in UTF-16, as a browser reads it by its byte order mark, and SVG)
  const utf16 = Buffer.concat([
    Buffer.from([0xff, 0xfe]),
    Buffer.from('<a href="https://bad18.example.com/">open</a>', 'utf16le')
  ]).toString('base64');
  const scan16 = await spamScanner.scan(
    multipart([
      'Content-Type: text/html; name="page.html"',
      'Content-Disposition: attachment; filename="page.html"',
      'Content-Transfer-Encoding: base64',
      '',
      utf16
    ]),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.true(asked.has('bad18.example.com'));
  t.is(spamScanner.getOutboundBlockingMessages(scan16).length, 1);
  const svg = await spamScanner.scan(
    multipart([
      'Content-Type: image/svg+xml; name="logo.svg"',
      'Content-Disposition: attachment; filename="logo.svg"',
      '',
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="https://bad19.example.com/"><text>x</text></a></svg>'
    ]),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.true(asked.has('bad19.example.com'));
  t.is(spamScanner.getOutboundBlockingMessages(svg).length, 1);
  // (UTF-16 by its charset, without a byte order mark)
  const scanCharset = await spamScanner.scan(
    multipart([
      'Content-Type: text/html; charset=utf-16le; name="page.html"',
      'Content-Disposition: attachment; filename="page.html"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(
        '<a href="https://bad21.example.com/">open</a>',
        'utf16le'
      ).toString('base64')
    ]),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.true(asked.has('bad21.example.com'));
  t.is(spamScanner.getOutboundBlockingMessages(scanCharset).length, 1);

  // (a link that runs across where HTML is cut to be read, a megabyte at a
  //  time, with no space or "<" near the cut, a link of its own in it)
  // (past what Spam Scanner itself reads of HTML, 2 million characters)
  const filler = 'a '.repeat(Math.floor((3 * 1024 * 1024 - 70_000) / 2));
  const across = await spamScanner.scan(
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: long',
      'MIME-Version: 1.0',
      'Content-Type: text/html',
      '',
      `<p>${filler}https://bad22.example.com/${'p'.repeat(
        60_000
      )}?u=https://good.example.org/${'q'.repeat(20_000)} end</p>`
    ]),
    { client, direction: 'outbound', protection: LINKS }
  );
  t.true(asked.has('bad22.example.com'));
  t.is(spamScanner.getOutboundBlockingMessages(across).length, 1);
});

test('outbound, links a mail client or browser shows from documents held in others, UTF-16 by any label, message/global and text attachments are checked', async (t) => {
  config.spamScanner.cloudflare = true;
  config.spamScanner.outboundTimeout = 20_000;
  captureSpamScannerLog(t);
  const asked = new Set();
  const fake = {
    async resolve4(name) {
      asked.add(name);
      return name.startsWith('bad') ? ['0.0.0.0'] : ['192.0.2.1'];
    }
  };
  const resolvers = spamScanner.getResolvers(client, fake);
  resolvers.malware = fake;
  resolvers.family = fake;
  const multipart = (part) =>
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: attached',
      'MIME-Version: 1.0',
      'Content-Type: multipart/mixed; boundary="b"',
      '',
      '--b',
      'Content-Type: text/plain',
      '',
      'Hello.',
      '--b',
      ...part,
      '--b--',
      ''
    ]);
  const html = (body, type = 'text/html') =>
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: page',
      'MIME-Version: 1.0',
      `Content-Type: ${type}`,
      '',
      body
    ]);
  const scan = (raw) =>
    spamScanner.scan(raw, { client, direction: 'outbound', protection: LINKS });
  const blocked = async (host, raw, label) => {
    const result = await scan(raw);
    t.true(asked.has(host), `${label}`);
    t.true(
      spamScanner.getOutboundBlockingMessages(result).length > 0,
      `${label}`
    );
  };

  // (an iframe's srcdoc, its own references decoded again, and a data: URL)
  await blocked(
    'bad30.example.com',
    html(
      `<iframe srcdoc="<a href='&amp;#104;ttps://bad30.example.com/x'>open</a>"></iframe>`
    ),
    'srcdoc'
  );
  await blocked(
    'bad31.example.com',
    html(
      `<iframe src="data:text/html;base64,${Buffer.from(
        '<a href="https://bad31.example.com/">x</a>'
      ).toString('base64')}"></iframe>`
    ),
    'data: base64'
  );
  await blocked(
    'bad32.example.com',
    html(
      '<object data="data:image/svg+xml,%3Csvg%3E%3Ca%20href%3D%22https%3A%2F%2Fbad32.example.com%2F%22%3Ex%3C%2Fa%3E%3C%2Fsvg%3E"></object>'
    ),
    'data: escaped'
  );
  // (a body in UTF-16 by a label mailparser does not know, which mail
  //  clients and browsers read as UTF-16)
  await blocked(
    'bad33.example.com',
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: page',
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=unicode',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(
        '<a href="https://bad33.example.com/">open</a>',
        'utf16le'
      ).toString('base64')
    ]),
    'charset=unicode body'
  );
  await blocked(
    'bad34.example.com',
    multipart([
      'Content-Type: text/html; charset=ucs-2; name="page.html"',
      'Content-Disposition: attachment; filename="page.html"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(
        '<a href="https://bad34.example.com/">open</a>',
        'utf16le'
      ).toString('base64')
    ]),
    'charset=ucs-2 attachment'
  );
  // (an attached message/global, a text file, HTML named only by its
  //  Content-Type and XHTML as XML)
  await blocked(
    'bad35.example.com',
    multipart([
      'Content-Type: message/global',
      '',
      'From: c@example.com',
      'Subject: inner',
      'Content-Type: text/html',
      '',
      '<a href="https://bad35.example.com/">open</a>'
    ]),
    'message/global'
  );
  await blocked(
    'bad36.example.com',
    multipart([
      'Content-Type: text/plain; name="notes.txt"',
      'Content-Disposition: attachment; filename="notes.txt"',
      '',
      'Open https://bad36.example.com/x'
    ]),
    'text attachment'
  );
  await blocked(
    'bad37.example.com',
    multipart([
      'Content-Type: application/octet-stream; name="page.html"',
      'Content-Disposition: attachment; filename="page.dat"',
      '',
      '<a href="//bad37.example.com/x">open</a>'
    ]),
    'HTML by its Content-Type name'
  );
  await blocked(
    'bad38.example.com',
    multipart([
      'Content-Type: text/xml; name="page.xml"',
      'Content-Disposition: attachment; filename="page.xml"',
      '',
      '<html xmlns="http://www.w3.org/1999/xhtml"><a href="//bad38.example.com/x">open</a></html>'
    ]),
    'XHTML as XML'
  );

  // (an invitation's or a contact card's URL field)
  await blocked(
    'bad43.example.com',
    multipart([
      'Content-Type: text/calendar; method=REQUEST; name="invite.ics"',
      'Content-Disposition: attachment; filename="invite.ics"',
      '',
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'URL:https://bad43.example.com/join',
      // (a folded line, as calendar programs unfold it)
      'DESCRIPTION:Join at htt',
      ' ps://bad45.example.com/join',
      // (and one after an escaped line break, on a line of its own there)
      'LOCATION:https://good.example.org/a\\nhttps://bad46.example.com/x',
      'END:VEVENT',
      'END:VCALENDAR'
    ]),
    'calendar URL'
  );
  t.true(asked.has('bad45.example.com'));
  t.true(asked.has('bad46.example.com'));
  // (a subject as an attached message's name, its colon followed by a
  //  space: not read as a stream name, so not "Booking.com" a program)
  const subject = await scan(
    multipart([
      'Content-Type: message/rfc822; name="Booking.com: Your reservation.eml"',
      'Content-Disposition: attachment; filename="Booking.com: Your reservation.eml"',
      '',
      'From: c@example.com',
      'Subject: Your reservation',
      '',
      'See you soon.'
    ])
  );
  t.deepEqual(spamScanner.getOutboundBlockingMessages(subject), []);
  // (nor another stream name: a stream of an empty file, nothing to run)
  for (const filename of ['Amazon.com:Order.pdf', 'run.bat:x.txt']) {
    const other = await scan(
      multipart([
        `Content-Type: application/pdf; name="${filename}"`,
        `Content-Disposition: attachment; filename="${filename}"`,
        '',
        '%PDF-1.4'
      ])
    );
    t.deepEqual(
      spamScanner.getOutboundBlockingMessages(other),
      [],
      `${filename}`
    );
  }

  await blocked(
    'bad44.example.com',
    multipart([
      'Content-Type: text/vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      '',
      'BEGIN:VCARD',
      'URL:https://bad44.example.com/',
      'END:VCARD'
    ]),
    'vCard URL'
  );
  // (a vCard 2.1 value in quoted-printable, with a soft line break)
  await blocked(
    'bad47.example.com',
    multipart([
      'Content-Type: text/x-vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      '',
      'BEGIN:VCARD',
      'VERSION:2.1',
      'URL;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:https://bad47=2Eexam=',
      'ple.com/',
      'END:VCARD'
    ]),
    'vCard quoted-printable URL'
  );
  // (with white space around its parameters, and other characters in its
  //  value, as a reader decodes it)
  await blocked(
    'bad48.example.com',
    multipart([
      'Content-Type: text/x-vcard; charset=utf-8; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      '',
      'BEGIN:VCARD',
      'VERSION:2.1',
      'URL; ENCODING = QUOTED-PRINTABLE:https://bad48=2Eexample.com/?x=\u2603',
      'END:VCARD'
    ]),
    'vCard quoted-printable URL with white space'
  );
  // (a quoted parameter value with a colon, a soft line break with white
  //  space after it, and a charset other than UTF-8)
  await blocked(
    'bad54.example.com',
    multipart([
      'Content-Type: text/x-vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      '',
      'BEGIN:VCARD',
      'URL;X-A="a:b";ENCODING="QUOTED-PRINTABLE":https://bad54=2Eexa=  ',
      'mple.com/',
      'END:VCARD'
    ]),
    'vCard quoted parameter'
  );
  await blocked(
    domainToASCII('bad50.b\u00E1d.example.com'),
    multipart([
      'Content-Type: text/x-vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      '',
      'BEGIN:VCARD',
      'URL;CHARSET=ISO-8859-1;ENCODING=QUOTED-PRINTABLE:https://bad50.b=E1d.example.com/',
      'END:VCARD'
    ]),
    'vCard quoted-printable charset'
  );
  // (a folded quoted-printable value, its fold's space kept, as a vCard 2.1
  //  reader keeps it)
  await blocked(
    'bad51.example.com',
    multipart([
      'Content-Type: text/x-vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      '',
      'BEGIN:VCARD',
      'URL;ENCODING=QUOTED-PRINTABLE:https://x=',
      ' =62ad51=2Eexample=2Ecom/',
      'END:VCARD'
    ]),
    'vCard folded quoted-printable'
  );
  // (an escaped colon, as Apple's and Android's readers read it)
  await blocked(
    'bad49.example.com',
    multipart([
      'Content-Type: text/vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      '',
      'BEGIN:VCARD',
      'URL;type=pref:https\\://bad49.example.com/',
      'END:VCARD'
    ]),
    'vCard escaped colon'
  );
  // (a contact card by its name, as a mail client opens it)
  await blocked(
    'bad52.example.com',
    multipart([
      'Content-Type: application/octet-stream; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      '',
      'BEGIN:VCARD',
      'URL:https\\://bad52.example.com/',
      'END:VCARD'
    ]),
    'vCard by name'
  );
  // (an invitation's description in HTML, as Outlook shows it)
  await blocked(
    'bad53.example.com',
    multipart([
      'Content-Type: text/calendar; name="invite.ics"',
      'Content-Disposition: attachment; filename="invite.ics"',
      '',
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'X-ALT-DESC;FMTTYPE=text/html:<a href="https://bad53&#46;exam',
      ' ple&#x2e;com/">join</a>',
      'END:VEVENT',
      'END:VCALENDAR'
    ]),
    'calendar HTML description'
  );
  // (Thunderbird's, the document its ALTREP names, and Google Calendar's,
  //  markup in DESCRIPTION)
  await blocked(
    'bad58.example.com',
    multipart([
      'Content-Type: text/calendar; name="invite.ics"',
      'Content-Disposition: attachment; filename="invite.ics"',
      '',
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'DESCRIPTION;ALTREP="data:text/html,%3Ca%20href%3D%22https%3A%2F%2Fbad58.',
      ' example.com%2F%22%3Ex%3C%2Fa%3E":join',
      'END:VEVENT',
      'END:VCALENDAR'
    ]),
    'calendar ALTREP'
  );
  await blocked(
    'bad61.example.com',
    multipart([
      'Content-Type: text/calendar; name="invite.ics"',
      'Content-Disposition: attachment; filename="invite.ics"',
      '',
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'DESCRIPTION:<a href="https&#58;//bad61&#46;example&#46;com/">join</a>\\n',
      'END:VEVENT',
      'END:VCALENDAR'
    ]),
    'calendar markup in DESCRIPTION'
  );
  // (quoted-printable in UTF-16, decoded once, as Android's reader does)
  await blocked(
    'bad59.example.com',
    multipart([
      'Content-Type: text/x-vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      '',
      'BEGIN:VCARD',
      `URL;CHARSET=UTF-16LE;ENCODING=QUOTED-PRINTABLE:${[
        ...'https://bad59.example.com/'
      ]
        .map((c) => `${c}=00`)
        .join('')}`,
      'END:VCARD'
    ]),
    'vCard quoted-printable UTF-16'
  );
  // (lines broken by a CR alone, as Android's reader reads them)
  await blocked(
    'bad60.example.com',
    multipart([
      'Content-Type: text/vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(
        'BEGIN:VCARD\rURL:https://bad60.exam\r ple.com/\rEND:VCARD\r'
      ).toString('base64')
    ]),
    'vCard CR line breaks'
  );
  // (a script by its name before a stream name, as Windows reads it)
  for (const filename of [
    'macro.vbs::$DATA',
    'macro.vbs:$DATA',
    'run.bat:',
    'c:\\docs\\run.cmd::$data',
    // (with direction controls, which Windows saves without)
    'macro.vb\u2069s::$DATA',
    'macro.vbs:\u2069$DATA',
    // (with the dots and spaces Windows drops at the end)
    'macro.vbs::$DATA ',
    'macro.vbs::$DATA.',
    'run.bat: ',
    // (and by its whole name, as other systems save it)
    'Report: Q1.exe'
  ]) {
    const stream = await scan(
      multipart([
        `Content-Type: application/octet-stream; name="${filename}"`,
        `Content-Disposition: attachment; filename="${filename}"`,
        '',
        'echo 1'
      ])
    );
    t.true(
      spamScanner.getOutboundBlockingMessages(stream).length > 0,
      `${filename}`
    );
  }

  // (a program in an attached message/global)
  const program = await scan(
    multipart([
      'Content-Type: message/global',
      '',
      'From: c@example.com',
      'Subject: inner',
      'MIME-Version: 1.0',
      'Content-Type: multipart/mixed; boundary="i"',
      '',
      '--i',
      'Content-Type: application/octet-stream; name="run.exe"',
      'Content-Disposition: attachment; filename="run.exe"',
      '',
      'MZ',
      '--i--'
    ])
  );
  t.true(
    spamScanner
      .getOutboundBlockingMessages(program)
      .some((text) => text.includes('run.exe'))
  );

  // (a link wrapped by gateways deeper than Spam Scanner unwraps, 16: where
  //  it goes is not known, so it is too complex to check)
  const proofpoint = (target, times) => {
    let link = target;
    for (let i = 0; i < times; i++)
      link = `https://urldefense.com/v3/__${link}__;!!x$`;
    return link;
  };

  const deep = await scan(
    html(`<a href="${proofpoint('https://bad39.example.com/x', 17)}">open</a>`)
  );
  t.true(deep.tooComplex);
  t.false(asked.has('bad39.example.com'));
  // (a contact card larger than is read in every way its programs show it,
  //  e.g. a backup with photos: read unfolded, not too complex to check)
  asked.clear();
  const card = await scan(
    multipart([
      'Content-Type: text/vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(
        `BEGIN:VCARD\r\nPHOTO;ENCODING=b:${'a'.repeat(
          5 * 1024 * 1024
        )}\r\nURL:https://bad55.exam\r\n ple.com/\r\nURL:https\\://bad56.example.com/\r\nEND:VCARD\r\n`
      )
        .toString('base64')
        .replaceAll(/.{76}/g, '$&\r\n')
    ])
  );
  t.falsy(card.tooComplex);
  t.true(asked.has('bad55.example.com'));
  // (read in every way without its photo)
  t.true(asked.has('bad56.example.com'));
  t.true(spamScanner.getOutboundBlockingMessages(card).length > 0);
  // (and one larger without it, with what is read otherwise: too complex)
  const note = await scan(
    multipart([
      'Content-Type: text/vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(
        `BEGIN:VCARD\r\nNOTE:${'a'.repeat(
          5 * 1024 * 1024
        )}\r\nURL;ENCODING=QUOTED-PRINTABLE:https://bad57=2Eexample.com/\r\nEND:VCARD\r\n`
      )
        .toString('base64')
        .replaceAll(/.{76}/g, '$&\r\n')
    ])
  );
  t.true(note.tooComplex);
  // (not one only with escapes, as Apple's cards have, read in every way)
  asked.clear();
  const apple = await scan(
    multipart([
      'Content-Type: text/vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(
        `BEGIN:VCARD\r\nNOTE:quoted-printable ${'a'.repeat(
          5 * 1024 * 1024
        )}\r\nitem1.URL:https\\://bad63.example.com/\r\nEND:VCARD\r\n`
      )
        .toString('base64')
        .replaceAll(/.{76}/g, '$&\r\n')
    ])
  );
  t.falsy(apple.tooComplex);
  t.true(asked.has('bad63.example.com'));
  // (but one with a value in quoted-printable, as it is read: its quoted
  //  parameter value with a colon, or its parameter folded)
  for (const line of [
    'URL;X-A="a:b";ENCODING=QUOTED-PRINTABLE:https=3A//bad70=2Eexample.com/',
    'URL;ENCODING=QUOTED-\r\n PRINTABLE:https=3A//bad71=2Eexample.com/'
  ]) {
    const large = await scan(
      multipart([
        'Content-Type: text/vcard; name="card.vcf"',
        'Content-Disposition: attachment; filename="card.vcf"',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(
          `BEGIN:VCARD\r\nNOTE:${'a'.repeat(
            5 * 1024 * 1024
          )}\r\n${line}\r\nEND:VCARD\r\n`
        )
          .toString('base64')
          .replaceAll(/.{76}/g, '$&\r\n')
      ])
    );
    t.true(large.tooComplex, `${line}`);
  }

  // (values marked binary, each folded line of one marked binary too, read
  //  in linear time)
  const started = Date.now();
  await scan(
    multipart([
      'Content-Type: text/vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(
        `BEGIN:VCARD\r\n${' ;b:A\r\n'.repeat(100_000)} !\r\nEND:VCARD\r\n`
      )
        .toString('base64')
        .replaceAll(/.{76}/g, '$&\r\n')
    ])
  );
  t.true(Date.now() - started < 10_000);
  // (a value marked binary that is not base64, a link, read as it is, as
  //  Android's reader keeps it; one that is, of a property not a photo or
  //  the like, decoded; and a link after a photo without a blank line)
  asked.clear();
  await scan(
    multipart([
      'Content-Type: text/vcard; name="card.vcf"',
      'Content-Disposition: attachment; filename="card.vcf"',
      '',
      'BEGIN:VCARD',
      'VERSION:2.1',
      'PHOTO;ENCODING=BASE64:',
      ' AAAA',
      'AAAA',
      'URL:https://bad67.example.com/',
      'URL;VALUE=BINARY:https://bad64.example.com/',
      'URL;B:https://bad65.example.com/',
      'URL;X-A="x;ENCODING=b;y":https://bad66.example.com/',
      `URL;ENCODING=b:${Buffer.from('https://bad68.example.com/').toString(
        'base64'
      )}`,
      'END:VCARD'
    ])
  );
  for (const host of [
    'bad64.example.com',
    'bad65.example.com',
    'bad66.example.com',
    'bad67.example.com',
    'bad68.example.com'
  ])
    t.true(asked.has(host), `${host}`);
  // (as deep as it unwraps is read, and Safe Links wrapping that)
  await blocked(
    'bad40.example.com',
    html(`<a href="${proofpoint('https://bad40.example.com/x', 16)}">open</a>`),
    'sixteen deep'
  );
  await blocked(
    'bad41.example.com',
    html(
      `<a href="https://nam01.safelinks.protection.outlook.com/?url=${encodeURIComponent(
        proofpoint('https://bad41.example.com/x', 2)
      )}">open</a>`
    ),
    'Safe Links around nested URL Defense'
  );

  // (a text file, which mail clients show with its links, naming more
  //  hosts than are looked up: as the message itself would, too many to
  //  check; one a decoy list in it would hide is otherwise never looked up)
  const log = Array.from(
    { length: 300 },
    (_, i) => `GET / 200 https://ref${i}.example.org/`
  ).join('\n');
  const logged = await scan(
    multipart([
      'Content-Type: text/html',
      '',
      '<a href="https://bad42.example.com/">open</a>',
      '--b',
      'Content-Type: text/plain; name="access.log"',
      'Content-Disposition: attachment; filename="access.log"',
      '',
      `https://bad42.example.com/\n${log}`
    ])
  );
  t.true(logged.tooManyLinkHosts);
  t.true(asked.has('bad42.example.com'));
  // (and icons as data: URLs, read for their links, are many)
  const icon = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v1z"/></svg>'
  ).toString('base64');
  const icons = await scan(
    html(
      Array.from(
        { length: 300 },
        (_, i) => `<img alt="${i}" src="data:image/svg+xml;base64,${icon}">`
      ).join('')
    )
  );
  t.false(Boolean(icons.tooComplex));
  t.deepEqual(spamScanner.getOutboundBlockingMessages(icons), []);

  // (documents held in others, past how deep they are read)
  let nested = '<a href="https://good.example.org/">x</a>';
  for (let i = 0; i < 4; i++)
    nested = `<iframe srcdoc="${nested
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')}"></iframe>`;
  const tooDeep = await scan(html(nested));
  t.true(tooDeep.tooComplex);
  // (and a message without any is not too complex)
  const plain = await scan(html('<a href="https://good.example.org/">x</a>'));
  t.falsy(plain.tooComplex);
});

test('outbound, a message too complex to check in full is blocked, also in monitor mode; more names with no "/" after them than are looked up neither block it nor hold it back', async (t) => {
  config.spamScanner.cloudflare = true;
  config.spamScanner.outboundTimeout = 20_000;
  captureSpamScannerLog(t);
  const fake = {
    async resolve4(name) {
      return name.startsWith('bad') ? ['0.0.0.0'] : ['192.0.2.1'];
    }
  };
  const resolvers = spamScanner.getResolvers(client, fake);
  resolvers.malware = fake;
  resolvers.family = fake;
  t.true(config.spamScanner.monitorOnly);
  // (more parts than the MIME parser reads, a program among the last)
  const parts = [];
  for (let i = 0; i < 1100; i++)
    parts.push('--b', 'Content-Type: text/plain', '', `part ${i}`);
  const tooMany = message([
    'From: alice@example.com',
    'To: bob@example.org',
    'Subject: parts',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="b"',
    '',
    ...parts,
    '--b',
    'Content-Type: application/octet-stream; name="run.exe"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from('MZ\u0090\u0000').toString('base64'),
    '--b--',
    ''
  ]);
  const scan = await spamScanner.scan(tooMany, {
    client,
    direction: 'outbound',
    blocks: true
  });
  t.truthy(scan);
  t.true(scan.tooComplex);
  t.true(
    spamScanner
      .getOutboundBlockingMessages(scan)
      .includes('Message is too complex to be checked in full')
  );
  t.true(
    spamScanner
      .toStored(scan)
      .blocking.includes('Message is too complex to be checked in full')
  );

  // (more attached HTML files than are read for their links, with link
  //  hosts looked up: without, they are not read)
  const files = [];
  for (let i = 0; i < 101; i++)
    files.push(
      '--b',
      `Content-Type: text/html; name="p${i}.html"`,
      `Content-Disposition: attachment; filename="p${i}.html"`,
      '',
      `<p>page ${i}</p>`
    );
  const attached = await spamScanner.scan(
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: pages',
      'MIME-Version: 1.0',
      'Content-Type: multipart/mixed; boundary="b"',
      '',
      '--b',
      'Content-Type: text/plain',
      '',
      'Pages.',
      ...files,
      '--b--',
      ''
    ]),
    { client, direction: 'outbound', blocks: true, protection: LINKS }
  );
  t.true(attached.tooComplex);

  // (attached messages nested deeper than Spam Scanner reads them)
  let nested = [
    'From: c@example.com',
    'Subject: inner',
    '',
    'https://bad20.example.com/x'
  ].join('\r\n');
  for (let depth = 0; depth < 4; depth++)
    nested = [
      'From: c@example.com',
      `Subject: level ${depth}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="n${depth}"`,
      '',
      `--n${depth}`,
      'Content-Type: text/plain',
      '',
      'See attached.',
      `--n${depth}`,
      'Content-Type: message/rfc822',
      'Content-Disposition: attachment; filename="m.eml"',
      '',
      nested,
      `--n${depth}--`,
      ''
    ].join('\r\n');
  // (not in monitor mode, which sends them as origin did, see the test
  //  of attached messages nested past what is opened)
  const deep = await spamScanner.scan(Buffer.from(nested), {
    client,
    direction: 'outbound',
    blocks: true
  });
  t.false(deep.tooComplex);
  config.spamScanner.monitorOnly = false;
  const enforced = await spamScanner.scan(Buffer.from(nested), {
    client,
    direction: 'outbound',
    blocks: true
  });
  t.true(enforced.tooComplex);
  config.spamScanner.monitorOnly = true;

  // (an attached message with more parts than the MIME parser reads, which
  //  Spam Scanner's parser says it is past; encoded, so the parser of the
  //  message itself does not read its parts)
  const partsMessage = [
    'From: c@example.com',
    'Subject: parts',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="b"',
    '',
    ...parts,
    '--b--',
    ''
  ].join('\r\n');
  const attachedParts = await spamScanner.scan(
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: attached parts',
      'MIME-Version: 1.0',
      'Content-Type: multipart/mixed; boundary="o"',
      '',
      '--o',
      'Content-Type: text/plain',
      '',
      'See attached.',
      '--o',
      'Content-Type: application/octet-stream; name="parts.eml"',
      'Content-Disposition: attachment; filename="parts.eml"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(partsMessage).toString('base64'),
      '--o--',
      ''
    ]),
    { client, direction: 'outbound', blocks: true }
  );
  t.true(attachedParts.tooComplex);

  // (an attached message with more attachments than Spam Scanner opens
  //  attached messages for, which it lists unopened)
  const plain = [];
  for (let i = 0; i < 101; i++)
    plain.push(
      '--b',
      `Content-Type: text/plain; name="f${i}.txt"`,
      `Content-Disposition: attachment; filename="f${i}.txt"`,
      '',
      `file ${i}`
    );
  const manyFilesMessage = message([
    'From: alice@example.com',
    'To: bob@example.org',
    'Subject: attached files',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="o"',
    '',
    '--o',
    'Content-Type: text/plain',
    '',
    'See attached.',
    '--o',
    'Content-Type: message/rfc822',
    'Content-Disposition: attachment; filename="files.eml"',
    '',
    'From: c@example.com',
    'Subject: files',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="b"',
    '',
    ...plain,
    '--b--',
    '--o--',
    ''
  ]);
  const manyFiles = await spamScanner.scan(manyFilesMessage, {
    client,
    direction: 'outbound',
    blocks: true
  });
  // (also not in monitor mode, as above)
  t.false(manyFiles.tooComplex);
  config.spamScanner.monitorOnly = false;
  const manyEnforced = await spamScanner.scan(manyFilesMessage, {
    client,
    direction: 'outbound',
    blocks: true
  });
  t.true(manyEnforced.tooComplex);
  config.spamScanner.monitorOnly = true;

  // (inbound, the same is only scored)
  const inbound = await spamScanner.scan(tooMany, { client });
  t.falsy(inbound?.tooComplex);

  // (names with no "/" after them past the hosts looked up, which text that
  //  is no link may read as: neither blocked nor held back as unchecked)
  const names = Array.from({ length: 300 }, (_, i) => `h${i}.example.com`);
  const loose = await spamScanner.scan(
    message([
      'From: alice@example.com',
      'To: bob@example.org',
      'Subject: names',
      '',
      names.join(' ')
    ]),
    { client, direction: 'outbound', blocks: true }
  );
  t.deepEqual(spamScanner.getOutboundBlockingMessages(loose), []);
  t.true(loose.linksComplete);
});

test('senders take turns for a worker: one sender’s scans queued first do not keep another’s past its time limit', async (t) => {
  captureSpamScannerLog(t);
  config.spamScanner.threads = 1;
  config.spamScanner.outboundTimeout = 1000;
  const pool = spamScanner.getPool();
  // (one worker taking scans from the pool's own queue, in its order, each
  //  in 300ms)
  const queue = pool.options.taskQueue;
  let busy = false;
  // (the senders, by address, in the order the worker got their scans)
  const order = [];
  const next = () => {
    if (busy || queue.size === 0) return;
    busy = true;
    const info = queue.shift();
    order.push(info.task.session.remoteAddress);
    info.task.port.postMessage({ started: true, warm: true });
    timers.setTimeout(() => {
      busy = false;
      info.resolve({ isSpam: false });
      next();
    }, 300);
  };

  pool.run = (task, { signal }) =>
    new Promise((resolve, reject) => {
      const info = { task, resolve };
      queue.push(info);
      signal.addEventListener('abort', () => {
        queue.remove(info);
        reject(new Error('aborted'));
      });
      queueMicrotask(next);
    });
  const outbound = (owner) =>
    spamScanner.scan(HAM, {
      session: {
        ...session,
        remoteAddress: owner === 'user:a' ? '192.0.2.1' : '192.0.2.2'
      },
      client,
      direction: 'outbound',
      blocks: true,
      owner
    });

  // (four of one account's at once, then another account's: in order of
  //  arrival it would start a second after it was sent, past its time limit)
  const first = Array.from({ length: 4 }, () => outbound('user:a'));
  await setTimeout(20);
  t.is(queue.waitingOf('user:a'), 3);
  // (and, as one of them is running, before the next of them)
  t.truthy(await outbound('user:b'));
  t.deepEqual(order.slice(0, 2), ['192.0.2.1', '192.0.2.2']);
  await Promise.all(first);
  t.is(queue.size, 0);
});

test('outbound, attached messages nested past what is opened block a message only out of monitor mode, which origin sent them in, and where something would be looked for in them', async (t) => {
  captureSpamScannerLog(t);
  config.spamScanner.outboundTimeout = 20_000;
  config.spamScanner.clamav = false;
  // (a forward of a forward, five deep)
  let raw = 'From: a@example.com\r\nSubject: hi\r\n\r\nhi\r\n';
  for (let i = 0; i < 5; i++)
    raw = message([
      'From: alice@example.com',
      'To: bob@example.org',
      `Subject: Fwd ${i}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="f${i}"`,
      '',
      `--f${i}`,
      'Content-Type: text/plain',
      '',
      'see attached',
      `--f${i}`,
      `Content-Type: message/rfc822; name="fwd${i}.eml"`,
      `Content-Disposition: attachment; filename="fwd${i}.eml"`,
      '',
      raw.toString(),
      `--f${i}--`,
      ''
    ]);
  const scan = (protection) =>
    spamScanner.scan(raw, {
      client,
      direction: 'outbound',
      blocks: true,
      protection
    });

  // (in monitor mode, the default, it is sent as before)
  t.true(config.spamScanner.monitorOnly);
  const monitored = await scan();
  t.true(monitored.contentTooComplex);
  t.false(monitored.tooComplex);
  t.deepEqual(spamScanner.getOutboundBlockingMessages(monitored), []);
  // (out of it, by default, programs are looked for)
  config.spamScanner.monitorOnly = false;
  const checked = await scan();
  t.true(checked.contentTooComplex);
  t.true(checked.tooComplex);
  const off = await scan({ adult: false, phishing: false, executable: false });
  t.true(off.contentTooComplex);
  t.false(off.tooComplex);
  t.deepEqual(spamScanner.getOutboundBlockingMessages(off), []);
  // (and viruses, with ClamAV)
  config.spamScanner.clamav = true;
  const clamav = await scan({
    adult: false,
    phishing: false,
    executable: false
  });
  t.true(clamav.tooComplex);
});

test('an error whose stack has a long run of line breaks is written at once', (t) => {
  const warnings = captureSpamScannerWarnings(t);
  // (as a Node error with a code is written, whose stack does not start with
  //  its name and message, quoting what it read)
  const error = new TypeError('bad input');
  error.stack = `TypeError [ERR_X]: ${'\n'.repeat(
    40_000
  )}x\n    at read (/srv/a.js:1:2)`;
  const started = Date.now();
  spamScanner.errorOften('spam scanner could not read a message', { error });
  t.true(Date.now() - started < 200, `${Date.now() - started}ms`);
  t.is(warnings.length, 1);
  t.is(warnings[0][2], 'error');
});
