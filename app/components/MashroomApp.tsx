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
  const loading = useAppSelector((s) => s.clusters.loading);
  useEffect(() => {
      dispatch(fetchCurrentUser())
      dispatch(fetchAiClients())
      dispatch(fetchClusters())

  }, [dispatch]);

  useEffect(() => {
    if (activeClusterId) {
      router.push(`/cluster/${activeClusterId}`);
    }
  }, [activeClusterId]);

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

  function handleChangeClient() {
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
    } else if (modalMode === "changeClient" && activeCluster) {
      dispatch(updateClusterClient({
        clusterId: activeCluster.id,
        client: client.title,
        clientColor,
      }));
      dispatch(setClusterSelectedClient({ clusterId: activeCluster.id, client }));
      dispatch(updateClusterOnServer({ mcpServerId: activeCluster.id, name: activeCluster.name, client: client.title }));
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


  return (
    <div className="min-h-screen flex" style={{ background: "rgb(248,249,251)" }}>
      <Sidebar
        clusters={clusters}
        activeClusterId={activeClusterId ?? ""}
        onSelectCluster={(id) => {
          dispatch(setActiveCluster(id));
          router.push(`/cluster/${id}`);
        }}
        onNewCluster={handleNewCluster}
      />

      <main className="flex-1 relative overflow-hidden flex flex-col">
        {loading && (
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
              <div className="w-full px-6" style={{ background: "rgb(255,255,255)", borderBottom: "1px solid rgb(226,232,240)" }}>
                <div className="flex items-center justify-end h-16 w-full">
                  <EmptyAccountButton />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-5" style={{ maxWidth: 420 }}>
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
                Create your first cluster
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>

              {/* Steps */}
              <div className="flex items-center gap-3 mt-2">
                {[
                  { step: "STEP 1", label: "Pick your power-ups" },
                  { step: "STEP 2", label: "Your AI absorbs them" },
                  { step: "STEP 3", label: "Actions on autopilot" },
                ].map(({ step, label }, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-0.5">
                      <span style={{ fontFamily: "Geist, sans-serif", fontSize: 9, fontWeight: 600, color: "rgb(148,163,184)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{step}</span>
                      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgb(100,116,139)", whiteSpace: "nowrap" }}>{label}</span>
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
