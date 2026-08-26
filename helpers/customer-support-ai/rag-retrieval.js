/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

const logger = require('#helpers/logger');
const ollamaClient = require('#helpers/customer-support-ai/ollama-client');
const { rerank } = require('#helpers/customer-support-ai/reranker');

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

    // Calculate final score (lower distance = higher similarity).
    // This score is rendered directly into the prompt as "Relevance: X%",
    // so its calibration isn't cosmetic - it's part of what the model reads
    // to decide how much to trust the retrieved context.
    //
    // Refit against qwen3-embedding:8b on this KB at scale (see
    // .customer-support-archive/distance-distribution.js): top-1 distance
    // across the full 867-question real historical eval-set vs. 25
    // deliberately irrelevant queries ("what's the best cookie recipe").
    //
    //   real questions:  p10=0.337 p25=0.414 median=0.518 p75=0.633
    //                    p90=0.762 max=1.200
    //   irrelevant:      p10=1.268 median=1.385 max=1.523
    //
    // The two distributions are cleanly separated right around 1.2-1.27 -
    // the single worst-matching real question in the whole 867-question
    // corpus still sits below the closest of the 25 irrelevant queries.
    // -1.8 anchors the irrelevant floor (p10=1.268) to ~10%, which is what
    // actually matters here (suppressing genuinely irrelevant context),
    // while a typical real match (median=0.518) reads as ~39% and a
    // strong one (p10=0.337) as ~54% - a believable, discriminating
    // signal instead of the earlier -2's ~40-50% band, which was fit on
    // only 7 queries and put the irrelevant floor far too close in
    // (~0.73) to real matches. Re-tune this if the embedding model or KB
    // changes materially - it's model/corpus-specific, not universal.
    const similarityScore = sourceWeight * Math.exp(-distance * 1.8);

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

    // Rerank the full deduplicated candidate pool BEFORE cutting to the
    // final top-N - embedding distance matches topic, not intent, so the
    // actually-correct answer sometimes sits just past the cutoff (e.g.
    // "how do I get unstuck" embedding closer to the general suspension
    // explanation than the specific reinstatement-criteria answer that
    // actually resolves it). Reranking after the cut can't recover a
    // candidate that's already gone.
    if (process.env.SUPPORT_RERANK_ENABLED !== 'false') {
      ranked = await rerank(queryText, ranked);
    }

    // Take top N after ranking, deduplication, and reranking
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

    return { text: contextParts.join('\n\n---\n\n'), ranked };
  } catch (err) {
    logger.error(err, { context: 'retrieve context' });
    return { text: '', ranked: [] };
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

    // See retrieveContext() - rerank before cutting to the final top-N,
    // not after.
    if (process.env.SUPPORT_RERANK_ENABLED !== 'false') {
      ranked = await rerank(queryText, ranked);
    }

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

    return { text: contextParts.join('\n\n---\n\n'), ranked };
  } catch (err) {
    logger.error(err, { context: 'retrieve historical context' });
    return { text: '', ranked: [] };
  }
}

module.exports = {
  SOURCE_WEIGHTS,
  getContextLimits,
  deduplicateContext,
  rankResults,
  getSourceUrl,
  retrieveContext,
  retrieveHistoricalContext
};
