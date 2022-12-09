const RE2 = require('re2');
const _ = require('lodash');
const accounting = require('accounting');
const ajc = require('array-join-conjunction');
const capitalize = require('capitalize');
const dashify = require('dashify');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isBot = require('isbot');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const numeral = require('numeral');
const pluralize = require('pluralize');
const splitLines = require('split-lines');
const striptags = require('striptags');
const titleize = require('titleize');
const toEmoji = require('gemoji/name-to-emoji');
const validator = require('validator');
const { boolean } = require('boolean');
const { parse } = require('node-html-parser');

const json = (string, replacer = null, space = 2) =>
  JSON.stringify(string, replacer, space);

const emoji = (string) => toEmoji[string] || '';

//
// this is useful for emails when we're rendering HTML
// with links from error messages in our application
// (in order to prepend them with our website URL)
//
function prefixHTMLPathBasedAnchors(html, baseURI) {
  if (!baseURI) throw new Error('baseURI missing');

  const root = parse(html);
  const links = root.querySelectorAll('a');
  for (const link of links) {
    const href = link.getAttribute('href');
    if (href.indexOf('/') === 0) {
      link.setAttribute('href', baseURI + href);
    }
  }

  return root.toString();
}

//
// virtual name server provider
//
// TODO: move this to its own DB or a config file
// TODO: ensure all of these are added to FAQ
// NOTE: we might want to sort FAQ or pre-select or highlight/bump
// NOTE: anyone not using these providers we can flag for review
//
const NS_PROVIDERS = {
  awsdns: [
    'Amazon Route 53',
    'https://console.aws.amazon.com/route53/',
    false,
    ''
  ],
  azure: ['Azure', 'https://portal.azure.com/'],
  'cloudflare.com': [
    'Cloudflare',
    'https://dash.cloudflare.com/login',
    'cloudflare',
    '@'
  ],
  'dnsmadeeasy.com': ['DNS Made Easy', 'https://auth.dnsmadeeasy.com/'],
  'domaincontrol.com': [
    'GoDaddy',
    'https://sso.godaddy.com/?realm=idp&app=dashboard.api&path=%2fvh-login-redirect',
    'godaddy',
    '@'
  ],
  'dns-for-domains.com': [
    'Domains.com',
    'https://domains.com/',
    'domains.com',
    '@'
  ],
  'gandi.net': ['Gandi.net', 'https://id.gandi.net/login'],
  'googledomains.com': [
    'Google Domains',
    'https://domains.google.com/registrar/',
    'google',
    ''
  ],
  'name.com': [
    'Name.com',
    'https://www.name.com/account/login',
    'name.com',
    ''
  ],
  'nsone.net': ['NS1', 'https://ns1.com/'],
  'registrar-servers.com': [
    'Namecheap',
    'https://www.namecheap.com/myaccount/login/?ReturnUrl=%2f#',
    'namecheap',
    '@'
  ],
  'wixdns.net': ['Wix', 'https://users.wix.com/signin?forceRender=true']
};

const NS_PROVIDER_KEYS = Object.keys(NS_PROVIDERS);
const NS_PROVIDER_REGEXES = NS_PROVIDER_KEYS.map((key) => new RE2(key, 'gi'));

function nsProviderLookup(domain) {
  // return early if there were no NS providers set
  if (!domain.ns || domain.ns.length === 0) return;

  let provider;

  for (const [i, NS_PROVIDER_REGEX] of NS_PROVIDER_REGEXES.entries()) {
    if (domain.ns.some((r) => NS_PROVIDER_REGEX.test(r))) {
      const [name, url, gif, host] = NS_PROVIDERS[NS_PROVIDER_KEYS[i]];
      provider = { name, url, gif, host };
      break;
    }
  }

  return provider;
}

module.exports = {
  _,
  nsProviderLookup,
  ajc,
  boolean,
  capitalize,
  dashify,
  dayjs,
  emoji,
  humanize,
  isBot,
  isFQDN,
  isSANB,
  json,
  numeral,
  pluralize,
  striptags,
  titleize,
  validator,
  prefixHTMLPathBasedAnchors,
  accounting,
  splitLines
};
