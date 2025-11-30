MAC keyboard shortcuts (essential, Thunderbird-style) and a lightweight implementation plan that avoids browser defaults.

## Shortcut set (macOS, avoids browser-reserved Cmd+N/T/W/Q/S/P/L)
| Area | Action | Key |
| --- | --- | --- |
| Message actions | Star | `S` |
|  | Archive | `A` |
|  | Mark read/unread | `M` |
|  | Mark thread read | `R` |
|  | Mark all read | `Shift+C` |
|  | Mark junk / not junk | `J` / `Shift+J` |
|  | Delete | `Del` (avoid `Cmd+Backspace` to prevent mac delete-file) |
| Compose | New message | `C` (avoids `Cmd+N`) |
|  | Reply / Reply all | `R` / `Shift+R` (avoid `Cmd+R` reload) |
|  | Forward | `F` (avoid `Cmd+L` address bar) |
| Navigation | Next unread / Prev unread | `N` / `P` |
|  | Next / Prev message | `F` / `B` |
|  | Scroll/next unread | `Space` |
|  | Expand / Collapse thread | `→` / `←` |
|  | Expand all / Collapse all | `*` / `\\` |
| Search & filter | Global search | `Cmd+K` (common and low-conflict on mac) |
|  | Quick filter current folder | `Cmd+Shift+K` |
|  | Find in message | `/` (fallback when `Cmd+F` is left to browser) |
| Tagging | Add/remove tag | `1-9` |
|  | Clear tags | `0` |

Notes:
- Reserve browser defaults: do not bind `Cmd+N/T/W/Q/S/P/L`, `Cmd+R`, `Cmd+F` unless user opts in. Provide an “enable browser overrides” toggle in settings if needed.
- Use `metaKey` checks for mac detection (`navigator.platform` / `navigator.userAgentData`), falling back to ctrlKey for other platforms.

## Implementation steps
1) Define a platform-aware keymap: map semantic actions to bindings, with a flag for “requires opt-in” for browser-reserved combos; include mac variants (meta) and plain keys.  
2) Centralize a key handling hook/service: listen at the app shell, ignore when focus is in inputs/textareas/contenteditable unless the shortcut is explicitly allowed (e.g., find).  
3) Wire actions to existing message list/controller APIs: star/archive/mark/junk/delete, compose/reply/forward, navigation, search/filter triggers. Ensure thread expansion handlers respect current selection/focus.  
4) Add a shortcuts help modal (`?` or `Shift+/`) that surfaces the mac set, shows whether browser overrides are enabled, and links to settings.  
5) Add setting to enable browser overrides (Cmd+R/F/S/P etc.). Gate registering those listeners on the setting; persist per user. Provide telemetry/logging for conflicts and usage.  
6) Tests: unit-test keymap resolution (meta vs ctrl), guarded context (no firing inside inputs), and action dispatch. Add a couple of Cypress/Playwright flows for message list shortcuts (star/archive, navigation) and search/filter triggers.
