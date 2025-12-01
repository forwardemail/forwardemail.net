# Feature Gaps Analysis vs SPECIFICATION.md

**Last Updated:** 2025-11-30

This document tracks the implementation status of features defined in `/webmail-vision/SPECIFICATION.md`.

---

## ✅ Already Implemented

### Core Infrastructure
- ✅ **HTML Sanitization** - DOMPurify v3.1.6 (`src/utils/sanitize.js`)
- ✅ **IndexedDB with Dexie** - v4.2.1 with account-scoped primary keys (`src/utils/db.js`)
- ✅ **Service Worker & PWA** - vite-plugin-pwa v0.17.0 with offline support
- ✅ **Message Threading** - Client-side threading algorithm (`src/utils/threading.js`)
- ✅ **Advanced Search** - FlexSearch v0.7.43 (`src/utils/search-service.js`)
- ✅ **OpenPGP Support** - OpenPGP.js v6.2.2 for encryption/decryption
- ✅ **Rich Text Editor** - TipTap v2.6.6 with extensions (StarterKit, Link, Highlight, Underline, Placeholder)
- ✅ **Emoji Picker** - emoji-picker-element v1.21.5
- ✅ **Contact Autocomplete** - In ComposeModal with contactOptions

### Email Features
- ✅ **Basic Authentication** - Alias username + password
- ✅ **Folder Management** - List, create, rename, delete folders
- ✅ **Message List** - Display messages with pagination
- ✅ **Message Viewing** - Read messages with HTML rendering
- ✅ **Compose Email** - Full composition with TipTap editor
- ✅ **Send Email** - Via Forward Email API
- ✅ **Reply/Forward** - With quoted text
- ✅ **Read/Unread Toggle** - Mark messages as read/unread
- ✅ **Auto-mark as Read** - Automatically mark messages as read on open (500ms delay)
- ✅ **Attachment Handling** - Upload, download, inline preview, size validation
- ✅ **Offline Queue** - Queue operations when offline (`src/utils/sync-queue.js`)
- ✅ **Cache-First Strategy** - Display cached messages immediately

### UI/UX
- ✅ **Light/Dark Mode** - Theme switching with system preference detection
- ✅ **Responsive Design** - Mobile, tablet, desktop breakpoints
- ✅ **Hamburger Menu** - Mobile navigation
- ✅ **Settings Panel** - Theme, search, threading, PGP keys
- ✅ **Toast Notifications** - Success/error messages
- ✅ **Read/Unread Styling** - Visual distinction with font-weight and opacity

### Calendar & Contacts
- ✅ **Basic Calendar** - Schedule-X v1.63.1 integration
- ✅ **Event Creation** - Create, edit, delete events via custom modal
- ✅ **Basic Contacts** - List, create, edit, delete contacts
- ✅ **Contact Search** - Filter contacts by name/email
- ✅ **vCard Support** - Parse and edit vCard content

---

## ⚠️ Partially Implemented / Needs Enhancement

### Composer
- ⚠️ **Auto-save Drafts** - Need to verify if implemented and working correctly
- ⚠️ **Email Signatures** - Settings UI exists but needs integration with composer
- ⚠️ **Cc/Bcc Fields** - Implemented but could be enhanced with better autocomplete
- ⚠️ **Attachment Reminder** - Need multi-language keyword detection (spec: 40+ languages)

### Search
- ⚠️ **PGP Encrypted Message Search** - FlexSearch exists but needs to index decrypted content
- ⚠️ **Search Operators** - Need `from:`, `to:`, `subject:`, `has:attachment`, `is:unread`, etc.
- ⚠️ **Saved Searches** - Not implemented

### Calendar
- ⚠️ **CalDAV Integration** - Basic Schedule-X but no sync with Forward Email API
- ⚠️ **Recurring Events** - Not implemented
- ⚠️ **Event Reminders/Notifications** - Removed from modal, needs re-implementation
- ⚠️ **Meeting Invites** - No send/receive/RSVP functionality
- ⚠️ **.ics Import/Export** - Not implemented

### Contacts
- ⚠️ **CardDAV Integration** - No sync with Forward Email API
- ⚠️ **Contact Groups/Tags** - Not implemented
- ⚠️ **Contact Photos** - Not implemented
- ⚠️ **Custom Fields** - Basic support but needs enhancement
- ⚠️ **Auto-add from Emails** - Not implemented
- ⚠️ **Merge Duplicates** - Not implemented

### Security
- ⚠️ **External Image Blocking** - Need "Ask before loading" with whitelist
- ⚠️ **Tracking Pixel Detection** - Not implemented
- ⚠️ **Link Safety Checks** - Not implemented (no SpamScanner integration yet)

---

## ❌ High Priority Missing Features

### Security & Privacy (Critical)
1. **SpamScanner Integration** - Client-side phishing/malware detection
   - Phishing detection (IDN homograph, confusables, suspicious links)
   - Virus scanning (ClamAV integration via API)
   - Executable detection (195+ file extensions)
   - NSFW image detection
   - Toxicity detection
   - Link safety warnings

2. **External Content Controls**
   - Ask before loading external images (with per-sender whitelist)
   - Image proxy option to hide IP address
   - Tracking pixel detection and warnings

3. **Content Security Policy (CSP)**
   - Implement strict CSP headers
   - Ensure proper nonce usage for inline scripts

4. **Password-Protected Messages**
   - Encrypt message body and attachments with user password
   - Using libsodium.js (not yet installed)

### Core Email Features (MVP)
5. **Keyboard Shortcuts**
   - Extensive shortcuts (c=compose, r=reply, a=reply-all, etc.)
   - Customizable shortcuts
   - Help modal (`?` key)
   - Vim-style navigation (optional)

6. **Message Actions**
   - Archive (move to Archive folder)
   - Mark as spam/not spam
   - Print message
   - Download as .eml
   - View source
   - Report phishing

7. **Message Filters & Rules**
   - Client-side filtering rules
   - Conditions: from, to, subject, body, attachment, size
   - Actions: move, label, star, mark as read, delete
   - Filter priority and ordering
   - Import/export filters

8. **Labels/Tags System**
   - Create custom labels
   - Apply multiple labels per message
   - Label colors
   - Filter by label
   - Label autocomplete in composer

9. **Multi-Select & Batch Operations**
   - Select multiple messages with checkboxes
   - Bulk move, delete, mark as read/unread, star
   - Select all in folder
   - Keyboard shortcuts for selection

10. **Drag-and-Drop**
    - Drag messages to folders
    - Drag files to composer for attachments
    - Drag images to composer for inline images
    - Reorder folders (if supported by API)

### Composer Enhancements
11. **Markdown Support**
    - Compose in Markdown with live preview
    - GitHub-flavored Markdown (GFM)
    - Syntax highlighting for code blocks
    - Toggle between HTML and Markdown modes

12. **Diagram Rendering**
    - Mermaid for flowcharts, sequence diagrams, Gantt charts
    - Render in both composer preview and message viewer

13. **Templates/Canned Responses**
    - Save frequently used responses
    - Quick insert in composer
    - Variable substitution (name, date, etc.)

14. **Send Later (Scheduled Sending)**
    - Schedule email to send at future date/time
    - Queue in IndexedDB
    - Background sync to send at scheduled time

15. **Request Read Receipt**
    - Option to request read receipt when composing
    - Handle incoming read receipt requests

16. **Priority Flags**
    - Set message priority (high/normal/low)
    - Display priority in message list

### UI/UX Improvements
17. **Virtual Scrolling**
    - Render only visible messages in list
    - Use tanstack-virtual for performance
    - Handle 10,000+ messages smoothly

18. **Density Options**
    - Compact, comfortable, spacious view modes
    - Adjustable in settings
    - Per-user preference

19. **Layout Options**
    - Three-column (folder list, message list, message view)
    - Two-column (message list, message view)
    - Single-column (mobile)
    - Configurable sidebar position (left/right)

20. **Context Menus**
    - Right-click on messages, folders, contacts
    - Touch-and-hold on mobile
    - Keyboard-accessible (Shift+F10 or context menu key)

21. **Tooltips with Tippy.js**
    - Helpful tooltips throughout UI
    - Show keyboard shortcuts in tooltips
    - Accessible (ARIA)

22. **Desktop Notifications**
    - Notify on new messages
    - Notification sound (configurable)
    - Notification preview (subject, sender)
    - Do not disturb mode

23. **Push Notifications**
    - Service worker push notifications
    - Background message sync
    - Badge API for unread count

24. **Loading States & Skeleton Screens**
    - Skeleton screens while loading
    - Progress indicators for long operations
    - Optimistic UI updates

25. **Swipe Gestures (Mobile)**
    - Swipe right to archive
    - Swipe left to delete
    - Swipe to star/unstar
    - Configurable actions

---

## ❌ Medium Priority Missing Features

### Advanced Email
26. **Unified Inbox**
    - Aggregate messages from all accounts
    - Filter by account
    - Smart inbox with priority messages
    - Per-account color coding

27. **Multiple Accounts**
    - Add unlimited email accounts
    - Quick account switcher
    - Per-account settings
    - Separate view for each account

28. **Vacation Responder**
    - Enable/disable auto-reply
    - Start and end date
    - Subject and message body (HTML + plain text)
    - Send once per sender
    - Exclude domains (mailing lists)

29. **Sieve Filtering**
    - GUI for creating Sieve filters
    - Syntax highlighting for manual editing
    - Validation and error checking
    - Test filters before applying
    - Import/export Sieve scripts

30. **Mailto Handler**
    - Register as `mailto:` protocol handler
    - Handle mailto: links from other apps
    - Parse mailto: URL parameters (to, cc, bcc, subject, body)

31. **Real-Time Updates**
    - Poll API for new messages (configurable interval: 1-15 min)
    - WebSocket connection (if API supports)
    - Server-Sent Events fallback
    - Update UI in real-time

32. **Search Folders (Virtual Folders)**
    - Save searches as folders
    - Dynamic filtering
    - Appear alongside regular folders

### Import/Export
33. **Import Functionality**
    - Import .eml files
    - Import .mbox files
    - Import contacts (.vcf, .csv)
    - Import calendar (.ics)
    - Import settings (JSON)

34. **Export Functionality**
    - Export messages as .eml
    - Export messages as .mbox
    - Export contacts as .vcf
    - Export calendar as .ics
    - Export settings as JSON
    - Export all data (GDPR compliance)

### Accessibility
35. **WCAG 2.1 Level AA Compliance**
    - Semantic HTML with proper ARIA labels
    - Keyboard navigation for all functionality
    - Screen reader support (test with NVDA, JAWS, VoiceOver)
    - Visible focus indicators
    - Skip links for navigation

36. **High Contrast Mode**
    - High contrast theme option
    - Color-blind friendly color schemes

37. **Reduced Motion Option**
    - Respect `prefers-reduced-motion`
    - Disable animations when enabled

### Internationalization
38. **Multi-Language Support**
    - Full UI translation (40+ languages matching SnappyMail)
    - Language auto-detection from browser
    - User-selectable language
    - Date/time localization using date-fns
    - Number and currency formatting

39. **RTL Language Support**
    - Full right-to-left layout (Arabic, Hebrew, Persian)
    - RTL text editing in composer
    - RTL-aware UI components
    - Automatic direction detection

---

## ❌ Lower Priority / Future Enhancements

### Advanced Features
40. **LLM Integration**
    - User-configurable LLM endpoint (OpenAI, Anthropic, local)
    - Smart compose suggestions
    - Tone adjustment (formal, casual, friendly)
    - Grammar and style improvements
    - Summarize long emails
    - Generate replies
    - Translate emails
    - Privacy-focused (opt-in, user controls when used)

41. **Grammar and Spelling**
    - Browser-native spell check
    - Optional LanguageTool API integration
    - Inline suggestions
    - User dictionary

42. **Auto-Correct**
    - Configurable auto-correct
    - Common typo corrections
    - Smart quotes
    - Em dash replacement
    - User-defined replacements

43. **Tabs**
    - Open multiple messages in tabs
    - Quick switching between messages
    - Close tabs with middle-click

44. **Feed Reader**
    - RSS/Atom feed support
    - Subscribe to feeds
    - Folder organization

45. **Chat Integration**
    - XMPP/IRC support (if feasible)
    - Inline chat in webmail

46. **Task Management**
    - Create tasks from emails
    - Task list view
    - Due dates and reminders

### Testing & Quality
47. **Comprehensive Test Suite**
    - Unit tests (Vitest) - 80%+ coverage
    - Integration tests
    - E2E tests (Playwright) - all critical flows
    - Performance tests (Lighthouse: 90+ all scores)
    - Security tests (XSS, CSRF, phishing detection accuracy)
    - Accessibility tests (axe DevTools)
    - Cross-browser tests (Chrome, Firefox, Safari, Edge)

48. **Performance Optimization**
    - Code splitting for routes and features
    - Lazy loading
    - Bundle size < 250KB gzipped
    - Initial load < 3s on 3G
    - Time to interactive < 3.5s

---

## 📊 Priority Matrix

### Must Have (MVP) - Do First
1. SpamScanner integration (security critical)
2. External image blocking with whitelist
3. Keyboard shortcuts
4. Message actions (archive, spam, print, .eml download)
5. Multi-select & batch operations
6. Drag-and-drop messages to folders
7. Virtual scrolling (performance)
8. Markdown support in composer
9. Templates/canned responses
10. Desktop notifications

### Should Have - Do Soon
11. Filters & rules
12. Labels/tags system
13. Send later (scheduled sending)
14. Context menus
15. Tooltips (Tippy.js)
16. Swipe gestures (mobile)
17. Density options
18. Layout options
19. Multiple accounts
20. Unified inbox

### Could Have - Do Later
21. Vacation responder
22. Sieve filtering
23. Mailto handler
24. Real-time updates (polling)
25. Search folders
26. Import/Export (.eml, .mbox, .vcf, .ics)
27. High contrast mode
28. Reduced motion
29. Multi-language support (i18n)
30. RTL support

### Won't Have (Yet) - Future
31. LLM integration
32. Grammar/spelling (LanguageTool)
33. Tabs
34. Feed reader
35. Chat integration
36. Task management

---

## 🔧 Technical Debt & Improvements Needed

### Code Quality
- **Vue Migration**: Currently using Knockout.js, spec recommends React/Vue/Svelte
  - Vue migration is partially done (components created but not in use)
  - Need to fully switch from `index.html` (Knockout) to Vue version

### Search Enhancements
- **PGP Encrypted Message Indexing**: FlexSearch needs to index decrypted content
- **Search Operators**: Implement `from:`, `to:`, `subject:`, `is:`, `has:`, `before:`, `after:`, `size:`
- **Search-as-you-type**: Debounced search with instant results

### Attachment Improvements
- **Thumbnail Generation**: For document previews
- **Virus Scanning**: Via SpamScanner API before download
- **Download All as ZIP**: Bulk download feature
- **Dangerous File Type Warnings**: Based on 195+ executable extensions

### Contact Autocomplete
- **Better Matching**: Fuzzy search, recently used, frequent contacts
- **Contact Suggestions**: Auto-add from sent/received emails
- **Visual Improvements**: Better dropdown styling with avatars

### Calendar Gaps
- **Recurring Events**: Daily, weekly, monthly, yearly with exceptions
- **Event Reminders**: Notification before event (5/10/15/30 min, 1 hour, 1 day)
- **Meeting Invites**: Send .ics attachments, RSVP functionality
- **CalDAV Sync**: Two-way sync with Forward Email API
- **Timezone Support**: Display in user timezone with conversion

### Settings Enhancements
- **More Granular Controls**: Message read delay, check mail interval, messages per page
- **Default Compose Format**: HTML vs Plain Text
- **Auto-signature Based on Recipient**: Domain-based signature selection
- **Experimental Features Toggle**: Beta features opt-in

---

## 📝 Implementation Notes

### Next Immediate Steps (Recommended Order)

1. **SpamScanner Integration** - Security critical
   - Install SpamScanner SDK or use API
   - Scan incoming messages for phishing/malware
   - Display warnings for suspicious content
   - Add link safety checks before opening URLs

2. **Keyboard Shortcuts** - High user value
   - Create keyboard shortcut manager
   - Implement common shortcuts (c, r, a, f, e, #, s, u, j, k, o, g+i, g+s, g+d, /, ?)
   - Add customization UI in settings
   - Show shortcuts in tooltips

3. **External Image Blocking** - Privacy feature
   - Block external images by default
   - "Load images" button per message
   - Whitelist by sender/domain
   - Store preferences in IndexedDB

4. **Virtual Scrolling** - Performance improvement
   - Install tanstack-virtual
   - Implement in message list
   - Handle 10,000+ messages smoothly

5. **Multi-Select & Batch Operations** - Core UX
   - Add checkboxes to message list
   - Select all, select none, toggle selection
   - Bulk actions: move, delete, mark as read/unread, star

6. **Message Actions** - Feature parity
   - Archive button (move to Archive folder)
   - Spam button (move to Spam folder)
   - Print button (window.print after formatting)
   - Download as .eml
   - View source modal

---

## ✅ Verification Checklist

When implementing features, verify against spec:

- [ ] Feature matches specification requirements
- [ ] Works offline (if applicable)
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Screen reader compatible (ARIA labels)
- [ ] Secure (sanitized, validated)
- [ ] Performant (< 500ms interaction)
- [ ] Tested across browsers
- [ ] Documented

---

**End of Feature Gaps Analysis**
