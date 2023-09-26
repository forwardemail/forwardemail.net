function isSocketError(err) {
  return Boolean(
    err.message === 'Connection closed' ||
      err.message === 'Connection pool was closed' ||
      err.message === 'Connection closed unexpectedly' ||
      err.message === 'Socket closed unexpectedly' ||
      err.message === 'Unexpected socket close' ||
      err.message === 'Timeout - closing connection' ||
      err.message.includes('socket is already destroyed') ||
      err.message.includes('socket is already half-closed')
  );
}

module.exports = isSocketError;
