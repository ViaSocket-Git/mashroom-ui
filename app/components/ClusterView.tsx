"use client";

import { useState } from "react";
import { Radio, Clock, Share2, Plus, Zap } from "lucide-react";

interface PowerUp {
  id: string;
  name: string;
  description: string;
}

interface Cluster {
  id: string;
  name: string;
  client: string;
  clientColor: string;
  powerUps: PowerUp[];
}

interface ClusterViewProps {
  cluster: Cluster;
  onAddPowerUp: () => void;
}

type MainTab = "cluster" | "history";

function ClientIconSmall({ clientId, color }: { clientId: string; color: string }) {
  if (clientId.toLowerCase() === "claude") {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="#D97757" />
        <path d="M12 6l-4 2.5v5L12 16l4-2.5v-5L12 6z" fill="#F5A98A" />
      </svg>
    );
  }
  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
      style={{ background: color }}
    >
      {clientId[0]?.toUpperCase()}
    </div>
  );
}

export default function ClusterView({ cluster, onAddPowerUp }: ClusterViewProps) {
  const [activeTab, setActiveTab] = useState<MainTab>("cluster");

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6] overflow-hidden relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-0 flex items-center justify-between shrink-0 h-[52px]">
        {/* Left: title */}
        <div className="flex items-center">
          <h1 className="text-[15px] font-semibold text-gray-900">{cluster.name}</h1>
        </div>

        {/* Center: Cluster / History toggle */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <div className="flex items-center gap-[2px] bg-gray-100 rounded-lg px-[3px] py-[3px]">
            <button
              onClick={() => setActiveTab("cluster")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "cluster"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Cluster
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "history"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              History
            </button>
          </div>
        </div>

        {/* Right: Share */}
        <button className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Client card — wide, matches image */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 mb-4 flex items-center gap-3">
          <ClientIconSmall clientId={cluster.client} color={cluster.clientColor} />
          <span className="font-medium text-gray-800 text-sm">{cluster.client}</span>
        </div>

        {/* Add Power-Up — dashed card */}
        <div className="mb-8">
          <button
            onClick={onAddPowerUp}
            className="flex items-center gap-2 px-4 py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm font-medium hover:border-gray-400 hover:text-gray-600 hover:bg-white/60 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Power-Up
          </button>
        </div>

        {/* Empty state / Power-ups */}
        {cluster.powerUps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">No power-ups yet</h3>
            <p className="text-sm text-gray-400 text-center max-w-[220px] leading-relaxed">
              Add your first power-up to give{" "}
              <span className="text-blue-500 font-semibold">{cluster.client}</span>{" "}
              real-world actions across 2,000+ apps.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-w-2xl">
            {cluster.powerUps.map((pu) => (
              <div key={pu.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{pu.name}</p>
                  <p className="text-xs text-gray-400">{pu.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help button */}
      <div className="absolute bottom-4 right-4">
        <button className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors shadow-sm">
          ?
        </button>
      </div>
    </div>
  );
}
