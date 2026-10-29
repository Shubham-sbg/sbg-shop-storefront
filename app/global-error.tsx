"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#15181b", color: "#f2f5f8", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "20px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Something went wrong</h2>
          <p style={{ color: "#9aa5b1", marginBottom: "20px" }}>An unexpected error occurred.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "12px 24px",
              background: "#d4a017",
              color: "#0f1215",
              fontWeight: 800,
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            TRY AGAIN
          </button>
        </div>
      </body>
    </html>
  );
}
