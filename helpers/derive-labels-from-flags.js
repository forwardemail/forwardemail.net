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
// Matches the normalization performed by the Messages pre-validate hook.
const MAX_LABELS_PER_MESSAGE = 10;

function deriveLabelsFromFlags(flags) {
  if (!Array.isArray(flags)) return [];
  const out = [];
  const seen = new Set();
  for (const f of flags) {
    if (typeof f !== 'string') continue;
    const trimmed = f.trim();
    if (!trimmed || trimmed.startsWith('\\')) continue;
    const normalized = trimmed.toLowerCase();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
    if (out.length >= MAX_LABELS_PER_MESSAGE) break;
  }

  return out;
}

module.exports = deriveLabelsFromFlags;
