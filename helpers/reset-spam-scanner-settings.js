/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const Domains = require('#models/domains');

// (kept for good in MongoDB once the settings were reset, so owners who turn
//  them back on keep them, also when Redis is emptied)
const ID = 'spam_scanner_settings_reset';

// (a claim not finished by then is taken again: its process stopped, e.g.
//  restarted by a deploy, before the reset was done)
const STALE = ms('1h');

function migrations() {
  return Domains.db.collection('migrations');
}

//
// Turn adult content protection off for every domain, once: a link to a host
// Cloudflare blocks for adult content no longer blocks mail by default, only
// where an owner turns it on again (see `protectionOf` in
// `helpers/spam-scanner.js`); and turn phishing and virus protection back on
// where they were off, as they are no longer settings (phishing and malware
// links are always blocked, viruses whenever ClamAV is turned on)
//
async function resetSpamScannerSettings() {
  // (claimed by one process: another, or a later start, finds it done, or
  //  being done, unless that claim is stale, see `STALE`)
  const now = new Date();
  try {
    await migrations().insertOne({ _id: ID, started_at: now });
  } catch (err) {
    if (err.code !== 11000) throw err;
    const claimed = await migrations().findOneAndUpdate(
      {
        _id: ID,
        finished_at: { $exists: false },
        started_at: { $lt: new Date(now.getTime() - STALE) }
      },
      { $set: { started_at: now } }
    );
    // (the claim taken, or null: the document, or, as MongoDB's driver 4
    //  answers, its `value`)
    const taken = claimed && 'ok' in claimed ? claimed.value : claimed;
    if (!taken) return null;
  }

  try {
    const result = await Domains.updateMany(
      {
        $or: [
          { has_adult_content_protection: { $ne: false } },
          { has_phishing_protection: false },
          { has_virus_protection: false }
        ]
      },
      {
        $set: {
          has_adult_content_protection: false,
          has_phishing_protection: true,
          has_virus_protection: true
        }
      },
      // (no change of the owner's to sort or notify by)
      { timestamps: false }
    );
    // (only its own claim: one taken from it as stale is the other's; a
    //  process stopped between the reset and this is taken again, which
    //  turns off what an owner turned on since, within the hour)
    await migrations().updateOne(
      { _id: ID, started_at: now },
      { $set: { finished_at: new Date(), modified: result.modifiedCount } }
    );
    return result.modifiedCount;
  } catch (err) {
    // (tried again the next time it runs)
    await migrations().deleteOne({ _id: ID, started_at: now });
    throw err;
  }
}

resetSpamScannerSettings.ID = ID;
resetSpamScannerSettings.migrations = migrations;

module.exports = resetSpamScannerSettings;
