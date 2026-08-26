/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const readline = require('node:readline');

const logger = require('#helpers/logger');
// This is an interactive tool - console.log output IS the UI, so silence
// the debug/info structured-log noise (LanceDB internals, retrieval
// internals) that would otherwise flood the terminal between prompts.
// Scoped to this process only; doesn't touch shared config.
logger.debug = () => {};
logger.info = () => {};

const config = require('#config');
const VectorStore = require('#helpers/customer-support-ai/vector-store');
const messageAnalyzer = require('#helpers/customer-support-ai/message-analyzer');
const responseGenerator = require('#helpers/customer-support-ai/response-generator');
const {
  retrieveContext,
  retrieveHistoricalContext,
  getSourceUrl
} = require('#helpers/customer-support-ai/rag-retrieval');

// Printed before anything else runs - the #1 way to waste a testing
// session with this tool is not noticing it's pointed at your laptop's
// local Ollama (with none of the right models pulled) instead of the
// homelab, or that the embedding model doesn't match what the KB was
// built with. Both fail downstream with cryptic errors otherwise.
console.log('=== chat-test config ===');
console.log(
  'OLLAMA_HOST:          ',
  config.ollamaHost ||
    'http://localhost:11434 (default - probably NOT what you want)'
);
console.log('OLLAMA_MODEL:         ', config.ollamaModel);
console.log(
  'OLLAMA_EMBEDDING_MODEL:',
  config.ollamaEmbeddingModel,
  '<- must match whatever update-knowledge-base.js was last run with'
);
console.log('========================\n');

//
// Interactive manual-testing REPL: paste a question or a real support
// email, see exactly what the production pipeline (same functions
// process-inbox.js uses) would retrieve and draft. Intended for judging
// response quality by eye and tuning the prompt/retrieval accordingly -
// not for scoring (that's eval-rag.js's job against the golden set).
//
// Usage: node jobs/customer-support-ai/chat-test.js
// Paste a question or full raw email text, then a line containing only
// "END" to submit. Type "exit" alone to quit.
//

function buildSyntheticMessage(rawText) {
  // If the pasted text looks like a real email (has a Subject: line),
  // pull the subject out and use the rest as the body - otherwise treat
  // the whole thing as both.
  const subjectMatch = rawText.match(/^subject:\s*(.+)$/im);
  const subject = subjectMatch ? subjectMatch[1].trim() : 'Support Question';
  const content = subjectMatch
    ? rawText.replace(/^subject:\s*.+$/im, '').trim()
    : rawText.trim();

  return {
    id: `chat-test-${Date.now()}`,
    subject,
    date: new Date(),
    nodemailer: { text: content }
  };
}

async function readMultilineInput(rl) {
  return new Promise((resolve) => {
    const lines = [];
    const onLine = (line) => {
      if (line.trim() === 'END') {
        rl.off('line', onLine);
        resolve(lines.join('\n'));
        return;
      }

      lines.push(line);
    };

    rl.on('line', onLine);
  });
}

(async () => {
  const vectorStore = new VectorStore();
  await vectorStore.initialize();
  const kbCount = await vectorStore.count();

  const historyVectorStore = new VectorStore({
    collectionName: 'customer_support_history'
  });
  await historyVectorStore.initialize();

  console.log(`Knowledge base: ${kbCount} chunks loaded.`);
  console.log(
    'Paste a question or a full raw support email, then a line with only "END" to submit.'
  );
  console.log('Type "exit" then END to quit.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    process.stdout.write('> ');

    const rawText = await readMultilineInput(rl);

    if (rawText.trim().toLowerCase() === 'exit') break;
    if (!rawText.trim()) continue;

    const message = buildSyntheticMessage(rawText);

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

    console.log('\n--- Retrieved context (what the model actually sees) ---');
    for (const r of kbRanked) {
      const label = r.metadata.question || r.metadata.path || r.metadata.source;
      console.log(
        `  [${(r.score * 100).toFixed(1)}%] ${r.metadata.source}: ${label}`
      );
    }

    if (historyRanked.length > 0) {
      console.log('--- Historical support threads ---');
      for (const r of historyRanked) {
        console.log(
          `  [${(r.score * 100).toFixed(1)}%] ${
            r.metadata.subject || '(no subject)'
          }`
        );
      }
    }

    const start = Date.now();

    const generated = await responseGenerator.generateWithFallback(
      analysis,
      context,
      historicalContext,
      topSourceUrl
    );
    const elapsedMs = Date.now() - start;

    console.log(
      `\n--- Draft response (${elapsedMs}ms, fallback: ${Boolean(
        generated.fallback
      )}) ---`
    );
    console.log(generated.response);
    console.log('\n' + '='.repeat(60) + '\n');
  }

  rl.close();
  process.exit(0);
})();
