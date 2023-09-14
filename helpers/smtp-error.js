class SMTPError extends Error {
  constructor(message, options = {}, ...args) {
    super(message, options, ...args);
    Error.captureStackTrace(this, SMTPError);
    this.responseCode = options?.responseCode || 550;
    if (options.ignoreHook === true) this.ignoreHook = true;
  }
}

module.exports = SMTPError;
