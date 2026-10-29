"use client";

/**
 * SBG SHOP — Virtual Showroom Page
 *
 * Architecture:
 *  - Three.js ShowroomScene (full-screen canvas): renders a quiet light-grey
 *    minimalist studio with a horizontal metal clothing rail and hangers.
 *  - Three.js JerseyViewer3D (modal): real 360° interactive 3D product viewer.
 *  - Integrates with shared CartContext for real-time bag persistence.
 */

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useCallback, useMemo, Suspense } from "react";
import { PRODUCTS, Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";

// Dynamically import Three.js components — SSR disabled for WebGL
const ShowroomScene = dynamic(
  () => import("../components/Showroom3D/ShowroomScene"),
  { ssr: false }
);
const JerseyViewer3D = dynamic(
  () => import("../components/Showroom3D/JerseyViewer3D"),
  { ssr: false }
);

export default function ShowroomPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addToCart } = useCart();
  const activeProduct: Product = PRODUCTS[selectedIndex];

  const showroomProducts = useMemo(
    () =>
      PRODUCTS.map((p) => ({
        id: p.id,
        name: p.name,
        tag: p.tag,
        price: p.price,
        frontImage: p.frontImage,
        backImage: p.backImage,
      })),
    []
  );

  const handleSelectProduct = useCallback((index: number) => {
    setSelectedIndex(index);
    setViewerOpen(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setViewerOpen(false);
  }, []);

  const handleAddToCart = useCallback(
    (size: string) => {
      addToCart({
        id: activeProduct.id,
        sku: activeProduct.sku,
        name: activeProduct.name,
        price: activeProduct.price,
        size,
        frontImage: activeProduct.frontImage,
      });
      setToastMessage(`Added ${activeProduct.name} (${size}) to Bag`);
      setTimeout(() => setToastMessage(null), 3000);
    },
    [activeProduct, addToCart]
  );

  const handlePrev = useCallback(() => {
    setSelectedIndex((i) => (i > 0 ? i - 1 : PRODUCTS.length - 1));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((i) => (i < PRODUCTS.length - 1 ? i + 1 : 0));
  }, []);

  return (
    <main className={styles.showroomRoot}>
      <Suspense
        fallback={
          <div className={styles.loadingScreen}>
            <span className={styles.loadingDot} />
            Loading Showroom…
          </div>
        }
      >
        {/* ── Three.js Virtual Clothing Showroom Canvas ── */}
        {!viewerOpen && (
          <div className={styles.sceneWrap}>
            <ShowroomScene
              products={showroomProducts}
              selectedIndex={selectedIndex}
              onSelectProduct={handleSelectProduct}
            />

            {/* Bottom Studio HUD Bar */}
            <div className={styles.studioHUD}>
              {/* Collection Navigation */}
              <div className={styles.hudNav}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={handlePrev}
                  aria-label="Previous jersey"
                >
                  ← PREV
                </button>
                <span className={styles.hudCounter}>
                  {selectedIndex + 1} / {PRODUCTS.length}
                </span>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={handleNext}
                  aria-label="Next jersey"
                >
                  NEXT →
                </button>
              </div>

              {/* Active Product Info */}
              <div className={styles.hudProductTag}>
                <span className={styles.hudTagBadge}>{activeProduct.tag}</span>
                <span className={styles.hudTagName}>{activeProduct.name}</span>
                <span className={styles.hudTagPrice}>₹{activeProduct.price}</span>
              </div>

              {/* 360° Inspect & PDP Links */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  type="button"
                  className={styles.hudInspectBtn}
                  onClick={() => setViewerOpen(true)}
                  aria-label={`Inspect ${activeProduct.name} in 360° viewer`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M2 12s3.6-8 10-8 10 8 10 8-3.6 8-10 8-10-8-10-8z" />
                  </svg>
                  360° INSPECT
                </button>

                <Link
                  href={`/products/${activeProduct.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "9999px",
                    padding: "10px 16px",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    color: "#fff",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                  aria-label={`View details of ${activeProduct.name}`}
                >
                  DETAILS →
                </Link>
              </div>
            </div>

            {/* Subtle drag hint banner */}
            <div className={styles.dragHintBanner} aria-hidden="true">
              ← Drag horizontally to slide rail • Click garment to inspect 360° →
            </div>
          </div>
        )}

        {/* ── 360° Jersey Viewer Modal ── */}
        {viewerOpen && (
          <JerseyViewer3D
            product={{
              id: activeProduct.id,
              sku: activeProduct.sku,
              name: activeProduct.name,
              subtitle: activeProduct.subtitle,
              price: activeProduct.price,
              tag: activeProduct.tag,
              frontImage: activeProduct.frontImage,
              backImage: activeProduct.backImage,
              features: [...activeProduct.features],
            }}
            onClose={handleCloseViewer}
            onAddToCart={handleAddToCart}
          />
        )}
      </Suspense>

      {/* Toast notification */}
      {toastMessage && (
        <div className={styles.toast} role="status" aria-live="polite">
          <span className={styles.toastDot} />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
