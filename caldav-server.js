/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

// const getUuid = require('@forwardemail/uuid-by-string');
const API = require('@ladjs/api');
const Boom = require('@hapi/boom');
const ICAL = require('ical.js');
const caldavAdapter = require('caldav-adapter');
const etag = require('etag');
const falso = require('@ngneat/falso');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const uuid = require('uuid');
const { boolean } = require('boolean');
const { rrulestr } = require('rrule');
const _ = require('#helpers/lodash');

const Aliases = require('#models/aliases');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const Domains = require('#models/domains');
const Emails = require('#models/emails');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const i18n = require('#helpers/i18n');
const isEmail = require('#helpers/is-email');
const setupAuthSession = require('#helpers/setup-auth-session');

const exdateRegex =
  /^EXDATE(?:;TZID=[\w/+=-]+|;VALUE=DATE)?:\d{8}(?:T\d{6}(?:\.\d{1,3})?Z?)?$/;

function isValidExdate(str) {
  return exdateRegex.test(str);
}

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

  const count = await Calendars.countDocuments(this, ctx.state.session, {});
  if (count > 0) return;

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

    // return early since Apple check is up next
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

  ctx.logger.debug('defaultCalendar', { defaultCalendar });
  ctx.logger.debug('defaultTaskCalendar', { defaultTaskCalendar });
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
  const parts = synctoken.split('/');
  return (
    parts.slice(0, -1).join('/') +
    '/' +
    (Number.parseInt(parts[parts.length - 1], 10) + 1)
  );
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

    this.app.use(
      caldavAdapter({
        authenticate: this.authenticate,
        authRealm: 'forwardemail/caldav',
        caldavRoot: '/',
        calendarRoot: 'dav',
        principalRoot: 'principals',
        // <https://github.com/sedenardi/node-caldav-adapter/blob/bdfbe17931bf14a1803da77dbb70509db9332695/src/koa.ts#L130-L131>
        disableWellKnown: false,
        logEnabled: !env.AXE_SILENT,
        logLevel: 'debug',
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
      })
    );
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
    try {
      let alias;
      let domain;
      try {
        [alias, domain] = await Promise.all([
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
      } catch (err) {
        // If we can't fetch alias/domain (e.g. MongoDB not available in test environment), skip sending email
        ctx.logger.debug(
          err,
          'Could not fetch alias/domain for calendar email, skipping email send'
        );
        return;
      }

      if (!alias || !domain) {
        ctx.logger.debug(
          'Alias or domain not found for calendar email, skipping email send'
        );
        return;
      }

      //
      // build ICS string so we can parse and re-render with REQUEST method
      //
      const comp = new ICAL.Component(ICAL.parse(calendarEvent.ical));
      if (!comp) throw new TypeError('Component not parsed');

      // Check if this is a VTODO (task) - tasks don't typically send email invitations
      const vtodos = comp.getAllSubcomponents('vtodo');
      if (
        vtodos.length > 0 &&
        comp.getAllSubcomponents('vevent').length === 0
      ) {
        // This is a task-only component, skip email sending
        ctx.logger.debug(
          'Skipping email for VTODO component - tasks do not send invitations'
        );
        return;
      }

      // Handle VEVENT components (calendar events)
      const vevents = comp.getAllSubcomponents('vevent');
      let vevent = vevents.find((vevent) => {
        const uid = vevent.getFirstPropertyValue('uid');
        if (uid === calendarEvent.eventId) return true;
        // if uid was an email e.g. "xyz@google.com" then
        // sometimes the calendarEvent.eventId is the same value but with "_" instead of "@" symbol
        if (isEmail(uid) && uid.replace('@', '_') === calendarEvent.eventId)
          return true;
        return false;
      });

      // TODO: we need to do the same for update event and other eventId lookups

      // fallback in case event not found yet there were events in body
      if (!vevent && vevents.length > 0) vevent = vevents[0];

      //
      // TODO: there shouldn't be more than one VEVENT with
      //       same uid but if there is we may want to cleanup in future
      //       (we have seen edge cases where this does actually happen)
      //
      if (!vevent) throw new TypeError('vevent missing');

      // if method was CANCEL then STATUS on vevent needs to be CANCELLED
      if (method === 'CANCEL')
        vevent.updatePropertyWithValue('status', 'CANCELLED');

      const event = new ICAL.Event(vevent);

      let isValid = true;

      // if X-MOZ-SEND-INVITATIONS is set then don't send invitation updates
      // (since the client will be the one sending them, or perhaps user didn't want to)
      if (vevent.getFirstPropertyValue('x-moz-send-invitations'))
        isValid = false;
      // mirror sabre/dav behavior
      //
      // must have organizer matching alias
      // and at least one attendee
      //
      else if (!event.organizer) isValid = false;
      // event.organizer = 'mailto:foo@bar.com'
      else if (
        // TODO: fallback to EMAIL param somehow here for ORGANIZER (?)
        event.organizer.replace('mailto:', '').trim().toLowerCase() !==
        ctx.state.user.username
      )
        isValid = false;

      // if attendee removed then send CANCEL to those removed
      if (oldCalStr) {
        const oldComp = new ICAL.Component(ICAL.parse(oldCalStr));
        if (!oldComp) throw new TypeError('Old component not parsed');

        // safeguard in case more than one event
        const oldEvents = oldComp.getAllSubcomponents('vevent');
        let oldEvent = oldEvents.find((vevent) => {
          const uid = vevent.getFirstPropertyValue('uid');
          if (uid === calendarEvent.eventId) return true;
          // if uid was an email e.g. "xyz@google.com" then
          // sometimes the calendarEvent.eventId is the same value but with "_" instead of "@" symbol
          if (isEmail(uid) && uid.replace('@', '_') === calendarEvent.eventId)
            return true;
          return false;
        });

        // fallback in case event not found yet there were events in body
        if (!oldEvent && oldEvents.length > 0) oldEvent = oldEvents[0];

        //
        // TODO: there shouldn't be more than one VEVENT with
        //       same uid but if there is we may want to cleanup in future
        //       (we have seen edge cases where this does actually happen)
        //
        if (!oldEvent) throw new TypeError('old vevent missing');

        const attendees = oldEvent.getAllProperties('attendee');

        if (attendees.length > 0) {
          for (const attendee of attendees) {
            let oldEmail = attendee.getFirstValue();
            if (!oldEmail || !/^mailto:/i.test(oldEmail)) {
              // fallback to EMAIL param
              oldEmail = attendee.getParameter('email');
            }

            if (!oldEmail) continue;
            oldEmail = oldEmail.replace('mailto:', '').toLowerCase().trim();
            const match = event.attendees
              ? event.attendees.find((attendee) => {
                  let address = attendee.getFirstValue();
                  if (!address || !/^mailto:/i.test(address)) {
                    // fallback to EMAIL param
                    address = attendee.getParameter('email');
                  }

                  if (!address) return;
                  address = address.replace('mailto:', '').toLowerCase().trim();
                  return address === oldEmail;
                })
              : null;

            // if there was a match found then that means the user wasn't removed
            if (match) continue;

            const commonName = attendee.getParameter('cn');

            const to = commonName ? `"${commonName}" ${oldEmail}` : oldEmail;

            //
            // here is where we send cancelled to this user (with the old event object)
            // since they were not a part of the updated event
            // (note they won't get a duplicate REQUEST email below because they're not in `event.attendees`)
            //
            try {
              const vc = new ICAL.Component(['vcalendar', [], []]);
              vc.addSubcomponent(oldEvent);

              const ics = await this.buildICS(
                ctx,
                [
                  {
                    eventId: calendarEvent.eventId,
                    calendar: calendar._id,
                    ical: vc.toString()
                  }
                ],
                calendar,
                method
              );

              await Emails.queue({
                message: {
                  from: ctx.state.user.username,
                  to,
                  bcc: ctx.state.user.username,
                  subject: `${i18n.translate(
                    'CANCELLED',
                    ctx.locale
                  )}: ${oldEvent.getFirstPropertyValue('summary')}`,
                  icalEvent: {
                    method,
                    filename: 'invite.ics',
                    content: ics
                  }
                },
                alias,
                domain,
                user: alias ? alias.user : undefined,
                date: new Date()
              });
            } catch (err) {
              ctx.logger.fatal(err);
            }
          }
        }
      }

      if (isValid) {
        const to = [];
        const organizerEmail = event.organizer
          .replace('mailto:', '')
          .trim()
          .toLowerCase();
        if (event.attendees) {
          for (const attendee of event.attendees) {
            // TODO: if SCHEDULE-AGENT=CLIENT then do not send invite (?)
            // const scheduleAgent = attendee.getParameter('schedule-agent');
            // if (scheduleAgent && scheduleAgent.toLowerCase() === 'client') continue;

            // skip attendees that were already DECLINED
            const partStat = attendee.getParameter('partstat');
            if (partStat && partStat.toLowerCase() === 'declined') continue;

            let email = attendee.getFirstValue();
            if (!email || !email.startsWith('mailto:')) {
              // fallback to EMAIL param
              email = attendee.getParameter('email');
            }

            if (!email) continue;

            email = email.replace('mailto:', '').toLowerCase().trim();

            if (!isEmail(email)) continue;

            if (email === organizerEmail) continue;

            const commonName = attendee.getParameter('cn');
            if (commonName) {
              to.push(`"${commonName}" <${email}>`);
            } else {
              to.push(email);
            }
          }
        }

        if (to.length > 0) {
          const vc = new ICAL.Component(['vcalendar', [], []]);
          vc.addSubcomponent(vevent);

          const ics = await this.buildICS(
            ctx,
            [
              {
                eventId: calendarEvent.eventId,
                calendar: calendar._id,
                ical: vc.toString()
              }
            ],
            calendar,
            method
          );

          ctx.logger.debug('ics output', ics);

          let subject =
            event.summary ||
            (event.getFirstPropertyValue &&
              event.getFirstPropertyValue('summary'));

          subject =
            method === 'CANCEL'
              ? `${i18n.translate('CANCELLED', ctx.locale)}: ${subject}`
              : `${i18n.translate('INVITATION', ctx.locale)}: ${subject}`;

          //
          // if "X-MOZ-SEND-INVITATIONS-UNDISCLOSED:TRUE" then
          // the Thunderbird checkbox was checked for
          // "Separate invitation per attendee"
          // <https://github.com/mozilla/releases-comm-central/blob/6c887d441f46c56b3e40081b69c34222b909bf78/calendar/itip/CalItipOutgoingMessage.sys.mjs#L67-L90>
          // https://github.com/mozilla/releases-comm-central/blob/0dd0febc7a7815833119eb056f8cc1acf59ddc04/calendar/base/content/item-editing/calendar-item-iframe.js#L734-L738
          //
          if (
            // NOTE: the Thunderbird interface always sets this to false/disables it when you uncheck X-MOZ-SEND-INVITATIONS
            //       so this edge case would never get reached, but we are doing it anyways as a safeguard
            vevent.getFirstPropertyValue(
              'x-moz-send-invitations-undisclosed'
            ) &&
            boolean(
              vevent.getFirstPropertyValue('x-moz-send-invitations-undisclosed')
            )
          ) {
            for (const rcpt of to) {
              try {
                await Emails.queue({
                  message: {
                    from: ctx.state.user.username,
                    to: rcpt,
                    subject,
                    icalEvent: {
                      method,
                      filename: 'invite.ics',
                      content: ics
                    }
                  },
                  alias,
                  domain,
                  user: alias ? alias.user : undefined,
                  date: new Date()
                });
              } catch (err) {
                ctx.logger.fatal(err);
              }
            }
          } else {
            await Emails.queue({
              message: {
                from: ctx.state.user.username,
                to,
                subject,
                icalEvent: {
                  method,
                  filename: 'invite.ics',
                  content: ics
                }
              },
              alias,
              domain,
              user: alias ? alias.user : undefined,
              date: new Date()
            });
          }
        }
      }
    } catch (err) {
      // temp debugging
      err.isCodeBug = true;
      err.calendar = calendar;
      err.oldCalStr = oldCalStr;
      err.calendarEvent = calendarEvent;
      ctx.logger.fatal(err);
    }
  }

  async authenticate(ctx, { username, password, principalId }) {
    ctx.logger.debug('authenticate', { username, password, principalId });

    await setupAuthSession.call(this, ctx, username, password);

    // caldav related user properties
    ctx.state.user.principalId = ctx.state.user.username;
    ctx.state.user.principalName = ctx.state.user.username; // .toUpperCase()

    //
    // TODO: we may want to run this in background
    //       or alternatively only run it once every X amount of time
    //
    // ensure default calendar(s) exist
    await ensureDefaultCalendars.call(this, ctx);
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
      params: ctx.state.params
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
    return Calendars.create({
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
  }

  // https://caldav.forwardemail.net/dav/support@forwardemail.net/default
  async getCalendar(ctx, { calendarId, principalId, user }) {
    ctx.logger.debug('getCalendar', {
      calendarId,
      principalId,
      user,
      request: ctx.request
    });

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

    ctx.logger.debug('getCalendar result', { calendar });

    return calendar;
  }

  //
  // NOTE: we have added updateCalendar support
  // <https://github.com/sedenardi/node-caldav-adapter/blob/bdfbe17931bf14a1803da77dbb70509db9332695/example/server.js#L33>
  // <https://github.com/sedenardi/node-caldav-adapter/blob/bdfbe17931bf14a1803da77dbb70509db9332695/example/data.js#L111-L120>
  //
  async updateCalendar(ctx, { principalId, calendarId, user, updates }) {
    ctx.logger.debug('updateCalendar', {
      principalId,
      calendarId,
      user,
      updates
    });

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

      calendar = await Calendars.findByIdAndUpdate(
        this,
        ctx.state.session,
        calendar._id,
        {
          $set: updates
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
      ctx.logger.debug('vevents', { vevents });

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

          // check if the event already exists, and if so, then simply update it

          let existingEvent = await CalendarEvents.findOne(
            this,
            ctx.state.session,
            { eventId, calendar: calendar._id }
          );

          // if uid was an email e.g. "xyz@google.com" then
          // sometimes the calendarEvent.eventId is the same value but with "_" instead of "@" symbol
          if (!existingEvent && isEmail(eventId)) {
            existingEvent = await CalendarEvents.findOne(
              this,
              ctx.state.session,
              {
                eventId: eventId.replace('@', '_'),
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
            ical
          });
        }

        if (events.length > 0) {
          // TODO: is this wrong?
          const calendarEvents = await CalendarEvents.create(
            this,
            ctx.state.session,
            events
          );

          // already wrapped with try/catch
          await Promise.all(
            calendarEvents.map((calendarEvent) =>
              this.sendEmailWithICS(ctx, calendar, calendarEvent, 'REQUEST')
            )
          );
          ctx.logger.debug('created events', {
            calendarEvents,
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
  async getCalendarsForPrincipal(ctx, { principalId, user }) {
    ctx.logger.debug('getCalendarsForPrincipal', { principalId, user });
    return Calendars.find(this, ctx.state.session, {});
  }

  async getEventsForCalendar(
    ctx,
    { calendarId, principalId, user, fullData, showDeleted }
  ) {
    ctx.logger.debug('getEventsForCalendar', {
      calendarId,
      principalId,
      user,
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

    let events = await CalendarEvents.find(this, ctx.state.session, {
      calendar: calendar._id
    });

    // TODO: improve this with search directly on sql
    if (!showDeleted) events = events.filter((e) => !_.isDate(e.deleted_at));

    ctx.logger.debug('events', { events });

    return events;
  }

  async getEventsByDate(
    ctx,
    { calendarId, start, end, principalId, user, fullData }
  ) {
    ctx.logger.debug('getEventsByDate', {
      calendarId,
      start,
      end,
      principalId,
      user,
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

    // TODO: incorporate database date query instead of this in-memory filtering
    // TODO: we could do partial query for not recurring and b/w and then has recurring and after
    const events = await CalendarEvents.find(this, ctx.state.session, {
      calendar: calendar._id
    });

    const filtered = [];

    //
    // NOTE: an event can have multiple RRULE, RDATE, EXDATE values
    // NOTE: if you update this, also update the logic in /v1/calendar-events for list querying
    // NOTE: if you update this, also update the logic in /v1/calendar-events for list querying
    // NOTE: if you update this, also update the logic in /v1/calendar-events for list querying
    //
    for (const event of events) {
      const comp = new ICAL.Component(ICAL.parse(event.ical));
      const vevents = comp.getAllSubcomponents('vevent');
      const vtodos = comp.getAllSubcomponents('vtodo');

      if (vevents.length === 0 && vtodos.length === 0) {
        const err = new TypeError('Event missing VEVENT or VTODO component');
        ctx.logger.error(err, { event, calendar });
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
          ctx.logger.error(err, { event, calendar });
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
              err.isCodeBug = true;
              ctx.logger.fatal(err);
              throw err;
            }
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
                err.isCodeBug = true;
                ctx.logger.fatal(err);
                throw err;
              }
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
      user,
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

    let event = await CalendarEvents.findOne(this, ctx.state.session, {
      eventId,
      calendar: calendar._id
    });

    // if uid was an email e.g. "xyz@google.com" then
    // sometimes the calendarEvent.eventId is the same value but with "_" instead of "@" symbol
    if (!event && isEmail(eventId)) {
      event = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: eventId.replace('@', '_'),
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
      calendarId,
      user
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

    // check if there is an event with same calendar ID already
    const exists = await CalendarEvents.findOne(this, ctx.state.session, {
      eventId,
      calendar: calendar._id
    });

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
      ical: ctx.request.body
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

    ctx.logger.debug('create calendar event', { calendarEvent });

    const eventCreated = await CalendarEvents.create(calendarEvent);

    // already wrapped with try/catch
    await this.sendEmailWithICS(ctx, calendar, eventCreated, 'REQUEST');

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
      calendarId,
      user
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

    let e = await CalendarEvents.findOne(this, ctx.state.session, {
      eventId,
      calendar: calendar._id
    });

    // if uid was an email e.g. "xyz@google.com" then
    // sometimes the calendarEvent.eventId is the same value but with "_" instead of "@" symbol
    if (!e && isEmail(eventId)) {
      e = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: eventId.replace('@', '_'),
        calendar: calendar._id
      });
    }

    //
    // NOTE: temporary logging to investigate pre-condition issue
    //
    if (ctx.get('if-none-match') === '*') {
      const err = new TypeError('If none-match precondition issue');
      err.data = JSON.stringify(
        {
          url: ctx.url,
          headers: ctx.headers,
          eventId,
          principalId,
          calendarId,
          username: ctx.state.user.username,
          existingBody: e ? e.ical : false,
          newBody: ctx.request.body
        },
        null,
        2
      );
      err.isCodeBug = true;
      ctx.logger.fatal(err);
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
    e.ical = ctx.request.body;

    // save event
    e = await e.save();

    // already wrapped with try/catch
    await this.sendEmailWithICS(ctx, calendar, e, 'REQUEST', oldCalStr);

    return e;
  }

  async deleteCalendar(ctx, { principalId, calendarId, user }) {
    // , calendar
    ctx.logger.debug('deleteCalendar', { principalId, calendarId, user });

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
  }

  async deleteEvent(ctx, { eventId, principalId, calendarId, user }) {
    // , calendar
    ctx.logger.debug('deleteEvent', { eventId, principalId, calendarId, user });

    const calendar = await this.getCalendar(ctx, {
      calendarId,
      principalId,
      user
    });

    if (!calendar)
      throw Boom.methodNotAllowed(
        ctx.translateError('CALENDAR_DOES_NOT_EXIST')
      );

    let event = await CalendarEvents.findOne(this, ctx.state.session, {
      eventId,
      calendar: calendar._id
    });

    // if uid was an email e.g. "xyz@google.com" then
    // sometimes the calendarEvent.eventId is the same value but with "_" instead of "@" symbol
    if (!event && isEmail(eventId)) {
      event = await CalendarEvents.findOne(this, ctx.state.session, {
        eventId: eventId.replace('@', '_'),
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
      await CalendarEvents.findByIdAndUpdate(
        this,
        ctx.state.session,
        event._id,
        {
          $set: {
            deleted_at: new Date()
          }
        }
      );

      // already wrapped with try/catch
      await this.sendEmailWithICS(ctx, calendar, event, 'CANCEL');
    }

    return event;
  }

  //
  // NOTE: originally we used ical-generator to rebuild the ICS file
  //       however it wasn't in conformity with the RFC specification
  //       and after finding numerous issues we decided to simply re-use the existing ICS file
  //
  async buildICS(ctx, events, calendar, method = false) {
    ctx.logger.debug('buildICS', { events, calendar });
    if (!events || Array.isArray(events)) {
      // <https://github.com/kewisch/ical.js/wiki/Creating-basic-iCalendar>
      const comp = new ICAL.Component(['vcalendar', [], []]);

      comp.updatePropertyWithValue('version', '2.0');

      // used for invites, cancelled events, and replies
      if (method) {
        if (!['REQUEST', 'REPLY', 'CANCEL'].includes(method))
          throw new TypeError(
            'Method must be either REQUEST, REPLY, or CANCEL'
          );
        comp.updatePropertyWithValue('method', method);
      }

      //
      // NOTE: these are required fields
      //

      // uid -> calendar.calendarId
      // (this matches `getCalendarId` logic)
      if (uuid.validate(calendar.calendarId))
        comp.updatePropertyWithValue('uid', calendar.calendarId);
      else comp.updatePropertyWithValue('uid', calendar._id.toString());

      // name -> calendar.name
      comp.updatePropertyWithValue('name', calendar.name);

      // NOTE: we don't set `calendar.timezone` here since we don't need VTIMEZONE in VCALENDAR
      // <https://github.com/kewisch/ical.js/blob/3754b8332802bca0163dcaa432fa34c2ce487772/samples/daily_recur.ics#L6-L24>
      // - X-WR-CALNAME:Calendar
      // - X-WR-TIMEZONE:America/Chicago

      // prodid
      if (calendar.prodId)
        comp.updatePropertyWithValue('prodid', calendar.prodId);

      // description
      if (calendar.description)
        comp.updatePropertyWithValue('description', calendar.description);

      // created -> calendar.created_at
      // comp.updatePropertyWithValue(
      //   'created',
      //   ICAL.Time.fromJSDate(calendar.created_at, true)
      // );

      // last-modified -> calendar.updated_at
      // comp.updatePropertyWithValue(
      //   'last-modified',
      //   ICAL.Time.fromJSDate(calendar.updated_at, true)
      // );

      // calscale -> calendar.scale
      if (calendar.scale)
        comp.updatePropertyWithValue('calscale', calendar.scale);

      // url
      if (calendar.url) comp.updatePropertyWithValue('url', calendar.url);

      // source
      if (calendar.source)
        comp.updatePropertyWithValue('source', calendar.source);

      // NOTE: these are not being set yet
      // categories
      // refresh-interval -> calendar.ttl
      // image
      // conference

      // X-Meta-Data
      if (Array.isArray(calendar.x) && calendar.x.length > 0) {
        for (const xData of calendar.x) {
          comp.updatePropertyWithValue(xData.key.toUpperCase(), xData.value);
        }
      }

      // add all VEVENTS and VTODOS
      for (const event of events) {
        const eventComp = new ICAL.Component(ICAL.parse(event.ical));
        const vevents = eventComp.getAllSubcomponents('vevent');
        const vtodos = eventComp.getAllSubcomponents('vtodo');

        // Process VEVENT components
        for (const vevent of vevents) {
          //
          // NOTE: until this issue is resolved we have to manually remove these lines
          //       <https://github.com/mozilla/releases-comm-central/issues/94>
          //
          vevent.removeAllProperties('X-MOZ-LASTACK');
          vevent.removeAllProperties('X-MOZ-GENERATION');

          // add to main calendar
          comp.addSubcomponent(vevent);
        }

        // Process VTODO components
        for (const vtodo of vtodos) {
          //
          // NOTE: clean up Mozilla-specific properties for tasks too
          //
          vtodo.removeAllProperties('X-MOZ-LASTACK');
          vtodo.removeAllProperties('X-MOZ-GENERATION');

          // add to main calendar
          comp.addSubcomponent(vtodo);
        }
      }

      return comp.toString();
    }

    // events = single event if not an Array
    return events.ical;
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
