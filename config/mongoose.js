/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Mongoose = require('@ladjs/mongoose');
const mongoose = require('mongoose');

const logger = require('#helpers/logger');
const env = require('#config/env');

const connectionNameSymbol = Symbol.for('connection.name');
const m = new Mongoose({
  logger,
  hideMeta: true,
  bindEvents: false,
  mongo: {
    options: {
      compressors: ['snappy'],
      maxPoolSize: 500,
      family: 4, // Force IPv4
      // Prevent infinite hangs on half-open TCP connections.
      // Without this, cursor.next() on a dead connection waits forever
      // because the default socketTimeoutMS is 0 (no timeout).
      socketTimeoutMS: 60000, // 60s
      // Proactively close idle connections before they go stale
      // (e.g., load balancer idle timeout, NAT table expiry).
      maxIdleTimeMS: 300000 // 5 minutes
    }
  }
});

// destroy initial connection
// <https://github.com/Automattic/mongoose/issues/12965>
const initialConnection = mongoose.connections.find((conn) => conn.id === 0);
if (initialConnection) initialConnection.destroy();

// <https://github.com/Automattic/mongoose/issues/12970>
for (const name of ['MONGO_URI', 'LOGS_URI']) {
  const uri = env[name];
  if (mongoose.connections.some((conn) => conn._connectionString === uri))
    continue;
  const conn = m.createConnection(uri);
  // this is used in helpers/logger.js (so we don't expose env)
  conn[connectionNameSymbol] = name;
}
