import Link from "next/link";

export default function ReturnsPage() {
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
          HASSLE-FREE GUARANTEE
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
          RETURNS &amp; EXCHANGES POLICY
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
          Every athlete deserves a perfect fit. Here is our straightforward 7-day exchange and return policy.
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
            1. 7-Day Free Size Exchange Window
          </h2>
          <p style={{ margin: 0 }}>
            If your SBG jersey is slightly too snug or loose, we offer a complimentary size exchange within <strong>7 days</strong> of delivery. Our courier partner will pick up the original jersey from your doorstep and deliver the newly selected size at zero additional cost.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            2. Condition for Return &amp; Exchange Eligibility
          </h2>
          <p style={{ margin: "0 0 8px" }}>
            To ensure garment hygiene and high standards for all competitors, items must fulfill the following criteria:
          </p>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li>The jersey must be unwashed, unworn, and free from perfume, sweat, or makeup marks.</li>
            <li>Original tags and brand packaging must remain attached and intact.</li>
            <li>Customized jerseys with personal gamertags/names printed are eligible for exchange only in case of a manufacturing defect.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            3. How to Initiate an Exchange
          </h2>
          <p style={{ margin: "0 0 8px" }}>
            Starting an exchange takes less than 60 seconds:
          </p>
          <ol style={{ paddingLeft: "20px", margin: 0 }}>
            <li>Locate your Order ID from your confirmation email or <Link href="/orders" style={{ color: "var(--brand-gold)" }}>Track Order</Link> page.</li>
            <li>Head to our <Link href="/contact" style={{ color: "var(--brand-gold)" }}>Contact Support</Link> page and select &quot;Size Exchange Request&quot;.</li>
            <li>Specify your required size. Our operations team will schedule reverse pickup within 24 hours.</li>
          </ol>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            4. Defective or Damaged Shipments
          </h2>
          <p style={{ margin: 0 }}>
            Every SBG jersey passes a rigorous quality inspection before dispatch. In the rare event of transit damage or seam misprint, notify us within 48 hours of delivery with photos, and we will issue an immediate replacement or full refund.
          </p>
        </section>
      </div>
    </div>
  );
}
