/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');

const mongoose = require('mongoose');
const { Aliases } = require('#models');
const setupMongoose = require('#helpers/setup-mongoose');
const {
  detectInvisibleUnicode,
  getInvisibleUnicodeDetails
} = require('#helpers/detect-invisible-unicode');

const graceful = new Graceful({
  mongooses: [mongoose]
});

graceful.listen();

(async () => {
  await setupMongoose();

  console.log('Checking aliases for invisible Unicode characters...\n');

  let foundCount = 0;

  // Go through all aliases and check for invisible Unicode characters
  for await (const alias of Aliases.find({})
    .populate('user', 'email')
    .populate('domain', 'name')
    .lean()
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    let hasInvisibleChars = false;
    const issues = [];

    // Check alias name for invisible Unicode characters
    if (detectInvisibleUnicode(alias.name)) {
      hasInvisibleChars = true;
      const details = getInvisibleUnicodeDetails(alias.name);
      issues.push({
        field: 'name',
        value: alias.name,
        details
      });
    }

    // Check recipients for invisible Unicode characters
    if (alias.recipients && Array.isArray(alias.recipients)) {
      for (const [index, recipient] of alias.recipients.entries()) {
        if (detectInvisibleUnicode(recipient)) {
          hasInvisibleChars = true;
          const details = getInvisibleUnicodeDetails(recipient);
          issues.push({
            field: 'recipients',
            index,
            value: recipient,
            details
          });
        }
      }
    }

    // Check verified_recipients for invisible Unicode characters
    if (alias.verified_recipients && Array.isArray(alias.verified_recipients)) {
      for (const [index, recipient] of alias.verified_recipients.entries()) {
        if (detectInvisibleUnicode(recipient)) {
          hasInvisibleChars = true;
          const details = getInvisibleUnicodeDetails(recipient);
          issues.push({
            field: 'verified_recipients',
            index,
            value: recipient,
            details
          });
        }
      }
    }

    // Check pending_recipients for invisible Unicode characters
    if (alias.pending_recipients && Array.isArray(alias.pending_recipients)) {
      for (const [index, recipient] of alias.pending_recipients.entries()) {
        if (detectInvisibleUnicode(recipient)) {
          hasInvisibleChars = true;
          const details = getInvisibleUnicodeDetails(recipient);
          issues.push({
            field: 'pending_recipients',
            index,
            value: recipient,
            details
          });
        }
      }
    }

    if (hasInvisibleChars) {
      foundCount++;
      console.log(`Found alias with invisible Unicode characters:`);
      console.log(`  User Email: ${alias.user?.email || 'N/A'}`);
      console.log(`  Domain: ${alias.domain?.name || 'N/A'}`);
      console.log(`  Alias Name: ${alias.name}`);
      console.log(`  Alias ID: ${alias._id}`);

      for (const issue of issues) {
        console.log(
          `  Issue in ${issue.field}${
            issue.index === undefined ? '' : `[${issue.index}]`
          }:`
        );
        console.log(`    Value: "${issue.value}"`);
        console.log(`    Invisible characters found:`);
        for (const detail of issue.details) {
          console.log(
            `      - ${detail.name} (${detail.code}) at position ${detail.offset}`
          );
        }
      }

      console.log('');
    }
  }

  console.log(
    `\nScan complete. Found ${foundCount} aliases with invisible Unicode characters.`
  );

  process.exit(0);
})();
