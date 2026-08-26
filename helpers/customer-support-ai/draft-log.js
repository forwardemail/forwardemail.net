/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Shared log of AI-generated drafts, written at creation time by
// process-inbox.js and read/updated by track-draft-outcomes.js. This is
// what makes the "sent as-is / edited / discarded" production accuracy
// signal possible - without a record of exactly what we generated, there's
// nothing to diff the eventually-sent (or never-sent) message against.
//

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const DATA_DIR =
  process.env.SUPPORT_ARCHIVE_OUTPUT_DIR ||
  path.join(process.cwd(), '.customer-support-archive');
const DRAFT_LOG_PATH = path.join(DATA_DIR, 'draft-log.jsonl');
const DRAFT_OUTCOMES_PATH = path.join(DATA_DIR, 'draft-outcomes.json');

function appendDraftLog(entry) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.appendFileSync(DRAFT_LOG_PATH, JSON.stringify(entry) + '\n');
}

function readDraftLog() {
  if (!fs.existsSync(DRAFT_LOG_PATH)) return [];
  return fs
    .readFileSync(DRAFT_LOG_PATH, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function readOutcomes() {
  if (!fs.existsSync(DRAFT_OUTCOMES_PATH)) return {};
  return JSON.parse(fs.readFileSync(DRAFT_OUTCOMES_PATH, 'utf8'));
}

function writeOutcomes(outcomes) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DRAFT_OUTCOMES_PATH, JSON.stringify(outcomes, null, 2));
}

module.exports = {
  DRAFT_LOG_PATH,
  DRAFT_OUTCOMES_PATH,
  appendDraftLog,
  readDraftLog,
  readOutcomes,
  writeOutcomes
};
