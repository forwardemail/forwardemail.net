/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const commands = require('@ioredis/commands');
const Tangerine = require('tangerine');

const env = require('#config/env');

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

function createTangerine(
  client,
  logger = require('./logger'),
  options = false
) {
  if (!client) throw new Error('Client required');

  if (!options || typeof options !== 'object')
    options = {
      // speeds up tests x2 if any DNS errors detected
      timeout: env.NODE_ENV === 'production' ? 10000 : 5000,
      tries: env.NODE_ENV === 'production' ? 4 : 2,
      servers: new Set(['1.1.1.1', '8.8.8.8', '1.0.0.1', '8.8.4.4']),
      setCacheArgs(key, result) {
        return ['PX', Math.round(result.ttl * 1000)];
      }
    };

  // <https://github.com/forwardemail/tangerine#cache>
  const cache = refix(client, 'tangerine:');
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

  return tangerine;
}

module.exports = createTangerine;
