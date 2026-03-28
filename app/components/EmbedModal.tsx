"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { fetchEmbedToken } from "../../lib/features/clustersSlice";

interface EmbedModalProps {
  open: boolean;
  onClose: () => void;
  clusterId: string;
  pendingFlowId?: string | null;
}

export default function EmbedModal({ open, onClose, clusterId, pendingFlowId }: EmbedModalProps) {
  const dispatch = useAppDispatch();
  const embedToken = useAppSelector((s) => s.clusters.embedTokenByClusterId[clusterId] ?? null);
  const embedScriptLoaded = useRef(false);

  useEffect(() => {
    if (!embedToken) dispatch(fetchEmbedToken(clusterId));
  }, [clusterId, embedToken, dispatch]);

  useEffect(() => {
    if (!open || !pendingFlowId || !embedToken) return;
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "send_embed_data") {
        if ((window as any).openViasocket) {
          (window as any).openViasocket(pendingFlowId, { embedToken });
        }
        window.removeEventListener("message", handleMessage);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [open, pendingFlowId, embedToken]);

  useEffect(() => {
    if (!open || !embedToken || embedScriptLoaded.current) return;

    const existing = document.getElementById(process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID!);
    if (existing) existing.parentNode?.removeChild(existing);
    const existingContainer = document.getElementById("iframe-viasocket-embed-parent-container");
    if (existingContainer) existingContainer.parentNode?.removeChild(existingContainer);

    const script = document.createElement("script");
    script.id = process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID!;
    script.src = process.env.NEXT_PUBLIC_EMBED_SCRIPT_SRC!;
    script.setAttribute("embedToken", embedToken);
    script.setAttribute("parentId", "viasocketParentId");
    document.body.appendChild(script);
    embedScriptLoaded.current = true;

    return () => {
      try {
        const s = document.getElementById(process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID!);
        if (s?.parentNode === document.body) document.body.removeChild(s);
        const container = document.getElementById("iframe-viasocket-embed-parent-container");
        if (container) container.parentNode?.removeChild(container);
      } catch (e) {
        console.warn("EmbedModal cleanup error:", e);
      }
      embedScriptLoaded.current = false;
    };
  }, [open, embedToken]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: "70vw",
          maxWidth: 900,
          height: "80vh",
          background: "rgb(255,255,255)",
          border: "1px solid rgb(226,232,240)",
          borderRadius: 4,
          boxShadow: "rgba(0,0,0,0.25) 0px 25px 60px -12px, rgba(0,0,0,0.1) 0px 8px 24px",
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-4 shrink-0 flex items-center justify-center relative"
          style={{ borderBottom: "1px solid rgb(226,232,240)", background: "rgb(255,255,255)" }}
        >
          {/* Close button — absolute right */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button
              onClick={onClose}
              className="flex items-center gap-2 cursor-pointer"
              style={{ background: "transparent", color: "rgb(148,163,184)", border: "none", padding: 8, borderRadius: 4 }}
            >
              <X width={22} height={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Embed mounts here */}
        <div id="viasocketParentId" className="flex-1 min-h-0 w-full" />
      </div>
    </div>
  );
}
