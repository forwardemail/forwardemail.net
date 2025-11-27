import ko from 'knockout';
import { Local } from '../utils/storage';
import { Remote } from '../utils/remote';
import { db } from '../utils/db';
import { Local as LocalStore } from '../utils/storage';

export class CalendarView {
  constructor() {
    this.loading = ko.observable(false);
    this.error = ko.observable('');
    this.email = ko.observable(Local.get('email') || '');
    this.calendars = ko.observableArray([]);
    this.selectedCalendar = ko.observable(null);
    this.events = ko.observableArray([]);
    this.calendarInstance = null;
    this.theme = ko.observable(LocalStore.get('theme') || 'system');
    this.selectedDate = ko.observable(null);
    this.newEventModal = ko.observable(false);
    this.newEventTitle = ko.observable('');
    this.newEventStart = ko.observable('');
    this.newEventDuration = ko.observable(60); // minutes
    this.newEventDescription = ko.observable('');
    this.newEventNotify = ko.observable(0);
  }

  load = () => {
    this.loading(true);
    this.error('');
    this.theme(LocalStore.get('theme') || 'system');
    this.fetchCalendars()
      .then(() => this.renderCalendar())
      .catch((err) => {
        this.error(err?.message || 'Unable to load calendar.');
      })
      .finally(() => {
        this.loading(false);
      });
  };

  signOut = () => {
    Local.clear();
    window.location.href = '/';
  };

  async fetchCalendars() {
    try {
      const cached = await db.meta.get('calendars');
      if (cached?.value) {
        this.calendars(cached.value);
        if (!this.selectedCalendar() && cached.value.length) this.selectedCalendar(cached.value[0]);
      }

      const res = await Remote.request('Calendars', { limit: 50 });
      const list = Array.isArray(res) ? res : res?.Result || res?.calendars || [];
      this.calendars(list);
      await db.meta.put({ key: 'calendars', value: list, updatedAt: Date.now() });
      if (!this.selectedCalendar() && list.length) this.selectedCalendar(list[0]);
      if (this.selectedCalendar()) await this.fetchEvents(this.selectedCalendar());
    } catch (error) {
      // non-blocking: allow empty list
      this.error(error?.message || 'Unable to load calendars.');
    }
  }

  async fetchEvents(calendar) {
    // TODO: hook real events API; for now, leave empty
    this.events([]);
  }

  async renderCalendar() {
    const container = document.getElementById('sx-calendar');
    if (!container) return;
    container.innerHTML = '';

    try {
      // dynamic import to avoid bundling errors if package missing
      const calendarMod = await import('@schedule-x/calendar');
      await import('@schedule-x/theme-default/dist/index.css');
      const { createCalendar, viewDay, viewWeek, viewMonthGrid } = calendarMod;

      // map events to schedule-x shape (stub: no events API yet)
      const events = this.events().map((ev) => ({
        id: ev.id || ev.uid,
        title: ev.title || ev.summary || ev.name || 'Event',
        start: ev.start || ev.startDate || ev.start_time || ev.start_time || ev.start,
        end: ev.end || ev.endDate || ev.end_time || ev.end || ev.start,
        calendarId: ev.calendarId || ev.calendar_id || 'default'
      }));

      const isDark =
        this.theme() === 'dark' ||
        (this.theme() === 'system' &&
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      this.calendarInstance = createCalendar({
        locale: 'en-US',
        views: [viewDay, viewWeek, viewMonthGrid],
        events,
        isDark,
        calendars: {
          default: {
            colorName: 'default',
            lightColors: {
              main: '#f9d71c',
              container: '#fff5aa',
              onContainer: '#594800'
            },
            darkColors: {
              main: '#e5e7eb',
              onContainer: '#0b1220',
              container: '#0b1220'
            }
          }
        },
        callbacks: {
          onClickDate: (date) => {
            this.selectedDate(date?.toString?.() || date);
            this.promptNewEvent(date);
          },
          onClickDateTime: (dateTime) => {
            this.selectedDate(dateTime?.toString?.() || dateTime);
            this.promptNewEvent(dateTime);
          }
        }
      });

      this.calendarInstance.render(container);
    } catch (error) {
      console.warn('Schedule X load failed', error);
      this.error('Calendar UI unavailable (missing Schedule-X dependency).');
    }
  }

  async promptNewEvent(date) {
    const dateObj = this.toDate(date);
    const startLocal = this.formatDateTimeLocal(dateObj || new Date());
    this.newEventTitle('');
    this.newEventStart(startLocal);
    this.newEventDuration(60);
    this.newEventDescription('');
    this.newEventNotify(0);
    this.newEventModal(true);
  }

  async saveNewEvent() {
    const title = (this.newEventTitle() || '').trim();
    const start = this.newEventStart();
    const duration = Number(this.newEventDuration()) || 60;
    const notify = Number(this.newEventNotify()) || 0;
    const startDate = start ? new Date(start) : null;
    const endDate = startDate ? new Date(startDate.getTime() + duration * 60000) : null;
    const end = endDate ? this.formatDateTimeLocal(endDate) : start;
    if (!title || !start) {
      this.error('Title and start are required.');
      return;
    }
    // TODO: call API to persist event
    const id = `${Date.now()}`;
    const calendarId = this.selectedCalendar()?.id || 'default';
    const updated = [
      ...this.events(),
      {
        id,
        title,
        start,
        end,
        calendarId,
        description: this.newEventDescription(),
        notify
      }
    ];
    this.events(updated);
    this.newEventModal(false);
    this.error('');
    this.renderCalendar();
  }

  toDate(input) {
    if (!input) return null;
    if (input instanceof Date) return input;
    if (typeof input === 'string') {
      const d = new Date(input);
      if (!Number.isNaN(d.getTime())) return d;
    }
    if (typeof input === 'object' && input?.toString) {
      const d = new Date(input.toString());
      if (!Number.isNaN(d.getTime())) return d;
    }
    return null;
  }

  formatDateTimeLocal(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hour}:${minute}`;
  }
}
