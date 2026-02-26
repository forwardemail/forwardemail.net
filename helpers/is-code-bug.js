/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { boolean } = require('boolean');

const isErrorConstructorName = require('./is-error-constructor-name');
const isMongoError = require('./is-mongo-error');
const isRedisError = require('./is-redis-error');

const SYSCALLS = new Set([
  'spawn',
  'exec',
  'execve',
  'fork',
  'kill',
  'waitpid',
  'getpriority',
  'setpriority',
  'getuid',
  'setuid',
  'geteuid',
  'seteuid',
  'getgid',
  'setgid',
  'getegid',
  'setegid',
  'getrlimit',
  'setrlimit',
  'getpgid',
  'setpgid',
  'getsid',
  'setsid'
]);

function isCodeBug(err) {
  // exclude transient DNS reverse lookup failures (not a code bug)
  if (err.syscall === 'getHostByAddr') return false;

  const bool = boolean(
    // it was already marked as a code bug
    err.isCodeBug === true ||
      // syscalls
      // <https://github.com/Alex-D/check-disk-space/issues/33>
      (typeof err.syscall === 'string' && SYSCALLS.has(err.syscall)) ||
      // <https://nodejs.org/api/os.html#posix-error-constants>
      err.code === 'E2BIG' ||
      err.code === 'EACCES' ||
      err.code === 'EAFNOSUPPORT' ||
      err.code === 'EAGAIN' ||
      err.code === 'EALREADY' ||
      err.code === 'EBADF' ||
      err.code === 'EBADMSG' ||
      err.code === 'EBUSY' ||
      err.code === 'ECHILD' ||
      err.code === 'EDEADLK' ||
      err.code === 'EDESTADDRREQ' ||
      err.code === 'EDOM' ||
      err.code === 'EDQUOT' ||
      err.code === 'EEXIST' ||
      err.code === 'EFAULT' ||
      err.code === 'EFBIG' ||
      err.code === 'EIDRM' ||
      err.code === 'EILSEQ' ||
      err.code === 'EINPROGRESS' ||
      err.code === 'EINTR' ||
      err.code === 'EINVAL' ||
      err.code === 'EIO' ||
      err.code === 'EISCONN' ||
      err.code === 'EISDIR' ||
      err.code === 'ELOOP' ||
      err.code === 'EMFILE' ||
      err.code === 'EMLINK' ||
      err.code === 'EMSGSIZE' ||
      err.code === 'EMULTIHOP' ||
      err.code === 'ENAMETOOLONG' ||
      err.code === 'ENFILE' ||
      err.code === 'ENOBUFS' ||
      err.code === 'ENODEV' ||
      err.code === 'ENOENT' ||
      err.code === 'ENOEXEC' ||
      err.code === 'ENOLCK' ||
      err.code === 'ENOLINK' ||
      err.code === 'ENOMEM' ||
      err.code === 'ENOMSG' ||
      err.code === 'ENOPROTOOPT' ||
      err.code === 'ENOSPC' ||
      err.code === 'ENOSR' ||
      err.code === 'ENOSTR' ||
      err.code === 'ENOSYS' ||
      err.code === 'ENOTDIR' ||
      err.code === 'ENOTEMPTY' ||
      err.code === 'ENOTSUP' ||
      err.code === 'ENOTTY' ||
      err.code === 'ENXIO' ||
      err.code === 'EOPNOTSUPP' ||
      err.code === 'EOVERFLOW' ||
      err.code === 'EPERM' ||
      err.code === 'EPIPE' ||
      // NOTE: EPROTO is handled by isRetryableError (transient TLS/network issue)
      err.code === 'EPROTONOSUPPORT' ||
      err.code === 'EPROTOTYPE' ||
      err.code === 'ERANGE' ||
      err.code === 'EROFS' ||
      err.code === 'ESPIPE' ||
      err.code === 'ESRCH' ||
      err.code === 'ESTALE' ||
      err.code === 'ETIME' ||
      err.code === 'ETXTBSY' ||
      err.code === 'EWOULDBLOCK' ||
      err.code === 'EXDEV' ||
      // pug related
      err.babylonError ||
      err.component ||
      //
      // sqlite related
      //
      err.name === 'SqliteError' ||
      err.code === 'SQLITE_ERROR' ||
      // <https://github.com/WiseLibs/better-sqlite3/blob/007d43e229190618884a9f976909c0b14a17d82c/docs/api.md?plain=1#L611>
      (typeof err.code === 'string' &&
        err.code.startsWith('UNKNOWN_SQLITE_ERROR_')) ||
      // safeguard in case of sqlite errors
      (typeof err.code === 'string' && err.code.startsWith('SQLITE_')) ||
      isErrorConstructorName(err, 'SqliteError') ||
      //
      // javascript errors
      //
      isErrorConstructorName(err, 'TypeError') ||
      isErrorConstructorName(err, 'SyntaxError') ||
      isErrorConstructorName(err, 'ReferenceError') ||
      isErrorConstructorName(err, 'RangeError') ||
      isErrorConstructorName(err, 'URIError') ||
      isErrorConstructorName(err, 'EvalError') ||
      // redis error
      isRedisError(err) ||
      // mongo error
      isMongoError(err)
  );
  // safeguard
  err.isCodeBug = bool;
  return bool;
}

module.exports = isCodeBug;
