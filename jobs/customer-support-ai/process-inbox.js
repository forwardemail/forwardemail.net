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
const { appendDraftLog } = require('#helpers/customer-support-ai/draft-log');

const graceful = new Graceful({
  logger
});

graceful.listen();

const {
  retrieveContext,
  retrieveHistoricalContext,
  getSourceUrl
} = require('#helpers/customer-support-ai/rag-retrieval');
const {
  checkGrounding
} = require('#helpers/customer-support-ai/grounding-check');

async function createDraft(message, analysis, generatedResponse, grounding) {
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

    // Log what we generated, keyed by the original message's Message-ID -
    // track-draft-outcomes.js diffs this against whatever eventually gets
    // sent (or doesn't) to build the sent-as-is/edited/discarded signal.
    appendDraftLog({
      draftId: draft.id,
      originalMessageId: messageId,
      subject,
      generatedText: generatedResponse.response,
      fallback: Boolean(generatedResponse.fallback),
      // Lets track-draft-outcomes.js correlate "was this flagged
      // ungrounded" against what a human actually did with it
      // (sent-as-is/edited/discarded) - the real-world calibration data
      // for whether this signal is worth acting on automatically later.
      grounded: grounding?.grounded ?? null,
      groundingClaims: grounding?.claims || [],
      createdAt: new Date().toISOString()
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

    const { text: context, ranked: kbRanked } = await retrieveContext(
      analysis,
      vectorStore
    );
    const { text: historicalContext } = await retrieveHistoricalContext(
      analysis,
      historyVectorStore
    );

    const topSourceUrl = kbRanked[0]
      ? getSourceUrl(kbRanked[0].metadata)
      : undefined;

    const generatedResponse = await responseGenerator.generateWithFallback(
      analysis,
      context,
      historicalContext,
      topSourceUrl
    );

    // Skip the check on fallback responses - the canned template makes no
    // factual claims to verify, and it's not worth the extra LLM call.
    const grounding = generatedResponse.fallback
      ? { grounded: true, claims: [], checkFailed: false }
      : await checkGrounding(generatedResponse.response, context);

    // Note: Draft check is done upfront in main loop, no need to check again
    const draft = await createDraft(
      fullMessage,
      analysis,
      generatedResponse,
      grounding
    );

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
