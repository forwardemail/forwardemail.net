#!/usr/bin/env node

/**
 * Consolidated script for repairing corrupted PGP encrypted messages from Feb 2-6, 2026
 *
 * Usage:
 *   node scripts/repair-encrypted-messages.js test              - Run unit tests
 *   node scripts/repair-encrypted-messages.js status            - Check affected message count
 *   node scripts/repair-encrypted-messages.js status --detailed - Show detailed stats
 *   node scripts/repair-encrypted-messages.js migrate --dry-run - Preview changes
 *   node scripts/repair-encrypted-messages.js migrate           - Apply repairs to database
 *
 * Options:
 *   --dry-run    For migrate: preview changes without updating database
 *   --verbose    Show detailed logs for each message
 *   --limit N    Process only N messages
 *   --detailed   For status: show detailed statistics and sample messages
 *   --sample N   For status: show N sample messages (default: 5)
 */

const { Buffer } = require('node:buffer');
const process = require('node:process');
const { repairEncryptedMessage, extractEncryptedPayloadFromRaw } = require('#helpers/repair-encrypted-message');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logResult(status, message) {
  const statusColor = status === 'SUCCESS' ? 'green' : status === 'SKIP' ? 'gray' : status === 'FAIL' ? 'red' : 'yellow';
  const statusLabel = `[${status}]`.padEnd(10);
  console.log(`${colors[statusColor]}${statusLabel}${colors.reset} ${message}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// ============================================================================
// TEST SUITE
// ============================================================================

const SAMPLE_ENCRYPTED_MESSAGE = `From: sender@example.com
To: recipient@example.com
Subject: Test Encrypted Message
Content-Type: multipart/encrypted; protocol="application/pgp-encrypted"; boundary="nm_test123"
Content-Description: OpenPGP encrypted message
Content-Transfer-Encoding: 7bit

This is an OpenPGP/MIME encrypted message

--nm_test123
Content-Type: application/pgp-encrypted
Content-Transfer-Encoding: 7bit

Version: 1

--nm_test123
Content-Type: application/octet-stream; name=encrypted.asc
Content-Disposition: inline; filename=encrypted.asc
Content-Transfer-Encoding: 7bit

-----BEGIN PGP MESSAGE-----
Version: OpenPGP.js v6.3.0

wc... This is a sample encrypted payload for testing purposes only ...
More encrypted content here ...
And more lines to ensure sufficient payload length for validation ...
-----END PGP MESSAGE-----

--nm_test123--`;

function runTests() {
  log('\n' + '='.repeat(70), 'blue');
  log('   PGP Encrypted Message Repair - Test Suite', 'blue');
  log('='.repeat(70) + '\n', 'blue');

  let passed = 0;
  let failed = 0;

  function test(condition, message) {
    if (condition) {
      logResult('PASS', message);
      passed++;
    } else {
      logResult('FAIL', message);
      failed++;
    }
  }

  try {
    log('📋 Testing: extractEncryptedPayloadFromRaw()', 'blue');

    const extracted = extractEncryptedPayloadFromRaw(SAMPLE_ENCRYPTED_MESSAGE);
    test(extracted && extracted.includes('BEGIN PGP MESSAGE'), 'Extracts PGP message block from raw');
    test(extracted && extracted.includes('END PGP MESSAGE'), 'Payload includes PGP footer');
    test(extracted && extracted.length > 100, 'Extracted payload has sufficient length');

    const noExtract = extractEncryptedPayloadFromRaw('random text without pgp');
    test(!noExtract, 'Returns null for non-PGP messages');

    const bufferInput = Buffer.from(SAMPLE_ENCRYPTED_MESSAGE);
    const extractedFromBuffer = extractEncryptedPayloadFromRaw(bufferInput);
    test(
      extractedFromBuffer && extractedFromBuffer.includes('BEGIN PGP MESSAGE'),
      'Works with Buffer input'
    );

    const noBoundary = extractEncryptedPayloadFromRaw('From: test@example.com\r\nSubject: test\r\n\r\nNo boundary here');
    test(!noBoundary, 'Handles missing boundary gracefully');

    log('\n📋 Testing: repairEncryptedMessage()', 'blue');

    const mimeTreeCorrupted = {
      contentType: 'multipart/encrypted',
      childNodes: [
        { contentType: 'application/pgp-encrypted' },
        {
          filename: 'encrypted.asc',
          contentType: 'application/octet-stream',
          size: 50
        }
      ]
    };

    const repaired = repairEncryptedMessage(mimeTreeCorrupted, SAMPLE_ENCRYPTED_MESSAGE);
    test(
      repaired && repaired.childNodes && repaired.childNodes[1] && repaired.childNodes[1].size > 100,
      'Repairs corrupted mimeTree with empty encrypted.asc'
    );
    test(
      repaired && repaired.childNodes[1].content !== undefined,
      'Adds content to encrypted part'
    );
    test(
      repaired && !repaired.childNodes[1].sizeEstimated,
      'Marks size as not estimated after repair'
    );

    const mimeTreeValid = {
      contentType: 'multipart/encrypted',
      childNodes: [
        { contentType: 'application/pgp-encrypted' },
        {
          filename: 'encrypted.asc',
          contentType: 'application/octet-stream',
          size: 500
        }
      ]
    };

    const unchanged = repairEncryptedMessage(mimeTreeValid, SAMPLE_ENCRYPTED_MESSAGE);
    test(unchanged.childNodes[1].size === 500, 'Skips already-valid messages');

    const nonEncrypted = { contentType: 'text/plain' };
    const result = repairEncryptedMessage(nonEncrypted, SAMPLE_ENCRYPTED_MESSAGE);
    test(result === nonEncrypted, 'Leaves non-encrypted messages unchanged');

    log('\n📋 Testing: Edge Cases', 'blue');

    test(
      !extractEncryptedPayloadFromRaw(''),
      'Handles empty raw message'
    );
    test(
      !extractEncryptedPayloadFromRaw(null),
      'Handles null raw message'
    );
    test(
      repairEncryptedMessage(null, SAMPLE_ENCRYPTED_MESSAGE) === null,
      'Handles null mimeTree'
    );

    const crlf = SAMPLE_ENCRYPTED_MESSAGE.replace(/\n/g, '\r\n');
    const crlfExtract = extractEncryptedPayloadFromRaw(crlf);
    test(
      crlfExtract && crlfExtract.includes('BEGIN PGP MESSAGE'),
      'Works with CRLF line endings'
    );

    log('\n' + '='.repeat(70), 'blue');
    log(`   Results: ${passed} passed, ${failed} failed`, failed > 0 ? 'red' : 'green');
    log('='.repeat(70) + '\n', 'blue');

    return failed > 0 ? false : true;
  } catch (err) {
    log(`\n❌ Test Error: ${err.message}`, 'red');
    return false;
  }
}

// ============================================================================
// STATUS CHECK
// ============================================================================

async function checkStatus(detailed = false, sampleSize = 5) {
  try {
    const Messages = require('#models/messages');

    log('\n' + '='.repeat(70), 'blue');
    log('   Encrypted Message Status Check', 'blue');
    log('='.repeat(70), 'blue');

    const query = {
      created_at: {
        $gte: new Date('2026-02-02'),
        $lte: new Date('2026-02-07')
      },
      'attachments': {
        $elemMatch: {
          filename: 'encrypted.asc',
          contentType: 'application/octet-stream',
          size: { $lt: 100 }
        }
      }
    };

    log('\n🔍 Analyzing corrupted messages...', 'blue');

    const count = await Messages.countDocuments(query);
    log(`Found: ${count} messages with empty encrypted.asc bodies\n`, count === 0 ? 'green' : 'yellow');

    if (count > 0) {
      // Continue processing
    } else {
      log('✓ No corrupted messages found!', 'green');
      log('='.repeat(70) + '\n', 'blue');
      return true;
    }

    if (detailed) {
      log('📊 Statistics:', 'blue');

      const sizeStats = await Messages.aggregate([
        { $match: query },
        { $unwind: '$attachments' },
        {
          $match: {
            'attachments.filename': 'encrypted.asc',
            'attachments.size': { $lt: 100 }
          }
        },
        {
          $group: {
            _id: null,
            totalSize: { $sum: '$attachments.size' },
            avgSize: { $avg: '$attachments.size' },
            minSize: { $min: '$attachments.size' },
            maxSize: { $max: '$attachments.size' }
          }
        }
      ]);

      if (sizeStats.length > 0) {
        const stats = sizeStats[0];
        log(`  Total size: ${formatBytes(stats.totalSize)}`, 'reset');
        log(`  Average size: ${formatBytes(stats.avgSize)}`, 'reset');
        log(`  Size range: ${stats.minSize}B - ${stats.maxSize}B`, 'reset');
      }

      const dateStats = await Messages.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$created_at' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      log(`\n📅 Distribution by Date:`, 'blue');
      for (const stat of dateStats) {
        const bar = '█'.repeat(Math.ceil(stat.count / 5));
        log(`  ${stat._id}: ${bar} ${stat.count}`, 'reset');
      }

      // Repairability estimate
      log(`\n🔧 Repairability Estimate:`, 'blue');
      const allCorrupted = await Messages.find({ ...query }).lean();
      let repairableCount = 0;
      let unreparableCount = 0;

      for (const msg of allCorrupted) {
        if (msg.raw && msg.raw.toString().includes('BEGIN PGP MESSAGE')) {
          repairableCount++;
        } else {
          unreparableCount++;
        }
      }

      const repairablePercent = ((repairableCount / count) * 100).toFixed(1);
      log(`  Repairable: ${repairableCount} (${repairablePercent}%)`, 'green');
      log(`  Not repairable: ${unreparableCount}`, unreparableCount === 0 ? 'green' : 'red');

      // Sample messages
      log(`\n📮 Sample Messages (first ${sampleSize}):`, 'blue');

      const samples = await Messages.find({ ...query })
        .limit(sampleSize)
        .lean();

      for (const msg of samples) {
        const encAsc = msg.attachments?.find(
          (a) =>
            a.filename === 'encrypted.asc' &&
            a.contentType === 'application/octet-stream'
        );

        log(`\n  ID: ${msg._id}`, 'gray');
        log(`  Subject: ${msg.subject || '(none)'}`, 'gray');
        log(`  Created: ${formatDate(msg.created_at)}`, 'gray');
        log(`  encrypted.asc: ${encAsc?.size || 0}B`, 'yellow');
        log(`  Raw size: ${formatBytes(msg.raw?.length || 0)}`, 'gray');
      }
    }

    log('\n' + '='.repeat(70) + '\n', 'blue');
    return true;
  } catch (err) {
    log(`\n❌ Error: ${err.message}`, 'red');
    return false;
  }
}

// ============================================================================
// MIGRATE
// ============================================================================

async function migrate(dryRun = false, verbose = false, limit = null) {
  try {
    const Messages = require('#models/messages');

    log('\n' + '='.repeat(70), 'blue');
    log('   PGP Encrypted Message Repair Migration', 'blue');
    log('='.repeat(70), 'blue');

    if (dryRun) {
      log('\n🧪 DRY RUN MODE - No changes will be made', 'yellow');
    }

    log('\n🔍 Searching for affected messages...', 'blue');

    const query = {
      created_at: {
        $gte: new Date('2026-02-02'),
        $lte: new Date('2026-02-07')
      },
      'attachments': {
        $elemMatch: {
          filename: 'encrypted.asc',
          contentType: 'application/octet-stream',
          size: { $lt: 100 }
        }
      }
    };

    const totalCount = await Messages.countDocuments(query);
    const messagesToProcess = limit ? Math.min(limit, totalCount) : totalCount;

    log(`Found ${totalCount} messages`, 'yellow');
    log(`Processing ${messagesToProcess} messages\n`, 'yellow');

    let processedCount = 0;
    let repairedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    const batchSize = 100;

    for (let skip = 0; skip < messagesToProcess; skip += batchSize) {
      const batch = await Messages.find({ ...query })
        .limit(batchSize)
        .skip(skip)
        .lean();

      if (batch.length > 0) {
        for (const message of batch) {
        processedCount++;
        const progressBar = `[${processedCount}/${messagesToProcess}]`.padEnd(15);

        try {
          const encryptedAttachment = message.attachments?.find(
            (a) =>
              a.filename === 'encrypted.asc' &&
              a.contentType === 'application/octet-stream' &&
              a.size < 100
          );

          if (encryptedAttachment) {
            const extractedPayload = extractEncryptedPayloadFromRaw(message.raw);

            if (extractedPayload && typeof extractedPayload === 'string' && extractedPayload.length > 100 && extractedPayload.includes('BEGIN PGP MESSAGE')) {
              if (verbose) {
                log(`  Message ID: ${message._id}`, 'gray');
                log(`  Subject: ${message.subject || '(none)'}`, 'gray');
                log(`  Payload size: ${extractedPayload.length} bytes`, 'gray');
              }

              if (dryRun) {
                logResult('SUCCESS', `${progressBar} Would repair (${extractedPayload.length} bytes) [DRY RUN]`);
              } else {
                encryptedAttachment.size = extractedPayload.length;
                encryptedAttachment.content = extractedPayload;

                await Messages.findByIdAndUpdate(
                  message._id,
                  { attachments: message.attachments },
                  { new: true }
                );

                logResult('SUCCESS', `${progressBar} Repaired (${extractedPayload.length} bytes)`);
              }

              repairedCount++;
            } else {
              logResult('FAIL', `${progressBar} Extraction failed`);
              if (verbose) {
                log(`  Message ID: ${message._id}`, 'gray');
                log(`  Subject: ${message.subject || '(none)'}`, 'gray');
              }
              failedCount++;
            }
          } else {
            logResult('SKIP', `${progressBar} Not found (already fixed?)`);
            skippedCount++;
          }
        } catch (err) {
          logResult('ERROR', `${progressBar} ${err.message}`);
          failedCount++;
        }
      }
      }
    }

    log('\n' + '='.repeat(70), 'blue');
    log('   RESULTS', 'blue');
    log('='.repeat(70), 'blue');

    log(`\n📊 Summary:`, 'blue');
    log(`  ✓ Processed:  ${processedCount}`, 'reset');
    log(`  ✓ Repaired:   ${repairedCount}`, 'green');
    log(`  ⊘ Skipped:    ${skippedCount}`, 'gray');
    log(`  ✗ Failed:     ${failedCount}`, failedCount === 0 ? 'green' : 'red');

    if (dryRun) {
      log(`\n💡 Re-run without --dry-run to apply changes.`, 'yellow');
    }

    log('\n' + '='.repeat(70) + '\n', 'blue');

    return failedCount > 0 ? false : true;
  } catch (err) {
    log(`\n❌ Error: ${err.message}`, 'red');
    return false;
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  const showHelp = () => {
    log('\n' + '='.repeat(70), 'blue');
    log('   repair-encrypted-messages.js', 'blue');
    log('='.repeat(70), 'blue');
    log('\nUsage:', 'blue');
    log('  node scripts/repair-encrypted-messages.js test              - Run unit tests', 'reset');
    log('  node scripts/repair-encrypted-messages.js status            - Check message count', 'reset');
    log('  node scripts/repair-encrypted-messages.js status --detailed - Show detailed stats', 'reset');
    log('  node scripts/repair-encrypted-messages.js migrate --dry-run - Preview changes', 'reset');
    log('  node scripts/repair-encrypted-messages.js migrate           - Apply repairs', 'reset');
    log('\nOptions:', 'blue');
    log('  --dry-run    Don\'t update database, just preview', 'reset');
    log('  --verbose    Show detailed logs', 'reset');
    log('  --limit N    Process only N messages', 'reset');
    log('  --detailed   Show detailed statistics (status command)', 'reset');
    log('  --sample N   Show N sample messages (default: 5)', 'reset');
    log('\n' + '='.repeat(70) + '\n', 'blue');
  };

  if (command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  if (typeof command !== 'string' || command.length === 0) {
    showHelp();
    process.exit(0);
  }

  try {
    if (command === 'test') {
      const success = runTests();
      process.exit(success ? 0 : 1);
    } else if (command === 'status') {
      const detailed = args.includes('--detailed');
      const sampleIndex = args.indexOf('--sample');
      const sampleSize = sampleIndex !== -1 ? parseInt(args[sampleIndex + 1], 10) : 5;

      const success = await checkStatus(detailed, sampleSize);
      process.exit(success ? 0 : 1);
    } else if (command === 'migrate') {
      const dryRun = args.includes('--dry-run');
      const verbose = args.includes('--verbose');
      const limitIndex = args.indexOf('--limit');
      const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : null;

      const success = await migrate(dryRun, verbose, limit);
      process.exit(success ? 0 : 1);
    } else {
      log(`\n❌ Unknown command: ${command}`, 'red');
      log('Run with --help for usage information\n', 'reset');
      process.exit(1);
    }
  } catch (err) {
    log(`\n❌ Error: ${err.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runTests, checkStatus, migrate };
