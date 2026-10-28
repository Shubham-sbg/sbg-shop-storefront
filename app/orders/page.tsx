"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface OrderRecord {
  orderId: string;
  date: string;
  status: string;
  items: Array<{
    id: string;
    sku: string;
    name: string;
    size: string;
    price: number;
    quantity: number;
    frontImage: string;
  }>;
  total: number;
  customer: {
    fullName: string;
    email: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<OrderRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sbg_orders_history");
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const query = searchQuery.trim().toUpperCase();
    if (!query) return;

    const found = orders.find(
      (o) => o.orderId.toUpperCase() === query || o.customer.email.toUpperCase() === query
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      // Create a mock tracking result if order ID looks valid
      setSearchedOrder({
        orderId: query.startsWith("SBG-") ? query : `SBG-ORD-${query}`,
        date: "28 Oct 2026",
        status: "IN TRANSIT (DEMO)",
        items: [
          {
            id: "sbg-sig-pro",
            sku: "SBG-JSY-BLK-EMM",
            name: "SBG SIGNATURE PRO",
            size: "L",
            price: 999,
            quantity: 1,
            frontImage: "/images/jerseys/transparent/02_black_front_main.png",
          },
        ],
        total: 999,
        customer: {
          fullName: "Customer",
          email: searchQuery,
          city: "New Delhi",
          state: "Delhi",
          pincode: "110001",
        },
        paymentMethod: "Prepaid (Demo)",
      });
    }
  };

  const displayOrder = searchedOrder || (orders.length > 0 ? orders[0] : null);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        padding: "120px 24px 80px",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: "var(--brand-gold)",
          }}
        >
          FULFILLMENT &amp; LOGISTICS
        </span>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 900,
            letterSpacing: "0.04em",
            color: "var(--text-primary)",
            margin: "8px 0",
          }}
        >
          TRACK YOUR SBG ORDER
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
          Check real-time order status, courier dispatch, and estimated delivery dates across India.
        </p>
      </header>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: "10px",
          maxWidth: "600px",
          margin: "0 auto 48px",
        }}
      >
        <input
          type="text"
          placeholder="ENTER ORDER ID (e.g. SBG-ORD-2026) OR EMAIL"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            background: "rgba(22, 26, 31, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "8px",
            padding: "14px 18px",
            fontSize: "13px",
            color: "#fff",
            textTransform: "uppercase",
          }}
        />
        <button
          type="submit"
          style={{
            background: "var(--brand-gold)",
            color: "#0f1215",
            fontWeight: 800,
            fontSize: "12px",
            letterSpacing: "0.1em",
            padding: "0 24px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          TRACK
        </button>
      </form>

      {/* Display Order Status Card */}
      {displayOrder ? (
        <div
          style={{
            background: "rgba(22, 26, 31, 0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "36px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              paddingBottom: "18px",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", color: "var(--brand-gold)", fontWeight: 800, letterSpacing: "0.1em" }}>
                ORDER ID
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: 900, color: "var(--text-primary)", margin: "2px 0 0" }}>
                {displayOrder.orderId}
              </h2>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>
                DATE PLACED: {displayOrder.date}
              </span>
              <div
                style={{
                  background: "rgba(46, 204, 113, 0.15)",
                  color: "#2ecc71",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "4px 10px",
                  borderRadius: "4px",
                  display: "inline-block",
                  marginTop: "4px",
                }}
              >
                {displayOrder.status}
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div style={{ padding: "10px 0" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
                textAlign: "center",
                position: "relative",
              }}
            >
              {[
                { label: "ORDER PLACED", done: true, date: displayOrder.date },
                { label: "QUALITY CHECK", done: true, date: "Verified" },
                { label: "DISPATCHED", done: true, date: "BlueDart Express" },
                { label: "DELIVERY", done: false, date: "Est. 3–5 Days" },
              ].map((step, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: step.done ? "var(--brand-gold)" : "rgba(255, 255, 255, 0.08)",
                      color: step.done ? "#0f1215" : "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: "13px",
                    }}
                  >
                    {step.done ? "✓" : idx + 1}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: step.done ? "#fff" : "var(--text-muted)" }}>
                    {step.label}
                  </span>
                  <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
                    {step.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Items Summary */}
          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "20px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-muted)", marginBottom: "14px" }}>
              ITEMS IN THIS ORDER
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {displayOrder.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    background: "rgba(0, 0, 0, 0.25)",
                    padding: "12px 16px",
                    borderRadius: "8px",
                  }}
                >
                  <Image
                    src={item.frontImage}
                    alt={item.name}
                    width={48}
                    height={56}
                    style={{ objectFit: "contain" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: "14px", color: "var(--text-primary)" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                      Size: {item.size} • Qty: {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "14px", color: "var(--text-primary)" }}>
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "rgba(22, 26, 31, 0.5)",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
            {hasSearched
              ? "No orders found matching that reference ID. Please check the spelling or track with your email."
              : "No orders placed in this browser session yet. Place a demo order in checkout to test tracking!"}
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: "16px",
              color: "var(--brand-gold)",
              fontWeight: 800,
              fontSize: "12px",
              textDecoration: "underline",
            }}
          >
            ← GO TO 3D SHOWROOM
          </Link>
        </div>
      )}
    </div>
  );
}
