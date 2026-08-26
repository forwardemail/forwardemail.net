/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const axios = require('axios');

const logger = require('#helpers/logger');
const config = require('#config');

//
// Embedding-based retrieval matches topic (bi-encoder: query and document
// are embedded independently, then compared by distance). It can't tell
// "why was my SMTP suspended" from "what do I need to get it reinstated" -
// both are topically about SMTP suspension, so they embed close together,
// even though a customer asking one needs a completely different answer
// than the other. A reranker sees the query and each candidate together
// (listwise, in one call) and can judge intent match, not just topic
// overlap - that's the fix for exactly this class of collision.
//
// No dedicated cross-encoder reranker is available via Ollama on this
// infra, so this uses the same generative model with a dedicated
// listwise-ranking prompt rather than pulling in new infrastructure.
//

const HOST = (config.ollamaHost || 'http://127.0.0.1:11434').replace(
  'localhost',
  '127.0.0.1'
);

function buildPrompt(queryText, candidates) {
  const items = candidates
    .map((c, i) => {
      const label = c.metadata.question || c.metadata.path || c.metadata.source;
      const snippet = c.text.slice(0, 400).replace(/\s+/g, ' ');
      return `[${i}] ${label}\n${snippet}`;
    })
    .join('\n\n');

  return `A customer asked this support question:

"${queryText}"

Below are candidate knowledge-base passages retrieved by keyword/topic similarity. Some may be topically related but NOT actually answer what the customer needs (e.g. explaining why something happened when they're asking how to fix it, or vice versa).

Score each passage 0-10 on whether it actually helps answer THIS customer's specific question - not just whether it's on the same general topic.

${items}

Respond with ONLY this JSON, one entry per candidate index, nothing else:
{"scores": [{"index": <number>, "relevance": <0-10>}]}`;
}

/**
 * Re-score and re-sort candidates by intent match rather than raw
 * embedding distance. Returns candidates in the same shape as
 * rankResults(), sorted by rerank score, with a `rerankScore` field added.
 * Falls back to the original embedding-based order (unchanged) if the
 * reranker call fails or returns something unparseable - a reranking
 * failure should degrade to "no reranking," never break retrieval.
 *
 * @param {string} queryText
 * @param {Array} candidates - output of rankResults()
 * @returns {Promise<Array>}
 */
async function rerank(queryText, candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) return candidates;

  try {
    const prompt = buildPrompt(queryText, candidates);

    const response = await axios.post(
      `${HOST}/api/chat`,
      {
        model: config.ollamaModel,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        format: 'json',
        think: true,
        options: {
          temperature: 0,
          // 3000 was too tight - observed truncating before finishing on
          // ~1/3 of real queries (a multi-candidate prompt gives a
          // reasoning model more to weigh than a single-answer judge
          // call). Matches the main generation budget.
          num_predict: 6000
        }
      },
      // 60s was too tight under real load - observed timing out mid-eval
      // run (GPU contention from sustained back-to-back requests), which
      // silently fell back to raw embedding order and cost id=56 its fix
      // even though rerank works correctly in isolation. Matching the
      // other judge-style calls' timeout instead of a shorter guess.
      { timeout: 120_000 }
    );

    if (response.data.done_reason === 'length') {
      throw new Error('reranker hit num_predict before finishing');
    }

    const raw =
      response.data.message?.content || response.data.message?.thinking || '';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/{[\s\S]*}/);
      parsed = m ? JSON.parse(m[0]) : null;
    }

    if (!parsed || !Array.isArray(parsed.scores)) {
      throw new Error('unparseable reranker response');
    }

    const scoreByIndex = new Map(
      parsed.scores.map((s) => [s.index, s.relevance])
    );

    const reranked = candidates.map((c, i) => ({
      ...c,
      rerankScore: scoreByIndex.has(i) ? scoreByIndex.get(i) : null,
      rerankFailed: false
    }));

    // If the model skipped some indices, keep them in their original
    // relative order at the bottom rather than treating missing as 0 -
    // safer than assuming "not scored" means "irrelevant."
    reranked.sort((a, b) => {
      if (a.rerankScore === null && b.rerankScore === null) return 0;
      if (a.rerankScore === null) return 1;
      if (b.rerankScore === null) return -1;
      return b.rerankScore - a.rerankScore;
    });

    return reranked;
  } catch (err) {
    logger.error(err, { context: 'rerank', queryText });
    // Marked, not silent: a record that "failed" downstream because the
    // right doc got cut before reranking had a chance to promote it looks
    // identical to a genuine model/retrieval limitation unless this is
    // visible - see id=56, where this exact silent fallback cost a
    // previously-verified fix without leaving any trace in the eval report.
    return candidates.map((c) => ({ ...c, rerankFailed: true }));
  }
}

module.exports = { rerank };
