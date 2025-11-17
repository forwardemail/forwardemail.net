/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

const Graceful = require('@ladjs/graceful');

const config = require('#config');
const logger = require('#helpers/logger');
const EmailScanner = require('#helpers/customer-support-ai/email-scanner');
const VectorStore = require('#helpers/customer-support-ai/vector-store');
const processor = require('#helpers/customer-support-ai/processor');

const graceful = new Graceful({
  logger,
  parentPort
});

graceful.listen();

/**
 * Train knowledge base from historical emails
 * Scans all folders, decrypts PGP messages, and adds to vector store
 */
(async () => {
  try {
    logger.info('Starting historical email training job');

    // Initialize components
    const scanner = new EmailScanner({
      forwardEmailApiBase: config.forwardEmailApiBase,
      forwardEmailAliasUsername: config.forwardEmailAliasUsername,
      forwardEmailAliasPassword: config.forwardEmailAliasPassword
    });

    const vectorStore = new VectorStore({
      chromaDbPath: config.chromaDbPath,
      collectionName: 'customer_support_history'
    });

    // Configuration
    const scanOptions = {
      limit: Number.parseInt(process.env.HISTORY_SCAN_LIMIT, 10) || 1000,
      since: process.env.HISTORY_SCAN_SINCE
        ? new Date(process.env.HISTORY_SCAN_SINCE)
        : null,
      decryptPGP: process.env.HISTORY_DECRYPT_PGP !== 'false'
    };

    logger.info('Scan configuration', scanOptions);

    // Scan all folders
    const messages = await scanner.scanAllFolders(scanOptions);

    if (messages.length === 0) {
      logger.warn('No messages found to train on');
      return;
    }

    logger.info(`Processing ${messages.length} messages`);

    // Group into threads for better context
    const threads = scanner.groupIntoThreads(messages);
    logger.info(`Organized into ${threads.length} conversation threads`);

    // Process and add to vector store
    let processedCount = 0;
    let errorCount = 0;

    for (const thread of threads) {
      try {
        // Extract conversation context
        const context = scanner.extractConversationContext(thread);

        if (!context || context.messages.length === 0) {
          continue;
        }

        // Process each message in the thread
        for (const message of context.messages) {
          try {
            // Skip messages that are encrypted but could not be decrypted
            // (don't train on encrypted gibberish)
            const messageData = thread.find(
              (m) => m.subject === message.subject && m.from === message.from
            );
            if (
              messageData &&
              messageData.encrypted &&
              !messageData.decrypted
            ) {
              logger.debug(
                'Skipping encrypted message that could not be decrypted',
                {
                  subject: message.subject,
                  from: message.from
                }
              );
              continue;
            }

            // Combine subject and body for better context
            const content = `Subject: ${
              message.subject || 'No subject'
            }\n\nFrom: ${message.from}\nTo: ${
              message.to?.join(', ') || 'Unknown'
            }\n\n${message.text || message.html || ''}`;

            if (!content.trim()) {
              continue;
            }

            // Chunk the content
            const chunks = processor.chunkText(content, {
              chunkSize: 1000,
              chunkOverlap: 200
            });

            // Add each chunk to vector store with metadata
            for (const chunk of chunks) {
              const metadata = {
                type: 'historical_email',
                folder: thread[0].folder || 'unknown',
                subject: message.subject,
                from: message.from,
                date: message.date,
                threadId: context.subject,
                hasReply: message.hasReply,
                encrypted: thread[0].encrypted || false,
                decrypted: thread[0].decrypted || false,
                // Include chunk metadata
                ...chunk.metadata
              };

              // If this message has a reply, include it as context
              if (message.reply) {
                metadata.replyFrom = message.reply.from;
                metadata.replyText = message.reply.text?.slice(0, 500); // First 500 chars
              }

              // Pass chunk.text (string), not chunk (object)
              await vectorStore.addDocument(chunk.text, metadata);
            }

            processedCount++;
          } catch (err) {
            logger.error('Error processing message in thread', {
              subject: message.subject,
              err
            });
            errorCount++;
          }
        }
      } catch (err) {
        logger.error('Error processing thread', { err });
        errorCount++;
      }
    }

    logger.info('Historical email training completed', {
      totalMessages: messages.length,
      totalThreads: threads.length,
      processedCount,
      errorCount
    });

    // Log statistics
    const encryptedCount = messages.filter((m) => m.encrypted).length;
    const decryptedCount = messages.filter((m) => m.decrypted).length;
    const skippedEncryptedCount = encryptedCount - decryptedCount;

    const stats = {
      totalMessages: messages.length,
      totalThreads: threads.length,
      processedCount,
      errorCount,
      encryptedCount,
      decryptedCount,
      skippedEncryptedCount
    };

    logger.info('Training statistics', stats);

    if (parentPort) {
      parentPort.postMessage('done');
    } else {
      process.exit(0);
    }
  } catch (err) {
    logger.error('Historical email training job failed', { err });

    if (parentPort) {
      parentPort.postMessage('error');
    } else {
      process.exit(1);
    }
  }
})();
