/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ICAL = require('ical.js');

//
// Windows → IANA timezone mapping.
// Microsoft 365 / Outlook often uses Windows timezone names in TZID
// parameters (e.g. "Eastern Standard Time") instead of IANA names
// (e.g. "America/New_York").  This map resolves the most common ones.
//
// Source: Unicode CLDR windowsZones.xml
// <https://github.com/unicode-org/cldr/blob/main/common/supplemental/windowsZones.xml>
//
const WINDOWS_TO_IANA = new Map([
  ['Dateline Standard Time', 'Etc/GMT+12'],
  ['UTC-11', 'Etc/GMT+11'],
  ['Aleutian Standard Time', 'America/Adak'],
  ['Hawaiian Standard Time', 'Pacific/Honolulu'],
  ['Marquesas Standard Time', 'Pacific/Marquesas'],
  ['Alaskan Standard Time', 'America/Anchorage'],
  ['UTC-09', 'Etc/GMT+9'],
  ['Pacific Standard Time (Mexico)', 'America/Tijuana'],
  ['UTC-08', 'Etc/GMT+8'],
  ['Pacific Standard Time', 'America/Los_Angeles'],
  ['US Mountain Standard Time', 'America/Phoenix'],
  ['Mountain Standard Time (Mexico)', 'America/Chihuahua'],
  ['Mountain Standard Time', 'America/Denver'],
  ['Central America Standard Time', 'America/Guatemala'],
  ['Central Standard Time', 'America/Chicago'],
  ['Easter Island Standard Time', 'Pacific/Easter'],
  ['Central Standard Time (Mexico)', 'America/Mexico_City'],
  ['Canada Central Standard Time', 'America/Regina'],
  ['SA Pacific Standard Time', 'America/Bogota'],
  ['Eastern Standard Time (Mexico)', 'America/Cancun'],
  ['Eastern Standard Time', 'America/New_York'],
  ['Haiti Standard Time', 'America/Port-au-Prince'],
  ['Cuba Standard Time', 'America/Havana'],
  ['US Eastern Standard Time', 'America/Indianapolis'],
  ['Turks And Caicos Standard Time', 'America/Grand_Turk'],
  ['Paraguay Standard Time', 'America/Asuncion'],
  ['Atlantic Standard Time', 'America/Halifax'],
  ['Venezuela Standard Time', 'America/Caracas'],
  ['Central Brazilian Standard Time', 'America/Cuiaba'],
  ['SA Western Standard Time', 'America/La_Paz'],
  ['Pacific SA Standard Time', 'America/Santiago'],
  ['Newfoundland Standard Time', 'America/St_Johns'],
  ['Tocantins Standard Time', 'America/Araguaina'],
  ['E. South America Standard Time', 'America/Sao_Paulo'],
  ['SA Eastern Standard Time', 'America/Cayenne'],
  ['Argentina Standard Time', 'America/Buenos_Aires'],
  ['Greenland Standard Time', 'America/Godthab'],
  ['Montevideo Standard Time', 'America/Montevideo'],
  ['Magallanes Standard Time', 'America/Punta_Arenas'],
  ['Saint Pierre Standard Time', 'America/Miquelon'],
  ['Bahia Standard Time', 'America/Bahia'],
  ['UTC-02', 'Etc/GMT+2'],
  ['Azores Standard Time', 'Atlantic/Azores'],
  ['Cape Verde Standard Time', 'Atlantic/Cape_Verde'],
  ['UTC', 'Etc/UTC'],
  ['GMT Standard Time', 'Europe/London'],
  ['Greenwich Standard Time', 'Atlantic/Reykjavik'],
  ['Sao Tome Standard Time', 'Africa/Sao_Tome'],
  ['Morocco Standard Time', 'Africa/Casablanca'],
  ['W. Europe Standard Time', 'Europe/Berlin'],
  ['Central Europe Standard Time', 'Europe/Budapest'],
  ['Romance Standard Time', 'Europe/Paris'],
  ['Central European Standard Time', 'Europe/Warsaw'],
  ['W. Central Africa Standard Time', 'Africa/Lagos'],
  ['Jordan Standard Time', 'Asia/Amman'],
  ['GTB Standard Time', 'Europe/Bucharest'],
  ['Middle East Standard Time', 'Asia/Beirut'],
  ['Egypt Standard Time', 'Africa/Cairo'],
  ['E. Europe Standard Time', 'Europe/Chisinau'],
  ['Syria Standard Time', 'Asia/Damascus'],
  ['West Bank Standard Time', 'Asia/Hebron'],
  ['South Africa Standard Time', 'Africa/Johannesburg'],
  ['FLE Standard Time', 'Europe/Kiev'],
  ['Israel Standard Time', 'Asia/Jerusalem'],
  ['Kaliningrad Standard Time', 'Europe/Kaliningrad'],
  ['Sudan Standard Time', 'Africa/Khartoum'],
  ['Libya Standard Time', 'Africa/Tripoli'],
  ['Namibia Standard Time', 'Africa/Windhoek'],
  ['Arabic Standard Time', 'Asia/Baghdad'],
  ['Turkey Standard Time', 'Europe/Istanbul'],
  ['Arab Standard Time', 'Asia/Riyadh'],
  ['Belarus Standard Time', 'Europe/Minsk'],
  ['Russian Standard Time', 'Europe/Moscow'],
  ['E. Africa Standard Time', 'Africa/Nairobi'],
  ['Iran Standard Time', 'Asia/Tehran'],
  ['Arabian Standard Time', 'Asia/Dubai'],
  ['Astrakhan Standard Time', 'Europe/Astrakhan'],
  ['Azerbaijan Standard Time', 'Asia/Baku'],
  ['Russia Time Zone 3', 'Europe/Samara'],
  ['Mauritius Standard Time', 'Indian/Mauritius'],
  ['Saratov Standard Time', 'Europe/Saratov'],
  ['Georgian Standard Time', 'Asia/Tbilisi'],
  ['Volgograd Standard Time', 'Europe/Volgograd'],
  ['Caucasus Standard Time', 'Asia/Yerevan'],
  ['Afghanistan Standard Time', 'Asia/Kabul'],
  ['West Asia Standard Time', 'Asia/Tashkent'],
  ['Ekaterinburg Standard Time', 'Asia/Yekaterinburg'],
  ['Pakistan Standard Time', 'Asia/Karachi'],
  ['Qyzylorda Standard Time', 'Asia/Qyzylorda'],
  ['India Standard Time', 'Asia/Calcutta'],
  ['Sri Lanka Standard Time', 'Asia/Colombo'],
  ['Nepal Standard Time', 'Asia/Katmandu'],
  ['Central Asia Standard Time', 'Asia/Almaty'],
  ['Bangladesh Standard Time', 'Asia/Dhaka'],
  ['Omsk Standard Time', 'Asia/Omsk'],
  ['Myanmar Standard Time', 'Asia/Rangoon'],
  ['SE Asia Standard Time', 'Asia/Bangkok'],
  ['Altai Standard Time', 'Asia/Barnaul'],
  ['W. Mongolia Standard Time', 'Asia/Hovd'],
  ['North Asia Standard Time', 'Asia/Krasnoyarsk'],
  ['N. Central Asia Standard Time', 'Asia/Novosibirsk'],
  ['Tomsk Standard Time', 'Asia/Tomsk'],
  ['China Standard Time', 'Asia/Shanghai'],
  ['North Asia East Standard Time', 'Asia/Irkutsk'],
  ['Singapore Standard Time', 'Asia/Singapore'],
  ['W. Australia Standard Time', 'Australia/Perth'],
  ['Taipei Standard Time', 'Asia/Taipei'],
  ['Ulaanbaatar Standard Time', 'Asia/Ulaanbaatar'],
  ['Aus Central W. Standard Time', 'Australia/Eucla'],
  ['Transbaikal Standard Time', 'Asia/Chita'],
  ['Tokyo Standard Time', 'Asia/Tokyo'],
  ['North Korea Standard Time', 'Asia/Pyongyang'],
  ['Korea Standard Time', 'Asia/Seoul'],
  ['Yakutsk Standard Time', 'Asia/Yakutsk'],
  ['Cen. Australia Standard Time', 'Australia/Adelaide'],
  ['AUS Central Standard Time', 'Australia/Darwin'],
  ['E. Australia Standard Time', 'Australia/Brisbane'],
  ['AUS Eastern Standard Time', 'Australia/Sydney'],
  ['West Pacific Standard Time', 'Pacific/Port_Moresby'],
  ['Tasmania Standard Time', 'Australia/Hobart'],
  ['Vladivostok Standard Time', 'Asia/Vladivostok'],
  ['Lord Howe Standard Time', 'Australia/Lord_Howe'],
  ['Bougainville Standard Time', 'Pacific/Bougainville'],
  ['Russia Time Zone 10', 'Asia/Srednekolymsk'],
  ['Magadan Standard Time', 'Asia/Magadan'],
  ['Norfolk Standard Time', 'Pacific/Norfolk'],
  ['Sakhalin Standard Time', 'Asia/Sakhalin'],
  ['Central Pacific Standard Time', 'Pacific/Guadalcanal'],
  ['Russia Time Zone 11', 'Asia/Kamchatka'],
  ['New Zealand Standard Time', 'Pacific/Auckland'],
  ['UTC+12', 'Etc/GMT-12'],
  ['Fiji Standard Time', 'Pacific/Fiji'],
  ['Chatham Islands Standard Time', 'Pacific/Chatham'],
  ['UTC+13', 'Etc/GMT-13'],
  ['Tonga Standard Time', 'Pacific/Tongatapu'],
  ['Samoa Standard Time', 'Pacific/Apia'],
  ['Line Islands Standard Time', 'Pacific/Kiritimati']
]);

//
// Resolve a TZID to an IANA timezone name.
// Handles:
//   - IANA names passed through as-is (e.g. "America/New_York")
//   - Windows timezone names (e.g. "Eastern Standard Time")
//   - Prefixed forms (e.g. "/Microsoft/Eastern Standard Time")
//
function resolveToIANA(tzid) {
  if (!tzid) return null;

  // Strip common prefixes
  const cleaned = tzid
    .replace(/^\/microsoft\//i, '')
    .replace(/^\/citrix\.com\/\d+\//i, '')
    .replace(/^\/softwarestudio\.org\/olson_\d+\//i, '')
    .trim();

  // If it looks like an IANA name (contains '/'), validate it
  if (cleaned.includes('/')) {
    try {
      // Use Intl to validate the timezone name
      // eslint-disable-next-line no-new
      new Intl.DateTimeFormat('en-US', { timeZone: cleaned });
      return cleaned;
    } catch {
      // Not a valid IANA name, fall through
    }
  }

  // Try Windows → IANA mapping
  if (WINDOWS_TO_IANA.has(cleaned)) {
    return WINDOWS_TO_IANA.get(cleaned);
  }

  // Case-insensitive fallback
  for (const [winName, ianaName] of WINDOWS_TO_IANA) {
    if (winName.toLowerCase() === cleaned.toLowerCase()) {
      return ianaName;
    }
  }

  return null;
}

//
// Get the UTC offset in minutes for a given IANA timezone at a specific
// UTC timestamp.  Uses Intl.DateTimeFormat.formatToParts to avoid the
// system-local-timezone pitfall of `new Date(toLocaleString())`.
//
// Returns a signed integer: positive = east of UTC, negative = west.
//
const _fmtCache = new Map();
function _getFmt(tzid) {
  let fmt = _fmtCache.get(tzid);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tzid,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    _fmtCache.set(tzid, fmt);
  }

  return fmt;
}

function getOffsetMinutes(tzid, date) {
  const fmt = _getFmt(tzid);
  const parts = fmt.formatToParts(date);
  const get = (type) =>
    Number.parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);

  // Build a UTC timestamp from the wall-clock parts in the target timezone
  const y = get('year');
  const mo = get('month') - 1;
  const d = get('day');
  let h = get('hour');
  // Intl hour12:false gives 24 for midnight in some engines
  if (h === 24) h = 0;
  const mi = get('minute');
  const s = get('second');

  const wallUtcMs = Date.UTC(y, mo, d, h, mi, s);
  return Math.round((wallUtcMs - date.getTime()) / 60000);
}

//
// Format an offset in minutes as an iCalendar UTC offset string
// (e.g. "+0530", "-0500").
//
function formatOffset(minutes) {
  const sign = minutes >= 0 ? '+' : '-';
  const abs = Math.abs(minutes);
  const h = String(Math.floor(abs / 60)).padStart(2, '0');
  const m = String(abs % 60).padStart(2, '0');
  return `${sign}${h}${m}`;
}

//
// Find the DST transition dates for a given IANA timezone in a given year.
// Returns an object with standard/daylight info, or null if no DST.
//
function findTransitions(tzid, year) {
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const dec31 = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

  let prevOffset = getOffsetMinutes(tzid, jan1);
  const transitions = [];

  // Step through the year in 1-hour increments
  for (
    let ts = jan1.getTime() + 3600000;
    ts <= dec31.getTime();
    ts += 3600000
  ) {
    const d = new Date(ts);
    const offset = getOffsetMinutes(tzid, d);
    if (offset !== prevOffset) {
      transitions.push({
        date: d,
        fromOffset: prevOffset,
        toOffset: offset
      });
      prevOffset = offset;
    }
  }

  if (transitions.length < 2) {
    // No DST (or only one transition — unusual)
    return null;
  }

  // Get timezone abbreviations
  const fmtShort = new Intl.DateTimeFormat('en-US', {
    timeZone: tzid,
    timeZoneName: 'short'
  });

  // Standard = lesser offset (more negative / less positive)
  // Daylight = greater offset
  const t0 = transitions[0];
  const t1 = transitions[1];

  let standardTransition;
  let daylightTransition;

  if (t0.toOffset < t0.fromOffset) {
    standardTransition = t0;
    daylightTransition = t1;
  } else {
    standardTransition = t1;
    daylightTransition = t0;
  }

  const stdAbbr =
    fmtShort
      .formatToParts(standardTransition.date)
      .find((p) => p.type === 'timeZoneName')?.value || 'STD';
  const dstAbbr =
    fmtShort
      .formatToParts(daylightTransition.date)
      .find((p) => p.type === 'timeZoneName')?.value || 'DST';

  return {
    standardStart: standardTransition.date,
    daylightStart: daylightTransition.date,
    standardOffset: standardTransition.toOffset,
    daylightOffset: daylightTransition.toOffset,
    standardFromOffset: standardTransition.fromOffset,
    daylightFromOffset: daylightTransition.fromOffset,
    standardAbbr: stdAbbr,
    daylightAbbr: dstAbbr
  };
}

//
// Format a Date as an iCalendar local datetime string
// (e.g. "20250308T020000") in the given timezone.
//
function formatLocalDT(date, tzid) {
  const fmt = _getFmt(tzid);
  const parts = fmt.formatToParts(date);
  const get = (type) =>
    String(parts.find((p) => p.type === type)?.value ?? '0').padStart(2, '0');

  const y = String(
    parts.find((p) => p.type === 'year')?.value ?? '1970'
  ).padStart(4, '0');
  let h = get('hour');
  if (h === '24') h = '00';
  return `${y}${get('month')}${get('day')}T${h}${get('minute')}${get(
    'second'
  )}`;
}

//
// Generate a VTIMEZONE component string for a given timezone ID.
// Uses the Intl API to determine UTC offsets and DST transitions.
//
// Returns a VTIMEZONE string (without VCALENDAR wrapper) or null if
// the timezone ID is not recognized.
//
function generateVTimezone(tzid) {
  const ianaTzid = resolveToIANA(tzid);
  if (!ianaTzid) return null;

  const transitions = findTransitions(ianaTzid, 2025);

  if (!transitions) {
    // Fixed-offset timezone (no DST)
    const offset = getOffsetMinutes(ianaTzid, new Date(Date.UTC(2025, 0, 15)));
    const offsetStr = formatOffset(offset);
    const fmtShort = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaTzid,
      timeZoneName: 'short'
    });
    const abbr =
      fmtShort
        .formatToParts(new Date(Date.UTC(2025, 0, 15)))
        .find((p) => p.type === 'timeZoneName')?.value || 'STD';

    return [
      'BEGIN:VTIMEZONE',
      `TZID:${tzid}`,
      'BEGIN:STANDARD',
      `TZOFFSETFROM:${offsetStr}`,
      `TZOFFSETTO:${offsetStr}`,
      `TZNAME:${abbr}`,
      'DTSTART:19700101T000000',
      'END:STANDARD',
      'END:VTIMEZONE'
    ].join('\r\n');
  }

  const {
    standardStart,
    daylightStart,
    standardOffset,
    daylightOffset,
    standardFromOffset,
    daylightFromOffset,
    standardAbbr,
    daylightAbbr
  } = transitions;

  return [
    'BEGIN:VTIMEZONE',
    `TZID:${tzid}`,
    'BEGIN:DAYLIGHT',
    `TZOFFSETFROM:${formatOffset(daylightFromOffset)}`,
    `TZOFFSETTO:${formatOffset(daylightOffset)}`,
    `TZNAME:${daylightAbbr}`,
    `DTSTART:${formatLocalDT(daylightStart, ianaTzid)}`,
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    `TZOFFSETFROM:${formatOffset(standardFromOffset)}`,
    `TZOFFSETTO:${formatOffset(standardOffset)}`,
    `TZNAME:${standardAbbr}`,
    `DTSTART:${formatLocalDT(standardStart, ianaTzid)}`,
    'END:STANDARD',
    'END:VTIMEZONE'
  ].join('\r\n');
}

//
// Scan an ICS string (must be wrapped in VCALENDAR) for TZID references
// that lack a corresponding VTIMEZONE definition, and inject generated
// VTIMEZONE components.
//
// Returns the (possibly modified) ICS string.
//
function ensureVTimezones(icsString) {
  if (!icsString || typeof icsString !== 'string') return icsString;

  let comp;
  try {
    comp = new ICAL.Component(ICAL.parse(icsString));
  } catch {
    return icsString;
  }

  // Collect all TZIDs already defined
  const existingTzids = new Set();
  for (const vtz of comp.getAllSubcomponents('vtimezone')) {
    const tzid = vtz.getFirstPropertyValue('tzid');
    if (tzid) existingTzids.add(tzid);
  }

  // Collect all TZID references from all subcomponents
  const referencedTzids = new Set();
  const subTypes = ['vevent', 'vtodo', 'vjournal', 'vfreebusy'];
  for (const type of subTypes) {
    for (const sub of comp.getAllSubcomponents(type)) {
      _collectTzids(sub, referencedTzids);
      // Also check VALARM subcomponents
      for (const alarm of sub.getAllSubcomponents('valarm')) {
        _collectTzids(alarm, referencedTzids);
      }
    }
  }

  // Find missing TZIDs
  const missingTzids = [];
  for (const tzid of referencedTzids) {
    if (!existingTzids.has(tzid)) {
      missingTzids.push(tzid);
    }
  }

  if (missingTzids.length === 0) return icsString;

  // Generate and inject VTIMEZONE components
  let modified = false;
  for (const tzid of missingTzids) {
    const vtzStr = generateVTimezone(tzid);
    if (vtzStr) {
      try {
        const wrapperStr = `BEGIN:VCALENDAR\r\n${vtzStr}\r\nEND:VCALENDAR`;
        const wrapperComp = new ICAL.Component(ICAL.parse(wrapperStr));
        const vtzComp = wrapperComp.getFirstSubcomponent('vtimezone');
        if (vtzComp) {
          comp.addSubcomponent(vtzComp);
          modified = true;
        }
      } catch {
        // Failed to parse generated VTIMEZONE — skip
      }
    }
  }

  if (!modified) return icsString;

  return comp.toString();
}

//
// Helper: collect all TZID parameter values from all properties of a component.
//
function _collectTzids(component, tzidSet) {
  for (const prop of component.getAllProperties()) {
    const tzid = prop.getParameter('tzid');
    if (tzid && tzid !== 'UTC' && tzid !== 'Z') {
      tzidSet.add(tzid);
    }
  }
}

module.exports = {
  generateVTimezone,
  ensureVTimezones,
  resolveToIANA,
  WINDOWS_TO_IANA
};
