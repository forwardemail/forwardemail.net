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
// IMPORTANT: Each worker thread:
// - Loads the full application context (heavy memory usage ~100-200MB)
// - Maintains its own MongoDB connection
// - Should be used sparingly and with proper resource tuning
//
// The worker is invoked by send-emails.js via Piscina and receives
// email data to process.
//

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const process = require('node:process');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');

//
// Lazy initialization of resources
//
// We defer initialization until the first task to avoid
// unnecessary resource allocation for idle workers.
//
let client = null;
let resolver = null;
let mongooseInitialized = false;
let initializationPromise = null;

async function initialize() {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    if (!mongooseInitialized) {
      await setupMongoose(logger);
      mongooseInitialized = true;
    }

    if (!client) {
      client = new Redis(breeSharedConfig.redis, logger);
      resolver = createTangerine(client, logger);
    }
  })();

  return initializationPromise;
}

//
// Cleanup function for graceful shutdown
//
async function cleanup() {
  if (client) {
    try {
      await client.quit();
    } catch {
      // Ignore cleanup errors
    }
  }

  if (mongoose.connection.readyState === 1) {
    try {
      await mongoose.connection.close();
    } catch {
      // Ignore cleanup errors
    }
  }
}

// Register cleanup on process exit
process.on('beforeExit', cleanup);

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
  try {
    // Ensure resources are initialized
    await initialize();

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
