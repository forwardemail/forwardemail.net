<template>
  <div class="LoginView">
    <div class="fe-login-header">
      <div class="fe-logo" aria-hidden="true">
        <img src="/icons/logo-square.svg" alt="ForwardEmail logo" />
      </div>
      <div class="fe-title">
        <h1>Webmail</h1>
      </div>
    </div>

    <form @submit.prevent="submitForm" novalidate>
      <input
        type="email"
        placeholder="you@example.com"
        autocomplete="username"
        v-model="email"
        required
      />

      <input
        type="password"
        placeholder="Password"
        autocomplete="current-password"
        v-model="password"
        required
      />

      <div class="fe-login-hint">Use your alias email and generated password to sign in.</div>

      <label>
        <input type="checkbox" v-model="signMe" />
        Stay signed in
      </label>

      <button type="submit" :disabled="submitRequest">
        {{ submitButtonText }}
      </button>

      <div v-if="submitError" class="alert alert-danger">{{ submitError }}</div>
    </form>

    <div class="fe-footer" style="display:flex; flex-direction:column; gap:4px; align-items:center; text-align:center;">
      <span>Don't have an account?
        <a class="fe-signup-link" href="https://forwardemail.net" target="_blank" rel="noopener noreferrer">Sign up</a>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Local } from '../utils/storage';
import { Remote } from '../utils/remote';

const props = defineProps({
  navigate: Function
});

const email = ref(Local.get('email') || '');
const password = ref('');
const signMe = ref(Local.get('rememberMe') === 'true');
const submitRequest = ref(false);
const submitError = ref('');

const submitButtonText = computed(() => {
  return submitRequest.value ? 'Signing in…' : 'Sign In';
});

const submitForm = async () => {
  submitError.value = '';
  submitRequest.value = true;

  try {
    const authString = `${email.value}:${password.value}`;
    Local.set('alias_auth', authString);
    Local.set('email', email.value);
    if (signMe.value) {
      Local.set('rememberMe', 'true');
    } else {
      Local.remove('rememberMe');
    }

    const result = await Remote.request('Account', {});
    if (result?.id || result?.Id) {
      Local.set('authToken', 'authenticated');
      if (props.navigate) {
        props.navigate('/mailbox');
      }
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    submitError.value = error?.message || 'Authentication failed. Please check your credentials.';
    Local.remove('alias_auth');
    Local.remove('authToken');
  } finally {
    submitRequest.value = false;
  }
};
</script>
