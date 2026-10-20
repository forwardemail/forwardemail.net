/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Mailboxes = require('#models/mailboxes');

// names of the spam folder (both get the \Junk special-use, see the model)
const JUNK_PATHS = new Set(['junk', 'spam']);

//
// The spam folder for a "Junk" or "Spam" path the mailbox does not have
// (new mailboxes only have "Spam", older ones may also have "Junk", see
// `helpers/ensure-default-mailboxes.js`), or null for any other path
//
// A folder of the same name in another case is preferred, then "Spam".
//
async function getJunkMailbox(instance, session, path) {
  if (typeof path !== 'string') return null;
  const name = path.trim().toLowerCase();
  if (!JUNK_PATHS.has(name)) return null;

  const mailboxes = await Mailboxes.find(instance, session, {
    specialUse: '\\Junk'
  });
  if (!Array.isArray(mailboxes) || mailboxes.length === 0) return null;

  return (
    mailboxes.find((m) => m.path.toLowerCase() === name) ||
    mailboxes.find((m) => m.path === 'Spam') ||
    mailboxes[0]
  );
}

module.exports = getJunkMailbox;
