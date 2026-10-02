/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// Custom keywords (anything not starting with "\\") are mirrored to the
// message.labels field so the REST API and webmail UI can read them.
// The Messages pre-validate hook normalizes and validates labels the same
// way (with these definitions).
const MAX_LABELS_PER_MESSAGE = 10;
const KEYWORD_REGEX = /^([A-Za-z\d]|[\\$])[\w.-]*$/;

//
// Only valid keywords are counted toward the limit (the model drops the
// others, so counting them could leave out valid ones that follow).  The
// labels a STORE removes are listed with no limit (`limit: Infinity`).
//
function deriveLabelsFromFlags(flags, { limit = MAX_LABELS_PER_MESSAGE } = {}) {
  if (!Array.isArray(flags)) return [];
  const out = [];
  const seen = new Set();
  for (const f of flags) {
    if (typeof f !== 'string') continue;
    const trimmed = f.trim();
    if (!trimmed || trimmed.startsWith('\\')) continue;
    const normalized = trimmed.toLowerCase();
    if (seen.has(normalized) || !KEYWORD_REGEX.test(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
    if (out.length >= limit) break;
  }

  return out;
}

module.exports = deriveLabelsFromFlags;
module.exports.KEYWORD_REGEX = KEYWORD_REGEX;
module.exports.MAX_LABELS_PER_MESSAGE = MAX_LABELS_PER_MESSAGE;
