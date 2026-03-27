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
  const tools = useAppSelector((s) => s.tools.byMcpServerId[id] ?? []);
  const hideSidebar = clusters.length === 1 && tools.length === 0;

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

  const [targetClusterId, setTargetClusterId] = useState<string | null>(null);

  function handleChangeClient(clusterId?: string) {
    setTargetClusterId(clusterId ?? cluster?.id ?? null);
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
    } else if (modalMode === "addPowerUp" && cluster) {
      dispatch(addPowerUp({
        clusterId: cluster.id,
        powerUp: { id: `pu-${Date.now()}`, name: `${client.title} Power-Up`, description: `Connected to ${client.title}` },
      }));
    }
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "rgb(248,249,251)" }}>
      {!hideSidebar && (
        <Sidebar
          clusters={clusters}
          activeClusterId={id}
          onSelectCluster={(clusterId) => {
            dispatch(setActiveCluster(clusterId));
            router.push(`/cluster/${clusterId}`);
          }}
          onNewCluster={handleNewCluster}
          onChangeClient={(clusterId) => handleChangeClient(clusterId)}
        />
      )}

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
          <div className="flex flex-col h-screen overflow-hidden" style={{ background: "rgb(248,249,251)" }}>
            {/* Header skeleton */}
            <div className="shrink-0 px-6" style={{ background: "rgb(255,255,255)", borderBottom: "1px solid rgb(226,232,240)", height: 64, display: "flex", alignItems: "center" }}>
              <div style={{ width: 180, height: 22, borderRadius: 6, background: "rgb(226,232,240)", animation: "pulse 1.4s ease-in-out infinite" }} />
            </div>
            {/* Content skeleton */}
            <div className="flex-1 px-4 pt-4 pb-3 flex justify-center">
              <div className="w-full flex flex-col gap-4" style={{ maxWidth: 1100 }}>
                {/* Client card skeleton */}
                <div style={{ background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", borderRadius: 6, height: 64, animation: "pulse 1.4s ease-in-out infinite" }} />
                {/* Tools area skeleton */}
                <div style={{ background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", borderRadius: 8, padding: "12px" }}>
                  <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ height: 58, borderRadius: 4, background: "rgb(243,244,246)", animation: "pulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.08}s` }} />
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
