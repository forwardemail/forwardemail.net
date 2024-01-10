/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { createGzip } = require('node:zlib');
const { isIP } = require('node:net');
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
const parseErr = require('parse-err');
const pify = require('pify');
const prettyBytes = require('pretty-bytes');
const safeStringify = require('fast-safe-stringify');
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
const SMTPError = require('#helpers/smtp-error');
const TemporaryMessages = require('#models/temporary-messages');
const config = require('#config');
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
const { acquireLock, releaseLock } = require('#helpers/lock');
const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');

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

const concurrency = os.cpus().length;

const AFFIXES =
  config.env === 'test'
    ? ['-wal', '-shm']
    : ['-wal', '-shm', '-tmp', '-tmp-wal', '-tmp-shm'];

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
      payload.action !== 'tmp'
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
        const tmpDb = await getTemporaryDatabase.call(this, payload);

        // TODO: lock the temporary database

        let count = 0;

        // copy and purge messages
        try {
          const messages = await TemporaryMessages.find(
            this,
            { user: payload.session.user, db: tmpDb },
            {}
          );

          if (messages.length > 0) {
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
                    remoteAddress: message.remoteAddress
                  }
                );

                count++;

                // if successfully appended then delete from the database
                // eslint-disable-next-line no-await-in-loop
                await TemporaryMessages.deleteOne(
                  this,
                  { user: payload.session.user, db: tmpDb },
                  { _id: message._id }
                );

                // update storage
                try {
                  // eslint-disable-next-line no-await-in-loop
                  await this.wsp.request.call(this, {
                    action: 'size',
                    timeout: ms('5s'),
                    alias_id: payload.session.user.alias_id,
                    lock: payload?.lock
                  });
                } catch (err) {
                  err.isCodeBug = true;
                  this.logger.fatal(err, { payload });
                }
              } catch (_err) {
                const err = Array.isArray(_err) ? _err[0] : _err;
                err.isCodeBug = true;
                logger.fatal(err, { payload });
              }
            }
          }
        } catch (err) {
          err.isCodeBug = true;
          logger.fatal(err, { payload });
        }

        // run a checkpoint to copy over wal to db
        tmpDb.pragma('wal_checkpoint(PASSIVE)');

        // TODO: vacuum into instead (same for elsewhere)
        // vacuum temporary database
        tmpDb.prepare('VACUUM').run();

        // TODO: unlock the temporary database

        tmpDb.pragma('optimize');
        tmpDb.close();

        // vacuum database
        await this.wsp.request.call(this, {
          action: 'vacuum',
          timeout: ms('5m'),
          session: { user: payload.session.user }
        });

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
        const fingerprint = getFingerprint({}, headers, payload.raw, false);

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
                alias
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

              const exceedsQuota =
                storageUsed + byteLength > config.maxQuotaPerAlias;

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
                // 3) All other Senders are limited to sending 1 GB and/or 300 messages per day.
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
                      // 3) All other Senders are limited to sending 1 GB and/or 300 messages per day.
                    } else if (size >= bytes('1GB') || count >= 300) {
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
                } else if (size >= bytes('1GB') || count >= 300) {
                  // 3) All other Senders are limited to sending 1 GB and/or 300 messages per day.
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
              const spaceRequired = payload.raw * 2; // 2x to account for syncing
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
                  timeout: ms('5s')
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
                    resolvedClientHostname: payload.resolvedClientHostname,
                    allowlistValue: payload.allowlistValue
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

                  // update storage after temporary message created
                  try {
                    await this.wsp.request.call(this, {
                      action: 'size',
                      timeout: ms('5s'),
                      alias_id: alias.id,
                      lock: payload?.lock
                    });
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

                tmpDb.pragma('optimize');
                tmpDb.close();
                if (err) throw err;
              }
            } catch (err) {
              logger.error(err, { payload });
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
          await this.wsp.request.call(this, {
            action: 'size',
            timeout: ms('5s'),
            alias_id: payload.session.user.alias_id,
            lock: payload?.lock
          });
        } catch (err) {
          this.logger.fatal(err, { payload });
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
        }

        response = {
          id: payload.id,
          data: true
        };
        break;
      }

      // updates storage_used for a specific alias by its id
      case 'size': {
        if (!mongoose.isObjectIdOrHexString(payload.alias_id))
          throw new TypeError('Alias ID missing');

        const alias = await Aliases.findById(payload.alias_id)
          .select('id storage_location')
          .lean()
          .exec();

        if (alias) {
          let size = 0;

          try {
            // <https://github.com/nodejs/node/issues/38006>
            const filePath = getPathToDatabase(alias);
            const dirName = path.dirname(filePath);
            const ext = path.extname(filePath);
            const basename = path.basename(filePath, ext);
            // $id.sqlite
            const stats = await fs.promises.stat(filePath);
            if (stats.isFile() && stats.size > 0) {
              size += stats.size;
              // $id-wal.sqlite
              // $id-shm.sqlite
              // $id-tmp.sqlite
              // $id-tmp-wal.sqlite
              // $id-tmp-shm.sqlite
              for (const affix of AFFIXES) {
                const affixFilePath = path.join(
                  dirName,
                  `${basename}${affix}${ext}`
                );
                try {
                  // eslint-disable-next-line no-await-in-loop
                  const stats = await fs.promises.stat(affixFilePath);
                  if (stats.isFile() && stats.size > 0) {
                    size += stats.size;
                  }
                } catch (err) {
                  if (err.code !== 'ENOENT') throw err;
                }
              }
            }
          } catch (err) {
            if (err.code !== 'ENOENT') throw err;
          }

          // save storage_used on the given alias
          await Aliases.findByIdAndUpdate(payload.alias_id, {
            $set: {
              storage_used: size
            }
          });

          response = {
            id: payload.id,
            data: size
          };
          break;
        } else {
          response = {
            id: payload.id,
            data: 0
          };
          break;
        }
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

        // in case recursivelyParsed converted this, we should stringify it
        // (e.g. dates get converted and we need them as strings for SQLite insertion)
        payload.stmt = JSON.parse(
          typeof payload.stmt === 'string'
            ? payload.stmt
            : safeStringify(payload.stmt)
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
          `${payload.id}-backup.sqlite`
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

        // lock database if not already locked
        if (!payload?.lock) lock = await acquireLock(this, db);

        // run a checkpoint to copy over wal to db
        db.pragma('wal_checkpoint(PASSIVE)');

        // create backup
        const results = db.exec(`VACUUM INTO '${tmp}'`);

        logger.debug('results', { results });

        let backup = true;
        let err;

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
          const journalModeResult = backupDb.pragma('journal_mode=DELETE');
          if (
            !Array.isArray(journalModeResult) ||
            journalModeResult.length !== 1 ||
            !journalModeResult[0] ||
            typeof journalModeResult[0] !== 'object' ||
            journalModeResult[0].journal_mode !== 'delete'
          )
            throw new TypeError('Journal mode could not be changed');
          // backupDb.rekey(Buffer.from(decrypt(payload.new_password)));
          backupDb.pragma(`rekey="${decrypt(payload.new_password)}"`);
          backupDb.pragma('journal_mode=WAL');
          backupDb.pragma('optimize');
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
            logger.fatal(err, { payload });
          }
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
          logger.fatal(err, { payload });
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

        // only allow one backup at a time and once every hour
        const backupLock = await this.lock.waitAcquireLock(
          `${payload.session.user.alias_id}-backup`,
          ms('30m'), // expires after 30m
          ms('10s') // wait for 10s
        );

        if (!backupLock.success)
          throw i18n.translateError('IMAP_WRITE_LOCK_FAILED');

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

          // lock database if not already locked
          if (!payload?.lock) lock = await acquireLock(this, db);

          // run a checkpoint to copy over wal to db
          db.pragma('wal_checkpoint(PASSIVE)');

          // create backup
          const results = db.exec(`VACUUM INTO '${tmp}'`);

          logger.debug('results', { results });
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
            lock,
            false,
            tmp
          );
          backupDb.pragma('optimize');
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
              _id: new mongoose.Types.ObjectId(payload.session.user.alias_id),
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
            await fs.promises.unlink(tmp);
          } catch (err) {
            logger.fatal(err, { payload });
          }
        }

        // release lock if any
        if (backupLock) {
          try {
            const result = await releaseLock(this, db, backupLock);
            if (!result.success)
              throw i18n.translateError('IMAP_RELEASE_LOCK_FAILED');
          } catch (err) {
            logger.fatal(err, { payload });
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
        .catch((err) => logger.fatal(err, { payload }));
    }

    if (db && db.open && typeof db.close === 'function') {
      db.pragma('optimize');
      db.close();
    }

    if (!ws || typeof ws.send !== 'function') return response;

    ws.send(safeStringify(response));
  } catch (_err) {
    // since we use multiArgs from pify
    // if a promise that was wrapped with multiArgs: true
    // throws, then the error will be an array so we need to get first key
    let err = _err;
    if (Array.isArray(err)) err = _err[0];

    err.payload = payload;

    // delete err.payload.user.password (safeguard)
    if (err?.payload?.session?.user?.password)
      delete err.payload.session.user.password;

    // at least early on we should get errors in advance
    err.isCodeBug = true;
    logger.fatal(err, { payload });

    if (lock) {
      releaseLock(this, db, lock)
        .then()
        .catch((err) => logger.fatal(err, { payload }));
    }

    if (db && db.open && typeof db.close === 'function') {
      db.pragma('optimize');
      db.close();
    }

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

module.exports = parsePayload;
