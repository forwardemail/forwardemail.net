<template>
  <div v-if="visible" class="fe-modal-backdrop">
    <div class="fe-modal">
      <div class="fe-modal-header">
        <h2>Enter passphrase</h2>
        <button class="fe-button ghost" type="button" @click="cancel">Close</button>
      </div>
      <div class="fe-modal-body">
        <div class="fe-settings-note">Needed to unlock key: <strong>{{ keyName }}</strong></div>
        <input
          class="fe-input"
          type="password"
          placeholder="Passphrase"
          v-model="passphrase"
          @keyup.enter="submit"
        />
        <label class="fe-settings-row">
          <input type="checkbox" v-model="remember" />
          Remember for this tab
        </label>
      </div>
      <div class="fe-modal-actions">
        <button class="fe-button ghost" type="button" @click="cancel">Cancel</button>
        <button class="fe-button" type="button" @click="submit">Unlock</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const keyName = ref('');
const passphrase = ref('');
const remember = ref(false);
let resolveFunc = null;
let rejectFunc = null;

const open = (name) => {
  keyName.value = name || '';
  passphrase.value = '';
  remember.value = false;
  visible.value = true;
  return new Promise((resolve, reject) => {
    resolveFunc = resolve;
    rejectFunc = reject;
  });
};

const submit = () => {
  if (resolveFunc) {
    resolveFunc({ passphrase: passphrase.value, remember: remember.value });
  }
  cleanup();
};

const cancel = () => {
  if (rejectFunc) rejectFunc(new Error('Passphrase cancelled'));
  cleanup();
};

const cleanup = () => {
  visible.value = false;
  keyName.value = '';
  passphrase.value = '';
  remember.value = false;
  resolveFunc = null;
  rejectFunc = null;
};

defineExpose({ open });
</script>
