<template>
  <div class="fe-mailbox-wrapper">
    <div class="fe-mailbox-header">
      <button class="fe-button ghost fe-icon-btn" type="button" aria-label="Back" title="Back" @click="navigate('/mailbox')">←</button>
      <div class="fe-title-left">
        <h1>Calendar</h1>
        <span>{{ email }}</span>
      </div>
    </div>

    <div class="fe-calendar-shell">
      <div class="fe-section-header">
        <span>Schedule</span>
      </div>
      <div id="sx-calendar" style="min-height: calc(100vh - 140px);"></div>
    </div>

    <!-- Event Modal -->
    <div v-if="showEventModal" class="fe-modal-backdrop" @click="closeEventModal">
      <div class="fe-modal" @click.stop>
        <div class="fe-modal-header">
          <h2>{{ editingEvent ? 'Edit Event' : 'New Event' }}</h2>
          <button class="fe-button ghost" type="button" @click="closeEventModal">Close</button>
        </div>
        <div class="fe-modal-body">
          <div class="fe-form-group">
            <label for="event-title">Title</label>
            <input id="event-title" class="fe-input" type="text" v-model="eventForm.title" placeholder="Event title" />
          </div>
          <div class="fe-form-group">
            <label for="event-start">Start</label>
            <input id="event-start" class="fe-input" type="datetime-local" v-model="eventForm.start" />
          </div>
          <div class="fe-form-group">
            <label for="event-end">End</label>
            <input id="event-end" class="fe-input" type="datetime-local" v-model="eventForm.end" />
          </div>
          <div class="fe-form-group">
            <label for="event-description">Description</label>
            <textarea id="event-description" class="fe-textarea" rows="3" v-model="eventForm.description" placeholder="Event description"></textarea>
          </div>
        </div>
        <div class="fe-modal-actions">
          <button v-if="editingEvent" class="fe-button ghost" type="button" @click="deleteEvent">Delete</button>
          <button class="fe-button ghost" type="button" @click="closeEventModal">Cancel</button>
          <button class="fe-button" type="button" @click="saveEvent">{{ editingEvent ? 'Update' : 'Create' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { createCalendar } from '@schedule-x/calendar';
import { viewDay, viewWeek, viewMonthGrid } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import { Local } from '../utils/storage';

const props = defineProps({
  navigate: Function,
  toasts: Object
});

const email = ref(Local.get('email') || '');
let calendar = null;
const showEventModal = ref(false);
const editingEvent = ref(null);
const eventForm = ref({
  title: '',
  start: '',
  end: '',
  description: ''
});

// Helper to convert date string to datetime-local format
const toDatetimeLocal = (dateStr) => {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().slice(0, 16);
};

// Helper to convert datetime-local to ISO string
const toISOString = (datetimeLocal) => {
  return new Date(datetimeLocal).toISOString();
};

const openEventModal = (calendarEvent = null, clickedDate = null) => {
  if (calendarEvent) {
    // Editing existing event
    editingEvent.value = calendarEvent;
    eventForm.value = {
      title: calendarEvent.title || '',
      start: toDatetimeLocal(calendarEvent.start),
      end: toDatetimeLocal(calendarEvent.end),
      description: calendarEvent.description || ''
    };
  } else {
    // Creating new event
    editingEvent.value = null;
    const startDate = clickedDate ? new Date(clickedDate) : new Date();
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    eventForm.value = {
      title: '',
      start: toDatetimeLocal(startDate),
      end: toDatetimeLocal(endDate),
      description: ''
    };
  }
  showEventModal.value = true;
};

const closeEventModal = () => {
  showEventModal.value = false;
  editingEvent.value = null;
  eventForm.value = { title: '', start: '', end: '', description: '' };
};

const saveEvent = () => {
  if (!eventForm.value.title || !eventForm.value.start || !eventForm.value.end) {
    props.toasts?.show?.('Please fill in all required fields', 'error');
    return;
  }

  const eventData = {
    id: editingEvent.value?.id || `event-${Date.now()}`,
    title: eventForm.value.title,
    start: toISOString(eventForm.value.start),
    end: toISOString(eventForm.value.end),
    description: eventForm.value.description
  };

  if (editingEvent.value) {
    // Update existing event
    calendar.events.update(eventData);
    props.toasts?.show?.('Event updated', 'success');
  } else {
    // Add new event
    calendar.events.add(eventData);
    props.toasts?.show?.('Event created', 'success');
  }

  closeEventModal();
};

const deleteEvent = () => {
  if (editingEvent.value && confirm('Delete this event?')) {
    calendar.events.remove(editingEvent.value.id);
    props.toasts?.show?.('Event deleted', 'success');
    closeEventModal();
  }
};

const load = () => {
  // Initialize Schedule-X calendar
  if (!calendar) {
    calendar = createCalendar({
      selectedDate: new Date().toISOString().split('T')[0],
      views: [viewWeek, viewMonthGrid, viewDay],
      defaultView: viewWeek,
      events: [],
      callbacks: {
        onEventClick(calendarEvent) {
          openEventModal(calendarEvent);
        },
        onClickDateTime(dateTime) {
          openEventModal(null, dateTime);
        },
        onDoubleClickDateTime(dateTime) {
          openEventModal(null, dateTime);
        }
      }
    });

    setTimeout(() => {
      const el = document.getElementById('sx-calendar');
      if (el && calendar) {
        calendar.render(el);
      }
    }, 100);
  }
};

onMounted(() => {
  load();
});

onUnmounted(() => {
  if (calendar && calendar.destroy) {
    calendar.destroy();
  }
});

defineExpose({ load });
</script>
