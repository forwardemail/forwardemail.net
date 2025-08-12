/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');
const REGEX_LOCALHOST = require('#helpers/regex-localhost');

// Reputable DNS provider slugs (based on NS_PROVIDERS from config/utilities)
const REPUTABLE_DNS_PROVIDER_SLUGS = new Set([
  // Major cloud providers
  'cloudflare',
  'amazon-route-53', // AWS Route 53
  'google-domains',
  'google-cloud-dns',
  'azure',

  // Popular registrars with good DNS
  'namecheap',
  'godaddy',

  // Other reputable providers
  'ns1',
  'dns-made-easy',
  'digital-ocean',
  'linode-akamai',
  'hover',
  'gandi',
  'ionos',
  'ovhcloud',
  'vultr',
  'easydns',
  'ultradns',
  'hurricane-electric',
  'cloudns'
]);

// Known parking/default IPs that indicate non-legitimate hosting
const PARKING_IPS = new Set([
  // GoDaddy Parking & CashParking
  // Note: GoDaddy frequently uses Google Cloud IPs for parking. [1]
  '3.33.130.190', // New GoDaddy Parking [3]
  '15.197.148.33', // New GoDaddy Parking [3]
  '34.98.99.30', // GoDaddy Free Parking [1]
  '34.102.136.180', // GoDaddy Free Parking [1]
  '50.63.202.1', // Old GoDaddy
  '184.168.131.241', // Old GoDaddy

  // Namecheap Parking
  '198.54.117.197',
  '198.54.117.198',
  '198.54.116.250',
  '104.219.251.159', // Added Namecheap

  // Squarespace (formerly Google Domains)
  // Google Domains sold to Squarespace. These are common Squarespace IPs.
  '198.185.159.144',
  '198.185.159.145',
  '198.49.23.144',
  '198.49.23.145',

  // Bluehost/Unified Layer Default/Parking
  '162.241.216.10',
  '50.87.144.227',
  '74.220.216.100', // Added Bluehost/Unified Layer

  // Network Solutions / Register.com (Web.com Group)
  '69.46.86.18',
  '69.46.86.19',
  '209.67.50.203', // Register.com Futuresite [2]
  '65.254.248.100',

  // Domain.com
  '69.46.80.151',

  // Porkbun Parking
  '64.190.63.111',

  // Hover.com Parking/Forwarding
  '216.40.34.41', // Used for forwarding, often indicates a parked state [40]
  '64.99.80.28', // General Hover IP [30]

  // Name.com Parking
  '69.46.88.64',

  // 123-reg Parking (Part of GoDaddy)
  '212.78.114.207',
  '212.78.114.211',
  '94.136.40.82', // Added 123-reg

  // OVHcloud Parking
  '213.186.33.5', // Often shows "site en construction" [7, 20]
  '87.98.231.6',

  // Sedo Parking (Major Parking Service)
  '64.191.115.111',
  '64.191.115.110',

  // Afternic (GoDaddy's Resale/Parking Platform)
  '52.5.19.209',
  '52.72.48.1',

  // Tucows (Hover, Enom)
  '64.99.64.37',

  // IONOS (formerly 1&1)
  '74.208.23.19',
  '82.165.229.138',

  // HostGator (Endurance International Group)
  '192.185.16.149',

  // NameSilo Parking (namesilo)
  '198.105.244.228',
  '198.105.251.228',

  // Tucows/Hover (hover) - More specific IPs
  '64.99.80.28', // Hover default IP
  '216.40.34.41', // Hover forwarding service IP

  // Wix (wix)
  '23.236.62.147', // General Wix IP, often for parked/unassigned domains

  // Squarespace (squarespace) - Already added, but confirming from your list
  '198.185.159.144',
  '198.185.159.145',
  '198.49.23.144',
  '198.49.23.145',

  // IONOS by 1&1 (ionos) - Already added, confirming from your list
  '74.208.23.19',
  '82.165.229.138',

  // Digital Ocean (digital-ocean) - Placeholder IP
  '50.116.59.212', // Often used as a placeholder on unconfigured droplets

  // Vultr (vultr) - Placeholder IP
  '108.61.193.159', // Common default IP for unconfigured instances

  // Linode (linode-akamai)
  '50.116.59.212', // Also used by Linode for default pages

  // SiteGround (siteground)
  '198.54.116.250' // Shared with Namecheap, but also used by SiteGround for parked domains
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
  REPUTABLE_DNS_PROVIDER_SLUGS,
  PARKING_IPS,
  isValidPublicIP
};
