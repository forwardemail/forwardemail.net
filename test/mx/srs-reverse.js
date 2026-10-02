/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Mail to an SRS address on our domain reverses to the original sender
// elsewhere and is relayed there, but only in reply to a message we
// forwarded with that SRS address (one reply per forwarded message), so a
// signed SRS address cannot be used to relay any number of messages.
//

const util = require('node:util');
const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const falso = require('@ngneat/falso');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('@forwardemail/mx-connect');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');
const { SRS } = require('sender-rewriting-scheme');

const utils = require('../utils');
const MX = require('../../mx-server');

const _ = require('#helpers/lodash');
const config = require('#config');
const env = require('#config/env');
const checkSRS = require('#helpers/check-srs');
const getRecipients = require('#helpers/get-recipients');
const logger = require('#helpers/logger');

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
const srs = new SRS(config.srs);
const tls = { rejectUnauthorized: false };

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

// how `helpers/on-data` passes an SRS recipient on after reversing it
function resolve(mx, srsAddress) {
  return getRecipients.call(mx, {
    envelope: {
      mailFrom: { address: '' },
      rcptTo: [
        {
          address: checkSRS(srsAddress),
          srs: true,
          srsAddress
        }
      ]
    }
  });
}

test('relays to an SRS address only in reply to a forwarded message', async (t) => {
  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  const { resolver } = mx;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  await mx.listen(await getPort());
  t.teardown(() => mx.close());

  // where the alias forwards to
  const received = [];
  const serverPort = await getPort();
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    onData(stream, session, fn) {
      const chunks = [];
      stream.pipe(
        new Writable({
          write(chunk, encoding, fn) {
            chunks.push(chunk);
            fn();
          }
        })
      );
      stream.on('end', () => {
        received.push({
          from: session.envelope.mailFrom.address,
          data: Buffer.concat(chunks).toString()
        });
        fn();
      });
    },
    logger: false,
    secure: false
  });
  await pify(server.listen.bind(server))(serverPort);
  t.teardown(() => server.close());

  const user = await t.context.userFactory.withState({ plan: 'free' }).create();
  const domain = await t.context.domainFactory
    .withState({
      name: `${falso.randWord()}.${_.sample(config.goodDomains)}`,
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver
    })
    .create();

  const sender = `victim@${falso.randWord()}-srs.example.com`;
  const senderDomain = sender.split('@')[1];
  const map = new Map();
  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
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
      [`forward-email-port=${serverPort}`, `forward-email=test@${IP_ADDRESS}`],
      true,
      ms('5m')
    )
  );
  // the sender's domain does not use our service
  map.set(
    `txt:${senderDomain}`,
    resolver.spoofPacket(senderDomain, 'TXT', ['v=spf1 ?all'], true)
  );
  map.set(
    `mx:${senderDomain}`,
    resolver.spoofPacket(
      senderDomain,
      'MX',
      [{ exchange: `mx.${senderDomain}`, priority: 0 }],
      true
    )
  );
  map.set(
    `txt:_dmarc.${senderDomain}`,
    resolver.spoofPacket(`_dmarc.${senderDomain}`, 'TXT', [], true)
  );
  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  const srsAddress = srs.forward(sender, env.WEB_HOST);

  // nothing was forwarded with this SRS address yet
  // (so it is rejected like any address on a domain without our records)
  let err = await t.throwsAsync(resolve(mx, srsAddress));
  t.true(err.notConfigured);

  // a message from the sender is forwarded with that SRS address
  const connection = await asyncMxConnect({
    target: IP_ADDRESS,
    port: mx.server.address().port,
    dnsOptions: { resolve: util.callbackify(resolver.resolve.bind(resolver)) }
  });
  await nodemailer
    .createTransport({
      logger,
      host: connection.host,
      port: connection.port,
      connection: connection.socket,
      ignoreTLS: true,
      secure: false,
      tls
    })
    .sendMail({
      envelope: { from: sender, to: `hello@${domain.name}` },
      raw: `
To: hello@${domain.name}
From: ${sender}
Subject: hello
Content-Type: text/plain; charset=us-ascii

Hello.`.trim()
    });
  await pWaitFor(() => received.length === 1, { timeout: ms('15s') });
  t.is(received[0].from.toLowerCase(), srsAddress.toLowerCase());

  // so one reply to it (e.g. a bounce) is relayed to the sender
  // (also when a server sends to the SRS address in lowercase)
  const data = await resolve(mx, srsAddress.toLowerCase());
  t.is(data.bounces.length, 0);
  t.deepEqual(
    data.normalized.map((recipient) => recipient.to),
    [[sender]]
  );

  // and no more than one
  err = await t.throwsAsync(resolve(mx, srsAddress));
  t.true(err.notConfigured);
});
