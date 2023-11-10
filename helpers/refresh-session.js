/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const SocketError = require('#helpers/socket-error');
const config = require('#config');
const getDatabase = require('#helpers/get-database');
const isValidPassword = require('#helpers/is-valid-password');
const logger = require('#helpers/logger');
const validateAlias = require('#helpers/validate-alias');
const validateDomain = require('#helpers/validate-domain');
const { decrypt } = require('#helpers/encrypt-decrypt');

const REQUIRED_PATHS = [
  'INBOX',
  'Drafts',
  'Sent Mail',
  //
  // NOTE: we could use "All Mail" to match existing standards (e.g. instead of "Archive")
  // <https://github.com/mozilla/releases-comm-central/blob/34d8c5cba2df3154e1c38b376e8c10ca24e4f939/mailnews/imap/src/nsImapMailFolder.cpp#L1171-L1173>
  //
  // 'All Mail' but we would need to use labels
  //
  'Archive',
  'Spam',
  'Trash'
];

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
  'UNSUBSCRIBE'
]);

// eslint-disable-next-line complexity
async function refreshSession(session, command) {
  if (!command) throw new Error('Command required');
  command = command.toUpperCase().trim();
  if (!IMAP_COMMANDS.has(command)) throw new Error('Invalid command');

  // check if server is in the process of shutting down
  if (this.server._closeTimeout) throw new ServerShutdownError();

  // check if socket is still connected
  if (this?.constructor?.name !== 'SQLite') {
    const socket = (session.socket && session.socket._parent) || session.socket;
    if (!socket || socket?.destroyed || socket?.readyState !== 'open')
      throw new SocketError();
  }

  if (!isSANB(session?.user?.domain_id) || !isSANB(session?.user?.domain_name))
    throw new IMAPError('Domain does not exist on session');

  if (!isSANB(session?.user?.alias_id) || !isSANB(session?.user?.alias_name))
    throw new IMAPError('Alias does not exist on session');

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
        `id ${config.userFields.isBanned} ${config.userFields.smtpLimit}`
      )
      .select('+tokens.hash +tokens.salt')
      .lean()
      .exec()
  ]);

  // validate domain (in case tampered with during session)
  validateDomain(domain, session.user.domain_name);

  // validate alias (in case tampered with during session)
  validateAlias(alias, session.user.domain_name, session.user.alias_name);

  //
  // NOTE: we validate that the in-memory password is still active for the given user
  //       (e.g. edge case where AUTH done, a few seconds go by, then pass removed by user, and IMAP command couldn't been tried)
  //       (e.g. the SQLite database password would've been changed if user changed alias' password, so we should error)
  //
  // ensure the token is still valid
  let isValid = false;
  if (Array.isArray(alias.tokens) && alias.tokens.length > 0)
    isValid = await isValidPassword(
      alias.tokens,
      decrypt(session.user.password)
    );
  if (!isValid)
    throw new IMAPError(
      `Invalid password, please try again or go to ${config.urls.web}/my-account/domains/${session.user.domain_name}/aliases and click "Generate Password"`,
      {
        responseCode: 535
        // ignoreHook: true
      }
    );

  // TODO: notifications via web/sms/desktop/mobile electron + react native app
  //       (e.g. if there are any issues such as IMAP access being locked due to r/w issues)
  // TODO: script to export as mbox

  // connect to the database
  const { db } = await getDatabase(this, alias, session);

  //
  // if and only if we're not an instance of SQLite
  // (otherwise this would result in recursion)
  //
  // prevent circular dep (otherwise we could do instanceof)
  if (this?.constructor?.name === 'IMAP') {
    //
    // NOTE: this is in the background otherwise auth attempts would hang
    //       if there was an issue with websocket connection or reading/writing
    //
    try {
      const paths = await Mailboxes.distinct(this, session, 'path', {});
      const required = [];
      for (const path of REQUIRED_PATHS) {
        if (!paths.includes(path)) required.push(path);
      }

      if (required.length > 0)
        await Mailboxes.create(
          required.map((path) => ({
            // virtual helper
            instance: this,
            session,

            path,
            retention: typeof alias.retention === 'number' ? alias.retention : 0
          }))
        );
    } catch (err) {
      this.logger.fatal(err, { session });
    }

    // sync with temp db on every request
    const sync = await this.wsp.request({
      action: 'sync',
      timeout: ms('10s'),
      session: { user: session.user }
    });

    this.logger.debug('sync', { sync });

    // TODO: this needs limited to only being one once per alias across all its IMAP connections
    // offset by 10s to prevent locking db while a read is in progress
    if (!session.backupInProgress) {
      session.backupInProgress = true;
      setTimeout(() => {
        //
        // hourly backups
        //
        const oneHourAgo = dayjs().subtract(1, 'hour').toDate();
        const now = new Date();
        if (
          !_.isDate(alias.imap_backup_at) ||
          new Date(alias.imap_backup_at).getTime() <= oneHourAgo.getTime()
        ) {
          Aliases.findOneAndUpdate(
            {
              _id: alias._id,
              imap_backup_at: _.isDate(alias.imap_backup_at)
                ? {
                    $exists: true,
                    $lte: oneHourAgo
                  }
                : {
                    $exists: false
                  }
            },
            {
              $set: {
                imap_backup_at: now
              }
            }
          )
            .then((alias) => {
              // return early if no alias found (point in time safeguard)
              if (!alias) {
                session.backupInProgress = false;
                return;
              }

              this.wsp
                .request({
                  action: 'backup',
                  backup_at: now.toISOString(),
                  session: { user: session.user }
                })
                .then(() => {
                  logger.debug('backup performed', { session });
                  session.backupInProgress = false;
                })
                .catch((err) => {
                  logger.fatal(err, { session });
                  // if the backup failed then we unset the imap_backup_at
                  Aliases.findOneAndUpdate(
                    {
                      _id: alias._id,
                      imap_backup_at: now
                    },
                    {
                      $unset: {
                        imap_backup_at: 1
                      }
                    }
                  )
                    .then(() => {
                      session.backupInProgress = false;
                    })
                    .catch((err) => {
                      logger.fatal(err, { session });
                      session.backupInProgress = false;
                    });
                });
            })
            .catch((err) => {
              logger.fatal(err, { session });
              session.backupInProgress = false;
            });
        }
      }, ms('10s'));
    }
  }

  return { db, domain, alias };
}

module.exports = refreshSession;
