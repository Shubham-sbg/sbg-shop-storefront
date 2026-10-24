# SBG SHOP — Product Blueprint v1.1 (Virtual Showroom Edition)

**Project type:** SBG-branded direct-to-consumer e-commerce store  
**Platforms:** Mobile-first website + protected Admin Panel + Progressive Web App (PWA)  
**Initial market:** India  
**Product categories:** Jerseys & apparel, other merchandise, digital products  
**Primary development environment:** Google AI Studio Build mode, subject to verification of scaffold/export/runtime fit  
**Status:** Pre-development blueprint — virtual-showroom direction added; no production code authorized by this document alone  
**Version date:** 24 October 2026

---

## 0. Operating Rules

This blueprint is the baseline context for the SBG SHOP project. It is not permission to start coding immediately. Follow the documented stage gates and only move forward when the current phase has a reviewable deliverable.

### Non-negotiable engineering rules

1. Work like a senior product, design, engineering, security, QA, and operations team—not a generic site generator.
2. Do not code before the requirements and architecture are sufficiently defined and the relevant gate is approved.
3. Use concise, readable, complete code. “Short” must never mean incomplete, cryptic, insecure, or untested.
4. Inspect the existing repository before modifying it. Preserve working behaviour and make the smallest safe change.
5. Do not claim a feature works unless it has been run and verified.
6. Use official documentation and maintained dependencies first. Do not copy random website/GitHub code.
7. Before adding a dependency, check maintenance, license, reputation, vulnerabilities, compatibility, bundle/performance cost, and whether an existing dependency can do the job.
8. Design references are for analysis and inspiration—not for copying protected layouts, text, code, images, brand assets, or animations.
9. Avoid generic “AI-template” visuals. Use an SBG-specific design system, meaningful content, proper typography, intentional hierarchy, and purposeful motion.
10. Do not add 3D, animation, services, or infrastructure merely because they are available. Justify them against user value and cost/performance.
11. Security, privacy, legal, accessibility, reliability, SEO, and performance are architecture concerns, not last-minute decoration.
12. Classify requirements and documents as **Required / Recommended / Optional / Not Applicable** for this project.
13. Keep this document, architecture decisions, API/database specifications, legal statements, and code synchronized as the project changes.
14. Firebase is not selected by default. Google AI Studio offers Firebase setup, but the agent must not provision or add it automatically. Select any backend/database only after architecture comparison and explicit review of the decision.
15. A mandatory `brain/` folder is the project memory/source of truth. Before every task or change, every AI agent must read `AGENTS.md`, `brain/README.md`, `brain/CURRENT-STATE.md`, `brain/PROJECT-BRIEF.md`, and `brain/DECISIONS.md`, then read the task-relevant requirements. If files disagree, do not guess: report the conflict and reconcile it in the brain documents before implementation.
16. The supplied video is a visual/interaction reference only. Recreate the relevant virtual-showroom principles for SBG; do not copy the reference store name, text, code, assets, or exact layout.
17. The supplied jersey mockups are approved project inputs for display, but their exact composition/brand art must not be distorted, recoloured, or regenerated. Use the best-matching front/back image in product galleries. Do not invent SKUs, prices, sizes, stock, fabric details, claims, licences, or product facts.
18. Real payment gateway integration is deferred until the main storefront/admin workflows are working and the owner supplies the selected gateway details. Until then, use only a clearly marked non-production checkout/test adapter; never simulate a successful real payment or present a test order as a real paid order. Production checkout is a launch blocker until real gateway integration and reconciliation are implemented and verified.
19. The AI agent must update `brain/CURRENT-STATE.md`, `brain/CHANGELOG.md`, relevant specs, and any ADR after every approved phase or material decision.
20. Each major phase must state: **TOOL, MODEL, TASK, WHY, IMPORTANCE, COST, INPUT REQUIRED, EXPECTED OUTPUT, NEXT STEP**.

---

# 1. Product Summary

SBG SHOP is the official SBG-branded online store for selling physical branded merchandise—starting with jerseys and apparel—and selected digital products. It must deliver a trustworthy, mobile-first shopping experience and a separate secure admin workflow for managing products, inventory, orders, fulfilment, digital entitlements, promotions, content, and customer support.

The website should feel like a professionally designed SBG product, not a generic storefront template. Brand artwork and existing SBG logo geometry must be preserved unless the owner specifically authorizes a change. Use the SBG brand palette (gold, deep purple, black, and white) as a starting reference, while deriving final tokens from the actual assets and design review.

## Product vision

Make official SBG merchandise easy to discover, understand, purchase, track, and support on mobile devices, while giving the owner reliable control over inventory, order state, digital delivery, content, and store operations.

## Business assumptions to validate

- **A1 — Store model:** Launch is assumed to be SBG selling its own products (direct-to-consumer), not a multi-vendor marketplace. If third-party sellers will list products, the architecture, seller workflows, GST analysis, payouts, and legal documents must be reconsidered.
- **A2 — Fulfilment:** Physical products are fulfilled by SBG or a fulfilment partner selected by SBG. Exact courier/shipping integration is not selected yet.
- **A3 — Digital goods:** Digital products are delivered through authenticated order entitlements and controlled downloads/access. Exact formats, licensing, and permitted use remain to be defined.
- **A4 — Market:** India is the first launch market. International sales are out of scope until tax, shipping, payment, and legal scope are reviewed.
- **A5 — Payments:** Real payment gateway integration is intentionally postponed until the main website and admin workflows are built and reviewed. The owner will provide/choose the gateway later. Until then, design a provider interface and a non-production test/mock adapter with unmistakable “TEST ONLY / NO REAL PAYMENT” labelling. Never build a custom payment processor, never accept real funds, and never mark an order paid based on a fake/client-side success. Before production launch, compare eligible providers (Razorpay/Cashfree may be candidates), validate merchant onboarding, current official docs, accepted methods, fees, refund behaviour, webhooks, reconciliation, settlement and legal/compliance obligations.
- **A6 — Guest checkout:** Guest checkout is a recommended option to reduce friction and unnecessary account data. The owner can choose whether accounts are required for digital entitlements, order history, or loyalty features.
- **A7 — PWA:** The primary app package is a PWA. A native Android APK is not included unless separately approved.
- **A8 — Build method:** Google AI Studio is the primary development environment, but the framework and architecture must be validated against its current supported scaffold, export/GitHub workflow, runtime and deployment model.

Record assumptions that are later confirmed, changed, or rejected in an Assumptions/Decisions log.

---

# 2. Goals and Non-Goals

## Goals

1. Present SBG products with strong imagery, clear product facts, variant selection, pricing, stock status, sizing, delivery and returns information.
2. Make mobile discovery and checkout straightforward and accessible.
3. Keep product, price, inventory, discount, tax/shipping calculation and order state authoritative on the server.
4. Prevent overselling, duplicate orders, duplicate payment processing, and unsafe digital downloads.
5. Provide a protected Admin Panel with granular permissions and audit history.
6. Support both physical fulfilment and digital fulfilment without mixing their business rules.
7. Provide an installable PWA with safe caching and a clear offline state.
8. Provide correct SEO and indexability for public product/content pages.
9. Match legal pages and consent controls to actual code, data practices, vendors, and current applicable law.
10. Be maintainable, testable, observable, and recoverable—not merely visually impressive.

## Non-goals for the initial release unless later approved

- Multi-vendor marketplace/seller onboarding and seller payouts.
- Native Android/iOS applications.
- Cryptocurrency, token/coin wallet, or speculative financial features.
- Subscriptions or recurring billing.
- Advanced loyalty/points system.
- AI shopping assistant.
- Unnecessary 3D product viewer or WebGL landing page.
- Multi-country tax, shipping, and localization.
- Complex warehouse/ERP integration before the operating model is known.

---

# 3. User Groups and Permissions

## Storefront roles

- **Guest shopper:** browse/search products, manage a temporary cart, checkout with required details, view public policies.
- **Registered customer (if enabled):** manage profile/addresses, order history, return/refund requests, digital entitlements, privacy requests, notification preferences.
- **Support operator:** view only the customer/order information needed to resolve assigned support cases; no unrestricted access to credentials or payment secrets.

## Admin roles

Use least privilege. Do not rely on hidden frontend buttons as authorization.

- **Super Admin/Owner:** manage staff roles, global settings, products, inventory, orders, promotions, content, legal versions, reports, and integrations.
- **Store Manager:** products, variants, stock, orders, fulfilment, returns, and promotions within granted scope.
- **Catalog Manager:** product copy, images, categories, variant metadata and SEO, but no payment credentials or staff access control unless separately granted.
- **Fulfilment Operator:** packing, shipment, tracking and fulfilment states; limited customer/order information.
- **Support Agent:** customer queries and permitted order support operations; refund execution should be a separately granted capability.
- **Finance/Refund Operator:** payment reconciliation, refunds and reports; no access to unrelated customer data.
- **Content Editor:** homepage banners, pages, FAQs and non-financial CMS content.
- **Analyst (read-only):** approved aggregate reports, avoiding unnecessary personal data.

Create an RBAC/permission matrix covering read, create, update, delete, publish, export, refund, discount, stock adjustment, user management, permission management, and integration settings. Log sensitive admin actions.

---

# 4. Product Scope and Feature Requirements

## 4.1 Storefront and discovery

- Responsive homepage with curated SBG campaigns, featured products, categories, new releases, and clear CTAs.
- Category/collection pages.
- Search with useful empty, no-result, loading, and error states.
- Filtering/sorting appropriate to each category (e.g., apparel size, type, price, availability).
- Product pages with unique title, clear name, full description, price, available variants, stock/availability, media, sizing/specifications, delivery/returns summary, and appropriate related products.
- Public About, Contact, FAQs, shipping/delivery, returns/refunds, privacy and terms pages as applicable.
- Breadcrumb navigation where useful.
- Accessible navigation, forms, focus states, labels, keyboard operation, contrast, and non-colour-only status indicators.
- Authentic reviews only; do not fabricate customer testimonials, ratings, order counts, or popularity claims.

## 4.2 Physical products: jerseys, apparel, merchandise

- Product variants such as size, colour, fit, design, and SKU where applicable.
- Explicit variant-level stock and inventory adjustments.
- Size chart and measurement guidance; apparel care guidance where available.
- Product images with descriptive alt text; use actual authorized SBG product photos when supplied.
- Product weight/dimensions and shipping restrictions when needed by fulfilment.
- Availability and delivery estimates should be grounded in serviceability/shipping data, never fabricated.
- Order items must snapshot product name, SKU/variant, price, discounts, and tax attributes at purchase time so later catalog changes do not alter historical orders.
- Inventory changes must be transactional or otherwise protected against concurrent purchases and overselling.

## 4.3 Digital products

Digital products may be files, downloadable assets, digital designs, wallpapers, templates, or other owner-approved goods; actual product types must be decided before the digital catalogue is finalized.

- Define file/type, description, licence/use conditions, version, delivery method, and support contact per item.
- Grant access only after the payment/order is authoritatively confirmed.
- Store downloadable assets in private object storage where possible; issue short-lived, scoped links after server-side entitlement checks.
- Apply download/access limits only when they serve a defined policy; communicate limits clearly.
- Record fulfilment/access events without logging tokens or sensitive URLs.
- Define how refunds, chargebacks, access revocation, file updates, and lost-download requests work.
- Do not promise copyright ownership or unrestricted commercial use unless SBG has the rights to grant it.
- Legal counsel should review digital-product licence and refund wording against actual products and applicable law.

## 4.4 Cart and checkout

- Add/update/remove cart items; validate variant availability and quantity.
- Server recalculates prices, discounts, shipping, tax and payable total. Never trust client totals.
- Revalidate inventory, price and coupon eligibility immediately before order/payment initiation.
- Use idempotency or equivalent duplicate-request protection for order/payment creation.
- Clear, accessible shipping/contact forms with server-side validation.
- Show item subtotal, discounts, shipping, tax/charges and final total before payment.
- Show applicable delivery and cancellation/return terms before order confirmation.
- Support payment success, failure, pending, cancelled, timeout and reconciliation states.
- Never consider a browser redirect or client-side “success” message sufficient proof of payment.
- Handle webhook signature validation, duplicate webhook delivery, event ordering and reconciliation.
- Do not store raw card numbers, CVVs, UPI PINs or payment credentials.
- Guest checkout and registered checkout are to be compared in the UX/FRD stage.
- Cash on Delivery (COD) is a decision item, not assumed. If selected, define fraud, cancellation, return-to-origin and fulfilment controls.

## 4.5 Orders, shipping and returns

- Customer order confirmation and a reference/order number.
- Order history/detail and tracking where supported.
- Explicit order state model, for example: `draft → pending_payment → paid → processing → packed → shipped → delivered`, with branches for `payment_failed`, `cancelled`, `return_requested`, `returned`, `refund_pending`, `refunded`, `partially_refunded`, `fulfilment_failed`.
- Actual transitions and permissions must be documented in the state/business logic specification.
- Admin order queue, search/filter, detail view, fulfilment actions and event timeline.
- Return/cancellation eligibility rules should be product-aware (physical versus digital) and reviewed legally.
- Refunds must be tied to a real order/payment, use provider APIs, be idempotent, record status, and reconcile against provider events.
- Shipping aggregator/courier choice is deferred until parcel sizes, expected volume, serviceability, pickup, COD need, rates and tracking requirements are known.

## 4.6 Customer account (scope to validate)

- Optional account creation/login, account recovery, session expiry, device/session management as appropriate.
- Address book only if useful; don't collect unnecessary fields.
- Profile editing and account deletion/privacy-request route where applicable.
- Order lookup should use secure authorization or one-time verification; do not allow guessed order IDs to expose other customers' orders.

## 4.7 Discounts and promotions

- Coupon/discount rules, active window, eligible products/categories, usage limits, per-customer limits, minimum basket, exclusions and stacking behaviour.
- Price changes and discount claims must be truthful and auditable.
- Avoid fabricated “was” prices, false scarcity, fake countdowns, hidden charges, preselected unwanted add-ons, or deceptive UI.
- Where required by current e-commerce rules, retain the evidence needed to support advertised previous prices and discount calculations.

## 4.8 Admin Panel / CMS

- Dashboard with truthful operational metrics (orders, gross sales, refunds, stock alerts, best-selling products) derived from actual stored data.
- Product, category, variant/SKU, pricing, images, inventory and publishing management.
- Order, payment-status, shipment, return and refund management.
- Digital-product file/entitlement management.
- Coupon and campaign management.
- Homepage sections, banners, About, FAQ, Contact, policies, SEO metadata and social preview management.
- Customer support/contact submissions and privacy requests.
- Staff accounts and granular RBAC.
- Audit log for stock adjustments, price/discount edits, refunds, permission changes, policy publication and sensitive configuration changes.
- Export only for authorized roles; restrict personal data in exports and log sensitive exports.
- No fake dashboard data or demo records in production. If seeded test data is used in development, use explicitly marked fixtures and remove them from production.

## 4.9 PWA requirements

- Valid web app manifest, icons, name, theme/background colours and standalone display mode where appropriate.
- HTTPS in production and appropriate service-worker configuration.
- Installability tested on target browsers/devices.
- Cache static assets and safe public content where appropriate; implement a clear offline fallback page/state.
- Do not cache private account/order/admin data in a shared or persistent public cache.
- Do not imply checkout, payment, inventory availability or order status can be trusted while offline. Online connectivity is required to confirm transactional operations.
- Push notifications are optional and require browser support, permission and a clear user value; do not request permission immediately on first load without context.
- Update behaviour must avoid leaving users on a stale checkout/app version during critical transactions.
- PWA is not the same as a native Android APK. A native app is outside this v1.0 scope unless approved separately.

---

# 5. User Journeys

## Journey A — Discover and purchase physical merchandise

Landing page → category/search → product detail → select size/variant → check stock and delivery information → cart → checkout → review itemized total and policy summaries → payment → server-confirmed order → confirmation → fulfilment/tracking → delivery → support/return flow if eligible.

## Journey B — Purchase digital product

Discover digital item → read file format/licence and use terms → add to cart → checkout/payment → server verifies captured/successful payment → order entitlement created → protected download/access page → controlled download/access → support/re-download/refund handling under defined policy.

## Journey C — Admin adds apparel SKU

Admin login → permission checked → create/edit product → define variants and SKU → upload authorized images → set stock and price → set sizing/delivery metadata → preview → publish → verify product page and inventory behaviour.

## Journey D — Handle refund

Authorized staff opens order → checks eligibility and reason → validates refundable amount against captured payment and prior refunds → records decision → invokes gateway refund securely → stores pending/result state → confirms via provider response/webhook/reconciliation → customer notified → audit entry.

## Journey E — Privacy request

Customer submits request through verified channel → identify relevant systems and data → authenticate request appropriately → apply validated export/deletion/correction process subject to lawful retention duties → record completion/exceptions → communicate result. The workflow must match applicable law and actual systems.

---

# 6. Required Pre-Development Documents

Minimum document baseline:

1. `docs/PRD.md` — product goals, scope, users, features, non-goals, success measures.
2. `docs/FRD.md` — feature-by-feature input, rules, permissions, states, errors and acceptance criteria.
3. `docs/NFR.md` — performance, security, reliability, accessibility, device/browser support, scale and operational needs.
4. `docs/USER-FLOWS.md` and `docs/IA-SITEMAP.md` — user journeys, page hierarchy and route/URL map.
5. `docs/UI-UX-SPEC.md` and `docs/DESIGN-SYSTEM.md` — layouts, tokens, components, breakpoints, states, interaction rules and design references.
6. `docs/TRD.md` — technical requirements and candidate stack.
7. `docs/SYSTEM-ARCHITECTURE.md` — boundaries, services, trust boundaries, data movement, hosting and integrations.
8. `docs/DATABASE-ERD.md` — entities, relationships, keys, constraints, indexes, inventory and order consistency.
9. `docs/API-SPEC.md` — endpoint contracts, auth, validation, errors, rate limits and webhooks.
10. `docs/RBAC-MATRIX.md` — customer/admin/staff permissions.
11. `docs/BUSINESS-LOGIC-AND-STATES.md` — stock, price, discount, payment, order, return, refund and digital entitlement transitions.
12. `docs/THREAT-MODEL.md` and `docs/SECURITY-REQUIREMENTS.md` — assets, actors, trust boundaries, abuse cases and mitigations.
13. `docs/DATA-FLOW-AND-PRIVACY.md` — data inventory, purpose, recipients, retention, deletion and processors.
14. `docs/LEGAL-REQUIREMENTS.md` — applicable-law research and required legal page/control matrix.
15. `docs/SEO-SPEC.md` — titles, canonical, indexability, product schema eligibility, sitemap, robots, OG, analytics.
16. `docs/PERFORMANCE-BUDGET.md` — images, JS, page performance, data, PWA and third-party scripts.
17. `docs/TEST-PLAN.md` — unit, integration, E2E, security, accessibility, performance, responsive and load tests.
18. `docs/DEPLOYMENT-OPERATIONS.md` — environments, secrets, CI/CD, migrations, rollback, backup/restore, monitoring and incident handling.
19. `AGENTS.md` — project-wide AI coding rules and stage gates.
20. `DEFINITION-OF-DONE.md` — criteria a feature must pass before it is marked complete.
21. `docs/decisions/ADR-001-*.md` — record material architecture/tool/payment/storage decisions and alternatives.
22. `docs/ASSET-IP-REGISTER.md` — source, owner, licence, attribution, commercial use and verification date for assets.

Do not generate all documents as empty paperwork. Fill the documents that apply; merge small documents when that improves maintainability. The coding agent must read the relevant documents before implementing a feature.

---

# 7. Provisional Technology Candidates (Not Yet Locked)

Technology selection must be validated in the architecture phase. This table is a hypothesis, not a decision record.

| Layer | Candidate to evaluate first | Alternatives to compare | Validation required |
|---|---|---|---|
| Development environment | Google AI Studio Build mode | Local IDE + coding agent, if needed for CI/debugging | Confirm scaffold, source access, runtime, dependency support, GitHub/export workflow and ability to maintain the chosen framework. |
| Web framework | TypeScript React; evaluate Next.js if supported and justified | React + Node runtime scaffold, Vite + API, other suitable framework | SEO/rendering needs, AI Studio compatibility, routes, runtime, deployment and maintainability. |
| Styling/components | Tailwind CSS + a customized shadcn/ui base | Another single primary design system | Accessibility, customization, consistency, package maintenance, licence. Do not mix competing kits by default. |
| Server/business logic | Node.js server/API | Framework-native server routes or a separate service | Payment webhooks, transactions, secrets, auth, deployment constraints and tests. |
| Database | PostgreSQL | Managed PostgreSQL provider; another database only if justified | Transactions, relational catalog/orders, inventory consistency, backups, access model, cost and operations. |
| ORM/data access | Prisma or Drizzle, or parameterized SQL | Other maintained approach | Migration needs, query control, types, existing scaffold and team/agent reliability. Choose one, not multiple ORMs by default. |
| Authentication | Managed auth provider or carefully implemented server-side auth | Supabase Auth or another compatible provider | Guest checkout, account recovery, session security, MFA for admins, rate limits, vendor cost and privacy. |
| Image/file storage | Private object storage + image CDN/transform pipeline | Compatible managed storage | Private digital downloads, signed URLs, lifecycle, egress cost, upload validation and regional needs. |
| Payment gateway | Evaluate Razorpay and Cashfree | Other eligible gateway or hosted payment solution | Merchant onboarding, accepted payment methods, actual fees, refunds, webhooks, reconciliation, settlement, chargebacks and terms. |
| Shipping | Start with defined manual workflow or select an aggregator after requirements | Courier APIs/aggregators | Parcel profiles, pickup, serviceability, rates, COD, labels, tracking, return pickups and support. |
| Email | Transactional email provider | Provider-specific email service | Deliverability, domain verification, templates, bounce/complaint handling, price and data processing. |
| Analytics | Google Analytics/other privacy-appropriate analytics + Search Console | Privacy-oriented analytics option | Consent and applicable law, conversion needs, data minimization and reporting. |
| Error monitoring | Sentry or equivalent | Hosted logging/monitoring | Data scrubbing, alerts, performance overhead, retention and plan cost. |
| Tests | Vitest + Playwright | Framework-native tests and other E2E runners | Actual scaffold, testability, CI support and browser coverage. |
| Hosting | Suitable managed Node/web host; evaluate Cloud Run if AI Studio deployment fits | Vercel, Cloudflare or another compatible service | Framework/runtime support, region, database networking, build process, billing, rollback, logs and vendor lock-in. |
| PWA | Web manifest + service worker; use a maintained library only if helpful | Framework-native setup | Installability, offline fallback, update behaviour, private cache protection, browser support. |

### Technology rules

- Do not accept Firebase just because Google AI Studio suggests/provisions it. Firebase remains an option only if the documented requirements and trade-offs justify it.
- Use hosted checkout where suitable to reduce exposure to sensitive payment data. Confirm the selected gateway's current integration and compliance scope; never store raw payment credentials.
- Product/order/inventory operations must use server-side transactions or equivalent reliable consistency controls.
- The final stack selection must be recorded in an ADR with evidence and alternatives.

---

# 8. Database Model — Initial Entity Candidates

These are entity candidates for ERD review, not a final schema.

- `users` / `customer_profiles` (only if accounts are enabled)
- `addresses` (minimize retained address data and secure access)
- `categories`, `collections`, `products`, `product_media`
- `product_variants`, `skus`, `inventory_items`, `inventory_movements`
- `carts`, `cart_items`
- `orders`, `order_items`, `order_addresses_snapshot`
- `payments`, `payment_events`, `refunds`, `webhook_events`
- `shipments`, `shipment_events`, `returns`, `return_items`
- `digital_assets`, `digital_licences`, `digital_entitlements`, `download_events`
- `coupons`, `discount_rules`, `promotion_events`
- `content_pages`, `banners`, `faqs`, `navigation_items`
- `reviews` (only verified/eligible and moderated; no fabricated reviews)
- `contact_requests`, `support_cases`, `privacy_requests`
- `admin_users` or unified users with role assignments, `roles`, `permissions`, `role_permissions`
- `audit_logs`, `notification_jobs`, `idempotency_records`

Required data design controls:

- Use immutable order-item snapshots for historical facts.
- Use integer minor currency units (paise) or another clearly documented exact monetary representation; never use floating-point arithmetic for payable amounts.
- Store currency explicitly (initially INR).
- Use foreign keys, uniqueness constraints, indexes, transaction boundaries and explicit statuses.
- Make payment webhook processing idempotent and retain a minimal event/reconciliation record.
- Avoid logging secret values, access tokens, signed download URLs or unnecessary personal data.
- Inventory reservations/adjustments must be race-safe and auditable.
- Separate test fixtures from production records.

---

# 9. Security & Privacy Baseline

Threat model the actual data and workflows. At minimum evaluate:

- Admin account takeover and privilege escalation.
- Unauthorized product/price/stock changes.
- Access to another customer's order, address, return, invoice, or digital file (IDOR/BOLA).
- Coupon abuse, price manipulation, negative/invalid quantities and race conditions.
- Fake payment confirmations, forged webhooks, duplicate webhook delivery, replay and amount mismatch.
- Duplicate checkout/order/payment/refund operations.
- Inventory overselling under concurrent requests.
- SQL/NoSQL injection, XSS, CSRF where applicable, SSRF where network fetches exist, insecure CORS and unsafe redirects.
- Brute-force login/OTP/reset abuse, enumeration and session theft.
- Malicious uploads, oversized files, MIME mismatch, unsafe SVG/HTML and private file exposure.
- Secrets in frontend bundles, source maps, Git history, CI logs, error logs or build artifacts.
- Over-privileged service keys and weak database/storage policies.
- Excessive data retention, unneeded SDK collection, broken deletion and consent flows.
- Third-party outage, webhook delay, email failure, storage failure and database failure.

Controls must include appropriate server-side authorization, least privilege, secure session/cookie configuration, input validation, output encoding, rate limiting, upload constraints, security headers/CSP where compatible, secrets management, dependency/secret scanning, audit logs, safe errors, backup/restore and manual permission testing.

Payment controls must include server-computed amounts, verified gateway events, signature verification per provider documentation, idempotency, webhook replay/duplicate handling and periodic reconciliation. A client-side redirect is not proof of payment.

Security tools may include Semgrep, secret scanning, Dependabot, Trivy if containers are used, OWASP ZAP, and manual authorized testing. Scanners do not prove the app is secure. Test only systems SBG owns or is authorized to test.

---

# 10. Legal, Commerce & IP Requirements

Legal content must be original, product-specific, consistent with actual code/data flows, and reviewed by qualified Indian counsel or the appropriate professional before public launch. Do not copy legal terms from another website or promise immunity from lawsuits/fines.

## Potential document/page matrix

Mark each as Required / Recommended / Optional / Not Applicable after legal scope review:

- Privacy Policy / Privacy Notice.
- Terms of Sale / Terms & Conditions.
- Shipping, delivery and lost/damaged package policy.
- Returns, exchange, cancellation and refund policy for physical goods.
- Separate digital-product licence/access/delivery/refund terms where relevant.
- Cookie/analytics notice and consent controls where applicable.
- Contact details and grievance/complaint process, including applicable grievance-officer requirements.
- Payment, billing, invoice and tax information.
- Product size chart, specifications, material, care, warranty and other material disclosures where applicable.
- Acceptable-use/community policy only if such features exist.
- Copyright/IP and takedown/contact process as appropriate.
- Email marketing preference/unsubscribe handling where relevant.
- Data access/correction/deletion request process where applicable.
- Accessibility and contact support information.

## Legal data-mapping gate

Before drafting policies, record:

- Data collected and where it originates.
- Purpose and applicable legal basis/consent mechanism.
- Required versus optional fields.
- Third-party processors (payment, delivery, email, analytics, hosting, storage, support).
- Storage region and relevant transfers.
- Retention/deletion rules and legal recordkeeping exceptions.
- Customer rights/request channel.
- Cookie/analytics behaviour and any consent gating.
- Data breach/security incident process.
- Business identity, contact, grievance and jurisdiction details.
- How physical and digital products differ in refunds, access, licensing and fulfilment.

## India legal research watchlist — verify applicability and current text

- Consumer Protection Act, 2019 and Consumer Protection (E-Commerce) Rules, 2020, as amended.
- Digital Personal Data Protection Act, 2023 and Digital Personal Data Protection Rules, 2025, including staged commencement dates.
- Information Technology Act, 2000 and applicable rules where relevant.
- Copyright Act, 1957, trademarks and rights in SBG logos, jersey artwork, team/player likenesses, music, images, and any third-party assets.
- GST registration, HSN/SAC classification, applicable rates, invoicing, place-of-supply and returns, especially for the different classes of physical and digital supplies.
- Payment-provider contract/merchant requirements and applicable RBI/payment rules.
- Consumer-facing claims, pricing/discount displays, grievance, returns/refunds, and deceptive/dark-pattern restrictions.

**Current legal watch:** As of 24 October 2026, the Department of Consumer Affairs has announced the Consumer Protection (E-Commerce) (Amendment) Rules, 2026, with a stated effective date of **1 January 2027**. The official announcement describes changes relating to consumer grievances, search-result integrity, sponsored-listing disclosures, price-reduction reference prices, dark-pattern audits, disclosures, and other areas. Launch planning must review the final legal text and effective obligations against SBG SHOP's actual operating model. [Official PIB announcement](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308759&lang=2&reg=48)

The official DPDP Rules 2025 notification sets different commencement timelines for different rules; verify which requirements are in force at launch, rather than assuming all provisions commence together. [Official MeitY Gazette notification](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf)

CBIC's official FAQ specifically distinguishes an operator's own-product sales from collecting TCS on supplies by other suppliers, and states that own-product supplies remain subject to applicable GST. Registration, classification and invoicing must be confirmed for SBG's actual entity and products with a qualified CA. [Official CBIC e-commerce GST FAQ](https://cbic-gst.gov.in/hindi/sectoral-faq.html)

## Intellectual property / asset register

For every image, font, icon, video, illustration, mockup, logo variant, product photo, 3D model and music/audio asset, record: asset name, source, owner, licence, commercial-use rights, attribution requirements, modification permissions, evidence/URL and verification date. Ensure SBG has authority to use the eagle logo, jersey artwork, player names/likenesses and sponsored/third-party marks as used in the store.

---

# 11. SEO, AEO and Discoverability

SEO is important for an e-commerce storefront, but must not overshadow operations, security, or product logic.

- Unique title and useful meta description on each indexable category/product/content page.
- Correct heading structure and one clear primary H1 per page where appropriate.
- Descriptive product/category slugs.
- Canonical URLs, including well-defined treatment for variants, sorting, filtering, query parameters and duplicate pages.
- Valid `sitemap.xml` containing only intended indexable URLs; `robots.txt` must not be used as a substitute for `noindex` or access control.
- Metadata and Open Graph/social preview images.
- Product structured data only when the actual page/content meets the relevant schema rules; validate structured data and merchant listing eligibility before relying on it.
- Image alt text that accurately describes meaningful product imagery; decorative images use suitable empty alt text.
- Internal links, breadcrumbs, descriptive anchor text and useful related-product links.
- Google Search Console and analytics after production-domain verification.
- Do not index admin, checkout, account, private order, cart, or sensitive search pages.
- Search/filter UX must not create uncontrolled crawl traps.
- Use original and useful product copy, clear sizing/material/delivery/return information, authentic reviews only, and accurate brand/business details.
- AEO/GEO/LLMO concepts may be evaluated as content/discoverability practices, but never claim guaranteed ranking or present them as official ranking factors without current authoritative evidence.

---

# 12. Design Direction and Reference Workflow

## Brand and UX requirements

- Mobile-first layout; test low-width phones, tablet and desktop.
- Strong product photography, not generic stock imagery when real product images are available.
- Product pages must make size/variant/price/stock/shipping/returns visible and understandable.
- Checkout must minimize friction without hiding material price, delivery, consent, or policy details.
- Coherent design tokens for typography, colour, spacing, borders, radii, focus, states and breakpoints.
- Meaningful states: loading/skeleton, empty, error, unavailable, out of stock, success, offline, permission denied.
- Keyboard accessibility, visible focus, readable contrast, accessible forms and reduced-motion support.
- Preserve the SBG eagle artwork and existing logo proportions/colours unless explicitly authorized to change them.
- Avoid generic AI visual patterns: unnecessary gradients/glass, random orbs/dot grids, excessive shadows, repetitive generic cards, fake stats/reviews, pointless animated arrows/sparkles, unmotivated 3D and animation-heavy checkout.

## Selective reference sources

Use sources only when helpful for the current design decision:

- **Figma** — wireframes, prototypes, design system and handoff.
- **Mobbin / Page Flows / Refero** — real commerce/app navigation and checkout-flow references.
- **Awwwards / Godly / MotionSites** — visual direction and high-quality web examples.
- **Unsection** — specific website sections.
- **CTA Gallery** — CTA/conversion patterns.
- **60FPS / GSAP / Motion** — interaction and motion references.
- **21st.dev / shadcn/ui** — component pattern discovery and a customizable foundation.
- **Spline / Three.js / React Three Fiber** — optional 3D only if product visualisation/brand storytelling justifies performance cost.
- **Google Fonts / Fontshare** — typography research; verify licence and self-host/load strategy.
- **Unsplash / Pexels / licensed assets** — only where a genuine SBG product asset is unavailable; verify commercial licence and attribution.

Never use all sources automatically. Inspect licence, maintenance, compatibility and commercial-use rules for chosen assets/components. References are not permission to copy.

---

# 13. Performance, PWA and Reliability Targets

Set exact budgets after baseline prototype and target-device analysis. Initial proposed quality gates (to be confirmed in NFR):

- Target “Good” Core Web Vitals at the 75th percentile for LCP, INP and CLS, measured with field data when available.
- Establish route-level budgets for JavaScript, product image dimensions, fonts and third-party scripts.
- Use responsive/modern image formats where supported; defer non-critical images and heavy UI.
- Avoid putting non-essential third-party scripts in the checkout path.
- Establish API latency/error budgets from observed baseline and hosting architecture; do not assert made-up benchmarks as measured facts.
- Configure timeouts and safe failure states for payment, shipping, email and storage APIs.
- Establish spend alerts/quotas for paid services, billing alerts, uptime checks, application error monitoring and database/storage usage alerts.
- Define automated backups and perform restore tests, not just backup creation.
- Test concurrent checkouts, inventory contention, duplicate webhooks, retries and payment-provider interruptions.
- Cache public product/catalog assets carefully; never serve private customer/admin data from a shared cache.
- PWA offline mode may display cached public product content and an offline page. Checkout, inventory validation, payment, refunds and order-state changes require online server confirmation.

---

# 14. Testing and Quality Gates

## Per feature

- Unit tests for business rules where appropriate.
- Integration tests for API/database/payment/storage boundaries.
- E2E tests for customer purchase and key admin flows.
- Verify TypeScript, lint, build and migration checks.
- Test invalid input, unauthorized access, boundary values, concurrent requests, retries, timeout and provider failure.
- Review browser console and network errors.
- Test responsive layouts, keyboard access, labels, focus and contrast.
- Verify no secret leakage in frontend bundles, source maps, logs or repository history.

## Critical end-to-end scenarios

1. Browse product → select valid variant → checkout → provider payment → verified webhook → exactly one paid order.
2. Concurrent purchases for the last item → no overselling or inconsistent stock.
3. Duplicate checkout clicks/retries → no duplicate charge/order.
4. Payment fails or remains pending → accurate order state; no digital entitlement prematurely granted.
5. Duplicate/out-of-order payment webhooks → idempotent final state and reconciliation record.
6. Refund/partial refund → amount limits enforced; state and customer notice consistent.
7. Unauthorized customer tries to access another order, address, invoice or digital file → denied.
8. Digital purchase → valid entitlement and scoped download; expired/revoked entitlement denied.
9. Admin roles attempt prohibited actions → server-side denial and audit record where appropriate.
10. Product price/stock changes during checkout → server revalidation and transparent customer handling.
11. Offline PWA opens → public cached page/offline state only; checkout doesn't falsely succeed.
12. Restore a backup into a test environment and verify database consistency.
13. Form spam/abuse, login brute force and upload limits are enforced.
14. Verify actual checkout totals, return/refund policy presentation, shipping fees and required consents.

## Definition of Done

A feature is not complete until implementation, tests, authorization, failure states, responsive/accessibility checks, security checks, relevant docs, and actual verification are done. Record what was tested and any known limitation.

---

# 15. Production Reality Audit

Before launch, examine the non-UI system:

- Database transactions, query plans, indexes, pagination and connection limits.
- Inventory consistency and operational stock adjustments.
- Idempotency and reconciliation for payments, webhooks, orders and refunds.
- API rate limiting, abuse protection, validation and timeouts.
- Image processing, upload limits, private storage, CDN/cache behaviour and signed download access.
- Queue/background job handling and retry/dead-letter behaviour if queues are used.
- Secret storage/rotation, role restrictions and least privilege.
- Admin protection, MFA options, session expiry and audit logs.
- Staging vs production, CI/CD, migration/rollback strategy, uptime monitoring and alert routing.
- Backups, restore testing, disaster recovery expectations and data retention/deletion.
- Service outages, email/payment/shipping-provider failure and customer communication.
- Concurrent users and load limits appropriate to the expected business scale.
- Cost ceilings, budget alerts and usage monitoring.
- Legal policy/code alignment and current legal effective dates.
- Incident response contacts and who may disable checkout or roll back a release.

Do not introduce Kubernetes, Kafka, RabbitMQ, Redis, microservices, sharding or other infrastructure merely because it appears on a production checklist. Add complexity only when workload, reliability or scaling needs justify it.

---

# 16. Implementation Phases and Stage Gates

## Phase 0 — Project baseline and repo/environment check

**Deliverable:** confirm project constraints, available AI Studio scaffold, GitHub/export path, deployment expectations, existing assets and project assumptions. No product implementation yet.

**Gate:** owner reviews scope and assumptions.

## Phase 1 — Research

Research current official docs for the shortlisted framework/runtime, database/auth, payment gateway, storage, PWA, SEO, testing and security. Inspect relevant commerce UX references. Verify licensing, costs, availability and architecture constraints.

**Deliverable:** `docs/RESEARCH-AND-OPTIONS.md` with source links, findings, decision implications, risks and alternatives.

**Gate:** research findings reviewed; no unverified source treated as fact.

## Phase 2 — PRD

Complete goals, target users, MVP/non-goals, product categories, journeys, business assumptions and success measures.

**Deliverable:** `docs/PRD.md`.

**Gate:** product scope approved.

## Phase 3 — FRD/NFR

Specify each feature's actor, preconditions, input, logic, output, permissions, validation, errors, edge cases and acceptance criteria. Define performance/security/reliability/accessibility/mobile/browser budgets.

**Deliverables:** `docs/FRD.md`, `docs/NFR.md`.

**Gate:** functional behaviour and measurable quality requirements reviewed.

## Phase 4 — UX/IA/Figma

Create information architecture, sitemap, user flows, wireframes, responsive screen designs, design tokens, component inventory, loading/empty/error/success states and mobile checkout flow.

**Deliverables:** `docs/USER-FLOWS.md`, `docs/IA-SITEMAP.md`, `docs/UI-UX-SPEC.md`, Figma file/design artifacts.

**Gate:** UI flow and design direction approved.

## Phase 5 — Architecture, database, integrations

Compare 2–4 real stack options and document the winner. Finalize system boundaries, database/ERD, API contracts, RBAC, payment/webhook handling, storage, inventory consistency, shipping integration and digital entitlements.

**Deliverables:** TRD, system architecture, ERD, API spec, RBAC matrix, business/state model, ADRs.

**Gate:** chosen architecture and critical data/payment flows approved.

## Phase 6 — Security and legal design

Threat model; build data-flow inventory; select security controls; scope privacy and commerce law; define IP/asset register; prepare original policy requirements and list professional review items.

**Deliverables:** threat model, security requirements/test plan, data-flow/privacy map, legal requirements matrix, asset/IP register.

**Gate:** high-risk findings and legal blockers addressed or explicitly tracked before implementation/launch.

## Phase 7 — Design system and foundation

Create application foundation, lint/type/test setup, repository rules, environment setup, UI system and app shells. Do not add Firebase automatically.

**Deliverables:** design system, `AGENTS.md`, `DEFINITION-OF-DONE.md`, foundation smoke test.

**Gate:** build/test/preview works and project rules are checked in.

## Phase 8 — Incremental implementation

Recommended order:

1. Core schema/migrations and seed strategy (development fixtures only).
2. Server-side access layer and authorization foundation.
3. Catalog/categories/product variants and inventory.
4. Cart and server-side pricing.
5. Checkout experience using an unmistakably non-production test adapter only; no live gateway yet.
6. Define the payment-provider interface and test order/payment states, but defer real gateway integration, real webhooks and live reconciliation until the owner provides gateway details after the core website/admin workflows are working. Production checkout remains disabled until this later gate passes.
7. Customer order history/status and transactional notifications.
8. Shipping/fulfilment/returns/refunds.
9. Digital fulfilment and licence entitlements.
10. Admin/RBAC/audit logs.
11. CMS/promotions/analytics.
12. PWA/offline fallback/installability.
13. UI polish, optional motion/3D only if justified.

Each feature follows **Plan → Implement → Run → Test → Inspect → Fix → Retest → Update docs**.

## Phase 9 — Verification

Unit, integration, E2E, accessibility, responsive, dependency/secret, application security, performance, legal-policy consistency and SEO tests.

**Gate:** all critical test scenarios pass; unresolved high-risk issues are launch blockers.

## Phase 10 — Staging/UAT

Run the real flow with gateway sandbox/test events, shipping test data, product variants, refunds, digital entitlements and admin roles. Test backups and rollback.

**Gate:** owner accepts UAT evidence and launch readiness.

## Phase 11 — Production launch

Configure production secrets, domain, HTTPS, provider credentials, backups, monitoring, Search Console/analytics, legal pages, support/grievance contact, inventory and order operations. Verify production-domain crawl/indexability and run a small real transaction/refund process only under a deliberate approved launch procedure.

**Gate:** signed launch checklist with named owner and rollback/incident contacts.

## Phase 12 — Post-launch

Monitor failed payments, order conversion, abandoned carts, stock discrepancies, refunds, delivery issues, errors, Core Web Vitals, search indexing, cost and support complaints. Update policies when product/data/practices/laws change.

---

# 17. Google AI Studio Use Rules

Google AI Studio is the chosen environment, but it is not a substitute for source control, code review, tests, provider onboarding or production operations.

Before the first build prompt:

- Verify current Build mode framework/runtime output and project export/GitHub workflow.
- Confirm server-side code can safely handle secrets and payment webhooks for the selected deployment path.
- Confirm database connectivity, migrations, transactions, background jobs, file storage, PWA requirements and test automation work with the chosen scaffold.
- If a required capability is awkward or unsupported in the generated scaffold, document the limitation and compare local development or another deployment path rather than forcing a brittle workaround.
- Do not let the agent choose a backend/payment/database based only on convenience or automatic provisioning.
- Store secrets in the approved server-side secrets/environment manager; never hardcode them.
- Commit and review code in GitHub (or equivalent) and preserve an auditable history.
- Keep prompts stage-specific; do not mix research, design, database, payment integration and production deployment into one giant prompt.

Google's official documentation currently describes AI Studio Build mode as supporting a default React web frontend with a Node.js server-side runtime, secrets, npm packages, GitHub import/sync/export paths, and Cloud Run deployment. This must be rechecked at build time. The same docs describe automated Firebase setup as an available path, but **SBG SHOP must not accept Firebase automatically** unless the architecture review explicitly selects it. Sources: [Build apps in Google AI Studio](https://ai.google.dev/gemini-api/docs/aistudio-build-mode), [Full-stack apps](https://ai.google.dev/gemini-api/docs/aistudio-fullstack.md), [Deploying from AI Studio](https://ai.google.dev/gemini-api/docs/aistudio-deploying).

---

# 18. Initial Research Sources to Verify

These sources are starting points, not substitutes for reviewing current documentation when implementation begins.

- Google AI Studio Build mode: https://ai.google.dev/gemini-api/docs/aistudio-build-mode
- Google AI Studio full-stack apps: https://ai.google.dev/gemini-api/docs/aistudio-fullstack.md
- Google AI Studio deployment: https://ai.google.dev/gemini-api/docs/aistudio-deploying
- Next.js App Router: https://nextjs.org/docs/app
- Next.js metadata and OG images: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Next.js robots: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
- Next.js PWA manifest: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
- MDN Progressive Web Apps: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- MDN PWA installability: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- MDN PWA offline/background work: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation
- Razorpay: https://razorpay.com/docs/ and security checklist https://security.razorpay.com/security/checklist/
- Cashfree Payment Gateway docs: https://www.cashfree.com/docs/payments/overview
- Department of Consumer Affairs: https://consumeraffairs.nic.in/acts-and-rules/consumer-protection/consumer-protection
- PIB announcement of 2026 E-Commerce Rules amendments: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308759&lang=2&reg=48
- MeitY DPDP Rules 2025 Gazette notification: https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf
- CBIC GST sectoral FAQs: https://cbic-gst.gov.in/hindi/sectoral-faq.html
- Google Search Central: https://developers.google.com/search
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- Web Vitals: https://web.dev/articles/vitals

---

# 19. Open Decisions (Do Not Guess)

These must be resolved in research/PRD/FRD, not silently invented by the coding agent.

1. Confirm whether SBG sells only its own inventory or will host third-party sellers.
2. Exact digital product types, licence terms and fulfilment mechanism.
3. Customer accounts required, optional, or guest-first.
4. COD: enabled at launch or not.
5. Shipping/fulfilment model and preferred courier/aggregator.
6. Return/exchange windows and product exclusions, subject to legal review.
7. Payment gateway eligibility, fee, payment modes, refunds, settlement and webhook documentation.
8. Business legal name, registered/contact address, GST details (if applicable), customer support and grievance contacts.
9. Existing SBG logo/source assets, product photography, product SKUs, price list, sizes, stock quantities and rights documentation.
10. Store domain and deployment/billing ownership.
11. Expected initial traffic/order volume and budget.
12. Whether multilingual content is required at launch.
13. Whether reviews, wishlists, coupon campaigns, email marketing, push notifications or loyalty are MVP or later.
14. Which analytics/marketing SDKs are approved, and what consent/measurement model is appropriate.
15. Whether the PWA alone satisfies app needs or an APK/native app is a separate future phase.

When an answer is unavailable, record it as an open decision and proceed only where safe assumptions permit.

---

# 20. Current Task Gate

**Current phase:** Phase 1 — Research + visual-reference and asset intake  
**Tool:** Google AI Studio for the eventual implementation; official browser research and project documents for this phase  
**Model:** Choose a current strong reasoning/research-capable model available in the user's environment; verify current model choices at execution time  
**Task:** Research architecture/business options and document the virtual-showroom direction and supplied jersey assets; do not code or scaffold the application yet  
**Why:** Payment, stock, shipping, digital entitlements, legal duties, PWA and runtime decisions affect the design of the whole system  
**Importance:** Critical  
**Cost:** Research/document preparation can be low-cost; payment gateways, hosting, databases, storage, email, shipping and AI use may incur fees  
**Input required:** Supplied virtual-store reference video and SBG jersey mockups are included in `references/`; product list, sizes/SKUs, exact prices/stock, fulfilment, and business/legal identity can be filled in when known  
**Expected output:** `docs/RESEARCH-AND-OPTIONS.md` with evidence, comparisons, assumptions, legal watchlist, risks and recommendations  
**Next step:** Review research → finalize PRD → FRD/NFR → Figma → architecture/database/security; no coding before gates pass.

## Copy-Paste Prompt for Google AI Studio — SBG SHOP Research Gate (No Coding Yet)

> You are the senior product strategist, e-commerce architect, UX/UI designer, frontend/backend engineer, security engineer, QA engineer and technical researcher for **SBG SHOP — Product Blueprint v1.1 (Virtual Showroom Edition)**.
>
> **FIRST: READ THE PROJECT BRAIN.** Read `AGENTS.md`, `brain/README.md`, `brain/CURRENT-STATE.md`, `brain/PROJECT-BRIEF.md`, `brain/DECISIONS.md`, and this blueprint completely. Then inspect all assets in `references/visual/` and `references/jersey-assets/`. Do not make a change before checking the current stage, approved decisions and next allowed action in the brain folder.
>
> **CURRENT GATE: RESEARCH / REFERENCE ANALYSIS ONLY. Do not generate application code, UI components, project scaffolding, database migrations, install dependencies, provision Firebase, connect a live payment gateway, or deploy.** The requested deliverable is research and a documented design/product plan. Stop when it is complete and wait for the next explicit stage instruction.
>
> ## Product goal
> Build a premium, mobile-first SBG-branded e-commerce website with a secure Admin Panel and PWA for the Indian market. Products include SBG jerseys/apparel, other merchandise and digital products. This must feel like a real, intentionally art-directed brand experience—not a generic AI store template.
>
> ## Visual reference analysis
> Study the supplied approximately 24-second virtual-clothing-store video. Extract only the transferable design/interaction principles: a quiet cool-grey studio environment, a horizontal display of garments on hangers, a carefully framed central showcase, subtle camera/dolly/scale transitions, product selection/focus, understated typographic labels, restrained motion, and a premium editorial mood. Do not copy the reference brand/name, exact layout, website copy, code or assets. Adapt the experience to SBG’s black, deep purple, gold and white brand palette without letting bright purple/gold overwhelm the product showcase. The showroom should feature the actual SBG jersey mockups provided in the assets pack.
>
> ## Important product-asset constraint
> The supplied jersey files are rendered product mockups, not clean transparent garment cutouts or UV textures. Inspect them before deciding how to use them. Do not stretch, warp, re-colour, redraw the SBG eagle/wordmark, or place a full dark-background mockup into a 3D scene in a way that creates an obvious rectangular image card. Use the images as authentic product gallery assets and document the most credible method for achieving the virtual-showroom effect. If genuine 3D garment/texture assets are required, research properly licensed options and describe the asset/work needed; do not pretend the supplied 2D mockups are true rotatable 3D models. Provide a graceful image-led fallback if 3D is not justified or real assets are unavailable.
>
> ## Required output
> Create/update the following documents only: `docs/RESEARCH-AND-OPTIONS.md`, `docs/VISUAL-REFERENCE-ANALYSIS.md`, `docs/SCREEN-INVENTORY.md`, and `docs/ASSET-IP-REGISTER.md`. Also update `brain/CURRENT-STATE.md`, `brain/DECISIONS.md`, and `brain/CHANGELOG.md` to record completed research, findings, open decisions and the next allowed step. Do not edit unrelated files.
>
> Research current official documentation for Google AI Studio Build mode, web framework/runtime compatibility, database and authentication options, private asset storage, PWA, SEO, testing, monitoring, image/3D assets, and India-specific e-commerce/privacy requirements. Prefer official vendor documentation, official government sources, and primary sources. Include source URLs and access/check dates. Clearly label verified facts, recommendations, assumptions and unresolved questions.
>
> Compare 2–4 realistic options where a material technical choice exists. Validate Google AI Studio compatibility, source export/GitHub workflow, maintainability, data integrity, cost, licensing, accessibility, responsive behaviour, security and vendor lock-in. Do not automatically choose Firebase merely because AI Studio offers it. Do not invent current prices, laws, product facts or API behaviour.
>
> ## Payment constraint
> The owner will add/provide the real payment gateway later. Do not integrate or enable live payments now. Research what architectural boundary will keep later integration clean. A test/mock checkout may be used in a future build phase only when clearly labelled test-only; it must never fake a real successful payment. Production launch must be blocked until a real gateway is selected, merchant onboarding is complete, server-side verification/webhooks/idempotency/reconciliation and refund states are tested, and policies match the actual payment flow.
>
> ## Required screens to plan
> Include responsive mobile and desktop screen states for: homepage/virtual showroom; collection/category; product detail (front/back imagery, size/variant, stock, care/specs, delivery/returns); search/filter; cart; checkout shell with payment disabled/test-only; order confirmation/pending/failure; customer order tracking/account if in scope; About; Contact; FAQs; shipping/returns; legal/privacy pages; admin login; admin dashboard; product/category/variant manager; inventory; order fulfilment; digital-product manager; content/banner/SEO manager; customer/support/privacy requests; staff roles/permissions; audit logs; and PWA install/offline/update/error states. Flag which pages require owner content or business decisions.
>
> ## Research outputs
> `docs/RESEARCH-AND-OPTIONS.md` must include an executive summary, sourced findings, option matrix, costs/limits/licences where verified, provisional recommendation, rejected alternatives and reasons, security/data implications, operational risks, legal-review flags, and open questions. `docs/VISUAL-REFERENCE-ANALYSIS.md` must translate the video into an original SBG art direction and interaction storyboard. `docs/SCREEN-INVENTORY.md` must list screen purpose, key components, states, mobile behaviour, permissions and acceptance criteria. `docs/ASSET-IP-REGISTER.md` must list the supplied video and all jersey images as owner-provided reference assets and mark any external/new asset as “license verification required.”
>
> Do not produce generic buzzword recommendations. Give specific, buildable findings and explain trade-offs. Keep the architecture as simple as possible while still satisfying documented needs. No Kubernetes/microservices/queues/3D libraries just because they exist; justify them.
>
> At the end, update `brain/CURRENT-STATE.md` with: completed gate, evidence produced, blockers/open decisions, and exactly the next allowed step. Stop there.


---

# 21. v1.1 — Virtual Showroom and SBG Jersey Reference Requirements

This section is the authoritative v1.1 addendum for the user-supplied reference video and jersey mockups. It supersedes any earlier generic storefront styling language that conflicts with it.

## 21.1 Visual direction extracted from the video

The user-supplied video (about 23.6 seconds, 1366×698 capture) shows a virtual fashion showroom with a cool grey studio, a row/rack of hanging garments, camera movement between wider and closer views, product focus/selection and restrained small labels. Use these as **design principles**, not as permission to copy the source website.

Adapt for SBG SHOP as follows:

- **Hero concept:** an original “SBG Virtual Jersey Showroom” with a carefully framed horizontal lineup of SBG jersey designs, presented as a premium, fashion/editorial display instead of a default e-commerce hero with a headline plus three cards.
- **Environment:** controlled charcoal/slate studio, soft ambient light and a subtle floor/reflection only if the final design remains crisp and performant. Use SBG deep purple and gold as deliberate edge lighting/accent details, with black/white garment imagery remaining legible. Avoid gratuitous neon, excessive grain, giant gradient text, glassmorphism, sparkle effects and generic floating orbs.
- **Camera/motion:** restrained dolly/scale/selection transitions; clicking/tapping a garment brings it into focus, updates its authentic product name/variant label, and offers a clear “View jersey” action. Motion must not block browsing or checkout and must respect `prefers-reduced-motion`.
- **Product lineup:** include at least the supplied black jersey and white jersey product families, each with front and back imagery as available. Do not fabricate additional colourways.
- **Product selection:** support click/tap, keyboard navigation and visible focus. On mobile, use a responsive swipeable image-led showroom with product labels and an accessible alternative to any 3D interaction.
- **Fallback:** if real 3D garment assets/clean cutouts are not available or do not meet performance goals, deliver a high-quality image-led showroom with depth, parallax and focus transitions. Clearly document this as a 3D-inspired/image-led showroom rather than claiming that flat images are fully rotatable 3D garments.
- **Originality:** do not copy the source store’s brand, name, copy, source code, exact scene or unlicensed models. Capture the experience type, then create the SBG version.

## 21.2 Supplied SBG jersey asset use

The asset pack includes the user-supplied files: `front side jersey.png`, `front -2 side jersey.png`, `front side but logo in left.png`, `White jersey front 01.png`, `White jersey front 2.png`, `white jersey back side.png`, `backside jersey but no tagline.png`, and `back side jersey with tag line.png`. Preserve them in the reference pack; use the best matching version for product gallery after visual review. Some are alternate mockups of the same base design. Do not treat each file as a separate sellable SKU unless the owner explicitly confirms that.

### Black jersey family
- Black body with subtle dark pattern; deep purple side panels/shoulders; gold trim and sleeve cuffs; SBG eagle crest on front.
- Back mockup includes “SHADOW”, “07” and, in the tagline version, “# EVERY MOVE MATTERS”.
- Preserve lettering, numbers, crest geometry, colours and panel placements.

### White jersey family
- White patterned body, deep purple side panels/shoulders, gold trim and black/gold collar/cuff details; SBG eagle crest on front.
- Back mockup includes “SHADOW”, “07” and “#every move matters” in the provided tagline version.
- Preserve the supplied art. Do not invent other sizes, variants, fabric, manufacturing claims, availability or prices.

Product copy, price, size chart, SKU, stock, material/fabric, care instructions, delivery estimate, licensing, and return eligibility must come from the owner or verified supplier data. Record unknown values as unresolved; never invent.

## 21.3 Screen inventory required before implementation

Produce wireframes/Figma frames for key screens at least in **mobile and desktop** sizes. Also capture tablet behaviour where layout materially changes. The screen inventory must include component/state definitions, responsive rules, keyboard/focus behaviour and acceptance criteria.

1. **Home / Virtual Showroom** — showroom scene or image-led fallback, garment lineup, selected-product label, category/navigation, search, cart count, accessible product focus and clear CTA.
2. **Collection/Category** — jerseys, apparel, merchandise and digital products; filters/sort/search, no-results/loading/error/out-of-stock states.
3. **Product Detail** — front/back image gallery; variant/size selection; price/availability; size guide; specs/care; delivery and return summary; add-to-cart; accessible image alt text.
4. **Cart** — line items, variant, quantity, remove, server-revalidated price/availability, shipping/tax disclosure when known, empty/error states.
5. **Checkout Shell** — contact/shipping info, itemized total, policy links, form validation, consent where needed; visibly state that payment is not live yet. Do not show a fake real-payment success.
6. **Order States** — test-only/pending/payment-not-configured/failure/confirmation variants. Production paid confirmation exists only after a verified real gateway event.
7. **Customer Account/Orders** (scope to confirm) — sign-in/recovery, order detail/tracking, profile/privacy requests; secure access.
8. **About / Contact / FAQs** — original SBG content, accurate contact/business details, accessible forms and anti-spam controls.
9. **Shipping / Returns / Privacy / Terms / Cookie / Digital Licence pages** — only applicable pages, original product-specific text, clear version/effective date where appropriate; legal review gate.
10. **Admin Login** — protected, secure session, rate limits and meaningful errors.
11. **Admin Dashboard** — real metrics only, stock alerts, orders and operational tasks; no fake statistics.
12. **Product/Catalog Manager** — products, categories, media, product type, variant/SKU, size, prices, metadata and publication preview.
13. **Inventory Manager** — stock movements, adjustments, low-stock indicators and audit trail.
14. **Orders/Fulfilment Manager** — order state, shipment tracking, returns/refunds, event timeline and role-checked actions.
15. **Digital Product Manager** — private file reference, licence copy, versions, entitlement/access rules and download logs.
16. **CMS/SEO Manager** — homepage sections, banners, navigation, FAQ/policy content, title/meta/canonical/OG fields and sitemap/indexability controls.
17. **Staff Roles/Permissions** — least privilege and role matrix.
18. **Customer Support/Privacy Requests** — access-controlled support and verified requests with a status trail.
19. **Audit Log** — sensitive admin activity, actor, target, time, action and safe metadata; never secret values.
20. **PWA States** — install prompt/education, update available, offline fallback, online-required transaction messaging, service-worker update, error/loading/empty states.

Do not implement all screens in one giant code prompt. Use the documentation gate and screen-by-screen/feature-by-feature build plan.

## 21.4 Payment integration deferred by the owner

The initial website build should make the storefront, catalogue, product detail, cart, admin content/product management, inventory workflows, PWA shell and testable order-state model work first. A real gateway is **not to be integrated now**. Build a clean boundary/contract for a future provider and a non-production-only adapter if needed for testing.

- Display a persistent test-only label for simulated payment flows in development/admin test data.
- Mark any fake/test transaction as `test`, not `paid_live`.
- Do not use client-side state alone to mark an order paid.
- Do not send real customer payment data to a mock adapter.
- Keep live payment controls disabled by configuration until a real provider is selected and configured.
- Do not implement a custom payment processor. Treat “my own gateway later” as “the owner will provide the selected gateway/service later” unless the owner explicitly clarifies otherwise.
- Production launch/real order acceptance is blocked until the chosen provider's current official docs, merchant account, server-side signature verification, idempotency, refunds, reconciliation, testing and legal/policy requirements have been completed.

## 21.5 Mandatory project brain folder

`brain/` is the persistent source of truth for the project. Every AI environment (Google AI Studio, Cursor, OpenCode, Antigravity or another coding agent) must follow the same rules. These rules are portable; the current preferred implementation environment remains Google AI Studio unless the owner changes it.

Before any research, design, code change, dependency install, database edit, prompt change or deployment action, the agent must:

1. Read root `AGENTS.md`.
2. Read `brain/README.md`.
3. Read `brain/CURRENT-STATE.md`.
4. Read `brain/PROJECT-BRIEF.md`.
5. Read `brain/DECISIONS.md`.
6. Read the exact requirement/spec file related to the requested change.
7. Check the task against the current phase/gate and approved decisions.
8. Explain the intended change, files to touch, what must stay unchanged, and verification plan before significant implementation.
9. Make the smallest safe change, preserve existing behaviour and test it.
10. Update the brain status/changelog and relevant docs after completion.

If the brain documents conflict, the agent must stop, identify the conflict, propose a correction and wait rather than choosing its own interpretation. Never claim that a new decision is approved unless the owner or documented gate has approved it.

## 21.6 Phase gate sequence

`Research + visual reference analysis → PRD → FRD/NFR → Figma/UI/UX → system architecture → database/ERD/API/RBAC/business logic → security/threat model → UI design-system approval → incremental coding → realtime only if required → testing → production audit → deployment/monitoring`.

For SBG SHOP, “realtime” means only commerce/admin behaviours that truly need it (e.g. stock/admin refresh) and is not a requirement to add WebSockets by default.

The owner specifically requests that the website work be built before selecting/adding their real payment gateway. This modifies sequencing, not the requirement for a real provider before live payment launch.

## 21.7 Initial master-agent behaviour

Do not ask the user to re-send the video or jersey art; these are in the reference pack. Do not claim the video has been cloned or that a real 3D garment exists. Start at the current research gate. Do not write code yet. Produce the requested documentation, ask only genuinely blocking questions, mark every unknown as `OPEN DECISION`, and make no irreversible technology/payment decision without an ADR and owner review.

---

# 22. v1.1 Current Task Gate

**Current phase:** Phase 1 — Research and visual reference intake.

**Primary environment:** Google AI Studio Build mode is the preferred coding environment; it is not yet authorized to generate app code in this phase. The agent may later use Cursor/OpenCode/Antigravity only if the owner chooses them; the brain folder rules must remain tool-independent.

**Deliverables for this gate:**
- `docs/RESEARCH-AND-OPTIONS.md`
- `docs/VISUAL-REFERENCE-ANALYSIS.md`
- `docs/SCREEN-INVENTORY.md`
- `docs/ASSET-IP-REGISTER.md`
- Updated `brain/CURRENT-STATE.md`, `brain/DECISIONS.md` and `brain/CHANGELOG.md`

**Not permitted yet:** application code, UI scaffolding, migrations, Firebase provisioning, live payment integration, deployment.

**Next gate:** review research → finalize PRD → FRD/NFR → Figma/UI/UX.
