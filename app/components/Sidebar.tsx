"use client";

import { useState, useEffect } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

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
  selectedClient: AiClient | null;
}

interface SidebarProps {
  clusters: Cluster[];
  activeClusterId: string | null;
  onSelectCluster: (id: string) => void;
  onNewCluster: () => void;
}

function ClusterIcon({ cluster, active }: { cluster: Cluster; active: boolean }) {
  if (cluster.selectedClient?.icon) {
    return (
      <div style={{ width: 20, height: 20, flexShrink: 0, borderRadius: 4, overflow: "hidden" }}>
        <img src={cluster.selectedClient.icon} alt={cluster.selectedClient.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  const color = cluster.clientColor;
  if (color === "#D97757") {
    return (
      <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 64 64" fill="none">
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
  const iconColor = active ? color : "#c4c9d4";
  const stemColor = active ? color : "#d0d4db";
  return (
    <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 64 64" fill="none">
        <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill={iconColor} />
        <path d="M24 38H40V54C40 56.2 38.2 58 36 58H28C25.8 58 24 56.2 24 54V38Z" fill={stemColor} />
      </svg>
    </div>
  );
}

export default function Sidebar({
  clusters,
  activeClusterId,
  onSelectCluster,
  onNewCluster,
}: SidebarProps) {
  const router = useRouter();
  const clustersLoading = useAppSelector((s) => s.clusters.loading);
  const [wasLoading, setWasLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(clusters.length > 0);

  useEffect(() => {
    if (clusters.length > 0) { setHasFetched(true); return; }
    if (clustersLoading) setWasLoading(true);
    if (!clustersLoading && wasLoading) setHasFetched(true);
  }, [clustersLoading, wasLoading, clusters.length]);

  return (
    <aside
      className="shrink-0 h-screen sticky top-0 flex flex-col border-r bg-card border-border"
      style={{ width: 260 }}
    >
      {/* Logo */}
      <div className="px-5 flex items-center gap-3 border-b border-border">
        <a className="flex items-center gap-2.5 no-underline h-16" href="/">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill="currentColor" />
              <path d="M4 38C4 40 6 42 10 42H54C58 42 60 40 60 38H4Z" fill="currentColor" opacity="0.8" />
              <path d="M24 42H40V56C40 58.2 38.2 60 36 60H28C25.8 60 24 58.2 24 56V42Z" fill="currentColor" />
              <path d="M29 42H35V56C35 57.1 34.1 58 33 58H31C29.9 58 29 57.1 29 56V42Z" fill="currentColor" opacity="0.2" />
              <circle cx="18" cy="26" r="1.8" fill="#ffffff" />
              <circle cx="32" cy="16" r="1.8" fill="#ffffff" />
              <circle cx="46" cy="26" r="1.8" fill="#ffffff" />
              <line x1="18" y1="26" x2="32" y2="16" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
              <line x1="32" y1="16" x2="46" y2="26" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-foreground font-extrabold text-[22px] tracking-[-0.03em] leading-none" style={{ fontFamily: "Geist, sans-serif" }}>Mushrooms</span>
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground">by viasocket</span>
          </div>
        </a>
      </div>

      {/* Cluster list + New Cluster */}
      <div className="px-3 pt-4 flex-1 overflow-y-auto relative">
        <div className="mb-4">
          <button
            onClick={onNewCluster}
            className="flex items-center gap-2 cursor-pointer w-full justify-center bg-card text-foreground border border-border rounded text-sm font-semibold tracking-[-0.01em] transition-shadow"
            style={{ fontSize: 14, padding: "10px 36px", height: 34, fontFamily: "Geist, sans-serif" }}
          >
            <Plus width={14} height={14} strokeWidth={2.5} />
            New Cluster
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {!hasFetched && (
            [1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded h-9">
                <div className="w-5 h-5 rounded bg-muted shrink-0" style={{ animation: "pulse 1.4s ease-in-out infinite" }} />
                <div className="flex-1 h-[11px] rounded bg-muted" style={{ animation: "pulse 1.4s ease-in-out infinite", animationDelay: "0.1s" }} />
              </div>
            ))
          )}
          {hasFetched && clusters.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-2 py-4 bg-background border border-border rounded-md">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-muted border border-border">
                <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
                  <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill="currentColor" className="text-muted-foreground" />
                  <path d="M4 38C4 40 6 42 10 42H54C58 42 60 40 60 38H4Z" fill="currentColor" opacity="0.7" />
                  <path d="M24 42H40V56C40 58.2 38.2 60 36 60H28C25.8 60 24 58.2 24 56V42Z" fill="currentColor" />
                </svg>
              </div>
              <p className="text-[11px] text-muted-foreground text-center leading-[1.4] m-0" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                No clusters yet. Create one to start powering up your AI.
              </p>
            </div>
          )}
          {clusters.map((cluster) => {
            const isActive = activeClusterId === cluster.id;
            return (
              <div key={cluster.id} className="relative">
                <button
                  onClick={() => onSelectCluster(cluster.id)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-left text-sm w-full transition-all rounded cursor-pointer"
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    background: isActive ? "hsl(var(--muted))" : "transparent",
                    color: isActive ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                    border: isActive ? "1px solid hsl(var(--border))" : "1px solid transparent",
                    boxShadow: isActive ? "rgba(0,0,0,0.06) 0px 1px 3px" : "none",
                    fontWeight: isActive ? 600 : 400,
                    transition: "0.15s",
                  }}
                >
                  <ClusterIcon cluster={cluster} active={isActive} />
                  <span className="flex-1 truncate">{cluster.name}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explore Embed */}
      <div className="px-3 pb-3">
        <div
          className="px-4 py-3 cursor-pointer bg-background border border-border"
          onClick={() => router.push("/embed")}
        >
          <p className="text-foreground font-bold text-[13px] m-0" style={{ fontFamily: "Geist, sans-serif" }}>Explore Embed</p>
          <p className="text-muted-foreground text-[11px] mt-[2px] mb-[6px] m-0" style={{ fontFamily: '"DM Sans", sans-serif' }}>Built for AI startups, agents &amp; companies shipping AI products</p>
          <span className="text-accent-green text-[12px] font-semibold inline-flex items-center gap-1" style={{ fontFamily: "Geist, sans-serif" }}>
            See what&apos;s inside <ArrowRight width={11} height={11} strokeWidth={2.5} />
          </span>
        </div>
      </div>

    </aside>
  );
}
