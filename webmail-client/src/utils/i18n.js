import { Local } from './storage';

class I18n {
  constructor() {
    this.translations = {};
    this.currentLocale = 'en';
    this.fallbackLocale = 'en';
    this.changeListeners = [];
  }

  /**
   * Initialize i18n with user's preferred language
   */
  async init() {
    // Detect language from: 1) User settings, 2) Browser, 3) Default to English
    const userLocale = Local.get('locale');
    const browserLocale = this.detectBrowserLocale();
    const locale = userLocale || browserLocale || 'en';

    await this.setLocale(locale);
  }

  /**
   * Detect browser's preferred language
   */
  detectBrowserLocale() {
    if (typeof navigator === 'undefined') return 'en';

    const language = navigator.language || navigator.userLanguage;
    if (!language) return 'en';

    // Extract base language code (e.g., 'en' from 'en-US')
    return language.split('-')[0].toLowerCase();
  }

  /**
   * Set the current locale and load translations
   */
  async setLocale(locale) {
    try {
      // Try to load the requested locale
      const translations = await this.loadTranslations(locale);
      this.translations = translations;
      this.currentLocale = locale;
      Local.set('locale', locale);

      // Notify listeners
      this.notifyChange();

      return true;
    } catch (error) {
      console.warn(`Failed to load locale "${locale}", falling back to "${this.fallbackLocale}"`, error);

      // Fall back to English if requested locale fails
      if (locale !== this.fallbackLocale) {
        const fallbackTranslations = await this.loadTranslations(this.fallbackLocale);
        this.translations = fallbackTranslations;
        this.currentLocale = this.fallbackLocale;
      }

      return false;
    }
  }

  /**
   * Load translations for a locale
   */
  async loadTranslations(locale) {
    // Dynamic import of locale file
    try {
      const module = await import(`../locales/${locale}.json`);
      return module.default || module;
    } catch (error) {
      throw new Error(`Locale "${locale}" not found`);
    }
  }

  /**
   * Get a translation by key path (e.g., 'messages.noSubject')
   */
  t(keyPath, params = {}) {
    const keys = keyPath.split('.');
    let value = this.translations;

    // Navigate through nested object
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        console.warn(`Translation key not found: ${keyPath}`);
        return keyPath; // Return key path if translation not found
      }
    }

    // Handle string interpolation
    if (typeof value === 'string') {
      return this.interpolate(value, params);
    }

    return value;
  }

  /**
   * Interpolate parameters into translation string
   * Example: "Hello {name}" with {name: "World"} => "Hello World"
   */
  interpolate(str, params) {
    return str.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Get current locale
   */
  getLocale() {
    return this.currentLocale;
  }

  /**
   * Get available locales
   */
  getAvailableLocales() {
    // This would be dynamically populated based on available locale files
    return ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ko'];
  }

  /**
   * Register a listener for locale changes
   */
  onChange(callback) {
    this.changeListeners.push(callback);
    return () => {
      this.changeListeners = this.changeListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of locale change
   */
  notifyChange() {
    this.changeListeners.forEach(callback => {
      try {
        callback(this.currentLocale);
      } catch (error) {
        console.error('Error in i18n change listener', error);
      }
    });
  }

  /**
   * Format a number according to locale
   */
  formatNumber(number, options = {}) {
    if (typeof Intl === 'undefined') return number.toString();
    return new Intl.NumberFormat(this.currentLocale, options).format(number);
  }

  /**
   * Format a date according to locale
   */
  formatDate(date, options = {}) {
    if (typeof Intl === 'undefined') return date.toString();
    return new Intl.DateTimeFormat(this.currentLocale, options).format(date);
  }

  /**
   * Format file size with localized units
   */
  formatFileSize(bytes) {
    if (bytes < 1024) {
      return this.t('storage.bytes', { size: bytes });
    } else if (bytes < 1024 * 1024) {
      return this.t('storage.kilobytes', { size: (bytes / 1024).toFixed(2) });
    } else if (bytes < 1024 * 1024 * 1024) {
      return this.t('storage.megabytes', { size: (bytes / (1024 * 1024)).toFixed(2) });
    } else {
      return this.t('storage.gigabytes', { size: (bytes / (1024 * 1024 * 1024)).toFixed(2) });
    }
  }
}

// Export singleton instance
export const i18n = new I18n();

// Knockout binding handler for i18n
if (typeof window !== 'undefined' && window.ko) {
  window.ko.bindingHandlers.i18n = {
    update: function(element, valueAccessor) {
      const options = window.ko.unwrap(valueAccessor());
      let key, params;

      if (typeof options === 'string') {
        key = options;
        params = {};
      } else {
        key = options.key;
        params = options.params || {};
      }

      // Unwrap any observables in params
      const unwrappedParams = {};
      for (const [k, v] of Object.entries(params)) {
        unwrappedParams[k] = window.ko.unwrap(v);
      }

      element.textContent = i18n.t(key, unwrappedParams);
    }
  };

  // Text binding that supports i18n
  window.ko.bindingHandlers.i18nText = {
    update: function(element, valueAccessor) {
      const value = window.ko.unwrap(valueAccessor());
      element.textContent = i18n.t(value);
    }
  };

  // Attribute binding that supports i18n
  window.ko.bindingHandlers.i18nAttr = {
    update: function(element, valueAccessor) {
      const value = window.ko.unwrap(valueAccessor());
      for (const [attr, key] of Object.entries(value)) {
        element.setAttribute(attr, i18n.t(key));
      }
    }
  };
}
