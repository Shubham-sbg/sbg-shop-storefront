"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Delhi",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod">("upi");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);

    // Generate random realistic test order ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `SBG-ORD-${randomNum}`;

    // Store in localStorage for Order Tracking demo
    try {
      const existingOrders = JSON.parse(localStorage.getItem("sbg_orders_history") || "[]");
      const newOrder = {
        orderId,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: "CONFIRMED (DEMO)",
        items: [...items],
        total: subtotal,
        customer: { ...formData },
        paymentMethod: paymentMethod === "upi" ? "UPI (Demo Adapter)" : "Cash on Delivery (Demo)",
      };
      localStorage.setItem("sbg_orders_history", JSON.stringify([newOrder, ...existingOrders]));
    } catch {
      // Ignore localStorage errors
    }

    setTimeout(() => {
      clearCart();
      router.push(`/checkout/success?orderId=${orderId}&email=${encodeURIComponent(formData.email)}`);
    }, 800);
  };

  if (items.length === 0) {
    return (
      <div className={styles.checkoutPage}>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>No items to checkout</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>
            Your bag is empty. Please add a jersey from the showroom first.
          </p>
          <Link
            href="/"
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
            RETURN TO SHOWROOM
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.bannerNotice}>
        <span className={styles.badge}>DEMO MODE</span>
        <span>
          <strong>Test Checkout Shell:</strong> No live payment gateway is active. Placing an order simulates the full order lifecycle without any financial charge.
        </span>
      </div>

      <form onSubmit={handlePlaceOrder} className={styles.checkoutGrid}>
        {/* Left: Input sections */}
        <div className={styles.formSection}>
          {/* Step 1: Contact & Shipping */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.stepNum}>1</span>
              <span>SHIPPING &amp; CONTACT DETAILS</span>
            </h2>

            <div className={styles.inputGrid}>
              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label className={styles.fieldLabel} htmlFor="fullName">FULL NAME *</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="e.g. Arjun Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="email">EMAIL ADDRESS *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="arjun@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="phone">MOBILE NUMBER *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>

              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label className={styles.fieldLabel} htmlFor="address">DELIVERY ADDRESS *</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  placeholder="Flat / House No., Apartment, Street"
                  value={formData.address}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="city">CITY *</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  placeholder="e.g. New Delhi"
                  value={formData.city}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="pincode">PIN CODE *</label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  required
                  placeholder="e.g. 110001"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
            </div>
          </section>

          {/* Step 2: Payment Method */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.stepNum}>2</span>
              <span>PAYMENT METHOD (DEMO TEST ADAPTER)</span>
            </h2>

            <div className={styles.paymentOptions}>
              <label
                className={`${styles.paymentCard} ${paymentMethod === "upi" ? styles.paymentCardSelected : ""}`}
                onClick={() => setPaymentMethod("upi")}
              >
                <div className={styles.paymentLeft}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                  />
                  <span>UPI / NetBanking / Cards</span>
                </div>
                <span className={styles.testBadge}>TEST SIMULATOR</span>
              </label>

              <label
                className={`${styles.paymentCard} ${paymentMethod === "cod" ? styles.paymentCardSelected : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className={styles.paymentLeft}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span>Cash on Delivery</span>
                </div>
                <span className={styles.testBadge}>VERIFIED COD</span>
              </label>
            </div>
          </section>
        </div>

        {/* Right: Order Summary Sidebar */}
        <aside className={styles.orderSidebar}>
          <h2 className={styles.sidebarTitle}>ORDER ITEMS ({items.length})</h2>

          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className={styles.itemRow}>
                <Image
                  src={item.frontImage}
                  alt={item.name}
                  width={44}
                  height={52}
                  className={styles.itemThumb}
                />
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemSize}>Size: {item.size} • Qty: {item.quantity}</span>
                </div>
                <span className={styles.itemPrice}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Standard Express Shipping</span>
              <span style={{ color: "#2ecc71", fontWeight: 800 }}>FREE</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>All Taxes (GST 12%)</span>
              <span>INCLUDED</span>
            </div>

            <div className={styles.totalFinal}>
              <span>Order Total</span>
              <span>₹{subtotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={styles.placeOrderBtn}
          >
            {submitting ? "PLACING TEST ORDER…" : `CONFIRM ORDER (₹${subtotal})`}
          </button>

          <p style={{ fontSize: "10px", color: "var(--text-muted)", lineHeight: 1.5, textAlign: "center" }}>
            * This is a non-production test shell per project brief. You will not be charged.
          </p>
        </aside>
      </form>
    </div>
  );
}
