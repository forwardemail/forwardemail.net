/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The projects page: a card for each of our other projects, with its image,
// what it is, why we built it, and links to its site and source code.
//

const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

const config = require('#config');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);
test.afterEach.always(utils.teardownWebServer);

test('the projects page has a card for each project', async (t) => {
  t.is(config.projects.length, 9);
  const res = await t.context.web.get('/en/projects');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;

  t.is(document.querySelector('h1').textContent.trim(), 'Our Projects');
  t.regex(document.title, /^Our Projects - Open-Source Sites and Tools/);

  const cards = [...document.querySelectorAll('.fe-project-card')];
  t.is(cards.length, config.projects.length);

  for (const [i, project] of config.projects.entries()) {
    const card = cards[i];
    t.is(card.querySelector('h2').textContent.trim(), project.name);
    const texts = [...card.querySelectorAll('.fe-card__text')].map((p) =>
      p.textContent.trim()
    );
    t.deepEqual(texts, [project.description, project.why]);
    t.is(
      card.querySelector('.fe-project-card__label').textContent.trim(),
      'Why we built it'
    );

    // its Open Graph image, served by the site
    const img = card.querySelector('img');
    t.is(img.getAttribute('alt'), project.name);
    const src = img.getAttribute('src');
    t.regex(src, /\/img\/projects\/[a-z-]+(-[\da-f]+)?\.webp$/);
    const image = await t.context.web.get(new URL(src, 'http://x').pathname);
    t.is(image.status, 200, `${project.name} image`);
    t.regex(image.headers['content-type'], /^image\/webp/);

    // the site and its source code, in a new tab
    const links = [...card.querySelectorAll('.fe-project-card__actions a')];
    t.deepEqual(
      links.map((a) => [
        a.getAttribute('href'),
        a.textContent.replace(project.name, '').trim()
      ]),
      [
        [project.url, 'Visit Project'],
        [project.repo, 'View Source Code']
      ]
    );
    for (const a of links) {
      t.is(a.getAttribute('target'), '_blank');
      t.is(a.getAttribute('rel'), 'noopener noreferrer');
    }

    // (the card has no link over it, so each button gets its own click)
    t.is(card.querySelector('.fe-card__link'), null);
  }
});

test('the projects page is translated', async (t) => {
  const res = await t.context.web.get('/de/projects');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  t.is(document.querySelector('h1').textContent.trim(), 'Unsere Projekte');

  const card = document.querySelector('.fe-project-card');
  // the name stays as is, the text and the buttons are in German
  t.is(card.querySelector('h2').textContent.trim(), 'Privacy Ratings');
  const [description] = card.querySelectorAll('.fe-card__text');
  t.not(description.textContent.trim(), config.projects[0].description);
  const labels = [...card.querySelectorAll('.fe-project-card__actions a')].map(
    (a) => a.textContent.replace('Privacy Ratings', '').trim()
  );
  t.notDeepEqual(labels, ['Visit Project', 'View Source Code']);
});

test('the sitemap lists the projects page', async (t) => {
  const res = await t.context.web.get('/en/sitemap.xml');
  t.is(res.status, 200);
  t.true(res.text.includes('/en/projects</loc>'));
});
