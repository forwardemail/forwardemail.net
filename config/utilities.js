/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const punycode = require('node:punycode');

const RE2 = require('re2');
const ajc = require('array-join-conjunction');
const ansiHTML = require('ansi-html-community');
const arrayJoinConjunction = require('array-join-conjunction');
const bytes = require('@forwardemail/bytes');
const capitalize = require('capitalize');
const dashify = require('dashify');
const dayjs = require('dayjs-with-plugins');
const highlightPug = require('@forwardemail/highlight-pug');
const highlightWords = require('highlight-words').default;
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
const slug = require('speakingurl');
const striptags = require('striptags');
const titleize = require('titleize');
const toEmoji = require('gemoji/name-to-emoji');
const validator = require('@forwardemail/validator');
const { boolean } = require('boolean');
const { convert } = require('html-to-text');
const { parse } = require('node-html-parser');
const { randomstring } = require('@sidoshi/random-string');
const _ = require('#helpers/lodash');

const { decrypt } = require('#helpers/encrypt-decrypt');

// <https://github.com/ztmd/highlight-pug/issues/1>
hljs.registerLanguage('pug', highlightPug);

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
// 0 - slug
// 1 - name
// 2 - url
// 3 - gif
// 4 - host
// 5 - video
// 6 - trailing period (e.g. Gandi) <https://github.com/forwardemail/forwardemail.net/issues/197>
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
    'domains-com',
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
    '',
    '',
    true
  ],
  // NOTE: Squarespace acquired Google Domains
  'googledomains.com': [
    'google-domains',
    'Google Domains',
    // 'https://domains.google.com/registrar/',
    'https://account.squarespace.com/project-picker?client_id=helpcenter&redirect_url=%2Fsettings%2Fdomains',
    'google',
    '@'
    // 'https://www.youtube.com/watch?v=01iHjbIN5CQ'
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
    'https://accounts.hetzner.com/login',
    '',
    '',
    '',
    true
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
    'name-com',
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
  'wixdns.net': ['wix', 'Wix', 'https://users.wix.com/signin?forceRender=true'],
  'hover.com': [
    'hover',
    'Hover',
    // <https://help.hover.com/hc/en-us/articles/217282457-Managing-DNS-records->
    'https://hover.com/signin',
    false,
    '@'
  ],
  canonical: [
    'canonical',
    'Canonical',
    'https://canonical.com/',
    '',
    '',
    '',
    true
  ],
  'akamai.com': [
    'akamai',
    'Akamai Edge DNS',
    // <https://techdocs.akamai.com/edge-dns/docs>
    'https://control.akamai.com/',
    false,
    ''
  ],
  'cdnetworks.com': [
    'cdnetworks',
    'CDNetworks',
    // <https://www.cdnetworks.com/dns/>
    'https://www.cdnetworks.com/',
    false,
    ''
  ],
  'dyn.com': [
    'dyn',
    'Dyn (Oracle)',
    // <https://help.dyn.com/dns-api/>
    'https://account.dyn.com/',
    false,
    ''
  ],
  'dynu.com': [
    'dynu',
    'Dynu',
    // <https://www.dynu.com/en-US/ControlPanel/DNS>
    'https://www.dynu.com/en-US/ControlPanel/Login',
    false,
    ''
  ],
  'easydns.com': [
    'easydns',
    'easyDNS',
    // <https://cp.easydns.com/manage/dns/>
    'https://cp.easydns.com/',
    false,
    ''
  ],
  'googleapis.com': [
    'google-cloud-dns',
    'Google Cloud DNS',
    // <https://cloud.google.com/dns/docs>
    'https://console.cloud.google.com/net-services/dns/',
    false,
    ''
  ],
  'glauca.digital': [
    'glauca-digital',
    'Glauca Digital',
    // <https://dns.glauca.digital/>
    'https://dns.glauca.digital/',
    false,
    ''
  ],
  'he.net': [
    'hurricane-electric',
    'Hurricane Electric',
    // <https://dns.he.net/>
    'https://dns.he.net/',
    false,
    ''
  ],
  'namesilo.com': [
    'namesilo',
    'NameSilo',
    // <https://www.namesilo.com/support/v2/articles/dns-manager>
    'https://www.namesilo.com/account_home.php',
    false,
    ''
  ],
  'no-ip.com': [
    'no-ip',
    'No-IP',
    // <https://www.noip.com/support/knowledgebase/managing-dns-records/>
    'https://www.noip.com/login',
    false,
    ''
  ],
  'oraclecloud.com': [
    'oracle-cloud-dns',
    'Oracle Cloud DNS',
    // <https://docs.oracle.com/en-us/iaas/Content/DNS/Concepts/dnszonemanagement.htm>
    'https://cloud.oracle.com/',
    false,
    ''
  ],
  'plesk.com': [
    'plesk',
    'Plesk',
    // <https://docs.plesk.com/en-US/obsidian/administrator-guide/website-management/dns-settings.74383/>
    'https://www.plesk.com/',
    false,
    ''
  ],
  'telindus.com': [
    'telindus',
    'Telindus',
    // <https://www.telindus.com/>
    'https://www.telindus.com/',
    false,
    ''
  ],
  ultradns: [
    'ultradns',
    'UltraDNS',
    // <https://docs.ultradns.com/>
    'https://portal.ultradns.com/',
    false,
    ''
  ],
  sedo: [
    'sedo',
    'Sedo',
    // Sedo is a major domain parking service
    'https://sedo.com/us/login/',
    false,
    ''
  ],
  afternic: [
    'afternic',
    'Afternic (GoDaddy)',
    // Afternic is GoDaddy's domain resale and parking platform
    'https://www.afternic.com/login',
    false,
    ''
  ],
  bodis: [
    'bodis',
    'Bodis',
    // Bodis is a domain parking and monetization service
    'https://www.bodis.com/login',
    false,
    ''
  ],
  hostgator: [
    'hostgator',
    'HostGator',
    // Part of Endurance International Group (EIG )
    'https://portal.hostgator.com/login',
    false,
    ''
  ],
  'unifiedlayer.com': [
    'unified-layer',
    'Unified Layer (Bluehost/HostGator)',
    // The infrastructure behind many EIG brands
    'https://www.unifiedlayer.com/', // No public login
    false,
    ''
  ],
  'web.com': [
    'web-com-group',
    'Web.com Group',
    // Parent company of Network Solutions, Register.com
    'https://www.web.com/my-account/login',
    false,
    ''
  ]
};

const NS_PROVIDER_KEYS = Object.keys(NS_PROVIDERS);
const NS_PROVIDER_REGEXES = NS_PROVIDER_KEYS.map((key) => new RE2(key, 'i'));

function nsProviderLookup(domain) {
  // return early if there were no NS providers set
  if (!domain.ns || domain.ns.length === 0) return;

  let provider;

  for (const [i, NS_PROVIDER_REGEX] of NS_PROVIDER_REGEXES.entries()) {
    if (domain.ns.some((r) => NS_PROVIDER_REGEX.test(r))) {
      const [slug, name, url, gif, host, video, trailingPeriod] =
        NS_PROVIDERS[NS_PROVIDER_KEYS[i]];
      provider = { slug, name, url, gif, host, video, trailingPeriod };
      break;
    }
  }

  return provider;
}

let nsProviders = [];
for (const key of _.sortBy(NS_PROVIDER_KEYS, (key) => NS_PROVIDERS[key].name)) {
  const [slug, name, url, gif, host, video, trailingPeriod] = NS_PROVIDERS[key];
  nsProviders.push({ slug, name, url, gif, host, video, trailingPeriod });
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

  const dirPath = path.join(pathToDocs, dir.name);

  if (!fs.existsSync(path.join(dirPath, 'index.pug'))) {
    console.error('%s missing index.pug', dirPath);
    continue;
  }

  if (!fs.existsSync(path.join(dirPath, 'config.js'))) {
    console.error('%s missing config.js', dirPath);
    continue;
  }

  // safeguard
  if (dashify(dir.name) !== dir.name) {
    console.error(
      `${dirPath} is not in slug format ("${dir.name}" should be "${dashify(
        dir.name
      )}")`
    );
    continue;
  }

  // get mtime for post date
  const stats = fs.statSync(path.join(dirPath, 'index.pug'));

  try {
    const c = require(path.join(dirPath, 'config.js'));
    c.slug = `/blog/docs/${dir.name}`;

    if (!isSANB(c.title)) {
      console.error('%s missing config.js title', dirPath);
      continue;
    }

    if (!isSANB(c.description)) {
      console.error('%s missing config.js description', dirPath);
      continue;
    }

    if (c.published !== true) {
      console.error('%s is not yet published', dirPath);
      continue;
    }

    c.mtime = stats.mtime; // published/last updated
    c.ctime = stats.ctime; // initially created

    developerDocs.push(c);
  } catch {
    console.error('%s is missing config.js', dirPath);
  }
}

developerDocs = _.sortBy(developerDocs, 'title');

const APPLE_PLATFORMS = new Map([
  ['Apple'],
  ['Apple Mac mini'],
  ['Apple Macbook'],
  ['Apple iMac'],
  ['Apple macOS']
]);

const APPLE_IOS_PLATFORMS = new Map([
  ['Apple iOS'],
  ['Apple iPhone'],
  ['Apple iPad']
]);

const LINUX_PLATFORMS = new Map([
  ['AlmaLinux'],
  ['Alpine Linux'],
  ['Arch Linux'],
  ['CentOS'],
  ['CoreOS'],
  ['Debian'],
  ['Fedora'],
  ['Flatcar'],
  ['FreeBSD'],
  ['Gentoo Linux'],
  ['Kali Linux'],
  ['Kubuntu'],
  ['Linux Mint'],
  ['Linux'],
  ['Manjaro Linux'],
  ['Nix Linux'],
  ['OpenBSD'],
  ['Plasma Mobile'],
  ['Purism Librem PureOS'],
  ['Fairphone'],
  ['Oracle Linux'],
  ['RHEL'],
  ['Red Hat Enterprise Linux'],
  ['Rocky Linux'],
  ['SUSE Linux'],
  ['Slackware Linux'],
  ['Ubuntu'],
  ['Unix'],
  ['elementary OS'],
  ['openSUSE Leap'],
  ['postmarket OS'],
  ['Mobian'],
  ['Replicant'],
  ['PinePhone PINE64'],
  ['Raspberry Pi']
]);

const ANDROID_PLATFORMS = new Map([
  ['Android'],
  ['F-Droid'],
  ['Google Chrome OS'],
  ['Google Pixel'],
  ['OnePlus'],
  ['CalyxOS'],
  ['Samsung Galaxy'],
  ['GrapheneOS'],
  ['Google Chromebook'],
  ['Lineage OS'],
  ['Xiaomi Phone'],
  ['OPPO Phone'],
  ['Vivo Phone']
]);

const WEB_PLATFORMS = new Map([
  ['Opera'],
  ['Chromium'],
  ['Google Chrome'],
  ['Internet Explorer'],
  ['Safari'],
  ['Microsoft Edge'],
  ['Mozilla Firefox'],
  ['Samsung Internet'],
  ['Web'],
  ['Webmail']
]);

const WINDOWS_PLATFORMS = new Map([
  ['Server 2022'],
  ['Windows 10'],
  ['Windows 11'],
  ['Windows']
]);

const platforms = _.uniq([
  // apple
  ...APPLE_PLATFORMS.keys(),
  ...APPLE_IOS_PLATFORMS.keys(),
  // linux
  ...LINUX_PLATFORMS.keys(),
  // android/f-droid
  ...ANDROID_PLATFORMS.keys(),
  // web-based
  ...WEB_PLATFORMS.keys(),
  // generic
  'Desktop',
  'Terminal',
  'Command-line (CLI)',
  // windows
  ...WINDOWS_PLATFORMS.keys()
]).sort();

function convertFn(str) {
  return convert(str, {
    wordwrap: false,
    linkBrackets: false
  });
}

const emailClients = _.sortBy(
  [
    {
      starred: true,
      name: 'Mozilla Thunderbird',
      description:
        'Access all your messages, calendars, and contacts in one fast app.',
      link: 'https://www.thunderbird.net/',
      img: 'img/email-clients/thunderbird.webp',
      screenshot:
        'https://upload.wikimedia.org/wikipedia/commons/4/4f/Thunderbird_115.png',
      attribution: 'Screenshot by MZLA Technologies Corporation',
      wikipedia: 'https://en.wikipedia.org/wiki/Mozilla_Thunderbird',
      language: 'JavaScript &amp; C++',
      apple: true,
      windows: true,
      linux: true
    },
    {
      name: 'Geary',
      description:
        'Geary is an email application built around conversations for the GNOME desktop.',
      img: 'img/email-clients/geary.webp',
      link: 'https://wiki.gnome.org/Apps/Geary',
      screenshot:
        'https://wiki.gnome.org/Apps/Geary?action=AttachFile&do=get&target=geary-3-32-main-window.png',
      attribution: 'Screenshot by The GNOME Project',
      wikipedia: 'https://en.wikipedia.org/wiki/Geary_(e-mail_client)',
      language: 'Vala (GTK)',
      linux: true
    },
    {
      name: 'GNOME Evolution',
      link: 'https://wiki.gnome.org/Apps/Evolution',
      img: 'img/email-clients/gnome-evolution.webp',
      description:
        'Evolution is a personal information management application that provides integrated mail, calendaring and address book functionality.',
      attribution: 'Screenshot by AlexanderVanLoon',
      screenshot:
        'https://en.wikipedia.org/wiki/GNOME_Evolution#/media/File:Evolution_36_mail.png',
      wikipedia: 'https://en.wikipedia.org/wiki/GNOME_Evolution',
      language: 'C (GTK)',
      linux: true
    },
    {
      name: 'Thunderbird Mobile',
      link: 'https://www.thunderbird.net/en-US/mobile/',
      description:
        'Meet the leading open-source email app for Android. Enjoy complete freedom anywhere you take your smartphone.',
      img: 'img/email-clients/thunderbird-mobile.webp',
      attribution: 'Screenshot by Thunderbird Mobile',
      screenshot:
        'https://f-droid.org/repo/net.thunderbird.android/en-US/phoneScreenshots/1.png',
      wikipedia: 'https://en.wikipedia.org/wiki/Mozilla_Thunderbird',
      language: 'Java &amp; Kotlin',
      android: true,
      starred: true
    },
    {
      name: 'K-9 Mail',
      link: 'https://k9mail.app/',
      description:
        'K-9 Mail is an open source email client focused on making it easy to chew through large volumes of email.',
      img: 'img/email-clients/k-9-mail.webp',
      attribution: 'Screenshot by K-9 Mail',
      screenshot:
        'https://docs.k9mail.app/en/6.400/reading/img/reading_folder_view.png',
      wikipedia: 'https://en.wikipedia.org/wiki/K-9_Mail',
      language: 'Java &amp; Kotlin',
      android: true
    },
    {
      name: 'Sylpheed',
      description:
        'Sylpheed is a simple, lightweight but featureful, and easy-to-use e-mail client.',
      link: 'https://sylpheed.sraoss.jp/en/',
      img: 'img/email-clients/sylpheed.jpeg',
      screenshot:
        'https://upload.wikimedia.org/wikipedia/commons/9/92/Sylpheed_zen.jpg',
      attribution: 'Screenshot by IngerAlHaosului',
      wikipedia: 'https://en.wikipedia.org/wiki/Sylpheed',
      language: 'C &amp; GTK+',
      apple: true,
      windows: true,
      linux: true
    },
    {
      name: 'GNUMail',
      description: 'An email client for GNUstep.',
      link: 'https://www.nongnu.org/gnustep-nonfsf/gnumail/',
      img: 'img/email-clients/gnumail.webp',
      attribution:
        'Screenshot by Germán Arias, Riccardo Mottola, Sebastian Reitenbach and others.',
      screenshot:
        'https://www.nongnu.org/gnustep-nonfsf/gnumail/images/GNUMailGNUstep.png',
      wikipedia: 'https://en.wikipedia.org/wiki/GNUMail',
      language: 'Objective-C',
      apple: true,
      linux: true
    },
    {
      name: 'KMail (Kontact)',
      description:
        'KMail is the email component of Kontact, the integrated personal information manager from KDE.',
      img: 'img/email-clients/kmail-kontact.webp',
      link: 'https://kontact.kde.org/components/kmail/',
      wikipedia: 'https://en.wikipedia.org/wiki/Kontact#E-Mail',
      attribution: 'Screenshot by KDE Webmasters',
      language: 'C++',
      screenshot: 'https://kontact.kde.org/assets/img/kontact-kmail.png',
      linux: true
    },
    {
      name: 'Alpine',
      description:
        'Alpine is a rewrite of the Pine Message System that adds support for Unicode and other features.',
      img: 'img/email-clients/alpine.webp',
      link: 'https://alpineapp.email/',
      attribution:
        'Screenshot by Office of UW Technology, University of Washington',
      wikipedia: 'https://en.wikipedia.org/wiki/Alpine_(email_client)',
      screenshot:
        'https://upload.wikimedia.org/wikipedia/commons/f/fc/Alpine-2.00.png',
      language: 'C',
      terminal: true
    },
    {
      name: 'NeoMutt',
      description:
        'NeoMutt is a command line mail reader (or MUA). It’s a fork of Mutt with added features.',
      link: 'https://muttwizard.com/',
      img: 'img/email-clients/neomutt.webp',
      attribution: 'Screenshot by Richard Russon',
      screenshot:
        'https://raw.githubusercontent.com/neomutt/gfx/main/screenshots/screenshot/dlg-index1-100.png',
      terminal: true,
      language: 'C'
    },
    {
      name: 'Roundcube',
      description:
        'Roundcube webmail is a browser-based multilingual IMAP client with an application-like user interface.',
      wikipedia: 'https://en.wikipedia.org/wiki/Roundcube',
      img: 'img/email-clients/roundcube.webp',
      link: 'https://roundcube.net/',
      attribution: 'Screenshot by The Roundcube Dev Team',
      screenshot:
        'https://commons.wikimedia.org/wiki/File:Roundcube_1.6.0_screenshot.png',
      language: 'PHP',
      web: true
    },
    {
      name: 'Balsa',
      description:
        'Balsa is an e-mail client for GNOME, highly configurable and incorporating all the features you would expect in a robust mail client.',
      link: 'https://pawsa.fedorapeople.org/balsa/',
      attribution: 'Screenshot by Manuel Allaud',
      img: 'img/email-clients/balsa.webp',
      screenshot:
        'https://pawsa.fedorapeople.org/balsa/screens/2.2/balsa-main-window.png',
      wikipedia: 'https://en.wikipedia.org/wiki/Balsa_(email_client)',
      language: 'C',
      linux: true
    },
    {
      name: 'FairEmail',
      description:
        'Fully featured, open source, privacy friendly email app for Android',
      link: 'https://github.com/M66B/FairEmail',
      img: 'img/email-clients/fairemail.webp',
      screenshot:
        'https://raw.githubusercontent.com/M66B/FairEmail/master/screenshots/setup.png',
      attribution: 'Screenshot by Marcel Bokhorst',
      language: 'Java &amp; C++',
      android: true
    },
    {
      name: 'meli',
      link: 'https://meli.delivery/',
      description:
        'meli aims for configurability and extensibility with sane defaults. It seeks to be a mail client for both new and power users of the terminal, but built today.',
      screenshot:
        'https://raw.githubusercontent.com/meli/meli/master/meli/docs/screenshots/main.webp',
      attribution: 'Screenshot by Manos Pitsidianakis',
      img: 'img/email-clients/meli.webp',
      starred: true,
      language: 'Rust',
      terminal: true
    },
    {
      name: 'Himalaya',
      description: 'CLI to manage emails, based on email-lib.',
      link: 'https://github.com/soywod/himalaya',
      attribution: 'Screenshot by Clément DOUIN',
      screenshot:
        'https://user-images.githubusercontent.com/10437171/138774902-7b9de5a3-93eb-44b0-8cfb-6d2e11e3b1aa.png',
      language: 'Rust',
      img: 'img/email-clients/himalaya.webp',
      starred: true,
      terminal: true
    },
    {
      name: 'Claws Mail',
      description:
        'Claws Mail is an email client (and news reader), based on GTK+...',
      link: 'https://www.claws-mail.org/',
      attribution: 'Screenshot by Claws Mail team and Hiroyuki Yamamoto',
      screenshot: 'https://www.claws-mail.org/img/screenshots/main.png',
      img: 'img/email-clients/claws-mail.webp',
      wikipedia: 'https://en.wikipedia.org/wiki/Claws_Mail',
      language: 'C (GTK)',
      apple: true,
      windows: true,
      linux: true
    },
    {
      name: 'aerc',
      link: 'https://aerc-mail.org/',
      description:
        "aerc is an email client that runs in your terminal. It's highly efficient and extensible, perfect for the discerning hacker.",
      screenshot:
        'https://screenshots.debian.net/shrine/screenshot/simage/large-a3449e4b14f51c4ce0ce785c8e2d0c67.png',
      img: 'img/email-clients/aerc.webp',
      attribution: 'Screenshot by Debian Screenshots',
      language: 'Go',
      terminal: true
    },
    {
      name: 'SnappyMail',
      description: 'Simple, modern, lightweight & fast web-based email client.',
      link: 'https://github.com/the-djmaze/snappymail',
      img: 'img/email-clients/snappymail.webp',
      attribution: 'Screenshot by Forward Email',
      screenshot: 'https://snappymail.eu/demo',
      language: 'PHP',
      web: true
    },
    {
      name: 'Cypht',
      description:
        'Lightweight Open Source webmail written in PHP and JavaScript.',
      link: 'https://github.com/cypht-org/cypht/',
      img: 'img/email-clients/cypht.webp',
      attribution: 'Screenshot by Cypht',
      screenshot:
        'https://raw.githubusercontent.com/cypht-org/cypht-website/master/img/cypht_shot1.png',
      language: 'PHP',
      web: true
    },
    {
      name: 'RainLoop',
      description: 'Simple, modern & fast web-based email client.',
      link: 'https://github.com/RainLoop/rainloop-webmail',
      attribution: 'Screenshot by RainLoop team',
      screenshot: 'https://www.rainloop.net/static/media/screenshots/v2/12.png',
      img: 'img/email-clients/rainloop.webp',
      wikipedia: 'https://fr.wikipedia.org/wiki/RainLoop',
      language: 'PHP',
      web: true
    },
    {
      name: 'Apple Mail',
      ios: true,
      description:
        'Mail is an email client included by Apple Inc. with its operating systems macOS, iOS, iPadOS and watchOS... With Mail on iCloud.com, you can send and receive email from your iCloud Mail account using a web browser.',
      link: 'https://support.apple.com/mail',
      img: 'img/email-clients/apple-mail.webp',
      language: 'Proprietary',
      attribution: 'Screenshot by Forward Email',
      screenshot:
        'https://upload.wikimedia.org/wikipedia/en/7/78/Apple_Mail.png',
      wikipedia: 'https://en.wikipedia.org/wiki/Apple_Mail',
      web: true,
      apple: true
    }
  ],
  (obj) => `${obj.starred ? 0 : 1}_${obj.name}`
);

const match = emailClients.find(
  (c) =>
    !c.name ||
    !c.description ||
    !c.img ||
    !c.link ||
    !c.screenshot ||
    !c.attribution ||
    !c.language
);
if (match) {
  console.log(match);
  throw new TypeError('Match found');
}

// TODO: page on Email Industry Standards and Protocols
// TODO: https://en.wikipedia.org/wiki/Webmail
// TODO: https://en.wikipedia.org/wiki/Comparison_of_email_clients
// TODO: https://en.wikipedia.org/wiki/Text-based_email_client
// TODO: https://en.wikipedia.org/wiki/List_of_mail_server_software
// TODO: pop3 support
const emailServers = _.sortBy(
  [
    {
      starred: true,
      name: 'Forward Email',
      description:
        'Privacy-focused encrypted email for you. We are the go-to email service for hundreds of thousands of creators, developers, and businesses. Send and receive email as you@yourdomain.com with your custom domain or use one of ours.',
      link: 'https://forwardemail.net',
      img: 'img/email-servers/forward-email.webp',
      attribution: 'Screenshot by Forward Email',
      imap: true,
      smtp: true,
      mx: true
    },
    {
      name: 'Maddy Mail Server',
      description:
        'Maddy Mail Server implements all functionality required to run a e-mail server.',
      link: 'https://maddy.email/',
      img: 'img/email-servers/maddy.webp',
      attribution: 'Screenshot by Forward Email',
      imap: true,
      smtp: true,
      mx: true
    },
    {
      name: 'mailcow',
      description:
        'mailcow: dockerized is an open source groupware/email suite based on docker.',
      link: 'https://docs.mailcow.email/',
      img: 'img/email-servers/mailcow.webp',
      attribution: 'Screenshot by Forward Email',
      imap: true,
      smtp: true,
      mx: true
    },
    {
      name: 'chasquid',
      description:
        'chasquid is an SMTP (email) server with a focus on simplicity, security, and ease of operation.',
      link: 'https://blitiri.com.ar/p/chasquid/',
      img: 'img/email-servers/chasquid.webp',
      attribution: 'Screenshot by Forward Email',
      imap: false,
      smtp: true,
      mx: true
    },
    {
      name: 'Haraka',
      description: 'A modern, high performance, flexible SMTP server.',
      link: 'https://haraka.github.io/',
      img: 'img/email-servers/haraka.webp',
      attribution: 'Screenshot by Forward Email',
      wikipedia: 'https://en.wikipedia.org/wiki/Haraka_(software)',
      imap: false,
      smtp: true,
      mx: false
    },
    {
      name: 'ZoneMTA',
      description:
        'ZoneMTA provides granular control over routing different messages. ',
      link: 'https://github.com/zone-eu/zone-mta',
      img: 'img/email-servers/zone-mta.webp',
      attribution: 'Screenshot by Forward Email',
      imap: false,
      smtp: true,
      mx: false
    },
    {
      name: 'Docker Mailserver',
      description:
        'docker-mailserver, or DMS for short, is a production-ready fullstack but simple mail server (SMTP, IMAP, LDAP, Antispam, Antivirus, etc.).',
      link: 'https://docker-mailserver.github.io/docker-mailserver/latest/',
      img: 'img/email-servers/docker-mailserver.webp',
      attribution: 'Screenshot by Forward Email',
      imap: true,
      smtp: true,
      mx: true
    },
    {
      name: 'Mail-in-a-Box',
      description:
        'Take back control of your email with this easy-to-deploy mail server in a box.',
      link: 'https://mailinabox.email/',
      img: 'img/email-servers/mail-in-a-box.webp',
      attribution: 'Screenshot by Forward Email',
      wikipedia: 'https://en.wikipedia.org/wiki/Mail-in-a-Box',
      imap: true,
      smtp: true,
      mx: true
    },
    {
      name: 'WildDuck',
      description:
        'WildDuck is a modern mail server software for IMAP and POP3.',
      link: 'https://wildduck.email/',
      img: 'img/email-servers/wildduck.webp',
      attribution: 'Screenshot by Forward Email',
      imap: true,
      smtp: false,
      mx: false
    },
    {
      name: 'listmonk',
      description: 'Self-hosted newsletter and mailing list manager.',
      link: 'https://listmonk.app/',
      img: 'img/email-servers/listmonk.webp',
      attribution: 'Screenshot by Forward Email',
      imap: false,
      smtp: true,
      mx: false
    },
    {
      name: 'keila',
      description: 'Open Source Newsletter Tool.',
      link: 'https://www.keila.io/',
      img: 'img/email-servers/keila.webp',
      attribution: 'Screenshot by Forward Email',
      imap: false,
      smtp: true,
      mx: false
    },
    {
      name: 'Postal',
      description:
        'Postal is a complete and fully featured mail server for use by websites & web servers.',
      link: 'https://docs.postalserver.io/',
      img: 'img/email-servers/postal.webp',
      attribution: 'Screenshot by Forward Email',
      imap: false,
      smtp: true,
      mx: false
    },
    {
      name: 'Postfix',
      description:
        "It is Wietse Venema's mail server that started life at IBM research as an alternative to the widely-used Sendmail program.",
      link: 'https://www.postfix.org/',
      img: 'img/email-servers/postfix.webp',
      attribution: 'Screenshot by Forward Email',
      wikipedia: 'https://en.wikipedia.org/wiki/Postfix_(software)',
      imap: false,
      smtp: true,
      mx: true
    },
    {
      name: 'Dovecot',
      description:
        'Dovecot is an excellent choice for both small and large installations.',
      link: 'https://www.dovecot.org/',
      img: 'img/email-servers/dovecot.webp',
      attribution: 'Screenshot by Forward Email',
      wikipedia: 'https://en.wikipedia.org/wiki/Dovecot_%28software%29',
      imap: true,
      smtp: false,
      mx: false
    },
    {
      name: 'Exim',
      description:
        'Exim is a message transfer agent (MTA) originally developed at the University of Cambridge for use on Unix systems connected to the Internet.',
      link: 'https://www.exim.org/',
      img: 'img/email-servers/exim.webp',
      attribution: 'Screenshot by Forward Email',
      wikipedia: 'https://en.wikipedia.org/wiki/Exim',
      imap: false,
      smtp: true,
      mx: true
    }
  ],
  (obj) =>
    `${obj.starred ? 0 : 1}_${obj.imap ? 0 : 1}_${obj.smtp ? 0 : 1}_${
      obj.mx ? 0 : 1
    }_${obj.name}`
);

const serverMatch = emailServers.find(
  (c) => !c.name || !c.description || !c.img || !c.link || !c.attribution
);
if (serverMatch) {
  console.log(serverMatch);
  throw new TypeError('Server match found');
}

function getServersOrClientsList(platform, isEmailClients = false) {
  if (!isEmailClients) return emailServers;
  let providers = [...emailClients];
  // filter based off platform
  if (platform === 'Desktop') {
    providers = providers.filter(
      (p) => p.web || p.apple || p.windows || p.linux
    );
  } else if (platform === 'Terminal' || platform === 'Command-line (CLI)') {
    providers = providers.filter((p) => p.terminal);
  } else if (APPLE_IOS_PLATFORMS.has(platform)) {
    providers = providers.filter((p) => p.ios);
  } else if (APPLE_PLATFORMS.has(platform)) {
    providers = providers.filter((p) => p.apple);
  } else if (LINUX_PLATFORMS.has(platform)) {
    providers = providers.filter((p) => p.linux);
  } else if (ANDROID_PLATFORMS.has(platform)) {
    providers = providers.filter((p) => p.android);
  } else if (WEB_PLATFORMS.has(platform)) {
    providers = providers.filter((p) => p.web);
  } else if (WINDOWS_PLATFORMS.has(platform)) {
    providers = providers.filter((p) => p.windows);
  } else {
    throw new TypeError(`Uh oh ${platform}`);
  }

  return providers;
}

// various use cases (SEO related)
const useCases = {
  '/government-email-hosting-forwarding': [
    'Email Hosting & Forwarding for Federal, State, Local, County, and Municipal Governments',
    "We can provide email hosting and forwarding, API's, IMAP, POP3, mailboxes, calendars, and more for federal, state, local, county, and municipal governments."
  ],
  '/education-email-hosting-forwarding': [
    'Email Forwarding for Education, K-12, Colleges, Universities, Schools, Students, Teachers',
    "We provide email forwarding and hosting, API's, IMAP, POP3, mailboxes, calendars, and more for education, K-12, colleges, school districts, universities, students, and teachers."
  ],
  '/healthcare-email-hosting-forwarding-hipaa': [
    'Email Forwarding for Healthcare, Doctors, Patients, HIPAA',
    "We provide email hosting and forwarding, API's, IMAP, POP3, mailboxes, calendars, and more for healthcare, doctors, patients, and HIPAA-complaint related needs."
  ],
  '/gdpr-compliant-email-hosting': [
    'Email Forwarding for GDPR Compliance Needs',
    "We provide email hosting and forwarding, API's, IMAP, POP3, mailboxes, calendars, and more for GDPR-complaint related needs."
  ],
  '/mx-server-proxy-port-forwarding-service': [
    'Custom MX Server Port Forwarding',
    'You can use our email hosting and forwarding service for MX exchange server proxy and port forwarding needs.'
  ],
  '/custom-domain-email-hosting-microsoft-outlook-365': [
    'Custom Domain Email Hosting for Microsoft Outlook 365',
    "We provide email forwarding and hosting, API's, IMAP, POP3, mailboxes, calendars, and more for custom domains using Microsoft Outlook 365."
  ],
  '/custom-domain-email-hosting': [
    'Custom Domain Email Hosting',
    "Set up custom domain email hosting in seconds with Forward Email. Get access to email hosting, forwarding, API's, IMAP, POP3, mailboxes, calendars, and more."
  ],
  '/custom-domain-email-hosting-apple-mail': [
    'Custom Domain Email Hosting for Apple Mail',
    "We provide email forwarding and hosting, API's, IMAP, POP3, mailboxes, calendars, and more for custom domains using Apple Mail."
  ],
  '/custom-domain-email-hosting-mozilla-thunderbird': [
    'Custom Domain Email Hosting for Mozilla Thunderbird',
    "We provide email forwarding and hosting, API's, IMAP, POP3, mailboxes, calendars, and more for custom domains using Mozilla Thunderbird."
  ],
  '/secure-business-email-provider': [
    'Secure Business Email Provider',
    'We are a secure email service provider for busineses and organizations with a focus on privacy.'
  ],
  '/privacy-focused-email-service': [
    'Privacy Focused Email Service',
    'We are a secure and privacy focused email service that provides email hosting, forwarding, IMAP, POP3, calendar, mailboxes, and more.'
  ],
  // Core Email Forwarding & Setup (20 pages)
  '/how-to-setup-custom-domain-email': [
    'How to Set Up Custom Domain Email in 5 Minutes',
    'Step-by-step guide to create professional email addresses with your domain. Free setup with unlimited aliases and secure forwarding.'
  ],
  '/free-business-email-without-google': [
    'Free Business Email Without Google - Privacy-First Alternative',
    'Get professional business email without Google tracking. 100% open-source email forwarding with custom domains and unlimited aliases.'
  ],
  '/email-forwarding-vs-email-hosting': [
    'Email Forwarding vs Email Hosting: Complete Comparison Guide',
    'Compare email forwarding and hosting solutions. Learn which option saves money while providing professional email for your business.'
  ],
  '/gmail-custom-domain-alternative': [
    'Gmail Custom Domain Alternative - No Google Workspace Fees',
    'Skip expensive Google Workspace fees. Get custom domain email that works with Gmail, Outlook, and all email clients for free.'
  ],
  '/nonprofit-organization-email-setup': [
    'Free Email Setup for Nonprofit Organizations',
    'Professional email addresses for nonprofits and charities. Free custom domain email with unlimited forwarding and secure storage.'
  ],
  '/startup-company-email-solution': [
    'Startup Email Solution - Professional Addresses on Any Budget',
    'Cost-effective email solution for startups. Get you@yourcompany.com addresses with enterprise features at startup-friendly prices.'
  ],
  '/freelancer-professional-email-address': [
    'Professional Email Address for Freelancers and Consultants',
    'Build credibility with clients using custom domain email. Free professional email setup that works with your existing email client.'
  ],
  '/small-business-email-hosting-free': [
    'Free Email Hosting for Small Business - No Monthly Fees',
    'Professional small business email without monthly hosting fees. Custom domain email with unlimited addresses and secure forwarding.'
  ],
  '/secure-email-forwarding-privacy': [
    'Secure Email Forwarding with Complete Privacy Protection',
    'Privacy-focused email forwarding with no tracking or data collection. Open-source security for sensitive business communications.'
  ],
  '/unlimited-email-aliases-custom-domain': [
    'Unlimited Email Aliases for Your Custom Domain',
    'Create unlimited email addresses for your domain. Perfect for organizing business communications with catch-all forwarding.'
  ],
  '/email-forwarding-multiple-domains': [
    'Email Forwarding for Multiple Domains - Centralized Management',
    'Manage email for multiple domains from one account. Ideal for agencies, investors, and multi-brand businesses.'
  ],
  '/protonmail-alternative-open-source': [
    'Open Source ProtonMail Alternative - Free Email Privacy',
    "Privacy-focused email without ProtonMail's limitations. Free open-source email forwarding with custom domains and unlimited storage."
  ],
  '/improvmx-alternative-better-features': [
    'ImprovMX Alternative with Better Free Features',
    'More features than ImprovMX free plan. Unlimited domains, better security, and open-source transparency for email forwarding.'
  ],
  '/professional-email-address-cheap': [
    'Cheap Professional Email Address - Free Custom Domain Setup',
    'Get professional email addresses without expensive hosting. Free custom domain email that looks professional and works everywhere.'
  ],
  '/email-forwarding-catch-all-setup': [
    'Catch-All Email Forwarding Setup Guide',
    'Set up catch-all email forwarding to never miss messages. Complete guide for custom domain email with wildcard forwarding.'
  ],
  '/business-email-without-office365': [
    'Business Email Without Office 365 - Free Alternative',
    'Professional business email without Microsoft Office 365 costs. Custom domain email with all the features at zero monthly cost.'
  ],
  '/ecommerce-store-email-setup': [
    'Email Setup for Ecommerce Stores - Professional Customer Service',
    'Professional email addresses for online stores. Set up support@, sales@, and info@ addresses with secure forwarding.'
  ],
  '/agency-client-email-management': [
    'Email Management for Agencies and Client Domains',
    'Manage email for multiple client domains efficiently. White-label email forwarding solution for digital agencies and consultants.'
  ],
  '/personal-domain-email-free': [
    'Free Personal Domain Email - Own Your Email Address',
    'Take control of your email with personal domain addresses. Free email forwarding that you own and control forever.'
  ],
  '/email-forwarding-gmail-integration': [
    'Email Forwarding with Gmail Integration - Best Setup Guide',
    'Perfect integration between custom domain forwarding and Gmail. Send and receive from your domain while using Gmail interface.'
  ],

  // Open Source Email Hosting & Services (10 NEW pages)
  '/open-source-email-hosting-service': [
    'Open Source Email Hosting Service',
    '100% open-source email hosting with full transparency. Self-hosted email infrastructure with enterprise features and complete source code access.'
  ],
  '/open-source-email-server-hosting': [
    'Open Source Email Server Hosting',
    'Deploy open-source email servers with professional hosting. Transparent email infrastructure you can audit, modify, and trust completely.'
  ],
  '/open-source-business-email-service': [
    'Open Source Business Email Service',
    'Professional business email powered by open-source technology. Transparent, auditable email service with enterprise features and privacy protection.'
  ],
  '/open-source-email-provider-alternative': [
    'Open Source Email Provider Alternative',
    'Switch to the only 100% open-source email provider. Transparent email service with no vendor lock-in and complete source code visibility.'
  ],
  '/open-source-email-forwarding-service': [
    'Open Source Email Forwarding Service',
    'Transparent email forwarding with open-source technology. Audit every line of code handling your email communications.'
  ],
  '/open-source-secure-email-hosting': [
    'Open Source Secure Email Hosting',
    'Security-first open-source email hosting with end-to-end encryption. Transparent security you can verify and trust.'
  ],
  '/open-source-enterprise-email-solution': [
    'Open Source Enterprise Email Solution',
    'Enterprise-grade email powered by open-source technology. Scalable, transparent email infrastructure for large organizations.'
  ],
  '/open-source-email-infrastructure': [
    'Open Source Email Infrastructure',
    'Build email infrastructure on open-source foundations. Transparent, auditable email systems with enterprise reliability.'
  ],
  '/open-source-email-platform': [
    'Open Source Email Platform',
    'Complete open-source email platform for businesses. Transparent email solution with full source code access and customization.'
  ],
  '/open-source-email-hosting-provider': [
    'Open Source Email Hosting Provider',
    'The only email hosting provider with 100% open-source technology. Transparent email hosting you can audit and trust.'
  ],

  // Postmark Alternatives (5 NEW pages)
  '/postmark-alternative-open-source': [
    'Postmark Alternative - Open Source Email Service',
    'Open-source alternative to Postmark with better transparency. Reliable transactional email without vendor lock-in or hidden algorithms.'
  ],
  '/postmark-alternative-cheaper': [
    'Cheaper Postmark Alternative with More Features',
    'Cost-effective alternative to Postmark with unlimited domains. Better pricing, more features, and 100% open-source transparency.'
  ],
  '/postmark-alternative-transactional-email': [
    'Transactional Email Alternative to Postmark',
    'Reliable transactional email service as Postmark alternative. Better deliverability, lower costs, and complete source code transparency.'
  ],

  // Gmail Alternatives (5 NEW pages)
  '/gmail-alternative-open-source': [
    'Open Source Gmail Alternative',
    'Privacy-focused Gmail alternative with open-source transparency. Custom domain email without Google tracking or data collection.'
  ],
  '/gmail-alternative-business-email': [
    'Gmail Alternative for Business Email',
    'Professional Gmail alternative with custom domains. Better privacy, lower costs, and 100% open-source email infrastructure.'
  ],
  '/gmail-alternative-privacy-focused': [
    'Privacy-Focused Gmail Alternative',
    'Escape Gmail surveillance with privacy-first email. Open-source Gmail alternative with custom domains and zero tracking.'
  ],
  '/gmail-workspace-alternative-cheaper': [
    'Cheaper Google Workspace Alternative',
    'Cost-effective alternative to Google Workspace with better privacy. Professional email without Google tracking or monthly fees.'
  ],
  '/gmail-custom-domain-alternative-free': [
    'Free Gmail Custom Domain Alternative',
    'Free alternative to Gmail custom domain service. Professional email addresses without Google Workspace costs or tracking.'
  ],

  // Outlook/Office 365 Alternatives (5 NEW pages)
  '/outlook-alternative-open-source': [
    'Open Source Outlook Alternative',
    'Open-source alternative to Microsoft Outlook email. Professional email service with transparency and privacy protection.'
  ],
  '/office365-alternative-cheaper': [
    'Cheaper Office 365 Alternative',
    'Cost-effective alternative to Microsoft Office 365 email. Professional business email without expensive monthly subscriptions.'
  ],
  '/microsoft-email-alternative': [
    'Microsoft Email Alternative - Open Source',
    'Privacy-focused alternative to Microsoft email services. Open-source email hosting without vendor lock-in or data collection.'
  ],
  '/outlook-business-email-alternative': [
    'Outlook Business Email Alternative',
    'Professional alternative to Outlook business email. Better privacy, lower costs, and 100% open-source transparency.'
  ],
  '/exchange-server-alternative': [
    'Exchange Server Alternative - Cloud Email',
    'Modern alternative to Microsoft Exchange Server. Cloud-based email hosting with open-source transparency and better security.'
  ],

  // Other Major Provider Alternatives (5 NEW pages)
  '/yahoo-mail-alternative-business': [
    'Yahoo Mail Alternative for Business',
    'Professional alternative to Yahoo Mail with custom domains. Business email hosting with better security and privacy protection.'
  ],
  '/icloud-email-alternative': [
    'iCloud Email Alternative with Custom Domains',
    'Alternative to iCloud email with custom domain support. Professional email hosting that works with all devices and email clients.'
  ],
  '/zoho-mail-alternative-open-source': [
    'Open Source Zoho Mail Alternative',
    'Transparent alternative to Zoho Mail with open-source technology. Professional email hosting with complete source code visibility.'
  ],
  '/fastmail-alternative-cheaper': [
    'Cheaper FastMail Alternative',
    'Cost-effective alternative to FastMail with more features. Professional email hosting with better pricing and open-source transparency.'
  ],
  '/protonmail-alternative-features': [
    'ProtonMail Alternative with More Features',
    'Feature-rich alternative to ProtonMail with custom domains. Better functionality, lower costs, and 100% open-source email service.'
  ],

  // Technical Infrastructure & Enterprise (25 pages)
  '/smtp-relay-service-configuration': [
    'SMTP Relay Service Configuration Guide',
    'Configure SMTP relay for high-volume email delivery. Step-by-step setup guide for secure email routing with authentication and encryption.'
  ],
  '/mx-record-hosting-setup': [
    'MX Record Hosting Setup for Custom Domains',
    'Professional MX record hosting with DNS management. Configure mail exchange records for reliable email delivery to your custom domain.'
  ],
  '/postfix-email-forwarding-configuration': [
    'Postfix Email Forwarding Configuration Service',
    'Expert Postfix configuration for email forwarding and relay. Secure mail server setup with custom domain integration and SMTP authentication.'
  ],
  '/email-authentication-spf-dkim-dmarc-setup': [
    'Email Authentication Setup - SPF, DKIM, DMARC Configuration',
    'Complete email authentication setup service. Configure SPF, DKIM, and DMARC records to improve deliverability and prevent email spoofing.'
  ],
  '/email-api-integration-developers': [
    'Email API Integration for Developers',
    'RESTful email API for seamless integration. Send transactional emails, webhooks, and notifications with comprehensive developer documentation.'
  ],
  '/webhook-email-notifications-service': [
    'Webhook Email Notifications Service',
    'Real-time email event webhooks for your applications. Track opens, clicks, bounces, and deliveries with instant HTTP POST notifications.'
  ],
  '/transactional-email-service-developers': [
    'Transactional Email Service for Developers',
    'Reliable transactional email delivery with high deliverability rates. Perfect for password resets, receipts, and automated notifications.'
  ],
  '/email-deliverability-testing-tools': [
    'Email Deliverability Testing Tools',
    'Test email deliverability before sending campaigns. Check spam scores, authentication, and inbox placement across major email providers.'
  ],
  '/email-deliverability-optimization-service': [
    'Email Deliverability Optimization Service',
    'Professional email deliverability optimization and consulting. Improve inbox placement rates with expert analysis and recommendations.'
  ],
  '/email-infrastructure-consulting-service': [
    'Email Infrastructure Consulting Service',
    'Expert email infrastructure consulting and architecture design. Scalable email solutions for enterprise organizations.'
  ],
  '/enterprise-email-hosting-solutions': [
    'Enterprise Email Hosting Solutions',
    'Scalable enterprise email hosting with advanced security and compliance features. Custom solutions for large organizations and government.'
  ],
  '/edge-email-processing-service': [
    'Edge Email Processing Service',
    'Distributed email processing at network edge locations. Reduced latency and improved performance for global email delivery.'
  ],
  '/email-server-migration-service': [
    'Email Server Migration Service',
    'Seamless email server migration with zero downtime. Migrate from any email provider to secure, reliable email hosting.'
  ],
  '/email-backup-archiving-solution': [
    'Email Backup and Archiving Solution',
    'Secure email backup and long-term archiving service. Compliance-ready email storage with instant search and retrieval capabilities.'
  ],
  '/email-encryption-service-end-to-end': [
    'End-to-End Email Encryption Service',
    'Military-grade email encryption with zero-knowledge architecture. Secure email communication that even we cannot decrypt.'
  ],
  '/email-load-balancing-service': [
    'Email Load Balancing Service',
    'Distribute email traffic across multiple servers for high availability. Redundant email infrastructure with automatic failover.'
  ],
  '/email-performance-monitoring-service': [
    'Email Performance Monitoring Service',
    'Real-time email performance monitoring and analytics. Track delivery times, server performance, and user engagement metrics.'
  ],
  '/email-security-assessment-service': [
    'Email Security Assessment Service',
    'Professional email security assessment and penetration testing. Identify vulnerabilities and strengthen email defenses.'
  ],
  '/email-disaster-recovery-service': [
    'Email Disaster Recovery Service',
    'Complete email disaster recovery with geo-redundant backups. Ensure business continuity with rapid email service restoration.'
  ],
  '/distributed-email-system-architecture': [
    'Distributed Email System Architecture',
    'Scalable distributed email infrastructure design. Multi-region email processing with automatic failover and load balancing.'
  ],
  '/low-latency-email-delivery-service': [
    'Low-Latency Email Delivery Service',
    'Ultra-fast email delivery using edge computing. Optimized routing and processing for time-critical email communications.'
  ],
  '/edge-email-security-platform': [
    'Edge Email Security Platform',
    'Distributed email security processing at network edges. Real-time threat detection and filtering closer to email sources.'
  ],
  '/localized-email-services-edge': [
    'Localized Email Services at the Edge',
    'Region-specific email processing and compliance. Local data residency and regulatory compliance through edge computing.'
  ],
  '/email-capacity-planning-service': [
    'Email Capacity Planning Service',
    'Email infrastructure capacity planning and scaling. Optimize email server resources for growing email volumes.'
  ],
  '/email-monitoring-alerting-service': [
    'Email Monitoring and Alerting Service',
    '24/7 email system monitoring with intelligent alerting. Proactive issue detection and automated incident response.'
  ],

  // Compliance & Government (15 pages)
  '/hipaa-compliant-email-hosting': [
    'HIPAA Compliant Email Hosting Service',
    'HIPAA-compliant email hosting for healthcare organizations. Encrypted email storage and transmission with business associate agreements.'
  ],
  '/soc2-compliant-email-service': [
    'SOC 2 Compliant Email Service',
    'SOC 2 Type II compliant email hosting with enterprise security controls. Audit-ready email infrastructure for regulated industries.'
  ],
  '/government-email-hosting-secure': [
    'Secure Government Email Hosting',
    'Government-grade email hosting with advanced security and compliance. FedRAMP ready email solutions for federal agencies.'
  ],
  '/email-compliance-auditing-service': [
    'Email Compliance Auditing Service',
    'Comprehensive email compliance auditing for regulatory requirements. GDPR, HIPAA, and SOX compliance reporting.'
  ],
  '/email-governance-framework-implementation': [
    'Email Governance Framework Implementation',
    'Comprehensive email governance and policy management. Automated policy enforcement and compliance monitoring systems.'
  ],
  '/automated-compliance-reporting-email': [
    'Automated Email Compliance Reporting',
    'Automated generation of compliance reports for email systems. Real-time monitoring and reporting for regulatory requirements.'
  ],
  '/email-policy-enforcement-system': [
    'Email Policy Enforcement System',
    'Automated enforcement of email policies and procedures. Real-time policy compliance monitoring and violation prevention.'
  ],
  '/regulatory-email-monitoring-service': [
    'Regulatory Email Monitoring Service',
    '24/7 monitoring for regulatory compliance violations. Automated detection and reporting of non-compliant email activities.'
  ],
  '/email-audit-trail-system': [
    'Email Audit Trail System',
    'Comprehensive audit trails for all email activities. Immutable logging and forensic analysis capabilities for email systems.'
  ],
  '/email-data-loss-prevention': [
    'Email Data Loss Prevention Service',
    'Prevent sensitive data leaks through email. Automated content inspection and policy enforcement for compliance.'
  ],
  '/email-retention-policy-management': [
    'Email Retention Policy Management',
    'Automated email retention and deletion policies. Compliance-ready email lifecycle management with legal hold capabilities.'
  ],
  '/banking-email-security-protocols': [
    'Banking Email Security Protocols Implementation',
    'Enterprise-grade email security for banking institutions. Multi-layered protection against phishing, fraud, and data breaches.'
  ],
  '/financial-email-encryption-standards': [
    'Financial Services Email Encryption Standards',
    'Industry-standard email encryption for financial communications. Protect sensitive financial data with regulatory-compliant encryption.'
  ],

  // Email Marketing & Analytics (20 pages)
  '/email-marketing-automation-platform': [
    'Email Marketing Automation Platform',
    'Advanced email marketing automation with behavioral triggers. Create sophisticated email campaigns with personalized customer journeys.'
  ],
  '/email-template-management-service': [
    'Email Template Management Service',
    'Centralized email template management with version control. Brand-consistent email templates with dynamic content insertion.'
  ],
  '/email-analytics-reporting-service': [
    'Email Analytics and Reporting Service',
    'Advanced email analytics with custom reporting dashboards. Track email performance, user behavior, and system metrics.'
  ],
  '/email-campaign-optimization-service': [
    'Email Campaign Optimization Service',
    'Optimize email campaigns for maximum engagement and conversion. Data-driven insights and automated optimization recommendations.'
  ],
  '/email-ab-testing-service': [
    'Email A/B Testing Service',
    'Comprehensive email A/B testing platform with statistical significance. Optimize subject lines, content, and send times.'
  ],
  '/email-personalization-service': [
    'Email Personalization Service',
    'Advanced email personalization with machine learning. Dynamic content optimization based on recipient behavior and preferences.'
  ],
  '/email-segmentation-service': [
    'Email Segmentation Service',
    'Intelligent email list segmentation for targeted campaigns. Behavioral segmentation and automated audience management.'
  ],
  '/email-automation-workflow-service': [
    'Email Automation Workflow Service',
    'Create complex email automation workflows with visual builders. Trigger-based email sequences and conditional logic.'
  ],
  '/email-drip-campaign-automation': [
    'Email Drip Campaign Automation',
    'Automated drip email campaigns for lead nurturing. Set up sophisticated email sequences that convert prospects into customers.'
  ],
  '/email-list-management-service': [
    'Email List Management Service',
    'Professional email list management with advanced segmentation. Clean, organize, and optimize your email subscriber database.'
  ],
  '/email-engagement-optimization': [
    'Email Engagement Optimization Service',
    'Improve email open rates, click-through rates, and conversions. Expert optimization strategies for better email performance.'
  ],
  '/email-deliverability-analytics': [
    'Email Deliverability Analytics',
    'Comprehensive email deliverability analytics and reporting. Monitor inbox placement, sender reputation, and delivery metrics.'
  ],
  '/email-subscriber-analytics': [
    'Email Subscriber Analytics',
    'Deep insights into subscriber behavior and preferences. Track engagement patterns and optimize email content accordingly.'
  ],
  '/email-conversion-tracking': [
    'Email Conversion Tracking',
    'Track email conversions and ROI with advanced analytics. Measure the impact of email campaigns on business goals.'
  ],
  '/email-heat-map-analytics': [
    'Email Heat Map Analytics',
    'Visual email analytics with click heat maps. Understand how recipients interact with your email content.'
  ],
  '/email-send-time-optimization': [
    'Email Send Time Optimization',
    'Optimize email send times for maximum engagement. AI-powered timing recommendations based on recipient behavior.'
  ],
  '/email-subject-line-optimization': [
    'Email Subject Line Optimization',
    'Optimize email subject lines for better open rates. A/B testing and AI-powered subject line recommendations.'
  ],
  '/email-content-optimization': [
    'Email Content Optimization Service',
    'Optimize email content for engagement and conversions. Expert copywriting and design optimization for better results.'
  ],
  '/email-frequency-optimization': [
    'Email Frequency Optimization',
    'Optimize email sending frequency to reduce unsubscribes. Find the perfect balance between engagement and fatigue.'
  ],
  '/email-roi-analytics': [
    'Email ROI Analytics',
    'Measure email marketing return on investment with detailed analytics. Track revenue attribution and campaign profitability.'
  ],

  // Security & Authentication (15 pages)
  '/multi-factor-email-authentication': [
    'Multi-Factor Email Authentication Service',
    'Enhanced email security with multi-factor authentication. Biometric, hardware token, and SMS-based email access control.'
  ],
  '/zero-trust-email-architecture': [
    'Zero-Trust Email Architecture Implementation',
    'Zero-trust security model for email infrastructure. Continuous verification and least-privilege access for email systems.'
  ],
  '/email-threat-protection-service': [
    'Email Threat Protection Service',
    'Advanced email threat protection against phishing, malware, and ransomware. Real-time threat detection and response.'
  ],
  '/email-phishing-protection': [
    'Email Phishing Protection Service',
    'Advanced phishing protection with machine learning detection. Protect your organization from sophisticated email attacks.'
  ],
  '/email-malware-scanning-service': [
    'Email Malware Scanning Service',
    'Real-time email malware and virus scanning. Protect your organization with enterprise-grade email security filtering.'
  ],
  '/email-spam-filtering-service': [
    'Advanced Email Spam Filtering Service',
    'Intelligent spam filtering with machine learning. Reduce spam while ensuring legitimate emails reach their destination.'
  ],
  '/email-content-filtering-service': [
    'Email Content Filtering Service',
    'Advanced email content filtering with machine learning. Block spam, malware, and phishing attempts before they reach inboxes.'
  ],
  '/email-attachment-scanning-service': [
    'Email Attachment Scanning Service',
    'Scan email attachments for viruses and malware. Secure file transfer with sandboxed attachment processing.'
  ],
  '/email-link-protection-service': [
    'Email Link Protection Service',
    'Protect against malicious links in emails. Real-time URL scanning and safe browsing protection for email recipients.'
  ],
  '/email-sandbox-analysis': [
    'Email Sandbox Analysis Service',
    'Advanced email threat analysis in secure sandbox environments. Detect zero-day threats and sophisticated attacks.'
  ],
  '/email-incident-response-service': [
    'Email Security Incident Response',
    'Rapid response to email security incidents. Expert investigation and remediation of email-based cyber attacks.'
  ],
  '/email-security-training-service': [
    'Email Security Training Service',
    'Comprehensive email security awareness training. Educate employees about phishing, social engineering, and email threats.'
  ],
  '/email-forensics-investigation-service': [
    'Email Forensics Investigation Service',
    'Professional email forensics and investigation services. Digital evidence collection and analysis for legal proceedings.'
  ],
  '/passwordless-email-access-system': [
    'Passwordless Email Access System',
    'Eliminate passwords with modern authentication methods. FIDO2, WebAuthn, and certificate-based email authentication.'
  ],
  '/certificate-based-email-authentication': [
    'Certificate-Based Email Authentication',
    'PKI certificate authentication for enterprise email. Digital certificates for secure email access and message signing.'
  ],

  // Performance & Optimization (15 pages)
  '/email-delivery-optimization-service': [
    'Email Delivery Optimization Service',
    'Optimize email delivery routes and timing for maximum performance. AI-driven delivery optimization and reputation management.'
  ],
  '/email-bounce-handling-service': [
    'Email Bounce Handling Service',
    'Automated email bounce management with detailed analytics. Handle hard bounces, soft bounces, and improve sender reputation automatically.'
  ],
  '/email-reputation-monitoring-service': [
    'Email Reputation Monitoring Service',
    'Monitor your email sender reputation across all major ISPs. Track blacklist status, sender score, and deliverability metrics in real-time.'
  ],
  '/email-blacklist-monitoring-service': [
    'Email Blacklist Monitoring Service',
    'Monitor your IP and domain across 100+ blacklists. Instant alerts and automated delisting requests for blocked senders.'
  ],
  '/email-warm-up-service-deliverability': [
    'Email Warm-up Service for Better Deliverability',
    'Automated email warm-up to improve inbox placement. Gradually increase sending volume and build positive sender reputation.'
  ],
  '/email-list-validation-service': [
    'Email List Validation Service',
    'Clean and validate email lists with 99% accuracy. Remove invalid emails, spam traps, and improve deliverability rates instantly.'
  ],
  '/email-suppression-list-management': [
    'Email Suppression List Management',
    'Centralized suppression list management across all email campaigns. Automatically honor unsubscribes and bounce suppressions.'
  ],
  '/email-feedback-loop-management': [
    'Email Feedback Loop Management',
    'Automated feedback loop processing for major ISPs. Handle spam complaints and maintain sender reputation automatically.'
  ],
  '/email-rate-limiting-configuration': [
    'Email Rate Limiting Configuration Service',
    'Configure email rate limiting to prevent spam and improve deliverability. Smart throttling based on recipient domains and reputation.'
  ],
  '/email-queue-management-service': [
    'Email Queue Management Service',
    'Advanced email queue management with priority routing. Ensure critical emails are delivered first with intelligent queuing.'
  ],
  '/email-header-analysis-service': [
    'Email Header Analysis Service',
    'Detailed email header analysis for deliverability troubleshooting. Identify authentication issues and routing problems.'
  ],
  '/bandwidth-efficient-email-service': [
    'Bandwidth-Efficient Email Service',
    'Optimized email delivery for low-bandwidth environments. Compression and intelligent routing for efficient email transmission.'
  ],
  '/email-compression-service': [
    'Email Compression Service',
    'Advanced email compression for faster delivery. Reduce email size while maintaining quality and compatibility.'
  ],
  '/email-caching-solutions': [
    'Email Caching Solutions',
    'Intelligent email caching for improved performance. Distributed caching systems for faster email access and delivery.'
  ],
  '/email-cdn-service': [
    'Email CDN Service',
    'Content delivery network for email attachments and media. Global distribution of email content for faster access worldwide.'
  ],

  // Quantum-Safe Email Technologies (8 pages)
  '/quantum-safe-email-hosting': [
    'Quantum-Safe Email Hosting Service',
    'Future-proof email hosting with quantum-resistant encryption. Protect your communications against quantum computer attacks with NIST-approved algorithms.'
  ],
  '/quantum-resistant-email-service': [
    'Quantum-Resistant Email Service',
    'Email service protected against quantum computing threats. Advanced post-quantum cryptography ensures your emails remain secure in the quantum era.'
  ],
  '/post-quantum-cryptography-email': [
    'Post-Quantum Cryptography Email Service',
    'Email encryption using NIST-standardized post-quantum algorithms. Secure your communications against future quantum computer attacks.'
  ],
  '/quantum-proof-email-encryption': [
    'Quantum-Proof Email Encryption',
    'Military-grade quantum-proof email encryption service. Advanced cryptographic protection that remains secure even against quantum computers.'
  ],
  '/nist-approved-email-encryption': [
    'NIST-Approved Email Encryption Service',
    'Email service using NIST-approved post-quantum cryptographic standards. Compliance-ready quantum-resistant email protection for enterprises.'
  ],
  '/quantum-secure-business-email': [
    'Quantum-Secure Business Email',
    'Business email service with quantum-resistant security. Protect sensitive corporate communications with future-proof encryption technology.'
  ],
  '/post-quantum-email-infrastructure': [
    'Post-Quantum Email Infrastructure',
    'Email infrastructure built with post-quantum cryptography. Scalable, quantum-resistant email systems for enterprise organizations.'
  ],
  '/quantum-resistant-email-forwarding': [
    'Quantum-Resistant Email Forwarding',
    'Email forwarding service with quantum-safe encryption. Future-proof email routing that protects against quantum computing threats.'
  ],

  // Advanced Email Authentication & Security (7 pages)
  '/mta-sts-email-security-implementation': [
    'MTA-STS Email Security Implementation',
    'Implement MTA-STS for enhanced email transport security. Prevent man-in-the-middle attacks with SMTP MTA Strict Transport Security.'
  ],
  '/tls-rpt-email-reporting-service': [
    'TLS-RPT Email Reporting Service',
    'TLS Reporting for email security monitoring. Track email transport security failures and improve email delivery with detailed TLS reports.'
  ],
  '/bimi-email-brand-indicators': [
    'BIMI Email Brand Indicators Implementation',
    'Implement Brand Indicators for Message Identification (BIMI). Display your brand logo in email clients with verified email authentication.'
  ],
  '/arc-email-authentication-service': [
    'ARC Email Authentication Service',
    'Authenticated Received Chain (ARC) implementation for email forwarding. Preserve email authentication through intermediary email services.'
  ],
  '/dane-email-security-implementation': [
    'DANE Email Security Implementation',
    'DNS-based Authentication of Named Entities (DANE) for email. Enhance email security with DNS-based certificate validation.'
  ],
  '/smtp-sts-policy-management': [
    'SMTP STS Policy Management Service',
    'Manage SMTP Strict Transport Security policies for email domains. Enforce encrypted email transmission with automated policy management.'
  ],
  '/email-certificate-transparency-monitoring': [
    'Email Certificate Transparency Monitoring',
    'Monitor email certificates with Certificate Transparency logs. Detect unauthorized certificates and protect against email interception.'
  ],

  // Compliance & Regulatory Requirements (5 pages)
  '/fips-140-2-compliant-email-service': [
    'FIPS 140-2 Compliant Email Service',
    'FIPS 140-2 validated email encryption for government and enterprise. Cryptographic modules meeting federal security requirements.'
  ],
  '/common-criteria-email-security': [
    'Common Criteria Email Security Evaluation',
    'Email security solutions evaluated under Common Criteria standards. Independently verified security for high-assurance environments.'
  ],
  // TODO: FedRAMP authorization
  // '/fedramp-authorized-email-service': [
  //   'FedRAMP Authorized Email Service',
  //   'FedRAMP authorized email hosting for federal agencies. Cloud email services meeting government security and compliance requirements.'
  // ],
  '/itar-compliant-email-hosting': [
    'ITAR Compliant Email Hosting',
    'ITAR-compliant email hosting for defense contractors. Secure email communications meeting International Traffic in Arms Regulations.'
  ],
  '/cjis-compliant-email-service': [
    'CJIS Compliant Email Service',
    'CJIS-compliant email hosting for law enforcement. Secure email communications meeting Criminal Justice Information Services requirements.'
  ],

  // Advanced Technical Email Features (5 pages)
  '/zero-knowledge-email-architecture': [
    'Zero-Knowledge Email Architecture',
    'Zero-knowledge email service where even we cannot access your data. End-to-end encrypted email with client-side encryption keys.'
  ],
  '/homomorphic-encryption-email-service': [
    'Homomorphic Encryption Email Service',
    'Email service with homomorphic encryption capabilities. Process encrypted emails without decrypting sensitive content.'
  ],
  '/forward-secrecy-email-encryption': [
    'Forward Secrecy Email Encryption',
    'Email encryption with perfect forward secrecy. Protect past communications even if encryption keys are compromised in the future.'
  ],
  '/email-air-gap-security-solution': [
    'Email Air-Gap Security Solution',
    'Air-gapped email security for isolated networks. Secure email processing in environments requiring complete network isolation.'
  ],

  // Email Privacy & Anonymous Services (15 NEW pages)
  '/anonymous-email-forwarding-service': [
    'Anonymous Email Forwarding Service',
    'Protect your identity with anonymous email forwarding. No personal information required, complete privacy protection for all communications.'
  ],
  '/burner-email-address-service': [
    'Burner Email Address Service',
    'Create temporary burner email addresses for online signups. Protect your real email from spam and unwanted marketing.'
  ],
  '/disposable-email-alias-generator': [
    'Disposable Email Alias Generator',
    'Generate unlimited disposable email aliases instantly. Perfect for online shopping, newsletters, and protecting your primary inbox.'
  ],
  '/email-privacy-protection-service': [
    'Email Privacy Protection Service',
    'Comprehensive email privacy protection with encrypted forwarding. Hide your real email address from trackers and data collectors.'
  ],
  '/anti-spam-email-filtering': [
    'Anti-Spam Email Filtering Service',
    'Advanced anti-spam filtering with machine learning. Block unwanted emails before they reach your inbox.'
  ],
  '/email-tracker-blocking-service': [
    'Email Tracker Blocking Service',
    'Block email tracking pixels and read receipts. Protect your privacy from email surveillance and analytics.'
  ],
  '/private-email-relay-service': [
    'Private Email Relay Service',
    'Relay emails through private servers for enhanced anonymity. No logs, no tracking, complete email privacy.'
  ],
  '/encrypted-email-forwarding-pgp': [
    'Encrypted Email Forwarding with PGP',
    'Forward emails with PGP encryption for maximum security. End-to-end encrypted email forwarding for sensitive communications.'
  ],
  '/email-alias-management-platform': [
    'Email Alias Management Platform',
    'Centralized platform for managing all your email aliases. Create, organize, and control unlimited email addresses from one dashboard.'
  ],
  '/catch-all-email-address-setup': [
    'Catch-All Email Address Setup',
    'Set up catch-all email addresses for your domain. Never miss an email with wildcard forwarding to your inbox.'
  ],
  '/email-masking-for-online-shopping': [
    'Email Masking for Online Shopping',
    'Protect your email when shopping online. Create unique masked addresses for each store to prevent spam and data breaches.'
  ],
  '/email-forwarding-with-spam-filter': [
    'Email Forwarding with Spam Filter',
    'Forward emails with built-in spam filtering. Clean, spam-free emails delivered to your preferred inbox.'
  ],
  '/temporary-email-for-signups': [
    'Temporary Email for Website Signups',
    'Create temporary email addresses for website registrations. Avoid spam and protect your primary email address.'
  ],
  '/email-privacy-for-journalists': [
    'Email Privacy for Journalists and Whistleblowers',
    'Secure email communication for journalists and sources. Anonymous email forwarding with no logs or tracking.'
  ],
  '/email-privacy-for-activists': [
    'Email Privacy for Activists and Advocates',
    'Protect your identity with private email forwarding. Secure communications for activists, advocates, and organizers.'
  ],

  // Industry-Specific Email Solutions (20 NEW pages)
  '/law-firm-email-hosting': [
    'Email Hosting for Law Firms and Attorneys',
    'Professional email hosting for law firms with client confidentiality. Secure, compliant email for legal professionals.'
  ],
  '/medical-practice-email-hosting': [
    'Email Hosting for Medical Practices',
    'HIPAA-ready email hosting for medical practices. Secure patient communication with encrypted email forwarding.'
  ],
  '/accounting-firm-email-service': [
    'Email Service for Accounting Firms',
    'Professional email for CPAs and accounting firms. Secure client communication with custom domain email.'
  ],
  '/real-estate-agency-email': [
    'Email for Real Estate Agencies',
    'Professional email addresses for real estate agents and brokers. Build credibility with custom domain email.'
  ],
  '/restaurant-email-marketing': [
    'Email Marketing for Restaurants',
    'Email marketing and forwarding for restaurants and food service. Engage customers with professional email communications.'
  ],
  '/hotel-email-management': [
    'Email Management for Hotels and Hospitality',
    'Professional email hosting for hotels and hospitality businesses. Guest communication and booking confirmations made easy.'
  ],
  '/fitness-studio-email': [
    'Email for Fitness Studios and Gyms',
    'Professional email for fitness businesses. Member communication, class schedules, and marketing emails.'
  ],
  '/salon-spa-email-service': [
    'Email Service for Salons and Spas',
    'Professional email for beauty businesses. Appointment confirmations, promotions, and client communication.'
  ],
  '/construction-company-email': [
    'Email for Construction Companies',
    'Professional email hosting for construction and contracting businesses. Project communication and client updates.'
  ],
  '/manufacturing-email-service': [
    'Email Service for Manufacturing Companies',
    'Enterprise email for manufacturing businesses. Supplier communication, order management, and team collaboration.'
  ],
  '/retail-store-email-hosting': [
    'Email Hosting for Retail Stores',
    'Professional email for retail businesses. Customer service, order notifications, and marketing campaigns.'
  ],
  '/automotive-dealer-email': [
    'Email for Automotive Dealerships',
    'Professional email hosting for car dealerships. Customer inquiries, service appointments, and sales follow-ups.'
  ],
  '/insurance-agency-email': [
    'Email for Insurance Agencies',
    'Secure email hosting for insurance professionals. Client communication, policy updates, and claims processing.'
  ],
  '/financial-advisor-email': [
    'Email for Financial Advisors',
    'Compliant email hosting for financial advisors. Secure client communication with archiving and encryption.'
  ],
  '/property-management-email': [
    'Email for Property Management Companies',
    'Professional email for property managers. Tenant communication, maintenance requests, and lease management.'
  ],
  '/veterinary-clinic-email': [
    'Email for Veterinary Clinics',
    'Professional email hosting for veterinary practices. Appointment reminders, pet health updates, and client communication.'
  ],
  '/dental-practice-email': [
    'Email for Dental Practices',
    'Professional email hosting for dentists. Appointment scheduling, patient reminders, and practice communication.'
  ],
  '/photography-business-email': [
    'Email for Photography Businesses',
    'Professional email for photographers. Client booking, gallery delivery, and portfolio inquiries.'
  ],
  '/event-planning-email': [
    'Email for Event Planning Companies',
    'Professional email hosting for event planners. Vendor coordination, client communication, and event updates.'
  ],
  '/consulting-firm-email': [
    'Email for Consulting Firms',
    'Professional email hosting for consultants. Client engagement, project updates, and proposal delivery.'
  ],

  // Technology & Developer Email Solutions (15 NEW pages)
  '/developer-email-api-service': [
    'Email API Service for Developers',
    'RESTful email API for developers and applications. Send, receive, and manage emails programmatically.'
  ],
  '/saas-application-email': [
    'Email Infrastructure for SaaS Applications',
    'Reliable email infrastructure for SaaS products. Transactional emails, notifications, and user communication.'
  ],
  '/mobile-app-email-service': [
    'Email Service for Mobile Applications',
    'Email integration for iOS and Android apps. User verification, notifications, and in-app messaging.'
  ],
  '/webhook-email-notifications': [
    'Webhook Email Notifications Service',
    'Trigger email notifications via webhooks. Integrate email alerts with your existing systems and workflows.'
  ],
  '/email-api-for-automation': [
    'Email API for Workflow Automation',
    'Automate email workflows with our powerful API. Integrate with Zapier, Make, and custom automation tools.'
  ],
  '/headless-email-service': [
    'Headless Email Service for Developers',
    'API-first email service for modern applications. No UI required, full programmatic control over email.'
  ],
  '/email-microservice-architecture': [
    'Email Microservice Architecture',
    'Scalable email microservices for distributed systems. Containerized email processing with Kubernetes support.'
  ],
  '/serverless-email-functions': [
    'Serverless Email Functions',
    'Email processing with serverless architecture. AWS Lambda, Google Cloud Functions, and Azure Functions integration.'
  ],
  '/email-queue-processing-service': [
    'Email Queue Processing Service',
    'Reliable email queue processing with guaranteed delivery. Handle high-volume email with automatic retry and failover.'
  ],
  '/email-template-api': [
    'Email Template API Service',
    'Dynamic email templates with API access. Create, manage, and render email templates programmatically.'
  ],
  '/email-analytics-api': [
    'Email Analytics API',
    'Track email metrics via API. Opens, clicks, bounces, and delivery status for all your emails.'
  ],
  '/email-validation-api': [
    'Email Validation API Service',
    'Validate email addresses in real-time via API. Reduce bounces and improve deliverability with email verification.'
  ],
  '/email-parsing-api': [
    'Email Parsing API Service',
    'Parse incoming emails and extract data via API. Automate data extraction from email content and attachments.'
  ],
  '/inbound-email-processing': [
    'Inbound Email Processing Service',
    'Process incoming emails programmatically. Parse, route, and respond to emails automatically.'
  ],
  '/outbound-email-api': [
    'Outbound Email API Service',
    'Send transactional and marketing emails via API. High deliverability with detailed analytics and reporting.'
  ],

  // Email Migration & Integration (10 NEW pages)
  '/google-workspace-migration': [
    'Google Workspace Email Migration',
    'Migrate from Google Workspace to Forward Email. Keep your emails, contacts, and calendars with zero downtime.'
  ],
  '/office-365-email-migration': [
    'Office 365 Email Migration Service',
    'Migrate from Microsoft 365 to Forward Email. Seamless transition with full data preservation.'
  ],
  '/godaddy-email-migration': [
    'GoDaddy Email Migration Service',
    'Migrate from GoDaddy email to Forward Email. Better features, better privacy, better value.'
  ],
  '/zoho-mail-migration': [
    'Zoho Mail Migration Service',
    'Migrate from Zoho Mail to Forward Email. Open-source alternative with better privacy protection.'
  ],
  '/fastmail-migration': [
    'Fastmail Migration Service',
    'Migrate from Fastmail to Forward Email. More features, open-source transparency, competitive pricing.'
  ],
  '/protonmail-migration': [
    'ProtonMail Migration Service',
    'Migrate from ProtonMail to Forward Email. Open-source email with custom domain support and better flexibility.'
  ],
  '/email-consolidation-service': [
    'Email Consolidation Service',
    'Consolidate multiple email accounts into one. Forward all your emails to a single inbox for easy management.'
  ],
  '/email-backup-export-service': [
    'Email Backup and Export Service',
    'Backup and export all your emails. Download your email archive in standard formats for safekeeping.'
  ],
  '/email-import-service': [
    'Email Import Service',
    'Import emails from any provider. Migrate your email history to Forward Email with full preservation.'
  ],
  '/multi-provider-email-aggregation': [
    'Multi-Provider Email Aggregation',
    'Aggregate emails from multiple providers. View and manage all your email accounts in one place.'
  ],

  // Geographic & Regional Email (10 NEW pages)
  '/email-hosting-europe-gdpr': [
    'Email Hosting in Europe - GDPR Compliant',
    'European email hosting with full GDPR compliance. Data residency in EU with privacy-first infrastructure.'
  ],
  '/email-hosting-canada': [
    'Email Hosting in Canada - PIPEDA Compliant',
    'Canadian email hosting with PIPEDA compliance. Data sovereignty with Canadian privacy law protection.'
  ],
  '/email-hosting-australia': [
    'Email Hosting in Australia',
    'Australian email hosting with local data residency. Privacy-focused email for Australian businesses.'
  ],
  '/email-hosting-uk': [
    'Email Hosting in United Kingdom',
    'UK email hosting with local compliance. GDPR and UK data protection compliant email services.'
  ],
  '/email-hosting-germany': [
    'Email Hosting in Germany',
    'German email hosting with strict privacy standards. GDPR compliant with German data protection.'
  ],
  '/email-hosting-switzerland': [
    'Email Hosting in Switzerland',
    'Swiss email hosting with legendary privacy protection. Neutral jurisdiction with strong data protection laws.'
  ],
  '/email-hosting-asia-pacific': [
    'Email Hosting in Asia Pacific',
    'Asia Pacific email hosting with regional optimization. Fast, reliable email for APAC businesses.'
  ],
  '/email-hosting-latin-america': [
    'Email Hosting in Latin America',
    'Latin American email hosting with local language support. Professional email for LATAM businesses.'
  ],
  '/email-hosting-middle-east': [
    'Email Hosting in Middle East',
    'Middle Eastern email hosting with regional compliance. Professional email for MENA businesses.'
  ],
  '/email-hosting-africa': [
    'Email Hosting in Africa',
    'African email hosting with local optimization. Reliable email infrastructure for African businesses.'
  ]
};

const nouns = [
  'Actors and Actresses',
  'Adult Social Sports',
  'Alumni',
  'Anime Clubs',
  'Artists and Designer Guilds',
  'Basketball Clubs',
  'Board Game Groups',
  'Book Clubs',
  'Bootstrappers',
  'Boutiques',
  'Churches',
  'Colleges',
  'Comedy Clubs',
  'Concerts',
  'Content Creators',
  'Cooking Clubs',
  'Corporate Clubs',
  'Crypto',
  'Dance Academy',
  'Dating Communities',
  'Developer Meetups',
  'Directory',
  'E-Commerce',
  'Education',
  'Employees',
  'Enterprise',
  'Ethnic Communities',
  'Fan Clubs',
  'Farmers Market',
  'Flag Football Clubs',
  'Football Clubs',
  'Fraternities',
  'Gaming Clubs and E-Sports Teams',
  'Government',
  'Golf Courses',
  'Golf Clubs',
  'Putt-Putt Course',
  'Country Clubs',
  'Gyms and Fitness Centers',
  'Healthcare',
  'Hotels',
  'Independent Contractors',
  'K-12',
  'Live Shows',
  'Live Streamers',
  'Meetup Groups',
  'Music Bands and DJ',
  'Nomads and Remote Workers',
  'Non-Profit Clubs',
  'Non-Profits',
  'Organizations',
  'Pickleball Clubs',
  'Poker and Gambling Clubs',
  'Political Advocacy Clubs',
  'Racial Communities',
  'Real Estate Agent',
  'Remote Workers',
  'Restaurants',
  'Role-playing and Cosplaying',
  'Run Clubs',
  'Schools',
  'Senior Groups',
  'Shops',
  'Small Business',
  'Soccer Clubs',
  'Social Clubs',
  'Softball Clubs',
  'Sole Proprietors',
  'Sororities',
  'Speed Dating',
  'Sporting Teams',
  'Staff',
  'Startup',
  'Stores',
  'Student Groups',
  'Support Groups',
  'Swim Teams',
  'Teachers',
  'Tennis Groups',
  'Theater Organizations',
  'Therapy Groups',
  'Travel Clubs',
  'Trivia Events and Meetups',
  'Tutoring',
  'Universities',
  'Volleyball Clubs',
  'Worship Centers',
  'Yoga Studios',
  'Youth Groups',
  'Youth Teams',
  // NEW: Additional high-value audience segments
  'Accountants',
  'Architects',
  'Attorneys and Law Firms',
  'Automotive Dealers',
  'Beauty Salons',
  'Bloggers',
  'Cafes and Coffee Shops',
  'Chiropractors',
  'Cleaning Services',
  'Construction Companies',
  'Consultants',
  'Coworking Spaces',
  'Credit Unions',
  'Daycare Centers',
  'Dental Practices',
  'Digital Agencies',
  'Doctors and Physicians',
  'Dog Trainers',
  'Event Planners',
  'Family Offices',
  'Financial Advisors',
  'Florists',
  'Food Trucks',
  'Funeral Homes',
  'Hair Salons',
  'Home Inspectors',
  'HVAC Companies',
  'Immigration Lawyers',
  'Insurance Agencies',
  'Interior Designers',
  'Investment Clubs',
  'IT Consultants',
  'Landscaping Companies',
  'Laundromats',
  'Life Coaches',
  'Marketing Agencies',
  'Massage Therapists',
  'Medical Practices',
  'Mortgage Brokers',
  'Moving Companies',
  'Music Teachers',
  'Notaries',
  'Nutritionists',
  'Optometrists',
  'Painters',
  'Pest Control',
  'Pet Groomers',
  'Pet Stores',
  'Pharmacies',
  'Photographers',
  'Physical Therapists',
  'Plumbers',
  'Podcasters',
  'PR Agencies',
  'Private Investigators',
  'Property Managers',
  'Psychologists',
  'Real Estate Investors',
  'Recruiters',
  'Roofing Companies',
  'SaaS Companies',
  'Security Companies',
  'SEO Agencies',
  'Social Media Managers',
  'Software Developers',
  'Solar Installers',
  'Spas',
  'Sports Coaches',
  'Staffing Agencies',
  'Tattoo Parlors',
  'Tax Preparers',
  'Tech Startups',
  'Tour Operators',
  'Translators',
  'Travel Agents',
  'Trucking Companies',
  'Veterinarians',
  'Video Production',
  'Virtual Assistants',
  'Web Designers',
  'Wedding Planners',
  'Wine Clubs',
  'Writers and Authors',
  // NEW: Additional high-value audience segments (50+ more)
  'Acupuncturists',
  'Aerospace Companies',
  'Agricultural Businesses',
  'Air Conditioning Services',
  'Antique Dealers',
  'Appliance Repair',
  'Art Galleries',
  'Auction Houses',
  'Auto Body Shops',
  'Bakeries',
  'Bankruptcy Attorneys',
  'Barber Shops',
  'Bed and Breakfasts',
  'Bicycle Shops',
  'Biotech Companies',
  'Boat Dealers',
  'Bookkeepers',
  'Breweries',
  'Bridal Shops',
  'Cabinet Makers',
  'Campgrounds',
  'Car Washes',
  'Carpet Cleaners',
  'Catering Companies',
  'Cell Phone Repair',
  'Charter Schools',
  'Childcare Centers',
  'Chiropractic Clinics',
  'Cigar Shops',
  'Cleaning Companies',
  'Coin Dealers',
  'Comic Book Stores',
  'Community Centers',
  'Computer Repair',
  'Concrete Contractors',
  'Counseling Services',
  'Craft Breweries',
  'Credit Repair',
  'Cryptocurrency Exchanges',
  'Custom Jewelers',
  'Dance Studios',
  'Data Centers',
  'Delivery Services',
  'Dermatologists',
  'Dietitians',
  'Distilleries',
  'Driving Schools',
  'Dry Cleaners',
  'E-Learning Platforms',
  'Electricians',
  'Electronics Stores',
  'Emergency Services',
  'Employment Agencies',
  'Engineering Firms',
  'Environmental Consultants',
  'Escape Rooms',
  'Estate Planning',
  'Executive Coaches',
  'Fabrication Shops',
  'Family Law Attorneys',
  'Farm Equipment',
  'Fashion Designers',
  'Fence Contractors',
  'Film Production',
  'Financial Planners',
  'Fire Protection',
  'Fishing Charters',
  'Floor Installers',
  'Flower Shops',
  'Food Distributors',
  'Franchise Businesses',
  'Freight Companies',
  'Furniture Stores',
  'Garden Centers',
  'Gas Stations',
  'General Contractors',
  'Gift Shops',
  'Glass Companies',
  'Golf Instructors',
  'Graphic Designers',
  'Greenhouse Operators',
  'Grocery Stores',
  'Gun Shops',
  'Handyman Services',
  'Hardware Stores',
  'Health Clinics',
  'Hearing Aid Centers',
  'Heating Companies',
  'Hobby Shops',
  'Home Builders',
  'Home Health Care',
  'Home Staging',
  'Hospice Care',
  'Hot Tub Dealers',
  'Ice Cream Shops',
  'Import Export',
  'Industrial Suppliers',
  'Influencers',
  'Insulation Contractors',
  'Irrigation Services',
  'Janitorial Services',
  'Jewelry Stores',
  'Junk Removal',
  'Kennel Services',
  'Kitchen Remodeling',
  'Lab Services',
  'Language Schools',
  'Laser Clinics',
  'Lawn Care',
  'Leather Goods',
  'Legal Services',
  'Limousine Services',
  'Liquor Stores',
  'Locksmith Services',
  'Logistics Companies',
  'Machine Shops',
  'Maid Services',
  'Mail Order',
  'Managed IT Services',
  'Marina Services',
  'Market Research',
  'Martial Arts Schools',
  'Masonry Contractors',
  'Mattress Stores',
  'Meal Prep Services',
  'Meat Markets',
  'Media Companies',
  'Medical Equipment',
  'Medical Spas',
  'Mental Health Services',
  'Metal Fabricators',
  'Microbreweries',
  'Mobile App Developers',
  'Montessori Schools',
  'Motorcycle Dealers',
  'Music Schools',
  'Nail Salons',
  'Nanny Services',
  'Naturopaths',
  'Network Engineers',
  'Nursing Homes',
  'Office Supplies',
  'Oil Change Services',
  'Online Retailers',
  'Ophthalmologists',
  'Organic Farms',
  'Orthodontists',
  'Outdoor Recreation',
  'Packaging Companies',
  'Paint Stores',
  'Party Planners',
  'Pawn Shops',
  'Payroll Services',
  'Pediatricians',
  'Personal Trainers',
  'Pest Management',
  'Pet Boarding',
  'Pet Sitting',
  'Pharmaceutical Companies',
  'Phone Repair',
  'Piano Teachers',
  'Picture Framing',
  'Pilates Studios',
  'Pizza Shops',
  'Plastic Surgeons',
  'Podiatrists',
  'Pool Services',
  'Portrait Studios',
  'Power Washing',
  'Preschools',
  'Print Shops',
  'Private Schools',
  'Product Designers',
  'Professional Organizers',
  'Promotional Products',
  'Psychiatrists',
  'Public Relations',
  'Publishing Companies',
  'Quilting Shops',
  'Radiologists',
  'Ranches',
  'Real Estate Appraisers',
  'Recording Studios',
  'Recreation Centers',
  'Recycling Services',
  'Rehabilitation Centers',
  'Reiki Practitioners',
  'Rental Services',
  'Repair Services',
  'Research Firms',
  'Resorts',
  'Restoration Companies',
  'Retirement Communities',
  'RV Dealers',
  'Safety Consultants',
  'Sailing Schools',
  'Sandwich Shops',
  'Scaffolding Companies',
  'Screen Printing',
  'Scuba Diving',
  'Seamstresses',
  'Security Services',
  'Self Storage',
  'Senior Care',
  'Septic Services',
  'Sewing Shops',
  'Shipping Companies',
  'Shoe Repair',
  'Sign Companies',
  'Skating Rinks',
  'Ski Resorts',
  'Skin Care Clinics',
  'Sleep Clinics',
  'Small Engine Repair',
  'Smoke Shops',
  'Snow Removal',
  'Social Workers',
  'Software Companies',
  'Sound Engineers',
  'Specialty Foods',
  'Speech Therapists',
  'Sporting Goods',
  'Stationery Stores',
  'Storage Facilities',
  'Structural Engineers',
  'Stucco Contractors',
  'Substance Abuse',
  'Sunglasses Shops',
  'Supplement Stores',
  'Surveyors',
  'Sushi Restaurants',
  'Tailors',
  'Tanning Salons',
  'Tarot Readers',
  'Tax Attorneys',
  'Tea Shops',
  'Technical Writers',
  'Telecommunications',
  'Temp Agencies',
  'Tennis Clubs',
  'Textile Companies',
  'Thai Restaurants',
  'Theater Companies',
  'Thrift Stores',
  'Tile Contractors',
  'Tire Shops',
  'Title Companies',
  'Tobacco Shops',
  'Tool Rental',
  'Towing Services',
  'Toy Stores',
  'Trade Schools',
  'Trailer Dealers',
  'Training Centers',
  'Translation Services',
  'Transportation Services',
  'Travel Agencies',
  'Tree Services',
  'Trophy Shops',
  'Truck Rental',
  'Tutoring Centers',
  'Uniform Suppliers',
  'Upholstery Services',
  'Urgent Care',
  'Used Car Dealers',
  'Utility Companies',
  'Vacation Rentals',
  'Vape Shops',
  'Vegan Restaurants',
  'Vending Services',
  'Ventilation Services',
  'Video Game Stores',
  'Vintage Shops',
  'Vinyl Installers',
  'Vision Centers',
  'Voice Coaches',
  'Volunteer Organizations',
  'Warehouse Services',
  'Watch Repair',
  'Water Damage',
  'Water Treatment',
  'Wealth Management',
  'Web Hosting',
  'Welding Services',
  'Wellness Centers',
  'Wholesale Distributors',
  'Window Cleaning',
  'Window Installation',
  'Wineries',
  'Woodworking',
  'Worship Groups',
  'Yoga Instructors',
  'Youth Organizations',
  'Zoos and Aquariums'
];

for (const noun of nouns) {
  for (const title of [
    'Free Email Forwarding',
    'Free Email Provider',
    'Free Email Hosting',
    'Free Email Service',
    'Free Email Newsletters',
    'Free Email API',
    'Free Email Masking',
    'Free Email Marketing',
    'Free Bulk Email Service',
    'Free Mass Email Service',
    // NEW: Additional title variations (5 more)
    'Free Email Automation',
    'Free Email Security',
    'Free Email Management',
    'Free Email Platform',
    'Free Email Solutions'
  ]) {
    let desc = title.toLowerCase().replace('free', '').trim();
    if (desc === 'email api') desc = 'an email api';
    else if (desc === 'email provider') desc = 'an email platform';
    useCases[`/${dashify(noun)}-${dashify(title.replace('Free', '').trim())}`] =
      [
        `${title} for ${noun}`,
        `We provide ${desc} for ${noun.toLowerCase()} and more. Sign up today for free and setup email hosting and forwarding in seconds.`
      ];
  }
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
  isURL: validator.isURL,
  isEmail: validator.isEmail,
  isIP: validator.isIP,
  ms,
  prettyMilliseconds,
  developerDocs,
  platforms,
  arrayJoinConjunction,
  convert: convertFn,
  getServersOrClientsList,
  highlightWords,
  randomstring,
  useCases,
  decrypt,
  punycode,
  bytes,
  slug
};
