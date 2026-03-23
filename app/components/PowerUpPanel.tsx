"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { X } from "lucide-react";
import { toolApi } from "../../lib/api/toolApi";
import { useAppDispatch } from "../../lib/hooks";
import { upsertTool } from "../../lib/features/toolsSlice";

const EMBED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI1NTkzIiwicHJvamVjdF9pZCI6InByb2o5TGZRdjRUNyIsInVzZXJfaWQiOiI2MTg5MCIsImlhdCI6MTc3NDAxMDI3M30.rhl0-Hfq5k9SAH3Zali9qdNl7s-EWKvxkVsL3Xaq5Qs";
const EMBED_PARENT_ID = "viasocketParentId";
const USER_ID = "61890";


interface PowerUpPanelProps {
  onClose: () => void;
  onSelect: (app: { id: string; name: string }) => void;
}

async function callMcpToolApi(data: Record<string, unknown>, mcpServerId: string) {
  const res = await toolApi.callTool({
    userId: USER_ID,
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
  const scriptLoaded = useRef(false);

  useEffect(() => {
    async function handleMessage(e: MessageEvent) {
      if (!e.data?.webhookurl) return;
      const action = e.data?.action;
      if (
        action === "published" ||
        action === "paused" ||
        action === "created" ||
        action === "updated" ||
        action === "deleted"
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

  useEffect(() => {
    if (scriptLoaded.current) return;
    const existing = document.getElementById(process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID!);
    if (existing) existing.parentNode?.removeChild(existing);
    const existingContainer = document.getElementById("iframe-viasocket-embed-parent-container");
    if (existingContainer) existingContainer.parentNode?.removeChild(existingContainer);
    const script = document.createElement("script");
    script.id = process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID!;
    script.src = process.env.NEXT_PUBLIC_EMBED_SCRIPT_SRC!;
    script.setAttribute("embedToken", EMBED_TOKEN);
    script.setAttribute("parentId", EMBED_PARENT_ID);
    document.body.appendChild(script);
    scriptLoaded.current = true;
    return () => {
      try {
        const s = document.getElementById(process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID!);
        if (s?.parentNode === document.body) document.body.removeChild(s);
        const container = document.getElementById("iframe-viasocket-embed-parent-container");
        if (container) container.parentNode?.removeChild(container);
      } catch (e) {
        console.warn("Error removing embed script:", e);
      }
      scriptLoaded.current = false;
    };
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden" style={{ background: "rgb(255,255,255)", border: "1px solid rgb(226,232,240)", borderRadius: 6, boxShadow: "rgba(0,0,0,0.04) 0px 1px 3px" }}>
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-4"
        style={{ height: 44, borderBottom: "1px solid rgb(226,232,240)", background: "rgb(250,251,252)" }}
      >
        <span style={{ color: "rgb(10,10,10)", fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "-0.01em" }}></span>
        <button
          onClick={onClose}
          className="flex items-center justify-center cursor-pointer"
          style={{ background: "transparent", color: "rgb(148,163,184)", border: "none", boxShadow: "none", padding: 6, borderRadius: 4 }}
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
