/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const sharp = require('sharp');
const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');
const config = require('#config');
const { AGGREGATE_RATING_KEY } = require('#helpers/aggregate-rating');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

async function getPage(t, path, headers = {}) {
  const res = await t.context.web
    .get(path)
    .set({ Accept: 'text/html', ...headers });
  t.is(res.status, 200, path);
  const { window } = new JSDOM(res.text);
  t.teardown(() => window.close());
  return window.document;
}

// every JSON-LD node of the page (each must parse)
function jsonLd(t, document) {
  return [
    ...document.querySelectorAll('script[type="application/ld+json"]')
  ].map((script) => {
    try {
      return JSON.parse(script.textContent);
    } catch (err) {
      t.fail(`invalid JSON-LD: ${err.message}`);
      return {};
    }
  });
}

const ORGANIZATION = 'https://forwardemail.net/#organization';

test('the home page publishes no questions it does not show, and no rating without one', async (t) => {
  const document = await getPage(t, '/en');
  const nodes = jsonLd(t, document);
  const types = new Set(nodes.map((node) => node['@type']));
  t.true(types.has('SoftwareApplication'));
  t.false(types.has('FAQPage'));
  // (no rating stored yet, so none published and none shown)
  t.false(JSON.stringify(nodes).includes('aggregateRating'));
  t.is(document.querySelector('.fe-rating'), null);

  // one organization, named by its @id everywhere else
  const organizations = nodes.filter(
    (node) => node['@type'] === 'Organization'
  );
  t.is(organizations.length, 1);
  const [organization] = organizations;
  t.is(organization['@id'], ORGANIZATION);
  // the site search belongs to the WebSite node, not the organization
  t.is(organization.potentialAction, undefined);
  t.truthy(nodes.find((node) => node['@type'] === 'WebSite').potentialAction);
  // a logo file at the size it claims
  t.is(
    organization.logo.url,
    'https://forwardemail.net/img/logo-square-180x180.png'
  );
  const logo = await t.context.web.get('/img/logo-square-180x180.png');
  t.is(logo.status, 200);
  t.is(logo.body.readUInt32BE(16), Number(organization.logo.width));
  t.is(logo.body.readUInt32BE(20), Number(organization.logo.height));

  const app = nodes.find((node) => node['@type'] === 'SoftwareApplication');
  t.is(app.author['@id'], ORGANIZATION);
});

test('breadcrumbs follow the path and name pages in plain text', async (t) => {
  const document = await getPage(
    t,
    '/en/guides/send-mail-as-gmail-custom-domain'
  );
  const breadcrumbs = jsonLd(t, document).find(
    (node) => node['@type'] === 'BreadcrumbList'
  );
  t.deepEqual(
    breadcrumbs.itemListElement.map((item) => [
      item.position,
      item.name,
      item.item
    ]),
    [
      [1, 'Home', `${config.urls.web}/en`],
      [2, 'Email Setup Guides & Tutorials', `${config.urls.web}/en/guides`],
      [
        3,
        'Gmail Send Mail As',
        `${config.urls.web}/en/guides/send-mail-as-gmail-custom-domain`
      ]
    ]
  );

  // a title holding markup (<span class="notranslate">78</span> Top ...)
  const alternative = await getPage(t, '/en/blog/best-intercom-alternative');
  const nodes = jsonLd(t, alternative);
  const { itemListElement } = nodes.find(
    (node) => node['@type'] === 'BreadcrumbList'
  );
  const { name } = itemListElement.at(-1);
  t.regex(name, /^\d+ Top Intercom Alternatives/);
  t.false(name.includes('<'));
  t.false(name.includes('&'));

  // neither a rating nor questions the page does not show
  t.false(JSON.stringify(nodes).includes('aggregateRating'));
  t.false(nodes.some((node) => node['@type'] === 'FAQPage'));
  t.truthy(nodes.find((node) => node['@type'] === 'Product').image);
});

// the text of an element or an HTML string, with its whitespace collapsed
const text = (html) =>
  new JSDOM(`<div>${html}</div>`).window.document.body.textContent
    .replace(/\s+/g, ' ')
    .trim();

test('the FAQ structured data is the questions and answers the page shows', async (t) => {
  t.timeout(300_000);
  for (const locale of ['en', 'de', 'ja']) {
    const document = await getPage(t, `/${locale}/faq`);
    const faq = jsonLd(t, document).find((node) => node['@type'] === 'FAQPage');
    const shown = [...document.querySelectorAll('details.fe-faq-answer')];
    t.true(shown.length > 100);
    // every question, in the same order and the same words
    t.deepEqual(
      faq.mainEntity.map((question) => question.name),
      shown.map((details) =>
        details.querySelector('.fe-faq-answer__text').textContent.trim()
      ),
      `${locale}`
    );
    // and each answer as the page shows it (emoji included)
    for (const [i, question] of faq.mainEntity.entries()) {
      const answer = text(question.acceptedAnswer.text).slice(0, 80);
      t.true(
        text(shown[i].querySelector('.fe-faq-answer__body').innerHTML).includes(
          answer
        ),
        `${locale}: ${question.name}`
      );
    }
  }

  // none for a search, whose page shows only the answers that match
  const search = await getPage(t, '/en/faq?q=dkim');
  t.false(jsonLd(t, search).some((node) => node['@type'] === 'FAQPage'));
});

test('the main navigation is labelled and its menus carry no headings', async (t) => {
  const document = await getPage(t, '/en/about');
  t.is(
    document.querySelector('nav.navbar').getAttribute('aria-label'),
    'Main menu'
  );

  const roots = [
    document,
    ...[...document.querySelectorAll('template')].map((tpl) => tpl.content)
  ];
  const headers = roots.flatMap((root) => [
    ...root.querySelectorAll('.dropdown-header')
  ]);
  t.true(headers.length > 0);
  for (const header of headers) t.is(header.tagName, 'DIV');
  // the page's first heading is its own title
  t.is(document.querySelector('h1,h2,h3,h4,h5,h6').tagName, 'H1');

  // lists hold only list items
  for (const ul of document.querySelectorAll('ul')) {
    for (const child of ul.children)
      t.true(['LI', 'TEMPLATE'].includes(child.tagName), `${child.outerHTML}`);
  }

  // the footer language list is a plain list of links, visible to screen
  // readers when open
  const languages = document.querySelector('#navbar-dropdown-language-ul');
  t.false(languages.hasAttribute('role'));
  t.false(languages.hasAttribute('aria-hidden'));
  t.true(languages.querySelectorAll('li > a.dropdown-item').length > 10);
});

test('the about page links to pages and anchors that exist', async (t) => {
  const document = await getPage(t, '/en/about');
  // every link is reachable by keyboard (the table of contents button too)
  t.is(document.querySelectorAll('a:not([href])').length, 0);
  const links = [...document.querySelectorAll('.markdown-body a[href]')]
    .map((a) => new URL(a.getAttribute('href'), `${config.urls.web}/en/about`))
    .filter((url) => url.origin === config.urls.web);
  t.true(links.length > 20);
  const checked = new Map();
  for (const url of links) {
    let path = url.pathname;
    if (!checked.has(path)) {
      let res = await t.context.web.get(path).set({ Accept: 'text/html' });
      if (res.status === 301 || res.status === 302) {
        path = res.headers.location;

        res = await t.context.web.get(path).set({ Accept: 'text/html' });
      }

      checked.set(url.pathname, res);
    }

    // (some pages need keys a test run does not have, so only a 404 fails)
    const res = checked.get(url.pathname);
    t.not(res.status, 404, `${url.href}`);
    if (res.status === 200 && url.hash.length > 1)
      t.true(
        res.text.includes(`id="${url.hash.slice(1)}"`),
        `${url.href} has its anchor`
      );
  }
});

test('the API reference links only to its own sections', async (t) => {
  // (crawlers get the reference as a page; people get the API explorer)
  const document = await getPage(t, '/en/email-api', {
    'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)'
  });
  const fragments = [...document.querySelectorAll('a[href^="#"]')]
    .map((a) => a.getAttribute('href').slice(1))
    .filter(Boolean);
  t.true(fragments.includes('retrieve-outbound-smtp-email'));
  for (const id of fragments)
    t.truthy(document.querySelector(`[id="${id}"]`), `#${id} exists`);
});

test('the FAQ links only to its own answers', async (t) => {
  t.timeout(120_000);
  const document = await getPage(t, '/en/faq');
  const fragments = [...document.querySelectorAll('a[href^="#"]')]
    .map((a) => decodeURIComponent(a.getAttribute('href').slice(1)))
    .filter(Boolean);
  t.true(
    fragments.includes(
      'is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias'
    )
  );
  for (const id of new Set(fragments))
    t.truthy(document.querySelector(`[id="${id}"]`), `#${id} exists`);

  // no markdown left unrendered inside its HTML blocks
  const main = document.querySelector('main').cloneNode(true);
  for (const element of main.querySelectorAll('code, pre, script, template'))
    element.remove();
  t.notRegex(main.textContent, /\*\*[^*\s][^*]*\*\*/);
  t.notRegex(main.textContent, /]\(#[\w-]+\)/);
});

test('the Gmail guide holds its free plan anchor once', async (t) => {
  const document = await getPage(
    t,
    '/en/guides/send-mail-as-gmail-custom-domain'
  );
  const anchors = document.querySelectorAll('#legacy-free-guide');
  t.is(anchors.length, 1);
  // with the free plan guide inside it
  t.truthy(anchors[0].querySelector('.card-body ol, .card-body ul'));
});

test('a README docs page links to its repository files', async (t) => {
  const document = await getPage(t, '/en/blog/docs/node-js-logging-service');
  const hrefs = [...document.querySelectorAll('.markdown-body a[href]')].map(
    (a) => a.getAttribute('href')
  );
  t.true(
    hrefs.includes('https://github.com/cabinjs/cabin/blob/HEAD/examples/koa.js')
  );
  t.true(
    hrefs.includes('https://github.com/cabinjs/cabin/blob/HEAD/src/message.js')
  );
  for (const href of hrefs)
    t.regex(href, /^(https?:|mailto:|#|\/)/, `${href} is not relative`);

  for (const img of document.querySelectorAll('.markdown-body img')) {
    t.regex(img.getAttribute('src'), /^(https?:|data:|\/)/);
    t.not(img.getAttribute('alt'), '#');
  }

  // every link has a name (text, alt text or a label)
  for (const a of document.querySelectorAll('.markdown-body a[href]')) {
    const named =
      a.textContent.trim() ||
      a.getAttribute('aria-label') ||
      [...a.querySelectorAll('img')].some((img) => img.getAttribute('alt'));
    t.truthy(named, `${a.outerHTML}`);
  }

  for (const heading of document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
    t.not(heading.textContent.trim(), '', `${heading.outerHTML}`);
});

test('comparison menus follow only the pairs the sitemap lists', async (t) => {
  const document = await getPage(t, '/en/blog/best-gmail-alternative');
  const links = [...document.querySelectorAll('a.dropdown-item[href*="-vs-"]')];
  t.true(links.length > 1000);
  const listed = (href) => {
    const [, a, b] = href.match(
      /\/blog\/(.+)-vs-(.+)-email-service-comparison$/
    );
    return (
      config.topCompetitors.includes(a) && config.topCompetitors.includes(b)
    );
  };

  let followed = 0;
  for (const link of links) {
    const href = link.getAttribute('href');
    if (listed(href)) {
      followed++;
      t.false(link.hasAttribute('rel'), `${href}`);
    } else {
      t.is(link.getAttribute('rel'), 'nofollow', `${href}`);
    }
  }

  t.true(followed > 0);
});

test('page descriptions are whole sentences and titles are unique', (t) => {
  const plain = (string) => String(string || '').replace(/<[^>]+>/g, '');
  const titles = new Map();
  for (const [path, value] of Object.entries(config.meta)) {
    if (!Array.isArray(value)) continue;
    const [title, description] = value.map((string) => plain(string));
    t.notRegex(
      description,
      /\b(and|or|for|with|to|the|a|of|from|by|your|seamless|enhance|user|all)\.?$/i,
      `${path} description ends mid-sentence`
    );
    t.false(titles.has(title), `${path} has the title of ${titles.get(title)}`);
    titles.set(title, path);
  }
});

test('og:locale names the language and its territory', async (t) => {
  for (const [path, expected] of [
    ['/en/privacy', 'en_US'],
    ['/de/privacy', 'de_DE'],
    ['/no/privacy', 'nb_NO'],
    ['/zh/privacy', 'zh_CN']
  ]) {
    const document = await getPage(t, path);
    t.is(
      document
        .querySelector('meta[property="og:locale"]')
        .getAttribute('content'),
      expected
    );
  }
});

test('the images the structured data and the app manifests name are current', async (t) => {
  t.timeout(120_000);
  const { web } = t.context;
  const fetchImage = async (url) => {
    const res = await web
      .get(new URL(url, 'https://forwardemail.net').pathname)
      .buffer(true)
      .parse((res, callback) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => callback(null, Buffer.concat(chunks)));
      });
    t.is(res.status, 200, `${url}`);
    return { res, metadata: await sharp(res.body).metadata(), body: res.body };
  };

  const nodes = jsonLd(t, await getPage(t, '/en'));
  const organization = nodes.find((node) => node['@type'] === 'Organization');
  const app = nodes.find((node) => node['@type'] === 'SoftwareApplication');

  // the organization's image is the social card, at the Open Graph size
  const social = await fetchImage(organization.image);
  t.is(social.metadata.width, 1200);
  t.is(social.metadata.height, 630);
  // the screenshot is of the apps
  const screenshot = await fetchImage(app.screenshot);
  t.is(screenshot.metadata.format, 'jpeg');
  t.true(screenshot.metadata.width >= 1200);
  t.regex(app.downloadUrl, /\/en\/download$/);

  // the tile and splash colours are the background of the icons
  const tile = await fetchImage('/img/mstile-150x150.png');
  const { data } = await sharp(tile.body)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const corner = `#${[...data.subarray(0, 3)]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
  const browserconfig = await web.get('/browserconfig.xml');
  t.is(
    browserconfig.text
      .match(/<TileColor>([^<]+)<\/TileColor>/)[1]
      .toLowerCase(),
    corner
  );
  const manifestRes = await web.get('/site.webmanifest').buffer(true);
  const manifest = JSON.parse(
    manifestRes.text || Buffer.from(manifestRes.body).toString()
  );
  t.is(manifest.background_color.toLowerCase(), corner);
  for (const icon of manifest.icons) {
    const { metadata } = await fetchImage(icon.src);
    t.is(`${metadata.width}x${metadata.height}`, icon.sizes);
  }

  const home = await web.get('/en').set({ Accept: 'text/html' });
  t.true(
    home.text.includes(
      `<meta name="msapplication-TileColor" content="${corner.toUpperCase()}"/>`
    ) ||
      home.text.includes(
        `<meta name="msapplication-TileColor" content="${corner}"/>`
      )
  );
});

// (last: the other tests run without a stored rating)
test('the stored Trustpilot rating is published where the page shows it', async (t) => {
  const { client } = t.context._web;
  await client.set(
    AGGREGATE_RATING_KEY,
    JSON.stringify({
      ratingValue: 4.2,
      ratingCount: 1234,
      bestRating: 5,
      worstRating: 1,
      url: 'https://www.trustpilot.com/review/example.com',
      fetchedAt: Date.now()
    })
  );
  t.teardown(() => client.del(AGGREGATE_RATING_KEY));

  const expected = {
    '@type': 'AggregateRating',
    ratingValue: '4.2',
    ratingCount: '1234',
    bestRating: '5',
    worstRating: '1'
  };

  for (const [path, type, shown] of [
    [
      '/en',
      'SoftwareApplication',
      'Rated 4.2 out of 5 from 1,234 reviews on Trustpilot.'
    ],
    [
      '/de',
      'SoftwareApplication',
      'Mit 4,2 von 5 bewertet, aus 1.234 Bewertungen auf Trustpilot.'
    ],
    [
      '/en/blog/best-gmail-alternative',
      'Product',
      'Rated 4.2 out of 5 from 1,234 reviews on Trustpilot.'
    ]
  ]) {
    const document = await getPage(t, path);
    const node = jsonLd(t, document).find((node) => node['@type'] === type);
    t.deepEqual(node.aggregateRating, expected, `${path}`);
    const line = document.querySelector('.fe-rating');
    t.is(line.textContent.trim(), shown);
    t.is(
      line.querySelector('a').getAttribute('href'),
      'https://www.trustpilot.com/review/example.com'
    );
  }

  // a page that does not show it does not carry it
  const about = await getPage(t, '/en/about');
  t.is(about.querySelector('.fe-rating'), null);
  t.false(JSON.stringify(jsonLd(t, about)).includes('aggregateRating'));
});
