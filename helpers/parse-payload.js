/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');
const { isIP } = require('node:net');
const { randomUUID } = require('node:crypto');

const { Headers, Splitter, Joiner } = require('mailsplit');

const MimeNode = require('nodemailer/lib/mime-node');
const bytes = require('@forwardemail/bytes');
const dayjs = require('dayjs-with-plugins');
const getStream = require('get-stream');
const intoStream = require('into-stream');
const ip = require('ip');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');
// const pEvent = require('p-event');
const pMap = require('p-map');
const parseErr = require('parse-err');
const pify = require('pify');
const revHash = require('rev-hash');
const safeStringify = require('fast-safe-stringify');
const { Iconv } = require('iconv');
const Boom = require('@hapi/boom');
const _ = require('#helpers/lodash');
const isEmail = require('#helpers/is-email');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const { Emails } = require('#models');
const SMTPError = require('#helpers/smtp-error');
const TemporaryMessages = require('#models/temporary-messages');
const config = require('#config');
const checkDiskSpace = require('#helpers/check-disk-space');
const email = require('#helpers/email');
const encryptMessage = require('#helpers/encrypt-message');
const encryptMessageSMIME = require('#helpers/encrypt-message-smime');
const env = require('#config/env');
const closeDatabase = require('#helpers/close-database');
const getDatabase = require('#helpers/get-database');
const getFingerprint = require('#helpers/get-fingerprint');
const getPathToDatabase = require('#helpers/get-path-to-database');
const getTemporaryDatabase = require('#helpers/get-temporary-database');
const i18n = require('#helpers/i18n');
const isAllowlisted = require('#helpers/is-allowlisted');
const checkSRS = require('#helpers/check-srs');
const createSession = require('#helpers/create-session');
const isCodeBug = require('#helpers/is-code-bug');
const isRetryableError = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');
const recursivelyParse = require('#helpers/recursively-parse');
const sendApn = require('#helpers/send-apn');
const syncTemporaryMailbox = require('#helpers/sync-temporary-mailbox');
const updateStorageUsed = require('#helpers/update-storage-used');
const { encoder, decoder } = require('#helpers/encoder-decoder');
const { encrypt } = require('#helpers/encrypt-decrypt');
const { createSieveIntegration } = require('#helpers/sieve');

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

const CHECKPOINTS = ['PASSIVE', 'FULL', 'RESTART', 'TRUNCATE'];

const HOSTNAME = os.hostname();
const IP_ADDRESS = ip.address();

const PAYLOAD_ACTIONS = new Set([
  'sync', // no db
  'tmp', // no db
  'setup', // no db
  'vacuum', // no db
  'size', // no db
  'stmt', // db required
  'backup', // no db
  'rekey', // no db
  'reset', // no db

  // db required
  'copy_messages',

  // none of these require db
  // (because they all have `refreshSession` calls)
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

async function parsePayload(data, ws) {
  const now = Date.now();

  let db;
  let payload;
  let response;
  try {
    if (!data) throw new TypeError('Data missing');

    // request.socket.remoteAddress
    payload = ws ? recursivelyParse(decoder.unpack(data)) : data;

    // if it took more than 10s to be received then we should alert admins
    if (payload.sent_at && now - payload.sent_at >= 10000) {
      const err = new TypeError(`Payload took >= 10s to be received`);
      err.payload = payload;
      logger.fatal(err);
    }

    //
    // validate payload
    // - id (uuid)
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

    // if checkpoint was passed then ensure it's valid
    if (payload.checkpoint && typeof payload.checkpoint !== 'string')
      throw new TypeError('checkpoint is reserved for WAL_CHECKPOINT');

    if (
      typeof payload.checkpoint === 'string' &&
      !CHECKPOINTS.includes(payload.checkpoint)
    )
      throw new TypeError(
        `checkpoint was "${
          payload.checkpoint
        }" but must be one of: ${CHECKPOINTS.join(', ')}`
      );

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

    // clear migrate check cache if necessary
    if (
      payload.migrate_check === true &&
      isSANB(payload?.session?.user?.alias_id)
    )
      await this.client.del(`migrate_check:${payload.session.user.alias_id}`);

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
        const deleted = await syncTemporaryMailbox.call(this, payload.session);
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

          async (obj) => {
            try {
              const alias = await Aliases.findById(obj.id)
                .populate('domain', 'id name')
                .populate(
                  'user',
                  `id email ${config.userFields.isBanned} ${config.lastLocaleField}`
                )
                .select(
                  'id has_imap has_pgp public_key has_smime smime_certificate storage_location user is_enabled name domain max_quota'
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
                  alias_user_id: alias.user.id,
                  domain_id: alias.domain.id,
                  domain_name: alias.domain.name,
                  password: encrypt(
                    Array.isArray(env.API_SECRETS)
                      ? env.API_SECRETS[0]
                      : env.API_SECRETS
                  ),
                  storage_location: alias.storage_location,
                  alias_has_pgp: alias.has_pgp,
                  alias_public_key: alias.public_key,
                  alias_has_smime: alias.has_smime,
                  alias_smime_certificate: alias.smime_certificate,
                  locale: alias.user[config.lastLocaleField],
                  owner_full_email: alias.user.email
                }
              };

              // check quota
              const { isOverQuota, storageUsed, maxQuotaPerAlias } =
                await Aliases.isOverQuota(alias, 0, this.client);

              if (isOverQuota) {
                const err = new Error(
                  `${session.user.username} has exceeded quota with ${bytes(
                    storageUsed
                  )} storage used`
                );
                err.payload = _.omit(payload, 'raw');
                logger.fatal(err);
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

              const exceedsQuota = storageUsed + byteLength > maxQuotaPerAlias;

              if (exceedsQuota) {
                const err = new Error(
                  `${session.user.username} has exceeded quota with ${bytes(
                    storageUsed
                  )} storage used`
                );
                err.payload = _.omit(payload, 'raw');
                logger.fatal(err); // send alert to admins
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
                        `${sender} limited to 100 GB with current of ${bytes(
                          size
                        )} from ${count} messages`,
                        { responseCode: 421 }
                      );
                      err.payload = payload;
                      throw err;
                    }
                  } else {
                    const allowlisted = await isAllowlisted(
                      sender,
                      this.client,
                      this.resolver
                    );
                    if (allowlisted) {
                      // 2) Senders that are allowlisted are limited to sending 10 GB per day.
                      if (size >= bytes('10GB')) {
                        const err = new SMTPError(
                          `${sender} limited to 10 GB with current of ${bytes(
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
                        `#3 ${sender} limited with current of ${bytes(
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
                    `#3 ${sender} limited with current of ${bytes(
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
                    `${sender} limited with current of ${bytes(
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
                  `Needed ${bytes(spaceRequired)} but only ${bytes(
                    diskSpace.free
                  )} was available`
                );

              // we should only use in-memory database is if was connected (IMAP session open)
              if (
                this.databaseMap &&
                this.databaseMap.has(session.user.alias_id) &&
                this.databaseMap.get(session.user.alias_id).open === true
              )
                session.db = this.databaseMap.get(session.user.alias_id);

              //
              // Sieve filtering - process message through user's Sieve script
              //
              let sieveResult = {
                action: 'keep',
                folder: 'INBOX',
                flags: [],
                reject: null,
                redirects: [],
                vacation: null,
                discarded: false
              };

              try {
                // Create Sieve integration instance
                const sieveIntegration = createSieveIntegration({
                  client: this.client,
                  resolver: this.resolver
                });

                // Process message through Sieve script
                sieveResult = await sieveIntegration.processMessage({
                  aliasId: session.user.alias_id,
                  aliasAddress: session.user.username,
                  raw: payload.raw,
                  envelope: payload.envelope || {
                    from: payload.sender,
                    to: [session.user.username]
                  },
                  session: {
                    remoteAddress: payload.remoteAddress,
                    resolvedClientHostname: payload.resolvedClientHostname
                  }
                });

                // Handle rejection - return SMTP error
                if (sieveResult.action === 'reject' && sieveResult.reject) {
                  throw new SMTPError(
                    sieveResult.reject.message || sieveResult.reject,
                    { responseCode: 550 }
                  );
                }

                // Handle discard - skip storage entirely
                if (sieveResult.action === 'discard' || sieveResult.discarded) {
                  logger.info('sieve discarded message', {
                    user: { id: session.user.alias_user_id },
                    domains: [
                      new mongoose.Types.ObjectId(session.user.domain_id)
                    ],
                    session,
                    ignore_hook: false,
                    alias: session.user.username,
                    sender: payload.sender
                  });
                  // Still process redirects if any have :copy flag
                  if (
                    sieveResult.redirects &&
                    sieveResult.redirects.length > 0
                  ) {
                    for (const redirect of sieveResult.redirects) {
                      if (redirect.copy) {
                        try {
                          // Queue the redirect email using Emails.queue
                          await Emails.queue({
                            info: {
                              message: payload.raw,
                              envelope: {
                                from: session.user.username,
                                to: [redirect.address]
                              }
                            },
                            user: { id: session.user.alias_user_id },
                            is_bounce: false
                          });
                        } catch (err) {
                          logger.error('sieve redirect failed', {
                            user: { id: session.user.alias_user_id },
                            domains: [
                              new mongoose.Types.ObjectId(
                                session.user.domain_id
                              )
                            ],
                            session,
                            ignore_hook: false,
                            err,
                            redirect
                          });
                        }
                      }
                    }
                  }

                  return; // Skip storage
                }

                // Handle redirects without :copy flag (forward only, no local storage)
                if (sieveResult.redirects && sieveResult.redirects.length > 0) {
                  const forwardOnly = sieveResult.redirects.filter(
                    (r) => !r.copy
                  );
                  if (forwardOnly.length > 0 && sieveResult.action !== 'keep') {
                    for (const redirect of forwardOnly) {
                      try {
                        // Queue the redirect email using Emails.queue
                        await Emails.queue({
                          info: {
                            message: payload.raw,
                            envelope: {
                              from: session.user.username,
                              to: [redirect.address]
                            }
                          },
                          user: { id: session.user.alias_user_id },
                          is_bounce: false
                        });
                      } catch (err) {
                        logger.error('sieve redirect failed', {
                          user: { id: session.user.alias_user_id },
                          domains: [
                            new mongoose.Types.ObjectId(session.user.domain_id)
                          ],
                          session,
                          ignore_hook: false,
                          err,
                          redirect
                        });
                      }
                    }

                    // If only forwarding (no keep), skip local storage
                    if (sieveResult.action !== 'keep' && !sieveResult.folder) {
                      return;
                    }
                  }
                }

                // Handle vacation auto-reply (similar to on-data-mx.js sendVacationResponder)
                if (sieveResult.vacation) {
                  try {
                    // Check cache if we've already sent this vacation reply
                    const vacationKey = `${
                      config.fingerprintPrefix
                    }:vacation:${revHash(
                      encoder.pack([session.user.alias_id, payload.sender])
                    )}`;

                    const vacationCache = await this.client.get(vacationKey);
                    if (!vacationCache) {
                      // Calculate vacation TTL from :seconds or :days (vacation-seconds extension RFC 6131)
                      // Default is 4 days if not specified
                      let vacationTtlMs;
                      if (sieveResult.vacation.seconds) {
                        // vacation-seconds extension - use seconds directly
                        // Minimum 60 seconds per RFC 6131
                        vacationTtlMs =
                          Math.max(60, sieveResult.vacation.seconds) * 1000;
                      } else if (sieveResult.vacation.days) {
                        // Standard vacation :days parameter
                        // Minimum 1 day, maximum 31 days per RFC 5230
                        vacationTtlMs =
                          Math.min(31, Math.max(1, sieveResult.vacation.days)) *
                          24 *
                          60 *
                          60 *
                          1000;
                      } else {
                        // Default 4 days
                        vacationTtlMs = ms('4d');
                      }

                      // Set cache with calculated TTL to prevent duplicate replies
                      await this.client.set(
                        vacationKey,
                        true,
                        'PX',
                        vacationTtlMs
                      );

                      // Create proper MIME message like on-data-mx.js
                      const rootNode = new MimeNode(
                        'text/plain; charset=utf-8'
                      );
                      rootNode.setHeader('To', payload.sender);
                      rootNode.setHeader('From', session.user.username);

                      // Gmail sets Precedence to "bulk" and X-Autoreply to "yes"
                      const originalSubject = payload.subject || '';
                      rootNode.setHeader(
                        'Subject',
                        isSANB(originalSubject)
                          ? `${
                              sieveResult.vacation.subject || 'Auto-Reply'
                            } Re: ${originalSubject}`
                          : sieveResult.vacation.subject || 'Auto-Reply'
                      );
                      rootNode.setHeader('Precedence', 'bulk');
                      rootNode.setHeader('X-Autoreply', 'yes');
                      rootNode.setHeader('Auto-Submitted', 'auto-replied');

                      // Set In-Reply-To and References if original message had Message-ID
                      if (payload.messageId) {
                        rootNode.setHeader('In-Reply-To', payload.messageId);
                        rootNode.setHeader('References', payload.messageId);
                      }

                      rootNode.setHeader(
                        'X-Report-Abuse-To',
                        config.abuseEmail
                      );
                      rootNode.setHeader('X-Report-Abuse', config.abuseEmail);
                      rootNode.setHeader('X-Complaints-To', config.abuseEmail);
                      rootNode.setHeader(
                        'X-Forward-Email-Website',
                        config.urls.web
                      );
                      rootNode.setHeader(
                        'X-Forward-Email-Version',
                        config.pkg.version
                      );
                      rootNode.setHeader(
                        'X-Forward-Email-Sender',
                        `rfc822; ${[
                          punycode.toASCII(session.user.username),
                          HOSTNAME,
                          IP_ADDRESS
                        ].join(', ')}`
                      );

                      rootNode.setContent(sieveResult.vacation.body || '');

                      // Queue the email using Emails.queue like on-data-mx.js
                      const vacationEmail = await Emails.queue({
                        info: {
                          message: rootNode.createReadStream(),
                          envelope: {
                            from: punycode.toASCII(session.user.username),
                            to: [checkSRS(payload.sender)]
                          }
                        },
                        user: { id: session.user.alias_user_id },
                        is_bounce: true
                      });

                      logger.info('sieve vacation email created', {
                        session: createSession(vacationEmail),
                        user: vacationEmail.user,
                        email: vacationEmail._id,
                        domains: [vacationEmail.domain],
                        ignore_hook: false
                      });
                    }
                  } catch (err) {
                    logger.error('sieve vacation reply failed', {
                      user: { id: session.user.alias_user_id },
                      domains: [
                        new mongoose.Types.ObjectId(session.user.domain_id)
                      ],
                      session,
                      ignore_hook: false,
                      err
                    });
                  }
                }
              } catch (err) {
                // If Sieve processing fails, log and continue with default delivery
                if (err instanceof SMTPError) throw err; // Re-throw SMTP errors (reject)
                logger.error('sieve processing error', {
                  user: { id: session.user.alias_user_id },
                  domains: [
                    new mongoose.Types.ObjectId(session.user.domain_id)
                  ],
                  session,
                  ignore_hook: false,
                  err,
                  alias: session.user.username
                });
              }

              // Use Sieve-determined folder and flags
              const targetFolder = sieveResult.folder || 'INBOX';
              const targetFlags = sieveResult.flags || [];

              // Use modified raw message if header changes were applied (editheader extension)
              const messageRaw = sieveResult.modifiedRaw || payload.raw;

              if (session.db) {
                try {
                  // since we use onAppend it re-uses addEntries
                  // which notifies all connected imap users via EXISTS
                  await onAppendPromise.call(
                    this,
                    targetFolder,
                    targetFlags,
                    _.isDate(payload.date)
                      ? payload.date
                      : new Date(payload.date),
                    messageRaw,
                    {
                      user: {
                        ...session.user
                        // NOTE: we don't have the password since we're using in-memory mapping
                        // password: user.password
                      },
                      db: session.db,
                      remoteAddress: payload.remoteAddress,
                      resolvedRootClientHostname:
                        payload.resolvedRootClientHostname,
                      resolvedClientHostname: payload.resolvedClientHostname,
                      allowlistValue: payload.allowlistValue,

                      // don't emit wss.broadcast
                      selected: false,

                      // don't append duplicate messages
                      checkForExisting: true,

                      // don't retry so we can timely store to tmp storage instead
                      retries: 0
                    }
                  );

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
                    err.payload = _.omit(payload, 'raw');
                    logger.fatal(err);
                  }
                } catch (_err) {
                  // in order to ensure tmp write still occurs
                  delete session.db;

                  const err = Array.isArray(_err) ? _err[0] : _err;
                  if (isRetryableError(err)) {
                    err.payload = _.omit(payload, 'raw');
                    logger.warn(err);
                  } else {
                    err.isCodeBug = true;
                    err.payload = _.omit(payload, 'raw');
                    logger.error(err);
                  }
                }
              }

              /*
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
                  targetFolder,
                  targetFlags,
                  _.isDate(payload.date)
                    ? payload.date
                    : new Date(payload.date),
                  messageRaw,
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
                  err.isCodeBug = true;
                  err.payload = _.omit(payload, 'raw');
                  logger.fatal(err);
                }
              } catch (_err) {
                const err = Array.isArray(_err) ? _err[0] : _err;
                if (isRetryableError(err)) {
                  err.isCodeBug = true;
                  err.payload = _.omit(payload, 'raw');
                  logger.error(err);
                } else {
                  err.isCodeBug = true;
                  err.payload = _.omit(payload, 'raw');
                  logger.error(err);
                }
              }
              */

              //
              // fallback to writing to temporary database storage
              //
              // if (fallback)
              if (!session.db) {
                const tmpDb = await getTemporaryDatabase.call(this, session);

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

                  // S/MIME encryption support
                  if (
                    session.user.alias_has_smime &&
                    session.user.alias_smime_certificate
                  ) {
                    try {
                      // NOTE: encryptMessageSMIME won't encrypt message if it already is
                      payload.raw = await encryptMessageSMIME(
                        session.user.alias_smime_certificate,
                        payload.raw
                      );
                      // unset smime_error_sent_at if it was a date and more than 1h ago
                      Aliases.findOneAndUpdate(
                        {
                          _id: new mongoose.Types.ObjectId(
                            session.user.alias_id
                          ),
                          domain: new mongoose.Types.ObjectId(
                            session.user.domain_id
                          ),
                          smime_error_sent_at: {
                            $exists: true,
                            $lte: dayjs().subtract(1, 'hour').toDate()
                          }
                        },
                        {
                          $unset: {
                            smime_error_sent_at: 1
                          }
                        }
                      )
                        .then()
                        .catch((err) => this.logger.fatal(err));
                    } catch (err) {
                      err.isCodeBug = true;
                      err.payload = _.omit(payload, 'raw');
                      logger.fatal(err);
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
                                    smime_error_sent_at: {
                                      $exists: false
                                    }
                                  },
                                  {
                                    smime_error_sent_at: {
                                      $lte: dayjs().subtract(1, 'day').toDate()
                                    }
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            $set: {
                              smime_error_sent_at: now
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
                                subject: i18n.translate(
                                  'SMIME_ENCRYPTION_ERROR',
                                  session.user.locale
                                )
                              },
                              locals: {
                                message: `<strong>${session.user.username}</strong> &ndash; ${err.message}`,
                                locale: session.user.locale
                              }
                            })
                              .then(() => {
                                Aliases.findOneAndUpdate(alias._id, {
                                  $set: {
                                    smime_error_sent_at: new Date()
                                  }
                                })
                                  .then()
                                  .catch((err) => this.logger.fatal(err));
                              })
                              .catch((err) => {
                                this.logger.fatal(err);
                                Aliases.findOneAndUpdate(
                                  {
                                    _id: new mongoose.Types.ObjectId(
                                      session.user.alias_id
                                    ),
                                    domain: new mongoose.Types.ObjectId(
                                      session.user.domain_id
                                    ),
                                    smime_error_sent_at: now
                                  },
                                  {
                                    $unset: {
                                      smime_error_sent_at: 1
                                    }
                                  }
                                ).catch((err) => this.logger.fatal(err));
                              });
                          })
                          .catch((err) => this.logger.fatal(err));
                      }
                    }
                  }

                  // PGP encryption support
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
                        .catch((err) => this.logger.fatal(err));
                    } catch (err) {
                      err.isCodeBug = true;
                      err.payload = _.omit(payload, 'raw');
                      logger.fatal(err);
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
                                // cc: config.alertsEmail,
                                subject: i18n.translate(
                                  'PGP_ENCRYPTION_ERROR',
                                  session.user.locale
                                )
                              },
                              locals: {
                                message: `<strong>${session.user.username}</strong> &ndash; ${err.message}`,
                                // message: `<pre><code>${encode(safeStringify(
                                //   parseErr(err),
                                //   null,
                                //   2
                                // ))}</code></pre>`,
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
                                  .catch((err) => this.logger.fatal(err));
                              })
                              .catch((err) => {
                                this.logger.fatal(err);
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
                                ).catch((err) => this.logger.fatal(err));
                              });
                          })
                          .catch((err) => this.logger.fatal(err));
                      }
                    }
                  }

                  // store temp message with Sieve-determined folder and flags
                  await TemporaryMessages.create({
                    instance: this,
                    session: { user: session.user, db: tmpDb },
                    fingerprint,
                    date: _.isDate(payload.date)
                      ? payload.date
                      : new Date(payload.date),
                    raw: messageRaw,
                    remoteAddress: payload.remoteAddress,
                    // Sieve filtering results
                    mailbox: targetFolder,
                    flags: targetFlags
                  });

                  // run a checkpoint to copy over wal to db
                  try {
                    tmpDb.pragma('wal_checkpoint(PASSIVE)');
                  } catch (err) {
                    logger.fatal(err, { payload });
                  }

                  // update storage after temporary message created
                  try {
                    await updateStorageUsed(alias.id, this.client);
                  } catch (err) {
                    err.isCodeBug = true;
                    err.payload = _.omit(payload, 'raw');
                    logger.fatal(err);
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
                    err.isCodeBug = true;
                    err.payload = _.omit(payload, 'raw');
                    logger.fatal(err);
                  }
                } catch (_err) {
                  err = _err;
                  err.isCodeBug = true;
                  err.payload = _.omit(payload, 'raw');
                  logger.fatal(err);
                }

                if (tmpDb && !this.temporaryDatabaseMap)
                  await closeDatabase(tmpDb);

                // send user push notification
                if (!err)
                  sendApn(this.client, alias.id)
                    .then()
                    .catch((err) =>
                      logger.fatal(err, { session, resolver: this.resolver })
                    );

                if (err) throw err;
              }
            } catch (err) {
              err.payload = _.omit(payload, 'raw');
              err.isCodeBug = isCodeBug(err);
              logger.error(err);
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

        const maxQuotaPerAlias = await Domains.getMaxQuota(
          payload.session.user.domain_id,
          payload.session.user.alias_id
        );

        // slight overhead for backups
        const spaceRequired = maxQuotaPerAlias * 2;

        const diskSpace = await checkDiskSpace(storagePath);
        if (diskSpace.free < spaceRequired)
          throw new TypeError(
            `Needed ${bytes(spaceRequired)} but only ${bytes(
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
          payload.session
        );

        response = {
          id: payload.id,
          data: true
        };

        try {
          db.pragma('wal_checkpoint(PASSIVE)');
        } catch (err) {
          logger.fatal(err, { payload });
        }

        // update storage
        try {
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

          db = await getDatabase(
            this,
            // alias
            {
              id: payload.session.user.alias_id,
              storage_location: payload.session.user.storage_location
            },
            payload.session
          );

          // run a checkpoint to copy over wal to db
          try {
            db.pragma('wal_checkpoint(PASSIVE)');
          } catch (err) {
            logger.fatal(err, { payload });
          }

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

        db = await getDatabase(
          this,
          // alias
          {
            id: payload.session.user.alias_id,
            storage_location: payload.session.user.storage_location
          },
          payload.session
        );

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
              // Convert Uint8Array values to Buffer for SQLite binding
              // (msgpackr deserializes Buffers as Uint8Array over WebSocket)
              let values = op[1];
              if (
                values &&
                typeof values === 'object' &&
                !Array.isArray(values)
              ) {
                values = {};
                for (const key of Object.keys(op[1])) {
                  const val = op[1][key];
                  // Check for Uint8Array (but not Buffer) or ArrayBuffer
                  if (
                    (val instanceof Uint8Array && !Buffer.isBuffer(val)) ||
                    val instanceof ArrayBuffer
                  ) {
                    values[key] = Buffer.from(val);
                  } else if (
                    val &&
                    typeof val === 'object' &&
                    val.type === 'Buffer' &&
                    Array.isArray(val.data)
                  ) {
                    // Handle serialized Buffer objects {type: 'Buffer', data: [...]}
                    values[key] = Buffer.from(val.data);
                  } else {
                    values[key] = val;
                  }
                }
              }

              data = stmt[op[0]](values);

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

        // check how much space is remaining on storage location
        const storagePath = getPathToDatabase({
          id: payload.session.user.alias_id,
          storage_location: payload.session.user.storage_location
        });

        const maxQuotaPerAlias = await Domains.getMaxQuota(
          payload.session.user.domain_id,
          payload.session.user.alias_id
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

        const diskSpace = await checkDiskSpace(storagePath);
        if (diskSpace.free < spaceRequired)
          throw new TypeError(
            `Needed ${bytes(spaceRequired)} but only ${bytes(
              diskSpace.free
            )} was available`
          );

        // only allow one reset/rekey at a time
        const cache = await this.client.get(
          `reset_check:${payload.session.user.alias_id}`
        );

        if (cache) {
          const err = Boom.clientTimeout(
            i18n.translateError('RATE_LIMITED', payload.session.user.locale)
          );
          err.ignoreHook = true;
          throw err;
        }

        await this.client.set(
          `reset_check:${payload.session.user.alias_id}`,
          true,
          'PX',
          ms('30s')
        );

        //
        // NOTE: if maxQueue exceeded then this will error and reject
        //       <https://github.com/piscinajs/piscina/blob/5169c75a4d744c8503b64f6e5aaac358c4f72e6c/src/errors.ts#L5>
        //       (note all of these error messages are in TimeoutError checking)
        //
        // run in worker pool to offset from main thread (because of VACUUM)
        // and run this in the background
        //
        this.piscina
          .run(payload, { name: 'rekey' })
          .then()
          .catch((err) => logger.fatal(err, { payload }));

        response = {
          id: payload.id,
          data: true
        };

        this.client.publish('sqlite_auth_reset', payload.session.user.alias_id);

        break;
      }

      case 'reset': {
        // only allow one reset/rekey at a time
        const cache = await this.client.get(
          `reset_check:${payload.session.user.alias_id}`
        );
        if (cache) {
          const err = Boom.clientTimeout(
            i18n.translateError('RATE_LIMITED', payload.session.user.locale)
          );
          err.ignoreHook = true;
          throw err;
        }

        await this.client.set(
          `reset_check:${payload.session.user.alias_id}`,
          true,
          'PX',
          ms('30s')
        );

        // check how much space is remaining on storage location
        const storagePath = getPathToDatabase({
          id: payload.session.user.alias_id,
          storage_location: payload.session.user.storage_location
        });

        // slight 2x overhead for backups
        const maxQuotaPerAlias = await Domains.getMaxQuota(
          payload.session.user.domain_id,
          payload.session.user.alias_id
        );
        const spaceRequired = maxQuotaPerAlias * 2;

        const diskSpace = await checkDiskSpace(storagePath);
        if (config.env !== 'development' && diskSpace.free < spaceRequired)
          throw new TypeError(
            `Needed ${bytes(spaceRequired)} but only ${bytes(
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

        // -wal
        try {
          await fs.promises.rm(storagePath.replace('.sqlite', '.sqlite-wal'), {
            force: true,
            recursive: true
          });
        } catch (err) {
          if (err.code !== 'ENOENT') {
            err.isCodeBug = true;
            throw err;
          }
        }

        // -shm
        try {
          await fs.promises.rm(storagePath.replace('.sqlite', '.sqlite-shm'), {
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

        // close existing connection if any and purge it
        if (
          this?.databaseMap &&
          this.databaseMap.has(payload.session.user.alias_id)
        ) {
          await closeDatabase(
            this.databaseMap.get(payload.session.user.alias_id)
          );
          this.databaseMap.delete(payload.session.user.alias_id);
        }

        // TODO: don't allow getDatabase to perform a reset here
        db = await getDatabase(
          this,
          // alias
          {
            id: payload.session.user.alias_id,
            storage_location: payload.session.user.storage_location
          },
          payload.session
        );

        try {
          db.pragma('wal_checkpoint(PASSIVE)');
        } catch (err) {
          logger.fatal(err, { payload });
        }

        // update storage
        try {
          await updateStorageUsed(payload.session.user.alias_id, this.client);
        } catch (err) {
          logger.fatal(err, { payload });
        }

        // remove write lock
        // await this.client.del(`reset_check:${payload.session.user.alias_id}`);

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

        if (
          !isSANB(payload.format) ||
          !['eml', 'mbox', 'sqlite'].includes(payload.format)
        ) {
          payload.format = 'sqlite'; // default
        }

        const key = `backup_check:${payload.session.user.alias_id}`;

        // only allow one backup every 30m (even if err/restart/shutdown)
        const cache = await this.client.get(key);

        if (cache) {
          const err = Boom.clientTimeout(
            i18n.translateError(
              'BACKUP_IN_PROGRESS',
              payload.session.user.locale
            )
          );
          err.ignoreHook = true;
          throw err;
        }

        try {
          // set cache so we don't run two backups at once
          await this.client.set(key, true, 'PX', ms('30m'));

          // check when we actually did the last user backup
          const alias = await Aliases.findById(payload.session.user.alias_id)
            .lean()
            .exec();
          if (!alias) throw new TypeError('Alias does not exist');

          let runBackup = true;

          if (
            // if it was not requested by a user for download
            !payload.email &&
            // and if it's less than 24h ago then we should not do another backup
            _.isDate(alias.imap_backup_at) &&
            new Date(alias.imap_backup_at).getTime() >
              dayjs().subtract(1, 'day').toDate().getTime()
          )
            runBackup = false;

          //
          // NOTE: if maxQueue exceeded then this will error and reject
          //       <https://github.com/piscinajs/piscina/blob/5169c75a4d744c8503b64f6e5aaac358c4f72e6c/src/errors.ts#L5>
          //       (note all of these error messages are in TimeoutError checking)
          //
          // run in worker pool to offset from main thread (because of VACUUM)
          if (!runBackup) {
            const err = Boom.clientTimeout(
              i18n.translateError(
                'BACKUP_IN_PROGRESS',
                payload.session.user.locale
              )
            );
            err.ignoreHook = true;
            throw err;
          }

          // run this in the background
          this.piscina
            .run(payload, { name: 'backup' })
            .then()
            .catch((err) => logger.fatal(err, { payload }));

          response = {
            id: payload.id,
            data: true
          };
        } catch (err) {
          // purge cache in case of an error
          await this.client.del(key);
          throw err;
        }

        break;
      }

      default: {
        throw new TypeError('Action not yet configured');
      }
    }

    if (db && payload.checkpoint) {
      try {
        db.pragma(`wal_checkpoint(${payload.checkpoint})`);
      } catch (err) {
        logger.fatal(err, { payload });
      }
    }

    if (db && !this?.databaseMap) await closeDatabase(db);

    if (!ws) return response.data;

    ws.send(encoder.pack(response));
  } catch (_err) {
    // since we use multiArgs from pify
    // if a promise that was wrapped with multiArgs: true
    // throws, then the error will be an array so we need to get first key
    let err = _err;
    if (Array.isArray(err)) err = _err[0];

    err.payload = _.omit(payload, 'raw');

    // TODO: we can't do this because of object circular reference
    // delete err.payload.user.password (safeguard)
    // if (err?.payload?.session?.user?.password)
    //   delete err.payload.session.user.password;

    // at least early on we should get errors in advance
    logger.fatal(err, { payload });

    if (db && !this?.databaseMap) await closeDatabase(db);

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
