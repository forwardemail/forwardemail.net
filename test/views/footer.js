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

function getFooterLocals({
  isBot = true,
  createdAt,
  domains,
  goodDomains = []
} = {}) {
  return {
    availableLanguages: [],
    config: {
      alternatives: [],
      goodDomains,
      supportEmail: 'support@forwardemail.net',
      ubuntuTeamMapping: {},
      urls: { web: 'https://forwardemail.net' }
    },
    ctx: {
      get() {
        return '';
      },
      pathWithoutLocale: '/',
      locale: 'en'
    },
    currentLanguage: 'English',
    dayjs(value) {
      if (value)
        return {
          add(amount, unit) {
            const date = new Date(value);
            if (amount === 3 && unit === 'month')
              date.setMonth(date.getMonth() + 3);
            return {
              isBefore() {
                return (
                  date.getTime() <
                  new Date('2026-04-01T00:00:00.000Z').getTime()
                );
              }
            };
          }
        };

      return {
        format() {
          return '2026';
        }
      };
    },
    developerDocs: [],
    domains,
    isBot() {
      return isBot;
    },
    l(value) {
      return value;
    },
    manifest(value) {
      return value;
    },
    nsProviders: [],
    pkgVersion: '2.13.16',
    platforms: [],
    t(value) {
      return value;
    },
    titleize(value) {
      return value;
    },
    user: createdAt ? { created_at: createdAt } : {}
  };
}

it('renders the package version beneath the footer trademark notice', () => {
  const html = renderFooter(getFooterLocals());

  assert.match(
    html,
    /All rights reserved\. All trademarks are property of their respective owners in the US and other countries\.<\/li>\s*<li>v2\.13\.16<\/li>/
  );
});

it('renders the Trustpilot badge only for established users whose domains are all good domains', () => {
  const html = renderFooter(
    getFooterLocals({
      isBot: false,
      createdAt: new Date('2025-12-01T00:00:00.000Z'),
      domains: [{ name: 'example.com' }],
      goodDomains: ['com']
    })
  );

  assert.match(
    html,
    /https:\/\/www\.trustpilot\.com\/review\/forwardemail\.net/
  );
});

it('does not render the Trustpilot badge for a recent user or a non-good domain', () => {
  const recentHtml = renderFooter(
    getFooterLocals({
      isBot: false,
      createdAt: new Date('2026-03-01T00:00:00.000Z'),
      domains: [{ name: 'example.com' }],
      goodDomains: ['com']
    })
  );
  const restrictedDomainHtml = renderFooter(
    getFooterLocals({
      isBot: false,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      domains: [{ name: 'example.invalid' }],
      goodDomains: ['com']
    })
  );

  assert.doesNotMatch(
    recentHtml,
    /https:\/\/www\.trustpilot\.com\/review\/forwardemail\.net/
  );
  assert.doesNotMatch(
    restrictedDomainHtml,
    /https:\/\/www\.trustpilot\.com\/review\/forwardemail\.net/
  );
});
