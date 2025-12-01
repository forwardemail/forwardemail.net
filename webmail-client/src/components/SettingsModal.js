import ko from 'knockout';
import { Local } from '../utils/storage';
import { keyboardShortcuts } from '../utils/keyboard-shortcuts';

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
    this.editingShortcut = ko.observable(null);
    this.editingShortcutKey = ko.observable('');
    this.shortcutEditVisible = ko.observable(false);
    this.capturedKeys = ko.observable('');

    this.loadFromStorage();
  }

  getAliasEmail() {
    const aliasAuth = Local.get('alias_auth') || '';
    if (aliasAuth.includes(':')) return aliasAuth.split(':')[0];
    return Local.get('email') || aliasAuth || '';
  }

  open = () => {
    this.loadFromStorage();
    this.loadShortcuts();
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
   * Check if a shortcut is being edited
   */
  isEditingShortcut = (shortcut) => {
    const editing = this.editingShortcut();
    return editing && editing.originalKey === shortcut.originalKey;
  };

  /**
   * Start editing a keyboard shortcut
   */
  editShortcut = (shortcut) => {
    this.editingShortcut(shortcut);
    this.editingShortcutKey(shortcut.key);
    this.capturedKeys('');
    keyboardShortcuts.startCapture(this.onShortcutCaptured);
  };

  /**
   * Cancel editing a shortcut
   */
  cancelEditShortcut = () => {
    this.editingShortcut(null);
    this.editingShortcutKey('');
    this.capturedKeys('');
    keyboardShortcuts.stopCapture();
  };

  /**
   * Save edited shortcut
   */
  saveEditedShortcut = () => {
    const shortcut = this.editingShortcut();
    let newKey = (this.capturedKeys() || '').trim().toLowerCase();

    if (!shortcut || !newKey) {
      this.error('Please enter a valid keyboard shortcut.');
      return;
    }

    // Normalize the key format (remove extra spaces around +)
    newKey = newKey.replace(/\s*\+\s*/g, '+');
    newKey = keyboardShortcuts.normalizeShortcut(newKey);
    if (!newKey) {
      this.error('Please enter a valid keyboard shortcut.');
      return;
    }

    try {
      // Update the shortcut in the keyboard shortcuts manager
      keyboardShortcuts.updateShortcut(shortcut.originalKey, newKey);

      // Reload the shortcuts list
      this.loadShortcuts();

      this.success(`Shortcut updated: ${shortcut.label}`);
      this.toasts?.show?.('Shortcut updated', 'success');
      this.cancelEditShortcut();
    } catch (err) {
      this.error(err?.message || 'Failed to update shortcut.');
      this.toasts?.show?.(this.error(), 'error');
    }
  };

  /**
   * Clear captured keys when input changes
   */
  onShortcutInputChange = (value) => {
    // Normalize the input to lowercase and trim
    const normalized = value.toLowerCase().trim();
    this.capturedKeys(normalized);
  };

  /**
   * Re-arm keyboard shortcut capture when the input is focused or clicked
   */
  startShortcutCapture = () => {
    if (!this.editingShortcut()) return;
    keyboardShortcuts.startCapture(this.onShortcutCaptured);
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
   * Begin capturing a shortcut while editing
   */
  onShortcutCaptured = (combo) => {
    this.capturedKeys(combo);
  };
}
