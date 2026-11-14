/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import net from 'node:net';
import tls from 'node:tls';

import SMTPConnection from 'nodemailer/lib/smtp-connection/index.js';

// Answers that mean the local mail server could not be reached (the sender
// is asked to try again and the server's owner is told)
const CONNECTION_CODES = {
  ECONNECTION: 'LOCAL_UNREACHABLE',
  ECONNREFUSED: 'LOCAL_UNREACHABLE',
  EHOSTUNREACH: 'LOCAL_UNREACHABLE',
  ENETUNREACH: 'LOCAL_UNREACHABLE',
  ENOTFOUND: 'LOCAL_UNREACHABLE',
  EDNS: 'LOCAL_UNREACHABLE',
  ESOCKET: 'LOCAL_UNREACHABLE',
  ECONNRESET: 'LOCAL_UNREACHABLE',
  EPROTOCOL: 'LOCAL_UNREACHABLE',
  ETIMEDOUT: 'LOCAL_TIMEOUT',
  ETLS: 'LOCAL_TLS',
  EAUTH: 'LOCAL_AUTH'
};

function getOptions(local) {
  return {
    host: local.host,
    port: local.port,
    name: local.name,
    lmtp: local.protocol === 'lmtp',
    secure: local.tls === 'implicit',
    ignoreTLS: local.tls === 'none',
    requireTLS: local.tls === 'starttls',
    tls: { rejectUnauthorized: Boolean(local.rejectUnauthorized) },
    connectionTimeout: local.connectTimeout,
    greetingTimeout: local.greetingTimeout,
    socketTimeout: local.socketTimeout,
    // (the mail server is the one its owner configured, on their network)
    allowInternalNetworkInterfaces: true,
    disableFileAccess: true,
    disableUrlAccess: true
  };
}

function toRejection(error, address) {
  return {
    address,
    code: Number(error.responseCode) || 451,
    response: String(error.response || error.message || 'Rejected').slice(
      0,
      1000
    )
  };
}

//
// Delivers one message to the local mail server over SMTP or LMTP and
// resolves with what the tunnel is answered with:
//
//   { accepted: [...], rejected: [{ address, code, response }], response }
//   { error: { code, smtp_code, message } }
//
// It never rejects: every failure is an answer.
//
export function deliver(local, envelope, raw) {
  return new Promise((resolve) => {
    const connection = new SMTPConnection(getOptions(local));
    let isDone = false;

    function done(result) {
      if (isDone) return;
      isDone = true;
      try {
        connection.close();
      } catch {}

      resolve(result);
    }

    // The server could not be reached or used: the sender is asked to retry
    // (also when it greets with an error, e.g. 554 while it is overloaded)
    function unreachable(error) {
      done({
        error: {
          code: CONNECTION_CODES[error.code] || 'LOCAL_UNREACHABLE',
          message: String(error.response || error.message || error).slice(
            0,
            1000
          )
        }
      });
    }

    // The server answered the message itself: its answer is passed on
    function fail(error) {
      if (!error.responseCode) return unreachable(error);
      done({
        error: {
          code: 'REJECTED',
          smtp_code: Number(error.responseCode),
          response: String(error.response || error.message).slice(0, 1000),
          message: String(error.message).slice(0, 1000)
        }
      });
    }

    connection.once('error', unreachable);
    connection.connect((error) => {
      if (error) return unreachable(error);

      const send = () => {
        connection.send(
          { from: envelope.from || '', to: envelope.to },
          raw,
          (error, info) => {
            if (error) {
              // Every recipient was refused
              if (
                error.code === 'EENVELOPE' &&
                Array.isArray(error.rejectedErrors) &&
                error.rejectedErrors.length > 0
              )
                return done({
                  accepted: [],
                  rejected: error.rejectedErrors.map((error) =>
                    toRejection(error, error.recipient)
                  ),
                  response: String(error.response || error.message).slice(
                    0,
                    1000
                  )
                });
              return fail(error);
            }

            done({
              accepted: info.accepted || [],
              rejected: (info.rejectedErrors || []).map((error) =>
                toRejection(error, error.recipient)
              ),
              response: String(info.response || '250 OK').slice(0, 1000)
            });
          }
        );
      };

      if (!local.user) return send();
      connection.login({ user: local.user, pass: local.pass }, (error) => {
        if (error) return unreachable(error);
        send();
      });
    });
  });
}

//
// Checks that the local mail server accepts connections and greets, without
// sending anything. Resolves with { ok, message }.
//
export function probe(local, timeout = 5000) {
  return new Promise((resolve) => {
    let isDone = false;
    const options = { host: local.host, port: local.port };
    const socket =
      local.tls === 'implicit'
        ? tls.connect({
            ...options,
            rejectUnauthorized: Boolean(local.rejectUnauthorized)
          })
        : net.connect(options);

    function done(ok, message) {
      if (isDone) return;
      isDone = true;
      clearTimeout(timer);
      socket.destroy();
      resolve({ ok, message });
    }

    const timer = setTimeout(
      () => done(false, `No greeting from ${local.host}:${local.port}`),
      timeout
    );
    socket.once('error', (error) => done(false, error.message));
    socket.once('data', (data) => {
      const greeting = data.toString().split(/\r?\n/)[0].slice(0, 200);
      if (greeting.startsWith('220')) done(true, greeting);
      else done(false, `Unexpected greeting: ${greeting}`);
    });
  });
}
