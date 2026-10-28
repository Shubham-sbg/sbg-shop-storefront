import Link from "next/link";

export default function PrivacyPage() {
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
          DATA INTEGRITY &amp; PRIVACY
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
          PRIVACY POLICY
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
          Compliant with the Digital Personal Data Protection (DPDP) Act of India.
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
            1. Information We Collect
          </h2>
          <p style={{ margin: "0 0 8px" }}>
            When you visit SBG SHOP or place an order, we collect minimal personal data essential to process your transaction:
          </p>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li><strong>Identity &amp; Contact:</strong> Name, delivery address, email address, phone number.</li>
            <li><strong>Order Data:</strong> Selected jersey variants, sizes, transaction timestamps.</li>
            <li><strong>Technical Telemetry:</strong> Anonymized WebGL rendering performance, device category, and browser type to optimize 3D showroom framerates.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            2. Purpose of Processing
          </h2>
          <p style={{ margin: 0 }}>
            Your data is strictly utilized to fulfill merchandise delivery, provide order tracking updates via SMS/email, and verify size exchange eligibility. We never sell, rent, or trade your personal data to third-party advertising brokers.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            3. Payment Security &amp; Data Isolation
          </h2>
          <p style={{ margin: 0 }}>
            SBG SHOP never stores sensitive financial instruments, CVVs, or bank passwords. In demo mode, all payment triggers run on client simulators. When live payments launch, all checkout interactions will run over encrypted PCI-DSS Level 1 compliant tokenized gateway infrastructure.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            4. Your Data Rights &amp; Grievance Officer
          </h2>
          <p style={{ margin: "0 0 8px" }}>
            Under the DPDP Act, you possess the right to access, rectify, or request erasure of your personal details stored in our databases.
          </p>
          <p style={{ margin: 0 }}>
            For privacy requests or grievance escalation, contact our designated Data Protection Officer:<br />
            <strong>Grievance Officer:</strong> privacy@sbgshop.in<br />
            SBG Esports Pvt. Ltd., New Delhi, India.
          </p>
        </section>
      </div>
    </div>
  );
}
