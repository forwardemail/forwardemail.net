/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isNativeAccelerationEnabled, Packr, Unpackr } = require('msgpackr');

const logger = require('./logger');

// <https://github.com/kriszyp/msgpackr?tab=readme-ov-file#options>
const options = { moreTypes: true };

const packr = new Packr(options);
const unpackr = new Unpackr(options);

// <https://github.com/kriszyp/msgpackr?tab=readme-ov-file#native-acceleration>
if (!isNativeAccelerationEnabled)
  logger.fatal(
    new TypeError('Native acceleration is not enabled for msgpackr')
  );

/*
//
// NOTE: @msgpack/msgpack is slower than msgpackr
//
const { Encoder, Decoder, ExtensionCodec } = require('@msgpack/msgpack');

// https://github.com/msgpack/msgpack-javascript?tab=readme-ov-file#extension-types
const extensionCodec = new ExtensionCodec();

const encoder = new Encoder({ useBigInt64: true, extensionCodec });
const decoder = new Decoder({ useBigInt64: true, extensionCodec });

// Set
const SET_EXT_TYPE = 0; // Any in 0-127
extensionCodec.register({
  type: SET_EXT_TYPE,
  encode(object) {
    if (object instanceof Set) {
      console.log('object was a set', object);
      return encoder.encode([...object]);
    }

    return null;
  },
  decode(data) {
    const array = decoder.decode(data);
    return new Set(array);
  }
});

// Map
const MAP_EXT_TYPE = 1; // Any in 0-127
extensionCodec.register({
  type: MAP_EXT_TYPE,
  encode(object) {
    if (object instanceof Map) {
      console.log('object was a map', object);
      return encoder.encode([...object]);
    }

    return null;
  },
  decode(data) {
    const array = decoder.decode(data);
    return new Map(array);
  }
});
*/

// NOTE: this is extremely slow
// const encoder = { encode: JSON.stringify };
// const decoder = { decode: JSON.parse };

module.exports = { encoder: packr, decoder: unpackr };
