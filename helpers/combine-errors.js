function combineErrors(errors) {
  let err;
  if (errors.length === 1) {
    err = errors[0];
  } else {
    err = new Error(
      [...new Set(errors.map((e) => e.message).filter(Boolean))].join('; ')
    );
    err.stack = [...new Set(errors.map((e) => e.stack).filter(Boolean))].join(
      '\n\n'
    );
    err.errors = errors;
  }

  return err;
}

module.exports = combineErrors;
