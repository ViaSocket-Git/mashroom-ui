"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { X } from "lucide-react";
import { toolApi } from "../../lib/api/toolApi";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { upsertTool, removeTool } from "../../lib/features/toolsSlice";
import { fetchEmbedToken } from "../../lib/features/clustersSlice";

const EMBED_PARENT_ID = "viasocketParentId";


interface PowerUpPanelProps {
  onClose: () => void;
  onSelect: (app: { id: string; name: string }) => void;
}

async function callMcpToolApi(data: Record<string, unknown>, mcpServerId: string) {
  const res = await toolApi.callTool({
    flowId: (data.id as string) ?? "",
    payload: { body: {} },
    desc: (data.description as string) || (data.title as string) || "",
    status: (data.action as string) ?? (data.status as string) ?? "active",
    title: (data.title as string) ?? "",
    mcpServerId,
  });
  return res.data;
}

export default function PowerUpPanel({ onClose }: Omit<PowerUpPanelProps, "onSelect"> & { onSelect?: PowerUpPanelProps["onSelect"] }) {
  const params = useParams();
  const mcpServerId = typeof params.id === "string" ? params.id : (params.id?.[0] ?? "");
  const dispatch = useAppDispatch();
  const embedToken = useAppSelector((s) => s.clusters.embedTokenByClusterId[mcpServerId] ?? null);

  useEffect(() => {
    if (!embedToken) dispatch(fetchEmbedToken(mcpServerId));
  }, [mcpServerId, embedToken, dispatch]);

  useEffect(() => {
    async function handleMessage(e: MessageEvent) {
      if (!e.data?.webhookurl) return;
      const action = e.data?.action;
      if (action === "deleted") {
        const flowId = (e.data.id as string) ?? "";
        try {
          await toolApi.deleteTool(flowId);
          dispatch(removeTool({ mcpServerId, toolId: flowId }));
        } catch (err) {
          console.error("[PowerUpPanel] delete tool error:", err);
        }
      } else if (
        action === "published" ||
        action === "paused" ||
        action === "created" ||
        action === "updated"
      ) {
        try {
          const response = await callMcpToolApi(e.data, mcpServerId);
          if (response?.data) {
            dispatch(upsertTool(response.data));
          }
        } catch (err) {
          console.error("[PowerUpPanel] MCP tool API error:", err);
        }
      }
    }

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [mcpServerId, dispatch]);

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-card border border-border rounded-md shadow-sm">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 h-11 border-b border-border bg-muted/50">
        <span className="text-foreground font-semibold text-[13px] tracking-[-0.01em]" style={{ fontFamily: "Geist, sans-serif" }}></span>
        <button
          onClick={onClose}
          className="flex items-center justify-center cursor-pointer bg-transparent text-muted-foreground border-0 shadow-none p-1.5 rounded"
        >
          <X width={18} height={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Embed content */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div id={EMBED_PARENT_ID} className="flex-1 min-h-0 w-full" />
      </div>
    </div>
  );
}
