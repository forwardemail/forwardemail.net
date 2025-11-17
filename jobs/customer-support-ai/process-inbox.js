/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

const Graceful = require('@ladjs/graceful');

const config = require('#config');
const logger = require('#helpers/logger');
const ollamaClient = require('#helpers/customer-support-ai/ollama-client');
const forwardEmailClient = require('#helpers/customer-support-ai/forward-email-client');
const VectorStore = require('#helpers/customer-support-ai/vector-store');
const messageAnalyzer = require('#helpers/customer-support-ai/message-analyzer');
const responseGenerator = require('#helpers/customer-support-ai/response-generator');

const graceful = new Graceful({
  logger
});

graceful.listen();

// Source weights for ranking (higher = more important)
const SOURCE_WEIGHTS = {
  faq: 1, // Highest priority - official FAQ
  technical_whitepaper: 0.95, // Very authoritative
  api_spec: 0.9, // Official API documentation
  local_markdown: 0.85, // Official docs
  github_issue: 0.7, // Community discussions
  github_discussion: 0.65,
  github_pr: 0.6,
  historical_email: 0.5 // Lower priority - past conversations
};

// Dynamic context limits based on question type
function getContextLimits(analysis) {
  const limits = {
    technical: { kb: 8, history: 2 }, // More docs, less history
    billing: { kb: 3, history: 5 }, // Less docs, more history
    account: { kb: 4, history: 4 }, // Balanced
    feature: { kb: 6, history: 3 }, // More docs
    bug: { kb: 5, history: 4 }, // Balanced with history
    other: { kb: 5, history: 3 } // Default
  };

  return limits[analysis.questionType] || limits.other;
}

// Deduplicate context chunks based on content similarity
function deduplicateContext(chunks) {
  const seen = new Set();
  return chunks.filter((chunk) => {
    // Use first 100 chars as signature
    const signature = chunk.text.slice(0, 100).trim().toLowerCase();
    if (seen.has(signature)) {
      return false;
    }

    seen.add(signature);
    return true;
  });
}

// Weight and rank results by source type and distance
function rankResults(results, sourceType = 'knowledge_base') {
  if (!results.documents || !results.documents[0]) {
    return [];
  }

  const ranked = results.documents[0].map((doc, index) => {
    const metadata = results.metadatas?.[0]?.[index] || {};
    const distance = results.distances?.[0]?.[index] || 1;

    // Get source weight
    const source = metadata.source || sourceType;
    const sourceWeight = SOURCE_WEIGHTS[source] || 0.5;

    // Calculate final score (lower distance = higher similarity)
    // Invert distance and apply source weight
    const similarityScore = (1 - distance) * sourceWeight;

    return {
      text: doc,
      metadata,
      distance,
      sourceWeight,
      score: similarityScore
    };
  });

  // Sort by score (highest first)
  ranked.sort((a, b) => b.score - a.score);

  return ranked;
}

// Generate source URL for attribution
function getSourceUrl(metadata) {
  const {
    source,
    path: sourcePath,
    issueNumber,
    prNumber,
    discussionNumber
  } = metadata;

  switch (source) {
    case 'faq': {
      return 'https://forwardemail.net/faq';
    }

    case 'local_markdown': {
      if (sourcePath) {
        // Convert app/views/path.md to https://forwardemail.net/path
        const webPath = sourcePath
          .replace(/^app\/views\//, '')
          .replace(/\.md$/, '')
          .replace(/index$/, '');
        return `https://forwardemail.net/${webPath}`;
      }

      return 'https://forwardemail.net/docs';
    }

    case 'technical_whitepaper': {
      return 'https://forwardemail.net/technical-whitepaper.pdf';
    }

    case 'api_spec': {
      return 'https://forwardemail.net/api';
    }

    case 'github_issue': {
      return `https://github.com/forwardemail/forwardemail.net/issues/${issueNumber}`;
    }

    case 'github_pr': {
      return `https://github.com/forwardemail/forwardemail.net/pull/${prNumber}`;
    }

    case 'github_discussion': {
      return `https://github.com/forwardemail/forwardemail.net/discussions/${discussionNumber}`;
    }

    default: {
      return 'https://forwardemail.net';
    }
  }
}

async function retrieveContext(analysis, vectorStore) {
  try {
    const queryText = `${analysis.subject} ${analysis.keywords.join(' ')}`;
    const queryEmbedding = await ollamaClient.generateEmbedding(queryText);

    // Get dynamic limits based on question type
    const limits = getContextLimits(analysis);

    // Query with higher limit to allow for filtering
    const results = await vectorStore.query(queryEmbedding, {
      limit: limits.kb * 2
    });

    // Rank and weight results
    let ranked = rankResults(results, 'knowledge_base');

    // Deduplicate
    ranked = deduplicateContext(ranked);

    // Take top N after ranking and deduplication
    ranked = ranked.slice(0, limits.kb);

    // Format context with source attribution
    const contextParts = ranked.map((item) => {
      const sourceUrl = getSourceUrl(item.metadata);
      const sourceLabel = item.metadata.source || 'documentation';
      return `Source: ${sourceLabel} (${sourceUrl})\nRelevance: ${(
        item.score * 100
      ).toFixed(1)}%\n\n${item.text}`;
    });

    logger.debug('Retrieved knowledge base context', {
      total: results.documents?.[0]?.length || 0,
      afterRanking: ranked.length,
      questionType: analysis.questionType
    });

    return contextParts.join('\n\n---\n\n');
  } catch (err) {
    logger.error(err, { context: 'retrieve context' });
    return '';
  }
}

async function retrieveHistoricalContext(analysis, historyVectorStore) {
  try {
    const queryText = `${analysis.subject} ${analysis.keywords.join(' ')}`;
    const queryEmbedding = await ollamaClient.generateEmbedding(queryText);

    // Get dynamic limits
    const limits = getContextLimits(analysis);

    // Query historical emails
    const results = await historyVectorStore.query(queryEmbedding, {
      limit: limits.history * 2
    });

    // Rank results
    let ranked = rankResults(results, 'historical_email');

    // Deduplicate
    ranked = deduplicateContext(ranked);

    // Take top N
    ranked = ranked.slice(0, limits.history);

    const contextParts = ranked.map((item) => {
      const { metadata } = item;
      return `Past Email (${metadata.date || 'unknown'}):\nSubject: ${
        metadata.subject || 'N/A'
      }\nRelevance: ${(item.score * 100).toFixed(1)}%\n\n${item.text.slice(
        0,
        500
      )}...`;
    });

    logger.debug('Retrieved historical context', {
      total: results.documents?.[0]?.length || 0,
      afterRanking: ranked.length,
      questionType: analysis.questionType
    });

    return contextParts.join('\n\n---\n\n');
  } catch (err) {
    logger.error(err, { context: 'retrieve historical context' });
    return '';
  }
}

async function createDraft(message, analysis, generatedResponse) {
  try {
    const subject = `Re: ${analysis.subject
      .replace(/^(re:|fwd?:)\s*/gi, '')
      .trim()}`;

    const from = config.forwardEmailAliasUsername;
    const to = analysis.sender;

    const text = `${generatedResponse.response}\n\n--\nThank you,\nForward Email Support Team\nhttps://forwardemail.net`;

    const draft = await forwardEmailClient.createDraft({
      from,
      to,
      subject,
      text,
      inReplyTo: message.messageId || message.id,
      references: message.references || message.messageId || message.id
    });

    logger.info(
      { draftId: draft.id, messageId: analysis.messageId },
      'Draft created successfully'
    );

    return draft;
  } catch (err) {
    logger.error(err, {
      context: 'create draft',
      messageId: analysis.messageId
    });
    throw err;
  }
}

async function processMessage(message, vectorStore, historyVectorStore) {
  try {
    logger.info({ messageId: message.id }, 'Processing message');

    const fullMessage = await forwardEmailClient.getMessage(message.id);

    const analysis = messageAnalyzer.analyze(fullMessage);

    const context = await retrieveContext(analysis, vectorStore);
    const historicalContext = await retrieveHistoricalContext(
      analysis,
      historyVectorStore
    );

    const generatedResponse = await responseGenerator.generateWithFallback(
      analysis,
      context,
      historicalContext
    );

    const draft = await createDraft(fullMessage, analysis, generatedResponse);

    logger.info(
      {
        messageId: message.id,
        draftId: draft.id,
        questionType: analysis.questionType,
        urgency: analysis.urgency,
        model: generatedResponse.model
      },
      'Message processed successfully'
    );

    return draft;
  } catch (err) {
    logger.error(err, { context: 'process message', messageId: message.id });
    throw err;
  }
}

(async () => {
  try {
    logger.info('Starting customer support AI inbox processing');

    const ollamaHealthy = await ollamaClient.checkHealth();
    if (!ollamaHealthy) {
      throw new Error('Ollama is not running or not accessible');
    }

    logger.info('Ollama connection verified');

    const vectorStore = new VectorStore();
    await vectorStore.initialize();

    const vectorCount = await vectorStore.count();
    logger.info({ count: vectorCount }, 'Vector store initialized');

    if (vectorCount === 0) {
      logger.warn('Vector store is empty. Run knowledge base update first.');
    }

    const historyVectorStore = new VectorStore({
      collectionName: 'customer_support_history'
    });
    await historyVectorStore.initialize();

    const messages = await forwardEmailClient.listMessages({
      folder: 'INBOX',
      limit: config.customerSupportAiInboxLimit || 10
    });

    logger.info({ count: messages.length }, 'Retrieved inbox messages');

    for (const message of messages) {
      try {
        await processMessage(message, vectorStore, historyVectorStore);
      } catch (err) {
        logger.error(err, { messageId: message.id });
      }
    }

    logger.info('Inbox processing completed');
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
