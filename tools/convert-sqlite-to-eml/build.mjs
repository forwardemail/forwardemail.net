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
 * 1. Bundles the CLI tool with esbuild (excluding only the `bindings` module)
 * 2. Embeds the native .node file as a SEA asset
 * 3. Creates a Node.js SEA blob
 * 4. Injects the blob into a copy of the Node.js binary
 *
 * The native module (better-sqlite3-multiple-ciphers) is embedded as a SEA
 * asset and extracted to a temp file at runtime. This produces a true
 * single-file binary with no external dependencies.
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

// Find the native .node module
const nativeModulePath = findNativeModule();
console.log(`Found native module: ${nativeModulePath}`);

// Step 1: Bundle with esbuild
// We bundle everything EXCEPT the `bindings` module (which locates .node files).
// In the banner, we intercept require('bindings') to extract the .node from
// the SEA asset at runtime using node:sea getRawAsset().
console.log('Step 1: Bundling with esbuild...');
const { build } = await import('esbuild');

// Banner that intercepts require('bindings') in SEA context
// to extract the native .node file from the embedded SEA asset
const seaBanner = [
  '(function() {',
  '  if (typeof require !== "undefined") {',
  '    var origRequire = require;',
  '    var Module = origRequire("module");',
  '    if (typeof Module.createRequire === "function") {',
  '      var origResolve = require.resolve;',
  '      require = function(id) {',
  '        if (id === "bindings") {',
  '          return function() {',
  '            try {',
  '              var sea = origRequire("node:sea");',
  '              if (sea && sea.isSea && sea.isSea()) {',
  '                var os = origRequire("os");',
  '                var path = origRequire("path");',
  '                var fs = origRequire("fs");',
  '                var tmpPath = path.join(os.tmpdir(), "better_sqlite3_" + process.pid + ".node");',
  '                var raw = sea.getRawAsset("better_sqlite3.node");',
  '                fs.writeFileSync(tmpPath, Buffer.from(raw));',
  '                var mod = { exports: {} };',
  '                process.dlopen(mod, tmpPath);',
  '                process.on("exit", function() { try { fs.unlinkSync(tmpPath); } catch(e) {} });',
  '                return mod.exports;',
  '              }',
  '            } catch(e) {}',
  '            var realReq = Module.createRequire(path.join(process.execPath, "..", "package.json"));',
  '            return realReq("bindings")("better_sqlite3.node");',
  '          };',
  '        }',
  '        try { return origRequire(id); } catch(e) {',
  '          var p = origRequire("path");',
  '          var rr = Module.createRequire(p.join(process.execPath, "..", "package.json"));',
  '          return rr(id);',
  '        }',
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
  target: 'node20',
  outfile: path.join(distributionDirectory, 'bundle.cjs'),
  format: 'cjs',
  banner: { js: seaBanner },
  // Only externalize `bindings` - the JS wrapper code gets bundled
  external: ['bindings'],
  // Minify for smaller binary
  minify: true,
  // Keep function names for better error messages
  keepNames: true
});

console.log('Bundle created: dist/bundle.cjs');

// Step 2: Create SEA config with native module as asset
console.log('Step 2: Creating SEA configuration...');
const seaConfig = {
  main: path.join(distributionDirectory, 'bundle.cjs'),
  output: path.join(distributionDirectory, 'sea-prep.blob'),
  disableExperimentalSEAWarning: true,
  useSnapshot: false,
  useCodeCache: true,
  assets: {
    'better_sqlite3.node': nativeModulePath
  }
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
console.log(
  'The native module is embedded as a SEA asset - no external files needed.'
);

/**
 * Find the native .node module for better-sqlite3-multiple-ciphers.
 * Searches prebuilds first, then build/Release.
 */
function findNativeModule() {
  const baseDirectory = path.join(
    __dirname,
    'node_modules',
    'better-sqlite3-multiple-ciphers'
  );

  // Check prebuilds directory first
  const prebuildsDirectory = path.join(baseDirectory, 'prebuilds');
  if (fs.existsSync(prebuildsDirectory)) {
    const platformArch = `${process.platform}-${process.arch}`;
    const prebuildDirectory = path.join(prebuildsDirectory, platformArch);
    if (fs.existsSync(prebuildDirectory)) {
      const files = fs.readdirSync(prebuildDirectory);
      const nodeFile = files.find((f) => f.endsWith('.node'));
      if (nodeFile) {
        return path.join(prebuildDirectory, nodeFile);
      }
    }
  }

  // Fall back to build/Release
  const buildRelease = path.join(baseDirectory, 'build', 'Release');
  if (fs.existsSync(buildRelease)) {
    const files = fs.readdirSync(buildRelease);
    const nodeFile = files.find((f) => f.endsWith('.node'));
    if (nodeFile) {
      return path.join(buildRelease, nodeFile);
    }
  }

  throw new Error(
    'Could not find better_sqlite3.node native module. Run npm install first.'
  );
}
