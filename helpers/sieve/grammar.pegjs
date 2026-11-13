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

  //
  // How deep tests and blocks may be nested, counted together (RFC 5228
  // section 2.10.7 asks for 15 levels of each at least).  A script is
  // followed as deep as it goes, by this parser and by the engine when a
  // message comes in: a few thousand "not" tests in a row took seconds to
  // parse, each being placed by counting the lines before it, and more than
  // the stack holds to run.
  //
  const MAX_NESTING = 64;
  let nesting = 0;

  // On the way into a test or block (true), and on the way out of one that
  // did not match (false)
  function nest(by) {
    nesting += by;
    if (nesting > MAX_NESTING) error('Tests or blocks are nested too deep');
    return by > 0;
  }

  // Precedence of the modifiers of "set" and "extracttext", applied largest
  // first (RFC 5229 section 4.1, RFC 5435 section 6)
  const MODIFIER_PRECEDENCE = {
    lower: 40,
    upper: 40,
    lowerfirst: 30,
    upperfirst: 30,
    quotewildcard: 20,
    encodeurl: 15,
    length: 10
  };

  // Commands and tests defined by this grammar; any other identifier is
  // parsed as an unknown one (only allowed with "ihave", see parser.js)
  const KNOWN_COMMANDS = new Set([
    'addflag', 'addheader', 'break', 'deleteheader', 'discard', 'else',
    'elsif', 'enclose', 'ereject', 'error', 'extracttext', 'fileinto',
    'foreverypart', 'if', 'keep', 'notify', 'redirect', 'reject',
    'removeflag', 'replace', 'require', 'set', 'setflag', 'stop', 'vacation'
  ]);
  const KNOWN_TESTS = new Set([
    'address', 'allof', 'anyof', 'body', 'currentdate', 'date', 'duplicate',
    'envelope', 'environment', 'exists', 'false', 'hasflag', 'header',
    'ihave', 'mailboxexists', 'metadata', 'metadataexists', 'not',
    'notify_method_capability', 'size', 'specialuse_exists', 'string',
    'true', 'valid_ext_list', 'valid_notify_method'
  ]);

  // the importance words of draft versions of notify, as their numbers
  const IMPORTANCE = new Map([['high', '1'], ['normal', '2'], ['low', '3']]);

  //
  // Tagged arguments may be given in any order (RFC 5228 section 2.6.2), but
  // none more than once and no conflicting ones together (section 2.6).
  // Each tag rule returns [group, props]: two tags of one group conflict.
  // `list` is the result of `(Tag _)*`.
  // These checks (`options.strict`) are only made when a script is saved:
  // one saved before they were made runs as it did, the last tag winning.
  //
  function tags(list, defaults) {
    const result = { ...defaults };
    const seen = new Set();
    for (const [[group, props]] of list) {
      if (seen.has(group) && options.strict)
        error(`Duplicate or conflicting tagged argument: ${group}`);
      seen.add(group);
      if (props.modifier) result.modifiers.push(props.modifier);
      else Object.assign(result, props);
    }

    if (result.modifiers)
      result.modifiers.sort(
        (a, b) => MODIFIER_PRECEDENCE[b] - MODIFIER_PRECEDENCE[a]
      );

    // RFC 5260 section 6 (:last without :index is ignored)
    if (
      options.strict &&
      'index' in defaults &&
      result.last &&
      result.index === null
    )
      error(':last requires :index');

    // RFC 5703 section 4.1 (:anychild without :mime is ignored)
    if (options.strict && result.anychild && !result.mime)
      error(':anychild requires :mime');

    return result;
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
  / UnknownCommand

// Control Commands
ControlCommand
  = IfCommand
  / RequireCommand
  / StopCommand
  / ForeverypartCommand
  / BreakCommand
  / ErrorCommand

IfCommand
  = "if"i W _ test:Test _ block:Block elsifParts:ElsifPart* elsePart:ElsePart? {
      return node('If', {
        test,
        block,
        elsif: elsifParts,
        else: elsePart
      });
    }

ElsifPart
  = _ "elsif"i W _ test:Test _ block:Block {
      return node('Elsif', { test, block });
    }

ElsePart
  = _ "else"i W _ block:Block {
      return block;
    }

RequireCommand
  = "require"i W _ capabilities:StringList _ ";" {
      return node('Require', { capabilities });
    }

StopCommand
  = "stop"i W _ ";" {
      return node('Stop');
    }

// MIME Part Iteration (RFC 5703)
ForeverypartCommand
  = "foreverypart"i W _ name:NameTag? _ block:Block {
      return node('Foreverypart', {
        name: name || null,
        block
      });
    }

BreakCommand
  = "break"i W _ name:NameTag? _ ";" {
      return node('Break', { name: name || null });
    }

NameTag
  = ":name"i W _ s:String { return s; }

// Error Control (RFC 5463 section 5)
ErrorCommand
  = "error"i W _ message:String _ ";" {
      return node('Error', { message });
    }

// A command this grammar does not know (RFC 5228 section 8.2), so that a
// script can use it after testing for its extension with "ihave"
UnknownCommand
  = name:Identifier !{ return KNOWN_COMMANDS.has(name.toLowerCase()); }
    _ (UnknownArgument _)* (";" / Block) {
      return node('UnknownCommand', { name });
    }

// A test this grammar does not know, as UnknownCommand
UnknownTest
  = name:Identifier !{ return KNOWN_TESTS.has(name.toLowerCase()); }
    (_ UnknownArgument)* (_ "(" _ TestList _ ")")? {
      return node('UnknownTest', { name });
    }

UnknownArgument
  = StringList
  / Number
  / ":" Identifier

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
  / ExtracttextCommand
  / ReplaceCommand
  / EncloseCommand
  / NotifyCommand

KeepCommand
  = "keep"i W _ t:(FlagsTag _)* ";" {
      return node('Keep', tags(t, { flags: [] }));
    }

FileintoCommand
  = "fileinto"i W _ t:(FileintoTag _)* mailbox:String _ ";" {
      return node('Fileinto', {
        mailbox,
        ...tags(t, { copy: false, create: false, specialuse: null, flags: [] })
      });
    }

FileintoTag
  = CopyTag
  / CreateTag
  / SpecialuseTag
  / FlagsTag

RedirectCommand
  = "redirect"i W _ t:(CopyTag _)* address:String _ ";" {
      return node('Redirect', { address, ...tags(t, { copy: false }) });
    }

DiscardCommand
  = "discard"i W _ ";" {
      return node('Discard');
    }

RejectCommand
  = "reject"i W _ message:String _ ";" {
      return node('Reject', { message });
    }

ErejectCommand
  = "ereject"i W _ message:String _ ";" {
      return node('Ereject', { message });
    }

// IMAP4 Flags Extension (RFC 5232)
SetflagCommand
  = "setflag"i W _ variableName:FlagVariableName? _ flags:StringList _ ";" {
      return node('Setflag', {
        variableName: variableName || null,
        flags
      });
    }

// Variable name for flag commands - must be followed by a string list
FlagVariableName
  = name:String &(_ StringList) { return name; }

AddflagCommand
  = "addflag"i W _ variableName:FlagVariableName? _ flags:StringList _ ";" {
      return node('Addflag', {
        variableName: variableName || null,
        flags
      });
    }

RemoveflagCommand
  = "removeflag"i W _ variableName:FlagVariableName? _ flags:StringList _ ";" {
      return node('Removeflag', {
        variableName: variableName || null,
        flags
      });
    }

// Variables Extension (RFC 5229)
SetCommand
  = "set"i W _ t:(SetModifier _)* name:String _ value:String _ ";" {
      return node('Set', {
        modifiers: tags(t, { modifiers: [] }).modifiers,
        name,
        value
      });
    }

// (longer names first: ":lower" must not match the start of ":lowerfirst")
SetModifier
  = ":" name:$("lowerfirst"i / "lower"i / "upperfirst"i / "upper"i / "quotewildcard"i / "length"i / "encodeurl"i) W {
      const modifier = name.toLowerCase();
      return [`modifiers of precedence ${MODIFIER_PRECEDENCE[modifier]}`, { modifier }];
    }

// Edit Header Extension (RFC 5293)
AddheaderCommand
  = "addheader"i W _ t:(LastTag _)* name:String _ value:String _ ";" {
      return node('Addheader', {
        ...tags(t, { last: false }),
        name,
        value
      });
    }

DeleteheaderCommand
  = "deleteheader"i W _ t:(DeleteheaderTag _)* name:String _ values:StringList? _ ";" {
      return node('Deleteheader', {
        ...tags(t, {
          index: null,
          last: false,
          matchType: 'is',
          comparator: 'i;ascii-casemap'
        }),
        name,
        values: values || []
      });
    }

DeleteheaderTag
  = IndexTag
  / LastTag
  / ComparatorTag
  / MatchTypeTag

// Vacation Extension (RFC 5230, RFC 6131)
VacationCommand
  = "vacation"i W _ t:(VacationTag _)* message:String _ ";" {
      return node('Vacation', {
        ...tags(t, {
          days: null,
          seconds: null,
          subject: null,
          from: null,
          addresses: [],
          mime: false,
          handle: null
        }),
        message
      });
    }

VacationTag
  = ":days"i W _ n:Number { return [':days or :seconds', { days: n }]; }
  / ":seconds"i W _ n:Number { return [':days or :seconds', { seconds: n }]; }
  / ":subject"i W _ s:String { return [':subject', { subject: s }]; }
  / ":from"i W _ s:String { return [':from', { from: s }]; }
  / ":addresses"i W _ a:StringList { return [':addresses', { addresses: a }]; }
  / ":mime"i W { return [':mime', { mime: true }]; }
  / ":handle"i W _ s:String { return [':handle', { handle: s }]; }

// MIME Extracttext Command (RFC 5703 section 7)
ExtracttextCommand
  = "extracttext"i W _ t:(ExtracttextTag _)* name:String _ ";" {
      return node('Extracttext', {
        ...tags(t, { modifiers: [], first: null }),
        name
      });
    }

ExtracttextTag
  = SetModifier
  / ":first"i W _ n:Number { return [':first', { first: n }]; }

// MIME Replace Command (RFC 5703)
ReplaceCommand
  = "replace"i W _ t:(ReplaceTag _)* replacement:String _ ";" {
      return node('Replace', {
        ...tags(t, { mime: false, subject: null, from: null }),
        replacement
      });
    }

ReplaceTag
  = ":mime"i W { return [':mime', { mime: true }]; }
  / ":subject"i W _ s:String { return [':subject', { subject: s }]; }
  / ":from"i W _ s:String { return [':from', { from: s }]; }

// MIME Enclose Command (RFC 5703)
EncloseCommand
  = "enclose"i W _ t:(EncloseTag _)* value:String _ ";" {
      return node('Enclose', {
        ...tags(t, { subject: null, headers: [] }),
        value
      });
    }

EncloseTag
  = ":subject"i W _ s:String { return [':subject', { subject: s }]; }
  / ":headers"i W _ s:StringList { return [':headers', { headers: s }]; }

// Notify Extension (RFC 5435); the method is positional, the ":method" tag
// of draft versions is still accepted in its place (a notify without a
// method is skipped when it runs, see engine.js)
NotifyCommand
  = "notify"i W _ t:(NotifyTag _)* method:String? _ ";" {
      const result = tags(t, {
        method: null,
        from: null,
        importance: null,
        options: [],
        message: null
      });
      if (method !== null) {
        if (result.method !== null && options.strict)
          error('Duplicate or conflicting tagged argument: :method');
        result.method = method;
      }

      if (result.method === null && options.strict)
        error('notify requires a method');
      return node('Notify', result);
    }

NotifyTag
  = ":method"i W _ s:String { return [':method', { method: s }]; }
  / ":from"i W _ s:String { return [':from', { from: s }]; }
  / ":importance"i W _ s:String {
      const importance = IMPORTANCE.get(s.toLowerCase()) || s;
      if (!['1', '2', '3'].includes(importance) && options.strict)
        error(':importance must be "1", "2" or "3"');
      return [':importance', { importance }];
    }
  / ":options"i W _ a:StringList { return [':options', { options: a }]; }
  / ":message"i W _ s:String { return [':message', { message: s }]; }

// Tags
CopyTag
  = ":copy"i W { return [':copy', { copy: true }]; }

CreateTag
  = ":create"i W { return [':create', { create: true }]; }

// Special-Use Extension (RFC 8579)
SpecialuseTag
  = ":specialuse"i W _ attr:String { return [':specialuse', { specialuse: attr }]; }

FlagsTag
  = ":flags"i W _ flags:StringList { return [':flags', { flags }]; }

LastTag
  = ":last"i W { return [':last', { last: true }]; }

// Index Extension (RFC 5260 section 6): fields are counted from 1
IndexTag
  = ":index"i W _ n:Number {
      if (n < 1 && options.strict) error(':index must be 1 or more');
      return [':index', { index: n }];
    }

MatchTypeTag
  = m:MatchType { return ['match type', { matchType: m }]; }

AddressPartTag
  = p:AddressPart { return ['address part', { addressPart: p }]; }

ComparatorTag
  = ":comparator"i W _ name:String { return [':comparator', { comparator: name }]; }

// MIME Tests (RFC 5703 section 4)
MimeTag
  = ":mime"i W { return [':mime', { mime: true }]; }

AnychildTag
  = ":anychild"i W { return [':anychild', { anychild: true }]; }

// Tests
Test
  = &{ return nest(1); } test:AnyTest { nest(-1); return test; }
  / &{ return nest(-1); }

AnyTest
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
  / ValidNotifyMethodTest
  / NotifyMethodCapabilityTest
  / UnknownTest

AllofTest
  = "allof"i W _ "(" _ tests:TestList _ ")" {
      return node('AllofTest', { tests });
    }

AnyofTest
  = "anyof"i W _ "(" _ tests:TestList _ ")" {
      return node('AnyofTest', { tests });
    }

NotTest
  = "not"i W _ test:Test {
      return node('NotTest', { test });
    }

TrueTest
  = "true"i W {
      return node('TrueTest');
    }

FalseTest
  = "false"i W {
      return node('FalseTest');
    }

AddressTest
  = "address"i W _ t:(AddressTag _)* headers:StringList _ keys:StringList {
      return node('AddressTest', {
        ...tags(t, {
          addressPart: 'all',
          matchType: 'is',
          comparator: null,
          index: null,
          last: false,
          mime: false,
          anychild: false
        }),
        headers,
        keys
      });
    }

AddressTag
  = AddressPartTag
  / MatchTypeTag
  / ComparatorTag
  / IndexTag
  / LastTag
  / MimeTag
  / AnychildTag

HeaderTest
  = "header"i W _ t:(HeaderTag _)* headers:StringList _ keys:StringList {
      return node('HeaderTest', {
        ...tags(t, {
          matchType: 'is',
          comparator: null,
          index: null,
          last: false,
          mime: false,
          mimeType: null,
          mimeParam: null,
          anychild: false
        }),
        headers,
        keys
      });
    }

HeaderTag
  = MatchTypeTag
  / ComparatorTag
  / IndexTag
  / LastTag
  / MimeTag
  / AnychildTag
  / MimeOptionTag

// (a MIME option implies :mime, as it always has here)
MimeOptionTag
  = ":type"i W { return ['MIME option', { mime: true, mimeType: 'type' }]; }
  / ":subtype"i W { return ['MIME option', { mime: true, mimeType: 'subtype' }]; }
  / ":contenttype"i W { return ['MIME option', { mime: true, mimeType: 'contenttype' }]; }
  / ":param"i W _ p:StringList { return ['MIME option', { mime: true, mimeType: 'param', mimeParam: p }]; }

EnvelopeTest
  = "envelope"i W _ t:(EnvelopeTag _)* parts:StringList _ keys:StringList {
      return node('EnvelopeTest', {
        ...tags(t, {
          addressPart: 'all',
          matchType: 'is',
          comparator: null
        }),
        parts,
        keys
      });
    }

EnvelopeTag
  = AddressPartTag
  / MatchTypeTag
  / ComparatorTag

SizeTest
  = "size"i W _ ":over"i W _ size:Number {
      return node('SizeTest', { over: size });
    }
  / "size"i W _ ":under"i W _ size:Number {
      return node('SizeTest', { under: size });
    }

ExistsTest
  = "exists"i W _ t:(ExistsTag _)* headers:StringList {
      return node('ExistsTest', {
        ...tags(t, { mime: false, anychild: false }),
        headers
      });
    }

ExistsTag
  = MimeTag
  / AnychildTag

// Body Extension (RFC 5173)
BodyTest
  = "body"i W _ t:(BodyTag _)* keys:StringList {
      return node('BodyTest', {
        ...tags(t, {
          bodyTransform: 'text',
          matchType: 'is',
          comparator: null
        }),
        keys
      });
    }

BodyTag
  = BodyTransformTag
  / MatchTypeTag
  / ComparatorTag

BodyTransformTag
  = ":raw"i W { return ['body transform', { bodyTransform: 'raw' }]; }
  / ":content"i W _ contentTypes:StringList {
      return ['body transform', { bodyTransform: { type: 'content', contentTypes } }];
    }
  / ":text"i W { return ['body transform', { bodyTransform: 'text' }]; }

// Date Extension (RFC 5260)
DateTest
  = "date"i W _ t:(DateTag _)* header:String _ datePart:String _ keys:StringList {
      return node('DateTest', {
        ...tags(t, {
          zone: null,
          originalZone: false,
          matchType: 'is',
          comparator: null,
          index: null,
          last: false
        }),
        header,
        datePart,
        keys
      });
    }

DateTag
  = ZoneTag
  / ":originalzone"i W { return [':zone or :originalzone', { originalZone: true }]; }
  / MatchTypeTag
  / ComparatorTag
  / IndexTag
  / LastTag

CurrentdateTest
  = "currentdate"i W _ t:(CurrentdateTag _)* datePart:String _ keys:StringList {
      return node('CurrentdateTest', {
        ...tags(t, {
          zone: null,
          matchType: 'is',
          comparator: null
        }),
        datePart,
        keys
      });
    }

CurrentdateTag
  = ZoneTag
  / MatchTypeTag
  / ComparatorTag

ZoneTag
  = ":zone"i W _ zone:String { return [':zone or :originalzone', { zone }]; }

// IMAP4 Flags Extension (RFC 5232): an optional variable list comes
// before the flags
HasflagTest
  = "hasflag"i W _ t:(HasflagTag _)* variables:HasflagVariables? flags:StringList {
      return node('HasflagTest', {
        ...tags(t, { matchType: 'is', comparator: null }),
        variableName: variables ? variables[0] : null,
        variables,
        flags
      });
    }

HasflagTag
  = MatchTypeTag
  / ComparatorTag

HasflagVariables
  = list:StringList _ &StringList { return list; }

// Variables Extension (RFC 5229)
StringTest
  = "string"i W _ t:(MatchComparatorTag _)* source:StringList _ keys:StringList {
      return node('StringTest', {
        ...tags(t, { matchType: 'is', comparator: null }),
        source,
        keys
      });
    }

MatchComparatorTag
  = MatchTypeTag
  / ComparatorTag

// Environment Extension (RFC 5183)
EnvironmentTest
  = "environment"i W _ t:(MatchComparatorTag _)* name:String _ keys:StringList {
      return node('EnvironmentTest', {
        ...tags(t, { matchType: 'is', comparator: null }),
        name,
        keys
      });
    }

// Duplicate Extension (RFC 7352)
DuplicateTest
  = "duplicate"i W _ t:(DuplicateTag _)* {
      return node('DuplicateTest', tags(t, {
        handle: null,
        header: null,
        uniqueid: null,
        seconds: 7 * 24 * 60 * 60,
        last: false
      }));
    }

DuplicateTag
  = ":handle"i W _ h:String { return [':handle', { handle: h }]; }
  / ":header"i W _ h:String { return [':header or :uniqueid', { header: h }]; }
  / ":uniqueid"i W _ u:String { return [':header or :uniqueid', { uniqueid: u }]; }
  / ":seconds"i W _ s:Number { return [':seconds', { seconds: s }]; }
  / ":last"i W { return [':last', { last: true }]; }

// Ihave Extension (RFC 5463)
IhaveTest
  = "ihave"i W _ capabilities:StringList {
      return node('IhaveTest', { capabilities });
    }

// Mailbox Extension (RFC 5490)
MailboxexistsTest
  = "mailboxexists"i W _ mailboxes:StringList {
      return node('MailboxexistsTest', { mailboxes });
    }

// Mboxmetadata Extension (RFC 5490)
MetadataTest
  = "metadata"i W _ t:(MatchComparatorTag _)* mailbox:String _ annotation:String _ keys:StringList {
      return node('MetadataTest', {
        ...tags(t, { matchType: 'is', comparator: null }),
        mailbox,
        annotation,
        keys
      });
    }

MetadataexistsTest
  = "metadataexists"i W _ mailbox:String _ annotations:StringList {
      return node('MetadataexistsTest', { mailbox, annotations });
    }

// Special-Use Extension (RFC 8579): the mailbox is optional, so a single
// string list is the attributes
SpecialuseexistsTest
  = "specialuse_exists"i W _ first:StringList second:(_ s:StringList { return s; })? {
      if (!second) return node('SpecialuseexistsTest', { mailbox: null, attributes: first });
      if (first.length !== 1) error('specialuse_exists takes a single mailbox name');
      return node('SpecialuseexistsTest', { mailbox: first[0], attributes: second });
    }

// Extlists Extension (RFC 6134)
ValidextlistTest
  = "valid_ext_list"i W _ listNames:StringList {
      return node('ValidextlistTest', { listNames });
    }

// Notify Extension (RFC 5435 sections 4 and 5)
ValidNotifyMethodTest
  = "valid_notify_method"i W _ uris:StringList {
      return node('ValidNotifyMethodTest', { uris });
    }

NotifyMethodCapabilityTest
  = "notify_method_capability"i W _ t:(MatchComparatorTag _)* uri:String _ capability:String _ keys:StringList {
      return node('NotifyMethodCapabilityTest', {
        uri,
        capability,
        ...tags(t, { matchType: 'is', comparator: null }),
        keys
      });
    }

TestList
  = head:Test tail:(_ "," _ Test)* {
      return [head, ...tail.map(t => t[3])];
    }

// Match Types
MatchType
  = ":is"i W { return 'is'; }
  / ":contains"i W { return 'contains'; }
  / ":matches"i W { return 'matches'; }
  / ":regex"i W { return 'regex'; }
  / ":count"i W _ relOp:RelationalOp { return { type: 'count', operator: relOp }; }
  / ":value"i W _ relOp:RelationalOp { return { type: 'value', operator: relOp }; }

// (case-insensitive, RFC 5231 section 4)
RelationalOp
  = '"' op:$("gt"i / "ge"i / "lt"i / "le"i / "eq"i / "ne"i) '"' {
      return op.toLowerCase();
    }

// Address Parts (including Subaddress Extension RFC 5233)
AddressPart
  = ":localpart"i W { return 'localpart'; }
  / ":domain"i W { return 'domain'; }
  / ":all"i W { return 'all'; }
  / ":user"i W { return 'user'; }
  / ":detail"i W { return 'detail'; }

// Block
Block
  = &{ return nest(1); } "{" _ commands:CommandList _ "}" {
      nest(-1);
      return commands;
    }
  / &{ return nest(-1); }

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

QuotedString
  = '"' chars:QuotedChar* '"' {
      return chars.join('');
    }

// "\\" and "\"" are escapes; any other backslash is dropped (RFC 5228
// section 2.4.2)
QuotedChar
  = '\\' c:. { return c; }
  / [^"\\]

// "text:", spaces and an optional hash comment up to the end of the line,
// then dot-stuffed lines up to a line holding only "." (RFC 5228 section
// 2.4.2)
MultilineString
  = "text:"i [ \t]* ("#" [^\r\n]*)? CRLF lines:MultilineLine* "." CRLF {
      return lines.join('');
    }

MultilineLine
  = !("." CRLF) line:$([^\r\n]* CRLF) {
      return line.startsWith('..') ? line.slice(1) : line;
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
  = $([a-zA-Z_][a-zA-Z0-9_]*)

// The end of a word: keywords and tags are not a prefix of a longer name
W
  = ![a-zA-Z0-9_]

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
