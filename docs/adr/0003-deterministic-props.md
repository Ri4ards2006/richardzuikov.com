# 3. Deterministic Stateless 3D Prop Projection

Date: 2026-11-10

## Status
Accepted

## Context
In `feat/atlus-v4` and `v5`, 3D props were coupled to manga panels using interactive spring physics (Hooke's law with damping coefficients). This created visual drift during rapid wheel bursts: springs accumulated floating-point error, desynchronized from the DOM under frame-rate dips, and left props floating over text when scrolling reversed.

## Decision
1. **Abolish Mutable Physics State**:
   - Delete all internal spring velocities (`vx`, `vy`) and delta-time accumulators in `descent-props.js`.
2. **Stateless Projection Law**:
   - The position of any prop at any frame is a pure, idempotent mathematical function of the current scroll progress `scrollY`, camera matrix `C`, and static panel geometry:
     $$\text{Position}(t) = \text{Anchor} + \text{ParallaxOffset}(t)$$
   - Reversing scroll, jumping between anchor links, or resizing the viewport always yields the exact same projected screen coordinates.
3. **Hard Bounds & Collision Avoidance**:
   - Each prop is constrained to its designated panel's outer gutter (`[data-slot="panel-N"]`).
   - If the gutter is too narrow ($< \text{radius} \cdot 2 + \text{margin} \cdot 2$), the prop culls cleanly rather than overlapping text.
4. **Verifiable Test Contract**:
   - The projected screen coordinates of the actual rendered mesh are exposed via `window.__propScreenPos()` for automated E2E pixel verification (`|Δ| ≤ 1px`).

## Consequences
- **Positive**: Zero drift across unlimited scroll cycles; instantaneous settling; deterministic Playwright and CI test execution.
- **Negative**: Props lose soft physics "jiggle" when stopping suddenly (deemed an acceptable trade-off for rock-solid stability).
