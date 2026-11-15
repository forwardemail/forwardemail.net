/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const commands = require('@ioredis/commands');
const Tangerine = require('tangerine');

// modern approach inspired by `refix` package
// <https://github.com/luin/ioredis/issues/983#issuecomment-1448839874>
// <https://github.com/luin/ioredis/issues/983#issuecomment-1536728696>
function refix(client, prefix) {
  const proxy = {};
  Object.setPrototypeOf(proxy, client);
  for (const command of commands.list) {
    proxy[command] = function (...args) {
      const keyIndexes = commands.getKeyIndexes(command, args);
      for (const index of keyIndexes) {
        if (args[index] instanceof Map) {
          const map = new Map();
          for (const [key, value] of args[index]) {
            map.set(prefix + key, value);
          }

          args[index] = map;
        } else if (
          typeof args[index] === 'object' &&
          !Array.isArray(args[index])
        ) {
          const obj = {};
          for (const key of Object.keys(args[index])) {
            obj[prefix + key] = args[index][key];
          }

          args[index] = obj;
        } else {
          args[index] = prefix + args[index];
        }
      }

      return client[command](...args);
    };
  }

  return proxy;
}

//
// The DNS servers of our resolvers: Cloudflare and Google in turn, each
// lookup starting with the next pair of them, so lookups are spread evenly
// over both providers and each starts with Cloudflare (and goes on to Google
// when it does not answer)
//
const SERVERS = ['1.1.1.1', '8.8.8.8', '1.0.0.1', '8.8.4.4'];

// (the servers, listed from the next pair each time a lookup lists them)
class RoundRobinServers extends Set {
  #start = 0;

  *[Symbol.iterator]() {
    const servers = [...super.values()];
    if (servers.length === 0) return;
    const start = this.#start % servers.length;
    this.#start = start + 2;
    for (let i = 0; i < servers.length; i++)
      yield servers[(start + i) % servers.length];
  }
}

// a resolver whose servers are taken in turn (see `SERVERS`), and kept in
// that order: one that fails is not moved to the end, so Cloudflare stays
// first
function roundRobin(tangerine) {
  tangerine.options.smartRotate = false;
  tangerine.options.servers = new RoundRobinServers(
    tangerine.options.servers.values()
  );
  return tangerine;
}

function createTangerine(
  client,
  logger = require('./logger'),
  options = false
) {
  if (!client) throw new Error('Client required');

  // (a resolver with other servers keeps its answers apart from the default
  // ones, e.g. one whose answers are filtered, see `create-family-resolver`)
  let prefix = 'tangerine:';
  if (options && typeof options === 'object' && options.cachePrefix) {
    ({ cachePrefix: prefix, ...options } = options);
  }

  const isDefault = !options || typeof options !== 'object';
  if (isDefault)
    options = {
      // (each try waits twice as long as the one before, so a server that
      //  does not answer is given up on after 15 seconds and the next one is
      //  asked; at most a minute for all four)
      timeout: 5000,
      tries: 2,
      servers: new Set(SERVERS),
      setCacheArgs(key, result) {
        return ['PX', Math.round(result.ttl * 1000)];
      }
    };

  // <https://github.com/forwardemail/tangerine#cache>
  const cache = refix(client, prefix);
  const { set } = cache;
  cache.set = (...args) => {
    if (typeof args[1] === 'object') args[1] = JSON.stringify(args[1]);
    return set(...args);
  };

  const { get } = cache;
  cache.get = async (...args) => {
    let value = await get(...args);
    if (value && typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {}
    }

    return value;
  };

  const tangerine = new Tangerine({
    logger,
    cache,
    ...options
  });

  return isDefault ? roundRobin(tangerine) : tangerine;
}

module.exports = createTangerine;
module.exports.SERVERS = SERVERS;
module.exports.roundRobin = roundRobin;
