/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
const xmlHelpers = require('#helpers/carddav-xml');

// Test helper to create parser instance
test.beforeEach((t) => {
  t.context.parser = new CardDAVFilterParser();
});

// Basic Text Matching Tests
test('should handle FN search using fullName field', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'FN' },
          'text-match': {
            _attr: {
              collation: 'i;ascii-casemap',
              'match-type': 'contains'
            },
            _: 'John'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    fullName: { $regex: 'John', $options: 'i' }
  });
});

test('should handle EMAIL search using emails array', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'EMAIL' },
          'text-match': {
            _attr: {
              collation: 'i;ascii-casemap',
              'match-type': 'contains'
            },
            _: 'john@example.com'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    emails: {
      $elemMatch: {
        value: { $regex: 'john@example\\.com', $options: 'i' }
      }
    }
  });
});

test('should handle TEL search using phoneNumbers array', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'TEL' },
          'text-match': {
            _attr: {
              'match-type': 'contains'
            },
            _: '555-1234'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    phoneNumbers: {
      $elemMatch: {
        value: { $regex: '555-1234', $options: 'i' }
      }
    }
  });
});

test('should handle ORG search in content field', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'ORG' },
          'text-match': {
            _attr: {
              'match-type': 'contains'
            },
            _: 'Acme Corp'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    content: { $regex: '^ORG:[^\\r\\n]*Acme Corp', $options: 'im' }
  });
});

test('should handle UID search using uid field', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'UID' },
          'text-match': {
            _attr: {
              'match-type': 'equals'
            },
            _: 'contact-123'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    uid: { $regex: '^contact-123$', $options: 'i' }
  });
});

// Match Type Tests
test('should handle equals match type', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'FN' },
          'text-match': {
            _attr: { 'match-type': 'equals' },
            _: 'John Doe'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    fullName: { $regex: '^John Doe$', $options: 'i' }
  });
});

test('should handle starts-with match type', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'FN' },
          'text-match': {
            _attr: { 'match-type': 'starts-with' },
            _: 'John'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    fullName: { $regex: '^John', $options: 'i' }
  });
});

test('should handle ends-with match type', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'EMAIL' },
          'text-match': {
            _attr: { 'match-type': 'ends-with' },
            _: '@company.com'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    emails: {
      $elemMatch: {
        value: { $regex: '@company\\.com$', $options: 'i' }
      }
    }
  });
});

// Parameter Filter Tests
test('should handle EMAIL TYPE parameter filter', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'EMAIL' },
          'param-filter': {
            _attr: { name: 'TYPE' },
            'text-match': {
              _attr: { 'match-type': 'equals' },
              _: 'WORK'
            }
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    emails: {
      $elemMatch: {
        type: { $regex: '^WORK$', $options: 'i' }
      }
    }
  });
});

test('should handle TEL TYPE parameter filter', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'TEL' },
          'param-filter': {
            _attr: { name: 'TYPE' },
            'text-match': {
              _attr: { 'match-type': 'contains' },
              _: 'CELL'
            }
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    phoneNumbers: {
      $elemMatch: {
        type: { $regex: 'CELL', $options: 'i' }
      }
    }
  });
});

test('should handle content-based parameter filter with different match types', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'ORG' },
          'param-filter': {
            _attr: { name: 'TYPE' },
            'text-match': {
              _attr: { 'match-type': 'equals' },
              _: 'WORK'
            }
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    content: { $regex: '^ORG:[^\\r\\n]*TYPE=WORK(?:[;:]|$)', $options: 'im' }
  });
});

// Existence Tests
test('should handle EMAIL not defined (array empty)', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'EMAIL' },
          'is-not-defined': {}
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    $or: [{ emails: { $exists: false } }, { emails: { $size: 0 } }]
  });
});

test('should handle fullName must exist', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'FN' },
          'is-not-defined': {
            _attr: { 'negate-condition': 'yes' }
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    fullName: { $exists: true, $nin: [null, ''] }
  });
});

test('should handle ORG not defined in content', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'ORG' },
          'is-not-defined': {}
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    content: { $not: /^ORG:/m }
  });
});

// Negation Tests
test('should handle negated text match', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'FN' },
          'text-match': {
            _attr: {
              'match-type': 'contains',
              'negate-condition': 'yes'
            },
            _: 'John'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    $not: { fullName: { $regex: 'John', $options: 'i' } }
  });
});

test('should handle negated parameter filter', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'EMAIL' },
          'param-filter': {
            _attr: { name: 'TYPE' },
            'text-match': {
              _attr: {
                'match-type': 'equals',
                'negate-condition': 'yes'
              },
              _: 'WORK'
            }
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    $not: {
      emails: {
        $elemMatch: {
          type: { $regex: '^WORK$', $options: 'i' }
        }
      }
    }
  });
});

// Complex Query Tests
test('should handle multiple filters with AND logic', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        _attr: { test: 'allof' },
        'prop-filter': [
          {
            _attr: { name: 'FN' },
            'text-match': {
              _attr: { 'match-type': 'contains' },
              _: 'John'
            }
          },
          {
            _attr: { name: 'EMAIL' },
            'param-filter': {
              _attr: { name: 'TYPE' },
              'text-match': {
                _attr: { 'match-type': 'equals' },
                _: 'WORK'
              }
            }
          }
        ]
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    $and: [
      { fullName: { $regex: 'John', $options: 'i' } },
      {
        emails: {
          $elemMatch: {
            type: { $regex: '^WORK$', $options: 'i' }
          }
        }
      }
    ]
  });
});

test('should handle multiple filters with OR logic', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        _attr: { test: 'anyof' },
        'prop-filter': [
          {
            _attr: { name: 'FN' },
            'text-match': {
              _attr: { 'match-type': 'contains' },
              _: 'John'
            }
          },
          {
            _attr: { name: 'ORG' },
            'text-match': {
              _attr: { 'match-type': 'contains' },
              _: 'Acme'
            }
          }
        ]
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    $or: [
      { fullName: { $regex: 'John', $options: 'i' } },
      { content: { $regex: '^ORG:[^\\r\\n]*Acme', $options: 'im' } }
    ]
  });
});

test('should handle multiple conditions on same property', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'EMAIL' },
          'text-match': [
            {
              _attr: { 'match-type': 'contains' },
              _: '@example.com'
            },
            {
              _attr: { 'match-type': 'starts-with' },
              _: 'john'
            }
          ]
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    $and: [
      {
        emails: {
          $elemMatch: {
            value: { $regex: '@example\\.com', $options: 'i' }
          }
        }
      },
      {
        emails: {
          $elemMatch: {
            value: { $regex: '^john', $options: 'i' }
          }
        }
      }
    ]
  });
});

// Real-world Integration Tests
test('should handle typical client search for work contacts', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        _attr: { test: 'allof' },
        'prop-filter': [
          {
            _attr: { name: 'EMAIL' },
            'param-filter': {
              _attr: { name: 'TYPE' },
              'text-match': {
                _attr: { 'match-type': 'equals' },
                _: 'WORK'
              }
            }
          },
          {
            _attr: { name: 'EMAIL' },
            'text-match': {
              _attr: { 'match-type': 'ends-with' },
              _: '@company.com'
            }
          }
        ]
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    $and: [
      {
        emails: {
          $elemMatch: {
            type: { $regex: '^WORK$', $options: 'i' }
          }
        }
      },
      {
        emails: {
          $elemMatch: {
            value: { $regex: '@company\\.com$', $options: 'i' }
          }
        }
      }
    ]
  });
});

// Edge Cases
test('should handle empty filter', (t) => {
  const xmlBody = {
    'addressbook-query': {}
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {});
});

test('should handle unknown property', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'UNKNOWN' },
          'text-match': {
            _attr: { 'match-type': 'contains' },
            _: 'test'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {});
});

test('should handle case-sensitive collation', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'FN' },
          'text-match': {
            _attr: {
              collation: 'unicode-casemap',
              'match-type': 'contains'
            },
            _: 'John'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    fullName: { $regex: 'John', $options: '' }
  });
});

// Property Extraction Tests
test('should extract props from addressbook-query', (t) => {
  const xmlBody = {
    'addressbook-query': {
      prop: {
        getetag: {},
        'address-data': {}
      }
    }
  };

  const result = xmlHelpers.extractRequestedProps(xmlBody);
  t.deepEqual(result, ['getetag', 'address-data']);
});

test('should extract props from addressbook-multiget', (t) => {
  const xmlBody = {
    'addressbook-multiget': {
      prop: {
        getetag: {},
        'address-data': {},
        getcontenttype: {}
      }
    }
  };

  const result = xmlHelpers.extractRequestedProps(xmlBody);
  t.deepEqual(result, ['getetag', 'address-data', 'getcontenttype']);
});

// Href Extraction Tests
test('should extract single href', (t) => {
  const xmlBody = {
    'addressbook-multiget': {
      href: '/dav/user/addressbooks/default/contact1.vcf'
    }
  };

  const result = xmlHelpers.extractHrefs(xmlBody);
  t.deepEqual(result, ['/dav/user/addressbooks/default/contact1.vcf']);
});

test('should extract multiple hrefs', (t) => {
  const xmlBody = {
    'addressbook-multiget': {
      href: [
        '/dav/user/addressbooks/default/contact1.vcf',
        '/dav/user/addressbooks/default/contact2.vcf'
      ]
    }
  };

  const result = xmlHelpers.extractHrefs(xmlBody);
  t.deepEqual(result, [
    '/dav/user/addressbooks/default/contact1.vcf',
    '/dav/user/addressbooks/default/contact2.vcf'
  ]);
});

// Regex Escaping Tests
test('should properly escape regex characters', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'EMAIL' },
          'text-match': {
            _attr: { 'match-type': 'contains' },
            _: 'user+tag@example.com'
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    emails: {
      $elemMatch: {
        value: { $regex: 'user\\+tag@example\\.com', $options: 'i' }
      }
    }
  });
});

// Parameter Not Defined Tests
test('should handle parameter not defined for array properties', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'EMAIL' },
          'param-filter': {
            _attr: { name: 'TYPE' },
            'is-not-defined': {}
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    $or: [
      { emails: { $size: 0 } },
      {
        emails: {
          $not: {
            $elemMatch: {
              type: { $exists: true, $ne: null }
            }
          }
        }
      }
    ]
  });
});

test('should handle parameter must exist for array properties', (t) => {
  const xmlBody = {
    'addressbook-query': {
      filter: {
        'prop-filter': {
          _attr: { name: 'TEL' },
          'param-filter': {
            _attr: { name: 'TYPE' },
            'is-not-defined': {
              _attr: { 'negate-condition': 'yes' }
            }
          }
        }
      }
    }
  };

  const result = t.context.parser.parseFilter(xmlBody);
  t.deepEqual(result, {
    phoneNumbers: {
      $elemMatch: {
        type: { $exists: true, $ne: null }
      }
    }
  });
});
