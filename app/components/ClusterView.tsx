"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { X, Copy, Check, User } from "lucide-react";

import AccountPanel from "./AccountPanel";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { removeTool, upsertTool } from "../../lib/features/toolsSlice";
import { toolApi } from "../../lib/api/toolApi";


interface ReplacedField {
  type: string
  required: boolean
  key: string
}

type ReplacedValue<T> = T extends unknown[]
  ? ReplacedValue<T[number]>[]
  : T extends Record<string, unknown>
    ? { [K in keyof T]: T[K] extends 'your_value_here' ? ReplacedField : ReplacedValue<T[K]> }
    : T




interface AiClient {
  id: string;
  title: string;
  icon: string;
  color: string;
}

interface Cluster {
  id: string;
  name: string;
  client: string;
  clientColor: string;
  projectId: string;
  url: string;
  powerUps: { id: string; name: string; description: string }[];
  selectedClient: AiClient | null;
}

interface ClusterViewProps {
  cluster: Cluster;
  onAddPowerUp: () => void;
  onChangeClient: () => void;
  hideSidebar?: boolean;
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

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      data-testid={`copy-${label.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={handleCopy}
      className="flex items-center gap-1.5 cursor-pointer"
      style={{ background: "rgb(243,244,246)", border: "1px solid rgb(226,232,240)", borderRadius: 4, padding: "4px 10px", fontSize: 12, fontFamily: "Geist, sans-serif", fontWeight: 500, color: "rgb(60,60,60)" }}
    >
      {copied ? <Check width={13} height={13} /> : <Copy width={13} height={13} />}
      {copied ? "Copied" : label}
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
  const selectedClient = useAppSelector((s) => s.clusters.selectedClientByClusterId[cluster.id]);
  const mcpUrl = cluster.url;
  const configJsonByType = {
    url: { mcpServers: { 'viasocket MCP': { url: mcpUrl } } },
    npx: { mcpServers: { viasocket: { command: 'npx', args: ['-y', 'mcp-remote', mcpUrl] } } },
    serverUrl: { mcpServers: { 'viasocket Actions MCP': { serverUrl: mcpUrl } } },
  } as const;
  const configType = (selectedClient?.configType as keyof typeof configJsonByType) ?? 'url';
  const configJson = JSON.stringify(configJsonByType[configType] ?? configJsonByType.url, null, 2);

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
            <div className="w-11 h-11 flex items-center justify-center rounded-xl shrink-0 overflow-hidden" style={{ background: selectedClient?.color ? `${selectedClient.color}1A` : "rgb(252,241,236)" }}>
              {selectedClient?.icon ? (
                <img src={selectedClient.icon} alt={selectedClient.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
              ) : (
                <MushroomIcon />
              )}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "rgb(10,10,10)", letterSpacing: "-0.02em" }}>Cluster Configuration</h2>
              <p style={{ margin: 0, fontSize: 13, color: "rgb(120,132,154)", fontFamily: "Geist, sans-serif", marginTop: 1 }}>{selectedClient?.title ?? cluster.client}</p>
            </div>
          </div>
          <button
            data-testid="cluster-config-modal-close"
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
                <div className="relative" style={{ background: "rgb(22,22,24)", borderRadius: 10, padding: "14px 18px 18px" }}>
                  <div className="flex justify-end mb-2">
                    <CopyButton text={configJson} />
                  </div>
                  <pre style={{ margin: 0, fontSize: 13, color: "rgb(210,230,210)", fontFamily: "'JetBrains Mono', 'Fira Mono', monospace", lineHeight: 1.65, whiteSpace: "pre", overflowX: "auto" }}>{configJson}</pre>
                </div>
              </div>
            </div>

            {/* Right: setup steps */}
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
            data-testid="cluster-config-modal-done"
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

function InlineConfigSection({ cluster, onChangeClient, hasTools }: { cluster: Cluster; onChangeClient: () => void; hasTools: boolean }) {
  const [expanded, setExpanded] = useState(hasTools);

  useEffect(() => {
    if (hasTools) setExpanded(true);
  }, [hasTools]);
  const selectedClient = useAppSelector((s) => s.clusters.selectedClientByClusterId[cluster.id]);
  const mcpUrl = cluster.url;
  const configJsonByType = {
    url: { mcpServers: { mushrooms: { url: mcpUrl, transport: "sse" } } },
    npx: { mcpServers: { mushrooms: { command: "npx", args: ["-y", "mcp-remote", mcpUrl] } } },
    serverUrl: { mcpServers: { "viasocket Actions MCP": { serverUrl: mcpUrl } } },
  } as const;
  const configType = (selectedClient?.configType as keyof typeof configJsonByType) ?? "url";
  const configJson = JSON.stringify(configJsonByType[configType] ?? configJsonByType.url, null, 2);

  const steps = [
    { num: 1, title: "Add your power-ups", desc: "Pick apps and the specific actions your AI can perform." },
    { num: 2, title: "Copy the url/config", desc: "Paste it into your AI client's settings file." },
    { num: 3, title: "Ask your AI to act", desc: "Then just ask in plain language.", quote: "\"Send a Slack message to the team about tomorrow's standup\"" },
  ];

  return (
    <>
      {/* Salmon header — clickable to toggle */}
      <div
        onClick={() => setExpanded(v => !v)}
        className="shrink-0 flex items-center px-5 w-full cursor-pointer"
        style={{ height: 40, background: selectedClient?.color || cluster.clientColor || "rgb(217,119,87)", borderBottom: expanded ? "1px solid rgba(0,0,0,0.12)" : "none" }}
      >
        <span style={{ fontFamily: "Geist, sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", flex: 1 }}>
          {selectedClient?.title ?? cluster.client} Configuration
        </span>

        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: "transform 0.2s", transform: expanded ? "rotate(0deg)" : "rotate(180deg)" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {/* Body — two columns */}
      {expanded && <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left 60%: URL + JSON */}
        <div className="flex flex-col overflow-y-auto" style={{ flex: "0 0 60%", borderRight: "1px solid rgb(226,232,240)", padding: "14px 16px 16px" }}>
          <span style={{ fontFamily: "Geist, sans-serif", fontSize: 10, fontWeight: 600, color: "rgb(148,163,184)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>MCP Endpoint URL</span>
          <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: "1px solid rgb(226,232,240)" }}>
            <input
              readOnly
              value={mcpUrl}
              style={{ flex: 1, minWidth: 0, fontFamily: '"Geist Mono", monospace', fontSize: 11, color: "rgb(10,10,10)", background: "rgb(248,250,252)", border: "none", padding: "7px 12px", outline: "none" }}
            />
            <CopyButton text={mcpUrl} label="Copy" />
          </div>
          <div className="flex items-start gap-1" style={{ marginTop: 6, marginBottom: 12 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgb(217,119,6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgb(146,64,14)", lineHeight: 1.45 }}>Keep this URL private — it authorizes AI actions on your connected accounts.</span>
          </div>
          <div style={{ height: 1, background: "rgb(226,232,240)", marginBottom: 12 }} />
          {/* Dark JSON block */}
          <div style={{ background: "rgb(13,17,23)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div className="flex items-center justify-between" style={{ padding: "7px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, color: "rgb(107,114,128)", letterSpacing: "0.04em" }}>JSON</span>
              <CopyButton text={configJson} label="Copy" />
            </div>
            <pre style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, margin: 0, padding: "10px 14px", lineHeight: 1.65, overflowX: "auto", color: "rgb(229,231,235)" }} dangerouslySetInnerHTML={{
              __html: configJson
                .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                .replace(/("[^"]+")(:)/g, '<span style="color:rgb(96,165,250)">$1</span>$2')
                .replace(/: ("[^"]+")/g, ': <span style="color:rgb(52,211,153)">$1</span>')
            }} />
          </div>
        </div>

        {/* Right 40%: How to connect */}
        <div className="flex flex-col overflow-y-auto" style={{ flex: "0 0 40%", padding: "14px 20px 16px" }}>
          <span style={{ fontFamily: "Geist, sans-serif", fontSize: 10, fontWeight: 600, color: "rgb(148,163,184)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, display: "block" }}>How to connect</span>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1, gap: 24 }}>
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-3 items-start" style={{ position: "relative" }}>
                {/* Step circle + segment */}
                <div className="flex flex-col items-center shrink-0" style={{ position: "relative", width: 22 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgb(10,10,10)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                    <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, fontWeight: 700, color: "#fff" }}>{step.num}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ position: "absolute", left: 10.25, top: 22, bottom: -24, width: 1.5, background: "rgb(226,232,240)", borderRadius: 2 }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "Geist, sans-serif", fontSize: 13, fontWeight: 600, color: "rgb(10,10,10)", margin: "0 0 3px", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{step.title}</p>
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgb(100,116,139)", margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
                  {step.quote && (
                    <div style={{ paddingLeft: 9, marginTop: 8 }}>
                      <em style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgb(100,116,139)", lineHeight: 1.5 }}>{step.quote}</em>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </>
  );
}

export default function ClusterView({ cluster, onAddPowerUp, onChangeClient, hideSidebar }: ClusterViewProps) {
  const dispatch = useAppDispatch();
  const [showAccount, setShowAccount] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const embedToken = useAppSelector((s) => s.clusters.embedTokenByClusterId[cluster.id] ?? null);
  const tools = useAppSelector((s) => s.tools.byMcpServerId[cluster.id] ?? []);
  const hasTools = tools.length > 0;
  const embedSlotRef = useRef<HTMLDivElement>(null);

  // Keep a single persistent #viasocketParentId div alive in document.body.
  // On mount: move it into the visible slot. On unmount: park it back in body (hidden).
  // This way the embed script's DOM is never destroyed across cluster/route changes.
  useLayoutEffect(() => {
    // Ensure a single persistent #viasocketParentId div exists and move it into the slot.
    // It lives in document.body between mounts so the embed script's DOM is never destroyed.
    let persistent = document.getElementById("viasocketParentId") as HTMLDivElement | null;
    if (!persistent) {
      persistent = document.createElement("div");
      persistent.id = "viasocketParentId";
      persistent.style.cssText = "display:none;width:100%;height:100%;flex:1;min-height:0;";
      document.body.appendChild(persistent);
    }
    const slot = embedSlotRef.current;
    if (slot && !slot.contains(persistent)) {
      persistent.style.cssText = "width:100%;height:100%;flex:1;min-height:0;display:flex;";
      slot.appendChild(persistent);
    }
    return () => {
      // Park into a zero-size hidden container so the embed script cannot show it
      let prison = document.getElementById("__viasocket_prison__");
      if (!prison) {
        prison = document.createElement("div");
        prison.id = "__viasocket_prison__";
        prison.style.cssText = "position:fixed;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none;z-index:-9999;top:0;left:0;";
        document.body.appendChild(prison);
      }
      if (persistent) prison.appendChild(persistent);
    };
  }, []);

  useEffect(() => {
    if (!embedToken) return;

    const scriptId = process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID!;
    const alreadyLoaded = !!document.getElementById(scriptId);
    if (alreadyLoaded) {
      let cancelled = false;
      const interval = setInterval(() => {
        if (cancelled) return clearInterval(interval);
        if (!(window as any).openViasocket) return;
        clearInterval(interval);
        (window as any).openViasocket(undefined, { embedToken });
      }, 50);
      return () => { cancelled = true; clearInterval(interval); };
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = process.env.NEXT_PUBLIC_EMBED_SCRIPT_SRC!;
    script.setAttribute("embedToken", embedToken);
    script.setAttribute("parentId", "viasocketParentId");
    document.body.appendChild(script);
  }, [embedToken, cluster.id]);

  useEffect(() => {
    async function handleMessage(e: MessageEvent) {
      if (!e.data?.webhookurl) return;
      const action = e.data?.action;
      if (action === "deleted") {
        const flowId = (e.data.id as string) ?? "";
        try {
          await toolApi.deleteTool(flowId);
          dispatch(removeTool({ mcpServerId: cluster.id, toolId: flowId }));
        } catch (err) {
          console.error("[ClusterView] delete tool error:", err);
        }
      } else if (action === "published" || action === "paused" || action === "created" || action === "updated") {
        try {
          const res = await toolApi.callTool({
            flowId: (e.data.id as string) ?? "",
            payload:  e.data.mcpToolJson,
            desc: (e.data.description as string) || (e.data.title as string) || "",
            status: (e.data.action as string) ?? (e.data.status as string) ?? "active",
            title: (e.data.title as string) ?? "",
            mcpServerId: cluster.id,
          });
          if (res.data?.data) {
            dispatch(upsertTool({
              ...res.data.data,
              serviceIcons: (e.data.serviceIcons as string[]) ?? res.data.data.serviceIcons ?? [],
            }));
          }
        } catch (err) {
          console.error("[ClusterView] MCP tool API error:", err);
        }
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [cluster.id, dispatch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setShowAccount(false);
      }
    }
    if (showAccount) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAccount]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "rgb(248,249,251)" }}>
      {/* Header */}
      <div className="shrink-0">
        {hideSidebar ? (
          <div className="px-6 w-full flex items-center justify-between">
            <a className="flex items-center gap-2.5 no-underline h-16" href="/">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill="#0a0a0a" />
                  <path d="M4 38C4 40 6 42 10 42H54C58 42 60 40 60 38H4Z" fill="#1a1a1a" />
                  <path d="M24 42H40V56C40 58.2 38.2 60 36 60H28C25.8 60 24 58.2 24 56V42Z" fill="#0a0a0a" />
                  <path d="M29 42H35V56C35 57.1 34.1 58 33 58H31C29.9 58 29 57.1 29 56V42Z" fill="#1a1a1a" opacity="0.3" />
                  <circle cx="18" cy="26" r="1.8" fill="#ffffff" />
                  <circle cx="32" cy="16" r="1.8" fill="#ffffff" />
                  <circle cx="46" cy="26" r="1.8" fill="#ffffff" />
                  <line x1="18" y1="26" x2="32" y2="16" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                  <line x1="32" y1="16" x2="46" y2="26" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span style={{ color: "rgb(10,10,10)", fontFamily: "Geist, sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>Mushrooms</span>
                <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgb(148,163,184)" }}>by viasocket</span>
              </div>
            </a>
            <div ref={accountRef} className="relative">
              {showAccount && <AccountPanel onClose={() => setShowAccount(false)} />}
              <button
                data-testid="cluster-account-button"
                onClick={() => setShowAccount((v) => !v)}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: showAccount ? "rgb(10,10,10)" : "rgb(30,30,30)", border: "none", flexShrink: 0 }}
              >
                <User width={15} height={15} strokeWidth={2} style={{ color: "#fff" }} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full px-6 " style={{ background: "transparent" }}>
            <div className="flex items-center justify-between h-16 w-full">
              <div className="flex items-center gap-2.5">
                {cluster.selectedClient?.icon ? (
                  <div style={{ width: 24, height: 24, borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                    <img src={cluster.selectedClient.icon} alt={cluster.selectedClient.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <ClientIcon clientId={cluster.client} color={cluster.clientColor} />
                )}
                <h2 style={{ fontFamily: "Geist, sans-serif", color: "rgb(10,10,10)", margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {cluster.name}
                </h2>
              </div>
              <div ref={accountRef} className="relative">
                {showAccount && <AccountPanel onClose={() => setShowAccount(false)} />}
                <button
                  data-testid="cluster-account-button"
                  onClick={() => setShowAccount((v) => !v)}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: showAccount ? "rgb(10,10,10)" : "rgb(30,30,30)", border: "none", flexShrink: 0 }}
                >
                  <User width={15} height={15} strokeWidth={2} style={{ color: "#fff" }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content — stacked full width */}
      <div className="flex-1 min-h-0 px-6 md:px-16 lg:px-24 max-w-[1400px] min-w-[320px] md:min-w-[800px] lg:min-w-[1000px] mx-auto w-full pt-4 flex flex-col gap-2 h-full overflow-hidden">

        {/* Embed — always open */}
        <div className="w-full flex-1 flex flex-col" style={{ background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", borderRadius: 8, boxShadow: "rgba(0,0,0,0.04) 0px 1px 3px", overflow: "hidden" }}>
          <div ref={embedSlotRef} className="flex-1 min-h-0 w-full" />
        </div>

        {/* Configuration panel */}
        <div className="w-full shrink-0 flex flex-col" style={{ background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", borderRadius: 8, overflow: "hidden" }}>
          <InlineConfigSection cluster={cluster} onChangeClient={onChangeClient} hasTools={hasTools} />
        </div>
      </div>
    </div>
  );
}
