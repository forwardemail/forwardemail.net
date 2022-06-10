const cryptoRandomString = require('crypto-random-string');
const slug = require('speakingurl');
const isSANB = require('is-string-and-not-blank');

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

async function test(ctx) {
  const label = isSANB(ctx.query.label) ? slug(ctx.query.label) : 'alias';
  const str = await cryptoRandomString.async({ length: 10, characters });
  ctx.body = `${label}+${str}@forwardemail.net`;
}

module.exports = test;
