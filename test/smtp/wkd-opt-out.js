/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Outbound SMTP encrypts a message to a recipient's key found with WKD,
// unless the sending alias has WKD lookup disabled (see #621).
//

const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const openpgp = require('openpgp');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const { Emails } = require('#models');
const { encoder } = require('#helpers/encoder-decoder');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();
const RECIPIENT = 'wkd@example.net';

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});
test.beforeEach(utils.setupFactories);

async function send(t, hasWkdDisabled) {
  const client = new Redis({ keyPrefix: `${t.title}:` });
  t.teardown(() => client.disconnect());

  // (the recipient's key, as a WKD lookup found it before, from the cache)
  const { publicKey } = await openpgp.generateKey({
    type: 'ecc',
    curve: 'curve25519',
    userIDs: [{ email: RECIPIENT }],
    format: 'object'
  });
  await client.set(`wkd:${RECIPIENT}`, encoder.pack(publicKey.write()));

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
      recipients: [user.email],
      has_wkd_disabled: hasWkdDisabled
    })
    .create();

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
      text: 'test'
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
        received.push(Buffer.concat(chunks).toString());
        fn();
      });
    }
  });
  await pify(server.listen.bind(server))(port);
  t.teardown(() => server.close());

  const info = await processEmail({ email, port, resolver, client });
  return { info, received };
}

test.serial('a message is encrypted to a key found with WKD', async (t) => {
  const { info, received } = await send(t, false);
  t.true(info[0].pgp);
  t.is(received.length, 1);
  t.true(received[0].includes('-----BEGIN PGP MESSAGE-----'));
});

test.serial(
  'a message from an alias with WKD lookup disabled is not encrypted',
  async (t) => {
    const { info, received } = await send(t, true);
    t.false(info[0].pgp);
    t.is(received.length, 1);
    t.false(received[0].includes('-----BEGIN PGP MESSAGE-----'));
  }
);
