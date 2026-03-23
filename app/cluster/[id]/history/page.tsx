"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActiveCluster, fetchClusters } from "@/lib/features/clustersSlice";
import { fetchAiClients } from "@/lib/features/aiClientsSlice";
import Sidebar from "@/app/components/Sidebar";
import AIClientModal from "@/app/components/AIClientModal";
import { createCluster } from "@/lib/features/clustersSlice";
import type { AiClient } from "@/lib/features/aiClientsSlice";
import { ChevronRight } from "lucide-react";

const DUMMY_HISTORY = [
  { time: "03:42 PM", app: "Slack",    appColor: "#4A154B", action: "Sent message to #engineering",               tool: "send_message",     status: "success" },
  { time: "03:38 PM", app: "GitHub",   appColor: "#24292e", action: 'Created PR #482 — "Fix auth token refresh"', tool: "create_pr",        status: "success" },
  { time: "03:21 PM", app: "Gmail",    appColor: "#EA4335", action: "Sent email to design@acme.co",               tool: "send_email",        status: "success" },
  { time: "03:05 PM", app: "Notion",   appColor: "#000000", action: 'Created page "Q2 OKRs — Engineering"',       tool: "create_page",       status: "success" },
  { time: "02:52 PM", app: "Stripe",   appColor: "#635BFF", action: "Retrieve invoice #INV-2048",                 tool: "get_invoice",       status: "failed"  },
  { time: "02:30 PM", app: "Jira",     appColor: "#0052CC", action: 'Moved PROJ-234 to "In Review"',              tool: "transition_issue",  status: "success" },
  { time: "02:12 PM", app: "HubSpot",  appColor: "#FF7A59", action: "Updated contact — Jamie Rodriguez",          tool: "update_contact",    status: "success" },
  { time: "01:58 PM", app: "Slack",    appColor: "#4A154B", action: "Updated channel topic in #design",           tool: "set_topic",         status: "success" },
  { time: "01:40 PM", app: "GitHub",   appColor: "#24292e", action: "Merged PR #479 into main",                   tool: "merge_pr",          status: "success" },
  { time: "01:22 PM", app: "Notion",   appColor: "#000000", action: 'Updated database "Sprint Board"',            tool: "update_database",   status: "failed"  },
  { time: "01:05 PM", app: "Linear",   appColor: "#5E6AD2", action: 'Created issue ENG-891 — "API rate limiter"', tool: "create_issue",      status: "success" },
  { time: "12:48 PM", app: "Figma",    appColor: "#F24E1E", action: 'Exported assets from "Homepage v3"',         tool: "export_assets",     status: "success" },
  { time: "12:30 PM", app: "Discord",  appColor: "#5865F2", action: "Posted announcement in #general",            tool: "send_message",      status: "success" },
  { time: "12:15 PM", app: "Gmail",    appColor: "#EA4335", action: "Failed to send — quota exceeded",            tool: "send_email",        status: "failed"  },
  { time: "11:58 AM", app: "Airtable", appColor: "#18BFFF", action: "Added 10 records to Roadmap base",           tool: "create_records",    status: "success" },
  { time: "11:40 AM", app: "Slack",    appColor: "#4A154B", action: "Sent DM to @john.doe",                       tool: "send_message",      status: "success" },
  { time: "11:22 AM", app: "GitHub",   appColor: "#24292e", action: 'Opened issue #892 — "Perf regression"',      tool: "create_issue",      status: "success" },
];

type Filter = "All" | "Success" | "Failed";

function AppAvatar({ app, color }: { app: string; color: string }) {
  return (
    <div style={{ width: 26, height: 26, borderRadius: 6, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "white", flexShrink: 0, letterSpacing: "-0.02em" }}>
      {app[0]}
    </div>
  );
}

export default function HistoryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = typeof params.id === "string" ? params.id : (params.id?.[0] ?? "");

  const clusters = useAppSelector((s) => s.clusters.clusters);
  const activeClusterId = useAppSelector((s) => s.clusters.activeClusterId);
  const loading = useAppSelector((s) => s.clusters.loading);
  const clustersLoaded = useAppSelector((s) => s.clusters.clusters.length > 0);
  const aiClientsLoaded = useAppSelector((s) => s.aiClients.clients.length > 0);

  useEffect(() => {
    if (!clustersLoaded) dispatch(fetchClusters());
    if (!aiClientsLoaded) dispatch(fetchAiClients());
  }, [dispatch, clustersLoaded, aiClientsLoaded]);

  useEffect(() => {
    if (id && id !== activeClusterId) {
      dispatch(setActiveCluster(id));
    }
  }, [id, activeClusterId, dispatch]);

  const cluster = clusters.find((c) => c.id === id) ?? null;

  const [filter, setFilter] = useState<Filter>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const successCount = DUMMY_HISTORY.filter((h) => h.status === "success").length;
  const failedCount  = DUMMY_HISTORY.filter((h) => h.status === "failed").length;

  const filtered = filter === "All" ? DUMMY_HISTORY
    : filter === "Success" ? DUMMY_HISTORY.filter((h) => h.status === "success")
    : DUMMY_HISTORY.filter((h) => h.status === "failed");

  function handleClientSelect(client: AiClient) {
    dispatch(createCluster({ client: client.title, clientColor: "#D97757" }));
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "rgb(248,249,251)" }}>
      <Sidebar
        clusters={clusters}
        activeClusterId={id}
        onSelectCluster={(clusterId) => {
          dispatch(setActiveCluster(clusterId));
          router.push(`/cluster/${clusterId}`);
        }}
        onNewCluster={() => setIsModalOpen(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0">
          <div className="w-full px-6" style={{ background: "rgb(255,255,255)", borderBottom: "1px solid rgb(226,232,240)" }}>
            <div className="flex items-center justify-between h-16 w-full">
              {/* Cluster name */}
              <div className="flex-1 min-w-0 flex items-center">
                <h2 style={{ fontFamily: "Geist, sans-serif", color: "rgb(10,10,10)", margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {cluster?.name ?? "History"}
                </h2>
              </div>

              {/* Tabs */}
              <div className="flex items-center" style={{ gap: 4, background: "rgb(243,244,246)", borderRadius: 8, padding: "3px" }}>
                <button
                  onClick={() => router.push(`/cluster/${id}`)}
                  className="flex items-center gap-1.5 cursor-pointer"
                  style={{ fontSize: 13, fontFamily: "Geist, sans-serif", fontWeight: 600, letterSpacing: "-0.01em", padding: "5px 14px", borderRadius: 6, border: "none", background: "transparent", color: "rgb(100,116,139)", boxShadow: "none" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/><rect x="2" y="14" width="7" height="7"/></svg>
                  Cluster
                </button>
                <button
                  className="flex items-center gap-1.5 cursor-pointer"
                  style={{ fontSize: 13, fontFamily: "Geist, sans-serif", fontWeight: 600, letterSpacing: "-0.01em", padding: "5px 14px", borderRadius: 6, border: "none", background: "rgb(255,255,255)", color: "rgb(10,10,10)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h6l3 9 4-6h5"/><path d="M3 21c3-3 6-3 9 0s6 3 9 0"/></svg>
                  History
                </button>
              </div>

              <div className="flex-1 min-w-0 flex justify-end" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-24 pt-5 pb-6">
          <div className="w-full">

            {/* Filter tabs + search row */}
            <div className="flex items-center justify-between mb-4" style={{ gap: 12 }}>
              <div className="flex items-center" style={{ gap: 2, background: "rgb(243,244,246)", borderRadius: 6, padding: "3px" }}>
                {(["All", "Success", "Failed"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      fontSize: 12, fontFamily: "Geist, sans-serif", fontWeight: 600, padding: "4px 12px", borderRadius: 5, border: "none", cursor: "pointer",
                      background: filter === f ? "rgb(255,255,255)" : "transparent",
                      color: filter === f ? "rgb(10,10,10)" : "rgb(100,116,139)",
                      boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    {f}
                    <span style={{ marginLeft: 5, fontSize: 11, color: filter === f ? "rgb(100,116,139)" : "rgb(148,163,184)" }}>
                      {f === "All" ? DUMMY_HISTORY.length : f === "Success" ? successCount : failedCount}
                    </span>
                  </button>
                ))}
              </div>

              <input
                placeholder="Search apps or actions…"
                style={{ fontSize: 12, fontFamily: "Geist, sans-serif", padding: "7px 12px", borderRadius: 6, border: "1px solid rgb(226,232,240)", background: "rgb(255,255,255)", color: "rgb(10,10,10)", outline: "none", width: 220 }}
              />
            </div>

            {/* Table */}
            <div style={{ background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", borderRadius: 8, overflow: "hidden" }}>
              {/* Table header */}
              <div className="grid" style={{ gridTemplateColumns: "120px 140px 1fr 100px 36px", padding: "8px 16px", borderBottom: "1px solid rgb(226,232,240)", background: "rgb(249,250,251)" }}>
                {["TIME", "POWER-UP", "ACTION", "STATUS", ""].map((h) => (
                  <span key={h} style={{ fontSize: 11, fontFamily: "Geist, sans-serif", fontWeight: 600, color: "rgb(148,163,184)", letterSpacing: "0.04em" }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {filtered.map((row, i) => (
                <div
                  key={i}
                  className="grid group cursor-pointer"
                  style={{ gridTemplateColumns: "120px 140px 1fr 100px 36px", padding: "11px 16px", borderBottom: i < filtered.length - 1 ? "1px solid rgb(243,244,246)" : "none", alignItems: "center", transition: "background 0.1s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgb(249,250,251)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', color: "rgb(100,116,139)", letterSpacing: "-0.01em" }}>{row.time}</span>

                  <div className="flex items-center gap-2">
                    <AppAvatar app={row.app} color={row.appColor} />
                    <span style={{ fontSize: 13, fontFamily: "Geist, sans-serif", fontWeight: 600, color: "rgb(10,10,10)" }}>{row.app}</span>
                  </div>

                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate" style={{ fontSize: 13, fontFamily: "Geist, sans-serif", color: "rgb(30,30,30)" }}>{row.action}</span>
                    <span style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', background: "rgb(243,244,246)", color: "rgb(100,116,139)", borderRadius: 4, padding: "1px 6px", whiteSpace: "nowrap", flexShrink: 0 }}>{row.tool}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {row.status === "success" ? (
                      <>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgb(34,197,94)", flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontFamily: "Geist, sans-serif", fontWeight: 600, color: "rgb(22,163,74)" }}>Success</span>
                      </>
                    ) : (
                      <>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgb(239,68,68)", flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontFamily: "Geist, sans-serif", fontWeight: 600, color: "rgb(220,38,38)" }}>Failed</span>
                      </>
                    )}
                  </div>

                  <ChevronRight width={14} height={14} style={{ color: "rgb(196,201,212)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <AIClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleClientSelect}
      />
    </div>
  );
}
