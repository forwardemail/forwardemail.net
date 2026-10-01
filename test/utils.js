/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');

const x509 = require('@peculiar/x509');
const { Crypto } = require('@peculiar/webcrypto');

// <https://github.com/simonexmachina/factory-girl/issues/157>
// <https://github.com/thiagomini/factory-girl-ts/issues/34>
const BaseFactory = require('@zainundin/mongoose-factory').default;

const Redis = require('ioredis-mock');
const Web = require('@ladjs/web');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { listen } = require('async-listen');

const API = require('../api-server');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const _ = require('#helpers/lodash');
const ApiWebSocketHandler = require('#helpers/api-websocket-handler');
const apiConfig = require('#config/api');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const { decoder } = require('#helpers/encoder-decoder');
const logger = require('#helpers/logger');
const setupMongooseHelper = require('#helpers/setup-mongoose');
const { useRevocationClient } = require('#helpers/credential-revocation');
const webConfig = require('#config/web');

const { Users, Domains, Payments, Aliases } = require('#models');

const crypto = new Crypto();
x509.cryptoProvider.set(crypto);

//
// setup utilities
//

//
// mongodb-memory-server checks that a random port is free by listening on it
// (on "::"), then starts mongod on 127.0.0.1. On macOS the check passes when
// something already listens on 127.0.0.1 with that port (a local mongod on
// 27017, or another shard's in-memory mongod), and mongod then fails with
// 'Port "..." already in use'. Start again on another port when that happens.
//
async function createMongoMemoryServer(dbName, attempts = 5) {
  for (let attempt = 1; ; attempt++) {
    // a new server each time, so the next port is random again
    const mongod = new MongoMemoryServer({ instance: { dbName } });
    try {
      await mongod.start();
      return mongod;
    } catch (err) {
      // (start() already stopped the process, this removes its data directory)
      await mongod.cleanup({ doCleanup: true, force: true }).catch(() => {});
      if (attempt >= attempts || !/already in use/i.test(err?.message || ''))
        throw err;
      logger.debug(err);
    }
  }
}

exports.setupMongoose = async () => {
  await Promise.all(
    mongoose.connections.map(async (connection) => {
      const index = connection._connectionString.lastIndexOf('/');
      const dbName = connection._connectionString.slice(index + 1);
      const mongod = await createMongoMemoryServer(dbName);
      const uri = mongod.getUri();
      connection._connectionString = uri;
      connection.mongod = mongod;
    })
  );

  await setupMongooseHelper(logger);
};

exports.setupWebServer = async (t) => {
  const client = new Redis({ keyPrefix: randomUUID() });
  client.setMaxListeners(0);
  const web = new Web(
    {
      ..._.defaultsDeep(webConfig(client), t.context.webConfig || {}),
      redis: client
    },
    Users
  );
  t.context._web = web;
  // remove trailing slash from web URL
  t.context.webURL = await listen(web.server, { host: '127.0.0.1', port: 0 });
  t.context.webURL = t.context.webURL.toString().slice(0, -1);
  t.context.web = request.agent(web.server);
};

exports.setupApiServer = async (t) => {
  const keyPrefix = randomUUID();
  const client = new Redis({ keyPrefix });
  client.setMaxListeners(0);
  // ioredis-mock's TIME joins the wall-clock second with an unrelated
  // sub-second value, so it is not monotonic; answer like Redis does
  client.time = async () => {
    const now = Math.floor((performance.timeOrigin + performance.now()) * 1000);
    return [String(Math.floor(now / 1e6)), String(now % 1e6)];
  };

  t.context.client = client;

  const subscriber = new Redis({ keyPrefix });
  subscriber.setMaxListeners(0);
  t.context.subscriber = subscriber;

  const SQLite = require('../sqlite-server');
  const sqlite = new SQLite({ client, subscriber });
  await sqlite.listen(0);
  const { port: sqlitePort } = sqlite.server.address();
  t.context.sqlite = sqlite;
  const wsp = createWebSocketAsPromised({
    port: sqlitePort
  });
  t.context.wsp = wsp;
  const api = new API(
    {
      ...apiConfig,
      client,
      // TODO: pass subscriber?
      wsp,
      resolver: sqlite.resolver
    },
    Users
  );
  // remove trailing slash from API URL
  t.context.apiURL = await listen(api.server, { host: '127.0.0.1', port: 0 });
  t.context.apiURL = t.context.apiURL.toString().slice(0, -1);
  t.context.api = request.agent(api.server);
  t.context._api = api;
  t.context.resolver = sqlite.resolver;

  // credential changes saved by the models revoke through this client
  useRevocationClient(client);

  // Set up WebSocket handler on the API server
  const wsHandler = new ApiWebSocketHandler({
    server: api.server,
    instance: api,
    client,
    resolver: sqlite.resolver
  });
  t.context.wsHandler = wsHandler;
};

//
// Record the realtime notifications (WebSocket and push) published for an
// alias through this Redis client, in the order they were sent
//
exports.captureNotifications = (client, aliasId) => {
  const events = [];
  const { publishBuffer } = client;
  client.publishBuffer = function (channel, message, ...args) {
    if (channel === config.WS_REDIS_CHANNEL_NAME) {
      const decoded = decoder.unpack(message);
      if (decoded?.aliasId === String(aliasId)) events.push(decoded.payload);
    }

    return publishBuffer.call(this, channel, message, ...args);
  };

  return {
    events,
    of: (event) => events.filter((e) => e.event === event),
    stop() {
      client.publishBuffer = publishBuffer;
    }
  };
};

exports.setupRedisClient = async (t) => {
  const keyPrefix = randomUUID();
  const client = new Redis({ keyPrefix });
  client.setMaxListeners(0);
  t.context.client = client;

  const subscriber = new Redis({ keyPrefix });
  subscriber.setMaxListeners(0);
  subscriber.channels.setMaxListeners(0);
  t.context.subscriber = subscriber;
};

exports.loginUser = async (t) => {
  const { web, user, password } = t.context;

  await web.post('/en/login').send({
    email: user.email,
    password
  });
};

//
// teardown utilities
//
exports.teardownMongoose = async () => {
  await mongoose.disconnect();
  await Promise.all(
    mongoose.connections.map((connection) =>
      connection?.mongod?.stop === 'function' ? connection.mongod.stop() : ''
    )
  );
};

class UserFactory extends BaseFactory {
  constructor() {
    super(Users);
  }

  async definition() {
    return {
      email: falso.randEmail({ provider: 'example', suffic: 'com' }),
      password: falso.randPassword()
    };
  }
}

exports.UserFactory = UserFactory;

class DomainFactory extends BaseFactory {
  constructor() {
    super(Domains);
  }

  async definition() {
    return {
      // Never create a test domain from the public DNS namespace. MX tests
      // may forward to a factory-generated recipient and must not reach an
      // unrelated live host when a fixture lacks a local DNS override.
      // `example.com` is reserved for documentation and is accepted by the
      // application's domain denylist unlike reserved testing TLDs.
      name: `test-${randomUUID()}.example.com`
    };
  }
}

exports.DomainFactory = DomainFactory;

class PaymentFactory extends BaseFactory {
  constructor() {
    super(Payments);
  }

  async definition() {
    return {};
  }
}

exports.PaymentFactory = PaymentFactory;

class AliasFactory extends BaseFactory {
  constructor() {
    super(Aliases);
  }

  async definition() {
    return {
      name: falso.randFirstName()
    };
  }
}

exports.AliasFactory = AliasFactory;

exports.setupFactories = (t) => {
  t.context.userFactory = new UserFactory();
  t.context.domainFactory = new DomainFactory();
  t.context.paymentFactory = new PaymentFactory();
  t.context.aliasFactory = new AliasFactory();
};

exports.teardownApiServer = async (t) => {
  // close API WebSocket handler
  if (t.context.wsHandler) {
    try {
      await t.context.wsHandler.close();
    } catch (err) {
      logger.debug(err);
    }
  }

  // close websocket connection
  if (t.context.wsp) {
    try {
      await t.context.wsp.close();
    } catch (err) {
      logger.debug(err);
    }
  }

  // close sqlite server
  if (t.context.sqlite) {
    try {
      await t.context.sqlite.close();
    } catch (err) {
      logger.debug(err);
    }
  }

  // close API server
  if (t.context._api && t.context._api.server) {
    try {
      await new Promise((resolve, reject) => {
        t.context._api.server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    } catch (err) {
      logger.debug(err);
    }
  }

  // disconnect redis clients
  if (t.context.client) {
    try {
      t.context.client.disconnect();
    } catch (err) {
      logger.debug(err);
    }
  }

  if (t.context.subscriber) {
    try {
      t.context.subscriber.disconnect();
    } catch (err) {
      logger.debug(err);
    }
  }
};

exports.teardownWebServer = async (t) => {
  // close web server
  if (t.context._web && t.context._web.server) {
    try {
      await new Promise((resolve, reject) => {
        t.context._web.server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    } catch (err) {
      logger.debug(err);
    }
  }
};

async function generateSmtpKeys() {
  // 2. Generate RSA Key Pair
  const alg = {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256',
    publicExponent: new Uint8Array([1, 0, 1]),
    modulusLength: 2048
  };
  const keys = await crypto.subtle.generateKey(alg, true, ['sign', 'verify']);

  // 3. Create the Self-Signed Certificate
  const cert = await x509.X509CertificateGenerator.createSelfSigned({
    serialNumber: '01',
    name: 'CN=localhost', // Match your SMTP server domain
    notBefore: new Date(),
    notAfter: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    signingAlgorithm: alg,
    keys,
    extensions: [
      new x509.BasicConstraintsExtension(false, true), // Not a CA
      new x509.KeyUsagesExtension(
        // eslint-disable-next-line no-bitwise
        x509.KeyUsageFlags.digitalSignature |
          x509.KeyUsageFlags.keyEncipherment,
        true
      )
    ]
  });

  // 4. Export to PEM strings for smtp-server
  const certPem = cert.toString('pem');

  // Exporting private key requires pkcs8 format
  const privateKeyBuffer = await crypto.subtle.exportKey(
    'pkcs8',
    keys.privateKey
  );
  const keyPem = `-----BEGIN PRIVATE KEY-----\n${Buffer.from(privateKeyBuffer)
    .toString('base64')
    .match(/.{1,64}/g)
    .join('\n')}\n-----END PRIVATE KEY-----`;

  return { key: keyPem, cert: certPem };
}

exports.generateSmtpKeys = generateSmtpKeys;

// Rendered pages embed rev-hashed asset filenames (e.g.
// favicon-32x32-e8ecadcbfb.png) and their subresource-integrity hashes, both a
// product of the local `gulp build` that differ between build environments
// (image optimisers are not byte-identical across machines). Snapshotting them
// verbatim ties the snapshot to one exact build, so a fresh checkout fails the
// local-only (`if (!isCI)`) page snapshots with no source change. Neutralise
// those hashes before snapshotting so the snapshot captures page structure, not
// build noise.
exports.normalizeBuildHashes = (html) =>
  html
    .replace(
      /-[\da-f]{10}(\.(?:png|svg|jpe?g|ico|webp|css|js|woff2?|mp4|webm))/g,
      '-HASH$1'
    )
    .replace(/(integrity="sha\d{3}-)[^"]+"/g, '$1HASH"');
