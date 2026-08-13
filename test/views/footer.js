/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');
const { it } = require('node:test');
const assert = require('node:assert');

const pug = require('pug');

const renderFooter = pug.compileFile(
  path.join(__dirname, '../../app/views/_footer.pug')
);

it('renders the package version beneath the footer trademark notice', () => {
  const html = renderFooter({
    availableLanguages: [],
    config: {
      alternatives: [],
      supportEmail: 'support@forwardemail.net',
      urls: { web: 'https://forwardemail.net' }
    },
    ctx: {
      get() {
        return '';
      },
      pathWithoutLocale: '/',
      locale: 'en'
    },
    dayjs() {
      return {
        format() {
          return '2026';
        }
      };
    },
    isBot() {
      return true;
    },
    l(value) {
      return value;
    },
    developerDocs: [],
    manifest(value) {
      return value;
    },
    nsProviders: [],
    platforms: [],
    pkgVersion: '2.13.15',
    t(value) {
      return value;
    },
    user: {}
  });

  assert.match(
    html,
    /All rights reserved\. All trademarks are property of their respective owners in the US and other countries\.<\/li>\s*<li>v2\.13\.15<\/li>/
  );
});
