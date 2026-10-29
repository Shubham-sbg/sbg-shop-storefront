# SBG SHOP — Change Log

## 2026-10-28 — 3D Showroom 360° Rotation & Volumetric Garment Mesh Fix

- Diagnosed and resolved the root causes of the missing jersey in Google AI Studio and the blank/disappearing jersey during 360° rotation:
  1. **Side Profile Disappearance (Edge-On Slit / Missing Geometry):**
     - Original model was two parallel 2D planes at `z = ±0.042` with open edges and zero thickness at sides. At 90° and 270° side angles, the camera looked directly along the infinitesimal edge of the planes, making the garment vanish.
     - Engineered a true 9-mesh volumetric 3D garment (`buildVolumetricJersey`) in both `JerseyViewer3D.tsx` and `ShowroomScene.tsx`:
       - Curved draped front and back shells with 24x24 vertex subdivisions.
       - Left and Right ergonomic athletic side flank panels with authentic SBG royal purple and gold racing pinstripes (`createFlankTexture`).
       - Athletic sleeve cuff caps (side rings) bridging the armholes.
       - Top shoulder seam bridges matching SBG artwork.
       - 3D ribbed V-neck collar torus.
       - Dark interior cavity liner cylinder preventing hollow see-through artifacts.
  2. **Double-Sided Bleed & Reversed Logos:**
     - Switched front and back shell materials to `side: THREE.FrontSide` with `alphaTest: 0.06` and `depthWrite: true`. This prevents the back-face of the front shell from rendering a reversed mirror image over the back design and prevents depth buffer z-fighting.
  3. **Concentric Camera Orbit vs. Eccentric Wobble:**
     - Orbit center aligned strictly with model position (`targetX = modelGroup.position.x`, `targetY = 0.05`, `targetZ = 0`) instead of world `(0, 0, 0)`.
     - Zoom radius clamped to safe bounds `[1.8, 4.8]` and camera `near` plane set to `0.05`, completely preventing camera clipping into the mesh.
  4. **Hosted Environment Asset Loading & Viewport Stability:**
     - Configured CORS headers in `next.config.ts` (`Access-Control-Allow-Origin: *`) for WebGL `texImage2D` texture decoding in iframe environments.
     - Losslessly compressed all 7 jersey PNGs (70% reduction from ~2.25MB to ~640KB each), accelerating loading times.
     - Added `ResizeObserver` on container mounts in both showroom components for responsive canvas resizing in iframe layouts.
- Verified: `npm run lint` passed with 0 errors/0 warnings; `npm run build` passed successfully.

## 2026-10-28 — 3D Showroom Texture Loading & CORS Resolution

- Diagnosed why 3D showroom jerseys were failing to render in the hosted/iframe preview while functioning on localhost:
  - Configured CORS headers in `next.config.ts` (`Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, OPTIONS`) so WebGL `texImage2D` can read texture pixels without cross-origin security errors in iframe environments.
  - Set `loader.setCrossOrigin("anonymous")` in both `ShowroomScene.tsx` and `JerseyViewer3D.tsx`.
  - Added safe fallback texture loader using `HTMLImageElement` if `TextureLoader` encounters network or security issues.
  - Added in-memory texture caching (`textureCacheRef`) across garment interactions to avoid redundant texture re-downloads.
  - Decoupled `selectedIndex` from the scene setup `useEffect` in `ShowroomScene.tsx` using `selectedIndexRef` so sliding the rail and switching garments no longer disposes and recreates WebGL contexts.
  - Memoized `showroomProducts` in `app/page.tsx` with `useMemo` to stabilize component reference and avoid re-render thrashing.
  - Optimized all 7 jersey PNG textures using `sharp` (reduced file sizes by 70%, from ~2.25MB down to ~640KB each), speeding up asset loading 3x–4x over the wire.
  - Verified with `lint_applet` (0 errors, 0 warnings) and `compile_applet` (successful build). Dev server restarted.

## 2026-10-28 — Google AI Studio GitHub Import Migration Complete

- Followed `github-import-migration` skill for Category C (Web / Node.js Next.js project).
- Cleaned lockfiles: removed `bun.lock` to conform strictly to npm-only environment.
- Configured development server script: `"dev": "next dev -p 3000 -H 0.0.0.0"`.
- Configured `next.config.ts` with `output: "standalone"`.
- Installed dependencies using npm and resolved strict React 19 ESLint compiler hooks rules (lazy state initializers, ref mutation guards in `JerseyViewer3D.tsx` & `ShowroomScene.tsx`, and unused import cleanups).
- Verified production build and linting: `compile_applet` and `lint_applet` both passed with 0 errors and 0 warnings.
- Dev server verified and responsive on `0.0.0.0:3000`.

## 2026-10-28 — GitHub Repository Preparation & Publishing Readiness Complete

- Audited codebase for security: confirmed zero exposed credentials, API keys, tokens, or private secrets in code and Git history.
- Upgraded `.gitignore` to protect environment files (`.env*` while preserving `.env.example`), local IDE state (`.cursor/`), scratch image processing scripts (`scratch/`), and exclude the 66MB raw zip archive (`SBG_8_Jerseys_COMPLETE_Pack.zip`).
- Generated comprehensive `README.md` documenting tech stack (Next.js 16, TypeScript, Three.js), implemented features, design system, local development commands, and explicit distinction for deferred features (production payment gateway).
- Created `.env.example` with safe placeholder variables.
- Verified buildability: `npm run build` executed and passed with 0 errors/warnings across all 17 routes.
- Initialized clean Git commit on branch `main` (`Initial commit: SBG SHOP — Storefront and Virtual Showroom`).
- Installed GitHub CLI (`gh` v2.103.3) on system for authentication and automated repo provisioning.


- Created single source of truth for products in `lib/products.ts` covering all 4 confirmed SKUs with specifications, inventory levels, and image paths.
- Built persistent client `CartContext` (`context/CartContext.tsx`) with localStorage synchronization, item increment/decrement, subtotal calculation, and real-time badge counters.
- Built `/products` (Collection catalogue): category filter tabs (All, White, Black), card grids, and interactive front/back view toggles.
- Built `/products/[id]` (Product Detail Page): multi-angle thumbnails, size picker, interactive size chart modal in inches, garment specifications table, Add to Bag, and 3D showroom link.
- Built `/cart` (Shopping bag): item rows, quantity adjustments, item removal, demo promo code (`SBG10`), and order summary with free shipping guarantee.
- Built `/checkout` (Checkout shell): complete shipping & contact form, payment method selector (clearly marked demo/test mode), and order placement trigger.
- Built `/checkout/success` (Order confirmation): dynamic order reference display, test mode notification, and tracking links.
- Built `/orders` (Track order portal): live order lookup, timeline status progression, and session order history.
- Built `/about`, `/contact`, `/returns`, `/refund`, `/terms`, `/privacy`, and `not-found` branded pages.
- Built `/admin` (Operations panel): live orders queue synced with checkout test orders, inventory levels across all sizes, and integration gateway audit.
- Full production build (`npm run build`) passed with 0 errors across all 17 routes. Verified live in browser with browser subagent.

- Built a real 3D showroom scene (`ShowroomScene.tsx`) using Three.js in a light-grey studio cyclorama.
- Horizontal freestanding metal clothing rail with architectural T-stands and end caps.
- Natural wood/metal hangers with hooks looping cleanly over the rail bar.
- Volumetric 3D garment mesh: curved front and back shells with physical depth, athletic fabric draping, and clean alpha cutouts preserving authentic SBG artwork.
- Interactive horizontal rail dragging with momentum/inertia, mouse drag, touch swipe, and snap navigation (PREV / NEXT).
- Real 360° Product Viewer modal (`JerseyViewer3D.tsx`):
  - Orbit camera rotating through full 360° horizontal and vertical views.
  - FRONT VIEW and BACK VIEW direct alignment snap buttons.
  - Gentle continuous auto-rotation toggle.
  - Zoom in / Zoom out / Reset camera controls.
  - Full product specifications, size selector (S, M, L, XL, XXL, XXXL, Free Size), and functional Add to Bag with feedback toast and header counter.
- Integrated all 4 approved SKUs:
  - SBG Studio Pro (Tagline Edition) — White with "EVERY MOVE MATTERS" backprint.
  - SBG Studio Pro (Clean Edition) — White with clean minimalist back.
  - SBG Signature Pro — Black with "EVERY MOVE MATTERS" backprint.
  - SBG Stealth Classic — Black with clean minimalist back.
- Verified live in browser with automated testing and visual inspection.

## 2026-10-24 — Integration of 8 Transparent Jersey PNG Assets Complete

- Imported all 8 transparent PNG cutouts from `SBG_8_Jersey_Transparent_PNGs.zip` into `public/images/jerseys/transparent/`.
- Preserved 100% alpha transparency, original pixel dimensions, and brand graphics (crests, typography, textures, player names, and numbers).
- Created comprehensive asset manifest at `docs/ASSET-MANIFEST-TRANSPARENT-PNGS.md`.
- Grouped views logically into cohesive product galleries:
  - **SBG Signature Pro:** `02_black_front_main.png` (Front), `08_black_back_with_tagline.png` (Back), `04_black_front.png` (Alternate Angle).
  - **SBG Stealth Classic:** `03_black_front_logo_left.png` (Front), `01_black_back_no_tagline.png` (Back), `02_black_front_main.png` (Alternate Angle).
  - **SBG Studio Pro:** `06_white_front_01.png` (Front), `05_white_back.png` (Back), `07_white_front_02.png` (Alternate Angle).
- Showroom hanger and garment visual presentation updated: transparent cutouts nest naturally onto hangers on the freestanding clothing rail against the cool slate studio environment with realistic drop shadows.
- Interactive controls tested and verified in live browser: Front View, Back View, Alt Angle, size pills, and Add to Bag.
- Build verified with `npm run build` (Turbopack static prerender: 0 errors).

- Rebuilt the entire storefront around the **SECOND reference video** virtual clothing showroom aesthetic:
  - Replaced the conventional e-commerce card and hero banner layout with a full-screen, immersive virtual studio.
  - Implemented a cool grey/slate studio environment (`#2d333a` to `#16191d`) with perspective ground shadows, studio ceiling lighting, and soft floor reflection.
  - Constructed a freestanding architectural clothing rack (chrome top bar, vertical posts with weighted pedestal feet) displaying the SBG collection in an authentic horizontal hanging lineup.
  - Added dual camera perspective modes: **Wide Room** (full studio rack view) and **Rail Close-Up** (smooth close inspection).
  - Anchored high-contrast garment pill tags directly under each jersey with active gold highlight and real-time selection.
  - Implemented an elegant, non-intrusive **Floating Garment Inspector Dock** featuring:
    - Direct **Front View / Back View** toggle with the authentic supplied mockups (front logos, tagline backprint).
    - Size selection pills (`S`, `M`, `L`, `XL`, `XXL`, `Free Size`).
    - Price display (`₹999`) and live "Add to Bag" interaction with feedback toasts.
  - Preserved 100% of authentic SBG assets without redrawing, recoloring, or distorting logos or brand artwork.
  - Verified with comprehensive browser recording and screenshots; production build passing with 0 errors.

- Installed portable Node.js v20 LTS and bootstrapped Next.js 16 App Router (TypeScript, Vanilla CSS Modules, ESLint).
- Configured SBG Design System tokens in `app/globals.css` (studio black `#0A0A0A`, royal purple `#3D1A78`, gold `#D4A017`).
- Implemented `Banner`, `Navbar`, and `Footer` components in `app/layout.tsx`.
- Integrated supplied high-resolution jersey assets into `public/images/jerseys/`.
- Built interactive Virtual Showroom on `app/page.tsx` featuring horizontal rack lineup, interactive front/back angle toggle, size selector, introductory ₹999 pricing, and brand story.
- Production build verified (`npm run build` passed with zero errors) and dev server live on `http://localhost:3000`.

- Created `docs/FRD.md` — 26 features with screen layouts, state tables, API contracts, edge cases, cross-cutting security rules. All OPEN DECISIONs marked.
- Created `docs/NFR.md` — performance SLOs, security headers + rate limits, WCAG 2.1 AA, SEO, availability, India compliance (DPDP, Consumer Protection Rules), testing plan (unit/integration/E2E/Lighthouse/security), monitoring, deployment requirements.
- Updated `brain/CURRENT-STATE.md` to Phase 3 complete.
- Next: owner reviews FRD + NFR → Phase 4 Figma design gate.



- Owner reviewed research pack and confirmed 4 decisions: 3D assets to be supplied (showroom UI accepts image-led or 3D path), v1 catalogue = black + white jerseys only, checkout requires accounts, primary coding env = Google AI Studio (GitHub import).
- Recorded decisions 13–16 in `brain/DECISIONS.md`.
- Updated `brain/CURRENT-STATE.md` to Phase 2.
- Created `docs/PRD.md` — Product Requirements Document, 23 features, 10 open decisions, acceptance criteria.
- Created `prompts/02_GOOGLE_AI_STUDIO_BUILD_PROMPT.md` — master vibe-coding prompt with stage gates, slice order, brand rules, and security constraints.
- Next: owner reviews PRD, then Phase 3 FRD + NFR.



- Created `docs/RESEARCH-AND-OPTIONS.md` (stack, showroom, payments, PWA, India legal watchlist with official URLs, dates checked).
- Expanded `docs/SCREEN-INVENTORY.md` to ID’d storefront/admin/PWA inventory (planning only).
- Updated visual analysis and asset register after inspecting the contact sheet and black/white front mockups.
- Recorded conflict: “start building now” vs stage gates; coding still blocked.
- Figma remains unconnected in this Cursor session (`needsAuth`).
- Next: owner review, then PRD. No application code.

## 2026-10-24 — Blueprint v1.1 created

- Added reference-video-derived virtual showroom direction.
- Added supplied jersey asset mapping and brand-preservation rules.
- Added detailed mobile/desktop screen inventory requirements.
- Deferred real payment gateway until after core site/admin work; prohibited fake live-paid states.
- Added mandatory `brain/` source-of-truth protocol across Google AI Studio, Cursor, OpenCode, Antigravity and other agents.
- Preserved original v1.0 baseline for traceability.
- Research stage remains current; no application code is authorized yet.
