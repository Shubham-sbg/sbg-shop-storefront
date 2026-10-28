import Link from "next/link";

export default function RefundPage() {
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
          TRANSPARENT COMMERCE
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
          REFUND &amp; CANCELLATION POLICY
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
          Clear, consumer-first guidelines on order cancellations and refund timelines.
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
            1. Order Cancellation Prior to Dispatch
          </h2>
          <p style={{ margin: 0 }}>
            You may cancel any unshipped order free of charge within <strong>12 hours</strong> of placing it. Once our fulfillment center hands over your shipment to BlueDart / Delhivery Express, cancellation is no longer possible and the order must be processed as a return after arrival.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            2. Refund Processing Timeframe
          </h2>
          <p style={{ margin: 0 }}>
            Once returned items arrive back at our New Delhi logistics center and pass quality inspection (typically 24–48 hours after delivery), refunds are credited back to the original source payment method within <strong>5 to 7 business days</strong>.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            3. Mode of Refund
          </h2>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li><strong>UPI &amp; NetBanking:</strong> Direct refund to the linked bank account or VPA.</li>
            <li><strong>Credit / Debit Cards:</strong> Refund credited directly to the issuing bank card statement.</li>
            <li><strong>Cash on Delivery (COD):</strong> Customers can choose between SBG store credit or an instant NEFT/IMPS bank transfer upon providing account details.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-gold)", margin: "0 0 8px" }}>
            4. Non-Refundable Scenarios
          </h2>
          <p style={{ margin: 0 }}>
            Items damaged due to customer misuse, items returned without original hangtags, or items returned beyond the 7-day delivery window are not eligible for a monetary refund. In such instances, the jersey will be returned to the customer.
          </p>
        </section>

        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "20px" }}>
          For any dispute or clarification, write to us at{" "}
          <strong style={{ color: "var(--brand-gold)" }}>support@sbgshop.in</strong> or review our{" "}
          <Link href="/terms" style={{ color: "var(--brand-gold)" }}>Terms of Service</Link>.
        </div>
      </div>
    </div>
  );
}
