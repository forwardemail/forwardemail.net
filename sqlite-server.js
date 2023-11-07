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
const { promisify } = require('node:util');

const Boom = require('@hapi/boom');
const Database = require('better-sqlite3-multiple-ciphers');
const Lock = require('ioredfour');
const _ = require('lodash');
const auth = require('basic-auth');
const dashify = require('dashify');
const hasha = require('hasha');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { WebSocketServer } = require('ws');
// const { validate: uuidValidate } = require('uuid');
const prettyBytes = require('pretty-bytes');
const checkDiskSpace = require('check-disk-space').default;
const { Upload } = require('@aws-sdk/lib-storage');
const {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  HeadObjectCommand
  // PutObjectCommand
} = require('@aws-sdk/client-s3');

const Aliases = require('#models/aliases');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const getDatabase = require('#helpers/get-database');
const getPathToDatabase = require('#helpers/get-path-to-database');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const { decrypt } = require('#helpers/encrypt-decrypt');

const PAYLOAD_ACTIONS = new Set([
  'setup',
  'size',
  'stmt',
  'backup',
  'rekey',
  'reset'
]);
const STATEMENT_OPERATIONS = new Set(['prepare', 'run', 'get', 'all', 'pluck']);

const S3 = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  }
});

class SQLite {
  constructor(options = {}) {
    this.client = options.client;
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

    this.lock = new Lock({
      redis: this.client,
      namespace: 'imap_lock'
    });

    // this.wss = new WebSocketServer({ noServer: true, perMessageDeflate: true });
    this.wss = new WebSocketServer({ noServer: true });
    this.server = server;

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

      // eslint-disable-next-line complexity
      ws.on('message', async (data) => {
        ws.isAlive = true;

        // return early for ping/pong
        if (data && data.toString() === 'ping') return;

        let db;
        let lock;
        let payload;
        try {
          if (!data) throw new TypeError('Data missing');

          // request.socket.remoteAddress
          payload = JSON.parse(data);

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
          // if (!uuidValidate(payload.id))
          //   throw new TypeError('Payload id missing or invalid UUID');
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
              throw new TypeError(
                'Payload lock must be for the given alias session'
              );
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
          // size action does not require session payload
          // (since it just uses `fs.stat` - see below)
          //
          if (payload.action !== 'size') {
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
              throw new TypeError(
                'Payload domain name missing or invalid FQDN'
              );

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
            payload.action !== 'size'
          )
            db = await getDatabase(
              this,
              // alias
              {
                id: payload.session.user.alias_id,
                storage_location: payload.session.user.storage_location
              },
              payload.session,
              payload?.lock
            );

          // handle action
          switch (payload.action) {
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

              db = await getDatabase(
                this,
                // alias
                {
                  id: payload.session.user.alias_id,
                  storage_location: payload.session.user.storage_location
                },
                payload.session,
                payload?.lock
              );

              ws.send(
                safeStringify({
                  id: payload.id,
                  data: true
                })
              );
              break;
            }

            // TODO: include backups on R2 in this storage calculation
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
                    const stats = await fs.promises.stat(
                      getPathToDatabase(alias)
                    );
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

              ws.send(
                safeStringify({
                  id: payload.id,
                  data: {
                    size,
                    aliases
                  }
                })
              );
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
                throw new TypeError(
                  'Payload statement must have at least one key'
                );
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
                if (
                  typeof op[0] !== 'string' ||
                  !STATEMENT_OPERATIONS.has(op[0])
                )
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

              ws.send(
                safeStringify({
                  id: payload.id,
                  data: typeof data === 'undefined' ? null : data
                })
              );

              break;
            }

            // leverages `payload.new_password` to rekey existing
            case 'rekey': {
              lock = await db.acquireLock();
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
              const tmp = path.join(os.tmpdir(), `${payload.id}.sqlite`);
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

              ws.send(
                safeStringify({
                  id: payload.id,
                  data: true
                })
              );
              break;
            }

            case 'reset': {
              lock = await this.lock.waitAcquireLock(
                `${payload.session.user.alias_id}`,
                ms('5m'),
                ms('1m')
              );
              if (!lock.success)
                throw i18n.translateError('IMAP_WRITE_LOCK_FAILED');

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

              db = await getDatabase(
                this,
                // alias
                {
                  id: payload.session.user.alias_id,
                  storage_location: payload.session.user.storage_location
                },
                payload.session,
                lock
              );

              ws.send(
                safeStringify({
                  id: payload.id,
                  data: true
                })
              );
              break;
            }

            case 'backup': {
              // ensure payload.backup_at is a string and valid date
              if (!isSANB(payload.backup_at))
                throw new TypeError('Backup at date missing');

              if (!_.isDate(new Date(payload.backup_at)))
                throw new TypeError('Backup at invalid date');

              const tmp = path.join(os.tmpdir(), `${payload.id}.sqlite`);

              // only allow one backup at a time and once every hour
              const lock = await this.lock.waitAcquireLock(
                `${payload.session.user.alias_id}-backup`,
                ms('5s'),
                ms('1h')
              );

              if (!lock.success)
                throw i18n.translateError('IMAP_WRITE_LOCK_FAILED');

              let backup;
              let err;

              try {
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
                    `Needed ${prettyBytes(
                      spaceRequired
                    )} but only ${prettyBytes(diskSpace.free)} was available`
                  );

                // create bucket on s3 if it doesn't already exist
                // <https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/>
                const bucket = `${config.env}-${dashify(
                  _.camelCase(payload.session.user.storage_location)
                )}`;

                const key = `${payload.session.user.alias_id}.sqlite.gz`;

                let response;
                try {
                  response = await S3.send(
                    new HeadBucketCommand({
                      Bucket: bucket
                    })
                  );
                } catch (err) {
                  if (err.name !== 'NotFound') throw err;
                }

                if (response?.$metadata?.httpStatusCode !== 200) {
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
                backupDb.rekey(
                  Buffer.from(decrypt(payload.session.user.password))
                );
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
              if (backup) {
                try {
                  await fs.promises.unlink(tmp);
                } catch (err) {
                  logger.fatal(err);
                }
              }

              // release lock if any
              if (lock) {
                try {
                  const result = await this.lock.releaseLock(lock);
                  if (!result.success)
                    throw i18n.translateError('IMAP_RELEASE_LOCK_FAILED');
                } catch (err) {
                  logger.fatal(err);
                }
              }

              if (err) throw err;

              ws.send(
                safeStringify({
                  id: payload.id,
                  data: true
                })
              );
              break;
            }

            default: {
              throw new TypeError('Action not yet configured');
            }
          }

          if (lock) {
            this.lock
              .releaseLock(lock)
              .then((result) => {
                if (!result.success)
                  throw i18n.translateError('IMAP_RELEASE_LOCK_FAILED');
              })
              .catch((err) => logger.fatal(err));
          }

          if (db && db.open && typeof db.close === 'function') db.close();
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
            this.lock
              .releaseLock(lock)
              .then()
              .catch((err) => logger.fatal(err));
          }

          if (db && db.open && typeof db.close === 'function') db.close();

          // if (_.isPlainObject(payload) && uuidValidate(payload.id))
          if (_.isPlainObject(payload) && isSANB(payload.id))
            ws.send(
              safeStringify({
                id: payload.id,
                err: parseErr(err)
              })
            );
        }
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
