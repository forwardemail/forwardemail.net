/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const os = require('node:os');
const path = require('node:path');
const { createGzip } = require('node:zlib');
const { promisify } = require('node:util');

const Boom = require('@hapi/boom');
const Lock = require('ioredfour');
const _ = require('lodash');
const auth = require('basic-auth');
const dashify = require('dashify');
const hasha = require('hasha');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { WebSocketServer } = require('ws');
const { validate: uuidValidate } = require('uuid');
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
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const getDatabase = require('#helpers/get-database');
const getPathToDatabase = require('#helpers/get-path-to-database');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const { decrypt } = require('#helpers/encrypt-decrypt');

const PAYLOAD_ACTIONS = new Set(['setup', 'size', 'stmt', 'backup']);
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

  async listen(port = env.SQLITE_WEBSOCKET_PORT, host = '::', ...args) {
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
        // return early for ping/pong
        if (data && data.toString() === 'ping') return;

        let db;
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

          // NOTE: `this` is the sqlite instance
          if (payload.action !== 'setup')
            db = await getDatabase(
              this,
              // alias
              {
                id: payload.session.user.alias_id,
                storageLocation: payload.session.user.storage_location
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
                storageLocation: payload.session.user.storage_location
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
                  storageLocation: payload.session.user.storage_location
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

            // storage quota
            case 'size': {
              if (!_.isArray(payload.aliases) || payload.aliases.length === 0)
                throw new TypeError('Aliases missing');

              let size = 0;

              await Promise.all(
                payload.aliases.map(async (alias) => {
                  try {
                    // <https://github.com/nodejs/node/issues/38006>
                    const stats = await fs.promises.stat(
                      getPathToDatabase(alias)
                    );
                    if (stats.isFile() && stats.size > 0) size += stats.size;
                  } catch (err) {
                    if (err.code !== 'ENOENT') throw err;
                  }
                })
              );

              ws.send(
                safeStringify({
                  id: payload.id,
                  data: size
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

            // TODO: allow backups at anytime (prompt for pass)
            // TODO: change password (prompt for pass)
            // TODO: email notifications
            // TODO: send password info (both API and user endpoint)
            // TODO: admin alert when user creates new alias (and not via API)
            // TODO: admin alert when alias generated password changed
            // TODO: allow user to download from cloudflare R2 at anytime

            // TODO: add test
            case 'backup': {
              const tmp = path.join(os.tmpdir(), `${payload.id}.sqlite`);

              let backup;
              let err;

              // check how much space is remaining on storage location
              const storagePath = getPathToDatabase({
                id: payload.session.user.alias_id,
                storageLocation: payload.session.user.storage_location
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

              try {
                // create bucket on s3 if it doesn't already exist
                // <https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/>
                const bucket = `${config.env}-${dashify(
                  _.camelCase(payload.session.user.storage_location)
                )}`;

                const response = await S3.send(
                  new HeadBucketCommand({
                    Bucket: bucket
                  })
                );

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

                const key = `${payload.session.user.alias_id}.sqlite.gz`;

                // create backup
                await db.backup(tmp);
                backup = true;

                // calculate hash of file
                const hash = await hasha.fromFile(tmp, { algorithm: 'md5' });

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

                // console.log(
                //   await getSignedUrl(S3, new GetObjectCommand({Bucket: 'my-bucket-name', Key: 'dog.png'}), { expiresIn: 3600 })
                // )
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

            default: {
              throw new TypeError('Action not yet configured');
            }
          }

          db.close();
        } catch (err) {
          err.payload = payload;

          // delete err.payload.user.password (safeguard)
          if (err?.payload?.session?.user?.password)
            delete err.payload.session.user.password;

          err.data = data.toString();
          // at least early on we should get errors in advance
          err.isCodeBug = true;
          logger.fatal(err);
          if (db && db.open && typeof db.close === 'function') db.close();
          if (_.isPlainObject(payload) && uuidValidate(payload.id))
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
    }, 5000); // TODO: change this to 30s

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
