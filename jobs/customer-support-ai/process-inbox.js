/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
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
const {
  extractSenderEmail,
  extractSenderText,
  // extractCC,
  extractRecipients,
  buildReplyRecipients
} = require('#helpers/customer-support-ai/message-utils');

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
    // LanceDB returns normalized/squared L2 distances (typically 0.0-0.1)
    // Use exponential decay for better score distribution:
    // - distance 0.0 → score ~1.0 (perfect match)
    // - distance 0.01 → score ~0.9 (excellent match)
    // - distance 0.1 → score ~0.37 (good match)
    // - distance 1.0 → score ~0.00005 (poor match)
    const similarityScore = sourceWeight * Math.exp(-distance * 10);

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
        // Map app/views paths to actual website URLs
        // Docs: app/views/docs/{dir-name}/index.pug -> /blog/docs/{dir-name}
        // Other: app/views/{path}.pug -> /{path}

        // Handle docs directory structure
        const docsMatch = sourcePath.match(/^app\/views\/docs\/([^/]+)/);
        if (docsMatch) {
          const dirName = docsMatch[1];
          return `https://forwardemail.net/blog/docs/${dirName}`;
        }

        // Handle other views (remove app/views/ prefix and file extension)
        const webPath = sourcePath
          .replace(/^app\/views\//, '')
          .replace(/\.(md|pug)$/, '')
          .replace(/\/index$/, '');
        return `https://forwardemail.net/${webPath}`;
      }

      return 'https://forwardemail.net/search';
    }

    case 'technical_whitepaper': {
      return 'https://forwardemail.net/technical-whitepaper.pdf';
    }

    case 'api_spec': {
      return 'https://forwardemail.net/email-api';
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
    // Use full message content for better context matching
    const queryText = `${analysis.subject} ${analysis.content}`;
    logger.debug(
      { queryTextLength: queryText.length, subject: analysis.subject },
      'Query text for context retrieval'
    );

    const queryEmbedding = await ollamaClient.generateEmbedding(queryText);
    logger.debug(
      { embeddingLength: queryEmbedding.length },
      'Generated query embedding'
    );

    // Get dynamic limits based on question type
    const limits = getContextLimits(analysis);
    logger.debug({ limits }, 'Context limits');

    // Query with higher limit to allow for filtering
    const results = await vectorStore.query(queryEmbedding, {
      limit: limits.kb * 2
    });
    logger.debug(
      {
        documentsCount: results.documents?.[0]?.length || 0,
        distancesCount: results.distances?.[0]?.length || 0,
        metadatasCount: results.metadatas?.[0]?.length || 0
      },
      'Raw LanceDB results'
    );

    // Rank and weight results
    let ranked = rankResults(results, 'knowledge_base');
    logger.debug(
      {
        rankedCount: ranked.length,
        topScores: ranked.slice(0, 3).map((r) => r.score)
      },
      'After ranking'
    );

    // Deduplicate
    ranked = deduplicateContext(ranked);
    logger.debug({ afterDedup: ranked.length }, 'After deduplication');

    // Take top N after ranking and deduplication
    ranked = ranked.slice(0, limits.kb);
    logger.debug({ finalCount: ranked.length }, 'Final context count');

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
    // Use full message content for better context matching
    const queryText = `${analysis.subject} ${analysis.content}`;
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

    // Build reply recipients (handles Reply-To and CC)
    let { to, cc } = buildReplyRecipients(message, from);

    // CRITICAL: Never reply back to ourselves (support@forwardemail.net)
    // If the original sender is support@forwardemail.net, this is a help request notification
    // Reply to the To header (the actual customer) instead
    const originalSender = extractSenderEmail(message);
    if (originalSender && originalSender.toLowerCase() === from.toLowerCase()) {
      // This email is from us (support@forwardemail.net)
      // Reply to the To recipients (the actual customer)
      const toRecipients = extractRecipients(message);
      const nonSupportRecipients = toRecipients.filter(
        (email) => email.toLowerCase() !== from.toLowerCase()
      );

      if (nonSupportRecipients.length > 0) {
        to = nonSupportRecipients[0];
        cc = nonSupportRecipients.slice(1);
        logger.info(
          { originalSender, newTo: to, toRecipients, messageId: message.id },
          'Adjusted recipients - original sender was support@forwardemail.net, replying to To recipient'
        );
      } else {
        // This is a self-email with no other recipients - skip it
        logger.warn(
          { messageId: message.id, toRecipients },
          'Skipping draft creation - email is from support@forwardemail.net with no other recipients'
        );
        return null;
      }
    }

    // Get original message details for quoting
    const originalSenderText = extractSenderText(message);
    const originalDate =
      message.nodemailer?.date || message.header_date || new Date();
    const formattedDate = new Date(originalDate).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Get original message text content
    const originalText =
      message.nodemailer?.text || message.text || analysis.content || '';

    // Quote the original message (prefix each line with "> ")
    const quotedOriginal = originalText
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n');

    // Build reply with quoted original message
    // Note: Do NOT add signature here - LLM response should be complete
    const text = `${generatedResponse.response}

On ${formattedDate}, ${originalSenderText} wrote:
${quotedOriginal}`;

    // Extract threading headers from API response
    // API returns these at root level and in nodemailer.headers
    const messageId = message.header_message_id || message.id;

    // Get in-reply-to from nodemailer headers
    const inReplyTo =
      message.nodemailer?.headers?.['in-reply-to'] ||
      message.nodemailer?.inReplyTo ||
      messageId;

    // Get references from root level (API) or nodemailer
    // API returns references as array at root level
    let references = message.references || message.nodemailer?.references || [];

    // Ensure references is an array
    if (!Array.isArray(references)) {
      references = [references];
    }

    // Add current message to references chain
    references = [...references, messageId];

    // Join into space-separated string for email headers
    references = references.filter(Boolean).join(' ');

    const draftData = {
      from,
      to,
      subject,
      text,
      inReplyTo,
      references
    };

    // Add CC if there are any recipients
    if (cc.length > 0) {
      draftData.cc = cc.join(', ');
    }

    const draft = await forwardEmailClient.createDraft(draftData);

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

    // Note: Draft existence and skip-ai label checks are now done upfront in main loop

    // Log message structure to debug content extraction
    logger.debug(
      {
        hasNodemailer: Boolean(fullMessage.nodemailer),
        hasNodemailerText: Boolean(fullMessage.nodemailer?.text),
        hasNodemailerHtml: Boolean(fullMessage.nodemailer?.html),
        hasText: Boolean(fullMessage.text),
        hasHtml: Boolean(fullMessage.html),
        hasBody: Boolean(fullMessage.body),
        nodemailerTextLength: fullMessage.nodemailer?.text?.length || 0,
        nodemailerHtmlLength: fullMessage.nodemailer?.html?.length || 0,
        subject: fullMessage.subject
      },
      'Message structure'
    );

    const analysis = await messageAnalyzer.analyze(fullMessage);
    logger.debug(
      {
        contentLength: analysis.content?.length || 0,
        contentPreview: analysis.content?.slice(0, 100) || '(empty)',
        subject: analysis.subject,
        keywords: analysis.keywords
      },
      'Analysis result'
    );

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

    // Note: Draft check is done upfront in main loop, no need to check again
    const draft = await createDraft(fullMessage, analysis, generatedResponse);

    logger.info(
      {
        messageId: message.id,
        draftId: draft.id,
        questionType: analysis.questionType,
        urgency: analysis.urgency,
        model: generatedResponse.model
      },
      'Draft created successfully'
    );

    // Archive the original message after successful draft creation
    // (if and only if `env.INBOX_ZERO` is set to `true`)
    if (config.inboxZero) {
      try {
        await forwardEmailClient.ensureFolder('Archive');
        await forwardEmailClient.moveMessage(fullMessage.id, 'Archive');
        logger.info(
          { messageId: fullMessage.id, draftId: draft.id },
          'Message archived successfully'
        );
      } catch (err) {
        logger.error(err, {
          context: 'archive message after draft creation',
          messageId: fullMessage.id
        });
        // Don't throw - draft was created successfully
      }
    }

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

    // OPTIMIZATION: List ALL drafts and inbox messages upfront, then filter
    logger.info('Listing all drafts to check for existing responses...');
    const allDrafts = await forwardEmailClient.listAllMessages({
      folder: 'Drafts'
    });

    // Extract all message IDs that drafts are replying to
    const draftMessageIds = new Set();
    for (const draft of allDrafts) {
      // Check in-reply-to and references headers
      const inReplyTo = draft.header_in_reply_to || draft.in_reply_to;
      const references = draft.references || [];

      if (inReplyTo) draftMessageIds.add(inReplyTo);
      if (Array.isArray(references)) {
        for (const ref of references) {
          draftMessageIds.add(ref);
        }
      }
    }

    logger.info(
      { totalDrafts: allDrafts.length, uniqueMessageIds: draftMessageIds.size },
      'Indexed existing drafts'
    );

    // List ALL inbox messages
    logger.info('Listing all inbox messages...');
    const allInboxMessages = await forwardEmailClient.listAllMessages({
      folder: 'INBOX'
    });

    logger.info(
      { count: allInboxMessages.length },
      'Retrieved all inbox messages'
    );

    // Filter out messages that:
    // 1. Already have drafts
    // 2. Have "skip-ai" label
    const messagesToProcess = allInboxMessages.filter((message) => {
      // Check if draft already exists
      const messageId = message.header_message_id || message.id;
      if (draftMessageIds.has(messageId)) {
        logger.debug(
          { messageId: message.id },
          'Skipping - draft already exists'
        );
        return false;
      }

      // Check for skip-ai label
      const labels = message.labels || [];
      const hasSkipAI = labels.some(
        (label) => label.toLowerCase() === 'skip-ai'
      );
      if (hasSkipAI) {
        logger.debug({ messageId: message.id }, 'Skipping - has skip-ai label');
        return false;
      }

      return true;
    });

    logger.info(
      {
        total: allInboxMessages.length,
        toProcess: messagesToProcess.length,
        skipped: allInboxMessages.length - messagesToProcess.length
      },
      'Filtered messages to process'
    );

    // Process remaining messages
    for (const message of messagesToProcess) {
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
