# SBG SHOP — Non-Functional Requirements (NFR)

**Phase:** 3 — NFR  
**Status:** Draft — awaiting owner review and sign-off  
**Date:** 24 October 2026  
**Preceded by:** `docs/FRD.md` (Phase 3)  
**Followed by:** Figma / UI-UX gate (Phase 4)

> **Gate rule:** This document defines measurable quality requirements. It does not approve coding. After NFR sign-off, proceed to Figma design gate.

---

## 1. Performance

### Page load targets (mobile 4G, cold load)

| Metric | Target | Measured via |
|---|---|---|
| Largest Contentful Paint (LCP) | ≤ 2.5 s | Lighthouse / CrUX |
| Cumulative Layout Shift (CLS) | ≤ 0.1 | Lighthouse |
| Interaction to Next Paint (INP) | ≤ 200 ms | Lighthouse |
| Time to First Byte (TTFB) | ≤ 600 ms | Lighthouse |
| Total page weight (home) | ≤ 400 KB (gzipped) | Build analysis |
| JS bundle (initial) | ≤ 150 KB (gzipped) | Build analysis |

### Image handling
- All product images served as WebP; JPEG fallback for older browsers.
- Images must be responsive: `srcset` for 1×, 2× at relevant breakpoints.
- Images lazy-loaded below the fold; above-fold hero image pre-loaded (`<link rel="preload">`).
- Image dimensions specified in markup to prevent layout shift.

### Caching
- Static assets (JS, CSS, fonts, images): immutable cache headers + content-hash filenames.
- API responses: no public caching for cart, checkout, account, admin endpoints.
- Product listing: short CDN cache (5 min max) acceptable; stock/price are server-checked at cart.

---

## 2. Security

### Transport
- HTTPS required on all routes and environments. HTTP → HTTPS redirect mandatory.
- HSTS header: `max-age=31536000; includeSubDomains` (after initial setup verified).

### Session
- Session token: HTTP-only, SameSite=Strict, Secure, signed.
- Session expiry: customer = 7 days rolling; admin = 8 hours or browser-close.
- CSRF protection: on all state-changing requests (SameSite=Strict cookie + CSRF token for form submissions).
- Session invalidation on sign-out (server-side; not just cookie deletion).

### Headers (all responses)
- `Content-Security-Policy`: defined at architecture gate; no `unsafe-inline` in script-src.
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: disable camera, microphone, geolocation by default.

### Rate limiting
| Endpoint | Limit |
|---|---|
| `POST /api/auth/sign-in` | 5 per IP per 15 min |
| `POST /api/auth/sign-up` | 10 per IP per hour |
| `POST /api/auth/forgot-password` | 3 per email per hour |
| `POST /api/contact` | 5 per IP per hour |
| `/admin/login` | 5 per IP per 15 min |
| All other API endpoints | 100 req/IP/min |

### Input validation
- All inputs validated server-side. Client-side validation is UX-only.
- Parameterised queries / ORM only; no string-concatenated SQL.
- File uploads: type, size, and content validation server-side.
- Output encoding: all user-supplied content escaped on render; no raw HTML injection.

### Secrets
- No secrets in: client JS bundles, URL parameters, log output, console, Git history.
- All secrets stored in server-side secret manager (provider TBD at architecture gate).
- `.env` files never committed to Git.

### Authentication and authorisation
- Every admin route: server-side session check + role check on every request.
- Every customer protected route: server-side session check.
- Principle of least privilege: staff roles cannot access owner-only settings.
- Order ownership: `order.userId === session.userId` check on every order access.

### Data exposure
- API error responses: generic messages only; no stack traces, DB errors, or field names.
- Admin: PII masked by default in order list; full visible only to owner role.
- Audit log: no passwords, card data, secrets, or full session tokens logged.

---

## 3. Accessibility

### Standard
- WCAG 2.1 Level AA minimum for all customer-facing pages.
- Admin panel: WCAG 2.1 Level AA where feasible; no accessibility blockers for primary workflows.

### Requirements
- All interactive elements keyboard-accessible (Tab, Enter, Space, Arrow keys where appropriate).
- Visible focus indicators on all interactive elements (not just `:focus`, use `:focus-visible`).
- Colour contrast: text ≥ 4.5:1 against background; large text ≥ 3:1.
- All images have meaningful alt text (or `alt=""` for decorative images).
- Form inputs have associated `<label>` elements (not placeholder-only).
- Error messages associated with fields via `aria-describedby`.
- Page `<title>` changes on route navigation (SPA behaviour).
- `<h1>` unique per page; heading hierarchy logical.
- `prefers-reduced-motion`: all showroom transitions and animations respect this setting.
- Screen reader testing: at minimum, test sign-in, product detail, and checkout flows with a screen reader before launch.

---

## 4. SEO

| Requirement | Detail |
|---|---|
| Indexable pages | Home, `/jerseys`, `/jerseys/[slug]`, About, Contact, legal pages |
| Blocked from indexing | `/admin/*`, `/cart`, `/checkout/*`, `/order/*`, `/account/*` |
| `robots.txt` | Explicitly disallow all blocked routes |
| Sitemap | Auto-generated from published products + public pages; submitted to Search Console after launch |
| Product structured data | JSON-LD `Product` schema: name, image, price, availability — real data only |
| Canonical URLs | `<link rel="canonical">` on all public pages |
| Open Graph | `og:title`, `og:description`, `og:image` on all public pages |
| Meta titles | Unique per page; ≤ 60 chars; brand suffix: "| SBG SHOP" |
| Meta descriptions | Unique per page; ≤ 155 chars |
| Image alt text | All product images have keyword-relevant, descriptive alt text |
| Core Web Vitals | Meet targets in Section 1 (LCP, CLS, INP) — Google ranking factor |

---

## 5. Availability and reliability

| Metric | Target |
|---|---|
| Uptime (post-launch) | ≥ 99.5% monthly |
| Planned maintenance window | Communicated in advance; storefront shows maintenance page |
| Error rate (5xx) | ≤ 0.1% of requests |
| Recovery time objective (RTO) | < 1 hour for critical storefront failure |
| Recovery point objective (RPO) | < 24 hours (daily backups minimum) |

### Backups
- Database: daily automated backup; minimum 7-day retention. Provider TBD at architecture gate.
- Before any schema migration or bulk data change: manual backup taken and verified.
- Restore procedure tested before launch.

---

## 6. Scalability

- Application must handle India launch traffic without architectural changes for 12 months post-launch.
- No over-engineering for unproven scale. Scale decisions made based on actual traffic data.
- Stateless application servers (session state in DB / Redis if needed — Redis only if proven necessary at architecture gate).
- DB connection pooling configured.

---

## 7. Data protection and compliance

| Regulation | Action required |
|---|---|
| DPDP Act 2023 / Rules 2025 | Privacy notice, consent management, data subject rights (access, correction, deletion), breach notification process. Verify which rules are in force at launch date. |
| Consumer Protection E-Commerce Rules 2020 | Grievance officer details on site, return/refund policy published, no unfair trade practice |
| E-Commerce Amendment Rules 2026 (eff. 1 Jan 2027) | Check applicability at launch; prior-price display rule, dark-pattern audit, NCH partnership |
| GST | Invoice with GSTIN, HSN/SAC, tax breakdown (after OD-06 resolved with CA) |
| IP / Copyright | All jersey artwork, logos, and taglines confirmed as SBG-owned or licensed before sale |

**Data minimisation:** Collect only what is needed for the transaction. Do not add analytics that aren't needed or consented to.

---

## 8. Testing requirements

### Unit tests (minimum coverage)
- Business logic: price calculation, stock decrement, order creation, return eligibility check.
- Auth: password hashing, token generation/expiry, rate-limit logic.
- Validation functions: PIN, phone, email, slug uniqueness.
- Target: 80% branch coverage for business logic modules.

### Integration tests
- Full checkout flow: add to cart → address → review → create pending order.
- Auth flows: sign-up → verify email → sign-in → sign-out → password reset.
- Admin: product create → publish → inventory adjust → order status change.
- Concurrent stock: two simultaneous last-item purchases → only one succeeds.

### End-to-end (E2E) tests (critical paths only)
- Customer: home → PDP → add to cart → checkout → order confirmation.
- Customer: sign-in → view order history → view order detail.
- Admin: sign-in → edit product → update inventory → process order.

### Lighthouse audit (before launch)
- Performance ≥ 85 mobile.
- Accessibility ≥ 90.
- SEO ≥ 95.
- Best Practices ≥ 90.
- PWA: passes installability check.

### Security checks (before launch)
- OWASP Top 10 review against the application.
- No secrets in built client bundle (`build --analyze` or equivalent).
- All admin routes return 401/403 without valid admin session.
- No PII in error responses or logs.
- CSP headers present and correct.
- Rate limits tested: verify 429 response on threshold breach.

### Accessibility check (before launch)
- Automated: Axe or equivalent — zero critical violations.
- Manual keyboard navigation: complete checkout and admin product creation flows.

### Device and browser targets
| Device | Viewport | Priority |
|---|---|---|
| Mobile (Android / iOS) | 375 px – 430 px | Primary |
| Tablet | 768 px | Secondary |
| Desktop | 1280 px – 1440 px | Secondary |

| Browser | Priority |
|---|---|
| Chrome (latest) | Required |
| Safari / iOS Safari (latest) | Required |
| Firefox (latest) | Required |
| Samsung Internet | Nice to have |

---

## 9. Monitoring (post-launch)

- Error tracking: Sentry or equivalent. Provider TBD at architecture gate.
- Uptime monitoring: external ping to storefront and API health endpoint every minute.
- Alerting: PagerDuty / email alert on error rate spike or downtime.
- No fake dashboards or placeholder monitoring in production.

---

## 10. Deployment requirements

- Zero-downtime deploys (rolling or blue-green; provider capability verified at architecture gate).
- Environment variables injected at deploy time; never hardcoded in build.
- Automated build pipeline: lint → type-check → unit tests → build → deploy (no manual "it works on my machine" deploys).
- Staging environment mandatory before production. Staging must use non-production DB and gateway test keys.
- Production deploy requires: all tests pass + Lighthouse audit pass + manual smoke test on staging.

---

## Next steps after NFR sign-off

1. **Figma / UI-UX gate (Phase 4):** Design every screen in FRD with mobile + desktop frames, all states, annotations, colour tokens, and accessibility notes. Jersey mockups and SBG brand identity applied faithfully.
2. **Architecture gate (Phase 5):** Select framework, database, auth, hosting, storage, email, monitoring — document each as an ADR.
3. **Security gate (Phase 6):** Threat model, RBAC matrix, CSP policy draft, rate-limit config, API authentication plan.
4. **Incremental coding (Phase 8):** One working slice at a time after all gates pass.
