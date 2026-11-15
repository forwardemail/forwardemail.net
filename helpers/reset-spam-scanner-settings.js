/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout } = require('node:timers/promises');

const ms = require('ms');

const Domains = require('#models/domains');

// (kept for good in MongoDB once the settings were reset, so owners who turn
//  them back on keep them, also when Redis is emptied)
const ID = 'spam_scanner_settings_reset';

// (a claim not renewed by then is taken again: its process stopped, e.g.
//  restarted by a deploy, before the reset was done; it is renewed with
//  every batch)
const STALE = ms('1h');

// domains read at a time, in the order of their ids, and the pause after
// each batch, so the reset never holds the database for long: as one update
// of every domain, it filled MongoDB's cache and stalled it
const BATCH_SIZE = 1000;
const PAUSE = ms('100ms');

// the domains to change
const FILTER = {
  $or: [
    { has_adult_content_protection: { $ne: false } },
    { has_phishing_protection: false },
    { has_virus_protection: false }
  ]
};

function isToChange(domain) {
  return (
    domain.has_adult_content_protection !== false ||
    domain.has_phishing_protection === false ||
    domain.has_virus_protection === false
  );
}

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
// Returns the domains changed in all (also by runs it went on from), or null
// when it was done, or is being done by another process.
//
async function resetSpamScannerSettings({
  batchSize = BATCH_SIZE,
  pause = PAUSE
} = {}) {
  // (claimed by one process: another, or a later start, finds it done, or
  //  being done, unless that claim is stale, see `STALE`)
  let claim = new Date();
  let lastId = null;
  let modified = 0;
  try {
    await migrations().insertOne({ _id: ID, started_at: claim });
  } catch (err) {
    if (err.code !== 11000) throw err;
    const claimed = await migrations().findOneAndUpdate(
      {
        _id: ID,
        finished_at: { $exists: false },
        started_at: { $lt: new Date(claim.getTime() - STALE) }
      },
      { $set: { started_at: claim } }
    );
    // (the claim taken, or null: the document, or, as MongoDB's driver 4
    //  answers, its `value`)
    const taken = claimed && 'ok' in claimed ? claimed.value : claimed;
    if (!taken) return null;
    // (going on from where the run before it stopped)
    lastId = taken.last_id || null;
    modified = Number(taken.modified) || 0;
  }

  try {
    for (;;) {
      const domains = await Domains.find({
        ...(lastId ? { _id: { $gt: lastId } } : {})
      })
        .select(
          '_id has_adult_content_protection has_phishing_protection has_virus_protection'
        )
        .sort({ _id: 1 })
        .limit(batchSize)
        .lean()
        .exec();
      if (domains.length === 0) break;
      lastId = domains.at(-1)._id;

      const ids = domains
        .filter((domain) => isToChange(domain))
        .map(({ _id }) => _id);
      if (ids.length > 0) {
        // (and only while still to change: not one an owner changed since)

        const result = await Domains.updateMany(
          { _id: { $in: ids }, ...FILTER },
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
        modified += result.modifiedCount;
      }

      // (where it is, with its claim renewed; only its own claim: one taken
      //  from it as stale is the other process's, which goes on from here)
      const renewed = new Date();

      const saved = await migrations().updateOne(
        { _id: ID, started_at: claim },
        { $set: { started_at: renewed, last_id: lastId, modified } }
      );
      if (saved.matchedCount === 0) return null;
      claim = renewed;

      if (domains.length < batchSize) break;

      if (pause > 0) await setTimeout(pause);
    }

    await migrations().updateOne(
      { _id: ID, started_at: claim },
      { $set: { finished_at: new Date(), modified } }
    );
    return modified;
  } catch (err) {
    // (given up, so the next run takes it at once and goes on from the last
    //  batch saved, unless another process took it)
    await migrations().updateOne(
      { _id: ID, started_at: claim },
      { $set: { started_at: new Date(0) } }
    );
    throw err;
  }
}

resetSpamScannerSettings.ID = ID;
resetSpamScannerSettings.migrations = migrations;

module.exports = resetSpamScannerSettings;
