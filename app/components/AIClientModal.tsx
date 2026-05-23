"use client";

import React, { useState } from "react";
import { X, Search, Check } from "lucide-react";
import { useAppSelector } from "../../lib/hooks";
import type { AiClient } from "../../lib/features/aiClientsSlice";
import { submitAiClientRequest } from "../../lib/api/aiClientRequestApi";

interface AIClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (client: AiClient) => void;
}

export default function AIClientModal({ isOpen, onClose, onSelect }: AIClientModalProps) {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<AiClient | null>(null);
  const [requestForm, setRequestForm] = useState({ name: "", description: "" });
  const [showToast, setShowToast] = useState(false);
  const { clients, loading } = useAppSelector((s) => s.aiClients);

  const sorted = [...clients].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  const filtered = sorted.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  async function handleSubmitRequest() {
    const ok = await submitAiClientRequest({
      aiClientName: requestForm.name || search,
      description: requestForm.description,
      originalSearch: search,
      timestamp: new Date().toISOString(),
    });
    if (ok) {
      setShowToast(true);
      setRequestForm({ name: "", description: "" });
      setTimeout(() => setShowToast(false), 1000);
    }
  }

  function handleDone() {
    if (selectedClient) {
      onSelect(selectedClient);
      setSelectedClient(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setSelectedClient(null); onClose(); }} />
      <div
        className="relative w-full max-w-[720px] overflow-hidden flex flex-col z-[9999999]"
        style={{ background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", boxShadow: "rgba(0,0,0,0.12) 0px 25px 50px, rgba(0,0,0,0.03) 0px 0px 0px 1px", height: "85vh", borderRadius: 4 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: "rgb(226,232,240)" }}>
          <div>
            <h2 style={{ fontFamily: "Geist, sans-serif", color: "rgb(10,10,10)", fontSize: 20, letterSpacing: "-0.02em", margin: 0 }}>Choose your AI client</h2>
            <p className="mt-1 text-sm" style={{ color: "rgb(100,116,139)", margin: "4px 0 0" }}>Select an AI client to continue</p>
          </div>
          <button
            data-testid="ai-client-modal-close"
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
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-6">
              <div style={{ fontFamily: "Geist, sans-serif", fontSize: 17, fontWeight: 700, color: "rgb(10,10,10)", letterSpacing: "-0.01em", textAlign: "center" }}>
                AI NOT FOUND? WE&apos;LL BUILD IT.
              </div>
              <div className="flex flex-col gap-3 w-full max-w-sm">
                <input
                  type="text"
                  placeholder="AI Client Name"
                  value={requestForm.name}
                  onChange={(e) => setRequestForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2.5 outline-none"
                  style={{ border: "1px solid rgb(226,232,240)", borderRadius: 4, fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: "rgb(10,10,10)", background: "rgb(248,250,252)" }}
                />
                <textarea
                  placeholder="Additional Description (Optional)"
                  value={requestForm.description}
                  onChange={(e) => setRequestForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 outline-none resize-none"
                  style={{ border: "1px solid rgb(226,232,240)", borderRadius: 4, fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: "rgb(10,10,10)", background: "rgb(248,250,252)" }}
                />
                <button
                  onClick={handleSubmitRequest}
                  className="w-full py-2.5 font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "rgb(10,10,10)", color: "#fff", border: "none", borderRadius: 4, fontFamily: "Geist, sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Request for AI Client
                </button>
                <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgb(148,163,184)", textAlign: "center" }}>
                  We&apos;ll deliver your app within 6hr
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {filtered.map((client) => {
                const isSelected = selectedClient?.id === client.id;
                return (
                <button
                  data-testid={`ai-client-option-${client.id}`}
                  key={client.id}
                  onClick={() => setSelectedClient(isSelected ? null : client)}
                  className="flex items-center gap-4 px-5 text-left cursor-pointer transition-all w-full"
                  style={{
                    background: isSelected ? `${client.color}0D` : "rgba(0,0,0,0)",
                    border: isSelected ? `1.5px solid ${client.color}CC` : "1px solid rgb(238,239,242)",
                    borderRadius: 4, boxShadow: "none", minHeight: 60, paddingTop: 14, paddingBottom: 14
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgb(196,201,212)";
                      (e.currentTarget as HTMLButtonElement).style.background = "rgb(248,250,252)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgb(238,239,242)";
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0)";
                    }
                  }}
                >
                  <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {client.icon ? (
                      <img
                        src={client.icon}
                        alt={client.title}
                        width={28}
                        height={28}
                        className={client.className}
                        style={{ objectFit: "contain", maxWidth: 28, maxHeight: 28 }}
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span style={{ color: "rgb(74,85,104)", fontFamily: '"DM Sans", sans-serif', fontSize: 14 }}>{client.title}</span>
                    {client.popular && (
                      <span style={{ display: "block", fontSize: 11, color: "rgb(148,163,184)", fontFamily: "Geist, sans-serif", marginTop: 1 }}>Popular</span>
                    )}
                  </div>
                </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-7 py-4" style={{ borderTop: "1px solid rgb(226,232,240)" }}>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "rgb(148,163,184)" }}>
            {selectedClient ? `${selectedClient.title} selected` : "Select an AI client to continue"}
          </span>
          <button
            data-testid="ai-client-modal-done"
            onClick={handleDone}
            disabled={!selectedClient}
            className="flex items-center gap-2 cursor-pointer"
            style={{
              background: selectedClient ? "rgb(10,10,10)" : "rgb(243,244,246)",
              color: selectedClient ? "#fff" : "rgb(148,163,184)",
              border: "none", borderRadius: 6, padding: "10px 20px",
              fontFamily: "Geist, sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em",
              cursor: selectedClient ? "pointer" : "not-allowed", transition: "background 0.15s, color 0.15s",
            }}
          >
            Done
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </div>

        {showToast && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-lg z-[9999999]"
            style={{ background: "rgb(220,252,231)", border: "1px solid rgb(187,247,208)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", whiteSpace: "nowrap" }}
          >
            <Check width={15} height={15} stroke="rgb(22,163,74)" strokeWidth={2.5} />
            <span style={{ fontFamily: "Geist, sans-serif", fontSize: 13, fontWeight: 600, color: "rgb(22,163,74)" }}>
              Request Sent!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
