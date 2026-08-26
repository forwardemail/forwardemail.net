/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const axios = require('axios');
const yaml = require('js-yaml');

const logger = require('#helpers/logger');
const VectorStore = require('#helpers/customer-support-ai/vector-store');
const messageAnalyzer = require('#helpers/customer-support-ai/message-analyzer');
const responseGenerator = require('#helpers/customer-support-ai/response-generator');
const {
  retrieveContext,
  retrieveHistoricalContext,
  getSourceUrl
} = require('#helpers/customer-support-ai/rag-retrieval');
const {
  checkGrounding
} = require('#helpers/customer-support-ai/grounding-check');

/**
 * Scores response-generator.js's actual drafts against the golden eval set,
 * using the real retrieval pipeline (rag-retrieval.js) against whatever is
 * actually in the vector store - not a mock. This measures the real system,
 * including retrieval quality, not just prompt quality in isolation.
 *
 * Judging (does the draft actually state each expected fact) is a separate,
 * deliberately swappable model call - see SUPPORT_EVAL_OLLAMA_HOST below -
 * so a small/cheap generation model can be checked by a stronger judge.
 */

const DATA_DIR =
  process.env.SUPPORT_ARCHIVE_OUTPUT_DIR ||
  path.join(process.cwd(), '.customer-support-archive');
const GOLDEN_PATH =
  process.env.EVAL_GOLDEN_PATH || path.join(DATA_DIR, 'golden-candidates.yaml');
const REPORT_PATH = path.join(DATA_DIR, 'eval-report.json');

// Deliberately NOT named OLLAMA_HOST/OLLAMA_MODEL - see build-eval-dataset.js
// for why: those may already be set in your shell for unrelated purposes.
const JUDGE_BASE = (
  process.env.SUPPORT_EVAL_OLLAMA_HOST || 'http://127.0.0.1:11434'
).replace(/\/$/, '');
const JUDGE_MODEL = process.env.SUPPORT_EVAL_OLLAMA_MODEL || 'qwen3:30b-a3b';
const SKIP_JUDGE = process.env.SUPPORT_EVAL_SKIP_JUDGE === 'true';

function estimateContextSize(promptLength) {
  const estTokens = Math.ceil(promptLength / 4) + 1024;
  const buckets = [4096, 8192, 16384, 32768, 65536, 131_072];
  return buckets.find((b) => b >= estTokens) || 131_072;
}

function buildSyntheticMessage(record) {
  return {
    id: `eval-${record.id}`,
    subject: 'Support Question',
    date: new Date(),
    nodemailer: {
      text: record.question
    }
  };
}

async function judgeFacts(question, facts, response) {
  if (SKIP_JUDGE || !facts || facts.length === 0) {
    return facts.map((_, i) => ({
      fact_index: i + 1,
      stated: null,
      note: 'judge skipped'
    }));
  }

  const prompt = `You are grading a customer support draft reply against a list of facts it is required to convey.

CUSTOMER QUESTION:
${question}

DRAFT REPLY:
${response || '(empty - generation failed)'}

REQUIRED FACTS (paraphrasing is fine, the meaning must be present):
${facts.map((f, i) => `${i + 1}. ${f}`).join('\n')}

For each required fact, decide whether the draft reply actually conveys it. Respond with ONLY this JSON object, nothing else:
{"results": [{"fact_index": <1-based number>, "stated": boolean, "note": "<short reason if not stated, empty string if stated>"}]}`;

  try {
    // /api/chat, not /api/generate - see ollama-client.js generate() for
    // why: /api/generate's raw-prompt path doesn't reliably exercise the
    // template's thinking-mode separation, verified empirically to leave
    // `response` empty on short/direct answers exactly like this judge's
    // terse JSON output.
    const apiResponse = await axios.post(
      `${JUDGE_BASE}/api/chat`,
      {
        model: JUDGE_MODEL,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        format: 'json',
        // think: true doesn't cost extra compute (the model reasons either
        // way with this build) but gets a clean `content` - the JSON
        // constraint applies to the final answer only, after reasoning
        // completes unconstrained. See ollama-client.js generate() for the
        // full explanation of why false is never correct here.
        think: true,
        options: {
          temperature: 0.1,
          // 4000 truncated on 4/27 records in a real run (including two
          // previously-perfect scores, forced to 0 by the failure, not by
          // a bad response) - same class of issue already fixed for the
          // reranker and grounding-check. Matching their budget instead
          // of re-discovering this per call site.
          num_predict: 8000,
          num_ctx: estimateContextSize(prompt.length)
        }
      },
      { timeout: 120_000 }
    );

    if (apiResponse.data.done_reason === 'length') {
      throw new Error('judge hit num_predict before finishing');
    }

    // See ollama-client.js generate() - a short/direct answer can leave
    // `content` empty with the real content filed under `thinking` if the
    // model never emits a closing </think>.
    const raw =
      apiResponse.data.message?.content ||
      apiResponse.data.message?.thinking ||
      '';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/{[\s\S]*}/);
      parsed = m ? JSON.parse(m[0]) : null;
    }

    if (!parsed || !Array.isArray(parsed.results)) {
      throw new Error('unparseable judge response');
    }

    return parsed.results;
  } catch (err) {
    logger.error(err, { context: 'judge facts' });
    return facts.map((_, i) => ({
      fact_index: i + 1,
      stated: null,
      note: `judge error: ${err.message}`
    }));
  }
}

/**
 * Distinct from judgeFacts(): fact-recall checks what's MISSING (should
 * have said X, didn't). This checks what's WRONGLY PRESENT - a draft can
 * score perfectly on fact-recall while actively asserting something
 * harmful (e.g. recommending a plan that's unsuitable, or a confident
 * numeric conclusion built on a mismatched comparison). These need
 * separate remediation - fact-recall gaps mean "write more docs," a
 * prohibited-claim violation means "fix the prompt or add a guardrail" -
 * so they're tracked as a separate signal, not blended into the same
 * 0-1 score.
 */
async function judgeProhibited(question, claims, response) {
  if (SKIP_JUDGE || !claims || claims.length === 0) return [];

  const prompt = `You are checking a customer support draft reply for claims it must NOT make.

CUSTOMER QUESTION:
${question}

DRAFT REPLY:
${response || '(empty - generation failed)'}

PROHIBITED CLAIMS (the draft must not state or imply any of these, even paraphrased):
${claims.map((c, i) => `${i + 1}. ${c}`).join('\n')}

For each prohibited claim, decide whether the draft actually makes it (even implicitly). Respond with ONLY this JSON object, nothing else:
{"results": [{"claim_index": <1-based number>, "violated": boolean, "note": "<short quote or reason if violated, empty string if not>"}]}`;

  try {
    const apiResponse = await axios.post(
      `${JUDGE_BASE}/api/chat`,
      {
        model: JUDGE_MODEL,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        format: 'json',
        think: true,
        options: {
          temperature: 0.1,
          // 4000 truncated on 4/27 records in a real run (including two
          // previously-perfect scores, forced to 0 by the failure, not by
          // a bad response) - same class of issue already fixed for the
          // reranker and grounding-check. Matching their budget instead
          // of re-discovering this per call site.
          num_predict: 8000,
          num_ctx: estimateContextSize(prompt.length)
        }
      },
      { timeout: 120_000 }
    );

    if (apiResponse.data.done_reason === 'length') {
      throw new Error(
        'prohibited-claims judge hit num_predict before finishing'
      );
    }

    const raw =
      apiResponse.data.message?.content ||
      apiResponse.data.message?.thinking ||
      '';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/{[\s\S]*}/);
      parsed = m ? JSON.parse(m[0]) : null;
    }

    if (!parsed || !Array.isArray(parsed.results)) {
      throw new Error('unparseable prohibited-claims judge response');
    }

    return parsed.results;
  } catch (err) {
    logger.error(err, { context: 'judge prohibited claims' });
    return claims.map((_, i) => ({
      claim_index: i + 1,
      violated: null,
      note: `judge error: ${err.message}`
    }));
  }
}

(async () => {
  try {
    if (!fs.existsSync(GOLDEN_PATH)) {
      throw new Error(`${GOLDEN_PATH} not found`);
    }

    const golden = yaml.load(fs.readFileSync(GOLDEN_PATH, 'utf8'));
    logger.info('Starting RAG eval', {
      records: golden.length,
      judgeBase: JUDGE_BASE,
      judgeModel: JUDGE_MODEL,
      skipJudge: SKIP_JUDGE
    });

    const vectorStore = new VectorStore();
    await vectorStore.initialize();
    const kbCount = await vectorStore.count();
    logger.info({ kbCount }, 'Knowledge base vector store');

    const historyVectorStore = new VectorStore({
      collectionName: 'customer_support_history'
    });
    await historyVectorStore.initialize();

    const results = [];

    for (const [i, record] of golden.entries()) {
      logger.info(`[${i + 1}/${golden.length}] id=${record.id}`);

      const message = buildSyntheticMessage(record);
      const analysis = await messageAnalyzer.analyze(message);

      const { text: context, ranked: kbRanked } = await retrieveContext(
        analysis,
        vectorStore
      );
      const { text: historicalContext, ranked: historyRanked } =
        await retrieveHistoricalContext(analysis, historyVectorStore);

      const topSourceUrl = kbRanked[0]
        ? getSourceUrl(kbRanked[0].metadata)
        : undefined;

      const generated = await responseGenerator.generateWithFallback(
        analysis,
        context,
        historicalContext,
        topSourceUrl
      );

      const facts = record.expected_facts || [];
      const prohibitedClaims = record.prohibited_claims || [];

      // None of these three depend on each other's output - only on
      // `generated`, which is already done. Running them sequentially
      // would triple this record's judge latency for no reason.
      const [judged, prohibitedJudged, grounding] = await Promise.all([
        judgeFacts(record.question, facts, generated.response),
        judgeProhibited(record.question, prohibitedClaims, generated.response),
        // General-purpose companion to prohibited_claims: that list only
        // catches claims someone thought to write down in advance.
        // checkGrounding() catches ANY unsupported claim, on every
        // record, without needing per-record authoring.
        checkGrounding(generated.response, context)
      ]);

      const statedCount = judged.filter((j) => j.stated === true).length;
      const score = facts.length > 0 ? statedCount / facts.length : null;
      const violations = prohibitedJudged.filter((j) => j.violated === true);

      results.push({
        id: record.id,
        topic: record.topic,
        question: record.question,
        expected_facts: facts,
        response: generated.response,
        fallback: Boolean(generated.fallback),
        judged,
        score,
        prohibited_claims: prohibitedClaims,
        prohibited_judged: prohibitedJudged,
        violation_count: violations.length,
        grounded: grounding.grounded,
        grounding_claims: grounding.claims,
        grounding_check_failed: grounding.checkFailed,
        // rerankFailed lets a low score be traced back to "the reranker
        // itself failed and silently fell back to raw embedding order"
        // instead of looking identical to a genuine model/retrieval
        // limitation - see id=56.
        rerank_failed: kbRanked.some((r) => r.rerankFailed === true),
        kb_hits: kbRanked.map((r) => ({
          source: r.metadata.source,
          path: r.metadata.path || r.metadata.issueNumber || null,
          score: r.score
        })),
        history_hits: historyRanked.length
      });
    }

    const scored = results.filter((r) => r.score !== null);
    const avgScore =
      scored.length > 0
        ? scored.reduce((sum, r) => sum + r.score, 0) / scored.length
        : null;
    const zeroKbHits = results.filter((r) => r.kb_hits.length === 0).length;

    const byTopic = {};
    for (const r of scored) {
      const t = r.topic || 'uncategorized';
      if (!byTopic[t]) byTopic[t] = { n: 0, sum: 0 };
      byTopic[t].n++;
      byTopic[t].sum += r.score;
    }

    const recordsWithViolations = results.filter((r) => r.violation_count > 0);
    const totalViolations = results.reduce(
      (sum, r) => sum + r.violation_count,
      0
    );

    const summary = {
      total: results.length,
      scored: scored.length,
      avgScore,
      zeroKbHits,
      byTopic: Object.fromEntries(
        Object.entries(byTopic).map(([t, v]) => [
          t,
          { n: v.n, avgScore: v.sum / v.n }
        ])
      ),
      // Separate from avgScore on purpose - see judgeProhibited(). A
      // record can score perfectly on fact-recall and still have
      // violations here.
      safetyViolations: {
        recordsChecked: results.filter((r) => r.prohibited_claims.length > 0)
          .length,
        recordsWithViolations: recordsWithViolations.length,
        totalViolations
      },
      // Runs on every record, unlike safetyViolations (which only fires
      // where someone authored prohibited_claims). This is the general
      // catch-all signal.
      grounding: {
        recordsUngrounded: results.filter((r) => !r.grounded).length,
        checkFailures: results.filter((r) => r.grounding_check_failed).length
      },
      // A low score on a rerank_failed record may reflect degraded
      // retrieval, not a genuine model limitation - check these before
      // concluding a prompt/generation fix is needed.
      rerankFailures: results.filter((r) => r.rerank_failed).length
    };

    fs.writeFileSync(
      REPORT_PATH,
      JSON.stringify({ summary, results }, null, 2)
    );

    logger.info('Eval complete', summary);
    console.log('\n=== EVAL SUMMARY ===');
    console.log(JSON.stringify(summary, null, 2));
    console.log(`\nFull report -> ${REPORT_PATH}`);

    process.exit(0);
  } catch (err) {
    logger.error(err, { context: 'eval rag' });
    process.exit(1);
  }
})();
