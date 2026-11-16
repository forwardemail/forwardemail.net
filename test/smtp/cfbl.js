/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Mail our SMTP servers send asks mailbox providers for their users'
// complaints about it (see `addFeedbackFields` in helpers/arf-report.js): it
// names the abuse address in a CFBL-Address field (RFC 9477) and the email in
// a CFBL-Feedback-ID field, and is signed by our own domain too, which the
// field needs on mail From another domain, and by which our DKIM-FBL record
// is found.
//

const crypto = require('node:crypto');
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
const { dkimVerify } = require('mailauth/lib/dkim/verify');

const utils = require('../utils');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const { Emails } = require('#models');
const { createFeedbackId, readFeedbackId } = require('#helpers/arf-report');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();
const RECIPIENT = 'someone@example.net';
// (where a sender has complaints sent itself: not our domain, which the
//  domains of this test are subdomains of)
const OTHER_DOMAIN = 'lists.example.org';
const { signingDomain, selector } = config.signatureData;

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});
test.beforeEach(utils.setupFactories);

// the values of a field of a message's header, each on one line
function getFields(raw, name) {
  const header = raw
    .slice(0, raw.indexOf('\r\n\r\n'))
    .replace(/\r\n[ \t]+/g, ' ');
  return header
    .split('\r\n')
    .filter((line) => line.toLowerCase().startsWith(`${name.toLowerCase()}:`))
    .map((line) => line.slice(name.length + 1).trim());
}

// a message a domain's alias sends through our SMTP servers, as the server
// of its recipient receives it (`headers`: fields the sender set)
async function send(t, headers = {}) {
  const client = new Redis({ keyPrefix: `${t.title}:` });
  t.teardown(() => client.disconnect());

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

  const resolver = createTangerine(client, logger);

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  // (the DKIM keys in DNS: the domain's, and our own)
  const keys = new Map([
    [
      `${domain.dkim_key_selector}._domainkey.${domain.name}`,
      domain.dkim_public_key.toString('base64')
    ],
    [
      `${selector}._domainkey.${signingDomain}`,
      crypto
        .createPublicKey(config.signatureData.privateKey)
        .export({ type: 'spki', format: 'der' })
        .toString('base64')
    ]
  ]);

  const map = new Map();
  map.set(
    'mx:example.net',
    resolver.spoofPacket(
      'example.net',
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:${domain.dkim_key_selector}._domainkey.${domain.name}`,
    resolver.spoofPacket(
      `${domain.dkim_key_selector}._domainkey.${domain.name}`,
      'TXT',
      [`v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`],
      true
    )
  );
  map.set(
    `txt:${env.WEB_HOST}`,
    resolver.spoofPacket(
      env.WEB_HOST,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  map.set(
    `cname:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'CNAME',
      [env.WEB_HOST],
      true
    )
  );
  map.set(
    `txt:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:_dmarc.${domain.name}`,
    resolver.spoofPacket(
      `_dmarc.${domain.name}`,
      'TXT',
      [`v=DMARC1; p=reject; pct=100;`],
      true
    )
  );
  await resolver.options.cache.mset(map);

  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to: RECIPIENT,
      subject: 'test',
      text: 'test',
      headers
    },
    user: user._id
  });

  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const received = [];
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    secure: false,
    logger: false,
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
        received.push(Buffer.concat(chunks));
        fn();
      });
    }
  });
  await pify(server.listen.bind(server))(port);
  t.teardown(() => server.close());

  await processEmail({ email, port, resolver, client });
  t.is(received.length, 1);

  // (as its recipient's server verifies it)
  const { results } = await dkimVerify(received[0], {
    async resolver(name, type) {
      if (type === 'TXT' && keys.has(name))
        return [[`v=DKIM1; k=rsa; p=${keys.get(name)}`]];
      const err = new Error('not found');
      err.code = 'ENOTFOUND';
      throw err;
    }
  });

  return { domain, email, raw: received[0].toString(), signatures: results };
}

// (the fields a signature covers, lowercased)
function signedFields(signature) {
  return signature.signingHeaders.keys
    .split(':')
    .map((name) => name.trim().toLowerCase());
}

test.serial(
  'a message a domain sends names the abuse address and the email, and is signed by the domain and by us',
  async (t) => {
    const { domain, email, raw, signatures } = await send(t);

    t.deepEqual(getFields(raw, 'CFBL-Address'), [
      `${config.abuseEmail}; report=arf`
    ]);
    const ids = getFields(raw, 'CFBL-Feedback-ID');
    t.is(ids.length, 1);
    t.is(readFeedbackId(ids[0]), email.id);

    // (the domain's signature first, then ours: both pass, and both cover
    //  the two fields, RFC 9477 Section 3.1.4)
    t.deepEqual(
      signatures.map((result) => [result.signingDomain, result.status.result]),
      [
        [domain.name, 'pass'],
        [signingDomain, 'pass']
      ]
    );
    t.is(signatures[1].selector, selector);
    for (const signature of signatures) {
      t.true(signedFields(signature).includes('cfbl-address'));
      t.true(signedFields(signature).includes('cfbl-feedback-id'));
    }
  }
);

test.serial(
  'a sender’s own feedback loop fields are kept, but none that our signature would make ours',
  async (t) => {
    const { email, raw, signatures } = await send(t, {
      'CFBL-Address': [
        `fbl@${OTHER_DOMAIN}; report=xarf`,
        // (at our domain, a subdomain of it, and not an address alone)
        `support@${signingDomain}`,
        `support@${signingDomain}.`,
        `fbl@mail.${signingDomain}; report=arf`,
        `"fbl@${OTHER_DOMAIN}" <support@${signingDomain}>`
      ],
      // (a field of ours for an email someone else sent, copied from mail
      //  they received)
      'CFBL-Feedback-ID': createFeedbackId('0123456789abcdef01234567')
    });

    t.deepEqual(getFields(raw, 'CFBL-Address'), [
      `${config.abuseEmail}; report=arf`,
      `fbl@${OTHER_DOMAIN}; report=xarf`
    ]);
    // (ours, for this email, in place of the one copied)
    const ids = getFields(raw, 'CFBL-Feedback-ID');
    t.is(ids.length, 1);
    t.is(readFeedbackId(ids[0]), email.id);
    t.deepEqual(
      signatures.map((result) => result.status.result),
      ['pass', 'pass']
    );
    // (each signature covers both CFBL-Address fields)
    for (const signature of signatures)
      t.is(
        signedFields(signature).filter((name) => name === 'cfbl-address')
          .length,
        2
      );
  }
);

test.serial(
  'a CFBL-Feedback-ID a sender set is replaced by ours, so a report of it alone names the email',
  async (t) => {
    const { email, raw } = await send(t, {
      'CFBL-Address': `fbl@${OTHER_DOMAIN}`,
      'CFBL-Feedback-ID': 'campaign:42:abcdef'
    });
    t.deepEqual(getFields(raw, 'CFBL-Address'), [
      `${config.abuseEmail}; report=arf`,
      `fbl@${OTHER_DOMAIN}`
    ]);
    const ids = getFields(raw, 'CFBL-Feedback-ID');
    t.is(ids.length, 1);
    t.is(readFeedbackId(ids[0]), email.id);
  }
);

test.serial(
  'with ARF_CFBL off a message has the domain’s signature alone and no fields of ours',
  async (t) => {
    config.arf.cfbl = false;
    t.teardown(() => {
      config.arf.cfbl = true;
    });
    const { domain, raw, signatures } = await send(t, {
      'CFBL-Address': `fbl@${OTHER_DOMAIN}`
    });
    t.deepEqual(getFields(raw, 'CFBL-Address'), [`fbl@${OTHER_DOMAIN}`]);
    t.deepEqual(getFields(raw, 'CFBL-Feedback-ID'), []);
    t.deepEqual(
      signatures.map((result) => [result.signingDomain, result.status.result]),
      [[domain.name, 'pass']]
    );
  }
);
