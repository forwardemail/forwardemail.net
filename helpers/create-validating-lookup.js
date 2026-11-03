/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const net = require('node:net');
const process = require('node:process');

//
// A `lookup` for `net.connect` (and the `connect` option of an undici
// Agent) that refuses to connect when the host resolves to an address
// `isBlocked` rejects. It closes the gap between checking a host name
// before a request and the address actually connected to (DNS rebinding).
//
// Every address of the host is asked for, whatever the caller asked for,
// and the ones it may connect to are checked (all of them with `all: true`,
// otherwise the first, as before) and given back in the form it asked for:
// Node 20 and
// later connect with `autoSelectFamily`, which calls the lookup with
// `all: true` and expects an array of `{ address, family }` back, and
// Node 18 expects one address and its family. Reading `.address` of the
// array a resolver gives for `all: true` gave `undefined`, so every
// connection failed with ERR_INVALID_IP_ADDRESS, and nothing was checked.
//
// `lookup(hostname, options)` resolves as `dns.promises.lookup` does (a
// Tangerine resolver's `lookup` does), and `isBlocked(address)` may be
// async.
//
function createValidatingLookup({ lookup, isBlocked }) {
  if (typeof lookup !== 'function' || typeof isBlocked !== 'function')
    throw new TypeError('lookup and isBlocked must be functions');

  return function (hostname, options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    } else if (typeof options === 'number') {
      options = { family: options };
    }

    options ||= {};

    (async () => {
      const result = await lookup(hostname, { ...options, all: true });
      const addresses = [];
      for (const entry of Array.isArray(result) ? result : [result]) {
        const address = typeof entry === 'string' ? entry : entry?.address;
        const family = net.isIP(address);
        // (anything that is not an address is left out, and so is an address
        // of another family than the one asked for)
        if (family === 0) continue;
        if (
          (options.family === 4 || options.family === 6) &&
          family !== options.family
        )
          continue;
        addresses.push({ address, family });
      }

      if (addresses.length === 0) {
        const err = new Error(`No address found for ${hostname}`);
        err.code = 'ENOTFOUND';
        err.hostname = hostname;
        throw err;
      }

      //
      // (every address given back is checked: all of them when all were
      // asked for, as any may be connected to, otherwise the first one,
      // the one connected to)
      //
      if (!options.all) addresses.splice(1);
      for (const { address } of addresses) {
        if (await isBlocked(address)) {
          const err = new Error(
            `Resolved IP ${address} is a private/reserved address`
          );
          err.code = 'EPRIVATEADDR';
          err.hostname = hostname;
          err.address = address;
          throw err;
        }
      }

      return addresses;
    })().then(
      // (called outside of the promise, so a throw in the callback is not
      // taken for a failed lookup, as with a callback from node:dns)
      (addresses) => {
        process.nextTick(() => {
          if (options.all) fn(null, addresses);
          else fn(null, addresses[0].address, addresses[0].family);
        });
      },
      (err) => {
        process.nextTick(() => fn(err));
      }
    );
  };
}

module.exports = createValidatingLookup;
