/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const splitLines = require('split-lines');
const { compile } = require('html-to-text');
const { parse, HTMLElement } = require('node-html-parser');
const _ = require('#helpers/lodash');

const config = require('#config');

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

//
// One converter for every section of every page. html-to-text's convert()
// builds its selector tree again on each call (it is compile(options)(html)),
// and it ran once per element under every heading of every page crawled.
//
const toText = compile({
  wordwrap: false,
  linkBrackets: false,
  selectors: [
    ...[1, 2, 3, 4, 5, 6].map((i) => ({
      selector: `h${i}`,
      format: 'block',
      options: { uppercase: false }
    })),
    { selector: 'form', format: 'skip' },
    { selector: 'pre', format: 'skip' },
    { selector: 'img', format: 'skip' },
    { selector: 'svg', format: 'skip' },
    { selector: 'hr', format: 'skip' },
    { selector: 'ul', options: { itemPrefix: ' ' } },
    {
      selector: 'a',
      options: {
        hideLinkHrefIfSameAsText: true,
        ignoreHref: true,
        baseUrl: config.urls.web,
        linkBrackets: false
      }
    }
  ]
});

//
// The elements after `node` among its siblings, up to the next heading (the
// section under a heading). node-html-parser's nextElementSibling searches
// the parent's children from the start on every call, so walking a section
// with it was quadratic in the size of the parent (the FAQ keeps thousands of
// elements in one container). This walks the children by index, finding each
// parent's index of its children once.
//
function sectionAfter(node, indexes) {
  const parent = node.parentNode;
  if (!parent) return [];
  let index = indexes.get(parent);
  if (!index) {
    index = new Map(parent.childNodes.map((child, i) => [child, i]));
    indexes.set(parent, index);
  }

  const elements = [];
  const children = parent.childNodes;
  for (let i = index.get(node) + 1; i < children.length; i++) {
    const child = children[i];
    if (!(child instanceof HTMLElement)) continue;
    if (HEADINGS.has(child.rawTagName)) break;
    elements.push(child);
  }

  return elements;
}

/**
 * The search index entries of a page: one for the page (its title and meta
 * description) and one for each heading with text under it.
 *
 * @param {string} html - The page as served
 * @param {string} pageUrl - The page's URL (the sitemap's <loc>)
 * @returns {{ page: Object, sections: Array<Object> }} The entries, as the
 *   SearchResults documents they upsert
 */
function getSearchEntries(html, pageUrl) {
  const document = parse(html);

  // remove <nav> and <footer> and all modals
  for (const el of document.querySelectorAll(
    'nav, footer, .modal, .fixed-bottom, .no-search'
  )) {
    el.remove();
  }

  const title = document.querySelector('title').rawText;
  const content = document
    .querySelector('meta[name="description"]')
    .getAttribute('content');
  const locale = document.querySelector('html').getAttribute('lang');

  const page = { href: pageUrl, title, content, locale };
  const sections = [];
  const indexes = new Map();

  for (const header of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    let content = '';

    let href = pageUrl;
    let id;

    id = header.getAttribute('id');
    if (!isSANB(id) || id === 'top') id = null;
    if (!id) {
      const a = header.querySelector('a');
      if (a) {
        id = a.getAttribute('id');
        if (!isSANB(id) || id === 'top') id = null;
      }
    }

    if (!id) {
      // find closest parent header
      const number = Number.parseInt(header.rawTagName.replace('h', ''), 10);
      if (number !== 1) {
        const closest = header.closest(`h${number - 1}`);
        if (closest) {
          id = closest.getAttribute('id');
          if (!isSANB(id) || id === 'top') id = null;
          if (!id) {
            const anchor = closest.querySelector('a');
            if (anchor) {
              const id = anchor.getAttribute('id');
              if (isSANB(id) && id !== 'top') href += `#${id}`;
            }
          }
        }
      }
    }

    if (id) {
      href += `#${id}`;
      href += `:~:text=${encodeURIComponent(header.text)}`;
    } else {
      href += `#:~:text=${encodeURIComponent(header.text)}`;
    }

    for (const node of sectionAfter(header, indexes)) {
      content += _.compact(splitLines(toText(node.outerHTML).trim())).join(' ');
    }

    // <https://stackoverflow.com/a/64875801>
    content = content
      .replace(/\s\s+/g, ' ')
      // .replace(/\s*([,.!?:;]+)(?!\s*$)\s*/g, '$1 ')
      .trim();

    if (content)
      sections.push({
        href,
        title,
        header: header.text,
        content,
        locale
      });
  }

  return { page, sections };
}

module.exports = getSearchEntries;
