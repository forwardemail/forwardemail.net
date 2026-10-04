/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');

const config = require('#config');

// the TTL we suggest on the setup pages (60 minutes)
const TTL = 3600;

// a TXT record holds strings of at most 255 characters each (RFC 1035)
const MAX_TXT_STRING_LENGTH = 255;

function getWebHost() {
  return config.webHost === 'localhost' && config.env === 'development'
    ? 'forwardemail.net'
    : config.webHost;
}

function getExchanges() {
  return config.isSelfHosted
    ? config.exchanges
    : ['mx1.forwardemail.net', 'mx2.forwardemail.net'];
}

//
// Every DNS record a domain needs (the same values as on its setup pages),
// each as `{ name, type, value, priority?, weight?, port?, comment? }` where
// `name` is the fully qualified record name (in ASCII) and `value` is the
// record data as entered in a provider's dashboard.
//
// `user` is the domain's admin viewing it (a domain on the free plan forwards
// to their email address), and `existingTXT` the domain's current
// forwarding TXT records (on the free plan they are kept as they are).
//
function getDnsRecords(domain, user, existingTXT = []) {
  const name = punycode.toASCII(domain.name).toLowerCase();
  const isPaid = domain.plan !== 'free';
  const records = [];

  for (const exchange of getExchanges()) {
    records.push({ name, type: 'MX', priority: 0, value: exchange });
  }

  if (isPaid)
    records.push({
      name,
      type: 'TXT',
      value: `${config.recordPrefix}-site-verification=${domain.verification_record}`
    });
  else if (Array.isArray(existingTXT) && existingTXT.length > 0)
    for (const value of existingTXT) {
      records.push({ name, type: 'TXT', value });
    }
  else
    records.push({
      name,
      type: 'TXT',
      value: `${config.recordPrefix}=${user?.email || ''}`
    });

  // sending mail, mailboxes, and autodiscovery are on paid plans
  if (!isPaid) return records;

  records.push({
    name,
    type: 'TXT',
    value: 'v=spf1 include:spf.forwardemail.net -all',
    comment:
      'SPF: a name has one SPF record, so if you already have one, add include:spf.forwardemail.net to it instead'
  });

  if (domain.dkim_key_selector && domain.dkim_public_key) {
    const key = Buffer.isBuffer(domain.dkim_public_key)
      ? domain.dkim_public_key
      : Buffer.from(domain.dkim_public_key.buffer || domain.dkim_public_key);
    records.push({
      name: `${domain.dkim_key_selector}._domainkey.${name}`,
      type: 'TXT',
      value: `v=DKIM1; k=rsa; p=${key.toString('base64')};`,
      comment: 'DKIM'
    });
  }

  if (domain.return_path)
    records.push({
      name: `${domain.return_path}.${name}`,
      type: 'CNAME',
      value: getWebHost(),
      comment: 'Return-Path'
    });

  records.push(
    {
      name: `_dmarc.${name}`,
      type: 'TXT',
      value: `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${
        domain.id || domain._id
      }@${config.webHost};`,
      comment:
        'DMARC: a name has one DMARC record, so if you already have one, replace it with this one'
    },
    {
      name: `autoconfig.${name}`,
      type: 'CNAME',
      value: 'autoconfig.forwardemail.net',
      comment: 'Email client autodiscovery (CNAME and SRV records)'
    },
    {
      name: `autodiscover.${name}`,
      type: 'CNAME',
      value: 'autodiscover.forwardemail.net'
    }
  );

  // RFC 6186 (email) and RFC 6764 (CalDAV and CardDAV) for the secure
  // protocols (the records with a target of "." that say a plaintext protocol
  // is not offered are optional, and some providers refuse that target)
  for (const [service, priority, weight, port, target] of [
    ['_imaps._tcp', 0, 1, 993, 'imap.forwardemail.net'],
    ['_submissions._tcp', 0, 1, 465, 'smtp.forwardemail.net'],
    ['_submission._tcp', 5, 1, 587, 'smtp.forwardemail.net'],
    ['_pop3s._tcp', 10, 1, 995, 'pop3.forwardemail.net'],
    ['_caldavs._tcp', 0, 1, 443, 'caldav.forwardemail.net'],
    ['_carddavs._tcp', 0, 1, 443, 'carddav.forwardemail.net']
  ]) {
    records.push({
      name: `${service}.${name}`,
      type: 'SRV',
      priority,
      weight,
      port,
      value: target
    });
  }

  return records;
}

// a host name as an absolute name in a zone file (with the trailing dot)
function absolute(host) {
  return host === '.' || host.endsWith('.') ? host : `${host}.`;
}

// TXT data as quoted strings of at most 255 characters each
function quote(value) {
  const strings = [];
  for (let i = 0; i < value.length; i += MAX_TXT_STRING_LENGTH) {
    strings.push(
      `"${value
        .slice(i, i + MAX_TXT_STRING_LENGTH)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')}"`
    );
  }

  return strings.join(' ') || '""';
}

function getRecordData(record) {
  switch (record.type) {
    case 'MX': {
      return `${record.priority} ${absolute(record.value)}`;
    }

    case 'SRV': {
      return `${record.priority} ${record.weight} ${record.port} ${absolute(
        record.value
      )}`;
    }

    case 'CNAME': {
      return absolute(record.value);
    }

    case 'TXT': {
      return quote(record.value);
    }

    default: {
      return record.value;
    }
  }
}

//
// A zone file (RFC 1035 master file format) with every record a domain needs,
// for import into a DNS provider or to copy from. Names are absolute (with a
// trailing dot) and TXT data is quoted, so it is read the same everywhere.
//
function getZoneFile(domain, user, { existingTXT, now = new Date() } = {}) {
  const records = getDnsRecords(domain, user, existingTXT);
  const name = punycode.toASCII(domain.name).toLowerCase();
  const width = Math.max(...records.map((record) => record.name.length)) + 2;
  const lines = [
    `; DNS records for ${name} from Forward Email (${config.urls.web})`,
    `; Generated ${now.toISOString()}`,
    ';',
    '; Import this file into your DNS provider, or copy the records you need.',
    '; Existing MX records for this name must be removed.'
  ];

  for (const record of records) {
    if (record.comment) lines.push('', `; ${record.comment}`);
    lines.push(
      `${absolute(record.name).padEnd(width)} ${TTL} IN ${record.type.padEnd(
        5
      )} ${getRecordData(record)}`
    );
  }

  return `${lines.join('\n')}\n`;
}

module.exports = getZoneFile;
module.exports.getDnsRecords = getDnsRecords;
module.exports.TTL = TTL;
