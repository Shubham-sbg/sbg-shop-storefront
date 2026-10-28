import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "140px 24px 80px",
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
          maxWidth: "540px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: "var(--brand-gold)",
          }}
        >
          ERROR 404
        </span>

        <h1
          style={{
            fontSize: "42px",
            fontWeight: 900,
            letterSpacing: "0.04em",
            color: "var(--text-primary)",
            margin: "0",
          }}
        >
          LOST IN THE STUDIO
        </h1>

        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          The requested coordinate or showroom rail position does not exist. Return to the main showroom to view the active 2026 jersey lineup.
        </p>

        <div style={{ display: "flex", gap: "12px", marginTop: "12px", width: "100%" }}>
          <Link
            href="/"
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
            ENTER 3D SHOWROOM
          </Link>
          <Link
            href="/products"
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
            ALL JERSEYS
          </Link>
        </div>
      </div>
    </div>
  );
}
