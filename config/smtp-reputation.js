/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');
const REGEX_LOCALHOST = require('#helpers/regex-localhost');

// Reputable DNS providers (check NS records for auto-approval)
const REPUTABLE_DNS_PROVIDERS = new Set([
  // Cloudflare
  'cloudflare.com',
  'ns.cloudflare.com',

  // AWS Route 53
  'awsdns',
  'amazonaws.com',

  // Google Cloud DNS / Google Domains
  'googledomains.com',
  'google.com',
  'dns.google',

  // Popular registrars with good DNS
  'namecheap.com',
  'registrar-servers.com', // Namecheap
  'dnsowl.com', // Namecheap premium

  // Other reputable providers
  'ns1.com',
  'dnsimple.com',
  'zoneedit.com',
  'dnsmadeeasy.com',
  'ultradns.com',
  'easydns.com',

  // Enterprise/business DNS
  'azure-dns.com',
  'azuredns.com',
  'digitalocean.com',
  'linode.com',
  'hover.com'
]);

// Known parking/default IPs that indicate non-legitimate hosting
const PARKING_IPS = new Set([
  // GoDaddy parking
  '184.168.131.241',
  '50.63.202.1',
  '50.63.202.2',

  // Namecheap parking
  '198.54.117.197',
  '198.54.117.198',
  '198.54.116.250',

  // Google Domains parking
  '216.239.32.21',
  '216.239.34.21',
  '216.239.36.21',
  '216.239.38.21',

  // Bluehost default/parking
  '162.241.216.10',
  '50.87.144.227',

  // Network Solutions
  '69.46.86.18',
  '69.46.86.19',

  // Domain.com
  '69.46.80.151',

  // Register.com
  '65.254.248.100',

  // Porkbun parking
  '104.21.2.106',
  '172.67.148.83',

  // Hover.com parking
  '216.40.47.26',

  // Name.com parking
  '69.46.88.64',

  // 123-reg parking
  '212.78.114.207',
  '212.78.114.211',

  // OVH parking
  '213.186.33.5',
  '87.98.231.6',

  // CloudFlare parking
  '104.21.2.106',
  '172.67.148.83',

  // Common sinkhole/blackhole IPs
  '127.0.0.1',
  '0.0.0.0',
  '10.0.0.1',
  '192.168.1.1',
  '127.0.0.254'
]);

// Function to validate resolved A records are not local/private IPs
function isValidPublicIP(ip) {
  if (!isIP(ip)) return false;

  // Check if it's a localhost/private IP
  if (REGEX_LOCALHOST.test(ip)) return false;

  // Check if it's a parking IP
  if (PARKING_IPS.has(ip)) return false;

  return true;
}

module.exports = {
  REPUTABLE_DNS_PROVIDERS,
  PARKING_IPS,
  isValidPublicIP
};
