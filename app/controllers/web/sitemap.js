/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const getStream = require('get-stream');
const { SitemapStream, SitemapIndexStream } = require('sitemap');

const env = require('#config/env');
const metaConfig = require('#config/meta-config');
const metaFn = require('#config/meta');
const alternatives = require('#config/alternatives');

// in-memory caching
const cache = new Map();

const meta = metaFn(metaConfig, true);

// <https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap>
// <https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps>
async function sitemap(ctx) {
  if (cache.has(ctx.path)) {
    ctx.set('Content-Type', 'application/xml');
    ctx.body = cache.get(ctx.path);
    return;
  }

  // TODO: if you change this then also change test/web/index.js sitemap stuff
  const keys = Object.keys(meta).filter((key) => {
    // exclude certain pages from sitemap
    // (e.g. 401 not authorized)
    if (
      [
        '/admin',
        '/my-account',
        '/help',
        '/auth',
        '/logout',
        '/denylist',
        '/reset-password',
        metaConfig.verifyRoute,
        metaConfig.otpRoutePrefix
      ].includes(key)
    )
      return false;
    if (key.startsWith('/admin') || key.startsWith('/my-account')) return false;
    return key;
  });

  // add all the alternatives (since it would be massive translation file addition otherwise)
  for (const alternative of alternatives) {
    keys.push(`/blog/best-${alternative.slug}-alternative`);
    /*
    // NOTE: with this the keys length is 6600+
    for (const a of alternatives) {
      if (a.name === alternative.name) continue;
      keys.push(
        `/blog/${alternative.slug}-vs-${a.slug}-email-service-comparison`
      );
    }
    */
  }

  // if this is the root sitemap.xml, serve a sitemap index
  // that points to locale-specific sitemaps
  if (ctx.path === '/sitemap.xml') {
    const sitemapIndexStream = new SitemapIndexStream();

    for (const language of ctx.state.availableLanguages) {
      sitemapIndexStream.write({
        url: `${env.WEB_URL.toLowerCase()}/${language.locale}/sitemap.xml`
      });
    }

    sitemapIndexStream.end();

    ctx.set('Content-Type', 'application/xml');
    const body = await getStream.buffer(sitemapIndexStream);
    ctx.body = body;
    cache.set(ctx.path, body);
    return;
  }

  // otherwise, serve a locale-specific sitemap
  const smStream = new SitemapStream({
    hostname: env.WEB_URL.toLowerCase()
  });

  // for locale-specific sitemaps, only include URLs for that locale
  const localeLanguages = ctx.state.availableLanguages.filter(
    (l) => l.locale === ctx.locale
  );

  for (const language of localeLanguages) {
    for (const key of keys) {
      const obj = {
        url: `/${language.locale}${key === '/' ? '' : key}`,
        links: ctx.state.availableLanguages.map((alternateLanguage) => {
          return {
            lang: alternateLanguage.locale,
            url: `/${alternateLanguage.locale}${key === '/' ? '' : key}`
          };
        })
      };
      smStream.write(obj);
    }
  }

  smStream.end();

  ctx.set('Content-Type', 'application/xml');
  const body = await getStream.buffer(smStream);
  ctx.body = body;
  cache.set(ctx.path, body);
}

module.exports = sitemap;
