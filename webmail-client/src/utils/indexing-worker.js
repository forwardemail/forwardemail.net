/**
 * Background indexing worker for progressive message indexing
 * Handles indexing messages across all folders with body content support
 */

import ko from 'knockout';
import { db } from './db';
import { Remote } from './remote';
import * as openpgp from 'openpgp';

export class IndexingWorker {
  constructor(searchService, options = {}) {
    this.searchService = searchService;
    this.isIndexing = ko.observable(false);
    this.progress = ko.observable(0);
    this.totalToIndex = ko.observable(0);
    this.indexed = ko.observable(0);
    this.currentFolder = ko.observable('');
    this.paused = false;
    this.batchSize = options.batchSize || 50;
    this.includeBody = options.includeBody || false;
    this.pgpKeys = options.pgpKeys || [];
    this.passphraseCache = options.passphraseCache || {};
    this.onProgress = options.onProgress || null;
    this.account = options.account || 'default';
    this.maxMessages = options.maxMessages || 1000;
    this.maxAgeDays = options.maxAgeDays || 90;
    this.indexedCount = 0;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  stop() {
    this.paused = true;
    this.isIndexing(false);
  }

  async indexAllFolders(folders) {
    if (this.isIndexing()) {
      console.warn('Indexing already in progress');
      return;
    }

    this.isIndexing(true);
    this.paused = false;
    this.progress(0);
    this.indexed(0);
    this.indexedCount = 0;

    try {
      // Estimate total messages (capped by maxMessages)
      const totalMessages = Math.min(
        folders.reduce((sum, f) => sum + (f.count || 0), 0),
        this.maxMessages,
      );
      this.totalToIndex(totalMessages);

      console.log('Starting indexing with limits:', {
        maxMessages: this.maxMessages,
        maxAgeDays: this.maxAgeDays,
        includeBody: this.includeBody,
      });

      for (const folder of folders) {
        if (this.paused) break;
        if (this.indexedCount >= this.maxMessages) {
          console.log('Reached max message limit:', this.maxMessages);
          break;
        }

        this.currentFolder(folder.path || folder.name);
        await this.indexFolder(folder.path || folder.name);
      }

      // Persist the index after completion
      await this.searchService.persist();
      await this.updateIndexMetadata();

      if (this.onProgress) {
        this.onProgress({
          type: 'complete',
          indexed: this.indexed(),
          total: this.totalToIndex(),
        });
      }
    } catch (error) {
      console.error('Indexing failed:', error);
      if (this.onProgress) {
        this.onProgress({
          type: 'error',
          error: error.message,
        });
      }
    } finally {
      this.isIndexing(false);
      this.currentFolder('');
    }
  }

  async indexFolder(folderPath, startPage = 1) {
    let page = startPage;
    let hasMore = true;

    while (hasMore && !this.paused) {
      try {
        // Fetch messages page by page
        const messagesRes = await Remote.request('MessageList', {
          folder: folderPath,
          page: page,
          limit: 100,
        });

        const messages = messagesRes?.Result?.List || [];
        hasMore = messages.length === 100;

        if (messages.length === 0) break;

        // Add to index in batches
        await this.addBatchToIndex(messages, folderPath);

        page++;

        // Small delay to prevent blocking UI
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to index folder ${folderPath} page ${page}:`, error);
        // Continue with next page even if one fails
        hasMore = false;
      }
    }
  }

  async addBatchToIndex(messages, folder) {
    const cutoffDate = Date.now() - this.maxAgeDays * 24 * 60 * 60 * 1000;

    for (const msg of messages) {
      if (this.paused) break;
      if (this.indexedCount >= this.maxMessages) {
        console.log('Reached max message limit during batch processing');
        break;
      }

      try {
        // Check message age
        const msgDate = new Date(msg.date || msg.Date).getTime();
        if (msgDate < cutoffDate) {
          console.log(
            'Skipping old message:',
            msg.subject,
            'from',
            new Date(msgDate).toISOString(),
          );
          continue;
        }

        const doc = {
          id: msg.Uid || msg.id,
          folder: folder,
          subject: msg.Subject || msg.subject || '',
          from: this.extractEmail(msg.From) || msg.from || '',
          to: this.extractEmail(msg.To) || msg.to || '',
          cc: this.extractEmail(msg.Cc) || msg.cc || '',
          snippet: msg.snippet || msg.preview || '',
          date: msg.date || msg.Date || '',
        };

        // If full-text indexing enabled, fetch and index body
        if (this.includeBody) {
          const bodyText = await this.fetchMessageBodyText(msg.Uid || msg.id, folder);
          if (bodyText) {
            doc.body = bodyText;
            doc.textContent = bodyText;
          }
        }

        this.searchService.addEntry(doc);
        this.indexed(this.indexed() + 1);
        this.indexedCount++;
        this.updateProgress();

        if (this.onProgress && this.indexed() % 10 === 0) {
          this.onProgress({
            type: 'progress',
            indexed: this.indexed(),
            total: this.totalToIndex(),
            folder: folder,
          });
        }
      } catch (error) {
        console.warn('Failed to index message:', error);
        // Continue with next message
      }
    }
  }

  async fetchMessageBodyText(messageId, folder) {
    try {
      // Check cache first
      const cachedBody = await db.messageBodies.get({
        account: this.account,
        id: messageId,
      });

      if (cachedBody?.textContent) {
        return cachedBody.textContent;
      }

      // Fetch from API
      const detail = await Remote.request(
        'Message',
        { id: messageId, folder },
        { pathOverride: `/v1/messages/${encodeURIComponent(messageId)}` },
      );

      const result = detail?.Result || detail;
      let html = result?.html || result?.Html || '';
      let text = result?.text || result?.Plain || '';

      // Check if message is PGP encrypted
      const isPgpEncrypted = this.isPgpEncrypted(html || text);

      if (isPgpEncrypted && this.pgpKeys.length > 0) {
        try {
          const decrypted = await this.decryptPgpMessage(html || text);
          if (decrypted) {
            html = decrypted;
            text = decrypted;
          }
        } catch (error) {
          console.warn('Failed to decrypt PGP message for indexing:', error);
        }
      }

      // Extract text content
      const textContent = this.extractTextContent(html || text);

      // Cache it
      await db.messageBodies.put({
        id: messageId,
        account: this.account,
        folder,
        body: html || text,
        textContent,
        updatedAt: Date.now(),
      });

      return textContent;
    } catch (error) {
      console.warn('Failed to fetch message body for indexing:', error);
      return '';
    }
  }

  extractEmail(addressObj) {
    if (!addressObj) return '';
    if (typeof addressObj === 'string') return addressObj;
    if (addressObj.Email) return addressObj.Email;
    if (addressObj.email) return addressObj.email;
    if (Array.isArray(addressObj)) {
      return addressObj
        .map((a) => this.extractEmail(a))
        .filter(Boolean)
        .join(', ');
    }
    return '';
  }

  extractTextContent(html) {
    if (!html) return '';

    // Strip HTML tags and normalize whitespace
    const text = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Limit length to prevent huge indexes
    const maxLength = 50000; // 50KB max per message
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  }

  isPgpEncrypted(content) {
    if (!content) return false;
    return /-----BEGIN PGP MESSAGE-----/i.test(content);
  }

  async decryptPgpMessage(armoredMessage) {
    if (!this.pgpKeys || this.pgpKeys.length === 0) return null;

    for (const key of this.pgpKeys) {
      try {
        const privateKey = await openpgp.readPrivateKey({ armoredKey: key.value });
        let unlocked = privateKey;

        if (!privateKey.isDecrypted()) {
          // Try cached passphrase first
          const passphrase = this.passphraseCache[key.name];
          if (!passphrase) {
            console.warn('No passphrase available for key:', key.name);
            continue;
          }

          unlocked = await openpgp.decryptKey({
            privateKey,
            passphrase,
          });
        }

        const message = await openpgp.readMessage({ armoredMessage });
        const { data } = await openpgp.decrypt({
          message,
          decryptionKeys: unlocked,
        });

        return data;
      } catch (error) {
        console.warn('PGP decrypt failed for key', key.name, error);
        continue;
      }
    }

    return null;
  }

  updateProgress() {
    if (this.totalToIndex() > 0) {
      const percent = Math.round((this.indexed() / this.totalToIndex()) * 100);
      this.progress(percent);
    }
  }

  async updateIndexMetadata() {
    await db.indexMeta.put({
      key: 'indexed_message_count',
      account: this.account,
      value: this.indexed(),
      updatedAt: Date.now(),
    });

    await db.indexMeta.put({
      key: 'last_index_update',
      account: this.account,
      value: new Date().toISOString(),
      updatedAt: Date.now(),
    });

    const stats = this.searchService.getStats();
    await db.indexMeta.put({
      key: 'index_stats',
      account: this.account,
      value: stats,
      updatedAt: Date.now(),
    });
  }

  async getIndexMetadata() {
    const count = await db.indexMeta.get({
      account: this.account,
      key: 'indexed_message_count',
    });

    const lastUpdate = await db.indexMeta.get({
      account: this.account,
      key: 'last_index_update',
    });

    const stats = await db.indexMeta.get({
      account: this.account,
      key: 'index_stats',
    });

    return {
      count: count?.value || 0,
      lastUpdate: lastUpdate?.value || null,
      stats: stats?.value || null,
    };
  }
}
