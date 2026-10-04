/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('#helpers/lodash');

// a domain in the examples (and its subdomains), not part of a longer name
// (e.g. not "myexample.com" or "example.community")
const EXAMPLE_DOMAIN = /(?<![\w-])example\.com(?![\w-])/g;

// the example forwarding address, with an optional "+" tag (e.g.
// "user@gmail.com", "user+support@gmail.com" or "user+$1@gmail.com"), and
// not part of another address (e.g. not "first@gmail.com")
const EXAMPLE_ADDRESS =
  /(?<![\w.+-])user(\+[^\s@<>"'`,;:]+)?@gmail\.com(?![\w-])/g;

// text in these is never shown as page content
const SKIPPED_TAGS = new Set(['script', 'style', 'template']);

//
// Show the examples on a page (e.g. the FAQ) with the visitor's own domain
// and address: "example.com" becomes their domain, and "user@gmail.com"
// their address (with any "+" tag kept).
//
// Only text shown on the page is changed (and the `mailto:` links of the
// example address), never other attributes, scripts or structured data (e.g.
// the canonical link or the FAQ schema), and the values are HTML-escaped.
// Other words and addresses are left as they are (e.g. "admin",
// "admin.google.com", "first@gmail.com").
//
function personalizeExamples(root, { domainName, email } = {}) {
  let local;
  let domain;
  if (typeof email === 'string') {
    const index = email.lastIndexOf('@');
    if (index > 0 && index < email.length - 1) {
      local = email.slice(0, index);
      domain = email.slice(index + 1);
    }
  }

  if (!domainName && !local) return root;

  const replace = (text) => {
    let value = text;
    if (domainName)
      value = value.replace(EXAMPLE_DOMAIN, () => _.escape(domainName));
    if (local)
      value = value.replace(EXAMPLE_ADDRESS, (match, tag) =>
        _.escape(`${local}${tag || ''}@${domain}`)
      );
    return value;
  };

  // (the content of some elements, e.g. `pre`, is kept as raw HTML, so only
  // the text between its tags is changed)
  const replaceText = (raw) =>
    raw
      .split(/(<[^>]*>)/)
      .map((part) => (part.startsWith('<') ? part : replace(part)))
      .join('');

  const walk = (node) => {
    for (const child of node.childNodes || []) {
      if (child.nodeType === 3) {
        const raw = child.rawText;
        const value = replaceText(raw);
        if (value !== raw) child.rawText = value;
        continue;
      }

      if (child.nodeType !== 1) continue;
      const tag = (child.rawTagName || '').toLowerCase();
      if (SKIPPED_TAGS.has(tag) || tag === 'head') continue;

      if (tag === 'a') {
        const href = child.getAttribute('href');
        if (typeof href === 'string' && href.startsWith('mailto:')) {
          // (`getAttribute` decodes the value, and `setAttribute` writes it
          // as it is given, so it is escaped as a whole)
          const value = `mailto:${replace(href.slice(7))}`;
          if (value !== href)
            child.setAttribute('href', _.escape(_.unescape(value)));
        }
      }

      walk(child);
    }
  };

  walk(root);
  return root;
}

module.exports = personalizeExamples;
