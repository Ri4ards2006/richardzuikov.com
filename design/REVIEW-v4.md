# Design Review: Atlus Changelog v4

Visual and structural audit of PR #14 (`feat/atlus-v4` / changelog v4) against `design/DESIGN.md` §11 and §15.
Evaluated locally at **1440×900** (Desktop) and **390×844** (Mobile).

---

## Findings Summary

| # | Section / Component | Finding Focus | Priority |
|---|---|---|---|
| 01 | `Stage.jsx` / `MenuOverlay.jsx` | Two menus visible concurrently during overlay transition | **P1** |
| 02 | `PanelIllustration.jsx` / `Stage.jsx` | Descent panel 00/02 illustration crowding Skew title | **P2** |
| 03 | `descent-props.js` / `scene.js` | WebGL 3D props encroaching on body copy during scroll | **P2** |
| 04 | `Stage.jsx` (`.ground-message`) | Leftover instructional tutorial hint "versuch ↑ ↓" | **P2** |
| 05 | `ProjectDeck.jsx` (`.ground-message`) | Leftover instructional hint "wähl eine aus" in card deck | **P3** |
| 06 | `translations.js` / `now.js` | Unfinished developer TODO strings and placeholder steps | **P2** |
| 07 | `NowSection.jsx` (`#now`) | Flat zinc boxes lacking Arcana screentone and card-frames | **P2** |
| 08 | `SkillBoard.jsx` (`#skill`) | Skill badge grid feels plain and utilitarian compared to Arcana | **P2** |
| 09 | `RecordBoard.jsx` (`#record`) | Horizontal ride timeline slabs lack high-impact manga styling | **P3** |
| 10 | `Stage.jsx` (`.stage-hero` @ 390px) | Name block and 5 slabs occupy ~97% of mobile initial fold | **P2** |
| 11 | `MenuOverlay.jsx` (`.gm` @ 390px) | HUD utility controls pushed below mobile fold inside pause menu | **P2** |
| 12 | `ruins.js` / `ContactList.jsx` @ 390px | Contact cards occlude new ruined chapel silhouette on mobile | **P3** |

---

## Concrete Checkable Findings

### 01. Two menus visible concurrently during overlay entrance wipe
- **Where**: `src/pages/Stage.jsx` (`.stage-menu`) & `src/components/MenuOverlay.jsx` (`.gm`)
- **Expected**: When the global pause menu overlay is opened via `.menu-dots`, `.stage-menu` should immediately receive `visibility: hidden` (or `aria-hidden="true"` / `inert`), preventing visual collision during the 300ms diagonal wipe and blocking keyboard focus bleed.
- **Actual**: `.stage-menu` remains mounted, rendered, and focusable at `opacity: 1`, `display: block`. During the initial 300ms `gm-in` wipe, both the stage navigation slabs and the pause menu slabs are simultaneously visible on screen, causing visual confusion.
- **Priority**: **P1**

### 02. Descent illustrations tightly crowding panel headings
- **Where**: `src/components/stage/PanelIllustration.jsx` & `src/pages/Stage.jsx` (`.manga-panel`)
- **Expected**: The panel illustration (e.g. chip schematic in panel 01 and terminal in panel 03) should maintain a minimum of 24px vertical clearance from the skewed section heading `h3`.
- **Actual**: In panel 01 ("Silicon & Solder"), the bottom of `.panel-illustration` (`top: -202px`) sits within 16px of `h3` (`top: -185px`), and on mobile (390px) the graphic crowds directly against the top edge of the title text.
- **Priority**: **P2**

### 03. WebGL 3D props encroaching on body copy during scroll
- **Where**: `src/components/stage/descent-props.js` & `src/components/stage/scene.js`
- **Expected**: Floating 3D props (code monitor, rack unit) must remain confined to the illustration anchor zone (`.panel-illustration`) and never drift over the text paragraph (`.manga-panel p`).
- **Actual**: Parallax camera displacement causes the 3D monitor and server chassis models to bleed up to 18px into the first line of the description copy when scrolled into mid-viewport.
- **Priority**: **P2**

### 04. Leftover instructional hint "versuch ↑ ↓" under stage menu
- **Where**: `src/pages/Stage.jsx` (`.ground-message`) & `src/lib/translations.js` (`t.atlus.hints.menu`)
- **Expected**: The stage HUD should maintain an immersive Atlus Neo-Pop manga aesthetic without tutorial instructions.
- **Actual**: Directly underneath the stage navigation slabs, `<span className="ground-message mt-3">{t.atlus.hints.menu}</span>` displays raw instructional hint "versuch ↑ ↓" (DE) / "try ↑ ↓" (EN), looking like an unpolished developer note.
- **Priority**: **P2**

### 05. Leftover instructional hint "wähl eine aus" in project deck
- **Where**: `src/components/stage/ProjectDeck.jsx` & `src/lib/translations.js` (`t.atlus.hints.deck`)
- **Expected**: Deck status indicators should use stylized game HUD terminology (e.g., `DECK // SELECT ARCANUM` or index indicator `01 / 06`).
- **Actual**: Renders casual tutorial copy "wähl eine aus" (DE) / "pick one" (EN), which undermines the sharp Persona tone.
- **Priority**: **P3**

### 06. Developer TODO placeholders in NOW and Descent data models
- **Where**: `src/data/now.js` & `src/lib/translations.js` (`entry.todo`)
- **Expected**: All displayed progress steps and career logs must contain authentic, verified milestones without placeholder strings.
- **Actual**: `src/data/now.js` entries for cluster and apprenticeship contain hardcoded placeholder steps (`done: null`, status `— / —`), and `translations.js` retains `todo` fields that appear in development environments.
- **Priority**: **P2**

### 07. NOW section panels lack Arcana screentone and card-frames
- **Where**: `src/components/stage/NowSection.jsx` (`#now`)
- **Expected**: The new NOW section panels should inherit the visual language established in `#arcana`: double-bordered card frames (`card-frame.svg`), angled corner notches, and halftone screentone shading.
- **Actual**: Quest-log items render inside flat rectangular boxes (`border border-zinc-800 bg-ash-900/60`), looking plain and disconnected from the surrounding manga aesthetic.
- **Priority**: **P2**

### 08. Skill board badge grid appears utilitarian compared to Arcana
- **Where**: `src/components/atlus/SkillBoard.jsx` (`#skill`)
- **Expected**: Skill categories and active badges should incorporate screentone patterns, angled accent tabs, or card-frame geometry to match Arcana's high-contrast impact.
- **Actual**: While 3D props switch on category hover, the skills list remains a basic grid of dark rounded-rect badges (`bg-ash-900 border border-ash-700`), feeling generic.
- **Priority**: **P2**

### 09. Horizontal record timeline slabs lack dynamic graphic punch
- **Where**: `src/components/atlus/RecordBoard.jsx` (`#record`)
- **Expected**: The active role during the horizontal camera ride should display speedline accents, screentone shading, or stylized Roman numeral frames.
- **Actual**: Timeline items are simple black angled bars with basic white text. Compared to `#arcana` tarot illustrations, the record section looks graphically sparse during the ride.
- **Priority**: **P3**

### 10. Stage Hero content spans entire initial mobile viewport height
- **Where**: `src/pages/Stage.jsx` (`.stage-hero` @ 390×844)
- **Expected**: The title block and stage navigation should leave enough room to reveal the 3D canvas shards or portrait beneath.
- **Actual**: The large Anton name banner plus five navigation slabs measure ~820px tall, completely filling the 844px mobile screen and hiding the visual depth of the stage canvas on initial load.
- **Priority**: **P2**

### 11. Global Pause Menu utility row pushed below the fold on mobile
- **Where**: `src/components/MenuOverlay.jsx` (`.gm` @ 390×844)
- **Expected**: All critical controls in the pause menu (navigation links, language toggle, theme toggle, social links) should fit within the mobile viewport without requiring internal scrolling.
- **Actual**: Due to `padding: 4.5rem 1rem 2.25rem` and full-size slab spacing, the language switch (DE/EN), theme toggle, and social icons overflow past 844px, requiring an unintuitive scroll inside the modal.
- **Priority**: **P2**

### 12. Bonfire ruined chapel silhouette obscured by contact list on mobile
- **Where**: `src/three/bonfire/ruins.js` & `src/three/bonfire/ContactList.jsx` (@ 390×844)
- **Expected**: The newly added ruined chapel silhouette in the distance behind the fire should remain visible as an atmospheric landmark on mobile.
- **Actual**: On 390×844, the `.contact-list` cards occupy the upper-middle half of the bonfire section, occluding the chapel silhouette on the right.
- **Priority**: **P3**
