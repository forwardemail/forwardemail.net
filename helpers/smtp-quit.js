/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const SMTPConnection = require('nodemailer/lib/smtp-connection');

const config = require('#config');

//
// Nodemailer ends an SMTP session by closing the connection without a QUIT
// command (and has no plans to send one, since some servers never closed the
// connection after it and the client hung):
// <https://github.com/nodemailer/nodemailer/issues/1292#issuecomment-908221345>
//
// RFC 5321 (section 4.1.1.10) says a client MUST NOT close the connection
// before it sends QUIT, and a server that counts the sessions a sending IP
// has open (e.g. Comcast, "421 Too many sessions opened") may count one that
// was dropped without QUIT for longer than one that ended with it.
//
// A transport created with `quitBeforeClose: true` sends QUIT when nodemailer
// closes a session that is idle (no command waiting for a reply, nothing
// mid-TLS), and closes the connection on the reply or after
// `config.smtpQuitTimeout` at the latest. After an error (e.g. a 421
// greeting) nodemailer closes the connection right after the QUIT instead,
// without waiting for the reply. The delivery's result is already known by
// then, so it never waits for this, and any error after it (e.g. a server
// that closes without replying) is ignored. Transports without the option
// are left as they are.
//
// (this relies on nodemailer internals, see test/helpers/smtp-quit.js)
//

const NOOP = () => {};

const { close, quit } = SMTPConnection.prototype;

function canQuit(connection) {
  const socket = connection._socket;
  return Boolean(
    connection.options?.quitBeforeClose === true &&
      !connection._quitting &&
      !connection._closing &&
      !connection._destroyed &&
      connection.stage === 'connected' &&
      !connection.upgrading &&
      !connection._currentDataStream &&
      Array.isArray(connection._responseActions) &&
      connection._responseActions.length === 0 &&
      typeof connection._sendCommand === 'function' &&
      socket &&
      !socket.destroyed &&
      socket.writable
  );
}

function closeWithQuit() {
  if (!canQuit(this)) return close.call(this);

  this._quitting = true;

  // (nodemailer listens for one error per session, which is over by now)
  this.on('error', NOOP);

  const timer = setTimeout(() => close.call(this), config.smtpQuitTimeout);
  if (typeof timer.unref === 'function') timer.unref();
  this.once('end', () => clearTimeout(timer));

  try {
    this._sendCommand('QUIT');
    // (the reply closes the connection; nodemailer treats a server that
    // closes it first, while this is the next action, as a clean close)
    this._responseActions.push(this.close);
  } catch {
    clearTimeout(timer);
    close.call(this);
  }
}

// (a QUIT nodemailer sends itself, e.g. after verify(), is not sent twice)
function quitOnce(...args) {
  this._quitting = true;
  return quit.apply(this, args);
}

if (SMTPConnection.prototype.close !== closeWithQuit) {
  SMTPConnection.prototype.close = closeWithQuit;
  SMTPConnection.prototype.quit = quitOnce;
}

module.exports = { canQuit };
