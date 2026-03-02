/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * Build script for creating Single Executable Application (SEA) binaries.
 *
 * Usage:
 *   node build.mjs           # Build for current platform
 *
 * This script:
 * 1. Bundles the CLI tool with esbuild (excluding native modules)
 * 2. Creates a Node.js SEA blob
 * 3. Injects the blob into a copy of the Node.js binary
 *
 * Note: better-sqlite3-multiple-ciphers is a native module and cannot be
 * bundled into the SEA binary. It must be distributed alongside the binary
 * or users must have it installed. For the GitHub release workflow, we use
 * esbuild to bundle everything except native modules, then package the
 * native .node files alongside the binary.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distributionDirectory = path.join(__dirname, 'dist');

// Clean and create dist directory
if (fs.existsSync(distributionDirectory)) {
  fs.rmSync(distributionDirectory, { recursive: true });
}

fs.mkdirSync(distributionDirectory, { recursive: true });

console.log('Building convert-sqlite-to-eml...');

// Step 1: Bundle with esbuild (exclude native modules)
console.log('Step 1: Bundling with esbuild...');
const { build } = await import('esbuild');
// Banner that patches require() in SEA context to use createRequire
// so native modules can be loaded from the binary's directory
const seaBanner = [
  '(function() {',
  '  if (typeof require !== "undefined") {',
  '    var origRequire = require;',
  '    var Module = origRequire("module");',
  '    if (typeof Module.createRequire === "function") {',
  '      var path = origRequire("path");',
  '      var realRequire = Module.createRequire(path.join(process.execPath, "..", "package.json"));',
  '      var origResolve = require.resolve;',
  '      require = function(id) {',
  '        try { return origRequire(id); } catch(e) { return realRequire(id); }',
  '      };',
  '      require.resolve = origResolve;',
  '    }',
  '  }',
  '})();'
].join('\n');

await build({
  entryPoints: [path.join(__dirname, 'index.js')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: path.join(distributionDirectory, 'bundle.cjs'),
  format: 'cjs',
  banner: { js: seaBanner },
  // Native modules cannot be bundled - mark as external
  external: [
    'better-sqlite3-multiple-ciphers',
    'better_sqlite3_multiple_ciphers'
  ],
  // Minify for smaller binary
  minify: true,
  // Keep function names for better error messages
  keepNames: true
});

console.log('Bundle created: dist/bundle.cjs');

// Step 2: Create SEA config
console.log('Step 2: Creating SEA configuration...');
const seaConfig = {
  main: path.join(distributionDirectory, 'bundle.cjs'),
  output: path.join(distributionDirectory, 'sea-prep.blob'),
  disableExperimentalSEAWarning: true,
  useSnapshot: false,
  useCodeCache: true
};

const seaConfigPath = path.join(distributionDirectory, 'sea-config.json');
fs.writeFileSync(seaConfigPath, JSON.stringify(seaConfig, null, 2));

// Step 3: Generate the SEA blob
console.log('Step 3: Generating SEA blob...');
try {
  execSync(`node --experimental-sea-config ${seaConfigPath}`, {
    cwd: __dirname,
    stdio: 'inherit'
  });
} catch {
  console.error(
    'Failed to generate SEA blob. Node.js >= 20 is required for SEA support.'
  );
  console.error('For Node.js 18, use the bundled dist/bundle.cjs directly.');
  console.log('\nAlternative: run with `node dist/bundle.cjs`');
  process.exit(0);
}

// Step 4: Copy node binary and inject SEA blob
console.log('Step 4: Injecting SEA blob into Node.js binary...');
const isWindows = process.platform === 'win32';
const binaryName = isWindows
  ? 'convert-sqlite-to-eml.exe'
  : 'convert-sqlite-to-eml';
const binaryPath = path.join(distributionDirectory, binaryName);

// Copy the node binary
fs.copyFileSync(process.execPath, binaryPath);

// Remove signature on macOS
if (process.platform === 'darwin') {
  try {
    execSync(`codesign --remove-signature ${binaryPath}`, {
      stdio: 'inherit'
    });
  } catch {
    console.warn('Warning: could not remove code signature (non-fatal)');
  }
}

// Inject the SEA blob
const sentinelFuse = 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2';
try {
  execSync(
    `npx postject ${binaryPath} NODE_SEA_BLOB ${path.join(
      distributionDirectory,
      'sea-prep.blob'
    )} --sentinel-fuse ${sentinelFuse}` +
      (process.platform === 'darwin' ? ' --macho-segment-name NODE_SEA' : ''),
    { cwd: __dirname, stdio: 'inherit' }
  );
} catch {
  console.error(
    'Failed to inject SEA blob. Install postject: npm install -g postject'
  );
  process.exit(1);
}

// Sign on macOS
if (process.platform === 'darwin') {
  try {
    execSync(`codesign --sign - ${binaryPath}`, { stdio: 'inherit' });
  } catch {
    console.warn('Warning: could not sign binary (non-fatal)');
  }
}

console.log(`\nBuild complete: ${binaryPath}`);
console.log('\nNote: better-sqlite3-multiple-ciphers native module must be');
console.log(
  'available in the same directory or in NODE_PATH for the SEA binary to work.'
);
