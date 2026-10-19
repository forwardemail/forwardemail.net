/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { distance } = require('fastest-levenshtein');

const MAX_DISTANCE = 3;

// shortest piece worth indexing (one character would match nearly any email)
const MIN_PIECE_LENGTH = 2;

//
// Match an email against banned emails: an exact match, or the first banned
// email (in the order given) within `maxDistance` edits (Levenshtein).
//
// check-suspicious-emails runs this for every paid user against every banned
// email, so comparing every pair cost (paid users x banned emails) distance
// computations each run. This returns the same result as comparing every pair
// in turn, but computes few distances:
//
// - Exact matches are a Set lookup, and each banned email is lowercased once.
//
// - Each banned email's local part (before the last "@") is cut into
//   maxDistance + 1 pieces that do not overlap. Each edit changes at most one
//   piece, so an email within maxDistance edits still contains at least one
//   piece unchanged, starting no more than maxDistance characters from where
//   it starts in the banned email. An index of the pieces finds the banned
//   emails that pass this test (the candidates), and only those get a
//   distance. A local part too short to cut is cut with its domain (the whole
//   email), and an email too short for that is a candidate for every email.
//   The pieces can be any that do not overlap, so this finds every match.
//
// - A candidate whose length differs by more than maxDistance is skipped
//   without a distance (each edit changes the length by at most one).
//
// Lengths, positions and fastest-levenshtein all count UTF-16 code units.
//
function createSuspiciousEmailMatcher(
  bannedEmails,
  maxDistance = MAX_DISTANCE
) {
  const exact = new Set(bannedEmails);
  const banned = bannedEmails.map((email) => ({
    email,
    lower: email.toLowerCase()
  }));

  const pieceCount = maxDistance + 1;
  // piece -> [[banned index, offset], ...]
  const pieces = new Map();
  const pieceLengths = new Set();
  // banned indexes without pieces: candidates for every email
  const alwaysCheck = [];

  for (const [index, { lower }] of banned.entries()) {
    // the local part when it is long enough to cut, otherwise the whole
    // email (its domain pieces are common, but still narrow the candidates
    // to emails with a similar domain at a similar position)
    const at = lower.lastIndexOf('@');
    const localLength = at === -1 ? lower.length : at;
    let pieceLength = Math.floor(localLength / pieceCount);
    if (pieceLength < MIN_PIECE_LENGTH)
      pieceLength = Math.floor(lower.length / pieceCount);
    if (pieceLength < MIN_PIECE_LENGTH) {
      alwaysCheck.push(index);
      continue;
    }

    pieceLengths.add(pieceLength);
    for (let i = 0; i < pieceCount; i++) {
      const offset = i * pieceLength;
      const piece = lower.slice(offset, offset + pieceLength);
      let postings = pieces.get(piece);
      if (!postings) {
        postings = [];
        pieces.set(piece, postings);
      }

      postings.push([index, offset]);
    }
  }

  const lengths = [...pieceLengths];

  // banned indexes that can be within maxDistance of `text`, in order
  function candidates(text) {
    const found = new Set(alwaysCheck);
    for (const length of lengths) {
      for (let start = 0; start + length <= text.length; start++) {
        const postings = pieces.get(text.slice(start, start + length));
        if (!postings) continue;
        for (const [index, offset] of postings) {
          if (Math.abs(start - offset) <= maxDistance) found.add(index);
        }
      }
    }

    return [...found].sort((a, b) => a - b);
  }

  return (email) => {
    if (!email || typeof email !== 'string') return null;

    const emailLower = email.toLowerCase().trim();

    if (exact.has(emailLower)) {
      return {
        type: 'exact',
        bannedEmail: emailLower,
        reason: 'Exact match to banned email'
      };
    }

    const { length } = emailLower;
    for (const index of candidates(emailLower)) {
      const { email: bannedEmail, lower } = banned[index];
      if (Math.abs(lower.length - length) > maxDistance) continue;
      const dist = distance(emailLower, lower);
      if (dist <= maxDistance && dist > 0) {
        return {
          type: 'similar',
          bannedEmail,
          distance: dist,
          reason: `Similar to banned email: ${bannedEmail} (distance: ${dist})`
        };
      }
    }

    return null;
  };
}

module.exports = createSuspiciousEmailMatcher;
module.exports.MAX_DISTANCE = MAX_DISTANCE;
