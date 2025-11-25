const PREFIX = 'webmail_';

export const Local = {
  get(key) {
    try {
      return localStorage.getItem(`${PREFIX}${key}`);
    } catch (error) {
      console.error('localStorage.getItem failed:', error);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(`${PREFIX}${key}`, value);
      return true;
    } catch (error) {
      console.error('localStorage.setItem failed:', error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
      return true;
    } catch (error) {
      console.error('localStorage.removeItem failed:', error);
      return false;
    }
  },

  clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PREFIX)) keysToRemove.push(key);
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('localStorage.clear failed:', error);
      return false;
    }
  }
};
