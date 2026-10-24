# SBG SHOP — AI Agent Operating Rules

## Mandatory start-of-task protocol

Before doing any research, editing, generating screens/code, installing dependencies, changing data or deploying, read these in order:

1. `brain/README.md`
2. `brain/CURRENT-STATE.md`
3. `brain/PROJECT-BRIEF.md`
4. `brain/DECISIONS.md`
5. The relevant requirement/spec document in `docs/`
6. `brain/CHANGELOG.md` for recent work

Then confirm the current phase gate permits the requested action. If a required document is missing or two documents disagree, stop and report the exact gap/conflict. Do not silently guess or bypass a gate.

## Project rules

- Treat `brain/` as the project source of truth for current context, approved decisions, stage and next allowed action.
- Do not start code until the current phase gate explicitly permits it.
- The visual reference video is inspiration for a virtual clothing showroom: quiet studio, horizontal hanging garment lineup, product-focus transitions, restrained motion. Build an original SBG version, never a clone.
- Use the supplied SBG jersey mockups as protected brand/product assets. Do not distort, recolour, redraw or replace the SBG crest/wordmark. Do not invent product facts.
- The real payment gateway is deferred until the storefront and admin core work. No live payments now; no fake transaction may be represented as a real paid order. Never build a custom payment processor.
- Firebase is not the default. Do not provision it automatically.
- Keep the architecture simple and reasoned; do not add Three.js, Spline, GSAP, Motion, Redis, Docker, Kubernetes, queues, microservices or other dependencies/infrastructure without a documented need.
- Use official documentation and maintained, appropriately licensed packages. Before adding a dependency, assess license, maintenance, security, compatibility, bundle size and duplication.
- Avoid generic AI-generated UI. Use the project's approved design system and visual direction. Do not blindly copy reference sites.
- Write concise but complete code. Keep clear naming, reusable modules and low duplication. No obfuscated/over-compressed code.
- Inspect existing files before modifying them. Preserve working functionality and make the smallest safe change.
- Server-side authority is mandatory for price, inventory, permissions and eventual payment/order state. Never expose secrets in client bundles or logs.
- Each feature must consider applicable loading, empty, error, success, invalid-input, permission-denied, offline and mobile/accessibility states.
- Test the change and report what was actually run. Never claim verification that did not occur.
- Keep PRD, FRD, NFR, architecture, database/API, security, legal/data-flow, screen design and implementation in sync.
- After every approved material change, update `brain/CURRENT-STATE.md`, `brain/CHANGELOG.md` and relevant docs. Record material architecture decisions as ADRs.
- Classify features as Required / Recommended / Optional / Not Applicable. Do not turn reference checklists into blind feature requirements.
- Do not claim the site is legally immune from lawsuits or penalties. Legal claims must be product-specific and checked against current official sources; high-risk items need qualified professional review.

## Output format for substantial work

State: `TOOL`, `MODEL`, `TASK`, `WHY`, `IMPORTANCE`, `COST`, `INPUT REQUIRED`, `EXPECTED OUTPUT`, `NEXT STEP`.

Before significant edits, list the intended files to change, the behaviour that must remain unchanged and the verification plan. Implement only the current stage, then stop at its gate.
