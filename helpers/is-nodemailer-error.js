function isNodemailerError(err) {
  return (
    err.message === 'Timeout' ||
    err.message === 'Connection closed' ||
    err.message === 'Connection closed unexpectedly' ||
    err.message === 'Socket closed unexpectedly' ||
    err.message === 'Unexpected socket close'
  );
}

module.exports = isNodemailerError;
