#!/usr/bin/env node

/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * Standalone CLI tool to convert Forward Email encrypted SQLite
 * mailbox backups to EML files packaged in a password-protected ZIP.
 *
 * Usage:
 *   node index.js                    # Interactive mode (prompts for all inputs)
 *   node index.js --help             # Show help
 *   node index.js \
 *     --path /path/to/backup.sqlite  \
 *     --password "your-alias-password" \
 *     --output /path/to/output.zip
 *
 * Supports Windows, Linux, and macOS.
 */

import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline';
import { PassThrough } from 'node:stream';
import zlib from 'node:zlib';
import Database from 'better-sqlite3-multiple-ciphers';
import archiver from 'archiver';
import archiverZipEncrypted from 'archiver-zip-encrypted';

// Register the encrypted zip format
archiver.registerFormat('zip-encrypted', archiverZipEncrypted);

// Magic bytes for brotli-compressed attachment bodies
const ATTACHMENT_MAGIC = Buffer.from([0x00, 0x42, 0x52, 0x00]);

/**
 * Parse command-line arguments into a key-value object.
 * Supports --key value and --key=value formats.
 */
function parseArguments(argv) {
  const arguments_ = {};
  for (let i = 2; i < argv.length; i++) {
    const argument = argv[i];
    if (argument.startsWith('--')) {
      const eqIndex = argument.indexOf('=');
      if (eqIndex !== -1) {
        arguments_[argument.slice(2, eqIndex)] = argument.slice(eqIndex + 1);
      } else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        arguments_[argument.slice(2)] = argv[++i];
      } else {
        arguments_[argument.slice(2)] = true;
      }
    }
  }

  return arguments_;
}

/**
 * Create a readline interface for interactive prompts.
 */
function createPrompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
    terminal: true
  });

  return {
    ask(question) {
      return new Promise((resolve) => {
        rl.question(question, (answer) => {
          resolve(answer.trim());
        });
      });
    },
    askPassword(question) {
      return new Promise((resolve) => {
        // Disable echoing for password input
        process.stderr.write(question);
        const { stdin } = process;
        const wasRaw = stdin.isRaw;
        if (stdin.setRawMode) stdin.setRawMode(true);
        let password = '';
        const onData = (ch) => {
          const c = ch.toString('utf8');
          switch (c) {
            case '\n':
            case '\r':
            case '\u0004': {
              if (stdin.setRawMode) stdin.setRawMode(wasRaw);
              stdin.removeListener('data', onData);
              process.stderr.write('\n');
              resolve(password);

              break;
            }

            case '\u0003': {
              // Ctrl+C
              process.exit(1);

              break;
            }

            case '\u007F':
            case '\b':
            case '\u001B[3~': {
              // Backspace/Delete
              password = password.slice(0, -1);
              process.stderr.write(
                '\r' + question + '*'.repeat(password.length) + ' \b'
              );

              break;
            }

            default: {
              password += c;
              process.stderr.write('*');
            }
          }
        };

        stdin.on('data', onData);
        stdin.resume();
      });
    },
    close() {
      rl.close();
    }
  };
}

/**
 * Recursively parse JSON objects, converting {type:'Buffer',data:[...]} back to Buffer
 * and ISO date strings back to Date objects.
 */
function recursivelyParse(json) {
  if (typeof json !== 'object' || json === null) return json;

  if (Array.isArray(json)) {
    for (let i = 0; i < json.length; i++) {
      json[i] = recursivelyParse(json[i]);
    }

    return json;
  }

  if (
    json.type === 'Buffer' &&
    typeof json.data === 'object' &&
    Array.isArray(json.data)
  ) {
    return Buffer.from(json.data);
  }

  if (!Buffer.isBuffer(json)) {
    for (const key of Object.keys(json)) {
      json[key] = recursivelyParse(json[key]);
    }
  }

  return json;
}

/**
 * Decode a brotli-compressed metadata blob (mimeTree, envelope, etc.)
 * Handles both old JSON text format and new brotli-compressed format.
 */
function decodeMetadata(value) {
  if (value === null || value === undefined) return value;

  // Handle Uint8Array
  if (value instanceof Uint8Array && !Buffer.isBuffer(value)) {
    value = Buffer.from(value);
  }

  // Already a plain object or array
  if (
    (Array.isArray(value) && !Buffer.isBuffer(value)) ||
    (typeof value === 'object' &&
      !Buffer.isBuffer(value) &&
      !(value instanceof Uint8Array) &&
      value.constructor === Object)
  ) {
    return value;
  }

  // Old format: JSON string
  if (typeof value === 'string') {
    try {
      return recursivelyParse(JSON.parse(value));
    } catch {
      return value;
    }
  }

  // New format: brotli-compressed Buffer
  if (Buffer.isBuffer(value)) {
    try {
      const decompressed = zlib.brotliDecompressSync(value);
      return recursivelyParse(JSON.parse(decompressed.toString('utf8')));
    } catch {
      try {
        return recursivelyParse(JSON.parse(value.toString('utf8')));
      } catch {
        return value;
      }
    }
  }

  return value;
}

/**
 * Decode an attachment body from storage.
 * Handles old hex format, raw buffer, and new brotli-compressed format.
 */
function decodeAttachmentBody(value) {
  if (value === null || value === undefined) return null;

  if (value instanceof Uint8Array && !Buffer.isBuffer(value)) {
    value = Buffer.from(value);
  }

  // Check for brotli-compressed format with magic header
  if (
    Buffer.isBuffer(value) &&
    value.length >= ATTACHMENT_MAGIC.length &&
    value[0] === ATTACHMENT_MAGIC[0] &&
    value[1] === ATTACHMENT_MAGIC[1] &&
    value[2] === ATTACHMENT_MAGIC[2] &&
    value[3] === ATTACHMENT_MAGIC[3]
  ) {
    try {
      return zlib.brotliDecompressSync(value.subarray(ATTACHMENT_MAGIC.length));
    } catch {
      return value;
    }
  }

  // Raw buffer (no magic header)
  if (Buffer.isBuffer(value)) return value;

  // Old hex-encoded string format
  if (
    typeof value === 'string' &&
    /^[\da-f]+$/i.test(value) &&
    value.length % 2 === 0
  ) {
    return Buffer.from(value, 'hex');
  }

  return value;
}

/**
 * Format headers array for EML output.
 */
function formatHeaders(headers) {
  headers ||= [];
  if (!Array.isArray(headers)) {
    headers = [headers || []].flat();
  }

  return headers;
}

/**
 * Look up an attachment body from the Attachments table.
 */
function getAttachmentBody(database, hash) {
  const row = database
    .prepare('SELECT body FROM Attachments WHERE hash = ?')
    .get(hash);
  if (!row) return Buffer.alloc(0);
  return decodeAttachmentBody(row.body);
}

/**
 * Rebuild an EML message from its mimeTree by walking the tree
 * and emitting headers, body content, and attachment data.
 * Returns a PassThrough stream.
 */
function rebuildMessage(database, mimeTree) {
  const output = new PassThrough();
  const NEWLINE = Buffer.from('\r\n');

  const processStream = async () => {
    let firstLine = true;
    let remainder = false;

    const emit = (data, force) => {
      if (remainder || data || force) {
        if (firstLine) {
          firstLine = false;
        } else {
          output.write(NEWLINE);
        }

        if (remainder && remainder.length > 0) {
          output.write(remainder);
        }

        if (data) {
          output.write(
            Buffer.isBuffer(data) ? data : Buffer.from(data, 'binary')
          );
        }
      }

      remainder = false;
    };

    const walk = async (node) => {
      emit(formatHeaders(node.header).join('\r\n') + '\r\n');

      if (Buffer.isBuffer(node.body)) {
        remainder = node.body;
      } else if (node.body && node.body.buffer) {
        remainder = node.body.buffer;
      } else if (typeof node.body === 'string') {
        remainder = Buffer.from(node.body, 'binary');
      } else {
        remainder = node.body;
      }

      if (node.boundary) {
        emit(`--${node.boundary}`);
      } else if (node.attachmentId) {
        emit(false, true); // Force newline between header and contents

        let { attachmentId } = node;
        if (
          mimeTree.attachmentMap &&
          mimeTree.attachmentMap[node.attachmentId]
        ) {
          attachmentId = mimeTree.attachmentMap[node.attachmentId];
        }

        const body = getAttachmentBody(database, attachmentId);
        if (body && body.length > 0) {
          output.write(body);
        }
      }

      if (Array.isArray(node.childNodes)) {
        let pos = 0;
        for (const childNode of node.childNodes) {
          // eslint-disable-next-line no-await-in-loop
          await walk(childNode);
          if (pos++ < node.childNodes.length - 1) {
            emit(`--${node.boundary}`);
          }
        }
      }

      if (node.boundary) {
        emit(`--${node.boundary}--\r\n`);
      }

      emit();
    };

    await walk(mimeTree);
    if (mimeTree.lineCount > 1) {
      output.write(NEWLINE);
    }

    output.end();
  };

  setImmediate(async () => {
    try {
      await processStream();
      output.end();
    } catch (error) {
      output.emit('error', error);
    }
  });

  return output;
}

/**
 * Count attachment references in a mimeTree recursively.
 */
function countAttachments(node) {
  let count = 0;
  if (node.attachmentId) count++;
  if (Array.isArray(node.childNodes)) {
    for (const child of node.childNodes) {
      count += countAttachments(child);
    }
  }

  return count;
}

/**
 * Open the encrypted SQLite database with the given password.
 * Tries chacha20 cipher first, then falls back to aes256cbc.
 */
function openDatabase(databasePath, password) {
  const database = new Database(databasePath, { readonly: true });

  // Try chacha20 first
  try {
    database.pragma("cipher='chacha20'");
    database.pragma(`key="${password}"`);
    // Verify password is correct by reading schema (WAL not used since we open readonly)
    database.prepare('SELECT count(*) FROM sqlite_master').get();
    return database;
  } catch (error_) {
    if (error_.code === 'SQLITE_NOTADB' || error_.code === 'SQLITE_ERROR') {
      // Fall back to aes256cbc
      try {
        database.close();
      } catch {
        // Ignore close errors
      }

      const database2 = new Database(databasePath, { readonly: true });
      try {
        database2.pragma("cipher='aes256cbc'");
        database2.pragma(`key="${password}"`);
        // Verify password is correct by reading schema (WAL not used since we open readonly)
        database2.prepare('SELECT count(*) FROM sqlite_master').get();
        return database2;
      } catch (error) {
        try {
          database2.close();
        } catch {
          // Ignore close errors
        }

        throw new Error(
          `Failed to open database: invalid password or unsupported cipher. ` +
            `chacha20 error: ${error_.message}, aes256cbc error: ${error.message}`
        );
      }
    }

    throw error_;
  }
}

/**
 * Convert the SQLite mailbox to EML files in a password-protected ZIP.
 * Returns a summary object with counts of folders, messages, attachments, etc.
 */
async function convert(options) {
  const { dbPath, password, outputPath, onProgress } = options;

  // Validate input file
  const stats = fs.statSync(dbPath);
  if (!stats.isFile() || stats.size === 0) {
    throw new Error(`Database file is empty or not a file: ${dbPath}`);
  }

  const log = onProgress || ((message) => process.stderr.write(`${message}\n`));

  log(`Opening database: ${dbPath}`);
  const database = openDatabase(dbPath, password);

  try {
    // Verify we can read the database
    database.pragma('foreign_keys=ON');

    // Count messages for progress reporting
    const { count: messageCount } = database
      .prepare('SELECT COUNT(*) as count FROM Messages')
      .get();
    log(`Found ${messageCount} message(s) in database`);

    // Count total attachments in the database
    let totalAttachmentRows = 0;
    try {
      const result = database
        .prepare('SELECT COUNT(*) as count FROM Attachments')
        .get();
      totalAttachmentRows = result.count;
    } catch {
      // Attachments table may not exist in some edge cases
    }

    // Create output ZIP
    const output = fs.createWriteStream(outputPath);
    const archive = archiver.create('zip-encrypted', {
      zlib: { level: 8 },
      encryptionMethod: 'aes256',
      password
    });

    archive.pipe(output);

    // Add README
    archive.append(
      `EML backup created via Forward Email\nhttps://forwardemail.net\n${new Date().toISOString()}\n\nThis archive contains ${messageCount} email message(s) exported from an encrypted SQLite mailbox backup.\nEach .eml file can be opened with any email client or imported into another mail server.\n`,
      { name: 'README.txt' }
    );

    // Build mailbox path map
    const mailboxMap = new Map();
    const mailboxRows = database
      .prepare('SELECT _id, path FROM Mailboxes ORDER BY path')
      .all();
    for (const row of mailboxRows) {
      mailboxMap.set(row._id, row.path);
      archive.append(null, { name: `${row.path}/` });
      log(`  Mailbox: ${row.path}`);
    }

    // Process messages
    let processed = 0;
    let skipped = 0;
    let attachmentCount = 0;
    const messageRows = database
      .prepare('SELECT _id, mailbox, mimeTree FROM Messages ORDER BY uid')
      .all();

    for (const row of messageRows) {
      const mimeTree = decodeMetadata(row.mimeTree);
      if (!mimeTree) {
        log(`  Warning: skipping message ${row._id} (no mimeTree)`);
        skipped++;
        continue;
      }

      const mailboxPath = mailboxMap.get(row.mailbox) || 'Unknown';
      const name = `${mailboxPath}/${row._id}.eml`;

      // Count attachments in this message
      attachmentCount += countAttachments(mimeTree);

      const stream = rebuildMessage(database, mimeTree);
      archive.append(stream, { name });

      processed++;
      if (processed % 100 === 0 || processed === messageCount) {
        log(`  Processed ${processed}/${messageCount} messages`);
      }
    }

    archive.finalize();

    archive.on('warning', (error) => {
      log(`  Warning: ${error.message}`);
    });

    await new Promise((resolve, reject) => {
      archive.on('error', reject);
      output.on('close', resolve);
    });

    const archiveSize = fs.statSync(outputPath).size;

    return {
      messageCount: processed,
      folderCount: mailboxRows.length,
      attachmentCount,
      totalAttachmentRows,
      skippedCount: skipped,
      outputPath,
      archiveSize
    };
  } finally {
    try {
      database.close();
    } catch {
      // Ignore close errors
    }
  }
}

/**
 * Format bytes into a human-readable string.
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** index;
  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

/**
 * Print a detailed success summary to stderr.
 */
function printSummary(result) {
  const lines = [
    '',
    '  Conversion complete!',
    '  ====================',
    '',
    `  Output:       ${result.outputPath}`,
    `  Archive size: ${formatBytes(result.archiveSize)}`,
    '',
    `  Folders:      ${result.folderCount}`,
    `  Messages:     ${result.messageCount}`,
    `  Attachments:  ${result.attachmentCount} referenced in messages (${result.totalAttachmentRows} stored in database)`
  ];

  if (result.skippedCount > 0) {
    lines.push(
      `  Skipped:      ${result.skippedCount} (missing or corrupt mimeTree)`
    );
  }

  lines.push('');
  process.stderr.write(lines.join('\n') + '\n');
}

/**
 * Show help text.
 */
function showHelp() {
  process.stderr.write(`
convert-sqlite-to-eml - Convert Forward Email SQLite backups to EML files

USAGE:
  convert-sqlite-to-eml [options]

OPTIONS:
  --path <path>       Path to the encrypted SQLite backup file
  --password <pass>   IMAP/alias password for decryption
  --output <path>     Output path for the ZIP file (default: ./backup-<timestamp>.zip)
  --help              Show this help message

INTERACTIVE MODE:
  Run without arguments to be prompted for all inputs.

EXAMPLES:
  # Interactive mode
  convert-sqlite-to-eml

  # Non-interactive mode
  convert-sqlite-to-eml --path ./backup.sqlite --password "my-password"

  # Specify output path
  convert-sqlite-to-eml --path ./backup.sqlite --password "my-password" --output ./emails.zip

NOTES:
  - The SQLite file is your encrypted mailbox backup downloaded from Forward Email
  - The password is the same IMAP/alias password used to access your mailbox
  - Output is a password-protected ZIP containing .eml files organized by mailbox folder
  - The ZIP password is the same as your IMAP/alias password
  - Supports both chacha20 and aes256cbc encrypted databases

For more information, visit: https://forwardemail.net/faq#how-do-i-use-my-own-s3-compatible-storage-for-backups
`);
}

/**
 * Main entry point - handles interactive and non-interactive modes.
 */
async function main() {
  const arguments_ = parseArguments(process.argv);

  if (arguments_.help) {
    showHelp();
    process.exit(0);
  }

  let databasePath = arguments_.path;
  let { password } = arguments_;
  let outputPath = arguments_.output;

  // Interactive mode if any required args are missing
  if (!databasePath || !password) {
    const prompt = createPrompt();

    try {
      process.stderr.write(
        '\n  Forward Email - Convert SQLite Backup to EML\n'
      );
      process.stderr.write(
        '  =============================================\n\n'
      );

      databasePath ||= await prompt.ask('  Path to SQLite backup file: ');

      if (!databasePath) {
        process.stderr.write('  Error: path is required\n');
        process.exit(1);
      }

      // Resolve relative paths
      databasePath = path.resolve(databasePath);

      if (!fs.existsSync(databasePath)) {
        process.stderr.write(`  Error: file not found: ${databasePath}\n`);
        process.exit(1);
      }

      password ||= await prompt.askPassword('  IMAP/alias password: ');

      if (!password) {
        process.stderr.write('  Error: password is required\n');
        process.exit(1);
      }

      if (!outputPath) {
        const defaultOutput = path.join(
          process.cwd(),
          `backup-${new Date().toISOString().replaceAll(/[:.]/g, '-')}.zip`
        );
        const answer = await prompt.ask(
          `  Output ZIP path [${defaultOutput}]: `
        );
        outputPath = answer || defaultOutput;
      }

      process.stderr.write('\n');
    } finally {
      prompt.close();
    }
  }

  // Resolve paths
  databasePath = path.resolve(databasePath);
  outputPath = outputPath
    ? path.resolve(outputPath)
    : path.join(
        process.cwd(),
        `backup-${new Date().toISOString().replaceAll(/[:.]/g, '-')}.zip`
      );

  // Ensure output directory exists
  const outputDirectory = path.dirname(outputPath);
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  // Validate
  if (!fs.existsSync(databasePath)) {
    process.stderr.write(`Error: file not found: ${databasePath}\n`);
    process.exit(1);
  }

  try {
    const result = await convert({
      dbPath: databasePath,
      password,
      outputPath
    });
    printSummary(result);
    process.exit(0);
  } catch (error) {
    process.stderr.write(`\nError: ${error.message}\n`);
    if (error.message.includes('invalid password')) {
      process.stderr.write(
        'Hint: make sure you are using the correct IMAP/alias password.\n'
      );
    }

    process.exit(1);
  }
}

// Export for testing
export {
  convert,
  countAttachments,
  openDatabase,
  decodeMetadata,
  decodeAttachmentBody,
  recursivelyParse,
  formatHeaders,
  rebuildMessage,
  getAttachmentBody,
  parseArguments as parseArgs
};

// Run main if executed directly (ESM equivalent of require.main === module)
// Also handles SEA binary context where import.meta.url may be empty
const isMainModule =
  (import.meta.url &&
    process.argv[1] &&
    (process.argv[1] === import.meta.url.replace('file://', '') ||
      process.argv[1].endsWith('/convert-sqlite-to-eml/index.js'))) ||
  (!import.meta.url && process.pkg === undefined);

if (isMainModule) {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  main();
}
