import Link from "next/link";

export default function TermsPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        padding: "120px 24px 80px",
        maxWidth: "860px",
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
          LEGAL FRAMEWORK
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
          TERMS OF SERVICE
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
          Last updated: October 2026 • Governing laws of India
        </p>
      </header>

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
          lineHeight: 1.7,
          fontSize: "14px",
          color: "var(--text-secondary)",
        }}
      >
        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ margin: 0 }}>
            By accessing or purchasing from SBG SHOP (accessible at sbgshop.in), you acknowledge and agree to comply with these Terms of Service. If you do not agree to these terms, please refrain from using our online showroom.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            2. Intellectual Property &amp; Trademarks
          </h2>
          <p style={{ margin: 0 }}>
            All trademarks, logos, the SBG Eagle Crest, &quot;# EVERY MOVE MATTERS&quot; wordmark, garment pattern graphics, 3D showroom models, and visual assets displayed on this site are the exclusive intellectual property of SBG Esports Pvt. Ltd. Unauthorized reproduction, modification, or reselling is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            3. Pricing &amp; Order Acceptance
          </h2>
          <p style={{ margin: 0 }}>
            All prices listed on SBG SHOP are in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST 12%). We reserve the right to correct accidental pricing discrepancies or cancel orders originating from technical glitches, with immediate full refund.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            4. Virtual Showroom &amp; 3D Render Disclaimers
          </h2>
          <p style={{ margin: 0 }}>
            Our 3D virtual showroom and 360° product viewer provide high-fidelity parametric simulations of the garments. While fabric colors, prints, and crests are engineered to match physical production with utmost precision, slight variations may occur depending on screen calibration and display color gamut.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            5. Governing Law &amp; Jurisdiction
          </h2>
          <p style={{ margin: 0 }}>
            These terms and any disputes arising out of the purchase of SBG products shall be governed exclusively by the laws of the Republic of India, subject to the jurisdiction of the competent courts in New Delhi.
          </p>
        </section>
      </div>
    </div>
  );
}
