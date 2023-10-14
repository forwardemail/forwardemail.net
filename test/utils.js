/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const API = require('@ladjs/api');
const Redis = require('ioredis-mock');
const Web = require('@ladjs/web');
const _ = require('lodash');
const getPort = require('get-port');
const mongoose = require('mongoose');
const request = require('supertest');
const sharedConfig = require('@ladjs/shared-config');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { factory, MongooseAdapter } = require('factory-girl');

factory.setAdapter(new MongooseAdapter());

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const apiConfig = require('#config/api');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongooseHelper = require('#helpers/setup-mongoose');
const webConfig = require('#config/web');
const { Users, Domains, Payments, Aliases } = require('#models');

//
// setup utilities
//
exports.setupMongoose = async () => {
  await Promise.all(
    mongoose.connections.map(async (connection) => {
      const index = connection._connectionString.lastIndexOf('/');
      const dbName = connection._connectionString.slice(index + 1);
      const mongod = await MongoMemoryServer.create({ instance: { dbName } });
      const uri = mongod.getUri();
      connection._connectionString = uri;
      connection.mongod = mongod;
    })
  );

  await setupMongooseHelper(logger);
};

exports.setupWebServer = async (t) => {
  // must require here in order to load changes made during setup
  const webSharedConfig = sharedConfig('WEB');
  const client = new Redis(
    webSharedConfig.redis,
    logger,
    webSharedConfig.redisMonitor
  );
  await client.flushall();
  const web = new Web(
    {
      ..._.defaultsDeep(webConfig(client), t.context.webConfig || {}),
      redis: client
    },
    Users
  );
  const port = await getPort();
  t.context.web = request.agent(web.app.listen(port));
};

exports.setupApiServer = async (t) => {
  // must require here in order to load changes made during setup
  const apiSharedConfig = sharedConfig('API');
  const client = new Redis(
    apiSharedConfig.redis,
    logger,
    apiSharedConfig.redisMonitor
  );
  await client.flushall();
  const api = new API(
    {
      ...apiConfig,
      redis: client
    },
    Users
  );
  const port = await getPort();
  t.context.client = client;
  t.context.api = request.agent(api.app.listen(port));
};

exports.setupSMTPServer = async (t) => {
  // must require here in order to load changes made during setup
  const breeSharedConfig = sharedConfig('BREE');
  const client = new Redis(
    breeSharedConfig.redis,
    logger,
    breeSharedConfig.redisMonitor
  );
  await client.flushall();
  t.context.client = client;
};

// make sure to load the web server first using setupWebServer
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
    mongoose.connections.map((connection) => connection.mongod.stop())
  );
};

//
// factory definitions
// <https://github.com/simonexmachina/factory-girl>
//
exports.defineUserFactory = async () => {
  factory.define('user', Users, (buildOptions) => {
    const user = {
      email: factory.sequence('Users.email', (n) => `test${n}@example.com`),
      password: buildOptions.password || '!@K#NLK!#N'
    };

    if (buildOptions.resetToken) {
      user[config.userFields.resetToken] = buildOptions.resetToken;
      user[config.userFields.resetTokenExpiresAt] = new Date(
        Date.now() + 10000
      );
    }

    return user;
  });
};

exports.defineDomainFactory = () => {
  factory.define('domain', Domains, {
    name: factory.sequence('Domains.name', (n) => `example-${n}.com`)
  });
};

exports.definePaymentFactory = () => {
  factory.define('payment', Payments, {});
};

exports.defineAliasFactory = () => {
  factory.define('alias', Aliases, {
    name: factory.sequence('Aliases.name', (n) => `foo-${n}`)
  });
};
