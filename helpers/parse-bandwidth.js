/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const UNIT_BYTES = {
  B: 1,
  KB: 1000,
  MB: 1000 ** 2,
  GB: 1000 ** 3,
  TB: 1000 ** 4
};

function parseBandwidth(value) {
  if (typeof value === 'number') {
    if (Number.isFinite(value) && value > 0) return Math.floor(value);
    throw new TypeError('Bandwidth must be a positive number');
  }

  if (typeof value !== 'string') {
    throw new TypeError('Bandwidth must be a positive number or string');
  }

  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb|tb)\/s$/i);

  if (!match) {
    throw new TypeError(
      'Bandwidth must use decimal byte units, for example "62.5MB/s"'
    );
  }

  const amount = Number.parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  const bytesPerSecond = Math.floor(amount * UNIT_BYTES[unit]);

  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) {
    throw new TypeError('Bandwidth must be greater than zero');
  }

  return bytesPerSecond;
}

module.exports = parseBandwidth;
