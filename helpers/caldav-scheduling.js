/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/***
 * RFC 6638 Scheduling Extensions to CalDAV - Core Helper Module
 *
 * This module provides comprehensive iTIP (RFC 5546) support for CalDAV scheduling:
 * - Parse and validate iTIP messages (REQUEST, REPLY, CANCEL, ADD, REFRESH, COUNTER, DECLINECOUNTER, PUBLISH)
 * - Generate iTIP REQUEST, REPLY, and CANCEL messages
 * - Free-busy query generation (VFREEBUSY)
 * - Schedule tag generation and validation
 * - Scheduling metadata extraction for SQLite storage
 *
 * @see https://tools.ietf.org/html/rfc6638 - Scheduling Extensions to CalDAV
 * @see https://tools.ietf.org/html/rfc5546 - iCalendar Transport-Independent Interoperability Protocol (iTIP)
 * @see https://tools.ietf.org/html/rfc6047 - iCalendar Message-Based Interoperability Protocol (iMIP)
 */

const crypto = require('node:crypto');

const ICAL = require('ical.js');

/**
 * Valid iTIP methods as defined in RFC 5546
 */
const ITIP_METHODS = [
  'PUBLISH',
  'REQUEST',
  'REPLY',
  'ADD',
  'CANCEL',
  'REFRESH',
  'COUNTER',
  'DECLINECOUNTER'
];

/**
 * Valid PARTSTAT values for VEVENT
 */
const PARTSTAT_VALUES = [
  'NEEDS-ACTION',
  'ACCEPTED',
  'DECLINED',
  'TENTATIVE',
  'DELEGATED'
];

/**
 * Parse an iCalendar string and extract iTIP information
 * @param {string} icalData - Raw iCalendar data
 * @returns {Object} Parsed iTIP information
 */
function parseItip(icalData) {
  if (!icalData || typeof icalData !== 'string') {
    throw new TypeError('Invalid iCalendar data');
  }

  let jcal;
  let comp;
  try {
    jcal = ICAL.parse(icalData);
    comp = new ICAL.Component(jcal);
  } catch (err) {
    throw new TypeError(`Invalid iCalendar data: ${err.message}`);
  }

  // Extract METHOD
  const method = comp.getFirstPropertyValue('method');
  if (method && !ITIP_METHODS.includes(method.toUpperCase())) {
    throw new TypeError(`Invalid iTIP method: ${method}`);
  }

  // Extract VEVENT or VTODO
  const vevent = comp.getFirstSubcomponent('vevent');
  const vtodo = comp.getFirstSubcomponent('vtodo');
  const component = vevent || vtodo;

  if (!component) {
    throw new TypeError('No VEVENT or VTODO component found');
  }

  // Extract basic properties
  const uid = component.getFirstPropertyValue('uid');
  const summary = component.getFirstPropertyValue('summary');
  const dtstart = component.getFirstPropertyValue('dtstart');
  const dtend = component.getFirstPropertyValue('dtend');
  const sequence = component.getFirstPropertyValue('sequence') || 0;

  // Extract organizer
  const organizerProp = component.getFirstProperty('organizer');
  let organizer = null;
  if (organizerProp) {
    const organizerValue = organizerProp.getFirstValue();
    organizer = {
      email: organizerValue
        ? organizerValue.replace(/^mailto:/i, '').toLowerCase()
        : null,
      cn: organizerProp.getParameter('cn'),
      sentBy: organizerProp.getParameter('sent-by')
    };
  }

  // Extract attendees
  const attendeeProps = component.getAllProperties('attendee');
  const attendees = attendeeProps.map((prop) => {
    const value = prop.getFirstValue();
    return {
      email: value ? value.replace(/^mailto:/i, '').toLowerCase() : null,
      cn: prop.getParameter('cn'),
      partstat: prop.getParameter('partstat') || 'NEEDS-ACTION',
      role: prop.getParameter('role') || 'REQ-PARTICIPANT',
      rsvp: prop.getParameter('rsvp') === 'TRUE',
      cutype: prop.getParameter('cutype') || 'INDIVIDUAL',
      delegatedFrom: prop.getParameter('delegated-from'),
      delegatedTo: prop.getParameter('delegated-to')
    };
  });

  return {
    method: method ? method.toUpperCase() : null,
    uid,
    summary,
    dtstart: dtstart ? dtstart.toJSDate() : null,
    dtend: dtend ? dtend.toJSDate() : null,
    sequence,
    organizer,
    attendees,
    componentType: vevent ? 'VEVENT' : 'VTODO',
    raw: icalData
  };
}

/**
 * Validate an iTIP message
 * @param {Object} itipData - Parsed iTIP data from parseItip()
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
function validateItip(itipData) {
  const errors = [];

  if (!itipData.uid) {
    errors.push('UID is required');
  }

  if (itipData.method) {
    // Method-specific validation
    switch (itipData.method) {
      case 'REQUEST': {
        if (!itipData.organizer) {
          errors.push('ORGANIZER is required for REQUEST');
        }

        if (itipData.attendees.length === 0) {
          errors.push('At least one ATTENDEE is required for REQUEST');
        }

        break;
      }

      case 'REPLY': {
        if (itipData.attendees.length !== 1) {
          errors.push('Exactly one ATTENDEE is required for REPLY');
        }

        break;
      }

      case 'CANCEL': {
        if (!itipData.organizer) {
          errors.push('ORGANIZER is required for CANCEL');
        }

        break;
      }

      case 'ADD': {
        if (!itipData.organizer) {
          errors.push('ORGANIZER is required for ADD');
        }

        break;
      }

      case 'REFRESH': {
        if (itipData.attendees.length !== 1) {
          errors.push('Exactly one ATTENDEE is required for REFRESH');
        }

        break;
      }

      case 'COUNTER': {
        if (itipData.attendees.length !== 1) {
          errors.push('Exactly one ATTENDEE is required for COUNTER');
        }

        break;
      }

      case 'DECLINECOUNTER': {
        if (!itipData.organizer) {
          errors.push('ORGANIZER is required for DECLINECOUNTER');
        }

        break;
      }

      default: {
        break;
      }
    }
  }

  // Validate attendee PARTSTAT values
  for (const attendee of itipData.attendees) {
    if (
      attendee.partstat &&
      !PARTSTAT_VALUES.includes(attendee.partstat.toUpperCase())
    ) {
      errors.push(`Invalid PARTSTAT value: ${attendee.partstat}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate an iTIP REQUEST message
 * @param {Object} options - Generation options
 * @param {string} options.uid - Event UID
 * @param {string} options.summary - Event summary
 * @param {Date} options.dtstart - Start date/time
 * @param {Date} options.dtend - End date/time
 * @param {Object} options.organizer - Organizer { email, cn }
 * @param {Array} options.attendees - Attendees [{ email, cn, role }]
 * @param {string} [options.description] - Event description
 * @param {string} [options.location] - Event location
 * @param {number} [options.sequence=0] - Sequence number
 * @returns {string} iCalendar string with METHOD:REQUEST
 */
function generateRequest(options) {
  const {
    uid,
    summary,
    dtstart,
    dtend,
    organizer,
    attendees,
    description,
    location,
    sequence = 0
  } = options;

  if (
    !uid ||
    !summary ||
    !dtstart ||
    !organizer ||
    !attendees ||
    attendees.length === 0
  ) {
    throw new TypeError('Missing required fields for REQUEST');
  }

  const vcalendar = new ICAL.Component(['vcalendar', [], []]);
  vcalendar.updatePropertyWithValue('version', '2.0');
  vcalendar.updatePropertyWithValue('prodid', '-//Forward Email//CalDAV//EN');
  vcalendar.updatePropertyWithValue('method', 'REQUEST');

  const vevent = new ICAL.Component('vevent');
  vevent.updatePropertyWithValue('uid', uid);
  vevent.updatePropertyWithValue('dtstamp', ICAL.Time.now());
  vevent.updatePropertyWithValue('dtstart', ICAL.Time.fromJSDate(dtstart));
  if (dtend) {
    vevent.updatePropertyWithValue('dtend', ICAL.Time.fromJSDate(dtend));
  }

  vevent.updatePropertyWithValue('summary', summary);
  vevent.updatePropertyWithValue('sequence', sequence);

  if (description) {
    vevent.updatePropertyWithValue('description', description);
  }

  if (location) {
    vevent.updatePropertyWithValue('location', location);
  }

  // Add organizer
  const organizerProp = new ICAL.Property('organizer');
  organizerProp.setValue(`mailto:${organizer.email}`);
  if (organizer.cn) {
    organizerProp.setParameter('cn', organizer.cn);
  }

  vevent.addProperty(organizerProp);

  // Add attendees
  for (const attendee of attendees) {
    const attendeeProp = new ICAL.Property('attendee');
    attendeeProp.setValue(`mailto:${attendee.email}`);
    if (attendee.cn) {
      attendeeProp.setParameter('cn', attendee.cn);
    }

    attendeeProp.setParameter('partstat', attendee.partstat || 'NEEDS-ACTION');
    attendeeProp.setParameter('role', attendee.role || 'REQ-PARTICIPANT');
    attendeeProp.setParameter('rsvp', 'TRUE');
    vevent.addProperty(attendeeProp);
  }

  vcalendar.addSubcomponent(vevent);
  return vcalendar.toString();
}

/**
 * Generate an iTIP REPLY message
 * @param {Object} options - Generation options
 * @param {string} options.uid - Event UID
 * @param {Object} options.organizer - Organizer { email, cn }
 * @param {Object} options.attendee - Attendee { email, cn, partstat }
 * @param {Date} [options.dtstart] - Start date/time
 * @param {number} [options.sequence=0] - Sequence number
 * @returns {string} iCalendar string with METHOD:REPLY
 */
function generateReply(options) {
  const { uid, organizer, attendee, dtstart, sequence = 0 } = options;

  if (!uid || !organizer || !attendee || !attendee.partstat) {
    throw new TypeError('Missing required fields for REPLY');
  }

  const vcalendar = new ICAL.Component(['vcalendar', [], []]);
  vcalendar.updatePropertyWithValue('version', '2.0');
  vcalendar.updatePropertyWithValue('prodid', '-//Forward Email//CalDAV//EN');
  vcalendar.updatePropertyWithValue('method', 'REPLY');

  const vevent = new ICAL.Component('vevent');
  vevent.updatePropertyWithValue('uid', uid);
  vevent.updatePropertyWithValue('dtstamp', ICAL.Time.now());
  if (dtstart) {
    vevent.updatePropertyWithValue('dtstart', ICAL.Time.fromJSDate(dtstart));
  }

  vevent.updatePropertyWithValue('sequence', sequence);

  // Add organizer
  const organizerProp = new ICAL.Property('organizer');
  organizerProp.setValue(`mailto:${organizer.email}`);
  if (organizer.cn) {
    organizerProp.setParameter('cn', organizer.cn);
  }

  vevent.addProperty(organizerProp);

  // Add attendee with PARTSTAT
  const attendeeProp = new ICAL.Property('attendee');
  attendeeProp.setValue(`mailto:${attendee.email}`);
  if (attendee.cn) {
    attendeeProp.setParameter('cn', attendee.cn);
  }

  attendeeProp.setParameter('partstat', attendee.partstat);
  vevent.addProperty(attendeeProp);

  vcalendar.addSubcomponent(vevent);
  return vcalendar.toString();
}

/**
 * Generate an iTIP CANCEL message
 * @param {Object} options - Generation options
 * @param {string} options.uid - Event UID
 * @param {Object} options.organizer - Organizer { email, cn }
 * @param {Array} options.attendees - Attendees to notify [{ email, cn }]
 * @param {string} [options.summary] - Event summary
 * @param {Date} [options.dtstart] - Start date/time
 * @param {number} [options.sequence=0] - Sequence number
 * @returns {string} iCalendar string with METHOD:CANCEL
 */
function generateCancel(options) {
  const { uid, organizer, attendees, summary, dtstart, sequence = 0 } = options;

  if (!uid || !organizer) {
    throw new TypeError('Missing required fields for CANCEL');
  }

  const vcalendar = new ICAL.Component(['vcalendar', [], []]);
  vcalendar.updatePropertyWithValue('version', '2.0');
  vcalendar.updatePropertyWithValue('prodid', '-//Forward Email//CalDAV//EN');
  vcalendar.updatePropertyWithValue('method', 'CANCEL');

  const vevent = new ICAL.Component('vevent');
  vevent.updatePropertyWithValue('uid', uid);
  vevent.updatePropertyWithValue('dtstamp', ICAL.Time.now());
  if (dtstart) {
    vevent.updatePropertyWithValue('dtstart', ICAL.Time.fromJSDate(dtstart));
  }

  if (summary) {
    vevent.updatePropertyWithValue('summary', summary);
  }

  vevent.updatePropertyWithValue('sequence', sequence);
  vevent.updatePropertyWithValue('status', 'CANCELLED');

  // Add organizer
  const organizerProp = new ICAL.Property('organizer');
  organizerProp.setValue(`mailto:${organizer.email}`);
  if (organizer.cn) {
    organizerProp.setParameter('cn', organizer.cn);
  }

  vevent.addProperty(organizerProp);

  // Add attendees
  if (attendees && attendees.length > 0) {
    for (const attendee of attendees) {
      const attendeeProp = new ICAL.Property('attendee');
      attendeeProp.setValue(`mailto:${attendee.email}`);
      if (attendee.cn) {
        attendeeProp.setParameter('cn', attendee.cn);
      }

      vevent.addProperty(attendeeProp);
    }
  }

  vcalendar.addSubcomponent(vevent);
  return vcalendar.toString();
}

/**
 * Generate a VFREEBUSY response
 * @param {Object} options - Generation options
 * @param {string} options.attendee - Attendee email
 * @param {Date} options.dtstart - Query start time
 * @param {Date} options.dtend - Query end time
 * @param {Array} [options.busyPeriods] - Array of busy periods [{ start: Date, end: Date, type: 'BUSY'|'BUSY-TENTATIVE'|'BUSY-UNAVAILABLE' }]
 * @returns {string} iCalendar VFREEBUSY response
 */
function generateFreeBusy(options) {
  const { attendee, dtstart, dtend, busyPeriods = [] } = options;

  if (!attendee || !dtstart || !dtend) {
    throw new TypeError('Missing required fields for VFREEBUSY');
  }

  const vcalendar = new ICAL.Component(['vcalendar', [], []]);
  vcalendar.updatePropertyWithValue('version', '2.0');
  vcalendar.updatePropertyWithValue('prodid', '-//Forward Email//CalDAV//EN');
  vcalendar.updatePropertyWithValue('method', 'REPLY');

  const vfreebusy = new ICAL.Component('vfreebusy');
  vfreebusy.updatePropertyWithValue('dtstamp', ICAL.Time.now());
  vfreebusy.updatePropertyWithValue(
    'uid',
    `freebusy-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
  );
  vfreebusy.updatePropertyWithValue('dtstart', ICAL.Time.fromJSDate(dtstart));
  vfreebusy.updatePropertyWithValue('dtend', ICAL.Time.fromJSDate(dtend));

  // Add attendee
  const attendeeProp = new ICAL.Property('attendee');
  attendeeProp.setValue(`mailto:${attendee}`);
  vfreebusy.addProperty(attendeeProp);

  // Add busy periods using ICAL.Period
  for (const period of busyPeriods) {
    const start = ICAL.Time.fromJSDate(period.start);
    const end = ICAL.Time.fromJSDate(period.end);
    const icalPeriod = new ICAL.Period({ start, end });

    const freebusyProp = new ICAL.Property('freebusy');
    freebusyProp.setValue(icalPeriod);
    if (period.type && period.type !== 'BUSY') {
      freebusyProp.setParameter('fbtype', period.type);
    }

    vfreebusy.addProperty(freebusyProp);
  }

  vcalendar.addSubcomponent(vfreebusy);
  return vcalendar.toString();
}

/**
 * Generate a schedule-tag for an event
 * @param {string} uid - Event UID
 * @param {number} sequence - Event sequence number
 * @param {Date} [dtstamp] - DTSTAMP value
 * @returns {string} Schedule tag value
 */
function generateScheduleTag(uid, sequence, dtstamp) {
  const data = `${uid}:${sequence}:${
    dtstamp ? dtstamp.toISOString() : Date.now()
  }`;
  return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16);
}

/**
 * Extract scheduling metadata from an iCalendar event for SQLite storage
 * @param {string} icalData - Raw iCalendar data
 * @returns {Object} Scheduling metadata for database storage
 */
function extractSchedulingMetadata(icalData) {
  try {
    const itipData = parseItip(icalData);

    return {
      scheduleTag: generateScheduleTag(
        itipData.uid,
        itipData.sequence,
        itipData.dtstart
      ),
      itipMethod: itipData.method,
      organizerEmail: itipData.organizer?.email || null,
      attendees: itipData.attendees.map((a) => ({
        email: a.email,
        partstat: a.partstat,
        cn: a.cn,
        role: a.role
      })),
      sequence: itipData.sequence
    };
  } catch {
    // Return empty metadata if parsing fails
    return {
      scheduleTag: null,
      itipMethod: null,
      organizerEmail: null,
      attendees: [],
      sequence: 0
    };
  }
}

/**
 * Update attendee PARTSTAT in an iCalendar event
 * @param {string} icalData - Raw iCalendar data
 * @param {string} attendeeEmail - Attendee email to update
 * @param {string} partstat - New PARTSTAT value
 * @returns {string|null} Updated iCalendar data or null if attendee not found
 */
function updateAttendeePartstat(icalData, attendeeEmail, partstat) {
  if (!icalData || !attendeeEmail || !partstat) {
    return null;
  }

  if (!PARTSTAT_VALUES.includes(partstat.toUpperCase())) {
    throw new TypeError(`Invalid PARTSTAT value: ${partstat}`);
  }

  try {
    const jcal = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcal);
    const vevent = comp.getFirstSubcomponent('vevent');

    if (!vevent) {
      return null;
    }

    const attendeeProps = vevent.getAllProperties('attendee');
    let found = false;

    for (const prop of attendeeProps) {
      const value = prop.getFirstValue();
      const email = value ? value.replace(/^mailto:/i, '').toLowerCase() : null;

      if (email === attendeeEmail.toLowerCase()) {
        prop.setParameter('partstat', partstat.toUpperCase());
        found = true;
        break;
      }
    }

    if (!found) {
      return null;
    }

    return comp.toString();
  } catch {
    return null;
  }
}

/**
 * Check if an iCalendar event has a specific UID
 * @param {string} icalData - Raw iCalendar data
 * @param {string} uid - UID to check
 * @returns {boolean} True if the event has the specified UID
 */
function eventHasUid(icalData, uid) {
  if (!icalData || !uid) {
    return false;
  }

  try {
    const jcal = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcal);
    const vevent = comp.getFirstSubcomponent('vevent');

    if (!vevent) {
      return false;
    }

    const eventUid = vevent.getFirstPropertyValue('uid');
    return eventUid === uid;
  } catch {
    return false;
  }
}

module.exports = {
  // Constants
  ITIP_METHODS,
  PARTSTAT_VALUES,

  // Parsing and validation
  parseItip,
  validateItip,

  // Generation
  generateRequest,
  generateReply,
  generateCancel,
  generateFreeBusy,
  generateScheduleTag,

  // Metadata extraction
  extractSchedulingMetadata,

  // Utilities
  updateAttendeePartstat,
  eventHasUid
};
