const isSANB = require('is-string-and-not-blank');

const markdown = require('../helpers/markdown');
const i18n = require('../helpers/i18n');

module.exports = {
  md: (string, options) => {
    if (!isSANB(options.locale))
      return `<div class="markdown-body">${markdown.render(string)}</div>`;
    return `<div class="markdown-body">${i18n.api.t({
      phrase: markdown.render(string),
      locale: options.locale
    })}</div>`;
  }
};
