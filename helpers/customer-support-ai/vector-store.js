/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');
const os = require('node:os');

const lancedb = require('@lancedb/lancedb');

const config = require('#config');
const logger = require('#helpers/logger');
const ollamaClient = require('#helpers/customer-support-ai/ollama-client');

class VectorStore {
  constructor(options = {}) {
    this.dbPath =
      options.lancedbPath ||
      config.lancedbPath ||
      path.join(os.homedir(), '.local', 'share', 'lancedb');
    this.tableName = options.collectionName || 'forward_email_knowledge_base';
    this.db = null;
    this.table = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      // Connect to LanceDB
      this.db = await lancedb.connect(this.dbPath);

      // Check if table exists
      const tableNames = await this.db.tableNames();

      if (tableNames.includes(this.tableName)) {
        // Open existing table
        this.table = await this.db.openTable(this.tableName);
        logger.info('Opened existing vector store table', {
          table: this.tableName,
          path: this.dbPath
        });
      } else {
        // Create new table with schema
        // LanceDB will create it on first insert
        logger.info('Vector store table will be created on first insert', {
          table: this.tableName,
          path: this.dbPath
        });
      }

      this.initialized = true;
      logger.info('Vector store initialized', {
        table: this.tableName,
        path: this.dbPath
      });
    } catch (err) {
      logger.error('Vector store initialization failed', { error: err });
      throw err;
    }
  }

  async addDocument(text, metadata = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Generate embedding
      const embedding = await ollamaClient.generateEmbedding(text);

      // Prepare document
      const doc = {
        text,
        vector: embedding,
        metadata: JSON.stringify(metadata),
        timestamp: new Date().toISOString(),
        id: Date.now().toString() + Math.random().toString(36).slice(2, 9)
      };

      // Create or append to table
      if (this.table) {
        await this.table.add([doc]);
      } else {
        this.table = await this.db.createTable(this.tableName, [doc]);
      }

      logger.debug('Document added to vector store', {
        id: doc.id,
        table: this.tableName
      });

      return doc.id;
    } catch (err) {
      logger.error('Failed to add document', { error: err });
      throw err;
    }
  }

  async addDocuments(documents) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Prepare batch documents
      const docs = await Promise.all(
        documents.map(async (doc) => {
          const embedding =
            doc.embedding || (await ollamaClient.generateEmbedding(doc.text));

          return {
            text: doc.text,
            vector: embedding,
            metadata: JSON.stringify(doc.metadata || {}),
            timestamp: new Date().toISOString(),
            id: Date.now().toString() + Math.random().toString(36).slice(2, 9)
          };
        })
      );

      // Create or append to table
      if (this.table) {
        await this.table.add(docs);
      } else {
        this.table = await this.db.createTable(this.tableName, docs);
      }

      logger.info('Documents added to vector store', {
        count: documents.length,
        table: this.tableName
      });
    } catch (err) {
      logger.error('Failed to add documents', { error: err });
      throw err;
    }
  }

  async query(queryEmbedding, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.table) {
      // No data yet
      return {
        ids: [[]],
        distances: [[]],
        metadatas: [[]],
        documents: [[]]
      };
    }

    try {
      // Search in LanceDB using vector
      const results = await this.table
        .search(queryEmbedding)
        .limit(options.limit || 5)
        .execute();

      // Transform to match ChromaDB format for compatibility
      return {
        ids: [results.map((item) => item.id)],
        distances: [results.map((item) => item._distance)],
        metadatas: [
          results.map((item) => {
            try {
              return JSON.parse(item.metadata || '{}');
            } catch {
              return {};
            }
          })
        ],
        documents: [results.map((item) => item.text)]
      };
    } catch (err) {
      logger.error('Vector store query failed', { error: err });
      throw err;
    }
  }

  async queryText(queryText, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Generate query embedding
      const queryEmbedding = await ollamaClient.generateEmbedding(queryText);

      // Use the query method
      return await this.query(queryEmbedding, options);
    } catch (err) {
      logger.error('Vector store text query failed', { error: err });
      throw err;
    }
  }

  async clear() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      if (this.table) {
        // Drop and recreate table
        await this.db.dropTable(this.tableName);
        this.table = null;
        logger.info('Vector store cleared', { table: this.tableName });
      }
    } catch (err) {
      logger.error('Failed to clear vector store', { error: err });
      throw err;
    }
  }

  async count() {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.table) {
      return 0;
    }

    try {
      const count = await this.table.countRows();
      return count;
    } catch (err) {
      logger.error('Failed to get vector store count', { error: err });
      return 0;
    }
  }
}

module.exports = VectorStore;
