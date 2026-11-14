/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * Builds the standalone executable (a Node.js Single Executable Application)
 * for the current platform:
 *
 * 1. Bundles the app with esbuild (the version of package.json is built in)
 * 2. Creates a Node.js SEA blob
 * 3. Injects the blob into a copy of the Node.js binary
 */

import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distributionDirectory = path.join(__dirname, 'dist');
const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
);

fs.rmSync(distributionDirectory, { recursive: true, force: true });
fs.mkdirSync(distributionDirectory, { recursive: true });

console.log(`Building mail-server-tunnel ${version}...`);

const { build } = await import('esbuild');
await build({
  entryPoints: [path.join(__dirname, 'index.js')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: path.join(distributionDirectory, 'bundle.cjs'),
  format: 'cjs',
  minify: true,
  keepNames: true,
  define: {
    __MST_VERSION__: JSON.stringify(version),
    'import.meta.url': 'undefined'
  },
  // (optional native add-ons of ws, which works without them)
  external: ['bufferutil', 'utf-8-validate']
});

const seaConfigPath = path.join(distributionDirectory, 'sea-config.json');
fs.writeFileSync(
  seaConfigPath,
  JSON.stringify(
    {
      main: path.join(distributionDirectory, 'bundle.cjs'),
      output: path.join(distributionDirectory, 'sea-prep.blob'),
      disableExperimentalSEAWarning: true,
      useSnapshot: false,
      useCodeCache: false
    },
    null,
    2
  )
);

execFileSync(process.execPath, ['--experimental-sea-config', seaConfigPath], {
  cwd: __dirname,
  stdio: 'inherit'
});

const isWindows = process.platform === 'win32';
const binaryPath = path.join(
  distributionDirectory,
  isWindows ? 'mail-server-tunnel.exe' : 'mail-server-tunnel'
);
fs.copyFileSync(process.execPath, binaryPath);
if (!isWindows) fs.chmodSync(binaryPath, 0o755);

if (process.platform === 'darwin') {
  try {
    execSync(`codesign --remove-signature "${binaryPath}"`, {
      stdio: 'inherit'
    });
  } catch {
    console.warn('Warning: could not remove code signature (non-fatal)');
  }
}

execSync(
  `npx --no postject "${binaryPath}" NODE_SEA_BLOB "${path.join(
    distributionDirectory,
    'sea-prep.blob'
  )}" --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2` +
    (process.platform === 'darwin' ? ' --macho-segment-name NODE_SEA' : ''),
  { cwd: __dirname, stdio: 'inherit' }
);

if (process.platform === 'darwin') {
  try {
    execSync(`codesign --sign - "${binaryPath}"`, { stdio: 'inherit' });
  } catch {
    console.warn('Warning: could not sign binary (non-fatal)');
  }
}

console.log(`\nBuild complete: ${binaryPath}`);
