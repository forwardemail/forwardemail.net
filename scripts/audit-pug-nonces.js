#!/usr/bin/env node

/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Audit all .pug templates for inline <script> and <style> blocks
 * that are missing a `nonce` attribute.  Exits non-zero when violations
 * are found so it can gate CI.
 *
 * Usage:  node scripts/audit-pug-nonces.js [dir]
 *         (defaults to app/views)
 */

const process = require('node:process');
const fs = require('node:fs');
const path = require('node:path');

const viewsDir = process.argv[2] || path.join(__dirname, '..', 'app', 'views');

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.name.endsWith('.pug')) results.push(full);
  }

  return results;
}

/**
 * Determine if a line at `lineIdx` is inside a pug comment block (//- ...)
 * by walking backwards to find the nearest ancestor with less indentation
 * that starts with `//-`.
 */
function isInsideComment(lines, lineIdx) {
  const line = lines[lineIdx];
  const indent = line.search(/\S/);
  if (indent < 0) return false;

  for (let i = lineIdx - 1; i >= 0; i--) {
    const prev = lines[i];
    const prevIndent = prev.search(/\S/);
    if (prevIndent < 0) continue; // skip blank lines
    if (prevIndent < indent) {
      // This is a potential parent
      if (prev.trimStart().startsWith('//-')) return true;
      // If it's not a comment, check further up (it might be nested)
      if (prevIndent === 0) return false;
    }
  }

  return false;
}

/**
 * Collect the full multi-line pug tag starting at lineIdx.
 * Pug allows attributes to span multiple lines when using parentheses.
 */
function getFullTag(lines, lineIdx) {
  let tag = lines[lineIdx];
  // If the line has an opening paren but no closing paren, collect continuation
  if (tag.includes('(') && !tag.includes(')')) {
    for (let i = lineIdx + 1; i < lines.length; i++) {
      tag += ' ' + lines[i].trim();
      if (lines[i].includes(')')) break;
    }
  }

  return tag;
}

const violations = [];
const files = walk(viewsDir);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trimStart();

    // Match inline script or style tags (not script(src=...) external refs)
    const isScript = /^script[\s.(]/.test(trimmed) && !trimmed.includes('src=');
    const isStyle = /^style[\s.(]/.test(trimmed);

    if (!isScript && !isStyle) continue;
    if (isInsideComment(lines, i)) continue;

    const fullTag = getFullTag(lines, i);
    if (!fullTag.includes('nonce')) {
      const rel = path.relative(process.cwd(), file);
      violations.push(`${rel}:${i + 1}: ${trimmed.slice(0, 80)}`);
    }
  }
}

if (violations.length > 0) {
  console.error(
    `\n\u274C  Found ${violations.length} inline script/style tag(s) missing nonce:\n`
  );
  for (const v of violations) console.error(`   ${v}`);
  console.error(
    '\n   Every inline <script> and <style> MUST have nonce=nonce for CSP.\n'
  );
  process.exit(1);
} else {
  console.log(
    `\u2714  All ${files.length} pug files pass CSP nonce audit (no violations).`
  );
}
