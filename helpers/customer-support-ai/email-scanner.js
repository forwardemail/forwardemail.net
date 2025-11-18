/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const forwardEmailClient = require('./forward-email-client');
const logger = require('#helpers/logger');

/**
 * Scan historical emails from all folders
 * Processes INBOX, Sent, and other folders to extract conversation history
 */
class EmailScanner {
  constructor(config) {
    this.config = config;
    this.client = forwardEmailClient;
    this.folders = null; // Will be fetched dynamically
    this.excludedSpecialUse = ['\\Junk', '\\Trash', '\\Drafts'];
  }

  /**
   * Fetch folders from API and filter by special_use
   * @returns {Promise<Array>} Array of folder names to scan
   */
  async getFolders() {
    try {
      const allFolders = await this.client.listFolders();

      // Filter out folders with excluded special_use values
      const folders = allFolders
        .filter((folder) => {
          // Exclude if special_use matches excluded list
          if (
            folder.special_use &&
            this.excludedSpecialUse.includes(folder.special_use)
          ) {
            logger.debug(
              `Excluding folder ${folder.name} (special_use: ${folder.special_use})`
            );
            return false;
          }

          return true;
        })
        .map((folder) => folder.name || folder.path);

      logger.info('Fetched folders from API', {
        total: allFolders.length,
        filtered: folders.length,
        excluded: allFolders.length - folders.length
      });

      return folders;
    } catch (err) {
      logger.error('Failed to fetch folders, using defaults', { error: err });
      // Fallback to common folders if API fails
      return ['INBOX', 'Sent'];
    }
  }

  /**
   * Scan all folders and extract messages
   * @param {Object} options - Scanning options
   * @param {Number} options.limit - Max messages per folder (default: 1000)
   * @param {Date} options.since - Only scan messages since this date
   * @param {Boolean} options.decryptPGP - Attempt to decrypt PGP messages (default: true)
   * @returns {Promise<Array>} Array of processed messages
   */
  async scanAllFolders(options = {}) {
    const { limit = 1000, since = null, decryptPGP = true } = options;

    // Fetch folders dynamically
    const folders = await this.getFolders();

    logger.info('Starting historical email scan', {
      folders,
      limit,
      since,
      decryptPGP
    });

    const allMessages = [];

    for (const folder of folders) {
      try {
        logger.info(`Scanning folder: ${folder}`);

        const messages = await this.scanFolder(folder, {
          limit,
          since,
          decryptPGP
        });

        logger.info(`Found ${messages.length} messages in ${folder}`);
        allMessages.push(...messages);
      } catch (err) {
        logger.error(`Error scanning folder ${folder}`, { err });
      }
    }

    logger.info(`Total messages scanned: ${allMessages.length}`);
    return allMessages;
  }

  /**
   * Scan a specific folder
   */
  async scanFolder(folder, options = {}) {
    const { limit = 1000, since = null, decryptPGP = true } = options;

    try {
      // Build search query
      const searchParams = {
        folder,
        limit
      };

      if (since) {
        searchParams.after = since.toISOString();
      }

      // Fetch messages from folder
      const response = await this.client.listMessages(searchParams);

      if (!response || !Array.isArray(response)) {
        logger.warn(`No messages found in ${folder}`);
        return [];
      }

      // Process each message
      const processedMessages = [];

      for (const message of response) {
        try {
          const processed = await this.processMessage(
            message,
            folder,
            decryptPGP
          );
          if (processed) {
            processedMessages.push(processed);
          }
        } catch (err) {
          logger.error('Error processing message', {
            messageId: message.id,
            err
          });
        }
      }

      return processedMessages;
    } catch (err) {
      logger.error(`Error scanning folder ${folder}`, { err });
      return [];
    }
  }

  /**
   * Process individual message
   * Fetches full message using getMessage() which handles decryption and parsing
   * Returns the message object as-is from the API (with nodemailer, headers, raw, eml, etc.)
   */
  async processMessage(message, folder) {
    try {
      // listMessages only returns minimal metadata, so we need to fetch the full message
      // getMessage() handles raw decryption and parsing automatically
      logger.debug('Fetching full message', { id: message.id });
      const fullMessage = await this.client.getMessage(message.id);

      // Add folder to the message object for context
      fullMessage.folder = folder;

      // Return the full API message object as-is
      // It already has: nodemailer, headers, raw, eml, subject, date, encrypted, decrypted, etc.
      return fullMessage;
    } catch (err) {
      logger.error('Error processing message', { err });
      return null;
    }
  }

  /**
   * Group messages into conversation threads
   * Uses In-Reply-To and References headers
   */
  groupIntoThreads(messages) {
    const threads = new Map();
    const messageMap = new Map();

    // First pass: index all messages
    for (const message of messages) {
      messageMap.set(message.id, message);
    }

    // Second pass: build threads
    for (const message of messages) {
      let threadId = message.id;

      // Try to find parent thread
      if (message.inReplyTo) {
        const parent = messageMap.get(message.inReplyTo);
        if (parent) {
          threadId = parent.threadId || parent.id;
        }
      } else if (message.references && message.references.length > 0) {
        // Use first reference as thread root
        const rootId = message.references[0];
        const root = messageMap.get(rootId);
        if (root) {
          threadId = root.threadId || root.id;
        }
      }

      message.threadId = threadId;

      // Add to thread
      if (!threads.has(threadId)) {
        threads.set(threadId, []);
      }

      threads.get(threadId).push(message);
    }

    // Sort messages within each thread by date
    for (const threadMessages of threads.values()) {
      threadMessages.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    logger.info(
      `Grouped ${messages.length} messages into ${threads.size} threads`
    );

    return [...threads.values()];
  }

  /**
   * Extract conversation context from thread
   * Returns messages as-is from the API with reply relationships
   */
  extractConversationContext(thread) {
    if (!thread || thread.length === 0) return null;

    const context = {
      subject: thread[0].subject,
      messageCount: thread.length,
      duration: null,
      messages: []
    };

    // Calculate duration
    if (thread.length > 1) {
      const start = new Date(thread[0].date);
      const end = new Date(thread[thread.length - 1].date);
      context.duration = end - start;
    }

    // Return messages as-is with reply relationships
    for (let i = 0; i < thread.length; i++) {
      const message = thread[i];
      const reply = thread[i + 1];

      // Add the full message object with reply reference
      context.messages.push({
        ...message,
        hasReply: Boolean(reply),
        reply: reply || null
      });
    }

    return context;
  }
}

module.exports = EmailScanner;
