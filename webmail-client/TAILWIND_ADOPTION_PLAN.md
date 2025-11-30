Tailwind CSS adoption plan for the webmail client (Vite + Vue 3, current styling via `src/styles/app.css`, `src/styles/main.css`, and a couple of small `<style>` blocks).

## Current state (inputs for planning)
- Tooling: Vite 5 + Vue 3; no PostCSS config; single HTML entry at `index.html`; PWA plugin in `vite.config.js`.
- Styling: global CSS in `src/styles/app.css` (branding, layout, theming, gradients) and `src/styles/main.css` (toasts, starfield, Schedule-X overrides); minimal scoped styles in `ComposeModal.vue` and `MailboxView.vue`.
- Tokens: custom properties defined in `:root` for brand colors, typography, surfaces; dark/light toggled via `body.light-mode` and `body.mailbox-mode` classes.
- Components/layouts: mostly class-based with `fe-*` naming; no utility framework; no CSS modules.

## Tailwind introduction goals
- Add Tailwind utilities without breaking existing styles; allow gradual migration component-by-component.
- Preserve theming (light/dark) and brand tokens by mapping to Tailwind theme and/or CSS variables.
- Avoid purge issues by correctly configuring `content` globs for Vue + plain JS and HTML.
- Provide a base layer to keep current global resets and backgrounds where needed.

## Tooling & config steps
1) Add deps: `tailwindcss` (init), `postcss`, `autoprefixer`. Generate `postcss.config.js` using Tailwind defaults.  
2) Create `tailwind.config.js`:  
   - `content`: `./index.html`, `./src/**/*.{vue,js,ts,jsx,tsx}`.  
   - `theme.extend`: map brand colors/fonts (from `:root` in `app.css`) e.g. `colors.brand = { primary: '#00aff8', secondary: '#002a90', surface: '#0f172a', text: '#e5e7eb' }`; add `fontFamily` overrides for `brand` and `heading`.  
   - `darkMode: 'class'` (align with `body.light-mode` / default dark).  
   - Add `safelist` if we keep dynamic class names (currently mostly static `fe-*`, so likely not required).  
3) Add Tailwind entry CSS `src/styles/tailwind.css` with `@tailwind base; @tailwind components; @tailwind utilities;`. Import it before existing CSS in `App.vue` (or `main.js`) to allow overrides.  
4) Add a small `@layer base` block in `tailwind.css` to carry over critical global rules: font smoothing, `body` background/gradient defaults, and the light/dark CSS variables (or re-expose them as `:root` custom properties).  
5) Wire PostCSS into Vite (Vite auto-loads `postcss.config.js`; no `vite.config.js` change needed beyond ensuring CSS import order).

## Theming approach
- Keep CSS variables for light/dark to avoid rewriting all color logic immediately; expose them in `@layer base` and use `bg-[var(--color-bg)]`, `text-[var(--color-text)]` as needed.  
- For Tailwind tokens, mirror the variables into the theme `extend.colors` so new components can use class-based colors (`bg-brand-surface`, `text-brand-text`).  
- Consider a `plugin` or `addBase` to set `.light-mode` and `.dark-mode` variants if we want to rely purely on `dark:` utilities later.

## Migration strategy (incremental)
1) Infrastructure: land configs + `tailwind.css`, keep existing `app.css`/`main.css` intact.  
2) Primitives: build Tailwind-based button/input/label utility stacks (`@layer components` with `@apply` for `.fe-button`, `.fe-input`, badges, modals) so existing markup keeps working while gaining Tailwind-powered styling.  
3) Screens: migrate page by page, starting with Login (smallest), then modals (Compose, Passphrase), then Mailbox shell (header/sidebar/list), Contacts/Calendar overrides last.  
4) Remove redundant CSS: after each screen migration, delete corresponding rules from `app.css`/`main.css`; keep starfield and Schedule-X overrides as-is (or move them into a `@layer components` block untouched).  
5) Optional: introduce a typography plugin or `prose` classes for message display if desired.

## Component/class mapping candidates
- Buttons (`.fe-button`, `.fe-button.ghost`, `.fe-icon-btn`, `.fe-compose`): convert to Tailwind + `@apply` for consistency.  
- Form controls (`input`, `.fe-input`, `.fe-textarea`, checkbox rows): Tailwind form controls + focus rings.  
- Layout shells (`.fe-mailbox-wrapper`, `.fe-mailbox-header`, `.fe-mailbox-shell`, `.fe-folders`, `.fe-messages`, `.fe-reader`): convert to flex/grid utilities.  
- Badges/alerts/toasts: map to `rounded`, `border`, `bg-{brand}`; keep light/dark variants via CSS vars or `dark:` utilities.  
- Spacing/typography: replace hard-coded margins/paddings in templates with Tailwind classes during migration.

## Risk & compatibility notes
- Browser styles: ensure we do not accidentally purge dynamic content; verify `content` globs include `.js` Knockout bits if any remain.  
- Style order: import `tailwind.css` before legacy CSS so legacy rules can override until migrated; invert the order once migration is near complete.  
- Bundle size: Tailwind JIT will tree-shake, but safelist only what is needed.  
- Accessibility: re-check focus-visible and contrast after swaps; Tailwind defaults are neutral.  
- Third-party: Schedule-X overrides in `main.css` should remain as plain CSS; they can live in `@layer components` untouched.

## Testing & verification
- Visual regression: before/after screenshots of Login, Mailbox header/sidebar/list, modals, Calendar/Contacts.  
- Automated: add a handful of Playwright/Cypress flows to catch layout regressions (login form, compose modal open, mailbox list/reader).  
- Linting: optional `stylelint` with a Tailwind plugin if we want class order enforcement.

## Work items (suggested order)
1) Add Tailwind + PostCSS configs and `src/styles/tailwind.css` import.  
2) Define theme tokens (colors/fonts/radius/shadows) from existing CSS variables.  
3) Create Tailwind-based component classes for buttons/inputs/badges in `@layer components` to avoid template churn initially.  
4) Migrate Login view to Tailwind utilities; remove corresponding CSS from `app.css`.  
5) Migrate Compose/Passphrase modals and Toast to Tailwind; prune legacy rules.  
6) Migrate Mailbox shell (header/sidebar/list/reader) incrementally; prune legacy.  
7) Keep Schedule-X and starfield overrides as raw CSS; evaluate moving to `@layer` later.  
8) Flip import order (Tailwind after legacy) and delete leftover unused CSS once confidence is high.  
9) Run regression tests and update docs on class conventions (utility-first + any retained `fe-*` shorthands).
