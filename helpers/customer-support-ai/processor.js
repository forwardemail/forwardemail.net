/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const logger = require('#helpers/logger');

class DocumentProcessor {
  constructor() {
    this.chunkSize = 1000;
    this.chunkOverlap = 200;
  }

  chunkText(text, metadata = {}) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + this.chunkSize, text.length);
      const chunk = text.slice(start, end);

      chunks.push({
        text: chunk,
        metadata: {
          ...metadata,
          chunkIndex: chunks.length,
          startOffset: start,
          endOffset: end
        }
      });

      start += this.chunkSize - this.chunkOverlap;
    }

    return chunks;
  }

  processDocuments(documents) {
    const allChunks = [];

    for (const doc of documents) {
      if (!doc || !doc.content) continue;

      const chunks = this.chunkText(doc.content, {
        source: doc.source,
        type: doc.type,
        title: doc.title,
        scrapedAt: doc.scrapedAt
      });

      allChunks.push(...chunks);
    }

    logger.info({ count: allChunks.length }, 'Processed documents into chunks');

    return allChunks;
  }

  prepareForVectorStore(chunks, embeddings) {
    return chunks.map((chunk, index) => ({
      id: crypto.randomUUID(),
      text: chunk.text,
      embedding: embeddings[index],
      metadata: chunk.metadata
    }));
  }
}

module.exports = new DocumentProcessor();
