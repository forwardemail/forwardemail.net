/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const I18N = require('@ladjs/i18n');
const isSANB = require('is-string-and-not-blank');
const manifestRev = require('manifest-rev');
const { parse } = require('node-html-parser');

const phrases = require('#config/phrases');
const i18nConfig = require('#config/i18n');
const logger = require('#helpers/logger');
const markdown = require('#helpers/markdown');
const env = require('#config/env');

const manifest = manifestRev({
  prepend: '/',
  manifest: path.join(__dirname, '..', 'build', 'sri-manifest.json')
});

const WEB_URL = env.WEB_URL.toLowerCase();
const API_URL = env.API_URL.toLowerCase();

// const cheerio = require('cheerio');
/*
function fixTableOfContents(content) {
  const $ = cheerio.load(content);
  const $h1 = $('h1').first();
  if ($h1.length === 0) return content;
  const $h2 = $h1.next('h2');
  if ($h2.length === 0) return content;
  const $a = $h1.find('a').first();
  if ($a.length === 0) return content;
  $a.attr('id', 'top');
  $a.attr('href', '#top');
  const $a2 = $h2.find('a').first();
  if ($a2.length === 0) return content;
  $a2.attr('id', 'table-of-contents');
  $a2.attr('href', '#table-of-contents');
  const $ul = $h2.next('ul');
  if ($ul.length === 0) return content;
  const $links = $ul.find('a');
  if ($links.length === 0) return content;
  const $h2s = $('h2');
  $links.each(function () {
    const $link = $(this);
    const text = $link.text();
    const href = $link.attr('href');
    const id = href.slice(1);
    $h2s.each(function () {
      const $h = $(this);
      const $anchor = $h.find('a').first();
      if ($anchor.length === 0) return;
      if ($h.text() === text) {
        $anchor.attr('href', href);
        // strip the # so id is accurate
        $anchor.attr('id', id);
      }
    });
  });

  return $.html();
}
*/

// TODO: docs: ensure all licenses updated + author updated
// TODO: docs: render the banner images

const MAX_SECTIONS = 5;

// eslint-disable-next-line complexity
function fixTableOfContents(content, options) {
  // CSP fixes
  content = content.replaceAll(
    'style="text-align:center"',
    'class="text-center"'
  );

  const root = parse(content);

  // go through all <code> blocks and remove nested <a> tags (convert them to <span>)
  for (const code of root.querySelectorAll('code')) {
    const anchor = code.querySelector('a');
    if (!anchor) continue;
    anchor.rawTagName = 'span';
    anchor.removeAttribute('href');
    content = root.toString();
  }

  // replace all <img>'s that start with "/img" with manifest rev versions
  for (const img of root.querySelectorAll('img')) {
    const src = img.getAttribute('src');
    if (src.startsWith('/img/')) {
      img.setAttribute('src', manifest(src.replace('/img/', 'img/')));
    } else if (src.startsWith('img/')) {
      img.setAttribute('src', manifest(src));
    }
  }

  //
  // go through all <a> anchor tags
  // - if the link contains `http://` then rewrite the link to `https://`
  // - if the link is to an external website, then ensure that:
  //   - target="_blank"
  //   - rel="noopener noreferrer"
  //
  for (const link of root.querySelectorAll('a')) {
    let href = link.getAttribute('href');
    if (href.startsWith('#')) continue;
    if (href.includes('http://') || href.includes('https://')) {
      href = href.replace('http://', 'https://');
      link.setAttribute('href', href);

      if (href.startsWith(WEB_URL) || href.startsWith(API_URL)) continue;

      link.setAttribute('target', '_blank');

      let rel = link.getAttribute('rel');
      if (rel) {
        rel = rel.toLowerCase().trim().split(' ');
        if (!rel.includes('noopener')) rel.push('noopener');
        if (!rel.includes('noreferrer')) rel.push('noreferrer');
      } else {
        rel = ['noopener', 'noreferrer'];
      }

      link.setAttribute('rel', rel.join(' '));
    }
  }

  const h1 = root.querySelector('h1');
  if (!h1) return content;

  const a = h1.querySelector('a');
  if (!a) return content;

  const h2 = root.querySelector('h2');
  if (!h2) return content;

  const a2 = h2.querySelector('a');
  if (!a2) return content;

  const ul = root.querySelector('ul');
  if (!ul) return content;

  const lis = ul.querySelectorAll('li');
  // const sections = ul.querySelectorAll(':scope > li');

  if (lis.length === 0) return content;

  a.setAttribute('id', 'top');
  a.setAttribute('href', '#top');

  // remove first <h1> if on docs page
  if (options.isDocs) h1.remove();

  // center first <p> if on docs page and had no previous element
  if (options.isDocs) {
    const p = root.querySelector('p');
    if (p) {
      const img = p.querySelector('img');
      if (img) p.setAttribute('class', 'text-center');
    }
  }

  //
  // sidebar (desktop/tablet)
  // h2
  //    h3
  //    h3
  //    h3
  //
  //
  let sidebar;
  if (options.hasSidebar) {
    const navPillsContainer = parse(
      '<div class="nav nav-pills flex-column p-1"></div>'
    );

    for (const h2 of root.querySelectorAll('h2')) {
      const a = h2.querySelector('a');
      if (!a) continue;
      if (
        h2.getAttribute('id') === 'table-of-contents' ||
        a.getAttribute('href') === '#table-of-contents'
      ) {
        continue;
      }

      // eslint-disable-next-line unicorn/prefer-dom-node-append
      navPillsContainer.appendChild(
        // <a href="${a.getAttribute('href')}" class="nav-link compact">${
        parse(`
        <a href="${a.getAttribute(
          'href'
        )}" class="nav-link lead compact font-weight-bold">${h2.text}</a>
      `)
      );
      const navPillsHTML = [];
      let node = h2;
      while (
        node.nextElementSibling &&
        node.nextElementSibling.rawTagName !== 'h2'
      ) {
        if (node.rawTagName === 'h3') {
          const a = node.querySelector('a');
          if (!a) continue;
          navPillsHTML.push(
            `<a class="nav-link compact sub" href="${a.getAttribute('href')}">${
              node.text
            }</a>`
          );
        }

        node = node.nextElementSibling;
      }

      if (navPillsHTML.length > 0) {
        // eslint-disable-next-line unicorn/prefer-dom-node-append
        navPillsContainer.appendChild(
          parse(`
          <div class="nav nav-pills flex-column ml-1">
            ${navPillsHTML.join('\n')}
          </div>
        `)
        );
      }
    }

    sidebar = parse(`
      <nav id="sidebar-scrollspy" class="sidebar-nav rounded-lg">
        <div class="sidebar-header p-2 border-bottom">
          <strong>${i18n.api.t({
            phrase: 'Table of Contents',
            locale: (options && options.locale) || i18n.config.defaultLocale
          })}</strong>
        </div>
        ${navPillsContainer.toString()}
      </nav>
    `);
  }

  //
  // NOTE: we need to keep this because `mandarin` does not normalize in the
  //       same way that #helpers/markdown normalizes with github-like headings
  //       (and this also gives us the opportunity to fix the aria-hidden issue below)
  //       <https://github.com/Flet/markdown-it-github-headings/issues/20>
  //       (e.g. /en/faq does not look the same when rendered as /de/faq)
  //
  for (const header of root.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    const anchor = header.querySelector('a');
    if (!anchor) continue;

    let id = header.getAttribute('id');

    if (!id && anchor.getAttribute('href'))
      id = anchor.getAttribute('href').slice(1);

    if (!id) continue;

    const lastChildRawText = header.lastChild.rawText;

    if (
      options.isDocs &&
      (lastChildRawText === 'License' ||
        lastChildRawText === 'Contributors' ||
        lastChildRawText === 'Credits' ||
        id === 'license' ||
        id === 'contributors' ||
        id === 'credits')
    ) {
      header.nextElementSibling.remove();
      header.remove();
      continue;
    }

    anchor.setAttribute('role', 'button');
    anchor.setAttribute('class', 'anchor');
    anchor.setAttribute(
      'aria-label',
      i18n.api.t({
        phrase: 'Go to top',
        locale: (options && options.locale) || i18n.config.defaultLocale
      })
    );

    if (
      (options.hasSidebar || lis.length > MAX_SECTIONS) &&
      header.rawTagName === 'h2'
    ) {
      // eslint-disable-next-line unicorn/prefer-dom-node-dataset
      anchor.setAttribute('data-toggle', 'collapse');
      anchor.setAttribute('role', 'button');
      anchor.setAttribute('aria-label', header.text);
      anchor.setAttribute('aria-expanded', 'false');
      anchor.setAttribute('aria-controls', `collapse-${id}`);
      // eslint-disable-next-line unicorn/prefer-dom-node-dataset
      anchor.setAttribute('data-target', `#collapse-${id}`);
    }

    anchor.removeAttribute('aria-hidden');
    anchor.set_content(
      '<svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>'
    );

    //
    // if this header was an <h2> then we can assume it to be table of contents
    // and for each next sibling element, up until the next <h2> we push it to an array
    // of nodes, and then we replace all these nodes with one combined node wrapped in a div
    // (similar to this example: <https://stackoverflow.com/a/7968463>)
    //
    if (
      !options.hasSidebar &&
      !options.isDocs &&
      lis.length > MAX_SECTIONS &&
      header.rawTagName === 'h2' &&
      (!header.nextElementSibling ||
        (header.nextElementSibling && header.nextElementSibling !== ul)) &&
      id !== 'table-of-contents'
    ) {
      //
      // get the child node of the header that is a text node (nodeType === 3)
      // and then replace it with an anchor tag wrapped and custom styled
      // a.btn.btn-link.btn-block.text-left.text-themed.font-weight-bold.p-0
      //

      // replace the text node
      const lastChildRawText = header.lastChild.rawText;

      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      header.removeChild(header.lastChild);

      // add a question mark as well as collapse styling
      // eslint-disable-next-line unicorn/prefer-dom-node-append
      header.appendChild(
        parse(
          `<a class="dropdown-toggle text-wrap btn btn-link btn-block text-left text-themed font-weight-bold p-0" href="#${id}" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapse-${id}" data-target="#collapse-${id}">${lastChildRawText}</a>`
          // `<a class="dropdown-toggle text-wrap btn btn-link btn-block text-left text-themed font-weight-bold p-0" href="#${id}" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapse-${id}" data-target="#collapse-${id}">${lastChildRawText}${
          //   options.hasSidebar && !lastChildRawText.endsWith('?') ? '?' : ''
          // }</a>`
        )
      );

      let node = header;
      let html = '';
      const nodes = [];
      while (
        node.nextElementSibling &&
        node.nextElementSibling.rawTagName !== 'h2'
      ) {
        node = node.nextElementSibling;

        const parsedNode = parse(node);

        //
        // iterate over the node's children h3, h4, h5, h6
        // and if they are linked then rewrite them with svg appropriately
        //
        for (const header of parsedNode.querySelectorAll('h3,h4,h5,h6')) {
          // this is the same code as above
          const anchor = header.querySelector('a');

          if (!anchor) continue;
          const id = header.getAttribute('id');

          if (!id) continue;
          anchor.setAttribute('role', 'button');
          anchor.setAttribute('aria-label', header.text);
          anchor.setAttribute('class', 'anchor');
          anchor.removeAttribute('aria-hidden');
          anchor.set_content(
            '<svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>'
          );
        }

        html += parsedNode.toString();
        nodes.push(node);
      }

      //
      // get outer HTML of all these nodes joined together
      // and then remove all of the nodes
      // and then after the current <h2> we need to append it wrapped
      //
      for (const node of nodes) {
        node.remove();
      }

      header.replaceWith(
        header.toString() +
          `<div class="collapse" id="collapse-${id}">${html}</div>`
      );
    }
  }

  const h2s = root.querySelectorAll('h2');

  // if last h2 is empty then remove it (e.g. <hr /> from README's)
  if (
    h2s.length > 0 &&
    h2s[h2s.length - 1] &&
    h2s[h2s.length - 1].childNodes.length === 0
  )
    h2s[h2s.length - 1].remove();

  // table of contents footer (mainly for mobile)
  for (const li of lis) {
    const a = li.querySelector('a');
    if (!a) continue;
    const { text } = a;
    const href = a.getAttribute('href');
    const id = href.slice(1);

    if (
      options.isDocs &&
      (id === 'license' || id === 'contributors' || id === 'credits')
    ) {
      li.remove();
      continue;
    }

    // eslint-disable-next-line unicorn/prefer-dom-node-dataset
    a.setAttribute('data-dismiss', 'modal');
    a.setAttribute('aria-controls', `collapse-${id}`);
    // eslint-disable-next-line unicorn/prefer-dom-node-dataset
    a.setAttribute('data-target', `#collapse-${id}`);
    // eslint-disable-next-line unicorn/prefer-dom-node-dataset
    a.setAttribute('data-toggle', 'collapse');
    a.setAttribute('class', 'list-group-item list-group-item-action');
    // add a question mark
    // a.firstChild._rawText = `${a.firstChild._rawText}${
    //   options.hasSidebar && !a.firstChild._rawText.endsWith('?') ? '?' : ''
    // }`;
    for (const h of h2s) {
      const anchor = h.querySelector('a');
      if (!anchor) continue;
      if (h.text === text) {
        anchor.setAttribute('href', href);
        // strip the # so id is accurate
        anchor.setAttribute('id', id);
      }
    }

    li.replaceWith(a);
  }

  const str = i18n.api.t({
    phrase: phrases.TABLE_OF_CONTENTS,
    locale: (options && options.locale) || i18n.config.defaultLocale
  });

  ul.rawTagName = 'div';
  ul.setAttribute('class', 'list-group');

  const ulStr = ul.toString();
  h2.remove();
  ul.remove();

  if (!options.isDocs && !options.hasSidebar && lis.length <= MAX_SECTIONS)
    return `<div class="markdown-body">${root.toString()}</div>`;

  const topPart = `<div class="fixed-bottom bg-dark border-top border-themed p-2 text-center is-bot no-js d-print-none">
      <ul class="list-inline mb-0">
        <li class="list-inline-item">
          <a data-toggle="modal-anchor" role="button" data-target="#modal-table-of-contents" class="btn btn-success">
            <i class="fa fa-search"></i> ${str}
          </a>
        </li>
      </ul>
    </div>
    <div class="modal fade" id="modal-table-of-contents" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header text-center d-block">
            <div class="h4 d-inline-block ml-4">${str}</div>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div class="modal-body">${ulStr}</div>
        </div>
      </div>
    </div>`;

  if (options.hasSidebar) {
    // <div class="col-md-8 col-lg-10 px-md-4">
    return `
      ${topPart.replace('fixed-bottom', 'fixed-bottom d-block d-md-none')}
      <div class="col-md-3 sidebar-wrapper">
        ${sidebar.toString()}
      </div>
      <div class="col-md-9 flex-grow-1">
        <div class="markdown-body">${root.toString()}</div>
      </div>
    `;
  }

  return `
    ${topPart}
    <div class="markdown-body">${root.toString()}</div>
  `;
}

//
// NOTE: we want our own instance of i18n that does not auto reload files
//
const i18n = new I18N({
  ...i18nConfig,
  autoReload: false,
  updateFiles: false,
  syncFiles: false,
  logger
});

delete i18n.config.phrases;
if (!global.phrases) global.phrases = i18nConfig.phrases;
i18n.config.phrases = global.phrases;

//
// delete unused methods since it pollutes memory
//
// NOTE: if you change this, also change it elsewhere `rg "new I18N"`
//
for (const fn of [
  'addLocale',
  'removeLocale',
  'configure',
  'getCatalog',
  'getLocale',
  'getLocales'
]) {
  delete i18n[fn];
}

//
// TODO: create an in-memory hash map with rev-hash to render quick in production
//

const escapedFootnotePattern = /\\(\[(\^[^\]]+)])/g;
function fixFootnoteReferences(markdownText) {
  return markdownText.replace(escapedFootnotePattern, '$1');
}

module.exports = {
  md(string, options) {
    try {
      //
      // NOTE: this is not needed as v0.3.2 patched the issue
      // <https://github.com/antfu/markdown-it-github-alerts/issues/8>
      // `> \[!` -> `> [!`
      // string = string.replaceAll('> \\[!', '> [!');
      //

      // replace footnote escaped chars
      string = fixFootnoteReferences(string);

      if (typeof options !== 'object' || !isSANB(options.locale))
        return fixTableOfContents(markdown.render(string), options);
      return fixTableOfContents(
        i18n.api.t({
          phrase: markdown.render(string),
          locale: (options && options.locale) || i18n.config.defaultLocale
        }),
        options
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};
