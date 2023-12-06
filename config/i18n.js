/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const locales = require('./locales');
const phrases = require('./phrases');
const meta = require('./meta');
const metaConfig = require('./meta-config');

// concat phrases with meta
const m = meta(metaConfig);
for (const arr of Object.values(m)) {
  for (const key of arr) {
    phrases[key] = key;
  }
}

module.exports = {
  // see @ladjs/i18n for a list of defaults
  // <https://github.com/ladjs/i18n>
  // but for complete configuration reference please see:
  // <https://github.com/mashpie/i18n-node#list-of-all-configuration-options>
  phrases,
  defaultLocale: 'en',
  directory: path.join(__dirname, '..', 'locales'),
  ignoredRedirectGlobs: [
    '/auth/*',
    '/auth/**/*',
    '/.well-known/*',
    '/.well-known/**/*'
  ],
  lastLocaleField: 'last_locale',
  locales
};
