/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 50 };

//
// Writes to the console and to a log file that only its owner can read and
// that is rotated by size. Messages never hold the API token, a password or
// the content of mail.
//
export function createLogger(options = {}) {
  const {
    level = 'info',
    file = '',
    maxSize = 10_485_760,
    maxFiles = 3,
    json = false,
    quiet = false
  } = options;
  const threshold = LEVELS[level] ?? LEVELS.info;
  let size = 0;
  let isFileBroken = false;

  if (file) {
    try {
      fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
      size = fs.existsSync(file) ? fs.statSync(file).size : 0;
    } catch {
      isFileBroken = true;
    }
  }

  function rotate() {
    for (let index = maxFiles - 1; index >= 1; index--) {
      const from = index === 1 ? file : `${file}.${index - 1}`;
      try {
        fs.renameSync(from, `${file}.${index}`);
      } catch {}
    }

    if (maxFiles <= 1) {
      try {
        fs.rmSync(file, { force: true });
      } catch {}
    }

    size = 0;
  }

  function write(name, message, meta) {
    if (LEVELS[name] < threshold) return;
    const time = new Date().toISOString();
    const line = json
      ? JSON.stringify({ time, level: name, message, ...meta })
      : `${time} ${name.toUpperCase().padEnd(5)} ${message}${
          meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : ''
        }`;

    if (!quiet) {
      const stream =
        LEVELS[name] >= LEVELS.warn ? process.stderr : process.stdout;
      stream.write(`${line}\n`);
    }

    if (!file || isFileBroken) return;
    try {
      if (maxSize > 0 && size + line.length + 1 > maxSize) rotate();
      fs.appendFileSync(file, `${line}\n`, { mode: 0o600 });
      size += Buffer.byteLength(line) + 1;
    } catch {
      // (the console still has every line)
      isFileBroken = true;
    }
  }

  return {
    file,
    debug: (message, meta) => write('debug', message, meta),
    info: (message, meta) => write('info', message, meta),
    warn: (message, meta) => write('warn', message, meta),
    error: (message, meta) => write('error', message, meta)
  };
}
