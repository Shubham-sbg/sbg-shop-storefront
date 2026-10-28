# SBG SHOP — Official Virtual Showroom & Premium Esports Apparel

> **SBG SHOP** is a modern e-commerce storefront and 3D virtual clothing showroom for official SBG esports apparel and merchandise. Engineered with Next.js 16 App Router, TypeScript, Three.js WebGL, and custom CSS design tokens.

---

## 🌟 Overview & Experience

SBG SHOP delivers a quiet, premium virtual showroom experience inspired by modern architectural studios. Built from the ground up to showcase official SBG jerseys with authentic proportions, tactile lighting, interactive front/back viewing, and an integrated shopping flow.

### ✨ Implemented Features

1. **Virtual 3D Showroom (`/`)**
   - Immersive Three.js WebGL studio with ambient studio lighting, floor contact shadows, and realistic cyclorama.
   - Architectural freestanding clothing rail with momentum-based smooth horizontal dragging and snap navigation.
   - Interactive 360° product inspector modal with orbit controls, Front/Back view snap buttons, camera reset, and continuous auto-rotation toggle.
   - Live size selection (`S`, `M`, `L`, `XL`, `XXL`, `XXXL`, `Free Size`) and direct "Add to Bag" interaction with feedback toasts.

2. **Collection Catalogue (`/products`)**
   - High-contrast card grid showcasing all 4 official SKUs.
   - Category filtering (`All`, `White Jerseys`, `Black Jerseys`).
   - Interactive Front / Back mockup view flip on each product card.

3. **Product Detail Page (`/products/[id]`)**
   - Interactive multi-angle product gallery (front, back, alternate angle).
   - Dynamic size selection with live stock availability indicators.
   - Interactive Size Chart Modal with chest, length, and sleeve measurements in inches.
   - Technical specifications breakdown: fabric GSM, moisture-wicking technology, seam construction, and origin.

4. **Cart & Bag Management (`/cart`)**
   - Persistent client-side cart (`CartContext`) synchronized via browser `localStorage`.
   - Real-time quantity adjustment, item removal, and auto-calculated subtotals.
   - Demo promo code support (`SBG10` for 10% discount).
   - Free shipping guarantee calculator.

5. **Checkout & Order Flow (`/checkout` & `/checkout/success`)**
   - Streamlined multi-step delivery address form with validation.
   - Interactive payment method selector (clearly badged as **Test / Demo Simulation Mode**).
   - Unique order reference generator (e.g., `SBG-2026-XXXX`).

6. **Order Tracking Portal (`/orders`)**
   - Real-time order lookup by Order ID and phone/email.
   - Visual multi-step logistics timeline (Order Placed → Processing → Quality Check → Out for Delivery).

7. **Admin Operations Shell (`/admin`)**
   - Real-time order queue synchronized with simulated checkout orders.
   - Live inventory matrix displaying stock levels across all SKUs and sizes.
   - System and gateway status audit.

8. **Trust, Support & Compliance Pages**
   - `/about`: Brand philosophy ("EVERY MOVE MATTERS"), esports heritage, and craftsmanship.
   - `/contact`: Dedicated support desk with response guarantee (<24h) and inquiry form.
   - `/returns`: 7-Day Hassle-Free Size Exchange policy.
   - `/refund`: Transparent refund and cancellation guidelines.
   - `/terms`: Terms of service, intellectual property, and governing law of India.
   - `/privacy`: Privacy policy aligned with India's Digital Personal Data Protection (DPDP) Act.
   - `/not-found`: Custom branded 404 recovery page.

---

### ⏳ Planned / Deferred Features (Per Architecture Blueprint)

- **Production Payment Gateway:** Real merchant processing (e.g. Razorpay / Cashfree) is deferred until official gateway onboarding; currently operates in safe **TEST ONLY** demonstration mode.
- **Courier Logistics Integration:** Live Delhivery / Shiprocket tracking webhook integration.
- **User Authentication:** Account sign-in and customer order history (currently session/localStorage based).

---

## 🎨 Design System & Brand Identity

The interface adheres strictly to SBG brand standards:
- **Obsidian Black (`#0A0A0A`)**: Ground and primary background surfaces.
- **Cool Studio Slate (`#16191D` to `#2D333A`)**: Showroom cyclorama and lighting gradients.
- **Royal Esports Purple (`#3D1A78`)**: Contrast brand accents and highlights.
- **Championship Gold (`#D4A017`)**: Badges, active selections, CTA borders.
- **Optic White (`#F8F9FA`)**: Crisp typography and light jersey fabric.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **3D / Graphics:** Three.js (WebGL canvas, custom geometry, perspective cameras, ambient & directional lighting)
- **Styling:** Vanilla CSS Modules with custom design tokens (`globals.css`)
- **State Management:** React Context API with `localStorage` persistence
- **Icons & UI:** Custom SVG icon set and responsive micro-animations
- **Linting & Code Quality:** ESLint with Next.js core web vitals config

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or Node.js 20+ LTS recommended
- npm 9+ or pnpm / yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<owner>/sbg-shop.git
   cd sbg-shop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for local dev):
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts local Next.js development server with hot-reload on port 3000 |
| `npm run build` | Builds optimized production bundle with full static prerender |
| `npm run start` | Runs production server after building |
| `npm run lint` | Runs ESLint across all TypeScript and React files |

---

## 📂 Repository Structure

```text
sbg-shop/
├── app/                       # Next.js App Router routes & layouts
│   ├── page.tsx               # 3D Virtual Showroom (Home)
│   ├── layout.tsx             # Root layout with Navbar, Banner, Footer
│   ├── products/              # Product catalogue & [id] detail page
│   ├── cart/                  # Shopping bag page
│   ├── checkout/              # Checkout form & success confirmation
│   ├── orders/                # Order tracking portal
│   ├── admin/                 # Store operations & inventory panel
│   └── (legal & info)/        # /about, /contact, /returns, /refund, etc.
├── components/                # Reusable UI & 3D components
│   ├── ShowroomScene.tsx      # Three.js 3D clothing rail showroom
│   ├── JerseyViewer3D.tsx     # 360° interactive product modal
│   ├── Navbar.tsx             # Header with bag counter
│   ├── Banner.tsx             # Announcement bar
│   └── Footer.tsx             # Brand footer and navigation
├── context/                   # Global React contexts
│   └── CartContext.tsx        # Persistent cart state & storage
├── lib/                       # Product catalogue data & business logic
│   └── products.ts            # Single source of truth for products & SKUs
├── public/                    # Static assets
│   └── images/jerseys/        # Transparent PNGs & jersey mockups
├── docs/                      # Architectural specs (PRD, FRD, NFR, ADR)
├── brain/                     # Project source of truth & changelog
├── .env.example               # Template environment configuration
├── .gitignore                 # Git ignore rules
└── package.json               # Dependencies and scripts
```

---

## 🛡️ Security & Integrity

- **No Secrets in Frontend:** All environment variables and sensitive configurations are isolated.
- **Client Trust Prevention:** Pricing calculations, inventory levels, and order totals are verified through deterministic server logic.
- **Asset Protection:** Authentic SBG emblems, eagle crest, and typography are protected brand assets preserved in original fidelity.

---

## 📄 License

Proprietary © SBG. All rights reserved.
