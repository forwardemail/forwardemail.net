function isTimeoutError(err) {
  if (err.name === 'TimeoutError' || err.name === 'AbortError') return true;

  if (
    err.message === 'Request aborted' ||
    err.message === 'Timeout' ||
    err.message === 'Request Time-out'
  )
    return true;

  return false;
}

module.exports = isTimeoutError;
