/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');

const { parseStringPromise, processors } = require('xml2js');
const xmlbuilder = require('xmlbuilder');

/**
 * Encode special characters for XML content to prevent parsing errors
 * @param {string} str - String to encode
 * @returns {string} - XML-safe encoded string
 */
function encodeXMLEntities(str) {
  if (typeof str !== 'string') {
    return str;
  }

  return str
    .replace(/&/g, '&amp;') // Must be first to avoid double-encoding
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Parse XML string into a JavaScript object with security protections
 * @param {string} xmlString - XML string to parse
 * @returns {Promise<Object>} - Parsed XML as JavaScript object
 */
async function parseXML(xmlString) {
  // Validate input
  if (typeof xmlString !== 'string') {
    throw new TypeError('XML input must be a string');
  }

  // Check XML size limit (1MB)
  if (xmlString.length > 1024 * 1024) {
    throw new Error('XML input too large');
  }

  // Check for XML bomb patterns
  if (xmlString.includes('<!ENTITY') || xmlString.includes('<!DOCTYPE')) {
    throw new Error('XML entities and DOCTYPE declarations are not allowed');
  }

  // Parse with security options
  return parseStringPromise(xmlString, {
    explicitArray: false,
    explicitCharkey: false,
    trim: true,
    attrkey: '_attr',
    charkey: '_',
    normalizeTags: true,
    tagNameProcessors: [processors.stripPrefix]
  });
}

/**
 * Extract requested properties from PROPFIND XML or CardDAV query XML
 * Enhanced to handle both PROPFIND and CardDAV addressbook-query/multiget
 * @param {Object} xmlBody - Parsed XML body
 * @returns {Array<string>} - Array of requested property names
 */
function extractRequestedProps(xmlBody) {
  const props = [];

  // Handle PROPFIND requests (existing functionality)
  if (xmlBody && xmlBody.propfind && xmlBody.propfind.prop) {
    const requestedProps = xmlBody.propfind.prop;
    props.push(...Object.keys(requestedProps));
  }

  // Handle addressbook-query requests (new functionality)
  else if (
    xmlBody &&
    xmlBody['addressbook-query'] &&
    xmlBody['addressbook-query'].prop
  ) {
    const requestedProps = xmlBody['addressbook-query'].prop;
    props.push(...Object.keys(requestedProps));
  }

  // Handle addressbook-multiget requests (new functionality)
  else if (
    xmlBody &&
    xmlBody['addressbook-multiget'] &&
    xmlBody['addressbook-multiget'].prop
  ) {
    const requestedProps = xmlBody['addressbook-multiget'].prop;
    props.push(...Object.keys(requestedProps));
  }

  // Default props if none specified
  if (props.length === 0) {
    return ['displayname', 'resourcetype', 'getetag', 'address-data'];
  }

  return props;
}

/**
 * Extract hrefs from multiget request (NEW FUNCTION)
 * @param {Object} xmlBody - Parsed XML body
 * @returns {Array<string>} Array of href values
 */
function extractHrefs(xmlBody) {
  const hrefs = [];

  if (
    xmlBody &&
    xmlBody['addressbook-multiget'] &&
    xmlBody['addressbook-multiget'].href
  ) {
    const hrefData = xmlBody['addressbook-multiget'].href;

    if (Array.isArray(hrefData)) {
      hrefs.push(...hrefData.map((href) => href._ || href));
    } else {
      hrefs.push(hrefData._ || hrefData);
    }
  }

  return hrefs;
}

/**
 * Validate filter structure before processing (NEW FUNCTION)
 * @param {Object} xmlBody - Parsed XML body
 * @returns {Object} Validation result with isValid and error
 */

function validateFilter(xmlBody) {
  try {
    const addressbookQuery = xmlBody && xmlBody['addressbook-query'];
    if (!addressbookQuery) {
      return { isValid: true }; // No query is valid (returns all)
    }

    const { filter } = addressbookQuery;
    if (!filter) {
      return { isValid: true }; // No filter is valid (returns all)
    }

    // Check for prop-filter elements
    const propFilters = Array.isArray(filter['prop-filter'])
      ? filter['prop-filter']
      : filter['prop-filter']
      ? [filter['prop-filter']]
      : [];

    for (const propFilter of propFilters) {
      // Validate prop-filter has name attribute
      if (!propFilter._attr || !propFilter._attr.name) {
        return {
          isValid: false,
          error: 'prop-filter element must have a name attribute'
        };
      }

      // Validate text-match elements
      const textMatches = Array.isArray(propFilter['text-match'])
        ? propFilter['text-match']
        : propFilter['text-match']
        ? [propFilter['text-match']]
        : [];

      for (const textMatch of textMatches) {
        if (textMatch._attr) {
          const matchType = textMatch._attr['match-type'];
          if (
            matchType &&
            !['equals', 'contains', 'starts-with', 'ends-with'].includes(
              matchType
            )
          ) {
            return {
              isValid: false,
              error: `Invalid match-type: ${matchType}`
            };
          }

          const { collation } = textMatch._attr;
          if (
            collation &&
            ![
              'i;ascii-casemap',
              'i;unicode-casemap',
              'unicode-casemap'
            ].includes(collation)
          ) {
            return {
              isValid: false,
              error: `Invalid collation: ${collation}`
            };
          }
        }
      }

      // Validate param-filter elements
      const paramFilters = Array.isArray(propFilter['param-filter'])
        ? propFilter['param-filter']
        : propFilter['param-filter']
        ? [propFilter['param-filter']]
        : [];

      for (const paramFilter of paramFilters) {
        if (!paramFilter._attr || !paramFilter._attr.name) {
          return {
            isValid: false,
            error: 'param-filter element must have a name attribute'
          };
        }
      }
    }

    return { isValid: true };
  } catch (err) {
    return {
      isValid: false,
      error: `Filter validation error: ${err.message}`
    };
  }
}

/**
 * Generate error response for invalid filters (NEW FUNCTION)
 * @param {string} errorMessage - Error message
 * @returns {string} XML error response
 */
function getFilterErrorXML(errorMessage) {
  const xml = xmlbuilder.create('d:multistatus', {
    version: '1.0',
    // eslint-disable-next-line unicorn/text-encoding-identifier-case
    encoding: 'UTF-8'
  });

  xml.att('xmlns:d', 'DAV:');
  xml.att('xmlns:card', 'urn:ietf:params:xml:ns:carddav');

  const response = xml.ele('d:response');
  response.ele('d:status', {}, 'HTTP/1.1 400 Bad Request');
  response.ele('d:error').ele('card:valid-filter', {}, errorMessage);

  return xml.end({ pretty: true });
}

/**
 * Generate a multistatus XML response (EXISTING FUNCTION - PRESERVED)
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
        if (
          prop.value &&
          prop.value.startsWith('<') &&
          prop.value.endsWith('>')
        ) {
          // Handle XML value
          propEl.ele(prop.name).raw(prop.value);
        } else {
          // Handle text value
          propEl.ele(prop.name, {}, prop.value || '');
        }
      }

      propstatEl.ele('d:status', {}, `HTTP/1.1 ${propstat.status}`);
    }
  }

  return xml.end({ pretty: true });
}

/**
 * Generate XML for PROPFIND response for a contact (EXISTING FUNCTION - PRESERVED)
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
      case 'getetag': {
        propstat.props.push({
          name: 'd:getetag',
          value: contact.etag
        });
        break;
      }

      case 'getcontenttype': {
        propstat.props.push({
          name: 'd:getcontenttype',
          value: 'text/vcard; charset=utf-8'
        });
        break;
      }

      case 'resourcetype': {
        propstat.props.push({
          name: 'd:resourcetype',
          value: ''
        });
        break;
      }

      case 'address-data': {
        propstat.props.push({
          name: 'card:address-data',
          value: encodeXMLEntities(contact.content)
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
 * Generate XML for addressbook-query REPORT response (ENHANCED EXISTING FUNCTION)
 * Enhanced to handle both 'vcard' and 'content' properties and more property types
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
        case 'getetag': {
          propstat.props.push({
            name: 'd:getetag',
            value: contact.etag
          });
          break;
        }

        case 'address-data': {
          // Handle both 'vcard' and 'content' properties for backward compatibility
          const vcardContent = contact.vcard || contact.content;
          propstat.props.push({
            name: 'card:address-data',
            value: encodeXMLEntities(vcardContent)
          });
          break;
        }

        case 'getcontenttype': {
          propstat.props.push({
            name: 'd:getcontenttype',
            value: 'text/vcard; charset=utf-8'
          });
          break;
        }

        case 'resourcetype': {
          propstat.props.push({
            name: 'd:resourcetype',
            value: ''
          });
          break;
        }

        case 'getcontentlength': {
          const vcardContent = contact.vcard || contact.content || '';
          propstat.props.push({
            name: 'd:getcontentlength',
            value: Buffer.byteLength(vcardContent, 'utf8').toString()
          });
          break;
        }

        case 'getlastmodified': {
          propstat.props.push({
            name: 'd:getlastmodified',
            value: new Date().toUTCString()
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
 * Generate addressbook collection PROPFIND response (NEW FUNCTION)
 * @param {Object} addressBook - AddressBook object
 * @param {Array<string>} props - Requested properties
 * @param {string} href - AddressBook href
 * @returns {string} XML string
 */
function getAddressbookPropfindXML(addressBook, props, href) {
  const propElements = [];

  for (const prop of props) {
    switch (prop) {
      case 'resourcetype': {
        propElements.push({
          name: 'd:resourcetype',
          value: '<d:collection/><card:addressbook/>'
        });
        break;
      }

      case 'displayname': {
        propElements.push({
          name: 'd:displayname',
          value: encodeXMLEntities(addressBook.name)
        });
        break;
      }

      case 'addressbook-description': {
        propElements.push({
          name: 'card:addressbook-description',
          value: encodeXMLEntities(addressBook.description || '')
        });
        break;
      }

      case 'supported-address-data': {
        propElements.push({
          name: 'card:supported-address-data',
          value:
            '<card:address-data-type content-type="text/vcard" version="3.0"/>'
        });
        break;
      }

      case 'max-resource-size': {
        propElements.push({
          name: 'card:max-resource-size',
          value: '1048576' // 1MB
        });
        break;
      }

      case 'sync-token': {
        propElements.push({
          name: 'd:sync-token',
          value: addressBook.synctoken
        });
        break;
      }

      case 'getctag': {
        propElements.push({
          name: 'd:getctag',
          value: addressBook.synctoken
        });
        break;
      }

      default: {
        // Unknown property - return 404
        propElements.push({
          name: prop,
          status: '404 Not Found'
        });
        break;
      }
    }
  }

  const responses = [
    {
      href,
      propstat: [
        {
          props: propElements.filter((p) => !p.status),
          status: '200 OK'
        }
      ]
    }
  ];

  // Add 404 propstat if there are any unknown properties
  const notFoundProps = propElements.filter((p) => p.status);
  if (notFoundProps.length > 0) {
    responses[0].propstat.push({
      props: notFoundProps,
      status: '404 Not Found'
    });
  }

  return getMultistatusXML(responses);
}

/**
 * Generate XML for sync-collection REPORT response (EXISTING FUNCTION - PRESERVED)
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
          case 'getetag': {
            propstat.props.push({
              name: 'd:getetag',
              value: change.etag
            });
            break;
          }

          case 'address-data': {
            propstat.props.push({
              name: 'card:address-data',
              value: encodeXMLEntities(change.vcard)
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
        if (
          prop.value &&
          prop.value.startsWith('<') &&
          prop.value.endsWith('>')
        ) {
          // Handle XML value
          propEl.ele(prop.name).raw(prop.value);
        } else {
          // Handle text value
          propEl.ele(prop.name, {}, prop.value || '');
        }
      }

      propstatEl.ele('d:status', {}, `HTTP/1.1 ${propstat.status}`);
    }
  }

  xml.ele('d:sync-token', {}, addressBook.synctoken);

  return xml.end({ pretty: true });
}

/**
 * Validate vCard content before processing
 * @param {string} vCardString - vCard string to validate
 * @throws {Error} If vCard is invalid
 */
function validateVCard(vCardString) {
  // Validate input type
  if (typeof vCardString !== 'string') {
    throw new TypeError('vCard input must be a string');
  }

  // Check size limit (1MB as advertised in max-resource-size)
  if (vCardString.length > 1024 * 1024) {
    throw new Error('vCard exceeds maximum size of 1MB');
  }

  // Validate basic vCard structure
  if (!vCardString.includes('BEGIN:VCARD')) {
    throw new Error('vCard must contain BEGIN:VCARD');
  }

  if (!vCardString.includes('END:VCARD')) {
    throw new Error('vCard must contain END:VCARD');
  }

  // Validate VERSION property exists (required by RFC 6350)
  if (!/^VERSION:[34]\.\d/m.test(vCardString)) {
    throw new Error('vCard must contain valid VERSION property (3.0 or 4.0)');
  }

  // Validate FN property exists (required by RFC 6350)
  if (!/^FN:/m.test(vCardString)) {
    throw new Error('vCard must contain FN (Formatted Name) property');
  }

  return true;
}

/**
 * Parse vCard string into a JavaScript object (EXISTING FUNCTION - PRESERVED)
 * @param {string} vCardString - vCard string to parse
 * @returns {Object} - Parsed vCard as JavaScript object
 */
function parseVCard(vCardString) {
  // Validate before parsing
  validateVCard(vCardString);

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
 * Generate ETag for a vCard (EXISTING FUNCTION - PRESERVED)
 * @param {string} vCardContent - vCard content
 * @returns {string} - ETag
 */
function generateETag(vCardContent) {
  return `"${crypto.createHash('md5').update(vCardContent).digest('hex')}"`;
}

module.exports = {
  // Existing functions (preserved)
  parseXML,
  getMultistatusXML,
  getPropfindContactXML,
  getSyncCollectionXML,
  parseVCard,
  generateETag,

  // Enhanced existing functions
  extractRequestedProps,
  getAddressbookQueryXML,

  // New functions for CardDAV filtering
  extractHrefs,
  validateFilter,
  getFilterErrorXML,
  getAddressbookPropfindXML,

  // Entity encoding function
  encodeXMLEntities,

  // vCard validation
  validateVCard
};
