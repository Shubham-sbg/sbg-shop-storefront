"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "SBG-ORD-2026-DEMO";
  const email = searchParams.get("email") || "your registered email";

  return (
    <div
      style={{
        minHeight: "calc(100vh - 100px)",
        padding: "140px 24px 80px",
        maxWidth: "680px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "rgba(22, 26, 31, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "48px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "rgba(46, 204, 113, 0.15)",
            border: "1px solid #2ecc71",
            color: "#2ecc71",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
          }}
        >
          ✓
        </div>

        <span
          style={{
            background: "rgba(212, 160, 23, 0.15)",
            color: "var(--brand-gold)",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            padding: "4px 12px",
            borderRadius: "9999px",
          }}
        >
          TEST MODE SIMULATION
        </span>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 900,
            letterSpacing: "0.04em",
            color: "var(--text-primary)",
            margin: "0",
          }}
        >
          ORDER CONFIRMED
        </h1>

        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          Thank you for exploring SBG SHOP! A test order confirmation has been logged for{" "}
          <strong style={{ color: "var(--brand-gold)" }}>{email}</strong>.
        </p>

        <div
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "10px",
            padding: "16px 24px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>ORDER REFERENCE</span>
          <span style={{ fontSize: "15px", color: "var(--brand-gold)", fontWeight: 900, letterSpacing: "0.08em" }}>
            {orderId}
          </span>
        </div>

        <div
          style={{
            textAlign: "left",
            width: "100%",
            fontSize: "12px",
            color: "var(--text-secondary)",
            background: "rgba(255, 255, 255, 0.02)",
            borderRadius: "8px",
            padding: "16px",
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
            WHAT HAPPENS NEXT?
          </div>
          <div>• Dispatch: Simulated fulfillment queue within 24 hours.</div>
          <div>• Delivery: Estimated 3–5 business days across India.</div>
          <div>• Support: 7-day size exchange guarantee on all SBG jerseys.</div>
        </div>

        <div style={{ display: "flex", gap: "14px", width: "100%", marginTop: "12px" }}>
          <Link
            href="/orders"
            style={{
              flex: 1,
              background: "var(--brand-gold)",
              color: "#0f1215",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.1em",
              padding: "14px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            TRACK ORDER →
          </Link>
          <Link
            href="/"
            style={{
              flex: 1,
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.1em",
              padding: "14px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            BACK TO SHOWROOM
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: "140px 20px", textAlign: "center" }}>Loading Order Details…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
