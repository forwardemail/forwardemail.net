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

function fixTableOfContents(content, i18n, options) {
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

  const lis = ul.querySelectorAll('li');
  if (lis.length === 0) return content;

  a.setAttribute('id', 'top');
  a.setAttribute('href', '#top');

  const h2s = root.querySelectorAll('h2');

  for (const li of lis) {
    const a = li.querySelector('a');
    const { text } = a;
    // eslint-disable-next-line unicorn/prefer-dom-node-dataset
    a.setAttribute('data-dismiss', 'modal');
    a.setAttribute('class', 'list-group-item list-group-item-action');
    const href = a.getAttribute('href');
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

    li.replaceWith(a);
  }

  const str = i18n.api.t({
    phrase: 'Table of Contents',
    locale: (options && options.locale) || i18n.getLocale()
  });

  ul.rawTagName = 'div';
  ul.setAttribute('class', 'list-group');

  const ulStr = ul.toString();
  h2.remove();
  ul.remove();

  const search = i18n.api.t({
    phrase: 'Search page',
    locale: (options && options.locale) || i18n.getLocale()
  });

  return `
    <div class="fixed-bottom bg-dark border-top border-light p-2 text-center is-bot no-js">
      <ul class="list-inline mb-0">
        <li class="list-inline-item text-white">
          ${search}
        </li>
        <li class="list-inline-item"><i class="fa fa-angle-right align-middle text-white"></i></li>
        <li class="list-inline-item">
          <a data-toggle="modal-anchor" data-target="#modal-table-of-contents" class="btn btn-success">
            <i class="fa fa-search"></i> ${str}
          </a>
        </li>
      </ul>
    </div>
    <div class="modal fade" id="modal-table-of-contents" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header text-center d-block">
            <h1 class="h4 d-inline-block ml-4">${str}</h1>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div class="modal-body">${ulStr}</div>
        </div>
      </div>
    </div>
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

module.exports = {
  md(string, options) {
    if (typeof options !== 'object' || !isSANB(options.locale))
      return fixTableOfContents(markdown.render(string), i18n, options);
    return fixTableOfContents(
      i18n.api.t({
        phrase: markdown.render(string),
        locale: (options && options.locale) || i18n.getLocale()
      }),
      i18n,
      options
    );
  }
};
