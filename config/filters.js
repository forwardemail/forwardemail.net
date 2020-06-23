// const { parse } = require('node-html-parser');
const I18N = require('@ladjs/i18n');
const cheerio = require('cheerio');
const isSANB = require('is-string-and-not-blank');

const i18nConfig = require('../config/i18n');
const logger = require('../helpers/logger');
const markdown = require('../helpers/markdown');

//
// this approach uses `node-html-parser` which would have been nice
// but it's not easy to use without <https://github.com/taoqf/node-html-parser/issues/41>
//
/*
function fixTableOfContents(content) {
  const root = parse(content);
  const $toc = root.querySelector('#table-of-contents');
  if (!$toc) return content;
  const $h2 = $toc.parentNode;
  if (!$h2 || $h2.tagName !== 'h2') return content;
  const $ul = $h2.nextElementSibling;
  if (!$ul || $ul.tagName !== 'ul') return content;
  const $links = $ul.querySelectorAll('a');
  if ($links.length === 0) return content;
  const $h2s = root.querySelectorAll('h2');
  for (const $link of $links) {
    const text = $link.textContent;
    const href = $link.getAttribute('href');
    for (const $h of $h2s) {
      const $anchor = $h.firstChild;
      if (!$anchor || $anchor.tagName !== 'a') continue;
      if ($anchor.textContent === text) {
        $anchor.setAttribute('href', href);
        // strip the # so id is accurate
        $anchor.setAttribute('id', href.slice(1));
      }
    }
  }

  return root.outerHTML;
}
*/

//
// NOTE: cheerio is known to have memory leaks (see GitHub issues)
//
function fixTableOfContents(content) {
  const $ = cheerio.load(content);
  const $h1 = $('h1').first();
  if ($h1.length === 0) return content;
  const $h2 = $h1.next('h2');
  if ($h2.length === 0) return content;
  const $ul = $h2.next('ul');
  if ($ul.length === 0) return content;
  const $links = $ul.find('a');
  if ($links.length === 0) return content;
  const $h2s = $('h2');
  $links.each(function() {
    const $link = $(this);
    const text = $link.text();
    const href = $link.attr('href');
    const id = href.slice(1);
    $h2s.each(function() {
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

module.exports = {
  md: (string, options) => {
    if (!isSANB(options.locale))
      return `<div class="markdown-body">${fixTableOfContents(
        markdown.render(string)
      )}</div>`;
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
    return `<div class="markdown-body">${fixTableOfContents(
      i18n.api.t({
        phrase: markdown.render(string),
        locale: options.locale
      })
    )}</div>`;
  }
};
