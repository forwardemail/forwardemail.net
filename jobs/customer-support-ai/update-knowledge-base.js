/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

const Graceful = require('@ladjs/graceful');

const logger = require('#helpers/logger');
const scraper = require('#helpers/customer-support-ai/scraper');
const processor = require('#helpers/customer-support-ai/processor');
const ollamaClient = require('#helpers/customer-support-ai/ollama-client');
const VectorStore = require('#helpers/customer-support-ai/vector-store');

const graceful = new Graceful({
  logger
});

graceful.listen();

(async () => {
  try {
    logger.info('Starting knowledge base update');

    const vectorStore = new VectorStore();
    await vectorStore.initialize();

    logger.info('Scraping knowledge sources');
    const rawDocs = await scraper.scrapeAll();

    logger.info({ count: rawDocs.length }, 'Processing documents');
    const chunks = processor.processDocuments(rawDocs);

    logger.info({ count: chunks.length }, 'Generating embeddings');
    const texts = chunks.map((chunk) => chunk.text);
    const embeddings = await ollamaClient.generateEmbeddings(texts);

    const documents = processor.prepareForVectorStore(chunks, embeddings);

    logger.info('Clearing existing vector store');
    await vectorStore.clear();

    logger.info(
      { count: documents.length },
      'Adding documents to vector store'
    );
    await vectorStore.addDocuments(documents);

    const finalCount = await vectorStore.count();
    logger.info({ count: finalCount }, 'Knowledge base update completed');
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
