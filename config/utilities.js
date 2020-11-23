const _ = require('lodash');
const ajc = require('array-join-conjunction');
const capitalize = require('capitalize');
const dashify = require('dashify');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isBot = require('isbot');
const isSANB = require('is-string-and-not-blank');
const numeral = require('numeral');
const pluralize = require('pluralize');
const striptags = require('striptags');
const titleize = require('titleize');
const toEmoji = require('gemoji/name-to-emoji');
const validator = require('validator');
const { boolean } = require('boolean');

const json = (string, replacer = null, space = 2) =>
  JSON.stringify(string, replacer, space);

const emoji = (string) => (toEmoji[string] ? toEmoji[string] : '');

module.exports = {
  _,
  ajc,
  boolean,
  capitalize,
  dashify,
  emoji,
  humanize,
  isBot,
  isSANB,
  json,
  dayjs,
  numeral,
  pluralize,
  striptags,
  titleize,
  validator
};
