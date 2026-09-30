/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const postcss = require('postcss');

//
// Font Awesome sets the icon font with `.fa`, `.fas`, `.far` and `.fab`, a
// single class. A rule that sets `font` or `font-family` on <i>, <span> or
// every element (`*`) below some class, such as a reset's
// `.scalar-app-reset i { font: inherit }`, outranks that on an icon inside
// it, which then draws in the text font as a missing-glyph box.
//
// Returns the selectors of such rules in a stylesheet, so the build can
// refuse them. A selector that leaves icons out (`i:not(.fa)`), Font
// Awesome's own rules, and selectors with nothing above a type selector
// (`i`, `:where(.x) *`, which `.fa` outranks) are not reported.
//

// the element an icon can be: <i>, <span> or any element
const REGEX_ICON_ELEMENT = /^(?:i|span|\*)(?![\w-])/;

// Font Awesome's own selectors
const REGEX_FONT_AWESOME = /\.fa[srb]?(?![\w-])|\.fa-/;

// what gives a selector class-level weight: a class, an id, an attribute or
// a pseudo-class (not a pseudo-element)
const REGEX_CLASS_WEIGHT = /[.#[]|(?<!:):(?!:)/;

function findIconFontOverrides(css) {
  const found = new Set();

  postcss.parse(css).walkRules((rule) => {
    const setsFont = rule.nodes.some(
      (node) =>
        node.type === 'decl' &&
        (node.prop === 'font' || node.prop === 'font-family')
    );
    if (!setsFont) return;

    for (const selector of rule.selectors) {
      const trimmed = selector.trim();
      if (REGEX_FONT_AWESOME.test(trimmed)) continue;
      const rightmost = trimmed.split(/\s*[\s>+~]\s*/).pop();
      if (!REGEX_ICON_ELEMENT.test(rightmost)) continue;
      // leaves icons out, e.g. `i:not(.fa):not(.fas)`
      if (/:not\(\.fa/.test(rightmost)) continue;
      // :where() adds no weight
      if (!REGEX_CLASS_WEIGHT.test(trimmed.replace(/:where\([^)]*\)/g, '')))
        continue;
      found.add(trimmed);
    }
  });

  return [...found];
}

module.exports = findIconFontOverrides;
