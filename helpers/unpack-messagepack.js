/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function isRecoverableMessagePackError(error) {
  const message = error?.message;
  return (
    typeof message === 'string' &&
    (message.includes('Unexpected end of buffer') ||
      message.includes('Unexpected end of data'))
  );
}

function unpackMessagePack(decoder, data, logger) {
  try {
    return decoder.unpack(data);
  } catch (err) {
    if (!isRecoverableMessagePackError(err)) throw err;

    // A reconnect race or partially delivered transport frame must not turn
    // into a process-level error or resolve a pending request incorrectly.
    logger.warn('Dropping incomplete MessagePack WebSocket frame', {
      err,
      size: typeof data?.byteLength === 'number' ? data.byteLength : undefined
    });
    return undefined;
  }
}

module.exports = { isRecoverableMessagePackError, unpackMessagePack };
