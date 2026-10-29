"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import styles from "./page.module.css";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | "white" | "black">("all");
  const [viewFlipped, setViewFlipped] = useState<Record<string, boolean>>({});

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  const toggleView = (id: string) => {
    setViewFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.collectionPage}>
      <header className={styles.headerBanner}>
        <span className={styles.kicker}>AUTUMN / WINTER 2026</span>
        <h1 className={styles.title}>SBG ATHLETIC COLLECTION</h1>
        <p className={styles.subtitle}>
          Engineered for esports performance. Authentic high-resolution mockups featuring official crests, Player 07 prints, and the &ldquo;EVERY MOVE MATTERS&rdquo; motto.
        </p>
      </header>

      {/* Filter Tabs */}
      <div className={styles.filterTabs} role="tablist" aria-label="Product categories">
        <button
          type="button"
          className={`${styles.tabBtn} ${activeCategory === "all" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveCategory("all")}
          role="tab"
          aria-selected={activeCategory === "all"}
        >
          ALL JERSEYS ({PRODUCTS.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeCategory === "white" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveCategory("white")}
          role="tab"
          aria-selected={activeCategory === "white"}
        >
          PRO WHITE (2)
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeCategory === "black" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveCategory("black")}
          role="tab"
          aria-selected={activeCategory === "black"}
        >
          PRO BLACK (2)
        </button>
      </div>

      {/* Product Grid */}
      <div className={styles.productGrid}>
        {filteredProducts.map((product) => {
          const isBack = !!viewFlipped[product.id];
          const currentImg = isBack ? product.backImage : product.frontImage;

          return (
            <article key={product.id} className={styles.productCard}>
              <div className={styles.imageContainer}>
                <span className={styles.tagBadge}>{product.tag}</span>

                <Image
                  src={currentImg}
                  alt={`${product.name} ${isBack ? "Back" : "Front"} View`}
                  width={280}
                  height={325}
                  className={styles.productImg}
                />

                <button
                  type="button"
                  className={styles.viewToggleBtn}
                  onClick={() => toggleView(product.id)}
                  aria-label={`Toggle front and back view for ${product.name}`}
                >
                  {isBack ? "SHOW FRONT" : "SHOW BACK"}
                </button>
              </div>

              <div className={styles.cardDetails}>
                <Link href={`/products/${product.id}`} className={styles.productName}>
                  {product.name}
                </Link>
                <p className={styles.productSubtitle}>{product.subtitle}</p>

                <div className={styles.priceRow}>
                  <span className={styles.currentPrice}>₹{product.price}</span>
                  {product.originalPrice && (
                    <span className={styles.originalPrice}>₹{product.originalPrice}</span>
                  )}
                  <span className={styles.discountBadge}>33% OFF</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <Link href={`/products/${product.id}`} className={styles.detailsBtn}>
                  VIEW DETAILS
                </Link>
                <Link href="/" className={styles.showroomBtn}>
                  3D SHOWROOM
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
