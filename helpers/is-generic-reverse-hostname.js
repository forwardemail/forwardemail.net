/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIPv4 } = require('node:net');

const isSANB = require('is-string-and-not-blank');

// IPv4-mapped IPv6 addresses (e.g. "::ffff:35.196.140.60")
const REGEX_IPV4_MAPPED = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i;

// A reverse hostname is tokenized on the two separators providers use to
// embed an address in a generated PTR record ("." and "-")
const REGEX_HOSTNAME_SEPARATORS = /[.-]/;

// An embedded octet is one to three digits (zero-padded octets are allowed)
const REGEX_OCTET = /^\d{1,3}$/;

function hasOctetRun(tokens, octets) {
  for (let i = 0; i + octets.length <= tokens.length; i++) {
    let matched = true;
    for (const [j, octet] of octets.entries()) {
      const token = tokens[i + j];
      if (!REGEX_OCTET.test(token) || Number(token) !== octet) {
        matched = false;
        break;
      }
    }

    if (matched) return true;
  }

  return false;
}

/**
 * Detects a provider-generated ("generic") reverse DNS hostname.
 *
 * Cloud and hosting providers publish a PTR record for every address in their
 * ranges by deriving the hostname from the address itself, for example:
 *
 *   35.196.140.60  -> 60.140.196.35.bc.googleusercontent.com   (Google Cloud)
 *   3.15.22.8      -> ec2-3-15-22-8.us-east-2.compute.amazonaws.com (AWS EC2)
 *   172.105.1.2    -> 172-105-1-2.ip.linodeusercontent.com      (Linode)
 *   65.21.235.130  -> static.130.235.21.65.clients.your-server.de (Hetzner)
 *
 * Such a hostname identifies the provider, not the sender: nobody claimed the
 * address for mail, and the "root domain" of the PTR (googleusercontent.com,
 * amazonaws.com, ...) carries none of the reputation that its web properties
 * have. A mail server that is intentionally operated from one of these
 * addresses has a custom PTR record (mail.example.com) instead.
 *
 * The check is deliberately structural rather than a list of providers: the
 * hostname must contain all four octets of the connecting IPv4 address as a
 * consecutive run of "."- or "-"-separated labels, in forward or reversed
 * order. Only IPv4 (including IPv4-mapped IPv6) addresses are supported.
 *
 * @param {string} hostname - reverse DNS hostname of the connecting address
 * @param {string} address - the connecting IP address
 * @returns {boolean}
 */
function isGenericReverseHostname(hostname, address) {
  if (!isSANB(hostname) || !isSANB(address)) return false;

  let ipv4 = address.trim();
  const mapped = REGEX_IPV4_MAPPED.exec(ipv4);
  if (mapped) ipv4 = mapped[1];
  if (!isIPv4(ipv4)) return false;

  const octets = ipv4.split('.').map(Number);
  const tokens = hostname
    .toLowerCase()
    .trim()
    .replace(/\.$/, '')
    .split(REGEX_HOSTNAME_SEPARATORS);

  return (
    hasOctetRun(tokens, octets) || hasOctetRun(tokens, [...octets].reverse())
  );
}

module.exports = isGenericReverseHostname;
