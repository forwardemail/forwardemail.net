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
  const id = new mongoose.Types.ObjectId();
  await Domains.collection.insertOne({
    _id: id,
    name: 'failed.example.com',
    has_adult_content_protection: true
  });
  t.teardown(() => Domains.collection.deleteOne({ _id: id }));
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
  // (given up, so the next run takes it at once)
  const failed = await done();
  t.is(failed.finished_at, undefined);
  t.is(await resetSpamScannerSettings(), 1);
  const finished = await done();
  t.truthy(finished.finished_at);
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
    const id = new mongoose.Types.ObjectId();
    await Domains.collection.insertOne({
      _id: id,
      name: 'taken.example.com',
      has_adult_content_protection: true
    });
    t.teardown(() => Domains.collection.deleteOne({ _id: id }));
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

// (domains to change, by id in increasing order)
async function insertDomains(t, count) {
  const ids = Array.from(
    { length: count },
    () => new mongoose.Types.ObjectId()
  );
  await Domains.collection.insertMany(
    ids.map((_id, i) => ({
      _id,
      // (unique, as the model sets it)
      id: _id.toString(),
      name: `batch-${i}.example.com`,
      has_adult_content_protection: true
    }))
  );
  t.teardown(() => Domains.collection.deleteMany({ _id: { $in: ids } }));
  return ids;
}

test.serial(
  'changes the domains a batch at a time, never all of them in one update',
  async (t) => {
    await resetSpamScannerSettings.migrations().deleteMany({});
    const ids = await insertDomains(t, 5);
    const updates = [];
    mongoose.set('debug', (collection, method, query) => {
      if (collection === Domains.collection.name && method === 'updateMany')
        updates.push(query);
    });
    t.teardown(() => mongoose.set('debug', false));

    t.is(await resetSpamScannerSettings({ batchSize: 2, pause: 0 }), 5);
    t.is(updates.length, 3);
    for (const query of updates) t.true(query._id.$in.length <= 2);
    const domains = await Domains.collection
      .find({ _id: { $in: ids } })
      .toArray();
    t.true(domains.every((domain) => !domain.has_adult_content_protection));
    // (and where it got to is kept)
    const record = await resetSpamScannerSettings
      .migrations()
      .findOne({ _id: resetSpamScannerSettings.ID });
    t.deepEqual(record.last_id, ids.at(-1));
    t.is(record.modified, 5);
  }
);

test.serial(
  'a run that stopped goes on from its last batch, not from the start',
  async (t) => {
    const migrations = resetSpamScannerSettings.migrations();
    await migrations.deleteMany({});
    const ids = await insertDomains(t, 4);
    const { updateMany } = Domains;
    let calls = 0;
    Domains.updateMany = function (...args) {
      if (++calls === 2) throw new Error('stopped');
      return updateMany.apply(this, args);
    };

    try {
      await t.throwsAsync(
        resetSpamScannerSettings({ batchSize: 2, pause: 0 }),
        { message: 'stopped' }
      );
    } finally {
      Domains.updateMany = updateMany;
    }

    const adult = async (id) => {
      const domain = await Domains.collection.findOne({ _id: id });
      return domain.has_adult_content_protection;
    };

    // (the first batch was changed, the second not)
    t.false(await adult(ids[0]));
    t.true(await adult(ids[2]));

    // an owner turns adult content protection on again before the next run:
    // it is not turned off again, as its batch was done
    await Domains.collection.updateOne(
      { _id: ids[0] },
      { $set: { has_adult_content_protection: true } }
    );
    t.is(await resetSpamScannerSettings({ batchSize: 2, pause: 0 }), 4);
    t.true(await adult(ids[0]));
    t.false(await adult(ids[2]));
    t.false(await adult(ids[3]));
    const record = await migrations.findOne({
      _id: resetSpamScannerSettings.ID
    });
    t.truthy(record.finished_at);
  }
);
