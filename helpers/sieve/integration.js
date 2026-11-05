/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Sieve Integration Helper
 *
 * This module integrates Sieve filtering into Forward Email's mail processing pipeline.
 * It hooks into the message delivery flow to apply user-defined Sieve scripts before
 * messages are stored to mailboxes.
 *
 * Integration points:
 * - parse-payload.js: Before storing incoming messages to INBOX
 * - on-data-mx.js: For forwarding decisions
 *
 * @see RFC 5228 - Sieve: An Email Filtering Language
 */

const { Buffer } = require('node:buffer');
const { Readable, Transform } = require('node:stream');

const libmime = require('libmime');
const mongoose = require('mongoose');
const { simpleParser } = require('mailparser');
const getStream = require('get-stream');
const MimeNode = require('nodemailer/lib/mime-node');
const addressParser = require('nodemailer/lib/addressparser');
const { Splitter, Joiner } = require('mailsplit');
const SieveEngine = require('./engine');
const { SUPPORTED_CAPABILITIES, getCapability } = require('./capabilities');
const { SieveFilterHandler } = require('./filter-handler');
const {
  SieveSecurityValidator,
  SieveRateLimiter,
  SieveAuditLogger,
  checkDenylist
} = require('./security');

// Use no-op logger/config in test environments where the full config isn't available
let config;
let logger;
try {
  config = require('#config');
} catch {
  config = {};
}

try {
  logger = require('#helpers/logger');
} catch {
  logger = {
    debug() {},
    info() {},
    warn() {},
    error() {}
  };
}

//
// Headers a script can never add or delete, whatever the configuration:
// RFC 5293 section 6 (deleting Received and Auto-Submitted MUST NOT be
// permitted) and RFC 5703 section 5 (the Original-Subject and Original-From
// a replace adds cannot be changed)
//
const REQUIRED_PROTECTED_HEADERS = [
  'received',
  'auto-submitted',
  'original-subject',
  'original-from'
];

// Default Sieve configuration
const DEFAULT_CONFIG = {
  maxScriptSize: 1024 * 1024, // 1MB (matches Dovecot default)
  maxScriptCount: 15,
  maxRedirectsPerScript: 5,
  maxRedirectsPerDay: 100,
  maxVacationsPerHour: 10,
  allowedRedirectDomains: [], // Empty = allow all (can be restricted per-domain)
  protectedHeaders: [
    'received',
    'dkim-signature',
    'domainkey-signature',
    'arc-seal',
    'arc-message-signature',
    'arc-authentication-results',
    'authentication-results',
    'return-path',
    'delivered-to',
    'x-original-to'
  ],
  enabledExtensions: SUPPORTED_CAPABILITIES
};

//
// A function telling whether a header field ({ value } as in the message,
// folded and maybe encoded) matches a deleteheader value-pattern, as the
// header test would (RFC 5293 section 5): unfolded and decoded, with the
// match type (:is by default) and comparator (i;ascii-casemap by default)
// of the engine, so the stored message loses the fields later tests no
// longer see
//
function getValueMatcher(pattern, matchType, comparator) {
  const test = SieveEngine.prototype.createMatcher(
    pattern,
    matchType || 'is',
    comparator || 'i;ascii-casemap'
  );

  return (header) => {
    let value = header.value.replace(/\r?\n[ \t]+/g, ' ').trim();
    try {
      value = libmime.decodeWords(value);
    } catch {}

    return test(value);
  };
}

const CRLF = Buffer.from('\r\n');

// (text with CRLF line ends)
function toCRLF(value) {
  return String(value ?? '').replace(/\r?\n/g, '\r\n');
}

//
// Make a mailsplit node the part a replace action gives (RFC 5703 section
// 5), changing its headers, and return its new body: without :mime the
// replacement as text/plain in UTF-8, with :mime the MIME entity it is (its
// headers and content).  The headers of the part about its content (the
// "Content-" ones) are replaced, all others are kept, and for the whole
// message :subject and :from set Subject and From, the ones before kept as
// Original-Subject and Original-From.
//
function setReplacement(node, action) {
  const { headers } = node;
  // (the names first: removing changes the list)
  const names = headers.getList().map(({ key }) => key);
  for (const name of names)
    if (name.startsWith('content-')) headers.remove(name);

  let body;
  if (action.mime) {
    const entity = toCRLF(action.replacement);
    const end = entity.indexOf('\r\n\r\n');
    const head = end === -1 ? entity : entity.slice(0, end);
    body = Buffer.from(end === -1 ? '' : entity.slice(end + 4));
    let index = headers.getList().length;
    // (only its MIME headers, the "Content-" ones, RFC 5703 section 5: any
    // other, such as Received or Authentication-Results, could otherwise be
    // set where a script cannot add it, even from text of the message)
    for (const field of head.split(/\r\n(?![ \t])/)) {
      const colon = field.indexOf(':');
      if (
        colon > 0 &&
        field.slice(0, colon).trim().toLowerCase().startsWith('content-')
      )
        headers.addFormatted(field.slice(0, colon), field, index++);
    }
  } else {
    const text = toCRLF(action.replacement);
    // (7bit when it can be, base64 otherwise)
    const is7bit =
      /^[\t\r\n\u0020-\u007E]*$/.test(text) &&
      text.split('\r\n').every((line) => line.length <= 998);
    body = is7bit
      ? Buffer.from(text)
      : Buffer.from(
          Buffer.from(text)
            .toString('base64')
            .replace(/.{76}(?!$)/g, '$&\r\n')
        );
    headers.add(
      'Content-Type',
      'text/plain; charset=utf-8',
      Number.POSITIVE_INFINITY
    );
    headers.add(
      'Content-Transfer-Encoding',
      is7bit ? '7bit' : 'base64',
      Number.POSITIVE_INFINITY
    );
  }

  // (the whole message, and :subject and :from are ignored with :mime)
  if (action.partIndex === null && !action.mime) {
    if (!headers.hasHeader('mime-version'))
      headers.add('MIME-Version', '1.0', Number.POSITIVE_INFINITY);
    const set = (name, value, encoded) => {
      const original = headers.getList().find(({ key }) => key === name);
      if (original) {
        headers.remove(`original-${name}`);
        headers.addFormatted(
          `Original-${name}`,
          `Original-${name[0].toUpperCase()}${name.slice(
            1
          )}:${original.line.slice(original.line.indexOf(':') + 1)}`
        );
        headers.remove(name);
      }

      headers.add(`${name[0].toUpperCase()}${name.slice(1)}`, encoded);
    };

    if (typeof action.subject === 'string')
      set(
        'subject',
        action.subject,
        libmime.encodeWords(action.subject.replace(/[\r\n]+/g, ' '), 'Q', 52)
      );
    // (a :from that is not an address list is ignored)
    if (
      typeof action.from === 'string' &&
      !/[\r\n]/.test(action.from) &&
      addressParser(action.from).some((a) => /@/.test(a.address || ''))
    )
      set('from', action.from, libmime.encodeWords(action.from, 'Q', 52));
  }

  // (mailsplit parses the content type of a node from its headers)
  node.contentType =
    headers.getFirst('content-type').split(';')[0].trim().toLowerCase() ||
    'text/plain';
  return body;
}

//
// The address of a :from (vacation, notify) only when it is the alias
// itself, with any display name, or null: a script cannot send as another
// address (RFC 5230 section 4.3 and RFC 5435 section 3.3 suggest such a
// value is ignored)
//
function getOwnFrom(value, aliasAddress) {
  if (typeof value !== 'string' || /[\r\n]/.test(value)) return null;
  const addresses = addressParser(value);
  if (
    addresses.length !== 1 ||
    typeof addresses[0].address !== 'string' ||
    addresses[0].address.toLowerCase() !== String(aliasAddress).toLowerCase()
  )
    return null;
  return value.trim();
}

//
// The parts of a mailto: URI (RFC 6068) a notification uses: its "to" and
// "cc" addresses, "subject" and "body", or null for another method
//
function parseMailto(method) {
  const match =
    typeof method === 'string' && /^mailto:([^?]*)(\?.*)?$/i.exec(method);
  if (!match) return null;
  const decode = (value) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  const split = (value) =>
    decode(value)
      .split(',')
      .map((address) => address.trim())
      .filter(Boolean);
  const result = { to: split(match[1]), cc: [], subject: null, body: null };
  for (const pair of (match[2] || '').slice(1).split('&')) {
    const index = pair.indexOf('=');
    if (index === -1) continue;
    const name = decode(pair.slice(0, index)).toLowerCase();
    const value = pair.slice(index + 1);
    // (other headers, e.g. From, Auto-Submitted or Received, are ignored)
    if (name === 'to' || name === 'cc') result[name].push(...split(value));
    else if (name === 'subject' || name === 'body')
      result[name] = decode(value);
  }

  return result;
}

/**
 * Sieve Integration Manager
 *
 * Manages Sieve script execution for incoming mail.
 */
class SieveIntegration {
  //
  // The work header changes may take (see applyHeaderChanges): a header
  // block of 1MB holds about 100,000 headers, so an ordinary script stays far
  // below it, while thousands of changes or values against every header took
  // minutes for each message
  //
  static MAX_HEADER_EDIT_WORK = 20_000_000;

  /**
   * Create a new SieveIntegration instance
   * @param {Object} options - Configuration options
   * @param {Object} options.store - Sieve script store instance
   * @param {Object} options.client - Redis client for rate limiting
   * @param {Object} options.resolver - DNS resolver for denylist checking
   * @param {Object} options.config - Override default configuration
   */
  constructor(options = {}) {
    this.store = options.store;
    this.client = options.client;
    this.resolver = options.resolver;
    this.config = { ...DEFAULT_CONFIG, ...options.config };
    this.config.protectedHeaders = [
      ...new Set([
        ...(this.config.protectedHeaders || DEFAULT_CONFIG.protectedHeaders),
        ...REQUIRED_PROTECTED_HEADERS
      ])
    ];
    this.config.enabledExtensions = [
      ...new Set(
        (this.config.enabledExtensions || [])
          .map((capability) => getCapability(capability))
          .filter((capability) => SUPPORTED_CAPABILITIES.includes(capability))
      )
    ];

    // Initialize security components
    this.securityValidator = new SieveSecurityValidator({
      maxScriptSize: this.config.maxScriptSize,
      maxRedirects: this.config.maxRedirectsPerScript,
      allowedRedirectDomains: this.config.allowedRedirectDomains,
      protectedHeaders: this.config.protectedHeaders,
      allowedExtensions: this.config.enabledExtensions
    });

    // Pass Redis client directly to rate limiter
    this.rateLimiter = new SieveRateLimiter(this.client, {
      redirectsPerDay: this.config.maxRedirectsPerDay,
      vacationsPerHour: this.config.maxVacationsPerHour
    });

    this.auditLogger = new SieveAuditLogger({
      logger
    });

    //
    // The engine scripts run in (every supported capability, as the filter
    // handler's own engine had; see filter-handler.js), enforcing the
    // protected headers and redirect domains as the script runs
    //
    this.engine = new SieveEngine({
      logger,
      protectedHeaders: this.config.protectedHeaders,
      allowedRedirectDomains: this.config.allowedRedirectDomains || [],
      redirectDomainBlacklist: this.config.redirectDomainBlacklist || []
    });
  }

  /**
   * The result of a message without a script (or whose script failed):
   * kept in INBOX as it came
   * @returns {Object} Processing result
   */
  static getDefaultResult() {
    return {
      // keep, discard (not stored), redirect (only redirected), or reject
      action: 'keep',
      // where the message is stored, each mailbox once (see processMessage)
      deliveries: [
        { folder: 'INBOX', flags: [], create: false, specialuse: null }
      ],
      // (the first of deliveries, and the others)
      folder: 'INBOX',
      flags: [],
      create: false,
      specialuse: null,
      additionalFolders: [],
      // (the flags of an implicit keep, and whether to keep the message in
      // INBOX when no redirect could be sent, see parse-payload.js)
      keepFlags: [],
      isKeptIfNotRedirected: false,
      reject: null,
      redirects: [],
      vacation: null,
      discarded: false,
      scriptExecuted: false,
      errors: [],
      // Header modifications (editheader extension)
      headerChanges: [],
      modifiedRaw: null,
      // Notifications (enotify extension)
      notifications: [],
      // Duplicate tracking info
      duplicateId: null,
      isDuplicate: false
    };
  }

  /**
   * Process an incoming message through Sieve filtering
   *
   * @param {Object} params - Processing parameters
   * @param {string} params.aliasId - Alias ID to get scripts for
   * @param {string} params.aliasAddress - Full email address of the alias
   * @param {Buffer} params.raw - Raw message content
   * @param {Object} params.envelope - SMTP envelope (from, to)
   * @param {Object} params.session - Session information
   * @param {Function} [params.mailboxExists] - async (name) => whether the
   *   alias has the mailbox
   * @param {Function} [params.specialUseExists] - async (attributes,
   *   mailbox) => whether the alias has mailboxes with those special-uses
   * @returns {Promise<Object>} Processing result with actions to take
   */
  async processMessage({
    aliasId,
    aliasAddress,
    raw,
    envelope,
    session,
    mailboxExists,
    specialUseExists
  }) {
    const result = SieveIntegration.getDefaultResult();

    try {
      if (!this.store || typeof this.store.getActiveScript !== 'function') {
        return result;
      }

      // Get active script for this alias
      const script = await this.store.getActiveScript(aliasId);

      if (!script) {
        // No active script, use default behavior (keep in INBOX)
        return result;
      }

      result.scriptExecuted = true;

      // Parse the message for Sieve processing
      const message = await this.parseMessageForSieve(raw, envelope);

      // Create filter handler
      const filterHandler = new SieveFilterHandler({
        store: this.store,
        rateLimiter: this.rateLimiter,
        auditLogger: this.auditLogger,
        // (with the protected headers and redirect domains of this
        // integration, enforced as the script runs)
        engine: this.engine,
        aliasId,
        aliasAddress
      });

      // Create Redis-based duplicate cache for persistent duplicate detection
      const duplicateCache = this.client
        ? await this.createDuplicateCache(aliasId)
        : null;

      // Execute the Sieve script with environment context
      const filterResult = await filterHandler.executeScript(
        script.content,
        message,
        {
          aliasId,
          aliasAddress,
          session,
          duplicateCache,
          // (the mailboxes of the alias, for mailboxexists and
          // specialuse_exists, RFC 5490 and RFC 8579)
          mailboxExists,
          specialUseExists,
          // Environment info from session for RFC 5183
          domain: aliasAddress.split('@')[1] || '',
          host: session?.resolvedClientHostname || '',
          remoteHost: session?.resolvedClientHostname || '',
          remoteIp: session?.remoteAddress || ''
        }
      );

      // Handle redirects
      // (whether a redirect without :copy was taken, which cancels the
      // implicit keep; one that is refused here does not, RFC 5228 4.2)
      let isRedirected = false;
      if (
        !filterResult.reject &&
        filterResult.redirect &&
        filterResult.redirect.length > 0
      ) {
        // Check denylist for all redirect addresses first
        const redirectAddresses = filterResult.redirect.map((r) => r.address);
        const denylistResult = await checkDenylist(
          redirectAddresses,
          this.client,
          this.resolver
        );

        // Check rate limits for redirects
        for (const redirect of filterResult.redirect) {
          // Check if this address is denylisted
          const isDenied = denylistResult.deniedAddresses.find(
            (d) => d.address === redirect.address
          );
          if (isDenied) {
            result.errors.push({
              type: 'denylist',
              message: `Redirect address is denylisted: ${redirect.address}`,
              address: redirect.address,
              reason: isDenied.reason
            });
            // Log denylist block for user debugging
            logger.warn('sieve redirect blocked by denylist', {
              ignore_hook: false,
              session,
              sieve: {
                action: 'redirect',
                script: script.name,
                alias: aliasAddress,
                redirectTo: redirect.address,
                blocked: true,
                reason: isDenied.reason
              }
            });
            continue;
          }

          const rateLimitCheck = await this.rateLimiter.checkRedirect(aliasId);
          if (rateLimitCheck.allowed) {
            result.redirects.push({
              address: redirect.address,
              copy: redirect.copy || false
            });
            if (!redirect.copy) isRedirected = true;
            await this.rateLimiter.recordRedirect(aliasId, redirect.address);
            this.auditLogger.logRedirect(
              aliasId,
              redirect.address,
              aliasAddress,
              { session, ignore_hook: true }
            );
            // Log redirect action for user debugging
            logger.info('sieve redirect', {
              ignore_hook: false,
              session,
              sieve: {
                action: 'redirect',
                script: script.name,
                alias: aliasAddress,
                redirectTo: redirect.address,
                copy: redirect.copy || false
              }
            });
          } else {
            result.errors.push({
              type: 'rate_limit',
              message: `Redirect rate limit exceeded: ${rateLimitCheck.remaining} remaining`
            });
            // Log rate limit for user debugging
            logger.warn('sieve redirect rate limited', {
              ignore_hook: false,
              session,
              sieve: {
                action: 'redirect',
                script: script.name,
                alias: aliasAddress,
                redirectTo: redirect.address,
                rateLimitRemaining: rateLimitCheck.remaining
              }
            });
          }
        }
      }

      //
      // Where the message is stored (RFC 5228 section 2.10.2): INBOX for a
      // keep (explicit, or implicit unless something cancelled it), and each
      // mailbox of a fileinto; discard only cancels the implicit keep.  A
      // mailbox is delivered to once, the last flags winning (RFC 5232).
      //
      const isCancelled =
        filterResult.discard ||
        Boolean(filterResult.keep) ||
        filterResult.fileinto.some((f) => !f.copy);
      const isImplicitKeep =
        filterResult.implicitKeep || (!isCancelled && !isRedirected);
      result.keepFlags = filterResult.flags || [];
      // (a redirect alone cancelled it: if it cannot be sent, the message is
      // kept after all, see parse-payload.js)
      result.isKeptIfNotRedirected = !isImplicitKeep && !isCancelled;

      const deliveries = new Map();
      const deliver = (folder, flags, create = false, specialuse = null) => {
        const previous = deliveries.get(folder);
        deliveries.set(folder, {
          folder,
          flags,
          create: create || Boolean(previous?.create),
          specialuse: specialuse || previous?.specialuse || null
        });
      };

      if (filterResult.keep) deliver('INBOX', filterResult.keep.flags || []);
      for (const f of filterResult.fileinto)
        deliver(f.folder, f.flags || [], f.create, f.specialuse);
      if (isImplicitKeep) deliver('INBOX', result.keepFlags);

      result.deliveries = [...deliveries.values()];
      const [primary] = result.deliveries;
      result.folder = primary ? primary.folder : null;
      result.flags = primary ? primary.flags : [];
      result.create = primary ? primary.create : false;
      result.specialuse = primary ? primary.specialuse : null;
      result.additionalFolders = result.deliveries.slice(1);
      result.discarded = !primary;
      result.action = primary
        ? 'keep'
        : filterResult.discard
        ? 'discard'
        : 'redirect';

      //
      // A reject refuses the message: nothing else delivers it (RFC 5429
      // section 2.4 does not recommend delivering a rejected message), and
      // it is checked before discard, which only cancels the implicit keep
      //
      if (filterResult.reject) {
        Object.assign(result, {
          deliveries: [],
          folder: null,
          flags: [],
          create: false,
          specialuse: null,
          additionalFolders: [],
          isKeptIfNotRedirected: false,
          discarded: false
        });
        result.action = 'reject';
        result.reject = filterResult.reject;
        // Log reject action for user debugging
        logger.info('sieve rejected', {
          ignore_hook: false,
          session,
          sieve: {
            action: 'reject',
            script: script.name,
            alias: aliasAddress,
            reason: filterResult.reject.message || filterResult.reject
          }
        });
      }

      if (filterResult.discard) {
        // Log discard action for user debugging
        logger.info('sieve discarded', {
          ignore_hook: false,
          session,
          sieve: {
            action: 'discard',
            script: script.name,
            alias: aliasAddress
          }
        });
      }

      if (filterResult.fileinto.length > 0) {
        // Log fileinto action for user debugging
        logger.info('sieve fileinto', {
          ignore_hook: false,
          session,
          sieve: {
            action: 'fileinto',
            script: script.name,
            alias: aliasAddress,
            folders: result.deliveries.map((d) => d.folder)
          }
        });
      }

      // Handle vacation auto-reply
      if (filterResult.vacation) {
        const vacationCheck = await this.rateLimiter.checkVacation(aliasId);
        if (vacationCheck.allowed) {
          result.vacation = {
            ...filterResult.vacation,
            // (a :from other than the alias is ignored, RFC 5230 section 4.3)
            from: getOwnFrom(filterResult.vacation.from, aliasAddress)
          };
          this.auditLogger.logVacation(
            aliasId,
            envelope.from,
            filterResult.vacation.subject,
            { session, ignore_hook: true }
          );
          // Log vacation action for user debugging
          logger.info('sieve vacation', {
            ignore_hook: false,
            session,
            sieve: {
              action: 'vacation',
              script: script.name,
              alias: aliasAddress,
              subject: filterResult.vacation.subject,
              recipient: envelope.from
            }
          });
        } else {
          result.errors.push({
            type: 'rate_limit',
            message: `Vacation rate limit exceeded: ${vacationCheck.remaining} remaining`
          });
          // Log rate limit for user debugging
          logger.warn('sieve vacation rate limited', {
            ignore_hook: false,
            session,
            sieve: {
              action: 'vacation',
              script: script.name,
              alias: aliasAddress,
              rateLimitRemaining: vacationCheck.remaining
            }
          });
        }
      }

      // Handle header changes (editheader extension)
      if (filterResult.headerChanges && filterResult.headerChanges.length > 0) {
        result.headerChanges = filterResult.headerChanges;
        // Apply header changes to raw message
        result.modifiedRaw = await this.applyHeaderChanges(
          raw,
          filterResult.headerChanges
        );
        // Log header changes for user debugging
        logger.info('sieve editheader', {
          ignore_hook: false,
          session,
          sieve: {
            action: 'editheader',
            script: script.name,
            alias: aliasAddress,
            changes: filterResult.headerChanges.map((c) => ({
              action: c.action,
              name: c.name
            }))
          }
        });
      }

      // Handle replace actions (RFC 5703 §5)
      if (
        filterResult.replaceActions &&
        filterResult.replaceActions.length > 0
      ) {
        // Apply replace actions to the raw message
        const sourceRaw = result.modifiedRaw || raw;
        result.modifiedRaw = await this.applyReplaceActions(
          sourceRaw,
          filterResult.replaceActions
        );
        logger.info('sieve replace', {
          ignore_hook: false,
          session,
          sieve: {
            action: 'replace',
            script: script.name,
            alias: aliasAddress,
            parts: filterResult.replaceActions.map((r) => r.partIndex)
          }
        });
      }

      // Handle notifications (enotify extension)
      //
      // (not for a message that is itself automatic, RFC 5436 section 2.7,
      // and once for each address in a run)
      //
      const autoSubmitted = [message.headers['auto-submitted']]
        .flat()
        .filter((value) => typeof value === 'string');
      const isAutoSubmitted = autoSubmitted.some(
        (value) => value.split(';')[0].trim().toLowerCase() !== 'no'
      );
      const notified = new Set();
      if (
        !isAutoSubmitted &&
        filterResult.notifications &&
        filterResult.notifications.length > 0
      ) {
        for (const notification of filterResult.notifications) {
          try {
            const mailto = parseMailto(notification.method);
            const recipients = mailto
              ? [...mailto.to, ...mailto.cc].map((a) => a.toLowerCase())
              : [];
            if (
              recipients.length > 0 &&
              recipients.every((address) => notified.has(address))
            )
              continue;
            for (const address of recipients) notified.add(address);

            // Rate limit notifications (same bucket as vacations - 10/hour)
            const notifyRateCheck = await this.rateLimiter.checkNotification(
              aliasId
            );
            if (!notifyRateCheck.allowed) {
              result.errors.push({
                type: 'rate_limit',
                message: `Notification rate limit exceeded: ${notifyRateCheck.remaining} remaining`
              });
              logger.warn('sieve notify rate limited', {
                ignore_hook: false,
                session,
                sieve: {
                  action: 'notify',
                  script: script.name,
                  alias: aliasAddress,
                  method: notification.method,
                  rateLimitRemaining: notifyRateCheck.remaining
                }
              });
              continue;
            }

            await this.sendNotification(notification, {
              aliasId,
              aliasAddress,
              envelope,
              session,
              headers: message.headers
            });
            await this.rateLimiter.recordNotification(aliasId);
            result.notifications.push({
              ...notification,
              sent: true
            });
            // Log notification for user debugging
            logger.info('sieve notify sent', {
              ignore_hook: false,
              session,
              sieve: {
                action: 'notify',
                script: script.name,
                alias: aliasAddress,
                method: notification.method,
                importance: notification.importance
              }
            });
          } catch (err) {
            result.notifications.push({
              ...notification,
              sent: false,
              error: err.message
            });
            result.errors.push({
              type: 'notification_error',
              message: `Failed to send notification: ${err.message}`,
              method: notification.method
            });
            logger.error('sieve notify failed', {
              ignore_hook: false,
              session,
              err,
              sieve: {
                action: 'notify',
                script: script.name,
                alias: aliasAddress,
                method: notification.method
              }
            });
          }
        }
      }

      // Log script execution summary
      this.auditLogger.logScriptExecution(aliasId, script.name, result.action, {
        session,
        ignore_hook: true
      });
      logger.info('sieve executed', {
        ignore_hook: false,
        session,
        sieve: {
          script: script.name,
          alias: aliasAddress,
          result: result.action,
          folder: result.folder,
          flags: result.flags,
          redirectCount: result.redirects.length,
          hasVacation: Boolean(result.vacation),
          headerChangeCount: result.headerChanges.length,
          notificationCount: result.notifications.length,
          errorCount: result.errors.length
        }
      });
    } catch (err) {
      logger.error('sieve execution error', {
        ignore_hook: false,
        session,
        err,
        sieve: {
          alias: aliasAddress,
          error: err.message
        }
      });
      result.errors.push({
        type: 'execution_error',
        message: err.message
      });
      // On error, fall back to default behavior (keep in INBOX, as the
      // message came, RFC 5228 section 2.10.6 and RFC 5293 section 7)
      Object.assign(result, SieveIntegration.getDefaultResult(), {
        scriptExecuted: result.scriptExecuted,
        errors: result.errors,
        notifications: result.notifications
      });
    }

    return result;
  }

  /**
   * Parse a raw message into a format suitable for Sieve processing
   *
   * @param {Buffer} raw - Raw message content
   * @param {Object} envelope - SMTP envelope
   * @returns {Promise<Object>} Parsed message object
   */
  async parseMessageForSieve(raw, envelope) {
    const parsed = await simpleParser(raw);

    // Build headers object from headerLines to preserve ALL original headers.
    // IMPORTANT: mailparser's simpleParser collapses List-* headers
    // (List-Unsubscribe, List-Help, List-Post, List-Archive, List-Id, etc.)
    // into a single structured "list" object in the parsed.headers Map,
    // making them invisible to Sieve header/exists tests.
    // Using parsed.headerLines preserves every original header with its raw
    // key and value, ensuring Sieve conditions like
    //   header :contains "List-Unsubscribe" "example.com"
    // work correctly.
    // (an object without a prototype: a header named "__proto__" is a
    // header like any other)
    const headers = Object.create(null);
    if (parsed.headerLines && parsed.headerLines.length > 0) {
      for (const line of parsed.headerLines) {
        const lowerKey = line.key.toLowerCase();
        // Extract raw value after the header name and colon.
        // 1. Unfold (RFC 5322 §2.2.3): replace CRLF+WSP with single space
        // 2. Decode RFC 2047 MIME encoded-words (e.g. =?UTF-8?B?...?=)
        // Both are required by RFC 5228 §2.4.2.2 for Sieve header matching.
        let headerValue = (line.line || '').slice(line.key.length + 1).trim();
        headerValue = headerValue.replace(/\r?\n[ \t]+/g, ' ');
        try {
          headerValue = libmime.decodeWords(headerValue);
        } catch {}

        if (lowerKey in headers) {
          if (Array.isArray(headers[lowerKey])) {
            headers[lowerKey].push(headerValue);
          } else {
            headers[lowerKey] = [headers[lowerKey], headerValue];
          }
        } else {
          headers[lowerKey] = headerValue;
        }
      }
    } else if (parsed.headers) {
      // Fallback: use parsed.headers Map if headerLines is unavailable
      for (const [key, value] of parsed.headers) {
        const lowerKey = key.toLowerCase();
        let headerValue = value;
        if (
          value &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          typeof value.text === 'string'
        ) {
          headerValue = value.text;
        } else if (
          value &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          value.value &&
          Array.isArray(value.value)
        ) {
          headerValue = value.value
            .map((v) =>
              v.name ? `"${v.name}" <${v.address}>` : v.address || ''
            )
            .join(', ');
        }

        if (lowerKey in headers) {
          if (Array.isArray(headers[lowerKey])) {
            headers[lowerKey].push(headerValue);
          } else {
            headers[lowerKey] = [headers[lowerKey], headerValue];
          }
        } else {
          headers[lowerKey] = headerValue;
        }
      }
    }

    // Ensure common headers exist (use text representation from parsed objects)
    if (!headers.from && parsed.from) {
      headers.from = parsed.from.text || parsed.from.value?.[0]?.address;
    }

    if (!headers.to && parsed.to) {
      headers.to =
        parsed.to.text || parsed.to.value?.map((v) => v.address).join(', ');
    }

    if (!headers.subject && parsed.subject) {
      headers.subject = parsed.subject;
    }

    if (!headers.date && parsed.date) {
      headers.date = parsed.date.toISOString();
    }

    // Parse MIME tree for foreverypart/extracttext support (RFC 5703)
    let mimeParts = [];
    try {
      mimeParts = await this.parseMimeTree(raw);
    } catch (err) {
      // Non-fatal: MIME tree parsing failure should not block delivery
      logger.warn('sieve mime tree parse error', {
        ignore_hook: true,
        err
      });
    }

    return {
      headers,
      // (the envelope as given, "" for the null reverse-path; the headers
      // only stand in when there is none at all)
      envelope: envelope
        ? { from: envelope.from ?? '', to: envelope.to ?? [] }
        : {
            from: parsed.from?.value?.[0]?.address || '',
            to: parsed.to?.value?.map((v) => v.address) || []
          },
      body: {
        text: parsed.text || '',
        html: parsed.html || ''
      },
      size: Buffer.byteLength(raw),
      raw,
      mimeParts
    };
  }

  /**
   * Parse raw message into a flat MIME parts array using mailsplit.
   * Each part includes content-type, encoding, headers, and body content.
   * Enforces a maximum part count to prevent abuse from deeply nested messages.
   *
   * @param {Buffer} raw - Raw message bytes
   * @returns {Promise<Object[]>} Array of MIME part objects
   */
  async parseMimeTree(raw) {
    const MAX_MIME_PARTS = 100;
    const MAX_BODY_SIZE = 256 * 1024; // 256KB per part body

    return new Promise((resolve) => {
      const splitter = new Splitter();
      const parts = [];
      // (the index of each node, for the parent index of its children)
      const indexes = new Map();
      let currentPart = null;

      // Safety timeout to prevent hanging on malformed messages
      const timeout = setTimeout(() => {
        splitter.destroy();
        resolve(parts);
      }, 5000);

      splitter.on('data', (chunk) => {
        if (chunk.type === 'node') {
          // Enforce max parts limit
          if (parts.length >= MAX_MIME_PARTS) {
            return;
          }

          currentPart = {
            contentType: chunk.contentType || 'application/octet-stream',
            encoding: chunk.encoding || '',
            charset: chunk.charset || false,
            disposition: chunk.disposition || false,
            filename: chunk.filename || false,
            multipart: chunk.multipart || false,
            // (the part it is in, -1 for the message itself; see
            // getDescendantParts in engine.js)
            parentIndex:
              chunk.parentNode && indexes.has(chunk.parentNode)
                ? indexes.get(chunk.parentNode)
                : -1,
            // (by lowercase name, a value for each time a name is given, as
            // in parseMessageForSieve)
            headers: Object.create(null),
            // (the octets of the body, one character each ("latin1"), still
            // in its Content-Transfer-Encoding and charset)
            body: ''
          };
          indexes.set(chunk, parts.length);

          // Parse part headers
          try {
            const rawHeaders = chunk.getHeaders().toString();
            const headerLines = [];

            for (const line of rawHeaders.split(/\r?\n/)) {
              if (/^[ \t]/.test(line)) {
                if (headerLines.length > 0) {
                  headerLines[headerLines.length - 1] += ` ${line.trim()}`;
                }
              } else if (line) {
                headerLines.push(line);
              }
            }

            for (const line of headerLines) {
              const colonIdx = line.indexOf(':');
              if (colonIdx > 0) {
                const name = line.slice(0, colonIdx).trim().toLowerCase();
                let value = line.slice(colonIdx + 1).trim();
                try {
                  value = libmime.decodeWords(value);
                } catch {}

                const { headers } = currentPart;
                if (!(name in headers)) headers[name] = value;
                else if (Array.isArray(headers[name]))
                  headers[name].push(value);
                else headers[name] = [headers[name], value];
              }
            }
          } catch {
            // Header parsing failure is non-fatal
          }

          parts.push(currentPart);
        } else if (chunk.type === 'body' && chunk.value) {
          // (the part the body is of, none past MAX_MIME_PARTS; at most
          // MAX_BODY_SIZE octets of it)
          const part = parts[indexes.get(chunk.node)];
          if (part && part.body.length < MAX_BODY_SIZE)
            part.body += chunk.value.toString(
              'latin1',
              0,
              Math.min(chunk.value.length, MAX_BODY_SIZE - part.body.length)
            );
        }
      });

      splitter.on('end', () => {
        clearTimeout(timeout);
        resolve(parts);
      });

      splitter.on('error', (_err) => {
        clearTimeout(timeout);
        // Return whatever parts we collected so far
        resolve(parts);
      });

      // Feed the raw message into the splitter
      try {
        Readable.from(raw).pipe(splitter);
      } catch {
        clearTimeout(timeout);
        resolve(parts);
      }
    });
  }

  /**
   * Validate a Sieve script before saving
   *
   * @param {string} content - Script content
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateScript(content, options = {}) {
    return this.securityValidator.validateScript(content, {
      ...options,
      maxSize: this.config.maxScriptSize
    });
  }

  /**
   * Create a Redis-based duplicate cache for persistent duplicate detection (RFC 7352)
   *
   * @param {string} aliasId - Alias ID for namespacing
   * @returns {Promise<Object>} Duplicate cache object with has/add methods
   */
  async createDuplicateCache(aliasId) {
    const { client } = this;
    const prefix = `sieve:duplicate:${aliasId}:`;
    const defaultTtl = 7 * 24 * 60 * 60; // 7 days default TTL

    return {
      /**
       * Check if a key exists in the duplicate cache
       * @param {string} key - The duplicate key
       * @returns {Promise<boolean>} True if duplicate
       */
      async has(key) {
        if (!client) return false;
        const exists = await client.exists(prefix + key);
        return exists === 1;
      },

      /**
       * Add a key to the duplicate cache
       * @param {string} key - The duplicate key
       * @param {number} seconds - TTL in seconds (from :seconds tag)
       */
      async add(key, seconds) {
        if (!client) return;
        const ttl = seconds || defaultTtl;
        await client.set(prefix + key, '1', 'EX', ttl);
      }
    };
  }

  /**
   * Apply header changes to raw message (editheader extension)
   *
   * @param {Buffer} raw - Original raw message
   * @param {Array} changes - Array of header changes
   * @returns {Promise<Buffer>} Modified raw message
   */
  async applyHeaderChanges(raw, changes) {
    if (!changes || changes.length === 0) {
      return raw;
    }

    if (!Buffer.isBuffer(raw)) raw = Buffer.from(raw);

    // Split into headers and body at first double CRLF (the body is kept as
    // the octets it is: as UTF-8 text an 8bit body in another charset lost
    // every octet that is not UTF-8)
    const headerEndIndex = raw.indexOf('\r\n\r\n');
    if (headerEndIndex === -1) {
      // No body separator found, treat entire message as headers
      return raw;
    }

    let headerSection = raw.subarray(0, headerEndIndex).toString('utf8');
    const bodySection = raw.subarray(headerEndIndex);

    // Parse existing headers into array of {name, value} objects
    const headerLines = headerSection.split('\r\n');
    const headers = [];
    let currentHeader = null;

    for (const line of headerLines) {
      if (line.startsWith(' ') || line.startsWith('\t')) {
        // Continuation of previous header
        if (currentHeader) {
          currentHeader.value += '\r\n' + line;
        }
      } else {
        // New header
        if (currentHeader) {
          headers.push(currentHeader);
        }

        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          currentHeader = {
            name: line.slice(0, colonIndex),
            lower: line.slice(0, colonIndex).toLowerCase(),
            value: line.slice(colonIndex + 1)
          };
        } else {
          currentHeader = null;
        }
      }
    }

    if (currentHeader) {
      headers.push(currentHeader);
    }

    //
    // NOTE: the headers come from whoever sent the message and the changes
    //       from the script, so the work is counted (headers looked at, and
    //       values tested against each match) and bounded: a change for a
    //       name no header has is skipped, and past MAX_HEADER_EDIT_WORK the
    //       message is kept as it came, as for any error of the script
    //
    const counts = new Map();
    for (const header of headers)
      counts.set(header.lower, (counts.get(header.lower) || 0) + 1);
    let work = 0;
    const spend = (amount) => {
      work += amount;
      if (work > SieveIntegration.MAX_HEADER_EDIT_WORK)
        throw new Error('Sieve header changes exceeded the work allowed');
    };

    // Apply changes
    for (const change of changes) {
      if (change.action === 'add') {
        //
        // Header text is emitted verbatim below, so this is the last point
        // at which an `addheader` name/value from a user's script can be
        // made safe. The engine blocks protected header NAMES, but a value
        // (or name) containing CR/LF would otherwise be serialized as one or
        // more additional raw header lines -- smuggling e.g.
        // `Authentication-Results: ... dkim=pass` through an allowed header
        // and bypassing the protected-header check entirely. RFC 5322 field
        // names are printable ASCII excluding ':'; a header value has no
        // semantic newlines (folding is transport-only), so unfold to a space.
        //
        if (
          typeof change.name !== 'string' ||
          !/^[\u0021-\u0039\u003B-\u007E]+$/.test(change.name)
        ) {
          continue;
        }

        const safeValue = String(change.value ?? '')
          .replace(/\r\n|\r|\n/g, ' ')
          .replaceAll('\u0000', '');

        //
        // RFC 5293 section 4: a value that is not ASCII is encoded (RFC 2047)
        // and a long one folded, so the field is one RFC 5322 allows
        //
        const folded = libmime
          .foldLines(
            `${change.name}: ${
              /[^\u0020-\u007E\t]/.test(safeValue)
                ? libmime.encodeWords(safeValue, 'Q', 52)
                : safeValue
            }`,
            76
          )
          .trimEnd();

        const newHeader = {
          name: change.name,
          lower: change.name.toLowerCase(),
          value: folded.slice(change.name.length + 1)
        };
        counts.set(newHeader.lower, (counts.get(newHeader.lower) || 0) + 1);
        if (change.last) {
          // Add at end of headers
          spend(1);
          headers.push(newHeader);
        } else {
          // Add at beginning of headers
          spend(headers.length);
          headers.unshift(newHeader);
        }
      } else if (change.action === 'delete') {
        // Find and remove matching headers
        //
        // NOTE: the headers come from whoever sent the message, so this must
        //       stay linear in their number (removing them one at a time with
        //       `splice()` is quadratic); matches are kept or dropped in a
        //       single pass, and each pattern is compiled once
        const nameLower = change.name.toLowerCase();
        const count = counts.get(nameLower);
        if (!count) continue;
        const values = (change.values || []).map((value) =>
          getValueMatcher(value, change.matchType, change.comparator)
        );
        spend(headers.length + count * values.length);

        //
        // RFC 5293 section 5: without ":index" every field of the name is
        // deleted (the parser gives `index: null`), with it only the one it
        // counts to, from the first (or with ":last" from the last), and in
        // either case only if its value matches a value-pattern, if any are
        // given (matched as by the header test: unfolded and decoded)
        //
        const isEveryField = !Number.isInteger(change.index);
        const target = change.last ? count - change.index : change.index - 1;
        let position = 0;
        let kept = 0;
        for (const header of headers) {
          if (
            header.lower === nameLower &&
            (isEveryField || position++ === target) &&
            (values.length === 0 || values.some((matcher) => matcher(header)))
          )
            continue;
          headers[kept++] = header;
        }

        counts.set(nameLower, count - (headers.length - kept));
        headers.length = kept;
      }
    }

    // Rebuild header section
    headerSection = headers.map((h) => h.name + ':' + h.value).join('\r\n');

    return Buffer.concat([Buffer.from(headerSection, 'utf8'), bodySection]);
  }

  /**
   * Apply RFC 5703 replace actions to a raw MIME message: each replaces the
   * part its partIndex is the index of (in the parts of parseMimeTree, the
   * same order), or the whole message for a partIndex of null, with a
   * text/plain part or, with :mime, the MIME entity given.  A multipart part
   * replaced loses its children.
   *
   * @param {Buffer} raw - The raw message
   * @param {Array} replaceActions - Array of {partIndex, replacement, mime,
   *   subject, from}
   * @returns {Promise<Buffer>} Modified raw message
   */
  async applyReplaceActions(raw, replaceActions) {
    if (!replaceActions || replaceActions.length === 0) return raw;

    // (the last replace of a part wins)
    const actions = new Map();
    for (const action of replaceActions)
      actions.set(action.partIndex ?? 0, action);

    const indexes = new Map();
    // (the part replaced last: what is in it is left out)
    let replaced = null;
    const isInReplaced = (node) => {
      if (!replaced) return false;
      for (let n = node; n; n = n.parentNode) if (n === replaced) return true;
      return false;
    };

    const transform = new Transform({
      objectMode: true,
      transform(chunk, _encoding, done) {
        const node = chunk.type === 'node' ? chunk : chunk.node;
        if (chunk.type === 'node') indexes.set(chunk, indexes.size);
        if (isInReplaced(node)) return done();
        const action = chunk.type === 'node' && actions.get(indexes.get(chunk));
        if (!action) return done(null, chunk);

        replaced = chunk;
        const body = setReplacement(chunk, action);
        this.push(chunk);
        // (a multipart part's closing boundary, left out, ended the line)
        done(null, {
          type: 'body',
          node: chunk,
          value: chunk.multipart ? Buffer.concat([body, CRLF]) : body
        });
      }
    });

    return getStream.buffer(
      Readable.from(raw).pipe(new Splitter()).pipe(transform).pipe(new Joiner())
    );
  }

  /**
   * Send a notification (enotify extension, mailto method of RFC 5436)
   *
   * @param {Object} notification - Notification details
   * @param {Object} context - Context information (aliasAddress, session,
   *   headers of the message that triggered it)
   * @returns {Promise<void>}
   */
  async sendNotification(notification, context) {
    const mailto = parseMailto(notification.method);
    if (!mailto)
      throw new Error(
        `Unsupported notification method: ${notification.method}`
      );
    const recipients = [...mailto.to, ...mailto.cc];
    if (recipients.length === 0)
      throw new Error(`Invalid notification method: ${notification.method}`);

    // Access Emails model via mongoose connection to avoid circular dependency
    const conn = mongoose.connections.find(
      (c) => c[Symbol.for('connection.name')] === 'MONGO_URI'
    );
    if (!conn || !conn.models || !conn.models.Emails) {
      throw new Error(
        'Email notification not available - Emails model not loaded'
      );
    }

    const { Emails } = conn.models;

    // (a header of the message that triggered it)
    const getHeader = (name) =>
      [context.headers?.[name]].flat().find((v) => typeof v === 'string') || '';

    //
    // RFC 5436 section 2.7: the subject is the :message, or the "subject" of
    // the URI, or that of the message; the body the "body" of the URI (here
    // with the :message, or the From and Subject of the message, RFC 5435
    // section 3.6, without one); From is a :from of the alias's own address,
    // or the alias (other values are ignored, RFC 5435 section 3.3), and
    // "Auto-Submitted: auto-notified" names the owner of the script
    //
    const subject =
      notification.message ||
      mailto.subject ||
      getHeader('subject') ||
      `Notification from ${context.aliasAddress}`;
    const body =
      mailto.body ??
      (notification.message ||
        `From: ${getHeader('from')}\r\nSubject: ${getHeader('subject')}`);

    const node = new MimeNode('text/plain; charset=utf-8');
    node.setHeader(
      'From',
      getOwnFrom(notification.from, context.aliasAddress) ||
        context.aliasAddress
    );
    if (mailto.to.length > 0) node.setHeader('To', mailto.to.join(', '));
    if (mailto.cc.length > 0) node.setHeader('Cc', mailto.cc.join(', '));
    node.setHeader('Subject', subject.replace(/[\r\n]+/g, ' '));
    node.setHeader('Auto-Submitted', {
      prepared: true,
      value: `auto-notified; owner-email="${context.aliasAddress}"`
    });
    node.setHeader('X-Sieve-Notify', 'true');
    node.setHeader(
      'X-Sieve-Importance',
      ['1', '2', '3'].includes(notification.importance)
        ? notification.importance
        : '2'
    );
    node.setContent(body);

    await Emails.queue({
      info: {
        message: node.createReadStream(),
        envelope: { from: context.aliasAddress, to: recipients }
      },
      user: { id: context.session?.user?.alias_user_id || context.aliasId },
      is_bounce: false
    });
  }

  /**
   * Get supported Sieve capabilities
   *
   * @returns {Object} Capabilities object
   */
  getCapabilities() {
    return {
      capabilities: this.config.enabledExtensions,
      limits: {
        max_script_size: this.config.maxScriptSize,
        max_script_count: this.config.maxScriptCount,
        max_redirects_per_script: this.config.maxRedirectsPerScript,
        max_redirects_per_day: this.config.maxRedirectsPerDay,
        max_vacations_per_hour: this.config.maxVacationsPerHour
      }
    };
  }
}

/**
 * Create a Sieve integration instance with Forward Email configuration
 *
 * @param {Object} options - Options
 * @param {Object} options.store - Sieve script store
 * @param {Object} options.client - Redis client
 * @param {Object} options.resolver - DNS resolver for denylist checking
 * @returns {SieveIntegration} Integration instance
 */
function createSieveIntegration(options = {}) {
  // Merge with config from environment/config file
  const sieveConfig = {
    maxScriptSize: config.sieve?.maxScriptSize || DEFAULT_CONFIG.maxScriptSize,
    maxScriptCount:
      config.sieve?.maxScriptCount || DEFAULT_CONFIG.maxScriptCount,
    maxRedirectsPerScript:
      config.sieve?.maxRedirectsPerScript ||
      DEFAULT_CONFIG.maxRedirectsPerScript,
    maxRedirectsPerDay:
      config.sieve?.maxRedirectsPerDay || DEFAULT_CONFIG.maxRedirectsPerDay,
    maxVacationsPerHour:
      config.sieve?.maxVacationsPerHour || DEFAULT_CONFIG.maxVacationsPerHour,
    allowedRedirectDomains:
      config.sieve?.allowedRedirectDomains ||
      DEFAULT_CONFIG.allowedRedirectDomains,
    protectedHeaders:
      config.sieve?.protectedHeaders || DEFAULT_CONFIG.protectedHeaders
  };

  const store = options.store || getDefaultSieveStore();

  return new SieveIntegration({
    store,
    client: options.client,
    resolver: options.resolver,
    config: sieveConfig
  });
}

function getDefaultSieveStore() {
  try {
    const conn = mongoose.connections.find(
      (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
    );
    if (
      conn &&
      conn.models &&
      conn.models.SieveScripts &&
      typeof conn.models.SieveScripts.getActiveScript === 'function'
    ) {
      return conn.models.SieveScripts;
    }
  } catch {}

  return null;
}

module.exports = {
  SieveIntegration,
  createSieveIntegration
};
