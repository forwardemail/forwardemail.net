/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { EventEmitter } = require('node:events');
const https = require('node:https');
const net = require('node:net');
const { callbackify } = require('node:util');

const mxConnect = require('@forwardemail/mx-connect');
const pify = require('pify');
const sinon = require('sinon');
const test = require('ava');

const config = require('#config');
const env = require('#config/env');
const getTransporter = require('#helpers/get-transporter');
const logger = require('#helpers/logger');
const {
  createPublicResolve,
  publicConnectHook
} = require('#helpers/public-mx-guard');

const asyncMxConnect = pify(mxConnect);

//
// Tangerine-compatible resolver with fixed answers (no network access)
//
function createResolver(records) {
  return {
    async resolve(name, type = 'A') {
      const answer = records[`${name}:${type}`];
      if (answer) return answer;
      const err = new Error(`queryNotFound ${name}`);
      err.code = 'ENOTFOUND';
      throw err;
    }
  };
}

//
// Record every outbound connection attempt instead of opening sockets;
// each attempt fails as if the connection was refused.
//
function stubConnect() {
  return sinon.stub(net, 'connect').callsFake(() => {
    const socket = new EventEmitter();
    socket.destroy = () => {};
    setImmediate(() => {
      const err = new Error('connect ECONNREFUSED');
      err.code = 'ECONNREFUSED';
      socket.emit('error', err);
    });
    return socket;
  });
}

// non-public addresses that are not covered by mx-connect's own
// `blockLocalAddresses` option (it only blocks "loopback" and "private")
const PRIVATE_RECORDS = {
  'evil.example:MX': [{ exchange: 'mx.evil.example', priority: 10 }],
  'mx.evil.example:A': ['169.254.169.254', '100.64.0.1'],
  'mx.evil.example:AAAA': ['::ffff:127.0.0.1', 'fd00::1', 'fe80::1']
};

test.afterEach.always(() => {
  sinon.restore();
});

test.serial(
  'local MX delivery requires an explicit self-hosted opt-in',
  (t) => {
    const original = {
      NODE_ENV: env.NODE_ENV,
      SELF_HOSTED: env.SELF_HOSTED,
      SMTP_ALLOW_LOCAL_MX: env.SMTP_ALLOW_LOCAL_MX
    };

    try {
      env.NODE_ENV = 'production';

      env.SELF_HOSTED = 'false';
      env.SMTP_ALLOW_LOCAL_MX = 'true';
      t.true(getTransporter.shouldBlockLocalAddresses());

      env.SELF_HOSTED = 'true';
      env.SMTP_ALLOW_LOCAL_MX = 'false';
      t.true(getTransporter.shouldBlockLocalAddresses());

      env.SELF_HOSTED = 'true';
      env.SMTP_ALLOW_LOCAL_MX = 'true';
      t.false(getTransporter.shouldBlockLocalAddresses());

      env.NODE_ENV = 'test';
      env.SELF_HOSTED = 'false';
      env.SMTP_ALLOW_LOCAL_MX = 'false';
      t.false(getTransporter.shouldBlockLocalAddresses());
    } finally {
      for (const [key, value] of Object.entries(original)) {
        if (value === undefined) delete env[key];
        else env[key] = value;
      }
    }
  }
);

test.serial(
  'getTransporter does not connect to non-public MX addresses',
  async (t) => {
    const connect = stubConnect();
    // the guard (like `blockLocalAddresses`) is not used in test mode since
    // the test suites deliver to local servers
    const { NODE_ENV } = env;
    env.NODE_ENV = 'production';
    try {
      const err = await t.throwsAsync(
        getTransporter({
          target: 'evil.example',
          port: 25,
          resolver: createResolver(PRIVATE_RECORDS),
          logger,
          cache: { get: async () => false, set: async () => false }
        })
      );
      t.is(err.category, 'dns');
      t.is(connect.callCount, 0, 'no connection may be attempted');
    } finally {
      env.NODE_ENV = NODE_ENV;
    }
  }
);

test.serial(
  'self-hosted local MX opt-in still rejects non-public destinations',
  async (t) => {
    const connect = stubConnect();
    const original = {
      NODE_ENV: env.NODE_ENV,
      SELF_HOSTED: env.SELF_HOSTED,
      SMTP_ALLOW_LOCAL_MX: env.SMTP_ALLOW_LOCAL_MX
    };

    env.NODE_ENV = 'production';
    env.SELF_HOSTED = 'true';
    env.SMTP_ALLOW_LOCAL_MX = 'true';

    try {
      const err = await t.throwsAsync(
        getTransporter({
          target: 'evil.example',
          port: 25,
          resolver: createResolver(PRIVATE_RECORDS),
          logger,
          cache: { get: async () => false, set: async () => false }
        })
      );

      t.is(err.category, 'dns');
      t.is(connect.callCount, 0, 'no connection may be attempted');
    } finally {
      for (const [key, value] of Object.entries(original)) {
        if (value === undefined) delete env[key];
        else env[key] = value;
      }
    }
  }
);

test.serial(
  'getTransporter does not connect to a non-public IP address target',
  async (t) => {
    const connect = stubConnect();
    const { NODE_ENV } = env;
    env.NODE_ENV = 'production';
    try {
      for (const target of ['169.254.169.254', '100.64.0.1']) {
        const err = await t.throwsAsync(
          getTransporter({
            target,
            port: 25,
            resolver: createResolver({}),
            logger,
            cache: { get: async () => false, set: async () => false }
          })
        );
        t.is(err.code, 'EPRIVATEHOST', `target ${target}`);
      }

      t.is(connect.callCount, 0, 'no connection may be attempted');
    } finally {
      env.NODE_ENV = NODE_ENV;
    }
  }
);

test.serial(
  'non-public answers are dropped and a public MX host is still used',
  async (t) => {
    const connect = stubConnect();
    const resolver = createResolver({
      'mixed.example:MX': [
        { exchange: 'mx1.mixed.example', priority: 10 },
        { exchange: 'mx2.mixed.example', priority: 20 }
      ],
      'mx1.mixed.example:A': ['169.254.169.254'],
      'mx2.mixed.example:A': ['10.0.0.1', '93.184.216.34']
    });
    await t.throwsAsync(
      asyncMxConnect({
        target: 'mixed.example',
        port: 25,
        maxConnectTime: 1000,
        dnsOptions: {
          blockLocalAddresses: true,
          ignoreIPv6: true,
          resolve: createPublicResolve(
            callbackify(resolver.resolve.bind(resolver))
          )
        },
        connectHook: publicConnectHook
      })
    );
    t.deepEqual(
      connect.getCalls().map((call) => call.args[0].host),
      ['93.184.216.34']
    );
  }
);

test.serial(
  'an MX exchange that is an IP address is refused before connecting',
  async (t) => {
    const connect = stubConnect();
    const resolver = createResolver({
      'literal.example:MX': [{ exchange: '169.254.169.254', priority: 10 }]
    });
    const err = await t.throwsAsync(
      asyncMxConnect({
        target: 'literal.example',
        port: 25,
        dnsOptions: {
          blockLocalAddresses: true,
          resolve: createPublicResolve(
            callbackify(resolver.resolve.bind(resolver))
          )
        },
        connectHook: publicConnectHook
      })
    );
    t.is(err.code, 'EPRIVATEHOST');
    t.is(connect.callCount, 0);
  }
);

test.serial('non-address record types pass through unchanged', async (t) => {
  const records = [['v=STSv1; id=1']];
  const resolve = createPublicResolve((name, type, fn) => {
    fn(null, records);
  });
  const result = await pify(resolve)('_mta-sts.example.com', 'TXT');
  t.is(result, records);
});

test.serial(
  'the MTA-STS policy is not fetched from a non-public address',
  async (t) => {
    const connect = stubConnect();
    // (the policy request is made with https.request to the resolved address)
    const request = sinon.stub(https, 'request').callsFake(() => {
      throw new Error('no request may be made');
    });
    const resolver = createResolver({
      'sts.example:MX': [{ exchange: 'mx.sts.example', priority: 10 }],
      'mx.sts.example:A': ['93.184.216.34'],
      '_mta-sts.sts.example:TXT': [['v=STSv1; id=1']],
      'mta-sts.sts.example:A': ['169.254.169.254'],
      'mta-sts.sts.example:AAAA': ['fd00::1']
    });
    // MTA-STS and the guard are only used outside of test mode
    const { NODE_ENV } = env;
    const configEnv = config.env;
    env.NODE_ENV = 'production';
    config.env = 'production';
    try {
      await t.throwsAsync(
        getTransporter({
          target: 'sts.example',
          port: 25,
          resolver,
          logger,
          cache: { get: async () => false, set: async () => false }
        })
      );
      t.is(request.callCount, 0, 'the policy may not be requested');
      // the public MX host is still tried
      t.true(connect.called);
      t.is(connect.firstCall.args[0].host, '93.184.216.34');
    } finally {
      env.NODE_ENV = NODE_ENV;
      config.env = configEnv;
    }
  }
);
