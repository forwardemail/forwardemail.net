/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Mongoose = require('@ladjs/mongoose');
const mongoose = require('mongoose');

const logger = require('#helpers/logger');
const env = require('#config/env');

const connectionNameSymbol = Symbol.for('connection.name');

//
// MongoDB Connection Pool Sizing
//
// Each PM2 process opens its own connection pool. On SMTP servers there are
// 9 processes (8 smtp.js listeners + 1 smtp-bree), so total connections per
// server = 9 * maxPoolSize * 2 (MONGO_URI + LOGS_URI).
//
// With the old maxPoolSize:500 and 16 SMTP servers, the theoretical maximum
// was 144,000 connections — far exceeding mongod's capacity and causing OOM.
//
// Sizing rationale for maxPoolSize:50:
//   - smtp-bree (send-emails job): PQueue concurrency = 50, each task does
//     ~2-3 serial MongoDB ops, so ~50 connections covers peak parallelism.
//   - smtp.js listeners: handle inbound SMTP with rate-limit checks and
//     email inserts; rarely exceed 20 concurrent ops per process.
//   - Total per server: 9 * 50 * 2 = 900 connections (vs 9000 before).
//   - Across 16 servers: 14,400 max (vs 144,000 before).
//
// Override via MONGO_MAX_POOL_SIZE env var for processes that need more
// (e.g., the bree.js scheduler on the dedicated bree server).
//
const maxPoolSize = env.MONGO_MAX_POOL_SIZE
  ? Number.parseInt(env.MONGO_MAX_POOL_SIZE, 10)
  : 50;

const m = new Mongoose({
  logger,
  hideMeta: true,
  bindEvents: false,
  mongo: {
    options: {
      compressors: ['snappy'],
      maxPoolSize,
      minPoolSize: Math.min(5, maxPoolSize),
      family: 4, // Force IPv4
      // Close idle connections after 5 minutes to release resources on
      // both the client and mongod side. Prevents connection count from
      // staying elevated after traffic spikes.
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
