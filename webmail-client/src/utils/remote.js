import { config } from '../config';
import { Local } from './storage';

function getAliasAuthHeader() {
  const aliasAuth = Local.get('alias_auth');
  if (!aliasAuth) throw new Error('Authorization required. Please sign in again.');
  return `Basic ${btoa(aliasAuth)}`;
}

export const Remote = {
  async request(action, params = {}, options = {}) {
    const { path, method: defaultMethod } = this.getEndpoint(action);
    const method = (options.method || defaultMethod || 'GET').toUpperCase();
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (!options.skipAuth && this.shouldAuthorize(action)) {
      headers.Authorization = getAliasAuthHeader();
    }

    const url = new URL(`${config.apiBase}${options.pathOverride || path}`);
    const fetchOptions = { method, headers };

    if (method === 'GET') {
      Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, value);
        }
      });
    } else {
      fetchOptions.body = JSON.stringify(params || {});
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json().catch(() => null) : null;

      if (!response.ok) {
        let message = data?.message || data?.error || response.statusText;
        if (!message && !isJson) {
          const text = await response.text().catch(() => '');
          message = text || 'Request failed';
        }
        const error = new Error(message);
        if (data && typeof data === 'object') Object.assign(error, data);
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Remote.${action} failed:`, error);
      // bubble up to allow UI redirect on 401/403
      throw error;
    }
  },

  getEndpoint(action) {
    const endpoints = {
      Login: { path: '/v1/webmail/auth/login', method: 'POST' },
      Folders: { path: '/v1/folders', method: 'GET' },
      MessageList: { path: '/v1/messages', method: 'GET' },
      Message: { path: '/v1/messages', method: 'GET' }
    };

    const entry = endpoints[action];
    if (entry) return entry;
    return { path: `/v1/${String(action || '').toLowerCase()}`, method: 'GET' };
  },

  shouldAuthorize(action) {
    if (!action) return true;
    return action !== 'Login';
  }
};
