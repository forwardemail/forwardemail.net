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
    // if all errors had `code` and they were all the same then preserve it
    if (
      typeof errors[0].code !== 'undefined' &&
      errors.every((e) => e.code === errors[0].code)
    )
      err.code = errors[0].code;

    // if all errors had `errno` and they were all the same then preserve it
    if (
      typeof errors[0].errno !== 'undefined' &&
      errors.every((e) => e.errno === errors[0].errno)
    )
      err.errno = errors[0].errno;

    // preserve original errors
    err.errors = errors;
  }

  return err;
}

module.exports = combineErrors;
