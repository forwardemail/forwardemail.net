/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { parseStringPromise } = require('xml2js');
const xmlbuilder = require('xmlbuilder');

/**
 * Parse XML string into a JavaScript object
 * @param {string} xmlString - XML string to parse
 * @returns {Promise<Object>} - Parsed XML as JavaScript object
 */
async function parseXML(xmlString) {
  console.log('xmlString', xmlString);
  const result = await parseStringPromise(xmlString, {
    explicitArray: false,
    explicitCharkey: false,
    trim: true,
    attrkey: '_attr',
    charkey: '_',
    normalizeTags: false
  });
  return result;
}

/**
 * Extract requested properties from PROPFIND XML
 * @param {Object} xmlBody - Parsed XML body
 * @returns {Array<string>} - Array of requested property names
 */
function extractRequestedProps(xmlBody) {
  const props = [];

  if (!xmlBody || !xmlBody['d:propfind'] || !xmlBody['d:propfind']['d:prop']) {
    return [
      'd:displayname',
      'd:resourcetype',
      'd:getetag',
      'card:address-data'
    ];
  }

  const requestedProps = xmlBody['d:propfind']['d:prop'];

  props.push(...Object.keys(requestedProps));
  // for (const prop in requestedProps) {
  //   props.push(prop);
  // }

  return props;
}

/**
 * Generate a multistatus XML response
 * @param {Array<Object>} responses - Array of response objects
 * @returns {string} - XML string
 */
function getMultistatusXML(responses) {
  const xml = xmlbuilder.create('d:multistatus', {
    version: '1.0',
    // eslint-disable-next-line unicorn/text-encoding-identifier-case
    encoding: 'UTF-8'
  });

  xml.att('xmlns:d', 'DAV:');
  xml.att('xmlns:card', 'urn:ietf:params:xml:ns:carddav');
  xml.att('xmlns:cs', 'http://calendarserver.org/ns/');

  for (const response of responses) {
    const responseEl = xml.ele('d:response');
    responseEl.ele('d:href', {}, response.href);

    for (const propstat of response.propstat) {
      const propstatEl = responseEl.ele('d:propstat');
      const propEl = propstatEl.ele('d:prop');

      for (const prop of propstat.props) {
        if (prop.value.startsWith('<') && prop.value.endsWith('>')) {
          // Handle XML value
          propEl.ele(prop.name).raw(prop.value);
        } else {
          // Handle text value
          propEl.ele(prop.name, {}, prop.value);
        }
      }

      propstatEl.ele('d:status', {}, `HTTP/1.1 ${propstat.status}`);
    }
  }

  return xml.end({ pretty: true });
}

/**
 * Generate XML for PROPFIND response for a contact
 * @param {Object} contact - Contact object
 * @param {Array<string>} props - Requested properties
 * @returns {string} - XML string
 */
function getPropfindContactXML(contact, props) {
  const responses = [
    {
      href: contact.href,
      propstat: [
        {
          props: [],
          status: '200 OK'
        }
      ]
    }
  ];

  const propstat = responses[0].propstat[0];

  for (const prop of props) {
    switch (prop) {
      case 'd:getetag': {
        propstat.props.push({ name: 'd:getetag', value: contact.etag });
        break;
      }

      case 'd:getcontenttype': {
        propstat.props.push({
          name: 'd:getcontenttype',
          value: 'text/vcard; charset=utf-8'
        });
        break;
      }

      case 'd:resourcetype': {
        propstat.props.push({ name: 'd:resourcetype', value: '' });
        break;
      }

      case 'card:address-data': {
        propstat.props.push({
          name: 'card:address-data',
          value: contact.content
        });
        break;
      }

      default: {
        // Property not supported
        break;
      }
    }
  }

  return getMultistatusXML(responses);
}

/**
 * Generate XML for addressbook-query REPORT response
 * @param {Array<Object>} contacts - Array of contact objects
 * @param {Array<string>} props - Requested properties
 * @returns {string} - XML string
 */
function getAddressbookQueryXML(contacts, props) {
  const responses = [];

  for (const contact of contacts) {
    const response = {
      href: contact.href,
      propstat: [
        {
          props: [],
          status: '200 OK'
        }
      ]
    };

    const propstat = response.propstat[0];

    for (const prop of props) {
      switch (prop) {
        case 'd:getetag': {
          propstat.props.push({ name: 'd:getetag', value: contact.etag });
          break;
        }

        case 'card:address-data': {
          propstat.props.push({
            name: 'card:address-data',
            value: contact.vcard
          });
          break;
        }

        default: {
          // Property not supported
          break;
        }
      }
    }

    responses.push(response);
  }

  return getMultistatusXML(responses);
}

/**
 * Generate XML for sync-collection REPORT response
 * @param {Object} addressBook - Address book object
 * @param {Array<Object>} changes - Array of change objects
 * @param {Array<string>} props - Requested properties
 * @returns {string} - XML string
 */
function getSyncCollectionXML(addressBook, changes, props) {
  const responses = [];

  for (const change of changes) {
    if (change.deleted) {
      responses.push({
        href: change.href,
        propstat: [
          {
            props: [],
            status: '404 Not Found'
          }
        ]
      });
    } else {
      const response = {
        href: change.href,
        propstat: [
          {
            props: [],
            status: '200 OK'
          }
        ]
      };

      const propstat = response.propstat[0];

      for (const prop of props) {
        switch (prop) {
          case 'd:getetag': {
            propstat.props.push({ name: 'd:getetag', value: change.etag });
            break;
          }

          case 'card:address-data': {
            propstat.props.push({
              name: 'card:address-data',
              value: change.vcard
            });
            break;
          }

          default: {
            // Property not supported
            break;
          }
        }
      }

      responses.push(response);
    }
  }

  const xml = xmlbuilder.create('d:multistatus', {
    version: '1.0',
    // eslint-disable-next-line unicorn/text-encoding-identifier-case
    encoding: 'UTF-8'
  });

  xml.att('xmlns:d', 'DAV:');
  xml.att('xmlns:card', 'urn:ietf:params:xml:ns:carddav');

  for (const response of responses) {
    const responseEl = xml.ele('d:response');
    responseEl.ele('d:href', {}, response.href);

    for (const propstat of response.propstat) {
      const propstatEl = responseEl.ele('d:propstat');
      const propEl = propstatEl.ele('d:prop');

      for (const prop of propstat.props) {
        if (prop.value.startsWith('<') && prop.value.endsWith('>')) {
          // Handle XML value
          propEl.ele(prop.name).raw(prop.value);
        } else {
          // Handle text value
          propEl.ele(prop.name, {}, prop.value);
        }
      }

      propstatEl.ele('d:status', {}, `HTTP/1.1 ${propstat.status}`);
    }
  }

  xml.ele('d:sync-token', {}, addressBook.synctoken);

  return xml.end({ pretty: true });
}

/**
 * Parse vCard string into a JavaScript object
 * @param {string} vCardString - vCard string to parse
 * @returns {Object} - Parsed vCard as JavaScript object
 */
function parseVCard(vCardString) {
  const result = {};
  const lines = vCardString.split(/\r\n|\r|\n/);

  let currentKey = null;
  let currentValue = null;

  for (const line of lines) {
    // Skip empty lines and BEGIN/END markers
    if (!line.trim() || line.startsWith('BEGIN:') || line.startsWith('END:')) {
      continue;
    }

    // Handle line folding (lines starting with space or tab)
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (currentKey && currentValue) {
        currentValue += line.trim();
        result[currentKey] = currentValue;
      }

      continue;
    }

    // Parse new property
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const keyPart = line.slice(0, Math.max(0, colonIndex));
      const valuePart = line.slice(Math.max(0, colonIndex + 1));

      // Handle parameters
      const semiIndex = keyPart.indexOf(';');
      currentKey =
        semiIndex > 0 ? keyPart.slice(0, Math.max(0, semiIndex)) : keyPart;

      currentValue = valuePart;

      // Store in result
      if (result[currentKey]) {
        // If property already exists, convert to array
        if (!Array.isArray(result[currentKey])) {
          result[currentKey] = [result[currentKey]];
        }

        result[currentKey].push(currentValue);
      } else {
        result[currentKey] = currentValue;
      }
    }
  }

  return result;
}

/**
 * Generate ETag for a vCard
 * @param {string} vCardContent - vCard content
 * @returns {string} - ETag
 */
function generateETag(vCardContent) {
  return `"${crypto.createHash('md5').update(vCardContent).digest('hex')}"`;
}

module.exports = {
  parseXML,
  extractRequestedProps,
  getMultistatusXML,
  getPropfindContactXML,
  getAddressbookQueryXML,
  getSyncCollectionXML,
  parseVCard,
  generateETag
};
