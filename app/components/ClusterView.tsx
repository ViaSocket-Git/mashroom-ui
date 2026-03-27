"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Share2, Plus, Zap, X, Copy, Check, ChevronRight, User } from "lucide-react";

import AccountPanel from "./AccountPanel";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { fetchEmbedToken } from "../../lib/features/clustersSlice";
import { removeTool, upsertTool } from "../../lib/features/toolsSlice";
import { toolApi } from "../../lib/api/toolApi";

interface PowerUp {
  id: string;
  name: string;
  description: string;
}

interface AiClient {
  id: string;
  title: string;
  icon: string;
}

interface Cluster {
  id: string;
  name: string;
  client: string;
  clientColor: string;
  projectId: string;
  url: string;
  powerUps: PowerUp[];
  selectedClient: AiClient | null;
}

interface ClusterViewProps {
  cluster: Cluster;
  onAddPowerUp: () => void;
  onChangeClient: () => void;
}

function ToolCards({ clusterId, onOpenPanel }: { clusterId: string; onOpenPanel: () => void }) {
  const dispatch = useAppDispatch();
  const tools = useAppSelector((s) => s.tools.byMcpServerId[clusterId] ?? []);
  const embedToken = useAppSelector((s) => s.clusters.embedTokenByClusterId[clusterId] ?? null);

  useEffect(() => {
    if (!embedToken) dispatch(fetchEmbedToken(clusterId));
  }, [clusterId, embedToken, dispatch]);

  if (tools.length === 0) return null;

  function handleToolClick(tool: { flowId: string }) {
    if ((window as any).openViasocket && embedToken) {
      (window as any).openViasocket(tool.flowId, { embedToken });
    }
    onOpenPanel();
  }

  return (
    <>
      {tools.map((tool) => (
        <div
          key={tool.flowId}
          className="relative overflow-hidden group/card bg-card border border-border rounded" style={{ transition: "box-shadow 0.2s, border-color 0.2s", boxShadow: "rgba(0,0,0,0.06) 0px 2px 8px, rgba(0,0,0,0.03) 0px 0px 0px 1px" }}
        >
          <button onClick={() => handleToolClick(tool)} className="w-full flex items-center gap-2.5 px-3 py-3 cursor-pointer border-0 text-left" style={{ background: "transparent" }}>
            <div className="flex items-center shrink-0" style={{ gap: 2 }}>
              {tool.serviceIcons && tool.serviceIcons.length > 0 ? (
                tool.serviceIcons.map((icon, i) => (
                  <div key={i} className="w-7 h-7 flex items-center justify-center bg-card border border-border rounded-md shadow-xs" style={{ marginLeft: i > 0 ? -6 : 0, zIndex: tool.serviceIcons.length - i }}>
                    <img src={icon} alt="" style={{ width: 16, height: 16, objectFit: "contain" }} />
                  </div>
                ))
              ) : (
                <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-card border border-border rounded-md shadow-xs">
                  <Zap width={15} height={15} className="text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <p className="truncate text-foreground font-bold text-[13px] tracking-[-0.01em] m-0" style={{ fontFamily: "Geist, sans-serif" }}>{tool.name}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <ChevronRight width={11} height={11} strokeWidth={2.5} className="text-muted-foreground group-hover/card:text-foreground group-hover/card:translate-x-0.5" style={{ transition: "color 0.15s, transform 0.15s" }} />
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
      className="flex items-center gap-1.5 cursor-pointer bg-muted border border-border rounded text-foreground text-[12px] font-medium"
      style={{ fontFamily: "Geist, sans-serif", padding: "4px 10px" }}
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
        className="bg-card rounded-[14px] relative flex flex-col" style={{ width: "min(820px, 94vw)", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.22)" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-border">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl shrink-0 overflow-hidden bg-muted" style={{ background: selectedClient?.icon ? "transparent" : undefined }}>
              {selectedClient?.icon ? (
                <img src={selectedClient.icon} alt={selectedClient.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
              ) : (
                <MushroomIcon />
              )}
            </div>
            <div>
              <h2 className="text-foreground font-bold text-[19px] tracking-[-0.02em] m-0" style={{ fontFamily: "Geist, sans-serif" }}>Cluster Configuration</h2>
              <p className="text-muted-foreground text-[13px] mt-[1px] m-0" style={{ fontFamily: "Geist, sans-serif" }}>{selectedClient?.title ?? cluster.client}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer flex items-center justify-center bg-transparent border-0 text-muted-foreground p-1 rounded-md leading-none"
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
                <p className="text-muted-foreground font-bold text-[11px] uppercase tracking-[0.07em] m-0 mb-[7px]" style={{ fontFamily: "Geist, sans-serif" }}>MCP URL</p>
                <div
                  className="flex items-center justify-between gap-3 px-4 bg-card border-[1.5px] border-input rounded-lg"
                  style={{ height: 46 }}
                >
                  <span className="text-foreground text-[13px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: "monospace" }}>{mcpUrl}</span>
                  <CopyButton text={mcpUrl} />
                </div>
              </div>

              {/* JSON Config */}
              <div>
                <p className="text-muted-foreground font-bold text-[11px] uppercase tracking-[0.07em] m-0 mb-[7px]" style={{ fontFamily: "Geist, sans-serif" }}>JSON Config</p>
                <div className="relative bg-primary rounded-[10px]" style={{ padding: "14px 18px 18px" }}>
                  <div className="flex justify-end mb-2">
                    <CopyButton text={configJson} />
                  </div>
                  <pre className="text-primary-foreground text-[13px] m-0 leading-[1.65] whitespace-pre overflow-x-auto" style={{ fontFamily: "'JetBrains Mono', 'Fira Mono', monospace" }}>{configJson}</pre>
                </div>
              </div>
            </div>

            {/* Right: setup steps — no card borders, just circle + text */}
            <div className="shrink-0 flex flex-col" style={{ width: 230 }}>
              <p className="text-muted-foreground font-bold text-[11px] uppercase tracking-[0.07em] m-0 mb-[14px]" style={{ fontFamily: "Geist, sans-serif" }}>Setup Steps</p>
              <div className="flex flex-col border-[1.5px] border-input rounded-[10px] overflow-hidden">
                {steps.map((step, i) => (
                  <div
                    key={step.num}
                    className="flex items-start gap-3 px-4 py-3.5"
                    style={{ borderTop: i === 0 ? "none" : "1px solid hsl(var(--border))" }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0 rounded-full"
                      style={{
                        width: 26, height: 26, fontSize: 12, fontWeight: 700, marginTop: 1,
                        background: step.done ? "hsl(var(--primary))" : "hsl(var(--card))",
                        border: step.done ? "none" : "1.5px solid hsl(var(--border))",
                        color: step.done ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {step.done ? <Check width={13} height={13} strokeWidth={3} /> : step.num}
                    </div>
                    <div>
                      <p className="text-foreground font-semibold text-[13px] m-0 leading-[1.3]" style={{ fontFamily: "Geist, sans-serif" }}>{step.title}</p>
                      <p className="text-muted-foreground text-[12px] m-0 mt-[3px] leading-[1.4]" style={{ fontFamily: "Geist, sans-serif" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video — full width below */}
          <div
            className="relative flex flex-col items-center justify-center cursor-pointer overflow-hidden w-full bg-primary rounded-xl"
            style={{ minHeight: 200 }}
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
        <div className="flex justify-end px-7 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground border-0 rounded-[7px] text-[14px] font-semibold tracking-[-0.01em]" style={{ fontFamily: "Geist, sans-serif", padding: "10px 22px" }}
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
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showPanel, setShowPanel] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setShowAccount(false);
      }
    }
    if (showAccount) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAccount]);

  const tools = useAppSelector((s) => s.tools.byMcpServerId[cluster.id] ?? []);
  const toolsLoading = useAppSelector((s) => s.tools.loadingFor[cluster.id] ?? false);
  const hasTools = tools.length > 0;

  const [toolsWasLoading, setToolsWasLoading] = useState(false);
  const [toolsHasFetched, setToolsHasFetched] = useState(false);

  useEffect(() => {
    if (toolsLoading) setToolsWasLoading(true);
    if (!toolsLoading && toolsWasLoading) setToolsHasFetched(true);
  }, [toolsLoading, toolsWasLoading]);

  const embedToken = useAppSelector((s) => s.clusters.embedTokenByClusterId[cluster.id] ?? null);
  const embedScriptLoaded = useRef(false);
  const [embedReady, setEmbedReady] = useState(false);

  useEffect(() => {
    async function handleMessage(e: MessageEvent) {
      if (e.data?.type === "send_embed_data") {
        setEmbedReady(true);
      }
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
            payload: { body: {} },
            desc: (e.data.description as string) || (e.data.title as string) || "",
            status: (e.data.action as string) ?? (e.data.status as string) ?? "active",
            title: (e.data.title as string) ?? "",
            mcpServerId: cluster.id,
                      });
          if (res.data?.data) dispatch(upsertTool({
            ...res.data.data,
            serviceIcons: (e.data.serviceIcons as string[]) ?? res.data.data.serviceIcons ?? [],
          }));
        } catch (err) {
          console.error("[ClusterView] MCP tool API error:", err);
        }
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [cluster.id, dispatch]);

  useEffect(() => {
    if (!embedToken || embedScriptLoaded.current) return;
    const existing = document.getElementById(process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID!);
    if (existing) existing.parentNode?.removeChild(existing);
    const existingContainer = document.getElementById("iframe-viasocket-embed-parent-container");
    if (existingContainer) existingContainer.parentNode?.removeChild(existingContainer);
    const script = document.createElement("script");
    script.id = process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID!;
    script.src = process.env.NEXT_PUBLIC_EMBED_SCRIPT_SRC!;
    script.setAttribute("embedToken", embedToken);
    script.setAttribute("parentId", "viasocketParentId");
    document.body.appendChild(script);
    embedScriptLoaded.current = true;
    return () => {
      try {
        const s = document.getElementById(process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID!);
        if (s?.parentNode === document.body) document.body.removeChild(s);
        const container = document.getElementById("iframe-viasocket-embed-parent-container");
        if (container) container.parentNode?.removeChild(container);
      } catch (e) {
        console.warn("Error removing embed script:", e);
      }
      embedScriptLoaded.current = false;
    };
  }, [embedToken]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="shrink-0">
        <div className="w-full px-6 bg-card border-b border-border">
          <div className="flex items-center justify-between h-16 w-full">
            <div className="flex-1 min-w-0 flex items-center self-stretch">
              <h2 className="text-foreground font-extrabold text-[22px] tracking-[-0.03em] m-0" style={{ fontFamily: "Geist, sans-serif" }}>
                {cluster.name}
              </h2>
            </div>

            {/* Tabs */}

            <div className="flex-1 min-w-0 flex justify-end items-center gap-1.5">
              <div ref={accountRef} className="relative">
                {showAccount && <AccountPanel onClose={() => setShowAccount(false)} />}
                <button
                  onClick={() => setShowAccount((v) => !v)}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-primary"
                  style={{ border: "none", flexShrink: 0 }}
                >
                  <User width={15} height={15} strokeWidth={2} style={{ color: "#fff" }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 px-24 pt-4 pb-3 flex justify-center overflow-hidden">
        <div className="w-full flex flex-col h-full">

          {/* Client card */}
            <div
              className="overflow-visible relative bg-card border border-border" style={{ borderBottom: "none", boxShadow: "none", borderRadius: "6px 6px 0 0" }}
              onMouseEnter={() => setHeaderHovered(true)}
              onMouseLeave={() => setHeaderHovered(false)}
            >
              <div className="flex items-center justify-between p-4 px-5">
                <div className="flex items-center gap-2 ml-1">
                  {cluster.selectedClient?.icon ? (
                    <div style={{ width: 24, height: 24, borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                      <img src={cluster.selectedClient.icon} alt={cluster.selectedClient.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <ClientIcon clientId={cluster.client} color={cluster.clientColor} />
                  )}
                  <span className="text-foreground text-[15px]" style={{ fontFamily: "Geist, sans-serif" }}>{cluster.selectedClient?.title ?? cluster.client}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Change AI Client — visible on hover */}
                  <button
                    onClick={onChangeClient}
                    className="flex items-center gap-2 cursor-pointer bg-secondary text-foreground border border-border text-[12px] font-semibold tracking-[-0.01em] rounded"
                    style={{ fontSize: 12, padding: "6px 14px", height: 34, fontFamily: "Geist, sans-serif", transition: "opacity 0.15s", opacity: headerHovered ? 1 : 0, pointerEvents: headerHovered ? "auto" : "none" }}
                  >
                    Change AI Client
                  </button>

                  {/* Connect button — only when tools exist */}
                  {hasTools && (
                    <div className="relative group">
                      <button
                        onClick={() => setShowConfigModal(true)}
                        className="flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground border-0 text-[13px] font-semibold tracking-[-0.01em] rounded" style={{ fontSize: 13, padding: "0px 16px", height: 34, fontFamily: "Geist, sans-serif" }}
                      >
                        Connect
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                      </button>

                      {/* Tooltip — shown on hover */}
                      <div
                        className="absolute z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-primary text-primary-foreground rounded-lg" style={{ top: "calc(100% + 8px)", right: 0, padding: "10px 14px", width: 220, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
                      >
                        <p style={{ margin: 0, fontSize: 13, fontFamily: "Geist, sans-serif", lineHeight: 1.45 }}>
                          Your power-ups are ready. Connect your client to activate them.
                        </p>
                        {/* Arrow */}
                        <div style={{ position: "absolute", top: -6, right: 16, width: 12, height: 12, background: "hsl(var(--primary))", transform: "rotate(45deg)", borderRadius: 2 }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          {/* Power-ups area */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <div
              className="flex-1 min-h-0 overflow-hidden flex flex-col relative bg-card border border-border" style={{ borderRadius: "0 0 6px 6px", boxShadow: "rgba(0,0,0,0.04) 0px 1px 3px" }}
            >
              {!showPanel && (
                <div className="shrink-0 px-3 pt-3 pb-3">
                  <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
                    <button
                      onClick={() => setShowPanel(true)}
                      className="relative overflow-hidden group/add cursor-pointer text-left" style={{ background: "hsl(var(--secondary))", border: "2px dashed hsl(var(--border))", transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s", borderRadius: 4 }}
                    >
                      <div className="flex items-center gap-2.5 px-3 py-3">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-full bg-muted border-[1.5px] border-border">
                          <Plus width={16} height={16} strokeWidth={2} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-foreground font-medium text-[13px] tracking-[-0.01em] m-0" style={{ fontFamily: "Geist, sans-serif" }}>Add Power-Up</p>
                        </div>
                      </div>
                    </button>
                    {!toolsHasFetched
                      ? [1, 2, 3].map((i) => (
                          <div key={i} className="bg-muted rounded" style={{ height: 58, animation: "pulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.08}s` }} />
                        ))
                      : <ToolCards clusterId={cluster.id} onOpenPanel={() => setShowPanel(true)} />}
                  </div>
                </div>
              )}

              {/* #viasocketParentId always in DOM so embed script finds it on load */}
              <div
                className="absolute inset-0 z-20"
                style={{
                  visibility: showPanel ? "visible" : "hidden",
                  pointerEvents: showPanel ? "auto" : "none",
                  flexDirection: "column",
                  borderRadius: 8,
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                {/* Panel header — shown only after embed iframe is ready */}
                {embedReady && (
                  <div
                    className="shrink-0 flex items-center justify-between px-4 bg-muted/50 border-b border-border" style={{ height: 44, borderRadius: "6px 6px 0 0" }}
                  >
                    <span className="text-foreground font-semibold text-[13px] tracking-[-0.01em]" style={{ fontFamily: "Geist, sans-serif" }}></span>
                    <button
                      onClick={() => setShowPanel(false)}
                      className="flex items-center justify-center cursor-pointer bg-transparent text-muted-foreground border-0 shadow-none p-1.5 rounded"
                    >
                      <X width={18} height={18} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
                {/* Embed mounts here */}
                <div id="viasocketParentId" className="flex-1 min-h-0 w-full" />
              </div>

              {!showPanel && toolsHasFetched && tools.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
                  <div className="w-14 h-14 flex items-center justify-center mb-5 bg-muted rounded-[14px]" style={{ border: "1.5px solid hsl(var(--border))" }}>
                    <Zap width={22} height={22} strokeWidth={2} className="text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-bold text-[17px] m-0 tracking-[-0.01em]" style={{ fontFamily: "Geist, sans-serif" }}>No power-ups yet</p>
                  <p className="text-muted-foreground text-[14px] leading-[1.55] mt-2 m-0" style={{ fontFamily: '"DM Sans", sans-serif', maxWidth: 320 }}>
                    Add your first power-up to give{" "}
                    <strong className="text-foreground font-semibold">{cluster.client}</strong>{" "}
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
