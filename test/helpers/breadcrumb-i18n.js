/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');
const test = require('ava');
const humanize = require('humanize-string');
const isFQDN = require('is-fqdn');
const pug = require('pug');
const titleize = require('titleize');

const _ = require('#helpers/lodash');

const breadcrumbsTemplate = path.join(
  __dirname,
  '..',
  '..',
  'app',
  'views',
  '_breadcrumbs.pug'
);

// (the template words an alias as a mailbox, and translates these on every
// render, whatever the breadcrumbs)
const MAILBOX_WORDING = new Set([
  'Mailboxes',
  'Aliases',
  'Add Alias',
  'Add Mailbox',
  'Edit Alias',
  'Edit Mailbox'
]);

function renderBreadcrumbs(breadcrumbs, translate) {
  return pug.renderFile(breadcrumbsTemplate, {
    _,
    breadcrumbs,
    breadcrumbHeaderCentered: true,
    humanize,
    // (as the views have it, from config/utilities)
    isFQDN,
    t: translate,
    titleize
  });
}

test('translates normal breadcrumb path segments', (t) => {
  const translated = [];
  const html = renderBreadcrumbs(['my-account', 'domains'], (value) => {
    if (!MAILBOX_WORDING.has(value)) translated.push(value);
    return `translated ${value}`;
  });

  t.deepEqual(translated, ['My Account', 'Domains', 'Domains']);
  t.true(html.includes('translated My Account'));
  t.true(html.includes('translated Domains'));
});

test('does not translate ObjectId-shaped breadcrumb path segments', (t) => {
  const translated = [];
  const objectId = '6aaf30177318861389e02e00';
  const html = renderBreadcrumbs(['domains', objectId], (value) => {
    if (!MAILBOX_WORDING.has(value)) translated.push(value);
    return `translated ${value}`;
  });

  t.deepEqual(translated, ['Domains']);
  t.true(html.includes(objectId));
  t.false(html.includes(`translated ${objectId}`));
});

test('does not translate ObjectId-shaped named breadcrumbs', (t) => {
  const translated = [];
  const objectId = '6aaf30177318861389e02e00';
  const html = renderBreadcrumbs(
    ['domains', { name: objectId, href: `/domains/${objectId}` }],
    (value) => {
      if (!MAILBOX_WORDING.has(value)) translated.push(value);
      return `translated ${value}`;
    }
  );

  t.deepEqual(translated, ['Domains']);
  t.true(html.includes(objectId));
  t.false(html.includes(`translated ${objectId}`));
});
