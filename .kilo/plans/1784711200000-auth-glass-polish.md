# Auth page polish fixes - updated for dark inputs

## Goal
Fix three front-end issues in the auth pages after the dark-glass + typography changes: remove the top accent gradient line, restore visibility of the password eye icon, and make the input fields consistent with the dark glass card background.

## Problem 1: Eye icon invisible
The password toggle button in `components/LoginForm.tsx:176` was changed to `text-white/60`, but it sits inside a white input (`background: var(--surface)` = `#ffffff` from `globals.css .input`). The white icon therefore blends into the white field background and appears missing.

## Problem 2: Unwanted accent line
In `app/login/page.tsx:78` and `app/signup/page.tsx:78`, a 3px burgundy gradient strip was added to the top of the glass card. The user wants it removed.

## Problem 3: Input background inconsistent
After switching the form card to bg-black/40, the inputs still use solid white (`var(--surface)` from globals.css `.input`). This creates a visual mismatch — the inputs look like they're "stuck on" rather than part of the dark glass card.

## Changes needed

### 1. Remove top accent line
In both auth pages, delete the child div:
```tsx
<div className="h-1 bg-gradient-to-r from-[var(--accent)] to-[#A52A3A]" />
```

### 2. Make inputs match dark glass card
Since the form card is now dark glass (`bg-black/40`), update `.input` in `globals.css` to use dark semi-transparent background for auth contexts. However, `.input` is a global class used in many places (dashboard, etc.) where a white background is correct.

**Approach**: Use `.glass-card .input` overrides in `globals.css` for the dark glass context instead of changing the global `.input`:
- `background: rgba(255,255,255,0.06)` instead of white
- `border: 1.5px solid rgba(255,255,255,0.12)` instead of default
- `color: #fff` instead of `--text-primary`
- `::placeholder` color: `rgba(255,255,255,0.4)`
- `:hover:not(:focus)` border: `rgba(255,255,255,0.2)`
- `:focus` style already overridden in `.glass-card .input:focus`

This keeps the white inputs intact everywhere else while making auth page inputs blend into the dark glass.

### 3. Restore password eye visibility
With dark transparent inputs, the eye icon can now be white again since the input background is dark:
- Revert from: `text-gray-400 hover:text-gray-600`
- To: `text-white/60 hover:text-white hover:scale-110 transition-all`

## Files to edit
- `components/LoginForm.tsx`
- `app/login/page.tsx`
- `app/signup/page.tsx`
- `app/globals.css`

## Verification
- Run `npx next build`.
- Visually check `/login` and `/signup`: inputs are dark transparent with white text, password eye icon is visible, no accent line above the form card.
- Confirm dashboard/modal inputs are still white (test other pages briefly or review selector specificity).
