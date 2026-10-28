# SBG SHOP — Product Requirements Document (PRD)

**Phase:** 2 — PRD  
**Status:** Draft — awaiting owner review and sign-off  
**Date:** 24 October 2026  
**Preceded by:** `docs/RESEARCH-AND-OPTIONS.md` (Phase 1, owner-reviewed)  
**Followed by:** `docs/FRD.md` + `docs/NFR.md` (Phase 3)  

> **Gate rule:** This document defines *what* the product must do. It does not select technology, approve coding, or permit Figma implementation. Technology decisions happen at the Architecture gate (Phase 5). Coding starts at Phase 7.

---

## 1. Product vision

SBG SHOP is the official direct-to-consumer e-commerce store for the SBG brand. It presents jerseys and apparel as premium, editorial products inside a virtual showroom inspired by high-end sports and fashion brands. Every customer interaction — browsing, selecting, purchasing, and tracking — must feel cohesive, fast, and exclusively SBG.

### Design north star
A quiet, premium virtual showroom: cool-grey/charcoal studio, horizontally displayed garments, controlled product-focus transitions, minimal typography, SBG black/deep-purple/gold/white palette. Original SBG identity preserved at all times.

---

## 2. Version 1 scope

### In scope

| Area | What is included in v1 |
|---|---|
| Catalogue | Black SBG jersey (front + back) and White SBG jersey (front + back). Exact SKUs/variants confirmed by owner before Figma. |
| Storefront | Home / virtual showroom, product listing, product detail, cart, checkout (auth required), order confirmation shell. |
| Accounts | Required account: sign-up, sign-in, password recovery, session management. No public admin signup. |
| Admin panel | Product manager, inventory, orders / fulfilment queue, media manager, basic CMS / showroom manager. |
| PWA | Installable on Android/iOS via manifest + service worker. Offline fallback page. App icon. |
| Legal pages | Privacy Policy, Terms of Service, Returns / Refund Policy, Shipping Info, Contact. Content filled by owner before launch. |
| SEO | Unique titles, meta descriptions, canonical URLs, Product structured data (real data only), sitemap, robots.txt. |

### Out of scope (v1)

- Apparel, merchandise, digital products — deferred to v2+.
- Guest checkout — deferred; accounts required.
- Real payment gateway — deferred; checkout stops at order-review/pending with TEST ONLY label.
- COD — deferred.
- Discount / coupon system — deferred.
- Customer reviews / ratings — deferred.
- Multi-currency / international shipping — deferred.
- Analytics / email transactional — deferred (integration points reserved).
- 3D garment assets — owner will supply; showroom UI built to accept either image-led or 3D display. Implementation waits for supplied assets.

---

## 3. Users and roles

| Role | Description | Access |
|---|---|---|
| Visitor | Unauthenticated user browsing the store | Public storefront, product pages, legal/policy pages |
| Customer | Authenticated shopper | All visitor pages + cart, checkout, order history, account |
| Admin — Owner | Full admin access | Entire admin panel, all data |
| Admin — Staff | Limited admin access | Configured by owner; least-privilege per feature |

---

## 4. Required features (v1 MVP)

### F01 — Virtual Showroom / Home
- Display the two jersey families (black, white) in a horizontal showroom-inspired layout.
- Each jersey shows a focused product frame with a name label and price (real data only; no invented prices).
- When 3D assets are supplied, show the showroom with the supplied garments. Until then, design must clearly communicate it is an image-led placeholder, not functional 3D.
- Reduced-motion fallback required (CSS `prefers-reduced-motion`).
- Header: SBG logo, navigation (Jerseys, About, Contact), cart icon, account icon.
- Mobile-first; desktop layout adapts the horizontal rail for larger screens.

### F02 — Product Listing / Collection
- URL: `/jerseys`
- Show all available jersey products with image, name, price, and stock status.
- Filter by: colour (black / white). Sort by: default / price low-high / price high-low.
- Handle: loading skeleton, no-results state, API error state, out-of-stock badge.

### F03 — Product Detail Page (PDP)
- URL: `/jerseys/[slug]`
- Gallery: front image, back image, toggle control. No fake 3D rotation.
- Product name, price (server-authoritative), size selector (sizes confirmed by owner), stock indicator.
- Size guide (link or inline — content provided by owner).
- Quantity selector (max: available stock).
- Add to Cart — validates size selection, stock, and authentication status.
- If not logged in, redirect to sign-in before cart.
- SEO: real product title, description, Product schema (JSON-LD).

### F04 — Cart
- Persistent (tied to account session).
- Show items: product image, name, size, quantity controls, remove, subtotal.
- Revalidate price and stock on load (server-authoritative).
- Show stock-changed / price-changed warnings if cart is stale.
- Proceed to Checkout CTA.

### F05 — Checkout — Contact + Shipping Address
- Collect: full name, phone, address (line 1, line 2, city, state, PIN code), India only v1.
- Input validation (regex on PIN, phone format).
- Save address to account for next purchase.
- Clear links to Privacy Policy and Returns/Refund Policy.

### F06 — Checkout — Order Review
- Show items, quantities, shipping (value from owner-configured rate, not invented), tax/GST (OPEN DECISION — owner must provide actual rates), and total.
- Price and tax must be computed server-side; never trust client totals.
- Confirm button creates a pending order in the database; does NOT charge.
- Payment placeholder: "Payment will be available soon — TEST ONLY. No real transaction." Clearly labelled. Never show fake "payment success".

### F07 — Order Confirmation / Result
- States: pending (order created, awaiting payment enablement), failed, cancelled.
- Show order reference number, items, delivery address, expected next steps.
- No state should say a payment succeeded unless a real gateway confirms it.

### F08 — Account — Sign-up / Sign-in / Recovery
- Sign-up: name, email, password (server-side strength check). Email verification before purchase.
- Sign-in: email + password. Rate-limit. Generic "invalid credentials" error (no user enumeration).
- Password recovery: secure token, expiry, invalidated after use.
- Session: HTTP-only cookie, CSRF protection, server-side session invalidation on sign-out.

### F09 — Account Dashboard
- Order history list: order reference, date, status, items.
- Order detail: item snapshot (name/size/price at time of order), current status, delivery address.
- Change password, edit delivery addresses.

### F10 — Admin Sign-in
- Protected route: `/admin/login`. No public admin signup.
- Rate-limit failed attempts. Generic errors. MFA placeholder for later.

### F11 — Admin Dashboard
- Real metrics only: total orders (by status), low-stock alerts, recent orders.
- No fake / placeholder stats in production.

### F12 — Admin Product Manager
- Create / edit / archive / publish jersey products.
- Fields: name, slug, description, price, compare-at price, category, tags, SEO title, meta description.
- Publish / unpublish toggle.
- Soft delete / archive (never hard delete a product with existing orders).

### F13 — Admin Variant / Size Manager
- Per product: define size options (owner confirms exact sizes).
- Each variant: SKU, size, colour label, price override (optional), active toggle.

### F14 — Admin Inventory Manager
- Per variant: stock quantity, low-stock threshold.
- Adjust stock with a reason field (audit logged).
- Low-stock alerts on admin dashboard.

### F15 — Admin Media Manager
- Upload front/back jersey images per product.
- Alt text field required.
- Set primary image and secondary image (back view).
- Validate: file type (WebP/JPEG/PNG), max size (defined at NFR gate).

### F16 — Admin Orders / Fulfilment Queue
- List orders with filter (status: pending / confirmed / shipped / delivered / cancelled / refund-requested).
- Order detail: items (snapshot at time of order), customer, address, status timeline.
- Update status: mark shipped (requires tracking number), mark delivered.
- Cancel order action with reason.
- Audit log entry on every status change.

### F17 — Admin Returns / Refunds
- Record a return request against an order.
- Eligibility check: within configured return window (owner sets days in store settings).
- States: requested → approved → rejected → refund-issued (gateway call deferred).

### F18 — Admin CMS / Showroom Manager
- Configure showroom header text, promotional banners (text + image).
- Select which products appear in the showroom lineup and in what order.
- Draft / preview / publish workflow.

### F19 — Admin SEO Manager
- Per page: title, meta description, canonical URL, og:image, og:title, noindex toggle.
- Sitemap generated from published products and public pages.

### F20 — Admin Audit Log
- Record: actor (admin email), action, entity, entity ID, timestamp, old/new value summary.
- Read-only to admin; never expose secrets or PII in log values.

### F21 — Admin Store Settings
- Store name, contact email, return window (days), low-stock threshold default.
- Secrets stored server-side only.

### F22 — Legal / Policy Pages
- Privacy Policy, Terms of Service, Returns/Cancellation/Refund Policy, Shipping & Delivery, Contact.
- Content provided by owner before launch; no placeholder text in production.

### F23 — PWA — Install + Offline
- Web app manifest with SBG branding, 192 + 512 icons, standalone display.
- Service worker: cache public pages for offline reading.
- Offline fallback page.
- App update notification.

---

## 5. Non-functional requirements (summary — full detail in NFR.md)

| Concern | Requirement |
|---|---|
| Performance | LCP < 2.5 s on 4G mobile; CLS < 0.1 |
| Security | HTTPS; HTTP-only session cookies; CSRF protection; server-side price/stock/auth; no secrets in client bundles; rate limiting |
| Accessibility | WCAG 2.1 AA minimum; keyboard navigation; `prefers-reduced-motion` |
| SEO | 100% of public product pages indexed; admin/cart/checkout excluded |
| Availability | 99.5% uptime post-launch |
| Data protection | DPDP Act 2023 / Rules 2025; Consumer Protection E-Commerce Rules 2020 |

---

## 6. Open decisions (resolve before Figma gate)

| # | Decision | Owner action needed |
|---|---|---|
| OD-01 | Canonical jersey SKUs — which front/back image file per product? Tagline vs no-tagline separate SKU? | Owner to confirm |
| OD-02 | Size chart — exact sizes and size guide content | Owner to provide |
| OD-03 | Prices — exact INR price per jersey | Owner to provide |
| OD-04 | Stock — initial stock levels and low-stock threshold | Owner to provide |
| OD-05 | Shipping — carrier, rates, estimated delivery window | Owner to provide |
| OD-06 | GST / tax — GSTIN, applicable rate, invoice format | Owner to confirm with CA |
| OD-07 | Returns — return window (days), eligible conditions | Owner to confirm |
| OD-08 | Legal identity — registered name, address, grievance officer, contact | Owner to provide |
| OD-09 | 3D assets — when will owner supply them and in what format? | Owner to provide timeline |
| OD-10 | Domain — store URL | Owner to provide |

---

## 7. Acceptance criteria

A feature is considered complete only when:

1. It matches the requirements in this PRD and the approved FRD.
2. It has been verified in the actual running application.
3. Loading, empty, error, success, validation, permission-denied states are implemented.
4. No fabricated product facts, prices, taxes, stock, or payment-success states appear.
5. Admin and checkout routes enforce server-side authentication and authorisation.
6. Audit log entries exist for all sensitive admin actions.
7. No secrets appear in browser-visible code, URLs, or console output.

---

## 8. Explicit exclusions

- Custom payment processor (Decision 11).
- Fake 3D rotation without supplied 3D garment assets (Decision 12).
- Firebase auto-provisioning (Decision 8).
- AI-generated product facts, reviews, testimonials, or legal text.
- Redis, Docker, Kubernetes, Three.js, GSAP, Motion, or microservices without ADR.

---

## 9. Next steps after PRD sign-off

1. Write `docs/FRD.md` — detailed screen-by-screen functional requirements.
2. Write `docs/NFR.md` — measurable non-functional requirements and test plan.
3. Figma / UI-UX gate: design every PRD screen with mobile + desktop frames and states.
4. Architecture gate: select and document final stack via ADR.
5. Security gate: threat model, auth flow, RBAC, webhook verification plan.
6. Incremental coding — small, tested, verified slices in Google AI Studio (GitHub import).
