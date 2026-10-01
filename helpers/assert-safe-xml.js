/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');

//
// Defense-in-depth guard against XXE / entity-expansion payloads in
// user-supplied XML (DMARC aggregate reports, CardDAV/WebDAV request
// bodies). The XML parsers in use (fast-xml-parser, xml2js/sax) do not
// resolve external entities by default, but a DTD is never legitimate in
// these inputs, so reject any markup declaration outright.
//
// This replaces per-call inline checks of the form
//   xmlString.includes('<!ENTITY') || xmlString.includes('<!DOCTYPE')
// which were CASE-SENSITIVE and therefore trivially bypassed with a
// lowercase `<!doctype`/`<!entity>` (XML markup declaration keywords are
// case-insensitive to parsers). We match any `<!` markup declaration
// (DOCTYPE, ENTITY, and the rest) case-insensitively, tolerating
// whitespace/newlines between `<!` and the keyword.
//
const REGEX_MARKUP_DECLARATION =
  /<!\s*(?:doctype|entity|element|attlist|notation)\b/i;

// Also catch a bare `<!` followed by a letter that is not a comment `<!--`
// or CDATA `<![CDATA[`, which covers obfuscation attempts and unknown
// declaration types without rejecting legitimate comments/CDATA.
const REGEX_SUSPICIOUS_BANG = /<!(?!--|\[CDATA\[)\s*[A-Za-z]/;

/**
 * Throw a 400 if the XML contains any markup (DTD) declaration.
 * @param {string|Buffer} xml - raw XML content
 * @param {string} [message] - error message for the thrown Boom.badRequest
 * @returns {string} the XML as a UTF-8 string (convenience for callers)
 */
function assertSafeXml(
  xml,
  message = 'XML entities and DOCTYPE declarations are not allowed'
) {
  const xmlString =
    typeof xml === 'string' ? xml : Buffer.from(xml).toString('utf8');

  if (!isSafeXml(xmlString)) throw Boom.badRequest(message);

  return xmlString;
}

/**
 * Non-throwing variant: returns false if the XML contains a markup
 * declaration, true otherwise. Used where the caller prefers a null/skip
 * result over an exception (e.g. DMARC report ingestion).
 * @param {string|Buffer} xml - raw XML content
 * @returns {boolean}
 */
function isSafeXml(xml) {
  const xmlString =
    typeof xml === 'string' ? xml : Buffer.from(xml).toString('utf8');

  // A DOCTYPE/ENTITY (or other DTD) declaration is never legitimate in
  // DMARC reports or CardDAV/WebDAV bodies, so reject the keywords anywhere
  // in the raw input, even inside comments or CDATA. Deciding what is "inside"
  // a comment or CDATA is exactly what attackers play with, e.g.
  //   <!-- <![CDATA[ --><!DOCTYPE x [...]><!-- ]]> -->
  // hid a DOCTYPE from the previous strip-CDATA-then-comments approach.
  if (REGEX_MARKUP_DECLARATION.test(xmlString)) return false;

  return !REGEX_SUSPICIOUS_BANG.test(stripCommentsAndCdata(xmlString));
}

/**
 * Remove comments and CDATA sections in document order (a single linear
 * pass), so a `<!--` inside CDATA or a `<![CDATA[` inside a comment is
 * treated as data, the same way an XML parser treats it.
 * An unterminated comment/CDATA is left in place so it is still scanned.
 * @param {string} str
 * @returns {string}
 */
function stripCommentsAndCdata(str) {
  let out = '';
  let i = 0;
  for (;;) {
    const start = str.indexOf('<!', i);
    if (start === -1) return out + str.slice(i);

    let close;
    if (str.startsWith('<!--', start)) close = '-->';
    else if (str.startsWith('<![CDATA[', start)) close = ']]>';

    if (!close) {
      out += str.slice(i, start + 2);
      i = start + 2;
      continue;
    }

    const end = str.indexOf(close, start + (close === '-->' ? 4 : 9));
    if (end === -1) return out + str.slice(i);
    out += str.slice(i, start);
    i = end + close.length;
  }
}

module.exports = assertSafeXml;
module.exports.assertSafeXml = assertSafeXml;
module.exports.isSafeXml = isSafeXml;
