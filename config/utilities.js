/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

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
const highlightWords = require('highlight-words').default;
const hljs = require('highlight.js');
const humanize = require('humanize-string');
const isBot = require('isbot');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const numeral = require('numeral');
const pluralize = require('pluralize');
const prettyBytes = require('pretty-bytes');
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
const { randomstring } = require('@sidoshi/random-string');

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
      img: 'img/email-clients/thunderbird.png',
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
      img: 'img/email-clients/geary.png',
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
      img: 'img/email-clients/gnome-evolution.png',
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
      name: 'K-9 Mail',
      link: 'https://k9mail.app/',
      description:
        'K-9 Mail is an open source email client focused on making it easy to chew through large volumes of email.',
      img: 'img/email-clients/k-9-mail.png',
      attribution: 'Screenshot by K-9 Mail',
      screenshot:
        'https://docs.k9mail.app/en/6.400/reading/img/reading_folder_view.png',
      wikipedia: 'https://en.wikipedia.org/wiki/K-9_Mail',
      language: 'Java &amp; Kotlin',
      android: true,
      starred: true
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
      img: 'img/email-clients/gnumail.png',
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
      img: 'img/email-clients/kmail-kontact.png',
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
      img: 'img/email-clients/alpine.png',
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
      img: 'img/email-clients/neomutt.png',
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
      img: 'img/email-clients/roundcube.png',
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
      img: 'img/email-clients/balsa.png',
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
      img: 'img/email-clients/fairemail.png',
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
      img: 'img/email-clients/himalaya.png',
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
      img: 'img/email-clients/claws-mail.png',
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
      img: 'img/email-clients/aerc.png',
      attribution: 'Screenshot by Debian Screenshots',
      language: 'Go',
      terminal: true
    },
    {
      name: 'Cypht',
      description:
        'Lightweight Open Source webmail written in PHP and JavaScript.',
      link: 'https://github.com/cypht-org/cypht/',
      img: 'img/email-clients/cypht.png',
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
      img: 'img/email-clients/rainloop.png',
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
      img: 'img/email-clients/apple-mail.png',
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
      img: 'img/email-servers/forward-email.png',
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
      img: 'img/email-servers/maddy.png',
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
      img: 'img/email-servers/mailcow.png',
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
      img: 'img/email-servers/chasquid.png',
      attribution: 'Screenshot by Forward Email',
      imap: false,
      smtp: true,
      mx: true
    },
    {
      name: 'Haraka',
      description: 'A modern, high performance, flexible SMTP server.',
      link: 'https://haraka.github.io/',
      img: 'img/email-servers/haraka.png',
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
      img: 'img/email-servers/zone-mta.png',
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
      img: 'img/email-servers/docker-mailserver.png',
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
      img: 'img/email-servers/mail-in-a-box.png',
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
      img: 'img/email-servers/wildduck.png',
      attribution: 'Screenshot by Forward Email',
      imap: true,
      smtp: false,
      mx: false
    },
    {
      name: 'listmonk',
      description: 'Self-hosted newsletter and mailing list manager.',
      link: 'https://listmonk.app/',
      img: 'img/email-servers/listmonk.png',
      attribution: 'Screenshot by Forward Email',
      imap: false,
      smtp: true,
      mx: false
    },
    {
      name: 'keila',
      description: 'Open Source Newsletter Tool.',
      link: 'https://www.keila.io/',
      img: 'img/email-servers/keila.png',
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
      img: 'img/email-servers/postal.png',
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
      img: 'img/email-servers/postfix.png',
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
      img: 'img/email-servers/dovecot.png',
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
      img: 'img/email-servers/exim.png',
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
  'Youth Teams'
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
    'Free Mass Email Service'
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
  validator,
  ms,
  prettyMilliseconds,
  prettyBytes,
  developerDocs,
  platforms,
  arrayJoinConjunction,
  convert: convertFn,
  getServersOrClientsList,
  highlightWords,
  randomstring,
  useCases
};
