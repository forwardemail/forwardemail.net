export const config = {
  apiBase: import.meta.env.WEBMAIL_API_BASE || 'https://api.forwardemail.net',
  useMockWebmail: import.meta.env.WEBMAIL_MOCK === '1',
};
