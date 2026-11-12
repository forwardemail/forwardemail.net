/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const test = require('ava');

const utils = require('../utils');

const { Logs } = require('#models');

//
// mongoose (patched in `patches/mongoose@6.13.10.patch`, GHSA-8332-j7wj-wjw4)
// wrote into whatever a document key named: a key called "toString" reached
// `Object.prototype.toString`, and gave it a `call` of its own. Every
// `Object.prototype.toString.call(value)` in the process threw after that,
// which is every query, until a restart.
//
test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

//
// Runs `fn`, and returns whether it left these functions as they were.
// (They are put back at once: with a `call` of their own, nothing that runs
// after this works, the reporting of this test included.)
//
function leavesPrototypeIntact(fn) {
  const inherited = [
    Object.prototype.toString,
    Object.prototype.valueOf,
    mongoose.Document.prototype.get
  ];
  try {
    fn();
  } catch {}

  const intact = inherited.every((value) => !Object.hasOwn(value, 'call'));
  for (const value of inherited) delete value.call;
  return intact;
}

test('a stored document cannot write into Object.prototype', async (t) => {
  // (written by something other than this model, which would drop the keys)
  const _id = new mongoose.Types.ObjectId();
  await Logs.collection.insertOne({
    _id,
    message: 'stored',
    toString: { call: 1 },
    valueOf: { call: 1 }
  });
  const stored = await Logs.findById(_id).lean();
  await Logs.collection.deleteOne({ _id });
  t.deepEqual(stored.toString, { call: 1 });

  // what a query does with each document it returns
  let log;
  t.true(
    leavesPrototypeIntact(() => {
      log = Logs.hydrate(stored);
    })
  );
  t.is(log.message, 'stored');
});

test('a dotted key cannot write into Object.prototype', (t) => {
  let log;
  t.true(
    leavesPrototypeIntact(() => {
      log = new Logs({ message: 'set', 'meta.toString.call': 1 });
      log.set('meta.valueOf.call', 1);
    })
  );
  t.is(log.message, 'set');
});

//
// The guard of 6.13.12 for the test above looks a key of a subdocument up in
// the data it holds. That drops a set through a nested path of a
// subdocument, and through a path the subdocument was loaded without,
// without an error; and it lets through a stored key named like a document
// method, and any key of plain data shaped like a document. The patch has
// that one guard ask the schema of a subdocument, and these hold.
//
const Sub = new mongoose.Schema({
  profile: { address: { city: String } }
});
const Parent = mongoose.model(
  'DependencyParent',
  new mongoose.Schema({
    name: { type: String, required: true },
    single: Sub,
    list: [Sub]
  })
);
// (subdocuments that keep keys their schema does not have)
const Loose = mongoose.model(
  'DependencyLoose',
  new mongoose.Schema({
    name: String,
    list: [new mongoose.Schema({ name: String }, { strict: false })]
  })
);

const PROFILE = { profile: { address: { city: 'first' } } };

function parent(sub = PROFILE, fields) {
  return Parent.hydrate(
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'parent',
      single: { _id: new mongoose.Types.ObjectId(), ...sub },
      list: [{ _id: new mongoose.Types.ObjectId(), ...sub }]
    },
    fields
  );
}

test('a path through a subdocument is still set', (t) => {
  const doc = parent();
  doc.set('single.profile.address.city', 'second');
  doc.set('list.0.profile.address.city', 'second');
  t.is(doc.single.profile.address.city, 'second');
  t.is(doc.list[0].profile.address.city, 'second');
  t.true(doc.isModified('single.profile.address.city'));
  t.true(doc.isModified('list.0.profile.address.city'));

  const created = new Parent({
    name: 'parent',
    'single.profile.address.city': 'second'
  });
  t.is(created.single.profile.address.city, 'second');
});

test('a path a subdocument was loaded without is still set', (t) => {
  // what a query with `.select('single._id list._id')` builds
  const doc = parent({}, { 'single._id': 1, 'list._id': 1 });
  doc.set('single.profile.address.city', 'second');
  doc.set('list.0.profile.address.city', 'second');
  t.is(doc.single.profile.address.city, 'second');
  t.is(doc.list[0].profile.address.city, 'second');
  t.true(doc.isModified('single.profile.address.city'));
  t.true(doc.isModified('list.0.profile.address.city'));
});

test('a stored key of a subdocument cannot write into a method', (t) => {
  t.true(
    leavesPrototypeIntact(() => {
      // (the first set of a path only looks its type up)
      parent().set('list.0.get.call', 1);
      parent({ get: { stored: 1 } }).set('list.0.get.call', 1);
    })
  );
});

test('a stored key outside the schema of a subdocument is still set', (t) => {
  const loose = () =>
    Loose.hydrate({
      _id: new mongoose.Types.ObjectId(),
      list: [{ _id: new mongoose.Types.ObjectId(), extra: { key: 'first' } }]
    });
  // (the first set of a path only looks its type up)
  loose().set('list.0.extra.key', 'second');
  const doc = loose();
  doc.set('list.0.extra.key', 'second');
  t.is(doc.get('list.0.extra.key'), 'second');
});

test('data shaped like a document cannot write into Object.prototype', (t) => {
  for (const meta of [
    { $__: 1, $__schema: { paths: { toString: 1 } } },
    { $__: 1, _doc: { toString: 1 } }
  ])
    t.true(
      leavesPrototypeIntact(() => {
        Logs.hydrate({
          _id: new mongoose.Types.ObjectId(),
          message: 'stored',
          meta
        }).set('meta.toString.call', 1);
      }),
      `${JSON.stringify(meta)}`
    );
});

test('a stored key cannot reach the parent of a subdocument', (t) => {
  const doc = new Loose({
    name: 'first',
    list: [{ name: 'first', $__parent: { name: 'stored' } }]
  });
  // (the first set of a path only looks its type up)
  doc.set('list.0.$__parent.name', 'second');
  doc.set('list.0.$__parent.name', 'second');
  t.is(doc.name, 'first');
});
