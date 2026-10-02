/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Parse filename from Content-Disposition header, handling spaces correctly.
// Supports RFC 5987 filename* encoding, quoted filenames, and unquoted filenames.
//
function parseContentDispositionFilename(contentDisposition) {
  if (!contentDisposition) return 'attachment';

  // Try filename* first (RFC 5987 encoding, e.g. filename*=UTF-8''Arch%20Tickets.pdf)
  const starMatch = contentDisposition.match(
    /filename\*=(?:utf-8'')?([^;\s]+)/i
  );
  if (starMatch) {
    // (a malformed escape such as "%E0%A4%A" is kept as sent)
    let filename = starMatch[1];
    try {
      filename = decodeURIComponent(filename);
    } catch {}

    // eslint-disable-next-line no-control-regex
    return filename.replace(/[\u0000-\u001F\u007F]/g, '') || 'attachment';
  }

  // Try quoted filename (e.g. filename="Arch Tickets.pdf")
  const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i);
  if (quotedMatch) return quotedMatch[1];

  // Try unquoted filename (grab everything until ; or end of string)
  const unquotedMatch = contentDisposition.match(/filename=([^;]+)/i);
  if (unquotedMatch) return unquotedMatch[1].trim();

  return 'attachment';
}

//
// Quote FILENAME parameter values in ICS that contain special characters.
// RFC 5545 Section 3.2: param-value with special chars must be DQUOTE-wrapped.
// ical.js does not auto-quote parameter values, so we post-process the ICS.
//
function quoteICSFilenames(ics) {
  // Unfold first so FILENAME isn't split across lines
  const unfolded = ics.replace(/\r?\n[ \t]/g, '');
  // Quote any FILENAME= value that is not already quoted and contains
  // characters that are not valid in unquoted paramtext (spaces, commas, etc.)
  // (the value is matched first and checked after, as a pattern requiring
  // a space or comma inside it backtracked over long unquoted values)
  const quoted = unfolded.replace(
    /filename=(?!")([^;:\r\n]*)/gi,
    (match, val) => (/[\s,]/.test(val) ? `FILENAME="${val.trim()}"` : match)
  );
  // Re-fold lines longer than 75 octets per RFC 5545
  const lines = quoted.split(/\r?\n/);
  const folded = [];
  for (const line of lines) {
    if (line.length <= 75) {
      folded.push(line);
    } else {
      folded.push(line.slice(0, 75));
      let rest = line.slice(75);
      while (rest.length > 0) {
        folded.push(' ' + rest.slice(0, 74));
        rest = rest.slice(74);
      }
    }
  }

  return folded.join('\r\n');
}

module.exports = {
  parseContentDispositionFilename,
  quoteICSFilenames
};
