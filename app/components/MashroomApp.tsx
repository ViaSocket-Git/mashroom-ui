"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import ClusterView from "./ClusterView";
import AIClientModal from "./AIClientModal";

interface PowerUp {
  id: string;
  name: string;
  description: string;
}

interface Cluster {
  id: string;
  name: string;
  client: string;
  clientColor: string;
  powerUps: PowerUp[];
}

const INITIAL_CLUSTERS: Cluster[] = [
  {
    id: "cluster-1",
    name: "Cluster 1",
    client: "Claude",
    clientColor: "#D97757",
    powerUps: [],
  },
  {
    id: "cluster-2",
    name: "Cluster 2",
    client: "Windsurf",
    clientColor: "#4F6AF5",
    powerUps: [],
  },
  {
    id: "cluster-3",
    name: "Cluster 3",
    client: "ChatGPT",
    clientColor: "#10A37F",
    powerUps: [],
  },
];

let clusterCounter = 4;

export default function MashroomApp() {
  const [clusters, setClusters] = useState<Cluster[]>(INITIAL_CLUSTERS);
  const [activeClusterId, setActiveClusterId] = useState<string>("cluster-1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"newCluster" | "addPowerUp">("newCluster");

  const activeCluster = clusters.find((c) => c.id === activeClusterId) ?? null;

  function handleNewCluster() {
    setModalMode("newCluster");
    setIsModalOpen(true);
  }

  function handleAddPowerUp() {
    setModalMode("addPowerUp");
    setIsModalOpen(true);
  }

  function handleClientSelect(client: { id: string; name: string; color: string; icon: string }) {
    if (modalMode === "newCluster") {
      const newCluster: Cluster = {
        id: `cluster-${clusterCounter++}`,
        name: `Cluster ${clusterCounter - 1}`,
        client: client.name,
        clientColor: client.color,
        powerUps: [],
      };
      setClusters((prev) => [...prev, newCluster]);
      setActiveClusterId(newCluster.id);
    } else if (modalMode === "addPowerUp" && activeCluster) {
      const newPowerUp: PowerUp = {
        id: `pu-${Date.now()}`,
        name: `${client.name} Power-Up`,
        description: `Connected to ${client.name}`,
      };
      setClusters((prev) =>
        prev.map((c) =>
          c.id === activeCluster.id
            ? { ...c, powerUps: [...c.powerUps, newPowerUp] }
            : c
        )
      );
    }
    setIsModalOpen(false);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        clusters={clusters}
        activeClusterId={activeClusterId}
        onSelectCluster={setActiveClusterId}
        onNewCluster={handleNewCluster}
      />

      <main className="flex-1 relative overflow-hidden">
        {activeCluster ? (
          <ClusterView cluster={activeCluster} onAddPowerUp={handleAddPowerUp} />
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
