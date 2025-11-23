/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const { IMAPServer } = require('wildduck/imap-core');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const IMAPError = require('#helpers/imap-error');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const SocketError = require('#helpers/socket-error');
const config = require('#config');
const getDatabase = require('#helpers/get-database');
const i18n = require('#helpers/i18n');
const validateAlias = require('#helpers/validate-alias');
const validateDomain = require('#helpers/validate-domain');

const IMAP_COMMANDS = new Set([
  'APPEND',
  'COPY',
  'CREATE',
  'DELETE',
  'EXPUNGE',
  'FETCH',
  'GETQUOTAROOT',
  'GETQUOTA',
  'LIST',
  'LSUB',
  'MOVE',
  'OPEN',
  'RENAME',
  'SEARCH',
  'STATUS',
  'STORE',
  'SUBSCRIBE',
  'UNSUBSCRIBE',
  'XAPPLEPUSHSERVICE'
]);

async function refreshSession(session, command) {
  if (!command) throw new Error('Command required');
  command = command.toUpperCase().trim();
  if (
    command !== 'POP3' &&
    !IMAP_COMMANDS.has(command) &&
    command !== 'CALDAV' &&
    command !== 'CARDDAV' &&
    command !== 'API'
  )
    throw new Error('Invalid command');

  // check if server is in the process of shutting down
  if (this.isClosing) throw new ServerShutdownError();

  // NOTE: WildDuck POP3 doesn't expose socket on session yet (also see similar comment in onAuth helper)
  // check if socket is still connected (only applicable for IMAP and POP3 servers)
  if (this?.server instanceof IMAPServer) {
    const socket = (session.socket && session.socket._parent) || session.socket;
    if (!socket || socket?.destroyed || socket?.readyState !== 'open')
      throw new SocketError();
  }

  if (!isSANB(session?.user?.domain_id) || !isSANB(session?.user?.domain_name))
    throw new IMAPError('Domain ID and name do not exist on session');

  if (!isSANB(session?.user?.alias_id) || !isSANB(session?.user?.alias_name))
    throw new IMAPError('Alias ID and name do not exist on session');

  if (!isSANB(session?.user?.storage_location))
    throw new IMAPError('Alias storage location does not exist on session');

  // only refresh if it has been more 1d
  // (drastically helps speed up bulk migrations and appends)
  let needsRefreshed = true;
  if (this.client) {
    try {
      // TODO: add p-timeout here
      // TODO: add p-timeout to getStorageUsed redis invocation
      const cache = await this.client.get(
        `refresh_check:${session.user.alias_id}`
      );
      if (cache) needsRefreshed = false;
    } catch (err) {
      this.logger.fatal(err);
    }
  }

  if (needsRefreshed) {
    const [domain, alias] = await Promise.all([
      Domains.findById(session.user.domain_id)
        .populate(
          'members.user',
          `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
        )
        .lean()
        .exec(),
      Aliases.findById(session.user.alias_id)
        .populate(
          'user',
          // TODO: we can remove `smtpLimit` (?)
          `id email ${config.userFields.isBanned} ${config.userFields.smtpLimit} ${config.lastLocaleField}`
        )
        .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
        .lean()
        .exec()
    ]);

    // validate domain (in case tampered with during session)
    validateDomain(domain, session.user.domain_name);

    // validate alias (in case tampered with during session)
    validateAlias(alias, session.user.domain_name, session.user.alias_name);

    // refresh the user's pgp settings, email, and locale
    session.user.alias_has_pgp = alias.has_pgp;
    session.user.alias_public_key = alias.public_key;
    session.user.locale =
      alias.user[config.lastLocaleField] || i18n.config.defaultLocale;
    session.user.owner_full_email = alias.user.email;

    // a long cache period avoids MongoDB connection issues interrupting IMAP
    await this.client.set(
      `refresh_check:${session.user.alias_id}`,
      true,
      'PX',
      ms('1d')
    );
  }

  //
  // NOTE: we don't need to perform the below validation because we
  //       will close connections via "sqlite_auth_reset" command via pub/sub
  //       if we detect that the user changed their password
  //       and the above code with `validateDomain` and `validateAlias`
  //       ensures that the user cannot be banned or have all admins banned
  //       (and ensures the user is up to date on payment too)
  //
  //       (this saves 100-600ms+ because pbkdf2 is slow by design)
  //

  //
  // NOTE: we validate that the in-memory password is still active for the given user
  //       (e.g. edge case where AUTH done, a few seconds go by, then pass removed by user, and IMAP command couldn't been tried)
  //       (e.g. the SQLite database password would've been changed if user changed alias' password, so we should error)
  //
  // ensure the token is still valid
  /*
  let isValid = false;
  if (Array.isArray(alias.tokens) && alias.tokens.length > 0)
    isValid = await isValidPassword(
      alias.tokens,
      decrypt(session.user.password)
    );
  if (!isValid)
    throw new IMAPError(
      `Invalid password, please try again or go to ${config.urls.web}/my-account/domains/${punycode.toASCII(session.user.domain_name)}/aliases and click "Generate Password"`,
      {
        responseCode: 535
        // ignoreHook: true
      }
    );
  */

  // TODO: notifications via web/sms/desktop/mobile electron + react native app
  //       (e.g. if there are any issues such as IMAP access being locked due to r/w issues)

  // connect to the database (sets `session.db` for us automatically)

  await getDatabase(
    this,
    {
      // alias
      id: session.user.alias_id,
      storage_location: session.user.storage_location
    },
    session
  );

  // fire notifications if any (e.g. initial creation of databases)
  // if (this?.constructor?.name !== 'CalDAV' && this?.constructor?.name !== 'CardDAV')
  //   this.server.notifier.fire(session.user.alias_id);
}

module.exports = refreshSession;
