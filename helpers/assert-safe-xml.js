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
  // Strip comments and CDATA sections first so legitimate content that
  // merely mentions "<!DOCTYPE"/"<!ENTITY" as data (inside <![CDATA[ ]]> or
  // <!-- -->) is not misflagged. Anything left is real markup.
  const scannable = xmlString
    .replace(/<!\[CDATA\[[\s\S]*?]]>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  return (
    !REGEX_MARKUP_DECLARATION.test(scannable) &&
    !REGEX_SUSPICIOUS_BANG.test(scannable)
  );
}

module.exports = assertSafeXml;
module.exports.assertSafeXml = assertSafeXml;
module.exports.isSafeXml = isSafeXml;
