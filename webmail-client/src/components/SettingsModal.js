import ko from 'knockout';
import { Local } from '../utils/storage';
import { keyboardShortcuts } from '../utils/keyboard-shortcuts';
import { resetDatabase, clearCache, getDatabaseInfo, CURRENT_SCHEMA_VERSION } from '../utils/db';

export class SettingsModal {
  constructor() {
    this.visible = ko.observable(false);
    this.apiKey = ko.observable('');
    this.theme = ko.observable('system');
    this.section = ko.observable('general');
    this.composePlainDefault = ko.observable(Local.get('compose_plain_default') === '1');
    this.aliasEmail = ko.observable(this.getAliasEmail());
    this.bodyIndexingEnabled = ko.observable(Local.get('search_body_index') !== '0');
    this.indexCount = ko.observable(0);
    this.indexSize = ko.observable(0);
    this.syncPending = ko.observable(0);
    this.localUsage = ko.observable(0);
    this.localQuota = ko.observable(0);
    this.rebuildingIndex = ko.observable(false);
    this.rebuildConfirmVisible = ko.observable(false);
    this.pgpKeys = ko.observableArray([]);
    this.databaseVersion = ko.observable(CURRENT_SCHEMA_VERSION);
    this.databaseRecordCount = ko.observable(0);
    this.keyFormVisible = ko.observable(false);
    this.editingKeyName = ko.observable('');
    this.editingKeyValue = ko.observable('');
    this.editingIndex = ko.observable(-1);
    this.error = ko.observable('');
    this.success = ko.observable('');
    this.applyTheme = () => {};
    this.rebuildIndex = () => {};
    this.toggleBodyIndexing = () => {};
    this.toasts = null;
    // Storage observables will be shared from MailboxView in main.js
    this.storageUsed = null;
    this.storageTotal = null;

    // Keyboard shortcuts
    this.isMac = ko.observable(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    this.shortcutsList = ko.observableArray([]);

    this.loadFromStorage();
  }

  getAliasEmail() {
    const aliasAuth = Local.get('alias_auth') || '';
    if (aliasAuth.includes(':')) return aliasAuth.split(':')[0];
    return Local.get('email') || aliasAuth || '';
  }

  open = async () => {
    this.loadFromStorage();
    this.loadShortcuts();
    await this.loadDatabaseInfo();
    this.visible(true);
  };

  setSection = (section) => {
    this.section(section);
  };

  loadFromStorage() {
    this.error('');
    this.success('');
    this.apiKey(Local.get('api_key') || '');
    this.theme(Local.get('theme') || 'system');
    this.composePlainDefault(Local.get('compose_plain_default') === '1');
    this.bodyIndexingEnabled(Local.get('search_body_index') !== '0');
    this.aliasEmail(this.getAliasEmail());
    try {
      const storedKeys = Local.get('pgp_keys');
      this.pgpKeys(storedKeys ? JSON.parse(storedKeys) : []);
    } catch {
      this.pgpKeys([]);
    }
    this.keyFormVisible(false);
    this.editingKeyName('');
    this.editingKeyValue('');
    this.editingIndex(-1);
    this.section(this.section() || 'general');
  }

  async loadDatabaseInfo() {
    try {
      const info = await getDatabaseInfo();
      if (info) {
        this.databaseVersion(info.version);
        // Calculate total record count across all tables
        const totalRecords = Object.values(info.counts || {}).reduce((sum, count) => sum + count, 0);
        this.databaseRecordCount(totalRecords);
      }
    } catch (err) {
      console.warn('Failed to load database info:', err);
    }
  }

  close = () => {
    this.visible(false);
    keyboardShortcuts.stopCapture();
  };

  save = () => {
    this.error('');
    this.success('');
    try {
      Local.set('api_key', this.apiKey().trim());
      Local.set('theme', this.theme());
      Local.set('compose_plain_default', this.composePlainDefault() ? '1' : '0');
      Local.set('pgp_keys', JSON.stringify(this.pgpKeys()));
      if (typeof this.applyTheme === 'function') this.applyTheme(this.theme());
      this.success('Settings saved.');
    } catch (error) {
      this.error(error?.message || 'Unable to save settings.');
    }
  };

  openNewKey = () => {
    this.keyFormVisible(true);
    this.editingIndex(-1);
    this.editingKeyName('');
    this.editingKeyValue('');
  };

  editKey = (key) => {
    const idx = this.pgpKeys().indexOf(key);
    if (idx === -1) return;
    this.keyFormVisible(true);
    this.editingIndex(idx);
    this.editingKeyName(key.name || '');
    this.editingKeyValue(key.value || '');
  };

  removeKey = (key) => {
    this.pgpKeys.remove(key);
    Local.set('pgp_keys', JSON.stringify(this.pgpKeys()));
  };

  cancelKeyForm = () => {
    this.keyFormVisible(false);
    this.editingIndex(-1);
    this.editingKeyName('');
    this.editingKeyValue('');
  };

  saveKey = () => {
    const name = (this.editingKeyName() || '').trim();
    const value = (this.editingKeyValue() || '').trim();
    if (!name || !value) {
      this.error('Please provide a name and key.');
      return;
    }
    const keys = this.pgpKeys();
    if (this.editingIndex() >= 0) {
      keys[this.editingIndex()] = { name, value };
    } else {
      keys.push({ name, value });
    }
    this.pgpKeys([...keys]);
    Local.set('pgp_keys', JSON.stringify(this.pgpKeys()));
    this.cancelKeyForm();
    this.success('Encryption key saved locally.');
  };

  clearData = () => {
    Local.clear();
    window.location.href = '/';
  };

  signOut = () => {
    Local.clear();
    window.location.href = '/';
  };

  openRebuildConfirm = () => {
    this.error('');
    this.success('');
    this.rebuildConfirmVisible(true);
  };

  closeRebuildConfirm = () => {
    this.rebuildConfirmVisible(false);
  };

  confirmRebuildIndex = async () => {
    if (this.rebuildingIndex()) return;
    this.rebuildingIndex(true);
    try {
      await this.rebuildIndex();
      this.success('Search index rebuilt.');
      this.toasts?.show?.('Search index rebuilt', 'success');
    } catch (err) {
      this.error(err?.message || 'Failed to rebuild index.');
      this.toasts?.show?.(this.error(), 'error');
    } finally {
      this.rebuildingIndex(false);
      this.closeRebuildConfirm();
    }
  };

  /**
   * Format keyboard shortcut key for OS-specific display
   */
  formatKey = (key) => {
    return keyboardShortcuts.formatKey(key);
  };

  /**
   * Load keyboard shortcuts list
   */
  loadShortcuts = () => {
    const shortcuts = keyboardShortcuts.getShortcutsList();
    this.shortcutsList(shortcuts);
  };

  /**
   * Reset keyboard shortcuts to defaults
   */
  resetShortcuts = () => {
    this.error('');
    this.success('');
    try {
      keyboardShortcuts.resetToDefaults();
      this.loadShortcuts();
      this.success('Keyboard shortcuts reset to defaults.');
      this.toasts?.show?.('Keyboard shortcuts reset to defaults', 'success');
    } catch (err) {
      this.error(err?.message || 'Failed to reset shortcuts.');
      this.toasts?.show?.(this.error(), 'error');
    }
  };

  /**
   * Clear cached data (keeps database structure)
   */
  clearCacheData = async () => {
    this.error('');
    this.success('');
    const confirmed = window.confirm(
      'This will clear all cached emails, folders, and search indexes. You will need to reload your mailbox. Continue?'
    );
    if (!confirmed) return;

    try {
      const result = await clearCache();
      if (result) {
        this.success('Cache cleared successfully. Please reload the page.');
        this.toasts?.show?.('Cache cleared. Please reload the page.', 'success');
      } else {
        throw new Error('Failed to clear cache');
      }
    } catch (err) {
      this.error(err?.message || 'Failed to clear cache.');
      this.toasts?.show?.(this.error(), 'error');
    }
  };

  /**
   * Reset entire database (deletes and recreates)
   */
  resetDatabaseFull = async () => {
    this.error('');
    this.success('');
    const confirmed = window.confirm(
      'WARNING: This will permanently delete all local data including cached emails, settings, and search indexes. This action cannot be undone. Continue?'
    );
    if (!confirmed) return;

    try {
      const result = await resetDatabase();
      if (result) {
        this.success('Database reset successfully. Please reload the page.');
        this.toasts?.show?.('Database reset. Please reload the page.', 'success');
      } else {
        throw new Error('Failed to reset database');
      }
    } catch (err) {
      this.error(err?.message || 'Failed to reset database.');
      this.toasts?.show?.(this.error(), 'error');
    }
  };

}
