/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const os = require('node:os');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { createGzip } = require('node:zlib');
const { isIP } = require('node:net');
const { promisify } = require('node:util');
const { randomUUID } = require('node:crypto');

const Boom = require('@hapi/boom');
const Database = require('better-sqlite3-multiple-ciphers');
const Indexer = require('wildduck/imap-core/lib/indexer/indexer');
const Lock = require('ioredfour');
const MessageHandler = require('wildduck/lib/message-handler');
const _ = require('lodash');
const auth = require('basic-auth');
const bytes = require('bytes');
const checkDiskSpace = require('check-disk-space').default;
const dashify = require('dashify');
const hasha = require('hasha');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');
const pMap = require('p-map');
const parseErr = require('parse-err');
const pify = require('pify');
const prettyBytes = require('pretty-bytes');
const revHash = require('rev-hash');
const safeStringify = require('fast-safe-stringify');
const { isEmail } = require('validator');
const {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  HeadObjectCommand
} = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { WebSocketServer } = require('ws');
const { boolean } = require('boolean');

const Aliases = require('#models/aliases');
const AttachmentStorage = require('#helpers/attachment-storage');
const IMAPNotifier = require('#helpers/imap-notifier');
const SMTPError = require('#helpers/smtp-error');
const TemporaryMessages = require('#models/temporary-messages');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const getDatabase = require('#helpers/get-database');
const getPathToDatabase = require('#helpers/get-path-to-database');
const i18n = require('#helpers/i18n');
const isCodeBug = require('#helpers/is-code-bug');
const logger = require('#helpers/logger');
const migrateSchema = require('#helpers/migrate-schema');
const onAppend = require('#helpers/imap/on-append');
const parseRootDomain = require('#helpers/parse-root-domain');
const recursivelyParse = require('#helpers/recursively-parse');
const refreshSession = require('#helpers/refresh-session');
const setupPragma = require('#helpers/setup-pragma');
const storeNodeBodies = require('#helpers/store-node-bodies');
const { acquireLock, releaseLock } = require('#helpers/lock');
const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');

const onAppendPromise = pify(onAppend);

const concurrency = os.cpus().length;

const PAYLOAD_ACTIONS = new Set([
  'sync',
  'tmp',
  'setup',
  'size',
  'stmt',
  'backup',
  'rekey',
  'reset'
]);
const STATEMENT_OPERATIONS = new Set(['prepare', 'run', 'get', 'all', 'pluck']);

const SIXTY_FOUR_MB_IN_BYTES = bytes('64MB');

const S3 = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  }
});

async function getTemporaryDatabase(payload) {
  // TODO: check disk space here (2x existing tmp db size)
  const storagePath = getPathToDatabase({
    id: payload.session.user.alias_id,
    storage_location: payload.session.user.storage_location
  });

  const filePath = path.join(
    path.dirname(storagePath),
    `${payload.session.user.alias_id}-tmp.sqlite`
  );

  const tmpDb = new Database(filePath, {
    // if the db wasn't found it means there wasn't any mail
    // fileMustExist: true,
    timeout: config.busyTimeout,
    // <https://github.com/WiseLibs/better-sqlite3/issues/217#issuecomment-456535384>
    verbose: config.env === 'development' ? console.log : null
  });

  const tmpSession = {
    ...payload.session,
    user: {
      ...payload.session.user,
      password: encrypt(env.API_SECRETS[0])
    }
  };

  await setupPragma(tmpDb, tmpSession);

  // migrate schema
  const commands = await migrateSchema(tmpDb, tmpSession, {
    TemporaryMessages
  });

  const lock = await acquireLock(this, tmpDb);

  if (commands.length > 0) {
    for (const command of commands) {
      try {
        // TODO: wsp here (?)
        tmpDb.prepare(command).run();
        // await knexDatabase.raw(command);
      } catch (err) {
        err.isCodeBug = true;
        // eslint-disable-next-line no-await-in-loop
        await logger.fatal(err, { command });
      }
    }
  }

  // release lock
  try {
    await releaseLock(this, tmpDb, lock);
  } catch (err) {
    logger.fatal(err);
  }

  return tmpDb;
}

// eslint-disable-next-line complexity
async function parsePayload(data, ws) {
  // return early for ping/pong
  if (data && data.toString() === 'ping') return;

  let db;
  let lock;
  let payload;
  let response;
  try {
    if (!data) throw new TypeError('Data missing');

    // request.socket.remoteAddress
    payload = ws ? recursivelyParse(data) : data;

    //
    // validate payload
    // - id (uuid)
    // - lock (must be a lock object)
    // - action (str, enum)
    // - session = {}
    // - session.user = {}
    // - session.user.domain_id (bson object id, validated with helper)
    // - session.user.domain_name (string, fqdn)
    // - session.user.alias_id (bson object id, validated with helper)
    // - session.user.alias_name (string)
    // - session.user.password (valid password for alias)
    //
    if (!_.isPlainObject(payload))
      throw new TypeError('Payload must be plain Object');

    // id
    // <https://github.com/nodejs/node/issues/46748>
    if (!isSANB(payload.id)) throw new TypeError('Payload id missing');

    // if lock was passed it must be valid
    if (_.isPlainObject(payload.lock)) {
      // lock.id (string, type?)
      // lock.success (boolean = true)
      // index (number)
      // ttl (number)
      if (
        Object.keys(payload.lock).sort().join(' ') !==
        ['id', 'success', 'index', 'ttl'].sort().join(' ')
      )
        throw new TypeError('Payload lock has extra properties');
      if (!isSANB(payload.lock.id))
        throw new TypeError('Payload lock must be a string');
      // lock id must be equal to session user alias id
      if (payload.lock.id !== payload?.session?.user?.alias_id)
        throw new TypeError('Payload lock must be for the given alias session');
      if (typeof payload.lock.success !== 'boolean')
        throw new TypeError('Payload lock success must be a boolean');
      if (payload.lock.success === false)
        throw new TypeError('Payload lock was unsuccessful');
      if (!Number.isFinite(payload.lock.index))
        throw new TypeError('Payload lock index was invalid');
      if (!Number.isFinite(payload.lock.ttl))
        throw new TypeError('Payload lock TTL was invalid');
    } else {
      delete payload.lock;
    }

    // action
    if (!isSANB(payload.action) || !PAYLOAD_ACTIONS.has(payload.action))
      throw new TypeError('Payload action missing or invalid');

    //
    // neither size/tmp actions require session payload
    // (since it just uses `fs.stat` or writes to tmpDb - see below)
    //
    if (payload.action !== 'size' && payload.action !== 'tmp') {
      // session
      if (!_.isPlainObject(payload.session))
        throw new TypeError('Payload session must be plain Object');

      // session.user
      if (!_.isPlainObject(payload.session.user))
        throw new TypeError('Payload session user must be plain Object');

      // session.user.domain_id
      if (
        !isSANB(payload.session.user.domain_id) ||
        !mongoose.Types.ObjectId.isValid(payload.session.user.domain_id)
      ) {
        throw new TypeError(
          'Payload domain ID missing or invalid BSON ObjectId'
        );
      }

      // session.user.domain name
      if (
        !isSANB(payload.session.user.domain_name) ||
        !isFQDN(payload.session.user.domain_name)
      )
        throw new TypeError('Payload domain name missing or invalid FQDN');

      // session.user.alias_id
      if (
        !isSANB(payload.session.user.alias_id) ||
        !mongoose.Types.ObjectId.isValid(payload.session.user.alias_id)
      )
        throw new TypeError(
          'Payload alias ID missing or invalid BSON ObjectId'
        );

      // session.user.alias_name
      if (!isSANB(payload.session.user.alias_name))
        throw new TypeError('Payload alias name missing');

      // password
      if (!isSANB(payload.session.user.password))
        throw new TypeError('Payload password missing');

      // storage location
      if (!isSANB(payload.session.user.storage_location))
        throw new TypeError('Payload storage location missing');
    }

    // NOTE: `this` is the sqlite instance
    if (
      payload.action !== 'setup' &&
      payload.action !== 'reset' &&
      payload.action !== 'size' &&
      payload.action !== 'tmp'
    ) {
      const databases = await getDatabase(
        this,
        // alias
        {
          id: payload.session.user.alias_id,
          storage_location: payload.session.user.storage_location
        },
        payload.session,
        payload?.lock
      );
      db = databases.db;
    }

    //
    // TODO: payload.storage_location should not be used as source of truth
    //       instead the latest from Aliases database should be used
    //       (e.g. `const alias = await Aliases.findOne(...)` and `alias.storage_location`
    //

    // handle action
    switch (payload.action) {
      // sync the user's temp mailbox to their current
      case 'sync': {
        const tmpDb = await getTemporaryDatabase.call(this, payload);

        let count = 0;

        // copy and purge messages
        try {
          const messages = await TemporaryMessages.find(
            this,
            { user: payload.session.user, db: tmpDb },
            {}
          );

          for (const message of messages) {
            //
            // if one message fails then not all of them should
            // (e.g. one might have an issue with `date` or `raw`)
            //
            try {
              // check that we have available space
              const storagePath = getPathToDatabase({
                id: payload.session.user.alias_id,
                storage_location: payload.session.user.storage_location
              });
              const spaceRequired = Buffer.byteLength(message.raw);
              // eslint-disable-next-line no-await-in-loop
              const diskSpace = await checkDiskSpace(storagePath);
              if (diskSpace.free < spaceRequired)
                throw new TypeError(
                  `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
                    diskSpace.free
                  )} was available`
                );

              // eslint-disable-next-line no-await-in-loop
              const results = await onAppendPromise.call(
                this,
                'INBOX',
                [],
                message.date,
                message.raw,
                {
                  ..._.omit(payload.session, 'db'),
                  remoteAddress: message.remoteAddress
                }
              );

              count++;

              logger.debug('results', { results });

              // if successfully appended then delete from the database
              // eslint-disable-next-line no-await-in-loop
              await TemporaryMessages.deleteOne(
                this,
                { user: payload.session.user, db: tmpDb },
                { _id: message._id }
              );
            } catch (err) {
              logger.fatal(err);
            }
          }
        } catch (err) {
          logger.fatal(err);
        }

        tmpDb.close();

        response = {
          id: payload.id,
          data: count
        };
        break;
      }

      // store an inbound message from MX server
      // into temporary encrypted sqlite db
      case 'tmp': {
        // ensure payload.date is a string and valid date
        if (!isSANB(payload.date)) throw new TypeError('Payload date missing');

        if (!_.isDate(new Date(payload.date)))
          throw new TypeError('Payload date is invalid');

        // ensure payload.raw is a buffer
        if (!Buffer.isBuffer(payload.raw))
          throw new TypeError('Payload raw is not a Buffer');

        // do not allow messages larger than 64 MB
        if (Buffer.byteLength(payload.raw) > SIXTY_FOUR_MB_IN_BYTES)
          throw i18n.translateError('IMAP_MESSAGE_SIZE_EXCEEDED');

        // ensure remote address is an IP
        if (
          typeof payload.remoteAddress !== 'string' ||
          !isIP(payload.remoteAddress)
        )
          throw new TypeError('Payload remote address must be an IP');

        if (!_.isArray(payload.aliases) || payload.aliases.length === 0)
          throw new TypeError('Aliases missing');

        if (
          payload.aliases.some(
            (a) =>
              typeof a !== 'object' ||
              typeof a.id !== 'string' ||
              !mongoose.Types.ObjectId.isValid(a.id) ||
              typeof a.address !== 'string' ||
              !isEmail(a.address)
          )
        )
          throw new TypeError('Invalid aliases');

        if (
          _.uniqBy(payload.aliases, (a) => `${a.address}:${a.id}`).length !==
          payload.aliases.length
        )
          throw new TypeError('Duplicate aliases passed');

        // create the temporary message for each alias
        const errors = {};

        await pMap(
          payload.aliases,
          // eslint-disable-next-line complexity
          async (obj) => {
            try {
              const alias = await Aliases.findOne({ id: obj.id })
                .populate('domain', 'id name')
                .populate('user', config.userFields.isBanned)
                .select(
                  'id has_imap storage_location user is_enabled name domain'
                )
                .lean()
                .exec();

              if (!alias) throw new TypeError('Alias does not exist');

              // alias must not have banned user
              if (alias.user[config.userFields.isBanned])
                throw new TypeError('Alias user is banned');

              // alias must be enabled
              if (!alias.is_enabled) throw new TypeError('Alias is disabled');

              // alias must not be catch-all
              if (alias.name === '*')
                throw new TypeError('Alias cannot be a catch-all');

              // alias cannot be regex
              if (alias.name.startsWith('/'))
                throw new TypeError('Alias cannot be a regex');

              // alias must have IMAP
              if (!alias.has_imap)
                throw new TypeError('Alias does not have IMAP');

              // alias must have domain
              if (!alias.domain || !alias.domain.name)
                throw new TypeError('Alias does not have domain');

              const session = {
                user: {
                  id: alias.id,
                  username: `${alias.name}@${alias.domain.name}`,
                  alias_id: alias.id,
                  alias_name: alias.name,
                  domain_id: alias.domain.id,
                  domain_name: alias.domain.name,
                  password: encrypt(env.API_SECRETS[0]),
                  storage_location: alias.storage_location
                }
              };

              // check quota
              const quota = await Aliases.isOverQuota(this, session, 0, true);

              const exceedsQuota =
                quota.storageUsed + Buffer.byteLength(payload.raw) >
                config.maxQuotaPerAlias;

              if (exceedsQuota) {
                const err = new TypeError(
                  `${
                    session.user.username
                  } has exceeded quota with ${prettyBytes(
                    quota.storageUsed
                  )} storage used`
                );
                logger.fatal(err); // send alert to admins
                throw new SMTPError(
                  i18n.translate(
                    'IMAP_MAILBOX_MESSAGE_EXCEEDS_QUOTA',
                    'en',
                    session.user.username
                  ),
                  {
                    responseCode: 421
                  }
                );
              }

              //
              // rate limit the payload.remoteAddress from
              // sending more than 1 GB per day or 1000 messages per day
              // but attempt to use the reverse PTR root domain of the remoteAddress
              //
              let sender = payload.remoteAddress;
              try {
                const [clientHostname] = await this.resolver.reverse(
                  payload.remoteAddress
                );
                if (isFQDN(clientHostname)) sender = parseRootDomain(sender);
              } catch (err) {
                logger.warn(err);
              }

              //
              // TODO: this rate limiting logic needs to get moved to the MX server
              //       (but we should keep parity with key names and such)
              //       (moving it to MX server would prevent an unnecessary websocket request)
              //
              // 1) Senders that we consider to be "trusted" as a source of truth
              //    (e.g. gmail.com, microsoft.com, apple.com) are limited to sending 100 GB per day.
              // 2) Senders that are allowlisted are limited to sending 10 GB per day.
              // 3) All other Senders are limited to sending 1 GB and/or 300 messages per day.
              // 4) We have a specific limit per Sender and yourdomain.com of 1 GB and/or 1000 messages daily.

              const date = new Date().toISOString().split('T')[0];

              // check current size and message count for sender
              const [size, count] = await Promise.all(
                ['size', 'count'].map(async (kind) => {
                  const key = `imap_limit_${kind}_${config.env}:${date}:${sender}`;
                  const result = await this.client.incrby(key, 0);
                  // TODO: ttl should be milliseconds until end of day
                  //       (right now it will go until 24h after if 11:59pm for example)
                  await this.client.pexpire(key, ms('1d')); // TODO: all ansible servers should be set to use utc timezone
                  return result;
                })
              );

              if (isFQDN(sender)) {
                if (config.truthSources.has(sender)) {
                  // 1) Senders that we consider to be "trusted" as a source of truth
                  if (size >= bytes('100GB'))
                    throw new SMTPError(
                      `${sender} limited to 100 GB with current of ${prettyBytes(
                        size
                      )} from ${count} messages`,
                      { responseCode: 421 }
                    );
                } else {
                  const isAllowlisted = await this.client.get(
                    `allowlist:${sender}`
                  );
                  if (boolean(isAllowlisted)) {
                    // 2) Senders that are allowlisted are limited to sending 10 GB per day.
                    if (size >= bytes('10GB'))
                      throw new SMTPError(
                        `${sender} limited to 10 GB with current of ${prettyBytes(
                          size
                        )} from ${count} messages`,
                        { responseCode: 421 }
                      );
                    // 3) All other Senders are limited to sending 1 GB and/or 300 messages per day.
                  } else if (size >= bytes('1GB') || count >= 300) {
                    throw new SMTPError(
                      `#3 ${sender} limited with current of ${prettyBytes(
                        size
                      )} from ${count} messages`,
                      { responseCode: 421 }
                    );
                  }
                }
              } else if (size >= bytes('1GB') || count >= 300) {
                // 3) All other Senders are limited to sending 1 GB and/or 300 messages per day.
                throw new SMTPError(
                  `#3 ${sender} limited with current of ${prettyBytes(
                    size
                  )} from ${count} messages`,
                  { responseCode: 421 }
                );
              }

              const root = parseRootDomain(alias.domain.name);

              // 4) We have a specific limit per Sender and yourdomain.com of 1 GB and/or 1000 messages daily.
              const specific = await Promise.all(
                ['size', 'count'].map(async (kind) => {
                  const key = `imap_limit_${kind}_${config.env}:${date}:${sender}:${root}`;
                  const result = await this.client.incrby(key, 0);
                  // TODO: ttl should be milliseconds until end of day
                  //       (right now it will go until 24h after if 11:59pm for example)
                  await this.client.pexpire(key, ms('1d')); // TODO: all ansible servers should be set to use utc timezone
                  return result;
                })
              );

              if (specific.size >= bytes('1GB') || specific.count >= 1000)
                throw new SMTPError(
                  `${sender} limited with current of ${prettyBytes(
                    specific.size
                  )} from ${specific.count} messages to ${root}`,
                  {
                    responseCode: 421
                  }
                );

              // check that we have available space
              const storagePath = getPathToDatabase({
                id: alias.id,
                storage_location: alias.storage_location
              });
              const spaceRequired = Buffer.byteLength(payload.raw) * 2; // 2x to account for syncing
              const diskSpace = await checkDiskSpace(storagePath);
              if (diskSpace.free < spaceRequired)
                throw new TypeError(
                  `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
                    diskSpace.free
                  )} was available`
                );

              const tmpDb = await getTemporaryDatabase.call(this, {
                session
              });

              let err;

              try {
                await TemporaryMessages.create({
                  instance: this,
                  session: { user: session.user, db: tmpDb },
                  date: new Date(payload.date),
                  raw: payload.raw,
                  remoteAddress: payload.remoteAddress
                });

                //
                // increase rate limiting size and count
                //
                try {
                  const sizeKey = `imap_limit_size_${config.env}:${date}:${sender}`;
                  const countKey = `imap_limit_count_${config.env}:${date}:${sender}`;
                  const specificSizeKey = `imap_limit_size_${config.env}:${date}:${sender}:${root}`;
                  const specificCountKey = `imap_limit_count_${config.env}:${date}:${sender}:${root}`;

                  await Promise.all([
                    this.client.incrby(sizeKey, Buffer.byteLength(payload.raw)),
                    this.client.incrby(countKey, 1),
                    this.client.incrby(
                      specificSizeKey,
                      Buffer.byteLength(payload.raw)
                    ),
                    this.client.incrby(specificCountKey, 1)
                  ]);
                } catch (err) {
                  logger.fatal(err);
                }

                // TODO: we should leverage existing websocket and communicate
                //       directly to an open IMAP conenction to fetch the latest
                //       password in-memory and transmit it back and then
                //       we can leverage that to publish with modseq etc

                //
                // NOTE: we can't publish an event because we don't have mailbox/modseq
                //       so instead we rely on the IMAP connection polling for new messages
                //       (e.g. Thunderbird checks every 10m by default)
                //
                // setImmediate(() => {
                //   this.client.publish(IMAP_REDIS_CHANNEL_NAME, safeStringify({
                //     e: alias.id,
                //     p: { ... }
                //   }));
                // });
              } catch (_err) {
                err = _err;
              }

              tmpDb.close();
              if (err) throw err;
            } catch (err) {
              logger.error(err);
              err.isCodeBug = isCodeBug(err);
              errors[`${obj.address}`] =
                !ws || typeof ws.send !== 'function' ? err : parseErr(err);
            }
          },
          { concurrency }
        );

        response = {
          id: payload.id,
          data: errors
        };

        break;
      }

      // initial db setup for readonly imap servers
      case 'setup': {
        //
        // NOTE: this ensures we have enough space to
        //       add the new user to the storage location
        //

        // check how much space is remaining on storage location
        const storagePath = getPathToDatabase({
          id: payload.session.user.alias_id,
          storage_location: payload.session.user.storage_location
        });
        const diskSpace = await checkDiskSpace(storagePath);

        // slight 2x overhead for backups
        const spaceRequired = config.maxQuotaPerAlias * 2;

        if (diskSpace.free < spaceRequired)
          throw new TypeError(
            `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
              diskSpace.free
            )} was available`
          );

        const databases = await getDatabase(
          this,
          // alias
          {
            id: payload.session.user.alias_id,
            storage_location: payload.session.user.storage_location
          },
          payload.session,
          payload?.lock
        );

        db = databases.db;

        response = {
          id: payload.id,
          data: true
        };
        break;
      }

      // TODO: include backups on R2 + -tmp in this storage calculation
      //       (note the HTTP request will slow things down here; so we most likely want to use redis in the future)
      // storage quota
      case 'size': {
        if (!_.isArray(payload.aliases) || payload.aliases.length === 0)
          throw new TypeError('Aliases missing');

        let size = 0;

        const aliases = await Promise.all(
          payload.aliases.map(async (alias) => {
            try {
              // <https://github.com/nodejs/node/issues/38006>
              const stats = await fs.promises.stat(getPathToDatabase(alias));
              if (stats.isFile() && stats.size > 0) {
                size += stats.size;
                return {
                  ...alias,
                  size: stats.size
                };
              }
            } catch (err) {
              if (err.code !== 'ENOENT') throw err;
            }

            return {
              ...alias,
              size: 0
            };
          })
        );

        response = {
          id: payload.id,
          data: {
            size,
            aliases
          }
        };
        break;
      }

      // this assumes locking already took place
      case 'stmt': {
        // payload = {
        //   ...,
        //   stmt: [
        //     [
        //       'prepare',
        //       sql.query
        //     ],
        //     [
        //       'run',
        //       sql.values
        //     ]
        //   ]
        // }
        if (!_.isArray(payload.stmt))
          throw new TypeError('Payload statement missing');
        if (payload.stmt.length === 0)
          throw new TypeError('Payload statement must have at least one key');
        let stmt;
        let data;

        /*
        // NOTE: fts5 does't work due to this error:
        // TODO: investigate:
        //       SqliteError: database disk image is malformed
        //      at WebSocket.<anonymous> (/Users/user/Projects/web/sqlite-server.js:400:
        if (payload.stmt[0][1].includes('Messages_fts')) {
          console.log('MESSAGE FTS DETECTED', payload.stmt);
          console.log(
            'result',
            db.prepare('select * from Messages_fts').all()
          );
          console.log(
            'result2',
            db
              .prepare(
                `select * from Messages_fts where Messages_fts = 'test';`
              )
              .all()
          );
          const tables = db.pragma(`table_list(Messages_fts)`);
          console.log('tables', tables);
          console.log(
            'checking',
            db.pragma('integrity_check(Messages_fts)'),
            db.pragma('rebuild(Messages_fts)')
          );
        }
        */

        for (const op of payload.stmt) {
          // `op` must be an array with two keys
          if (!_.isArray(op)) throw new TypeError('Op must be an array');
          if (typeof op[0] !== 'string' || !STATEMENT_OPERATIONS.has(op[0]))
            throw new TypeError('Op must have valid function');
          switch (op[0]) {
            case 'prepare': {
              stmt = db.prepare(op[1]);
              break;
            }

            case 'pluck': {
              stmt.pluck(op[1] !== false);
              break;
            }

            case 'run':
            case 'get':
            case 'all': {
              data = stmt[op[0]](op[1]);

              break;
            }

            default: {
              throw new TypeError('Unknown operation');
            }
          }
        }

        response = {
          id: payload.id,
          data: typeof data === 'undefined' ? null : data
        };

        break;
      }

      // leverages `payload.new_password` to rekey existing
      case 'rekey': {
        lock = await acquireLock(this, db);
        if (!isSANB(payload.new_password))
          throw new TypeError('New password missing');
        //
        // NOTE: rekeying is not supported in WAL mode
        //       <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/64>
        //       e.g. this results in "SqliteError: SQL logic error"
        //       `db.rekey(Buffer.from(decrypt(payload.new_password)));`
        //       `db.pragma(`rekey="${decrypt(payload.new_password)}"`);`
        //
        // instead we will simply make a backup
        // and then remove the old db and then add the new db
        //

        // check how much space is remaining on storage location
        const storagePath = getPathToDatabase({
          id: payload.session.user.alias_id,
          storage_location: payload.session.user.storage_location
        });
        const diskSpace = await checkDiskSpace(storagePath);

        // <https://github.com/nodejs/node/issues/38006>
        const stats = await fs.promises.stat(storagePath);
        if (!stats.isFile() || stats.size === 0)
          throw new TypeError('Database empty');

        // we calculate size of db x 2 (backup + tarball)
        const spaceRequired = stats.size * 2;

        if (diskSpace.free < spaceRequired)
          throw new TypeError(
            `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
              diskSpace.free
            )} was available`
          );

        // create backup
        const tmp = path.join(
          path.dirname(storagePath),
          `${payload.id}.sqlite`
        );
        const results = await db.backup(tmp);
        let backup = true;

        let err;

        logger.debug('results', { results });

        try {
          // NOTE: if you change anything in here change `setupPragma`
          // open the backup and encrypt it
          const backupDb = new Database(tmp, {
            fileMustExist: true,
            timeout: config.busyTimeout,
            verbose: config.env === 'development' ? console.log : null
          });
          backupDb.pragma(`cipher='chacha20'`);
          backupDb.rekey(Buffer.from(decrypt(payload.new_password)));
          backupDb.close();

          // rename backup file (overwrites existing destination file)
          await fs.promises.rename(tmp, storagePath);
          backup = false;
          logger.debug('renamed', { tmp, storagePath });
        } catch (_err) {
          err = _err;
        }

        // always do cleanup in case of errors
        if (backup) {
          try {
            await fs.promises.unlink(tmp);
          } catch (err) {
            logger.fatal(err);
          }
        }

        if (err) throw err;

        response = {
          id: payload.id,
          data: true
        };
        break;
      }

      case 'reset': {
        lock = await this.lock.waitAcquireLock(
          `${payload.session.user.alias_id}`,
          ms('5m'),
          ms('1m')
        );
        if (!lock.success) throw i18n.translateError('IMAP_WRITE_LOCK_FAILED');

        // check how much space is remaining on storage location
        const storagePath = getPathToDatabase({
          id: payload.session.user.alias_id,
          storage_location: payload.session.user.storage_location
        });
        const diskSpace = await checkDiskSpace(storagePath);

        // slight 2x overhead for backups
        const spaceRequired = config.maxQuotaPerAlias * 2;

        if (diskSpace.free < spaceRequired)
          throw new TypeError(
            `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
              diskSpace.free
            )} was available`
          );

        try {
          await fs.promises.unlink(storagePath);
        } catch (err) {
          logger.fatal(err);
        }

        const databases = await getDatabase(
          this,
          // alias
          {
            id: payload.session.user.alias_id,
            storage_location: payload.session.user.storage_location
          },
          payload.session,
          lock
        );

        db = databases.db;

        response = {
          id: payload.id,
          data: true
        };
        break;
      }

      case 'backup': {
        // ensure payload.backup_at is a string and valid date
        if (!isSANB(payload.backup_at))
          throw new TypeError('Backup at date missing');

        if (!_.isDate(new Date(payload.backup_at)))
          throw new TypeError('Backup at invalid date');

        // only allow one backup at a time and once every hour
        const lock = await this.lock.waitAcquireLock(
          `${payload.session.user.alias_id}-backup`,
          ms('5m'),
          ms('1h')
        );

        if (!lock.success) throw i18n.translateError('IMAP_WRITE_LOCK_FAILED');

        let tmp;
        let backup;
        let err;

        try {
          // check how much space is remaining on storage location
          const storagePath = getPathToDatabase({
            id: payload.session.user.alias_id,
            storage_location: payload.session.user.storage_location
          });
          const diskSpace = await checkDiskSpace(storagePath);
          tmp = path.join(path.dirname(storagePath), `${payload.id}.sqlite`);

          // <https://github.com/nodejs/node/issues/38006>
          const stats = await fs.promises.stat(storagePath);
          if (!stats.isFile() || stats.size === 0)
            throw new TypeError('Database empty');

          // we calculate size of db x 2 (backup + tarball)
          const spaceRequired = stats.size * 2;

          if (diskSpace.free < spaceRequired)
            throw new TypeError(
              `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
                diskSpace.free
              )} was available`
            );

          // create bucket on s3 if it doesn't already exist
          // <https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/>
          const bucket = `${config.env}-${dashify(
            _.camelCase(payload.session.user.storage_location)
          )}`;

          const key = `${payload.session.user.alias_id}.sqlite.gz`;

          if (config.env !== 'test') {
            let res;
            try {
              res = await S3.send(
                new HeadBucketCommand({
                  Bucket: bucket
                })
              );
            } catch (err) {
              if (err.name !== 'NotFound') throw err;
            }

            if (res?.$metadata?.httpStatusCode !== 200) {
              try {
                await S3.send(
                  new CreateBucketCommand({
                    ACL: 'private',
                    Bucket: bucket
                  })
                );
              } catch (err) {
                if (err.name !== 'BucketAlreadyOwnedByYou') throw err;
              }
            }
          }

          // create backup
          const results = await db.backup(tmp);
          logger.debug('results', { results });
          backup = true;

          // NOTE: if you change anything in here change `setupPragma`
          // open the backup and encrypt it
          const backupDb = new Database(tmp, {
            fileMustExist: true,
            timeout: config.busyTimeout,
            verbose: config.env === 'development' ? console.log : null
          });
          backupDb.pragma(`cipher='chacha20'`);
          backupDb.rekey(Buffer.from(decrypt(payload.session.user.password)));
          backupDb.close();

          // calculate hash of file
          const hash = await hasha.fromFile(tmp, { algorithm: 'sha256' });

          // check if hash already exists in s3
          try {
            const obj = await S3.send(
              new HeadObjectCommand({
                Bucket: bucket,
                Key: key
              })
            );

            if (obj?.Metadata?.hash === hash)
              throw new TypeError('Hash already exists, returning early');
          } catch (err) {
            if (err.name !== 'NotFound') throw err;
          }

          // gzip the backup
          // await S3.send(
          //   new PutObjectCommand({
          //     ACL: 'private',
          //     Body: fs.createReadStream(tmp).pipe(createGzip()),
          //     Bucket: bucket,
          //     Key: key,
          //     Metadata: {
          //       hash
          //     }
          //   })
          // );
          const upload = new Upload({
            client: S3,
            params: {
              Bucket: bucket,
              Key: key,
              Body: fs.createReadStream(tmp).pipe(createGzip()),
              Metadata: { hash }
            }
          });
          await upload.done();

          // update alias imap backup date using provided time
          await Aliases.findOneAndUpdate(
            {
              id: payload.session.user.alias_id
            },
            {
              $set: {
                imap_backup_at: new Date(payload.backup_at)
              }
            }
          );
        } catch (_err) {
          err = _err;
        }

        // always do cleanup in case of errors
        if (tmp && backup) {
          try {
            await fs.promises.unlink(tmp);
          } catch (err) {
            logger.fatal(err);
          }
        }

        // release lock if any
        if (lock) {
          try {
            const result = await releaseLock(this, db, lock);
            if (!result.success)
              throw i18n.translateError('IMAP_RELEASE_LOCK_FAILED');
          } catch (err) {
            logger.fatal(err);
          }
        }

        if (err) throw err;

        response = {
          id: payload.id,
          data: true
        };
        break;
      }

      default: {
        throw new TypeError('Action not yet configured');
      }
    }

    if (lock) {
      releaseLock(this, db, lock)
        .then((result) => {
          if (!result.success)
            throw i18n.translateError('IMAP_RELEASE_LOCK_FAILED');
        })
        .catch((err) => logger.fatal(err));
    }

    if (db && db.open && typeof db.close === 'function') db.close();

    if (!ws || typeof ws.send !== 'function') return response;

    ws.send(safeStringify(response));
  } catch (err) {
    err.payload = payload;

    // delete err.payload.user.password (safeguard)
    if (err?.payload?.session?.user?.password)
      delete err.payload.session.user.password;

    err.data = data.toString();
    // at least early on we should get errors in advance
    err.isCodeBug = true;
    logger.fatal(err);

    if (lock) {
      releaseLock(this, db, lock)
        .then()
        .catch((err) => logger.fatal(err));
    }

    if (db && db.open && typeof db.close === 'function') db.close();

    if (!ws || typeof ws.send !== 'function') throw err;

    if (_.isPlainObject(payload) && isSANB(payload.id))
      ws.send(
        safeStringify({
          id: payload.id,
          err: parseErr(err)
        })
      );
  }
}

class SQLite {
  constructor(options = {}) {
    this.client = options.client;
    this.subscriber = options.subscriber;
    // TODO: this.wsp (?)
    this.resolver = createTangerine(this.client, logger);

    // start server with either http or https
    const server =
      config.env === 'production'
        ? https.createServer({
            key: fs.readFileSync(env.WEB_SSL_KEY_PATH),
            cert: fs.readFileSync(env.WEB_SSL_CERT_PATH),
            ca: fs.readFileSync(env.WEB_SSL_CA_PATH),
            // perfect forward secrecy
            // <https://github.com/nodemailer/wildduck/issues/541>
            dhparam:
              isSANB(env.WEB_SSL_DHPARAM_PATH) &&
              env.WEB_SSL_DHPARAM_PATH.toLowerCase() !== 'auto'
                ? fs.readFileSync(env.WEB_SSL_DHPARAM_PATH)
                : 'auto'
          })
        : http.createServer();

    //
    // bind helpers so we can re-use IMAP helper commands
    // (mirrored from `imap-server.js`)
    //
    // override logger
    this.logger = logger;
    server.logger = logger;
    server.loggelf = (...args) => logger.debug(...args);

    //
    // NOTE: it is using a lock under `wildduck` prefix
    // (to override set `this.attachmentStorage.storage.lock = new Lock(...)`)
    //
    this.attachmentStorage = new AttachmentStorage();

    this.indexer = new Indexer({ attachmentStorage: this.attachmentStorage });
    this.indexer.storeNodeBodies = storeNodeBodies.bind(this.indexer);

    // promisified version of prepare message from wildduck message handler
    this.prepareMessage = pify(
      MessageHandler.prototype.prepareMessage.bind({
        indexer: this.indexer,
        normalizeSubject: MessageHandler.prototype.normalizeSubject,
        generateIndexedHeaders: MessageHandler.prototype.generateIndexedHeaders
      })
    );

    //
    // the notifier is utilized in the IMAP connection (see `wildduck/imap-core/lib/imap-connection.js`)
    // in order to `getUpdates` and send them over the socket (e.g. `EXIST`, `EXPUNGE`, `FETCH`)
    // <https://github.com/nodemailer/wildduck/issues/509>
    //
    server.notifier = new IMAPNotifier({
      publisher: this.client,
      subscriber: this.subscriber
    });

    this.lock = new Lock({
      redis: this.client,
      namespace: 'imap_lock'
    });

    //
    // in test/development listen for locking and releasing
    // <https://github.com/nodemailer/ioredfour/blob/0bc1035c34c548b2d3058352c588dc20422cfb96/lib/ioredfour.js#L48-L49>
    //
    // if (config.env === 'development') {
    //   this.lock._redisSubscriber.on('message', (channel, message) => {
    //     logger.debug('lock message received', { channel, message });
    //   });
    // }

    // this.wss = new WebSocketServer({ noServer: true, perMessageDeflate: true });
    this.wss = new WebSocketServer({ noServer: true });
    this.server = server;
    this.refreshSession = refreshSession.bind(this);

    // instead of having a websocket we're focusing on performance since we're local to the fs
    // <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_hasinstance>
    this.wsp = {
      [Symbol.for('isWSP')]: true
    };
    this.wsp.request = async (data) => {
      try {
        if (typeof data?.action !== 'string')
          throw new TypeError('Action missing');

        // generate request id
        data.id = isSANB(data?.session?.user?.alias_id)
          ? `${revHash(data.session.user.alias_id)}:${revHash(randomUUID())}`
          : `${data.action}:${randomUUID()}`;

        const response = await parsePayload.call(this, data);
        return response.data;
      } catch (err) {
        logger.fatal(err);
        err.isCodeBug = true;
        throw err;
      }
    };

    // bind listen/close to this
    this.listen = this.listen.bind(this);
    this.close = this.close.bind(this);
  }

  async listen(port = env.SQLITE_PORT, host = '::', ...args) {
    function authenticate(request, socket, head, fn) {
      try {
        const credentials = auth(request);

        if (
          typeof credentials === 'undefined' ||
          typeof credentials.name !== 'string' ||
          !credentials.name
        )
          return fn(
            Boom.unauthorized(
              i18n.translateError('INVALID_API_CREDENTIALS', 'en')
            )
          );

        if (!env.API_SECRETS.includes(decrypt(credentials.name)))
          return fn(
            Boom.unauthorized(i18n.translateError('INVALID_API_TOKEN', 'en'))
          );

        fn();
      } catch (err) {
        err.isCodeBug = true;
        fn(err);
      }
    }

    function onSocketError(err) {
      logger.error(err);
    }

    this.server.on('upgrade', (request, socket, head) => {
      logger.debug('upgrade from %s', request.socket.remoteAddress);
      socket.on('error', onSocketError);

      authenticate(request, socket, head, (err) => {
        if (err) {
          socket.write(
            `HTTP/1.1 ${err?.output?.statusCode || 401} ${
              err?.output?.payload?.error || 'Unauthorized'
            }\r\n\r\n`
          );
          socket.destroy();
          return;
        }

        socket.removeListener('error', onSocketError);

        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.wss.emit('connection', ws, request);
        });
      });
    });

    this.wss.on('connection', (ws, request) => {
      ws.isAlive = true;
      logger.debug('connection from %s', request.socket.remoteAddress);

      ws.on('error', (err) => logger.error(err, { ws, request }));

      ws.on('pong', function () {
        // logger.debug('pong from %s', request.socket.remoteAddress);
        this.isAlive = true;
      });

      ws.on('message', function () {
        this.isAlive = true;
      });

      ws.on('message', (data) => {
        parsePayload.call(this, data, ws);
      });
    });

    const interval = setInterval(() => {
      for (const ws of this.wss.clients) {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
      }
    }, ms('35s'));

    this.wss.on('close', () => {
      clearInterval(interval);
    });

    await promisify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    // close websocket connections
    // if (this.wss && this.wss.clients) {
    //   for (const ws of this.wss.clients) {
    //     ws.terminate();
    //     ws.isAlive = false;
    //   }
    // }

    // close server
    try {
      await promisify(this.wss.close).bind(this.wss)();
    } catch (err) {
      logger.fatal(err);
    }

    await promisify(this.server.close).bind(this.server)();
  }
}

module.exports = SQLite;
