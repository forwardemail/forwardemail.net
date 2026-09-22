/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const utils = require('../utils');
const createTangerine = require('#helpers/create-tangerine');
const isForwardConfirmedRdns = require('#helpers/is-forward-confirmed-rdns');
const logger = require('#helpers/logger');

const HOSTNAME = 'mx1.fcrdns-test.com';

test.beforeEach(async (t) => {
  await utils.setupRedisClient(t);
  t.context.resolver = createTangerine(t.context.client, logger);
});

test.afterEach.always((t) => {
  t.context.client.disconnect();
  t.context.subscriber.disconnect();
});

async function spoof(t, rrtype, answers) {
  const { resolver } = t.context;
  const map = new Map();
  map.set(
    `${rrtype.toLowerCase()}:${HOSTNAME}`,
    resolver.spoofPacket(HOSTNAME, rrtype, answers, true)
  );
  await resolver.options.cache.mset(map);
}

test('confirms an IPv4 client listed in the hostname A records (real resolver)', async (t) => {
  await spoof(t, 'A', ['203.0.113.7', '203.0.113.8']);
  t.true(
    await isForwardConfirmedRdns(t.context.resolver, HOSTNAME, '203.0.113.8')
  );
});

test('does not confirm an IPv4 client absent from the hostname A records (real resolver)', async (t) => {
  await spoof(t, 'A', ['203.0.113.7']);
  t.false(
    await isForwardConfirmedRdns(t.context.resolver, HOSTNAME, '203.0.113.9')
  );
});

test('confirms an IPv6 client via AAAA records and compares canonical forms (real resolver)', async (t) => {
  await spoof(t, 'AAAA', ['2001:db8::1']);
  t.true(
    await isForwardConfirmedRdns(
      t.context.resolver,
      HOSTNAME,
      '2001:0db8:0000:0000:0000:0000:0000:0001'
    )
  );
  t.false(
    await isForwardConfirmedRdns(t.context.resolver, HOSTNAME, '2001:db8::2')
  );
});

test('treats an IPv4-mapped IPv6 client address as its IPv4 form', async (t) => {
  const resolver = {
    async resolve4() {
      return ['198.51.100.4'];
    },
    async resolve6() {
      throw new Error('should not query AAAA for an IPv4-mapped address');
    }
  };
  t.true(
    await isForwardConfirmedRdns(resolver, HOSTNAME, '::ffff:198.51.100.4')
  );
});

test('fails closed when the forward lookup errors or returns nothing', async (t) => {
  const failing = {
    async resolve4() {
      const err = new Error('queryA ENOTFOUND');
      err.code = 'ENOTFOUND';
      throw err;
    },
    async resolve6() {
      throw new Error('unexpected');
    }
  };
  t.false(await isForwardConfirmedRdns(failing, HOSTNAME, '198.51.100.4'));

  const empty = {
    async resolve4() {
      return [];
    },
    async resolve6() {
      return [];
    }
  };
  t.false(await isForwardConfirmedRdns(empty, HOSTNAME, '198.51.100.4'));
  t.false(await isForwardConfirmedRdns(empty, HOSTNAME, '2001:db8::1'));
});

test('fails closed on invalid input', async (t) => {
  const resolver = {
    async resolve4() {
      return ['198.51.100.4'];
    },
    async resolve6() {
      return ['2001:db8::1'];
    }
  };
  t.false(await isForwardConfirmedRdns(null, HOSTNAME, '198.51.100.4'));
  t.false(await isForwardConfirmedRdns({}, HOSTNAME, '198.51.100.4'));
  t.false(await isForwardConfirmedRdns(resolver, '', '198.51.100.4'));
  t.false(await isForwardConfirmedRdns(resolver, undefined, '198.51.100.4'));
  t.false(await isForwardConfirmedRdns(resolver, HOSTNAME, 'not-an-ip'));
  t.false(await isForwardConfirmedRdns(resolver, HOSTNAME, ''));
  t.false(await isForwardConfirmedRdns(resolver, HOSTNAME, undefined));
});

test('queries only the record type matching the client address family', async (t) => {
  const calls = [];
  const resolver = {
    async resolve4(name) {
      calls.push(['A', name]);
      return ['198.51.100.4'];
    },
    async resolve6(name) {
      calls.push(['AAAA', name]);
      return ['2001:db8::1'];
    }
  };
  t.true(await isForwardConfirmedRdns(resolver, HOSTNAME, '198.51.100.4'));
  t.true(await isForwardConfirmedRdns(resolver, HOSTNAME, '2001:db8::1'));
  t.deepEqual(calls, [
    ['A', HOSTNAME],
    ['AAAA', HOSTNAME]
  ]);
});

test('passes an abort controller through to the resolver', async (t) => {
  const abortController = new AbortController();
  let received;
  const resolver = {
    async resolve4(name, options, ac) {
      received = ac;
      return ['198.51.100.4'];
    },
    async resolve6() {
      return [];
    }
  };
  t.true(
    await isForwardConfirmedRdns(resolver, HOSTNAME, '198.51.100.4', {
      abortController
    })
  );
  t.is(received, abortController);
});

test('bounds the forward lookup and fails closed when it times out', async (t) => {
  let received;
  const resolver = {
    resolve4(name, options, ac) {
      received = ac;
      // never resolves on its own; only settles when aborted
      return new Promise((resolve, reject) => {
        ac.signal.addEventListener('abort', () => reject(new Error('aborted')));
      });
    },
    async resolve6() {
      return [];
    }
  };
  const start = Date.now();
  t.false(
    await isForwardConfirmedRdns(resolver, HOSTNAME, '198.51.100.4', {
      timeout: 50
    })
  );
  t.true(received instanceof AbortController);
  t.true(received.signal.aborted);
  t.true(Date.now() - start < 5000);
});
