/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// SMTP Worker for Piscina Thread Pool
//
// This worker processes individual emails in a separate thread,
// allowing for true parallel processing across multiple CPU cores.
//
// The worker is invoked by smtp-bree.js via Piscina and receives
// email data to process. Each thread maintains its own MongoDB
// connection and Redis client for optimal performance.
//

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client, logger);

// Track if worker is shutting down
let isCancelled = false;

const graceful = new Graceful({
  ...(config.env === 'test'
    ? {
        mongooses: [mongoose],
        redisClients: [client]
      }
    : {}),
  logger,
  timeoutMs: config.env === 'test' ? ms('5s') : ms('1m'),
  customHandlers: [
    async () => {
      isCancelled = true;
    }
  ]
});

graceful.listen();

// Initialize mongoose connection once per worker
let mongooseInitialized = false;

async function initializeMongoose() {
  if (!mongooseInitialized) {
    await setupMongoose(logger);
    mongooseInitialized = true;
  }
}

//
// Main worker function - processes a single email
//
// This function is called by Piscina for each email to be processed.
// It receives the email document and processes it using the existing
// processEmail helper.
//
// @param {Object} payload - The email data to process
// @param {Object} payload.email - The email document from MongoDB
// @returns {Object} - Result of processing (success/error info)
//
async function processEmailWorker(payload) {
  if (isCancelled) {
    return { success: false, error: 'Worker is shutting down' };
  }

  try {
    // Ensure mongoose is initialized
    await initializeMongoose();

    const { email } = payload;

    if (!email || !email._id) {
      return { success: false, error: 'Invalid email payload' };
    }

    // Process the email using the existing helper
    await processEmail({ email, resolver, client });

    return { success: true, emailId: email._id.toString() };
  } catch (err) {
    logger.error(err, { payload });
    return {
      success: false,
      error: err.message,
      emailId: payload?.email?._id?.toString()
    };
  }
}

module.exports = processEmailWorker;
