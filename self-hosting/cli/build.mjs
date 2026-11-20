//
// Bundles the CLI into one CommonJS file (dist/cli.cjs) with the lite compose
// file and env template embedded, so a CLI release always installs the files
// it was tested with.
//
// `--sea` also turns it into a single executable for this machine's OS and
// architecture (Node's single executable applications, Node 22+), at
// dist/forwardemail-selfhost-<os>-<arch>. CI runs it on a runner of each
// OS/architecture: a SEA binary cannot be cross-compiled.
//

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(here, 'dist');
const pkg = JSON.parse(fs.readFileSync(path.join(here, 'package.json'), 'utf8'));

fs.mkdirSync(dist, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(here, 'src', 'index.ts')],
  outfile: path.join(dist, 'cli.cjs'),
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  banner: { js: '#!/usr/bin/env node' },
  loader: { '.yml': 'text', '.example': 'text' },
  define: { __VERSION__: JSON.stringify(pkg.version) },
  legalComments: 'none'
});
fs.chmodSync(path.join(dist, 'cli.cjs'), 0o755);
console.log(`built dist/cli.cjs (${pkg.version})`);

if (process.argv.includes('--sea')) {
  const os = process.platform;
  const arch = process.arch;
  const ext = os === 'win32' ? '.exe' : '';
  const out = path.join(dist, `forwardemail-selfhost-${os}-${arch}${ext}`);
  const blob = path.join(dist, 'sea-prep.blob');
  const seaConfig = path.join(dist, 'sea-config.json');

  fs.writeFileSync(
    seaConfig,
    JSON.stringify({
      main: path.join(dist, 'cli.cjs'),
      output: blob,
      disableExperimentalSEAWarning: true,
      useCodeCache: true
    })
  );
  execFileSync(process.execPath, ['--experimental-sea-config', seaConfig], {
    stdio: 'inherit'
  });

  fs.copyFileSync(process.execPath, out);
  fs.chmodSync(out, 0o755);
  // the copied node binary is signed; the signature is removed before the
  // blob goes in and an ad-hoc one added after (macOS refuses to run it
  // otherwise)
  if (os === 'darwin')
    execFileSync('codesign', ['--remove-signature', out], { stdio: 'inherit' });

  const postject = path.join(here, 'node_modules', '.bin', 'postject');
  execFileSync(
    postject,
    [
      out,
      'NODE_SEA_BLOB',
      blob,
      '--sentinel-fuse',
      'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2',
      ...(os === 'darwin' ? ['--macho-segment-name', 'NODE_SEA'] : [])
    ],
    { stdio: 'inherit' }
  );

  if (os === 'darwin')
    execFileSync('codesign', ['--sign', '-', out], { stdio: 'inherit' });

  fs.rmSync(blob);
  fs.rmSync(seaConfig);
  console.log(`built ${path.relative(here, out)}`);
}
