/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const axios = require('axios');
const yaml = require('js-yaml');
const Graceful = require('@ladjs/graceful');

const logger = require('#helpers/logger');

const graceful = new Graceful({ logger });
graceful.listen();

/**
 * Stage 2 of the RAG eval-set pipeline.
 *
 * Reads the raw customer-question / staff-reply transcripts produced by
 * extract-support-archive.js and, for each thread, asks a local LLM to:
 *   1. Classify whether it's a genuine support Q&A (vs. an automated
 *      notification, SMTP/DNS/domain approval, bounce, etc.)
 *   2. If genuine, distill it into { question, expected_facts, source_doc }
 *
 * This step has NO dependency on the Forward Email API - it only reads
 * the JSONL that stage 1 produced, so it can run wherever the LLM lives.
 * By default it points at Ollama on this machine; set
 * SUPPORT_EVAL_OLLAMA_HOST to point at a remote instance instead (e.g. a
 * homelab box over Tailscale) if you want classification/extraction to run
 * against a bigger model there.
 */

const OUTPUT_DIR =
  process.env.SUPPORT_ARCHIVE_OUTPUT_DIR ||
  path.join(process.cwd(), '.customer-support-archive');
const THREADS_PATH = path.join(OUTPUT_DIR, 'raw-threads.jsonl');
const EVAL_SET_PATH = path.join(OUTPUT_DIR, 'eval-set.yaml');
const NOISE_LOG_PATH = path.join(OUTPUT_DIR, 'noise-log.jsonl');
const PARSE_FAILURES_PATH = path.join(OUTPUT_DIR, 'parse-failures.jsonl');
const PROCESSED_LEDGER_PATH = path.join(OUTPUT_DIR, 'processed-threads.jsonl');

// Deliberately NOT named OLLAMA_HOST/OLLAMA_MODEL - those are common
// generic env vars that may already be exported in your shell for
// unrelated Ollama usage (pointing at a different host/model than what's
// actually available), which would silently override these defaults.
//
// Defaults to Ollama running on this machine. Point SUPPORT_EVAL_OLLAMA_HOST
// at the homelab instead (e.g. https://shauns-homelab.tail896ca0.ts.net) if
// you'd rather run classification/extraction against a bigger model there.
const OLLAMA_BASE = (
  process.env.SUPPORT_EVAL_OLLAMA_HOST || 'http://127.0.0.1:11434'
).replace(/\/$/, '');
// qwen3:0.6b is what's pulled locally today - override
// SUPPORT_EVAL_OLLAMA_MODEL if you point this at a host with a
// larger/better model available.
const OLLAMA_MODEL = process.env.SUPPORT_EVAL_OLLAMA_MODEL || 'qwen3:0.6b';

// Ollama silently truncates prompts that exceed the runtime context window
// rather than erroring - without an explicit num_ctx it defaults well
// below what long real threads need, so the model judges an incomplete
// conversation with no warning. Size the window to the actual prompt
// (+ headroom for output) instead of using one fixed value for everything,
// since most threads are short and a blanket large num_ctx would waste
// memory/latency on every request. Model's max context is 262144.
const CONTEXT_BUCKETS = [4096, 8192, 16384, 32768, 65536, 131_072, 262_144];
function estimateContextSize(promptLength) {
  const estTokens = Math.ceil(promptLength / 4) + 1024;
  return CONTEXT_BUCKETS.find((b) => b >= estTokens) || 262_144;
}

async function classifyAndExtract(record) {
  const transcript = record.transcript
    .map(
      (m) =>
        `${m.isStaff ? 'Support agent' : 'Customer'} (${
          m.date
        }):\n${m.text.trim()}`
    )
    .join('\n\n---\n\n');

  const prompt = `You are building an evaluation dataset for a customer-support RAG system from a real Forward Email support conversation.

Look at the conversation below and decide:

1. Is this a GENUINE support question with a substantive, factual answer? Automated notifications, SMTP/DNS/domain access approval requests, bounce/postmaster messages, billing receipts, subscription confirmations, spam, and threads where no real answer was given are NOT genuine.
2. If genuine, extract:
   - "question": the customer's question rewritten as a single, clear, general question. Do NOT include the customer's name, email address, domain, or any other account-specific identifier.
   - "expected_facts": a list of short, atomic, concrete facts that are ACTUALLY stated in the support agent's reply below. Do not invent or infer facts that are not present in the reply. Each fact is something a correct RAG answer to this question must contain.
   - "source_doc": your best guess at what Forward Email documentation page or topic this answer would come from (e.g. "docs/security/2fa.md" or "faq#dkim"), or null if you cannot tell.

Respond with ONLY a single JSON object and nothing else - no markdown fences, no explanation:
{"genuine": boolean, "reason": string, "question": string|null, "expected_facts": string[]|null, "source_doc": string|null}

Subject: ${record.subject}

Conversation:
${transcript}`;

  // /api/chat, not /api/generate - see ollama-client.js generate() for why.
  const response = await axios.post(
    `${OLLAMA_BASE}/api/chat`,
    {
      model: OLLAMA_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      format: 'json',
      // Hybrid-reasoning models (e.g. Qwen3) reason regardless of this
      // flag; true just gets a clean `content` instead of raw unmarked
      // reasoning dumped there. See ollama-client.js generate() for the
      // full explanation.
      think: true,
      options: {
        temperature: 0.2,
        num_predict: 2000,
        num_ctx: estimateContextSize(prompt.length)
      }
    },
    { timeout: 180_000 }
  );

  if (response.data.done_reason === 'length') {
    throw new Error(
      'build-eval-dataset classification hit num_predict before finishing'
    );
  }

  // Fall back to the `thinking` field if `content` came back empty - a
  // short/direct answer can leave the real content there if the model
  // never emits a closing </think>.
  return (
    response.data.message?.content || response.data.message?.thinking || ''
  );
}

function parseModelJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch {}

  const match = raw.match(/{[\s\S]*}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }

  return null;
}

function readJSONL(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function appendJSONL(filePath, entry) {
  fs.appendFileSync(filePath, `${JSON.stringify(entry)}\n`);
}

function loadExistingEvalRecords() {
  if (!fs.existsSync(EVAL_SET_PATH)) return [];
  const doc = yaml.load(fs.readFileSync(EVAL_SET_PATH, 'utf8'));
  return Array.isArray(doc) ? doc : [];
}

function writeEvalSet(records) {
  const raw = yaml.dump(records, { noRefs: true, lineWidth: -1 });
  const spaced = raw.replace(/\n(?=- id:)/g, '\n\n');
  const header =
    '# Auto-generated RAG eval set from real support-archive conversations.\n' +
    '# Review before treating as ground truth - source_doc is a model best-guess.\n\n';
  fs.writeFileSync(EVAL_SET_PATH, header + spaced);
}

(async () => {
  try {
    if (!fs.existsSync(THREADS_PATH)) {
      throw new Error(
        `${THREADS_PATH} not found - run extract-support-archive.js first`
      );
    }

    logger.info('Starting eval-set generation', {
      ollamaBase: OLLAMA_BASE,
      model: OLLAMA_MODEL
    });

    const threads = readJSONL(THREADS_PATH);
    const processed = readJSONL(PROCESSED_LEDGER_PATH);
    const processedIds = new Set(processed.map((p) => p.threadId));

    const evalRecords = loadExistingEvalRecords();
    let nextId = Math.max(0, ...evalRecords.map((r) => r.id || 0)) + 1;

    const limit = process.env.SUPPORT_EVAL_LIMIT
      ? Number.parseInt(process.env.SUPPORT_EVAL_LIMIT, 10)
      : null;
    const allPending = threads.filter((t) => !processedIds.has(t.threadId));
    const pending = limit ? allPending.slice(0, limit) : allPending;
    logger.info('Loaded threads', {
      total: threads.length,
      alreadyProcessed: processedIds.size,
      pendingTotal: allPending.length,
      pendingThisRun: pending.length
    });

    let genuineCount = 0;
    let noiseCount = 0;
    let failureCount = 0;

    for (const [i, record] of pending.entries()) {
      try {
        const raw = await classifyAndExtract(record);
        const parsed = parseModelJSON(raw);

        if (
          !parsed ||
          typeof parsed.genuine !== 'boolean' ||
          (parsed.genuine &&
            (!parsed.question ||
              !Array.isArray(parsed.expected_facts) ||
              parsed.expected_facts.length === 0))
        ) {
          appendJSONL(PARSE_FAILURES_PATH, {
            threadId: record.threadId,
            subject: record.subject,
            raw
          });
          appendJSONL(PROCESSED_LEDGER_PATH, {
            threadId: record.threadId,
            outcome: 'parse_failure'
          });
          failureCount++;
          continue;
        }

        if (!parsed.genuine) {
          appendJSONL(NOISE_LOG_PATH, {
            threadId: record.threadId,
            subject: record.subject,
            reason: parsed.reason || null
          });
          appendJSONL(PROCESSED_LEDGER_PATH, {
            threadId: record.threadId,
            outcome: 'noise'
          });
          noiseCount++;
          continue;
        }

        const id = nextId++;
        evalRecords.push({
          id,
          question: parsed.question,
          expected_facts: parsed.expected_facts,
          source_doc: parsed.source_doc || null
        });
        writeEvalSet(evalRecords);
        appendJSONL(PROCESSED_LEDGER_PATH, {
          threadId: record.threadId,
          outcome: 'genuine',
          id
        });
        genuineCount++;
      } catch (err) {
        logger.error(err, {
          context: 'classify/extract thread',
          threadId: record.threadId
        });
      }

      if ((i + 1) % 10 === 0) {
        logger.info('Progress', {
          done: i + 1,
          total: pending.length,
          genuine: genuineCount,
          noise: noiseCount,
          failures: failureCount
        });
      }
    }

    logger.info('Eval-set generation complete', {
      pending: pending.length,
      genuine: genuineCount,
      noise: noiseCount,
      parseFailures: failureCount,
      evalSetPath: EVAL_SET_PATH,
      totalEvalRecords: evalRecords.length
    });

    process.exit(0);
  } catch (err) {
    logger.error(err, { context: 'build eval dataset' });
    process.exit(1);
  }
})();
