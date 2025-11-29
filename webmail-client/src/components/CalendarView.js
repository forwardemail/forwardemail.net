import ko from 'knockout';
import { Local } from '../utils/storage';
import { Remote } from '../utils/remote';
import { db } from '../utils/db';
import { Local as LocalStore } from '../utils/storage';

// Helper to generate iCalendar (RFC 5545) format
function generateICalEvent(event) {
  const {
    summary,
    description,
    location,
    start,
    end,
    uid,
    reminder
  } = event;

  // Format dates to iCal format (YYYYMMDDTHHMMSSZ)
  const formatICalDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const dtstart = formatICalDate(start);
  const dtend = formatICalDate(end);
  const dtstamp = formatICalDate(new Date());
  const eventUid = uid || `${Date.now()}@forwardemail.net`;

  let ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ForwardEmail//Webmail//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${eventUid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${summary || 'Untitled Event'}`
  ];

  if (description) {
    // Escape special characters in description
    const escapedDesc = description.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
    ical.push(`DESCRIPTION:${escapedDesc}`);
  }

  if (location) {
    const escapedLoc = location.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
    ical.push(`LOCATION:${escapedLoc}`);
  }

  // Add alarm/reminder if specified
  if (reminder && reminder > 0) {
    ical.push(
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${summary || 'Event reminder'}`,
      `TRIGGER:-PT${reminder}M`,
      'END:VALARM'
    );
  }

  ical.push('END:VEVENT', 'END:VCALENDAR');

  return ical.join('\r\n');
}

// Helper to parse iCal data from API response
function parseICalEvent(icalString) {
  if (!icalString) return null;

  const lines = icalString.split(/\r?\n/);
  const event = {};

  for (const line of lines) {
    if (line.startsWith('UID:')) {
      event.uid = line.substring(4);
    } else if (line.startsWith('SUMMARY:')) {
      event.summary = line.substring(8);
    } else if (line.startsWith('DESCRIPTION:')) {
      event.description = line.substring(12).replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';');
    } else if (line.startsWith('LOCATION:')) {
      event.location = line.substring(9).replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';');
    } else if (line.startsWith('DTSTART:')) {
      const dateStr = line.substring(8);
      event.start = parseICalDate(dateStr);
    } else if (line.startsWith('DTEND:')) {
      const dateStr = line.substring(6);
      event.end = parseICalDate(dateStr);
    }
  }

  return event;
}

// Helper to parse iCal date format to ISO 8601
function parseICalDate(icalDate) {
  if (!icalDate) return null;
  // Format: YYYYMMDDTHHMMSSZ
  const year = icalDate.substring(0, 4);
  const month = icalDate.substring(4, 6);
  const day = icalDate.substring(6, 8);
  const hour = icalDate.substring(9, 11);
  const min = icalDate.substring(11, 13);
  const sec = icalDate.substring(13, 15);
  return `${year}-${month}-${day}T${hour}:${min}:${sec}Z`;
}

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
    // Edit event modal
    this.editEventModal = ko.observable(false);
    this.editEventId = ko.observable('');
    this.editEventTitle = ko.observable('');
    this.editEventStart = ko.observable('');
    this.editEventDuration = ko.observable(60);
    this.editEventDescription = ko.observable('');
    this.editEventNotify = ko.observable(0);
    this.editEventCalendarId = ko.observable('');
    this.showDeleteConfirm = ko.observable(false);
  }

  load = async () => {
    this.loading(true);
    this.error('');
    this.theme(LocalStore.get('theme') || 'system');
    try {
      await this.fetchCalendars();
      // Render calendar after events are loaded
      await this.renderCalendar();
    } catch (err) {
      this.error(err?.message || 'Unable to load calendar.');
    } finally {
      this.loading(false);
    }
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
        if (!this.selectedCalendar() && cached.value.length) {
          this.selectedCalendar(cached.value[0]);

          // Load cached events for instant display
          const calendarId = cached.value[0].id || cached.value[0].calendar_id || cached.value[0].uid;
          if (calendarId) {
            const cachedEvents = await db.meta.get(`calendar_events_${calendarId}`);
            if (cachedEvents?.value) {
              this.events(cachedEvents.value);
            }
          }
        }
      }

      const res = await Remote.request('Calendars', { limit: 50 });
      const list = Array.isArray(res) ? res : res?.Result || res?.calendars || [];

      // If no calendars returned, create a default one
      if (!list || list.length === 0) {
        const defaultCalendar = {
          id: 'default',
          calendar_id: 'default',
          name: 'My Calendar',
          displayName: 'My Calendar'
        };
        this.calendars([defaultCalendar]);
        this.selectedCalendar(defaultCalendar);
        await db.meta.put({ key: 'calendars', value: [defaultCalendar], updatedAt: Date.now() });
      } else {
        this.calendars(list);
        await db.meta.put({ key: 'calendars', value: list, updatedAt: Date.now() });
        if (!this.selectedCalendar() && list.length) this.selectedCalendar(list[0]);
      }

      if (this.selectedCalendar()) await this.fetchEvents(this.selectedCalendar());
    } catch (error) {
      // non-blocking: create default calendar on error
      console.warn('Calendars fetch failed:', error);
      const defaultCalendar = {
        id: 'default',
        calendar_id: 'default',
        name: 'My Calendar',
        displayName: 'My Calendar'
      };
      this.calendars([defaultCalendar]);
      this.selectedCalendar(defaultCalendar);
      this.error(error?.message || 'Unable to load calendars.');
    }
  }

  async fetchEvents(calendar) {
    if (!calendar) {
      this.events([]);
      return;
    }

    try {
      const calendarId = calendar.id || calendar.calendar_id || calendar.uid;
      if (!calendarId) {
        this.events([]);
        return;
      }

      // Fetch events for this calendar using GET /v1/calendar-events
      const res = await Remote.request('CalendarEvents', {
        calendar_id: calendarId,
        limit: 500
      });

      const list = Array.isArray(res) ? res : res?.Result || res?.events || [];

      // Map events to our internal format
      const mapped = (list || []).map((ev) => {
        // Parse iCal data if available
        let parsedEvent = {};
        if (ev.ical) {
          parsedEvent = parseICalEvent(ev.ical) || {};
        }

        return {
          id: ev.id || ev.uid || ev.event_id || parsedEvent.uid,
          title: ev.summary || parsedEvent.summary || ev.title || ev.name || 'Event',
          start: ev.start || parsedEvent.start || ev.start_date || ev.dtstart || ev.start_time,
          end: ev.end || parsedEvent.end || ev.end_date || ev.dtend || ev.end_time,
          calendarId: ev.calendar_id || calendarId,
          description: ev.description || parsedEvent.description || ev.notes || '',
          location: ev.location || parsedEvent.location || '',
          notify: ev.notify || ev.reminder || 0,
          raw: ev
        };
      });

      this.events(mapped);

      // Cache events
      await db.meta.put({
        key: `calendar_events_${calendarId}`,
        value: mapped,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.warn('Failed to fetch calendar events:', error);
      this.error(error?.message || 'Unable to load events.');
      this.events([]);
    }
  }

  async renderCalendar() {
    console.log('=== renderCalendar START ===');
    const container = document.getElementById('sx-calendar');
    if (!container) {
      console.error('Calendar container #sx-calendar not found!');
      return;
    }

    console.log('Container found:', container);
    console.log('Rendering calendar with events:', this.events());

    // Helper to format ISO dates to Schedule-X format (YYYY-MM-DD HH:mm)
    const formatForScheduleX = (isoDate) => {
      if (!isoDate) return '';
      const d = new Date(isoDate);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    // map events to schedule-x shape
    const events = this.events().map((ev) => ({
      id: ev.id || ev.uid,
      title: ev.title || ev.summary || ev.name || 'Event',
      start: formatForScheduleX(ev.start || ev.startDate || ev.start_time),
      end: formatForScheduleX(ev.end || ev.endDate || ev.end_time),
      calendarId: ev.calendarId || ev.calendar_id || 'default'
    }));

    console.log('Mapped events for calendar:', events);

    // If calendar instance already exists, update its events instead of recreating
    if (this.calendarInstance && this.calendarInstance.events) {
      console.log('Updating existing calendar instance with new events');
      try {
        // Clear existing events and add new ones
        this.calendarInstance.events.set(events);
        console.log('=== renderCalendar COMPLETE (updated) ===');
        return;
      } catch (e) {
        console.warn('Error updating calendar events, will recreate:', e);
        // Fall through to recreate
      }
    }

    // Destroy existing calendar instance if present
    if (this.calendarInstance && typeof this.calendarInstance.destroy === 'function') {
      console.log('Destroying existing calendar instance');
      try {
        this.calendarInstance.destroy();
      } catch (e) {
        console.warn('Error destroying calendar:', e);
      }
    }

    container.innerHTML = '';
    console.log('Container cleared');

    try {
      console.log('Loading Schedule-X modules...');
      // dynamic import to avoid bundling errors if package missing
      const calendarMod = await import('@schedule-x/calendar');
      await import('@schedule-x/theme-default/dist/index.css');
      const { createCalendar, viewDay, viewWeek, viewMonthGrid } = calendarMod;
      console.log('Schedule-X modules loaded successfully');

      const isDark =
        this.theme() === 'dark' ||
        (this.theme() === 'system' &&
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      console.log('Creating calendar instance with', events.length, 'events, isDark:', isDark);
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
          },
          onEventClick: (calendarEvent) => {
            this.openEditEventModal(calendarEvent);
          }
        }
      });

      console.log('Calling calendar.render()...');
      console.log('Calendar instance:', this.calendarInstance);
      this.calendarInstance.render(container);
      console.log('After render, container children:', container.children.length);
      console.log('=== renderCalendar COMPLETE ===');
    } catch (error) {
      console.error('=== Schedule X render ERROR ===', error);
      console.error('Error stack:', error.stack);
      this.error('Calendar UI unavailable (missing Schedule-X dependency).');
    }
  }

  prefillQuickEvent(email) {
    const startLocal = this.formatDateTimeLocal(new Date(Date.now() + 10 * 60 * 1000));
    this.newEventTitle(email ? `Meeting with ${email}` : 'New event');
    this.newEventStart(startLocal);
    this.newEventDuration(60);
    this.newEventDescription(email ? `Follow up with ${email}` : '');
    this.newEventNotify(0);
    this.newEventModal(true);
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
      this.toasts?.show(this.error(), 'error');
      return;
    }

    const calendar = this.selectedCalendar();
    console.log('Selected calendar:', calendar);
    console.log('All calendars:', this.calendars());

    if (!calendar) {
      this.error('No calendar selected.');
      this.toasts?.show(this.error(), 'error');
      return;
    }

    const calendarId = calendar.id || calendar.calendar_id || calendar.uid;

    console.log('Creating event for calendar ID:', calendarId);

    try {
      // Generate iCal format data
      const icalData = generateICalEvent({
        summary: title,
        description: this.newEventDescription() || '',
        location: '',
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        reminder: notify
      });

      console.log('Generated iCal data:', icalData);

      // Create event payload with iCal data
      const payload = {
        calendar_id: calendarId,
        ical: icalData
      };

      console.log('Event payload:', payload);

      // Call API to create event using POST /v1/calendar-events
      const created = await Remote.request('CalendarEventCreate', payload, {
        method: 'POST'
      });

      console.log('Created event response:', created);

      // Add created event to local list
      const newEvent = {
        id: created?.id || created?.uid || created?.event_id || `${Date.now()}`,
        title,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        calendarId,
        description: this.newEventDescription(),
        notify,
        raw: created
      };

      this.events([...this.events(), newEvent]);

      // Update cache
      await db.meta.put({
        key: `calendar_events_${calendarId}`,
        value: this.events(),
        updatedAt: Date.now()
      });

      this.error('');

      // Re-render calendar with new event
      await this.renderCalendar();

      // Close modal after successful render
      this.newEventModal(false);
      this.toasts?.show('Event created successfully', 'success');
    } catch (error) {
      console.error('Failed to create event:', error);
      this.error(error?.message || 'Unable to create event.');
      this.toasts?.show(this.error(), 'error');
    }
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

  openEditEventModal(calendarEvent) {
    // Find the full event details from our events array
    const eventId = calendarEvent.id;
    const fullEvent = this.events().find(ev => (ev.id || ev.uid) === eventId);

    if (!fullEvent) {
      console.warn('Event not found:', eventId);
      return;
    }

    // Populate edit modal fields
    this.editEventId(fullEvent.id);
    this.editEventTitle(fullEvent.title || '');
    this.editEventCalendarId(fullEvent.calendarId);

    // Convert ISO dates to datetime-local format for the input
    const startDate = new Date(fullEvent.start);
    const endDate = new Date(fullEvent.end);
    this.editEventStart(this.formatDateTimeLocal(startDate));

    // Calculate duration in minutes
    const duration = Math.round((endDate - startDate) / 60000);
    this.editEventDuration(duration || 60);

    this.editEventDescription(fullEvent.description || '');
    this.editEventNotify(fullEvent.notify || 0);

    // Open the modal
    this.editEventModal(true);
  }

  async updateEvent() {
    const id = this.editEventId();
    const title = (this.editEventTitle() || '').trim();
    const start = this.editEventStart();
    const duration = Number(this.editEventDuration()) || 60;
    const notify = Number(this.editEventNotify()) || 0;
    const calendarId = this.editEventCalendarId();

    if (!title || !start) {
      this.error('Title and start are required.');
      this.toasts?.show(this.error(), 'error');
      return;
    }

    const startDate = start ? new Date(start) : null;
    const endDate = startDate ? new Date(startDate.getTime() + duration * 60000) : null;

    try {
      // Generate iCal format data
      const icalData = generateICalEvent({
        summary: title,
        description: this.editEventDescription() || '',
        location: '',
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        uid: id,
        reminder: notify
      });

      // Update event payload with iCal data
      const payload = {
        id,
        calendar_id: calendarId,
        ical: icalData
      };

      // Call API to update event using PUT /v1/calendar-events/:id
      await Remote.request('CalendarEventUpdate', payload, {
        method: 'PUT',
        pathOverride: `/v1/calendar-events/${id}`
      });

      // Update event in local list
      const updatedEvents = this.events().map(ev => {
        if (ev.id === id) {
          return {
            ...ev,
            title,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            description: this.editEventDescription(),
            notify
          };
        }
        return ev;
      });

      this.events(updatedEvents);

      // Update cache
      await db.meta.put({
        key: `calendar_events_${calendarId}`,
        value: updatedEvents,
        updatedAt: Date.now()
      });

      this.error('');

      // Re-render calendar with updated event
      await this.renderCalendar();

      // Close modal after successful render
      this.editEventModal(false);
      this.toasts?.show('Event updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update event:', error);
      this.error(error?.message || 'Unable to update event.');
      this.toasts?.show(this.error(), 'error');
    }
  }

  promptDeleteEvent() {
    this.showDeleteConfirm(true);
  }

  cancelDeleteEvent() {
    this.showDeleteConfirm(false);
  }

  async confirmDeleteEvent() {
    this.showDeleteConfirm(false);

    const id = this.editEventId();
    const calendarId = this.editEventCalendarId();

    if (!id) {
      this.error('No event selected.');
      this.toasts?.show(this.error(), 'error');
      return;
    }

    try {
      // Call API to delete event using DELETE /v1/calendar-events/:id
      await Remote.request('CalendarEventDelete', {
        calendar_id: calendarId
      }, {
        method: 'DELETE',
        pathOverride: `/v1/calendar-events/${id}`
      });

      // Remove event from local list
      const updatedEvents = this.events().filter(ev => ev.id !== id);
      this.events(updatedEvents);

      // Update cache
      await db.meta.put({
        key: `calendar_events_${calendarId}`,
        value: updatedEvents,
        updatedAt: Date.now()
      });

      this.error('');

      // Re-render calendar with event removed
      await this.renderCalendar();

      // Close modal after successful render
      this.editEventModal(false);
      this.toasts?.show('Event deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete event:', error);
      this.error(error?.message || 'Unable to delete event.');
      this.toasts?.show(this.error(), 'error');
    }
  }

  cancelEditEvent() {
    this.showDeleteConfirm(false);
    this.editEventModal(false);
  }
}
