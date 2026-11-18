/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A message sent with UTF-8 in its header section (e.g. a From address
// written "info@bücher.example", RFC 6532) is delivered as it was written,
// and announced with the SMTPUTF8 parameter of MAIL FROM to a server that
// offers it (RFC 6531). The envelope stays ASCII (Punycode), a server without
// SMTPUTF8 gets the message as before, and a message with ASCII headers is
// not announced as internationalized, nor is one whose header bytes are not
// UTF-8.
//

const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');
const { randomstring } = require('@sidoshi/random-string');

const utils = require('../utils');
const SMTP = require('../../smtp-server');

const config = require('#config');
const env = require('#config/env');
const processEmail = require('#helpers/process-email');
const { Emails } = require('#models');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();
// eslint-disable-next-line no-control-regex
const ASCII = /^[\u0000-\u007F]+$/;
const client = new Redis();
client.setMaxListeners(0);

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

// a paid domain with a Unicode name, set up for outbound SMTP, and its alias
async function setup(t) {
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();

  await user.save();

  const smtp = new SMTP({ client: t.context.client }, false);
  const { resolver } = smtp;

  const domain = await t.context.domainFactory
    .withState({
      name: `bücher-${randomstring({
        characters: 'abcdefghijklmnopqrstuvwxyz',
        length: 10
      })}.example`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      name: 'info',
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const map = new Map();
  const spoof = (type, name, answers) =>
    map.set(
      `${type.toLowerCase()}:${name}`,
      resolver.spoofPacket(name, type, answers, true, ms('5m'))
    );

  // the recipient's MX is the local test server
  spoof('MX', 'test.com', [{ exchange: IP_ADDRESS, priority: 0 }]);
  spoof('TXT', env.WEB_HOST, [`v=spf1 ip4:${IP_ADDRESS} -all`]);

  // (DNS is asked for the name in Punycode)
  for (const name of [domain.name, punycode.toASCII(domain.name)]) {
    spoof('TXT', name, [`${config.paidPrefix}${domain.verification_record}`]);
    spoof('TXT', `${domain.dkim_key_selector}._domainkey.${name}`, [
      `v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`
    ]);
    spoof('CNAME', `${domain.return_path}.${name}`, [env.WEB_HOST]);
    spoof('TXT', `${domain.return_path}.${name}`, [
      `v=spf1 ip4:${IP_ADDRESS} -all`
    ]);
    spoof('TXT', `_dmarc.${name}`, [
      `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
    ]);
  }

  await resolver.options.cache.mset(map);

  return { user, domain, alias, resolver };
}

// a receiving server that keeps each message with the envelope it came in
// and the MAIL FROM command as it was sent
async function createServer(t, options = {}) {
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const received = [];
  const commands = new Map();
  const record = (data, prefix, line) => {
    if (data?.tnx === 'command' && data.command === 'MAIL')
      commands.set(data.cid, line);
  };

  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    secure: false,
    logger: {
      info: record,
      debug: record,
      error() {},
      warn() {},
      trace() {},
      fatal() {}
    },
    ...options,
    onData(stream, session, fn) {
      const chunks = [];
      stream.pipe(
        new Writable({
          write(chunk, encoding, next) {
            chunks.push(chunk);
            next();
          }
        })
      );
      stream.on('end', () => {
        received.push({
          raw: Buffer.concat(chunks),
          envelope: session.envelope,
          mail: commands.get(session.id)
        });
        fn();
      });
    }
  });
  await pify(server.listen.bind(server))(port);
  t.teardown(() => pify(server.close.bind(server))());
  return { port, received };
}

// the lines of the header section, as the bytes that were received
function getHeaderLines(raw) {
  const text = raw.toString('utf8');
  return text.slice(0, text.indexOf('\r\n\r\n')).split('\r\n');
}

function getRaw({ alias, domain }, lines = []) {
  return Buffer.from(
    [
      `Message-ID: <${randomstring({
        characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
        length: 16
      })}@${punycode.toASCII(domain.name)}>`,
      'To: test@test.com',
      `From: Bücher <${alias.name}@${domain.name}>`,
      'Subject: Test',
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 8bit',
      ...lines,
      '',
      'Grüße'
    ].join('\r\n')
  );
}

async function send(t, { user, resolver }, port, message) {
  const email = await Emails.queue({ message, user: user._id });
  await processEmail({ email, port, resolver, client });
  const sent = await Emails.findById(email._id).lean().exec();
  t.is(sent.status, 'sent', JSON.stringify(sent.rejectedErrors));
}

test('a message with a Unicode From address is announced with SMTPUTF8', async (t) => {
  const context = await setup(t);
  const { alias, domain } = context;
  const { port, received } = await createServer(t);

  await send(t, context, port, { raw: getRaw(context) });

  t.is(received.length, 1);
  const [{ raw, envelope, mail }] = received;

  // announced as an internationalized message
  t.true(envelope.smtpUtf8);
  t.regex(mail, / SMTPUTF8\b/);

  // while the envelope itself is ASCII
  t.regex(mail, ASCII);
  t.true(mail.includes(punycode.toASCII(domain.name)));
  t.is(envelope.rcptTo[0].address, 'test@test.com');

  // and the From address reads as it was written, not in Punycode
  const lines = getHeaderLines(raw);
  t.true(lines.includes(`From: Bücher <${alias.name}@${domain.name}>`));
  t.false(
    lines.some((line) => /^from:/i.test(line) && line.includes('xn--')),
    `${lines.join('\n')}`
  );
  t.true(raw.toString('utf8').endsWith('Grüße\r\n'));
});

test('a server without SMTPUTF8 gets the same message as before', async (t) => {
  const context = await setup(t);
  const { alias, domain } = context;
  const { port, received } = await createServer(t, { hideSMTPUTF8: true });

  await send(t, context, port, { raw: getRaw(context) });

  t.is(received.length, 1);
  const [{ raw, envelope, mail }] = received;
  t.false(envelope.smtpUtf8);
  t.notRegex(mail, /SMTPUTF8/);
  t.regex(mail, ASCII);
  t.true(
    getHeaderLines(raw).includes(`From: Bücher <${alias.name}@${domain.name}>`)
  );
});

test('a message with ASCII headers is not announced with SMTPUTF8', async (t) => {
  const context = await setup(t);
  const { alias, domain } = context;
  const { port, received } = await createServer(t);
  const from = `${alias.name}@${punycode.toASCII(domain.name)}`;

  // written by us from its fields: the From address is in Punycode
  await send(t, context, port, {
    from: `Bücher <${alias.name}@${domain.name}>`,
    to: 'test@test.com',
    subject: 'Grüße',
    text: 'Grüße'
  });

  // sent as it is, with UTF-8 in its body only
  await send(t, context, port, {
    raw: Buffer.from(
      [
        'To: test@test.com',
        `From: ${from}`,
        'Subject: Test',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=utf-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        'Grüße'
      ].join('\r\n')
    )
  });

  t.is(received.length, 2);

  // sent as it is, with header bytes of another charset (not UTF-8)
  await send(t, context, port, {
    raw: Buffer.concat([
      Buffer.from(`To: test@test.com\r\nFrom: ${from}\r\nSubject: Gr`),
      Buffer.from([0xfc, 0xdf]),
      Buffer.from('e\r\nMIME-Version: 1.0\r\n\r\nTest')
    ])
  });
  t.is(received.length, 3);
  t.false(received[2].envelope.smtpUtf8);
  t.notRegex(received[2].mail, /SMTPUTF8/);
  t.true(
    received.pop().raw.includes(Buffer.from([0x47, 0x72, 0xfc, 0xdf, 0x65]))
  );

  for (const { raw, envelope, mail } of received) {
    t.false(envelope.smtpUtf8);
    t.notRegex(mail, /SMTPUTF8/);
    const lines = getHeaderLines(raw);
    t.true(
      lines.some(
        (line) => /^from:/i.test(line) && line.includes(`<${from}>`)
      ) || lines.includes(`From: ${from}`),
      `${lines.join('\n')}`
    );
    t.regex(lines.join('\n'), ASCII);
  }
});
