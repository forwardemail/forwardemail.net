// <https://stackoverflow.com/a/46946490>
function splitSpaces(str) {
  // eslint-disable-next-line unicorn/no-array-reduce
  return str.match(/\\?.|^$/g).reduce(
    (p, c) => {
      if (c === '"') {
        // eslint-disable-next-line no-bitwise
        p.quote ^= 1;
      } else if (!p.quote && c === ' ') {
        p.a.push('');
      } else {
        p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1');
      }

      return p;
    },
    { a: [''] }
  ).a;
}

module.exports = splitSpaces;
