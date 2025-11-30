<template>
  <div v-if="visible" class="fe-modal-backdrop">
    <div class="fe-modal fe-compose-modal">
      <div class="fe-modal-header">
        <h2>New Message</h2>
        <button class="fe-button ghost" type="button" @click="close">Close</button>
      </div>
      <div class="fe-modal-body">
        <div class="fe-compose-fields">
          <input class="fe-input" type="text" placeholder="To" v-model="to" />
          <input class="fe-input" type="text" placeholder="Subject" v-model="subject" />
        </div>
        <textarea
          class="fe-textarea"
          v-model="body"
          placeholder="Compose your message..."
          rows="12"
          style="min-height: 300px; width: 100%; font-family: inherit;"
        ></textarea>
      </div>
      <div class="fe-modal-actions">
        <button class="fe-button ghost" type="button" @click="close">Cancel</button>
        <button class="fe-button" type="button" @click="send" :disabled="sending">
          {{ sending ? 'Sending...' : 'Send' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  toasts: Object
});

const visible = ref(false);
const to = ref('');
const subject = ref('');
const sending = ref(false);
const body = ref('');

const open = () => {
  visible.value = true;
  to.value = '';
  subject.value = '';
  body.value = '';
};

const close = () => {
  visible.value = false;
};

const send = async () => {
  sending.value = true;
  try {
    // Placeholder for send logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    props.toasts?.show?.('Email sending not yet fully implemented', 'info');
    close();
  } catch (err) {
    props.toasts?.show?.(err?.message || 'Failed to send', 'error');
  } finally {
    sending.value = false;
  }
};

const toList = (addresses) => {
  to.value = addresses.join(', ');
};

defineExpose({ open, close, toList, subject, body });
</script>
