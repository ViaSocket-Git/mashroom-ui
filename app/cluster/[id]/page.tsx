"use client";

export const runtime = "edge";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateClusterClient, addPowerUp, setClusterSelectedClient, fetchClusters, fetchEmbedToken, updateClusterOnServer, fetchCurrentUser } from "@/lib/features/clustersSlice";
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
  const clustersFetched = useAppSelector((s) => s.clusters.clustersFetched);
  const [hasFetched, setHasFetched] = useState(clustersFetched);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"newCluster" | "addPowerUp" | "changeClient">("newCluster");
  const fetchedForId = useRef<string | null>(null);

  useEffect(() => {
    if (clustersFetched) { setHasFetched(true); return; }
    const init = async () => {
      dispatch(fetchCurrentUser());
      await dispatch(fetchAiClients());
      await dispatch(fetchClusters());
      setHasFetched(true);
    };
    init();
  }, [dispatch]);


  const id = typeof params.id === "string" ? params.id : (params.id?.[0] ?? "");

  const clusters = useAppSelector((s) => s.clusters.clusters);
  const tools = useAppSelector((s) => s.tools.byMcpServerId[id] ?? []);
  const hideSidebar = clusters.length === 1 && tools.length === 0;

  const cluster = clusters.find((c) => c.id === id) ?? null;

  useEffect(() => {
    if (!id || !cluster) return;
    if (fetchedForId.current === id) return;
    fetchedForId.current = id;
    dispatch(fetchEmbedToken(id)).then(() => {
      dispatch(fetchTools({ mcpServerId: id }));
    });
  }, [id, cluster, dispatch]);

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

  if (!hasFetched) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: "rgb(248,249,251)" }}>
        <style>{`
          @keyframes mushroom-bob {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes shadow-pulse {
            0%, 100% { transform: scaleX(1); opacity: 0.25; }
            50% { transform: scaleX(0.6); opacity: 0.1; }
          }
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
      {!hideSidebar && (
        <Sidebar
          clusters={clusters}
          activeClusterId={id}
          onSelectCluster={(clusterId) => {
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
            hideSidebar={hideSidebar}
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
