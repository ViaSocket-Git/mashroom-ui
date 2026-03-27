"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import AccountPanel from "./AccountPanel";
import ClusterView from "./ClusterView";
import AIClientModal from "./AIClientModal";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setActiveCluster,
  updateClusterClient,
  addPowerUp,
  createCluster,
  setClusterSelectedClient,
  fetchClusters,
  updateClusterOnServer,
  fetchCurrentUser,
} from "@/lib/features/clustersSlice";
import { fetchAiClients } from "@/lib/features/aiClientsSlice";
import type { AiClient } from "@/lib/features/aiClientsSlice";

function EmptyAccountButton() {
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

  return (
    <div ref={accountRef} className="relative">
      {showAccount && <AccountPanel onClose={() => setShowAccount(false)} />}
      <button
        onClick={() => setShowAccount((v) => !v)}
        className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
        style={{ background: showAccount ? "rgb(10,10,10)" : "rgb(30,30,30)", border: "none", flexShrink: 0 }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
      </button>
    </div>
  );
}

export default function MashroomApp() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const clusters = useAppSelector((s) => s.clusters.clusters);
  const activeClusterId = useAppSelector((s) => s.clusters.activeClusterId);

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const init = async () => {
      dispatch(fetchCurrentUser());
      await dispatch(fetchAiClients());
      await dispatch(fetchClusters());
      setHasFetched(true);
    };
    init();
  }, [dispatch]);

  useEffect(() => {
    if (hasFetched && activeClusterId) {
      router.push(`/cluster/${activeClusterId}`);
    }
  }, [hasFetched, activeClusterId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"newCluster" | "addPowerUp" | "changeClient">("newCluster");

  const activeCluster = clusters.find((c) => c.id === activeClusterId) ?? null;

  function handleNewCluster() {
    setModalMode("newCluster");
    setIsModalOpen(true);
  }

  function handleAddPowerUp() {
    setModalMode("addPowerUp");
    setIsModalOpen(true);
  }

  const [targetClusterId, setTargetClusterId] = useState<string | null>(null);

  function handleChangeClient(clusterId?: string) {
    setTargetClusterId(clusterId ?? activeCluster?.id ?? null);
    setModalMode("changeClient");
    setIsModalOpen(true);
  }

  function handleClientSelect(client: AiClient) {
    const clientColor = "#D97757";
    if (modalMode === "newCluster") {
      dispatch(createCluster({ client: client.title, clientColor, selectedClient: client })).then((action: any) => {
        const newId = action.payload?.apiCluster?._id ?? action.payload?.id;
        if (newId) router.push(`/cluster/${newId}`);
      });
    } else if (modalMode === "changeClient" && targetClusterId) {
      const target = clusters.find((c) => c.id === targetClusterId);
      dispatch(updateClusterClient({ clusterId: targetClusterId, client: client.title, clientColor }));
      dispatch(setClusterSelectedClient({ clusterId: targetClusterId, client }));
      dispatch(updateClusterOnServer({ mcpServerId: targetClusterId, name: target?.name ?? "", client: client.title }));
    } else if (modalMode === "addPowerUp" && activeCluster) {
      dispatch(addPowerUp({
        clusterId: activeCluster.id,
        powerUp: {
          id: `pu-${Date.now()}`,
          name: `${client.title} Power-Up`,
          description: `Connected to ${client.title}`,
        },
      }));
    }
    setIsModalOpen(false);
  }


  if (!hasFetched) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: "rgb(248,249,251)" }}>
        <style>{`
          @keyframes mushroom-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes shadow-pulse { 0%,100%{transform:scaleX(1);opacity:.25} 50%{transform:scaleX(.6);opacity:.1} }
        `}</style>
        <div style={{ animation: "mushroom-bob 1.2s ease-in-out infinite" }}>
          <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <div style={{ width: 36, height: 6, borderRadius: "50%", background: "rgb(10,10,10)", animation: "shadow-pulse 1.2s ease-in-out infinite" }} />
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{ color: "rgb(10,10,10)", fontFamily: "Geist, sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>Mushrooms</span>
          <span style={{ color: "rgb(148,163,184)", fontFamily: "Geist, sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>by viasocket</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "rgb(248,249,251)" }}>
      {clusters.length > 0 && (
        <Sidebar
          clusters={clusters}
          activeClusterId={activeClusterId ?? ""}
          onSelectCluster={(id) => {
            dispatch(setActiveCluster(id));
            router.push(`/cluster/${id}`);
          }}
          onNewCluster={handleNewCluster}
          onChangeClient={(clusterId) => handleChangeClient(clusterId)}
        />
      )}

      <main className="flex-1 relative overflow-hidden flex flex-col">
        {!hasFetched && (
          <div className="absolute top-4 right-4 z-10 text-xs px-3 py-1.5 rounded" style={{ background: "rgb(243,244,246)", color: "rgb(100,116,139)", fontFamily: "Geist, sans-serif" }}>
            Creating cluster…
          </div>
        )}
        {activeCluster ? (
          <ClusterView cluster={activeCluster} onAddPowerUp={handleAddPowerUp} onChangeClient={handleChangeClient} />
        ) : (
          <div className="flex flex-col h-full" style={{ background: "rgb(248,249,251)" }}>
            {/* Header */}
            <div className="shrink-0">
              <div className="w-full px-6" style={{ background: "transparent" }}>
                <div className="flex items-center justify-between h-16 w-full">
                  <a className="flex items-center gap-2.5 no-underline" href="/">
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
                  <EmptyAccountButton />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-5">
              {/* Mushroom icon */}
              <div className="w-14 h-14 flex items-center justify-center rounded-full" style={{ background: "rgb(240,241,243)", border: "1px solid rgb(208,212,219)" }}>
                <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <path d="M4 38C4 18 16 4 32 4C48 4 60 18 60 38H4Z" fill="rgb(180,186,196)" />
                  <path d="M4 38C4 40 6 42 10 42H54C58 42 60 40 60 38H4Z" fill="rgb(160,166,176)" />
                  <path d="M24 42H40V56C40 58.2 38.2 60 36 60H28C25.8 60 24 58.2 24 56V42Z" fill="rgb(180,186,196)" />
                </svg>
              </div>

              {/* Heading */}
              <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: 28, color: "rgb(10,10,10)", letterSpacing: "-0.03em", margin: 0, textAlign: "center" }}>
                Power up your AI
              </p>

              {/* CTA button */}
              <button
                onClick={handleNewCluster}
                className="flex items-center gap-2 cursor-pointer"
                style={{ background: "rgb(10,10,10)", color: "#fff", border: "none", fontSize: 14, padding: "0 22px", height: 40, fontFamily: "Geist, sans-serif", fontWeight: 600, letterSpacing: "-0.01em", borderRadius: 6 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Plant your first power-up
              </button>

              {/* Steps */}
              <div className="flex items-center gap-6 mt-2">
                {[
                  { step: "STEP 1", label: "Pick your power-ups" },
                  { step: "STEP 2", label: "Your AI absorbs them" },
                  { step: "STEP 3", label: "Actions on autopilot" },
                ].map(({ step, label }, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex flex-col items-center text-center" style={{ minWidth: 160 }}>
                      <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 12, fontWeight: 600, color: "rgb(148,163,184)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{step}</span>
                      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 20, fontWeight: 700, color: "rgb(10,10,10)", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{label}</span>
                    </div>
                    {i < 2 && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(196,201,212)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        )}
      </main>

      <AIClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleClientSelect}
      />
    </div>
  );
}
