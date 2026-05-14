/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Detect whether an error is a BSON serialization overflow.
 *
 * bson@4.7.2 uses a 17 MiB scratch buffer and throws a RangeError
 * with code ERR_OUT_OF_RANGE when a document exceeds it.
 * The MongoDB server returns codeName 'BSONObjectTooLarge' for
 * documents that exceed the 16 MiB BSON limit.
 *
 * @param {Error} err
 * @returns {boolean}
 */
function isBsonOverflow(err) {
  if (!err) return false;
  if (
    err.code === 'ERR_OUT_OF_RANGE' ||
    (err.name === 'RangeError' &&
      err.message &&
      err.message.includes('out of range'))
  )
    return true;
  if (err.codeName === 'BSONObjectTooLarge') return true;
  if (err.message && err.message.includes('BSONObjectTooLarge')) return true;
  // MongoDB server-side rejection when the resulting document would exceed
  // the 16 MiB BSON limit (error code 10334, "BSONObj size ... is invalid").
  if (err.code === 10334) return true;
  if (
    err.message &&
    err.message.includes('BSONObj size') &&
    err.message.includes('is invalid')
  )
    return true;
  // Client-side bson serializer buffer overflow ("offset is out of bounds")
  if (
    err.name === 'RangeError' &&
    err.message &&
    err.message.includes('offset is out of bounds')
  )
    return true;
  return false;
}

module.exports = isBsonOverflow;
