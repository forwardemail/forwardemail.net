/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { isIP } = require('node:net');
const { randomUUID } = require('node:crypto');

const { Headers, Splitter, Joiner } = require('mailsplit');

const Database = require('better-sqlite3-multiple-ciphers');
const _ = require('lodash');
const bytes = require('bytes');
const checkDiskSpace = require('check-disk-space').default;
const dashify = require('dashify');
const dayjs = require('dayjs-with-plugins');
const getStream = require('get-stream');
const hasha = require('hasha');
const intoStream = require('into-stream');
const ip = require('ip');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');
const pEvent = require('p-event');
const pMap = require('p-map');
const pWaitFor = require('p-wait-for');
const parseErr = require('parse-err');
const pify = require('pify');
const prettyBytes = require('pretty-bytes');
const safeStringify = require('fast-safe-stringify');
const { Builder } = require('json-sql');
const { Iconv } = require('iconv');
const {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  HeadObjectCommand
} = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { boolean } = require('boolean');
const { isEmail } = require('validator');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const SMTPError = require('#helpers/smtp-error');
const TemporaryMessages = require('#models/temporary-messages');
const config = require('#config');
const email = require('#helpers/email');
const encryptMessage = require('#helpers/encrypt-message');
const env = require('#config/env');
const getDatabase = require('#helpers/get-database');
const getFingerprint = require('#helpers/get-fingerprint');
const getPathToDatabase = require('#helpers/get-path-to-database');
const i18n = require('#helpers/i18n');
const isCodeBug = require('#helpers/is-code-bug');
const isTimeoutError = require('#helpers/is-timeout-error');
const logger = require('#helpers/logger');
const migrateSchema = require('#helpers/migrate-schema');
const parseRootDomain = require('#helpers/parse-root-domain');
const recursivelyParse = require('#helpers/recursively-parse');
const setupPragma = require('#helpers/setup-pragma');
const updateStorageUsed = require('#helpers/update-storage-used');
const { acquireLock, releaseLock } = require('#helpers/lock');
const { encoder, decoder } = require('#helpers/encoder-decoder');
const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');

const onAppend = require('#helpers/imap/on-append');
const onCopy = require('#helpers/imap/on-copy');
const onCreate = require('#helpers/imap/on-create');
const onDelete = require('#helpers/imap/on-delete');
const onExpunge = require('#helpers/imap/on-expunge');
const onFetch = require('#helpers/imap/on-fetch');
const onGetQuotaRoot = require('#helpers/imap/on-get-quota-root');
const onGetQuota = require('#helpers/imap/on-get-quota');
const onList = require('#helpers/imap/on-list');
const onLsub = require('#helpers/imap/on-lsub');
const onMove = require('#helpers/imap/on-move');
const onOpen = require('#helpers/imap/on-open');
const onRename = require('#helpers/imap/on-rename');
const onSearch = require('#helpers/imap/on-search');
const onStatus = require('#helpers/imap/on-status');
const onStore = require('#helpers/imap/on-store');
const onSubscribe = require('#helpers/imap/on-subscribe');
const onUnsubscribe = require('#helpers/imap/on-unsubscribe');

const onAppendPromise = pify(onAppend, { multiArgs: true });
const onCopyPromise = pify(onCopy, { multiArgs: true });
const onCreatePromise = pify(onCreate, { multiArgs: true });
const onDeletePromise = pify(onDelete, { multiArgs: true });
const onExpungePromise = pify(onExpunge, { multiArgs: true });
const onFetchPromise = pify(onFetch, { multiArgs: true });
const onGetQuotaRootPromise = pify(onGetQuotaRoot, { multiArgs: true });
const onGetQuotaPromise = pify(onGetQuota, { multiArgs: true });
const onListPromise = pify(onList, { multiArgs: true });
const onLsubPromise = pify(onLsub, { multiArgs: true });
const onMovePromise = pify(onMove, { multiArgs: true });
const onOpenPromise = pify(onOpen);
const onRenamePromise = pify(onRename, { multiArgs: true });
const onSearchPromise = pify(onSearch, { multiArgs: true });
const onStatusPromise = pify(onStatus, { multiArgs: true });
const onStorePromise = pify(onStore, { multiArgs: true });
const onSubscribePromise = pify(onSubscribe, { multiArgs: true });
const onUnsubscribePromise = pify(onUnsubscribe, { multiArgs: true });

const builder = new Builder();

const concurrency = os.cpus().length;

const IP_ADDRESS = ip.address();

const PAYLOAD_ACTIONS = new Set([
  'sync',
  'tmp',
  'setup',
  'vacuum',
  'size',
  'stmt',
  'backup',
  'rekey',
  'reset',

  'append',
  'copy',
  'create',
  'delete',
  'expunge',
  'fetch',
  'get_quota_root',
  'get_quota',
  'list',
  'lsub',
  'move',
  'open',
  'rename',
  'search',
  'status',
  'store',
  'subscribe',
  'unsubscribe'
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

// eslint-disable-next-line max-params
async function increaseRateLimiting(client, date, sender, root, byteLength) {
  const sizeKey = `imap_limit_size_${config.env}:${date}:${sender}`;
  const countKey = `imap_limit_count_${config.env}:${date}:${sender}`;
  const specificSizeKey = `imap_limit_size_${config.env}:${date}:${sender}:${root}`;
  const specificCountKey = `imap_limit_count_${config.env}:${date}:${sender}:${root}`;
  await client
    .pipeline()
    .incrby(sizeKey, byteLength)
    .incr(countKey)
    .incrby(specificSizeKey, byteLength)
    .incr(specificCountKey)
    // TODO: all ansible servers should be set to use utc timezone
    .pexpire(sizeKey, ms('1d'))
    .pexpire(countKey, ms('1d'))
    .pexpire(specificSizeKey, ms('1d'))
    .pexpire(specificCountKey, ms('1d'))
    .exec();
}

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
        logger.fatal(err, { command });
        // migration support in case existing rows
        if (
          err.message.includes(
            'Cannot add a NOT NULL column with default value NULL'
          ) &&
          command.endsWith(' NOT NULL')
        ) {
          try {
            tmpDb.prepare(command.replace(' NOT NULL', '')).run();
          } catch (err) {
            err.isCodeBug = true;
            logger.fatal(err, { command });
          }
        }
      }
    }
  }

  // release lock
  if (lock) {
    try {
      await releaseLock(this, tmpDb, lock);
    } catch (err) {
      logger.fatal(err, { payload });
    }
  }

  return tmpDb;
}

// eslint-disable-next-line complexity
async function parsePayload(data, ws) {
  const now = Date.now();

  let db;
  let lock;
  let payload;
  let response;
  try {
    if (!data) throw new TypeError('Data missing');

    // request.socket.remoteAddress
    payload = ws ? recursivelyParse(decoder.unpack(data)) : data;

    // if it took more than 5s to be received then we should alert admins
    if (payload.sent_at && now - payload.sent_at >= 5000) {
      const err = new TypeError(`Payload took >= 5s to be received`);
      err.payload = payload;
      logger.fatal(err);
    }

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
    if (ws && !isSANB(payload.id)) throw new TypeError('Payload id missing');

    if (!isSANB(payload.id)) payload.id = randomUUID();

    // action
    if (!isSANB(payload.action) || !PAYLOAD_ACTIONS.has(payload.action))
      throw new TypeError('Payload action missing or invalid');

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
      if (payload.action === 'size') {
        if (payload.lock.id !== payload?.alias_id)
          throw new TypeError(
            'Payload lock must be for the given alias session'
          );
      } else if (payload.lock.id !== payload?.session?.user?.alias_id) {
        throw new TypeError('Payload lock must be for the given alias session');
      }

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
      if (!mongoose.isObjectIdOrHexString(payload.session.user.domain_id)) {
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
      if (!mongoose.isObjectIdOrHexString(payload.session.user.alias_id))
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
      payload.action !== 'tmp' &&
      payload.action !== 'rekey'
    ) {
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
    }

    //
    // TODO: payload.storage_location should not be used as source of truth
    //       instead the latest from Aliases database should be used
    //       (e.g. `const alias = await Aliases.findOne(...)` and `alias.storage_location`
    //

    // handle action
    switch (payload.action) {
      // append
      case 'append': {
        const data = await onAppendPromise.call(
          this,
          payload.path,
          payload.flags,
          payload.date
            ? _.isDate(payload.date)
              ? payload.date
              : new Date(payload.date)
            : false,
          payload.raw,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // copy
      case 'copy': {
        const data = await onCopyPromise.call(
          this,
          null,
          payload.mailboxId,
          payload.update,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // create
      case 'create': {
        const data = await onCreatePromise.call(
          this,
          payload.path,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // delete
      case 'delete': {
        const data = await onDeletePromise.call(
          this,
          payload.path,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // expunge
      case 'expunge': {
        const data = await onExpungePromise.call(
          this,
          payload.mailboxId,
          payload.update,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // fetch
      case 'fetch': {
        const data = await onFetchPromise.call(
          this,
          payload.mailboxId,
          payload.options,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // get_quota_root
      case 'get_quota_root': {
        const data = await onGetQuotaRootPromise.call(
          this,
          payload.path,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // get_quota
      case 'get_quota': {
        const data = await onGetQuotaPromise.call(
          this,
          payload.path,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // list
      case 'list': {
        const data = await onListPromise.call(
          this,
          payload.query,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // lsub
      case 'lsub': {
        const data = await onLsubPromise.call(
          this,
          payload.query,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // move
      case 'move': {
        const data = await onMovePromise.call(
          this,
          payload.mailboxId,
          payload.update,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // open
      case 'open': {
        const data = await onOpenPromise.call(
          this,
          payload.path,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // rename
      case 'rename': {
        const data = await onRenamePromise.call(
          this,
          payload.path,
          payload.newPath,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // search
      case 'search': {
        const data = await onSearchPromise.call(
          this,
          payload.mailboxId,
          payload.options,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // status
      case 'status': {
        const data = await onStatusPromise.call(
          this,
          payload.path,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // store
      case 'store': {
        const data = await onStorePromise.call(
          this,
          payload.mailboxId,
          payload.update,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // subscribe
      case 'subscribe': {
        const data = await onSubscribePromise.call(
          this,
          payload.path,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // unsubscribe
      case 'unsubscribe': {
        const data = await onUnsubscribePromise.call(
          this,
          payload.path,
          payload.session
        );
        response = {
          id: payload.id,
          data
        };
        break;
      }

      // sync the user's temp mailbox to their current
      case 'sync': {
        let deleted = 0;

        let err;

        // only allow sync to occur once every 10s
        const cache = await this.client.get(
          `sync_check:${payload.session.user.alias_id}`
        );

        if (!cache) {
          // set cache so we don't sync twice at once
          await this.client.set(
            `sync_check:${payload.session.user.alias_id}`,
            true,
            'PX',
            ms('5m')
          );

          const tmpDb = await getTemporaryDatabase.call(this, payload);

          const sql = builder.build({
            table: 'TemporaryMessages',
            fields: [
              {
                expression: 'count(1)'
              }
            ]
          });

          const count = tmpDb.prepare(sql.query).pluck().get(sql.values);

          if (count > 0) {
            let hasMore = true;
            while (hasMore) {
              // set cache so we don't sync twice at once
              // eslint-disable-next-line no-await-in-loop
              await this.client.set(
                `sync_check:${payload.session.user.alias_id}`,
                true,
                'PX',
                ms('5m')
              );

              const sql = builder.build({
                type: 'select',
                table: 'TemporaryMessages',
                limit: 10
              });

              const messages = tmpDb.prepare(sql.query).all(sql.values);

              if (messages.length === 0) {
                hasMore = false;
                continue;
              }

              for (const m of messages) {
                try {
                  const message = syncConvertResult(TemporaryMessages, m);
                  //
                  // if one message fails then not all of them should
                  // (e.g. one might have an issue with `date` or `raw`)
                  //
                  // check that we have available space
                  const storagePath = getPathToDatabase({
                    id: payload.session.user.alias_id,
                    storage_location: payload.session.user.storage_location
                  });
                  const spaceRequired = Buffer.byteLength(message.raw) * 2;
                  // eslint-disable-next-line no-await-in-loop
                  const diskSpace = await checkDiskSpace(storagePath);
                  if (diskSpace.free < spaceRequired)
                    throw new TypeError(
                      `Needed ${prettyBytes(
                        spaceRequired
                      )} but only ${prettyBytes(diskSpace.free)} was available`
                    );

                  // eslint-disable-next-line no-await-in-loop
                  await onAppendPromise.call(
                    this,
                    'INBOX',
                    [],
                    message.date,
                    message.raw,
                    {
                      ..._.omit(payload.session, 'db'),
                      remoteAddress: message.remoteAddress,

                      // don't append duplicate messages
                      checkForExisting: true
                    }
                  );

                  // if successfully appended then delete from the database
                  const sql = builder.build({
                    type: 'remove',
                    table: 'TemporaryMessages',
                    condition: {
                      _id: m._id
                    }
                  });
                  tmpDb.prepare(sql.query).run(sql.values);
                  deleted++;
                } catch (_err) {
                  err = Array.isArray(_err) ? _err[0] : _err;
                  hasMore = false;
                  break;
                }
              }
            }
          }

          try {
            // run a checkpoint to copy over wal to db
            tmpDb.pragma('wal_checkpoint(PASSIVE)');
            // vacuum temporary database
            tmpDb.prepare('VACUUM').run();
          } catch (err) {
            logger.fatal(err, { payload });
          }

          // update storage
          try {
            await updateStorageUsed(payload.session.user.alias_id, this.client);
          } catch (err) {
            logger.fatal(err, { payload });
          }

          try {
            tmpDb.pragma('analysis_limit=400');
            tmpDb.pragma('optimize');
            tmpDb.close();
          } catch (err) {
            logger.fatal(err, { payload });
          }

          if (err) throw err;

          // update cache so we can try again in 10s
          await this.client.set(
            `sync_check:${payload.session.user.alias_id}`,
            true,
            'PX',
            ms('10s')
          );
        }

        response = {
          id: payload.id,
          data: deleted
        };
        break;
      }

      // store an inbound message from MX server
      // into temporary encrypted sqlite db
      case 'tmp': {
        // ensure payload.date is a string and valid date
        if (payload.date === undefined)
          throw new TypeError('Payload date missing');

        if (!_.isDate(new Date(payload.date)))
          throw new TypeError('Payload date is invalid');

        // ensure payload.raw is a buffer
        if (!Buffer.isBuffer(payload.raw))
          throw new TypeError('Payload raw is not a Buffer');

        // do not allow messages larger than 64 MB
        const byteLength = Buffer.byteLength(payload.raw);
        if (byteLength > SIXTY_FOUR_MB_IN_BYTES)
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
              a.id === undefined ||
              !mongoose.isObjectIdOrHexString(a.id) ||
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
          if (isFQDN(clientHostname)) {
            sender = parseRootDomain(clientHostname);
          }
        } catch (err) {
          logger.warn(err);
        }

        const date = new Date().toISOString().split('T')[0];

        //
        // parse headers from message
        //
        const splitter = new Splitter();
        const joiner = new Joiner();
        let headers;
        splitter.on('data', (data) => {
          if (data.type !== 'node' || data.root !== true) return;
          const headerLines = Buffer.concat(
            data._headersLines,
            data._headerlen
          );
          headers = new Headers(headerLines, { Iconv });
        });
        await getStream(intoStream(payload.raw).pipe(splitter).pipe(joiner));

        //
        // get fingerprint (somewhat CPU intensive since we're using raw message)
        // (arguments = `session`, `headers`, `body`, `useSender`)
        //
        const fingerprint = getFingerprint({}, headers, payload.raw);

        await pMap(
          payload.aliases,
          // eslint-disable-next-line complexity
          async (obj) => {
            try {
              const alias = await Aliases.findById(obj.id)
                .populate('domain', 'id name')
                .populate(
                  'user',
                  `id email ${config.userFields.isBanned} ${config.lastLocaleField}`
                )
                .select(
                  'id has_imap has_pgp public_key storage_location user is_enabled name domain'
                )
                .lean()
                .exec();

              if (!alias) throw new TypeError('Alias does not exist');

              if (!alias.user) throw new TypeError('User does not exist');

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

              const root = parseRootDomain(alias.domain.name);

              const session = {
                user: {
                  id: alias.id,
                  username: `${alias.name}@${alias.domain.name}`,
                  alias_id: alias.id,
                  alias_name: alias.name,
                  domain_id: alias.domain.id,
                  domain_name: alias.domain.name,
                  password: encrypt(env.API_SECRETS[0]),
                  storage_location: alias.storage_location,
                  alias_has_pgp: alias.has_pgp,
                  alias_public_key: alias.public_key,
                  locale: alias.user[config.lastLocaleField],
                  owner_full_email: alias.user.email
                }
              };

              // check quota
              const { isOverQuota, storageUsed } = await Aliases.isOverQuota(
                alias,
                0,
                this.client
              );

              if (isOverQuota) {
                const err = new TypeError(
                  `${
                    session.user.username
                  } has exceeded quota with ${prettyBytes(
                    storageUsed
                  )} storage used`
                );
                logger.fatal(err, { payload }); // send alert to admins
                throw new SMTPError(
                  i18n.translate(
                    'IMAP_MAILBOX_MESSAGE_EXCEEDS_QUOTA',
                    session.user.locale || i18n.config.defaultLocale,
                    session.user.username
                  ),
                  {
                    responseCode: 421
                  }
                );
              }

              const maxQuotaPerAlias = await Domains.getMaxQuota(
                alias.domain.id
              );
              const exceedsQuota = storageUsed + byteLength > maxQuotaPerAlias;

              if (exceedsQuota) {
                const err = new TypeError(
                  `${
                    session.user.username
                  } has exceeded quota with ${prettyBytes(
                    storageUsed
                  )} storage used`
                );
                logger.fatal(err, { payload }); // send alert to admins
                throw new SMTPError(
                  i18n.translate(
                    'IMAP_MAILBOX_MESSAGE_EXCEEDS_QUOTA',
                    session.user.locale || i18n.config.defaultLocale,
                    session.user.username
                  ),
                  {
                    responseCode: 421
                  }
                );
              }

              // don't rate limit our own servers
              if (
                payload.remoteAddress !== IP_ADDRESS &&
                sender !== env.WEB_HOST
              ) {
                //
                // TODO: this rate limiting logic needs to get moved to the MX server
                //       (but we should keep parity with key names and such)
                //       (moving it to MX server would prevent an unnecessary websocket request)
                //
                // 1) Senders that we consider to be "trusted" as a source of truth
                //    (e.g. gmail.com, microsoft.com, apple.com) are limited to sending 100 GB per day.
                // 2) Senders that are allowlisted are limited to sending 10 GB per day.
                // 3) All other Senders are limited to sending 1 GB and/or 1000 messages per day.
                // 4) We have a specific limit per Sender and yourdomain.com of 1 GB and/or 1000 messages daily.

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
                    if (size >= bytes('100GB')) {
                      const err = new SMTPError(
                        `${sender} limited to 100 GB with current of ${prettyBytes(
                          size
                        )} from ${count} messages`,
                        { responseCode: 421 }
                      );
                      err.payload = payload;
                      throw err;
                    }
                  } else {
                    const isAllowlisted = await this.client.get(
                      `allowlist:${sender}`
                    );
                    if (boolean(isAllowlisted)) {
                      // 2) Senders that are allowlisted are limited to sending 10 GB per day.
                      if (size >= bytes('10GB')) {
                        const err = new SMTPError(
                          `${sender} limited to 10 GB with current of ${prettyBytes(
                            size
                          )} from ${count} messages`,
                          { responseCode: 421 }
                        );
                        err.payload = payload;
                        throw err;
                      }
                      // 3) All other Senders are limited to sending 1 GB and/or 1000 messages per day.
                    } else if (size >= bytes('1GB') || count >= 1000) {
                      const err = new SMTPError(
                        `#3 ${sender} limited with current of ${prettyBytes(
                          size
                        )} from ${count} messages`,
                        { responseCode: 421 }
                      );
                      err.payload = payload;
                      throw err;
                    }
                  }
                } else if (size >= bytes('1GB') || count >= 1000) {
                  // 3) All other Senders are limited to sending 1 GB and/or 1000 messages per day.
                  const err = new SMTPError(
                    `#3 ${sender} limited with current of ${prettyBytes(
                      size
                    )} from ${count} messages`,
                    { responseCode: 421 }
                  );
                  err.payload = payload;
                  throw err;
                }

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

                if (specific.size >= bytes('1GB') || specific.count >= 1000) {
                  const err = new SMTPError(
                    `${sender} limited with current of ${prettyBytes(
                      specific.size
                    )} from ${specific.count} messages to ${root}`,
                    {
                      responseCode: 421
                    }
                  );
                  err.payload = payload;
                  throw err;
                }
              }

              // check that we have available space
              const storagePath = getPathToDatabase({
                id: alias.id,
                storage_location: alias.storage_location
              });
              const spaceRequired = byteLength * 2; // 2x to account for syncing
              const diskSpace = await checkDiskSpace(storagePath);
              if (diskSpace.free < spaceRequired)
                throw new TypeError(
                  `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
                    diskSpace.free
                  )} was available`
                );

              //
              // attempt to get in-memory password from IMAP servers
              //
              let fallback = true;
              try {
                this.client.publish('sqlite_auth_request', alias.id);
                const [, response] = await pEvent(this.subscriber, 'message', {
                  filter(args) {
                    const [channel, data] = args;
                    if (channel !== 'sqlite_auth_response' || !data) return;
                    try {
                      const { id } = JSON.parse(data);
                      return id === alias.id;
                    } catch {}
                  },
                  multiArgs: true,
                  timeout: ms('10s')
                });

                const user = JSON.parse(response);

                // since we use onAppend it re-uses addEntries
                // which notifies all connected imap users via EXISTS
                await onAppendPromise.call(
                  this,
                  'INBOX',
                  [],
                  _.isDate(payload.date)
                    ? payload.date
                    : new Date(payload.date),
                  payload.raw,
                  {
                    user: {
                      ...session.user,
                      password: user.password
                    },
                    remoteAddress: payload.remoteAddress,
                    resolvedRootClientHostname:
                      payload.resolvedRootClientHostname,
                    resolvedClientHostname: payload.resolvedClientHostname,
                    allowlistValue: payload.allowlistValue,

                    // don't emit wss.broadcast
                    selected: false,

                    // don't append duplicate messages
                    checkForExisting: true
                  }
                );

                // store that we don't need fallback
                fallback = false;

                //
                // increase rate limiting size and count
                //
                try {
                  await increaseRateLimiting(
                    this.client,
                    date,
                    sender,
                    root,
                    byteLength
                  );
                } catch (err) {
                  logger.fatal(err, { payload });
                }
              } catch (_err) {
                const err = Array.isArray(_err) ? _err[0] : _err;
                if (isTimeoutError(err)) {
                  logger.warn(err, { payload });
                } else {
                  logger.error(err, { payload });
                }
              }

              //
              // fallback to writing to temporary database storage
              //
              if (fallback) {
                const tmpDb = await getTemporaryDatabase.call(this, {
                  session
                });

                let err;

                try {
                  // check if fingerprint exists
                  const count = await TemporaryMessages.countDocuments(
                    this,
                    {
                      user: session.user,
                      db: tmpDb
                    },
                    {
                      fingerprint
                    }
                  );

                  // if already existed then return early
                  if (count > 0) return;

                  //
                  // note we don't need to do this logic above if a session was found in IMAP
                  // because the APPEND logic already has this built-in
                  //
                  if (
                    session.user.alias_has_pgp &&
                    session.user.alias_public_key
                  ) {
                    try {
                      // NOTE: encryptMessage won't encrypt message if it already is
                      payload.raw = await encryptMessage(
                        session.user.alias_public_key,
                        payload.raw
                      );
                      // unset pgp_error_sent_at if it was a date and more than 1h ago
                      Aliases.findOneAndUpdate(
                        {
                          _id: new mongoose.Types.ObjectId(
                            session.user.alias_id
                          ),
                          domain: new mongoose.Types.ObjectId(
                            session.user.domain_id
                          ),
                          pgp_error_sent_at: {
                            $exists: true,
                            $lte: dayjs().subtract(1, 'hour').toDate()
                          }
                        },
                        {
                          $unset: {
                            pgp_error_sent_at: 1
                          }
                        }
                      )
                        .then()
                        .catch((err) => this.logger.fatal(err, { payload }));
                    } catch (err) {
                      logger.fatal(err, { payload });
                      if (!isCodeBug(err)) {
                        // email alias user (only once a day as a reminder) if it was not a code bug
                        const now = new Date();
                        Aliases.findOneAndUpdate(
                          {
                            $and: [
                              {
                                _id: new mongoose.Types.ObjectId(
                                  session.user.alias_id
                                ),
                                domain: new mongoose.Types.ObjectId(
                                  session.user.domain_id
                                )
                              },
                              {
                                $or: [
                                  {
                                    pgp_error_sent_at: {
                                      $exists: false
                                    }
                                  },
                                  {
                                    pgp_error_sent_at: {
                                      $lte: dayjs().subtract(1, 'day').toDate()
                                    }
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            $set: {
                              pgp_error_sent_at: now
                            }
                          }
                        )
                          .then((alias) => {
                            if (!alias) return;
                            // send email here and if error occurred then unset
                            email({
                              template: 'alert',
                              message: {
                                to: session.user.owner_full_email,
                                cc: config.email.message.from,
                                subject: i18n.translate(
                                  'PGP_ENCRYPTION_ERROR',
                                  session.user.locale
                                )
                              },
                              locals: {
                                message: `<pre><code>${safeStringify(
                                  parseErr(err),
                                  null,
                                  2
                                )}</code></pre>`,
                                locale: session.user.locale
                              }
                            })
                              .then(() => {
                                Aliases.findOneAndUpdate(alias._id, {
                                  $set: {
                                    pgp_error_sent_at: new Date()
                                  }
                                })
                                  .then()
                                  .catch((err) =>
                                    this.logger.fatal(err, { payload })
                                  );
                              })
                              .catch((err) => {
                                this.logger.fatal(err, { payload });
                                Aliases.findOneAndUpdate(
                                  {
                                    _id: new mongoose.Types.ObjectId(
                                      session.user.alias_id
                                    ),
                                    domain: new mongoose.Types.ObjectId(
                                      session.user.domain_id
                                    ),
                                    pgp_error_sent_at: now
                                  },
                                  {
                                    $unset: {
                                      pgp_error_sent_at: 1
                                    }
                                  }
                                ).catch((err) =>
                                  this.logger.fatal(err, { payload })
                                );
                              });
                          })
                          .catch((err) => this.logger.fatal(err, { payload }));
                      }
                    }
                  }

                  // store temp message
                  await TemporaryMessages.create({
                    instance: this,
                    session: { user: session.user, db: tmpDb },
                    fingerprint,
                    date: _.isDate(payload.date)
                      ? payload.date
                      : new Date(payload.date),
                    raw: payload.raw,
                    remoteAddress: payload.remoteAddress
                  });

                  // run a checkpoint to copy over wal to db
                  tmpDb.pragma('wal_checkpoint(PASSIVE)');

                  // TODO: vacuum into instead (same for elsewhere)
                  // vacuum temporary database
                  tmpDb.prepare('VACUUM').run();

                  // update storage after temporary message created
                  try {
                    await updateStorageUsed(alias.id, this.client);
                  } catch (err) {
                    logger.fatal(err, { payload });
                  }

                  //
                  // increase rate limiting size and count
                  //
                  try {
                    await increaseRateLimiting(
                      this.client,
                      date,
                      sender,
                      root,
                      byteLength
                    );
                  } catch (err) {
                    logger.fatal(err, { payload });
                  }
                } catch (_err) {
                  err = _err;
                }

                try {
                  tmpDb.pragma('analysis_limit=400');
                  tmpDb.pragma('optimize');
                  tmpDb.close();
                } catch (err) {
                  logger.fatal(err, { payload });
                }

                if (err) throw err;
              }
            } catch (err) {
              logger.error(err, { payload });
              err.isCodeBug = isCodeBug(err);
              errors[`${obj.address}`] = JSON.parse(
                safeStringify(parseErr(err))
              );
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

        const maxQuotaPerAlias = await Domains.getMaxQuota(
          payload.session.user.domain_id
        );

        // slight 2x overhead for backups
        const spaceRequired = maxQuotaPerAlias * 2;

        if (diskSpace.free < spaceRequired)
          throw new TypeError(
            `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
              diskSpace.free
            )} was available`
          );

        // TODO: this should not fix database
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

        response = {
          id: payload.id,
          data: true
        };

        // update storage
        try {
          db.pragma('wal_checkpoint(PASSIVE)');
          await updateStorageUsed(payload.session.user.alias_id, this.client);
        } catch (err) {
          logger.fatal(err, { payload });
        }

        break;
      }

      case 'vacuum': {
        const alias = await Aliases.findOne({
          _id: new mongoose.Types.ObjectId(payload.session.user.alias_id),
          domain: new mongoose.Types.ObjectId(payload.session.user.domain_id)
        })
          .lean()
          .exec();

        if (!alias) throw new TypeError('Alias does not exist');

        // vacuum every 24 hours
        if (
          !_.isDate(alias.last_vacuum_at) ||
          new Date(alias.last_vacuum_at).getTime() <
            dayjs().subtract(1, 'day').toDate().getTime()
        ) {
          logger.debug('vacuuming', { alias });
          //
          // NOTE: we store this immediately instead of after success
          //       in case multiple connections are authenticated at the same time
          //       (e.g. multiple IMAP connections calling onAuth which invokes this)
          //       (it gets invoked from the "sync" payload action; see above)
          //
          // store when we last vacuumed database
          await Aliases.findOneAndUpdate(
            {
              _id: alias._id,
              domain: alias.domain
            },
            {
              $set: {
                last_vacuum_at: new Date()
              }
            }
          );

          // TODO: we should check that we have 2x space required
          // <https://www.theunterminatedstring.com/sqlite-vacuuming/>

          // lock database if not already locked
          if (!payload?.lock) lock = await acquireLock(this, db);

          // run a checkpoint to copy over wal to db
          db.pragma('wal_checkpoint(PASSIVE)');

          // TODO: vacuum into instead (same for elsewhere)
          // vacuum database
          db.prepare('VACUUM').run();
        } else {
          logger.debug('no vacuum to run', { alias });
        }

        response = {
          id: payload.id,
          data: true
        };
        break;
      }

      // updates storage_used for a specific alias by its id
      case 'size': {
        if (!isSANB(payload.alias_id))
          throw new TypeError('Payload alias ID missing');

        const size = await updateStorageUsed(payload.alias_id, this.client);
        response = {
          id: payload.id,
          data: size
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

        //
        // in case recursivelyParsed converted this, we should stringify it
        // (e.g. dates get converted and we need them as strings for SQLite insertion)
        //
        // NOTE: we could also exclude keys (e.g. "stmt" in an arg to recursively parse)
        //
        payload.stmt = JSON.parse(
          typeof payload.stmt === 'string'
            ? payload.stmt
            : JSON.stringify(payload.stmt)
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

      //
      // NOTE: rekeying is not supported in WAL mode
      //       <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/64>
      //       e.g. this results in "SqliteError: SQL logic error"
      //       `db.rekey(Buffer.from(decrypt(payload.new_password)));`
      //       `db.pragma(`rekey="${decrypt(payload.new_password)}"`);`
      //
      case 'rekey': {
        // leverages `payload.new_password` to rekey existing
        if (!isSANB(payload.new_password))
          throw new TypeError('New password missing');

        lock = await this.lock.waitAcquireLock(
          `${payload.session.user.alias_id}`,
          ms('1h'),
          ms('10s')
        );
        if (!lock.success) throw i18n.translateError('IMAP_WRITE_LOCK_FAILED');

        // check how much space is remaining on storage location
        const storagePath = getPathToDatabase({
          id: payload.session.user.alias_id,
          storage_location: payload.session.user.storage_location
        });
        const diskSpace = await checkDiskSpace(storagePath);
        const maxQuotaPerAlias = await Domains.getMaxQuota(
          payload.session.user.domain_id
        );

        let stats;
        try {
          // <https://github.com/nodejs/node/issues/38006>
          stats = await fs.promises.stat(storagePath);
          if (!stats.isFile())
            throw new TypeError(`${storagePath} was not a file`);
        } catch (err) {
          if (err.code !== 'ENOENT') {
            err.isCodeBug = true;
            throw err;
          }
        }

        // we calculate size of db x 2 (backup + tarball)
        const spaceRequired = Math.max(
          maxQuotaPerAlias * 2,
          stats && stats.size > 0 ? stats.size * 2 : 0
        );

        if (diskSpace.free < spaceRequired)
          throw new TypeError(
            `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
              diskSpace.free
            )} was available`
          );

        // check if file path was <= initial db size
        // (and if so then perform the same logic as in "reset")
        let reset = false;
        if (!stats || stats.size <= config.INITIAL_DB_SIZE) {
          try {
            await fs.promises.rm(storagePath, {
              force: true,
              recursive: true
            });
          } catch (err) {
            if (err.code !== 'ENOENT') {
              err.isCodeBug = true;
              throw err;
            }
          }

          reset = true;

          const dirName = path.dirname(storagePath);
          const ext = path.extname(storagePath);
          const basename = path.basename(storagePath, ext);

          for (const affix of ['-wal', '-shm']) {
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
                throw err;
              }
            }
          }

          // TODO: this should not fix database
          db = await getDatabase(
            this,
            // alias
            {
              id: payload.session.user.alias_id,
              storage_location: payload.session.user.storage_location
            },
            {
              ...payload.session,
              user: {
                ...payload.session.user,
                password: payload.new_password
              }
            },
            lock
          );
        } else {
          // TODO: this should not fix database
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
        }

        //
        // NOTE: if we're not resetting database then assume we want to do a backup
        //
        let err;
        if (!reset) {
          // create backup
          const tmp = path.join(
            path.dirname(storagePath),
            `${payload.session.user.alias_id}-${payload.id}-backup.sqlite`
          );

          //
          // NOTE: we don't use `backup` command and instead use `VACUUM INTO`
          //       because if a page is modified during backup, it has to start over
          //       <https://news.ycombinator.com/item?id=31387556>
          //       <https://github.com/benbjohnson/litestream.io/issues/56>
          //
          //       also, if we used `backup` then for a temporary period
          //       the database would be unencrypted on disk, and instead
          //       we use VACUUM INTO which keeps the encryption as-is
          //       <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927>
          //
          //       const results = await db.backup(tmp);
          //
          //       so instead we use the VACUUM INTO command with the `tmp` path
          //

          // run a checkpoint to copy over wal to db
          db.pragma('wal_checkpoint(PASSIVE)');

          // create backup
          const results = db.exec(`VACUUM INTO '${tmp}'`);

          logger.debug('results', { results });

          let backup = true;

          try {
            // open the backup and encrypt it
            const backupDb = await getDatabase(
              this,
              // alias
              {
                id: payload.session.user.alias_id,
                storage_location: payload.session.user.storage_location
              },
              payload.session,
              lock,
              false,
              tmp
            );

            // rekey the database with new password
            backupDb.pragma('wal_checkpoint(PASSIVE)');

            // ensure journal mode changed to delete so we can rekey database
            const journalModeResult = backupDb.pragma('journal_mode=DELETE', {
              simple: true
            });
            if (journalModeResult !== 'delete')
              throw new TypeError('Journal mode could not be changed');

            // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/91>
            backupDb.prepare('VACUUM').run();
            // backupDb.rekey(Buffer.from(decrypt(payload.new_password)));
            backupDb.pragma(`rekey="${decrypt(payload.new_password)}"`);

            //
            // NOTE: do not enable this again because if so it will create
            //       -wal and -shm files and corrupt the database
            //       `backupDb.pragma('journal_mode=WAL');`
            //
            //       (the next time the database is opened the journal mode will get switched to WAL)
            //

            // NOTE: VACUUM will persist the rekey operation and write to db
            // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/23#issuecomment-1152634207>
            backupDb.prepare('VACUUM').run();

            try {
              backupDb.pragma('analysis_limit=400');
              backupDb.pragma('optimize');
              backupDb.close();
            } catch (err) {
              logger.fatal(err, { payload });
            }

            // rename backup file (overwrites existing destination file)
            await fs.promises.rename(tmp, storagePath);
            backup = false;
            logger.debug('renamed', { tmp, storagePath });

            // remove the old -whm and -shm files
            const dirName = path.dirname(storagePath);
            const ext = path.extname(storagePath);
            const basename = path.basename(storagePath, ext);

            for (const affix of ['-wal', '-shm']) {
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
                  throw err;
                }
              }
            }
          } catch (_err) {
            err = _err;
          }

          // always do cleanup in case of errors
          if (backup) {
            try {
              await fs.promises.rm(tmp, {
                force: true,
                recursive: true
              });
            } catch (err) {
              logger.fatal(err, { payload });
            }
          }
        }

        // update storage
        try {
          await updateStorageUsed(payload.session.user.alias_id, this.client);
        } catch (err) {
          logger.fatal(err, { payload });
        }

        if (err) throw err;

        response = {
          id: payload.id,
          data: true
        };
        this.client.publish('sqlite_auth_reset', payload.session.user.alias_id);
        break;
      }

      case 'reset': {
        lock = await this.lock.waitAcquireLock(
          `${payload.session.user.alias_id}`,
          ms('15s'),
          ms('30s')
        );
        if (!lock.success) throw i18n.translateError('IMAP_WRITE_LOCK_FAILED');

        // check how much space is remaining on storage location
        const storagePath = getPathToDatabase({
          id: payload.session.user.alias_id,
          storage_location: payload.session.user.storage_location
        });
        const diskSpace = await checkDiskSpace(storagePath);

        // slight 2x overhead for backups
        const maxQuotaPerAlias = await Domains.getMaxQuota(
          payload.session.user.domain_id
        );
        const spaceRequired = maxQuotaPerAlias * 2;

        if (config.env !== 'development' && diskSpace.free < spaceRequired)
          throw new TypeError(
            `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
              diskSpace.free
            )} was available`
          );

        try {
          await fs.promises.rm(storagePath, {
            force: true,
            recursive: true
          });
        } catch (err) {
          if (err.code !== 'ENOENT') {
            err.isCodeBug = true;
            throw err;
          }
        }

        await Promise.all([
          this.client.del(`refresh_check:${payload.session.user.alias_id}`),
          this.client.del(`migrate_check:${payload.session.user.alias_id}`),
          this.client.del(`folder_check:${payload.session.user.alias_id}`),
          this.client.del(`trash_check:${payload.session.user.alias_id}`)
        ]);

        // TODO: don't allow getDatabase to perform a reset here
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

        // update storage
        try {
          db.pragma('wal_checkpoint(PASSIVE)');
          await updateStorageUsed(payload.session.user.alias_id, this.client);
        } catch (err) {
          logger.fatal(err, { payload });
        }

        response = {
          id: payload.id,
          data: true
        };

        this.client.publish('sqlite_auth_reset', payload.session.user.alias_id);
        break;
      }

      case 'backup': {
        if (!_.isDate(new Date(payload.backup_at)))
          throw new TypeError('Backup at invalid date');

        // only allow one backup a day
        const cache = await this.client.get(
          `backup_check:${payload.session.user.alias_id}`
        );

        if (!cache) {
          // set cache so we don't run two backups at once
          await this.client.set(
            `backup_check:${payload.session.user.alias_id}`,
            true,
            'PX',
            ms('1d')
          );

          // check when we actually did the last user backup
          const alias = await Aliases.findById(payload.session.user.alias_id)
            .lean()
            .exec();
          if (!alias) throw new TypeError('Alias does not exist');

          let runBackup = true;

          if (
            _.isDate(alias.imap_backup_at) &&
            // if it's less than 24h ago then we should not do another backup
            new Date(alias.imap_backup_at).getTime() >
              dayjs().subtract(1, 'day').toDate().getTime()
          )
            runBackup = false;

          if (runBackup) {
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
              tmp = path.join(
                path.dirname(storagePath),
                `${payload.id}-backup.sqlite`
              );

              // <https://github.com/nodejs/node/issues/38006>
              const stats = await fs.promises.stat(storagePath);
              if (
                !stats.isFile() ||
                stats.size === 0 ||
                stats.size <= config.INITIAL_DB_SIZE
              )
                throw new TypeError('Database empty');

              // we calculate size of db x 2 (backup + tarball)
              const spaceRequired = stats.size * 2;

              if (diskSpace.free < spaceRequired)
                throw new TypeError(
                  `Needed ${prettyBytes(spaceRequired)} but only ${prettyBytes(
                    diskSpace.free
                  )} was available`
                );

              //
              // ensure that we have the space required available in memory
              // (prevents multiple backups from taking up all of the memory on server)
              try {
                await pWaitFor(
                  () => {
                    return os.freemem() > spaceRequired;
                  },
                  {
                    interval: ms('30s'),
                    timeout: ms('10m')
                  }
                );
              } catch (err) {
                if (isTimeoutError(err)) {
                  err.message = `Backup not complete due to OOM for ${payload.session.user.username}`;
                  err.isCodeBug = true;
                }

                err.freemem = os.freemem();
                err.spaceRequired = spaceRequired;
                err.alias = alias.id;
                err.payload = payload;
                throw err;
              }

              // create bucket on s3 if it doesn't already exist
              // <https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/>
              const bucket = `${config.env}-${dashify(
                _.camelCase(payload.session.user.storage_location)
              )}`;

              const key = `${payload.session.user.alias_id}.sqlite`;

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

              //
              // NOTE: we don't use `backup` command and instead use `VACUUM INTO`
              //       because if a page is modified during backup, it has to start over
              //       <https://news.ycombinator.com/item?id=31387556>
              //       <https://github.com/benbjohnson/litestream.io/issues/56>
              //
              //       also, if we used `backup` then for a temporary period
              //       the database would be unencrypted on disk, and instead
              //       we use VACUUM INTO which keeps the encryption as-is
              //       <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927>
              //
              //       const results = await db.backup(tmp);
              //
              //       so instead we use the VACUUM INTO command with the `tmp` path
              //

              // run a checkpoint to copy over wal to db
              db.pragma('wal_checkpoint(PASSIVE)');

              // create backup
              // takes approx 5-10s per GB
              db.exec(`VACUUM INTO '${tmp}'`);

              backup = true;

              // open the backup to ensure that encryption still valid
              const backupDb = await getDatabase(
                this,
                // alias
                {
                  id: payload.session.user.alias_id,
                  storage_location: payload.session.user.storage_location
                },
                payload.session,
                null,
                false,
                tmp
              );

              try {
                backupDb.pragma('analysis_limit=400');
                backupDb.pragma('optimize');
                backupDb.close();
              } catch (err) {
                logger.fatal(err, { payload });
              }

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

              const upload = new Upload({
                client: S3,
                params: {
                  Bucket: bucket,
                  Key: key,
                  Body: fs.createReadStream(tmp),
                  Metadata: { hash }
                }
              });
              await upload.done();

              // update alias imap backup date using provided time
              await Aliases.findOneAndUpdate(
                {
                  _id: new mongoose.Types.ObjectId(
                    payload.session.user.alias_id
                  ),
                  domain: new mongoose.Types.ObjectId(
                    payload.session.user.domain_id
                  )
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
                await fs.promises.rm(tmp, {
                  force: true,
                  recursive: true
                });
              } catch (err) {
                logger.fatal(err, { payload });
              }
            }

            // if an error occurred then allow cache to attempt again
            // (but wait 30 minutes instead of 1 day)
            if (err) {
              this.client
                .set(
                  `backup_check:${payload.session.user.alias_id}`,
                  true,
                  'PX',
                  ms('30m')
                )
                .then()
                .catch((err) => logger.fatal(err, { payload }));
              if (err.message !== 'Database empty') throw err;
            }
          }
        }

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
        .catch((err) => logger.fatal(err, { payload }));
    }

    if (db && db.open && typeof db.close === 'function') {
      try {
        if (typeof db.pragma === 'function') {
          db.pragma('analysis_limit=400');
          db.pragma('optimize');
        }

        db.close();
      } catch (err) {
        logger.fatal(err, { payload });
      }
    }

    if (!ws) return response.data;

    ws.send(encoder.pack(response));
  } catch (_err) {
    // since we use multiArgs from pify
    // if a promise that was wrapped with multiArgs: true
    // throws, then the error will be an array so we need to get first key
    let err = _err;
    if (Array.isArray(err)) err = _err[0];

    err.payload = payload;

    // TODO: we can't do this because of object circular reference
    // delete err.payload.user.password (safeguard)
    // if (err?.payload?.session?.user?.password)
    //   delete err.payload.session.user.password;

    // at least early on we should get errors in advance
    err.isCodeBug = true;
    logger.fatal(err, { payload });

    if (lock) {
      releaseLock(this, db, lock)
        .then()
        .catch((err) => logger.fatal(err, { payload }));
    }

    if (db && db.open && typeof db.close === 'function') {
      try {
        db.pragma('analysis_limit=400');
        db.pragma('optimize');
        db.close();
      } catch (err) {
        logger.fatal(err, { payload });
      }
    }

    if (!ws || typeof ws.send !== 'function') throw err;

    if (_.isPlainObject(payload) && isSANB(payload.id)) {
      ws.send(
        encoder.pack({
          id: payload.id,
          // err: parseErr(err), // NOTE: results in RangeError: Maximum call stack size exceeded
          // err, // NOTE: we haven't tried this yet but still it could have a circular reference
          err: JSON.parse(safeStringify(parseErr(err)))
        })
      );
    }
  }
}

module.exports = parsePayload;
