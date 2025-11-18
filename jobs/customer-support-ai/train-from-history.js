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
            if (message.encrypted && !message.decrypted) {
              logger.debug(
                'Skipping encrypted message that could not be decrypted',
                {
                  subject: message.subject,
                  id: message.id
                }
              );
              continue;
            }

            // Use the already-parsed and decrypted content from nodemailer
            // forward-email-client.getMessage() already did all the work:
            // - Decrypted the raw message
            // - Parsed with simpleParser()
            // - Populated message.nodemailer with headers, text, html, etc.

            // Get the plain text content (already parsed and decoded)
            const text = message.nodemailer?.text || '';

            // If no text, try HTML (strip tags)
            const html = message.nodemailer?.html || '';
            const content = text || html.replace(/<[^>]*>/g, ' ').trim();

            if (!content.trim()) {
              logger.debug('Skipping message with no content', {
                id: message.id,
                subject: message.subject
              });
              continue;
            }

            // Use the subject and content as-is
            // The headers (From, To, Cc, etc.) are already in the text content
            const fullContent = `Subject: ${message.subject || 'No subject'}

${content}`;

            // Chunk the content
            const chunks = processor.chunkText(fullContent, {
              chunkSize: 1000,
              chunkOverlap: 200
            });

            // Add each chunk to vector store with metadata
            for (const chunk of chunks) {
              // Extract date from API response
              // API returns: header_date (from email headers), internal_date (when received)
              const date = message.header_date || message.internal_date;

              const metadata = {
                type: 'historical_email',
                folder: message.folder_path || message.folder || 'unknown',
                subject: message.subject,
                date: date ? new Date(date).toISOString() : null,
                messageId: message.id,
                threadId: message.thread_id || context.subject, // Use API thread_id
                hasReply: message.hasReply,
                encrypted: message.encrypted || false,
                decrypted: message.decrypted || false,
                // Include chunk metadata
                ...chunk.metadata
              };

              // If this message has a reply, include it as context
              if (message.reply) {
                const replyText = message.reply.nodemailer?.text || '';
                metadata.replySubject = message.reply.subject;
                metadata.replyText = replyText.slice(0, 500); // First 500 chars
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
