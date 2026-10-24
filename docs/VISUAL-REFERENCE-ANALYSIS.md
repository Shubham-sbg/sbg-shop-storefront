# Visual Reference Analysis — SBG Virtual Showroom

**Source:** User-supplied video `SBG_Shop_Virtual_Store_Reference.mp4` (about 23.57 sec; 1366 × 698 screen recording at 30 fps) and `references/visual/reference-video-contact-sheet.jpg`. The recording shows a third-party virtual clothing-store UI plus a side tool panel. Analyse the **website portion only**. Do not reuse that store’s name, copy, assets or layout.

## Observed visual language

- Cool grey / slate studio environment with a soft, low-contrast floor/background.
- Horizontal arrangement of hanging clothing pieces on a central rail/frame.
- Wide shot establishes the full collection; closer framing makes garments easier to inspect.
- Clicking/selection appears to focus a product and show a compact label/name.
- The store identity is introduced through blurred/focused transitions and restrained editorial text.
- The motion feels like exploring a small virtual showroom rather than scrolling through generic product cards.

## Translate to an original SBG direction

- A custom SBG virtual jersey showroom, with black and white jersey families as the first featured pieces.
- Neutral studio environment; restrained SBG purple/gold lighting accents.
- Horizontal jersey rack/lineup and selected-product focus state, with product label and “View details” action.
- Product detail view uses the exact supplied front/back mockups.
- Mobile version uses swipeable focused product panels, clear labels and ordinary buttons; it must not require precision drag/3D gestures.
- Preserve SBG crest and jersey artwork exactly.

## Critical asset limitation

The supplied jersey images appear to be fully rendered mockups with studio backgrounds, not transparent cutouts or UV texture maps. A direct plane placement inside a different 3D room could create visible rectangular backgrounds. Before choosing a 3D method, verify the asset pipeline. Options to evaluate:

1. **Image-led showroom (recommended fallback):** use the exact images in a cinematic horizontal rail/selection layout with depth/scale transitions; no false claim of full garment rotation.
2. **True 3D garment showroom:** only if a clean/approved garment model and appropriate texture/source files can be obtained, licensed and mapped accurately. Do not fabricate a wrong-looking eagle/logo or pretend the supplied render is a 3D mesh.
3. **Curated showcase hybrid:** use a 3D rack/room as environment and show jersey mockups in a coherent selected-product stage, while keeping the 2D product imagery faithful.

## Design guardrails

- Do not clone the source store or reuse its name/text/assets/code.
- Avoid default purple-to-blue gradient heroes, excessive glassmorphism, gratuitous orbs/dot grids/sparkles, generic three-card rows, fake testimonials, fake stock counts, fake reviews, placeholder product claims or excessive animation.
- Make typography, spacing, colour, motion and camera behaviour intentional and product-specific.
- Preserve contrast and reduced-motion behaviour; maintain fast mobile loading and provide a static fallback.

## Open review questions

- Do the supplied assets have clean source/cutout versions or original garment artwork suitable for true 3D mapping?
- Should the initial release use an image-led showroom, or is licensed true 3D a launch requirement?
- Can the owner supply the exact live catalogue/prices/SKUs/size chart/stock and product care data?
