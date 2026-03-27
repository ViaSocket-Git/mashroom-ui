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
        className="relative w-full max-w-[720px] max-h-[85vh] overflow-hidden flex flex-col z-10 bg-card border border-border rounded"
        style={{ boxShadow: "rgba(0,0,0,0.12) 0px 25px 50px, rgba(0,0,0,0.03) 0px 0px 0px 1px", height: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-border">
          <div>
            <h2 className="text-foreground text-[20px] tracking-[-0.02em] m-0" style={{ fontFamily: "Geist, sans-serif" }}>Choose your AI client</h2>
            <p className="text-muted-foreground text-sm mt-1 m-0" style={{ marginTop: 4 }}>Which AI are you powering up?</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 cursor-pointer bg-transparent text-muted-foreground border-0 shadow-none p-2 rounded"
          >
            <X width={18} height={18} strokeWidth={2} />
          </button>
        </div>

        {/* Search */}
        <div className="px-7 pt-5 pb-0">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-secondary border border-border rounded">
            <Search width={15} height={15} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="px-7 py-5 overflow-y-auto flex-1">
          {loading && clients.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-[14px]" style={{ fontFamily: "Geist, sans-serif" }}>
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {filtered.map((client) => (
                <button
                  key={client.id}
                  onClick={() => onSelect(client)}
                  className="flex items-center gap-4 px-5 text-left cursor-pointer transition-all w-full bg-transparent border border-border rounded hover:border-border hover:bg-secondary"
                  style={{ boxShadow: "none", minHeight: 60, paddingTop: 14, paddingBottom: 14 }}
                >
                  <div className="w-9 h-9 flex items-center justify-center shrink-0">
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
                    <span className="text-foreground/70 text-[14px]" style={{ fontFamily: '"DM Sans", sans-serif' }}>{client.title}</span>
                    {client.popular && (
                      <span className="block text-[11px] text-muted-foreground mt-[1px]" style={{ fontFamily: "Geist, sans-serif" }}>Popular</span>
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
