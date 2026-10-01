/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The flags an IMAP client sees for a message: its flags, then its labels as
// keywords. Labels set through the API are stored apart from the flags, so
// every FETCH response and journal entry has to merge the two, or a client
// would take the missing labels for removed keywords. Keywords compare
// case-insensitively, as in IMAP. A label is never shown as a system flag
// (a label "\Deleted" would tell clients the message was deleted).
//
function getImapFlags(message) {
  const seen = new Set();
  const flags = [];
  const labels = Array.isArray(message?.labels)
    ? message.labels.filter(
        (label) => typeof label === 'string' && !label.trim().startsWith('\\')
      )
    : [];
  for (const flag of [
    ...(Array.isArray(message?.flags) ? message.flags : []),
    ...labels
  ]) {
    if (typeof flag !== 'string') continue;
    const key = flag.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    flags.push(flag);
  }

  return flags;
}

module.exports = getImapFlags;
