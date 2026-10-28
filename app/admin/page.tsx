"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS } from "@/lib/products";

interface StoredOrder {
  orderId: string;
  date: string;
  status: string;
  total: number;
  customer: {
    fullName: string;
    email: string;
    city: string;
  };
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "system">("orders");
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sbg_orders_history");
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        // Sample orders for initial demonstration
        setOrders([
          {
            orderId: "SBG-ORD-894120",
            date: "28 Oct 2026",
            status: "DISPATCHED",
            total: 1998,
            customer: { fullName: "Kavya Menon", email: "kavya@gmail.com", city: "Bengaluru" },
            items: [
              { name: "SBG STUDIO PRO — TAGLINE", size: "M", quantity: 1, price: 999 },
              { name: "SBG SIGNATURE PRO", size: "L", quantity: 1, price: 999 },
            ],
          },
          {
            orderId: "SBG-ORD-893012",
            date: "27 Oct 2026",
            status: "CONFIRMED",
            total: 999,
            customer: { fullName: "Rohan Varma", email: "rohan@outlook.com", city: "Mumbai" },
            items: [{ name: "SBG STEALTH CLASSIC", size: "XL", quantity: 1, price: 999 }],
          },
        ]);
      }
    } catch {
      // Ignore
    }
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        padding: "120px 24px 80px",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          paddingBottom: "24px",
          marginBottom: "32px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                background: "rgba(212, 160, 23, 0.15)",
                color: "var(--brand-gold)",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              ADMIN PANEL
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              STAGE GATE 8 • RESTRICTED SHELL
            </span>
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "0.04em",
              color: "var(--text-primary)",
              margin: "6px 0 0",
            }}
          >
            STORE OPERATIONS DASHBOARD
          </h1>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "10px 18px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            VIEW SHOWROOM →
          </Link>
        </div>
      </header>

      {/* Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "36px",
        }}
      >
        <div
          style={{
            background: "rgba(22, 26, 31, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>
            TOTAL TEST ORDERS
          </span>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)", margin: "4px 0" }}>
            {orders.length}
          </div>
          <span style={{ fontSize: "11px", color: "#2ecc71" }}>Live test order pipeline</span>
        </div>

        <div
          style={{
            background: "rgba(22, 26, 31, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>
            SIMULATED REVENUE
          </span>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--brand-gold)", margin: "4px 0" }}>
            ₹{totalRevenue}
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Demo transactions only</span>
        </div>

        <div
          style={{
            background: "rgba(22, 26, 31, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>
            ACTIVE SKUS
          </span>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)", margin: "4px 0" }}>
            {PRODUCTS.length}
          </div>
          <span style={{ fontSize: "11px", color: "var(--brand-gold)" }}>4 Approved Jersey Families</span>
        </div>

        <div
          style={{
            background: "rgba(22, 26, 31, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>
            3D SHOWROOM ENGINE
          </span>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#2ecc71", margin: "4px 0" }}>
            ONLINE
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Three.js WebGL active</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          style={{
            background: activeTab === "orders" ? "var(--brand-gold)" : "rgba(22, 26, 31, 0.7)",
            color: activeTab === "orders" ? "#0f1215" : "var(--text-secondary)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          ORDERS QUEUE ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("inventory")}
          style={{
            background: activeTab === "inventory" ? "var(--brand-gold)" : "rgba(22, 26, 31, 0.7)",
            color: activeTab === "inventory" ? "#0f1215" : "var(--text-secondary)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          INVENTORY &amp; SKUS ({PRODUCTS.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("system")}
          style={{
            background: activeTab === "system" ? "var(--brand-gold)" : "rgba(22, 26, 31, 0.7)",
            color: activeTab === "system" ? "#0f1215" : "var(--text-secondary)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          GATEWAY &amp; SYSTEM STATUS
        </button>
      </div>

      {/* Tab 1: Orders Queue */}
      {activeTab === "orders" && (
        <div
          style={{
            background: "rgba(22, 26, 31, 0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "24px",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "var(--brand-gold)" }}>
                <th style={{ padding: "12px" }}>Order ID</th>
                <th style={{ padding: "12px" }}>Date</th>
                <th style={{ padding: "12px" }}>Customer</th>
                <th style={{ padding: "12px" }}>Items</th>
                <th style={{ padding: "12px" }}>Total</th>
                <th style={{ padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--text-secondary)" }}>
              {orders.map((order, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <td style={{ padding: "12px", fontWeight: 800, color: "#fff" }}>{order.orderId}</td>
                  <td style={{ padding: "12px" }}>{order.date}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ color: "#fff", fontWeight: 700 }}>{order.customer.fullName}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{order.customer.city}</div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ fontSize: "11px" }}>
                        {item.quantity}x {item.name} ({item.size})
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: "12px", fontWeight: 800, color: "var(--brand-gold)" }}>₹{order.total}</td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        background: "rgba(46, 204, 113, 0.15)",
                        color: "#2ecc71",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 800,
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Inventory */}
      {activeTab === "inventory" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              style={{
                background: "rgba(22, 26, 31, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "20px 24px",
                display: "grid",
                gridTemplateColumns: "80px 1fr 2fr auto",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "90px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image src={prod.frontImage} alt={prod.name} width={70} height={80} style={{ objectFit: "contain" }} />
              </div>

              <div>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--brand-gold)" }}>{prod.sku}</span>
                <h3 style={{ margin: "2px 0 0", fontSize: "16px", fontWeight: 800, color: "#fff" }}>{prod.name}</h3>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>₹{prod.price}</span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {Object.entries(prod.stock).map(([size, count]) => (
                  <div
                    key={size}
                    style={{
                      background: "rgba(0, 0, 0, 0.35)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "11px",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)", marginRight: "4px" }}>{size}:</span>
                    <strong style={{ color: count > 10 ? "#2ecc71" : "#e67e22" }}>{count} pcs</strong>
                  </div>
                ))}
              </div>

              <div>
                <span
                  style={{
                    background: "rgba(46, 204, 113, 0.15)",
                    color: "#2ecc71",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  IN STOCK
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: System Status */}
      {activeTab === "system" && (
        <div
          style={{
            background: "rgba(22, 26, 31, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            lineHeight: 1.6,
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: 0 }}>
            INTEGRATION GATEWAY &amp; SYSTEM AUDIT
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ background: "rgba(0, 0, 0, 0.3)", padding: "16px", borderRadius: "8px" }}>
              <div style={{ fontWeight: 800, color: "var(--brand-gold)", marginBottom: "4px" }}>
                PAYMENT GATEWAY (DECISIONS.md #7 &amp; #11)
              </div>
              <div>Status: <strong>DEFERRED / TEST ONLY</strong></div>
              <div>Merchant Gateway: Pending owner provider selection</div>
              <div>Live Charges: Strictly blocked (no unauthorized processors)</div>
            </div>

            <div style={{ background: "rgba(0, 0, 0, 0.3)", padding: "16px", borderRadius: "8px" }}>
              <div style={{ fontWeight: 800, color: "#2ecc71", marginBottom: "4px" }}>
                3D SHOWROOM ENGINE
              </div>
              <div>Renderer: Three.js WebGL (PCF Shadow Map)</div>
              <div>Cyclorama: Light-grey architectural studio</div>
              <div>Assets: Transparent high-res PNG cutouts mapped on parametric shells</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
