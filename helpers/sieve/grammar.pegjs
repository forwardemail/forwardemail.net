/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * Sieve Email Filtering Language Grammar (RFC 5228)
 * This grammar defines the syntax for parsing Sieve scripts.
 */

{
  // Helper function to create AST nodes
  function node(type, props) {
    return { type, ...props, location: location() };
  }

  // Helper to flatten arrays
  function flatten(arr) {
    return arr.reduce((acc, val) => acc.concat(val), []);
  }
}

// Entry point - a Sieve script is a list of commands
Script
  = _ commands:CommandList _ {
      return node('Script', { commands });
    }

CommandList
  = commands:(Command _)* {
      return commands.map(c => c[0]);
    }

Command
  = ControlCommand
  / ActionCommand

// Control Commands
ControlCommand
  = IfCommand
  / RequireCommand
  / StopCommand

IfCommand
  = "if"i _ test:Test _ block:Block elsifParts:ElsifPart* elsePart:ElsePart? {
      return node('If', {
        test,
        block,
        elsif: elsifParts,
        else: elsePart
      });
    }

ElsifPart
  = _ "elsif"i _ test:Test _ block:Block {
      return node('Elsif', { test, block });
    }

ElsePart
  = _ "else"i _ block:Block {
      return block;
    }

RequireCommand
  = "require"i _ capabilities:StringList _ ";" {
      return node('Require', { capabilities });
    }

StopCommand
  = "stop"i _ ";" {
      return node('Stop');
    }

// Action Commands
ActionCommand
  = KeepCommand
  / FileintoCommand
  / RedirectCommand
  / DiscardCommand
  / RejectCommand
  / ErejectCommand
  / SetflagCommand
  / AddflagCommand
  / RemoveflagCommand
  / VacationCommand
  / SetCommand
  / AddheaderCommand
  / DeleteheaderCommand
  / NotifyCommand

KeepCommand
  = "keep"i _ flags:FlagsTag? _ ";" {
      return node('Keep', { flags: flags || [] });
    }

FileintoCommand
  = "fileinto"i _ copy:CopyTag? _ create:CreateTag? _ specialuse:SpecialuseTag? _ flags:FlagsTag? _ mailbox:String _ ";" {
      return node('Fileinto', {
        mailbox,
        copy: copy || false,
        create: create || false,
        specialuse: specialuse || null,
        flags: flags || []
      });
    }

RedirectCommand
  = "redirect"i _ copy:CopyTag? _ address:String _ ";" {
      return node('Redirect', {
        address,
        copy: copy || false
      });
    }

DiscardCommand
  = "discard"i _ ";" {
      return node('Discard');
    }

RejectCommand
  = "reject"i _ message:String _ ";" {
      return node('Reject', { message });
    }

ErejectCommand
  = "ereject"i _ message:String _ ";" {
      return node('Ereject', { message });
    }

// IMAP4 Flags Extension (RFC 5232)
SetflagCommand
  = "setflag"i _ variableName:FlagVariableName? _ flags:StringList _ ";" {
      return node('Setflag', {
        variableName: variableName || null,
        flags
      });
    }

// Variable name for flag commands - must be followed by a string list
FlagVariableName
  = name:String &(_ StringList) { return name; }

AddflagCommand
  = "addflag"i _ variableName:FlagVariableName? _ flags:StringList _ ";" {
      return node('Addflag', {
        variableName: variableName || null,
        flags
      });
    }

RemoveflagCommand
  = "removeflag"i _ variableName:FlagVariableName? _ flags:StringList _ ";" {
      return node('Removeflag', {
        variableName: variableName || null,
        flags
      });
    }

// Variables Extension (RFC 5229)
SetCommand
  = "set"i _ modifiers:SetModifier* _ name:String _ value:String _ ";" {
      return node('Set', {
        modifiers,
        name,
        value
      });
    }

SetModifier
  = ":lower"i _ { return 'lower'; }
  / ":upper"i _ { return 'upper'; }
  / ":lowerfirst"i _ { return 'lowerfirst'; }
  / ":upperfirst"i _ { return 'upperfirst'; }
  / ":quotewildcard"i _ { return 'quotewildcard'; }
  / ":length"i _ { return 'length'; }

// Edit Header Extension (RFC 5293)
AddheaderCommand
  = "addheader"i _ last:LastTag? _ name:String _ value:String _ ";" {
      return node('Addheader', {
        last: last || false,
        name,
        value
      });
    }

DeleteheaderCommand
  = "deleteheader"i _ index:IndexTag? _ matchType:MatchType? _ comparator:Comparator? _ name:String _ values:StringList? _ ";" {
      return node('Deleteheader', {
        index: index || null,
        matchType: matchType || 'is',
        comparator: comparator || 'i;ascii-casemap',
        name,
        values: values || []
      });
    }

// Vacation Extension (RFC 5230)
VacationCommand
  = "vacation"i _ args:VacationArgs _ message:String _ ";" {
      return node('Vacation', {
        ...args,
        message
      });
    }

VacationArgs
  = args:(VacationArg _)* {
      const result = {
        days: null,
        seconds: null,
        subject: null,
        from: null,
        addresses: [],
        mime: false,
        handle: null
      };
      for (const [arg] of args) {
        Object.assign(result, arg);
      }
      return result;
    }

VacationArg
  = ":days"i _ n:Number { return { days: n }; }
  / ":seconds"i _ n:Number { return { seconds: n }; }
  / ":subject"i _ s:String { return { subject: s }; }
  / ":from"i _ s:String { return { from: s }; }
  / ":addresses"i _ a:StringList { return { addresses: a }; }
  / ":mime"i { return { mime: true }; }
  / ":handle"i _ s:String { return { handle: s }; }

// Notify Extension (RFC 5435)
NotifyCommand
  = "notify"i _ args:NotifyArgs _ ";" {
      return node('Notify', args);
    }

NotifyArgs
  = args:(NotifyArg _)* {
      const result = {
        method: null,
        from: null,
        importance: null,
        options: [],
        message: null
      };
      for (const [arg] of args) {
        Object.assign(result, arg);
      }
      return result;
    }

NotifyArg
  = ":method"i _ s:String { return { method: s }; }
  / ":from"i _ s:String { return { from: s }; }
  / ":importance"i _ s:String { return { importance: s }; }
  / ":options"i _ a:StringList { return { options: a }; }
  / ":message"i _ s:String { return { message: s }; }

// Tags
CopyTag
  = ":copy"i _ { return true; }

CreateTag
  = ":create"i _ { return true; }

// Special-Use Extension (RFC 8579)
SpecialuseTag
  = ":specialuse"i _ attr:String _ { return attr; }

FlagsTag
  = ":flags"i _ flags:StringList _ { return flags; }

LastTag
  = ":last"i _ { return true; }

IndexTag
  = ":index"i _ n:Number _ { return n; }

// Tests
Test
  = AllofTest
  / AnyofTest
  / NotTest
  / TrueTest
  / FalseTest
  / AddressTest
  / HeaderTest
  / EnvelopeTest
  / SizeTest
  / ExistsTest
  / BodyTest
  / DateTest
  / CurrentdateTest
  / HasflagTest
  / StringTest
  / EnvironmentTest
  / DuplicateTest
  / IhaveTest
  / MailboxexistsTest
  / MetadataTest
  / MetadataexistsTest
  / SpecialuseexistsTest
  / ValidextlistTest

AllofTest
  = "allof"i _ "(" _ tests:TestList _ ")" {
      return node('AllofTest', { tests });
    }

AnyofTest
  = "anyof"i _ "(" _ tests:TestList _ ")" {
      return node('AnyofTest', { tests });
    }

NotTest
  = "not"i _ test:Test {
      return node('NotTest', { test });
    }

TrueTest
  = "true"i {
      return node('TrueTest');
    }

FalseTest
  = "false"i {
      return node('FalseTest');
    }

AddressTest
  = "address"i _ addressPart:AddressPart? _ matchType:MatchType? _ comparator:Comparator? _ headers:StringList _ keys:StringList {
      return node('AddressTest', {
        addressPart: addressPart || 'all',
        matchType: matchType || 'is',
        comparator: comparator || 'i;ascii-casemap',
        headers,
        keys
      });
    }

HeaderTest
  = "header"i _ opts:HeaderTestOptions _ headers:StringList _ keys:StringList {
      return node('HeaderTest', {
        matchType: opts.matchType || 'is',
        comparator: opts.comparator || 'i;ascii-casemap',
        headers,
        keys
      });
    }

HeaderTestOptions
  = opts:(HeaderTestOption _)* {
      const result = { matchType: null, comparator: null };
      for (const [opt] of opts) {
        Object.assign(result, opt);
      }
      return result;
    }

HeaderTestOption
  = m:MatchType { return { matchType: m }; }
  / c:Comparator { return { comparator: c }; }

EnvelopeTest
  = "envelope"i _ addressPart:AddressPart? _ matchType:MatchType? _ comparator:Comparator? _ parts:StringList _ keys:StringList {
      return node('EnvelopeTest', {
        addressPart: addressPart || 'all',
        matchType: matchType || 'is',
        comparator: comparator || 'i;ascii-casemap',
        parts,
        keys
      });
    }

SizeTest
  = "size"i _ ":over"i _ size:Number {
      return node('SizeTest', { over: size });
    }
  / "size"i _ ":under"i _ size:Number {
      return node('SizeTest', { under: size });
    }

ExistsTest
  = "exists"i _ headers:StringList {
      return node('ExistsTest', { headers });
    }

// Body Extension (RFC 5173)
BodyTest
  = "body"i _ bodyTransform:BodyTransform? _ matchType:MatchType? _ comparator:Comparator? _ keys:StringList {
      return node('BodyTest', {
        bodyTransform: bodyTransform || 'text',
        matchType: matchType || 'is',
        comparator: comparator || 'i;ascii-casemap',
        keys
      });
    }

BodyTransform
  = ":raw"i _ { return 'raw'; }
  / ":content"i _ contentTypes:StringList _ { return { type: 'content', contentTypes }; }
  / ":text"i _ { return 'text'; }

// Date Extension (RFC 5260)
DateTest
  = "date"i _ zone:ZoneTag? _ originalZone:OriginalzoneTag? _ matchType:MatchType? _ comparator:Comparator? _ header:String _ datePart:String _ keys:StringList {
      return node('DateTest', {
        zone: zone || null,
        originalZone: originalZone || false,
        matchType: matchType || 'is',
        comparator: comparator || 'i;ascii-casemap',
        header,
        datePart,
        keys
      });
    }

CurrentdateTest
  = "currentdate"i _ zone:ZoneTag? _ matchType:MatchType? _ comparator:Comparator? _ datePart:String _ keys:StringList {
      return node('CurrentdateTest', {
        zone: zone || null,
        matchType: matchType || 'is',
        comparator: comparator || 'i;ascii-casemap',
        datePart,
        keys
      });
    }

ZoneTag
  = ":zone"i _ zone:String _ { return zone; }

OriginalzoneTag
  = ":originalzone"i _ { return true; }

// IMAP4 Flags Extension (RFC 5232)
HasflagTest
  = "hasflag"i _ matchType:MatchType? _ comparator:Comparator? _ variableName:HasflagVariableName? _ flags:StringList {
      return node('HasflagTest', {
        matchType: matchType || 'is',
        comparator: comparator || 'i;ascii-casemap',
        variableName: variableName || null,
        flags
      });
    }

// Variable name for hasflag test - must be followed by a string list
HasflagVariableName
  = name:String &(_ StringList) { return name; }

// Variables Extension (RFC 5229)
StringTest
  = "string"i _ matchType:MatchType? _ comparator:Comparator? _ source:StringList _ keys:StringList {
      return node('StringTest', {
        matchType: matchType || 'is',
        comparator: comparator || 'i;ascii-casemap',
        source,
        keys
      });
    }

// Environment Extension (RFC 5183)
EnvironmentTest
  = "environment"i _ matchType:MatchType? _ comparator:Comparator? _ name:String _ keys:StringList {
      return node('EnvironmentTest', {
        matchType: matchType || 'is',
        comparator: comparator || 'i;ascii-casemap',
        name,
        keys
      });
    }

// Duplicate Extension (RFC 7352)
DuplicateTest
  = "duplicate"i _ opts:DuplicateOptions {
      return node('DuplicateTest', opts);
    }

DuplicateOptions
  = opts:(DuplicateOption _)* {
      const result = { handle: null, header: null, uniqueid: null, seconds: 7 * 24 * 60 * 60, last: false };
      for (const [opt] of opts) {
        Object.assign(result, opt);
      }
      return result;
    }

DuplicateOption
  = ":handle"i _ h:String { return { handle: h }; }
  / ":header"i _ h:String { return { header: h }; }
  / ":uniqueid"i _ u:String { return { uniqueid: u }; }
  / ":seconds"i _ s:Number { return { seconds: s }; }
  / ":last"i { return { last: true }; }

// Ihave Extension (RFC 5463)
IhaveTest
  = "ihave"i _ capabilities:StringList {
      return node('IhaveTest', { capabilities });
    }

// Mailbox Extension (RFC 5490)
MailboxexistsTest
  = "mailboxexists"i _ mailboxes:StringList {
      return node('MailboxexistsTest', { mailboxes });
    }

// Mboxmetadata Extension (RFC 5490)
MetadataTest
  = "metadata"i _ matchType:MatchType? _ comparator:Comparator? _ mailbox:String _ annotation:String _ keys:StringList {
      return node('MetadataTest', {
        matchType: matchType || 'is',
        comparator: comparator || 'i;ascii-casemap',
        mailbox,
        annotation,
        keys
      });
    }

MetadataexistsTest
  = "metadataexists"i _ mailbox:String _ annotations:StringList {
      return node('MetadataexistsTest', { mailbox, annotations });
    }

// Special-Use Extension (RFC 8579)
SpecialuseexistsTest
  = "specialuse_exists"i _ mailbox:String? _ attributes:StringList {
      return node('SpecialuseexistsTest', { mailbox: mailbox || null, attributes });
    }

// Extlists Extension (RFC 6134)
ValidextlistTest
  = "valid_ext_list"i _ listNames:StringList {
      return node('ValidextlistTest', { listNames });
    }

TestList
  = head:Test tail:(_ "," _ Test)* {
      return [head, ...tail.map(t => t[3])];
    }

// Match Types
MatchType
  = ":is"i _ { return 'is'; }
  / ":contains"i _ { return 'contains'; }
  / ":matches"i _ { return 'matches'; }
  / ":regex"i _ { return 'regex'; }
  / ":count"i _ relOp:RelationalOp _ { return { type: 'count', operator: relOp }; }
  / ":value"i _ relOp:RelationalOp _ { return { type: 'value', operator: relOp }; }

RelationalOp
  = "\"gt\"" { return 'gt'; }
  / "\"ge\"" { return 'ge'; }
  / "\"lt\"" { return 'lt'; }
  / "\"le\"" { return 'le'; }
  / "\"eq\"" { return 'eq'; }
  / "\"ne\"" { return 'ne'; }

// Address Parts (including Subaddress Extension RFC 5233)
AddressPart
  = ":localpart"i _ { return 'localpart'; }
  / ":domain"i _ { return 'domain'; }
  / ":all"i _ { return 'all'; }
  / ":user"i _ { return 'user'; }
  / ":detail"i _ { return 'detail'; }

// Comparator
Comparator
  = ":comparator"i _ name:String _ { return name; }

// Block
Block
  = "{" _ commands:CommandList _ "}" {
      return commands;
    }

// String and String List
StringList
  = "[" _ strings:StringItems _ "]" { return strings; }
  / s:String { return [s]; }

StringItems
  = head:String tail:(_ "," _ String)* {
      return [head, ...tail.map(s => s[3])];
    }

String
  = QuotedString
  / MultilineString
  / TaggedString

QuotedString
  = '"' chars:QuotedChar* '"' {
      return chars.join('');
    }

QuotedChar
  = '\\' c:[\\"] { return c; }
  / [^"\\]

MultilineString
  = "text:" _ CRLF? lines:MultilineContent "." CRLF {
      return lines;
    }

MultilineContent
  = lines:(!("." CRLF) .)* {
      return lines.map(l => l[1]).join('');
    }

TaggedString
  = ":" tag:Identifier {
      return ':' + tag;
    }

// Number with optional quantifier
Number
  = digits:[0-9]+ quantifier:[KMG]i? {
      let value = parseInt(digits.join(''), 10);
      if (quantifier) {
        const q = quantifier.toUpperCase();
        if (q === 'K') value *= 1024;
        else if (q === 'M') value *= 1024 * 1024;
        else if (q === 'G') value *= 1024 * 1024 * 1024;
      }
      return value;
    }

// Identifier
Identifier
  = chars:[a-zA-Z_][a-zA-Z0-9_]* {
      return chars[0] + (chars[1] ? chars[1].join('') : '');
    }

// Whitespace and Comments
_
  = (Whitespace / Comment)*

Whitespace
  = [ \t\n\r]+

Comment
  = HashComment
  / BracketComment

HashComment
  = "#" [^\n\r]* CRLF?

BracketComment
  = "/*" (!"*/" .)* "*/"

CRLF
  = "\r\n"
  / "\n"
  / "\r"
