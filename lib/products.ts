/**
 * lib/products.ts
 * Single source of truth for approved SBG SHOP products
 *
 * Catalogue: 4 confirmed SKUs per DECISIONS.md #17 & owner specifications:
 *  1. SBG Studio Pro — Tagline Edition (White with "EVERY MOVE MATTERS")
 *  2. SBG Studio Pro — Clean Edition (White with clean back profile)
 *  3. SBG Signature Pro (Black with "EVERY MOVE MATTERS")
 *  4. SBG Stealth Classic (Black with clean back profile)
 */

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: "white" | "black";
  price: number;
  originalPrice?: number;
  tag: string;
  frontImage: string;
  backImage: string;
  alternateImage?: string;
  description: string;
  features: string[];
  specs: {
    material: string;
    fit: string;
    collar: string;
    weight: string;
    origin: string;
  };
  sizes: string[];
  stock: Record<string, number>;
}

export const PRODUCTS: Product[] = [
  {
    id: "sbg-wht-tagline",
    sku: "SBG-JSY-WHT-TAG",
    name: "SBG STUDIO PRO — TAGLINE",
    subtitle: "Championship White • Every Move Matters Edition",
    category: "white",
    price: 999,
    originalPrice: 1499,
    tag: "PRO WHITE",
    frontImage: "/images/jerseys/new_white_front_01.png",
    backImage: "/images/jerseys/new_white_back_tagline.png",
    alternateImage: "/images/jerseys/new_white_front_02.png",
    description:
      "Engineered for the competitive stage. The SBG Studio Pro Tagline Edition combines optic-white performance weave with royal purple and gold contrast ribbing, crowned with the official '# EVERY MOVE MATTERS' backprint.",
    features: [
      "Optic White Performance Fabric",
      "'EVERY MOVE MATTERS' Official Backprint",
      "CoolTouch™ Micro-Ventilation Mesh",
      "Purple & Gold Contrast Sleeve Ribs",
      "Official High-Density SBG Eagle Crest",
    ],
    specs: {
      material: "100% AeroDry™ Performance Poly-Mesh",
      fit: "Athletic Ergonomic Cut",
      collar: "Reinforced V-Neck Ribbing",
      weight: "165 GSM Ultra-Lightweight",
      origin: "Crafted in India",
    },
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL", "Free Size"],
    stock: { S: 18, M: 42, L: 55, XL: 30, XXL: 14, XXXL: 8, "Free Size": 25 },
  },
  {
    id: "sbg-wht-clean",
    sku: "SBG-JSY-WHT-CLN",
    name: "SBG STUDIO PRO — CLEAN",
    subtitle: "Championship White • Clean Studio Profile",
    category: "white",
    price: 999,
    originalPrice: 1499,
    tag: "WHITE CLASSIC",
    frontImage: "/images/jerseys/new_white_front_02.png",
    backImage: "/images/jerseys/new_white_back_tagline.png",
    alternateImage: "/images/jerseys/new_white_front_01.png",
    description:
      "The minimalist studio expression of our championship jersey. Features the full athletic performance architecture with a clean, unadorned back profile for sleek everyday esports style.",
    features: [
      "Optic White Performance Fabric",
      "Clean Minimalist Back Profile",
      "CoolTouch™ Micro-Ventilation Mesh",
      "Reinforced Flatlock Athletic Seams",
      "Official High-Density SBG Eagle Crest",
    ],
    specs: {
      material: "100% AeroDry™ Performance Poly-Mesh",
      fit: "Athletic Ergonomic Cut",
      collar: "Reinforced V-Neck Ribbing",
      weight: "165 GSM Ultra-Lightweight",
      origin: "Crafted in India",
    },
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL", "Free Size"],
    stock: { S: 12, M: 35, L: 48, XL: 22, XXL: 10, XXXL: 5, "Free Size": 20 },
  },
  {
    id: "sbg-sig-pro",
    sku: "SBG-JSY-BLK-EMM",
    name: "SBG SIGNATURE PRO",
    subtitle: "Official Esports Black • Every Move Matters Edition",
    category: "black",
    price: 999,
    originalPrice: 1499,
    tag: "SIGNATURE",
    frontImage: "/images/jerseys/new_black_front_main.png",
    backImage: "/images/jerseys/new_black_back_tagline.png",
    alternateImage: "/images/jerseys/new_black_front_alt.png",
    description:
      "The flagship SBG uniform. Worn by competitive athletes, featuring deep pitch-black body weave with vibrant royal purple side flanks, metallic gold accents, and the iconic 'SHADOW 07' backprint with '# EVERY MOVE MATTERS'.",
    features: [
      "AeroDry™ Poly-Mesh Weave",
      "'EVERY MOVE MATTERS' Official Backprint",
      "Ergonomic 4-Way Athletic Stretch",
      "High-Density Gold Eagle Crest",
      "Player 07 Esports Athletic Cut",
    ],
    specs: {
      material: "100% Moisture-Wicking Engineered Poly",
      fit: "Pro Competitive Fit",
      collar: "Anti-Chafing Ribbed V-Neck",
      weight: "170 GSM Performance Weave",
      origin: "Crafted in India",
    },
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL", "Free Size"],
    stock: { S: 24, M: 60, L: 75, XL: 40, XXL: 20, XXXL: 12, "Free Size": 30 },
  },
  {
    id: "sbg-stealth-cls",
    sku: "SBG-JSY-BLK-CLS",
    name: "SBG STEALTH CLASSIC",
    subtitle: "Minimalist Studio Black • Clean Back Profile",
    category: "black",
    price: 999,
    originalPrice: 1499,
    tag: "STEALTH",
    frontImage: "/images/jerseys/new_black_front_stealth.png",
    backImage: "/images/jerseys/new_black_back_tagline.png",
    alternateImage: "/images/jerseys/new_black_front_main.png",
    description:
      "Understated dominance. The Stealth Classic strips back typography for a pure, dark silhouette with contrast purple-gold flank accents and the SBG crest on the chest.",
    features: [
      "Matte Pitch-Black Fabric",
      "Clean Minimalist Back Profile",
      "Reinforced Flatlock Seams",
      "Anti-Chafing Collar Ribbing",
      "Subtle Left-Chest Eagle Shield",
    ],
    specs: {
      material: "100% Moisture-Wicking Engineered Poly",
      fit: "Regular Athletic Fit",
      collar: "Soft Touch Ribbed V-Neck",
      weight: "170 GSM Performance Weave",
      origin: "Crafted in India",
    },
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL", "Free Size"],
    stock: { S: 15, M: 30, L: 45, XL: 28, XXL: 15, XXXL: 6, "Free Size": 22 },
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
