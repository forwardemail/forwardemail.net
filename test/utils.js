/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const API = require('@ladjs/api');
const BaseFactory = require('@zainundin/mongoose-factory').default;
const Redis = require('ioredis-mock');
const Web = require('@ladjs/web');
const _ = require('lodash');
const falso = require('@ngneat/falso');
const getPort = require('get-port');
const mongoose = require('mongoose');
const request = require('supertest');
const sharedConfig = require('@ladjs/shared-config');
const { MongoMemoryServer } = require('mongodb-memory-server');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const apiConfig = require('#config/api');
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
  client.setMaxListeners(0);
  await client.flushall();
  const web = new Web(
    {
      ..._.defaultsDeep(webConfig(client), t.context.webConfig || {}),
      redis: client
    },
    Users
  );
  t.context._web = web;
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
  client.setMaxListeners(0);
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
  client.setMaxListeners(0);
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

class UserFactory extends BaseFactory {
  constructor() {
    super(Users);
  }

  async definition() {
    return {
      email: falso.randEmail({ provider: 'example', suffic: 'com' }),
      password: '!@K#NLK!#N' // TODO: use `falso.randPassword()`
    };
  }
}
exports.userFactory = new UserFactory();

class DomainFactory extends BaseFactory {
  constructor() {
    super(Domains);
  }

  async definition() {
    return {
      name: falso.randDomainName()
    };
  }
}
exports.domainFactory = new DomainFactory();

class PaymentFactory extends BaseFactory {
  constructor() {
    super(Payments);
  }

  async definition() {
    return {};
  }
}
exports.paymentFactory = new PaymentFactory();

//
// <https://github.com/simonexmachina/factory-girl/issues/157>
// <https://github.com/thiagomini/factory-girl-ts/issues/34>
//
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
exports.aliasFactory = new AliasFactory();
