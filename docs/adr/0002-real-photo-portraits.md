# 2. Authentic Photographic Portraits via Background Cutout

Date: 2026-11-10

## Status
Accepted

## Context
Early prototypes experimented with stylized AI-generated anime portraits and vector avatars for Richard Zuikov. While fitting the manga aesthetic superficially, AI portraits create an immediate credibility deficit for a serious embedded systems and hardware engineer. Recruiters, engineering directors, and clients need to know that a real human craftsman engineered the FPGA demodulators, soldered the boards, and wrote the bare-metal drivers.

## Decision
1. **Real Photography Only**: All portraits of Richard must be authentic, high-resolution photographs taken in real lab/workspace environments (`Home_Lab.jpeg`, `Home_Soldering_Station.jpeg`).
2. **Automated Clean Background Extraction**:
   - Real photos are processed via `rembg` (AI background removal tool) to produce clean alpha cutouts.
   - Ink art lines (`stage.png`, `about.png`) utilize luminance-to-alpha thresholding (`magick` with `INK_LOW=4% INK_HIGH=60%`).
   - Processed assets are committed as multi-resolution WebP files (`*-1400.webp`, `*-700.webp`) with stripped metadata.
3. **Manga Stylization via Shading & Halftone**:
   - The authentic human cutout is integrated into the Atlus aesthetic using CSS duotone filters, halftone dot matrices (`src/css/style.scss`), and angled paper slabs—not synthetic generative avatars.

## Consequences
- **Positive**: Maintains absolute professional credibility and authenticity while harmonizing seamlessly with the high-fashion Atlus manga UI.
- **Negative**: Requires manual lighting and clean source photography; background cutouts must be carefully inspected for edge fringing around hair and fingers.
