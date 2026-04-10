"use client";

export const runtime = "edge";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { setInCookies } from "@/lib/utils/cookies";
import WithAuth from "@/app/components/WithAuth";
import { integrationsApi } from "@/lib/api/integrationsApi";

const REFERENCE_ID = process.env.NEXT_PUBLIC_REFERENCE_ID!;

const HEADING_FONT = "'Space Grotesk', 'DM Sans', sans-serif";

function StepCard({ step }: { step: { num: string; title: string; desc: string } }) {
  return (
    <div style={{
      background: "rgba(0,0,0,0.22)",
      border: "1.5px solid rgba(255,255,255,0.18)",
      borderRadius: 10,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        border: "2px solid rgba(255,255,255,0.55)",
        borderRadius: 4,
        fontFamily: HEADING_FONT,
        fontSize: 13,
        fontWeight: 700,
        color: "rgba(255,255,255,0.9)",
        flexShrink: 0,
      }}>
        {step.num}
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", lineHeight: 1.3 }}>
        {step.title}
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}>
        {step.desc}
      </div>
    </div>
  );
}

function LoginPageInner({ loading }: { loading: boolean }) {
  const urlParams = useSearchParams();
  const [appsCount, setAppsCount] = useState("2,000+");

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

  useEffect(() => {
    integrationsApi.getAppsCount()
      .then((res) => {
        if (res.data?.count) setAppsCount(`${res.data.count}+`);
      })
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: "#f5f0eb" }}>
        <style>{`
          @keyframes mushroom-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes shadow-pulse { 0%,100%{transform:scaleX(1);opacity:.25} 50%{transform:scaleX(.6);opacity:.1} }
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        `}</style>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{ animation: "mushroom-bob 1.2s ease-in-out infinite" }}>
            <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
              <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill="#0a0a0a" />
              <path d="M4 38C4 40 6 42 10 42H54C58 42 60 40 60 38H4Z" fill="#1a1a1a" />
              <path d="M24 42H40V56C40 58.2 38.2 60 36 60H28C25.8 60 24 58.2 24 56V42Z" fill="#0a0a0a" />
              <circle cx="18" cy="26" r="1.8" fill="#ffffff" />
              <circle cx="32" cy="16" r="1.8" fill="#ffffff" />
              <circle cx="46" cy="26" r="1.8" fill="#ffffff" />
            </svg>
          </div>
          <div style={{ width: 36, height: 6, borderRadius: "50%", background: "rgb(10,10,10)", animation: "shadow-pulse 1.2s ease-in-out infinite" }} />
        </div>
      </div>
    );
  }

  const steps = [
    {
      num: "01",
      title: "Connect your AI client",
      desc: "Paste one MCP URL into Claude, Cursor, ChatGPT or any MCP-compatible client. Done.",
    },
    {
      num: "02",
      title: "Pick your apps & actions",
      desc: `Choose from ${appsCount} integrations. Toggle exactly which actions your AI is allowed to run.`,
    },
    {
      num: "03",
      title: "Let your AI execute",
      desc: "Your AI acts in the real world: creating tickets, sending messages, updating records.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", flexDirection: "row", background: "#2ebd85" }}>
      {/* Left — 60% green panel */}
      <div
        style={{
          flex: "0 0 60%",
          background: "#2ebd85",
          padding: "48px 52px 40px",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Dot grid pattern */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Label */}
          <p style={{ fontFamily: HEADING_FONT, fontSize: 11, fontWeight: 500, color: "rgba(0,0,0,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 36px" }}>
            BY viaSocket · MCP PLATFORM
          </p>

          {/* Hero headline */}
          <div style={{ marginBottom: 44 }}>
            <p style={{ fontFamily: HEADING_FONT, fontWeight: 700, fontSize: "clamp(22px, 3vw, 36px)", color: "#0a0a0a", lineHeight: 1.25, margin: 0, letterSpacing: "0.02em" }}>YOUR AI</p>
            <p style={{ fontFamily: HEADING_FONT, fontWeight: 700, fontSize: "clamp(22px, 3vw, 36px)", color: "#fff", lineHeight: 1.25, margin: 0, letterSpacing: "0.02em" }}>CONNECTED</p>
            <p style={{ fontFamily: HEADING_FONT, fontWeight: 700, fontSize: "clamp(22px, 3vw, 36px)", color: "#0a0a0a", lineHeight: 1.25, margin: 0, letterSpacing: "0.02em" }}>TO EVERYTHING</p>
          </div>

          {/* Steps — 2-col grid, 03 full width */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {steps.slice(0, 2).map((s) => (
              <StepCard key={s.num} step={s} />
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <StepCard step={steps[2]} />
            </div>
          </div>
        </div>
      </div>

      {/* Right — 40% beige panel */}
      <div
        className="flex flex-col"
        style={{
          flex: "1 1 40%",
          minWidth: 0,
          background: "#f0ece4",
          position: "relative",
          borderRadius: "24px 0 0 24px",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid on right */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Logo top center */}
          <div style={{ paddingTop: 40, textAlign: "center" }}>
            <p style={{ fontFamily: HEADING_FONT, fontWeight: 700, fontSize: 18, color: "#0a0a0a", letterSpacing: "0.06em", margin: "0 0 4px" }}>MUSHROOMS</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#888", margin: 0 }}>by viaSocket</p>
          </div>

          {/* Center — heading + auth */}
          <div className="flex-1 flex flex-col items-center justify-center" style={{ padding: "0 44px" }}>
            <div style={{ width: "100%", maxWidth: 340 }}>
              <h2 style={{
                fontFamily: HEADING_FONT,
                fontWeight: 700,
                fontSize: "clamp(20px, 2.2vw, 28px)",
                color: "#0a0a0a",
                lineHeight: 1.3,
                letterSpacing: "0.02em",
                margin: "0 0 12px",
              }}>
                SIGN UP TO YOUR<br />MUSHROOMS CLUSTER
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#666", margin: "0 0 28px", lineHeight: 1.5 }}>
                Access your MCP endpoint and connected apps.
              </p>

              {/* Auth widget */}
              <div
                id={REFERENCE_ID}
                className="w-full flex flex-col justify-center items-center"
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "16px 32px 24px", textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#aaa", margin: "0 0 3px", lineHeight: 1.6 }}>
              By signing in you accept our{" "}
              <a href="https://viasocket.com/terms/" target="_blank" rel="noreferrer" style={{ color: "#777", textDecoration: "underline" }}>Fair Usage Policy</a>
              {" "}&amp;{" "}
              <a href="https://viasocket.com/privacy/" target="_blank" rel="noreferrer" style={{ color: "#777", textDecoration: "underline" }}>Privacy Policy</a>
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#bbb", margin: 0 }}>
              © {new Date().getFullYear()} mushrooms. All rights reserved.{" "}
              <a href="https://viasocket.com/privacy/" target="_blank" rel="noreferrer" style={{ color: "#999", textDecoration: "none" }}>Privacy</a>
              {" "}and{" "}
              <a href="https://viasocket.com/terms/" target="_blank" rel="noreferrer" style={{ color: "#999", textDecoration: "none" }}>Terms</a>
            </p>
          </div>
        </div>
      </div>
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
