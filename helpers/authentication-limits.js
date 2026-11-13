/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const { authenticate } = require('mailauth');

const { checkFromLimits } = require('#helpers/header-limits');

//
// Limits on what authenticating a message (mailauth's `authenticate()`, on
// the main thread) may cost:
//
// - mailauth feeds the body to one hasher for each distinct DKIM-Signature
//   (canonicalization, algorithm and `l=`), before any record is looked up:
//   300 signatures with distinct `l=` values on a 5 MB body take seconds of
//   CPU; legitimate mail carries a handful (the author's domain, an ESP, a
//   list or two)
// - each signature, SPF mechanism and ARC set is a DNS query, which mailauth
//   makes without a limit of its own on their number or how long they take
//   together
//
const limits = {
  // DKIM-Signature fields read (the first ones: our own signature comes
  // first on mail we send)
  dkimSignatures: 10,
  // DNS queries for one message: two SPF checks (envelope sender and From
  // domain) of up to about 200 each, the DKIM signatures, ARC sets, DMARC
  // and BIMI all fit
  queries: 600,
  // how long its queries may take in all (each query has its resolver's own
  // time limit as well)
  timeout: 45_000
};

// the error a query gets past the limits: mailauth reads ETIMEOUT as a
// temporary error (temperror), as for any query that timed out
function exceeded(message) {
  const err = new Error(message);
  err.code = 'ETIMEOUT';
  return err;
}

//
// A resolver for one message (`resolve(name, type)`, as mailauth calls it)
// that makes at most `queries` queries, and none once `timeout` has passed
// since it was made (one still waiting then is answered ETIMEOUT)
//
function createBoundedResolver(
  resolve,
  { queries = limits.queries, timeout = limits.timeout } = {}
) {
  const until = Date.now() + timeout;
  let made = 0;
  return async (name, type) => {
    const left = until - Date.now();
    if (left <= 0)
      throw exceeded(`DNS queries for this message took over ${timeout} ms`);
    if (made >= queries)
      throw exceeded(`More than ${queries} DNS queries for this message`);
    made++;
    let timer;
    try {
      return await Promise.race([
        resolve(name, type),
        new Promise((_, reject) => {
          timer = setTimeout(
            () =>
              reject(
                exceeded(`DNS queries for this message took over ${timeout} ms`)
              ),
            left
          );
        })
      ]);
    } finally {
      clearTimeout(timer);
    }
  };
}

//
// A raw message with only its first `max` DKIM-Signature fields (each with
// its folded lines), its body untouched; the same Buffer when it has no
// more than that
//
function keepDkimSignatures(raw, max = limits.dkimSignatures) {
  if (!Buffer.isBuffer(raw)) return raw;
  // (the header, up to the empty line, as `authenticateSent` and mailauth
  //  find it: a line break followed by LF or CR LF; latin1 keeps every byte
  //  as it is)
  const ends = [raw.indexOf('\n\r\n'), raw.indexOf('\n\n')].filter(
    (index) => index !== -1
  );

  // (each header line with its line break; the rest starts with the empty
  //  line)
  const headEnd = ends.length === 0 ? raw.length : Math.min(...ends) + 1;
  const header = raw.subarray(0, headEnd).toString('latin1');
  const lines = header.split(/(?<=\n)/);
  // (a folded line goes with the field before it, and a field is named, as
  //  mailauth reads them, see `headerFields` in `helpers/header-limits`:
  //  "DKIM-Signature\xa0:" is one, and so is its line starting with "\v";
  //  the first line, with no field before it, is a field however it starts)
  const fields = [];
  for (const [i, line] of lines.entries()) {
    if (i === 0 || !/^\s/.test(line)) fields.push([line]);
    else fields.at(-1).push(line);
  }

  let count = 0;
  let dropped = false;
  const kept = [];
  for (const field of fields) {
    // (its name of its lines joined, up to the first ":", which may be on a
    //  folded line, "DKIM-Signature\r\n :"; all of them for none)
    let head = '';
    for (const line of field) {
      const colon = line.indexOf(':');
      head += colon === -1 ? line : line.slice(0, colon);
      if (colon !== -1) break;
    }

    if (head.trim().toLowerCase() === 'dkim-signature' && ++count > max) {
      dropped = true;
      continue;
    }

    // (line by line: a field may have more lines than a call takes)
    for (const line of field) kept.push(line);
  }

  if (!dropped) return raw;
  return Buffer.concat([
    Buffer.from(kept.join(''), 'latin1'),
    raw.subarray(headEnd)
  ]);
}

//
// mailauth's `authenticate()` for a message we send (see
// `helpers/process-email.js`): only its first DKIM-Signature fields, of which
// ours is the first, and at most so many DNS queries (`options.resolver`
// is the resolver's `resolve`)
//
async function authenticateSent(raw, options) {
  // (not one whose From field mailauth would take seconds to read, see
  //  `helpers/header-limits`, e.g. queued before it was refused as it was
  //  submitted: no signature of it is verified, as for one it could not)
  if (Buffer.isBuffer(raw)) {
    const end = raw.indexOf('\n\r\n');
    const bare = raw.indexOf('\n\n');
    const stop = [end, bare].filter((index) => index !== -1);
    const header = raw.subarray(
      0,
      stop.length > 0 ? Math.min(...stop) + 1 : raw.length
    );
    if (checkFromLimits(header))
      return { dkim: { results: [] }, spf: null, dmarc: null };
  }

  // (`timeout`: how long its DNS queries may take in all, at most
  //  `limits.timeout`)
  const { timeout, ...rest } = options;
  return authenticate(keepDkimSignatures(raw), {
    ...rest,
    resolver: createBoundedResolver(options.resolver, {
      timeout:
        Number.isFinite(timeout) && timeout > 0
          ? Math.min(timeout, limits.timeout)
          : limits.timeout
    })
  });
}

module.exports = {
  limits,
  authenticateSent,
  createBoundedResolver,
  keepDkimSignatures
};
