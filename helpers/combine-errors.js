function combineErrors(errors) {
  let err;
  if (errors.length === 1) {
    err = errors[0];
  } else {
    err = new Error(
      [...new Set(errors.map((e) => e.message).filter(Boolean))].join('; ')
    );

    //
    // TODO: group together stack traces (since could be multiple of same and cause pollution)
    //
    //
    // NOTE: stack is unique by all lines after the first
    //       (if all are the same, then rewrite the first one with new err.message) and return first
    // if (
    //   errors.every(
    //     (e) =>
    //       errors[0].stack.split('\n').slice(1).join('\n') ===
    //       e.stack.split('\n').slice(1).join('\n')
    //   )
    // ) {
    //   err.stack =
    //     err.message + '\n' + errors[0].stack.split('\n').slice(1).join('\n');
    // } else {
    //   err.stack = [...new Set(errors.map((e) => e.stack).filter(Boolean))].join(
    //     '\n\n'
    //   );
    // }
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
