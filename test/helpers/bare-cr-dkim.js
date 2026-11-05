/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// nodemailer 10 turned a bare CR in a message into CRLF as it sent it, so a
// message that has one (it is not valid, but mail like that is received and
// forwarded) went out with other bytes than its DKIM and ARC signatures
// cover. It is sent as it is, as with nodemailer 9; only a dot between a
// bare CR and a line end is stuffed, so a receiver that ends a line at a
// bare CR does not take "\r.\r" for the end of the data (SMTP smuggling).
//

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const ip = require('ip');
const ms = require('ms');
const nodemailer = require('nodemailer');
const test = require('ava');
const { generateKey, readKey } = require('openpgp');
const { SMTPServer } = require('smtp-server');
const { dkimSign } = require('mailauth/lib/dkim/sign');
const { dkimVerify } = require('mailauth/lib/dkim/verify');

const utils = require('../utils');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const sendEmail = require('#helpers/send-email');

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048
});
const DNS_KEY = publicKey
  .export({ type: 'spki', format: 'der' })
  .toString('base64');

// (sent with nodemailer, or with `send`, to a local SMTP server)
async function sendAndReceive(raw, send) {
  let received;
  const server = new SMTPServer({
    authOptional: true,
    disabledCommands: ['STARTTLS'],
    onData(stream, session, fn) {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        received = Buffer.concat(chunks);
        fn();
      });
    }
  });
  await new Promise((resolve) => {
    server.listen(0, resolve);
  });
  try {
    if (send) {
      await send(server.server.address().port);
      return received;
    }

    const transporter = nodemailer.createTransport({
      host: '127.0.0.1',
      port: server.server.address().port,
      secure: false,
      ignoreTLS: true
    });
    await transporter.sendMail({
      envelope: { from: 'a@example.com', to: ['b@example.net'] },
      raw
    });
    return received;
  } finally {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  }
}

async function sign(raw) {
  // (as helpers/sign-message.js signs)
  const { signatures } = await dkimSign(raw, {
    canonicalization: 'relaxed/relaxed',
    algorithm: 'rsa-sha256',
    signatureData: [
      {
        signingDomain: 'example.com',
        selector: 'test',
        privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }),
        algorithm: 'rsa-sha256',
        canonicalization: 'relaxed/relaxed'
      }
    ]
  });
  return Buffer.concat([Buffer.from(signatures), raw]);
}

// (our own key, which a message without a domain is signed with)
const OUR_DNS_KEY = crypto
  .createPublicKey(config.signatureData.privateKey)
  .export({ type: 'spki', format: 'der' })
  .toString('base64');

async function verify(raw) {
  const { results } = await dkimVerify(raw, {
    async resolver(name, type) {
      if (name === 'test._domainkey.example.com' && type === 'TXT')
        return [[`v=DKIM1; k=rsa; p=${DNS_KEY}`]];
      if (
        name ===
          `${config.signatureData.selector}._domainkey.${config.signatureData.signingDomain}` &&
        type === 'TXT'
      )
        return [[`v=DKIM1; k=rsa; p=${OUR_DNS_KEY}`]];
      const err = new Error('not found');
      err.code = 'ENOTFOUND';
      throw err;
    }
  });
  return results[0].status.result;
}

test('a message with a bare CR keeps its DKIM signature when sent', async (t) => {
  const raw = await sign(
    Buffer.from(
      'From: a@example.com\r\nTo: b@example.net\r\nSubject: cr\r\n\r\none\rtwo\r\nthree\r\n'
    )
  );
  t.is(await verify(raw), 'pass');
  const received = await sendAndReceive(raw);
  t.true(received.includes(Buffer.from('one\rtwo')));
  t.is(await verify(received), 'pass');
});

test('a dot after a bare CR that is not a line of its own is sent as it is', async (t) => {
  const raw = await sign(
    Buffer.from(
      'From: a@example.com\r\nTo: b@example.net\r\nSubject: cr\r\n\r\nprice\r.50 total\r\n'
    )
  );
  const received = await sendAndReceive(raw);
  t.true(received.includes(Buffer.from('price\r.50 total')));
  t.is(await verify(received), 'pass');
});

test('a dot after a bare CR does not end the data', async (t) => {
  const raw = Buffer.from(
    'From: a@example.com\r\nTo: b@example.net\r\nSubject: smuggle\r\n\r\nbefore\r.\rMAIL FROM:<x@example.org>\r\nafter\r\n'
  );
  const received = await sendAndReceive(raw);
  // (the whole message arrived, with its dot stuffed after the bare CR)
  t.true(received.includes(Buffer.from('after')));
  t.true(received.includes(Buffer.from('MAIL FROM:<x@example.org>')));
});

test('a message with a dot after a bare CR passes DKIM when we send it', async (t) => {
  await utils.setupRedisClient(t);
  t.teardown(() => {
    t.context.client.disconnect();
    t.context.subscriber.disconnect();
  });
  const resolver = createTangerine(t.context.client, logger);
  const domain = `bare-cr-${crypto.randomUUID()}.example.com`;
  await resolver.options.cache.mset(
    new Map([
      [
        `mx:${domain}`,
        resolver.spoofPacket(
          domain,
          'MX',
          [{ exchange: ip.address(), priority: 5 }],
          true,
          ms('5m')
        )
      ]
    ])
  );

  const received = await sendAndReceive(null, (port) =>
    sendEmail({
      session: {
        envelope: {
          mailFrom: { address: 'a@example.com' },
          rcptTo: [{ address: `b@${domain}` }]
        },
        arrivalDateFormatted: new Date().toISOString().split('T')[0]
      },
      target: domain,
      port,
      envelope: { from: 'a@example.com', to: `b@${domain}` },
      raw: Buffer.from(
        `From: a@example.com\r\nTo: b@${domain}\r\nSubject: cr\r\n\r\nline1\r.\r\nend\r\n`
      ),
      resolver,
      client: t.context.client,
      hasWkdDisabled: true
    })
  );
  // (stuffed as it was sent, and signed that way)
  t.true(received.includes(Buffer.from('line1\r..\r\nend')));
  t.is(await verify(received), 'pass');
});

test('an encrypted message with a dot after a bare CR in a header passes DKIM when we send it', async (t) => {
  await utils.setupRedisClient(t);
  t.teardown(() => {
    t.context.client.disconnect();
    t.context.subscriber.disconnect();
  });
  const resolver = createTangerine(t.context.client, logger);
  const domain = `bare-cr-${crypto.randomUUID()}.example.com`;
  await resolver.options.cache.mset(
    new Map([
      [
        `mx:${domain}`,
        resolver.spoofPacket(
          domain,
          'MX',
          [{ exchange: ip.address(), priority: 5 }],
          true,
          ms('5m')
        )
      ]
    ])
  );
  const { publicKey: armoredKey } = await generateKey({
    type: 'ecc',
    curve: 'curve25519',
    userIDs: [{ email: `b@${domain}` }]
  });

  const received = await sendAndReceive(null, async (port) =>
    sendEmail({
      session: {
        envelope: {
          mailFrom: { address: 'a@example.com' },
          rcptTo: [{ address: `b@${domain}` }]
        },
        arrivalDateFormatted: new Date().toISOString().split('T')[0]
      },
      target: domain,
      port,
      envelope: { from: 'a@example.com', to: `b@${domain}` },
      raw: Buffer.from(
        `From: a@example.com\r\nTo: b@${domain}\r\nSubject: total\r.\r\n\r\nencrypted\r\n`
      ),
      resolver,
      client: t.context.client,
      publicKey: await readKey({ armoredKey })
    })
  );
  t.true(received.includes(Buffer.from('-----BEGIN PGP MESSAGE-----')));
  t.true(received.includes(Buffer.from('total\r..\r\n')));
  t.is(await verify(received), 'pass');
});
