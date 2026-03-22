"use client";

import { Plus, LifeBuoy, User, ArrowRight } from "lucide-react";

interface Cluster {
  _id: string;
  name: string;
  client: string;
  clientColor: string;
}

interface SidebarProps {
  clusters: Cluster[];
  activeClusterId: string | null;
  onSelectCluster: (id: string) => void;
  onNewCluster: () => void;
}

function ClusterIcon({ color, active }: { color: string; active: boolean }) {
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
          {clusters.map((cluster) => {
            const isActive = activeClusterId === cluster._id;
            return (
              <div key={cluster._id} className="relative">
                <button
                  onClick={() => onSelectCluster(cluster._id)}
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
                  }}
                >
                  <ClusterIcon color={cluster.clientColor} active={isActive} />
                  <span className="flex-1 truncate">{cluster.name}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explore Embed */}
      <div className="px-3 pb-2">
        <button
          className="flex items-center gap-2 cursor-pointer w-full justify-center"
          style={{
            background: "rgb(255,255,255)",
            color: "rgb(10,10,10)",
            border: "1px solid rgb(196,201,212)",
            boxShadow: "none",
            fontSize: 14,
            padding: "10px 18px",
            height: 34,
            fontFamily: "Geist, sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            borderRadius: 4,
            transition: "box-shadow 0.15s",
          }}
        >
          Explore Embed
          <ArrowRight width={13} height={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Support + Account */}
      <div className="px-3 py-2.5 border-t flex flex-col gap-0.5" style={{ borderColor: "rgb(226,232,240)" }}>
        <button
          className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer text-left w-full"
          style={{
            background: "transparent",
            color: "rgb(100,116,139)",
            fontFamily: '"DM Sans", sans-serif',
            borderRadius: 4,
            border: 0,
            transition: "box-shadow 0.15s, background 0.15s, border-color 0.15s",
          }}
        >
          <LifeBuoy width={15} height={15} strokeWidth={2} />
          Support
        </button>
        <button
          className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer text-left w-full"
          style={{
            background: "transparent",
            color: "rgb(100,116,139)",
            fontFamily: '"DM Sans", sans-serif',
            borderRadius: 4,
            border: 0,
            transition: "box-shadow 0.15s, background 0.15s, border-color 0.15s",
          }}
        >
          <User width={15} height={15} strokeWidth={2} />
          Account
        </button>
      </div>
    </aside>
  );
}
