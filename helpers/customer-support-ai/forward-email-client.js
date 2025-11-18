/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const axios = require('axios');
const { Iconv } = require('iconv');
const { simpleParser } = require('mailparser');
const bytes = require('@forwardemail/bytes');

const env = require('#config/env');
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
          limit: options.limit || 100,
          eml: false, // Exclude EML file
          raw: false, // Exclude raw MIME
          nodemailer: false, // Exclude parsed content
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

      // Decrypt raw message if encrypted, then parse it
      if (message.raw) {
        let rawContent = message.raw;
        let wasEncrypted = false;

        // Check if raw message is encrypted
        const rawString = Buffer.isBuffer(rawContent)
          ? rawContent.toString('utf8')
          : rawContent;

        if (isMessageEncrypted(rawString)) {
          logger.debug('Raw message is encrypted, attempting decryption', {
            id
          });
          rawContent = await pgpDecrypt(rawContent);
          wasEncrypted = true;
          message.encrypted = true;
          message.decrypted = !isMessageEncrypted(rawContent);
        }

        // Parse the (possibly decrypted) raw message
        try {
          const parsed = await simpleParser(rawContent, {
            Iconv,
            skipHtmlToText: true,
            skipTextLinks: true,
            skipTextToHtml: true,
            skipImageLinks: true,
            maxHtmlLengthToParse: bytes(env.SMTP_MESSAGE_MAX_SIZE || '50MB')
          });

          // Update message with parsed content
          message.nodemailer = parsed;

          logger.debug('Parsed raw message', {
            id,
            hasText: Boolean(parsed.text),
            hasHtml: Boolean(parsed.html),
            wasEncrypted
          });
        } catch (err) {
          logger.error(err, {
            context: 'parse raw message in getMessage',
            id
          });
        }
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
