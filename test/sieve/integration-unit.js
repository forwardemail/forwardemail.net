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
      'require ["fileinto", "editheader", "vacation"]; addheader "X-A" "1"; fileinto "A"; vacation "a"; vacation "b";'
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
