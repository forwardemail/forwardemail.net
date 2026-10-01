/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

const isPrivateHost = require('#helpers/is-private-host');

//
// Guards for outbound port 25 delivery through `@forwardemail/mx-connect`.
//
// mx-connect's own `blockLocalAddresses` option only rejects the "loopback"
// and "private" ranges (plus unspecified/broadcast), so a recipient domain
// whose MX/A/AAAA records (or an IP address used as the delivery target)
// point at e.g. 169.254.169.254, 100.64.0.0/10, fc00::/7 or
// ::ffff:127.0.0.1 would otherwise be connected to.  Only public unicast
// addresses (as classified by `isPrivateHost`) are allowed.
//

const ADDRESS_TYPES = new Set(['A', 'AAAA']);

function isPublicAddress(address) {
  return (
    typeof address === 'string' && isIP(address) && !isPrivateHost(address)
  );
}

function createPrivateHostError(host, domain) {
  const error = new Error(
    `Unable to deliver email to the IP address [${host}] resolved for the Mail Exchange (MX) server of "${domain}" since it is not a publicly routable address`
  );
  error.code = 'EPRIVATEHOST';
  error.response = `DNS Error: ${error.message}`;
  error.category = 'dns';
  return error;
}

//
// Wrap a callback-style `dnsOptions.resolve` function so that A/AAAA answers
// only contain public unicast addresses.  Dropping the non-public answers (as
// mx-connect does for its own blocked ranges) lets delivery continue with
// any other valid MX host, and a host with no public address left is treated
// as having no address at all.  Other record types pass through unchanged.
//
function createPublicResolve(resolve) {
  return function (name, type, fn) {
    if (typeof type === 'function') {
      fn = type;
      type = undefined;
    }

    const isAddressLookup =
      type === undefined || ADDRESS_TYPES.has(String(type).toUpperCase());

    const cb = (err, records) => {
      if (err || !isAddressLookup || !Array.isArray(records))
        return fn(err, records);
      fn(
        null,
        records.filter((record) => isPublicAddress(record))
      );
    };

    if (type === undefined) resolve(name, cb);
    else resolve(name, type, cb);
  };
}

//
// Final check right before each connection (mx-connect calls this with the
// exact address it is about to connect to).  This also covers addresses that
// never go through DNS: an IP address used as the delivery target and an MX
// exchange that is itself an IP address.
//
function publicConnectHook(delivery, options, fn) {
  if (!isPublicAddress(options.host))
    return fn(createPrivateHostError(options.host, delivery.domain));
  fn();
}

module.exports = {
  isPublicAddress,
  createPublicResolve,
  publicConnectHook
};
