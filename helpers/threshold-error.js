const combineErrors = require('./combine-errors');

class ThresholdError extends Error {
  constructor(...args) {
    super(...args);
    const err = combineErrors(args[0]);
    this.message = err.message;
    this.stack = err.stack;
    if (err.errors) this.errors = err.errors;
  }
}

module.exports = ThresholdError;
