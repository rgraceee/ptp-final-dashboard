# Glass effect enhancement for login/signup form card

## Goal
Make the form card on `/login` and `/signup` look like true glass: more transparent so the background shows through, with stronger blur and a visible floating edge, while keeping text readable.

## Current state
- Form card classes: `rounded-2xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden`
- This is still quite opaque (`bg-white/80`), so the background barely shows through.

## Proposed changes
Update the form card wrapper in both pages to:
- Lower opacity: `bg-white/60` so the background is visibly see-through
- Stronger blur: `backdrop-blur-2xl` (instead of `backdrop-blur-xl`) to make text behind the card illegible while keeping the background color/pattern visible
- Slightly stronger edge: `border-white/60` so the glass boundary is still clear
- Keep `shadow-2xl` for the floating depth

## Files to update
- `app/login/page.tsx` — form card class string
- `app/signup/page.tsx` — form card class string

## Verification
- Run `npx next build` to ensure no compile errors.
- Visually confirm: background photo shows through the card, form text remains readable, inputs keep their opaque white fill from `globals.css .input`.
