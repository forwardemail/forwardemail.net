/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Compare two compiled CSS bundles as multisets of rules.
//
// Each bundle is parsed into brace-balanced blocks. A block is the full
// selector (with its enclosing at-rule prelude prepended, so a rule inside a
// media query is distinct from the same rule outside it) plus its declaration
// text. The two multisets are then compared, and the removed and added blocks
// are reported grouped by which part of the system owns them, so a change
// that was meant to touch only the fe layer can be proven to have touched
// only the fe layer.
//
//   node scripts/css-diff.js <before.css> <after.css> [--strict] [--show]
//
//   --strict  exit 1 if any block outside the fe/nav/footer groups changed
//   --show    print every changed block, not just the counts per group
//

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const GROUPS = [
  ['fe', (s) => /(^|[\s>+~,(])\.fe-|\.fe-page\b|\.fe-landing\b/.test(s)],
  ['nav', (s) => /\bnav\.fe-nav\b|\.navbar\b/.test(s)],
  ['footer', (s) => /\bfooter\b/.test(s)],
  ['tokens', (s) => /^:root$|--app-/.test(s)],
  ['dark', (s) => /prefers-color-scheme:\s*dark/.test(s)],
  ['other', () => true]
];

/**
 * Parse CSS text into blocks. At-rule preludes are carried down onto the
 * rules they contain; at-rules with no nested rules (font-face, keyframes
 * frames) are emitted as blocks themselves.
 *
 * @param {string} css
 * @returns {string[]} one string per block, `<prelude> <selector>{<decls>}`
 */
function parse(css) {
  const blocks = [];
  const stack = [];
  let i = 0;
  let start = 0;

  while (i < css.length) {
    const ch = css[i];

    if (ch === '"' || ch === "'") {
      const q = ch;
      i++;
      while (i < css.length && css[i] !== q) {
        if (css[i] === '\\') i++;
        i++;
      }

      i++;
      continue;
    }

    if (ch === '{') {
      const prelude = css.slice(start, i).trim();
      stack.push({ prelude, contentStart: i + 1, hasChildren: false });
      start = i + 1;
      i++;
      continue;
    }

    if (ch === '}') {
      const frame = stack.pop();
      const parents = stack.map((f) => f.prelude);
      if (!frame.hasChildren) {
        const decls = css.slice(frame.contentStart, i).trim();
        blocks.push(`${[...parents, frame.prelude].join(' ')}{${decls}}`);
      }

      for (const f of stack) f.hasChildren = true;
      start = i + 1;
      i++;
      continue;
    }

    i++;
  }

  return blocks;
}

function multiset(blocks) {
  const m = new Map();
  for (const b of blocks) m.set(b, (m.get(b) || 0) + 1);
  return m;
}

function subtract(a, b) {
  const out = [];
  for (const [k, n] of a) {
    const d = n - (b.get(k) || 0);
    for (let i = 0; i < d; i++) out.push(k);
  }

  return out;
}

function group(block) {
  const selector = block.slice(0, block.indexOf('{'));
  for (const [name, test] of GROUPS) if (test(selector)) return name;
  return 'other';
}

function bytes(blocks) {
  return blocks.reduce((n, b) => n + b.length, 0);
}

function main() {
  const args = process.argv.slice(2);
  const files = args.filter((a) => !a.startsWith('--'));
  const strict = args.includes('--strict');
  const show = args.includes('--show');

  if (files.length !== 2) {
    console.error(
      'usage: node scripts/css-diff.js <before.css> <after.css> [--strict] [--show]'
    );
    process.exit(2);
  }

  const [beforePath, afterPath] = files.map((f) => path.resolve(f));
  const before = fs.readFileSync(beforePath, 'utf8');
  const after = fs.readFileSync(afterPath, 'utf8');
  const beforeBlocks = parse(before);
  const afterBlocks = parse(after);
  const removed = subtract(multiset(beforeBlocks), multiset(afterBlocks));
  const added = subtract(multiset(afterBlocks), multiset(beforeBlocks));

  console.log(
    `before ${path.basename(beforePath)}: ${beforeBlocks.length} blocks, ${
      before.length
    } bytes`
  );
  console.log(
    `after  ${path.basename(afterPath)}: ${afterBlocks.length} blocks, ${
      after.length
    } bytes (${after.length - before.length >= 0 ? '+' : ''}${
      after.length - before.length
    })`
  );
  console.log('');

  const summary = {};
  for (const b of removed) {
    const g = group(b);
    summary[g] = summary[g] || { removed: [], added: [] };
    summary[g].removed.push(b);
  }

  for (const b of added) {
    const g = group(b);
    summary[g] = summary[g] || { removed: [], added: [] };
    summary[g].added.push(b);
  }

  const order = GROUPS.map(([name]) => name);
  for (const g of order) {
    if (!summary[g]) continue;
    const { removed: r, added: a } = summary[g];
    console.log(
      `${g.padEnd(11)} -${String(r.length).padStart(4)} blocks (${bytes(
        r
      )} B)   +${String(a.length).padStart(4)} blocks (${bytes(a)} B)`
    );
    if (show) {
      for (const b of r) console.log(`  - ${b}`);
      for (const b of a) console.log(`  + ${b}`);
    }
  }

  if (removed.length === 0 && added.length === 0) console.log('identical');

  if (strict) {
    const leaked = order
      .filter((g) => !['fe', 'nav', 'footer'].includes(g))
      .filter((g) => summary[g]);
    if (leaked.length > 0) {
      console.error(
        `\nstrict: changes outside fe/nav/footer in ${leaked.join(', ')}`
      );
      process.exit(1);
    }
  }
}

main();
