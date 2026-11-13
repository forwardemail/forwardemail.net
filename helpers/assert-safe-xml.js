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
// A markup declaration is `<!` followed by anything but the start of a
// comment or of CDATA: a DOCTYPE or an ENTITY (in any case, with or without
// white space), and what is no declaration at all (`<!1`, `<!-x`, `<!<`).
// The parser of CardDAV bodies (sax, under xml2js) keeps such a thing whole
// until its ">", and upper-cases all of it again for each of its
// characters: 100 KB of it in one request held the process for 17 seconds,
// 1 MB for a quarter of an hour.
//
// It is looked for anywhere in the raw input, also inside comments, CDATA
// and attribute values. Deciding what is "inside" one of those is exactly
// what attackers play with, e.g.
//   <!-- <![CDATA[ --><!DOCTYPE x [...]><!-- ]]> -->
// hid a DOCTYPE from a strip-CDATA-then-comments approach, and
//   <a b="<!--"><!1 ...><c d="-->"/>
// hid a declaration from one that stripped comments in document order.
//
const REGEX_MARKUP_DECLARATION = /<!(?!--|\[CDATA\[)/;

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

  return !REGEX_MARKUP_DECLARATION.test(xmlString);
}

module.exports = assertSafeXml;
module.exports.assertSafeXml = assertSafeXml;
module.exports.isSafeXml = isSafeXml;
