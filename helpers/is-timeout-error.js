function isTimeoutError(err) {
  if (typeof err !== 'object') return false;

  if (err.name === 'TimeoutError' || err.name === 'AbortError') return true;

  for (const key of ['message', 'response']) {
    if (typeof err[key] !== 'string') continue;
    if (
      err[key].includes('Request aborted') ||
      err[key].includes('Timeout') ||
      err[key].includes('Request Time-out') ||
      err[key].includes('Timeout - closing connection')
    )
      return true;
  }

  return false;
}

module.exports = isTimeoutError;
