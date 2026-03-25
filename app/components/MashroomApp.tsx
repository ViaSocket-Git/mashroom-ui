"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
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

export default function MashroomApp() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const clusters = useAppSelector((s) => s.clusters.clusters);
  const activeClusterId = useAppSelector((s) => s.clusters.activeClusterId);
  const loading = useAppSelector((s) => s.clusters.loading);
  const userIdLoaded = useAppSelector((s) => s.clusters.userId !== null);
  const aiClientsLoaded = useAppSelector((s) => s.aiClients.clients.length > 0);
  const clustersLoaded = useAppSelector((s) => s.clusters.clusters.length > 0);

  useEffect(() => {
    if (!userIdLoaded) {
      dispatch(fetchCurrentUser()).then(() => {
        dispatch(fetchAiClients()).then(() => {
          if (!clustersLoaded) dispatch(fetchClusters());
        });
      });
    } else if (!aiClientsLoaded) {
      dispatch(fetchAiClients()).then(() => {
        if (!clustersLoaded) dispatch(fetchClusters());
      });
    } else if (!clustersLoaded) {
      dispatch(fetchClusters());
    }
  }, [dispatch, userIdLoaded, aiClientsLoaded, clustersLoaded]);

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

  // const isInitializing = !userIdLoaded || !aiClientsLoaded || !clustersLoaded;

  // if (isInitializing) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center" style={{ background: "rgb(248,249,251)" }}>
  //       <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
  //         <div style={{ width: 36, height: 36, border: "3px solid rgb(220,220,220)", borderTopColor: "rgb(10,10,10)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
  //         <span style={{ fontFamily: "Geist, sans-serif", fontSize: 13, color: "rgb(140,140,140)" }}>Loading…</span>
  //       </div>
  //     </div>
  //   );
  // }

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

      <main className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute top-4 right-4 z-10 text-xs px-3 py-1.5 rounded" style={{ background: "rgb(243,244,246)", color: "rgb(100,116,139)", fontFamily: "Geist, sans-serif" }}>
            Creating cluster…
          </div>
        )}
        {activeCluster ? (
          <ClusterView cluster={activeCluster} onAddPowerUp={handleAddPowerUp} onChangeClient={handleChangeClient} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center h-full" style={{ background: "rgb(248,249,251)" }}>
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
