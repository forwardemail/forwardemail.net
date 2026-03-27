/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const { Buffer } = require('node:buffer');

// const getUuid = require('@forwardemail/uuid-by-string');
const API = require('@ladjs/api');
const ms = require('ms');
const basicAuth = require('basic-auth');
const Boom = require('@hapi/boom');
const ICAL = require('ical.js');
const caldavAdapter = require('caldav-adapter');
const etag = require('etag');
const falso = require('@ngneat/falso');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const uuid = require('uuid');
const { rrulestr } = require('rrule');
const sanitizeHtml = require('sanitize-html');

const _ = require('#helpers/lodash');
const Aliases = require('#models/aliases');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const Domains = require('#models/domains');
const Emails = require('#models/emails');
const config = require('#config');
const isCodeBug = require('#helpers/is-code-bug');
const createTangerine = require('#helpers/create-tangerine');
// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
const env = require('#config/env');
const i18n = require('#helpers/i18n');
const isEmail = require('#helpers/is-email');
const sendApnCalendar = require('#helpers/send-apn-calendar');
const sendWebSocketNotification = require('#helpers/send-websocket-notification');
const setupAuthSession = require('#helpers/setup-auth-session');
const { processCalendarInvites } = require('#helpers/process-calendar-invites');
const {
  buildICS: buildICSHelper,
  detectAttendeePartstatChange,
  resetPartstatsOnSignificantChange,
  sendCalendarEmail
} = require('#helpers/send-calendar-email');
const {
  parseContentDispositionFilename,
  quoteICSFilenames
} = require('#helpers/ical-filename');

const exdateRegex =
  /^EXDATE(?:;TZID=[\w/+=-]+|;VALUE=DATE)?:\d{8}(?:T\d{6}(?:\.\d{1,3})?Z?)?$/;

function isValidExdate(str) {
  return exdateRegex.test(str);
}

//
// RFC 8607 Managed Attachments Constants
// <https://www.rfc-editor.org/rfc/rfc8607.html>
//
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_ATTACHMENTS_PER_RESOURCE = 10;
const DAV_HEADER_VALUE =
  '1, 3, calendar-access, calendar-schedule, calendar-auto-schedule, calendar-managed-attachments, calendar-managed-attachments-no-recurrence';

//
// Reminders (DEFAULT_TASK_CALENDAR_NAME)
//
const I18N_SET_REMINDERS = new Set([
  ...Object.values({
    ar: 'تذكيرات', // (tadhkīrāt) - No capitalization in Arabic script
    cs: 'Připomínky',
    da: 'Påmindelser',
    de: 'Erinnerungen',
    en: 'Reminders',
    es: 'Recordatorios',
    fi: 'Muistutukset',
    fr: 'Rappels',
    he: 'תזכורות', // (tazkorot) - No capitalization in Hebrew script
    hu: 'Emlékeztetők',
    id: 'Pengingat',
    it: 'Promemoria',
    ja: 'リマインダー', // (rimaindā) - No capitalization in Japanese script
    ko: '리마인더', // (rimaideo) or '알림' (allim) - No capitalization in Korean script
    nl: 'Herinneringen',
    no: 'Påminnelser',
    pl: 'Przypomnienia',
    pt: 'Lembretes',
    ru: 'Напоминания', // (Napominaniya)
    sv: 'Påminnelser',
    th: 'การแจ้งเตือน', // (kān jâeng dtôn) - No capitalization in Thai script
    tr: 'Hatırlatıcılar',
    uk: 'Нагадування', // (Nahaduvannya)
    vi: 'Lời nhắc',
    zh: '提醒' // (tíxǐng) - No capitalization in Chinese script
  }),
  //
  // Alternates
  //

  // ko
  '알림' // (allim) No capitalization in Korean script
]);

//
// Tasks
//
const I18N_SET_TASKS = new Set([
  ...Object.values({
    ar: 'مهام', // (mahām) - No capitalization in Arabic script
    cs: 'Úkoly',
    da: 'Opgaver',
    de: 'Aufgaben',
    en: 'Tasks',
    es: 'Tareas',
    fi: 'Tehtävät',
    fr: 'Tâches',
    he: 'משימות', // (mesimot) - No capitalization in Hebrew script
    hu: 'Feladatok',
    id: 'Tugas',
    it: 'Attività', // or 'Compiti'
    ja: 'タスク', // (tasuku) or '任務' (ninmu) - No capitalization in Japanese script
    ko: '작업', // (jageop) or '태스크' (taeseukeu) - No capitalization in Korean script
    nl: 'Taken',
    no: 'Oppgaver',
    pl: 'Zadania',
    pt: 'Tarefas',
    ru: 'Задачи', // (Zadachi)
    sv: 'Uppgifter',
    th: 'งาน', // (ngān) - No capitalization in Thai script
    tr: 'Görevler',
    uk: 'Завдання', // (Zavdannya)
    vi: 'Nhiệm vụ',
    zh: '任务' // (rènwù) - No capitalization in Chinese script
  }),

  //
  // Alternates
  //

  // it
  'Compiti',
  // ja
  '任務', // (ninmu)
  // ko
  '태스크' // (taeseukeu)
]);

//
// Appointments
//
const I18N_SET_APPOINTMENTS = new Set([
  ...Object.values({
    ar: 'مواعيد', // (mawāʿīd) - No capitalization in Arabic script
    cs: 'Schůzky',
    da: 'Aftaler',
    de: 'Termine',
    en: 'Appointments',
    es: 'Citas',
    fi: 'Tapaamiset',
    fr: 'Rendez-vous',
    he: 'פגישות', // (pgishot) - No capitalization in Hebrew script
    hu: 'Találkozók',
    id: 'Janji temu',
    it: 'Appuntamenti',
    ja: '予定', // (yotei) or 'アポイントメント' (apointomento) - No capitalization in Japanese script
    ko: '약속', // (yaksok) or '예약' (yeyak) - No capitalization in Korean script
    nl: 'Afspraken',
    no: 'Avtaler',
    pl: 'Spotkania', // or 'Terminy'
    pt: 'Compromissos',
    ru: 'Встречи', // (Vstrechi) or 'Назначения' (Naznacheniya)
    sv: 'Möten', // or 'Bokningar'
    th: 'นัดหมาย', // (nat māi) - No capitalization in Thai script
    tr: 'Randevular',
    uk: 'Зустрічі', // (Zustrichi) or 'Призначення' (Pryznachennya)
    vi: 'Cuộc hẹn',
    zh: '预约' // (yùyuē) - No capitalization in Chinese script
  }),
  //
  // Alternates
  //
  // ja
  'アポイントメント', // (apointomento)
  // ko
  '예약', // (yeyak)
  // pl
  'Terminy',
  // ru
  'Назначения', // (Naznacheniya)
  // sv
  'Bokningar', // Already capitalized as provided, correct as is
  // uk
  'Призначення' // (Pryznachennya)
]);

// Events
const I18N_SET_EVENTS = new Set([
  ...Object.values({
    ar: 'أحداث', // (aḥdāth) - No capitalization in Arabic script
    cs: 'Události',
    da: 'Begivenheder',
    de: 'Ereignisse', // or 'Veranstaltungen'
    en: 'Events',
    es: 'Eventos',
    fi: 'Tapahtumat',
    fr: 'Événements',
    he: 'אירועים', // (irua’im) - No capitalization in Hebrew script
    hu: 'Események',
    id: 'Acara',
    it: 'Eventi',
    ja: 'イベント', // (ibento) or '行事' (gyōji) - No capitalization in Japanese script
    ko: '이벤트', // (ibenteu) or '행사' (haengsa) - No capitalization in Korean script
    nl: 'Evenementen',
    no: 'Hendelser', // or 'Arrangementer'
    pl: 'Wydarzenia',
    pt: 'Eventos',
    ru: 'События', // (Sobytiya)
    sv: 'Evenemang',
    th: 'เหตุการณ์', // (hētukān) or 'งาน' (ngān) - No capitalization in Thai script
    tr: 'Etkinlikler',
    uk: 'Події', // (Podiyi)
    vi: 'Sự kiện',
    zh: '活动' // (huódòng) or '事件' (shìjiàn) - No capitalization in Chinese script
  }),

  //
  // Alternates
  //

  // de
  'Veranstaltungen',
  // ja
  '行事', // (gyōji) - No capitalization in Japanese script
  // ko
  '행사', // (haengsa) - No capitalization in Korean script
  // no
  'Arrangementer',
  // th
  'งาน', // (ngān) - No capitalization in Thai script
  // zh
  '事件' // (shìjiàn) - No capitalization in Chinese script
]);

// Default
const I18N_SET_DEFAULT = new Set(
  Object.values({
    ar: 'افتراضي', // (iftirāḍī) - No capitalization in Arabic script
    cs: 'Výchozí',
    da: 'Standard',
    de: 'Standard',
    en: 'Default',
    es: 'Predeterminado',
    fi: 'Oletus',
    fr: 'Par défaut',
    he: 'ברירת מחדל', // (brerat machdal) - No capitalization in Hebrew script
    hu: 'Alapértelmezett',
    id: 'Bawaan',
    it: 'Predefinito',
    ja: 'デフォルト', // (deforuto) - No capitalization in Japanese script
    ko: '기본', // (gibon) - No capitalization in Korean script
    nl: 'Standaard',
    no: 'Standard',
    pl: 'Domyślny',
    pt: 'Padrão',
    ru: 'По умолчанию', // (Po umolchaniyu)
    sv: 'Standard',
    th: 'ค่าเริ่มต้น', // (khâ rûem dtôn) - No capitalization in Thai script
    tr: 'Varsayılan',
    uk: 'За замовчуванням', // (Za zamovchuvannyam)
    vi: 'Mặc định',
    zh: '默认' // (mòrèn) - No capitalization in Chinese script
  })
);

// Calendar
const I18N_CALENDAR = {
  ar: 'تقويم', // (taqwīm) - No capitalization in Arabic script
  cs: 'Kalendář',
  da: 'Kalender',
  de: 'Kalender',
  en: 'Calendar',
  es: 'Calendario',
  fi: 'Kalenteri',
  fr: 'Calendrier',
  he: 'לוח שנה', // (luach shana) - No capitalization in Hebrew script
  hu: 'Naptár',
  id: 'Kalender',
  it: 'Calendario',
  ja: 'カレンダー', // (karendā) - No capitalization in Japanese script
  ko: '달력', // (dallyeok) - No capitalization in Korean script
  nl: 'Kalender',
  no: 'Kalender',
  pl: 'Kalendarz',
  pt: 'Calendário',
  ru: 'Календарь', // (Kalendar)
  sv: 'Kalender',
  th: 'ปฏิทิน', // (patithin) - No capitalization in Thai script
  tr: 'Takvim',
  uk: 'Календар', // (Kalendar)
  vi: 'Lịch',
  zh: '日历' // (rìlì) - No capitalization in Chinese script
};
const I18N_SET_CALENDAR = new Set(Object.values(I18N_CALENDAR));

// DEFAULT_CALENDAR_NAME
const I18N_SET_DEFAULT_CALENDAR_NAME = new Set([
  ...I18N_SET_CALENDAR,
  ...I18N_SET_EVENTS,
  ...I18N_SET_DEFAULT
]);

//
// Redis key prefix and TTL for caching that default calendars have
// already been ensured for a given alias.  Mirrors the pattern used
// by `ensureDefaultMailboxes` in helpers/ensure-default-mailboxes.js.
//
const ENSURE_CALENDAR_CACHE_PREFIX = 'caldav_cal_ensured:';
const ENSURE_CALENDAR_CACHE_TTL = ms('1h');

//
// Redis negative-cache for processCalendarInvites.
// When the MongoDB query returns zero pending invites we cache that
// fact so subsequent CalDAV requests from the same alias skip the
// round-trip to MongoDB entirely.  The TTL is intentionally short
// (30 s) so newly queued invites are picked up promptly.
//
const PROCESS_INVITES_CACHE_PREFIX = 'caldav_inv_empty:';
const PROCESS_INVITES_CACHE_TTL = ms('30s');

//
// In-flight guard: prevents duplicate concurrent processCalendarInvites
// runs for the same alias.  CalDAV clients (e.g. Fantastical) send
// 5-10 requests per sync, each of which triggers authentication.
// Without this guard, every request would start its own invite
// processing, creating a thundering herd of WSP calls.
//
const _inviteProcessingInflight = new Map();

async function ensureDefaultCalendars(ctx) {
  //
  // this only gets run if there are *zero* calendars on Android/Windows/etc
  // otherwise if on Apple this ensures that there
  // is a "Calendar" (DEFAULT_CALENDAR_NAME) and "Reminders" (DEFAULT_TASK_CALENDAR_NAME) created
  //
  const calendarDefaults = {
    // db virtual helper
    instance: this,
    session: ctx.state.session,
    //
    // calendar obj
    //
    description: config.urls.web,
    prodId: `//forwardemail.net//caldav//${ctx.locale.toUpperCase()}`,
    //
    // NOTE: instead of using timezone from IP we use
    //       their last time zone set in a browser session
    //       (this is way more accurate and faster)
    //
    //       here were some alternatives though during R&D:
    //       * <https://github.com/runk/node-maxmind>
    //       * <https://github.com/evansiroky/node-geo-tz>
    //       * <https://github.com/safing/mmdbmeld>
    //       * <https://github.com/sapics/ip-location-db>
    //
    timezone: ctx.state.session.user.timezone,
    url: config.urls.web,
    readonly: false,
    synctoken: `${config.urls.web}/ns/sync-token/1`
  };

  //
  // Performance: check Redis to see if we already ensured default
  // calendars for this alias recently.  This avoids hitting SQLite
  // with countDocuments + findOne queries on every single request.
  //
  if (this.client) {
    try {
      const cacheKey = `${ENSURE_CALENDAR_CACHE_PREFIX}${ctx.state.session.user.alias_id}`;
      const cached = await this.client.get(cacheKey);
      if (cached) {
        ctx.logger.debug('ensureDefaultCalendars: skipped (cached)');
        return;
      }
    } catch (err) {
      // Redis failure is non-fatal; fall through to the normal path
      ctx.logger.warn('ensureDefaultCalendars: Redis cache check failed', {
        err
      });
    }
  }

  const count = await Calendars.countDocuments(this, ctx.state.session, {});
  if (count > 0) {
    // Calendars exist — cache this fact so we skip the check next time
    await _setEnsureCalendarCache.call(this, ctx);
    return;
  }

  if (!ctx.state.isApple) {
    await Calendars.create({
      ...calendarDefaults,
      calendarId: randomUUID(),
      color: '#0000FF', // blue
      //
      // NOTE: Android uses "Events" and most others use "Calendar" as default calendar name
      //
      // create "Calendar" in localized string
      //
      name: I18N_CALENDAR[ctx.locale] || ctx.translate('CALENDAR'),
      has_vevent: true, // Support both events and tasks
      has_vtodo: true
    });

    await _setEnsureCalendarCache.call(this, ctx);
    return;
  }

  //
  // NOTE: we detect user-agent and if we're on macOS/iOS then ensure created:
  //       - DEFAULT_CALENDAR_NAME <-> Calendar
  //       - DEFAULT_TASK_CALENDAR_NAME <-> Reminders
  //
  //       (or similar variants that would be fetched via subsequent MKCALENDAR call)
  //

  let [defaultCalendar, defaultTaskCalendar] = await Promise.all([
    Calendars.findOne(this, ctx.state.session, {
      name: 'DEFAULT_CALENDAR_NAME'
    }),
    Calendars.findOne(this, ctx.state.session, {
      name: 'DEFAULT_TASK_CALENDAR_NAME'
    })
  ]);

  [defaultCalendar, defaultTaskCalendar] = await Promise.all([
    defaultCalendar
      ? Promise.resolve(defaultCalendar)
      : Calendars.findOne(this, ctx.state.session, {
          name: {
            $in: [...I18N_SET_CALENDAR]
          }
        }),
    defaultTaskCalendar
      ? Promise.resolve(defaultTaskCalendar)
      : Calendars.findOne(this, ctx.state.session, {
          name: {
            $in: [...I18N_SET_REMINDERS]
          }
        })
  ]);

  if (!defaultCalendar)
    defaultCalendar = await Calendars.findOne(this, ctx.state.session, {
      name: { $in: [...I18N_SET_DEFAULT_CALENDAR_NAME] }
    });

  // Create a single unified calendar that supports both events and tasks
  if (!defaultCalendar) {
    defaultCalendar = await Calendars.create({
      ...calendarDefaults,
      calendarId: randomUUID(),
      color: '#0000FF', // blue
      name: 'DEFAULT_CALENDAR_NAME', // Calendar
      has_vevent: true, // Support both events and tasks
      has_vtodo: true
    });
  }

  // For backward compatibility, if a separate task calendar exists, keep it
  // but we won't create a new one by default
  if (!defaultTaskCalendar) {
    defaultTaskCalendar = defaultCalendar; // Use the same calendar for tasks
  }

  ctx.logger.debug('defaultCalendar', { id: defaultCalendar?._id });
  ctx.logger.debug('defaultTaskCalendar', { id: defaultTaskCalendar?._id });

  await _setEnsureCalendarCache.call(this, ctx);
}

//
// Helper: set the Redis cache key that records we have already
// ensured default calendars for this alias.
//
async function _setEnsureCalendarCache(ctx) {
  if (!this.client) return;
  try {
    const cacheKey = `${ENSURE_CALENDAR_CACHE_PREFIX}${ctx.state.session.user.alias_id}`;
    await this.client.set(cacheKey, '1', 'PX', ENSURE_CALENDAR_CACHE_TTL);
  } catch (err) {
    ctx.logger.warn('ensureDefaultCalendars: Redis cache set failed', {
      err
    });
  }
}

//
// NOTE: google's implementation is available at the following link:
//       <https://developers.google.com/calendar/caldav/v2/guide>
//
// NOTE: to debug iCal on macOS see Console and run these commands
//       <https://sabre.io/dav/clients/ical/#:~:text=Technical%20information-,Debugging,-To%20enable%20the>
//

// TODO: DNS SRV records <https://sabre.io/dav/service-discovery/#dns-srv-records>

function bumpSyncToken(synctoken) {
  //
  // synctoken must be a valid URL like:
  //   https://forwardemail.net/ns/sync-token/1
  //
  // If the synctoken is corrupted (e.g. just a number, or a partial
  // path like "/7"), we reset to the default base URL to prevent
  // mongoose validation failures (isURL check).
  //
  const DEFAULT_SYNC_BASE = `${config.urls.web}/ns/sync-token`;

  if (typeof synctoken !== 'string' || synctoken.trim() === '') {
    return `${DEFAULT_SYNC_BASE}/1`;
  }

  const parts = synctoken.split('/');
  const lastPart = parts[parts.length - 1];
  const num = Number.parseInt(lastPart, 10);

  // If the last part is not a valid number, reset
  if (Number.isNaN(num)) {
    return `${DEFAULT_SYNC_BASE}/1`;
  }

  const base = parts.slice(0, -1).join('/');

  // If the base is empty or not a valid URL prefix, reset with the bumped number
  if (!base || !base.startsWith('http')) {
    return `${DEFAULT_SYNC_BASE}/${num + 1}`;
  }

  return `${base}/${num + 1}`;
}

// Helper function to detect component type from ICS data
function getComponentType(icsData) {
  try {
    const parsed = ICAL.parse(icsData);
    if (!parsed || parsed.length === 0) return null;

    const comp = new ICAL.Component(parsed);
    if (!comp) return null;

    const vevent = comp.getFirstSubcomponent('vevent');
    const vtodo = comp.getFirstSubcomponent('vtodo');

    if (vevent && !vtodo) return 'VEVENT';
    if (vtodo && !vevent) return 'VTODO';
    if (vevent && vtodo) return 'VEVENT'; // Prioritize VEVENT for mixed content
    return null;
  } catch {
    return null;
  }
}

// Helper function to determine if calendar supports specific component type
function calendarSupportsComponent(calendar, componentType) {
  if (!calendar) {
    // Default behavior: support both VEVENT and VTODO
    return componentType === 'VEVENT' || componentType === 'VTODO';
  }

  if (componentType === 'VEVENT') {
    return calendar.has_vevent !== false; // Default to true if not set
  }

  if (componentType === 'VTODO') {
    return calendar.has_vtodo !== false; // Default to true if not set
  }

  return false;
}

//
// Helper function to get eventId variants for flexible lookup.
// This ensures backwards compatibility by searching for both
// eventId with and without .ics extension.
//
// For example, if eventId is "abc123", it will search for:
// - "abc123"
// - "abc123.ics"
//
// If eventId is "abc123.ics", it will search for:
// - "abc123.ics"
// - "abc123"
//
function getEventIdVariants(eventId) {
  if (typeof eventId !== 'string') return [eventId];

  if (eventId.endsWith('.ics')) {
    return [eventId, eventId.slice(0, -4)];
  }

  return [eventId, `${eventId}.ics`];
}

// TODO: support SMS reminders for VALARM

//
// TODO: we should fork ical.js and merge these PR's
//       <https://github.com/kewisch/ical.js/issues/646>
//

//
// TODO: valarm duration needs to be converted to a Number or (date/string?)
//
// const dt = ICAL.Time.fromJSDate(new Date('2024-01-01T06:00:00.000Z'))
// const cp = dt.clone()
// cp.addDuration(ICAL.Duration.fromString('-P0DT0H30M0S'));
// cp.toJSDate()

/*
    const event = ctx.request.ical.find((obj) => obj.type === 'VEVENT');
    if (!event) return;

    // safeguard in case our implementation is off (?)
    if (ctx.request.ical.filter((obj) => obj.type === 'VEVENT').length > 1) {
      const err = new TypeError('Multiple VEVENT passed');
      err.ical = ctx.request.ical;
      throw err;
    }

    // safeguard in case library isn't working for some reason
    const parsed = ICAL.parse(ctx.request.body);
    if (!parsed || parsed.length === 0) {
      const err = new TypeError('ICAL.parse was not successful');
      err.parsed = parsed;
      throw err;
    }

    const comp = new ICAL.Component(parsed);
    if (!comp) throw new TypeError('ICAL.Component was not successful');

    const vevent = comp.getFirstSubcomponent('vevent');

    if (!vevent)
      throw new TypeError('comp.getFirstSubcomponent was not successful');

    const icalEvent = new ICAL.Event(vevent);

    if (!icalEvent) throw new TypeError('ICAL.Event was not successful');

    //
    // VALARM
    //
    const icalAlarms = icalEvent.component.getAllSubcomponents('valarm');
    event.alarms = [];
    for (const alarm of icalAlarms) {
      // getFirstProperty('x').getParameter('y')
      // NOTE: attendee missing from ical-generator right now
      //       (which is who the alarm correlates to, e.g. `ATTENDEE:mailto:foo@domain.com`)
      // <https://github.com/sebbo2002/ical-generator/issues/573>
      /*
  alarms.push({
    // DISPLAY (to lower case for ical-generator)
    type: 'DISPLAY', 'AUDIO', 'EMAIL' (required)
    trigger: Number or Date,
    relatesTo: 'END', 'START', or null
    repeat: {
      times: Number,
      interval: Number
    } || null,
    attach: {
      uri: String,
      mime: String || null
    } || null,
    description: String || null,
    x: [
      { key: '', value: '' }
    ]
  });
  */

/*
      let trigger;
      let relatesTo = null;
      if (alarm.getFirstProperty('trigger')) {
        const value = alarm.getFirstPropertyValue('trigger');
        if (value instanceof ICAL.Duration) {
          trigger = value.toSeconds();
        } else if (value instanceof ICAL.Time) {
          trigger = value.toJSDate();
        }

        if (alarm.getFirstProperty('trigger').getParameter('related'))
          relatesTo = alarm.getFirstProperty('trigger').getParameter('related');
      }

      let repeat = null;
      // RFC spec requires that both are set if one of them is
      if (
        alarm.getFirstProperty('repeat') &&
        alarm.getFirstProperty('duration')
      ) {
        const value = alarm.getFirstPropertyValue('duration');
        repeat = {
          times: alarm.getFirstPropertyValue('repeat'), // ical.js already parses as a number
          interval: value.toSeconds()
        };
      }

      //
      // NOTE: attachments are not added right now because ical-generator does not support them properly
      //
      // TODO: ical-generator is missing some required props used for reconstructing attachments
      //       <https://github.com/sebbo2002/ical-generator/issues/577>
      //
      // TODO: ical-generator toString() is completely broken for attachments right now
      //       <https://github.com/sebbo2002/ical-generator/blob/f27dd10e9b2d830953687eca5daa52acca1731cc/src/alarm.ts#L618-L627>
      //       (e.g. it doesn't support the value below)
      //
      // TODO: we should probably drop ical-generator and rewrite it with ical.js purely
      //
      const attach = null;
      // ATTACH;FMTTYPE=text/plain;ENCODING=BASE64;VALUE=BINARY;X-BASE64-PARAM=UGFyYW1ldGVyCg=:WW91IHJlYWxseSBzcGVudCB0aGUgdGltZSB0byBiYXNlNjQgZGVjb2RlIHRoaXM/Cg=
      event.alarms.push({
        type: alarm.getFirstPropertyValue('action'),
        trigger,
        relatesTo,
        repeat,
        attach // TODO: fix this in the future
      });
    }

    //
    // ATTENDEE
    //
    const icalAttendees = icalEvent.attendees;
    event.attendees = [];
    for (const attendee of icalAttendees) {
      //
      // NOTE: there is a bug right now with node-ical parser for attendees
      //       (only one attendee is parsed even if there are multiple)
      //       <https://github.com/jens-maus/node-ical/issues/302>
      //
      // TODO: validate attendee props in the future
      //       <https://github.com/sebbo2002/ical-generator/blob/c6d2f1f9909930743acb54003e124faea4f58cec/src/attendee.ts#L38-L74>
      //
      // <https://github.com/sebbo2002/ical-generator/blob/9190c842f4e9aa9ac8fd598983303cb95e3cf76b/src/attendee.ts#L22>
      //
      // name?: string | null;
      // email: string;
      // mailto?: string | null;
      // sentBy?: string | null;
      // status?: ICalAttendeeStatus | null;
      // role?: ICalAttendeeRole;
      // rsvp?: boolean | null;
      // type?: ICalAttendeeType | null;
      // delegatedTo?: ICalAttendee | ICalAttendeeData | string | null;
      // delegatedFrom?: ICalAttendee | ICalAttendeeData | string | null;
      // x?: {key: string, value: string}[] | [string, string][] | Record<string, string>;
      //
      const x = [];
      for (const key of Object.keys(attendee.jCal[1])) {
        if (key.startsWith('x-')) {
          x.push({
            key,
            value: attendee.jCal[1][key]
          });
        }
      }

      event.attendees.push({
        name: attendee.getParameter('cn'),
        email: attendee.getParameter('email').replace('mailto:', ''), // safeguard (?)
        mailto: attendee.getFirstValue().replace('mailto:', ''),
        sentBy: attendee.getParameter('sent-by') || null,
        status: attendee.getParameter('partstat'),
        role: attendee.getParameter('role') || null,
        rsvp: attendee.getParameter('rsvp')
          ? boolean(attendee.getParameter('rsvp'))
          : null,
        type: attendee.getParameter('cutype'),
        delegatedTo: attendee.getParameter('delegated-to'),
        delegatedFrom: attendee.getParameter('delegated-from'),
        x
      });
    }

    //
    // summary is always a string
    // (safeguard fallback in case node-ical doesn't parse it properly as a string)
    //
    event.summary =
      typeof event.summary === 'string' ? event.summary : icalEvent.summary;

    // add X- arbitrary attributes
    const x = [];
    for (const key of Object.keys(icalEvent.jCal[1])) {
      if (
        key.startsWith('x-') && //
        // NOTE: these props get auto-added by toString() of an Event in ical-generator
        //       (so we want to ignore them here so they won't get added twice to ICS output)
        //
        // X-MICROSOFT-CDO-ALLDAYEVENT
        // X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT
        // X-APPLE-STRUCTURED-LOCATION
        // X-ALT-DESC
        // X-MICROSOFT-CDO-BUSYSTATUS
        ![
          'x-microsoft-cdo-alldayevent',
          'x-microsoft-msncalendar-alldayevent',
          'x-apple-structured-location',
          'x-alt-desc',
          'x-microsoft-cdo-busystatus'
        ].includes(key)
      ) {
        x.push({
          key,
          value: icalEvent.jCal[1][key]
        });
      }
    }

    // location is an object and consists of
    // - title (string)
    // - address (string)
    // - radius (number) - which is from `X-APPLE-RADIUS`
    // - geo (object - `{ lat: Num, lon: Num }`)
    // or it's a string or null
    if (typeof event.location === 'object' && event.location !== null) {
      if (_.isEmpty(event.location)) {
        if (event.geo) {
          // NOTE: pending this issue being resolved, this would actually start working
          //       <https://github.com/sebbo2002/ical-generator/issues/569>
          event.location = {
            title: undefined,
            address: undefined,
            radius: undefined,
            geo: event.geo
          };
        } else {
          event.location = undefined;
        }
      } else {
        //
        // NOTE: this ical-generator implementation is mainly geared to support Apple location
        //
        //       X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=Kurfürstendamm 26\, 10719
        //         Berlin\, Deutschland;X-APPLE-RADIUS=141.1751386318387;X-TITLE=Apple Store
        //         Kurfürstendamm:geo:52.50363,13.32865
        //
        //       <https://github.com/search?q=repo%3Asebbo2002%2Fical-generator+Apple+Store+Kurf%C3%BCrstendamm&type=code>
        if (
          typeof event['APPLE-STRUCTURED-LOCATION'] === 'object' &&
          !_.isEmpty(event['APPLE-STRUCTURED-LOCATION'])
        ) {
          // "APPLE-STRUCTURED-LOCATION": {
          //   "params": {
          //     "VALUE": "URI",
          //     "X-ADDRESS": "Kurfürstendamm 26\\, 10719 Berlin\\, Deutschland",
          //     "X-APPLE-RADIUS": 141.1751386318387,
          //     "X-TITLE": "Apple Store Kurfürstendamm"
          //   },
          //   "val": "geo:52.50363,13.32865"
          // },
          event.location = {
            title: event['APPLE-STRUCTURED-LOCATION'].params['X-TITLE'],
            address: event['APPLE-STRUCTURED-LOCATION'].params['X-ADDRESS'],
            radius: event['APPLE-STRUCTURED-LOCATION'].params['X-APPLE-RADIUS'],
            geo: event.geo || undefined
          };
        } else {
          event.location = {
            title: event.location.val,
            address: undefined,
            radius: undefined,
            geo: event.geo || undefined
          };
        }
      }
    } else if (typeof event.location === 'string') {
      event.location = {
        title: event.location,
        address: undefined,
        radius: undefined,
        geo: event.geo || undefined
      };
    } else if (event.geo) {
      // NOTE: pending this issue being resolved, this would actually start working
      //       <https://github.com/sebbo2002/ical-generator/issues/569>
      event.location = {
        title: undefined,
        address: undefined,
        radius: undefined,
        geo: event.geo
      };
    } else {
      event.location = undefined;
    }

    //
    // TODO: add STYLED-DESCRIPTION to buildICS output
    // TODO: add ALTREP to buildICS object (thunderbird support)
    //
    // description is either an object, string, or null/undefined
    if (typeof event.description === 'object' && event.description !== null) {
      if (_.isEmpty(event.description)) {
        event.description = undefined;
      } else {
        // TODO: support thunderbird altrep
        event.description = {
          plain,
          html
        };
      }
    }

    //
    // TODO: use ICAL parsed organizer here
    //
    // https://github.com/jens-maus/node-ical/issues/303
    // organizer is either an object, string or null
    // if it's an object it has these props:
    //
    // - name: string;
    // - email?: string;
    // - mailto?: string;
    // - sentBy?: string;
    //
    // NOTE: there is a core bug in node-ical where it does not parse organizer properly
    //       https://github.com/jens-maus/node-ical/issues/303
    //
    //  ORGANIZER:mailto:cyrus@example.com
    //  (just a string)
    //
    // or
    //
    // ORGANIZER;CN="Bernard Desruisseaux":mailto:bernard@example.com
    //
    // <https://github.com/sebbo2002/ical-generator/blob/9190c842f4e9aa9ac8fd598983303cb95e3cf76b/src/event.ts#L1786C1-L1800C10>
    // if (this.data.organizer) {
    //     g += 'ORGANIZER;CN="' + escape(this.data.organizer.name, true) + '"';
    //     if (this.data.organizer.sentBy) {
    //         g += ';SENT-BY="mailto:' + escape(this.data.organizer.sentBy, true) + '"';
    //     }
    //     if (this.data.organizer.email && this.data.organizer.mailto) {
    //         g += ';EMAIL=' + escape(this.data.organizer.email, false);
    //     }
    //     if(this.data.organizer.email) {
    //         g += ':mailto:' + escape(this.data.organizer.mailto || this.data.organizer.email, false);
    //     }
    //     g += '\r\n';
    // }
    //
    // NOTE: the output is weird in toString() right now because of how the author designed this
    //       <https://github.com/sebbo2002/ical-generator/issues/571>
    //
    if (typeof event.organizer === 'object' && event.organizer !== null) {
      const mailto = isEmail(event.organizer.val)
        ? event.organizer.val
        : event.organizer.val.replace('mailto:', '');
      event.organizer = {
        name: event.organizer.params.CN,
        email: event.organizer.params.EMAIL
          ? event.organizer.params.EMAIL.replace('mailto:', '')
          : undefined,
        mailto,
        sentBy: event.organizer.params['SENT-BY']
          ? event.organizer.params['SENT-BY'].replace('mailto:', '')
          : undefined
      };
    }

    //
    // NOTE: services like cal.com have some pretty huge issues with calendar support
    //       <https://github.com/calcom/cal.com/issues/3457>
    //       <https://github.com/calcom/cal.com/issues/9485>
    //

    let description;

    // TODO: location and contact can have ALTREP too

    // TODO: convert this to html/plain and change the DB model too

    // TODO: we need to use `unescape()` on the HTML parsed value
    //       because when `toString()` is called by ical-generator
    //       it will automatically use `escape` on the values

    // NOTE: Thunderbird sends over description with:
    // `DESCRIPTION;ALTREP="data:text/html,yaya%3Cb%3Eyay%3C%2Fb%3Eay":yayayayay`

    // TODO: organizer is similar to attendee
  */

//
// CalDAV
// <https://www.rfc-editor.org/rfc/rfc4791>
//
class CalDAV extends API {
  constructor(...args) {
    super(...args);

    this.resolver = createTangerine(this.client, this.logger);

    this.wsp = this.config.wsp;

    this.authenticate = this.authenticate.bind(this);
    this.createCalendar = this.createCalendar.bind(this);
    this.getCalendar = this.getCalendar.bind(this);
    this.updateCalendar = this.updateCalendar.bind(this);
    this.getCalendarsForPrincipal = this.getCalendarsForPrincipal.bind(this);
    this.getEventsForCalendar = this.getEventsForCalendar.bind(this);
    this.getEventsByDate = this.getEventsByDate.bind(this);
    this.getEvent = this.getEvent.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.deleteCalendar = this.deleteCalendar.bind(this);
    this.buildICS = this.buildICS.bind(this);
    this.getCalendarId = this.getCalendarId.bind(this);
    this.getETag = this.getETag.bind(this);

    this.sendEmailWithICS = this.sendEmailWithICS.bind(this);
    this.handleManagedAttachment = this.handleManagedAttachment.bind(this);
    this.handleAttachmentGet = this.handleAttachmentGet.bind(this);

    //
    // Wrap the caldav-adapter middleware with error handling.
    // Without this wrapper, any error thrown in CalDAV handlers
    // (createEvent, updateEvent, etc.) bubbles up to koa-better-error-handler,
    // which calls `ctx.accepts(['text', 'json', 'html'])`.  CalDAV clients
    // (Thunderbird, Apple Calendar, etc.) send Accept headers like
    // `text/xml` or `*/*` that don't match those three types, so the error
    // handler overrides the status to 406 Not Acceptable — masking the real
    // error and confusing clients.
    //
    // This wrapper catches errors and returns a proper WebDAV/CalDAV XML
    // error response so the client sees the actual HTTP status code and
    // error message, and the real error is logged server-side.
    //
    const caldavMiddleware = caldavAdapter({
      authenticate: this.authenticate,
      authRealm: 'forwardemail/caldav',
      caldavRoot: '/',
      calendarRoot: 'dav',
      principalRoot: 'principals',
      // <https://github.com/sedenardi/node-caldav-adapter/blob/bdfbe17931bf14a1803da77dbb70509db9332695/src/koa.ts#L130-L131>
      disableWellKnown: false,
      logEnabled: !env.AXE_SILENT,
      logLevel: env.NODE_ENV === 'production' ? 'warn' : 'debug',
      data: {
        createCalendar: this.createCalendar,
        updateCalendar: this.updateCalendar,
        getCalendar: this.getCalendar,
        getCalendarsForPrincipal: this.getCalendarsForPrincipal,
        getEventsForCalendar: this.getEventsForCalendar,
        getEventsByDate: this.getEventsByDate,
        getEvent: this.getEvent,
        createEvent: this.createEvent,
        updateEvent: this.updateEvent,
        deleteEvent: this.deleteEvent,
        deleteCalendar: this.deleteCalendar,
        buildICS: this.buildICS,
        getCalendarId: this.getCalendarId,
        getETag: this.getETag
      }
    });

    this.app.use(async (ctx, next) => {
      //
      // NOTE: the caldav-adapter middleware handles its own URL routing
      //       internally (rootRegexp, calendarRegex, principalRegex, well-known).
      //       We wrap ALL requests so the adapter can handle /, /dav, /principals,
      //       and /.well-known/caldav — and we catch errors to return proper
      //       WebDAV XML responses instead of letting them bubble up to
      //       koa-better-error-handler (which converts them to 406 due to
      //       CalDAV clients' Accept headers not matching text/json/html).
      //

      //
      // Handle OPTIONS requests before passing to caldav-adapter.
      // The adapter authenticates ALL requests (including OPTIONS) before
      // checking the HTTP method, which triggers full DB setup (onAuth,
      // refreshSession, getDatabase). This causes unnecessary 15s+ timeouts
      // and 500 errors for simple OPTIONS capability-discovery requests
      // from iOS/macOS Calendar (dataaccessd) and other CalDAV clients.
      // RFC 4791 Section 5.1.1: OPTIONS just needs DAV + Allow headers.
      //
      if (ctx.method === 'OPTIONS') {
        ctx.status = 200;
        ctx.set('DAV', DAV_HEADER_VALUE);
        ctx.set(
          'Allow',
          'OPTIONS, GET, HEAD, POST, PUT, DELETE, PROPFIND, PROPPATCH, REPORT, MKCALENDAR'
        );
        ctx.body = '';
        return;
      }

      //
      // RFC 8607: Handle POST requests for managed attachment operations
      // (attachment-add, attachment-update, attachment-remove)
      // These must be intercepted before the caldav-adapter middleware
      // because the adapter does not handle POST method.
      //
      if (ctx.method === 'POST') {
        try {
          await this.handleManagedAttachment(ctx);
        } catch (err) {
          try {
            err.isCodeBug = isCodeBug(err);
            const errStatus = err.isBoom
              ? err.output.statusCode
              : err.status || 500;
            const safeMessage =
              err.isCodeBug || errStatus >= 500
                ? 'Internal Server Error'
                : sanitizeHtml(err.message || 'Internal Server Error', {
                    allowedTags: [],
                    allowedAttributes: {}
                  });
            ctx.logger.error('Managed attachment error', {
              err,
              method: ctx.method,
              url: ctx.url,
              status: errStatus,
              alias_id: ctx.state?.session?.user?.alias_id,
              alias_name: ctx.state?.session?.user?.alias_name,
              domain_name: ctx.state?.session?.user?.domain_name,
              user_agent: ctx.get('User-Agent'),
              content_type: ctx.get('Content-Type')
            });
            ctx.status = errStatus;
            ctx.set('Content-Type', 'application/xml; charset="utf-8"');
            if (errStatus === 401) {
              ctx.set(
                'WWW-Authenticate',
                'Basic realm="CalDAV", charset="UTF-8"'
              );
            }

            ctx.body = [
              '<?xml version="1.0" encoding="utf-8"?>',
              '<D:error xmlns:D="DAV:">',
              `  <D:status>HTTP/1.1 ${errStatus} ${safeMessage}</D:status>`,
              '</D:error>'
            ].join('\n');
          } catch (innerErr) {
            try {
              ctx.logger.fatal('POST error handler failed', {
                innerErr,
                originalErr: err
              });
            } catch {
              // Ignore logging failures
            }

            ctx.status = 500;
            ctx.set('Content-Type', 'application/xml; charset="utf-8"');
            ctx.body =
              '<?xml version="1.0" encoding="utf-8"?>\n<D:error xmlns:D="DAV:">\n  <D:status>HTTP/1.1 500 Internal Server Error</D:status>\n</D:error>';
          }
        }

        return;
      }

      //
      // RFC 8607: Handle GET requests for managed attachment retrieval.
      // When the URL contains a "managed-id" query parameter, extract
      // the base64-encoded attachment data from the ICS and return it.
      //
      if (
        ctx.method === 'GET' &&
        ctx.query &&
        ctx.query['managed-id'] &&
        ctx.path.startsWith('/dav/')
      ) {
        try {
          await this.handleAttachmentGet(ctx);
        } catch (err) {
          try {
            err.isCodeBug = isCodeBug(err);
            const errStatus = err.isBoom
              ? err.output.statusCode
              : err.status || 500;
            const safeMessage =
              err.isCodeBug || errStatus >= 500
                ? 'Internal Server Error'
                : sanitizeHtml(err.message || 'Internal Server Error', {
                    allowedTags: [],
                    allowedAttributes: {}
                  });
            ctx.logger.error('Attachment GET error', {
              err,
              url: ctx.url,
              status: errStatus,
              alias_id: ctx.state?.session?.user?.alias_id,
              alias_name: ctx.state?.session?.user?.alias_name,
              domain_name: ctx.state?.session?.user?.domain_name,
              user_agent: ctx.get('User-Agent')
            });
            ctx.status = errStatus;
            if (errStatus === 401) {
              ctx.set(
                'WWW-Authenticate',
                'Basic realm="CalDAV", charset="UTF-8"'
              );
            }

            ctx.body = safeMessage;
          } catch (innerErr) {
            try {
              ctx.logger.fatal('GET attachment error handler failed', {
                innerErr,
                originalErr: err
              });
            } catch {
              // Ignore logging failures
            }

            ctx.status = 500;
            ctx.body = 'Internal Server Error';
          }
        }

        return;
      }

      try {
        await caldavMiddleware(ctx, next);
      } catch (err) {
        //
        // Bulletproof error handler: wrap the entire catch block in its
        // own try/catch so that NO error can escape to koa-better-error-handler.
        // koa-better-error-handler converts ReferenceError/TypeError/etc. to
        // generic 500 "An internal server error occurred" in production, which
        // hides the real status code (e.g. 401) from CalDAV clients.
        //
        try {
          err.isCodeBug = isCodeBug(err);

          // Determine the appropriate HTTP status code
          const status = err.isBoom ? err.output.statusCode : err.status || 500;

          // Build a safe error message for the response
          const safeMessage =
            err.isCodeBug || status >= 500
              ? 'Internal Server Error'
              : sanitizeHtml(err.message || 'Internal Server Error', {
                  allowedTags: [],
                  allowedAttributes: {}
                });

          //
          // Enhanced error logging with full request context.
          // CalDAV 500 errors are difficult to debug without knowing
          // which calendar/event was being accessed, what the client
          // sent, and which data method failed.  This captures all
          // relevant context in a single structured log entry.
          //
          const errorContext = {
            err,
            method: ctx.method,
            url: ctx.url,
            status,
            // Calendar and event identifiers from URL params
            calendar_id: ctx.state?.params?.calendarId,
            event_id: ctx.state?.params?.eventId,
            principal_id: ctx.state?.params?.principalId,
            // User context (alias info for cross-referencing)
            alias_id: ctx.state?.session?.user?.alias_id,
            alias_name: ctx.state?.session?.user?.alias_name,
            domain_name: ctx.state?.session?.user?.domain_name,
            // Request headers that help identify the client and request type
            user_agent: ctx.get('User-Agent'),
            depth: ctx.get('Depth'),
            content_type: ctx.get('Content-Type'),
            // Request body for write operations (PUT, PROPPATCH, MKCALENDAR)
            // Truncate to 2KB to avoid bloating logs with large ICS payloads
            request_body:
              ctx.method !== 'GET' &&
              ctx.method !== 'PROPFIND' &&
              ctx.method !== 'DELETE'
                ? typeof ctx.request?.body === 'string'
                  ? ctx.request.body.slice(0, 2048)
                  : typeof ctx.request?.body === 'object'
                  ? JSON.stringify(ctx.request.body).slice(0, 2048)
                  : undefined
                : undefined
          };

          // Use fatal for 500 (server bugs), error for client errors
          if (!status || status >= 500) {
            ctx.logger.fatal(err, errorContext);
          } else {
            ctx.logger.error(err, errorContext);
          }

          // Set the response
          ctx.status = status;
          ctx.set('Content-Type', 'application/xml; charset="utf-8"');

          //
          // RFC 4918 Section 11: 401 responses MUST include a
          // WWW-Authenticate header so CalDAV clients can re-prompt
          // for credentials instead of showing a generic error.
          //
          if (status === 401) {
            ctx.set(
              'WWW-Authenticate',
              'Basic realm="CalDAV", charset="UTF-8"'
            );
          }

          ctx.body = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<D:error xmlns:D="DAV:">',
            `  <D:status>HTTP/1.1 ${status} ${safeMessage}</D:status>`,
            `  <D:description>${safeMessage}</D:description>`,
            '</D:error>'
          ].join('\n');
        } catch (innerErr) {
          // Last resort: if even the error handler fails, log it and
          // return a minimal 500 response.  This prevents the error
          // from reaching koa-better-error-handler entirely.
          try {
            ctx.logger.fatal('CalDAV error handler failed', {
              innerErr,
              originalErr: err
            });
          } catch {
            // Ignore logging failures
          }

          ctx.status = 500;
          ctx.set('Content-Type', 'application/xml; charset="utf-8"');
          ctx.body = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<D:error xmlns:D="DAV:">',
            '  <D:status>HTTP/1.1 500 Internal Server Error</D:status>',
            '  <D:description>Internal Server Error</D:description>',
            '</D:error>'
          ].join('\n');
        }
      }
    });
  }

  // send email calendar invite with ICS
  //
  //
  // NOTE: this uses `queue` as opposed to `await emailHelper`
  //       because we want the email to retry, use their DKIM keys,
  //       and we also want to use up the users email credits
  //
  // eslint-disable-next-line max-params
  async sendEmailWithICS(ctx, calendar, calendarEvent, method, oldCalStr) {
    return sendCalendarEmail(
      ctx,
      calendar,
      calendarEvent,
      method,
      oldCalStr,
      this
    );
  }

  async authenticate(ctx, { username, password, principalId }) {
    ctx.logger.debug('authenticate', { username, principalId });

    await setupAuthSession.call(this, ctx, username, password);

    // caldav related user properties
    ctx.state.user.principalId = ctx.state.user.username;
    ctx.state.user.principalName = ctx.state.user.username; // .toUpperCase()

    //
    // Ensure default calendar(s) exist.
    // This is now cached via Redis so it short-circuits on subsequent
    // requests within the cache TTL (see ensureDefaultCalendars above).
    //
    try {
      await ensureDefaultCalendars.call(this, ctx);
    } catch (err) {
      // Don't fail authentication if calendar setup fails —
      // the user can still use existing calendars.
      err.isCodeBug = isCodeBug(err);
      ctx.logger.error(err, 'Error ensuring default calendars');
    }

    //
    // Process any pending calendar invite responses from the MongoDB queue.
    // This merges Accept/Decline/Tentative responses into the user's calendar
    // (responses are queued by the web routes when attendees click response links).
    //
    // Performance: fire-and-forget — invite processing runs in the background
    // so it does NOT block the CalDAV response.  Previously this was awaited
    // inline with a 5 s pTimeout, but for users with many pending invites the
    // N+1 WSP calls in findEventByUid could still consume 3-5 s of the 30 s
    // request budget.  Worse, CalDAV clients send 5-10 requests per sync,
    // each re-triggering the same work, creating a thundering herd.
    //
    // An in-flight guard (Map keyed by alias_id) ensures only one background
    // run happens at a time per user.  A Redis negative-cache (30 s TTL)
    // skips the MongoDB query entirely when there are no pending invites.
    //
    {
      const aliasId = ctx.state.session.user.alias_id;
      const invCacheKey = `${PROCESS_INVITES_CACHE_PREFIX}${aliasId}`;
      let skipInvites = false;

      // Fast path: Redis negative-cache says "no pending invites"
      if (this.client) {
        try {
          const cached = await this.client.get(invCacheKey);
          if (cached) {
            ctx.logger.debug(
              'processCalendarInvites: skipped (negative-cached)'
            );
            skipInvites = true;
          }
        } catch (err) {
          ctx.logger.warn('processCalendarInvites: Redis cache check failed', {
            err
          });
        }
      }

      // Fast path: another request is already processing invites for this alias
      if (!skipInvites && _inviteProcessingInflight.has(aliasId)) {
        ctx.logger.debug('processCalendarInvites: skipped (already in-flight)');
        skipInvites = true;
      }

      if (!skipInvites) {
        // Mark as in-flight and fire-and-forget
        const instance = this;
        const promise = processCalendarInvites(instance, ctx)
          .then((inviteResults) => {
            if (inviteResults.processed > 0 || inviteResults.failed > 0) {
              ctx.logger.info(
                'Calendar invite processing results',
                inviteResults
              );
            }

            // Cache "empty" state so next request skips MongoDB
            if (
              inviteResults.processed === 0 &&
              inviteResults.failed === 0 &&
              instance.client
            ) {
              instance.client
                .set(invCacheKey, '1', 'PX', PROCESS_INVITES_CACHE_TTL)
                .catch((err) => {
                  ctx.logger.warn(
                    'processCalendarInvites: Redis cache set failed',
                    { err }
                  );
                });
            }
          })
          .catch((err) => {
            ctx.logger.error(err, 'Error processing calendar invites');
          })
          .finally(() => {
            _inviteProcessingInflight.delete(aliasId);
          });

        _inviteProcessingInflight.set(aliasId, promise);
      }
    }

    return ctx.state.user;
  }

  //
  // NOTE: Apple iOS/macOS implementation of CalDAV is different than almost all others
  //       (it has static variable calendar names that are rendered on the device)
  //
  //       DEFAULT_CALENDAR_NAME -> Calendar
  //       DEFAULT_TASK_CALENDAR_NAME -> Reminders
  //       <https://github.com/Legoless/iOS-Localization/blob/6ebb778b9e4691ec1a03cffbbe7036399936c437/7.0.4/iPhone/System/Library/Frameworks/EventKit.framework/English.lproj/Localizable.strings.xml#L37-L38>
  //
  //       this means that if the iOS version doesn't match to desktop macOS version
  //       then the macOS version will render the string as "DEFAULT_TASK_CALENDAR_NAME" which is not user-friendly
  //       (and will be that way until the user updates their macOS to the latest version that is in sync with iOS localized strings)
  //
  //       basically the client informs the server of a given UUID generated
  //       and the server is responsible for storing the mapping of client UUID's to calendars stored on server
  //       <https://stackoverflow.com/a/25605154>
  //
  //       iOS and macOS devices will attempt to MKCALENDAR on DEFAULT_TASK_CALENDAR_NAME on refresh
  //
  //       > iCal abuses MKCALENDAR since iCal 10.9.2 to create server-stored subscriptions
  //         <https://github.com/sabre-io/dav/blob/58be83aae10a244372f113b63624c48034378094/lib/CalDAV/Plugin.php#L294-L296>
  //
  //       the fennel project simply does a findOrCreate
  //       <https://github.com/LordEidi/fennel.js/blob/abfc371701fcb2581d8f1382426f0ef9e9846554/handler/calendar.js#L982>
  //       (but note they don't do any normalization)
  //

  async createCalendar(ctx, { name, description, timezone, color, order }) {
    ctx.logger.debug('createCalendar', {
      name,
      description,
      timezone,
      principalId: ctx.state.params?.principalId,
      calendarId: ctx.state.params?.calendarId
    });

    // if calendar already exists with calendarId value then return 405
    // <https://github.com/sabre-io/dav/blob/da8c1f226f1c053849540a189262274ef6809d1c/tests/Sabre/CalDAV/PluginTest.php#L289>
    let calendar = await this.getCalendar(ctx, {
      calendarId: ctx.state.params.calendarId
    });

    if (calendar) return calendar; // return early

    //
    // TODO: if not MKCOL or resource detected (MKCALENDAR subscription)
    //       then create calendar regardless (?)

    //
    // iOS string mapping for localization:
    //
    // DEFAULT_CALENDAR_NAME <-> Calendar (and we also added "Events" and "Default" to the list)
    // DEFAULT_TASK_CALENDAR_NAME <-> Reminders
    //
    if (['DEFAULT_CALENDAR_NAME', 'DEFAULT_TASK_CALENDAR_NAME'].includes(name))
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name
      });

    if (calendar) return calendar; // return early

    // "Calendar" variant (handled below in I18N_SET_DEFAULT_CALENDAR_NAME case)
    if (I18N_SET_CALENDAR.has(name))
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name // exact match
      });

    if (calendar) return calendar; // return early

    //
    // "Calendar", "Events", "Default" variants map to "DEFAULT_CALENDAR_NAME"
    // + localized variants
    //
    if (I18N_SET_DEFAULT_CALENDAR_NAME.has(name)) {
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name // exact match
      });
      if (calendar) return calendar; // return early
      // fallback to look up by localized name
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name: { $in: [...I18N_SET_DEFAULT_CALENDAR_NAME] }
      });
      if (calendar) return calendar; // return early
      // Apple variant
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name: 'DEFAULT_CALENDAR_NAME'
      });
      if (calendar) return calendar; // return early
    }

    // Reminders -> DEFAULT_TASK_CALENDAR_NAME + localized variants
    if (I18N_SET_REMINDERS.has(name)) {
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name
      });
      if (calendar) return calendar; // return early
      // fallback to look up by localized name
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name: { $in: [...I18N_SET_REMINDERS] }
      });
      if (calendar) return calendar; // return early
      // Apple variant
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name: 'DEFAULT_TASK_CALENDAR_NAME'
      });
      if (calendar) return calendar; // return early
    }

    // "Appointments" localized variant
    if (I18N_SET_APPOINTMENTS.has(name)) {
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name
      });
      if (calendar) return calendar; // return early
      // fallback to look up by localized name
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name: { $in: [...I18N_SET_APPOINTMENTS] }
      });
      if (calendar) return calendar; // return early
    }

    // "Tasks" localized variant
    if (I18N_SET_TASKS.has(name)) {
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name
      });
      if (calendar) return calendar; // return early
      // fallback to look up by localized name
      calendar = await Calendars.findOne(this, ctx.state.session, {
        name: { $in: [...I18N_SET_TASKS] }
      });
      if (calendar) return calendar; // return early
    }

    //
    // > iCal abuses MKCALENDAR since iCal 10.9.2 to create server-stored subscriptions
    //   <https://github.com/sabre-io/dav/blob/58be83aae10a244372f113b63624c48034378094/lib/CalDAV/Plugin.php#L294-L296>
    //
    // Basically in 10.9.2 it uses MKCALENDAR instead of MKCOL in order to get a server-stored subscription
    // <https://sabre.io/dav/clients/ical/#:~:text=In%20OS%20X%2010.9.2%20they%20changed%20to%20using%20MKCALENDAR%20instead.%20We%20suspect%20that%20this%20is%20a%20bug%2C%20but%20we%27re%20adding%20support%20for%20it%20in%20sabre/dav%20nonetheless>
    //
    // Otherwise we'd do something like this above everywhere:
    // if (calendar)
    //   throw Boom.methodNotAllowed(
    //     ctx.translateError('CALENDAR_ALREADY_EXISTS')
    //   );
    //
    if (calendar) return calendar; // safeguard

    // All calendars support both events and tasks (unified calendar approach)
    // This ensures compatibility across all CalDAV clients (Apple, Thunderbird, etc.)
    // and aligns with the default calendar creation behavior (see ensureDefaultCalendars)
    const created = await Calendars.create({
      // db virtual helper
      instance: this,
      session: ctx.state.session,

      // calendarId
      calendarId: ctx.state.params.calendarId || name || randomUUID(), // TODO: "name" should be removed (?)

      // calendar obj
      name,
      description,
      color: color || falso.randHex(),
      order,
      prodId: `//forwardemail.net//caldav//${ctx.locale.toUpperCase()}`,
      timezone: timezone || ctx.state.session.user.timezone,
      url: config.urls.web,
      readonly: false,
      synctoken: `${config.urls.web}/ns/sync-token/1`,
      has_vevent: true, // Support both events and tasks
      has_vtodo: true
    });

    // send websocket push notification
    sendWebSocketNotification(
      this.client,
      ctx.state.user.alias_id,
      'calendarCreated',
      {
        calendar: {
          id: created._id.toString(),
          calendarId: created.calendarId,
          name: created.name,
          description: created.description || '',
          color: created.color || '',
          order: created.order || 0,
          timezone: created.timezone || '',
          readonly: Boolean(created.readonly),
          synctoken: created.synctoken || '',
          object: 'calendar'
        }
      }
    );

    return created;
  }

  // https://caldav.forwardemail.net/dav/support@forwardemail.net/default
  async getCalendar(ctx, { calendarId, principalId, _user }) {
    ctx.logger.debug('getCalendar', { calendarId, principalId });

    //
    // Performance: the caldav-adapter routing layer already fetches the
    // calendar and stores it on ctx.state.calendar.  Re-use it when the
    // requested calendarId matches, avoiding a redundant SQLite round-trip.
    //
    if (ctx.state.calendar && calendarId) {
      const cached = ctx.state.calendar;
      if (
        (cached.calendarId && cached.calendarId === calendarId) ||
        (cached._id && cached._id.toString() === calendarId)
      ) {
        ctx.logger.debug('getCalendar result (cached)', {
          calendarId: cached._id
        });
        return cached;
      }
    }

    let calendar;

    if (calendarId) {
      if (mongoose.isObjectIdOrHexString(calendarId))
        calendar = await Calendars.findOne(this, ctx.state.session, {
          _id: new mongoose.Types.ObjectId(calendarId)
        });

      if (!calendar)
        calendar = await Calendars.findOne(this, ctx.state.session, {
          calendarId
        });
    }

    ctx.logger.debug('getCalendar result', { calendarId: calendar?._id });

    return calendar;
  }

  //
  // NOTE: we have added updateCalendar support
  // <https://github.com/sedenardi/node-caldav-adapter/blob/bdfbe17931bf14a1803da77dbb70509db9332695/example/server.js#L33>
  // <https://github.com/sedenardi/node-caldav-adapter/blob/bdfbe17931bf14a1803da77dbb70509db9332695/example/data.js#L111-L120>
  //
  async updateCalendar(ctx, { principalId, calendarId, user, updates }) {
    ctx.logger.debug('updateCalendar', { principalId, calendarId });

    //
    // if `updates` is specified then this is a PROPPATCH request with XML
    //
    if (updates) {
      let calendar = await this.getCalendar(ctx, {
        calendarId,
        principalId,
        user
      });

      if (!calendar)
        throw Boom.methodNotAllowed(
          ctx.translateError('CALENDAR_DOES_NOT_EXIST')
        );

      //
      // Sanitize updates to handle empty values appropriately
      // Per RFC 4918, setting a property to empty value is valid,
      // but we need to handle required fields gracefully
      //
      const sanitizedUpdates = {};

      // Handle name/displayname (required field)
      if (
        'name' in updates && // Don't update required fields with empty values
        updates.name !== ''
      ) {
        sanitizedUpdates.name = updates.name;
      }

      // Handle xml:lang for name (RFC 4791 Section 5.2.1)
      if ('nameXmlLang' in updates) {
        sanitizedUpdates.nameXmlLang = updates.nameXmlLang;
      }

      // Handle description (can be empty to clear it)
      if ('description' in updates) {
        sanitizedUpdates.description = updates.description;
      }

      // Handle xml:lang for description (RFC 4791 Section 5.2.1)
      if ('descriptionXmlLang' in updates) {
        sanitizedUpdates.descriptionXmlLang = updates.descriptionXmlLang;
      }

      // Handle timezone (required field)
      if (
        'timezone' in updates && // Don't update with empty value
        updates.timezone !== ''
      ) {
        sanitizedUpdates.timezone = updates.timezone;
      }

      // Handle color (required field with default)
      if ('color' in updates) {
        // Use default color if empty
        sanitizedUpdates.color =
          updates.color === '' ? '#0066ff' : updates.color;
      }

      // Handle order (required field with default)
      if ('order' in updates) {
        // Use 0 for order if null/empty
        sanitizedUpdates.order =
          updates.order === null || updates.order === undefined
            ? 0
            : updates.order;
      }

      calendar = await Calendars.findByIdAndUpdate(
        this,
        ctx.state.session,
        calendar._id,
        {
          $set: sanitizedUpdates
        }
      );

      // send websocket push notification
      sendWebSocketNotification(
        this.client,
        ctx.state.user.alias_id,
        'calendarUpdated',
        {
          calendar: {
            id: calendar._id.toString(),
            calendarId,
            name: calendar.name,
            description: calendar.description || '',
            color: calendar.color || '',
            order: calendar.order || 0,
            timezone: calendar.timezone || '',
            readonly: Boolean(calendar.readonly),
            synctoken: calendar.synctoken || '',
            object: 'calendar'
          }
        }
      );

      // return early
      return calendar;
    }

    //
    // 1) parse `ctx.request.body` for VCALENDAR and all VEVENT's
    // 2) update the calendar metadata based off VCALENDAR
    // 3) update existing VEVENTS by uid match
    // 4) create new VEVENTS for those that did not have uid match
    //
    let err;
    try {
      // parse `ctx.request.body` for VCALENDAR and all VEVENT's
      const comp = new ICAL.Component(ICAL.parse(ctx.request.body));
      if (!comp) throw new TypeError('Component not parsed');

      const vevents = comp.getAllSubcomponents('vevent');
      ctx.logger.debug('vevents found', { count: vevents.length });

      // update the calendar metadata based off VCALENDAR
      const x = [];
      for (const prop of comp.getAllProperties()) {
        // <https://github.com/kewisch/ical.js/blob/main/lib/ical/property.js>
        // prop.name = "x-wr-calname"
        // X-WR-CALNAME:Calendar
        // if character after name is ":" then +1 otherwise include it
        // (or could we just do `getValues()` and it would set it properly?)
        // prop.toICALString()
        if (!prop.name.startsWith('x-')) continue;
        x.push({
          key: prop.name.toUpperCase(),
          value: prop.getValues()
        });
      }

      let calendar = await this.getCalendar(ctx, {
        calendarId,
        principalId,
        user
      });

      if (!calendar)
        throw Boom.methodNotAllowed(
          ctx.translateError('CALENDAR_DOES_NOT_EXIST')
        );

      const update = {
        name: comp.getFirstPropertyValue('name'),
        prodId: comp.getFirstPropertyValue('prodid'),

        // TODO: it could be HTML so this should be fixed
        description: comp.getFirstPropertyValue('description'),
        // TODO: timezone
        source: comp.getFirstPropertyValue('source'),
        url: comp.getFirstPropertyValue('url'),
        scale: comp.getFirstPropertyValue('calscale'),
        // TODO: refresh-interval -> calendar.ttl
        // NOTE: these are not being set yet
        // categories
        // refresh-interval -> calendar.ttl
        color: comp.getFirstPropertyValue('color'),
        order: Number.parseInt(comp.getFirstPropertyValue('order'), 10) || 0,
        // image
        // conference
        x,
        // TODO: this should probably only happen if the create was successful
        synctoken: bumpSyncToken(calendar.synctoken)
      };

      // Filter out undefined/null values to avoid empty UPDATE statements
      const filteredUpdate = {};
      for (const key of Object.keys(update)) {
        if (update[key] !== undefined && update[key] !== null) {
          filteredUpdate[key] = update[key];
        }
      }

      // Only update if there are actual changes
      if (Object.keys(filteredUpdate).length > 0) {
        calendar = await Calendars.findByIdAndUpdate(
          this,
          ctx.state.session,
          calendar._id,
          {
            $set: filteredUpdate
          }
        );
      }

      // create new VEVENTS
      if (vevents.length > 0) {
        const events = [];

        // we group together events by UID and build a new ICS for each
        const eventIdToEvents = {};

        // a bit of a hack but it will get us the ical string and then rebuild it together with other occurences
        for (const vevent of vevents) {
          const eventId = vevent.getFirstPropertyValue('uid');
          if (!isSANB(eventId)) continue;

          const vc = new ICAL.Component(['vcalendar', [], []]);
          vc.addSubcomponent(vevent);

          // Check if the event already exists, and if so, then simply update it.
          // Search for both eventId variants (with and without .ics) for backwards compatibility.
          const eventIdVariants = getEventIdVariants(eventId);
          let existingEvent = null;

          for (const variant of eventIdVariants) {
            existingEvent = await CalendarEvents.findOne(
              this,
              ctx.state.session,
              { eventId: variant, calendar: calendar._id }
            );
            if (existingEvent) break;
          }

          // Also check for email-based eventId with @ replaced by _
          if (!existingEvent && isEmail(eventIdVariants[0])) {
            existingEvent = await CalendarEvents.findOne(
              this,
              ctx.state.session,
              {
                eventId: eventIdVariants[0].replace('@', '_'),
                calendar: calendar._id
              }
            );
          }

          if (existingEvent) {
            existingEvent.ical = vc.toString();

            await existingEvent.save();
            continue;
          }

          if (!Array.isArray(eventIdToEvents[eventId]))
            eventIdToEvents[eventId] = [];
          eventIdToEvents[eventId].push({
            eventId,
            calendar: calendar._id,
            ical: vc.toString()
          });
        }

        for (const eventId of Object.keys(eventIdToEvents)) {
          const ical = await this.buildICS(
            ctx,
            eventIdToEvents[eventId],
            calendar
          );
          events.push({
            // db virtual helper
            instance: this,
            session: ctx.state.session,

            // event obj
            eventId,
            calendar: calendar._id,
            ical,
            // Construct href for sync-collection responses
            // This matches the CalDAV URL format: /dav/{principalId}/{calendarId}/{eventId}.ics
            href: `/dav/${principalId}/${calendarId}/${eventId}.ics`
          });
        }

        if (events.length > 0) {
          // NOTE: CalendarEvents.create() is NOT a restricted static,
          //       so it uses mongoose's default signature: create(doc) or create([docs]).
          //       Each event object already includes `instance` and `session` as virtual properties.
          const calendarEvents = await CalendarEvents.create(events);

          // already wrapped with try/catch
          await Promise.all(
            calendarEvents.map((calendarEvent) =>
              this.sendEmailWithICS(ctx, calendar, calendarEvent, 'REQUEST')
            )
          );
          ctx.logger.debug('created events', {
            count: calendarEvents.length,
            principalId,
            calendarId,
            user
          });
        }
      }

      return calendar;
    } catch (_err) {
      err = _err;
    }

    // throw error if any
    if (err) throw err;
  }

  // https://caldav.forwardemail.net/dav/support@forwardemail.net <--- both of these would do the same
  // https://caldav.forwardemail.net/dav/calendars <--- both of these would do the same
  // NOTE: in the future we could do readonly and sharing here with auth permissioning system
  async getCalendarsForPrincipal(ctx, { principalId, _user }) {
    ctx.logger.debug('getCalendarsForPrincipal', { principalId });
    return Calendars.find(this, ctx.state.session, {});
  }

  async getEventsForCalendar(
    ctx,
    {
      calendarId,
      principalId,
      user,
      fullData,
      showDeleted,
      syncToken,
      componentType
    }
  ) {
    ctx.logger.debug('getEventsForCalendar', {
      calendarId,
      principalId,
      fullData,
      syncToken,
      componentType
    });

    let calendar;
    try {
      calendar = await this.getCalendar(ctx, {
        calendarId,
        principalId,
        user
      });
    } catch (err) {
      err.isCodeBug = true;
      err.calendarId = calendarId;
      err.principalId = principalId;
      ctx.logger.fatal(err);
      throw err;
    }

    if (!calendar)
      throw Boom.methodNotAllowed(
        ctx.translateError('CALENDAR_DOES_NOT_EXIST')
      );

    //
    // RFC 6578 incremental sync: if the client supplies a sync-token
    // that matches the calendar's current token, nothing has changed
    // since the last sync — return an empty array immediately.
    //
    // This is the critical fast-path for iOS/macOS Calendar (dataaccessd)
    // which issues sync-collection on every calendar during each sync
    // cycle.  Without this, every request loads all events from the DB,
    // easily exceeding the 30 s request timeout for users with many
    // calendars.
    //
    // When the token does NOT match (or is null/empty for initial sync),
    // we fall through to the full query below per RFC 6578 Section 3.8.
    //
    if (syncToken && calendar.synctoken && syncToken === calendar.synctoken) {
      ctx.logger.debug('sync-token matches, returning empty (no changes)');
      return [];
    }

    let events;
    try {
      //
      // Performance: filter out soft-deleted events at the SQL level
      // instead of fetching all rows and filtering in JS.
      // The composite index { calendar, deleted_at } makes this efficient.
      //
      const filter = { calendar: calendar._id };
      if (!showDeleted) filter.deleted_at = { $exists: false };

      //
      // Performance: when the client specifies a component type filter
      // (e.g. VEVENT or VTODO from calendar-query comp-filter), restrict
      // the SQL query to only matching rows.  This avoids loading VTODO
      // rows when the client only wants VEVENTs and vice versa.
      //
      if (componentType) filter.componentType = componentType;

      //
      // Performance: when the client does not request calendar-data
      // (fullData === false), skip loading the large `ical` column.
      // For calendars with hundreds/thousands of events this avoids
      // transferring megabytes of ICS text from SQLite/WSP.
      //
      const projection = fullData
        ? {}
        : {
            eventId: true,
            href: true,
            deleted_at: true,
            componentType: true,
            updated_at: true,
            calendar: true,
            scheduleTag: true
          };
      events = await CalendarEvents.find(
        this,
        ctx.state.session,
        filter,
        projection
      );
    } catch (err) {
      err.isCodeBug = true;
      err.calendarId = calendarId;
      err.principalId = principalId;
      err.calendar = calendar._id;
      ctx.logger.fatal(err);
      throw err;
    }

    // Safety net: also filter in JS in case the SQL filter missed edge cases
    if (!showDeleted)
      events = events.filter(
        (e) => e.deleted_at === null || e.deleted_at === undefined
      );

    ctx.logger.debug('events found', { count: events.length });

    return events;
  }

  async getEventsByDate(
    ctx,
    { calendarId, start, end, principalId, user, fullData, componentType }
  ) {
    ctx.logger.debug('getEventsByDate', {
      calendarId,
      start,
      end,
      principalId,
      fullData,
      componentType
    });

    const calendar = await this.getCalendar(ctx, {
      calendarId,
      principalId,
      user
    });

    if (!calendar)
      throw Boom.methodNotAllowed(
        ctx.translateError('CALENDAR_DOES_NOT_EXIST')
      );

    //
    // Performance optimization: split into two queries to avoid loading
    // and parsing ICS blobs for events that can be filtered at SQL level.
    //
    // 1. Non-recurring events: filter by dtstart/dtend at SQL level
    //    (no ICS parsing needed — dates were extracted on create/update)
    // 2. Recurring events: must load ICS and expand rrule to check
    //    if any occurrence falls in the requested date range
    //
    // For calendars with 200+ events where only ~20 fall in the date
    // range, this avoids parsing ~180 ICS blobs per query.
    //
    const baseFilter = {
      calendar: calendar._id,
      deleted_at: { $exists: false }
    };
    if (componentType) baseFilter.componentType = componentType;

    //
    // Query 1: Non-recurring events with SQL-level date filtering.
    // An event overlaps the range [start, end] when:
    //   event.dtstart <= end AND event.dtend >= start
    //
    // Events without dtstart/dtend (legacy rows before schema migration)
    // are handled in Query 2 as a fallback.
    //
    //
    // Non-recurring filter: require dtstart to exist (non-null) to
    // exclude legacy pre-migration rows.  Legacy rows are handled
    // separately in Query 3 below to avoid duplicates.
    //
    const nonRecurringFilter = {
      ...baseFilter,
      is_recurring: false,
      dtstart: { $exists: true }
    };

    // Only add date constraints when the client provides them.
    // Note: dtstart already has $exists:true above; we merge the
    // $lte constraint into the same object when `end` is provided.
    if (start) nonRecurringFilter.dtend = { $gte: start };
    if (end)
      nonRecurringFilter.dtstart = { ...nonRecurringFilter.dtstart, $lte: end };

    const nonRecurringEvents = await CalendarEvents.find(
      this,
      ctx.state.session,
      nonRecurringFilter
    );

    ctx.logger.debug('non-recurring events matched at SQL level', {
      count: nonRecurringEvents.length
    });

    //
    // Query 2: Recurring events — must parse ICS and expand rrule.
    // Also catches legacy events that have is_recurring=false but
    // dtstart/dtend are null (pre-migration rows).
    //
    const recurringFilter = {
      ...baseFilter,
      is_recurring: true
    };

    const recurringEvents = await CalendarEvents.find(
      this,
      ctx.state.session,
      recurringFilter
    );

    ctx.logger.debug('recurring events to expand', {
      count: recurringEvents.length
    });

    //
    // Also query for legacy events that don't have dtstart populated
    // (created before the schema migration).  These need ICS parsing.
    //
    // NOTE: we use $exists: false to find rows where dtstart IS NULL,
    // which indicates a pre-migration event that needs ICS parsing.
    //
    const legacyFilter = {
      ...baseFilter,
      is_recurring: false,
      dtstart: { $exists: false }
    };

    const legacyEvents = await CalendarEvents.find(
      this,
      ctx.state.session,
      legacyFilter
    );

    if (legacyEvents.length > 0) {
      ctx.logger.debug('legacy events without dtstart (need ICS parsing)', {
        count: legacyEvents.length
      });
    }

    // Start with all non-recurring events that matched at SQL level
    const filtered = [...nonRecurringEvents];

    //
    // Now parse ICS only for recurring events + legacy events
    //
    // NOTE: an event can have multiple RRULE, RDATE, EXDATE values
    // NOTE: if you update this, also update the logic in /v1/calendar-events for list querying
    //
    const eventsNeedingParsing = [...recurringEvents, ...legacyEvents];
    for (const event of eventsNeedingParsing) {
      const comp = new ICAL.Component(ICAL.parse(event.ical));
      const vevents = comp.getAllSubcomponents('vevent');
      const vtodos = comp.getAllSubcomponents('vtodo');

      if (vevents.length === 0 && vtodos.length === 0) {
        const err = new TypeError('Event missing VEVENT or VTODO component');
        ctx.logger.error(err, {
          eventId: event?.eventId,
          calendarId: calendar?._id
        });
        continue;
      }

      let match = false;

      // Process VEVENT components
      for (const vevent of vevents) {
        let lines = [];
        // start = dtstart
        // end = dtend
        let dtstart = vevent.getFirstPropertyValue('dtstart');
        if (!dtstart || !(dtstart instanceof ICAL.Time)) {
          const err = new TypeError('DTSTART missing on event');
          ctx.logger.error(err, {
            eventId: event?.eventId,
            calendarId: calendar?._id
          });
          continue;
        }

        dtstart = dtstart.toJSDate();

        let dtend = vevent.getFirstPropertyValue('dtend');
        dtend = dtend && dtend instanceof ICAL.Time ? dtend.toJSDate() : null;

        for (const key of ['rrule', 'exrule', 'exdate', 'rdate']) {
          const properties = vevent.getAllProperties(key);
          for (const prop of properties) {
            lines.push(prop.toICALString());
          }
        }

        if (lines.length === 0) {
          // Non-recurring legacy event without dtstart/dtend in DB
          if (
            (!start || (dtend && start <= dtend)) &&
            (!end || (dtstart && end >= dtstart))
          ) {
            match = true;
            break;
          }

          continue;
        }

        let rruleSet;
        try {
          rruleSet = rrulestr(lines.join('\n'));
        } catch (err) {
          if (err.message.includes('Unsupported RFC prop EXDATE in EXDATE')) {
            try {
              lines = _.compact(
                lines.map((line) => {
                  if (line.includes('EXDATE')) {
                    return isValidExdate(line) ? line : null;
                  }

                  return line;
                })
              );
              rruleSet = rrulestr(lines.join('\n'));
            } catch (err) {
              // Skip events with invalid recurrence rules (e.g., malformed UNTIL values)
              ctx.logger.warn('Skipping event with invalid RRULE', {
                err,
                event: event._id,
                calendar: calendar._id
              });
              continue;
            }
          } else if (
            err.message.includes('Invalid UNTIL value') ||
            err.message.includes('Invalid RRULE') ||
            err.message.includes('Invalid DTSTART')
          ) {
            // Skip events with invalid recurrence rules (e.g., malformed UNTIL values like "--T::")
            ctx.logger.warn('Skipping event with invalid RRULE', {
              err,
              event: event._id,
              calendar: calendar._id
            });
            continue;
          } else {
            err.isCodeBug = true;
            ctx.logger.fatal(err);
            throw err;
          }
        }

        // check queried date range (if both start and end specified)
        if (start && end) {
          const dates = rruleSet.between(start, end, true);
          if (dates.length > 0) {
            match = true;
            break;
          }

          continue;
        }

        // if only start specified
        if (start) {
          const date = rruleSet.after(start, true);
          if (date) {
            match = true;
            break;
          }

          continue;
        }

        // if only end specified
        if (end) {
          const date = rruleSet.before(end, true);
          if (date) {
            match = true;
            break;
          }
        }
      }

      // Process VTODO components (tasks)
      if (!match) {
        for (const vtodo of vtodos) {
          let lines = [];
          // For tasks, we use DUE instead of DTEND, and DTSTART might not exist
          let dtstart = vtodo.getFirstPropertyValue('dtstart');
          let due = vtodo.getFirstPropertyValue('due');

          // Convert to JS dates if they exist
          dtstart =
            dtstart && dtstart instanceof ICAL.Time ? dtstart.toJSDate() : null;
          due = due && due instanceof ICAL.Time ? due.toJSDate() : null;

          // Collect recurrence rules for tasks (if any)
          for (const key of ['rrule', 'exrule', 'exdate', 'rdate']) {
            const properties = vtodo.getAllProperties(key);
            for (const prop of properties) {
              lines.push(prop.toICALString());
            }
          }

          if (lines.length === 0) {
            // Non-recurring task - check date ranges
            // For tasks, we need to be more flexible with date matching
            // VTODO can have: DTSTART+DUE, just DUE, or just DTSTART
            const taskStart = dtstart;
            const taskEnd = due || dtstart; // Use due date as end, or start if no due date

            // If we have no dates at all, skip this task
            if (!taskStart && !taskEnd) {
              continue;
            }

            // Check if the task falls within the requested time range
            // For VTODOs, we need to check both start and end dates flexibly
            const matchesStart = !start || (taskEnd && start <= taskEnd);
            const matchesEnd =
              !end ||
              (taskEnd && end >= taskEnd) ||
              (taskStart && end >= taskStart);

            if (matchesStart && matchesEnd) {
              match = true;
              break;
            }

            continue;
          }

          // Handle recurring tasks (same logic as events)
          let rruleSet;
          try {
            rruleSet = rrulestr(lines.join('\n'));
          } catch (err) {
            if (err.message.includes('Unsupported RFC prop EXDATE in EXDATE')) {
              try {
                lines = _.compact(
                  lines.map((line) => {
                    if (line.includes('EXDATE')) {
                      return isValidExdate(line) ? line : null;
                    }

                    return line;
                  })
                );
                rruleSet = rrulestr(lines.join('\n'));
              } catch (err) {
                // Skip tasks with invalid recurrence rules (e.g., malformed UNTIL values)
                ctx.logger.warn('Skipping task with invalid RRULE', {
                  err,
                  event: event._id,
                  calendar: calendar._id
                });
                continue;
              }
            } else if (
              err.message.includes('Invalid UNTIL value') ||
              err.message.includes('Invalid RRULE') ||
              err.message.includes('Invalid DTSTART')
            ) {
              // Skip tasks with invalid recurrence rules (e.g., malformed UNTIL values like "--T::")
              ctx.logger.warn('Skipping task with invalid RRULE', {
                err,
                event: event._id,
                calendar: calendar._id
              });
              continue;
            } else {
              err.isCodeBug = true;
              ctx.logger.fatal(err);
              throw err;
            }
          }

          // Check queried date range for recurring tasks
          if (start && end) {
            const dates = rruleSet.between(start, end, true);
            if (dates.length > 0) {
              match = true;
              break;
            }

            continue;
          }

          if (start) {
            const date = rruleSet.after(start, true);
            if (date) {
              match = true;
              break;
            }

            continue;
          }

          if (end) {
            const date = rruleSet.before(end, true);
            if (date) {
              match = true;
              break;
            }
          }
        }
      }

      if (match) filtered.push(event);
    }

    return filtered;
  }

  async getEvent(ctx, { eventId, principalId, calendarId, user, fullData }) {
    ctx.logger.debug('getEvent', {
      eventId,
      principalId,
      calendarId,
      fullData
    });

    const calendar = await this.getCalendar(ctx, {
      calendarId,
      principalId,
      user
    });

    if (!calendar)
      throw Boom.methodNotAllowed(
        ctx.translateError('CALENDAR_DOES_NOT_EXIST')
      );

    // Search for both eventId variants (with and without .ics) for backwards compatibility
    const eventIdVariants = getEventIdVariants(eventId);
    let event = null;

    for (const variant of eventIdVariants) {
      event = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: variant,
        calendar: calendar._id
      });
      if (event) break;
    }

    // Also check for email-based eventId with @ replaced by _
    if (!event && isEmail(eventIdVariants[0])) {
      event = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: eventIdVariants[0].replace('@', '_'),
        calendar: calendar._id
      });
    }

    return event;
  }

  // eventId: ctx.state.params.eventId,
  // principalId: ctx.state.params.principalId,
  // calendarId: ctx.state.params.calendarId,
  // user: ctx.state.user
  // NOTE: `ical` String is also ctx.request.body in this method
  async createEvent(ctx, { eventId, principalId, calendarId, user }) {
    ctx.logger.debug('createEvent', {
      eventId,
      principalId,
      calendarId
    });

    const calendar = await this.getCalendar(ctx, {
      calendarId,
      principalId,
      user
    });

    if (!calendar)
      throw Boom.methodNotAllowed(
        ctx.translateError('CALENDAR_DOES_NOT_EXIST')
      );

    // Check if calendar supports the component type being created
    const componentType = getComponentType(ctx.request.body);
    if (!componentType) {
      throw Boom.badRequest('Invalid calendar component');
    }

    if (!calendarSupportsComponent(calendar, componentType)) {
      throw Boom.methodNotAllowed(
        `Calendar does not support ${componentType} components`
      );
    }

    // Check if there is an event with same calendar ID already.
    // Search for both eventId variants (with and without .ics) for backwards compatibility.
    const eventIdVariants = getEventIdVariants(eventId);
    let exists = null;

    for (const variant of eventIdVariants) {
      exists = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: variant,
        calendar: calendar._id
      });
      if (exists) break;
    }

    if (exists)
      throw Boom.badRequest(ctx.translateError('EVENT_ALREADY_EXISTS'));

    // TODO: this should probably only happen if the create was successful
    await Calendars.findByIdAndUpdate(this, ctx.state.session, calendar._id, {
      $set: {
        synctoken: bumpSyncToken(calendar.synctoken)
      }
    });

    const calendarEvent = {
      // db virtual helper
      instance: this,
      session: ctx.state.session,

      // event obj
      eventId,
      calendar: calendar._id,
      ical: ctx.request.body,
      // Store the original request URL for sync-collection responses
      href: ctx.url
    };

    //
    // NOTE: here is Thunderbird's implementation of itip
    //       <https://github.com/mozilla/releases-comm-central/blob/0b146e856d83fc7189a6e79800871916fc00e725/calendar/base/modules/utils/calItipUtils.sys.mjs#L31>

    // TODO: ensure we have support for all these RFC's down the road
    //       <https://stackoverflow.com/a/36344164>
    //       <https://github.com/nextcloud/calendar/wiki/Developer-Resources#rfcs>

    //
    // NOTE: this is how invites get sent
    //       <https://datatracker.ietf.org/doc/html/rfc6047#section-2.5>
    //       <https://sabre.io/dav/scheduling/>
    //       <https://datatracker.ietf.org/doc/html/rfc6047>
    //
    //
    // if SCHEDULE-AGENT=CLIENT then do not send invite
    //
    // From: user1@example.com
    // To: user2@example.com
    // Subject: Phone Conference
    // Mime-Version: 1.0
    // Date: Wed, 07 May 2008 21:30:25 +0400
    // Message-ID: <4821E731.5040506@laptop1.example.com>
    // Content-Type: text/calendar; method=REQUEST; charset=UTF-8
    // Content-Transfer-Encoding: quoted-printable
    //
    // BEGIN:VCALENDAR
    // PRODID:-//Example/ExampleCalendarClient//EN
    // METHOD:REQUEST
    // VERSION:2.0
    // BEGIN:VEVENT
    // ORGANIZER:mailto:user1@example.com
    // ATTENDEE;ROLE=CHAIR;PARTSTAT=ACCEPTED:mailto:user1@example.com
    // ATTENDEE;RSVP=YES;CUTYPE=INDIVIDUAL:mailto:user2@example.com
    // DTSTAMP:20080507T170000Z
    // DTSTART:20080701T160000Z
    // DTEND:20080701T163000Z
    // SUMMARY:Phone call to discuss your last visit
    // DESCRIPTION:=D1=82=D1=8B =D0=BA=D0=B0=D0=BA - =D0=B4=D0=BE=D0=
    //  =B2=D0=BE=D0=BB=D0=B5=D0=BD =D0=BF=D0=BE=D0=B5=D0=B7=D0=B4=D0=BA=D0
    //  =BE=D0=B9?
    // UID:calsvr.example.com-8739701987387998
    // SEQUENCE:0
    // STATUS:TENTATIVE
    // END:VEVENT
    // END:VCALENDAR
    //

    //
    // NOTE: see this thread from nextcloud regarding description
    //       and the issues (and cleanup necessary) that was done to support Thunderbird and other clients
    //
    //       <https://github.com/nextcloud/calendar/issues/3863>
    //       <https://github.com/nextcloud/tasks/issues/2239>
    //       <https://github.com/nextcloud/calendar/pull/3924>
    //       <https://github.com/nextcloud/tasks/pull/2240/commits/cb87ab1b5ca3abdfa012e26fbe85827275f4cb66>
    //       <https://github.com/nextcloud/calendar/issues/3234>
    //       <https://github.com/nextcloud/server/pull/41370>
    //

    ctx.logger.debug('create calendar event', {
      eventId: calendarEvent.eventId
    });

    const eventCreated = await CalendarEvents.create(calendarEvent);

    // Fire and forget - don't block the response waiting for email to be sent
    // Use setImmediate to completely detach from the current execution context
    // The sendEmailWithICS method is already wrapped with try/catch internally
    setImmediate(() => {
      this.sendEmailWithICS(ctx, calendar, eventCreated, 'REQUEST').catch(
        (err) => {
          ctx.logger.error('sendEmailWithICS error', { err });
        }
      );
    });

    // send apple push notification for calendar sync
    sendApnCalendar(this.client, ctx.state.user.alias_id)
      .then()
      .catch((err) => ctx.logger.fatal(err));

    // send websocket push notification
    sendWebSocketNotification(
      this.client,
      ctx.state.user.alias_id,
      'calendarEventCreated',
      {
        calendarEvent: {
          id: eventCreated._id.toString(),
          eventId: eventCreated.eventId,
          calendarId,
          ical: eventCreated.ical || ctx.request.body,
          href: eventCreated.href || ctx.url,
          object: 'calendar_event'
        }
      }
    );

    return eventCreated;
  }

  // NOTE: `ical` String is also ctx.request.body in this method
  async updateEvent(ctx, { eventId, principalId, calendarId, user }) {
    //
    // TODO: caldav-adapter v7.0.0 changed in that if-none-match then it doesn't 412 anymore
    //       so we should implement this logic ourselves here, see these commits and this reference:
    //
    // if (ctx.get('if-none-match') === '*') {
    //   log.warn('if-none-match: * header present, precondition failed');
    //   ctx.status = 412;
    //   ctx.body = preconditionFail(ctx.url, 'no-uid-conflict');
    //   return;
    // }
    ctx.logger.debug('updateEvent', {
      eventId,
      principalId,
      calendarId
    });

    const calendar = await this.getCalendar(ctx, {
      calendarId,
      principalId,
      user
    });

    if (!calendar)
      throw Boom.methodNotAllowed(
        ctx.translateError('CALENDAR_DOES_NOT_EXIST')
      );

    // Check if calendar supports the component type being updated
    const componentType = getComponentType(ctx.request.body);
    if (!componentType) {
      throw Boom.badRequest('Invalid calendar component');
    }

    if (!calendarSupportsComponent(calendar, componentType)) {
      throw Boom.methodNotAllowed(
        `Calendar does not support ${componentType} components`
      );
    }

    // Search for both eventId variants (with and without .ics) for backwards compatibility
    const eventIdVariants = getEventIdVariants(eventId);
    let e = null;

    for (const variant of eventIdVariants) {
      e = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: variant,
        calendar: calendar._id
      });
      if (e) break;
    }

    // Also check for email-based eventId with @ replaced by _
    if (!e && isEmail(eventIdVariants[0])) {
      e = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: eventIdVariants[0].replace('@', '_'),
        calendar: calendar._id
      });
    }

    //
    // RFC 7232 Section 3.2: If-None-Match
    // When a client sends "If-None-Match: *", the server MUST NOT perform
    // the requested method if the target resource exists.
    // This precondition is now handled in caldav-adapter/routes/calendar/calendar/put.js
    // but we keep this check here as a safety measure for direct calls to updateEvent.
    //
    // Note: The caldav-adapter should return 412 Precondition Failed before
    // reaching this point, but if it doesn't, we log a warning.
    //
    if (ctx.get('if-none-match') === '*' && e) {
      ctx.logger.warn('If-None-Match: * received for existing event', {
        url: ctx.url,
        eventId,
        principalId,
        calendarId
      });
      // The caldav-adapter should have already returned 412, but if we get here,
      // throw a proper Boom error instead of a TypeError
      throw Boom.preconditionFailed(
        ctx.translateError('PRECONDITION_FAILED_EVENT_EXISTS')
      );
    }

    if (!e) throw Boom.badRequest(ctx.translateError('EVENT_DOES_NOT_EXIST'));

    // TODO: this should probably only happen if the save was successful
    await Calendars.findByIdAndUpdate(this, ctx.state.session, calendar._id, {
      $set: {
        synctoken: bumpSyncToken(calendar.synctoken)
      }
    });

    // db virtual helper
    e.instance = this;
    e.session = ctx.state.session;

    // so we can call `save()`
    e.isNew = false;

    const oldCalStr = String(e.ical);

    // TODO: is this not updating?
    // console.log('UPDATING BODY', ctx.request.body);

    //
    // Set href if not already set (for events created before href field was added).
    // This ensures sync-collection responses use the correct URL.
    //
    if (!e.href) {
      e.href = ctx.url;
    }

    e.ical = ctx.request.body;

    // save event
    e = await e.save();

    //
    // Determine if this is an organizer update or an attendee PARTSTAT change
    // RFC 5546: If the authenticated user is an attendee (not organizer),
    // and their PARTSTAT changed, send a REPLY to the organizer instead of REQUEST
    //
    const newComp = new ICAL.Component(ICAL.parse(e.ical));
    const newVevent = newComp.getFirstSubcomponent('vevent');
    const organizerProp = newVevent
      ? newVevent.getFirstProperty('organizer')
      : null;
    const organizerValue = organizerProp ? organizerProp.getFirstValue() : null;
    const organizerEmail = organizerValue
      ? organizerValue
          .replace(/^mailto:/i, '')
          .toLowerCase()
          .trim()
      : null;
    const isOrganizer = organizerEmail === ctx.state.user.username;

    if (!isOrganizer && organizerEmail && oldCalStr && newVevent) {
      //
      // GAP 3: Attendee-side REPLY generation
      // Uses shared helper to detect PARTSTAT changes across all VEVENTs
      // (master + overrides with RECURRENCE-ID).
      //
      const { changed, scheduleAgent } = detectAttendeePartstatChange(
        e.ical,
        oldCalStr,
        ctx.state.user.username
      );
      //
      // RFC 6638 §8.1: Schedule-Reply: F header suppresses the REPLY.
      // RFC 6638 §7.1: SCHEDULE-AGENT=CLIENT or NONE on the attendee also suppresses it.
      //
      const scheduleReplyHeader = ctx.get('schedule-reply');
      const suppressReply =
        scheduleReplyHeader === 'F' ||
        (scheduleAgent &&
          ['CLIENT', 'NONE'].includes(scheduleAgent.toUpperCase()));
      if (changed && !suppressReply) {
        setImmediate(() => {
          this.sendEmailWithICS(ctx, calendar, e, 'REPLY').catch((err) => {
            ctx.logger.error('sendEmailWithICS REPLY error', { err });
          });
        });
      }
    } else if (isOrganizer) {
      //
      // GAP 4 & 5: Organizer update - check for significant changes.
      // Uses shared helper to reset PARTSTATs and increment SEQUENCE
      // on time/recurrence changes across all VEVENTs.
      //
      if (oldCalStr) {
        const { updatedIcal, resetCount } = resetPartstatsOnSignificantChange(
          e.ical,
          oldCalStr,
          organizerEmail
        );

        if (resetCount > 0) {
          // Save the updated iCal with reset PARTSTATs
          e.ical = updatedIcal;
          e.instance = this;
          e.session = ctx.state.session;
          e.isNew = false;
          e = await e.save();
        }
      }

      // Fire and forget - send REQUEST to attendees
      setImmediate(() => {
        this.sendEmailWithICS(ctx, calendar, e, 'REQUEST', oldCalStr).catch(
          (err) => {
            ctx.logger.error('sendEmailWithICS error', { err });
          }
        );
      });
    }

    // send apple push notification for calendar sync
    sendApnCalendar(this.client, ctx.state.user.alias_id)
      .then()
      .catch((err) => ctx.logger.fatal(err));

    // send websocket push notification
    sendWebSocketNotification(
      this.client,
      ctx.state.user.alias_id,
      'calendarEventUpdated',
      {
        calendarEvent: {
          id: e._id.toString(),
          eventId,
          calendarId,
          ical: e.ical || ctx.request.body,
          href: e.href || ctx.url,
          object: 'calendar_event'
        }
      }
    );

    return e;
  }

  async deleteCalendar(ctx, { principalId, calendarId, user }) {
    // , calendar
    ctx.logger.debug('deleteCalendar', { principalId, calendarId });

    const calendar = await this.getCalendar(ctx, {
      calendarId,
      principalId,
      user
    });

    if (!calendar)
      throw Boom.methodNotAllowed(
        ctx.translateError('CALENDAR_DOES_NOT_EXIST')
      );

    //
    // email the user a backup of the calendar and its events
    // (e.g. in case user accidentally deleted it)
    //
    const calendarEvents = await CalendarEvents.find(this, ctx.state.session, {
      calendar: calendar._id
    });

    if (calendarEvents.length > 0) {
      const ics = await this.buildICS(ctx, calendarEvents, calendar);

      const [alias, domain] = await Promise.all([
        // get alias (and populate user, which is required for Emails.queue method)
        Aliases.findOne({ id: ctx.state.user.alias_id })
          .populate('user')
          .lean()
          .exec(),
        // get domain (and populate members, which is required for Emails.queue method)
        Domains.findOne({ id: ctx.state.user.domain_id })
          .populate(
            'members.user',
            `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
          )
          .lean()
          .exec()
      ]);

      await Emails.queue({
        message: {
          from: ctx.state.user.username,
          to: ctx.state.user.username,
          subject: i18n.translate(
            'CALENDAR_DELETED_BACKUP',
            ctx.locale,
            calendar.name,
            calendarEvents.length
          ),
          icalEvent: {
            filename: 'calendar.ics',
            content: ics
          }
        },
        alias,
        domain,
        user: alias ? alias.user : undefined,
        date: new Date()
      });
    }

    // delete all events for this calendar
    await CalendarEvents.deleteMany(this, ctx.state.session, {
      calendar: calendar._id
    });

    // delete the calendar itself
    await Calendars.deleteOne(this, ctx.state.session, {
      _id: calendar._id
    });

    // send websocket push notification
    sendWebSocketNotification(
      this.client,
      ctx.state.user.alias_id,
      'calendarDeleted',
      {
        calendar: {
          id: calendar._id.toString(),
          calendarId,
          name: calendar.name,
          object: 'calendar'
        }
      }
    );
  }

  async deleteEvent(ctx, { eventId, principalId, calendarId, user }) {
    // , calendar
    ctx.logger.debug('deleteEvent', { eventId, principalId, calendarId });

    const calendar = await this.getCalendar(ctx, {
      calendarId,
      principalId,
      user
    });

    if (!calendar)
      throw Boom.methodNotAllowed(
        ctx.translateError('CALENDAR_DOES_NOT_EXIST')
      );

    // Search for both eventId variants (with and without .ics) for backwards compatibility
    const eventIdVariants = getEventIdVariants(eventId);
    let event = null;

    for (const variant of eventIdVariants) {
      event = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: variant,
        calendar: calendar._id
      });
      if (event) break;
    }

    // Also check for email-based eventId with @ replaced by _
    if (!event && isEmail(eventIdVariants[0])) {
      event = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: eventIdVariants[0].replace('@', '_'),
        calendar: calendar._id
      });
    }

    if (event) {
      // TODO: this should probably only happen if the delete was successful
      await Calendars.findByIdAndUpdate(this, ctx.state.session, calendar._id, {
        $set: {
          synctoken: bumpSyncToken(calendar.synctoken)
        }
      });

      //
      // NOTE: we can't simply delete the calendar, we need to also store changes made
      //       <https://github.com/sabre-io/dav/blob/58be83aae10a244372f113b63624c48034378094/lib/CalDAV/Backend/PDO.php#L944-L958>
      //       (e.g. added, modified, and deleted are the different types of changes made)
      //
      //       then when REPORT method is invoked, e.g. for sync-collection or sync-token
      //       it will return with 404 for events deleted, etc
      //       <https://github.com/sabre-io/dav/blob/58be83aae10a244372f113b63624c48034378094/lib/DAV/Sync/Plugin.php#L166-L174>
      //
      //       <https://www.rfc-editor.org/rfc/rfc6578.html#page-14:~:text=The%20content%20of%20each%20DAV%3Aresponse%20element%20differs%20depending%20on%20how%0A%20%20%20%20%20%20the%20member%20was%20altered%3A>
      //
      //       > For members that have changed (i.e., are new or have had their
      //       mapped resource modified), the DAV:response MUST contain at
      //       least one DAV:propstat element and MUST NOT contain any
      //       DAV:status element.
      //
      //       > For members that have been removed, the DAV:response MUST
      //       contain one DAV:status with a value set to '404 Not Found' and
      //       MUST NOT contain any DAV:propstat element.
      //
      // await CalendarEvents.deleteOne(this, ctx.state.session, {
      //   _id: event._id
      // });

      //
      // Set href if not already set before marking as deleted.
      // This ensures sync-collection responses return the correct URL for
      // deleted events, matching what the client used to delete it.
      //
      const updateFields = {
        deleted_at: new Date()
      };
      if (!event.href) {
        updateFields.href = ctx.url;
      }

      await CalendarEvents.findByIdAndUpdate(
        this,
        ctx.state.session,
        event._id,
        {
          $set: updateFields
        }
      );

      //
      // Determine if the user is the organizer or an attendee
      // If organizer: send CANCEL to all attendees
      // If attendee: send DECLINED REPLY to organizer (RFC 5546 Section 3.2.3)
      //
      {
        const delComp = new ICAL.Component(ICAL.parse(event.ical));
        const delVevent = delComp.getFirstSubcomponent('vevent');
        const delOrgProp = delVevent
          ? delVevent.getFirstProperty('organizer')
          : null;
        const delOrgValue = delOrgProp ? delOrgProp.getFirstValue() : null;
        const delOrgEmail = delOrgValue
          ? delOrgValue
              .replace(/^mailto:/i, '')
              .toLowerCase()
              .trim()
          : null;
        const isDelOrganizer = delOrgEmail === ctx.state.user.username;

        if (isDelOrganizer) {
          // Organizer deleting - send CANCEL to attendees
          setImmediate(() => {
            this.sendEmailWithICS(ctx, calendar, event, 'CANCEL').catch(
              (err) => {
                ctx.logger.error('sendEmailWithICS CANCEL error', { err });
              }
            );
          });
        } else if (delOrgEmail && delVevent) {
          // Check if event is already cancelled by organizer
          // If so, don't send DECLINED reply (organizer already knows event is cancelled)
          const statusProp = delVevent.getFirstPropertyValue('status');
          if (statusProp && statusProp.toUpperCase() === 'CANCELLED') {
            ctx.logger.debug(
              'Event already cancelled, skipping DECLINED reply',
              {
                eventId: event.eventId,
                status: statusProp
              }
            );
          } else {
            // Attendee deleting - send DECLINED REPLY to organizer
            // RFC 6638 §8.1: Schedule-Reply: F header suppresses the REPLY.
            // RFC 6638 §7.1: SCHEDULE-AGENT=CLIENT or NONE also suppresses it.
            const delScheduleReplyHeader = ctx.get('schedule-reply');
            const attProps = delVevent.getAllProperties('attendee');
            let shouldSendReply = delScheduleReplyHeader !== 'F';
            for (const att of attProps) {
              const email = (att.getFirstValue() || '')
                .replace(/^mailto:/i, '')
                .toLowerCase()
                .trim();
              if (email === ctx.state.user.username) {
                const sa = att.getParameter('schedule-agent');
                if (sa && ['CLIENT', 'NONE'].includes(sa.toUpperCase())) {
                  shouldSendReply = false;
                }

                // Set PARTSTAT to DECLINED before sending
                att.setParameter('partstat', 'DECLINED');
                break;
              }
            }

            if (shouldSendReply) {
              // Update the event ical with DECLINED status for the REPLY
              const declinedEvent = {
                ...event,
                ical: delComp.toString()
              };
              setImmediate(() => {
                this.sendEmailWithICS(
                  ctx,
                  calendar,
                  declinedEvent,
                  'REPLY'
                ).catch((err) => {
                  ctx.logger.error('sendEmailWithICS REPLY error', { err });
                });
              });
            }
          }
        }
      }

      // send apple push notification for calendar sync
      sendApnCalendar(this.client, ctx.state.user.alias_id)
        .then()
        .catch((err) => ctx.logger.fatal(err));

      // send websocket push notification
      sendWebSocketNotification(
        this.client,
        ctx.state.user.alias_id,
        'calendarEventDeleted',
        {
          calendarEvent: {
            id: event._id.toString(),
            eventId: event.eventId,
            calendarId,
            ical: event.ical || '',
            object: 'calendar_event'
          }
        }
      );
    }

    return event;
  }

  //
  // NOTE: originally we used ical-generator to rebuild the ICS file
  //       however it wasn't in conformity with the RFC specification
  //       and after finding numerous issues we decided to simply re-use the existing ICS file
  //
  async buildICS(ctx, events, calendar, method = false) {
    return buildICSHelper(ctx, events, calendar, method);
  }

  //
  // RFC 8607: Managed Attachments
  // <https://www.rfc-editor.org/rfc/rfc8607.html>
  //
  // Handle POST requests for attachment-add, attachment-update, attachment-remove.
  // Attachment binary data is stored inline in the ICS as base64-encoded
  // ATTACH properties with MANAGED-ID, FMTTYPE, SIZE, FILENAME parameters.
  //
  async handleManagedAttachment(ctx) {
    //
    // 1. Authenticate the request using Basic Auth
    //
    const credentials = basicAuth(ctx.req);
    if (!credentials) throw Boom.unauthorized('Authentication required');
    await setupAuthSession.call(this, ctx, credentials.name, credentials.pass);
    // Set CalDAV-specific user properties (same as this.authenticate)
    ctx.state.user.principalId = ctx.state.user.username;
    ctx.state.user.principalName = ctx.state.user.username;
    await ensureDefaultCalendars.call(this, ctx);

    //
    // 2. Parse URL to extract principalId, calendarId, eventId
    //    URL pattern: /dav/:principalId/:calendarId/:eventId
    //
    const urlPath = ctx.path.replace(/^\/dav\//, '');
    const parts = urlPath.split('/');
    if (parts.length < 3) {
      throw Boom.badRequest(
        'Invalid CalDAV resource URL for managed attachment'
      );
    }

    const principalId = decodeURIComponent(parts[0]);
    const calendarId = decodeURIComponent(parts[1]);
    const eventId = decodeURIComponent(parts.slice(2).join('/'));

    //
    // 3. Parse query parameters
    //
    const { action } = ctx.query;
    const managedId = ctx.query['managed-id'];

    if (
      !action ||
      !['attachment-add', 'attachment-update', 'attachment-remove'].includes(
        action
      )
    ) {
      throw Boom.badRequest(
        `Invalid or missing action parameter: ${action || '(none)'}`
      );
    }

    if (
      (action === 'attachment-update' || action === 'attachment-remove') &&
      !managedId
    ) {
      throw Boom.badRequest(`managed-id parameter is required for ${action}`);
    }

    //
    // 4. Find the calendar and event
    //
    const calendar = await this.getCalendar(ctx, {
      calendarId,
      principalId,
      user: ctx.state.user
    });

    if (!calendar) {
      throw Boom.notFound('Calendar not found');
    }

    const eventIdVariants = getEventIdVariants(eventId);
    let event = null;
    for (const variant of eventIdVariants) {
      event = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: variant,
        calendar: calendar._id
      });
      if (event) break;
    }

    if (!event) {
      throw Boom.notFound('Calendar event not found');
    }

    //
    // 5. Parse the existing ICS
    //
    const parsed = ICAL.parse(event.ical);
    const comp = new ICAL.Component(parsed);
    const vevent =
      comp.getFirstSubcomponent('vevent') || comp.getFirstSubcomponent('vtodo');
    if (!vevent) {
      throw Boom.badRequest('No VEVENT or VTODO found in calendar object');
    }

    let newManagedId;

    switch (action) {
      case 'attachment-add': {
        //
        // RFC 8607 Section 3.1: Adding Attachments
        //
        const existingAttachments = vevent
          .getAllProperties('attach')
          .filter((p) => p.getParameter('managed-id'));
        if (existingAttachments.length >= MAX_ATTACHMENTS_PER_RESOURCE) {
          throw Boom.badRequest(
            `Maximum number of attachments (${MAX_ATTACHMENTS_PER_RESOURCE}) reached`
          );
        }

        // Read the raw binary body
        const chunks = [];
        for await (const chunk of ctx.req) {
          chunks.push(chunk);
        }

        const bodyBuffer = Buffer.concat(chunks);

        if (bodyBuffer.length === 0) {
          throw Boom.badRequest('Attachment body is empty');
        }

        if (bodyBuffer.length > MAX_ATTACHMENT_SIZE) {
          throw Boom.entityTooLarge(
            `Attachment exceeds maximum size of ${MAX_ATTACHMENT_SIZE} bytes`
          );
        }

        // Generate a unique MANAGED-ID
        newManagedId = randomUUID();

        // Get content type and filename from headers
        const contentType =
          ctx.get('Content-Type') || 'application/octet-stream';
        const contentDisposition = ctx.get('Content-Disposition') || '';
        const filename = parseContentDispositionFilename(contentDisposition);

        // Encode attachment data as base64
        const base64Data = bodyBuffer.toString('base64');

        // Build the ATTACH property with managed-id parameters
        const attachProp = new ICAL.Property('attach', vevent);
        attachProp.setParameter('managed-id', newManagedId);
        attachProp.setParameter('fmttype', contentType);
        attachProp.setParameter('size', String(bodyBuffer.length));
        attachProp.setParameter('filename', filename);
        attachProp.setParameter('encoding', 'BASE64');
        attachProp.resetType('binary');
        attachProp.setValue(base64Data);
        vevent.addProperty(attachProp);

        break;
      }

      case 'attachment-update': {
        //
        // RFC 8607 Section 3.2: Updating Attachments
        //
        const attachProps = vevent.getAllProperties('attach');
        const target = attachProps.find(
          (p) => p.getParameter('managed-id') === managedId
        );
        if (!target) {
          throw Boom.notFound(
            `Attachment with managed-id "${managedId}" not found`
          );
        }

        // Read the raw binary body
        const chunks = [];
        for await (const chunk of ctx.req) {
          chunks.push(chunk);
        }

        const bodyBuffer = Buffer.concat(chunks);

        if (bodyBuffer.length === 0) {
          throw Boom.badRequest('Attachment body is empty');
        }

        if (bodyBuffer.length > MAX_ATTACHMENT_SIZE) {
          throw Boom.entityTooLarge(
            `Attachment exceeds maximum size of ${MAX_ATTACHMENT_SIZE} bytes`
          );
        }

        // Generate a new MANAGED-ID for the updated attachment
        newManagedId = randomUUID();

        const contentType =
          ctx.get('Content-Type') || 'application/octet-stream';
        const contentDisposition = ctx.get('Content-Disposition') || '';
        const filename = contentDisposition
          ? parseContentDispositionFilename(contentDisposition)
          : target.getParameter('filename') || 'attachment';

        const base64Data = bodyBuffer.toString('base64');

        // Update the existing ATTACH property in-place
        target.setParameter('managed-id', newManagedId);
        target.setParameter('fmttype', contentType);
        target.setParameter('size', String(bodyBuffer.length));
        target.setParameter('filename', filename);
        target.setParameter('encoding', 'BASE64');
        target.resetType('binary');
        target.setValue(base64Data);

        break;
      }

      case 'attachment-remove': {
        //
        // RFC 8607 Section 3.3: Removing Attachments
        //
        const attachProps = vevent.getAllProperties('attach');
        const target = attachProps.find(
          (p) => p.getParameter('managed-id') === managedId
        );
        if (!target) {
          throw Boom.notFound(
            `Attachment with managed-id "${managedId}" not found`
          );
        }

        vevent.removeProperty(target);

        break;
      }
      // No default
    }

    //
    // 6. Save the updated ICS back to the event
    //
    // Post-process to quote FILENAME values containing spaces
    // (ical.js does not auto-quote parameter values per RFC 5545 Section 3.2)
    const updatedIcal = quoteICSFilenames(comp.toString());
    event.instance = this;
    event.session = ctx.state.session;
    event.isNew = false;
    event.ical = updatedIcal;
    event = await event.save();

    // Bump the calendar sync token
    await Calendars.findByIdAndUpdate(this, ctx.state.session, calendar._id, {
      $set: {
        synctoken: bumpSyncToken(calendar.synctoken)
      }
    });

    //
    // 7. Return the appropriate response per RFC 8607
    //
    if (action === 'attachment-remove') {
      // Check Prefer header for return=representation
      const prefer = ctx.get('Prefer') || '';
      if (prefer.includes('return=representation')) {
        ctx.status = 200;
        ctx.set('Content-Type', 'text/calendar; charset=utf-8');
        ctx.set('ETag', etag(event.updated_at.toISOString()));
        ctx.body = updatedIcal;
      } else {
        ctx.status = 204;
        ctx.body = '';
      }
    } else {
      // attachment-add returns 201, attachment-update returns 200
      ctx.status = action === 'attachment-add' ? 201 : 200;
      ctx.set('Cal-Managed-ID', newManagedId);
      ctx.set('ETag', etag(event.updated_at.toISOString()));

      // Return updated ICS if Prefer: return=representation
      const prefer = ctx.get('Prefer') || '';
      if (prefer.includes('return=representation')) {
        ctx.set('Content-Type', 'text/calendar; charset=utf-8');
        ctx.body = updatedIcal;
      } else {
        ctx.body = '';
      }
    }

    ctx.set('DAV', DAV_HEADER_VALUE);

    ctx.logger.info('Managed attachment operation completed', {
      action,
      managedId: newManagedId || managedId,
      eventId,
      calendarId
    });
  }

  //
  // RFC 8607: Retrieve a managed attachment by managed-id.
  // The client sends GET to the event URL with ?managed-id=XXX.
  // We extract the base64-encoded attachment from the ICS and return it.
  //
  async handleAttachmentGet(ctx) {
    //
    // 1. Authenticate
    //
    const credentials = basicAuth(ctx.req);
    if (!credentials) throw Boom.unauthorized('Authentication required');
    await setupAuthSession.call(this, ctx, credentials.name, credentials.pass);
    ctx.state.user.principalId = ctx.state.user.username;
    ctx.state.user.principalName = ctx.state.user.username;

    //
    // 2. Parse URL
    //
    const urlPath = ctx.path.replace(/^\/dav\//, '');
    const parts = urlPath.split('/');
    if (parts.length < 3) {
      throw Boom.badRequest('Invalid CalDAV resource URL');
    }

    const principalId = decodeURIComponent(parts[0]);
    const calendarId = decodeURIComponent(parts[1]);
    const eventId = decodeURIComponent(parts.slice(2).join('/'));
    const managedId = ctx.query['managed-id'];

    //
    // 3. Find the calendar and event
    //
    const calendar = await this.getCalendar(ctx, {
      calendarId,
      principalId,
      user: ctx.state.user
    });

    if (!calendar) {
      throw Boom.notFound('Calendar not found');
    }

    const eventIdVariants = getEventIdVariants(eventId);
    let event = null;
    for (const variant of eventIdVariants) {
      event = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: variant,
        calendar: calendar._id
      });
      if (event) break;
    }

    if (!event) {
      throw Boom.notFound('Calendar event not found');
    }

    //
    // 4. Parse ICS and find the attachment
    //
    const parsed = ICAL.parse(event.ical);
    const comp = new ICAL.Component(parsed);
    const vevent =
      comp.getFirstSubcomponent('vevent') || comp.getFirstSubcomponent('vtodo');
    if (!vevent) {
      throw Boom.notFound('No VEVENT or VTODO in calendar object');
    }

    const attachProps = vevent.getAllProperties('attach');
    const target = attachProps.find(
      (p) => p.getParameter('managed-id') === managedId
    );
    if (!target) {
      throw Boom.notFound(
        `Attachment with managed-id "${managedId}" not found`
      );
    }

    //
    // 5. Decode and return the attachment
    //
    const base64Value = target.getFirstValue();
    // ical.js returns a Binary object for VALUE=BINARY; extract the raw string
    const base64Str =
      typeof base64Value === 'object' && base64Value.value
        ? base64Value.value
        : String(base64Value);
    const binaryData = Buffer.from(base64Str, 'base64');
    const contentType =
      target.getParameter('fmttype') || 'application/octet-stream';
    const filename = target.getParameter('filename') || 'attachment';

    ctx.status = 200;
    ctx.set('Content-Type', contentType);
    ctx.set(
      'Content-Disposition',
      `attachment; filename="${filename.replace(/"/g, '\\"')}"`
    );
    ctx.set('Content-Length', String(binaryData.length));
    ctx.body = binaryData;
  }

  // we need to return UUID of a calendar here
  getCalendarId(ctx, calendar) {
    return uuid.validate(calendar.calendarId)
      ? calendar.calendarId
      : calendar._id.toString(); // getUuid(...)
  }

  getETag(ctx, event) {
    return etag(event.updated_at.toISOString());
  }
}

module.exports = CalDAV;
