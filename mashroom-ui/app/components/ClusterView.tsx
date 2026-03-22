"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Plus, Zap, X, Copy, Check, ChevronRight } from "lucide-react";
import PowerUpPanel from "./PowerUpPanel";
import { useAppSelector } from "../../lib/hooks";

interface PowerUp {
  id: string;
  name: string;
  description: string;
}

interface Cluster {
  _id: string;
  name: string;
  url: string;
  client: string;
  clientColor: string;
  powerUps: PowerUp[];
}

interface ClusterViewProps {
  cluster: Cluster;
  onAddPowerUp: () => void;
  onChangeClient: () => void;
}

const EMBED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI1NTkzIiwicHJvamVjdF9pZCI6InByb2o5TGZRdjRUNyIsInVzZXJfaWQiOiI2MTg5MCIsImlhdCI6MTc3NDAxMDI3M30.rhl0-Hfq5k9SAH3Zali9qdNl7s-EWKvxkVsL3Xaq5Qs";


function ToolCards({ clusterId, onToolClick }: { clusterId: string; onToolClick?: () => void }) {
  const tools = useAppSelector((s) => s.tools.byMcpServerId[clusterId] ?? []);
  if (tools.length === 0) return null;

  function handleToolClick(flowId: string) {
    (window as any).openViasocket?.(flowId, { embedToken: EMBED_TOKEN });
    onToolClick?.();
  }

  return (
    <>
      {tools.map((tool) => (
        <div
          key={tool._id}
          className="relative overflow-hidden group/card"
          style={{ background: "rgb(255,255,255)", border: "1px solid rgb(203,213,225)", transition: "box-shadow 0.2s, border-color 0.2s", borderRadius: 4, boxShadow: "rgba(0,0,0,0.06) 0px 2px 8px, rgba(0,0,0,0.03) 0px 0px 0px 1px" }}
        >
          <button onClick={() => handleToolClick(tool.flowId)} className="w-full flex items-center gap-2.5 px-3 py-3 cursor-pointer border-0 text-left" style={{ background: "transparent" }}>
            <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", boxShadow: "rgba(0,0,0,0.04) 0px 1px 3px" }}>
              <Zap width={15} height={15} style={{ color: "rgb(100,116,139)" }} />
            </div>
            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <p className="truncate" style={{ color: "rgb(10,10,10)", fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "-0.01em", margin: 0 }}>{tool.name}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <ChevronRight width={11} height={11} strokeWidth={2.5} className="group-hover/card:text-[#64748b] group-hover/card:translate-x-0.5" style={{ color: "rgb(176,184,196)", transition: "color 0.15s, transform 0.15s" }} />
            </div>
          </button>
        </div>
      ))}
    </>
  );
}

function ClientIcon({ clientId, color }: { clientId: string; color: string }) {
  if (clientId.toLowerCase() === "claude") {
    return (
      <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
          <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill="#D97757" />
          <path d="M4 38C4 40 6 42 10 42H54C58 42 60 40 60 38H4Z" fill="#c4663e" />
          <path d="M24 42H40V56C40 58.2 38.2 60 36 60H28C25.8 60 24 58.2 24 56V42Z" fill="#D97757" />
          <circle cx="18" cy="26" r="1.8" fill="#ffffff" />
          <circle cx="32" cy="16" r="1.8" fill="#ffffff" />
          <circle cx="46" cy="26" r="1.8" fill="#ffffff" />
          <line x1="18" y1="26" x2="32" y2="16" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
          <line x1="32" y1="16" x2="46" y2="26" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  return (
    <div
      style={{
        width: 24, height: 24,
        borderRadius: "50%",
        background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
      }}
    >
      {clientId[0]?.toUpperCase()}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 cursor-pointer"
      style={{ background: "rgb(243,244,246)", border: "1px solid rgb(226,232,240)", borderRadius: 4, padding: "4px 10px", fontSize: 12, fontFamily: "Geist, sans-serif", fontWeight: 500, color: "rgb(60,60,60)" }}
    >
      {copied ? <Check width={13} height={13} /> : <Copy width={13} height={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function MushroomIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
      <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill="#D97757" />
      <path d="M4 38C4 40 6 42 10 42H54C58 42 60 40 60 38H4Z" fill="#c4663e" />
      <path d="M24 42H40V56C40 58.2 38.2 60 36 60H28C25.8 60 24 58.2 24 56V42Z" fill="#D97757" />
      <circle cx="18" cy="26" r="1.8" fill="#ffffff" />
      <circle cx="32" cy="16" r="1.8" fill="#ffffff" />
      <circle cx="46" cy="26" r="1.8" fill="#ffffff" />
      <line x1="18" y1="26" x2="32" y2="16" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
      <line x1="32" y1="16" x2="46" y2="26" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function ClusterConfigModal({ cluster, onClose }: { cluster: Cluster; onClose: () => void }) {
  const selectedClient = useAppSelector((s) => s.clusters.selectedClientByClusterId[cluster._id]);
  const mcpUrl = cluster.url;

  const configJsonByType = {
    url: { mcpServers: { 'viasocket MCP': { url: mcpUrl } } },
    npx: { mcpServers: { viasocket: { command: 'npx', args: ['-y', 'mcp-remote', mcpUrl] } } },
    serverUrl: { mcpServers: { 'viasocket Actions MCP': { serverUrl: mcpUrl } } },
  } as const;
  const configType = (selectedClient?.configType as keyof typeof configJsonByType) || 'url';
  const configJson = JSON.stringify(configJsonByType[configType], null, 2);

  const steps = [
    { num: 1, title: "Copy the JSON config", desc: "Click the copy button on the config block", done: false },
    { num: 2, title: `Open ${cluster.client} settings`, desc: "Navigate to MCP or Tools configuration", done: false },
    { num: 3, title: "Paste the config", desc: "Add a new MCP server entry and paste", done: false },
    { num: 4, title: "Done!", desc: "Your AI can now act across 2000+ apps", done: true },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative flex flex-col"
        style={{ background: "#fff", borderRadius: 14, width: "min(820px, 94vw)", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.22)" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5" style={{ borderBottom: "1px solid rgb(235,237,242)" }}>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl shrink-0" style={{ background: "rgb(252,241,236)" }}>
              <MushroomIcon />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "rgb(10,10,10)", letterSpacing: "-0.02em" }}>Cluster Configuration</h2>
              <p style={{ margin: 0, fontSize: 13, color: "rgb(120,132,154)", fontFamily: "Geist, sans-serif", marginTop: 1 }}>{cluster.client}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer flex items-center justify-center"
            style={{ background: "transparent", border: "none", color: "rgb(160,170,185)", padding: 4, borderRadius: 6, lineHeight: 0 }}
          >
            <X width={20} height={20} strokeWidth={2} />
          </button>
        </div>

        {/* Modal body */}
        <div className="flex flex-col px-7 pt-6 pb-5 gap-5">

          {/* Top two-column row */}
          <div className="flex gap-6">

            {/* Left: MCP URL + JSON config */}
            <div className="flex-1 flex flex-col gap-5 min-w-0">

              {/* MCP URL */}
              <div>
                <p style={{ margin: "0 0 7px", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "rgb(100,116,139)", fontFamily: "Geist, sans-serif", textTransform: "uppercase" }}>MCP URL</p>
                <div
                  className="flex items-center justify-between gap-3 px-4"
                  style={{ background: "#fff", border: "1.5px solid rgb(220,225,234)", borderRadius: 8, height: 46 }}
                >
                  <span style={{ fontSize: 13, fontFamily: "monospace", color: "rgb(25,25,25)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mcpUrl}</span>
                  <CopyButton text={mcpUrl} />
                </div>
              </div>

              {/* JSON Config */}
              <div>
                <p style={{ margin: "0 0 7px", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "rgb(100,116,139)", fontFamily: "Geist, sans-serif", textTransform: "uppercase" }}>JSON Config</p>
                <div className="relative" style={{ background: "rgb(22,22,24)", borderRadius: 10, padding: "14px 18px 18px", overflow: "hidden" }}>
                  <div className="flex justify-end mb-2">
                    <CopyButton text={configJson} />
                  </div>
                  <pre className="hide-scrollbar" style={{ margin: 0, fontSize: 13, color: "rgb(210,230,210)", fontFamily: "'JetBrains Mono', 'Fira Mono', monospace", lineHeight: 1.65, whiteSpace: "pre", overflowX: "auto", scrollbarWidth: "none" }}>{configJson}</pre>
                </div>
              </div>
            </div>

            {/* Right: setup steps — no card borders, just circle + text */}
            <div className="shrink-0 flex flex-col" style={{ width: 230 }}>
              <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "rgb(100,116,139)", fontFamily: "Geist, sans-serif", textTransform: "uppercase" }}>Setup Steps</p>
              <div className="flex flex-col" style={{ border: "1.5px solid rgb(220,225,234)", borderRadius: 10, overflow: "hidden" }}>
                {steps.map((step, i) => (
                  <div
                    key={step.num}
                    className="flex items-start gap-3 px-4 py-3.5"
                    style={{ borderTop: i === 0 ? "none" : "1px solid rgb(235,237,242)" }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0 rounded-full"
                      style={{
                        width: 26, height: 26, fontSize: 12, fontWeight: 700, marginTop: 1,
                        background: step.done ? "rgb(10,10,10)" : "#fff",
                        border: step.done ? "none" : "1.5px solid rgb(200,206,216)",
                        color: step.done ? "#fff" : "rgb(80,90,110)",
                      }}
                    >
                      {step.done ? <Check width={13} height={13} strokeWidth={3} /> : step.num}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "rgb(10,10,10)", lineHeight: 1.3 }}>{step.title}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgb(120,132,154)", fontFamily: "Geist, sans-serif", lineHeight: 1.4 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video — full width below */}
          <div
            className="relative flex flex-col items-center justify-center cursor-pointer overflow-hidden w-full"
            style={{ background: "rgb(14,14,18)", borderRadius: 12, minHeight: 200 }}
          >
            <div className="flex flex-col items-center gap-2.5 relative z-10">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 52, height: 52, background: "rgba(255,255,255,0.14)", border: "1.5px solid rgba(255,255,255,0.22)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="6 3 20 12 6 21 6 3" /></svg>
              </div>
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "Geist, sans-serif", letterSpacing: "-0.01em", marginTop: 4 }}>Watch setup for {cluster.client}</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, fontFamily: "Geist, sans-serif" }}>Interactive demo ↗</span>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex justify-end px-7 py-4" style={{ borderTop: "1px solid rgb(235,237,242)" }}>
          <button
            onClick={onClose}
            className="flex items-center gap-2 cursor-pointer"
            style={{ background: "rgb(10,10,10)", color: "#fff", border: "none", borderRadius: 7, padding: "10px 22px", fontSize: 14, fontFamily: "Geist, sans-serif", fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            Done
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClusterView({ cluster, onAddPowerUp, onChangeClient }: ClusterViewProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);
  const prevToolsCountRef = useRef(0);

  const tools = useAppSelector((s) => s.tools.byMcpServerId[cluster._id] ?? []);
  const hasTools = tools.length > 0;

  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    if (tools.length > 0 && prevToolsCountRef.current === 0 && !tooltipDismissed) {
      setShowTooltip(true);
    }
    prevToolsCountRef.current = tools.length;
  }, [tools.length, tooltipDismissed]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "rgb(248,249,251)" }}>
      {/* Header */}
      <div className="shrink-0">
        <div className="w-full px-6" style={{ background: "rgb(255,255,255)", borderBottom: "1px solid rgb(226,232,240)" }}>
          <div className="flex items-center justify-between h-16 w-full">
            <div className="flex-1 min-w-0 flex items-center self-stretch">
              <h2 style={{ fontFamily: "Geist, sans-serif", color: "rgb(10,10,10)", margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>
                {cluster.name}
              </h2>
            </div>
            <div className="flex-1 min-w-0 flex justify-end items-center gap-1.5">
              <button
                className="flex items-center gap-2 cursor-pointer"
                style={{ background: "rgb(255,255,255)", color: "rgb(10,10,10)", border: "1px solid rgb(196,201,212)", boxShadow: "none", fontSize: 13, padding: "0px 14px", height: 34, fontFamily: "Geist, sans-serif", fontWeight: 600, letterSpacing: "-0.01em", borderRadius: 4 }}
              >
                <Share2 width={14} height={14} strokeWidth={2.5} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 px-4 pt-4 pb-3 flex justify-center overflow-hidden">
        <div className="w-full flex flex-col gap-4 h-full" style={{ maxWidth: 1100 }}>

          {/* Client card */}
          <div className="shrink-0">
            <div
              className="overflow-visible relative"
              style={{ background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", boxShadow: "rgba(0,0,0,0.04) 0px 1px 3px", borderRadius: 6 }}
              onMouseEnter={() => setHeaderHovered(true)}
              onMouseLeave={() => setHeaderHovered(false)}
            >
              <div className="flex items-center justify-between p-4 px-5">
                <div className="flex items-center gap-2 ml-1">
                  <ClientIcon clientId={cluster.client} color={cluster.clientColor} />
                  <span style={{ color: "rgb(10,10,10)", fontSize: 15, fontFamily: "Geist, sans-serif" }}>{cluster.client}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Change AI Client — visible on hover */}
                  <button
                    onClick={onChangeClient}
                    className="flex items-center gap-2 cursor-pointer"
                    style={{
                      background: "rgb(255,255,255)", color: "rgb(10,10,10)", border: "1px solid rgb(196,201,212)",
                      fontSize: 12, padding: "6px 14px", height: 34, fontFamily: "Geist, sans-serif", fontWeight: 600,
                      letterSpacing: "-0.01em", borderRadius: 4, transition: "opacity 0.15s",
                      opacity: headerHovered ? 1 : 0, pointerEvents: headerHovered ? "auto" : "none",
                    }}
                  >
                    Change AI Client
                  </button>

                  {/* Connect button — only when tools exist */}
                  {hasTools && (
                    <div className="relative">
                      <button
                        onClick={() => { setShowConfigModal(true); setShowTooltip(false); }}
                        className="flex items-center gap-2 cursor-pointer"
                        style={{ background: "rgb(10,10,10)", color: "#fff", border: "none", fontSize: 13, padding: "0px 16px", height: 34, fontFamily: "Geist, sans-serif", fontWeight: 600, letterSpacing: "-0.01em", borderRadius: 4 }}
                      >
                        Connect
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                      </button>

                      {/* Tooltip — shown on first tool creation */}
                      {showTooltip && !tooltipDismissed && (
                        <div
                          className="absolute z-20"
                          style={{ top: "calc(100% + 8px)", right: 0, background: "rgb(10,10,10)", color: "#fff", borderRadius: 8, padding: "10px 14px 10px 14px", width: 220, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p style={{ margin: 0, fontSize: 13, fontFamily: "Geist, sans-serif", lineHeight: 1.45 }}>
                              Your power-ups are ready. Connect your client to activate them.
                            </p>
                            <button
                              onClick={() => { setShowTooltip(false); setTooltipDismissed(true); }}
                              className="cursor-pointer shrink-0"
                              style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", padding: 0, marginTop: 1 }}
                            >
                              <X width={14} height={14} />
                            </button>
                          </div>
                          {/* Arrow */}
                          <div style={{ position: "absolute", top: -6, right: 16, width: 12, height: 12, background: "rgb(10,10,10)", transform: "rotate(45deg)", borderRadius: 2 }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Power-ups area */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <div
              className="flex-1 min-h-0 overflow-hidden flex flex-col relative"
              style={{ background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", borderRadius: 8, boxShadow: "rgba(0,0,0,0.04) 0px 1px 3px" }}
            >
              <div className="shrink-0 px-3 pt-3 pb-3">
                <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
                  <button
                    onClick={() => setShowPanel((v) => !v)}
                    className="relative overflow-hidden group/add cursor-pointer border-0 text-left"
                    style={{ background: showPanel ? "rgb(245,245,245)" : "rgb(250,251,252)", border: showPanel ? "2px dashed rgb(10,10,10)" : "2px dashed rgb(209,213,219)", transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s", borderRadius: 4 }}
                  >
                    <div className="flex items-center gap-2.5 px-3 py-3">
                      <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-full" style={{ background: "rgb(240,240,240)", border: "1.5px solid rgb(196,201,212)" }}>
                        <Plus width={16} height={16} strokeWidth={2} style={{ color: "rgb(100,116,139)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ color: "rgb(10,10,10)", fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 13, letterSpacing: "-0.01em", margin: 0 }}>Add Power-Up</p>
                      </div>
                    </div>
                  </button>
                  <ToolCards clusterId={cluster._id} onToolClick={() => setShowPanel(true)} />
                </div>
              </div>

              {showPanel && (
                <div className="absolute inset-0 z-10 overflow-hidden" style={{ borderRadius: 8 }}>
                  <PowerUpPanel
                    onClose={() => setShowPanel(false)}
                    onSelect={(app) => { onAddPowerUp(); setShowPanel(false); }}
                  />
                </div>
              )}

              {!showPanel && tools.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
                  <div className="w-14 h-14 flex items-center justify-center mb-5" style={{ borderRadius: 14, background: "rgb(243,244,246)", border: "1.5px solid rgb(229,231,235)" }}>
                    <Zap width={22} height={22} strokeWidth={2} style={{ color: "rgb(148,163,184)" }} />
                  </div>
                  <p style={{ color: "rgb(10,10,10)", fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: 17, margin: 0, letterSpacing: "-0.01em" }}>No power-ups yet</p>
                  <p style={{ color: "rgb(120,132,154)", fontFamily: '"DM Sans", sans-serif', fontSize: 14, margin: "8px 0 0", lineHeight: 1.55, maxWidth: 320 }}>
                    Add your first power-up to give{" "}
                    <strong style={{ color: "rgb(10,10,10)", fontWeight: 600 }}>{cluster.client}</strong>{" "}
                    real-world actions across 2,000+ apps.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfigModal && (
        <ClusterConfigModal cluster={cluster} onClose={() => setShowConfigModal(false)} />
      )}
    </div>
  );
}
