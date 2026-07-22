# Theme toggle for dashboard — auth pages revert

## Goal
Add a light/dark mode toggle to the dashboard only. Keep the auth pages (`/login`, `/signup`) in the existing dark-glass UI regardless of theme state.

## Already completed
- `next-themes` installed
- `components/ThemeProvider.tsx` created
- CSS variables + `.dark` overrides in `app/globals.css`
- Dashboard components migrated to CSS vars
- Charts updated to be theme-aware
- TopBar theme toggle added
- Landing page migrated

## Remaining changes

### 1. Revert auth pages to static dark glass
Remove theme-awareness from `/login`, `/signup`, and `LoginForm`. They should always render the dark glass UI (as they did at the end of the glass-effect work), ignoring the theme toggle.

- `app/login/page.tsx`: remove `useTheme()` import/usage; revert conditional `className` back to fixed dark-glass classes
- `app/signup/page.tsx`: same as login
- `components/LoginForm.tsx`: remove `useTheme()` import/usage; revert conditional text classes back to fixed dark-mode classes (`text-white`, `text-white/70`, `text-white/60` for eye icon, etc.)

### 2. Verify dashboard light mode looks like previous design
The previous dashboard had a light/white card aesthetic on a light gray background. The CSS variable migration already supports this — light mode tokens in `:root` already match the old design. The toggle in TopBar should let users switch between dark premium and light clean SaaS.

## Files to modify
- `app/login/page.tsx`
- `app/signup/page.tsx`
- `components/LoginForm.tsx`

## Verification
- `npx next build`
- Toggle works on dashboard
- `/login` and `/signup` always show dark glass regardless of toggle state
- Text/icons in auth forms are readable (white on dark inputs)
- Dashboard light mode matches original white-card aesthetic

## Out of scope
- Backend logic unchanged
- Auth logic unchanged
