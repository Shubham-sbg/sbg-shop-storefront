"use client";

import { use, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

function ProductDetailContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const product = getProductById(resolvedParams.id);

  const [activeImageKey, setActiveImageKey] = useState<"front" | "back" | "alt">("front");
  const [selectedSize, setSelectedSize] = useState<string>("L");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className={styles.pdpPage}>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>Product Not Found</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>
            The requested jersey does not exist in the official SBG catalogue.
          </p>
          <Link
            href="/products"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "12px 24px",
              background: "var(--brand-gold)",
              color: "#000",
              fontWeight: 800,
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            BACK TO COLLECTION
          </Link>
        </div>
      </div>
    );
  }

  const currentImage =
    activeImageKey === "front"
      ? product.frontImage
      : activeImageKey === "back"
      ? product.backImage
      : product.alternateImage || product.frontImage;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      size: selectedSize,
      frontImage: product.frontImage,
    });
    setToastMessage(`Added ${product.name} (${selectedSize}) to Bag!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className={styles.pdpPage}>
      {/* Breadcrumb nav */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/" className={styles.breadcrumbLink}>HOME</Link>
        <span>/</span>
        <Link href="/products" className={styles.breadcrumbLink}>JERSEYS</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>{product.name}</span>
      </nav>

      <div className={styles.pdpGrid}>
        {/* Left Column: Interactive Image Gallery */}
        <div className={styles.galleryCol}>
          <div className={styles.mainImageWrap}>
            <Image
              src={currentImage}
              alt={`${product.name} ${activeImageKey} view`}
              width={520}
              height={600}
              priority
              className={styles.mainImage}
            />
          </div>

          <div className={styles.thumbnailRow}>
            <button
              type="button"
              className={`${styles.thumbBtn} ${activeImageKey === "front" ? styles.thumbBtnActive : ""}`}
              onClick={() => setActiveImageKey("front")}
              aria-label="View front image"
            >
              <Image src={product.frontImage} alt="Front Thumbnail" width={70} height={80} className={styles.thumbImg} />
            </button>

            <button
              type="button"
              className={`${styles.thumbBtn} ${activeImageKey === "back" ? styles.thumbBtnActive : ""}`}
              onClick={() => setActiveImageKey("back")}
              aria-label="View back image"
            >
              <Image src={product.backImage} alt="Back Thumbnail" width={70} height={80} className={styles.thumbImg} />
            </button>

            {product.alternateImage && (
              <button
                type="button"
                className={`${styles.thumbBtn} ${activeImageKey === "alt" ? styles.thumbBtnActive : ""}`}
                onClick={() => setActiveImageKey("alt")}
                aria-label="View alternate angle"
              >
                <Image src={product.alternateImage} alt="Alternate Thumbnail" width={70} height={80} className={styles.thumbImg} />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Specifications & Purchasing */}
        <div className={styles.infoCol}>
          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>{product.tag}</span>
            <span className={styles.skuLabel}>SKU: {product.sku}</span>
          </div>

          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.subtitle}>{product.subtitle}</p>

          <div className={styles.priceBlock}>
            <span className={styles.price}>₹{product.price}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>₹{product.originalPrice}</span>
            )}
            <span className={styles.discountBadge}>33% OFF</span>
            <span className={styles.taxNote}>INCL. OF ALL TAXES</span>
          </div>

          {/* Size Selector */}
          <div className={styles.sizeSection}>
            <div className={styles.sizeHeader}>
              <span>SELECT SIZE (FIT: ATHLETIC)</span>
              <button
                type="button"
                className={styles.sizeGuideBtn}
                onClick={() => setSizeGuideOpen(true)}
              >
                SIZE GUIDE (INCHES) ↗
              </button>
            </div>

            <div className={styles.sizeGrid}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAddToCart}
            >
              ADD TO BAG • ₹{product.price}
            </button>

            <Link href="/" className={styles.showroomActionBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M2 12s3.6-8 10-8 10 8 10 8-3.6 8-10 8-10-8-10-8z" />
              </svg>
              <span>3D SHOWROOM</span>
            </Link>
          </div>

          {/* Description */}
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {product.description}
          </p>

          {/* Specifications Box */}
          <div className={styles.specsBox}>
            <span className={styles.sectionLabel}>GARMENT SPECIFICATIONS</span>
            <div className={styles.specRow}>
              <span>Material</span>
              <span className={styles.specValue}>{product.specs.material}</span>
            </div>
            <div className={styles.specRow}>
              <span>Fit Architecture</span>
              <span className={styles.specValue}>{product.specs.fit}</span>
            </div>
            <div className={styles.specRow}>
              <span>Collar Construction</span>
              <span className={styles.specValue}>{product.specs.collar}</span>
            </div>
            <div className={styles.specRow}>
              <span>Fabric Weight</span>
              <span className={styles.specValue}>{product.specs.weight}</span>
            </div>
            <div className={styles.specRow}>
              <span>Manufacturing</span>
              <span className={styles.specValue}>{product.specs.origin}</span>
            </div>
          </div>

          {/* Guarantees */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
            <div>🚚 <strong>Free Shipping:</strong> Express dispatch within 24-48 hrs across India.</div>
            <div>🔄 <strong>7-Day Returns:</strong> Hassle-free size exchange guarantee.</div>
            <div>🛡️ <strong>100% Authentic:</strong> Official SBG Esports garment with brand crest.</div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSizeGuideOpen(false)}
        >
          <div
            style={{
              background: "#161a1f",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "14px",
              padding: "28px",
              maxWidth: "500px",
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>SBG SIZING CHART (INCHES)</h3>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                style={{ background: "none", border: "none", color: "#fff", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--brand-gold)" }}>
                  <th style={{ padding: "8px" }}>Size</th>
                  <th style={{ padding: "8px" }}>Chest (in)</th>
                  <th style={{ padding: "8px" }}>Length (in)</th>
                  <th style={{ padding: "8px" }}>Shoulder (in)</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--text-secondary)" }}>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>S</td>
                  <td style={{ padding: "8px" }}>38&quot;</td>
                  <td style={{ padding: "8px" }}>27&quot;</td>
                  <td style={{ padding: "8px" }}>16.5&quot;</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>M</td>
                  <td style={{ padding: "8px" }}>40&quot;</td>
                  <td style={{ padding: "8px" }}>28&quot;</td>
                  <td style={{ padding: "8px" }}>17.5&quot;</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>L</td>
                  <td style={{ padding: "8px" }}>42&quot;</td>
                  <td style={{ padding: "8px" }}>29&quot;</td>
                  <td style={{ padding: "8px" }}>18.5&quot;</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>XL</td>
                  <td style={{ padding: "8px" }}>44&quot;</td>
                  <td style={{ padding: "8px" }}>30&quot;</td>
                  <td style={{ padding: "8px" }}>19.5&quot;</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>XXL</td>
                  <td style={{ padding: "8px" }}>46&quot;</td>
                  <td style={{ padding: "8px" }}>31&quot;</td>
                  <td style={{ padding: "8px" }}>20.5&quot;</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px", fontWeight: 700, color: "#fff" }}>Free Size</td>
                  <td style={{ padding: "8px" }}>42–44&quot;</td>
                  <td style={{ padding: "8px" }}>29.5&quot;</td>
                  <td style={{ padding: "8px" }}>18.5–19&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className={styles.toast} role="status">
          <span style={{ color: "var(--brand-gold)" }}>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage(props: PageProps) {
  return (
    <Suspense fallback={<div style={{ padding: "140px 24px", textAlign: "center" }}>Loading Jersey Details…</div>}>
      <ProductDetailContent {...props} />
    </Suspense>
  );
}
