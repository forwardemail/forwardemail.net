/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Sieve Extensions Tests
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  VacationExtension,
  VariablesExtension,
  Imap4FlagsExtension,
  BodyExtension,
  RelationalExtension,
  DateExtension
} = require('../../helpers/sieve/extensions');

describe('Vacation Extension', () => {
  it('should validate days range', () => {
    const ext = new VacationExtension({ minDays: 1, maxDays: 30 });

    const valid = ext.validate({ days: 7, message: 'Away' });
    assert.strictEqual(valid.valid, true);

    const tooFew = ext.validate({ days: 0, message: 'Away' });
    assert.strictEqual(tooFew.valid, false);

    const tooMany = ext.validate({ days: 100, message: 'Away' });
    assert.strictEqual(tooMany.valid, false);
  });

  it('should validate message required', () => {
    const ext = new VacationExtension();

    const noMessage = ext.validate({ days: 7 });
    assert.strictEqual(noMessage.valid, false);

    const emptyMessage = ext.validate({ days: 7, message: '' });
    assert.strictEqual(emptyMessage.valid, false);
  });

  it('should validate from address', () => {
    const ext = new VacationExtension();

    const validFrom = ext.validate({
      days: 7,
      message: 'Away',
      from: 'user@example.com'
    });
    assert.strictEqual(validFrom.valid, true);

    const invalidFrom = ext.validate({
      days: 7,
      message: 'Away',
      from: 'not-an-email'
    });
    assert.strictEqual(invalidFrom.valid, false);
  });

  it('should calculate interval', () => {
    const ext = new VacationExtension({ defaultDays: 7 });

    // Days specified
    assert.strictEqual(ext.getInterval({ days: 3 }), 3 * 86400);

    // Seconds specified (takes precedence)
    assert.strictEqual(ext.getInterval({ days: 3, seconds: 3600 }), 3600);

    // Default days
    assert.strictEqual(ext.getInterval({}), 7 * 86400);
  });
});

describe('Variables Extension', () => {
  it('should set and get variables', () => {
    const ext = new VariablesExtension();
    ext.set('greeting', 'Hello');
    assert.strictEqual(ext.get('greeting'), 'Hello');
  });

  it('should handle case insensitive variable names', () => {
    const ext = new VariablesExtension();
    ext.set('Greeting', 'Hello');
    assert.strictEqual(ext.get('greeting'), 'Hello');
    assert.strictEqual(ext.get('GREETING'), 'Hello');
  });

  it('should return empty string for undefined', () => {
    const ext = new VariablesExtension();
    assert.strictEqual(ext.get('undefined'), '');
  });

  it('should apply :lower modifier', () => {
    const ext = new VariablesExtension();
    ext.set('name', 'JOHN', ['lower']);
    assert.strictEqual(ext.get('name'), 'john');
  });

  it('should apply :upper modifier', () => {
    const ext = new VariablesExtension();
    ext.set('name', 'john', ['upper']);
    assert.strictEqual(ext.get('name'), 'JOHN');
  });

  it('should apply :lowerfirst modifier', () => {
    const ext = new VariablesExtension();
    ext.set('name', 'JOHN', ['lowerfirst']);
    assert.strictEqual(ext.get('name'), 'jOHN');
  });

  it('should apply :upperfirst modifier', () => {
    const ext = new VariablesExtension();
    ext.set('name', 'john', ['upperfirst']);
    assert.strictEqual(ext.get('name'), 'John');
  });

  it('should apply :quotewildcard modifier', () => {
    const ext = new VariablesExtension();
    ext.set('pattern', 'test*?\\value', ['quotewildcard']);
    assert.strictEqual(ext.get('pattern'), 'test\\*\\?\\\\value');
  });

  it('should apply :length modifier', () => {
    const ext = new VariablesExtension();
    ext.set('len', 'hello', ['length']);
    assert.strictEqual(ext.get('len'), '5');
  });

  it('should apply multiple modifiers', () => {
    const ext = new VariablesExtension();
    ext.set('name', 'JOHN DOE', ['lower', 'upperfirst']);
    assert.strictEqual(ext.get('name'), 'John doe');
  });

  it('should interpolate variables', () => {
    const ext = new VariablesExtension();
    ext.set('name', 'John');
    ext.set('greeting', 'Hello');
    // eslint-disable-next-line no-template-curly-in-string
    const result = ext.interpolate('${greeting}, ${name}!');
    assert.strictEqual(result, 'Hello, John!');
  });

  it('should handle match variables', () => {
    const ext = new VariablesExtension();
    ext.setMatchVariables(['full match', 'group1', 'group2']);
    assert.strictEqual(ext.get('0'), 'full match');
    assert.strictEqual(ext.get('1'), 'group1');
    assert.strictEqual(ext.get('2'), 'group2');
  });
});

describe('IMAP4 Flags Extension', () => {
  it('should set flags with setflag', () => {
    const ext = new Imap4FlagsExtension();
    ext.setflag(['\\Seen', '\\Flagged']);
    assert.ok(ext.hasflag(['\\Seen']));
    assert.ok(ext.hasflag(['\\Flagged']));
  });

  it('should replace existing flags with setflag', () => {
    const ext = new Imap4FlagsExtension();
    ext.setflag(['\\Seen']);
    ext.setflag(['\\Flagged']);
    assert.ok(!ext.hasflag(['\\Seen']));
    assert.ok(ext.hasflag(['\\Flagged']));
  });

  it('should add to existing flags with addflag', () => {
    const ext = new Imap4FlagsExtension();
    ext.setflag(['\\Seen']);
    ext.addflag(['\\Flagged']);
    assert.ok(ext.hasflag(['\\Seen']));
    assert.ok(ext.hasflag(['\\Flagged']));
  });

  it('should remove flags with removeflag', () => {
    const ext = new Imap4FlagsExtension();
    ext.setflag(['\\Seen', '\\Flagged']);
    ext.removeflag(['\\Seen']);
    assert.ok(!ext.hasflag(['\\Seen']));
    assert.ok(ext.hasflag(['\\Flagged']));
  });

  it('should normalize system flags', () => {
    const ext = new Imap4FlagsExtension();
    ext.setflag(['\\seen', '\\FLAGGED']);
    const flags = ext.getFlags();
    assert.ok(flags.includes('\\Seen'));
    assert.ok(flags.includes('\\Flagged'));
  });

  it('should check hasflag with :contains', () => {
    const ext = new Imap4FlagsExtension();
    ext.setflag(['important-work']);
    assert.ok(ext.hasflag(['work'], null, 'contains'));
    assert.ok(!ext.hasflag(['personal'], null, 'contains'));
  });

  it('should check hasflag with :matches', () => {
    const ext = new Imap4FlagsExtension();
    ext.setflag(['project-alpha', 'project-beta']);
    assert.ok(ext.hasflag(['project-*'], null, 'matches'));
    assert.ok(!ext.hasflag(['task-*'], null, 'matches'));
  });

  it('should support variable flags', () => {
    const ext = new Imap4FlagsExtension();
    ext.setflag(['\\Seen'], 'myflags');
    ext.addflag(['\\Flagged'], 'myflags');
    assert.ok(ext.hasflag(['\\Seen'], 'myflags'));
    assert.ok(ext.hasflag(['\\Flagged'], 'myflags'));
    assert.ok(!ext.hasflag(['\\Seen'])); // Default flags unchanged
  });
});

describe('Body Extension', () => {
  it('should extract text content', () => {
    const ext = new BodyExtension();
    const message = {
      body: '<html><body>Hello World</body></html>',
      parts: []
    };
    const content = ext.extractContent(message, 'text');
    assert.ok(content.includes('Hello World'));
    assert.ok(!content.includes('<html>'));
  });

  it('should extract raw content', () => {
    const ext = new BodyExtension();
    const message = {
      body: '<html><body>Hello</body></html>',
      parts: []
    };
    const content = ext.extractContent(message, 'raw');
    assert.ok(content.includes('<html>'));
  });

  it('should extract from MIME parts', () => {
    const ext = new BodyExtension();
    const message = {
      body: '',
      parts: [
        { contentType: 'text/plain', content: 'Plain text version' },
        { contentType: 'text/html', content: '<p>HTML version</p>' }
      ]
    };
    const content = ext.extractContent(message, 'text');
    assert.strictEqual(content, 'Plain text version');
  });

  it('should extract specific content types', () => {
    const ext = new BodyExtension();
    const message = {
      body: '',
      parts: [
        { contentType: 'text/plain', content: 'Plain' },
        { contentType: 'text/html', content: 'HTML' },
        { contentType: 'application/json', content: '{}' }
      ]
    };
    const content = ext.extractContent(message, {
      type: 'content',
      contentTypes: ['text/html']
    });
    assert.strictEqual(content, 'HTML');
  });

  it('should test body content', () => {
    const ext = new BodyExtension();
    const message = {
      body: 'This message contains important information.',
      parts: []
    };

    assert.ok(
      ext.test(message, {
        bodyTransform: 'text',
        keys: ['important'],
        matchType: 'contains',
        comparator: 'i;ascii-casemap'
      })
    );

    assert.ok(
      !ext.test(message, {
        bodyTransform: 'text',
        keys: ['secret'],
        matchType: 'contains',
        comparator: 'i;ascii-casemap'
      })
    );
  });
});

describe('Relational Extension', () => {
  it('should compare with :gt', () => {
    const ext = new RelationalExtension();
    assert.ok(ext.compare(10, '5', 'gt', 'value'));
    assert.ok(!ext.compare(5, '10', 'gt', 'value'));
    assert.ok(!ext.compare(5, '5', 'gt', 'value'));
  });

  it('should compare with :ge', () => {
    const ext = new RelationalExtension();
    assert.ok(ext.compare(10, '5', 'ge', 'value'));
    assert.ok(ext.compare(5, '5', 'ge', 'value'));
    assert.ok(!ext.compare(4, '5', 'ge', 'value'));
  });

  it('should compare with :lt', () => {
    const ext = new RelationalExtension();
    assert.ok(ext.compare(5, '10', 'lt', 'value'));
    assert.ok(!ext.compare(10, '5', 'lt', 'value'));
    assert.ok(!ext.compare(5, '5', 'lt', 'value'));
  });

  it('should compare with :le', () => {
    const ext = new RelationalExtension();
    assert.ok(ext.compare(5, '10', 'le', 'value'));
    assert.ok(ext.compare(5, '5', 'le', 'value'));
    assert.ok(!ext.compare(6, '5', 'le', 'value'));
  });

  it('should compare with :eq', () => {
    const ext = new RelationalExtension();
    assert.ok(ext.compare(5, '5', 'eq', 'value'));
    assert.ok(!ext.compare(5, '6', 'eq', 'value'));
  });

  it('should compare with :ne', () => {
    const ext = new RelationalExtension();
    assert.ok(ext.compare(5, '6', 'ne', 'value'));
    assert.ok(!ext.compare(5, '5', 'ne', 'value'));
  });

  it('should handle count comparison', () => {
    const ext = new RelationalExtension();
    assert.ok(ext.compare(['a', 'b', 'c'], '2', 'gt', 'count'));
    assert.ok(ext.compare(['a', 'b'], '2', 'eq', 'count'));
    assert.ok(!ext.compare(['a'], '2', 'ge', 'count'));
  });

  it('should handle string comparison', () => {
    const ext = new RelationalExtension();
    assert.ok(ext.compare('banana', 'apple', 'gt', 'value'));
    assert.ok(ext.compare('apple', 'banana', 'lt', 'value'));
  });
});

describe('Date Extension', () => {
  it('should extract year', () => {
    const ext = new DateExtension();
    const date = new Date('2024-06-15T10:30:00Z');
    assert.strictEqual(ext.extractPart(date, 'year'), '2024');
  });

  it('should extract month', () => {
    const ext = new DateExtension();
    const date = new Date('2024-06-15T10:30:00Z');
    assert.strictEqual(ext.extractPart(date, 'month'), '06');
  });

  it('should extract day', () => {
    const ext = new DateExtension();
    const date = new Date('2024-06-15T10:30:00Z');
    assert.strictEqual(ext.extractPart(date, 'day'), '15');
  });

  it('should extract date', () => {
    const ext = new DateExtension();
    const date = new Date('2024-06-15T10:30:00Z');
    assert.strictEqual(ext.extractPart(date, 'date'), '2024-06-15');
  });

  it('should extract hour', () => {
    const ext = new DateExtension();
    const date = new Date('2024-06-15T10:30:00Z');
    assert.strictEqual(ext.extractPart(date, 'hour'), '10');
  });

  it('should extract minute', () => {
    const ext = new DateExtension();
    const date = new Date('2024-06-15T10:30:00Z');
    assert.strictEqual(ext.extractPart(date, 'minute'), '30');
  });

  it('should extract weekday', () => {
    const ext = new DateExtension();
    const date = new Date('2024-06-15T10:30:00Z'); // Saturday
    assert.strictEqual(ext.extractPart(date, 'weekday'), '6');
  });

  it('should apply timezone offset', () => {
    const ext = new DateExtension();
    const date = new Date('2024-06-15T10:30:00Z');

    // +05:00 should add 5 hours
    assert.strictEqual(ext.extractPart(date, 'hour', '+05:00'), '15');

    // -03:00 should subtract 3 hours
    assert.strictEqual(ext.extractPart(date, 'hour', '-03:00'), '07');
  });

  it('should parse date strings', () => {
    const ext = new DateExtension();

    const valid = ext.parseDate('Sat, 15 Jun 2024 10:30:00 +0000');
    assert.ok(valid);
    assert.strictEqual(valid.getUTCFullYear(), 2024);

    const invalid = ext.parseDate('not a date');
    assert.strictEqual(invalid, null);
  });
});
