/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');
const pWaitFor = require('p-wait-for');

const logger = require('#helpers/logger');

//
// Yahoo does not support IMAP IDLE command
// See:
// - https://stackoverflow.com/a/71254393
// - https://github.com/ikvk/imap_tools/blob/master/tests/test_idle.py
//
const PROVIDERS_WITHOUT_IDLE_SUPPORT = new Set(['Yahoo/AOL']);

// Polling interval for providers that don't support IDLE
const POLLING_INTERVAL = ms('1s');

/**
 * Shared registry of pending message lookups per IMAP client.
 * This allows multiple getMessage() calls on the same client to share
 * a single EXISTS event handler, avoiding race conditions.
 *
 * Structure: WeakMap<ImapClient, Map<messageIdPart, {resolve, reject, info, startTime}>>
 */
const pendingMessages = new WeakMap();

/**
 * Track which clients have an EXISTS handler attached
 */
const clientHandlers = new WeakMap();

/**
 * Wait for a message to arrive using IMAP IDLE (event-driven, no polling).
 * Uses long-lived connections and verifies message ID when new messages arrive.
 *
 * For providers that don't support IDLE (e.g., Yahoo), falls back to polling.
 *
 * Multiple concurrent calls on the same IMAP client share a single EXISTS handler
 * to avoid race conditions where one handler consumes an event meant for another.
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

  // Check if this provider supports IDLE
  const supportsIdle = !PROVIDERS_WITHOUT_IDLE_SUPPORT.has(provider.name);

  logger.debug('getMessage started', {
    provider: provider.name,
    messageId: info.messageId,
    messageIdPart,
    timeout,
    supportsIdle,
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
      logger.info('Message already exists (no wait needed)', {
        provider: provider.name,
        messageId: info.messageId,
        timeMs: Date.now() - startTime
      });
      return { provider, received, err };
    }

    // Use appropriate waiting strategy based on provider capabilities
    if (supportsIdle) {
      // Use IDLE for providers that support it (Gmail, iCloud, Forward Email)
      logger.debug(
        'Message not found, entering IDLE wait with shared handler',
        {
          provider: provider.name,
          messageIdPart,
          timeoutMs: timeout
        }
      );

      received = await waitForMessageWithSharedHandler(
        imapClient,
        messageIdPart,
        {
          timeout,
          provider,
          info,
          startTime
        }
      );
    } else {
      // Fall back to polling for providers that don't support IDLE (Yahoo)
      // See: https://stackoverflow.com/a/71254393
      logger.debug(
        'Message not found, using polling fallback (no IDLE support)',
        {
          provider: provider.name,
          messageIdPart,
          timeoutMs: timeout,
          pollingIntervalMs: POLLING_INTERVAL
        }
      );

      received = await waitForMessageWithPolling(imapClient, messageIdPart, {
        timeout,
        provider,
        info,
        startTime
      });
    }
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
      messageId: info.messageId,
      method: supportsIdle ? 'IDLE' : 'polling'
    });
  } else {
    logger.warn('getMessage completed without finding message', {
      provider: provider.name,
      totalTimeMs: totalTime,
      messageId: info.messageId,
      method: supportsIdle ? 'IDLE' : 'polling',
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
    // Log but don't throw - we'll retry via IDLE or polling
    logger.warn('checkForMessage: error during check', {
      error: err.message,
      stack: err.stack,
      durationMs: Date.now() - checkStartTime
    });
  }

  return false;
}

/**
 * Wait for a message using polling (for providers that don't support IDLE like Yahoo)
 *
 * Yahoo does not support IMAP IDLE:
 * - https://stackoverflow.com/a/71254393
 * - https://github.com/ikvk/imap_tools/blob/master/tests/test_idle.py
 */
async function waitForMessageWithPolling(imapClient, messageIdPart, options) {
  const { timeout, provider, info, startTime } = options;

  logger.debug('waitForMessageWithPolling: starting', {
    provider: provider.name,
    messageIdPart,
    timeoutMs: timeout,
    pollingIntervalMs: POLLING_INTERVAL
  });

  let pollCount = 0;

  try {
    await pWaitFor(
      async () => {
        pollCount++;
        const pollStartTime = Date.now();

        logger.debug('Polling: checking for message', {
          provider: provider.name,
          pollCount,
          timeSinceStartMs: Date.now() - startTime
        });

        const found = await checkForMessage(imapClient, messageIdPart);

        logger.debug('Polling: check completed', {
          provider: provider.name,
          pollCount,
          found,
          checkDurationMs: Date.now() - pollStartTime
        });

        return found;
      },
      {
        interval: POLLING_INTERVAL,
        timeout
      }
    );

    const receivedTime = new Date();
    logger.info('Polling: message FOUND', {
      provider: provider.name,
      messageId: info.messageId,
      totalTimeMs: Date.now() - startTime,
      pollCount
    });

    return receivedTime;
  } catch (err) {
    logger.warn('Polling: timeout or error', {
      provider: provider.name,
      messageId: info.messageId,
      error: err.message,
      totalTimeMs: Date.now() - startTime,
      pollCount
    });
    throw new Error('Polling timeout waiting for message');
  }
}

/**
 * Check ALL pending messages for a client and resolve any that are found.
 * This is called when an EXISTS event fires.
 */
async function checkAllPendingMessages(imapClient) {
  const pending = pendingMessages.get(imapClient);
  if (!pending || pending.size === 0) {
    return;
  }

  const checkStartTime = Date.now();
  const pendingIds = [...pending.keys()];

  logger.debug('checkAllPendingMessages: checking for all pending messages', {
    pendingCount: pendingIds.length,
    pendingIds
  });

  try {
    const status = imapClient.mailbox;
    if (!status || !status.exists || status.exists === 0) {
      logger.debug('checkAllPendingMessages: mailbox empty or not selected');
      return;
    }

    // Check last 10 messages (or more if we have many pending)
    const checkCount = Math.max(10, pending.size * 2);
    const startSeq = Math.max(1, status.exists - checkCount + 1);
    const range = `${startSeq}:*`;

    logger.debug('checkAllPendingMessages: fetching messages', {
      range,
      totalMessages: status.exists,
      checkingCount: status.exists - startSeq + 1,
      pendingCount: pending.size
    });

    const foundIds = new Set();

    for await (const message of imapClient.fetch(range, {
      envelope: true
    })) {
      const msgId = message.envelope?.messageId;
      if (!msgId) continue;

      // Check if this message matches any pending lookup
      for (const [messageIdPart, entry] of pending.entries()) {
        if (msgId.includes(messageIdPart) && !foundIds.has(messageIdPart)) {
          foundIds.add(messageIdPart);

          logger.info('checkAllPendingMessages: FOUND message', {
            provider: entry.provider.name,
            messageIdPart,
            seq: message.seq,
            uid: message.uid,
            fullMessageId: msgId,
            totalTimeMs: Date.now() - entry.startTime
          });

          // Resolve this pending lookup
          const receivedTime = new Date();
          entry.resolve(receivedTime);

          // Remove from pending
          pending.delete(messageIdPart);
        }
      }
    }

    logger.debug('checkAllPendingMessages: check completed', {
      foundCount: foundIds.size,
      remainingPending: pending.size,
      durationMs: Date.now() - checkStartTime
    });
  } catch (err) {
    logger.warn('checkAllPendingMessages: error during check', {
      error: err.message,
      stack: err.stack,
      durationMs: Date.now() - checkStartTime
    });
  }
}

/**
 * Set up the shared EXISTS handler for a client if not already set up
 */
function ensureSharedHandler(imapClient) {
  if (clientHandlers.has(imapClient)) {
    return; // Already has handler
  }

  let checkInProgress = false;
  let existsEventCount = 0;

  const sharedOnExists = async (data) => {
    existsEventCount++;

    const pending = pendingMessages.get(imapClient);
    const pendingCount = pending ? pending.size : 0;

    logger.info('IDLE: shared exists event received', {
      eventNumber: existsEventCount,
      count: data.count,
      prevCount: data.prevCount,
      path: data.path,
      pendingMessages: pendingCount,
      checkInProgress
    });

    if (pendingCount === 0) {
      logger.debug('IDLE: no pending messages to check');
      return;
    }

    // Prevent concurrent checks
    if (checkInProgress) {
      logger.debug('IDLE: check already in progress, skipping');
      return;
    }

    checkInProgress = true;

    try {
      await checkAllPendingMessages(imapClient);
    } catch (err) {
      logger.warn('IDLE: error in shared handler check', {
        error: err.message
      });
    } finally {
      checkInProgress = false;
    }

    // Re-enter IDLE if there are still pending messages
    const remainingPending = pendingMessages.get(imapClient);
    if (remainingPending && remainingPending.size > 0 && !imapClient.idling) {
      logger.debug(
        'IDLE: re-entering IDLE mode for remaining pending messages',
        {
          remainingCount: remainingPending.size
        }
      );
      imapClient.idle().catch((idleErr) => {
        logger.debug('IDLE: idle() ended', {
          error: idleErr ? idleErr.message : 'normal termination'
        });
      });
    }
  };

  // Attach the shared handler
  imapClient.on('exists', sharedOnExists);

  // Store reference for cleanup
  clientHandlers.set(imapClient, {
    handler: sharedOnExists,
    existsEventCount: () => existsEventCount
  });

  logger.debug('ensureSharedHandler: attached shared EXISTS handler');
}

/**
 * Wait for a message using shared IMAP IDLE event handler.
 * Multiple concurrent calls share a single EXISTS handler to avoid race conditions.
 */
async function waitForMessageWithSharedHandler(
  imapClient,
  messageIdPart,
  options
) {
  const { timeout, provider, info, startTime } = options;

  logger.debug('waitForMessageWithSharedHandler: starting', {
    provider: provider.name,
    messageIdPart,
    timeoutMs: timeout,
    clientIdling: imapClient.idling,
    clientUsable: imapClient.usable,
    mailboxPath: imapClient.mailbox?.path
  });

  // Ensure the shared handler is set up
  ensureSharedHandler(imapClient);

  // Initialize pending messages map for this client if needed
  if (!pendingMessages.has(imapClient)) {
    pendingMessages.set(imapClient, new Map());
  }

  const pending = pendingMessages.get(imapClient);

  return new Promise((resolve, reject) => {
    // Set up timeout
    const timeoutId = setTimeout(() => {
      // Remove from pending
      if (pending.has(messageIdPart)) {
        pending.delete(messageIdPart);
        logger.warn('IDLE: timeout reached for message', {
          provider: provider.name,
          messageId: info.messageId,
          messageIdPart,
          timeoutMs: timeout,
          totalTimeMs: Date.now() - startTime,
          remainingPending: pending.size
        });
        reject(new Error('IDLE timeout waiting for message'));
      }
    }, timeout);

    // Add to pending messages
    pending.set(messageIdPart, {
      resolve(receivedTime) {
        clearTimeout(timeoutId);
        resolve(receivedTime);
      },
      reject(err) {
        clearTimeout(timeoutId);
        pending.delete(messageIdPart);
        reject(err);
      },
      provider,
      info,
      startTime,
      timeoutId
    });

    logger.debug('waitForMessageWithSharedHandler: added to pending', {
      provider: provider.name,
      messageIdPart,
      totalPending: pending.size
    });

    // Enter IDLE mode if not already idling
    if (imapClient.idling) {
      logger.debug('waitForMessageWithSharedHandler: client already idling', {
        provider: provider.name
      });
    } else {
      logger.debug('waitForMessageWithSharedHandler: entering IDLE mode', {
        provider: provider.name
      });

      imapClient.idle().catch((idleErr) => {
        logger.debug('IDLE: idle() ended', {
          provider: provider.name,
          error: idleErr ? idleErr.message : 'normal termination'
        });
      });
    }
  });
}

module.exports = getMessage;
