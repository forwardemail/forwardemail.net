const getStream = require('get-stream');
const { SitemapStream } = require('sitemap');

const config = require('#config');

// in-memory caching
let cache = false;

// <https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap>
async function sitemap(ctx) {
  if (cache) {
    ctx.set('Content-Type', 'application/xml');
    ctx.body = cache;
    return;
  }

  const smStream = new SitemapStream({
    hostname: config.urls.web
  });

  // TODO: if you change this then also change test/web/index.js sitemap stuff
  const keys = Object.keys(config.meta).filter((key) => {
    // exclude certain pages from sitemap
    // (e.g. 401 not authorized)
    if (
      [
        '/admin',
        '/my-account',
        '/help',
        '/auth',
        '/logout',
        '/guides',
        '/denylist',
        '/reset-password',
        config.verifyRoute,
        config.otpRoutePrefix
      ].includes(key)
    )
      return false;
    return key;
  });

  // for each language, iterate over each key, and write to sitemap
  for (const language of ctx.state.availableLanguages) {
    // language.locale
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
  cache = await getStream.buffer(smStream);
  ctx.body = cache;
}

module.exports = sitemap;
