/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Adult content protection is turned off for every domain once (it is off
// by default now), and phishing and virus protection back on, as they are no
// longer settings; an owner who turns adult content protection on again
// keeps it.
//
// (serial: both change the domains and migrations collections)
//

const mongoose = require('mongoose');
const test = require('ava');

const utils = require('../utils');

const Domains = require('#models/domains');
const resetSpamScannerSettings = require('#helpers/reset-spam-scanner-settings');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

const settings = (doc) => ({
  adult: doc.has_adult_content_protection,
  phishing: doc.has_phishing_protection,
  executable: doc.has_executable_protection,
  virus: doc.has_virus_protection
});

test.serial(
  'turns adult content protection off once, and phishing and virus protection on',
  async (t) => {
    await resetSpamScannerSettings.migrations().deleteMany({});
    // (as domains were kept with the defaults before, and as owners set them)
    const before = {
      has_adult_content_protection: true,
      has_phishing_protection: true,
      has_executable_protection: true,
      has_virus_protection: true
    };
    const ids = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ];
    await Domains.collection.insertMany([
      { _id: ids[0], name: 'one.example.com', ...before },
      {
        _id: ids[1],
        name: 'two.example.com',
        has_adult_content_protection: false,
        has_phishing_protection: false,
        has_executable_protection: false,
        has_virus_protection: false
      },
      { _id: ids[2], name: 'three.example.com' }
    ]);
    const read = async (id) =>
      settings(await Domains.collection.findOne({ _id: id }));

    t.is(await resetSpamScannerSettings(), 3);
    t.deepEqual(await read(ids[0]), {
      adult: false,
      phishing: true,
      executable: true,
      virus: true
    });
    // (executable protection as it was)
    t.deepEqual(await read(ids[1]), {
      adult: false,
      phishing: true,
      executable: false,
      virus: true
    });
    t.like(await read(ids[2]), { adult: false, phishing: true, virus: true });

    // an owner turns adult content protection on again: it stays on
    await Domains.collection.updateOne(
      { _id: ids[0] },
      { $set: { has_adult_content_protection: true } }
    );
    t.is(await resetSpamScannerSettings(), null);
    const kept = await read(ids[0]);
    t.true(kept.adult);

    // (claimed by one process when two start at once)
    await resetSpamScannerSettings.migrations().deleteMany({});
    const both = await Promise.all([
      resetSpamScannerSettings(),
      resetSpamScannerSettings()
    ]);
    t.is(both.filter((value) => value === null).length, 1);
    // (and no change of the owner's to sort by)
    const doc = await Domains.collection.findOne({ _id: ids[0] });
    t.is(doc.updated_at, undefined);

    await Domains.collection.deleteMany({ _id: { $in: ids } });
  }
);

test.serial('is tried again the next time when it fails', async (t) => {
  await resetSpamScannerSettings.migrations().deleteMany({});
  const { updateMany } = Domains;
  Domains.updateMany = async () => {
    throw new Error('boom');
  };

  try {
    await t.throwsAsync(resetSpamScannerSettings(), { message: 'boom' });
  } finally {
    Domains.updateMany = updateMany;
  }

  const done = () =>
    resetSpamScannerSettings
      .migrations()
      .findOne({ _id: resetSpamScannerSettings.ID });
  t.is(await done(), null);
  t.is(typeof (await resetSpamScannerSettings()), 'number');
  t.truthy(await done());
});

test.serial(
  'is taken again when a process stopped before it was done',
  async (t) => {
    const migrations = resetSpamScannerSettings.migrations();
    await migrations.deleteMany({});
    const id = new mongoose.Types.ObjectId();
    await Domains.collection.insertOne({
      _id: id,
      name: 'stopped.example.com',
      has_adult_content_protection: true
    });
    t.teardown(() => Domains.collection.deleteOne({ _id: id }));

    // (one claimed just now, still being done, is left to its process)
    await migrations.insertOne({
      _id: resetSpamScannerSettings.ID,
      started_at: new Date()
    });
    t.is(await resetSpamScannerSettings(), null);

    // (one claimed two hours ago and never finished is done again)
    await migrations.updateOne(
      { _id: resetSpamScannerSettings.ID },
      { $set: { started_at: new Date(Date.now() - 2 * 60 * 60 * 1000) } }
    );
    t.true((await resetSpamScannerSettings()) >= 1);
    const domain = await Domains.collection.findOne({ _id: id });
    t.false(domain.has_adult_content_protection);
    const record = await migrations.findOne({
      _id: resetSpamScannerSettings.ID
    });
    t.truthy(record.finished_at);
  }
);

test.serial(
  'a process whose claim was taken from it as stale leaves the new claim alone',
  async (t) => {
    const migrations = resetSpamScannerSettings.migrations();
    await migrations.deleteMany({});
    const { updateMany } = Domains;
    const taken = new Date(Date.now() + 60_000);
    // (while it resets, another process takes its claim, then it fails)
    Domains.updateMany = async () => {
      await migrations.updateOne(
        { _id: resetSpamScannerSettings.ID },
        { $set: { started_at: taken } }
      );
      throw new Error('stopped');
    };

    try {
      await t.throwsAsync(resetSpamScannerSettings(), { message: 'stopped' });
    } finally {
      Domains.updateMany = updateMany;
    }

    const record = await migrations.findOne({
      _id: resetSpamScannerSettings.ID
    });
    t.deepEqual(record.started_at, taken);
    await migrations.deleteMany({});
  }
);
