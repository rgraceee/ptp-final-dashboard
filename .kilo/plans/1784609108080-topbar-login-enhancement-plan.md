# UI Enhancement Plan

## 1. TopBar UI Enhancement
**Constraint**: Do not remove or add any elements/components. Only enhance styling.

### Proposed changes
- **Header backdrop**: replace `bg-white/80` with a subtle glass effect using `bg-white/70 backdrop-blur-xl` and add a soft bottom shadow (`shadow-sm`) for depth
- **Border**: change from flat `border-gray-200/80` to a gradient-style bottom border using a pseudo-element or a soft accent-tinted border (`border-b border-gray-200/80`)
- **Logo area**: increase spacing and add a subtle hover lift to the logo button; keep icon and text as-is
- **Search input**: keep existing structure, but enhance with:
  - `focus:ring-2 focus:ring-[var(--accent-glow)]` for stronger focus state
  - `hover:border-gray-300` already present, keep it
  - Subtle background `bg-gray-50/50` on hover/focus for better affordance
- **Refresh button**: keep existing structure, enhance with:
  - `hover:bg-gray-50` instead of `btn-ghost` default for clearer interactivity
  - Subtle `transition-all` already present
- **Profile button**: enhance hover with `hover:border-gray-300 hover:shadow-md` already present; add subtle scale transition
- **Profile dropdown**: keep `animate-fade-in-up`, enhance with `shadow-xl` and `border-gray-100` for cleaner elevation

## 2. Login/Signup Page UI Enhancement
**Constraint**: Keep split-screen layout, keep DataFlowAnimation, keep form structure. Enhance visual quality.

### Proposed changes
- **Left form side**:
  - Wrap form in a `card` with subtle shadow and border (`card` class already exists in globals.css)
  - Add `max-w-[420px]` for better proportions on desktop
  - Add entrance animation: `animate-fade-in-up` on the form container
  - Enhance inputs: already using `.input` class, keep it; add `focus:ring-2` for stronger focus
  - Enhance primary button: already `btn btn-primary`, keep it; add subtle `transform hover:-translate-y-0.5` for lift
  - Add a subtle "brand mark" above the form on mobile (already present), enhance with `shadow-lg` and `animate-float`
  - Typography: increase `text-2xl` heading to `text-3xl`, improve `tracking-tight`
- **Right animated side**:
  - Keep existing gradient overlay and DataFlowAnimation
  - Enhance text overlay:
    - Add `backdrop-blur-sm` to text container for better readability over animation
    - Increase `p-12` to `p-14` for more breathing room
    - Add subtle `text-shadow` or `drop-shadow` to headings for depth
    - Use `text-white/90` instead of `text-white/80` for better contrast
    - Add a subtle floating badge/chip near the bottom (e.g., "Trusted by investors")
  - Keep bottom "Secured by Supabase Auth" but style with `text-white/50` and `tracking-wide`

## 3. Shared CSS Additions (globals.css)
- Add `.glass-card` utility for reusable frosted-glass card effect
- Add `.nav-shadow` utility for subtle nav bar shadow
- Ensure all animations remain smooth and non-distracting

## 4. Validation
- Run `npm run build` to ensure no type errors
- Verify responsive behavior on mobile (≤1024px) and desktop (>1024px)
- Confirm no backend code is touched

## Files to modify
- `components/TopBar.tsx`
- `app/login/page.tsx`
- `app/signup/page.tsx`
- `app/globals.css` (add new utility classes)
