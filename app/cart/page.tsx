"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalCount, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  const handleApplyPromo = () => {
    setPromoError(null);
    setPromoSuccess(null);
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === "SBG10") {
      setDiscountPercent(10);
      setPromoSuccess("Demo code 'SBG10' applied: 10% discount!");
    } else {
      setPromoError("Invalid promo code. Try 'SBG10' for demo discount.");
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;

  if (items.length === 0) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <h1 className={styles.emptyTitle}>Your Bag is Empty</h1>
          <p className={styles.emptyText}>
            You haven&apos;t added any jerseys to your bag yet. Explore our 3D Showroom to experience the collection hanging on the architectural rail.
          </p>
          <div className={styles.emptyActions}>
            <Link href="/" className={styles.primaryBtn}>
              ENTER 3D SHOWROOM
            </Link>
            <Link href="/products" className={styles.secondaryBtn}>
              VIEW ALL JERSEYS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>YOUR SHOPPING BAG</h1>
        <span className={styles.itemCountBadge}>
          {totalCount} {totalCount === 1 ? "ITEM" : "ITEMS"}
        </span>
      </div>

      <div className={styles.cartGrid}>
        {/* Item List */}
        <div className={styles.itemList}>
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className={styles.itemCard}>
              <div className={styles.imageWrap}>
                <Image
                  src={item.frontImage}
                  alt={item.name}
                  width={100}
                  height={115}
                  className={styles.itemImg}
                />
              </div>

              <div className={styles.itemDetails}>
                <span className={styles.itemSku}>{item.sku}</span>
                <Link href={`/products/${item.id}`} className={styles.itemName}>
                  {item.name}
                </Link>

                <div className={styles.itemMetaRow}>
                  <span>Size: <strong className={styles.sizeBadge}>{item.size}</strong></span>
                  <span>Unit: ₹{item.price}</span>
                </div>

                <div className={styles.qtyControls}>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className={styles.qtyVal}>{item.quantity}</span>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.itemRight}>
                <span className={styles.itemPrice}>₹{item.price * item.quantity}</span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id, item.size)}
                  aria-label={`Remove ${item.name}`}
                >
                  Remove ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <aside className={styles.summaryBox}>
          <h2 className={styles.summaryTitle}>ORDER SUMMARY</h2>

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Subtotal ({totalCount} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Estimated Delivery</span>
              <span className={styles.freeTag}>FREE</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Taxes (GST 12%)</span>
              <span>INCLUDED</span>
            </div>

            {discountAmount > 0 && (
              <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                <span>Promo Discount ({discountPercent}%)</span>
                <span>−₹{discountAmount}</span>
              </div>
            )}

            <div className={styles.totalRow}>
              <span>Total Amount</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          {/* Promo code input */}
          <div className={styles.promoWrap}>
            <input
              type="text"
              placeholder="PROMO CODE (TRY 'SBG10')"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className={styles.promoInput}
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className={styles.promoBtn}
            >
              APPLY
            </button>
          </div>
          {promoError && <p style={{ color: "#ff6b6b", fontSize: "11px", margin: "-10px 0 0" }}>{promoError}</p>}
          {promoSuccess && <p style={{ color: "#2ecc71", fontSize: "11px", margin: "-10px 0 0" }}>{promoSuccess}</p>}

          <Link href="/checkout" className={styles.checkoutBtn}>
            PROCEED TO CHECKOUT →
          </Link>

          <div className={styles.guaranteeList}>
            <div className={styles.guaranteeItem}>
              <span>🛡️</span>
              <span>Official SBG Esports Merchandise</span>
            </div>
            <div className={styles.guaranteeItem}>
              <span>📦</span>
              <span>Dispatched within 24-48 hours across India</span>
            </div>
            <div className={styles.guaranteeItem}>
              <span>↺</span>
              <span>7-Day Hassle-Free Size Exchange</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
