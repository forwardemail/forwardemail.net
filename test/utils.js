/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

// <https://github.com/simonexmachina/factory-girl/issues/157>
// <https://github.com/thiagomini/factory-girl-ts/issues/34>
const BaseFactory = require('@zainundin/mongoose-factory').default;

const API = require('@ladjs/api');
const Redis = require('ioredis-mock');
const Web = require('@ladjs/web');
const _ = require('lodash');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { listen } = require('async-listen');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const apiConfig = require('#config/api');
const logger = require('#helpers/logger');
const setupMongooseHelper = require('#helpers/setup-mongoose');
const webConfig = require('#config/web');

const { Users, Domains, Payments, Aliases } = require('#models');

// dynamically import @ava/get-port
let getPort;
import('@ava/get-port').then((obj) => {
  getPort = obj.default;
});

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
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('15s') });
  const port = await getPort();
  // remove trailing slash from web URL
  t.context.webURL = await listen(web.server, { host: '127.0.0.1', port });
  t.context.webURL = t.context.webURL.toString().slice(0, -1);
  t.context.web = request.agent(web.server);
};

exports.setupApiServer = async (t) => {
  const client = new Redis({ keyPrefix: randomUUID() });
  client.setMaxListeners(0);
  t.context.client = client;
  const api = new API(
    {
      ...apiConfig,
      redis: client
    },
    Users
  );
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('15s') });
  const port = await getPort();
  // remove trailing slash from API URL
  t.context.apiURL = await listen(api.server, { host: '127.0.0.1', port });
  t.context.apiURL = t.context.apiURL.toString().slice(0, -1);
  t.context.api = request.agent(api.server);
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
      name: falso.randDomainName()
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
