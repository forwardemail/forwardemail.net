/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');
const pWaitFor = require('p-wait-for');

const logger = require('#helpers/logger');

//
// NOTE: We use polling instead of IMAP IDLE for all providers because:
// 1. Gmail's IDLE EXISTS notifications are delayed 30+ seconds
// 2. Yahoo does not support IMAP IDLE at all
//    - https://stackoverflow.com/a/71254393
//    - https://github.com/ikvk/imap_tools/blob/master/tests/test_idle.py
// 3. Polling provides consistent, predictable behavior across all providers
//
const POLLING_INTERVAL = 0; // ms('1s');

/**
 * Wait for a message to arrive using continuous polling.
 * Checks the mailbox at regular intervals until the message is found or timeout.
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
    pollingInterval: POLLING_INTERVAL,
    mailboxPath: imapClient.mailbox?.path,
    mailboxExists: imapClient.mailbox?.exists,
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

    // Use polling to wait for message
    logger.debug('Message not found, starting polling', {
      provider: provider.name,
      messageIdPart,
      timeoutMs: timeout,
      pollingIntervalMs: POLLING_INTERVAL
    });

    received = await waitForMessageWithPolling(imapClient, messageIdPart, {
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
    // Issue NOOP to refresh mailbox state before checking
    // This is required for Yahoo which doesn't push EXISTS updates
    // Without NOOP, Yahoo returns stale mailbox data
    try {
      await imapClient.noop();
    } catch (noopErr) {
      logger.debug('NOOP failed, continuing anyway', {
        error: noopErr.message
      });
    }

    // Get current mailbox status (now refreshed after NOOP)
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
    // Log but don't throw - we'll retry on next poll
    logger.warn('checkForMessage: error during check', {
      error: err.message,
      stack: err.stack,
      durationMs: Date.now() - checkStartTime
    });
  }

  return false;
}

/**
 * Wait for a message using continuous polling.
 *
 * We use polling instead of IMAP IDLE because:
 * 1. Gmail's IDLE EXISTS notifications are delayed 30+ seconds
 * 2. Yahoo does not support IMAP IDLE at all
 *    - https://stackoverflow.com/a/71254393
 *    - https://github.com/ikvk/imap_tools/blob/master/tests/test_idle.py
 * 3. Polling provides consistent, predictable behavior across all providers
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

module.exports = getMessage;
