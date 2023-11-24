/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const SMTPError = require('#helpers/smtp-error');
const config = require('#config');

function validateAlias(alias, domain, name) {
  if (!alias)
    throw new SMTPError(
      `Alias does not exist, go to ${config.urls.web}/my-account/domains/${domain.name} and add the alias of "${name}"`,
      { responseCode: 535, ignoreHook: true }
    );

  //
  // TODO: adjust refineAndLogError to detect this error
  //       and subsequently invoke `sqlite_auth_reset` for this id
  //       and also close the current connection
  //
  // alias must not have banned user
  if (alias.user[config.userFields.isBanned])
    throw new SMTPError('Alias user is banned');

  // alias must be enabled
  if (!alias.is_enabled) throw new SMTPError('Alias is disabled');

  // alias must not be catch-all
  if (alias.name === '*') throw new SMTPError('Alias cannot be a catch-all');

  // alias cannot be regex
  if (alias.name.startsWith('/'))
    throw new SMTPError('Alias cannot be a regex');
}

module.exports = validateAlias;
