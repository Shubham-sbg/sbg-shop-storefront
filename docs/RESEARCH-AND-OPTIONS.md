# SBG SHOP — Research and Options

**Phase:** 1 — Research and visual-reference intake  
**Checked:** 24 October 2026  
**Status:** Ready for owner review. This document compares options. It does **not** lock the stack, approve coding, or invent catalogue/legal facts.

**Classification of this work:** Required before PRD.

---

## 1. Facts vs recommendations vs open decisions

| Kind | Meaning |
|---|---|
| **Fact** | Observed from supplied assets or stated in cited official docs as of the check date. |
| **Recommendation** | Suggested default for a later architecture/PRD decision. Not binding until recorded in `brain/DECISIONS.md`. |
| **OPEN DECISION** | Owner/professional input required. Do not invent. |

This research does **not** authorise application code, scaffolding, dependency install, Firebase provisioning, live payments, or deployment.

---

## 2. What was inspected

- Root `AGENTS.md`, `brain/*`, `SBG_SHOP_Product_Blueprint_v1.1.md`, existing `docs/` files, `README_FIRST.md`.
- Video `references/visual/SBG_Shop_Virtual_Store_Reference.mp4` and contact sheet `references/visual/reference-video-contact-sheet.jpg`.
- Jersey mockups in `references/jersey-assets/` (black and white families, front/back, tagline/no-tagline variants).

**Visual-reference fact:** The supplied video is a screen recording of a third-party “virtual store” UI (contact sheet labels include a non-SBG store name). Principles only: cool-grey studio, horizontal hanging lineup, wide vs focused framing, compact product label. Do not copy that store’s name, copy, assets, or layout.

**Asset fact:** Both inspected hero mockups are fully rendered 2D images with studio lighting/backgrounds (black jersey: dark studio + purple floor glow; white jersey: hanger/rail + lighting). They are not transparent cutouts or UV texture maps. See `docs/ASSET-IP-REGISTER.md` and `docs/VISUAL-REFERENCE-ANALYSIS.md`.

---

## 3. Google AI Studio (preferred later environment)

Official sources checked 24 Oct 2026:

- Build mode: https://ai.google.dev/gemini-api/docs/aistudio-build-mode  
- Full-stack runtime: https://ai.google.dev/gemini-api/docs/aistudio-fullstack (page noted last updated 20 Oct 2026)  
- Deploy: https://ai.google.dev/gemini-api/docs/aistudio-deploying  

**Facts from those pages:**

- Web apps: React frontend by default + Node.js server for secrets, APIs, npm, database connections.
- Import from GitHub; two-way GitHub sync; ZIP export for local development.
- Deploy path includes Cloud Run; a Google Cloud Starter Tier is described for a limited number of apps.
- Firebase (Firestore + Google Sign-In) can be **agent-provisioned** if requested. External DBs (examples in docs: Supabase, Firebase, MongoDB Atlas) are supported by connecting credentials.
- Firebase is **not required** to run a full-stack AI Studio app.

**Implication for SBG:** Google AI Studio remains a valid coding environment **after** PRD/FRD/design/architecture gates. It must not auto-provision Firebase. Cursor (this repo) can complete research/PRD/docs now; later code can live here and/or sync to AI Studio via GitHub.

**Risk:** AI Studio “vibe coding” can skip server-side inventory, RBAC, and payment-state rules. Any later implementation must still follow `AGENTS.md` gates regardless of tool.

---

## 4. Application stack options (do not lock yet)

Need: mobile-first storefront, SEO for public catalog, protected admin, PWA, server-authoritative price/stock/order state, private digital files, India-first.

### Option A — Next.js App Router + Node server + PostgreSQL

- **Fit:** Strong for SEO, mixed public/private routes, server actions/route handlers, PWA on a custom domain.
- **Auth:** Next.js documents using a maintained auth library plus a server-side data-access/authorization layer: https://nextjs.org/docs/app/guides/authentication  
  Auth.js/NextAuth is one maintained option: https://authjs.dev/getting-started/installation?framework=Next.js (requires `AUTH_SECRET`; session checks must still be enforced on the server, not only in UI).
- **DB:** PostgreSQL (PostgreSQL License): https://www.postgres.org/about/license  
  ORM candidates if/when coding is approved: Prisma ORM (Apache-2.0) or Drizzle; do not pick until architecture gate.
- **Hosting:** Vercel, Cloud Run, or similar Node hosts. Pick at architecture/deployment gate.
- **License/maintenance:** Next.js and React are widely maintained; still verify versions at implementation time.
- **Cost:** Frameworks are free; hosting/DB billed by vendor. No numbers claimed here.
- **AI Studio fit:** Possible if the generated/imported project stays a Node web app; confirm scaffold compatibility before locking.

### Option B — AI Studio default React + Node, custom API, PostgreSQL

- **Fit:** Matches preferred environment; secrets stay on Node.
- **Risk:** Weaker built-in SEO/routing conventions than Next.js unless a documented Next/SSR path is used. More custom work for admin RBAC, CSRF, and catalog URLs.
- **Firebase temptation:** High because the agent can provision it. Binding decision: do not auto-provision.

### Option C — Hosted commerce (Shopify or similar) + custom storefront

- **Fit:** Payments, GST plugins, and order ops are mature.
- **Mismatch:** Custom SBG virtual showroom, digital entitlements, and deferred owner-chosen gateway are harder. Theme/app licenses and data-export lock-in apply.
- **Recommendation:** Not first choice for a branded showroom + custom admin unless the owner prefers a hosted commerce OS.

### Option D — Firebase/Firestore + Firebase Auth (explicitly compared, not default)

- **Official:** AI Studio can provision Firestore + Google Sign-In (https://ai.google.dev/gemini-api/docs/aistudio-fullstack).
- **Pros:** Fast prototype, Google Sign-In.
- **Cons for this shop:** Weak default fit for transactional inventory, order snapshots, GST invoice fields, relational variants/SKUs, and private file entitlements. Security Rules are easy to get wrong. Conflicts with “Firebase is not preselected.”
- **Recommendation:** Reject as default. Reconsider only with an ADR.

**Lean recommendation (not approved):** Option A, implemented later in small slices, with AI Studio/GitHub as an optional coding surface. No Redis, Docker, Kubernetes, queues, Three.js, GSAP, or microservices unless a later NFR proves the need.

---

## 5. Showroom visualisation options

| Option | What it is | Honest with current assets? | Cost/risk | Recommendation |
|---|---|---|---|---|
| **Image-led showroom** | Horizontal rail/lineup using exact mockups; CSS/scroll focus; reduced-motion static fallback | Yes | Low; no fake rotation | **Recommended for v1** |
| **Hybrid 3D room + 2D cards** | 3D studio, mockups as framed images | Possible, but rectangular backgrounds will show | Adds WebGL bundle; AGENTS.md forbids 3D libs without documented need | Not for first slice |
| **True 3D garments** | Licensed mesh + mapped artwork | **No** with current files | High cost; logo distortion risk | Only if owner supplies licensed 3D + mapping |

**OPEN DECISION:** Confirm image-led v1 vs licensed 3D as a launch requirement.

---

## 6. Payments (later only)

**Binding:** Real gateway deferred. No custom processor. No fake “paid” success.

Candidates to compare **when** the owner selects a provider (not now):

- Razorpay Payment Gateway (India): https://razorpay.com/docs/payments/payment-gateway  
  Standard Checkout requires **server-created orders**, signature verification, webhooks, capture: https://razorpay.com/docs/developer-tools/integrations/standard-checkout
- Cashfree Payments APIs: https://www.cashfree.com/docs/api-reference/payments/overview

**Design implication for later FRD:** Keep a provider interface (`createPayment`, `handleWebhook`, `refund`) and a clearly labelled **TEST ONLY / NO REAL PAYMENT** adapter until merchant onboarding exists. COD is **OPEN DECISION**.

RBI/merchant contract obligations must be read from the chosen provider and qualified review; this research does not claim SBG is already eligible.

---

## 7. Auth, storage, PWA, SEO, monitoring (options)

| Concern | Options | Notes |
|---|---|---|
| Customer accounts | Guest-only checkout; optional accounts; required accounts for digital goods | **OPEN DECISION** (guest vs account). Digital downloads need authenticated entitlements if sold. |
| Admin auth | Email/password + server sessions; later MFA | No public admin signup. Rate-limit sign-in. Generic errors. |
| Public media | Object storage + CDN; derived WebP/AVIF | Preserve source mockups; do not recolour/redraw logos. |
| Private digital files | Server-side auth + short-lived signed URLs; never public bucket URLs | Required if digital products launch. |
| PWA | Web app manifest + HTTPS; service worker for **public** cache and offline page | MDN installability: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable — Chromium typically wants name/short_name, 192+512 icons, start_url, display. Service worker still needed for a real offline fallback. Never cache checkout as succeeded offline. |
| SEO | Unique titles, canonicals, sitemap of public URLs only, Product structured data only when facts are real | Do not index admin/cart/checkout/account. |
| Email | Transactional provider later (order/support) | Do not pick until architecture gate. |
| Monitoring | Error reporting + uptime after first deploy | No fake dashboards. |
| Shipping | Manual fulfilment vs Shiprocket/Delhivery/etc. | **OPEN DECISION.** Do not promise delivery times. |

---

## 8. India legal / commerce watchlist (not legal advice)

Sources checked 24 Oct 2026. Applicability depends on SBG’s actual entity, GST status, and launch date. High-risk items need qualified professional review. This project must **not** claim legal immunity.

| Topic | Official / primary source | Implication |
|---|---|---|
| DPDP Act, 2023 | MeitY Act PDF: https://www.meity.gov.in/static/uploads/2024/02/Digital-Personal-Data-Protection-Act-2023.pdf | Digital personal data processing; notice, consent, rights, breach. Commencement is by notified dates. |
| DPDP Rules, 2025 | MeitY document page: https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa ; PIB 14 Nov 2025: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190014 | Gazette 13 Nov 2025. Staged commencement (rules 1, 2, 17–21 on publication; rule 4 after one year; rules 3, 5–16, 22–23 after eighteen months per the notified text). **Verify which rules are in force at SBG launch.** |
| Consumer Protection Act, 2019 & E-Commerce Rules, 2020 | https://consumeraffairs.nic.in/theconsumerprotection/consumer-protection-e-commerce-rules-2020 | Inventory-model seller duties, disclosures, grievance officer, unfair practices. |
| E-Commerce (Amendment) Rules, 2026 | PIB 10 Sep 2026: https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2308759 | Stated effective **1 January 2027**: NCH partnership, grievance copy, no misleading search, sponsored-listing disclosure, prior-price (lowest in preceding 30 days) when announcing reductions, yearly dark-pattern self-audit, other marketplace-oriented duties. Review final gazette text against SBG’s **own-inventory** model. |
| GST / e-commerce | CBIC sectoral FAQ: https://cbic-gst.gov.in/hindi/sectoral-faq.html | Own-product sales vs TCS on other suppliers. **OPEN DECISION:** GSTIN, HSN/SAC, invoicing. Confirm with a CA. |
| IP | Copyright Act / trademarks | Jersey crest, SHADOW/07, tagline, player likenesses, third-party marks: confirm SBG’s right to sell. |

**OPEN DECISION:** Legal business name, GST, grievance contact, returns/refunds, domain, cookie/analytics vendors.

Do not publish Privacy/Terms until they match **actual** data flows. Do not show a deceptive cookie banner if no non-essential tracking exists.

---

## 9. Screen and design research

A planning inventory (not Figma) is in `docs/SCREEN-INVENTORY.md`. Suggested Figma order remains: showroom → collection → PDP → cart → checkout shell → order result → admin core → legal/PWA states.

Figma in this Cursor session: **not connected** (`plugin-figma-figma` MCP status `needsAuth`). Phase 4 (UX/Figma) is **after** PRD/FRD. Do not treat this research as UI implementation.

---

## 10. Testing / quality research (for later NFR)

When coding is permitted, verify: TypeScript/lint/build; invalid input; loading/empty/error; concurrent last-item stock; no client-trusted prices; admin permission denials; PWA offline does not mutate orders; no secrets in client bundles.

Accessibility: follow WCAG for contrast, labels, keyboard, and `prefers-reduced-motion` on the showroom.

---

## 11. Risks if coding starts now

1. No approved prices, SKUs, sizes, stock, or size chart → any UI would fabricate product facts.  
2. No PRD/FRD → routes and guest/account/COD scope would be guessed.  
3. No Figma sign-off → visual work would be generic or a clone of the reference video.  
4. Payment/legal pages would be inaccurate.  
5. Conflicts with approved Decision 9 (stage gates) and `brain/CURRENT-STATE.md`.

---

## 12. Blockers for the next phase (PRD)

Owner should confirm or explicitly defer:

1. Image-led showroom for v1?  
2. Canonical black/white jersey variants (tagline vs no tagline; which front file)?  
3. First-release catalogue: jerseys only vs apparel/merch/digital?  
4. Guest checkout vs accounts.  
5. COD at launch (after payments exist).  
6. Business/legal identity, GST, contacts.  
7. Coding environment for implementation: Cursor, Google AI Studio, or both via GitHub.

Until then, PRD can still be drafted from **known** goals and mark the rest `OPEN DECISION`.

---

## 13. Recommended next allowed step

**Owner reviews this research pack.** After sign-off, Phase 2 is `docs/PRD.md` only. Still no code, no Figma-as-production-UI, no Firebase, no live gateway.
