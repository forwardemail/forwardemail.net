/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dns = require('node:dns');

// undici.fetch needs String.prototype.toWellFormed (not in Node 18)
// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

const undici = require('undici');

const isPrivateHost = require('#helpers/is-private-host');
const normalizeRdapUrl = require('#helpers/normalize-rdap-url');

//
// `fetch` for WHOIS/RDAP lookups of user-supplied domains.
//
// The URLs come from the RDAP bootstrap data, from links in RDAP responses
// (the registrar's RDAP server) and from redirects (rdap.org redirects to the
// registry), so none of them are under our control.  Redirects are followed
// here one hop at a time and every target must be a public http(s) host,
// and the connection itself is only made to a public address (so a host that
// resolves to a public address when checked and a private one when connecting
// is refused too).
//

const MAX_REDIRECTS = 5;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function createError(message) {
  const err = new Error(message);
  err.code = 'EPRIVATEADDR';
  return err;
}

// connect-time check of the address actually connected to
function lookup(hostname, options, fn) {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return fn(err);
    if (
      addresses.length === 0 ||
      addresses.some(({ address }) => isPrivateHost(address))
    )
      return fn(
        createError(`RDAP host ${hostname} resolves to a non-public address`)
      );
    if (options.all) return fn(null, addresses);
    fn(null, addresses[0].address, addresses[0].family);
  });
}

const dispatcher = new undici.Agent({ connect: { lookup } });

async function assertPublicTarget(url) {
  if (url.protocol !== 'https:' && url.protocol !== 'http:')
    throw createError(`RDAP URL ${url.href} must use HTTP or HTTPS`);
  if (await rdapFetch.isPrivateTarget(url.hostname))
    throw createError(`RDAP host ${url.hostname} is not a public host`);
}

async function rdapFetch(input, options = {}) {
  let url = normalizeRdapUrl(input);
  for (let redirects = 0; ; redirects++) {
    await assertPublicTarget(url);

    const response = await undici.fetch(url, {
      ...options,
      redirect: 'manual',
      dispatcher: rdapFetch.dispatcher
    });

    if (!REDIRECT_STATUSES.has(response.status)) return response;

    const location = response.headers.get('location');
    try {
      await response.body?.cancel();
    } catch {}

    if (!location) throw createError('RDAP redirect without a location');
    if (redirects >= MAX_REDIRECTS)
      throw createError(`RDAP lookup exceeded ${MAX_REDIRECTS} redirects`);
    url = new URL(location, url);
  }
}

// (exposed so tests against local servers can allow loopback targets)
rdapFetch.isPrivateTarget = isPrivateHost.isPrivateHostResolved;
rdapFetch.dispatcher = dispatcher;

module.exports = rdapFetch;
