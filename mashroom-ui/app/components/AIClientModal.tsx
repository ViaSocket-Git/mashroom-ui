"use client";

import React, { useState } from "react";
import { X, Search } from "lucide-react";
import { useAppSelector } from "../../lib/hooks";
import type { AiClient } from "../../lib/features/aiClientsSlice";

interface AIClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (client: AiClient) => void;
}

export default function AIClientModal({ isOpen, onClose, onSelect }: AIClientModalProps) {
  const [search, setSearch] = useState("");
  const { clients, loading } = useAppSelector((s) => s.aiClients);

  const sorted = [...clients].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  const filtered = sorted.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-[720px] max-h-[85vh] overflow-hidden flex flex-col z-10"
        style={{ background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", boxShadow: "rgba(0,0,0,0.12) 0px 25px 50px, rgba(0,0,0,0.03) 0px 0px 0px 1px", height: "85vh", borderRadius: 4 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: "rgb(226,232,240)" }}>
          <div>
            <h2 style={{ fontFamily: "Geist, sans-serif", color: "rgb(10,10,10)", fontSize: 20, letterSpacing: "-0.02em", margin: 0 }}>Choose your AI client</h2>
            <p className="mt-1 text-sm" style={{ color: "rgb(100,116,139)", margin: "4px 0 0" }}>Which AI are you powering up?</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 cursor-pointer"
            style={{ background: "rgba(0,0,0,0)", color: "rgb(148,163,184)", border: "none", boxShadow: "none", padding: 8, borderRadius: 4 }}
          >
            <X width={18} height={18} strokeWidth={2} />
          </button>
        </div>

        {/* Search */}
        <div className="px-7 pt-5 pb-0">
          <div className="flex items-center gap-2.5 px-4 py-2.5" style={{ background: "rgb(248,250,252)", border: "1px solid rgb(226,232,240)", borderRadius: 4 }}>
            <Search width={15} height={15} style={{ color: "rgb(148,163,184)", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-sm"
              style={{ color: "rgb(10,10,10)", fontFamily: '"DM Sans", sans-serif' }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="px-7 py-5 overflow-y-auto flex-1">
          {loading && clients.length === 0 ? (
            <div className="flex items-center justify-center h-32" style={{ color: "rgb(148,163,184)", fontFamily: "Geist, sans-serif", fontSize: 14 }}>
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {filtered.map((client) => (
                <button
                  key={client.id}
                  onClick={() => onSelect(client)}
                  className="flex items-center gap-4 px-5 text-left border-0 cursor-pointer transition-all w-full"
                  style={{ background: "rgba(0,0,0,0)", border: "1px solid rgb(238,239,242)", borderRadius: 4, boxShadow: "none", minHeight: 60, paddingTop: 14, paddingBottom: 14 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgb(196,201,212)"; (e.currentTarget as HTMLButtonElement).style.background = "rgb(248,250,252)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgb(238,239,242)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0)"; }}
                >
                  <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img
                      src={client.icon}
                      alt={client.title}
                      width={28}
                      height={28}
                      className={client.className}
                      style={{ objectFit: "contain", maxWidth: 28, maxHeight: 28 }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span style={{ color: "rgb(74,85,104)", fontFamily: '"DM Sans", sans-serif', fontSize: 14 }}>{client.title}</span>
                    {client.popular && (
                      <span style={{ display: "block", fontSize: 11, color: "rgb(148,163,184)", fontFamily: "Geist, sans-serif", marginTop: 1 }}>Popular</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
