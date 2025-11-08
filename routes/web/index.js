/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const { setTimeout } = require('node:timers/promises');
const Boom = require('@hapi/boom');
const Router = require('@koa/router');
const dashify = require('dashify');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pTimeout = require('p-timeout');
const pWaitFor = require('p-wait-for');
const pug = require('pug');
const puppeteer = require('puppeteer');
const render = require('koa-views-render');
const revHash = require('rev-hash');
const { gzip } = require('node-gzip');
// const { parse } = require('node-html-parser');

// dynamically import mermaid cli
let parseMMD;

import('@mermaid-js/mermaid-cli').then((obj) => {
  parseMMD = obj.parseMMD;
});

const admin = require('./admin');
const auth = require('./auth');
const myAccount = require('./my-account');
const otp = require('./otp');

const TTI = require('#models/tti');
const _ = require('#helpers/lodash');
const config = require('#config');
const policies = require('#helpers/policies');
const rateLimit = require('#helpers/rate-limit');
const { decrypt } = require('#helpers/encrypt-decrypt');
const {
  developerDocs,
  nsProviders,
  platforms,
  useCases
} = require('#config/utilities');
const { web } = require('#controllers');

const MAX_AGE = ms('1y') / 1000;

const filePath = path.join(config.views.root, '_tti.pug');

const router = new Router();

function hasSidebar(ctx, next) {
  ctx.state.hasSidebar = true;
  return next();
}

router
  // status page crawlers often send `HEAD /` requests
  .get('/', (ctx, next) => {
    if (ctx.method === 'HEAD') {
      ctx.body = 'OK';
      return;
    }

    return next();
  })

  //
  // NOTE: we allow users to scan a QR code which links them to download a file
  //       (which lets them easily set up their accounts without having to type out config/ports)
  //
  // TODO: we should make this into a template and use it ourselves too
  //       <https://github.com/Monogramm/autodiscover-email-settings>
  //
  // iOS config download
  .get(
    '/c/:username.mobileconfig',
    rateLimit(20, 'config download'),
    web.mobileConfig
  )
  // K-9 config download
  .get('/c/:username.k9s', rateLimit(20, 'config download'), web.mobileConfig)

  // ips
  .get('/ips.txt', web.ips)
  .get('/ips.json', web.ips)
  .get('/ips/hostnames.txt', web.ips)
  .get('/ips/hostnames.json', web.ips)
  .get('/ips/v4', web.ips)
  .get('/ips/v4.txt', web.ips)
  .get('/ips/v6', web.ips)
  .get('/ips/v6.txt', web.ips)
  .get('/ips/v4.json', web.ips)
  .get('/ips/v6.json', web.ips)
  // sitemap
  .get('/sitemap.xml', web.sitemap)
  // feed
  .get('/blog/feed/atom', web.feed)
  .get('/blog/feed/rss', web.feed)
  .get('/blog/feed/json', web.feed)
  // report URI support (not locale specific)
  .post('/report', web.report)

  .post('/encrypt', rateLimit(50, 'encrypt'), web.encryptTxt)

  // mermaid charts
  // TODO: once svg fixed we can use that instead
  // <https://github.com/mermaid-js/mermaid-cli/issues/632>
  .get('/mermaid.png', async (ctx, next) => {
    // in test environments we don't want to spawn the browser process
    if (config.env === 'test') return next();

    let browser;
    try {
      if (!isSANB(ctx.query.code)) throw new Error('Code missing');
      if (ctx.query.theme !== 'dark' && ctx.query.theme !== 'default')
        throw new Error('Theme invalid');

      const code = decrypt(ctx.query.code);
      const hash = revHash(`${ctx.query.theme}:${code}`);

      if (global.mermaid && global.mermaid[hash]) {
        ctx.type = 'image/png';
        ctx.set('Cache-Control', `public, max-age=${MAX_AGE}`);
        // <https://github.com/koajs/compress/blob/41d501bd5db02d810572cfe154088c5fa6fcb957/lib/index.js#L89-L90>
        ctx.set('Content-Encoding', 'gzip');
        if (!ctx.res.headersSent) ctx.res.removeHeader('Content-Length');
        ctx.body = global.mermaid[hash];
        return;
      }

      // attempt to find in redis cache a buffer
      try {
        const buffer = await pTimeout(
          ctx.client.getBuffer(`buffer-gzip-mermaid:${hash}`),
          1000
        );
        if (buffer) {
          if (!global.mermaid) global.mermaid = {};
          global.mermaid[hash] = buffer;
          ctx.type = 'image/png';
          ctx.set('Cache-Control', `public, max-age=${MAX_AGE}`);
          // <https://github.com/koajs/compress/blob/41d501bd5db02d810572cfe154088c5fa6fcb957/lib/index.js#L89-L90>
          ctx.set('Content-Encoding', 'gzip');
          if (!ctx.res.headersSent) ctx.res.removeHeader('Content-Length');
          ctx.body = buffer;
          return;
        }
      } catch (err) {
        ctx.logger.error(err);
      }

      if (!parseMMD)
        await pWaitFor(() => Boolean(parseMMD), { timeout: ms('15s') });

      browser = await puppeteer.launch();
      const svg = await parseMMD(browser, code, 'png', {
        viewport: {
          width: 3000,
          height: 3000,
          deviceScaleFactor: 2
        },
        mermaidConfig: {
          diagramPadding: 100,
          theme: ctx.query.theme
        },
        backgroundColor: ctx.query.theme === 'default' ? 'white' : 'transparent'
      });
      browser
        .close()
        .then()
        .catch((err) => ctx.logger.error(err));
      const compressed = await gzip(svg);
      if (!global.mermaid) global.mermaid = {};
      global.mermaid[hash] = compressed;
      ctx.type = 'image/png';
      ctx.set('Cache-Control', `public, max-age=${MAX_AGE}`);
      // <https://github.com/koajs/compress/blob/41d501bd5db02d810572cfe154088c5fa6fcb957/lib/index.js#L89-L90>
      ctx.set('Content-Encoding', 'gzip');
      if (!ctx.res.headersSent) ctx.res.removeHeader('Content-Length');
      ctx.body = svg;
      // store buffer in cache
      try {
        await ctx.client.set(`buffer-gzip-mermaid:${hash}`, compressed);
      } catch (err) {
        ctx.logger.error(err);
      }
    } catch (err) {
      if (browser)
        browser
          .close()
          .then()
          .catch((err) => ctx.logger.error(err));
      ctx.logger.error(err);
      throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));
    }
  });

const localeRouter = new Router({ prefix: '/:locale' });

localeRouter
  // add HTTP Link header to GET requests
  // for canonical urls for search engines
  // <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#rel-canonical-header-method>
  .use((ctx, next) => {
    if (ctx.method === 'GET')
      ctx.set('Link', `<${config.urls.web}${ctx.path}>; rel="canonical"`);

    return next();
  })

  // locale specific sitemap
  .get('/sitemap.xml', web.sitemap)

  // encrypt domain txt record
  .get('/encrypt', render('encrypt'))
  .post('/encrypt', rateLimit(50, 'encrypt'), web.encryptTxt)

  //
  // ips
  //
  .get('/ips', web.ips)
  .get('/ips.txt', web.ips)
  .get('/ips.json', web.ips)
  .get('/ips/hostnames.txt', web.ips)
  .get('/ips/hostnames.json', web.ips)
  .get('/ips/v4', web.ips)
  .get('/ips/v4.txt', web.ips)
  .get('/ips/v6', web.ips)
  .get('/ips/v6.txt', web.ips)
  .get('/ips/v4.json', web.ips)
  .get('/ips/v6.json', web.ips)

  // ubuntu one
  .get('/ubuntu', render('ubuntu'))
  .get('/kubuntu', render('ubuntu'))
  .get('/lubuntu', render('ubuntu'))
  .get('/edubuntu', render('ubuntu'))
  .get('/ubuntu-studio', render('ubuntu'))

  .get('/search', web.search)
  // svg dynamically generated og images
  .get('(.*).(png|svg|jpeg)', web.generateOpenGraphImage)
  .get('/', web.auth.homeOrDomains)
  .post(
    '/',
    web.myAccount.retrieveDomains,
    policies.ensureTurnstile,
    rateLimit(50, 'onboard'),
    web.onboard
  )

  .get('/tti', hasSidebar, async (ctx) => {
    // get TTI stats for footer (v1 rudimentary approach)
    ctx.state.tti = false;
    ctx.state.ttiChartData = null;

    try {
      const tti = await Promise.race([
        TTI.findOne().sort({ created_at: -1 }).lean(),
        setTimeout(ms('10s'))
      ]);
      if (tti) {
        ctx.state.tti = tti;
      }

      // Always get historical data for charts when on TTI page
      if (ctx.pathWithoutLocale === '/tti') {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const chartData = await TTI.find({
          created_at: { $gte: twentyFourHoursAgo }
        })
          .sort({ created_at: 1 })
          .lean(); // Sort ascending for chronological order

        ctx.state.ttiChartData = chartData;
      }
    } catch (err) {
      ctx.logger.error(err);
    }

    if (ctx.accepts('html')) {
      if (!ctx.state.tti)
        throw Boom.clientTimeout(ctx.translateError('WEBSITE_OUTAGE'));
      return ctx.render('time-to-inbox');
    }

    const html = pug.renderFile(filePath, {
      ...ctx.state,
      ctx: {
        pathWithoutLocale:
          ctx.get('Referrer') === `${config.urls.web}/${ctx.locale}`
            ? '/'
            : ctx.pathWithoutLocale
      }
    });

    ctx.body = html;
  })

  // denylist removal (only 5 requests per 24 hours and removal is instant for paid users)
  .get(
    '/denylist',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    web.myAccount.ensureNotBanned,
    render('denylist')
  )
  .post(
    '/denylist',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    web.myAccount.ensureNotBanned,
    policies.ensureTurnstile,
    web.denylist.validate,
    rateLimit(5, 'denylist'),
    web.denylist.remove
  )
  // recipient verification
  .get('/v/:text', web.recipientVerification)
  .get('/dashboard', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/my-account'));
  })
  .get('/features', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/private-business-email'));
  })
  .get('/pricing', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/private-business-email'));
  })
  .get(
    '/private-business-email',
    web.myAccount.retrieveDomains,
    web.myAccount.sortedDomains,
    render('pricing')
  )
  .get(
    '/faq',
    hasSidebar,
    async (ctx, next) => {
      // FAQ takes 30s+ to render in dev/test
      // (we need to rewrite and optimize it)
      if (_.isEmpty(ctx.query) && !ctx.isAuthenticated())
        return ctx.render('faq');

      return next();
    },
    web.myAccount.retrieveDomains,
    web.onboard,
    web.faq
  )
  .post(
    '/faq',
    web.myAccount.retrieveDomains,
    policies.ensureTurnstile,
    rateLimit(50, 'onboard'),
    web.onboard,
    web.auth.parseReturnOrRedirectTo,
    web.faq
  )
  .get('/api', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/email-api'));
  })
  .get('/email-forwarding-api', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/email-api'));
  })
  .get('/email-api', web.api)
  .get(
    '/help',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    web.myAccount.ensureNotBanned,
    render('help')
  )
  .post(
    '/help',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    web.myAccount.ensureNotBanned,
    policies.ensureTurnstile,
    rateLimit(3, 'help'),
    web.help
  )
  .get('/about', hasSidebar, render('about'))
  .get('/press', hasSidebar, render('press'))
  .get('/security', hasSidebar, render('security'))
  .get(
    '/domain-registration',
    web.myAccount.retrieveDomains,
    web.onboard,
    render('domain-registration')
  )
  .get('/free-disposable-addresses', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/disposable-addresses'));
  })
  .get(
    '/disposable-addresses',
    web.myAccount.retrieveDomains,
    web.onboard,
    render('disposable-addresses')
  )
  .get(
    '/reserved-email-addresses',
    web.reservedEmailAddresses,
    web.myAccount.retrieveDomains,
    web.onboard,
    render('reserved-email-addresses')
  )
  .get('/encrypted-email', (ctx) => {
    ctx.status = 301;
    ctx.redirect(
      ctx.state.l('/blog/docs/best-quantum-safe-encrypted-email-service')
    );
  })
  .get(
    '/free-email-webhooks',
    web.myAccount.retrieveDomains,
    web.onboard,
    render('free-email-webhooks')
  )
  .get(
    '/email-forwarding-regex-pattern-filter',
    web.myAccount.retrieveDomains,
    web.onboard,
    render('email-forwarding-regex-pattern-filter')
  )
  .get('/self-hosted', render('self-hosted'))
  .get('/resources', render('resources'))
  .get('/guides', render('guides'))
  // feed
  .get('/blog/feed/atom', web.feed)
  .get('/blog/feed/rss', web.feed)
  .get('/blog/feed/json', web.feed)
  .get('/blog/docs', render('docs'))
  .get('/guides/send-mail-as-using-gmail', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/guides/send-mail-as-gmail-custom-domain'));
  })
  .get(
    '/guides/send-email-with-custom-domain-smtp',
    web.guides.sendEmailWithCustomDomainSMTP,
    render('guides/send-email-with-custom-domain-smtp')
  )
  .get(
    '/guides/send-mail-as-gmail-custom-domain',
    web.guides.sendMailAs,
    render('guides/send-mail-as-using-gmail')
  )
  .get(
    '/guides/smtp-integration',
    web.onboard,
    render('guides/smtp-integration')
  )
  .get(
    '/guides/port-25-blocked-by-isp-workaround',
    web.onboard,
    render('guides/port-25-blocked-by-isp-workaround')
  )
  .get(
    '/guides/nas-email-notifications-smtp-setup-guide-synology-qnap-truenas',
    render(
      'guides/nas-email-notifications-smtp-setup-guide-synology-qnap-truenas'
    )
  )
  .get(
    '/guides/printer-camera-fax-scanner-email-smtp-setup-guide-tls-compatibility',
    render(
      'guides/printer-camera-fax-scanner-email-smtp-setup-guide-tls-compatibility'
    )
  )
  .get(
    '/guides/raspberry-pi-ftp-server-email-relay-security-camera',
    render('guides/raspberry-pi-ftp-server-email-relay-security-camera')
  )
  .get(
    '/guides/newsletter-with-listmonk',
    render('guides/newsletter-with-listmonk')
  )
  .get('/guides/selfhosted-on-debian', render('guides/selfhosted-on-debian'))
  .get('/guides/selfhosted-on-ubuntu', render('guides/selfhosted-on-ubuntu'))
  .get('/donate', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/'));
  })
  .get('/terms', hasSidebar, render('terms'))
  .get('/gdpr', hasSidebar, render('gdpr'))
  .get('/dpa', hasSidebar, render('dpa'))
  .get('/report-abuse', hasSidebar, render('report-abuse'))
  .get('/privacy', hasSidebar, render('privacy'))
  .get('/open-startup', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/'));
  })
  .get('/forgot-password', policies.ensureLoggedOut, render('forgot-password'))
  .post(
    '/forgot-password',
    policies.ensureLoggedOut,
    policies.ensureTurnstile,
    rateLimit(10, 'forgot password'),
    web.auth.forgotPassword
  )
  .get(
    '/ap/:domain_id/:alias_id/:encrypted_password',
    rateLimit(20, 'regenerate alias password'),
    web.regenerateAliasPassword
  )
  .get(
    '/reset-password/:token',
    policies.ensureLoggedOut,
    render('reset-password')
  )
  .post(
    '/reset-password/:token',
    policies.ensureLoggedOut,
    policies.ensureTurnstile,
    rateLimit(10, 'reset password'),
    web.auth.resetPassword
  )
  .get(
    config.verifyRoute,
    policies.ensureLoggedIn,
    web.auth.parseReturnOrRedirectTo,
    web.auth.verify
  )
  .post(
    config.verifyRoute,
    policies.ensureLoggedIn,
    web.auth.parseReturnOrRedirectTo,
    rateLimit(10, 'verify'),
    web.auth.verify
  )
  .get('/logout', web.auth.logout)
  .get(
    config.loginRoute,
    web.auth.parseReturnOrRedirectTo,
    web.auth.registerOrLogin
  )
  .post(
    config.loginRoute,
    policies.ensureTurnstile,
    rateLimit(50, 'login'),
    web.auth.login
  )
  .get('/signup', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/register'));
  })
  .get(
    '/register',
    policies.ensureLoggedOut,
    web.auth.parseReturnOrRedirectTo,
    web.auth.registerOrLogin
  )
  .post(
    '/register',
    policies.ensureLoggedOut,
    policies.ensureTurnstile,
    rateLimit(5, 'create user'),
    web.auth.register
  );

for (const route of Object.keys(useCases)) {
  localeRouter.get(
    route,
    web.myAccount.retrieveDomains,
    web.myAccount.sortedDomains,
    (ctx, next) => {
      ctx.state.canonical = `${config.urls.web}/${ctx.locale}/private-business-email`;
      return next();
    },
    render('pricing')
  );
}

for (const doc of developerDocs) {
  // legacy redirect
  localeRouter.get(doc.slug.replace('/blog/docs', '/docs'), (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l(doc.slug));
  });
  localeRouter.get(
    doc.slug,
    (ctx, next) => {
      if (doc.hasSidebar) ctx.state.hasSidebar = true;
      if (doc.ogImage) ctx.state.ogImage = ctx.state.manifest(doc.ogImage);
      return next();
    },
    render(doc.slug.replace('/blog/', ''))
  );
}

localeRouter.get('/docs/nodejs-spam-filter-contact-form', (ctx) => {
  ctx.status = 301;
  ctx.redirect(ctx.state.l('/blog/docs/best-email-spam-protection-filter'));
});

if (platforms.length > 0) {
  // legacy redirect
  localeRouter.get('/open-source', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/blog/open-source'));
  });
  localeRouter.get('/blog/open-source', render('open-source'));
}

for (const [x, platform] of platforms.entries()) {
  // legacy redirect
  localeRouter.get(`/open-source/${dashify(platform)}-email-server`, (ctx) => {
    ctx.status = 301;
    ctx.redirect(
      ctx.state.l(`/blog/open-source/${dashify(platform)}-email-server`)
    );
  });
  localeRouter.get(
    `/blog/open-source/${dashify(platform)}-email-server`,
    (ctx, next) => {
      // override open graph to arbitrarily update publish time
      ctx.state.publishedISOString = dayjs()
        .startOf('day')
        .subtract(x, 'days')
        .toISOString();
      ctx.state.platform = platform;
      return next();
    },
    render('open-source')
  );
  // legacy redirect
  localeRouter.get(`/open-source/${dashify(platform)}-email-clients`, (ctx) => {
    ctx.status = 301;
    ctx.redirect(
      ctx.state.l(`/blog/open-source/${dashify(platform)}-email-clients`)
    );
  });
  localeRouter.get(
    `/blog/open-source/${dashify(platform)}-email-clients`,
    (ctx, next) => {
      // override open graph to arbitrarily update publish time
      ctx.state.publishedISOString = dayjs()
        .startOf('day')
        .subtract(x, 'days')
        .toISOString();
      ctx.state.platform = platform;
      return next();
    },
    render('open-source')
  );
}

// YouTube warns "site may be harmful" if it has a dot extension
// (e.g. "domains.com" -> "domains-com")
localeRouter.get('/guides/domains.com', (ctx) => {
  ctx.status = 301;
  ctx.redirect(ctx.state.l('/guides/domains-com'));
});
localeRouter.get('/guides/name.com', (ctx) => {
  ctx.status = 301;
  ctx.redirect(ctx.state.l('/guides/name-com'));
});

for (const [x, provider] of nsProviders.entries()) {
  localeRouter.get(
    `/guides/${provider.slug}`,
    (ctx, next) => {
      // override open graph to arbitrarily update publish time
      ctx.state.publishedISOString = dayjs()
        .startOf('day')
        .subtract(x, 'days')
        .toISOString();

      // set open graph data
      if (provider.video) ctx.state.video = provider.video;
      if (provider.gif) ctx.state.gif = provider.gif;

      /*
      // dynamically load the DNS Management by Registrar table from FAQ
      try {
        const html = pug.renderFile(
          path.join(config.views.root, 'faq', 'index.pug'),
          // make flash a noop so we don't interfere with messages/session
          {
            ...ctx.state,
            flash() {
              return {};
            }
          }
        );

        // expose it to the view
        const root = parse(html);
        ctx.state.modalFAQTable = root.querySelector(
          '#table-dns-management-by-registrar'
        ).outerHTML;
      } catch (err) {
        ctx.logger.error(err);
      }
      */

      return next();
    },
    render('guides/provider')
  );
}

localeRouter.get('/blog/best-email-service', (ctx) => {
  return ctx.render('compare', { alternatives: config.alternatives });
});

localeRouter.get('/blog/best-private-email-service', (ctx) => {
  // sort by oss
  const alts = [];
  for (let i = 0; i < config.alternatives.length; i++) {
    const alt = { ...config.alternatives[i] };
    if (!alt.e2ee && !alt.openpgp && !alt.wkd) continue;
    alts.push(alt);
  }

  ctx.state.alternatives = alts;
  return ctx.render('compare');
});

localeRouter.get('/blog/best-open-source-email-service', (ctx) => {
  // sort by oss
  const alts = [];
  for (let i = 0; i < config.alternatives.length; i++) {
    const alt = { ...config.alternatives[i] };
    if (!alt.oss) continue;
    alts.push(alt);
  }

  ctx.state.alternatives = alts;
  return ctx.render('compare');
});

localeRouter.get('/blog/best-transactional-email-service', (ctx) => {
  // sort by transactional (api)
  const alts = [];
  for (let i = 0; i < config.alternatives.length; i++) {
    const alt = { ...config.alternatives[i] };
    if (!alt.api) continue;
    if (alt.smtp === 'Requires 3rd party') continue;
    alts.push(alt);
  }

  ctx.state.alternatives = alts;
  return ctx.render('compare');
});

localeRouter.get('/blog/best-email-api-developer-service', (ctx) => {
  // sort by transactional (api)
  const alts = [];
  for (let i = 0; i < config.alternatives.length; i++) {
    const alt = { ...config.alternatives[i] };
    if (!alt.api) continue;
    if (alt.smtp === 'Requires 3rd party') continue;
    alts.push(alt);
  }

  ctx.state.alternatives = alts;
  return ctx.render('compare');
});

localeRouter.get('/blog/best-email-spam-filtering-service', (ctx) => {
  // sort by spam filter only (api)
  const alts = [];
  for (let i = 0; i < config.alternatives.length; i++) {
    const alt = { ...config.alternatives[i] };
    if (alt.name === 'Forward Email') {
      alts.push(alt);
    } else if (
      alt.smtp === 'Requires 3rd party' &&
      alt.imap === 'Requires 3rd party' &&
      alt.pop3 === 'Requires 3rd party'
    ) {
      alts.push(alt);
    }
  }

  ctx.state.alternatives = alts;
  return ctx.render('compare');
});

for (let x = 0; x < config.alternatives.length; x++) {
  const alternative = config.alternatives[x];
  localeRouter.get(`/blog/best-${alternative.slug}-alternative`, (ctx) => {
    // sort and push to top (below FE)
    const alts = [];
    for (let i = 0; i < config.alternatives.length; i++) {
      const alt = { ...config.alternatives[i] };
      alt._key = `${
        alt.name === alternative.name || alt.name === 'Forward Email'
          ? '0'
          : '1'
      }_${i}`;
      if (alt.name === alternative.name) alt.comparison = true;

      alts.push(alt);
    }

    let sample;
    if (x < 3) {
      sample = 'Top';
    } else if (x < 6) {
      sample = 'Best';
    } else if (x < 9) {
      sample = 'Top-Rated';
    } else if (x < 12) {
      sample = 'Most Popular';
    } else if (x < 15) {
      sample = 'Highest-Rated';
    } else if (x < 18) {
      sample = 'Greatest';
    } else if (x < 21) {
      sample = 'Amazing';
    } else if (x < 24) {
      sample = 'Excellent';
    } else if (x < 27) {
      sample = 'Favorited';
    } else if (x < 30) {
      sample = 'Notable';
    } else if (x < 33) {
      sample = 'Leading';
    } else if (x < 36) {
      sample = 'Outstanding';
    } else if (x < 39) {
      sample = 'Important';
    } else if (x < 41) {
      sample = 'Mighty';
    } else if (x < 44) {
      sample = 'Best';
    } else {
      sample = 'Top';
    }

    // override open graph to arbitrarily update publish time
    ctx.state.publishedISOString = dayjs()
      .startOf('day')
      .subtract(x, 'days')
      .toISOString();

    ctx.state.meta.title = ctx.state.t(
      '<span class="notranslate">%d</span> <span class="notranslate">%s</span> <span class="notranslate">%s</span> Alternatives in <span class="notranslate">%s</span>',
      config.alternatives.length - 1,
      ctx.state.t(sample),
      alternative.name,
      dayjs().format('YYYY')
    );

    ctx.state.meta.description = ctx.state.t(
      'Reviews, comparison, screenshots and more for the <span class="notranslate">%d</span> <span class="notranslate">%s</span> alternatives to <span class="notranslate">%s</span> email service.',
      config.alternatives.length - 1,
      ctx.state.t(sample.toLowerCase()),
      alternative.name
    );

    ctx.state.alternativeTo = alternative.name;
    ctx.state.alternatives = _.sortBy(alts, '_key');
    return ctx.render('compare');
  });
  for (const a of config.alternatives) {
    if (a.name === alternative.name) continue;
    localeRouter.get(
      `/blog/${alternative.slug}-vs-${a.slug}-email-service-comparison`,
      (ctx) => {
        ctx.state.meta.title = ctx.state.t(
          `<span class="notranslate">%s</span> vs <span class="notranslate">%s</span> Comparison (<span class="notranslate">%s</span>)`,
          alternative.name,
          a.name,
          dayjs().format('YYYY')
        );

        ctx.state.meta.description = ctx.state.t(
          `What are the differences between <span class="notranslate">%s</span> and <span class="notranslate">%s</span>?`,
          alternative.name,
          a.name
        );

        // sort and push to top (below FE)
        const alts = [];
        for (let i = 0; i < config.alternatives.length; i++) {
          const alt = { ...config.alternatives[i] };
          if (alt.name === alternative.name || alt.name === a.name)
            alt.comparison = true;
          if (!alt.comparison) continue;
          alt._key = alt.name === alternative.name ? 0 : 1;
          alts.push(alt);
        }

        ctx.state.alternativeTo = alternative.name;
        ctx.state.alternatives = _.sortBy(alts, '_key');
        ctx.state.comparison = true;
        return ctx.render('compare');
      }
    );
  }
}

localeRouter.use(myAccount.routes()).use(admin.routes()).use(otp.routes());

router.use(auth.routes()).use(localeRouter.routes());

module.exports = router;
