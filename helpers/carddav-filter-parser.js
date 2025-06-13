/**
 * CardDAV Filter Parser - Focused on Filter Logic Only
 * All XML handling consolidated into xmlHelpers
 * Updated to work with normalized tags (without namespace prefixes)
 *
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('#helpers/lodash');

class CardDAVFilterParser {
  constructor() {
    // Map vCard properties to database fields
    this.propertyMap = {
      FN: 'fullName',
      EMAIL: 'emails',
      TEL: 'phoneNumbers',
      UID: 'uid'
      // Other properties (ORG, TITLE, NOTE, etc.) will search in 'content' field
    };

    // Properties that are stored as arrays in the database
    this.arrayProperties = {
      EMAIL: true,
      TEL: true
    };

    // Parameter mappings for array properties
    this.parameterMap = {
      TYPE: 'type',
      PREF: 'pref'
    };
  }

  /**
   * Parse CardDAV filter into MongoDB query
   * @param {Object} xmlBody - Parsed XML body
   * @returns {Object} MongoDB query object
   */
  parseFilter(xmlBody) {
    // Updated to work with normalized tags (without namespace prefixes)
    const addressbookQuery = xmlBody['addressbook-query'];
    if (!addressbookQuery || !addressbookQuery.filter) {
      return {}; // No filter means return all
    }

    const { filter } = addressbookQuery;
    return this.processFilter(filter);
  }

  /**
   * Process a filter element
   * @param {Object} filter - The filter element (previously card:filter)
   * @returns {Object} MongoDB query object
   */
  processFilter(filter) {
    const testType = filter._attr?.test || 'anyof';
    // Updated to work with normalized tags (without namespace prefixes)
    const propFilters = Array.isArray(filter['prop-filter'])
      ? filter['prop-filter']
      : filter['prop-filter']
      ? [filter['prop-filter']]
      : [];

    if (propFilters.length === 0) {
      return {};
    }

    const queries = propFilters
      .map((propFilter) => this.processPropFilter(propFilter))
      .filter((q) => Object.keys(q).length > 0);

    if (queries.length === 0) {
      return {};
    }

    if (queries.length === 1) {
      return queries[0];
    }

    // Multiple queries - combine with AND or OR
    if (testType === 'allof') {
      return { $and: queries };
    }

    return { $or: queries };
  }

  /**
   * Process a prop-filter element
   * @param {Object} propFilter - The prop-filter element (previously card:prop-filter)
   * @returns {Object} MongoDB query object
   */
  processPropFilter(propFilter) {
    const propertyName = propFilter._attr?.name;
    if (!propertyName) {
      return {};
    }

    const dbField = this.propertyMap[propertyName];
    if (!dbField) {
      // Unknown property - search in content if it's a valid vCard property
      if (this.isValidVCardProperty(propertyName)) {
        return this.processContentPropFilter(propFilter, propertyName);
      }

      return {}; // Skip unknown properties
    }

    const queries = [];

    // Handle is-not-defined - Updated to work with normalized tags
    if (propFilter['is-not-defined']) {
      queries.push(
        this.processIsNotDefined(
          propertyName,
          dbField,
          propFilter['is-not-defined']
        )
      );
    }

    // Handle text-match elements - Updated to work with normalized tags
    const textMatches = Array.isArray(propFilter['text-match'])
      ? propFilter['text-match']
      : propFilter['text-match']
      ? [propFilter['text-match']]
      : [];

    for (const textMatch of textMatches) {
      queries.push(this.processTextMatch(propertyName, dbField, textMatch));
    }

    // Handle param-filter elements - Updated to work with normalized tags
    const paramFilters = Array.isArray(propFilter['param-filter'])
      ? propFilter['param-filter']
      : propFilter['param-filter']
      ? [propFilter['param-filter']]
      : [];

    for (const paramFilter of paramFilters) {
      queries.push(this.processParamFilter(propertyName, dbField, paramFilter));
    }

    // Combine queries for this property
    const validQueries = queries.filter((q) => Object.keys(q).length > 0);
    if (validQueries.length === 0) {
      return {};
    }

    if (validQueries.length === 1) {
      return validQueries[0];
    }

    return { $and: validQueries };
  }

  /**
   * Process content-based prop-filter (for properties not extracted to fields)
   * @param {Object} propFilter - The prop-filter element (previously card:prop-filter)
   * @param {string} propertyName - vCard property name
   * @returns {Object} MongoDB query object
   */
  processContentPropFilter(propFilter, propertyName) {
    const queries = [];

    // Handle is-not-defined - Updated to work with normalized tags
    if (propFilter['is-not-defined']) {
      const negateCondition =
        propFilter['is-not-defined']._attr?.['negate-condition'] === 'yes';
      if (negateCondition) {
        // Property must exist in content
        queries.push({
          content: { $regex: `^${propertyName}:`, $options: 'm' }
        });
      } else {
        // Property must not exist in content
        queries.push({
          content: { $not: new RegExp(`^${propertyName}:`, 'm') }
        });
      }
    }

    // Handle text-match elements - Updated to work with normalized tags
    const textMatches = Array.isArray(propFilter['text-match'])
      ? propFilter['text-match']
      : propFilter['text-match']
      ? [propFilter['text-match']]
      : [];

    for (const textMatch of textMatches) {
      queries.push(
        this.buildContentTextQuery(
          propertyName,
          textMatch._ || textMatch,
          textMatch._attr?.['match-type'] || 'contains',
          textMatch._attr?.collation || 'i;unicode-casemap'
        )
      );
    }

    // Handle param-filter elements - Updated to work with normalized tags
    const paramFilters = Array.isArray(propFilter['param-filter'])
      ? propFilter['param-filter']
      : propFilter['param-filter']
      ? [propFilter['param-filter']]
      : [];

    for (const paramFilter of paramFilters) {
      queries.push(this.processContentParamFilter(propertyName, paramFilter));
    }

    const validQueries = queries.filter((q) => Object.keys(q).length > 0);
    if (validQueries.length === 0) {
      return {};
    }

    if (validQueries.length === 1) {
      return validQueries[0];
    }

    return { $and: validQueries };
  }

  /**
   * Process an is-not-defined element
   * @param {string} propertyName - vCard property name
   * @param {string} dbField - Database field name
   * @param {Object} isNotDefined - The is-not-defined element (previously card:is-not-defined)
   * @returns {Object} MongoDB query object
   */
  processIsNotDefined(propertyName, dbField, isNotDefined) {
    const negateCondition = isNotDefined._attr?.['negate-condition'] === 'yes';

    if (this.arrayProperties[propertyName]) {
      // For array properties
      if (negateCondition) {
        // Property must exist (array not empty)
        return { [dbField]: { $exists: true, $not: { $size: 0 } } };
      }

      // Property must not exist (array empty or missing)
      return {
        $or: [{ [dbField]: { $exists: false } }, { [dbField]: { $size: 0 } }]
      };
    }

    // For simple properties
    if (negateCondition) {
      // Property must exist
      return { [dbField]: { $exists: true, $nin: [null, ''] } };
    }

    // Property must not exist
    return {
      $or: [
        { [dbField]: { $exists: false } },
        { [dbField]: null },
        { [dbField]: '' }
      ]
    };
  }

  /**
   * Process a text-match element
   * @param {string} propertyName - vCard property name
   * @param {string} dbField - Database field name
   * @param {Object} textMatch - The text-match element (previously card:text-match)
   * @returns {Object} MongoDB query object
   */
  processTextMatch(propertyName, dbField, textMatch) {
    const searchValue = textMatch._ || textMatch;
    if (!searchValue || typeof searchValue !== 'string') {
      return {};
    }

    const collation = textMatch._attr?.collation || 'i;unicode-casemap';
    const matchType = textMatch._attr?.['match-type'] || 'contains';
    const negateCondition = textMatch._attr?.['negate-condition'] === 'yes';

    let query;

    if (this.arrayProperties[propertyName]) {
      // Handle array properties (emails, phoneNumbers)
      query = this.buildArrayTextQuery(
        dbField,
        searchValue,
        matchType,
        collation
      );
    } else if (dbField === 'content') {
      // Handle content-based properties
      query = this.buildContentTextQuery(
        propertyName,
        searchValue,
        matchType,
        collation
      );
    } else {
      // Handle simple properties
      query = this.buildTextQuery(dbField, searchValue, matchType, collation);
    }

    if (negateCondition && query) {
      query = { $not: query };
    }

    return query || {};
  }

  /**
   * Process a param-filter element
   * @param {string} propertyName - vCard property name
   * @param {string} dbField - Database field name
   * @param {Object} paramFilter - The param-filter element (previously card:param-filter)
   * @returns {Object} MongoDB query object
   */
  processParamFilter(propertyName, dbField, paramFilter) {
    const paramName = paramFilter._attr?.name;
    if (!paramName) {
      return {};
    }

    if (!this.arrayProperties[propertyName]) {
      // For non-array properties, search in content
      return this.processContentParamFilter(propertyName, paramFilter);
    }

    const paramFieldName =
      this.parameterMap[paramName] || paramName.toLowerCase();

    // Handle is-not-defined for parameter - Updated to work with normalized tags
    if (paramFilter['is-not-defined']) {
      const negateCondition =
        paramFilter['is-not-defined']._attr?.['negate-condition'] === 'yes';
      if (negateCondition) {
        // Parameter must exist
        return {
          [dbField]: {
            $elemMatch: {
              [paramFieldName]: { $exists: true, $ne: null }
            }
          }
        };
      }

      // Parameter must not exist
      return {
        $or: [
          { [dbField]: { $size: 0 } },
          {
            [dbField]: {
              $not: {
                $elemMatch: {
                  [paramFieldName]: { $exists: true, $ne: null }
                }
              }
            }
          }
        ]
      };
    }

    // Handle text-match for parameter - Updated to work with normalized tags
    const textMatch = paramFilter['text-match'];
    if (textMatch) {
      const searchValue = textMatch._ || textMatch;
      const collation = textMatch._attr?.collation || 'i;unicode-casemap';
      const matchType = textMatch._attr?.['match-type'] || 'contains';
      const negateCondition = textMatch._attr?.['negate-condition'] === 'yes';

      const isCaseInsensitive = collation.includes('i;');
      const flags = isCaseInsensitive ? 'i' : '';
      const regex = this.buildRegexPattern(searchValue, matchType, flags);

      let query = {
        [dbField]: {
          $elemMatch: {
            [paramFieldName]: regex
          }
        }
      };

      if (negateCondition) {
        query = { $not: query };
      }

      return query;
    }

    return {};
  }

  /**
   * Process parameter filter for content-based properties
   * @param {string} propertyName - vCard property name
   * @param {Object} paramFilter - The param-filter element (previously card:param-filter)
   * @returns {Object} MongoDB query object
   */
  processContentParamFilter(propertyName, paramFilter) {
    const paramName = paramFilter._attr?.name;
    // Updated to work with normalized tags
    const textMatch = paramFilter['text-match'];

    if (!textMatch) {
      return {};
    }

    const searchValue = textMatch._ || textMatch;
    const collation = textMatch._attr?.collation || 'i;unicode-casemap';
    const matchType = textMatch._attr?.['match-type'] || 'contains';
    const negateCondition = textMatch._attr?.['negate-condition'] === 'yes';

    const isCaseInsensitive = collation.includes('i;');
    const flags = isCaseInsensitive ? 'im' : 'm';

    // Build regex to match parameter in vCard content based on match type
    const escapedValue = _.escapeRegExp(searchValue); // this.escapeRegex(searchValue);
    let pattern;

    switch (matchType) {
      case 'equals': {
        pattern = `^${propertyName}:[^\\r\\n]*${paramName}=${escapedValue}(?:[;:]|$)`;
        break;
      }

      case 'contains': {
        pattern = `^${propertyName}:[^\\r\\n]*${paramName}=[^;:]*${escapedValue}`;
        break;
      }

      case 'starts-with': {
        pattern = `^${propertyName}:[^\\r\\n]*${paramName}=${escapedValue}`;
        break;
      }

      case 'ends-with': {
        pattern = `^${propertyName}:[^\\r\\n]*${paramName}=[^;:]*${escapedValue}(?:[;:]|$)`;
        break;
      }

      default: {
        pattern = `^${propertyName}:[^\\r\\n]*${paramName}=[^;:]*${escapedValue}`;
      }
    }

    let query = {
      content: { $regex: pattern, $options: flags }
    };

    if (negateCondition) {
      query = { $not: query };
    }

    return query;
  }

  /**
   * Build regex pattern based on match type
   * @param {string} value - Search value
   * @param {string} matchType - Type of match
   * @param {string} flags - Regex flags
   * @returns {Object} MongoDB regex object
   */
  buildRegexPattern(value, matchType, flags) {
    const escapedValue = _.escapeRegExp(value); // escapeRegExp(value); // this.escapeRegex(value);

    switch (matchType) {
      case 'equals': {
        return { $regex: `^${escapedValue}$`, $options: flags };
      }

      case 'contains': {
        return { $regex: escapedValue, $options: flags };
      }

      case 'starts-with': {
        return { $regex: `^${escapedValue}`, $options: flags };
      }

      case 'ends-with': {
        return { $regex: `${escapedValue}$`, $options: flags };
      }

      default: {
        return { $regex: escapedValue, $options: flags };
      }
    }
  }

  /**
   * Build text query for simple properties
   * @param {string} field - Database field name
   * @param {string} value - Search value
   * @param {string} matchType - Type of match
   * @param {string} collation - Collation type
   * @returns {Object} MongoDB query object
   */
  buildTextQuery(field, value, matchType, collation) {
    const isCaseInsensitive = collation.includes('i;');
    const flags = isCaseInsensitive ? 'i' : '';
    return { [field]: this.buildRegexPattern(value, matchType, flags) };
  }

  /**
   * Build text query for array properties
   * @param {string} field - Database field name
   * @param {string} value - Search value
   * @param {string} matchType - Type of match
   * @param {string} collation - Collation type
   * @returns {Object} MongoDB query object
   */
  buildArrayTextQuery(field, value, matchType, collation) {
    const isCaseInsensitive = collation.includes('i;');
    const flags = isCaseInsensitive ? 'i' : '';
    const regex = this.buildRegexPattern(value, matchType, flags);

    return {
      [field]: {
        $elemMatch: {
          value: regex
        }
      }
    };
  }

  /**
   * Build text query for content-based properties
   * @param {string} propertyName - vCard property name
   * @param {string} value - Search value
   * @param {string} matchType - Type of match
   * @param {string} collation - Collation type
   * @returns {Object} MongoDB query object
   */
  buildContentTextQuery(propertyName, value, matchType, collation) {
    const isCaseInsensitive = collation.includes('i;');
    const flags = isCaseInsensitive ? 'im' : 'm';
    const escapedValue = _.escapeRegExp(value); // this.escapeRegex(value);

    // Build regex to match property value in vCard content
    let pattern;
    switch (matchType) {
      case 'equals': {
        pattern = `^${propertyName}:${escapedValue}$`;
        break;
      }

      case 'contains': {
        pattern = `^${propertyName}:[^\\r\\n]*${escapedValue}`;
        break;
      }

      case 'starts-with': {
        pattern = `^${propertyName}:${escapedValue}`;
        break;
      }

      case 'ends-with': {
        pattern = `^${propertyName}:[^\\r\\n]*${escapedValue}$`;
        break;
      }

      default: {
        pattern = `^${propertyName}:[^\\r\\n]*${escapedValue}`;
      }
    }

    return { content: { $regex: pattern, $options: flags } };
  }

  /**
   * Escape special regex characters
   * @param {string} string - String to escape
   * @returns {string} Escaped string
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Check if a property name is a valid vCard property
   * @param {string} propertyName - Property name to check
   * @returns {boolean} True if valid vCard property
   */
  isValidVCardProperty(propertyName) {
    const validProperties = [
      'FN',
      'N',
      'NICKNAME',
      'PHOTO',
      'BDAY',
      'ANNIVERSARY',
      'GENDER',
      'ADR',
      'TEL',
      'EMAIL',
      'IMPP',
      'LANG',
      'TZ',
      'GEO',
      'TITLE',
      'ROLE',
      'LOGO',
      'ORG',
      'MEMBER',
      'RELATED',
      'CATEGORIES',
      'NOTE',
      'PRODID',
      'REV',
      'SOUND',
      'UID',
      'CLIENTPIDMAP',
      'URL',
      'KEY',
      'FBURL',
      'CALADRURI',
      'CALURI'
    ];
    return validProperties.includes(propertyName.toUpperCase());
  }
}

module.exports = CardDAVFilterParser;
