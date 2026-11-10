# 1. Strict Monochrome Palette with Bonfire Exception

Date: 2026-11-10

## Status
Accepted

## Context
During early design iterations, multiple accent colors crept into UI elements: blue hyper-links, green terminal prompts, and red notification pills. This diluted the graphic novel, manga-inspired visual identity inspired by *Persona 5* and *Metaphor: ReFantazio*. In high-contrast manga, color is not decorative noise; it is narrative intent.

## Decision
1. **The Core Rule**: The portfolio is strictly **monochrome** across all stages, navigation, cards, typography, and props:
   - Obsidian: `#050505` (`--ash-900`)
   - Charcoal: `#121212` (`--ash-800`)
   - Paper / Cream: `#f4f4f0` (`--ash-100`)
   - Ash scale intermediate grays (`--ash-200` to `--ash-700`).
2. **The Single Warm Exception**: Color is reserved exclusively for the **Bonfire** (`/#bonfire`):
   - Ember Hot: `#ff6a00` (`rgb(255 106 0)`)
   - Ember Gold: `#ff9a2e` (`rgb(255 154 46)`)
   - Ember Glow: `#ffd180` (bonfire menu hover only)
3. **No Secondary Color Systems**:
   - No blue links.
   - No green success badges.
   - No red alert tags outside the bonfire flame core.

## Consequences
- **Positive**: Cohesive editorial weight. When the user reaches the bonfire at the base of the descent, the sudden emergence of fiery amber and gold delivers maximum emotional and aesthetic payoff.
- **Negative**: Form errors and status indicators must rely on typography, layout skew, borders, and inverted luminance rather than color hues.
