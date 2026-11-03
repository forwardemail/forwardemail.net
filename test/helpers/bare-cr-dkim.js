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

const nodemailer = require('nodemailer');
const test = require('ava');
const { SMTPServer } = require('smtp-server');
const { dkimSign } = require('mailauth/lib/dkim/sign');
const { dkimVerify } = require('mailauth/lib/dkim/verify');

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048
});
const DNS_KEY = publicKey
  .export({ type: 'spki', format: 'der' })
  .toString('base64');

async function sendAndReceive(raw) {
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
    server.listen(0, '127.0.0.1', resolve);
  });
  try {
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

async function verify(raw) {
  const { results } = await dkimVerify(raw, {
    async resolver(name, type) {
      if (name === 'test._domainkey.example.com' && type === 'TXT')
        return [[`v=DKIM1; k=rsa; p=${DNS_KEY}`]];
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
