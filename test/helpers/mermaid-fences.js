/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { execFileSync } = require('node:child_process');
const { readFile } = require('node:fs/promises');
const path = require('node:path');

const { JSDOM } = require('jsdom');
const test = require('ava');

const ROOT = path.join(__dirname, '..', '..');
const MARKDOWN_EXTENSIONS = new Set(['md', 'markdown', 'mdx']);

function getMarkdownFiles() {
  return execFileSync('git', ['ls-files', '-z'], {
    cwd: ROOT,
    encoding: 'buffer'
  })
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .filter((file) =>
      MARKDOWN_EXTENSIONS.has(path.extname(file).slice(1).toLowerCase())
    );
}

function getMermaidFences(file, source) {
  const lines = source.split(/\r?\n/);
  const fences = [];
  let startLine;
  let code = [];

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1;
    if (startLine === undefined) {
      if (/^\s*```mermaid\s*$/.test(line)) {
        startLine = lineNumber;
        code = [];
      }

      continue;
    }

    if (/^\s*```\s*$/.test(line)) {
      const content = code.join('\n').trim();
      if (!content)
        throw new Error(`${file}:${startLine} contains an empty Mermaid fence`);
      fences.push({ file, startLine, content });
      startLine = undefined;
      code = [];
      continue;
    }

    code.push(line);
  }

  if (startLine !== undefined)
    throw new Error(`${file}:${startLine} has an unclosed Mermaid fence`);

  return fences;
}

test('all tracked Mermaid fences parse', async (t) => {
  t.timeout(120000);
  const { window } = new JSDOM('');
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;

  const module = await import('mermaid');
  const mermaid = module.default;
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });

  const fences = [];
  for (const file of getMarkdownFiles()) {
    const source = await readFile(path.join(ROOT, file), 'utf8');
    fences.push(...getMermaidFences(file, source));
  }

  const failures = [];
  for (const fence of fences) {
    try {
      await mermaid.parse(fence.content);
    } catch (err) {
      failures.push(`${fence.file}:${fence.startLine}: ${err.message}`);
    }
  }

  if (failures.length > 0) t.fail(`${failures.join('\n')}`);
  t.true(fences.length > 0);
});
