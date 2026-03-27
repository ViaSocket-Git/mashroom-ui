"use client";

export const runtime = "edge";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActiveCluster, updateClusterClient, addPowerUp, setClusterSelectedClient, fetchClusters, fetchEmbedToken, updateClusterOnServer, fetchCurrentUser } from "@/lib/features/clustersSlice";
import { fetchAiClients, type AiClient } from "@/lib/features/aiClientsSlice";
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
  useEffect(() => {
    const init = async () => {
      dispatch(fetchCurrentUser());
      await dispatch(fetchAiClients());
      dispatch(fetchClusters());
    };
    init();
  }, [dispatch]);


  const id = typeof params.id === "string" ? params.id : (params.id?.[0] ?? "");

  const clusters = useAppSelector((s) => s.clusters.clusters);
  const activeClusterId = useAppSelector((s) => s.clusters.activeClusterId);
  const loading = useAppSelector((s) => s.clusters.loading);

  const cluster = clusters.find((c) => c.id === id) ?? null;

  const [wasLoading, setWasLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(!!cluster);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"newCluster" | "addPowerUp" | "changeClient">("newCluster");

  useEffect(() => {
    if (cluster) { setHasFetched(true); return; }
    if (loading) setWasLoading(true);
    if (!loading && wasLoading) setHasFetched(true);
  }, [loading, wasLoading, cluster]);

  useEffect(() => {
    if (id && id !== activeClusterId) {
      dispatch(setActiveCluster(id));
    }
  }, [id, activeClusterId, dispatch]);

  useEffect(() => {
    if (!id || !cluster) return;
    dispatch(fetchEmbedToken(id)).then(() => {
      dispatch(fetchTools({ mcpServerId: id }));
    });
  }, [id, cluster?.projectId, dispatch]);

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
    } else if (modalMode === "changeClient" && cluster) {
      dispatch(updateClusterClient({ clusterId: cluster.id, client: client.title, clientColor }));
      dispatch(setClusterSelectedClient({ clusterId: cluster.id, client }));
      dispatch(updateClusterOnServer({ mcpServerId: cluster.id, name: cluster.name, client: client.title }));
    } else if (modalMode === "addPowerUp" && cluster) {
      dispatch(addPowerUp({
        clusterId: cluster.id,
        powerUp: { id: `pu-${Date.now()}`, name: `${client.title} Power-Up`, description: `Connected to ${client.title}` },
      }));
    }
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen flex bg-background">
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
        {cluster ? (
          <ClusterView
            cluster={cluster}
            onAddPowerUp={handleAddPowerUp}
            onChangeClient={handleChangeClient}
          />
        ) : hasFetched ? (
          <div className="flex-1 flex items-center justify-center h-full text-gray-400 text-sm">
            Cluster not found.
          </div>
        ) : (
          <div className="flex flex-col h-screen overflow-hidden bg-background">
            {/* Header skeleton */}
            <div className="shrink-0 px-6 bg-card border-b border-border flex items-center" style={{ height: 64 }}>
              <div className="bg-muted rounded-md" style={{ width: 180, height: 22, animation: "pulse 1.4s ease-in-out infinite" }} />
            </div>
            {/* Content skeleton */}
            <div className="flex-1 px-4 pt-4 pb-3 flex justify-center">
              <div className="w-full flex flex-col gap-4" style={{ maxWidth: 1100 }}>
                {/* Client card skeleton */}
                <div className="bg-card border border-border rounded-md" style={{ height: 64, animation: "pulse 1.4s ease-in-out infinite" }} />
                {/* Tools area skeleton */}
                <div className="bg-card border border-border rounded-lg" style={{ padding: "12px" }}>
                  <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-muted rounded" style={{ height: 58, animation: "pulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.08}s` }} />
                    ))}
                  </div>
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
