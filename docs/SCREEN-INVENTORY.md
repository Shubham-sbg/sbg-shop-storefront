# SBG SHOP — Screen Inventory v1.0 (Pre-Figma)

**Project:** SBG-branded ecommerce storefront + protected Admin Panel + PWA  
**Visual direction:** Original SBG virtual jersey showroom inspired by the supplied video and jersey mockups  
**Status:** Screen-planning document only. These screens have **not** been designed or implemented. Routes and scope are provisional until PRD/FRD sign-off.

This is a planning inventory, not a mandate to build ~50 separate pages. Combine routes where simpler. Mobile-first; desktop for major storefront/admin screens; tablet only where layout changes materially.

## Planning rules

- Use supplied SBG black and white jersey mockups faithfully. Preserve logo, colours, lettering, SHADOW/07 and supplied tagline. Do not treat alternate mockups as distinct SKUs unless confirmed.
- Treat the video as interaction inspiration, not a clone source. Image-led showroom unless licensed 3D is approved. Do not fake 3D rotation from flat mockups.
- Real payment gateway is deferred. Checkout is a non-production shell. Label TEST ONLY / NO REAL PAYMENT. Never show simulated success as a real paid order.
- Each applicable screen must later define loading, empty, error, success, validation, unavailable and permission-denied states.
- Unresolved product/business facts: **OPEN DECISION**. Do not invent prices, SKU, stock, size charts, material, delivery promises, reviews, customer counts, legal claims or payment status.

---

## A. Customer-facing storefront

| ID | Screen | Priority | Main contents and behaviours |
|---|---|---|---|
| S01 | Home / Virtual Showroom | MVP | SBG header, category nav, search/cart, horizontal jersey lineup, focused product name/price **when approved**, CTA, reduced-motion and image-led fallback |
| S02 | Category / Collection Listing | MVP | Jerseys, apparel, merch, digital categories; tiles, search, filter/sort, price and availability from server. Loading, no results, API error, out of stock |
| S03 | Product Detail | MVP | Gallery, correct front/back, title, price, variant/size, size guide, stock, facts/care where known, delivery/returns summary, qty, Add to Cart |
| S04 | Product Image Gallery / Zoom | Recommended | Larger front/back, thumbnails, accessible controls; no fake 3D. May live inside S03 |
| S05 | Search Results | MVP | Query, results, filters/sort. No result, empty query, error, loading. May merge into S02 |
| S06 | Cart | MVP | Variants, qty, remove, subtotal, coupon **if approved**, stock/price revalidation, continue shopping, checkout CTA |
| S07 | Checkout — Contact/Address | MVP shell | Necessary contact/shipping fields; guest/account **OPEN DECISION**; validation; privacy/policy links. No real payment |
| S08 | Checkout — Order Review | MVP shell | Items, shipping, tax/charges, total from **server**. Do not invent taxes |
| S09 | Payment / Checkout Pending | Deferred | Reserved for future gateway. Clearly non-production. No fake success |
| S10 | Order Result / Confirmation | MVP shell | Reference and state: pending, failed, cancelled, confirmed only after verification, or test-only |
| S11 | Order Lookup / Tracking | Recommended | Secure lookup only; no ID-guessing across customers. Tracking only with a real fulfilment method |
| S12 | Customer Account / Sign-in / Recovery | Scope decision | Sign-in, create, recovery, session expiry, profile, orders. Guest checkout may reduce friction |
| S13 | Customer Orders / Order Detail | Scope decision | Authenticated history, snapshots, status, eligible return/support. May be part of S12 |
| S14 | Digital Product Detail | MVP if digital launches | Description, version/type, licence, price, support. Do not promise unowned rights |
| S15 | Digital Access / Downloads | MVP if digital launches | Entitlements only after server-confirmed order; expired/unauthorized states |

## B. Brand, support, trust, policy

| ID | Screen | Priority | Notes |
|---|---|---|---|
| S16 | About SBG | Recommended | Owner-approved story only |
| S17 | Contact / Support | MVP | Real contact + accessible form; server validation; spam protection |
| S18 | FAQs | Recommended | Only genuine product/sizing/delivery/digital questions |
| S19 | Shipping / Delivery | MVP for physical | Confirmed regions/times/charges only |
| S20 | Returns / Cancellation / Refunds | MVP before accepting orders | Product-aware rules after operations + legal review |
| S21 | Privacy Policy / Notice | Required as applicable before launch | Match actual collection/vendors/retention |
| S22 | Terms of Service | Required/recommended by model | Jurisdiction-reviewed |
| S23 | Cookie / Consent Settings | Applicable | Only if actual non-essential tech requires it |
| S24 | Digital Licence / Usage | Required if digital goods | Reflect rights actually held |
| S25 | 404 / Not Found | MVP | Branded recovery, search/nav |
| S26 | Thank-you / Form Success | As needed | Avoid extra routes if inline success is enough |

## C. Protected Admin Panel

| ID | Screen | Priority | Notes |
|---|---|---|---|
| A01 | Admin Sign-in | MVP | No public signup; generic errors; rate limits |
| A02 | Admin Dashboard | MVP | Real counts only; never fake production stats |
| A03 | Product / Category Manager | MVP | Create/edit/archive/publish; validation; media; SEO fields |
| A04 | Variant / SKU / Size Manager | MVP for apparel | Owner-supplied facts only |
| A05 | Inventory Manager | MVP | Adjustments, low-stock, history, conflict-safe updates, audit |
| A06 | Product Media Manager | MVP | Approved front/back, alt text, safe uploads |
| A07 | Orders / Fulfilment Queue | MVP | Filters, snapshots, packing/shipping, failures |
| A08 | Order Detail / Returns / Refunds | MVP operational shell | No live gateway refund until gateway exists |
| A09 | Digital Product / Entitlement Manager | MVP if digital | Protect private files |
| A10 | Discount / Coupon Manager | Recommended | No misleading discounts |
| A11 | Homepage / CMS Manager | MVP | Draft/preview/publish |
| A12 | SEO / Social Preview Manager | MVP for discovery | Avoid accidental noindex of public catalog |
| A13 | Staff / Role / Permission Manager | MVP if multi-staff | Server-side enforcement. Minimal if single-owner |
| A14 | Support / Privacy Request Queue | Recommended / required where appropriate | Identity verification; min data |
| A15 | Audit Log | MVP for sensitive actions | Actor, action, entity, time; never log secrets |
| A16 | Store Settings / Integrations | MVP shell | Secrets stay server-side, not in UI |
| A17 | Analytics / Reports | Recommended | Real records only; permissioned export |

## D. PWA and system states

| ID | State | Priority | Behaviour |
|---|---|---|---|
| P01 | Install / Add to Home Screen | Recommended | Explain only on supported browsers; do not force prompt |
| P02 | Offline Fallback | MVP for PWA | Connection unavailable + retry; never claim checkout succeeded |
| P03 | Update Available | Recommended | Do not interrupt critical checkout |
| P04 | Global Loading / Skeleton | MVP | Do not skeleton-misrepresent unknown catalog facts |
| P05 | Global Error / Retry | MVP | Safe message; no stack traces/secrets |
| P06 | Session Expired / Access Denied | MVP where auth exists | Sign-in path; never flash protected content |
| P07 | Empty / Unavailable / OOS | MVP | Next action for empty cart, no products, bad variant, expired download, failed search |

## E. Provisional information architecture

**Public:** Home/Showroom, Jerseys, Apparel, Merchandise, Digital Products, About, Contact, Search, Cart, Account (if enabled).  
**Footer:** FAQs, Shipping, Returns, Privacy, Terms, Cookie Settings if applicable, Digital Licence if applicable, Contact.  
**Admin:** Dashboard, Products, Categories, Variants, Inventory, Orders, Returns, Digital, Coupons, CMS, SEO, Support/Privacy, Staff, Audit, Analytics, Settings.

Final nav is decided in IA/FRD — do not create routes merely to satisfy this list.

## F. Critical user flows (later design)

1. Physical purchase: S01 → S02/S05 → S03 → S06 → S07/S08 → future gateway → S10 → fulfilment.  
2. Digital purchase: S14 → cart/checkout → verified payment state → S15.  
3. Admin publish: A01 → A03/A04/A05/A06 → preview → publish → verify storefront.  
4. Fulfilment/refund: A07 → A08 → eligibility → state update → audit.  
5. Privacy request: S17/S21 → verify → permitted action → record → communicate.

## G. Figma sign-off (Phase 4 — not now)

Before coding UI, every screen needs: purpose/role, entry/exit, components, data sources, mobile/desktop (tablet if needed), breakpoints, interaction/keyboard, a11y/contrast, all relevant states, asset license record, justified analytics, acceptance criteria, labelled open decisions.

**Suggested Figma order:** S01, S02, S03 (+S04), S06, S07–S08, S10, A01, A02, A03/A04, A05, A07, digital if in MVP, A11/A12, A13/A15, S16–S22, P01–P07.
