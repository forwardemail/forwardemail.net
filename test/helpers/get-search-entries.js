/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// helpers/get-search-entries.js builds the search index entries that
// jobs/crawl-sitemap.js upserts. It must give exactly what the job built
// before (searchEntriesBefore below, the job's own code), on hand-written
// pages with the cases it handles and on pages the web server renders.
//

const isSANB = require('is-string-and-not-blank');
const splitLines = require('split-lines');
const test = require('ava');
const { convert } = require('html-to-text');
const { parse } = require('node-html-parser');

const utils = require('../utils');
const _ = require('#helpers/lodash');
const config = require('#config');
const getSearchEntries = require('#helpers/get-search-entries');

// the entries jobs/crawl-sitemap.js built for a page, as it built them
function searchEntriesBefore(text, loc) {
  const document = parse(text);

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

  const page = { href: loc, title, content, locale };
  const sections = [];

  for (const header of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    let content = '';
    let href = loc;
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

    let node = header;
    while (
      node.nextElementSibling &&
      !['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(
        node.nextElementSibling.rawTagName
      )
    ) {
      node = node.nextElementSibling;
      content += _.compact(
        splitLines(
          convert(node.outerHTML, {
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
          }).trim()
        )
      ).join(' ');
    }

    content = content.replace(/\s\s+/g, ' ').trim();

    if (content)
      sections.push({ href, title, header: header.text, content, locale });
  }

  return { page, sections };
}

// both results, or the message each one threw
function outcome(fn, html, loc) {
  try {
    return { entries: fn(html, loc) };
  } catch (err) {
    return { error: err.message };
  }
}

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

const LOC = `${config.urls.web}/en/example`;

function page(body, head) {
  return `<!DOCTYPE html><html lang="en"><head>${
    head ??
    '<title>Example &amp; Page</title><meta name="description" content="About the example">'
  }</head><body>${body}</body></html>`;
}

const PAGES = {
  'text, comments and whitespace between the elements of a section': page(
    `<h2 id="one">One</h2>
     loose text
     <!-- a comment -->
     <p>First   paragraph
     over lines</p>
     <p>Second</p>  more loose text
     <h2 id="two">Two</h2><p>After two</p>`
  ),
  'ids: on the heading, on its anchor, "top", and none': page(
    `<h2 id="top">Top id</h2><p>a</p>
     <h2><a id="anchored" href="#anchored">Anchored</a></h2><p>b</p>
     <h2><a id="top" href="#top">Anchor top</a></h2><p>c</p>
     <h3>No id</h3><p>d</p>
     <h1>Title heading</h1><p>e</p>`
  ),
  'a heading inside a heading of the level above': page(
    `<h2 id="outer">Outer <h3>Inner</h3></h2><p>under outer</p>
     <h4><a id="x">x</a><h5>Nested five</h5></h4><p>under four</p>
     <h3><a id="top">t</a><h4>Under anchor top</h4></h3><p>p</p>`
  ),
  'sections in nested containers, and headings with nothing after them': page(
    `<main><div class="container">
       <section><h2 id="a">A</h2><p>in a</p><div><p>deeper in a</p>
         <h3 id="a1">A one</h3><p>in a1</p></div></section>
       <section><h2 id="b">B</h2></section>
       <h2 id="c">C</h2><hr><img src="x.png" alt="x">
       <h2 id="d">D</h2><ul><li>one</li><li><a href="https://example.com">https://example.com</a></li><li><a href="/x">link</a></li></ul>
     </div></main>`
  ),
  'parts the crawler removes or skips': page(
    `<nav><h2 id="nav">Nav</h2><p>nav text</p></nav>
     <h2 id="s">Section</h2>
     <div class="modal"><h3>Modal</h3><p>modal text</p></div>
     <p>kept</p><p class="no-search">not indexed</p>
     <pre><code>skipped code</code></pre>
     <form><input name="q"><button>Go</button></form>
     <svg><text>svg</text></svg>
     <div class="fixed-bottom">fixed</div>
     <table><tr><td>cell one</td><td>cell two</td></tr></table>
     <footer><h2 id="f">Footer</h2></footer>`
  ),
  'uppercase heading tags and repeated headings': page(
    `<H2 id="upper">Upper</H2><p>u</p><H3>Upper three</H3><p>u3</p>
     <h2 id="same">Same</h2><p>first</p><h2 id="same">Same</h2><p>second</p>`
  ),
  'headings with markup and characters to encode': page(
    `<h2 id="m">Café &amp; <em>naïve</em> «quotes» 100%</h2><p>x <strong>y</strong></p>
     <h2 id="emoji">📬 Mail?</h2><p>z</p>`
  ),
  'a page without a title': page(
    '<h2>A</h2><p>a</p>',
    '<meta name="description" content="d">'
  ),
  'a page without a description': page('<h2>A</h2><p>a</p>', '<title>t</title>')
};

for (const [name, html] of Object.entries(PAGES)) {
  test(`same entries as the crawler built: ${name}`, (t) => {
    const before = outcome(searchEntriesBefore, html, LOC);
    t.deepEqual(outcome(getSearchEntries, html, LOC), before);
    if (before.entries) t.true(before.entries.sections.length > 0);
  });
}

test('a section of many elements under one parent', (t) => {
  const paragraphs = [];
  for (let i = 0; i < 2000; i++) {
    if (i % 25 === 0) paragraphs.push(`<h3 id="h${i}">Heading ${i}</h3>`);
    paragraphs.push(`<p>Paragraph ${i} with <a href="/p${i}">a link</a></p>`);
  }

  const html = page(`<div>${paragraphs.join('\n')}</div>`);
  const before = searchEntriesBefore(html, LOC);
  t.is(before.sections.length, 80);
  t.deepEqual(getSearchEntries(html, LOC), before);
});

test('same entries as the crawler built on pages the site serves', async (t) => {
  await utils.setupWebServer(t);
  t.teardown(() => utils.teardownWebServer(t));

  const { web } = t.context;
  const sitemap = await web.get('/en/sitemap.xml');
  t.is(sitemap.status, 200);
  const paths = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    // (/tti shows times measured from outside, which tests do not have)
    .filter((path) => path.startsWith('/en/') && path !== '/en/tti');

  // the FAQ (the longest page) in three languages, and the first pages
  // of the sitemap
  const pages = [
    '/en/faq',
    '/de/faq',
    '/ja/faq',
    ...paths.filter((path) => path !== '/en/faq').slice(0, 40)
  ];

  let compared = 0;
  let sections = 0;
  for (const path of pages) {
    const res = await web.get(path).set({ Accept: 'text/html' });
    if (res.status !== 200) continue;
    compared++;
    const loc = `${config.urls.web}${path}`;
    const before = searchEntriesBefore(res.text, loc);
    t.deepEqual(getSearchEntries(res.text, loc), before, `${path}`);
    sections += before.sections.length;
  }

  t.true(compared >= pages.length - 5, `${compared} of ${pages.length} pages`);
  t.true(sections > 500, `${sections} sections`);
});
