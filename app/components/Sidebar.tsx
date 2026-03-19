"use client";

import { Plus, HelpCircle, User, ChevronRight } from "lucide-react";

interface Cluster {
  id: string;
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

function ClientDot({ color }: { color: string }) {
  if (color === "#D97757") {
    return (
      <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="none">
        <path d="M8 1L2 4.5v7L8 15l6-3.5v-7L8 1z" fill="#D97757" />
        <path d="M8 4l-3 1.75v3.5L8 11l3-1.75V5.75L8 4z" fill="#F5A98A" />
      </svg>
    );
  }
  return (
    <span
      className="w-3.5 h-3.5 rounded-full shrink-0 inline-block"
      style={{ background: color }}
    />
  );
}

export default function Sidebar({
  clusters,
  activeClusterId,
  onSelectCluster,
  onNewCluster,
}: SidebarProps) {
  return (
    <aside className="w-[175px] min-w-[175px] bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none">
            <ellipse cx="18" cy="24" rx="8" ry="5.5" fill="#1a1a1a" />
            <ellipse cx="18" cy="13" rx="11" ry="8" fill="#1a1a1a" />
            <circle cx="14" cy="11.5" r="2" fill="white" opacity="0.3" />
            <circle cx="22" cy="10" r="1.2" fill="white" opacity="0.3" />
            <rect x="14.5" y="18" width="7" height="11" rx="1.5" fill="#1a1a1a" />
          </svg>
          <div>
            <p className="font-bold text-sm text-base-content leading-tight">Mushrooms</p>
            <p className="text-[9px] text-base-content/40 tracking-widest uppercase font-medium">by viasocket</p>
          </div>
        </div>
      </div>

      {/* New Cluster */}
      <div className="px-3 pt-3">
        <button
          onClick={onNewCluster}
          className="w-full flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Cluster
        </button>
      </div>

      {/* Cluster list */}
      <nav className="flex-1 px-3 pt-2 overflow-y-auto">
        {clusters.map((cluster) => (
          <button
            key={cluster.id}
            onClick={() => onSelectCluster(cluster.id)}
            className={`w-full flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-sm font-medium transition-all mb-0.5 text-left ${
              activeClusterId === cluster.id
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ClientDot color={cluster.clientColor} />
            <span className="truncate">{cluster.name}</span>
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 mt-auto">
        <button className="w-full flex items-center justify-between h-9 px-3 mb-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <span>Explore Embed</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
          <HelpCircle className="w-4 h-4" />
          Support
        </button>
        <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
          <User className="w-4 h-4" />
          Account
        </button>
      </div>
    </aside>
  );
}
