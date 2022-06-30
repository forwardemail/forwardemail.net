const _ = require('lodash');
const ajc = require('array-join-conjunction');
const capitalize = require('capitalize');
const dashify = require('dashify');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isBot = require('isbot');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const numeral = require('numeral');
const pluralize = require('pluralize');
const striptags = require('striptags');
const titleize = require('titleize');
const toEmoji = require('gemoji/name-to-emoji');
const validator = require('validator');
const { boolean } = require('boolean');
const { parse } = require('node-html-parser');

const json = (string, replacer = null, space = 2) =>
  JSON.stringify(string, replacer, space);

const emoji = (string) => (toEmoji[string] ? toEmoji[string] : '');

//
// this is useful for emails when we're rendering HTML
// with links from error messages in our application
// (in order to prepend them with our website URL)
//
function prefixHTMLPathBasedAnchors(html, baseURI) {
  const root = parse(html);
  const links = root.querySelectorAll('a');
  for (const link of links) {
    const href = link.getAttribute('href');
    if (href.indexOf('/') === 0) {
      link.setAttribute('href', baseURI + href);
    }
  }

  return root.toString();
}

module.exports = {
  _,
  ajc,
  boolean,
  capitalize,
  dashify,
  dayjs,
  emoji,
  humanize,
  isBot,
  isFQDN,
  isSANB,
  json,
  numeral,
  pluralize,
  striptags,
  titleize,
  validator,
  prefixHTMLPathBasedAnchors
};
