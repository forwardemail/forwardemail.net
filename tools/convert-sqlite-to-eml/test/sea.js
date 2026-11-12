/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * The standalone executable carries the SQLite library inside it, and writes
 * it to the temporary folder to load it.
 */

import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import { isBuiltin } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import test from 'ava';
import Database from 'better-sqlite3-multiple-ciphers';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const executable = path.join(root, 'dist', 'convert-sqlite-to-eml');
const password = 'standalone-test-pw';

//
// The export is written to a FIFO, which holds the executable still (with the
// library loaded) until the test reads from it. Windows has no FIFO, and a
// standalone executable needs a Node.js that has node:sea.
//
const supported = process.platform !== 'win32' && isBuiltin('node:sea');
const standalone = supported ? test.serial : test.serial.skip;

// Built once, by the first test.
let built = false;
function build() {
  if (!built) execFileSync(process.execPath, ['build.mjs'], { cwd: root });
  built = true;
}

// A folder of the test's own, with an encrypted mailbox that has no messages.
function mailbox(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sea-'));
  t.teardown(() => fs.rmSync(directory, { recursive: true, force: true }));
  const databasePath = path.join(directory, 'mailbox.sqlite');
  const database = new Database(databasePath);
  database.pragma("cipher='chacha20'");
  database.pragma(`key="${password}"`);
  database.exec('CREATE TABLE Mailboxes (_id TEXT PRIMARY KEY, path TEXT)');
  database.exec(
    'CREATE TABLE Messages (_id TEXT PRIMARY KEY, mailbox TEXT, uid INTEGER, mimeTree BLOB)'
  );
  database.close();
  return { directory, databasePath };
}

// Runs an export, and returns the name of the folder the library was in.
async function exportMailbox(t) {
  const { directory, databasePath } = mailbox(t);
  const temporary = path.join(directory, 'tmp');
  fs.mkdirSync(temporary);
  const outputPath = path.join(directory, 'export.zip');
  execFileSync('mkfifo', [outputPath]);

  const child = spawn(
    executable,
    ['--path', databasePath, '--password', password, '--output', outputPath],
    { env: { ...process.env, TMPDIR: temporary }, stdio: 'ignore' }
  );
  const exited = once(child, 'exit');
  let reader;

  // The files in the temporary folder, and in a folder found there.
  const files = () =>
    fs
      .readdirSync(temporary, { withFileTypes: true })
      .flatMap((entry) =>
        entry.isDirectory()
          ? fs.readdirSync(path.join(temporary, entry.name))
          : [entry.name]
      );

  try {
    // Wait for the library to be written out.
    for (let i = 0; i < 600 && child.exitCode === null; i++) {
      if (files().length > 0) break;
      // eslint-disable-next-line no-await-in-loop
      await delay(100);
    }

    //
    // A folder that only this user can enter, with the library in it. (A
    // file written straight into a temporary folder that others can write
    // to could be put there by one of them first, and it is what gets
    // loaded.)
    //
    const entries = fs.readdirSync(temporary);
    t.is(entries.length, 1);
    const folder = path.join(temporary, entries[0]);
    const stats = fs.statSync(folder);
    t.true(stats.isDirectory());
    t.is(stats.mode & 0o777, 0o700); // eslint-disable-line no-bitwise
    t.deepEqual(fs.readdirSync(folder), ['better_sqlite3.node']);

    // Let it finish, and check that it cleans up after itself.
    reader = spawn('cat', [outputPath], { stdio: 'ignore' });
    const [code] = await exited;
    t.is(code, 0);
    t.deepEqual(fs.readdirSync(temporary), []);

    return entries[0];
  } finally {
    child.kill('SIGKILL');
    if (reader) reader.kill('SIGKILL');
  }
}

standalone(
  'the standalone executable loads SQLite from a folder of its own',
  async (t) => {
    t.timeout(5 * 60 * 1000);
    build();

    // (a folder with the same name each time could be made by someone else)
    t.not(await exportMailbox(t), await exportMailbox(t));
  }
);

standalone(
  'the standalone executable loads nothing from the folders around it',
  (t) => {
    t.timeout(5 * 60 * 1000);
    build();

    //
    // A copy of the executable with a module beside it, under the name the
    // executable asks for when it loads SQLite. (Node.js looks a module up in
    // node_modules of the folder and of every folder above it, so for an
    // executable kept in a shared folder that is a place others can write to.)
    //
    const { directory, databasePath } = mailbox(t);
    const copy = path.join(directory, 'convert-sqlite-to-eml');
    fs.copyFileSync(executable, copy);
    fs.chmodSync(copy, 0o755);
    const loaded = path.join(directory, 'loaded');
    const beside = path.join(directory, 'node_modules', 'bindings');
    fs.mkdirSync(beside, { recursive: true });
    fs.writeFileSync(
      path.join(beside, 'index.js'),
      `require('node:fs').writeFileSync(${JSON.stringify(loaded)}, '');\n` +
        `module.exports = () => { throw new Error('loaded from beside'); };\n`
    );

    // The library cannot be written out: the temporary folder does not exist.
    const result = spawnSync(
      copy,
      [
        '--path',
        databasePath,
        '--password',
        password,
        '--output',
        path.join(directory, 'export.zip')
      ],
      {
        env: { ...process.env, TMPDIR: path.join(directory, 'missing') },
        encoding: 'utf8'
      }
    );

    t.false(fs.existsSync(loaded));
    t.is(result.status, 1);
    t.regex(result.stderr, /ENOENT.*mkdtemp/);
  }
);
