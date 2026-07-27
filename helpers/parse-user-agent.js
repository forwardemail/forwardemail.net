/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const UAParser = require('ua-parser-js');
const { Emails } = require('ua-parser-js/extensions');

const UNKNOWN = 'Unknown';
const EMAIL_CLIENT_ALIASES = new Map([
  ['Mail', 'Apple Mail'],
  ['Microsoft Outlook', 'Outlook']
]);
const PROTOCOL_CLIENTS = [
  {
    pattern: /\bmail\.app\/([\d.]+)/i,
    name: 'Apple Mail'
  },
  {
    pattern: /\bdavx5\/([\d.]+)/i,
    name: 'DAVx5'
  },
  {
    pattern: /\bcaldav-sync\/([\d.]+)/i,
    name: 'CalDAV Client'
  },
  {
    pattern: /\bcarddav-sync\/([\d.]+)/i,
    name: 'CardDAV Client'
  },
  {
    pattern: /\bmacos\/([\d.]+).*\bcalendaragent\//i,
    name: 'macOS',
    os: 'macOS'
  },
  {
    pattern: /\bios\/([\d.]+).*\bdataaccessd\//i,
    name: 'iOS',
    os: 'iOS',
    deviceType: 'mobile'
  },
  {
    pattern: /\bcalendaragent\/([\d.]+)/i,
    name: 'Calendar Agent'
  }
];

function formatNameVersion(name, version) {
  if (!name || name === UNKNOWN) return UNKNOWN;
  return version ? `${name} ${version}` : name;
}

function resolveMacOSVersion(ua, version, meta) {
  if (version !== '10.15.7') return version;

  if (isSANB(meta?.ch_platform_version)) {
    const clientHintVersion = meta.ch_platform_version.replaceAll('"', '');
    if (clientHintVersion && clientHintVersion !== '10.15.7') {
      const [major, minor] = clientHintVersion.split('.');
      return minor ? `${major}.${minor}` : clientHintVersion;
    }
  }

  const safariVersion = ua.match(/Version\/(\d+(?:\.\d+)+)/)?.[1];
  if (safariVersion && Number.parseInt(safariVersion, 10) > 10)
    return safariVersion;

  return version;
}

function parseProtocolClient(ua) {
  for (const client of PROTOCOL_CLIENTS) {
    const match = ua.match(client.pattern);
    if (match)
      return {
        name: client.name,
        version: match[1] || '',
        os: client.os,
        osVersion: client.os ? match[1] || '' : '',
        deviceType: client.deviceType
      };
  }
}

function getDeviceType(result, fallback) {
  if (fallback) return fallback;
  if (result.device.type === 'mobile' || result.device.type === 'tablet')
    return result.device.type;

  if (!result.device.type) return 'desktop';
  return 'unknown';
}

/**
 * Parse a user-agent into normalized analytics and display fields.
 * ua-parser-js remains authoritative for browsers, operating systems, devices,
 * and supported email clients.  Narrow fallbacks cover protocol identifiers
 * (for example DAVx5 and CalendarAgent) that are not HTTP user agents.
 *
 * @param {string} ua Raw user-agent value.
 * @param {Object} [meta] Optional Client Hints metadata.
 * @param {string} [meta.ch_platform_version] Sec-CH-UA-Platform-Version.
 * @returns {Object} Normalized browser, OS, device, and email-client fields.
 */
function parseUserAgent(ua, meta = {}) {
  if (!isSANB(ua)) {
    return {
      browser: UNKNOWN,
      browser_version: '',
      os: UNKNOWN,
      os_version: '',
      device_type: 'unknown',
      client_app: UNKNOWN,
      client_app_version: '',
      browser_label: UNKNOWN,
      os_label: UNKNOWN,
      client_app_label: UNKNOWN,
      short: UNKNOWN
    };
  }

  const result = new UAParser(ua, { browser: Emails.browser }).getResult();
  const isEmailClient = result.browser.type === 'email';
  const protocolClient = isEmailClient ? undefined : parseProtocolClient(ua);
  const parsedAgentName = result.browser.name || UNKNOWN;
  const parsedAgentVersion = result.browser.version || '';
  const browser = isEmailClient ? UNKNOWN : parsedAgentName;
  const browserVersion = isEmailClient ? '' : parsedAgentVersion;
  const clientApp = isEmailClient
    ? EMAIL_CLIENT_ALIASES.get(parsedAgentName) || parsedAgentName
    : protocolClient?.name || UNKNOWN;
  const clientAppVersion = isEmailClient
    ? parsedAgentVersion
    : protocolClient?.version || '';
  const parsedOS = result.os.name || protocolClient?.os || UNKNOWN;
  const parsedOSVersion = result.os.version || protocolClient?.osVersion || '';
  const osVersion =
    parsedOS === 'macOS'
      ? resolveMacOSVersion(ua, parsedOSVersion, meta)
      : parsedOSVersion;
  const browserLabel = formatNameVersion(browser, browserVersion);
  const clientAppLabel = formatNameVersion(clientApp, clientAppVersion);
  const osLabel = formatNameVersion(parsedOS, osVersion);
  const agentLabel = clientApp === UNKNOWN ? browserLabel : clientAppLabel;

  return {
    browser,
    browser_version: browserVersion,
    os: parsedOS,
    os_version: osVersion,
    device_type: getDeviceType(result, protocolClient?.deviceType),
    client_app: clientApp,
    client_app_version: clientAppVersion,
    browser_label: browserLabel,
    os_label: osLabel,
    client_app_label: clientAppLabel,
    short:
      agentLabel === UNKNOWN && osLabel === UNKNOWN
        ? UNKNOWN
        : `${agentLabel} on ${osLabel}`
  };
}

module.exports = parseUserAgent;
