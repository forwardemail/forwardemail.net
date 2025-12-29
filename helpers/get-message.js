/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const logger = require('#helpers/logger');

/**
 * Wait for a message to arrive using IMAP IDLE (event-driven, no polling).
 * Uses long-lived connections and verifies message ID when new messages arrive.
 *
 * @param {Object} imapClient - ImapFlow client instance (should be in IDLE mode)
 * @param {Object} info - Message info containing messageId
 * @param {Object} provider - Provider configuration
 * @returns {Promise<{provider: Object, received: Date|null, err: Error|null}>}
 */
async function getMessage(imapClient, info, provider) {
  let received;
  let err;
  const startTime = Date.now();
  const timeout = ms('1m');

  // Extract the unique part of message ID for matching
  const messageIdPart = info.messageId
    .replace('<', '')
    .replace('>', '')
    .split('@')[1];

  try {
    // First check if message already exists (in case it arrived before we started waiting)
    const alreadyExists = await checkForMessage(imapClient, messageIdPart);
    if (alreadyExists) {
      received = new Date();
      logger.debug('Message already exists', {
        provider: provider.name,
        messageId: info.messageId,
        timeMs: Date.now() - startTime
      });
      return { provider, received, err };
    }

    // Use IDLE to wait for new message notification
    received = await waitForMessageWithIdle(imapClient, messageIdPart, {
      timeout,
      provider,
      info
    });
  } catch (_err) {
    err = _err;
  }

  const totalTime = Date.now() - startTime;

  // Log timing for debugging
  if (received) {
    logger.debug('Message received via IDLE', {
      provider: provider.name,
      totalTimeMs: totalTime,
      messageId: info.messageId
    });
  } else if (totalTime > ms('10s')) {
    logger.warn('Slow getMessage detected', {
      provider: provider.name,
      totalTimeMs: totalTime,
      messageId: info.messageId,
      found: Boolean(received),
      error: err ? err.message : null
    });
  }

  return { provider, received, err };
}

/**
 * Check if a message with the given ID part already exists in the mailbox
 */
async function checkForMessage(imapClient, messageIdPart) {
  try {
    for await (const message of imapClient.fetch('*', {
      headers: ['Message-ID']
    })) {
      if (
        message.headers &&
        message.headers.toString().includes(messageIdPart)
      ) {
        return true;
      }
    }
  } catch (err) {
    // Log but don't throw - we'll retry via IDLE
    logger.debug('Error checking for existing message', {
      error: err.message
    });
  }

  return false;
}

/**
 * Wait for a message using IMAP IDLE event-driven approach
 */
async function waitForMessageWithIdle(imapClient, messageIdPart, options) {
  const { timeout, provider, info } = options;

  return new Promise((resolve, reject) => {
    let resolved = false;
    let checkInProgress = false;

    const cleanup = () => {
      clearTimeout(timeoutId);
      imapClient.off('exists', onExists);
    };

    const onExists = async (data) => {
      // Prevent concurrent checks
      if (resolved || checkInProgress) return;
      checkInProgress = true;

      logger.debug('IDLE: new message event received', {
        provider: provider.name,
        messageId: info.messageId,
        data
      });

      try {
        const found = await checkForMessage(imapClient, messageIdPart);
        if (found && !resolved) {
          resolved = true;
          cleanup();
          resolve(new Date());
        }
      } catch (checkErr) {
        logger.debug('Error checking message during IDLE', {
          provider: provider.name,
          error: checkErr.message
        });
      } finally {
        checkInProgress = false;
      }
    };

    // Set up timeout
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        reject(new Error('IDLE timeout waiting for message'));
      }
    }, timeout);

    // Listen for new message events
    imapClient.on('exists', onExists);

    // Note: ImapFlow automatically enters IDLE mode when there are no pending commands
    // and disableAutoIdle is not set. The 'exists' event will fire when new messages arrive.
  });
}

module.exports = getMessage;
