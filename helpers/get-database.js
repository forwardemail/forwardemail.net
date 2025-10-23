/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');

// <https://github.com/knex/knex-schema-inspector/pull/146>
const Database = require('better-sqlite3-multiple-ciphers');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');
const pMapSeries = require('p-map-series');
const pRetry = require('p-retry');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { Builder } = require('json-sql-enhanced');
const { boolean } = require('boolean');

const AddressBooks = require('#models/address-books');
const Aliases = require('#models/aliases');
const Attachments = require('#models/attachments');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const Contacts = require('#models/contacts');
const Domains = require('#models/domains');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const Threads = require('#models/threads');
const config = require('#config');
const email = require('#helpers/email');
const env = require('#config/env');
const getAttachments = require('#helpers/get-attachments');
const getPathToDatabase = require('#helpers/get-path-to-database');
const isRetryableError = require('#helpers/is-retryable-error');
const isValidPassword = require('#helpers/is-valid-password');
const logger = require('#helpers/logger');
const migrateSchema = require('#helpers/migrate-schema');
const setupPragma = require('#helpers/setup-pragma');
const { decrypt } = require('#helpers/encrypt-decrypt');

const builder = new Builder();

const HOSTNAME = os.hostname();

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

// always ensure `rclone.conf` is an empty file
// function syncRcloneConfig() {
//   try {
//     fs.writeFileSync(rcloneConfigFilePath, '');
//   } catch (err) {
//     err.isCodeBug = true;
//     logger.fatal(err);
//   }
// }
// syncRcloneConfig();
// setInterval(syncRcloneConfig, 30000);

/*
const s3 = [
  `--s3-provider="Cloudflare"`,
  `--s3-access-key-id="${env.AWS_ACCESS_KEY_ID}"`,
  `--s3-secret-access-key="${env.AWS_SECRET_ACCESS_KEY}"`,
  `--s3-region="${env.AWS_REGION}"`,
  `--s3-endpoint="${env.AWS_ENDPOINT_URL}"`
];

function touchFile(s3, fileName) {
  return new Promise((resolve, reject) => {
    //
    // the flag `--s3-no-check-bucket` is required in order for this to work
    // <https://github.com/rclone/rclone/issues/4589#issuecomment-694897762>
    // <https://rclone.org/s3/#s3-no-check-bucket>
    //
    const cmds = [
      'touch',
      ...s3,
      '-vvv',
      `--config "${rcloneConfigFilePath}"`,
      '--s3-no-check-bucket',
      `:s3:${bucketName}/${fileName}`
    ];
    console.log('cmds', cmds.join(' '));
    // NOTE: if we had wanted to go size approach it would have looked like this
    // const cmds = [
    //   'size',
    //   '--dry-run',
    //   '--exclude "*"',
    //   '--max-depth 0',
    //   ...s3,
    //   `:s3:${bucketName}/`
    // ],
    const cmd = spawn('rclone', cmds, {
      shell: true,
      // TODO: limit env path to rclone
      // env: {},
      timeout: ms('15s')
    });
    cmd.stdout.on('data', (data) => {
      console.log(String(data));
    });
    cmd.stderr.on('data', (data) => {
      console.log(String(data));
    });
    cmd.on('close', (code) => resolve(code));
    cmd.on('error', (err) => reject(err));
  });
}
*/

// eslint-disable-next-line max-params
async function getDatabase(
  instance,
  alias,
  session,
  newlyCreated = false,
  customDbFilePath = false
) {
  // const { stack } = new Error('stack');
  // return early if the session.db was already assigned
  if (
    session.db &&
    (session.db instanceof Database || instance.wsp) &&
    session.db.open === true
  ) {
    return session.db;
  }

  // instance must be either IMAP, POP3, SQLite, CalDAV, CardDAV, or API
  if (
    !['IMAP', 'POP3', 'SQLite', 'CalDAV', 'CardDAV', 'API'].includes(
      instance?.constructor?.name
    ) &&
    HOSTNAME !== env.SQLITE_HOST
  ) {
    throw new TypeError(
      'Instance must be either IMAP, POP3, SQLite, CalDAV, CardDAV, or API'
    );
  }

  // safeguard
  if (!mongoose.isObjectIdOrHexString(alias?.id))
    throw new TypeError('Alias ID missing');

  // safeguard
  if (!isSANB(session?.user?.password)) throw new TypeError('Password missing');

  // if true then `?mode=ro` will get appended below
  // <https://www.sqlite.org/c3ref/open.html>
  // <https://github.com/knex/knex/issues/1287>
  let readonly = true;
  if (!instance.wsp) readonly = false;

  //
  // we will substitute global with the unique bucket configuration hash
  // (e.g. rev-hash() on the parameters and maybe encrypt() too)
  //
  // TODO: instead of `global` it should be the default global bucket for the alias
  //       (e.g. `alias.bucket = 'production-xyz')
  //
  // const readmeFilePath = path.join(dir, readmeFileName);
  const dbFilePath = customDbFilePath || getPathToDatabase(alias);

  //
  // NOTE: if readonly and database doesn't exist it will throw an error
  //       so we need to signal to the websocket server to create it
  //
  if (readonly) {
    let exists = false;
    if (env.SQLITE_RCLONE_ENABLED && HOSTNAME !== env.SQLITE_HOST) {
      try {
        const stats = await fs.promises.stat(dbFilePath);
        if (stats.isFile()) {
          exists = true;
        }
      } catch (err) {
        err.isCodeBug = true; // Hide error from end users
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
    }

    if (!exists) {
      // TODO: cleanup all this
      if (instance?.constructor?.name === 'SQLite')
        throw new TypeError('IMAP or POP3 server instance required');

      if (!instance.wsp && instance?.constructor?.name !== 'SQLite')
        throw new TypeError('WebSocketAsPromised instance required');

      // TODO: newlyCreated logic should get called early
      //       (since we don't call "setup" below)
      //       (`return getDatabase` always gets hit for readonly instances)
      //       (and therefore this conditional should probably be removed)
      //       (or a check instead of "setup" like "exists" should be invoked)

      //
      // if we already recursively called this function from
      // a successful webhook response, then that must mean something
      // is wrong with the local file system or rclone mount
      //
      if (newlyCreated) {
        if (env.SQLITE_RCLONE_ENABLED && HOSTNAME === env.IMAP_HOST) {
          const error = new TypeError(
            'Newly created and still having readonly issues'
          );
          error.alias = alias;
          error.session = session;
          error.dbFilePath = dbFilePath;
          logger.fatal(error, { alias, session, resolver: instance.resolver });
        }

        //
        // return a dummy object with `wsp: true`
        // which signals us to use the websocket connection
        // in a fallback attempt in case the rclone mount failed
        //
        const db = {
          id: alias.id,
          open: true,
          inTransaction: false,
          readonly: true,
          memory: false,
          wsp: true,
          close() {
            this.open = false;
          }
        };
        // set session db helper (used in `refineAndLogError` to close connection)
        session.db = db;
        return db;
      }

      /*
      const err = new TypeError(
        'Database was not initialized with Generate Password'
      );
      err.alias = alias;
      err.session = session;
      err.dbFilePath = dbFilePath;
      throw err;

      //
      // NOTE: the below was commented out as it could be an edge case in production
      //       (it was mainly used for local testing, but we updated local tests)
      //       (to invoke methods used in generate alias password to setup db properly)
      /*
      await instance.wsp.request({
        action: 'setup',
        session: { user: session.user }
      });
      */

      // if rclone was not enabled then return early
      if (!env.SQLITE_RCLONE_ENABLED) {
        const db = {
          id: alias.id,
          open: true,
          inTransaction: false,
          readonly: true,
          memory: false,
          wsp: true,
          close() {
            this.open = false;
          }
        };
        // set session db helper (used in `refineAndLogError` to close connection)
        session.db = db;
        return db;
      }

      // call this function again if it was successful
      return getDatabase(instance, alias, session, true);
    }
  }

  //
  // check if the file exists at the given path
  // (if so, then we can assume that it's mounted)
  // (otherwise run size test, spawn daemon in background, pWaitFor (with 15s timeout), then continue)
  //
  //  try {
  //    const stats = await fs.promises.stat(dbFilePath);
  //    if (stats.isFile()) exists = true;
  //  } catch (err) {
  //    if (err.code !== 'ENOENT') throw err;
  //  }

  //
  // if file does not exist, then the README might exist
  // (which we add to all dirs with same naming convention)
  // (so that users don't accidentally delete the files)
  //
  /*
  let exists = false;
  try {
    // <https://github.com/nodejs/node/issues/38006>
    // const stats = await fs.promises.stat(readmeFilePath);
    const stats = fs.statSync(readmeFilePath);
    if (!stats.isFile())
      throw new TypeError('README did not exist at path as a file');
    exists = true;
    if (stats.size === 0) {
      // TODO: if the file is empty then write to it
      // TODO: write a README file for users with our disclaimer/website/email etc
      // TODO: this should come below after mounted
    }

    // try {
    //   const { stdout, stderr } = await execPromise(`test -f ${readmeFilePath}`);
    //   console.log('stdout', stdout);
    //   console.log('stderr', stderr);
    //   exists = true;
    // } catch {}

  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    await mkdirp(dir);
  }
  */

  //
  // TODO: some flags we might want to look into:
  // <https://forum.rclone.org/t/rclone-huge-performance-loss-upgrading-from-1-55-to-1-62/38209>
  //

  //
  // it doesn't seem like there's an easy way to test rclone connection
  // other than listing directories and files, which we don't want to do
  // (since this could be someone's sensitive bucket or directory)
  // <https://forum.rclone.org/t/how-to-test-remote-connection/28718/4>
  //
  // therefore we came up with a clever hack that uses `rclone size`
  // and excludes everything and doesn't recurse into directories
  // `rclone size --dry-run --exclude '*' --max-depth 0 ...`
  //
  // and the expected output must contain this:
  //
  // `Total objects: 0 (0)`
  // `Total size: 0 B (0 Byte)`
  //
  // but note we only want to try to run this when we don't already have a connection
  // and we also need to make sure we can actually write to the bucket
  // so a better solution is to attempt to `touch` and modify the timestamp of a file
  // (and create it if it doesn't already exist)

  /*
  console.log('exists', exists);

  if (!exists) {
    const stdout = '';
    const stderr = '';
    const touch = await Promise.all([
      touchFile(s3, dbFileName),
      touchFile(s3, readmeFileName)
    ]);
    console.log('touch', touch);
    console.log('stdout', stdout);
    console.log('stderr', stderr);

    if (touch[0] !== 0 || touch[1] !== 0)
      throw new TypeError('Touch error occurred');

    const mount = await new Promise((resolve, reject) => {
      const cmd = spawn(
        'rclone',
        [
          'mount',
          '--dump filters',
          `--config "${rcloneConfigFilePath}"`,
          '--debug-fuse',
          '--daemon',
          '--allow-non-empty',
          // TODO: redo this and only enable in non-production
          // '-vv', // <- can't set this if "--log-level" set too
          // '--log-level DEBUG',
          // `--log-file ${path.join(__dirname, '..', 'rclone-log.txt')}`,
          // '--no-modtime',
          // '--no-checksum',

          '--vfs-fast-fingerprint',
          '--vfs-cache-mode writes',
          // NOTE: this is useful for providers that don't support polling (?) not sure which ones yet though
          // <https://rclone.org/commands/rclone_mount/#vfs-directory-cache>
          '--dir-cache-time 10s', // default is 5m
          '--vfs-write-back 1s', // default is 5s
          '--vfs-cache-poll-interval 5s',
          '--poll-interval 1s',

          // NOTE: cache-dir should be unique unless we are certain daemon's won't spawn or overlap (could damage files)
          // --cache-dir string                     Directory rclone will use for caching.

          // --vfs-cache-mode CacheMode             Cache mode off|minimal|writes|full (default off)
          // --vfs-cache-max-age duration           Max time since last access of objects in the cache (default 1h0m0s)
          // --vfs-cache-max-size SizeSuffix        Max total size of objects in the cache (default off)
          // --vfs-cache-min-free-space SizeSuffix  Target minimum free space on the disk containing the cache (default off)
          // --vfs-cache-poll-interval duration     Interval to poll the cache for stale objects (default 1m0s)
          // --vfs-write-back duration              Time to writeback files after last use when using cache (default 5s)
          //
          // TODO: we most likely need to adjust interval and introduce better locking
          // <https://rclone.org/commands/rclone_mount/#vfs-file-caching>
          //
          '--max-depth 0',
          // filter for the readme and db file only
          `--include "${readmeFileName}"`,
          `--include "${dbFileName}"`,
          // TODO: probably can remove this since new storage method
          `--include ".forwardemail-mailbox-*.db"`,
          ...s3,
          `:s3:${bucketName}/`,
          dir
        ],
        {
          shell: true,
          // TODO: limit env path to rclone
          // env: {},
          timeout: ms('15s')
        }
      );
      cmd.stdout.on('data', (data) => {
        console.log('stdout', String(data));
      });
      cmd.stderr.on('data', (data) => {
        console.log('stderr', String(data));
      });
      cmd.on('close', (code) => resolve(code));
      cmd.on('error', (err) => reject(err));
    });

    console.log('mount', mount);

    if (mount !== 0) throw new TypeError('Mount error occurred');

    // TODO: if a timeout occurs here then we should attempt to kill rclone
    // TODO: we should also notify admins of the error
    // wait for file to appear locally on vfs
    await pWaitFor(
      () => {
        try {
          // <https://github.com/nodejs/node/issues/38006>
          // const stats = await fs.promises.stat(dbFilePath);
          const stats = fs.statSync(dbFilePath);
          return stats.isFile();
        } catch (err) {
          if (err.code !== 'ENOENT') throw err;
          return false;
        }
      },
      {
        timeout: ms('15s')
      }
    );
  }
  */

  let db;

  try {
    // if server is shutting down then don't bother getting database
    if (instance.isClosing) throw new ServerShutdownError();

    //
    // <https://github.com/WiseLibs/better-sqlite3/issues/1217>
    // <https://github.com/mattn/go-sqlite3/issues/274#issuecomment-1429010261>
    // <https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#:~:text=Transaction%20functions%20do,loop%20ticks%20anyways>
    //
    // check if we have in-memory existing opened database
    if (
      instance.databaseMap &&
      instance.databaseMap.has(alias.id) &&
      instance.databaseMap.get(alias.id).open === true &&
      instance.databaseMap.get(alias.id).readonly === false
    ) {
      db = instance.databaseMap.get(alias.id);
      session.db = db;
    } else {
      db = new Database(dbFilePath, {
        readonly,
        fileMustExist: readonly,
        timeout: config.busyTimeout,
        // <https://github.com/WiseLibs/better-sqlite3/issues/217#issuecomment-456535384>
        verbose: env.AXE_SILENT ? null : console.log
      });

      // store in-memory open connection
      if (instance.databaseMap) instance.databaseMap.set(alias.id, db);

      await setupPragma(db, session); // takes about 30ms

      // assigns to session so we can easily re-use
      // (also used in allocateConnection in IMAP notifier)
      session.db = db;
    }

    // if it is readonly then return early
    if (readonly) {
      return db;
    }

    let migrateCheck = !instance.server;
    let folderCheck = !instance.server;
    let trashCheck = !instance.server;
    let threadCheck = !instance.server;
    let vacuumCheck = !instance.server;
    let calendarDuplicateCheck = !instance.server;

    if (instance.client && instance.server) {
      try {
        const results = await instance.client.mget([
          `migrate_check:${session.user.alias_id}`,
          `folder_check:${session.user.alias_id}`,
          `trash_check:${session.user.alias_id}`,
          `thread_check:${session.user.alias_id}`,
          `vacuum_check:${session.user.alias_id}`,
          `calendar_duplicate_check:${session.user.alias_id}`
        ]);
        migrateCheck = boolean(results[0]);
        folderCheck = boolean(results[1]);
        trashCheck = boolean(results[2]);
        threadCheck = boolean(results[3]);
        vacuumCheck = boolean(results[4]);
        calendarDuplicateCheck = boolean(results[5]);
      } catch (err) {
        logger.fatal(err);
      }
    }

    // migrate schema
    // TODO: add p-timeout to the client.get calls below
    //
    // temporary fix remove this later (currently makes things very slow)
    //
    migrateCheck = true;

    if (!migrateCheck) {
      try {
        await instance.client.set(
          `migrate_check:${session.user.alias_id}`,
          true,
          'PX',
          ms('1d')
        );

        //
        // NOTE: if we change schema on db then we
        //       need to stop sqlite server then
        //       purge all migrate_check:* keys
        //
        const commands = await migrateSchema(instance, db, session, {
          Mailboxes,
          Messages,
          Threads,
          Attachments,
          Calendars,
          CalendarEvents,
          AddressBooks,
          Contacts
        });

        if (commands.length > 0) {
          for (const command of commands) {
            try {
              // TODO: wsp here (?)
              db.prepare(command).run();
              // await knexDatabase.raw(command);
            } catch (err) {
              err.isCodeBug = true;
              logger.fatal(err, {
                command,
                alias,
                session,
                resolver: instance.resolver
              });
              // migration support in case existing rows
              if (
                err.message.includes(
                  'Cannot add a NOT NULL column with default value NULL'
                ) &&
                command.endsWith(' NOT NULL')
              ) {
                try {
                  db.prepare(command.replace(' NOT NULL', '')).run();
                } catch (err) {
                  err.isCodeBug = true;
                  logger.fatal(err, {
                    command,
                    alias,
                    session,
                    resolver: instance.resolver
                  });
                }
              }
            }
          }
        }
      } catch (err) {
        logger.fatal(err);
      }
    }

    //
    // create initial folders for the user if they do not yet exist
    // (only do this once every day)
    //
    if (!folderCheck) {
      try {
        await instance.client.set(
          `folder_check:${session.user.alias_id}`,
          true,
          'PX',
          ms('1d')
        );
        const paths = await Mailboxes.distinct(instance, session, 'path', {});
        const required = [];
        for (const path of REQUIRED_PATHS) {
          if (!paths.includes(path)) {
            required.push(path);
          }
        }

        if (required.length > 0) {
          // NOTE: we don't invoke `onCreate` here or re-use it since it calls `refreshSession`
          //       (and that would lead to unnecessary recursion)
          await Promise.all(
            required.map(async (path) => {
              try {
                const count = await Mailboxes.countDocuments(
                  instance,
                  session,
                  {
                    path
                  }
                );

                if (count > 0) {
                  return;
                }

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
        }
      } catch (err) {
        logger.fatal(err, { session, resolver: instance.resolver });
      }
    }

    //
    // NOTE: we remove messages in Junk/Trash folder that are >= 30 days old
    //       (but we only do this once every day)
    if (!trashCheck) {
      try {
        await instance.client.set(
          `trash_check:${session.user.alias_id}`,
          true,
          'PX',
          ms('1d')
        );

        const mailboxes = await Mailboxes.find(instance, session, {
          path: {
            $in: ['Trash', 'Spam', 'Junk']
          },
          specialUse: {
            $in: ['\\Trash', '\\Junk']
          }
        });

        if (mailboxes.length === 0)
          throw new TypeError('Trash folder(s) do not exist');

        const [storageUsed, maxQuotaPerAlias] = await Promise.all([
          Domains.getStorageUsed(session.user.domain_id),
          Domains.getMaxQuota(session.user.domain_id, session.user.alias_id)
        ]);

        const percentageUsed = Math.round(
          (storageUsed / maxQuotaPerAlias) * 100
        );

        // subtract the % from 30d and round up with min 0
        const days = Math.max(Math.round(30 * (1 - percentageUsed / 100)), 0);

        {
          const sql = builder.build({
            type: 'remove',
            table: 'Messages',
            condition: {
              $or: [
                {
                  mailbox: {
                    $in: mailboxes.map((m) => m._id.toString())
                  },
                  exp: 1,
                  rdate: {
                    $lte: new Date().toISOString()
                  }
                },
                {
                  mailbox: {
                    $in: mailboxes.map((m) => m._id.toString())
                  },
                  rdate: {
                    $lte: dayjs().subtract(days, 'days').toDate().toISOString()
                  }
                },
                {
                  mailbox: {
                    $in: mailboxes.map((m) => m._id.toString())
                  },
                  undeleted: 0
                },
                {
                  mailbox: {
                    $in: mailboxes.map((m) => m._id.toString())
                  },
                  created_at: {
                    $lte: dayjs().subtract(days, 'days').toDate().toISOString()
                  }
                }
              ]
            }
          });

          db.prepare(sql.query).run(sql.values);
        }

        // TODO: wss broadcast changes here to connected clients

        // iterate over all messages to get an array of attachment ids
        // and then iterate over all attachments to delete those not in the list
        const now = new Date().toISOString();
        const sql = builder.build({
          type: 'select',
          table: 'Messages',
          condition: {
            created_at: {
              $lte: now
            },
            ha: true
          },
          fields: ['mimeTree']
        });

        const stmt = db.prepare(sql.query);

        const hashSet = new Set();

        for (const message of stmt.iterate(sql.values)) {
          const hashes = getAttachments(message.mimeTree);
          for (const hash of hashes) {
            hashSet.add(hash);
          }
        }

        // NOTE: this only works if there's at least one hash from existing messages
        //       (otherwise to do it for all we'd just remove this conditional check)
        // TODO: <https://github.com/nodemailer/wildduck/issues/750>
        if (hashSet.size > 0) {
          // iterate over all attachments from the past
          // and if the hash is not in the array then remove it
          const sql = builder.build({
            type: 'select',
            table: 'Attachments',
            condition: {
              created_at: { $lte: now },
              counterUpdated: { $lte: now }
            },
            fields: ['hash']
          });

          const existingHashes = db.prepare(sql.query).pluck().all(sql.values);

          for (const hash of existingHashes) {
            if (hashSet.has(hash)) continue;

            const sql = builder.build({
              type: 'remove',
              table: 'Attachments',
              condition: {
                created_at: { $lte: now },
                counterUpdated: { $lte: now },
                hash
              }
            });

            db.prepare(sql.query).run(sql.values);
          }

          /*
          // TODO: this is too slow, it took 1 hour in production
          db.transaction((hashes) => {
            for (const hash of hashes) {
              if (hashSet.has(hash)) continue;
              const sql = builder.build({
                type: 'remove',
                table: 'Attachments',
                condition: {
                  created_at: { $lte: now },
                  counterUpdated: { $lte: now },
                  hash
                }
              });

              db.prepare(sql.query).run(sql.values);
            }
          }).immediate(existingHashes);
          */
        }
      } catch (err) {
        logger.fatal(err, { session, resolver: instance.resolver });
      }
    }

    //
    // NOTE: we delete thread ids that don't correspond to messages anymore
    //
    if (!threadCheck) {
      try {
        await instance.client.set(
          `thread_check:${session.user.alias_id}`,
          true,
          'PX',
          ms('1d')
        );

        db.exec(
          `DELETE FROM Threads WHERE _id NOT IN (SELECT thread FROM Messages);`
        );
      } catch (err) {
        logger.fatal(err, { session, resolver: instance.resolver });
      }
    }

    if (!calendarDuplicateCheck) {
      try {
        await instance.client.set(
          `calendar_duplicate_check:${session.user.alias_id}`,
          true,
          'PX',
          ms('30d')
        );

        //
        // get all calendars and delete calendars that have zero events and duplicated name
        // (rudimentary cleanup approach; since new logic will create fresh calendars)
        //
        const calendars = await Calendars.find(instance, session, {});
        if (calendars.length > 0)
          await pMapSeries(calendars, async (calendar) => {
            const [eventCount, calendarCount] = await Promise.all([
              CalendarEvents.countDocuments(instance, session, {
                calendar: calendar._id
              }),
              Calendars.countDocuments(instance, session, {
                name: calendar.name,
                _id: { $ne: calendar._id.toString() }
              })
            ]);

            //
            // if no events and there were other calendars with the same name
            // then we can assume this is simply a duplicate and we can remove it
            // (eventually it will get to the last one that has the same name and not remove it)
            //
            if (eventCount === 0 && calendarCount > 0)
              await Calendars.deleteOne(instance, session, {
                _id: calendar._id
              });
          });
      } catch (err) {
        logger.fatal(err, { session, resolver: instance.resolver });
      }
    }

    if (
      !migrateCheck ||
      !folderCheck ||
      !trashCheck ||
      !threadCheck ||
      !vacuumCheck ||
      !calendarDuplicateCheck
    ) {
      try {
        //
        // Ensure that auto vacuum is enabled
        // (otherwise we email the user that this operation is taking place)
        //
        const hasAutoVacuum = db.pragma('auto_vacuum', { simple: true }) === 1;
        if (!hasAutoVacuum) {
          // get latest from cache in case another connection started a vacuum
          vacuumCheck = boolean(
            await instance.client.get(`vacuum_check:${session.user.alias_id}`)
          );
          if (!vacuumCheck) {
            // only once per week should we attempt this
            await instance.client.set(
              `vacuum_check:${session.user.alias_id}`,
              true,
              'PX',
              ms('7d')
            );

            db.pragma('auto_vacuum=FULL');
            db.prepare('VACUUM').run();
          }
        }

        //
        // All applications should run "PRAGMA optimize;" after a schema change,
        // especially after one or more CREATE INDEX statements.
        // <https://www.sqlite.org/pragma.html#pragma_optimize:~:text=All%20applications%20should%20run%20%22PRAGMA%20optimize%3B%22%20after%20a%20schema%20change%2C%20especially%20after%20one%20or%20more%20CREATE%20INDEX%20statements.>
        //
        db.pragma('analysis_limit=400');
        db.pragma('optimize');
      } catch (err) {
        logger.fatal(err);
      }
    }

    return db;
  } catch (err) {
    // in case developers are connected to it in SQLiteStudio (this will cause a read/write error)
    if (err.code === 'SQLITE_IOERR_SHORT_READ') {
      err.message +=
        '******************* PLEASE DISCONNECT FROM SQLiteStudio IF YOU ARE CONNECTED *************';
    }

    // <https://sqlite.org/c3ref/c_abort.html>
    // <https://www.sqlite.org/rescode.html>
    // SQLITE_FULL: database or disk full
    // SQLITE_IOERR: disk I/O error
    // SQLITE_BUSY: database in use by another process
    // SQLITE_NOMEM: out of memory
    // <https://sqlite.org/pragma.html#pragma_user_version>
    // TODO: notify user here by sms/notification/email of any issues
    // if (err.code === 'SQLITE_NOTADB') throw new Error('Bad password');
    err.readonly = readonly;
    err.dbFilePath = dbFilePath;
    throw err;
  }
}

function retryGetDatabase(...args) {
  return pRetry(() => getDatabase(...args), {
    retries: 2,
    minTimeout: ms('5s'),

    async onFailedAttempt(error) {
      const instance = args[0];
      const session = args[2];

      if (isRetryableError(error)) {
        logger.fatal(error, { session, resolver: instance.resolver });
        return;
      }

      //
      // NOTE: we attempt to check if the password was valid
      //       and if so, then we run a backup, email it to the admin/user
      //       and then run a reset of the database with the valid password
      //       (edge case in case "rekey" operation does not succeed)
      //
      if (
        error.code === 'SQLITE_NOTADB' &&
        error.dbFilePath &&
        !error.readonly
      ) {
        try {
          //
          // check if password was valid
          //
          if (!session?.user?.alias_id) {
            throw error;
          }

          if (!session?.user?.password) {
            throw error;
          }
          // if (!session?.user?.owner_full_email) throw err;

          // try to fetch most up to date alias object
          const alias = await Aliases.findOne({ id: session.user.alias_id })
            .populate(
              'user',
              `id ${config.userFields.isBanned} ${config.userFields.smtpLimit} email ${config.lastLocaleField} timezone`
            )
            .select('+tokens.hash +tokens.salt')
            .lean()
            .exec();

          // mirror of `helpers/validate-alias.js`
          // (extra safeguard)
          if (!alias) {
            throw error;
          }

          if (!alias.user) {
            throw error;
          }

          if (alias.user[config.userFields.isBanned]) {
            throw error;
          }

          if (!alias.is_enabled) {
            throw error;
          }

          if (alias.name === '*') {
            throw error;
          }

          if (alias.name.startsWith('/')) {
            throw error;
          }

          // mirrors `helpers/on-auth.js`
          // (extra safeguard)
          if (!Array.isArray(alias.tokens) || alias?.tokens?.length === 0) {
            throw error;
          }

          // ensure that the token is valid
          let isValid = false;
          if (alias && Array.isArray(alias.tokens) && alias.tokens.length > 0) {
            isValid = await isValidPassword(
              alias.tokens,
              decrypt(session.user.password)
            );
          }

          if (!isValid) {
            throw error;
          }

          error.isCodeBug = true;
          error.message = `Password token valid for ${session.user.username} with alias ID ${session.user.alias_id}\n\n ${error.message}`;

          // check if file path was <= initial db size
          try {
            const stats = await fs.promises.stat(error.dbFilePath);
            if (!stats.isFile() || stats.size > config.INITIAL_DB_SIZE) {
              throw error;
            }

            error.stats = stats;
          } catch (err) {
            logger.debug(err);
            return;
          }

          //
          // remove db file and all related files
          //
          try {
            await fs.promises.rm(error.dbFilePath, {
              force: true,
              recursive: true
            });
          } catch (err) {
            if (err.code !== 'ENOENT') {
              err.isCodeBug = true;
              throw err;
            }
          }

          // -wal
          try {
            await fs.promises.rm(
              error.dbFilePath.replace('.sqlite', '.sqlite-wal'),
              {
                force: true,
                recursive: true
              }
            );
          } catch (err) {
            if (err.code !== 'ENOENT') {
              err.isCodeBug = true;
              throw err;
            }
          }

          // -shm
          try {
            await fs.promises.rm(
              error.dbFilePath.replace('.sqlite', '.sqlite-shm'),
              {
                force: true,
                recursive: true
              }
            );
          } catch (err) {
            if (err.code !== 'ENOENT') {
              err.isCodeBug = true;
              throw err;
            }
          }

          // email admins of the renaming
          email({
            template: 'alert',
            message: {
              to: config.alertsEmail,
              subject: `Database backup fix for ${session.user.username} (${session.user.alias_id})`
            },
            locals: {
              message: `<p>${
                error.dbFilePath
              }</p><hr /><pre><code>${safeStringify(
                error.stats,
                null,
                2
              )}</code></pre><pre><code>${safeStringify(
                parseErr(error),
                null,
                2
              )}</code></pre>`
            }
          })
            .then()
            .catch((err) => logger.fatal(err));

          // return here so we can retry and it will re-create database
          return;
        } catch (err) {
          // this should email admins via `isCodeBug` setting to `true`
          err.message = `Password token valid for ${session.user.username} with alias ID ${session.user.alias_id}\n\n ${err.message}`;
          err.isCodeBug = true;
          err.original_error = parseErr(error);
          logger.fatal(err, { session, resolver: instance.resolver });
        }
      } else {
        logger.fatal(error, { session, resolver: instance.resolver });
      }

      throw error;
    }
  });
}

module.exports = retryGetDatabase;
