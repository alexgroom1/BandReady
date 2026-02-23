# BandReady Prototype – HCI Audit Notes

## Audit Summary (Completed)

### 1. Touch Targets (≥ 80px)
- **Implemented:** All interactive elements updated to `min-h-[80px]` or `min-h-interactive`.
- **Audit script:** `npm run audit:touch` – logs warnings for potential violations.
- **Status:** ✅ Compliant

### 2. Holdover Prevention (350ms pointer-events)
- **Implemented:** `PageTransitionWrapper` applies `pointer-events: none` for 350ms on every pathname change.
- **Scope:** Global – wraps all routes in `layout.tsx`.
- **Status:** ✅ Compliant

### 3. Color Contrast (axe-core WCAG 2.1 AA)
- **Implemented:** `AccessibilityReporter` runs axe-core in development when installed.
- **Install:** `npm install axe-core --save-dev` (install failed during audit; run manually).
- **Target:** 4.5:1 for normal text. Violations logged to console.
- **Status:** ⚠️ Requires manual axe-core install; run dev and check console for violations.

### 4. Keyboard Navigation
- **Implemented:** 
  - All native buttons/links are focusable via Tab.
  - `LockableModuleCard` has `role="button"`, `tabIndex={0}`, and `onKeyDown` for Enter/Space.
  - Native buttons support Enter/Space by default.
- **Status:** ✅ Compliant

### 5. Focus Indicators
- **Implemented:** Global 3px golden ring in `globals.css` (`*:focus-visible`) and component-level `focus-visible:ring-[3px] focus-visible:ring-golden`.
- **Status:** ✅ Compliant

### 6. Reduce Motion
- **Implemented:** `useReducedMotion()` hook checks `prefers-reduced-motion`. All Framer Motion usages wrapped.
- **Status:** ✅ Compliant

### 7. Audio Visual Fallback
- **AssessmentScreen "Play Note":** Note is highlighted on staff (`TrebleStaffWithHighlight`); `aria-label` includes “note shown highlighted on staff”.
- **ActivityScreen:** Staff shows highlighted note (no separate Play Note).
- **ModuleIntroScreen "Listen along":** Placeholder only; no audio yet. Visual fallback is the static staff with note labels.
- **Status:** ✅ Compliant for implemented audio features; ⚠️ Listen along has no audio/fallback yet.

### 8. localStorage Unavailability
- **Implemented:** 
  - All storage calls wrapped in try/catch; in-memory fallback used.
  - `StorageFallbackBanner` shows when localStorage is unavailable (e.g. private browsing).
- **Status:** ✅ Compliant

---

## Remaining Known Issues

1. **axe-core not installed**  
   Run `npm install axe-core --save-dev` to enable the accessibility reporter.

2. **Listen along (ModuleIntroScreen)**  
   Button has no audio implementation. When implemented, ensure a visual fallback (e.g. note highlight on staff) for users who can’t hear.

3. **Settings button (HomeScreen)**  
   Icon-only; no destination or handler. Consider adding `aria-label` (present) and navigation/handler.

4. **Confetti (ResultsScreen)**  
   `canvas-confetti` is dynamically imported and may fail silently. CSS fallback animation used; consider `@media (prefers-reduced-motion: reduce)` to disable (added for `.animate-confetti-fall`).

5. **Touch audit script**  
   Heuristic-based; may miss custom elements or produce false positives (e.g. multiline `className={cn(...)}`). Run `npm run audit:touch`; manual review recommended for reported items.

6. **node_modules / build**  
   Build may fail with `styled-jsx` module not found; run `npm install` to repair dependencies if needed.
