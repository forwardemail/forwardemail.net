module.exports = {
  plugins: [
    'preset-github',
    [
      'remark-license',
      {
        file: 'https://github.com/forwardemail/forwardemail.net/blob/master/LICENSE'
      }
    ]
  ]
};
