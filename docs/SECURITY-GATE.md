# SBG SHOP — Security Gate (Phase 6)

**Phase:** 6 — Security  
**Status:** Approved (24 Oct 2026)  
**Preceded by:** `docs/ADR-001-ARCHITECTURE.md` (Phase 5)  
**Followed by:** Phase 7 — UI Approval → Phase 8 — Coding

> This document defines the threat model, RBAC matrix, security controls, and coding rules every slice must satisfy. Coding does not begin until this gate is recorded.

---

## 1. Threat model (STRIDE)

| Threat | Surface | Control |
|---|---|---|
| **Spoofing** — impersonate customer or admin | Sign-in, session cookie | bcrypt password hash; HTTP-only Secure SameSite=Strict cookie; generic error (no enumeration); rate-limit |
| **Tampering** — modify price/stock client-side | Cart, checkout, order API | All prices, stock, tax computed `[S]` from DB on every request; client total is display-only |
| **Repudiation** — deny admin action | Inventory, order status, refund | Append-only audit log: actor, action, entity, timestamp, old→new value |
| **Info disclosure** — leak PII / secrets | API errors, logs, client bundle | Generic error messages; no stack traces in responses; secrets in Vercel env vars only; `next build --analyze` to check no secrets in bundle |
| **Denial of service** — brute force auth, spam | Sign-in, sign-up, forgot-password, contact form | Rate limiting per IP (see table below); CAPTCHA decision at Slice 4 |
| **Elevation of privilege** — customer accesses admin | `/admin/*` routes | Server-side admin session check + role check on every admin route/action; middleware enforced |

---

## 2. RBAC matrix

| Action | Visitor | Customer | Staff | Owner (Admin) |
|---|---|---|---|---|
| Browse products | ✅ | ✅ | ✅ | ✅ |
| Add to cart | ❌ | ✅ | ❌ | ❌ |
| Checkout / place order | ❌ | ✅ | ❌ | ❌ |
| View own orders | ❌ | ✅ (own only) | ❌ | ❌ |
| View all orders | ❌ | ❌ | ✅ | ✅ |
| Update order status | ❌ | ❌ | ✅ | ✅ |
| Create / edit products | ❌ | ❌ | ✅ | ✅ |
| Publish / unpublish products | ❌ | ❌ | ✅ | ✅ |
| Archive products | ❌ | ❌ | ❌ | ✅ |
| Adjust inventory | ❌ | ❌ | ✅ | ✅ |
| Upload media | ❌ | ❌ | ✅ | ✅ |
| Manage returns | ❌ | ❌ | ✅ | ✅ |
| Issue refund (when gateway live) | ❌ | ❌ | ❌ | ✅ |
| CMS / showroom config | ❌ | ❌ | ✅ | ✅ |
| SEO config | ❌ | ❌ | ✅ | ✅ |
| View audit log | ❌ | ❌ | ✅ | ✅ |
| Export audit log | ❌ | ❌ | ❌ | ✅ |
| Manage staff accounts | ❌ | ❌ | ❌ | ✅ |
| Store settings | ❌ | ❌ | ❌ | ✅ |
| View payment/gateway secrets | ❌ | ❌ | ❌ | Server-only (never UI) |

**Enforcement rule:** Every admin route handler and server action checks `session.adminRole` before executing. Returning `403` for insufficient role. Never trust client-provided role claim.

---

## 3. HTTP security headers

Configured in `next.config.ts` `headers()`:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' (nonce-based for inline scripts if needed);
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  font-src 'self' fonts.gstatic.com;
  img-src 'self' data: [supabase-storage-cdn-url];
  connect-src 'self' [supabase-url];
  frame-ancestors 'none';

X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Final CSP values finalised at Slice 1 once actual external origins are known.

---

## 4. Rate limiting

Implemented via a lightweight in-memory store (or Upstash Redis if persistence needed — ADR amendment required for Redis):

| Route | Limit | Window | Action on breach |
|---|---|---|---|
| `POST /api/auth/sign-in` | 5 | 15 min / IP | 429 + `Retry-After` header |
| `POST /api/auth/sign-up` | 10 | 1 hour / IP | 429 |
| `POST /api/auth/forgot-password` | 3 | 1 hour / email | 429 |
| `POST /api/auth/reset-password` | 5 | 1 hour / IP | 429 |
| `POST /api/contact` | 5 | 1 hour / IP | 429 |
| `POST /admin/login` | 5 | 15 min / IP | 429 |
| All other API | 100 | 1 min / IP | 429 |

---

## 5. Input validation rules

- All inputs validated server-side with **Zod** schemas before DB access.
- Client-side validation is UX convenience only — never a security boundary.
- Parameterised queries via Prisma — no raw string-concatenated SQL ever.
- File uploads: MIME type + magic bytes checked server-side; size limited to 5 MB.
- All user-supplied strings sanitised / escaped at render (React JSX does this by default; never use `dangerouslySetInnerHTML` with user content).
- URL redirect params (`?redirect=...`) whitelist-validated against allowed internal paths.

---

## 6. Session security

- Token: `iron-session` encrypted cookie (AES-256-GCM via `iron`).
- Cookie flags: `HttpOnly`, `Secure`, `SameSite=Strict`.
- Customer session TTL: 7 days rolling (refreshed on activity).
- Admin session TTL: 8 hours; expires on browser close (`Session` cookie).
- Session invalidation: deleting session row from DB on sign-out — cookie deletion alone is not sufficient.
- Concurrent sessions: allowed; each has its own session row.
- Session fixation: new session ID generated on every sign-in (old one destroyed).

---

## 7. Password security

- Hashing: `bcryptjs` with cost factor 12 (re-evaluate at architecture review if Argon2id becomes standard library support).
- Minimum length: 8 characters (server-enforced).
- No maximum password length that would cause DoS via bcrypt (cap input at 72 bytes before hashing).
- Breach check: optional HaveIBeenPwned API (k-anonymity) — deferred to post-launch enhancement.
- Password reset tokens: `crypto.randomBytes(32)` → hex → stored as `SHA-256(token)` in DB. Token in URL is plain hex; never stored plain.

---

## 8. Order and inventory integrity

- Order creation: single DB transaction — read cart prices from DB → validate stock → insert order + order_items → decrement stock. Atomic. If stock is 0 mid-transaction, rollback and return error.
- Stock updates (admin): row-level lock via Prisma `$transaction` to prevent concurrent double-adjustment.
- Price: never read from client request body. Always fetched from `products`/`variants` table at server action time.
- Order ownership: every `GET /api/orders/[id]` checks `order.userId === session.userId`. Admin routes check admin session separately.

---

## 9. Secrets management

| Secret | Where stored | Access |
|---|---|---|
| `DATABASE_URL` | Vercel env (server-only) | Server runtime only |
| `SESSION_SECRET` | Vercel env (server-only) | Server runtime only |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel env (server-only) | Server runtime only |
| `SUPABASE_ANON_KEY` | Vercel env (public OK) | Client-safe for storage uploads via signed URLs |
| Future: gateway API key | Vercel env (server-only) | Server runtime only |

**`NEXT_PUBLIC_` prefix is NEVER used for any secret.** Only truly public values (site name, public Supabase URL) may use this prefix.

---

## 10. Audit log implementation

Every sensitive admin action calls `createAuditLog()`:

```typescript
// lib/audit.ts
async function createAuditLog(params: {
  actorEmail: string;
  action: string;         // e.g. 'PRODUCT_PUBLISH', 'INVENTORY_ADJUST'
  entityType: string;     // e.g. 'product', 'variant', 'order'
  entityId: string;
  summary: string;        // e.g. 'stock: 10 → 7 (reason: sold offline)'
}) { /* insert into audit_log */ }
```

**Never log:** passwords, session tokens, full card data, gateway secrets, raw PII beyond name + email.  
**Log is append-only** — no UI delete or edit action. DB-level: no `DELETE` privilege granted to app DB user on `audit_log`.

---

## 11. PWA security

- Service worker never caches: `/cart`, `/checkout/*`, `/order/*`, `/account/*`, `/admin/*`.
- Offline success is impossible for order/payment — if offline, cart/checkout shows error state.
- Service worker scope: `/` (full app).
- HTTPS required — service workers only register over HTTPS (Vercel enforces this).

---

## 12. Pre-launch security checklist

- [ ] All admin routes return 401/403 without valid admin session (automated test).
- [ ] No secrets in client bundle (`next build --analyze`).
- [ ] Rate limits return 429 on threshold breach (manual test).
- [ ] Generic error messages on all auth endpoints (no user enumeration).
- [ ] CSP headers present and correct on all responses.
- [ ] HTTPS enforced; HTTP → HTTPS redirect active.
- [ ] No `console.log` of PII or tokens in production build.
- [ ] Audit log records created for all sensitive actions (integration test).
- [ ] Password reset token invalidated after use (integration test).
- [ ] Concurrent last-item order test: only one succeeds.
- [ ] OWASP Top 10 self-review checklist completed.

---

## Next step — Phase 7: UI Approval

Before the first `git commit` of application code:

1. Review the 4 UI screens (Phase 4) against the ADR (Phase 5) — confirm they match the tech stack.
2. Confirm mobile (375 px) and desktop (1280 px) layouts are both planned.
3. Confirm all loading / empty / error / success states are designed.

After Phase 7 sign-off → **Phase 8: Slice 1 coding begins.**
