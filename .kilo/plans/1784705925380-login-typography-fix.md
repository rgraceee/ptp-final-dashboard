# Login/signup typography fix for dark glass card

## Goal
Fix unreadable typography inside the auth form cards after switching to dark glass (`bg-black/40`), and suggest optional polish for both login and signup pages.

## Problem
The `LoginForm` component uses light-mode text colors (`text-gray-900`, `text-gray-400`) that were designed for a white card. After changing the wrapper to a transparent dark glass card, the heading "Welcome back" / "Create account" is effectively invisible, and labels/secondary text have poor contrast.

## Affected files
- `components/LoginForm.tsx` — contains all form text, labels, and toggle links
- `app/login/page.tsx` — mobile header subtitle above the card
- `app/signup/page.tsx` — same structure as login
- `app/globals.css` — may need small additions for dark-glass text utilities

## Proposed changes

### 1. Fix LoginForm text for dark glass
In `components/LoginForm.tsx`, update classes to use white tones instead of gray tones:

| Element | Current class | New class |
|---|---|---|
| Heading (`<h1>`) | `text-gray-900` | `text-white` |
| Subtitle below heading | `text-gray-400` | `text-white/70` |
| Labels (Email, Password) | `text-gray-400` | `text-white/70` |
| Password toggle button | `text-gray-400 hover:text-gray-600` | `text-white/60 hover:text-white` |
| Toggle link text | `text-gray-400` | `text-white/70` |

### 2. Optionally bump mobile header subtitle above card
In `app/login/page.tsx` and `app/signup/page.tsx` line 72, the subtitle ("Welcome back" / "Start tracking your portfolio") uses `text-white/70`. Since the card is now darker, consider `text-white/90` for slightly more separation from the dark background overlay.

### 3. Skeleton parity (optional)
In `components/LoginForm.tsx:248`, the `SkeletonLoginForm` card uses `bg-white`. For visual parity with the loaded state, update it to `bg-white/10 border-white/10` or keep as-is. Keep as-is to preserve the loading-state visual contrast.

### 4. Suggested enhancements (bonus polish)
These are optional but would elevate both pages:
- **Top accent line**: Add a 3px gradient strip at the top of each glass card using `bg-gradient-to-r from-[var(--accent)] to-[#A52A3A]` as a child of the card wrapper.
- **Input focus glow on dark**: In `globals.css`, add a `.glass-card .input:focus` rule that swaps `--accent-glow` to a lighter tone so the focus ring pops against dark glass.
- **Password eye visibility**: Keep eye icon `text-white/60` with a subtle scale hover (`hover:scale-110 transition-transform`).
- **Error message styling**: Update the message box from `bg-gray-50` to `bg-white/10 border-white/10` with `text-white/90` when rendered inside the dark glass context.
- **Card hover lift** (desktop only): Add `transition-transform hover:-translate-y-0.5` to the card wrapper on `lg:` breakpoint.

## Verification
- Run `npx next build` to ensure no compile errors.
- Visually confirm heading text, labels, and toggle links are clearly readable inside the dark glass card on both `/login` and `/signup`.
- Confirm inputs remain opaque white (from `.input` in `globals.css`).
