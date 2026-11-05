/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { Buffer } = require('node:buffer');

const getStream = require('get-stream');

const SieveEngine = require('../../helpers/sieve/engine');
const { SieveIntegration } = require('../../helpers/sieve/integration');
const { validateScript } = require('../../helpers/sieve');
const { parse } = require('../../helpers/sieve/parser');

const logger = {
  debug() {},
  info() {},
  warn() {},
  error() {}
};

function createMimeMessage() {
  return {
    headers: {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Sieve MIME test'
    },
    envelope: {
      from: 'sender@example.com',
      to: 'recipient@example.com'
    },
    mimeParts: [
      {
        contentType: 'multipart/alternative',
        headers: {
          'content-type': 'multipart/alternative; boundary="unit-test-boundary"'
        },
        body: '',
        multipart: true
      },
      {
        contentType: 'text/plain',
        headers: { 'content-type': 'text/plain; charset=utf-8' },
        body: 'Original plain text',
        multipart: false
      },
      {
        contentType: 'text/html',
        headers: { 'content-type': 'text/html; charset=utf-8' },
        body: '<p>Original HTML</p>',
        multipart: false
      }
    ]
  };
}

function createMultipartMessage({ foldedBoundary }) {
  const boundary = 'unit-test-boundary';
  const contentType = foldedBoundary
    ? 'Content-Type: multipart/alternative;\r\n boundary="unit-test-boundary"'
    : 'Content-Type: multipart/alternative; boundary="unit-test-boundary"';

  return Buffer.from(
    `From: sender@example.com\r\n` +
      `To: recipient@example.com\r\n` +
      `Subject: Sieve MIME test\r\n` +
      `MIME-Version: 1.0\r\n` +
      `${contentType}\r\n` +
      `\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: text/plain;\r\n` +
      ` charset=utf-8;\r\n` +
      ` format=flowed\r\n` +
      `Content-Disposition: inline;\r\n` +
      ` filename="example.txt"\r\n` +
      `\r\n` +
      `Original plain text\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: text/html; charset=utf-8\r\n` +
      `\r\n` +
      `<p>Original HTML</p>\r\n` +
      `--${boundary}--\r\n`
  );
}

describe('Sieve RFC 5703 integration regressions', () => {
  // (RFC 5703 section 8: each command has its own capability, and "mime"
  // stays accepted as an umbrella for them)
  it('accepts the RFC 5703 capabilities of its commands', async () => {
    const script = `
      require ["foreverypart", "mime", "replace"];
      foreverypart {
        if header :mime :type "Content-Type" "text" {
          replace "Replacement text";
        }
      }
    `;
    assert.strictEqual(validateScript(script).valid, true);
    const engine = new SieveEngine({ logger });
    const result = await engine.execute(parse(script), createMimeMessage());
    assert.strictEqual(
      result.actions.filter((action) => action.type === 'replace').length,
      2
    );
  });

  it('retains mime as a compatible umbrella for RFC 5703 commands', async () => {
    const script = `
      require "mime";
      foreverypart {
        if header :mime :type "Content-Type" "text" {
          replace "Replacement text";
        }
      }
    `;
    const engine = new SieveEngine({ logger });
    const result = await engine.execute(parse(script), createMimeMessage());

    assert.strictEqual(
      result.actions.filter((action) => action.type === 'replace').length,
      2
    );
  });

  it('rejects unrequired RFC 5703 commands when they execute', async () => {
    const engine = new SieveEngine({ logger });

    await assert.rejects(
      engine.execute(parse('foreverypart { keep; }'), createMimeMessage()),
      /MIME command "foreverypart" requires "foreverypart" to be declared with require\./
    );
    await assert.rejects(
      engine.execute(parse('enclose "message/rfc822";'), createMimeMessage()),
      /Sieve enclose is not supported/
    );
  });

  it('replaces a MIME part when the top-level boundary is folded', async () => {
    const integration = new SieveIntegration();
    const raw = createMultipartMessage({ foldedBoundary: true });
    const result = String(
      await integration.applyReplaceActions(raw, [
        { partIndex: 1, replacement: 'Replacement text' }
      ])
    );

    assert.match(
      result,
      /Content-Type: multipart\/alternative;\r\n boundary="unit-test-boundary"/
    );
    assert.match(result, /\r\n\r\nReplacement text\r\n--unit-test-boundary/);
    assert.doesNotMatch(result, /Original plain text/);
    assert.match(result, /<p>Original HTML<\/p>/);
  });

  it('replaces a MIME part when the top-level boundary is unfolded', async () => {
    const integration = new SieveIntegration();
    const raw = createMultipartMessage({ foldedBoundary: false });
    const result = String(
      await integration.applyReplaceActions(raw, [
        { partIndex: 1, replacement: 'Replacement text' }
      ])
    );

    assert.match(result, /\r\n\r\nReplacement text\r\n--unit-test-boundary/);
    assert.doesNotMatch(result, /Original plain text/);
  });

  it('unfolds MIME-part header continuation lines before storing headers', async () => {
    const integration = new SieveIntegration();
    const parts = await integration.parseMimeTree(
      createMultipartMessage({ foldedBoundary: true })
    );
    const plainTextPart = parts.find(
      (part) =>
        part.headers['content-disposition'] === 'inline; filename="example.txt"'
    );

    assert.ok(plainTextPart);
    assert.strictEqual(
      plainTextPart.headers['content-type'],
      'text/plain; charset=utf-8; format=flowed'
    );
    assert.strictEqual(
      plainTextPart.headers['content-disposition'],
      'inline; filename="example.txt"'
    );
  });
});

//
// The integration result of a script for a message (the rate limits allow
// everything, and notifications are recorded instead of sent)
//
async function run(script, raw = RAW, options = {}) {
  const integration = new SieveIntegration({
    store: { getActiveScript: async () => ({ name: 'test', content: script }) }
  });
  integration.rateLimiter = {
    checkRedirect: async () => ({ allowed: true }),
    recordRedirect: async () => ({ allowed: true }),
    checkVacation: async () => ({ allowed: true }),
    checkNotification: async () => ({ allowed: true }),
    recordNotification: async () => ({ allowed: true })
  };
  const sent = [];
  integration.sendNotification = async (notification) => {
    sent.push(notification);
  };

  const result = await integration.processMessage({
    aliasId: 'alias-1',
    aliasAddress: 'me@example.com',
    raw,
    envelope: options.envelope || {
      from: 'sender@example.com',
      to: ['me@example.com']
    },
    session: {},
    ...options.callbacks
  });
  result.sent = sent;
  return result;
}

const RAW = Buffer.from(
  'From: sender@example.com\r\nTo: me@example.com\r\nSubject: Hello\r\n' +
    'Message-ID: <a@example.com>\r\nX-Foo: one\r\nX-Foo: two\r\n' +
    'X-Foo: three\r\n\r\nbody\r\n'
);

const folders = (result) =>
  result.deliveries.map((delivery) => delivery.folder);

describe('Sieve delivery of the actions of a script (RFC 5228)', () => {
  it('stores a message only redirected nowhere (RFC 5228 4.2)', async () => {
    const result = await run('redirect "other@example.net";');
    assert.deepStrictEqual(folders(result), []);
    assert.strictEqual(result.action, 'redirect');
    assert.deepStrictEqual(result.redirects, [
      { address: 'other@example.net', copy: false }
    ]);
    // (kept after all if the redirect cannot be sent, see parse-payload.js)
    assert.strictEqual(result.isKeptIfNotRedirected, true);
  });

  it('keeps the message with redirect :copy (RFC 3894)', async () => {
    const result = await run(
      'require "copy"; redirect :copy "other@example.net";'
    );
    assert.deepStrictEqual(folders(result), ['INBOX']);
    assert.deepStrictEqual(result.redirects, [
      { address: 'other@example.net', copy: true }
    ]);
  });

  it('redirects to an address once', async () => {
    const result = await run(
      'require "copy"; redirect :copy "x@example.net"; redirect :copy "X@example.net";'
    );
    assert.strictEqual(result.redirects.length, 1);
  });

  it('files into INBOX and the mailbox for fileinto :copy', async () => {
    const result = await run(
      'require ["fileinto", "copy"]; fileinto :copy "A";'
    );
    assert.deepStrictEqual(folders(result), ['A', 'INBOX']);
  });

  it('files into INBOX and the mailbox for keep and fileinto', async () => {
    const result = await run('require "fileinto"; keep; fileinto "A";');
    assert.deepStrictEqual(folders(result), ['INBOX', 'A']);
    assert.strictEqual(result.folder, 'INBOX');
    assert.deepStrictEqual(
      result.additionalFolders.map((f) => f.folder),
      ['A']
    );
  });

  it('files into every mailbox once, the last flags winning (RFC 5228 2.10.3, RFC 5232 3)', async () => {
    const result = await run(
      'require ["fileinto", "imap4flags", "mailbox"]; fileinto :flags "\\\\Seen" "A"; fileinto :create "B"; fileinto :flags "\\\\Flagged" "A";'
    );
    assert.deepStrictEqual(result.deliveries, [
      { folder: 'A', flags: ['\\Flagged'], create: false, specialuse: null },
      { folder: 'B', flags: [], create: true, specialuse: null }
    ]);
  });

  it('only cancels the implicit keep with discard (RFC 5228 4.4)', async () => {
    const filed = await run('require "fileinto"; fileinto "A"; discard;');
    assert.deepStrictEqual(folders(filed), ['A']);
    assert.strictEqual(filed.action, 'keep');

    const discarded = await run('discard;');
    assert.deepStrictEqual(folders(discarded), []);
    assert.strictEqual(discarded.action, 'discard');
    assert.strictEqual(discarded.discarded, true);
  });

  it('keeps the vacation of a discarded message (RFC 5230 4.7)', async () => {
    const result = await run('require "vacation"; vacation "away"; discard;');
    assert.deepStrictEqual(folders(result), []);
    assert.strictEqual(result.vacation.message, 'away');
  });

  it('rejects whatever else the script does (RFC 5429 2.4)', async () => {
    const result = await run(
      'require ["reject", "fileinto"]; fileinto "A"; reject "go away"; discard;'
    );
    assert.strictEqual(result.action, 'reject');
    assert.strictEqual(result.reject.message, 'go away');
    assert.deepStrictEqual(folders(result), []);
  });

  it('stores the flags of an explicit keep, not those set after it (RFC 5232 5)', async () => {
    const result = await run(
      'require "imap4flags"; keep :flags "B"; addflag "C";'
    );
    assert.deepStrictEqual(result.deliveries, [
      { folder: 'INBOX', flags: ['B'], create: false, specialuse: null }
    ]);
  });

  it('keeps the message as it came when the script fails (RFC 5228 2.10.6)', async () => {
    const result = await run(
      'require ["fileinto", "editheader", "vacation", "ihave"]; addheader "X-A" "1"; fileinto "A"; vacation "a"; error "b";'
    );
    assert.deepStrictEqual(folders(result), ['INBOX']);
    assert.strictEqual(result.modifiedRaw, null);
    assert.strictEqual(result.vacation, null);
    assert.strictEqual(result.errors[0].type, 'execution_error');
  });

  it('keeps the special-use of fileinto :specialuse for the mailbox to be found (RFC 8579)', async () => {
    const result = await run(
      'require ["fileinto", "special-use"]; fileinto :specialuse "\\\\sent" "Mine";'
    );
    assert.deepStrictEqual(result.deliveries, [
      { folder: 'Mine', flags: [], create: false, specialuse: '\\sent' }
    ]);
  });

  it('asks for the mailboxes of the alias (RFC 5490, RFC 8579)', async () => {
    const asked = [];
    const callbacks = {
      async mailboxExists(name) {
        asked.push(name);
        return name === 'Here';
      },
      async specialUseExists(attributes, mailbox) {
        asked.push([attributes, mailbox]);
        return true;
      }
    };
    const result = await run(
      'require ["fileinto", "mailbox", "special-use"]; if mailboxexists "Here" { fileinto "Yes"; } if mailboxexists "There" { fileinto "No"; } if specialuse_exists "\\\\Junk" { fileinto "Junk"; }',
      RAW,
      { callbacks }
    );
    assert.deepStrictEqual(folders(result), ['Yes', 'Junk']);
    assert.deepStrictEqual(asked, ['Here', 'There', [['\\Junk'], null]]);
  });

  it('asks for each mailbox of the alias once a run', async () => {
    // (each lookup can go through every mailbox, and loops repeat them)
    const asked = [];
    const callbacks = {
      async mailboxExists(name) {
        asked.push(name);
        return name === 'Here';
      },
      async specialUseExists(attributes, mailbox) {
        asked.push([attributes, mailbox]);
        return true;
      }
    };
    const raw = Buffer.from(
      'From: sender@example.com\r\nTo: me@example.com\r\nSubject: Hello\r\n' +
        'MIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary="b"\r\n\r\n' +
        '--b\r\nContent-Type: text/plain\r\n\r\none\r\n' +
        '--b\r\nContent-Type: text/plain\r\n\r\ntwo\r\n--b--\r\n'
    );
    const result = await run(
      [
        'require ["fileinto", "mailbox", "special-use", "mime", "foreverypart", "variables"];',
        'set "name" "Here";',
        'foreverypart {',
        'if mailboxexists "Here" { fileinto "Yes"; }',
        // eslint-disable-next-line no-template-curly-in-string
        'if mailboxexists ["${name}", "There"] { fileinto "No"; }',
        'if specialuse_exists "\\\\Junk" { fileinto "Junk"; }',
        '}'
      ].join('\n'),
      raw,
      { callbacks }
    );
    assert.deepStrictEqual(folders(result), ['Yes', 'Junk']);
    assert.deepStrictEqual(asked, ['Here', 'There', [['\\Junk'], null]]);
  });

  it('gives the envelope as it is, with the null reverse-path (RFC 5228 5.4)', async () => {
    const result = await run(
      'require ["envelope", "fileinto"]; if envelope :is "from" "" { fileinto "Null"; }',
      RAW,
      { envelope: { from: '', to: ['me+tag@example.com'] } }
    );
    assert.deepStrictEqual(folders(result), ['Null']);
  });

  it('reads a header named __proto__ like any other', async () => {
    const integration = new SieveIntegration();
    const message = await integration.parseMessageForSieve(
      Buffer.from('__proto__: x\r\nSubject: s\r\n\r\nbody'),
      { from: 'a@example.com', to: ['b@example.com'] }
    );
    const name = '__proto__';
    assert.strictEqual(message.headers[name], 'x');
    assert.strictEqual(Object.getPrototypeOf(message.headers), null);
  });
});

describe('Sieve vacation and notify in the integration', () => {
  it('ignores a vacation :from that is not the alias (RFC 5230 4.3)', async () => {
    const other = await run(
      'require "vacation"; vacation :from "boss@example.com" "away";'
    );
    assert.strictEqual(other.vacation.from, null);
    const own = await run(
      'require "vacation"; vacation :from "Me (away) <ME@example.com>" "away";'
    );
    assert.strictEqual(own.vacation.from, 'Me (away) <ME@example.com>');
  });

  it('gives :days and :seconds as written, null when not', async () => {
    const result = await run(
      'require "vacation-seconds"; vacation :seconds 0 :handle "h" "away";'
    );
    assert.strictEqual(result.vacation.seconds, 0);
    assert.strictEqual(result.vacation.days, null);
    assert.strictEqual(result.vacation.handle, 'h');
  });

  it('does not notify for an automatic message (RFC 5436 2.7)', async () => {
    const script = 'require "enotify"; notify "mailto:me2@example.net";';
    const automatic = await run(
      script,
      Buffer.from(
        'From: a@example.com\r\nAuto-Submitted: auto-generated\r\n\r\nbody'
      )
    );
    assert.strictEqual(automatic.sent.length, 0);
    const manual = await run(
      script,
      Buffer.from('From: a@example.com\r\nAuto-Submitted: no\r\n\r\nbody')
    );
    assert.strictEqual(manual.sent.length, 1);
  });

  it('notifies an address once a run (RFC 5436 2.7)', async () => {
    const result = await run(
      'require "enotify"; notify "mailto:me2@example.net"; notify :message "again" "mailto:ME2@example.net";'
    );
    assert.strictEqual(result.sent.length, 1);
  });

  it('sends a mailto notification as RFC 5436 composes it', async () => {
    const mongoose = require('mongoose');
    const queued = [];
    const connection = {
      [Symbol.for('connection.name')]: 'MONGO_URI',
      models: { Emails: { queue: async (options) => queued.push(options) } }
    };
    mongoose.connections.unshift(connection);
    try {
      const integration = new SieveIntegration();
      await integration.sendNotification(
        {
          method:
            'mailto:a@example.net?cc=b@example.net&subject=Hi%20there&body=See%20mail&from=evil@example.org',
          from: 'evil@example.org',
          importance: '1'
        },
        {
          aliasAddress: 'me@example.com',
          aliasId: 'alias-1',
          headers: { subject: 'Original', from: 'x@example.com' }
        }
      );
    } finally {
      mongoose.connections.splice(mongoose.connections.indexOf(connection), 1);
    }

    assert.strictEqual(queued.length, 1);
    const { envelope, message } = queued[0].info;
    assert.deepStrictEqual(envelope, {
      from: 'me@example.com',
      to: ['a@example.net', 'b@example.net']
    });
    const text = String(await getStream(message));
    assert.match(
      text,
      /^Auto-Submitted: auto-notified; owner-email="me@example.com"\r$/m
    );
    assert.match(text, /^From: me@example.com\r$/m);
    assert.match(text, /^Cc: b@example.net\r$/m);
    assert.match(text, /^Subject: Hi there\r$/m);
    assert.match(text, /^X-Sieve-Importance: 1\r$/m);
    assert.match(text, /\r\n\r\nSee mail/);
  });
});

describe('Sieve header changes (RFC 5293)', () => {
  const change = async (script) => {
    const result = await run(script);
    assert.deepStrictEqual(result.errors, []);
    return result.modifiedRaw ? result.modifiedRaw.toString() : null;
  };

  it('counts deleteheader :index from the first field', async () => {
    const raw = await change(
      'require "editheader"; deleteheader :index 1 "X-Foo";'
    );
    assert.match(raw, /X-Foo: two\r\nX-Foo: three\r\n/);
    assert.doesNotMatch(raw, /X-Foo: one/);
  });

  it('counts deleteheader :index :last from the last field', async () => {
    const integration = new SieveIntegration();
    const raw = String(
      await integration.applyHeaderChanges(RAW, [
        { action: 'delete', name: 'X-Foo', index: 1, last: true }
      ])
    );
    assert.match(raw, /X-Foo: one\r\nX-Foo: two\r\n\r\n/);
  });

  it('deletes the :index field only if its value matches', async () => {
    const kept = await change(
      'require "editheader"; deleteheader :index 2 "X-Foo" "three";'
    );
    assert.match(kept, /X-Foo: one\r\nX-Foo: two\r\nX-Foo: three/);
    const deleted = await change(
      'require "editheader"; deleteheader :index 2 "X-Foo" "two";'
    );
    assert.match(deleted, /X-Foo: one\r\nX-Foo: three/);
  });

  it('matches value-patterns with the comparator', async () => {
    const octet = await change(
      'require ["editheader", "comparator-i;octet"]; deleteheader :comparator "i;octet" "X-Foo" "TWO";'
    );
    assert.match(octet, /X-Foo: two/);
    const casemap = await change(
      'require "editheader"; deleteheader "X-Foo" "TWO";'
    );
    assert.doesNotMatch(casemap, /X-Foo: two/);
  });

  // (the engine deletes them for later tests, so the message must lose
  // them too, for relational match types as for the others)
  it('deletes the fields a :value pattern matches', async () => {
    const raw = await change(
      'require ["editheader", "relational"]; deleteheader :value "ge" "X-Foo" "three";'
    );
    assert.match(raw, /X-Foo: one\r\n/);
    assert.doesNotMatch(raw, /X-Foo: t/);
  });

  it('keeps the octets of the body when changing headers', async () => {
    const body = Buffer.from([0x63, 0x61, 0x66, 0xe9, 0x0d, 0x0a]);
    const raw = await new SieveIntegration().applyHeaderChanges(
      Buffer.concat([Buffer.from('Subject: a\r\n\r\n'), body]),
      [{ action: 'add', name: 'X-A', value: '1' }]
    );
    assert.ok(raw.subarray(raw.length - body.length).equals(body));
  });

  it('never deletes Auto-Submitted or Received (RFC 5293 6)', async () => {
    const result = await run(
      'require "editheader"; deleteheader "Auto-Submitted"; deleteheader "Received";',
      Buffer.from(
        'Received: from x\r\nAuto-Submitted: auto-generated\r\n\r\nbody'
      )
    );
    assert.strictEqual(result.modifiedRaw, null);
  });

  it('encodes and folds an addheader value (RFC 5293 4)', async () => {
    const raw = await change(
      `require "editheader"; addheader "X-N" "${'Grüße '.repeat(20)}";`
    );
    const field = raw.slice(0, raw.indexOf('\r\nFrom:'));
    assert.match(field, /^X-N: =\?UTF-8\?Q\?Gr=C3=BC=C3=9Fe/);
    assert.ok(/^[ -~\r\n]+$/.test(field));
    assert.ok(field.split('\r\n').every((line) => line.length <= 78));
    assert.ok(field.split('\r\n').length > 1);
  });

  it('fails the script for an invalid field-name (RFC 5293 4)', async () => {
    const result = await run(
      'require ["editheader", "fileinto"]; fileinto "A"; addheader "Bad Name" "x";'
    );
    assert.deepStrictEqual(folders(result), ['INBOX']);
    assert.strictEqual(result.modifiedRaw, null);
    assert.match(result.errors[0].message, /Invalid header field name/);
  });
});

describe('Sieve replace and MIME parts (RFC 5703)', () => {
  const NESTED = Buffer.from(
    'From: a@example.com\r\nTo: me@example.com\r\nSubject: S\r\nMIME-Version: 1.0\r\n' +
      'Content-Type: multipart/mixed; boundary="OUT"\r\n\r\n' +
      '--OUT\r\nContent-Type: multipart/alternative; boundary="IN"\r\n\r\n' +
      '--IN\r\nContent-Type: text/plain\r\n\r\nplain\r\n' +
      '--IN\r\nContent-Type: text/html\r\n\r\n<p>html</p>\r\n--IN--\r\n' +
      '--OUT\r\nContent-Type: application/x-exe; name="a.exe"\r\n' +
      'Content-Disposition: attachment; filename="a.exe"\r\n' +
      'Content-Transfer-Encoding: base64\r\n\r\nTVqQAAMAAAAEAAAA\r\n--OUT--\r\n'
  );

  it('replaces a nested part, as text/plain without its old content headers', async () => {
    const result = await run(
      'require ["foreverypart", "mime", "replace"]; foreverypart { if header :mime :type "Content-Type" "application" { replace "Executable removed"; } }',
      NESTED
    );
    assert.deepStrictEqual(result.errors, []);
    const raw = result.modifiedRaw.toString();
    assert.match(
      raw,
      /--OUT\r\nContent-Type: text\/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nExecutable removed\r\n--OUT--/
    );
    assert.doesNotMatch(raw, /TVqQ|a\.exe/);
    assert.match(raw, /<p>html<\/p>/);
    const parts = await new SieveIntegration().parseMimeTree(
      result.modifiedRaw
    );
    assert.deepStrictEqual(
      parts.map((part) => part.contentType),
      [
        'multipart/mixed',
        'multipart/alternative',
        'text/plain',
        'text/html',
        'text/plain'
      ]
    );
  });

  it('replaces a multipart part with its children', async () => {
    const raw = String(
      await new SieveIntegration().applyReplaceActions(NESTED, [
        { partIndex: 1, replacement: 'No alternatives' }
      ])
    );
    assert.doesNotMatch(raw, /--IN|plain\r\n|html/);
    assert.match(
      raw,
      /\r\n\r\nNo alternatives\r\n--OUT\r\nContent-Type: application\/x-exe/
    );
  });

  it('replaces a part with a MIME entity for :mime', async () => {
    const raw = String(
      await new SieveIntegration().applyReplaceActions(NESTED, [
        {
          partIndex: 4,
          mime: true,
          replacement:
            'Content-Type: text/html; charset=utf-8\n\n<b>removed</b>'
        }
      ])
    );
    assert.match(
      raw,
      /--OUT\r\nContent-Type: text\/html; charset=utf-8\r\n\r\n<b>removed<\/b>\r\n--OUT--/
    );
  });

  // (any other header, such as Received, could otherwise be set where a
  // script cannot add it, even from text of the message)
  it('takes only the MIME headers of a :mime entity', async () => {
    const raw = String(
      await new SieveIntegration().applyReplaceActions(RAW, [
        {
          partIndex: null,
          mime: true,
          replacement:
            'Received: forged\nAuthentication-Results: x; dkim=pass\nContent-Type: text/plain\n\nhi'
        }
      ])
    );
    assert.match(raw, /Content-Type: text\/plain\r\n/);
    assert.doesNotMatch(raw, /Received: forged|Authentication-Results/);
  });

  it('replaces the whole message outside foreverypart, with :subject and :from', async () => {
    const result = await run(
      'require "replace"; replace :subject "Grüße" :from "Filter <filter@example.com>" "Gone";',
      Buffer.from(
        'From: a@example.com\r\nSubject: Old\r\nContent-Type: text/plain\r\nContent-Transfer-Encoding: base64\r\n\r\nc2VjcmV0\r\n'
      )
    );
    assert.deepStrictEqual(result.errors, []);
    const raw = result.modifiedRaw.toString();
    assert.match(raw, /^Original-From: a@example.com\r$/m);
    assert.match(raw, /^From: Filter <filter@example.com>\r$/m);
    assert.match(raw, /^Original-Subject: Old\r$/m);
    assert.match(raw, /^Subject: =\?UTF-8\?Q\?Gr=C3=BC=C3=9Fe\?=\r$/m);
    assert.match(raw, /^Content-Type: text\/plain; charset=utf-8\r$/m);
    assert.match(raw, /^Content-Transfer-Encoding: 7bit\r$/m);
    assert.match(raw, /\r\n\r\nGone$/);
    assert.doesNotMatch(raw, /c2VjcmV0|base64/);
  });

  it('keeps the octets of part bodies and decodes part headers', async () => {
    const parts = await new SieveIntegration().parseMimeTree(
      Buffer.concat([
        Buffer.from(
          'Content-Type: multipart/mixed; boundary=a\r\n\r\n--a\r\n' +
            'Content-Type: text/plain; charset=iso-8859-1\r\n' +
            'Content-Description: =?UTF-8?Q?Gr=C3=BC=C3=9Fe?=\r\n' +
            'X-Twice: 1\r\nX-Twice: 2\r\n__proto__: p\r\n\r\n'
        ),
        Buffer.from([0x47, 0x72, 0xfc, 0xdf, 0x65]),
        Buffer.from('\r\n--a--\r\n')
      ])
    );
    const [, part] = parts;
    assert.strictEqual(part.body, 'Grüße');
    assert.deepStrictEqual(
      [...Buffer.from(part.body, 'latin1')],
      [0x47, 0x72, 0xfc, 0xdf, 0x65]
    );
    assert.strictEqual(part.headers['content-description'], 'Grüße');
    assert.deepStrictEqual(part.headers['x-twice'], ['1', '2']);
    const name = '__proto__';
    assert.strictEqual(part.headers[name], 'p');
  });
});

//
// Scripts saved before the checks of 0c9f63b and 1905021 ran them in parse()
// and the engine, which delivery uses too: a check that is only RFC pedantry
// may refuse a script when it is saved, but one saved before runs as it did
// (a script that fails loses every rule, and the message lands in INBOX)
//
describe('Sieve scripts saved before stricter checks still run', () => {
  const { SieveFilterHandler } = require('../../helpers/sieve/filter-handler');
  const { SieveSecurityValidator } = require('../../helpers/sieve/security');
  const {
    validateSieveCapabilities
  } = require('../../helpers/sieve/capabilities');
  const sieveParser = require('../../helpers/sieve/parser');

  // (what the pre-save hook of app/models/sieve-scripts.js runs)
  const save = (script) => {
    const syntax = sieveParser.validate(script);
    if (!syntax.valid) return { valid: false, errors: syntax.errors };
    const capabilities = validateSieveCapabilities(sieveParser.parse(script));
    if (!capabilities.valid)
      return { valid: false, errors: capabilities.errors };
    const security = new SieveSecurityValidator().validate(script);
    const critical = (security.securityIssues || []).filter(
      (issue) => issue.severity === 'critical' || issue.severity === 'high'
    );
    return {
      valid: security.valid && critical.length === 0,
      errors: [...security.errors, ...critical]
    };
  };

  // (delivery: the message parsed as for the MX, the script executed)
  const deliver = async (script, raw, envelope) => {
    const integration = new SieveIntegration();
    const message = await integration.parseMessageForSieve(
      Buffer.isBuffer(raw) ? raw : Buffer.from(raw),
      envelope || { from: 'sender@example.com', to: ['me@example.com'] }
    );
    const warnings = [];
    const handler = new SieveFilterHandler({
      engine: new SieveEngine({
        logger: { ...logger, warn: (message) => warnings.push(message) }
      })
    });
    const result = await handler.executeScript(script, message);
    result.warnings = warnings;
    return result;
  };

  const filedInto = (result) => result.fileinto.map((f) => f.folder);
  const mail = (headers, body = 'hello') =>
    `From: sender@example.com\r\nTo: me@example.com\r\nSubject: Hi\r\n${headers}\r\n${body}\r\n`;

  it('compares :value of numbers as numbers without a comparator (RFC 5231)', async () => {
    const script =
      'require ["relational", "fileinto"]; if header :value "ge" "X-Spam-Score" "10" { discard; } elsif header :value "lt" "X-Spam-Score" "2" { fileinto "Clean"; }';
    assert.strictEqual(save(script).valid, true);

    const ham = await deliver(script, mail('X-Spam-Score: 7.5\r\n'));
    assert.strictEqual(ham.discard, false);
    assert.deepStrictEqual(filedInto(ham), []);
    const spam = await deliver(script, mail('X-Spam-Score: 12.3\r\n'));
    assert.strictEqual(spam.discard, true);
    const clean = await deliver(script, mail('X-Spam-Score: -0.4\r\n'));
    assert.deepStrictEqual(filedInto(clean), ['Clean']);

    // (:count too, and text that is not a number as i;ascii-casemap)
    const counted = await deliver(
      'require ["relational", "fileinto"]; if header :count "ge" "received" "10" { fileinto "Many"; } if header :value "gt" "subject" "HA" { fileinto "Text"; }',
      mail(
        Array.from({ length: 9 }, (_, i) => `Received: from h${i}\r\n`).join('')
      )
    );
    assert.deepStrictEqual(filedInto(counted), ['Text']);

    // (a comparator written orders as it does, RFC 4790)
    const casemap = await deliver(
      'require ["relational"]; if header :value "ge" :comparator "i;ascii-casemap" "X-Spam-Score" "10" { discard; }',
      mail('X-Spam-Score: 7.5\r\n')
    );
    assert.strictEqual(casemap.discard, true);
  });

  it('runs a require after other commands (RFC 5228 3.2)', async () => {
    const script =
      'require ["fileinto"];\nif header :contains "subject" "Invoice" { fileinto "Bills"; }\nrequire ["vacation"];\nvacation :days 7 "Away";';
    // (refused when saved, as RFC 5228 says)
    assert.strictEqual(save(script).valid, false);
    const result = await deliver(
      script,
      'From: a@example.com\r\nSubject: Invoice 12\r\n\r\nx'
    );
    assert.deepStrictEqual(filedInto(result), ['Bills']);
    assert.strictEqual(result.vacation.message, 'Away');

    for (const [other, expected] of [
      ['keep; require "fileinto"; fileinto "A";', ['A']],
      ['if true { require "vnd.dovecot.pipe"; } keep;', []],
      ['if true { require ["include"]; keep; }', []]
    ]) {
      assert.strictEqual(save(other).valid, false, other);
      const kept = await deliver(other, mail(''));
      assert.deepStrictEqual(filedInto(kept), expected, other);
      assert.strictEqual(kept.implicitKeep || kept.keep !== null, true, other);
    }
  });

  it('runs :matches and :regex keys against large messages', async () => {
    const big = 'x'.repeat(6_000_000);
    const unsubscribe = await deliver(
      'require ["body", "fileinto"]; if body :matches "*click here to unsubscribe from this list*" { fileinto "Lists"; }',
      mail(
        'Content-Type: text/plain\r\n',
        `${big} click here to unsubscribe from this list`
      )
    );
    assert.deepStrictEqual(filedInto(unsubscribe), ['Lists']);

    // (a 15MB attachment with :raw)
    const attachment = Buffer.from('a'.repeat(15_000_000)).toString('base64');
    const raw = await deliver(
      'require ["body", "fileinto"]; if body :raw :matches "*unsubscribe*" { fileinto "Raw"; }',
      'From: a@example.com\r\nSubject: s\r\nContent-Type: multipart/mixed; boundary=b\r\n\r\n' +
        '--b\r\nContent-Type: text/plain\r\n\r\nto unsubscribe click\r\n' +
        `--b\r\nContent-Type: application/octet-stream\r\nContent-Transfer-Encoding: base64\r\n\r\n${attachment}\r\n--b--\r\n`
    );
    assert.deepStrictEqual(filedInto(raw), ['Raw']);

    // (a key that would cost too much does not match, and the rest runs)
    const regex = `(?:${'[a-z]{2,40}\\\\s*'.repeat(30)})+unsubscribe`;
    const cost = await deliver(
      `require ["body", "regex", "fileinto"]; if body :regex "${regex}" { fileinto "Regex"; } fileinto "Rest";`,
      mail('Content-Type: text/html\r\n', `<p>${'word '.repeat(160_000)}</p>`)
    );
    assert.deepStrictEqual(filedInto(cost), ['Rest']);
    assert.match(cost.warnings.join('\n'), /not matched/);
  });

  it('responds once when a script rejects and replies (RFC 5429 2.4)', async () => {
    // (as Roundcube writes vacation and reject rules)
    const script =
      'require ["vacation", "reject", "fileinto"];\nif header :contains "subject" "Hi" { vacation :days 1 "Away"; }\nif header :contains "from" "sender" { reject "No"; }\nif true { reject "Again"; }\nfileinto "A";';
    assert.strictEqual(save(script).valid, true);
    const result = await deliver(script, mail(''));
    assert.deepStrictEqual(result.reject, { message: 'No', type: 'reject' });
    assert.strictEqual(result.vacation, null);
    assert.match(result.warnings.join('\n'), /dropped/);

    const vacation = await deliver(
      'require ["vacation"]; vacation "A"; vacation "B";',
      mail('')
    );
    assert.strictEqual(vacation.vacation.message, 'A');
  });

  it('drops repeated vacations and rejects quickly and warns once', async () => {
    const parts =
      Array.from(
        { length: 100 },
        (_, i) => `--b\r\nContent-Type: text/plain\r\n\r\npart ${i}\r\n`
      ).join('') + '--b--\r\n';
    const raw = mail(
      'MIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary="b"\r\n',
      parts
    );

    // (thousands of actions, then a vacation for each part 390 times)
    const script =
      'require ["vacation", "mime", "foreverypart"];\n' +
      `foreverypart { ${'keep; '.repeat(98)}}\n` +
      `foreverypart { ${'vacation "away"; '.repeat(390)}}\n`;
    // (7s when each vacation looked through every action before it)
    const start = Date.now();
    const result = await deliver(script, raw);
    assert.ok(
      Date.now() - start < SieveEngine.MAX_MATCH_TIME * 2,
      `took ${Date.now() - start}ms`
    );
    assert.strictEqual(result.vacation.message, 'away');
    assert.strictEqual(result.warnings.length, 1);

    // (the first reject wins over a vacation before it and every later one)
    const rejected = await deliver(
      'require ["vacation", "reject", "mime", "foreverypart"];\n' +
        'foreverypart { vacation "away"; reject "no"; vacation "again"; reject "again"; }',
      raw
    );
    assert.deepStrictEqual(rejected.reject, { message: 'no', type: 'reject' });
    assert.strictEqual(rejected.vacation, null);
    assert.strictEqual(rejected.warnings.length, 3);

    // (a notify without a valid method is skipped, and logged once)
    const notify = await deliver(
      'require ["enotify", "mime", "foreverypart", "fileinto"];\n' +
        'foreverypart { notify "xmpp:a@example.com"; notify "foo:b"; }\nfileinto "A";',
      raw
    );
    assert.deepStrictEqual(notify.notifications, []);
    assert.deepStrictEqual(filedInto(notify), ['A']);
    assert.strictEqual(notify.warnings.length, 1);
  });

  it('warns once for commands it skips in loops', async () => {
    // (50 parts, each inside the one before: three nested loops visit
    // thousands of them, and each command of these warned every time)
    let entity = 'Content-Type: text/plain\r\n\r\nleaf\r\n';
    for (let i = 1; i <= 50; i++)
      entity = `Content-Type: multipart/mixed; boundary="b${i}"\r\n\r\n--b${i}\r\nContent-Type: text/plain\r\n\r\npart ${i}\r\n--b${i}\r\n${entity}--b${i}--\r\n`;
    const raw = Buffer.from(
      `From: sender@example.com\r\nTo: me@example.com\r\nSubject: Hi\r\nMIME-Version: 1.0\r\n${entity}`
    );

    for (const block of [
      'deleteheader "Delivered-To"; '.repeat(10),
      'addheader "Delivered-To" "x"; '.repeat(10),
      // eslint-disable-next-line no-template-curly-in-string
      'redirect "a@${d}"; '.repeat(10),
      'foreverypart { keep; } '.repeat(10)
    ]) {
      const script =
        'require ["editheader", "mime", "foreverypart", "variables"];\n' +
        'set "d" "blocked.example";\n' +
        `foreverypart { foreverypart { foreverypart { ${block}} } }\n`;
      const integration = new SieveIntegration({
        store: {
          getActiveScript: async () => ({ name: 't', content: script })
        },
        config: { redirectDomainBlacklist: ['blocked.example'] }
      });
      const warnings = [];
      integration.engine.logger = {
        ...logger,
        warn: (message) => warnings.push(message)
      };
      await integration.processMessage({
        aliasId: 'alias-1',
        aliasAddress: 'me@example.com',
        raw,
        envelope: { from: 'sender@example.com', to: ['me@example.com'] },
        session: {}
      });
      assert.strictEqual(warnings.length, 1, block.slice(0, 30));
    }

    // (a key too costly for a long value, tested for each part)
    const parts =
      Array.from(
        { length: 100 },
        (_, i) => `--b\r\nContent-Type: text/plain\r\n\r\npart ${i}\r\n`
      ).join('') + '--b--\r\n';
    const cost = await deliver(
      'require ["mime", "foreverypart", "variables", "fileinto"];\n' +
        `set "k" "${'a?'.repeat(160)}";\n` +
        // eslint-disable-next-line no-template-curly-in-string
        'foreverypart { if header :matches "x-long" "${k}" { fileinto "A"; } }\n' +
        'fileinto "Rest";',
      mail(
        `X-Long: ${'x'.repeat(
          700_000
        )}\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary="b"\r\n`,
        parts
      )
    );
    assert.deepStrictEqual(filedInto(cost), ['Rest']);
    assert.strictEqual(cost.warnings.length, 1);
  });

  it('adds headers in loops quickly (RFC 5293)', async () => {
    const parts =
      Array.from(
        { length: 100 },
        (_, i) => `--b\r\nContent-Type: text/plain\r\n\r\npart ${i}\r\n`
      ).join('') + '--b--\r\n';
    const raw = mail(
      'MIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary="b"\r\n',
      parts
    );
    const script =
      'require ["editheader", "mime", "foreverypart", "relational", "index", "fileinto"];\n' +
      `foreverypart { ${'addheader "X-A" "first"; addheader :last "X-A" "last"; '.repeat(
        49
      )}}\n` +
      'if header :count "eq" "X-A" "9800" { fileinto "All"; }\n' +
      'if header :index 1 "X-A" "first" { fileinto "First"; }\n' +
      'if header :index 1 :last "X-A" "last" { fileinto "Last"; }';
    assert.strictEqual(save(script).valid, true);
    // (5s when each addheader copied the values)
    const start = Date.now();
    const result = await deliver(script, raw);
    assert.ok(
      Date.now() - start < SieveEngine.MAX_MATCH_TIME,
      `took ${Date.now() - start}ms`
    );
    assert.deepStrictEqual(filedInto(result), ['All', 'First', 'Last']);
  });

  it('compares :value of numbers as numbers with i;ascii-numeric (RFC 5231)', async () => {
    const script = (key) =>
      `require ["relational", "fileinto"]; if header :value "ge" :comparator "i;ascii-numeric" "X-Spam-Score" "${key}" { fileinto "Junk"; }`;
    for (const [score, key, expected] of [
      ['-1.2', '5', []],
      ['5.2', '5.5', []],
      ['7.50 / 15.00', '5', ['Junk']],
      ['12', '5', ['Junk']],
      // (a value that is not a number is greater than every number, RFC 4790)
      ['none', '5', ['Junk']]
    ]) {
      const result = await deliver(
        script(key),
        mail(`X-Spam-Score: ${score}\r\n`)
      );
      assert.deepStrictEqual(filedInto(result), expected, score);
    }

    // (i;ascii-casemap written compares the text, "10" before "9")
    const casemap = await deliver(
      'require ["relational", "fileinto"]; if header :value "ge" :comparator "i;ascii-casemap" "X-Spam-Score" "9" { fileinto "Junk"; }',
      mail('X-Spam-Score: 10\r\n')
    );
    assert.deepStrictEqual(filedInto(casemap), []);
  });

  it('sets the whole value for a key that matched with nothing to capture (RFC 5229)', async () => {
    // (the key is too long to capture from the body, so "*literal*" finds it
    // as :contains does)
    const body =
      ('lorem ipsum dolor sit amet '.repeat(40) + '\r\n').repeat(6800) +
      'Invoice number: ACME-INVOICE-2026-000123-PAYMENT-REMINDER-FINAL-NOTICE due';
    const result = await deliver(
      // eslint-disable-next-line no-template-curly-in-string
      'require ["variables", "fileinto", "body"];\nif header :matches "from" "*<*@*>" { set "sender" "${2}"; }\nif body :text :matches "*ACME-INVOICE-2026-000123-PAYMENT-REMINDER-FINAL-NOTICE*" { fileinto "Invoices/${sender}-${2}"; }',
      `From: Sender <sender@example.com>\r\nTo: me@example.com\r\nSubject: Hi\r\nContent-Type: text/plain\r\n\r\n${body}\r\n`
    );
    assert.deepStrictEqual(filedInto(result), ['Invoices/sender-']);
  });

  it('reads addflag with two flags as flags without "variables" (RFC 5232)', async () => {
    const script =
      'require ["imap4flags", "fileinto"]; addflag "\\\\Seen" "\\\\Flagged"; fileinto "A";';
    assert.strictEqual(save(script).valid, true);
    const result = await deliver(script, mail(''));
    assert.deepStrictEqual(result.fileinto, [
      {
        folder: 'A',
        flags: ['\\Seen', '\\Flagged'],
        create: false,
        copy: false,
        specialuse: null
      }
    ]);
    const hasflag = await deliver(
      'require ["imap4flags", "fileinto"]; addflag "\\\\Seen"; if hasflag "\\\\Flagged" "\\\\Seen" { fileinto "B"; }',
      mail('')
    );
    assert.deepStrictEqual(filedInto(hasflag), ['B']);
  });

  it('runs the old forms of notify (RFC 5435 drafts)', async () => {
    const importance = await deliver(
      'require ["enotify", "fileinto"]; notify :importance "high" "mailto:me2@example.net"; fileinto "A";',
      mail('')
    );
    assert.strictEqual(importance.notifications[0].importance, '1');
    assert.deepStrictEqual(filedInto(importance), ['A']);
    assert.strictEqual(
      save('require "enotify"; notify :importance "low" "mailto:a@b.c";').valid,
      true
    );

    // (no method: skipped, the rest runs; refused when saved)
    const methodless =
      'require ["enotify", "fileinto"]; notify :message "x"; fileinto "A";';
    assert.strictEqual(save(methodless).valid, false);
    const skipped = await deliver(methodless, mail(''));
    assert.deepStrictEqual(skipped.notifications, []);
    assert.deepStrictEqual(filedInto(skipped), ['A']);

    // (the draft :method "mailto" with the address in :options)
    const draft =
      'require ["notify", "fileinto"]; notify :method "mailto" :options "me2@example.net" :message "New mail"; fileinto "A";';
    assert.strictEqual(save(draft).valid, true);
    const sent = await deliver(draft, mail(''));
    assert.strictEqual(sent.notifications[0].method, 'mailto:me2@example.net');
    assert.deepStrictEqual(filedInto(sent), ['A']);
  });

  it('runs comparators without their require, and unknown ones as i;ascii-casemap', async () => {
    for (const comparator of [
      'i;ascii-numeric',
      'i;unicode-casemap',
      'i;octet',
      'i;ascii-casemap'
    ]) {
      const script = `require "fileinto"; if header :is :comparator "${comparator}" "x-n" "7" { fileinto "A"; }`;
      assert.strictEqual(save(script).valid, true, comparator);
      const result = await deliver(script, mail('X-N: 7\r\n'));
      assert.deepStrictEqual(filedInto(result), ['A'], comparator);
    }

    const unknown =
      'require "fileinto"; if header :contains :comparator "i;ascii-casemapp" "subject" "hi" { fileinto "A"; }';
    assert.strictEqual(save(unknown).valid, false);
    const result = await deliver(unknown, mail(''));
    assert.deepStrictEqual(filedInto(result), ['A']);
  });

  it('runs variables of any name and unknown namespaces (RFC 5229)', async () => {
    const dashed =
      // eslint-disable-next-line no-template-curly-in-string
      'require ["variables", "fileinto"]; set "my-folder" "Bills"; set "1" "one"; fileinto "${my-folder}"; fileinto "${1}";';
    assert.strictEqual(save(dashed).valid, false);
    const result = await deliver(dashed, mail(''));
    assert.deepStrictEqual(filedInto(result), ['Bills', 'one']);

    const namespace =
      // eslint-disable-next-line no-template-curly-in-string
      'require ["variables", "fileinto"]; fileinto "A${env.x}";';
    assert.strictEqual(save(namespace).valid, false);
    const expanded = await deliver(namespace, mail(''));
    assert.deepStrictEqual(filedInto(expanded), ['A']);
  });

  it('runs tag combinations that the RFCs forbid (RFC 5228 2.6)', async () => {
    for (const [script, check] of [
      [
        'require ["vacation-seconds"]; vacation :days 1 :seconds 3600 "x";',
        (result) => assert.strictEqual(result.vacation.seconds, 3600)
      ],
      [
        'require "fileinto"; if header :last :contains "subject" "hi" { fileinto "A"; }',
        (result) => assert.deepStrictEqual(filedInto(result), ['A'])
      ],
      [
        'require ["mime", "fileinto"]; if header :anychild :contains "subject" "hi" { fileinto "A"; }',
        (result) => assert.deepStrictEqual(filedInto(result), ['A'])
      ],
      [
        // eslint-disable-next-line no-template-curly-in-string
        'require ["variables", "fileinto"]; set :lower :upper "f" "Box"; fileinto "${f}";',
        (result) => assert.deepStrictEqual(filedInto(result), ['BOX'])
      ]
    ]) {
      assert.strictEqual(save(script).valid, false, script);
      check(await deliver(script, mail('')));
    }
  });
});
