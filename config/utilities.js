const fs = require('node:fs');
const path = require('node:path');

const RE2 = require('re2');
const _ = require('lodash');
const ajc = require('array-join-conjunction');
const ansiHTML = require('ansi-html-community');
const arrayJoinConjunction = require('array-join-conjunction');
const capitalize = require('capitalize');
const dashify = require('dashify');
const dayjs = require('dayjs-with-plugins');
const hljs = require('highlight.js');
const humanize = require('humanize-string');
const isBot = require('isbot');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const numeral = require('numeral');
const pluralize = require('pluralize');
const prettyMilliseconds = require('pretty-ms');
const shortID = require('mongodb-short-id');
const splitLines = require('split-lines');
const striptags = require('striptags');
const titleize = require('titleize');
const toEmoji = require('gemoji/name-to-emoji');
const validator = require('validator');
const { boolean } = require('boolean');
const { convert } = require('html-to-text');
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
    'amazon-route-53',
    'Amazon Route 53',
    'https://console.aws.amazon.com/route53/',
    false,
    ''
  ],
  azure: ['azure', 'Azure', 'https://portal.azure.com/'],
  'bigcommerce.com': [
    'bigcommerce',
    'BigCommerce',
    // <https://support.bigcommerce.com/s/article/Managing-DNS>
    false // 'https://login.bigcommerce.com/deep-links/settings/dns'
  ],
  'cloudflare.com': [
    'cloudflare',
    'Cloudflare',
    'https://dash.cloudflare.com/login',
    'cloudflare',
    '@'
  ],
  'digitalocean.com': [
    'digital-ocean',
    'Digital Ocean',
    // <https://docs.digitalocean.com/products/networking/dns/how-to/manage-records/>
    'https://cloud.digitalocean.com/',
    false,
    '@'
  ],
  'dnsmadeeasy.com': [
    'dns-made-easy',
    'DNS Made Easy',
    'https://auth.dnsmadeeasy.com/'
  ],
  'domaincontrol.com': [
    'godaddy',
    'GoDaddy',
    'https://sso.godaddy.com/?realm=idp&app=dashboard.api&path=%2fvh-login-redirect',
    'godaddy',
    '@',
    'https://www.youtube.com/watch?v=G7g8FiZL5D8'
  ],
  'dns-for-domains.com': [
    'domains.com',
    'Domains.com',
    'https://domains.com/',
    'domains.com',
    '@',
    'https://www.youtube.com/watch?v=WnU0Gp-Y-es'
  ],
  'gandi.net': [
    'gandi',
    'Gandi.net',
    'https://id.gandi.net/login',
    'gandi',
    ''
  ],
  'googledomains.com': [
    'google-domains',
    'Google Domains',
    'https://domains.google.com/registrar/',
    'google',
    '',
    'https://www.youtube.com/watch?v=01iHjbIN5CQ'
  ],
  dnspod: [
    'tencent-cloud-dnspod',
    'Tencent Cloud & DNSPod',
    // <https://www.tencentcloud.com/>
    'https://www.dnspod.com/login'
  ],
  hetzner: [
    'hetzner',
    'Hetzner',
    // <https://www.hetzner.com/dns-console>
    // <https://docs.hetzner.com/dns-console/dns/general/dns-overview/>
    'https://accounts.hetzner.com/login'
  ],
  'jimdo.com': [
    'jimdo',
    'Jimdo',
    // https://help.jimdo-dolphin.com/hc/en-us/articles/360032117291
    'https://account.e.jimdo.com/en/login'
  ],
  'ui-dns': [
    'ionos',
    'IONOS',
    'https://my.ionos.com/account-overview?&utm_source=helpcenter&utm_medium=knowledge&utm_campaign=4786&utm_term=account-overview&utm_content=deeplink&skipIntcpts=true'
    // https://www.ionos.com/help/email/troubleshooting-mail-basicmail-business/adjust-mx-records-for-receiving-email-via-ionos-mail-servers/
  ],
  'linode.com': [
    'linode-akamai',
    'Linode & Akamai',
    // <https://www.linode.com/docs/products/networking/dns-manager/guides/common-dns-configurations/>
    'https://login.linode.com/login',
    false,
    ''
  ],
  'name.com': [
    'name.com',
    'Name.com',
    'https://www.name.com/account/login',
    'name.com',
    ''
  ],
  'nsone.net': ['ns1', 'NS1', 'https://ns1.com/'],
  'registrar-servers.com': [
    'namecheap',
    'Namecheap',
    'https://www.namecheap.com/myaccount/login/?ReturnUrl=%2f#',
    'namecheap',
    '@',
    'https://www.youtube.com/watch?v=no62GCzMn7E'
  ],
  'online.net': [
    'scaleway-online',
    'Scaleway & Online.net',
    // <https://www.scaleway.com/en/docs/network/domains-and-dns/how-to/manage-dns-records/>
    'https://console.scaleway.com/',
    false,
    ''
  ],
  '123-reg.co.uk': [
    '123-reg',
    '123 Reg',
    // <https://support.rocketspark.com/hc/en-us/articles/115010277427-How-to-change-your-DNS-settings-in-123-Reg>
    'https://www.123-reg.co.uk/',
    false,
    '@'
  ],
  ovh: [
    'ovhcloud',
    'OVHcloud',
    // <https://help.ovhcloud.com/csm/en-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051682>
    'https://ca.ovh.com/auth/?action=gotomanager&from=https://www.ovh.com/world/&ovhSubsidiary=we',
    false,
    '@'
  ],
  'alidns.com': [
    'alibaba',
    'Alibaba',
    // <https://www.alibabacloud.com/help/en/alidns-intl/latest/add-records>
    'https://account.alibabacloud.com/login/login.htm'
  ],
  'cloudns.net': [
    'cloudns',
    'ClouDNS',
    // <https://www.cloudns.net/blog/what-is-dns-management-how-to-use-cloudns-control-panel/>
    'https://www.cloudns.net/index/show/login/'
  ],
  racknerd: [
    'racknerd',
    'RackNerd',
    // 'https://www.racknerd.com/
    false
  ],
  'shopify.com': [
    'shopify',
    'Shopify',
    // <https://help.shopify.com/en/manual/domains/managing-domains/edit-dns-settings>
    false, // 'https://shopify.com/admin/settings/domains',
    false,
    '',
    'https://www.youtube.com/watch?v=G1NR8CIdv2M'
  ],
  siteground: [
    'siteground',
    'Siteground',
    // <https://www.siteground.com/kb/manage-dns-records/>
    'https://login.siteground.com/',
    false,
    ''
  ],
  strikingly: [
    'strikingly',
    'Strikingly',
    // <https://support.strikingly.com/hc/en-us/articles/215046487-Strikingly-Domain-Managing-DNS-Records-and-Viewing-Domain-Info#h_01EXEBJZ4YXRC37QQAEMP3Y5MB>
    false // 'https://www.strikingly.com/s#/v2_domains'
  ],
  'squarespacedns.com': [
    'squarespace',
    'Squarespace',
    // <https://support.squarespace.com/hc/en-us/articles/205812348-Accessing-your-Squarespace-managed-domain-s-DNS-settings>
    'https://account.squarespace.com/project-picker?client_id=helpcenter&redirect_url=%2Fsettings%2Fdomains',
    'squarespace',
    '@'
  ],
  tildadns: [
    'tilda',
    'Tilda',
    // <https://help.tilda.cc/tilda-dns>
    'https://tilda.cc/login/',
    false,
    ''
  ],
  time4vps: [
    'time4vps',
    'Time4VPS',
    // <https://www.time4vps.com/knowledgebase/working-with-dns-manager/>
    'https://billing.time4vps.com/clientarea/services/dns/'
  ],
  'vercel-dns': [
    'vercel',
    'Vercel',
    'https://vercel.com/dashboard/domains',
    'vercel',
    '@'
  ],
  'vultr.com': [
    'vultr',
    'Vultr',
    // <https://www.vultr.com/docs/introduction-to-vultr-dns/>
    'https://my.vultr.com/dns/',
    false,
    ''
  ],
  // weebly <-> squareup
  'weebly.com': [
    'weebly-squareup',
    'Weebly & Squareup',
    false // 'https://squareup.com/login'
  ],
  worldnic: [
    'network-solutions',
    'Network Solutions',
    // <https://www.networksolutions.com/manage-it/dns.jsp>
    'https://www.networksolutions.com/my-account/login'
  ],
  'webflow.com': [
    'webflow',
    'Webflow',
    false // 'https://webflow.com/dashboard/login'
  ],
  'wordpress.com': [
    'wordpress',
    'WordPress',
    // <https://wordpress.com/support/domains/custom-dns/>
    'https://wordpress.com/home',
    false,
    '@',
    'https://www.youtube.com/watch?v=Iwa2Uc0btCQ'
  ],
  'wixdns.net': ['wix', 'Wix', 'https://users.wix.com/signin?forceRender=true']
};

const NS_PROVIDER_KEYS = Object.keys(NS_PROVIDERS);
const NS_PROVIDER_REGEXES = NS_PROVIDER_KEYS.map((key) => new RE2(key, 'i'));

function nsProviderLookup(domain) {
  // return early if there were no NS providers set
  if (!domain.ns || domain.ns.length === 0) return;

  let provider;

  for (const [i, NS_PROVIDER_REGEX] of NS_PROVIDER_REGEXES.entries()) {
    if (domain.ns.some((r) => NS_PROVIDER_REGEX.test(r))) {
      const [slug, name, url, gif, host, video] =
        NS_PROVIDERS[NS_PROVIDER_KEYS[i]];
      provider = { slug, name, url, gif, host, video };
      break;
    }
  }

  return provider;
}

let nsProviders = [];
for (const key of _.sortBy(NS_PROVIDER_KEYS, (key) => NS_PROVIDERS[key].name)) {
  const [slug, name, url, gif, host, video] = NS_PROVIDERS[key];
  nsProviders.push({ slug, name, url, gif, host, video });
}

nsProviders = _.sortBy(
  nsProviders,
  (p) => (p.video || p.gif ? '0' : '1') + '_' + dashify(p.name)
);

//
// NOTE: inspiration was from wintersmith templating
//
// read app/views/docs directory
// for each file inside, filter out directories only
// for each directory, ensure that `index.pug` and `config.js` exist
// for each config.js, parse it, and if published: true then add to array
//
let developerDocs = [];
const pathToDocs = path.join(__dirname, '..', 'app', 'views', 'docs');

for (const dir of fs.readdirSync(pathToDocs, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;

  // `dir.path` is not available until Node v20.1.0
  if (!dir.path) dir.path = path.join(pathToDocs, dir.name);

  if (!fs.existsSync(path.join(dir.path, 'index.pug'))) {
    console.error('%s missing index.pug', dir.path);
    continue;
  }

  if (!fs.existsSync(path.join(dir.path, 'config.js'))) {
    console.error('%s missing config.js', dir.path);
    continue;
  }

  // safeguard
  if (dashify(dir.name) !== dir.name) {
    console.error(
      `${dir.path} is not in slug format ("${dir.name}" should be "${dashify(
        dir.name
      )}")`
    );
    continue;
  }

  try {
    const c = require(path.join(dir.path, 'config.js'));
    c.slug = `/docs/${dir.name}`;

    if (!isSANB(c.title)) {
      console.error('%s missing config.js title', dir.path);
      continue;
    }

    if (!isSANB(c.description)) {
      console.error('%s missing config.js description', dir.path);
      continue;
    }

    if (c.published !== true) {
      console.error('%s is not yet published', dir.path);
      continue;
    }

    developerDocs.push(c);
  } catch {
    console.error('%s is missing config.js', dir.path);
  }
}

developerDocs = _.sortBy(developerDocs, 'title');

const platforms = _.uniq([
  'Android',
  'Apple',
  'Arch Linux',
  'CentOS',
  'Debian',
  'Fedora',
  'FreeBSD',
  'Gentoo Linux',
  'Kali Linux',
  'Kubuntu',
  'Lineage OS',
  'Linux Mint',
  'Linux',
  'Manjaro Linux',
  'Nix Linux',
  'Oracle Linux',
  'Red Hat Enterprise Linux',
  'SUSE Linux',
  'Slackware Linux',
  'Ubuntu',
  'Unix',
  'elementary OS',
  'iOS',
  'macOS',
  'openSUSE Leap',
  'postmarket OS'
]).sort();

function convertFn(str) {
  return convert(str, {
    wordwrap: false,
    linkBrackets: false
  });
}

module.exports = {
  _,
  ajc,
  ansiHTML,
  boolean,
  capitalize,
  dashify,
  dayjs,
  emoji,
  hljs,
  humanize,
  isBot,
  isFQDN,
  isSANB,
  json,
  nsProviderLookup,
  nsProviders,
  numeral,
  pluralize,
  prefixHTMLPathBasedAnchors,
  shortID,
  splitLines,
  striptags,
  titleize,
  validator,
  ms,
  prettyMilliseconds,
  developerDocs,
  platforms,
  arrayJoinConjunction,
  convert: convertFn
};
