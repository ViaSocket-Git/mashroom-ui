"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActiveCluster, updateClusterClient, addPowerUp, setClusterSelectedClient } from "@/lib/features/clustersSlice";
import type { AiClient } from "@/lib/features/aiClientsSlice";
import { fetchTools } from "@/lib/features/toolsSlice";
import ClusterView from "@/app/components/ClusterView";
import Sidebar from "@/app/components/Sidebar";
import AIClientModal from "@/app/components/AIClientModal";
import { useState } from "react";
import { createCluster } from "@/lib/features/clustersSlice";

export default function ClusterPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const id = typeof params.id === "string" ? params.id : (params.id?.[0] ?? "");

  const clusters = useAppSelector((s) => s.clusters.clusters);
  const activeClusterId = useAppSelector((s) => s.clusters.activeClusterId);
  const loading = useAppSelector((s) => s.clusters.loading);
   
  const cluster = clusters.find((c) => c._id === id) ?? null;
  console.log("cluster", cluster);
  console.log(clusters,"cluster")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"newCluster" | "addPowerUp" | "changeClient">("newCluster");

  useEffect(() => {
    if (id && id !== activeClusterId) {
      dispatch(setActiveCluster(id));
    }
  }, [id, activeClusterId, dispatch]);

  useEffect(() => {
    console.log("Fetching tools for cluster:", id);
    if (id) {
      dispatch(fetchTools({ mcpServerId: id, projectId: "" }));
    }
  }, [id, dispatch]);

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
      dispatch(createCluster({ client: client.title, clientColor }));
    } else if (modalMode === "changeClient" && cluster) {
      dispatch(updateClusterClient({ clusterId: cluster._id, client: client.title, clientColor }));
      dispatch(setClusterSelectedClient({ clusterId: cluster._id, client }));
    } else if (modalMode === "addPowerUp" && cluster) {
      dispatch(addPowerUp({
        clusterId: cluster._id,
        powerUp: { id: `pu-${Date.now()}`, name: `${client.title} Power-Up`, description: `Connected to ${client.title}` },
      }));
    }
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "rgb(248,249,251)" }}>
      <Sidebar
        clusters={clusters}
        activeClusterId={id}
        onSelectCluster={(clusterId) => {
          dispatch(setActiveCluster(clusterId));
          router.push(`/cluster/${clusterId}`);
        }}
        onNewCluster={handleNewCluster}
      />

      <main className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute top-4 right-4 z-10 text-xs px-3 py-1.5 rounded" style={{ background: "rgb(243,244,246)", color: "rgb(100,116,139)", fontFamily: "Geist, sans-serif" }}>
            Creating cluster…
          </div>
        )}
        {cluster ? (
          <ClusterView
            cluster={cluster}
            onAddPowerUp={handleAddPowerUp}
            onChangeClient={handleChangeClient}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center h-full text-gray-400 text-sm">
            Cluster not found.
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
