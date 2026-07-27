/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const parseUserAgent = require('#helpers/parse-user-agent');

test('parses full browser, OS, and device versions', (t) => {
  const result = parseUserAgent(
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.7103.56 Mobile Safari/537.36'
  );

  t.like(result, {
    browser: 'Mobile Chrome',
    browser_version: '136.0.7103.56',
    browser_label: 'Mobile Chrome 136.0.7103.56',
    os: 'Android',
    os_version: '14',
    os_label: 'Android 14',
    device_type: 'mobile',
    client_app: 'Unknown',
    client_app_version: ''
  });
});

test('uses Client Hints to repair frozen macOS versions', (t) => {
  const result = parseUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
    {
      ch_platform: '"macOS"',
      ch_platform_version: '"15.5.0"'
    }
  );

  t.is(result.browser_label, 'Chrome 149.0.0.0');
  t.is(result.os_label, 'macOS 15.5');
  t.is(result.short, 'Chrome 149.0.0.0 on macOS 15.5');
});

test('separates email clients from web browsers and preserves versions', (t) => {
  const result = parseUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Thunderbird/128.7.0'
  );

  t.like(result, {
    browser: 'Unknown',
    browser_version: '',
    os: 'Linux',
    device_type: 'desktop',
    client_app: 'Thunderbird',
    client_app_version: '128.7.0',
    client_app_label: 'Thunderbird 128.7.0'
  });
});

test('returns stable Unknown fields for absent user agents', (t) => {
  t.deepEqual(parseUserAgent(''), {
    browser: 'Unknown',
    browser_version: '',
    os: 'Unknown',
    os_version: '',
    device_type: 'unknown',
    client_app: 'Unknown',
    client_app_version: '',
    browser_label: 'Unknown',
    os_label: 'Unknown',
    client_app_label: 'Unknown',
    short: 'Unknown'
  });
});
