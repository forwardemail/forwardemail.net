# CalDAV Local Testing Guide

This guide will help you test the CalDAV server locally, including VTODO (Tasks) support with Thunderbird and Apple Calendar.

## Quick Start

**⚠️ IMPORTANT DNS SETUP REQUIREMENT:**

Even for local testing, you **must** have a real domain with DNS access. The CalDAV server requires proper DNS TXT verification records for authentication. This means:

1. **You need a domain you control** (e.g., `example.com`) where you can add TXT records
2. **You need to add a DNS TXT record** provided by the setup script (format: `forward-email=VERIFICATION_TOKEN`)
3. **Test domains must have proper DNS records** - there is no DNS bypass for local development

**Recommended Setup Options:**

- **Option 1 (Easiest):** Use a subdomain of a domain you own (e.g., `caldav-test.yourdomain.com`) and add the TXT record to your DNS provider
- **Option 2:** Use a free DNS service like Cloudflare with a test domain to manage TXT records
- **Not Supported:** Using ngrok domains directly (they don't allow custom DNS records)

If you don't have a domain with DNS access, you'll need to obtain one before proceeding with CalDAV testing.

### 1. Prerequisites

- **A domain with DNS access** (required for TXT verification records)
- MongoDB running locally
- Redis running locally
- Node.js v18.20.4
- Dependencies installed (`pnpm install`)

### 2. Create Test Account

Run the setup script to create a test account with all necessary configurations:

```bash
node scripts/setup-caldav-test-account.js
```

This will output your connection details:
- Server URL: `http://localhost:5000/`
- Username: `test@caldav-test-XXXXXXXXX.com`
- Password: `[generated token]`
- **DNS TXT Record:** `forward-email=VERIFICATION_TOKEN`

**💡 Save these credentials!** The token cannot be retrieved later.

**🔴 CRITICAL STEP:** You **must** add the DNS TXT record to your domain before you can authenticate.

1. Copy the DNS TXT record value from the output (format: `forward-email=VERIFICATION_TOKEN`)
2. Add this TXT record to your domain's DNS settings
3. Wait for DNS propagation (usually 5-10 minutes, can be up to 48 hours)
4. Verify DNS is working: `dig TXT yourdomain.com` or use https://toolbox.googleapps.com/apps/dig/

**Without the DNS TXT record, authentication will fail with "Domain is missing TXT verification record".**

Credentials are also saved to `.caldav-test-credentials.json` (git-ignored).

### 3. Start the CalDAV Server

In a separate terminal window:

```bash
npm start caldav
```

The server will start on port 5000.

### 4. Configure Your Calendar Client

Choose one of the following clients to test with:

---

## Apple Calendar (macOS/iOS)

### macOS Setup

1. **Open System Settings**
   - Go to **System Settings** → **Internet Accounts**

2. **Add CalDAV Account**
   - Click the **+** button or "Add Account"
   - Select **Other CalDAV Account** (or just "CalDAV")

3. **Configure Account**
   - **Account Type:** Manual
   - **Server Address:** `localhost:5000`
   - **Username:** `test@caldav-test-XXXXXXXXX.com` (from setup script)
   - **Password:** `[your generated token]`
   - **Port:** `5000`
   - **Use SSL:** ❌ **Unchecked** (for local testing)

4. **Verify Connection**
   - Click **Sign In**
   - macOS will verify the connection
   - Select which items to sync (Calendar, Reminders)

5. **Open Calendar App**
   - You should see two calendars:
     - **Default** (for events/VEVENT)
     - **Tasks** (for tasks/VTODO)

### iOS Setup

1. **Open Settings**
   - Go to **Settings** → **Calendar** → **Accounts**

2. **Add Account**
   - Tap **Add Account**
   - Select **Other** → **Add CalDAV Account**

3. **Configure Account**
   - **Server:** `[your-mac-ip]:5000` (use your Mac's local IP, not localhost)
   - **Username:** `test@caldav-test-XXXXXXXXX.com`
   - **Password:** `[your generated token]`
   - **Description:** CalDAV Test
   - **Use SSL:** ❌ **Off**

4. **Find Your Mac's IP**
   ```bash
   # On your Mac, run:
   ipconfig getifaddr en0
   ```

---

## Testing with ngrok (Recommended for Apple Calendar)

Apple Calendar requires HTTPS for authentication. Use ngrok to create a secure tunnel.

**⚠️ Important:** You will need to add the proper DNS TXT verification record for your test domain in order to authenticate. The setup script will provide you with the verification record to add.

### 1. Install ngrok

```bash
brew install ngrok
```

### 2. Start ngrok tunnel

```bash
# Start ngrok tunnel to port 5000
ngrok http 5000
```

ngrok will display a forwarding URL like:
```
Forwarding  https://silicious-demetra-restrainingly.ngrok-free.dev -> http://localhost:5000
```

**Keep ngrok running** - leave this terminal open.

### 3. Create test account

In a **new terminal**, set environment variables and run the setup script:

```bash
# Use the domain from your ngrok URL (without https://)
export CALDAV_TEST_DOMAIN=silicious-demetra-restrainingly.ngrok-free.dev

# Use the full ngrok URL
export CALDAV_SERVER_URL=https://silicious-demetra-restrainingly.ngrok-free.dev/

# Run the setup script
node scripts/setup-caldav-test-account.js
```

**Save the credentials** from the output:
- Username: `test@silicious-demetra-restrainingly.ngrok-free.dev`
- Password: `[generated token]`
- Server URL: `https://silicious-demetra-restrainingly.ngrok-free.dev/`
- **DNS TXT Record:** `forward-email=VERIFICATION_TOKEN`

**⚠️ IMPORTANT:** You must add the DNS TXT record to your domain for authentication to work. Since ngrok domains cannot have custom DNS records, you have two options:

1. **Use a real domain you own:** Instead of the ngrok domain, use your own domain (e.g., `test.yourdomain.com`) and add the TXT record to your DNS provider
2. **For local-only testing:** Use `localhost` without ngrok (see the non-ngrok setup above), though this won't work with Apple Calendar

### 4. Start required servers

You need **three servers** running. Open three new terminal windows:

**Terminal 2: Start SQLite server**
```bash
npm start sqlite
```

**Terminal 3: Start IMAP server**
```bash
npm start imap
```

**Terminal 4: Start CalDAV server**
```bash
npm start caldav
```

**Summary of running processes:**
- Terminal 1: ngrok tunnel (must stay running)
- Terminal 2: SQLite server (handles storage)
- Terminal 3: IMAP server (required for CalDAV operations)
- Terminal 4: CalDAV server (handles calendar sync)

**Note:** The SQLite database will be automatically initialized when you first authenticate with CalDAV. No manual initialization is required.

### 5. Configure Apple Calendar

1. **Open System Settings → Internet Accounts**
2. **Add Account → Add Other Account... → Add a CalDAV account**
3. **Enter credentials:**
   - **Account Type:** Advanced
   - **Username:** `test@silicious-demetra-restrainingly.ngrok-free.dev`
   - **Password:** `[your generated token from step 3]`
   - **Server Address:** `silicious-demetra-restrainingly.ngrok-free.dev`
   - **Server Path:** `/dav/test@silicious-demetra-restrainingly.ngrok-free.dev/user/`
   - **Port:** `443`
   - **Use SSL:** ✅ **Checked**
4. **Sign In**

Your calendars should now appear in the Calendar app!

---

## Thunderbird

### 1. Install Thunderbird

Download from: https://www.thunderbird.net/

### 2. Install TbSync Add-on

1. Open Thunderbird
2. Go to **Tools** → **Add-ons and Themes** (or press `Cmd+Shift+A`)
3. Search for **TbSync**
4. Click **Add to Thunderbird**
5. Restart Thunderbird if prompted

### 3. Install Provider for CalDAV & CardDAV

1. In Add-ons, search for **Provider for CalDAV & CardDAV**
2. Click **Add to Thunderbird**
3. Restart Thunderbird if prompted

### 4. Configure CalDAV Account

1. **Open TbSync Settings**
   - Go to **Tools** → **Add-ons and Themes**
   - Click on **TbSync** in the left sidebar
   - Click **Account Actions** → **Add new account**

2. **Select CalDAV & CardDAV**
   - Choose **CalDAV & CardDAV**
   - Click **Continue**

3. **Configure Connection**
   - **Account name:** CalDAV Test
   - **User name:** `test@caldav-test-XXXXXXXXX.com` (from setup script)
   - **Password:** `[your generated token]`
   - **CalDAV server address:** `http://localhost:5000/`
   - Click **Create Account**

4. **Enable Synchronization**
   - In TbSync, find your new account
   - Click **Enable and synchronize this account**
   - Select which calendars to sync:
     - ✅ **Default** (for events)
     - ✅ **Tasks** (for VTODO objects)

5. **Access Calendars**
   - Click on **Calendar** tab in Thunderbird (or press `Cmd+Shift+C`)
   - You should see both calendars in the left sidebar

---

## Testing VTODO (Tasks)

### Create a Task

#### Apple Reminders (macOS)
1. Open **Reminders** app
2. Select the CalDAV account
3. Click **+ New Reminder**
4. Add task details:
   - Title: "Test CalDAV Task"
   - Notes, due date, priority, etc.
5. The task should sync to the server

#### Thunderbird
1. Open **Calendar** or **Tasks** view
2. Right-click in the calendar → **New Task**
3. Fill in task details:
   - Title: "Test CalDAV Task"
   - Priority: Normal
   - Status: Not Started
   - Due date: [any date]
4. Click **Save and Close**

### Verify Sync

1. **Create a task in one client** (e.g., Thunderbird)
2. **Check the other client** (e.g., Apple Reminders)
3. The task should appear after a sync cycle (usually within seconds)

### Test Task Updates

Try these operations to verify full VTODO support:

- **Mark task as complete**
  - Thunderbird: Right-click → Mark Completed
  - Apple: Check the checkbox

- **Update task priority**
  - Change between None, Low, Medium, High

- **Add/edit due dates**
  - Set different due dates and times

- **Update task status**
  - Not Started → In Progress → Completed
  - (Thunderbird supports more statuses than Apple Reminders)

- **Delete tasks**
  - Delete in one client and verify removal in the other

---

## Testing Calendar Events (VEVENT)

### Create an Event

1. **In Calendar view**, click on a date/time
2. **Add event details:**
   - Title: "Test CalDAV Event"
   - Location: "Test Location"
   - Start/End times
   - Notes/Description

3. **Add attendees** (optional)
   - Add an email address as an attendee
   - Check if calendar invites are sent

### Test Recurring Events

1. Create an event
2. Set it to recur (daily, weekly, monthly)
3. Verify the recurrence appears correctly in both clients

### Test Event Invitations

The CalDAV server supports sending calendar invitations:

1. Create an event with an attendee
2. Check the `/tmp` folder or email logs for sent invitations
3. The invitation should be in iCalendar format (`.ics`)

---

## Unified vs. Separate Calendars

### Understanding Calendar Types

The Forward Email CalDAV server supports two calendar models:

#### **Unified Calendars** (Recommended)
- A single calendar that supports **both VEVENT (events) and VTODO (tasks)**
- Default behavior for most clients
- Simplifies calendar management
- Ideal for users who want events and tasks in one place
- `supported-calendar-component-set`: `['VEVENT', 'VTODO']`

#### **Separate Calendars** (Legacy/Apple-specific)
- Separate calendars for events and tasks
- Previously used for Apple Reminders compatibility
- Still supported for backward compatibility
- Task-only calendars: `supported-calendar-component-set`: `['VTODO']`
- Event-only calendars: `supported-calendar-component-set`: `['VEVENT']`

### Current Implementation

**As of January 2025**, the server creates **unified calendars by default**:

- **Default Calendar**: Supports both events and tasks (`VEVENT` + `VTODO`)
- **Apple Devices**: Receive a unified "Calendar" that handles both types
- **Other Clients**: Also receive unified calendar support

**Backward Compatibility:**
- Existing separate task calendars are preserved
- Clients can still create task-specific calendars if needed
- The server automatically detects component types

### Testing Unified Calendars

```bash
# Run the unified calendar test
npm test test/caldav/index.js -- --match "unified calendar should accept both VEVENT and VTODO"
```

**What to verify:**
1. Create an event in the calendar
2. Create a task in the **same** calendar
3. Both should coexist without conflicts
4. Filtering by component type should work correctly

---

## Apple Reminders Specific Testing

### How Apple Reminders Works with CalDAV

Apple's implementation has some unique characteristics:

**Calendar Names:**
- Apple uses **localized calendar names** (e.g., "Calendar", "Reminders")
- The server maps these to `DEFAULT_CALENDAR_NAME` and `DEFAULT_TASK_CALENDAR_NAME`
- Supports multiple languages (English, Spanish, Italian, etc.)

**Unified Calendar Support:**
- Modern Apple devices work well with unified calendars
- Tasks created in Apple Reminders sync to the unified calendar
- Events created in Apple Calendar sync to the same calendar

### Apple Reminders Testing Checklist

#### **Basic Task Operations**
- [ ] Create a simple reminder (title only)
- [ ] Add a due date
- [ ] Add a due time
- [ ] Add notes/description
- [ ] Set priority (None, Low, Medium, High)
- [ ] Mark as complete
- [ ] Delete the reminder

#### **Advanced Features**
- [ ] **Recurring Tasks**: Daily, weekly, monthly reminders
- [ ] **Subtasks**: Create a reminder with sub-items
- [ ] **Location-based**: Add a location to a reminder
- [ ] **Time-based alerts**: Set notification 15 min/1 hour before
- [ ] **Tags**: Add categories/tags to reminders
- [ ] **Lists**: Test with different reminder lists

#### **Sync Testing**
- [ ] Create reminder in Apple Reminders → verify in Thunderbird
- [ ] Create task in Thunderbird → verify in Apple Reminders
- [ ] Update reminder in one client → verify sync in another
- [ ] Complete task in one client → verify in another
- [ ] Delete reminder → verify removal across clients

### Apple-Specific Properties

Apple Reminders uses custom properties that may not be supported by all clients:

```ics
X-APPLE-SORT-ORDER: 1            # Display order
X-APPLE-NEEDS-REPLY: FALSE        # Reply required flag
X-APPLE-STRUCTURED-LOCATION       # Enhanced location data
X-APPLE-RADIUS: 100               # Location radius for alerts
X-APPLE-DEFAULT-ALARM: TRUE       # System default alarm
```

**Note:** These properties are preserved by the server but may not be interpreted by non-Apple clients.

### Known Apple Quirks

1. **Priority Mapping**:
   - Apple: 0 (none), 1-4 (high), 5 (medium), 6-9 (low)
   - CalDAV: 1 (high), 5 (medium), 9 (low)
   - The server preserves the exact priority value

2. **Completion Behavior**:
   - Apple automatically sets `COMPLETED` timestamp
   - Apple sets `PERCENT-COMPLETE:100` when marking complete
   - Both properties are synced correctly

3. **Recurrence**:
   - Apple supports complex recurrence rules via `RRULE`
   - All standard frequencies work (DAILY, WEEKLY, MONTHLY, YEARLY)
   - Custom rules are preserved but may display differently in other clients

---

## Known Limitations and Client Differences

### Feature Compatibility Matrix

| Feature | Apple Reminders | Thunderbird | Google Tasks | Notes |
|---------|----------------|-------------|--------------|-------|
| **Basic VTODO** | ✅ | ✅ | ✅ | Full support |
| **Due Dates** | ✅ | ✅ | ✅ | All clients |
| **Due Times** | ✅ | ✅ | ⚠️ | Google uses date only |
| **Priority** | ✅ | ✅ | ⚠️ | Google limited |
| **Status** | ⚠️ | ✅ | ⚠️ | Apple: 3 states, TB: 4 states |
| **Percent Complete** | ✅ | ✅ | ❌ | Not in Google |
| **Recurrence (RRULE)** | ✅ | ✅ | ❌ | Google limited |
| **Subtasks** | ✅ | ⚠️ | ✅ | Via RELATED-TO |
| **Location** | ✅ | ✅ | ❌ | Limited support |
| **Categories/Tags** | ⚠️ | ✅ | ❌ | Apple via lists |
| **Alarms/Reminders** | ✅ | ✅ | ⚠️ | Format differences |

**Legend:**
- ✅ Full support
- ⚠️ Partial support or different behavior
- ❌ Not supported

### Common Differences

#### **1. Status Values**

**Apple Reminders:**
- `NEEDS-ACTION` → Not completed
- `COMPLETED` → Completed
- (`IN-PROCESS` not commonly used)

**Thunderbird:**
- `NEEDS-ACTION` → Not Started
- `IN-PROCESS` → In Progress
- `COMPLETED` → Completed
- `CANCELLED` → Cancelled

**Recommendation:** Stick to `NEEDS-ACTION` and `COMPLETED` for maximum compatibility.

#### **2. Time Zones**

- **Apple:** Handles time zones automatically based on system settings
- **Thunderbird:** Explicit timezone support via `TZID`
- **Server:** Stores UTC times, converts as needed

**Best Practice:** Use UTC times (`Z` suffix) or explicit `TZID` for consistency.

#### **3. Recurring Tasks**

- **Apple:** Creates instances on-demand as tasks are completed
- **Thunderbird:** Displays all future occurrences based on `RRULE`
- **Server:** Stores the `RRULE` and lets clients handle expansion

#### **4. Subtasks (RELATED-TO)**

- **Apple:** Native subtask support in Reminders
- **Thunderbird:** Shows as separate tasks with relationship
- **Format:** Uses `RELATED-TO;RELTYPE=PARENT:parent-uid`

### Testing Client Compatibility

```bash
# Test with Apple Reminders format
npm test test/caldav/index.js -- --match "VTODO with Apple-specific properties"

# Test with categories (Thunderbird)
npm test test/caldav/index.js -- --match "VTODO with categories"

# Test subtasks
npm test test/caldav/index.js -- --match "VTODO with subtasks"
```

---

## Troubleshooting VTODO Sync Issues

### Tasks Not Appearing

**Problem:** Tasks created in one client don't appear in another

**Diagnostic Steps:**

1. **Check calendar component support:**
   ```bash
   # Use curl to query calendar properties
   curl -X PROPFIND "http://localhost:5000/calendars/user@example.com/" \
     -u "user@example.com:TOKEN" \
     -H "Depth: 1" \
     -H "Content-Type: application/xml" \
     -d '<?xml version="1.0"?>
   <d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
     <d:prop>
       <d:displayname/>
       <c:supported-calendar-component-set/>
     </d:prop>
   </d:propfind>'
   ```

2. **Verify VTODO component in response:**
   - Look for `<C:comp name="VTODO"/>`
   - If missing, calendar doesn't support tasks

3. **Check client filtering:**
   - Some clients filter by component type
   - Ensure "Tasks" or "To-Dos" view is enabled

**Solutions:**
- Use a calendar that supports VTODO (unified or task-specific)
- Recreate the account in the client
- Check client sync settings (some clients sync tasks separately)

### Sync Delays

**Problem:** Changes take a long time to appear across clients

**Causes:**
- Client sync interval (some clients sync every 15-30 minutes)
- Network issues
- Server processing delays

**Solutions:**
- **Apple Reminders:** Changes sync almost immediately
- **Thunderbird:** Right-click calendar → "Synchronize"
- **Force sync:** Modify a task to trigger sync
- Check CalDAV server logs for sync requests

### Recurring Tasks Not Working

**Problem:** Recurring tasks only appear once or don't recur properly

**Diagnostic:**
```bash
# Check if RRULE is preserved
npm test test/caldav/index.js -- --match "VTODO with RRULE"
```

**Common Issues:**
1. **Client doesn't support task recurrence** (e.g., Google Tasks)
2. **RRULE syntax error** - validate RRULE format
3. **Different recurrence models** - Apple vs. Thunderbird handle differently

**Solution:**
- Test RRULE in iCalendar validator
- Use simple recurrence rules (DAILY, WEEKLY, MONTHLY)
- Check client documentation for recurrence support

### Subtasks Not Syncing

**Problem:** Subtasks appear in one client but not another

**Check:**
```bash
# Verify RELATED-TO is preserved
npm test test/caldav/index.js -- --match "VTODO with subtasks"
```

**Notes:**
- Not all clients support subtasks
- Apple Reminders: Native support
- Thunderbird: Shows as linked tasks
- Google Tasks: May show as separate tasks

### Location Data Lost

**Problem:** Location data doesn't sync between clients

**Cause:** Different location formats:
- Apple: `X-APPLE-STRUCTURED-LOCATION` + `GEO` + `LOCATION`
- Standard: `LOCATION` + `GEO`

**Solution:**
- Server preserves all location properties
- Use simple `LOCATION` text for compatibility
- GEO coordinates work across most clients

### Categories/Tags Missing

**Problem:** Categories don't appear in all clients

**Compatibility:**
- Thunderbird: Full `CATEGORIES` support
- Apple: Uses lists instead of categories
- Others: Limited or no support

**Workaround:**
- Use task description for tags if needed
- Keep categories simple (single words)
- Don't rely on categories for critical organization

### Priority Not Syncing Correctly

**Problem:** Priority levels appear differently across clients

**Explanation:**
Different clients use different priority scales:

| CalDAV | Apple | Display |
|--------|-------|---------|
| 0 | 0 | Undefined |
| 1 | 1 | High |
| 5 | 5 | Medium |
| 9 | 9 | Low |

**Solution:**
- Server preserves exact priority values
- Clients interpret based on their scale
- Stick to 1 (high), 5 (medium), 9 (low) for consistency

### Debugging Tips

**1. Enable CalDAV Server Logging:**
```bash
# Set debug mode
DEBUG=* npm start caldav
```

**2. Check MongoDB Data:**
```bash
mongosh
use forward_email
# View calendars
db.calendars.find({}).pretty()
# View calendar events (includes VTODO)
db.calendarevents.find({ componentType: 'VTODO' }).pretty()
```

**3. Inspect Raw ICS Data:**
```bash
# Fetch task via curl
curl "http://localhost:5000/calendars/user@example.com/tasks/task-id.ics" \
  -u "user@example.com:TOKEN"
```

**4. Run Specific Tests:**
```bash
# Test unified calendar
npm test test/caldav/index.js -- --match "unified"

# Test time ranges
npm test test/caldav/index.js -- --match "timeRange"

# Test all VTODO tests
npm test test/caldav/index.js -- --match "VTODO"
```

### Getting More Help

If you still experience issues:

1. **Check server logs** for errors or warnings
2. **Run automated tests** to verify server functionality:
   ```bash
   npm test test/caldav/index.js
   ```
3. **Export task as .ics** and inspect manually
4. **Compare with sample files** in `test/caldav/data/vtodo-*.ics`
5. **Open an issue** with:
   - Client name and version
   - Task ICS content (sanitized)
   - Server logs (relevant sections)
   - Steps to reproduce

---

## Troubleshooting

### Connection Refused

**Problem:** Client can't connect to `localhost:5000`

**Solutions:**
- Verify CalDAV server is running: `npm start caldav`
- Check server logs for errors
- Try `127.0.0.1:5000` instead of `localhost:5000`

### Authentication Failed

**Problem:** Invalid username or password

**Solutions:**
- Verify you're using the **alias email** as username (not the user email)
- Verify you're using the **generated token** as password
- Check `.caldav-test-credentials.json` for saved credentials
- Re-run setup script to generate new credentials

### Calendars Not Appearing

**Problem:** No calendars show up after connecting

**Solutions:**
- Check that the alias has `has_imap: true` enabled
- Verify the user has an active `enhanced_protection` plan
- Check CalDAV server logs for errors
- Try disconnecting and reconnecting the account

### Tasks Not Syncing

**Problem:** Tasks (VTODO) don't appear in clients

**Solutions:**
- Ensure you're using the **Tasks** calendar, not the Default calendar
- Verify the calendar's `supported-calendar-component-set` includes `VTODO`
- Check that VTODO support is enabled (it was added recently)
- Look for the calendar named "Tasks" specifically

### "Database is missing" Error

**Problem:** Creating tasks/events fails with "Database is missing" error

**Status:** ✅ **This issue has been fixed** as of January 2025. You should no longer encounter this error if you're running the latest code.

**Root Cause:** The SQLite database needs to be initialized before CalDAV operations will work. The CalDAV server now automatically syncs with the database on authentication.

**Solution (if you still encounter this):**
1. **Ensure required servers are running**:
   ```bash
   # Terminal 1: SQLite
   npm start sqlite

   # Terminal 2: IMAP
   npm start imap

   # Terminal 3: CalDAV
   npm start caldav
   ```

2. **Verify automatic initialization**: Check the CalDAV server logs - you should see "tmp db sync complete" when authenticating

The database is automatically initialized on first authentication. If you see the "Database is missing" error, ensure all three servers are running and try authenticating again.

**What was fixed:**
- CalDAV now properly syncs with SQLite database on authentication (similar to IMAP/POP3)
- Query results automatically maintain session and database context for subsequent operations
- Calendar component validation now properly passes database context

### iOS Can't Connect

**Problem:** iOS devices can't reach `localhost:5000`

**Solutions:**
- Use your Mac's **local IP address** instead of `localhost`
- Find your IP: `ipconfig getifaddr en0` (on Mac)
- Use format: `192.168.1.x:5000` where x is your IP
- Ensure both devices are on the same network
- Disable SSL in iOS CalDAV settings

---

## Advanced Testing

### Manual CalDAV Requests

You can test the CalDAV server directly with `curl`:

#### Service Discovery (PROPFIND)

```bash
curl -X PROPFIND http://localhost:5000/ \
  -u "test@caldav-test-XXXXXXXXX.com:YOUR_TOKEN" \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:current-user-principal/>
  </d:prop>
</d:propfind>'
```

#### List Calendars

```bash
curl -X PROPFIND "http://localhost:5000/calendars/USERNAME/" \
  -u "test@caldav-test-XXXXXXXXX.com:YOUR_TOKEN" \
  -H "Depth: 1" \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  <d:prop>
    <d:displayname/>
    <c:calendar-description/>
    <c:supported-calendar-component-set/>
  </d:prop>
</d:propfind>'
```

#### Create a VTODO

```bash
curl -X PUT "http://localhost:5000/calendars/USERNAME/tasks/test-task-1.ics" \
  -u "test@caldav-test-XXXXXXXXX.com:YOUR_TOKEN" \
  -H "Content-Type: text/calendar; charset=utf-8" \
  -d 'BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV Test//EN
BEGIN:VTODO
UID:test-task-1@caldav-test.com
DTSTAMP:20250107T120000Z
SUMMARY:Test Task from cURL
STATUS:NEEDS-ACTION
PRIORITY:5
DUE:20250115T170000Z
END:VTODO
END:VCALENDAR'
```

### Using tsdav Library

The test suite uses the `tsdav` library. You can test programmatically:

```javascript
const tsdav = require('tsdav');

const authHeaders = tsdav.getBasicAuthHeaders({
  username: 'test@caldav-test-XXXXXXXXX.com',
  password: 'YOUR_TOKEN'
});

const account = await tsdav.createAccount({
  account: {
    serverUrl: 'http://localhost:5000/',
    accountType: 'caldav'
  },
  headers: authHeaders
});

const calendars = await tsdav.fetchCalendars({
  account,
  headers: authHeaders
});

console.log('Calendars:', calendars);
```

---

## Running Automated Tests

The project includes comprehensive CalDAV tests with VTODO support:

```bash
# Run all CalDAV tests
npm test test/caldav

# Run specific test file
npm test test/caldav/index.js

# Run with verbose output
DEBUG=* npm test test/caldav
```

Test files include:
- Event creation/update/delete (VEVENT)
- Task creation/update/delete (VTODO)
- Calendar invitations
- Time range queries
- Service discovery
- Multi-calendar sync

---

## Sample VTODO Files

Sample VTODO files for testing are in `test/caldav/data/`:

**Basic Tasks:**
- `vtodo-1.ics` - Basic task with NEEDS-ACTION status
- `vtodo-2.ics` - Task in progress (50% complete)
- `vtodo-completed.ics` - Completed task (100%)
- `vtodo-no-due-date.ics` - Task without due date (someday/maybe)
- `vtodo-partial-completion.ics` - Task with 75% completion

**Advanced Features:**
- `vtodo-recurring.ics` - Recurring daily task (RRULE)
- `vtodo-with-alarm.ics` - Task with multiple reminders (VALARM)
- `vtodo-with-subtasks.ics` - Parent task with 3 subtasks (RELATED-TO)
- `vtodo-with-location.ics` - Task with location and GEO coordinates
- `vtodo-with-categories.ics` - Task with multiple categories/tags
- `vtodo-apple-structured.ics` - Apple Reminders native format with X-APPLE properties

You can import these files directly into your calendar client for testing, or use them as templates for creating your own test cases.

---

## Security Notes

⚠️ **Important:** This setup is for LOCAL TESTING ONLY

- **No SSL/TLS** - Traffic is unencrypted when using localhost (use ngrok for HTTPS)
- **DNS Verification Required** - You must add proper TXT verification records even for test domains
- **Test credentials** - Use different credentials in production
- **Firewall** - Port 5000 should NOT be exposed to the internet
- **ngrok URLs** - ngrok tunnels are temporary and should not be used for production
- **Payment Plan Required** - Test accounts must have a valid plan (enhanced_protection or team) with at least one paying admin

For production deployment, see the main README.md deployment guide.

---

## Cleanup

### Remove Test Account

To remove the test account and clean up:

```bash
# Connect to MongoDB
mongosh

# Switch to database
use forward_email

# Remove test data
db.users.deleteMany({ email: /caldav-test/ })
db.domains.deleteMany({ name: /caldav-test/ })
db.aliases.deleteMany({ name: "test" })
db.payments.deleteMany({ method: "free_beta_program" })
```

### Remove Credentials File

```bash
rm .caldav-test-credentials.json
```

### Disconnect Calendar Client

- **macOS:** System Settings → Internet Accounts → Remove CalDAV account
- **iOS:** Settings → Calendar → Accounts → Delete CalDAV account
- **Thunderbird:** TbSync → Account Actions → Delete account

---

## Getting Help

If you encounter issues:

1. **Check server logs** - Look for errors in the CalDAV server output
2. **Check MongoDB** - Verify test data was created correctly
3. **Check Redis** - Ensure Redis is running and accessible
4. **Review test suite** - See `test/caldav/index.js` for working examples
5. **Open an issue** - https://github.com/forwardemail/forwardemail.net/issues

---

## Next Steps

After successfully testing locally:

1. **Test with multiple clients** - Verify sync between different apps
2. **Test edge cases** - Try invalid data, large calendars, etc.
3. **Performance testing** - Create many events/tasks and test sync speed
4. **Integration testing** - Test with other CalDAV features (recurring events, attachments, etc.)
5. **Production deployment** - Follow the main README.md for deploying to production

---

## References

- [CalDAV RFC 4791](https://tools.ietf.org/html/rfc4791)
- [iCalendar RFC 5545](https://tools.ietf.org/html/rfc5545)
- [VTODO Specification](https://tools.ietf.org/html/rfc5545#section-3.6.2)
- [Apple Calendar Server Extensions](https://github.com/apple/ccs-calendarserver)
- [tsdav Library Documentation](https://github.com/natelindev/tsdav)
