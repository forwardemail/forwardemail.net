/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// <https://github.com/knex/knex-schema-inspector/pull/146>
const Database = require('better-sqlite3-multiple-ciphers');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');
const pRetry = require('p-retry');
const pify = require('pify');
const { Builder } = require('json-sql');
const { boolean } = require('boolean');

const parseErr = require('parse-err');
const Aliases = require('#models/aliases');
const Attachments = require('#models/attachments');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const Threads = require('#models/threads');
const config = require('#config');
const email = require('#helpers/email');
const env = require('#config/env');
const getPathToDatabase = require('#helpers/get-path-to-database');
const isTimeoutError = require('#helpers/is-timeout-error');
const isValidPassword = require('#helpers/is-valid-password');
const logger = require('#helpers/logger');
const migrateSchema = require('#helpers/migrate-schema');
const onExpunge = require('#helpers/imap/on-expunge');
const setupPragma = require('#helpers/setup-pragma');
const { acquireLock, releaseLock } = require('#helpers/lock');
const { decrypt } = require('#helpers/encrypt-decrypt');

const onExpungePromise = pify(onExpunge, { multiArgs: true });

const builder = new Builder();

const HOSTNAME = os.hostname();

const AFFIXES = ['-wal', '-shm'];

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

// eslint-disable-next-line complexity, max-params
async function getDatabase(
  instance,
  alias,
  session,
  existingLock,
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

  // instance must be either IMAP, POP3, SQLite, or CalDAV
  if (
    !['IMAP', 'POP3', 'SQLite', 'CalDAV'].includes(
      instance?.constructor?.name
    ) &&
    HOSTNAME !== env.SQLITE_HOST
  ) {
    throw new TypeError(
      'Instance must be either IMAP, POP3, SQLite, or CalDAV'
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
          logger.fatal(error, { alias, session });
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
        lock: existingLock,
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
      return getDatabase(instance, alias, session, existingLock, true);
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
  console.time('mkdirp and exists');
  let exists = false;
  try {
    // <https://github.com/nodejs/node/issues/38006>
    // const stats = await fs.promises.stat(readmeFilePath);
    console.time('execsync test');
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

    console.timeEnd('execsync test');
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    await mkdirp(dir);
  }
  console.timeEnd('mkdirp and exists');
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
    console.time('mounting');
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

    console.time('pWaitFor');
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
    console.timeEnd('pWaitFor');
    console.timeEnd('mounting');
  }
  */

  let db;
  let lock;

  try {
    // if server is shutting down then don't bother getting database
    if (!instance?.server?._handle) {
      const err = new TypeError('Server is shutting down');
      err.name = 'TimeoutError';
      throw err;
    }

    //
    // <https://github.com/WiseLibs/better-sqlite3/issues/1217>
    // <https://github.com/mattn/go-sqlite3/issues/274#issuecomment-1429010261>
    // <https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#:~:text=Transaction%20functions%20do,loop%20ticks%20anyways>
    //
    // check if we have in-memory existing opened database
    if (
      instance.databaseMap.has(alias.id) &&
      instance.databaseMap.get(alias.id).open === true &&
      instance.databaseMap.get(alias.id).readonly === false
    ) {
      db = instance.databaseMap.get(alias.id);
      session.db = db;
      return db;
    }

    db = new Database(dbFilePath, {
      readonly,
      fileMustExist: readonly,
      timeout: config.busyTimeout,
      // <https://github.com/WiseLibs/better-sqlite3/issues/217#issuecomment-456535384>
      verbose: config.env === 'production' ? null : console.log
    });

    // store in-memory open connection
    instance.databaseMap.set(alias.id, db);

    if (!db.lock) {
      db.lock = existingLock;
    }

    await setupPragma(db, session); // takes about 30ms

    // assigns to session so we can easily re-use
    // (also used in allocateConnection in IMAP notifier)
    session.db = db;

    // if it is readonly then return early
    if (readonly) {
      return db;
    }

    if (!existingLock || existingLock?.success !== true)
      lock = await acquireLock(instance, db);

    //
    // NOTE: this logic can be removed in the future
    //       it is here to cleanup duplicate mailboxes (legacy bug)
    //       and fix an issue where idate was set incorrectly (legacy bug)
    //       note that these must come before schema operations (e.g. unique index constraints)
    //
    /*
    try {
      // since we didn't originally have "UNIQUE" constraint on "path"
      // we need to keep this in here for a while until we're sure it's fixed
      console.time('iterating over required paths');
      for (const path of REQUIRED_PATHS) {
        // eslint-disable-next-line no-await-in-loop
        const mailboxes = await Mailboxes.find(instance, session, {
          path
        });

        if (mailboxes.length > 1) {
          // merge together mailboxes without notifications for now
          // (assume user will close/reopen app at some point)
          for (const mailbox of mailboxes.slice(1)) {
            // eslint-disable-next-line no-await-in-loop
            await Messages.updateMany(
              instance,
              session,
              {
                mailbox: mailbox._id
              },
              {
                $set: {
                  mailbox: mailboxes[0]._id
                }
              },
              { lock: existingLock?.success ? existingLock : lock }
            );
            // eslint-disable-next-line no-await-in-loop
            await Mailboxes.deleteOne(
              instance,
              session,
              {
                _id: mailbox._id
              },
              { lock: existingLock?.success ? existingLock : lock }
            );
          }
        }
      }

      console.timeEnd('iterating over required paths');

      // for any idate values that were set from `new Date(false)`
      // (e.g. the value is `1970-01-01T00:00:00.000Z` which is incorrect)
      // we need to set the value of `idate` to the value of `hdate`
      {
        const messages = await Messages.find(instance, session, {
          idate: new Date(false)
        });
        for (const message of messages) {
          // eslint-disable-next-line no-await-in-loop
          await Messages.findOneAndUpdate(
            instance,
            session,
            {
              _id: message._id
            },
            {
              $set: {
                idate: message.hdate
              }
            },
            { lock: existingLock?.success ? existingLock : lock }
          );
        }
      }
    } catch (err) {
      err._stack = stack;
      err.session = session;

      if (
        err.code !== 'SQLITE_ERROR' ||
        !err.message.startsWith('no such table:')
      )
        logger.fatal(err, { session });
    }
    */

    let migrateCheck = false;
    let folderCheck = false;
    let trashCheck = false;

    if (instance.client) {
      try {
        const results = await instance.client.mget([
          `migrate_check:${session.user.alias_id}`,
          `folder_check:${session.user.alias_id}`,
          `trash_check:${session.user.alias_id}`
        ]);
        migrateCheck = boolean(results[0]);
        folderCheck = boolean(results[1]);
        trashCheck = boolean(results[2]);
      } catch (err) {
        logger.fatal(err);
      }
    }

    // migrate schema
    // TODO: add p-timeout to the client.get calls below
    if (!migrateCheck) {
      //
      // NOTE: if we change schema on db then we
      //       need to stop sqlite server then
      //       purge all migrate_check:* keys
      //
      const commands = await migrateSchema(db, session, {
        Mailboxes,
        Messages,
        Threads,
        Attachments,
        Calendars,
        CalendarEvents
      });

      if (commands.length > 0) {
        for (const command of commands) {
          try {
            // TODO: wsp here (?)
            db.prepare(command).run();
            // await knexDatabase.raw(command);
          } catch (err) {
            err.isCodeBug = true;
            logger.fatal(err, { command, alias, session });
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
                logger.fatal(err, { command, alias, session });
              }
            }
          }
        }
      }

      try {
        await instance.client.set(
          `migrate_check:${session.user.alias_id}`,
          true,
          'PX',
          ms('1d')
        );
      } catch (err) {
        logger.fatal(err);
      }
    }

    //
    // create initial folders for the user if they do not yet exist
    // (only do this once every day)
    //
    try {
      if (!folderCheck) {
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
                  lock: existingLock?.success ? existingLock : lock,

                  path,
                  // NOTE: this is the same uncommented code as `helpers/imap/on-create`
                  // TODO: support custom alias retention (would get stored on session)
                  // TODO: if user updates retention then we'd need to update in-memory IMAP connections
                  // retention: typeof alias.retention === 'number' ? alias.retention : 0
                  retention: 0
                });

                await instance.server.notifier.addEntries(
                  instance,
                  session,
                  mailbox,
                  {
                    command: 'CREATE',
                    mailbox: mailbox._id,
                    path
                  },
                  existingLock?.success ? existingLock : lock
                );
              } catch (err) {
                logger.fatal(err, { session });
              }
            })
          );
        }

        await instance.client.set(
          `folder_check:${session.user.alias_id}`,
          true,
          'PX',
          ms('1d')
        );
      }
    } catch (err) {
      logger.fatal(err, { session });
    }

    // release lock
    try {
      if (lock) {
        await releaseLock(instance, db, lock);
      }
    } catch (err) {
      logger.debug(err, { alias, session });
    }

    //
    // NOTE: we remove messages in Junk/Trash folder that are >= 30 days old
    //       (but we only do this once every day)
    try {
      if (!trashCheck) {
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

        const sql = builder.build({
          type: 'update',
          table: 'Messages',
          condition: {
            $or: [
              {
                mailbox: {
                  $in: mailboxes.map((m) => m._id.toString())
                },
                exp: 1,
                rdate: {
                  $lte: Date.now()
                }
              },
              {
                mailbox: {
                  $in: mailboxes.map((m) => m._id.toString())
                },
                rdate: {
                  $lte: dayjs().subtract(30, 'days').toDate().getTime()
                }
              }
            ]
          },
          modifier: {
            $set: {
              undeleted: false
            }
          }
        });

        db.prepare(sql.query).run(sql.values);

        await Promise.all(
          mailboxes.map((mailbox) =>
            onExpungePromise.call(
              instance,
              mailbox._id.toString(),
              { silent: true },
              session
            )
          )
        );

        await instance.client.set(
          `trash_check:${session.user.alias_id}`,
          true,
          'PX',
          ms('1d')
        );
      }
    } catch (err) {
      logger.fatal(err, { session });
    }

    if (!migrateCheck || !folderCheck || !trashCheck) {
      try {
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

    //
    // TODO: delete orphaned attachments (those without messages that reference them)
    //       (note this is unlikely as we already take care of this in EXPUNGE)
    //

    return db;
  } catch (err) {
    // in case developers are connected to it in SQLiteStudio (this will cause a read/write error)
    if (err.code === 'SQLITE_IOERR_SHORT_READ') {
      err.message +=
        '******************* PLEASE DISCONNECT FROM SQLiteStudio IF YOU ARE CONNECTED *************';
    }

    // release lock
    if (lock) {
      try {
        await releaseLock(instance, db, lock);
      } catch (err_) {
        logger.fatal(err_, { alias, session });
      }
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
    // eslint-disable-next-line complexity
    async onFailedAttempt(error) {
      const session = args[2];

      if (isTimeoutError(error)) {
        logger.fatal(error, { session });
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
          const dirName = path.dirname(error.dbFilePath);
          const ext = path.extname(error.dbFilePath);
          const basename = path.basename(error.dbFilePath, ext);

          await fs.promises.rm(error.dbFilePath, {
            force: true,
            recursive: true
          });

          for (const affix of AFFIXES) {
            const affixFilePath = path.join(
              dirName,
              `${basename}${affix}${ext}`
            );
            try {
              // eslint-disable-next-line no-await-in-loop
              await fs.promises.rm(affixFilePath, {
                force: true,
                recursive: true
              });
            } catch (err) {
              if (err.code !== 'ENOENT') {
                err.isCodeBug = true;
                logger.fatal(err);
              }
            }
          }

          // email admins of the renaming
          email({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `Database backup fix for ${session.user.username} (${session.user.alias_id})`
            },
            locals: {
              message: `<p>${
                error.dbFilePath
              }</p><hr /><pre><code>${JSON.stringify(
                error.stats,
                null,
                2
              )}</code></pre><pre><code>${JSON.stringify(
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
          logger.fatal(err, { session });
        }
      } else {
        logger.fatal(error, { session });
      }

      throw error;
    }
  });
}

module.exports = retryGetDatabase;
