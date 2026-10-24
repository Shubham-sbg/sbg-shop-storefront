# SBG SHOP — Current State

- **Blueprint:** `SBG_SHOP_Product_Blueprint_v1.1.md`
- **Version:** 1.1 — Virtual Showroom Edition
- **Current phase:** Phase 1 — Research and visual-reference/asset intake (**research pack complete; awaiting owner review**)
- **Current status:** Not yet coded. Do not scaffold or deploy.
- **Primary development environment preference:** Google AI Studio Build mode, after current compatibility is verified.
- **Other possible agents:** Cursor, OpenCode, Antigravity or other tools may be used if the owner chooses; all must follow the same `AGENTS.md`/`brain/` rules.

## Instruction conflict (recorded, not bypassed)

On 24 Oct 2026 the owner pasted a “Start Building (Lean Production Mode)” / Figma-to-app prompt asking to implement a working slice immediately. That conflicts with approved Decision 9 (stage gates) and this file’s “no code” status. The research gate was completed instead. Coding stays blocked until PRD → FRD/NFR → Figma → architecture → security/UI gates pass. Figma MCP in this session is `needsAuth` (not connected).

## Confirmed requirements

- Mobile-first SBG SHOP e-commerce storefront for India initially.
- Physical jerseys/apparel and other merchandise plus digital products.
- Protected Admin Panel and installable PWA.
- Use supplied SBG black and white jersey mockups as product assets; preserve the SBG branding/artwork.
- Visual direction should be inspired by the supplied virtual-fashion-store video: cool studio, hanging/horizontal garment lineup, subtle product focus/camera motion, understated labels, premium showroom mood.
- Avoid generic AI-store aesthetics and do not copy the reference site.
- Real payment gateway integration will be added later, after core website/admin work. No live payments now; any mock/test flow must be clearly labelled and must not say real payment succeeded.
- Firebase is not preselected and must not be automatically provisioned.
- Documents and design gates precede coding.

## Open decisions

- Exact product names/SKUs/prices/sizes/stock/material/care data.
- Whether image-led/3D-inspired showroom is enough for v1, or licensed true 3D garment assets are needed.
- Guest versus account checkout.
- COD at launch.
- Shipping provider/fulfilment process.
- Exact digital product types and licence terms.
- Final stack, database, auth, hosting and storage after researched comparison.
- Selected payment gateway and merchant setup (intentionally deferred).
- Store domain, legal business details, GST status and support/grievance contacts.

## Completed

- Prior v1.0 product blueprint retained as `docs/SBG_SHOP_Product_Blueprint_v1.0_BASELINE.md`.
- v1.1 virtual showroom addendum drafted.
- User-provided video and jersey assets packaged under `references/`.
- Agent source-of-truth protocol created.
- Research pack: `docs/RESEARCH-AND-OPTIONS.md`, `docs/VISUAL-REFERENCE-ANALYSIS.md`, `docs/SCREEN-INVENTORY.md`, `docs/ASSET-IP-REGISTER.md`.

## Next allowed step

Owner reviews the research pack (especially image-led v1, first-release catalogue, guest vs account, and legal identity). After sign-off, Phase 2 is `docs/PRD.md` only. Still no code, no scaffolding, no Firebase, no live gateway, no deployment.
