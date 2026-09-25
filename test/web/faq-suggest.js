/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const faqSuggest = require('#controllers/web/faq-suggest');

const { getSafeLocale } = faqSuggest;

test('FAQ suggestion locale is always constrained to configured locales', (t) => {
  t.is(getSafeLocale('en'), 'en');
  t.is(getSafeLocale('es'), 'es');
  t.is(getSafeLocale('../../etc/passwd'), 'en');
  t.is(getSafeLocale('not-a-locale'), 'en');
  t.is(getSafeLocale(), 'en');
});

test('FAQ suggestion skips cache work for a stop-word-only request', async (t) => {
  const ctx = {
    client: {
      get() {
        t.fail('the FAQ cache must not be read for a non-search query');
      }
    },
    locale: 'en',
    logger: {
      error(error) {
        throw error;
      }
    },
    query: { q: 'the and or with' },
    set(name, value) {
      t.is(name, 'Cache-Control');
      t.is(value, 'private, no-store');
    },
    state: { l: (url) => url }
  };

  await faqSuggest(ctx);
  t.deepEqual(ctx.body, { suggestions: [] });
});
