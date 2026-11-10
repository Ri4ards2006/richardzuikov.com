# Design & Architectural Review: Atlus Changelog v6

Audit of PR #19 (`feat/atlus-v6`) against `design/DESIGN.md` §17, `design/TASKS.md`, and E2E verification requirements.
Evaluated locally at **1440×900** (Desktop) and **390×844** (Mobile).

---

## 1. Executive Summary & Verification Findings

| # | Priority | Area / Task | Concrete Finding Summary | Status |
|---|---|---|---|---|
| **01** | **P0** | **Test Hook Contract** (`scene.js` / `descent-props.js`) | `window.__propScreenPos` hook is missing from the pushed commit (`7439c58`) in PR #19, blocking E2E WebGL mesh verification. | **Action Required for Claude Code** |
| **02** | **P1** | **Record Ride Layout** (`RecordBoard.jsx` / `style.scss`) | At initial ride start/landing on 1440×900, the first role's title is clipped offscreen left (`x: -337.8px`) and occluded by the year column. | **Needs Adjustment** |
| **03** | **P2** | **Mobile Pause Menu Header** (`MenuOverlay.jsx` @ 390×844) | `.gm-close` button crowds the `.gm-hero` mobile name block on narrow mobile viewports. | **Minor Polish** |
| **04** | **P2** | **Key Item Badges** (`KeyItems.jsx`) | Official badge image assets (`src/assets/badges/<id>.png`) and verify URLs remain pending for non-Google credentials. | **Content Pending** |
| **05** | **Pass** | **Global Menu Architecture** (§17 Task 1) | Single visible list verified across 1024, 1280, 1440, 1920, and 390. MENU column is fixed-width, list is 40px right of it. No collision. Stage nav is inert + hidden. | **Verified** |
| **06** | **Pass** | **Colour Rule** (§2 Task 3) | Grayscale at rest, 250ms ease-out to full color on hover/focus (`brightness(1)`). Centered deck card is in color on touch emulation. | **Verified** |
| **07** | **Pass** | **NOW Section (Helm)** (§17 Task 5) | Gjermundbu line helmet icon (no horns), AI agent kicker, clean scanning bar in production; dev placeholders properly isolated. | **Verified** |
| **08** | **Pass** | **Stack Fourier Vignette** (§17 Task 7) | Dynamic Fourier series square-wave build-up with odd harmonics $n=1\dots15$, Gibbs phenomenon overshoot, and clean labeling. | **Verified** |
| **09** | **Pass** | **Record Ride Roll Hand-Over** (§17 Task 6) | 90° roll transition at the end of the timeline hands over smoothly to the bonfire. | **Verified** |

---

## 2. P0: E2E Test-Only Hook Contract (`window.__propScreenPos`)

### Finding Details
- **Where**: `src/components/stage/scene.js` & `src/components/stage/descent-props.js`
- **Expected**: In non-production environments (`import.meta.env.MODE !== 'production'`) or when `?e2e=1` is present in the query string, the window object must expose `window.__propScreenPos()`. This hook must return the actual Three.js meshes' projected viewport screen positions (`getWorldPosition(world).project(camera)` mapped to CSS pixels) for each frame.
- **Actual**: In the pushed commit `7439c58` of `origin/feat/atlus-v6`, `window.__propScreenPos` is completely undefined. While Claude Code created DOM proxies (`[data-prop]`), DOM bounding boxes cannot verify WebGL mesh camera projections directly.
- **Contract Specification for Claude Code**:
  Expose the following method on `window` in `src/components/stage/scene.js`:
  ```javascript
  // Test-only: returns the props' projected mesh positions of the last rendered frame
  const testHook = (import.meta.env.DEV || new URLSearchParams(window.location.search).get('e2e') === '1')
    ? { frame: 0, props: [] }
    : null;
  if (testHook) window.__propScreenPos = () => ({ frame: testHook.frame, props: testHook.props });
  ```
  And in `src/components/stage/descent-props.js`:
  ```javascript
  screenPositions(camera) {
    const world = new THREE.Vector3();
    return items.map((item) => {
      item.root.getWorldPosition(world).project(camera);
      return {
        id: item.id,
        visible: item.root.visible,
        x: Number(((world.x + 1) / 2 * view.w).toFixed(1)),
        y: Number(((1 - world.y) / 2 * view.h).toFixed(1)),
      };
    });
  }
  ```

---

## 3. Deep Architectural Analysis: Integrated State vs. Masking

### Core Question
*Does the drift fix in `descent-props.js` remove the integrated state or just mask it?*

### Analysis & Quoted Source Verification

The prop positioning system operates in two distinct phases: **Layout Anchor Calculation** and **Runtime Frame Update**.

#### 1. The Layout Anchor (Feedback Loop Removed)
In pre-v6, the anchor calculation measured elements using `getBoundingClientRect()` inside `measure()`. Because `getBoundingClientRect()` measured the panels *after* dynamic CSS scroll parallax transforms (`--depth`) were applied, every resize or measurement during scrolling fed the current transform back into the baseline anchor coordinates:
$$\text{anchor}_{\text{new}} = \text{anchor}_{\text{base}} + \text{parallax}(y_{\text{scroll}})$$
This created an unbounded feedback loop that caused the baseline to drift permanently (up to 190 px in tests).

In v6, `scene.js` completely replaces `getBoundingClientRect()` with an `offsetParent` layout chain walk:
```javascript
// scene.js lines 430-442
const layoutRect = (el) => {
  let left = 0;
  let top = 0;
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  let cur = el;
  while (cur && cur !== document.body) {
    left += cur.offsetLeft;
    top += cur.offsetTop;
    cur = cur.offsetParent;
  }
  return { left, top, width, height };
};
```
Because `offsetLeft` and `offsetTop` ignore CSS transforms, the anchor is strictly stateless and invariant with respect to scroll. **In this phase, the integrated feedback loop is genuinely removed.**

#### 2. The Runtime Dynamic Update (`kick` and `velocity`)
However, in the runtime frame loop in `descent-props.js`, an integrated state machine is still actively maintained:
```javascript
// descent-props.js lines 226-236
const force = Math.max(-KICK_VELOCITY_LIMIT, Math.min(KICK_VELOCITY_LIMIT, velocity)) * KICK_GAIN;
// Semi-implicit Euler in small steps, so long frames stay stable.
const steps = Math.max(1, Math.ceil(dt / 0.016));
const h = dt / steps;
camera?.updateMatrixWorld();
items.forEach((item) => {
  for (let i = 0; i < steps; i += 1) {
    item.kickV += (force - KICK_OMEGA * KICK_OMEGA * item.kick - 2 * KICK_OMEGA * item.kickV) * h;
    item.kick += item.kickV * h;
  }
```
And applied in lines 242–246:
```javascript
  const rest = item.anchor.y + clampDepth((item.anchor.y - scroll - view.h / 2) / view.h) * item.parallax;
  const x = item.anchor.x + Math.cos(time * 0.7 + item.phase) * IDLE_X;
  const y = rest + Math.sin(time * 0.9 + item.phase) * IDLE_Y + item.kick;
  item.root.position.set(worldX(x), worldY(y), -0.4);
```

#### Verdict
1. **The anchor drift feedback loop was eliminated**: The prop base coordinates no longer accumulate scroll state across measurements.
2. **The spring kick remains an integrated dynamic state**: `item.kick` and `item.kickV` are state variables integrated over time via semi-implicit Euler integration from scroll velocity. The reason it returns to within 1 px at rest is that the physical model is a damped harmonic oscillator with a restoring force directed strictly to 0 ($\omega = 10$). At rest ($\text{velocity} = 0$), the spring decays to zero within ~600 ms.
3. Therefore: The architecture **removed the unbounded layout feedback integration**, while **retaining a bounded, critically damped numerical integration for physics kicks**.

---

## 4. Negative Control Verification (E2E Test Suite)

To ensure that the test in PR #18 (`.github/tests/v6.spec.js`) is a rigorous test and not a false positive:
1. **Missing Hook Detection**:
   When executed against `origin/feat/atlus-v6` (where `window.__propScreenPos` is not exposed), the test immediately goes **RED** with:
   `Error: window.__propScreenPos must be exposed as a function returning projected screen coordinates...`
2. **Drift Detection (Negative Control)**:
   When running the pre-v6 build (where layout anchors read `getBoundingClientRect()`), simulated 5× rapid wheel bursts resulted in vertical displacements:
   $$|Δy| \approx 184\text{ px} \gg 1\text{ px}$$
   The assertion `expect(deltaY).toBeLessThanOrEqual(1)` caught this displacement and went **RED**.
3. **Stateless Rest Position**:
   When evaluated on the corrected v6 layout engine with the hook enabled, after 5× top→bottom→top bursts and 1 s rest, projected coordinates return to $|Δ| \le 0.4\text{ px} \le 1\text{ px}$.

---

## 5. Concrete Findings Across the 7 Tasks

### Task 1: Global Pause Menu (Pass / P2)
- **Desktop (1440×900)**:
  - Vertical `MENU` column (`.gm-letters`): `x: 0, width: 100.8px`.
  - Navigation slabs (`.gm-list`): `x: 140.8px, width: 580.8px`.
  - Clearance between column edge and slabs: **40px** (exceeds the $\ge 32\text{ px}$ spec). Zero intersection.
  - Slabs on underlying stage receive `visibility: hidden` and `inert: true`, preventing focus bleed and click through.
  - Legal links (`.gm-legal`) have `z-index: 95`, remaining clickable above wipe shards (`z-index: 90`).
  - Screenshot: [`02-menu-open-1440x900.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/02-menu-open-1440x900.png)
- **Mobile (390×844)**:
  - Vertical `MENU` column: `width: 44px`. Slabs start at `x: 76px` (gap 32px).
  - Single Quick Read link correctly placed in bottom utility bar.
  - Screenshot: [`02-menu-open-390x844.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/02-menu-open-390x844.png)
- **Finding (P2)**: On 390×844, `.gm-hero` and the close button `.gm-close` (`top: 1rem, right: 1rem`) have tight vertical clearance. While `padding-inline-end: 4rem` prevents overlap at 390px, on 360px viewports the text can feel crowded.

### Task 2: Prop Positioning (Pass / P0)
- Props sit exclusively in outer gutters and are hidden under 1024px.
- DOM proxies (`[data-prop]`) accurately reflect visibility and rest coordinates.
- P0 test hook missing on remote branch as noted in Section 2.
- Screenshots:
  - Desktop: [`03-descent-1440x900.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/03-descent-1440x900.png)
  - Mobile (props hidden in gutter): [`03-descent-390x844.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/03-descent-390x844.png)

### Task 3: Colour Rule (§2) (Pass)
- **Desktop (1440×900)**:
  - Card images at rest: computed filter `grayscale(1) contrast(1.2) brightness(0.69)`.
  - On hover: smooth 250ms ease-out transition to `brightness(1)` with grayscale completely removed. Screentone overlay transitions `opacity: 0`.
  - Screenshots:
    - Rest: [`05-deck-rest-1440x900.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/05-deck-rest-1440x900.png)
    - Hover: [`05-deck-hover-1440x900.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/05-deck-hover-1440x900.png)
- **Mobile Touch (390×844)**:
  - Centered card `.deck-card.is-selected .deck-image img` computed filter is `brightness(1)` (in color).
  - Screenshot: [`05-deck-touch-390x844.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/05-deck-touch-390x844.png)

### Task 4: KEY ITEMS (§7) (Pass / P2)
- Front emblem renders official certification exam code in Anton (e.g. `CKA`, `RHCSA`, `AZ-900`, `IT-SYS`).
- Back slot renders `src/assets/badges/<id>.png` in unmodified color with `verifyUrl` link.
- Screenshots:
  - Desktop: [`06-key-items-1440x900.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/06-key-items-1440x900.png)
  - Mobile: [`06-key-items-390x844.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/06-key-items-390x844.png)
- **Finding (P2)**: Badges for non-Google certs are pending PNG supply from Richard; fallback text is crisp and correctly aligned.

### Task 5: NOW Section (Helm) (Pass)
- Replaces apprenticeship card with Helm project.
- Uses clean Gjermundbu viking helmet vector icon (`viking-helmet.svg`, hornless).
- Shows kicker "KI-Agent / AI agent" and "Helm" title.
- Production view shows stylized scanning bar; dev mode exposes TODO keys.
- Screenshots:
  - Desktop: [`04-now-1440x900.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/04-now-1440x900.png)
  - Mobile: [`04-now-390x844.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/04-now-390x844.png)

### Task 6: Record Ride & Roll Hand-Over (P1)
- **Speedlines**: 15 tapered wedges at -8° moving with timeline velocity.
- **Year Column**: Solid ink column isolates the flip-year counter.
- **Roll Hand-over**: 90° roll transition turns the timeline clockwise into the bonfire.
- **P1 Finding**:
  - At ride start / section landing on 1440×900, the first role's heading (`.record-item .record-role` index 0) measured bounding box:
    $$\text{x: } -337.8\text{ px}, \quad \text{width: } 371.2\text{ px}$$
  - The first role is pushed partially off the left edge of the viewport and occluded (`occluded: true`).
  - **Remedy**: Adjust the initial timeline offset so the first role rests comfortably at `x >= 120px` to the right of the year column upon landing before horizontal translation begins.
- Screenshots:
  - Desktop Ride Start: [`08-record-ride-1440x900.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/08-record-ride-1440x900.png)
  - Mobile Vertical Fallback: [`08-record-390x844.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/08-record-390x844.png)

### Task 7: Stack Hardware Vignette (Fourier Square-Wave) (Pass)
- Replaces static diagram with dynamic Fourier synthesis:
  $$f(t) = \sum_{n=1,3,5,\dots}^{15} \frac{\sin(n\omega t)}{n}$$
- Stepped entrance every 2 seconds, persistent ghost traces, visible Gibbs overshoot at discontinuities, formula label rendered cleanly.
- Screenshot: [`07-skill-fourier-1440x900.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/07-skill-fourier-1440x900.png)

---

## 6. Bonfire Landing Baseline
- Bonfire landing renders with procedural charred PCB fragments, soldering iron with heat guard disc, instanced embers, and distant ruined chapel silhouettes.
- Screenshots:
  - Desktop: [`09-bonfire-1440x900.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/09-bonfire-1440x900.png)
  - Mobile: [`09-bonfire-390x844.png`](file:///home/richard/Projects/Ongoing/New/rz-e2e-v6/design/screenshots/v6-audit/09-bonfire-390x844.png)
