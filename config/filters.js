const I18N = require('@ladjs/i18n');
const isSANB = require('is-string-and-not-blank');
const { parse } = require('node-html-parser');

const i18nConfig = require('#config/i18n');
const logger = require('#helpers/logger');
const markdown = require('#helpers/markdown');

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

function fixTableOfContents(content) {
  const root = parse(content);

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

  const links = ul.querySelectorAll('a');
  if (links.length === 0) return content;

  a.setAttribute('id', 'top');
  a.setAttribute('href', '#top');
  a2.setAttribute('id', 'table-of-contents');
  a2.setAttribute('href', '#table-of-contents');

  const h2s = root.querySelectorAll('h2');

  for (const link of links) {
    const { text } = link;
    const href = link.getAttribute('href');
    const id = href.slice(1);
    for (const h of h2s) {
      const anchor = h.querySelector('a');
      if (!anchor) continue;
      if (h.text === text) {
        anchor.setAttribute('href', href);
        // strip the # so id is accurate
        anchor.setAttribute('id', id);
      }
    }
  }

  return root.toString();
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
