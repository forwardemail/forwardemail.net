/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A self-hosted install hosting several domains, whose MX records point at
// its own public address, refused mail from one of them to another: an MX at
// an address of a local network interface is not delivered to (#610).
// `SMTP_ALLOW_LOCAL_MX=true` allows it there, and only there.
//

const { EventEmitter } = require('node:events');
const net = require('node:net');
const os = require('node:os');

const sinon = require('sinon');
const test = require('ava');

// (this host's public address; mx-connect reads the interfaces once, when it
// is loaded)
const PUBLIC_ADDRESS = '93.184.216.34';
const { networkInterfaces } = os;
os.networkInterfaces = () => ({
  ...networkInterfaces(),
  eth9: [
    {
      address: PUBLIC_ADDRESS,
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: false,
      cidr: `${PUBLIC_ADDRESS}/24`
    }
  ]
});

const env = require('#config/env');
const getTransporter = require('#helpers/get-transporter');
const logger = require('#helpers/logger');

os.networkInterfaces = networkInterfaces;

const RECORDS = {
  'hosted.example:MX': [{ exchange: 'mx.hosted.example', priority: 10 }],
  'mx.hosted.example:A': [PUBLIC_ADDRESS],
  'private.example:MX': [{ exchange: 'mx.private.example', priority: 10 }],
  'mx.private.example:A': ['10.0.0.1', '169.254.169.254']
};

const resolver = {
  async resolve(name, type = 'A') {
    const answer = RECORDS[`${name}:${type}`];
    if (answer) return answer;
    const err = new Error(`queryNotFound ${name}`);
    err.code = 'ENOTFOUND';
    throw err;
  }
};

// (each connection attempt is recorded, and refused)
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

async function deliver(t, target, values) {
  const original = {
    NODE_ENV: env.NODE_ENV,
    SELF_HOSTED: env.SELF_HOSTED,
    SMTP_ALLOW_LOCAL_MX: env.SMTP_ALLOW_LOCAL_MX
  };
  const connect = stubConnect();
  // (test mode delivers to local servers, so nothing is blocked in it)
  Object.assign(env, { NODE_ENV: 'production' }, values);
  try {
    const err = await t.throwsAsync(
      getTransporter({
        target,
        port: 25,
        resolver,
        logger,
        cache: { get: async () => false, set: async () => false }
      })
    );
    return {
      err,
      addresses: connect.getCalls().map((call) => {
        const [options] = call.args;
        return typeof options === 'object' ? options.host : options;
      })
    };
  } finally {
    connect.restore();
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete env[key];
      else env[key] = value;
    }
  }
}

test.serial('an MX at a local address is refused by default', async (t) => {
  for (const values of [
    {},
    { SELF_HOSTED: false, SMTP_ALLOW_LOCAL_MX: true },
    { SELF_HOSTED: true, SMTP_ALLOW_LOCAL_MX: false }
  ]) {
    const { err, addresses } = await deliver(t, 'hosted.example', values);
    const label = JSON.stringify(values);
    t.is(err.category, 'dns', `${label}`);
    t.deepEqual(addresses, [], `${label}`);
  }
});

test.serial(
  'a self-hosted install that allows it delivers to its own MX',
  async (t) => {
    const { err, addresses } = await deliver(t, 'hosted.example', {
      SELF_HOSTED: true,
      SMTP_ALLOW_LOCAL_MX: 'true'
    });
    // (the connection is attempted, and refused by the stub)
    t.true(addresses.includes(PUBLIC_ADDRESS));
    t.not(err.category, 'dns');
  }
);

test.serial(
  'allowing it still refuses addresses that are not public',
  async (t) => {
    const { err, addresses } = await deliver(t, 'private.example', {
      SELF_HOSTED: true,
      SMTP_ALLOW_LOCAL_MX: 'true'
    });
    t.is(err.category, 'dns');
    t.deepEqual(addresses, []);
  }
);
