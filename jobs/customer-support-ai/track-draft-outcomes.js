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

const logger = require('#helpers/logger');
const forwardEmailClient = require('#helpers/customer-support-ai/forward-email-client');
const {
  readDraftLog,
  readOutcomes,
  writeOutcomes
} = require('#helpers/customer-support-ai/draft-log');

const graceful = new Graceful({ logger });
graceful.listen();

//
// Resolves each AI-generated draft (logged by process-inbox.js at creation
// time) to one of: pending (still sitting in Drafts, unactioned),
// sent_as_is (went out essentially unchanged), edited (went out, but a
// human changed it first - the interesting case, since the diff says what
// was wrong), or discarded (draft disappeared with no corresponding Sent
// message - presumably deleted, or answered a different way entirely).
//
// This is the real production accuracy signal: after ~30 resolved
// tickets, sent_as_is rate is a number earned from actual customer
// support, not from the golden set, and the edited diffs say specifically
// what to fix rather than just a score.
//

// Mirrors the "On {date}, {sender} wrote:" quote-trailer format
// process-inbox.js's createDraft() appends - stripping it isolates the
// actual reply text from both the AI draft and whatever a human sent, so
// they can be compared apples-to-apples.
function stripQuotedReply(text) {
  const marker = text.search(/\n\nOn .+ wrote:\n/);
  return (marker === -1 ? text : text.slice(0, marker)).trim();
}

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

// Cheap, dependency-free "how different" signal - not a real diff, just
// enough to sort edited responses by how heavily they were changed so a
// human reviewing the log can prioritize.
function wordOverlapRatio(a, b) {
  const wordsA = new Set(normalize(a).split(' ').filter(Boolean));
  const wordsB = new Set(normalize(b).split(' ').filter(Boolean));
  if (wordsA.size === 0 && wordsB.size === 0) return 1;
  let shared = 0;
  for (const w of wordsA) if (wordsB.has(w)) shared++;
  return shared / Math.max(wordsA.size, wordsB.size, 1);
}

(async () => {
  try {
    const entries = readDraftLog();
    const outcomes = readOutcomes();

    const unresolved = entries.filter(
      (e) => !outcomes[e.draftId] || outcomes[e.draftId].status === 'pending'
    );

    logger.info(
      { total: entries.length, unresolved: unresolved.length },
      'Resolving draft outcomes'
    );

    if (unresolved.length === 0) {
      logger.info('Nothing to resolve');
    } else {
      // Fetch Sent once and index by in-reply-to/references, rather than
      // re-listing it per unresolved entry.
      const sentMessages = await forwardEmailClient.listAllMessages({
        folder: 'Sent'
      });

      const sentByRepliedToId = new Map();
      for (const msg of sentMessages) {
        const inReplyTo = msg.header_in_reply_to || msg.in_reply_to;
        const references = Array.isArray(msg.references)
          ? msg.references
          : [msg.references].filter(Boolean);
        for (const id of [inReplyTo, ...references].filter(Boolean)) {
          if (!sentByRepliedToId.has(id)) sentByRepliedToId.set(id, []);
          sentByRepliedToId.get(id).push(msg);
        }
      }

      for (const entry of unresolved) {
        try {
          let stillInDrafts = false;
          try {
            const draftMsg = await forwardEmailClient.getMessage(entry.draftId);
            stillInDrafts = (draftMsg.folder || '').toLowerCase() === 'drafts';
          } catch {
            // Gone from Drafts (sent or deleted) - expected, not an error.
          }

          if (stillInDrafts) {
            outcomes[entry.draftId] = { ...entry, status: 'pending' };
            continue;
          }

          const matches = sentByRepliedToId.get(entry.originalMessageId) || [];

          if (matches.length === 0) {
            outcomes[entry.draftId] = {
              ...entry,
              status: 'discarded',
              resolvedAt: new Date().toISOString()
            };
            logger.info({ draftId: entry.draftId }, 'discarded');
            continue;
          }

          const sentMessage = matches[0];
          const sentText = stripQuotedReply(
            sentMessage.nodemailer?.text || sentMessage.text || ''
          );
          const generatedText = stripQuotedReply(entry.generatedText);

          const identical = normalize(sentText) === normalize(generatedText);
          const similarity = wordOverlapRatio(sentText, generatedText);

          outcomes[entry.draftId] = {
            ...entry,
            status: identical ? 'sent_as_is' : 'edited',
            similarity: Number(similarity.toFixed(3)),
            sentText,
            resolvedAt: new Date().toISOString()
          };
          logger.info(
            {
              draftId: entry.draftId,
              status: outcomes[entry.draftId].status,
              similarity
            },
            'resolved'
          );
        } catch (err) {
          logger.error(err, {
            context: 'resolve draft outcome',
            draftId: entry.draftId
          });
        }
      }

      writeOutcomes(outcomes);
    }

    const resolved = Object.values(outcomes).filter(
      (o) => o.status !== 'pending'
    );
    const counts = {};
    for (const o of resolved) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }

    console.log('=== Draft outcome summary ===');
    console.log(`Resolved: ${resolved.length}`, counts);
    if (counts.sent_as_is || counts.edited) {
      const sentTotal = (counts.sent_as_is || 0) + (counts.edited || 0);
      console.log(
        `Sent-as-is rate (of sent, excluding discarded): ${(
          ((counts.sent_as_is || 0) / sentTotal) *
          100
        ).toFixed(1)}%`
      );
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
