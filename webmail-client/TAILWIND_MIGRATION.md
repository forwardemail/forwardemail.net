# Tailwind migration checklist (working log)

This is the working plan to introduce Tailwind CSS incrementally.

## Status
- [x] Documented adoption approach and risks (`TAILWIND_ADOPTION_PLAN.md`).
- [x] Add Tailwind/PostCSS configs and entry CSS.
- [x] Define initial theme tokens (colors/fonts, shadows) and light-mode CSS var overrides in Tailwind config/base.
- [x] Create Tailwind-based component layers for buttons/inputs/badges/modals to keep existing markup stable.
- [ ] Migrate Login view markup to utilities (optional, since styles now come from Tailwind layer); remove redundant CSS.
- [ ] Migrate Passphrase modal and Toast (Compose modal moved to Tailwind layer).
- [ ] Migrate Mailbox shell (header/sidebar/list/reader) in slices; prune legacy CSS.
- [ ] Keep Schedule-X/starfield overrides as raw CSS; revisit later.
- [ ] Flip import order and delete unused legacy CSS after migration stabilizes.

## Work in progress
- Added Tailwind/PostCSS configs and entry stylesheet, wired into `App.vue`.
- Added light-mode token overrides, login/alert styles, and component layers for buttons/inputs/badges/modals; removed corresponding legacy blocks from `src/styles/app.css`.
- Added modal action layout and compose modal sizing/field stack to Tailwind layer; removed scoped compose styles.
- Moved mailbox shell/folders/messaging container styles to Tailwind layer; pruned matching legacy blocks in `src/styles/app.css`.
- Added mailbox item/reader/empty-state styles to Tailwind layer; pruned remaining mailbox reader/message CSS from `src/styles/app.css`.

## Next steps
1) Add any missing theme tokens (radii/shadows) as needed.  
2) Start migrating the Login view to utilities; drop corresponding rules from `app.css` (optional since styles are now in Tailwind layer).  
3) Continue with modals (Passphrase/Toast) and mailbox layouts; validate visuals and prune legacy CSS as we go.
