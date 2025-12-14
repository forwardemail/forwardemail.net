/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const Mailboxes = require('#models/mailboxes');
const logger = require('#helpers/logger');

// Matches 1:1 with pre-validate mailbox model hook
const REQUIRED_PATHS = [
  'INBOX',
  'Sent Mail',
  'Spam',
  'Junk',
  'Trash',
  'Drafts',
  // NOTE: we explicitly keep out "All Mail" (it's basically a virtual mailbox)
  // 'All Mail',
  'Archive'
];

//
// Ensure all required default mailboxes exist for a session
// This is called after DELETE/RENAME operations and during database initialization
//
async function ensureDefaultMailboxes(instance, session, purgeCache = false) {
  try {
    // Check if we've already verified this recently (cache for 1 day)
    const cacheKey = `folder_check:${session.user.alias_id}`;
    if (!purgeCache) {
      const cached = await instance.client.get(cacheKey);
      if (cached) return;
    }

    // Set cache to prevent redundant checks
    await instance.client.set(cacheKey, true, 'PX', ms('1d'));

    // Get existing paths
    const paths = await Mailboxes.distinct(instance, session, 'path', {});
    const required = [];
    for (const path of REQUIRED_PATHS) {
      if (!paths.includes(path)) {
        required.push(path);
      }
    }

    if (required.length === 0) return;

    // NOTE: we don't invoke `onCreate` here or re-use it since it calls `refreshSession`
    //       (and that would lead to unnecessary recursion)
    await Promise.all(
      required.map(async (path) => {
        try {
          const count = await Mailboxes.countDocuments(instance, session, {
            path
          });

          if (count > 0) return;

          const mailbox = await Mailboxes.create({
            // Virtual helper
            instance,
            session,

            path,
            // NOTE: this is the same uncommented code as `helpers/imap/on-create`
            // TODO: support custom alias retention (would get stored on session)
            // TODO: if user updates retention then we'd need to update in-memory IMAP connections
            // retention: typeof alias.retention === 'number' ? alias.retention : 0
            retention: 0
          });

          instance.server.notifier
            .addEntries(instance, session, mailbox, {
              command: 'CREATE',
              mailbox: mailbox._id,
              path
            })
            .then(() => {
              instance.server.notifier.fire(session.user.alias_id);
            })
            .catch((err) =>
              logger.fatal(err, { session, resolver: instance.resolver })
            );
        } catch (err) {
          logger.fatal(err, { session, resolver: instance.resolver });
        }
      })
    );
  } catch (err) {
    logger.fatal(err, { session, resolver: instance.resolver });
  }
}

ensureDefaultMailboxes.REQUIRED_PATHS = REQUIRED_PATHS;

module.exports = ensureDefaultMailboxes;
