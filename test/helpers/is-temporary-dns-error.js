/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A DNS lookup that got no answer is told from an answer (the name or its
// records do not exist) and from other errors with the same codes (e.g. a
// connection refused), as the errors are thrown by Node's resolver,
// Tangerine, mx-connect and nodemailer.
//

const dns = require('node:dns');
const net = require('node:net');

const Redis = require('ioredis-mock');
const nodemailer = require('nodemailer');
const test = require('ava');

const createTangerine = require('#helpers/create-tangerine');
const { isTemporaryDnsError } = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');

// (an ES module)
async function getPort() {
  const { default: get } = await import('get-port');
  return get();
}

// an error thrown by `fn`
async function thrown(fn) {
  try {
    await fn();
  } catch (err) {
    return err;
  }

  throw new Error('Nothing was thrown');
}

test.serial('a lookup that no server answered is one', async (t) => {
  // (no DNS server listens on this port)
  const resolver = new dns.promises.Resolver({ timeout: 500, tries: 1 });
  resolver.setServers([`127.0.0.1:${await getPort()}`]);
  const err = await thrown(() => resolver.resolveMx('example.com'));
  t.is(err.syscall, 'queryMx');
  t.true(isTemporaryDnsError(err));

  // (one Node's resolver reports as ECONNREFUSED, when it could not reach a
  //  server, is one: a code a refused connection has too)
  t.true(
    isTemporaryDnsError(
      Object.assign(new Error('queryMx ECONNREFUSED example.com'), {
        code: 'ECONNREFUSED',
        syscall: 'queryMx',
        hostname: 'example.com'
      })
    )
  );

  // (the same code, from a connection that was refused, is not one)
  const port = await getPort();
  const refused = await thrown(
    () =>
      new Promise((resolve, reject) => {
        const socket = net.connect(port, '127.0.0.1');
        socket.once('error', reject);
        socket.once('connect', () => {
          socket.destroy();
          resolve();
        });
      })
  );
  t.is(refused.code, 'ECONNREFUSED');
  t.false(isTemporaryDnsError(refused));
});

test.serial(
  'Tangerine errors: timed out, throttled and cancelled are; not found and no data are not',
  (t) => {
    const Tangerine = createTangerine(new Redis(), logger).constructor;
    const createError = (...args) => Tangerine.createError(...args);
    for (const code of ['ETIMEOUT', 'ESERVFAIL', 'EREFUSED', 'ECANCELLED'])
      t.true(
        isTemporaryDnsError(createError('example.com', 'MX', code)),
        `${code}`
      );
    // (an HTTP 429 from a DNS-over-HTTPS server is EBADRESP)
    t.true(isTemporaryDnsError(createError('example.com', 'TXT', undefined)));
    for (const code of ['ENOTFOUND', 'ENODATA'])
      t.false(
        isTemporaryDnsError(createError('example.com', 'MX', code)),
        `${code}`
      );

    // (errors from several servers, one of which timed out)
    const combined = Tangerine.combineErrors([
      createError('example.com', 'A', 'ENOTFOUND'),
      createError('example.com', 'A', 'ETIMEOUT')
    ]);
    t.true(isTemporaryDnsError(combined));
  }
);

test.serial(
  'as mx-connect and nodemailer wrap them, and once stored',
  async (t) => {
    // mx-connect: a lookup error it rewrote, keeping its code
    const mx = Object.assign(
      new Error(
        'DNS error occurred while resolving the Mail Exchange (MX) server for the specified domain (example.net). DNS server returned answer with no data.'
      ),
      { code: 'ESERVFAIL', category: 'dns', temporary: true }
    );
    t.true(isTemporaryDnsError(mx));
    t.false(
      isTemporaryDnsError(
        Object.assign(new Error('x'), mx, { code: 'ENOTFOUND' })
      )
    );

    // nodemailer: its own lookup of a host that does not answer in time
    const transporter = nodemailer.createTransport({
      host: 'smtp.example.invalid',
      port: 587,
      connectionTimeout: 300,
      dnsTimeout: 300
    });
    // (a resolver that never answers)
    const { Resolver } = dns;
    dns.Resolver = class {
      resolve4() {}
      resolve6() {}
      cancel() {}
    };
    t.teardown(() => {
      dns.Resolver = Resolver;
    });
    const err = await thrown(() => transporter.verify());
    dns.Resolver = Resolver;
    t.is(err.code, 'EDNS');
    t.regex(err.message, /DNS lookup for smtp\.example\.invalid timed out/);
    t.true(isTemporaryDnsError(err));

    // stored without its code (e.g. a log read back): told by its message
    t.true(isTemporaryDnsError({ message: 'queryCname ETIMEOUT example.com' }));
    t.true(
      isTemporaryDnsError({ message: 'getaddrinfo EAI_AGAIN smtp.example.com' })
    );
    t.false(isTemporaryDnsError({ message: 'queryTxt ENOTFOUND example.com' }));
    t.false(isTemporaryDnsError({ message: '550 5.1.1 User unknown' }));

    // (a reply from a mail server that only reads like one is not one)
    for (const message of [
      '550 5.7.1 queryA ETIMEOUT example.com',
      '451 4.4.3 getaddrinfo EAI_AGAIN mx.example.com',
      'bad query eof here'
    ]) {
      t.false(isTemporaryDnsError({ message }), `${message}`);
      t.false(
        isTemporaryDnsError({ message, code: 'EENVELOPE', responseCode: 550 }),
        `${message}`
      );
    }

    // fetch: the lookup of the host it was asked to reach
    const fetchErr = new TypeError('fetch failed');
    fetchErr.cause = Object.assign(new Error('getaddrinfo EAI_AGAIN x'), {
      code: 'EAI_AGAIN',
      syscall: 'getaddrinfo'
    });
    t.true(isTemporaryDnsError(fetchErr));

    for (const value of [null, undefined, 'ETIMEOUT', {}])
      t.false(isTemporaryDnsError(value));
  }
);
