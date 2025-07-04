/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { ImapFlow } = require('imapflow');

const env = require('#config/env');
const logger = require('#helpers/logger');

/**
 * Store a sent message in the IMAP "Sent Mail" folder
 * @param {Object} messageInfo - Information about the sent message
 * @param {String} messageInfo.messageId - The message ID
 * @param {String} messageInfo.raw - The raw message content
 * @returns {Promise<void>}
 */
async function storeSentMessage(messageInfo) {
  let imapClient;

  try {
    // TODO: env vars here later
    const supportImapConfig = {
      host: 'imap.forwardemail.net',
      port: 993,
      secure: true,
      auth: {
        user: env.SMTP_TRANSPORT_USER,
        pass: env.SMTP_TRANSPORT_PASS
      }
    };

    // Connect to IMAP
    imapClient = new ImapFlow(supportImapConfig);
    await imapClient.connect();

    // Find or create "Sent Mail" folder
    const sentFolder = 'Sent Mail';
    const folders = await imapClient.list();

    // Try common variations of sent folder names
    const sentFolderVariations = [
      'Sent Mail',
      'Sent',
      'Sent Items',
      'Sent Messages',
      'INBOX.Sent',
      'INBOX/Sent'
    ];

    let foundFolder = null;
    for (const variation of sentFolderVariations) {
      const folder = folders.find(
        (f) => f.name.toLowerCase() === variation.toLowerCase()
      );
      if (folder) {
        foundFolder = folder.name;
        break;
      }
    }

    if (!foundFolder) {
      // Create "Sent Mail" folder if it doesn't exist
      try {
        await imapClient.mailboxCreate(sentFolder);
        foundFolder = sentFolder;
      } catch (err) {
        logger.warn('Failed to create Sent Mail folder:', err);
        // Try with "Sent" as fallback
        try {
          await imapClient.mailboxCreate('Sent');
          foundFolder = 'Sent';
        } catch (err_) {
          logger.error('Failed to create any sent folder:', err_);
          return;
        }
      }
    }

    // Open the sent folder
    await imapClient.mailboxOpen(foundFolder);

    // Prepare the message for storage
    const messageBuffer = Buffer.from(messageInfo.raw, 'utf8');

    // Append the message to the sent folder
    await imapClient.append(foundFolder, messageBuffer, ['\\Seen'], new Date());

    logger.info('Successfully stored sent message in IMAP', {
      messageId: messageInfo.messageId,
      folder: foundFolder
    });
  } catch (err) {
    logger.error('Failed to store sent message in IMAP:', err);
    // Don't throw error to avoid breaking email sending
  } finally {
    if (imapClient) {
      try {
        await imapClient.logout();
      } catch (err) {
        logger.error('Error closing IMAP connection:', err);
      }
    }
  }
}

module.exports = storeSentMessage;
