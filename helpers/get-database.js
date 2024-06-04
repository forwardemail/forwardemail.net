/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// <https://github.com/knex/knex-schema-inspector/pull/146>
const Database = require('better-sqlite3-multiple-ciphers');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');
const pRetry = require('p-retry');

const parseErr = require('parse-err');
const Aliases = require('#models/aliases');
const Calendars = require('#models/calendars');
const CalendarEvents = require('#models/calendar-events');
const Attachments = require('#models/attachments');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const Threads = require('#models/threads');
const config = require('#config');
const env = require('#config/env');
const email = require('#helpers/email');
const getPathToDatabase = require('#helpers/get-path-to-database');
const isTimeoutError = require('#helpers/is-timeout-error');
const isValidPassword = require('#helpers/is-valid-password');
const logger = require('#helpers/logger');
const migrateSchema = require('#helpers/migrate-schema');
const setupPragma = require('#helpers/setup-pragma');
const { acquireLock, releaseLock } = require('#helpers/lock');
const { decrypt } = require('#helpers/encrypt-decrypt');

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
  // return early if the session.db was already assigned
  if (
    session.db &&
    (session.db instanceof Database || session.db.wsp) &&
    session.db.open === true
  )
    return session.db;

  // instance must be either IMAP, POP3, SQLite, or CalDAV
  if (
    !['IMAP', 'POP3', 'SQLite', 'CalDAV'].includes(
      instance?.constructor?.name
    ) &&
    HOSTNAME !== env.SQLITE_HOST
  )
    throw new TypeError(
      'Instance must be either IMAP, POP3, SQLite, or CalDAV'
    );

  // safeguard
  if (!mongoose.isObjectIdOrHexString(alias?.id))
    throw new TypeError('Alias ID missing');

  // safeguard
  if (!isSANB(session?.user?.password)) throw new TypeError('Password missing');

  // if true then `?mode=ro` will get appended below
  // <https://www.sqlite.org/c3ref/open.html>
  // <https://github.com/knex/knex/issues/1287>
  let readonly = true;
  if (instance?.constructor?.name === 'SQLite' || HOSTNAME === env.SQLITE_HOST)
    readonly = false;

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
    if (env.SQLITE_RCLONE_ENABLED && HOSTNAME === env.IMAP_HOST) {
      try {
        const stats = await fs.promises.stat(dbFilePath);
        if (stats.isFile()) exists = true;
      } catch (err) {
        err.isCodeBug = true; // hide error from end users
        if (err.code !== 'ENOENT') throw err;
      }
    }

    if (!exists) {
      if (instance?.constructor?.name === 'SQLite')
        throw new TypeError('IMAP or POP3 server instance required');

      if (
        instance?.wsp?.constructor?.name !== 'WebSocketAsPromised' &&
        (!instance?.wsp || !instance.wsp[Symbol.for('isWSP')]) &&
        !instance[Symbol.for('isWSP')]
      )
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
          const err = new TypeError(
            'Newly created and still having readonly issues'
          );
          err.alias = alias;
          err.session = session;
          err.dbFilePath = dbFilePath;
          logger.fatal(err, { alias, session });
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
    db = new Database(dbFilePath, {
      readonly,
      fileMustExist: readonly,
      timeout: config.busyTimeout,
      // <https://github.com/WiseLibs/better-sqlite3/issues/217#issuecomment-456535384>
      verbose: config.env === 'development' ? console.log : null
    });
    if (!db.lock) db.lock = existingLock;

    await setupPragma(db, session);

    // assigns to session so we can easily re-use
    // (also used in allocateConnection in IMAP notifier)
    session.db = db;

    // if it is readonly then return early
    if (readonly) return db;

    if (!existingLock || existingLock?.success !== true)
      lock = await acquireLock(instance, db);

    //
    // NOTE: this logic can be removed in the future
    //       it is here to cleanup duplicate mailboxes (legacy bug)
    //       and fix an issue where idate was set incorrectly (legacy bug)
    //       note that these must come before schema operations (e.g. unique index constraints)
    //
    try {
      // since we didn't originally have "UNIQUE" constraint on "path"
      // we need to keep this in here for a while until we're sure it's fixed
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
      if (
        err.code !== 'SQLITE_ERROR' ||
        !err.message.startsWith('no such table:')
      )
        logger.fatal(err, { session });
    }

    // migrate schema
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

    //
    // create initial folders for the user if they do not yet exist
    //
    try {
      const paths = await Mailboxes.distinct(instance, session, 'path', {});
      const required = [];
      for (const path of REQUIRED_PATHS) {
        if (!paths.includes(path)) required.push(path);
      }

      if (required.length > 0) {
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
                // virtual helper
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
    } catch (err) {
      logger.fatal(err, { session });
    }

    // remove messages in Junk/Trash folder that are >= 30 days old
    try {
      const mailboxes = await Mailboxes.find(instance, session, {
        path: {
          $in: ['Trash', 'Junk']
        },
        specialUse: {
          $in: ['\\Trash', '\\Junk']
        }
      });
      if (mailboxes.length === 0)
        throw new TypeError('Trash folder(s) do not exist');
      // NOTE: this does not support `prepareQuery` so you will need to convert _id -> id
      // (as we've done below by simply mapping and returning `id` vs `_id`)
      await Messages.deleteMany(instance, session, {
        mailbox: {
          $in: mailboxes.map((m) => m._id.toString())
        },
        exp: true,
        rdate: {
          $lte: Date.now()
        }
      });
    } catch (err) {
      logger.fatal(err, { session });
    }

    // TODO: delete orphaned attachments (those without messages that reference them)

    // release lock
    try {
      if (lock) await releaseLock(instance, db, lock);
    } catch (err) {
      logger.debug(err, { alias, session });
    }

    // if alias db size was 0 then we should update it
    /*
    try {
      const storageUsed = await Aliases.getStorageUsed({
        domain: new mongoose.Types.ObjectId(session.user.domain_id)
      });
      if (storageUsed === 0) {
        const size = await instance.wsp.request({
          action: 'size',
          timeout: ms('15s'),
          alias_id: alias.id
        });
        logger.debug('updating size', { size, alias, session });
      }
    } catch (err) {
      logger.fatal(err, { alias, session });
    }
    */

    return db;
  } catch (err) {
    // in case developers are connected to it in SQLiteStudio (this will cause a read/write error)
    if (err.code === 'SQLITE_IOERR_SHORT_READ')
      err.message +=
        '******************* PLEASE DISCONNECT FROM SQLiteStudio IF YOU ARE CONNECTED *************';

    // release lock
    if (lock) {
      try {
        await releaseLock(instance, db, lock);
      } catch (err) {
        logger.fatal(err, { alias, session });
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
  return pRetry(
    () => {
      return getDatabase(...args);
    },
    {
      retries: 2,
      minTimeout: ms('15s'),
      // eslint-disable-next-line complexity
      async onFailedAttempt(err) {
        if (err.code === 'SQLITE_BUSY' || err.code === 'SQLITE_LOCKED') return;
        if (isTimeoutError(err)) return;
        //
        // NOTE: we attempt to check if the password was valid
        //       and if so, then we run a backup, email it to the admin/user
        //       and then run a reset of the database with the valid password
        //       (edge case in case "rekey" operation does not succeed)
        //
        if (err.code === 'SQLITE_NOTADB' && err.dbFilePath && !err.readonly) {
          const session = args[2];
          try {
            //
            // check if password was valid
            //
            if (!session?.user?.alias_id) throw err;
            if (!session?.user?.password) throw err;
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
            if (!alias) throw err;
            if (!alias.user) throw err;
            if (alias.user[config.userFields.isBanned]) throw err;
            if (!alias.is_enabled) throw err;
            if (alias.name === '*') throw err;
            if (alias.name.startsWith('/')) throw err;

            // mirrors `helpers/on-auth.js`
            // (extra safeguard)
            if (!Array.isArray(alias.tokens) || alias?.tokens?.length === 0)
              throw err;

            // ensure that the token is valid
            let isValid = false;
            if (alias && Array.isArray(alias.tokens) && alias.tokens.length > 0)
              isValid = await isValidPassword(
                alias.tokens,
                decrypt(session.user.password)
              );
            if (!isValid) throw err;

            err.isCodeBug = true;
            err.message = `Password token valid for ${session.user.username} with alias ID ${session.user.alias_id}\n\n ${err.message}`;

            // check if file path was <= initial db size
            try {
              const stats = await fs.promises.stat(err.dbFilePath);
              if (!stats.isFile() || stats.size > config.INITIAL_DB_SIZE)
                throw err;
              err.stats = stats;
            } catch (err) {
              logger.debug(err);
              return;
            }

            //
            // remove db file and all related files
            //
            const dirName = path.dirname(err.dbFilePath);
            const ext = path.extname(err.dbFilePath);
            const basename = path.basename(err.dbFilePath, ext);

            await fs.promises.rm(err.dbFilePath, {
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
                  err.dbFilePath
                }</p><hr /><pre><code>${JSON.stringify(
                  err.stats,
                  null,
                  2
                )}</code></pre><pre><code>${JSON.stringify(
                  parseErr(err),
                  null,
                  2
                )}</code></pre>`
              }
            })
              .then()
              .catch((err) => logger.fatal(err));

            // return here so we can retry and it will re-create database
            return;
          } catch (_err) {
            // this should email admins via `isCodeBug` setting to `true`
            _err.message = `Password token valid for ${session.user.username} with alias ID ${session.user.alias_id}\n\n ${_err.message}`;
            _err.isCodeBug = true;
            _err.original_error = parseErr(err);
            logger.fatal(_err, { session });
          }
        }

        throw err;
      }
    }
  );
}

module.exports = retryGetDatabase;
