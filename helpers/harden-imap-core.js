/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Input limits for the WildDuck IMAP core (@zone-eu/wildduck/imap-core),
// applied to its prototypes once, before the IMAP server accepts clients.
// The package version is pinned, so these guards live here rather than in a
// fork; each one only refuses input that no conforming client sends.
//
//  1. Literals before authentication.  imap-core answers `+ Go ahead` and
//     buffers a literal before it checks that the command may run in the
//     connection's state, with no limit on the number of literals in one
//     command.  An anonymous client could chain `a APPEND x {50000000}`
//     literals (or endless 1 KB ones) and exhaust the process' memory.
//     Before login only LOGIN and ID take literals, and only a few.
//
//  2. Literals per command after login: a bounded count, and a total no
//     larger than one message (APPEND) plus a small allowance.
//
//  3. Command line length.  A line without CRLF is kept (and re-scanned on
//     every chunk) until the newline arrives, without a limit, so a single
//     endless line exhausted memory and CPU.  Inflated COMPRESS=DEFLATE
//     input goes through the same parser, which made a small compressed
//     payload expand into an unbounded line; the cap bounds that as well.
//     A client that exceeds it is disconnected.
//
//     A whole line is parsed before its command is looked at, also before
//     authentication, in time that grows with the square of what the line
//     holds: a sequence set of 64 KB takes a quarter of a second to parse,
//     one of 256 KB took 18 seconds and one of 512 KB over a minute.  (It
//     was written out again for the log in such time, too, 400,000 words
//     in minutes: the compiler of the core writes in one pass now, see
//     patches/@zone-eu__wildduck@1.48.0.patch.)  So the lines of one
//     command, its literals aside, are as long as other servers take them
//     (Dovecot reads 64 KB by default, Exchange 10 KB), and 8 KB before
//     authentication, when a LOGIN or an ID is all there is to read.
//
//  4. SEARCH terms.  Every term is evaluated against every message of the
//     mailbox (and imap-core's own term parser takes time that grows with
//     the square of the term count), so one SEARCH with tens of thousands
//     of terms, which fits in one line, kept a worker busy for minutes.
//
//  5. STARTTLS.  What is sent between a STARTTLS and its handshake is not
//     the client's for sure (anyone between the two can add to what is not
//     encrypted yet), and a client sends nothing then.  The core keeps the
//     start of a line that was sent then, and the first line sent inside
//     the session ends it: a command sent in the clear ran inside the
//     session.  So would whole commands, now that each is read from the
//     event loop (see `_onCommand` below), when the handshake is done
//     before all of them are read.  A connection with anything to read in
//     between is closed.  (Only where STARTTLS is offered: not on the
//     ports that start with TLS, see imap-server.js.)
//
//     The handshake itself is not read as such: the core starts its side
//     from the event loop, after it has answered, and nothing is read from
//     the client until then.
//
//  6. Commands before authentication.  A client has a handful to send
//     before it signs in (CAPABILITY, STARTTLS, ID, a LOGIN or an
//     AUTHENTICATE).  Anyone could send them without end and never read
//     the answers, which were kept for it (13 MB within 18 seconds of
//     CAPABILITY commands), with the process busy all the while.  A client
//     that sends more than a hundred is disconnected.
//

const {
  IMAPConnection
} = require('@zone-eu/wildduck/imap-core/lib/imap-connection');
const { IMAPCommand } = require('@zone-eu/wildduck/imap-core/lib/imap-command');
const { IMAPStream } = require('@zone-eu/wildduck/imap-core/lib/imap-stream');
const searchCommand = require('@zone-eu/wildduck/imap-core/lib/commands/search');
const fetchCommand = require('@zone-eu/wildduck/imap-core/lib/commands/fetch');
const starttlsCommand = require('@zone-eu/wildduck/imap-core/lib/commands/starttls');

// longest command line (UID sets of large mailboxes can be long), and the
// longest before authentication (a LOGIN, an ID)
const MAX_LINE_LENGTH = 64 * 1024;
const MAX_PRE_AUTH_LINE_LENGTH = 8 * 1024;

// commands before authentication (each line that starts one, or answers a
// challenge)
const MAX_PRE_AUTH_COMMANDS = 100;

// literals allowed in one command before and after authentication
const MAX_PRE_AUTH_LITERALS = 4;
const MAX_LITERALS = 1000;

// beyond the message itself (APPEND) or the 1 KB literals of other commands
const LITERAL_BYTES_ALLOWANCE = 1024 * 1024;

const PRE_AUTH_LITERAL_COMMANDS = new Set(['LOGIN', 'ID']);

// search keys, values and parentheses in one SEARCH (a client search uses
// a handful; "OR FROM a FROM b" is 5)
const MAX_SEARCH_TOKENS = 1000;

// and of the keys each read every message of the mailbox (its text, its
// headers, FROM to SUBJECT among them, or its flags: keywords, and the
// \Answered and \Recent flags, which are read as keywords are), each a
// pass over it, with the number of values each takes
const MAX_SEARCH_SCANS = 32;
const SCANNING_KEYS = new Map([
  ['BODY', 1],
  ['TEXT', 1],
  ['HEADER', 2],
  ['FROM', 1],
  ['TO', 1],
  ['CC', 1],
  ['BCC', 1],
  ['SUBJECT', 1],
  ['KEYWORD', 1],
  ['UNKEYWORD', 1],
  ['ANSWERED', 0],
  ['UNANSWERED', 0],
  ['RECENT', 0],
  ['NEW', 0],
  ['OLD', 0]
]);

// data items in one FETCH (a client that fetches a message part by part
// asks for two of each part), how often one of them may be asked for, and
// how many may each filter the header by a list of fields (a client asks
// for one): each message's response is built whole before it is sent, so an
// item asked for many times (`BODY.PEEK[]<0.N>`, each a little different)
// would be the message as many times over, and each list of fields reads
// every line of the header. (Sections that hold each other, as BODY[1]
// holds BODY[1.1], are bounded where the response is built: see
// `MAX_CONTENT_EXTRA` in helpers/get-query-response.)
const MAX_FETCH_ITEMS = 1024;
const MAX_FETCH_REPEATS = 4;
const MAX_FETCH_HEADER_LISTS = 8;

const sectionOf = (item) => String(item?.section?.[0]?.value ?? '');

// an item without the range asked of it, and with its part numbers as
// numbers (BODY[1.2] for BODY.PEEK[01.2]<0.10>)
function fetchItemKey(item) {
  const name = String(
    typeof item === 'string' ? item : item?.value ?? ''
  ).replace(/\.peek$/i, '');
  if (!item?.section) return name.toUpperCase();
  const section = sectionOf(item).replace(/\d+/g, Number);
  return `${name}[${section}${JSON.stringify(
    item.section.slice(1)
  )}]`.toUpperCase();
}

function hasTooManyItems(items) {
  if (items.length > MAX_FETCH_ITEMS) return true;
  const counts = new Map();
  let lists = 0;
  for (const item of items) {
    if (/header\.fields/i.test(sectionOf(item))) lists++;
    const key = fetchItemKey(item);
    const count = (counts.get(key) || 0) + 1;
    if (count > MAX_FETCH_REPEATS || lists > MAX_FETCH_HEADER_LISTS)
      return true;
    counts.set(key, count);
  }

  return false;
}

function countTokens(elements, limit) {
  let count = 0;
  let scans = 0;
  const stack = [elements];
  while (stack.length > 0) {
    const items = stack.pop();
    // (the values a key takes are not keys: `SUBJECT "to"`, `HEADER from x`)
    let values = 0;
    for (const item of items) {
      count++;
      if (count > limit) return count;
      if (Array.isArray(item)) stack.push(item);
      else if (values > 0) values--;
      else if (
        typeof item?.value === 'string' &&
        SCANNING_KEYS.has(item.value.toUpperCase())
      ) {
        if (++scans > MAX_SEARCH_SCANS) return limit + 1;
        values = SCANNING_KEYS.get(item.value.toUpperCase());
      }
    }
  }

  return count;
}

const RE_COMMAND = /^(\S+)(?:\s+((?:authenticate |uid )?\S+)|$)/i;

function refuse(command, { tag, message, code }, callback) {
  command.payload = '';
  command.literals = [];
  command.connection.send(`${tag || '*'} ${message}`);
  const err = new Error(message);
  err.responseCode = 400;
  err.code = code;
  return callback(err);
}

function hardenImapCore() {
  if (IMAPCommand.prototype.append.isHardened) return;

  const { append } = IMAPCommand.prototype;
  function hardenedAppend(command, callback) {
    if (
      command &&
      command.literal &&
      typeof this.connection._nextHandler !== 'function'
    ) {
      // the command name is only parsed from the first line
      let { tag } = this;
      let name = this.command;
      if (this.first) {
        const match = RE_COMMAND.exec(command.value) || [];
        tag = match[1];
        name = (match[2] || '').trim().toUpperCase();
      }

      this.feLiteralCount = (this.feLiteralCount || 0) + 1;
      this.feLiteralBytes =
        (this.feLiteralBytes || 0) + (Number(command.expecting) || 0);

      if (this.connection.state === 'Not Authenticated') {
        if (!PRE_AUTH_LITERAL_COMMANDS.has(name))
          return refuse(
            this,
            {
              tag,
              message: 'NO Literals are not accepted before authentication',
              code: 'LiteralNotAllowed'
            },
            callback
          );

        if (this.feLiteralCount > MAX_PRE_AUTH_LITERALS)
          return refuse(
            this,
            { tag, message: 'NO Too many literals', code: 'TooManyLiterals' },
            callback
          );
      } else {
        const maxMessage =
          Number(this.connection._server.options.maxMessage) || 0;
        if (
          this.feLiteralCount > MAX_LITERALS ||
          this.feLiteralBytes > maxMessage + LITERAL_BYTES_ALLOWANCE
        )
          return refuse(
            this,
            {
              tag,
              message: 'NO [TOOBIG] Literals too large',
              code: 'TooManyLiterals'
            },
            callback
          );
      }
    }

    return append.call(this, command, callback);
  }

  hardenedAppend.isHardened = true;
  IMAPCommand.prototype.append = hardenedAppend;

  const searchHandler = searchCommand.handler;
  searchCommand.handler = function (command, callback) {
    if (
      countTokens([command.attributes || []].flat(), MAX_SEARCH_TOKENS) >
      MAX_SEARCH_TOKENS
    )
      return callback(null, {
        response: 'NO',
        code: 'LIMIT',
        message: 'Too many search terms'
      });

    return searchHandler.call(this, command, callback);
  };

  const fetchHandler = fetchCommand.handler;
  fetchCommand.handler = function (command, callback) {
    const items = [command.attributes?.[1] || []].flat();
    if (hasTooManyItems(items))
      return callback(null, {
        response: 'NO',
        code: 'LIMIT',
        message: 'Too many fetch items'
      });

    return fetchHandler.call(this, command, callback);
  };

  //
  // The core answers a STARTTLS, and starts its side of the handshake from
  // the event loop: a turn after the answer when the STARTTLS was itself
  // read from the event loop (one sent in one write with the command before
  // it, see `_onCommand` below).  Nothing is read from the client until
  // then, so that a handshake it starts as soon as it is answered is left
  // for the TLS layer, and not read as a command (which ends a connection
  // that is being upgraded, see above).
  //
  const starttlsHandler = starttlsCommand.handler;
  starttlsCommand.handler = function (command, callback) {
    if (!this.secure) this._socket.pause();
    return starttlsHandler.call(this, command, callback);
  };

  //
  // The parser keeps an unterminated line in `_remainder` (see
  // imap-stream.js `_readValue`).  Checked after each chunk is processed,
  // so it only ever measures a partial line, never literal data.
  //
  const { _write } = IMAPStream.prototype;
  IMAPStream.prototype._write = function (chunk, encoding, done) {
    return _write.call(this, chunk, encoding, (err) => {
      if (
        !err &&
        this._remainder.length > 0 &&
        typeof this.feRefusesRemainder === 'function' &&
        this.feRefusesRemainder(this._remainder.length)
      )
        this._remainder = '';

      done(err);
    });
  };

  // (nothing that was sent after it is read: the parser hands each line it
  // reads to the connection, and reads on once it is called back)
  function disconnect(message) {
    if (message)
      try {
        this.send(message);
      } catch {}

    if (this._parser) this._parser.oncommand = () => {};
    this.close();
  }

  function overflow() {
    disconnect.call(this, '* BYE Line too long');
  }

  // a line without an end yet is refused when it is too long, and when it
  // was sent between a STARTTLS and its handshake (what is sent inside the
  // session would end it; nothing can be said in the clear by then, see
  // `upgrade` in imap-core's commands/starttls.js)
  function refusesRemainder(length) {
    if (length > MAX_LINE_LENGTH) overflow.call(this);
    else if (this._upgrading) disconnect.call(this);
    else return false;
    return true;
  }

  const { _setListeners } = IMAPConnection.prototype;
  IMAPConnection.prototype._setListeners = function (...args) {
    const result = _setListeners.apply(this, args);
    if (this._parser)
      this._parser.feRefusesRemainder = refusesRemainder.bind(this);
    return result;
  };

  //
  // Every line of a command comes through here before it is parsed: the
  // last one, and each one that ends in a literal.
  //
  // The parser reads the next line when it is called back, from inside that
  // call when a command is answered at once (a NOOP, one that is refused),
  // one level deeper for each line of what was written to the socket: a
  // thousand NOOPs in one write (8 KB) ran out of stack, as an uncaught
  // exception, and the connection was never answered again.  So it is
  // called back from the event loop then.
  //
  // (That is also after the handshake of a STARTTLS has started, see
  // `upgrade` in imap-core's commands/starttls.js: a line that follows a
  // STARTTLS is read while it goes on, and ends the connection.)
  //
  const { _onCommand } = IMAPConnection.prototype;
  IMAPConnection.prototype._onCommand = function (command, callback) {
    if (this._upgrading) {
      disconnect.call(this);
      return;
    }

    const isFirstLine = !this._currentCommand;
    if (isFirstLine) this.feCommandLength = 0;
    this.feCommandLength += command?.value?.length || 0;
    if (
      this.feCommandLength >
      (this.state === 'Not Authenticated'
        ? MAX_PRE_AUTH_LINE_LENGTH
        : MAX_LINE_LENGTH)
    ) {
      // (and it is not called back)
      overflow.call(this);
      return;
    }

    // (a command that is refused at a literal is one as well: the next line
    // starts another)
    if (isFirstLine && this.state === 'Not Authenticated') {
      this.fePreAuthCommands = (this.fePreAuthCommands || 0) + 1;
      if (this.fePreAuthCommands > MAX_PRE_AUTH_COMMANDS) {
        disconnect.call(this, '* BYE Too many commands before authentication');
        return;
      }
    }

    if (typeof callback !== 'function')
      return _onCommand.call(this, command, callback);

    let isReturned = false;
    const result = _onCommand.call(this, command, (...args) => {
      if (isReturned) callback(...args);
      else setImmediate(callback, ...args);
    });
    isReturned = true;
    return result;
  };
}

hardenImapCore();

module.exports = {
  hardenImapCore,
  MAX_LINE_LENGTH,
  MAX_PRE_AUTH_LINE_LENGTH,
  MAX_PRE_AUTH_COMMANDS,
  MAX_PRE_AUTH_LITERALS,
  MAX_SEARCH_TOKENS,
  MAX_SEARCH_SCANS,
  MAX_FETCH_ITEMS,
  MAX_FETCH_REPEATS,
  MAX_FETCH_HEADER_LISTS
};
