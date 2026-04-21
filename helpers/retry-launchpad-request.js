/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const undici = require('undici');

const retryRequest = require('./retry-request');

const LAUNCHPAD_API_HOSTNAME = 'api.launchpad.net';
const LAUNCHPAD_ADDRESS_FAMILY = 6;

const launchpadDispatcher = new undici.Agent({
  connect: {
    family: LAUNCHPAD_ADDRESS_FAMILY
  }
});

function retryLaunchpadRequest(url, opts = {}) {
  const parsed = new URL(url);

  if (parsed.hostname !== LAUNCHPAD_API_HOSTNAME)
    throw new TypeError(
      `Expected Launchpad API hostname "${LAUNCHPAD_API_HOSTNAME}"`
    );

  // Bypass Tangerine/custom resolver for Launchpad.
  // On the affected production host, direct IPv4 TCP/443 to Launchpad times out,
  // while IPv6 succeeds.  Forcing family 6 keeps these requests on the healthy
  // network path instead of repeatedly retrying a broken IPv4 connect.
  const { resolver: _resolver, ...requestOpts } = opts;

  return retryRequest(url, {
    ...requestOpts,
    dispatcher: requestOpts.dispatcher || launchpadDispatcher
  });
}

module.exports = retryLaunchpadRequest;
module.exports.LAUNCHPAD_ADDRESS_FAMILY = LAUNCHPAD_ADDRESS_FAMILY;
module.exports.LAUNCHPAD_API_HOSTNAME = LAUNCHPAD_API_HOSTNAME;
