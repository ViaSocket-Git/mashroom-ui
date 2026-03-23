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
} from "@/lib/features/clustersSlice";
import { fetchAiClients } from "@/lib/features/aiClientsSlice";
import type { AiClient } from "@/lib/features/aiClientsSlice";

export default function MashroomApp() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const clusters = useAppSelector((s) => s.clusters.clusters);
  const activeClusterId = useAppSelector((s) => s.clusters.activeClusterId);
  const loading = useAppSelector((s) => s.clusters.loading);

  useEffect(() => {
    dispatch(fetchClusters());
    dispatch(fetchAiClients());
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
      dispatch(createCluster({ client: client.title, clientColor, selectedClient: client }));
    } else if (modalMode === "changeClient" && activeCluster) {
      dispatch(updateClusterClient({
        clusterId: activeCluster.id,
        client: client.title,
        clientColor,
      }));
      dispatch(setClusterSelectedClient({ clusterId: activeCluster.id, client }));
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

      <main className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute top-4 right-4 z-10 text-xs px-3 py-1.5 rounded" style={{ background: "rgb(243,244,246)", color: "rgb(100,116,139)", fontFamily: "Geist, sans-serif" }}>
            Creating cluster…
          </div>
        )}
        {activeCluster ? (
          <ClusterView cluster={activeCluster} onAddPowerUp={handleAddPowerUp} onChangeClient={handleChangeClient} />
        ) : (
          <div className="flex-1 flex items-center justify-center h-full text-gray-400 text-sm">
            Select or create a cluster to get started.
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
