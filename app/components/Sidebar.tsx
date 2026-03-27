"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, ArrowRight, MoreVertical } from "lucide-react";
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
  onChangeClient: (clusterId: string) => void;
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
  onChangeClient,
}: SidebarProps) {
  const router = useRouter();
  const clustersLoading = useAppSelector((s) => s.clusters.loading);
  const [wasLoading, setWasLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(clusters.length > 0);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    if (clusters.length > 0) { setHasFetched(true); return; }
    if (clustersLoading) setWasLoading(true);
    if (!clustersLoading && wasLoading) setHasFetched(true);
  }, [clustersLoading, wasLoading, clusters.length]);

  return (
    <aside
      className="shrink-0 h-screen sticky top-0 flex flex-col border-r"
      style={{ width: 260, background: "rgb(255,255,255)", borderColor: "rgb(226,232,240)" }}
    >
      {/* Logo */}
      <div className="px-5 flex items-center gap-3 border-b" style={{ borderColor: "rgb(226,232,240)" }}>
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
      </div>

      {/* Cluster list + New Cluster */}
      <div className="px-3 pt-4 flex-1 overflow-y-auto relative">
        <div className="mb-4">
          <button
            onClick={onNewCluster}
            className="flex items-center gap-2 cursor-pointer w-full justify-center"
            style={{
              background: "rgb(255,255,255)",
              color: "rgb(10,10,10)",
              border: "1px solid rgb(196,201,212)",
              boxShadow: "none",
              fontSize: 14,
              padding: "10px 36px",
              height: 34,
              fontFamily: "Geist, sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              borderRadius: 4,
              transition: "box-shadow 0.15s",
            }}
          >
            <Plus width={14} height={14} strokeWidth={2.5} />
            New Cluster
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {!hasFetched && (
            [1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2" style={{ borderRadius: 4, height: 36 }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: "rgb(226,232,240)", flexShrink: 0, animation: "pulse 1.4s ease-in-out infinite" }} />
                <div style={{ flex: 1, height: 11, borderRadius: 4, background: "rgb(226,232,240)", animation: "pulse 1.4s ease-in-out infinite", animationDelay: "0.1s" }} />
              </div>
            ))
          )}
          {hasFetched && clusters.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-2 py-4" style={{ background: "rgb(248,249,251)", border: "1px solid rgb(226,232,240)", borderRadius: 6 }}>
              <div className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: "rgb(240,241,243)", border: "1px solid rgb(208,212,219)" }}>
                <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
                  <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill="rgb(180,186,196)" />
                  <path d="M4 38C4 40 6 42 10 42H54C58 42 60 40 60 38H4Z" fill="rgb(160,166,176)" />
                  <path d="M24 42H40V56C40 58.2 38.2 60 36 60H28C25.8 60 24 58.2 24 56V42Z" fill="rgb(180,186,196)" />
                </svg>
              </div>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgb(100,116,139)", margin: 0, textAlign: "center", lineHeight: 1.4 }}>
                No clusters yet. Create one to start powering up your AI.
              </p>
            </div>
          )}
          {clusters.map((cluster) => {
            const isActive = activeClusterId === cluster.id;
            const isMenuOpen = openMenuId === cluster.id;
            return (
              <div key={cluster.id} className="relative group/cluster">
                <button
                  onClick={() => onSelectCluster(cluster.id)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-left text-sm w-full transition-all"
                  style={{
                    borderRadius: 4,
                    background: isActive ? "rgb(240,241,243)" : "transparent",
                    color: isActive ? "rgb(10,10,10)" : "rgb(100,116,139)",
                    fontFamily: '"DM Sans", sans-serif',
                    border: isActive ? "1px solid rgb(208,212,219)" : "1px solid rgb(232,235,240)",
                    boxShadow: isActive ? "rgba(0,0,0,0.06) 0px 1px 3px" : "none",
                    fontWeight: isActive ? 600 : 400,
                    transition: "0.15s",
                    cursor: "pointer",
                    paddingRight: 28,
                  }}
                >
                  <ClusterIcon cluster={cluster} active={isActive} />
                  <span className="flex-1 truncate">{cluster.name}</span>
                </button>

                {/* Ellipsis button — visible on hover or when menu open */}
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(isMenuOpen ? null : cluster.id); }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer opacity-0 group-hover/cluster:opacity-100 transition-opacity"
                  style={{
                    width: 22, height: 22, borderRadius: 4, border: "none",
                    background: isMenuOpen ? "rgb(226,232,240)" : "transparent",
                    color: "rgb(100,116,139)",
                    opacity: isMenuOpen ? 1 : undefined,
                  }}
                >
                  <MoreVertical width={13} height={13} strokeWidth={2} />
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 z-50"
                    style={{ top: "calc(100% + 4px)", minWidth: 150, background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", borderRadius: 6, boxShadow: "rgba(0,0,0,0.1) 0px 4px 16px", overflow: "hidden" }}
                  >
                    <button
                      onClick={() => { setOpenMenuId(null); onChangeClient(cluster.id); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 cursor-pointer text-left"
                      style={{ background: "transparent", border: "none", fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "rgb(10,10,10)", fontWeight: 500 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      Change AI Client
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explore Embed */}
      <div className="px-3 pb-3">
        <div
          className="px-4 py-3 cursor-pointer"
          style={{ background: "rgb(248,249,251)", border: "1px solid rgb(226,232,240)" }}
          onClick={() => router.push("/embed")}
        >
          <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: 13, color: "rgb(10,10,10)", margin: 0 }}>Explore Embed</p>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgb(100,116,139)", margin: "2px 0 6px" }}>Built for AI startups, agents &amp; companies shipping AI products</p>
          <span style={{ fontFamily: "Geist, sans-serif", fontSize: 12, fontWeight: 600, color: "#5CD2A2", display: "inline-flex", alignItems: "center", gap: 4 }}>
            See what&apos;s inside <ArrowRight width={11} height={11} strokeWidth={2.5} />
          </span>
        </div>
      </div>

    </aside>
  );
}
