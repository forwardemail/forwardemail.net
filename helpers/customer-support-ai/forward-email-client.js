/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const axios = require('axios');

const logger = require('#helpers/logger');
const config = require('#config');
const pgpDecrypt = require('#helpers/customer-support-ai/pgp-decrypt');
const isMessageEncrypted = require('#helpers/is-message-encrypted');

class ForwardEmailClient {
  constructor() {
    this.aliasUsername = config.forwardEmailAliasUsername;
    this.aliasPassword = config.forwardEmailAliasPassword;
    this.apiBase = config.forwardEmailApiBase || 'https://api.forwardemail.net';
  }

  async listFolders() {
    try {
      const response = await axios.get(`${this.apiBase}/v1/folders`, {
        auth: {
          username: this.aliasUsername,
          password: this.aliasPassword
        }
      });

      return response.data;
    } catch (err) {
      logger.error(err, { context: 'forward email list folders' });
      throw err;
    }
  }

  async listMessages(options = {}) {
    try {
      const response = await axios.get(`${this.apiBase}/v1/messages`, {
        auth: {
          username: this.aliasUsername,
          password: this.aliasPassword
        },
        params: {
          folder: options.folder || 'INBOX',
          limit: options.limit || 50,
          ...options
        }
      });

      return response.data;
    } catch (err) {
      logger.error(err, { context: 'forward email list messages' });
      throw err;
    }
  }

  async getMessage(id) {
    try {
      const response = await axios.get(`${this.apiBase}/v1/messages/${id}`, {
        auth: {
          username: this.aliasUsername,
          password: this.aliasPassword
        }
      });

      const message = response.data;

      // Decrypt PGP-encrypted messages (with recursive decryption support)
      if (message.text && isMessageEncrypted(message.text)) {
        logger.debug('Message text is encrypted, attempting decryption', {
          id
        });
        message.text = await pgpDecrypt(message.text);
        message.encrypted = true;
        message.decrypted = !isMessageEncrypted(message.text);
      }

      if (message.html && isMessageEncrypted(message.html)) {
        logger.debug('Message HTML is encrypted, attempting decryption', {
          id
        });
        message.html = await pgpDecrypt(message.html);
        message.encrypted = true;
        message.decrypted = !isMessageEncrypted(message.html);
      }

      return message;
    } catch (err) {
      logger.error(err, { context: 'forward email get message', id });
      throw err;
    }
  }

  async createDraft(draftData) {
    try {
      const response = await axios.post(
        `${this.apiBase}/v1/messages`,
        {
          ...draftData,
          folder: 'Drafts'
        },
        {
          auth: {
            username: this.aliasUsername,
            password: this.aliasPassword
          }
        }
      );

      return response.data;
    } catch (err) {
      logger.error(err, { context: 'forward email create draft', draftData });
      throw err;
    }
  }
}

module.exports = new ForwardEmailClient();
