/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The Resources menu lists our other projects under their own header, the
// Company menu and the footer link to the projects page, and the press page
// no longer has the old graphics.
//

const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);
test.afterEach.always(utils.teardownWebServer);

// links on the page, including those in the deferred <template> menus
function getLinks(document, selector) {
  const roots = [
    document,
    ...[...document.querySelectorAll('template')].map((tpl) => tpl.content)
  ];
  return roots.flatMap((root) => [...root.querySelectorAll(selector)]);
}

const PROJECTS = [
  ['https://privacyratings.com', 'Privacy Ratings'],
  ['https://spamscanner.net', 'Spam Scanner'],
  ['https://attestium.com', 'Attestium'],
  ['https://terminalemail.com', 'Terminal Email'],
  ['https://alumniemail.com', 'Alumni Email'],
  ['https://timetoinbox.com', 'Time to Inbox'],
  ['https://serverauditing.com', 'Server Auditing'],
  ['https://sshmonitor.com', 'SSH Monitor'],
  ['https://sslmonitor.com', 'SSL Monitor'],
  ['https://forwardemail.github.io/tangerine', 'Tangerine'],
  ['https://jobscheduler.net/#/', 'Bree'],
  ['https://cabinjs.com', 'Cabin'],
  ['https://lad.js.org', 'Lad'],
  ['https://lass.js.org', 'Lass']
];

test('the Resources menu lists our projects under a header', async (t) => {
  for (const [locale, header] of [
    ['en', 'Our Projects'],
    ['de', 'Unsere Projekte']
  ]) {
    const res = await t.context.web.get(`/${locale}`);
    t.is(res.status, 200);
    const start = res.text.indexOf(`>${header}<`);
    t.true(start > 0, `in ${locale}`);
    // (in order, after the header)
    const order = PROJECTS.map(([href]) =>
      res.text.indexOf(`href="${href}"`, start)
    );
    t.true(
      order.every(
        (index, i) => index > start && (i === 0 || index > order[i - 1])
      ),
      `in ${locale}`
    );

    // each project is named by its name, spaced, without its domain
    const { document } = new JSDOM(res.text).window;
    const links = getLinks(document, 'a.dropdown-item').filter((a) =>
      PROJECTS.some(([href]) => href === a.getAttribute('href'))
    );
    t.deepEqual(
      links.map((a) => a.textContent.trim()),
      PROJECTS.map(([, name]) => name),
      `in ${locale}`
    );
  }
});

test('the Company menu and the footer link to the projects page after About', async (t) => {
  for (const [locale, about, projects] of [
    ['en', 'About', 'Projects'],
    ['de', 'Über uns', 'Projekte']
  ]) {
    const res = await t.context.web.get(`/${locale}`);
    t.is(res.status, 200);
    const { document } = new JSDOM(res.text).window;

    // Company menu
    const menu = getLinks(
      document,
      '[aria-labelledby="navbar-dropdown-company"] a.dropdown-item'
    );
    const menuAbout = menu.findIndex(
      (a) => a.getAttribute('href') === `/${locale}/about`
    );
    t.true(menuAbout >= 0, `in ${locale}`);
    t.is(menu[menuAbout + 1].getAttribute('href'), `/${locale}/projects`);
    t.is(menu[menuAbout + 1].textContent.trim(), projects, `in ${locale}`);

    // footer
    const footer = [...document.querySelectorAll('#footer-col-company a')];
    const footerAbout = footer.findIndex(
      (a) => a.getAttribute('href') === `/${locale}/about`
    );
    t.is(footer[footerAbout].textContent.trim(), about, `in ${locale}`);
    t.is(footer[footerAbout + 1].getAttribute('href'), `/${locale}/projects`);
    t.is(footer[footerAbout + 1].textContent.trim(), projects, `in ${locale}`);
  }
});

test('the press page has no graphics section', async (t) => {
  for (const locale of ['en', 'de', 'ja']) {
    const res = await t.context.web.get(`/${locale}/press`);
    t.is(res.status, 200);
    t.true(res.text.includes('logo-square.svg'), `in ${locale}`);
    t.false(res.text.includes('domain-onboard.gif'), `in ${locale}`);
    t.false(res.text.includes('#graphics'), `in ${locale}`);
  }
});
