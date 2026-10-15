"use client";

/**
 * Last-resort boundary for crashes in the root layout. It replaces the whole document,
 * so it carries its own <html>/<body> and inline styles (no providers, fonts or CSS are
 * guaranteed to be available here). Copy is bilingual because the locale may be unknown.
 */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0b1422",
          color: "#eef1f7",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Tahoma, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <main>
          <p style={{ color: "#d8b968", fontSize: 12, letterSpacing: "0.2em", margin: 0 }}>COMPASS</p>
          <h1 style={{ fontSize: 28, margin: "16px 0 8px" }}>حدث خطأ غير متوقع</h1>
          <p lang="en" dir="ltr" style={{ color: "#8a93a6", margin: 0 }}>
            Something went wrong.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 28,
              background: "#c29433",
              color: "#141924",
              border: 0,
              borderRadius: 12,
              padding: "12px 28px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            إعادة المحاولة · Try again
          </button>
        </main>
      </body>
    </html>
  );
}
