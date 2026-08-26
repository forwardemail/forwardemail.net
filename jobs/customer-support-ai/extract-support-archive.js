/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const { parentPort } = require('node:worker_threads');

const Graceful = require('@ladjs/graceful');

const config = require('#config');
const logger = require('#helpers/logger');
const forwardEmailClient = require('#helpers/customer-support-ai/forward-email-client');
const {
  extractSenderEmail
} = require('#helpers/customer-support-ai/message-utils');

const graceful = new Graceful({
  logger,
  parentPort
});

graceful.listen();

/**
 * Stage 1 of the RAG eval-set pipeline.
 *
 * Scans the archive folder (default: whatever folder matches "archive" +
 * "2026") AND the Sent folder (auto-detected via special_use: '\Sent'),
 * fetches + decrypts every message, groups messages into threads by
 * thread_id across BOTH folders, and writes out the raw customer-question
 * / staff-reply transcripts as JSONL. The Sent folder matters because
 * staff replies are typically sent from there, not archived back alongside
 * the original message - scanning only the archive folder means most
 * threads never show up as having a reply at all.
 *
 * No LLM involved here - this step is only about getting real support
 * conversations out of the mailbox and onto disk so a later step
 * (build-eval-dataset.js) can classify + extract from them, potentially on
 * a different machine where the LLM actually lives.
 *
 * Message fetch/decrypt results are cached on disk keyed by message id, so
 * re-running this job after an interruption does not re-fetch or
 * re-decrypt messages that were already pulled down.
 */

const OUTPUT_DIR =
  process.env.SUPPORT_ARCHIVE_OUTPUT_DIR ||
  path.join(process.cwd(), '.customer-support-archive');
const CACHE_PATH = path.join(OUTPUT_DIR, 'messages-cache.jsonl');
const THREADS_PATH = path.join(OUTPUT_DIR, 'raw-threads.jsonl');

const STAFF_EMAILS = new Set(
  (process.env.SUPPORT_STAFF_EMAILS || config.forwardEmailAliasUsername || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
);

function isStaffSender(email) {
  return STAFF_EMAILS.has(String(email || '').toLowerCase());
}

async function resolveArchiveFolder(folders) {
  if (process.env.SUPPORT_ARCHIVE_FOLDER) {
    return process.env.SUPPORT_ARCHIVE_FOLDER;
  }

  const year =
    process.env.SUPPORT_ARCHIVE_YEAR || String(new Date().getFullYear());

  const match = folders.find((f) => {
    // Match against name AND path combined - some folders only carry the
    // leaf name (e.g. "2026") in `name`, with the parent ("Archive/") only
    // present in `path`.
    const identifier = `${f.path || ''} ${f.name || ''}`.toLowerCase();
    return identifier.includes('archive') && identifier.includes(year);
  });

  if (!match) {
    const available = folders.map((f) => f.path || f.name).join(', ');
    throw new Error(
      `Could not find a folder matching "archive" + "${year}". Set SUPPORT_ARCHIVE_FOLDER explicitly to override. Available folders: ${available}`
    );
  }

  return match.path || match.name;
}

function resolveReplyFolder(folders) {
  if (process.env.SUPPORT_ARCHIVE_REPLY_FOLDER) {
    return process.env.SUPPORT_ARCHIVE_REPLY_FOLDER;
  }

  const match = folders.find((f) => f.special_use === '\\Sent');
  if (!match) {
    logger.warn(
      'Could not auto-detect a Sent folder (special_use: "\\Sent"); staff replies sent from there will be missed. Set SUPPORT_ARCHIVE_REPLY_FOLDER explicitly to override.'
    );
    return null;
  }

  return match.path || match.name;
}

function extractText(message) {
  const text = message.nodemailer?.text || '';
  if (text) return text;
  const html = message.nodemailer?.html || '';
  if (html)
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  return message.text || message.body || '';
}

function loadCache() {
  const cache = new Map();
  if (!fs.existsSync(CACHE_PATH)) return cache;

  const lines = fs.readFileSync(CACHE_PATH, 'utf8').split('\n').filter(Boolean);
  for (const line of lines) {
    try {
      const msg = JSON.parse(line);
      cache.set(msg.id, msg);
    } catch (err) {
      logger.warn('Skipping unparseable cache line', { err });
    }
  }

  logger.info('Loaded message cache', { count: cache.size, path: CACHE_PATH });
  return cache;
}

function appendToCache(entry) {
  fs.appendFileSync(CACHE_PATH, `${JSON.stringify(entry)}\n`);
}

async function fetchAndCacheMessage(id, folder) {
  const full = await forwardEmailClient.getMessage(id);

  const entry = {
    id: full.id,
    threadId: full.thread_id || full.header_message_id || full.id,
    headerMessageId: full.header_message_id || full.id,
    inReplyTo: full.header_in_reply_to || null,
    date: full.header_date || full.internal_date || null,
    folder,
    from: extractSenderEmail(full),
    isStaff: isStaffSender(extractSenderEmail(full)),
    subject: full.subject || '(no subject)',
    encrypted: Boolean(full.encrypted),
    decrypted: Boolean(full.decrypted),
    text: full.encrypted && !full.decrypted ? '' : extractText(full)
  };

  appendToCache(entry);
  return entry;
}

function groupIntoThreads(messages) {
  const threads = new Map();
  for (const message of messages) {
    const key = message.threadId;
    if (!threads.has(key)) threads.set(key, []);
    threads.get(key).push(message);
  }

  for (const thread of threads.values()) {
    thread.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return [...threads.values()];
}

function pickPrimaryExchange(thread) {
  const usable = thread.filter(
    (m) => !(m.encrypted && !m.decrypted) && m.text.trim()
  );
  const customerMsgs = usable.filter((m) => !m.isStaff);
  const staffMsgs = usable.filter((m) => m.isStaff);

  if (customerMsgs.length === 0 || staffMsgs.length === 0) return null;

  const question = customerMsgs[0];
  const qTime = new Date(question.date).getTime();
  const after = staffMsgs.filter((m) => new Date(m.date).getTime() >= qTime);
  const reply = after.length > 0 ? after[0] : staffMsgs[0];

  return { question, reply, replyIsAfterQuestion: after.length > 0, usable };
}

const FETCH_CONCURRENCY = Number.parseInt(
  process.env.SUPPORT_ARCHIVE_CONCURRENCY || '8',
  10
);

async function runWithConcurrency(items, limit, worker) {
  let index = 0;
  async function next() {
    while (index < items.length) {
      const i = index++;
      await worker(items[i], i);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, next)
  );
}

(async () => {
  try {
    logger.info('Starting support archive extraction');

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const allFolders = await forwardEmailClient.listFolders();
    const archiveFolder = await resolveArchiveFolder(allFolders);
    const replyFolder = resolveReplyFolder(allFolders);
    const foldersToScan = [archiveFolder, replyFolder].filter(Boolean);
    logger.info('Resolved folders to scan', { foldersToScan });

    const cache = loadCache();
    const allStubs = [];

    let fetched = 0;
    for (const folder of foldersToScan) {
      const stubs = await forwardEmailClient.listAllMessages({ folder });
      logger.info('Listed folder messages', { folder, count: stubs.length });
      allStubs.push(...stubs);

      const toFetch = stubs.filter((stub) => !cache.has(stub.id));
      logger.info('Fetching messages', {
        folder,
        toFetch: toFetch.length,
        concurrency: FETCH_CONCURRENCY
      });

      await runWithConcurrency(toFetch, FETCH_CONCURRENCY, async (stub) => {
        try {
          const entry = await fetchAndCacheMessage(stub.id, folder);
          cache.set(entry.id, entry);
          fetched++;
          if (fetched % 25 === 0) {
            logger.info('Fetch progress', { fetched, folder });
          }
        } catch (err) {
          logger.error(err, { context: 'fetch message', id: stub.id });
        }
      });
    }

    logger.info('Message fetch complete', {
      totalAcrossFolders: allStubs.length,
      newlyFetched: fetched,
      cacheSize: cache.size
    });

    const folderIds = new Set(allStubs.map((s) => s.id));
    const messages = [...cache.values()].filter((m) => folderIds.has(m.id));

    const threads = groupIntoThreads(messages);
    logger.info('Grouped into threads', { threadCount: threads.length });

    let written = 0;
    let skippedNoExchange = 0;
    const lines = [];

    for (const thread of threads) {
      const exchange = pickPrimaryExchange(thread);
      if (!exchange) {
        skippedNoExchange++;
        continue;
      }

      const record = {
        threadId: thread[0].threadId,
        subject: exchange.question.subject,
        customerEmail: exchange.question.from,
        question: {
          date: exchange.question.date,
          folder: exchange.question.folder,
          text: exchange.question.text
        },
        reply: {
          date: exchange.reply.date,
          folder: exchange.reply.folder,
          from: exchange.reply.from,
          text: exchange.reply.text,
          isAfterQuestion: exchange.replyIsAfterQuestion
        },
        transcript: exchange.usable.map((m) => ({
          date: m.date,
          from: m.from,
          isStaff: m.isStaff,
          text: m.text
        }))
      };

      lines.push(JSON.stringify(record));
      written++;
    }

    fs.writeFileSync(THREADS_PATH, `${lines.join('\n')}\n`);

    logger.info('Support archive extraction complete', {
      foldersScanned: foldersToScan,
      totalMessages: messages.length,
      totalThreads: threads.length,
      threadsWritten: written,
      threadsSkippedNoExchange: skippedNoExchange,
      outputPath: THREADS_PATH
    });

    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
  } catch (err) {
    logger.error(err, { context: 'extract support archive' });
    if (parentPort) parentPort.postMessage('error');
    else process.exit(1);
  }
})();
