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

const {
  IMAPConnection
} = require('@zone-eu/wildduck/imap-core/lib/imap-connection');
const { IMAPCommand } = require('@zone-eu/wildduck/imap-core/lib/imap-command');
const { IMAPStream } = require('@zone-eu/wildduck/imap-core/lib/imap-stream');

// longest command line (UID sets of large mailboxes can be long)
const MAX_LINE_LENGTH = 1024 * 1024;

// literals allowed in one command before and after authentication
const MAX_PRE_AUTH_LITERALS = 4;
const MAX_LITERALS = 1000;

// beyond the message itself (APPEND) or the 1 KB literals of other commands
const LITERAL_BYTES_ALLOWANCE = 1024 * 1024;

const PRE_AUTH_LITERAL_COMMANDS = new Set(['LOGIN', 'ID']);

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

  //
  // The parser keeps an unterminated line in `_remainder` (see
  // imap-stream.js `_readValue`).  Checked after each chunk is processed,
  // so it only ever measures a partial line, never literal data.
  //
  const { _write } = IMAPStream.prototype;
  IMAPStream.prototype._write = function (chunk, encoding, done) {
    return _write.call(this, chunk, encoding, (err) => {
      if (!err && this._remainder.length > MAX_LINE_LENGTH) {
        this._remainder = '';
        if (typeof this.feOnOverflow === 'function') this.feOnOverflow();
      }

      done(err);
    });
  };

  const { _setListeners } = IMAPConnection.prototype;
  IMAPConnection.prototype._setListeners = function (...args) {
    const result = _setListeners.apply(this, args);
    if (this._parser)
      this._parser.feOnOverflow = () => {
        try {
          this.send('* BYE Line too long');
        } catch {}

        this.close();
      };

    return result;
  };
}

hardenImapCore();

module.exports = {
  hardenImapCore,
  MAX_LINE_LENGTH,
  MAX_PRE_AUTH_LITERALS
};
