"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    subject: "Order Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            letterSpacing: "0.2em",
            color: "var(--brand-gold)",
          }}
        >
          CUSTOMER CARE &amp; COMMUNITY
        </span>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 900,
            letterSpacing: "0.04em",
            color: "var(--text-primary)",
            margin: "8px 0 12px",
          }}
        >
          CONTACT SBG SUPPORT
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
          Have a question regarding sizes, custom clan orders, or shipment tracking? We&apos;re here to help.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: "40px",
          alignItems: "start",
        }}
      >
        {/* Contact Info Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              background: "rgba(22, 26, 31, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
              EMAIL SUPPORT
            </h3>
            <p style={{ margin: 0, fontSize: "15px", color: "#fff", fontWeight: 700 }}>
              support@sbgshop.in
            </p>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
              Response guaranteed within 24 hours.
            </span>
          </div>

          <div
            style={{
              background: "rgba(22, 26, 31, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
              HEADQUARTERS
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              SBG Esports Pvt. Ltd.<br />
              Connaught Place, New Delhi 110001<br />
              India
            </p>
          </div>

          <div
            style={{
              background: "rgba(22, 26, 31, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
              COMMUNITY &amp; DISCORD
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Join our official gaming server for tournament announcements and product drop sneak peeks.
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div
          style={{
            background: "rgba(22, 26, 31, 0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 10px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(46, 204, 113, 0.15)",
                  color: "#2ecc71",
                  fontSize: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                ✓
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
                Message Dispatched
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 20px" }}>
                Thank you, {formData.name}. Our athlete support team will review your ticket and reply to{" "}
                <strong style={{ color: "var(--brand-gold)" }}>{formData.email}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                SEND US A MESSAGE
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    background: "rgba(0, 0, 0, 0.35)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "13px",
                    color: "#fff",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    background: "rgba(0, 0, 0, 0.35)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "13px",
                    color: "#fff",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                  ORDER ID (OPTIONAL)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SBG-ORD-2026"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  style={{
                    background: "rgba(0, 0, 0, 0.35)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "13px",
                    color: "#fff",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                  INQUIRY SUBJECT
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    background: "#161a1f",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "13px",
                    color: "#fff",
                  }}
                >
                  <option value="Order Inquiry">Order Inquiry &amp; Tracking</option>
                  <option value="Size Exchange">Size Exchange Request</option>
                  <option value="Custom Jersey / Team Bulk">Custom Jersey / Team Bulk</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                  MESSAGE *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    background: "rgba(0, 0, 0, 0.35)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "13px",
                    color: "#fff",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "var(--brand-gold)",
                  color: "#0f1215",
                  fontWeight: 800,
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  padding: "14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "6px",
                }}
              >
                SUBMIT INQUIRY →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
