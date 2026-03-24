"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

// ─── Shared Primitives ───────────────────────────────────────────────────────

function BentoCard({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`flex flex-col justify-between p-6 min-h-0 overflow-hidden relative ${className}`} style={style}>
      {children}
    </div>
  );
}

function BentoTitle({ children, light, dark, className = "" }: { children: React.ReactNode; light?: boolean; dark?: boolean; className?: string }) {
  const color = dark ? "text-[#0a0a0a]" : "text-white";
  return (
    <div className={`font-[Geist,sans-serif] text-xl font-bold tracking-tight leading-tight mb-1.5 ${color} ${className}`}>
      {children}
    </div>
  );
}

function BentoDesc({ children, light, className = "" }: { children: React.ReactNode; light?: boolean; className?: string }) {
  const color = light ? "text-white/65" : "text-slate-500";
  return (
    <div className={`font-[DM_Sans,sans-serif] text-[12.5px] leading-relaxed ${color} ${className}`}>
      {children}
    </div>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function Hero() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="animate-fade-in pb-6 text-center">
      <h1
        className="font-[Geist,sans-serif] font-bold text-[#0a0a0a] mb-4"
        style={{ fontSize: 52, letterSpacing: "-2px", lineHeight: 1.08 }}
      >
        Bring{" "}
        <em style={{ fontStyle: "normal", color: "#5CD2A2" }}>2,000+ power-ups</em>
        <br />
        inside your product
      </h1>
      <p className="font-[DM_Sans,sans-serif] text-base text-[#0a0a0a] leading-relaxed mb-8 max-w-[520px] mx-auto">
        Your users connect apps, automate workflows, and extend their AI — all without ever leaving your platform.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-[10px] font-[Geist,sans-serif] text-[15px] font-medium text-white border-none cursor-pointer transition-all duration-150"
          style={{
            background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
            boxShadow: hovered
              ? "0 4px 12px rgba(0,0,0,0.22)"
              : "0 1px 3px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.1)",
            transform: hovered ? "translateY(-1px)" : "none",
          }}
        >
          Build on viaSocket
          <ExternalLink size={12} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function AICards() {
  return (
    <div className="pt-11" style={{ animationDelay: "70ms" }}>
      {/* Hero card */}
      <div
        className="rounded-t-lg overflow-hidden relative"
        style={{ background: "#0a0a0e", padding: "36px 36px 32px" }}
      >
        {/* Orb */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            right: -40, top: -40, width: 260, height: 260,
            background: "radial-gradient(circle, rgba(92,210,162,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 font-[Geist,sans-serif] text-[11px] font-semibold uppercase tracking-[0.8px] text-white/70 mb-4">
          Why embed Mushrooms
        </div>
        <div
          className="relative z-10 text-white font-[Geist,sans-serif] font-bold"
          style={{ fontSize: 32, letterSpacing: "-0.8px", lineHeight: 1.15, maxWidth: 520 }}
        >
          Your AI can think.<br />
          <span style={{ color: "#5CD2A2" }}>Now</span> it can act.
        </div>
      </div>

      {/* Sub cards row */}
      <div className="flex gap-px rounded-b-lg overflow-hidden" style={{ background: "#e2e8f0" }}>
        {[
          {
            bg: "#1a0a3e",
            orb: "rgba(139,92,246,0.2)",
            title: "2,000+ apps.\nNo pipelines.",
            sub: "Every app your users live in, ready to connect.",
          },
          {
            bg: "#0a1a38",
            orb: "rgba(59,130,246,0.2)",
            title: "Your brand.\nZero seams.",
            sub: "Fully white-label. Your users never leave your product.",
          },
          {
            bg: "#051a18",
            orb: "rgba(16,185,129,0.18)",
            title: "Ship in hours.\nNot sprints.",
            sub: "One script tag. No auth to build. No edge cases.",
          },
        ].map(({ bg, orb, title, sub }) => (
          <div
            key={title}
            className="flex-1 flex flex-col justify-end relative overflow-hidden"
            style={{ background: bg, padding: "22px 24px", minHeight: 130 }}
          >
            <div
              className="absolute pointer-events-none rounded-full"
              style={{
                right: -20, bottom: -20, width: 120, height: 120,
                background: `radial-gradient(circle, ${orb} 0%, transparent 70%)`,
              }}
            />
            <div
              className="relative z-10 text-white font-[Geist,sans-serif] font-bold whitespace-pre-line"
              style={{ fontSize: 16, letterSpacing: "-0.3px", lineHeight: 1.25 }}
            >
              {title}
            </div>
            <div
              className="relative z-10 font-[DM_Sans,sans-serif] text-white/65 leading-relaxed mt-1.5"
              style={{ fontSize: 12 }}
            >
              {sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BentoGrid() {
  return (
    <div className="pt-8">
      <div
        className="font-[Geist,sans-serif] font-bold text-[#0a0a0a] mb-4"
        style={{ fontSize: 22, letterSpacing: "-0.5px" }}
      >
        What&apos;s inside every embed
      </div>

      <div
        className="flex flex-col gap-px rounded-[10px] overflow-hidden border border-[#e2e8f0]"
        style={{ background: "#e2e8f0" }}
      >
        {/* Row 1 */}
        <div className="flex gap-px">
          <BentoCard className="flex-[2]" style={{ background: "#111111" } as React.CSSProperties}>
            <div>
              <BentoTitle light>Setup</BentoTitle>
              <BentoDesc light>Generate your embed token, drop in one script tag. Your product is live in minutes.</BentoDesc>
            </div>
            <div
              className="mt-4 rounded-md p-3 font-mono leading-relaxed"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: 9.5, color: "rgba(255,255,255,0.3)",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.2)" }}>{"{"}</span><br />
              {"  "}<span style={{ color: "#7dd3a8" }}>&quot;org_id&quot;</span>: <span style={{ color: "#93c5fd" }}>&quot;your_org&quot;</span>,<br />
              {"  "}<span style={{ color: "#7dd3a8" }}>&quot;project_id&quot;</span>: <span style={{ color: "#93c5fd" }}>&quot;proj_abc&quot;</span>,<br />
              {"  "}<span style={{ color: "#7dd3a8" }}>&quot;user_id&quot;</span>: <span style={{ color: "#93c5fd" }}>req.user.id</span><br />
              <span style={{ color: "rgba(255,255,255,0.2)" }}>{"}"}</span>
            </div>
          </BentoCard>
          <BentoCard className="flex-1" style={{ background: "#0f0b2a" } as React.CSSProperties}>
            <div>
              <BentoTitle light>Filter Available Apps</BentoTitle>
              <BentoDesc light>Choose exactly which of 2,000+ apps your users can connect.</BentoDesc>
            </div>
            <div className="flex gap-1.5 flex-wrap mt-4">
              {["💬", "📧", "📋", "⚡", "🔧", "📊", "🛒"].map((e) => (
                <div
                  key={e}
                  className="w-6 h-6 rounded flex items-center justify-center text-[11px]"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)" }}
                >
                  {e}
                </div>
              ))}
              <div className="flex items-center px-1 font-mono text-white/30" style={{ fontSize: 9 }}>
                +1,993
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Row 2 */}
        <div className="flex gap-px">
          <BentoCard className="flex-1" style={{ background: "#0a1628" } as React.CSSProperties}>
            <div>
              <BentoTitle light>Configuration</BentoTitle>
              <BentoDesc light>Control display options, custom titles, domain restrictions, and per-user behaviour.</BentoDesc>
            </div>
            <div className="flex flex-col gap-1.5 mt-4">
              {[
                { checked: true, label: "Show enabled apps" },
                { checked: true, label: "Embed in AI client" },
                { checked: false, label: "Custom title & subtitle" },
                { checked: false, label: "Domain restrictions" },
              ].map(({ checked, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 flex-shrink-0 rounded-sm"
                    style={{
                      border: checked ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.15)",
                      background: checked ? "rgba(139,92,246,0.4)" : "transparent",
                    }}
                  />
                  <span
                    className="font-[DM_Sans,sans-serif]"
                    style={{ fontSize: 10.5, color: checked ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.3)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </BentoCard>
          <BentoCard className="flex-1" style={{ background: "#0d0a1f" } as React.CSSProperties}>
            <div>
              <BentoTitle light>Theme Configuration</BentoTitle>
              <BentoDesc light>Override colours, fonts, and border radius via CSS variables. Your panel, your look.</BentoDesc>
            </div>
            <div
              className="mt-4 rounded-md p-3 font-mono leading-relaxed"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: 9.5, color: "rgba(255,255,255,0.3)",
              }}
            >
              <span style={{ color: "#7dd3a8" }}>&quot;--col-primary&quot;</span>: <span style={{ color: "#93c5fd" }}>&quot;#6366f1&quot;</span>,<br />
              <span style={{ color: "#7dd3a8" }}>&quot;--border-radius&quot;</span>: <span style={{ color: "#93c5fd" }}>&quot;8&quot;</span>,<br />
              <span style={{ color: "#7dd3a8" }}>&quot;--font-family&quot;</span>: <span style={{ color: "#93c5fd" }}>&quot;&apos;Geist&apos;&quot;</span>
            </div>
          </BentoCard>
        </div>

        {/* Row 3 */}
        <div className="flex gap-px">
          <BentoCard
            className="flex-1 rounded-bl-[9px]"
            style={{
              background: "#f5f3ff",
              boxShadow: "inset 2px 0 0 #a855f7, inset 0 -2px 0 #a855f7",
            } as React.CSSProperties}
          >
            <div>
              <BentoTitle dark>Integration Guide</BentoTitle>
              <BentoDesc className="text-purple-800">APIs, webhooks, and JS methods to control the embed from your codebase.</BentoDesc>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3.5">
              {["openMushrooms()", "handleClose()", "Webhooks", "Workflow APIs"].map((m) => (
                <span
                  key={m}
                  className="font-mono text-purple-700 rounded px-2 py-0.5"
                  style={{
                    fontSize: 10,
                    background: "#ede9fe",
                    border: "1px solid #ddd6fe",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </BentoCard>
          <BentoCard
            className="flex-1 rounded-br-[9px]"
            style={{
              background: "#f0fefb",
              boxShadow: "inset -2px 0 0 #5CD2A2, inset 0 -2px 0 #5CD2A2",
            } as React.CSSProperties}
          >
            <div>
              <BentoTitle dark className="text-emerald-900">Metrics</BentoTitle>
              <BentoDesc className="text-emerald-700">Track connections, actions fired, and per-user activity.</BentoDesc>
            </div>
            <div className="mt-3.5">
              <div className="flex rounded overflow-hidden border border-[#a7f3d0]">
                {["FLOW", "ACTION", "STATUS", "TIME"].map((col, i) => (
                  <div
                    key={col}
                    className="font-mono font-semibold text-emerald-900 tracking-[0.4px]"
                    style={{
                      flex: col === "ACTION" ? 1 : 0.65,
                      padding: "5px 8px",
                      background: "#ccfbf1",
                      borderRight: i < 3 ? "1px solid #a7f3d0" : "none",
                      fontSize: 9,
                    }}
                  >
                    {col}
                  </div>
                ))}
              </div>
              <div className="p-2 text-center font-[DM_Sans,sans-serif] text-[#5CD2A2]" style={{ fontSize: 10.5 }}>
                No data yet — goes live once users connect
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function EmbedTopBar() {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  return (
    <div className="bg-white border-b border-[#e2e8f0] h-16 px-6 flex items-center shrink-0">
      <button
        onClick={() => router.back()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded font-[Geist,sans-serif] text-[13px] font-semibold text-[#0a0a0a] bg-white border border-[#c4c9d4] cursor-pointer transition-shadow duration-150"
        style={{ boxShadow: hovered ? "0 2px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)" : "none" }}
      >
        <ArrowLeft size={13} strokeWidth={2.5} />
        Back to Clusters
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function EmbedPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#f8f9fb" }}>
      <EmbedTopBar />
      <div className="flex-1 overflow-y-auto py-8 px-7 pb-20 flex flex-col items-center">
        <div className="w-full" style={{ maxWidth: 860 }}>
          <Hero />
          <AICards />
          <BentoGrid />
        </div>
      </div>
    </div>
  );
}
