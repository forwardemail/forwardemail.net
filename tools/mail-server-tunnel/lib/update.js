/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { createHash, createPublicKey, verify } from 'node:crypto';

import { APP_NAME, VERSION } from './config.js';
import { isStandalone } from './service.js';

//
// Updates for the standalone executable (as the Forward Email terminal
// client updates itself): it replaces itself with the matching asset of the
// latest GitHub release, after checking it against the release's checksums,
// and those against their signature by the key below and against the
// version they name. A copy run with Node.js is updated with its package.
//
export const REPOSITORY = 'forwardemail/forwardemail.net';
export const SUMS_NAME = `${APP_NAME}-SHA256SUMS.txt`;
const USER_AGENT = APP_NAME;

// The minisign public key the release checksums are signed with (the key
// the Forward Email apps' updaters trust). A checksum only shows that the
// download is the file the release lists; the signature shows that the list
// is ours, so a release published by someone else is not installed.
export const UPDATE_PUBLIC_KEY =
  'dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IDdCRjY2OTc5RDA0RkI0MUQKUldRZHRFL1FlV24yZTV4ZThJeERhR3hTUXJRdUNqU0dRbXJrTjBjN2VycldUMXpWOG5pb3Q2SUEK';

// The executable built for this OS and CPU, as named on a release
export function assetName(platform = process.platform, arch = process.arch) {
  const os = platform === 'win32' ? 'win' : platform;
  return `${APP_NAME}-${os}-${arch}${platform === 'win32' ? '.exe' : ''}`;
}

function parseVersion(version) {
  const [core, ...pre] = String(version)
    .replace(/^v/, '')
    .replace(/\+.*$/, '')
    .split('-');
  const parts = core.split('.').map((n) => Number.parseInt(n, 10) || 0);
  return {
    parts: [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0],
    pre: pre.join('-')
  };
}

// Prerelease identifiers: numbers by value and before words
function comparePrerelease(a, b) {
  const x = a.split('.');
  const y = b.split('.');
  const number = /^\d+$/;
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    if (number.test(x[i]) !== number.test(y[i]))
      return number.test(x[i]) ? -1 : 1;
    const [p, q] = number.test(x[i])
      ? [Number(x[i]), Number(y[i])]
      : [x[i], y[i]];
    if (p < q) return -1;
    if (p > q) return 1;
  }

  return Math.sign(x.length - y.length);
}

// Semver precedence: 1 when a is newer, -1 when older, 0 when equal
export function compareVersions(a, b) {
  const x = parseVersion(a);
  const y = parseVersion(b);
  for (let i = 0; i < 3; i++)
    if (x.parts[i] !== y.parts[i]) return x.parts[i] > y.parts[i] ? 1 : -1;
  if (x.pre === y.pre) return 0;
  if (!x.pre) return 1;
  if (!y.pre) return -1;
  return comparePrerelease(x.pre, y.pre);
}

export async function fetchLatestRelease(options = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const base = options.apiBase ?? 'https://api.github.com';
  const response = await fetchImpl(
    `${base}/repos/${REPOSITORY}/releases/latest`,
    {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': USER_AGENT
      },
      signal: options.signal ?? AbortSignal.timeout(30_000)
    }
  );
  if (!response.ok)
    throw new Error(
      `Could not check for updates (GitHub responded ${response.status})`
    );
  const body = await response.json();
  return {
    tag: body.tag_name,
    version: String(body.tag_name).replace(/^v/, ''),
    url: body.html_url,
    assets: (body.assets ?? []).map((asset) => ({
      name: asset.name,
      url: asset.browser_download_url
    }))
  };
}

export function parseChecksums(text) {
  const sums = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.trim().match(/^([a-f\d]{64})\s+\*?(.+)$/i);
    if (match) sums.set(match[2].trim(), match[1].toLowerCase());
  }

  return sums;
}

// A minisign key or signature, as text (`tauri signer` writes them in base64)
function minisignLines(value) {
  const text = value.includes('untrusted comment:')
    ? value
    : Buffer.from(value.trim(), 'base64').toString('utf8');
  return text.split(/\r?\n/);
}

const ED25519_SPKI_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

//
// Whether `signature` (a minisign signature file) is a signature of `data`
// by `publicKey`. Both of its signatures are checked: the one of the data,
// and the one that covers the trusted comment.
//
export function verifySignature(
  data,
  signature,
  publicKey = UPDATE_PUBLIC_KEY
) {
  try {
    const key = Buffer.from(minisignLines(publicKey)[1] ?? '', 'base64');
    const [, signatureLine = '', commentLine = '', globalLine = ''] =
      minisignLines(signature);
    const signed = Buffer.from(signatureLine, 'base64');
    const global = Buffer.from(globalLine, 'base64');
    const prefix = 'trusted comment: ';
    if (
      key.length !== 42 ||
      key.subarray(0, 2).toString('latin1') !== 'Ed' ||
      signed.length !== 74 ||
      global.length !== 64 ||
      !commentLine.startsWith(prefix) ||
      // (signed by another key)
      !key.subarray(2, 10).equals(signed.subarray(2, 10))
    )
      return false;
    // "ED": the BLAKE2b-512 hash of the data is signed. ("Ed" signs the data
    // itself; these two letters are not signed, so with both accepted a
    // signature of a file would also pass for the bytes of its hash.)
    if (signed.subarray(0, 2).toString('latin1') !== 'ED') return false;
    const message = createHash('blake2b512').update(data).digest();
    const publicKeyObject = createPublicKey({
      key: Buffer.concat([ED25519_SPKI_PREFIX, key.subarray(10)]),
      format: 'der',
      type: 'spki'
    });
    const dataSignature = signed.subarray(10);
    return (
      verify(null, message, publicKeyObject, dataSignature) &&
      verify(
        null,
        Buffer.concat([
          dataSignature,
          Buffer.from(commentLine.slice(prefix.length), 'utf8')
        ]),
        publicKeyObject,
        global
      )
    );
  } catch {
    return false;
  }
}

async function download(url, fetchImpl, signal) {
  const response = await fetchImpl(url, {
    headers: { 'user-agent': USER_AGENT },
    redirect: 'follow',
    signal: signal ?? AbortSignal.timeout(600_000)
  });
  if (!response.ok)
    throw new Error(`Download failed (${response.status}): ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

//
// Downloads this platform's executable from a release, verifies the
// signature of the release's checksums, that they are the checksums of that
// release and the executable's checksum, and swaps it in for `target`. The
// running process keeps its open copy; the new version runs after a restart.
//
export async function installBinary(release, options = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const target = options.target ?? process.execPath;
  const name = options.assetName ?? assetName();
  const asset = release.assets.find((item) => item.name === name);
  const sumsAsset = release.assets.find((item) => item.name === SUMS_NAME);
  const signatureAsset = release.assets.find(
    (item) => item.name === `${SUMS_NAME}.sig`
  );
  if (!asset) throw new Error(`Release ${release.tag} has no ${name} yet`);
  if (!sumsAsset)
    throw new Error(`Release ${release.tag} has no ${SUMS_NAME} yet`);
  if (!signatureAsset)
    throw new Error(`Release ${release.tag} has no ${SUMS_NAME}.sig yet`);

  const sums = await download(sumsAsset.url, fetchImpl, options.signal);
  const signature = await download(
    signatureAsset.url,
    fetchImpl,
    options.signal
  );
  if (!verifySignature(sums, signature.toString('utf8'), options.publicKey))
    throw new Error(
      `${SUMS_NAME} in ${release.tag} is not signed by Forward Email`
    );

  // The list ends with its release ("# version: 1.2.3", written by the
  // release workflow before it signs). Without this, the signed files of an
  // earlier release, attached to a later one, would install the earlier build.
  const listed = sums
    .toString('utf8')
    .match(/(?:^|\n)# version: (\S+)\n?$/)?.[1];
  if (listed !== release.version)
    throw new Error(
      `${SUMS_NAME} in ${release.tag} is not the list of that release`
    );

  const expected = parseChecksums(sums.toString('utf8')).get(name);
  if (!expected)
    throw new Error(`${SUMS_NAME} in ${release.tag} does not list ${name}`);
  const binary = await download(asset.url, fetchImpl, options.signal);
  const actual = createHash('sha256').update(binary).digest('hex');
  if (actual !== expected)
    throw new Error(
      `Checksum mismatch for ${name}: expected ${expected}, got ${actual}`
    );

  const staged = path.join(
    path.dirname(target),
    `.${path.basename(target)}.${process.pid}.new`
  );
  try {
    fs.writeFileSync(staged, binary, { mode: 0o755 });
    if (process.platform === 'win32') {
      // A running .exe cannot be replaced, but it can be renamed. A previous
      // .old may still be running; then this one gets a name of its own,
      // and cleanupPreviousBinary() leaves it for later.
      let old = `${target}.old`;
      try {
        fs.rmSync(old, { force: true });
      } catch {
        old = `${target}.${process.pid}.old`;
      }

      fs.renameSync(target, old);
      try {
        fs.renameSync(staged, target);
      } catch (error) {
        fs.renameSync(old, target);
        throw error;
      }
    } else {
      fs.renameSync(staged, target);
    }
  } catch (error) {
    fs.rmSync(staged, { force: true });
    if (error.code === 'EACCES' || error.code === 'EPERM')
      throw new Error(
        `No permission to replace ${target}. Run "${APP_NAME} update" with sudo (or from an Administrator terminal).`
      );
    throw error;
  }

  return release.version;
}

// Removes the copies that updates on Windows left behind
export function cleanupPreviousBinary(target = process.execPath) {
  if (process.platform !== 'win32') return;
  const base = path.basename(target);
  let names;
  try {
    names = fs.readdirSync(path.dirname(target));
  } catch {
    return;
  }

  for (const name of names) {
    if (
      name !== `${base}.old` &&
      !(name.startsWith(`${base}.`) && /\.\d+\.old$/.test(name))
    )
      continue;
    try {
      fs.rmSync(path.join(path.dirname(target), name), { force: true });
    } catch {
      // (still in use by an old process; next time)
    }
  }
}

function readState(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

//
// Checks for a newer release and installs it when this is the standalone
// executable. Resolves with { current, latest, updated, message }; with
// `force` unset it checks at most once per `update.interval`.
//
export async function checkForUpdate(config, options = {}) {
  const current = options.current ?? VERSION;
  const stateFile = path.join(config.directory, 'update.json');
  const state = readState(stateFile);
  if (
    !options.force &&
    state.checkedAt &&
    Date.now() - state.checkedAt < config.update.interval
  )
    return { current, latest: state.latest, updated: false, skipped: true };

  const release = await fetchLatestRelease(options);
  const save = (extra) => {
    try {
      fs.mkdirSync(config.directory, { recursive: true, mode: 0o700 });
      fs.writeFileSync(
        stateFile,
        JSON.stringify({
          checkedAt: Date.now(),
          latest: release.version,
          ...extra
        }),
        { mode: 0o600 }
      );
    } catch {}
  };

  // (a release without this app's executable is not one of its versions)
  const hasAsset = release.assets.some(
    (asset) => asset.name === (options.assetName ?? assetName())
  );
  if (!hasAsset || compareVersions(release.version, current) <= 0) {
    save({});
    return {
      current,
      latest: hasAsset ? release.version : current,
      updated: false,
      message: `${current} is up to date`
    };
  }

  if (options.checkOnly || !(options.isStandalone ?? isStandalone())) {
    save({});
    return {
      current,
      latest: release.version,
      updated: false,
      message: `Version ${release.version} is available: ${release.url}`
    };
  }

  await installBinary(release, options);
  save({ applied: release.version });
  return {
    current,
    latest: release.version,
    updated: true,
    message: `Updated ${current} to ${release.version}`
  };
}
