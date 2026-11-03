/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const splitLines = require('split-lines');

const asctime = require('#helpers/asctime');

//
// One message of an mbox file, in the "mboxrd" form most mail programs read
// <https://www.loc.gov/preservation/digital/formats/fdd/fdd000385.shtml>.
//
// A message starts at a line beginning with "From ", so such a line inside a
// message gets a ">" in front (and one more for each it already has, so that
// reading it back gives the original). Without it a line in the body of a
// received email started a message of its own, with headers the sender
// wrote, in the mailbox the backup was imported into.
//
const FROM_LINE = /^>*From /;

function formatMboxMessage(sender, date, content) {
  const lines = splitLines(content.trim()).map((line) =>
    FROM_LINE.test(line) ? `>${line}` : line
  );
  return `From ${sender} ${asctime(date)}\n${lines.join('\n')}\n\n`;
}

module.exports = formatMboxMessage;
