const PREFIX = 'webmail_';
const ACCOUNTS_KEY = `${PREFIX}accounts`; // List of all logged-in accounts
const ACTIVE_ACCOUNT_KEY = `${PREFIX}active_account`; // Currently active account email

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

/**
 * Multi-Account Management
 * Handles multiple logged-in accounts with account-scoped storage
 */
export const Accounts = {
  /**
   * Get list of all logged-in accounts
   * Returns array of account objects: [{ email, apiKey, aliasAuth, addedAt }]
   */
  getAll() {
    try {
      const data = localStorage.getItem(ACCOUNTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get accounts:', error);
      return [];
    }
  },

  /**
   * Get currently active account email
   */
  getActive() {
    try {
      return localStorage.getItem(ACTIVE_ACCOUNT_KEY);
    } catch (error) {
      console.error('Failed to get active account:', error);
      return null;
    }
  },

  /**
   * Set active account and load its credentials into Local storage
   */
  setActive(email) {
    try {
      const accounts = this.getAll();
      const account = accounts.find(a => a.email === email);

      if (!account) {
        return false;
      }

      // Set active account
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, email);

      // Load account credentials into Local storage
      Local.set('email', account.email);
      if (account.apiKey) Local.set('api_key', account.apiKey);
      if (account.aliasAuth) Local.set('alias_auth', account.aliasAuth);

      return true;
    } catch (error) {
      console.error('Failed to set active account:', error);
      return false;
    }
  },

  /**
   * Add or update an account
   */
  add(email, credentials = {}) {
    try {
      const accounts = this.getAll();
      const existingIndex = accounts.findIndex(a => a.email === email);

      const accountData = {
        email,
        apiKey: credentials.apiKey || credentials.api_key || null,
        aliasAuth: credentials.aliasAuth || credentials.alias_auth || null,
        addedAt: existingIndex >= 0 ? accounts[existingIndex].addedAt : Date.now(),
        lastActive: Date.now()
      };

      if (existingIndex >= 0) {
        // Update existing account
        accounts[existingIndex] = accountData;
      } else {
        // Add new account
        accounts.push(accountData);
      }

      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      return true;
    } catch (error) {
      console.error('Failed to add account:', error);
      return false;
    }
  },

  /**
   * Remove an account and its associated data
   * @param {string} email - Account email to remove
   * @param {boolean} clearCache - Whether to clear IndexedDB cache for this account
   */
  async remove(email, clearCache = true) {
    try {
      const accounts = this.getAll();
      const filtered = accounts.filter(a => a.email !== email);

      if (filtered.length === accounts.length) {
        console.warn('Account not found:', email);
        return false;
      }

      // Update accounts list
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filtered));

      // If this was the active account, switch to another or clear active
      const activeAccount = this.getActive();
      if (activeAccount === email) {
        if (filtered.length > 0) {
          // Switch to first remaining account
          this.setActive(filtered[0].email);
        } else {
          // No accounts left, clear everything
          localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
          Local.clear();
        }
      }

      // Clear IndexedDB cache for this account if requested
      if (clearCache) {
        const { db } = await import('./db.js');

        // Delete account-specific data
        await db.folders.where('account').equals(email).delete();
        await db.messages.where('account').equals(email).delete();
        await db.messageBodies.where('account').equals(email).delete();
        await db.searchIndex.where('account').equals(email).delete();
        await db.indexMeta.where('account').equals(email).delete();
        await db.syncQueue.where('account').equals(email).delete();
      }

      return true;
    } catch (error) {
      console.error('Failed to remove account:', error);
      return false;
    }
  },

  /**
   * Check if an account exists
   */
  exists(email) {
    const accounts = this.getAll();
    return accounts.some(a => a.email === email);
  },

  /**
   * Initialize account system
   * Migrates from old single-account system to multi-account
   */
  init() {
    try {
      // Check if we have old-style credentials but no accounts list
      const existingAccounts = this.getAll();
      const email = Local.get('email');

      if (email && existingAccounts.length === 0) {
        // Migrate from old system
        this.add(email, {
          apiKey: Local.get('api_key'),
          aliasAuth: Local.get('alias_auth')
        });

        this.setActive(email);
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize accounts:', error);
      return false;
    }
  }
};
