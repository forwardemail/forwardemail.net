/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const _ = require('#helpers/lodash');

function toObject(Model, doc) {
  if (_.isUndefined(Model) || _.isUndefined(doc))
    throw new Error('Model and doc are required');
  if (mongoose.isObjectIdOrHexString(doc)) return doc;
  if (_.isFunction(doc.toObject)) return doc.toObject();
  return new Model(doc).toObject();
}

module.exports = toObject;
