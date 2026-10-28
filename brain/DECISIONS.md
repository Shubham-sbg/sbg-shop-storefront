# SBG SHOP — Decisions and Open Items

## Approved / binding

1. **Brand:** Use supplied SBG jersey mockups and existing SBG identity; do not redesign or distort the eagle crest/logo.
2. **Visual reference:** Use the supplied virtual clothing store video for interaction/art-direction inspiration only; make an original SBG implementation.
3. **Platform:** Mobile-first website + Admin Panel + PWA.
4. **Initial market:** India.
5. **Categories:** jerseys/apparel, other merchandise, digital products.
6. **Primary coding environment:** Google AI Studio is preferred, but current support/compatibility must be checked before locking the stack.
7. **Payment timing:** Real gateway integration is deferred until the core website/admin flows work and the owner provides/selects the gateway. No live payments now.
8. **Firebase:** Not automatically selected; compare architecture options first and never auto-provision without an approved decision.
9. **Stage gates:** Research → PRD → FRD/NFR → Figma/UI/UX → architecture → database/API/RBAC/business logic → security → UI approval → incremental coding → tests/audit → deployment.
10. **Brain folder:** Every agent must read root `AGENTS.md` and the current brain docs before every task/change.
11. **Payment wording:** “My own gateway later” is understood as the owner providing/selecting their gateway/service later; it is not permission to build a custom payment processor.
12. **3D honesty:** The user supplied rendered 2D jersey mockups, not clean garment meshes/UV textures. Do not claim true 3D rotation unless actual 3D assets and mapping work exist.

## Pre-Figma confirmed decisions — 24 Oct 2026 (Phase 4 gate opened)

17. **SKUs:** Black jersey with tagline (EVERY MOVE MATTERS) and black jersey without tagline are **separate SKUs / products**. White jersey is a third product. Total v1 catalogue: 3 jersey products (black-tagline, black-no-tagline, white).
18. **Sizes:** S, M, L, XL, XXL, XXXL, and One Size (Free Size). All 7 options offered.
19. **Price range:** Under ₹999 per jersey. Use ₹999 as the Figma placeholder price until owner confirms exact price before launch.
20. **Showroom:** Image-led virtual showroom confirmed for v1 launch. Use supplied SBG jersey mockups with premium studio aesthetic, horizontal display, product-focus transitions, front/back viewing. Architecture must stay extensible for genuine 3D assets later. Do NOT fake 3D rotation.

## Owner-confirmed decisions — 24 Oct 2026 (Phase 2 gate opened)

13. **Showroom / 3D:** Owner will supply 3D garment assets. Pause image-led showroom implementation until 3D assets arrive; design the showroom UI to accept either path. Do not use flat 2D mockup rotation to fake 3D.
14. **v1 catalogue:** Black + White SBG jerseys only. Apparel, merch, digital products deferred to later releases.
15. **Checkout auth:** Accounts required to purchase. Guest checkout is deferred. Digital entitlements will be tied to authenticated accounts.
16. **Primary coding environment:** Google AI Studio, imported via GitHub. Cursor is a secondary/research surface. All agents must still follow `AGENTS.md` / `brain/` rules regardless of tool.

## Research findings (not yet approved)

Recorded 24 Oct 2026 in `docs/RESEARCH-AND-OPTIONS.md`. These are **recommendations**, not locked architecture:

- v1 showroom: image-led horizontal lineup using supplied mockups (mockups have studio backgrounds; true 3D not honest with current files).
- Later implementation lean option: Next.js App Router + PostgreSQL + server-side auth; Google AI Studio remains a valid coding surface via GitHub and must not auto-provision Firebase.
- Payments: keep a provider interface; compare Razorpay/Cashfree only after the owner selects a merchant gateway. TEST ONLY adapter until then.
- Firebase/Firestore: compared and **not** recommended as the default commerce database.

## Unresolved — do not guess

- Product catalogue, names, SKUs, prices, sizes, stock and material/care data.
- Whether to use licensed 3D garment models or ship an image-led 3D-inspired showroom in v1.
- Guest checkout versus accounts.
- COD.
- Shipping partner/courier and fulfilment model.
- Digital product types, licences and delivery method.
- Final frontend framework/runtime, backend, database, auth, storage, email, monitoring and host.
- Payment provider and merchant account details.
- Business/legal name, GST registration/status, returns rules, contact details, domain and support/grievance contacts.
- Analytics and consent approach.

## Decision rule

Material changes require an ADR and owner review. If a later user instruction conflicts with an approved decision, record the conflict before changing the architecture.
