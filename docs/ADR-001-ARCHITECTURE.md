# SBG SHOP — Architecture Decision Record (ADR)

**Phase:** 5 — Architecture  
**Status:** Approved (auto-approved with Phase 4 UI, 24 Oct 2026)  
**Date:** 24 October 2026  
**Preceded by:** Phase 4 UI design (approved)  
**Followed by:** Phase 6 — Security gate → Phase 7 — UI approval → Phase 8 — Coding

> After this ADR is finalised, Phase 6 (Security) proceeds. Coding starts at Phase 8.

---

## Decision summary table

| Concern | Decision | Rationale |
|---|---|---|
| Framework | **Next.js 14 App Router** | SSR for SEO, server actions for auth/cart/orders, file-based routing, PWA-compatible, AI Studio GitHub import works |
| Language | **TypeScript** | Type safety; fewer runtime errors; better IDE support |
| Styling | **CSS Modules + CSS custom properties** | No Tailwind bloat; full control over SBG design tokens; smaller bundle |
| Database | **PostgreSQL** (via Supabase hosted or Railway) | Relational schema fits products/variants/orders/audit; ACID transactions for inventory; no Firebase |
| ORM | **Prisma** | Type-safe queries; migrations; works with Next.js server actions |
| Auth | **Custom session auth** (iron-session or lucia-auth) | HTTP-only cookies; no Firebase Auth; CSRF-safe; rate-limit friendly |
| File storage | **Supabase Storage** or **Cloudflare R2** | Object storage for jersey images; CDN delivery; signed URLs for admin uploads |
| Payment | **Deferred** — provider interface reserved | Payment gate blocked until owner selects gateway (Razorpay / Cashfree candidate) |
| Email | **Resend** (or Nodemailer + SMTP) | Transactional email for verification and password reset; decision finalised before Slice 4 |
| Hosting | **Vercel** (Next.js-native) | Zero-config Next.js deploy; Edge Network for India latency; preview deployments for staging |
| CDN | **Vercel Edge Network** (included) | Static asset + image CDN; WebP optimisation via next/image |
| PWA | **next-pwa** or **custom service worker** | Manifest + service worker; offline fallback; app update notification |
| Monitoring | **Sentry** (free tier) | Error tracking; source maps; performance monitoring |
| Secret management | **Vercel Environment Variables** | Server-side only; never in client bundle or Git |
| Analytics | **Deferred** | No analytics until privacy consent model is decided and documented |

---

## 1. Framework — Next.js 14 App Router

**Why Next.js:**
- Server-side rendering → Google can index product pages (critical for SEO gate requirement).
- Server Actions → cart mutations, order creation, and auth happen server-side without a separate API server.
- File-based routing → clean URLs (`/jerseys/[slug]`, `/admin/*`, `/account/*`).
- `next/image` → automatic WebP conversion, responsive `srcset`, lazy loading (LCP target met).
- PWA support via manifest + custom service worker (or next-pwa).
- Google AI Studio generates React/Node projects; Next.js is the structured, SEO-ready version of that.
- GitHub import / two-way sync supported.

**App Router structure:**
```
app/
  (storefront)/
    page.tsx                 ← Home / showroom
    jerseys/
      page.tsx               ← /jerseys listing
      [slug]/
        page.tsx             ← /jerseys/[slug] PDP
    cart/page.tsx
    checkout/
      address/page.tsx
      review/page.tsx
    order/[id]/confirmation/page.tsx
    account/
      page.tsx
      orders/page.tsx
      orders/[id]/page.tsx
    sign-in/page.tsx
    sign-up/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
    about/page.tsx
    contact/page.tsx
    privacy/page.tsx
    terms/page.tsx
    returns/page.tsx
    shipping/page.tsx
  (admin)/
    admin/
      login/page.tsx
      page.tsx               ← dashboard
      products/page.tsx
      products/[id]/page.tsx
      inventory/page.tsx
      orders/page.tsx
      orders/[id]/page.tsx
      cms/page.tsx
      seo/page.tsx
      audit/page.tsx
      settings/page.tsx
  api/
    auth/[...route]/route.ts
    cart/route.ts
    orders/route.ts
    admin/[...route]/route.ts
```

**Not chosen:** Vite + React SPA (no SSR → SEO fails), Firebase Hosting (tied to Firebase), bare Node.js (too much boilerplate).

---

## 2. Database — PostgreSQL via Supabase

**Why PostgreSQL:**
- Relational schema: products → variants → inventory → orders → order_items → users → sessions → audit_log.
- ACID transactions: stock decrement + order creation in one atomic operation (concurrent last-item safety).
- Row-level locking: inventory adjustments without race conditions.
- Full-text search on orders, products.

**Why Supabase (hosted PostgreSQL):**
- Managed PostgreSQL with connection pooling (PgBouncer).
- Supabase Storage for jersey image uploads (same account, simpler billing).
- Free tier covers launch traffic; scales with paid plan.
- No Firestore; no Firebase.
- Alternative: Railway PostgreSQL (equally valid; swap if Supabase has issues).

**Schema (key tables — full migration in Prisma schema file during Slice 1):**

```
users           — id, name, email, password_hash, email_verified, created_at
sessions        — id, user_id, expires_at, created_at
admin_users     — id, email, password_hash, role (owner|staff), active
admin_sessions  — id, admin_user_id, expires_at
products        — id, slug, name, colour, description, price, compare_at_price, published, archived
variants        — id, product_id, size, sku, price_override, stock, low_stock_threshold, active
product_images  — id, product_id, url, view (front|back), alt, is_primary, sort_order
orders          — id, user_id, status, subtotal, shipping, tax, total, address_snapshot, created_at
order_items     — id, order_id, variant_id, snapshot (name/size/price), quantity, line_total
addresses       — id, user_id, name, phone, line1, line2, city, state, pin, is_default
returns         — id, order_id, reason, status, notes, created_at
audit_log       — id, actor_email, action, entity_type, entity_id, summary, created_at
cms_config      — id, key, value (JSON), updated_at
seo_config      — id, page_key, title, description, og_image, canonical, noindex
```

---

## 3. Auth — Custom session (iron-session)

**Why custom session auth:**
- HTTP-only, SameSite=Strict, Secure cookies — XSS and CSRF protected by design.
- No dependency on Firebase Auth or NextAuth for a simple email/password flow.
- Full control over rate-limiting, session expiry, and session invalidation.
- Library: `iron-session` (lightweight, encrypted cookie sessions) or `lucia` (more structured session management). Decision finalised at Slice 4 coding stage.

**Session flow:**
1. `POST /api/auth/sign-in` → verify credentials → create session record in DB → set HTTP-only cookie.
2. Every protected page: middleware reads cookie, validates session ID against DB, injects user into request context.
3. `POST /api/auth/sign-out` → delete session from DB → clear cookie.
4. Admin sessions: separate table, shorter TTL (8h), additional role check on every admin route.

---

## 4. Styling — CSS Modules + Design tokens

**Token file: `app/styles/tokens.css`**
```css
:root {
  --color-bg:       #0A0A0A;
  --color-card:     #141414;
  --color-card-2:   #161616;
  --color-purple:   #3D1A78;
  --color-gold:     #D4A017;
  --color-white:    #F5F5F5;
  --color-grey:     #888888;
  --color-error:    #E53E3E;
  --color-success:  #38A169;
  --color-warning:  #D69E2E;

  --font-primary:   'Inter', sans-serif;
  --font-display:   'Outfit', sans-serif;

  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  16px;

  --shadow-card: 0 2px 12px rgba(0,0,0,0.4);
}
```

Google Fonts loaded via `<link>` in `app/layout.tsx` — Inter (body) + Outfit (headings).  
No Tailwind. No GSAP. No Framer Motion. CSS transitions only for showroom animations.  
`prefers-reduced-motion` applied to all animated elements.

---

## 5. File storage — Supabase Storage

- Admin uploads jersey images → Supabase Storage bucket (`jersey-assets`).
- Public CDN URL served via `next/image` for automatic WebP + responsive sizing.
- Private bucket for future digital product files (signed URLs, TTL 15 min).
- Max upload size: 5 MB (enforced server-side before Supabase write).
- Original `references/jersey-assets/*.png` files are never overwritten — they are the source of truth. Admin uploads are production copies.

---

## 6. Hosting — Vercel

- `vercel.json` in project root to configure rewrites, headers, and redirects.
- Environment: `development` (local) → `staging` (Vercel preview branch) → `production`.
- Environment variables: set in Vercel dashboard; never in `.env` committed to Git.
- Zero-downtime: Vercel atomic deployments (new build → swap → no downtime).
- `robots.txt` and `sitemap.xml` generated at build time via Next.js route handlers.

---

## 7. PWA

- `/app/manifest.ts` → generates `manifest.webmanifest` dynamically.
- Service worker: `public/sw.js` (custom) — registered in `app/layout.tsx`.
- Cache: public pages + static assets. Exclude: `/cart`, `/checkout/*`, `/order/*`, `/account/*`, `/admin/*`.
- Icons: 192 × 192 + 512 × 512 SBG icon — to be created at UI slice (uses SBG eagle mark on dark background).

---

## 8. Payment interface (reserved, deferred)

```typescript
// lib/payment/types.ts
interface PaymentProvider {
  createOrder(amount: number, currency: string, orderId: string): Promise<ProviderOrder>;
  verifySignature(payload: unknown, signature: string): boolean;
  handleWebhook(event: unknown): Promise<void>;
  refund(providerOrderId: string, amount: number): Promise<void>;
}
```

`TestOnlyAdapter` implements this interface with a no-op that logs "TEST ONLY — no real payment". Real gateway (`RazorpayAdapter` or `CashfreeAdapter`) plugs in when merchant onboarding is done.

---

## 9. Dependency list (approved for Slice 1+)

| Package | Purpose | License |
|---|---|---|
| `next` | Framework | MIT |
| `react` `react-dom` | UI runtime | MIT |
| `typescript` | Type safety | Apache-2.0 |
| `prisma` | ORM + migrations | Apache-2.0 |
| `@prisma/client` | DB client | Apache-2.0 |
| `iron-session` | Session cookies | MIT |
| `bcryptjs` | Password hashing | MIT |
| `@supabase/supabase-js` | Storage + DB connection | MIT |
| `sentry/nextjs` | Error monitoring | Functional Source License (free tier) |
| `zod` | Schema validation | MIT |

**Explicitly NOT added:** Firebase, Three.js, GSAP, Framer Motion, Redux, Redis, Docker, Kubernetes, any queue system.  
**Add only with ADR amendment:** any package not in this list.

---

## Next steps

1. **Phase 6 — Security gate:** Threat model, RBAC matrix, CSP policy, rate-limit config, API auth plan.
2. **Phase 7 — UI approval:** Final screen review before first code commit.
3. **Phase 8 — Coding Slice 1:** Project scaffold → design tokens → shared layout → PWA skeleton.
