/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('#helpers/lodash');
const Aliases = require('#models/aliases');

//
// Aliases keep their generated passwords when they are reassigned (their
// mailboxes are encrypted with them), so whoever had a password, e.g. a
// member removed from the domain, can still sign in to IMAP, POP3, SMTP,
// CalDAV and CardDAV with it. This lists those aliases for their new owner,
// who can generate new passwords: it is added to the message that names the
// reassigned aliases (HTML, or an empty string if none has a password).
//
async function getAliasPasswordsNotice(ctx, aliases) {
  const names = await Aliases.distinct('name', {
    id: { $in: aliases.map((alias) => alias.id) },
    'tokens.0': { $exists: true }
  });
  if (names.length === 0) return '';
  return `<p class="font-weight-bold mt-3">${ctx.translate(
    'REASSIGNED_ALIASES_HAVE_PASSWORDS'
  )}</p><ul class="mb-0 text-left"><li>${names
    .map((name) => _.escape(name))
    .join('</li><li>')}</li></ul>`;
}

module.exports = getAliasPasswordsNotice;
