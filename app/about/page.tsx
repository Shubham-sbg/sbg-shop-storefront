import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        padding: "120px 24px 80px",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "48px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: "var(--brand-gold)",
          }}
        >
          OUR PHILOSOPHY &amp; HERITAGE
        </span>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 900,
            letterSpacing: "0.04em",
            color: "var(--text-primary)",
            margin: "10px 0 16px",
          }}
        >
          ABOUT SBG ESPORTS
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--text-secondary)",
            maxWidth: "640px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Born from competitive fire. Built on the conviction that every split-second decision counts.
          At SBG, we craft athletic uniforms engineered for precision, focus, and victory.
        </p>
      </header>

      {/* Quote Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(61, 26, 120, 0.3) 0%, rgba(212, 160, 23, 0.15) 100%)",
          border: "1px solid rgba(212, 160, 23, 0.3)",
          borderRadius: "16px",
          padding: "36px",
          textAlign: "center",
          marginBottom: "48px",
        }}
      >
        <span style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "0.06em", color: "#fff", display: "block" }}>
          &ldquo;# EVERY MOVE MATTERS&rdquo;
        </span>
        <span style={{ fontSize: "12px", color: "var(--brand-gold)", fontWeight: 800, letterSpacing: "0.14em", marginTop: "8px", display: "block" }}>
          THE OFFICIAL SBG MOTTO
        </span>
      </div>

      {/* Content Pillars */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        <div
          style={{
            background: "rgba(22, 26, 31, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "28px",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "12px" }}>🦅</div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            The Golden Eagle Shield
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Our crest symbolizes high-altitude vision, tactical poise, and unwavering determination. Worn with pride by players and community members worldwide.
          </p>
        </div>

        <div
          style={{
            background: "rgba(22, 26, 31, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "28px",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "12px" }}>⚡</div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            AeroDry™ Engineering
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            We developed a proprietary micro-mesh poly weave that wicks sweat instantly, prevents heat buildup, and flexes naturally with competitive reflex movements.
          </p>
        </div>

        <div
          style={{
            background: "rgba(22, 26, 31, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "28px",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "12px" }}>🇮🇳</div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            Crafted in India
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Designed, tested, and tailored with top textile artisans in India. Premium sublimation printing guarantees zero fading, cracking, or peeling after washes.
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #d4a017 0%, #b8860b 100%)",
            color: "#0f1215",
            fontWeight: 800,
            fontSize: "12px",
            letterSpacing: "0.12em",
            padding: "14px 28px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          EXPLORE 3D VIRTUAL SHOWROOM →
        </Link>
      </div>
    </div>
  );
}
