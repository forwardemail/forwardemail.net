# Internationalization (i18n) Usage Guide

## Overview

The webmail client now includes a comprehensive i18n system that supports multiple languages. All user-facing text is stored in JSON files and can be translated.

## File Structure

```
src/
├── locales/
│   ├── en.json          # English (default)
│   ├── es.json          # Spanish (to be added)
│   ├── fr.json          # French (to be added)
│   └── ...
└── utils/
    └── i18n.js          # i18n utility
```

## Usage in JavaScript

```javascript
import { i18n } from '../utils/i18n';

// Simple translation
const text = i18n.t('messages.noSubject');  // "(No subject)"

// Translation with parameters
const count = 5;
const text = i18n.t('bulk.archived', { count });  // "Archived 5 conversation(s)"

// In MailboxView or other components with this.t
this.toasts?.show?.(this.t('notifications.messageSent'), 'success');
```

## Usage in HTML with Knockout

### 1. Simple text binding

```html
<!-- Old way -->
<span>Inbox</span>

<!-- New way with i18n -->
<span data-bind="i18nText: 'folders.inbox'"></span>
```

### 2. Text with parameters

```html
<span data-bind="i18n: { key: 'bulk.archived', params: { count: selectedConversationCount } }"></span>
```

### 3. Attributes (title, aria-label, etc.)

```html
<button data-bind="i18nAttr: { title: 'actions.refresh', 'aria-label': 'actions.refresh' }">
  <svg>...</svg>
</button>
```

### 4. Using with existing bindings

```html
<!-- Combine with other bindings -->
<span data-bind="i18nText: 'messages.from'"></span>: <span data-bind="text: from"></span>
```

## Translation Keys Structure

The `en.json` file is organized by category:

```json
{
  "app": { ... },           // App-level text
  "folders": { ... },       // Folder names
  "actions": { ... },       // Button labels and actions
  "filters": { ... },       // Filter options
  "messages": { ... },      // Message-related text
  "compose": { ... },       // Compose modal
  "bulk": { ... },          // Bulk operations
  "contextMenu": { ... },   // Context menu items
  "settings": { ... },      // Settings
  "errors": { ... },        // Error messages
  "notifications": { ... }, // Success/info messages
  "pgp": { ... },          // PGP-related text
  "storage": { ... },      // File size units
  "time": { ... },         // Time-related text
  "pagination": { ... },   // Pagination
  "labels": { ... }        // Label names
}
```

## Adding a New Language

1. Create a new JSON file in `src/locales/` (e.g., `es.json` for Spanish)
2. Copy the structure from `en.json`
3. Translate all values (keep keys the same)
4. The language will be automatically available

Example `es.json`:

```json
{
  "app": {
    "title": "Correo Electrónico Forward Email",
    "loading": "Cargando..."
  },
  "folders": {
    "inbox": "Bandeja de entrada",
    "drafts": "Borradores",
    ...
  }
}
```

## Language Detection

The system detects the user's language in this order:

1. **User preference** (stored in LocalStorage as `locale`)
2. **Browser language** (from `navigator.language`)
3. **Default** (English)

## Changing Language Programmatically

```javascript
import { i18n } from '../utils/i18n';

// Set language
await i18n.setLocale('es');  // Switch to Spanish

// Get current language
const currentLang = i18n.getLocale();  // 'en'

// Get available languages
const languages = i18n.getAvailableLocales();  // ['en', 'es', 'fr', ...]
```

## Listening for Language Changes

```javascript
i18n.onChange((locale) => {
  console.log('Language changed to:', locale);
  // Update UI or reload data
});
```

## Helper Functions

### Format Numbers

```javascript
i18n.formatNumber(1234.56);  // "1,234.56" (en) or "1.234,56" (de)
```

### Format Dates

```javascript
i18n.formatDate(new Date(), { dateStyle: 'medium' });
// "Jan 15, 2025" (en) or "15 janv. 2025" (fr)
```

### Format File Sizes

```javascript
i18n.formatFileSize(1024);      // "1.00 KB"
i18n.formatFileSize(1048576);   // "1.00 MB"
```

## Migration Guide

To migrate existing hardcoded text to i18n:

### Before:
```javascript
this.toasts?.show?.('Message sent successfully', 'success');
```

### After:
```javascript
this.toasts?.show?.(this.t('notifications.messageSent'), 'success');
```

### Before (HTML):
```html
<button>Archive</button>
```

### After (HTML):
```html
<button data-bind="i18nText: 'actions.archive'"></button>
```

## Best Practices

1. **Use descriptive keys**: `messages.noSubject` instead of `msg1`
2. **Group related translations**: All folder names under `folders.*`
3. **Use parameters for dynamic content**: `{count}` instead of concatenating strings
4. **Keep translations consistent**: Use the same term for the same concept
5. **Test with long translations**: Some languages are more verbose

## Testing Translations

```javascript
// Test that all keys exist
const testKeys = [
  'messages.noSubject',
  'actions.archive',
  'notifications.messageSent'
];

testKeys.forEach(key => {
  const value = i18n.t(key);
  console.assert(value !== key, `Missing translation: ${key}`);
});
```

## Current Status

- ✅ English translations complete (`en.json`)
- ✅ i18n system initialized
- ✅ Knockout bindings available
- ⏳ HTML templates need migration
- ⏳ JavaScript code needs migration
- ⏳ Additional languages need to be added

## Next Steps

1. Migrate hardcoded text in HTML to use i18n bindings
2. Migrate hardcoded text in JavaScript to use `this.t()` or `i18n.t()`
3. Add language selector in Settings
4. Add additional language files (Spanish, French, German, etc.)
5. Test with RTL languages (Arabic, Hebrew)
