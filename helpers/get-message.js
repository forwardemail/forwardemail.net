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
 * @param {Object} imapClient - ImapFlow client instance (should have mailbox selected)
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
    .split('@')[0];

  logger.debug('getMessage started', {
    provider: provider.name,
    messageId: info.messageId,
    messageIdPart,
    timeout,
    mailboxPath: imapClient.mailbox?.path,
    mailboxExists: imapClient.mailbox?.exists,
    clientIdling: imapClient.idling,
    clientUsable: imapClient.usable
  });

  try {
    // First check if message already exists (in case it arrived before we started waiting)
    logger.debug('Checking if message already exists', {
      provider: provider.name,
      messageIdPart
    });

    const checkStartTime = Date.now();
    const alreadyExists = await checkForMessage(imapClient, messageIdPart);
    const checkDuration = Date.now() - checkStartTime;

    logger.debug('Initial message check completed', {
      provider: provider.name,
      alreadyExists,
      checkDurationMs: checkDuration
    });

    if (alreadyExists) {
      received = new Date();
      logger.info('Message already exists (no IDLE needed)', {
        provider: provider.name,
        messageId: info.messageId,
        timeMs: Date.now() - startTime
      });
      return { provider, received, err };
    }

    // Use IDLE to wait for new message notification
    logger.debug('Message not found, entering IDLE wait', {
      provider: provider.name,
      messageIdPart,
      timeoutMs: timeout
    });

    received = await waitForMessageWithIdle(imapClient, messageIdPart, {
      timeout,
      provider,
      info,
      startTime
    });
  } catch (_err) {
    err = _err;
    logger.debug('getMessage caught error', {
      provider: provider.name,
      error: _err.message,
      stack: _err.stack
    });
  }

  const totalTime = Date.now() - startTime;

  // Log timing for debugging
  if (received) {
    logger.info('getMessage completed successfully', {
      provider: provider.name,
      totalTimeMs: totalTime,
      messageId: info.messageId
    });
  } else {
    logger.warn('getMessage completed without finding message', {
      provider: provider.name,
      totalTimeMs: totalTime,
      messageId: info.messageId,
      error: err ? err.message : 'no error'
    });
  }

  return { provider, received, err };
}

/**
 * Check if a message with the given ID part already exists in the mailbox
 */
async function checkForMessage(imapClient, messageIdPart) {
  const checkStartTime = Date.now();

  try {
    // Search for recent messages (last 10) to avoid scanning entire mailbox
    const status = imapClient.mailbox;

    logger.debug('checkForMessage: mailbox status', {
      path: status?.path,
      exists: status?.exists,
      uidNext: status?.uidNext,
      uidValidity: status?.uidValidity
    });

    if (!status || !status.exists || status.exists === 0) {
      logger.debug('checkForMessage: mailbox empty or not selected', {
        hasStatus: Boolean(status),
        exists: status?.exists
      });
      return false;
    }

    // Only check the last 10 messages for efficiency
    const startSeq = Math.max(1, status.exists - 9);
    const range = `${startSeq}:*`;

    logger.debug('checkForMessage: fetching messages', {
      range,
      totalMessages: status.exists,
      checkingCount: status.exists - startSeq + 1
    });

    let messagesChecked = 0;
    for await (const message of imapClient.fetch(range, {
      envelope: true
    })) {
      messagesChecked++;
      const msgId = message.envelope?.messageId;

      logger.debug('checkForMessage: checking message', {
        seq: message.seq,
        uid: message.uid,
        messageId: msgId,
        lookingFor: messageIdPart,
        matches: msgId ? msgId.includes(messageIdPart) : false
      });

      if (msgId && msgId.includes(messageIdPart)) {
        logger.debug('checkForMessage: FOUND matching message', {
          seq: message.seq,
          uid: message.uid,
          messageId: msgId,
          durationMs: Date.now() - checkStartTime
        });
        return true;
      }
    }

    logger.debug('checkForMessage: no match found', {
      messagesChecked,
      durationMs: Date.now() - checkStartTime
    });
  } catch (err) {
    // Log but don't throw - we'll retry via IDLE
    logger.warn('checkForMessage: error during check', {
      error: err.message,
      stack: err.stack,
      durationMs: Date.now() - checkStartTime
    });
  }

  return false;
}

/**
 * Wait for a message using IMAP IDLE event-driven approach
 */
async function waitForMessageWithIdle(imapClient, messageIdPart, options) {
  const { timeout, provider, info, startTime } = options;

  logger.debug('waitForMessageWithIdle: starting', {
    provider: provider.name,
    messageIdPart,
    timeoutMs: timeout,
    clientIdling: imapClient.idling,
    clientUsable: imapClient.usable,
    mailboxPath: imapClient.mailbox?.path
  });

  return new Promise((resolve, reject) => {
    let resolved = false;
    let checkInProgress = false;
    let idlePromise = null;
    let existsEventCount = 0;

    const cleanup = () => {
      resolved = true;
      clearTimeout(timeoutId);
      imapClient.off('exists', onExists);
      logger.debug('waitForMessageWithIdle: cleanup completed', {
        provider: provider.name,
        existsEventsReceived: existsEventCount
      });
    };

    const onExists = async (data) => {
      existsEventCount++;
      const eventTime = Date.now();

      logger.info('IDLE: exists event received', {
        provider: provider.name,
        messageId: info.messageId,
        eventNumber: existsEventCount,
        count: data.count,
        prevCount: data.prevCount,
        path: data.path,
        timeSinceStartMs: eventTime - startTime,
        resolved,
        checkInProgress
      });

      // Prevent concurrent checks
      if (resolved || checkInProgress) {
        logger.debug(
          'IDLE: skipping check (already resolved or check in progress)',
          {
            provider: provider.name,
            resolved,
            checkInProgress
          }
        );
        return;
      }

      checkInProgress = true;

      try {
        logger.debug('IDLE: checking for message after exists event', {
          provider: provider.name,
          messageIdPart
        });

        const checkStartTime = Date.now();
        const found = await checkForMessage(imapClient, messageIdPart);
        const checkDuration = Date.now() - checkStartTime;

        logger.debug('IDLE: message check completed', {
          provider: provider.name,
          found,
          checkDurationMs: checkDuration,
          resolved
        });

        if (found && !resolved) {
          const receivedTime = new Date();
          logger.info('IDLE: message FOUND', {
            provider: provider.name,
            messageId: info.messageId,
            totalTimeMs: Date.now() - startTime,
            existsEventsReceived: existsEventCount
          });
          cleanup();
          resolve(receivedTime);
        } else if (!found) {
          logger.debug(
            'IDLE: message not found after exists event (might be different message)',
            {
              provider: provider.name,
              messageIdPart,
              existsEventCount
            }
          );
        }
      } catch (checkErr) {
        logger.warn('IDLE: error checking message', {
          provider: provider.name,
          error: checkErr.message,
          stack: checkErr.stack
        });
      } finally {
        checkInProgress = false;
      }
    };

    // Set up timeout
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        logger.warn('IDLE: timeout reached', {
          provider: provider.name,
          messageId: info.messageId,
          timeoutMs: timeout,
          existsEventsReceived: existsEventCount,
          totalTimeMs: Date.now() - startTime
        });
        cleanup();
        reject(new Error('IDLE timeout waiting for message'));
      }
    }, timeout);

    // Listen for new message events BEFORE entering IDLE
    imapClient.on('exists', onExists);

    logger.debug('waitForMessageWithIdle: exists listener attached', {
      provider: provider.name,
      clientIdling: imapClient.idling
    });

    // Explicitly enter IDLE mode to receive server notifications
    // ImapFlow's idle() returns a promise that resolves when IDLE is broken
    // We need to call it but not await it (it would block until IDLE ends)
    // The exists event will fire during IDLE when new messages arrive
    if (imapClient.idling) {
      logger.debug('waitForMessageWithIdle: client already idling', {
        provider: provider.name
      });
    } else {
      logger.debug('waitForMessageWithIdle: entering IDLE mode', {
        provider: provider.name
      });

      idlePromise = imapClient.idle().catch((idleErr) => {
        // IDLE can fail if connection drops or times out
        // This is expected behavior, not an error
        logger.debug('IDLE: idle() promise resolved/rejected', {
          provider: provider.name,
          error: idleErr ? idleErr.message : 'normal termination',
          resolved,
          timeSinceStartMs: Date.now() - startTime
        });
      });

      logger.debug('waitForMessageWithIdle: idle() called', {
        provider: provider.name
      });
    }

    // Store idle promise reference to prevent unhandled rejection
    if (idlePromise) {
      idlePromise.then(() => {}).catch(() => {});
    }
  });
}

module.exports = getMessage;
