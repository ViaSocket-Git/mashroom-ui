"use client";

export const runtime = "edge";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { setInCookies } from "@/lib/utils/cookies";
import WithAuth from "@/app/components/WithAuth";

const REFERENCE_ID = process.env.NEXT_PUBLIC_REFERENCE_ID!;

function MushroomSVG({ size = 40, opacity = 0.1 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ opacity }}>
      <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill="currentColor" />
      <path d="M4 38C4 40 6 42 10 42H54C58 42 60 40 60 38H4Z" fill="currentColor" opacity="0.7" />
      <path d="M24 42H40V56C40 58.2 38.2 60 36 60H28C25.8 60 24 58.2 24 56V42Z" fill="currentColor" />
      <circle cx="18" cy="26" r="2.5" fill="white" opacity={0.6} />
      <circle cx="32" cy="16" r="2.5" fill="white" opacity={0.6} />
      <circle cx="46" cy="26" r="2.5" fill="white" opacity={0.6} />
    </svg>
  );
}

const MUSHROOMS = [
  { size: 80,  top: "5%",   left: "4%",   delay: "0s",    duration: "7s",  opacity: 0.08, rotate: -15 },
  { size: 48,  top: "12%",  left: "18%",  delay: "1.2s",  duration: "9s",  opacity: 0.06, rotate: 10  },
  { size: 110, top: "3%",   left: "78%",  delay: "0.5s",  duration: "8s",  opacity: 0.07, rotate: 20  },
  { size: 60,  top: "18%",  left: "90%",  delay: "2s",    duration: "6s",  opacity: 0.09, rotate: -5  },
  { size: 36,  top: "38%",  left: "2%",   delay: "0.8s",  duration: "10s", opacity: 0.05, rotate: 8   },
  { size: 90,  top: "55%",  left: "8%",   delay: "1.5s",  duration: "7.5s",opacity: 0.08, rotate: -20 },
  { size: 44,  top: "70%",  left: "20%",  delay: "3s",    duration: "8.5s",opacity: 0.06, rotate: 15  },
  { size: 70,  top: "80%",  left: "5%",   delay: "0.3s",  duration: "9.5s",opacity: 0.07, rotate: -10 },
  { size: 55,  top: "88%",  left: "35%",  delay: "1.8s",  duration: "7s",  opacity: 0.05, rotate: 5   },
  { size: 100, top: "75%",  left: "82%",  delay: "0.7s",  duration: "8s",  opacity: 0.08, rotate: -12 },
  { size: 42,  top: "60%",  left: "94%",  delay: "2.2s",  duration: "6.5s",opacity: 0.06, rotate: 18  },
  { size: 65,  top: "90%",  left: "70%",  delay: "1s",    duration: "9s",  opacity: 0.07, rotate: -8  },
  { size: 38,  top: "45%",  left: "85%",  delay: "2.8s",  duration: "7.5s",opacity: 0.05, rotate: 12  },
  { size: 52,  top: "30%",  left: "96%",  delay: "0.4s",  duration: "8.5s",opacity: 0.07, rotate: -18 },
  { size: 78,  top: "48%",  left: "50%",  delay: "3.5s",  duration: "11s", opacity: 0.04, rotate: 6   },
];

function FloatingMushrooms() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {MUSHROOMS.map((m, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: m.top,
            left: m.left,
            transform: `rotate(${m.rotate}deg)`,
            animation: `floatUp ${m.duration} ease-in-out infinite`,
            animationDelay: m.delay,
          }}
        >
          <MushroomSVG size={m.size} opacity={m.opacity} />
        </div>
      ))}
    </div>
  );
}

function LoginPageInner({ loading }: { loading: boolean }) {
  const urlParams = useSearchParams();

  const utmSource = urlParams.get("utm_source");
  const utmMedium = urlParams.get("utm_medium");
  const utmCampaign = urlParams.get("utm_campaign");
  const utmTerm = urlParams.get("utm_term");
  const utmContent = urlParams.get("utm_content");

  useEffect(() => {
    if (utmSource) setInCookies("utm_source", utmSource);
    if (utmMedium) setInCookies("utm_medium", utmMedium);
    if (utmCampaign) setInCookies("utm_campaign", utmCampaign);
    if (utmTerm) setInCookies("utm_term", utmTerm);
    if (utmContent) setInCookies("utm_content", utmContent);
  }, [utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <FloatingMushrooms />
        <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, border: "3px solid hsl(var(--border))", borderTopColor: "hsl(var(--foreground))", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          <span className="text-muted-foreground text-[13px]" style={{ fontFamily: "Geist, sans-serif" }}>Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background"
    >
      <FloatingMushrooms />

      {/* Glow blobs */}
      <div style={{ position: "fixed", top: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, var(--shadow) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, var(--shadow-light) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      {/* Top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
            <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill="currentColor" />
            <path d="M4 38C4 40 6 42 10 42H54C58 42 60 40 60 38H4Z" fill="currentColor" opacity="0.7" />
            <path d="M24 42H40V56C40 58.2 38.2 60 36 60H28C25.8 60 24 58.2 24 56V42Z" fill="currentColor" />
            <circle cx="18" cy="26" r="2" fill="white" opacity="0.7" />
            <circle cx="32" cy="16" r="2" fill="white" opacity="0.7" />
            <circle cx="46" cy="26" r="2" fill="white" opacity="0.7" />
          </svg>
          <span className="text-foreground font-bold text-[17px] tracking-[-0.02em]" style={{ fontFamily: "Geist, sans-serif" }}>Mashroom</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 999, padding: "6px 14px" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", animation: "pulse 2s ease-in-out infinite" }} />
          <span className="text-muted-foreground font-semibold text-[11px] tracking-[0.06em]" style={{ fontFamily: "Geist, sans-serif" }}>SECURE LOGIN</span>
        </div>
      </div>

      {/* Main card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
          margin: "0 16px",
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 20,
          boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
          padding: "44px 40px 36px",
          animation: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Card corner accents */}
        <div style={{ position: "absolute", top: -1, left: -1, width: 24, height: 24, borderTop: "2px solid rgba(0,0,0,0.15)", borderLeft: "2px solid rgba(0,0,0,0.15)", borderRadius: "20px 0 0 0" }} />
        <div style={{ position: "absolute", bottom: -1, right: -1, width: 24, height: 24, borderBottom: "2px solid rgba(0,0,0,0.15)", borderRight: "2px solid rgba(0,0,0,0.15)", borderRadius: "0 0 20px 0" }} />

        {/* Logo + heading */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
                <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill="currentColor" />
                <path d="M4 38C4 40 6 42 10 42H54C58 42 60 40 60 38H4Z" fill="currentColor" opacity="0.7" />
                <path d="M24 42H40V56C40 58.2 38.2 60 36 60H28C25.8 60 24 58.2 24 56V42Z" fill="currentColor" />
                <circle cx="18" cy="26" r="2" fill="white" opacity="0.7" />
                <circle cx="32" cy="16" r="2" fill="white" opacity="0.7" />
                <circle cx="46" cy="26" r="2" fill="white" opacity="0.7" />
              </svg>
            </div>
          </div>
          <h1 className="text-foreground font-extrabold text-[26px] m-0 tracking-[-0.03em]" style={{ fontFamily: "Geist, sans-serif" }}>Welcome back</h1>
          <p className="text-muted-foreground text-[14px] mt-2 m-0" style={{ fontFamily: '"DM Sans", sans-serif' }}>Sign in to your AI workspace</p>
        </div>

        {/* Auth widget */}
        <div className="w-full flex flex-col items-center justify-center">
          <div
            data-testid="login-container"
            id={REFERENCE_ID}
            className="w-full flex flex-col justify-center items-center"
          />
        </div>

        {/* Divider */}
        <div style={{ margin: "24px 0 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "hsl(var(--border))" }} />
          <span className="text-muted-foreground/60 text-[11px] tracking-[0.05em]" style={{ fontFamily: '"DM Sans", sans-serif' }}>TRUSTED BY THOUSANDS</span>
          <div style={{ flex: 1, height: 1, background: "hsl(var(--border))" }} />
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {[["2000+", "Integrations"], ["99.9%", "Uptime"], ["24/7", "Support"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center", background: "hsl(var(--background))", borderRadius: 10, padding: "10px 6px", border: "1px solid hsl(var(--border))" }}>
              <div className="text-foreground font-bold text-[15px]" style={{ fontFamily: "Geist, sans-serif" }}>{val}</div>
              <div className="text-muted-foreground/60 text-[10px] tracking-[0.05em] mt-[2px]" style={{ fontFamily: '"DM Sans", sans-serif' }}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-muted-foreground/60 text-[11px] text-center leading-[1.7]" style={{ position: "relative", zIndex: 1, marginTop: 24, fontFamily: '"DM Sans", sans-serif' }}>
        By continuing, you agree to{" "}
        <a href="https://viasocket.com/terms/" target="_blank" rel="noreferrer" className="text-muted-foreground font-semibold no-underline">Terms of Service</a>
        {" "}and{" "}
        <a href="https://viasocket.com/privacy/" target="_blank" rel="noreferrer" className="text-muted-foreground font-semibold no-underline">Privacy Policy</a>
      </p>
    </div>
  );
}

const LoginPageWithAuth = WithAuth(LoginPageInner);

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageWithAuth />
    </Suspense>
  );
}
