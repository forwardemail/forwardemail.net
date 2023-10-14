/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const noReplyList = require('reserved-email-addresses-list/no-reply-list.json');

const SMTPError = require('#helpers/smtp-error');
const config = require('#config');

const NO_REPLY_USERNAMES = new Set(noReplyList);

function validateAlias(alias, domain, name) {
  if (!alias)
    throw new SMTPError(
      `Alias does not exist, go to ${config.urls.web}/my-account/domains/${domain.name} and add the alias of "${name}"`,
      { responseCode: 535, ignoreHook: true }
    );

  // alias must not have banned user
  if (alias.user[config.userFields.isBanned])
    throw new SMTPError('Alias user is banned');

  //
  // it is bad practice to send outbound email from a no-reply or unmonitored mailbox
  // (consider using "Reply-To" header with a "no-reply" address)
  //
  const string = alias.name.replace(/[^\da-z]/g, '');
  if (NO_REPLY_USERNAMES.has(string))
    throw new SMTPError(
      'You cannot use a "no-reply" username to send outbound mail (it is bad practice to send from an unmonitored mailbox).'
    );

  // alias must be enabled
  if (!alias.is_enabled) throw new SMTPError('Alias is disabled');

  // alias must not be catch-all
  if (alias.name === '*') throw new SMTPError('Alias cannot be a catch-all');

  // alias cannot be regex
  if (alias.name.startsWith('/'))
    throw new SMTPError('Alias cannot be a regex');
}

module.exports = validateAlias;
