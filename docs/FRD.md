# SBG SHOP — Functional Requirements Document (FRD)

**Phase:** 3 — FRD  
**Status:** Draft — awaiting owner review and sign-off  
**Date:** 24 October 2026  
**Preceded by:** `docs/PRD.md` (Phase 2, owner-confirmed)  
**Followed by:** `docs/NFR.md` → Figma gate (Phase 4)

> **Gate rule:** This document defines *how* each feature behaves — screens, states, data, APIs, edge cases. It does not approve coding or Figma. Coding starts only after PRD + FRD + NFR + Figma + Architecture + Security gates are all signed off.

> **OPEN DECISION** markers = owner must resolve before Figma design can begin for that screen.

---

## Notation

| Symbol | Meaning |
|---|---|
| `→` | User action triggers |
| `[S]` | Server-side only |
| `[C]` | Client-side |
| `AUTH` | Requires valid session |
| `ADMIN` | Requires admin session + role check |
| ⚠️ | Security / data integrity rule |
| 🔴 OPEN | Unresolved — do not invent |

---

## PART 1 — CUSTOMER STOREFRONT

---

### F01 — Home / Virtual Showroom

**Route:** `/`  
**Auth:** None (public)  
**Purpose:** Brand entry point; display jersey lineup; drive product discovery.

#### Layout
- Full-viewport hero section: charcoal/cool-grey studio environment.
- Horizontal jersey rail: Black jersey card → White jersey card (order configurable in admin CMS).
- Each card: product image (front mockup), jersey name label, price `[S]`.
- Focused card state: slight scale-up + label visible; unfocused cards: subtle dim.
- Header: SBG logo (links to `/`), nav links (Jerseys, About, Contact), cart icon (badge = item count `[AUTH]`), account icon.
- Footer: nav links to all legal pages, contact.

#### Showroom display — 3D asset path
- **When 3D assets are NOT yet supplied:** Display front-face image of each jersey on a styled product card. No animation implying rotation. Label: "Image preview — full showroom coming soon" or equivalent honest copy.
- **When 3D assets ARE supplied:** Replace image cards with 3D viewer component (asset format + library to be determined at Architecture gate, subject to AGENTS.md dependency rules).

#### States

| State | Behaviour |
|---|---|
| Loading | Skeleton cards in the rail; header fully rendered |
| Products available | Horizontal rail with both jerseys |
| No published products | Friendly "Collection launching soon" message; no broken UI |
| API error | "Unable to load products right now. Try refreshing." Retry button |
| Reduced-motion | Static images, no transitions (`prefers-reduced-motion: reduce`) |

#### Data needed
- Published products list `[S]`: `id`, `slug`, `name`, `primaryImageUrl`, `price`, `stockStatus`
- Showroom order config from admin CMS

#### Interactions
- Click jersey card → navigate to `/jerseys/[slug]`
- Click cart icon → slide-out cart drawer or navigate to `/cart`
- Click account icon → if logged in → `/account`; if not → `/sign-in`

---

### F02 — Product Listing / Collection

**Route:** `/jerseys`  
**Auth:** None (public)  
**Purpose:** Browse all available jerseys; filter and sort.

#### Layout
- Page title: "Jerseys" + breadcrumb: Home › Jerseys
- Filter panel (sidebar on desktop, drawer on mobile): Colour — All / Black / White
- Sort control: Default / Price: Low to High / Price: High to Low
- Product grid: 2 columns mobile, 3 columns desktop
- Each product tile: image, name, price, stock badge (In Stock / Out of Stock / Low Stock)
- SEO: `<title>SBG Jerseys | SBG SHOP</title>`, unique meta description

#### States

| State | Behaviour |
|---|---|
| Loading | Grid skeleton (4 tiles) |
| Products returned | Grid rendered |
| No results after filter | "No jerseys match your filter. Clear filters." |
| All out of stock | Show tiles with Out of Stock badge; Allow browsing |
| API error | "Couldn't load products. Retry." |

#### Data needed `[S]`
- `GET /api/products?category=jersey&colour={filter}&sort={sort}`
- Response: `[{ id, slug, name, colour, primaryImageUrl, price, compareAtPrice, stockStatus }]`

#### Edge cases
- Filter + sort combination returns empty → show empty state, not blank page.
- Price display: always show server-returned price; never compute from client.

---

### F03 — Product Detail Page (PDP)

**Route:** `/jerseys/[slug]`  
**Auth:** None to browse; AUTH to add to cart  
**Purpose:** Full product information; drive add-to-cart.

#### Layout
- Breadcrumb: Home › Jerseys › [Product Name]
- Image gallery: front image (default) + back image; toggle button "Front / Back"
- No fake 3D. No rotation animation on 2D images.
- Product name (H1), price `[S]`, compare-at price (strikethrough if set)
- Size selector: button group (S / M / L / XL / XXL) 🔴 OPEN (OD-02: exact sizes)
- Size guide link → modal or `/size-guide` page (content 🔴 OPEN OD-02)
- Stock indicator: "In Stock" / "Only [N] left" / "Out of Stock"
- Quantity stepper: min 1, max = available stock `[S]`
- Add to Cart button: disabled if: no size selected OR out of stock OR quantity > stock
- Product description (owner-provided)
- Shipping summary (brief; link to `/shipping`) 🔴 OPEN (OD-05)
- Returns summary (brief; link to `/returns`) 🔴 OPEN (OD-07)
- SEO: unique `<title>`, meta description, `<link rel="canonical">`, Product JSON-LD `[S]`

#### States

| State | Behaviour |
|---|---|
| Loading | Skeleton: image placeholder, text lines |
| Product available | Full PDP |
| Out of stock | Size selector disabled; "Out of Stock" badge; Add to Cart disabled; "Notify me" placeholder (deferred feature) |
| Size not selected | Add to Cart click → inline error "Please select a size" |
| Quantity > stock | Stepper capped at stock; warning if user tries to exceed |
| Not logged in → Add to Cart | → redirect to `/sign-in?redirect=/jerseys/[slug]` |
| Product not found | 404 page |
| API error | Error message + retry |

#### Data `[S]`
- `GET /api/products/[slug]`
- Response: `{ id, slug, name, description, price, compareAtPrice, images: [{url, view: 'front'|'back', alt}], variants: [{id, size, sku, stock, active}], seo: {title, description} }`

⚠️ Price and stock are fetched server-side on every page load. Client must not cache stale price.

#### Edge case — concurrent last item
- User A and User B both viewing the last size M. User A adds to cart first. User B adds → cart validation `[S]` returns stock = 0 → show "Sorry, this size just sold out."

---

### F04 — Cart

**Route:** `/cart` (or slide-out drawer)  
**Auth:** Required (`AUTH`) — cart is account-tied  
**Purpose:** Review selections before checkout.

#### Layout
- Cart items list: product image (small), name, size, quantity stepper, remove button, line subtotal
- Order subtotal (sum of line totals) — computed `[S]`
- "Continue Shopping" link → back to `/jerseys`
- "Proceed to Checkout" CTA → `/checkout/address`
- Empty cart state: "Your cart is empty. Browse jerseys →"

#### States

| State | Behaviour |
|---|---|
| Loading | Skeleton list |
| Items in cart | Full list |
| Empty | Empty state with CTA |
| Item went out of stock since added | Warning banner: "Sorry, [product/size] is now out of stock" + remove button; Checkout CTA disabled until resolved |
| Price changed since added | Warning: "Price updated for [product]" with new price shown |
| API error on load | Retry option |

#### Data `[S]`
- `GET /api/cart` → `{ items: [{cartItemId, productId, variantId, name, size, imageUrl, priceAtTime, currentPrice, quantity, stock}], subtotal }`
- `POST /api/cart` → add item `{ variantId, quantity }`
- `PATCH /api/cart/[cartItemId]` → update quantity
- `DELETE /api/cart/[cartItemId]` → remove item

⚠️ `currentPrice` and `stock` returned from `GET /api/cart` must be freshly read from DB on every request, not cached.  
⚠️ Cart subtotal computed server-side; client displays it, never computes it independently.

---

### F05 — Checkout — Address

**Route:** `/checkout/address`  
**Auth:** Required (`AUTH`)  
**Purpose:** Collect shipping details.

#### Layout
- Step indicator: Address → Review → Confirmation
- Form fields:
  - Full name (required)
  - Mobile number (required; India format: 10 digits starting 6–9)
  - Address line 1 (required)
  - Address line 2 (optional)
  - City (required)
  - State (required; dropdown — all Indian states/UTs)
  - PIN code (required; 6-digit India PIN)
- "Save this address for future orders" checkbox (default: checked)
- Saved addresses section: if account has saved addresses, allow selecting one
- Privacy note: "We use your details only to deliver your order. See our [Privacy Policy](/privacy)."
- "Continue to Review" button → `[S]` validates fields → `/checkout/review`

#### States

| State | Behaviour |
|---|---|
| Loading saved addresses | Skeleton |
| Addresses loaded | Select or fill new |
| Validation error | Inline per-field error; button stays disabled |
| Valid form | Button enabled |
| Submit error (API) | "Couldn't save address. Please try again." |

#### Validation rules `[S]`
- PIN: `/^[1-9][0-9]{5}$/`
- Mobile: `/^[6-9][0-9]{9}$/`
- All required fields non-empty, trimmed, max lengths enforced server-side.

⚠️ Validation must run server-side; client-side validation is UX-only, not a security boundary.

---

### F06 — Checkout — Order Review

**Route:** `/checkout/review`  
**Auth:** Required (`AUTH`)  
**Purpose:** Final review before creating a pending order.

#### Layout
- Step indicator: Address ✓ → Review → Confirmation
- Items summary: each cart item (image, name, size, quantity, line price)
- Delivery address (with "Edit" link → back to `/checkout/address`)
- Price breakdown:
  - Subtotal `[S]`
  - Shipping `[S]` 🔴 OPEN (OD-05: real rate required)
  - GST/Tax `[S]` 🔴 OPEN (OD-06: real rate required; do not invent)
  - **Total** `[S]`
- Prominent label: **"⚠️ TEST MODE — Payment not yet available. No real transaction will occur."**
- "Confirm Order" button → `POST /api/orders` → creates pending order
- Links to Returns Policy and Terms before confirm button

#### States

| State | Behaviour |
|---|---|
| Loading | Skeleton |
| Data loaded | Full review |
| Cart empty on arrival | Redirect to `/cart` |
| Stock changed since cart | Warning; disable Confirm; prompt to update cart |
| Submit in progress | Button disabled + spinner |
| Success | Redirect to `/order/[orderId]/confirmation` |
| API error | "Order couldn't be placed. Try again." |

⚠️ ALL price calculations are `[S]` only. Client never sends a price to create an order; it sends only `cartId` + `addressId`.  
⚠️ `POST /api/orders` reads cart, prices, stock, and tax from DB. Rejects if stock is insufficient.

---

### F07 — Order Confirmation

**Route:** `/order/[orderId]/confirmation`  
**Auth:** Required (`AUTH`); user must own this order  
**Purpose:** Acknowledge order created; set correct expectations.

#### Layout
- Order reference number (display-safe, not guessable)
- Status: **"Order Pending — Payment not yet available"**
- Items summary (snapshot)
- Delivery address snapshot
- Message: "We'll update you when payment is enabled and your order is confirmed."
- "Continue Shopping" link
- "View My Orders" link → `/account/orders`

#### States

| State | Behaviour |
|---|---|
| Order found + owned | Confirmation shown |
| Order not found | 404 |
| Order owned by different user | 403 / redirect |
| Order in non-pending state (cancelled/failed) | Show appropriate state message |

⚠️ Never say "Payment successful" or "Order confirmed" unless real payment gateway confirms it.

---

### F08 — Account — Sign-up

**Route:** `/sign-up`  
**Auth:** Redirect to `/account` if already logged in  
**Purpose:** Create customer account.

#### Form fields
- Full name (required)
- Email (required; format validated)
- Password (required; min 8 chars; server-side strength check)
- Confirm password (must match)
- "I agree to the Terms of Service and Privacy Policy" checkbox (required)

#### Flow
1. Submit → `[S]` validates all fields.
2. Check: email not already registered (generic error if it is: "An account with this email already exists or the email/password combination is invalid" — no enumeration).
3. Hash password `[S]` (bcrypt or equivalent).
4. Create user record.
5. Send email verification link (token, expiry 24h) — 🔴 OPEN (OD-email: email provider not yet selected; reserve integration point).
6. Show: "Check your email to verify your account before signing in."

#### States

| State | Behaviour |
|---|---|
| Validation errors | Inline per-field errors |
| Email already exists | Generic error (no enumeration) |
| Success | "Check your email" screen |
| Email send failure | "Account created. Email send failed — contact support." + log error |
| Rate limit hit | "Too many attempts. Try again later." (429) |

---

### F09 — Account — Sign-in

**Route:** `/sign-in`  
**Auth:** Redirect to `/account` if already logged in  
**Purpose:** Authenticate customer.

#### Form fields
- Email, Password
- "Forgot password?" link → `/forgot-password`

#### Flow `[S]`
1. Rate-limit: max 5 failed attempts per IP per 15 min → 429 with retry-after.
2. Lookup user by email. If not found → generic error (no enumeration).
3. Compare password hash. If mismatch → generic error.
4. If email not verified → "Please verify your email first. [Resend verification email]"
5. Create HTTP-only session cookie (SameSite=Strict, Secure, expiry configurable).
6. Redirect to `?redirect` param (whitelist validated) or `/account`.

#### States

| State | Behaviour |
|---|---|
| Invalid credentials | "Invalid email or password." (generic) |
| Unverified email | Resend option shown |
| Rate limited | "Too many attempts. Try again in [N] minutes." |
| Success | Redirect |

⚠️ Never expose whether email exists. Generic error for all sign-in failures.

---

### F10 — Account — Password Recovery

**Routes:** `/forgot-password` → `/reset-password?token=[token]`  
**Auth:** None  
**Purpose:** Secure password reset.

#### Flow `[S]`
1. User enters email → `POST /api/auth/forgot-password`.
2. If email found: generate cryptographically random token, store hashed, expiry 1h.
3. Send reset link (token in URL).
4. Response: always "If an account exists for this email, a reset link has been sent." (no enumeration).
5. User clicks link → `GET /reset-password?token=[token]` → validate token (not expired, not used).
6. User submits new password → `POST /api/auth/reset-password` → hash + save + invalidate all existing sessions for this user + invalidate token.

#### States

| State | Behaviour |
|---|---|
| Request submitted | Generic success message always shown |
| Token expired | "Link expired. Request a new one." |
| Token already used | "Link already used. Request a new one." |
| Password mismatch | Inline error on confirm field |
| Success | "Password updated. Sign in." |

---

### F11 — Account Dashboard

**Route:** `/account`  
**Auth:** Required (`AUTH`)  
**Purpose:** Customer home — orders, addresses, settings.

#### Sections
- Welcome: customer name
- Recent orders: last 3 orders (reference, date, status, item count); "View all orders" link
- Saved addresses: list with edit/delete; "Add new address"
- Account settings: change password link, sign-out button

---

### F12 — Account — Order History + Detail

**Routes:** `/account/orders` (list) + `/account/orders/[orderId]` (detail)  
**Auth:** Required (`AUTH`)  
**Purpose:** Review past orders.

#### Order list
- Table/list: order reference, date, status, total, "View" link
- Empty state: "No orders yet. Start shopping →"

#### Order detail
- Item snapshot at time of order: name, size, image, price per unit, quantity, line total
- Delivery address snapshot
- Status timeline: Pending → Confirmed → Shipped (tracking number + courier) → Delivered
- Total breakdown (as shown at checkout)
- "Need help?" → `/contact`

⚠️ Show data snapshotted at order time (name, price, size). Do not show live product data — it may have changed.  
⚠️ User may only view their own orders. Server checks `order.userId === session.userId` on every request.

---

## PART 2 — ADMIN PANEL

---

### F13 — Admin Sign-in

**Route:** `/admin/login`  
**Auth:** None (but redirect to `/admin` if already admin session)  
**Purpose:** Authenticate admin user.

#### Rules
- No public signup at this route or any other.
- Rate-limit: max 5 failed attempts per IP per 15 min.
- Generic error: "Invalid credentials."
- Session cookie: HTTP-only, SameSite=Strict, Secure, shorter expiry than customer session.
- On success → `/admin`.

⚠️ Consider returning 404 for `/admin` to unauthenticated public requests in production (reduces route discovery). Final decision at security gate.

---

### F14 — Admin Dashboard

**Route:** `/admin`  
**Auth:** `ADMIN`  
**Purpose:** Real-time store health overview.

#### Widgets (real data only)
- Total orders today / this week / all time (by status: pending / confirmed / shipped / delivered / cancelled)
- Low-stock alerts: variants where stock ≤ threshold
- Recent orders: last 5 orders with reference, customer name, status
- Quick links: Add product, View orders, View inventory

⚠️ All numbers come from DB queries `[S]`. No hardcoded or fake stats.

---

### F15 — Admin Product Manager

**Route:** `/admin/products`  
**Auth:** `ADMIN`

#### Product list
- Table: name, colour, published status, price, created date, actions (Edit / Archive)
- "New Product" button → `/admin/products/new`

#### Product form (create + edit) — `/admin/products/[id]`

**Fields:**
- Name (required, max 100 chars)
- Slug (auto-generated from name; editable; unique validation)
- Colour: Black / White (required) — v1 only
- Description (rich text or markdown)
- Price in INR (required; positive number; 2 decimal max) 🔴 OPEN (OD-03)
- Compare-at price in INR (optional; must be > price if set)
- Category: "Jersey" (locked to jersey for v1)
- SEO title (max 60 chars)
- SEO meta description (max 155 chars)
- Published toggle (default: unpublished)

**Actions:**
- Save Draft
- Publish / Unpublish
- Archive (soft delete; product with orders cannot be hard deleted)

⚠️ Slug must be unique; validated `[S]` on save.  
⚠️ Archiving a product with active orders: product hides from storefront but order records retain snapshot data.

---

### F16 — Admin Variant / Size Manager

**Route:** `/admin/products/[id]/variants`  
**Auth:** `ADMIN`

#### Variant table
- Columns: Size, SKU, Colour, Price override, Stock, Active toggle
- "Add Variant" button

#### Variant form
- Size: select from configured sizes 🔴 OPEN (OD-02)
- SKU (required; unique; max 50 chars)
- Colour label (e.g., "Black", "White") — linked to parent product colour
- Price override (optional; if set, overrides product price for this variant)
- Active toggle

⚠️ Each product+size combination must be unique. Validated `[S]`.

---

### F17 — Admin Inventory Manager

**Route:** `/admin/inventory`  
**Auth:** `ADMIN`

#### Layout
- Table: product name, size/variant, SKU, current stock, low-stock threshold, last adjusted date
- Filter: by product, by stock status (in stock / low stock / out of stock)
- "Adjust Stock" action per row

#### Stock adjustment modal
- Fields: variant (pre-filled), adjustment type (Add / Remove / Set), quantity, reason (required; free text)
- Submit → `[S]` updates stock, creates audit log entry

⚠️ Stock adjustments are logged to audit log (F23) with: admin actor, variant ID, old stock, new stock, reason, timestamp.  
⚠️ Concurrent adjustments must not produce negative stock. Use DB-level transaction / row lock.

---

### F18 — Admin Media Manager

**Route:** `/admin/products/[id]/media`  
**Auth:** `ADMIN`

#### Layout
- Existing images: thumbnail grid with view (front / back) label, alt text, delete action
- Upload form: file input (accept: image/webp, image/jpeg, image/png), view selector (front / back), alt text (required)
- Set primary image button

#### Validation `[S]`
- Max file size: 5 MB (confirmed at NFR gate)
- Accepted types: WebP, JPEG, PNG
- Alt text: required, max 200 chars

⚠️ Uploaded images are stored server-side (object storage; path to be decided at architecture gate). Public CDN URL is used for product images; no private bucket URL exposed.  
⚠️ Preserve original SBG jersey mockup files unchanged in `references/jersey-assets/`. Do not overwrite them.

---

### F19 — Admin Orders / Fulfilment Queue

**Route:** `/admin/orders`  
**Auth:** `ADMIN`

#### Order list
- Table: order reference, date, customer name, items count, total, status, actions
- Filter by status: All / Pending / Confirmed / Shipped / Delivered / Cancelled / Refund Requested
- Search by order reference or customer email

#### Order detail — `/admin/orders/[orderId]`
- Item snapshot (name, size, image, price, quantity at time of order)
- Customer name + email (masked to last 3 chars for privacy by default; full visible to owner role)
- Delivery address
- Status timeline with timestamps and actor

**Actions:**
- Mark Confirmed (when payment is live and confirmed; deferred until gateway)
- Mark Shipped → requires tracking number + courier name
- Mark Delivered
- Cancel Order → requires reason; stock restored `[S]`; audit log entry

⚠️ Status transitions are one-directional (no reverting Shipped to Pending). Enforced `[S]`.  
⚠️ Cancelling an order restores stock atomically (DB transaction).

---

### F20 — Admin Returns / Refunds

**Route:** `/admin/orders/[orderId]/returns`  
**Auth:** `ADMIN`

#### Return request form
- Order reference (pre-filled)
- Items to return: checkboxes per line item, quantity per item
- Reason (required; dropdown: Damaged / Wrong Size / Changed Mind / Other + text)
- Notes (optional)

#### Return eligibility check `[S]`
- Order must be in Delivered status.
- Request must be within return window (configured in store settings).
- If ineligible → show reason; allow admin to override with documented reason.

#### Return states
`Requested` → `Approved` → `Rejected` or → `Refund Issued`

⚠️ "Refund Issued" state is locked until real payment gateway is integrated. Admin can mark approved but cannot trigger a gateway refund call yet. Display: "Refund pending gateway integration."

---

### F21 — Admin CMS / Showroom Manager

**Route:** `/admin/cms`  
**Auth:** `ADMIN`

#### Showroom config
- Showroom headline text (e.g., "The Shadow Collection")
- Jersey display order: drag-and-drop product order for the showroom rail
- Promotional banner: text + image upload + CTA link
- Draft / Preview / Publish workflow

#### Preview
- In-browser preview of the showroom with current draft settings before publishing.

---

### F22 — Admin SEO Manager

**Route:** `/admin/seo`  
**Auth:** `ADMIN`

#### Per-page SEO (storefront pages)
- Page selector: Home, /jerseys, each product, About, Contact, legal pages
- Fields: SEO title, meta description, og:title, og:image upload, canonical URL, noindex toggle
- Character counters: title ≤ 60, description ≤ 155

#### Global settings
- robots.txt rules (admin, cart, checkout, account paths blocked from indexing)
- Sitemap: auto-generated from published products and public pages; trigger regeneration button

---

### F23 — Admin Audit Log

**Route:** `/admin/audit`  
**Auth:** `ADMIN` (read-only)

#### Log table
- Columns: Timestamp, Actor (admin email), Action, Entity type, Entity ID, Summary
- Filter by: date range, actor, entity type, action
- Export to CSV (owner role only)

#### Logged events (minimum)
- Product: create, edit, publish, unpublish, archive
- Variant: create, edit, deactivate
- Inventory: every stock adjustment (old → new, reason)
- Order: status change (actor, from → to, reason)
- Return: create, approve, reject, refund-issued
- Admin: sign-in, sign-out, failed sign-in, password change
- Staff: role change, deactivation

⚠️ Audit log is append-only. No edit or delete from UI.  
⚠️ Never log: passwords, payment card data, gateway secrets, full session tokens, or full PII beyond email + name.

---

### F24 — Admin Store Settings

**Route:** `/admin/settings`  
**Auth:** `ADMIN` (owner role only)

#### Fields
- Store name
- Contact email (displayed on legal pages)
- Return window: number of days from delivery date (🔴 OPEN OD-07)
- Low-stock alert threshold (default: 5 units)
- Grievance officer name + contact (🔴 OPEN OD-08)
- Future: payment gateway credentials (stored server-side secret manager; masked in UI; never in client bundle)

---

## PART 3 — LEGAL + SUPPORT PAGES

---

### F25 — Legal Pages

**Routes:** `/privacy`, `/terms`, `/returns`, `/shipping`, `/contact`  
**Auth:** None (public)

| Page | Content source | Gate before launch |
|---|---|---|
| Privacy Policy | Owner-written + legal review | Must match actual data flows |
| Terms of Service | Owner-written + legal review | Must match actual business model |
| Returns / Refund Policy | Owner-written | Must reflect real return window (OD-07) |
| Shipping & Delivery | Owner-written | Must reflect real shipping info (OD-05) |
| Contact | Owner-provided name, email, address, grievance officer | Required for Consumer Protection E-Commerce Rules |

⚠️ No placeholder / lorem ipsum text in production. Pages may be "Coming Soon" before launch only with a go-live date commitment.

### Contact Form (`/contact`)
- Fields: Name, Email, Subject (dropdown: Order Help / Returns / General / Other), Message
- Server-side validation + spam protection (honeypot field minimum; CAPTCHA at security gate decision)
- Success: "Thanks! We'll reply within [N] business days." 🔴 OPEN (response SLA)
- Failure: "Couldn't send. Please email us directly at [contact@email]." 🔴 OPEN (OD-08)

---

## PART 4 — PWA

---

### F26 — PWA — Install + Offline

#### Web App Manifest (`/manifest.webmanifest`)
- `name`: "SBG SHOP"
- `short_name`: "SBG"
- `start_url`: "/"
- `display`: "standalone"
- `theme_color`: "#0a0a0a"
- `background_color`: "#0a0a0a"
- Icons: 192 × 192 and 512 × 512 (SBG icon — to be designed at Figma gate)

#### Service Worker
- Cache strategy: Cache-first for static assets; Network-first for API calls.
- Precache: Home, /jerseys, /about, /contact, offline fallback page.
- Never cache: `/cart`, `/checkout/*`, `/order/*`, `/account/*`, `/admin/*`.

#### Offline fallback
- URL: `/offline`
- Message: "You're offline. Reconnect to continue shopping."
- Show last-cached product list if available (stale-while-revalidate for `/jerseys` only).

#### Update notification
- When a new service worker is waiting, show banner: "An update is available. [Refresh]"
- Do not auto-refresh mid-checkout.

---

## PART 5 — API CONTRACT SUMMARY

### Auth endpoints
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/sign-up` | POST | None | Create account |
| `/api/auth/sign-in` | POST | None | Create session |
| `/api/auth/sign-out` | POST | AUTH | Destroy session |
| `/api/auth/forgot-password` | POST | None | Send reset link |
| `/api/auth/reset-password` | POST | None | Reset with token |
| `/api/auth/verify-email` | GET | None | Verify email token |

### Product / catalogue endpoints
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/products` | GET | None | List published products |
| `/api/products/[slug]` | GET | None | Single product detail |
| `/api/admin/products` | GET/POST | ADMIN | List + create products |
| `/api/admin/products/[id]` | GET/PATCH/DELETE | ADMIN | Manage product |
| `/api/admin/products/[id]/variants` | GET/POST/PATCH | ADMIN | Manage variants |
| `/api/admin/inventory` | GET/PATCH | ADMIN | View + adjust stock |
| `/api/admin/media/upload` | POST | ADMIN | Upload product image |

### Cart + checkout endpoints
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/cart` | GET | AUTH | Get cart |
| `/api/cart` | POST | AUTH | Add item |
| `/api/cart/[itemId]` | PATCH | AUTH | Update quantity |
| `/api/cart/[itemId]` | DELETE | AUTH | Remove item |
| `/api/checkout/address` | POST | AUTH | Save / select address |
| `/api/orders` | POST | AUTH | Create pending order |
| `/api/orders/[id]` | GET | AUTH | Get own order |

### Admin endpoints
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/admin/orders` | GET | ADMIN | List all orders |
| `/api/admin/orders/[id]` | GET/PATCH | ADMIN | View + update order status |
| `/api/admin/returns` | POST | ADMIN | Create return request |
| `/api/admin/settings` | GET/PATCH | ADMIN (owner) | Store settings |
| `/api/admin/audit` | GET | ADMIN | Read audit log |
| `/api/admin/cms` | GET/PATCH | ADMIN | Showroom config |
| `/api/admin/seo` | GET/PATCH | ADMIN | SEO settings |

⚠️ All admin endpoints must validate admin session AND role server-side on every request.  
⚠️ All endpoints return generic error messages; never expose stack traces, DB errors, or internal paths.

---

## PART 6 — EDGE CASES (cross-cutting)

| Edge case | Handling |
|---|---|
| Session expires mid-checkout | On next request → 401 → redirect to `/sign-in?redirect=/checkout/review`; draft cart persists |
| Two users add last stock simultaneously | DB transaction on `POST /api/orders` → second user gets "Item out of stock" error; first succeeds |
| Admin and customer try to adjust stock simultaneously | DB row-level lock on inventory update |
| Product price changes while customer is in checkout | Order creation reads current price from DB; cart "stale price" warning shown |
| Customer tries to access another user's order by guessing ID | `[S]` checks `order.userId === session.userId`; returns 403 |
| Admin deletes product with existing orders | Soft archive only; order records retain snapshot; product hidden from storefront |
| Service worker caches stale cart state | Cart routes are explicitly excluded from cache; always network |
| User submits checkout form offline | API call fails → offline error state; order NOT created |

---

## Open decisions (must resolve before Figma gate)

| # | Decision | Blocking? |
|---|---|---|
| OD-01 | Canonical jersey image files per SKU | Figma PDP, Media Manager |
| OD-02 | Exact sizes + size guide content | Figma PDP, Variant Manager |
| OD-03 | Jersey prices in INR | Figma PDP, Order Review |
| OD-04 | Initial stock levels | Inventory Manager |
| OD-05 | Shipping carrier + rates + delivery estimate | Checkout Order Review, Shipping page |
| OD-06 | GST rate + GSTIN (CA to confirm) | Checkout Order Review |
| OD-07 | Return window in days | Returns policy, Store settings |
| OD-08 | Legal identity, address, grievance officer, contact email | Contact page, Legal pages, Admin settings |
| OD-09 | 3D assets — format + timeline | Showroom component design |
| OD-10 | Domain URL | Canonical URLs, sitemap, CSP |
| OD-email | Email transactional provider | Sign-up verification, password reset |

---

## Next steps after FRD sign-off

1. Write `docs/NFR.md` (non-functional requirements + test plan).
2. Figma / UI-UX gate: design every FRD screen with mobile + desktop frames, all states annotated.
3. Architecture gate: select framework, DB, auth library, hosting, storage via ADR.
4. Security gate: threat model, RBAC matrix, rate-limit config, CSP policy, webhook plan.
5. Incremental coding — one slice at a time in Google AI Studio.
