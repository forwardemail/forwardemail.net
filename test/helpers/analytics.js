/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const {
  parseBrowser,
  parseOS,
  parseDeviceType,
  parseEmailClient,
  parseIMAPClientId,
  categorizeReferrer,
  extractReferrerDomain,
  generateSessionHash,
  extractUTMParams,
  EMAIL_CLIENT_PATTERNS,
  BROWSER_PATTERNS,
  OS_PATTERNS
} = require('#helpers/analytics');

// ============================================================================
// parseIMAPClientId Tests - IMAP ID command (RFC 2971) parsing
// ============================================================================

test('parseIMAPClientId returns empty string for null/undefined input', (t) => {
  t.is(parseIMAPClientId(null), '');
  t.is(parseIMAPClientId(undefined), '');
  t.is(parseIMAPClientId(''), '');
  t.is(parseIMAPClientId(123), '');
});

test('parseIMAPClientId parses Thunderbird client ID', (t) => {
  const clientId = {
    name: 'Thunderbird',
    version: '115.0',
    vendor: 'Mozilla',
    os: 'Windows',
    'os-version': '10.0'
  };
  const result = parseIMAPClientId(clientId);
  t.true(result.includes('Thunderbird/115.0'));
  t.true(result.includes('Mozilla'));
  t.true(result.includes('Windows 10.0'));
});

test('parseIMAPClientId parses Apple Mail client ID', (t) => {
  const clientId = {
    name: 'Mac OS X Mail',
    version: '16.0',
    os: 'Mac OS X',
    'os-version': '14.0'
  };
  const result = parseIMAPClientId(clientId);
  t.true(result.includes('Mac OS X Mail/16.0'));
  t.true(result.includes('Mac OS X 14.0'));
});

test('parseIMAPClientId parses Outlook client ID', (t) => {
  const clientId = {
    name: 'Microsoft Outlook',
    version: '16.0.17328.20124',
    vendor: 'Microsoft',
    os: 'Windows NT',
    'os-version': '10.0'
  };
  const result = parseIMAPClientId(clientId);
  t.true(result.includes('Microsoft Outlook/16.0.17328.20124'));
  t.true(result.includes('Microsoft'));
});

test('parseIMAPClientId handles minimal client ID (name only)', (t) => {
  const clientId = { name: 'CustomClient' };
  const result = parseIMAPClientId(clientId);
  t.is(result, 'CustomClient');
});

test('parseIMAPClientId handles client ID with name and version only', (t) => {
  const clientId = { name: 'K-9 Mail', version: '6.800' };
  const result = parseIMAPClientId(clientId);
  t.is(result, 'K-9 Mail/6.800');
});

test('parseIMAPClientId does not duplicate vendor if same as name', (t) => {
  const clientId = {
    name: 'Thunderbird',
    version: '115.0',
    vendor: 'Thunderbird' // Same as name
  };
  const result = parseIMAPClientId(clientId);
  t.false(result.includes('(Thunderbird)'));
  t.is(result, 'Thunderbird/115.0');
});

test('parseIMAPClientId handles empty object', (t) => {
  const result = parseIMAPClientId({});
  t.is(result, '');
});

// ============================================================================
// parseEmailClient Tests - Email client detection from User-Agent
// ============================================================================

test('parseEmailClient detects Thunderbird', (t) => {
  const ua =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Thunderbird/102.0';
  t.is(parseEmailClient(ua), 'Thunderbird');
});

test('parseEmailClient detects Outlook', (t) => {
  const ua = 'Microsoft Outlook 16.0';
  t.is(parseEmailClient(ua), 'Outlook');
});

test('parseEmailClient detects Apple Mail via darwin pattern', (t) => {
  const ua = 'Darwin/23.4.0 Mail/3654.60.5 CFNetwork/1494.0.7';
  t.is(parseEmailClient(ua), 'Apple Mail');
});

test('parseEmailClient detects Apple Mail via Mail.app', (t) => {
  const ua = 'Mail.app/1.0';
  t.is(parseEmailClient(ua), 'Apple Mail');
});

test('parseEmailClient detects K-9 Mail', (t) => {
  const ua = 'K-9 Mail/6.800';
  t.is(parseEmailClient(ua), 'K-9 Mail');
});

test('parseEmailClient detects FairEmail', (t) => {
  const ua = 'FairEmail/1.2000';
  t.is(parseEmailClient(ua), 'FairEmail');
});

test('parseEmailClient detects CalDAV clients', (t) => {
  t.is(parseEmailClient('DAVx5/4.3.1'), 'DAVx5');
  t.is(parseEmailClient('CalDAV-Sync/1.0'), 'CalDAV Client');
  t.is(parseEmailClient('CardDAV-Sync/1.0'), 'CardDAV Client');
});

test('parseEmailClient detects iOS/macOS clients', (t) => {
  t.is(parseEmailClient('macOS/14.0 (23A344) CalendarAgent/961'), 'macOS');
  t.is(parseEmailClient('iOS/17.0 dataaccessd/1.0'), 'iOS');
  t.is(parseEmailClient('CalendarAgent/123'), 'Calendar Agent');
});

test('parseEmailClient returns Unknown for unknown clients', (t) => {
  t.is(parseEmailClient('Unknown Client/1.0'), 'Unknown');
  t.is(parseEmailClient(''), 'Unknown');
  t.is(parseEmailClient(null), 'Unknown');
});

// ============================================================================
// parseBrowser Tests - Browser detection from User-Agent
// ============================================================================

test('parseBrowser detects Chrome', (t) => {
  const ua =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const result = parseBrowser(ua);
  t.is(result.browser, 'Chrome');
  t.is(result.browser_version, '120');
});

test('parseBrowser detects Firefox', (t) => {
  const ua =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0';
  const result = parseBrowser(ua);
  t.is(result.browser, 'Firefox');
  t.is(result.browser_version, '121');
});

test('parseBrowser detects Safari', (t) => {
  const ua =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15';
  const result = parseBrowser(ua);
  t.is(result.browser, 'Safari');
  // Safari version is extracted from Safari/xxx, not Version/xxx
  t.is(result.browser_version, '605');
});

test('parseBrowser detects Edge', (t) => {
  const ua =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0';
  const result = parseBrowser(ua);
  t.is(result.browser, 'Edge');
});

test('parseBrowser returns Unknown for empty/invalid input', (t) => {
  t.deepEqual(parseBrowser(''), { browser: 'Unknown', browser_version: '' });
  t.deepEqual(parseBrowser(null), { browser: 'Unknown', browser_version: '' });
});

// ============================================================================
// parseOS Tests - Operating system detection from User-Agent
// ============================================================================

test('parseOS detects Windows', (t) => {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  const result = parseOS(ua);
  t.is(result.os, 'Windows');
  // Windows NT 10.0 maps to Windows 10/11
  t.is(result.os_version, '10/11');
});

test('parseOS detects macOS', (t) => {
  const ua =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15';
  const result = parseOS(ua);
  t.is(result.os, 'macOS');
  // Version includes minor version
  t.is(result.os_version, '14.2');
});

test('parseOS detects iOS', (t) => {
  const ua =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15';
  const result = parseOS(ua);
  t.is(result.os, 'iOS');
  // Version includes minor version
  t.is(result.os_version, '17.2');
});

test('parseOS detects Android', (t) => {
  const ua = 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36';
  const result = parseOS(ua);
  t.is(result.os, 'Android');
  t.is(result.os_version, '14');
});

test('parseOS detects Linux', (t) => {
  const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36';
  const result = parseOS(ua);
  t.is(result.os, 'Linux');
});

test('parseOS returns Unknown for empty/invalid input', (t) => {
  t.deepEqual(parseOS(''), { os: 'Unknown', os_version: '' });
  t.deepEqual(parseOS(null), { os: 'Unknown', os_version: '' });
});

// ============================================================================
// parseDeviceType Tests - Device type detection from User-Agent
// ============================================================================

test('parseDeviceType detects mobile devices', (t) => {
  const mobileUA =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15';
  t.is(parseDeviceType(mobileUA), 'mobile');

  const androidUA =
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36';
  t.is(parseDeviceType(androidUA), 'mobile');
});

test('parseDeviceType detects tablets', (t) => {
  const iPadUA =
    'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15';
  t.is(parseDeviceType(iPadUA), 'tablet');

  const androidTabletUA =
    'Mozilla/5.0 (Linux; Android 14; SM-X910) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Safari/537.36';
  t.is(parseDeviceType(androidTabletUA), 'tablet');
});

test('parseDeviceType detects desktop', (t) => {
  const desktopUA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  t.is(parseDeviceType(desktopUA), 'desktop');

  const macUA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15';
  t.is(parseDeviceType(macUA), 'desktop');
});

test('parseDeviceType returns unknown for empty/invalid input', (t) => {
  t.is(parseDeviceType(''), 'unknown');
  t.is(parseDeviceType(null), 'unknown');
});

// ============================================================================
// categorizeReferrer Tests - Referrer source categorization
// ============================================================================

test('categorizeReferrer categorizes search engines', (t) => {
  t.is(categorizeReferrer('google.com'), 'search');
  t.is(categorizeReferrer('www.google.com'), 'search');
  t.is(categorizeReferrer('bing.com'), 'search');
  t.is(categorizeReferrer('duckduckgo.com'), 'search');
  t.is(categorizeReferrer('yahoo.com'), 'search');
});

test('categorizeReferrer categorizes social media', (t) => {
  t.is(categorizeReferrer('twitter.com'), 'social');
  t.is(categorizeReferrer('x.com'), 'social');
  t.is(categorizeReferrer('facebook.com'), 'social');
  t.is(categorizeReferrer('linkedin.com'), 'social');
  t.is(categorizeReferrer('reddit.com'), 'social');
});

test('categorizeReferrer categorizes tech/dev sites', (t) => {
  // news.ycombinator is in the 'news' category
  t.is(categorizeReferrer('news.ycombinator.com'), 'news');
  // github and stackoverflow are not in predefined categories, so they're 'referral'
  t.is(categorizeReferrer('github.com'), 'referral');
  t.is(categorizeReferrer('stackoverflow.com'), 'referral');
});

test('categorizeReferrer returns referral for unknown domains', (t) => {
  t.is(categorizeReferrer('example.com'), 'referral');
  t.is(categorizeReferrer('random-site.org'), 'referral');
});

test('categorizeReferrer handles null/empty input', (t) => {
  t.is(categorizeReferrer(''), 'direct');
  t.is(categorizeReferrer(null), 'direct');
});

// ============================================================================
// extractReferrerDomain Tests - Domain extraction from referrer URL
// ============================================================================

test('extractReferrerDomain extracts domain from full URL', (t) => {
  // Returns full hostname including www
  t.is(
    extractReferrerDomain('https://www.google.com/search?q=test'),
    'www.google.com'
  );
  t.is(
    extractReferrerDomain('https://github.com/forwardemail/forwardemail.net'),
    'github.com'
  );
});

test('extractReferrerDomain preserves www prefix', (t) => {
  t.is(
    extractReferrerDomain('https://www.example.com/page'),
    'www.example.com'
  );
});

test('extractReferrerDomain handles URLs without protocol', (t) => {
  t.is(extractReferrerDomain('google.com'), 'google.com');
});

test('extractReferrerDomain returns empty string for empty/invalid input', (t) => {
  t.is(extractReferrerDomain(''), '');
  t.is(extractReferrerDomain(null), '');
});

// ============================================================================
// generateSessionHash Tests - Privacy-focused session hashing
// ============================================================================

test('generateSessionHash generates consistent hash for same inputs', (t) => {
  const hash1 = generateSessionHash('192.168.1.1', 'Mozilla/5.0');
  const hash2 = generateSessionHash('192.168.1.1', 'Mozilla/5.0');
  t.is(hash1, hash2);
});

test('generateSessionHash generates different hash for different IPs', (t) => {
  const hash1 = generateSessionHash('192.168.1.1', 'Mozilla/5.0');
  const hash2 = generateSessionHash('192.168.1.2', 'Mozilla/5.0');
  t.not(hash1, hash2);
});

test('generateSessionHash generates different hash for different UAs', (t) => {
  const hash1 = generateSessionHash('192.168.1.1', 'Mozilla/5.0 Chrome');
  const hash2 = generateSessionHash('192.168.1.1', 'Mozilla/5.0 Firefox');
  t.not(hash1, hash2);
});

test('generateSessionHash handles empty inputs', (t) => {
  const hash = generateSessionHash('', '');
  t.truthy(hash);
  t.is(typeof hash, 'string');
});

// ============================================================================
// extractUTMParams Tests - UTM parameter extraction
// ============================================================================

test('extractUTMParams extracts all UTM parameters', (t) => {
  const query = {
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'summer_sale',
    utm_content: 'banner_ad',
    utm_term: 'email hosting'
  };
  const result = extractUTMParams(query);
  t.is(result.utm_source, 'google');
  t.is(result.utm_medium, 'cpc');
  t.is(result.utm_campaign, 'summer_sale');
  t.is(result.utm_content, 'banner_ad');
  t.is(result.utm_term, 'email hosting');
});

test('extractUTMParams handles partial UTM parameters', (t) => {
  const query = { utm_source: 'newsletter' };
  const result = extractUTMParams(query);
  t.is(result.utm_source, 'newsletter');
  t.is(result.utm_medium, undefined);
});

test('extractUTMParams handles empty query', (t) => {
  const result = extractUTMParams({});
  t.deepEqual(result, {});
});

test('extractUTMParams handles null/undefined query', (t) => {
  t.deepEqual(extractUTMParams(null), {});
  t.deepEqual(extractUTMParams(undefined), {});
});

test('extractUTMParams truncates long values', (t) => {
  const longValue = 'a'.repeat(200);
  const query = { utm_source: longValue };
  const result = extractUTMParams(query);
  t.is(result.utm_source.length, 100);
});

// ============================================================================
// Pattern Constants Tests - Verify patterns are properly defined
// ============================================================================

test('EMAIL_CLIENT_PATTERNS includes common email clients', (t) => {
  const clientNames = new Set(EMAIL_CLIENT_PATTERNS.map((p) => p.name));
  t.true(clientNames.has('Thunderbird'));
  t.true(clientNames.has('Outlook'));
  t.true(clientNames.has('Apple Mail'));
  t.true(clientNames.has('K-9 Mail'));
  t.true(clientNames.has('FairEmail'));
});

test('EMAIL_CLIENT_PATTERNS includes CalDAV/CardDAV clients', (t) => {
  const clientNames = new Set(EMAIL_CLIENT_PATTERNS.map((p) => p.name));
  t.true(clientNames.has('DAVx5'));
  t.true(clientNames.has('CalDAV Client'));
  t.true(clientNames.has('CardDAV Client'));
});

test('EMAIL_CLIENT_PATTERNS includes Apple platform clients', (t) => {
  const clientNames = new Set(EMAIL_CLIENT_PATTERNS.map((p) => p.name));
  t.true(clientNames.has('macOS'));
  t.true(clientNames.has('iOS'));
  t.true(clientNames.has('Calendar Agent'));
});

test('BROWSER_PATTERNS includes major browsers', (t) => {
  const browserNames = new Set(BROWSER_PATTERNS.map((p) => p.name));
  t.true(browserNames.has('Chrome'));
  t.true(browserNames.has('Firefox'));
  t.true(browserNames.has('Safari'));
  t.true(browserNames.has('Edge'));
});

test('OS_PATTERNS includes major operating systems', (t) => {
  const osNames = new Set(OS_PATTERNS.map((p) => p.name));
  t.true(osNames.has('Windows'));
  t.true(osNames.has('macOS'));
  t.true(osNames.has('iOS'));
  t.true(osNames.has('Android'));
  t.true(osNames.has('Linux'));
});
