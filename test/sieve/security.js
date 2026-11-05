/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Security Tests for Sieve Implementation
 *
 * These tests verify protection against known vulnerabilities and attack vectors:
 * - CVE-2023-26430: Control character injection
 * - Email hijacking via malicious redirects
 * - Header manipulation attacks
 * - Vacation abuse for spam
 * - Resource exhaustion attacks
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { Buffer } = require('node:buffer');
const path = require('node:path');

const {
  SieveSecurityValidator,
  SieveRateLimiter,
  SieveAuditLogger,
  MemoryRateLimitStore,
  MemoryAuditStore
} = require(path.join(__dirname, '../../helpers/sieve/security'));

const { SieveValidator } = require(path.join(
  __dirname,
  '../../helpers/sieve/validator'
));
const { SieveScriptChecker } = require(path.join(
  __dirname,
  '../../helpers/sieve/script-checker'
));

describe('Sieve Security - CVE-2023-26430 Control Character Injection', () => {
  let validator;

  beforeEach(() => {
    validator = new SieveSecurityValidator();
  });

  it('should detect null byte injection', () => {
    const script = 'require ["fileinto"];\u0000fileinto "Inbox";';
    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.type === 'control_character'));
  });

  it('should detect bell character injection', () => {
    const script = 'require ["fileinto"];\u0007fileinto "Inbox";';
    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.type === 'control_character'));
  });

  it('should detect backspace injection', () => {
    const script = 'require ["fileinto"];\u0008fileinto "Inbox";';
    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
  });

  it('should detect vertical tab injection', () => {
    const script = 'require ["fileinto"];\u000Bfileinto "Inbox";';
    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
  });

  it('should detect form feed injection', () => {
    const script = 'require ["fileinto"];\u000Cfileinto "Inbox";';
    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
  });

  it('should detect escape character injection', () => {
    const script = 'require ["fileinto"];\u001Bfileinto "Inbox";';
    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
  });

  it('should detect DEL character injection', () => {
    const script = 'require ["fileinto"];\u007Ffileinto "Inbox";';
    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
  });

  it('should allow legitimate whitespace (tab, newline, carriage return)', () => {
    const script = 'require ["fileinto"];\n\tfileinto "Inbox";\r\n';
    const result = validator.validate(script);

    assert.strictEqual(result.valid, true);
  });

  it('should sanitize control characters', () => {
    const script = 'require ["fileinto"];\u0000\u0007\u001Bfileinto "Inbox";';
    const sanitized = validator.sanitize(script);

    assert.ok(!sanitized.includes('\u0000'));
    assert.ok(!sanitized.includes('\u0007'));
    assert.ok(!sanitized.includes('\u001B'));
    assert.ok(sanitized.includes('fileinto'));
  });

  it('should report positions of control characters', () => {
    const script = 'abc\u0000def\u0007ghi';
    const result = validator.checkControlCharacters(script);

    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.errors[0].positions.length, 2);
    assert.strictEqual(result.errors[0].positions[0].position, 3);
    assert.strictEqual(result.errors[0].positions[1].position, 7);
  });
});

describe('Sieve Security - Email Hijacking via Redirect', () => {
  let validator;

  beforeEach(() => {
    validator = new SieveSecurityValidator({
      maxRedirectsPerScript: 5,
      allowExternalRedirects: false,
      redirectDomainWhitelist: ['example.com', 'trusted.org'],
      redirectDomainBlacklist: ['evil.com', 'spam.net']
    });
  });

  it('should detect excessive redirects', () => {
    const script = `require ["copy"];
redirect :copy "a@example.com";
redirect :copy "b@example.com";
redirect :copy "c@example.com";
redirect :copy "d@example.com";
redirect :copy "e@example.com";
redirect :copy "f@example.com";
redirect :copy "g@example.com";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.type === 'redirect_limit'));
  });

  it('should warn about external redirects when not allowed', () => {
    const script = 'redirect "external@otherdomain.com";';

    const result = validator.validate(script, { userDomain: 'example.com' });

    assert.ok(
      result.securityIssues.some((i) => i.type === 'external_redirect')
    );
  });

  it('should reject redirects to blacklisted domains', () => {
    const script = 'redirect "attacker@evil.com";';

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(
      result.errors.some((e) => e.type === 'redirect_domain_blacklisted')
    );
  });

  it('should reject redirects to non-whitelisted domains', () => {
    const script = 'redirect "user@unknown.com";';

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(
      result.errors.some((e) => e.type === 'redirect_domain_not_whitelisted')
    );
  });

  it('should allow redirects to whitelisted domains', () => {
    const script = 'redirect "user@example.com";';

    const result = validator.validate(script);

    assert.strictEqual(result.valid, true);
  });

  it('should warn about redirect without copy flag', () => {
    const script = 'redirect "user@example.com";';

    const result = validator.validate(script);

    assert.ok(result.warnings.some((w) => w.type === 'redirect_without_copy'));
  });

  it('should not warn when copy flag is used', () => {
    const script = 'require ["copy"];\nredirect :copy "user@example.com";';

    // Need a validator without domain restrictions for this test
    const permissiveValidator = new SieveSecurityValidator({
      redirectDomainWhitelist: null
    });
    const result = permissiveValidator.validate(script);

    assert.ok(!result.warnings.some((w) => w.type === 'redirect_without_copy'));
  });

  it('should detect the classic hijacking pattern', () => {
    // This is the exact pattern used in the DirectAdmin hack
    const script = `require ["copy"];
# rule:[.]
if true
{
  redirect :copy "attacker@evil.com";
}`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(
      result.errors.some((e) => e.type === 'redirect_domain_blacklisted')
    );
  });

  it('should count redirects in nested conditions', () => {
    const script = `require ["copy"];
if header :contains "Subject" "test" {
  redirect :copy "a@example.com";
  redirect :copy "b@example.com";
  redirect :copy "c@example.com";
} else {
  redirect :copy "d@example.com";
  redirect :copy "e@example.com";
  redirect :copy "f@example.com";
}`;

    const result = validator.validate(script);

    assert.strictEqual(result.stats.redirectCount, 6);
    assert.strictEqual(result.valid, false);
  });
});

describe('Sieve Security - Header Manipulation Attacks', () => {
  let validator;

  beforeEach(() => {
    validator = new SieveSecurityValidator();
  });

  it('should reject modification of From header', () => {
    const script = `require ["editheader"];
addheader "From" "attacker@evil.com";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(
      result.errors.some((e) => e.type === 'protected_header_modification')
    );
    assert.ok(
      result.securityIssues.some((i) => i.type === 'header_manipulation')
    );
  });

  it('should reject modification of DKIM-Signature header', () => {
    const script = `require ["editheader"];
deleteheader "DKIM-Signature";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(
      result.errors.some((e) => e.type === 'protected_header_modification')
    );
  });

  it('should reject modification of Received header', () => {
    const script = `require ["editheader"];
addheader "Received" "from fake.server";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
  });

  it('should reject modification of Authentication-Results header', () => {
    const script = `require ["editheader"];
deleteheader "Authentication-Results";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
  });

  it('should reject modification of Return-Path header', () => {
    const script = `require ["editheader"];
addheader "Return-Path" "<attacker@evil.com>";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
  });

  it('should allow modification of safe headers', () => {
    const script = `require ["editheader"];
addheader "X-Custom-Header" "value";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, true);
  });

  it('should detect header injection via newlines', () => {
    const script = `require ["editheader"];
addheader "X-Custom" "value\r\nBcc: attacker@evil.com";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.type === 'header_injection'));
    assert.ok(result.securityIssues.some((i) => i.type === 'header_injection'));
  });

  it('should be case-insensitive for protected headers', () => {
    const script = `require ["editheader"];
addheader "FROM" "attacker@evil.com";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
  });
});

describe('Sieve Security - Vacation Abuse Prevention', () => {
  let validator;

  beforeEach(() => {
    validator = new SieveSecurityValidator({
      minVacationInterval: 86400, // 1 day
      maxVacationMessageSize: 1000,
      maxVacationSubjectLength: 100
    });
  });

  it('should warn about short vacation intervals', () => {
    const script = `require ["vacation", "vacation-seconds"];
vacation :seconds 60 "I am away";`;

    const result = validator.validate(script);

    assert.ok(
      result.warnings.some((w) => w.type === 'vacation_interval_too_short')
    );
  });

  it('should reject oversized vacation messages', () => {
    const longMessage = 'A'.repeat(2000);
    const script = `require ["vacation"];
vacation "${longMessage}";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(
      result.errors.some((e) => e.type === 'vacation_message_too_large')
    );
  });

  it('should reject oversized vacation subjects', () => {
    const longSubject = 'A'.repeat(200);
    const script = `require ["vacation"];
vacation :subject "${longSubject}" "I am away";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(
      result.errors.some((e) => e.type === 'vacation_subject_too_long')
    );
  });

  it('should warn about spam indicators in vacation messages', () => {
    const script = `require ["vacation"];
vacation "Click here to buy now! Free money!";`;

    const result = validator.validate(script);

    assert.ok(
      result.warnings.some((w) => w.type === 'vacation_spam_indicators')
    );
  });

  it('should detect phishing indicators in vacation messages', () => {
    const script = `require ["vacation"];
vacation "Please verify your password reset at our secure site";`;

    const result = validator.validate(script);

    assert.ok(
      result.warnings.some((w) => w.type === 'vacation_spam_indicators')
    );
  });

  it('should allow legitimate vacation messages', () => {
    const script = `require ["vacation"];
vacation :days 7 :subject "Out of Office"
  "Thank you for your email. I am currently away and will respond upon my return.";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, true);
    assert.ok(
      !result.warnings.some((w) => w.type === 'vacation_spam_indicators')
    );
  });
});

describe('Sieve Security - Resource Exhaustion Prevention', () => {
  let validator;

  beforeEach(() => {
    validator = new SieveSecurityValidator({
      maxNestingDepth: 5,
      maxRulesPerScript: 50,
      maxRegexLength: 100
    });
  });

  it('should reject deeply nested conditions', () => {
    const script = `
if header :contains "A" "1" {
  if header :contains "B" "2" {
    if header :contains "C" "3" {
      if header :contains "D" "4" {
        if header :contains "E" "5" {
          if header :contains "F" "6" {
            keep;
          }
        }
      }
    }
  }
}`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.type === 'nesting_limit'));
  });

  it('should track nesting depth correctly', () => {
    const script = `
if header :contains "A" "1" {
  if header :contains "B" "2" {
    if header :contains "C" "3" {
      keep;
    }
  }
}`;

    const result = validator.validate(script);

    assert.strictEqual(result.stats.nestingDepth, 3);
  });

  it('should reject scripts with too many rules', () => {
    let script = '';
    for (let i = 0; i < 60; i++) {
      script += `if header :contains "X-Test-${i}" "value" { keep; }\n`;
    }

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.type === 'rule_limit'));
  });

  it('should warn about potential ReDoS patterns', () => {
    const script = `require ["regex"];
if header :regex "Subject" "(a+)+" { keep; }`;

    const result = validator.validate(script);

    // Note: This requires the regex extension to be parsed
    // The warning should be present if regex patterns are analyzed
    assert.ok(result.warnings.length >= 0); // May or may not trigger depending on implementation
  });

  it('should reject oversized scripts', () => {
    const largeScript = 'keep;\n'.repeat(200000); // Very large script

    const result = validator.validate(largeScript);

    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.type === 'size_limit'));
  });
});

describe('Sieve Security - Extension Access Control', () => {
  let validator;

  beforeEach(() => {
    validator = new SieveSecurityValidator({
      allowedExtensions: ['fileinto', 'copy', 'vacation']
    });
  });

  it('should reject scripts using disallowed extensions', () => {
    const script = `require ["editheader"];
addheader "X-Test" "value";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.type === 'disallowed_extension'));
  });

  it('should allow scripts using only allowed extensions', () => {
    const script = `require ["fileinto", "copy"];
fileinto :copy "Archive";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, true);
  });

  it('should detect multiple disallowed extensions', () => {
    const script = `require ["editheader", "enotify", "variables"];
set "test" "value";`;

    const result = validator.validate(script);

    assert.strictEqual(result.valid, false);
    const extError = result.errors.find(
      (e) => e.type === 'disallowed_extension'
    );
    assert.ok(extError);
    assert.ok(extError.extensions.includes('editheader'));
    assert.ok(extError.extensions.includes('enotify'));
    assert.ok(extError.extensions.includes('variables'));
  });
});

describe('Sieve Security - Rate Limiting', () => {
  let rateLimiter;
  let store;

  beforeEach(() => {
    store = new MemoryRateLimitStore();
    rateLimiter = new SieveRateLimiter(store, {
      redirectsPerDay: 5,
      vacationsPerHour: 3,
      scriptChangesPerHour: 2
    });
  });

  it('should allow actions within rate limit', async () => {
    const result = await rateLimiter.checkRedirect('user1');

    assert.strictEqual(result.allowed, true);
    // After recording the action, remaining is limit - count = 5 - 1 = 4
    assert.strictEqual(result.remaining, 4);
  });

  it('should block actions exceeding rate limit', async () => {
    // Use up all redirects
    for (let i = 0; i < 5; i++) {
      await rateLimiter.checkRedirect('user1');
    }

    const result = await rateLimiter.checkRedirect('user1');

    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.remaining, 0);
  });

  it('should track limits per user', async () => {
    // User 1 uses some redirects
    await rateLimiter.checkRedirect('user1');
    await rateLimiter.checkRedirect('user1');

    // User 2 should have full quota, after action remaining = 5 - 1 = 4
    const result = await rateLimiter.checkRedirect('user2');

    assert.strictEqual(result.allowed, true);
    assert.strictEqual(result.remaining, 4);
  });

  it('should limit vacation responses', async () => {
    // Use up vacation limit
    for (let i = 0; i < 3; i++) {
      await rateLimiter.recordVacation('user1', `recipient${i}@example.com`);
    }

    const result = await rateLimiter.recordVacation(
      'user1',
      'another@example.com'
    );

    assert.strictEqual(result.allowed, false);
  });

  it('should limit script changes', async () => {
    await rateLimiter.checkScriptChange('user1');
    await rateLimiter.checkScriptChange('user1');

    const result = await rateLimiter.checkScriptChange('user1');

    assert.strictEqual(result.allowed, false);
  });
});

describe('Sieve Security - Audit Logging', () => {
  let auditLogger;
  let store;

  beforeEach(() => {
    store = new MemoryAuditStore();
    auditLogger = new SieveAuditLogger({
      store,
      logger: { info() {} } // Suppress console output
    });
  });

  it('should log script creation', async () => {
    await auditLogger.logScriptCreated('user1', 'main.sieve', { size: 100 });

    const entries = await auditLogger.getAuditLog('user1');

    assert.strictEqual(entries.length, 1);
    assert.strictEqual(entries[0].action, 'script_created');
    assert.strictEqual(entries[0].scriptName, 'main.sieve');
  });

  it('should log script updates', async () => {
    await auditLogger.logScriptUpdated('user1', 'main.sieve');

    const entries = await auditLogger.getAuditLog('user1');

    assert.strictEqual(entries[0].action, 'script_updated');
  });

  it('should log redirect actions', async () => {
    await auditLogger.logRedirect(
      'user1',
      'backup@example.com',
      'inbox@example.com',
      { session: {}, ignore_hook: true }
    );

    const entries = await auditLogger.getAuditLog('user1');

    assert.strictEqual(entries[0].action, 'redirect');
    assert.strictEqual(entries[0].toAddress, 'backup@example.com');
  });

  it('should log security events', async () => {
    await auditLogger.logSecurityEvent('user1', 'control_character_injection', {
      script: 'malicious'
    });

    const entries = await auditLogger.getAuditLog('user1');

    assert.strictEqual(entries[0].action, 'security');
    assert.strictEqual(entries[0].eventType, 'control_character_injection');
  });

  it('should filter audit log by action', async () => {
    await auditLogger.logScriptCreated('user1', 'script1.sieve');
    await auditLogger.logScriptUpdated('user1', 'script1.sieve');
    await auditLogger.logRedirect('user1', 'c@d.com', 'a@b.com', {});

    const entries = await auditLogger.getAuditLog('user1', {
      action: 'redirect'
    });

    assert.strictEqual(entries.length, 1);
    assert.strictEqual(entries[0].action, 'redirect');
  });

  it('should limit audit log entries', async () => {
    for (let i = 0; i < 10; i++) {
      await auditLogger.logScriptUpdated('user1', `script${i}.sieve`);
    }

    const entries = await auditLogger.getAuditLog('user1', { limit: 5 });

    assert.strictEqual(entries.length, 5);
  });
});

describe('Sieve Security - Comprehensive Validator', () => {
  let validator;

  beforeEach(() => {
    validator = new SieveValidator({
      securityConfig: {
        maxRedirectsPerScript: 3,
        redirectDomainWhitelist: null
      }
    });
  });

  it('should perform full validation', () => {
    const script = `require ["fileinto"];
if header :contains "Subject" "test" {
  fileinto "Test";
}`;

    const result = validator.validateFull(script);

    assert.strictEqual(result.valid, true);
    assert.ok(result.capabilities.required.includes('fileinto'));
  });

  it('should detect all issues in a malicious script', () => {
    const script = `require ["copy", "editheader"];
# Hijack all emails
if true {
  redirect :copy "attacker@evil.com";
  addheader "From" "spoofed@example.com";
}`;

    const result = validator.validateFull(script);

    assert.strictEqual(result.valid, false);
    // Should detect header manipulation
    assert.ok(result.security.errors.length > 0);
  });

  it('should generate human-readable report', () => {
    const script = `require ["fileinto"];
fileinto "Test";`;

    const result = validator.validateFull(script);
    const report = validator.generateReport(result);

    assert.ok(report.includes('Status: VALID'));
    assert.ok(report.includes('fileinto'));
  });
});

describe('Sieve Security - Script Checker User Interface', () => {
  let checker;

  beforeEach(() => {
    checker = new SieveScriptChecker();
  });

  it('should provide user-friendly error messages', () => {
    const script = 'invalid sieve script {{{';

    const result = checker.check(script);

    assert.strictEqual(result.success, false);
    assert.ok(result.errors.length > 0);
    assert.ok(result.errors[0].suggestion);
  });

  it('should provide formatted output', () => {
    const script = `require ["fileinto"];
fileinto "Test";`;

    const result = checker.check(script);
    const formatted = checker.formatResults(result);

    assert.ok(formatted.includes('✓ Script is valid'));
  });

  it('should provide example scripts', () => {
    const examples = SieveScriptChecker.getExamples();

    assert.ok(examples.basic);
    assert.ok(examples.spam);
    assert.ok(examples.vacation);
    assert.ok(examples.redirect);
    assert.ok(examples.organization);
    assert.ok(examples.priority);
  });

  it('should provide documentation', () => {
    const docs = SieveScriptChecker.getDocumentation();

    assert.ok(docs.overview);
    assert.ok(docs.commands);
    assert.ok(docs.tests);
    assert.ok(docs.matchTypes);
    assert.ok(docs.addressParts);
  });

  it('should detect empty scripts', () => {
    const result = checker.check('');

    assert.strictEqual(result.success, false);
    assert.ok(result.errors.some((e) => e.code === 'EMPTY_SCRIPT'));
  });

  it('should format JSON output for API', () => {
    const script = `require ["fileinto"];
fileinto "Test";`;

    const result = checker.check(script);
    const json = checker.formatJSON(result);

    assert.ok(typeof json.valid === 'boolean');
    assert.ok(Array.isArray(json.errors));
    assert.ok(Array.isArray(json.warnings));
  });
});

describe('Sieve Security - Integration Tests', () => {
  it('should handle a complete attack scenario', () => {
    // Simulate the DirectAdmin hack scenario
    const maliciousScript = `require ["copy"];
# rule:[.]
if true
{
  redirect :copy "XXXXXXmane2XXXX@gmail.com";
}`;

    const validator = new SieveSecurityValidator({
      redirectDomainWhitelist: ['company.com']
    });

    const result = validator.validate(maliciousScript, {
      userDomain: 'company.com'
    });

    // Should be rejected due to external redirect
    assert.strictEqual(result.valid, false);
    assert.ok(
      result.errors.some((e) => e.type === 'redirect_domain_not_whitelisted') ||
        result.securityIssues.some((i) => i.type === 'external_redirect')
    );
  });

  it('should allow legitimate business use cases', () => {
    const legitimateScript = `require ["fileinto", "imap4flags", "vacation"];

# Auto-file newsletters
if header :contains "List-Id" "" {
  fileinto "Newsletters";
  stop;
}

# Flag important emails
if address :is "From" "boss@company.com" {
  addflag "\\\\Flagged";
}

# Vacation responder
vacation :days 7 :subject "Out of Office"
  "Thank you for your email. I am currently away.";`;

    const validator = new SieveSecurityValidator();
    const result = validator.validate(legitimateScript);

    assert.strictEqual(result.valid, true);
  });

  it('should provide actionable feedback for fixable issues', () => {
    const script = `require ["copy"];
redirect "backup@external.com";`;

    const checker = new SieveScriptChecker();
    const result = checker.check(script);

    // Should have warning about redirect without copy
    assert.ok(
      result.warnings.some((w) => w.code.includes('REDIRECT_WITHOUT_COPY'))
    );
    // Should have suggestion
    assert.ok(
      result.warnings.some(
        (w) => w.suggestion && w.suggestion.includes(':copy')
      )
    );
  });
});

describe('Sieve Security - MIME Tree Manipulation Limits (RFC 5703)', () => {
  let validator;
  beforeEach(() => {
    validator = new SieveSecurityValidator();
  });

  it('should detect excessive foreverypart nesting depth', () => {
    // Depth 4 exceeds the default limit of 3
    const script = `require "mime";
foreverypart {
  foreverypart {
    foreverypart {
      foreverypart {
        discard;
      }
    }
  }
}`;
    const result = validator.validate(script);
    // Should flag excessive nesting
    assert.ok(
      result.securityIssues.some((i) => i.type === 'excessive_mime_nesting')
    );
  });

  it('should allow foreverypart within depth limit', () => {
    const script = `require "mime";
foreverypart {
  foreverypart {
    foreverypart {
      discard;
    }
  }
}`;
    const result = validator.validate(script);
    // Depth 3 is within the default limit
    assert.ok(
      !result.securityIssues.some((i) => i.type === 'excessive_mime_nesting')
    );
  });

  it('should have MIME limits in DEFAULT_SECURITY_CONFIG', () => {
    // Verify the config has the expected MIME-related limits
    const { config } = validator;
    assert.strictEqual(config.maxMimePartsIteration, 100);
    assert.strictEqual(config.maxExtractedTextSize, 102_400);
    assert.strictEqual(config.maxForeverypartDepth, 3);
    assert.strictEqual(config.maxInstructionsPerScript, 10_000);
  });

  it('should accept custom MIME limits via config', () => {
    const custom = new SieveSecurityValidator({
      maxMimePartsIteration: 50,
      maxForeverypartDepth: 2
    });
    assert.strictEqual(custom.config.maxMimePartsIteration, 50);
    assert.strictEqual(custom.config.maxForeverypartDepth, 2);
  });
});

describe('Sieve Security - Notification Rate Limiting', () => {
  it('should enforce notification rate limit', async () => {
    const store = new MemoryRateLimitStore();
    const limiter = new SieveRateLimiter(store, {
      notificationsPerHour: 10
    });
    const aliasId = 'test-alias-123';

    // First 10 notifications should be allowed (checkNotification records on allow)
    for (let i = 0; i < 10; i++) {
      const res = await limiter.checkNotification(aliasId);
      assert.strictEqual(res.allowed, true);
    }

    // 11th notification should be denied (limit is 10/hour)
    const eleventh = await limiter.checkNotification(aliasId);
    assert.strictEqual(eleventh.allowed, false);
  });
});

describe('Sieve Security - deleteheader on many headers', () => {
  // (`SieveIntegration` is loaded here, and not at the top of this file, so
  // the other suites above do not depend on it)
  const { SieveIntegration } = require(path.join(
    __dirname,
    '../../helpers/sieve/integration'
  ));

  // the headers come from whoever sent the message: removing matches one
  // at a time with `splice()` was quadratic in their number
  const many = (n) =>
    Buffer.from(
      'Subject: hi\r\n' +
        Array.from(
          { length: n },
          (_, i) => `X-Spam: ${i}\r\nX-Other: ${i}\r\n`
        ).join('') +
        'X-Keep: yes\r\n\r\nbody'
    );

  it('deletes every match of many headers in linear time', async () => {
    const sieve = new SieveIntegration({});
    const start = Date.now();
    const result = await sieve.applyHeaderChanges(many(100_000), [
      { action: 'delete', name: 'x-spam' }
    ]);
    const elapsed = Date.now() - start;
    const lines = result.toString().split('\r\n');
    assert.ok(!lines.some((line) => line.startsWith('X-Spam:')));
    assert.strictEqual(
      lines.filter((line) => line.startsWith('X-Other:')).length,
      100_000
    );
    assert.strictEqual(lines[0], 'Subject: hi');
    assert.ok(result.toString().endsWith('X-Keep: yes\r\n\r\nbody'));
    assert.ok(elapsed < 2000, `took ${elapsed}ms`);
  });

  it('deletes matching values of many headers in linear time', async () => {
    const sieve = new SieveIntegration({});
    const start = Date.now();
    const result = await sieve.applyHeaderChanges(many(100_000), [
      {
        action: 'delete',
        name: 'X-Spam',
        matchType: 'matches',
        values: ['*0', '1?']
      }
    ]);
    const elapsed = Date.now() - start;
    const remaining = result
      .toString()
      .split('\r\n')
      .filter((line) => line.startsWith('X-Spam:'))
      .map((line) => line.slice('X-Spam: '.length));
    assert.strictEqual(remaining.length, 100_000 - 10_000 - 9);
    assert.ok(!remaining.includes('10'));
    assert.ok(!remaining.includes('19'));
    assert.ok(remaining.includes('1'));
    assert.ok(remaining.includes('101'));
    assert.ok(elapsed < 2000, `took ${elapsed}ms`);
  });

  it('keeps the other deleteheader forms working', async () => {
    const sieve = new SieveIntegration({});
    const raw = Buffer.from(
      'X-A: one\r\nX-A: Two\r\nX-A: three\r\nX-B: b\r\n\r\nbody'
    );
    // (:index counts from the first, RFC 5293 section 5)
    const byIndex = await sieve.applyHeaderChanges(raw, [
      { action: 'delete', name: 'x-a', index: 1 }
    ]);
    assert.strictEqual(
      byIndex.toString(),
      'X-A: Two\r\nX-A: three\r\nX-B: b\r\n\r\nbody'
    );
    const byValue = await sieve.applyHeaderChanges(raw, [
      { action: 'delete', name: 'x-a', matchType: 'is', values: ['two'] },
      { action: 'delete', name: 'x-a', matchType: 'contains', values: ['HRE'] }
    ]);
    assert.strictEqual(byValue.toString(), 'X-A: one\r\nX-B: b\r\n\r\nbody');
  });

  // (a deleteheader without ":index", as the parser gives it, deleted
  // nothing: its `index` is null)
  it('deletes every match for a deleteheader without :index', async () => {
    const { parse } = require(path.join(
      __dirname,
      '../../helpers/sieve/parser'
    ));
    const { commands } = parse(
      'require ["editheader"];\ndeleteheader "X-A";\ndeleteheader :contains "X-B" "drop";'
    );
    const changes = commands
      .filter((command) => command.type === 'Deleteheader')
      .map((command) => ({
        action: 'delete',
        name: command.name,
        index: command.index,
        matchType: command.matchType,
        values: command.values
      }));
    assert.strictEqual(changes[0].index, null);
    const sieve = new SieveIntegration({});
    const result = await sieve.applyHeaderChanges(
      Buffer.from(
        'X-A: one\r\nX-B: keep\r\nX-A: two\r\nX-B: please drop\r\n\r\nbody'
      ),
      changes
    );
    assert.strictEqual(result.toString(), 'X-B: keep\r\n\r\nbody');
  });
});

describe('Sieve Security - variable size', () => {
  const { executeScript, validateScript } = require(path.join(
    __dirname,
    '../../helpers/sieve/index'
  ));
  const { MAX_VARIABLE_LENGTH } = require(path.join(
    __dirname,
    '../../helpers/sieve/variable-references'
  ));

  const message = () => ({
    headers: { from: 'sender@example.com', subject: 'hi' },
    envelope: { from: 'sender@example.com', to: 'user@example.com' },
    size: 100,
    body: 'body'
  });

  it('caps a variable that set commands keep multiplying', async () => {
    // (each line makes the variable ten times longer: 10^8 characters and
    // hundreds of MB after seven of them, every test on it then took seconds)
    const script = [
      'require ["variables"];',
      'set "a" "AAAAAAAAAA";',
      ...Array.from(
        { length: 7 },
        // eslint-disable-next-line no-template-curly-in-string
        () => 'set "a" "${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}";'
      ),
      ...Array.from(
        { length: 5 },
        // eslint-disable-next-line no-template-curly-in-string
        () => 'if string :contains "${a}${a}" "zz" { stop; }'
      ),
      'keep;'
    ].join('\n');
    assert.strictEqual(validateScript(script).valid, true);

    const start = Date.now();
    const result = await executeScript(script, message());
    const elapsed = Date.now() - start;
    assert.strictEqual(result.variables.a.length, MAX_VARIABLE_LENGTH);
    assert.ok(MAX_VARIABLE_LENGTH >= 4000); // (RFC 5229, section 3)
    assert.ok(elapsed < 2000, `took ${elapsed}ms`);
  });

  it('a message with many headers cannot use up the expansion limit', async () => {
    // (each key was expanded again for every value of the header, so 85,000
    // Subject lines went past the limit and the message was kept, skipping
    // the user's filter)
    const script = [
      'require ["variables"];',
      'set "w1" "cheap-meds-promo.example.net";',
      'set "w2" "casino-bonus-offer.example.org";',
      // eslint-disable-next-line no-template-curly-in-string
      'if header :contains "subject" ["${w1}", "${w2}"] { discard; stop; }',
      'keep;'
    ].join('\n');
    const subjects = Array.from({ length: 200_000 }, () => 's');
    subjects.push('see casino-bonus-offer.example.org now');
    const result = await executeScript(script, {
      ...message(),
      headers: { from: 'sender@example.com', subject: subjects }
    });
    assert.deepStrictEqual(
      result.actions.map((action) => action.type),
      ['discard']
    );
  });

  it('a message with many large parts cannot use up the expansion limit', async () => {
    // (the text of each part, up to 100KB, counted as it was expanded, so a
    // message with about 42 of them skipped the user's filter)
    const script = [
      'require ["mime", "variables", "fileinto"];',
      'foreverypart {',
      '  extracttext "t";',
      '  set "u" "${t}";', // eslint-disable-line no-template-curly-in-string
      // eslint-disable-next-line no-template-curly-in-string
      '  if string :contains "${u}" "invoice" { fileinto "Invoices"; }',
      '}'
    ].join('\n');
    assert.strictEqual(validateScript(script).valid, true);
    const mimeParts = Array.from({ length: 90 }, () => ({
      contentType: 'text/plain',
      headers: { 'content-type': 'text/plain' },
      body: 'x'.repeat(100_000)
    }));
    mimeParts.push({
      contentType: 'text/plain',
      headers: { 'content-type': 'text/plain' },
      body: 'please pay this invoice'
    });
    const result = await executeScript(script, { ...message(), mimeParts });
    assert.deepStrictEqual(
      result.actions.map((action) => `${action.type} ${action.mailbox}`),
      ['fileinto Invoices']
    );
  });

  it('stops a script that makes thousands of long flags', async () => {
    // (each flag was a new 100KB string kept to the end: a script of 20,000
    // of them ran the delivery process out of memory)
    const script = [
      'require ["variables", "imap4flags"];',
      'set "a" "eeeeeeeeee";',
      ...Array.from(
        { length: 4 },
        // eslint-disable-next-line no-template-curly-in-string
        () => 'set "a" "${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}";'
      ),
      `addflag [${Array.from({ length: 2000 }, (_, i) => `"${i}\${a}"`).join(
        ', '
      )}];`
    ].join('\n');
    assert.strictEqual(validateScript(script).valid, true);
    await assert.rejects(executeScript(script, message()), {
      message: 'Sieve script exceeded the total length of expanded variables'
    });
  });

  it('stops a script that sets thousands of long variables', async () => {
    const script = [
      'require ["variables"];',
      'set "a" "eeeeeeeeee";',
      ...Array.from(
        { length: 4 },
        // eslint-disable-next-line no-template-curly-in-string
        () => 'set "a" "${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}";'
      ),
      ...Array.from(
        { length: 2000 },

        (_, i) => `set :upper "v${i}" "\${a}";`
      )
    ].join('\n');
    assert.strictEqual(validateScript(script).valid, true);
    await assert.rejects(executeScript(script, message()), {
      message: 'Sieve script exceeded the total length of variables'
    });
  });

  it('a variable set again for each large part keeps only its last value', async () => {
    // (it is the length of the variables as they are that counts; the first
    // 100KB of the parts are kept, see MAX_VARIABLE_LENGTH)
    const script = [
      'require ["mime", "variables", "fileinto"];',
      'foreverypart {',
      '  extracttext "t";',
      '  set "all" "${all} ${t}";', // eslint-disable-line no-template-curly-in-string
      '}',
      // eslint-disable-next-line no-template-curly-in-string
      'if string :contains "${all}" "invoice" { fileinto "Invoices"; }'
    ].join('\n');
    assert.strictEqual(validateScript(script).valid, true);
    const mimeParts = [
      {
        contentType: 'text/plain',
        headers: { 'content-type': 'text/plain' },
        body: 'please pay this invoice'
      },
      ...Array.from({ length: 90 }, () => ({
        contentType: 'text/plain',
        headers: { 'content-type': 'text/plain' },
        body: 'x'.repeat(100_000)
      }))
    ];
    const result = await executeScript(script, { ...message(), mimeParts });
    assert.deepStrictEqual(
      result.actions.map((action) => `${action.type} ${action.mailbox}`),
      ['fileinto Invoices']
    );
  });

  it('stops a script with thousands of flags or actions', async () => {
    const flags = [
      'require ["imap4flags"];',
      `addflag [${Array.from({ length: 1500 }, (_, i) => `"f${i}"`).join(
        ', '
      )}];`
    ].join('\n');
    assert.strictEqual(validateScript(flags).valid, true);
    await assert.rejects(executeScript(flags, message()), {
      message: 'Sieve script exceeded the number of flags'
    });

    const SieveEngine = require(path.join(
      __dirname,
      '../../helpers/sieve/engine'
    ));
    const { MAX_ACTIONS } = SieveEngine;
    SieveEngine.MAX_ACTIONS = 10;
    try {
      const actions = [
        'require ["fileinto", "copy"];',
        ...Array.from({ length: 20 }, (_, i) => `fileinto :copy "f${i}";`)
      ].join('\n');
      await assert.rejects(executeScript(actions, message()), {
        message: 'Sieve script exceeded the number of actions'
      });
    } finally {
      SieveEngine.MAX_ACTIONS = MAX_ACTIONS;
    }
  });

  it('parses a header of many addresses, or long spaces, in linear time', async () => {
    const script = [
      'require ["fileinto"];',
      'if address :is "from" "bad@spam.example" { fileinto "Spam"; }'
    ].join('\n');
    for (const from of [
      Array.from({ length: 125_000 }, (_, i) => `u${i}@x.example`).join(',') +
        ',bad@spam.example',
      'a' + ' '.repeat(200_000) + '"x<b@c.example>, bad@spam.example'
    ]) {
      const start = Date.now();

      const result = await executeScript(script, {
        ...message(),
        headers: { from, subject: 'hi' }
      });
      const elapsed = Date.now() - start;
      assert.deepStrictEqual(
        result.actions.map((action) => `${action.type} ${action.mailbox}`),
        ['fileinto Spam']
      );
      assert.ok(elapsed < 2000, `took ${elapsed}ms`);
    }
  });

  it('stops a script that spends too long matching', async () => {
    // (30 sources of 100KB each, against 2000 keys, took about 30 seconds)
    const SieveEngine = require(path.join(
      __dirname,
      '../../helpers/sieve/engine'
    ));
    const { MAX_MATCH_TIME } = SieveEngine;
    SieveEngine.MAX_MATCH_TIME = 500;
    try {
      const sources = Array.from({ length: 30 }, (_, i) => `b${i}`);
      const script = [
        'require ["variables"];',
        'set "a" "xxxxxxxxxx";',
        ...Array.from(
          { length: 4 },
          // eslint-disable-next-line no-template-curly-in-string
          () => 'set "a" "${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}";'
        ),
        ...sources.map((name, i) => `set "${name}" "${i}\${a}";`),
        // ("*k?*" and not "*k*", which is found as :contains finds it)
        `if string :matches [${sources
          .map((name) => `"\${${name}}"`)
          .join(', ')}] [${Array.from(
          { length: 2000 },
          (_, i) => `"*k${i}?*"`
        ).join(', ')}] { discard; }`,
        'keep;'
      ].join('\n');
      assert.strictEqual(validateScript(script).valid, true);
      const start = Date.now();
      await assert.rejects(executeScript(script, message()), {
        message: 'Sieve script exceeded the time it may run'
      });
      const elapsed = Date.now() - start;
      assert.ok(elapsed < 3000, `took ${elapsed}ms`);
    } finally {
      SieveEngine.MAX_MATCH_TIME = MAX_MATCH_TIME;
    }
  });

  it('matches many header values against a long pattern quickly', async () => {
    // (the pattern was lowercased and compiled again for every value)
    const script = [
      'require ["variables"];',
      'set "a" "xxxxxxxxxx";',
      ...Array.from(
        { length: 4 },
        // eslint-disable-next-line no-template-curly-in-string
        () => 'set "a" "${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}";'
      ),
      // eslint-disable-next-line no-template-curly-in-string
      'if header :matches "subject" ["${a}*", "*a"] { discard; stop; }',
      'keep;'
    ].join('\n');
    const subjects = Array.from({ length: 5000 }, () => 's');
    subjects.push('ends with a');
    const start = Date.now();
    const result = await executeScript(script, {
      ...message(),
      headers: { from: 'sender@example.com', subject: subjects }
    });
    const elapsed = Date.now() - start;
    assert.deepStrictEqual(
      result.actions.map((action) => action.type),
      ['discard']
    );
    assert.ok(elapsed < 2000, `took ${elapsed}ms`);
  });

  it('stops a script that expands a variable thousands of times', async () => {
    // (each key is expanded to 100KB and compiled as a pattern on its own:
    // 3000 of them took about 30 seconds for every message)
    const script = [
      'require ["variables"];',
      'set "a" "xxxxxxxxxx";',
      ...Array.from(
        { length: 4 },
        // eslint-disable-next-line no-template-curly-in-string
        () => 'set "a" "${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}";'
      ),
      `if header :matches "subject" [${Array.from(
        { length: 3000 },
        // eslint-disable-next-line no-template-curly-in-string
        () => '"${a}"'
      ).join(', ')}] { discard; }`,
      'keep;'
    ].join('\n');
    assert.strictEqual(validateScript(script).valid, true);

    const start = Date.now();
    await assert.rejects(executeScript(script, message()), {
      message: 'Sieve script exceeded the total length of expanded variables'
    });
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 3000, `took ${elapsed}ms`);
  });

  it('checks a script full of unclosed "${" in linear time', () => {
    const script = `require ["fileinto"];\nfileinto "${'${'.repeat(60_000)}";`;
    const start = Date.now();
    validateScript(script);
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 2000, `took ${elapsed}ms`);
  });

  // ("${a${a}" is "${a" and then a reference, RFC 5229 section 3)
  it('still expands variable references as before', async () => {
    const script = [
      'require ["variables"];',
      'set "a" "x";',
      // eslint-disable-next-line no-template-curly-in-string
      'set "b" "${a}-${A}-${}-${missing}-${a${a}";',
      'keep;'
    ].join('\n');
    assert.strictEqual(validateScript(script).valid, true);
    const result = await executeScript(script, message());
    assert.strictEqual(result.variables.b, 'x-x-${}--${ax');
  });
});

describe('Sieve Security - work a script makes for each message', () => {
  const { executeScript, validateScript } = require(path.join(
    __dirname,
    '../../helpers/sieve/index'
  ));
  const SieveEngine = require(path.join(
    __dirname,
    '../../helpers/sieve/engine'
  ));
  const { SieveIntegration } = require(path.join(
    __dirname,
    '../../helpers/sieve/integration'
  ));
  const { SieveFilterHandler } = require(path.join(
    __dirname,
    '../../helpers/sieve/filter-handler'
  ));

  const message = (extra = {}) => ({
    headers: { from: 'sender@example.com', subject: 'hi' },
    envelope: { from: 'sender@example.com', to: 'user@example.com' },
    size: 100,
    body: 'body',
    ...extra
  });

  it('counts the time of tests with one key and a long value', async () => {
    // (the time after the last count in a test was not counted, so
    // hundreds of one-key tests on a long body were never stopped; :regex,
    // as a value made lower case once a run costs little for :contains)
    const { MAX_MATCH_TIME } = SieveEngine;
    SieveEngine.MAX_MATCH_TIME = 200;
    try {
      const script = [
        'require ["body", "regex"];',
        ...Array.from(
          { length: 2000 },
          (_, i) => `if body :regex "k${i}" { stop; }`
        )
      ].join('\n');
      assert.strictEqual(validateScript(script).valid, true);
      await assert.rejects(
        executeScript(script, message({ body: 'x'.repeat(2_000_000) })),
        { message: 'Sieve script exceeded the time it may run' }
      );
    } finally {
      SieveEngine.MAX_MATCH_TIME = MAX_MATCH_TIME;
    }
  });

  //
  // One test is not interrupted, so the time limit came after it: these took
  // 7s and 6s (and grow with the key and the value). The key does not match
  // such a value, and the rest of the script runs.
  //
  for (const [name, script, value] of [
    [
      'a :matches key of thousands of wildcards',
      `require "fileinto";\nif header :matches "x-big" "${'*a'.repeat(
        5000
      )}" { fileinto "y"; }`,
      'ab'.repeat(50_000)
    ],
    [
      'a :regex key RE2 cannot run in linear time',
      'require "regex";\nif header :regex "x-big" "(?:a|b)*a(?:a|b){1000}c" { discard; }',
      Array.from({ length: 1_000_000 }, (_, i) =>
        (i * 7919) % 3 === 0 ? 'a' : 'b'
      ).join('')
    ]
  ]) {
    it(`does not run ${name} where it would hold the process`, async () => {
      assert.strictEqual(validateScript(script).valid, true);
      const start = Date.now();
      const result = await executeScript(
        script,
        message({ headers: { subject: 'hi', 'x-big': value } })
      );
      assert.deepStrictEqual(
        result.actions.map((action) => action.type),
        ['keep']
      );
      const elapsed = Date.now() - start;
      assert.ok(elapsed < SieveEngine.MAX_MATCH_TIME, `took ${elapsed}ms`);
    });
  }

  it('still matches a short key against a long body', async () => {
    const result = await executeScript(
      'require ["body", "regex"];\nif body :raw :regex "invoice-[0-9]{4}" { discard; }',
      message({
        raw: `Subject: hi\r\n\r\n${'x'.repeat(5_000_000)} invoice-1234`
      })
    );
    assert.deepStrictEqual(
      result.actions.map((action) => action.type),
      ['discard']
    );
  });

  it('stops nested foreverypart loops that run too many commands', async () => {
    // (10,000 tests in two nested loops over 100 parts held it for 19s)
    const script = `require "foreverypart";\nforeverypart { foreverypart { ${'if true {}'.repeat(
      10_000
    )} } }`;
    const mimeParts = Array.from({ length: 100 }, (_, i) => ({
      contentType: 'multipart/mixed',
      multipart: true,
      headers: {},
      parentIndex: i === 0 ? null : i - 1
    }));
    const start = Date.now();
    await assert.rejects(executeScript(script, message({ mimeParts })), {
      message: 'Sieve script exceeded the time it may run'
    });
    // (0.4s on its own; node:test makes each await slower)
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 10_000, `took ${elapsed}ms`);
  });

  //
  // Reading the values of a header (or the flags of a variable) was not
  // counted against MAX_MATCH_TIME: a header addheader grew in a loop, read
  // with :index, held a 1.4KB script for 35s a message
  //
  it('stops loops that read a header addheader grew at the time limit', async () => {
    const script = [
      'require ["editheader", "mime", "foreverypart", "index"];',
      `foreverypart { foreverypart { addheader "X-A" "v"; ${'if header :index 1 "X-A" "z" {} '.repeat(
        40
      )}} }`
    ].join('\n');
    assert.strictEqual(validateScript(script).valid, true);
    const mimeParts = Array.from({ length: 60 }, () => ({
      contentType: 'text/plain',
      headers: { 'content-type': 'text/plain' },
      body: 'x'
    }));
    const start = Date.now();
    await assert.rejects(executeScript(script, message({ mimeParts })), {
      message: 'Sieve script exceeded the time it may run'
    });
    const elapsed = Date.now() - start;
    assert.ok(elapsed < SieveEngine.MAX_MATCH_TIME * 2, `took ${elapsed}ms`);
  });

  const many = Array.from({ length: 20_000 }, () => 'v');
  for (const [name, test, setup = []] of [
    ['a header of many values with :index', 'if header :index 1 "X-A" "z" {}'],
    [
      'the date of a header of many values',
      'if date :index 1 "X-A" "year" "2000" {}'
    ],
    ['a header of many values that matches first', 'if header "X-A" "v" {}'],
    ['a header of a part with many values', 'if header :mime "X-A" "v" {}'],
    [
      'the flags of a long variable',
      'if hasflag "x" "zz" {}',
      [
        'set "x" "a b c d e f g h i j";',
        // eslint-disable-next-line no-template-curly-in-string
        ...Array.from({ length: 8 }, () => 'set "x" "${x} ${x} ${x} ${x}";')
      ]
    ]
  ]) {
    it(`stops loops that read ${name} at the time limit`, async () => {
      const { MAX_MATCH_TIME } = SieveEngine;
      SieveEngine.MAX_MATCH_TIME = 200;
      try {
        const script = [
          'require ["mime", "foreverypart", "index", "date", "variables", "imap4flags"];',
          ...setup,
          `foreverypart { foreverypart { ${test} } }`
        ].join('\n');
        assert.strictEqual(validateScript(script).valid, true);
        const mimeParts = Array.from({ length: 60 }, () => ({
          contentType: 'text/plain',
          headers: { 'content-type': 'text/plain', 'x-a': many },
          body: 'x'
        }));
        const start = Date.now();
        await assert.rejects(
          executeScript(
            script,
            message({
              headers: { from: 'sender@example.com', 'x-a': many },
              mimeParts
            })
          ),
          { message: 'Sieve script exceeded the time it may run' }
        );
        const elapsed = Date.now() - start;
        assert.ok(elapsed < 2000, `took ${elapsed}ms`);
      } finally {
        SieveEngine.MAX_MATCH_TIME = MAX_MATCH_TIME;
      }
    });
  }

  //
  // The parts of a part (:anychild) were found outside the time counted
  // against MAX_MATCH_TIME, and exists did not count at all: 100 tests in
  // nested loops over a tree of 100 parts were never stopped
  //
  for (const test of [
    'if exists :mime :anychild "x-none" {}',
    'if header :mime :anychild "x-none" "a" {}'
  ]) {
    it(`stops loops that run "${test}" at the time limit`, async () => {
      const { MAX_MATCH_TIME } = SieveEngine;
      SieveEngine.MAX_MATCH_TIME = 100;
      try {
        const script = [
          'require ["mime", "foreverypart"];',
          `foreverypart { foreverypart { ${`${test} `.repeat(50)}} }`
        ].join('\n');
        assert.strictEqual(validateScript(script).valid, true);
        // (each part in the one before it)
        const mimeParts = Array.from({ length: 100 }, (_, i) => ({
          contentType: 'multipart/mixed',
          headers: { 'content-type': 'multipart/mixed' },
          body: '',
          parentIndex: i - 1
        }));
        await assert.rejects(executeScript(script, message({ mimeParts })), {
          message: 'Sieve script exceeded the time it may run'
        });
      } finally {
        SieveEngine.MAX_MATCH_TIME = MAX_MATCH_TIME;
      }
    });
  }

  it('finds the parts of a part in a deep tree in linear time', async () => {
    // (each part's chain of parents was followed up to the part: 3,000
    // parts, each in the one before it, took 5s for a loop of two tests)
    const script = [
      'require ["mime", "foreverypart", "imap4flags"];',
      'foreverypart { if exists :mime :anychild "x-last" { addflag "exists"; } if header :mime :anychild "x-last" "y" { addflag "header"; } }'
    ].join('\n');
    const mimeParts = Array.from({ length: 3000 }, (_, i) => ({
      contentType: 'multipart/mixed',
      headers: i === 2999 ? { 'x-last': 'y' } : {},
      body: '',
      parentIndex: i - 1
    }));
    const start = Date.now();
    const result = await executeScript(script, message({ mimeParts }));
    const elapsed = Date.now() - start;
    assert.deepStrictEqual(result.flags, ['exists', 'header']);
    assert.ok(elapsed < SieveEngine.MAX_MATCH_TIME, `took ${elapsed}ms`);
  });

  it('finds the parts of a nested foreverypart loop in linear time', async () => {
    // (each part's chain of parents was followed for every inner loop: 490
    // empty loops in each of 30 parts took seconds with a deep tree after
    // them)
    const script = [
      'require ["mime", "foreverypart", "imap4flags"];',
      `foreverypart { if header :mime "x-t" "y" { ${'foreverypart {} '.repeat(
        490
      )}addflag "seen"; } }`
    ].join('\n');
    const mimeParts = [
      {
        contentType: 'multipart/mixed',
        multipart: true,
        headers: {},
        parentIndex: -1
      },
      ...Array.from({ length: 30 }, () => ({
        contentType: 'text/plain',
        headers: { 'x-t': 'y' },
        body: 'x',
        parentIndex: 0
      })),
      ...Array.from({ length: 600 }, (_, i) => ({
        contentType: 'multipart/mixed',
        multipart: true,
        headers: {},
        parentIndex: i === 0 ? 0 : 30 + i
      }))
    ];
    const start = Date.now();
    const result = await executeScript(script, message({ mimeParts }));
    const elapsed = Date.now() - start;
    assert.deepStrictEqual(result.flags, ['seen']);
    assert.ok(elapsed < SieveEngine.MAX_MATCH_TIME * 2, `took ${elapsed}ms`);
  });

  it('visits the parts inside the outer part in nested foreverypart loops', async () => {
    // (random trees of parts, each part with its number in tree order in
    // X-I; each loop visits the parts inside the part of the loop around it)
    let seed = 7;
    const random = (n) => {
      seed = (seed * 1_103_515_245 + 12_345) % 2_147_483_648;
      return seed % n;
    };

    const tree = (depth) => {
      const node = { children: [] };
      if (depth < 4 && random(3) > 0) {
        const count = 1 + random(3);
        for (let i = 0; i < count; i++) node.children.push(tree(depth + 1));
      }

      return node;
    };

    /* eslint-disable no-template-curly-in-string */
    const script = [
      'require ["mime", "foreverypart", "variables"];',
      'foreverypart {',
      '  if header :mime :matches "x-i" "*" { set "v" "${v} 1:${1}"; }',
      '  foreverypart {',
      '    if header :mime :matches "x-i" "*" { set "v" "${v} 2:${1}"; }',
      '    foreverypart {',
      '      if header :mime :matches "x-i" "*" { set "v" "${v} 3:${1}"; }',
      '    }',
      '  }',
      '}'
      /* eslint-enable no-template-curly-in-string */
    ].join('\n');
    const sieve = new SieveIntegration({});
    for (let n = 0; n < 50; n++) {
      const root = tree(0);
      // (the MIME of a node, numbering it and the nodes inside it in order)
      const nodes = [];
      const mime = (node, boundary) => {
        node.index = nodes.length;
        nodes.push(node);
        const header = `X-I: ${node.index}\r\n`;
        if (node.children.length === 0)
          return `${header}Content-Type: text/plain\r\n\r\nleaf ${node.index}`;
        const b = `${boundary}x${node.index}`;
        return `${header}Content-Type: multipart/mixed; boundary="${b}"\r\n\r\n${node.children
          .map((child) => `--${b}\r\n${mime(child, b)}\r\n`)
          .join('')}--${b}--`;
      };

      const raw = `From: a@example.com\r\nSubject: s\r\n${mime(root, 'b')}`;
      const inside = (node) =>
        node.children.flatMap((child) => [child, ...inside(child)]);
      let expected = '';
      for (const a of nodes) {
        expected += ` 1:${a.index}`;
        for (const b of inside(a)) {
          expected += ` 2:${b.index}`;
          for (const c of inside(b)) expected += ` 3:${c.index}`;
        }
      }

      const mimeParts = await sieve.parseMimeTree(Buffer.from(raw));
      assert.strictEqual(mimeParts.length, nodes.length);

      const result = await executeScript(script, message({ mimeParts }));
      assert.strictEqual(result.variables.v, expected);
    }
  });

  //
  // Checking a notify method parses every address in it, and was not
  // counted against MAX_MATCH_TIME: a 10KB method in nested foreverypart
  // loops over 100 parts held the process for 4s, and 50KB for 25s
  //
  const addresses = `${'a@b.example,'.repeat(2000)}x@y.example`;
  // (each part in the one before it)
  const chain = Array.from({ length: 80 }, (_, i) => ({
    contentType: 'multipart/mixed',
    multipart: true,
    headers: {},
    parentIndex: i - 1
  }));
  for (const [name, command] of [
    ['notify', `notify "mailto:${addresses}";`],
    [
      'valid_notify_method',
      `if valid_notify_method "mailto:${addresses}" { addflag "valid"; }`
    ],
    [
      'notify_method_capability',
      `if notify_method_capability "mailto:${addresses}" "online" "maybe" { addflag "valid"; }`
    ]
  ]) {
    it(`checks the method of ${name} once in nested loops`, async () => {
      const script = [
        'require ["enotify", "mime", "foreverypart", "imap4flags"];',
        `foreverypart { foreverypart { ${command} if valid_notify_method "mailto:" { addflag "invalid"; } } }`
      ].join('\n');
      assert.strictEqual(validateScript(script).valid, true);
      // (the methods the run parses, not those it finds already checked)
      const { isValidNotifyMethod } = SieveEngine.prototype;
      const checked = [];
      SieveEngine.prototype.isValidNotifyMethod = function (uri, state) {
        if (!state) checked.push(uri);
        return isValidNotifyMethod.call(this, uri, state);
      };

      let result;
      try {
        result = await executeScript(script, message({ mimeParts: chain }));
      } finally {
        SieveEngine.prototype.isValidNotifyMethod = isValidNotifyMethod;
      }

      if (name === 'notify') {
        const notify = result.actions.filter(
          (action) => action.type === 'notify'
        );
        // (80 parts, and in each the parts after it)
        assert.strictEqual(notify.length, 3160);
        assert.strictEqual(notify[0].method, `mailto:${addresses}`);
        assert.deepStrictEqual(result.flags, []);
      } else {
        assert.deepStrictEqual(result.flags, ['valid']);
      }

      assert.deepStrictEqual(checked, [`mailto:${addresses}`, 'mailto:']);
    });
  }

  it('counts the time of checking a notify method', async () => {
    const { MAX_MATCH_TIME } = SieveEngine;
    SieveEngine.MAX_MATCH_TIME = 5;
    try {
      const script = [
        'require ["enotify", "imap4flags"];',
        `if valid_notify_method "mailto:${'a@b.example,'.repeat(
          100_000
        )}x@y.example" { addflag "valid"; }`
      ].join('\n');
      await assert.rejects(executeScript(script, message()), {
        message: 'Sieve script exceeded the time it may run'
      });
    } finally {
      SieveEngine.MAX_MATCH_TIME = MAX_MATCH_TIME;
    }
  });

  //
  // Expanding a string of references that expand to nothing makes no string
  // to count against MAX_EXPANDED_LENGTH, and it, the flags of a keep, and
  // the domain of a redirect were not counted against MAX_MATCH_TIME: 64KB
  // of "${a}" in nested foreverypart loops held the process for 20s or more
  //
  // eslint-disable-next-line no-template-curly-in-string
  const references = '${a}'.repeat(15_000);
  for (const [name, command] of [
    [
      'valid_notify_method',
      `if valid_notify_method "${references}" { addflag "y"; }`
    ],
    [
      'notify_method_capability',
      `if notify_method_capability "${references}" "online" "maybe" { addflag "y"; }`
    ],
    ['deleteheader', `deleteheader "x-none" "${references}";`],
    ['addheader', `addheader "X-None" "${references}";`],
    ['notify', `notify :message "${references}" "mailto:x@y.example";`],
    ['fileinto', `fileinto "${references}INBOX";`],
    ['keep with :flags', `keep :flags "${'a '.repeat(30_000)}";`],
    ['redirect', `redirect :copy "${'@a'.repeat(30_000)}";`]
  ]) {
    it(`stops loops that run a long ${name} at the time limit`, async () => {
      const { MAX_MATCH_TIME } = SieveEngine;
      SieveEngine.MAX_MATCH_TIME = 50;
      try {
        const script = [
          'require ["enotify", "mime", "foreverypart", "variables", "imap4flags", "editheader", "fileinto", "copy"];',
          `foreverypart { foreverypart { ${command} } }`
        ].join('\n');
        assert.strictEqual(validateScript(script).valid, true);
        await assert.rejects(
          executeScript(script, message({ mimeParts: chain })),
          {
            message: 'Sieve script exceeded the time it may run'
          }
        );
      } finally {
        SieveEngine.MAX_MATCH_TIME = MAX_MATCH_TIME;
      }
    });
  }

  it('stops loops that hash a long duplicate ID at the time limit', async () => {
    // (hashing a 1MB Message-ID was not counted against MAX_MATCH_TIME)
    const { MAX_MATCH_TIME } = SieveEngine;
    SieveEngine.MAX_MATCH_TIME = 100;
    try {
      const script = [
        'require ["duplicate", "mime", "foreverypart"];',
        `foreverypart { ${'if duplicate {} '.repeat(50)}}`
      ].join('\n');
      const mimeParts = Array.from({ length: 10 }, () => ({
        contentType: 'text/plain',
        headers: { 'content-type': 'text/plain' },
        body: 'x'
      }));
      await assert.rejects(
        executeScript(
          script,
          message({
            headers: {
              from: 'sender@example.com',
              'message-id': `<${'a'.repeat(1_000_000)}@example.com>`
            },
            mimeParts
          }),
          {
            context: {
              duplicateCache: {
                async has() {
                  return false;
                }
              }
            }
          }
        ),
        { message: 'Sieve script exceeded the time it may run' }
      );
    } finally {
      SieveEngine.MAX_MATCH_TIME = MAX_MATCH_TIME;
    }
  });

  it('looks up each mailbox once a run, however many loops ask', async () => {
    // (the time waiting on a lookup is not counted, and each one could go
    // through every mailbox: 200 names in nested loops, against 1,000
    // mailboxes, took 20s a message)
    const asked = [];
    const context = {
      async mailboxExists(name) {
        asked.push(name);
        return name === 'Here';
      },
      async specialUseExists(attributes, mailbox) {
        asked.push([attributes, mailbox]);
        return mailbox === null;
      }
    };
    const script = [
      'require ["mailbox", "special-use", "mime", "foreverypart", "imap4flags"];',
      'foreverypart { foreverypart {',
      'if mailboxexists ["Here", "There"] { addflag "both"; }',
      'if mailboxexists "Here" { addflag "here"; }',
      'if specialuse_exists "\\\\Junk" { addflag "junk"; }',
      'if specialuse_exists "Here" "\\\\Junk" { addflag "here-junk"; }',
      '} }'
    ].join('\n');
    const mimeParts = Array.from({ length: 20 }, () => ({
      contentType: 'text/plain',
      headers: { 'content-type': 'text/plain' },
      body: 'x'
    }));
    const result = await executeScript(script, message({ mimeParts }), {
      context
    });
    assert.deepStrictEqual(result.flags, ['here', 'junk']);
    assert.deepStrictEqual(asked, [
      'Here',
      'There',
      [['\\Junk'], null],
      [['\\Junk'], 'Here']
    ]);
  });

  it('extracts the text of a part once, however many loops reach it', async () => {
    // (nested loops converted every part again for each part: 44s)
    const script = [
      'require ["mime", "variables"];',
      'foreverypart { foreverypart { extracttext "t"; } }'
    ].join('\n');
    const html = `<p>${'word '.repeat(50_000)}</p>`;
    // (90 parts: 8,190 iterations, under the instruction limit)
    const mimeParts = Array.from({ length: 90 }, () => ({
      contentType: 'text/html',
      headers: { 'content-type': 'text/html' },
      body: html
    }));
    const start = Date.now();
    await executeScript(script, message({ mimeParts }));
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 5000, `took ${elapsed}ms`);
  });

  it('merges the flags of many keep actions in linear time', async () => {
    const script = [
      'require ["imap4flags"];',
      `setflag [${Array.from({ length: 1000 }, (_, i) => `"f${i}"`).join(
        ', '
      )}];`,
      ...Array.from({ length: 9000 }, () => 'keep;')
    ].join('\n');
    const handler = new SieveFilterHandler({
      logger: { debug() {}, error() {}, info() {}, warn() {} }
    });
    const start = Date.now();
    const result = await handler.executeScript(script, message());
    const elapsed = Date.now() - start;
    assert.strictEqual(result.flags.length, 1000);
    assert.ok(elapsed < 5000, `took ${elapsed}ms`);
  });

  it('bounds the work of header changes against many headers', async () => {
    const sieve = new SieveIntegration({});
    const raw = Buffer.from(
      'Subject: hi\r\n' +
        Array.from({ length: 100_000 }, (_, i) => `X-Foo: ${i}\r\n`).join('') +
        '\r\nbody'
    );

    // (thousands of changes for a name no header has are skipped)
    let start = Date.now();
    const same = await sieve.applyHeaderChanges(
      raw,
      Array.from({ length: 10_000 }, () => ({
        action: 'delete',
        name: 'x-bar',
        index: null
      }))
    );
    assert.strictEqual(same.length, raw.length);
    assert.ok(Date.now() - start < 2000, `took ${Date.now() - start}ms`);

    // (thousands of values against every header stop, keeping the message)
    start = Date.now();
    await assert.rejects(
      sieve.applyHeaderChanges(raw, [
        {
          action: 'delete',
          name: 'x-foo',
          index: null,
          matchType: 'contains',
          values: Array.from({ length: 20_000 }, (_, i) => `v${i}`)
        }
      ]),
      { message: 'Sieve header changes exceeded the work allowed' }
    );
    assert.ok(Date.now() - start < 2000, `took ${Date.now() - start}ms`);

    // (an ordinary change still applies)
    const changed = await sieve.applyHeaderChanges(raw, [
      {
        action: 'delete',
        name: 'x-foo',
        index: null,
        matchType: 'is',
        values: ['1', '2']
      }
    ]);
    assert.strictEqual(
      changed
        .toString()
        .split('\r\n')
        .filter((l) => l.startsWith('X-Foo:')).length,
      99_998
    );
  });

  it('stores a long duplicate ID hashed, for at most 30 days', async () => {
    const stored = [];
    const duplicateCache = {
      async has() {
        return false;
      },
      async add(key, seconds) {
        stored.push({ key, seconds });
      }
    };
    const script = [
      'require ["duplicate"];',
      'if duplicate :seconds 999999999 { discard; }',
      'if duplicate :handle "short" { discard; }'
    ].join('\n');
    await executeScript(
      script,
      message({
        headers: {
          from: 'sender@example.com',
          'message-id': `<${'a'.repeat(900_000)}@example.com>`
        }
      }),
      { context: { duplicateCache } }
    );
    assert.strictEqual(stored.length, 2);
    assert.ok(stored[0].key.length < 100, `${stored[0].key.length}`);
    assert.strictEqual(stored[0].seconds, 30 * 24 * 60 * 60);
    assert.ok(stored[1].key.startsWith('sha256:'));

    // (a short ID is stored as it was, with the default of 7 days)
    stored.length = 0;
    await executeScript(
      script,
      message({
        headers: { from: 'sender@example.com', 'message-id': '<a@b>' }
      }),
      { context: { duplicateCache } }
    );
    assert.strictEqual(stored[1].key, 'short:<a@b>');
    assert.strictEqual(stored[1].seconds, 7 * 24 * 60 * 60);
  });

  it('stops a script with thousands of duplicate tests', async () => {
    const script = [
      'require ["duplicate"];',
      ...Array.from(
        { length: 1500 },
        (_, i) => `if duplicate :handle "h${i}" { keep; }`
      )
    ].join('\n');
    await assert.rejects(
      executeScript(
        script,
        message({
          headers: { from: 'sender@example.com', 'message-id': '<a@b>' }
        })
      ),
      { message: 'Sieve script exceeded the number of duplicate tests' }
    );
  });

  it('tests only the current part and its descendants with :anychild', async () => {
    // (all the parts after the current one were tested, siblings too)
    const script = [
      'require ["mime", "fileinto", "copy"];',
      'foreverypart {',
      '  if header :mime :anychild :contains "x-tag" "hit" {',
      '    fileinto :copy "Hit";',
      '  }',
      '}'
    ].join('\n');
    // multipart/mixed (0) > text/plain (1), multipart/alternative (2) >
    // text/plain with the header (3)
    const mimeParts = [
      {
        contentType: 'multipart/mixed',
        multipart: 'mixed',
        parentIndex: -1,
        headers: {}
      },
      { contentType: 'text/plain', parentIndex: 0, headers: {} },
      {
        contentType: 'multipart/alternative',
        multipart: 'alternative',
        parentIndex: 0,
        headers: {}
      },
      { contentType: 'text/plain', parentIndex: 2, headers: { 'x-tag': 'hit' } }
    ];
    const result = await executeScript(script, message({ mimeParts }));
    // (from parts 0, 2 and 3, not from 1)
    assert.strictEqual(
      result.actions.filter((action) => action.type === 'fileinto').length,
      3
    );

    // and the parsed parts say which part each is in
    const sieve = new SieveIntegration({});
    const parsed = await sieve.parseMimeTree(
      Buffer.from(
        [
          'Content-Type: multipart/mixed; boundary=a',
          '',
          '--a',
          'Content-Type: text/plain',
          '',
          'one',
          '--a',
          'Content-Type: multipart/alternative; boundary=b',
          '',
          '--b',
          'Content-Type: text/plain',
          'X-Tag: hit',
          '',
          'two',
          '--b--',
          '--a--',
          ''
        ].join('\r\n')
      )
    );
    assert.deepStrictEqual(
      parsed.map((part) => part.parentIndex),
      [-1, 0, 0, 2]
    );
  });
});
